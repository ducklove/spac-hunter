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
