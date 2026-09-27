import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const V = require('../../assets/valuation.js');

const KYOBO14 = [
  { startDate: '2023-06-30', ratePct: 3.75 },
  { startDate: '2024-06-28', ratePct: 3.45 },
  { startDate: '2025-06-30', ratePct: 2.47 },
  { startDate: '2025-12-30', ratePct: 2.84 }
];

test('교보14호스팩 공시 예치금액을 파이썬 계산과 같이 1주당 0.05원 이내로 재현한다', () => {
  for (const [endDate, amount] of [
    ['2024-06-28', 7937109180], ['2025-06-30', 8163295018], ['2025-12-30', 8245338592]
  ]) {
    const value = V.estimateTrustValue({
      ipoPrice: 2000, startDate: '2023-06-30', endDate, periods: KYOBO14,
      trustFeePct: 0.1, interestTaxPct: 15.4
    });
    assert.ok(Math.abs(value - amount / 3850000) < 0.05, `${endDate}: ${value}`);
  }
});

test('재예치마다 단리→복리, 공시 잔액(anchor)에서 재출발한다', () => {
  const periods = [{ startDate: '2024-01-01', ratePct: 3 }, { startDate: '2025-01-01', ratePct: 2.5 }];
  const plain = V.estimateTrustValue({ ipoPrice: 2000, startDate: '2024-01-01', endDate: '2027-01-01', periods });
  assert.ok(Math.abs(plain - 2000 * (1 + 0.03 * 366 / 365) * 1.025 * 1.025) < 1e-9);
  const anchored = V.estimateTrustValue({
    ipoPrice: 2000, startDate: '2024-01-01', endDate: '2025-07-01', periods,
    anchor: { date: '2025-01-01', valuePerShare: 2080 }
  });
  assert.ok(Math.abs(anchored - 2080 * (1 + 0.025 * 181 / 365)) < 1e-9);
  assert.equal(V.estimateTrustValue({ ipoPrice: 2000, periods, endDate: 'bad' }), null);
  assert.equal(V.estimateTrustValue({ ipoPrice: 0, periods, endDate: '2025-01-01' }), null);
  assert.equal(V.netAnnualRate(0.05, 0.1, 15.4), 0);
});

test('시나리오 이율이 현재 이율과 같으면 기본 추정치와 같고, 오늘 이후만 바꾼다', () => {
  const base = {
    ipoPrice: 2000, startDate: '2023-06-30', endDate: '2026-10-08', periods: KYOBO14,
    trustFeePct: 0.1, interestTaxPct: 15.4,
    anchor: { date: '2025-12-30', valuePerShare: 8245338592 / 3850000 }
  };
  const estimate = V.estimateTrustValue(base);
  const same = V.estimateTrustValue({ ...base, scenario: { startDate: '2026-09-25', ratePct: 2.84 } });
  assert.ok(Math.abs(same - estimate) < 1e-9);
  const zero = V.estimateTrustValue({ ...base, scenario: { startDate: '2026-09-25', ratePct: 0 } });
  const accrued = 8245338592 / 3850000 * (1 + (0.0284 - 0.001) * 0.846 * 269 / 365);
  assert.ok(Math.abs(zero - accrued) < 1e-9);
});

test('월말 재예치와 연환산 가드', () => {
  assert.equal(new Date(V.addMonths(Date.UTC(2024, 1, 29), 12)).toISOString().slice(0, 10), '2025-02-28');
  assert.equal(new Date(V.addMonths(Date.UTC(2023, 0, 31), 1)).toISOString().slice(0, 10), '2023-02-28');
  assert.equal(V.annualizedReturnPct(2100, 2000, 365).toFixed(6), '5.000000');
  assert.equal(V.annualizedReturnPct(2100, 2000, 0), null);
  assert.equal(V.annualizedReturnPct(null, 2000, 30), null);
});

const historicalStock = {
  ipoPrice: 2000,
  listingDate: '2024-01-10',
  // 미래 예상 분배금은 날짜별 청산가의 분모로 사용하지 않는다.
  liquidationValuePerShare: 9999,
  valuationBasis: { trustStartDate: '2024-01-01', trustFeePct: 0.1, interestTaxPct: 15.4 },
  escrowRatePeriods: [
    { startDate: '2024-01-01', ratePct: 3.1 },
    { startDate: '2025-01-01', ratePct: 2.1 }
  ]
};

