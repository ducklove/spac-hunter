"""Per-SPAC enrichment: combine universe, KIND, quote, history, and overrides.

``enrich_spac`` keeps the exact dict output of the legacy implementation and is
internally decomposed into four builders:

* ``_build_price_metrics``       — 가격지표 (current price, ratio, premium, shares)
* ``_build_liquidation_metrics`` — 청산가치 (trust/liquidation value, returns)
* ``_build_merger_state``        — 합병상태 (disclosure classification + overrides)
* ``_build_events``              — 이벤트 (listing/merger/liquidation timeline)
"""

from datetime import timedelta

from ..constants import (
    DEFAULT_INTEREST_TAX_PCT,
    DEFAULT_IPO_PRICE,
    DEFAULT_PAYOUT_LAG_DAYS,
    DEFAULT_TRUST_FEE_PCT,
    DELISTING_LAG_DAYS,
    MERGER_DEADLINE_MONTHS,
    NO_MERGER_DELISTING_MONTHS,
    TRUST_ROLLOVER_MONTHS,
)
from ..filings import OFFERING_SHARES_MIN, is_valid_escrow_rate_pct, is_valid_ipo_price
from ..output import merge_history_points
from ..parsing import add_months, parse_date, parse_float, parse_int
from .escrow import (
    change_start,
    current_contract,
    first_term_start,
    gross_reported,
    implied_fee_pct,
    implied_trust_fee,
    rate_changes,
)
from .escrow import payment_date as escrow_payment_date
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


