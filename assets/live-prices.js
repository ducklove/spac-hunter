/* common_preferred_spread와 같은 시세 프록시·5분 갱신 주기. */
(function(root) {
  'use strict';
  const BASE_URL = 'https://ducklove.duckdns.org:3298';
  const INTERVAL_MS = 300000;
  const MAX_AGE_MS = 60000;
  const numeric = value => value == null || value === '' ? null :
    Number.isFinite(Number(String(value).replace(/,/g, ''))) ? Number(String(value).replace(/,/g, '')) : null;
  const round = (value, digits = 2) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;

  function normalizeQuote(item, now = Date.now()) {
    const s = item?.summary || {};
    const r = item?.raw || {};
    const code = item?.symbol;
    const checkedAt = numeric(item?.meta?.polled_at);
    const price = numeric(s.current_price ?? r.nv);
    if (!/^[0-9A-Z]{6}$/.test(code || '') || !(price > 0) || !checkedAt ||
        now - checkedAt > MAX_AGE_MS || checkedAt - now > MAX_AGE_MS) return null;
    const sign = String(r.rf || '');
    const signed = value => {
      const n = numeric(value);
      return n == null ? null : ['4', '5'].includes(sign) ? -Math.abs(n) :
        ['1', '2'].includes(sign) ? Math.abs(n) : sign === '3' ? 0 : n;
    };
    const shares = numeric(r.countOfListedStock);
    return {
      code, price, checkedAt,
      change: signed(s.change ?? r.cv), changePct: signed(s.change_pct ?? r.cr),
      volume: numeric(s.volume ?? r.aq), tradingValue: numeric(s.trading_value ?? r.aa),
      marketCap: shares > 0 ? shares * price : null,
      marketStatus: s.market_state ?? r.ms ?? null,
      // 조회 시각을 체결 시각으로 가장하지 않는다.
      tradedAt: r.localTradedAt || null, source: '네이버 증권 실시간 조회'
    };
  }

  function mergeQuote(spac, quote, now = Date.now()) {
    const previousTime = spac.quote?.checkedAt || Date.parse(spac.quote?.tradedAt || '') || 0;
    if (!quote || quote.code !== spac.code || quote.checkedAt < previousTime) return spac;
    const ratio = spac.ipoPrice > 0 ? quote.price / spac.ipoPrice : null;
    const today = new Date(now + 9 * 3600000).toISOString().slice(0, 10);
    const daysUntil = date => date ? Math.round((Date.parse(date) - Date.parse(today)) / 86400000) : null;
    const days = daysUntil(spac.liquidationDate);
    // 분배금은 청산기한이 아니라 잔여재산 분배일(payoutDate)에 들어오므로 그날까지로 연환산한다.
    const payoutDays = spac.payoutDate ? daysUntil(spac.payoutDate) : days;
    const target = spac.liquidationValuePerShare;
    const badges = [];
    if (ratio != null && ratio < 1) badges.push('공모가 이하');
    else if (ratio != null && ratio <= 1.01) badges.push('공모가 근접');
    if (spac.mergerStatus) badges.push(spac.mergerStatus);
    if (spac.dissolutionDisclosure) badges.push('해산사유 발생');
    if (days != null && days <= 180) badges.push('청산 6개월 이내');
    else if (days != null && days <= 365) badges.push('청산 1년 이내');
    if (spac.quote?.tradeStop) badges.push('거래정지');
    if (!badges.length) badges.push('일반');
    return {
      ...spac, currentPrice: quote.price, change: quote.change, changePct: quote.changePct,
      volume: quote.volume, tradingValue: quote.tradingValue, marketCap: quote.marketCap,
      ratio: round(ratio, 4), premiumPct: ratio == null ? null : round((ratio - 1) * 100),
      daysToLiquidation: days, daysToPayout: payoutDays,
      expectedReturn: target > 0 ? round((target / quote.price - 1) * 100) : null,
      annualizedReturn: target > 0 && payoutDays > 0
        ? round(((target / quote.price) ** (365 / payoutDays) - 1) * 100) : null,
      badges, status: badges[0], quote: { ...spac.quote, ...quote }
    };
  }

  function applyQuotes(data, quotes, now = Date.now()) {
    let applied = 0;
    const spacs = data.spacs.map(spac => {
      const next = mergeQuote(spac, quotes.get(spac.code), now);
      if (next !== spac) applied += 1;
      return next;
    });
    const active = spacs.filter(s => s.currentPrice > 0);
    const average = key => {
      const values = active.map(s => s[key]).filter(Number.isFinite);
      return values.length ? round(values.reduce((a, b) => a + b, 0) / values.length, key === 'ratio' ? 4 : 2) : null;
    };
    const summary = { ...data.summary,
      totalCount: active.length,
      belowIpoCount: active.filter(s => s.ratio != null && s.ratio < 1).length,
      nearIpoCount: active.filter(s => s.ratio != null && s.ratio <= 1.01).length,
      dueSoonCount: active.filter(s => s.daysToLiquidation != null && s.daysToLiquidation <= 180).length,
      dueWithinOneYearCount: active.filter(s => s.daysToLiquidation != null && s.daysToLiquidation <= 365).length,
      averageRatio: average('ratio'), averageAnnualizedReturn: average('annualizedReturn'),
      cheapest: active.filter(s => s.ratio != null).sort((a, b) => a.ratio - b.ratio)[0] || null,
      bestYield: active.filter(s => Number.isFinite(s.annualizedReturn)).sort((a, b) => b.annualizedReturn - a.annualizedReturn)[0] || null
    };
    const byCode = new Map(spacs.map(s => [s.code, s]));
    const mergerCases = (data.mergerCases || []).map(row => {
      const spac = byCode.get(row.code);
      return spac ? { ...row, currentPrice: spac.currentPrice, currentRatio: spac.ratio } : row;
    });
    return { data: { ...data, spacs, summary, mergerCases }, applied };
  }

  async function fetchQuotes(codes, { fetchImpl = fetch, now = Date.now, timeoutMs = 8000 } = {}) {
    const quotes = new Map();
    const unique = [...new Set(codes)].filter(code => /^[0-9A-Z]{6}$/.test(code));
    let limited = false;
    const deadline = now() + 25000;
    async function request(path) {
      if (limited || now() >= deadline) return null;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, deadline - now()));
      try {
        const response = await fetchImpl(`${BASE_URL}${path}${path.includes('?') ? '&' : '?'}_ts=${now()}`,
          { cache: 'no-store', signal: controller.signal });
        if (response.status === 429) limited = true;
        if (!response.ok) return null;
        return await response.json();
      } catch (_) {
        return null;
      } finally {
        clearTimeout(timer);
      }
    }
    function accept(item) {
      const quote = normalizeQuote(item, now());
      if (quote && unique.includes(quote.code)) quotes.set(quote.code, quote);
    }
    // 현 프록시 일괄 API는 숫자 코드만 허용한다. 영문 코드는 개별 API로 조회한다.
    const numericCodes = unique.filter(code => /^\d{6}$/.test(code));
    for (let i = 0; i < numericCodes.length && !limited && now() < deadline; i += 20) {
      const result = await request(`/v1/naverfinance/stocks/quotes?symbols=${numericCodes.slice(i, i + 20).join(',')}`);
      if (Array.isArray(result?.items)) result.items.forEach(accept);
    }
    const missing = unique.filter(code => !quotes.has(code));
    let index = 0;
    await Promise.all(Array.from({ length: Math.min(4, missing.length) }, async () => {
      while (index < missing.length && !limited && now() < deadline) {
        const code = missing[index++];
        accept(await request(`/v1/naverfinance/stocks/${encodeURIComponent(code)}/quote`));
      }
    }));
    return quotes;
  }

  function createController({ getData, onData, onStatus, documentRef = document,
      fetcher = fetchQuotes, setTimer = setTimeout, clearTimer = clearTimeout, now = Date.now }) {
    let pending = null;
    let timer = null;
    let started = false;
    let lastSuccess = null;
    const schedule = () => {
      clearTimer(timer);
      timer = setTimer(() => { if (documentRef.hidden) schedule(); else refresh(); }, INTERVAL_MS);
    };
    function refresh() {
      if (pending) return pending;
      clearTimer(timer);
      onStatus({ busy: true, lastSuccess });
      pending = Promise.resolve().then(async () => {
        const quotes = await fetcher(getData().spacs.map(s => s.code));
        const result = applyQuotes(getData(), quotes, now());
        if (result.applied) {
          lastSuccess = Math.min(...[...quotes.values()].map(q => q.checkedAt));
          onData(result.data);
        }
        onStatus({ busy: false, applied: result.applied, total: getData().spacs.length, lastSuccess });
      }).catch(() => onStatus({ busy: false, applied: 0, total: getData().spacs.length, lastSuccess }))
        .finally(() => { pending = null; schedule(); });
      return pending;
    }
    return { refresh, start() {
      if (started) return;
      started = true;
      documentRef.addEventListener('visibilitychange', () => { if (!documentRef.hidden) refresh(); });
      refresh();
    } };
  }
  const api = { INTERVAL_MS, normalizeQuote, mergeQuote, applyQuotes, fetchQuotes, createController };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpacLivePrices = api;
})(typeof window !== 'undefined' ? window : globalThis);
