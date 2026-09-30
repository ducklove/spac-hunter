// 일부 Node 22.x 빌드는 `node --test tests/js`의 디렉터리 인자를 테스트 검색 대신
// 엔트리 모듈로 실행한다(디렉터리 → index.js 해석). 이 셤은 그 경우에도 모든 테스트가
// 실행되도록 이 디렉터리의 *.test.mjs를 전부 동적 import 한다(목록을 손으로 관리하면
// 새 파일이 빠진다 — price-chart.test.mjs가 그렇게 CI에서 빠져 있었다).
// 디렉터리 검색이 정상 동작하는 빌드에서는 *.test.mjs 패턴만 수집되므로 이 파일은 무시된다.
const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

for (const name of readdirSync(__dirname).filter(file => file.endsWith('.test.mjs')).sort()) {
  import(pathToFileURL(join(__dirname, name)).href);
}
