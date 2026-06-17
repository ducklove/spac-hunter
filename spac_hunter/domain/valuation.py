"""Valuation helpers: trust value, returns, badges, and sponsor derivation."""

import re
from datetime import timedelta


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


def _trust_end_date(start_date, liquidation_date, today):
    if liquidation_date:
        return liquidation_date
    if start_date:
        elapsed = max(0, min((today - start_date).days, 365 * 3))
        return start_date + timedelta(days=elapsed)
    return today


def estimate_trust_value_from_periods(ipo_price, start_date, liquidation_date, rate_periods, today):
    """Compound the public escrow value through dated annual-rate periods.

    ``rate_periods`` are start-date inclusive. The last known rate continues
    through the liquidation date, matching the disclosure-based estimate shown
    in the UI.
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
    end = _trust_end_date(start, liquidation_date, today)
    if not start or not end:
        return None
    if end <= start:
        return float(ipo_price)

    boundaries = [start]
    for period in periods:
        period_start = period["startDate"]
        if start < period_start < end:
            boundaries.append(period_start)
    boundaries.append(end)

    value = float(ipo_price)
    active_rate = None
    idx = 0
    for segment_start, segment_end in zip(boundaries, boundaries[1:]):
        while idx < len(periods) and periods[idx]["startDate"] <= segment_start:
            active_rate = periods[idx]["rate"]
            idx += 1
        if active_rate is None:
            active_rate = periods[0]["rate"]
        days = max(0, (segment_end - segment_start).days)
        value *= (1 + active_rate) ** (days / 365)
    return value


def pct_change(base, value):
    if base is None or value is None or base <= 0:
        return None
    return round((value / base - 1) * 100, 2)
