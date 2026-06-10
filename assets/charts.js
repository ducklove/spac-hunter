/* SpacCharts: 캔버스 차트 공용 헬퍼 + 차트 렌더러 (일반 스크립트, file:// 호환).
   format.js(window.SpacFormat) 로드 이후에 로드되어야 한다. */
(function() {
  'use strict';

  const F = window.SpacFormat || {};
  const getCss = name => F.getCss(name);
  const colorWithAlpha = (color, alpha) => F.colorWithAlpha(color, alpha);

  const FONT_LABEL = '11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  const FONT_EMPTY = '13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';

  /* dpr 스케일을 적용해 캔버스를 초기화하고 CSS 픽셀 기준 컨텍스트를 돌려준다. */
  function setupCanvas(canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    return { ctx, width: rect.width, height: rect.height };
  }

  function drawEmptyMessage(ctx, message, x, y) {
    ctx.fillStyle = getCss('--muted');
    ctx.font = FONT_EMPTY;
    ctx.fillText(message, x, y);
  }

  /* 수평 그리드 라인 + 좌측 축 라벨. entries: [{ y, label }] */
  function drawGridLines(ctx, entries, x0, x1, labelX) {
    ctx.strokeStyle = getCss('--chart-grid');
    ctx.lineWidth = 1;
    ctx.fillStyle = getCss('--muted');
    ctx.font = FONT_LABEL;
    entries.forEach(entry => {
      ctx.beginPath();
      ctx.moveTo(x0, entry.y);
      ctx.lineTo(x1, entry.y);
      ctx.stroke();
      ctx.fillText(entry.label, labelX, entry.y + 4);
    });
  }

  function drawDashedLine(ctx, x0, x1, y, color, pattern, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth == null ? 1 : lineWidth;
    ctx.setLineDash(pattern);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* pts: [{ x, y }] 폴리라인 */
  function drawLine(ctx, pts, color, lineWidth) {
    ctx.beginPath();
    pts.forEach((pt, index) => {
      if (index === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  /* 라인 아래 영역을 상->하 그라디언트(0.22 -> 0.02 알파)로 채운다. */
  function drawAreaFill(ctx, pts, topY, bottomY, color) {
    const gradient = ctx.createLinearGradient(0, topY, 0, bottomY);
    gradient.addColorStop(0, colorWithAlpha(color, 0.22));
    gradient.addColorStop(1, colorWithAlpha(color, 0.02));
    ctx.beginPath();
    pts.forEach((pt, index) => {
      if (index === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.lineTo(pts[pts.length - 1].x, bottomY);
    ctx.lineTo(pts[0].x, bottomY);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function drawEndDot(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  /* 차트 하단 좌/우 날짜 라벨(우측은 우측 정렬). */
  function drawEdgeDateLabels(ctx, leftText, rightText, leftX, rightEdgeX, y) {
    ctx.fillStyle = getCss('--muted');
    ctx.fillText(leftText, leftX, y);
    ctx.fillText(rightText, rightEdgeX - ctx.measureText(rightText).width, y);
  }

  /* date/ratio가 있는 포인트만 남긴다. */
  function validRatioPoints(history) {
    return (history || []).filter(point => point && point.date && point.ratio != null);
  }

  /* 마지막 포인트 기준 최근 N일 구간만 남긴다. days <= 0 이면 전체. */
  function recentPoints(points, days) {
    if (!days || days <= 0 || !points.length) return points.slice();
    const latest = new Date(points[points.length - 1].date).getTime();
    const cutoff = latest - days * 86400000;
    return points.filter(point => new Date(point.date).getTime() >= cutoff);
  }

  /* 스파크라인용 최근 N일(기본 90일) ratio 포인트. */
  function sparklinePoints(history, days) {
    return recentPoints(validRatioPoints(history), days == null ? 90 : days);
  }

  /* 상세 패널 메인 차트: 현재가/공모가 비율 라인 + 1.00x 점선 + 영역 채우기. */
  function drawRatioChart(canvas, item, chartDays) {
    const env = setupCanvas(canvas);
    if (!env) return;
    const ctx = env.ctx;
    const points = recentPoints(validRatioPoints(item && item.history), chartDays);

    if (points.length < 2) {
      drawEmptyMessage(ctx, '차트를 그릴 히스토리가 부족합니다.', 18, 36);
      return;
    }

    const pad = { left: 48, right: 18, top: 18, bottom: 30 };
    const w = env.width - pad.left - pad.right;
    const h = env.height - pad.top - pad.bottom;
    const values = points.map(point => Number(point.ratio));
    const min = Math.min(0.985, ...values, 1) - 0.004;
    const max = Math.max(1.035, ...values, 1) + 0.004;
    const yFor = value => pad.top + (max - value) / (max - min) * h;
    const xFor = index => pad.left + index / (points.length - 1) * w;
    const pts = points.map((point, index) => ({ x: xFor(index), y: yFor(Number(point.ratio)) }));

    drawGridLines(
      ctx,
      [min, 1, max].map(value => ({ y: yFor(value), label: value.toFixed(3) })),
      pad.left,
      pad.left + w,
      4
    );
    drawDashedLine(ctx, pad.left, pad.left + w, yFor(1), getCss('--ipo-line'), [5, 5]);

    const lineColor = getCss('--ratio-line');
    drawAreaFill(ctx, pts, pad.top, pad.top + h, lineColor);
    drawLine(ctx, pts, lineColor, 2.4);
    drawEndDot(ctx, pts[pts.length - 1].x, pts[pts.length - 1].y, lineColor);
    drawEdgeDateLabels(
      ctx,
      String(points[0].date).slice(5),
      String(points[points.length - 1].date).slice(5),
      pad.left,
      env.width - pad.right,
      env.height - 8
    );
  }

  /* 시장 통계: 공모가 미만 종목수 추이 라인 차트. */
  function drawBelowTrendChart(canvas, points) {
    const env = setupCanvas(canvas);
    if (!env) return;
    const ctx = env.ctx;

    if (!points || points.length < 2) {
      drawEmptyMessage(ctx, '추이를 그릴 데이터가 부족합니다.', 16, 34);
      return;
    }

    const pad = { left: 42, right: 14, top: 14, bottom: 26 };
    const w = env.width - pad.left - pad.right;
    const h = env.height - pad.top - pad.bottom;
    const max = Math.max(1, ...points.map(point => point.belowCount));
    const yFor = value => pad.top + (max - value) / max * h;
    const xFor = index => pad.left + index / (points.length - 1) * w;
    const pts = points.map((point, index) => ({ x: xFor(index), y: yFor(point.belowCount) }));

    drawGridLines(
      ctx,
      [0, Math.ceil(max / 2), max].map(value => ({ y: yFor(value), label: String(value) })),
      pad.left,
      pad.left + w,
      8
    );

    const lineColor = getCss('--red');
    drawLine(ctx, pts, lineColor, 2.4);
    drawEndDot(ctx, pts[pts.length - 1].x, pts[pts.length - 1].y, lineColor);
    drawEdgeDateLabels(
      ctx,
      String(points[0].date).slice(5),
      String(points[points.length - 1].date).slice(5),
      pad.left,
      env.width - pad.right,
      env.height - 7
    );
  }

  /* 종목 비교 테이블 스파크라인: 최근 90일 ratio 라인 + 1.00x 기준 점선.
     points는 sparklinePoints()로 미리 거른 배열을 받는다. */
  function drawSparkline(canvas, points) {
    const env = setupCanvas(canvas);
    if (!env) return;
    if (!points || points.length < 2) return;
    const ctx = env.ctx;
    const padX = 2;
    const padY = 3;
    const w = env.width - padX * 2;
    const h = env.height - padY * 2;
    const values = points.map(point => Number(point.ratio));
    let min = Math.min(...values, 1);
    let max = Math.max(...values, 1);
    if (max - min < 0.0001) {
      min -= 0.01;
      max += 0.01;
    }
    const yFor = value => padY + (max - value) / (max - min) * h;
    const xFor = index => padX + index / (points.length - 1) * w;

    drawDashedLine(ctx, padX, padX + w, yFor(1), getCss('--ipo-line'), [3, 3]);
    drawLine(
      ctx,
      points.map((point, index) => ({ x: xFor(index), y: yFor(Number(point.ratio)) })),
      getCss('--ratio-line'),
      1.4
    );
  }

  window.SpacCharts = {
    setupCanvas,
    drawEmptyMessage,
    drawGridLines,
    drawDashedLine,
    drawLine,
    drawAreaFill,
    drawEndDot,
    drawEdgeDateLabels,
    validRatioPoints,
    recentPoints,
    sparklinePoints,
    drawRatioChart,
    drawBelowTrendChart,
    drawSparkline
  };
})();
