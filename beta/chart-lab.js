/* Chart Lab — AG Charts playground with Bento defaults.
   Standard tier (~60 controls), 6 chart types, project presets. */

// ─── Bento defaults ──────────────────────────────────────────────────────
const FONT = 'Manrope, sans-serif';
const PALETTE = ['#5A55E3', '#FF6600', '#8C9FFF', '#F8931C', '#E83162', '#30ACEE'];
const GRID = '#DFE1E2';
const TEXT = '#000000';

// ─── Sample data ─────────────────────────────────────────────────────────
function buildTimeSeries() {
  const out = [];
  const start = new Date(2026, 2, 19);
  for (let i = 0; i < 38; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const base = 1.10 + Math.sin(i / 6) * 0.04 + i * 0.003;
    out.push({ date: d, current: +base.toFixed(4), prev: +(base - 0.04 + Math.sin(i / 5) * 0.01).toFixed(4) });
  }
  return out;
}

const LIFECYCLE_STAGES = [
  { key: 'firstTime',    label: 'First-time',   color: '#5A55E3' },
  { key: 'returning',    label: 'Returning',    color: '#FF6600' },
  { key: 'winBack', label: 'Win-back', color: '#8C9FFF' },
  { key: 'loyal',        label: 'Loyal',        color: '#F8931C' },
  { key: 'atRisk',       label: 'At-Risk',      color: '#E83162' },
  { key: 'churned',      label: 'Churned',      color: '#30ACEE' },
];

function buildStackedAreaSeries() {
  const out = [];
  const start = new Date(2026, 2, 19);
  for (let i = 0; i < 38; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push({
      date: d,
      firstTime:    Math.round(140 + Math.sin(i / 4) * 30 + i * 1.2),
      returning:    Math.round(220 + Math.sin(i / 5) * 25 + i * 1.5),
      winBack: Math.round(110 + Math.sin(i / 6) * 18),
      loyal:        Math.round(280 + Math.sin(i / 7) * 35 + i * 0.8),
      atRisk:       Math.round(150 + Math.sin(i / 5 + 1) * 22),
      churned:      Math.round(95  + Math.sin(i / 6 + 2) * 12),
    });
  }
  return out;
}

const SAMPLE = {
  line: buildTimeSeries(),
  stackedArea: buildStackedAreaSeries(),
  bar: [
    { category: '1 visit', count: 4200 },
    { category: '2 visits', count: 2100 },
    { category: '3–5 visits', count: 1500 },
    { category: '6–10 visits', count: 700 },
    { category: '11–20 visits', count: 280 },
    { category: '21+ visits', count: 110 },
  ],
  barStacked: [
    { period: 'Jan', loyalty: 320, nonLoyalty: 480 },
    { period: 'Feb', loyalty: 360, nonLoyalty: 460 },
    { period: 'Mar', loyalty: 410, nonLoyalty: 510 },
    { period: 'Apr', loyalty: 470, nonLoyalty: 540 },
    { period: 'May', loyalty: 520, nonLoyalty: 560 },
    { period: 'Jun', loyalty: 580, nonLoyalty: 590 },
  ],
  donut: [
    { stage: 'New', value: 1240 },
    { stage: 'Active', value: 4360 },
    { stage: 'Lapsed', value: 1820 },
    { stage: 'Churned', value: 980 },
  ],
  sankey: {
    nodes: [
      { id: '1st visit' }, { id: '2nd visit' }, { id: '3rd visit' }, { id: '4th+ visit' },
      { id: 'Dropped after 1' }, { id: 'Dropped after 2' }, { id: 'Dropped after 3' },
    ],
    links: [
      { from: '1st visit', to: '2nd visit', size: 4200 },
      { from: '1st visit', to: 'Dropped after 1', size: 5800 },
      { from: '2nd visit', to: '3rd visit', size: 2400 },
      { from: '2nd visit', to: 'Dropped after 2', size: 1800 },
      { from: '3rd visit', to: '4th+ visit', size: 1500 },
      { from: '3rd visit', to: 'Dropped after 3', size: 900 },
    ],
  },
  heatmap: (function() {
    const rows = [];
    for (let cohort = 0; cohort < 8; cohort++) {
      for (let week = 0; week < 8; week++) {
        if (week >= cohort) {
          const base = 100 - (week - cohort) * 12 - cohort * 1.5;
          rows.push({ cohort: 'W' + (cohort + 1), week: 'Wk ' + week, retention: Math.max(8, Math.round(base)) });
        }
      }
    }
    return rows;
  })(),
  funnel: [
    { stage: 'Identified', value: 12000 },
    { stage: 'Email opt-in', value: 8400 },
    { stage: 'SMS opt-in', value: 4200 },
    { stage: 'Push opt-in', value: 1900 },
  ],
};

// ─── Default option builders ─────────────────────────────────────────────
const baseChrome = () => ({
  theme: { params: { fontFamily: FONT } },
  background: { fill: '#ffffff' },
  padding: { top: 12, right: 12, bottom: 12, left: 12 },
  legend: { enabled: true, position: 'bottom' },
});

const fmtM = (p) => (+p.value).toFixed(2).replace(/\.?0+$/, '') + 'M';
const fmtK = (p) => Math.round(+p.value / 1000) + 'K';
const fmtNum = (p) => Number(+p.value).toLocaleString();
const fmtPct = (p) => (+p.value).toFixed(0) + '%';

