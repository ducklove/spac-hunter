/* 일별 종가를 현재 청산분배금 추정치로 평가한 연환산 기대수익률 추이.
   과거 시점의 예치금·금리 추정치를 복원하는 시계열은 아니다.
   잔여일수는 청산금 수령 예정일(payoutDate, 없으면 청산기한)까지로 센다. */
(function() {
  'use strict';

  const DAY_MS = 86400000;

  function dateMillis(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
  }

  function positiveNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  }

  function payoutMillis(item) {
    const payout = dateMillis(item.payoutDate);
    return Number.isFinite(payout) ? payout : dateMillis(item.liquidationDate);
  }

  function buildExpectedReturnTrend(spacs) {
    const eligible = (spacs || []).filter(item => item
      && positiveNumber(item.currentPrice)
      && positiveNumber(item.liquidationValuePerShare)
      && Number.isFinite(payoutMillis(item)));
    // 소수 종목만 긴 이력이 있는 과거 구간이 시장 평균처럼 보이지 않도록 제한한다.
    const minCount = Math.max(1, Math.ceil(eligible.length * 0.7));
    const byDate = new Map();
    eligible.forEach(item => {
      const target = Number(item.liquidationValuePerShare);
      const end = payoutMillis(item);
      const listing = dateMillis(item.listingDate);
      const values = new Map();
      (item.history || []).forEach(point => {
        if (!point) return;
        const time = dateMillis(point.date);
        const close = positiveNumber(point.close);
        const days = (end - time) / DAY_MS;
        if (!Number.isFinite(time) || !close || days <= 0 || time < listing) return;
        const value = ((target / close) ** (365 / days) - 1) * 100;
        if (!Number.isFinite(value)) return;
        // 요약 카드와 같이 종목별 수익률은 소수점 둘째 자리까지 반영한다.
        const rounded = Math.round(value * 100) / 100;
        if (Number.isFinite(rounded)) values.set(point.date, rounded);
      });
      values.forEach((value, date) => {
        if (!byDate.has(date)) byDate.set(date, []);
        byDate.get(date).push(value);
      });
    });
    return Array.from(byDate.entries())
      .filter(([, values]) => values.length >= minCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        averageAnnualizedReturn: values.reduce((sum, value) => sum + value, 0) / values.length,
        totalCount: values.length
      }))
      .filter(point => Number.isFinite(point.averageAnnualizedReturn));
  }

  const SpacReturnTrend = { buildExpectedReturnTrend };
  if (typeof window !== 'undefined') window.SpacReturnTrend = SpacReturnTrend;
  if (typeof module !== 'undefined' && module.exports) module.exports = SpacReturnTrend;
})();
