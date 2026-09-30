"""Hub summary.json/version.json (Value Compass envelope v1) and the valuation it carries."""

import json
from datetime import date, datetime
from pathlib import Path

import pytest

from spac_hunter import publish, vc_publish
from spac_hunter.constants import KST
from spac_hunter.domain.valuation import liquidation_discount_pct, liquidation_value_at_date
from spac_hunter.output import write_outputs

ROOT = Path(__file__).resolve().parent.parent
GENERATED_AT = datetime(2026, 9, 28, 18, 30, 0, tzinfo=KST)

# value-invest config/schemas/summary/spac-hunter.schema.json 의 required 목록(허브가 폴백 없이 쓰는 키).
REQUIRED_DATA = {"lastUpdated", "summary", "valuationAssumptions", "spacs"}
REQUIRED_SUMMARY = {"totalCount", "belowIpoCount", "averageAnnualizedReturn"}
REQUIRED_SPAC = {
    "code", "name", "currentPrice", "ipoPrice", "ratio", "annualizedReturn", "listingDate",
    "liquidationDate", "payoutDate", "liquidationValuePerShare", "escrowRatePeriods", "valuationBasis",
}
REQUIRED_BASIS = {"trustStartDate", "trustFeePct", "interestTaxPct", "rolloverMonths", "anchor"}

# 재예치 공시 잔액(anchor)과 이율 변경이 있는 스팩. 기대값은 assets/valuation.js
# liquidationValueAtDate로 계산했다(파이썬 이식과 허브 services/portfolio/spac.py가 같아야 한다).
ESCROW_ITEM = {
    "ipoPrice": 2000,
    "listingDate": "2024-03-20",
    "escrowRatePeriods": [
        {"startDate": "2024-03-14", "ratePct": 3.8, "source": "증권신고서"},
        {"startDate": "2025-03-17", "ratePct": 2.93, "source": "신탁계약내용변경"},
    ],
    "valuationBasis": {
        "trustStartDate": "2024-03-14",
        "trustFeePct": 0.1,
        "trustFeeSource": "역산",
        "interestTaxPct": 15.4,
        "rolloverMonths": 12,
        "escrowAmountsGross": False,
        "anchor": {"date": "2025-03-17", "valuePerShare": 2061.5},
    },
}


class TestLiquidationValueAtDate:
    @pytest.mark.parametrize(
        ("day", "expected"),
        [
            ("2024-03-14", 2000),
            ("2024-09-14", 2031.5592767123287),
            ("2025-03-17", 2061.5),
            ("2025-06-30", 2075.6983073246574),
            ("2026-09-28", 2137.8556099380744),
        ],
    )
    def test_matches_valuation_js(self, day, expected):
        value = liquidation_value_at_date(ESCROW_ITEM, date.fromisoformat(day))
        assert value == pytest.approx(expected, abs=1e-9)

    def test_before_trust_start_is_unknown(self):
        assert liquidation_value_at_date(ESCROW_ITEM, date(2024, 1, 1)) is None

    def test_assumptions_fill_missing_basis(self):
        item = {"ipoPrice": 2000, "listingDate": "2026-01-10", "escrowRatePeriods": [
            {"startDate": "2026-01-05", "ratePct": 3}]}
        day = date(2026, 9, 28)
        no_fee = {"trustFeePct": 0, "interestTaxPct": 15.4}
        assert liquidation_value_at_date(item, day, no_fee) == pytest.approx(2036.992219178082)
        assert liquidation_value_at_date(item, day) == pytest.approx(2035.7591452054794)  # 기본 보수 0.1%p

    def test_no_rate_history_is_unknown(self):
        item = {"ipoPrice": 2000, "listingDate": "2026-01-10", "escrowRatePeriods": []}
        assert liquidation_value_at_date(item, date(2026, 9, 28)) is None

    def test_discount(self):
        assert liquidation_discount_pct(2050, 2000) == pytest.approx(2.4390243902439024)
        assert liquidation_discount_pct(None, 2000) is None
        assert liquidation_discount_pct(2050, 0) is None