function defaultsFor(type) {
  const chrome = baseChrome();
  if (type === 'line') {
    return {
      ...chrome,
      data: SAMPLE.line,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: false, position: 'bottom' },
      series: [
        { type: 'line', xKey: 'date', yKey: 'prev', yName: 'Prev period', stroke: PALETTE[0], strokeWidth: 2, lineDash: [2, 2], marker: { enabled: false } },
        { type: 'line', xKey: 'date', yKey: 'current', yName: 'This period', stroke: PALETTE[0], strokeWidth: 2, marker: { enabled: false } },
      ],
      axes: {
        x: { type: 'time', position: 'bottom', gridLine: { enabled: false }, line: { enabled: false }, tick: { enabled: true, size: 4, stroke: GRID }, label: { fontSize: 12, color: TEXT, format: '%b %-d', padding: 8 }, crosshair: { enabled: false } },
        y: { type: 'number', position: 'left', gridLine: { enabled: true, style: [{ stroke: GRID }] }, line: { enabled: false }, tick: { enabled: false }, label: { fontSize: 12, color: TEXT, padding: 8, formatter: fmtM } },
      },
    };
  }
  if (type === 'stackedArea') {
    return {
      ...chrome,
      data: SAMPLE.stackedArea,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: true, position: 'bottom' },
      series: LIFECYCLE_STAGES.map(stage => ({
        type: 'area', xKey: 'date', yKey: stage.key, yName: stage.label,
        stacked: true, stackGroup: 'lifecycle',
        fill: stage.color, fillOpacity: 0.9,
        stroke: stage.color, strokeWidth: 0,
        marker: { enabled: false },
      })),
      axes: {
        x: { type: 'time', position: 'bottom', gridLine: { enabled: false }, line: { enabled: false }, tick: { enabled: true, size: 4, stroke: GRID }, label: { fontSize: 12, color: TEXT, format: '%b %-d', padding: 8, avoidCollisions: true } },
        y: { type: 'number', position: 'left', gridLine: { enabled: true, style: [{ stroke: GRID }] }, line: { enabled: false }, tick: { enabled: false }, label: { fontSize: 12, color: TEXT, padding: 8, formatter: fmtNum } },
      },
    };
  }
  if (type === 'bar') {
    return {
      ...chrome,
      data: SAMPLE.bar,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: false, position: 'bottom' },
      series: [
        { type: 'bar', direction: 'vertical', xKey: 'category', yKey: 'count', yName: 'Guests', fill: PALETTE[0], cornerRadius: 4, strokeWidth: 0 },
      ],
      axes: {
        x: { type: 'category', position: 'bottom', gridLine: { enabled: false }, line: { enabled: false }, tick: { enabled: false }, label: { fontSize: 12, color: TEXT, padding: 8 } },
        y: { type: 'number', position: 'left', gridLine: { enabled: true, style: [{ stroke: GRID }] }, line: { enabled: false }, tick: { enabled: false }, label: { fontSize: 12, color: TEXT, padding: 8, formatter: fmtNum } },
      },
    };
  }
  if (type === 'donut') {
    return {
      ...chrome,
      data: SAMPLE.donut,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: true, position: 'right' },
      series: [
        { type: 'donut', angleKey: 'value', calloutLabelKey: 'stage', innerRadiusRatio: 0.65, fills: PALETTE.slice(0, 4), strokes: ['#ffffff'], strokeWidth: 2, sectorSpacing: 2, calloutLabel: { enabled: false }, sectorLabel: { enabled: false }, innerLabels: [ { text: '8.4K', fontSize: 24, fontWeight: 700, color: TEXT }, { text: 'Total', fontSize: 12, color: '#6b7280' } ] },
      ],
    };
  }
  if (type === 'sankey') {
    return {
      ...chrome,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: false },
      data: SAMPLE.sankey.links,
      series: [
        { type: 'sankey', fromKey: 'from', toKey: 'to', sizeKey: 'size', sizeName: 'Guests', nodes: SAMPLE.sankey.nodes, node: { width: 14, spacing: 8, alignment: 'justify', fillOpacity: 0.95 }, link: { fillOpacity: 0.4 }, label: { color: TEXT, fontSize: 12 } },
      ],
    };
  }
  if (type === 'heatmap') {
    return {
      ...chrome,
      data: SAMPLE.heatmap,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: true, position: 'right' },
      series: [
        { type: 'heatmap', xKey: 'week', yKey: 'cohort', colorKey: 'retention', colorName: 'Retention', colorRange: ['#eef0fc', PALETTE[0]], label: { enabled: true, color: TEXT, fontSize: 11, formatter: fmtPct } },
      ],
      axes: {
        x: { type: 'category', position: 'bottom', label: { fontSize: 12, color: TEXT } },
        y: { type: 'category', position: 'left', label: { fontSize: 12, color: TEXT } },
      },
    };
  }
  if (type === 'funnel') {
    return {
      ...chrome,
      data: SAMPLE.funnel,
      title: { text: '', enabled: false, fontSize: 14, color: TEXT },
      legend: { enabled: false },
      series: [
        { type: 'cone-funnel', stageKey: 'stage', valueKey: 'value', fills: PALETTE, strokes: ['#ffffff'], strokeWidth: 2, spacing: 4 },
      ],
    };
  }
}

