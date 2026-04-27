# Bento Design System — PAR Branding Migration Brief

**For:** Developer (Claude Code assisted)  
**From:** Design  
**Date:** 2026-04-13  
**Codebase:** `/bento-design-system/`  
**Scope:** One-way migration from Punchh to PAR brand — no runtime switching needed

---

## Context

The codebase is currently implementing the **Punchh brand** (orange primary buttons, violet secondary). The Figma design file defines two brand modes — Punchh and PAR. We are migrating permanently to **PAR** (violet primary, orange secondary). This is not a toggle — we're updating the default compiled values.

Along the way, fix two confirmed bugs and add missing typography styles.

---

## What Changes Visually

| Element | Current (Punchh) | Target (PAR) |
|---|---|---|
| Primary button | Orange `#f8931c` + black text | Violet `#5a55e3` + white text |
| Primary button hover | Dark orange `#d67707` | Dark violet `#2a23d6` |
| Primary button disabled | Light orange `#fbc98d` | Light violet `#acaaf1` |
| Secondary button | Violet `#6864d1` + white text | Orange `#f8931c` + black text |
| Secondary button hover | Dark violet `#3e39bf` | Dark orange `#d67707` |
| Secondary button disabled | Light violet `#b3b1e8` | Light orange `#fbc98d` |
| Checkboxes (checked) | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Chips (prominent) | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Date picker selection | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Button group selected | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Scrollbar thumb | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Tab vertical active | `#6864d1` violet | `#5a55e3` violet (brighter) |
| Left nav open-category text | Orange `#f8931c` | Periwinkle `#9aa4ff` |
| Left nav open-category bg | `#2f3452` (par1) | `#212438` (par0) |
| Left nav child hover | `#212438` (par0) | `#2f3452` (par1) |
| Left nav child selected/active | `#6864d1` (par3) | `#2f3452` (par1) |
| `.big` text size | 24px ← **bug** | 28px |

---

## Implementation Order

### Step 1 — Add Missing Color Tokens

**File:** `src/styles/_colors.scss`

Add these new variables after line 92 (after `$color-brand-par3-120`):

```scss
// PAR ui-optimized variants (screen-accurate, more vibrant)
$color-brand-par1-tint-4: #545d93;
$color-brand-par2-ui-optimized: #9aa4ff;
$color-brand-par3-ui-optimized: #5a55e3;
$color-brand-par3-10-ui-optimized: #eeeefc;
$color-brand-par3-50-ui-optimized: #acaaf1;
$color-brand-par3-120-ui-optimized: #2a23d6;
```

> These variables exist in the Figma token library but were never added to the SCSS. Every interactive component in PAR mode uses the `ui-optimized` violet variants, not the base `par3` values.

---

### Step 2 — Fix `green-30` Hex Value (Bug)

**File:** `src/styles/_colors.scss`, line 51

```scss
// BEFORE
$green: (
  30: #b2f2e8,   // wrong — very light mint, doesn't match Figma

// AFTER
$green: (
  30: #7dafa8,   // correct — sage green, matches Figma spec
```

> The commented-out CSS variable block in `index.scss` (line 240) already has `#7DAFA8`, confirming the map value is the bug.

---

### Step 3 — Fix `.big` Font Size (Bug)

**File:** `src/styles/_typography.scss`, lines 129–134

```scss
// BEFORE
.big {
  @include font(
    map.get($font-sizes-px, "24"),   // wrong — 24px

// AFTER
.big {
  @include font(
    map.get($font-sizes-px, "28"),   // correct — 28px, matches Figma Body/Big
```

---

### Step 4 — Re-map Button Semantic Tokens

**File:** `src/styles/index.scss`, lines 64–78

```scss
// BEFORE (Punchh brand)
$button-primary-default: $color-brand-par5;
$button-primary-disabled: $color-brand-par5-50;
$button-primary-hover: $color-brand-par5-120;
$button-secondary-default: $color-brand-par3;
$button-secondary-disabled: $color-brand-par3-50;
$button-secondary-hover: $color-brand-par3-120;

// AFTER (PAR brand)
$button-primary-default: $color-brand-par3-ui-optimized;
$button-primary-disabled: $color-brand-par3-50-ui-optimized;
$button-primary-hover: $color-brand-par3-120-ui-optimized;
$button-secondary-default: $color-brand-par5;
$button-secondary-disabled: $color-brand-par5-50;
$button-secondary-hover: $color-brand-par5-120;
```

