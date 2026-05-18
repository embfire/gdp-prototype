# Loyalty Spend Lift Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-17
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card, horizontal bars) and `[beta/dashboard-loyalty-spend-lift.html](../../beta/dashboard-loyalty-spend-lift.html)` (detail page, trend line + grouped breakdown bars + table)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how the lift metric is calculated, what filters do, what the breakdown dimensions are, and what the detail page must include**. The dashboard card and the detail page draw from the same underlying loyalty-vs-non-loyalty split — keep that in mind when shaping the API.

---

## 1. Overview

**Loyalty Spend Lift** measures how much more (or less) loyalty members spend per visit compared to identified non-loyalty guests in the same period. It answers the board-level question: *"What is the incremental spend attributable to loyalty program membership?"*

The metric maps directly to Punchh QBR **Spend Lift (loyalty vs. anonymous)** and to PAG exercise metric **Loyalty Spend Lift** (#3 at 72% selection). Keep the formula identical to the QBR definition so cross-platform numbers reconcile.

The chart has two views over the same data:

- **Dashboard card** — comparison KPI. Hero = **lift %**; subtext = the two avg-$/visit values; chart body = a horizontal paired bar showing loyalty vs. non-loyalty avg $/visit.
- **Detail page** — three artifacts stacked:
  1. **Trend chart** — daily avg $/visit for loyalty and non-loyalty over the selected range, with its own hero metric repeated.
  2. **Breakdown chart** — vertical grouped bars (loyalty vs. non-loyalty) per dimension, switchable via a dropdown (**By location / By channel / By enrollment cohort**).
  3. **Data table** — one row per time bucket with loyalty avg, non-loyalty avg, and lift %.

Both views derive from the same loyalty-vs-non-loyalty visit-level aggregation; the card collapses everything to a single period summary, the detail page slices that summary by date and dimension.

---

## 2. Metric Definition

These rules are the source of truth for what a "visit", "loyalty member", and "lift" mean. Keep parity with the Punchh QBR definition unless PM explicitly approves a divergence.

| Concept                            | Definition                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visit**                          | One guest-day with at least one qualifying transaction — dedupe by `(guest_id, calendar_day)`. Two transactions on the same day by the same guest count as one visit. (Confirm with PM if PunchhCheck-in semantics require a different dedupe key — see § 10.)                              |
| **Avg spend per visit — Loyalty**  | Σ(net purchase amount on loyalty-member visits) ÷ count(loyalty-member visits) in the period.                                                                                                                                                                                              |
| **Avg spend per visit — Non-loyalty** | Same calculation over identified guests who are **not** loyalty members. Identity must be resolved via the same IDR / CDP rules as Total Guests and Visit Frequency.                                                                                                                       |
| **Net purchase amount**            | Post-discount, pre-tax (or post-tax — match Punchh **Avg Checkin Net Purchase Amount**). Pick once and stick with it; document the choice next to the query.                                                                                                                                |
| **Loyalty status**                 | Member vs. non-member **as of transaction time**, not as of "today". A guest who enrolls mid-period transitions from non-loyalty visits before enrollment to loyalty visits after. The simpler "current status" approach is acceptable for v1 if PM accepts the parity gap — confirm in § 10. |
| **Lift %**                         | `(loyaltyAvg − nonLoyaltyAvg) / nonLoyaltyAvg × 100`, rounded to one decimal. A positive value means loyalty members spend more per visit; negative means less.                                                                                                                              |
| **Lift Δ (period over period)**    | The change in lift % between the current and comparison windows, expressed in **percentage points** (`pp`), not percent. Lift is already a percent — comparing percents would be ambiguous.                                                                                                  |

### What does and does not count

- **Identified guests only.** Anonymous traffic with no IDR match is excluded from both numerator and denominator on both sides of the split. Consistent with every other dashboard chart.
- **Loyalty member ↔ identified non-member only.** Do not include un-identified anonymous traffic in the non-loyalty bucket — that would inflate the lift artificially because anonymous check sizes skew low.
- **Pre-enrollment vs. post-enrollment lift** for the *same* guest is a different metric (the "loyalty conversion uplift") and out of scope for this chart.
- **Hardcoded thresholds for beta**, configurable per-tenant at GA. The enrollment-cohort buckets in the breakdown (currently `< 90d` / `Established` / `Non-members`) should live in config, not in queries.

---

## 3. Hero Metric

The hero appears on the dashboard card and is repeated on the detail page's trend card.

- **Primary value:** lift % for the selected period (e.g. `+35%`). Sign always shown — `+` for non-negative, `−` for negative. One whole-percent precision on the card (matches the reference); the detail page repeats the same value at the same precision.
- **Delta pill:** lift Δ vs. the comparison window in **percentage points** (e.g. `+2.8pp`). Sign always shown.
- **Pill semantics — default (non-inverse).** Higher lift is better, so:
  - Lift **up** vs. comparison → green `chart-card__metric-pill--up`
  - Lift **down** vs. comparison → red `chart-card__metric-pill--down`
- **Period text — card:** `$24.80 loyalty · $18.40 non-loyalty per visit`. Two avg-$/visit values for the current period, no comparison suffix.
- **Period text — detail trend card:** `$24.80 loyalty · $18.40 non-loyalty per visit · +32% prev period lift`. Adds the prior-period lift as the suffix.
- **No info badge / no `CHART_CONSTRAINTS` entry.** Unlike the retention cohort chart, this metric has no minimum-window requirement; even a 7-day range computes a valid lift.
- **No-comparison case.** When `Compare to` = `No comparison`, the delta pill hides and the period text drops the trailing `· +32% prev period lift` suffix on the detail page. The card period text never carries the suffix, so it is unaffected.

---

## 4. Required Data Shape

The chart needs **one period summary + one daily time series + one breakdown row set**, all keyed by loyalty status. The card uses the summary; the detail page uses all three.

```ts
// Period summary — card hero + bars, detail hero
type SpendLiftPeriod = {
  loyaltyAvg: number;        // e.g. 24.80
  nonLoyaltyAvg: number;     // e.g. 18.40
  loyaltyAvgPrev: number;    // comparison window, used only for the hero pill
  nonLoyaltyAvgPrev: number; // comparison window, used only for the hero pill
  // Lift % and lift Δ are derived client-side from the four numbers above.
};

// Daily trend — detail trend chart + data table
type SpendLiftTrendRow = {
  date: string;       // ISO date, one row per calendar day in the selected range
  loyalty: number;    // avg $/visit on that day
  nonLoyalty: number; // avg $/visit on that day
};

// Breakdown — detail breakdown chart, one row per dimension value
type SpendLiftBreakdownRow = {
  label: string;      // location name, channel, or enrollment cohort label
  loyalty: number;    // avg $/visit for the period within that bucket
  nonLoyalty: number; // avg $/visit for the period within that bucket
};

// One breakdown set per dimension key
type SpendLiftBreakdowns = {
  location: SpendLiftBreakdownRow[];
  channel: SpendLiftBreakdownRow[];
  enrollment: SpendLiftBreakdownRow[];
};
```

### Aggregation contract

- **All three shapes are computed server-side from the same underlying visit-level fact**. Do not let the client recompute averages from raw transactions; the dedupe, identity-resolution, and net-amount rules all live in the warehouse.
- **Trend rows** need a continuous daily series for the selected range. Missing days (genuinely zero loyalty *or* non-loyalty visits) should still render — return the day with `null` on the missing side rather than dropping the row, so the data table reads continuously. The chart should skip null points without breaking the line.
- **Breakdown rows** are not paginated server-side. The default detail view caps at the top ~10 rows per dimension (locations, channels, enrollment cohorts are small cardinality today); confirm with PM if any dimension grows beyond what the grouped bar can readably show.
- **Filters** (date range, stores, segments — see § 6) are applied **before** the loyalty/non-loyalty split, server-side. The Loyalty filter is **not** applied (it would invalidate the split — see § 6).
- The comparison window summary is computed independently with the same rules over `[prevDateFrom, prevDateTo]`. The detail page does **not** render comparison series on the trend chart in v1 — only the hero pill uses them.

### Single endpoint, three projections

Card consumes `SpendLiftPeriod`. Detail trend consumes `SpendLiftPeriod` + `SpendLiftTrendRow[]`. Detail breakdown consumes `SpendLiftBreakdowns`. A single `GET /metrics/loyalty-spend-lift?from=…&to=…&prevFrom=…&prevTo=…` returning all three plus comparison is the simplest shape; split only if a downstream caller requires it.

---

## 5. Chart Specifications

The card and the detail page use three different chart types. Treat the sub-sections below as independent specs sharing the same data source.

### 5.1 Dashboard card — horizontal paired bars

| Property                    | Value                                                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library                     | AG Charts (Community v13)                                                                                                                                                                                                                   |
| Type                        | Bar, `direction: 'horizontal'`, **single series with per-row colors** (not two series — see note below)                                                                                                                                     |
| `xKey` / `yKey`             | `cohort` / `amount` (in horizontal mode `xKey` is the categorical, `yKey` is the numeric)                                                                                                                                                  |
| X-axis (numeric, bottom)    | `min: 0, max: 28`, `interval: { values: [0, 7, 14, 21, 28] }`, label formatter `$XX`. **These are placeholder data bounds — derive from the real period when wiring up.**                                                                  |
| Y-axis (category, left)     | `paddingInner: 0.35, paddingOuter: 0.2`, no tick, no line, labels `Loyalty` / `Non-loyalty` at 12px                                                                                                                                        |
| Colors                      | Per-row via `itemStyler` reading `params.datum.fill`: Loyalty = `#5A55E3` (chart-indigo-900), Non-loyalty = `#FF6600` (chart-vermilion-900)                                                                                               |
| Corner radius / stroke      | `cornerRadius: 4`, `strokeWidth: 0`                                                                                                                                                                                                         |
| Legend                      | Disabled at the AG Charts level (`legend: { enabled: false }`); a custom legend (see § 7) sits above the plot area                                                                                                                          |
| Native AG Charts tooltip    | Disabled (`tooltip: { enabled: false }`). **No manual tooltip is wired today** — flag in § 10                                                                                                                                                |
| Native AG Charts crosshair  | N/A (categorical chart)                                                                                                                                                                                                                     |

**Why a single series with per-row fills, not two series?** The legend toggle on the card *filters the data array* rather than hiding a series — this lets each bar disappear cleanly without leaving a phantom category slot on the Y-axis. If both cohorts are visible the data has two rows; toggling one off rebuilds the data with one row and updates the chart. Don't refactor into two series without re-thinking the toggle UX.

### 5.2 Detail trend card — line chart (two series)

| Property                    | Value                                                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library                     | AG Charts (Community v13.2.1)                                                                                                                                                                                                               |
| Type                        | Line, two series                                                                                                                                                                                                                            |
| X-axis                      | Time, `nice: false`, `min` / `max` = first / last day in the data. Ticks every 4 days in the reference (computed in code; do not hardcode the count). Label format `%b %-d`.                                                                |
| Y-axis                      | Number, `min: 17, max: 28`, `interval: { values: [17, 19, 21, 23, 25, 27] }`, label formatter `$XX`. **These hardcoded bounds are placeholder data scaling — replace with values derived from the real series range when wiring up.**       |
| Series order                | Loyalty first, Non-loyalty second                                                                                                                                                                                                           |
| Series colors               | Loyalty = `#5A55E3` (indigo-900), Non-loyalty = `#FF6600` (vermilion-900). Both solid `strokeWidth: 2`. **Two palette colors are correct here** — unlike Total Guests / Retention Cohort, the two series are semantically distinct cohorts, not the same metric over two windows. |
| Markers                     | `enabled: true, size: 0`. No `itemStyler` is wired today so markers stay hidden even on hover — flag in § 10 if PM wants the standard hover-marker treatment.                                                                              |
| Native AG Charts tooltip    | Disabled (`tooltip: { enabled: false }`). **No manual tooltip is wired today** — flag in § 10                                                                                                                                                 |
| Native AG Charts crosshair  | Enabled on X (`crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] }`). This is native AG Charts crosshair, unlike Total Guests / Guest Lifecycle which roll their own.                                                          |
| Legend                      | Disabled at AG Charts level; custom legend above the plot area (see § 8)                                                                                                                                                                    |

### 5.3 Detail breakdown card — vertical grouped bars

| Property                    | Value                                                                                                                                                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library                     | AG Charts (Community v13.2.1)                                                                                                                                                                                                               |
| Type                        | Two `bar` series, `direction: 'vertical'`, sharing the same `xKey: 'label'` (grouped by category)                                                                                                                                          |
| X-axis (category, bottom)   | `paddingInner: 0.32, paddingOuter: 0.18`, no tick, no line, no grid                                                                                                                                                                         |
| Y-axis (number, left)       | `min: 0, max: 30`, `interval: { values: [0, 10, 20, 30] }`, label formatter `$XX`. **These hardcoded bounds are placeholder data scaling — replace when wiring up.**                                                                       |
| Series                      | `loyalty` (fill `#5A55E3`) and `nonLoyalty` (fill `#FF6600`). `cornerRadius: 4`, `strokeWidth: 0`. Visibility driven by `breakdownVisibility` state, toggled via the custom legend (see § 8).                                              |
| Native AG Charts tooltip    | Disabled. **No manual tooltip is wired today** — flag in § 10.                                                                                                                                                                              |

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters). All globally defined filters apply, with **one explicit override**: the global Loyalty filter is invalid for this chart.

