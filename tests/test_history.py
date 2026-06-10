"""merge_history_points (dedup + 3-year cap) and merge_merger_price_records."""

from datetime import date, timedelta

from spac_hunter.domain.merger import merge_merger_price_records
from spac_hunter.output import merge_history_points

TODAY = date(2026, 6, 10)


class TestMergeHistoryPoints:
    def test_fetched_overrides_existing_for_same_date(self):
        existing = [{"date": "2026-06-01", "close": "1,000", "volume": "10"}]
        fetched = [
            {"date": "2026-06-01", "close": 1010},
            {"date": "2026-06-02", "close": 1020, "volume": 30},
        ]
        merged = merge_history_points(existing, fetched, today=TODAY)
        assert merged == [
            {"date": "2026-06-01", "close": 1010, "volume": None},
            {"date": "2026-06-02", "close": 1020, "volume": 30},
        ]

    def test_existing_points_are_preserved_and_sorted(self):
        existing = [{"date": "2026-06-03", "close": 1030, "volume": 1}]
        fetched = [{"date": "2026-06-01", "close": 1010, "volume": 2}]
        merged = merge_history_points(existing, fetched, today=TODAY)
        assert [point["date"] for point in merged] == ["2026-06-01", "2026-06-03"]

    def test_invalid_points_are_dropped(self):
        merged = merge_history_points(
            [{"date": None, "close": 1000}, {"date": "2026-06-01", "close": None}],
            [{"date": "", "close": 1000}, {"date": "2026-06-02", "close": "abc"}],
            today=TODAY,
        )
        assert merged == []

    def test_three_year_cap_drops_old_points(self):
        cutoff = TODAY - timedelta(days=1095)
        too_old = (cutoff - timedelta(days=1)).isoformat()
        boundary = cutoff.isoformat()
        recent = TODAY.isoformat()
        merged = merge_history_points(
            [
                {"date": too_old, "close": 900, "volume": 1},
                {"date": boundary, "close": 950, "volume": 1},
            ],
            [{"date": recent, "close": 1000, "volume": 1}],
            today=TODAY,
        )
        assert [point["date"] for point in merged] == [boundary, recent]

    def test_empty_inputs(self):
        assert merge_history_points(None, None, today=TODAY) == []


class TestMergeMergerPriceRecords:
    def test_key_is_date_signal_title(self):
        existing = [{"date": "2024-01-05", "signal": "applied", "title": "회사합병결정", "basePrice": 1}]
        fetched = [{"date": "2024-01-05", "signal": "applied", "title": "회사합병결정", "basePrice": 2}]
        merged = merge_merger_price_records(existing, fetched)
        assert len(merged) == 1
        assert merged[0]["basePrice"] == 2  # fetched wins

    def test_legacy_disclosure_title_key_matches_title(self):
        # Legacy records carried disclosureTitle; the merge key treats it the
        # same as title, so the fetched record replaces the legacy one.
        existing = [{"date": "2024-01-05", "signal": "applied", "disclosureTitle": "회사합병결정"}]
        fetched = [{"date": "2024-01-05", "signal": "applied", "title": "회사합병결정", "basePrice": 9}]
        merged = merge_merger_price_records(existing, fetched)
        assert len(merged) == 1
        assert merged[0]["basePrice"] == 9

    def test_different_signal_or_title_kept_separately(self):
        existing = [{"date": "2024-01-05", "signal": "applied", "title": "A"}]
        fetched = [
            {"date": "2024-01-05", "signal": "confirmed", "title": "A"},
            {"date": "2024-01-05", "signal": "applied", "title": "B"},
        ]
        assert len(merge_merger_price_records(existing, fetched)) == 3

    def test_records_without_date_or_signal_are_dropped(self):
        merged = merge_merger_price_records(
            [{"date": None, "signal": "applied"}, {"date": "2024-01-05", "signal": None}],
            [],
        )
        assert merged == []

    def test_sorted_by_date(self):
        merged = merge_merger_price_records(
            [{"date": "2024-03-01", "signal": "confirmed", "title": "B"}],
            [{"date": "2024-01-05", "signal": "applied", "title": "A"}],
        )
        assert [record["date"] for record in merged] == ["2024-01-05", "2024-03-01"]
