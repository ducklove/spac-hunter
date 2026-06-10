"""build_archive_updates merging, archive.json round trip, and cli wiring."""

import json
from datetime import datetime

from spac_hunter import alerts, archive, cli, output
from spac_hunter.constants import KST
from spac_hunter.output import load_existing_last_updated, write_outputs

GENERATED_AT = datetime(2026, 6, 10, 18, 30, 0, tzinfo=KST)
LAST_UPDATED = "2026-06-09 18:10:05 KST"
DATA_JS_PREFIX = "window.SPAC_DATA = "


def merger_record(date="2026-05-01", signal="applied"):
    return {"date": date, "signal": signal, "basePrice": 2050, "title": "회사합병결정"}


def archived_entry(code="900001", archivedAt="2026-06-01T18:30:00+09:00", **kwargs):
    entry = {
        "code": code,
        "name": f"보관{code}스팩",
        "sponsor": "보관증권",
        "listingDate": "2023-01-02",
        "mergerStatus": None,
        "mergerPriceRecords": [],
        "finalPrice": 2000,
        "finalRatio": 1.0,
        "badges": ["일반"],
        "lastSeen": "2026-05-31 18:10:00 KST",
        "archivedAt": archivedAt,
        "delistReasonGuess": "사유 미확인",
    }
    entry.update(kwargs)
    return entry


def write_seed(tmp_path, spacs, generated_at=GENERATED_AT):
    return write_outputs(
        generated_at,
        spacs,
        errors={},
        trust_rate=0.0,
        trust_rate_source="테스트 0.000%",
        force=True,
        data_js_path=tmp_path / "data.js",
        current_json_path=tmp_path / "current.json",
    )


def read_data_js(path):
    text = path.read_text(encoding="utf-8")
    assert text.startswith(DATA_JS_PREFIX)
    return json.loads(text[len(DATA_JS_PREFIX) :].rstrip().rstrip(";"))


class TestBuildArchiveUpdates:
    def test_departed_code_is_archived_with_full_format(self, spac_factory):
        records = [merger_record(), merger_record("2026-05-20", "confirmed")]
        departed = spac_factory(
            code="100002",
            name="떠난스팩",
            sponsor="하나증권",
            listingDate="2023-06-01",
            mergerStatus="합병 확정",
            mergerPriceRecords=records,
            price=2150,
            badges=["합병 확정"],
        )
        existing = {"100001": spac_factory(code="100001"), "100002": departed}

        archive_spacs, newly = archive.build_archive_updates(
            existing, LAST_UPDATED, {"100001"}, [], GENERATED_AT
        )

        assert archive_spacs == newly
        assert newly == [
            {
                "code": "100002",
                "name": "떠난스팩",
                "sponsor": "하나증권",
                "listingDate": "2023-06-01",
                "mergerStatus": "합병 확정",
                "mergerPriceRecords": records,
                "finalPrice": 2150,
                "finalRatio": 1.075,
                "badges": ["합병 확정"],
                "lastSeen": LAST_UPDATED,
                "archivedAt": GENERATED_AT.isoformat(),
                "delistReasonGuess": "합병 신상장 추정",
            }
        ]

    def test_non_confirmed_merger_status_gives_unknown_reason(self, spac_factory):
        existing = {
            "100003": spac_factory(code="100003", mergerStatus="합병 신청"),
            "100004": spac_factory(code="100004", mergerStatus=None),
        }
        _, newly = archive.build_archive_updates(existing, LAST_UPDATED, set(), [], GENERATED_AT)
        assert {entry["delistReasonGuess"] for entry in newly} == {"사유 미확인"}

    def test_surviving_codes_are_not_archived(self, spac_factory):
        existing = {"100001": spac_factory(code="100001")}
        archive_spacs, newly = archive.build_archive_updates(
            existing, LAST_UPDATED, {"100001"}, [], GENERATED_AT
        )
        assert archive_spacs == []
        assert newly == []

    def test_previous_entries_are_kept_not_rearchived(self, spac_factory):
        previous = [archived_entry(code="100002", finalPrice=1990)]
        # The code is somehow still present in the previous data.js snapshot:
        # the original archive entry must win and no duplicate may be created.
        existing = {"100002": spac_factory(code="100002", price=2222)}

        archive_spacs, newly = archive.build_archive_updates(
            existing, LAST_UPDATED, set(), previous, GENERATED_AT
        )

        assert newly == []
        assert archive_spacs == previous
        assert archive_spacs[0]["finalPrice"] == 1990

    def test_relisted_code_is_removed_from_archive(self):
        previous = [archived_entry(code="100002"), archived_entry(code="100003")]
        archive_spacs, newly = archive.build_archive_updates(
            {}, LAST_UPDATED, {"100002"}, previous, GENERATED_AT
        )
        assert newly == []
        assert [entry["code"] for entry in archive_spacs] == ["100003"]

    def test_sorted_by_archived_at_desc(self, spac_factory):
        previous = [archived_entry(code="100009", archivedAt="2026-06-01T18:30:00+09:00")]
        existing = {"100002": spac_factory(code="100002")}
        archive_spacs, _ = archive.build_archive_updates(
            existing, LAST_UPDATED, set(), previous, GENERATED_AT
        )
        assert [entry["code"] for entry in archive_spacs] == ["100002", "100009"]

    def test_last_seen_none_when_previous_payload_missing(self, spac_factory):
        existing = {"100002": spac_factory(code="100002")}
        _, newly = archive.build_archive_updates(existing, None, set(), [], GENERATED_AT)
        assert newly[0]["lastSeen"] is None