// ─── Project presets (existing chart configs) ────────────────────────────
const PRESETS = {
  line: [
    { id: 'default', label: 'Default (Bento)' },
    { id: 'totalGuests', label: 'Dashboard — Total Guests' },
  ],
  bar: [
    { id: 'default', label: 'Default vertical' },
    { id: 'horizontal', label: 'Horizontal' },
    { id: 'stacked', label: 'Stacked (current vs prev)' },
  ],
  stackedArea: [
    { id: 'default', label: 'Default (Bento lifecycle)' },
    { id: 'lifecycle', label: 'Dashboard — Lifecycle' },
    { id: 'normalized', label: 'Normalized 100%' },
  ],
  donut: [
    { id: 'default', label: 'Default donut' },
    { id: 'pie', label: 'Pie (no inner radius)' },
  ],
  sankey: [{ id: 'default', label: 'Default (visit funnel)' }],
  heatmap: [{ id: 'default', label: 'Cohort retention' }],
  funnel: [
    { id: 'default', label: 'Cone funnel' },
    { id: 'stage', label: 'Stage funnel (stepped)' },
  ],
};

function buildPreset(type, presetId) {
  const opts = defaultsFor(type);
  if (type === 'line' && presetId === 'totalGuests') {
    opts.padding = { top: 8, right: 0, bottom: 0, left: 0 };
    opts.axes.x = { ...opts.axes.x, nice: false, min: new Date(2026, 2, 19), max: new Date(2026, 3, 26), interval: { values: [new Date(2026, 2, 29), new Date(2026, 3, 5), new Date(2026, 3, 12), new Date(2026, 3, 19)] }, crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] } };
    opts.axes.y = { ...opts.axes.y, min: 1.097, max: 1.253, interval: { values: [1.10, 1.15, 1.20, 1.25] } };
    opts.series.forEach(s => { s.marker = { enabled: true, size: 0 }; });
  }
  if (type === 'stackedArea' && presetId === 'lifecycle') {
    opts.padding = { top: 8, right: 0, bottom: 0, left: 0 };
    opts.legend = { enabled: false };
    opts.axes.x = { ...opts.axes.x, nice: false, min: new Date(2026, 2, 19), max: new Date(2026, 3, 26), interval: { values: [new Date(2026, 2, 29), new Date(2026, 3, 5), new Date(2026, 3, 12), new Date(2026, 3, 19)] } };
    opts.axes.y = { ...opts.axes.y, min: 0, max: 1200, nice: false, interval: { values: [0, 300, 600, 900, 1200] }, label: { ...(opts.axes.y.label || {}), formatter: fmtK } };
  }
  if (type === 'stackedArea' && presetId === 'normalized') {
    opts.series.forEach(s => { s.normalizedTo = 100; });
    opts.axes.y = { ...opts.axes.y, label: { ...(opts.axes.y.label || {}), formatter: fmtPct } };
  }
  if (type === 'bar' && presetId === 'horizontal') {
    opts.series[0].direction = 'horizontal';
    const x = opts.axes.x, y = opts.axes.y;
    opts.axes.x = { ...y, position: 'bottom' };
    opts.axes.y = { ...x, position: 'left' };
  }
  if (type === 'bar' && presetId === 'stacked') {
    opts.data = SAMPLE.barStacked;
    opts.legend = { enabled: true, position: 'bottom' };
    opts.series = [
      { type: 'bar', direction: 'vertical', xKey: 'period', yKey: 'loyalty', yName: 'Loyalty', fill: PALETTE[0], stacked: true, cornerRadius: 4, strokeWidth: 0 },
      { type: 'bar', direction: 'vertical', xKey: 'period', yKey: 'nonLoyalty', yName: 'Non-loyalty', fill: PALETTE[1], stacked: true, cornerRadius: 4, strokeWidth: 0 },
    ];
    opts.axes.x.type = 'category';
  }
  if (type === 'donut' && presetId === 'pie') {
    opts.series[0].innerRadiusRatio = 0;
    opts.series[0].innerLabels = [];
  }
  if (type === 'funnel' && presetId === 'stage') {
    opts.series[0].type = 'funnel';
  }
  return opts;
}

// ─── Path utilities ──────────────────────────────────────────────────────
function pathGet(obj, path) {
  return path.split('.').reduce((acc, k) => {
    if (acc == null) return undefined;
    const m = k.match(/^(.+)\[(\d+)\]$/);
    if (m) return acc[m[1]] ? acc[m[1]][+m[2]] : undefined;
    return acc[k];
  }, obj);
}
function pathSet(obj, path, val) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    let k = keys[i];
    const m = k.match(/^(.+)\[(\d+)\]$/);
    if (m) {
      if (!cur[m[1]]) cur[m[1]] = [];
      if (!cur[m[1]][+m[2]]) cur[m[1]][+m[2]] = {};
      cur = cur[m[1]][+m[2]];
    } else {
      if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
  }
  cur[keys[keys.length - 1]] = val;
}
// Apply a property to ALL series in opts.series.
function setOnAllSeries(opts, key, val) {
  if (!opts.series) return;
  opts.series.forEach(s => { s[key] = val; });
}
function setOnAllSeriesNested(opts, parentKey, key, val) {
  if (!opts.series) return;
  opts.series.forEach(s => { if (!s[parentKey]) s[parentKey] = {}; s[parentKey][key] = val; });
}

// ─── Control schemas ─────────────────────────────────────────────────────
// Each control: { type, label, get(opts), set(opts, val), options?, min?, max?, step? }
// type: text | number | range | color | select | check | colorList | formatter

const FORMATTERS = {
  none: { label: 'None (raw)', fn: null },
  number: { label: 'Number 1,234', fn: fmtNum },
  M: { label: 'Millions (1.2M)', fn: fmtM },
  K: { label: 'Thousands (12K)', fn: fmtK },
  percent: { label: 'Percent (45%)', fn: fmtPct },
  currency: { label: 'Currency ($1,234)', fn: (p) => '$' + Number(+p.value).toLocaleString() },
};
function formatterIdOf(fn) {
  for (const id in FORMATTERS) { if (FORMATTERS[id].fn === fn) return id; }
  return 'none';
}