> `$link-underline-*` variables on lines 73–78 do not reference par3/par5 and stay as-is.

---

### Step 5 — Fix Button Text Colors (Critical)

**File:** `src/components/button/button.scss`

The current code sets black text (`$text-normal`) as the default for all buttons, then overrides secondary and danger to white. After swapping primary to violet, primary buttons need **white text**. Secondary becomes orange and needs **black text**.

```scss
// BEFORE
span {
  color: $text-normal;  // black — global default (applied to primary)
}
&.secondary {
  span {
    color: $text-normal-inverse;  // white — override for secondary (violet)
  }
  ...
}

// AFTER — be explicit per variant
span {
  color: $text-normal;  // black — default (transparent, outlined)
}
&.primary {
  span {
    color: $text-normal-inverse;  // white on violet
  }
  ...
}
&.secondary {
  span {
    color: $text-normal;  // black on orange
  }
  ...
}
// &.danger stays as-is (already has white override)
```

> **Risk:** Check if any icon inside a button also inherits `color` from `span`. Icons rendered via Material Icons font will be affected by this color change too — that's intentional and correct.

---

### Step 6 — Update Other Component Tokens to `par3-ui-optimized`

**File:** `src/styles/index.scss`

The following tokens all currently point to `$color-brand-par3` (`#6864d1`). In PAR mode they should use the brighter `$color-brand-par3-ui-optimized` (`#5a55e3`):

| Current line | Variable | Change to |
|---|---|---|
| 25 | `$scroll-bar_scroll-bar-bar` | `$color-brand-par3-ui-optimized` |
| 37 | `$icon-brand` | `$color-brand-par3-ui-optimized` |
| 57 | `$clay-button` | `$color-brand-par3-ui-optimized` |
| 97 | `$checkbox-fill-checked` | `$color-brand-par3-ui-optimized` |
| 105 | `$chip-prominent-fill` | `$color-brand-par3-ui-optimized` |
| 160 | `$date-picker-fill-selection` | `$color-brand-par3-ui-optimized` |
| 171 | `$button-group-selected-fill` | `$color-brand-par3-ui-optimized` |
| 205 | `$loading-dialog-clock` | `$color-brand-par3-ui-optimized` |

> `$tab-vertical-active-fill` on line 32 also uses `$color-brand-par3` — update it to `$color-brand-par3-ui-optimized` as well.

---

### Step 7 — Update Left Nav Tokens

**File:** `src/styles/index.scss`, lines 209–215

```scss
// BEFORE (Punchh)
$left-nav-bg: $color-brand-par0;                        // stays
$left-nav-category-hover: $color-brand-par1;            // stays
$left-nav-category-open-text: $color-brand-par5;        // changes
$left-nav-category-open-bg: $color-brand-par1;          // changes
$left-nav-child-hover: $color-brand-par0;               // changes
$left-nav-child-selected: $color-brand-par3;            // changes

// AFTER (PAR)
$left-nav-bg: $color-brand-par0;                        // unchanged
$left-nav-category-hover: $color-brand-par1;            // unchanged
$left-nav-category-open-text: $color-brand-par2-ui-optimized;  // periwinkle #9aa4ff
$left-nav-category-open-bg: $color-brand-par0;          // dark navy, not slate
$left-nav-child-hover: $color-brand-par1;               // slate, not navy
$left-nav-child-selected: $color-brand-par1;            // slate, not violet
```

> The left nav is the most visually distinct difference between PAR and Punchh. In PAR mode the active/selected child uses a dark slate background (`par1`) rather than violet (`par3`). The open-category label text shifts from orange to periwinkle.

---

### Step 8 — Add Missing Typography Styles (Nice to Have)

**File:** `src/styles/_typography.scss`

Font weight 700 is already loaded via Google Fonts (line 4 of `_typography.scss` includes `wght@400;700;800`). Only the SCSS abstraction is missing.

Add a `$semibold` variable after `$bold` (around line 52):

