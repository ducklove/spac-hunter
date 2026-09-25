"""공모 예치금 헬퍼: 납입일, 재예치(신탁계약내용변경) 목록, 공시 잔액으로 역산한 신탁보수.

재예치 공시의 '변경 전 예치금액 -> 변경 후 예치금액'은 한 예치 계약 동안 붙은 세후 이자라서,
    순이율 = (변경 후 / 변경 전 - 1) × 365 / 일수
    신탁보수 = 변경 전 이율 - 순이율 / (1 - 이자 원천징수율)
로 계약마다 보수를 거꾸로 구할 수 있다. 2026-09 기준 상장 스팩 42곳에서 KB·미래에셋·하나·한국투자
계열은 0%p(정기예금형, 세금만 차감), 나머지 증권사는 0.1%p(특정금전신탁)로 뚜렷하게 갈렸다.
"""

from datetime import timedelta
from statistics import median

from ..constants import TRUST_ROLLOVER_MONTHS
from ..parsing import add_months, parse_date, parse_float, parse_int

# 역산 보수가 이 범위를 벗어나면 이율·금액 추출 오류나 비과세 예외로 보고 버린다.
IMPLIED_FEE_MIN_PCT = -0.05
IMPLIED_FEE_MAX_PCT = 0.3
# 실제 보수는 0.05%p 단위 약정이고, 일수 1-2일 오차는 0.01-0.03%p 흔들림을 만든다.
FEE_ROUNDING_PCT = 0.05
MIN_OBSERVATION_DAYS = 28
# 재예치 사이 공시가 빠졌는지 판단하는 직전 '변경 후'와 이번 '변경 전' 금액의 허용 차이.
AMOUNT_CHAIN_TOLERANCE = 0.001
# 순이율/약정이율이 이 범위면 공시 금액이 세전(세금·보수를 다음 재예치 때 차감)이다. 세후 표기는
# 0.81-0.85(보수 0.1%p/없음), 세전 표기는 약 1.0(신영10호 첫해 3.6% 그대로, 하이7·신한10호도 같음).
# 1.07을 넘으면 이율 추출 오류로 본다.
GROSS_RATIO_RANGE = (0.93, 1.07)


def business_days_after(day, count):
    while count > 0:
        day += timedelta(days=1)
        if day.weekday() < 5:
            count -= 1
    return day


def payment_date(filing):
    """공모 주금 납입일(예치 시작일).

    신고서 추출값이 청약기간 안에 있으면(예: 납입기일 대신 청약개시일을 읽은 경우) 청약 종료
    2영업일 뒤로 본다. 한국13·교보13·14·15호 모두 청약 종료 2영업일 뒤 납입이었다.
    """
    filing = filing or {}
    payment = parse_date(filing.get("paymentDate"))
    subscription_end = parse_date(filing.get("subscriptionEnd") or filing.get("subscriptionStart"))
    if subscription_end and (payment is None or payment <= subscription_end):
        return business_days_after(subscription_end, 2)
    return payment


def change_start(change):
    return parse_date(change.get("startDate") or change.get("filingDate"))


def rate_changes(filing):
    """재예치 공시를 시작일 순으로. 같은 날짜의 [기재정정]은 원공시를 대체한다(접수번호가 큰 쪽)."""
    latest = {}
    for change in (filing or {}).get("escrowRateChanges") or []:
        if not isinstance(change, dict):
            continue
        start = change_start(change)
        if not start:
            continue
        previous = latest.get(start)
        if previous is None or str(change.get("receiptNo") or "") >= str(previous.get("receiptNo") or ""):
            latest[start] = change
    return [latest[start] for start in sorted(latest)]


def first_term_start(paid, maturity):
    """첫 예치 계약 시작일: 첫 재예치(만기)에서 정수 개월을 거슬러 가되 납입일보다 앞서지 않는다.

    예치는 보통 상장 무렵 시작해 납입일보다 며칠 늦다(KB29호: 납입 2024-06-14, 만기 2025-06-17 = 12개월).
    """
    months = max(1, round((maturity - paid).days / 30.44))
    return max(paid, add_months(maturity, -months))


def implied_fee_pct(change, term_start, interest_tax_pct):
    """한 예치 계약(term_start ~ 재예치일)의 공시 잔액으로 역산한 신탁보수(%p). 쓸 수 없으면 None."""
    before = parse_int(change.get("amountBefore"))
    after = parse_int(change.get("amountAfter"))
    rate_pct = parse_float(change.get("rateBeforePct"))
    maturity = change_start(change)
    if not before or not after or rate_pct is None or not term_start or not maturity:
        return None
    days = (maturity - term_start).days
    if days < MIN_OBSERVATION_DAYS or interest_tax_pct >= 100:
        return None
    net_pct = (after / before - 1) * 365 / days * 100
    fee_pct = rate_pct - net_pct / (1 - interest_tax_pct / 100)
    return fee_pct if IMPLIED_FEE_MIN_PCT <= fee_pct <= IMPLIED_FEE_MAX_PCT else None


