"""Naver Finance quote/history clients with a pykrx history fallback."""

import time
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import timedelta
from io import StringIO

import pandas as pd

from ..constants import NAVER_HISTORY_URL, NAVER_STOCK_API_URL
from ..http import http_json, http_text
from ..parsing import parse_float, parse_int, today_kst


def fetch_full_naver_history(code):
    """Naver chart feed: one request covers a SPAC's complete listed lifetime."""
    url = f"https://fchart.stock.naver.com/sise.nhn?symbol={code}&timeframe=day&count=10000&requestType=0"
    root = ET.fromstring(http_text(url, encoding="euc-kr"))
    points = {}
    for item in root.iter("item"):
        parts = (item.get("data") or "").split("|")
        if len(parts) != 6:
            continue
        try:
            day = pd.to_datetime(parts[0], format="%Y%m%d", errors="raise").date().isoformat()
        except (ValueError, TypeError):
            continue
        close = parse_int(parts[4])
        if close is not None and close > 0:
            points[day] = {"date": day, "close": close, "volume": parse_int(parts[5])}
    return [points[day] for day in sorted(points)]


def needs_history_backfill(spac):
    """Only request the full feed until the saved history reaches listing/payment."""
    spac = spac or {}
    dates = [p.get("date") for p in spac.get("history", []) if p.get("date") and p.get("close")]
    if not dates:
        return True
    start = spac.get("listingDate")
    if start:
        return min(dates) > start
    start = (spac.get("valuationBasis") or {}).get("trustStartDate")
    if not start:
        return True
    # Payment precedes trading; this tolerance only controls redundant fetching.
    return pd.Timestamp(min(dates)) > pd.Timestamp(start) + pd.Timedelta(days=14)


def fetch_history_backfills(codes, existing_spacs, max_workers=6):
    needed = [code for code in codes if needs_history_backfill(existing_spacs.get(code))]
    histories = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_full_naver_history, code): code for code in needed}
        for future in as_completed(tasks):
            try:
                points = future.result()
                if points:
                    histories[tasks[future]] = points
            except Exception:  # noqa: BLE001 — preserve saved/daily histories on source failure
                continue
    return histories


def fetch_naver_quote(code):
    payload = http_json(NAVER_STOCK_API_URL.format(code=code))
    data = (payload.get("datas") or [{}])[0]
    trade_stop = data.get("tradeStopType") or {}
    return {
        "code": code,
        "name": data.get("stockName") or None,
        "price": parse_int(data.get("closePriceRaw") or data.get("closePrice")),
        "change": parse_int(
            data.get("compareToPreviousClosePriceRaw") or data.get("compareToPreviousClosePrice")
        ),
        "changePct": parse_float(data.get("fluctuationsRatioRaw") or data.get("fluctuationsRatio")),
        "volume": parse_int(data.get("accumulatedTradingVolumeRaw") or data.get("accumulatedTradingVolume")),
        "tradingValue": parse_int(
            data.get("accumulatedTradingValueRaw") or data.get("accumulatedTradingValue")
        ),
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


def fetch_pykrx_history(code, pages=3):
    try:
        from pykrx import stock
    except Exception:  # noqa: BLE001
        return []

    today = today_kst()
    lookback_days = max(45, int(pages * 18))
    start = today - timedelta(days=lookback_days)
    try:
        frame = stock.get_market_ohlcv_by_date(
            start.strftime("%Y%m%d"),
            today.strftime("%Y%m%d"),
            code,
        )
    except Exception:  # noqa: BLE001
        return []
    if frame is None or frame.empty:
        return []

    close_col = "종가"
    volume_col = "거래량"
    if close_col not in frame.columns and len(frame.columns) >= 4:
        close_col = frame.columns[3]
    if volume_col not in frame.columns and len(frame.columns) >= 5:
        volume_col = frame.columns[4]
    if close_col not in frame.columns:
        return []

    history = []
    for index, row in frame.iterrows():
        parsed_date = pd.to_datetime(index, errors="coerce")
        close = parse_int(row.get(close_col))
        if pd.isna(parsed_date) or close is None:
            continue
        history.append(
            {
                "date": parsed_date.strftime("%Y-%m-%d"),
                "close": close,
                "volume": parse_int(row.get(volume_col)) if volume_col in frame.columns else None,
            }
        )
    return history


def fetch_price_history(code, pages=3):
    history = fetch_naver_history(code, pages)
    if history:
        return history
    return fetch_pykrx_history(code, pages)


def fetch_histories(codes, pages=3, max_workers=6):
    histories = {}
    if pages <= 0 or not codes:
        return histories
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_price_history, code, pages): code for code in codes}
        for future in as_completed(tasks):
            code = tasks[future]
            try:
                histories[code] = future.result()
            except Exception:  # noqa: BLE001
                histories[code] = []
    return histories
