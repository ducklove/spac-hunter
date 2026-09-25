"""공시 예치금으로 신탁보수 역산, 재예치 공시 정리, 증권사별 보수 추정."""

import argparse
from datetime import date

from spac_hunter.domain.enrich import enrich_spac
from spac_hunter.domain.escrow import (
    build_trust_fee_hints,
    current_contract,
    first_term_start,
    gross_reported,
    implied_trust_fee,
    rate_changes,
)

TAX = 15.4


def change(start, rate_before, before, after, receipt="1", rate=2.5):
    return {
        "receiptNo": receipt,
        "startDate": start,
        "ratePct": rate,
        "rateBeforePct": rate_before,
        "amountBefore": before,
        "amountAfter": after,
    }


# 교보14호스팩(특정금전신탁, 보수 0.1%p): 납입 2023-06-29, 3,850,000주
KYOBO14 = {
    "subscriptionStart": "2023-06-26",
    "subscriptionEnd": "2023-06-27",
    "paymentDate": "2023-06-26",
    "escrowRateChanges": [
        change("2024-06-28", 3.75, 7_700_000_000, 7_937_109_180, "20240701900199", 3.45),
        change("2025-06-30", 3.45, 7_937_109_180, 8_163_295_018, "20250701900230", 2.47),
        change("2025-12-30", 2.47, 8_163_295_018, 8_245_338_592, "20251231900134", 2.84),
    ],
}
# 한국제13호스팩(정기예금형, 보수 없음): 납입 2023-11-06, 4,000,000주
HANKOOK13 = {
    "subscriptionStart": "2023-11-01",
    "subscriptionEnd": "2023-11-02",
    "paymentDate": "2023-11-01",
    "escrowRateChanges": [
        change("2024-11-07", 3.75, 8_000_000_000, 8_254_495_357, "20241107900553", 3.10),
        change("2025-11-07", 3.10, 8_254_495_357, 8_470_977_763, "20251107900178", 2.25),
    ],
}


class TestImpliedTrustFee:
    def test_trust_with_fee(self):
        assert implied_trust_fee(KYOBO14, TAX) == {"pct": 0.1, "observations": 2, "exact": True}

    def test_deposit_without_fee(self):
        assert implied_trust_fee(HANKOOK13, TAX) == {"pct": 0.0, "observations": 1, "exact": True}

    def test_first_term_is_used_only_without_exact_terms(self):
        filing = {**KYOBO14, "escrowRateChanges": KYOBO14["escrowRateChanges"][:1]}
        assert implied_trust_fee(filing, TAX) == {"pct": 0.1, "observations": 1, "exact": False}

    def test_first_term_counts_back_from_maturity(self):
        # KB제29호: 납입 2024-06-14 -> 첫 재예치 2025-06-17. 예치는 12개월 전 2024-06-17 시작.
        assert first_term_start(date(2024, 6, 14), date(2025, 6, 17)) == date(2024, 6, 17)
        # 납입보다 앞설 수는 없다(교보14호).
        assert first_term_start(date(2023, 6, 29), date(2024, 6, 28)) == date(2023, 6, 29)
        assert first_term_start(date(2025, 1, 2), date(2025, 7, 3)) == date(2025, 1, 3)

    def test_inconsistent_rate_or_chain_gap_is_ignored(self):
        filing = {
            "paymentDate": "2024-07-18",
            "escrowRateChanges": [
                # SK증권13호 정정공시: 변경 전 2.42%로 읽혔지만 금액상 약 3.3% -> 버린다.
                change("2025-07-18", 2.42, 8_000_000_000, 8_217_900_000, "20250721900247"),
            ],
        }
        assert implied_trust_fee(filing, TAX) is None
        gap = {
            **HANKOOK13,
            "escrowRateChanges": [
                HANKOOK13["escrowRateChanges"][0],
                change("2025-11-07", 3.10, 8_300_000_000, 8_517_000_000, "20251107900178"),
            ],
        }
        # 사이에 공시가 빠진 구간은 건너뛰고 첫 계약만 쓴다.
        assert implied_trust_fee(gap, TAX) == {"pct": 0.0, "observations": 1, "exact": False}
        assert implied_trust_fee({}, TAX) is None

    def test_correction_replaces_original_of_the_same_date(self):
        filing = {
            "escrowRateChanges": [
                change("2025-07-18", 2.42, 1, 2, "20250721900213", rate=3.35),
                change("2025-07-18", 2.42, 1, 2, "20250721900247", rate=2.42),
                change("2024-01-01", 3.0, 1, 2, "20240101000001"),
            ]
        }
        assert [(c["startDate"], c["receiptNo"]) for c in rate_changes(filing)] == [
            ("2024-01-01", "20240101000001"),
            ("2025-07-18", "20250721900247"),
        ]


