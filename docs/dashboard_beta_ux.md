# Beta Dashboard — UX Spec

## Overview

The beta dashboard is the primary landing page of Guest360 Beta (`beta/index.html`). It displays up to 14 customizable charts giving an overview of guest behavior and business performance. Charts can be added, removed, and reordered by the user.

---

## Layout

- Always **2-column grid** of chart cards
- Global filters at the top apply to all charts on the page
- Charts are built one at a time; detail pages are separate HTML files per chart

---

## Global Filters

Located in a filter bar below the page heading. Includes:

- **Date range**: 7D, 30D, 90D, 12M, YTD, Custom
- **Compare to**: Previous period (not all charts support this — see below)
- **Additional filters**: Location, loyalty / non-loyalty, and other dimensions TBD

**Last updated timestamp** sits inline in the filter bar (e.g. `· Last updated Apr 20, 2:14 AM`). Since all data refreshes in the same daily batch, one page-level timestamp is sufficient — no per-card timestamps unless a specific card has stale data (see Data Refresh section).

### Filter compatibility per chart

Not all charts support all filter combinations. When a chart does not support the selected time range or comparison, the chart is **not hidden** — instead it displays an indicator showing the effective time period it is using (e.g. "Showing 30D min" or "Not available for 7D"). No "Default time filter" option (à la Mixpanel) is needed; constraints are hardcoded per chart type.

---

## Chart Cards

### Structure

Each card has:

- **Header** (entire area is clickable → navigates to detail page)
  - Chart title
  - Chart description/subtitle
  - Breakdown dropdown (only on charts that support it, e.g. "By location") — visible in grid view
  - 3-dot overflow menu
- **Hero metric**: Primary KPI value + change vs. previous period
- **Chart area**: ECharts visualization
- No per-card "Last Updated" timestamp in normal state

### Clicking the card header

Clicking anywhere in the card header navigates to that chart's dedicated detail page.

---

## Detail Page

Each chart has its own dedicated detail page at `beta/dashboard-[chart-name].html`. The dashboard's `openChartDetail(metricId)` function maps each metric ID to its detail page; charts without a custom page fall back to the generic `dashboard-chart-detail.html`.

### Page structure

Top-to-bottom:

1. **Breadcrumb** — `Dashboard › [Chart name]`
2. **Title bar** — chart title (h1), chart description, optional Help button
3. **Global filter bar** — same component as the dashboard
4. **Chart card** — wider / taller version of the dashboard card
5. **Data table** — the rows that produced the chart, paginated
6. **Ava insights** — TBD placement

### Chart card adaptations

The chart on the detail page uses the same data and series colors as the dashboard card, but takes advantage of the extra space:

- **More granular X-axis ticks** — for time series, switch from weekly labels to ~3-day intervals (or daily, depending on range)
- **More Y-axis intervals** — finer subdivisions (e.g. every 0.02M instead of every 0.05M)
- **Taller plot area** — apply the `.chart-card__placeholder--detail` modifier (currently 389px)
- **Same hero metric and legend** — value + change pill and series-toggle legend stay in their dashboard positions; never redraw the chart with different data here

### Data table

Standardized layout for time-series charts — one row per data point:

| Column      | Notes                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| Date        | Left-aligned. Header uses `.chart-th-inner--start`                                       |
| This period | Right-aligned. Full-precision value (e.g. `1,156,237`), not the chart's M-shorthand      |
| Prev period | Right-aligned. Same precision rules as This period                                       |
| Δ           | Right-aligned. Signed full-precision integer (e.g. `+27,396`)                            |
| Δ%          | Right-aligned pill — green `#effaf9` / `#257469` if ≥ 0, red `#fdecef` / `#b1294a` if negative. Font weight 500 |

Sort affordances live in column headers. Series-toggle checkboxes do **not** belong in the table — the legend buttons above the chart are the canonical control.

### Pagination

10 rows per page, sharing the same component as `cockpit-admins.html`:

- Items-per-page dropdown on the left (currently fixed at 10)
- Page-selector dropdown + "of N pages" label + prev / next arrows on the right
- Styles: `.pagination__*` classes in `bento.css` + `beta.css`

### Number formatting

Detail-page tables show full-precision values, not the M-shorthand used on the dashboard:

- Dashboard card: `1.24M`
- Detail page table: `1,238,427`

Where source data only has M-precision (e.g. `1.156`), derive a stable trailing-three-digit offset from the date so cells look like real measurements but stay deterministic across renders.

### Data-point interactions