class TestArchiveJsonRoundTrip:
    def test_write_and_load(self, tmp_path):
        entries = [archived_entry(code="100002"), archived_entry(code="100003")]
        path = tmp_path / "archive.json"

        written = archive.write_archive(entries, GENERATED_AT, path=path)

        assert written == path
        payload = json.loads(path.read_text(encoding="utf-8"))
        assert payload["updatedAt"] == GENERATED_AT.isoformat()
        assert payload["count"] == 2
        assert payload["spacs"] == entries
        assert archive.load_archive(path) == entries

    def test_write_empty_archive(self, tmp_path):
        path = tmp_path / "archive.json"
        archive.write_archive([], GENERATED_AT, path=path)
        payload = json.loads(path.read_text(encoding="utf-8"))
        assert payload == {"updatedAt": GENERATED_AT.isoformat(), "count": 0, "spacs": []}
        assert archive.load_archive(path) == []

    def test_load_missing_file_returns_empty(self, tmp_path):
        assert archive.load_archive(tmp_path / "missing.json") == []

    def test_load_corrupt_file_returns_empty(self, tmp_path):
        path = tmp_path / "archive.json"
        path.write_text("{broken", encoding="utf-8")
        assert archive.load_archive(path) == []

    def test_load_tolerates_wrong_shapes(self, tmp_path):
        path = tmp_path / "archive.json"
        path.write_text(json.dumps([1, 2]), encoding="utf-8")
        assert archive.load_archive(path) == []
        path.write_text(json.dumps({"spacs": "nope"}), encoding="utf-8")
        assert archive.load_archive(path) == []
        path.write_text(
            json.dumps({"spacs": [{"code": "1"}, {"name": "코드 없음"}, 7]}), encoding="utf-8"
        )
        assert archive.load_archive(path) == [{"code": "1"}]


class TestLoadExistingLastUpdated:
    def test_round_trip_from_written_payload(self, tmp_path, spac_factory):
        write_seed(tmp_path, [spac_factory()])
        assert load_existing_last_updated(tmp_path / "data.js") == "2026-06-10 18:30:00 KST"

    def test_missing_or_broken_payload(self, tmp_path):
        assert load_existing_last_updated(tmp_path / "missing.js") is None
        broken = tmp_path / "broken.js"
        broken.write_text("window.SPAC_DATA = {oops", encoding="utf-8")
        assert load_existing_last_updated(broken) is None


class TestWriteOutputsArchiveStatistics:
    def test_archive_is_embedded_in_statistics(self, tmp_path, spac_factory):
        entry = archived_entry(
            code="900001",
            mergerStatus="합병 확정",
            delistReasonGuess="합병 신상장 추정",
            mergerPriceRecords=[merger_record(), merger_record("2026-05-20", "confirmed")],
        )
        write_outputs(
            GENERATED_AT,
            [spac_factory(code="100001")],
            errors={},
            trust_rate=0.0,
            trust_rate_source="테스트 0.000%",
            force=True,
            data_js_path=tmp_path / "data.js",
            current_json_path=tmp_path / "current.json",
            archive=[entry],
        )

        statistics = read_data_js(tmp_path / "data.js")["statistics"]
        assert statistics["archive"]["count"] == 1
        assert statistics["archive"]["recent"][0]["code"] == "900001"
        assert statistics["mergerFunnel"]["archivedSpacCount"] == 1
        assert statistics["mergerFunnel"]["successCount"] == 1


