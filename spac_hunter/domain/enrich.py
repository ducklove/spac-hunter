"""Per-SPAC enrichment: combine universe, KIND, quote, history, and overrides.

``enrich_spac`` keeps the exact dict output of the legacy implementation and is
internally decomposed into four builders:

* ``_build_price_metrics``       — 가격지표 (current price, ratio, premium, shares)
* ``_build_liquidation_metrics`` — 청산가치 (trust/liquidation value, returns)
* ``_build_merger_state``        — 합병상태 (disclosure classification + overrides)
* ``_build_events``              — 이벤트 (listing/merger/liquidation timeline)
"""

from datetime import timedelta

from ..constants import DEFAULT_IPO_PRICE
from ..filings import is_valid_escrow_rate_pct, is_valid_ipo_price
from ..output import merge_history_points
from ..parsing import add_months, parse_date, parse_float, parse_int
from .merger import (
    build_merger_price_records,
    classify_merger_disclosures,
    merge_merger_price_records,
    normalize_merger_status,
)
from .valuation import (
    build_status_badges,
    calculate_annualized_return,
    derive_sponsor,
    estimate_trust_value_from_periods,
)


def _build_price_metrics(quote, ipo_price):
    """가격지표: current price, IPO ratio/premium, and estimated share count."""
    current_price = quote.get("price")
    ratio = current_price / ipo_price if current_price and ipo_price else None
    premium_pct = (ratio - 1) * 100 if ratio is not None else None
    estimated_shares = (
        int(quote["marketCap"] / current_price)
        if quote.get("marketCap") and current_price
        else None
    )
    return {
        "currentPrice": current_price,
        "ratio": ratio,
        "premiumPct": premium_pct,
        "estimatedShares": estimated_shares,
    }


def _source_label_from_report(report_name):
    report_name = str(report_name or "").strip()
    if "신탁계약" in report_name and "변경" in report_name:
        return "신탁계약내용변경"
    if "투자설명서" in report_name or "증권신고서" in report_name:
        return "증권신고서"
    return report_name or "공시"


def _normalize_escrow_rate_periods(filing, listing_date, liquidation_date):
    """Return display periods and calculator periods from filing disclosures."""
    if not filing:
        return [], []
    raw = []

    filing_rate_pct = parse_float(filing.get("escrowRatePct"))
    initial_start = (
        parse_date(filing.get("paymentDate"))
        or listing_date
        or parse_date(filing.get("filingDate"))
    )
    if is_valid_escrow_rate_pct(filing_rate_pct) and initial_start:
        raw.append(
            {
                "startDate": initial_start,
                "ratePct": filing_rate_pct,
                "source": _source_label_from_report(filing.get("reportName")),
                "receiptNo": filing.get("receiptNo"),
                "reportName": filing.get("reportName"),
                "filingDate": filing.get("filingDate"),
                "url": filing.get("url"),
            }
        )

    for change in filing.get("escrowRateChanges") or []:
        if not isinstance(change, dict):
            continue
        rate_pct = parse_float(change.get("ratePct") or change.get("escrowRatePct"))
        start_date = parse_date(change.get("startDate") or change.get("filingDate"))
        if not is_valid_escrow_rate_pct(rate_pct) or not start_date:
            continue
        raw.append(
            {
                "startDate": start_date,
                "ratePct": rate_pct,
                "source": _source_label_from_report(change.get("reportName")),
                "receiptNo": change.get("receiptNo"),
                "reportName": change.get("reportName"),
                "filingDate": change.get("filingDate"),
                "url": change.get("url"),
            }
        )

    latest_by_key = {}
    for period in raw:
        key = period["startDate"]
        previous = latest_by_key.get(key)
        if previous is None or str(period.get("receiptNo") or "") >= str(previous.get("receiptNo") or ""):
            latest_by_key[key] = period
    raw = sorted(
        latest_by_key.values(),
        key=lambda period: (period["startDate"], period.get("receiptNo") or ""),
    )
    if not raw:
        return [], []

    display_periods = []
    for idx, period in enumerate(raw):
        next_start = raw[idx + 1]["startDate"] if idx + 1 < len(raw) else None
        end_date = next_start - timedelta(days=1) if next_start else liquidation_date
        display_periods.append(
            {
                "startDate": period["startDate"].isoformat(),
                "endDate": end_date.isoformat() if end_date else None,
                "ratePct": round(period["ratePct"], 4),
                "source": period.get("source"),
                "receiptNo": period.get("receiptNo"),
                "reportName": period.get("reportName"),
                "filingDate": period.get("filingDate"),
                "url": period.get("url"),
            }
        )
    calculator_periods = [
        {"startDate": period["startDate"], "rate": period["ratePct"] / 100}
        for period in raw
    ]
    return display_periods, calculator_periods


