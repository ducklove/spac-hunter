/* SpacChartTooltip: 차트 호버 툴팁 순수 로직 (일반 스크립트, file:// 호환).
   브라우저에선 format.js(window.SpacFormat) 로드 이후에 로드되어야 하고,
   Node(node --test)에선 CommonJS로 로드된다. DOM 의존 없음 — 좌표·라벨 계산만 담당. */
(function() {
  'use strict';

  const F = typeof window !== 'undefined'
    ? (window.SpacFormat || {})
    : require('./format.js');

  /* 오름차순 x 좌표 배열에서 targetX에 가장 가까운 인덱스(이진 탐색).
     빈 배열이면 -1, 같은 거리면 앞쪽(작은) 인덱스를 돌려준다. */
  function nearestIndex(xs, targetX) {
    if (!Array.isArray(xs) || !xs.length) return -1;
    let low = 0;
    let high = xs.length - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (xs[mid] < targetX) low = mid + 1;
      else high = mid;
    }
    if (low === 0) return 0;
    const prev = low - 1;
    return Math.abs(xs[low] - targetX) < Math.abs(xs[prev] - targetX) ? low : prev;
  }

  /* 툴팁 배치(캔버스 CSS 픽셀 좌표계): 기본은 포인트 우측 위.
     우측 공간이 없으면 좌측으로, 위 공간이 없으면 아래로 뒤집고
     차트 경계 안쪽(edge=4px)으로 클램프한다. */
  function tooltipPosition(pointX, pointY, tooltipWidth, tooltipHeight, chartWidth, chartHeight, gap) {
    const margin = gap == null ? 12 : gap;
    const edge = 4;
    let left = pointX + margin;
    if (left + tooltipWidth > chartWidth - edge) left = pointX - margin - tooltipWidth;
    if (left < edge) left = edge;
    let top = pointY - tooltipHeight - margin;
    if (top < edge) top = pointY + margin;
    if (top + tooltipHeight > chartHeight - edge) top = Math.max(edge, chartHeight - tooltipHeight - edge);
    return { left, top };
  }

  function countText(value) {
    const text = F.number(value);
    return text === '-' ? '-' : `${text}개`;
  }

  function wonText(value) {
    const text = F.money(value);
    return text === '-' ? '-' : `${text}원`;
  }

  /* ratio 차트(현재가/공모가) 툴팁 내용: { date, rows: [[라벨, 값]] } */
  function ratioTooltipContent(point) {
    const p = point || {};
    return {
      date: F.dateText(p.date),
      rows: [
        ['가격 비율', F.ratio(p.ratio)],
        ['종가', wonText(p.close)]
      ]
    };
  }

  /* 공모가 미만 종목수 추이 차트 툴팁 내용: { date, rows: [[라벨, 값]] } */
  function belowTooltipContent(point) {
    const p = point || {};
    return {
      date: F.dateText(p.date),
      rows: [
        ['공모가 미만', countText(p.belowCount)],
        ['전체', countText(p.totalCount)],
        ['비중', F.pct(p.belowPct)]
      ]
    };
  }

  const SpacChartTooltip = {
    nearestIndex,
    tooltipPosition,
    ratioTooltipContent,
    belowTooltipContent
  };

  /* UMD-lite: 브라우저에선 window 전역, Node(node --test)에선 CommonJS export. */
  if (typeof window !== 'undefined') {
    window.SpacChartTooltip = SpacChartTooltip;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpacChartTooltip;
  }
})();
