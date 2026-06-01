import argparse
import json
import math
import re
import time
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, datetime, timedelta, timezone
from io import StringIO
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import pandas as pd
import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parent
DATA_JS_PATH = ROOT / "data.js"
CURRENT_JSON_PATH = ROOT / "current.json"
OVERRIDES_PATH = ROOT / "overrides.json"

KST = timezone(timedelta(hours=9))
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
)

DEFAULT_IPO_PRICE = 2000
DEFAULT_TRUST_RATE = 0.0
DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE = 0

KOFR_API_URL = "https://www.kofr.kr/websquare/engine/proworks/callServletService.jsp"
KOFR_MAIN_URL = "https://www.kofr.kr/main.jsp"
DART_MAIN_URL = "https://dart.fss.or.kr/dsab007/main.do"
DART_DETAIL_SEARCH_URL = "https://dart.fss.or.kr/dsab007/detailSearch.ax"
DART_CORP_SEARCH_URL = "https://dart.fss.or.kr/corp/searchCorp.ax"
KIND_CORP_LIST_URL = "https://kind.krx.co.kr/corpgeneral/corpList.do"
KIND_CORP_LIST_PAGE_URL = f"{KIND_CORP_LIST_URL}?method=loadInitPage"
KIND_DISCLOSURE_URL = "https://kind.krx.co.kr/disclosure/searchdisclosurebycorp.do"
KIND_DISCLOSURE_PAGE_URL = f"{KIND_DISCLOSURE_URL}?method=searchDisclosureByCorpMain"
NAVER_STOCK_API_URL = "https://polling.finance.naver.com/api/realtime/domestic/stock/{code}"
NAVER_HISTORY_URL = "https://finance.naver.com/item/sise_day.naver?code={code}&page={page}"

MERGER_APPLICATION_TOKENS = (
    "SPAC합병(예비심사청구대상)",
    "회사합병결정",
)
MERGER_CONFIRMATION_TOKENS = (
    "상장예비심사결과통지(승인)",
    "SPAC소멸합병상장",
    "합병등종료보고서",
)
MERGER_CANCEL_TOKENS = (
    "합병취소",
    "부인사실발생",
    "합병결정철회",
    "철회",
    "미승인",
)
MERGER_IGNORE_TOKENS = (
    "상장예비심사청구서미제출",
)


def today_kst() -> date:
    return datetime.now(KST).date()


def parse_int(value):
    if value is None:
        return None
    if isinstance(value, (int, float)) and not pd.isna(value):
        return int(value)
    text = str(value).strip().replace(",", "")
    if not text or text == "-":
        return None
    match = re.search(r"-?\d+", text)
    return int(match.group(0)) if match else None


def parse_float(value):
    if value is None:
        return None
    if isinstance(value, (int, float)) and not pd.isna(value):
        return float(value)
    text = str(value).strip().replace(",", "").replace("%", "")
    if not text or text == "-":
        return None
    try:
        return float(text)
    except ValueError:
        return None


def parse_date(value):
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    for fmt in ("%Y-%m-%d", "%Y.%m.%d", "%Y%m%d"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            pass
    return None


def add_months(value: date, months: int) -> date:
    month = value.month - 1 + months
    year = value.year + month // 12
    month = month % 12 + 1
    days_in_month = [
        31,
        29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month - 1]
    return date(year, month, min(value.day, days_in_month))


def normalize_name(value):
    return re.sub(r"\s+", "", str(value or "")).upper()


def http_json(url, timeout=12):
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def http_text(url, timeout=12, encoding="utf-8"):
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=timeout) as response:
        return response.read().decode(encoding, errors="ignore")


def load_overrides():
    if not OVERRIDES_PATH.exists():
        return {}
    with OVERRIDES_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_existing_spacs():
    if not DATA_JS_PATH.exists():
        return {}
    text = DATA_JS_PATH.read_text(encoding="utf-8")
    prefix = "window.SPAC_DATA = "
    if not text.startswith(prefix):
        return {}
    text = text[len(prefix) :].strip()
    if text.endswith(";"):
        text = text[:-1]
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return {}
    return {spac.get("code"): spac for spac in payload.get("spacs", []) if spac.get("code")}


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


def fetch_krx_spac_universe():
    try:
        from pykrx.website.krx.market import core

        cls = getattr(core, "상장종목검색")
        frame = cls().fetch("KSQ")
        rows = frame.to_dict("records")
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"KRX 상장종목검색 수집 실패: {exc}") from exc

    universe = []
    for row in rows:
        name = str(row.get("codeName") or "").strip()
        code = str(row.get("short_code") or "").strip()
        if not name or not code:
            continue
        if "스팩" not in name and "SPAC" not in name.upper():
            continue
        universe.append(
            {
                "code": code,
                "name": name,
                "market": "KOSDAQ",
                "isin": row.get("full_code") or None,
                "source": "KRX 상장종목검색",
            }
        )
    return sorted(universe, key=lambda item: (item["name"], item["code"]))


def fetch_kind_listed_companies():
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Referer": KIND_CORP_LIST_PAGE_URL})
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


def normalize_disclosure_title(value):
    return re.sub(r"\s+", "", str(value or ""))


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


def kind_post(session, url, payload, timeout=20):
    for attempt in range(4):
        response = session.post(url, data=payload, timeout=timeout)
        if response.status_code in (403, 429, 503) and attempt < 3:
            time.sleep(0.5 + attempt * 0.8)
            continue
        response.raise_for_status()
        return response
    raise RuntimeError("KIND request retry exhausted")


