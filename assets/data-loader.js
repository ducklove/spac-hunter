/* SpacDataLoader: 대시보드 데이터 비동기 로드 (일반 스크립트, file:// 호환).
   1순위 fetch('data.json') — index.html이 2.3MB data.js를 동기 로드하지 않게 한다.
   2순위 <script src="data.js"> 주입 폴백 — fetch가 막히는 file:// 환경과
   data.json이 아직 배포되지 않은 전환기 호환용. 둘 다 실패하면 reject.
   Node(node --test)에선 CommonJS로 로드된다 — 순수 파싱·검증 로직 테스트용. */
(function() {
  'use strict';

  var DATA_JSON_URL = 'data.json';
  var DATA_JS_URL = 'data.js';

  /* 대시보드가 렌더 가능한 최소 형태인지: spacs 배열을 가진 평범한 객체. */
  function isValidPayload(payload) {
    return !!payload
      && typeof payload === 'object'
      && !Array.isArray(payload)
      && Array.isArray(payload.spacs);
  }

  /* fetch → HTTP 상태 확인 → JSON 파싱 → 페이로드 검증. 실패는 모두 reject. */
  function fetchPayload(url, options) {
    var opts = options || {};
    var fetchImpl = opts.fetchImpl
      || (typeof fetch === 'function' ? fetch.bind(typeof window !== 'undefined' ? window : undefined) : null);
    if (!fetchImpl) {
      return Promise.reject(new Error('fetch를 사용할 수 없는 환경입니다'));
    }
    return Promise.resolve().then(function() {
      return fetchImpl(url, opts.init);
    }).then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(function(payload) {
      if (!isValidPayload(payload)) throw new Error('페이로드 형식이 올바르지 않습니다');
      return payload;
    });
  }

  /* <script src=url> 주입 후 window.SPAC_DATA를 회수. file://에서도 동작한다. */
  function loadViaScriptTag(url, options) {
    var opts = options || {};
    var doc = opts.documentRef || (typeof document !== 'undefined' ? document : null);
    var win = opts.windowRef || (typeof window !== 'undefined' ? window : null);
    if (!doc || !win) {
      return Promise.reject(new Error('document/window를 사용할 수 없는 환경입니다'));
    }
    return new Promise(function(resolve, reject) {
      var script = doc.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = function() {
        if (isValidPayload(win.SPAC_DATA)) resolve(win.SPAC_DATA);
        else reject(new Error(url + ' 로드 후에도 SPAC_DATA가 없습니다'));
      };
      script.onerror = function() {
        script.remove();
        reject(new Error(url + ' 스크립트 로드 실패'));
      };
      (doc.head || doc.documentElement).appendChild(script);
    });
  }

  /* data.json fetch → 실패 시 data.js 스크립트 폴백. 두 실패 사유를 합쳐 reject. */
  function loadPayload(options) {
    var opts = options || {};
    var jsonUrl = opts.jsonUrl || DATA_JSON_URL;
    var scriptUrl = opts.scriptUrl || DATA_JS_URL;
    var scriptLoader = opts.scriptLoader || loadViaScriptTag;
    return fetchPayload(jsonUrl, opts).catch(function(jsonError) {
      return scriptLoader(scriptUrl, opts).catch(function(scriptError) {
        var jsonReason = jsonError && jsonError.message ? jsonError.message : String(jsonError);
        var scriptReason = scriptError && scriptError.message ? scriptError.message : String(scriptError);
        throw new Error(jsonUrl + ': ' + jsonReason + ' / ' + scriptUrl + ': ' + scriptReason);
      });
    });
  }

  var SpacDataLoader = {
    isValidPayload: isValidPayload,
    fetchPayload: fetchPayload,
    loadViaScriptTag: loadViaScriptTag,
    loadPayload: loadPayload
  };

  /* UMD-lite: 브라우저에선 window 전역, Node(node --test)에선 CommonJS export. */
  if (typeof window !== 'undefined') {
    window.SpacDataLoader = SpacDataLoader;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpacDataLoader;
  }
})();
