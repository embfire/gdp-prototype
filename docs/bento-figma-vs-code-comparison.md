# Bento Design System — Figma vs. Code Comparison

**Generated:** 2026-04-13  
**Figma file:** `bento-design-system — Loyalty Platform` (`KWTRKKdRh7m74cqkwO8Fn3`)  
**Codebase:** `/bento-design-system/src/styles/`

---

## TL;DR

The codebase implements the **Punchh brand** (orange primary, violet secondary) as its only compiled theme. The Figma file defines two modes — PAR (violet primary) and Punchh (orange primary) — but no runtime switching mechanism exists in code. Two factual discrepancies exist: a wrong hex value for `green-30` and a wrong font size for `.big`.

---

## 1. Token Delivery Method

| Figma Design Intent | Code Reality |
|---|---|
| Tokens as CSS custom properties (`--color/brand/par0`) | SCSS variables (`$color-brand-par0`) resolved at build time |
| Runtime theme switching between PAR and Punchh | No runtime CSS variables — all values baked into compiled CSS |

The `index.scss` file contains a full commented-out block of CSS custom properties (lines 220–314) showing that CSS variable output was planned but never shipped. All tokens are currently compile-time only.

---

## 2. Theme Switching — Not Implemented

Figma defines two brand modes. The code has one static set of SCSS variables that maps to **Punchh mode**.

| Token | Figma PAR | Figma Punchh | Code | Match |
|---|---|---|---|---|
| `button-primary-default` | `#5a55e3` (par3-ui-opt, violet) | `#f8931c` (par5, orange) | `$color-brand-par5` = `#f8931c` | Punchh ✓ |
| `button-secondary-default` | `#f8931c` (par5, orange) | `#6864d1` (par3, violet) | `$color-brand-par3` = `#6864d1` | Punchh ✓ |
| `checkbox-fill-checked` | `#5a55e3` (par3-ui-opt) | `#6864d1` (par3) | `$color-brand-par3` = `#6864d1` | Punchh ✓ |
| `chip-prominent-fill` | `#5a55e3` (par3-ui-opt) | `#6864d1` (par3) | `$color-brand-par3` = `#6864d1` | Punchh ✓ |
| `left-nav-bg` | `par0` | `par0` | `$color-brand-par0` = `#212438` | Both ✓ |
| `scroll-bar-bar` | `par3-ui-opt` (PAR) / `par3` (Punchh) | — | `$color-brand-par3` = `#6864d1` | Punchh ✓ |

**Impact:** Any PAR-branded deployment would require a separate SCSS build with overridden variable values. There is no way to switch themes at runtime.

---

## 3. `par3-ui-optimized` Variants — Missing in Code

Figma defines screen-optimized color variants with higher vibrancy for digital rendering. The code uses only the base values.

| Figma Token | Figma Hex | Code Variable | Code Hex | Delta |
|---|---|---|---|---|
| `par3-ui-optimized` | `#5a55e3` | `$color-brand-par3` | `#6864d1` | Different hue |
| `par3-50-ui-optimized` | `#acaaf1` | `$color-brand-par3-50` | `#b3b1e8` | Slightly different |
| `par3-120-ui-optimized` | `#2a23d6` | `$color-brand-par3-120` | `#3e39bf` | Different |
| `par2-ui-optimized` | `#9aa4ff` | `$color-brand-par2` | `#8c9fff` | Slightly different |

The code never references `-ui-optimized` tokens. Components using `par3` as a fill render with `#6864d1` rather than the Figma-intended `#5a55e3`.

---

## 4. Color Value Discrepancy — `green-30`

There is an internal conflict within the codebase itself:

| Source | `green-30` value | Visual |
|---|---|---|
| Figma reference | `#7dafa8` | Medium sage green |
| `_colors.scss` (active) | `#b2f2e8` | Very light mint |
| `index.scss` commented CSS vars | `#7DAFA8` | Matches Figma |

The active SCSS value `#b2f2e8` does not match the Figma spec or the commented-out CSS variable block in the same repo. The value appears to be an error — `#b2f2e8` is used only as a skeleton/disabled state color in practice and never as a semantic token, but it could cause unexpected visual output if consumed directly.

**File:** `src/styles/_colors.scss`, line 51

---

## 5. Typography Mismatches

### 5.1 `.big` Font Size

| Source | Size | Weight |
|---|---|---|
| Figma (`Body/Big`) | **28px** | 800 (ExtraBold) |
| Code (`.big`) | **24px** | 800 (ExtraBold) |

The size is wrong in code. File: `src/styles/_typography.scss`, lines 129–134.

### 5.2 Missing Emphasized Variants

Figma defines emphasized body text as distinct styles. The code has no equivalent.

| Figma Style | Size | Weight | Code Equivalent |
|---|---|---|---|
| `Body/Body 1 Emphasized` | 16px | 700 (Bold) | Not defined |
| `Body/Body 2 Emphasized` | 14px | 800 (ExtraBold) | Not defined |

The code only defines `$regular: 400` and `$bold: 800`. There is no `700` weight token, and no `.body1-em` or `.body2-em` class.

### 5.3 Typography — What Matches

