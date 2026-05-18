# Active Guests Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-18
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card, search `initActiveGuestsChart`) and `[beta/dashboard-active-guests.html](../../beta/dashboard-active-guests.html)` (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how the metric is calculated, what filters do, and what the detail page must include**.

---

## 1. Overview

A daily time-series line chart showing the **count of active identified guests** on each calendar day in the selected date range. Each X point = one calendar day.

In the default "Total" mode, two lines are drawn: "This period" (solid) and "Previous period" (dashed), plotted on the same date-aligned X-axis in the same indigo color. Anonymous traffic is excluded.

A guest is **active** on snapshot date `D` if they have **at least one verified transaction** in the trailing **N** days ending on `D` (configurable **30 / 60 / 90** days; default **90**). This is a **point-in-time behavioral count**, not the cumulative identified base (see `[total_guests_chart_spec.md](./total_guests_chart_spec.md)`).

A **breakdown filter** on the detail page splits the chart into multiple lines by loyalty status, channel, location, or segment (see § 6). When a breakdown is active the prev-period comparison is dropped and replaced with per-dimension lines.

The chart answers: *how large is our currently transacting guest base, is it growing vs. the prior period, and which dimensions (loyalty, channel, location, segment) drive that base?*

---

## 2. Metric Definition

The Y value for each day is the **count of distinct identified guest profiles** who satisfy the active rule on that snapshot date.

### Active rule

```
guest is ACTIVE on date D  ⇔  EXISTS transaction T
                              WHERE T.guest_id = guest.id
                                AND T.is_verified = true
                                AND T.transaction_date ∈ (D − N days, D]
```

Where `N` = activity window in days (30, 60, or 90).

### Notes for implementation

- **Identified guests only.** Same IDR / guest-resolution rules as Total Guests. Anonymous sessions are excluded.
- **Verified transactions only.** Align with the CDP transaction model — exclude voided, test, or non-countable transaction types per platform rules (confirm with data team).
- **Rolling window, not calendar month.** The window is always trailing N days from each snapshot date, not "active in April" or "active in Q1".
- **One count per guest per day.** A guest with five transactions in the window still counts once on that day's snapshot.
- **Not lifecycle stage.** "Active" here is a **recency / transaction** definition. It is unrelated to the "Loyal" or "At-Risk" **lifecycle stages** on the Guest Lifecycle chart — a guest can be Active and At-Risk simultaneously under different models. See § 6 "Activity window vs. lifecycle".
- **Prev-period alignment.** The prev-period series uses the same activity window `N` and aligns day `i` of the current window with day `i` of the immediately preceding window of equal length (same semantics as Total Guests).
- **No minimum date-range constraint.** Unlike cohort charts, this chart has no entry in `CHART_CONSTRAINTS` — 7D renders meaningfully.
- **Punchh parity.** QBR already reports "active members" at 30 / 60 / 90 / 180 / 365-day windows for loyalty programs. This chart generalizes that pattern to **all identified guests** (loyalty + non-loyalty) with a default 90D window.

### Distinction from Total Guests


| Dimension | Total guests | Active guests |
| --------- | ------------ | ------------- |
| **What it measures** | Cumulative identified base (stock) | Guests who transacted recently (flow) |
| **Formula** | Count of all identified profiles as of EOD | Count with ≥1 verified txn in trailing N days |
| **Typical magnitude** | Larger (prototype ~1.24M) | Smaller (prototype ~346K at 90D) |
| **Trend shape** | Usually slow, steady growth | Can rise or fall with seasonality, churn, reactivation |
| **Use as denominator** | Total addressable CRM base | Working audience for retention & per-guest metrics |

Active guests ⊆ Total guests in normal conditions (every active guest should already be identified). Total can grow while active shrinks when identification outpaces re-engagement.

---

## 3. Hero Metric

The card's primary KPI is the **active guest count on the last day** of the selected date range, evaluated with the current activity window.

- **Why the latest day:** matches Total Guests and other time-series KPIs — the hero is the end-state of the selected window, not the average or peak across the range.
- **Format:** K-scale with trimmed decimals on the card (e.g. `346K`, `1.2M` if the count exceeds 999K). Use M-scale only when values warrant it. Full-precision integers appear only in the detail-page table.
- **Comparison:** vs. the last day of the equivalent previous period. Show the previous-period end value as sub-text (e.g. `338K prev period · 90D window`). The activity-window suffix (`90D window`) reflects the current `N`; update when the user changes the activity window on the detail page.
- **Standard pill semantics.** More active guests = better. The delta pill uses standard (non-inverse) colors:
  - Current **up** vs. prev → green pill (`chart-card__metric-pill--up`)
  - Current **down** vs. prev → red pill (`chart-card__metric-pill--down`)
- **Comparison disabled.** When "No comparison" is selected, hide the delta pill and drop the prev-period sub-text.

---

## 4. Required Data Shape

The chart needs **one row per calendar day per scope**, with values for the current and previous periods:

```ts
type ActiveGuestsSnapshot = {
  date: string;    // ISO date, one row per calendar day in the selected range
  current: number; // active guest count (API may return integer; client may display as K)
  prev: number;    // corresponding prev-period value, day-aligned to the same offset
};
```

When a breakdown is active the API returns per-segment columns instead of `current`/`prev`:

```ts
// breakdown=loyalty-status
type ActiveGuestsByLoyalty = {
  date: string;
  loyalty:     number; // active guests enrolled in loyalty program
  nonLoyalty:  number; // active guests not enrolled in loyalty program
};

// breakdown=channel
type ActiveGuestsByChannel = {
  date: string;
  inStore:  number; // active via in-store transactions in window
  online:   number; // active via digital ordering
  delivery: number; // active via delivery / third-party (confirm channel taxonomy)
};

// breakdown=location
type ActiveGuestsByLocation = {
  date: string;
  northeast: number; // active guests with qualifying txn at stores in region
  southeast: number;
  midwest: number;
  west: number;
};

// breakdown=segment
type ActiveGuestsBySegment = {
  date: string;
  habitual:   number; // active guests in habitual frequency bucket
  regular:    number;
  occasional: number;
};
```

The `prev` comparison field is omitted from breakdown responses — the chart shows per-segment current-period lines only. Segment bucket definitions for `breakdown=segment` must come from the CDP frequency model, not the prototype's mock splits.

### Aggregation contract

- `current[i]` is the active guest count on snapshot date `i` using activity window `N` and all active global filters.
- `prev[i]` is the active guest count on day `i` of the immediately preceding window of equal length, using the same `N`. The client plots both on the same date labels (day `i` gets the current-period date, not the literal previous-period calendar date).
- The series must be complete and continuous for the selected range — missing days must not be silently dropped.
- When "No comparison" is active the API may omit the `prev` field; the client renders a single line.
- **Activity window changes** require a full refetch — `N` is part of the query, not a client-side filter on a single payload.
- Filters (date range, comparison, activity window, location, loyalty, segment, breakdown — see § 6) are applied server-side; the API returns only the rows the client should render.

---

## 5. Chart Specification


| Property                   | Value                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Library                    | AG Charts (Community v13)                                                                                                                  |
| Type                       | Line — two series (`prev` and `current`) in "Total" mode; multi-series in breakdown modes                                                  |
| X-axis                     | Time, one tick per day in the data; tick interval computed from range (see below)                                                          |
| Y-axis                     | Count in thousands; `formatter: value + 'K'`; starts just below minimum                                                                    |
| "This period" series       | Solid line, `stroke: '#5A55E3'` (indigo-900), `strokeWidth: 2`                                                                            |
| "Prev period" series       | Dashed line, same `stroke`, `lineDash: [2, 2]`, `strokeWidth: 2`                                                                          |
| Series order in options    | `[prev, current]` (prev is index 0). This matters for the toggle handler which maps series index to visibility key.                        |
| Markers                    | Hidden at rest (`size: 0`); size 10, filled indigo-900, white 2px stroke on `highlighted-item` state                                      |
| Native AG Charts tooltip   | Disabled on all series (`tooltip: { enabled: false }`) — replaced with a manual tooltip (see § 9)                                        |
| Native AG Charts crosshair | Enabled — `crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] }` on the X-axis (same as Total Guests).                        |
| Chart padding              | `{ top: 8, right: 0, bottom: 0, left: 0 }`                                                                                                |
| Background                 | `#ffffff`                                                                                                                                  |
| Font family                | Manrope (set via `theme.params.fontFamily: 'Manrope, sans-serif'` and loaded before chart init)                                            |


### Y-axis bounds

Prototype values: `min: 330, max: 352` (thousands: 330K–352K). Dashboard card uses 5 gridline values (`[332, 336, 340, 344, 348]`); detail page uses the same range with finer 3-day X ticks. **These are placeholder bounds from prototype data — replace with values computed from the actual data range when wiring up. Apply a small buffer below min and above max so lines don't touch the axis edges.**

Breakdown modes each need their own y-axis range derived from that breakdown's segment values (prototype uses separate `yMin` / `yMax` / `yTicks` per mode in `BREAKDOWN_CONFIG`).

### X-axis tick intervals

Dashboard card: weekly labels (Mar 29, Apr 5, Apr 12, Apr 19 in the prototype). Detail page: every 3 days. Both use `interval: { values: [...] }` to pin exact tick dates. **Replace with intervals computed dynamically from the actual date range.**

Both pages set `nice: false` and explicit `min`/`max` so the line starts flush at the Y-axis with no leading gap. Data series includes a short lead-in before the first tick label (Mar 19–27 in the prototype) so the line reaches the Y-axis on day one.

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md § Global Filters](../dashboard_beta_ux.md#global-filters)`. Every filter currently defined globally **applies to this chart**, plus one chart-specific control on the detail page:


| Filter                      | Options                                                               | Applies                | Notes                                                                                                                                                                                            |
| --------------------------- | --------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Date range**              | 7D, 30D, 90D, 12M, YTD, Custom                                        | Yes — full support     | Drives the X-axis range and determines which day is "latest" for the hero metric. No minimum-range constraint; no entry in `CHART_CONSTRAINTS`.                                                  |
| **Compare to**              | Previous period, Previous year, No comparison                         | Yes                    | Drives the prev-period series. "No comparison" hides the dashed line, the striped legend item, and the hero sub-text. "Previous year" — see § 10 Open Questions on alignment semantics.            |
| **Stores and Store groups** | Single or multi-store / store group                                   | Yes                    | Applied server-side before aggregation. See "Filter scope semantics" note below.                                                                                                                 |
| **Loyalty / non-loyalty**   | Loyalty program members / non-members                                 | Yes                    | Filters which guests are counted toward the active total. Independent of the "Loyalty" line in the loyalty-status breakdown — see note below.                                                    |
| **Segments**                | Any saved guest segment                                               | Yes                    | Restricts the count to guests who match the selected segment(s) and satisfy the active rule. Useful for "how many actives are in segment X over time?"                                           |
| **Activity window**         | 30D, 60D, 90D                                                         | Detail page only       | Recomputes the active rule (`N` = 30, 60, or 90). Updates hero sub-text suffix (e.g. `· 90D window`). Dashboard card uses **90D** fixed unless product adds a card-level control later.         |
| **Breakdown**               | Total (default), By loyalty status, By channel, By location, By segment | Detail page only     | Switches the chart between modes. "Total" shows current/prev comparison. Other modes show one line per dimension value in palette order. Not available on the dashboard overview card.            |


### Filter scope semantics (Stores and Store groups)

When a store / store-group filter is applied, the count on each day should be:

> Number of guests who are **active** on that day **and** who have at least one qualifying transaction at the selected store(s) / store group(s) within the trailing N-day window.

A guest who is active overall but whose only transactions in the window were at other stores should not appear in Store A's count. Confirm with PM if a different interpretation (e.g. active status evaluated using only Store A's transactions, which can reclassify a guest as inactive) is preferred — they're meaningfully different numbers. Tracked in § 10 Open Questions.

