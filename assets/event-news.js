/* 방문별 이벤트 비교. 시세 변동/미래 일정은 새 공시 알림과 구분한다. */
(function(root) {
  'use strict';
  const STORAGE_KEY = 'spac-hunter-event-news-v1';
  const DAY_MS = 86400000;
  const LABELS = {
    new_listing: '신규 상장', merger_applied: '합병 신청', merger_confirmed: '합병 확정',
    merger_canceled: '합병 철회', dissolution: '해산사유 발생', delisted: '상폐 추정'
  };
  const ALIASES = { listing: 'new_listing', merger_application: 'merger_applied',
    merger_confirmation: 'merger_confirmed', applied: 'merger_applied',
    confirmed: 'merger_confirmed', canceled: 'merger_canceled' };
  const kstDate = now => new Date(now + 9 * 3600000).toISOString().slice(0, 10);
  function eventId(code, type, date) {
    return `${String(date || '').slice(0, 10)}|${ALIASES[type] || type}|${code}`;
  }
  function safeUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  }
  function normalizeEvent(event, now) {
    if (!event || typeof event !== 'object') return null;
    const type = ALIASES[event.type] || event.type;
    const date = String(event.date || '').slice(0, 10);
    const code = String(event.code || '').toUpperCase();
    if (!Object.hasOwn(LABELS, type) || !/^[0-9A-Z]{6}$/.test(code) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date || date > kstDate(now)) return null;
    return { id: eventId(code, type, date), code, type, date,
      name: String(event.name || code), label: LABELS[type],
      detail: String(event.detail || event.title || ''), url: safeUrl(event.url) };
  }
  function collectEvents(data, alerts = [], now = Date.now()) {
    const byId = new Map();
    function add(event) {
      const normalized = normalizeEvent(event, now);
      if (normalized) byId.set(normalized.id, normalized);
    }
    for (const spac of data.spacs || []) {
      add({ code: spac.code, name: spac.name, type: 'new_listing', date: spac.listingDate,
        detail: '신규 상장', url: spac.naverUrl });
      for (const event of spac.events || []) add({ ...event, code: spac.code, name: spac.name });
      for (const record of spac.mergerPriceRecords || []) add({ ...record,
        code: spac.code, name: spac.name, type: record.signal });
      if (spac.dissolutionDisclosure) add({ ...spac.dissolutionDisclosure,
        code: spac.code, name: spac.name, type: 'dissolution' });
    }
    for (const alert of alerts) add(alert);
    return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  }

  function createTracker({ storage, now = Date.now } = {}) {
    const startedAt = now();
    let saved = null;
    let storageAvailable = true;
    try {
      storage = storage || root.localStorage;
      const raw = storage.getItem(STORAGE_KEY);
      try { saved = JSON.parse(raw || 'null'); } catch (_) { saved = null; }
      if (saved?.version !== 1 || !Array.isArray(saved.knownIds) || !Array.isArray(saved.unread) ||
          !Number.isFinite(saved.visitedAt) || saved.visitedAt > startedAt) saved = null;
    } catch (_) { storageAvailable = false; }
    const previousVisit = saved?.visitedAt || null;
    const known = new Set((saved?.knownIds || []).filter(id => typeof id === 'string'));
    const unread = new Map();
    for (const event of saved?.unread || []) {
      const normalized = normalizeEvent(event, startedAt);
      if (normalized) unread.set(normalized.id, normalized);
    }
    function persist() {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, visitedAt: now(),
          knownIds: [...known].slice(-3000), unread: [...unread.values()] }));
      } catch (_) { storageAvailable = false; }
    }
    function snapshot() {
      return { previousVisit, storageAvailable,
        events: [...unread.values()].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id)) };
    }
    return {
      snapshot,
      ingest(events, { persistVisit = true } = {}) {
        const cutoff = kstDate(startedAt - 6 * DAY_MS);
        for (const event of events) {
          if (!known.has(event.id) && (previousVisit || event.date >= cutoff)) unread.set(event.id, event);
          if (unread.has(event.id)) unread.set(event.id, event);
          known.add(event.id);
        }
        if (persistVisit) persist();
        return snapshot();
      },
      acknowledge(id) { unread.delete(id); persist(); return snapshot(); },
      acknowledgeAll() { unread.clear(); persist(); return snapshot(); },
      hasCode(code) { return [...unread.values()].some(event => event.code === code); },
      hasEvent(code, type, date) { return unread.has(eventId(code, type, date)); }
    };
  }

  async function fetchAlerts({ fetchImpl = fetch, timeoutMs = 8000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`alerts.json?ts=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`알림 조회 실패 (${response.status})`);
      const payload = await response.json();
      if (!Array.isArray(payload.alerts)) throw new Error('알림 데이터 형식 오류');
      return payload.alerts;
    } finally { clearTimeout(timer); }
  }
  const api = { STORAGE_KEY, eventId, collectEvents, createTracker, fetchAlerts };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpacEventNews = api;
})(typeof window !== 'undefined' ? window : globalThis);
