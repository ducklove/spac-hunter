"""Summary/statistics builders for the dashboard payload."""

import math

from .constants import DEFAULT_IPO_PRICE
from .domain.valuation import pct_change
from .parsing import mean, median, month_key, month_range, parse_date


def build_summary(spacs, generated_at):
    active = [spac for spac in spacs if spac.get("currentPrice")]
    below_ipo = [spac for spac in active if spac.get("ratio") is not None and spac["ratio"] < 1]
    near_ipo = [spac for spac in active if spac.get("ratio") is not None and spac["ratio"] <= 1.01]
    due_soon = [
        spac
        for spac in active
        if spac.get("daysToLiquidation") is not None and spac["daysToLiquidation"] <= 180
    ]
    due_within_one_year = [
        spac
        for spac in active
        if spac.get("daysToLiquidation") is not None and spac["daysToLiquidation"] <= 365
    ]
    merger = [spac for spac in active if spac.get("mergerStatus")]
    merger_applied = [spac for spac in merger if spac.get("mergerStatus") == "합병 신청"]
    merger_confirmed = [spac for spac in merger if spac.get("mergerStatus") == "합병 확정"]
    merger_event_count = sum(len(spac.get("mergerPriceRecords") or []) for spac in active)
    recent = [
        spac
        for spac in active
        if spac.get("listingDate")
        and (generated_at.date() - parse_date(spac["listingDate"])).days <= 120
    ]
    ratios = [spac["ratio"] for spac in active if spac.get("ratio") is not None]
    annualized = [
        spac["annualizedReturn"]
        for spac in active
        if spac.get("annualizedReturn") is not None and not math.isnan(spac["annualizedReturn"])
    ]
    cheapest = min(active, key=lambda item: item.get("ratio") or 99, default=None)
    best_yield = max(active, key=lambda item: item.get("annualizedReturn") or -999, default=None)

    return {
        "totalCount": len(active),
        "belowIpoCount": len(below_ipo),
        "nearIpoCount": len(near_ipo),
        "dueSoonCount": len(due_soon),
        "dueWithinOneYearCount": len(due_within_one_year),
        "mergerCount": len(merger),
        "mergerAppliedCount": len(merger_applied),
        "mergerConfirmedCount": len(merger_confirmed),
        "mergerEventCount": merger_event_count,
        "recentListingCount": len(recent),
        "averageRatio": round(sum(ratios) / len(ratios), 4) if ratios else None,
        "averageAnnualizedReturn": round(sum(annualized) / len(annualized), 2) if annualized else None,
        "cheapest": {
            "code": cheapest["code"],
            "name": cheapest["name"],
            "ratio": cheapest.get("ratio"),
            "currentPrice": cheapest.get("currentPrice"),
        }
        if cheapest
        else None,
        "bestYield": {
            "code": best_yield["code"],
            "name": best_yield["name"],
            "annualizedReturn": best_yield.get("annualizedReturn"),
            "currentPrice": best_yield.get("currentPrice"),
        }
        if best_yield
        else None,
    }


def build_merger_cases(spacs, limit=80):
    cases = []
    for spac in spacs:
        for record in spac.get("mergerPriceRecords") or []:
            cases.append(
                {
                    **record,
                    "code": spac.get("code"),
                    "name": spac.get("name"),
                    "status": spac.get("mergerStatus") or "과거 공시",
                    "currentPrice": spac.get("currentPrice"),
                    "currentRatio": spac.get("ratio"),
                }
            )
    cases.sort(key=lambda record: record.get("date") or "", reverse=True)
    return cases[:limit]


def build_below_ipo_trend(spacs, min_coverage_ratio=0.7):
    active_total = sum(1 for spac in spacs if spac.get("currentPrice"))
    min_coverage = max(5, int(active_total * min_coverage_ratio))
    by_date = {}
    for spac in spacs:
        for point in spac.get("history") or []:
            ratio_value = point.get("ratio")
            date_value = point.get("date")
            if date_value is None or ratio_value is None:
                continue
            bucket = by_date.setdefault(date_value, [])
            bucket.append(float(ratio_value))

    trend = []
    for date_value in sorted(by_date):
        ratios = by_date[date_value]
        if len(ratios) < min_coverage:
            continue
        below = [value for value in ratios if value < 1]
        near = [value for value in ratios if value <= 1.01]
        trend.append(
            {
                "date": date_value,
                "totalCount": len(ratios),
                "belowCount": len(below),
                "nearCount": len(near),
                "belowPct": round(len(below) / len(ratios) * 100, 2),
                "averageRatio": round(sum(ratios) / len(ratios), 4),
            }
        )
    return trend[-180:]


