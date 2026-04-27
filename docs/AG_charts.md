# AG Charts — Implementation Guide

Lessons learned building the **Total Guests** line chart in `beta/index.html`
using **AG Charts Community v13.2.1**. Read this before starting any new chart
or migrating these prototypes into the real product.

---

## 1. The single biggest gotcha: `axes` is an OBJECT, not an ARRAY

In AG Charts v13 the `axes` option was changed from an array of axis configs
to an **object keyed by `x` and `y`** (or `angle`/`radius` for polar charts).

If you pass an array, AG Charts silently rejects the entire `axes` config,
prints a warning to the console, and **falls back to default axes**. This is
how every "min/max ignored", "auto-padding I can't get rid of", and
"interval.values not respected" symptom manifests.

```js
// ❌ v8/v9 syntax — REJECTED in v13. Chart renders with default axes.
axes: [
  { type: 'time',   position: 'bottom', min: ..., max: ... },
  { type: 'number', position: 'left',   min: ..., max: ... },
]

// ✅ v13 syntax
axes: {
  x: { type: 'time',   position: 'bottom', min: ..., max: ... },
  y: { type: 'number', position: 'left',   min: ..., max: ... },
}
```

**Always check the browser console after writing chart options.** AG Charts
warns on every invalid option but never throws — broken configs render
"successfully" with defaults and waste hours of debugging.

The warning shape is:
> `AG Charts - Option <name> cannot be set to <value>; expecting <type>, ignoring.`

---

## 2. AG Charts diffs options by reference (legend toggle gotcha)

`chart.update(options)` performs a structural diff against the previously
applied options. **If you mutate the same object reference and pass it back,
the diff sees no change and nothing happens.**

```js
// ❌ Mutation in place — chart.update() does nothing.
totalGuestsChartOptions.series[0].visible = false;
chart.update(totalGuestsChartOptions);

// ✅ New objects so the diff detects the change.
var newSeries = totalGuestsChartOptions.series.map(function(s, i) {
  return Object.assign({}, s, { visible: i === 0 ? false : true });
});
var newOpts = Object.assign({}, totalGuestsChartOptions, { series: newSeries });
chart.update(newOpts);
totalGuestsChartOptions = newOpts; // keep the source of truth in sync
```

Also: **`AgCharts.update()` does NOT exist as a static method in v13** — only
the instance method `chart.update(opts)`.

---

## 3. Tooltips: there is no native "shared tooltip" mode

AG Charts Community has only **per-series tooltips** with their own
`renderer`. There is no built-in option to combine multiple series into a
single tooltip card the way ECharts' `tooltip.trigger: 'axis'` or Mixpanel's
default does.

This causes two common headaches:

- Two series with renderers → **two tooltips appear simultaneously** when
  hovering anywhere both lines are near.
- Disabling one series' tooltip → **that line no longer triggers any
  tooltip**. Hovering the prev-period line shows nothing.

`tooltip.range: 'nearest'` and `tooltip.range: <px>` did **not** prevent the
double tooltip in our testing (v13.2.1).

### Our solution: bypass AG Charts tooltips entirely

For multi-series cards we want **one tooltip that fires anywhere in the
plot area**, regardless of which line is closest. We do this by:

1. Setting `tooltip: { enabled: false }` on **every** series.
2. Attaching `mousemove` / `mouseleave` to the chart container.
3. On mouse move: map cursor `clientX` → date → nearest data point → render
   our own positioned `<div>` tooltip.

See [`beta/index.html`](../beta/index.html) `initTotalGuestsChart` for the
implementation. Key constants:

```js
var PLOT_LEFT      = 46;  // ~Y-axis label width — measure or estimate
var PLOT_RIGHT_PAD = 0;   // MUST match chart options padding.right
```

If you change `chart.padding`, also update those constants or the tooltip
will drift / clip near the right edge.

### CSS — strip the default tooltip wrapper

When you DO use the AG Charts tooltip, override its container so your
custom HTML controls every visual property:

```css
.ag-charts-tooltip {
  font-family: 'Manrope', sans-serif !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}
```

---

## 4. Time axis configuration recipe

