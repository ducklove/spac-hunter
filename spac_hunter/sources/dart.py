"""DART (dart.fss.or.kr) disclosure search used as the KIND fallback."""

import re
from datetime import timedelta

from bs4 import BeautifulSoup

from ..constants import (
    DART_CORP_SEARCH_URL,
    DART_DETAIL_SEARCH_URL,
    DART_MAIN_URL,
    MERGER_APPLICATION_TOKENS,
    MERGER_CANCEL_TOKENS,
    MERGER_CONFIRMATION_TOKENS,
)
from ..http import make_session
from ..parsing import normalize_disclosure_title, today_kst

DART_REPORT_URL = "https://dart.fss.or.kr/dsaf001/main.do"
DART_VIEWER_URL = "https://dart.fss.or.kr/report/viewer.do"

_VIEW_DOC_RE = re.compile(
    r"viewDoc\(\s*['\"](?P<rcp_no>[^'\"]+)['\"]\s*,\s*['\"](?P<dcm_no>[^'\"]+)['\"]\s*,"
    r"\s*['\"](?P<ele_id>[^'\"]*)['\"]\s*,\s*['\"](?P<offset>[^'\"]*)['\"]\s*,"
    r"\s*['\"](?P<length>[^'\"]*)['\"]\s*,\s*['\"](?P<dtd>[^'\"]*)['\"]",
    re.IGNORECASE,
)


def _decode_content(content):
    korean_tokens = ("변경", "예치", "신탁", "기업인수목적", "회사합병")
    candidates = []
    for encoding in ("utf-8", "cp949", "euc-kr"):
        text = content.decode(encoding, errors="replace")
        korean_score = sum(text.count(token) for token in korean_tokens)
        candidates.append((korean_score, -text.count("\ufffd"), text))
    return max(candidates, key=lambda item: item[:2])[2]