def _build_liquidation_metrics(
    override,
    args,
    ipo_price,
    listing_date,
    liquidation_date,
    days_to_liquidation,
    current_price,
    today,
    filing=None,
):
    """청산가치: trust/liquidation value per share and expected returns."""
    override_trust_value = parse_float(override.get("trustValuePerShare"))
    override_liquidation_value = parse_float(override.get("liquidationValuePerShare"))
    escrow_rate_periods, calculator_periods = _normalize_escrow_rate_periods(
        filing, listing_date, liquidation_date
    )
    trust_start = (
        parse_date((filing or {}).get("paymentDate"))
        or listing_date
        or (calculator_periods[0]["startDate"] if calculator_periods else None)
    )
    estimated_trust_value = estimate_trust_value_from_periods(
        ipo_price, trust_start, liquidation_date, calculator_periods, today
    )
    liquidation_value_source = (
        "공모예치금+예상 예치이자(공시 예치이율 기간별 적용)"
        if estimated_trust_value
        else None
    )
    trust_value = override_trust_value or estimated_trust_value
    if override_liquidation_value:
        liquidation_value = override_liquidation_value
        liquidation_value_source = "overrides.json 청산분배금"
    else:
        liquidation_value = trust_value
        if override_trust_value:
            liquidation_value_source = "overrides.json 예치금"
        if args.liquidation_haircut:
            liquidation_value = liquidation_value - args.liquidation_haircut if liquidation_value else None
            if liquidation_value_source:
                liquidation_value_source += f" - 수동 조정 {args.liquidation_haircut:g}"
    expected_return = (
        liquidation_value / current_price - 1
        if current_price and current_price > 0 and liquidation_value
        else None
    )
    annualized_return = calculate_annualized_return(
        liquidation_value, current_price, days_to_liquidation
    )
    return {
        "trustValue": trust_value,
        "liquidationValue": liquidation_value,
        "liquidationValueSource": liquidation_value_source,
        "expectedReturn": expected_return,
        "annualizedReturn": annualized_return,
        "escrowRatePeriods": escrow_rate_periods,
    }


def _build_merger_state(disclosures, override):
    """합병상태: classify disclosures and apply manual overrides."""
    merger_state = classify_merger_disclosures(disclosures or [])
    merger_status = merger_state["status"]
    application_disclosure = merger_state["application"]
    confirmation_disclosure = merger_state["confirmation"]
    cancellation_disclosure = merger_state["cancellation"]

    manual_application_date = override.get("mergerApplicationDisclosureDate") or override.get(
        "mergerDisclosureDate"
    )
    manual_confirmation_date = override.get("mergerConfirmationDisclosureDate")
    if manual_application_date:
        application_disclosure = {
            "date": manual_application_date,
            "title": str(
                override.get("mergerApplicationDisclosureTitle")
                or override.get("merger")
                or "합병 대상 공시"
            ),
            "source": "overrides.json",
        }
        if not merger_status:
            merger_status = "합병 신청"
    if manual_confirmation_date:
        confirmation_disclosure = {
            "date": manual_confirmation_date,
            "title": str(override.get("mergerConfirmationDisclosureTitle") or "합병 확정 공시"),
            "source": "overrides.json",
        }
        merger_status = "합병 확정"

    override_merger_status = normalize_merger_status(override.get("mergerStatus"))
    legacy_merger_status = normalize_merger_status(override.get("merger"))
    if override_merger_status:
        merger_status = override_merger_status
    elif legacy_merger_status and not merger_status:
        merger_status = legacy_merger_status
    elif override.get("merger") and not merger_status:
        merger_status = "합병 신청"

    return {
        "status": merger_status,
        "application": application_disclosure,
        "confirmation": confirmation_disclosure,
        "cancellation": cancellation_disclosure,
        "dissolution": merger_state.get("dissolution"),
        "matched": merger_state["matched"],
    }


