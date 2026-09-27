import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

function render(history, days = 0, width = 360) {
  const strokes = [], labels = [];
  let path = [], dash = [];
  const ctx = {
    setTransform() {}, clearRect() {}, beginPath() { path = []; },
    moveTo(x, y) { path.push([x, y]); }, lineTo(x, y) { path.push([x, y]); },
    setLineDash(value) { dash = value; },
    stroke() { strokes.push({ color: this.strokeStyle, path: [...path], dash: [...dash] }); },
    fillText(text) { labels.push(text); }, measureText(text) { return { width: text.length * 7 }; },
    arc() {}, fill() {},
  };
  const canvas = { getContext: () => ctx, getBoundingClientRect: () => ({ width, height: 300 }) };
  const window = { SpacFormat: { getCss: name => name }, SpacChartTooltip: {
    axisTickIndexes: n => n === 1 ? [0] : [0, n - 1], priceTooltipContent: p => p,
  } };
  vm.runInNewContext(readFileSync(new URL('../../assets/charts.js', import.meta.url), 'utf8'), { window });
  window.SpacCharts.drawPriceChart(canvas, history, days);
  return { canvas, labels, lines: strokes.filter(s => ['--ratio-line', '--ipo-line'].includes(s.color)) };
}

test('two prices share a won axis, with a changing dashed liquidation series', () => {
  const result = render([
    { date: '2026-09-01', close: 1950, liquidationValue: 2000 },
    { date: '2026-09-02', close: 2100, liquidationValue: 2001 },
  ]);
  assert.equal(result.lines.length, 2);
  const [liquidation, price] = result.lines;
  assert.deepEqual(liquidation.dash, [5, 4]);
  assert.deepEqual(price.dash, []);
  assert.ok(price.path[0][1] > liquidation.path[0][1]);
  assert.ok(price.path[1][1] < liquidation.path[1][1]);
  assert.ok(liquidation.path[1][1] < liquidation.path[0][1]);
  assert.equal(result.labels.filter(s => s.endsWith('원')).length, 5);
  for (const line of result.lines) for (const [x, y] of line.path) {
    assert.ok(x >= 0 && x <= 360 && y >= 18 && y <= 270);
  }
});

test('period filtering and a single equal-price point yield finite coordinates', () => {
  const result = render([
    { date: '2025-01-01', close: 9999, liquidationValue: 2000 },
    { date: '2026-09-01', close: 2000, liquidationValue: 2000 },
    { date: '2026-09-02', close: null, liquidationValue: 2000 },
  ], 30);
  assert.equal(result.canvas.__spacHoverModel.pts.length, 1);
  for (const line of result.lines) assert.ok(line.path.flat().every(Number.isFinite));
  assert.equal(result.lines[0].path[0][1], result.lines[1].path[0][1]);
  assert.equal(render([]).canvas.__spacHoverModel, null);
});
