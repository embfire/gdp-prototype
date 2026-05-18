# Loyalty Penetration Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-18 (PM definition lock)
**Customer-facing reference:** Loyalty Penetration dashboard card mock (May 2026) — donut + period comparison
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card, donut) and `[beta/dashboard-loyalty-penetration.html](../../beta/dashboard-loyalty-penetration.html)` (detail page, trend + dimension breakdown + table)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS and the customer mock. This doc covers **what data is needed, how penetration is calculated, what filters do, what the breakdown dimensions are, and what the detail page must include**.

---

## 1. Overview

**Loyalty Penetration** measures the share of **identified transactions** that were tied to a loyalty member during the selected period.

```
Loyalty Penetration = loyalty_transactions / identified_transactions × 100
```

**Customer-facing copy (dashboard card):** subtitle `Share of transactions tied to a loyalty member`; donut center label `loyalty txns`; companion line `Non-loyalty: {X}%`.

Aligns with Punchh QBR **Participation Rate** (transaction share). **Not** the same as loyalty members ÷ identified guests (enrollment conversion) — see § 10 if a separate guest-enrollment card is needed later.

| Surface | Contents |
| ------- | -------- |
| **Dashboard card** | Donut — loyalty % in center, non-loyalty as complement arc. Right column: **pts delta pill**, **prior period %**, **Non-loyalty: X%** (complement). No time-series on the card. |
| **Detail page** | (1) **Period trend** — line chart, penetration % over time (`current` solid, `prev` dashed). (2) **Breakdown** — penetration % by **location / channel / DMA** for the latest complete period. (3) **Sortable data table** — one row per period; columns: **Period**, **Loyalty Txns**, **Identified Txns**, **Penetration Rate** (comparison deltas live on the trend hero, not in the table). |

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
| **Non-loyalty % (card)** | `100% − penetration%` within identified base — display as `Non-loyalty: {X}%`. |

### Display precision

- Donut center: **whole percent** (e.g. `62%`).
- Detail table penetration column: **two decimals** (e.g. `62.41%`).

### Open implementation details (§ 10)

- Transaction dedupe key (transaction vs. guest-day vs. check-in) — must match Punchh QBR SQL.
- Loyalty match timing at transaction vs. period-end roster.

---

## 3. Hero Metric (dashboard card — customer mock)

The card hero lives **inside the donut**, not above it.

| Element | Mock example | Spec |
| ------- | ------------ | ---- |
| **Center value** | `62%` | Loyalty penetration for the selected period. Whole percent, bold. |
| **Center label** | `loyalty txns` | Lowercase, subdued — clarifies this is transaction share, not guest share. |
| **Δ pill** | `↑ 4pts` (green) | Signed `pts` vs. comparison window. Higher = better (non-inverse). |
| **Prior period** | `58% prior period` | Comparison-window penetration %, subdued text below the pill. |
| **Non-loyalty line** | `Non-loyalty: 38%` | Complement within identified transaction base. Bottom-right of the metrics column. |

- **No separate headline % above the chart** — the donut center is the current penetration % for the effective period (after 90D floor).
- **90D minimum:** when user selects 7D or 30D, card still computes at 90D and shows `Showing 90D minimum` info indicator (same pattern as Guest repeat rate / Retention cohort).
- **Library category label:** mock shows `LOYALTY` in small caps above the title — use the metrics-library category chip if other cards have one; otherwise omit in v1.

Detail trend card (detail page only): repeat penetration % + `pts` pill + `58% prev period` above the line chart, matching Guest repeat rate.

---

## 4. Required Data Shape

The chart needs **one period summary + one monthly time series + one breakdown row set**, all keyed by the same identified-transaction aggregation. The card uses the period summary only; the detail page uses all three.