This config produces a chart that:
- Starts flush against the Y-axis at `min`
- Ends flush against the right edge at `max`
- Shows only the explicit tick dates we choose
- Has a dashed crosshair on hover

```js
axes: {
  x: {
    type: 'time',
    position: 'bottom',
    nice: false,                // pin to exact min/max — no auto-rounding
    min: new Date(2026, 2, 19),
    max: new Date(2026, 3, 26),
    gridLine: { enabled: false },
    line:     { enabled: false },
    tick:     { enabled: true, size: 4, width: 1, stroke: '#000000' },
    label: {
      fontSize: 12,
      color: '#000000',
      format: '%b %-d',
      padding: 8,
      avoidCollisions: true,
    },
    interval: {
      values: [
        new Date(2026, 2, 29),
        new Date(2026, 3, 5),
        new Date(2026, 3, 12),
        new Date(2026, 3, 19),
      ],
    },
    crosshair: { enabled: true, stroke: '#c6c6c6', lineDash: [4, 4] },
  },
  y: { /* number axis */ },
}
```

### Key time-axis facts

- **`nice: false`** disables AG Charts' default outward rounding of the
  axis range. Without it, `min: Mar 19` may be rendered as `Mar 15` to
  reach a "nice" boundary.
- **`interval.values: Date[]`** is the canonical way to pin specific tick
  positions (not `tick.values`).
- **`label.format: '%b %-d'`** uses d3-time-format syntax — `%-d` is the
  unpadded day-of-month and is supported.

### Number axis trick — avoid darker bottom gridline

When the axis `min` lands exactly on a gridline value (e.g. `min: 1.10`
with gridlines at 1.10/1.15/1.20/1.25), the bottom gridline overlaps with
the chart-area boundary and renders darker.

Fix: nudge `min` slightly below the lowest gridline so it floats just
above the bottom edge.

```js
y: {
  type: 'number',
  min: 1.097,          // just below 1.10
  max: 1.253,          // just above 1.25
  interval: { values: [1.10, 1.15, 1.20, 1.25] },
  gridLine: {
    enabled: true,
    style: [{ stroke: '#DFE1E2', lineDash: [] }],
  },
  line: { enabled: false },
  tick: { enabled: false },
}
```

---

## 5. Line series patterns

### Solid line + dotted comparison line

```js
series: [
  // Comparison series first so it renders behind.
  {
    type: 'line', xKey: 'date', yKey: 'prev', yName: 'Prev period',
    stroke: '#5A55E3',
    strokeWidth: 1.5,
    lineDash: [1, 4],   // [dashLen, gapLen] — short dashes ≈ dotted look
    marker: { /* see below */ },
    tooltip: { enabled: false },
  },
  {
    type: 'line', xKey: 'date', yKey: 'current', yName: 'This period',
    stroke: '#5A55E3',
    strokeWidth: 2,
    marker: { /* see below */ },
    tooltip: { enabled: false },
  },
]
```

### Hover-only marker (invisible until cursor approaches)

`itemStyler` runs on every render — return `size: 0` for the default state
and a real size when `params.highlightState === 'highlighted-item'`.

```js
marker: {
  enabled: true,
  size: 0,
  itemStyler: function(params) {
    if (params.highlightState === 'highlighted-item') {
      return { size: 10, fill: '#5A55E3', stroke: '#ffffff', strokeWidth: 2 };
    }
    return { size: 0 };
  },
}
```

⚠️ With our manual mousemove tooltip the marker still relies on AG Charts'
own highlight detection (which fires only when the cursor is near a
specific data point on a specific line). The marker therefore won't appear
when hovering between or outside the lines, even though the tooltip does.
If you need a marker that follows the manual tooltip, draw it yourself in
the mousemove handler.

---

## 6. Custom HTML legend with click-to-toggle

AG Charts' built-in legend doesn't render arbitrary HTML (e.g. our
striped diagonal pattern for "Prev period"). We use a custom HTML legend
and disable the native one:

```js
legend: { enabled: false },
```

The legend is just two `<button>` elements with `aria-pressed` and an
`onclick` calling `toggleAGSeries(this, 'current' | 'prev')`. The toggle
function builds a fresh series array (see §2) and pushes it through
`chart.update()`.

