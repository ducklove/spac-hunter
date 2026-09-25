import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { buildExpectedReturnTrend } = require('../../assets/return-trend.js');
const stock = overrides => ({
  currentPrice: 2000,
  listingDate: '2024-01-01',
  liquidationDate: '2026-06-01',
  liquidationValuePerShare: 2200,
  history: [{ date: '2025-06-01', close: 2000 }],
  ...overrides
});

test('일별 종가와 각 날짜의 잔여일수로 연환산하고 종목별 동일 비중으로 평균한다', () => {
  const rows = buildExpectedReturnTrend([
    stock({ currentPrice: 9999, history: [{ date: '2025-06-01', close: 2000, volume: 10000 }] }),
    stock({ liquidationDate: '2027-06-01', liquidationValuePerShare: 2400 })
  ]);
  assert.deepEqual(rows, [{ date: '2025-06-01', averageAnnualizedReturn: 9.77, totalCount: 2 }]);

  const changingDays = buildExpectedReturnTrend([stock({
    history: [{ date: '2025-06-01', close: 2000 }, { date: '2024-06-01', close: 2000 }]
  })]);
  assert.deepEqual(changingDays.map(row => row.averageAnnualizedReturn), [4.88, 10]);
  assert.deepEqual(changingDays.map(row => row.date), ['2024-06-01', '2025-06-01']);
});

test('잔여일수는 청산금 수령 예정일(payoutDate)까지, 없거나 잘못되면 청산기한까지로 센다', () => {
  const rows = buildExpectedReturnTrend([
    stock({ liquidationDate: '2026-02-26', payoutDate: '2026-06-01' }),
    stock({ payoutDate: 'invalid' })
  ]);
  assert.deepEqual(rows, [{ date: '2025-06-01', averageAnnualizedReturn: 10, totalCount: 2 }]);
});

test('청산 당일·이후, 상장 전, 잘못된 날짜·가격·분배금은 평균에서 제외한다', () => {
  const rows = buildExpectedReturnTrend([
    stock({ history: [
      { date: '2025-06-01', close: 2000 },
      { date: '2026-06-01', close: 2000 },
      { date: '2026-06-02', close: 2000 },
      { date: '2023-12-31', close: 2000 },
      { date: '2025-02-30', close: 2000 },
      { date: 'not-a-date', close: 2000 },
      { date: '2025-06-02', close: 0 },
      { date: '2025-06-03', close: null },
      { date: '2025-06-04', close: -100 },
      { date: '2025-06-05', close: Infinity },
      null
    ] }),
    stock({ liquidationValuePerShare: null }),
    stock({ liquidationValuePerShare: Infinity }),
    stock({ liquidationValuePerShare: -1 }),
    stock({ liquidationDate: 'invalid' }),
    stock({ currentPrice: 0 })
  ]);
  assert.deepEqual(rows, [{ date: '2025-06-01', averageAnnualizedReturn: 10, totalCount: 1 }]);
});

test('중복 날짜는 종목당 한 번만 집계하고 0%·음수 수익률도 포함한다', () => {
  const rows = buildExpectedReturnTrend([
    stock({ liquidationValuePerShare: 2000, history: [
      { date: '2025-06-01', close: 1900 }, { date: '2025-06-01', close: 2000 }
    ] }),
    stock({ liquidationValuePerShare: 1800 })
  ]);
  assert.deepEqual(rows, [{ date: '2025-06-01', averageAnnualizedReturn: -5, totalCount: 2 }]);
});

test('희소한 이력은 제외하고 유효 종목 70% 이상인 날짜와 실제 표본 수를 반환한다', () => {
  const spacs = Array.from({ length: 10 }, (_, i) => stock({ history: [
    ...(i < 6 ? [{ date: '2025-05-30', close: 2000 }] : []),
    ...(i < 7 ? [{ date: '2025-05-31', close: 2000 }] : []),
    { date: '2025-06-01', close: 2000 }
  ] }));
  const rows = buildExpectedReturnTrend(spacs);
  assert.deepEqual(rows.map(row => [row.date, row.totalCount]), [['2025-05-31', 7], ['2025-06-01', 10]]);
});

test('누락된 데이터와 오버플로는 빈 추이로 처리한다', () => {
  assert.deepEqual(buildExpectedReturnTrend(null), []);
  assert.deepEqual(buildExpectedReturnTrend([]), []);
  assert.deepEqual(buildExpectedReturnTrend([stock({ history: null })]), []);
  assert.deepEqual(buildExpectedReturnTrend([stock({
    liquidationValuePerShare: 1e300,
    history: [{ date: '2026-05-31', close: 1 }]
  })]), []);
});
