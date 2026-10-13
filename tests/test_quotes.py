"""Hana 35 regression: Naver reports 1,915 while KRX closes at 2,005."""

from datetime import datetime

import pytest

from spac_hunter import cli
from spac_hunter.constants import KST
from spac_hunter.sources import kis


@pytest.fixture
def quote_payload(monkeypatch):
    raw = {
        "stck_shrn_iscd": "0041L0", "stck_prpr": "2005", "stck_oprc": "0",
        "prdy_vrss": "0", "prdy_ctrt": "0", "temp_stop_yn": "N", "lstn_stcn": "6030000",
        "acml_vol": "0", "acml_tr_pbmn": "0", "nv": 1915,
    }
    history = {"symbol": "0041L0", "meta": {"hts_kor_isnm": "하나35호스팩"}, "items": [
        {"stck_bsop_date": "20261014", "stck_clpr": "2005", "prdy_vrss": "0", "acml_vol": "0"},
        {"stck_bsop_date": "20261013", "stck_clpr": "2005", "prdy_vrss": "-5",
         "acml_vol": "14496", "acml_tr_pbmn": "28988016"},
        {"stck_bsop_date": "20261012", "stck_clpr": "2010", "prdy_vrss": "0"},
    ]}

    def fetch(path):
        if "/quote?" in path:
            assert path == "/v1/stocks/0041L0/quote?market=J"
            return {"symbol": "0041L0", "raw": raw}
        assert "start_date=" in path and "end_date=" in path
        return history

    monkeypatch.setattr(kis, "_request", fetch)
    return raw, history


def test_preopen_uses_completed_krx_close_not_naver_or_today_placeholder(quote_payload):
    quote = kis.fetch_kis_quote("0041L0", datetime(2026, 10, 14, 7, 40, tzinfo=KST))
    assert quote["price"] == 2005
    assert quote["priceDate"] == "2026-10-13"
    assert quote["change"] == -5
    assert quote["changePct"] == -0.25
    assert quote["volume"] == 14496
    assert quote["tradingValue"] == 28988016
    assert quote["marketCap"] == 12090150000
    assert quote["market"] == "J"
    assert quote["marketStatus"] == "CLOSE"
    assert quote["_regularHistory"][-1]["close"] == 2005
    assert cli.fetch_quotes is kis.fetch_quotes


def test_intraday_uses_explicit_krx_quote_and_preserves_completed_history(quote_payload):
    raw, _ = quote_payload
    raw.update(stck_prpr="2008", stck_oprc="2005", prdy_vrss="3", prdy_ctrt="0.15")
    quote = kis.fetch_kis_quote("0041L0", datetime(2026, 10, 14, 10, 30, tzinfo=KST))
    assert quote["price"] == 2008
    assert quote["priceDate"] == "2026-10-14"
    assert quote["marketStatus"] == "OPEN"
    assert quote["_regularHistory"][-1]["date"] == "2026-10-13"


def test_afterhours_selects_completed_close(quote_payload):
    raw, history = quote_payload
    raw.update(stck_oprc="2005", stck_prpr="1915")
    history["items"][0].update(stck_clpr="2005", prdy_vrss="0")
    quote = kis.fetch_kis_quote("0041L0", datetime(2026, 10, 14, 18, 30, tzinfo=KST))
    assert quote["price"] == 2005
    assert quote["priceDate"] == "2026-10-14"


def test_missing_completed_close_fails_instead_of_using_naver(quote_payload):
    _, history = quote_payload
    history["items"] = []
    with pytest.raises(ValueError, match="확정 정규장 종가 확인 불가"):
        kis.fetch_kis_quote("0041L0", datetime(2026, 10, 14, 7, 40, tzinfo=KST))


def test_wrong_symbol_is_rejected(quote_payload):
    raw, _ = quote_payload
    raw["stck_shrn_iscd"] = "000000"
    with pytest.raises(ValueError, match="종목코드 불일치"):
        kis.fetch_kis_quote("0041L0")