def fetch_dart_corp_code(session, code):
    response = session.post(DART_CORP_SEARCH_URL, data={"textCrpNm": code}, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(_decode_content(response.content), "html.parser")
    corp_code = soup.find("input", {"name": "hiddenCikCD1"})
    corp_name = soup.find("input", {"name": "hiddenCikNM1"})
    if not corp_code or not corp_code.get("value"):
        return None, None
    return corp_code.get("value"), corp_name.get("value")


def _detail_search_payload(corp_code, corp_name, name, from_date, today):
    return {
        "currentPage": "1",
        "maxResults": "100",
        "maxLinks": "10",
        "sort": "date",
        "series": "desc",
        "textCrpCik": corp_code,
        "lateKeyword": "",
        "keyword": "",
        "reportNamePopYn": "N",
        "textkeyword": "",
        "businessCode": "all",
        "autoSearch": "N",
        "autoSearchCorp": "Y",
        "option": "corp",
        "textCrpNm": corp_name or name,
        "reportName": "",
        "tocSrch": "",
        "textCrpNm2": "",
        "textPresenterNm": "",
        "startDate": from_date.strftime("%Y%m%d"),
        "endDate": today.strftime("%Y%m%d"),
        "decadeType": "",
        "finalReport": "recent",
        "businessNm": "전체",
        "corporationType": "",
        "closingAccountsMonth": "",
        "reportName2": "",
        "tocSrch2": "",
    }


def _parse_search_rows(html, title_predicate):
    soup = BeautifulSoup(html, "html.parser")
    disclosures = []
    seen = set()
    for row in soup.select("tbody tr"):
        cells = row.find_all("td")
        if len(cells) < 5:
            continue
        title_cell = cells[2]
        title = re.sub(r"\s+", " ", title_cell.get_text(" ", strip=True)).strip()
        normalized = normalize_disclosure_title(title)
        if not title_predicate(title, normalized):
            continue
        link = title_cell.find("a")
        onclick = link.get("onclick", "") if link else ""
        receipt_match = re.search(r"openReportViewer\('([^']+)'", onclick)
        receipt_no = receipt_match.group(1) if receipt_match else None
        date_text = cells[4].get_text(" ", strip=True).replace(".", "-")
        key = receipt_no or f"{date_text}|{title}"
        if key in seen:
            continue
        seen.add(key)
        disclosure = {
            "date": date_text,
            "title": title,
            "company": cells[1].get_text(" ", strip=True),
            "submitter": cells[3].get_text(" ", strip=True),
            "receiptNo": receipt_no,
            "source": "DART 공시통합검색",
        }
        if receipt_no:
            disclosure["url"] = f"{DART_REPORT_URL}?rcpNo={receipt_no}"
        disclosures.append(disclosure)
    return disclosures


def _fetch_dart_search_rows(code, name, listing_date, today, title_predicate):
    today = today or today_kst()
    from_date = listing_date or (today - timedelta(days=365 * 4))
    session = make_session(referer=DART_MAIN_URL)
    session.get(DART_MAIN_URL, timeout=15)
    corp_code, corp_name = fetch_dart_corp_code(session, code)
    if not corp_code:
        return []

    payload = _detail_search_payload(corp_code, corp_name, name, from_date, today)
    response = session.post(DART_DETAIL_SEARCH_URL, data=payload, timeout=25)
    response.raise_for_status()
    return _parse_search_rows(_decode_content(response.content), title_predicate)


def fetch_dart_disclosures(code, name, listing_date=None, today=None):
    token_pool = (
        MERGER_APPLICATION_TOKENS
        + MERGER_CONFIRMATION_TOKENS
        + MERGER_CANCEL_TOKENS
        + ("주권매매거래정지", "주권매매거래정지해제")
    )

    return _fetch_dart_search_rows(
        code,
        name,
        listing_date,
        today,
        lambda _title, normalized: any(token in normalized for token in token_pool),
    )


def _is_trust_rate_change_title(title, normalized=None):
    compact = re.sub(r"[\sㆍ·・.\[\]()]", "", normalized or normalize_disclosure_title(title))
    if "기업인수목적회사의예치신탁계약내용변경" in compact:
        return True
    return "신탁계약내용변경" in compact and ("예치" in compact or "기업인수목적회사" in compact)


def fetch_dart_trust_rate_change_disclosures(code, name, listing_date=None, today=None):
    """Search DART public detail search for SPAC escrow/trust contract changes."""

    return _fetch_dart_search_rows(code, name, listing_date, today, _is_trust_rate_change_title)


def _view_doc_candidates(html, receipt_no):
    candidates = []
    seen = set()
    for match in _VIEW_DOC_RE.finditer(html):
        if match.group("rcp_no") != receipt_no:
            continue
        candidate = {
            "rcpNo": match.group("rcp_no"),
            "dcmNo": match.group("dcm_no"),
            "eleId": match.group("ele_id") or "0",
            "offset": match.group("offset") or "0",
            "length": match.group("length") or "0",
            "dtd": match.group("dtd") or "HTML",
        }
        key = tuple(candidate.values())
        if key in seen:
            continue
        seen.add(key)
        candidates.append(candidate)
    candidates.sort(key=lambda item: (item["dtd"].upper() != "HTML", item["eleId"] != "0"))
    return candidates


def _viewer_text_score(text):
    return (
        text.count("%") * 10
        + (20 if "변경 후" in text or "변경후" in text else 0)
        + (10 if "예치" in text or "신탁" in text else 0)
        + min(len(text), 5000) / 5000
    )


def fetch_dart_document_text(receipt_no):
    """Fetch plain text for a DART public viewer document by receipt number."""

    receipt_no = str(receipt_no or "").strip()
    if not receipt_no:
        raise ValueError("receipt_no is required")
    session = make_session(referer=DART_MAIN_URL)
    response = session.get(DART_REPORT_URL, params={"rcpNo": receipt_no}, timeout=20)
    response.raise_for_status()
    main_html = _decode_content(response.content)
    candidates = _view_doc_candidates(main_html, receipt_no)
    if not candidates:
        raise RuntimeError(f"DART viewer document id not found: {receipt_no}")

    texts = []
    for params in candidates:
        response = session.get(DART_VIEWER_URL, params=params, timeout=25)
        response.raise_for_status()
        html = _decode_content(response.content)
        text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            texts.append(text)
    if not texts:
        raise RuntimeError(f"DART viewer text is empty: {receipt_no}")
    return max(texts, key=_viewer_text_score)
