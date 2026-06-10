"""build_merger_price_records: base/next/latest/high/low around disclosure dates."""

from spac_hunter.domain.merger import build_merger_price_records

HISTORY = [
    {"date": "2024-01-02", "close": 2000, "ratio": 1.0, "volume": 100},
    {"date": "2024-01-04", "close": 2010, "ratio": 1.005, "volume": 100},
    {"date": "2024-01-08", "close": 2100, "ratio": 1.05, "volume": 100},
    {"date": "2024-01-09", "close": 1900, "ratio": 0.95, "volume": 100},
    {"date": "2024-01-10", "close": 2050, "ratio": 1.025, "volume": 100},
]


def applied_disclosure(date_text="2024-01-05 12:34"):
    return {
        "date": date_text,
        "title": "회사합병결정",
        "source": "KIND 공시검색",
        "url": "https://kind.example.test/view",
        "mergerSignal": "applied",
    }


def test_record_prices_relative_to_disclosure_date():
    records = build_merger_price_records([applied_disclosure()], HISTORY)
    assert len(records) == 1
    record = records[0]

    # Event date is truncated to the date part of the disclosure timestamp.
    assert record["date"] == "2024-01-05"
    assert record["label"] == "합병 신청"
    assert record["signal"] == "applied"
    assert record["title"] == "회사합병결정"
    assert record["url"] == "https://kind.example.test/view"

    # base = last point on/before the event, carrying its ratio.
    assert record["baseDate"] == "2024-01-04"
    assert record["basePrice"] == 2010
    assert record["baseRatio"] == 1.005

    # next = first point strictly after the event.
    assert record["nextDate"] == "2024-01-08"
    assert record["nextPrice"] == 2100
    assert record["nextReturnPct"] == 4.48  # (2100/2010 - 1) * 100

    # latest = last point overall.
    assert record["latestDate"] == "2024-01-10"
    assert record["latestPrice"] == 2050
    assert record["latestReturnPct"] == 1.99

    # high/low among points after the event.
    assert record["highDate"] == "2024-01-08"
    assert record["highPrice"] == 2100
    assert record["highReturnPct"] == 4.48
    assert record["lowDate"] == "2024-01-09"
    assert record["lowPrice"] == 1900
    assert record["lowReturnPct"] == -5.47

    assert record["observedTradingDays"] == 3


def test_event_before_first_point_has_no_base():
    records = build_merger_price_records([applied_disclosure("2024-01-01")], HISTORY)
    record = records[0]
    assert record["baseDate"] is None
    assert record["basePrice"] is None
    assert record["nextReturnPct"] is None  # pct_change guards on missing base
    assert record["nextDate"] == "2024-01-02"


def test_event_after_last_point_has_no_next_or_high_low():
    records = build_merger_price_records([applied_disclosure("2024-02-01")], HISTORY)
    record = records[0]
    assert record["baseDate"] == "2024-01-10"
    assert record["nextDate"] is None
    assert record["highDate"] is None
    assert record["lowDate"] is None
    assert record["observedTradingDays"] == 0
    assert record["latestDate"] == "2024-01-10"


def test_duplicate_date_signal_events_are_deduplicated():
    records = build_merger_price_records(
        [applied_disclosure("2024-01-05 09:00"), applied_disclosure("2024-01-05 18:00")],
        HISTORY,
    )
    assert len(records) == 1


def test_unknown_signal_or_missing_date_is_skipped():
    disclosures = [
        {"date": "2024-01-05", "title": "기타", "mergerSignal": "other"},
        {"date": None, "title": "회사합병결정", "mergerSignal": "applied"},
    ]
    assert build_merger_price_records(disclosures, HISTORY) == []


def test_empty_history_returns_no_records():
    assert build_merger_price_records([applied_disclosure()], []) == []


def test_records_sorted_by_event_date():
    disclosures = [
        {"date": "2024-01-09", "title": "상장예비심사결과통지(승인)", "mergerSignal": "confirmed"},
        applied_disclosure("2024-01-05"),
    ]
    records = build_merger_price_records(disclosures, HISTORY)
    assert [record["date"] for record in records] == ["2024-01-05", "2024-01-09"]
    assert [record["signal"] for record in records] == ["applied", "confirmed"]
