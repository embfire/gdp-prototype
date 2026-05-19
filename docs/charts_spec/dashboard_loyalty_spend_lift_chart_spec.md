# Loyalty Spend Lift Chart — Implementation Spec (v2)

**Audience:** Engineering — connecting the prototype to real data  
**Last updated:** 2026-05-19  
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card, vertical bars) and `[beta/dashboard-loyalty-spend-lift.html](../../beta/dashboard-loyalty-spend-lift.html)` (detail page, trend line chart + table)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how the lift metric is calculated, what the cohort window rule is, what filters do, and what the detail page must include**.

---

## 1. Overview

**Loyalty Spend Lift** measures how much more (or less) guests spend per visit *after* they enrol in the loyalty program compared to *before* they enrolled — using the same cohort of guests as both the baseline and the treatment.

The metric answers: *"Does joining the loyalty program increase how much a guest spends per visit?"*

The chart has two views over the same underlying cohort data:

- **Dashboard card** — summary KPI. Hero = `$ lift` (signed dollar delta). Chart body = two vertical bars showing the before and after average ticket for the effective cohort window.
- **Detail page** — two artifacts stacked:
  1. **Trend chart** — daily avg `$ lift` per enrollment-cohort date, current and previous period as two line series.
  2. **Data table** — one row per enrollment-cohort date with enrolled guests, avg pre/post ticket, `$ lift`, and `% lift`.

> **Metric framing.** This is a *before/after enrollment* measure, not a *loyalty-vs-anonymous* comparison. A guest who has never enrolled does not appear in this data. This is the correct framing for proving the program changes behavior.

---

## 2. Metric Definition

These rules are the source of truth for what a "cohort", "window", and "lift" mean.

| Concept | Definition |
|---|---|
| **Enrollment cohort window** | The range of enrollment dates used for this period. Not the same as the selected dashboard date range — see § Cohort Shifting below. |
| **N (window length)** | `DATEDIFF(selected_dateTo, selected_dateFrom) + 1` (inclusive). The pre-enrollment window and post-enrollment window are both exactly `N` days long. |
| **Pre-enrollment avg ticket** | `Σ(transaction amounts in the N days before the guest's enrollment date) ÷ count(transactions)` for all enrolled guests in the cohort. |
| **Post-enrollment avg ticket** | `Σ(transaction amounts in the N days from enrollment date) ÷ count(transactions)` for the same guests. |
| **$ lift** | `post-enrollment avg ticket − pre-enrollment avg ticket`. Signed. Positive = guests spend more after enrolling. |
| **% lift** | `$ lift ÷ pre-enrollment avg ticket × 100`, rounded to two decimals. `null` when pre-enrollment spend is zero. |
| **Lift Δ (period over period)** | `((current lift − prev lift) / prev lift) × 100` expressed as a percentage. Used only for the hero delta pill. |

### Cohort shifting rule

The dashboard filter selects an *as-of* period (e.g. the last 30 days). To ensure every enrolled guest's full post-enrollment window has actually elapsed by the end of that period, the enrollment cohort window is **shifted backward by its own length**:

```
cohortDateFrom = selected_dateFrom − N days
cohortDateTo   = selected_dateTo   − N days
completeAsOf   = selected_dateTo
```

Only guests whose `enrollment_date + N ≤ completeAsOf` are included. This guarantees complete pre and post windows for every cohort member.

**Consequence for the UI:** The effective cohort dates shown on the card and detail page will always be older than the selected dashboard range. A 30-day dashboard selection, for example, will show cohorts from 30–60 days ago. This is expected and correct — it must be communicated to the user via the cohort range notice (see § 7).

### What does and does not count

- **Enrolled guests only.** Guests who have never enrolled are not in either window.
- **Complete windows only.** Any enrolled guest whose post-enrollment window extends beyond `completeAsOf` is excluded entirely from the cohort for that period.
- **Transaction amount.** Use `checkins.receipt_amount` (Punchh). This is post-discount, pre-tax — confirm with PM if the target is net-purchase or gross.
- **Transaction deduplication.** Transactions are counted at the `checkin_id` level (one row per unique check-in event), joined from `fact_point_events` via `checkin_id`.

---

## 3. Hero Metric

The hero appears on the dashboard card and is repeated on the detail page's chart card.

