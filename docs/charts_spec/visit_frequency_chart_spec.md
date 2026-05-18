# Visit Frequency Chart — Implementation Spec

**Audience:** Engineering — connecting the prototype to real data
**Last updated:** 2026-05-18
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (dashboard card) and `[beta/dashboard-visit-frequency.html](../../beta/dashboard-visit-frequency.html)` (detail page)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what data is needed, how visit counts and buckets are calculated, what filters do, and what the detail page must include**.

---

## 1. Overview

A **visit-count distribution** for identified guests in the selected date range: how many guests had exactly 1 visit, 2 visits, 3–5 visits, and so on. Each guest is placed in **exactly one** bucket based on their visit count in the window.

The card also surfaces a **hero KPI — average visits per guest** (mean visit count across guests with ≥1 visit in the window). The histogram answers *"how is the base spread across frequency tiers?"*; the hero answers *"on average, how often did they show up?"*

Prototype presentation:

| Surface | Visualization |
| ------- | ------------- |
| **Dashboard card** | Grouped column histogram — guest count per bucket, **current period** (solid) vs **previous period** (striped) |
| **Detail page — chart card** | Same histogram with taller plot, optional **breakdown dropdown**, and click → context menu |
| **Detail page — table** | One row per bucket; columns swap with breakdown mode |

This chart is **not** the legacy analytics-retention **Visit Frequency trend** (line chart of average frequency over time). It is also **not** the separate library card `avg-visits-per-guest` (scalar KPI only). See § 10 Open Questions.

---

## 2. Metric Definitions

These rules are the source of truth. Bucket counts and the hero average must reconcile to the same guest sets.


| Concept | Definition |
| ------- | ---------- |
| **Visit** | One guest-day with at least one qualifying transaction — dedupe by `(guest_id, calendar_day)`. Two transactions on the same day by the same guest count as one visit. Align with Guest Repeat Rate and Punchh QBR visit semantics unless PM approves a different dedupe key (see § 10). |
| **Visit count (per guest)** | Number of visits that guest had **within the selected date range** (after global filters). Guests with zero visits in the window are excluded from the distribution and from the hero denominator. |
| **Visit-count bucket** | Discrete tier assigned from visit count using the fixed boundaries in § 2.1. Each guest maps to exactly one bucket. |
| **Guests in bucket** | Count of identified guests whose visit count in the window falls in that bucket. |
| **Average visits per guest (hero)** | `Σ (visit_count per guest) ÷ (guests with ≥1 visit in window)` — equivalent to `total_visits ÷ total_guests` over the same filtered population. **Not** the mean of bucket midpoints. |
| **Previous period** | Comparison window of equal length immediately preceding the selected range (same semantics as other dashboard cards). Used for the striped bars, hero delta, and table prev columns — not rendered as a third dimension alongside loyalty breakdown. |

### 2.1 Bucket boundaries

Fixed five buckets — sourced from Punchh QBR frequency cohorts and customer interview language. Reuse these labels anywhere a "visits per guest" distribution appears:


| Bucket label | Visit count in window |
| ------------ | --------------------- |
| `1 visit` | 1 |
| `2 visits` | 2 |
| `3-5 visits` | 3 ≤ n ≤ 5 |
| `6-10 visits` | 6 ≤ n ≤ 10 |
| `11+ visits` | n ≥ 11 |

Order on the X-axis is always low → high frequency (left to right).

### Notes for implementation

- **Identified guests only.** Anonymous traffic is excluded from every bucket and from the hero.
- **Values are guest counts**, not visit counts. The Y-axis and table show how many guests sit in each bucket; tooltips also show each bucket's **share of guests** (`bucket_count ÷ sum(all buckets)`), separately for current and previous period when both series are visible.
- **Prototype mock scaling.** Reference data stores counts in **thousands** (e.g. `320` = 320K guests) for compact chart labels (`fmtVK`). Production APIs should return **integer guest counts**; the client (or API) applies K/M formatting only for display.
- **Hardcoded bucket boundaries for beta**, configurable per-tenant at GA. Do not embed boundaries in chart rendering logic beyond a shared config object.
- **Loyalty breakdown (detail only).** Splits the **current period** guest count per bucket into loyalty members vs. non-members. It does not add previous-period bars — four bars per bucket would be unreadable. See § 8.

---

## 3. Hero Metric

The card's primary KPI is **average visits per guest** for the current (filtered) date range.

