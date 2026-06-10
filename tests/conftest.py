"""Shared pytest fixtures: network blocker and a SPAC dict factory."""

import socket

import pytest


@pytest.fixture(autouse=True)
def _no_network(monkeypatch):
    """Fail fast if any test accidentally tries to open a network connection."""

    def guard(*args, **kwargs):
        raise RuntimeError("network access is blocked in tests")

    monkeypatch.setattr(socket.socket, "connect", guard)


@pytest.fixture
def spac_factory():
    """Build SPAC dicts carrying every key the output writers index directly."""

    def make_spac(code="000001", name="테스트1호스팩", price=2000, ipo_price=2000, **kwargs):
        ratio = round(price / ipo_price, 4) if price and ipo_price else None
        spac = {
            "id": code,
            "code": code,
            "name": name,
            "market": "KOSDAQ",
            "isin": None,
            "sponsor": None,
            "ipoPrice": ipo_price,
            "currentPrice": price,
            "change": 0,
            "changePct": 0.0,
            "ratio": ratio,
            "premiumPct": round((ratio - 1) * 100, 2) if ratio is not None else None,
            "volume": 1000,
            "tradingValue": 1000 * (price or 0),
            "marketCap": None,
            "estimatedShares": None,
            "listingDate": None,
            "liquidationDate": None,
            "liquidationDateSource": None,
            "daysToLiquidation": None,
            "trustValuePerShare": None,
            "liquidationValuePerShare": None,
            "liquidationValueSource": None,
            "expectedReturn": None,
            "annualizedReturn": None,
            "status": "일반",
            "badges": ["일반"],
            "mergerStatus": None,
            "mergerApplicationDisclosure": None,
            "mergerConfirmationDisclosure": None,
            "mergerCancellationDisclosure": None,
            "mergerDisclosures": [],
            "mergerPriceRecords": [],
            "kind": {},
            "quote": {"price": price},
            "history": [],
            "events": [],
            "disclosureUrl": f"https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm={name}",
            "naverUrl": f"https://finance.naver.com/item/main.naver?code={code}",
        }
        spac.update(kwargs)
        return spac

    return make_spac