- **Primary value:** `$ lift` for the effective cohort window (e.g. `+$4.39`). Sign always shown — `+` for non-negative, `−` for negative.
- **Delta pill:** `% change` of `$ lift` vs. the previous-period cohort window (e.g. `+22.11%`). Sign always shown. Standard non-inverse colors: higher lift is better, green for up, red for down.
- **Period sub-text — card:** `{value} previous period avg` — the previous period's `$ lift` value. Hides when `Compare to` = `No comparison`.
- **Period sub-text — detail card:** same value, same position, same hide rule.
- **Cohort range notice:** `Included cohorts: {from} to {to}` — shown below the period sub-text on both card and detail. An info icon with a tooltip explains the shifting: *"This chart uses guests who enrolled during this cohort window. We shift the cohort back so every guest has a complete post-enrollment window for the selected date range."* Hides when no cohort data is available.

---

## 4. Required Data Shape

The chart needs **one period summary + two daily series (current and previous period)**, keyed by enrollment-cohort date.

```js
// Period summary — card hero bars
const SpendLiftSummary = {
  avgPreSpend:  14.25,    // avg ticket before enrollment across the whole cohort
  avgPostSpend: 17.40,    // avg ticket after enrollment
  lift:          3.15,    // avgPostSpend - avgPreSpend
  liftPct:      22.11,    // lift / avgPreSpend * 100
  liftPrev:      2.10,    // lift for the previous-period cohort
  deltaPct:     50.00,    // (lift - liftPrev) / liftPrev * 100
  effectiveDateFrom: '2026-03-18',   // cohort window start (after shifting)
  effectiveDateTo:   '2026-04-17',   // cohort window end
};

// Daily series — detail trend chart
// One entry per enrollment-cohort date (after shifting + completeness filter)
const SpendLiftSeriesPoint = {
  date:           '2026-03-18',
  enrolledGuests: 120,         // guests enrolled on this date who have a complete window
  avgPreSpend:     14.10,
  avgPostSpend:    17.20,
  lift:             3.10,
  liftPct:         21.99,
};

// Two arrays: seriesCurrent (current cohort window) and seriesPrevious (prev-period cohort)
```

### Aggregation contract

- All aggregation happens server-side. The client never recomputes averages from raw transaction rows.
- `seriesCurrent` and `seriesPrevious` are aligned by index for the chart renderer — position `i` in `seriesCurrent` is paired with position `i` in `seriesPrevious`. They may be different lengths if cohort sizes differ.
- Missing cohort dates (days where no guests passed the completeness filter) produce no row — the series is sparse, not continuous. The chart skips null points without breaking the line.
- The comparison window runs the same shifting logic over `[prevDateFrom, prevDateTo]`.

---

## 5. Chart Specifications

The card and the detail page use two different chart types from the same data source.

### 5.1 Dashboard card — vertical paired bars

