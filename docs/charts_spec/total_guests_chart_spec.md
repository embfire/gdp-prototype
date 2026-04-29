# Total Guests Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-04-29
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card, search `initTotalGuestsChart`) and `[beta/dashboard-total-guests.html](../../beta/dashboard-total-guests.html)` (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how the metric is calculated, what filters do, and what the detail page must include**.

---

## 1. Overview

A daily time-series line chart showing the **running count of identified guests** over the selected date range. Each X point = one calendar day. Two lines: "This period" (solid) and "Prev period" (dashed), plotted on the same date-aligned X-axis in the same indigo color. Anonymous traffic is excluded from the count.

The chart answers: *how has our identified guest base grown (or contracted) compared to the same window in the previous period?*

---

## 2. Metric Definition

The Y value for each day is the **cumulative count of identified guests as of end of that day** — i.e., the running total of all guests the platform has on record, not the count of unique visitors that day. Values in the prototype are in the 1.13–1.24M range and trend gently upward, which is consistent with a slow-growing cumulative base.

### Notes for implementation

- **Identified guests only.** Anonymous sessions are excluded. A guest is "identified" once the platform has resolved their identity to a guest record (typically via a loyalty account, email capture, or payment linkage).
- **Prev-period alignment.** The prev-period series is shifted so day `i` of the current window aligns with day `i` of the preceding window of equal length. This puts both lines on the same calendar-date X-axis (same date labels), making visual comparison straightforward.
- **No minimum range constraint.** Unlike cohort charts, this chart renders meaningfully at 7D — a 7-day slice of the cumulative base is still a valid trend view.

---

## 3. Hero Metric

The card's primary KPI is the **total identified guest count on the last day of the selected range**.

- **Format:** M-scale to two significant decimals where trailing zeros are trimmed (e.g. `1.24M`, not `1.240M`). Full-precision integers appear only in the detail-page table.
- **Comparison:** vs. the last day of the equivalent previous period. Show the previous-period end value as sub-text (e.g. `1.13M prev period`).
- **Standard pill semantics.** More guests = better. The delta pill uses standard (non-inverse) colors:
  - Current **up** vs. prev → green pill (`chart-card__metric-pill--up`)
  - Current **down** vs. prev → red pill (`chart-card__metric-pill--down`)
- **Comparison disabled.** When "No comparison" is selected, hide the delta pill and drop the prev-period sub-text.

---

## 4. Required Data Shape

The chart needs **one row per calendar day per scope**, with values for the current and previous periods:

```ts
type TotalGuestsSnapshot = {
  date: string;    // ISO date, one row per calendar day in the selected range
  current: number; // identified guest count (M-scale: 1.24 = 1,240,000)
  prev: number;    // corresponding prev-period value, day-aligned to the same offset
};
```

### Aggregation contract

- `current[i]` is the cumulative identified guest count at end of day `i` in the selected window.
- `prev[i]` is the cumulative identified guest count at end of day `i` of the immediately preceding window of equal length. The client plots both on the same date labels (day `i` gets the current-period date, not the literal previous-period date).
- The series must be complete and continuous — missing days must not be silently dropped.
- When "No comparison" is active the API may omit the `prev` field; the client renders a single line.
- Filters (date range, comparison window, location, loyalty, segment, breakdown — see § 6) are applied server-side; the API returns only the rows the client should render.

---

## 5. Chart Specification


| Property                   | Value                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Library                    | AG Charts (Community v13)                                                                                                                  |
| Type                       | Line — two series (`prev` and `current`), same color                                                                                       |
| X-axis                     | Time, one tick per day in the data; tick interval computed from range (see below)                                                          |
| Y-axis                     | Count in millions; `formatter: value + 'M'`; starts just below minimum                                                                    |
| "This period" series       | Solid line, `stroke: '#5A55E3'` (indigo-900), `strokeWidth: 2`                                                                            |
| "Prev period" series       | Dashed line, same `stroke`, `lineDash: [2, 2]`, `strokeWidth: 2`                                                                          |
| Series order in options    | `[prev, current]` (prev is index 0). This matters for the toggle handler which maps series index to visibility key.                        |
| Markers                    | Hidden at rest (`size: 0`); size 10, filled indigo-900, white 2px stroke on `highlighted-item` state                                      |
| Native AG Charts tooltip   | Disabled on both series (`tooltip: { enabled: false }`) — replaced with a manual tooltip (see § 9)                                        |
| Native AG Charts crosshair | Enabled — `crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] }` on the X-axis. The dashed vertical line is drawn by AG Charts here, not by a custom DOM element (contrast with Guest Lifecycle which uses a manual line element). |
| Chart padding              | `{ top: 8, right: 0, bottom: 0, left: 0 }`                                                                                                |
| Background                 | `#ffffff`                                                                                                                                  |
| Font family                | Manrope (set via `theme.params.fontFamily: 'Manrope, sans-serif'` and loaded before chart init — see font loading note)                    |


### Y-axis bounds

Prototype values: `min: 1.097, max: 1.253`. Dashboard card uses 4 gridline values (`[1.10, 1.15, 1.20, 1.25]`); detail page uses 8 finer intervals (`[1.10, 1.12, …, 1.24]`). **These are placeholder bounds from prototype data — replace with values computed from the actual data range when wiring up. Apply a small buffer below min and above max so lines don't touch the axis edges.**

### X-axis tick intervals

Dashboard card: weekly labels (one every 7 days). Detail page: every 3 days. Both use `interval: { values: [...] }` to pin exact tick dates. **Replace with intervals computed dynamically from the actual date range — weekly for short windows, 3-day or daily for very short ones.**

Both pages set `nice: false` and explicit `min`/`max` so the line starts flush at the Y-axis with no leading gap.

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md § Global Filters](../dashboard_beta_ux.md#global-filters)`. Every currently-defined global filter applies to this chart:


| Filter                    | Options                                                     | Applies            | Notes                                                                                                                                                                                                                        |
| ------------------------- | ----------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date range**            | 7D, 30D, 90D, 12M, YTD, Custom                              | Yes — full support | No minimum range constraint; this chart has no entry in `CHART_CONSTRAINTS`. All options render a valid trend line.                                                                                                          |
| **Compare to**            | Previous period, Previous year, No comparison               | Yes                | Drives the prev-period series. "No comparison" hides the dashed line, the striped legend item, and the hero sub-text. "Previous year" — see § 10 Open Questions on alignment semantics.                                      |
| **Stores and Store groups** | Single or multi-store / store group                       | Yes                | Applied server-side. The count per day reflects guests who have transacted at the selected store(s). See "Filter scope semantics" note below.                                                                                 |
| **Loyalty / non-loyalty** | Loyalty program members / non-members                       | Yes                | Filters which guests are counted. Does **not** affect what "identified" means — only the subset who are enrolled (or not) in the loyalty program.                                                                             |
| **Segments**              | Any saved guest segment                                     | Yes                | Restricts the count to guests matching the selected segment(s). Useful for asking "how has segment X grown over time?"                                                                                                        |
| **Breakdown**             | By channel, By daypart                                      | Yes — see note     | Splits or filters the count by the selected dimension. Exact rendering behavior (one line per dimension value vs. a filtered single line) is TBD — see § 10 Open Questions. "By location" is omitted — location is already a global filter.                                                  |


### Filter scope semantics (Stores and Store groups)

When a store / store-group filter is applied, the count on each day should be:

> Number of identified guests who have at least one transaction at the selected store(s) / store group(s) within the date range.

A guest who exists in the platform but has never transacted at Store A would not appear in Store A's count. Confirm with PM if a different scope (e.g. guests who have ever transacted there, not just during the selected window) is preferred — they're different numbers. Tracked in § 10 Open Questions.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- Header: title `Total guests` + subtitle `Identified guests over time`. Header area is clickable → navigates to detail page.
- Breakdown dropdown in the header controls area: "By channel", "By daypart". "By location" is omitted — location is already covered by the global store filter.
- Hero metric block: latest-day M value + standard-color delta pill + prev-period sub-text.
- Toggleable legend: 2 buttons — "This period" (solid indigo marker) and "Prev period" (striped indigo marker). At least one must remain visible; the toggle handler guards against hiding the last series.
- Line chart filling the remaining card space (`flex-fill`).

The card's `data-metric-id` is `total-guests`.

---

## 8. Detail Page (`beta/dashboard-total-guests.html`)

Same content, more space, plus a data table:

- Breadcrumb → title bar (h1 `Total guests` + Help button) → global filter bar → chart card → data table → pagination.
- Chart card uses the same data and colors as the dashboard, with a taller plot area (`.chart-card__placeholder--detail`, currently 389px).
- "Get insight" (Ava) button and breakdown dropdown ("By channel", "By daypart") appear in the chart card header controls, alongside the 3-dot overflow menu.
- Data table columns follow the standard time-series layout from `[dashboard_beta_ux.md § Detail Page](../dashboard_beta_ux.md#detail-page)`:


| Column      | Format                                                    | Notes                                                                |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| Date        | `Mar 29, 2026`                                            | Left-aligned                                                         |
| This period | Integer count, comma-separated (e.g. `1,238,427`)         | Right-aligned; full-precision, not the chart's M shorthand           |
| Prev period | Integer count                                             | Right-aligned; same precision                                        |
| Δ           | Signed integer (e.g. `+27,396`)                           | Right-aligned                                                        |
| Δ%          | Signed % in colored pill (green/red per standard semantics) | Right-aligned                                                      |


- Table rows are sorted date-descending by default (newest first). Sort affordances in column headers.
- Pagination: 10 rows per page (Bento `.pagination__`* classes).
- Same global filter bar as the dashboard. Filter changes refetch and re-render both chart and table.

### Full-precision number derivation

Source data is M-scale (e.g. `1.156`). Multiply to integers and add a deterministic 0–999 offset derived from the date and a salt value so table cells look like real measurements and stay stable across renders. The prototype's `fullNumber(mValue, date, salt)` function is the reference. When real data ships at integer precision, this shim goes away.

---

## 9. Interactions

### Hover → Tooltip + crosshair

The dashed vertical crosshair line is drawn by **AG Charts native crosshair** (`crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] }` on the X-axis). No manual DOM line element is needed — this differentiates Total Guests from Guest Lifecycle.

The tooltip is a **manual implementation** (AG Charts per-series tooltip is disabled). On `mousemove` over the chart container:

1. Map cursor X to the nearest data point on the time axis.
2. Show a floated `position:fixed` tooltip to the right of the cursor (flip left if near the right viewport edge, clamp vertically to stay in bounds).
3. Tooltip content:
   - Bold header: `Total guests`
   - Row 1: solid indigo 12×12 swatch + snapped date + current-period M value (bold)
   - Row 2: delta % pill (green/red background) + `vs prev period` label
   - Row 3 (shown only if prev series is visible): striped indigo swatch + `Prev period` label + prev-period M value (subdued)
4. If the current series has been hidden via the legend, suppress the tooltip entirely.
5. Hide tooltip on `mouseleave`.

### Click → Context menu (detail page only)

Uses the `attachChartPointMenu(container, opts)` helper — see `[analytics_page_patterns.md § Chart data-point context menu](../../analytics_page_patterns.md#chart-data-point-context-menu)` for the full reusable contract.

- Clicking anywhere in the plot area opens the context menu anchored next to the cursor, snapped to the nearest data point on X.
- Series-aware: comparing the cursor's Y position to each series' projected Y, the menu picks the line (current or prev) whose projected Y is closest to the cursor. Clicking near the dashed prev-period line correctly opens the menu for the prev series.
- Menu header: color dot (solid indigo for current, striped pattern for prev) + date + M value for the selected series.
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. The `onPointMenuAction(action)` handler receives the action and `pointMenuAnchor` holds the snapped data row — wire to real flows when ready.
- The hover tooltip is hidden while the menu is open. Outside-click closes the menu via a deferred `document` listener.

Key anchoring requirement: the menu DOM lives **inside** `.content-area--chart-detail` (not a body-level overlay), and position coordinates must add the scroll container's `scrollTop` / `scrollLeft` so the menu doesn't drift on scroll. See `analytics_page_patterns.md § Anchoring (must scroll with the chart)` for the exact formula.

---

## 10. Open Questions for PM

These are not blockers for the chart wiring but should be settled before the metric ships:

1. **Breakdown rendering.** When "By channel" or "By daypart" is selected, does the chart render one line per dimension value (multi-series) or remain a single aggregated line with the filter applied? If multi-series: what is the maximum number of lines, and which palette colors are used beyond indigo-900?
2. **"Compare to: Previous year" semantics.** Does the prev-period series align by calendar date (same MM-DD) or by day offset from the period start? These produce different curves and both need different axis labeling.
3. **"No comparison" state.** Confirm that selecting "No comparison" hides the dashed prev series, removes the striped legend button, and suppresses the prev-period sub-text and tooltip row.
4. **Guest count definition.** Confirm the daily value is the running cumulative count of identified guests as of end of that day — not the count of unique guests who visited that day.
5. **Filter scope semantics (location).** When a store filter is applied, should the count include guests who transacted there within the selected date range only, or anyone who has ever transacted there?
6. **Identified-guest scope.** Confirm the definition of "identified" (loyalty account, email capture, payment linkage, or some combination) and which identity-resolution events cause the count to tick up.

---

## 11. Reference Files

- **Dashboard UX patterns (cards, filters, detail page)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, font, table, button)** — `[docs/dashboard_beta_ux.md § Implementation Rules](../dashboard_beta_ux.md#implementation-rules)`
- **Chart data-point context menu (reusable helper)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md#chart-data-point-context-menu-inner--detail-pages)`
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (search `initTotalGuestsChart`, `TOTAL_GUESTS_DATA`)
- **Reference implementation — detail page** — `[beta/dashboard-total-guests.html](../../beta/dashboard-total-guests.html)`
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)`