def _build_events(listing_date, liquidation_date, liquidation_date_source, merger):
    """이벤트: listing / merger application / confirmation / cancel / liquidation."""
    events = []
    if listing_date:
        events.append(
            {
                "date": listing_date.isoformat(),
                "type": "listing",
                "label": "상장",
                "detail": f"KIND 상장일 {listing_date.isoformat()}",
            }
        )
    if merger["application"]:
        events.append(
            {
                "date": merger["application"].get("date"),
                "type": "merger_application",
                "label": "합병 신청",
                "detail": merger["application"].get("title") or "합병 대상 공시",
                "source": merger["application"].get("source"),
                "url": merger["application"].get("url"),
            }
        )
    if merger["confirmation"]:
        events.append(
            {
                "date": merger["confirmation"].get("date"),
                "type": "merger_confirmation",
                "label": "합병 확정",
                "detail": merger["confirmation"].get("title") or "합병 확정 공시",
                "source": merger["confirmation"].get("source"),
                "url": merger["confirmation"].get("url"),
            }
        )
    if merger["cancellation"]:
        events.append(
            {
                "date": merger["cancellation"].get("date"),
                "type": "merger_canceled",
                "label": "합병 철회",
                "detail": merger["cancellation"].get("title") or "합병 철회/취소 공시",
                "source": merger["cancellation"].get("source"),
                "url": merger["cancellation"].get("url"),
            }
        )
    if merger.get("dissolution"):
        events.append(
            {
                "date": merger["dissolution"].get("date"),
                "type": "dissolution",
                "label": "해산사유 발생",
                "detail": merger["dissolution"].get("title") or "해산사유 발생 공시",
                "source": merger["dissolution"].get("source"),
                "url": merger["dissolution"].get("url"),
            }
        )
    if liquidation_date:
        events.append(
            {
                "date": liquidation_date.isoformat(),
                "type": "liquidation",
                "label": "청산기한",
                "detail": liquidation_date_source,
            }
        )
    return sorted(events, key=lambda event: event.get("date") or "")


