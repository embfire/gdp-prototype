# Chart Color System

## Overview

We use a custom 12-color palette defined as CSS custom properties in `bento.css`. Each color has 5 shades (100, 300, 500, 700, 900). **Never invent custom hex values** -- always use from this palette.

---

## Palette Order

Colors must be assigned in this exact order:

| #  | Name         | 900 (primary) | CSS Variable              |
|----|-------------|----------------|---------------------------|
| 1  | Indigo      | `#5A55E3`      | `--chart-indigo-900`      |
| 2  | Vermilion   | `#FF6600`      | `--chart-vermilion-900`   |
| 3  | Periwinkle  | `#8C9FFF`      | `--chart-periwinkle-900`  |
| 4  | Amber       | `#F8931C`      | `--chart-amber-900`       |
| 5  | Crimson     | `#E83162`      | `--chart-crimson-900`     |
| 6  | Sky         | `#30ACEE`      | `--chart-sky-900`         |
| 7  | Golden      | `#FFBA00`      | `--chart-golden-900`      |
| 8  | Teal        | `#1196BB`      | `--chart-teal-900`        |
| 9  | Emerald     | `#0CC281`      | `--chart-emerald-900`     |
| 10 | Coral       | `#FF857A`      | `--chart-coral-900`       |
| 11 | Lavender    | `#E886F5`      | `--chart-lavender-900`    |
| 12 | Cyan        | `#2ECABF`      | `--chart-cyan-900`        |

---

## Shade Scale (per color)

Each color has 5 shades. Example using Indigo:

| Shade | Variable               | Hex       | Use case                          |
|-------|------------------------|-----------|-----------------------------------|
| 100   | `--chart-indigo-100`   | `#EAE9FB` | Backgrounds, area fill (lightest) |
| 300   | `--chart-indigo-300`   | `#A9A6F0` | Prior/comparison period lines     |
| 500   | `--chart-indigo-500`   | `#7874EA` | Mid-tone, hover states            |
| 700   | `--chart-indigo-700`   | `#6560E6` | Alternate emphasis                |
| 900   | `--chart-indigo-900`   | `#5A55E3` | Primary series color (default)    |

---

## All CSS Variables

```css
:root {
  /* Indigo */
  --chart-indigo-100: #EAE9FB;
  --chart-indigo-300: #A9A6F0;
  --chart-indigo-500: #7874EA;
  --chart-indigo-700: #6560E6;
  --chart-indigo-900: #5A55E3;

  /* Vermilion */
  --chart-vermilion-100: #FFE8D9;
  --chart-vermilion-300: #FFAC73;
  --chart-vermilion-500: #FF7A2E;
  --chart-vermilion-700: #FF6B14;
  --chart-vermilion-900: #FF6600;

  /* Periwinkle */
  --chart-periwinkle-100: #EEF0FF;
  --chart-periwinkle-300: #C0C8FF;
  --chart-periwinkle-500: #A8B3FF;
  --chart-periwinkle-700: #9AA5FF;
  --chart-periwinkle-900: #8C9FFF;

  /* Amber */
  --chart-amber-100: #FEF0DC;
  --chart-amber-300: #FCC578;
  --chart-amber-500: #FAA435;
  --chart-amber-700: #F99720;
  --chart-amber-900: #F8931C;

  /* Crimson */
  --chart-crimson-100: #FCDDE6;
  --chart-crimson-300: #F086A3;
  --chart-crimson-500: #ED5178;
  --chart-crimson-700: #EA3D6A;
  --chart-crimson-900: #E83162;

  /* Sky */
  --chart-sky-100: #DAEEFA;
  --chart-sky-300: #7CCBF3;
  --chart-sky-500: #42B5EE;
  --chart-sky-700: #37ADEE;
  --chart-sky-900: #30ACEE;

  /* Golden */
  --chart-golden-100: #FFF3CC;
  --chart-golden-300: #FFD966;
  --chart-golden-500: #FFC91A;
  --chart-golden-700: #FFC008;
  --chart-golden-900: #FFBA00;

  /* Teal */
  --chart-teal-100: #D5EBF2;
  --chart-teal-300: #5EB1CC;
  --chart-teal-500: #1E9ABF;
  --chart-teal-700: #1595BB;
  --chart-teal-900: #1196BB;

  /* Emerald */
  --chart-emerald-100: #CCFAEC;
  --chart-emerald-300: #4ADBA9;
  --chart-emerald-500: #0DC88A;
  --chart-emerald-700: #0DC484;
  --chart-emerald-900: #0CC281;

  /* Coral */
  --chart-coral-100: #FFE8E6;
  --chart-coral-300: #FFBAB5;
  --chart-coral-500: #FF9D97;
  --chart-coral-700: #FF8F88;
  --chart-coral-900: #FF857A;

  /* Lavender */
  --chart-lavender-100: #FAE3FD;
  --chart-lavender-300: #EFA5F8;
  --chart-lavender-500: #EC96F7;
  --chart-lavender-700: #EA8EF6;
  --chart-lavender-900: #E886F5;

  /* Cyan */
  --chart-cyan-100: #D5F6F4;
  --chart-cyan-300: #65DDD8;
  --chart-cyan-500: #2ECFC4;
  --chart-cyan-700: #2ECCC1;
  --chart-cyan-900: #2ECABF;
}
```

---

## JS Palette Array

Use this array in ECharts `color` option. For charts with fewer series, ECharts automatically uses the first N colors in order.

```js
const chartPalette12 = [
  '#5A55E3', // indigo
  '#FF6600', // vermilion
  '#8C9FFF', // periwinkle
  '#F8931C', // amber
  '#E83162', // crimson
  '#30ACEE', // sky
  '#FFBA00', // golden
  '#1196BB', // teal
  '#0CC281', // emerald
  '#FF857A', // coral
  '#E886F5', // lavender
  '#2ECABF', // cyan
];
```

---

## Usage Rules

### General
- **900 shade is the default** for all chart series (bars, lines, pie slices, nodes).
- For charts with fewer than 12 series, use the **first N colors in palette order**. Do not skip or cherry-pick.
- Never hardcode hex values inline -- reference CSS variables or the JS array.

### Line Charts
- Current period line: use the **900** shade.
- Prior/comparison period line: use the **300** shade of the same color (e.g. `--chart-indigo-300`), not transparency/opacity.
- Area fill gradient: use the **100** shade fading to transparent.
- Hidden dots by default, 8px dots on hover.
- `boundaryGap: false` on the x-axis.

### Bar Charts (Period Comparisons)
- Both current and previous period bars use the **same solid 900 color**.
- Previous period bars get a **diagonal stripe decal** pattern to differentiate:

```js
// Previous period decal config
{
  symbol: 'rect',
  rotation: Math.PI / 4,
  dashArrayX: [1, 0],
  dashArrayY: [1, 1],
  color: 'rgba(255,255,255,1)'
}
```

- Enable decals: `aria: { enabled: true, decal: { show: true } }` on chart option.
- Legend swatches stay solid: override with `decal: { symbol: 'none' }`.
- Current period bars: explicitly set `decal: { symbol: 'none' }`.

### Pie / Donut Charts
- Assign 900 shades in palette order.

### Sankey Diagrams
- Node colors from palette in order, use 900 shades.

---

## ECharts General Rules
- Font: **Manrope** everywhere (wrap chart init in `document.fonts.ready`).
- Legend icon: `icon: 'roundRect'`, size `itemWidth: 12, itemHeight: 12` for line charts.
- No shadow on axis pointer.
- Use `ResizeObserver` for flex containers.
