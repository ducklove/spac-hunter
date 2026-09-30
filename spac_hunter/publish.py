"""Value Compass hub summary: ``summary.json`` + ``version.json`` (envelope v1).

The hub (value-invest) used to download the 3.8 MB ``data.json`` to read about
fifteen fields per SPAC. This module publishes just those fields, plus the
accrued liquidation value and discount the hub's ``services/portfolio/spac.py``
recomputes today, in the shared envelope (value-invest
``docs/ecosystem/data-contract.md`` §6.3). ``vc_publish.py`` next to this file is
vendored from the hub by ``scripts/sync-ecosystem.mjs`` — never edit it here.

No-op rule: ``asOf`` is the latest trading date in the data (not the run time),
and an otherwise identical summary keeps the previous ``lastUpdated`` so a rerun
without new data leaves both files untouched.
"""

import json
import logging
import math
from datetime import date
from pathlib import Path

from . import vc_publish
from .domain.valuation import liquidation_discount_pct, liquidation_value_at_date
from .parsing import parse_date

logger = logging.getLogger(__name__)

TOOL_ID = "spac-hunter"
SUMMARY_FILENAME = "summary.json"
VERSION_FILENAME = "version.json"
SOURCES = (
    {"id": "krx", "name": "KRX"},
    {"id": "kind", "name": "KIND", "url": "https://kind.krx.co.kr/"},
    {"id": "opendart", "name": "OpenDART", "url": "https://opendart.fss.or.kr/"},
    {"id": "naver", "name": "네이버 증권", "url": "https://finance.naver.com/"},
)
SUMMARY_KEYS = ("totalCount", "belowIpoCount", "averageRatio", "averageAnnualizedReturn")
ASSUMPTION_KEYS = ("trustFeePct", "interestTaxPct", "payoutLagDays")