- **Why the average and not a bucket count:** operators use the mean as a single stickiness index; the histogram shows *where* guests pile up. Both derive from the same underlying visit counts.
- **Comparison:** vs. the same metric over the **previous period** of equal length. Prototype: `2.4` with pill `+14.3%` and period text `2.1 visits prev period`. Detail page adds guest-base context: `2.1 visits prev period · 847K identified guests` (total guests with ≥1 visit in the current window).
- **Pill semantics — standard (non-inverse).** Higher average frequency is better:
  - Average **up** vs. prev → green pill (`chart-card__metric-pill--up`)
  - Average **down** vs. prev → red pill (`chart-card__metric-pill--down`)
- **Delta unit — relative percent change**, not percentage points: `(currentAvg − prevAvg) / prevAvg × 100`, displayed as `+14.3%`.
- **Format:** one decimal on the hero (e.g. `2.4`). Table uses full-precision integers for bucket counts.

---

## 4. Required Data Shape

### Distribution — total (dashboard + detail default)

One row per bucket for the selected window, with comparison counts:

```ts
type VisitFrequencyBucketRow = {
  bucket: string;       // e.g. "3-5 visits" — must match § 2.1 labels
  current: number;      // guest count, current period (integer; prototype uses K-scale mock)
  prev: number;         // guest count, previous period
};
```

### Distribution — loyalty breakdown (detail page only)

One row per bucket for the **current period** only:

```ts
type VisitFrequencyLoyaltyBucketRow = {
  bucket: string;
  loyalty: number;      // guests in bucket who are loyalty members
  nonLoyalty: number;   // guests in bucket who are not loyalty members
  // loyalty + nonLoyalty should equal the "current" count for that bucket in total mode
};
```

### Hero summary (dashboard card + detail)

Return with the distribution payload (or as a separate summary object):

```ts
type VisitFrequencySummary = {
  avgVisitsCurrent: number;   // e.g. 2.4
  avgVisitsPrev: number;      // e.g. 2.1
  identifiedGuestCount: number; // guests with ≥1 visit in current window (e.g. 847_000)
};
```

### Aggregation contract

- Server computes visit counts, bucket assignment, and hero average **after** applying global filters (§ 6).
- The chart does **not** derive buckets client-side from raw transactions.
- Bucket rows should always include **all five buckets**, even when count is zero (keeps X-axis stable).
- For comparison: when "Compare to" is active, populate `prev` on each row and summary prev fields. When comparison is off, omit `prev` or return null and hide the striped series, comparison portions of the tooltip, hero pill, and prev table column.
- **Loyalty breakdown** is a separate dataset (or `breakdown=loyalty` param). Do not approximate loyalty split by scaling total counts client-side.

---

## 5. Chart Specification


| Property | Value |
| -------- | ----- |
| Library | AG Charts (Community v13) |
| Type | Grouped vertical column (`type: 'bar'`, shared `xKey: 'bucket'`) |
| X-axis | Category — five bucket labels |
| Y-axis | Guest count, starts at 0 |
| Series (total mode) | `prev` first (renders left in group): pattern fill / striped legend; then `current` solid indigo `#5A55E3` |
| Series (loyalty breakdown) | `loyalty` indigo `#5A55E3`, `nonLoyalty` vermilion `#FF6600` — both solid, current period only |
| Pattern fill for `prev` | `{ type: 'pattern', pattern: 'forward-slanted-lines', stroke: '#5A55E3', backgroundFill: '#ffffff' }` — `aria.decal` does not apply to bars in v13 community |
| Native AG Charts tooltip | Disabled on every series — manual bucket tooltip |
| Bar styling | `cornerRadius: 4` |
| Card layout | Flex-fill required — `.chart-card[data-metric-id="visit-frequency"]` in `beta.css` so bucket labels are not clipped |

Y-axis `min` / `max` / `interval.values` in the prototype are **placeholder** (dashboard: 0–360K with ticks at 0/100/200/300; detail: finer ticks 0–350). **Replace with bounds derived from the filtered data** (suggested: round max up to a sensible K increment with ~10% headroom).

Dashboard uses coarser Y ticks; detail uses more gridlines — same data, different axis density only.

---

## 6. Filters