test('청산가는 납입일에 공모가이고 각 날짜까지의 세후 이자만 누적한다', () => {
  assert.equal(V.liquidationValueAtDate(historicalStock, '2024-01-01'), 2000);
  assert.equal(V.liquidationValueAtDate(historicalStock, '2023-12-31'), null);
  const halfYear = 2000 * (1 + 0.03 * 0.846 * 182 / 365);
  assert.ok(Math.abs(V.liquidationValueAtDate(historicalStock, '2024-07-01') - halfYear) < 1e-9);
  const rolled = 2000 * (1 + 0.03 * 0.846 * 366 / 365) * (1 + 0.02 * 0.846 * 181 / 365);
  assert.ok(Math.abs(V.liquidationValueAtDate(historicalStock, '2025-07-01') - rolled) < 1e-9);
});

test('공시 잔액은 그 날짜부터 반영하며 그보다 앞선 청산가에 소급하지 않는다', () => {
  const stock = { ...historicalStock, valuationBasis: { ...historicalStock.valuationBasis,
    anchor: { date: '2025-01-01', valuePerShare: 2060 }
  } };
  assert.equal(V.liquidationValueAtDate(stock, '2024-01-01'), 2000);
  assert.equal(V.liquidationValueAtDate(stock, '2024-07-01'), V.liquidationValueAtDate(historicalStock, '2024-07-01'));
  assert.equal(V.liquidationValueAtDate(stock, '2025-01-01'), 2060);
  assert.ok(Math.abs(V.liquidationValueAtDate(stock, '2025-07-01') - 2060 * (1 + 0.02 * 0.846 * 181 / 365)) < 1e-9);
});

test('이율 누락과 미래 구간만 있는 경우 청산가를 임의 생성하지 않고 0% 이율은 허용한다', () => {
  assert.equal(V.liquidationValueAtDate({ ...historicalStock, escrowRatePeriods: [] }, '2024-07-01'), null);
  for (const ratePct of [null, undefined, NaN, -1]) {
    assert.equal(V.liquidationValueAtDate({ ...historicalStock,
      escrowRatePeriods: [{ startDate: '2024-01-01', ratePct }]
    }, '2024-07-01'), null);
  }
  assert.equal(V.liquidationValueAtDate({ ...historicalStock,
    escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 9 }]
  }, '2024-07-01'), null);
  assert.equal(V.liquidationValueAtDate({ ...historicalStock,
    escrowRatePeriods: [{ startDate: '2024-01-01', ratePct: 0 }]
  }, '2024-07-01'), 2000);
  assert.equal(V.liquidationValueAtDate(historicalStock, '2024-02-30'), null);
  assert.equal(V.liquidationValueAtDate({ ...historicalStock,
    valuationBasis: { ...historicalStock.valuationBasis, rolloverMonths: 0 }
  }, '2024-07-01'), null);
});

test('날짜별 청산가 비율은 원본 공모가 비율을 보존하면서 종가를 각 시점의 청산가로 나눈다', () => {
  const stock = { ...historicalStock, history: [
    { date: '2024-07-01', close: 2000, ratio: 1 },
    { date: '2024-01-01', close: 2000, ratio: 1 },
    { date: '2024-01-01', close: 2000, ratio: 1 },
    { date: '2024-05-01', close: null },
    { date: 'bad', close: 2000 }
  ] };
  const original = structuredClone(stock);
  const points = V.liquidationRatioHistory(stock);
  assert.deepEqual(points.map(point => point.date), ['2024-01-01', '2024-07-01']);
  assert.equal(points[0].liquidationValue, 2000);
  assert.equal(points[0].ratio, 1);
  assert.ok(Math.abs(points[1].ratio - 1 / (1 + 0.03 * 0.846 * 182 / 365)) < 1e-9);
  assert.deepEqual(stock, original);
  assert.deepEqual(V.liquidationRatioHistory(null), []);
});

test('청산가 괴리는 청산가를 분모로 사용하고 저평가는 양수, 고평가는 음수다', () => {
  assert.equal(V.liquidationDiscountPct(2000, 1900), 5);
  assert.equal(V.liquidationDiscountPct(2000, 2100), -5);
  assert.equal(V.liquidationDiscountPct(2000, 2000), 0);
  assert.equal(V.liquidationDiscountPct(2500, 2000), 20);
  for (const invalid of [null, undefined, NaN, Infinity, 0, -1]) {
    assert.equal(V.liquidationDiscountPct(invalid, 2000), null);
    assert.equal(V.liquidationDiscountPct(2000, invalid), null);
  }
});
