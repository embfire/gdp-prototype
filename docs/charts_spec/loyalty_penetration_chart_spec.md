# Loyalty Penetration Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-27 (matches current prototype: line card + in-trend channel breakdown)
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card — single-line trend) and `[beta/dashboard-loyalty-penetration.html](../../beta/dashboard-loyalty-penetration.html)` (detail page — trend with Total / By channel breakdown + sortable table)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how penetration is calculated, what filters do, what the in-trend breakdown does, and what the detail page must include**.

---

## 1. Overview

**Loyalty Penetration** measures the share of **identified transactions** that were tied to a loyalty member during the selected period.

```
Loyalty Penetration = loyalty_transactions / identified_transactions × 100
```

**Customer-facing copy (dashboard card):** subtitle `Share of transactions tied to a loyalty member`; hero metric `62%` with `+4pts` delta pill; period text `58% prior period · 38% non-loyalty`.

Aligns with Punchh QBR **Participation Rate** (transaction share). **Not** the same as loyalty members ÷ identified guests (enrollment conversion) — see § 10 if a separate guest-enrollment card is needed later.

| Surface | Contents |
| ------- | -------- |
| **Dashboard card** | Single-line trend chart (`current` solid, `prev` dashed) — same pattern as Guest repeat rate / Active guests. Hero block above chart: **current %**, **pts delta pill**, period suffix that combines **prior period %** and **non-loyalty %** (`58% prior period · 38% non-loyalty`). Legend: `This period` / `Previous period` toggle. |
| **Detail page** | (1) **Period trend** — single-line chart with an in-card **breakdown dropdown**: `Total` (default — `current` solid + `prev` dashed) or `By channel` (three solid series: **In-store / Online / Delivery**, no `prev` overlay). (2) **Sortable data table** — one row per period; columns: **Period**, **Loyalty Txns**, **Identified Txns**, **Penetration Rate** (comparison deltas live on the trend hero, not in the table). No separate breakdown bar chart. |

All values are **computed server-side**; the client does not recompute penetration from raw transaction rows.

This chart is **not** the same as **Loyalty Spend Lift** (avg $/visit comparison).

---

## 2. Metric Definition

These rules are the source of truth. Every rate must reconcile to Punchh QBR **Participation Rate** where possible.

### Formula

```
Loyalty Penetration (%) = loyalty_transactions / identified_transactions × 100
```

### Definitions

| Term | Definition |
| ---- | ---------- |
| **loyalty_transactions** | Transactions where a **Punchh loyalty member** was matched to the guest profile (**numerator**). |
| **identified_transactions** | All transactions linked to an **identified** guest profile via IDR — includes loyalty **and** non-loyalty identified guests (**denominator**). |
| **anonymous_transactions** | Excluded from **both** numerator and denominator. |

### Key rules

| Rule | Detail |
| ---- | ------ |
| **Period-active denominator** | Scoped to the **selected date range**, not lifetime. Global Date range filter drives which transactions are in scope. |
| **Loyalty filter** | Global Loyalty filter is **disabled or ignored** on this chart. The card is itself a loyalty breakdown; applying the filter would make the metric meaningless (100% or 0%). Same pattern as Loyalty Spend Lift. |
| **Minimum date range** | **90 days** floor on dashboard card and detail page. Below 90D, render as 90D and show info indicator: `Showing 90D minimum` (tooltip explains need for a stable comparison window). `CHART_CONSTRAINTS.loyalty-penetration`: `minDays: 90`. |
| **Comparison delta** | Δ pill = **pts** change vs. **prior period of equal length** (e.g. `+4pts` vs. prior 90D when 90D is selected). Not relative percent. |
| **Server-side aggregation** | Penetration %, counts, and comparison values are returned pre-computed. Client displays only; does not divide raw rows. |
| **Non-loyalty % (card)** | `100% − penetration%` within identified base — displayed inline in the period text as `{X}% non-loyalty` (e.g. `· 38% non-loyalty`). |

### Display precision

- Hero metric (dashboard card and detail trend hero): **whole percent** (e.g. `62%`).
- Y-axis labels and tooltip values: **one decimal, trailing `.0` stripped** (e.g. `62.4%` → displayed as `62.4%`; `60.0%` → displayed as `60%`).
- Detail table penetration column: **two decimals** (e.g. `62.41%`).