def enrich_spac(
    item,
    kind_info,
    quote,
    history,
    overrides,
    args,
    today,
    disclosures=None,
    existing=None,
    filing=None,
):
    code = item["code"]
    existing = existing or {}
    override = overrides.get(code, {})
    # 공모가 우선순위: overrides > 증권신고서(검증 통과 값) > 기본 2,000원.
    override_ipo_price = parse_int(override.get("ipoPrice"))
    filing_ipo_price = parse_int((filing or {}).get("ipoPrice"))
    if not is_valid_ipo_price(filing_ipo_price):
        filing_ipo_price = None
    ipo_price = override_ipo_price or filing_ipo_price or DEFAULT_IPO_PRICE
    ipo_price_source = None
    if not override_ipo_price and filing_ipo_price:
        ipo_price_source = f"증권신고서({(filing or {}).get('receiptNo') or '접수번호 미상'})"
    listing_date = parse_date(override.get("listingDate") or kind_info.get("listingDate"))
    liquidation_date = parse_date(override.get("liquidationDate"))
    liquidation_date_source = "overrides.json"
    if liquidation_date is None and listing_date:
        liquidation_date = add_months(listing_date, 36)
        liquidation_date_source = "상장일+36개월 추정"

    days_to_liquidation = (
        (liquidation_date - today).days if liquidation_date else None
    )

    price = _build_price_metrics(quote, ipo_price)
    current_price = price["currentPrice"]
    ratio = price["ratio"]
    premium_pct = price["premiumPct"]

    valuation = _build_liquidation_metrics(
        override,
        args,
        ipo_price,
        listing_date,
        liquidation_date,
        days_to_liquidation,
        current_price,
        today,
        filing=filing,
    )

    merger = _build_merger_state(disclosures, override)
    merger_status = merger["status"]

    history_points = []
    for point in merge_history_points(existing.get("history") or [], history, today=today):
        close = point.get("close")
        point_ratio = close / ipo_price if close and ipo_price else None
        history_points.append(
            {
                "date": point.get("date"),
                "close": close,
                "ratio": round(point_ratio, 4) if point_ratio is not None else None,
                "volume": point.get("volume"),
            }
        )
    merger_price_records = merge_merger_price_records(
        existing.get("mergerPriceRecords") or [],
        build_merger_price_records(merger["matched"], history_points),
    )

    badges = build_status_badges(
        ratio,
        days_to_liquidation,
        quote.get("tradeStop"),
        merger_status,
        dissolution=bool(merger.get("dissolution")),
    )

    events = _build_events(listing_date, liquidation_date, liquidation_date_source, merger)

    trust_value = valuation["trustValue"]
    liquidation_value = valuation["liquidationValue"]
    expected_return = valuation["expectedReturn"]
    annualized_return = valuation["annualizedReturn"]
    escrow_rate_periods = valuation["escrowRatePeriods"]

    spac = {
        "id": code,
        "code": code,
        "name": item["name"],
        "market": item.get("market"),
        "isin": item.get("isin"),
        "sponsor": override.get("sponsor") or derive_sponsor(item["name"]),
        "ipoPrice": ipo_price,
        "currentPrice": current_price,
        "change": quote.get("change"),
        "changePct": quote.get("changePct"),
        "ratio": round(ratio, 4) if ratio is not None else None,
        "premiumPct": round(premium_pct, 2) if premium_pct is not None else None,
        "volume": quote.get("volume"),
        "tradingValue": quote.get("tradingValue"),
        "marketCap": quote.get("marketCap"),
        "estimatedShares": price["estimatedShares"],
        "listingDate": listing_date.isoformat() if listing_date else None,
        "liquidationDate": liquidation_date.isoformat() if liquidation_date else None,
        "liquidationDateSource": liquidation_date_source if liquidation_date else None,
        "daysToLiquidation": days_to_liquidation,
        "trustValuePerShare": round(trust_value, 2) if trust_value else None,
        "liquidationValuePerShare": round(liquidation_value, 2) if liquidation_value else None,
        "liquidationValueSource": valuation["liquidationValueSource"] if liquidation_value else None,
        "expectedReturn": round(expected_return * 100, 2) if expected_return is not None else None,
        "annualizedReturn": round(annualized_return * 100, 2) if annualized_return is not None else None,
        "escrowRatePeriods": escrow_rate_periods,
        "status": badges[0],
        "badges": badges,
        "mergerStatus": merger_status,
        "mergerApplicationDisclosure": merger["application"],
        "mergerConfirmationDisclosure": merger["confirmation"],
        "mergerCancellationDisclosure": merger["cancellation"],
        "mergerDisclosures": merger["matched"],
        "mergerPriceRecords": merger_price_records,
        "kind": kind_info,
        "quote": quote,
        "history": history_points,
        "events": events,
        "disclosureUrl": f"https://dart.fss.or.kr/dsab007/main.do?option=corp&textCrpNm={item['name']}",
        "naverUrl": f"https://finance.naver.com/item/main.naver?code={code}",
    }
    if merger.get("dissolution"):
        # Key is omitted entirely when absent so the existing output stays byte-identical.
        spac["dissolutionDisclosure"] = merger["dissolution"]
    # 신고서 키들도 동일하게, 없으면 키 자체를 생략해 기존 출력을 보호한다.
    if filing:
        spac["filing"] = filing
    if ipo_price_source:
        spac["ipoPriceSource"] = ipo_price_source
    return spac
