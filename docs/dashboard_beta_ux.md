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

Each chart has its own separate detail page (e.g. `beta/dashboard-[chart-name].html`). It contains:

1. Chart title as page heading, description as subheading
2. Same global filter bar
3. Larger version of the chart
4. The underlying **data table** that was used to build the chart
5. **Ava insights** (AI-generated commentary) — TBD placement

---

## Data Point Interactions

### Hover → Tooltip

Hovering a data point shows a styled tooltip with the breakdown for that point:

- Label / dimension value
- Metric value
- % of total

Design reference: Mixpanel-style tooltip. Final visual design TBD (custom design, not Mixpanel's).

### Click → Context Menu

Clicking a data point opens a small context menu with actions:

- **Create a segment** — opens segment creation flow scoped to that data point
- **View users** — shows the users behind that data point
- **Get insight from textQL** — triggers a textQL query/insight for that data point

Final visual design TBD (custom design, not Mixpanel's).

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
- Design for the data point context menu (Create segment / View users / Get insight)
- Design for the filter incompatibility indicator on chart cards
- Ava insights placement on detail pages
- textQL integration details
- Detail page table structure — varies per chart or standardized?

