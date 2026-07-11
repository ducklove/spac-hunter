// node --test tests/js 로 실행. classic script(assets/data-loader.js)를 CommonJS로 로드한다.
// 실제 네트워크·DOM 없이 fetchImpl/documentRef/windowRef 주입으로 로드 체인을 검증한다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const loader = require('../../assets/data-loader.js');

const PAYLOAD = { schemaVersion: 2, lastUpdated: '2026-07-11 15:30:00 KST', spacs: [{ code: '100001' }] };

function okFetch(payload) {
  return async () => ({ ok: true, json: async () => payload });
}

function httpErrorFetch(status) {
  return async () => ({ ok: false, status, json: async () => ({}) });
}

function rejectingFetch(message) {
  return async () => { throw new Error(message); };
}

/* loadViaScriptTag용 가짜 DOM: appendChild 시 마이크로태스크로 onload/onerror를 호출한다. */
function fakeDom(spacData, { fail = false } = {}) {
  const win = { SPAC_DATA: spacData };
  const appended = [];
  const doc = {
    createElement: () => ({ remove() {} }),
    head: {
      appendChild(script) {
        appended.push(script.src);
        queueMicrotask(() => (fail ? script.onerror() : script.onload()));
      }
    }
  };
  return { win, doc, appended };
}

test('isValidPayload: spacs 배열을 가진 객체만 true', () => {
  assert.equal(loader.isValidPayload(PAYLOAD), true);
  assert.equal(loader.isValidPayload({ spacs: [] }), true);
  assert.equal(loader.isValidPayload(null), false);
  assert.equal(loader.isValidPayload(undefined), false);
  assert.equal(loader.isValidPayload('text'), false);
  assert.equal(loader.isValidPayload([]), false);
  assert.equal(loader.isValidPayload({}), false);
  assert.equal(loader.isValidPayload({ spacs: 'not-array' }), false);
});

test('fetchPayload: 정상 응답이면 페이로드 resolve', async () => {
  const payload = await loader.fetchPayload('data.json', { fetchImpl: okFetch(PAYLOAD) });
  assert.deepEqual(payload, PAYLOAD);
});

test('fetchPayload: HTTP 오류 상태는 reject', async () => {
  await assert.rejects(
    loader.fetchPayload('data.json', { fetchImpl: httpErrorFetch(404) }),
    /HTTP 404/
  );
});

test('fetchPayload: spacs 없는 페이로드는 reject', async () => {
  await assert.rejects(
    loader.fetchPayload('data.json', { fetchImpl: okFetch({ hello: 1 }) }),
    /형식/
  );
});

test('fetchPayload: 네트워크 오류(reject)도 reject로 전파', async () => {
  await assert.rejects(
    loader.fetchPayload('data.json', { fetchImpl: rejectingFetch('offline') }),
    /offline/
  );
});

test('fetchPayload: 동기 throw fetchImpl도 reject로 흡수', async () => {
  const throwingFetch = () => { throw new Error('sync boom'); };
  await assert.rejects(
    loader.fetchPayload('data.json', { fetchImpl: throwingFetch }),
    /sync boom/
  );
});

test('loadViaScriptTag: onload 후 window.SPAC_DATA를 resolve', async () => {
  const { win, doc, appended } = fakeDom(PAYLOAD);
  const payload = await loader.loadViaScriptTag('data.js', { documentRef: doc, windowRef: win });
  assert.deepEqual(payload, PAYLOAD);
  assert.deepEqual(appended, ['data.js']);
});

test('loadViaScriptTag: onload 후에도 SPAC_DATA가 없으면 reject', async () => {
  const { win, doc } = fakeDom(undefined);
  await assert.rejects(
    loader.loadViaScriptTag('data.js', { documentRef: doc, windowRef: win }),
    /SPAC_DATA/
  );
});

test('loadViaScriptTag: 스크립트 로드 실패(onerror)는 reject', async () => {
  const { win, doc } = fakeDom(PAYLOAD, { fail: true });
  await assert.rejects(
    loader.loadViaScriptTag('data.js', { documentRef: doc, windowRef: win }),
    /로드 실패/
  );
});

test('loadPayload: data.json 성공 시 폴백을 타지 않는다', async () => {
  let scriptCalls = 0;
  const payload = await loader.loadPayload({
    fetchImpl: okFetch(PAYLOAD),
    scriptLoader: async () => { scriptCalls += 1; return PAYLOAD; }
  });
  assert.deepEqual(payload, PAYLOAD);
  assert.equal(scriptCalls, 0);
});

test('loadPayload: fetch 실패 시 data.js 스크립트 폴백으로 resolve', async () => {
  const calls = [];
  const payload = await loader.loadPayload({
    fetchImpl: httpErrorFetch(404),
    scriptLoader: async url => { calls.push(url); return PAYLOAD; }
  });
  assert.deepEqual(payload, PAYLOAD);
  assert.deepEqual(calls, ['data.js']);
});

test('loadPayload: 둘 다 실패하면 두 사유를 합친 에러로 reject', async () => {
  await assert.rejects(
    loader.loadPayload({
      fetchImpl: httpErrorFetch(404),
      scriptLoader: async () => { throw new Error('script blocked'); }
    }),
    error => {
      assert.match(error.message, /data\.json: HTTP 404/);
      assert.match(error.message, /data\.js: script blocked/);
      return true;
    }
  );
});

test('loadPayload: jsonUrl/scriptUrl 커스텀 URL 사용', async () => {
  const fetched = [];
  const scripted = [];
  await assert.rejects(
    loader.loadPayload({
      jsonUrl: 'alt.json',
      scriptUrl: 'alt.js',
      fetchImpl: async url => { fetched.push(url); return { ok: false, status: 500 }; },
      scriptLoader: async url => { scripted.push(url); throw new Error('nope'); }
    })
  );
  assert.deepEqual(fetched, ['alt.json']);
  assert.deepEqual(scripted, ['alt.js']);
});