function globalSection() {
  return {
    title: 'Chart',
    controls: [
      { type: 'text', label: 'Title text', get: o => o.title?.text || '', set: (o, v) => { o.title = o.title || {}; o.title.text = v; o.title.enabled = !!v; } },
      { type: 'range', label: 'Title size', min: 10, max: 32, step: 1, get: o => o.title?.fontSize ?? 14, set: (o, v) => { o.title = o.title || {}; o.title.fontSize = +v; } },
      { type: 'color', label: 'Title color', get: o => o.title?.color || TEXT, set: (o, v) => { o.title = o.title || {}; o.title.color = v; } },
      { type: 'color', label: 'Background', get: o => o.background?.fill || '#ffffff', set: (o, v) => { o.background = { fill: v }; } },
      { type: 'range', label: 'Padding', min: 0, max: 48, step: 1, get: o => o.padding?.top ?? 12, set: (o, v) => { o.padding = { top: +v, right: +v, bottom: +v, left: +v }; } },
    ],
  };
}

function legendSection() {
  return {
    title: 'Legend',
    controls: [
      { type: 'check', label: 'Enabled', get: o => !!o.legend?.enabled, set: (o, v) => { o.legend = o.legend || {}; o.legend.enabled = !!v; } },
      { type: 'select', label: 'Position', options: ['top', 'right', 'bottom', 'left'], get: o => o.legend?.position || 'bottom', set: (o, v) => { o.legend = o.legend || {}; o.legend.position = v; } },
      { type: 'range', label: 'Item spacing', min: 0, max: 32, step: 1, get: o => o.legend?.spacing ?? 16, set: (o, v) => { o.legend = o.legend || {}; o.legend.spacing = +v; } },
      { type: 'range', label: 'Font size', min: 8, max: 20, step: 1, get: o => o.legend?.item?.label?.fontSize ?? 12, set: (o, v) => { o.legend = o.legend || {}; o.legend.item = o.legend.item || {}; o.legend.item.label = o.legend.item.label || {}; o.legend.item.label.fontSize = +v; } },
    ],
  };
}

function tooltipSection() {
  return {
    title: 'Tooltip',
    controls: [
      { type: 'check', label: 'Enabled', get: o => o.tooltip?.enabled !== false, set: (o, v) => { o.tooltip = o.tooltip || {}; o.tooltip.enabled = !!v; } },
      { type: 'select', label: 'Range', options: ['nearest', 'exact'], get: o => o.tooltip?.range || 'nearest', set: (o, v) => { o.tooltip = o.tooltip || {}; o.tooltip.range = v; } },
    ],
  };
}

function paletteSection() {
  return {
    title: 'Palette',
    controls: [
      { type: 'colorList', label: 'Series colors', get: o => readPalette(o), set: (o, arr) => writePalette(o, arr) },
    ],
  };
}

function readPalette(opts) {
  if (!opts.series) return PALETTE;
  // Pull color from first series' fill/stroke/fills
  const collected = [];
  opts.series.forEach(s => {
    if (s.fill) collected.push(s.fill);
    else if (s.stroke) collected.push(s.stroke);
  });
  if (opts.series[0]?.fills) return opts.series[0].fills.slice(0, 6);
  while (collected.length < 6) collected.push(PALETTE[collected.length % PALETTE.length]);
  return collected.slice(0, 6);
}
function writePalette(opts, arr) {
  if (!opts.series) return;
  opts.series.forEach((s, i) => {
    if (s.fills) s.fills = arr.slice(0, s.fills.length);
    if ('fill' in s || s.type === 'bar' || s.type === 'area') s.fill = arr[i % arr.length];
    if ('stroke' in s || s.type === 'line') s.stroke = arr[i % arr.length];
  });
}

function axesSection() {
  return {
    title: 'Axes',
    controls: [
      { type: 'check', label: 'X gridlines', get: o => !!o.axes?.x?.gridLine?.enabled, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.gridLine = { ...(o.axes.x.gridLine || {}), enabled: !!v, style: [{ stroke: GRID }] }; } },
      { type: 'check', label: 'X ticks', get: o => o.axes?.x?.tick?.enabled !== false, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.tick = { ...(o.axes.x.tick || {}), enabled: !!v }; } },
      { type: 'check', label: 'X axis line', get: o => !!o.axes?.x?.line?.enabled, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.line = { enabled: !!v }; } },
      { type: 'check', label: 'X crosshair', get: o => !!o.axes?.x?.crosshair?.enabled, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.crosshair = { enabled: !!v, stroke: '#c6c6c6', lineDash: [4, 4] }; } },
      { type: 'range', label: 'X label size', min: 8, max: 20, step: 1, get: o => o.axes?.x?.label?.fontSize ?? 12, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.label = { ...(o.axes.x.label || {}), fontSize: +v }; } },
      { type: 'range', label: 'X label rotation', min: -90, max: 90, step: 5, get: o => o.axes?.x?.label?.rotation ?? 0, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.label = { ...(o.axes.x.label || {}), rotation: +v }; } },
      { type: 'check', label: 'Y gridlines', get: o => o.axes?.y?.gridLine?.enabled !== false, set: (o, v) => { ensureAxis(o, 'y'); o.axes.y.gridLine = { ...(o.axes.y.gridLine || {}), enabled: !!v, style: [{ stroke: GRID }] }; } },
      { type: 'check', label: 'Y ticks', get: o => !!o.axes?.y?.tick?.enabled, set: (o, v) => { ensureAxis(o, 'y'); o.axes.y.tick = { ...(o.axes.y.tick || {}), enabled: !!v }; } },
      { type: 'check', label: 'Y axis line', get: o => !!o.axes?.y?.line?.enabled, set: (o, v) => { ensureAxis(o, 'y'); o.axes.y.line = { enabled: !!v }; } },
      { type: 'range', label: 'Y label size', min: 8, max: 20, step: 1, get: o => o.axes?.y?.label?.fontSize ?? 12, set: (o, v) => { ensureAxis(o, 'y'); o.axes.y.label = { ...(o.axes.y.label || {}), fontSize: +v }; } },
      { type: 'select', label: 'Y format', options: Object.keys(FORMATTERS).map(id => ({ value: id, label: FORMATTERS[id].label })), get: o => formatterIdOf(o.axes?.y?.label?.formatter), set: (o, v) => { ensureAxis(o, 'y'); o.axes.y.label = { ...(o.axes.y.label || {}), formatter: FORMATTERS[v].fn || undefined }; } },
    ],
  };
}
function ensureAxis(opts, axis) {
  if (!opts.axes) opts.axes = {};
  if (!opts.axes[axis]) opts.axes[axis] = {};
}

