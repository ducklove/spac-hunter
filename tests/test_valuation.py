"""Trust-value estimation, annualized return guards, pct_change, badges."""

from datetime import date

import pytest

from spac_hunter.domain.valuation import (
    build_status_badges,
    calculate_annualized_return,
    estimate_trust_value_from_periods,
    estimate_trust_value_per_share,
    pct_change,
)

TODAY = date(2026, 6, 10)


class TestEstimateTrustValuePerShare:
    def test_no_ipo_price_returns_none(self):
        assert estimate_trust_value_per_share(None, date(2024, 1, 1), date(2027, 1, 1), 0.05, TODAY) is None
        assert estimate_trust_value_per_share(0, date(2024, 1, 1), date(2027, 1, 1), 0.05, TODAY) is None

    def test_with_listing_and_liquidation_dates(self):
        listing = date(2024, 1, 1)
        liquidation = date(2025, 1, 1)  # 366 days (2024 is a leap year)
        expected = 2000 * (1.05 ** (366 / 365))
        assert estimate_trust_value_per_share(2000, listing, liquidation, 0.05, TODAY) == pytest.approx(
            expected
        )

    def test_listing_only_caps_at_three_years(self):
        listing = date(2020, 1, 1)  # far more than 3 years before TODAY
        expected = 2000 * (1.05 ** (1095 / 365))
        assert estimate_trust_value_per_share(2000, listing, None, 0.05, TODAY) == pytest.approx(expected)

    def test_listing_only_uses_elapsed_days(self):
        listing = date(2026, 6, 1)  # 9 days before TODAY
        expected = 2000 * (1.05 ** (9 / 365))
        assert estimate_trust_value_per_share(2000, listing, None, 0.05, TODAY) == pytest.approx(expected)

    def test_no_listing_date_returns_ipo_price(self):
        assert estimate_trust_value_per_share(2000, None, None, 0.05, TODAY) == pytest.approx(2000.0)

    def test_liquidation_before_listing_clamps_to_zero_days(self):
        listing = date(2025, 1, 1)
        liquidation = date(2024, 1, 1)
        assert estimate_trust_value_per_share(2000, listing, liquidation, 0.05, TODAY) == pytest.approx(
            2000.0
        )


class TestEstimateTrustValueFromPeriods:
    def test_no_periods_returns_none(self):
        assert estimate_trust_value_from_periods(2000, date(2024, 1, 1), date(2027, 1, 1), [], TODAY) is None

    def test_simple_interest_per_term_compounds_at_each_redeposit(self):
        start = date(2024, 1, 1)
        end = date(2027, 1, 1)
        periods = [
            {"startDate": date(2024, 1, 1), "rate": 0.03},
            {"startDate": date(2025, 1, 1), "rate": 0.025},
        ]
        # 공시 변경일(2025-01-01)과 이후 12개월 재예치(2026-01-01)마다 이자가 원금에 합산된다.
        expected = 2000 * (1 + 0.03 * 366 / 365) * (1 + 0.025) * (1 + 0.025)

        assert estimate_trust_value_from_periods(2000, start, end, periods, TODAY) == pytest.approx(expected)

    def test_missing_initial_period_uses_first_disclosed_rate(self):
        start = date(2024, 1, 1)
        end = date(2024, 7, 1)
        periods = [{"startDate": date(2024, 3, 1), "rate": 0.04}]
        expected = 2000 * (1 + 0.04 * 60 / 365) * (1 + 0.04 * 122 / 365)

        assert estimate_trust_value_from_periods(2000, start, end, periods, TODAY) == pytest.approx(expected)

    def test_trust_fee_and_interest_tax_reduce_each_term(self):
        periods = [{"startDate": date(2024, 1, 1), "rate": 0.035}]
        value = estimate_trust_value_from_periods(
            2000,
            date(2024, 1, 1),
            date(2025, 1, 1),
            periods,
            TODAY,
            trust_fee_rate=0.001,
            interest_tax_rate=0.154,
        )
        assert value == pytest.approx(2000 * (1 + 0.034 * 0.846 * 366 / 365))

    def test_fee_above_rate_never_produces_negative_interest(self):
        periods = [{"startDate": date(2024, 1, 1), "rate": 0.0005}]
        value = estimate_trust_value_from_periods(
            2000, date(2024, 1, 1), date(2025, 1, 1), periods, TODAY, trust_fee_rate=0.001
        )
        assert value == pytest.approx(2000)

    def test_anchor_restarts_from_disclosed_balance(self):
        periods = [
            {"startDate": date(2024, 1, 1), "rate": 0.05},
            {"startDate": date(2025, 1, 1), "rate": 0.03},
        ]
        value = estimate_trust_value_from_periods(
            2000,
            date(2024, 1, 1),
            date(2025, 7, 1),
            periods,
            TODAY,
            anchor={"date": date(2025, 1, 1), "value": 2080.0},
        )
        assert value == pytest.approx(2080 * (1 + 0.03 * 181 / 365))

    def test_anchor_outside_the_projection_window_is_ignored(self):
        periods = [{"startDate": date(2024, 1, 1), "rate": 0.03}]
        base = estimate_trust_value_from_periods(2000, date(2024, 1, 1), date(2025, 1, 1), periods, TODAY)
        with_late_anchor = estimate_trust_value_from_periods(
            2000,
            date(2024, 1, 1),
            date(2025, 1, 1),
            periods,
            TODAY,
            anchor={"date": date(2025, 6, 1), "value": 2500.0},
        )
        assert with_late_anchor == pytest.approx(base)


