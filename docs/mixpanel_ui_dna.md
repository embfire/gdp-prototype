# Mixpanel Charts — UI DNA Reference

> Source: Mixpanel Ecommerce Sample Template Board  
> Extracted: April 2026  

---

## 1. Dashboard Shell & Global Controls

### Board Header
- **Breadcrumb:** `E-Commerce / Ecommerce Sample Template` — text links, separated by `/`
- **View badge:** "View only" (gray text) + "Public" (purple text)
- **Actions bar (right):** Subscribe, Comment, Share, Copy Link, Favorite (heart), More (…)

### Time-Range Bar (sticky top)
- **Preset pills:** Custom | Today | Yesterday | 7D | 30D | 3M | 6M | 12M | Default
  - Active pill: filled background, bold text
  - Inactive pill: transparent background, normal text
- **Exclude dropdown:** "Exclude ▾" — dropdown with filter options
- **Add button:** "+" icon to add new cards

### Section Headings
- **H2 title** (e.g., "High Level KPIs", "The Conversion Journey", "Acquiring New Users")
- Followed by a descriptive text block and bullet list of suggested questions
- Optional "💡 Tip:" callout with contextual guidance

---

## 2. Chart Card Anatomy (shared by all chart types)

### Card Container
- **Border:** Light gray, rounded corners (~8px)
- **Background:** White (#FFFFFF)
- **Padding:** ~16–20px internal padding
- **Shadow:** Subtle or none (flat design)

### Card Header
- **Icon:** Small colored icon (report-type dependent — line chart 📊, funnel 📉, retention ♻️, flow 🌊, table 📋)
- **Title:** Bold, dark text (e.g., "Revenue over time")
- **Subtitle line:** Lighter gray text describing parameters: `{Aggregation}, {Time Period}` (e.g., "Linear, Total, Last 3 months")
- **Overflow menu:** Three-dot "⋮" icon (appears on hover, top-right corner)

### Legend Bar
- **Position:** Below header, above chart area
- **Format:** Inline colored squares/dots followed by series name
- **Overflow:** "+N More" text for series exceeding display limit
- **Colors:** Consistent categorical palette — purple (#7B61FF primary), coral/red, teal, orange, yellow, pink, blue-gray

### Click-to-Expand
- Clicking the card title/header opens an **expanded editor view** with:
  - Full-width chart
  - Right sidebar with: Query | Chart | Annotations tabs
  - Report type tabs: Insights | Funnels | Flows
  - Metric definition panel (events, steps, filters, breakdowns)
  - Data table below chart
  - Chart type selector dropdown (Line ▾)
  - Granularity dropdown (Day ▾ / Week ▾)
  - Time range pills (same as board level)
  - Exclude ▾ and Compare ▾ filter dropdowns
  - View toggle icons (4 modes): chart+table | chart-only | table-only | annotation view

---

## 3. Chart Types

### 3.1 Line Chart (Single Series)

**Used in:** Revenue over time, LTV trend based on first 60 days, Number of Items Purchased Over Time, Purchase Funnel Conversion Over Time

**Visual Spec:**
- Single continuous line with data points at each interval
- Line color: Purple (#7B61FF) or teal (for retention)
- Data points: Small circles at each value
- Y-axis: Left-aligned, abbreviated values (e.g., 100K, 200K, 500K)
- X-axis: Date labels (e.g., "Mar 6", "Mar 20", "Apr 3") or interval labels ("Day 20", "Day 40")
- Grid: Light horizontal gridlines only

**Hover Tooltip:**
- Vertical highlight band on hovered time period
- Highlighted data point circle (larger, filled)
- Tooltip card (floating, white with subtle shadow):
  - **Line 1:** Metric name in bold (e.g., "Purchase Completed [Sum of cart ▸ Price]")
  - **Line 2:** Date range (e.g., "Mar 20 – Mar 26, 2023")
  - **Line 3:** Value in bold monospace (e.g., `122,885`)
  - **Line 4:** Change badge — percentage with color coding:
    - Green text with light green background for positive (e.g., `+48.55%`)
    - Red/pink text with light red background for negative (e.g., `-5.45%`)
  - **Line 5:** Context label (e.g., "from previous week" / "from previous day")
- Left color accent bar matching the series color

### 3.2 Multi-Line Chart

**Used in:** LTV of monthly new user cohorts, Channel Conversion Over Time, Conversion by Cart Size

**Visual Spec:**
- Multiple colored lines, each representing a series/segment
- Legend: Inline colored dots + series names + "+N More" overflow
- Distinct colors per series from categorical palette
- Dashed lines may indicate projected/incomplete periods

**Hover Tooltip (on expanded view):**
- Same structure as single line chart tooltip
- Shows data for the hovered series only
- Includes segment/breakdown value (e.g., cart size "1")

### 3.3 Funnel Bar Chart (Vertical Steps)

**Used in:** Revenue through Purchase Funnel, Purchase Funnel

**Visual Spec:**
- Vertical bars arranged left-to-right, one per funnel step
- Bars decrease in height showing drop-off (tallest → shortest)
- Color: Gradient of purple shades (darkest for step 1, lighter for subsequent steps)
- Step labels below X-axis: "1 Product Viewed", "2 Product Added", "3 Purchase Comp…"
- Value annotations above/inside bars:
  - Absolute value (e.g., `231.8K`)
  - Percentage (e.g., `100%`, `65.86%`, `66.98%`)
- Overall conversion in legend area: "Overall • 44.11%"
- Y-axis: Numeric values (for revenue funnel) or percentages (for conversion funnel)

**Hover Tooltip:**
- Left color accent bar (purple)
- **Line 1:** Segment name (e.g., "Overall")
- **Line 2:** Conversion percentage (e.g., `65.8558% converted`)
- **Line 3:** Aggregate value (e.g., `152,659 sum of cart ▸ Price`) or count (e.g., `10,254 total times`)

**Expanded View Additions:**
- Data table below chart with columns: Property | Total Conv. | Step 1 values | Step 2 values...
- Funnel Steps dropdown selector
- Settings gear icon

### 3.4 Horizontal Bar Chart (Simple)

**Used in:** Revenue per Category, Top Channels Driving New Users

**Visual Spec:**
- Horizontal bars, sorted by value (largest at top)
- Category labels on the left (e.g., "hats", "sneakers", "pants")
- Value labels on the right of each bar (e.g., `24`, `24`, `23…`)
- Single color per bar (from categorical palette — each category gets its own color: red, orange, teal, yellow, green, etc.)
- "..." truncation indicator and value scale on left axis
- Legend: Colored squares + category names + "+N More"

**Hover Tooltip:**
- Left color accent bar
- **Line 1:** Metric name (e.g., "Purchase Completed [Sum of cart ▸ Price]")
- **Line 2:** Category name (e.g., "hats")
- **Line 3:** Absolute value (e.g., `24,772`)
- **Line 4:** Percentage of overall (e.g., `12.01% of overall`)

### 3.5 Horizontal Bar Chart (with Period Comparison)

**Used in:** Top Purchased Category, Top Category Added to Cart

**Visual Spec:**
- Two bars per category, stacked vertically:
  - **Previous period bar:** Hatched/diagonal-stripe pattern fill (lighter)
  - **Current period bar:** Solid color fill
- Values shown to the right of each bar pair (e.g., `1,222` / `1,734`)
- Column headers: "cart ▸ Category" | "Value"
- Sort dropdown: "Top 12 ▾"
- Legend: Colored squares for current, hatched squares for previous

**Hover Tooltip:**
- Left color accent bar
- **Line 1:** Metric name in bold (e.g., "Purchase Completed [Total Events]")
- **Line 2:** Category name (e.g., "sneakers")
- **Current period section:**
  - Solid colored square icon
  - Date range (e.g., "May 2 2023 – May 31 2023")
  - Value in bold (e.g., `1,734 events`)
  - Change badge: green for positive (e.g., `+41.9% from previous period`)
- **Previous period section:**
  - Hatched square icon
  - Date range (e.g., "Apr 2 2023 – Apr 30 2023")
  - Value (e.g., `1,222 events`)

### 3.6 KPI Metric Card — Percentage Change

**Used in:** Revenue Growth

**Visual Spec:**
- Card with centered content
- Metric label with colored square (e.g., "■ Purchase Completed [Sum of cart ▸ Price]")
- **Hero number:** Extra-large bold percentage with sign (e.g., `+26.3%`)
  - Green (#1B8C5A) for positive growth
  - Red for negative
- **Comparison line:** Small monospace text: `206.2K compared to 163.3K`
- Subtitle: "Total, Last 7 days compared to previous week"

### 3.7 KPI Metric Card — Absolute Value

**Used in:** Average Order Value, Average Revenue Per User

**Visual Spec:**
- Card with centered content
- Metric label with colored square (e.g., "■ AOV ($)" or "■ ARPU ($)")
- **Hero number:** Extra-large bold number (e.g., `152.63`, `46.97`)
  - Dark/black color for the value
- **Change badge below:** Small pill/badge:
  - Red background + down arrow for decrease (e.g., `↓ 1.19%`)
  - Green background + up arrow for increase (e.g., `↑ 8.55%`)
- Subtitle: "Total, Last 7 days compared to previous week"

### 3.8 KPI Metric Card — Big Number (Event Count)

**Used in:** Purchases in the Last Month

**Visual Spec:**
- Metric label with colored square (e.g., "■ Purchase Completed [Total Events]")
- **Hero number:** Extra-large bold count (e.g., `5,079`)
- **Unit label:** Below number in smaller gray text (e.g., "events")
- Subtitle: "Total, Last 30 days"

### 3.9 KPI Metric Card — Funnel Conversion Rate

**Used in:** Funnel Conversion

**Visual Spec:**
- Report type icon (funnel icon, orange/red)
- Title: "Funnel Conversion"
- Subtitle: "3-step Funnel · Last 30 days compared to prev…"
- Funnel path label with colored square (e.g., "■ Product Viewed through Purchase Completed")
- **Hero number:** Extra-large bold percentage (e.g., `7.22%`)
- **Unit label:** "converted" below
- **Change badge:** Green pill (e.g., `↑ 51.57%`)

### 3.10 KPI Metric Card — Dual Metric (Side-by-Side)

**Used in:** Active and New Purchasers

**Visual Spec:**
- Card split into two halves with a vertical divider
- Each half contains:
  - Metric label with colored dot (e.g., "■ A. Purchase Compl…" | "■ B. New Purchasers")
  - **Large number:** Bold (e.g., `3,492` | `447`)
  - **Unit:** "users" in gray below
  - **Change badge:** Green pill with up arrow (e.g., `↑ 15.97%` | `↑ 18.25%`)
- Subtitle: "Unique, Last 30 days compared to previous m…"

### 3.11 Distribution Chart (Table + Bar Hybrid)

**Used in:** Number of Times Users Purchased, Time to Purchase Distribution

**Visual Spec:**
- Two-column layout: "Distribution" (or "Time to Convert") | "Value"
- Each row contains:
  - Category label (e.g., "1 time", "2 times" or "0 – <1 Days", "1 – <2 Days")
  - Horizontal bar (proportional to value)
  - Numeric value to the right (e.g., `2,578` or `83.78%`)
- Bars colored from categorical palette (each row different color)
- Sort/filter: "First 12 ▾" dropdown
- Legend: Inline colored squares + category names + "+N More"

### 3.12 Flow / Sankey Chart

**Used in:** User Purchase Flow

**Visual Spec:**
- Multi-step flow visualization (8-step Flow)
- Columns represent steps: "A Product Vi…", "A + 1", "A + 2", "A + 3", then "B - 3", "B - 2", "B - 1"
- Each step column shows ranked events:
  - Event name with icon (sparkle icon for events, grid icon for "Other events")
  - Percentage + count (e.g., "47.37% 4,857")
  - Small colored bar (purple) below each event
- Flow lines/curves connecting events across steps (light purple/gray)
- Drop-off indicators at bottom of each column:
  - Circle icon + "Drop-off"
  - Percentage + count (e.g., "1.92% 197")
  - Small colored bar below
- Header: "User Purchase Flow" with flow icon (squiggly lines)
- Subtitle: "8-step Flow · Last 30 days"

### 3.13 Retention Curve

**Used in:** Purchase Retention

**Visual Spec:**
- Single line chart showing retention decay
- Solid line transitions to dashed line (indicating projected/incomplete data)
- X-axis: Week intervals ("< 1 Week", "Week 1", "Week 2", "Week 3", "Week 4")
- X-axis sublabel: "X and more weeks later your Users came back and did B."
- Y-axis: Percentage (40%–60% range)
- Legend: "■ Weighted Average Value"
- Line color: Purple/blue (#7B61FF)
- Data points: Dots at each week marker
- Report type icon: Grid/retention icon (green)
- Subtitle: "Retention Rate, Last 30 days"

### 3.14 Data Table

**Used in:** LTV / CAC by channel

**Visual Spec:**
- Column headers: "UTM Source" | "A User LTV (…)" | "B CAC (Ad …)"
  - Sub-headers: "Sum of cart …" | "Sum of cost …"
- Sort indicator: "Top 12 · A ▾"
- Rows: One per channel (e.g., $organic, google ads, facebook, instagram…)
- "Overall" summary row at bottom with totals
- Values: Right-aligned numbers with thousands separators (e.g., `1,119,656`)
- Missing values shown as "-"
- Progress bar/sparkline may appear in header area
- Report type icon: insights/chart icon
- Subtitle: "Last 3 months"

---

## 4. Color System

### Categorical Palette (for series/segments)
| Token           | Hex (approx) | Usage                        |
|-----------------|-------------- |------------------------------|
| Purple Primary  | #7B61FF       | Default first series, funnel bars, data points |
| Coral Red       | #F25C5C       | 2nd series, negative badges  |
| Teal            | #4ECDC4       | 3rd series, retention        |
| Orange          | #F5A623       | 4th series                   |
| Pink/Salmon     | #FF6B8A       | 5th series                   |
| Light Blue      | #5DADE2       | 6th series                   |
| Yellow/Gold     | #F0C75E       | Additional series            |
| Green           | #2ECC71       | Additional series            |

### Semantic Colors
| Token                  | Hex (approx) | Usage                              |
|------------------------|--------------|------------------------------------|
| Positive / Growth      | #1B8C5A      | Up arrows, positive % change       |
| Positive Badge BG      | #E8F5E9      | Light green background on badges   |
| Negative / Decline     | #D32F2F      | Down arrows, negative % change     |
| Negative Badge BG      | #FFEBEE      | Light red/pink background on badges|
| Text Primary           | #1A1A1A      | Titles, hero numbers               |
| Text Secondary         | #6B7280      | Subtitles, axis labels             |
| Border/Grid            | #E5E7EB      | Card borders, chart gridlines      |
| Background             | #F9FAFB      | Board background                   |
| Card Background        | #FFFFFF      | Chart card fill                    |

---

## 5. Tooltip Pattern (Universal)

All chart tooltips follow a consistent structure:
```
┌──────────────────────────────────────┐
│ ▎ Metric Name [Aggregation]          │  ← Bold, with left accent bar
│   Segment / Category Name            │  ← Regular weight
│                                      │
│   Date Range (if time-based)         │  ← Gray text
│   VALUE  unit                        │  ← Large bold number + unit
│   ±XX.XX%  from previous {period}    │  ← Colored change badge
│                                      │
│   (If comparison enabled:)           │
│   ▨ Previous Period Date Range       │  ← Hatched icon
│     PREVIOUS_VALUE  unit             │
└──────────────────────────────────────┘
```

### Tooltip Variants by Chart Type:
- **Line Chart:** Metric name → Date range → Value → % change from previous period
- **Funnel Bar:** Segment name → Conversion % → Aggregate value
- **Horizontal Bar (simple):** Metric name → Category → Value → % of overall
- **Horizontal Bar (comparison):** Metric name → Category → Current value + change → Previous value
- **Multi-line (funnel):** Funnel name → Segment → Date → Conversion % → Users → % change

---

## 6. Interaction Patterns

### Dashboard Level
- **Hover on card:** Shows three-dot menu (⋮) in top-right corner
- **Click on card title:** Opens expanded editor view
- **Hover on chart elements:** Shows tooltip with contextual data
- **Time range pills:** Click to change the date range for all cards

### Expanded View
- **Right panel tabs:** Query | Chart | Annotations
- **Report type tabs:** Insights | Funnels | Flows
- **Chart type dropdown:** Line ▾ (can switch to bar, table, etc.)
- **Granularity dropdown:** Day ▾ / Week ▾
- **View toggles (4 icons):** Chart+Table | Chart only | Table only | Annotations
- **Close button:** Returns to dashboard (prompts if unsaved changes)
- **Save As New / Save:** Persist changes

### Funnel-Specific Controls
- **Funnel Steps dropdown:** Shows "Funnel Steps ▾"
- **Settings gear icon:** Additional configuration
- **Step definition:** Numbered circles (1, 2, 3) with event names and "then" connectors
- **Window:** Configurable conversion window (e.g., 7 days)
- **Metric selector:** Conversion Rate ▾, All Steps ▾
- **Breakdown:** Property dropdown for segment analysis

---

## 7. Card Type Icons

| Icon                | Chart Type          |
|---------------------|---------------------|
| 📊 (line chart)     | Insights / Line     |
| 📉 (funnel icon)    | Funnel reports      |
| 🌊 (wave icon)      | Flow reports        |
| ♻️ (grid icon)      | Retention reports   |
| 📋 (table icon)     | Data tables         |

---

## 8. Typography

| Element              | Weight    | Size (approx) |
|----------------------|-----------|----------------|
| Board Title (H1)     | Bold      | 32–36px        |
| Section Heading (H2) | Bold      | 24–28px        |
| Card Title           | Semi-bold | 16–18px        |
| Card Subtitle        | Regular   | 13–14px        |
| Hero KPI Number      | Bold      | 48–64px        |
| Axis Labels          | Regular   | 11–12px        |
| Tooltip Title        | Semi-bold | 14px           |
| Tooltip Value        | Bold/Mono | 14–16px        |
| Change Badge         | Semi-bold | 12–13px        |