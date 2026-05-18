# Guest Repeat Rate Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-17
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card) and `[beta/dashboard-guest-repeat-rate.html](../../beta/dashboard-guest-repeat-rate.html)` (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how repeat rate is calculated, what filters do, and what the detail page must include**.

---

## 1. Overview

A **period-over-period retention rate** for identified guests: of everyone who transacted in a **base period**, what percentage also transacted in the **immediately following period** of equal length.

The metric answers: *"Are guests who showed up in period N coming back in period N+1?"*

Prototype presentation:

| Surface | Visualization |
| ------- | ------------- |
| **Dashboard card** | Dual-line time series — repeat rate per base period (`current` solid, comparison `prev` dashed) |
| **Detail page — trend card** | Same series with more plot height, cohort filter, and click → context menu |
| **Detail page — breakdown card** | Vertical bar chart of repeat rate for the **latest complete base period**, sliced by location / channel / loyalty status |
| **Detail page — table** | One row per base period with full-precision rates and deltas |

This chart is **not** the same as **Retention cohort** (acquisition-month M+1 matrix / heatmap). Repeat rate uses a rolling base period and a single follow-up window; retention cohort fixes acquisition month and measures M+N independently. See § 10 Open Questions.

---

## 2. Metric Definitions

These rules are the source of truth. Every rate must reconcile to the same guest sets in the API and in QBR-style reporting.


| Concept | Definition |
| ------- | ---------- |
| **Visit** | One guest-day with at least one qualifying transaction — dedupe by `(guest_id, calendar_day)`. Two transactions on the same day by the same guest count as one visit. Align with Punchh QBR / Loyalty Spend Lift visit semantics unless PM approves a different dedupe key (see § 10). |
| **Base period** | A contiguous time bucket (calendar month in the prototype; see § 6 for how the global date-range filter maps to buckets). |
| **Follow-up period** | The immediately next bucket of **equal length** to the base period. Example: base = March 2026 → follow-up = April 2026. Base = last 30D of a 30D filter → follow-up = the prior 30D block immediately before the base window (confirm alignment with comparison-period logic in § 10). |
| **Guest repeat rate** | `(guests in base who also have ≥1 visit in follow-up) ÷ (guests with ≥1 visit in base) × 100` |
| **All actives (default cohort)** | Denominator = all identified guests with ≥1 visit in the base period. Numerator = subset of those who also visited in the follow-up period. |
| **New guests only (detail filter)** | Denominator = identified guests whose **first-ever visit** falls in the base period. Numerator = subset of those who also visited in the follow-up period. Same follow-up window as all actives. |

### Equivalence to "2+ visits across periods"

A guest counts toward the numerator if and only if they have ≥1 visit in the base period **and** ≥1 visit in the follow-up period — i.e. at least two visits spanning base + follow-up. They do **not** need two visits inside the base period alone.

### Notes for implementation

- **Identified guests only.** Anonymous traffic is excluded from numerator and denominator.
- **Incomplete base periods must be excluded or flagged.** The follow-up period for the current calendar month cannot be measured until that month ends (and ingestion lag is accounted for). The hero and breakdown snapshot use the **latest complete base period** only.
- **Comparison series (`prev` on the chart).** For each base period on the X-axis, `prev` is the repeat rate for the **comparison-period equivalent** base month (prototype: YoY-style prior-year values on the same month labels). When global "Compare to" is previous period, align `prev` with the immediately preceding comparison window, not necessarily calendar year — confirm with PM (§ 10).
- **Hardcoded thresholds for beta**, configurable per-tenant at GA. Minimum range (90 days), bucket granularity, and ingestion lag rules should live in config.

---

## 3. Hero Metric

The card's primary KPI is the **repeat rate for the latest complete base period** in the selected range.

- **Latest complete base period:** the most recent base bucket for which the follow-up bucket has fully elapsed and data is available. Prototype mock uses **Mar '26** → **42.8%**.
- **Comparison:** vs. the **`prev` rate at the same base period** (comparison-period equivalent — e.g. Mar '26 base: `current` 42.8% vs. `prev` 40.7% on the same row). Prototype period text: `40.7% prev period`. This is **not** "previous calendar month's `current`" unless comparison mode is defined that way (§ 10).
- **Pill semantics — standard (non-inverse).** Higher repeat rate is better:
  - Rate **up** vs. comparison → green pill (`chart-card__metric-pill--up`)
  - Rate **down** vs. comparison → red pill (`chart-card__metric-pill--down`)
- **Delta unit — percentage points (`pts`), not percent.** Repeat rate is already a percent; period-over-period change is expressed as `+2.1pts`, not `+5.2%`. Formula: `(currentRate − comparisonRate) × 100` when rates are stored as decimals.
- **Format:** one decimal on the card hero (e.g. `42.8%`); two decimals in the detail table (e.g. `42.83%`).
- **Info indicator (dashboard only):** inline `Showing 90D minimum` with tooltip: `"Showing 90 days minimum — Needs at least two months for base and follow-up periods"`. Driven by `CHART_CONSTRAINTS` in `beta/index.html` (`minDays: 90`). When the selected range is below the floor, the card still renders at the minimum supported range and shows this notice (same pattern as Retention cohort).

Detail trend card period text adds base-month context: `40.7% prev period · Mar '26 base`.

---

## 4. Required Data Shape

### Trend series (dashboard card + detail trend card)

One row per **base period** in the selected range:

```ts
type RepeatRateTrendRow = {
  date: string;      // ISO date — first day of the base period (e.g. 2025-04-01 for Apr '25 base month)
  current: number;   // repeat rate as decimal (e.g. 0.428 = 42.8%)
  prev: number;      // comparison repeat rate for the aligned comparison base period (same decimal scale)
  // Optional but recommended for table drill-down and QA:
  baseGuests?: number;
  returnedGuests?: number;
};
```

### Breakdown snapshot (detail page only)

One row per dimension value for the **latest complete base period** only (not a time series):

```ts
type RepeatRateBreakdownRow = {
  label: string;     // e.g. "Downtown", "In-store", "Loyalty members"
  rate: number;      // repeat rate as decimal for that slice
  baseGuests?: number;
  returnedGuests?: number;
};
```

Return three arrays (or one keyed object) for `location`, `channel`, and `loyalty` dimensions.

### Aggregation contract

- Server returns only rows for base periods that are **complete** (follow-up elapsed + data landed).
- Filters (date range, comparison, location, loyalty, segment — see § 6) are applied **server-side** before computing guest sets.
- The chart does not compute rates client-side from raw transactions.
- For comparison: when "Compare to" is active, populate `prev` on each trend row. When comparison is off, omit `prev` or return null and hide the comparison series and pill.
- **Cohort toggle (detail only):** `All actives` vs. `New guests only` are separate API requests or a `cohort` query param — do not derive new-guest rates by scaling all-actives client-side (prototype uses a separate series with ~6 pts lower mock values).

---

## 5. Chart Specification

### Trend (dashboard + detail)

| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Line — two series |
| X-axis | Time (base period start date). Prototype uses **monthly** buckets with labels like `Apr '25` |
| Y-axis | Rate as decimal, formatted as percent (e.g. `0.42` → `42%`) |
| Series 1 (rendered first) | `prev` — indigo `#5A55E3`, `lineDash: [2, 2]`, legend marker striped |
| Series 2 | `current` — indigo `#5A55E3`, solid, legend marker solid |
| Native AG Charts tooltip | Disabled — manual tooltip on dashboard and detail |
| Native AG Charts crosshair | Enabled on X (`#c6c6c6`, dashed) |
| Chart padding | Dashboard: `bottom: 24` (reserves space for monthly X labels). Detail trend: `bottom: 32`, `right: 16`, `left: 8` |

Y-axis bounds in the prototype are placeholder (`min`/`max` / `interval.values` hardcoded). **Replace with values derived from the filtered data range** (suggested: pad ~5% below min and above max rate, snap ticks to sensible 2% or 5% increments).

Dashboard card uses flex-fill CSS (`.chart-card[data-metric-id="guest-repeat-rate"]` in `beta.css`) so monthly X labels stay inside the card border.

### Breakdown (detail only)

| Property | Value |
| -------- | ----- |
| Type | Vertical bar |
| X-axis | Category (`label`) |
| Y-axis | Rate 0–100% (`min: 0`, top tick ~50–55% with headroom) |
| Fill | Indigo `#5A55E3`, `cornerRadius: 4` |
| Legend | None on breakdown card (single series) |

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters).


| Filter | Options | Applies | Notes |
| ------ | ------- | ------- | ----- |
| **Date range** | 7D, 30D, 90D, 12M, YTD, Custom | Yes — drives which base periods appear on the X-axis | **Minimum 90 days** on the dashboard card (`CHART_CONSTRAINTS.guest-repeat-rate`). Below 90D, card shows "Showing 90D minimum" and renders as if 90D were selected. Detail page defaults to **12M** active in the prototype but should respect the same floor. |
| **Compare to** | Previous period (future: previous year, no comparison) | Yes — `prev` series + hero delta | When disabled: hide `prev` line, striped legend entry, comparison portion of tooltip, and delta pill; period text drops comparison suffix. |
| **Stores and Store groups** | Single or multi-store / store group | Yes | Applied server-side when building base-guest and returned-guest sets. Confirm whether a guest must have transacted **at** the filtered store(s) in the base period, in the follow-up period, or **both** (§ 10). |
| **Loyalty / non-loyalty** | Loyalty members / non-members | Yes | Filters which guests enter the rate. Breakdown card can still slice by loyalty status for the latest base month. |
| **Segments** | Any saved guest segment | Yes | Restricts numerator and denominator to segment members. |

### Detail-only controls (not global filters)

| Control | Location | Options | Behavior |
| ------- | -------- | ------- | -------- |
| **Cohort** | Trend card header dropdown | All actives · New guests only | Swaps trend series + table rows. Does not affect breakdown card (breakdown is all-actives unless PM specifies otherwise — § 10). |
| **Breakdown dimension** | Breakdown card header dropdown | By location · By channel · By loyalty status | Swaps breakdown bar dataset only. |

### Bucket granularity vs. date range

The prototype hardcodes **calendar-month** base periods (Apr '25 – Mar '26). Engineering must define how each global range maps to buckets:

| Range | Suggested behavior |
| ----- | ------------------ |
| **12M / YTD** | One point per calendar month |
| **90D** | Monthly if ≥90D; otherwise weekly — confirm with PM |
| **30D / 7D** | Likely below minimum or weekly buckets with strong incomplete-period handling |

Until PM confirms, implement monthly buckets for ≥90D ranges and enforce the 90D floor on the dashboard card.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid (`metric-id`: `guest-repeat-rate`):

- **Header:** title `Guest repeat rate` + subtitle `Share of base-period guests who returned in the next period`. Header click → `dashboard-guest-repeat-rate.html`.
- **Hero:** repeat rate % + `pts` delta pill + `40.7% prev period` + 90D-minimum info indicator when applicable.
- **Legend:** toggleable `This period` / `Previous period`. At least one series must remain visible.
- **Chart:** dual-line trend; manual hover tooltip (see § 9). No click → context menu on the dashboard (user navigates to detail for drill-down).
- **Library entry:** `ALL_METRICS` includes `guest-repeat-rate`; not in default layout — user adds via Manage mode.

---

## 8. Detail Page (`beta/dashboard-guest-repeat-rate.html`)

Layout: breadcrumb → title bar (h1 + Help) → global filter bar → **chart stack** → data table → chart-point context menu.

### Trend card

- Same metric definition and colors as dashboard.
- **Cohort dropdown** (All actives / New guests only) in header controls.
- Taller plot (`.chart-card__placeholder--detail`, 389px).
- **Click → context menu** on the trend chart (View users / Create segment / Ask Ava) — uses `attachChartPointMenu()` with Y-axis bounds for series-aware clicks (solid vs. striped prev line). See `[dashboard_beta_ux.md` § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu) and `[analytics_page_patterns.md](../../analytics_page_patterns.md)`.

