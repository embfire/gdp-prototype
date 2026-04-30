# Retention Cohort Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-04-29
**Reference implementation:** [beta/index.html](../../beta/index.html) (dashboard card) and [beta/dashboard-retention-cohort.html](../../beta/dashboard-retention-cohort.html) (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how retention is defined, what the two chart types require, what filters do, and what the detail page must include**.

---

## 1. Overview

This chart has two distinct visual representations:

- **Dashboard card**: a line chart plotting M+1 retention rate over time — one point per acquisition cohort month, current year-equivalent vs. prior year-equivalent, across the selected date range.
- **Detail page**: a heatmap (cohort matrix) showing every M+N retention rate for every cohort, up to M+12. Rows = acquisition months (oldest top → newest bottom), columns = M+1 through M+12. Newer cohorts have fewer filled cells because not enough time has elapsed — the result is a lower-triangular grid.

The two views are complementary: the line chart shows the trend in first-month retention; the heatmap shows the complete lifecycle of each cohort.

---

## 2. Cohort and Retention Definitions

### Cohort assignment

A **cohort** is the set of all identified guests whose **first transaction** occurred in a given calendar month. Cohort membership is permanent — a guest belongs to exactly one cohort forever.

- Anonymous transactions do not count. Only identified guests are assigned to a cohort.
- If a guest profile is stitched from anonymous → identified, use the earliest identified transaction date to determine the cohort month.

### M+N retention

M+N retention for a cohort is the **percentage of cohort members who completed at least one transaction in the N-th calendar month following their acquisition month**.

- M+0 = the acquisition month itself (always 100% by definition — not shown).
- M+1 = % who transacted in the calendar month immediately after acquisition.
- M+2 = % who transacted two calendar months after acquisition — independent of M+1 (a guest who skipped M+1 can still appear in M+2).
- M+N values decline over time as fewer guests remain active.

This is **period retention** (did the guest transact in that specific month?), not cumulative retention (did the guest transact in that month or any earlier month?). Confirm this interpretation with PM before writing queries — see § 11 Open Questions.

---

## 3. Hero Metric

The hero displays the **M+1 retention rate of the most recently complete acquisition cohort**.

- "Most recently complete" = the latest cohort month for which the M+1 period has fully elapsed. The rule for what counts as "closed" depends on data ingestion lag — see § 11 Open Questions.
- **Format**: percentage to one decimal, e.g. `34.2%`.
- **Pill semantics**: standard (non-inverse). Higher M+1 retention is better — green pill when up, red when down. Contrast with the lifecycle chart's At-Risk hero, which uses an inverse pill.
- **Period text**: `Latest M+1 cohort · [prev value]% prev period` (e.g. `Latest M+1 cohort · 31.0% prev period`).
- **Info indicator**: an inline info icon + text `Showing 90D minimum` appears next to the period text, with a hover tooltip: `"Showing 90 days minimum — needs more than 3 months of cohort data"`. This indicator is always visible on the dashboard card (see § 8).

---

## 4. Required Data Shape

### Dashboard card (line chart)

One row per cohort month covering the selected date range for the current period and the equivalent months for the comparison period:

```ts
type CohortM1Row = {
  date: Date;       // first day of the acquisition month (e.g. new Date(2025, 3, 1) = Apr 1 2025)
  current: number;  // M+1 retention rate as decimal for this period (e.g. 0.342 = 34.2%)
  prev: number;     // M+1 rate for the same calendar month in the comparison period
};
```

- One row per cohort month in the selected range.
- `prev` is plotted on the same X positions as `current` (same month labels, prior year's values).
- If the comparison mode is "No comparison", `prev` can be omitted or set to null; the series is hidden.

### Detail page (heatmap)

One flat row per cohort × period cell, only for cells where enough time has elapsed for M+N to be fully measured:

```ts
type RetentionHeatmapCell = {
  cohort: string;       // display label, e.g. "Mar 26"
  cohortSize: number;   // total guests acquired in that month
  period: string;       // "M+1", "M+2", ..., "M+12"
  retention: number;    // retention rate as a percentage (e.g. 34.2, NOT 0.342)
};
```

- Do not emit rows for periods that have not yet elapsed — the table renders those positions as `—` and the heatmap simply has no data for those coordinates.
- Note the unit difference: the heatmap cells use percentage floats (34.2), while the line chart series use decimal fractions (0.342).

### Aggregation contract

- Filters (date range, location, loyalty, segments) are applied server-side before computing cohort membership and M+N counts.
- The selected date range determines which cohort months are included, subject to the 90D minimum floor (see § 7 Filters).
- `cohortSize` = count of identified guests in that cohort month, after applying any active filters.

---

## 5. Chart Specification — Dashboard Card (Line Chart)

| Property | Value |
| --- | --- |
| Library | AG Charts (Enterprise v13) |
| Type | `line`, two series |
| X-axis | Time (`type: 'time'`), one point per cohort month |
| Y-axis | Retention rate (decimal fraction); domain derived from data |
| Series: current | Solid, Indigo-900 (`#5A55E3`), `strokeWidth: 2` |
| Series: prev period | Dashed (`lineDash: [2, 2]`), same Indigo-900, `strokeWidth: 2` |
| Markers | Hidden at rest (`size: 0`); appear on hover (`size: 10`, fill `#5A55E3`, white stroke) |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }` on both series) — replaced with manual tooltip |
| Crosshair | Native AG Charts crosshair enabled (`stroke: '#c6c6c6'`, `lineDash: [4, 4]`) on the X-axis |

**Y-axis bounds (prototype):** `min: 0.26, max: 0.36`, `interval.values: [0.26, 0.28, 0.30, 0.32, 0.34, 0.36]`. **Replace with bounds derived from the real data range when wiring up** — hard-coding these values will break when actual retention rates differ from the prototype.

**Y-axis label formatter:** convert decimal to a percentage string, stripping trailing `.0`:
```js
(v * 100).toFixed(1).replace(/\.0$/, '') + '%'
// 0.30 → "30%", 0.342 → "34.2%"
```

**X-axis tick interval (prototype):** quarterly — April, July, October, January hardcoded as `interval.values`. For the 12M range with 12 cohort points this is correct. For shorter ranges (90D = ~3 cohort months), show every month tick instead.

**X-axis label formatter:**
```js
d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '")
// → "Apr '25"
```

---

## 6. Chart Specification — Detail Page (Heatmap)

| Property | Value |
| --- | --- |
| Library | AG Charts **Enterprise** v13 — `heatmap` is an enterprise-only series type |
| Type | `heatmap` |
| `xKey` | `'period'` |
| `yKey` | `'cohort'` |
| `colorKey` | `'retention'` |
| X-axis | Category (`type: 'category'`), position `'top'`, ordered `['M+1','M+2',...,'M+12']` via `keys` |
| Y-axis | Category (`type: 'category'`), position `'left'`, `reverse: true` (oldest cohort at top) |
| Color range | `['#eef0fc', '#5A55E3']` (light indigo → Indigo-900) |
| Color domain | `[4, 36]` (prototype calibration — **derive min/max from real data**) |
| Cell stroke | `'#ffffff'`, `strokeWidth: 2` (white grid lines between cells) |
| Series label | Disabled (`label: { enabled: false }`) |
| Native AG Charts tooltip | Disabled |
| Native AG Charts legend | Disabled (`legend: { enabled: false }`) — replaced with custom color-scale legend |

**`axes` syntax:** The heatmap in AG Charts v13 uses the object form `{ x: {...}, y: {...} }` rather than the usual array. See the reference implementation in `dashboard-retention-cohort.html`.

**Color interpolation formula** (used in both the heatmap `colorRange` and the data table cell backgrounds):
```js
var t = Math.max(0, Math.min(1, (value - domainMin) / (domainMax - domainMin)));
var r = Math.round(0xee + (0x5A - 0xee) * t);
var g = Math.round(0xf0 + (0x55 - 0xf0) * t);
var b = Math.round(0xfc + (0xe3 - 0xfc) * t);
// → rgb(r, g, b)
```

**Text contrast on table cells:** switch cell text to white (`#ffffff`) when `value > 22`, black (`#000000`) otherwise. The same threshold applies to the color dot in the context menu header.

**Color-scale legend:** a custom HTML element (`div.retention-heatmap-legend`) rendered above the chart area inside `.chart-card__body`. It shows: `"Lower retention"` ← gradient bar → `"Higher retention"`. This is not AG Charts native legend — it is a static visual indicator only.

**Plot-area offsets (manual tooltip hit detection):** the tooltip and click handler compute the cell under the cursor by dividing the plot area into a `NUM_ROWS × NUM_COLS` grid using hardcoded offsets:

| Constant | Prototype value | Derived from |
| --- | --- | --- |
| `PLOT_LEFT` | `58` | Y-axis label width (~42px for "Apr 25" at 12px/500) + 8px padding + chart padding (8px) |
| `PLOT_TOP` | `32` | X-axis label height (~16px line-height) + 8px padding + chart padding (8px) |
| `PLOT_RIGHT_PAD` | `16` | Chart right padding |
| `PLOT_BOTTOM_PAD` | `8` | Chart bottom padding |

These constants are estimates. With real data (different label lengths or font metrics), they may need adjustment. A more robust approach is to query the AG Charts plot-area element's `getBoundingClientRect` at render time if label widths prove unpredictable.

---

## 7. Filters

Inherited from the global dashboard filter bar — see [dashboard_beta_ux.md § Global Filters](../dashboard_beta_ux.md#global-filters).

| Filter | Options | Applies | Notes |
| --- | --- | --- | --- |
| **Date range** | 7D, 30D, 90D, 12M, YTD, Custom | Yes — with 90D minimum floor | Determines which acquisition cohort months are included. See "Minimum range constraint" below. |
| **Compare to** | Previous period, Previous year, No comparison | Dashboard card line chart only | Drives the prev-period dashed series. The heatmap on the detail page does not apply a comparison dimension — it is already a historical view by construction. When "No comparison" is selected, hide the dashed series and omit the prev-period row from the tooltip. |
| **Stores and Store groups** | Single or multi-store / store group | Yes | A guest is assigned to a cohort if their first transaction was at the selected store(s). M+N is counted only if they transact at the selected store(s) in month N. See "Store filter scope" note below. |
| **Loyalty / non-loyalty** | Loyalty program members / non-members | Yes | Filters which guests are included in cohort membership. Does not affect the M+N retention formula itself. |
| **Segments** | Any saved guest segment | Yes | Restricts cohort membership to guests matching the segment. See "Segment filter timing" in § 11. |

### Minimum range constraint

Cohort analysis requires at least 3 complete cohort months to be meaningful. The minimum effective range is **90D**.

- When the selected range is below 90D (7D or 30D), the chart renders at the 90D floor and shows: **"Showing 90D minimum — needs ≥3 months of cohort data"**.
- The chart is **never hidden** when the range is too short — it always renders at its minimum supported range.
- The constraint is declared in `CHART_CONSTRAINTS` in `index.html`:
  ```js
  'retention-cohort': { minDays: 90, minLabel: '90D', reason: 'needs ≥3 months of cohort data' }
  ```
- The detail page shows the same info indicator inline next to the period text (see § 8).

### Store filter scope

A guest is included in the cohort if their first-ever transaction was at the selected store(s). For M+N, the guest is counted only if they transact at the selected store(s) in month N. This means a loyal guest who started at Store A but moved to Store B would not appear in Store B's cohort, and their M+N transactions at Store B would not be counted if Store A is the filter. Confirm this interpretation with PM if a different scope (e.g. first transaction at the filtered store, regardless of first-ever transaction) is preferred.

### "Compare to" and the detail-page heatmap

The comparison filter has no effect on the heatmap. The heatmap always displays the full cohort matrix for the cohort months that fall within the selected date range. The hero metric on the detail page still shows the previous-period comparison value.

---

## 8. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- **Header**: title `Retention cohort` + subtitle `M+1 retention rate by acquisition cohort`. Header is clickable → navigates to `dashboard-retention-cohort.html`.
- **Hero metric block**: latest M+1 cohort percentage + standard (non-inverse) delta pill + period text.
- **Info indicator**: always visible inline next to the period text — info icon + `"Showing 90D minimum"` text + hover tooltip with full message. This is unconditionally rendered; it does not appear only when the range constraint is active.
- **Toggleable legend**: 2 buttons — "This period" (solid Indigo-900 square) and "Prev period" (striped). At least one must remain visible. Toggling updates the chart and suppresses that series from the tooltip.
- **Line chart** (`type: 'line'`) filling the remaining card height.

The dashboard card uses a line chart, not a heatmap. The heatmap is detail-page only.

---

## 9. Detail Page (`beta/dashboard-retention-cohort.html`)

Breadcrumb → title bar (h1 + Help button) → global filter bar → chart card → data table.

### Chart card

- Same header structure, hero metric, and info indicator as the dashboard card.
- **Color-scale legend** (not series legend) above the chart area.
- **Heatmap** at 400px fixed height. The inline `<style>` in the detail page sets `.chart-card[data-metric-id="retention-cohort"] .chart-card__placeholder--detail { height: 400px; flex: none; }` — this overrides the default `flex-fill` behavior that applies to all other detail-page charts.
- "Get insight" button (Ava — currently stubbed).
- 3-dot overflow menu with Export CSV, Download chart, Ask Ava.

### Data table

Wide cohort grid — one row per acquisition cohort, one column per M+N period. No pagination (cohort rows are bounded by the window; at most 12 rows for the default 12M range).

| Column | Format | Notes |
| --- | --- | --- |
| Cohort | `Mar 26` display label | Left-aligned, `font-weight: 600` |
| Cohort size | Integer, comma-separated (e.g. `11,280`) | Right-aligned, `font-variant-numeric: tabular-nums` |
| M+1 … M+12 | Percentage to 1 decimal (e.g. `34.2%`) | Center-aligned; cell background = heatmap color; text `#000` when value ≤ 22, `#fff` when > 22 |
| Empty cells (future periods) | `—` (em dash), `color: #9ca3af` | Center-aligned |

**Table header row**: `background-color: #dfe1e2`, no border-bottom. Header cells: `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 8px 16px`. Period-column headers are center-aligned.

The data table does not include a "Prev period" or "Δ" column — this is a cohort grid, not a time-series comparison table.

---

## 10. Interactions

### Hover → Tooltip

Both chart variants use manual tooltips (AG Charts native tooltip disabled on all series).

**Dashboard card (line chart):**
- On `mousemove`, compute cursor X relative to the plot left edge and the axis time domain (`AXIS_MIN_TIME` / `AXIS_MAX_TIME`) to derive a target timestamp, then snap to the nearest point in `RETENTION_COHORT_DATA`.
- The native AG Charts crosshair handles the vertical dashed line — no manual line drawing needed here (contrast with the lifecycle chart, which draws it manually).
- Tooltip header: `"M+1 retention"` (bold, 16px/800).
- Current period row: solid Indigo square + `"[Month] cohort"` label (e.g. `"Mar '26 cohort"`) + value in bold.
- Delta pill: `"[±N.NN%] vs prev period"` — green background when positive, red when negative.
- Prev period row (only if prev series is visible): striped marker + `"Prev period"` + prev value in subdued color.
- If only the prev series is visible (current toggled off), hide the tooltip entirely.

**Detail page (heatmap):**
- On `mousemove`, divide the plot area into a `NUM_ROWS × NUM_COLS` grid using the plot-offset constants (`PLOT_LEFT = 58`, `PLOT_TOP = 32`, `PLOT_RIGHT_PAD = 16`, `PLOT_BOTTOM_PAD = 8`).
- Compute `colIndex` and `rowIndex` from cursor position within the plot bounds.
- If `colIndex ≥ COHORT_MATRIX[rowIndex].length` (cursor in the empty triangular region), hide the tooltip.
- Tooltip shows: cohort label bold (e.g. `"Mar 26 cohort"`), M+N period subdued (e.g. `"M+1"`), Retention % value bold, Cohort size.
- Both elements hide on `mouseleave`.

### Click → Context Menu (detail page only)

- Clicking a filled heatmap cell opens the context menu anchored at the cursor.
- The hit-test logic is the same as the tooltip: compute `colIndex` / `rowIndex`; ignore clicks in empty triangular cells.
- Menu header: color dot (using the `retentionCellBg(retention)` interpolation) + `"[Cohort] · [Period]"` on the left (e.g. `"Mar 26 · M+1"`) + retention value on the right (e.g. `"34.2%"`).
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. The `onPointMenuAction(action)` handler receives the action string — wire to real flows when ready.
- Menu closes on click outside.

Pattern is the same as other detail pages; see [dashboard_beta_ux.md § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu).

---

## 11. Open Questions for PM

These are not blockers for wiring the chart but should be settled before the metric ships:

1. **Period vs. cumulative retention.** Is M+N "transacted in calendar month N after acquisition" (period retention — consistent with the prototype's declining values) or "transacted in any month from M+1 through M+N" (cumulative/survival retention)? These produce different numbers and different curve shapes.
2. **"Most recently complete" cohort rule.** What determines when a cohort's M+1 period is considered closed — the end of the calendar month, or a fixed lag after month-end for data ingestion? This determines which cohort is shown as the hero.
3. **Segment filter timing.** When a segment filter is active, should cohort membership be evaluated using the guest's segment status at acquisition time, or their current segment status? Answers differ for dynamic segments.
4. **Store filter scope.** Is the cohort "guests whose first transaction was at the selected store" or "guests who have transacted at the selected store within the date range, evaluated against their full history"? The current spec assumes the former.
5. **M+N cap.** Is 12 months the permanent cap, or configurable per-tenant at GA?
6. **Comparison on the detail-page heatmap.** Should the heatmap ever support a comparison mode (e.g. overlaying prev-year values), or is it intentionally a standalone historical view?
7. **Identified-guest scope.** Confirm that anonymous-only visitors are fully excluded from cohort membership.

---

## 12. Reference Files

- **Dashboard UX patterns (cards, filters, detail page)** — [docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)
- **Reusable chart conventions (palette, font, etc.)** — [docs/dashboard_beta_ux.md § Chart Colors](../dashboard_beta_ux.md#chart-colors)
- **Reference implementation — dashboard card** — [beta/index.html](../../beta/index.html) (search `initRetentionCohortChart`, `RETENTION_COHORT_DATA`, `toggleRetentionSeries`)
- **Reference implementation — detail page** — [beta/dashboard-retention-cohort.html](../../beta/dashboard-retention-cohort.html) (search `initRetentionCohortChart`, `COHORT_MATRIX`, `retentionCellBg`)
- **Card layout CSS** — [beta/beta.css](../../beta/beta.css)
