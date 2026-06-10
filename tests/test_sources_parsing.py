"""Parsing of synthetic KIND/DART HTML fixtures with HTTP fully monkeypatched.

The fixtures under tests/fixtures/ are synthetic documents that follow the
table structures the current parsers expect; no real network traffic happens
(the conftest network blocker would fail the test otherwise).
"""

from datetime import date
from pathlib import Path

import pytest

from spac_hunter.constants import DART_CORP_SEARCH_URL, DART_DETAIL_SEARCH_URL
from spac_hunter.sources import dart, kind

FIXTURES = Path(__file__).parent / "fixtures"
TODAY = date(2026, 6, 10)


class FakeResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.content = text.encode("utf-8")
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")


class FakeSession:
    """Stand-in for requests.Session; responses are routed per POST call."""

    def __init__(self, responder):
        self.responder = responder
        self.get_calls = []
        self.post_calls = []

    def get(self, url, **kwargs):
        self.get_calls.append(url)
        return FakeResponse("<html></html>")

    def post(self, url, data=None, **kwargs):
        self.post_calls.append({"url": url, "data": dict(data or {})})
        return self.responder(url, dict(data or {}))


def fixture_text(name):
    return (FIXTURES / name).read_text(encoding="utf-8")


@pytest.fixture
def kind_session(monkeypatch):
    def install(responder):
        session = FakeSession(responder)
        monkeypatch.setattr(kind, "make_session", lambda referer=None: session)
        return session

    return install


@pytest.fixture
def dart_session(monkeypatch):
    def install(responder):
        session = FakeSession(responder)
        monkeypatch.setattr(dart, "make_session", lambda referer=None: session)
        return session

    return install


class TestKindCorpList:
    def test_parses_companies(self, kind_session):
        kind_session(lambda url, data: FakeResponse(fixture_text("kind_corp_list.html")))
        companies = kind.fetch_kind_listed_companies()

        assert set(companies.keys()) == {"테스트제1호스팩", "가나다스팩2호"}
        first = companies["테스트제1호스팩"]
        assert first == {
            "name": "테스트제1호스팩",
            "fullName": "테스트제1호기업인수목적 주식회사",
            "industry": "금융 지원 서비스업",
            "mainProduct": "기업인수합병",
            "listingDate": "2024-05-02",
            "fiscalMonth": "12월",
            "ceo": "홍길동",
            "homepage": False,
            "location": "서울특별시",
            "source": "KIND 상장법인목록",
        }
        assert companies["가나다스팩2호"]["homepage"] is True


class TestKindDisclosures:
    def test_parses_rows_and_dedupes_across_terms(self, kind_session):
        session = kind_session(lambda url, data: FakeResponse(fixture_text("kind_disclosures.html")))
        rows = kind.fetch_kind_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        # Both search terms return the same two receipt numbers -> dedup to 2.
        assert len(rows) == 2
        confirmation = rows[0]
        assert confirmation == {
            "date": "2024-03-10 17:30",
            "title": "상장예비심사결과통지(승인)",
            "company": "테스트제1호스팩",
            "submitter": "코스닥시장본부",
            "receiptNo": "20240310000002",
            "source": "KIND 공시검색",
            "url": (
                "https://kind.krx.co.kr/common/disclsviewer.do"
                "?method=search&acptno=20240310000002"
            ),
        }
        # One POST per term: the fixture has < 30 rows, so no page 2 requests.
        assert [call["data"]["pageIndex"] for call in session.post_calls] == ["1", "1"]
        assert [call["data"]["reportNm"] for call in session.post_calls] == ["합병", "상장예비심사"]
        assert session.post_calls[0]["data"]["fromDate"] == "2024-01-01"
        assert session.post_calls[0]["data"]["toDate"] == "2026-06-10"
        assert session.post_calls[0]["data"]["repIsuSrtCd"] == "A000001"

    def test_full_first_page_triggers_second_page(self, kind_session):
        full_rows = "\n".join(
            f"""<tr>
              <td>{idx}</td>
              <td>2024-01-{idx % 28 + 1:02d}</td>
              <td>테스트제1호스팩</td>
              <td><a title="회사합병결정 {idx}"
                     onclick="openDisclsViewer('2024{idx:08d}')">회사합병결정 {idx}</a></td>
              <td>제출인</td>
            </tr>"""
            for idx in range(30)
        )
        full_page = f"<html><body><table><tbody>{full_rows}</tbody></table></body></html>"
        small_page = fixture_text("kind_disclosures.html")
        pages = iter([full_page, small_page, small_page])

        session = kind_session(lambda url, data: FakeResponse(next(pages)))
        rows = kind.fetch_kind_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        # Term 1: page 1 was full (30 rows) -> page 2 fetched (max 2 pages).
        # Term 2: page 1 not full -> stop.
        assert [call["data"]["pageIndex"] for call in session.post_calls] == ["1", "2", "1"]
        assert len(rows) == 32  # 30 unique + 2 from the small page


class TestDartDisclosures:
    def install(self, dart_session):
        def responder(url, data):
            if url == DART_CORP_SEARCH_URL:
                return FakeResponse(fixture_text("dart_corp_search.html"))
            if url == DART_DETAIL_SEARCH_URL:
                return FakeResponse(fixture_text("dart_disclosures.html"))
            raise AssertionError(f"unexpected POST to {url}")

        return dart_session(responder)

    def test_parses_and_filters_by_token(self, dart_session):
        session = self.install(dart_session)
        rows = dart.fetch_dart_disclosures("000001", "테스트제1호스팩", date(2024, 1, 1), TODAY)

        # The 사업보고서 row has no merger/trade-stop token and is filtered out.
        assert [row["title"] for row in rows] == ["[기재정정] 회사합병결정", "주권매매거래정지해제"]
        merger_row = rows[0]
        assert merger_row["date"] == "2024-03-10"  # 2024.03.10 normalized
        assert merger_row["company"] == "테스트제1호기업인수목적"
        assert merger_row["receiptNo"] == "20240310900003"
        assert merger_row["url"] == "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240310900003"
        assert merger_row["source"] == "DART 공시통합검색"

        # corp-code lookup posted the stock code, search posted the corp cik.
        assert session.post_calls[0]["data"] == {"textCrpNm": "000001"}
        assert session.post_calls[1]["data"]["textCrpCik"] == "00999999"
        assert session.post_calls[1]["data"]["textCrpNm"] == "테스트제1호기업인수목적"
        assert session.post_calls[1]["data"]["startDate"] == "20240101"
        assert session.post_calls[1]["data"]["endDate"] == "20260610"

    def test_unknown_corp_returns_empty(self, dart_session):
        dart_session(lambda url, data: FakeResponse("<html><body>no inputs</body></html>"))
        assert dart.fetch_dart_disclosures("999999", "없는스팩", None, TODAY) == []