def fetch_kind_disclosures(code, name, listing_date=None, today=None):
    today = today or today_kst()
    from_date = listing_date or (today - timedelta(days=365 * 4))
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Referer": KIND_DISCLOSURE_PAGE_URL})
    session.get(KIND_DISCLOSURE_PAGE_URL, timeout=15)
    rep_code = f"A{code}"
    report_terms = ("합병", "상장예비심사")
    disclosures = []
    seen = set()

    for term in report_terms:
        payload = {
            "method": "searchDisclosureByCorpSub",
            "currentPageSize": "30",
            "pageIndex": "1",
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
        soup = BeautifulSoup(response.text, "html.parser")
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
            key = receipt_no or f"{date_text}|{title}"
            if key in seen:
                continue
            seen.add(key)
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
            disclosures.append(disclosure)
        time.sleep(0.05)
    return disclosures


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
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Referer": DART_MAIN_URL})
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


def fetch_kind_merger_disclosures(items, kind_companies, max_workers=6, today=None, prefer_dart=False):
    disclosures = {}
    errors = {}
    if not items:
        return disclosures, errors
    today = today or today_kst()
    max_workers = max(1, min(max_workers, 4))

    def fetch_item(item):
        kind_info = kind_companies.get(normalize_name(item["name"]), {})
        listing_date = parse_date(kind_info.get("listingDate"))
        if prefer_dart:
            return fetch_dart_disclosures(item["code"], item["name"], listing_date, today), None
        try:
            return fetch_kind_disclosures(item["code"], item["name"], listing_date, today), None
        except Exception as kind_exc:  # noqa: BLE001
            dart_rows = fetch_dart_disclosures(item["code"], item["name"], listing_date, today)
            return dart_rows, f"KIND 실패, DART fallback 사용: {kind_exc}"

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_item, item): item for item in items}
        for future in as_completed(tasks):
            item = tasks[future]
            try:
                rows, warning = future.result()
                disclosures[item["code"]] = rows
                if warning:
                    errors[item["code"]] = warning
            except Exception as exc:  # noqa: BLE001
                errors[item["code"]] = str(exc)
                disclosures[item["code"]] = []
    return disclosures, errors


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


def fetch_naver_quote(code):
    payload = http_json(NAVER_STOCK_API_URL.format(code=code))
    data = (payload.get("datas") or [{}])[0]
    trade_stop = data.get("tradeStopType") or {}
    return {
        "code": code,
        "price": parse_int(data.get("closePriceRaw") or data.get("closePrice")),
        "change": parse_int(data.get("compareToPreviousClosePriceRaw") or data.get("compareToPreviousClosePrice")),
        "changePct": parse_float(data.get("fluctuationsRatioRaw") or data.get("fluctuationsRatio")),
        "volume": parse_int(data.get("accumulatedTradingVolumeRaw") or data.get("accumulatedTradingVolume")),
        "tradingValue": parse_int(data.get("accumulatedTradingValueRaw") or data.get("accumulatedTradingValue")),
        "marketCap": parse_int(data.get("marketValueFullRaw") or data.get("marketValueFull")),
        "marketStatus": data.get("marketStatus"),
        "tradeStop": trade_stop.get("code") not in (None, "1"),
        "tradeStopText": trade_stop.get("text") or None,
        "tradedAt": data.get("localTradedAt"),
        "source": "네이버 증권 실시간",
    }


def fetch_quotes(codes, max_workers=8):
    quotes = {}
    errors = {}
    if not codes:
        return quotes, errors
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_naver_quote, code): code for code in codes}
        for future in as_completed(tasks):
            code = tasks[future]
            try:
                quotes[code] = future.result()
            except Exception as exc:  # noqa: BLE001
                errors[code] = str(exc)
    return quotes, errors


def fetch_naver_history(code, pages=3, pause=0.05):
    frames = []
    for page in range(1, pages + 1):
        try:
            html = http_text(NAVER_HISTORY_URL.format(code=code, page=page), encoding="euc-kr")
            tables = pd.read_html(StringIO(html))
        except Exception:  # noqa: BLE001
            continue
        if not tables:
            continue
        frame = tables[0].dropna(how="all")
        if frame.empty or "날짜" not in frame.columns or "종가" not in frame.columns:
            continue
        frame = frame[["날짜", "종가", "거래량"]].copy()
        frame["date"] = pd.to_datetime(frame["날짜"], format="%Y.%m.%d", errors="coerce")
        frame["close"] = pd.to_numeric(frame["종가"], errors="coerce")
        frame["volume"] = pd.to_numeric(frame["거래량"], errors="coerce")
        frame = frame[["date", "close", "volume"]].dropna(subset=["date", "close"])
        frames.append(frame)
        time.sleep(pause)
    if not frames:
        return []
    history = (
        pd.concat(frames, ignore_index=True)
        .drop_duplicates(subset=["date"], keep="first")
        .sort_values("date")
    )
    return [
        {
            "date": row.date.strftime("%Y-%m-%d"),
            "close": int(row.close),
            "volume": int(row.volume) if not pd.isna(row.volume) else None,
        }
        for row in history.itertuples(index=False)
    ]


def fetch_histories(codes, pages=3, max_workers=6):
    histories = {}
    if pages <= 0 or not codes:
        return histories
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_naver_history, code, pages): code for code in codes}
        for future in as_completed(tasks):
            code = tasks[future]
            try:
                histories[code] = future.result()
            except Exception:  # noqa: BLE001
                histories[code] = []
    return histories


