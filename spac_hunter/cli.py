"""Command-line entry point and pipeline orchestration.

Exit codes:
* 0 — success
* 1 — live collection failed (nothing is written)
* 2 — write guard rejected the output (nothing is written; bypass with --force)
"""

import argparse
import logging
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from . import alerts
from .constants import (
    ALERTS_JSON_PATH,
    ALERTS_XML_PATH,
    CURRENT_JSON_PATH,
    DATA_JS_PATH,
    DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE,
    DEFAULT_TRUST_RATE,
    KST,
)
from .domain.enrich import enrich_spac
from .domain.merger import classify_merger_disclosures
from .output import (
    existing_kind_companies,
    load_existing_spacs,
    load_overrides,
    write_outputs,
)
from .parsing import normalize_name, parse_date, today_kst
from .sample import build_sample_data
from .sources import opendart
from .sources.dart import fetch_dart_disclosures
from .sources.kind import fetch_kind_disclosures, fetch_kind_listed_companies
from .sources.kofr import fetch_kofr_rate
from .sources.krx import fetch_krx_spac_universe
from .sources.naver import fetch_histories, fetch_quotes

logger = logging.getLogger(__name__)


def fetch_kind_merger_disclosures(items, kind_companies, max_workers=6, today=None, prefer_dart=False):
    disclosures = {}
    errors = {}
    if not items:
        return disclosures, errors
    today = today or today_kst()
    max_workers = max(1, min(max_workers, 4))

    # OpenDART comes first whenever the API key is set; the corp-code mapping
    # is downloaded once here, outside the per-item loop.
    use_opendart = opendart.is_enabled()
    if use_opendart:
        try:
            corp_map = opendart.load_corp_code_map()
            logger.info("OpenDART 활성: 고유번호 매핑 %d종목", len(corp_map))
        except Exception as exc:  # noqa: BLE001
            use_opendart = False
            logger.warning("OpenDART corpCode 매핑 실패, OpenDART 없이 진행: %s", exc)
    else:
        logger.info("OpenDART 비활성: OPENDART_API_KEY 미설정")

    def fetch_item(item):
        kind_info = kind_companies.get(normalize_name(item["name"]), {})
        listing_date = parse_date(kind_info.get("listingDate"))
        steps = []
        if use_opendart:
            try:
                rows = opendart.fetch_opendart_disclosures(item["code"], item["name"], listing_date, today)
                return rows, None
            except Exception as opendart_exc:  # noqa: BLE001
                steps.append(f"OpenDART 실패: {opendart_exc}")
        if prefer_dart:
            rows = fetch_dart_disclosures(item["code"], item["name"], listing_date, today)
            return rows, "; ".join(steps) or None
        try:
            rows = fetch_kind_disclosures(item["code"], item["name"], listing_date, today)
            return rows, "; ".join(steps) or None
        except Exception as kind_exc:  # noqa: BLE001
            steps.append(f"KIND 실패, DART fallback 사용: {kind_exc}")
            dart_rows = fetch_dart_disclosures(item["code"], item["name"], listing_date, today)
            return dart_rows, "; ".join(steps)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        tasks = {executor.submit(fetch_item, item): item for item in items}
        for future in as_completed(tasks):
            item = tasks[future]
            try:
                rows, warning = future.result()
                disclosures[item["code"]] = rows
                if warning:
                    errors[item["code"]] = warning
            except Exception as exc:  # noqa: BLE001
                errors[item["code"]] = str(exc)
                disclosures[item["code"]] = []
    return disclosures, errors


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Build SPAC dashboard data")
    parser.add_argument("--history-pages", type=int, default=10, help="Naver daily-history pages per SPAC")
    parser.add_argument(
        "--merger-history-pages",
        type=int,
        default=40,
        help="Naver daily-history pages for SPACs with merger disclosures",
    )
    parser.add_argument("--max-workers", type=int, default=8, help="Quote fetch concurrency")
    parser.add_argument("--limit", type=int, default=0, help="Limit SPAC count for quick testing")
    parser.add_argument(
        "--trust-rate",
        type=float,
        default=None,
        help="Manual annual trust yield as a decimal. If omitted, latest KOFR is used.",
    )
    parser.add_argument(
        "--liquidation-haircut",
        "--liquidation-cost",
        dest="liquidation_haircut",
        type=float,
        default=DEFAULT_LIQUIDATION_HAIRCUT_PER_SHARE,
        help=(
            "Manual per-share haircut for stress testing only. Default is 0 because "
            "general operating/merger expenses are not deducted from public escrow."
        ),
    )
    parser.add_argument(
        "--skip-disclosures",
        action="store_true",
        help="Skip KIND merger-disclosure lookup and use overrides only.",
    )
    parser.add_argument(
        "--disclosure-workers",
        type=int,
        default=2,
        help="KIND merger-disclosure fetch concurrency",
    )
    parser.add_argument("--sample", action="store_true", help="Write bundled sample data without network")
    parser.add_argument(
        "--force",
        action="store_true",
        help=(
            "Bypass the data.js write guard (shrink/price-coverage checks, exit code 2). "
            "The guard intentionally applies to --sample as well, to protect real data."
        ),
    )
    return parser


