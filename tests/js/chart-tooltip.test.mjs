// node --test tests/js 로 실행. classic script(assets/chart-tooltip.js)를 CommonJS로 로드한다.
// DOM 배선(charts.js)은 브라우저 전용 — 여기서는 순수 좌표·라벨 로직만 다룬다.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tt = require('../../assets/chart-tooltip.js');

test('nearestIndex: 빈 배열/비배열은 -1', () => {
  assert.equal(tt.nearestIndex([], 10), -1);
  assert.equal(tt.nearestIndex(null, 10), -1);
  assert.equal(tt.nearestIndex(undefined, 10), -1);
});

test('nearestIndex: 원소 1개면 항상 0', () => {
  assert.equal(tt.nearestIndex([50], 0), 0);
  assert.equal(tt.nearestIndex([50], 50), 0);
  assert.equal(tt.nearestIndex([50], 999), 0);
});

test('nearestIndex: 범위 밖(앞/뒤)은 첫/마지막 인덱스로 클램프', () => {
  const xs = [10, 20, 30, 40];
  assert.equal(tt.nearestIndex(xs, -100), 0);
  assert.equal(tt.nearestIndex(xs, 9.999), 0);
  assert.equal(tt.nearestIndex(xs, 40.001), 3);
  assert.equal(tt.nearestIndex(xs, 1e9), 3);
});

test('nearestIndex: 정확히 일치·중간값은 가장 가까운 쪽', () => {
  const xs = [10, 20, 30];
  assert.equal(tt.nearestIndex(xs, 20), 1); // 정확히 일치
  assert.equal(tt.nearestIndex(xs, 14), 0); // 10에 더 가깝다
  assert.equal(tt.nearestIndex(xs, 16), 1); // 20에 더 가깝다
  assert.equal(tt.nearestIndex(xs, 26), 2); // 30에 더 가깝다
});

test('nearestIndex: 같은 거리(정중앙)는 앞쪽 인덱스', () => {
  assert.equal(tt.nearestIndex([10, 20], 15), 0);
  assert.equal(tt.nearestIndex([10, 20, 30], 25), 1);
});

test('tooltipPosition: 공간이 넉넉하면 포인트 우측 위 (gap 기본 12)', () => {
  const pos = tt.tooltipPosition(100, 100, 120, 50, 600, 200);
  assert.deepEqual(pos, { left: 112, top: 38 });
});

test('tooltipPosition: 우측 공간 부족 시 좌측으로 뒤집기', () => {
  const pos = tt.tooltipPosition(550, 100, 120, 50, 600, 200);
  assert.deepEqual(pos, { left: 550 - 12 - 120, top: 38 });
});

test('tooltipPosition: 상단 공간 부족 시 포인트 아래로', () => {
  const pos = tt.tooltipPosition(100, 20, 120, 50, 600, 200);
  assert.deepEqual(pos, { left: 112, top: 32 });
});

test('tooltipPosition: 좌/하단 경계는 4px 안쪽으로 클램프', () => {
  // 좌측: 뒤집은 결과가 음수여도 최소 4
  const left = tt.tooltipPosition(5, 100, 120, 50, 100, 200);
  assert.equal(left.left, 4);
  // 하단: 아래로 뒤집은 툴팁이 차트 밖으로 나가면 끌어올린다
  const bottom = tt.tooltipPosition(100, 30, 120, 180, 600, 200);
  assert.equal(bottom.top, 200 - 180 - 4);
});

test('tooltipPosition: gap 인자 지정 시 반영', () => {
  const pos = tt.tooltipPosition(100, 100, 100, 40, 600, 300, 20);
  assert.deepEqual(pos, { left: 120, top: 40 });
});