### Loyalty filter vs. loyalty-status breakdown

These are two related but independent dimensions:

- **Loyalty filter** (global): restricts the population before counting actives — e.g. "loyalty members only".
- **Loyalty-status breakdown** (detail): splits the already-filtered active count into Loyalty vs. Non-loyalty lines.

When both are active, apply the global loyalty filter first, then split the result. A "loyalty only" global filter with a loyalty-status breakdown is redundant — the client may hide the breakdown or show a single line.

### Activity window vs. lifecycle

The **activity window** (30 / 60 / 90 days) on this chart is a **transaction-recency** rule. The **Guest Lifecycle** chart uses stage thresholds (180-day churn, personal inter-visit baseline for At-Risk, etc.) defined in `[guest_lifecycle_chart_spec.md](./guest_lifecycle_chart_spec.md)`.

Do not assume the same numeric threshold applies to both without PM sign-off. The product has an open decision on whether lifecycle "Active" / "Engaged" stages should align to this chart's N-day window (see § 10).

### No-comparison case

If "Compare to" is set to "No comparison", the hero pill should hide and the period text should drop the prev-period suffix. The chart renders a single solid line. Breakdown modes already omit prev-period data.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- Header: title `Active guests` + subtitle `Guests with ≥1 transaction in the trailing activity window`. Header area is clickable → navigates to detail page. **No breakdown dropdown** — segmentation is detail-page-only.
- Hero metric block: latest-day K value + standard-color delta pill + prev-period sub-text including `90D window` suffix.
- Legend: two toggleable items — "This period" (solid indigo marker) and "Previous period" (striped indigo marker). `toggleActiveGuestsSeries(btn, seriesKey)` hides/shows each series; at least one must remain visible.
- Line chart filling the remaining card space (`flex-fill` — see `.chart-card[data-metric-id="active-guests"]` rules in `beta.css`).

