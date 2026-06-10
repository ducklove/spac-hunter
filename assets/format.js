/* SpacFormat: 공용 포맷팅 헬퍼 (일반 스크립트, file:// 호환). */
(function() {
  'use strict';

  function money(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    return `${Number(value).toLocaleString('ko-KR')}원`;
  }

  function number(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    return Number(value).toLocaleString('ko-KR');
  }

  function ratio(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    return `${Number(value).toFixed(3)}x`;
  }

  function pct(value, digits = 2) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    return `${Number(value).toFixed(digits)}%`;
  }

  function signedPct(value, digits = 2) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    const sign = Number(value) > 0 ? '+' : '';
    return `${sign}${Number(value).toFixed(digits)}%`;
  }

  function daysText(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    if (value < 0) return `${Math.abs(value)}일 경과`;
    return `${value}일`;
  }

  function dateText(value) {
    if (!value) return '-';
    return String(value).slice(0, 10);
  }

  function directionClass(value, lowerIsGood = false) {
    if (value == null || Number.isNaN(Number(value))) return '';
    const numeric = Number(value);
    if (numeric === 0) return '';
    if (lowerIsGood) return numeric < 0 ? 'good' : 'danger';
    return numeric > 0 ? 'positive' : 'negative';
  }

  function badgeClass(label) {
    if (label.includes('공모가 이하') || label.includes('청산')) return 'red';
    if (label.includes('근접')) return 'amber';
    if (label.includes('합병')) return 'blue';
    if (label.includes('일반')) return 'green';
    return '';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function formatTradingValue(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    const numeric = Number(value);
    if (numeric >= 100000000) return `${(numeric / 100000000).toFixed(1)}억`;
    if (numeric >= 10000) return `${Math.round(numeric / 10000).toLocaleString('ko-KR')}만`;
    return number(numeric);
  }

  function signedCount(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    const numeric = Number(value);
    const sign = numeric > 0 ? '+' : '';
    return `${sign}${numeric}개`;
  }

  function daysMetric(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    return `${Math.round(Number(value)).toLocaleString('ko-KR')}일`;
  }

  function colorWithAlpha(color, alpha) {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const size = hex.length === 3 ? 1 : 2;
      const parts = size === 1
        ? hex.split('').map(char => parseInt(char + char, 16))
        : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(part => parseInt(part, 16));
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    }
    return color;
  }

  function getCss(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  window.SpacFormat = {
    money,
    number,
    ratio,
    pct,
    signedPct,
    daysText,
    dateText,
    directionClass,
    badgeClass,
    escapeHtml,
    formatTradingValue,
    signedCount,
    daysMetric,
    colorWithAlpha,
    getCss
  };
})();