### Open implementation details (§ 10)

- Transaction dedupe key (transaction vs. guest-day vs. check-in) — must match Punchh QBR SQL.
- Loyalty match timing at transaction vs. period-end roster.

---

## 3. Hero Metric (dashboard card)

The card hero lives **above the trend chart**, matching the Guest repeat rate / Active guests / Retention cohort pattern. There is no donut — the card shows a single-line trend with `current` (solid) and `prev` (dashed) series.

| Element | Prototype example | Spec |
| ------- | ----------------- | ---- |
| **Hero value** | `62%` | Loyalty penetration for the selected period. Whole percent, bold. Rendered in `.chart-card__metric-value`. |
| **Δ pill** | `+4pts` (green) | Signed `pts` vs. comparison window. Higher = better (non-inverse). Inline with the hero value in `.chart-card__metric-row`. |
| **Period text** | `58% prior period · 38% non-loyalty` | Single line in `.chart-card__metric-period`. Combines comparison-window penetration % and the non-loyalty complement (`100% − penetration%`). When `Compare to = No comparison`, drop the `58% prior period · ` portion and show only `38% non-loyalty`. |
| **90D info indicator** | `Showing 90D minimum` | Inline info chip in the period row when the active range is below 90D — same pattern as Guest repeat rate / Retention cohort. |

- **Library category label:** if other cards expose a metrics-library category chip (`LOYALTY`), apply the same; otherwise omit.

Detail trend card hero is the same row (`62%` + `+4pts`) plus a base-month suffix on the period line: `58% prev period · Mar '26`.

---

## 4. Required Data Shape

The chart needs **one period summary + one monthly time series for Total + one monthly time series broken out by channel**. The dashboard card uses the period summary plus the Total trend. The detail page uses all three (period summary for the hero, Total trend for the default chart + table, channel trend when the in-card breakdown dropdown is switched to **By channel**).

```ts
// Period summary — card hero + detail hero
type LoyaltyPenetrationPeriod = {
  loyaltyTxns: number;        // count of loyalty-member transactions in period
  identifiedTxns: number;     // loyaltyTxns + identified non-loyalty txns (denominator)
  penetration: number;        // decimal, e.g. 0.62 = 62%
  prevPenetration: number;    // comparison window — feeds pill + "58% prior period"
  // nonLoyaltyPct derived client-side: (1 - penetration) * 100  → "38% non-loyalty"
};

// Monthly trend — dashboard line + detail trend (Total mode) + data table
type LoyaltyPenetrationTrendRow = {
  date: string;               // ISO date — first day of the period (e.g. 2025-04-01 for Apr '25)
  current: number;            // penetration as decimal (e.g. 0.62 = 62%)
  prev: number;               // comparison penetration for the aligned period, decimal
  // Optional but recommended for table drill-down and QA:
  loyaltyTxns?: number;
  identifiedTxns?: number;
};

// Monthly trend — detail trend (By channel mode)
type LoyaltyPenetrationChannelTrendRow = {
  date: string;               // ISO date — first day of the period
  inStore: number;            // penetration among in-store transactions, decimal
  online: number;             // penetration among online transactions, decimal
  delivery: number;           // penetration among delivery transactions, decimal
  // No prev series in this mode — channel comparison is the value proposition,
  // not period-over-period overlay.
};
```

### Aggregation contract

- **All shapes are computed server-side from the same underlying identified-transaction fact.** Do not let the client recompute penetration from raw transactions; dedupe, IDR, and loyalty-attribution rules live in the warehouse.
- **Trend rows** need a continuous monthly series for the selected range. Months with zero identified transactions should still render — return the row with `null` on `current` rather than dropping it.
- **Channel trend rows** use the same monthly grid as the Total trend so the chart can swap data sources without re-laying out the X axis.
- **Filters** (date range, comparison, stores, segments — see § 6) are applied **server-side** before the loyalty split.
- **Comparison series (`prev` on the chart).** Total mode only. When "Compare to" is active, populate `prev` on each Total trend row. When comparison is off, omit `prev` or return null and hide the comparison series, legend toggle, and pill. By channel mode never shows `prev`.

### Single endpoint, three projections