| Filter                      | Options                                                | Applies                | Notes                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date range**              | 7D, 30D, **90D (default)**, 12M, YTD, Custom           | Yes — full support     | Drives the trend X-axis range, the period summary used by the card hero and detail hero, and the breakdown's aggregation window. **The default landing range on this chart's detail page is 90D** (not 12M), because daily $/visit signals stabilize with at least ~30 visits per cohort per bucket. No minimum-range constraint enforced today — confirm in § 10. |
| **Compare to**              | **Previous period (default)**, Previous year, No comparison | Yes — hero pills only  | Used to compute the lift Δ pp pill and (on detail) the `+32% prev period lift` suffix. The trend chart body does **not** render the comparison window in v1 — only the hero uses it. When `No comparison` is chosen, both the pill and the suffix hide.                                                                                                  |
| **Stores and Store groups** | Single or multi-store / store group                    | Yes                    | Applied server-side before the loyalty split. Constrains every shape — period summary, trend, and breakdown all reflect only the selected stores' visits. Filter scope is "visits at the selected store(s)" — there is no "guest-acquired-at-store" wrinkle here, unlike Retention Cohort. |
| **Loyalty / non-loyalty**   | Loyalty members / non-members                          | **No — disabled / ignored** | The metric is *defined* by the loyalty vs. non-loyalty split — pre-filtering to one side would zero out the other and make lift undefined. The global Loyalty filter should be **visually disabled or hidden** when this card / detail page is in view, **or** the chart should ignore it server-side and surface a "Loyalty filter ignored on this chart" notice. PM to confirm UX — see § 10. |
| **Segments**                | Any saved guest segment                                | Yes                    | Restricts visits to guests in the selected segment(s). Each cohort's average is then computed over that intersection — useful for "what is the spend lift among guests in segment X?" Loyalty status is still split within the segment.                                                                                                                          |

