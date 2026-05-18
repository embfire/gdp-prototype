# Dashboard Customize — Implementation Spec

**Audience:** Engineering — wiring customize mode and layout persistence in production
**Last updated:** 2026-05-17
**Reference implementation:** `[beta/index.html](../../beta/index.html)` (search `enterCustomizeMode`, `ALL_METRICS`, `DEFAULT_LAYOUT`, `startSidebarDrag`)

> Visual treatment, copy, and exact pixel values are not normative — read them off the HTML/CSS. This doc covers **what the customize feature does, what data to persist, catalog rules, grid placement, and how add/remove/reorder interacts with chart widgets**.

---

## 1. Overview

The Guest360 dashboard is a **2-column grid of chart cards**. In normal (view) mode the user scans metrics and opens detail pages. In **Customize** mode the user edits **which metrics appear and where** — without changing metric definitions, filters, or chart math.

Customize mode supports three operations:

1. **Reorder** — drag cards already on the grid (in-grid drag).
2. **Add** — drag a metric from the left **Metrics** library onto the grid.
3. **Remove** — click the per-card remove control; the metric returns to the library.

Changes are held in memory until the user clicks **Save** (persist layout) or **Cancel** (restore the layout snapshot taken at entry). The prototype persists to `localStorage`; production should persist **per user** via a settings API.

Customize changes **layout only**. Each card, once placed, uses the same data contracts, filters, hero metrics, and drill-down behavior defined in its chart spec (e.g. `[guest_lifecycle_chart_spec.md](./guest_lifecycle_chart_spec.md)`). See `[customizable_dashboard.md](../customizable_dashboard.md)` for product rationale (curated library, role presets, phasing).

---

## 2. Metric Catalog

Users do not build custom metrics. They pick from a **closed catalog** of dashboard widgets. Each catalog entry maps 1:1 to a `metricId` used in layout persistence and chart mounting.

### Catalog rules

- **One instance per metric per dashboard.** A metric already on the grid must not appear in the library list. Adding the same `metricId` twice is invalid.
- **Catalog is server-driven in production.** The client should not hardcode availability; the API returns metrics the tenant can use (product-line gating, feature flags). The prototype hardcodes `ALL_METRICS` for demo purposes.
- **No freeform widgets.** Descriptions and calculation logic live in each chart spec, not in customize.

### Beta catalog (14 metrics)

| `metricId` | Display title | Domain (library grouping) | Chart spec | Detail route |
| ---------- | ------------- | ------------------------- | ---------- | ------------ |
| `total-guests` | Total guests | Guests | [total_guests_chart_spec.md](./total_guests_chart_spec.md) | `dashboard-total-guests` |
| `new-guest-acquisition` | New guest acquisition | Guests | [dashboard_new_guest_acquisition_chart_spec.md](./dashboard_new_guest_acquisition_chart_spec.md) | `dashboard-new-guest-acquisition` |
| `guest-lifecycle-breakdown` | Guest lifecycle breakdown | Guests | [guest_lifecycle_chart_spec.md](./guest_lifecycle_chart_spec.md) | `dashboard-guest-lifecycle` |
| `retention-cohort` | Retention cohort | Retention | [retention_cohort_chart_spec.md](./retention_cohort_chart_spec.md) | `dashboard-retention-cohort` |
| `reachability` | Reachability | Guests | [reachability_chart_spec.md](./reachability_chart_spec.md) | `dashboard-reachability` |
| `visit-frequency` | Visit frequency | Retention | — | `dashboard-visit-frequency` |
| `loyalty-spend-lift` | Loyalty spend lift | Revenue | [dashboard_loyalty_spend_lift_chart_spec.md](./dashboard_loyalty_spend_lift_chart_spec.md) | `dashboard-loyalty-spend-lift` |
| `guest-repeat-rate` | Guest repeat rate | Retention | — | generic detail fallback |
| `avg-days-between-visits` | Average days between visits | Retention | — | generic detail fallback |
| `loyalty-penetration` | Loyalty penetration | Guests | — | generic detail fallback |
| `active-guests` | Active guests | Guests | [active_guests_chart_spec.md](./active_guests_chart_spec.md) | `dashboard-active-guests` |
| `avg-order-value` | Average order value | Revenue | — | generic detail fallback |
| `return-visit-funnel` | Return visit funnel | Retention | — | generic detail fallback |
| `avg-visits-per-guest` | Average visits per guest | Retention | — | generic detail fallback |