```ts
// Period summary — card donut + detail hero
type LoyaltyPenetrationPeriod = {
  loyaltyTxns: number;        // count of loyalty-member transactions in period
  identifiedTxns: number;     // loyaltyTxns + identified non-loyalty txns (denominator)
  penetration: number;        // decimal, e.g. 0.62 = 62%
  prevPenetration: number;    // comparison window — for pill + "58% prior period"
  // nonLoyaltyPct derived client-side: (1 - penetration) * 100
};

// Monthly trend — dashboard line + detail trend chart + data table
type LoyaltyPenetrationTrendRow = {
  date: string;               // ISO date — first day of the period (e.g. 2025-04-01 for Apr '25)
  current: number;            // penetration as decimal (e.g. 0.324 = 32.4%)
  prev: number;               // comparison penetration for the aligned period, decimal
  // Optional but recommended for table drill-down and QA:
  loyaltyTxns?: number;
  identifiedTxns?: number;
};

// Breakdown — detail breakdown chart, one row per dimension value for the latest complete period
type LoyaltyPenetrationBreakdownRow = {
  label: string;              // location name, channel, or DMA label
  penetration: number;        // decimal, e.g. 0.412 = 41.2%
  loyaltyTxns?: number;
  identifiedTxns?: number;
};

// One breakdown set per dimension key
type LoyaltyPenetrationBreakdowns = {
  location: LoyaltyPenetrationBreakdownRow[];
  channel:  LoyaltyPenetrationBreakdownRow[];
  dma:      LoyaltyPenetrationBreakdownRow[];
};
```

### Aggregation contract

- **All shapes are computed server-side from the same underlying identified-transaction fact.** Do not let the client recompute penetration from raw transactions; dedupe, IDR, and loyalty-attribution rules live in the warehouse.
- **Trend rows** need a continuous monthly series for the selected range. Months with zero identified transactions should still render — return the row with `null` on `current` rather than dropping it.
- **Breakdown rows** are not paginated server-side. Default detail view caps at the top ~10 rows per dimension by `identifiedTxns`.
- **Filters** (date range, comparison, stores, segments — see § 6) are applied **server-side** before the loyalty split.
- **Comparison series (`prev` on the chart).** When "Compare to" is active, populate `prev` on each trend row. When comparison is off, omit `prev` or return null and hide the comparison series and pill.

### Single endpoint, three projections

Card consumes `LoyaltyPenetrationPeriod` + `LoyaltyPenetrationTrendRow[]`. Detail trend consumes the same. Detail breakdown consumes `LoyaltyPenetrationBreakdowns`. A single `GET /metrics/loyalty-penetration?from=…&to=…&prevFrom=…&prevTo=…` returning all three plus comparison is the simplest shape; split only if a downstream caller requires it.

---

## 5. Chart Specifications

### 5.1 Dashboard card — donut (customer mock)

| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Donut (`innerRadiusRatio` ~0.65–0.7) |
| Data | Two slices: `{ label: 'Loyalty', value: loyaltyTxns }`, `{ label: 'Non-loyalty', value: identifiedTxns - loyaltyTxns }` |
| Colors | Loyalty slice: indigo `#5A55E3` (`var(--chart-indigo-900)`). Non-loyalty slice: light grey `#E8E8E8` or Bento neutral — match mock. |
| Center labels | `innerLabels`: line 1 = penetration % (bold, ~24px); line 2 = `loyalty txns` (12px, `#6b7280`) |
| Legend | Disabled at AG Charts level; no external legend on the card (slices are self-explanatory + `Non-loyalty` text line). |
| Layout | Two-column body: donut left (~45%), metrics column right (~55%) — pill, prior period, non-loyalty line. |
| Native tooltip | Disabled on card |

Reference AG Charts donut pattern: `beta/chart-lab.js` (`type: 'donut'`, `innerRadiusRatio: 0.65`).

### 5.2 Detail trend — single-line trend (two series)

| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Line — two series |
| X-axis | Time (period start date). Prototype uses **monthly** buckets with labels like `Apr '25` |
| Y-axis | Rate as decimal, formatted as percent (e.g. `0.32` → `32%`) |
| Series 1 (rendered first) | `prev` — indigo `#5A55E3`, `lineDash: [2, 2]`, legend marker striped |
| Series 2 | `current` — indigo `#5A55E3`, solid, legend marker solid |
| Native AG Charts tooltip | Disabled — manual tooltip on dashboard and detail (mirror Guest repeat rate) |
| Native AG Charts crosshair | Enabled on X (`#c6c6c6`, dashed) |
| Chart padding | Dashboard: `bottom: 24` (reserves space for monthly X labels). Detail trend: `bottom: 32`, `right: 16`, `left: 8` |

