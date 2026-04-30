# Reachability Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-04-30
**Reference implementation:** [`beta/index.html`](../../beta/index.html) (dashboard card) and [`beta/dashboard-reachability.html`](../../beta/dashboard-reachability.html) (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how channels are defined, what filters do, and what the detail page must include**.

---

## 1. Overview

The Reachability metric answers: "Of all identified guests, how many can we actually contact — and through which channels?"

There are **two distinct chart types** across the two surfaces:

- **Dashboard card** — a static horizontal stacked bar chart with two rows. The top row ("Identified") shows the total identified guest base as a single baseline bar. The bottom row ("Reachable") shows the same axis width subdivided by marketing channel, with a "Not reachable" remainder filling the gap.
- **Detail page** — a stacked area chart showing reachable guest counts by channel over time (weekly intervals in the prototype). This answers how reachability has changed across channels within the selected date range.

The dashboard card is a snapshot (latest period); the detail page is a trend. Both share the same channel list and color assignments.

---

## 2. Channel Definitions

A guest is **reachable** if the system holds at least one valid contact credential for a marketing channel. A guest may hold credentials for multiple channels; in that case they are assigned to exactly one **primary channel** for the purposes of these exclusive counts.

Channels, in series order:

| Channel           | Key         | Color     | Notes                                                                                     |
| ----------------- | ----------- | --------- | ----------------------------------------------------------------------------------------- |
| **Email**         | `email`     | `#5A55E3` | Valid, opted-in email address on file                                                     |
| **SMS**           | `sms`       | `#FF6600` | Valid, opted-in mobile number on file                                                     |
| **Push**          | `push`      | `#8C9FFF` | Mobile push token on file (app installed, notifications enabled)                          |
| **In-store**      | `instore`   | `#F8931C` | Contactable via receipt / in-store message; no digital credential required                |
| **Multi-channel** | `multi`     | `#E83162` | Guest holds valid credentials for two or more channels simultaneously (see note below)    |
| **Not reachable** | `notReachable` | `#DFE1E2` | Identified guest with no valid contact credential; rendered as the chart remainder segment |

### Primary channel and mutual exclusivity

Each reachable guest is counted **once** in their primary channel. The prototype uses exclusive counts that sum exactly to `TOTAL_REACHABLE`. The priority rule for primary channel assignment (i.e. when a guest qualifies for more than one) is an open question — see § 10.

The **Multi-channel** segment is a distinct slice for guests who hold two or more credentials and are therefore targetable across channels. Whether "Multi-channel" is derived (any guest with ≥ 2 active channels) or a deliberate opt-in state should be confirmed with PM — see § 10.

### Not reachable

"Not reachable" is not a channel: it is the identified base minus the sum of all channel counts. It is rendered in the chart as a gray remainder segment so the two bars stay aligned on the same X-axis scale. In the snapshot table it appears as a separate row with **inverse pill semantics** — growing is bad.

---

## 3. Hero Metric

The card's primary KPI is the **percentage of identified guests who are reachable**, computed for the latest period in the selected date range.

```
hero_value = TOTAL_REACHABLE / IDENTIFIED_TOTAL × 100  →  formatted as "37%"
```

- **Pill semantics — standard (non-inverse).** More reachable is good:
  - Reachable % **up** vs. prev → green pill (`chart-card__metric-pill--up`)
  - Reachable % **down** vs. prev → red pill (`chart-card__metric-pill--down`)
- **Period text.** The sub-line reads `"{X}K reachable · {Y}K not reachable"` where X = `TOTAL_REACHABLE` in K-units and Y = `IDENTIFIED_TOTAL − TOTAL_REACHABLE` in K-units. No signed delta in the period text — the pill carries the comparison.
- **Comparison.** The pill delta is reachable % current period vs. reachable % previous period (same length, immediately preceding). The comparison figures come from the same snapshot data shape used for the table.
- The hero value displays as a rounded integer percentage (e.g. `37%`). Channel-level K values use one-decimal K format (e.g. `156K`).

---

## 4. Required Data Shape

Two separate shapes are needed: one for the dashboard card / snapshot table, and one for the detail page trend chart.

### 4a. Snapshot shape (dashboard card + channel snapshot table)

One row per channel for the latest period, plus the identified total and previous-period counts for the hero delta:

```ts
type ReachabilitySnapshot = {
  identifiedTotal: number;    // total identified guests in scope
  totalReachable: number;     // sum of all channel counts
  prevTotalReachable: number; // same metric for the previous period (for hero pill)
  channels: Array<{
    key: string;              // 'email' | 'sms' | 'push' | 'instore' | 'multi'
    label: string;
    count: number;            // exclusive reachable count, current period
    prev: number;             // same channel count, previous period (for table column)
  }>;
};
```

Constraint: `channels.reduce(sum of count) === totalReachable`. The "Not reachable" row in the table is derived: `identifiedTotal − totalReachable`.

### 4b. Trend shape (detail page stacked area chart)

One row per time bucket (weekly in the prototype) across the selected date range:

```ts
type ReachabilityTrend = {
  date: string;       // display label, e.g. "Feb 4" or ISO date
  email: number;      // K count, exclusive channel
  sms: number;
  push: number;
  instore: number;
  multi: number;
  // notReachable is NOT in the trend rows — the area chart renders only reachable channels
};
```

The trend chart shows only the reachable portion; the "Not reachable" remainder is not stacked in the area series. Each row's values sum to the total reachable count for that time bucket.

### Aggregation contract

- Channel counts are **exclusive** — a guest appears in exactly one channel row per period.
- Filters (date range, location, loyalty, segment — see § 6) are applied server-side; the API returns only the rows the client should render.
- For the snapshot: "current period" is defined by the selected date range end date (or latest available day). "Previous period" is the same-length window immediately preceding.
- For the trend: bucket granularity should scale with the selected date range. Weekly is appropriate for 30D–90D; monthly for 12M/YTD. The prototype uses weekly labels for a ~90D range.
- Backfill: the trend needs a continuous series for the selected range. Do not silently drop missing buckets.

---

## 5. Chart Specification

### 5a. Dashboard card — horizontal stacked bar

| Property               | Value                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Library                | AG Charts (Community v13)                                                                |
| Type                   | Horizontal stacked bar (`type: 'bar'`, `direction: 'horizontal'`)                        |
| Dataset rows           | Two: `{ cat: 'Identified', base: N, … }` and `{ cat: 'Reachable', email: N, … }`        |
| Series order           | Identified baseline (gray `#C9CECF`), then channels (Email → Multi-channel), then Not reachable (`#DFE1E2`) |
| X-axis                 | Numeric, `min: 0`, `max: identifiedTotal` (K units), labels disabled                    |
| Y-axis                 | Category (`'Identified'` / `'Reachable'`), labels at left (`color: '#60696C'`, 12px, weight 500) |
| `stackGroup`           | `'reachability'` on all series                                                           |
| Native AG Charts tooltip | Disabled (`tooltip: { enabled: false }`) — replaced with a manual tooltip              |
| `cornerRadius`         | `8` on all series                                                                        |
| Stroke                 | `#ffffff`, width 1 between channel segments; baseline series uses no stroke              |

The "Identified" baseline row has a single series (`yKey: 'base'`); the "Reachable" row has one series per channel plus the Not-reachable remainder. All series share the same `stackGroup` so AG Charts aligns them on the same X-axis.

The baseline series is **not toggleable** — only the channel segments are controlled by the legend. See § 7 for toggle behavior.

**Hardcoded X-axis max (`REACHABILITY_TOTAL = 847`) is placeholder data — replace with the live `identifiedTotal` value from the API response.**

### 5b. Detail page — stacked area (over time)

| Property                    | Value                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Library                     | AG Charts (Community v13)                                                                        |
| Type                        | Stacked area, single `stackGroup: 'reachability'`                                               |
| X-axis                      | Category (date label string), one tick per time bucket                                           |
| Y-axis                      | Count of reachable guests in K, starts at 0                                                      |
| Series order (bottom → top) | Email, SMS, Push, In-store, Multi-channel                                                        |
| Series colors               | Same as § 2 (Bento chart palette in channel order)                                              |
| `fillOpacity`               | `0.9` on all area series                                                                         |
| Stroke                      | `#ffffff`, width 1 between series                                                                |
| Native AG Charts tooltip    | Disabled (`tooltip: { enabled: false }`) — replaced with a manual tooltip                       |
| Native AG Charts crosshair  | Disabled — replaced with a manual dashed vertical line                                           |

**Y-axis hardcoded bounds (`min: 0, max: 320`, `interval: [0, 80, 160, 240, 320]`) are placeholder data scaling — derive from the real data maximum when wiring up.**

The detail-page legend is static (display only, not toggleable). See § 8.

---

## 6. Filters

Inherited from the global dashboard filter bar — see [`dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters). Every filter currently defined globally **applies to this chart**:

| Filter                      | Options                                | Applies to          | Notes                                                                                                                                                                                                                   |
| --------------------------- | -------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date range**              | 7D, 30D, 90D, 12M, YTD, Custom        | Both surfaces       | Drives the trend chart X-axis and defines "current period" for the hero metric and snapshot table. No minimum range constraint; even 7D renders fine since the snapshot view is period-agnostic.                         |
| **Compare to**              | Previous period, Previous year, No comparison | Hero + table column | Used to compute the hero pill delta and the "vs. previous period" table column. The trend chart itself does **not** render a prev-period overlay — only the hero and snapshot table use the comparison period. |
| **Stores and Store groups** | Single or multi-store / store group    | Yes                 | Applied server-side before aggregation. See "Filter scope semantics" note below.                                                                                                                                         |
| **Loyalty / non-loyalty**   | Loyalty program members / non-members  | Yes                 | Filters which guests are counted in each channel. Does not change channel definitions.                                                                                                                                   |
| **Segments**                | Any saved guest segment                | Yes                 | Restricts the chart to guests who match the selected segment(s). Channel counts reflect only that subset.                                                                                                                |

### Filter scope semantics (Stores and Store groups)

Reachability is a guest-level attribute (does the system hold a contact credential?), not a transaction-level attribute. When a store / store-group filter is applied, the count for each channel should be:

> Number of guests reachable via channel X **and** who have transacted at the selected store(s) / store group(s) within the date range.

Confirm with PM — see § 10 Open Questions.

### No-comparison case

When "Compare to" is set to "No comparison", the hero pill should be hidden and the "vs. previous period" column should be dropped from the snapshot table (or replaced with an empty state). The trend chart is unaffected.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid:

- **Header**: title `Reachability` + subtitle `Reachable guests by channel vs. total identified`. Header is clickable → navigates to the detail page.
- **Hero metric block**: reachable % (integer, no decimal) + standard green/red delta pill + period text showing K counts for reachable and not-reachable.
- **Toggleable legend**: one button per channel (Email, SMS, Push, In-store, Multi-channel) plus a "Not reachable" button. Toggling hides/shows that segment in the "Reachable" bar and updates the tooltip hit-test accordingly. At least one segment must remain visible. The "Identified" baseline row is never controlled by the legend.
- **Horizontal stacked bar** filling the remaining card space.

### Legend toggle behavior

Toggling a channel segment sets `visible: false` on that series in `reachabilityChartOptions.series` and calls `reachabilityChart.update(options)`. The baseline series (`yKey: 'base'`) is always excluded from the toggle logic and always remains visible. When all channel segments except one are toggled off, the last visible segment cannot be hidden (enforced in `toggleReachabilitySeries`).

---

## 8. Detail Page (`beta/dashboard-reachability.html`)

Same context, more space, different chart type (area over time), plus a snapshot data table:

- Breadcrumb → title bar (h1 + Help button) → global filter bar → chart card → channel snapshot table.
- Chart card uses the stacked area specification from § 5b, with a taller fixed-height plot area (`.chart-card__placeholder--detail`, `height: 320px; flex: none` — see inline style on the page).
- The detail-page legend is **static** (display only; `cursor: default`). No series toggling is exposed on the detail page.

### Channel snapshot table

The table is titled **"Channel snapshot"** with a sub-heading showing the as-of date (e.g. `As of Apr 30, 2026`). It is a point-in-time snapshot, not a time-series table.

| Column               | Format                                                               | Notes                                                                                                        |
| -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Channel              | Color dot (12px square, 2px radius) + channel label                 | Left-aligned                                                                                                 |
| Reachable guests     | Integer count, comma-separated (e.g. `156,000`)                      | Right-aligned                                                                                                |
| % of identified      | One decimal percentage (e.g. `18.4%`) = count / identifiedTotal × 100 | Right-aligned                                                                                              |
| vs. previous period  | Signed percentage pill (e.g. `+2.0%`), standard green/red semantics | Right-aligned pill; **standard** for channel rows (more reachable = good)                                   |

Below the per-channel rows:

- **Total reachable** — summary row (`font-weight: 800`), summing all channel counts. Same four columns. Standard green/red pill.
- **Not reachable** — derived row (`identifiedTotal − totalReachable`), label in `#60696C`. Count and % in `#60696C`. Pill uses **inverse semantics** (growing Not-reachable = bad → red pill; shrinking = good → green pill).

No pagination — the table has a fixed number of rows (one per channel + two summary rows) regardless of date range.

---

## 9. Interactions

### Hover → Tooltip (dashboard card)

Manual implementation (`reachabilityMouseMove` in `beta/index.html`). No crosshair line — this is a static bar chart, not a time series.

- On `mousemove`, determine which of the two bar rows the cursor is in by comparing Y position to the midpoint of the plot area.
- **Identified row**: show a tooltip with the total identified guest count.
- **Reachable row**: determine which channel segment the cursor's X position falls in by accumulating channel widths proportionally across the plot width (`relX × REACHABILITY_TOTAL` vs. cumulative channel sums). Show the segment label, K count, and % of identified.
  - Hidden segments (legend-toggled off) are excluded from the hit-test accumulation.
  - If the cursor falls in the Not-reachable remainder, show "Not reachable" with its K count and % of identified.
- Tooltip hides on `mouseleave` and outside the plot bounds.
- The tooltip has no crosshair line — use the cursor position directly.

### Hover → Tooltip + dashed vertical line (detail page)

Manual implementation (`detailMouseMove` in `dashboard-reachability.html`).

- On `mousemove` over the chart container, snap to the nearest data point on X (by index, same formula as other area charts).
- Show a tooltip floated to the right of the cursor with: header `Reachability`, the snapped date, one row per channel (color square + label + K value), and a **Total** summary row at the bottom separated by a hairline.
- Show a dashed vertical line (`#c6c6c6`, 50% dash / 50% gap via `background-size: 1px 8px`) at the snapped X across the plot area.
- Both elements hide on `mouseleave` and outside the plot bounds.

### Click → Context menu (detail page only)

- Click inside any visible stacked area band → opens a context menu anchored next to the cursor.
- Identify which channel was clicked by computing the cumulative Y bands at the snapped date and finding which band the cursor's Y lands in (same approach as Guest Lifecycle). The cursor Y is mapped to data-space using `(1 − relY) × T_Y_MAX`.
- The menu header shows: channel color dot + `"{date} · {channel label}"` on the left, `"{count}K reachable"` on the right.
- Menu items (currently stubbed): View users / Create segment / Ask Ava about this. The `onPointMenuAction(action)` handler receives the action and the selected channel's data — wire to real flows when ready.

This pattern follows the same implementation as the Total Guests and Guest Lifecycle detail pages — see [`dashboard_beta_ux.md` § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu).

---

## 10. Open Questions for PM

These are not blockers for the chart wiring but should be settled before the metric ships:

1. **Primary channel priority rule.** When a guest is reachable via multiple channels, which channel takes precedence for the exclusive count? (e.g. Email > SMS > Push > In-store, or determined by most-recent opt-in?)
2. **Multi-channel segment definition.** Is "Multi-channel" a derived slice (any guest with ≥ 2 active credentials) or a separate opt-in state? If derived, does it take priority over single-channel assignment, or are single-channel guests excluded from the Multi-channel slice?
3. **Credential validity rules.** What makes a credential "valid"? (e.g. opted-in email vs. any email on file; push token still registered vs. potentially expired.)
4. **Filter scope semantics.** When a location filter is applied, does the count include guests reachable via channel X who have transacted at that location, or guests reachable via channel X regardless of location? Different answers produce different numbers.
5. **Trend granularity per date range.** The prototype uses weekly buckets. Define the expected bucket granularity for each global date range option (7D = daily? 30D = weekly? 90D = weekly? 12M = monthly?).
6. **"As of" date for the snapshot table.** Is this always the last day of the selected date range, or always today? When the date range is historical (e.g. a custom range ending 6 months ago), confirm whether the snapshot reflects that end date or the current state.

---

## 11. Reference Files

- **Dashboard UX patterns (cards, filters, detail page)** — [`docs/dashboard_beta_ux.md`](../dashboard_beta_ux.md)
- **Reusable chart conventions (palette order, font, etc.)** — [`docs/dashboard_beta_ux.md` § Chart Colors](../dashboard_beta_ux.md#chart-colors)
- **Reference implementation — dashboard card** — [`beta/index.html`](../../beta/index.html) (search `initReachabilityChart`, `REACHABILITY_CHANNELS`, `REACHABILITY_DATA`)
- **Reference implementation — detail page** — [`beta/dashboard-reachability.html`](../../beta/dashboard-reachability.html) (search `initReachabilityDetailChart`, `REACH_TREND`, `AREA_CHANNELS`)
- **Card layout CSS** — [`beta/beta.css`](../../beta/beta.css) (search `reachability`)
