// node --test tests/js 로 실행. classic script(assets/format.js)를 CommonJS로 로드한다.
// getCss는 document(getComputedStyle) 의존이라 브라우저 전용 — 여기서는 다루지 않는다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fmt = require('../../assets/format.js');

test('money/number: ko-KR 천 단위 콤마, 비수치는 -', () => {
  assert.equal(fmt.money(1234567), '1,234,567');
  assert.equal(fmt.money(0), '0');
  assert.equal(fmt.money(-9876), '-9,876');
  assert.equal(fmt.money('12345'), '12,345'); // 숫자 문자열 허용
  assert.equal(fmt.money(1e12), '1,000,000,000,000'); // 조 단위도 콤마만
  assert.equal(fmt.money(null), '-');
  assert.equal(fmt.money(undefined), '-');
  assert.equal(fmt.money(NaN), '-');
  assert.equal(fmt.money('abc'), '-');
  assert.equal(fmt.number(2500), '2,500');
  assert.equal(fmt.number(null), '-');
  assert.equal(fmt.number(NaN), '-');
});

test('ratio: 소수 3자리 + x 접미사', () => {
  assert.equal(fmt.ratio(1), '1.000x');
  assert.equal(fmt.ratio(0.9876), '0.988x');
  assert.equal(fmt.ratio(2), '2.000x');
  assert.equal(fmt.ratio(-0.5), '-0.500x');
  assert.equal(fmt.ratio(0), '0.000x');
  assert.equal(fmt.ratio(null), '-');
  assert.equal(fmt.ratio(NaN), '-');
});

test('pct: 기본 소수 2자리 %, digits 지정 가능', () => {
  assert.equal(fmt.pct(12.3), '12.30%');
  assert.equal(fmt.pct(0), '0.00%');
  assert.equal(fmt.pct(-5), '-5.00%');
  assert.equal(fmt.pct('7.5'), '7.50%'); // 숫자 문자열 허용
  assert.equal(fmt.pct(3.14159, 1), '3.1%');
  assert.equal(fmt.pct(50, 0), '50%');
  assert.equal(fmt.pct(null), '-');
  assert.equal(fmt.pct(undefined), '-');
  assert.equal(fmt.pct(NaN), '-');
});

test('signedPct: 양수만 + 접두, 0은 부호 없음', () => {
  assert.equal(fmt.signedPct(2.5), '+2.50%');
  assert.equal(fmt.signedPct(-1.2), '-1.20%');
  assert.equal(fmt.signedPct(0), '0.00%');
  assert.equal(fmt.signedPct(0.004), '+0.00%'); // 미세 양수도 + (데드밴드 없음: 현 동작 고정)
  assert.equal(fmt.signedPct(1.25, 1), '+1.3%');
  assert.equal(fmt.signedPct(null), '-');
  assert.equal(fmt.signedPct(NaN), '-');
});

test('daysText: 음수는 경과 표기', () => {
  assert.equal(fmt.daysText(30), '30일');
  assert.equal(fmt.daysText(0), '0일');
  assert.equal(fmt.daysText(-5), '5일 경과');
  assert.equal(fmt.daysText(null), '-');
  assert.equal(fmt.daysText(NaN), '-');
});

test('dateText: 앞 10글자(YYYY-MM-DD)만, falsy는 -', () => {
  assert.equal(fmt.dateText('2026-07-11T15:30:00'), '2026-07-11');
  assert.equal(fmt.dateText('2026-07-11'), '2026-07-11');
  assert.equal(fmt.dateText(null), '-');
  assert.equal(fmt.dateText(''), '-');
  assert.equal(fmt.dateText(0), '-');
});

test('directionClass: 부호별 클래스, lowerIsGood 반전', () => {
  assert.equal(fmt.directionClass(5), 'positive');
  assert.equal(fmt.directionClass(-5), 'negative');
  assert.equal(fmt.directionClass(0), '');
  assert.equal(fmt.directionClass(null), '');
  assert.equal(fmt.directionClass(NaN), '');
  assert.equal(fmt.directionClass(-2, true), 'good');
  assert.equal(fmt.directionClass(3, true), 'danger');
  assert.equal(fmt.directionClass(0, true), '');
});

