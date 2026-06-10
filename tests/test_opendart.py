"""OpenDART client: corpCode zip cache, list.json paging/filtering, cli chain order.

All HTTP is monkeypatched (the conftest network blocker would fail otherwise);
the corpCode zip fixtures are synthetic in-memory archives.
"""

import io
import os
import time
import zipfile
from datetime import date

import pytest

from spac_hunter import cli
from spac_hunter.sources import opendart

TODAY = date(2026, 6, 10)

DEFAULT_ENTRIES = (
    ("00999999", "테스트제1호기업인수목적", "000001"),
    ("00888888", "비상장법인", " "),
)


def make_corpcode_zip(entries=DEFAULT_ENTRIES):
    rows = "".join(
        f"<list><corp_code>{corp}</corp_code><corp_name>{name}</corp_name>"
        f"<stock_code>{stock}</stock_code><modify_date>20260601</modify_date></list>"
        for corp, name, stock in entries
    )
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("CORPCODE.xml", f"<result>{rows}</result>")
    return buffer.getvalue()


def list_row(
    report_nm="회사합병결정",
    rcept_no="20240310000001",
    rcept_dt="20240310",
    corp_name="테스트제1호기업인수목적",
    flr_nm="테스트제1호기업인수목적",
):
    return {
        "corp_name": corp_name,
        "stock_code": "000001",
        "rcept_no": rcept_no,
        "report_nm": report_nm,
        "flr_nm": flr_nm,
        "rcept_dt": rcept_dt,
        "corp_cls": "K",
    }


def list_payload(rows, status="000", message="정상", total_page=1):
    return {
        "status": status,
        "message": message,
        "page_no": 1,
        "page_count": 100,
        "total_count": len(rows),
        "total_page": total_page,
        "list": rows,
    }


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


@pytest.fixture
def corp_map(monkeypatch):
    monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {"000001": "00999999"})