def fetch_kofr_rate():
    body = (
        '<reqParam action="getLastRateList1" '
        'task="ksd.rfr.user.rate.process.RatePTask"><LANG>kor</LANG></reqParam>'
    )
    response = requests.post(
        KOFR_API_URL,
        data=body.encode("utf-8"),
        headers={
            "User-Agent": USER_AGENT,
            "Referer": KOFR_MAIN_URL,
            "Content-Type": "application/xml; charset=UTF-8",
        },
        timeout=20,
    )
    response.raise_for_status()
    root = ET.fromstring(response.text)
    result = root.find(".//result")
    if result is None:
        raise RuntimeError("KOFR response did not include a result node")

    def attr(name):
        node = result.find(name)
        return node.get("value").strip() if node is not None and node.get("value") else None

    latest_rate_pct = parse_float(attr("RFR_PUBN_MR"))
    if latest_rate_pct is None:
        raise RuntimeError("KOFR latest rate was unavailable")

    return {
        "source": "KOFR",
        "sourceUrl": KOFR_MAIN_URL,
        "publishedDate": attr("RFR_PUBN_DT"),
        "standardDate": attr("PUBN_MR_STD_DT"),
        "latestRatePct": latest_rate_pct,
        "rate": latest_rate_pct / 100,
        "d30AvgPct": parse_float(attr("D30_AVG_MR")),
        "d90AvgPct": parse_float(attr("D90_AVG_MR")),
        "d180AvgPct": parse_float(attr("D180_AVG_MR")),
        "lastModified": attr("LAST_MODF_DTTM"),
    }


def derive_sponsor(name):
    patterns = [
        r"^(.*?)제?\d+호스팩$",
        r"^(.*?)스팩\d+호$",
        r"^(.*?)스팩$",
    ]
    for pattern in patterns:
        match = re.match(pattern, name)
        if match:
            sponsor = match.group(1).strip()
            return sponsor or None
    return None


def build_status_badges(ratio, days_to_liquidation, trade_stop=False, merger_status=None):
    badges = []
    if ratio is not None and ratio < 1:
        badges.append("공모가 이하")
    elif ratio is not None and ratio <= 1.01:
        badges.append("공모가 근접")
    if merger_status:
        badges.append(merger_status)
    if days_to_liquidation is not None:
        if days_to_liquidation <= 180:
            badges.append("청산 6개월 이내")
        elif days_to_liquidation <= 365:
            badges.append("청산 1년 이내")
    if trade_stop:
        badges.append("거래정지")
    if not badges:
        badges.append("일반")
    return badges


def calculate_annualized_return(target_value, current_price, days):
    if not target_value or not current_price or current_price <= 0 or not days or days <= 0:
        return None
    ratio = target_value / current_price
    if ratio <= 0:
        return None
    try:
        return (ratio ** (365 / days)) - 1
    except (OverflowError, ValueError):
        return None


def estimate_trust_value_per_share(ipo_price, listing_date, liquidation_date, trust_rate, today):
    if not ipo_price:
        return None
    if listing_date and liquidation_date:
        trust_days = max(0, (liquidation_date - listing_date).days)
    elif listing_date:
        trust_days = max(0, min((today - listing_date).days, 365 * 3))
    else:
        trust_days = 0
    return ipo_price * ((1 + trust_rate) ** (trust_days / 365))


def pct_change(base, value):
    if base is None or value is None or base <= 0:
        return None
    return round((value / base - 1) * 100, 2)


def build_merger_price_records(disclosures, history_points):
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


