# Bento Design System — Developer Reference

**File:** `bento-design-system — Loyalty Platform`
**Extracted:** 2026-04-13
**Themes:** PAR (default), Punchh
**Font:** Manrope (UI), Ubuntu Mono (code)

---

## 1. Color Tokens

### 1.1 Primitive Tokens — Brand Palette

The brand palette uses a `par0`–`par5` naming scheme where par = "PAR" (the parent brand). Variants are expressed as numeric suffixes: `-10` (≈10% opacity tint), `-50` (50% mix), `-120` (120% shade), with a `-ui-optimized` override for screen-accurate rendering.

| Token | CSS Variable | Hex | Notes |
|---|---|---|---|
| `color/brand/par0` | `--color/brand/par0` | `#212438` | Deep navy / "Eggplant" |
| `color/brand/par1` | `--color/brand/par1` | `#2f3452` | Dark slate / "Guava" |
| `color/brand/par1-tint-4` | `--color/brand/par1-tint-4` | `#545d93` | Mid slate (internal use) |
| `color/brand/par2` | `--color/brand/par2` | `#8c9fff` | Periwinkle / "Slate" |
| `color/brand/par2-ui-optimized` | `--color/brand/par2-ui-optimized` | `#9aa4ff` | Slightly lighter periwinkle |
| `color/brand/par2-10` | `--color/brand/par2-10` | `#f3f5ff` | Very light periwinkle tint |
| `color/brand/par3` | `--color/brand/par3` | `#6864d1` | Violet (labeled "Teal" in Figma — misleading) |
| `color/brand/par3-ui-optimized` | `--color/brand/par3-ui-optimized` | `#5a55e3` | More vivid violet for screens |
| `color/brand/par3-10` | `--color/brand/par3-10` | `#e1e0f6` | Very light violet tint |
| `color/brand/par3-10-ui-optimized` | `--color/brand/par3-10-ui-optimized` | `#eeeefc` | Lighter violet tint |
| `color/brand/par3-50` | `--color/brand/par3-50` | `#b3b1e8` | Mid violet |
| `color/brand/par3-50-ui-optimized` | `--color/brand/par3-50-ui-optimized` | `#acaaf1` | More vivid mid violet |
| `color/brand/par3-120` | `--color/brand/par3-120` | `#3e39bf` | Darker violet shade |
| `color/brand/par3-120-ui-optimized` | `--color/brand/par3-120-ui-optimized` | `#2a23d6` | Vivid dark violet |
| `color/brand/par4` | `--color/brand/par4` | `#ff5719` | Tangerine |
| `color/brand/par4-10` | `--color/brand/par4-10` | `#ffeee8` | Light tangerine tint |
| `color/brand/par5` | `--color/brand/par5` | `#f8931c` | Logo orange |
| `color/brand/par5-10` | `--color/brand/par5-10` | `#fef4e8` | Very light orange tint |
| `color/brand/par5-50` | `--color/brand/par5-50` | `#fbc98d` | Mid orange |
| `color/brand/par5-120` | `--color/brand/par5-120` | `#d67707` | Darker orange shade |

### 1.2 Primitive Tokens — Basic

| Token | CSS Variable | Hex |
|---|---|---|
| `color/basic/black` | `--color/basic/black` | `#000000` |
| `color/basic/white` | `--color/basic/white` | `#ffffff` |

### 1.3 Primitive Tokens — Grey Scale

10-step neutral scale from near-white to near-black.

| Token | CSS Variable | Hex | Approx Usage |
|---|---|---|---|
| `color/grey/grey-10` | `--color/grey/grey-10` | `#f4f4f4` | Page backgrounds, hover fills |
| `color/grey/grey-20` | `--color/grey/grey-20` | `#dfe1e2` | Borders, table headers, dividers |
| `color/grey/grey-30` | `--color/grey/grey-30` | `#c9cecf` | Disabled borders, unfilled icons |
| `color/grey/grey-40` | `--color/grey/grey-40` | `#b3babc` | Empty card borders, stepper lines |
| `color/grey/grey-50` | `--color/grey/grey-50` | `#9ea6a9` | Subdued clay, skeleton, chart neutral |
| `color/grey/grey-60` | `--color/grey/grey-60` | `#737e82` | _(minimal UI use observed)_ |
| `color/grey/grey-70` | `--color/grey/grey-70` | `#60696c` | Subdued text, subdued icons |
| `color/grey/grey-80` | `--color/grey/grey-80` | `#4d5456` | Inverse link underline, chart fills |
| `color/grey/grey-90` | `--color/grey/grey-90` | `#3a3f41` | _(minimal UI use observed)_ |
| `color/grey/grey-100` | `--color/grey/grey-100` | `#1f2223` | Tooltip fill |

