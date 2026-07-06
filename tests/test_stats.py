"""Merger episodes, sponsor aggregation, and below-IPO trend coverage filter."""

from datetime import date, datetime

from spac_hunter.constants import KST
from spac_hunter.stats import (
    build_below_ipo_trend,
    build_merger_episodes,
    build_sponsor_stats,
    build_statistics,
)


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


GENERATED_AT = datetime(2026, 6, 10, 18, 30, 0, tzinfo=KST)


def archived_spac(code="900001", sponsor="보관증권", records=None, **kwargs):
    entry = {
        "code": code,
        "name": f"아카이브{code}",
        "sponsor": sponsor,
        "listingDate": "2023-01-02",
        "mergerStatus": "합병 확정",
        "mergerPriceRecords": records or [],
        "finalPrice": 2100,
        "finalRatio": 1.05,
        "badges": ["합병 확정"],
        "lastSeen": "2026-06-09 18:10:05 KST",
        "archivedAt": "2026-06-10T18:30:00+09:00",
        "delistReasonGuess": "합병 신상장 추정",
    }
    entry.update(kwargs)
    return entry


class TestBuildStatisticsWithArchive:
    def test_archived_episodes_join_the_funnel(self, spac_factory):
        active = [
            spac_factory(
                code="100001",
                mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-02-04", "canceled")],
            )
        ]
        archive = [
            archived_spac(records=[record("2024-03-01", "applied"), record("2024-05-30", "confirmed")])
        ]

        baseline = build_statistics(active, GENERATED_AT)["mergerFunnel"]
        funnel = build_statistics(active, GENERATED_AT, archive=archive)["mergerFunnel"]

        assert baseline["successRatePct"] == 0.0
        assert baseline["archivedSpacCount"] == 0
        assert funnel["episodeCount"] == 2
        assert funnel["successCount"] == 1
        assert funnel["failureCount"] == 1
        assert funnel["completedCount"] == 2
        assert funnel["successRatePct"] == 50.0
        assert funnel["archivedSpacCount"] == 1
        assert funnel["avgDaysToConfirmation"] == 90.0

    def test_archived_pending_with_merger_guess_stays_pending(self):
        archive = [
            archived_spac(
                records=[record("2024-03-01", "applied")], delistReasonGuess="합병 신상장 추정"
            )
        ]

        funnel = build_statistics([], GENERATED_AT, archive=archive)["mergerFunnel"]

        # Conservative: a delisted SPAC whose last signal was "applied" is never
        # promoted to success, even when the delist reason hints at a merger.
        assert funnel["pendingCount"] == 1
        assert funnel["successCount"] == 0
        assert funnel["completedCount"] == 0
        assert funnel["successRatePct"] is None
        assert funnel["archivedSpacCount"] == 1

    def test_sponsor_stats_fold_in_archived_spacs(self, spac_factory):
        active = [spac_factory(code="100001", sponsor="하나금융")]  # active, no episodes
        archive = [
            archived_spac(
                code="900001",
                sponsor="하나금융",
                records=[record("2024-03-01", "applied"), record("2024-05-30", "confirmed")],
            ),
            archived_spac(
                code="900002", sponsor="아카이브단독", records=[record("2024-04-01", "applied")]
            ),
        ]

        rows = build_statistics(active, GENERATED_AT, archive=archive)["sponsorStats"]
        by_sponsor = {row["sponsor"]: row for row in rows}

        hana = by_sponsor["하나금융"]
        assert hana["spacCount"] == 1  # active SPACs only
        assert hana["episodeCount"] == 1  # archived episode included
        assert hana["successCount"] == 1
        assert hana["successRatePct"] == 100.0
        assert hana["avgDaysToConfirmation"] == 90.0

        solo = by_sponsor["아카이브단독"]
        assert solo["spacCount"] == 0  # no active SPACs left for this sponsor
        assert solo["episodeCount"] == 1
        assert solo["pendingCount"] == 1

    def test_statistics_archive_overview_shape_and_recent_cap(self, spac_factory):
        archive = [
            archived_spac(code=f"9{idx:05d}", archivedAt=f"2026-05-{idx + 1:02d}T18:30:00+09:00")
            for idx in range(13)
        ]

        overview = build_statistics([spac_factory()], GENERATED_AT, archive=archive)["archive"]

        assert overview["count"] == 13
        assert len(overview["recent"]) == 12
        # Newest archivedAt first; the oldest (idx 0) falls off the cap.
        assert [entry["code"] for entry in overview["recent"]] == [
            f"9{idx:05d}" for idx in range(12, 0, -1)
        ]
        assert set(overview["recent"][0]) == {
            "code",
            "name",
            "sponsor",
            "mergerStatus",
            "lastSeen",
            "finalPrice",
            "delistReasonGuess",
            "postMerger",
        }

    def test_archive_none_or_empty_keeps_active_only_results(self, spac_factory):
        active = [
            spac_factory(
                code="100001",
                mergerPriceRecords=[record("2024-01-05", "applied"), record("2024-03-05", "confirmed")],
            )
        ]

        stats_default = build_statistics(active, GENERATED_AT)
        stats_empty = build_statistics(active, GENERATED_AT, archive=[])

        assert stats_default == stats_empty
        assert stats_default["archive"] == {"count": 0, "recent": []}
        assert stats_default["mergerFunnel"]["archivedSpacCount"] == 0
        assert stats_default["mergerFunnel"]["episodeCount"] == 1
        assert stats_default["mergerFunnel"]["successRatePct"] == 100.0

    def test_note_mentions_archive_scope(self, spac_factory):
        note = build_statistics([spac_factory()], GENERATED_AT)["note"]
        assert note == (
            "현재 상장 스팩과 archive.json에 기록된 상폐 스팩의 합병 공시 이벤트 기준입니다. "
            "아카이브 도입 이전에 상폐된 과거 사례는 포함되지 않습니다."
        )
