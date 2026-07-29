import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = relative => readFileSync(fileURLToPath(new URL('../../' + relative, import.meta.url)), 'utf8');
const html = read('index.html');
const app = read('assets/app.js');
const css = read('assets/style.css');

test('검색과 선택형 필터는 접근 가능한 이름·상태를 제공한다', () => {
  assert.match(html, /id="searchInput"[^>]*aria-label="스팩 종목 검색"/);
  assert.match(html, /data-days="90" aria-pressed="true"/);
  assert.match(app, /aria-pressed="\$\{filterMode === item\.id/);
  assert.match(app, /setAttribute\('aria-pressed', String\(active\)\)/);
});

test('모바일 터치 영역과 전체 모션 축소를 제공한다', () => {
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation-duration:\s*0\.01ms/);
});
