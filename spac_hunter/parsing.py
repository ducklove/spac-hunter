"""Small parsing and numeric helpers shared across the pipeline."""

import math
import re
from datetime import date, datetime

import pandas as pd

from .constants import KST


def today_kst() -> date:
    return datetime.now(KST).date()


def parse_int(value):
    if value is None:
        return None
    if isinstance(value, (int, float)) and not pd.isna(value):
        return int(value)
    text = str(value).strip().replace(",", "")
    if not text or text == "-":
        return None
    match = re.search(r"-?\d+", text)
    return int(match.group(0)) if match else None


def parse_float(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return None if pd.isna(value) else float(value)
    text = str(value).strip().replace(",", "").replace("%", "")
    if not text or text == "-":
        return None
    try:
        result = float(text)
    except ValueError:
        return None
    return None if math.isnan(result) else result


def parse_date(value):
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    for fmt in ("%Y-%m-%d", "%Y.%m.%d", "%Y%m%d"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            pass
    return None


def add_months(value: date, months: int) -> date:
    month = value.month - 1 + months
    year = value.year + month // 12
    month = month % 12 + 1
    days_in_month = [
        31,
        29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month - 1]
    return date(year, month, min(value.day, days_in_month))


def normalize_name(value):
    return re.sub(r"\s+", "", str(value or "")).upper()


def normalize_disclosure_title(value):
    return re.sub(r"\s+", "", str(value or ""))


def mean(values):
    values = [value for value in values if value is not None and not math.isnan(value)]
    return round(sum(values) / len(values), 2) if values else None


def median(values):
    values = sorted(value for value in values if value is not None and not math.isnan(value))
    if not values:
        return None
    mid = len(values) // 2
    if len(values) % 2:
        return round(values[mid], 2)
    return round((values[mid - 1] + values[mid]) / 2, 2)


def month_key(value):
    parsed = parse_date(str(value or "")[:10])
    return parsed.strftime("%Y-%m") if parsed else None


def month_range(end_date, months):
    months = max(1, months)
    first = date(end_date.year, end_date.month, 1)
    start = add_months(first, -(months - 1))
    return [add_months(start, idx).strftime("%Y-%m") for idx in range(months)]