The card's `data-metric-id` is `active-guests`. Default layout (v8) places it at column 6, row 0, paired with `total-guests` at column 0, row 0.

---

## 8. Detail Page (`beta/dashboard-active-guests.html`)

Same content, more space, plus an activity-window control, breakdown filter, and data table:

- Breadcrumb → title bar (h1 `Active guests` + Help button) → global filter bar → chart card → data table → pagination.
- Chart card uses the same data and colors as the dashboard, with a taller plot area (`.chart-card__placeholder--detail`, currently 389px).
- **Activity window control** (30D | 60D | 90D btn-group) and **breakdown dropdown** appear in the chart card header controls, alongside the 3-dot overflow menu.

### Breakdown modes

| Mode | Series | Colors | Notes |
| ---- | ------ | ------ | ----- |
| **Total** (default) | This period (solid), Previous period (dashed) | Both indigo-900 | Y-axis from total active count range |
| **By loyalty status** | Loyalty, Non-loyalty | Indigo-900, Vermilion-900 | Sums to ≤ total (mutually exclusive split) |
| **By channel** | In-store, Online, Delivery | Palette positions 1–3 | Confirm channel taxonomy with data team; guest may appear in multiple channels if multi-channel in window |
| **By location** | Northeast, Southeast, Midwest, West | Palette positions 1–4 | Region labels are prototype placeholders — use tenant location hierarchy |
| **By segment** | Habitual, Regular, Occasional | Palette positions 1–3 | Frequency buckets from CDP — not lifecycle stages |