def _payload(spac_factory, **overrides):
    spac = spac_factory(
        code="0041j0",
        name="엘에스스팩1호",
        price=1950,
        liquidationDate="2027-03-20",
        payoutDate="2026-12-01",
        liquidationValuePerShare=2150.5,
        annualizedReturn=6.02,
        status="공모가 이하",
        history=[{"date": "2026-09-25", "close": 1945}, {"date": "2026-09-28", "close": 1950}],
        **{key: value for key, value in ESCROW_ITEM.items() if key != "ipoPrice"},  # listingDate 포함
    )
    other = spac_factory(code="100002", name="다라스팩2호", price=2100,
                         history=[{"date": "2026-09-26", "close": 2100}])
    payload = {
        "lastUpdated": "2026-09-28 18:30:00 KST",
        "generatedAt": GENERATED_AT.isoformat(),
        "valuationAssumptions": {"trustFeePct": 0.1, "interestTaxPct": 15.4, "payoutLagDays": 102},
        "summary": {"totalCount": 2, "belowIpoCount": 1, "averageRatio": 1.0125,
                    "averageAnnualizedReturn": 4.4, "cheapest": {"code": "0041J0"}},
        "spacs": [spac, other],
    }
    payload.update(overrides)
    return payload


class TestBuildSummary:
    def test_as_of_is_the_latest_close_date_not_the_run_time(self, spac_factory):
        assert publish.summary_as_of(_payload(spac_factory)) == date(2026, 9, 28)
        no_history = _payload(spac_factory)
        for spac in no_history["spacs"]:
            spac["history"] = []
        assert publish.summary_as_of(no_history) == date(2026, 9, 28)  # generatedAt의 날짜

    def test_data_has_every_field_the_hub_reads(self, spac_factory):
        data = publish.build_summary_data(_payload(spac_factory), date(2026, 9, 28))

        assert REQUIRED_DATA <= set(data)
        assert REQUIRED_SUMMARY <= set(data["summary"])
        assert "cheapest" not in data["summary"]
        assumptions = {"trustFeePct": 0.1, "interestTaxPct": 15.4, "payoutLagDays": 102}
        assert data["valuationAssumptions"] == assumptions
        assert data["valuationDate"] == "2026-09-28"
        first = data["spacs"][0]
        assert REQUIRED_SPAC <= set(first)
        assert REQUIRED_BASIS <= set(first["valuationBasis"])
        assert first["code"] == "0041J0"
        assert first["escrowRatePeriods"] == [
            {"startDate": "2024-03-14", "ratePct": 3.8},
            {"startDate": "2025-03-17", "ratePct": 2.93},
        ]
        assert first["valuationBasis"]["anchor"] == {"date": "2025-03-17", "valuePerShare": 2061.5}
        assert "history" not in first and "filing" not in first and "quote" not in first

    def test_publishes_the_liquidation_metrics_the_hub_computes(self, spac_factory):
        data = publish.build_summary_data(_payload(spac_factory), date(2026, 9, 28))
        first = data["spacs"][0]
        value = liquidation_value_at_date(ESCROW_ITEM, date(2026, 9, 28))

        assert first["currentLiquidationValue"] == round(value, 2) == 2137.86
        assert first["liquidationDiscountPct"] == round((value - 1950) / value * 100, 2)
        # 이율 이력이 없으면 모르는 값은 0이 아니라 null
        assert data["spacs"][1]["currentLiquidationValue"] is None
        assert data["spacs"][1]["liquidationDiscountPct"] is None

    def test_envelope_validates(self, spac_factory):
        envelope = publish.build_summary_envelope(_payload(spac_factory), generated_at=GENERATED_AT)

        assert vc_publish.validate_envelope(envelope) is envelope
        assert envelope["tool"] == "spac-hunter"
        assert envelope["asOf"] == "2026-09-28"
        assert envelope["generatedAt"] == "2026-09-28T18:30:00+09:00"
        assert {source["id"] for source in envelope["sources"]} >= {"krx", "naver"}

    def test_non_finite_numbers_become_null(self, spac_factory):
        payload = _payload(spac_factory)
        payload["spacs"][1]["ratio"] = float("nan")
        payload["summary"]["averageRatio"] = float("inf")
        envelope = publish.build_summary_envelope(payload, generated_at=GENERATED_AT)

        assert envelope["data"]["spacs"][1]["ratio"] is None
        assert envelope["data"]["summary"]["averageRatio"] is None