A single `GET /metrics/loyalty-penetration?from=…&to=…&prevFrom=…&prevTo=…` returning the period summary, the Total trend (`current` + `prev`), and the channel trend is the simplest shape. The channel trend is small enough (~12 rows × 3 series) to ship in the same payload; split only if a downstream caller requires lazy loading.

---

## 5. Chart Specifications

### 5.1 Dashboard card — single-line trend (two series)

| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Line — two series |
| X-axis | Time (period start date). Prototype uses **monthly** buckets with labels like `Apr '25` |
| Y-axis | Rate as decimal, formatted as percent (e.g. `0.62` → `62%`) |
| Series 1 (rendered first) | `prev` — indigo `#5A55E3`, `lineDash: [2, 2]`, legend marker striped |
| Series 2 | `current` — indigo `#5A55E3`, solid, legend marker solid |
| Legend | External, two-button toggle (`This period` / `Previous period`) — at least one must remain visible |
| Native AG Charts tooltip | Disabled — manual tooltip (mirror `initGuestRepeatRateChart` in `dashboard-guest-repeat-rate.html`) |
| Native AG Charts crosshair | Enabled on X (`#c6c6c6`, dashed) |
| Chart padding | Dashboard: `top: 8, right: 0, bottom: 24, left: 0`. `PLOT_LEFT = 38, PLOT_RIGHT_PAD = 0` for tooltip math |

### 5.2 Detail trend — single-line trend with in-card breakdown dropdown

The detail trend chart has two modes, controlled by the **breakdown dropdown** in the chart header (`Total` / `By channel`). Switching modes destroys and re-creates the chart with new series; the X axis (12 monthly buckets) is shared.

**Total mode (default):** same shape as the dashboard card — `prev` dashed + `current` solid, both indigo `#5A55E3`. Legend renders the standard `This period` / `Previous period` toggle.

**By channel mode:** three solid series, no `prev` overlay.

| Series | yKey | Color | Legend label |
| ------ | ---- | ----- | ------------ |
| 1 | `inStore` | `#5A55E3` (indigo) | In-store |
| 2 | `online` | `#FF6600` (orange) | Online |
| 3 | `delivery` | `#8C9FFF` (periwinkle) | Delivery |

Channel-mode legend uses solid markers and is **non-toggleable** (display-only) — channel comparison is the value of this mode; hiding series defeats it.

| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Line — 2 series (Total) or 3 series (By channel) |
| X-axis | Time, monthly. `min` / `max` span the active range; ticks at the four quarter-start months in the prototype |
| Y-axis | Rate as decimal, formatted as percent. Prototype: Total `min: 0.50, max: 0.70`; By channel `min: 0.48, max: 0.74` |
| Native AG Charts tooltip | Disabled — manual tooltip wired only in Total mode (see § 9) |
| Native AG Charts crosshair | Enabled on X (`#c6c6c6`, dashed) |
| Chart padding | `top: 8, right: 16, bottom: 32, left: 8`. `PLOT_LEFT = 46, PLOT_RIGHT_PAD = 16` for tooltip / point-menu math |

Y-axis bounds in the prototype are hardcoded. **Replace with values derived from the filtered data range** (suggested: pad ~5% below min and above max rate, snap ticks to sensible 5% increments; never let Y-axis exceed 100%).

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters). All globally defined filters apply, with **one explicit override**: the global Loyalty filter is invalid for this chart.

| Filter | Options | Applies | Notes |
| ------ | ------- | ------- | ----- |
| **Date range** | 7D, 30D, 90D, 12M (default), YTD, Custom | Yes — drives which monthly periods appear on the X-axis | **Minimum 90 days** on the dashboard card (`CHART_CONSTRAINTS.loyalty-penetration`). Below 90D, card shows "Showing 90D minimum" and renders as if 90D were selected. Detail page defaults to **12M** and should respect the same floor. |
| **Compare to** | Previous period (default), Previous year, No comparison | Yes — `prev` series + hero delta pill | When disabled: hide `prev` line, striped legend entry, comparison portion of tooltip, and delta pill; period text drops the comparison suffix. |
| **Stores and Store groups** | Single or multi-store / store group | Yes | Applied server-side: only transactions at the selected store(s) count toward numerator and denominator. |
| **Loyalty / non-loyalty** | Loyalty members / non-members | **No — disabled / ignored** | The metric is *defined* by the loyalty-vs-identified split — pre-filtering to one side collapses it (Loyalty-only filter forces penetration = 100% by definition; non-loyalty filter forces it to 0). The global Loyalty filter should be **visually disabled or hidden** when this card / detail page is in view, or the chart should ignore it server-side and surface a "Loyalty filter ignored on this chart" notice. PM to confirm UX — see § 10. Pattern matches Loyalty Spend Lift. |
| **Segments** | Any saved guest segment | Yes | Restricts numerator and denominator to segment members. Useful for "what is penetration among guests in segment X?" Loyalty status is still the numerator within the segment. |

