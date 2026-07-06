"""resolve_tracking_target, track_post_merger accumulation, and postMergerFlow stats."""

from datetime import datetime

from spac_hunter import postmerger
from spac_hunter.constants import KST
from spac_hunter.stats import build_post_merger_flow, build_statistics

GENERATED_AT = datetime(2026, 7, 6, 18, 30, 0, tzinfo=KST)


def archived_entry(code="900001", **kwargs):
    entry = {
        "code": code,
        "name": f"보관{code}스팩",
        "sponsor": "보관증권",
        "listingDate": "2023-01-02",
        "ipoPrice": 2000,
        "mergerStatus": "합병 확정",
        "mergerPriceRecords": [],
        "finalPrice": 2500,
        "finalRatio": 1.25,
        "badges": ["합병 확정"],
        "lastSeen": "2026-06-30 18:10:00 KST",
        "archivedAt": "2026-07-01T18:30:00+09:00",
        "delistReasonGuess": "합병 신상장 추정",
    }
    entry.update(kwargs)
    return entry


def quote(price=3000, name="새회사", trade_stop=False):
    return {"code": "900001", "name": name, "price": price, "tradeStop": trade_stop}


def make_fetchers(quotes=None, histories=None, quote_errors=None, calls=None):
    quotes = quotes or {}
    histories = histories or {}
    quote_errors = quote_errors or {}

    def quote_fetcher(codes, max_workers=4):
        if calls is not None:
            calls.append(("quotes", tuple(codes)))
        return (
            {code: quotes[code] for code in codes if code in quotes},
            {code: quote_errors[code] for code in codes if code in quote_errors},
        )

    def history_fetcher(codes, pages, max_workers=4):
        if calls is not None:
            calls.append(("histories", tuple(codes), pages))
        return {code: histories.get(code, []) for code in codes}

    return quote_fetcher, history_fetcher


def run_tracking(entries, overrides=None, **fetcher_kwargs):
    quote_fetcher, history_fetcher = make_fetchers(**fetcher_kwargs)
    return postmerger.track_post_merger(
        entries,
        overrides or {},
        GENERATED_AT,
        quote_fetcher=quote_fetcher,
        history_fetcher=history_fetcher,
    )


class TestResolveTrackingTarget:
    def test_merger_delisted_entry_tracks_same_code(self):
        entry = archived_entry()
        assert postmerger.resolve_tracking_target(entry, {}) == (
            "900001",
            postmerger.SOURCE_SAME_CODE,
        )

    def test_unknown_delist_reason_is_not_tracked(self):
        entry = archived_entry(delistReasonGuess="사유 미확인")
        assert postmerger.resolve_tracking_target(entry, {}) == (None, None)

    def test_override_code_wins_and_enables_extinctive_mergers(self):
        entry = archived_entry(delistReasonGuess="사유 미확인")
        code, source = postmerger.resolve_tracking_target(entry, {"postMergerCode": "123456"})
        assert (code, source) == ("123456", postmerger.SOURCE_OVERRIDE)


class TestDeriveIpoPrice:
    def test_explicit_ipo_price_wins(self):
        assert postmerger.derive_ipo_price(archived_entry(ipoPrice=10000)) == 10000

    def test_legacy_entry_backfills_from_final_ratio(self):
        entry = archived_entry(ipoPrice=None, finalPrice=2500, finalRatio=1.25)
        assert postmerger.derive_ipo_price(entry) == 2000

    def test_missing_inputs_give_none(self):
        entry = archived_entry(ipoPrice=None, finalPrice=None, finalRatio=None)
        assert postmerger.derive_ipo_price(entry) is None