### Breakdown card

- Title `Repeat rate by dimension`, subtitle references latest complete base month (e.g. `Mar '26`).
- **Dimension dropdown:** By location / By channel / By loyalty status.
- Single-series vertical bars for that snapshot only — not a time series.

### Data table

One row per base period in the active cohort's trend series:


| Column | Format | Notes |
| ------ | ------ | ----- |
| Base month | `Apr '25` | Left-aligned. Header uses `.chart-th-inner--start` |
| Repeat rate | `42.83%` | Right-aligned. Two decimal places |
| Previous period | `40.71%` | Right-aligned. Comparison-series rate for aligned period |
| Δ | `+2.1pts` | Right-aligned. Signed percentage points |
| Δ% | Pill | Relative change vs. previous period rate: `(current − prev) / prev × 100`. Green/red pill styling per dashboard_beta_ux |

- Pagination: 10 rows per page (Bento `.pagination__*` classes). Prototype has 12 monthly rows → 2 pages.
- Filter or cohort changes refetch and re-render trend chart, breakdown (if latest base month changes), and table.

---

## 9. Interactions

### Hover → Tooltip (dashboard + detail trend)

Manual implementation (`initGuestRepeatRateChart` / `wireTrendTooltip` in reference files).

- Snap to nearest base period on X.
- Tooltip header: `Guest repeat rate`.
- Body: base month label + **current** rate; row showing `pts` delta vs. that row's `prev` rate; optional **Previous period** row when prev series visible (striped marker).
- Hidden when `current` series is toggled off.
- Dashboard uses `PLOT_LEFT: 38`; detail trend uses `46` / `plotRightPad: 16` — pass real plot metrics from the chart layout when wiring production.