# 신영스팩10호(세전 표기): 첫해 이자가 약정 3.6% 그대로 붙고, 세금·보수는 다음 재예치 때 뗀다.
SHINYOUNG10 = {
    "ipoPrice": 2000,
    "offeringShares": 4_575_000,
    "escrowRatePct": 3.6,
    "subscriptionStart": "2024-01-25",
    "subscriptionEnd": "2024-01-26",
    "paymentDate": "2024-01-25",
    "escrowRateChanges": [
        change("2025-01-31", 3.60, 9_150_000_000, 9_480_302_465, "20250203900785", 3.00),
        change("2025-07-31", 3.00, 9_480_302_465, 9_561_963_173, "20250801901075", 2.43),
        change("2026-01-30", 2.43, 9_561_963_173, 9_652_483_010, "20260202900680", 2.77),
        change("2026-07-30", 2.77, 9_652_483_010, 9_764_028_771, "20260731900751", 2.87),
    ],
}


class TestGrossReportedAmounts:
    def test_detects_gross_reporting(self):
        assert gross_reported(SHINYOUNG10) is True
        assert gross_reported(KYOBO14) is False
        assert gross_reported(HANKOOK13) is False
        assert implied_trust_fee(SHINYOUNG10, TAX) is None

    def test_gross_reported_spac_is_valued_from_rate_periods(self):
        args = argparse.Namespace(trust_rate=0.0, trust_rate_label="t", liquidation_haircut=0)
        spac = enrich_spac(
            {"code": "472220", "name": "신영스팩10호", "market": "KOSDAQ", "isin": None},
            {"listingDate": "2024-02-06"},
            {"price": 2100},
            [],
            {"472220": {"payoutDate": "2026-07-30"}},
            args,
            date(2026, 7, 30),
            [],
            {},
            filing=SHINYOUNG10,
        )
        basis = spac["valuationBasis"]
        assert basis["escrowAmountsGross"] is True
        assert basis["anchor"] is None
        # 공시 9,764,028,771원에서 마지막 계약의 세금·보수를 뺀 순잔액 약 9,738,800,000원(주당 2,128.7원).
        # 공시 금액을 그대로 쓰면 주당 2,134.2원으로 5.5원 과대.
        assert abs(spac["trustValuePerShare"] - 9_738_800_000 / 4_575_000) < 0.3


class TestTrustFeeHints:
    def test_sponsor_hint_requires_agreeing_spacs(self):
        hints = build_trust_fee_hints(
            [
                ("한국", HANKOOK13),
                ("한국", {**HANKOOK13}),
                ("교보", KYOBO14),
                ("신한", KYOBO14),
                ("신한", HANKOOK13),
                ("하나", {}),
                (None, KYOBO14),
            ],
            TAX,
        )
        # 신한처럼 값이 엇갈리면 추정하지 않는다.
        assert hints == {"한국": {"pct": 0.0, "count": 2}, "교보": {"pct": 0.1, "count": 1}}

    def test_enrich_uses_own_disclosures_then_sponsor_hint_then_default(self):
        args = argparse.Namespace(trust_rate=0.0, trust_rate_label="t", liquidation_haircut=0)
        young = {
            "ipoPrice": 2000,
            "offeringShares": 4_000_000,
            "escrowRatePct": 2.4,
            "paymentDate": "2026-03-02",
        }

        def fee(name, filing, hints):
            spac = enrich_spac(
                {"code": "000001", "name": name, "market": "KOSDAQ", "isin": None},
                {"listingDate": "2026-03-10"},
                {"price": 2000},
                [],
                {},
                args,
                date(2026, 9, 25),
                [],
                {},
                filing=filing,
                trust_fee_hints=hints,
            )
            basis = spac["valuationBasis"]
            return basis["trustFeePct"], basis["trustFeeSource"]

        hints = {"한국": {"pct": 0.0, "count": 3}}
        assert fee("한국제16호스팩", young, hints) == (0.0, "같은 증권사 스팩 역산(한국 3종목)")
        assert fee("교보21호스팩", young, hints) == (0.1, "기본 가정")
        assert fee("한국제16호스팩", {**young, **KYOBO14, "paymentDate": "2023-06-26"}, hints) == (
            0.1,
            "공시 예치금 역산(2건)",
        )
        # 첫 계약만 있는 역산값(0.13 -> 0.15)은 0.05%p 안의 증권사 값(0.1)으로 맞춘다.
        first_only = {
            **young,
            "paymentDate": "2025-01-16",
            "escrowRateChanges": [change("2026-01-16", 3.0, 8_000_000_000, 8_194_320_000, "2")],
        }
        yuanta = {"유안타": {"pct": 0.1, "count": 2}}
        assert fee("유안타제17호스팩", first_only, {}) == (0.15, "공시 예치금 역산(1건)")
        assert fee("유안타제17호스팩", first_only, yuanta) == (
            0.1,
            "같은 증권사 스팩 역산(유안타 2종목, 첫 계약 역산 0.15%p 보정)",
        )
        assert fee("유안타제17호스팩", first_only, {"유안타": {"pct": 0.15, "count": 3}}) == (
            0.15,
            "공시 예치금 역산(1건)",
        )


