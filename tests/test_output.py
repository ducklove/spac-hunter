"""Write guard, write_outputs serialization, and load_existing_spacs round trip."""

import json
from datetime import datetime

import pytest

from spac_hunter.constants import KST
from spac_hunter.output import load_existing_spacs, write_outputs

GENERATED_AT = datetime(2026, 6, 10, 12, 0, 0, tzinfo=KST)


def write(tmp_path, spacs, force=False, collection=None):
    return write_outputs(
        GENERATED_AT,
        spacs,
        errors={},
        trust_rate=0.0,
        trust_rate_source="테스트 0.000%",
        collection=collection,
        force=force,
        data_js_path=tmp_path / "data.js",
        current_json_path=tmp_path / "current.json",
    )


def read_payload(path):
    text = path.read_text(encoding="utf-8")
    assert text.startswith("window.SPAC_DATA = ")
    assert text.rstrip().endswith(";")
    return json.loads(text[len("window.SPAC_DATA = ") :].rstrip().rstrip(";"))


class TestWriteGuard:
    def test_shrink_is_rejected_with_exit_2(self, tmp_path, spac_factory):
        baseline = [spac_factory(code=f"1{idx:05d}") for idx in range(12)]
        write(tmp_path, baseline, force=True)

        with pytest.raises(SystemExit) as excinfo:
            write(tmp_path, [spac_factory(code="200000")])
        assert excinfo.value.code == 2
        # Nothing was overwritten.
        assert len(read_payload(tmp_path / "data.js")["spacs"]) == 12

    def test_force_bypasses_shrink_guard(self, tmp_path, spac_factory):
        baseline = [spac_factory(code=f"1{idx:05d}") for idx in range(12)]
        write(tmp_path, baseline, force=True)

        write(tmp_path, [spac_factory(code="200000")], force=True)
        assert len(read_payload(tmp_path / "data.js")["spacs"]) == 1

    def test_shrink_within_70pct_is_allowed(self, tmp_path, spac_factory):
        baseline = [spac_factory(code=f"1{idx:05d}") for idx in range(10)]
        write(tmp_path, baseline, force=True)

        write(tmp_path, [spac_factory(code=f"3{idx:05d}") for idx in range(7)])  # 70% boundary
        assert len(read_payload(tmp_path / "data.js")["spacs"]) == 7

    def test_small_existing_dataset_skips_shrink_guard(self, tmp_path, spac_factory):
        write(tmp_path, [spac_factory(code=f"1{idx:05d}") for idx in range(9)], force=True)
        write(tmp_path, [spac_factory(code="200000")])  # 9 < 10 existing -> no shrink rule
        assert len(read_payload(tmp_path / "data.js")["spacs"]) == 1

    def test_low_price_coverage_is_rejected(self, tmp_path, spac_factory):
        spacs = [spac_factory(code=f"1{idx:05d}", price=2000 if idx < 4 else None) for idx in range(10)]
        with pytest.raises(SystemExit) as excinfo:
            write(tmp_path, spacs)  # 40% coverage on a fresh directory
        assert excinfo.value.code == 2
        assert not (tmp_path / "data.js").exists()

    def test_low_price_coverage_with_force(self, tmp_path, spac_factory):
        spacs = [spac_factory(code=f"1{idx:05d}", price=2000 if idx < 4 else None) for idx in range(10)]
        write(tmp_path, spacs, force=True)
        assert (tmp_path / "data.js").exists()

    def test_empty_spacs_rejected(self, tmp_path):
        with pytest.raises(SystemExit) as excinfo:
            write(tmp_path, [])
        assert excinfo.value.code == 2

    def test_guard_rejection_leaves_data_json_untouched(self, tmp_path, spac_factory):
        baseline = [spac_factory(code=f"1{idx:05d}") for idx in range(12)]
        write(tmp_path, baseline, force=True)

        with pytest.raises(SystemExit):
            write(tmp_path, [spac_factory(code="200000")])
        preserved = json.loads((tmp_path / "data.json").read_text(encoding="utf-8"))
        assert len(preserved["spacs"]) == 12


class TestWriteOutputs:
    def test_serialization_and_new_fields(self, tmp_path, spac_factory):
        collection = {
            "universe": 2,
            "quotesOk": 2,
            "quotesFailed": 0,
            "disclosuresOk": 0,
            "disclosuresFailed": 0,
            "historiesOk": 0,
        }
        spacs = [
            spac_factory(code="100001", name="가나스팩1호", price=2100),
            spac_factory(code="100002", name="다라스팩2호", price=1900),
        ]
        data_js, current_json = write(tmp_path, spacs, collection=collection)

        payload = read_payload(data_js)
        assert payload["schemaVersion"] == 2
        assert payload["collection"] == collection
        assert payload["lastUpdated"] == "2026-06-10 12:00:00 KST"
        assert "sponsorStats" in payload["statistics"]
        # Sorted ascending by ratio: 1900 (0.95) before 2100 (1.05).
        assert [spac["code"] for spac in payload["spacs"]] == ["100002", "100001"]

        current = json.loads(current_json.read_text(encoding="utf-8"))
        assert set(current["prices"].keys()) == {"100001", "100002"}
        assert current["prices"]["100002"]["currentPrice"] == 1900
        assert current["summary"]["totalCount"] == 2

    def test_data_json_mirrors_data_js_payload(self, tmp_path, spac_factory):
        """data.json은 data.js와 동일 페이로드의 순수 JSON — 대시보드 비동기 로드용."""
        spacs = [
            spac_factory(code="100001", name="가나스팩1호", price=2100),
            spac_factory(code="100002", name="다라스팩2호", price=1900),
        ]
        write(tmp_path, spacs)

        data_json = tmp_path / "data.json"
        assert data_json.exists()
        text = data_json.read_text(encoding="utf-8")
        assert not text.startswith("window.SPAC_DATA")  # 프리픽스 없는 순수 JSON
        assert json.loads(text) == read_payload(tmp_path / "data.js")

    def test_load_existing_spacs_round_trip(self, tmp_path, spac_factory):
        spacs = [spac_factory(code="100001", name="가나스팩1호"), spac_factory(code="100002")]
        write(tmp_path, spacs)
        loaded = load_existing_spacs(tmp_path / "data.js")
        assert set(loaded.keys()) == {"100001", "100002"}
        assert loaded["100001"]["name"] == "가나스팩1호"

    def test_load_existing_spacs_missing_or_invalid(self, tmp_path):
        assert load_existing_spacs(tmp_path / "missing.js") == {}
        bogus = tmp_path / "bogus.js"
        bogus.write_text("not spac data", encoding="utf-8")
        assert load_existing_spacs(bogus) == {}
        broken = tmp_path / "broken.js"
        broken.write_text("window.SPAC_DATA = {broken json;", encoding="utf-8")
        assert load_existing_spacs(broken) == {}