Rows without a chart spec file still need widget implementations before they can ship; customize only stores their `metricId` in the layout.

### Future catalog (not in beta prototype)

`[customizable_dashboard.md](../customizable_dashboard.md)` describes additional domains (Menu, Locations, Campaigns, Ava). When those cards ship, extend the catalog API — do not change the layout snapshot shape.

---

## 3. Layout Model

### Grid

| Property | Value | Notes |
| -------- | ----- | ----- |
| Columns | 12 (logical) | Each card uses `w: 6` → **2 cards per row** |
| Card width | `w: 6` | Fixed in beta; no user resize |
| Card height | `h: 1` | One row unit; row height is fixed (~467px including margins in prototype) |
| Column positions | `x: 0` (left) or `x: 6` (right) | No other `x` values in beta |
| Row index | `y: 0, 1, 2, …` | 0-based; increases downward |
| Compaction | `float: false` | Cards pack upward; no floating gaps after remove |
| Resize | Disabled | `2×1` wide cards are **out of scope** for beta (see § 10) |

### Default layout (new user / no saved layout)

Used when the user has no saved layout and has not chosen a role preset:

```json
[
  { "metricId": "total-guests",              "x": 0, "y": 0 },
  { "metricId": "guest-lifecycle-breakdown", "x": 6, "y": 0 },
  { "metricId": "retention-cohort",          "x": 0, "y": 1 },
  { "metricId": "reachability",              "x": 6, "y": 1 },
  { "metricId": "visit-frequency",           "x": 0, "y": 2 },
  { "metricId": "new-guest-acquisition",     "x": 6, "y": 2 },
  { "metricId": "loyalty-spend-lift",        "x": 0, "y": 3 }
]
```

Seven cards; the other seven catalog metrics start in the library only.

### Placement invariants

- Every saved item must reference a `metricId` present in the catalog **and** allowed for the tenant.
- At most **one** entry per `metricId`.
- `x` must be `0` or `6`; `y` must be a non-negative integer.
- Ordering is fully determined by `(y, x)` — sort by `y` ascending, then `x` ascending, for serial render.
- **Empty dashboard** is allowed in the prototype (user can remove all cards). Confirm with PM whether production enforces a minimum (e.g. at least one card).

### Maximum cards

`[dashboard_beta_ux.md](../dashboard_beta_ux.md)` states up to **14** charts (the full catalog size). The prototype does not enforce a cap. If product wants a lower limit (e.g. 12), enforce on Save in the API and disable library drag when at cap.

---

## 4. Required Data Shape

### Layout snapshot (persisted)

Minimal, versioned document — framework-agnostic:

```ts
type DashboardLayoutV1 = {
  version: 1;
  items: DashboardLayoutItem[];
};

type DashboardLayoutItem = {
  metricId: string;  // stable key, matches catalog
  x: 0 | 6;        // column
  y: number;       // row index, >= 0
};
```

**Do not persist** chart data, filter state, or AG Charts instances — only `metricId` + grid coordinates.

Prototype storage key: `g360-dashboard-layout-v7` (bump suffix when the schema changes to invalidate stale clients).

### Catalog API (production)

```ts
type DashboardMetricCatalogEntry = {
  metricId: string;
  title: string;
  subtitle?: string;       // card subtitle; optional if derived server-side
  domain: string;          // e.g. "guests" | "retention" | "revenue" — for library grouping
  description?: string;  // one line for library tooltip / future preview
  enabled: boolean;        // false = hidden (product line / flag)
  unavailableReason?: string; // shown when disabled, e.g. "Requires PAR Ordering"
};
```

`GET /api/dashboard/metrics` → `DashboardMetricCatalogEntry[]`

### Layout API (production)

```ts
// GET — load on dashboard mount
GET /api/dashboard/layout
→ DashboardLayoutV1 | null   // null → use default for user's role

// PUT — on Save
PUT /api/dashboard/layout
body: DashboardLayoutV1
→ DashboardLayoutV1

// Optional: role presets
GET /api/dashboard/layout/presets/{presetId}
→ DashboardLayoutV1
```

**Cancel** does not call the API; it discards in-memory edits and re-renders from the last loaded snapshot (or re-fetches GET).

### Validation (server-side on PUT)

- Reject unknown `metricId`.
- Reject duplicate `metricId`.
- Reject disabled metrics for the tenant.
- Reject invalid `x` / `y`.
- Optionally reject `items.length > MAX_CARDS`.