```scss
$semibold: 700;
```

Then add the two missing emphasis styles at the end of the type definitions:

```scss
.body1-em {
  @include font(
    map.get($font-sizes-px, "16"),
    $semibold,
    map.get($line-heights, "150")
  );
}

.body2-em {
  @include font(
    map.get($font-sizes-px, "14"),
    $bold,
    map.get($line-heights, "172")
  );
}
```

> These classes don't exist yet in any component but are defined in Figma. Adding them now makes them available for future use without rework.

---

## Files Touched Summary

| File | Steps | Nature of change |
|---|---|---|
| `src/styles/_colors.scss` | 1, 2 | Add 6 new variables; fix one hex value |
| `src/styles/_typography.scss` | 3, 8 | Fix font size; add 2 new styles + 1 variable |
| `src/styles/index.scss` | 4, 6, 7 | Re-map ~15 semantic token assignments |
| `src/components/button/button.scss` | 5 | Flip text color logic for primary/secondary |

---

## QA Checklist

After the changes, visually verify these in Storybook:

- [ ] Primary button: violet background, white text, icons also white
- [ ] Primary button hover: noticeably darker violet
- [ ] Primary button disabled: desaturated violet, grey text
- [ ] Secondary button: orange background, black text, icons also black
- [ ] Secondary button disabled: light orange, grey text
- [ ] Danger button: red background, white text — **should be unchanged**
- [ ] Transparent / Outlined button: no background, black text — **should be unchanged**
- [ ] Checkbox checked state: brighter violet (`#5a55e3`) not `#6864d1`
- [ ] Chip prominent: brighter violet
- [ ] Date picker selected date: brighter violet
- [ ] Left nav: selected child is dark slate (not violet)
- [ ] Left nav: open category label text is periwinkle (not orange)
- [ ] `.big` text: confirm 28px renders correctly (compare against `.h2` at 24px — Big should be larger)
- [ ] Scrollbar: violet thumb is brighter

---

### Step 9 — Add Chart Color Palette (New)

**File:** `src/styles/_chart-palette.scss` ← create this new file  
**File:** `src/styles/index.scss` ← add import

Create `src/styles/_chart-palette.scss` with the following content, then add `@import "./chart-palette";` to the import block at the top of `src/styles/index.scss`.