### 1.4 Primitive Tokens — Functional Palettes

| Token | CSS Variable | Hex |
|---|---|---|
| `color/blue/blue-10` | `--color/blue/blue-10` | `#ebf0ff` |
| `color/blue/blue-50` | `--color/blue/blue-50` | `#1d5eff` |
| `color/green/green-10` | `--color/green/green-10` | `#effaf9` |
| `color/green/green-30` | `--color/green/green-30` | `#7dafa8` |
| `color/green/green-50` | `--color/green/green-50` | `#3dc1af` |
| `color/green/green-80` | `--color/green/green-80` | `#257469` |
| `color/red/red-10` | `--color/red/red-10` | `#fdecf1` |
| `color/red/red-30` | `--color/red/red-30` | `#f37093` |
| `color/red/red-50` | `--color/red/red-50` | `#e8144c` |
| `color/red/red-80` | `--color/red/red-80` | `#bc103e` |
| `color/yellow/yellow-10` | `--color/yellow/yellow-10` | `#fffaeb` |
| `color/yellow/yellow-50` | `--color/yellow/yellow-50` | `#fed766` |
| `color/yellow/yellow-60` | `--color/yellow/yellow-60` | `#fcd179` |
| `color/yellow/yellow-80` | `--color/yellow/yellow-80` | `#cc8900` |
| `color/purple/purple-20` | `--color/purple/purple-20` | `#dbd3e9` |
| `color/purple/purple-50` | `--color/purple/purple-50` | `#9747ff` |

> **Gap:** The blue and green palettes only have 2 and 4 stops respectively — `blue-20`, `blue-30`, `blue-80`, `green-20`, `green-60`, etc. are not defined.

---

### 1.5 Semantic Tokens — Component Color Map

The `tokens` collection maps semantic roles to primitives. Two modes exist: **PAR** (default) and **Punchh** (alternate branding). Tokens identical across both modes are marked `(same)`.

#### Text

| Token | PAR | Punchh | Resolved Hex (PAR) |
|---|---|---|---|
| `text/text-normal` | `color/basic/black` | same | `#000000` |
| `text/text-normal-inverse` | `color/basic/white` | same | `#ffffff` |
| `text/text-subdued` | `color/grey/grey-70` | same | `#60696c` |
| `text/text-link` | `color/blue/blue-50` | same | `#1d5eff` |
| `text/text-visited` | `color/brand/par0` | same | `#212438` |
| `text/text-danger` | `color/red/red-50` | same | `#e8144c` |
| `text/text-favorable` | `color/green/green-80` | same | `#257469` |
| `text/text-unfavorable` | `color/red/red-50` | same | `#e8144c` |
| `text/text-caution` | `color/yellow/yellow-80` | same | `#cc8900` |
| `text/text-brand` | `color/brand/par3-ui-optimized` | same | `#5a55e3` |
| `text/text-annotation` | `color/purple/purple-50` | same | `#9747ff` |

#### Icons

| Token | PAR | Resolved Hex (PAR) |
|---|---|---|
| `icon/icon-normal` | `color/basic/black` | `#000000` |
| `icon/icon-normal-inverse` | `color/basic/white` | `#ffffff` |
| `icon/icon-subdued` | `color/grey/grey-70` | `#60696c` |
| `icon/icon-unfilled` | `color/grey/grey-30` | `#c9cecf` |
| `icon/icon-link` | `color/blue/blue-50` | `#1d5eff` |
| `icon/icon-danger` | `color/red/red-50` | `#e8144c` |
| `icon/icon-success` | `color/green/green-80` | `#257469` |
| `icon/icon-brand` | `par3-ui-optimized` (PAR) / `par3` (Punchh) | `#5a55e3` / `#6864d1` |

#### Buttons

