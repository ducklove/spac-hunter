"""Diff-based alerts: build, accumulate (alerts.json), RSS (alerts.xml), Telegram.

``build_alerts`` compares the previous ``data.js`` snapshot with the freshly
built SPAC list. ``write_alert_outputs`` merges by alert id into the existing
``alerts.json``/``alerts.xml`` and returns only the alerts that are new in
this run; ``send_telegram`` optionally pushes those via the Bot API. Live mode
only — sample mode never calls into this module.
"""

import json
import logging
import os
from email.utils import format_datetime
from pathlib import Path
from xml.sax.saxutils import escape

from .constants import ALERTS_FEED_LINK, ALERTS_JSON_PATH, ALERTS_XML_PATH
from .http import shared_session

logger = logging.getLogger(__name__)

MAX_STORED_ALERTS = 500
RSS_MAX_ITEMS = 50
TELEGRAM_MAX_ALERTS = 10
TELEGRAM_API_URL = "https://api.telegram.org/bot{token}/sendMessage"

_MERGER_ALERT_TYPES = {
    "applied": ("merger_applied", "합병 신청 공시"),
    "confirmed": ("merger_confirmed", "합병 확정 공시"),
    "canceled": ("merger_canceled", "합병 철회 공시"),
}


def _generated_date_text(generated_at):
    if hasattr(generated_at, "date"):
        return generated_at.date().isoformat()
    if hasattr(generated_at, "isoformat"):
        return generated_at.isoformat()
    return str(generated_at)[:10]


def _make_alert(date_text, alert_type, code, name, title, detail=None, url=None):
    alert = {
        "id": f"{date_text}|{alert_type}|{code}",
        "date": date_text,
        "type": alert_type,
        "code": code,
        "name": name,
        "title": title,
        "detail": detail,
    }
    if url:
        alert["url"] = url
    return alert


def _record_key(record):
    """Same identity as merge_merger_price_records: (date, signal, title)."""
    return (
        record.get("date"),
        record.get("signal"),
        record.get("title") or record.get("disclosureTitle") or "",
    )


def _merger_record_alerts(prev, spac, name):
    prev_keys = {_record_key(record) for record in (prev or {}).get("mergerPriceRecords") or []}
    alerts = []
    for record in spac.get("mergerPriceRecords") or []:
        mapped = _MERGER_ALERT_TYPES.get(record.get("signal"))
        if not mapped or _record_key(record) in prev_keys:
            continue
        alert_type, label = mapped
        date_text = str(record.get("date") or "")[:10]
        if not date_text:
            continue
        details = []
        if record.get("title"):
            details.append(str(record["title"]))
        if record.get("basePrice"):
            details.append(f"공시일 기준가 {record['basePrice']:,}원")
        if record.get("baseRatio") is not None:
            details.append(f"공모가 대비 {record['baseRatio']:.4f}배")
        alerts.append(
            _make_alert(
                date_text,
                alert_type,
                spac["code"],
                name,
                f"{name} {label}",
                detail=", ".join(details) or None,
                url=record.get("url"),
            )
        )
    return alerts


def _dissolution_alerts(prev, spac, name, generated_date):
    disclosure = spac.get("dissolutionDisclosure")
    if not disclosure or (prev or {}).get("dissolutionDisclosure"):
        return []
    date_text = str(disclosure.get("date") or "")[:10] or generated_date
    return [
        _make_alert(
            date_text,
            "dissolution",
            spac["code"],
            name,
            f"{name} 해산사유 발생 공시",
            detail=disclosure.get("title"),
            url=disclosure.get("url"),
        )
    ]


def _below_ipo_alerts(prev, spac, name, generated_date):
    if prev is None:
        return []
    prev_ratio = prev.get("ratio")
    ratio = spac.get("ratio")
    if prev_ratio is None or ratio is None:
        return []
    entered = prev_ratio >= 1.0 and ratio < 1.0
    exited = prev_ratio < 1.0 and ratio >= 1.0
    if not entered and not exited:
        return []
    detail = f"공모가 대비 {prev_ratio:.4f} → {ratio:.4f}"
    if spac.get("currentPrice"):
        detail += f" (현재가 {spac['currentPrice']:,}원)"
    return [
        _make_alert(
            generated_date,
            "below_ipo_enter" if entered else "below_ipo_exit",
            spac["code"],
            name,
            f"{name} 공모가 이하 진입" if entered else f"{name} 공모가 회복",
            detail=detail,
            url=spac.get("naverUrl"),
        )
    ]


def _near_liquidation_alerts(prev, spac, name, generated_date):
    days = spac.get("daysToLiquidation")
    if days is None or days > 180:
        return []
    if prev is not None:
        prev_days = prev.get("daysToLiquidation")
        if prev_days is None or prev_days <= 180:
            return []
    detail = f"청산예정일 {spac.get('liquidationDate') or '미상'} (D-{days})"
    return [
        _make_alert(
            generated_date,
            "near_liquidation",
            spac["code"],
            name,
            f"{name} 청산 6개월 이내 진입",
            detail=detail,
            url=spac.get("naverUrl"),
        )
    ]