def enrich_spac(item, kind_info, quote, history, overrides, args, today, disclosures=None):
    code = item["code"]
    override = overrides.get(code, {})
    ipo_price = parse_int(override.get("ipoPrice")) or DEFAULT_IPO_PRICE
    listing_date = parse_date(override.get("listingDate") or kind_info.get("listingDate"))
    liquidation_date = parse_date(override.get("liquidationDate"))
    liquidation_date_source = "overrides.json"
    if liquidation_date is None and listing_date:
        liquidation_date = add_months(listing_date, 36)
        liquidation_date_source = "상장일+36개월 추정"

    current_price = quote.get("price")
    ratio = current_price / ipo_price if current_price and ipo_price else None
    premium_pct = (ratio - 1) * 100 if ratio is not None else None
    days_to_liquidation = (
        (liquidation_date - today).days if liquidation_date else None
    )

    override_trust_value = parse_float(override.get("trustValuePerShare"))
    override_liquidation_value = parse_float(override.get("liquidationValuePerShare"))
    estimated_trust_value = estimate_trust_value_per_share(
        ipo_price, listing_date, liquidation_date, args.trust_rate, today
    )
    trust_value = override_trust_value or estimated_trust_value
    rate_label = getattr(args, "trust_rate_label", "")
    liquidation_value_source = (
        f"공모예치금+예상 예치이자({rate_label})"
        if rate_label
        else "공모예치금+예상 예치이자"
    )
    if override_liquidation_value:
        liquidation_value = override_liquidation_value
        liquidation_value_source = "overrides.json 청산분배금"
    else:
        liquidation_value = trust_value
        if override_trust_value:
            liquidation_value_source = "overrides.json 예치금"
        if args.liquidation_haircut:
            liquidation_value = liquidation_value - args.liquidation_haircut
            liquidation_value_source += f" - 수동 조정 {args.liquidation_haircut:g}원"
    expected_return = (
        liquidation_value / current_price - 1
        if current_price and current_price > 0 and liquidation_value
        else None
    )
    annualized_return = calculate_annualized_return(
        liquidation_value, current_price, days_to_liquidation
    )

    merger_state = classify_merger_disclosures(disclosures or [])
    merger_status = merger_state["status"]
    application_disclosure = merger_state["application"]
    confirmation_disclosure = merger_state["confirmation"]
    cancellation_disclosure = merger_state["cancellation"]

    manual_application_date = override.get("mergerApplicationDisclosureDate") or override.get(
        "mergerDisclosureDate"
    )
    manual_confirmation_date = override.get("mergerConfirmationDisclosureDate")
    if manual_application_date:
        application_disclosure = {
            "date": manual_application_date,
            "title": str(
                override.get("mergerApplicationDisclosureTitle")
                or override.get("merger")
                or "합병 대상 공시"
            ),
            "source": "overrides.json",
        }
        if not merger_status:
            merger_status = "합병 신청"
    if manual_confirmation_date:
        confirmation_disclosure = {
            "date": manual_confirmation_date,
            "title": str(override.get("mergerConfirmationDisclosureTitle") or "합병 확정 공시"),
            "source": "overrides.json",
        }
        merger_status = "합병 확정"

    override_merger_status = normalize_merger_status(override.get("mergerStatus"))
    legacy_merger_status = normalize_merger_status(override.get("merger"))
    if override_merger_status:
        merger_status = override_merger_status
    elif legacy_merger_status and not merger_status:
        merger_status = legacy_merger_status
    elif override.get("merger") and not merger_status:
        merger_status = "합병 신청"

    history_points = []
    for point in history:
        close = point.get("close")
        point_ratio = close / ipo_price if close and ipo_price else None
        history_points.append(
            {
                "date": point.get("date"),
                "close": close,
                "ratio": round(point_ratio, 4) if point_ratio is not None else None,
                "volume": point.get("volume"),
            }
        )
    merger_price_records = build_merger_price_records(merger_state["matched"], history_points)

    badges = build_status_badges(
        ratio,
        days_to_liquidation,
        quote.get("tradeStop"),
        merger_status,
    )
    estimated_shares = (
        int(quote["marketCap"] / current_price)
        if quote.get("marketCap") and current_price
        else None
    )

    events = []
    if listing_date:
        events.append(
            {
                "date": listing_date.isoformat(),
                "type": "listing",
                "label": "상장",
                "detail": f"KIND 상장일 {listing_date.isoformat()}",
            }
        )
    if application_disclosure:
        events.append(
            {
                "date": application_disclosure.get("date"),
                "type": "merger_application",
                "label": "합병 신청",
                "detail": application_disclosure.get("title") or "합병 대상 공시",
                "source": application_disclosure.get("source"),
                "url": application_disclosure.get("url"),
            }
        )
    if confirmation_disclosure:
        events.append(
            {
                "date": confirmation_disclosure.get("date"),
                "type": "merger_confirmation",
                "label": "합병 확정",
                "detail": confirmation_disclosure.get("title") or "합병 확정 공시",
                "source": confirmation_disclosure.get("source"),
                "url": confirmation_disclosure.get("url"),
            }
        )
    if cancellation_disclosure:
        events.append(
            {
                "date": cancellation_disclosure.get("date"),
                "type": "merger_canceled",
                "label": "합병 철회",
                "detail": cancellation_disclosure.get("title") or "합병 철회/취소 공시",
                "source": cancellation_disclosure.get("source"),
                "url": cancellation_disclosure.get("url"),
            }
        )
    if liquidation_date:
        events.append(
            {
                "date": liquidation_date.isoformat(),
                "type": "liquidation",
                "label": "청산기한",
                "detail": liquidation_date_source,
            }
        )

    return {
        "id": code,
        "code": code,
        "name": item["name"],
        "market": item.get("market"),
        "isin": item.get("isin"),
        "sponsor": override.get("sponsor") or derive_sponsor(item["name"]),
        "ipoPrice": ipo_price,
        "currentPrice": current_price,
        "change": quote.get("change"),
        "changePct": quote.get("changePct"),
        "ratio": round(ratio, 4) if ratio is not None else None,
        "premiumPct": round(premium_pct, 2) if premium_pct is not None else None,
        "volume": quote.get("volume"),
        "tradingValue": quote.get("tradingValue"),
        "marketCap": quote.get("marketCap"),
        "estimatedShares": estimated_shares,
        "listingDate": listing_date.isoformat() if listing_date else None,
        "liquidationDate": liquidation_date.isoformat() if liquidation_date else None,
        "liquidationDateSource": liquidation_date_source if liquidation_date else None,
        "daysToLiquidation": days_to_liquidation,
        "trustValuePerShare": round(trust_value, 2) if trust_value else None,
        "liquidationValuePerShare": round(liquidation_value, 2) if liquidation_value else None,
        "liquidationValueSource": liquidation_value_source if liquidation_value else None,
        "expectedReturn": round(expected_return * 100, 2) if expected_return is not None else None,
        "annualizedReturn": round(annualized_return * 100, 2) if annualized_return is not None else None,
        "status": badges[0],
        "badges": badges,
        "mergerStatus": merger_status,
        "mergerApplicationDisclosure": application_disclosure,
        "mergerConfirmationDisclosure": confirmation_disclosure,
        "mergerCancellationDisclosure": cancellation_disclosure,
        "mergerDisclosures": merger_state["matched"],
        "mergerPriceRecords": merger_price_records,
        "kind": kind_info,
        "quote": quote,
        "history": history_points,
        "events": sorted(events, key=lambda event: event.get("date") or ""),
        "disclosureUrl": f"https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm={item['name']}",
        "naverUrl": f"https://finance.naver.com/item/main.naver?code={code}",
    }


