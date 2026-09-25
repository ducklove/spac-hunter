"""Valuation helpers: trust value, returns, badges, and sponsor derivation."""

import re
from datetime import timedelta

from ..constants import TRUST_ROLLOVER_MONTHS
from ..parsing import add_months


def derive_sponsor(name):
    patterns = [
        r"^(.*?)제?\d+호스팩$",
        r"^(.*?)스팩\d+호$",
        r"^(.*?)스팩$",
    ]
    for pattern in patterns:
        match = re.match(pattern, name)
        if match:
            sponsor = match.group(1).strip()
            return sponsor or None
    return None


def build_status_badges(ratio, days_to_liquidation, trade_stop=False, merger_status=None, dissolution=False):
    badges = []
    if ratio is not None and ratio < 1:
        badges.append("공모가 이하")
    elif ratio is not None and ratio <= 1.01:
        badges.append("공모가 근접")
    if merger_status:
        badges.append(merger_status)
    if dissolution:
        badges.append("해산사유 발생")
    if days_to_liquidation is not None:
        if days_to_liquidation <= 180:
            badges.append("청산 6개월 이내")
        elif days_to_liquidation <= 365:
            badges.append("청산 1년 이내")
    if trade_stop:
        badges.append("거래정지")
    if not badges:
        badges.append("일반")
    return badges


def calculate_annualized_return(target_value, current_price, days):
    if not target_value or not current_price or current_price <= 0 or not days or days <= 0:
        return None
    ratio = target_value / current_price
    if ratio <= 0:
        return None
    try:
        return (ratio ** (365 / days)) - 1
    except (OverflowError, ValueError):
        return None


def estimate_trust_value_per_share(ipo_price, listing_date, liquidation_date, trust_rate, today):
    if not ipo_price:
        return None
    if listing_date and liquidation_date:
        trust_days = max(0, (liquidation_date - listing_date).days)
    elif listing_date:
        trust_days = max(0, min((today - listing_date).days, 365 * 3))
    else:
        trust_days = 0
    return ipo_price * ((1 + trust_rate) ** (trust_days / 365))


def _trust_end_date(start_date, end_date, today):
    if end_date:
        return end_date
    if start_date:
        elapsed = max(0, min((today - start_date).days, 365 * 3))
        return start_date + timedelta(days=elapsed)
    return today


def net_annual_rate(rate, trust_fee_rate=0.0, interest_tax_rate=0.0):
    """Annual escrow yield left for shareholders after the trust fee and interest withholding."""
    return max(0.0, rate - trust_fee_rate) * (1 - interest_tax_rate)


def _accrue_deposit_terms(value, start, end, net_rate, rollover_months):
    """Simple interest inside each deposit term; interest joins principal when the term rolls over."""
    term_start = start
    while term_start < end:
        term_end = min(add_months(term_start, rollover_months), end)
        value *= 1 + net_rate * (term_end - term_start).days / 365
        term_start = term_end
    return value


def estimate_trust_value_from_periods(
    ipo_price,
    start_date,
    end_date,
    rate_periods,
    today,
    *,
    trust_fee_rate=0.0,
    interest_tax_rate=0.0,
    rollover_months=TRUST_ROLLOVER_MONTHS,
    anchor=None,
):
    """Project the public escrow value per share through dated annual-rate periods.

    ``rate_periods`` are start-date inclusive; every period start is a re-deposit
    (신탁계약내용변경) where accrued interest joins principal, and longer spans roll
    over every ``rollover_months``. Interest is simple within a term and reduced by
    the trust fee and withholding tax, matching the escrow amounts disclosed at
    each re-deposit. The last known rate continues through ``end_date`` (the
    expected payout date). ``anchor`` ({"date", "value"}) restarts the projection
    from a disclosed per-share escrow balance instead of the IPO price.
    """
    if not ipo_price:
        return None
    periods = [
        {"startDate": period.get("startDate"), "rate": period.get("rate")}
        for period in rate_periods or []
        if period.get("startDate") and period.get("rate") is not None
    ]
    periods.sort(key=lambda period: period["startDate"])
    if not periods:
        return None

    start = start_date or periods[0]["startDate"]
    end = _trust_end_date(start, end_date, today)
    if not start or not end:
        return None
    value = float(ipo_price)
    if anchor and anchor.get("date") and anchor.get("value") and start <= anchor["date"] <= end:
        start = anchor["date"]
        value = float(anchor["value"])
    if end <= start:
        return value

    boundaries = [start]
    for period in periods:
        period_start = period["startDate"]
        if start < period_start < end:
            boundaries.append(period_start)
    boundaries.append(end)

    active_rate = None
    idx = 0
    for segment_start, segment_end in zip(boundaries, boundaries[1:]):
        while idx < len(periods) and periods[idx]["startDate"] <= segment_start:
            active_rate = periods[idx]["rate"]
            idx += 1
        if active_rate is None:
            active_rate = periods[0]["rate"]
        net_rate = net_annual_rate(active_rate, trust_fee_rate, interest_tax_rate)
        value = _accrue_deposit_terms(value, segment_start, segment_end, net_rate, rollover_months)
    return value


def pct_change(base, value):
    if base is None or value is None or base <= 0:
        return None
    return round((value / base - 1) * 100, 2)
