import argparse
import json
import math
import re
import time
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
DEFAULT_TRUST_RATE = 0.018
DEFAULT_LIQUIDATION_COST_PER_SHARE = 15

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

    elapsed_days = (today - listing_date).days if listing_date else 0
    elapsed_days = max(0, min(elapsed_days, 365 * 3))
    trust_value = (
        parse_float(override.get("trustValuePerShare"))
        or ipo_price * (1 + args.trust_rate * elapsed_days / 365)
    )
    liquidation_value = (
        parse_float(override.get("liquidationValuePerShare"))
        or trust_value - args.liquidation_cost
    )
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
                argparse.Namespace(trust_rate=DEFAULT_TRUST_RATE, liquidation_cost=DEFAULT_LIQUIDATION_COST_PER_SHARE),
                generated.date(),
            )
        )
    return generated, sample, {"sample": "network collection failed"}


def write_outputs(generated_at, spacs, errors):
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
            "expectedReturn": "추정 청산분배금/현재가 - 1",
        },
        "summary": build_summary(spacs, generated_at),
        "spacs": spacs,
        "errors": errors,
        "sourceLinks": {
            "kindCorpList": KIND_CORP_LIST_PAGE_URL,
            "krxData": "https://data.krx.co.kr/",
            "naverFinance": "https://finance.naver.com/",
            "openDartGuide": "https://opendart.fss.or.kr/guide/main.do",
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
    parser.add_argument("--trust-rate", type=float, default=DEFAULT_TRUST_RATE, help="Fallback annual trust yield")
    parser.add_argument(
        "--liquidation-cost",
        type=float,
        default=DEFAULT_LIQUIDATION_COST_PER_SHARE,
        help="Fallback liquidation cost per share",
    )
    parser.add_argument("--sample", action="store_true", help="Write bundled sample data without network")
    args = parser.parse_args()

    if args.sample:
        generated_at, spacs, errors = build_sample_data()
        write_outputs(generated_at, spacs, errors)
        print(f"sample data written: {len(spacs)} SPACs")
        return

    generated_at = datetime.now(KST)
    try:
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
        errors = {"quote": quote_errors}
    except Exception as exc:  # noqa: BLE001
        print(f"WARNING: live collection failed, writing sample data: {exc}")
        generated_at, spacs, errors = build_sample_data()

    write_outputs(generated_at, spacs, errors)
    print(f"written {DATA_JS_PATH.name}, {CURRENT_JSON_PATH.name}: {len(spacs)} SPACs")


if __name__ == "__main__":
    main()
