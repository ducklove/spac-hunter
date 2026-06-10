"""Edge cases for parse_int/parse_float/parse_date, add_months, names, sponsors."""

from datetime import date

import pytest

from spac_hunter.domain.valuation import derive_sponsor
from spac_hunter.parsing import add_months, normalize_name, parse_date, parse_float, parse_int


class TestParseInt:
    @pytest.mark.parametrize(
        ("value", "expected"),
        [
            (None, None),
            ("", None),
            ("-", None),
            ("1,234", 1234),
            ("-1,234", -1234),
            ("12%", 12),  # regex grabs the leading integer
            ("abc", None),
            (42, 42),
            (3.9, 3),  # int() truncation
            ("  2,000원 ", 2000),
        ],
    )
    def test_values(self, value, expected):
        assert parse_int(value) == expected

    def test_nan_returns_none(self):
        assert parse_int(float("nan")) is None


class TestParseFloat:
    @pytest.mark.parametrize(
        ("value", "expected"),
        [
            (None, None),
            ("", None),
            ("-", None),
            ("1,234.5", 1234.5),
            ("3.25%", 3.25),
            ("-0.5", -0.5),
            ("abc", None),
            (2, 2.0),
        ],
    )
    def test_values(self, value, expected):
        assert parse_float(value) == expected

    def test_nan_returns_none(self):
        assert parse_float(float("nan")) is None


class TestParseDate:
    @pytest.mark.parametrize(
        ("value", "expected"),
        [
            ("2024-01-02", date(2024, 1, 2)),
            ("2024.01.02", date(2024, 1, 2)),
            ("20240102", date(2024, 1, 2)),
            (" 2024-01-02 ", date(2024, 1, 2)),
            ("2024/01/02", None),
            ("", None),
            (None, None),
            ("not a date", None),
        ],
    )
    def test_values(self, value, expected):
        assert parse_date(value) == expected


class TestAddMonths:
    def test_leap_year_february(self):
        assert add_months(date(2024, 1, 31), 1) == date(2024, 2, 29)

    def test_non_leap_year_february(self):
        assert add_months(date(2023, 1, 31), 1) == date(2023, 2, 28)

    def test_feb_29_plus_a_year_clamps(self):
        assert add_months(date(2024, 2, 29), 12) == date(2025, 2, 28)

    def test_century_rule(self):
        # 2100 is not a leap year (divisible by 100 but not 400).
        assert add_months(date(2100, 1, 31), 1) == date(2100, 2, 28)

    def test_year_rollover(self):
        assert add_months(date(2024, 11, 15), 2) == date(2025, 1, 15)

    def test_negative_months(self):
        assert add_months(date(2024, 3, 31), -1) == date(2024, 2, 29)

    def test_liquidation_horizon(self):
        assert add_months(date(2024, 6, 19), 36) == date(2027, 6, 19)


class TestNormalizeName:
    def test_strips_whitespace_and_uppercases(self):
        assert normalize_name(" 삼성 스팩 1호 ") == "삼성스팩1호"
        assert normalize_name("abc spac") == "ABCSPAC"

    def test_none_and_empty(self):
        assert normalize_name(None) == ""
        assert normalize_name("") == ""


class TestDeriveSponsor:
    @pytest.mark.parametrize(
        ("name", "expected"),
        [
            ("하나금융25호스팩", "하나금융"),       # 제N호스팩 with optional 제
            ("IBKS제24호스팩", "IBKS"),
            ("삼성스팩2호", "삼성"),                # 스팩N호
            ("미래에셋비전스팩9호", "미래에셋비전"),
            ("교보스팩", "교보"),                   # bare 스팩 suffix
            ("스팩", None),                         # empty sponsor collapses to None
            ("삼성전자", None),                     # not a SPAC name
        ],
    )
    def test_patterns(self, name, expected):
        assert derive_sponsor(name) == expected