function lineSeriesSection() {
  return {
    title: 'Line series',
    controls: [
      { type: 'range', label: 'Stroke width', min: 1, max: 8, step: 0.5, get: o => o.series?.[0]?.strokeWidth ?? 2, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'select', label: 'Curve', options: ['linear', 'smooth', 'step'], get: o => o.series?.[0]?.interpolation?.type || 'linear', set: (o, v) => setOnAllSeries(o, 'interpolation', v === 'linear' ? undefined : { type: v }) },
      { type: 'check', label: 'Markers', get: o => !!o.series?.[0]?.marker?.enabled, set: (o, v) => setOnAllSeriesNested(o, 'marker', 'enabled', !!v) },
      { type: 'range', label: 'Marker size', min: 0, max: 14, step: 1, get: o => o.series?.[0]?.marker?.size ?? 6, set: (o, v) => setOnAllSeriesNested(o, 'marker', 'size', +v) },
      { type: 'select', label: 'Marker shape', options: ['circle', 'square', 'diamond', 'triangle', 'cross', 'plus'], get: o => o.series?.[0]?.marker?.shape || 'circle', set: (o, v) => setOnAllSeriesNested(o, 'marker', 'shape', v) },
      { type: 'check', label: 'Connect missing', get: o => !!o.series?.[0]?.connectMissingData, set: (o, v) => setOnAllSeries(o, 'connectMissingData', !!v) },
      { type: 'check', label: 'Cumulative', get: o => !!o.series?.[0]?.cumulative, set: (o, v) => setOnAllSeries(o, 'cumulative', !!v) },
      { type: 'select', label: 'Series type', options: [{value:'line', label:'Line'}, {value:'area', label:'Area'}], get: o => o.series?.[0]?.type === 'area' ? 'area' : 'line', set: (o, v) => { setOnAllSeries(o, 'type', v); if (v === 'area') { o.series.forEach(s => { s.fill = s.fill || s.stroke; s.fillOpacity = s.fillOpacity ?? 0.2; }); } } },
      { type: 'check', label: 'Dashed line', get: o => Array.isArray(o.series?.[0]?.lineDash) && o.series[0].lineDash.length > 0, set: (o, v) => setOnAllSeries(o, 'lineDash', v ? [4, 4] : undefined) },
    ],
  };
}

function stackedAreaSeriesSection() {
  return {
    title: 'Stacked area series',
    controls: [
      { type: 'range', label: 'Fill opacity', min: 0.1, max: 1, step: 0.05, get: o => o.series?.[0]?.fillOpacity ?? 0.9, set: (o, v) => setOnAllSeries(o, 'fillOpacity', +v) },
      { type: 'range', label: 'Stroke width', min: 0, max: 4, step: 0.5, get: o => o.series?.[0]?.strokeWidth ?? 0, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'select', label: 'Curve', options: ['linear', 'smooth', 'step'], get: o => o.series?.[0]?.interpolation?.type || 'linear', set: (o, v) => setOnAllSeries(o, 'interpolation', v === 'linear' ? undefined : { type: v }) },
      { type: 'check', label: 'Normalize 100%', get: o => !!o.series?.[0]?.normalizedTo, set: (o, v) => { setOnAllSeries(o, 'normalizedTo', v ? 100 : undefined); ensureAxis(o, 'y'); o.axes.y.label = { ...(o.axes.y.label || {}), formatter: v ? fmtPct : fmtNum }; if (v) { o.axes.y.min = 0; o.axes.y.max = 100; } } },
      { type: 'check', label: 'Markers', get: o => !!o.series?.[0]?.marker?.enabled, set: (o, v) => setOnAllSeriesNested(o, 'marker', 'enabled', !!v) },
      { type: 'range', label: 'Marker size', min: 0, max: 14, step: 1, get: o => o.series?.[0]?.marker?.size ?? 6, set: (o, v) => setOnAllSeriesNested(o, 'marker', 'size', +v) },
    ],
  };
}

