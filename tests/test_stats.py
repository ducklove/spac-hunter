"""Merger episodes, sponsor aggregation, and below-IPO trend coverage filter."""

from datetime import date

from spac_hunter.stats import build_below_ipo_trend, build_merger_episodes, build_sponsor_stats


def record(date_text, signal, base_price=2010):
    return {"date": date_text, "signal": signal, "basePrice": base_price, "title": "t"}


class TestBuildMergerEpisodes:
    def test_success_episode(self, spac_factory):
        spac = spac_factory(
            code="100001",
            mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-03-05", "confirmed", 2200)],
        )
        episodes = build_merger_episodes([spac])
        assert len(episodes) == 1
        episode = episodes[0]
        assert episode["status"] == "success"
        assert episode["appliedDate"] == date(2024, 1, 5)
        assert episode["appliedPrice"] == 2010
        assert episode["appliedPremiumPct"] == 0.5  # vs ipoPrice 2000
        assert episode["confirmedDate"] == date(2024, 3, 5)
        assert episode["confirmedPrice"] == 2200
        assert episode["daysToConfirmation"] == 60

    def test_failed_episode(self, spac_factory):
        spac = spac_factory(
            code="100002",
            mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-02-04", "canceled", 1950)],
        )
        episodes = build_merger_episodes([spac])
        assert len(episodes) == 1
        assert episodes[0]["status"] == "failed"
        assert episodes[0]["canceledDate"] == date(2024, 2, 4)
        assert episodes[0]["daysToCancel"] == 30

    def test_pending_episode(self, spac_factory):
        spac = spac_factory(code="100003", mergerPriceRecords=[record("2024-01-05", "applied")])
        episodes = build_merger_episodes([spac])
        assert len(episodes) == 1
        assert episodes[0]["status"] == "pending"

    def test_confirmation_without_application(self, spac_factory):
        spac = spac_factory(code="100004", mergerPriceRecords=[record("2024-03-05", "confirmed")])
        episodes = build_merger_episodes([spac])
        assert len(episodes) == 1
        assert episodes[0]["status"] == "success"
        assert episodes[0]["appliedDate"] is None
        assert episodes[0]["daysToConfirmation"] is None

    def test_cancel_without_open_episode_is_ignored(self, spac_factory):
        spac = spac_factory(code="100005", mergerPriceRecords=[record("2024-01-05", "canceled")])
        assert build_merger_episodes([spac]) == []

    def test_two_episodes_for_one_spac(self, spac_factory):
        spac = spac_factory(
            code="100006",
            mergerPriceRecords=[
                record("2024-01-05", "applied"),
                record("2024-02-04", "canceled"),
                record("2024-05-01", "applied"),
                record("2024-07-01", "confirmed"),
            ],
        )
        episodes = build_merger_episodes([spac])
        assert [episode["status"] for episode in episodes] == ["failed", "success"]


class TestBuildSponsorStats:
    def test_aggregation_and_unknown_sponsor(self, spac_factory):
        spacs = [
            spac_factory(
                code="200001",
                sponsor="하나금융",
                mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-03-05", "confirmed")],
            ),
            spac_factory(
                code="200002",
                sponsor="하나금융",
                mergerPriceRecords=[record("2024-02-01", "applied"), record("2024-04-01", "canceled")],
            ),
            spac_factory(code="200003", sponsor="하나금융"),  # active, no episodes
            spac_factory(code="200004", sponsor=None, mergerPriceRecords=[record("2024-05-01", "applied")]),
        ]
        episodes = build_merger_episodes(spacs)
        stats = build_sponsor_stats(spacs, episodes)

        assert [row["sponsor"] for row in stats] == ["하나금융", "미확인"]
        hana = stats[0]
        assert hana["spacCount"] == 3
        assert hana["episodeCount"] == 2
        assert hana["successCount"] == 1
        assert hana["failureCount"] == 1
        assert hana["pendingCount"] == 0
        assert hana["successRatePct"] == 50.0
        assert hana["avgDaysToConfirmation"] == 60.0

        unknown = stats[1]
        assert unknown["spacCount"] == 1
        assert unknown["episodeCount"] == 1
        assert unknown["pendingCount"] == 1
        assert unknown["successRatePct"] is None  # no completed episodes
        assert unknown["avgDaysToConfirmation"] is None

    def test_sorted_by_episode_count_then_spac_count(self, spac_factory):
        spacs = [
            spac_factory(code="300001", sponsor="A", mergerPriceRecords=[record("2024-01-05", "applied")]),
            spac_factory(
                code="300002",
                sponsor="B",
                mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-03-05", "confirmed")],
            ),
            spac_factory(code="300003", sponsor="B", mergerPriceRecords=[record("2024-02-01", "applied")]),
            spac_factory(code="300004", sponsor="A"),
            spac_factory(code="300005", sponsor="C", mergerPriceRecords=[record("2024-01-09", "applied")]),
        ]
        episodes = build_merger_episodes(spacs)
        stats = build_sponsor_stats(spacs, episodes)
        # B has 2 episodes; A and C have 1 each, but A has 2 active SPACs.
        assert [row["sponsor"] for row in stats] == ["B", "A", "C"]

    def test_top_20_limit(self, spac_factory):
        spacs = [
            spac_factory(
                code=f"4{idx:05d}",
                sponsor=f"스폰서{idx:02d}",
                mergerPriceRecords=[record("2024-01-05", "applied")],
            )
            for idx in range(25)
        ]
        episodes = build_merger_episodes(spacs)
        stats = build_sponsor_stats(spacs, episodes)
        assert len(stats) == 20

    def test_sponsors_without_episodes_are_not_listed(self, spac_factory):
        spacs = [spac_factory(code="500001", sponsor="조용한증권")]
        assert build_sponsor_stats(spacs, build_merger_episodes(spacs)) == []


class TestBuildBelowIpoTrend:
    def test_coverage_filter_and_aggregates(self, spac_factory):
        # 6 active SPACs -> min coverage = max(5, int(6 * 0.7)) = 5.
        ratios_day1 = [0.99, 0.995, 1.0, 1.005, 1.02]
        spacs = []
        for idx, ratio in enumerate(ratios_day1):
            spacs.append(
                spac_factory(
                    code=f"6{idx:05d}",
                    history=[
                        {"date": "2026-06-01", "close": int(2000 * ratio), "ratio": ratio, "volume": 1},
                        # only 4 of the 6 SPACs have a point on 06-02
                        *(
                            [{"date": "2026-06-02", "close": 2000, "ratio": 1.0, "volume": 1}]
                            if idx < 4
                            else []
                        ),
                    ],
                )
            )
        spacs.append(spac_factory(code="699999", history=[]))  # active, no history

        trend = build_below_ipo_trend(spacs)
        assert [row["date"] for row in trend] == ["2026-06-01"]  # 06-02 lacks coverage
        row = trend[0]
        assert row["totalCount"] == 5
        assert row["belowCount"] == 2  # 0.99, 0.995
        assert row["nearCount"] == 4  # <= 1.01
        assert row["belowPct"] == 40.0
        assert row["averageRatio"] == 1.002

    def test_points_without_ratio_are_ignored(self, spac_factory):
        spacs = [
            spac_factory(
                code=f"7{idx:05d}",
                history=[{"date": "2026-06-01", "close": 2000, "ratio": None, "volume": 1}],
            )
            for idx in range(6)
        ]
        assert build_below_ipo_trend(spacs) == []