class TestTrackPostMerger:
    def test_builds_tracking_block_with_returns_and_cutoff(self):
        entry = archived_entry()
        history = [
            {"date": "2026-06-30", "close": 2500, "volume": 100},  # 스팩 시절: 컷오프로 제외
            {"date": "2026-07-02", "close": 2800, "volume": 200},
            {"date": "2026-07-03", "close": 3200, "volume": 300},
        ]
        changed, errors = run_tracking(
            [entry],
            quotes={"900001": quote(price=3000)},
            histories={"900001": history},
        )

        assert changed is True
        assert errors == {}
        block = entry["postMerger"]
        assert block["code"] == "900001"
        assert block["source"] == postmerger.SOURCE_SAME_CODE
        assert block["name"] == "새회사"
        assert block["status"] == postmerger.STATUS_TRACKING
        assert block["price"] == 3000
        assert [point["date"] for point in block["history"]] == ["2026-07-02", "2026-07-03"]
        assert block["asOf"] == "2026-07-03"
        assert block["returnVsFinalPct"] == 20.0  # 2500 -> 3000
        assert block["returnVsIpoPct"] == 50.0  # 2000 -> 3000
        assert (block["highPrice"], block["highDate"]) == (3200, "2026-07-03")
        assert (block["lowPrice"], block["lowDate"]) == (2800, "2026-07-02")
        assert block["trackedTradingDays"] == 2

    def test_fetch_failure_preserves_accumulated_history(self):
        entry = archived_entry()
        run_tracking(
            [entry],
            quotes={"900001": quote(price=3000)},
            histories={"900001": [{"date": "2026-07-02", "close": 2800, "volume": 200}]},
        )

        changed, errors = run_tracking([entry], quote_errors={"900001": "boom"})

        assert changed is True  # status tracking -> unavailable
        assert errors == {"900001": "900001: boom"}
        block = entry["postMerger"]
        assert block["status"] == postmerger.STATUS_UNAVAILABLE
        assert [point["date"] for point in block["history"]] == ["2026-07-02"]
        assert block["price"] == 2800  # 마지막 종가로 유지

        changed, _ = run_tracking([entry], quote_errors={"900001": "boom"})
        assert changed is False  # 동일 블록이면 archive.json을 다시 쓰지 않는다

    def test_trade_stop_marks_halted(self):
        entry = archived_entry()
        changed, _ = run_tracking(
            [entry], quotes={"900001": quote(price=2500, name="보관900001스팩", trade_stop=True)}
        )
        assert changed is True
        assert entry["postMerger"]["status"] == postmerger.STATUS_HALTED

    def test_auto_window_expiry_marks_ended_without_fetching(self):
        entry = archived_entry(archivedAt="2025-05-01T18:30:00+09:00")
        entry["postMerger"] = {"code": "900001", "status": postmerger.STATUS_TRACKING}
        calls = []
        changed, errors = run_tracking([entry], calls=calls)

        assert calls == []  # 만료된 자동 추적은 네트워크를 타지 않는다
        assert changed is True
        assert entry["postMerger"]["status"] == postmerger.STATUS_ENDED
        assert errors == {}

        changed, _ = run_tracking([entry], calls=calls)
        assert changed is False

    def test_override_keeps_tracking_beyond_auto_window(self):
        entry = archived_entry(archivedAt="2025-05-01T18:30:00+09:00")
        changed, _ = run_tracking(
            [entry],
            overrides={"900001": {"postMergerCode": "123456"}},
            quotes={"123456": {"code": "123456", "name": "새회사", "price": 4000, "tradeStop": False}},
        )
        assert changed is True
        assert entry["postMerger"]["code"] == "123456"
        assert entry["postMerger"]["status"] == postmerger.STATUS_TRACKING

    def test_non_eligible_entries_are_untouched(self):
        entry = archived_entry(delistReasonGuess="사유 미확인")
        calls = []
        changed, errors = run_tracking([entry], calls=calls)
        assert (changed, errors) == (False, {})
        assert calls == []
        assert "postMerger" not in entry


class TestPostMergerFlowStats:
    def entry_with_block(self, code="900001", archivedAt="2026-07-01T18:30:00+09:00", **block):
        entry = archived_entry(code=code, archivedAt=archivedAt)
        entry["postMerger"] = {
            "code": code,
            "source": postmerger.SOURCE_SAME_CODE,
            "name": "새회사",
            "status": postmerger.STATUS_TRACKING,
            "price": 3000,
            "asOf": "2026-07-03",
            "returnVsFinalPct": 20.0,
            "returnVsIpoPct": 50.0,
            "highPrice": 3200,
            "highDate": "2026-07-03",
            "lowPrice": 2800,
            "lowDate": "2026-07-02",
            "trackedTradingDays": 2,
            "history": [
                {"date": "2026-07-02", "close": 2800, "volume": 200},
                {"date": "2026-07-03", "close": 3200, "volume": 300},
            ],
        }
        entry["postMerger"].update(block)
        return entry

    def test_flow_summary_and_entries(self):
        winner = self.entry_with_block()
        loser = self.entry_with_block(
            code="900002",
            archivedAt="2026-07-02T18:30:00+09:00",
            price=2000,
            returnVsFinalPct=-20.0,
            returnVsIpoPct=0.0,
        )
        unavailable = self.entry_with_block(
            code="900003",
            status=postmerger.STATUS_UNAVAILABLE,
            price=None,
            returnVsFinalPct=None,
            returnVsIpoPct=None,
        )

        flow = build_post_merger_flow([winner, loser, unavailable])

        assert flow["trackedCount"] == 2
        assert flow["unavailableCount"] == 1
        assert flow["avgReturnVsFinalPct"] == 0.0
        assert flow["medianReturnVsFinalPct"] == 0.0
        assert flow["avgReturnVsIpoPct"] == 25.0
        assert flow["winRatePct"] == 50.0
        assert [row["spacCode"] for row in flow["entries"]] == ["900002", "900001", "900003"]
        top = flow["entries"][1]
        assert top["name"] == "새회사"
        assert "history" not in top  # data.js 크기 보호: 원본 히스토리는 넣지 않는다
        assert top["spark"] == [
            {"date": "2026-07-02", "ratio": 1.12},
            {"date": "2026-07-03", "ratio": 1.28},
        ]

    def test_entries_without_block_are_ignored(self):
        flow = build_post_merger_flow([archived_entry()])
        assert flow["trackedCount"] == 0
        assert flow["entries"] == []

    def test_statistics_payload_includes_post_merger_flow(self):
        stats = build_statistics([], GENERATED_AT, archive=[self.entry_with_block()])
        assert stats["postMergerFlow"]["trackedCount"] == 1
