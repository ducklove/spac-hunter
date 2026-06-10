"""증권신고서 문서 수신/필드 추출, filings.json, 백필 예산, 청약 캘린더, enrich 통합.

All OpenDART HTTP is faked (the conftest network blocker would fail otherwise):
document zips are synthesized in memory and list.json/document.xml fetchers are
monkeypatched at the ``spac_hunter.sources.opendart`` module level.
"""

import argparse
import io
import json
import zipfile
from datetime import date, datetime, timedelta

import pytest

from spac_hunter import filings
from spac_hunter.constants import KST
from spac_hunter.domain.enrich import enrich_spac
from spac_hunter.filings import (
    backfill_filings,
    build_ipo_calendar,
    extract_filing_fields,
    load_filings,
    save_filings,
)
from spac_hunter.output import write_outputs
from spac_hunter.sources import opendart

TODAY = date(2026, 6, 10)
NOW = datetime(2026, 6, 10, 18, 0, 0, tzinfo=KST)

SAMPLE_FILING_TEXT = (
    "제1부 모집 또는 매출에 관한 일반사항 "
    "모집 주식의 총수 6,000,000주 "
    "주당 확정공모가액 : 2,000원 "
    "청약기일 2026년 6월 15일 ~ 6월 16일 "
    "납입기일 : 2026년 6월 18일 "
    "예치기관 : 한국증권금융 "
    "예치(신탁)금액 : 12,000,000,000원 "
    "예치(신탁) 이자율 : 연 2.85%"
)


def make_document_zip(*bodies, encoding="cp949"):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        for idx, body in enumerate(bodies):
            archive.writestr(f"2026060100000{idx}.xml", body.encode(encoding))
    return buffer.getvalue()


class FakeResponse:
    def __init__(self, content=b"", payload=None, status_code=200):
        self.content = content
        self._payload = payload
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")

    def json(self):
        return self._payload


class FakeSession:
    def __init__(self, responder):
        self.responder = responder
        self.get_calls = []

    def get(self, url, params=None, **kwargs):
        self.get_calls.append({"url": url, "params": dict(params or {})})
        return self.responder(url, dict(params or {}))


@pytest.fixture
def api_key(monkeypatch):
    monkeypatch.setenv("OPENDART_API_KEY", "test-key")


@pytest.fixture
def opendart_session(monkeypatch):
    def install(responder):
        session = FakeSession(responder)
        monkeypatch.setattr(opendart, "shared_session", lambda: session)
        return session

    return install


