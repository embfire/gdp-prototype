# Guest Lifecycle Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-04-29
**Reference implementation:** [`beta/index.html`](../beta/index.html) (dashboard card) and [`beta/dashboard-guest-lifecycle.html`](../beta/dashboard-guest-lifecycle.html) (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how stages are calculated, what filters do, and what the detail page must include**.

---

## 1. Overview

A daily-snapshot stacked area chart showing the **distribution of identified guests across six lifecycle stages** over the selected date range. Each X point = one calendar day. Each Y band = the count of guests in that stage on that day.

Stage order (bottom → top of stack):

1. First-time
2. Returning
3. Win-back
4. Loyal
5. At-Risk
6. Churned

The stack always sums to the total identified guest base for that day. A guest is in **exactly one** stage on any given day.

---

## 2. Stage Definitions

These rules are the source of truth for stage assignment. Every identified guest must resolve to exactly one of these stages on every snapshot date.

| Stage | Definition | Threshold |
|---|---|---|
| **First-time** | One transaction ever | Visit count = 1 |
| **Returning** | Building first-journey habit | Visit count = 2, last visit ≤ 180 days ago, has never been Loyal |
| **Loyal** | Habit established | Visit count ≥ 3, still active per personal baseline (see At-Risk rule) |
| **At-Risk** | Missed expected window | Time since last visit > 1.5 × personal inter-visit average. If guest has < 3 visits, use a 90-day floor instead of a personal average. |
| **Win-back** | Re-engaged after At-Risk or Churned | First transaction following an At-Risk or Churned status. Guest retains lifetime visit count and history. |
| **Churned** | Long inactive | Last visit > 180 days ago |

### Notes for implementation

- **Per-guest At-Risk baseline.** This is the differentiator vs. a fixed-window definition. For a guest with visit gaps `g1, g2, …, gn`, compute `avg = mean(g1..gn)` and the At-Risk threshold is `1.5 × avg` since the last visit. Guests with fewer than 3 visits use the 90-day floor.
- **Win-back exit.** A guest in Win-back transitions out as soon as their visit count + recency satisfies another stage's rule. Typically that means moving to Loyal (after the next visit if they were already at 3+ lifetime visits) or back to At-Risk if they lapse again.
- **Stage history.** Each guest needs a stable record of their previous stage, so the moment they re-engage we can detect "previously At-Risk/Churned → now active" and route them into Win-back rather than collapsing them into Returning.
- **Hardcoded thresholds for beta**, configurable per-tenant at GA. The numeric thresholds (180 days, 90 day floor, 1.5× factor, 3 visits for Loyal) should live in config, not be hardcoded in queries.
- **Identified guests only** — anonymous traffic is excluded from the stack.

For the reasoning behind each threshold, see [`docs/lifecycle_stages_proposition.md`](lifecycle_stages_proposition.md).

---

## 3. Hero Metric

The card's primary KPI is the **At-Risk guest count** for the latest day in the selected range.

- **Why At-Risk and not the total stack:** the total only changes when the identified base grows; At-Risk is the actionable signal — it's the cohort campaigns target.
- **Comparison:** vs. previous period (same length, immediately preceding the selected range). Show absolute previous-period value next to the pill (e.g. `At-Risk · 138.1K prev period`).
- **Inverse pill semantics — important.** At-Risk is "lower is better". The delta pill colors are **inverted** vs. a normal metric:
  - At-Risk **up** vs. prev → red pill (`--inverse` modifier on `chart-card__metric-pill--up`)
  - At-Risk **down** vs. prev → green pill (`--inverse` modifier on `chart-card__metric-pill--down`)
- The hero value displays in K-scale to one decimal (e.g. `142.8K`). Detail-page table cells use full-precision integers.

---

## 4. Required Data Shape

The chart needs **one row per snapshot date per scope**, with a count for each stage:

```ts
type LifecycleSnapshot = {
  date: string;          // ISO date, one row per calendar day
  firstTime: number;     // count of guests
  returning: number;
  winBack: number;
  loyal: number;
  atRisk: number;
  churned: number;
};
```

### Aggregation contract

- Each row is the **end-of-day snapshot count** of guests in each stage. The sum across all six fields = total identified guests at end of that day.
- Backfill: the chart needs a continuous daily series for the selected range. Missing days should not be silently dropped.
- For comparison: the API also needs the equivalent series for the previous period (same length, immediately preceding) so the hero pill and per-period totals can be computed. The chart itself does **not** render the prev-period stack — only the hero metric uses it.
- Filters (date range, comparison, location, etc. — see § 6) are applied server-side; the API returns only the rows the client should render.

---

## 5. Chart Specification

| Property | Value |
|---|---|
| Library | AG Charts (Community v13) |
| Type | Stacked area, single `stackGroup` |
| X-axis | Time, one tick per day |
| Y-axis | Count of guests, starts at 0 |
| Series order (bottom → top) | First-time, Returning, Win-back, Loyal, At-Risk, Churned |
| Series colors | Bento chart palette in order — see [`dashboard_beta_ux.md` § Chart Colors](dashboard_beta_ux.md#chart-colors) |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }` on every series) — replaced with a manual tooltip |
| Native AG Charts crosshair | Disabled — replaced with a manual dashed vertical line |

The dashboard card uses a fixed Y-axis label format (`'###K'`); the detail page uses the same format with an explicit `min: 0, max: 1200, nice: false` plus an `interval: { values: [0, 300, 600, 900, 1200] }` so the gridlines lock to round numbers. **These hardcoded bounds are placeholder data scaling — replace them with values derived from the real data range when wiring up.**

---

## 6. Filters

Inherited from the global dashboard filter bar — see [`dashboard_beta_ux.md` § Global Filters](dashboard_beta_ux.md#global-filters). Every filter currently defined globally **applies to this chart**:

| Filter | Options | Applies | Notes |
|---|---|---|---|
| **Date range** | 7D, 30D, 90D, 12M, YTD, Custom | Yes — full support | Drives the X-axis range and determines which day is "latest" for the hero metric. No minimum-range constraint; even 7D renders fine because each X point is a daily snapshot. |
| **Compare to** | Previous period | Yes — hero metric only | Used to compute the At-Risk delta pill and the "138.1K prev period" sub-text. The chart body does **not** render the prev-period stack — only the hero uses it. |
| **Location** | Single or multi-location | Yes | Applied server-side before aggregation. See "Filter scope semantics" note below. |
| **Loyalty / non-loyalty** | Loyalty program members / non-members | Yes | Filters which guests are counted. **Does not** redefine the lifecycle stages themselves — see "Loyalty filter vs. Loyal stage" note below. |

> "Additional dimensions TBD" in `dashboard_beta_ux.md` are not yet scoped. When they're added globally, evaluate each one against this chart and update this table.

### Filter scope semantics (Location)

A guest's lifecycle stage is computed against their **full** transaction history. When a location filter is applied, the count returned for each stage should be:

> Number of guests whose current stage is X **and** who have transacted at the selected location(s) within the date range.

So a guest who is "Loyal" overall but has never visited Location A would not appear in Location A's Loyal count. Confirm this with PM if a different interpretation (e.g. recompute the stage using only Location A's transactions) is preferred — they're meaningfully different numbers. Tracked in § 10 Open Questions.

### Loyalty filter vs. "Loyal" stage — important to disambiguate

These are two unrelated dimensions that share a word:

- **Loyalty filter** (global): is the guest enrolled in the loyalty program? Yes / No.
- **Loyal stage** (this chart): does the guest have ≥ 3 visits and remain active per their personal baseline? Yes / No.

A guest can be in any combination of the two — e.g. enrolled in loyalty but in the At-Risk stage, or not enrolled but in the Loyal stage. The filter and the stage are computed independently and AND-ed together when the filter is active.

### No-comparison case

If "Compare to" is set to a no-comparison option in the future (currently only "Previous period" is defined), the hero pill should hide and the period text should drop the "· 138.1K prev period" suffix. The chart itself is unaffected.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- Header: title `Guest lifecycle` + subtitle `Distribution of identified guests across lifecycle stages`. Header is clickable → navigates to detail page.
- Hero metric block: At-Risk K value + inverse-color delta pill + period text.
- Toggleable legend: 6 buttons, one per stage. Toggling hides that series in the chart **and** removes its row from the tooltip. At least one stage must remain visible.
- Stacked area chart filling the remaining card space (uses flex-fill — see `.chart-card[data-metric-id="guest-lifecycle-breakdown"]` rules in `beta.css`).

---

## 8. Detail Page (`beta/dashboard-guest-lifecycle.html`)

Same content, more space, plus a data table:

- Breadcrumb → title bar (h1 + Help button) → global filter bar → chart card → data table → pagination.
- Chart card uses the same data and colors as the dashboard, with a taller plot area (`.chart-card__placeholder--detail`).
- Data table columns:

| Column | Format | Notes |
|---|---|---|
| Date | `Mar 29, 2026` | Left-aligned |
| First-time | Integer count, comma-separated (e.g. `120,847`) | Right-aligned |
| Returning | Integer count | Right-aligned |
| Win-back | Integer count | Right-aligned |
| Loyal | Integer count | Right-aligned |
| At-Risk | Integer count | Right-aligned |
| Churned | Integer count | Right-aligned |
| Δ At-Risk | Signed integer count vs. previous day (e.g. `+1,247`) | Right-aligned, **inverse-colored** pill (red if growing, green if shrinking — same logic as the hero) |

- Pagination: 10 rows per page (Bento `.pagination__*` classes).
- Same global filter bar as the dashboard. Filter changes refetch and re-render both the chart and the table.

---

## 9. Interactions

### Hover → Tooltip + dashed vertical line

Manual implementation, not AG Charts native (see `initLifecycleChart()` in either HTML file for reference).

- On mousemove over the chart container, snap to the nearest data point on X.
- Show a tooltip floated to the right of the cursor with: header `Guest lifecycle`, the snapped date, and one row per **visible** stage (color square + label + K value).
- Show a dashed vertical line (`#c6c6c6`, 4-on/4-off pattern) at the snapped X across the plot area.
- Hidden stages (toggled off in the legend) do not appear in the tooltip.
- Both elements hide on `mouseleave` and outside the plot bounds.

### Click → Context menu (detail page only)

- Click inside any visible stacked band → opens a context menu anchored next to the cursor.
- The menu identifies which stage was clicked by computing the cumulative Y bands at the snapped date and finding which band the cursor's Y lands in. The menu header shows: stage color dot + date + that stage's K value for that day.
- Clicks outside any visible band do nothing.
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. The `onPointMenuAction(action)` handler receives the action, the snapped data row, and the selected stage object — wire to real flows when ready.

This pattern is the same as the Total Guests detail page; see [`dashboard_beta_ux.md` § Click → Context Menu](dashboard_beta_ux.md#click--context-menu).

---

## 10. Open Questions for PM

These are not blockers for the chart wiring but should be settled before the metric ships:

1. **Stage thresholds.** Confirm 180-day churn window, 90-day At-Risk floor, 1.5× personal-baseline factor, and 3-visit Loyal threshold are all approved. Hardcoded for beta, configurable per-tenant at GA.
2. **Win-back exit rule.** When does a guest leave Win-back? The current proposition implies "as soon as another stage's rule applies", which usually means Loyal on the next visit. Confirm.
3. **Filter scope semantics.** When a location filter is applied, does the count include guests whose stage is X and who have transacted at that location, or guests whose stage is X **as evaluated against only that location's transaction history**? Different answers produce different numbers.
4. **Hero metric configurability.** Should an admin be able to swap the hero from At-Risk to a different stage (e.g. Churned) per tenant?
5. **Identified-guest scope.** Confirm anonymous traffic is excluded from every stage count.

---

## 11. Reference Files

- **Stage rationale and customer/industry evidence** — [`docs/lifecycle_stages_proposition.md`](lifecycle_stages_proposition.md)
- **Dashboard UX patterns (cards, filters, detail page)** — [`docs/dashboard_beta_ux.md`](dashboard_beta_ux.md)
- **Reusable chart conventions (palette order, font, etc.)** — [`docs/dashboard_beta_ux.md` § Chart Colors](dashboard_beta_ux.md#chart-colors)
- **Reference implementation — dashboard card** — [`beta/index.html`](../beta/index.html) (search `initLifecycleChart`, `LIFECYCLE_STAGES`, `LIFECYCLE_DATA`)
- **Reference implementation — detail page** — [`beta/dashboard-guest-lifecycle.html`](../beta/dashboard-guest-lifecycle.html)
- **Card layout CSS** — [`beta/beta.css`](../beta/beta.css) (search `guest-lifecycle-breakdown`)
