/* 스팩 헌터 대시보드 앱 (일반 스크립트, file:// 호환).
   로드 순서: data.js -> format.js -> chart-tooltip.js -> charts.js -> app.js */
(function() {
  'use strict';

  const {
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
    daysMetric
  } = window.SpacFormat;
  const SpacCharts = window.SpacCharts;

  const fallbackData = {
    lastUpdated: '샘플 데이터',
    summary: {},
    statistics: {},
    spacs: [],
    mergerCases: [],
    methodology: {},
    sourceLinks: {}
  };
  let data = window.SPAC_DATA || fallbackData;

  const VALID_FILTERS = ['all', 'below', 'near', 'due', 'merger', 'recent', 'watch'];
  const VALID_SORTS = ['price', 'listing', 'yield'];
  const SORT_ALIASES = {
    cheap: 'price',
    ratio: 'price',
    liquidation: 'listing',
    volume: 'price'
  };
  const STALE_HOURS = 36;
  const SPARK_DAYS = 90;

  let selectedCode = null;
  let filterMode = 'all';
  let sortMode = 'price';
  let chartDays = 90;
  let tableSort = { key: 'currentPrice', direction: 'asc' };
  let searchTimer = 0;
  let simulationCode = null;

  const filters = [
    { id: 'all', label: '전체' },
    { id: 'below', label: '공모가 이하' },
    { id: 'near', label: '1.01x 이하' },
    { id: 'due', label: '청산 6개월 이내' },
    { id: 'merger', label: '합병' },
    { id: 'recent', label: '신규 상장' },
    { id: 'watch', label: '관심' }
  ];

  /* ---------- 워치리스트 (localStorage 'spac-hunter-watchlist') ---------- */

  const WATCHLIST_KEY = 'spac-hunter-watchlist';

  /* 저장소를 읽을 수 없거나 값이 손상된 경우 빈 목록으로 시작한다(메모리 동작만). */
  function loadWatchlist() {
    try {
      const parsed = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
      if (Array.isArray(parsed)) {
        return new Set(parsed.map(normalizeCode).filter(Boolean));
      }
    } catch (error) {
      /* 저장 불가 환경 무시 */
    }
    return new Set();
  }

  const watchlist = loadWatchlist();

  function saveWatchlist() {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(Array.from(watchlist)));
    } catch (error) {
      /* 저장 실패 시 메모리 상태로만 동작 */
    }
  }

  function isWatched(code) {
    return watchlist.has(normalizeCode(code));
  }

  function toggleWatch(code) {
    const target = normalizeCode(code);
    if (!target) return;
    if (watchlist.has(target)) watchlist.delete(target);
    else watchlist.add(target);
    saveWatchlist();
    /* 별표만 바뀐 경우 리스트 스크롤 위치를 유지한 채 다시 그린다. */
    const list = document.getElementById('spacList');
    const scrollTop = list ? list.scrollTop : 0;
    renderCards();
    renderTable();
    renderSchedule();
    if (list) list.scrollTop = scrollTop;
  }

  function getSpacs() {
    return Array.isArray(data.spacs) ? data.spacs : [];
  }

  function normalizeCode(value) {
    return String(value || '').trim().toUpperCase();
  }

  function findSpacByCode(code, items = getSpacs()) {
    const target = normalizeCode(code);
    if (!target) return null;
    return items.find(item => normalizeCode(item.code) === target) || null;
  }

  function getMergerCases() {
    if (Array.isArray(data.mergerCases)) return data.mergerCases;
    return getSpacs().flatMap(item => (item.mergerPriceRecords || []).map(record => ({
      ...record,
      code: item.code,
      name: item.name,
      status: item.mergerStatus || '과거 공시'
    })));
  }

  /* ---------- URL 상태 (?code= / ?filter= / ?sort=) ---------- */

  function readUrlState() {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        code: normalizeCode(params.get('code')),
        filter: params.get('filter'),
        sort: params.get('sort')
      };
    } catch (error) {
      return { code: '', filter: null, sort: null };
    }
  }

  /* 허용 목록 내 값만 적용. 파라미터가 없으면 기본값, 잘못된 값은 무시(현 상태 유지). */
  function applyUrlState(state) {
    if (VALID_FILTERS.includes(state.filter)) filterMode = state.filter;
    else if (state.filter == null) filterMode = 'all';
    const normalizedSort = SORT_ALIASES[state.sort] || state.sort;
    if (VALID_SORTS.includes(normalizedSort)) sortMode = normalizedSort;
    else if (state.sort == null) sortMode = 'price';
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = sortMode;
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    try {
      const url = new URL(window.location.href);
      const code = normalizeCode(selectedCode);
      if (code) url.searchParams.set('code', code);
      if (filterMode && filterMode !== 'all') url.searchParams.set('filter', filterMode);
      else url.searchParams.delete('filter');
      if (sortMode && sortMode !== 'price') url.searchParams.set('sort', sortMode);
      else url.searchParams.delete('sort');
      if (url.toString() !== window.location.href) {
        window.history.replaceState({}, '', url);
      }
    } catch (error) {
      /* file:// 등 URL 조작이 막힌 환경에서는 조용히 무시 */
    }
  }

  /* ---------- 필터 / 정렬 / 선택 ---------- */

  function filterSpacs(items) {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    return items.filter(item => {
      if (query) {
        const haystack = `${item.name || ''} ${item.code || ''} ${item.sponsor || ''}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (filterMode === 'below') return item.ratio != null && item.ratio < 1;
      if (filterMode === 'near') return item.ratio != null && item.ratio <= 1.01;
      if (filterMode === 'due') return item.daysToLiquidation != null && item.daysToLiquidation <= 180;
      if (filterMode === 'watch') return isWatched(item.code);
      if (filterMode === 'merger') return (item.badges || []).some(label => String(label).includes('합병'));
      if (filterMode === 'recent') {
        if (!item.listingDate) return false;
        const listing = new Date(item.listingDate);
        const now = new Date(data.generatedAt || Date.now());
        return (now - listing) / 86400000 <= 120;
      }
      return true;
    });
  }

  function compareNullable(a, b, direction = 'asc') {
    const emptyA = a == null || Number.isNaN(Number(a));
    const emptyB = b == null || Number.isNaN(Number(b));
    if (emptyA && emptyB) return 0;
    if (emptyA) return 1;
    if (emptyB) return -1;
    return direction === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
  }

  function compareDateNullable(a, b, direction = 'asc') {
    const timeA = a ? Date.parse(String(a)) : NaN;
    const timeB = b ? Date.parse(String(b)) : NaN;
    const emptyA = !Number.isFinite(timeA);
    const emptyB = !Number.isFinite(timeB);
    if (emptyA && emptyB) return 0;
    if (emptyA) return 1;
    if (emptyB) return -1;
    return direction === 'asc' ? timeA - timeB : timeB - timeA;
  }

  function sortSpacs(items) {
    const sorted = items.slice();
    const mode = sortMode;
    sorted.sort((a, b) => {
      if (mode === 'price') return compareNullable(a.currentPrice, b.currentPrice, 'asc');
      if (mode === 'listing') return compareDateNullable(a.listingDate, b.listingDate, 'asc');
      if (mode === 'yield') return compareNullable(a.annualizedReturn, b.annualizedReturn, 'desc');
      return 0;
    });
    return sorted;
  }

  function visibleSpacs() {
    return sortSpacs(filterSpacs(getSpacs()));
  }

  /* 종목 비교 테이블(및 CSV)에 쓰는 정렬 결과 */
  function tableItems() {
    return visibleSpacs().slice().sort((a, b) => {
      if (tableSort.key === 'name') {
        const result = String(a.name || '').localeCompare(String(b.name || ''), 'ko');
        return tableSort.direction === 'asc' ? result : -result;
      }
      return compareNullable(a[tableSort.key], b[tableSort.key], tableSort.direction);
    });
  }

  function selectSpac(code, options = {}) {
    const all = getSpacs();
    const visible = visibleSpacs();
    const exactVisible = findSpacByCode(code, visible);
    const exactAll = findSpacByCode(code, all);
    const next = options.preferVisible && !exactVisible
      ? (visible[0] || exactAll || all[0] || null)
      : (exactVisible || exactAll || visible[0] || all[0] || null);
    selectedCode = next ? next.code : null;
    if (selectedCode && options.syncUrl !== false) {
      syncUrl();
    }
    renderCards();
    renderSelected();
    renderTable();
    renderMergerCases();
  }

  function selectedSpac() {
    return getSpacs().find(item => item.code === selectedCode) || visibleSpacs()[0] || getSpacs()[0] || null;
  }

  /* ---------- 데이터 신선도 / 수집 경고 배너 ---------- */

  function warningText(value) {
    if (value == null) return '상세 정보 없음';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }

  function collectionWarnings() {
    const errors = data.errors;
    const lines = [];
    if (!errors || typeof errors !== 'object') return lines;
    const quote = errors.quote && typeof errors.quote === 'object' ? errors.quote : {};
    const disclosure = errors.disclosure && typeof errors.disclosure === 'object' ? errors.disclosure : {};
    Object.keys(quote).forEach(key => lines.push(`시세 [${key}] ${warningText(quote[key])}`));
    Object.keys(disclosure).forEach(key => lines.push(`공시 [${key}] ${warningText(disclosure[key])}`));
    if ('kofr' in errors) lines.push(`KOFR 금리: ${warningText(errors.kofr)}`);
    if ('kindCorpList' in errors) lines.push(`KIND 상장법인목록: ${warningText(errors.kindCorpList)}`);
    return lines;
  }

  function renderFreshness() {
    const banner = document.getElementById('freshnessBanner');
    if (!banner) return;
    const parts = [];

    const generated = data.generatedAt ? Date.parse(data.generatedAt) : NaN;
    if (Number.isFinite(generated)) {
      const hours = Math.floor((Date.now() - generated) / 3600000);
      if (hours >= STALE_HOURS) {
        parts.push(`<div class="alert-line">데이터가 ${number(hours)}시간 전 기준입니다. 자동 갱신이 지연되고 있을 수 있습니다.</div>`);
      }
    }

    const warnings = collectionWarnings();
    if (warnings.length) {
      parts.push(`
        <div class="alert-line">데이터 수집 중 경고 ${number(warnings.length)}건이 발생했습니다. 일부 값이 최신이 아닐 수 있습니다.</div>
        <details>
          <summary>상세 보기</summary>
          <ul>${warnings.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        </details>
      `);
    }

    if (!parts.length) {
      banner.hidden = true;
      banner.innerHTML = '';
      return;
    }
    banner.innerHTML = parts.join('');
    banner.hidden = false;
  }

  /* ---------- 시장 통계 ---------- */

  function renderMarketStats() {
    const stats = data.statistics || {};
    const belowTrend = stats.belowIpoTrend || [];
    const funnel = stats.mergerFunnel || {};
    const priceStats = stats.mergerPriceStats || {};

    document.getElementById('belowTrendHint').textContent = belowTrend.length
      ? `${dateText(belowTrend[0].date)} - ${dateText(belowTrend[belowTrend.length - 1].date)}`
      : '집계 가능한 히스토리 없음';
    drawTrendChart();
    renderTrendMixBars(stats.listingTrend || [], stats.mergerTrend || []);
    renderFunnelStats(funnel, priceStats, stats.note);
  }

  function drawTrendChart() {
    SpacCharts.drawBelowTrendChart(
      document.getElementById('belowTrendChart'),
      (data.statistics || {}).belowIpoTrend || []
    );
  }

  function renderTrendMixBars(listingTrend, mergerTrend) {
    const listingByMonth = Object.fromEntries((listingTrend || []).map(row => [row.month, row.count || 0]));
    const rows = (mergerTrend || []).slice(-12).map(row => ({
      ...row,
      listing: listingByMonth[row.month] || 0
    }));
    const max = Math.max(1, ...rows.map(row => row.listing + row.applied + row.confirmed + row.canceled));
    document.getElementById('trendMixHint').textContent = rows.length ? '최근 12개월' : '집계 가능한 이벤트 없음';
    document.getElementById('trendMixBars').innerHTML = rows.map(row => {
      const total = row.listing + row.applied + row.confirmed + row.canceled;
      const width = value => total ? Math.max(2, value / max * 100) : 0;
      return `
        <div class="bar-row">
          <div class="bar-label">${escapeHtml(String(row.month || '').slice(2))}</div>
          <div class="bar-track">
            ${row.listing ? `<span class="bar-segment listing" style="width:${width(row.listing)}%"></span>` : ''}
            ${row.applied ? `<span class="bar-segment applied" style="width:${width(row.applied)}%"></span>` : ''}
            ${row.confirmed ? `<span class="bar-segment confirmed" style="width:${width(row.confirmed)}%"></span>` : ''}
            ${row.canceled ? `<span class="bar-segment canceled" style="width:${width(row.canceled)}%"></span>` : ''}
          </div>
          <div class="bar-value">신규 ${row.listing} · 합병 ${row.total || 0}</div>
        </div>
      `;
    }).join('');
  }

  function renderFunnelStats(funnel, priceStats, note) {
    const rows = [
      ['에피소드', `${funnel.episodeCount ?? 0}건`],
      ['성공 / 실패 / 진행', `${funnel.successCount ?? 0} / ${funnel.failureCount ?? 0} / ${funnel.pendingCount ?? 0}`],
      ['성사 확률', pct(funnel.successRatePct)],
      ['평균 성사 기간', daysMetric(funnel.avgDaysToConfirmation)],
      ['평균 철회 기간', daysMetric(funnel.avgDaysToCancel)],
      ['신청 다음날 평균', signedPct(priceStats.applicationAvgNextReturnPct)],
      ['확정 다음날 평균', signedPct(priceStats.confirmationAvgNextReturnPct)],
      ['철회 다음날 평균', signedPct(priceStats.cancellationAvgNextReturnPct)]
    ];
    document.getElementById('funnelHint').textContent = `완료 ${funnel.completedCount ?? 0}건 기준`;
    document.getElementById('funnelStats').innerHTML = rows.map(([label, value]) => `
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    `).join('');
    document.getElementById('statsNote').textContent = note || '';
    /* 아카이브 합산 통계(archivedSpacCount)는 다음 데이터 갱신부터 존재 — 부재/0이면 문구를 숨긴다. */
    const archiveNote = document.getElementById('funnelArchiveNote');
    if (archiveNote) {
      const archived = Number(funnel.archivedSpacCount);
      const showArchived = Number.isFinite(archived) && archived > 0;
      archiveNote.textContent = showArchived ? `아카이브 ${number(archived)}종목 포함` : '';
      archiveNote.hidden = !showArchived;
    }
  }

  /* statistics.sponsorStats가 있을 때만 네 번째 패널을 추가한다(없으면 DOM 자체를 만들지 않음). */
  function renderSponsorPanel() {
    const wrap = document.getElementById('statsPanels');
    if (!wrap) return;
    const existing = document.getElementById('sponsorPanel');
    if (existing) existing.remove();
    const stats = (data.statistics || {}).sponsorStats;
    const rows = Array.isArray(stats) ? stats.filter(row => row && row.sponsor) : [];
    wrap.classList.toggle('has-sponsor', rows.length > 0);
    if (!rows.length) return;

    const top = rows.slice().sort((a, b) =>
      ((Number(b.episodeCount) || 0) - (Number(a.episodeCount) || 0)) ||
      ((Number(b.spacCount) || 0) - (Number(a.spacCount) || 0))
    ).slice(0, 8);

    const panel = document.createElement('article');
    panel.className = 'stats-panel';
    panel.id = 'sponsorPanel';
    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">주관사별 합병 성사</h2>
          <div class="panel-sub">에피소드 상위 ${top.length}개 주관사</div>
        </div>
      </div>
      <div class="stats-panel-body">
        <table class="sponsor-table">
          <thead>
            <tr>
              <th>주관사</th>
              <th class="numeric">스팩수</th>
              <th class="numeric">에피소드</th>
              <th class="numeric">성사율</th>
              <th class="numeric">평균 성사기간</th>
            </tr>
          </thead>
          <tbody>
            ${top.map(row => `
              <tr>
                <td>${escapeHtml(row.sponsor)}</td>
                <td class="numeric">${number(row.spacCount)}</td>
                <td class="numeric">${number(row.episodeCount)}</td>
                <td class="numeric">${pct(row.successRatePct, 1)}</td>
                <td class="numeric">${daysMetric(row.avgDaysToConfirmation)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    wrap.appendChild(panel);
  }

  /* ---------- 상폐·아카이브 패널 ----------
     statistics.archive는 다음 데이터 갱신부터 존재한다.
     count > 0일 때만 패널을 만들고, 부재/0이면 DOM 자체를 만들지 않는다.
     아카이브 종목은 이미 data.spacs에 없으므로 행 클릭(종목 선택) 동작을 붙이지 않는다. */
  function renderArchivePanel() {
    const wrap = document.getElementById('statsPanels');
    if (!wrap) return;
    const existing = document.getElementById('archivePanel');
    if (existing) existing.remove();
    const archive = (data.statistics || {}).archive;
    const count = archive && typeof archive === 'object' ? Number(archive.count) : NaN;
    const show = Number.isFinite(count) && count > 0;
    wrap.classList.toggle('has-archive', show);
    if (!show) return;

    const recent = (Array.isArray(archive.recent) ? archive.recent : [])
      .filter(row => row && typeof row === 'object')
      .slice(0, 8);
    const rowsHtml = recent.map(row => {
      const pm = row.postMerger;
      const pmLine = pm && pm.price != null
        ? `<div class="archive-postmerger">합병 후 ${escapeHtml(pm.name || pm.code || '')} ${escapeHtml(money(pm.price))} <span class="${directionClass(pm.returnVsFinalPct)}">${escapeHtml(signedPct(pm.returnVsFinalPct))}</span></div>`
        : '';
      return `
      <div class="archive-row">
        <div class="archive-main">
          <div class="archive-name">${escapeHtml(row.name || '-')} <span class="code">${escapeHtml(row.code || '')}</span></div>
          <div class="archive-reason">${escapeHtml(row.mergerStatus || row.delistReasonGuess || '사유 미상')}</div>
          ${pmLine}
        </div>
        <div class="archive-side">
          <div class="archive-date">${escapeHtml(dateText(row.lastSeen))}</div>
          <div class="archive-price">${escapeHtml(money(row.finalPrice))}</div>
        </div>
      </div>
    `;
    }).join('');

    const panel = document.createElement('article');
    panel.className = 'stats-panel';
    panel.id = 'archivePanel';
    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">상폐·아카이브</h2>
          <div class="panel-sub">누적 ${escapeHtml(number(count))}종목</div>
        </div>
      </div>
      <div class="stats-panel-body">
        ${rowsHtml
          ? `<div class="archive-list">${rowsHtml}</div>`
          : '<div class="empty">최근 아카이브 내역이 없습니다.</div>'}
      </div>
    `;
    wrap.appendChild(panel);
  }

  /* ---------- 합병 후 주가 흐름 패널 ----------
     statistics.postMergerFlow는 다음 데이터 갱신부터 존재한다.
     entries가 있을 때만 패널을 만들고, 부재/0이면 DOM 자체를 만들지 않는다.
     스파크라인은 스팩 최종가를 1.00x 기준선으로 하는 합병 후 가격 비율이다. */
  function renderPostMergerPanel() {
    const wrap = document.getElementById('statsPanels');
    if (!wrap) return;
    const existing = document.getElementById('postMergerPanel');
    if (existing) existing.remove();
    const flow = (data.statistics || {}).postMergerFlow;
    const entries = flow && Array.isArray(flow.entries)
      ? flow.entries.filter(row => row && typeof row === 'object' && row.code)
      : [];
    wrap.classList.toggle('has-postmerger', entries.length > 0);
    if (!entries.length) return;

    const statusLabels = {
      tracking: '추적중',
      halted: '거래정지',
      unavailable: '시세 미확인',
      ended: '추적 종료'
    };
    const summaryParts = [];
    if (Number(flow.trackedCount) > 0) {
      summaryParts.push(`최종가 대비 평균 ${signedPct(flow.avgReturnVsFinalPct)}`);
      if (flow.winRatePct != null) summaryParts.push(`상승 ${pct(flow.winRatePct, 0)}`);
    }

    const rowsHtml = entries.slice(0, 8).map(row => {
      const converted = row.name && row.name !== row.spacName;
      const newName = converted ? row.name : '신상장 전환 대기';
      /* 행 텍스트(현재가·수익률)가 정보를 담고 있어 스파크라인은 장식 취급(aria-hidden) */
      const sparkCell = Array.isArray(row.spark) && row.spark.length >= 2
        ? `<canvas class="spark" width="110" height="26" data-pm-spark="${escapeHtml(row.spacCode)}" aria-hidden="true"></canvas>`
        : '<span class="pm-sub">-</span>';
      return `
        <tr>
          <td>
            <div class="pm-name">${escapeHtml(row.spacName || '-')} <span class="pm-arrow">→</span> ${escapeHtml(newName)}</div>
            <div class="pm-sub">${escapeHtml(row.code || '')} · ${escapeHtml(statusLabels[row.status] || row.status || '-')} · ${escapeHtml(dateText(row.archivedAt))}~</div>
          </td>
          <td class="numeric">${escapeHtml(money(row.price))}</td>
          <td class="numeric ${directionClass(row.returnVsFinalPct)}">${escapeHtml(signedPct(row.returnVsFinalPct))}</td>
          <td class="numeric ${directionClass(row.returnVsIpoPct)}">${escapeHtml(signedPct(row.returnVsIpoPct))}</td>
          <td class="spark-cell">${sparkCell}</td>
        </tr>`;
    }).join('');

    const panel = document.createElement('article');
    panel.className = 'stats-panel';
    panel.id = 'postMergerPanel';
    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">합병 후 주가 흐름</h2>
          <div class="panel-sub">신상장 ${number(entries.length)}종목${summaryParts.length ? ` · ${summaryParts.join(' · ')}` : ''}</div>
        </div>
      </div>
      <div class="stats-panel-body">
        <table class="sponsor-table postmerger-table">
          <thead>
            <tr>
              <th>스팩 → 신상장</th>
              <th class="numeric">현재가</th>
              <th class="numeric">최종가 대비</th>
              <th class="numeric">공모가 대비</th>
              <th>흐름</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="stats-note">최종가 대비 = 스팩 마지막 거래가 기준 · 스파크라인 점선 = 스팩 최종가(1.00x)</div>
      </div>
    `;
    wrap.appendChild(panel);

    const byCode = new Map(entries.map(row => [String(row.spacCode), row]));
    panel.querySelectorAll('canvas[data-pm-spark]').forEach(canvas => {
      const row = byCode.get(String(canvas.dataset.pmSpark));
      if (row && SpacCharts && Array.isArray(row.spark)) {
        SpacCharts.drawSparkline(
          canvas,
          row.spark.filter(point => point && Number.isFinite(Number(point.ratio)))
        );
      }
    });
  }

  /* ---------- 스냅샷 / 필터 / 카드 ---------- */

  function average(values) {
    const numbers = values.map(Number).filter(Number.isFinite);
    if (!numbers.length) return null;
    return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  }

  function signedWon(value) {
    if (value == null || Number.isNaN(Number(value))) return '-';
    const rounded = Math.round(Number(value));
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded.toLocaleString('ko-KR')}`;
  }

  function marketPriceSnapshot() {
    const active = getSpacs().filter(item => Number.isFinite(Number(item.currentPrice)) && Number(item.currentPrice) > 0);
    return {
      averagePrice: average(active.map(item => item.currentPrice)),
      averageChange: average(active.map(item => item.change)),
      averageChangePct: average(active.map(item => item.changePct))
    };
  }

  function newListingSnapshot() {
    const stat = data.statistics && data.statistics.newListing;
    if (stat && typeof stat === 'object') {
      return {
        last30: stat.last30Count ?? 0,
        last90: stat.last90Count ?? 0
      };
    }
    const base = new Date(data.generatedAt || Date.now());
    const rows = getSpacs()
      .map(item => item.listingDate ? Date.parse(String(item.listingDate)) : NaN)
      .filter(Number.isFinite);
    return {
      last30: rows.filter(time => (base - time) / 86400000 <= 30).length,
      last90: rows.filter(time => (base - time) / 86400000 <= 90).length
    };
  }

  function renderSnapshot() {
    const summary = data.summary || {};
    const marketPrice = marketPriceSnapshot();
    const newListing = newListingSnapshot();
    const totalCount = summary.totalCount ?? getSpacs().length;
    const belowCount = summary.belowIpoCount ?? 0;
    const belowPct = totalCount ? (belowCount / totalCount) * 100 : null;
    const cards = [
      {
        label: '스팩 종목 수',
        value: `${totalCount ?? 0}개`,
        subValue: `평균가 ${
          marketPrice.averagePrice == null ? '-' : money(Math.round(marketPrice.averagePrice))
        }`,
        detail: `일간 ${signedWon(marketPrice.averageChange)} · ${signedPct(marketPrice.averageChangePct)}`,
        primary: true
      },
      {
        label: '평균 기대수익률',
        value: pct(summary.averageAnnualizedReturn),
        detail: '연환산 기준',
        tooltip: '만기 청산시 예상되는 연간 수익률'
      },
      {
        label: '공모가 미만 / 비율',
        value: `${belowCount}개 / ${pct(belowPct, 1)}`,
        detail: summary.cheapest
          ? `최저 ${summary.cheapest.name} ${money(summary.cheapest.currentPrice)}`
          : '현재가 기준'
      },
      {
        label: '신규 등록 30일 / 90일',
        value: `${newListing.last30}개 / ${newListing.last90}개`,
        detail: '상장일 기준'
      },
      {
        label: '청산 6개월/1년 이내',
        value: `${summary.dueSoonCount ?? 0}개 / ${summary.dueWithinOneYearCount ?? 0}개`,
        detail: '상장일+36개월 기준'
      },
      {
        label: '합병 진행 중',
        value: `${summary.mergerAppliedCount ?? 0}개`,
        detail: `확정 ${summary.mergerConfirmedCount ?? 0} · 전체 ${summary.mergerCount ?? 0}`
      }
    ];
    document.getElementById('snapshot').innerHTML = cards.map(card => `
      <article class="metric-card ${card.primary ? 'primary' : ''}"${card.tooltip
        ? ` title="${escapeHtml(card.tooltip)}" aria-label="${escapeHtml(`${card.label}: ${card.tooltip}`)}"`
        : ''}>
        <div>
          <div class="metric-label">${escapeHtml(card.label)}</div>
          <div class="metric-value ${String(card.value).length > 8 ? 'small' : ''}">${escapeHtml(card.value)}</div>
          ${card.subValue ? `<div class="metric-subvalue">${escapeHtml(card.subValue)}</div>` : ''}
        </div>
        <div class="metric-detail">${escapeHtml(card.detail)}</div>
      </article>
    `).join('');
  }

  function renderFilters() {
    document.getElementById('filterSegments').innerHTML = filters.map(item => `
      <button type="button" class="segment ${filterMode === item.id ? 'active' : ''}" data-filter="${item.id}">
        ${escapeHtml(item.label)}
      </button>
    `).join('');
  }

  /* 워치리스트 별표 토글 버튼. 행 클릭(종목 선택)과는 data-watch로 구분한다. */
  function watchButtonHtml(item) {
    const watched = isWatched(item.code);
    const labelText = watched ? '관심 해제' : '관심 등록';
    return `<button type="button" class="watch-btn ${watched ? 'active' : ''}" data-watch="${escapeHtml(item.code)}"` +
      ` aria-pressed="${watched ? 'true' : 'false'}" aria-label="${labelText}" title="${labelText}">${watched ? '★' : '☆'}</button>`;
  }

  /* 리스트 헤더 카운트: 관심 필터에서는 종목수·평균 가격·평균 연환산 요약으로 대체. */
  function renderListCount(items) {
    const target = document.getElementById('listCount');
    if (!target) return;
    if (filterMode !== 'watch') {
      target.textContent = `${items.length}개`;
      return;
    }
    const parts = [`${items.length}종목`];
    const prices = items.map(item => Number(item.currentPrice)).filter(Number.isFinite);
    if (prices.length) {
      parts.push(`평균가 ${money(Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length))}`);
    }
    const yields = items.map(item => Number(item.annualizedReturn)).filter(Number.isFinite);
    if (yields.length) {
      parts.push(`평균 연환산 ${signedPct(yields.reduce((sum, value) => sum + value, 0) / yields.length, 1)}`);
    }
    target.textContent = parts.join(' · ');
  }

  function renderCards() {
    const items = visibleSpacs();
    renderListCount(items);
    const target = document.getElementById('spacList');
    if (!items.length) {
      target.innerHTML = filterMode === 'watch' && !watchlist.size
        ? '<div class="empty">별표(☆)로 관심 종목을 등록하세요.</div>'
        : '<div class="empty">조건에 맞는 스팩이 없습니다.</div>';
      return;
    }
    target.innerHTML = items.map(item => {
      const annualClass = item.annualizedReturn == null || Number.isNaN(Number(item.annualizedReturn))
        ? ''
        : (Number(item.annualizedReturn) > 0 ? 'good' : 'danger');
      return `
      <div class="spac-card ${item.code === selectedCode ? 'active' : ''}" data-code="${escapeHtml(item.code)}" role="button" tabindex="0">
        <div class="spac-card-top">
          <div class="spac-card-id">
            ${watchButtonHtml(item)}
            <div class="spac-card-id-text">
              <div class="spac-name">${escapeHtml(item.name)}</div>
              <div class="code">${escapeHtml(item.code)} · ${escapeHtml(item.sponsor || '주관사 미확인')}</div>
            </div>
          </div>
          <div>
            <div class="price">${money(item.currentPrice)}</div>
            <div class="card-date">${dateText(item.listingDate)}</div>
          </div>
        </div>
        <div class="spac-card-metrics">
          <span>상장 ${escapeHtml(dateText(item.listingDate))}</span>
          <span class="${annualClass}">연 ${escapeHtml(pct(item.annualizedReturn))}</span>
        </div>
        <div class="badge-row">
          ${(item.badges || []).slice(0, 3).map(label => `<span class="badge ${badgeClass(label)}">${escapeHtml(label)}</span>`).join('')}
        </div>
      </div>
    `;
    }).join('');
  }

  /* ---------- 선택 종목 상세 ---------- */

  function renderSelected() {
    const item = selectedSpac();
    syncSimulationDefault(item);
    renderSimulation();
    renderDisclosures(item);
    /* 선택 종목이 없거나 filing이 없으면 기존 블록 제거까지만 수행한다. */
    renderFilingBlock(item);
    if (!item) {
      document.getElementById('selectedName').textContent = '-';
      return;
    }
    selectedCode = item.code;
    document.getElementById('selectedName').textContent = item.name;
    document.getElementById('selectedMeta').textContent =
      `${item.code} · ${item.market || 'KOSDAQ'} · 상장일 ${dateText(item.listingDate)}`;
    document.getElementById('selectedPrice').textContent = money(item.currentPrice);
    document.getElementById('selectedChange').className = `selected-change ${directionClass(item.changePct)}`;
    document.getElementById('selectedChange').textContent =
      `${signedPct(item.changePct)} · 전일비 ${number(item.change)}`;
    document.getElementById('selectedBadges').innerHTML = (item.badges || []).map(label =>
      `<span class="badge ${badgeClass(label)}">${escapeHtml(label)}</span>`
    ).join('');

    document.getElementById('statGrid').innerHTML = [
      ['공모가', money(item.ipoPrice)],
      ['현재가 / 공모가', ratio(item.ratio)],
      ['청산 예정', dateText(item.liquidationDate)],
      ['청산까지', daysText(item.daysToLiquidation)]
    ].map(([label, value]) => `
      <div class="mini-stat">
        <div class="mini-label">${label}</div>
        <div class="mini-value">${value}</div>
      </div>
    `).join('');

    const liquidationValueText = item.liquidationValuePerShare == null || Number.isNaN(Number(item.liquidationValuePerShare))
      ? '-'
      : money(Math.round(item.liquidationValuePerShare));
    document.getElementById('analysisStrip').innerHTML = [
      ['추정 청산분배금', liquidationValueText, item.liquidationValueSource || '공시 예치이율 확인 필요'],
      ['단순 기대수익률', pct(item.expectedReturn), '청산분배금 / 현재가 - 1'],
      ['연환산 기대수익률', pct(item.annualizedReturn), '청산 예정일까지 보유 가정']
    ].map(([label, value, note], idx) => `
      <div class="analysis-box">
        <div class="analysis-label">${label}</div>
        <div class="analysis-value ${idx === 2 && item.annualizedReturn != null ? (Number(item.annualizedReturn) > 0 ? 'good' : 'danger') : ''}">${value}</div>
        <div class="analysis-note">${escapeHtml(note)}</div>
      </div>
    `).join('');

    renderTimeline(item);
    renderMergerRecords(item);
    renderLinks(item);
    drawSelectedChart();
  }

  function priceWithReturn(priceValue, returnValue) {
    const priceText = money(priceValue);
    if (returnValue == null || Number.isNaN(Number(returnValue))) return priceText;
    return `${priceText} · ${signedPct(returnValue)}`;
  }

  function renderMergerRecords(item) {
    const records = (item.mergerPriceRecords || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    document.getElementById('mergerRecordHint').textContent = `${records.length}건`;
    const target = document.getElementById('mergerRecordList');
    if (!records.length) {
      target.innerHTML = '<div class="empty">합병 공시 기반 가격 기록이 없습니다.</div>';
      return;
    }
    target.innerHTML = records.slice(0, 5).map(record => `
      <div class="record-item">
        <div class="record-top">
          <div>
            <span class="badge ${badgeClass(record.label || '')}">${escapeHtml(record.label || '-')}</span>
            <div class="record-title">${escapeHtml(record.title || '')}</div>
          </div>
          <div class="record-date">${dateText(record.date)}</div>
        </div>
        <div class="record-metrics">
          <div class="record-metric">
            <div class="record-label">기준가</div>
            <div class="record-value">${money(record.basePrice)}</div>
          </div>
          <div class="record-metric">
            <div class="record-label">다음 거래일</div>
            <div class="record-value ${directionClass(record.nextReturnPct)}">${priceWithReturn(record.nextPrice, record.nextReturnPct)}</div>
          </div>
          <div class="record-metric">
            <div class="record-label">최신/현재</div>
            <div class="record-value ${directionClass(record.latestReturnPct)}">${priceWithReturn(record.latestPrice, record.latestReturnPct)}</div>
          </div>
          <div class="record-metric">
            <div class="record-label">이후 고점</div>
            <div class="record-value ${directionClass(record.highReturnPct)}">${priceWithReturn(record.highPrice, record.highReturnPct)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ---------- 공모 정보 (증권신고서 자동 추출) ----------
     item.filing이 있을 때만 analysis-strip과 금리 시뮬레이션 사이에 블록을 만든다.
     부재 시 DOM 자체를 만들지 않으며, 값이 null인 필드의 행은 생략한다.
     parseWarnings는 파이프라인 내부용이라 표시하지 않는다. */

  function filingReportUrl(filing) {
    if (filing.url) return String(filing.url);
    if (filing.receiptNo) {
      return `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(String(filing.receiptNo))}`;
    }
    return '';
  }

  /* 청약기간: 양쪽이 있으면 "시작 ~ 종료", 한쪽만 있으면 열린 구간으로 표기. 둘 다 없으면 ''. */
  function filingSubscriptionText(filing) {
    const start = filing.subscriptionStart ? dateText(filing.subscriptionStart) : '';
    const end = filing.subscriptionEnd ? dateText(filing.subscriptionEnd) : '';
    if (start && end) return `${start} ~ ${end}`;
    if (start) return `${start} ~`;
    if (end) return `~ ${end}`;
    return '';
  }

  function fallbackRatePeriods(item, filing) {
    if (item && Array.isArray(item.escrowRatePeriods) && item.escrowRatePeriods.length) {
      return item.escrowRatePeriods;
    }
    if (!filing || filing.escrowRatePct == null || Number.isNaN(Number(filing.escrowRatePct))) {
      return [];
    }
    return [{
      startDate: filing.paymentDate || filing.filingDate || item?.listingDate || null,
      endDate: item?.liquidationDate || null,
      ratePct: Number(filing.escrowRatePct),
      source: filing.reportName || '증권신고서',
      reportName: filing.reportName || '증권신고서',
      filingDate: filing.filingDate || null,
      url: filingReportUrl(filing)
    }];
  }

  function ratePeriodRangeText(period) {
    const start = dateText(period.startDate);
    const end = period.endDate ? dateText(period.endDate) : '이후';
    return `${start} ~ ${end}`;
  }

  function ratePeriodListHtml(periods) {
    if (!periods.length) return '';
    return `
      <div class="rate-periods">
        ${periods.map(period => {
          const label = period.source || period.reportName || '공시';
          const sourceText = period.url
            ? `<a href="${escapeHtml(period.url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`
            : escapeHtml(label);
          return `
            <div class="rate-period">
              <div>
                <div class="rate-period-range">${escapeHtml(ratePeriodRangeText(period))}</div>
                <div class="rate-period-source">${sourceText}${period.filingDate ? ` · ${escapeHtml(dateText(period.filingDate))}` : ''}</div>
              </div>
              <div class="rate-period-value">연 ${escapeHtml(Number(period.ratePct).toFixed(2))}%</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderFilingBlock(item) {
    const existing = document.getElementById('filingBlock');
    if (existing) existing.remove();
    const strip = document.getElementById('analysisStrip');
    if (!strip) return;
    const filing = item && item.filing && typeof item.filing === 'object' && !Array.isArray(item.filing)
      ? item.filing
      : null;
    const ratePeriods = fallbackRatePeriods(item, filing);
    if (!filing && !ratePeriods.length) return;

    /* [라벨, escape를 마친 값 HTML] — 값이 null인 행은 추가하지 않는다. */
    const rows = [];
    if (filing && filing.ipoPrice != null && !Number.isNaN(Number(filing.ipoPrice))) {
      const sourceHtml = item.ipoPriceSource
        ? `<span class="filing-source">${escapeHtml(item.ipoPriceSource)}</span>`
        : '';
      rows.push(['확정공모가', `${escapeHtml(money(filing.ipoPrice))}${sourceHtml}`]);
    }
    if (filing && filing.offeringShares != null && !Number.isNaN(Number(filing.offeringShares))) {
      rows.push(['공모주식수', escapeHtml(`${number(filing.offeringShares)}주`)]);
    }
    if (filing && filing.escrowAmount != null && !Number.isNaN(Number(filing.escrowAmount))) {
      rows.push(['예치금', escapeHtml(money(filing.escrowAmount))]);
    }
    if (filing && filing.escrowAgent) {
      rows.push(['예치기관', escapeHtml(String(filing.escrowAgent))]);
    }
    const subscription = filing ? filingSubscriptionText(filing) : '';
    if (subscription) rows.push(['청약기간', escapeHtml(subscription)]);
    if (filing && filing.paymentDate) rows.push(['납입일', escapeHtml(dateText(filing.paymentDate))]);

    const reportUrl = filing ? filingReportUrl(filing) : '';
    /* 표시할 행도 원문 링크도 없으면(전 필드 null) 빈 블록을 만들지 않는다. */
    if (!rows.length && !reportUrl && !ratePeriods.length) return;

    const block = document.createElement('div');
    block.className = 'record-block filing-block';
    block.id = 'filingBlock';
    block.innerHTML = `
      <div class="record-head">
        <h2 class="panel-title">공모 정보</h2>
        ${filing && filing.filingDate ? `<div class="panel-sub">${escapeHtml(dateText(filing.filingDate))} 제출</div>` : ''}
      </div>
      ${rows.length ? `<dl class="filing-kv">${rows.map(([label, valueHtml]) => `
        <dt>${escapeHtml(label)}</dt>
        <dd>${valueHtml}</dd>
      `).join('')}</dl>` : ''}
      ${ratePeriods.length ? `
        <div class="rate-period-head">
          <h3>예치이율 기간</h3>
          <span>${escapeHtml(`${ratePeriods.length}개 구간`)}</span>
        </div>
        ${ratePeriodListHtml(ratePeriods)}
      ` : ''}
      <div class="filing-caption">증권신고서·신탁계약내용변경 자동 추출값${reportUrl
        ? ` · <a href="${escapeHtml(reportUrl)}" target="_blank" rel="noopener">신고서 원문</a>`
        : ''}</div>
    `;
    strip.insertAdjacentElement('afterend', block);
  }

  /* ---------- 공시 원문 링크 ---------- */

  /* mergerDisclosures(+있다면 dissolutionDisclosure)를 날짜 내림차순 최대 8건 표시.
     0건이면 섹션 자체를 숨긴다(빈 박스 금지). 두 필드 모두 부재해도 안전해야 한다. */
  function renderDisclosures(item) {
    const block = document.getElementById('disclosureBlock');
    const list = document.getElementById('disclosureList');
    const hint = document.getElementById('disclosureHint');
    if (!block || !list) return;
    const rows = [];
    if (item) {
      (Array.isArray(item.mergerDisclosures) ? item.mergerDisclosures : []).forEach(entry => {
        if (entry && typeof entry === 'object') rows.push(entry);
      });
      const dissolution = item.dissolutionDisclosure;
      if (dissolution && typeof dissolution === 'object') rows.push(dissolution);
    }
    rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const top = rows.slice(0, 8);
    if (!top.length) {
      block.hidden = true;
      list.innerHTML = '';
      if (hint) hint.textContent = '';
      return;
    }
    if (hint) {
      hint.textContent = rows.length > top.length ? `${rows.length}건 중 최신 ${top.length}건` : `${rows.length}건`;
    }
    list.innerHTML = top.map(entry => {
      const titleText = escapeHtml(entry.title || '제목 미확인');
      const titleHtml = entry.url
        ? `<a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener">${titleText}</a>`
        : titleText;
      return `
        <div class="disclosure-item">
          <div class="disclosure-date">${dateText(entry.date)}</div>
          <div class="disclosure-main">
            <div class="disclosure-title">${titleHtml}</div>
            ${entry.source ? `<div class="disclosure-source">${escapeHtml(entry.source)}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
    block.hidden = false;
  }

  function renderTimeline(item) {
    const events = (item.events || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
    document.getElementById('timelineHint').textContent = `${events.length}건`;
    const list = document.getElementById('timelineList');
    if (!events.length) {
      list.innerHTML = '<div class="empty">타임라인 이벤트가 없습니다.</div>';
      return;
    }
    list.innerHTML = events.map(event => `
      <div class="timeline-item">
        <div class="timeline-date">${dateText(event.date)}</div>
        <div>
          <div class="timeline-title">${escapeHtml(event.label || event.type)}</div>
          <div class="timeline-detail">${escapeHtml(event.detail || '')}</div>
        </div>
      </div>
    `).join('');
  }

  function renderLinks(item) {
    const links = [
      ['네이버', item.naverUrl],
      ['DART 공시검색', item.disclosureUrl],
      ['KIND 상장법인목록', data.sourceLinks && data.sourceLinks.kindCorpList],
      ['KOFR', data.sourceLinks && data.sourceLinks.kofr],
      ['OpenDART API', data.sourceLinks && data.sourceLinks.openDartGuide],
      /* 파이프라인이 생성하는 RSS(없어도 클릭 시 브라우저 기본 동작이라 무해) — 항상 표시 */
      ['알림 RSS', 'alerts.xml']
    ].filter(link => link[1]);
    document.getElementById('sourceLinks').innerHTML = links.map(([label, url]) => `
      <a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">
        <span>${escapeHtml(label)}</span><span>열기</span>
      </a>
    `).join('');
  }

  function drawSelectedChart() {
    const canvas = document.getElementById('ratioChart');
    const item = selectedSpac();
    /* role="img" 캔버스의 요약 라벨을 선택 종목에 맞춰 갱신한다. */
    if (canvas) {
      canvas.setAttribute('aria-label', item
        ? `${item.name} 현재가/공모가 비율 추이 차트`
        : '현재가/공모가 비율 추이 차트');
    }
    SpacCharts.drawRatioChart(canvas, item, chartDays);
  }

  /* ---------- 금리 시나리오 시뮬레이션 ---------- */

  function selectedEscrowRatePct(item = selectedSpac()) {
    const periods = item && Array.isArray(item.escrowRatePeriods) ? item.escrowRatePeriods : [];
    for (let idx = periods.length - 1; idx >= 0; idx -= 1) {
      const rate = Number(periods[idx] && periods[idx].ratePct);
      if (Number.isFinite(rate)) return rate;
    }
    const filingRate = Number(item && item.filing && item.filing.escrowRatePct);
    if (Number.isFinite(filingRate)) return filingRate;
    const value = Number(data?.rateAssumption?.annualRatePct);
    if (!Number.isFinite(value)) return 2.5;
    return value;
  }

  function baseRatePct(item = selectedSpac()) {
    const value = selectedEscrowRatePct(item);
    return Math.min(6, Math.max(0, value));
  }

  function syncSimulationDefault(item = selectedSpac()) {
    const input = document.getElementById('simRateInput');
    if (!input || !item) return;
    if (simulationCode === item.code) return;
    input.value = String(baseRatePct(item));
    simulationCode = item.code;
  }

  function isManualLiquidationValue(item) {
    const source = String((item && item.liquidationValueSource) || '');
    return source.includes('overrides') || source.includes('수동');
  }

  function renderSimulation() {
    const input = document.getElementById('simRateInput');
    const rateLabel = document.getElementById('simRateValue');
    const target = document.getElementById('simResults');
    const note = document.getElementById('simNote');
    if (!input || !rateLabel || !target || !note) return;

    const ratePct = Number(input.value);
    rateLabel.textContent = `연 ${ratePct.toFixed(2)}%`;

    const item = selectedSpac();
    const ipoPrice = item ? Number(item.ipoPrice) : NaN;
    const listing = item && item.listingDate ? Date.parse(item.listingDate) : NaN;
    const liquidation = item && item.liquidationDate ? Date.parse(item.liquidationDate) : NaN;
    const trustDays = Number.isFinite(listing) && Number.isFinite(liquidation)
      ? Math.round((liquidation - listing) / 86400000)
      : null;

    if (!item || !Number.isFinite(ipoPrice) || ipoPrice <= 0 || trustDays == null || trustDays <= 0) {
      target.innerHTML = '<div class="empty">상장일·청산 예정일 정보가 없어 시뮬레이션할 수 없습니다.</div>';
      note.textContent = '';
      return;
    }

    const simValue = ipoPrice * Math.pow(1 + ratePct / 100, trustDays / 365);
    const currentPrice = Number(item.currentPrice);
    const hasPrice = Number.isFinite(currentPrice) && currentPrice > 0;
    const simpleReturn = hasPrice ? (simValue / currentPrice - 1) * 100 : null;
    const days = Number(item.daysToLiquidation);
    const annualReturn = hasPrice && Number.isFinite(days) && days > 0
      ? (Math.pow(simValue / currentPrice, 365 / days) - 1) * 100
      : null;

    target.innerHTML = [
      ['추정 청산분배금', money(Math.round(simValue)), ''],
      ['단순 기대수익률', pct(simpleReturn), ''],
      ['연환산 기대수익률', pct(annualReturn), annualReturn == null ? '' : (annualReturn > 0 ? 'good' : 'danger')]
    ].map(([label, value, cls]) => `
      <div class="mini-stat">
        <div class="mini-label">${escapeHtml(label)}</div>
        <div class="mini-value ${cls}">${escapeHtml(value)}</div>
      </div>
    `).join('');

    const notes = [`상장일~청산예정일 ${number(trustDays)}일 · 연 ${ratePct.toFixed(2)}% 복리 가정`];
    if (isManualLiquidationValue(item)) {
      notes.push('공시/수동 보정값 대신 수식 추정을 사용한 시뮬레이션입니다');
    }
    note.textContent = notes.join(' · ');
  }

  /* ---------- 종목 비교 테이블 / 합병 이벤트 테이블 ---------- */

  function syncSortHeaders() {
    document.querySelectorAll('th.sortable').forEach(th => {
      const active = tableSort.key === th.dataset.key;
      th.classList.toggle('sorted-asc', active && tableSort.direction === 'asc');
      th.classList.toggle('sorted-desc', active && tableSort.direction === 'desc');
      th.setAttribute('aria-sort', active ? (tableSort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  function renderTable() {
    const items = tableItems();
    document.getElementById('tableCount').textContent = `${items.length}개`;
    const body = document.getElementById('tableBody');
    body.innerHTML = items.map(item => {
      const sparkPoints = SpacCharts.sparklinePoints(item.history, SPARK_DAYS);
      /* 행의 수치 컬럼이 정보를 담고 있어 스파크라인은 장식 취급(aria-hidden) */
      const sparkCell = sparkPoints.length >= 2
        ? `<canvas class="spark" width="110" height="26" data-spark="${escapeHtml(item.code)}" aria-hidden="true"></canvas>`
        : '<span class="code">-</span>';
      return `
      <tr data-code="${escapeHtml(item.code)}" class="${item.code === selectedCode ? 'active' : ''}">
        <td>
          <div class="table-name-cell">
            ${watchButtonHtml(item)}
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <div class="code">${escapeHtml(item.code)}</div>
            </div>
          </div>
        </td>
        <td class="numeric">${money(item.currentPrice)}</td>
        <td class="numeric ${directionClass(item.premiumPct, true)}">${signedPct(item.premiumPct)}</td>
        <td class="numeric ${Number(item.annualizedReturn) > 0 ? 'good' : 'danger'}">${pct(item.annualizedReturn)}</td>
        <td class="numeric">${daysText(item.daysToLiquidation)}</td>
        <td class="numeric">${formatTradingValue(item.tradingValue)}</td>
        <td>${(item.badges || []).slice(0, 2).map(label => `<span class="badge ${badgeClass(label)}">${escapeHtml(label)}</span>`).join(' ')}</td>
        <td class="spark-cell">${sparkCell}</td>
      </tr>
    `;
    }).join('');
    syncSortHeaders();
    /* innerHTML 적용 후 레이아웃이 끝난 다음 한 번에 그린다. */
    window.requestAnimationFrame(drawSparklines);
  }

  function drawSparklines() {
    const canvases = document.querySelectorAll('#tableBody canvas[data-spark]');
    if (!canvases.length) return;
    const byCode = new Map(getSpacs().map(item => [normalizeCode(item.code), item]));
    canvases.forEach(canvas => {
      const item = byCode.get(normalizeCode(canvas.dataset.spark));
      if (item) {
        SpacCharts.drawSparkline(canvas, SpacCharts.sparklinePoints(item.history, SPARK_DAYS));
      }
    });
  }

  function renderMergerCases() {
    const cases = getMergerCases();
    document.getElementById('mergerCaseCount').textContent = `${cases.length}건`;
    const body = document.getElementById('mergerCaseBody');
    if (!cases.length) {
      body.innerHTML = '<tr><td colspan="7"><div class="empty">합병 공시 가격 이벤트가 없습니다.</div></td></tr>';
      return;
    }
    body.innerHTML = cases.map(record => `
      <tr data-code="${escapeHtml(record.code || '')}">
        <td>
          <strong>${escapeHtml(record.name || '-')}</strong>
          <div class="code">${escapeHtml(record.code || '')}</div>
        </td>
        <td>
          <span class="badge ${badgeClass(record.label || '')}">${escapeHtml(record.label || '-')}</span>
          <div class="code">${dateText(record.date)} · ${escapeHtml(record.status || '')}</div>
        </td>
        <td class="numeric">
          ${money(record.basePrice)}
          <div class="code">${dateText(record.baseDate)}</div>
        </td>
        <td class="numeric ${directionClass(record.nextReturnPct)}">
          ${priceWithReturn(record.nextPrice, record.nextReturnPct)}
          <div class="code">${dateText(record.nextDate)}</div>
        </td>
        <td class="numeric ${directionClass(record.latestReturnPct)}">
          ${priceWithReturn(record.latestPrice, record.latestReturnPct)}
          <div class="code">${dateText(record.latestDate)}</div>
        </td>
        <td class="numeric ${directionClass(record.highReturnPct)}">
          ${priceWithReturn(record.highPrice, record.highReturnPct)}
          <div class="code">${dateText(record.highDate)}</div>
        </td>
        <td class="numeric ${directionClass(record.lowReturnPct)}">
          ${priceWithReturn(record.lowPrice, record.lowReturnPct)}
          <div class="code">${dateText(record.lowDate)}</div>
        </td>
      </tr>
    `).join('');
  }

  /* ---------- 다가오는 일정 (전부 기존 data.spacs에서 클라이언트 계산) ---------- */

  const DAY_MS = 86400000;
  const SCHEDULE_DUE_DAYS = 365;      /* 청산기한 임박: 오늘~12개월 */
  const SCHEDULE_MERGER_DAYS = 45;    /* 최근 합병 이벤트: 최근 45일 */
  const SCHEDULE_LISTING_DAYS = 60;   /* 최근 상장: 최근 60일 */
  const SCHEDULE_ROW_LIMIT = 10;
  const SCHEDULE_IPO_ROW_LIMIT = 8;   /* 공모 청약(예정): 최대 8행 */

  /* 기준 시각: data.generatedAt, 파싱 불가 시 현재 시각. */
  function scheduleBase() {
    const parsed = data.generatedAt ? Date.parse(data.generatedAt) : NaN;
    if (Number.isFinite(parsed)) {
      return { time: parsed, label: dateText(data.generatedAt) };
    }
    const now = Date.now();
    return { time: now, label: dateText(new Date(now).toISOString()) };
  }

  /* 일정 행의 워치리스트 별표는 표시 전용(토글 없음) — data-watch를 붙이지 않는다. */
  function watchMarkHtml(code) {
    return isWatched(code)
      ? '<span class="watch-mark" title="관심 종목" aria-label="관심 종목">★</span>'
      : '';
  }

  function scheduleCurrentPriceHtml(item) {
    if (!item || item.currentPrice == null || Number.isNaN(Number(item.currentPrice))) return '';
    return escapeHtml(money(item.currentPrice));
  }

  /* 공통 행 마크업. subHtml/valueHtml은 호출부에서 escape를 마친 HTML 조각을 받는다. */
  function scheduleRowHtml(code, name, subHtml, priceHtml, valueHtml) {
    return `
      <div class="schedule-row" data-code="${escapeHtml(code)}" role="button" tabindex="0">
        <div class="schedule-row-main">
          <div class="schedule-row-name">${watchMarkHtml(code)}${escapeHtml(name || '-')} <span class="code">${escapeHtml(code)}</span></div>
          <div class="schedule-row-sub">${subHtml}</div>
        </div>
        <div class="schedule-row-price">${priceHtml || '-'}</div>
        <div class="schedule-row-value">${valueHtml}</div>
      </div>
    `;
  }

  /* 컬럼 하나를 채운다. 비어 있으면 "해당 없음", 재렌더 시 스크롤 위치 유지. */
  function setScheduleColumn(listId, countId, html, shown, total, unit) {
    const countEl = document.getElementById(countId);
    if (countEl) {
      countEl.textContent = total > shown ? `${total}${unit} 중 최신 ${shown}${unit}` : `${total}${unit}`;
    }
    const list = document.getElementById(listId);
    if (!list) return;
    const scrollTop = list.scrollTop;
    list.innerHTML = html || '<div class="empty">해당 없음</div>';
    list.scrollTop = scrollTop;
  }

  function renderSchedule() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;
    const base = scheduleBase();
    const hint = document.getElementById('scheduleHint');
    if (hint) hint.textContent = `기준 ${base.label}`;
    const spacs = getSpacs();

    /* 1) 청산기한 임박: liquidationDate가 기준일~12개월 이내, 날짜 오름차순 + 월별("YYYY-MM") 헤더 */
    const dueRows = spacs
      .map(item => {
        const time = item.liquidationDate ? Date.parse(String(item.liquidationDate)) : NaN;
        if (!Number.isFinite(time)) return null;
        const days = Math.ceil((time - base.time) / DAY_MS);
        if (days < 0 || days > SCHEDULE_DUE_DAYS) return null;
        return { item, time, days };
      })
      .filter(Boolean)
      .sort((a, b) => (a.time - b.time) || String(a.item.code || '').localeCompare(String(b.item.code || '')));
    let dueHtml = '';
    let dueMonth = '';
    dueRows.forEach(row => {
      const month = String(row.item.liquidationDate).slice(0, 7);
      if (month !== dueMonth) {
        dueMonth = month;
        dueHtml += `<div class="schedule-month">${escapeHtml(month)}</div>`;
      }
      const status = row.item.mergerStatus;
      const badge = status
        ? `<span class="badge ${badgeClass(String(status))}">${escapeHtml(status)}</span>`
        : '';
      dueHtml += scheduleRowHtml(
        row.item.code,
        row.item.name,
        `${escapeHtml(ratio(row.item.ratio))}${badge}`,
        scheduleCurrentPriceHtml(row.item),
        `D-${escapeHtml(String(row.days))}`
      );
    });
    setScheduleColumn('scheduleDueList', 'scheduleDueCount', dueHtml, dueRows.length, dueRows.length, '개');

    /* 2) 최근 합병 이벤트: 최근 45일 내 mergerPriceRecords, 날짜 내림차순 최대 10건 */
    const signalLabels = { applied: '합병 신청', confirmed: '합병 확정', canceled: '합병 철회' };
    const mergerRows = spacs
      .flatMap(item => (Array.isArray(item.mergerPriceRecords) ? item.mergerPriceRecords : [])
        .map(record => ({
          item,
          record,
          time: record && record.date ? Date.parse(String(record.date)) : NaN
        })))
      .filter(entry => Number.isFinite(entry.time)
        && base.time - entry.time >= -DAY_MS
        && base.time - entry.time <= SCHEDULE_MERGER_DAYS * DAY_MS)
      .sort((a, b) => b.time - a.time);
    const mergerTop = mergerRows.slice(0, SCHEDULE_ROW_LIMIT);
    const mergerHtml = mergerTop.map(entry => {
      const label = entry.record.label || signalLabels[entry.record.signal] || '합병 이벤트';
      return scheduleRowHtml(
        entry.item.code,
        entry.item.name,
        `<span class="badge ${badgeClass(String(label))}">${escapeHtml(label)}</span>`,
        scheduleCurrentPriceHtml(entry.item),
        escapeHtml(dateText(entry.record.date))
      );
    }).join('');
    setScheduleColumn('scheduleMergerList', 'scheduleMergerCount', mergerHtml, mergerTop.length, mergerRows.length, '건');

    /* 3) 최근 상장: listingDate가 최근 60일 이내, 날짜 내림차순 최대 10건 */
    const listingRows = spacs
      .map(item => ({ item, time: item.listingDate ? Date.parse(String(item.listingDate)) : NaN }))
      .filter(entry => Number.isFinite(entry.time)
        && base.time - entry.time >= -DAY_MS
        && base.time - entry.time <= SCHEDULE_LISTING_DAYS * DAY_MS)
      .sort((a, b) => b.time - a.time);
    const listingTop = listingRows.slice(0, SCHEDULE_ROW_LIMIT);
    const listingHtml = listingTop.map(entry => scheduleRowHtml(
      entry.item.code,
      entry.item.name,
      escapeHtml(ratio(entry.item.ratio)),
      scheduleCurrentPriceHtml(entry.item),
      escapeHtml(dateText(entry.item.listingDate))
    )).join('');
    setScheduleColumn('scheduleListingList', 'scheduleListingCount', listingHtml, listingTop.length, listingRows.length, '개');

    /* 4) 공모 청약(예정): payload.ipoCalendar 기반 — 엔트리가 없으면 컬럼 자체가 생기지 않는다. */
    renderIpoCalendarColumn();
  }

  /* ---------- 공모 청약(예정) 컬럼 (payload.ipoCalendar) ----------
     상장 전 스팩의 증권신고서 기반 청약 일정. 유니버스(data.spacs) 밖이라 종목 선택이
     불가능하므로 행에 data-code/role/tabindex를 붙이지 않고 신고서 링크만 동작한다.
     ipoCalendar 부재/null/0건이면 컬럼 DOM을 만들지 않아 기존 3컬럼 레이아웃이 그대로 유지된다. */

  /* 파이프라인은 entry 배열을, 구 계약은 {updatedAt, entries}를 내보낼 수 있어 둘 다 수용한다. */
  function ipoCalendarEntries() {
    const calendar = data.ipoCalendar;
    const list = Array.isArray(calendar)
      ? calendar
      : (calendar && typeof calendar === 'object' && Array.isArray(calendar.entries) ? calendar.entries : []);
    return list.filter(entry => entry && typeof entry === 'object');
  }

  function ipoCalendarUpdatedAt() {
    const calendar = data.ipoCalendar;
    if (calendar && !Array.isArray(calendar) && typeof calendar === 'object') return calendar.updatedAt || null;
    return null;
  }

  /* 청약기간 표기: 시작·종료가 모두 있으면 "MM-DD~MM-DD", 아니면 접수일("신고 YYYY-MM-DD"). */
  function ipoSubscriptionText(entry) {
    const start = entry.subscriptionStart ? String(entry.subscriptionStart).slice(5, 10) : '';
    const end = entry.subscriptionEnd ? String(entry.subscriptionEnd).slice(5, 10) : '';
    if (start && end) return `${start}~${end}`;
    if (entry.filingDate) return `신고 ${dateText(entry.filingDate)}`;
    return '-';
  }

  function renderIpoCalendarColumn() {
    const grid = document.getElementById('scheduleGrid');
    if (!grid) return;
    const entries = ipoCalendarEntries();
    let col = document.getElementById('scheduleIpoCol');
    grid.classList.toggle('has-ipo', entries.length > 0);
    if (!entries.length) {
      if (col) col.remove();
      return;
    }
    if (!col) {
      col = document.createElement('div');
      col.className = 'schedule-col';
      col.id = 'scheduleIpoCol';
      grid.appendChild(col);
    }

    /* 접수일(없으면 접수번호) 내림차순 = 최신 신고 순으로 최대 8건 */
    const sorted = entries.slice().sort((a, b) =>
      String(b.filingDate || '').localeCompare(String(a.filingDate || '')) ||
      String(b.receiptNo || '').localeCompare(String(a.receiptNo || '')));
    const top = sorted.slice(0, SCHEDULE_IPO_ROW_LIMIT);

    const countParts = [
      sorted.length > top.length ? `${sorted.length}건 중 최신 ${top.length}건` : `${sorted.length}건`
    ];
    const updatedAt = ipoCalendarUpdatedAt();
    const updatedLabel = updatedAt ? dateText(updatedAt) : '-';
    if (updatedLabel !== '-') countParts.push(`${updatedLabel} 기준`);

    const rowsHtml = top.map(entry => {
      const linkLabel = escapeHtml(entry.reportName || '증권신고서');
      const linkHtml = entry.url
        ? `<a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener">${linkLabel}</a>`
        : `<span>${linkLabel}</span>`;
      const priceHtml = entry.ipoPrice != null && !Number.isNaN(Number(entry.ipoPrice))
        ? `<span>${escapeHtml(money(entry.ipoPrice))}</span>`
        : '';
      return `
        <div class="schedule-row ipo-row">
          <div class="schedule-row-main">
            <div class="schedule-row-name">${escapeHtml(entry.corpName || '-')}</div>
            <div class="schedule-row-sub">${priceHtml}${linkHtml}</div>
          </div>
          <div class="schedule-row-value">${escapeHtml(ipoSubscriptionText(entry))}</div>
        </div>
      `;
    }).join('');

    col.innerHTML = `
      <div class="schedule-col-head">
        <h3 class="schedule-col-title">공모 청약(예정)</h3>
        <div class="panel-sub">${escapeHtml(countParts.join(' · '))}</div>
      </div>
      <div class="schedule-list">${rowsHtml}</div>
    `;
  }

  /* ---------- CSV 내보내기 ---------- */

  function csvField(value) {
    const text = value == null ? '' : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportCsv() {
    const items = tableItems();
    const header = ['종목명', '코드', '현재가', '공모가괴리%', '연환산%', '청산까지일', '거래대금', '상태'];
    const rows = items.map(item => [
      item.name ?? '',
      item.code ?? '',
      item.currentPrice ?? '',
      item.premiumPct ?? '',
      item.annualizedReturn ?? '',
      item.daysToLiquidation ?? '',
      item.tradingValue ?? '',
      item.status ?? ''
    ]);
    const csv = '\uFEFF' + [header, ...rows].map(row => row.map(csvField).join(',')).join('\r\n');
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `spac-hunter-${stamp}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      /* Blob 다운로드가 막힌 환경에서는 조용히 무시 */
    }
  }

  /* ---------- 화면 갱신(데이터 재요청) ---------- */

  /* "window.SPAC_DATA = " 프리픽스와 끝의 ";"를 제거한 뒤 JSON.parse. 실패 시 null. */
  function parseDataJsText(text) {
    if (typeof text !== 'string') return null;
    let body = text.trim();
    const prefix = 'window.SPAC_DATA';
    if (!body.startsWith(prefix)) return null;
    body = body.slice(prefix.length).trimStart();
    if (!body.startsWith('=')) return null;
    body = body.slice(1).trim();
    if (body.endsWith(';')) body = body.slice(0, -1).trimEnd();
    try {
      return JSON.parse(body);
    } catch (error) {
      return null;
    }
  }

  /* fetch 성공 + 파싱 성공 시 데이터 교체, 그 외(file://, 오프라인 등)에는 조용히 재렌더만 수행. */
  function refreshData() {
    const finish = () => renderAll();
    let request = null;
    try {
      if (typeof window.fetch === 'function') {
        request = window.fetch(`data.js?ts=${Date.now()}`, { cache: 'no-store' });
      }
    } catch (error) {
      request = null;
    }
    if (!request || typeof request.then !== 'function') {
      finish();
      return;
    }
    request
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        const parsed = parseDataJsText(text);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.spacs)) {
          data = parsed;
          window.SPAC_DATA = parsed;
          simulationCode = null;
        }
      })
      .catch(() => { /* 조용한 폴백 */ })
      .then(finish);
  }

  /* ---------- 테마 등 캔버스 일괄 재렌더 ---------- */

  function redrawCanvases() {
    drawSelectedChart();
    drawTrendChart();
    drawSparklines();
  }

  /* ---------- 이벤트 바인딩 ---------- */

  function bindEvents() {
    document.getElementById('themeBtn').addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        /* 저장 불가 환경 무시 */
      }
      redrawCanvases();
    });

    document.getElementById('refreshViewBtn').addEventListener('click', refreshData);

    document.getElementById('searchInput').addEventListener('input', () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        selectSpac(selectedCode, { preferVisible: true });
      }, 150);
    });

    document.getElementById('sortSelect').addEventListener('change', event => {
      sortMode = VALID_SORTS.includes(event.target.value) ? event.target.value : 'price';
      selectSpac(selectedCode, { preferVisible: true });
    });

    /* 필터 세그먼트: 컨테이너 위임 */
    document.getElementById('filterSegments').addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      filterMode = VALID_FILTERS.includes(button.dataset.filter) ? button.dataset.filter : 'all';
      renderFilters();
      selectSpac(selectedCode, { preferVisible: true });
    });

    /* 리스트/테이블/일정 행 클릭: 컨테이너 1회 위임. 별표(워치) 버튼이 행 선택보다 우선. */
    ['spacList', 'tableBody', 'mergerCaseBody', 'scheduleGrid'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      container.addEventListener('click', event => {
        const watchButton = event.target.closest('[data-watch]');
        if (watchButton && container.contains(watchButton)) {
          event.stopPropagation();
          toggleWatch(watchButton.dataset.watch);
          return;
        }
        const row = event.target.closest('[data-code]');
        if (!row || !container.contains(row) || !row.dataset.code) return;
        selectSpac(row.dataset.code);
      });
    });

    /* 카드/일정 행이 button이 아닌 role="button"이므로 키보드 선택을 직접 처리(별표 버튼은 제외). */
    ['spacList', 'scheduleGrid'].forEach(id => {
      const container = document.getElementById(id);
      if (!container) return;
      container.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
        if (event.target.closest('[data-watch]')) return;
        const row = event.target.closest('[data-code]');
        if (!row || !row.dataset.code) return;
        event.preventDefault();
        selectSpac(row.dataset.code);
      });
    });

    document.querySelectorAll('.period-btn').forEach(button => {
      button.addEventListener('click', () => {
        chartDays = Number(button.dataset.days);
        document.querySelectorAll('.period-btn').forEach(btn => btn.classList.toggle('active', btn === button));
        drawSelectedChart();
      });
    });

    const toggleTableSort = key => {
      if (!key) return;
      if (tableSort.key === key) {
        tableSort.direction = tableSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        tableSort.key = key;
        tableSort.direction = ['annualizedReturn', 'tradingValue', 'currentPrice'].includes(key) ? 'desc' : 'asc';
      }
      renderTable();
    };
    document.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => toggleTableSort(th.dataset.key));
      th.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          toggleTableSort(th.dataset.key);
        }
      });
    });

    document.getElementById('csvBtn').addEventListener('click', exportCsv);

    document.getElementById('simRateInput').addEventListener('input', renderSimulation);
    document.getElementById('simResetBtn').addEventListener('click', () => {
      const input = document.getElementById('simRateInput');
      input.value = String(baseRatePct());
      renderSimulation();
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(window.__spacChartTimer);
      window.__spacChartTimer = window.setTimeout(() => {
        drawSelectedChart();
        drawTrendChart();
      }, 80);
    });

    window.addEventListener('popstate', () => {
      const state = readUrlState();
      applyUrlState(state);
      renderFilters();
      const linked = state.code ? findSpacByCode(state.code) : null;
      if (linked) {
        selectSpac(linked.code, { syncUrl: false });
      } else {
        selectSpac(selectedCode, { preferVisible: true, syncUrl: false });
      }
    });
  }

  /* ---------- 전체 렌더 / 초기화 ---------- */

  function renderAll() {
    document.getElementById('updated').textContent = `최종 업데이트: ${data.lastUpdated || '-'}`;
    renderFreshness();
    renderSnapshot();
    renderMarketStats();
    renderSponsorPanel();
    renderArchivePanel();
    renderPostMergerPanel();
    renderFilters();
    if (!selectedCode && getSpacs().length) {
      const linked = findSpacByCode(readUrlState().code);
      selectedCode = linked?.code || visibleSpacs()[0]?.code || getSpacs()[0].code;
      if (linked) {
        syncUrl();
      }
    }
    renderCards();
    renderSelected();
    renderTable();
    renderMergerCases();
    renderSchedule();
  }

  applyUrlState(readUrlState());
  const simInput = document.getElementById('simRateInput');
  if (simInput) simInput.value = String(baseRatePct());
  bindEvents();
  renderAll();
})();
