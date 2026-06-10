"""KOSDAQ SPAC universe collection with a layered fallback chain.

Order of preference:
1. pykrx internal API (``상장종목검색``) — richest payload (includes ISIN).
2. pykrx public API (``get_market_ticker_list`` + ``get_market_ticker_name``).
3. The universe (code/name) already present in the existing ``data.js``.

Only when every layer fails is a ``RuntimeError`` raised.
"""

import logging

logger = logging.getLogger(__name__)


def _is_spac_name(name: str) -> bool:
    return "스팩" in name or "SPAC" in name.upper()


def _universe_from_pykrx_internal():
    from pykrx.website.krx.market import core

    cls = getattr(core, "상장종목검색")
    frame = cls().fetch("KSQ")
    rows = frame.to_dict("records")

    universe = []
    for row in rows:
        name = str(row.get("codeName") or "").strip()
        code = str(row.get("short_code") or "").strip()
        if not name or not code:
            continue
        if not _is_spac_name(name):
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
    return universe


def _universe_from_pykrx_public():
    from pykrx import stock

    universe = []
    for ticker in stock.get_market_ticker_list(market="KOSDAQ"):
        code = str(ticker or "").strip()
        if not code:
            continue
        name = str(stock.get_market_ticker_name(code) or "").strip()
        if not name or not _is_spac_name(name):
            continue
        universe.append(
            {
                "code": code,
                "name": name,
                "market": "KOSDAQ",
                "isin": None,
                "source": "pykrx 공개 API",
            }
        )
    return universe


def _universe_from_existing(existing_spacs):
    universe = []
    for code, spac in (existing_spacs or {}).items():
        name = str(spac.get("name") or "").strip()
        if not code or not name:
            continue
        universe.append(
            {
                "code": code,
                "name": name,
                "market": spac.get("market") or "KOSDAQ",
                "isin": spac.get("isin"),
                "source": "기존 data.js universe 재사용",
            }
        )
    return universe


def fetch_krx_spac_universe(existing_spacs=None):
    failures = []

    try:
        universe = _universe_from_pykrx_internal()
        if universe:
            return sorted(universe, key=lambda item: (item["name"], item["code"]))
        failures.append("KRX 상장종목검색: 스팩 종목 0건")
    except Exception as exc:  # noqa: BLE001
        failures.append(f"KRX 상장종목검색 수집 실패: {exc}")
    logger.warning("KRX internal universe failed (%s); trying pykrx public API", failures[-1])

    try:
        universe = _universe_from_pykrx_public()
        if universe:
            return sorted(universe, key=lambda item: (item["name"], item["code"]))
        failures.append("pykrx 공개 API: 스팩 종목 0건")
    except Exception as exc:  # noqa: BLE001
        failures.append(f"pykrx 공개 API 수집 실패: {exc}")
    logger.warning("pykrx public universe failed (%s); reusing existing data.js universe", failures[-1])

    universe = _universe_from_existing(existing_spacs)
    if universe:
        logger.warning(
            "WARNING: reusing %d SPACs from existing data.js as the universe fallback",
            len(universe),
        )
        return sorted(universe, key=lambda item: (item["name"], item["code"]))
    failures.append("기존 data.js universe 없음")

    raise RuntimeError("KRX 유니버스 수집 실패: " + " / ".join(failures))