| Property | Value |
|---|---|
| Library | AG Charts (Community v13) |
| Type | `bar`, vertical (`direction` default), **single series with per-row fill colors** |
| `xKey` | `stage` (category label: `Pre-enrollment avg spend` / `Post-enrollment avg spend`) |
| `yKey` | `value` (dollar amount) |
| X-axis | Category, `position: 'bottom'`, no tick, no line, no gridline. Labels `12px` black. |
| Y-axis | Number, `position: 'left'`, `min: 0`, `max: maxValue × 1.2`, `nice: false`. Horizontal gridlines `#DFE1E2`. Labels `$XX` compact format. |
| Colors | Per-bar via `itemStyler`: pre = `#A9A6FF` (indigo-300), post = `#5A55E3` (indigo-900). |
| Corner radius / stroke | `cornerRadius: 6`, `strokeWidth: 0` |
| Bar labels | `label.enabled: true`, `color: '#000000'`, `fontSize: 11`, formatted `$XX.XX` |
| Legend | Disabled at AG Charts level. No custom legend on the card — the bars are self-labelled by the X-axis. |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }`). No hover tooltip on the card bars. |
| Chart body padding | `{ top: 8, right: 8, bottom: 0, left: 0 }` |

**Chart data shape for the card:**

```js
const chartData = [
  { stage: 'Pre-enrollment avg spend',  value: 14.25, tone: 'pre' },
  { stage: 'Post-enrollment avg spend', value: 17.40, tone: 'post' },
];
```

### 5.2 Detail page — line chart (two series)

| Property | Value |
|---|---|
| Library | AG Charts (Community v13) |
| Type | Line, two series |
| `xKey` | `date` (JS `Date` object, constructed at local midnight) |
| X-axis | Time, `nice: false`, `min`/`max` = first/last date in the data. Label format `%b %-d` (e.g. `Mar 18`), `avoidCollisions: true`. Tick marks `size: 4`. |
| Y-axis | Number, `position: 'left'`. `min`/`max` derived from data: `lo − range × 0.1` / `hi + range × 0.1` (10% padding). Horizontal gridlines `#DFE1E2`. Labels `$XX` compact format. |
| Series — This period | `yKey: 'current'`, color `#5A55E3`, `strokeWidth: 2`, solid line, `lineDash` unset. |
| Series — Previous period | `yKey: 'prev'`, same color `#5A55E3`, `strokeWidth: 2`, `lineDash: [2, 2]` dashed. Hidden when `Compare to` = `No comparison`. |
| Markers | `enabled: true, size: 0`. On hover (`highlightState === 'highlighted-item'`): `size: 10`, fill `#5A55E3`, white stroke `strokeWidth: 2`. |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }`). Replaced with manual tooltip — see § 9. |
| Native AG Charts crosshair | Disabled. Replaced with manual dashed vertical line — see § 9. |
| Legend | Disabled at AG Charts level; custom toggleable legend above the chart — see § 8. |
| Chart body padding | `{ top: 8, right: 0, bottom: 0, left: 0 }` |

**Chart data shape for the detail (one row per cohort date):**

```js
const chartRow = {
  date:    new Date('2026-03-18T00:00:00'),   // local midnight
  current: 3.10,   // $ lift for this cohort date, current period
  prev:    2.30,   // $ lift for this cohort date, previous period (null if no prev)
};
```

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters).

| Filter | Options | Applies | Notes |
|---|---|---|---|
| **Date range** | 7D, 30D, **90D**, 12M, YTD, Custom | Yes — full support | Determines `N` (window length) and drives the cohort shift. Shorter ranges produce more recent but smaller cohorts. Longer ranges push cohorts further back in time. No minimum-range constraint — even 7D is valid. |
| **Compare to** | Previous period, No comparison | Yes — hero pill and prev-period line | When `No comparison`: delta pill hides, period sub-text hides, the previous-period line series is removed from the detail chart. The card bars are unaffected (they show only the current cohort). |
| **Stores and Store groups** | Single or multi-store | Yes | Applied server-side: only transactions at the selected store(s) count toward pre/post-enrollment spend. Enrollment eligibility is unaffected — a guest is still in the cohort if they enrolled in the program, even if they visited many stores. Only their spend at the filtered stores is counted. |
| **Loyalty / non-loyalty** | Loyalty members | **Not applicable** | This metric is defined by enrolled guests only. The non-loyalty half of this filter would produce an empty result set. The filter should be visually disabled or ignored when this chart is in view. Confirm UX behavior with PM — see § 10. |
| **Segments** | Any saved segment | Yes | Restricts the enrolled-guest cohort to guests who are also in the selected segment. Useful for: "what is the spend lift among first-time buyers who enrolled?" |

### Cohort shifting with filters

When a `Stores` filter is applied, the `completeAsOf` date and the shifting logic operate identically — the store filter constrains which transactions count, but the dates of the cohort window are still derived from the selected dashboard range.

### No-comparison case

When `Compare to` = `No comparison`:
- Card: delta pill hides; bars show only the current cohort window summary; period sub-text hides.
- Detail: delta pill hides; period sub-text hides; the dashed `prev` line series is removed from the chart; the legend shows only `This period`.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid (`data-metric-id="loyalty-spend-lift"`).

- **Header:** title `Loyalty spend lift` + subtitle `Avg transaction value lift after enrollment`. Header is clickable → navigates to `dashboard-loyalty-spend-lift.html`.
- **Hero metric block:**
  - Primary value: `$ lift` (e.g. `+$4.39`), bold `20px`.
  - Delta pill: `%` change vs. previous cohort (e.g. `+22.11%`). Standard non-inverse colors (green = up, red = down).
  - Period sub-text row: `{value} previous period avg` on the left; `Included cohorts: {from} to {to}` with an info icon on the right. The cohort range text has a tooltip explaining the shift.
- **No legend** — the bars carry their own X-axis labels.
- **Vertical bar chart** filling the remaining card space (uses `flex: 1` to fill the stretched card body — see § Layout below).
- **3-dot overflow menu:** `Export CSV`, `Download chart`.
- **No breakdown dropdown** on the card.

### Layout note

The dashboard grid stretches all cards in a row to equal height. The card body must set `flex: 1` so the chart canvas absorbs the extra space rather than leaving blank space below the bars. The chart canvas should have a `min-height` of `256px` and `flex: 1`.

---

## 8. Detail Page (`beta/dashboard-loyalty-spend-lift.html`)

Top-to-bottom: breadcrumb → title bar (h1 `Loyalty spend lift` + Help button) → global filter bar → chart card → data table → pagination.

### 8.1 Trend card

- **Header:** title `Loyalty spend lift`, subtitle `Avg transaction value lift after enrollment`, 3-dot menu with `Export CSV / Download chart`.
- **Hero metric block:** same `$ lift`, delta pill, and period sub-text as the card. The cohort range notice sits in the same row as the period sub-text, pushed to the right. Both follow the same hide rules as the card.
- **Toggleable legend:** two buttons — `This period` (solid indigo swatch `#5A55E3`) and `Previous period` (striped/dashed indigo swatch). Toggling a button hides that series in the chart and removes it from the tooltip. At least one must remain visible — the toggle is a no-op if you try to disable the only visible series. `Previous period` only appears when `Compare to` ≠ `No comparison`.
- **Line chart:** two series as defined in § 5.2. Taller plot area (`389px`).