def build_listing_trend(spacs, generated_at, months=18):
    keys = month_range(generated_at.date(), months)
    counts = {key: 0 for key in keys}
    for spac in spacs:
        key = month_key(spac.get("listingDate"))
        if key in counts:
            counts[key] += 1
    return [{"month": key, "count": counts[key]} for key in keys]


def build_merger_trend(spacs, generated_at, months=18):
    keys = month_range(generated_at.date(), months)
    rows = {
        key: {"month": key, "applied": 0, "confirmed": 0, "canceled": 0, "total": 0}
        for key in keys
    }
    signal_field = {"applied": "applied", "confirmed": "confirmed", "canceled": "canceled"}
    for spac in spacs:
        for record in spac.get("mergerPriceRecords") or []:
            key = month_key(record.get("date"))
            signal = signal_field.get(record.get("signal"))
            if key not in rows or not signal:
                continue
            rows[key][signal] += 1
            rows[key]["total"] += 1
    return [rows[key] for key in keys]


def build_merger_episodes(spacs):
    episodes = []
    for spac in spacs:
        open_episode = None
        records = sorted(spac.get("mergerPriceRecords") or [], key=lambda item: item.get("date") or "")
        for record in records:
            event_date = parse_date(record.get("date"))
            if not event_date:
                continue
            signal = record.get("signal")
            if signal == "applied":
                if open_episode is None:
                    open_episode = {
                        "code": spac.get("code"),
                        "name": spac.get("name"),
                        "appliedDate": event_date,
                        "appliedPrice": record.get("basePrice"),
                        "appliedPremiumPct": pct_change(
                            spac.get("ipoPrice") or DEFAULT_IPO_PRICE, record.get("basePrice")
                        ),
                        "status": "pending",
                    }
                continue
            if signal == "confirmed":
                if open_episode is None:
                    open_episode = {
                        "code": spac.get("code"),
                        "name": spac.get("name"),
                        "appliedDate": None,
                        "appliedPrice": None,
                        "status": "pending",
                    }
                open_episode.update(
                    {
                        "status": "success",
                        "confirmedDate": event_date,
                        "confirmedPrice": record.get("basePrice"),
                        "daysToConfirmation": (
                            (event_date - open_episode["appliedDate"]).days
                            if open_episode.get("appliedDate")
                            else None
                        ),
                    }
                )
                episodes.append(open_episode)
                open_episode = None
                continue
            if signal == "canceled" and open_episode is not None:
                open_episode.update(
                    {
                        "status": "failed",
                        "canceledDate": event_date,
                        "canceledPrice": record.get("basePrice"),
                        "daysToCancel": (
                            (event_date - open_episode["appliedDate"]).days
                            if open_episode.get("appliedDate")
                            else None
                        ),
                    }
                )
                episodes.append(open_episode)
                open_episode = None
        if open_episode is not None:
            episodes.append(open_episode)
    return episodes


def build_sponsor_stats(spacs, episodes, limit=20, archived_spacs=None):
    """Aggregate merger episodes by SPAC sponsor (None -> "미확인").

    ``archived_spacs`` only extends the code->sponsor mapping so archived
    episodes land in the right group; ``spacCount`` stays "active SPACs only".
    """
    spac_counts = {}
    sponsor_by_code = {}
    for spac in archived_spacs or []:
        sponsor_by_code[spac.get("code")] = spac.get("sponsor") or "미확인"
    for spac in spacs:
        sponsor = spac.get("sponsor") or "미확인"
        sponsor_by_code[spac.get("code")] = sponsor
        spac_counts[sponsor] = spac_counts.get(sponsor, 0) + 1

    grouped = {}
    for episode in episodes:
        sponsor = sponsor_by_code.get(episode.get("code")) or "미확인"
        grouped.setdefault(sponsor, []).append(episode)

    stats = []
    for sponsor, rows in grouped.items():
        successes = [episode for episode in rows if episode.get("status") == "success"]
        failures = [episode for episode in rows if episode.get("status") == "failed"]
        pending = [episode for episode in rows if episode.get("status") == "pending"]
        completed = len(successes) + len(failures)
        stats.append(
            {
                "sponsor": sponsor,
                "spacCount": spac_counts.get(sponsor, 0),
                "episodeCount": len(rows),
                "successCount": len(successes),
                "failureCount": len(failures),
                "pendingCount": len(pending),
                "successRatePct": (
                    round(len(successes) / completed * 100, 2) if completed else None
                ),
                "avgDaysToConfirmation": mean(
                    [episode.get("daysToConfirmation") for episode in successes]
                ),
            }
        )
    stats.sort(key=lambda row: (-row["episodeCount"], -row["spacCount"], row["sponsor"]))
    return stats[:limit]