### Filter scope semantics (Stores and Store groups)

A loyalty member who visited Store A in March and Store B in April, with a store filter `Store A`, contributes only her March (Store A) visits to both the loyalty visit count and the loyalty spend numerator. Her April Store B visits are excluded entirely on both sides. This is straightforward "visit-at-store" filtering with no cross-month wrinkle.

### Loyalty filter vs. loyalty cohort — important to disambiguate

The same word powers two unrelated concepts:

- **Loyalty filter** (global): is the guest enrolled in the loyalty program? Yes / No.
- **Loyalty cohort** (this chart): the *Y* of the loyalty-vs-non-loyalty split that defines the metric.

These are the same dimension. That's exactly why the global filter is incompatible — picking one side of the split as a filter collapses the chart. The same dimension shows up *as* the metric here, not *applied to* the metric.

### No-comparison case

When `Compare to` = `No comparison`:
- Card: delta pill hides; period text is unchanged (it never carried the comparison suffix on the card).
- Detail page: delta pill hides; period text drops the `· +32% prev period lift` suffix; the trend chart body is unaffected (it never rendered comparison series).

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid (`data-metric-id="loyalty-spend-lift"`). Default layout position: **row 4, column 0** (`{ id: 'loyalty-spend-lift', x: 0, y: 3 }` in `DEFAULT_LAYOUT`, layout key `g360-dashboard-layout-v7`).