### Striped marker via CSS

Pure CSS, no SVG/canvas needed:

```css
.chart-card__legend-marker--striped {
  background-color: #ffffff;
  background-image: repeating-linear-gradient(
    -45deg,
    #5A55E3 0, #5A55E3 1.5px,
    transparent 1.5px, transparent 3px
  );
  box-shadow: inset 0 0 0 1px #5A55E3;
}
```

The same `repeating-linear-gradient` works inline in tooltip HTML for the
matching swatch — no extra asset needed.

---

## 7. Chart-level options that matter

```js
{
  container: container,
  theme: { params: { fontFamily: 'Manrope, sans-serif' } },
  background: { fill: '#ffffff' },
  padding: { top: 8, right: 0, bottom: 0, left: 0 },
  // legend disabled because we render our own
  legend: { enabled: false },
}
```

- `theme.params.fontFamily` is the v13 way to set chart-wide fonts.
- `background.fill` matters because the canvas is opaque by default.
- `padding` controls the space between the chart's outer container and
  the plot area. Values here must match `PLOT_LEFT` / `PLOT_RIGHT_PAD`
  in the manual tooltip code.
- **`seriesArea.padding`** was tried but did not affect the gap between
  Y-axis and line. The fix was `nice: false` on the axis instead.

---

## 8. Lifecycle & cleanup

When a chart card can be added/removed dynamically (GridStack), ALWAYS:

1. Track the chart instance and its options object globally.
2. On remove → `chart.destroy()` and null out the references.
3. On re-init → destroy any prior chart, remove any prior tooltip DOM
   element, and remove any prior `mousemove`/`mouseleave` listeners
   before adding new ones.

Skipping cleanup leaks DOM nodes, stacks listeners, and produces ghost
tooltips when toggling cards.

---

## 9. Debugging checklist when something "doesn't work"

In order of likelihood:

1. **Open the console.** AG Charts will warn on every unrecognized or
   misshaped option — and silently render with defaults. The chart looking
   "almost right" usually means most of your options are being ignored.
2. **Check `axes` is an object `{ x, y }`, not an array.** This eats hours.
3. **For `chart.update()` doing nothing** → you mutated the same object.
   Build new objects with `Object.assign`.
4. **For "line doesn't reach the edge"** → `nice: false` on the axis.
5. **For "tooltip behaviour is weird with multiple series"** → there is no
   shared-tooltip mode. Either accept per-series tooltips or build a
   manual one (see §3).
6. **For static-method calls (`AgCharts.update(...)`, `.destroy()`)** →
   they don't exist; only instance methods on the chart object.

---

## 10. Things AG Charts Community v13 does NOT support cleanly

Document here as you discover them so we don't keep re-discovering them:

- **Shared tooltip across series** (a la ECharts `trigger: 'axis'`).
  Workaround: manual mousemove tooltip.
- **`tooltip.range: 'nearest'` exclusivity** — does not prevent another
  series' tooltip from firing in the same pixel area.
- **`AgCharts.update()` static method** — only `chart.update()`.
- **Reading the live plot-area rect from the chart instance** — there is
  no public API. Approximate it from `padding` + Y-axis label width, or
  measure once after render and cache.

---

## 11. CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ag-charts-community@13.2.1/dist/umd/ag-charts-community.min.js"></script>
```

Global is `agCharts.AgCharts`. Create with
`agCharts.AgCharts.create(options)` → returns a chart instance.

If/when migrating to npm in the real product, the import is:

```js
import { AgCharts } from 'ag-charts-community';
const chart = AgCharts.create(options);
```

---

## Reference implementation

The fully-working reference lives in:

- [`beta/index.html`](../beta/index.html) — `initTotalGuestsChart()` and
  `toggleAGSeries()` show every pattern in this doc together (v13 axes
  object, manual tooltip, custom legend, hover marker, lifecycle cleanup).
- [`beta/beta.css`](../beta/beta.css) — `.ag-charts-tooltip` overrides
  and `.chart-card__legend-marker--striped` pattern.