def build_summary(spacs, generated_at):
    active = [spac for spac in spacs if spac.get("currentPrice")]
    below_ipo = [spac for spac in active if spac.get("ratio") is not None and spac["ratio"] < 1]
    near_ipo = [spac for spac in active if spac.get("ratio") is not None and spac["ratio"] <= 1.01]
    due_soon = [
        spac
        for spac in active
        if spac.get("daysToLiquidation") is not None and spac["daysToLiquidation"] <= 180
    ]
    merger = [spac for spac in active if spac.get("mergerStatus")]
    merger_applied = [spac for spac in merger if spac.get("mergerStatus") == "합병 신청"]
    merger_confirmed = [spac for spac in merger if spac.get("mergerStatus") == "합병 확정"]
    merger_event_count = sum(len(spac.get("mergerPriceRecords") or []) for spac in active)
    recent = [
        spac
        for spac in active
        if spac.get("listingDate")
        and (generated_at.date() - parse_date(spac["listingDate"])).days <= 120
    ]
    ratios = [spac["ratio"] for spac in active if spac.get("ratio") is not None]
    annualized = [
        spac["annualizedReturn"]
        for spac in active
        if spac.get("annualizedReturn") is not None and not math.isnan(spac["annualizedReturn"])
    ]
    cheapest = min(active, key=lambda item: item.get("ratio") or 99, default=None)
    best_yield = max(active, key=lambda item: item.get("annualizedReturn") or -999, default=None)

    return {
        "totalCount": len(active),
        "belowIpoCount": len(below_ipo),
        "nearIpoCount": len(near_ipo),
        "dueSoonCount": len(due_soon),
        "mergerCount": len(merger),
        "mergerAppliedCount": len(merger_applied),
        "mergerConfirmedCount": len(merger_confirmed),
        "mergerEventCount": merger_event_count,
        "recentListingCount": len(recent),
        "averageRatio": round(sum(ratios) / len(ratios), 4) if ratios else None,
        "averageAnnualizedReturn": round(sum(annualized) / len(annualized), 2) if annualized else None,
        "cheapest": {
            "code": cheapest["code"],
            "name": cheapest["name"],
            "ratio": cheapest.get("ratio"),
            "currentPrice": cheapest.get("currentPrice"),
        }
        if cheapest
        else None,
        "bestYield": {
            "code": best_yield["code"],
            "name": best_yield["name"],
            "annualizedReturn": best_yield.get("annualizedReturn"),
            "currentPrice": best_yield.get("currentPrice"),
        }
        if best_yield
        else None,
    }


def build_merger_cases(spacs, limit=80):
    cases = []
    for spac in spacs:
        for record in spac.get("mergerPriceRecords") or []:
            cases.append(
                {
                    **record,
                    "code": spac.get("code"),
                    "name": spac.get("name"),
                    "status": spac.get("mergerStatus") or "과거 공시",
                    "currentPrice": spac.get("currentPrice"),
                    "currentRatio": spac.get("ratio"),
                }
            )
    cases.sort(key=lambda record: record.get("date") or "", reverse=True)
    return cases[:limit]


def mean(values):
    values = [value for value in values if value is not None and not math.isnan(value)]
    return round(sum(values) / len(values), 2) if values else None


def median(values):
    values = sorted(value for value in values if value is not None and not math.isnan(value))
    if not values:
        return None
    mid = len(values) // 2
    if len(values) % 2:
        return round(values[mid], 2)
    return round((values[mid - 1] + values[mid]) / 2, 2)


def month_key(value):
    parsed = parse_date(str(value or "")[:10])
    return parsed.strftime("%Y-%m") if parsed else None


def month_range(end_date, months):
    months = max(1, months)
    first = date(end_date.year, end_date.month, 1)
    start = add_months(first, -(months - 1))
    return [add_months(start, idx).strftime("%Y-%m") for idx in range(months)]


def build_below_ipo_trend(spacs, min_coverage_ratio=0.7):
    active_total = sum(1 for spac in spacs if spac.get("currentPrice"))
    min_coverage = max(5, int(active_total * min_coverage_ratio))
    by_date = {}
    for spac in spacs:
        for point in spac.get("history") or []:
            ratio_value = point.get("ratio")
            date_value = point.get("date")
            if date_value is None or ratio_value is None:
                continue
            bucket = by_date.setdefault(date_value, [])
            bucket.append(float(ratio_value))

    trend = []
    for date_value in sorted(by_date):
        ratios = by_date[date_value]
        if len(ratios) < min_coverage:
            continue
        below = [value for value in ratios if value < 1]
        near = [value for value in ratios if value <= 1.01]
        trend.append(
            {
                "date": date_value,
                "totalCount": len(ratios),
                "belowCount": len(below),
                "nearCount": len(near),
                "belowPct": round(len(below) / len(ratios) * 100, 2),
                "averageRatio": round(sum(ratios) / len(ratios), 4),
            }
        )
    return trend[-180:]


