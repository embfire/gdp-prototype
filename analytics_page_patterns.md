# Analytics Page Patterns

## Chart Color Palette
Fixed order: indigo → vermilion → periwinkle → amber → crimson → teal → sky, always top to bottom.

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
- Proper structure, header style overrides (title case, black, 800 weight)
- Compact row sizing
- Flush-in-card pattern
- Border specs

## Info Icon
Bento's custom SVG, tooltip caption style.

## Sankey Diagram
Horizontal orientation, label positioning, abbreviated numbers, node colors/styling.

## Writing Style
Never use em dash.