### Click → Context menu (detail trend only)

- Click inside plot area → menu anchored to cursor, snapped to nearest base period.
- Header: color dot (striped if prev series selected) + `{base month} base` + rate value.
- Menu actions (stubbed): View users / Create segment / Ask Ava.
- `pointMenuAnchor` holds the snapped `RepeatRateTrendRow`; wire `onPointMenuAction` to real flows.

### Breakdown card

No point menu in prototype. Optional future: click bar → segment-scoped guest list.

---

## 10. Open Questions for PM

1. **Bucket granularity.** Are rates always monthly, or should 30D/90D custom ranges use weekly (or rolling 30-day) buckets?
2. **Compare-to alignment.** Should `prev` on each point mean prior calendar year, prior period's equivalent month, or literally the previous base bucket in the series?
3. **Store filter semantics.** For a location filter, must the guest have visited **in the base period at that location**, **in the follow-up at that location**, or **either**?
4. **New-guest breakdown.** Should the breakdown bar chart respect the "New guests only" cohort toggle, or always show all actives?
5. **Incomplete current month.** Show partial month in the trend line, exclude it, or show with a dashed "incomplete" marker?
6. **Parity with Punchh QBR.** Is there an existing QBR metric name / SQL definition this must match exactly?
7. **Differentiation from Retention cohort.** Marketing copy: repeat rate = rolling base→follow-up; retention cohort = acquisition month × M+N matrix. Confirm both ship and how to cross-link in UI.

---

## 11. Reference Files

- **Dashboard UX patterns (cards, filters, detail page, table columns)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, flex-fill, point menu)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md)`
- **PAG / product context** — `[docs/analytics_proposition.md](../analytics_proposition.md)` (Guest Repeat Rate #4 in PAG exercise; Guests > Retention page)
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (search `guest-repeat-rate`, `GUEST_REPEAT_RATE_DATA`, `initGuestRepeatRateChart`, `CHART_CONSTRAINTS`)
- **Reference implementation — detail page** — `[beta/dashboard-guest-repeat-rate.html](../../beta/dashboard-guest-repeat-rate.html)` (search `REPEAT_RATE_ALL_DATA`, `REPEAT_RATE_NEW_DATA`, `BREAKDOWN_BARS`, `initRepeatRateTrendChart`, `initRepeatRateBreakdownChart`)
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `guest-repeat-rate`, `#chart-area-guest-repeat-rate`)