class TestIsEnabled:
    def test_false_without_key(self, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        monkeypatch.delenv("DART_API_KEY", raising=False)
        assert opendart.is_enabled() is False

    def test_false_with_blank_key(self, monkeypatch):
        monkeypatch.setenv("OPENDART_API_KEY", "   ")
        monkeypatch.delenv("DART_API_KEY", raising=False)
        assert opendart.is_enabled() is False

    def test_true_with_key(self, api_key):
        assert opendart.is_enabled() is True

    def test_true_with_dart_api_key_alias(self, monkeypatch):
        # GitHub secret registered as DART_API_KEY is accepted as a fallback name.
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        monkeypatch.setenv("DART_API_KEY", "alias-key")
        assert opendart.is_enabled() is True


class TestCorpCodeMap:
    def test_downloads_parses_and_writes_cache(self, tmp_path, api_key, opendart_session):
        session = opendart_session(lambda url, params: FakeResponse(content=make_corpcode_zip()))
        cache = tmp_path / "corp.zip"

        mapping = opendart.load_corp_code_map(cache_path=cache)

        # Blank stock_code entries are dropped; only 6-digit codes are mapped.
        assert mapping == {"000001": "00999999"}
        assert cache.read_bytes() == make_corpcode_zip()
        assert len(session.get_calls) == 1
        call = session.get_calls[0]
        assert call["url"] == "https://opendart.fss.or.kr/api/corpCode.xml"
        assert call["params"] == {"crtfc_key": "test-key"}

    def test_fresh_cache_skips_download(self, tmp_path, api_key, opendart_session):
        session = opendart_session(
            lambda url, params: pytest.fail("fresh cache must not trigger a download")
        )
        cache = tmp_path / "corp.zip"
        cache.write_bytes(make_corpcode_zip())

        mapping = opendart.load_corp_code_map(cache_path=cache)

        assert mapping == {"000001": "00999999"}
        assert session.get_calls == []

    def test_stale_cache_triggers_redownload(self, tmp_path, api_key, opendart_session):
        new_zip = make_corpcode_zip([("00777777", "새스팩기업인수목적", "000002")])
        session = opendart_session(lambda url, params: FakeResponse(content=new_zip))
        cache = tmp_path / "corp.zip"
        cache.write_bytes(make_corpcode_zip())
        stale = time.time() - 8 * 86400  # older than the 7-day cap
        os.utime(cache, (stale, stale))

        mapping = opendart.load_corp_code_map(cache_path=cache)

        assert mapping == {"000002": "00777777"}
        assert len(session.get_calls) == 1
        assert cache.read_bytes() == new_zip

    def test_second_call_is_memoized(self, tmp_path, api_key, opendart_session):
        session = opendart_session(lambda url, params: FakeResponse(content=make_corpcode_zip()))
        cache = tmp_path / "corp.zip"

        first = opendart.load_corp_code_map(cache_path=cache)
        second = opendart.load_corp_code_map(cache_path=cache)

        assert first == second
        assert len(session.get_calls) == 1

    def test_without_key_raises(self, tmp_path, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        with pytest.raises(RuntimeError, match="OPENDART_API_KEY"):
            opendart.load_corp_code_map(cache_path=tmp_path / "corp.zip")


class TestFetchOpendartDisclosures:
    def test_filters_converts_and_passes_params(self, api_key, corp_map, opendart_session):
        rows = [
            list_row(report_nm="[기재정정] 회사  합병 결정"),
            list_row(report_nm="사업보고서 (2025.12)", rcept_no="20240310000002"),
            list_row(report_nm="해산사유 발생", rcept_no="20240311000003", rcept_dt="20240311"),
            list_row(report_nm="주권매매거래정지해제", rcept_no="20240312000004", rcept_dt="20240312"),
        ]
        session = opendart_session(lambda url, params: FakeResponse(payload=list_payload(rows)))

        result = opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        # The 사업보고서 row has no token from the pool and is filtered out.
        assert [row["title"] for row in result] == [
            "[기재정정] 회사 합병 결정",
            "해산사유 발생",
            "주권매매거래정지해제",
        ]
        assert result[0] == {
            "date": "2024-03-10",
            "title": "[기재정정] 회사 합병 결정",
            "company": "테스트제1호기업인수목적",
            "submitter": "테스트제1호기업인수목적",
            "receiptNo": "20240310000001",
            "source": "OpenDART 공시검색",
            "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240310000001",
        }
        call = session.get_calls[0]
        assert call["url"] == "https://opendart.fss.or.kr/api/list.json"
        assert call["params"] == {
            "crtfc_key": "test-key",
            "corp_code": "00999999",
            "bgn_de": "20240101",
            "end_de": "20260610",
            "page_no": "1",
            "page_count": "100",
        }

    def test_no_data_status_013_returns_empty(self, api_key, corp_map, opendart_session):
        opendart_session(
            lambda url, params: FakeResponse(
                payload={"status": "013", "message": "조회된 데이타가 없습니다."}
            )
        )
        assert opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", None, TODAY) == []

    def test_error_status_raises_with_message(self, api_key, corp_map, opendart_session):
        opendart_session(
            lambda url, params: FakeResponse(payload={"status": "020", "message": "조회 가능한 회수 초과"})
        )
        with pytest.raises(RuntimeError, match="020.*조회 가능한 회수 초과"):
            opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", None, TODAY)

    def test_multi_page_iterates_and_dedupes(self, api_key, corp_map, opendart_session):
        def responder(url, params):
            page = int(params["page_no"])
            rows = [
                list_row(rcept_no=f"2024031000000{page}", rcept_dt=f"2024031{page - 1}"),
                list_row(rcept_no="20240310000001", rcept_dt="20240310"),  # duplicate of page 1
            ]
            return FakeResponse(payload=list_payload(rows, total_page=2))

        session = opendart_session(responder)
        result = opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        assert [call["params"]["page_no"] for call in session.get_calls] == ["1", "2"]
        assert [row["receiptNo"] for row in result] == ["20240310000001", "20240310000002"]

    def test_pagination_capped_at_three_pages(self, api_key, corp_map, opendart_session):
        def responder(url, params):
            page = int(params["page_no"])
            row = list_row(rcept_no=f"2024031000000{page}", rcept_dt=f"2024031{page - 1}")
            return FakeResponse(payload=list_payload([row], total_page=5))

        session = opendart_session(responder)
        result = opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        assert [call["params"]["page_no"] for call in session.get_calls] == ["1", "2", "3"]
        assert len(result) == 3

    def test_unknown_corp_code_returns_empty_without_list_call(
        self, api_key, opendart_session, monkeypatch
    ):
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {})
        session = opendart_session(lambda url, params: pytest.fail("list.json must not be called"))
        assert opendart.fetch_opendart_disclosures("999999", "없는스팩", None, TODAY) == []
        assert session.get_calls == []

    def test_without_key_raises(self, monkeypatch):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        with pytest.raises(RuntimeError, match="OPENDART_API_KEY"):
            opendart.fetch_opendart_disclosures("000001", "테스트제1호스팩", None, TODAY)


ITEMS = [{"code": "000001", "name": "테스트제1호스팩"}]
KIND_COMPANIES = {"테스트제1호스팩": {"listingDate": "2024-01-02"}}

OPENDART_ROW = {"date": "2026-01-02", "title": "회사합병결정", "source": "OpenDART 공시검색"}
KIND_ROW = {"date": "2026-01-02", "title": "회사합병결정", "source": "KIND 공시검색"}
DART_ROW = {"date": "2026-01-02", "title": "회사합병결정", "source": "DART 공시통합검색"}


def _raiser(message):
    def fail(*args, **kwargs):
        raise RuntimeError(message)

    return fail


class TestCliDisclosureChain:
    def test_opendart_first_when_key_is_set(self, api_key, monkeypatch):
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {"000001": "00999999"})
        monkeypatch.setattr(
            opendart, "fetch_opendart_disclosures", lambda code, name, ld, today: [OPENDART_ROW]
        )
        monkeypatch.setattr(cli, "fetch_kind_disclosures", _raiser("KIND must not be called"))
        monkeypatch.setattr(cli, "fetch_dart_disclosures", _raiser("DART must not be called"))

        disclosures, errors = cli.fetch_kind_merger_disclosures(ITEMS, KIND_COMPANIES, today=TODAY)

        assert disclosures["000001"] == [OPENDART_ROW]
        assert errors == {}

    def test_opendart_failure_falls_back_to_kind(self, api_key, monkeypatch):
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {"000001": "00999999"})
        monkeypatch.setattr(opendart, "fetch_opendart_disclosures", _raiser("quota"))
        monkeypatch.setattr(cli, "fetch_kind_disclosures", lambda code, name, ld, today: [KIND_ROW])
        monkeypatch.setattr(cli, "fetch_dart_disclosures", _raiser("DART must not be called"))

        disclosures, errors = cli.fetch_kind_merger_disclosures(ITEMS, KIND_COMPANIES, today=TODAY)

        assert disclosures["000001"] == [KIND_ROW]
        assert errors["000001"] == "OpenDART 실패: quota"

    def test_opendart_and_kind_failures_fall_back_to_dart(self, api_key, monkeypatch):
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {"000001": "00999999"})
        monkeypatch.setattr(opendart, "fetch_opendart_disclosures", _raiser("quota"))
        monkeypatch.setattr(cli, "fetch_kind_disclosures", _raiser("blocked"))
        monkeypatch.setattr(cli, "fetch_dart_disclosures", lambda code, name, ld, today: [DART_ROW])

        disclosures, errors = cli.fetch_kind_merger_disclosures(ITEMS, KIND_COMPANIES, today=TODAY)

        assert disclosures["000001"] == [DART_ROW]
        assert errors["000001"] == "OpenDART 실패: quota; KIND 실패, DART fallback 사용: blocked"

    def test_prefer_dart_with_key_still_tries_opendart_first(self, api_key, monkeypatch):
        monkeypatch.setattr(opendart, "load_corp_code_map", lambda *a, **k: {"000001": "00999999"})
        monkeypatch.setattr(opendart, "fetch_opendart_disclosures", _raiser("quota"))
        monkeypatch.setattr(cli, "fetch_kind_disclosures", _raiser("KIND must not be called"))
        monkeypatch.setattr(cli, "fetch_dart_disclosures", lambda code, name, ld, today: [DART_ROW])

        disclosures, errors = cli.fetch_kind_merger_disclosures(
            ITEMS, KIND_COMPANIES, today=TODAY, prefer_dart=True
        )

        assert disclosures["000001"] == [DART_ROW]
        assert errors["000001"] == "OpenDART 실패: quota"

    def test_without_key_keeps_existing_kind_dart_chain(self, monkeypatch, caplog):
        monkeypatch.delenv("OPENDART_API_KEY", raising=False)
        monkeypatch.setattr(opendart, "load_corp_code_map", _raiser("must not load corp map"))
        monkeypatch.setattr(opendart, "fetch_opendart_disclosures", _raiser("must not be called"))
        monkeypatch.setattr(cli, "fetch_kind_disclosures", lambda code, name, ld, today: [KIND_ROW])
        monkeypatch.setattr(cli, "fetch_dart_disclosures", _raiser("DART must not be called"))

        with caplog.at_level("INFO", logger="spac_hunter.cli"):
            disclosures, errors = cli.fetch_kind_merger_disclosures(ITEMS, KIND_COMPANIES, today=TODAY)

        assert disclosures["000001"] == [KIND_ROW]
        assert errors == {}
        assert "OpenDART 비활성: OPENDART_API_KEY 미설정" in caplog.text

    def test_corp_map_failure_disables_opendart(self, api_key, monkeypatch):
        monkeypatch.setattr(opendart, "load_corp_code_map", _raiser("download failed"))
        monkeypatch.setattr(opendart, "fetch_opendart_disclosures", _raiser("must not be called"))
        monkeypatch.setattr(cli, "fetch_kind_disclosures", lambda code, name, ld, today: [KIND_ROW])
        monkeypatch.setattr(cli, "fetch_dart_disclosures", _raiser("DART must not be called"))

        disclosures, errors = cli.fetch_kind_merger_disclosures(ITEMS, KIND_COMPANIES, today=TODAY)

        assert disclosures["000001"] == [KIND_ROW]
        assert errors == {}
