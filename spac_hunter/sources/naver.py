"""Naver Finance quote/history clients with a pykrx history fallback."""

import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import timedelta
from io import StringIO

import pandas as pd

from ..constants import NAVER_HISTORY_URL, NAVER_STOCK_API_URL
from ..http import http_json, http_text
from ..parsing import parse_float, parse_int, today_kst


def fetch_naver_quote(code):
    payload = http_json(NAVER_STOCK_API_URL.format(code=code))
    data = (payload.get("datas") or [{}])[0]
    trade_stop = data.get("tradeStopType") or {}
    return {
        "code": code,
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
