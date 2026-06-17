"""증권신고서/투자설명서 field extraction, filings.json persistence, IPO calendar.

Live mode only (sample mode never touches this module). ``filings.json`` keeps
two caches:

* ``filings``      — per stock code, the best registration statement found near
  listing (투자설명서 preferred over 증권신고서) with best-effort extracted
  fields. Failed extractions are stored too (nulls + ``parseWarnings``) so a
  document is never re-downloaded unless its entry is deleted by hand.
* ``calendarDocs`` — per receipt number, extracted fields for pre-listing SPAC
  filings powering the subscription calendar; entries expire after 60 days.

Document downloads are bounded per run by the ``--filing-doc-limit`` budget;
backfill consumes it first and the calendar gets the remainder (capped at 5).
"""

import json
import logging
import re
from collections import Counter
from datetime import date, datetime, timedelta
from pathlib import Path

from .constants import FILINGS_JSON_PATH, KST
from .parsing import normalize_name, parse_float, parse_int, today_kst
from .sources import opendart

logger = logging.getLogger(__name__)

# Validation bounds for extracted fields.
IPO_PRICE_MIN = 500
IPO_PRICE_MAX = 50000
ESCROW_RATE_MAX_PCT = 8.0
ESCROW_AMOUNT_MIN = 100_000_000
OFFERING_SHARES_MIN = 100_000

# Backfill list.json window around the listing date (fallback: last 4 years).
BACKFILL_BEFORE_LISTING_DAYS = 180
BACKFILL_AFTER_LISTING_DAYS = 30
BACKFILL_FALLBACK_YEARS = 4

# IPO-calendar discovery window and per-run document budget cap.
CALENDAR_LOOKBACK_DAYS = 30
CALENDAR_DOC_BUDGET_MAX = 5
CALENDAR_DOC_MAX_AGE_DAYS = 60
TRUST_RATE_CHANGE_LOOKBACK_YEARS = 4

FIELD_KEYS = (
    "ipoPrice",
    "offeringShares",
    "escrowAmount",
    "escrowRatePct",
    "escrowAgent",
    "subscriptionStart",
    "subscriptionEnd",
    "paymentDate",
)

_IPO_PRICE_RE = re.compile(r"(?:확정공모가액|모집가액|공모가액)[^0-9]{0,40}?([\d,]+)\s*원")
_ESCROW_RATE_PRIMARY_RE = re.compile(
    r"(?:(?:예치|신탁)[^.0-9%]{0,8}?이자율|예치이율)[^0-9]{0,30}?([\d.]+)\s*%"
)
_ESCROW_RATE_FALLBACK_RE = re.compile(r"이자율[^0-9]{0,30}?([\d.]+)\s*%")
_ESCROW_AMOUNT_RE = re.compile(r"(?:예치|신탁)[^.\n]{0,12}?금액[^0-9]{0,25}?([\d,]+)\s*원")
_ESCROW_AGENT_RE = re.compile(r"예치기관[\s::|\-–)\]]*([^\s].{0,29})")
_AGENT_NAME_RE = re.compile(r"[가-힣A-Za-z0-9()·&\s]+")
_AGENT_STOP_RE = re.compile(r"\s+(?=(?:예치|신탁|이자|이율|금액|기간|계약|비고))")
_OFFERING_SHARES_RE = re.compile(
    r"(?:모집|공모)\s*주식\s*(?:의\s*)?(?:총\s*)?수[^0-9]{0,30}?([\d,]+)\s*주"
)
# Full date in any of the three supported shapes: 2026년 6월 15일 / 2026.06.15 / 2026-06-15.
_FULL_DATE_RE = re.compile(r"(\d{4})\s*[년.\-]\s*(\d{1,2})\s*[월.\-]\s*(\d{1,2})\s*일?")
# Year-less second half of a range like "2026년 6월 15일 ~ 6월 16일".
_PARTIAL_DATE_RE = re.compile(r"(\d{1,2})\s*월\s*(\d{1,2})\s*일")
_RANGE_SEP_RE = re.compile(r"(?:\s*\([^)]{1,8}\))?\s*[~∼〜]\s*")
_SUBSCRIPTION_WINDOW = 80
_PAYMENT_WINDOW = 60
_TRUST_CHANGE_DATE_LABELS = (
    "변경일",
    "변경 예정일",
    "변경예정일",
    "계약체결일",
    "체결일",
    "시행일",
    "적용일",
    "효력발생일",
)
_PERCENT_RE = re.compile(r"([0-9]+(?:\.[0-9]+)?)\s*%")