| Token | PAR Primitive | Punchh Primitive | PAR Hex | Punchh Hex |
|---|---|---|---|---|
| `button/button-primary-default` | `par3-ui-optimized` | `par5` | `#5a55e3` | `#f8931c` |
| `button/button-primary-hover` | `par3-120-ui-optimized` | `par5-120` | `#2a23d6` | `#d67707` |
| `button/button-primary-disabled` | `par3-50-ui-optimized` | `par5-50` | `#acaaf1` | `#fbc98d` |
| `button/button-primary-text` | `white` | `black` | `#ffffff` | `#000000` |
| `button/button-primary-icon` | `white` | `black` | `#ffffff` | `#000000` |
| `button/button-secondary-default` | `par5` | `par3` | `#f8931c` | `#6864d1` |
| `button/button-secondary-hover` | `par5-120` | `par3-120` | `#d67707` | `#3e39bf` |
| `button/button-secondary-disabled` | `par5-50` | `par3-50` | `#fbc98d` | `#b3b1e8` |
| `button/button-secondary-text` | `black` | `white` | `#000000` | `#ffffff` |
| `button/button-secondary-icon` | `black` | `white` | `#000000` | `#ffffff` |
| `button/button-danger-default` | `red-50` | same | `#e8144c` | — |
| `button/button-danger-hover` | `red-80` | same | `#bc103e` | — |
| `button/button-danger-disabled` | `red-30` | same | `#f37093` | — |
| `button/button-transparent-hover` | `grey-10` | same | `#f4f4f4` | — |

#### Button Group

