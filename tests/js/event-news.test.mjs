import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const news = require('../../assets/event-news.js');
const NOW = Date.parse('2026-09-21T09:00:00+09:00');
const event = (date, type = 'merger_applied', code = '0197V0') => ({
  date, type, code, name: '검증스팩', detail: '공시 내용', url: 'https://dart.fss.or.kr/test'
});
function storage(initial) {
  let value = initial ? JSON.stringify(initial) : null;
  return { getItem: () => value, setItem: (_, next) => { value = next; } };
}
const collect = alerts => news.collectEvents({ spacs: [] }, alerts, NOW);

test('미래 청산예정·가격 변동 제외, 신규상장·합병·해산·상폐 이벤트 중복 통합', () => {
  const data = { spacs: [{ code: '0197V0', name: '검증스팩', listingDate: '2026-09-20',
    events: [event('2026-09-20', 'merger_application'), event('2026-09-22', 'liquidation')],
    mergerPriceRecords: [{ date: '2026-09-20', signal: 'applied', title: '같은 공시' }] }] };
  const rows = news.collectEvents(data, [event('2026-09-20'), event('2026-09-20', 'below_ipo_enter'),
    event('2026-09-21', 'dissolution'), event('2026-09-21', 'delisted', '123456')], NOW);
  assert.equal(rows.length, 4);
  assert.deepEqual(new Set(rows.map(r => r.type)), new Set(['merger_applied', 'new_listing', 'dissolution', 'delisted']));
});
test('첫 방문은 최근 7일만 NEW, 과거 이력은 다음 방문에서도 재알림하지 않음', () => {
  const store = storage();
  const rows = collect([event('2026-09-14'), event('2026-09-15'), event('2026-09-21'), event('2026-09-22')]);
  const first = news.createTracker({ storage: store, now: () => NOW });
  assert.equal(first.ingest(rows).events.length, 2);
  first.acknowledgeAll();
  const second = news.createTracker({ storage: store, now: () => NOW + 1000 });
  assert.equal(second.ingest(rows).events.length, 0);
  assert.equal(second.snapshot().previousVisit, NOW);
});
test('같은 날 재방문한 이후 새 합병·신규 상장만 검출하고 확인 전까지 유지', () => {
  const store = storage();
  const first = news.createTracker({ storage: store, now: () => NOW });
  const initial = collect([event('2026-09-21', 'new_listing')]);
  first.ingest(initial);
  first.acknowledgeAll();
  const added = collect([event('2026-09-21', 'new_listing'), event('2026-09-21'), event('2026-09-21', 'new_listing', '123456')]);
  const second = news.createTracker({ storage: store, now: () => NOW + 5000 });
  assert.equal(second.ingest(added).events.length, 2);
  assert.equal(second.ingest(added).events.length, 2);
  assert.ok(second.hasCode('0197V0'));
  assert.ok(second.hasEvent('0197V0', 'applied', '2026-09-21'));
  const reloaded = news.createTracker({ storage: store, now: () => NOW + 6000 });
  assert.equal(reloaded.ingest(added).events.length, 2);
  reloaded.acknowledge(news.eventId('0197V0', 'applied', '2026-09-21'));
  assert.equal(reloaded.hasCode('0197V0'), false);
  assert.equal(reloaded.snapshot().events.length, 1);
});
test('뒤늦게 수집된 과거 공시와 화면을 열어둔 동안 추가된 이벤트도 놓치지 않음', () => {
  const store = storage({ version: 1, visitedAt: NOW - 1000, knownIds: [], unread: [] });
  const tracker = news.createTracker({ storage: store, now: () => NOW });
  assert.equal(tracker.ingest(collect([event('2026-09-10')])).events.length, 1);
  tracker.acknowledgeAll();
  assert.equal(tracker.ingest(collect([event('2026-09-10'), event('2026-09-21')])).events.length, 1);
});
test('알림 로드 실패 시 방문 기준을 저장하지 않고 미확인 이벤트도 보존', () => {
  const store = storage({ version: 1, visitedAt: NOW - 1000, knownIds: [], unread: [] });
  const before = store.getItem();
  const tracker = news.createTracker({ storage: store, now: () => NOW });
  tracker.ingest(collect([event('2026-09-21')]), { persistVisit: false });
  assert.equal(store.getItem(), before);
  tracker.ingest(collect([event('2026-09-21')]));
  assert.equal(tracker.snapshot().events.length, 1);
});
test('저장소 차단·손상에도 이벤트와 확인 버튼이 작동', () => {
  const denied = { getItem() { throw new Error('차단'); }, setItem() { throw new Error('차단'); } };
  const tracker = news.createTracker({ storage: denied, now: () => NOW });
  assert.equal(tracker.ingest(collect([event('2026-09-21')])).events.length, 1);
  assert.equal(tracker.snapshot().storageAvailable, false);
  assert.equal(tracker.acknowledgeAll().events.length, 0);
  const broken = news.createTracker({ storage: storage({ invalid: true }), now: () => NOW });
  assert.equal(broken.ingest(collect([event('2026-09-21')])).events.length, 1);
});
test('잘못된 날짜·코드 및 실행 가능한 원문 링크 차단', () => {
  const rows = collect([event('2026-09-31'), event('2026-09-21', 'merger_applied', '<script>'),
    { ...event('2026-09-21'), url: 'javascript:alert(1)' }]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].url, null);
});
test('알림 HTTP 오류·잘못된 형식·시간 초과 전파', async () => {
  await assert.rejects(news.fetchAlerts({ fetchImpl: async () => ({ ok: false, status: 500 }) }));
  await assert.rejects(news.fetchAlerts({ fetchImpl: async () => ({ ok: true, json: async () => ({}) }) }));
  await assert.rejects(news.fetchAlerts({ timeoutMs: 5, fetchImpl: (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('시간 초과')));
  }) }));
});
