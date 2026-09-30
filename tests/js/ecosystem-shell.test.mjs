// Value Compass 생태계 셸 채택 계약: 벤더링 파일, 마커, 태그 순서, 앱 연동 훅.
// 벤더링 파일은 value-invest/scripts/sync-ecosystem.mjs --write 로만 갱신한다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const path = relative => fileURLToPath(new URL('../../' + relative, import.meta.url));
const read = relative => readFileSync(path(relative), 'utf8');
const html = read('index.html');
const app = read('assets/app.js');
const css = read('assets/style.css');
const HELD_BADGES_VERSION = '20260930-vc'; // value-invest config/ecosystem.json heldBadges.version

test('벤더링된 셸·토큰·발행 헬퍼가 있고 직접 수정 금지 헤더를 유지한다', () => {
  const shell = read('assets/vc-shell.js');
  assert.match(shell, /^\/\* vc-shell\.js v\d+\.\d+\.\d+ /);
  assert.match(shell, /vc:registry:start \*\/ \{.*"id":"spac-hunter"/);
  assert.match(read('assets/vc-tokens.css'), /--vc-up:[^;]+;[\s\S]*--vc-down:/);
  assert.ok(existsSync(path('spac_hunter/vc_publish.py')));
});

test('head: theme-boot 마커가 한 번, 모든 스타일시트보다 먼저 온다', () => {
  const blocks = html.match(/<!-- vc:theme-boot -->[\s\S]*?<!-- \/vc:theme-boot -->/g) || [];
  assert.equal(blocks.length, 1);
  const boot = html.indexOf('<!-- vc:theme-boot -->');
  const firstStyle = Math.min(
    ...['<style', '<link rel="stylesheet"'].map(tag => html.indexOf(tag)).filter(index => index >= 0)
  );
  assert.ok(boot < firstStyle, 'theme-boot must precede every stylesheet');
  assert.match(blocks[0], /spac-hunter-theme/, '구 키 마이그레이션은 boot 블록이 맡는다');
  assert.doesNotMatch(html, /\/\/ iframe embed \+ theme/, '자체 pre-paint 스크립트는 제거됐다');
});

test('head: vc-tokens.css가 style.css보다 먼저, vc-shell.js는 defer로 로드된다', () => {
  const tokens = html.indexOf('href="./assets/vc-tokens.css?v=');
  const own = html.indexOf('href="assets/style.css?v=');
  assert.ok(tokens > 0 && own > tokens, 'vc-tokens.css before style.css');
  assert.match(html, /<script defer src="\.\/assets\/vc-shell\.js\?v=[\w-]+"><\/script>/);
  assert.match(
    html,
    new RegExp(`portfolio-held-badges\\.js\\?v=${HELD_BADGES_VERSION}"`),
    '보유 배지 ?v=는 레지스트리 heldBadges.version과 같다'
  );
});

test('body 맨 위에 <vc-shell tool="spac-hunter">가 허브 링크 폴백을 품는다', () => {
  assert.match(
    html,
    /<body>\s*<vc-shell tool="spac-hunter"><a class="hub-link" href="https:\/\/ducklove\.duckdns\.org:3691" rel="noopener">Value Compass ↗<\/a><\/vc-shell>\s*<header class="app-header">/
  );
  const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
  assert.doesNotMatch(header, /hub-link/, '헤더의 수제 허브 링크는 셸이 대체한다');
  assert.match(header, /id="themeBtn"/, '도구 자체 테마 토글은 유지한다');
});

test('app.js: 테마 토글은 VCShell.setTheme을 쓰고 vc:themechange에 캔버스를 다시 그린다', () => {
  const start = app.indexOf("getElementById('themeBtn').addEventListener");
  const toggle = app.slice(start, app.indexOf("getElementById('refreshViewBtn').addEventListener", start));
  assert.match(toggle, /window\.VCShell\.setTheme\(next\)/);
  assert.match(toggle, /localStorage\.setItem\('theme', next\)/, '셸이 없을 때의 폴백 유지');
  assert.match(app, /addEventListener\('vc:themechange', \(\) => redrawCanvases\(\)\)/);
});

test('app.js: 상세 선택 종목을 VCShell.setStock으로 알린다(해제는 null)', () => {
  assert.match(app, /function renderSelected\(\) \{\s*const item = selectedSpac\(\);\s*syncShellStock\(item\);/);
  assert.match(app, /shell\.setStock\(code \|\| null, name \|\| null\)/);
  assert.match(app, /addEventListener\('DOMContentLoaded', \(\) => syncShellStock\(selectedSpac\(\)\)\)/);
});

test('style.css: 방향색과 본문 폰트만 vc 토큰에 alias 한다', () => {
  assert.match(css, /--red: var\(--vc-up, #c4483e\);/);
  assert.match(css, /--blue: var\(--vc-down, #2563eb\);/);
  assert.match(css, /--red: var\(--vc-up, #f06f67\);/);
  assert.match(css, /font-family: var\(--vc-font-sans, /);
  assert.match(css, /--accent: #0b7285;/, '도구 accent(teal)는 그대로');
});

/* ---- theme-boot 블록 행위 (vm으로 실제 인라인 스크립트 실행) ---- */

function runBoot({ search = '', storage = {}, dark = false } = {}) {
  const script = html.match(/<!-- vc:theme-boot --><script>([\s\S]*?)<\/script><!-- \/vc:theme-boot -->/)[1];
  const attrs = {};
  const store = { ...storage };
  const context = {
    location: { search },
    URLSearchParams,
    document: { documentElement: { setAttribute: (key, value) => { attrs[key] = String(value); } } },
    localStorage: {
      getItem: key => (key in store ? store[key] : null),
      setItem: (key, value) => { store[key] = String(value); }
    },
    window: { matchMedia: () => ({ matches: dark }) }
  };
  vm.runInNewContext(script, context);
  return { attrs, store };
}

test('theme-boot: ?theme은 적용만 하고 저장하지 않는다', () => {
  const { attrs, store } = runBoot({ search: '?theme=dark', storage: { theme: 'light' } });
  assert.equal(attrs['data-theme'], 'dark');
  assert.equal(store.theme, 'light');
});

test('theme-boot: 구 키 spac-hunter-theme을 공용 theme 키로 옮긴다', () => {
  const { attrs, store } = runBoot({ storage: { 'spac-hunter-theme': 'dark' } });
  assert.equal(attrs['data-theme'], 'dark');
  assert.equal(store.theme, 'dark');
});

test('theme-boot: 저장값이 없으면 prefers-color-scheme을 따른다', () => {
  assert.equal(runBoot({ dark: true }).attrs['data-theme'], 'dark');
  assert.equal(runBoot({ dark: false }).attrs['data-theme'], 'light');
});

test('theme-boot: ?embed(0/false 제외)는 html[data-embed]를 켠다', () => {
  assert.ok('data-embed' in runBoot({ search: '?embed=1' }).attrs);
  assert.ok('data-embed' in runBoot({ search: '?embed' }).attrs);
  assert.ok(!('data-embed' in runBoot({ search: '?embed=0' }).attrs));
  assert.match(html, /html\[data-embed\] \.app-header/);
});