Switching breakdown mode: updates the dropdown label, re-renders the legend (static colored swatches in breakdown mode; toggleable buttons in "Total" mode), replaces the chart series and y-axis range, and rebuilds the hover tooltip. The `selectBreakdown(btn, mode)` function in the prototype is the reference implementation.

**Multi-channel / multi-location guests:** If a guest transacts in two channels within the window, confirm whether channel breakdown counts them in both channels (can sum above total) or assigns a primary channel. Tracked in § 10.

### Data table

Follows the standard time-series layout from `[dashboard_beta_ux.md § Detail Page](../dashboard_beta_ux.md#detail-page)`:


| Column      | Format                                                    | Notes                                                                |
| ----------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| Date        | `Mar 29, 2026`                                            | Left-aligned                                                         |
| This period | Integer count, comma-separated (e.g. `346,127`)           | Right-aligned; full-precision, not the chart's K shorthand           |
| Prev period | Integer count                                             | Right-aligned; same precision                                        |
| Δ           | Signed integer (e.g. `+8,127`)                            | Right-aligned                                                        |
| Δ%          | Signed % in colored pill (green/red per standard semantics) | Right-aligned                                                      |


- Table rows cover the same date range as the chart. Pagination: 10 rows per page (Bento `.pagination__`* classes).
- Same global filter bar and activity-window control as the chart. Filter or window changes refetch and re-render both chart and table.

### Full-precision number derivation

Source data may arrive at K-scale in the prototype (e.g. `346.0`). Multiply to integers and add a deterministic 0–999 offset derived from the date and a salt value so table cells look like real measurements and stay stable across renders. The prototype's `fullNumber(kValue, date, salt)` function is the reference. When real data ships at integer precision, this shim goes away.

---

## 9. Interactions

### Hover → Tooltip + crosshair

Same pattern as Total Guests — see `[total_guests_chart_spec.md § Interactions](./total_guests_chart_spec.md#hover--tooltip--crosshair)`.

The dashed vertical crosshair is drawn by **AG Charts native crosshair** on the X-axis. The tooltip is a **manual implementation** (AG Charts per-series tooltip is disabled). The tooltip is rebuilt whenever the breakdown mode changes via `buildBreakdownTooltip(cfg, mode)`.

On `mousemove` over the chart container:

1. Map cursor X to the nearest data point on the time axis.
2. Show a floated `position:fixed` tooltip to the right of the cursor (flip/clamp to stay in viewport).
3. **"Total" mode** tooltip (dashboard card): header `Active guests`, snapped date, current K value, delta % pill vs. prev, and optional prev-period row with striped swatch.
4. **Breakdown modes** (detail): header = snapped date; one row per series (colored swatch + label + K value).
5. Hide tooltip on `mouseleave`.

### Legend toggle ("Total" mode only)

`toggleActiveGuestsSeries(btn, seriesKey)` on the dashboard card and detail page in "Total" mode. Toggling updates `activeGuestsVisibility`, rebuilds the series array with `visible: false` on hidden series, and suppresses the hidden series in the tooltip. At least one series must remain visible.

In breakdown modes the legend is display-only (no toggle).

### Click → Context menu (detail page only)

Uses the `attachChartPointMenu(container, opts)` helper — see `[analytics_page_patterns.md § Chart data-point context menu](../../analytics_page_patterns.md#chart-data-point-context-menu-inner--detail-pages)` and `[dashboard_beta_ux.md § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu)`.

- Clicking anywhere in the plot area opens the context menu anchored next to the cursor, snapped to the nearest data point on X.
- Series-aware in "Total" mode: cursor Y is compared to each series' projected Y to pick current vs. prev.
- Menu header: color dot (solid indigo for current, striped pattern for prev) + date + K value for the selected series.
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. Wire `onPointMenuAction(action)` to real flows; `pointMenuAnchor` holds the snapped data row.
- Menu must scroll with `.content-area--chart-detail` — add `scrollTop` / `scrollLeft` to position math (see `analytics_page_patterns.md`).

**"View users" scope:** The guest list behind a point should be guests who were **active on that snapshot date** under the current `N`, global filters, and (if applicable) the clicked series (e.g. prev-period actives when the dashed line is clicked). Confirm export limits with PM.

---

## 10. Open Questions for PM

These are not blockers for the chart wiring but should be settled before the metric ships:

1. **Activity window default and options.** Confirm 90D as the default for dashboard and detail. Should 180D and 365D (Punchh QBR windows) be added? Should the dashboard card expose the window control or stay fixed at 90D?
2. **Alignment with Guest Lifecycle "Engaged".** Bikky and internal lifecycle models use "engaged" / "active" language. Should this chart's N-day rule match the lifecycle stage threshold, or remain an independent recency metric? See also `[docs/lifecycle_stages_proposition.md](../lifecycle_stages_proposition.md)`.
3. **"Compare to: Previous year" semantics.** Same open question as Total Guests — calendar-date alignment vs. day-offset alignment produces different curves.
4. **Verified transaction definition.** Which transaction types count toward "active"? Include loyalty check-ins without purchase? Exclude gift-card-only loads?
5. **Filter scope semantics (location).** When a store filter is applied, count guests active **and** transacting at that store in the window, or re-evaluate active status using only that store's transactions?
6. **Breakdown double-counting.** For channel and location breakdowns, can one guest appear in multiple lines if they used multiple channels / regions in the window? If yes, lines may sum above the total.
7. **Segment breakdown buckets.** Confirm definitions for Habitual / Regular / Occasional (visit-count thresholds) or replace with tenant-configurable frequency quartiles.
8. **Identified-guest scope.** Confirm the same "identified" definition as Total Guests applies here.

---

## 11. Reference Files

- **Total Guests chart (closest sibling — line + prev comparison pattern)** — `[docs/charts_spec/total_guests_chart_spec.md](./total_guests_chart_spec.md)`
- **Guest Lifecycle chart (related retention context, different stage model)** — `[docs/charts_spec/guest_lifecycle_chart_spec.md](./guest_lifecycle_chart_spec.md)`
- **Dashboard UX patterns (cards, filters, detail page)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Reusable chart conventions (palette, font, table, button)** — `[docs/dashboard_beta_ux.md § Implementation Rules](../dashboard_beta_ux.md#implementation-rules)`
- **Chart data-point context menu (reusable helper)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md#chart-data-point-context-menu-inner--detail-pages)`
- **PAG metric validation (Active Guests ranked #7, 61% selection)** — `[docs/analytics_proposition.md](../analytics_proposition.md)`
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (search `initActiveGuestsChart`, `ACTIVE_GUESTS_DATA`, `toggleActiveGuestsSeries`)
- **Reference implementation — detail page** — `[beta/dashboard-active-guests.html](../../beta/dashboard-active-guests.html)`
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `active-guests`)