| Token | PAR | Punchh |
|---|---|---|
| `button group/buttonGroup-selected` | `par3-ui-optimized` (#5a55e3) | `par3` (#6864d1) |
| `button group/buttonGroup-notSelected` | `white` | `white` |

#### Banners

| Token | Fill | Stroke |
|---|---|---|
| `banner-tip` | `grey-10` (#f4f4f4) | `black` (#000000) |
| `banner-informational` | `blue-10` (#ebf0ff) | `blue-50` (#1d5eff) |
| `banner-warning` | `yellow-10` (#fffaeb) | `yellow-50` (#fed766) |
| `banner-error` | `red-10` (#fdecf1) | `red-50` (#e8144c) |

#### Cards

| Token | PAR Hex | Notes |
|---|---|---|
| `card/card-border` | `#dfe1e2` (grey-20) | Standard card |
| `card/card-border-empty` | `#b3babc` (grey-40) | Empty/dashed state |
| `card/card-fill-generic` | `#ffffff` | Default |
| `card/card-fill-punchh` | `#fef4e8` (par5-10) | Orange-tinted |
| `card/card-fill-ordering` | `#ffeee8` (par4-10) | Tangerine-tinted |
| `card/card-fill-brand` | `#eeeefc` (par3-10-ui-opt) | Violet-tinted |

#### Checkboxes

| Token | PAR | Punchh |
|---|---|---|
| `checkbox-fill-checked` | `par3-ui-optimized` (#5a55e3) | `par3` (#6864d1) |
| `checkbox-border-enabled-notChecked` | `black` | same |
| `checkbox-border-disabled-notChecked` | `grey-70` (#60696c) | same |
| `checkbox-border-danger` | `red-50` (#e8144c) | same |
| `checkbox-fill-disabled` | `grey-30` (#c9cecf) | same |
| `checkboxRegion-checked` | `blue-10` (#ebf0ff) | same |

#### Chips

| Token | PAR Hex | Punchh Hex |
|---|---|---|
| `chip-neutral-fill` | `#dfe1e2` (grey-20) | same |
| `chip-neutral-contents` | `#000000` | same |
| `chip-prominent-fill` | `#5a55e3` (par3-ui-opt) | `#6864d1` (par3) |
| `chip-prominent-contents` | `#ffffff` | same |

#### Tags

| Token | Fill | Text | Fill Hex |
|---|---|---|---|
| `tag-favorable` | `green-50` | `black` | `#3dc1af` / `#000000` |
| `tag-unfavorable` | `red-50` | `white` | `#e8144c` / `#ffffff` |
| `tag-neutral` | `par2-ui-optimized` (PAR) / `par2` (Punchh) | `black` | `#9aa4ff` / `#8c9fff` |
| `tag-waiting` | `yellow-50` | `black` | `#fed766` / `#000000` |
| `tag-finished` | `par0` | `white` | `#212438` / `#ffffff` |

#### Containers / Layout

| Token | PAR | Hex |
|---|---|---|
| `container/container-header` | `white` | `#ffffff` |
| `container/container-leftNav` | `par0` | `#212438` |
| `container/container-body` | `white` | `#ffffff` |

#### Left Nav (differs most between themes)

| Token | PAR Primitive | Punchh Primitive |
|---|---|---|
| `leftNav-bg-category` | `par0` | `par0` |
| `leftNav-bg-categoryHover` | `par1` | `par1` |
| `leftnav-bg-categoryOpen` | `par0` | `par1` |
| `leftNav-bg-openContainer` | `par0` | `par1` |
| `leftNav-bg-childHover` | `par1` | `par0` |
| `leftNav-bg-childActive` | `par1` | `par3` |
| `leftNav-text-categoryOpen` | `par2-ui-optimized` | `par5` |
| `leftnav-text-childActive` | `par2-ui-optimized` | `white` |
| `leftnav-text-subcategory` | `par5` | `par5` |
| `leftnav-pin-bg` | `par1` | `par5` |
| `leftnav-pin-bg-hover` | `par1-tint-4` | `par5-120` |
| `leftnav-pin-icon` | `par2-ui-optimized` | `black` |

#### Toasts

| Token | Fill | Text |
|---|---|---|
| `toast-success` | `green-80` (#257469) | `white` |
| `toast-danger` | `red-50` (#e8144c) | `white` |
| `toast-info` | `blue-50` (#1d5eff) | `white` |

#### Data Visualization

**Basic series (14 colors):**

| # | Token | PAR Hex |
|---|---|---|
| 1 | `chart-basic-1` → `blue-50` | `#1d5eff` |
| 2 | `chart-basic-2` → `red-50` | `#e8144c` |
| 3 | `chart-basic-3` → `yellow-50` | `#fed766` |
| 4 | `chart-basic-4` → `purple-50` | `#9747ff` |
| 5 | `chart-basic-5` → `green-50` | `#3dc1af` |
| 6 | `chart-basic-6` → `grey-50` | `#9ea6a9` |
| 7 | `chart-basic-7` → `black` | `#000000` |
| 8 | `chart-basic-8` → `red-80` | `#bc103e` |
| 9 | `chart-basic-9` → `yellow-80` | `#cc8900` |
| 10 | `chart-basic-10` → `green-80` | `#257469` |
| 11 | `chart-basic-11` → `grey-80` | `#4d5456` |
| 12 | `chart-basic-12` → `green-10` | `#effaf9` |
| 13 | `chart-basic-13` → `purple-20` | `#dbd3e9` |
| 14 | `chart-basic-14` → `red-30` | `#f37093` |

**Brand series (6 stops, par0–par5):**
`par0` (#212438) → `par1` (#2f3452) → `par2` (#9aa4ff) → `par3` (#5a55e3) → `par4` (#ff5719) → `par5` (#f8931c)

**Heat map:** `par3-10` → `par3-50` → `par3-ui-optimized`

**Favorable/Unfavorable:** `green-50` / `red-50` / `yellow-50` / `grey-50`

#### Other Semantic Tokens

| Token | PAR | PAR Hex |
|---|---|---|
| `line` | `grey-20` | `#dfe1e2` |
| `hover-fill` | `grey-10` | `#f4f4f4` |
| `actively-selected-fill` | `par3-10-ui-optimized` | `#eeeefc` |
| `highlighted-text-background` | `par3-50-ui-optimized` (PAR) / `par3-50` (Punchh) | `#acaaf1` |
| `quote-block-bar` | `grey-20` | `#dfe1e2` |
| `Effects/modal background` | direct | `rgba(0,0,0,0.6)` |
| `Effects/transparent` | `white` w/ multiply blend | `#ffffff` + `mix-blend-mode: multiply` |

---

## 2. Typography

**Font families:**
- UI: `Manrope` (Google Fonts, variable weight)
- Monospace: `Ubuntu Mono`

All letter-spacing is `0` across every style. No text transforms are defined.

| Style Name | Token Suggestion | Family | Weight | Size | Line Height | CSS `line-height` |
|---|---|---|---|---|---|---|
| `Header/H1` | `text-heading-1` | Manrope | 400 (Regular) | 28px / 1.75rem | 40px | 1.44 |
| `Header/H2` | `text-heading-2` | Manrope | 800 (ExtraBold) | 24px / 1.5rem | 32px | 1.32 |
| `Header/H3` | `text-heading-3` | Manrope | 800 (ExtraBold) | 20px / 1.25rem | 32px | 1.6 |
| `Header/Subtitle` | `text-subtitle` | Manrope | 800 (ExtraBold) | 16px / 1rem | 24px | 1.5 |
| `Body/Big` | `text-body-big` | Manrope | 800 (ExtraBold) | 28px / 1.75rem | 40px | 1.44 |
| `Body/Body 1` | `text-body-1` | Manrope | 400 (Regular) | 16px / 1rem | 24px | 1.5 |
| `Body/Body 1 Emphasized` | `text-body-1-em` | Manrope | 700 (Bold) | 16px / 1rem | 24px | 1.5 |
| `Body/Body 2` | `text-body-2` | Manrope | 400 (Regular) | 14px / 0.875rem | 24px | 1.72 |
| `Body/Body 2 Emphasized` | `text-body-2-em` | Manrope | 800 (ExtraBold) | 14px / 0.875rem | 24px | 1.72 |
| `Body/Caption` | `text-caption` | Manrope | 400 (Regular) | 12px / 0.75rem | 16px | 1.36 |
| `Annotation/Main` | `text-annotation` | Manrope | 400 (Regular) | 12px / 0.75rem | 16px | 1.36 |
| `code` | `text-code` | Ubuntu Mono | 400 (Regular) | 16px / 1rem | 24px | 1.5 |

**CSS-ready declarations:**

```css
/* Header/H1 */
font-family: 'Manrope', sans-serif;
font-size: 1.75rem;     /* 28px */
font-weight: 400;
line-height: 1.44;
letter-spacing: 0;

/* Header/H2 */
font-size: 1.5rem;      /* 24px */
font-weight: 800;
line-height: 1.32;

/* Header/H3 */
font-size: 1.25rem;     /* 20px */
font-weight: 800;
line-height: 1.6;

/* Header/Subtitle */
font-size: 1rem;        /* 16px */
font-weight: 800;
line-height: 1.5;

/* Body/Big */
font-size: 1.75rem;     /* 28px */
font-weight: 800;
line-height: 1.44;

/* Body/Body 1 */
font-size: 1rem;        /* 16px */
font-weight: 400;
line-height: 1.5;

/* Body/Body 1 Emphasized */
font-size: 1rem;
font-weight: 700;
line-height: 1.5;

/* Body/Body 2 */
font-size: 0.875rem;    /* 14px */
font-weight: 400;
line-height: 1.72;

/* Body/Body 2 Emphasized */
font-size: 0.875rem;
font-weight: 800;
line-height: 1.72;

/* Body/Caption & Annotation/Main */
font-size: 0.75rem;     /* 12px */
font-weight: 400;
line-height: 1.36;

/* code */
font-family: 'Ubuntu Mono', monospace;
font-size: 1rem;        /* 16px */
font-weight: 400;
line-height: 1.5;
```

**Issues:**
- `Body/Big` (28px ExtraBold) and `Header/H1` (28px Regular) share the same size but different weights — distinguish token names carefully.
- `Body/Caption` and `Annotation/Main` are **identical** in all properties (12px / Regular / 1.36 lh). They are separate style IDs but visually and technically the same. This is a duplicate.
- No italic variants defined.
- No `text-transform` (e.g. uppercase labels) is codified in the style system.

---

## 3. Spacing Scale

From the `primitives` collection, `spacing/*` namespace. The base unit is **8px**.

| Token | CSS Variable | px | rem | Multiplier |
|---|---|---|---|---|
| `spacing/space-none` | `--spacing/space-none` | 0px | 0rem | 0× |
| `spacing/space-quarter` | `--spacing/space-quarter` | 2px | 0.125rem | 0.25× |
| `spacing/space-half` | `--spacing/space-half` | 4px | 0.25rem | 0.5× |
| `spacing/space-base` | `--spacing/space-base` | 8px | 0.5rem | 1× |
| `spacing/space-double` | `--spacing/space-double` | 16px | 1rem | 2× |
| `spacing/space-triple` | `--spacing/space-triple` | 24px | 1.5rem | 3× |
| `spacing/space-quadruple` | `--spacing/space-quadruple` | 32px | 2rem | 4× |
| `spacing/space-sextuple` | `--spacing/space-sextuple` | 48px | 3rem | 6× |
| `spacing/space-octuple` | `--spacing/space-octuple` | 64px | 4rem | 8× |
| `spacing/space-decuple` | `--spacing/space-decuple` | 80px | 5rem | 10× |

**Scale logic:** 8pt base system. Names express the multiplier in Latin ordinals.

**Grid / Layout Constants** (from grid page — not exposed as variables):

| Name | Value |
|---|---|
| Viewport width | 1440px |
| Header height | 56px |
| Left nav width | 216px |
| Body max-width | 1128px |
| Content margin | 48px |
| Column width | 72px |
| Gutter width | 24px |

**Gaps / Inconsistencies:**
- **5× (40px), 7× (56px), 9× (72px)** are absent. Calculate inline if needed.
- Jump from 4× (32px) → 6× (48px) skips 40px.
- Token names (`sextuple`, `decuple`) are not developer-friendly. Consider aliasing to a numeric or T-shirt scale for consumption.

---

## 4. Border Radius

Border radius values are drawn from the spacing scale. Variable bindings are confirmed for some components but coverage is incomplete — other components hardcode the equivalent numeric value without wiring it to the spacing token.

### 4.1 Confirmed Variable Bindings

| Radius | Spacing Token | CSS Variable | Example Component |
|---|---|---|---|
| `0px` | `spacing/space-none` | `--spacing/space-none` | Button group middle segment |
| `4px` | `spacing/space-half` | `--spacing/space-half` | Inline code |
| `8px` | `spacing/space-base` | `--spacing/space-base` | Buttons, decision tree card |

### 4.2 Hardcoded Values (spacing token not wired in Figma)

| Radius | Nearest spacing token | Example Component | Issue |
|---|---|---|---|
| `2px` | `spacing/space-quarter` | Banners | Correct value, binding absent |
| `12px` | **None — gap in scale** | Tags (standard) | 12px does not exist in the spacing scale |
| `400px` | — | Tags (pill variant) | Intentional pill/full-round shape |

### 4.3 Recommended Token Map

| Token | Value | Used For |
|---|---|---|
| `spacing/space-none` | `0px` | Form inputs, flat containers, modals |
| `spacing/space-quarter` | `2px` | Banners |
| `spacing/space-half` | `4px` | Inline code |
| `spacing/space-base` | `8px` | Buttons |
| — | `12px` | Tags — **falls outside scale; needs a new token** |
| — | `400px` / `9999px` | Tags (pill) |

**Action items:**
1. `12px` (tag radius) has no spacing token backing — scale jumps `8px → 16px`. Add `spacing/space-one-and-half = 12px` or adjust tag radius to `8px` or `16px`.
2. Complete variable bindings on banner and tag components.

---

## 5. Shadows / Effects

All elevation shadows use a single shadow color: `rgba(0,0,0,0.12)`.

### 5.1 Elevation Shadows

| Style Name | Token Suggestion | Direction | CSS `box-shadow` |
|---|---|---|---|
| `Elevation/central` | `shadow-central` | All sides (dropdowns, popovers) | `0px 0px 12px 0px rgba(0,0,0,0.12)` |
| `Elevation/below` | `shadow-below` | Downward (header, floating bars) | `0px 4px 12px 0px rgba(0,0,0,0.12)` |
| `Elevation/above` | `shadow-above` | Upward (save bars, bottom sheets) | `0px -4px 12px 0px rgba(0,0,0,0.12)` |

### 5.2 Focus Ring Effects

These are `INNER_SHADOW` (inset) effects used for keyboard focus and field states. Apply as `box-shadow: inset`.

| Style Name | Token Suggestion | CSS `box-shadow` | Use Case |
|---|---|---|---|
| `Focus/default` | `focus-default` | `inset 0 0 0 1px #000000` | Default (unfocused) field border |
| `Focus/focus` | `focus-active` | `inset 0 0 0 2px #1d5eff` | Keyboard focus state |
| `Focus/error` | `focus-error` | `inset 0 0 0 2px #e8144c` | Field error state |
| `Focus/light` | `focus-light` | `inset 0 0 0 1px #dfe1e2` | Subtle border (e.g. on white bg) |
| `Focus/success` | `focus-success` | `inset 0 0 0 2px #3dc1af` | Field success/valid state |

> **Note:** The focus ring doubles as the interactive field border. `Focus/default` (1px black inset) = unfocused border; `Focus/focus` (2px blue inset) = active focus state. These replace a traditional `border` property.

---

## 6. Themes / Modes

The `tokens` collection has two modes:

| Mode | Description |
|---|---|
| **PAR** | Default. Violet (`par3`) is primary brand, orange (`par5`) is secondary. |
| **Punchh** | Alternate brand. Orange (`par5`) becomes primary, violet (`par3`) becomes secondary. |

**Key differences — PAR vs Punchh:**

| Semantic Role | PAR | Punchh |
|---|---|---|
| Primary button bg | `#5a55e3` (violet) | `#f8931c` (orange) |
| Primary button text | `#ffffff` | `#000000` |
| Secondary button bg | `#f8931c` (orange) | `#6864d1` (violet) |
| Secondary button text | `#000000` | `#ffffff` |
| Checkbox/Chip checked | `#5a55e3` | `#6864d1` |
| Action bar | `#eeeefc` (light violet) | `#fef4e8` (light orange) |
| Left nav active child bg | `par1` (#2f3452) | `par3` (#6864d1) |
| Left nav active child text | `par2-ui-optimized` (#9aa4ff) | `white` |
| Left nav open category text | `par2-ui-optimized` | `par5` (#f8931c) |
| Callout box emphatic bg | `par3-10-ui-optimized` (#eeeefc) | `purple-20` (#dbd3e9) |
| Callout box brand bg | `par3-10-ui-optimized` (#eeeefc) | `par5-10` (#fef4e8) |
| Scroll bar | `#5a55e3` | `#6864d1` |
| Highlighted text bg | `#acaaf1` | `#b3b1e8` |
| Tag neutral fill | `#9aa4ff` | `#8c9fff` |

All other tokens (green, red, yellow, blue-based states) are **identical** between PAR and Punchh.

**Mode switching in CSS:**

```css
:root {
  /* PAR mode (default) */
  --button-primary-default: var(--color-brand-par3-ui-optimized);
  --button-primary-text: var(--color-basic-white);
}

[data-theme="punchh"] {
  --button-primary-default: var(--color-brand-par5);
  --button-primary-text: var(--color-basic-black);
}
```

No component code changes are required when switching themes — only CSS variable overrides at the root level.

---

## 7. Component-Level Tokens

The semantic token layer covers all component-scoped tokens. There is no separate `component/*` namespace — component tokens are named directly by component (e.g. `button/button-primary-default`).

**Full component coverage in the tokens collection:**

`action bar` · `banner` · `button` · `button group` · `card` · `callout box` · `check box` · `chip` · `clay` · `code` · `container` · `context menu` · `data visualization` · `date picker` · `email` · `feedback panel` · `icon` · `left nav` · `line` · `link` · `logo` · `modal` · `onboarding` · `radio button` · `scroll bar` · `side panel` · `skeleton` · `stepper` · `tab` · `table` · `tag` · `text` · `timeline` · `toast` · `tooltip` · `upload`

**Global utility tokens** (not component-scoped):

| Token | Value | Use |
|---|---|---|
| `hover-fill` | `grey-10` (#f4f4f4) | Universal hover background |
| `actively-selected-fill` | `par3-10-ui-optimized` (#eeeefc) | Selected row/item |
| `highlighted-text-background` | `par3-50-ui-optimized` (#acaaf1) | Text highlight |
| `quote-block-bar` | `grey-20` (#dfe1e2) | Blockquote left border |
| `line` | `grey-20` (#dfe1e2) | Dividers |

---

## 8. Naming Conventions

### Pattern

```
[component]/[component]-[element]-[state]
```

**Examples:**
- `button/button-primary-default`
- `text/text-normal-inverse`
- `table/table-row-hover-fill`

### Issues

| Issue | Location | Recommendation |
|---|---|---|
| Typo: `netural` | `tag/tag-netural-text` | Fix to `tag/tag-neutral-text` |
| Typo: `visted` | `link/link-underline-visted-hover` | Fix to `link/link-underline-visited-hover` |
| Misleading alias | `par3` is labeled "Teal color" on canvas but is violet (#6864d1) | Rename canvas label |
| Opaque primitives | `par0`–`par5` have no semantic meaning without context | Consider named aliases: `par0` → `navy`, `par5` → `orange` |
| `Effects/transparent` | Paint style, not a variable | Move to variable for programmatic access |
| Unnested global tokens | `hover-fill`, `actively-selected-fill` have no group prefix | Prefix with `global/` |
| `ui-optimized` suffix | Two versions of same primitive for different render targets | Document clearly: use `ui-optimized` variants for all web implementations |

---

## 9. Token Hierarchy

```
Primitive (raw values)
  └── color/brand/par3-ui-optimized  →  #5a55e3
  └── color/basic/white              →  #ffffff

Semantic (purpose-mapped)
  └── button/button-primary-default  →  alias: color/brand/par3-ui-optimized
  └── button/button-primary-text     →  alias: color/basic/white

Component (consumes semantic tokens)
  └── <Button variant="primary" />
        background: var(--button/button-primary-default)
        color:      var(--button/button-primary-text)
```

**Three-layer example — primary button:**

```
color/brand/par3-ui-optimized (#5a55e3)
        ↓
button/button-primary-default
        ↓
Button[variant=primary] background
```

**Mode switching** happens at the semantic layer only — primitives never change across themes.

---

## 10. Accessibility Notes

### Contrast Ratios (WCAG 2.1 AA: 4.5:1 normal text, 3:1 large text)

| Combination | Foreground | Background | Ratio | Status |
|---|---|---|---|---|
| `text-normal` on white | `#000000` | `#ffffff` | 21:1 | ✅ AAA |
| `text-subdued` on white | `#60696c` | `#ffffff` | ~5.3:1 | ✅ AA |
| Primary btn (PAR): white on `#5a55e3` | `#ffffff` | `#5a55e3` | ~5.2:1 | ✅ AA |
| Primary btn (Punchh): black on `#f8931c` | `#000000` | `#f8931c` | ~9.5:1 | ✅ AAA |
| `text-link` on white | `#1d5eff` | `#ffffff` | ~4.9:1 | ✅ AA |
| `tag-favorable`: black on `#3dc1af` | `#000000` | `#3dc1af` | ~9.9:1 | ✅ AAA |
| `tag-waiting`: black on `#fed766` | `#000000` | `#fed766` | ~15.3:1 | ✅ AAA |
| **`tag-unfavorable`: white on `#e8144c`** | `#ffffff` | `#e8144c` | **~4.4:1** | ⚠️ Fails AA |
| **`toast-danger`: white on `#e8144c`** | `#ffffff` | `#e8144c` | **~4.4:1** | ⚠️ Fails AA |
| `tooltip`: white on `#1f2223` | `#ffffff` | `#1f2223` | ~18:1 | ✅ AAA |

### Other Flags

| Issue | Detail |
|---|---|
| `red-50` (#e8144c) + white text fails AA | Used in `tag-unfavorable` and `toast-danger`. ~4.4:1, just below 4.5:1. Switch to `red-80` (#bc103e) as background, or use black text. |
| No `focus-visible` token | `Focus/focus` covers focus rings but there is no visible-only variant that can be suppressed for mouse users. |
| No `text-disabled` token | Disabled button states use a lightened background, but no explicit disabled text color token exists. |
| No high-contrast mode | Only PAR and Punchh themes. No high-contrast or forced-colors theme defined. |
| `grey-60` (#737e82) is unused | Maps to no semantic token. Contrast on white is ~4.1:1 — below AA. Do not use for body text. |
| Border radius not tokenized | Prevents programmatic enforcement of consistent focus indicator shapes. |

---

## 11. Missing / Unclear

| Item | Status |
|---|---|
| Border radius tokens | Not defined as variables — baked into component geometry. Binding to spacing tokens is partial. |
| `blue-20`, `blue-30`, `blue-80`, `green-20`, `green-60` | Not defined — sparse functional palettes. |
| Spacing at 5×, 7×, 9× (40px, 56px, 72px) | Gaps in scale — no tokens defined. |
| Font weight as numeric variable | Not stored as a variable (assumed: Regular=400, Bold=700, ExtraBold=800 per Manrope spec). |
| Transition / animation tokens | No duration, easing, or motion tokens in any collection. |
| Z-index scale | No z-index tokens defined. |
| Dark mode | Not present. Only PAR and Punchh light themes. |
| `Effects/transparent` | Defined as a paint style (not a variable). Semantics: white with `mix-blend-mode: multiply` creates transparency on colored backgrounds. |