---

## 5. Mode State Machine

| State | Grid drag | Library | Filter bar | Card header click | Remove btn | Save / Cancel bar |
| ----- | --------- | ------- | ---------- | ----------------- | ---------- | ----------------- |
| **View** | Off | Hidden | Visible | Navigate to detail page | Hidden | Hidden |
| **Customize** | On (in-grid) | Visible (metrics not on grid) | Hidden | No navigation | Visible | Visible |

### Enter customize

1. Snapshot current layout to `originalLayout` (in memory).
2. Set UI mode flag (prototype: `app-shell--customize` on root).
3. Enable grid drag.
4. Build library list = catalog minus `metricId`s on grid.
5. Show Save / Cancel action bar.

### Save

1. Read grid positions → `DashboardLayoutV1`.
2. `PUT` layout API (production) or `localStorage` (prototype).
3. Exit customize (§ 5 exit).

### Cancel

1. `removeAll` grid widgets.
2. Re-mount cards from `originalLayout` snapshot (do not rely on grid engine undo).
3. Exit customize.

### Exit customize (shared)

1. Disable grid drag.
2. Clear mode flag and hide action bar.
3. Clear `originalLayout`.
4. Re-show filter bar; restore view-mode interactions.

**Session edits are ephemeral until Save.** Filter changes made before entering customize are unchanged; filter bar is hidden during customize so the user cannot change filters mid-edit.

---

## 6. Filters