def _build_collection_summary(spacs):
    """Collection summary for sample mode, derived from the built SPAC dicts."""
    return {
        "universe": len(spacs),
        "quotesOk": sum(1 for spac in spacs if (spac.get("quote") or {}).get("price")),
        "quotesFailed": 0,
        "disclosuresOk": sum(1 for spac in spacs if spac.get("mergerDisclosures")),
        "disclosuresFailed": 0,
        "historiesOk": sum(1 for spac in spacs if spac.get("history")),
    }


def _run_sample(args) -> None:
    args.trust_rate = DEFAULT_TRUST_RATE
    args.trust_rate_label = "샘플 0.000%"
    generated_at, spacs, errors = build_sample_data()
    write_outputs(
        generated_at,
        spacs,
        errors,
        trust_rate=args.trust_rate,
        trust_rate_source="샘플 데이터 0.000%",
        collection=_build_collection_summary(spacs),
        force=args.force,
    )
    logger.info("sample data written: %d SPACs", len(spacs))


def _run_live(args) -> None:
    generated_at = datetime.now(KST)
    try:
        errors = {}
        if args.trust_rate is None:
            try:
                rate_info = fetch_kofr_rate()
                args.trust_rate = rate_info["rate"]
                args.trust_rate_label = f"KOFR {rate_info['latestRatePct']:.3f}%"
                trust_rate_source = (
                    f"KOFR 최신 공시금리 {rate_info['latestRatePct']:.3f}%"
                    f"({rate_info.get('publishedDate') or '공시일 미확인'})"
                )
                logger.info("KOFR trust-rate fallback: %.3f%%", rate_info["latestRatePct"])
            except Exception as exc:  # noqa: BLE001
                rate_info = None
                args.trust_rate = DEFAULT_TRUST_RATE
                args.trust_rate_label = f"fallback {args.trust_rate * 100:.3f}%"
                trust_rate_source = "KOFR 조회 실패로 0.000% 보수적 fallback"
                errors["kofr"] = str(exc)
                logger.warning("KOFR collection failed, using 0.000%% fallback: %s", exc)
        else:
            rate_info = None
            args.trust_rate_label = f"수동 {args.trust_rate * 100:.3f}%"
            trust_rate_source = f"수동 입력 {args.trust_rate * 100:.3f}%"

        overrides = load_overrides()
        existing_spacs = load_existing_spacs()
        krx_spacs = fetch_krx_spac_universe(existing_spacs)
        if args.limit > 0:
            krx_spacs = krx_spacs[: args.limit]
        logger.info("KRX SPAC universe: %d", len(krx_spacs))
        try:
            kind_companies = fetch_kind_listed_companies()
            logger.info("KIND listed companies: %d", len(kind_companies))
        except Exception as exc:  # noqa: BLE001
            kind_companies = existing_kind_companies(existing_spacs)
            errors["kindCorpList"] = str(exc)
            logger.warning(
                "KIND listed-company collection failed; using %d existing listing records: %s",
                len(kind_companies),
                exc,
            )

        if args.skip_disclosures:
            merger_disclosures = {}
            disclosure_errors = {}
            logger.info("KIND merger disclosures: skipped")
        else:
            merger_disclosures, disclosure_errors = fetch_kind_merger_disclosures(
                krx_spacs,
                kind_companies,
                max_workers=args.disclosure_workers,
                today=generated_at.date(),
                prefer_dart="kindCorpList" in errors,
            )
            found_disclosures = sum(1 for rows in merger_disclosures.values() if rows)
            logger.info(
                "KIND merger disclosures: %d codes with rows, %d errors",
                found_disclosures,
                len(disclosure_errors),
            )

        codes = [item["code"] for item in krx_spacs]
        quotes, quote_errors = fetch_quotes(codes, args.max_workers)
        logger.info("Naver quotes: %d ok, %d errors", len(quotes), len(quote_errors))
        histories = fetch_histories(codes, args.history_pages, max_workers=max(2, min(args.max_workers, 8)))
        merger_codes = [
            code
            for code, rows in merger_disclosures.items()
            if classify_merger_disclosures(rows).get("matched")
        ]
        if merger_codes and args.merger_history_pages > args.history_pages:
            merger_histories = fetch_histories(
                merger_codes,
                args.merger_history_pages,
                max_workers=max(2, min(args.max_workers, 6)),
            )
            histories.update(merger_histories)
            logger.info(
                "Naver merger histories: %d ok, %d pages",
                sum(1 for h in merger_histories.values() if h),
                args.merger_history_pages,
            )
        logger.info("Naver histories: %d ok", sum(1 for h in histories.values() if h))

        spacs = []
        for item in krx_spacs:
            code = item["code"]
            kind_info = kind_companies.get(normalize_name(item["name"]), {})
            quote = quotes.get(code, {})
            spacs.append(
                enrich_spac(
                    item,
                    kind_info,
                    quote,
                    histories.get(code, []),
                    overrides,
                    args,
                    generated_at.date(),
                    merger_disclosures.get(code, []),
                    existing_spacs.get(code, {}),
                )
            )
        errors["quote"] = quote_errors
        errors["disclosure"] = disclosure_errors
        collection = {
            "universe": len(krx_spacs),
            "quotesOk": len(quotes),
            "quotesFailed": len(quote_errors),
            "disclosuresOk": sum(1 for rows in merger_disclosures.values() if rows),
            "disclosuresFailed": len(disclosure_errors),
            "historiesOk": sum(1 for h in histories.values() if h),
        }
    except Exception as exc:  # noqa: BLE001
        logger.error("live collection failed, nothing written: %s", exc)
        sys.exit(1)

    write_outputs(
        generated_at,
        spacs,
        errors,
        rate_info=rate_info,
        trust_rate=args.trust_rate,
        trust_rate_source=trust_rate_source,
        collection=collection,
        force=args.force,
    )
    logger.info("written %s, %s: %d SPACs", DATA_JS_PATH.name, CURRENT_JSON_PATH.name, len(spacs))

    # Alerts run only after the write guard accepted the new dataset
    # (a guard rejection exits above, so nothing alert-related is produced).
    fresh_alerts = alerts.write_alert_outputs(
        alerts.build_alerts(existing_spacs, spacs, generated_at),
        generated_at,
    )
    logger.info(
        "written %s, %s: %d new alerts", ALERTS_JSON_PATH.name, ALERTS_XML_PATH.name, len(fresh_alerts)
    )
    alerts.send_telegram(fresh_alerts)


def main(argv=None) -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    args = build_arg_parser().parse_args(argv)

    if args.sample:
        _run_sample(args)
        return

    _run_live(args)