- **Header:** title `Loyalty spend lift` + subtitle `Avg spend per visit, loyalty vs. non-loyalty`. Header is clickable → navigates to `dashboard-loyalty-spend-lift.html` (wired via the `perChartPages` map in `openChartDetail`).
- **Hero metric block:** `+35%` lift value + `+2.8pp` non-inverse delta pill. Period text directly below: `$24.80 loyalty · $18.40 non-loyalty per visit`. No info icon, no comparison suffix.
- **Toggleable legend:** 2 buttons — `Loyalty` (solid `#5A55E3` marker) and `Non-loyalty` (solid `#FF6600` marker). Toggling one **removes that row from the chart data** (the bar disappears entirely; the remaining bar shifts up into the freed Y-axis slot). At least one cohort must remain visible — the toggle returns early if you try to disable the only visible cohort.
- **Horizontal bar chart** filling the remaining card space — see § 5.1.
- **No breakdown dropdown** on the card (the breakdown lives only on the detail page).
- **3-dot overflow menu** with the standard `Export CSV / Download chart / Ask Ava` items inherited from the dashboard card chrome.

---

## 8. Detail Page (`beta/dashboard-loyalty-spend-lift.html`)

Top-to-bottom: breadcrumb → title bar (h1 `Loyalty spend lift` + Help button) → global filter bar → two stacked chart cards (`chart-detail-charts-stack`) → data table + pagination → chart-point context menu.