Customize does **not** define filter semantics — see each chart spec and `[dashboard_beta_ux.md` § Global Filters](../dashboard_beta_ux.md#global-filters).

| Concern | Behavior |
| ------- | -------- |
| Filter bar in customize | **Hidden** (prototype). User cannot change date range / compare / store / segment while editing layout. |
| Filters on Save | Unchanged from pre-customize session. |
| New card added mid-customize | On mount, card should read **current** global filter state (prototype calls `applyFilterCompatibility(currentDateRange)` in `addCardToGrid`). |
| Per-card filter notices | Still driven by chart-specific rules (e.g. cohort min range). Notices apply once the card is mounted; hidden filter bar does not recalculate until return to view mode unless you explicitly refetch on exit. |

**Recommendation for production:** On exiting customize (Save or Cancel), re-run the same filter-application path as a global filter change so all visible cards stay consistent.

---

## 7. View Mode (Dashboard)

Behavior unchanged by customize except **which** cards render:

- **Header click** → navigate to detail page for that `metricId` (suppress when `customize` mode active).
- **Global filters** → apply to all mounted cards per chart specs.
- **Overflow menu** (Export, Ask Ava, etc.) → per chart; visible in view mode only.
- **Data loading** → each widget fetches (or reads cache) independently; layout endpoint does not return metric values.

Detail page routing: map `metricId` → route; unknown ids fall back to generic chart detail (see `openChartDetail` in `beta/index.html`).

---

## 8. Customize Mode — Add / Remove / Reorder

### In-grid reorder

- Drag handle: entire card surface (`.chart-card`), with `cancel` selectors for buttons, menus, remove control.
- Implemented via grid library (GridStack in prototype).
- `float: false` so removed cards do not leave holes.

### Remove

1. User clicks remove on card.
2. Destroy chart instance and listeners for that widget (see § 9).
3. Remove grid item.
4. Add `metricId` back to library list.

### Add (library → grid)

1. User drags a library item over the grid.
2. Drop target resolves to `(x, y)` from cursor position: left half → `x: 0`, right half → `x: 6`; `y = floor(offsetY / rowHeight)`.
3. **Insert-and-shift:** before inserting, increment `y` by 1 for every existing card with `y >= target.y` (process rows descending to avoid collisions). Then mount new card at `(x, y)`.
4. Remove item from library DOM/list.
5. Mount widget + fetch data; optional brief “added” affordance on the card.

**Why insert-and-shift:** With compaction but without live collision preview, dropping at row *N* must push existing row *N* downward; otherwise the engine places the new card in the next free slot, not where the user aimed.

### Sidebar → grid drag (implementation note)

The prototype uses a **manual** mousedown/mousemove/mouseup pipeline for library drops because GridStack v10 `acceptWidgets` did not register reliably in the app shell. Production may use native GridStack external drops if `dropover` events fire in the real framework — that yields live card shifting during hover. See `[customize_mode_dashboard.md](./customize_mode_dashboard.md) § Path A / Path B` for diagnostics and fallback algorithms (reference only; not normative for product behavior).

### Duplicate prevention

- Library excludes on-grid metrics.
- Server rejects duplicate `metricId` on Save.
- Client should not offer add for metrics already placed.

---

## 9. Widget Lifecycle

Each grid cell mounts a **dashboard widget** bound to one `metricId`.

| Event | Required action |
| ----- | ---------------- |
| **Mount** (initial load, add card, cancel-restore) | Create widget; fetch data using current global filters; init chart if applicable |
| **Remove** | `chart.destroy()` (AG Charts), remove tooltips/listeners, remove DOM node |
| **Reorder** | Prefer **move** existing component instance; do not destroy/recreate unless required |
| **Save** | No remount — positions already updated |
| **Cancel** | Tear down all widgets and remount from `originalLayout` |

Prototype only destroys chart instances explicitly for some metrics in `removeCard` (`total-guests`, `guest-lifecycle-breakdown`, `reachability`, `new-guest-acquisition`, `loyalty-spend-lift`). Production should use a **single widget registry** keyed by `metricId` so every chart type cleans up on remove.

### Filter compatibility on mount

Cards that do not support the current date range show an in-card notice (e.g. “Showing 30D minimum”) per `[dashboard_beta_ux.md` § Filter compatibility](../dashboard_beta_ux.md#filter-compatibility-per-chart). Mounting a card during customize should register it for the same notice logic used in view mode.

---

## 10. Interactions

### View mode

| User action | Result |
| ----------- | ------ |
| Click **Customize** | Enter customize mode (§ 5) |
| Click card header | Open detail page for `metricId` |
| Change global filter | Refetch / re-render all mounted cards |

### Customize mode

| User action | Result |
| ----------- | ------ |
| Drag card | Reorder within grid |
| Drag library metric onto grid | Add card at drop cell; shift rows below |
| Drop library metric outside grid | No-op |
| Click remove | Remove card; return metric to library |
| Click card header | No navigation |
| Click **Save** | Persist layout; exit customize |
| Click **Cancel** | Restore `originalLayout`; exit customize |

### Accessibility (production)

Prototype is mouse-first. Production should specify keyboard paths for reorder, add from library, remove, Save, and Cancel (tracked in § 11).

---

## 11. Open Questions for PM

1. **Persistence scope:** Per-user only at launch, or org-level default layouts (Phase 2 in `[customizable_dashboard.md](../customizable_dashboard.md)`)?
2. **Role presets:** Ship Executive / Marketing Ops / Location Manager defaults, or single default layout for all users?
3. **Minimum cards:** Can users save an empty dashboard?
4. **Maximum cards:** Cap at 14, 12, or unlimited within catalog?
5. **Library UX:** Flat list (beta) vs. domain-grouped list with descriptions/previews?
6. **Mode label:** “Customize” (prototype) vs. “Manage” (`dashboard_beta_ux.md`) vs. “Edit” (`customizable_dashboard.md`)?
7. **Save model:** Explicit Save/Cancel (beta) vs. auto-save on exit (customizable dashboard)?
8. **2×1 card width:** In scope for v1 production or deferred?
9. **Filter bar in customize:** Stay hidden, or allow filter changes while editing layout?
10. **Unavailable metrics:** Hide from library vs. show disabled with reason?
11. **Ava / What Changed cards:** Removable like other cards, or protected?

---

## 12. Reference Files

- **Product — customizable dashboard** — `[docs/customizable_dashboard.md](../customizable_dashboard.md)`
- **Dashboard UX (filters, detail pages, manage mode summary)** — `[docs/dashboard_beta_ux.md](../dashboard_beta_ux.md)`
- **Analytics context (why customize exists)** — `[docs/analytics_proposition.md](../analytics_proposition.md)` § Dashboard
- **Prototype — dashboard + customize logic** — `[beta/index.html](../../beta/index.html)`
- **Prototype — layout / customize CSS** — `[beta/beta.css](../../beta/beta.css)` (search `sidebar-customize`, `app-shell--customize`, `drop-placeholder`)
- **GridStack integration notes (non-normative)** — `[docs/charts_spec/customize_mode_dashboard.md](./customize_mode_dashboard.md)` — Path A/B, CSS pitfalls, library version 10.3.1
- **Per-metric data specs** — `[docs/charts_spec/](./)` (files listed in § 2 table)