def _num(value):
    """Finite number or None (the contract never publishes NaN/Infinity or '' for unknowns)."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(number):
        return None
    return int(number) if number.is_integer() and abs(number) < 2**53 else number


def _int(value):
    number = _num(value)
    return number if isinstance(number, int) else None


def _date_text(value):
    parsed = parse_date(value)
    return parsed.isoformat() if parsed else None


def _round(value, digits=2):
    return round(value, digits) if value is not None else None


def summary_as_of(payload, fallback=None):
    """Data date: the latest daily close across all SPACs (KST trading date).

    Falls back to the ``generatedAt`` date, then ``fallback``. Never the wall
    clock, so reruns on the same data compare equal.
    """
    latest = None
    for spac in payload.get("spacs") or []:
        for point in reversed(spac.get("history") or []):
            day = parse_date(point.get("date"))
            if day is not None:
                latest = day if latest is None or day > latest else latest
                break
    if latest is None:
        generated = str(payload.get("generatedAt") or "")[:10]
        latest = parse_date(generated) or fallback
    return latest


def _escrow_periods(spac):
    periods = []
    for period in spac.get("escrowRatePeriods") or []:
        if not isinstance(period, dict):
            continue
        periods.append(
            {"startDate": _date_text(period.get("startDate")), "ratePct": _num(period.get("ratePct"))}
        )
    return periods


def _valuation_basis(spac):
    basis = spac.get("valuationBasis") or {}
    anchor = basis.get("anchor") or None
    anchor_date = _date_text(anchor.get("date")) if isinstance(anchor, dict) else None
    return {
        "trustStartDate": _date_text(basis.get("trustStartDate")),
        "trustFeePct": _num(basis.get("trustFeePct")),
        "interestTaxPct": _num(basis.get("interestTaxPct")),
        "rolloverMonths": _int(basis.get("rolloverMonths")),
        "anchor": (
            {"date": anchor_date, "valuePerShare": _num(anchor.get("valuePerShare"))} if anchor_date else None
        ),
    }


def build_summary_data(payload, as_of):
    """The ``data`` block of summary.json (contract §6.3) from a data.js payload."""
    assumptions = payload.get("valuationAssumptions") or {}
    spacs = []
    for spac in payload.get("spacs") or []:
        code = str(spac.get("code") or "").upper()
        if not code:
            continue
        price = _num(spac.get("currentPrice"))
        value = liquidation_value_at_date(spac, as_of, assumptions) if as_of else None
        spacs.append(
            {
                "code": code,
                "name": spac.get("name") or code,
                "currentPrice": price,
                "ipoPrice": _num(spac.get("ipoPrice")),
                "ratio": _num(spac.get("ratio")),
                "annualizedReturn": _num(spac.get("annualizedReturn")),
                "status": spac.get("status"),
                "mergerStatus": spac.get("mergerStatus"),
                "listingDate": _date_text(spac.get("listingDate")),
                "liquidationDate": _date_text(spac.get("liquidationDate")),
                "payoutDate": _date_text(spac.get("payoutDate")),
                "liquidationValuePerShare": _num(spac.get("liquidationValuePerShare")),
                # 허브 services/portfolio/spac.py가 계산하던 값을 파이프라인이 직접 발행한다:
                # valuationDate(= asOf) 기준 누적 청산가와 청산가 괴리(%) — 목록의 '청산가 괴리'와 같은 식.
                "currentLiquidationValue": _round(value),
                "liquidationDiscountPct": _round(liquidation_discount_pct(value, price)),
                "escrowRatePeriods": _escrow_periods(spac),
                "valuationBasis": _valuation_basis(spac),
            }
        )
    summary = payload.get("summary") or {}
    return {
        "lastUpdated": payload.get("lastUpdated"),
        "valuationDate": as_of.isoformat() if as_of else None,
        "summary": {key: _num(summary.get(key)) for key in SUMMARY_KEYS},
        "valuationAssumptions": {key: _num(assumptions.get(key)) for key in ASSUMPTION_KEYS},
        "spacs": spacs,
    }


def _read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def _without_last_updated(data):
    return {key: value for key, value in data.items() if key != "lastUpdated"}


def build_summary_envelope(payload, *, as_of=None, generated_at=None, previous=None):
    """Envelope for ``payload``; reuses ``previous`` lastUpdated when nothing else changed."""
    as_of = as_of or summary_as_of(payload)
    if not isinstance(as_of, date):
        raise vc_publish.EnvelopeError("asOf: no data date in payload")
    data = build_summary_data(payload, as_of)
    if (
        isinstance(previous, dict)
        and previous.get("asOf") == as_of.isoformat()
        and isinstance(previous.get("data"), dict)
        and vc_publish.content_hash(_without_last_updated(previous["data"]))
        == vc_publish.content_hash(_without_last_updated(data))
    ):
        # 수집 시각(lastUpdated)만 바뀐 재실행: 이전 값을 유지해 summary.json이 바뀌지 않게 한다.
        data["lastUpdated"] = previous["data"].get("lastUpdated")
    return vc_publish.build_envelope(
        TOOL_ID,
        data,
        as_of=as_of,
        sources=SOURCES,
        generated_at=generated_at,
    )


def publish_summary(payload, summary_path, version_path=None, *, generated_at=None):
    """Write summary.json (+ version.json) only when the content changed.

    Returns True when summary.json was rewritten. Never raises for bad data:
    the pipeline keeps the previous files and logs a warning instead.
    """
    summary_path = Path(summary_path)
    version_path = Path(version_path) if version_path else summary_path.with_name(VERSION_FILENAME)
    try:
        envelope = build_summary_envelope(
            payload, generated_at=generated_at, previous=_read_json(summary_path)
        )
        changed = vc_publish.write_if_changed(summary_path, envelope)
        vc_publish.write_version(version_path, {summary_path.name: envelope}, generated_at=generated_at)
    except (vc_publish.EnvelopeError, OSError, TypeError, ValueError) as exc:
        logger.warning("%s 발행 실패(기존 파일 유지): %s", summary_path.name, exc)
        return False
    return changed


def main(argv=None):
    """Offline rebuild from the committed data.json: ``python -m spac_hunter.publish``."""
    import argparse
    from datetime import datetime

    from .constants import ROOT

    parser = argparse.ArgumentParser(description="Build summary.json/version.json from data.json (offline)")
    parser.add_argument("--data", default=str(ROOT / "data.json"), help="data.json path")
    parser.add_argument("--out", default=str(ROOT / SUMMARY_FILENAME), help="summary.json path")
    args = parser.parse_args(argv)
    payload = json.loads(Path(args.data).read_text(encoding="utf-8"))
    generated = payload.get("generatedAt")
    generated_at = datetime.fromisoformat(generated).replace(microsecond=0) if generated else None
    changed = publish_summary(payload, args.out, generated_at=generated_at)
    print(f"{args.out}: {'written' if changed else 'unchanged'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
