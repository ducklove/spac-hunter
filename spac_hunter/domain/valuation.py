"""Valuation helpers: trust value, returns, badges, and sponsor derivation."""

import re


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


def pct_change(base, value):
    if base is None or value is None or base <= 0:
        return None
    return round((value / base - 1) * 100, 2)
