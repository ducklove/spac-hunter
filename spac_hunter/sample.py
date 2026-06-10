"""Bundled sample dataset used by ``--sample`` (no network required)."""

import argparse
import math
from datetime import datetime, timedelta

from .constants import DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE, DEFAULT_TRUST_RATE, KST
from .domain.enrich import enrich_spac


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
