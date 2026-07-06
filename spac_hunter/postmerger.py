"""합병 신상장 후 주가 추적: 아카이브 항목의 ``postMerger`` 블록을 관리.

존속합병이면 스팩 종목코드가 합병법인으로 그대로 이어지므로 자동 추적하고,
소멸합병으로 새 코드가 부여된 경우 overrides.json의 ``postMergerCode``로
매핑한다. 추적 결과는 archive.json 항목에 누적되고 data.js의
``statistics.postMergerFlow``로 요약된다.
"""

import logging

from .archive import DELIST_REASON_MERGER
from .domain.valuation import pct_change
from .output import merge_history_points
from .parsing import parse_date, parse_int

logger = logging.getLogger(__name__)

# 자동(동일 코드) 추적은 아카이브 후 이 기간까지만 시세를 갱신한다.
# overrides.json postMergerCode 매핑은 기간 제한 없이 추적한다.
AUTO_TRACK_WINDOW_DAYS = 365

SOURCE_OVERRIDE = "overrides.json postMergerCode"
SOURCE_SAME_CODE = "동일 종목코드(존속합병 추정)"

STATUS_TRACKING = "tracking"
STATUS_HALTED = "halted"
STATUS_UNAVAILABLE = "unavailable"
STATUS_ENDED = "ended"


def resolve_tracking_target(entry, override):
    """추적할 (종목코드, 매핑 출처)를 돌려준다. 대상이 아니면 (None, None).

    overrides의 ``postMergerCode``는 소멸합병(새 코드 재상장)까지 포함해
    자동 추정보다 항상 우선한다.
    """
    code = str((override or {}).get("postMergerCode") or "").strip()
    if code:
        return code, SOURCE_OVERRIDE
    if entry.get("delistReasonGuess") == DELIST_REASON_MERGER and entry.get("code"):
        return entry["code"], SOURCE_SAME_CODE
    return None, None


def derive_ipo_price(entry):
    """아카이브 항목의 공모가. 구버전 항목은 finalPrice/finalRatio로 역산한다."""
    ipo_price = parse_int(entry.get("ipoPrice"))
    if ipo_price:
        return ipo_price
    final_price = parse_int(entry.get("finalPrice"))
    try:
        final_ratio = float(entry.get("finalRatio"))
    except (TypeError, ValueError):
        return None
    if not final_price or final_ratio <= 0:
        return None
    return int(round(final_price / final_ratio))


def _history_cutoff(entry):
    """합병 전 스팩 시절 시세를 제외하는 컷오프(archivedAt 날짜)."""
    return str(entry.get("archivedAt") or "")[:10] or None


def build_post_merger_block(entry, tracked_code, source, quote, fetched_history, today):
    """단일 아카이브 항목의 postMerger 블록 갱신본을 만든다(원본 불변).

    시세 조회가 실패해도(quote=None) 이미 쌓인 가격/히스토리는 유지한 채
    status만 ``unavailable``로 표시해 데이터 소실을 막는다.
    """
    previous = entry.get("postMerger") if isinstance(entry.get("postMerger"), dict) else {}
    history = merge_history_points(previous.get("history") or [], fetched_history or [], today=today)
    cutoff = _history_cutoff(entry)
    if cutoff:
        history = [point for point in history if str(point.get("date")) >= cutoff]

    quote_price = parse_int((quote or {}).get("price"))
    last_close = history[-1]["close"] if history else None
    price = quote_price or last_close or previous.get("price")

    if quote is None:
        status = STATUS_UNAVAILABLE
    elif quote.get("tradeStop"):
        status = STATUS_HALTED
    elif quote_price:
        status = STATUS_TRACKING
    else:
        status = STATUS_UNAVAILABLE

    closes = [(point["close"], point["date"]) for point in history if point.get("close")]
    high = max(closes, default=None)
    low = min(closes, default=None)
    final_price = parse_int(entry.get("finalPrice"))
    ipo_price = derive_ipo_price(entry)

    return {
        "code": tracked_code,
        "source": source,
        "name": (quote or {}).get("name") or previous.get("name"),
        "status": status,
        "price": price,
        "asOf": history[-1]["date"] if history else None,
        "returnVsFinalPct": pct_change(final_price, price),
        "returnVsIpoPct": pct_change(ipo_price, price),
        "highPrice": high[0] if high else None,
        "highDate": high[1] if high else None,
        "lowPrice": low[0] if low else None,
        "lowDate": low[1] if low else None,
        "trackedTradingDays": len(history),
        "history": history,
    }


def track_post_merger(
    entries,
    overrides,
    generated_at,
    history_pages=3,
    max_workers=4,
    quote_fetcher=None,
    history_fetcher=None,
):
    """아카이브 항목들의 postMerger 블록을 제자리 갱신한다.

    ``(changed, errors)``를 돌려준다. changed는 archive.json을 다시 써야
    하는지(블록 내용이 실제로 바뀌었는지)를 뜻한다.
    """
    if quote_fetcher is None or history_fetcher is None:
        from .sources import naver

        quote_fetcher = quote_fetcher or naver.fetch_quotes
        history_fetcher = history_fetcher or naver.fetch_histories

    today = generated_at.date()
    changed = False
    errors = {}

    targets = []
    for entry in entries or []:
        override = (overrides or {}).get(entry.get("code")) or {}
        tracked_code, source = resolve_tracking_target(entry, override)
        if not tracked_code:
            continue
        if source == SOURCE_SAME_CODE:
            archived_date = parse_date(_history_cutoff(entry))
            if archived_date and (today - archived_date).days > AUTO_TRACK_WINDOW_DAYS:
                # 추적 창이 끝난 항목은 마지막 데이터를 보존하고 종료 표시만 남긴다.
                previous = entry.get("postMerger")
                if isinstance(previous, dict) and previous.get("status") != STATUS_ENDED:
                    entry["postMerger"] = {**previous, "status": STATUS_ENDED}
                    changed = True
                continue
        targets.append((entry, tracked_code, source))

    if not targets:
        return changed, errors

    codes = sorted({tracked_code for _, tracked_code, _ in targets})
    quotes, quote_errors = quote_fetcher(codes, max_workers=max_workers)
    histories = history_fetcher(codes, history_pages, max_workers=max_workers)

    for entry, tracked_code, source in targets:
        if tracked_code in quote_errors:
            errors[entry.get("code")] = f"{tracked_code}: {quote_errors[tracked_code]}"
        block = build_post_merger_block(
            entry,
            tracked_code,
            source,
            quotes.get(tracked_code),
            histories.get(tracked_code),
            today,
        )
        if block != entry.get("postMerger"):
            entry["postMerger"] = block
            changed = True
    return changed, errors
