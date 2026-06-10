"""State-machine behavior of classify_merger_disclosures."""

from spac_hunter.domain.merger import classify_merger_disclosures


def signals(result):
    return [row["mergerSignal"] for row in result["matched"]]


def test_application_then_confirmation():
    result = classify_merger_disclosures(
        [
            {"date": "2024-03-10", "title": "상장예비심사결과통지(승인)"},
            {"date": "2024-01-05", "title": "회사합병결정"},
        ]
    )
    assert result["status"] == "합병 확정"
    assert result["application"]["date"] == "2024-01-05"
    assert result["confirmation"]["date"] == "2024-03-10"
    assert result["cancellation"] is None
    assert signals(result) == ["applied", "confirmed"]


def test_application_then_cancellation_resets_status():
    result = classify_merger_disclosures(
        [
            {"date": "2024-01-05", "title": "회사합병결정"},
            {"date": "2024-02-20", "title": "합병결정철회"},
        ]
    )
    assert result["status"] is None
    assert result["cancellation"]["date"] == "2024-02-20"
    assert signals(result) == ["applied", "canceled"]


def test_application_after_confirmation_keeps_confirmed_status():
    # A later application does not downgrade an already confirmed status.
    result = classify_merger_disclosures(
        [
            {"date": "2024-01-05", "title": "SPAC소멸합병상장"},
            {"date": "2024-02-01", "title": "회사합병결정"},
        ]
    )
    assert result["status"] == "합병 확정"
    assert result["application"]["date"] == "2024-02-01"


def test_ignore_token_rows_are_skipped():
    result = classify_merger_disclosures(
        [{"date": "2024-01-05", "title": "상장예비심사청구서미제출"}]
    )
    assert result["status"] is None
    assert result["matched"] == []


def test_spac_application_token():
    result = classify_merger_disclosures(
        [{"date": "2024-01-05", "title": "SPAC합병(예비심사청구대상)"}]
    )
    assert result["status"] == "합병 신청"


def test_titles_are_normalized_before_matching():
    result = classify_merger_disclosures(
        [{"date": "2024-01-05", "title": "회사 합병 결정"}]
    )
    assert result["status"] == "합병 신청"


def test_same_date_date_only_cancellation_sorts_last():
    # With date-only strings, a cancellation on the same day is deliberately
    # ordered AFTER other disclosures, so the day ends in the canceled state
    # regardless of input order.
    result = classify_merger_disclosures(
        [
            {"date": "2024-01-05", "title": "합병결정철회"},
            {"date": "2024-01-05", "title": "회사합병결정"},
        ]
    )
    assert result["status"] is None
    assert signals(result) == ["applied", "canceled"]


def test_same_date_with_times_sorts_by_full_timestamp():
    # When timestamps are present the cancel reordering does not apply, so a
    # morning cancellation followed by an afternoon application stays applied.
    result = classify_merger_disclosures(
        [
            {"date": "2024-01-05 15:00", "title": "회사합병결정"},
            {"date": "2024-01-05 09:00", "title": "합병결정철회"},
        ]
    )
    assert result["status"] == "합병 신청"
    assert signals(result) == ["canceled", "applied"]


def test_trailing_cancel_token_catches_unlisted_titles():
    # Documented quirk: the bare "철회" token is a substring match, so any
    # title merely containing 철회 is classified as canceled even if it is not
    # one of the explicit cancellation titles.
    result = classify_merger_disclosures(
        [{"date": "2024-01-05", "title": "합병등예비심사청구철회"}]
    )
    assert result["status"] is None
    assert result["cancellation"]["title"] == "합병등예비심사청구철회"
    assert signals(result) == ["canceled"]


def test_cancel_tokens_take_precedence_over_confirmation_tokens():
    # Documented quirk: cancel tokens are checked before confirmation tokens,
    # so "상장예비심사결과통지(미승인)" matches the 미승인 cancel token even
    # though it also contains the 상장예비심사결과통지(승인) lookalike prefix,
    # and a 종료보고서 title containing 철회 is treated as canceled.
    result = classify_merger_disclosures(
        [{"date": "2024-01-05", "title": "상장예비심사결과통지(미승인)"}]
    )
    assert result["status"] is None
    assert signals(result) == ["canceled"]

    result = classify_merger_disclosures(
        [{"date": "2024-02-05", "title": "합병등종료보고서(철회)"}]
    )
    assert signals(result) == ["canceled"]


def test_empty_and_none_inputs():
    assert classify_merger_disclosures([])["status"] is None
    assert classify_merger_disclosures(None)["matched"] == []
    assert classify_merger_disclosures([{"date": "2024-01-05", "title": ""}])["matched"] == []