```scss
// Chart Color Palette
// 12 semantic color families, each with 5 stops (100–900).
// Exposed as CSS custom properties so charting libraries (Chart.js, ECharts, etc.)
// can read them at runtime via JavaScript:
//   getComputedStyle(document.documentElement).getPropertyValue('--chart-indigo-500')
//
// Usage convention:
//   -500  Default series color
//   -300  Lighter variant / hover / area fill
//   -700  Darker variant / emphasis
//   -100  Very light tint / background / zero-line fill
//   -900  Maximum contrast / accessible on light backgrounds

:root {
  // Indigo — primary brand series color (PAR violet family)
  --chart-indigo-100: #eae9fb;
  --chart-indigo-300: #a9a6f0;
  --chart-indigo-500: #7874ea;
  --chart-indigo-700: #6560e6;
  --chart-indigo-900: #5a55e3;

  // Vermilion — warm red-orange
  --chart-vermilion-100: #ffe8d9;
  --chart-vermilion-300: #ffac73;
  --chart-vermilion-500: #ff7a2e;
  --chart-vermilion-700: #ff6b14;
  --chart-vermilion-900: #ff6600;

  // Periwinkle — blue-violet (PAR par2 family)
  --chart-periwinkle-100: #eef0ff;
  --chart-periwinkle-300: #c0c8ff;
  --chart-periwinkle-500: #a8b3ff;
  --chart-periwinkle-700: #9aa5ff;
  --chart-periwinkle-900: #8c9fff;

  // Amber — brand orange (PAR par5 family)
  --chart-amber-100: #fef0dc;
  --chart-amber-300: #fcc578;
  --chart-amber-500: #faa435;
  --chart-amber-700: #f99720;
  --chart-amber-900: #f8931c;

  // Crimson — vivid red
  --chart-crimson-100: #fcdde6;
  --chart-crimson-300: #f086a3;
  --chart-crimson-500: #ed5178;
  --chart-crimson-700: #ea3d6a;
  --chart-crimson-900: #e83162;

  // Sky — light blue
  --chart-sky-100: #daeefa;
  --chart-sky-300: #7ccbf3;
  --chart-sky-500: #42b5ee;
  --chart-sky-700: #37adee;
  --chart-sky-900: #30acee;

  // Golden — bright yellow
  --chart-golden-100: #fff3cc;
  --chart-golden-300: #ffd966;
  --chart-golden-500: #ffc91a;
  --chart-golden-700: #ffc008;
  --chart-golden-900: #ffba00;

  // Teal — blue-green
  --chart-teal-100: #d5ebf2;
  --chart-teal-300: #5eb1cc;
  --chart-teal-500: #1e9abf;
  --chart-teal-700: #1595bb;
  --chart-teal-900: #1196bb;

  // Emerald — bright green
  --chart-emerald-100: #ccfaec;
  --chart-emerald-300: #4adba9;
  --chart-emerald-500: #0dc88a;
  --chart-emerald-700: #0dc484;
  --chart-emerald-900: #0cc281;

  // Coral — warm pink-red
  --chart-coral-100: #ffe8e6;
  --chart-coral-300: #ffbab5;
  --chart-coral-500: #ff9d97;
  --chart-coral-700: #ff8f88;
  --chart-coral-900: #ff857a;

  // Lavender — soft purple
  --chart-lavender-100: #fae3fd;
  --chart-lavender-300: #efa5f8;
  --chart-lavender-500: #ec96f7;
  --chart-lavender-700: #ea8ef6;
  --chart-lavender-900: #e886f5;

  // Cyan — blue-green
  --chart-cyan-100: #d5f6f4;
  --chart-cyan-300: #65ddd8;
  --chart-cyan-500: #2ecfc4;
  --chart-cyan-700: #2eccc1;
  --chart-cyan-900: #2ecabf;
}
```

**12 color families, 5 stops each (100–900):**

| Family | -500 (default) | Brand connection |
|---|---|---|
| Indigo | `#7874EA` | PAR violet family |
| Vermilion | `#FF7A2E` | Warm red-orange |
| Periwinkle | `#A8B3FF` | PAR par2 family |
| Amber | `#FAA435` | PAR orange/par5 family |
| Crimson | `#ED5178` | Vivid red |
| Sky | `#42B5EE` | Light blue |
| Golden | `#FFC91A` | Bright yellow |
| Teal | `#1E9ABF` | Blue-green |
| Emerald | `#0DC88A` | Bright green |
| Coral | `#FF9D97` | Warm pink-red |
| Lavender | `#EC96F7` | Soft purple |
| Cyan | `#2ECFC4` | Blue-green |

**Stop usage convention:**

| Stop | Use |
|---|---|
| -100 | Very light tint, background fills, zero-line fill |
| -300 | Lighter variant, hover state, area chart fill |
| -500 | Default series color |
| -700 | Darker variant, emphasis |
| -900 | Maximum contrast, accessible on light backgrounds |

**Why CSS custom properties (not SCSS variables):**  
Chart libraries (Chart.js, ECharts, D3, etc.) are configured in JavaScript. CSS custom properties can be read at runtime:
```js
getComputedStyle(document.documentElement).getPropertyValue('--chart-indigo-500')
```
SCSS variables are compiled away and not accessible to JS. The existing semantic `$chart-*` SCSS tokens (favorable/caution/unfavorable/background) are separate and remain unchanged.

---

## Out of Scope

These are known gaps but not part of this migration:

- **Runtime CSS variables** — no switch to CSS custom properties; tokens stay as compiled SCSS
- **PAR-specific left nav pin states** — `leftnav-pin-bg`, `leftnav-pin-bg-hover`, `leftnav-pin-icon` tokens are not mapped in the current SCSS; add only if the left nav pin feature is in use
- **Border radius scale** — only 8px is defined in code; 0px, 4px, 12px stops from Figma are not yet added
- **Deprecated legacy color system** — `$primary`, `$teal`, `$tangerine`, etc. in `_colors.scss` (lines 136–227) should be removed in a separate cleanup task, not this migration