### Filter scope semantics (Stores and Store groups)

Only transactions that occurred at the selected store(s) are included. A loyalty txn at Store A counts; the same guest's txn at Store B does not when the filter is Store A only.

### Loyalty filter vs. loyalty status

The same word powers two unrelated concepts:

- **Loyalty filter** (global): is the guest enrolled in the loyalty program? Yes / No.
- **Loyalty status** (this chart's numerator): the *Y* of the loyalty-vs-identified split that defines the metric.

These are the same dimension. That's exactly why the global filter is incompatible — picking one side as a filter collapses the chart. Same problem as Loyalty Spend Lift; same recommended UX.

### Bucket granularity vs. date range

The prototype hardcodes **calendar-month** buckets. Engineering must define how each global range maps to buckets:

| Range | Suggested behavior |
| ----- | ------------------ |
| **12M / YTD** | One point per calendar month |
| **90D** | Monthly if ≥90D (3 months); otherwise weekly — confirm with PM |
| **30D / 7D** | Below minimum on the card; on the detail page either enforce the 90D floor or fall back to weekly buckets with strong incomplete-period handling |

Until PM confirms, implement monthly buckets for ≥90D ranges and enforce the 90D floor on the dashboard card.

### No-comparison case

When `Compare to` = `No comparison`:
- Card: delta pill hides; period text drops the `· 28.9% prev period` suffix; the `prev` series and striped legend entry hide.
- Detail page: same as card, plus the `prev period` row in the manual tooltip hides.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid (`data-metric-id="loyalty-penetration"`). **Library-only — not in `DEFAULT_LAYOUT`** for v1. Users add via Manage mode. (Already registered in `ALL_METRICS` as `loyalty-penetration` / `Loyalty penetration`.)

**Current prototype layout** — matches the Guest repeat rate / Active guests pattern:

- **Header:** title `Loyalty penetration` + subtitle `Share of transactions tied to a loyalty member`. Header click → `dashboard-loyalty-penetration.html` (mapping in `perChartPages` / `openChartDetail`).
- **Hero block** (`buildMetricBlock`): `.chart-card__metric-row` → `62%` value + `+4pts` green pill, then `.chart-card__metric-period-row` → `58% prior period · 38% non-loyalty`. When the active range is below 90D, the `loyalty-penetration-info-wrap` element becomes visible (`Showing 90D minimum` with tooltip — see § 2).
- **Legend** (`buildLegendHTML`): two toggleable buttons — `This period` (solid marker) / `Previous period` (striped marker). At least one must remain pressed; toggle handler is `toggleLoyaltyPenetrationSeries`.
- **Chart container:** `<div class="chart-card__placeholder" id="chart-area-loyalty-penetration">` — single-line trend, see § 5.1.
- **3-dot overflow menu:** Export CSV / Download chart / Ask Ava (standard card menu).

---

## 8. Detail Page (`beta/dashboard-loyalty-penetration.html`)

**Layout (top to bottom):** breadcrumb → title bar (`Loyalty penetration` + Help) → global filter bar → **period trend (line)** with in-card breakdown dropdown (`chart-detail-charts-stack` contains one chart card only) → **sortable data table** → chart-point context menu (trend chart only).

**Default date range on the detail page is 12M** (the `12M` button has `btn-group__item--active` in the markup), consistent with most other detail pages.

There is **no separate breakdown bar chart** on this detail page. Channel comparison is overlaid on the trend chart itself via the in-card breakdown dropdown (see § 8.1).

### 8.1 Trend card

- **Header:** title `Loyalty penetration`, subtitle `Share of identified transactions tied to a loyalty member, over time`.
- **Header controls (right-aligned, in `.chart-card__header-controls`):**
  - **Breakdown dropdown** (`dd-trend-breakdown`): `Total` (default) / `By channel`. Selecting an option updates the dropdown label and calls `selectTrendBreakdown(mode)`, which sets `currentTrendBreakdown` and re-runs `initPenetrationTrendChart()` to swap the chart between the Total (2-series) and channel (3-series) datasets — see § 5.2.
  - **3-dot menu:** `Export CSV` / `Download chart`. **No `Ask Ava` entry** in the detail trend card menu (the dashboard card menu still has it; this is intentionally trimmed on the detail surface).
- **Hero metric block:** same `62%` value + `+4pts` pill as the dashboard card. Period text: `58% prev period · Mar '26` (base-month suffix is the only delta from the card hero).
- **Legend** (`renderTrendLegend`): mode-dependent.
  - **Total mode:** two toggleable buttons — `This period` (solid) / `Previous period` (striped). `togglePenetrationSeries` enforces "at least one visible".
  - **By channel mode:** three display-only items — `In-store` (indigo), `Online` (orange), `Delivery` (periwinkle), all with solid markers. Not clickable / not toggleable.
- **Chart:** see § 5.2 for both modes.
- **Click → context menu** on the trend chart (View users / Create segment / Ask Ava) — uses `attachChartPointMenu()` with Y-axis bounds for series-aware clicks (solid vs. striped prev line in Total mode). The point menu fires in both modes; in By channel mode it snaps to the nearest visible series by Y distance. See `[dashboard_beta_ux.md` § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu) and `[analytics_page_patterns.md](../../analytics_page_patterns.md)`.

