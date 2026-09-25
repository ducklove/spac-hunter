/* 청산분배금 추정. spac_hunter/domain/valuation.py estimate_trust_value_from_periods와 같은 계산:
   (공시 예치이율 - 신탁보수) × (1 - 이자 원천징수)의 단리를 예치 계약마다 쌓고, 재예치(공시 변경일,
   그 외 12개월)마다 원금에 합산한다. 최근 공시 예치금액(anchor)이 있으면 그 잔액에서 다시 출발한다. */
(function() {
  'use strict';

  const DAY_MS = 86400000;

  function isoTime(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
  }

  /* parsing.add_months와 같이 말일을 넘으면 그 달 말일로 맞춘다. */
  function addMonths(time, months) {
    const date = new Date(time);
    const total = date.getUTCMonth() + months;
    const year = date.getUTCFullYear() + Math.floor(total / 12);
    const month = ((total % 12) + 12) % 12;
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay));
  }

  function netAnnualRate(ratePct, trustFeePct = 0, interestTaxPct = 0) {
    return Math.max(0, (Number(ratePct) - Number(trustFeePct)) / 100) * (1 - Number(interestTaxPct) / 100);
  }

  function daysBetween(from, to) {
    return Math.round((to - from) / DAY_MS);
  }

  /* scenario({startDate, ratePct})는 그날 이후 이율만 바꾸는 가정이다. 재예치 시점을 새로 만들지 않아
     시나리오 이율이 현재 이율과 같으면 기본 추정치와 정확히 같다. */
  function estimateTrustValue({
    ipoPrice,
    startDate,
    endDate,
    periods,
    trustFeePct = 0,
    interestTaxPct = 0,
    rolloverMonths = 12,
    anchor = null,
    scenario = null
  } = {}) {
    const ipo = Number(ipoPrice);
    if (!(ipo > 0)) return null;
    const list = (periods || [])
      .map(period => ({ start: isoTime(period && period.startDate), rate: Number(period && period.ratePct) }))
      .filter(period => Number.isFinite(period.start) && Number.isFinite(period.rate))
      .sort((a, b) => a.start - b.start);
    if (!list.length) return null;
    const end = isoTime(endDate);
    if (!Number.isFinite(end)) return null;
    let start = Number.isFinite(isoTime(startDate)) ? isoTime(startDate) : list[0].start;
    let value = ipo;
    const anchorTime = anchor ? isoTime(anchor.date) : NaN;
    const anchorValue = anchor ? Number(anchor.valuePerShare) : NaN;
    if (Number.isFinite(anchorTime) && anchorValue > 0 && start <= anchorTime && anchorTime <= end) {
      start = anchorTime;
      value = anchorValue;
    }
    if (end <= start) return value;

    const scenarioTime = scenario ? isoTime(scenario.startDate) : NaN;
    const scenarioRate = scenario ? Number(scenario.ratePct) : NaN;
    const hasScenario = Number.isFinite(scenarioTime) && Number.isFinite(scenarioRate);
    const termInterest = (termStart, termEnd, ratePct) => {
      const net = netAnnualRate(ratePct, trustFeePct, interestTaxPct);
      if (!hasScenario || scenarioTime >= termEnd) return net * daysBetween(termStart, termEnd) / 365;
      const scenarioNet = netAnnualRate(scenarioRate, trustFeePct, interestTaxPct);
      if (scenarioTime <= termStart) return scenarioNet * daysBetween(termStart, termEnd) / 365;
      return (net * daysBetween(termStart, scenarioTime) + scenarioNet * daysBetween(scenarioTime, termEnd)) / 365;
    };

    const boundaries = [start, ...list.map(period => period.start).filter(time => time > start && time < end), end];
    let idx = 0;
    let rate = null;
    for (let i = 0; i < boundaries.length - 1; i += 1) {
      const segmentStart = boundaries[i];
      const segmentEnd = boundaries[i + 1];
      while (idx < list.length && list[idx].start <= segmentStart) {
        rate = list[idx].rate;
        idx += 1;
      }
      if (rate == null) rate = list[0].rate;
      let termStart = segmentStart;
      while (termStart < segmentEnd) {
        const termEnd = Math.min(addMonths(termStart, rolloverMonths), segmentEnd);
        value *= 1 + termInterest(termStart, termEnd, rate);
        termStart = termEnd;
      }
    }
    return value;
  }

  function annualizedReturnPct(target, price, days) {
    const value = Number(target);
    const cost = Number(price);
    const holding = Number(days);
    if (!(value > 0) || !(cost > 0) || !(holding > 0)) return null;
    const result = ((value / cost) ** (365 / holding) - 1) * 100;
    return Number.isFinite(result) ? result : null;
  }

  const SpacValuation = { addMonths, annualizedReturnPct, estimateTrustValue, isoTime, netAnnualRate };
  if (typeof window !== 'undefined') window.SpacValuation = SpacValuation;
  if (typeof module !== 'undefined' && module.exports) module.exports = SpacValuation;
})();
