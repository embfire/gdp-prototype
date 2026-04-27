# Analytics Page Patterns

## Chart Color Palette
Bento defines 12 chart colors (900 shades). Never invent custom colors — always use from this palette:
indigo → vermilion → periwinkle → amber → crimson → sky → golden → teal → emerald → coral → lavender → cyan.
Use `chartPalette12` array for charts with many categories. For charts with fewer series, use the first N colors in order.

## Global Filters
Date range + compare to, no per-chart granularity (auto-determined).

## Guest Composition
Snapshot comparison with paired bars, lifecycle stages, segmentation rules.

## Card Layout
Side-by-side cards must match height, bars grow to fill space (except composition), 1rem internal padding.

## ECharts General Patterns
- No shadow axis pointer
- ResizeObserver for flex containers
- Manrope font everywhere
- Legend icon shape: all charts use `icon: 'roundRect'` (not `'rect'`)
- Legend swatch size: line charts use `itemWidth: 12, itemHeight: 12` (not 32x2)
- No custom hover outline — border+shadow emphasis was tried and rejected
- Tooltip positioning — keep default cursor-following; custom position functions were tried and rejected

## ECharts: Bar Chart Period Comparisons
When building bar charts that compare current period vs previous period, use the same solid color for both bars but apply a diagonal stripe decal pattern to the previous period bars.

ECharts decal config for previous period:
```js
{ symbol: 'rect', rotation: Math.PI / 4, dashArrayX: [1, 0], dashArrayY: [1, 1], color: 'rgba(255,255,255,1)' }
```

Requirements:
- Set `aria: { enabled: true, decal: { show: true } }` on the chart option to enable decal rendering.
- Override legend items with `decal: { symbol: 'none' }` so legend swatches stay solid (no stripes).
- Current period bars should explicitly set `decal: { symbol: 'none' }` to suppress auto-decals from aria.

## Line Chart Styles
- Hidden dots, 8px on hover
- Gradient area fill
- indigo300 for prior period (not transparency)
- Line-only legends with rect icon
- `boundaryGap: false`
- Tight y-axis scales

## Sidebar Navigation
All pages must cross-link, update ALL files when adding a new page.

## Benchmark Indicators
Green/yellow/red icons matching Dashboard.

## Font Loading
Preconnect + `document.fonts.ready` wrapper to prevent canvas font flash.

## Bento Table
- Table element: `class="table"` with `style="border: none; border-radius: 0;"` inside a card.
- Heading row (`thead tr`): `background-color: #dfe1e2`, no border-bottom.
- Heading cells (`th`): `text-transform: none`, `font-size: 1rem`, `font-weight: 800`, `color: #000`, `height: 3.5rem`, `padding: 1rem`. NOT uppercase/12px/subdued (that is the old styles.css default and must always be overridden).
- Body cells (`td`): `padding: 1rem`.
- Wrap in `<div class="table-container">` inside `<div class="card__content" style="padding: 0;">`.
- Flush-in-card pattern, no outer border.

## Info Icon
Bento's custom SVG, tooltip caption style.

## Sankey Diagram
Horizontal orientation, label positioning, abbreviated numbers, node colors/styling.

## Writing Style
Never use em dash.

## Bento Button Component
- Canonical `.button` rule is at bento.css line 373 — do not create duplicates.
- Padding: `0.5rem 1rem` (vertical horizontal). Use `.no-content` for icon-only buttons (`padding: 0.5rem`).
- Font size: `1rem`, font weight: `400` (body1 regular) — set explicitly on `.button`.
- Never add inline font overrides to buttons.
- Never use `.button.secondary`. Use `.button.primary` or `.button.outlined` only.

## Chart data-point context menu (inner / detail pages)

Pattern for detail-page charts where clicking a data point should open an action menu next to it. First implementation: `beta/dashboard-total-guests.html` (Total guests inner page), with reusable plumbing.

### Markup
Single hidden menu in the page (placed before the AG Charts `<script>` tag). Header shows the clicked point (color dot + date / value), then a separator, then the action list.

