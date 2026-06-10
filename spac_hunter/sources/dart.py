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


def fetch_dart_corp_code(session, code):
    response = session.post(DART_CORP_SEARCH_URL, data={"textCrpNm": code}, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.content.decode("utf-8", errors="ignore"), "html.parser")
    corp_code = soup.find("input", {"name": "hiddenCikCD1"})
    corp_name = soup.find("input", {"name": "hiddenCikNM1"})
    if not corp_code or not corp_code.get("value"):
        return None, None
    return corp_code.get("value"), corp_name.get("value")


def fetch_dart_disclosures(code, name, listing_date=None, today=None):
    today = today or today_kst()
    from_date = listing_date or (today - timedelta(days=365 * 4))
    session = make_session(referer=DART_MAIN_URL)
    session.get(DART_MAIN_URL, timeout=15)
    corp_code, corp_name = fetch_dart_corp_code(session, code)
    if not corp_code:
        return []

    payload = {
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
    response = session.post(DART_DETAIL_SEARCH_URL, data=payload, timeout=25)
    response.raise_for_status()
    soup = BeautifulSoup(response.content.decode("utf-8", errors="ignore"), "html.parser")
    disclosures = []
    seen = set()
    token_pool = (
        MERGER_APPLICATION_TOKENS
        + MERGER_CONFIRMATION_TOKENS
        + MERGER_CANCEL_TOKENS
        + ("주권매매거래정지", "주권매매거래정지해제")
    )
    for row in soup.select("tbody tr"):
        cells = row.find_all("td")
        if len(cells) < 5:
            continue
        title_cell = cells[2]
        title = re.sub(r"\s+", " ", title_cell.get_text(" ", strip=True)).strip()
        normalized = normalize_disclosure_title(title)
        if not any(token in normalized for token in token_pool):
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
            disclosure["url"] = f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={receipt_no}"
        disclosures.append(disclosure)
    return disclosures