class TestDisclosedEscrowBalancesAreReproduced:
    """신탁계약내용변경 공시의 실제 '변경 후 예치금액'을 1주당 0.05원 이내로 재현한다."""

    @staticmethod
    def project(periods, start, end, fee, tax=0.154):
        return estimate_trust_value_from_periods(
            2000,
            start,
            end,
            [{"startDate": day, "rate": pct / 100} for day, pct in periods],
            TODAY,
            trust_fee_rate=fee,
            interest_tax_rate=tax,
        )

    def test_kyobo14_trust_with_fee_and_withholding(self):
        # 교보14호스팩: 3,850,000주, 7,700,000,000원 -> 7,937,109,180 -> 8,163,295,018 -> 8,245,338,592원
        periods = [
            (date(2023, 6, 30), 3.75),
            (date(2024, 6, 28), 3.45),
            (date(2025, 6, 30), 2.47),
            (date(2025, 12, 30), 2.84),
        ]
        start = date(2023, 6, 30)
        for end, amount in (
            (date(2024, 6, 28), 7_937_109_180),
            (date(2025, 6, 30), 8_163_295_018),
            (date(2025, 12, 30), 8_245_338_592),
        ):
            assert self.project(periods, start, end, 0.001) == pytest.approx(amount / 3_850_000, abs=0.05)

    def test_hankook13_deposit_without_trust_fee(self):
        # 한국제13호스팩(예금형, 보수 없음): 4,000,000주, 8,000,000,000원 -> 8,254,495,357 -> 8,470,977,763원
        periods = [(date(2023, 11, 7), 3.75), (date(2024, 11, 7), 3.10), (date(2025, 11, 7), 2.25)]
        start = date(2023, 11, 7)
        for end, amount in ((date(2024, 11, 7), 8_254_495_357), (date(2025, 11, 7), 8_470_977_763)):
            assert self.project(periods, start, end, 0.0) == pytest.approx(amount / 4_000_000, abs=0.05)

    def test_previous_gross_compounding_overstated_interest(self):
        periods = [(date(2023, 6, 30), 3.75), (date(2024, 6, 28), 3.45)]
        net = self.project(periods, date(2023, 6, 30), date(2025, 6, 30), 0.001)
        gross = self.project(periods, date(2023, 6, 30), date(2025, 6, 30), 0.0, tax=0.0)
        disclosed = 8_163_295_018 / 3_850_000
        assert gross - disclosed > 20  # 세전 이자 가정은 2년 만에 1주당 20원 넘게 과대 추정
        assert net == pytest.approx(disclosed, abs=0.05)


class TestCalculateAnnualizedReturn:
    def test_happy_path(self):
        assert calculate_annualized_return(2100, 2000, 365) == pytest.approx(0.05)

    @pytest.mark.parametrize(
        ("target", "price", "days"),
        [
            (None, 2000, 365),
            (0, 2000, 365),
            (2100, None, 365),
            (2100, 0, 365),
            (2100, -100, 365),
            (2100, 2000, None),
            (2100, 2000, 0),
            (2100, 2000, -10),
        ],
    )
    def test_guards_return_none(self, target, price, days):
        assert calculate_annualized_return(target, price, days) is None


class TestPctChange:
    def test_basic(self):
        assert pct_change(2000, 2100) == 5.0
        assert pct_change(2010, 1900) == -5.47

    @pytest.mark.parametrize(
        ("base", "value"),
        [(None, 2100), (2000, None), (0, 2100), (-5, 2100)],
    )
    def test_guards_return_none(self, base, value):
        assert pct_change(base, value) is None


class TestBuildStatusBadges:
    def test_below_ipo(self):
        assert build_status_badges(0.99, None) == ["공모가 이하"]

    def test_near_ipo(self):
        assert build_status_badges(1.005, None) == ["공모가 근접"]

    def test_merger_and_liquidation_and_trade_stop(self):
        badges = build_status_badges(1.2, 100, trade_stop=True, merger_status="합병 확정")
        assert badges == ["합병 확정", "청산 6개월 이내", "거래정지"]

    def test_liquidation_within_a_year(self):
        assert build_status_badges(None, 300) == ["청산 1년 이내"]

    def test_default_badge(self):
        assert build_status_badges(None, None) == ["일반"]
