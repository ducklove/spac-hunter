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
KIND_CORP_LIST_URL = "https://kind.krx.co.kr/corpgeneral/corpList.do"
KIND_CORP_LIST_PAGE_URL = f"{KIND_CORP_LIST_URL}?method=loadInitPage"
NAVER_STOCK_API_URL = "https://polling.finance.naver.com/api/realtime/domestic/stock/{code}"
NAVER_HISTORY_URL = "https://finance.naver.com/item/sise_day.naver?code={code}&page={page}"


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


def build_status_badges(ratio, days_to_liquidation, trade_stop=False, merger=False):
    badges = []
    if ratio is not None and ratio < 1:
        badges.append("공모가 이하")
    elif ratio is not None and ratio <= 1.01:
        badges.append("공모가 근접")
    if days_to_liquidation is not None:
        if days_to_liquidation <= 180:
            badges.append("청산 6개월 이내")
        elif days_to_liquidation <= 365:
            badges.append("청산 1년 이내")
    if merger:
        badges.append("합병 진행")
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


def enrich_spac(item, kind_info, quote, history, overrides, args, today):
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

    badges = build_status_badges(
        ratio,
        days_to_liquidation,
        quote.get("tradeStop"),
        bool(override.get("merger")),
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
    if override.get("mergerDisclosureDate"):
        events.append(
            {
                "date": override.get("mergerDisclosureDate"),
                "type": "merger",
                "label": "합병공시",
                "detail": str(override.get("merger") or "합병 진행"),
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
    merger = [spac for spac in active if "합병 진행" in spac.get("badges", [])]
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
        "source": "KRX/KIND/Naver",
        "lastUpdated": generated_at.strftime("%Y-%m-%d %H:%M:%S KST"),
        "generatedAt": generated_at.isoformat(),
        "methodology": {
            "universe": "KRX KOSDAQ 상장종목 중 종목명에 스팩/SPAC 포함",
            "listingInfo": "KIND 상장법인목록 이름 매칭",
            "price": "네이버 증권 실시간/최근가",
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
        "spacs": spacs,
        "errors": errors,
        "sourceLinks": {
            "kindCorpList": KIND_CORP_LIST_PAGE_URL,
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
    parser.add_argument("--history-pages", type=int, default=3, help="Naver daily-history pages per SPAC")
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
        krx_spacs = fetch_krx_spac_universe()
        if args.limit > 0:
            krx_spacs = krx_spacs[: args.limit]
        print(f"KRX SPAC universe: {len(krx_spacs)}")
        kind_companies = fetch_kind_listed_companies()
        print(f"KIND listed companies: {len(kind_companies)}")

        codes = [item["code"] for item in krx_spacs]
        quotes, quote_errors = fetch_quotes(codes, args.max_workers)
        print(f"Naver quotes: {len(quotes)} ok, {len(quote_errors)} errors")
        histories = fetch_histories(codes, args.history_pages, max_workers=max(2, min(args.max_workers, 8)))
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
                )
            )
        errors["quote"] = quote_errors
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