def _terms(filing):
    """(첫 계약 여부, 재예치 공시, 계약 시작일) — 금액으로 이자를 확인할 수 있는 예치 계약들."""
    changes = rate_changes(filing)
    paid = payment_date(filing)
    terms = []
    for idx, change in enumerate(changes):
        if idx == 0:
            maturity = change_start(change)
            if paid and paid < maturity:
                terms.append((True, change, first_term_start(paid, maturity)))
            continue
        previous = changes[idx - 1]
        previous_after = parse_int(previous.get("amountAfter"))
        before = parse_int(change.get("amountBefore"))
        if previous_after and before and abs(previous_after - before) > before * AMOUNT_CHAIN_TOLERANCE:
            continue
        terms.append((False, change, change_start(previous)))
    return terms


def _net_to_contract_ratio(change, term_start):
    before = parse_int(change.get("amountBefore"))
    after = parse_int(change.get("amountAfter"))
    rate_pct = parse_float(change.get("rateBeforePct"))
    maturity = change_start(change)
    if not before or not after or not rate_pct or rate_pct < 0.5 or not term_start or not maturity:
        return None
    days = (maturity - term_start).days
    if days < MIN_OBSERVATION_DAYS:
        return None
    return (after / before - 1) * 365 / days * 100 / rate_pct


def gross_reported(filing):
    """공시 예치금액이 세전(세금·보수 차감 전)으로 적힌 스팩인가.

    이런 스팩은 세금·보수를 다음 재예치 때 떼므로 '변경 후 예치금액'이 실제 순잔액보다 크다
    (신영10호: 2026-07-30 공시 9,764,028,771원 vs 순잔액 약 9,738,800,000원, 1주당 5.5원).
    공시 잔액 기준점과 보수 역산을 쓰지 않고 이율 구간으로 계산해야 한다.
    """
    low, high = GROSS_RATIO_RANGE
    for _, change, term_start in _terms(filing):
        ratio = _net_to_contract_ratio(change, term_start)
        if ratio is not None and low <= ratio <= high:
            return True
    return False


def implied_trust_fee(filing, interest_tax_pct):
    """공시 예치금으로 역산한 이 스팩의 신탁보수 {"pct", "observations", "exact"}. 근거가 없으면 None.

    직전 재예치일부터의 계약(날짜가 정확함)을 우선하고, 없을 때만 첫 계약을 쓴다. 세전 표기
    스팩은 계약마다 차감 시점이 어긋나 역산할 수 없다.
    """
    if gross_reported(filing):
        return None
    exact, first = [], []
    for is_first, change, term_start in _terms(filing):
        value = implied_fee_pct(change, term_start, interest_tax_pct)
        if value is not None:
            (first if is_first else exact).append(value)
    observations = exact or first
    if not observations:
        return None
    fee_pct = max(0.0, round(median(observations) / FEE_ROUNDING_PCT) * FEE_ROUNDING_PCT)
    return {"pct": round(fee_pct, 2), "observations": len(observations), "exact": bool(exact)}


def build_trust_fee_hints(entries, interest_tax_pct):
    """재예치 공시가 아직 없는 스팩에 쓸 증권사별 신탁보수.

    ``entries``는 (증권사, filing) 목록. 증권사는 예금형/신탁형 구조를 반복해 쓴다(2026-09 기준
    2종목 이상인 9개 증권사 모두 한 값). 역산값이 0.05%p 안에서 일치할 때만 {"pct", "count"}를 준다.
    """
    by_sponsor = {}
    for sponsor, filing in entries:
        if not sponsor or not filing:
            continue
        implied = implied_trust_fee(filing, interest_tax_pct)
        if implied:
            by_sponsor.setdefault(sponsor, []).append(implied["pct"])
    hints = {}
    for sponsor, values in by_sponsor.items():
        if max(values) - min(values) <= FEE_ROUNDING_PCT + 1e-9:
            hints[sponsor] = {"pct": round(median(values), 2), "count": len(values)}
    return hints


def current_contract(filing, today):
    """오늘 돌고 있는 예치 계약(가장 최근 재예치 공시)과 그 만기.

    만기는 공시의 만기일 > 공시 계약기간 > 12개월 가정 순. 유진·신한 계열의 '계약만기일'은
    공모 때 맺은 3년 신탁계약의 만기라 1년 예금 만기보다 늦을 수 있다.
    """
    changes = [change for change in rate_changes(filing) if change_start(change) <= today]
    if not changes:
        return None
    latest = changes[-1]
    start = change_start(latest)
    maturity = parse_date(latest.get("maturityDate"))
    source = "공시 만기일"
    if maturity is None:
        months = parse_int(latest.get("termMonths"))
        if months:
            maturity = add_months(start, months)
            source = f"공시 계약기간 {months}개월"
    disclosed = maturity is not None
    if maturity is None:
        # 3·6개월 단위로 굴리는 스팩(DB금융12호 등)이 있어 직전 계약 기간을 우선 가정한다.
        if len(changes) >= 2:
            months = round((start - change_start(changes[-2])).days / 30.44)
            months = min(max(months, 1), TRUST_ROLLOVER_MONTHS)
            source = f"계약기간 미공시(직전 계약 {months}개월 가정)"
        else:
            months = TRUST_ROLLOVER_MONTHS
            source = f"계약기간 미공시({months}개월 가정)"
        maturity = add_months(start, months)
    return {
        "startDate": start,
        "ratePct": parse_float(latest.get("ratePct")),
        "maturityDate": maturity,
        "maturitySource": source,
        "maturityDisclosed": disclosed,
        "receiptNo": latest.get("receiptNo"),
        "url": latest.get("url"),
    }