### 8.2 Data table

**Sortable** table — one row per period in the trend series (same periods as the line chart X-axis). **Four columns only** (no Previous period, Δ pts, or Δ% columns; period-over-period comparison stays on the trend card hero and chart).

| Column header | Format | Notes |
| ------------- | ------ | ----- |
| **Period** | `Apr '25` | Left-aligned. Header uses `.chart-th-inner--start` + sort affordance |
| **Loyalty Txns** | `92,104` | Right-aligned. Integer, comma-grouped. Maps to `loyalty_transactions` |
| **Identified Txns** | `148,920` | Right-aligned. Integer, comma-grouped. Maps to `identified_transactions` (denominator) |
| **Penetration Rate** | `62.41%` | Right-aligned. Two decimals. Server-computed; must equal `Loyalty Txns ÷ Identified Txns × 100` for QA |

- **Sorting:** all four columns sortable (client-side on returned rows in prototype; server-side optional at GA). Sort icons in column headers per Bento table pattern.
- Standard Bento `thead` styling — `background: #dfe1e2`, no `border-bottom`, `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 8px 16px`.
- **Pagination:** standard pattern (`.pagination__*` classes), 10 rows per page. 12-month trend = 2 pages.
- Filter changes refetch and re-render the entire detail page (both charts + table) in lockstep.

---

## 9. Interactions

### Hover → Tooltip (dashboard card trend)

Manual implementation (mirror `initGuestRepeatRateChart` in `beta/dashboard-guest-repeat-rate.html`). Snap to nearest period on X; header `Loyalty penetration`; body shows period label + `This period` rate, `pts` delta vs. that row's `prev`, and an optional `Previous period` row (striped marker) when the `prev` series is visible. Hidden when `current` is toggled off.

### Hover → Tooltip (detail trend)

Same pattern as the card. Wired only in **Total mode** (`wireTrendTooltip`); when the breakdown dropdown switches to **By channel**, no manual tooltip is wired in the prototype (re-evaluate before GA — likely want a 3-row channel readout). Dashboard uses `PLOT_LEFT: 38, PLOT_RIGHT_PAD: 0`; detail trend uses `PLOT_LEFT: 46, PLOT_RIGHT_PAD: 16` — pass real plot metrics from the chart layout when wiring production.

### Click → Context menu (detail trend only)

