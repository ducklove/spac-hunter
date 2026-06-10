"""KIND (kind.krx.co.kr) clients: listed-company table and disclosure search."""

import re
import time
from datetime import timedelta

from bs4 import BeautifulSoup

from ..constants import (
    KIND_CORP_LIST_PAGE_URL,
    KIND_CORP_LIST_URL,
    KIND_DISCLOSURE_PAGE_URL,
    KIND_DISCLOSURE_URL,
)
from ..http import make_session
from ..parsing import normalize_name, today_kst

DISCLOSURE_PAGE_SIZE = 30
DISCLOSURE_MAX_PAGES = 2


def kind_post(session, url, payload, timeout=20):
    # Manual retry loop kept on purpose: it also covers 403, which the
    # session-level urllib3 Retry policy (429/503) does not retry.
    for attempt in range(4):
        response = session.post(url, data=payload, timeout=timeout)
        if response.status_code in (403, 429, 503) and attempt < 3:
            time.sleep(0.5 + attempt * 0.8)
            continue
        response.raise_for_status()
        return response
    raise RuntimeError("KIND request retry exhausted")


def fetch_kind_listed_companies():
    session = make_session(referer=KIND_CORP_LIST_PAGE_URL)
    session.get(KIND_CORP_LIST_PAGE_URL, timeout=20)
    payload = {
        "method": "searchCorpList",
        "pageIndex": "1",
        "currentPageSize": "3000",
        "marketType": "kosdaqMkt",
        "searchType": "",
        "industry": "",
        "fiscalYearEnd": "",
        "comAbbrvTmp": "",
        "comAbbrv": "",
        "location": "",
        "beginIndex": "",
        "orderMode": "",
        "orderStat": "",
    }
    response = session.post(KIND_CORP_LIST_URL, data=payload, timeout=35)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    companies = {}
    for row in soup.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) < 8:
            continue
        link = cells[0].find("a")
        name = (link.get_text(" ", strip=True) if link else cells[0].get_text(" ", strip=True)).strip()
        full_name = cells[0].get("title") or name
        item = {
            "name": name,
            "fullName": full_name.strip(),
            "industry": cells[1].get_text(" ", strip=True),
            "mainProduct": cells[2].get_text(" ", strip=True),
            "listingDate": cells[3].get_text(" ", strip=True),
            "fiscalMonth": cells[4].get_text(" ", strip=True),
            "ceo": cells[5].get_text(" ", strip=True),
            "homepage": bool(cells[6].get_text(" ", strip=True)),
            "location": cells[7].get_text(" ", strip=True),
            "source": "KIND 상장법인목록",
        }
        companies[normalize_name(name)] = item
    return companies


def _parse_disclosure_rows(html, name):
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    for row in soup.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) < 4:
            continue
        link = cells[3].find("a")
        title = (link.get("title") if link else "") or cells[3].get_text(" ", strip=True)
        title = re.sub(r"\s+", " ", title).strip()
        if not title:
            continue
        date_text = cells[1].get_text(" ", strip=True)
        onclick = link.get("onclick", "") if link else ""
        receipt_match = re.search(r"openDisclsViewer\('([^']+)'", onclick)
        receipt_no = receipt_match.group(1) if receipt_match else None
        disclosure = {
            "date": date_text,
            "title": title,
            "company": cells[2].get_text(" ", strip=True) if len(cells) > 2 else name,
            "submitter": cells[4].get_text(" ", strip=True) if len(cells) > 4 else None,
            "receiptNo": receipt_no,
            "source": "KIND 공시검색",
        }
        if receipt_no:
            disclosure["url"] = (
                "https://kind.krx.co.kr/common/disclsviewer.do"
                f"?method=search&acptno={receipt_no}"
            )
        rows.append(disclosure)
    return rows


def fetch_kind_disclosures(code, name, listing_date=None, today=None):
    today = today or today_kst()
    from_date = listing_date or (today - timedelta(days=365 * 4))
    session = make_session(referer=KIND_DISCLOSURE_PAGE_URL)
    session.get(KIND_DISCLOSURE_PAGE_URL, timeout=15)
    rep_code = f"A{code}"
    report_terms = ("합병", "상장예비심사")
    disclosures = []
    seen = set()

    for term in report_terms:
        for page_index in range(1, DISCLOSURE_MAX_PAGES + 1):
            payload = {
                "method": "searchDisclosureByCorpSub",
                "currentPageSize": str(DISCLOSURE_PAGE_SIZE),
                "pageIndex": str(page_index),
                "orderIndex": "1",
                "searchCodeType": "number",
                "repIsuSrtCd": rep_code,
                "allRepIsuSrtCd": rep_code,
                "forward": "searchdisclosurebycorp_sub",
                "searchMode": "",
                "kosdaq": "on",
                "kosreq": "on",
                "outsvcno": "",
                "searchCorpName": name,
                "fromDate": from_date.isoformat(),
                "toDate": today.isoformat(),
                "reportNmTemp": term,
                "reportNm": term,
                "reportCd": "",
                "lastReport": "recent",
            }
            response = kind_post(session, KIND_DISCLOSURE_URL, payload, timeout=20)
            page_rows = _parse_disclosure_rows(response.text, name)
            for disclosure in page_rows:
                key = disclosure.get("receiptNo") or f"{disclosure['date']}|{disclosure['title']}"
                if key in seen:
                    continue
                seen.add(key)
                disclosures.append(disclosure)
            time.sleep(0.05)
            # Fetch the next page only when the current one came back full.
            if len(page_rows) < DISCLOSURE_PAGE_SIZE:
                break
    return disclosures
