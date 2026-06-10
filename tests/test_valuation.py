"""Trust-value estimation, annualized return guards, pct_change, badges."""

from datetime import date

import pytest

from spac_hunter.domain.valuation import (
    build_status_badges,
    calculate_annualized_return,
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