test('badgeClass: 라벨 키워드 → 색상, 판정 순서 고정', () => {
  assert.equal(fmt.badgeClass('공모가 이하'), 'red');
  assert.equal(fmt.badgeClass('청산 임박'), 'red');
  assert.equal(fmt.badgeClass('해산사유 발생'), 'red');
  assert.equal(fmt.badgeClass('1.01x 근접'), 'amber');
  assert.equal(fmt.badgeClass('합병 확정'), 'blue');
  assert.equal(fmt.badgeClass('일반'), 'green');
  assert.equal(fmt.badgeClass('신규 상장'), '');
  assert.equal(fmt.badgeClass('합병 근접'), 'amber'); // 근접이 합병보다 먼저 판정
});

test('escapeHtml: & < > " \' 모두 이스케이프, null/undefined는 빈 문자열', () => {
  assert.equal(
    fmt.escapeHtml('<a href="x">&\'</a>'),
    '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;'
  );
  assert.equal(fmt.escapeHtml('삼성스팩 & 유진스팩'), '삼성스팩 &amp; 유진스팩');
  assert.equal(fmt.escapeHtml(null), '');
  assert.equal(fmt.escapeHtml(undefined), '');
  assert.equal(fmt.escapeHtml(123), '123');
  assert.equal(fmt.escapeHtml('plain'), 'plain');
});

test('formatTradingValue: 1억 이상 억(소수1), 1만 이상 만(반올림+콤마), 그 외 콤마', () => {
  assert.equal(fmt.formatTradingValue(250000000), '2.5억');
  assert.equal(fmt.formatTradingValue(100000000), '1.0억');
  assert.equal(fmt.formatTradingValue(1234500000), '12.3억');
  assert.equal(fmt.formatTradingValue(99999999), '10,000만'); // 억 미만은 만 단위 반올림
  assert.equal(fmt.formatTradingValue(55000), '6만');
  assert.equal(fmt.formatTradingValue(10000), '1만');
  assert.equal(fmt.formatTradingValue(9999), '9,999');
  assert.equal(fmt.formatTradingValue(0), '0');
  assert.equal(fmt.formatTradingValue(-50000), '-50,000'); // 음수는 단위 축약 없음
  assert.equal(fmt.formatTradingValue(null), '-');
  assert.equal(fmt.formatTradingValue(NaN), '-');
});

test('signedCount: 양수 +N개, 0은 0개', () => {
  assert.equal(fmt.signedCount(3), '+3개');
  assert.equal(fmt.signedCount(-2), '-2개');
  assert.equal(fmt.signedCount(0), '0개');
  assert.equal(fmt.signedCount(null), '-');
  assert.equal(fmt.signedCount(NaN), '-');
});

test('daysMetric: 반올림 + 콤마 + 일 접미사', () => {
  assert.equal(fmt.daysMetric(1234.6), '1,235일');
  assert.equal(fmt.daysMetric(0), '0일');
  assert.equal(fmt.daysMetric(10000), '10,000일');
  assert.equal(fmt.daysMetric(null), '-');
  assert.equal(fmt.daysMetric(NaN), '-');
});

test('colorWithAlpha: hex(3/6자리) → rgba, 그 외 원본 유지', () => {
  assert.equal(fmt.colorWithAlpha('#ff0000', 0.5), 'rgba(255, 0, 0, 0.5)');
  assert.equal(fmt.colorWithAlpha('#123456', 1), 'rgba(18, 52, 86, 1)');
  assert.equal(fmt.colorWithAlpha('#0af', 0.2), 'rgba(0, 170, 255, 0.2)'); // 3자리는 자릿수 복제
  assert.equal(fmt.colorWithAlpha('rgb(1, 2, 3)', 0.5), 'rgb(1, 2, 3)');
  assert.equal(fmt.colorWithAlpha('var(--accent)', 0.3), 'var(--accent)');
});
