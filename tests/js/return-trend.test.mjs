import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildLiquidationDiscountTrend: build } = require('../../assets/return-trend.js');
const stock = overrides => ({
  currentPrice: 2000, ipoPrice: 2000, listingDate: '2025-01-01',
  valuationBasis: { trustStartDate: '2025-01-01', trustFeePct: 0, interestTaxPct: 0 },
  escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 0 }],
  history: [{ date: '2025-06-01', close: 1900 }],
  ...overrides,
});

test('청산가를 분모로 계산하며 가격·거래량에 상관없이 동일 비중으로 평균한다', () => {
  assert.deepEqual(build([
    stock({ currentPrice: 9999 }),
    stock({ ipoPrice: 4000, history: [{ date: '2025-06-01', close: 4400, volume: 999999 }] }),
  ]), [{ date: '2025-06-01', averageLiquidationDiscount: -2.5, totalCount: 2 }]);
});

test('미래 만기 분배금·잔여일수 대신 각 날짜까지 쌓인 청산가를 사용한다', () => {
  const s = stock({ escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 10 }],
    liquidationValuePerShare: 9999, payoutDate: '2030-01-01',
    history: [{ date: '2025-01-01', close: 2000 }, { date: '2026-01-01', close: 2000 }],
  });
  const rows = build([s]);
  assert.equal(rows[0].averageLiquidationDiscount, 0);
  assert.ok(Math.abs(rows[1].averageLiquidationDiscount - (2200 - 2000) / 2200 * 100) < 1e-9);
  assert.deepEqual(rows, build([{ ...s, payoutDate: '2025-02-01', liquidationValuePerShare: 3000 }]));
});

test('날짜별 중복을 제거하고 상장 전·잘못된 날짜·가격·청산가를 제외한다', () => {
  const rows = build([stock({ history: [
    { date: '2025-06-01', close: 1800 }, { date: '2025-06-01', close: 2000 },
    { date: '2024-12-31', close: 2000 }, { date: '2025-02-30', close: 2000 },
    { date: 'bad', close: 2000 }, { date: '2025-06-02', close: null },
    { date: '2025-06-03', close: 0 }, { date: '2025-06-04', close: Infinity }, null,
  ] })]);
  assert.deepEqual(rows, [{ date: '2025-06-01', averageLiquidationDiscount: 0, totalCount: 1 }]);
  assert.deepEqual(build([stock({ escrowRatePeriods: [] })]), []);
});

test('현재 상장 유효시세 종목의 70% 이상인 날짜만 표시한다', () => {
  const spacs = Array.from({ length: 10 }, (_, i) => stock({ history: [
    ...(i < 6 ? [{ date: '2025-05-30', close: 1900 }] : []),
    ...(i < 7 ? [{ date: '2025-05-31', close: 1900 }] : []),
    { date: '2025-06-01', close: 2000 },
  ] }));
  assert.deepEqual(build(spacs).map(p => [p.date, p.totalCount]), [['2025-05-31', 7], ['2025-06-01', 10]]);
});

test('신탁보수·세금 공통 가정을 전달하고 빈 데이터는 빈 추이로 처리한다', () => {
  const s = stock({ valuationBasis: { trustStartDate: '2025-01-01' },
    escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 10 }],
    history: [{ date: '2026-01-01', close: 2000 }],
  });
  const rows = build([s], { trustFeePct: 2, interestTaxPct: 50 });
  assert.ok(Math.abs(rows[0].averageLiquidationDiscount - (2080 - 2000) / 2080 * 100) < 1e-9);
  for (const input of [null, [], [stock({ history: null })], [stock({ currentPrice: 0 })]]) {
    assert.deepEqual(build(input), []);
  }
});

test('실시간 시세 갱신은 개별 차트와 같은 오늘 청산가로 평균을 갱신하고 중복 날짜를 만들지 않는다', () => {
  const live = require('../../assets/live-prices.js');
  const V = require('../../assets/valuation.js');
  const now = Date.parse('2026-09-29T09:30:00+09:00');
  const spacs = ['477340', '475240'].map(code => stock({ code,
    escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 3 }],
    history: [{ date: '2026-09-28', close: 2000 }, { date: '2026-09-29', close: 2100 }] }));
  const quotes = new Map(spacs.map((s, i) => [s.code, live.normalizeQuote({
    symbol: s.code, summary: { current_price: 1900 + i * 200 }, meta: { polled_at: now + i * 1000 }
  }, now)]));
  const refreshed = live.applyQuotes({ spacs }, quotes, now).data;
  const rows = build(refreshed.spacs, {}, now);
  const today = rows.at(-1);
  assert.equal(today.date, '2026-09-29');
  assert.equal(today.totalCount, 2);
  assert.equal(today.liveCount, 2);
  assert.equal(today.checkedAt, now);
  assert.equal(rows.length, 2);
  const prices = refreshed.spacs.map(s => V.liquidationRatioHistory(s, {}, now).at(-1));
  assert.deepEqual(prices.map(p => p.close), [1900, 2100]);
  const expected = prices.reduce((sum, p) => sum + (p.liquidationValue - p.close) / p.liquidationValue * 100, 0) / 2;
  assert.ok(Math.abs(today.averageLiquidationDiscount - expected) < 1e-9);
  assert.deepEqual(rows[0], build(spacs, {}, now)[0]);
  assert.equal(refreshed.spacs[0].history, spacs[0].history);
});

test('오늘 조회에 성공한 종목만 오늘 표본에 추가하고 70% 표본 기준을 지킨다', () => {
  const now = Date.parse('2026-09-29T00:01:00+09:00');
  const spacs = Array.from({ length: 10 }, (_, i) => stock({
    quote: i < 7 ? { price: 1900, checkedAt: now - i * 1000 } : { price: 1500, checkedAt: now - 86400000 }
  }));
  const today = build(spacs, {}, now).at(-1);
  assert.equal(today.date, '2026-09-29');
  assert.equal(today.averageLiquidationDiscount, 5);
  assert.equal(today.totalCount, 7);
  assert.equal(today.liveCount, 7);
  assert.equal(today.checkedAt, now - 6000);
  spacs[6].quote = null;
  assert.equal(build(spacs, {}, now).at(-1).date, '2025-06-01');
});