def build_listing_trend(spacs, generated_at, months=18):
    keys = month_range(generated_at.date(), months)
    counts = {key: 0 for key in keys}
    for spac in spacs:
        key = month_key(spac.get("listingDate"))
        if key in counts:
            counts[key] += 1
    return [{"month": key, "count": counts[key]} for key in keys]


def build_merger_trend(spacs, generated_at, months=18):
    keys = month_range(generated_at.date(), months)
    rows = {
        key: {"month": key, "applied": 0, "confirmed": 0, "canceled": 0, "total": 0}
        for key in keys
    }
    signal_field = {"applied": "applied", "confirmed": "confirmed", "canceled": "canceled"}
    for spac in spacs:
        for record in spac.get("mergerPriceRecords") or []:
            key = month_key(record.get("date"))
            signal = signal_field.get(record.get("signal"))
            if key not in rows or not signal:
                continue
            rows[key][signal] += 1
            rows[key]["total"] += 1
    return [rows[key] for key in keys]


def build_merger_episodes(spacs):
    episodes = []
    for spac in spacs:
        open_episode = None
        records = sorted(spac.get("mergerPriceRecords") or [], key=lambda item: item.get("date") or "")
        for record in records:
            event_date = parse_date(record.get("date"))
            if not event_date:
                continue
            signal = record.get("signal")
            if signal == "applied":
                if open_episode is None:
                    open_episode = {
                        "code": spac.get("code"),
                        "name": spac.get("name"),
                        "appliedDate": event_date,
                        "appliedPrice": record.get("basePrice"),
                        "appliedPremiumPct": pct_change(spac.get("ipoPrice") or DEFAULT_IPO_PRICE, record.get("basePrice")),
                        "status": "pending",
                    }
                continue
            if signal == "confirmed":
                if open_episode is None:
                    open_episode = {
                        "code": spac.get("code"),
                        "name": spac.get("name"),
                        "appliedDate": None,
                        "appliedPrice": None,
                        "status": "pending",
                    }
                open_episode.update(
                    {
                        "status": "success",
                        "confirmedDate": event_date,
                        "confirmedPrice": record.get("basePrice"),
                        "daysToConfirmation": (
                            (event_date - open_episode["appliedDate"]).days
                            if open_episode.get("appliedDate")
                            else None
                        ),
                    }
                )
                episodes.append(open_episode)
                open_episode = None
                continue
            if signal == "canceled" and open_episode is not None:
                open_episode.update(
                    {
                        "status": "failed",
                        "canceledDate": event_date,
                        "canceledPrice": record.get("basePrice"),
                        "daysToCancel": (
                            (event_date - open_episode["appliedDate"]).days
                            if open_episode.get("appliedDate")
                            else None
                        ),
                    }
                )
                episodes.append(open_episode)
                open_episode = None
        if open_episode is not None:
            episodes.append(open_episode)
    return episodes


def build_statistics(spacs, generated_at):
    active = [spac for spac in spacs if spac.get("currentPrice")]
    below_trend = build_below_ipo_trend(active)
    listing_trend = build_listing_trend(active, generated_at)
    merger_trend = build_merger_trend(active, generated_at)
    merger_cases = build_merger_cases(active, limit=500)
    episodes = build_merger_episodes(active)
    successes = [episode for episode in episodes if episode.get("status") == "success"]
    failures = [episode for episode in episodes if episode.get("status") == "failed"]
    pending = [episode for episode in episodes if episode.get("status") == "pending"]
    completed = successes + failures
    success_rate = len(successes) / len(completed) * 100 if completed else None

    applications = [case for case in merger_cases if case.get("signal") == "applied"]
    confirmations = [case for case in merger_cases if case.get("signal") == "confirmed"]
    cancellations = [case for case in merger_cases if case.get("signal") == "canceled"]

    def avg_price(rows):
        return mean([row.get("basePrice") for row in rows])

    def avg_return(rows, key):
        return mean([row.get(key) for row in rows])

    listing_dates = [parse_date(spac.get("listingDate")) for spac in active]
    listing_dates = [value for value in listing_dates if value]
    today = generated_at.date()

    return {
        "note": "현재 상장 스팩과 수집된 KIND/DART 합병 공시 이벤트 기준입니다. 상폐 후 사명이 바뀐 과거 전체 성공 사례는 별도 아카이브 확장이 필요합니다.",
        "belowIpoTrend": below_trend,
        "listingTrend": listing_trend,
        "mergerTrend": merger_trend,
        "newListing": {
            "last30Count": sum(1 for value in listing_dates if (today - value).days <= 30),
            "last90Count": sum(1 for value in listing_dates if (today - value).days <= 90),
            "last365Count": sum(1 for value in listing_dates if (today - value).days <= 365),
        },
        "mergerFunnel": {
            "episodeCount": len(episodes),
            "successCount": len(successes),
            "failureCount": len(failures),
            "pendingCount": len(pending),
            "completedCount": len(completed),
            "successRatePct": round(success_rate, 2) if success_rate is not None else None,
            "avgDaysToConfirmation": mean([episode.get("daysToConfirmation") for episode in successes]),
            "medianDaysToConfirmation": median([episode.get("daysToConfirmation") for episode in successes]),
            "avgDaysToCancel": mean([episode.get("daysToCancel") for episode in failures]),
        },
        "mergerPriceStats": {
            "applicationAvgPrice": avg_price(applications),
            "confirmationAvgPrice": avg_price(confirmations),
            "cancellationAvgPrice": avg_price(cancellations),
            "applicationAvgNextReturnPct": avg_return(applications, "nextReturnPct"),
            "confirmationAvgNextReturnPct": avg_return(confirmations, "nextReturnPct"),
            "cancellationAvgNextReturnPct": avg_return(cancellations, "nextReturnPct"),
            "applicationAvgHighReturnPct": avg_return(applications, "highReturnPct"),
            "confirmationAvgHighReturnPct": avg_return(confirmations, "highReturnPct"),
            "cancellationAvgLowReturnPct": avg_return(cancellations, "lowReturnPct"),
        },
    }