test('ratioTooltipContent: 날짜·비율·종가 포맷', () => {
  const content = tt.ratioTooltipContent({ date: '2026-06-19', close: 1970, ratio: 0.985, volume: 1 });
  assert.equal(content.date, '2026-06-19');
  assert.deepEqual(content.rows, [
    ['가격 비율', '0.985x'],
    ['종가', '1,970원']
  ]);
});

test('ratioTooltipContent: 누락 필드·null 포인트는 -', () => {
  assert.deepEqual(tt.ratioTooltipContent({ date: '2026-06-19', ratio: 1.001 }), {
    date: '2026-06-19',
    rows: [['가격 비율', '1.001x'], ['종가', '-']]
  });
  assert.deepEqual(tt.ratioTooltipContent(null), {
    date: '-',
    rows: [['가격 비율', '-'], ['종가', '-']]
  });
});

test('belowTooltipContent: 종목수·전체·비중 포맷', () => {
  const content = tt.belowTooltipContent({
    date: '2025-11-21', totalCount: 51, belowCount: 9, nearCount: 16, belowPct: 17.65
  });
  assert.equal(content.date, '2025-11-21');
  assert.deepEqual(content.rows, [
    ['공모가 미만', '9개'],
    ['전체', '51개'],
    ['비중', '17.65%']
  ]);
});

test('belowTooltipContent: 0개는 0개, 누락은 -', () => {
  const zero = tt.belowTooltipContent({ date: '2025-11-21', totalCount: 51, belowCount: 0, belowPct: 0 });
  assert.deepEqual(zero.rows, [['공모가 미만', '0개'], ['전체', '51개'], ['비중', '0.00%']]);
  assert.deepEqual(tt.belowTooltipContent({}), {
    date: '-',
    rows: [['공모가 미만', '-'], ['전체', '-'], ['비중', '-']]
  });
});

test('axisTickIndexes: 빈/단일 포인트', () => {
  assert.deepEqual(tt.axisTickIndexes(0, 300), []);
  assert.deepEqual(tt.axisTickIndexes(-3, 300), []);
  assert.deepEqual(tt.axisTickIndexes(1, 300), [0]);
});

test('axisTickIndexes: 첫·마지막 인덱스는 항상 포함', () => {
  [2, 5, 30, 155, 400].forEach(count => {
    [40, 120, 350, 900].forEach(width => {
      const ticks = tt.axisTickIndexes(count, width);
      assert.equal(ticks[0], 0, `count=${count} width=${width}`);
      assert.equal(ticks[ticks.length - 1], count - 1, `count=${count} width=${width}`);
    });
  });
});

test('axisTickIndexes: 오름차순·중복 없음·개수는 2~7', () => {
  [2, 3, 8, 155].forEach(count => {
    [50, 300, 1200, 5000].forEach(width => {
      const ticks = tt.axisTickIndexes(count, width);
      assert.ok(ticks.length >= 2 && ticks.length <= 7, `len=${ticks.length}`);
      assert.equal(new Set(ticks).size, ticks.length, '중복 없음');
      ticks.forEach((value, i) => {
        if (i) assert.ok(value > ticks[i - 1], '오름차순');
        assert.ok(value >= 0 && value < count, '범위 내');
      });
    });
  });
});

test('axisTickIndexes: 폭이 넓을수록 눈금이 늘고 좁으면 양 끝만', () => {
  assert.deepEqual(tt.axisTickIndexes(101, 40), [0, 100]);
  assert.deepEqual(tt.axisTickIndexes(101, 160, 74), [0, 50, 100]);
  assert.equal(tt.axisTickIndexes(101, 1000, 74).length, 7);
  assert.ok(tt.axisTickIndexes(101, 400).length > tt.axisTickIndexes(101, 150).length);
});

test('axisTickIndexes: 포인트가 적으면 포인트 수를 넘지 않는다', () => {
  assert.deepEqual(tt.axisTickIndexes(2, 900), [0, 1]);
  assert.deepEqual(tt.axisTickIndexes(3, 900), [0, 1, 2]);
});