def build_archive_overview(archive, limit=12):
    """Compact archive.json summary for statistics.archive (count + recent entries)."""
    archive = list(archive or [])
    archive.sort(key=lambda entry: str(entry.get("archivedAt") or ""), reverse=True)
    return {
        "count": len(archive),
        "recent": [
            {
                "code": entry.get("code"),
                "name": entry.get("name"),
                "sponsor": entry.get("sponsor"),
                "mergerStatus": entry.get("mergerStatus"),
                "lastSeen": entry.get("lastSeen"),
                "finalRatio": entry.get("finalRatio"),
                "delistReasonGuess": entry.get("delistReasonGuess"),
            }
            for entry in archive[:limit]
        ],
    }


def build_statistics(spacs, generated_at, archive=None):
    archive = list(archive or [])
    active = [spac for spac in spacs if spac.get("currentPrice")]
    below_trend = build_below_ipo_trend(active)
    listing_trend = build_listing_trend(active, generated_at)
    merger_trend = build_merger_trend(active, generated_at)
    merger_cases = build_merger_cases(active, limit=500)
    # Archived SPACs feed the funnel through their preserved mergerPriceRecords,
    # with the exact same episode logic. Deliberately conservative: an episode
    # whose last signal is "applied" stays pending even when delistReasonGuess
    # says "합병 신상장 추정" — never promoted to success.
    episodes = build_merger_episodes(active) + build_merger_episodes(archive)
    successes = [episode for episode in episodes if episode.get("status") == "success"]
    failures = [episode for episode in episodes if episode.get("status") == "failed"]
    pending = [episode for episode in episodes if episode.get("status") == "pending"]
    completed = successes + failures
    success_rate = len(successes) / len(completed) * 100 if completed else None

    applications = [case for case in merger_cases if case.get("signal") == "applied"]
    confirmations = [case for case in merger_cases if case.get("signal") == "confirmed"]
    cancellations = [case for case in merger_cases if case.get("signal") == "canceled"]

    def avg_price(rows):
        return mean([row.get("basePrice") for row in rows])

    def avg_return(rows, key):
        return mean([row.get(key) for row in rows])

    listing_dates = [parse_date(spac.get("listingDate")) for spac in active]
    listing_dates = [value for value in listing_dates if value]
    today = generated_at.date()

    return {
        "note": (
            "현재 상장 스팩과 archive.json에 기록된 상폐 스팩의 합병 공시 이벤트 기준입니다. "
            "아카이브 도입 이전에 상폐된 과거 사례는 포함되지 않습니다."
        ),
        "belowIpoTrend": below_trend,
        "listingTrend": listing_trend,
        "mergerTrend": merger_trend,
        "newListing": {
            "last30Count": sum(1 for value in listing_dates if (today - value).days <= 30),
            "last90Count": sum(1 for value in listing_dates if (today - value).days <= 90),
            "last365Count": sum(1 for value in listing_dates if (today - value).days <= 365),
        },
        "mergerFunnel": {
            "episodeCount": len(episodes),
            "archivedSpacCount": len(archive),
            "successCount": len(successes),
            "failureCount": len(failures),
            "pendingCount": len(pending),
            "completedCount": len(completed),
            "successRatePct": round(success_rate, 2) if success_rate is not None else None,
            "avgDaysToConfirmation": mean([episode.get("daysToConfirmation") for episode in successes]),
            "medianDaysToConfirmation": median(
                [episode.get("daysToConfirmation") for episode in successes]
            ),
            "avgDaysToCancel": mean([episode.get("daysToCancel") for episode in failures]),
        },
        "archive": build_archive_overview(archive),
        "mergerPriceStats": {
            "applicationAvgPrice": avg_price(applications),
            "confirmationAvgPrice": avg_price(confirmations),
            "cancellationAvgPrice": avg_price(cancellations),
            "applicationAvgNextReturnPct": avg_return(applications, "nextReturnPct"),
            "confirmationAvgNextReturnPct": avg_return(confirmations, "nextReturnPct"),
            "cancellationAvgNextReturnPct": avg_return(cancellations, "nextReturnPct"),
            "applicationAvgHighReturnPct": avg_return(applications, "highReturnPct"),
            "confirmationAvgHighReturnPct": avg_return(confirmations, "highReturnPct"),
            "cancellationAvgLowReturnPct": avg_return(cancellations, "lowReturnPct"),
        },
        "sponsorStats": build_sponsor_stats(active, episodes, archived_spacs=archive),
    }