def build_sample_data():
    generated = datetime.now(KST)
    sample = []
    names = [
        ("0072Z0", "KB제33호스팩", 1999, "2025-09-30"),
        ("0132G0", "교보20호스팩", 1998, "2026-04-02"),
        ("0096D0", "미래에셋비전스팩9호", 1998, "2025-12-01"),
        ("477760", "DB금융스팩12호", 2050, "2024-06-19"),
        ("469480", "IBKS제24호스팩", 2465, "2024-02-01"),
    ]
    for code, name, price, listing in names:
        listing_date = parse_date(listing)
        history = []
        for idx in range(40):
            day = generated.date() - timedelta(days=39 - idx)
            close = price + int(math.sin(idx / 4) * 12)
            history.append({"date": day.isoformat(), "close": close, "volume": 10000 + idx * 500})
        sample.append(
            enrich_spac(
                {"code": code, "name": name, "market": "KOSDAQ", "isin": None},
                {"listingDate": listing, "industry": "금융 지원 서비스업", "mainProduct": "기업인수합병"},
                {
                    "price": price,
                    "change": 0,
                    "changePct": 0,
                    "volume": 10000,
                    "tradingValue": price * 10000,
                    "marketCap": price * 5_000_000,
                    "marketStatus": "SAMPLE",
                    "tradeStop": False,
                    "source": "샘플",
                },
                history,
                {},
                argparse.Namespace(
                    trust_rate=DEFAULT_TRUST_RATE,
                    trust_rate_label="샘플 0.000%",
                    liquidation_haircut=DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE,
                ),
                generated.date(),
            )
        )
    return generated, sample, {"sample": "network collection failed"}