### 8.2 Data table

| Column | Format | Notes |
|---|---|---|
| Enrollment cohort | `Mar 18, 2026` | Left-aligned. One row per day in `seriesCurrent`. |
| Enrolled guests | Integer, comma-separated (e.g. `9,675`) | Right-aligned. Guests who enrolled on that date and have a complete post-window. |
| Avg pre-enrollment ticket | `$XX.XX` (two decimals) | Right-aligned. |
| Avg post-enrollment ticket | `$XX.XX` | Right-aligned. |
| $ lift | Signed `±$XX.XX` (e.g. `+$7.17`, `−$1.20`) | Right-aligned. |
| % lift | `XX.XX%` (e.g. `787.91%`) | Right-aligned. Rendered as plain text — no pill. `—` when pre-enrollment spend is zero. |

- Standard Bento `thead` styling — `background: #dfe1e2`, `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 8px 16px`.
- Sort affordances in column headers (markup only in the prototype — wire to real sort handlers in production).
- **Pagination:** 10 rows per page, standard `.pagination__*` classes. Filter changes refetch and re-render both the chart and the table.

---

## 9. Interactions

### Hover → Tooltip + dashed vertical line (detail page only)

Manual implementation, not AG Charts native (mirror the Total Guests / Guest Lifecycle pattern).

- On `mousemove` over the chart container, snap to the nearest data point on X by mapping cursor position to an array index (`plotLeft ≈ 46px`, `plotRightPad ≈ 0`).
- Show a tooltip floated fixed next to the cursor:
  - **Heading:** `Daily cohort lift`, bold `16px`.
  - **Body:** one row showing the snapped cohort date + the `$ lift` value for that day. Indigo solid swatch on the left.
  - **Delta pill row:** `% change` vs. prev-period lift for that date, with `vs. previous period` label. Hidden when the prev-period series is not visible.
  - **Prev row (below separator):** striped indigo swatch + `Previous period` label + the prev-period `$ lift` value. Hidden when the prev-period series is not visible.
- Show a **dashed vertical line** (`#c6c6c6`, 4-on/4-off, `strokeWidth: 1`) at the snapped X, driven by updating `chart.updateDelta({ axes: { x: { crossLines: [...] } } })` via `requestAnimationFrame` (same pattern as Guest Repeat Rate).
- Both tooltip and crosshair hide on `mouseleave` and on `scroll`/`resize`.
- On `detach()`, cancel any pending `requestAnimationFrame` and remove the crosshair.

### Hover — card bars

No hover tooltip on the dashboard card bars. The bar labels (`$XX.XX` inside each bar) are the only value readout.