Y-axis bounds in the prototype are placeholder (`min`/`max` / `interval.values` hardcoded around 0–50%). **Replace with values derived from the filtered data range** (suggested: pad ~5% below min and above max rate, snap ticks to sensible 5% or 10% increments; never let Y-axis exceed 100%).

### 5.3 Detail breakdown — vertical single-series bars

| Property | Value |
| -------- | ----- |
| Type | Vertical bar, single series |
| X-axis | Category (`label`) |
| Y-axis | Rate 0–100% (`min: 0`, top tick derived from max + ~10% headroom) |
| Fill | Indigo `#5A55E3`, `cornerRadius: 4`, `strokeWidth: 0` |
| Native AG Charts tooltip | Disabled — manual tooltip wired per the standard pattern |
| Legend | None on breakdown card (single series) |

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

**Match the customer mock (May 2026):**

- **Header:** title `Loyalty penetration` + subtitle `Share of transactions tied to a loyalty member`. Optional category chip `LOYALTY` above title if library pattern supports it. Header click → `dashboard-loyalty-penetration.html`. Add mapping in `perChartPages` / `openChartDetail`.
- **Body layout:** `.chart-card__donut-row` (or equivalent) — donut left, metrics right.
- **Donut:** see § 5.1. Center `62%` / `loyalty txns` (mock values).
- **Metrics column (right):** `+4pts` green pill → `58% prior period` (subdued) → `Non-loyalty: 38%` (bottom). Current % lives in the donut center, not duplicated in the right column unless design adds it.
- **90D minimum info indicator** when selected range is below 90D (see § 2).
- **No trend line, no toggleable legend** on the card.
- **3-dot overflow menu:** Export CSV / Download chart / Ask Ava.

---

## 8. Detail Page (`beta/dashboard-loyalty-penetration.html`)

**Layout (top to bottom):** breadcrumb → title bar (`Loyalty penetration` + Help) → global filter bar → **period trend (line)** + **breakdown by location / channel / DMA** (stacked in `chart-detail-charts-stack`) → **sortable data table** → chart-point context menu (trend chart only).

**Default date range on the detail page is 12M** (the `12M` button has `btn-group__item--active` in the markup), consistent with most other detail pages.

### 8.1 Trend card

- **Header:** title `Loyalty penetration`, subtitle `Share of identified transactions tied to a loyalty member, over time`, 3-dot menu with `Export CSV / Download chart / Ask Ava`.
- **Hero metric block:** same `32.4%` value + `+3.5pts` pill as the card. Period text: `28.9% prev period · Mar '26`. The base-month suffix is the only delta from the card hero.
- **Legend:** `This period` / `Previous period` toggles. Toggling sets `visible` on the corresponding line series — at least one must remain visible.
- **Chart:** single-line trend with `prev` dashed — see § 5.1.
- **Click → context menu** on the trend chart (View users / Create segment / Ask Ava) — uses `attachChartPointMenu()` with Y-axis bounds for series-aware clicks (solid vs. striped prev line). See `[dashboard_beta_ux.md` § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu) and `[analytics_page_patterns.md](../../analytics_page_patterns.md)`.

### 8.2 Breakdown card

- **Header:** title `Penetration by dimension`, subtitle references latest complete period (e.g. `Mar '26`), right-aligned dropdown control + 3-dot menu.
- **Breakdown dropdown:** `By location` (default) / `By channel` / `By DMA`. Selecting an option updates the dropdown label and re-initializes the breakdown chart with `BREAKDOWN_DATA[mode]`. Does **not** change the data table (table rows are period buckets from the trend series, not dimension values).
- **Chart:** single-series vertical bars — see § 5.3.
- **No legend** (single series).

**Prototype breakdown values** (replace with real query results):

| Dimension | Categories |
| --------- | ---------- |
| `location` | Downtown, Midtown, Airport, Suburbs, University |
| `channel` | In-store, Digital, Delivery, Drive-thru |
| `dma` | Dallas–Fort Worth, Houston, Austin, San Antonio |

