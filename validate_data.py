#!/usr/bin/env python3
"""Validate the generated data.js payload (stdlib only).

Usage: python validate_data.py [--path data.js] [--min-count 10]

Checks:
* the "window.SPAC_DATA = " prefix can be stripped and the rest parses as JSON
* len(spacs) >= --min-count
* >= 50% of spacs have currentPrice
* lastUpdated exists
* schemaVersion is absent (legacy payload) or equal to 2

Prints failures to stderr and exits 1; prints a summary and exits 0 on success.
"""

import argparse
import json
import sys
from pathlib import Path

PREFIX = "window.SPAC_DATA = "
EXPECTED_SCHEMA_VERSION = 2
MIN_PRICE_COVERAGE_PCT = 50.0


def validate(path: str, min_count: int):
    failures = []
    summary = {}

    try:
        text = Path(path).read_text(encoding="utf-8")
    except OSError as exc:
        return [f"cannot read {path}: {exc}"], summary

    if text.startswith(PREFIX):
        text = text[len(PREFIX):]
    text = text.strip()
    if text.endswith(";"):
        text = text[:-1]

    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        return [f"JSON parse failed: {exc}"], summary
    if not isinstance(payload, dict):
        return ["payload is not a JSON object"], summary

    spacs = payload.get("spacs")
    if not isinstance(spacs, list):
        failures.append("spacs is missing or not a list")
        spacs = []
    summary["spacCount"] = len(spacs)
    if len(spacs) < min_count:
        failures.append(f"spac count {len(spacs)} < required minimum {min_count}")

    priced = sum(1 for spac in spacs if isinstance(spac, dict) and spac.get("currentPrice"))
    coverage_pct = (priced / len(spacs) * 100) if spacs else 0.0
    summary["currentPriceCoveragePct"] = round(coverage_pct, 2)
    if coverage_pct < MIN_PRICE_COVERAGE_PCT:
        failures.append(
            f"currentPrice coverage {coverage_pct:.1f}% ({priced}/{len(spacs)}) "
            f"< {MIN_PRICE_COVERAGE_PCT:.0f}%"
        )

    last_updated = payload.get("lastUpdated")
    summary["lastUpdated"] = last_updated
    if not last_updated:
        failures.append("lastUpdated is missing or empty")

    schema_version = payload.get("schemaVersion")
    summary["schemaVersion"] = schema_version
    if schema_version is not None and schema_version != EXPECTED_SCHEMA_VERSION:
        failures.append(
            f"schemaVersion {schema_version!r} is neither absent nor {EXPECTED_SCHEMA_VERSION}"
        )

    return failures, summary


def main():
    parser = argparse.ArgumentParser(description="Validate the generated data.js payload")
    parser.add_argument("--path", default="data.js", help="Path to data.js (default: data.js)")
    parser.add_argument("--min-count", type=int, default=10, help="Minimum SPAC count (default: 10)")
    args = parser.parse_args()

    failures, summary = validate(args.path, args.min_count)
    if failures:
        for failure in failures:
            print(f"FAIL: {failure}", file=sys.stderr)
        sys.exit(1)

    print(
        f"OK: {args.path} — {summary.get('spacCount')} SPACs, "
        f"currentPrice coverage {summary.get('currentPriceCoveragePct')}%, "
        f"lastUpdated {summary.get('lastUpdated')!r}, "
        f"schemaVersion {summary.get('schemaVersion')!r}"
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
