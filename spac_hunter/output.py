"""Reading existing outputs, the write guard, and payload serialization."""

import json
import logging
import sys
from datetime import timedelta
from pathlib import Path

from .constants import (
    CURRENT_JSON_PATH,
    DART_MAIN_URL,
    DATA_JS_PATH,
    HISTORY_MAX_AGE_DAYS,
    KIND_CORP_LIST_PAGE_URL,
    KIND_DISCLOSURE_PAGE_URL,
    KOFR_MAIN_URL,
    OVERRIDES_PATH,
    SCHEMA_VERSION,
)
from .parsing import normalize_name, parse_int, today_kst
from .stats import build_merger_cases, build_statistics, build_summary

logger = logging.getLogger(__name__)

DATA_JS_PREFIX = "window.SPAC_DATA = "

# Write-guard thresholds protecting data.js from accidental truncation.
GUARD_MIN_EXISTING_COUNT = 10
GUARD_MIN_KEEP_RATIO = 0.7
GUARD_MIN_PRICE_COVERAGE = 0.5


def load_overrides(path=None):
    path = Path(path) if path else OVERRIDES_PATH
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_existing_payload(path=None):
    """Parse the previous data.js payload ({} when missing or unparseable)."""
    path = Path(path) if path else DATA_JS_PATH
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8")
    if not text.startswith(DATA_JS_PREFIX):
        return {}
    text = text[len(DATA_JS_PREFIX) :].strip()
    if text.endswith(";"):
        text = text[:-1]
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return {}
    return payload if isinstance(payload, dict) else {}


def load_existing_spacs(path=None):
    payload = load_existing_payload(path)
    return {spac.get("code"): spac for spac in payload.get("spacs", []) if spac.get("code")}


def load_existing_last_updated(path=None):
    """The previous payload's human-readable lastUpdated string (None when absent)."""
    return load_existing_payload(path).get("lastUpdated") or None


def existing_kind_companies(existing_spacs):
    companies = {}
    for spac in existing_spacs.values():
        name = spac.get("name")
        if not name:
            continue
        kind_info = dict(spac.get("kind") or {})
        if spac.get("listingDate") and not kind_info.get("listingDate"):
            kind_info["listingDate"] = spac["listingDate"]
        if kind_info:
            companies[normalize_name(name)] = kind_info
    return companies


def merge_history_points(existing, fetched, today=None, max_age_days=HISTORY_MAX_AGE_DAYS):
    """Merge history points by date, dropping points older than the 3-year cap."""
    today = today or today_kst()
    cutoff = (today - timedelta(days=max_age_days)).isoformat()
    merged = {}
    for point in list(existing or []) + list(fetched or []):
        date_value = point.get("date")
        close = parse_int(point.get("close"))
        if not date_value or close is None:
            continue
        if str(date_value) < cutoff:
            continue
        merged[date_value] = {
            "date": date_value,
            "close": close,
            "volume": parse_int(point.get("volume")),
        }
    return [merged[key] for key in sorted(merged)]


def enforce_write_guard(existing_spacs, new_spacs, force=False):
    """Refuse to overwrite data.js with a suspiciously shrunken/empty dataset.

    Exits with code 2 unless ``force`` is set.
    """
    problems = []
    existing_count = len(existing_spacs)
    new_count = len(new_spacs)
    if existing_count >= GUARD_MIN_EXISTING_COUNT and new_count < existing_count * GUARD_MIN_KEEP_RATIO:
        problems.append(
            f"SPAC count would shrink from {existing_count} to {new_count} "
            f"(< {GUARD_MIN_KEEP_RATIO:.0%} of existing)"
        )
    priced = sum(1 for spac in new_spacs if spac.get("currentPrice"))
    coverage = priced / new_count if new_count else 0.0
    if coverage < GUARD_MIN_PRICE_COVERAGE:
        problems.append(
            f"only {priced}/{new_count} SPACs have currentPrice "
            f"({coverage:.0%} < {GUARD_MIN_PRICE_COVERAGE:.0%})"
        )
    if not problems:
        return
    if force:
        logger.warning("write guard bypassed by --force: %s", "; ".join(problems))
        return
    for problem in problems:
        logger.error("write guard rejected output: %s", problem)
    logger.error("nothing was written; rerun with --force to override")
    sys.exit(2)