### Click → Context menu

Not implemented in the prototype. Tracked as a follow-up — see § 10.

---

## 10. Open Questions for PM

These are not blockers for the prototype but should be settled before production:

1. **Transaction amount basis.** `checkins.receipt_amount` is used today. Confirm whether this matches the QBR `Avg Checkin Net Purchase Amount` (post-discount, pre-tax vs. post-tax).
2. **Transaction deduplication within a window.** If a guest has two transactions on the same enrollment-cohort day, both count toward the pre/post spend total. Confirm "all transactions in window" vs. "one per day" semantics.
3. **Loyalty filter UX.** When the global Loyalty filter is active and the user views this chart, do we (a) visually disable the filter, (b) hide it, or (c) silently ignore it server-side and show a notice? Behavior must be explicit.
4. **Zero pre-enrollment spend.** Some guests have no transactions in their pre-enrollment window (e.g. they enrolled immediately on first visit). `% lift` is `null` for those guests. Confirm whether to exclude them from both the series point and the cohort summary `avgPreSpend`, or include them with `$0` pre-spend.
5. **Context menu wiring.** The prototype does not wire a click-to-context-menu on the detail chart. Confirm whether the standard `View users / Create segment / Ask Ava` pattern applies.
6. **Detail-page default date range.** Should the detail page open with the same range as the dashboard card, or a fixed default (the existing prototype spec suggested 90D for this chart type)?
7. **Hero precision on small lifts.** `$ lift` is shown to two decimal places. For brands with very low average tickets (e.g. `$0.12`), this may still round aggressively. Confirm precision is sufficient.
8. **Identified-guest scope.** Confirm anonymous traffic (guests with no IDR match) is excluded from enrollment cohorts entirely.

---

## 11. Mock Data Shape (prototype)

Use the following shape for `SPEND_LIFT_DATA` in `beta/index.html` and `SPEND_LIFT_TREND_DATA` in `beta/dashboard-loyalty-spend-lift.html`. Replace with real API data when wiring up.

```js
// dashboard card — summary
const SPEND_LIFT_SUMMARY = {
  avgPreSpend:       3.07,
  avgPostSpend:      7.46,
  lift:              4.39,
  liftPct:         143.00,
  liftPrev:          2.10,
  deltaPct:         109.05,
  effectiveDateFrom: '2024-05-17',
  effectiveDateTo:   '2025-05-17',
};

// detail page — trend series (one entry per cohort date)
const SPEND_LIFT_TREND_DATA = [
  { date: '2024-05-17', enrolledGuests: 9675, avgPreSpend:  0.91, avgPostSpend:  8.08, lift:  7.17, liftPct: 787.91 },
  { date: '2024-05-18', enrolledGuests: 7791, avgPreSpend:  1.09, avgPostSpend:  8.36, lift:  7.27, liftPct: 666.97 },
  { date: '2024-05-19', enrolledGuests: 6784, avgPreSpend:  1.33, avgPostSpend:  8.45, lift:  7.12, liftPct: 535.34 },
  { date: '2024-05-20', enrolledGuests: 7636, avgPreSpend:  0.90, avgPostSpend:  8.02, lift:  7.12, liftPct: 791.11 },
  { date: '2024-05-21', enrolledGuests: 7872, avgPreSpend:  1.05, avgPostSpend:  8.20, lift:  7.15, liftPct: 680.95 },
  // ...continue for the full cohort window
];
```

---

## 12. Reference Files

- **Dashboard UX patterns (cards, filters, detail page)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette order, font, tooltip + context-menu patterns)** — `[docs/dashboard_beta_ux.md` § Chart Colors](../dashboard_beta_ux.md#chart-colors)`
- **Prototype spec for the alternative loyalty-vs-anonymous definition** — `[docs/charts_spec/dashboard_loyalty_spend_lift_chart_spec.md](./dashboard_loyalty_spend_lift_chart_spec.md)` (kept for reference — different metric, do not mix)
- **Reference implementation — dashboard card (vertical bars)** — `[beta/index.html](../../beta/index.html)` (search `loyalty-spend-lift`)
- **Reference implementation — detail page (trend line + table)** — `[beta/dashboard-loyalty-spend-lift.html](../../beta/dashboard-loyalty-spend-lift.html)`
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `loyalty-spend-lift`)
