"""Merger-disclosure classification and event price records."""

from ..constants import (
    MERGER_APPLICATION_TOKENS,
    MERGER_CANCEL_TOKENS,
    MERGER_CONFIRMATION_TOKENS,
    MERGER_IGNORE_TOKENS,
)
from ..parsing import normalize_disclosure_title, parse_date


def normalize_merger_status(value):
    text = str(value or "").strip().lower()
    if not text:
        return None
    if text in ("합병 확정", "확정", "confirmed", "approval", "approved"):
        return "합병 확정"
    if text in ("합병 신청", "신청", "합병 진행", "진행", "application", "applied"):
        return "합병 신청"
    if "확정" in text or "승인" in text:
        return "합병 확정"
    if "합병" in text:
        return "합병 신청"
    return None


def classify_merger_disclosures(disclosures):
    status = None
    application = None
    confirmation = None
    cancellation = None
    matched = []

    def sort_key(item):
        date_text = str(item.get("date") or "")
        title = normalize_disclosure_title(item.get("title"))
        is_date_only = len(date_text) <= 10
        cancel_order = 2 if is_date_only and any(token in title for token in MERGER_CANCEL_TOKENS) else 0
        return (date_text[:10], "" if is_date_only else date_text, cancel_order)

    for disclosure in sorted(disclosures or [], key=sort_key):
        title = normalize_disclosure_title(disclosure.get("title"))
        if not title or any(token in title for token in MERGER_IGNORE_TOKENS):
            continue
        if any(token in title for token in MERGER_CANCEL_TOKENS):
            status = None
            cancellation = disclosure
            matched.append({**disclosure, "mergerSignal": "canceled"})
            continue
        if any(token in title for token in MERGER_CONFIRMATION_TOKENS):
            status = "합병 확정"
            confirmation = disclosure
            matched.append({**disclosure, "mergerSignal": "confirmed"})
            continue
        if any(token in title for token in MERGER_APPLICATION_TOKENS):
            if status != "합병 확정":
                status = "합병 신청"
            application = disclosure
            matched.append({**disclosure, "mergerSignal": "applied"})
    return {
        "status": status,
        "application": application,
        "confirmation": confirmation,
        "cancellation": cancellation,
        "matched": matched,
    }


def merge_merger_price_records(existing, fetched):
    merged = {}
    for record in list(existing or []) + list(fetched or []):
        date_value = record.get("date")
        signal = record.get("signal")
        if not date_value or not signal:
            continue
        key = (date_value, signal, record.get("title") or record.get("disclosureTitle") or "")
        merged[key] = record
    return sorted(merged.values(), key=lambda record: record.get("date") or "")


def build_merger_price_records(disclosures, history_points):
    from .valuation import pct_change

    points = [
        {
            **point,
            "parsedDate": parse_date(point.get("date")),
        }
        for point in history_points
        if point.get("date") and point.get("close")
    ]
    points = [point for point in points if point["parsedDate"]]
    points.sort(key=lambda point: point["parsedDate"])
    if not points:
        return []

    records = []
    seen_events = set()
    signal_labels = {
        "applied": "합병 신청",
        "confirmed": "합병 확정",
        "canceled": "합병 철회",
    }
    for disclosure in disclosures or []:
        signal = disclosure.get("mergerSignal")
        event_date = parse_date(str(disclosure.get("date") or "")[:10])
        if signal not in signal_labels or not event_date:
            continue
        event_key = (event_date.isoformat(), signal)
        if event_key in seen_events:
            continue
        seen_events.add(event_key)

        before_or_same = [point for point in points if point["parsedDate"] <= event_date]
        after = [point for point in points if point["parsedDate"] > event_date]
        base = before_or_same[-1] if before_or_same else None
        next_point = after[0] if after else None
        latest = points[-1]
        high = max(after, key=lambda point: point["close"], default=None)
        low = min(after, key=lambda point: point["close"], default=None)
        base_close = base.get("close") if base else None

        records.append(
            {
                "date": event_date.isoformat(),
                "label": signal_labels[signal],
                "signal": signal,
                "title": disclosure.get("title"),
                "source": disclosure.get("source"),
                "url": disclosure.get("url"),
                "baseDate": base.get("date") if base else None,
                "basePrice": base_close,
                "baseRatio": base.get("ratio") if base else None,
                "nextDate": next_point.get("date") if next_point else None,
                "nextPrice": next_point.get("close") if next_point else None,
                "nextReturnPct": pct_change(base_close, next_point.get("close") if next_point else None),
                "latestDate": latest.get("date"),
                "latestPrice": latest.get("close"),
                "latestReturnPct": pct_change(base_close, latest.get("close")),
                "highDate": high.get("date") if high else None,
                "highPrice": high.get("close") if high else None,
                "highReturnPct": pct_change(base_close, high.get("close") if high else None),
                "lowDate": low.get("date") if low else None,
                "lowPrice": low.get("close") if low else None,
                "lowReturnPct": pct_change(base_close, low.get("close") if low else None),
                "observedTradingDays": len(after),
            }
        )
    return sorted(records, key=lambda record: record["date"])