class TestCliArchiveWiring:
    def _patch_paths(self, tmp_path, monkeypatch):
        monkeypatch.setattr(output, "DATA_JS_PATH", tmp_path / "data.js")
        monkeypatch.setattr(output, "CURRENT_JSON_PATH", tmp_path / "current.json")
        monkeypatch.setattr(archive, "ARCHIVE_JSON_PATH", tmp_path / "archive.json")
        monkeypatch.setattr(alerts, "ALERTS_JSON_PATH", tmp_path / "alerts.json")
        monkeypatch.setattr(alerts, "ALERTS_XML_PATH", tmp_path / "alerts.xml")
        monkeypatch.delenv("TELEGRAM_BOT_TOKEN", raising=False)
        monkeypatch.delenv("TELEGRAM_CHAT_ID", raising=False)

    def test_sample_mode_never_touches_the_archive(self, tmp_path, monkeypatch):
        self._patch_paths(tmp_path, monkeypatch)
        calls = []
        monkeypatch.setattr(archive, "load_archive", lambda *a, **k: calls.append("load") or [])
        monkeypatch.setattr(
            archive, "build_archive_updates", lambda *a, **k: calls.append("build") or ([], [])
        )
        monkeypatch.setattr(archive, "write_archive", lambda *a, **k: calls.append("write"))

        cli.main(["--sample", "--force"])

        assert (tmp_path / "data.js").exists()
        assert calls == []  # archive code paths are never entered in sample mode
        assert not (tmp_path / "archive.json").exists()
        statistics = read_data_js(tmp_path / "data.js")["statistics"]
        assert statistics["archive"] == {"count": 0, "recent": []}
        assert statistics["mergerFunnel"]["archivedSpacCount"] == 0

    def _patch_live_sources(self, monkeypatch):
        monkeypatch.setattr(
            cli,
            "fetch_kofr_rate",
            lambda: {"rate": 0.0, "latestRatePct": 0.0, "publishedDate": "2026-06-09"},
        )
        monkeypatch.setattr(
            cli,
            "fetch_krx_spac_universe",
            lambda existing: [{"code": "100001", "name": "남는스팩", "market": "KOSDAQ", "isin": None}],
        )
        monkeypatch.setattr(cli, "fetch_kind_listed_companies", lambda: {})
        monkeypatch.setattr(cli, "fetch_quotes", lambda codes, max_workers: ({"100001": {"price": 2000}}, {}))
        monkeypatch.setattr(cli, "fetch_histories", lambda codes, pages, max_workers=2: {})

    def test_live_mode_archives_departure_and_emits_delisted_alert(
        self, tmp_path, monkeypatch, spac_factory
    ):
        self._patch_paths(tmp_path, monkeypatch)
        write_seed(
            tmp_path,
            [
                spac_factory(code="100001", name="남는스팩"),
                spac_factory(code="100002", name="떠난스팩", mergerStatus="합병 확정"),
            ],
            generated_at=datetime(2026, 6, 9, 18, 10, 0, tzinfo=KST),
        )
        self._patch_live_sources(monkeypatch)

        cli.main(["--skip-disclosures"])

        payload = json.loads((tmp_path / "archive.json").read_text(encoding="utf-8"))
        assert payload["count"] == 1
        entry = payload["spacs"][0]
        assert entry["code"] == "100002"
        assert entry["delistReasonGuess"] == "합병 신상장 추정"
        assert entry["lastSeen"] == "2026-06-09 18:10:00 KST"

        statistics = read_data_js(tmp_path / "data.js")["statistics"]
        assert statistics["archive"]["count"] == 1
        assert statistics["archive"]["recent"][0]["code"] == "100002"
        assert statistics["mergerFunnel"]["archivedSpacCount"] == 1

        stored = json.loads((tmp_path / "alerts.json").read_text(encoding="utf-8"))["alerts"]
        delisted = [alert for alert in stored if alert["type"] == "delisted"]
        assert [alert["code"] for alert in delisted] == ["100002"]
        assert delisted[0]["title"] == "떠난스팩 유니버스 제외(상폐 추정)"

    def test_live_mode_rerun_does_not_rewrite_unchanged_archive(
        self, tmp_path, monkeypatch, spac_factory
    ):
        self._patch_paths(tmp_path, monkeypatch)
        write_seed(
            tmp_path,
            [
                spac_factory(code="100001", name="남는스팩"),
                spac_factory(code="100002", name="떠난스팩"),
            ],
            generated_at=datetime(2026, 6, 9, 18, 10, 0, tzinfo=KST),
        )
        self._patch_live_sources(monkeypatch)

        cli.main(["--skip-disclosures"])
        first = (tmp_path / "archive.json").read_text(encoding="utf-8")

        cli.main(["--skip-disclosures"])

        # Same universe again: the already-archived code is kept as-is and the
        # file is not rewritten (updatedAt unchanged).
        assert (tmp_path / "archive.json").read_text(encoding="utf-8") == first
        assert json.loads(first)["spacs"][0]["delistReasonGuess"] == "사유 미확인"
