# New Guest Acquisition Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-12
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card) and `[beta/dashboard-new-guest-acquisition.html](../../beta/dashboard-new-guest-acquisition.html)` (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how the metric is calculated, what filters do, what breakdowns exist, and what the detail page must include**.

---

## 1. Overview

A daily time-series line chart showing the **count of net-new identified guest profiles created per day** over the selected date range. Each X point = one calendar day. The Y value = the number of new guest profiles first seen on that day.

Two series are plotted simultaneously:

1. **This period** — solid line (`#5A55E3`, strokeWidth 2)
2. **Previous period** — dashed line (`#5A55E3`, lineDash `[2, 2]`, strokeWidth 2)

Both lines share the same color. The comparison line is distinguished by the dashed stroke and a striped legend marker, not a separate palette color.

---

## 2. Metric Definition

### What counts as a "new guest"

A guest is counted as new on the day their **first identified profile is created**. This includes:

- First loyalty program enrollment
- First IDR (Identity Resolution) match that creates a net-new profile

A guest is counted **once** in their lifetime — on their first-seen date. Re-identification of a previously known guest does not generate a new-guest event.

### What does not count

- Anonymous transactions with no identity match
- Profile merges where an existing guest's identity is consolidated — the profile already existed, so it does not contribute a new-guest event
- Loyalty re-enrollments if the guest profile already exists

### Daily granularity

The metric is a daily count, not a cumulative total. The chart shows acquisition velocity, not a running stock. A guest who visited on March 29 and March 30 is counted once — on March 29 — and not again on March 30.

---

## 3. Hero Metric

The card's primary KPI is the **sum of new guests across the entire selected date range** (period total, not a single day's count).

- **Value:** displayed in K-scale to one decimal (e.g. `47.2K`). Detail-page table cells use full-precision integers.
- **Comparison:** vs. the equivalent previous period. Show the previous period total in the sub-text (e.g. `43.5K prev period`).
- **Delta pill:** normal (non-inverse) semantics — higher acquisition is better, so:
  - Count up vs. prev → green pill (`chart-card__metric-pill--up`)
  - Count down vs. prev → red pill (`chart-card__metric-pill--down`)

---

## 4. Required Data Shape

The chart needs **one row per calendar day** with counts for the current and previous period:

```ts
type NewGuestAcqRow = {
  date: string;     // ISO date, e.g. "2026-04-08"
  current: number;  // count of new guest profiles created this day (current period)
  prev: number;     // count of new guest profiles created on the corresponding day of the previous period
};
```

### Aggregation contract

- Each row is the count of net-new profiles first identified on that calendar day.
- The series must be a **continuous daily sequence** for the full selected date range — do not drop days with zero new guests; return 0 instead.
- **Previous period alignment:** the prev value for date `D` is the new-guest count for the day at the same offset in the preceding period. For a 30-day range Apr 1–Apr 30, the prev row for Apr 1 maps to Mar 2, the row for Apr 2 maps to Mar 3, and so on.
- The API returns one payload covering both the current-period series and the aligned previous-period series.
- Filters (date range, location, loyalty, segments — see § 6) are applied server-side; the API returns only the rows the client renders.

### Breakdown data shape (acquisition channel)

When the `By acquisition channel` breakdown is active, each row splits the daily new-guest count by the channel of the guest's first interaction:

```ts
type NewGuestAcqChannelRow = {
  date: string;
  instore: number;   // first interaction was an in-store POS transaction
  online:  number;   // first interaction was an online/digital order
  kiosk:   number;   // first interaction was a kiosk transaction
  // add channels as the data model evolves
};
```

The sum of all channel values equals the `current` total for that day. The breakdown does not have a prev-period comparison series — channels are shown as distinct solid lines, each in a separate palette color.

---

## 5. Chart Specification

