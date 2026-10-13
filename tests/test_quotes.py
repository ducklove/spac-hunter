"""Only the KRX regular-session fields may become dashboard prices."""

import json

import pytest

from spac_hunter.sources import naver


@pytest.fixture
def quote_payload(monkeypatch):
    row = {
        "cd": "0209J0", "nm": "테스트스팩", "nv": 1900, "cv": 5, "cr": 0.26,
        "rf": "5", "ms": "CLOSE", "tyn": "Y", "aq": 0, "aa": 0,
        "countOfListedStock": 1000000, "nxtOverMarketPriceInfo": {"closePrice": 2500},
    }
    payload = {"result": {"areas": [
        {"name": "INTEGRATED", "datas": [{"cd": "0209J0", "nv": 3000}]},
        {"name": "SERVICE_ITEM", "datas": [row]},
    ]}}

    def fetch(url, encoding):
        assert url.endswith("query=SERVICE_ITEM:0209J0")
        assert encoding == "euc-kr"
        return json.dumps(payload, ensure_ascii=False)

    monkeypatch.setattr(naver, "http_text", fetch)
    return row


def test_regular_close_ignores_extended_and_integrated_prices(quote_payload):
    quote = naver.fetch_naver_quote("0209J0")
    assert quote["price"] == 1900
    assert quote["change"] == -5
    assert quote["changePct"] == -0.26
    assert quote["volume"] == quote["tradingValue"] == 0
    assert quote["marketCap"] == 1900000000
    assert quote["tradeStop"] is True
    assert quote["priceSession"] == "regular"
    assert quote["source"] == "네이버 증권 정규장 종가"
    assert quote["tradedAt"] is None


def test_open_regular_quote_preserves_rising_sign_and_name(quote_payload):
    quote_payload.update(ms="OPEN", rf="2", cv=5, cr=0.26, tyn="N")
    quote = naver.fetch_naver_quote("0209J0")
    assert quote["name"] == "테스트스팩"
    assert quote["change"] == 5
    assert quote["changePct"] == 0.26
    assert quote["tradeStop"] is False
    assert quote["source"] == "네이버 증권 정규장"


@pytest.mark.parametrize("bad", [{"nv": None}, {"nv": 0}, {"cd": "000000"}, {"ms": "AFTER"}])
def test_unknown_price_or_market_is_rejected(quote_payload, bad):
    quote_payload.update(bad)
    quotes, errors = naver.fetch_quotes(["0209J0"])
    assert quotes == {}
    assert "정규장 시세 확인 불가" in errors["0209J0"]