def is_valid_ipo_price(value):
    """공모가 sanity check: 500–50,000원, 100원 단위."""
    return value is not None and IPO_PRICE_MIN <= value <= IPO_PRICE_MAX and value % 100 == 0


def is_valid_escrow_rate_pct(value):
    """예치이율 sanity check: 0% 초과 8% 이하 (연리, % 단위)."""
    return value is not None and 0 < value <= ESCROW_RATE_MAX_PCT


def _candidate_ints(pattern, text):
    return [value for value in (parse_int(raw) for raw in pattern.findall(text)) if value is not None]


def _extract_ipo_price(text, warnings):
    values = _candidate_ints(_IPO_PRICE_RE, text)
    if not values:
        warnings.append("ipoPrice: 패턴 미발견")
        return None
    valid = [value for value in values if is_valid_ipo_price(value)]
    if not valid:
        warnings.append(f"ipoPrice: 검증 탈락 {values[:5]}")
        return None
    return Counter(valid).most_common(1)[0][0]


def _extract_first_valid_int(pattern, text, validator, field, warnings):
    values = _candidate_ints(pattern, text)
    if not values:
        warnings.append(f"{field}: 패턴 미발견")
        return None
    for value in values:
        if validator(value):
            return value
    warnings.append(f"{field}: 검증 탈락 {values[:5]}")
    return None


def _extract_escrow_rate(text, warnings):
    for pattern in (_ESCROW_RATE_PRIMARY_RE, _ESCROW_RATE_FALLBACK_RE):
        values = [value for value in map(parse_float, pattern.findall(text)) if value is not None]
        if not values:
            continue
        for value in values:
            if is_valid_escrow_rate_pct(value):
                return value
        warnings.append(f"escrowRatePct: 검증 탈락 {values[:5]}")
        return None
    warnings.append("escrowRatePct: 패턴 미발견")
    return None


def _extract_escrow_agent(text, warnings):
    match = _ESCROW_AGENT_RE.search(text)
    if not match:
        warnings.append("escrowAgent: 패턴 미발견")
        return None
    name = _AGENT_NAME_RE.match(match.group(1))
    candidate = _AGENT_STOP_RE.split(name.group(0) if name else "")[0]
    candidate = re.sub(r"\s+", " ", candidate).strip(" -·:|,.")
    if len(candidate) < 2:
        warnings.append("escrowAgent: 기관명 미확인")
        return None
    return candidate


def _to_iso_date(year, month, day):
    try:
        return date(int(year), int(month), int(day)).isoformat()
    except ValueError:
        return None


def _extract_subscription_window(text, warnings):
    """청약기일 다음 80자에서 시작/종료일을 찾는다 (단일 날짜면 시작=종료)."""
    label = re.search(r"청약\s*기일", text)
    if not label:
        warnings.append("subscriptionStart: '청약기일' 미발견")
        return None, None
    window = text[label.end() : label.end() + _SUBSCRIPTION_WINDOW]
    first = _FULL_DATE_RE.search(window)
    if not first:
        warnings.append("subscriptionStart: 날짜 미발견")
        return None, None
    start = _to_iso_date(*first.groups())
    if start is None:
        warnings.append("subscriptionStart: 날짜 검증 탈락")
        return None, None
    end = None
    separator = _RANGE_SEP_RE.match(window, first.end())
    if separator:
        second = _FULL_DATE_RE.match(window, separator.end())
        if second:
            end = _to_iso_date(*second.groups())
        else:
            partial = _PARTIAL_DATE_RE.match(window, separator.end())
            if partial:
                end = _to_iso_date(start[:4], *partial.groups())
    return start, end or start


def _extract_payment_date(text, warnings):
    label = re.search(r"납입\s*기일", text)
    if not label:
        warnings.append("paymentDate: '납입기일' 미발견")
        return None
    window = text[label.end() : label.end() + _PAYMENT_WINDOW]
    match = _FULL_DATE_RE.search(window)
    if not match:
        warnings.append("paymentDate: 날짜 미발견")
        return None
    parsed = _to_iso_date(*match.groups())
    if parsed is None:
        warnings.append("paymentDate: 날짜 검증 탈락")
        return None
    return parsed