- Click inside plot area → menu anchored to cursor, snapped to nearest period.
- Header: color dot (striped if the `prev` series was the closest line in Total mode) + period label + rate value at that point on the closest series.
- Menu actions (stubbed): `View users` / `Create segment` / `Ask Ava`.
- `pointMenuAnchor` holds the snapped trend row; `pointMenuSeries` records which series was clicked (Total mode: `current` or `prev`; By channel mode: `inStore`, `online`, or `delivery`). Wire `onPointMenuAction` to real flows.

---

## 10. Open Questions for PM

These are not blockers for wiring the chart but should be settled before the metric ships:

1. **Guest-enrollment metric (separate product question).** `analytics_proposition.md` Guest Overview describes guest-based penetration. Locked: this chart is transaction-based only. Confirm if enrollment penetration becomes a separate library card.
2. **Transaction dedupe rule.** Transaction-level vs. guest-day vs. check-in — must match Punchh QBR Participation Rate SQL exactly.
3. **Loyalty match timing.** Punchh member matched at transaction time vs. period-end roster.
4. **Identified non-loyalty edge cases.** PAR Pay / Ordering profiles without Punchh enrollment — confirm they land in `identified_transactions` denominator only.
5. **Loyalty filter UX.** **Resolved:** filter disabled/ignored. Confirm UI: disable control vs. hide vs. banner when user had filter active before navigation.
6. **Trend bucket granularity at exactly 90D.** Three monthly points vs. weekly — confirm with data eng.
7. **Comparison-period alignment on trend chart.** **Resolved for hero pill:** prior period of equal length. Confirm each monthly `prev` point uses aligned calendar month in prior comparison window vs. YoY month.
8. **Benchmark band.** Punchh has cohort-adjusted Participation Rate benchmarks (50th / 75th percentile by program age). Should the trend chart overlay a benchmark band (gray shaded area)? With the breakdown bar chart removed, the only surface for a benchmark would be the trend itself — confirm with PM whether to add the band or skip benchmarks in v1.
9. **Default layout placement.** Library-only in v1. After 4–6 weeks of usage data, evaluate whether to promote into `DEFAULT_LAYOUT` (e.g. row 4 alongside `loyalty-spend-lift`). Bumps localStorage key to v8.
10. **Cross-link to Loyalty Spend Lift.** Both are loyalty-conversion metrics. Worth a "Related metric" link in either card header? Recommend: not in v1 (no precedent in current cards); revisit in a follow-up navigation pass.
11. **Small denominators.** When `identifiedTxns` is small (single store, niche segment), penetration swings wildly. Empty state or confidence indicator below a minimum txn threshold (e.g. <500)?
12. **By channel tooltip.** Prototype wires the manual tooltip only in Total mode. Confirm desired By-channel behavior: 3-row channel readout at the snapped period, or a single-series readout based on the closest line?
13. **Channel is the only per-chart breakdown.** Earlier drafts planned location and DMA breakdowns in-card. **Resolved:** all geographic scoping — individual stores, custom store groups, and DMA groupings (which are just a flavor of store group) — is handled by the global **Stores / Store groups** filter (see [dashboard_beta_ux.md § Global Filters](../dashboard_beta_ux.md#global-filters)). A per-chart location or DMA breakdown would duplicate that control.

---

## 11. Reference Files

- **Source proposition (PAG #6 at 67%, conversion category framing)** — `[docs/analytics_proposition.md](../analytics_proposition.md)` (search `Loyalty Penetration`)
- **Sibling spec — single-line trend pattern** — `[guest_repeat_rate_chart_spec.md](./guest_repeat_rate_chart_spec.md)`
- **Sibling spec — loyalty filter incompatibility** — `[dashboard_loyalty_spend_lift_chart_spec.md](./dashboard_loyalty_spend_lift_chart_spec.md)`
- **Dashboard UX patterns (cards, filters, detail page, table columns)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, flex-fill, point menu)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md)`
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (`LOYALTY_PENETRATION_DATA`, `initLoyaltyPenetrationChart`, `toggleLoyaltyPenetrationSeries`)
- **Reference implementation — detail page** — `[beta/dashboard-loyalty-penetration.html](../../beta/dashboard-loyalty-penetration.html)` (`PENETRATION_TREND_DATA`, `CHANNEL_TREND_DATA`, `initPenetrationTrendChart`, `selectTrendBreakdown`, `renderTrendLegend`)