function barSeriesSection() {
  return {
    title: 'Bar series',
    controls: [
      { type: 'select', label: 'Direction', options: ['vertical', 'horizontal'], get: o => o.series?.[0]?.direction || 'vertical', set: (o, v) => setOnAllSeries(o, 'direction', v) },
      { type: 'check', label: 'Stacked', get: o => !!o.series?.[0]?.stacked, set: (o, v) => setOnAllSeries(o, 'stacked', !!v) },
      { type: 'check', label: 'Normalize 100%', get: o => !!o.series?.[0]?.normalizedTo, set: (o, v) => setOnAllSeries(o, 'normalizedTo', v ? 100 : undefined) },
      { type: 'range', label: 'Corner radius', min: 0, max: 20, step: 1, get: o => o.series?.[0]?.cornerRadius ?? 0, set: (o, v) => setOnAllSeries(o, 'cornerRadius', +v) },
      { type: 'range', label: 'Stroke width', min: 0, max: 4, step: 1, get: o => o.series?.[0]?.strokeWidth ?? 0, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'range', label: 'Bar gap (paddingInner)', min: 0, max: 0.9, step: 0.05, get: o => o.axes?.x?.paddingInner ?? 0.2, set: (o, v) => { ensureAxis(o, 'x'); o.axes.x.paddingInner = +v; } },
      { type: 'check', label: 'Show labels', get: o => !!o.series?.[0]?.label?.enabled, set: (o, v) => setOnAllSeriesNested(o, 'label', 'enabled', !!v) },
      { type: 'select', label: 'Label position', options: ['inside', 'outside', 'center'], get: o => o.series?.[0]?.label?.placement || 'outside', set: (o, v) => setOnAllSeriesNested(o, 'label', 'placement', v) },
      { type: 'range', label: 'Label size', min: 8, max: 20, step: 1, get: o => o.series?.[0]?.label?.fontSize ?? 12, set: (o, v) => setOnAllSeriesNested(o, 'label', 'fontSize', +v) },
    ],
  };
}

function donutSeriesSection() {
  return {
    title: 'Donut series',
    controls: [
      { type: 'range', label: 'Inner radius', min: 0, max: 0.9, step: 0.05, get: o => o.series?.[0]?.innerRadiusRatio ?? 0.65, set: (o, v) => setOnAllSeries(o, 'innerRadiusRatio', +v) },
      { type: 'range', label: 'Sector spacing', min: 0, max: 12, step: 1, get: o => o.series?.[0]?.sectorSpacing ?? 0, set: (o, v) => setOnAllSeries(o, 'sectorSpacing', +v) },
      { type: 'range', label: 'Stroke width', min: 0, max: 8, step: 1, get: o => o.series?.[0]?.strokeWidth ?? 0, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'color', label: 'Stroke color', get: o => (o.series?.[0]?.strokes?.[0]) || '#ffffff', set: (o, v) => setOnAllSeries(o, 'strokes', [v]) },
      { type: 'check', label: 'Sector labels', get: o => !!o.series?.[0]?.sectorLabel?.enabled, set: (o, v) => setOnAllSeriesNested(o, 'sectorLabel', 'enabled', !!v) },
      { type: 'check', label: 'Callout labels', get: o => !!o.series?.[0]?.calloutLabel?.enabled, set: (o, v) => setOnAllSeriesNested(o, 'calloutLabel', 'enabled', !!v) },
      { type: 'text', label: 'Center text', get: o => (o.series?.[0]?.innerLabels?.[0]?.text) || '', set: (o, v) => { const s = o.series[0]; if (!s.innerLabels) s.innerLabels = [{}, {}]; s.innerLabels[0] = { ...(s.innerLabels[0] || {}), text: v, fontSize: 24, fontWeight: 700, color: TEXT }; } },
      { type: 'text', label: 'Center subtext', get: o => (o.series?.[0]?.innerLabels?.[1]?.text) || '', set: (o, v) => { const s = o.series[0]; if (!s.innerLabels) s.innerLabels = [{}, {}]; s.innerLabels[1] = { ...(s.innerLabels[1] || {}), text: v, fontSize: 12, color: '#6b7280' }; } },
    ],
  };
}

function sankeySeriesSection() {
  return {
    title: 'Sankey series',
    controls: [
      { type: 'range', label: 'Node width', min: 4, max: 40, step: 1, get: o => o.series?.[0]?.node?.width ?? 14, set: (o, v) => setOnAllSeriesNested(o, 'node', 'width', +v) },
      { type: 'range', label: 'Node spacing', min: 0, max: 40, step: 1, get: o => o.series?.[0]?.node?.spacing ?? 8, set: (o, v) => setOnAllSeriesNested(o, 'node', 'spacing', +v) },
      { type: 'select', label: 'Node alignment', options: ['justify', 'left', 'right', 'center'], get: o => o.series?.[0]?.node?.alignment || 'justify', set: (o, v) => setOnAllSeriesNested(o, 'node', 'alignment', v) },
      { type: 'range', label: 'Node opacity', min: 0.1, max: 1, step: 0.05, get: o => o.series?.[0]?.node?.fillOpacity ?? 0.95, set: (o, v) => setOnAllSeriesNested(o, 'node', 'fillOpacity', +v) },
      { type: 'range', label: 'Link opacity', min: 0.05, max: 1, step: 0.05, get: o => o.series?.[0]?.link?.fillOpacity ?? 0.4, set: (o, v) => setOnAllSeriesNested(o, 'link', 'fillOpacity', +v) },
      { type: 'check', label: 'Show labels', get: o => o.series?.[0]?.label?.enabled !== false, set: (o, v) => setOnAllSeriesNested(o, 'label', 'enabled', !!v) },
      { type: 'range', label: 'Label size', min: 8, max: 20, step: 1, get: o => o.series?.[0]?.label?.fontSize ?? 12, set: (o, v) => setOnAllSeriesNested(o, 'label', 'fontSize', +v) },
      { type: 'color', label: 'Label color', get: o => o.series?.[0]?.label?.color || TEXT, set: (o, v) => setOnAllSeriesNested(o, 'label', 'color', v) },
    ],
  };
}

