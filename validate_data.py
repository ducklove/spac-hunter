#!/usr/bin/env python3
"""Validate the generated data.js / data.json payloads (stdlib only).

Usage: python validate_data.py [--path data.js] [--json-path data.json] [--min-count 10]

Checks per file:
* data.js: the "window.SPAC_DATA = " prefix can be stripped and the rest parses as JSON
* data.json: parses as plain JSON (no prefix)
* len(spacs) >= --min-count
* >= 50% of spacs have currentPrice
* lastUpdated exists
* schemaVersion is absent (legacy payload) or equal to 2

Cross check:
* data.js and data.json carry the identical payload (the dashboard fetches
  data.json; data.js remains as the file:// script-tag fallback)

Pass --json-path "" to skip the data.json checks (legacy layouts).
Prints failures to stderr and exits 1; prints a summary and exits 0 on success.
"""

import argparse
import json
import sys
from pathlib import Path

PREFIX = "window.SPAC_DATA = "
EXPECTED_SCHEMA_VERSION = 2
MIN_PRICE_COVERAGE_PCT = 50.0


def load_payload(path: str):
    """Return (payload, failures). Strips the data.js prefix when present."""
    try:
        text = Path(path).read_text(encoding="utf-8")
    except OSError as exc:
        return None, [f"cannot read {path}: {exc}"]

    if text.startswith(PREFIX):
        text = text[len(PREFIX):]
    text = text.strip()
    if text.endswith(";"):
        text = text[:-1]

    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        return None, [f"{path}: JSON parse failed: {exc}"]
    if not isinstance(payload, dict):
        return None, [f"{path}: payload is not a JSON object"]
    return payload, []


def validate(path: str, min_count: int):
    failures = []
    summary = {}

    payload, load_failures = load_payload(path)
    if load_failures:
        return load_failures, summary

    spacs = payload.get("spacs")
    if not isinstance(spacs, list):
        failures.append(f"{path}: spacs is missing or not a list")
        spacs = []
    summary["spacCount"] = len(spacs)
    if len(spacs) < min_count:
        failures.append(f"{path}: spac count {len(spacs)} < required minimum {min_count}")

    priced = sum(1 for spac in spacs if isinstance(spac, dict) and spac.get("currentPrice"))
    coverage_pct = (priced / len(spacs) * 100) if spacs else 0.0
    summary["currentPriceCoveragePct"] = round(coverage_pct, 2)
    if coverage_pct < MIN_PRICE_COVERAGE_PCT:
        failures.append(
            f"{path}: currentPrice coverage {coverage_pct:.1f}% ({priced}/{len(spacs)}) "
            f"< {MIN_PRICE_COVERAGE_PCT:.0f}%"
        )

    last_updated = payload.get("lastUpdated")
    summary["lastUpdated"] = last_updated
    if not last_updated:
        failures.append(f"{path}: lastUpdated is missing or empty")

    schema_version = payload.get("schemaVersion")
    summary["schemaVersion"] = schema_version
    if schema_version is not None and schema_version != EXPECTED_SCHEMA_VERSION:
        failures.append(
            f"{path}: schemaVersion {schema_version!r} is neither absent nor {EXPECTED_SCHEMA_VERSION}"
        )

    return failures, summary


def validate_pair(js_path: str, json_path: str, min_count: int):
    """Validate data.js (+ data.json and payload equality when json_path is set)."""
    failures, summary = validate(js_path, min_count)
    if not json_path:
        return failures, summary

    json_failures, _ = validate(json_path, min_count)
    failures.extend(json_failures)
    if not failures:
        js_payload, _ = load_payload(js_path)
        json_payload, _ = load_payload(json_path)
        if js_payload != json_payload:
            failures.append(f"{js_path} and {json_path} payloads differ")
    return failures, summary


def main():
    parser = argparse.ArgumentParser(description="Validate the generated data.js/data.json payloads")
    parser.add_argument("--path", default="data.js", help="Path to data.js (default: data.js)")
    parser.add_argument(
        "--json-path",
        default="data.json",
        help="Path to data.json (default: data.json). Pass an empty string to skip.",
    )
    parser.add_argument("--min-count", type=int, default=10, help="Minimum SPAC count (default: 10)")
    args = parser.parse_args()

    failures, summary = validate_pair(args.path, args.json_path, args.min_count)
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)

    checked = args.path if not args.json_path else f"{args.path} + {args.json_path}"
    # NOTE: ASCII만 사용 (Windows cp949 콘솔에서 em-dash가 UnicodeEncodeError를 냈다)
    print(
        f"OK: {checked} - {summary.get('spacCount')} SPACs, "
        f"currentPrice coverage {summary.get('currentPriceCoveragePct')}%, "
        f"lastUpdated {summary.get('lastUpdated')!r}, "
        f"schemaVersion {summary.get('schemaVersion')!r}"
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