def write_outputs(generated_at, spacs, errors, rate_info=None, trust_rate=None, trust_rate_source=None):
    spacs = sorted(
        spacs,
        key=lambda item: (
            item.get("ratio") if item.get("ratio") is not None else 999,
            item.get("currentPrice") if item.get("currentPrice") is not None else 999999,
        ),
    )
    payload = {
        "source": "KRX/KIND/DART/Naver",
        "lastUpdated": generated_at.strftime("%Y-%m-%d %H:%M:%S KST"),
        "generatedAt": generated_at.isoformat(),
        "methodology": {
            "universe": "KRX KOSDAQ 상장종목 중 종목명에 스팩/SPAC 포함",
            "listingInfo": "KIND 상장법인목록 이름 매칭",
            "mergerStatus": "KIND 공시검색과 DART fallback에서 회사합병 결정/SPAC 합병 예비심사청구대상은 합병 신청, 상장예비심사결과 통지(승인) 등은 합병 확정으로 분류",
            "price": "네이버 증권 실시간/최근가",
            "mergerPriceRecords": "합병 공시일 직전/이후 네이버 일별 종가로 이벤트별 가격 반응과 이후 고저점을 계산",
            "ipoPrice": "기본 2,000원, overrides.json으로 보정",
            "liquidationDate": "overrides.json 우선, 없으면 상장일+36개월 추정",
            "liquidationValue": "공모예치금 + 청산기한까지의 예상 예치이자. 일반 운영/합병 비용은 공모예치금에서 차감하지 않는 것으로 기본 추정",
            "trustRate": trust_rate_source or "공시/수동 보정값이 없으면 KOFR 최신 공시금리 사용",
            "expectedReturn": "추정 청산분배금/현재가 - 1",
        },
        "rateAssumption": {
            "annualRate": round(trust_rate, 6) if trust_rate is not None else None,
            "annualRatePct": round(trust_rate * 100, 5) if trust_rate is not None else None,
            "source": trust_rate_source,
            "kofr": rate_info,
        },
        "summary": build_summary(spacs, generated_at),
        "statistics": build_statistics(spacs, generated_at),
        "mergerCases": build_merger_cases(spacs),
        "spacs": spacs,
        "errors": errors,
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
    DATA_JS_PATH.write_text(
        "window.SPAC_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    CURRENT_JSON_PATH.write_text(
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


def main():
    parser = argparse.ArgumentParser(description="Build SPAC dashboard data")
    parser.add_argument("--history-pages", type=int, default=10, help="Naver daily-history pages per SPAC")
    parser.add_argument(
        "--merger-history-pages",
        type=int,
        default=40,
        help="Naver daily-history pages for SPACs with merger disclosures",
    )
    parser.add_argument("--max-workers", type=int, default=8, help="Quote fetch concurrency")
    parser.add_argument("--limit", type=int, default=0, help="Limit SPAC count for quick testing")
    parser.add_argument(
        "--trust-rate",
        type=float,
        default=None,
        help="Manual annual trust yield as a decimal. If omitted, latest KOFR is used.",
    )
    parser.add_argument(
        "--liquidation-haircut",
        "--liquidation-cost",
        dest="liquidation_haircut",
        type=float,
        default=DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE,
        help=(
            "Manual per-share haircut for stress testing only. Default is 0 because "
            "general operating/merger expenses are not deducted from public escrow."
        ),
    )
    parser.add_argument(
        "--skip-disclosures",
        action="store_true",
        help="Skip KIND merger-disclosure lookup and use overrides only.",
    )
    parser.add_argument(
        "--disclosure-workers",
        type=int,
        default=2,
        help="KIND merger-disclosure fetch concurrency",
    )
    parser.add_argument("--sample", action="store_true", help="Write bundled sample data without network")
    args = parser.parse_args()

    if args.sample:
        args.trust_rate = DEFAULT_TRUST_RATE
        args.trust_rate_label = "샘플 0.000%"
        generated_at, spacs, errors = build_sample_data()
        write_outputs(
            generated_at,
            spacs,
            errors,
            trust_rate=args.trust_rate,
            trust_rate_source="샘플 데이터 0.000%",
        )
        print(f"sample data written: {len(spacs)} SPACs")
        return

    generated_at = datetime.now(KST)
    try:
        errors = {}
        if args.trust_rate is None:
            try:
                rate_info = fetch_kofr_rate()
                args.trust_rate = rate_info["rate"]
                args.trust_rate_label = f"KOFR {rate_info['latestRatePct']:.3f}%"
                trust_rate_source = (
                    f"KOFR 최신 공시금리 {rate_info['latestRatePct']:.3f}%"
                    f"({rate_info.get('publishedDate') or '공시일 미확인'})"
                )
                print(f"KOFR trust-rate fallback: {rate_info['latestRatePct']:.3f}%")
            except Exception as exc:  # noqa: BLE001
                rate_info = None
                args.trust_rate = DEFAULT_TRUST_RATE
                args.trust_rate_label = f"fallback {args.trust_rate * 100:.3f}%"
                trust_rate_source = "KOFR 조회 실패로 0.000% 보수적 fallback"
                errors["kofr"] = str(exc)
                print(f"WARNING: KOFR collection failed, using 0.000% fallback: {exc}")
        else:
            rate_info = None
            args.trust_rate_label = f"수동 {args.trust_rate * 100:.3f}%"
            trust_rate_source = f"수동 입력 {args.trust_rate * 100:.3f}%"

        overrides = load_overrides()
        existing_spacs = load_existing_spacs()
        krx_spacs = fetch_krx_spac_universe()
        if args.limit > 0:
            krx_spacs = krx_spacs[: args.limit]
        print(f"KRX SPAC universe: {len(krx_spacs)}")
        try:
            kind_companies = fetch_kind_listed_companies()
            print(f"KIND listed companies: {len(kind_companies)}")
        except Exception as exc:  # noqa: BLE001
            kind_companies = existing_kind_companies(existing_spacs)
            errors["kindCorpList"] = str(exc)
            print(
                "WARNING: KIND listed-company collection failed; "
                f"using {len(kind_companies)} existing listing records: {exc}"
            )

        if args.skip_disclosures:
            merger_disclosures = {}
            disclosure_errors = {}
            print("KIND merger disclosures: skipped")
        else:
            merger_disclosures, disclosure_errors = fetch_kind_merger_disclosures(
                krx_spacs,
                kind_companies,
                max_workers=args.disclosure_workers,
                today=generated_at.date(),
                prefer_dart="kindCorpList" in errors,
            )
            found_disclosures = sum(1 for rows in merger_disclosures.values() if rows)
            print(
                "KIND merger disclosures: "
                f"{found_disclosures} codes with rows, {len(disclosure_errors)} errors"
            )

        codes = [item["code"] for item in krx_spacs]
        quotes, quote_errors = fetch_quotes(codes, args.max_workers)
        print(f"Naver quotes: {len(quotes)} ok, {len(quote_errors)} errors")
        histories = fetch_histories(codes, args.history_pages, max_workers=max(2, min(args.max_workers, 8)))
        merger_codes = [
            code
            for code, rows in merger_disclosures.items()
            if classify_merger_disclosures(rows).get("matched")
        ]
        if merger_codes and args.merger_history_pages > args.history_pages:
            merger_histories = fetch_histories(
                merger_codes,
                args.merger_history_pages,
                max_workers=max(2, min(args.max_workers, 6)),
            )
            histories.update(merger_histories)
            print(
                "Naver merger histories: "
                f"{sum(1 for h in merger_histories.values() if h)} ok, "
                f"{args.merger_history_pages} pages"
            )
        print(f"Naver histories: {sum(1 for h in histories.values() if h)} ok")

        spacs = []
        for item in krx_spacs:
            code = item["code"]
            kind_info = kind_companies.get(normalize_name(item["name"]), {})
            quote = quotes.get(code, {})
            spacs.append(
                enrich_spac(
                    item,
                    kind_info,
                    quote,
                    histories.get(code, []),
                    overrides,
                    args,
                    generated_at.date(),
                    merger_disclosures.get(code, []),
                )
            )
        errors["quote"] = quote_errors
        errors["disclosure"] = disclosure_errors
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: live collection failed, writing sample data: {exc}")
        rate_info = None
        trust_rate_source = "샘플 데이터 0.000%"
        generated_at, spacs, errors = build_sample_data()

    write_outputs(
        generated_at,
        spacs,
        errors,
        rate_info=rate_info,
        trust_rate=args.trust_rate,
        trust_rate_source=trust_rate_source,
    )
    print(f"written {DATA_JS_PATH.name}, {CURRENT_JSON_PATH.name}: {len(spacs)} SPACs")


if __name__ == "__main__":
    main()