def _new_listing_alert(spac, name, generated_date):
    date_text = str(spac.get("listingDate") or "")[:10] or generated_date
    details = []
    if spac.get("listingDate"):
        details.append(f"상장일 {spac['listingDate']}")
    if spac.get("currentPrice"):
        details.append(f"현재가 {spac['currentPrice']:,}원")
    return _make_alert(
        date_text,
        "new_listing",
        spac["code"],
        name,
        f"{name} 신규 상장",
        detail=", ".join(details) or None,
        url=spac.get("naverUrl"),
    )


def _sort_alerts(alerts):
    """Newest date first; same-date alerts are stably ordered by type, then code."""
    alerts.sort(key=lambda alert: (str(alert.get("type") or ""), str(alert.get("code") or "")))
    alerts.sort(key=lambda alert: str(alert.get("date") or ""), reverse=True)
    return alerts


def build_alerts(previous_spacs, new_spacs, generated_at):
    """Compare the previous data.js spacs (code -> spac) with the new list."""
    previous_spacs = previous_spacs or {}
    generated_date = _generated_date_text(generated_at)
    alerts = []
    for spac in new_spacs or []:
        code = spac.get("code")
        if not code:
            continue
        name = spac.get("name") or code
        prev = previous_spacs.get(code)
        alerts.extend(_merger_record_alerts(prev, spac, name))
        alerts.extend(_dissolution_alerts(prev, spac, name, generated_date))
        alerts.extend(_below_ipo_alerts(prev, spac, name, generated_date))
        alerts.extend(_near_liquidation_alerts(prev, spac, name, generated_date))
        if prev is None:
            alerts.append(_new_listing_alert(spac, name, generated_date))
    unique = {}
    for alert in alerts:
        unique.setdefault(alert["id"], alert)
    return _sort_alerts(list(unique.values()))


def load_existing_alerts(path=None):
    path = Path(path) if path else ALERTS_JSON_PATH
    if not path.exists():
        return []
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []
    alerts = payload.get("alerts") if isinstance(payload, dict) else None
    return [alert for alert in alerts or [] if isinstance(alert, dict) and alert.get("id")]


def _render_rss(alerts, generated_at, link=ALERTS_FEED_LINK):
    pub_date = format_datetime(generated_at)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "<channel>",
        f"<title>{escape('스팩 헌터 알림')}</title>",
        f"<link>{escape(link)}</link>",
        f"<description>{escape('한국 스팩 합병·해산·청산·가격 이벤트 알림 피드')}</description>",
        f"<lastBuildDate>{escape(pub_date)}</lastBuildDate>",
    ]
    for alert in alerts[:RSS_MAX_ITEMS]:
        description = alert.get("detail") or alert.get("title") or ""
        lines.extend(
            [
                "<item>",
                f"<title>{escape(str(alert.get('title') or ''))}</title>",
                f"<description>{escape(str(description))}</description>",
                f"<link>{escape(str(alert.get('url') or link))}</link>",
                f'<guid isPermaLink="false">{escape(str(alert.get("id") or ""))}</guid>',
                f"<pubDate>{escape(pub_date)}</pubDate>",
                "</item>",
            ]
        )
    lines.extend(["</channel>", "</rss>"])
    return "\n".join(lines) + "\n"


def write_alert_outputs(new_alerts, generated_at, json_path=None, xml_path=None):
    """Merge into alerts.json/alerts.xml and return only this run's fresh alerts."""
    json_path = Path(json_path) if json_path else ALERTS_JSON_PATH
    xml_path = Path(xml_path) if xml_path else ALERTS_XML_PATH
    existing = load_existing_alerts(json_path)
    known_ids = {alert["id"] for alert in existing}
    fresh = [alert for alert in new_alerts or [] if alert.get("id") not in known_ids]
    merged = _sort_alerts(existing + fresh)[:MAX_STORED_ALERTS]
    json_path.write_text(
        json.dumps(
            {"generatedAt": generated_at.isoformat(), "alerts": merged},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    xml_path.write_text(_render_rss(merged, generated_at), encoding="utf-8")
    return fresh


def send_telegram(new_alerts):
    """Send at most one summary message for this run's fresh alerts.

    Active only when both TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set.
    Never raises: any failure is logged as a warning and swallowed.
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        return False
    new_alerts = list(new_alerts or [])
    if not new_alerts:
        return False
    lines = [f"[스팩 헌터] 새 알림 {len(new_alerts)}건"]
    for alert in new_alerts[:TELEGRAM_MAX_ALERTS]:
        line = f"- {alert.get('date')} {alert.get('title')}"
        if alert.get("detail"):
            line += f" | {alert['detail']}"
        lines.append(line)
    if len(new_alerts) > TELEGRAM_MAX_ALERTS:
        lines.append(f"... 외 {len(new_alerts) - TELEGRAM_MAX_ALERTS}건")
    try:
        response = shared_session().post(
            TELEGRAM_API_URL.format(token=token),
            data={
                "chat_id": chat_id,
                "text": "\n".join(lines),
                "disable_web_page_preview": "true",
            },
            timeout=15,
        )
        response.raise_for_status()
        return True
    except Exception as exc:  # noqa: BLE001
        logger.warning("Telegram 알림 발송 실패(파이프라인은 계속 진행): %s", exc)
        return False