function heatmapSeriesSection() {
  return {
    title: 'Heatmap series',
    controls: [
      { type: 'check', label: 'Cell labels', get: o => o.series?.[0]?.label?.enabled !== false, set: (o, v) => setOnAllSeriesNested(o, 'label', 'enabled', !!v) },
      { type: 'range', label: 'Label size', min: 8, max: 20, step: 1, get: o => o.series?.[0]?.label?.fontSize ?? 11, set: (o, v) => setOnAllSeriesNested(o, 'label', 'fontSize', +v) },
      { type: 'color', label: 'Label color', get: o => o.series?.[0]?.label?.color || TEXT, set: (o, v) => setOnAllSeriesNested(o, 'label', 'color', v) },
      { type: 'color', label: 'Color (low)', get: o => (o.series?.[0]?.colorRange?.[0]) || '#eef0fc', set: (o, v) => { const s = o.series[0]; const cur = s.colorRange || ['#eef0fc', PALETTE[0]]; cur[0] = v; s.colorRange = cur; } },
      { type: 'color', label: 'Color (high)', get: o => (o.series?.[0]?.colorRange?.[1]) || PALETTE[0], set: (o, v) => { const s = o.series[0]; const cur = s.colorRange || ['#eef0fc', PALETTE[0]]; cur[1] = v; s.colorRange = cur; } },
      { type: 'range', label: 'Cell stroke width', min: 0, max: 4, step: 1, get: o => o.series?.[0]?.strokeWidth ?? 1, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'color', label: 'Cell stroke', get: o => o.series?.[0]?.stroke || '#ffffff', set: (o, v) => setOnAllSeries(o, 'stroke', v) },
    ],
  };
}

function funnelSeriesSection() {
  return {
    title: 'Funnel series',
    controls: [
      { type: 'select', label: 'Variant', options: [{value:'cone-funnel', label:'Cone'}, {value:'funnel', label:'Stage'}], get: o => o.series?.[0]?.type || 'cone-funnel', set: (o, v) => setOnAllSeries(o, 'type', v) },
      { type: 'range', label: 'Spacing', min: 0, max: 40, step: 1, get: o => o.series?.[0]?.spacing ?? 4, set: (o, v) => setOnAllSeries(o, 'spacing', +v) },
      { type: 'range', label: 'Stroke width', min: 0, max: 6, step: 1, get: o => o.series?.[0]?.strokeWidth ?? 2, set: (o, v) => setOnAllSeries(o, 'strokeWidth', +v) },
      { type: 'color', label: 'Stroke', get: o => (o.series?.[0]?.strokes?.[0]) || '#ffffff', set: (o, v) => setOnAllSeries(o, 'strokes', [v]) },
      { type: 'check', label: 'Stage labels', get: o => o.series?.[0]?.stageLabel?.enabled !== false, set: (o, v) => setOnAllSeriesNested(o, 'stageLabel', 'enabled', !!v) },
      { type: 'check', label: 'Value labels', get: o => o.series?.[0]?.valueLabel?.enabled !== false, set: (o, v) => setOnAllSeriesNested(o, 'valueLabel', 'enabled', !!v) },
      { type: 'check', label: 'Drop-off labels', get: o => o.series?.[0]?.dropOffLabel?.enabled !== false, set: (o, v) => setOnAllSeriesNested(o, 'dropOffLabel', 'enabled', !!v) },
    ],
  };
}

function schemaFor(type) {
  const sections = [globalSection(), legendSection(), tooltipSection(), paletteSection()];
  if (type === 'line') sections.push(lineSeriesSection(), axesSection());
  if (type === 'bar') sections.push(barSeriesSection(), axesSection());
  if (type === 'stackedArea') sections.push(stackedAreaSeriesSection(), axesSection());
  if (type === 'donut') sections.push(donutSeriesSection());
  if (type === 'sankey') sections.push(sankeySeriesSection());
  if (type === 'heatmap') sections.push(heatmapSeriesSection(), axesSection());
  if (type === 'funnel') sections.push(funnelSeriesSection());
  return sections;
}

// ─── State + render ──────────────────────────────────────────────────────
const state = {
  type: 'line',
  presetId: 'default',
  options: null,
  chart: null,
};

function render() {
  // Re-build options from preset baseline plus current options if same preset
  if (!state.options) state.options = buildPreset(state.type, state.presetId);
  state.options.container = document.getElementById('lab-chart');
  if (state.chart) { state.chart.destroy(); state.chart = null; }
  state.chart = agCharts.AgCharts.create(state.options);
  renderControls();
}

function renderControls() {
  const root = document.getElementById('lab-controls');
  root.innerHTML = '';
  const sections = schemaFor(state.type);
  sections.forEach((sec, sIdx) => {
    const s = document.createElement('div');
    s.className = 'lab__section';
    const header = document.createElement('div');
    header.className = 'lab__section-header';
    header.innerHTML = `${sec.title}<span class="caret">▾</span>`;
    header.addEventListener('click', () => s.classList.toggle('collapsed'));
    s.appendChild(header);
    const body = document.createElement('div');
    body.className = 'lab__section-body';
    sec.controls.forEach((ctrl) => body.appendChild(renderControl(ctrl)));
    s.appendChild(body);
    root.appendChild(s);
  });
}

