"""build_alerts diffing, alerts.json/alerts.xml writing, sample-mode skip, Telegram."""

import json
import xml.etree.ElementTree as ET
from datetime import datetime

import pytest

from spac_hunter import alerts, cli, output
from spac_hunter.constants import KST

GENERATED_AT = datetime(2026, 6, 10, 18, 30, 0, tzinfo=KST)


def record(date="2026-06-09", signal="applied", title="회사합병결정", **kwargs):
    row = {
        "date": date,
        "signal": signal,
        "title": title,
        "basePrice": 2050,
        "baseRatio": 1.025,
        "url": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=1",
    }
    row.update(kwargs)
    return row


class TestBuildAlerts:
    def test_new_merger_record_alert(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", mergerPriceRecords=[record()])}
        new = [
            spac_factory(
                code="000001",
                name="교보14호스팩",
                mergerPriceRecords=[
                    record(),
                    record(date="2026-06-10", signal="confirmed", title="상장예비심사결과통지(승인)"),
                ],
            )
        ]

        result = alerts.build_alerts(prev, new, GENERATED_AT)

        assert len(result) == 1
        alert = result[0]
        assert alert["id"] == "2026-06-10|merger_confirmed|000001"
        assert alert["type"] == "merger_confirmed"
        assert alert["date"] == "2026-06-10"
        assert alert["title"] == "교보14호스팩 합병 확정 공시"
        assert "상장예비심사결과통지(승인)" in alert["detail"]
        assert "공시일 기준가 2,050" in alert["detail"]
        assert alert["url"] == "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=1"

    def test_unchanged_merger_records_produce_no_alert(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", mergerPriceRecords=[record()])}
        new = [spac_factory(code="000001", mergerPriceRecords=[record()])]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

    def test_applied_and_canceled_types(self, spac_factory):
        prev = {"000001": spac_factory(code="000001")}
        new = [
            spac_factory(
                code="000001",
                mergerPriceRecords=[
                    record(date="2026-06-01", signal="applied"),
                    record(date="2026-06-09", signal="canceled", title="합병결정철회"),
                ],
            )
        ]
        result = alerts.build_alerts(prev, new, GENERATED_AT)
        assert [alert["type"] for alert in result] == ["merger_canceled", "merger_applied"]

    def test_dissolution_alert_only_when_new(self, spac_factory):
        disclosure = {
            "date": "2026-06-08 17:00",
            "title": "해산사유 발생",
            "url": "https://kind.krx.co.kr/view",
        }
        prev = {"000001": spac_factory(code="000001")}
        new = [spac_factory(code="000001", name="제이스팩", dissolutionDisclosure=disclosure)]

        result = alerts.build_alerts(prev, new, GENERATED_AT)
        assert [alert["type"] for alert in result] == ["dissolution"]
        assert result[0]["date"] == "2026-06-08"
        assert result[0]["title"] == "제이스팩 해산사유 발생 공시"
        assert result[0]["detail"] == "해산사유 발생"
        assert result[0]["url"] == "https://kind.krx.co.kr/view"

        # Already known in the previous snapshot -> no repeated alert.
        prev_known = {"000001": spac_factory(code="000001", dissolutionDisclosure=disclosure)}
        assert alerts.build_alerts(prev_known, new, GENERATED_AT) == []

    def test_below_ipo_enter_and_exit(self, spac_factory):
        prev = {
            "000001": spac_factory(code="000001", price=2000),
            "000002": spac_factory(code="000002", price=1900),
        }
        new = [
            spac_factory(code="000001", price=1980),
            spac_factory(code="000002", price=2000),
        ]

        result = alerts.build_alerts(prev, new, GENERATED_AT)

        types = {alert["code"]: alert["type"] for alert in result}
        assert types == {"000001": "below_ipo_enter", "000002": "below_ipo_exit"}
        # No event date -> the generated date is used.
        assert all(alert["date"] == "2026-06-10" for alert in result)
        enter = next(alert for alert in result if alert["type"] == "below_ipo_enter")
        assert "1.0000 → 0.9900" in enter["detail"]
        assert "현재가 1,980" in enter["detail"]

    def test_below_ipo_requires_both_ratios(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", price=None)}
        new = [spac_factory(code="000001", price=1900)]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

        prev = {"000001": spac_factory(code="000001", price=2100)}
        new = [spac_factory(code="000001", price=None)]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

    def test_below_ipo_no_alert_without_crossing(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", price=1950)}
        new = [spac_factory(code="000001", price=1900)]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

    def test_near_liquidation_entry(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", daysToLiquidation=200)}
        new = [
            spac_factory(code="000001", daysToLiquidation=170, liquidationDate="2026-11-27")
        ]

        result = alerts.build_alerts(prev, new, GENERATED_AT)

        assert [alert["type"] for alert in result] == ["near_liquidation"]
        assert result[0]["date"] == "2026-06-10"
        assert result[0]["detail"] == "청산예정일 2026-11-27 (D-170)"

    def test_near_liquidation_not_repeated_or_from_unknown(self, spac_factory):
        prev = {"000001": spac_factory(code="000001", daysToLiquidation=170)}
        new = [spac_factory(code="000001", daysToLiquidation=150)]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

        prev = {"000001": spac_factory(code="000001", daysToLiquidation=None)}
        new = [spac_factory(code="000001", daysToLiquidation=100)]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

    def test_new_listing_with_near_liquidation_for_missing_previous(self, spac_factory):
        new = [
            spac_factory(
                code="000009", name="신규스팩", listingDate="2026-06-01", daysToLiquidation=90
            )
        ]
        result = alerts.build_alerts({}, new, GENERATED_AT)

        assert sorted(alert["type"] for alert in result) == ["near_liquidation", "new_listing"]
        listing = next(alert for alert in result if alert["type"] == "new_listing")
        assert listing["date"] == "2026-06-01"
        assert listing["title"] == "신규스팩 신규 상장"
        assert "상장일 2026-06-01" in listing["detail"]

    def test_existing_codes_do_not_become_new_listings(self, spac_factory):
        prev = {"000001": spac_factory(code="000001")}
        new = [spac_factory(code="000001")]
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []

    def test_sorting_date_desc_then_type_then_code(self, spac_factory):
        disclosure = {"date": "2026-06-10", "title": "해산사유 발생"}
        prev = {
            "000005": spac_factory(code="000005", price=2000),
            "000004": spac_factory(code="000004"),
        }
        new = [
            spac_factory(code="000005", price=1900),  # below_ipo_enter @ generated date
            spac_factory(code="000004", dissolutionDisclosure=disclosure),  # dissolution @ 06-10
            spac_factory(code="000006", listingDate="2026-06-01"),  # new_listing @ 06-01
        ]

        result = alerts.build_alerts(prev, new, GENERATED_AT)

        assert [(alert["date"], alert["type"], alert["code"]) for alert in result] == [
            ("2026-06-10", "below_ipo_enter", "000005"),
            ("2026-06-10", "dissolution", "000004"),
            ("2026-06-01", "new_listing", "000006"),
        ]


class TestDelistedAlerts:
    def archived_entry(self, **kwargs):
        entry = {
            "code": "999999",
            "name": "사라진스팩",
            "delistReasonGuess": "합병 신상장 추정",
            "finalRatio": 1.235,
        }
        entry.update(kwargs)
        return entry

    def test_newly_archived_entry_produces_delisted_alert(self):
        result = alerts.build_alerts({}, [], GENERATED_AT, newly_archived=[self.archived_entry()])

        assert len(result) == 1
        alert = result[0]
        assert alert["id"] == "2026-06-10|delisted|999999"
        assert alert["type"] == "delisted"
        assert alert["date"] == "2026-06-10"
        assert alert["code"] == "999999"
        assert alert["name"] == "사라진스팩"
        assert alert["title"] == "사라진스팩 유니버스 제외(상폐 추정)"
        assert alert["detail"] == "합병 신상장 추정, 마지막 공모가 대비 1.2350배"
        assert "url" not in alert

    def test_detail_without_final_ratio_or_reason(self):
        entry = self.archived_entry(delistReasonGuess="사유 미확인", finalRatio=None)
        result = alerts.build_alerts({}, [], GENERATED_AT, newly_archived=[entry])
        assert result[0]["detail"] == "사유 미확인"

        result = alerts.build_alerts(
            {}, [], GENERATED_AT, newly_archived=[self.archived_entry(delistReasonGuess=None)]
        )
        assert result[0]["detail"] == "사유 미확인, 마지막 공모가 대비 1.2350배"

    def test_entries_without_code_are_skipped(self):
        assert alerts.build_alerts({}, [], GENERATED_AT, newly_archived=[{"name": "코드없음"}]) == []

    def test_default_signature_produces_no_delisted_alerts(self, spac_factory):
        prev = {"000001": spac_factory(code="000001")}
        new = [spac_factory(code="000001")]
        # Backward-compatible: omitted, None, and [] all behave identically.
        assert alerts.build_alerts(prev, new, GENERATED_AT) == []
        assert alerts.build_alerts(prev, new, GENERATED_AT, newly_archived=None) == []
        assert alerts.build_alerts(prev, new, GENERATED_AT, newly_archived=[]) == []

    def test_delisted_sorts_with_other_alert_types(self, spac_factory):
        prev = {"000005": spac_factory(code="000005", price=2000)}
        new = [spac_factory(code="000005", price=1900)]  # below_ipo_enter @ generated date

        result = alerts.build_alerts(
            prev, new, GENERATED_AT, newly_archived=[self.archived_entry(code="000009")]
        )

        # Same date: stable type ordering ("below_ipo_enter" < "delisted").
        assert [(alert["type"], alert["code"]) for alert in result] == [
            ("below_ipo_enter", "000005"),
            ("delisted", "000009"),
        ]


class TestWriteAlertOutputs:
    def test_writes_json_and_parseable_escaped_rss(self, tmp_path):
        new = [
            alerts._make_alert(
                "2026-06-10",
                "merger_applied",
                "000001",
                "교보14호스팩",
                "교보14호스팩 합병 신청 공시",
                detail='A&B <테스트> "따옴표"',
                url="https://example.test/?a=1&b=2",
            )
        ]
        json_path = tmp_path / "alerts.json"
        xml_path = tmp_path / "alerts.xml"

        fresh = alerts.write_alert_outputs(new, GENERATED_AT, json_path=json_path, xml_path=xml_path)

        assert fresh == new
        payload = json.loads(json_path.read_text(encoding="utf-8"))
        assert payload["generatedAt"] == GENERATED_AT.isoformat()
        assert payload["alerts"] == new

        # Special characters were escaped: the XML must re-parse and round-trip.
        root = ET.fromstring(xml_path.read_text(encoding="utf-8"))
        assert root.tag == "rss"
        assert root.get("version") == "2.0"
        channel = root.find("channel")
        assert channel.findtext("title") == "스팩 헌터 알림"
        assert channel.findtext("link") == "https://github.com/ducklove/spac-hunter"
        assert channel.findtext("description")
        items = channel.findall("item")
        assert len(items) == 1
        item = items[0]
        assert item.findtext("title") == "교보14호스팩 합병 신청 공시"
        assert item.findtext("description") == 'A&B <테스트> "따옴표"'
        assert item.findtext("link") == "https://example.test/?a=1&b=2"
        guid = item.find("guid")
        assert guid.text == "2026-06-10|merger_applied|000001"
        assert guid.get("isPermaLink") == "false"
        assert item.findtext("pubDate") == "Wed, 10 Jun 2026 18:30:00 +0900"

    def test_item_without_url_links_to_channel(self, tmp_path):
        new = [alerts._make_alert("2026-06-10", "new_listing", "000001", "스팩", "스팩 신규 상장")]
        alerts.write_alert_outputs(
            new, GENERATED_AT, json_path=tmp_path / "a.json", xml_path=tmp_path / "a.xml"
        )
        root = ET.fromstring((tmp_path / "a.xml").read_text(encoding="utf-8"))
        item = root.find("channel").find("item")
        assert item.findtext("link") == "https://github.com/ducklove/spac-hunter"
        # detail is None -> description falls back to the title.
        assert item.findtext("description") == "스팩 신규 상장"

    def test_existing_alert_price_units_are_migrated(self, tmp_path):
        json_path = tmp_path / "alerts.json"
        xml_path = tmp_path / "alerts.xml"
        json_path.write_text(
            json.dumps(
                {
                    "alerts": [
                        {
                            "id": "2026-06-09|below_ipo_enter|000001",
                            "date": "2026-06-09",
                            "type": "below_ipo_enter",
                            "code": "000001",
                            "name": "스팩",
                            "title": "스팩 공모가 이하 진입",
                            "detail": "공모가 대비 1.0000 → 0.9990 (현재가 1,998원)",
                        }
                    ]
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )

        alerts.write_alert_outputs([], GENERATED_AT, json_path=json_path, xml_path=xml_path)

        payload = json.loads(json_path.read_text(encoding="utf-8"))
        assert payload["alerts"][0]["detail"] == "공모가 대비 1.0000 → 0.9990 (현재가 1,998)"
        root = ET.fromstring(xml_path.read_text(encoding="utf-8"))
        assert root.find("channel").find("item").findtext("description").endswith("(현재가 1,998)")

    def test_merges_dedupes_caps_500_and_rss_caps_50(self, tmp_path):
        json_path = tmp_path / "alerts.json"
        xml_path = tmp_path / "alerts.xml"
        first = [
            alerts._make_alert(
                f"2026-{(idx % 5) + 1:02d}-{(idx % 28) + 1:02d}",
                "new_listing",
                f"{idx:06d}",
                f"스팩{idx}",
                f"스팩{idx} 신규 상장",
            )
            for idx in range(490)
        ]
        fresh1 = alerts.write_alert_outputs(first, GENERATED_AT, json_path=json_path, xml_path=xml_path)
        assert len(fresh1) == 490

        second = first[:5] + [
            alerts._make_alert(
                "2026-06-10", "new_listing", f"9{idx:05d}", f"신규{idx}", f"신규{idx} 신규 상장"
            )
            for idx in range(30)
        ]
        fresh2 = alerts.write_alert_outputs(second, GENERATED_AT, json_path=json_path, xml_path=xml_path)

        # The 5 already-known ids were dropped; only the 30 new ones are fresh.
        assert len(fresh2) == 30
        payload = json.loads(json_path.read_text(encoding="utf-8"))
        stored = payload["alerts"]
        assert len(stored) == 500  # 490 + 30 = 520, capped at 500
        assert len({alert["id"] for alert in stored}) == 500
        assert stored[0]["date"] == "2026-06-10"  # newest first
        dates = [alert["date"] for alert in stored]
        assert dates == sorted(dates, reverse=True)

        root = ET.fromstring(xml_path.read_text(encoding="utf-8"))
        assert len(root.find("channel").findall("item")) == 50

    def test_corrupt_existing_json_is_ignored(self, tmp_path):
        json_path = tmp_path / "alerts.json"
        json_path.write_text("{broken", encoding="utf-8")
        new = [alerts._make_alert("2026-06-10", "new_listing", "000001", "스팩", "스팩 신규 상장")]
        fresh = alerts.write_alert_outputs(
            new, GENERATED_AT, json_path=json_path, xml_path=tmp_path / "a.xml"
        )
        assert fresh == new
        assert json.loads(json_path.read_text(encoding="utf-8"))["alerts"] == new


class TestSampleModeSkipsAlerts:
    def test_cli_sample_produces_no_alert_files(self, tmp_path, monkeypatch):
        monkeypatch.setattr(output, "DATA_JS_PATH", tmp_path / "data.js")
        monkeypatch.setattr(output, "CURRENT_JSON_PATH", tmp_path / "current.json")
        monkeypatch.setattr(alerts, "ALERTS_JSON_PATH", tmp_path / "alerts.json")
        monkeypatch.setattr(alerts, "ALERTS_XML_PATH", tmp_path / "alerts.xml")
        calls = []
        monkeypatch.setattr(alerts, "write_alert_outputs", lambda *a, **k: calls.append(a) or [])
        monkeypatch.setattr(alerts, "send_telegram", lambda *a, **k: calls.append(a) or False)

        cli.main(["--sample", "--force"])

        assert (tmp_path / "data.js").exists()
        assert (tmp_path / "current.json").exists()
        assert calls == []  # alert generation is never invoked in sample mode
        assert not (tmp_path / "alerts.json").exists()
        assert not (tmp_path / "alerts.xml").exists()


class FakeTelegramSession:
    def __init__(self, fail=False):
        self.fail = fail
        self.posts = []

    def post(self, url, data=None, timeout=None):
        if self.fail:
            raise RuntimeError("telegram down")
        self.posts.append({"url": url, "data": dict(data or {})})

        class Response:
            def raise_for_status(self):
                return None

        return Response()


def sample_alerts(count):
    return [
        alerts._make_alert(
            f"2026-06-{idx + 1:02d}",
            "new_listing",
            f"{idx:06d}",
            f"스팩{idx}",
            f"스팩{idx} 신규 상장",
            detail=f"현재가 2,00{idx}",
        )
        for idx in range(count)
    ]


class TestSendTelegram:
    @pytest.fixture
    def telegram_env(self, monkeypatch):
        monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "tok123")
        monkeypatch.setenv("TELEGRAM_CHAT_ID", "chat456")

    def test_skipped_without_env(self, monkeypatch):
        monkeypatch.delenv("TELEGRAM_BOT_TOKEN", raising=False)
        monkeypatch.delenv("TELEGRAM_CHAT_ID", raising=False)
        monkeypatch.setattr(
            alerts, "shared_session", lambda: pytest.fail("must not touch the session")
        )
        assert alerts.send_telegram(sample_alerts(1)) is False

    def test_skipped_with_partial_env(self, monkeypatch):
        monkeypatch.setenv("TELEGRAM_BOT_TOKEN", "tok123")
        monkeypatch.delenv("TELEGRAM_CHAT_ID", raising=False)
        monkeypatch.setattr(
            alerts, "shared_session", lambda: pytest.fail("must not touch the session")
        )
        assert alerts.send_telegram(sample_alerts(1)) is False

    def test_skipped_with_zero_new_alerts(self, telegram_env, monkeypatch):
        monkeypatch.setattr(
            alerts, "shared_session", lambda: pytest.fail("must not touch the session")
        )
        assert alerts.send_telegram([]) is False

    def test_sends_single_summary_capped_at_ten(self, telegram_env, monkeypatch):
        session = FakeTelegramSession()
        monkeypatch.setattr(alerts, "shared_session", lambda: session)

        assert alerts.send_telegram(sample_alerts(12)) is True

        assert len(session.posts) == 1
        post = session.posts[0]
        assert post["url"] == "https://api.telegram.org/bottok123/sendMessage"
        assert post["data"]["chat_id"] == "chat456"
        assert post["data"]["disable_web_page_preview"] == "true"
        text = post["data"]["text"]
        assert text.startswith("[스팩 헌터] 새 알림 12건")
        assert sum(1 for line in text.splitlines() if line.startswith("- ")) == 10
        assert "외 2건" in text

    def test_exception_never_propagates(self, telegram_env, monkeypatch, caplog):
        monkeypatch.setattr(alerts, "shared_session", lambda: FakeTelegramSession(fail=True))
        with caplog.at_level("WARNING", logger="spac_hunter.alerts"):
            assert alerts.send_telegram(sample_alerts(1)) is False
        assert "Telegram 알림 발송 실패" in caplog.text
