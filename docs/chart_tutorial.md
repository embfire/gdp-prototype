# Building Charts in the GDP Prototype — Dragan's Setup

A step-by-step tutorial for creating a new chart in the `gdp-prototype` repo using the same workflow Dragan demoed on the call. No build tools, no npm — just HTML files, Cursor, and a browser refresh.

---

## 0. Prerequisites

You already have these from the call:

- **Cursor** (free editor with AI built in) — installed.
- **Chrome** (or any modern browser).
- **The repo cloned to your Desktop**: `~/Desktop/g360 2nd brain/gdp-prototype/`.
- **A working preview**: opening `gdp-prototype/beta/index.html` in your browser shows the beta dashboard.

> Reminder from the call: there's **no JSON, no package.json, no build step**. You edit an HTML file, hit save, then refresh the browser tab. That's the loop.

---

## 1. Pull the latest code FIRST (do this every session)

**Before you touch anything**, sync your local copy with what's on GitHub. Otherwise you'll be editing stale code and create merge conflicts.

1. Open Cursor.
2. Open the `gdp-prototype` folder (File → Open Folder).
3. Open the integrated terminal: **Ctrl + \`** (backtick) — or Terminal → New Terminal.
4. Run these two commands, one at a time:

   ```bash
   git checkout main
   git pull
   ```

   - `git checkout main` makes sure you're on the main branch (not a stale branch from last session).
   - `git pull` downloads the latest changes from GitHub.

   You should see either `Already up to date.` or a list of files that were updated. Either is fine — just don't skip this.

> **Do this every time you sit down to work**, not just the first time. Dragan, Hayle, and Claude Code are all committing to `main`, so the repo changes between your sessions.

---

## 2. Open the project

**In Finder** (not from the browser dialog — Dragan was clear about this):

1. Open Finder normally (Cmd+Space → "Finder").
2. Navigate to `Desktop → g360 2nd brain → gdp-prototype`.
3. Inside, look for the `beta/` folder. That's where the live work happens.
4. Open `beta/index.html` in your browser to confirm it renders.

**In Cursor** (you already have it open from Step 1):

- You'll see `beta/`, `docs/`, `assets/`, `analytics_page_patterns.md`, etc. in the sidebar.
- Always open the whole repo as the folder — not a single file — so Cursor's AI has the surrounding context.

---

## 3. Understand the chart stack

The prototype uses **AG Charts Community + Enterprise**, loaded from a CDN. You'll see this near the bottom of every page that has charts:

```html
<script src="https://cdn.jsdelivr.net/npm/ag-charts-community@13.2.1/dist/umd/ag-charts-community.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ag-charts-enterprise@13.2.1/dist/umd/ag-charts-enterprise.min.js"></script>
```

Charts get created against a `<div>` you place in the page, like:

```html
<div class="chart-card__placeholder chart-card__placeholder--detail" id="chart-area-my-chart"></div>
```

Then in a `<script>` block lower down:

```js
agCharts.AgCharts.create({
  container: document.getElementById('chart-area-my-chart'),
  data: [...],
  series: [...],
  axes: { x: {...}, y: {...} },
});
```

That's the whole pattern.

---

## 4. Use the Chart Lab to draft the chart visually

Before writing any code, **draft the chart in `beta/chart-lab.html`**. It's a sandbox Dragan built for designing chart configs without touching a dashboard page.

1. Open `beta/chart-lab.html` in your browser.
2. Pick a chart type on the left (Line, Bar, Stacked area, Donut, Sankey, Heatmap, Funnel).
3. Pick a preset from the top dropdown — it loads sample data and styling.
4. Tweak the controls on the right (palette, axes, labels, legend).
5. When it looks right, click **"Copy JS config"** at the top right.

You now have a working AG Charts config in your clipboard, already styled to the Bento/PAR conventions.

---

## 5. Add the chart to a real page

Say you want to add a new chart to `beta/dashboard-total-guests.html`. The pattern Dragan uses:

### 5a. Drop a container in the markup

Somewhere inside a card body:

```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">My new chart</h3>
  </div>
  <div class="card__content">
    <div class="chart-card__placeholder chart-card__placeholder--detail"
         id="chart-area-my-new-chart"></div>
  </div>