def extract_filing_fields(text):
    """Best-effort regex extraction from a registration-statement plain text.

    Every field degrades to ``None`` (with a ``parseWarnings`` note) when its
    pattern is missing or all candidates fail validation.
    """
    text = re.sub(r"\s+", " ", str(text or ""))
    warnings = []
    subscription_start, subscription_end = _extract_subscription_window(text, warnings)
    fields = {
        "ipoPrice": _extract_ipo_price(text, warnings),
        "offeringShares": _extract_first_valid_int(
            _OFFERING_SHARES_RE, text, lambda v: v >= OFFERING_SHARES_MIN, "offeringShares", warnings
        ),
        "escrowAmount": _extract_first_valid_int(
            _ESCROW_AMOUNT_RE, text, lambda v: v >= ESCROW_AMOUNT_MIN, "escrowAmount", warnings
        ),
        "escrowRatePct": _extract_escrow_rate(text, warnings),
        "escrowAgent": _extract_escrow_agent(text, warnings),
        "subscriptionStart": subscription_start,
        "subscriptionEnd": subscription_end,
        "paymentDate": _extract_payment_date(text, warnings),
    }
    fields["parseWarnings"] = warnings
    return fields


def _extract_trust_change_rate(text, warnings):
    candidates = []
    markers = (
        "변경 후",
        "변경후",
        "변경내용",
        "예치이율",
        "예치 이율",
        "신탁이자율",
        "신탁 이자율",
        "이자율",
    )
    for marker in markers:
        for match in re.finditer(re.escape(marker), text):
            window = text[match.start() : match.start() + 180]
            candidates.extend(parse_float(raw) for raw in _PERCENT_RE.findall(window))
    candidates = [value for value in candidates if value is not None]
    valid = [value for value in candidates if is_valid_escrow_rate_pct(value)]
    if valid:
        return valid[-1]

    all_values = [value for value in map(parse_float, _PERCENT_RE.findall(text)) if value is not None]
    all_valid = [value for value in all_values if is_valid_escrow_rate_pct(value)]
    if all_valid:
        return all_valid[-1]
    if candidates or all_values:
        warnings.append(f"trustRateChange.ratePct: 검증 탈락 {(candidates or all_values)[:5]}")
    else:
        warnings.append("trustRateChange.ratePct: 패턴 미발견")
    return None


def _extract_trust_change_start_date(text, fallback_date, warnings):
    for label in _TRUST_CHANGE_DATE_LABELS:
        for match in re.finditer(re.escape(label), text):
            window = text[match.end() : match.end() + 100]
            date_match = _FULL_DATE_RE.search(window)
            if not date_match:
                continue
            parsed = _to_iso_date(*date_match.groups())
            if parsed:
                return parsed
    if fallback_date:
        return fallback_date
    warnings.append("trustRateChange.startDate: 날짜 미발견")
    return None


def extract_trust_rate_change_fields(text, filing_date=None):
    """Extract the changed annual escrow rate and effective date from a trust-contract change."""
    text = re.sub(r"\s+", " ", str(text or ""))
    warnings = []
    fields = {
        "ratePct": _extract_trust_change_rate(text, warnings),
        "startDate": _extract_trust_change_start_date(text, filing_date, warnings),
    }
    fields["parseWarnings"] = warnings
    return fields


def load_filings(path=None):
    """Read filings.json; missing or corrupt files fall back to an empty store."""
    path = Path(path) if path else FILINGS_JSON_PATH
    empty = {"filings": {}, "calendarDocs": {}}
    if not path.exists():
        return empty
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError, UnicodeDecodeError):
        return empty
    if not isinstance(payload, dict):
        return empty
    filings = payload.get("filings")
    calendar_docs = payload.get("calendarDocs")
    return {
        "filings": dict(filings) if isinstance(filings, dict) else {},
        "calendarDocs": dict(calendar_docs) if isinstance(calendar_docs, dict) else {},
    }