```html
<div class="chart-point-menu" id="chart-point-menu" role="menu" aria-hidden="true">
  <div class="chart-point-menu__header">
    <div class="chart-point-menu__header-left">
      <span class="chart-point-menu__color-dot"></span>
      <span class="chart-point-menu__date" id="chart-point-menu-date">—</span>
    </div>
    <span class="chart-point-menu__value" id="chart-point-menu-value">—</span>
  </div>
  <div class="chart-point-menu__separator" aria-hidden="true"></div>
  <ul class="chart-point-menu__list">
    <li><button class="chart-point-menu__item" onclick="onPointMenuAction('view-users')">
      <span class="material-symbols-rounded">group</span><span>View users</span>
    </button></li>
    <li><button class="chart-point-menu__item" onclick="onPointMenuAction('create-segment')">
      <span class="material-symbols-rounded">stroke_partial</span><span>Create segment</span>
    </button></li>
    <li><button class="chart-point-menu__item" onclick="onPointMenuAction('ask-ava')">
      <img src="../assets/ava-assistant.svg" alt="" width="24" height="24"><span>Ask Ava about this...</span>
    </button></li>
  </ul>
</div>
```

### CSS
`.chart-point-menu` lives in `beta/beta.css` (Figma node 4711:7268). Spec: 2px solid `#dfe1e2` border, 8px radius, 16px padding, `0 4px 12px rgba(0,0,0,0.12)` shadow, viewport-anchored (`position: fixed`). Items use their own `.chart-point-menu__item` class with a 4px-radius `:hover` background (`#f4f4f4`) — there is no permanently-highlighted item; the design's first-row grey is the hover state. The segment icon is Material Symbols `stroke_partial`.

### JS contract
`attachChartPointMenu(container, opts)` is called inside the chart init function (after the manual-tooltip wiring). It expects the same plot-area math the manual tooltip uses, plus Y-axis bounds for series detection:
- `plotLeft` — px from container left where the plot area begins (≈ Y-axis label width + padding).
- `plotRightPad` — right padding inside the chart (often 0).
- `axisMinTime`, `axisMaxTime` — ms epoch bounds of the X-axis.
- `axisMinValue`, `axisMaxValue` — Y-axis numeric bounds.
- `plotTop` — y-offset of the plot area inside the container (matches chart `padding.top`).
- `xAxisHeight` — approx height of the X-axis label area (≈ 30 for a 12px label).
- `data` — array with a `.date` field.
- `seriesValueKeys` — map of series-key → field on the data row, e.g. `{ current: 'current', prev: 'prev' }`. Drives both which series the menu represents and the value to display.

Click flow: cursor X → relative position in plot area → target time → nearest data row. Then for each series in `seriesValueKeys`, project the value to a Y in container space and pick the series whose projected Y is closest to the cursor Y — so clicking near the dashed prev-period line opens the menu for that series. Series hidden via legend (`totalGuestsVisibility[key] === false`) are skipped.

The chosen series-key is stored in `pointMenuSeries`; `openPointMenu` uses it to pick the value field and toggle the `.chart-point-menu__color-dot--striped` modifier on the marker (solid for primary series, striped pattern for the dashed prev-period line, matching the legend swatch).

The tooltip is hidden when the menu opens so it doesn't cover it. Outside-click closes via a deferred `document` listener; `e.stopPropagation()` on the chart click prevents same-event close when re-clicking.

### Action stubs
`onPointMenuAction(action)` receives `'view-users' | 'create-segment' | 'ask-ava'`. `pointMenuAnchor` (the data row) is in scope — wire to per-chart behavior later.

### When adding to a new chart
1. Drop the same `<div class="chart-point-menu">` markup in the page.
2. Inside the chart's `init` function, call `attachChartPointMenu(container, { plotLeft, plotRightPad, axisMinTime, axisMaxTime, data })`.
3. Cursor-pointer styling is set on the container by the helper.
4. The menu must remain a viewport-level overlay (not nested in the chart card) so it can flip past chart edges.