function renderControl(ctrl) {
  const wrap = document.createElement('div');
  wrap.className = 'lab__field lab__field--row';
  const label = document.createElement('label');
  label.textContent = ctrl.label;
  wrap.appendChild(label);

  const cur = ctrl.get(state.options);
  const apply = (v) => { ctrl.set(state.options, v); state.chart.update(state.options); };

  if (ctrl.type === 'text') {
    const inp = document.createElement('input');
    inp.type = 'text'; inp.value = cur || '';
    inp.addEventListener('input', () => apply(inp.value));
    wrap.appendChild(inp);
  } else if (ctrl.type === 'number') {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.value = cur ?? '';
    if (ctrl.min != null) inp.min = ctrl.min;
    if (ctrl.max != null) inp.max = ctrl.max;
    if (ctrl.step != null) inp.step = ctrl.step;
    inp.addEventListener('input', () => apply(+inp.value));
    wrap.appendChild(inp);
  } else if (ctrl.type === 'range') {
    const row = document.createElement('div');
    row.className = 'lab__range-row';
    const inp = document.createElement('input');
    inp.type = 'range'; inp.value = cur ?? 0;
    inp.min = ctrl.min ?? 0; inp.max = ctrl.max ?? 100; inp.step = ctrl.step ?? 1;
    const val = document.createElement('span'); val.className = 'value'; val.textContent = inp.value;
    inp.addEventListener('input', () => { val.textContent = inp.value; apply(+inp.value); });
    row.appendChild(inp); row.appendChild(val);
    wrap.appendChild(row);
  } else if (ctrl.type === 'color') {
    const inp = document.createElement('input');
    inp.type = 'color'; inp.value = normalizeHex(cur) || '#000000';
    inp.addEventListener('input', () => apply(inp.value));
    wrap.appendChild(inp);
  } else if (ctrl.type === 'select') {
    const sel = document.createElement('select');
    (ctrl.options || []).forEach(opt => {
      const o = document.createElement('option');
      if (typeof opt === 'string') { o.value = opt; o.textContent = opt; }
      else { o.value = opt.value; o.textContent = opt.label; }
      sel.appendChild(o);
    });
    sel.value = cur ?? '';
    sel.addEventListener('change', () => apply(sel.value));
    wrap.appendChild(sel);
  } else if (ctrl.type === 'check') {
    const inp = document.createElement('input');
    inp.type = 'checkbox'; inp.checked = !!cur;
    inp.addEventListener('change', () => apply(inp.checked));
    const cell = document.createElement('div');
    cell.appendChild(inp);
    wrap.appendChild(cell);
  } else if (ctrl.type === 'colorList') {
    const list = document.createElement('div'); list.className = 'lab__palette';
    const arr = (cur || PALETTE).slice();
    arr.forEach((c, i) => {
      const inp = document.createElement('input');
      inp.type = 'color'; inp.value = normalizeHex(c) || '#000000';
      inp.addEventListener('input', () => { arr[i] = inp.value; apply(arr.slice()); });
      list.appendChild(inp);
    });
    wrap.appendChild(list);
  }
  return wrap;
}

function normalizeHex(c) {
  if (!c) return null;
  if (typeof c !== 'string') return null;
  if (c[0] === '#' && (c.length === 7 || c.length === 4)) return c;
  return null;
}

// ─── Copy JS config ──────────────────────────────────────────────────────
function exportConfig() {
  const cloned = stripContainer(state.options);
  const out = stringifyOptions(cloned);
  return `// AG Charts options — generated by Chart Lab\nconst options = ${out};\nagCharts.AgCharts.create({ ...options, container: document.getElementById('your-container') });\n`;
}
function stripContainer(opts) {
  const { container, ...rest } = opts;
  return rest;
}
function stringifyOptions(val, indent = 0) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'function') return val.toString();
  if (val instanceof Date) return `new Date(${val.getFullYear()}, ${val.getMonth()}, ${val.getDate()})`;
  if (typeof val === 'string') return JSON.stringify(val);
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    return '[\n' + val.map(v => padIn + stringifyOptions(v, indent + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    return '{\n' + keys.map(k => padIn + safeKey(k) + ': ' + stringifyOptions(val[k], indent + 1)).join(',\n') + '\n' + pad + '}';
  }
  return JSON.stringify(val);
}
function safeKey(k) {
  return /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(k) ? k : JSON.stringify(k);
}

// ─── Wire up ─────────────────────────────────────────────────────────────
function setType(type, presetId) {
  state.type = type;
  state.presetId = presetId || PRESETS[type][0].id;
  state.options = buildPreset(state.type, state.presetId);

  document.querySelectorAll('.lab__nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.type === type);
  });
  const titles = { line: 'Line', bar: 'Bar', stackedArea: 'Stacked area', donut: 'Donut', sankey: 'Sankey', heatmap: 'Heatmap', funnel: 'Funnel' };
  document.getElementById('lab-title').textContent = (titles[type] || type) + ' chart';
  const sel = document.getElementById('lab-preset');
  sel.innerHTML = '';
  PRESETS[type].forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.label; sel.appendChild(o);
  });
  sel.value = state.presetId;
  render();
}

document.querySelectorAll('.lab__nav-item').forEach(el => {
  el.addEventListener('click', () => setType(el.dataset.type));
});
document.getElementById('lab-preset').addEventListener('change', (e) => {
  state.presetId = e.target.value;
  state.options = buildPreset(state.type, state.presetId);
  render();
});
document.getElementById('lab-reset').addEventListener('click', () => {
  state.options = buildPreset(state.type, state.presetId);
  render();
});
document.getElementById('lab-copy').addEventListener('click', async () => {
  const text = exportConfig();
  try { await navigator.clipboard.writeText(text); }
  catch { prompt('Copy this:', text); return; }
  const t = document.getElementById('lab-toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
});

setType('line');
