"""validate_data.py: data.js + data.json 쌍 검증 (파이프라인-프론트 계약 고정)."""

import json

import validate_data


def make_payload(count=3):
    return {
        "schemaVersion": 2,
        "lastUpdated": "2026-07-11 15:30:00 KST",
        "spacs": [
            {"code": f"1{idx:05d}", "name": f"테스트{idx}호스팩", "currentPrice": 2000}
            for idx in range(count)
        ],
    }


def write_pair(tmp_path, payload, json_payload=None):
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    js_path = tmp_path / "data.js"
    js_path.write_text(f"window.SPAC_DATA = {body};\n", encoding="utf-8")
    json_path = tmp_path / "data.json"
    json_body = body if json_payload is None else json.dumps(json_payload, ensure_ascii=False, indent=2)
    json_path.write_text(json_body + "\n", encoding="utf-8")
    return str(js_path), str(json_path)


class TestValidatePair:
    def test_matching_pair_passes(self, tmp_path):
        js_path, json_path = write_pair(tmp_path, make_payload())
        failures, summary = validate_data.validate_pair(js_path, json_path, min_count=3)
        assert failures == []
        assert summary["spacCount"] == 3

    def test_missing_data_json_fails(self, tmp_path):
        js_path, json_path = write_pair(tmp_path, make_payload())
        (tmp_path / "data.json").unlink()
        failures, _ = validate_data.validate_pair(js_path, json_path, min_count=3)
        assert any("cannot read" in failure for failure in failures)

    def test_payload_mismatch_fails(self, tmp_path):
        diverged = make_payload()
        diverged["lastUpdated"] = "2026-07-10 15:30:00 KST"
        js_path, json_path = write_pair(tmp_path, make_payload(), json_payload=diverged)
        failures, _ = validate_data.validate_pair(js_path, json_path, min_count=3)
        assert any("payloads differ" in failure for failure in failures)

    def test_empty_json_path_skips_json_checks(self, tmp_path):
        js_path, _ = write_pair(tmp_path, make_payload())
        (tmp_path / "data.json").unlink()
        failures, _ = validate_data.validate_pair(js_path, "", min_count=3)
        assert failures == []

    def test_json_side_failures_are_reported(self, tmp_path):
        healthy = make_payload()
        broken = make_payload()
        broken["spacs"] = broken["spacs"][:1]  # min_count 미달
        js_path, json_path = write_pair(tmp_path, healthy, json_payload=broken)
        failures, _ = validate_data.validate_pair(js_path, json_path, min_count=3)
        assert any("spac count 1" in failure for failure in failures)
