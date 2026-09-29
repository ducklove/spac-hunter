/* 현재 상장 종목의 일별 청산괴리율 동일 비중 평균.
   분모는 미래 만기 분배금이 아니라 해당 날짜의 추정 청산가다. */
(function() {
  'use strict';
  const V = typeof module !== 'undefined' && module.exports
    ? require('./valuation.js') : window.SpacValuation;

  function dateMillis(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
  }

  function buildLiquidationDiscountTrend(spacs, assumptions = {}, now = Date.now()) {
    const eligible = (spacs || []).filter(item => item
      && Number.isFinite(Number(item.currentPrice)) && Number(item.currentPrice) > 0);
    const minCount = Math.max(1, Math.ceil(eligible.length * 0.7));
    const byDate = new Map();
    eligible.forEach(item => {
      const listing = dateMillis(item.listingDate);
      const values = new Map();
      V.liquidationRatioHistory(item, assumptions, now).forEach(point => {
        const time = dateMillis(point.date);
        if (!Number.isFinite(time) || time < listing) return;
        const value = V.liquidationDiscountPct(point.liquidationValue, point.close);
        if (value != null) values.set(point.date, { value, isLive: point.isLive, checkedAt: point.checkedAt });
      });
      values.forEach((value, date) => {
        if (!byDate.has(date)) byDate.set(date, []);
        byDate.get(date).push(value);
      });
    });
    return Array.from(byDate.entries())
      .filter(([, values]) => values.length >= minCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => {
        const live = values.filter(point => point.isLive);
        return {
          date,
          averageLiquidationDiscount: values.reduce((sum, point) => sum + point.value, 0) / values.length,
          totalCount: values.length,
          ...(live.length ? { liveCount: live.length, checkedAt: Math.min(...live.map(point => point.checkedAt)) } : {})
        };
      })
      .filter(point => Number.isFinite(point.averageLiquidationDiscount));
  }

  const SpacDiscountTrend = { buildLiquidationDiscountTrend };
  if (typeof window !== 'undefined') window.SpacDiscountTrend = SpacDiscountTrend;
  if (typeof module !== 'undefined' && module.exports) module.exports = SpacDiscountTrend;
})();