def _normalize_escrow_rate_periods(filing, payment_date, listing_date, end_date, interest_tax_pct):
    """Return display periods and calculator periods from filing disclosures."""
    if not filing:
        return [], []
    raw = []

    filing_rate_pct = parse_float(filing.get("escrowRatePct"))
    initial_start = payment_date or listing_date or parse_date(filing.get("filingDate"))
    initial = None
    if is_valid_escrow_rate_pct(filing_rate_pct) and initial_start:
        initial = {
            "startDate": initial_start,
            "ratePct": filing_rate_pct,
            "source": _source_label_from_report(filing.get("reportName")),
            "receiptNo": filing.get("receiptNo"),
            "reportName": filing.get("reportName"),
            "filingDate": filing.get("filingDate"),
            "url": filing.get("url"),
        }
    # 첫 재예치 공시의 '변경 전' 이율이 실제 최초 예치이율이다. 신고서 본문 추출값보다 우선한다
    # (예: 신고서 3.0% 추출 vs 실제 3.75% 예치). 단, 같은 공시의 예치금액과 맞지 않으면(역산 보수가
    # 범위 밖) 이율 추출 오류로 보고 쓰지 않는다(SK증권13호 정정공시: 변경 전 2.42% vs 금액상 약 3.3%).
    changes = rate_changes(filing)
    earliest = changes[0] if changes else None
    rate_before_pct = parse_float((earliest or {}).get("rateBeforePct"))
    earliest_start = change_start(earliest) if earliest else None
    consistent = True
    if earliest and payment_date and earliest_start and payment_date < earliest_start:
        has_amounts = earliest.get("amountBefore") and earliest.get("amountAfter")
        consistent = not has_amounts or implied_fee_pct(
            earliest, first_term_start(payment_date, earliest_start), interest_tax_pct
        ) is not None
    if (
        is_valid_escrow_rate_pct(rate_before_pct)
        and consistent
        and initial_start
        and earliest_start
        and initial_start < earliest_start
        and (initial is None or abs(initial["ratePct"] - rate_before_pct) >= 0.005)
    ):
        initial = {
            "startDate": initial_start,
            "ratePct": rate_before_pct,
            "source": "신탁계약내용변경(변경 전 이율)",
            "receiptNo": earliest.get("receiptNo"),
            "reportName": earliest.get("reportName"),
            "filingDate": earliest.get("filingDate"),
            "url": earliest.get("url"),
        }
    if initial:
        raw.append(initial)

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
        period_end = next_start - timedelta(days=1) if next_start else end_date
        display_periods.append(
            {
                "startDate": period["startDate"].isoformat(),
                "endDate": period_end.isoformat() if period_end else None,
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


def _public_share_count(filing, ipo_price):
    shares = parse_int(filing.get("offeringShares"))
    if shares and shares >= OFFERING_SHARES_MIN:
        return shares
    escrow_amount = parse_int(filing.get("escrowAmount"))
    if escrow_amount and ipo_price and escrow_amount % ipo_price == 0:
        return escrow_amount // ipo_price
    return None


def _escrow_balance_anchor(filing, ipo_price, today):
    """Latest disclosed escrow balance (principal + after-tax interest) per public share.

    신탁계약내용변경 공시의 '변경 후 예치금액'은 실제 보수·세금이 반영된 원리금이라, 이후
    이자만 추정하면 과거 구간의 이율 추출 오차·세금 처리 차이가 누적되지 않는다.
    """
    if not filing or not ipo_price or gross_reported(filing):
        return None
    shares = _public_share_count(filing, ipo_price)
    if not shares:
        return None
    changes = rate_changes(filing)
    first_before = parse_int(changes[0].get("amountBefore")) if changes else None
    # 최초 예치금이 공모금액과 크게 다르면 주식수 추출을 믿을 수 없다.
    if first_before and not 0.95 <= first_before / (shares * ipo_price) <= 1.3:
        return None
    anchor = None
    for change in changes:
        amount_after = parse_int(change.get("amountAfter"))
        start = change_start(change)
        if not amount_after or not start or start > today:
            continue
        per_share = amount_after / shares
        if not ipo_price * 0.95 <= per_share <= ipo_price * 1.5:
            continue
        if anchor is None or start >= anchor["date"]:
            anchor = {
                "date": start,
                "value": per_share,
                "amount": amount_after,
                "shares": shares,
                "receiptNo": change.get("receiptNo"),
                "reportName": change.get("reportName"),
                "url": change.get("url"),
            }
    return anchor


def _pct_setting(override, key, args, arg_name, default):
    value = parse_float(override.get(key))
    if value is None:
        value = getattr(args, arg_name, None)
    if value is None:
        value = default
    return max(0.0, float(value))


def _resolve_trust_fee(override, args, filing, sponsor, trust_fee_hints, interest_tax_pct):
    """신탁보수: overrides > 이 스팩의 공시 예치금 역산 > 같은 증권사 스팩 역산 > 기본 가정.

    첫 예치 계약만으로 역산한 값은 시작일 며칠 오차로 0.05%p 흔들리므로, 같은 증권사 값과
    0.05%p 안이면 증권사 값을 쓴다(유안타17호: 첫 계약 0.13 -> 유안타 0.1).
    """
    value = parse_float(override.get("trustFeePct"))
    if value is not None:
        return max(0.0, value), "overrides.json"
    implied = implied_trust_fee(filing, interest_tax_pct) if filing else None
    hint = (trust_fee_hints or {}).get(sponsor) if sponsor else None
    hint_source = f"같은 증권사 스팩 역산({sponsor} {hint['count']}종목)" if hint else None
    if implied:
        own_source = f"공시 예치금 역산({implied['observations']}건)"
        gap = abs(implied["pct"] - hint["pct"]) if hint else None
        if not implied["exact"] and gap is not None and 1e-9 < gap <= 0.05 + 1e-9:
            return hint["pct"], f"{hint_source[:-1]}, 첫 계약 역산 {implied['pct']:g}%p 보정)"
        return implied["pct"], own_source
    if hint:
        return hint["pct"], hint_source
    default = getattr(args, "trust_fee_pct", None)
    return max(0.0, DEFAULT_TRUST_FEE_PCT if default is None else float(default)), "기본 가정"


def _build_liquidation_metrics(
    override,
    args,
    ipo_price,
    listing_date,
    payment_date,
    payout_date,
    days_to_payout,
    current_price,
    today,
    filing=None,
    sponsor=None,
    trust_fee_hints=None,
):
    """청산가치: 청산금 수령 예정일 기준 1주당 분배금과 기대수익률."""
    override_trust_value = parse_float(override.get("trustValuePerShare"))
    override_liquidation_value = parse_float(override.get("liquidationValuePerShare"))
    interest_tax_pct = _pct_setting(
        override, "interestTaxPct", args, "interest_tax_pct", DEFAULT_INTEREST_TAX_PCT
    )
    trust_fee_pct, trust_fee_source = _resolve_trust_fee(
        override, args, filing, sponsor, trust_fee_hints, interest_tax_pct
    )
    escrow_rate_periods, calculator_periods = _normalize_escrow_rate_periods(
        filing, payment_date, listing_date, payout_date, interest_tax_pct
    )
    trust_start = (
        payment_date
        or listing_date
        or (calculator_periods[0]["startDate"] if calculator_periods else None)
    )
    anchor = _escrow_balance_anchor(filing, ipo_price, today) if calculator_periods else None
    estimated_trust_value = estimate_trust_value_from_periods(
        ipo_price,
        trust_start,
        payout_date,
        calculator_periods,
        today,
        trust_fee_rate=trust_fee_pct / 100,
        interest_tax_rate=interest_tax_pct / 100,
        anchor=anchor,
    )
    liquidation_value_source = None
    valuation_basis = None
    if estimated_trust_value:
        base = f"공시 예치금({anchor['date'].isoformat()})" if anchor else "공모예치금"
        liquidation_value_source = (
            f"{base}+예상 이자(공시 예치이율, 신탁보수 {trust_fee_pct:g}%p·"
            f"원천징수 {interest_tax_pct:g}% 차감, 수령 예정일까지)"
        )
        valuation_basis = {
            "trustStartDate": trust_start.isoformat() if trust_start else None,
            "trustFeePct": trust_fee_pct,
            "trustFeeSource": trust_fee_source,
            "interestTaxPct": interest_tax_pct,
            "rolloverMonths": TRUST_ROLLOVER_MONTHS,
            # 세전 표기 스팩은 공시 잔액 대신 이율 구간으로 계산했다는 표시.
            "escrowAmountsGross": bool(filing and gross_reported(filing)),
            "anchor": (
                {
                    "date": anchor["date"].isoformat(),
                    "valuePerShare": round(anchor["value"], 4),
                    "amount": anchor["amount"],
                    "shares": anchor["shares"],
                    "receiptNo": anchor["receiptNo"],
                    "reportName": anchor["reportName"],
                    "url": anchor["url"],
                }
                if anchor
                else None
            ),
        }
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
    # 분배금은 청산기한이 아니라 잔여재산 분배일에 들어오므로 그날까지의 보유일수로 연환산한다.
    annualized_return = calculate_annualized_return(liquidation_value, current_price, days_to_payout)
    return {
        "trustValue": trust_value,
        "liquidationValue": liquidation_value,
        "liquidationValueSource": liquidation_value_source,
        "expectedReturn": expected_return,
        "annualizedReturn": annualized_return,
        "escrowRatePeriods": escrow_rate_periods,
        # 수동 보정값에는 추정 근거(보수·세금·기준 예치금)를 붙이지 않는다.
        "valuationBasis": (
            valuation_basis if not override_liquidation_value and not override_trust_value else None
        ),
    }


def _escrow_contract(filing, payout_date, today):
    """현재 예치 계약과 만기 전 해지(중도해지이율) 위험.

    신탁계약 특약상 예금 만기 전에 인출하면 예금일부터 전체 기간에 은행 게시 중도해지이율이 적용된다
    (교보14·NH25·BNK1·신영10호 투자설명서). 만기가 청산금 수령 예정일보다 늦으면 실제 분배금이
    추정치보다 적을 수 있어 표시만 한다(추정치는 계약 이율 그대로).
    """
    contract = current_contract(filing, today) if filing else None
    if not contract:
        return None
    days_after_payout = (contract["maturityDate"] - payout_date).days if payout_date else None
    risk = None
    # 만기가 이미 지났으면 다음 재예치 조건을 모르므로 판정하지 않는다.
    if days_after_payout is not None and days_after_payout > 0 and contract["maturityDate"] > today:
        risk = "confirmed" if contract["maturityDisclosed"] else "possible"
    return {
        **contract,
        "startDate": contract["startDate"].isoformat(),
        "maturityDate": contract["maturityDate"].isoformat(),
        "daysAfterPayout": days_after_payout,
        "earlyTerminationRisk": risk,
    }


def _estimate_payout(override, args, payment_date, listing_date, liquidation_date, merger):
    """예상 상장폐지(해산)일과 잔여재산 분배(청산금 수령)일.

    합병 신청이 없으면 납입+31개월(관리종목 30개월 + 1개월)에 상장폐지 사유가 생기고, 합병이
    진행 중이면 합병등기 기한(납입+36개월)에 생긴다. 철회됐다면 철회 1개월 뒤보다 이르지 않다
    (교보15호: 2026-07-31 철회 -> 09-02 사유 발생). 이후 상장폐지까지 13일, 분배까지 102일.
    """
    payout_lag_days = getattr(args, "payout_lag_days", None)
    payout_lag_days = DEFAULT_PAYOUT_LAG_DAYS if payout_lag_days is None else max(0, int(payout_lag_days))
    override_payout = parse_date(override.get("payoutDate"))
    if override_payout:
        return None, override_payout, "overrides.json"

    dissolution_date = parse_date(str((merger.get("dissolution") or {}).get("date") or "")[:10])
    if dissolution_date:
        delisting = dissolution_date
        source = f"해산사유 발생({delisting.isoformat()}) 후 분배 {payout_lag_days}일 추정"
    elif override.get("liquidationDate") and liquidation_date:
        delisting = liquidation_date
        source = f"overrides.json 청산일 후 분배 {payout_lag_days}일 추정"
    else:
        base = payment_date or listing_date
        if not base:
            return None, None, None
        deadline = add_months(base, MERGER_DEADLINE_MONTHS)
        if merger.get("status") in ("합병 신청", "합병 확정"):
            trigger = deadline
            reason = "합병 진행 중: 합병기한(납입+36개월)"
        else:
            trigger = add_months(base, NO_MERGER_DELISTING_MONTHS)
            reason = "합병 미신청: 납입+30개월 관리종목·1개월 뒤"
            cancel_date = parse_date(str((merger.get("cancellation") or {}).get("date") or "")[:10])
            if cancel_date and add_months(cancel_date, 1) > trigger:
                trigger = add_months(cancel_date, 1)
                reason = "합병 철회 1개월 뒤"
            trigger = min(trigger, deadline)
        delisting = trigger + timedelta(days=DELISTING_LAG_DAYS)
        source = (
            f"{reason} 상장폐지 사유({trigger.isoformat()}) → 상장폐지 {DELISTING_LAG_DAYS}일·"
            f"분배 {payout_lag_days}일 추정"
        )
    return delisting, delisting + timedelta(days=payout_lag_days), source


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
    trust_fee_hints=None,
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
    # 상장폐지(해산) 뒤 채권신고·청산재산 보고 절차를 거쳐 잔여재산이 분배된다.
    merger = _build_merger_state(disclosures, override)
    merger_status = merger["status"]
    payment_date = escrow_payment_date(filing)
    sponsor = override.get("sponsor") or derive_sponsor(item["name"])
    delisting_date, payout_date, payout_date_source = _estimate_payout(
        override, args, payment_date, listing_date, liquidation_date, merger
    )
    days_to_payout = (payout_date - today).days if payout_date else None

    price = _build_price_metrics(quote, ipo_price)
    current_price = price["currentPrice"]
    ratio = price["ratio"]
    premium_pct = price["premiumPct"]

    valuation = _build_liquidation_metrics(
        override,
        args,
        ipo_price,
        listing_date,
        payment_date,
        payout_date,
        days_to_payout,
        current_price,
        today,
        filing=filing,
        sponsor=sponsor,
        trust_fee_hints=trust_fee_hints,
    )

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
        "sponsor": sponsor,
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
        "expectedDelistingDate": delisting_date.isoformat() if delisting_date else None,
        "payoutDate": payout_date.isoformat() if payout_date else None,
        "payoutDateSource": payout_date_source if payout_date else None,
        "daysToPayout": days_to_payout,
        "trustValuePerShare": round(trust_value, 2) if trust_value else None,
        "liquidationValuePerShare": round(liquidation_value, 2) if liquidation_value else None,
        "liquidationValueSource": valuation["liquidationValueSource"] if liquidation_value else None,
        "expectedReturn": round(expected_return * 100, 2) if expected_return is not None else None,
        "annualizedReturn": round(annualized_return * 100, 2) if annualized_return is not None else None,
        "escrowRatePeriods": escrow_rate_periods,
        "valuationBasis": valuation["valuationBasis"],
        "escrowContract": _escrow_contract(filing, payout_date, today),
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