| Style | Figma | Code | Status |
|---|---|---|---|
| H1 | 28px / 400 / 144% | 28px / 400 / 144% | ✓ |
| H2 | 24px / 800 / 132% | 24px / 800 / 132% | ✓ |
| H3 | 20px / 800 / 160% | 20px / 800 / 160% | ✓ |
| Subtitle | 16px / 800 / 150% | 16px / 800 / 150% | ✓ |
| Body 1 | 16px / 400 / 150% | 16px / 400 / 150% | ✓ |
| Body 2 | 14px / 400 / 172% | 14px / 400 / 172% | ✓ |
| Caption | 12px / 400 / 136% | 12px / 400 / 136% | ✓ |
| Annotation | 12px / 400 / 136% | 12px / 400 / 136% | ✓ |

---

## 6. Border Radius — Single Value vs. Scale

Figma maps border radius to spacing tokens with multiple stops. The code has one global value.

| Figma Value | Figma Spacing Token | Code Equivalent |
|---|---|---|
| 0px | `spacing/space-none` | Not defined |
| 4px | `spacing/space-half` | Not defined |
| **8px** | `spacing/space-base` | `$border-radius: s(8px)` = 0.5rem ✓ |
| 12px | _(no spacing token)_ | Not defined |

Only the 8px value is implemented. File: `src/styles/variables.scss`, line 3.

---

## 7. Color Palette — What Matches

All primitive hex values match Figma exactly (excluding `green-30` above and the `-ui-optimized` variants).

| Palette | Stops | Status |
|---|---|---|
| Brand (par0–par5) | 6 base + 6 tints/shades | ✓ All correct |
| Grey | grey-10 through grey-100 (10 stops) | ✓ All correct |
| Blue | blue-10, blue-50 | ✓ |
| Green | green-10, green-30 (wrong), green-50, green-80 | ✗ green-30 incorrect |
| Red | red-10, red-30, red-50, red-80 | ✓ |
| Yellow | yellow-10, yellow-50, yellow-60, yellow-80 | ✓ |
| Purple | purple-20, purple-50 | ✓ |
| Basic | black, white | ✓ |

---

## 8. Semantic Tokens — What Matches

The following semantic mappings are correctly implemented in `index.scss`:

| Category | Tokens | Status |
|---|---|---|
| Text | text-normal, text-subdued, text-link, text-danger, text-annotation, text-visited | ✓ All correct |
| Icons | icon-normal, icon-subdued, icon-link, icon-danger, icon-brand | ✓ |
| Buttons | primary/secondary/danger (default, hover, disabled) | ✓ Punchh values |
| Cards | card-border, card-border-empty, card-fill | ✓ |
| Chips | chip-neutral-fill/contents, chip-prominent-fill/contents | ✓ Punchh values |
| Tags | favorable, unfavorable, neutral, waiting, finished | ✓ |
| Toasts | success, danger, info (fill + text) | ✓ |
| Banners | tip, informational, warning | ✓ |
| Left Nav | bg, hover, selected states | ✓ |
| Shadows | central, below, above | ✓ |

---

## 9. Tokens in Code Not Documented in Figma Reference

These are implemented in code but absent from the Figma design file (or not captured in the reference doc):

### Focus Effects (`src/styles/_focus-effects.scss`)

| Variable | Value | Usage |
|---|---|---|
| `$focus-default` | `0px 0px 0px 1px #000 inset` | Default keyboard focus ring |
| `$focus-primary` | `0px 0px 0px 2px #1d5eff inset` | Primary/active focus ring |
| `$focus-error` | `0px 0px 0px 2px #e8144c inset` | Error state focus ring |
| `$focus-light` | `0px 0px 0px 1px #dfe1e2 inset` | Light background focus ring |
| `$focus-success` | `0px 0px 0px 2px #3dc1af inset` | Success state focus ring |

### Z-Index Scale (`src/styles/variables.scss`)

| Variable | Value |
|---|---|
| `$normal-z-index` | 1 |
| `$upper-z-index` | 101 |
| `$special-z-index` | 999 |
| `$super-z-index` | 1001 |
| `$max-z-index` | 10000 |

### Legacy / Deprecated Color System (`src/styles/_colors.scss`, lines 136–227)

A full legacy color system remains in the file, marked `// Deprecated`. It uses semantic names like `$primary-color`, `$teal`, `$tangerine`, `$guava`, `$eggplant` that predate the `par0`–`par5` system. These should not be used for new development.

---

## 10. Priority Issues

| Priority | Issue | File | Line |
|---|---|---|---|
| High | `green-30` hex wrong: `#b2f2e8` in code vs `#7dafa8` in Figma | `_colors.scss` | 51 |
| High | `.big` font size: 24px in code vs 28px in Figma | `_typography.scss` | 129 |
| Medium | No PAR theme — only Punchh is implemented (no runtime switching) | `index.scss` | — |
| Medium | `par3-ui-optimized` variants missing — renders `#6864d1` instead of `#5a55e3` | `_colors.scss` | — |
| Low | No `body-1-em` / `body-2-em` typography styles (weight:700 variant missing) | `_typography.scss` | — |
| Low | Only 8px border-radius defined — 0px, 4px, 12px stops from Figma absent | `variables.scss` | 3 |
| Low | Focus effects and z-index scale not reflected in Figma | — | — |
| Info | CSS custom properties commented out — token delivery is compile-time only | `index.scss` | 220 |