</div>
```

The `chart-card__placeholder` class sets the height. Use `--detail` for full-width detail pages, plain `chart-card__placeholder` for dashboard tiles.

### 5b. Paste the config in a `<script>` block

Below the chart container, wrap the lab-copied config in an init function:

```js
function initMyNewChart() {
  var container = document.getElementById('chart-area-my-new-chart');
  if (!container) return;

  agCharts.AgCharts.create({
    container: container,
    theme: { params: { fontFamily: 'Manrope, sans-serif' } },
    background: { fill: '#ffffff' },
    padding: { top: 8, right: 0, bottom: 0, left: 0 },
    data: MY_DATA,
    series: [
      { type: 'line', xKey: 'date', yKey: 'value', stroke: '#5A55E3', strokeWidth: 2 },
    ],
    axes: {
      x: { type: 'time', position: 'bottom' /* … */ },
      y: { type: 'number', position: 'left' /* … */ },
    },
  });
}

// Call it after fonts load, so the canvas doesn't flash with the wrong font:
document.fonts.ready.then(initMyNewChart);
```

The `document.fonts.ready` wrapper is required — it's in `analytics_page_patterns.md` under "Font Loading."

### 5c. Refresh the browser

Save the file. Switch to the browser tab. Hit **Cmd+R**. The chart appears.

That's the inner loop: edit → save → refresh.

---

## 6. Follow the patterns doc

Before merging anything, skim `analytics_page_patterns.md` in the repo root. Highlights you'll bump into:

- **Colors**: never invent custom colors. Use the 12-color `chartPalette12` (indigo, vermilion, periwinkle, amber, crimson, sky, golden, teal, emerald, coral, lavender, cyan). For 2-series charts use the first two.
- **Font**: Manrope, everywhere. Set `theme.params.fontFamily: 'Manrope, sans-serif'` on every chart.
- **Bar period comparisons**: same solid color for both periods, **diagonal stripe decal** on the previous period. Pattern config is in the doc.
- **Line charts**: hidden dots, 8px on hover; gradient area fill; `indigo300` for prior period (not transparency); `boundaryGap: false`; tight y-axis scales.
- **No shadow axis pointer**, no custom hover outlines, default tooltip positioning. These have all been tried and rejected — don't re-introduce them.
- **Legends**: `icon: 'roundRect'` (not `'rect'`); line-chart swatches `itemWidth: 12, itemHeight: 12`.
- **Resize**: use `ResizeObserver` for any chart in a flex container so it reflows.

> Rule from `CLAUDE.md` at the repo root: **never overwrite `analytics_page_patterns.md`**. Only append new sections — and only after you've actually shipped a new pattern.

---

## 7. Add a click-to-action menu (optional, detail charts only)

If your chart needs the "click a data point → View users / Create segment / Ask Ava" menu (as seen on `dashboard-total-guests.html`), use the existing helper.

1. Drop the `<div class="chart-point-menu">` markup somewhere on the page (copy it from `dashboard-total-guests.html`).
2. Inside your `init` function, after `agCharts.AgCharts.create(...)`, call:

```js
attachChartPointMenu(container, {
  plotLeft: 46,
  plotRightPad: 0,
  axisMinTime: new Date(2026, 2, 19).getTime(),
  axisMaxTime: new Date(2026, 3, 26).getTime(),
  axisMinValue: 1.097,
  axisMaxValue: 1.253,
  plotTop: 8,
  xAxisHeight: 30,
  data: MY_DATA,
  seriesValueKeys: { current: 'current', prev: 'prev' },
});
```

The full contract for this helper (anchoring, scroll behavior, series detection) is documented in `analytics_page_patterns.md` under "Chart data-point context menu."

---

## 8. Cursor tips for this workflow

- **Open the whole repo**, not just `beta/`. Cursor's chat needs `analytics_page_patterns.md` and the existing dashboard files in context to give consistent suggestions.
- **Ask in chat**: *"Create a line chart of weekly active guests, matching the style of `dashboard-total-guests.html`. Use the conventions in `analytics_page_patterns.md`."* It will produce something close to ship-ready.
- **Reference files explicitly**: `@beta/dashboard-total-guests.html` and `@analytics_page_patterns.md` in chat to pin them into context.
- **No need to re-explain conventions every time** — once Cursor has the patterns file in context, it'll apply them.

---

## 9. The full loop, end to end

1. **`git checkout main && git pull`** in the Cursor terminal — every session, before anything else.
2. Draft the chart in `beta/chart-lab.html` → Copy JS config.
3. Open the target page in Cursor (e.g. `beta/dashboard-total-guests.html`).
4. Add a `<div>` container with a unique `id`.
5. Paste the config into an `init` function, wrap in `document.fonts.ready.then(...)`.
6. Save → refresh browser → iterate.
7. Cross-link from the sidebar nav if this is a new page (rule from the patterns doc: update **all** files when adding a new page).
8. Commit when it's working: `git add . && git commit -m "Add X chart"` then `git push`.

That's it — no build, no deploy, no JSON. Just edit, save, refresh.