class TestFetchDocumentText:
    def test_cp949_zip_is_decoded_tag_stripped_and_normalized(self, api_key, opendart_session):
        body = "<SECTION-1><TITLE>모집 사항</TITLE><P>확정공모가액 :  2,000원</P></SECTION-1>"
        session = opendart_session(
            lambda url, params: FakeResponse(content=make_document_zip(body, encoding="cp949"))
        )

        text = opendart.fetch_document_text("20260601000001")

        assert "확정공모가액 : 2,000원" in text
        assert "<" not in text and ">" not in text
        assert "  " not in text  # whitespace collapsed
        call = session.get_calls[0]
        assert call["url"] == "https://opendart.fss.or.kr/api/document.xml"
        assert call["params"] == {"crtfc_key": "test-key", "rcept_no": "20260601000001"}

    def test_utf8_zip_is_decoded(self, api_key, opendart_session):
        body = "<BODY>예치기관 한국증권금융 청약기일 2026년 6월 15일</BODY>"
        opendart_session(
            lambda url, params: FakeResponse(content=make_document_zip(body, encoding="utf-8"))
        )

        text = opendart.fetch_document_text("20260601000001")

        assert "예치기관 한국증권금융" in text

    def test_multi_file_zip_concatenates_members(self, api_key, opendart_session):
        opendart_session(
            lambda url, params: FakeResponse(
                content=make_document_zip("<P>첫번째 본문</P>", "<P>두번째 본문</P>")
            )
        )

        text = opendart.fetch_document_text("20260601000001")

        assert "첫번째 본문" in text
        assert "두번째 본문" in text

    def test_error_xml_raises_with_status_and_message(self, api_key, opendart_session):
        error = (
            '<?xml version="1.0" encoding="UTF-8"?>'
            "<result><status>020</status><message>조회 가능한 회수 초과</message></result>"
        )
        opendart_session(lambda url, params: FakeResponse(content=error.encode("utf-8")))

        with pytest.raises(RuntimeError, match="020.*조회 가능한 회수 초과"):
            opendart.fetch_document_text("20260601000001")

    def test_non_zip_non_xml_raises(self, api_key, opendart_session):
        opendart_session(lambda url, params: FakeResponse(content=b"\x00\x01garbage"))

        with pytest.raises(RuntimeError, match="비정상"):
            opendart.fetch_document_text("20260601000001")

    def test_without_key_raises(self, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        with pytest.raises(RuntimeError, match="OPENDART_API_KEY"):
            opendart.fetch_document_text("20260601000001")


def list_payload(rows, status="000", total_page=1):
    return {
        "status": status,
        "message": "정상",
        "total_page": total_page,
        "list": rows,
    }


class TestFetchFilingList:
    def test_calendar_params_omit_corp_code_and_send_pblntf_ty(self, api_key, opendart_session):
        session = opendart_session(lambda url, params: FakeResponse(payload=list_payload([])))

        rows = opendart.fetch_filing_list(date(2026, 5, 11), TODAY, pblntf_ty="C")

        assert rows == []
        call = session.get_calls[0]
        assert call["url"] == "https://opendart.fss.or.kr/api/list.json"
        assert call["params"] == {
            "crtfc_key": "test-key",
            "bgn_de": "20260511",
            "end_de": "20260610",
            "page_no": "1",
            "page_count": "100",
            "pblntf_ty": "C",
        }

    def test_corp_code_param_is_sent_when_given(self, api_key, opendart_session):
        session = opendart_session(
            lambda url, params: FakeResponse(payload=list_payload([{"rcept_no": "1"}]))
        )

        rows = opendart.fetch_filing_list(date(2024, 1, 1), TODAY, corp_code="00999999")

        assert rows == [{"rcept_no": "1"}]
        assert session.get_calls[0]["params"]["corp_code"] == "00999999"
        assert "pblntf_ty" not in session.get_calls[0]["params"]

    def test_status_013_returns_empty(self, api_key, opendart_session):
        payload = {"status": "013", "message": "조회된 데이타가 없습니다."}
        opendart_session(lambda url, params: FakeResponse(payload=payload))
        assert opendart.fetch_filing_list(date(2026, 5, 11), TODAY) == []

    def test_error_status_raises(self, api_key, opendart_session):
        opendart_session(
            lambda url, params: FakeResponse(payload={"status": "020", "message": "회수 초과"})
        )
        with pytest.raises(RuntimeError, match="020.*회수 초과"):
            opendart.fetch_filing_list(date(2026, 5, 11), TODAY)

    def test_pagination_capped_at_three_pages(self, api_key, opendart_session):
        def responder(url, params):
            page = int(params["page_no"])
            return FakeResponse(payload=list_payload([{"rcept_no": str(page)}], total_page=5))

        session = opendart_session(responder)
        rows = opendart.fetch_filing_list(date(2026, 5, 11), TODAY)

        assert [call["params"]["page_no"] for call in session.get_calls] == ["1", "2", "3"]
        assert [row["rcept_no"] for row in rows] == ["1", "2", "3"]

    def test_without_key_raises(self, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        with pytest.raises(RuntimeError, match="OPENDART_API_KEY"):
            opendart.fetch_filing_list(date(2026, 5, 11), TODAY)


class TestExtractFilingFields:
    def test_full_sample_document_extracts_every_field(self):
        fields = extract_filing_fields(SAMPLE_FILING_TEXT)
        assert fields == {
            "ipoPrice": 2000,
            "offeringShares": 6_000_000,
            "escrowAmount": 12_000_000_000,
            "escrowRatePct": 2.85,
            "escrowAgent": "한국증권금융",
            "subscriptionStart": "2026-06-15",
            "subscriptionEnd": "2026-06-16",
            "paymentDate": "2026-06-18",
            "parseWarnings": [],
        }

    def test_ipo_price_mode_wins_over_minority_value(self):
        text = "모집가액 2,000원 공모가액 3,000원 확정공모가액 2,000원"
        fields = extract_filing_fields(text)
        assert fields["ipoPrice"] == 2000

    def test_ipo_price_invalid_unit_or_range_is_rejected_with_warning(self):
        for text in ("공모가액 1,250원", "공모가액 70,000원", "공모가액 300원"):
            fields = extract_filing_fields(text)
            assert fields["ipoPrice"] is None
            assert any(warning.startswith("ipoPrice: 검증 탈락") for warning in fields["parseWarnings"])

    def test_ipo_price_missing_pattern_warns(self):
        fields = extract_filing_fields("관련 문구 없음")
        assert fields["ipoPrice"] is None
        assert "ipoPrice: 패턴 미발견" in fields["parseWarnings"]

    def test_escrow_rate_variants(self):
        assert extract_filing_fields("예치 이자율 : 연 2.85%")["escrowRatePct"] == 2.85
        assert extract_filing_fields("신탁이자율 1.5 %")["escrowRatePct"] == 1.5
        assert extract_filing_fields("예치이율 3.2%")["escrowRatePct"] == 3.2
        assert extract_filing_fields("이자율: 연 2.0%")["escrowRatePct"] == 2.0

    def test_escrow_rate_out_of_band_is_rejected(self):
        for text in ("예치 이자율 연 9.5%", "예치 이자율 0%"):
            fields = extract_filing_fields(text)
            assert fields["escrowRatePct"] is None
            assert any(
                warning.startswith("escrowRatePct: 검증 탈락") for warning in fields["parseWarnings"]
            )

    def test_escrow_amount_minimum_one_hundred_million(self):
        assert (
            extract_filing_fields("예치(신탁)금액 : 10,000,000,000원")["escrowAmount"]
            == 10_000_000_000
        )
        small = extract_filing_fields("신탁금액 50,000,000원")
        assert small["escrowAmount"] is None
        assert any(w.startswith("escrowAmount: 검증 탈락") for w in small["parseWarnings"])

    def test_escrow_agent_is_cleaned_of_following_fields(self):
        text = "예치기관 : 한국증권금융 예치(신탁)금액 : 12,000,000,000원"
        assert extract_filing_fields(text)["escrowAgent"] == "한국증권금융"

    def test_escrow_agent_missing_warns(self):
        fields = extract_filing_fields("기관 정보 없음")
        assert fields["escrowAgent"] is None
        assert "escrowAgent: 패턴 미발견" in fields["parseWarnings"]

    def test_offering_shares_validation(self):
        assert extract_filing_fields("모집주식의 총수 6,000,000주")["offeringShares"] == 6_000_000
        assert extract_filing_fields("공모 주식수 : 250,000 주")["offeringShares"] == 250_000
        small = extract_filing_fields("모집주식수 50,000주")
        assert small["offeringShares"] is None
        assert any(w.startswith("offeringShares: 검증 탈락") for w in small["parseWarnings"])

    def test_subscription_korean_range_inherits_year(self):
        fields = extract_filing_fields("청약기일 2026년 6월 15일 ~ 6월 16일")
        assert (fields["subscriptionStart"], fields["subscriptionEnd"]) == ("2026-06-15", "2026-06-16")

    def test_subscription_dotted_range(self):
        fields = extract_filing_fields("청약기일: 2026.06.15 ~ 2026.06.16")
        assert (fields["subscriptionStart"], fields["subscriptionEnd"]) == ("2026-06-15", "2026-06-16")

    def test_subscription_iso_single_date_sets_both_ends(self):
        fields = extract_filing_fields("청약기일 2026-06-15")
        assert (fields["subscriptionStart"], fields["subscriptionEnd"]) == ("2026-06-15", "2026-06-15")

    def test_subscription_range_with_weekday_parentheses(self):
        fields = extract_filing_fields("청약기일 2026년 6월 15일(월) ~ 2026년 6월 16일(화)")
        assert (fields["subscriptionStart"], fields["subscriptionEnd"]) == ("2026-06-15", "2026-06-16")

    def test_subscription_invalid_date_warns(self):
        fields = extract_filing_fields("청약기일 2026년 13월 40일")
        assert fields["subscriptionStart"] is None
        assert "subscriptionStart: 날짜 검증 탈락" in fields["parseWarnings"]

    def test_payment_date_formats(self):
        assert extract_filing_fields("납입기일 : 2026년 6월 18일")["paymentDate"] == "2026-06-18"
        assert extract_filing_fields("납입기일 2026.06.18")["paymentDate"] == "2026-06-18"

    def test_empty_text_yields_all_nones_and_warnings(self):
        fields = extract_filing_fields("")
        for key in filings.FIELD_KEYS:
            assert fields[key] is None
        assert len(fields["parseWarnings"]) >= 6


class TestFilingsStore:
    def test_save_load_round_trip(self, tmp_path):
        path = tmp_path / "filings.json"
        store = {
            "filings": {"000001": {"receiptNo": "20240105000123", "ipoPrice": 2000}},
            "calendarDocs": {"20260601000001": {"ipoPrice": 2000, "extractedAt": NOW.isoformat()}},
        }

        save_filings(store, NOW, path=path)
        loaded = load_filings(path=path)

        assert loaded == store
        raw = json.loads(path.read_text(encoding="utf-8"))
        assert raw["updatedAt"] == NOW.isoformat()
        assert list(raw.keys()) == ["updatedAt", "filings", "calendarDocs"]

    def test_missing_file_returns_empty_store(self, tmp_path):
        assert load_filings(path=tmp_path / "missing.json") == {"filings": {}, "calendarDocs": {}}

    def test_corrupt_or_wrong_shape_falls_back_to_empty(self, tmp_path):
        broken = tmp_path / "broken.json"
        broken.write_text("{not json", encoding="utf-8")
        assert load_filings(path=broken) == {"filings": {}, "calendarDocs": {}}

        wrong_type = tmp_path / "list.json"
        wrong_type.write_text("[1, 2, 3]", encoding="utf-8")
        assert load_filings(path=wrong_type) == {"filings": {}, "calendarDocs": {}}

        partial = tmp_path / "partial.json"
        partial.write_text('{"filings": "oops", "calendarDocs": null}', encoding="utf-8")
        assert load_filings(path=partial) == {"filings": {}, "calendarDocs": {}}


def filing_row(rcept_no="20240105000123", report_nm="투자설명서", rcept_dt="20240105"):
    return {"rcept_no": rcept_no, "report_nm": report_nm, "rcept_dt": rcept_dt}


@pytest.fixture
def backfill_env(monkeypatch):
    """Patch the opendart fetchers; returns the recorded list/document call logs."""
    calls = {"list": [], "doc": []}

    def install(corp_map=None, list_rows=None, doc_text=SAMPLE_FILING_TEXT):
        corp_map = corp_map if corp_map is not None else {"000001": "00999991", "000002": "00999992"}
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: corp_map)

        def fake_list(bgn_de, end_de, corp_code=None, pblntf_ty=None, **kwargs):
            calls["list"].append(
                {"bgn_de": bgn_de, "end_de": end_de, "corp_code": corp_code, "pblntf_ty": pblntf_ty}
            )
            if isinstance(list_rows, Exception):
                raise list_rows
            if callable(list_rows):
                return list_rows(corp_code)
            return list_rows if list_rows is not None else [filing_row()]

        def fake_doc(receipt_no):
            calls["doc"].append(receipt_no)
            if isinstance(doc_text, Exception):
                raise doc_text
            return doc_text

        monkeypatch.setattr(opendart, "fetch_filing_list", fake_list)
        monkeypatch.setattr(opendart, "fetch_document_text", fake_doc)
        return calls

    return install


class TestBackfillFilings:
    def test_extracts_and_stores_entry_with_metadata(self, backfill_env):
        calls = backfill_env(corp_map={"000001": "00999991"})
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(
            store, [{"code": "000001", "name": "테스트1호스팩"}], {"000001": None}, 10,
            today=TODAY, now=NOW,
        )

        assert (used, errors) == (1, {})
        assert calls["doc"] == ["20240105000123"]
        entry = store["filings"]["000001"]
        assert entry["receiptNo"] == "20240105000123"
        assert entry["reportName"] == "투자설명서"
        assert entry["filingDate"] == "2024-01-05"
        assert entry["url"] == "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240105000123"
        assert entry["ipoPrice"] == 2000
        assert entry["escrowRatePct"] == 2.85
        assert entry["subscriptionStart"] == "2026-06-15"
        assert entry["extractedAt"] == NOW.isoformat()
        assert entry["parseWarnings"] == []

    def test_budget_limits_document_requests(self, backfill_env):
        corp_map = {f"00000{i}": f"0099999{i}" for i in range(1, 6)}
        calls = backfill_env(
            corp_map=corp_map,
            list_rows=lambda corp_code: [filing_row(rcept_no=f"2024010500{corp_code[-3:]}")],
        )
        items = [{"code": f"00000{i}", "name": f"테스트{i}호스팩"} for i in range(1, 6)]
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(store, items, {}, 2, today=TODAY, now=NOW)

        assert used == 2
        assert len(calls["doc"]) == 2
        assert len(calls["list"]) == 2  # codes beyond the budget are not even listed
        assert set(store["filings"]) == {"000001", "000002"}

    def test_existing_entries_are_skipped(self, backfill_env):
        calls = backfill_env()
        store = {"filings": {"000001": {"receiptNo": None, "parseWarnings": ["x"]}}, "calendarDocs": {}}
        items = [{"code": "000001", "name": "기존스팩"}, {"code": "000002", "name": "신규스팩"}]

        used, _ = backfill_filings(store, items, {}, 10, today=TODAY, now=NOW)

        assert used == 1
        assert len(calls["list"]) == 1  # only 000002
        assert store["filings"]["000001"] == {"receiptNo": None, "parseWarnings": ["x"]}

    def test_prefers_prospectus_then_latest_receipt(self, backfill_env):
        rows = [
            filing_row(rcept_no="20240110000009", report_nm="증권신고서(지분증권)"),
            filing_row(rcept_no="20240105000001", report_nm="투자설명서"),
            filing_row(rcept_no="20240106000002", report_nm="[기재정정]투자설명서"),
        ]
        backfill_env(corp_map={"000001": "00999991"}, list_rows=rows)
        store = {"filings": {}, "calendarDocs": {}}

        backfill_filings(store, [{"code": "000001", "name": "스팩"}], {}, 10, today=TODAY, now=NOW)

        assert store["filings"]["000001"]["receiptNo"] == "20240106000002"

    def test_registration_statement_used_when_no_prospectus(self, backfill_env):
        rows = [
            filing_row(rcept_no="20240103000001", report_nm="증권신고서(지분증권)"),
            filing_row(rcept_no="20240104000002", report_nm="사업보고서"),
        ]
        backfill_env(corp_map={"000001": "00999991"}, list_rows=rows)
        store = {"filings": {}, "calendarDocs": {}}

        backfill_filings(store, [{"code": "000001", "name": "스팩"}], {}, 10, today=TODAY, now=NOW)

        assert store["filings"]["000001"]["receiptNo"] == "20240103000001"

    def test_no_candidate_saves_null_entry_without_doc_request(self, backfill_env):
        calls = backfill_env(corp_map={"000001": "00999991"}, list_rows=[filing_row(report_nm="사업보고서")])
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(
            store, [{"code": "000001", "name": "스팩"}], {}, 10, today=TODAY, now=NOW
        )

        assert (used, errors) == (0, {})
        assert calls["doc"] == []
        entry = store["filings"]["000001"]
        assert entry["receiptNo"] is None
        assert entry["ipoPrice"] is None
        assert entry["parseWarnings"] == ["증권신고서/투자설명서 미발견"]

    def test_document_failure_still_saves_entry_with_warning(self, backfill_env):
        backfill_env(corp_map={"000001": "00999991"}, doc_text=RuntimeError("문서 없음"))
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(
            store, [{"code": "000001", "name": "스팩"}], {}, 10, today=TODAY, now=NOW
        )

        assert (used, errors) == (1, {})
        entry = store["filings"]["000001"]
        assert entry["receiptNo"] == "20240105000123"
        assert entry["ipoPrice"] is None
        assert entry["parseWarnings"] == ["문서 추출 실패: 문서 없음"]

    def test_listing_date_window_and_fallback_window(self, backfill_env):
        calls = backfill_env(corp_map={"000001": "00999991", "000002": "00999992"})
        listing = date(2024, 3, 15)
        items = [{"code": "000001", "name": "가스팩"}, {"code": "000002", "name": "나스팩"}]
        store = {"filings": {}, "calendarDocs": {}}

        backfill_filings(store, items, {"000001": listing}, 10, today=TODAY, now=NOW)

        assert calls["list"][0]["bgn_de"] == listing - timedelta(days=180)
        assert calls["list"][0]["end_de"] == listing + timedelta(days=30)
        assert calls["list"][1]["bgn_de"] == TODAY - timedelta(days=365 * 4)
        assert calls["list"][1]["end_de"] == TODAY

    def test_unknown_corp_code_is_skipped(self, backfill_env):
        calls = backfill_env(corp_map={})
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(
            store, [{"code": "000001", "name": "스팩"}], {}, 10, today=TODAY, now=NOW
        )

        assert (used, errors) == (0, {})
        assert calls["list"] == []
        assert store["filings"] == {}

    def test_list_failure_records_error_and_stops(self, backfill_env):
        calls = backfill_env(list_rows=RuntimeError("quota"))
        items = [{"code": "000001", "name": "가스팩"}, {"code": "000002", "name": "나스팩"}]
        store = {"filings": {}, "calendarDocs": {}}

        used, errors = backfill_filings(store, items, {}, 10, today=TODAY, now=NOW)

        assert used == 0
        assert errors == {"000001": "신고서 목록 조회 실패: quota"}
        assert len(calls["list"]) == 1  # the loop stops after the first failure
        assert store["filings"] == {}

    def test_zero_budget_is_a_noop(self, monkeypatch):
        def fail(*args, **kwargs):
            raise AssertionError("must not be called with zero budget")

        monkeypatch.setattr(opendart, "load_corp_code_map", fail)
        monkeypatch.setattr(opendart, "fetch_filing_list", fail)
        store = {"filings": {}, "calendarDocs": {}}

        assert backfill_filings(store, [{"code": "000001", "name": "스팩"}], {}, 0) == (0, {})
        assert store["filings"] == {}


def calendar_row(
    corp_code="11111111",
    corp_name="새로운제1호스팩",
    rcept_no="20260601000001",
    report_nm="증권신고서(지분증권)",
    rcept_dt="20260601",
):
    return {
        "corp_code": corp_code,
        "corp_name": corp_name,
        "rcept_no": rcept_no,
        "report_nm": report_nm,
        "rcept_dt": rcept_dt,
    }


@pytest.fixture
def calendar_env(monkeypatch):
    calls = {"list": [], "doc": []}

    def install(rows, doc_text=SAMPLE_FILING_TEXT):
        def fake_list(bgn_de, end_de, corp_code=None, pblntf_ty=None, **kwargs):
            calls["list"].append(
                {"bgn_de": bgn_de, "end_de": end_de, "corp_code": corp_code, "pblntf_ty": pblntf_ty}
            )
            return rows

        def fake_doc(receipt_no):
            calls["doc"].append(receipt_no)
            if isinstance(doc_text, Exception):
                raise doc_text
            return doc_text

        monkeypatch.setattr(opendart, "fetch_filing_list", fake_list)
        monkeypatch.setattr(opendart, "fetch_document_text", fake_doc)
        return calls

    return install


class TestBuildIpoCalendar:
    def test_filters_and_builds_enriched_entries(self, calendar_env):
        calls = calendar_env(
            [
                calendar_row(),
                calendar_row(corp_code="22222222", corp_name="일반제조회사", rcept_no="20260601000002"),
                calendar_row(corp_code="33333333", corp_name="다른스팩", report_nm="사업보고서"),
                calendar_row(corp_code="44444444", corp_name="기존 상장스팩", rcept_no="20260601000004"),
            ]
        )
        store = {"filings": {}, "calendarDocs": {}}

        entries, used = build_ipo_calendar(store, ["기존상장스팩"], 5, today=TODAY, now=NOW)

        assert used == 1
        assert calls["list"][0] == {
            "bgn_de": TODAY - timedelta(days=30),
            "end_de": TODAY,
            "corp_code": None,
            "pblntf_ty": "C",
        }
        assert len(entries) == 1
        entry = entries[0]
        assert entry["corpName"] == "새로운제1호스팩"
        assert entry["corpCode"] == "11111111"
        assert entry["reportName"] == "증권신고서(지분증권)"
        assert entry["receiptNo"] == "20260601000001"
        assert entry["url"] == "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260601000001"
        assert entry["filingDate"] == "2026-06-01"
        assert entry["subscriptionStart"] == "2026-06-15"
        assert entry["subscriptionEnd"] == "2026-06-16"
        assert entry["paymentDate"] == "2026-06-18"
        assert entry["ipoPrice"] == 2000
        # 추출 결과는 receiptNo 기준으로 calendarDocs에 캐시된다.
        assert store["calendarDocs"]["20260601000001"]["extractedAt"] == NOW.isoformat()

    def test_english_spac_name_matches_case_insensitively(self, calendar_env):
        calendar_env([calendar_row(corp_name="ace spac partners", report_nm="투자설명서")])
        entries, _ = build_ipo_calendar({"filings": {}, "calendarDocs": {}}, [], 0, today=TODAY, now=NOW)
        assert [entry["corpName"] for entry in entries] == ["ace spac partners"]

    def test_legal_acquisition_purpose_name_matches(self, calendar_env):
        # 상장 전 스팩은 법인명이 "○○기업인수목적주식회사"로 신고되는 경우가 많다.
        calendar_env(
            [
                calendar_row(
                    corp_code="55555555",
                    corp_name="하나금융31호기업인수목적",
                    rcept_no="20260601000055",
                )
            ]
        )
        entries, _ = build_ipo_calendar({"filings": {}, "calendarDocs": {}}, [], 0, today=TODAY, now=NOW)
        assert [entry["corpName"] for entry in entries] == ["하나금융31호기업인수목적"]

    def test_latest_receipt_per_corp_code_wins(self, calendar_env):
        calendar_env(
            [
                calendar_row(rcept_no="20260601000001"),
                calendar_row(rcept_no="20260605000009", report_nm="[기재정정]증권신고서(지분증권)"),
            ]
        )
        entries, _ = build_ipo_calendar({"filings": {}, "calendarDocs": {}}, [], 0, today=TODAY, now=NOW)
        assert len(entries) == 1
        assert entries[0]["receiptNo"] == "20260605000009"

    def test_cached_docs_skip_extraction_and_budget(self, calendar_env):
        calls = calendar_env([calendar_row()])
        cached = {
            "ipoPrice": 2100,
            "subscriptionStart": "2026-06-20",
            "subscriptionEnd": "2026-06-21",
            "paymentDate": "2026-06-23",
            "parseWarnings": [],
            "extractedAt": (NOW - timedelta(days=5)).isoformat(),
        }
        store = {"filings": {}, "calendarDocs": {"20260601000001": dict(cached)}}

        entries, used = build_ipo_calendar(store, [], 5, today=TODAY, now=NOW)

        assert used == 0
        assert calls["doc"] == []
        assert entries[0]["ipoPrice"] == 2100
        assert entries[0]["subscriptionStart"] == "2026-06-20"

    def test_budget_zero_leaves_fields_none(self, calendar_env):
        calls = calendar_env([calendar_row()])
        entries, used = build_ipo_calendar({"filings": {}, "calendarDocs": {}}, [], 0, today=TODAY, now=NOW)

        assert (used, calls["doc"]) == (0, [])
        entry = entries[0]
        assert entry["ipoPrice"] is None
        assert entry["subscriptionStart"] is None

    def test_budget_caps_document_count(self, calendar_env):
        calls = calendar_env(
            [calendar_row(corp_code=f"{i}1111111", rcept_no=f"2026060100000{i}") for i in range(1, 4)]
        )
        entries, used = build_ipo_calendar({"filings": {}, "calendarDocs": {}}, [], 2, today=TODAY, now=NOW)

        assert used == 2
        assert len(calls["doc"]) == 2
        assert len(entries) == 3

    def test_stale_calendar_docs_are_pruned(self, calendar_env):
        calendar_env([calendar_row()])
        store = {
            "filings": {},
            "calendarDocs": {
                "20250101000001": {"ipoPrice": 2000, "extractedAt": (NOW - timedelta(days=61)).isoformat()},
                "20260520000002": {"ipoPrice": 2000, "extractedAt": (NOW - timedelta(days=5)).isoformat()},
                "20240101000003": {"ipoPrice": 2000, "extractedAt": "정상아님"},
            },
        }

        build_ipo_calendar(store, [], 0, today=TODAY, now=NOW)

        assert set(store["calendarDocs"]) == {"20260520000002"}

    def test_sorted_by_subscription_start_then_filing_date_desc(self, calendar_env):
        calendar_env(
            [
                calendar_row(corp_code="1AAAAAAA", rcept_no="20260601000001", rcept_dt="20260601"),
                calendar_row(corp_code="2BBBBBBB", rcept_no="20260605000002", rcept_dt="20260605"),
                calendar_row(corp_code="3CCCCCCC", rcept_no="20260603000003", rcept_dt="20260603"),
            ]
        )
        store = {
            "filings": {},
            "calendarDocs": {
                "20260601000001": {"subscriptionStart": "2026-06-20", "extractedAt": NOW.isoformat()},
                "20260603000003": {"subscriptionStart": "2026-06-10", "extractedAt": NOW.isoformat()},
            },
        }

        entries, _ = build_ipo_calendar(store, [], 0, today=TODAY, now=NOW)

        # 2026-06-20(청약) > 2026-06-05(신고서 접수일 fallback) > 2026-06-10(청약)... desc by key:
        assert [entry["receiptNo"] for entry in entries] == [
            "20260601000001",  # subscriptionStart 2026-06-20
            "20260603000003",  # subscriptionStart 2026-06-10
            "20260605000002",  # fallback filingDate 2026-06-05
        ]


def make_args():
    return argparse.Namespace(trust_rate=0.0, trust_rate_label="테스트 0.000%", liquidation_haircut=0)


FILING_ENTRY = {
    "receiptNo": "20240105000123",
    "reportName": "투자설명서",
    "filingDate": "2024-01-05",
    "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240105000123",
    "ipoPrice": 2100,
    "offeringShares": 6_000_000,
    "escrowAmount": 12_000_000_000,
    "escrowRatePct": 2.85,
    "escrowAgent": "한국증권금융",
    "subscriptionStart": "2023-12-18",
    "subscriptionEnd": "2023-12-19",
    "paymentDate": "2023-12-21",
    "extractedAt": "2026-06-10T18:00:00+09:00",
    "parseWarnings": [],
}


def enrich(filing=None, override=None):
    overrides = {"000001": override} if override else {}
    return enrich_spac(
        {"code": "000001", "name": "테스트1호스팩", "market": "KOSDAQ", "isin": None},
        {"listingDate": "2024-01-02"},
        {"price": 2000},
        [],
        overrides,
        make_args(),
        TODAY,
        [],
        {},
        filing=filing,
    )


class TestEnrichWithFiling:
    def test_filing_price_and_rate_are_adopted_with_sources(self):
        spac = enrich(filing=FILING_ENTRY)

        assert spac["ipoPrice"] == 2100
        assert spac["ipoPriceSource"] == "증권신고서(20240105000123)"
        assert spac["ratio"] == round(2000 / 2100, 4)
        assert spac["filing"] == FILING_ENTRY
        assert spac["liquidationValueSource"] == "공모예치금+예상 예치이자(증권신고서 연 2.85%)"
        # 상장 2024-01-02 + 36개월 = 2027-01-02 → 1096일 예치 가정.
        expected_trust = round(2100 * (1 + 0.0285) ** (1096 / 365), 2)
        assert spac["trustValuePerShare"] == expected_trust

    def test_override_price_beats_filing_and_omits_source(self):
        spac = enrich(filing=FILING_ENTRY, override={"ipoPrice": 3000})

        assert spac["ipoPrice"] == 3000
        assert "ipoPriceSource" not in spac
        assert spac["filing"] == FILING_ENTRY  # 임베드는 유지

    def test_invalid_filing_price_falls_back_to_default(self):
        filing = {**FILING_ENTRY, "ipoPrice": 2050}  # 100원 단위 아님
        spac = enrich(filing=filing)
        assert spac["ipoPrice"] == 2000
        assert "ipoPriceSource" not in spac

        filing = {**FILING_ENTRY, "ipoPrice": 60000}  # 상한 초과
        assert enrich(filing=filing)["ipoPrice"] == 2000

    def test_invalid_filing_rate_falls_back_to_args_label(self):
        filing = {**FILING_ENTRY, "escrowRatePct": 9.5}
        spac = enrich(filing=filing)

        assert spac["liquidationValueSource"] == "공모예치금+예상 예치이자(테스트 0.000%)"
        assert spac["trustValuePerShare"] == 2100  # 0% 금리 → 공모가 그대로

    def test_override_trust_value_keeps_priority_over_filing_rate(self):
        spac = enrich(filing=FILING_ENTRY, override={"trustValuePerShare": 2080})
        assert spac["trustValuePerShare"] == 2080
        assert spac["liquidationValueSource"] == "overrides.json 예치금"

    def test_override_liquidation_value_keeps_priority(self):
        spac = enrich(filing=FILING_ENTRY, override={"liquidationValuePerShare": 2120})
        assert spac["liquidationValuePerShare"] == 2120
        assert spac["liquidationValueSource"] == "overrides.json 청산분배금"

    def test_null_extraction_entry_is_embedded_without_effects(self):
        filing = {
            "receiptNo": None,
            "reportName": None,
            "filingDate": None,
            "url": None,
            **{key: None for key in filings.FIELD_KEYS},
            "extractedAt": NOW.isoformat(),
            "parseWarnings": ["증권신고서/투자설명서 미발견"],
        }
        spac = enrich(filing=filing)

        assert spac["filing"] == filing
        assert spac["ipoPrice"] == 2000
        assert "ipoPriceSource" not in spac
        assert spac["liquidationValueSource"] == "공모예치금+예상 예치이자(테스트 0.000%)"

    def test_without_filing_output_is_unchanged(self):
        spac = enrich()

        assert "filing" not in spac
        assert "ipoPriceSource" not in spac
        assert spac["ipoPrice"] == 2000
        assert spac["liquidationValueSource"] == "공모예치금+예상 예치이자(테스트 0.000%)"


class TestCollectFilings:
    """cli.collect_filings: 키 없음 경로, 백필 우선 예산 분배(잔여 최대 5), 실패 내성."""

    ITEMS = [{"code": "000001", "name": "테스트1호스팩"}]
    KIND = {"테스트1호스팩": {"listingDate": "2024-01-02"}}

    def _patch_store(self, monkeypatch, store=None):
        from spac_hunter import cli

        store = store if store is not None else {"filings": {}, "calendarDocs": {}}
        saved = []
        monkeypatch.setattr(filings, "load_filings", lambda path=None: store)
        monkeypatch.setattr(
            filings, "save_filings", lambda st, at, path=None: saved.append((st, at))
        )
        return cli, store, saved

    def test_without_key_reads_store_and_skips_collection(self, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        store = {"filings": {"000001": {"receiptNo": "1"}}, "calendarDocs": {}}
        cli, _, saved = self._patch_store(monkeypatch, store)
        monkeypatch.setattr(
            filings, "backfill_filings", lambda *a, **k: pytest.fail("키 없이 백필 금지")
        )
        errors = {}

        entries, calendar = cli.collect_filings(
            argparse.Namespace(filing_doc_limit=10), self.ITEMS, self.KIND, GENERATED_AT, errors
        )

        assert entries == {"000001": {"receiptNo": "1"}}
        assert calendar is None
        assert saved == []
        assert errors == {}

    def test_budget_split_backfill_first_calendar_capped_at_five(self, api_key, monkeypatch):
        cli, store, saved = self._patch_store(monkeypatch)
        captured = {}

        def fake_backfill(st, items, listing_dates, budget, today=None, now=None):
            captured["backfill_budget"] = budget
            captured["listing_dates"] = listing_dates
            return 2, {}

        def fake_calendar(st, names, budget, today=None, now=None):
            captured["calendar_budget"] = budget
            captured["universe_names"] = names
            return [{"corpName": "새스팩"}], 1

        monkeypatch.setattr(filings, "backfill_filings", fake_backfill)
        monkeypatch.setattr(filings, "build_ipo_calendar", fake_calendar)
        errors = {}

        entries, calendar = cli.collect_filings(
            argparse.Namespace(filing_doc_limit=10), self.ITEMS, self.KIND, GENERATED_AT, errors
        )

        assert captured["backfill_budget"] == 10
        assert captured["listing_dates"] == {"000001": date(2024, 1, 2)}
        assert captured["calendar_budget"] == 5  # min(5, 10 - 2)
        assert captured["universe_names"] == ["테스트1호스팩"]
        assert calendar == [{"corpName": "새스팩"}]
        assert entries == {}
        assert len(saved) == 1
        assert errors == {}

    def test_backfill_consuming_budget_shrinks_calendar_share(self, api_key, monkeypatch):
        cli, _, _ = self._patch_store(monkeypatch)
        captured = {}
        monkeypatch.setattr(filings, "backfill_filings", lambda *a, **k: (7, {}))
        monkeypatch.setattr(
            filings,
            "build_ipo_calendar",
            lambda st, names, budget, today=None, now=None: captured.update(budget=budget) or ([], 0),
        )

        cli.collect_filings(
            argparse.Namespace(filing_doc_limit=10), self.ITEMS, self.KIND, GENERATED_AT, {}
        )

        assert captured["budget"] == 3  # 10 - 7, 5 미만이므로 그대로

    def test_calendar_failure_is_recorded_and_store_still_saved(self, api_key, monkeypatch):
        cli, _, saved = self._patch_store(monkeypatch)
        monkeypatch.setattr(filings, "backfill_filings", lambda *a, **k: (0, {"000009": "목록 실패"}))

        def boom(*args, **kwargs):
            raise RuntimeError("quota")

        monkeypatch.setattr(filings, "build_ipo_calendar", boom)
        errors = {}

        entries, calendar = cli.collect_filings(
            argparse.Namespace(filing_doc_limit=10), self.ITEMS, self.KIND, GENERATED_AT, errors
        )

        assert calendar is None
        assert errors == {"filings": {"000009": "목록 실패", "calendar": "quota"}}
        assert len(saved) == 1  # 진행분 보존


GENERATED_AT = datetime(2026, 6, 10, 12, 0, 0, tzinfo=KST)


def read_payload(path):
    text = path.read_text(encoding="utf-8")
    assert text.startswith("window.SPAC_DATA = ")
    return json.loads(text[len("window.SPAC_DATA = ") :].rstrip().rstrip(";"))


class TestWriteOutputsIpoCalendar:
    def test_calendar_is_serialized_into_data_js_only(self, tmp_path, spac_factory):
        calendar = [
            {
                "corpName": "새로운제1호스팩",
                "corpCode": "11111111",
                "reportName": "증권신고서(지분증권)",
                "receiptNo": "20260601000001",
                "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260601000001",
                "filingDate": "2026-06-01",
                "ipoPrice": 2000,
                "subscriptionStart": "2026-06-15",
                "subscriptionEnd": "2026-06-16",
                "paymentDate": "2026-06-18",
            }
        ]
        data_js, current_json = write_outputs(
            GENERATED_AT,
            [spac_factory()],
            errors={},
            trust_rate=0.0,
            trust_rate_source="테스트 0.000%",
            force=True,
            data_js_path=tmp_path / "data.js",
            current_json_path=tmp_path / "current.json",
            ipo_calendar=calendar,
        )

        payload = read_payload(data_js)
        assert payload["ipoCalendar"] == calendar
        # data.js 전용 키 — current.json에는 포함하지 않는다.
        current = json.loads(current_json.read_text(encoding="utf-8"))
        assert "ipoCalendar" not in current

    def test_default_is_null(self, tmp_path, spac_factory):
        data_js, _ = write_outputs(
            GENERATED_AT,
            [spac_factory()],
            errors={},
            trust_rate=0.0,
            trust_rate_source="테스트 0.000%",
            force=True,
            data_js_path=tmp_path / "data.js",
            current_json_path=tmp_path / "current.json",
        )
        assert read_payload(data_js)["ipoCalendar"] is None