### 8.3 Data table

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

### Hover → Tooltip (dashboard donut)

No tooltip on the dashboard donut in v1 (static snapshot). Optional future: hover slice → txn count + %.

### Hover → Tooltip (detail trend)

Manual implementation (mirror `initGuestRepeatRateChart` / `wireTrendTooltip` in `beta/dashboard-guest-repeat-rate.html`).

- Snap to nearest period on X.
- Tooltip header: `Loyalty penetration`.
- Body: period label + **This period** rate; row showing `pts` delta vs. that row's `prev` rate; optional **Previous period** row when `prev` series visible (striped marker).
- Hidden when `current` series is toggled off.
- Dashboard uses `PLOT_LEFT: 38`; detail trend uses `46` / `plotRightPad: 16` — pass real plot metrics from the chart layout when wiring production.

### Hover → Tooltip (detail breakdown)

Manual tooltip per bar: dimension label + penetration % + loyalty txns / identified txns counts. Pattern matches Guest repeat rate breakdown.

### Click → Context menu (detail trend only)

- Click inside plot area → menu anchored to cursor, snapped to nearest period.
- Header: color dot (striped if `prev` series selected) + `{period} period` + rate value.
- Menu actions (stubbed): View users / Create segment / Ask Ava.
- `pointMenuAnchor` holds the snapped `LoyaltyPenetrationTrendRow`; wire `onPointMenuAction` to real flows.

### Breakdown card

No point menu in prototype. Optional future: click bar → filter to that dimension value and drill to a guest list of "identified non-members at this location/channel/DMA" (the actionable cohort for an enrollment campaign).

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
8. **Benchmark band.** Punchh has cohort-adjusted Participation Rate benchmarks (50th / 75th percentile by program age). Should the trend chart overlay a benchmark band (gray shaded area)? Or surface benchmarks only as a contextual line on the location breakdown bar chart (matches `analytics_proposition.md` location-page treatment)? Recommend: location breakdown only for v1 — trend overlay adds visual noise.
9. **Default layout placement.** Library-only in v1. After 4–6 weeks of usage data, evaluate whether to promote into `DEFAULT_LAYOUT` (e.g. row 4 alongside `loyalty-spend-lift`). Bumps localStorage key to v8.
10. **Cross-link to Loyalty Spend Lift.** Both are loyalty-conversion metrics. Worth a "Related metric" link in either card header? Recommend: not in v1 (no precedent in current cards); revisit in a follow-up navigation pass.
11. **Small denominators.** When `identifiedTxns` is small (single store, niche segment), penetration swings wildly. Empty state or confidence indicator below a minimum txn threshold (e.g. <500)?

---

## 11. Reference Files

- **Source proposition (PAG #6 at 67%, conversion category framing)** — `[docs/analytics_proposition.md](../analytics_proposition.md)` (search `Loyalty Penetration`)
- **Sibling spec — single-line trend pattern** — `[guest_repeat_rate_chart_spec.md](./guest_repeat_rate_chart_spec.md)`
- **Sibling spec — loyalty filter incompatibility + breakdown dropdown pattern** — `[dashboard_loyalty_spend_lift_chart_spec.md](./dashboard_loyalty_spend_lift_chart_spec.md)`
- **Dashboard UX patterns (cards, filters, detail page, table columns)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, flex-fill, point menu)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md)`
- **AG Charts donut lab** — `[beta/chart-lab.js](../../beta/chart-lab.js)` (search `type: 'donut'`, `innerRadiusRatio`)
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (to add: `loyalty-penetration`, `LOYALTY_PENETRATION_DATA`, `initLoyaltyPenetrationChart`)
- **Reference implementation — detail page** — clone trend from `[beta/dashboard-guest-repeat-rate.html](../../beta/dashboard-guest-repeat-rate.html)`; breakdown + table from `[beta/dashboard-loyalty-spend-lift.html](../../beta/dashboard-loyalty-spend-lift.html)`
- **Card layout CSS** — new `.chart-card[data-metric-id="loyalty-penetration"]` donut-row styles in `[beta/beta.css](../../beta/beta.css)`
