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


# --- dissolution handling (additive; the merger state machine must not change) ---


def test_dissolution_is_tracked_without_touching_merger_state():
    result = classify_merger_disclosures(
        [
            {"date": "2024-01-05", "title": "회사합병결정"},
            {"date": "2024-03-02", "title": "해산사유 발생"},
        ]
    )
    # The merger status/state machine is exactly as without the dissolution row.
    assert result["status"] == "합병 신청"
    assert result["application"]["date"] == "2024-01-05"
    # No dissolution rows leak into matched (keeps price-record stats clean).
    assert signals(result) == ["applied"]
    assert result["dissolution"]["date"] == "2024-03-02"


def test_dissolution_keeps_latest_disclosure_only():
    result = classify_merger_disclosures(
        [
            {"date": "2024-04-09", "title": "[기재정정] 해산사유 발생"},
            {"date": "2024-03-02", "title": "해산사유발생"},
        ]
    )
    assert result["dissolution"]["date"] == "2024-04-09"
    assert result["status"] is None
    assert result["matched"] == []


def test_results_without_dissolution_are_unchanged():
    # Pre-existing classification results stay identical; only the new
    # "dissolution" key (None) is added.
    result = classify_merger_disclosures(
        [
            {"date": "2024-03-10", "title": "상장예비심사결과통지(승인)"},
            {"date": "2024-01-05", "title": "회사합병결정"},
        ]
    )
    assert result["dissolution"] is None
    assert result["status"] == "합병 확정"
    assert signals(result) == ["applied", "confirmed"]


def _enrich(disclosures):
    import argparse
    from datetime import date

    from spac_hunter.domain.enrich import enrich_spac

    args = argparse.Namespace(trust_rate=0.0, trust_rate_label="테스트 0.000%", liquidation_haircut=0)
    return enrich_spac(
        {"code": "000001", "name": "테스트1호스팩", "market": "KOSDAQ", "isin": None},
        {"listingDate": "2024-01-02"},
        {"price": 2000},
        [],
        {},
        args,
        date(2026, 6, 10),
        disclosures,
        {},
    )


def test_enrich_spac_with_dissolution_adds_field_event_and_badge():
    spac = _enrich(
        [
            {
                "date": "2026-05-30",
                "title": "해산사유 발생",
                "source": "OpenDART 공시검색",
                "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=1",
            }
        ]
    )
    assert spac["dissolutionDisclosure"]["date"] == "2026-05-30"
    assert "해산사유 발생" in spac["badges"]
    assert [event for event in spac["events"] if event["type"] == "dissolution"] == [
        {
            "date": "2026-05-30",
            "type": "dissolution",
            "label": "해산사유 발생",
            "detail": "해산사유 발생",
            "source": "OpenDART 공시검색",
            "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=1",
        }
    ]
    # Merger status and matched disclosures are untouched.
    assert spac["mergerStatus"] is None
    assert spac["mergerDisclosures"] == []
    assert spac["mergerPriceRecords"] == []


def test_enrich_spac_without_dissolution_omits_key_and_keeps_output():
    spac = _enrich([{"date": "2026-05-30", "title": "회사합병결정", "source": "KIND 공시검색"}])
    assert "dissolutionDisclosure" not in spac
    assert "해산사유 발생" not in spac["badges"]
    assert all(event["type"] != "dissolution" for event in spac["events"])
    assert spac["mergerStatus"] == "합병 신청"
