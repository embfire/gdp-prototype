# GDP Analytics — Figma Design Plan

This document is a UX blueprint for designing every analytics page in Figma. It specifies layout structure, component behavior, chart types, time controls, dimension controls, and interaction states — everything needed to build high-fidelity pages. It does not prescribe colors, typography, or visual styling.

---

## Table of Contents

- [Global Components (Shared Across All Pages)](#global-components-shared-across-all-pages)
- [Page 1: Dashboard](#page-1-dashboard)
- [Page 2: Guests → Overview](#page-2-guests--overview)
- [Page 3: Guests → Acquisition](#page-3-guests--acquisition)
- [Page 4: Guests → Retention](#page-4-guests--retention)
- [Page 5: Guests → At Risk](#page-5-guests--at-risk)
- [Page 6: Revenue → Overview](#page-6-revenue--overview)
- [Page 7: Revenue → Trends](#page-7-revenue--trends)
- [Page 8: Menu → Performance](#page-8-menu--performance)
- [Page 9: Menu → LTO Analysis](#page-9-menu--lto-analysis)
- [Page 10: Locations](#page-10-locations)
- [Page 11: Campaigns](#page-11-campaigns)
- [Interaction States to Design Per Page](#interaction-states-to-design-per-page)
- [Chart Type Reference](#chart-type-reference)

---

## Global Components (Shared Across All Pages)

These components appear on every analytics page. Design them once as reusable Figma components.

### 1. Global Filter Bar

Sticky bar at the top of every page. Controls slice (WHERE clause — narrows the entire page to a subset).

```
┌──────────────────────────────────────────────────────────────────────┐
│  Date Range [Last 30 days ▾]  │  Compare To [Prior period ▾]       │
│  Location [All locations ▾]   │  Loyalty Status [All ▾]            │
│  Channel [All channels ▾]    │  Segment [None ▾]                  │
│                                                     [Clear filters] │
└──────────────────────────────────────────────────────────────────────┘
```

**Design details:**

- **Date Range picker:** Pre-built ranges (Last 7d, 30d, 90d, 12 months, YTD, Custom). When "Custom" is selected, show a dual-calendar date picker.
- **Compare To:** Prior period (auto-calculates the equivalent period), Prior year (same dates, year prior), None. This toggle controls whether trend charts show a comparison line and whether KPI cards show a delta.
- **Location dropdown:** Searchable. Supports multi-select. Groups locations by region/market when location groups are configured. Shows a "Location Group" toggle to switch between individual locations and groups.
- **Loyalty Status:** All / Loyalty Members / Non-Loyalty. When a brand lacks non-loyalty data (PAR Loyalty only), this control is hidden.
- **Channel:** All / POS / Mobile App / Web Ordering / Delivery / 3rd Party.
- **Segment:** Dropdown listing all saved audience segments. When a segment is applied, a persistent pill badge appears in the filter bar (e.g., "Segment: High-Value Guests ✕").
- **Active filter state:** Each dropdown shows a filled/highlighted state when a non-default filter is active. A "Clear filters" text link resets all to defaults.

**States to design:**
1. Default (no filters active)
2. Filters active (1+ filters set, showing pills/highlight)
3. Date range expanded (calendar dropdown open)
4. Location search expanded (showing search + results)

### 2. "Segment By" Dropdown (Per Chart)

Appears on individual charts/chart-blocks. Controls segment (GROUP BY — splits the metric by a dimension for comparison).

```
Segment by: [None ▾]
Options: None | Location | Channel | Daypart | Loyalty Status | Order Type | Guest Frequency
```

**Behavior:**
- Default is "None" (shows aggregate).
- When a dimension is selected, the chart splits into multiple series (lines, bars, or stacked segments). For line charts, each dimension value becomes a separate line. For bar charts, bars are grouped or stacked.
- The legend updates to show dimension values with their metric value.
- A "Top N" limit applies automatically for high-cardinality dimensions (e.g., Location shows top 10 + "Other"). A "Show all" link expands.

**States to design:**
1. Collapsed (showing current selection)
2. Expanded (dropdown open)
3. Applied — chart showing segmented data with legend

### 3. Chart-Block Component

The primary content unit on dedicated analytics pages. A self-contained card with a headline metric and a chart.

```
┌─────────────────────────────────────────────────────────────────┐
│  Metric Label                                            [?]   │
│  ┌──────────────┐                                              │
│  │ 42.3%        │  ↑ 2.1% vs. prior period                    │
│  │ (large)      │  Benchmark: 75th percentile ● ▲             │
│  └──────────────┘                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              (chart area)                               │   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]               │
│                                           [Benchmark: On ▾]    │
└─────────────────────────────────────────────────────────────────┘
```

**Anatomy:**
- **Metric Label:** Name of the metric (e.g., "Return Rate"). Includes an [?] info icon that shows a tooltip with the metric definition and calculation method.
- **Headline Number:** Large display of the current value. Size should be the dominant element in the block.
- **Trend Indicator:** Arrow (up/down) with % or absolute change and the comparison context ("vs. prior period", "vs. prior year").
- **Benchmark Indicator:** Small icon showing position relative to industry benchmarks. Three states: ▲ above 75th pctl, ● between 50th–75th, ▼ below 50th.
- **Chart Area:** The visualization. Aspect ratio is flexible per chart type (see Chart Type Reference below).
- **Controls Footer:** "Segment by" dropdown + time granularity toggle (Daily / Weekly / Monthly / Quarterly) + optional benchmark overlay toggle.

**States to design:**
1. Default (aggregate, no segmentation)
2. Segmented (chart showing split by dimension, legend visible)
3. Comparison active (prior period line overlaid in chart)
4. Benchmark band visible (shaded band on chart)
5. Hover (tooltip showing exact values at a data point)
6. Click (expanded detail / guest list below chart — see Pattern 2)

### 4. KPI Card Component (Dashboard Only)

Compact metric card used on the Dashboard scan layer.

```
┌───────────────────────┐
│  Total Guests          │
│                        │
│  1.2M                  │
│  ↑ 3.4% vs. prior     │
│                        │
│  ┌──────────────────┐  │
│  │ (sparkline)      │  │
│  └──────────────────┘  │
│                        │
│  ● 75th pctl           │
└───────────────────────┘
```

**Anatomy:**
- **Title:** Metric name.
- **Value:** Large number.
- **Delta:** Trend arrow + % change + comparison context.
- **Sparkline:** Small, undecorated trend line (no axis labels, no gridlines). Shows shape of trend over the selected date range.
- **Benchmark dot:** Position indicator vs. cohort benchmarks.

**Card sizes:**
- 1×1 (standard square): Single KPI + sparkline.
- 2×1 (double width, same height): Used for lifecycle funnel, Ava insights, location scoreboard (mini), wider trend charts.

### 5. Slide-Out Detail Panel (Dashboard Drill-Down)

Triggered when a user clicks a KPI card on the Dashboard.

```
┌──── Detail Panel ──────────────────────┐
│                                    [✕] │
│  Metric Name                           │
│  Value  ↑ delta                        │
│                                        │
│  ── Trend (larger chart) ──            │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │   (line/bar chart, 30d trend)    │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Why it changed:                       │
│  • Contributing factor 1               │
│  • Contributing factor 2               │
│  • Contributing factor 3               │
│                                        │
│  X,XXX guests affected                 │
│                                        │
│  [Create Segment]                      │
│  [View Guests]                         │
│  [Ask Ava: "Why did X change?"]        │
│                                        │
│  Go to [Full Page Name] →              │
└────────────────────────────────────────┘
```

**Anatomy:**
- Panel slides in from the right, overlaying page content (does not push it).
- Background dims slightly.
- Fixed width (~400–480px).
- Close button top-right.
- Sections: Metric headline → expanded trend chart → contributing factors (AI-generated or rule-based) → affected guest count → action buttons → deep link to the dedicated page.

### 6. Expanded Guest List (Chart Drill-Down)

Triggered when a user clicks a data point, bar, funnel step, or table row on any analytics page.

```
┌─ [Segment Name] (X,XXX guests) ───────────────────────────┐
│                                                             │
│  Contextual insight sentence.                               │
│  "These guests visit ~4x/year. Converting them to monthly   │
│   would increase revenue by est. $X.XM."                    │
│                                                             │
│  [Create Segment]   [View Guests]   [Export CSV]            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Guest ID  │ Last Visit │  LTV    │ Visits │ Status  │   │
│  │ ───────── │ ────────── │ ─────── │ ────── │ ─────── │   │
│  │ #G-48291  │ Feb 12     │  $340   │ 4      │ Active  │   │
│  │ #G-12847  │ Jan 28     │  $290   │ 3      │ Late    │   │
│  │ ...       │            │         │        │         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Showing 5 of X,XXX   [Show more]                           │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:** Expands inline below the chart that was clicked. Pushes subsequent content down. Shows 5 guests by default with pagination. Collapsible via a toggle or clicking the same data point again.

### 7. Ava "What Changed" Card

AI insight card used on the Dashboard and optionally on dedicated pages.

```
┌─ What Changed This Week ──────────────────────────────────┐
│  AI   Week of [Date Range]                                 │
│                                                             │
│  • Insight headline (bold)                                  │
│    Supporting detail: which groups, which locations,        │
│    magnitude of change.                                     │
│                                                             │
│    [Action Button 1]   [Action Button 2]                    │
│                                                             │
│  • Insight headline (bold)                                  │
│    Supporting detail.                                        │
│                                                             │
│    [Action Button 1]   [Action Button 2]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design details:**
- 2×1 card on the Dashboard.
- AI badge/icon to indicate machine-generated content.
- Each insight is a self-contained block: headline → detail → actions.
- Action buttons are contextual (not the same on every insight). Examples: [Create win-back segment], [Compare locations], [View guest profiles].

---

## Page 1: Dashboard

**Purpose:** 30-second health check. The landing page. Users scan, spot anomalies, and decide where to drill in.

**Layout model:** KPI cards in a responsive grid. This is the only page that uses compact KPI cards. All other pages use chart-blocks.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾  │  Compare To ▾  │  Location ▾  │  Loyalty ▾      │
└───────────────────────────────────────────────────────────────────┘

┌─ Row 1: Core KPIs (1×1 cards) ────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Total Guests  │  │ Active Guests│  │ Repeat Rate  │            │
│  │ 1.2M          │  │ 340K (90d)   │  │ 42.3%        │            │
│  │ ↑ 3.4%        │  │ ↑ 1.2%       │  │ ↑ 2.1%       │            │
│  │ (sparkline)   │  │ (sparkline)  │  │ (sparkline)  │            │
│  │ ● 75th        │  │ ▲ above 75th │  │ ● between    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐                               │
│  │ Avg GLV       │  │ Responsive   │                               │
│  │ $482          │  │ Audience     │                               │
│  │ ↑ $18         │  │ 68%          │                               │
│  │ (sparkline)   │  │ (sparkline)  │                               │
│  │ ▼ below 50th  │  │              │                               │
│  └──────────────┘  └──────────────┘                               │
└───────────────────────────────────────────────────────────────────┘

┌─ Row 2: Lifecycle + Revenue Concentration ────────────────────────┐
│  ┌─────────────────────────────────┐  ┌──────────────┐            │
│  │ Guest Lifecycle Funnel (2×1)    │  │ Revenue      │            │
│  │                                 │  │ Concentration│            │
│  │ First-time → Returning → Loyal  │  │              │            │
│  │          → At Risk → Churned    │  │ Top 20% =    │            │
│  │                                 │  │ 72% of rev   │            │
│  │ (horizontal funnel with counts) │  │ (bar chart)  │            │
│  └─────────────────────────────────┘  └──────────────┘            │
└───────────────────────────────────────────────────────────────────┘

┌─ Row 3: AI + Alerts ──────────────────────────────────────────────┐
│  ┌─────────────────────────────────┐  ┌──────────────┐            │
│  │ What Changed This Week (2×1)    │  │ Alerts       │            │
│  │                                 │  │              │            │
│  │ AI-generated insights           │  │ • Alert 1    │            │
│  │ with action buttons             │  │ • Alert 2    │            │
│  │ (see Ava component above)       │  │ • Alert 3    │            │
│  └─────────────────────────────────┘  └──────────────┘            │
└───────────────────────────────────────────────────────────────────┘

                    [Edit Dashboard]  ← bottom-right or top-right
```

### Dashboard Edit Mode

When the user clicks [Edit Dashboard], the grid enters edit mode:

```
┌─ Edit Mode Banner ────────────────────────────────────────────────┐
│  Editing Dashboard          [Add Card]    [Reset to Default]      │
│  Preset: [Executive ▾]                              [Done]        │
└───────────────────────────────────────────────────────────────────┘

Cards show:
  ┌──────────────┐
  │ [✕ remove]   │  ← remove button top-right of each card
  │  Total Guests │
  │  ┊            │  ← drag handle (grab indicator)
  │  1.2M         │
  │               │  ← resize handle bottom-right (toggle 1×1 ↔ 2×1)
  └──────────────┘
```

**[Add Card] opens a card library panel:**

```
┌─ Card Library ──────────────────────────────┐
│  Search cards...                            │
│                                             │
│  ── Guests ──                               │
│  ☐ Total Guests (already added)             │
│  ☐ Active Guests (already added)            │
│  ☐ New Guests                               │
│  ☐ Identification Rate                      │
│  ☐ Loyalty vs. Non-Loyalty Split            │
│  ☐ Frequency Distribution                   │
│  ☐ Guest Lifecycle Funnel (already added)   │
│                                             │
│  ── Retention ──                            │
│  ☐ Repeat Rate (already added)              │
│  ☐ Avg Days to 2nd Visit                    │
│  ☐ Habitual Guest %                         │
│  ☐ Visit Frequency Trend                    │
│  ☐ Engagement Funnel (mini)                 │
│  ☐ Retention Cohort (mini)                  │
│                                             │
│  ── At Risk ──                              │
│  ...                                        │
│  ── Revenue ──                              │
│  ...                                        │
│  ── Menu ──                                 │
│  ...                                        │
│  ── Locations ──                            │
│  ...                                        │
│  ── Campaigns ──                            │
│  ...                                        │
│  ── AI / Ava ──                             │
│  ☐ What Changed This Week (already added)   │
│  ☐ Alerts & Anomalies (already added)       │
│                                             │
│  Each item shows:                           │
│  [Preview thumbnail] [Name] [One-liner]     │
│  [+ Add to Dashboard]                       │
└─────────────────────────────────────────────┘
```

### Interaction Details

| Element | Click Action | Hover State |
|---------|-------------|-------------|
| KPI Card | Opens slide-out detail panel (Pattern 1) | Subtle elevation/border highlight |
| Lifecycle Funnel step | Expands guest list below (Pattern 2) | Step highlights, cursor changes |
| Revenue Concentration bar | Expands guest list below (Pattern 2) | Bar highlights with tooltip |
| Ava insight action button | Executes action (Create Segment, etc.) | Standard button hover |
| Alert item | Navigates to the relevant page | Underline / highlight |

### Filter Bar on Dashboard

Simpler than other pages. Supports:
- Date Range
- Compare To
- Location / Location Group
- Loyalty Status

Does **not** include Channel, Daypart, Order Type, Segment (those belong on dedicated pages where they're analytically meaningful).

---

## Page 2: Guests → Overview

**Purpose:** "Who are my guests?" — composition, health, identification, and value distribution.

**Layout model:** Chart-blocks (not KPI cards). Full-width chart-blocks stacked vertically.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location ▾ │ Channel ▾ │ Loyalty ▾   │
│  Segment ▾                                                        │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Guest Composition ──────────────────────────────────┐
│  Guest Composition                                           [?]  │
│  1.24M total guests                                               │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal stacked bar or donut)                           │ │
│  │                                                               │ │
│  │  First-time: 28%  │  Onboarding: 14%  │  Engaged: 22%       │ │
│  │  Late: 18%        │  Churned: 18%                             │ │
│  │                                                               │ │
│  │  Each stage is clickable → expands guest list below           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Identification Rate ────────────────────────────────┐
│  Identification Rate                                         [?]  │
│  62.4%  ↑ 1.8% vs. prior period                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked bar or treemap)                                    │ │
│  │                                                               │ │
│  │  Loyalty Members: 34%  │  Trackable (card): 28%              │ │
│  │  Anonymous: 38%                                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Loyalty vs. Non-Loyalty Value ──────────────────────┐
│  Loyalty vs. Non-Loyalty                                     [?]  │
│                                                                    │
│  ┌───────────────────────────┬───────────────────────────┐        │
│  │  LOYALTY MEMBERS          │  NON-LOYALTY GUESTS       │        │
│  │                           │                           │        │
│  │  Guest Count: 420K        │  Guest Count: 800K        │        │
│  │  Avg Check:   $24.80      │  Avg Check:   $18.40      │        │
│  │  Frequency:   3.2x/mo     │  Frequency:   1.1x/mo     │        │
│  │  Avg LTV:     $892        │  Avg LTV:     $243        │        │
│  │  Total Rev:   $374M       │  Total Rev:   $194M       │        │
│  └───────────────────────────┴───────────────────────────┘        │
│                                                                    │
│  This is a side-by-side comparison table.                         │
│  Each column can be clicked → guest list for that group.          │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Loyalty Penetration ────────────────────────────────┐
│  Loyalty Penetration                                         [?]  │
│  34.2%  ↑ 0.8% vs. prior period                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart — loyalty members as % of total guests,         │ │
│  │   over time. Show enrollment rate as secondary line.)        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Monthly ▾]                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Marketing Reachability ─────────────────────────────┐
│  Marketing Reachability                                      [?]  │
│  Responsive: 68%  of reachable guests                             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Funnel chart — horizontal)                                 │ │
│  │                                                               │ │
│  │  Total Guests ──→ Reachable ──→ Responsive ──→ Unreachable  │ │
│  │  1.24M            820K           558K           420K          │ │
│  │                                                               │ │
│  │  Below funnel: Channel breakdown of reachable guests          │ │
│  │  Email: 680K │ SMS: 410K │ Push: 320K │ Multi-channel: 280K  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Each funnel step and channel bar is clickable → guest list        │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Guest Trends ───────────────────────────────────────┐
│  Guest Trends                                                [?]  │
│  +12.4K new guests this period                                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked area chart OR dual-line chart)                     │ │
│  │                                                               │ │
│  │  Two series: New Guests (area fill) + Returning Guests       │ │
│  │  X-axis: time.  Y-axis: guest count.                         │ │
│  │  Comparison period shown as dashed line when enabled.        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Guest Value Distribution ───────────────────────────┐
│  Guest Value Distribution                                    [?]  │
│  Median GLV: $310                                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Histogram with quartile markers)                           │ │
│  │                                                               │ │
│  │  X-axis: GLV ranges ($0-50, $50-100, ..., $2000+)            │ │
│  │  Y-axis: guest count                                          │ │
│  │  Vertical markers at Q1, Median, Q3                           │ │
│  │  Annotation: "Top 10% = guests above $X"                     │ │
│  │                                                               │ │
│  │  Each bar is clickable → guest list for that range            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Frequency Distribution ─────────────────────────────┐
│  Frequency Distribution                                      [?]  │
│  Most guests: Irregular (74.8%)                                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart)                                      │ │
│  │                                                               │ │
│  │  Daily:      ██ 0.4%        (4,960)                          │ │
│  │  Weekly:     ████ 2.8%      (34,720)                         │ │
│  │  Monthly:    ████████ 7.6%  (94,240)                         │ │
│  │  Quarterly:  █████████████ 14.4% (178,560)                   │ │
│  │  Irregular:  ██████████████████████████████ 74.8% (927,520)  │ │
│  │                                                               │ │
│  │  Each bar is clickable → guest list with actions              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Loyalty vs. Non-Loyalty** is a side-by-side comparison table, not a toggle. Users need to see both simultaneously. The table columns are themselves clickable for drill-down.
- **Marketing Reachability** is a funnel (not a pie chart). Funnels show flow and drop-off. Each step and each channel bar can be clicked for guest list + actions.
- **Guest Value Distribution** uses a histogram, not a bar chart of segments. The histogram preserves the continuous nature of GLV data and lets users see the shape of the distribution. Quartile markers overlay the chart.
- **Frequency Distribution** uses horizontal bars because category labels are long text strings. Each bar is clickable.

---

## Page 3: Guests → Acquisition

**Purpose:** "Am I growing?" — new guest volume, sources, conversion to loyalty.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location ▾ │ Channel ▾ │ Order Type ▾│
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: New Guest Acquisition ──────────────────────────────┐
│  New Guests                                                  [?]  │
│  12,482  ↑ 8.7% vs. prior period                                 │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart with area fill)                                 │ │
│  │                                                               │ │
│  │  Primary line: new guests over time                           │ │
│  │  Dashed line: prior period comparison (when Compare is on)   │ │
│  │  X-axis: time.  Y-axis: new guest count.                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: First-Visit Conversion ─────────────────────────────┐
│  First-Visit Conversion Rate                                 [?]  │
│  64.2%  ↑ 1.1% vs. prior period                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Funnel chart — vertical, 2 steps)                          │ │
│  │                                                               │ │
│  │  Signup ──→ First Checkin                                     │ │
│  │  19,440      12,482                                           │ │
│  │  Avg days between: 3.2d                                       │ │
│  │                                                               │ │
│  │  Below: line chart of conversion rate over time               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Monthly ▾]                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Acquisition by Channel ─────────────────────────────┐
│  Acquisition by Channel                                      [?]  │
│  Largest: In-store POS (42%)                                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked bar chart OR horizontal bar chart)                 │ │
│  │                                                               │ │
│  │  In-store POS:  ██████████████████████ 42%                   │ │
│  │  Mobile App:    ████████████████ 28%                          │ │
│  │  Online Order:  ██████████ 18%                                │ │
│  │  eClub/Web:     ████ 8%                                       │ │
│  │  Other:         ██ 4%                                          │ │
│  │                                                               │ │
│  │  Each bar clickable → guest list for that channel             │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Loyalty Enrollment Rate ────────────────────────────┐
│  Loyalty Enrollment Rate                                     [?]  │
│  38.6%  ↑ 2.4% vs. prior period                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart — enrollment rate over time)                    │ │
│  │                                                               │ │
│  │  Secondary metric below chart:                                │ │
│  │  Avg days from first visit to loyalty enrollment: 12.4d      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Monthly ▾]                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: First Visit Profile ────────────────────────────────┐
│  First Visit Profile                                         [?]  │
│  Avg First Check: $16.80                                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Summary card — not a chart)                                │ │
│  │                                                               │ │
│  │  Avg First Check:     $16.80                                  │ │
│  │  Most Common Daypart: Lunch (41%)                             │ │
│  │  Most Common Items:   [Item 1], [Item 2], [Item 3]           │ │
│  │  Most Common Channel: In-store POS (58%)                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Acquisition by Location ────────────────────────────┐
│  Acquisition by Location                                     [?]  │
│  Largest Increase: Downtown (+18.2%)                              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Sortable table)                                            │ │
│  │                                                               │ │
│  │  Location    │ New Guests │ Change  │ Trend (sparkline)       │ │
│  │  Downtown    │ 1,840      │ +18.2%  │ ~~~/~~~                 │ │
│  │  Westside    │ 1,620      │ +12.1%  │ ~~~/~~~                 │ │
│  │  Midtown     │ 1,380      │ -4.2%   │ ~~~\~~~                 │ │
│  │  Eastgate    │ 1,120      │ -8.6%   │ ~~~\~~~                 │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Sortable by any column. Click row → slice page to location. │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Chart Type Rationale

- **New Guest Acquisition:** Line chart with area fill. The fill emphasizes volume. Comparison period as a dashed line gives instant visual delta without cluttering.
- **First-Visit Conversion:** Funnel (2-step). Funnels communicate conversion loss. Below the funnel, a small line chart shows the conversion rate trend over time so users can see if it's improving.
- **Acquisition by Channel:** Horizontal bars. Simple, scannable. Better than pie charts for comparing proportions.
- **Acquisition by Location:** Table with sparklines. Tables are the right format when you need to compare many items across multiple dimensions. Embedded sparklines add trend without adding chart bulk.

---

## Page 4: Guests → Retention

**Purpose:** "Are guests coming back?" — the single most important analytics page. Combines return rate, visit frequency, latency, engagement funnel, and cohort analysis.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location ▾ │ Channel ▾ │ Loyalty ▾   │
│  Guest Frequency ▾  │  Segment ▾                                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Return Rate ────────────────────────────────────────┐
│  Return Rate                                                 [?]  │
│  42.3%  ↑ 2.1% vs. prior period       Benchmark: 75th ▲          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart with benchmark band)                            │ │
│  │                                                               │ │
│  │  Primary line: return rate over time                          │ │
│  │  Shaded band: 50th–75th percentile benchmark range            │ │
│  │  Dashed line: prior period/year comparison                    │ │
│  │  X-axis: time.  Y-axis: return rate %.                        │ │
│  │                                                               │ │
│  │  When segmented, band disappears and multiple lines show.    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
│  Benchmark: [On ▾]                                                │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Visit Frequency ────────────────────────────────────┐
│  Visit Frequency                                             [?]  │
│  Avg: 2.4 visits/month  ↑ 0.2 vs. prior period                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Two visualizations, toggleable)                            │ │
│  │                                                               │ │
│  │  [Distribution ▾] / [Trend ▾]                                │ │
│  │                                                               │ │
│  │  Distribution view:                                           │ │
│  │  Horizontal bar chart of guest counts by frequency bucket     │ │
│  │  (Daily / Weekly / Monthly / Quarterly / Irregular)           │ │
│  │  Each bar clickable → guest list.                             │ │
│  │                                                               │ │
│  │  Trend view:                                                  │ │
│  │  Line chart of avg visit frequency over time.                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Monthly ▾]                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Visit Latency ──────────────────────────────────────┐
│  Avg Days to Second Visit                                    [?]  │
│  8.2 days  ↓ 0.4d vs. prior period (lower is better)             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart — inverted positive/negative convention)        │ │
│  │                                                               │ │
│  │  Line 1: Avg days to 2nd visit over time                      │ │
│  │  Line 2: Avg days between all visits over time                │ │
│  │  Both visible. Users need to track the onboarding window      │ │
│  │  (2nd visit) separately from overall cadence.                 │ │
│  │                                                               │ │
│  │  Comparison: dashed line for prior year/period.               │ │
│  │  Y-axis is inverted: lower = better, so downward trend       │ │
│  │  is visually "good."                                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Engagement Funnel ──────────────────────────────────┐
│  Engagement Funnel                                           [?]  │
│  Habitual Guest %: 8.4% (guests who reached 10+ visits)          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Vertical funnel chart)                                     │ │
│  │                                                               │ │
│  │  Signup         100%     (19,440 guests)                      │ │
│  │      │  ▸ 64.2% convert       Avg 3.2 days                   │ │
│  │  1st Visit      64.2%   (12,482)                              │ │
│  │      │  ▸ 48.1% convert       Avg 8.2 days                   │ │
│  │  2nd Visit      30.9%   (6,005)                               │ │
│  │      │  ▸ 72.4% convert       Avg 6.1 days                   │ │
│  │  3rd Visit      22.4%   (4,354)    ← "STICKINESS THRESHOLD" │ │
│  │      │  ▸ 68.2% convert       Avg 5.8 days                   │ │
│  │  5th Visit      15.3%   (2,974)                               │ │
│  │      │  ▸ 55.1% convert       Avg 12.4 days                  │ │
│  │  10th Visit     8.4%    (1,633)                               │ │
│  │                                                               │ │
│  │  Between each step: conversion rate + avg days                │ │
│  │  "3rd Visit" row highlighted/annotated as the threshold       │ │
│  │                                                               │ │
│  │  Each step is clickable → guest list of those who             │ │
│  │  dropped off between that step and the next.                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Return Rate by Visit Number ────────────────────────┐
│  Return Rate by Visit Number                                 [?]  │
│  3rd-Visit Conversion: 72.4%                                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Vertical bar chart)                                        │ │
│  │                                                               │ │
│  │  X-axis: Visit number (1st, 2nd, 3rd, 4th, 5th, 10th)       │ │
│  │  Y-axis: % who return for the next visit                      │ │
│  │                                                               │ │
│  │  The 3rd visit bar is highlighted/annotated:                  │ │
│  │  "After 3 visits, guests have a 72% chance of returning      │ │
│  │   again — this is the stickiness threshold."                  │ │
│  │                                                               │ │
│  │  Each bar clickable → guest list at that visit count.         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Retention Cohort Table ─────────────────────────────┐
│  Retention Cohort                                            [?]  │
│  Current Month Retention: 34.2%                                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Cohort heatmap table)                                      │ │
│  │                                                               │ │
│  │  Rows: Acquisition month (Jan, Feb, Mar, ...)                 │ │
│  │  Columns: Month 1, Month 2, Month 3, ... Month 12            │ │
│  │  Cells: Retention % with color intensity (darker = higher)   │ │
│  │                                                               │ │
│  │         │ M1   │ M2   │ M3   │ M4   │ M5   │ M6   │         │ │
│  │  Jan    │ 100% │ 42%  │ 34%  │ 28%  │ 24%  │ 22%  │         │ │
│  │  Feb    │ 100% │ 44%  │ 36%  │ 30%  │ 26%  │      │         │ │
│  │  Mar    │ 100% │ 40%  │ 32%  │ 27%  │      │      │         │ │
│  │  Apr    │ 100% │ 38%  │ 31%  │      │      │      │         │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Each cell is clickable → guest list for that cohort × month │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Granularity: [Monthly ▾] (Monthly / Quarterly)                   │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Retention by Dimension ─────────────────────────────┐
│  Retention by Dimension                                      [?]  │
│                                                                    │
│  [Location ▾] [Channel ▾] [Daypart ▾] [Loyalty Status ▾]         │
│  ← Tab-style selector, one active at a time                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — one bar per dimension value)        │ │
│  │                                                               │ │
│  │  When "Location" tab is active:                               │ │
│  │  Downtown:     ████████████████████████ 48.2%                │ │
│  │  Westside:     ██████████████████████ 44.1%                  │ │
│  │  Midtown:      ████████████████████ 40.8%                    │ │
│  │  Eastgate:     ██████████████████ 36.2%                      │ │
│  │                                                               │ │
│  │  Sorted high → low. Avg line overlaid for reference.          │ │
│  │  Each bar clickable → slice page to that dimension value.    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **This is a long page by design.** Retention is the most important topic and consolidating the data here (vs. Bikky's 4+ separate pages) reduces navigation friction. Consider a sticky section nav or anchor links on the left for quick jumping.
- **Engagement Funnel** uses a vertical funnel (not horizontal) because the progression is sequential and the between-step annotations (conversion rate + days) need horizontal space to be readable.
- **Cohort Table** uses color intensity (heatmap) rather than plain numbers. The visual gradient lets users spot retention drop-off patterns instantly. Click any cell to see the actual guests.
- **Visit Latency** uses inverted Y-axis convention: visually, down = good (fewer days = faster return). Include a small indicator or label so users understand the inversion.
- **Retention by Dimension** uses tab selectors (not a "Segment by" dropdown) because the intent is different — the user is comparing performance across dimension values, not splitting a single metric. Each tab shows a separate bar chart ranked by retention rate.
- **3rd Visit annotation** — the stickiness threshold is called out explicitly in both the Engagement Funnel and the Return Rate by Visit Number chart. This is a key insight from customer research and deserves visual emphasis.

---

## Page 5: Guests → At Risk

**Purpose:** "Who am I about to lose?" — churn visibility, intervention tiers, and direct-to-action. This is where analytics becomes action.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Location ▾ │ Guest Frequency ▾ │ Channel ▾       │
│  Order Type ▾                                                     │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Late & Churned Guests ──────────────────────────────┐
│  Late Guests: 18.2%    Churned Guests: 14.6%                [?]  │
│  Combined At-Risk: 32.8%  ↑ 1.4% vs. prior period                │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked area chart)                                        │ │
│  │                                                               │ │
│  │  Two stacked areas over time:                                 │ │
│  │  Bottom area: Late guests %                                   │ │
│  │  Top area: Churned guests %                                   │ │
│  │                                                               │ │
│  │  X-axis: time.  Y-axis: % of guest base.                     │ │
│  │  Comparison period as dashed outline.                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Intervention Tiers ─────────────────────────────────┐
│  Guests at Risk: 82,400                                      [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal segmented bar or tiered visual)                 │ │
│  │                                                               │ │
│  │  ┌──────────┬────────┬────────┬────────┬────────┬────────┐  │ │
│  │  │  30 day  │ 60 day │ 90 day │ 120 day│ 180 day│ 365 day│  │ │
│  │  │  12,400  │ 18,200 │ 22,800 │ 14,600 │  9,200 │  5,200 │  │ │
│  │  │  "nudge" │ "worry"│ "alarm"│ "sweat"│ "hail  │ "last  │  │ │
│  │  │          │        │        │        │ mary"  │ chance" │  │ │
│  │  └──────────┴────────┴────────┴────────┴────────┴────────┘  │ │
│  │                                                               │ │
│  │  Each tier is a distinct visual block. Color intensity or     │ │
│  │  urgency indicator increases left to right.                   │ │
│  │                                                               │ │
│  │  Below each tier:                                             │ │
│  │  [Create Segment]  [View Guests]  [Ask Ava: Best offer?]    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Each tier is clickable → expands to show the guest list          │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Churn Risk Score ───────────────────────────────────┐
│  Churn Risk Distribution                                     [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — 4 risk buckets)                     │ │
│  │                                                               │ │
│  │  Low Risk:      ██████████████████████████ 42,800             │ │
│  │                 Est. revenue at risk: $1.2M                   │ │
│  │                                                               │ │
│  │  Medium Risk:   ████████████████████ 28,400                   │ │
│  │                 Est. revenue at risk: $2.8M                   │ │
│  │                                                               │ │
│  │  High Risk:     ████████████ 16,200                           │ │
│  │                 Est. revenue at risk: $4.1M                   │ │
│  │                                                               │ │
│  │  Critical Risk: ██████ 8,400                                  │ │
│  │                 Est. revenue at risk: $6.2M                   │ │
│  │                                                               │ │
│  │  Each bucket clickable → guest list.                          │ │
│  │  Each bucket has: [Create Segment]                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Predicted Revenue at Risk ──────────────────────────┐
│  Revenue at Risk                                             [?]  │
│  $14.3M  ↑ $1.8M vs. prior period                                │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked bar chart — revenue by intervention tier)          │ │
│  │                                                               │ │
│  │  X-axis: intervention tier (30d, 60d, 90d, ...)               │ │
│  │  Y-axis: estimated revenue at risk ($)                        │ │
│  │  Color coding matches intervention tier blocks above.         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Churn by Dimension ─────────────────────────────────┐
│  Churn by Dimension                                          [?]  │
│                                                                    │
│  [Location ▾] [Daypart ▾] [Channel ▾]                            │
│  ← Tab selector                                                   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — sorted high to low)                 │ │
│  │                                                               │ │
│  │  Shows churn rate per dimension value.                        │ │
│  │  Avg churn line overlaid for comparison.                      │ │
│  │  Bars that exceed avg are visually distinct (above avg line). │ │
│  │                                                               │ │
│  │  Each bar clickable → slice to that location/channel/etc.    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Churn by Menu Item ─────────────────────────────────┐
│  Items Correlated with Churn                                 [?]  │
│  Highest churn item: [Item Name]                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Table — top 20 items with highest churn correlation)       │ │
│  │                                                               │ │
│  │  Item          │ Churn Rate │ Orders │ Guests │ Correlation  │ │
│  │  Southwest Wrap│ 34.2%      │ 8,400  │ 6,200  │ Strong ↑     │ │
│  │  Side Salad    │ 28.8%      │ 12,100 │ 9,800  │ Moderate ↑   │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Each row clickable → cross-link to Menu Performance page    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ At-Risk Guest List ──────────────────────────────────────────────┐
│  At-Risk Guests (82,400)                              [Export CSV]│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Sortable, filterable table)                                │ │
│  │                                                               │ │
│  │  Guest ID │ Last Visit │ Days Since │ Predicted Next │ Risk  │ │
│  │           │            │            │ Visit          │ Score │ │
│  │  #G-48291 │ Dec 18     │ 92 days    │ Overdue 34d    │ High  │ │
│  │  #G-12847 │ Nov 02     │ 138 days   │ Overdue 62d    │ Crit  │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  [Create Segment from List]  [View in Profiles]               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Showing 25 of 82,400   [Load more]                               │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Intervention Tiers** is the centerpiece. Design this as a visually prominent, horizontally segmented block — not a simple bar chart. Each tier is a self-contained block with its guest count, label, and action buttons. The progression from "nudge" to "last chance" should be visually communicated through urgency indicators.
- **Churn Risk Score** complements the time-based tiers. Tiers answer "how long have they been gone?" Risk Score answers "how likely are they to leave forever?" Both are needed; they serve different decision-making needs.
- **Revenue at Risk** translates churn from a guest count into a dollar figure. This is the chart that gets shown to executives. Design it to be visually impactful — large dollar values.
- **At-Risk Guest List** at the bottom of the page is a persistent, full-width exportable table. This is the operational view for CRM managers who need to pull lists for campaigns.
- **Every tier and bucket has action buttons.** The entire page is designed around "see risk → act on it."

---

## Page 6: Revenue → Overview

**Purpose:** "What are my guests worth?" — revenue concentration, lifetime value, loyalty vs. non-loyalty value gap.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location ▾ │ Channel ▾ │ Segment ▾   │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Total Revenue ──────────────────────────────────────┐
│  Total Revenue                                               [?]  │
│  $568M  ↑ 4.2% vs. prior period                                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart with area fill)                                 │ │
│  │  Primary: Revenue over time.                                  │ │
│  │  Comparison: dashed line.                                     │ │
│  │  X-axis: time.  Y-axis: revenue ($).                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Avg Check Size ─────────────────────────────────────┐
│  Avg Check Size                                              [?]  │
│  $22.40  ↑ $0.60 vs. prior period       Benchmark: ● 50-75th     │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart with benchmark band)                            │ │
│  │  Primary: avg check over time.                                │ │
│  │  Band: 50th–75th percentile benchmark range.                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Weekly ▾]                  │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Guest Lifetime Value ───────────────────────────────┐
│  Guest Lifetime Value                                        [?]  │
│  Avg GLV: $482  ↑ $18 vs. prior period                            │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Histogram with quartile markers)                           │ │
│  │                                                               │ │
│  │  Same pattern as Guest Value Distribution on Guest Overview.  │ │
│  │  X-axis: GLV ranges.  Y-axis: guest count.                   │ │
│  │  Q1, Median, Q3 markers.                                     │ │
│  │  "Top 10% = guests above $X" annotation.                     │ │
│  │                                                               │ │
│  │  Each bar clickable → guest list + [Create Segment].         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Loyalty vs. Non-Loyalty Value ──────────────────────┐
│  Spend Lift (Loyalty vs. Non-Loyalty)                        [?]  │
│  Loyalty guests spend 35% more per visit                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Grouped bar chart — side by side)                          │ │
│  │                                                               │ │
│  │  4 metric pairs, each showing Loyalty vs. Non-Loyalty:       │ │
│  │                                                               │ │
│  │  Avg Check      Frequency       LTV           Total Revenue  │ │
│  │  L: $24.80      L: 3.2x/mo     L: $892       L: $374M       │ │
│  │  NL: $18.40     NL: 1.1x/mo    NL: $243      NL: $194M      │ │
│  │                                                               │ │
│  │  Each pair is a grouped bar (L bar + NL bar).                │ │
│  │  The lift % is annotated above each pair.                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Toggle: [Show trend ▾] → converts to line chart showing         │
│  Loyalty vs. Non-Loyalty avg check over time.                     │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue Concentration ──────────────────────────────┐
│  Revenue Concentration                                       [?]  │
│  Top 20% of guests = 72% of revenue                              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Pareto-style bar chart)                                    │ │
│  │                                                               │ │
│  │  X-axis: Guest percentile (Top 1%, 5%, 10%, 20%, 50%, Rest) │ │
│  │  Y-axis: % of total revenue                                  │ │
│  │  Cumulative line overlaid.                                    │ │
│  │                                                               │ │
│  │  Each bar clickable → guest list for that percentile bucket. │ │
│  │  [Create Segment: Top 20%]                                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]                                             │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue by Lifecycle Stage ─────────────────────────┐
│  Revenue by Lifecycle Stage                                  [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked bar chart over time)                               │ │
│  │                                                               │ │
│  │  X-axis: time periods.                                        │ │
│  │  Y-axis: revenue ($).                                         │ │
│  │  Stacked by: First-time / Returning / Loyal / At Risk.       │ │
│  │                                                               │ │
│  │  Users see how revenue composition shifts over time.          │ │
│  │  Clickable segments → guest list by stage.                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Granularity: [Monthly ▾]                                         │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue by Channel ─────────────────────────────────┐
│  Revenue by Channel                                          [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (100% stacked bar chart over time OR donut + trend)         │ │
│  │                                                               │ │
│  │  In-store: 62%  │  Digital: 24%  │  Delivery: 14%            │ │
│  │                                                               │ │
│  │  Shows channel mix shift over time if using stacked bars.    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Granularity: [Monthly ▾]                                         │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Spend Lift** is a grouped bar chart showing 4 metric pairs side-by-side, not a single number. Executives need to see the full picture: Loyalty guests spend more per visit, come more often, have higher LTV, and contribute more total revenue. A toggle switches to a trend view.
- **Revenue Concentration** uses a Pareto bar chart with a cumulative line. This is the single most powerful chart for conveying guest value inequality. The annotation "Top 20% = 72% of revenue" is the headline takeaway.
- **Revenue by Lifecycle Stage** uses stacked bars over time (not a snapshot pie). Users need to see how the mix changes — if At Risk revenue is growing as a share, that's an alarm.

---

## Page 7: Revenue → Trends

**Purpose:** "How is revenue changing over time, and why?" — decomposition, seasonality, location comparison.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location ▾ │ Channel ▾               │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue Over Time ──────────────────────────────────┐
│  Revenue Trend                                               [?]  │
│  $568M total  ↑ 4.2% vs. prior period                            │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart — dual axis optional)                           │ │
│  │                                                               │ │
│  │  Primary line: Revenue over time (current period).            │ │
│  │  Dashed line: Prior year for seasonality comparison.          │ │
│  │                                                               │ │
│  │  Toggle: [vs. Prior Period ▾] [vs. Prior Year ▾]              │ │
│  │          [vs. Benchmark ▾]                                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Daily ▾]                   │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue Drivers ────────────────────────────────────┐
│  Revenue Drivers                                             [?]  │
│  Primary driver this period: More visits (+3.8%)                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Waterfall chart or decomposition bar)                      │ │
│  │                                                               │ │
│  │  Revenue = Guests × Visits/Guest × Avg Check                 │ │
│  │                                                               │ │
│  │  Starting Revenue (prior period)    $545M                     │ │
│  │  ├─ Guest Count Change              + $8M  (↑ 1.5%)          │ │
│  │  ├─ Visit Frequency Change          + $21M (↑ 3.8%)          │ │
│  │  ├─ Avg Check Change                - $6M  (↓ 1.1%)          │ │
│  │  Ending Revenue (current period)    $568M                     │ │
│  │                                                               │ │
│  │  Waterfall shows: start → positive/negative drivers → end.   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Avg Check Trend ────────────────────────────────────┐
│  Avg Check Trend                                             [?]  │
│  $22.40  ↑ $0.60 vs. prior period                                │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart with benchmark band)                            │ │
│  │  Same as Revenue Overview, but with daily granularity         │ │
│  │  available and the full YoY comparison.                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Daily ▾]                   │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Revenue by Location ────────────────────────────────┐
│  Revenue by Location                                         [?]  │
│  Top: Downtown ($48.2M, +6.1%)                                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Ranked table with sparklines)                              │ │
│  │                                                               │ │
│  │  Location   │ Revenue   │ Change  │ Avg Check │ Trend         │ │
│  │  Downtown   │ $48.2M    │ +6.1%   │ $24.10    │ ~~~/~~~       │ │
│  │  Westside   │ $42.8M    │ +4.8%   │ $22.80    │ ~~~/~~~       │ │
│  │  Midtown    │ $38.1M    │ -2.1%   │ $21.40    │ ~~~\~~~       │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Click any row → slice page to that location.                │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Revenue Drivers** uses a waterfall chart. This is the best chart type for decomposing "why did revenue change?" into its components: more guests, more visits, or higher checks. Each driver shows its absolute and percentage contribution. Executives can immediately see whether growth came from acquisition (more guests) or engagement (more visits).
- **Time granularity** defaults to daily on this page (unlike other pages that default to weekly/monthly). Revenue trends need finer granularity to spot promotional impacts and day-of-week patterns.

---

## Page 8: Menu → Performance

**Purpose:** "Which menu items drive guest behavior?" — retention, reorder, churn by item. The fastest-to-value analytics feature.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Location ▾ │ Item Category ▾ │ Channel ▾         │
│  Segment ▾                                                        │
└───────────────────────────────────────────────────────────────────┘

┌─ Guest Type Toggle ───────────────────────────────────────────────┐
│  [All Guests ▾]  [New Guests]  [Repeat Guests]                   │
│  ← Tab selector. Changes all chart-blocks below.                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Item Retention ─────────────────────────────────────┐
│  Item Retention Rate                                         [?]  │
│  Avg: 34.2%                                                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Multi-line chart)                                          │ │
│  │                                                               │ │
│  │  Each line = one top item (top 5–8 items).                    │ │
│  │  Dashed line = "average of all other items" as baseline.     │ │
│  │  X-axis: time.  Y-axis: retention rate %.                     │ │
│  │                                                               │ │
│  │  Legend shows item names with retention % next to each.       │ │
│  │  Click any line → item detail slide-out.                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Segment by: [None ▾]    Granularity: [Monthly ▾]                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Item Reorder Rate ──────────────────────────────────┐
│  Item Reorder Rate                                           [?]  │
│  Top item: Chicken Bacon Ranch Taco (68.4%)                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — ranked high to low)                 │ │
│  │                                                               │ │
│  │  Top 15 items by reorder rate.                                │ │
│  │  Bar length = reorder rate %.                                 │ │
│  │  Avg reorder rate line overlaid.                               │ │
│  │                                                               │ │
│  │  Each bar clickable → item detail slide-out.                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Item Churn ─────────────────────────────────────────┐
│  Items Correlated with Churn                                 [?]  │
│  Highest churn item: [Item Name] (44.2%)                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — ranked high to low)                 │ │
│  │                                                               │ │
│  │  Top 20 items with highest churn correlation.                 │ │
│  │  Bar length = churn rate %.                                   │ │
│  │  Avg churn rate line overlaid.                                │ │
│  │                                                               │ │
│  │  Items above avg line are visually distinct.                  │ │
│  │  Each bar clickable → cross-link to At Risk page.            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Menu Item Table ─────────────────────────────────────────────────┐
│  All Menu Items                                       [Export CSV]│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Sortable data table)                                       │ │
│  │                                                               │ │
│  │  Item        │Retention│ Churn │ Reorder │ Attach │ Orders   │ │
│  │              │  Rate   │ Rate  │  Rate   │  Rate  │          │ │
│  │  ──────────  │ ─────── │ ───── │ ─────── │ ────── │ ──────── │ │
│  │  CBR Taco    │ 52.4%   │ 12.1% │ 68.4%   │ 34.2%  │ 28,400  │ │
│  │  Classic Burg│ 48.1%   │ 14.8% │ 52.1%   │ 28.6%  │ 42,100  │ │
│  │  Side Salad  │ 22.4%   │ 34.2% │ 18.6%   │ 62.4%  │ 38,200  │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Sortable by any column. Click column header to sort.        │ │
│  │  Click any row → item detail slide-out.                      │ │
│  │                                                               │ │
│  │  Search: [Search items...]                                    │ │
│  │  Pagination: Showing 25 of 180 items   [1] [2] [3] ... [8]  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Item Combinations ──────────────────────────────────┐
│  Most Common Item Pairings                                   [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Table or network diagram)                                  │ │
│  │                                                               │ │
│  │  Item A          │ Item B          │ Co-occurrence │ Lift     │ │
│  │  CBR Taco        │ Chips & Queso   │ 42%           │ 2.8x    │ │
│  │  Classic Burger  │ Fries           │ 68%           │ 1.4x    │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  "Lift" = how much more likely pairing is vs. random chance. │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Item Detail Slide-Out

When any item row or bar is clicked:

```
┌──── Item Detail ───────────────────────────┐
│                                        [✕] │
│  Chicken Bacon Ranch Taco                  │
│                                            │
│  Retention Rate: 52.4%                     │
│  Reorder Rate:   68.4%                     │
│  Churn Rate:     12.1%                     │
│  Attachment Rate: 34.2%                    │
│  Total Orders:   28,400                    │
│  Total Revenue:  $412K                     │
│                                            │
│  ── Retention Trend ──                     │
│  ┌──────────────────────────────────┐      │
│  │  (Line chart: retention over     │      │
│  │   time for this item)            │      │
│  └──────────────────────────────────┘      │
│                                            │
│  ── Reorder Curve ──                       │
│  ┌──────────────────────────────────┐      │
│  │  (Line chart: days to reorder    │      │
│  │   distribution)                  │      │
│  └──────────────────────────────────┘      │
│                                            │
│  Guests who ordered this item: 18,200      │
│                                            │
│  [View Guest Profiles]                     │
│  [Create Segment: "CBR Taco Lovers"]       │
│  [Ask Ava: "Impact of this item?"]         │
└────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Guest Type Toggle** at the top is critical. Menu analytics behave very differently for new vs. repeat guests. A new-guest retention rate shows "which items bring first-timers back." A repeat-guest reorder rate shows "which items drive habitual behavior." This toggle changes the entire page.
- **Item Retention** uses a multi-line chart (not bar chart) because retention is best understood as a trend over time. Users need to see if an item's retention is improving or degrading, not just its current rate.
- **Item Combinations** table uses "Lift" (co-occurrence vs. expected by random chance) as the ranking metric. High-lift pairings are true affinities, not just popular items that appear together because they're both high-volume.
- **Full data table** at the bottom serves the operational user who needs to scan all items, sort by any metric, and export. Search + sort + paginate are essential.

---

## Page 9: Menu → LTO Analysis

**Purpose:** "Is my limited-time offer working?" — new item impact, cannibalization, guest acquisition.

### Page Layout

```
┌─ LTO Selector ────────────────────────────────────────────────────┐
│  Select LTO / New Item: [Chicken Bacon Ranch Burrito ▾]          │
│  LTO Period: Jan 15 - Feb 28, 2026                                │
│  Comparison Baseline: Dec 1 - Jan 14, 2026 (auto-calculated)     │
└───────────────────────────────────────────────────────────────────┘

┌─ Impact KPIs (summary row) ──────────────────────────────────────┐
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │
│  │ New Guests      │  │ Incremental    │  │ Cannibalization│      │
│  │ Attracted       │  │ Orders         │  │ Rate           │      │
│  │ 2,840           │  │ 8,400          │  │ 12.4%          │      │
│  │ (via this item) │  │ (+14.2%)       │  │                │      │
│  └────────────────┘  └────────────────┘  └────────────────┘      │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Guest Acquisition Impact ───────────────────────────┐
│  Did this item bring in new guests?                          [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Stacked bar chart over time)                               │ │
│  │                                                               │ │
│  │  X-axis: weeks during LTO period.                             │ │
│  │  Y-axis: orders of this item.                                 │ │
│  │  Stacked by: First-time guests / Existing guests.            │ │
│  │  Baseline period shown as dashed reference line.              │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Cannibalization ────────────────────────────────────┐
│  Which existing items lost orders?                           [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart — change in orders, negative bars)    │ │
│  │                                                               │ │
│  │  Items sorted by order decline during LTO period:             │ │
│  │  Regular Taco:      ◄████████ -18.2% (-1,200 orders)        │ │
│  │  Quesadilla:        ◄████ -8.4% (-420 orders)               │ │
│  │  Southwest Wrap:    ◄██ -4.1% (-180 orders)                  │ │
│  │  Classic Burrito:   ████► +2.8% (+140 orders)                │ │
│  │                                                               │ │
│  │  Shows both losers (left bars) and gainers (right bars).     │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Retention Impact ───────────────────────────────────┐
│  Do LTO guests come back?                                    [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line or bar chart)                                         │ │
│  │                                                               │ │
│  │  Two series:                                                  │ │
│  │  1. Return rate of guests acquired during LTO period         │ │
│  │  2. Return rate of guests acquired during baseline period    │ │
│  │                                                               │ │
│  │  Below chart:                                                 │ │
│  │  "What LTO guests ordered next:"                              │ │
│  │  Top 5 items with order counts.                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  [Create Segment: "Guests acquired by CBR Burrito LTO"]          │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **LTO Selector** replaces the global filter bar as the primary control. The page is structured around analyzing a single item, not a general filter. The comparison baseline auto-calculates to the equivalent period before the LTO launch.
- **Cannibalization chart** uses a diverging bar chart (negative bars left, positive bars right). This is the natural visualization for "what lost orders vs. what gained orders." Users can instantly see the trade-off.
- **Retention Impact** compares LTO-acquired guests to baseline-acquired guests. The question "did the LTO bring in guests who stick?" is as important as "did it drive orders?"

---

## Page 10: Locations

**Purpose:** "How do my stores compare?" — scorecard, ranking, comparison, trends. Serves both analytical (market managers) and motivational (store teams) needs.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Compare ▾ │ Location Group ▾ │ Metric ▾          │
└───────────────────────────────────────────────────────────────────┘

┌─ View Toggle ─────────────────────────────────────────────────────┐
│  [Scoreboard ▾]  [Trends ▾]  [Compare ▾]                        │
│  ← Three modes. Only one active at a time.                       │
└───────────────────────────────────────────────────────────────────┘

═══════ SCOREBOARD VIEW (default) ══════════════════════════════════

┌─ Location Scorecard Table ────────────────────────────────────────┐
│  Locations (42)                                       [Export CSV]│
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Sortable, rankable table)                                  │ │
│  │                                                               │ │
│  │  #  │ Location   │ Guests │ New   │ Return │ Avg   │ Churn  │ │
│  │     │            │        │ Guests│ Rate   │ Check │ Rate   │ │
│  │  ── │ ────────── │ ────── │ ───── │ ────── │ ───── │ ────── │ │
│  │  1  │ Downtown   │ 48.2K  │ 1.8K  │ 48.2%  │$24.10 │ 8.4%  │ │
│  │  2  │ Westside   │ 42.1K  │ 1.6K  │ 44.1%  │$22.80 │ 10.2% │ │
│  │  3  │ Midtown    │ 38.8K  │ 1.4K  │ 40.8%  │$21.40 │ 14.8% │ │
│  │  ↑  │ ← rank indicator shows movement vs. prior period       │ │
│  │                                                               │ │
│  │  Sortable by any column.                                      │ │
│  │  Top 3 and Bottom 3 subtly highlighted.                       │ │
│  │  Each row shows sparkline for the primary sort metric.       │ │
│  │                                                               │ │
│  │  Click row → expands to show location detail OR              │ │
│  │              slices the entire page to that location.         │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Lifecycle by Location (Heatmap) ─────────────────────────────────┐
│  Guest Lifecycle Distribution by Location                    [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Heatmap table)                                             │ │
│  │                                                               │ │
│  │  Rows: Locations (sorted same as scorecard)                   │ │
│  │  Columns: First-time, Onboarding, Engaged, Late, Churned    │ │
│  │  Cells: % with color intensity                                │ │
│  │                                                               │ │
│  │           │1st-time│Onboard│Engaged│ Late │Churned│          │ │
│  │  Downtown │  22%   │  16%  │  28%  │  18% │  16%  │          │ │
│  │  Westside │  26%   │  14%  │  24%  │  20% │  16%  │          │ │
│  │  Midtown  │  18%   │  12%  │  20%  │  24% │  26%  │  ← alert│ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Each cell clickable → guest list at that location × stage.  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Participation Rate by Location ──────────────────────────────────┐
│  Loyalty Participation Rate                                  [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Horizontal bar chart with benchmark band)                  │ │
│  │                                                               │ │
│  │  Each location as a bar: participation rate %.                │ │
│  │  Vertical benchmark band (50th–75th percentile).              │ │
│  │  Sorted high → low.                                           │ │
│  │  Bars below benchmark are visually flagged.                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

═══════ TRENDS VIEW ════════════════════════════════════════════════

┌─ Metric Selector ─────────────────────────────────────────────────┐
│  Show trend for: [Return Rate ▾]                                  │
│  Options: Guest Count, New Guests, Return Rate, Avg Check,       │
│           Churn Rate, Participation Rate, Revenue                 │
└───────────────────────────────────────────────────────────────────┘

┌─ Location Trend Chart ────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Multi-line chart — one line per location)                  │ │
│  │                                                               │ │
│  │  X-axis: time.                                                │ │
│  │  Y-axis: selected metric.                                     │ │
│  │  One line per location (top 5–10, rest collapsed).            │ │
│  │  Dashed line: brand average.                                  │ │
│  │                                                               │ │
│  │  Legend shows location names + current value.                 │ │
│  │  Click a line to highlight and dim others.                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Granularity: [Weekly ▾]                                          │
└───────────────────────────────────────────────────────────────────┘

═══════ COMPARE VIEW ═══════════════════════════════════════════════

┌─ Location Selector ───────────────────────────────────────────────┐
│  Compare: [Downtown ▾] vs. [Midtown ▾] (optional: [+ Add ▾])    │
└───────────────────────────────────────────────────────────────────┘

┌─ Side-by-Side Comparison ─────────────────────────────────────────┐
│  ┌─────────────────────┬─────────────────────┐                    │
│  │ DOWNTOWN             │ MIDTOWN              │                    │
│  │                      │                      │                    │
│  │ Guests: 48.2K        │ Guests: 38.8K        │                    │
│  │ New: 1.8K            │ New: 1.4K            │                    │
│  │ Return Rate: 48.2%   │ Return Rate: 40.8%   │                    │
│  │ Avg Check: $24.10    │ Avg Check: $21.40    │                    │
│  │ Churn: 8.4%          │ Churn: 14.8%         │                    │
│  │ Participation: 38.2% │ Participation: 28.4% │                    │
│  │                      │                      │                    │
│  │ (trend chart)        │ (trend chart)        │                    │
│  │ Return rate over time│ Return rate over time│                    │
│  └─────────────────────┴─────────────────────┘                    │
│                                                                    │
│  Metric selector: [Return Rate ▾] applies to both trend charts.  │
└───────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions for This Page

- **Three view modes** (Scoreboard / Trends / Compare) serve different user intents. Scoreboard is the default for daily checks. Trends for understanding changes over time. Compare for investigating specific locations.
- **Rank indicators** on the scoreboard (showing movement vs. prior period) serve the motivational use case. Store teams competing on metrics is a real behavior pattern from customer research (Graeter's).
- **Lifecycle Heatmap** is a powerful visual. Color intensity makes it easy to spot the "problem" locations — a location with deep color in the "Churned" column immediately draws attention.
- **Compare view** shows two (optionally three) locations side-by-side with identical metric cards and trend charts. The trend charts share the same Y-axis scale so visual comparison is accurate.

---

## Page 11: Campaigns

**Purpose:** "Is my marketing working?" — audience health, campaign performance, channel effectiveness, incrementality.

### Page Layout

```
┌─ Filter Bar ──────────────────────────────────────────────────────┐
│  Date Range ▾ │ Campaign Type ▾ │ Channel ▾ │ Segment ▾          │
└───────────────────────────────────────────────────────────────────┘

┌─ Audience Health (top section) ───────────────────────────────────┐
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │
│  │ Reachable       │  │ Responsive     │  │ Unreachable    │      │
│  │ Guests          │  │ Guests         │  │ Guests         │      │
│  │ 820K            │  │ 558K           │  │ 420K           │      │
│  │ 66% of total    │  │ 68% of reach.  │  │ 34% of total   │      │
│  │ ↑ 2.1%          │  │ ↑ 1.4%         │  │ ↓ 0.8%         │      │
│  │ (sparkline)     │  │ (sparkline)    │  │ (sparkline)    │      │
│  └────────────────┘  └────────────────┘  └────────────────┘      │
│                                                                    │
│  Each card clickable → slide-out with channel breakdown:          │
│  Email: X │ SMS: Y │ Push: Z │ Multi-channel: W                  │
│  [Click "Unreachable" → guest list with re-engagement actions]   │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Campaign Performance List ──────────────────────────┐
│  Campaigns (24 in period)                                    [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Sortable table)                                            │ │
│  │                                                               │ │
│  │  Campaign     │ Sent   │ Delivered │ Revenue    │ Incremental│ │
│  │               │        │ Rate      │ Attributed │ Visits     │ │
│  │  ──────────── │ ────── │ ───────── │ ────────── │ ────────── │ │
│  │  Spring Win.. │ 42.8K  │ 96.2%     │ $128K      │ +2,400    │ │
│  │  March Loyal..│ 28.4K  │ 94.8%     │ $86K       │ +1,800    │ │
│  │  ...                                                          │ │
│  │                                                               │ │
│  │  Click any campaign → campaign detail view.                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Channel Performance ────────────────────────────────┐
│  Channel Performance                                         [?]  │
│  Most effective: SMS (4.2% conversion)                            │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Grouped bar chart)                                         │ │
│  │                                                               │ │
│  │  X-axis: Channel (Email, SMS, Push)                           │ │
│  │  Metrics per channel (grouped bars):                          │ │
│  │  Delivery Rate │ Open/Read Rate │ Click Rate │ Conversion    │ │
│  │                                                               │ │
│  │  The conversion bar (rightmost in each group) is the         │ │
│  │  key metric — "did it drive a visit or purchase?"            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Segment Performance ────────────────────────────────┐
│  Performance by Target Segment                               [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Table or horizontal bar chart)                             │ │
│  │                                                               │ │
│  │  Segment          │ Campaigns │ Avg Revenue │ Avg Conv. Rate │ │
│  │  High-Value       │ 8         │ $42K        │ 6.8%           │ │
│  │  At-Risk (90d)    │ 6         │ $28K        │ 3.2%           │ │
│  │  New Guests       │ 4         │ $18K        │ 4.1%           │ │
│  │  Lapsed (180d+)   │ 3         │ $8K         │ 1.4%           │ │
│  │                                                               │ │
│  │  Click segment → cross-link to Guest Overview filtered.      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Control Group Comparison ───────────────────────────┐
│  Incrementality                                              [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Paired bar chart)                                          │ │
│  │                                                               │ │
│  │  Campaign Group vs. Control Group:                            │ │
│  │                                                               │ │
│  │  Visits:   Campaign: 4.2x  │  Control: 2.8x  │  Lift: +50% │ │
│  │  Revenue:  Campaign: $286  │  Control: $192   │  Lift: +49% │ │
│  │  Retention:Campaign: 68%   │  Control: 52%    │  Lift: +31% │ │
│  │                                                               │ │
│  │  Each metric shown as a pair of bars (campaign vs. control)  │ │
│  │  with the lift % annotated.                                   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘

┌─ Chart-Block: Top Redeemables ────────────────────────────────────┐
│  Best Performing Offers                                      [?]  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Table)                                                     │ │
│  │                                                               │ │
│  │  Offer            │ Redemption │ Discount │ Avg Check       │ │
│  │                   │ Rate       │ %        │ w/ Offer        │ │
│  │  Free Appetizer   │ 34.2%      │ 18%      │ $28.40          │ │
│  │  $5 Off $25       │ 28.8%      │ 20%      │ $32.10          │ │
│  │  ...                                                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### Campaign Detail View (when a campaign row is clicked)

```
┌─ Campaign Detail: Spring Win-Back ────────────────────────────────┐
│                                                          [← Back] │
│                                                                    │
│  Status: Completed                                                 │
│  Sent: Mar 1, 2026  │  Channel: Email + SMS                      │
│  Target: At-Risk 90-120 day  │  Size: 42,800 guests              │
│                                                                    │
│  ── Performance Timeline ──                                        │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  (Line chart — daily visits/revenue from targeted guests)    │ │
│  │  Send date marked on X-axis.                                  │ │
│  │  Shows buildup and decay of campaign impact.                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ── KPIs ──                                                        │
│  Delivered: 96.2% │ Opened: 42.1% │ Clicked: 8.4%               │
│  Revenue Attributed: $128K │ Incremental Visits: +2,400          │
│  Re-engaged Guests: 1,840 │ Avg Check: $26.80                   │
│                                                                    │
│  [View Targeted Guests] [Duplicate Campaign]                      │
└───────────────────────────────────────────────────────────────────┘
```

---

## Interaction States to Design Per Page

For every analytics page, create these Figma frames:

| State | Description |
|-------|-------------|
| **Default** | Page with all charts showing aggregate data, no filters active, no segmentation |
| **Filtered** | 1–2 global filters active (e.g., Location = Dallas). Filter bar shows active state. All charts reflect the filter. |
| **Segmented** | One chart showing "Segment by: Channel" applied. Chart splits into multiple series. Legend visible. Other charts still aggregate. |
| **Drill-down (Dashboard)** | Slide-out detail panel visible. Background dimmed. Panel shows context + actions. |
| **Drill-down (Analytics)** | One chart with expanded guest list below it. Action buttons visible. |
| **Hover/Tooltip** | A chart data point hovered with a tooltip showing exact values + comparison. |
| **Empty state** | Page when a data source is not available (e.g., PAR Ordering not connected). Shows explanation of what data is needed + which PAR product enables it. |

### Tooltip Design

Every chart point, bar, line, and cell should show a tooltip on hover:

```
┌───────────────────────────────┐
│  March 12, 2026               │
│                                │
│  Return Rate: 44.2%           │
│  vs. Prior Period: 42.1%      │
│  Change: +2.1 pts             │
│                                │
│  Guests: 48,200               │
│  Returning: 21,304            │
│                                │
│  Click to view guest details  │
└───────────────────────────────┘
```

Tooltip should:
- Show the date/label of the data point
- Show the primary metric value
- Show the comparison value and delta (when Compare is active)
- Show supporting context (guest count, revenue, etc.)
- Include a "click to..." affordance hint

---

## Chart Type Reference

Quick reference for which chart type to use for each analytical purpose.

| Purpose | Chart Type | Why This Type |
|---------|-----------|---------------|
| **Metric over time** | Line chart | Continuous trends. Use area fill for volume metrics (revenue, guest count). Use plain lines for rate metrics (return rate, churn rate). |
| **Metric over time with comparison** | Line chart + dashed line | Primary = current period, dashed = comparison period. Keeps the chart clean while enabling comparison. |
| **Metric over time with benchmark** | Line chart + shaded band | Band shows the 50th–75th percentile range. User's line relative to the band shows performance at a glance. |
| **Metric over time, segmented** | Multi-line chart | One line per dimension value (e.g., one line per location). Top 5–10 shown, rest collapsed. Legend with values. |
| **Distribution** | Histogram | Continuous data (GLV, days between visits). Preserves shape. Quartile markers. |
| **Composition (parts of whole)** | Stacked bar or horizontal stacked bar | Better than pie charts. Shows proportions clearly. Comparable across time periods when used as stacked bars over time. |
| **Composition over time** | Stacked area chart or 100% stacked bar | Shows how mix shifts. Stacked area for absolute values, 100% stacked bar for relative proportions. |
| **Ranking** | Horizontal bar chart | Sort high→low. Avg line for reference. Clear labels. Each bar clickable. |
| **Comparison (2–4 items)** | Grouped bar chart | Side-by-side bars. Used for Loyalty vs. Non-Loyalty, Campaign vs. Control. |
| **Funnel (sequential conversion)** | Vertical funnel | Steps reduce top-to-bottom. Conversion % and days between steps shown at each junction. |
| **Cohort retention** | Heatmap table | Rows = cohorts, Columns = periods. Color intensity = retention %. The standard visualization for cohort analysis. |
| **Decomposition (what drove change)** | Waterfall chart | Start → positive/negative drivers → end. Perfect for "Revenue = Guests × Visits × Check" decomposition. |
| **Divergence (gain vs. loss)** | Diverging bar chart | Bars extend left (loss) and right (gain) from a center axis. Used for LTO cannibalization. |
| **Correlation** | Scatter plot (if needed) | Only if showing correlation between two continuous metrics. Rare in this product. |
| **Geographic** | Not used | Location comparison uses tables and bar charts, not maps. Maps are visually appealing but poor for precise metric comparison. |

### Time Controls

Every time-based chart should support:

| Control | Options | Default |
|---------|---------|---------|
| **Granularity** | Daily / Weekly / Monthly / Quarterly | Weekly (most pages), Daily (Revenue Trends) |
| **Comparison** | vs. Prior Period / vs. Prior Year / None | Prior Period |
| **Date Range** | Last 7d / 30d / 90d / 12mo / YTD / Custom | Last 30 days |

**Comparison behavior:**
- "Prior Period" for Last 30 days → compares to the 30 days before that.
- "Prior Year" for Last 30 days → compares to the same 30-day window one year ago.
- Comparison shows as a dashed line on charts and a delta on headline numbers.

### Dimension Controls

Available dimensions for both Slice (filter bar) and Segment (per-chart dropdown):

| Dimension | Values | When to Hide |
|-----------|--------|-------------|
| **Location** | Individual locations + location groups | Never (always available) |
| **Channel** | POS, Mobile App, Web Ordering, Delivery, 3rd Party | When only one channel exists |
| **Daypart** | Breakfast, Lunch, Afternoon, Dinner, Late Night | Never |
| **Loyalty Status** | Loyalty Member, Non-Loyalty | When PAR Ordering/Pay not connected (no non-loyalty data) |
| **Guest Frequency** | Daily, Weekly, Monthly, Quarterly, Irregular | Never |
| **Order Type** | Dine-in, Takeout, Delivery | When only one order type exists |
| **Segment** | All saved audience segments | When no segments created (show prompt to create first segment) |

---

## Phase Map

Which pages to design first, aligned with the engineering build phases.

| Phase | Pages to Design | Notes |
|-------|----------------|-------|
| **Phase 1** | Dashboard, Guests → Overview, Guests → Acquisition, Guests → Retention, Guests → At Risk | Core pages. Design all interaction states. |
| **Phase 1.5** | Dashboard Edit Mode (customization) | Add card library, drag-drop, presets. Layered onto existing Dashboard design. |
| **Phase 2** | Revenue → Overview, Menu → Performance, Locations | Growth pages. Revenue and Menu are high-value additions. |
| **Phase 3** | Campaigns, Revenue → Trends, Menu → LTO Analysis | Complete pages. Campaigns depends on real-time data infrastructure. |