**Default date range on the detail page is 90D**, not 12M — the `90D` button has `btn-group__item--active` in the markup. This differs from most other detail pages, which default to 12M. Document the choice if you intend to keep it.

### 8.1 Trend card

- **Header:** title `Loyalty spend lift`, subtitle `Avg spend per visit over time`, 3-dot menu with `Export CSV / Download chart` (no Ask Ava in the prototype — confirm with PM whether to add for parity with the dashboard card menu).
- **Hero metric block:** same `+35%` value + `+2.8pp` pill as the card. Period text: `$24.80 loyalty · $18.40 non-loyalty per visit · +32% prev period lift`. The prev-period suffix is the only delta from the card hero.
- **Legend:** `Loyalty` / `Non-loyalty` toggles. Toggling sets `visible` on the corresponding line series — at least one must remain visible.
- **Chart:** line chart, two series — see § 5.2.

### 8.2 Breakdown card

- **Header:** title `Spend lift by dimension`, subtitle `Avg spend per visit, loyalty vs. non-loyalty`, right-aligned dropdown control + 3-dot menu.
- **Breakdown dropdown:** `By location` (default) / `By channel` / `By enrollment cohort`. Selecting an option:
  1. Updates the dropdown button label.
  2. Resets legend visibility to `{ loyalty: true, nonLoyalty: true }`.
  3. Re-renders the legend, the data table, and re-initializes the breakdown chart with `BREAKDOWN_DATA[mode]`.
- **Legend:** `Loyalty` / `Non-loyalty` toggles — same behavior as the trend card legend.
- **Chart:** vertical grouped bars — see § 5.3.

**Prototype breakdown values** (replace with real query results):

| Dimension          | Categories                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| `location`         | Downtown, Midtown, Airport, Suburbs, University                         |
| `channel`          | In-store, Digital, Delivery, Drive-thru                                 |
| `enrollment`       | `New members (<90d)`, `Established members`, `Identified non-members`  |