Inherited from the global dashboard filter bar — see `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters). Every filter currently defined globally **applies to this chart**:


| Filter | Options | Applies | Notes |
| ------ | ------- | ------- | ----- |
| **Date range** | 7D, 30D, 90D, 12M, YTD, Custom | Yes — full support | Defines the window in which visits are counted and buckets are assigned. Prototype defaults to **90D** on the detail page. No minimum-range constraint on this chart in the prototype (unlike Retention cohort or Guest repeat rate). |
| **Compare to** | Previous period | Yes — striped series + hero | When disabled: hide `prev` bars, striped legend entry, tooltip prev rows and delta block, hero pill, and table prev/Δ columns. Detail compare dropdown also lists "Previous year" and "No comparison" as stubs — wire when PM defines behavior. |
| **Stores and Store groups** | Single or multi-store / store group | Yes | Applied server-side before visit counting. Confirm whether only transactions **at** filtered locations count toward visit count, or whether guest inclusion uses any visit at those locations (§ 10). |
| **Loyalty / non-loyalty** | Loyalty program members / non-members | Yes | Restricts which guests enter the distribution and hero. **Independent** of the detail breakdown "By loyalty status" — see below. |
| **Segments** | Any saved guest segment | Yes | Restricts numerator (guests per bucket) and hero denominator to segment members. |

### Global loyalty filter vs. detail breakdown — important

These are related but not redundant:

- **Global loyalty filter:** limits the entire guest population before bucketing.
- **Detail breakdown "By loyalty status":** splits each bucket's **current** count into loyalty vs. non-loyalty for guests already in scope.

If the global filter is set to "Loyalty members only", the loyalty breakdown view is degenerate (non-loyalty ≈ 0). Still return valid rows; consider hiding the breakdown option in UI when the global filter makes it meaningless — product call (§ 10).

### No minimum-range indicator

`CHART_CONSTRAINTS` in `beta/index.html` does **not** include `visit-frequency`. The card always renders for the selected range without a "Showing 90D minimum" banner.

---

## 7. Dashboard Card (`beta/index.html`)

Compact card in the 2-column dashboard grid (`metric-id`: `visit-frequency`):

- **Header:** title `Visit frequency` + subtitle `Guest distribution across visit-count buckets`. Header click → `dashboard-visit-frequency.html`.
- **Hero:** average visits (one decimal) + `%` delta pill + `2.1 visits prev period` (no guest-count suffix on the card).
- **Legend:** toggleable `This period` / `Previous period`. At least one series must remain visible.
- **Chart:** grouped column histogram; manual hover tooltip per bucket (§ 9). **No** breakdown dropdown and **no** click → context menu on the dashboard.
- **Library entry:** `ALL_METRICS` includes `visit-frequency`; in default layout at grid position `{ x: 0, y: 2 }`.

---

## 8. Detail Page (`beta/dashboard-visit-frequency.html`)

Layout: breadcrumb → title bar (h1 + Help) → global filter bar → chart card → data table → chart-point context menu.

### Chart card

- Same metric definitions and bucket labels as the dashboard.
- **Breakdown dropdown** (header): `Total` · `By loyalty status`.
  - **Total:** `current` vs `prev` grouped bars (same as dashboard).
  - **By loyalty status:** `loyalty` vs `nonLoyalty` for current period only; legend and table headers swap; tooltip omits period-over-period delta block.
- Taller plot (`.chart-card__placeholder--detail`).
- Hero period line includes identified guest count (see § 3).
- **Click → context menu** on the chart plot (View users / Create segment / Ask Ava) — bucket-level, not per-bar series. See § 9.

### Data table

Headers are **dynamic** — `renderTableHead()` rewrites `<thead>` when breakdown changes.

**Total breakdown** (one row per bucket):


| Column | Format | Notes |
| ------ | ------ | ----- |
| Bucket | `3-5 visits` | Left-aligned |
| This period | Integer, comma-separated (e.g. `180,412`) | Right-aligned. Full precision, not K-shorthand |
| Previous period | Integer | Right-aligned |
| Δ | Signed integer (e.g. `+15,203`) | Right-aligned |
| Δ% | Pill | Relative change vs. previous period count: `(current − prev) / prev × 100`. Green/red pill per `dashboard_beta_ux` |

**Loyalty breakdown:**


| Column | Format | Notes |
| ------ | ------ | ----- |
| Bucket | Label | Left-aligned |
| Loyalty | Integer guest count | Right-aligned |
| Non-loyalty | Integer guest count | Right-aligned |
| Total | `loyalty + nonLoyalty` | Right-aligned |
| Loyalty share | Percent pill | `loyalty ÷ total × 100`, one decimal. Prototype tints green if ≥ 50%, red otherwise — display convention only |

- Five buckets → single page; pagination chrome is present but disabled (matches prototype).
- Filter or breakdown changes refetch and re-render chart + table.

---

## 9. Interactions

### Hover → Tooltip (dashboard + detail)

Manual implementation (`initVisitFrequencyChart` / `buildTooltip` in reference files).

- Snap to nearest bucket on X: `idx = floor(relX × bucketCount)`.
- Tooltip header: bucket label (e.g. `3-5 visits`).
- Body rows per **visible** series: marker + series name + `fmtVK(count) · share%` where share is that series' count ÷ sum of that series across all buckets.
- **Total mode only:** when both `current` and `prev` are visible, show a `vs. previous period` delta pill — relative % change for that bucket: `(current − prev) / prev × 100`.
- Hidden series (legend toggle) omitted from tooltip.
- Plot bounds: `VF_PLOT_LEFT ≈ 38`, `VF_PLOT_RIGHT_PAD = 8`, `VF_X_AXIS_HEIGHT = 28` in prototype — use layout metrics from the chart in production.

### Click → Context menu (detail page only)

Categorical adaptation of the chart-point menu pattern — see `[dashboard_beta_ux.md` § Click → Context Menu](../dashboard_beta_ux.md#click--context-menu) and `[analytics_page_patterns.md](../../analytics_page_patterns.md)` § Histogram / Distribution Charts.

- Click inside plot area → menu anchored near cursor, snapped to nearest bucket.
- Menu header: bucket label + guest count (`current` in total mode; `loyalty + nonLoyalty` in loyalty breakdown).
- Color dot stays solid (bucket-level drill-in, not series-specific).
- `pointMenuAnchor` holds the snapped bucket row; `onPointMenuAction(action)` is stubbed — wire to guest list / segment / Ava flows.
- No context menu on the dashboard card.

### Legend toggle

Same guard as other dual-series cards: cannot hide both series; at least one must remain visible.

---

## 10. Open Questions for PM

1. **Visit dedupe key.** Confirm guest-day dedupe matches Punchh QBR frequency cohorts and Guest Repeat Rate.
2. **Store filter semantics.** When a location filter is applied, do visits count only at filtered stores, or does the guest enter the chart if they transacted anywhere but bucket visits are store-scoped?
3. **Lifetime vs. window visit count.** Prototype counts visits **in the selected range** only. Should any bucket use lifetime visit count instead (would change the question the chart answers)?
4. **Bucket boundary configurability.** Are the five QBR buckets fixed for GA, or tenant-configurable?
5. **Hero vs. histogram consistency.** Should the hero average appear on the dashboard card only, or also as a reference line on the histogram?
6. **Global loyalty filter + breakdown.** Hide "By loyalty status" when global loyalty filter is active?
7. **Parity with `avg-visits-per-guest` library card.** That card is a separate metric ID with no dedicated detail page — confirm whether it should redirect here or remain a scalar-only KPI.
8. **Differentiation from retention-page trend.** Legacy `analytics-retention.html` shows a line chart of average visit frequency over time — confirm both can coexist and how cross-linking should work.

---

## 11. Reference Files

- **Dashboard UX patterns (cards, filters, detail page, table columns)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Histogram / distribution conventions (buckets, pattern fill, flex-fill, context menu)** — `[analytics_page_patterns.md](../../analytics_page_patterns.md)` § Histogram / Distribution Charts
- **PAG / product context** — `[docs/analytics_proposition.md](../analytics_proposition.md)` (Visit Frequency #2 in PAG exercise; Guests > Retention page)
- **Reference implementation — dashboard card** — `[beta/index.html](../../beta/index.html)` (search `visit-frequency`, `VISIT_FREQ_DATA`, `initVisitFrequencyChart`)
- **Reference implementation — detail page** — `[beta/dashboard-visit-frequency.html](../../beta/dashboard-visit-frequency.html)` (search `VISIT_FREQ_TOTAL_DATA`, `VISIT_FREQ_LOYALTY_DATA`, `BREAKDOWN_CONFIG`, `selectBreakdown`)
- **Card layout CSS** — `[beta/beta.css](../../beta/beta.css)` (search `visit-frequency`, `#chart-area-visit-frequency`)
- **Sibling spec (breakdown-dropdown pattern)** — `[dashboard_loyalty_spend_lift_chart_spec.md](./dashboard_loyalty_spend_lift_chart_spec.md)`
