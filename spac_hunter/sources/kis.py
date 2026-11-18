"""KOSDAQ stock master and KRX regular-session quotes from KIS."""

import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta
from io import BytesIO
from zipfile import ZipFile

from requests.exceptions import RetryError

from ..constants import KIS_PROXY_URL, KST
from ..http import http_json, shared_session
from ..parsing import parse_date, parse_float, parse_int

KOSDAQ_MASTER_URL = "https://new.real.download.dws.co.kr/common/master/kosdaq_code.mst.zip"
# KIS 공식 코스닥 마스터 형식: 줄바꿈 제외 고정폭 221자, 기업인수목적회사여부 오프셋 24.
_MASTER_TRAILER_WIDTH = 221
_SPAC_FLAG_OFFSET = 24

_request_lock = threading.Lock()
_last_request = 0.0


def _parse_kosdaq_spac_master(content):
    with ZipFile(BytesIO(content)) as archive:
        rows = archive.read("kosdaq_code.mst").decode("cp949").splitlines()

    spacs = {}
    for row in rows:
        identity, fields = row[:-_MASTER_TRAILER_WIDTH], row[-_MASTER_TRAILER_WIDTH:]
        if len(identity) <= 21 or fields[_SPAC_FLAG_OFFSET] not in {"Y", "N"}:
            raise ValueError("코스닥 종목 마스터 형식 오류")
        if fields[_SPAC_FLAG_OFFSET] != "Y":
            continue

        code = identity[:9].strip()
        isin = identity[9:21].strip()
        name = identity[21:].strip()
        if (
            fields[:2] != "ST"
            or not re.fullmatch(r"[0-9A-Z]{6}", code)
            or not re.fullmatch(r"KR[0-9A-Z]{10}", isin)
            or not name
            or code in spacs
        ):
            raise ValueError(f"코스닥 종목 마스터 스팩 정보 오류: {code}")
        spacs[code] = {
            "code": code,
            "name": name,
            "market": "KOSDAQ",
            "isin": isin,
            "source": "한국투자증권 코스닥 종목 마스터",
        }

    if not spacs:
        raise ValueError("코스닥 종목 마스터 스팩 0건")
    return sorted(spacs.values(), key=lambda item: (item["name"], item["code"]))


def fetch_kis_spac_universe():
    response = shared_session().get(KOSDAQ_MASTER_URL, timeout=15)
    response.raise_for_status()
    return _parse_kosdaq_spac_master(response.content)


def _request(path):
    # 공용 프록시의 분당 120회 한도에 여유를 두고 분당 최대 100회로 제한한다.
    global _last_request
    with _request_lock:
        delay = 0.6 - (time.monotonic() - _last_request)
        if delay > 0:
            time.sleep(delay)
        _last_request = time.monotonic()
    for attempt in range(4):
        try:
            return http_json(KIS_PROXY_URL + path)
        except RetryError as exc:
            if "429" not in str(exc) or attempt == 3:
                raise
            time.sleep(15)


def fetch_kis_quote(code, now=None):
    now = now or datetime.now(KST)
    now = now.astimezone(KST)
    payload = _request(f"/v1/stocks/{code}/quote?market=J")
    raw = payload.get("raw") or {}
    if payload.get("symbol") != code or raw.get("stck_shrn_iscd") != code:
        raise ValueError(f"{code}: KRX 종목코드 불일치")
    price = parse_int(raw.get("stck_prpr"))
    if not price or price <= 0:
        raise ValueError(f"{code}: KRX 정규장 시세 확인 불가")
    seconds = now.hour * 3600 + now.minute * 60 + now.second
    session_open = now.weekday() < 5 and 9 * 3600 <= seconds < 15.5 * 3600
    session_open = session_open and (parse_int(raw.get("stck_oprc")) or 0) > 0
    completed_until = now.date() if seconds >= 15.5 * 3600 else now.date() - timedelta(days=1)
    start = now.date() - timedelta(days=14)
    history_payload = _request(
        f"/v1/stocks/{code}/history?start_date={start.isoformat()}&end_date={now.date().isoformat()}"
    )
    if history_payload.get("symbol") != code:
        raise ValueError(f"{code}: KRX 종가 종목코드 불일치")
    rows = []
    for row in history_payload.get("items") or []:
        day = parse_date(row.get("stck_bsop_date"))
        close = parse_int(row.get("stck_clpr"))
        if day and day <= completed_until and close and close > 0:
            rows.append((day, row))
    rows.sort(key=lambda entry: entry[0])
    if not rows and not session_open:
        raise ValueError(f"{code}: 확정 정규장 종가 확인 불가")

    change = parse_int(raw.get("prdy_vrss"))
    change_pct = parse_float(raw.get("prdy_ctrt"))
    volume = parse_int(raw.get("acml_vol"))
    trading_value = parse_int(raw.get("acml_tr_pbmn"))
    price_date = now.date()
    if not session_open:
        price_date, latest = rows[-1]
        price = parse_int(latest.get("stck_clpr"))
        change = parse_int(latest.get("prdy_vrss"))
        previous_close = price - change if change is not None else None
        change_pct = (
            round(change / previous_close * 100, 2) if previous_close and previous_close > 0 else None
        )
        volume = parse_int(latest.get("acml_vol"))
        trading_value = parse_int(latest.get("acml_tr_pbmn"))
    shares = parse_int(raw.get("lstn_stcn"))
    return {
        "code": code,
        "name": (history_payload.get("meta") or {}).get("hts_kor_isnm"),
        "price": price, "change": change, "changePct": change_pct,
        "volume": volume, "tradingValue": trading_value,
        "marketCap": shares * price if shares and shares > 0 else None,
        "marketStatus": "OPEN" if session_open else "CLOSE",
        "tradeStop": raw.get("temp_stop_yn") == "Y",
        "tradeStopText": "거래정지" if raw.get("temp_stop_yn") == "Y" else None,
        "tradedAt": None, "priceDate": price_date.isoformat(), "priceSession": "regular", "market": "J",
        "source": "한국투자증권 KRX 정규장" if session_open else "한국투자증권 KRX 정규장 종가",
        "_regularHistory": [
            {"date": day.isoformat(), "close": parse_int(row.get("stck_clpr")),
             "volume": parse_int(row.get("acml_vol"))}
            for day, row in rows
        ],
    }


def fetch_quotes(codes, max_workers=8):
    quotes, errors = {}, {}
    with ThreadPoolExecutor(max_workers=max(1, min(max_workers, 2))) as executor:
        tasks = {executor.submit(fetch_kis_quote, code): code for code in codes or []}
        for future in as_completed(tasks):
            code = tasks[future]
            try:
                quotes[code] = future.result()
            except Exception as exc:  # noqa: BLE001 — let the existing write guard reject source outages
                errors[code] = str(exc)
    return quotes, errors