def write_outputs(
    generated_at,
    spacs,
    errors,
    rate_info=None,
    trust_rate=None,
    trust_rate_source=None,
    collection=None,
    force=False,
    data_js_path=None,
    current_json_path=None,
    data_json_path=None,
    archive=None,
    ipo_calendar=None,
):
    """Write data.js / data.json / current.json.

    ``data.json`` carries the exact same payload as ``data.js`` (single
    serialization, no prefix) so the dashboard can fetch it asynchronously;
    ``data.js`` is kept for the ``file://`` script-tag fallback.
    When ``data_json_path`` is omitted it is derived from ``data_js_path``
    (``data.js`` -> ``data.json``) so tests and custom paths stay isolated.
    """
    data_js_path = Path(data_js_path) if data_js_path else DATA_JS_PATH
    current_json_path = Path(current_json_path) if current_json_path else CURRENT_JSON_PATH
    data_json_path = Path(data_json_path) if data_json_path else data_js_path.with_suffix(".json")

    spacs = sorted(
        spacs,
        key=lambda item: (
            item.get("ratio") if item.get("ratio") is not None else 999,
            item.get("currentPrice") if item.get("currentPrice") is not None else 999999,
        ),
    )

    enforce_write_guard(load_existing_spacs(data_js_path), spacs, force=force)

    payload = {
        "schemaVersion": SCHEMA_VERSION,
        "source": "KRX/KIND/DART/Naver",
        "lastUpdated": generated_at.strftime("%Y-%m-%d %H:%M:%S KST"),
        "generatedAt": generated_at.isoformat(),
        "methodology": {
            "universe": "KRX KOSDAQ 상장종목 중 종목명에 스팩/SPAC 포함",
            "listingInfo": "KIND 상장법인목록 이름 매칭",
            "mergerStatus": (
                "KIND 공시검색과 DART fallback에서 회사합병 결정/SPAC 합병 예비심사청구대상은 "
                "합병 신청, 상장예비심사결과 통지(승인) 등은 합병 확정으로 분류"
            ),
            "price": "네이버 증권 실시간/최근가",
            "mergerPriceRecords": (
                "합병 공시일 직전/이후 네이버 일별 종가로 이벤트별 가격 반응과 이후 고저점을 계산"
            ),
            "ipoPrice": "overrides.json 우선, 없으면 증권신고서 공시 공모가, 둘 다 없으면 기본 2,000원",
            "liquidationDate": "overrides.json 우선, 없으면 상장일+36개월 추정",
            "liquidationValue": (
                "공모예치금 + 청산기한까지의 예상 예치이자(공시 예치이율 기간별 적용). "
                "일반 운영/합병 비용은 공모예치금에서 차감하지 않는 것으로 기본 추정"
            ),
            "trustRate": (
                "개별 기대수익률은 증권신고서·신탁계약내용변경 공시의 예치이율 기간으로 계산하며, "
                "공시 금리가 없으면 표시하지 않습니다. KOFR/수동 금리는 시뮬레이션 기본값에만 사용합니다."
            ),
            "expectedReturn": "추정 청산분배금/현재가 - 1",
        },
        "rateAssumption": {
            "annualRate": round(trust_rate, 6) if trust_rate is not None else None,
            "annualRatePct": round(trust_rate * 100, 5) if trust_rate is not None else None,
            "source": trust_rate_source,
            "kofr": rate_info,
        },
        "summary": build_summary(spacs, generated_at),
        "statistics": build_statistics(spacs, generated_at, archive=archive),
        "mergerCases": build_merger_cases(spacs),
        "ipoCalendar": ipo_calendar,
        "spacs": spacs,
        "errors": errors,
        "collection": collection,
        "sourceLinks": {
            "kindCorpList": KIND_CORP_LIST_PAGE_URL,
            "kindDisclosure": KIND_DISCLOSURE_PAGE_URL,
            "dartDisclosure": DART_MAIN_URL,
            "krxData": "https://data.krx.co.kr/",
            "naverFinance": "https://finance.naver.com/",
            "openDartGuide": "https://opendart.fss.or.kr/guide/main.do",
            "kofr": KOFR_MAIN_URL,
        },
    }
    payload_json = json.dumps(payload, ensure_ascii=False, indent=2)
    data_js_path.write_text(
        DATA_JS_PREFIX + payload_json + ";\n",
        encoding="utf-8",
    )
    data_json_path.write_text(payload_json + "\n", encoding="utf-8")
    current_json_path.write_text(
        json.dumps(
            {
                "source": payload["source"],
                "lastUpdated": payload["lastUpdated"],
                "rateAssumption": payload["rateAssumption"],
                "summary": payload["summary"],
                "prices": {
                    spac["code"]: {
                        "name": spac["name"],
                        "currentPrice": spac["currentPrice"],
                        "ipoPrice": spac["ipoPrice"],
                        "ratio": spac["ratio"],
                        "premiumPct": spac["premiumPct"],
                        "annualizedReturn": spac["annualizedReturn"],
                        "status": spac["status"],
                        "badges": spac["badges"],
                        "mergerStatus": spac["mergerStatus"],
                    }
                    for spac in spacs
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    return data_js_path, current_json_path
