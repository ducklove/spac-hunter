import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const live = require('../../assets/live-prices.js');
const NOW = Date.parse('2026-09-21T09:30:00+09:00');
const item = (code = '477340', price = 1900) => ({ symbol: code, market: 'J',
  summary: { current_price: price, change: 5, change_pct: 0.26, volume: 0, trading_value: 0 },
  raw: { stck_shrn_iscd: code, stck_prpr: price, stck_oprc: 2000, prdy_vrss: '5',
    prdy_ctrt: '0.26', prdy_vrss_sign: '5', acml_vol: '0', acml_tr_pbmn: '0',
    lstn_stcn: 1000000, temp_stop_yn: 'Y' }, meta: { polled_at: NOW } });
const spac = { code: '477340', name: '검증스팩', currentPrice: 2100, ipoPrice: 2000,
  liquidationValuePerShare: 2200, liquidationDate: '2027-09-21',
  quote: { tradedAt: '2026-09-18T15:30:00+09:00', tradeStop: true },
  mergerStatus: '합병 신청', history: [{ date: '2026-09-18', close: 2100 }] };

test('하락 부호·0 거래량·시가총액을 보존하고 조회와 체결 시각을 구분한다', () => {
  const q = live.normalizeQuote(item(), NOW);
  assert.equal(q.change, -5);
  assert.equal(q.changePct, -0.26);
  assert.equal(q.volume, 0);
  assert.equal(q.tradingValue, 0);
  assert.equal(q.marketCap, 1900000000);
  assert.equal(q.tradedAt, null);
  assert.equal(q.checkedAt, NOW);
});
test('가격 누락·0·오래된 응답·미래 응답·잘못된 코드 거부', () => {
  for (const bad of [item('477340', 0), item('477340', null), item('bad'),
    { ...item(), meta: {} }, { ...item(), meta: { polled_at: NOW - 61000 } },
    { ...item(), meta: { polled_at: NOW + 61000 } }]) {
    assert.equal(live.normalizeQuote(bad, NOW), null);
  }
});
test('시간외·통합 요약값 대신 원본 정규장 시세만 반영한다', () => {
  const response = item();
  response.summary = { current_price: 2400, change: 400, change_pct: 20, volume: 999, trading_value: 9999 };
  response.raw.nxtOverMarketPriceInfo = { closePrice: 2500 };
  const q = live.normalizeQuote(response, NOW);
  assert.equal(q.price, 1900);
  assert.equal(q.change, -5);
  assert.equal(q.volume, 0);
  assert.equal(q.tradingValue, 0);
  assert.equal(q.priceSession, 'regular');
  delete response.raw.stck_prpr;
  assert.equal(live.normalizeQuote(response, NOW), null);
});
test('NXT·통합 시장·네이버 응답은 현재가를 덮어쓰지 않는다', () => {
  for (const market of ['NX', 'UN', undefined]) {
    assert.equal(live.normalizeQuote({ ...item(), market }, NOW), null);
  }
  const response = item();
  response.raw.stck_shrn_iscd = '000000';
  assert.equal(live.normalizeQuote(response, NOW), null);
  assert.equal(live.normalizeQuote({ symbol: '0041L0', market: 'J',
    raw: { cd: '0041L0', nv: 1915, ms: 'CLOSE' }, meta: { polled_at: NOW } }, NOW), null);
});
test('정규장 시작·마감 가격과 장 종료 뒤 정규장 종가는 허용한다', () => {
  for (const date of ['2026-09-21T09:00:00+09:00', '2026-09-21T15:30:00+09:00']) {
    const now = Date.parse(date);
    assert.equal(live.normalizeQuote({ ...item(), meta: { polled_at: now } }, now).price, 1900);
  }
  const now = Date.parse('2026-09-21T18:00:00+09:00');
  const response = item();
  response.raw.ms = 'CLOSE';
  response.raw.localTradedAt = '2026-09-21T18:00:00+09:00';
  response.summary.current_price = 2400;
  response.meta.polled_at = now;
  const q = live.normalizeQuote(response, now);
  assert.equal(q.price, 1900);
  assert.equal(q.source, '한국투자증권 KRX 정규장 종가');
  assert.equal(q.tradedAt, null);
});
test('하나35호스팩 비교 가격은 네이버 1915원이 아니라 KRX 종가 2005원이다', async () => {
  const now = Date.parse('2026-10-14T07:40:00+09:00');
  const quotes = await live.fetchQuotes(['0041L0'], { now: () => now, requestGapMs: 0,
    fetchImpl: async url => {
      assert.equal(new URL(url).pathname, '/v1/stocks/0041L0/quote');
      assert.equal(new URL(url).searchParams.get('market'), 'J');
      const response = item('0041L0', 2005);
      Object.assign(response.raw, { nv: 1915, stck_oprc: '0', prdy_vrss: '0', acml_vol: '0' });
      response.summary.current_price = 1915;
      return { ok: true, json: async () => response };
    } });
  const saved = { ...spac, code: '0041L0', currentPrice: 2005, change: -5, volume: 14496 };
  const refreshed = live.applyQuotes({ spacs: [saved] }, quotes, now).data;
  assert.equal(refreshed.spacs[0].currentPrice, 2005);
  assert.equal(refreshed.spacs[0].ratio, 1.0025);
  assert.equal(refreshed.spacs[0].change, -5);
  assert.equal(refreshed.spacs[0].volume, 14496);
  assert.equal(refreshed.spacs[0].quote.marketStatus, 'CLOSE');
});
test('장 밖 조회한 전 거래일 종가를 오늘 장중 차트 점으로 만들지 않는다', () => {
  const V = require('../../assets/valuation.js');
  const now = Date.parse('2026-10-14T07:40:00+09:00');
  const s = { ...spac, listingDate: '2025-01-01',
    escrowRatePeriods: [{ startDate: '2025-01-01', ratePct: 3 }],
    history: [{ date: '2026-10-13', close: 2005 }],
    quote: { price: 2005, checkedAt: now, marketStatus: 'CLOSE' } };
  const points = V.liquidationRatioHistory(s, {}, now);
  assert.equal(points.at(-1).date, '2026-10-13');
  assert.equal(points.at(-1).close, 2005);
  assert.equal(points.length, 1);
});
test('시세 변경 시 파생 수익률·배지·요약·합병 현재가를 일관되게 갱신', () => {
  const q = live.normalizeQuote(item(), NOW);
  const source = { lastUpdated: '이전 공시 갱신', spacs: [spac, { ...spac, code: '0165X0' }],
    mergerCases: [{ code: spac.code, currentPrice: 2100 }], summary: {} };
  const result = live.applyQuotes(source, new Map([[q.code, q]]), NOW);
  const s = result.data.spacs[0];
  assert.equal(result.applied, 1);
  assert.equal(s.ratio, 0.95);
  assert.equal(s.premiumPct, -5);
  assert.equal(s.expectedReturn, 15.79);
  assert.equal(s.annualizedReturn, 15.79);
  assert.deepEqual(s.badges, ['공모가 이하', '합병 신청', '청산 1년 이내', '거래정지']);
  assert.equal(result.data.summary.belowIpoCount, 1);
  assert.equal(result.data.mergerCases[0].currentPrice, 1900);
  assert.equal(result.data.lastUpdated, source.lastUpdated);
  assert.equal(s.history, spac.history);
  assert.equal(result.data.spacs[1], source.spacs[1]);
  assert.equal(source.spacs[0].currentPrice, 2100);
});
test('이전 응답 역전 방지 및 만기 경과 연환산 제외', () => {
  const q = live.normalizeQuote(item(), NOW);
  const newer = { ...spac, quote: { checkedAt: NOW + 1 } };
  assert.equal(live.mergeQuote(newer, q, NOW), newer);
  assert.equal(live.mergeQuote(spac, { ...q, code: '000000' }, NOW), spac);
  assert.equal(live.mergeQuote({ ...spac, liquidationDate: '2026-09-20' }, q, NOW).annualizedReturn, null);
});
test('연환산은 청산기한이 아니라 청산금 수령 예정일까지로 계산하고 배지는 청산기한 기준', () => {
  const q = live.normalizeQuote(item(), NOW);
  const s = live.mergeQuote({ ...spac, payoutDate: '2028-01-01' }, q, NOW);
  assert.equal(s.daysToLiquidation, 365);
  assert.equal(s.daysToPayout, 467);
  assert.equal(s.annualizedReturn, Number((((2200 / 1900) ** (365 / 467) - 1) * 100).toFixed(2)));
  assert.ok(s.badges.includes('청산 1년 이내'));
  // 청산기한이 지나도 분배 전이면 수령일까지로 연환산한다.
  const late = live.mergeQuote({ ...spac, liquidationDate: '2026-09-20', payoutDate: '2026-12-31' }, q, NOW);
  assert.equal(late.daysToPayout, 101);
  assert.ok(late.annualizedReturn > 0);
});
test('숫자·영문 코드 모두 KRX(J) 명시 조회, 실패 종목 유지', async () => {
  const calls = [];
  const result = await live.fetchQuotes(['477340', '475240', '0165X0', '477340'], {
    now: () => NOW, fetchImpl: async url => {
      calls.push(url);
      assert.equal(new URL(url).searchParams.get('market'), 'J');
      if (url.includes('/477340/')) return { ok: true, json: async () => item() };
      if (url.includes('/0165X0/')) return { ok: true, json: async () => item('0165X0') };
      throw new Error('조회 실패');
    }
  });
  assert.equal(result.size, 2);
  assert.equal(calls.length, 3);
  assert.ok(calls.every(url => !url.includes('naverfinance')));
  assert.ok(result.has('0165X0'));
});
test('요청 제한 시 추가 조회 중단', async () => {
  let calls = 0;
  const result = await live.fetchQuotes(['477340', '0165X0'], {
    now: () => NOW, fetchImpl: async () => { calls++; return { ok: false, status: 429 }; }
  });
  assert.equal(calls, 1);
  assert.equal(result.size, 0);
});
test('시간 초과 시 요청 취소 및 다음 갱신 가능', async () => {
  let aborted = false;
  const result = await live.fetchQuotes(['0165X0'], { now: () => NOW, timeoutMs: 5,
    fetchImpl: (_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => { aborted = true; reject(new Error('시간 초과')); });
    }) });
  assert.ok(aborted);
  assert.equal(result.size, 0);
});
test('중복 갱신 방지·5분 주기·숨김 중단·복귀 갱신·오류 후 재예약', async () => {
  let data = { spacs: [spac] };
  let finish;
  let scheduled;
  let visibility;
  let calls = 0;
  const states = [];
  const doc = { hidden: false, addEventListener: (_, listener) => { visibility = listener; } };
  const controller = live.createController({ getData: () => data, onData: next => { data = next; },
    onStatus: status => states.push(status), documentRef: doc, now: () => NOW,
    setTimer: (callback, delay) => { assert.equal(delay, 300000); scheduled = callback; return 1; }, clearTimer: () => {},
    fetcher: () => { calls++; return new Promise(resolve => { finish = resolve; }); } });
  controller.start();
  controller.start();
  const pending = controller.refresh();
  assert.equal(pending, controller.refresh());
  await Promise.resolve();
  assert.equal(calls, 1);
  finish(new Map([['477340', live.normalizeQuote(item(), NOW)]]));
  await pending;
  assert.equal(states.at(-1).applied, 1);
  doc.hidden = true;
  scheduled();
  assert.equal(calls, 1);
  doc.hidden = false;
  visibility();
  const next = controller.refresh();
  await Promise.resolve();
  assert.equal(calls, 2);
  finish(new Map());
  await next;
  assert.equal(states.at(-1).applied, 0);
  assert.equal(data.spacs[0].currentPrice, 1900);
  assert.equal(states.at(-1).lastSuccess, NOW);
});
