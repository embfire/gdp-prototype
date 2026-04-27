# Dashboard Page — Detailed Design Proposal

This document is a pixel-level design specification for the Dashboard page in Figma. It references the existing Figma frame (`node-id=2405-6224`) as the baseline and extends it with complete layout rules, component anatomy, data mapping, interaction states, and edge cases.

[Figma Source](https://www.figma.com/design/DStuDLr0FUQ1SUE2WuuVtT/%F0%9F%9F%A1-Q1-26---Design-Research--CDP-UI-UX-Proposal?node-id=2405-6224)

---

## Table of Contents

- [1. Purpose & Design Philosophy](#1-purpose--design-philosophy)
- [2. Page Anatomy](#2-page-anatomy)
- [3. Page Header](#3-page-header)
- [4. Filter Bar](#4-filter-bar)
- [5. Row 1 — KPI Cards (3 Standard + 1 Chart Card)](#5-row-1--kpi-cards-3-standard--1-chart-card)
- [6. Row 2 — Guest Lifecycle Funnel + Revenue Concentration](#6-row-2--guest-lifecycle-funnel--revenue-concentration)
- [7. Row 3 — What Changed (Ava) + Alerts](#7-row-3--what-changed-ava--alerts)
- [8. Slide-Out Detail Panel](#8-slide-out-detail-panel)
- [9. Expanded Guest List (Chart Drill-Down)](#9-expanded-guest-list-chart-drill-down)
- [10. Dashboard Edit Mode](#10-dashboard-edit-mode)
- [11. Interaction States Matrix](#11-interaction-states-matrix)
- [12. Responsive Behavior](#12-responsive-behavior)
- [13. Edge Cases & Empty States](#13-edge-cases--empty-states)
- [14. Frames to Design Checklist](#14-frames-to-design-checklist)

---

## 1. Purpose & Design Philosophy

**Purpose:** 30-second health check. The landing page. Users scan KPIs, spot anomalies via color and direction, and decide where to drill in.

**Design principles:**

1. **Scan, don't read.** Large numbers, directional arrows, and color-coded benchmark dots convey health at a glance. No paragraph text on the scan layer.
2. **4-card constraint.** The layout accommodates exactly 4 cards per row. The first 3 are standard KPI cards; the 4th is a chart card that prioritizes a richer visualization over just a number + sparkline.
3. **Click to learn more.** Every card is clickable. Clicking opens a slide-out detail panel with trend, contributing factors, and action buttons.
4. **Customizable, not configurable.** Users pick from a curated card library — they don't build custom metrics. Phase 1 ships a fixed layout; Phase 1.5 adds the edit mode.

---

## 2. Page Anatomy

```
┌─ Top Navigation Bar (global, sticky) ──────────────────────────────────┐
│  [Logo] Guest360    [Ask Ava]  [PAR Academy]  [?]  [Avatar]  [⋯]      │
└────────────────────────────────────────────────────────────────────────┘

┌─ Sidebar (left, 256px, dark) ─┐  ┌─ Main Content Area ──────────────┐
│                                │  │                                   │
│  ● Dashboard  ← active         │  │  Page Header                     │
│                                │  │  ─────────────────────────────    │
│  GUESTS                       │  │  Filter Bar                       │
│    Analytics ▾                │  │  ─────────────────────────────    │
│      Overview                 │  │  Row 1: KPI Cards (×4)            │
│      Acquisition              │  │  ─────────────────────────────    │
│      Retention                │  │  Row 2: Funnel + Concentration    │
│      At risk                  │  │  ─────────────────────────────    │
│    Profiles                   │  │  Row 3: Ava + Alerts              │
│    Segments                   │  │  ─────────────────────────────    │
│                                │  │                                   │
│  MENU                         │  │         [Edit Dashboard]           │
│    Performance                │  │                                   │
│    LTO Analysis               │  └───────────────────────────────────┘
│                                │
│  OTHER                        │
│    Revenue ▾                  │
│      Overview                 │
│      Acquisition              │
│    Locations                  │
│    Campaigns                  │
│                                │
│  PLATFORM                     │
│    Data Sources               │
│    Identity Resolution        │
│    Data Export                 │
│                                │
│    Settings                   │
│                                │
│  [✦ Pin/Unpin sidebar]        │
└────────────────────────────────┘
```

**Spacing:**
- Sidebar width: 256px (collapsible to 64px icon-only on pin toggle)
- Main content left padding from sidebar: 32px
- Main content right padding: 32px
- Vertical gap between rows: 24px
- Content max-width: none (stretches to fill available space, cards distribute evenly)

---

## 3. Page Header

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                  ⓘ Help    [✦ Create with AI]│
└──────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**

| Element | Style | Notes |
|---------|-------|-------|
| Page title "Dashboard" | H1: Manrope Regular, 28px, line-height 1.44, color `#141414` (Grayscale/100) | Left-aligned, no subtitle |
| Help icon | `ⓘ` icon + "Help" text link | Opens help panel / documentation. 14px Manrope Regular, `#333333` |
| "Create with AI" button | Primary/accent button, filled purple background (`#2F3452` PAR/PAR 80 or accent blue), white text, rounded corners | Opens Ava "create" flow — generates dashboard presets, segments, or reports. Icon: sparkle/magic wand |

**Vertical spacing:** 24px above the filter bar.

---

## 4. Filter Bar

The Dashboard uses a simplified filter bar — fewer controls than dedicated analytics pages.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [7D] [30D] [90D] [12M] [YTD] [Custom]   compared to [Previous period ▾] │
│                                                       [🔽 More filters…] │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Date Range Selector

**Type:** Segmented button group (toggle tabs)

| Control | Behavior |
|---------|----------|
| 7D | Last 7 calendar days |
| 30D | Last 30 calendar days (default selected state) |
| 90D | Last 90 calendar days |
| 12M | Last 12 months |
| YTD | Year to date |
| Custom | Opens a dual-calendar date picker overlay |

**Visual states per tab:**
- **Default:** White/light background, dark text, subtle border
- **Selected:** Solid dark fill (`#212438`), white text
- **Hover (unselected):** Light gray background

### 4.2 Comparison Toggle

**Type:** Dropdown

**Label:** "compared to"

**Options:**
1. Previous period (default) — auto-calculates the equivalent prior period
2. Previous year — same date range, one year prior
3. None — hides all delta indicators and comparison lines on charts

When a comparison is active, all KPI cards show the delta arrow and change value. When "None" is selected, deltas are hidden and sparklines show only the current period.

### 4.3 "More Filters…" Button

**Type:** Text button with filter icon

**Click action:** Expands a secondary row below the date controls:

```
┌─ Expanded Filters ───────────────────────────────────────────────────────┐
│  Location [All locations ▾]    Loyalty Status [All ▾]    [Clear filters] │
└──────────────────────────────────────────────────────────────────────────┘
```

| Filter | Type | Behavior |
|--------|------|----------|
| Location | Searchable multi-select dropdown | Groups by region/market when configured. "Location Group" toggle switches between individual and grouped view |
| Loyalty Status | Single-select dropdown | All / Loyalty Members / Non-Loyalty. Hidden when brand has PAR Loyalty only (no non-loyalty data) |

**Dashboard does NOT include:** Channel, Daypart, Order Type, or Segment filters. Those belong on dedicated analytics pages where they are analytically meaningful.

**Active filter indicator:** When any non-default filter is set, the "More filters…" button shows a badge count (e.g., "More filters… (2)") and the expanded row shows active filters as removable pills.

### 4.4 Filter Bar States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Default | 30D selected, "Previous period" comparison, no extra filters |
| 2 | Custom date selected | Dual-calendar picker open, with start/end selection |
| 3 | Filters expanded | Secondary row visible with Location and Loyalty dropdowns |
| 4 | Location search open | Dropdown with search input, scrollable list, multi-select checkboxes |
| 5 | Active filters | Badge on "More filters" button, pills visible in expanded row |
| 6 | No comparison | "None" selected — all deltas hidden across the page |

---

## 5. Row 1 — KPI Cards (3 Standard + 1 Chart Card)

The dashboard has space for exactly **4 cards** in Row 1. The first 3 are standard KPI cards. The 4th position is a **chart card** — same dimensions but replaces the sparkline with a full mini chart, giving a richer at-a-glance visualization.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ Total Guests  │  │ Active Guests│  │ Repeat Rate  │  │ Avg Guest Lifetime   │
│               │  │ (90d)        │  │              │  │ Value                │
│ 842K          │  │ 346K         │  │ 38.2%        │  │ $1,245               │
│ ↑ +4.3%       │  │ ↑ +2.2%      │  │ ↓ -1 pts     │  │ ↑ +2.3%              │
│ +2,540 vs     │  │ +978 vs      │  │ vs prior     │  │ +$195 vs prior       │
│ prior period  │  │ prior period │  │ period       │  │ period               │
│               │  │              │  │              │  │                      │
│ (sparkline)   │  │ (sparkline)  │  │ (sparkline)  │  │ ┌──────────────────┐ │
│               │  │              │  │              │  │ │  (full line chart │ │
│ ● 75th        │  │ ● 50-75th    │  │ ● 50th       │  │ │   with axis,     │ │
└──────────────┘  └──────────────┘  └──────────────┘  │ │   gridlines,     │ │
                                                       │ │   comparison     │ │
                                                       │ │   line overlay)  │ │
                                                       │ └──────────────────┘ │
                                                       │ ● 75th               │
                                                       └──────────────────────┘
```

### 5.1 Standard KPI Card (Cards 1–3)

Used for: **Total Guests**, **Active Guests (90d)**, **Repeat Rate**

**Anatomy (top to bottom):**

| Element | Specification |
|---------|---------------|
| **Title** | Metric name. Manrope SemiBold, 14px, color `#484E7F` (PAR/PAR 40). Left-aligned |
| **Benchmark dot** | Inline with the title, right-aligned. Colored circle: Green `●` = above 75th percentile, Yellow `●` = 50th–75th percentile, Red `●` = below 50th. Accompanied by short label "75th" in 11px |
| **Value** | Large headline number. Manrope ExtraBold, 28px, color `#212438` (PAR/PAR 100). Formatted: numbers use K/M abbreviation (842K, 1.2M), currency uses $ prefix, percentages use % suffix |
| **Delta arrow** | Trend icon (up/down chevron). Green for favorable, red for unfavorable. 16×16px. Direction and sentiment are metric-dependent (up is good for Total Guests, down is bad for Repeat Rate) |
| **Delta text** | Change value + context. Manrope Regular, 14px, color matches arrow color. Format: "+4.3% · +2,540 vs prior period" — shows both relative % and absolute change |
| **Sparkline** | Undecorated mini line chart. No axis labels, no gridlines, no tooltips. ~40px height. Shows shape of trend over the selected date range. Line color: neutral dark gray. Fill: subtle gradient below line |
| **Benchmark indicator** | Small text below sparkline. "● 75th pctl" or "▲ above 75th" etc. 11px, uppercase |

**Card container styling:**
- Background: White (`#FFFFFF`)
- Border: 1px solid light gray, or subtle shadow (`Shadow/Short: 0, 1, 1, 0, #00000026`)
- Border-radius: 8px
- Padding: 16px
- Min-height: 160px (uniform across row)

**Color logic for delta and benchmark:**

| Metric | "Up" Sentiment | "Down" Sentiment |
|--------|----------------|------------------|
| Total Guests | Favorable (green) | Unfavorable (red) |
| Active Guests | Favorable (green) | Unfavorable (red) |
| Repeat Rate | Favorable (green) | Unfavorable (red) |
| Avg GLV | Favorable (green) | Unfavorable (red) |

### 5.2 Chart Card (Card 4 — Avg Guest Lifetime Value)

The 4th card position uses a **chart card** variant — same container dimensions as the other 3 cards, but the sparkline area is replaced with a richer, fully rendered mini chart.

**Why a chart card for GLV:**
- GLV trends are more meaningful when you see the shape with context (axis, comparison period)
- It gives the dashboard visual variety — 3 compact number cards + 1 "hero" chart card
- Users consistently ask "is my LTV growing?" which is best answered by a visible trend line, not just a number

**Anatomy (top to bottom):**

| Element | Specification |
|---------|---------------|
| **Title** | "Avg Guest Lifetime Value". Same style as standard KPI cards |
| **Benchmark dot** | Same as standard cards |
| **Value** | "$1,245". Same style as standard cards |
| **Delta** | "+2.3% · +$195 vs prior period". Same style as standard cards |
| **Mini chart** | Full line chart (not sparkline). Includes: X-axis time labels (abbreviated months), Y-axis value labels, light gridlines, current period line (solid), comparison period line (dashed, lighter color). Chart height: ~80–100px. Aspect ratio: wider than tall |
| **Benchmark indicator** | Same position as standard cards, below chart |

**Chart card rules:**
- The chart card always occupies the same grid cell size as a standard KPI card — it does NOT expand to 2x1
- When comparison is "None," the dashed comparison line disappears
- Hover on the chart does NOT show a tooltip (this is still a scan-layer card, not an analysis chart). The detail panel is the drill-down
- The chart uses the same time granularity as the selected date range (7D = daily points, 30D = daily, 90D = weekly, 12M = monthly, YTD = monthly)

### 5.3 KPI Card Data Mapping

| Card Position | Default Metric | Value Format | Sparkline / Chart | Drill Panel Deep Link |
|---------------|---------------|--------------|-------------------|----------------------|
| 1 | Total Guests | Number with K/M suffix (842K) | Sparkline (line) | Guests → Overview |
| 2 | Active Guests (90d) | Number with K/M suffix (346K) | Sparkline (line) | Guests → Overview |
| 3 | Repeat Rate | Percentage with 1 decimal (38.2%) | Sparkline (line) | Guests → Retention |
| 4 (chart card) | Avg Guest Lifetime Value | Currency with $ prefix ($1,245) | Full mini line chart with axis | Revenue → Overview |

### 5.4 KPI Card States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Default | Card showing value, delta, sparkline/chart, benchmark |
| 2 | Hover | Subtle elevation increase (stronger shadow) or border highlight. Cursor changes to pointer |
| 3 | Comparison off | Delta text and arrow hidden. Sparkline/chart shows only current period |
| 4 | Negative trend | Arrow down, red color. Delta shows negative value |
| 5 | Flat trend | Arrow horizontal (→) or no arrow, neutral gray color. Delta shows "0.0%" |
| 6 | Loading | Skeleton placeholder: shimmer animation on value, sparkline area, delta |
| 7 | No data | Shows "—" for value, no sparkline, muted "No data available" text |
| 8 | Click (pressed) | Brief press state before slide-out opens |

---

## 6. Row 2 — Guest Lifecycle Funnel + Revenue Concentration

Two chart cards side by side. The funnel takes ~65% width, concentration takes ~35%.

```
┌─────────────────────────────────────────────┐  ┌───────────────────────┐
│ Guest lifecycle funnel                   [⋮]│  │ Revenue               │
│ Distribution of all guests across five       │  │ concentration     [⋮] │
│ lifecycle stages                            │  │                       │
│                                             │  │ Your top 20% of      │
│ ■ First-time  ■ Returning  ■ Loyal          │  │ guests drive          │
│ ■ At risk     ■ Churned                     │  │                       │
│                                             │  │ 68%                   │
│ ┌─────────────────────────────────────────┐ │  │ revenue               │
│ │                                         │ │  │ ↗ +2 pts vs prior     │
│ │  100% ┤ █████████████████████████████   │ │  │  period               │
│ │       │ (stacked bar chart,             │ │  │                       │
│ │       │  each bar = one time period,    │ │  │ Revenue share by      │
│ │  50%  ┤  segments stacked by stage)     │ │  │ guest quintile        │
│ │       │                                 │ │  │                       │
│ │   0%  ┤─────┬─────┬─────┬─────         │ │  │ ┌─────────────────┐  │
│ │       Mar10 Mar12 Mar14 Mar16           │ │  │ │ (horizontal     │  │
│ └─────────────────────────────────────────┘ │  │ │  stacked bar)   │  │
│                                             │  │ └─────────────────┘  │
│                                             │  │                       │
│                                             │  │ ■ Top 20%      68%   │
│                                             │  │ ■ 20-40%       12%   │
│                                             │  │ ■ 40-60%       10%   │
│                                             │  │ ■ 60-80%        6%   │
│                                             │  │ ■ Bottom 20%    4%   │
└─────────────────────────────────────────────┘  └───────────────────────┘
```

### 6.1 Guest Lifecycle Funnel (2×1 card)

**Purpose:** Show how the guest base is distributed across lifecycle stages, and how that distribution changes over time.

**Card anatomy:**

| Element | Specification |
|---------|---------------|
| **Title** | "Guest lifecycle funnel". Manrope SemiBold, 14px, `#212438` |
| **Subtitle** | "Distribution of all guests across five lifecycle stages". Manrope Regular, 14px, `#484E7F` |
| **Overflow menu** | `[⋮]` icon, top-right. Opens: "View full page", "Export data", "Pin to top" |
| **Legend** | Horizontal legend above chart. Color squares + stage labels: First-time (blue/indigo), Returning (orange), Loyal (purple/lavender), At risk (coral/red-orange), Churned (red) |
| **Chart** | 100% stacked bar chart. Each vertical bar = one time period. Segments stacked by lifecycle stage. Y-axis: 0%–100%. X-axis: time labels matching the selected date range granularity |

**Chart behavior:**
- **Time granularity:** Auto-determined by date range. 7D = daily bars, 30D = daily, 90D = weekly, 12M = monthly
- **Hover:** Tooltip showing the exact count and percentage for each stage at that time point
- **Click on a segment:** Expands an inline guest list below the card (Pattern 2) filtered to that lifecycle stage at that time period
- **Color palette:** Uses the PAR design system brand colors. Each stage has a fixed color assignment across the entire product

**Container styling:**
- Same card container (white bg, shadow, 8px radius) as KPI cards but spans ~65% of the row width
- Min-height: matches the revenue concentration card height
- Padding: 20px

### 6.2 Revenue Concentration (1×1 card)

**Purpose:** Answer "How concentrated is my revenue among top guests?" — a key health signal.

**Card anatomy:**

| Element | Specification |
|---------|---------------|
| **Title** | "Revenue concentration". Manrope SemiBold, 14px, `#212438` |
| **Overflow menu** | `[⋮]` icon, top-right |
| **Context line** | "Your top 20% of guests drive". Manrope Regular, 14px, `#484E7F` |
| **Headline value** | "68%". Manrope ExtraBold, 28px, `#212438` |
| **Value label** | "revenue". Below the number, Manrope Regular, 14px, `#484E7F` |
| **Delta** | "↗ +2 pts vs prior period". Green arrow + text if improving, red if deteriorating |
| **Section subhead** | "Revenue share by guest quintile". Manrope SemiBold, 12px, uppercase |
| **Chart** | Single horizontal stacked bar showing the 5 quintile segments |
| **Legend/table** | Below the bar. 5 rows: Top 20%, 20-40%, 40-60%, 60-80%, Bottom 20%. Each row: color swatch + label + percentage right-aligned |

**Interaction:**
- **Click on a quintile segment (bar or legend row):** Expands guest list inline below the card filtered to that quintile
- **Card-level click (outside chart):** Opens slide-out detail panel with revenue concentration trend over time + contributing factors

**Container styling:**
- Same card container as KPI cards, spans ~35% of row width
- Height: matches lifecycle funnel card (row alignment)

### 6.3 Row 2 States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Default | Both cards rendered with current period data |
| 2 | Funnel hover | One bar segment highlighted, tooltip visible |
| 3 | Funnel segment clicked | Inline guest list expanded below funnel card |
| 4 | Concentration hover | One quintile highlighted in the bar and legend |
| 5 | Concentration clicked | Inline guest list for that quintile |
| 6 | Overflow menu open | Dropdown showing "View full page", "Export data", "Pin to top" |
| 7 | Loading | Skeleton shimmer on chart areas |
| 8 | No data | "No lifecycle data available" / "Revenue data not connected" messaging |

---

## 7. Row 3 — What Changed (Ava) + Alerts

```
┌──────────────────────────────────────────────┐  ┌──────────────────────┐
│ 🤖 What Changed This Week              [⋮]  │  │ Alerts           [⋮] │
│ Week of Mar 10 – Mar 16                     │  │                      │
│                                              │  │ ⚠ Repeat rate at     │
│ • Repeat rate dropped 1.8 pts at 3          │  │   Downtown dropped   │
│   downtown locations                         │  │   below 30%          │
│   Largest drop: Store #42 (−3.1 pts)        │  │                      │
│   978 fewer returning guests than expected.  │  │ ⚠ 340 guests         │
│                                              │  │   moved to "churned" │
│   [View Guests]  [Compare Locations]         │  │   this week          │
│                                              │  │                      │
│ • New guest acquisition up 12% driven       │  │ ⚠ GLV benchmark      │
│   by mobile app channel                      │  │   dropped below      │
│   Mobile contributed 64% of new signups.     │  │   50th percentile    │
│                                              │  │                      │
│   [View Acquisition]  [Create Segment]       │  │                      │
│                                              │  │                      │
└──────────────────────────────────────────────┘  └──────────────────────┘
```

### 7.1 "What Changed This Week" — Ava Card (2×1)

**Purpose:** AI-generated summary of the most significant changes in the brand's analytics this week. Answers "What should I pay attention to?" without requiring the user to scan every metric.

**Card anatomy:**

| Element | Specification |
|---------|---------------|
| **AI badge** | Small robot/sparkle icon + "AI" label. Indicates machine-generated content. Top-left, inline with title |
| **Title** | "What Changed This Week". Manrope SemiBold, 14px, `#212438` |
| **Date context** | "Week of Mar 10 – Mar 16". Manrope Regular, 12px, `#484E7F`. Always shows the current week range |
| **Overflow menu** | `[⋮]` icon, top-right |
| **Insights** | 2–4 insight blocks, each containing: |
| — Headline | Bold first sentence summarizing the change. Manrope SemiBold, 14px, `#212438` |
| — Detail | 1–2 supporting sentences with specifics (which locations, how many guests, magnitude). Manrope Regular, 14px, `#484E7F` |
| — Action buttons | 1–2 contextual buttons per insight. Ghost/outline style buttons. Labels are action-specific (not generic) |

**Action button examples:**
- [View Guests] — navigates to a filtered guest list
- [Compare Locations] — navigates to Locations page with a comparison view
- [Create Segment] — opens segment builder pre-filled with the relevant criteria
- [View Acquisition] — navigates to the Acquisition page
- [Ask Ava: "Why did repeat rate drop?"] — opens the Ava chat with a pre-filled prompt

**Insight generation rules:**
- Show 2–4 insights, prioritized by magnitude of change and business impact
- Each insight must be actionable (tied to a page or segment)
- Negative changes are shown first (anomalies demand attention)
- If no significant changes occurred, show: "No major changes this week. Your metrics are stable." with a green checkmark

### 7.2 Alerts Card (1×1)

**Purpose:** Threshold-based alerts for metrics that crossed a configured boundary. Unlike Ava insights (which are AI-generated narratives), alerts are rule-based triggers.

**Card anatomy:**

| Element | Specification |
|---------|---------------|
| **Title** | "Alerts". Manrope SemiBold, 14px, `#212438` |
| **Overflow menu** | `[⋮]` icon, top-right. Options: "Manage alert rules", "View all alerts" |
| **Alert items** | Vertical list, each item: ⚠ icon + alert description (1–2 lines). Manrope Regular, 14px, `#333333` |
| **Alert count** | If alerts exceed visible space (>4), show "View all (X)" link at bottom |

**Alert item behavior:**
- **Click an alert item:** Navigates to the relevant analytics page with the problematic metric highlighted
- **Alert severity colors:** Warning (yellow/amber ⚠) for threshold breaches, Critical (red 🔴) for severe drops

**Example alerts:**
- "Repeat rate at Downtown dropped below 30%"
- "340 guests moved to 'churned' this week"
- "GLV benchmark dropped below 50th percentile"
- "Mobile channel acquisition spiked +45% — verify data source"

### 7.3 Row 3 States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Default | Ava card with 2–3 insights, Alerts with 2–3 items |
| 2 | No changes | Ava card shows "No major changes" message with checkmark |
| 3 | No alerts | Alerts card shows "No active alerts" with checkmark, "Set up alert rules" link |
| 4 | Many alerts | Alert list truncated with "View all (12)" link at bottom |
| 5 | Ava loading | Skeleton shimmer with "Generating insights…" label |
| 6 | Action button hover | Button fill/outline transition |

---

## 8. Slide-Out Detail Panel

Triggered when a user clicks any KPI card (Row 1) or the Revenue Concentration card-level click (Row 2).

```
                                          ┌──── Detail Panel ───────────────┐
                                          │                            [✕]  │
Dimmed background                         │  Total Guests                   │
←───────────────────────────────────→     │  842K  ↑ +4.3% vs prior        │
                                          │                                  │
                                          │  ── 30-Day Trend ──             │
                                          │  ┌──────────────────────────┐   │
                                          │  │                          │   │
                                          │  │   (line chart, 30d)      │   │
                                          │  │   solid = current        │   │
                                          │  │   dashed = prior period  │   │
                                          │  │                          │   │
                                          │  └──────────────────────────┘   │
                                          │                                  │
                                          │  Why it changed:                │
                                          │  • Mobile app signups drove     │
                                          │    +1,200 new guests (+48%)     │
                                          │  • Downtown locations saw       │
                                          │    +820 returning guests        │
                                          │  • Loyalty enrollment up 6%     │
                                          │                                  │
                                          │  2,540 more guests than prior   │
                                          │                                  │
                                          │  [Create Segment]               │
                                          │  [View Guests]                  │
                                          │  [Ask Ava: "Why did Total       │
                                          │   Guests increase?"]            │
                                          │                                  │
                                          │  Go to Guests → Overview →      │
                                          └──────────────────────────────────┘
```

### 8.1 Panel Specifications

| Property | Value |
|----------|-------|
| **Trigger** | Click on any KPI card or card-level click on Row 2/3 cards |
| **Entry animation** | Slides in from the right edge, 300ms ease-out |
| **Width** | 400–480px fixed |
| **Height** | Full viewport height, scrollable if content overflows |
| **Overlay** | Background dims to ~20% opacity black overlay. Click overlay to close |
| **Close button** | `[✕]` top-right corner, 24×24px hit target |
| **Z-index** | Above all page content |

### 8.2 Panel Sections (top to bottom)

| Section | Content | Styling |
|---------|---------|---------|
| **Metric name** | Same as card title | Manrope SemiBold, 16px |
| **Value + delta** | Same as card, slightly larger | Value: 24px, Delta: 14px |
| **Trend chart** | Full line chart (not sparkline). X-axis labels, Y-axis labels, gridlines. Current period = solid line. Prior period = dashed line (when comparison is active). ~180px height | Standard chart styling |
| **"Why it changed"** | Bullet list of 2–4 contributing factors. AI-generated or rule-based. Each bullet is a complete sentence with specific numbers | Manrope Regular, 14px, `#333333` |
| **Affected count** | "X,XXX guests affected" or "X,XXX more guests than prior" | Manrope SemiBold, 14px |
| **Action buttons** | Stacked vertically. [Create Segment], [View Guests], [Ask Ava: "…"]. Full-width ghost buttons | 40px height, 14px text |
| **Deep link** | "Go to [Page Name] →". Text link, right-arrow icon | Manrope SemiBold, 14px, accent color |

### 8.3 Panel Mapping Per Card

| Card Clicked | Panel Title | Trend Chart Shows | Deep Link Target |
|-------------|-------------|-------------------|------------------|
| Total Guests | Total Guests | Guest count over time | Guests → Overview |
| Active Guests (90d) | Active Guests (90d) | Active guest count, trailing 90d window | Guests → Overview |
| Repeat Rate | Repeat Rate | Repeat rate % over time | Guests → Retention |
| Avg GLV (chart card) | Avg Guest Lifetime Value | GLV trend (line chart, same as card but larger) | Revenue → Overview |
| Revenue Concentration | Revenue Concentration | Top-20% revenue share % over time | Revenue → Overview |

### 8.4 Panel States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Opening | Slide-in animation, background dimming |
| 2 | Loaded | Full content visible |
| 3 | Scrolled | When content exceeds viewport, panel scrolls independently |
| 4 | No contributing factors | "Why it changed" section shows "Analysis in progress…" or "Not enough data to determine contributing factors" |
| 5 | Closing | Slide-out animation, background un-dimming |

---

## 9. Expanded Guest List (Chart Drill-Down)

Triggered when a user clicks a data point on the Lifecycle Funnel (a bar segment) or Revenue Concentration (a quintile segment).

```
┌─ Returning Guests — Mar 12 (4,280 guests) ─────────────────────────────┐
│                                                                          │
│  "These guests visited 2+ times in the period. Converting them to        │
│   monthly visitors would increase revenue by est. $420K."                │
│                                                                          │
│  [Create Segment]   [View Guests]   [Export CSV]                         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Guest ID   │ Last Visit  │  LTV     │ Visits  │ Status         │    │
│  │ ─────────  │ ──────────  │ ───────  │ ──────  │ ───────        │    │
│  │ #G-48291   │ Mar 11      │  $340    │ 4       │ Active         │    │
│  │ #G-12847   │ Mar 08      │  $290    │ 3       │ Active         │    │
│  │ #G-93841   │ Mar 06      │  $180    │ 2       │ Late           │    │
│  │ #G-55123   │ Mar 04      │  $420    │ 6       │ Active         │    │
│  │ #G-72910   │ Feb 28      │  $150    │ 2       │ Late           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Showing 5 of 4,280   [Show more]                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Specifications

| Property | Value |
|----------|-------|
| **Trigger** | Click on a chart segment (funnel bar, concentration quintile) |
| **Position** | Expands inline directly below the chart card that was clicked. Pushes subsequent rows down |
| **Entry animation** | Height expansion, 200ms ease-out |
| **Collapse** | Click the same segment again, or click the `[✕]` on the expanded list |

### 9.2 Section Content

| Element | Specification |
|---------|---------------|
| **Header** | Segment name + time context + count. e.g., "Returning Guests — Mar 12 (4,280 guests)". Manrope SemiBold, 16px |
| **Insight sentence** | Contextual, AI-generated one-liner about this group. Italicized or lighter weight. 14px |
| **Action buttons** | Horizontal row: [Create Segment], [View Guests], [Export CSV]. Ghost buttons |
| **Guest table** | 5 columns: Guest ID, Last Visit, LTV, Visits, Status. Shows 5 rows by default |
| **Pagination** | "Showing 5 of X,XXX" + [Show more] link loads next 10 |

---

## 10. Dashboard Edit Mode

Phase 1.5 feature. Toggled via an [Edit Dashboard] button in the bottom-right or top-right of the page.

### 10.1 Edit Mode Banner

```
┌─ Edit Mode ─────────────────────────────────────────────────────────────┐
│  Editing Dashboard      [+ Add Card]    [Reset to Default]    [Done]    │
│  Preset: [Executive ▾]                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **"Editing Dashboard" label** | Static text indicating the current mode |
| **[+ Add Card]** | Opens the Card Library panel (see 10.2) |
| **[Reset to Default]** | Confirmation dialog → resets to role-based default layout |
| **[Done]** | Exits edit mode, auto-saves layout |
| **Preset dropdown** | Switch between: Executive View, Marketing Ops View, Location Manager View, Custom (when user has modified) |

### 10.2 Cards in Edit Mode

Each card shows additional controls:

```
┌──────────────┐
│ [✕ remove]   │  ← remove button top-right
│  Total Guests │
│  ┊            │  ← drag handle (grab indicator, 6 dots)
│  842K         │
│               │  ← resize handle bottom-right (⤡ toggle 1×1 ↔ 2×1)
└──────────────┘
```

| Control | Behavior |
|---------|----------|
| **[✕ remove]** | Removes card from dashboard (with undo toast: "Card removed. [Undo]") |
| **Drag handle** | 6-dot grab indicator. Drag to rearrange position in the grid |
| **Resize handle** | Bottom-right. Toggles between 1×1 and 2×1 size. Not all cards support 2×1 (KPI cards stay 1×1; funnel, Ava support 2×1) |

### 10.3 Card Library Panel

Triggered by [+ Add Card]. Slides in from the right (same motion as detail panel).

```
┌─ Card Library ──────────────────────────────┐
│  Search cards…                      [✕]     │
│                                              │
│  ── Guests ──                               │
│  ┌─────────┐                                │
│  │ Preview │ Total Guests                   │
│  │ thumb   │ Total identified guest count   │
│  │         │ [✓ Added]                      │
│  └─────────┘                                │
│  ┌─────────┐                                │
│  │ Preview │ Active Guests                  │
│  │ thumb   │ Guests active in trailing 90d  │
│  │         │ [✓ Added]                      │
│  └─────────┘                                │
│  ┌─────────┐                                │
│  │ Preview │ New Guests                     │
│  │ thumb   │ First-time visitors            │
│  │         │ [+ Add to Dashboard]           │
│  └─────────┘                                │
│  ┌─────────┐                                │
│  │ Preview │ Identification Rate            │
│  │ thumb   │ % of guests identified         │
│  │         │ [+ Add to Dashboard]           │
│  └─────────┘                                │
│                                              │
│  ── Retention ──                            │
│  ┌─────────┐                                │
│  │ Preview │ Repeat Rate                    │
│  │ thumb   │ % returning within period      │
│  │         │ [✓ Added]                      │
│  └─────────┘                                │
│  ┌─────────┐                                │
│  │ Preview │ Avg Days to 2nd Visit          │
│  │ thumb   │ Average return latency         │
│  │         │ [+ Add to Dashboard]           │
│  └─────────┘                                │
│  ...                                         │
│                                              │
│  ── Revenue ──                              │
│  ...                                         │
│  ── Menu ──                                 │
│  ...                                         │
│  ── Locations ──                            │
│  ...                                         │
│  ── Campaigns ──                            │
│  ...                                         │
│  ── AI / Ava ──                             │
│  ┌─────────┐                                │
│  │ Preview │ What Changed This Week         │
│  │ thumb   │ AI-generated weekly insights   │
│  │         │ [✓ Added] [🔒 Required]       │
│  └─────────┘                                │
│  ...                                         │
└──────────────────────────────────────────────┘
```

**Card library categories mirror the navigation structure:**

| Category | Available Cards |
|----------|----------------|
| **Guests** | Total Guests, Active Guests (30/90/180d), New Guests, Guest Lifecycle Funnel, Frequency Distribution, Identification Rate, Loyalty vs. Non-Loyalty Split |
| **Retention** | Repeat Rate, Avg Days to 2nd Visit, Habitual Guest %, Visit Frequency Trend, Engagement Funnel (mini), Retention Cohort (mini) |
| **At Risk** | Late Guests %, Churned Guests %, Churn Rate Trend, Intervention Tier Breakdown, Predicted Revenue at Risk |
| **Revenue** | Total Revenue, Revenue per Guest, Avg Check Size, Avg GLV, Spend Lift, Revenue Concentration, Revenue by Lifecycle Stage |
| **Menu** | Avg Item Retention Rate, Avg Item Reorder Rate, Top Retaining Items, Top Churning Items |
| **Locations** | Top/Bottom Performers (mini scoreboard), Participation Rate by Location, Location Lifecycle Heatmap (mini) |
| **Campaigns** | Active Campaigns, Campaign Revenue Attributed, Best Performing Campaign, Channel Performance Summary |
| **AI / Ava** | What Changed This Week, Alerts & Anomalies |

**Library item states:**
- Already added: Shows "✓ Added" (green), non-clickable
- Available: Shows "[+ Add to Dashboard]" button
- Required (non-removable): Shows "🔒 Required" badge (e.g., Ava and Alerts cards prompt confirmation before removal)

### 10.4 Edit Mode States to Design

| # | State | Description |
|---|-------|-------------|
| 1 | Edit mode entered | Banner visible, all cards show remove/drag/resize handles |
| 2 | Dragging a card | Card lifts with shadow, placeholder gap shown at drop target |
| 3 | Card library open | Panel slides in from right, search input focused |
| 4 | Card added | Card appears at the bottom of the grid with a brief highlight animation |
| 5 | Card removed | Card fades out, undo toast appears at bottom for 5 seconds |
| 6 | Preset changed | All cards fade/swap to the new preset layout |
| 7 | Reset confirmation | Modal: "Reset dashboard to [Executive] defaults? Your current layout will be lost." [Cancel] [Reset] |
| 8 | Maximum cards reached | "Add Card" button disabled. Tooltip: "Maximum 12 cards. Remove a card to add a new one." |

---

## 11. Interaction States Matrix

Complete matrix of all interactive elements on the Dashboard and their click/hover behavior.

| Element | Hover | Click | Long-press / Right-click |
|---------|-------|-------|--------------------------|
| KPI Card (Row 1) | Elevation increase, border highlight, cursor: pointer | Opens slide-out detail panel | — |
| Chart Card (Row 1, position 4) | Same as KPI card | Opens slide-out detail panel for that metric | — |
| Lifecycle Funnel bar segment | Segment brightens, tooltip with count + % | Expands inline guest list below card | — |
| Revenue Concentration quintile bar | Quintile brightens, tooltip | Expands inline guest list for that quintile | — |
| Revenue Concentration card (outside chart) | Elevation increase | Opens slide-out detail panel | — |
| Ava insight action button | Standard button hover (fill/outline change) | Executes action (navigate, create segment, open Ava chat) | — |
| Alert item | Text underline, slight background highlight | Navigates to the relevant analytics page | — |
| Overflow menu `[⋮]` | Icon darkens | Opens dropdown: "View full page", "Export data", "Pin to top" | — |
| [Edit Dashboard] button | Standard button hover | Enters edit mode | — |
| Filter tab (date range) | Light background fill | Selects that date range, all cards refresh | — |
| Comparison dropdown | Standard dropdown hover | Selects comparison mode, all deltas update | — |
| "More filters…" button | Text underline | Expands/collapses the secondary filter row | — |

---

## 12. Responsive Behavior

### 12.1 Breakpoints

| Viewport | Columns | Row 1 (KPI Cards) | Row 2 (Funnel + Conc.) | Row 3 (Ava + Alerts) |
|----------|---------|-------------------|----------------------|---------------------|
| **Desktop ≥ 1440px** | 4 columns | 4 cards in a single row | Funnel (3 cols) + Concentration (1 col) | Ava (3 cols) + Alerts (1 col) |
| **Desktop 1200–1439px** | 3 columns | 3 cards top row + 1 card below-left | Funnel (2 cols) + Concentration (1 col) | Ava (2 cols) + Alerts (1 col) |
| **Tablet 768–1199px** | 2 columns | 2 cards per row (2 rows of 2) | Funnel full-width above, Concentration full-width below | Ava full-width above, Alerts full-width below |
| **Mobile < 768px** | 1 column | All 4 cards stacked vertically | Funnel full-width, then Concentration full-width | Ava full-width, then Alerts full-width |

### 12.2 Responsive Rules

- Card height remains uniform within each row at all breakpoints
- Sparklines and chart cards scale horizontally with the card width
- On mobile, the chart card (position 4) renders identically to desktop — the full chart remains, not downgraded to a sparkline
- The filter bar collapses date range tabs into a dropdown on mobile
- The slide-out detail panel becomes full-screen on mobile (slides up from bottom)
- Edit mode drag-and-drop is disabled on mobile — users see a simplified "Manage cards" list view instead

---

## 13. Edge Cases & Empty States

### 13.1 New Brand (No Data Yet)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  Dashboard                                                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  Welcome to Guest360 Analytics                                    │ │
│  │                                                                    │ │
│  │  Your dashboard will populate as data flows in from connected     │ │
│  │  sources. This typically takes 24–48 hours after data source      │ │
│  │  setup.                                                           │ │
│  │                                                                    │ │
│  │  [Go to Data Sources]   [Learn About the Dashboard]               │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Preview of your dashboard layout:                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                               │
│  │  --  │  │  --  │  │  --  │  │  --  │   ← dimmed placeholder cards   │
│  │  --  │  │  --  │  │  --  │  │  --  │                                │
│  └──────┘  └──────┘  └──────┘  └──────┘                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Partial Data

Some cards may have data while others don't (e.g., POS data connected but loyalty not yet).

- Cards with data render normally
- Cards without data show: metric title + "—" for value + "Data not available. [Connect source]" link
- The card is not removed — preserving the layout prevents disorientation

### 13.3 Data Refresh & Staleness

| Scenario | Handling |
|----------|----------|
| Data is refreshing | Subtle loading indicator (spinning icon) in the top-right of each refreshing card. Cards show stale data until refresh completes |
| Data is stale (>24h old) | Amber banner below filter bar: "Data last updated 36 hours ago. [Refresh now]" |
| Refresh failed | Red banner: "Data refresh failed for [source]. Showing data from [date]. [Retry] [View status]" |

### 13.4 Single-Location Brand

- Location filter is hidden (no point filtering to the only location)
- Revenue Concentration still shows (meaningful even for single locations)
- Location-based alerts are suppressed

### 13.5 No Loyalty Program

- Loyalty Status filter is hidden
- KPI cards that depend on loyalty data (if configured) show "N/A — No loyalty program connected"
- Ava insights do not reference loyalty metrics

---

## 14. Frames to Design Checklist

Complete list of Figma frames needed to fully specify the Dashboard page.

### 14.1 Primary Frames

| # | Frame Name | Description | Priority |
|---|-----------|-------------|----------|
| 1 | `Dashboard / Default` | Full page, 30D selected, comparison on, all data loaded | P0 |
| 2 | `Dashboard / Hover — KPI Card` | One KPI card in hover state (elevated shadow) | P0 |
| 3 | `Dashboard / Detail Panel — Total Guests` | Slide-out panel open for Total Guests, background dimmed | P0 |
| 4 | `Dashboard / Detail Panel — Repeat Rate` | Slide-out panel open for Repeat Rate (shows negative trend as example) | P0 |
| 5 | `Dashboard / Funnel Hover` | Lifecycle funnel with one segment highlighted + tooltip | P0 |
| 6 | `Dashboard / Funnel Drilldown` | Guest list expanded below the funnel card | P1 |
| 7 | `Dashboard / Concentration Drilldown` | Guest list expanded below the concentration card | P1 |
| 8 | `Dashboard / Filter — Custom Date` | Custom date calendar picker open | P1 |
| 9 | `Dashboard / Filter — Location Search` | More filters expanded, location dropdown open with search | P1 |
| 10 | `Dashboard / Filter — Active Filters` | Filters active with pills, badge on "More filters" | P1 |
| 11 | `Dashboard / Comparison Off` | "None" comparison selected — all deltas and comparison lines hidden | P1 |

### 14.2 Edit Mode Frames

| # | Frame Name | Description | Priority |
|---|-----------|-------------|----------|
| 12 | `Dashboard / Edit Mode — Default` | Edit banner visible, cards show handles | P1 |
| 13 | `Dashboard / Edit Mode — Dragging` | One card being dragged, placeholder gap visible | P2 |
| 14 | `Dashboard / Edit Mode — Card Library` | Library panel open, scrollable list of cards | P1 |
| 15 | `Dashboard / Edit Mode — Card Removed` | Undo toast visible at bottom after card removal | P2 |
| 16 | `Dashboard / Edit Mode — Reset Confirm` | Confirmation modal for resetting to defaults | P2 |

### 14.3 Edge Case Frames

| # | Frame Name | Description | Priority |
|---|-----------|-------------|----------|
| 17 | `Dashboard / Empty State — New Brand` | Welcome message + placeholder cards | P1 |
| 18 | `Dashboard / Partial Data` | 2 cards with data, 2 cards showing "—" and connect prompts | P1 |
| 19 | `Dashboard / Loading` | All cards showing skeleton shimmer | P1 |
| 20 | `Dashboard / Stale Data Banner` | Amber banner showing data staleness warning | P2 |
| 21 | `Dashboard / Error State` | Red banner for refresh failure | P2 |

### 14.4 Responsive Frames

| # | Frame Name | Description | Priority |
|---|-----------|-------------|----------|
| 22 | `Dashboard / Tablet (1024px)` | 2-column layout, stacked rows | P2 |
| 23 | `Dashboard / Mobile (375px)` | Single column, stacked cards, full-screen detail panel | P2 |
| 24 | `Dashboard / Detail Panel — Mobile` | Panel as full-screen bottom sheet | P2 |

### 14.5 Component Variants

| Component | Variants to Create |
|-----------|-------------------|
| **KPI Card** | Default, Hover, Loading, No Data, Positive Delta, Negative Delta, Flat Delta, No Comparison |
| **Chart Card** | Default, Hover, Loading, No Data, With Comparison Line, Without Comparison Line |
| **Lifecycle Funnel** | Default, Segment Hover + Tooltip, Segment Selected + Guest List |
| **Revenue Concentration** | Default, Quintile Hover + Tooltip, Quintile Selected + Guest List |
| **Ava Card** | Default (2–3 insights), No Changes, Loading |
| **Alerts Card** | Default (2–3 alerts), No Alerts, Many Alerts (truncated) |
| **Detail Panel** | Loaded, No Contributing Factors, Scrolled |
| **Guest List (inline)** | Default (5 rows), Expanded (more loaded), Empty |
| **Filter Bar** | Default, Expanded, Active Filters, Custom Date Picker Open |

---

## Appendix A: Design Token Reference (from Figma)

Tokens observed in the current Figma file, for consistency:

| Token | Value | Usage |
|-------|-------|-------|
| PAR/PAR 100 | `#212438` | Primary dark text, sidebar background |
| PAR/PAR 80 | `#2F3452` | Secondary dark, active sidebar items |
| PAR/PAR 40 | `#484E7F` | Muted text, subtitles, descriptions |
| Primary/60 | `#9AA4FF` | Active nav item text (accent) |
| Grayscale/White | `#FFFFFF` | Card backgrounds, page background |
| Grayscale/100 | `#141414` | Deepest text (headlines) |
| Grayscale/80 | `#333333` | Body text |
| Shadow/Short | `0 1px 1px 0 #00000026` | Card shadow |
| Font/Family | Manrope | All text across the product |
| Body/14 SemiBold | Manrope 600, 14px, line-height 22px, letter-spacing -0.154px | Card titles, labels |
| Body/14 Regular | Manrope 400, 14px, line-height 22px, letter-spacing -0.154px | Body text, descriptions |
| Section/11 SemiBold UC | Manrope 600, 11px, line-height 12px, letter-spacing 0.066px, uppercase | Sidebar section headers, benchmark labels |
| Header/H1 | Manrope 400, 28px, line-height 1.44 | Page title "Dashboard" |
| Body/Big | Manrope 800 (ExtraBold), 28px, line-height 1.44 | KPI headline values |

## Appendix B: Lifecycle Stage Color Mapping

For consistent use across the funnel chart, KPI cards, and any lifecycle-related visualizations:

| Stage | Intended Role | Notes |
|-------|--------------|-------|
| First-time | Blue/Indigo family | New guests, first transaction |
| Returning | Orange family | Visited 2+ times |
| Loyal | Purple/Lavender family | High frequency, habitual |
| At Risk | Coral/Red-orange family | Overdue for next visit |
| Churned | Red family | Exceeded churn window |

Exact hex values should align with the brand color palette already established in the PAR design system. Assign each stage a primary swatch and a lighter variant for stacked chart fills.

## Appendix C: KPI Card — Customization Slot Rules

When edit mode is enabled (Phase 1.5), users can swap cards in Row 1. The 4th position (chart card) has special rules:

| Rule | Description |
|------|-------------|
| **Any KPI can become a chart card** | When a KPI card is placed in position 4, it renders with the full mini chart variant instead of a sparkline |
| **Position is configurable** | The "chart card" slot isn't fixed to position 4 — users can drag any card to any position. The chart card rendering applies to whichever card occupies the last position in Row 1 |
| **2×1 cards cannot be placed in Row 1** | Row 1 is reserved for 1×1 cards (KPI or chart card variant). 2×1 cards (funnel, Ava) belong in Row 2+ |
| **Minimum 2 cards in Row 1** | Users cannot remove all KPI cards. At least 2 must remain in Row 1 |
| **Maximum 4 cards in Row 1** | The row cannot exceed 4 cards due to the layout constraint |