def save_filings(store, generated_at, path=None):
    path = Path(path) if path else FILINGS_JSON_PATH
    payload = {
        "updatedAt": generated_at.isoformat(),
        "filings": store.get("filings") or {},
        "calendarDocs": store.get("calendarDocs") or {},
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def _format_rcept_dt(value):
    text = str(value or "").strip()
    if len(text) == 8 and text.isdigit():
        return f"{text[:4]}-{text[4:6]}-{text[6:8]}"
    return text or None


def _empty_fields():
    fields = {key: None for key in FIELD_KEYS}
    fields["parseWarnings"] = []
    return fields


def _document_fields(receipt_no):
    """Fetch + extract one document; failures degrade to null fields + warning."""
    try:
        text = opendart.fetch_document_text(receipt_no)
    except Exception as exc:  # noqa: BLE001
        logger.warning("OpenDART 문서 추출 실패 %s: %s", receipt_no, exc)
        fields = _empty_fields()
        fields["parseWarnings"] = [f"문서 추출 실패: {exc}"]
        return fields
    return extract_filing_fields(text)


def _document_trust_rate_change_fields(receipt_no, filing_date=None):
    """Fetch + extract one trust-contract change document."""
    try:
        text = opendart.fetch_document_text(receipt_no)
    except Exception as exc:  # noqa: BLE001
        logger.warning("OpenDART 신탁계약 변경 문서 추출 실패 %s: %s", receipt_no, exc)
        return {"ratePct": None, "startDate": filing_date, "parseWarnings": [f"문서 추출 실패: {exc}"]}
    return extract_trust_rate_change_fields(text, filing_date=filing_date)


def _filing_entry(receipt_no, report_name, filing_date, url, fields, now):
    entry = {
        "receiptNo": receipt_no,
        "reportName": report_name,
        "filingDate": filing_date,
        "url": url,
    }
    for key in FIELD_KEYS:
        entry[key] = fields.get(key)
    entry["extractedAt"] = now.isoformat()
    entry["parseWarnings"] = list(fields.get("parseWarnings") or [])
    return entry


def _is_trust_rate_change_row(row):
    title = re.sub(r"\s+", "", str(row.get("report_nm") or ""))
    return "신탁계약" in title and "변경" in title


def _trust_rate_change_entry(row, fields):
    receipt_no = str(row.get("rcept_no") or "").strip()
    filing_date = _format_rcept_dt(row.get("rcept_dt"))
    report_name = re.sub(r"\s+", " ", str(row.get("report_nm") or "")).strip() or None
    return {
        "receiptNo": receipt_no,
        "reportName": report_name,
        "filingDate": filing_date,
        "url": f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={receipt_no}" if receipt_no else None,
        "startDate": fields.get("startDate") or filing_date,
        "ratePct": fields.get("ratePct"),
        "parseWarnings": list(fields.get("parseWarnings") or []),
    }


def _merge_trust_rate_changes(existing, additions):
    merged = {}
    for entry in list(existing or []) + list(additions or []):
        if not isinstance(entry, dict):
            continue
        receipt_no = str(entry.get("receiptNo") or "").strip()
        key = receipt_no or f"{entry.get('startDate')}|{entry.get('ratePct')}|{entry.get('reportName')}"
        if key:
            merged[key] = entry
    rows = list(merged.values())
    rows.sort(
        key=lambda entry: (
            str(entry.get("startDate") or entry.get("filingDate") or ""),
            str(entry.get("receiptNo") or ""),
        )
    )
    return rows


def _select_registration_row(rows):
    """투자설명서 우선, 증권신고서 차선 — 그 안에서 최신(rcept_no 최대) 1건."""
    for token in ("투자설명서", "증권신고서"):
        candidates = [row for row in rows if token in str(row.get("report_nm") or "")]
        if candidates:
            return max(candidates, key=lambda row: str(row.get("rcept_no") or ""))
    return None


def backfill_filings(store, items, listing_dates, doc_budget, today=None, now=None):
    """Backfill ``store["filings"]`` for universe items without an entry.

    Codes are processed only while document budget remains (one document per
    code). A code whose list lookup finds no registration statement is stored
    as a null entry (no budget spent) so it is not re-scanned every run.
    Returns ``(docs_used, errors)``.
    """
    errors = {}
    used = 0
    if doc_budget <= 0:
        return used, errors
    today = today or today_kst()
    now = now or datetime.now(KST)
    filings = store.setdefault("filings", {})
    try:
        corp_map = opendart.load_corp_code_map()
    except Exception as exc:  # noqa: BLE001
        errors["corpCode"] = str(exc)
        logger.warning("OpenDART corpCode 매핑 실패, 신고서 백필 생략: %s", exc)
        return used, errors
    for item in items:
        if used >= doc_budget:
            break
        code = item["code"]
        if code in filings:
            continue
        corp_code = corp_map.get(code)
        if not corp_code:
            continue
        listing_date = listing_dates.get(code)
        if listing_date:
            bgn_de = listing_date - timedelta(days=BACKFILL_BEFORE_LISTING_DAYS)
            end_de = listing_date + timedelta(days=BACKFILL_AFTER_LISTING_DAYS)
        else:
            bgn_de = today - timedelta(days=365 * BACKFILL_FALLBACK_YEARS)
            end_de = today
        try:
            rows = opendart.fetch_filing_list(bgn_de, end_de, corp_code=corp_code)
        except Exception as exc:  # noqa: BLE001
            # Quota/network trouble would repeat for every remaining code; stop here.
            errors[code] = f"신고서 목록 조회 실패: {exc}"
            logger.warning("OpenDART 신고서 목록 조회 실패 %s(%s): %s", item.get("name"), code, exc)
            break
        row = _select_registration_row(rows)
        if row is None:
            fields = _empty_fields()
            fields["parseWarnings"] = ["증권신고서/투자설명서 미발견"]
            filings[code] = _filing_entry(None, None, None, None, fields, now)
            continue
        receipt_no = str(row.get("rcept_no") or "").strip()
        report_name = re.sub(r"\s+", " ", str(row.get("report_nm") or "")).strip() or None
        used += 1
        filings[code] = _filing_entry(
            receipt_no,
            report_name,
            _format_rcept_dt(row.get("rcept_dt")),
            f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={receipt_no}",
            _document_fields(receipt_no),
            now,
        )
    return used, errors


def backfill_trust_rate_changes(store, items, listing_dates, doc_budget, today=None, now=None):
    """Backfill 신탁계약내용변경 disclosures and changed escrow rates.

    The search itself is list.json only; document.xml is downloaded only for
    unseen trust-contract change receipts and is bounded by ``doc_budget``.
    """
    errors = {}
    used = 0
    if doc_budget <= 0:
        return used, errors
    today = today or today_kst()
    now = now or datetime.now(KST)
    filings = store.setdefault("filings", {})
    try:
        corp_map = opendart.load_corp_code_map()
    except Exception as exc:  # noqa: BLE001
        errors["corpCode"] = str(exc)
        logger.warning("OpenDART corpCode 매핑 실패, 신탁계약 변경 백필 생략: %s", exc)
        return used, errors

    for item in items:
        if used >= doc_budget:
            break
        code = item["code"]
        filing_entry = filings.get(code)
        if not isinstance(filing_entry, dict):
            continue
        corp_code = corp_map.get(code)
        if not corp_code:
            continue
        listing_date = listing_dates.get(code)
        bgn_de = listing_date or (today - timedelta(days=365 * TRUST_RATE_CHANGE_LOOKBACK_YEARS))
        end_de = today
        try:
            rows = opendart.fetch_filing_list(bgn_de, end_de, corp_code=corp_code)
        except Exception as exc:  # noqa: BLE001
            errors[code] = f"신탁계약 변경 목록 조회 실패: {exc}"
            logger.warning("OpenDART 신탁계약 변경 목록 조회 실패 %s(%s): %s", item.get("name"), code, exc)
            break

        trust_rows = sorted(
            [row for row in rows if _is_trust_rate_change_row(row)],
            key=lambda row: str(row.get("rcept_no") or ""),
        )
        if not trust_rows:
            filing_entry["trustRateChangeScannedAt"] = now.isoformat()
            continue

        existing_changes = filing_entry.get("escrowRateChanges") or []
        seen_receipts = {
            str(change.get("receiptNo") or "").strip()
            for change in existing_changes
            if isinstance(change, dict)
        }
        additions = []
        for row in trust_rows:
            if used >= doc_budget:
                break
            receipt_no = str(row.get("rcept_no") or "").strip()
            if not receipt_no or receipt_no in seen_receipts:
                continue
            used += 1
            filing_date = _format_rcept_dt(row.get("rcept_dt"))
            fields = _document_trust_rate_change_fields(receipt_no, filing_date=filing_date)
            entry = _trust_rate_change_entry(row, fields)
            if is_valid_escrow_rate_pct(parse_float(entry.get("ratePct"))) and entry.get("startDate"):
                additions.append(entry)
            else:
                errors[code] = f"신탁계약 변경 금리 추출 실패: {receipt_no}"
        if additions:
            filing_entry["escrowRateChanges"] = _merge_trust_rate_changes(existing_changes, additions)
        elif existing_changes:
            filing_entry["escrowRateChanges"] = _merge_trust_rate_changes(existing_changes, [])
        filing_entry["trustRateChangeScannedAt"] = now.isoformat()
    return used, errors


def _prune_calendar_docs(calendar_docs, now, max_age_days=CALENDAR_DOC_MAX_AGE_DAYS):
    """Drop calendarDocs entries extracted more than ``max_age_days`` ago."""
    cutoff = now - timedelta(days=max_age_days)
    for key in list(calendar_docs):
        raw = (calendar_docs.get(key) or {}).get("extractedAt") or ""
        try:
            extracted_at = datetime.fromisoformat(str(raw))
        except ValueError:
            del calendar_docs[key]
            continue
        if extracted_at.tzinfo is None:
            extracted_at = extracted_at.replace(tzinfo=KST)
        if extracted_at < cutoff:
            del calendar_docs[key]


def build_ipo_calendar(store, universe_names, doc_budget, today=None, now=None):
    """Discover pre-listing SPAC registration filings as subscription-calendar rows.

    list.json is queried without corp_code (발행공시, last 30 days); rows are
    kept when corp_name contains 스팩/SPAC/기업인수목적 (pre-listing SPACs file
    under their legal ○○기업인수목적 name) and report_nm is a 증권신고서 or
    투자설명서, excluding names already in the universe. The newest receipt per
    corp_code survives. Within ``doc_budget``, documents are extracted (cached
    in ``store["calendarDocs"]``, stale entries pruned) to enrich subscription
    dates and the IPO price. Returns ``(entries, docs_used)`` sorted by
    subscriptionStart (fallback filingDate) descending.
    """
    today = today or today_kst()
    now = now or datetime.now(KST)
    rows = opendart.fetch_filing_list(
        today - timedelta(days=CALENDAR_LOOKBACK_DAYS), today, pblntf_ty="C"
    )
    excluded = {normalize_name(name) for name in universe_names or []}
    candidates = {}
    for row in rows:
        corp_name = str(row.get("corp_name") or "").strip()
        report_name = re.sub(r"\s+", " ", str(row.get("report_nm") or "")).strip()
        if (
            "스팩" not in corp_name
            and "기업인수목적" not in corp_name
            and "SPAC" not in corp_name.upper()
        ):
            continue
        if "증권신고서" not in report_name and "투자설명서" not in report_name:
            continue
        if normalize_name(corp_name) in excluded:
            continue
        corp_code = str(row.get("corp_code") or "").strip()
        receipt_no = str(row.get("rcept_no") or "").strip()
        if not corp_code or not receipt_no:
            continue
        current = candidates.get(corp_code)
        if current is not None and receipt_no <= current["receiptNo"]:
            continue
        candidates[corp_code] = {
            "corpName": corp_name,
            "corpCode": corp_code,
            "reportName": report_name,
            "receiptNo": receipt_no,
            "url": f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={receipt_no}",
            "filingDate": _format_rcept_dt(row.get("rcept_dt")),
            "ipoPrice": None,
            "subscriptionStart": None,
            "subscriptionEnd": None,
            "paymentDate": None,
        }
    calendar_docs = store.setdefault("calendarDocs", {})
    _prune_calendar_docs(calendar_docs, now)
    used = 0
    entries = []
    for entry in candidates.values():
        doc = calendar_docs.get(entry["receiptNo"])
        if doc is None and used < doc_budget:
            used += 1
            doc = dict(_document_fields(entry["receiptNo"]))
            doc["extractedAt"] = now.isoformat()
            calendar_docs[entry["receiptNo"]] = doc
        if doc:
            for key in ("ipoPrice", "subscriptionStart", "subscriptionEnd", "paymentDate"):
                entry[key] = doc.get(key)
        entries.append(entry)
    entries.sort(
        key=lambda entry: str(entry.get("subscriptionStart") or entry.get("filingDate") or ""),
        reverse=True,
    )
    return entries, used