The `Identified non-members` bucket in the enrollment breakdown is a useful sanity-check: both bars should be equal (and equal to the period's non-loyalty avg) because the row represents "identified non-members compared against identified non-members". In the prototype both = $18.40. Validate this stays true in production.

### 8.3 Data table

| Column          | Format                                                          | Notes                                                                                              |
| --------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Date            | `Jan 28` (`%b %-d`)                                             | Left-aligned. Header uses `.chart-th-inner--start` + sort affordance                              |
| Loyalty avg     | `$XX.XX` (two decimals)                                         | Right-aligned                                                                                       |
| Non-loyalty avg | `$XX.XX`                                                        | Right-aligned                                                                                       |
| Lift            | Signed `±X.X%` pill — green `#effaf9 / #257469` if ≥ 0, red `#fdecef / #b1294a` if negative | Right-aligned, font-weight 500, computed via `(loyalty - nonLoyalty) / nonLoyalty * 100`, one decimal |

- Standard Bento `thead` styling — `background: #dfe1e2`, no `border-bottom`, `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 8px 16px`. Each header cell carries a sort icon (`material-symbols-rounded` `sort`) — sorting is markup-only in the prototype; wire to real sort handlers.
- **Pagination:** standard pattern (`.pagination__*` classes), 10 rows per page. The prototype hardcodes "of 3 pages" for 30 trend rows but `prevPage` / `nextPage` are no-ops — wire to real handlers.
- Filter changes refetch and re-render the entire detail page (both charts + table) in lockstep.

---

## 9. Interactions

### Hover → Tooltip

**Card (horizontal bars):** native AG Charts tooltip is `enabled: false` and no manual tooltip is wired today. Hover does nothing in the prototype. If PM wants the standard tooltip treatment, mirror the Total Guests / Guest Lifecycle pattern (manual tooltip floated next to the cursor, plot-area snap math computed from `getBoundingClientRect()` + the AG Charts `padding`). Tracked in § 10.

**Detail trend chart:** same situation — native tooltip disabled, no manual implementation. The AG Charts X-axis crosshair *is* enabled (`stroke: '#c6c6c6'`, `lineDash: [4, 4]`), so the user gets a vertical guide line without value readout. Wire a manual tooltip following the lifecycle / total-guests pattern when productionizing — the snapped data row should include both `loyalty` and `nonLoyalty` $/visit, the lift on that day, and respect the legend's visibility flags.

**Detail breakdown chart:** native tooltip disabled, no manual implementation. Productionize the same way — tooltip per bar with cohort label + value + lift for that category.

### Click → Context menu (detail page only)

- The `chart-point-menu` markup (View users / Create segment / Ask Ava) is present at the bottom of the detail page DOM but **no click handlers wire it to either chart in the prototype script**. The menu currently never opens.
- To productionize: on click inside either detail chart's plot area, snap to the nearest data row (for the trend) or the clicked bar (for the breakdown), and open the menu anchored next to the cursor with the standard header (color dot for the clicked series, date or category label, value). Pattern is the same as Total Guests detail; reuse `attachChartPointMenu` if it has been generalized.
- The card never opens a context menu — clicking the card navigates to the detail page.

---

## 10. Open Questions for PM

These are not blockers for wiring the chart but should be settled before the metric ships:

1. **Visit dedupe rule.** Guest-day is the assumed unit. Confirm vs. Punchh Check-in semantics (transaction-level? store-visit-level?) so the avg-$/visit numerator and denominator match QBR.
2. **Loyalty status timing.** As-of-transaction-time is the correct answer for QBR parity; as-of-today is simpler and what some other charts use. Confirm parity priority.
3. **Net amount basis.** Pre-tax vs. post-tax. Pick to match Punchh `Avg Checkin Net Purchase Amount` exactly.
4. **Channel scope.** POS-only vs. all channels in the avg-$/visit numerator (matters for tenants where Delivery / Drive-thru are routed through a non-POS path).
5. **Loyalty filter UX.** When the global Loyalty filter is on and the user navigates to this chart, do we (a) visually disable the filter, (b) hide it, or (c) silently ignore it server-side and show a banner? Behavior must be explicit because the chart will look broken otherwise.
6. **Detail-page default range.** The prototype defaults to 90D (not 12M like other detail pages). Confirm intentional.
7. **Comparison treatment on the trend chart.** v1 shows comparison only in the hero pill / period suffix. Should the trend chart also draw a dashed prev-period line per series (4 lines total)? Visual density gets busy fast — confirm desired scope.
8. **Enrollment cohort buckets.** Prototype uses `< 90d / Established / Identified non-members`. Confirm thresholds and labels per tenant.
9. **Tooltip + context-menu wiring.** Both are unwired today. Confirm the standard hover-tooltip + click-context-menu pattern applies (it almost certainly does for parity with other detail pages).
10. **Hero precision on negative lift.** Card hero rounds to whole percent (`+35%`). Negative lift values like `-3.2%` would lose useful precision at whole-percent rounding — confirm with PM whether the card should switch to one-decimal precision when |lift| < 10.
11. **Identified-guest scope.** Confirm anonymous traffic is excluded from both cohorts.

---

## 11. Reference Files

- **Source proposition (QBR / PAG parity)** — `[docs/analytics_proposition.md](../analytics_proposition.md)` (search `Spend Lift`, `Loyalty Spend Lift`)
- **Dashboard UX patterns (cards, filters, detail page)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette order, font, tooltip + context-menu patterns)** — `[docs/dashboard_beta_ux.md` § Chart Colors](../dashboard_beta_ux.md#chart-colors) and `[analytics_page_patterns.md](../../analytics_page_patterns.md)`
- **Reference implementation — dashboard card (horizontal bars)** — `[beta/index.html](../../beta/index.html)` (search `initLoyaltySpendLiftChart`, `SPEND_LIFT_COMPARE_DATA`, `loyaltySpendLiftVisibility`, `toggleLoyaltySpendLiftSeries`)
- **Reference implementation — detail page (trend + breakdown + table)** — `[beta/dashboard-loyalty-spend-lift.html](../../beta/dashboard-loyalty-spend-lift.html)` (search `SPEND_LIFT_TREND_DATA`, `BREAKDOWN_DATA`, `initSpendLiftTrendChart`, `initSpendLiftBreakdownChart`, `selectBreakdown`)
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `loyalty-spend-lift`, `chart-detail-charts-stack`)
- **Sibling spec for the breakdown-dropdown pattern** — `[dashboard_visit_frequency_chart_spec.md](./dashboard_visit_frequency_chart_spec.md)`