| Property | Value |
| --- | --- |
| Library | AG Charts (Community v13) |
| Type | Line, two series (current + prev) |
| X-axis | Time, one tick per day |
| Y-axis | Count of new guests (K-scale labels), starts at 0 |
| Series: This period | Solid line, `#5A55E3` (Bento indigo-900), strokeWidth 2 |
| Series: Previous period | Dashed line, same color `#5A55E3`, lineDash `[2, 2]`, strokeWidth 2 |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }` on every series) — replaced with a manual tooltip |
| Native AG Charts crosshair | Enabled via `crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] }` on the X-axis (dashboard card); the manual tooltip handles the detail page's crosshair behavior |

### Marker behavior

Markers are hidden at rest (`size: 0`) and shown as a 10px circle (fill = series color, white stroke 2px) only on hover via `itemStyler`:

```js
itemStyler: function(params) {
  if (params.highlightState === 'highlighted-item') {
    return { size: 10, fill: '#5A55E3', stroke: '#ffffff', strokeWidth: 2 };
  }
  return { size: 0 };
}
```

### Y-axis labels

K-scale formatter: `(+params.value).toFixed(2).replace(/\.?0+$/, '') + 'K'` — strips trailing zeros so `1.50K` renders as `1.5K` and `2.00K` as `2K`.

### Y-axis bounds

The dashboard card uses `interval: { values: [1.40, 1.60, 1.80, 2.00] }` and the detail page uses finer intervals `[1.30, 1.40, 1.50, 1.60, 1.70, 1.80, 1.90, 2.00]`. **These hardcoded bounds are placeholder data scaling — derive min/max from the real data range when wiring up.**

### Breakdown: By acquisition channel

When the `acq-channel` breakdown is active, replace the current/prev series pair with one solid line per channel using sequential palette colors (`#5A55E3`, `#FF6600`, `#8C9FFF`, …). There is no prev-period comparison in breakdown mode. Y-axis bounds and ticks must be recalculated for the channel scale, which is lower than the total (roughly 10–50% of the total depending on the channel split).

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md § Global Filters](../dashboard_beta_ux.md#global-filters)`. Every filter currently defined globally applies to this chart:

| Filter | Options | Applies | Notes |
| --- | --- | --- | --- |
| **Date range** | 7D, 30D, 90D, 12M, YTD, Custom | Yes — full support | Drives the X-axis range. No minimum-range constraint; even 7D renders fine because each X point is a daily count. |
| **Compare to** | Previous period, Previous year, No comparison | Yes — both chart and hero | The previous-period series renders on the chart. When "No comparison" is selected, hide the dashed line, hide the prev-period legend button, and drop the "43.5K prev period" sub-text. The delta pill also hides. |
| **Stores and Store groups** | Single or multi-store / store group | Yes | Applied server-side. A new guest attributed to Store A appears only in Store A's count; filtering to Store B would not include them. |
| **Loyalty / non-loyalty** | Loyalty program members / non-members | Yes | Filters which profiles are counted. A non-loyalty IDR profile is still a new guest if a guest profile was created for them. |
| **Segments** | Any saved guest segment | Yes | Restricts the chart to guests who match the selected segment(s) at the time of their first profile creation. |

### No-comparison case

When "Compare to" is set to "No comparison": hide the prev-period series from the chart, remove its legend item, and drop the sub-text line under the hero value entirely. The chart and hero value are otherwise unaffected.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- Header: title `New guest acquisition` + subtitle `New guest profiles created over time`. Entire header is clickable → navigates to the detail page.
- Hero metric block: period-total K value + green/red delta pill + "43.5K prev period" sub-text.
- Legend: 2 toggle buttons — "This period" (solid marker) and "Previous period" (striped marker). Toggling hides that series from the chart. At least one must remain visible.
- Line chart filling the remaining card space. The card uses a flex-fill CSS rule — see `.chart-card[data-metric-id="new-guest-acquisition"]` in `beta/beta.css`.
- No breakdown dropdown on the dashboard card — breakdowns are detail-page only.

---

## 8. Detail Page (`beta/dashboard-new-guest-acquisition.html`)

Same content, more space, plus a breakdown dropdown and a data table.

### Layout

Breadcrumb → title bar (h1 + Help button) → global filter bar → chart card → data table → pagination.

### Breakdown dropdown

Lives in the chart card header controls. Options:

| Value | Label | Series behavior |
| --- | --- | --- |
| `total` | Total | Two lines: current (solid) + previous period (dashed) |
| `acq-channel` | By acquisition channel | One solid line per channel, no comparison |

Switching breakdown rebuilds the chart series and legend in place via `rebuildChart(mode)`. The legend regenerates to match the active breakdown.

### Chart card

Same data and series colors as the dashboard card, plus:

- Taller plot area (`.chart-card__placeholder--detail`, currently 389px)
- More granular X-axis ticks — `~3-day` intervals instead of weekly (detail page: every 3 days from Mar 22 per the prototype)
- More Y-axis intervals (8 ticks vs. 4 on the dashboard card)
- Same hero metric, same legend toggle behavior

### Data table

One row per calendar day in the selected range:

| Column | Format | Notes |
| --- | --- | --- |
| Date | `Apr 8, 2026` | Left-aligned. Header uses `.chart-th-inner--start` |
| This period | Integer count, comma-separated (e.g. `1,523`) | Right-aligned |
| Previous period | Integer count | Right-aligned |
| Δ | Signed integer (e.g. `+81`, `-42`) | Right-aligned |
| Δ% | Colored pill | Right-aligned. Green `#effaf9` / `#257469` if ≥ 0; red `#fdecef` / `#b1294a` if negative. Font weight 500. Shows two decimal places (e.g. `+5.32%`). |

Sorting affordances appear in column headers (`.chart-sort-icon` with the `sort` Material Symbol icon).

When the `By acquisition channel` breakdown is active, the table should show one column per channel instead of This period / Previous period / Δ / Δ%. The exact column set for the channel breakdown table is TBD (tracked in § 10 Open Questions).

### Pagination

10 rows per page. Same Bento pagination component as other detail pages — `.pagination__*` classes in `bento.css` and `beta.css`.

---

## 9. Interactions

### Hover → Tooltip

Manual implementation — AG Charts native tooltip is disabled on all series.

**Dashboard card tooltip:**

- On `mousemove` over the chart container, snap to the nearest data point on X.
- Show a tooltip floated right of the cursor (flip left if it would overflow the viewport) with:
  - Header: `New guest acquisition` (16px, weight 800)
  - Row 1: solid indigo `12×12` swatch + date label (e.g. `Apr 8`) + K value for current period
  - Row 2: delta pill (e.g. `+5.32%`, green or red) + "vs. previous period" label
  - Row 3 (only if prev-period series is visible): striped indigo swatch + "Previous period" label + K value (subdued, weight 400)
- Tooltip hides on `mouseleave` and when the cursor is outside the plot bounds.
- If the current-period series is hidden (user toggled it off), hide the tooltip entirely.

**Detail page tooltip:**

On the detail page the `buildBreakdownTooltip(cfg, mode)` function rebuilds the tooltip whenever the breakdown changes. In `total` mode the rows match the dashboard card. In `acq-channel` mode each visible channel gets a row (color swatch + channel name + K value) with no delta row.

### Click → Context menu (detail page only)

- Click anywhere inside the plot area → opens a context menu anchored next to the cursor and snapped to the nearest data point.
- The menu header shows: color dot (solid or striped depending on which series the cursor was nearest to) + date + K value for that series.
- The `attachChartPointMenu(container, opts)` helper handles the snapping and series-selection logic — it picks the series whose projected Y is closest to the cursor Y so clicking near the dashed line opens the menu for the prev-period series.
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. The `onPointMenuAction(action)` handler receives the action and the snapped data row — wire to real flows when ready.
- Clicking outside the menu closes it.

This pattern is the same as the Total Guests detail page; see `[dashboard_beta_ux.md § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu)`.

---

## 10. Open Questions for PM

These are not blockers for the chart wiring but should be settled before the metric ships:

1. **Profile creation definition.** Confirm: does a new guest count on the date of their first IDR match (the earliest transaction we can attribute), or on the date the profile was physically created in the database (which may lag the transaction date during batch processing)?
2. **Profile merges.** When two profiles are merged, what happens to the new-guest count for the dates of the earlier profile? Does one of the dates get credited as the canonical new-guest date and the other deleted, or are both preserved?
3. **Channel breakdown completeness.** The prototype shows In-store, Online, and Kiosk. Confirm the full channel taxonomy (e.g. does third-party delivery count? drive-through? app-only?). Also confirm how to handle guests whose first-seen channel is unknown.
4. **Breakdown table columns.** When "By acquisition channel" is active, what columns should the data table show? (One numeric column per channel? Or totals plus a dominant-channel column?)
5. **Zero-acquisition days.** Should days with 0 new guests be included in the table and chart? Confirm whether these are expected (e.g. closed location, data gap) or should surface a data-quality warning.
6. **Loyalty vs. IDR split.** Should the hero metric (and optionally the chart) be breakable into "loyalty-enrolled new guests" vs. "IDR-only new guests" as a separate dimension from the acquisition channel? Or is that captured by the existing Loyalty/non-loyalty global filter?

---

## 11. Reference Files

- **Dashboard UX patterns (cards, filters, detail page, context menu)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, font, tooltip, crosshair)** — `[docs/analytics_page_patterns.md](../analytics_page_patterns.md)` and `[docs/dashboard_beta_ux.md § Chart Colors](../dashboard_beta_ux.md#chart-colors)`
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (search `initNewGuestAcqChart`, `NEW_GUEST_ACQ_DATA`)
- **Reference implementation — detail page** — `[beta/dashboard-new-guest-acquisition.html](../../beta/dashboard-new-guest-acquisition.html)`
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `new-guest-acquisition`)