class TestPublishSummary:
    def test_writes_then_skips_unchanged_reruns(self, tmp_path, spac_factory):
        summary = tmp_path / "summary.json"
        version = tmp_path / "version.json"
        payload = _payload(spac_factory)

        assert publish.publish_summary(payload, summary, generated_at=GENERATED_AT) is True
        first_summary, first_version = summary.read_bytes(), version.read_bytes()
        assert first_summary.endswith(b"\n") and first_summary.count(b"\n") == 1  # compact 한 줄
        content_hash = json.loads(first_summary)["contentHash"]
        assert json.loads(first_version)["files"] == {"summary.json": content_hash}

        # 같은 데이터를 다음 실행에서 다시 수집: 수집 시각(lastUpdated/generatedAt)만 다르다.
        rerun = _payload(spac_factory, lastUpdated="2026-09-29 18:30:00 KST")
        later = datetime(2026, 9, 29, 18, 30, 0, tzinfo=KST)
        assert publish.publish_summary(rerun, summary, generated_at=later) is False
        assert summary.read_bytes() == first_summary
        assert version.read_bytes() == first_version

    def test_rewrites_when_prices_change(self, tmp_path, spac_factory):
        summary = tmp_path / "summary.json"
        publish.publish_summary(_payload(spac_factory), summary, generated_at=GENERATED_AT)
        old_hash = json.loads(summary.read_text(encoding="utf-8"))["contentHash"]

        moved = _payload(spac_factory, lastUpdated="2026-09-29 18:30:00 KST")
        moved["spacs"][0]["currentPrice"] = 1960
        assert publish.publish_summary(moved, summary, generated_at=GENERATED_AT) is True

        envelope = json.loads(summary.read_text(encoding="utf-8"))
        assert envelope["contentHash"] != old_hash
        assert envelope["data"]["lastUpdated"] == "2026-09-29 18:30:00 KST"
        version = json.loads((tmp_path / "version.json").read_text(encoding="utf-8"))
        assert version["files"]["summary.json"] == envelope["contentHash"]

    def test_bad_payload_keeps_previous_file(self, tmp_path, spac_factory):
        summary = tmp_path / "summary.json"
        publish.publish_summary(_payload(spac_factory), summary, generated_at=GENERATED_AT)
        before = summary.read_bytes()

        assert publish.publish_summary({"spacs": []}, summary, generated_at=GENERATED_AT) is False
        assert summary.read_bytes() == before

    def test_write_outputs_publishes_next_to_data_js(self, tmp_path, spac_factory):
        spacs = [spac_factory(code="100001", name="가나스팩1호", price=2100)]
        write_outputs(
            GENERATED_AT,
            spacs,
            errors={},
            trust_rate=0.0,
            data_js_path=tmp_path / "data.js",
            current_json_path=tmp_path / "current.json",
            valuation_assumptions={"trustFeePct": 0.1, "interestTaxPct": 15.4, "payoutLagDays": 102},
        )

        envelope = vc_publish.validate_envelope(json.loads((tmp_path / "summary.json").read_text("utf-8")))
        assert envelope["asOf"] == "2026-09-28"
        assert [spac["code"] for spac in envelope["data"]["spacs"]] == ["100001"]
        assert (tmp_path / "version.json").exists()


def test_committed_summary_is_a_valid_envelope():
    """저장소 루트의 summary.json은 Pages 루트로 배포된다(허브: <url>/summary.json)."""
    envelope = vc_publish.validate_envelope(json.loads((ROOT / "summary.json").read_text(encoding="utf-8")))
    assert envelope["tool"] == "spac-hunter"
    assert REQUIRED_DATA <= set(envelope["data"])
    assert len((ROOT / "summary.json").read_bytes()) < 64 * 1024  # 계약 크기 예산
    version = json.loads((ROOT / "version.json").read_text(encoding="utf-8"))
    assert version["tool"] == "spac-hunter"
    assert version["files"]["summary.json"] == envelope["contentHash"]