Clicking a data point opens the context menu defined under [Data Point Interactions § Click → Context Menu](#click--context-menu). The interaction is currently wired only on detail pages — clicking a card on the dashboard navigates to its detail page first. The menu is series-aware: clicking near the dashed prev-period line opens the menu for that series (with the striped marker), not the primary series.

Reference implementation: `beta/dashboard-total-guests.html`. Reusable plumbing — markup, CSS class, and the `attachChartPointMenu(container, opts)` helper — is documented in `analytics_page_patterns.md` so other charts can drop it in by passing the same plot-area math their tooltip already uses.

---

## Data Point Interactions

### Hover → Tooltip

Hovering a data point shows a styled tooltip with the breakdown for that point:

- Label / dimension value
- Metric value
- % of total

Design reference: Mixpanel-style tooltip. Final visual design TBD (custom design, not Mixpanel's).

### Click → Context Menu

Clicking a data point opens a small context menu anchored next to the cursor and snapped to the nearest data point. The menu has two parts:

**Header** — identifies the clicked point:

- Color marker (solid for primary series, striped for the dashed prev-period series)
- Date (e.g. `Apr 8, 2026`) on the left, value (e.g. `1.16M`) on the right
- 1px `#dfe1e2` separator below

**Actions:**

- **View users** — shows the users behind that data point (`group` icon)
- **Create segment** — opens the segment creation flow scoped to that data point (`stroke_partial` icon)
- **Ask Ava about this…** — triggers an Ava insight for that data point (Ava avatar)

Visual spec from Figma node `4711:7268`: 2px `#dfe1e2` border, 8px radius, 16px padding, `0 4px 12px rgba(0,0,0,0.12)` shadow. No item is highlighted by default — items use a `:hover` background with 8px radius. The menu is series-aware and supports clicking either line on multi-series charts.

---

## Manage Mode (Add / Remove / Reorder Charts)

Inspired by Shopify's metrics library pattern.

### Entering manage mode

A single **"Manage"** button in the top-right of the dashboard opens a **left-side panel** (metrics library) listing all available charts, grouped by category.

### In manage mode

- Drag handles appear on each card for reordering
- X buttons appear on each card for removal
- Available charts in the library panel can be added by clicking or dragging onto the grid

### Exiting manage mode

A **bottom action bar** (Bento pattern) with **Cancel** and **Save** buttons:

- **Cancel** — discards all changes and reverts the grid
- **Save** — persists the new chart configuration

---

## Data Refresh


| Aspect            | Specification                                                      |
| ----------------- | ------------------------------------------------------------------ |
| Refresh cadence   | Scheduled daily batch                                              |
| Timestamp display | Single page-level timestamp in filter bar                          |
| Filter re-render  | Widgets re-render using pre-computed cached data, not live queries |
| Batch SLA         | Daily batches complete within 2 hours                              |


### Stale data state

If a specific chart's data is older than the page-level refresh timestamp (e.g. that chart's batch failed), the card displays a per-card warning indicator — a ⚠ icon with a tooltip such as "Data from Apr 19" — instead of showing a timestamp on every card normally.

---

## Implementation Rules

### General

- Use Bento components and CSS classes throughout — no custom component styles where a Bento equivalent exists
- **Manrope font everywhere** — set explicitly on chart canvases (ECharts `textStyle.fontFamily: 'Manrope'`) and all UI text

### Bento Table

- Table element: `class="table"` with `style="border: none; border-radius: 0;"` inside a card
- Heading row (`thead tr`): `background-color: #dfe1e2`, no `border-bottom`
- Heading cells (`th`): `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 1rem` — NOT uppercase / 12px / subdued (that is the old styles.css default and must always be overridden)
- Body cells (`td`): `padding: 1rem`
- Wrap in `<div class="table-container">` inside `<div class="card__content" style="padding: 0;">`
- Flush-in-card pattern, no outer border

### Bento Button Component

- Canonical `.button` rule is at `bento.css` line 373 — do not create duplicates
- Padding: `0.5rem 1rem` (vertical horizontal). Use `.no-content` for icon-only buttons (`padding: 0.5rem`)
- Font size: `1rem`, font weight: `400` (body1 regular) — set explicitly on `.button`
- Never add inline font overrides to buttons
- Never use `.button.secondary` — use `.button.primary` or `.button.outlined` only

---

## Open Items

- Define the full list of 14 available charts and their categories
- Design for the filter incompatibility indicator on chart cards
- Ava insights placement on detail pages
- textQL integration details
- Detail-page table structure for non-time-series charts (the time-series standard is in place; bar / pie / sankey / etc. TBD)