class TestEscrowContractRisk:
    ARGS = argparse.Namespace(trust_rate=0.0, trust_rate_label="t", liquidation_haircut=0)

    def contract(self, filing, payout, today):
        return enrich_spac(
            {"code": "000001", "name": "교보15호스팩", "market": "KOSDAQ", "isin": None},
            {"listingDate": "2023-12-05"},
            {"price": 2100},
            [],
            {"000001": {"payoutDate": payout}},
            self.ARGS,
            today,
            [],
            {},
            filing=filing,
        )["escrowContract"]

    def test_disclosed_maturity_after_payout_is_confirmed_risk(self):
        # 교보15호: 2025-12-01 계약, 만기 2026-11-29(공시)
        filing = {
            "paymentDate": "2023-11-28",
            "escrowRateChanges": [
                {**change("2024-11-29", 4.0, 7_000_000_000, 7_231_025_387, "20241202900191", 3.30)},
                {
                    **change("2025-12-01", 3.30, 7_231_025_387, 7_428_047_794, "20251202900057", 2.88),
                    "maturityDate": "2026-11-29",
                    "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20251202900057",
                },
            ],
        }
        contract = self.contract(filing, "2026-10-22", date(2026, 9, 25))
        assert contract == {
            "startDate": "2025-12-01",
            "ratePct": 2.88,
            "maturityDate": "2026-11-29",
            "maturitySource": "공시 만기일",
            "maturityDisclosed": True,
            "receiptNo": "20251202900057",
            "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20251202900057",
            "daysAfterPayout": 38,
            "earlyTerminationRisk": "confirmed",
        }
        # 실제로는 만기(11-29) 뒤 12-21 분배 일정 -> 만기가 먼저면 위험 없음
        assert self.contract(filing, "2026-12-21", date(2026, 9, 25))["earlyTerminationRisk"] is None

    def test_term_or_assumed_twelve_months(self):
        with_term = {**KYOBO14, "escrowRateChanges": [
            *KYOBO14["escrowRateChanges"][:2],
            {**KYOBO14["escrowRateChanges"][2], "termMonths": 3},
        ]}
        contract = self.contract(with_term, "2026-05-18", date(2026, 2, 1))
        assert (contract["maturityDate"], contract["maturitySource"], contract["earlyTerminationRisk"]) == (
            "2026-03-30",
            "공시 계약기간 3개월",
            None,
        )
        # 계약기간 미공시: 직전 계약(2025-06-30~12-30, 6개월)과 같은 기간을 가정한다.
        contract = self.contract(KYOBO14, "2026-05-18", date(2026, 2, 1))
        assert (contract["maturityDate"], contract["maturitySource"], contract["daysAfterPayout"]) == (
            "2026-06-30",
            "계약기간 미공시(직전 계약 6개월 가정)",
            43,
        )
        assert contract["earlyTerminationRisk"] == "possible"
        first_only = {**KYOBO14, "escrowRateChanges": KYOBO14["escrowRateChanges"][:1]}
        contract = self.contract(first_only, "2025-08-01", date(2025, 1, 2))
        assert (contract["maturityDate"], contract["maturitySource"]) == (
            "2025-06-28",
            "계약기간 미공시(12개월 가정)",
        )
        # 가정한 만기가 이미 지났으면(다음 재예치 공시 미반영) 판정하지 않는다.
        assert self.contract(KYOBO14, "2026-05-18", date(2026, 7, 1))["earlyTerminationRisk"] is None

    def test_no_contract_before_first_redeposit(self):
        assert current_contract(KYOBO14, date(2024, 1, 1)) is None
        assert self.contract({"paymentDate": "2023-11-28"}, "2026-10-22", date(2026, 9, 25)) is None
