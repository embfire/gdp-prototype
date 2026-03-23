# Analytics Interaction Model: Drill-Down, Slice, Segment & Action

## Overview

This document defines the interaction model for GDP analytics pages. It covers how users explore data (slice and segment), drill into insights (drill-down patterns), and take action directly from analytics — without leaving the page or navigating to a separate workflow.

The core principle: **action buttons must appear at the moment of understanding, not in a separate workflow.**

---

## Slice vs. Segment

Slice and Segment are both ways of breaking down a metric by a dimension, but they serve different analytical purposes.

### Slice — Filter Down to a Subset

Slicing takes the full dataset and narrows it to show only rows that match a specific dimension value. You're restricting scope.

- **Question it answers:** "How is this specific group performing?"
- **User intent:** Focus, investigate
- **Think of it as:** A `WHERE` clause
- **Example:** "Show me visit latency, but only for the Dallas location."
- **Result:** One number/chart, scoped to the filtered subset

**In the UI:** Slicing is controlled by the **global filter bar** at the top of every page. When the user selects "Dallas, TX" in the location filter, the entire page re-renders scoped to Dallas. Every chart, every KPI card, every table reflects only Dallas data.

### Segment — Split the Metric by a Dimension

Segmenting takes the full dataset and breaks the metric into groups side by side, one per dimension value. You're not narrowing — you're comparing.

- **Question it answers:** "How do different groups compare?"
- **User intent:** Compare, discover patterns
- **Think of it as:** A `GROUP BY` clause
- **Example:** "Show me visit latency, broken out by Location Type."
- **Result:** Multiple lines or bars, one per segment value

**In the UI:** Segmenting is controlled by a **"Segment by" dropdown** on each chart or section. When the user selects "Segment by: Channel," the chart splits into multiple series (POS, Mobile App, Web Ordering). When they select "None," it shows the aggregate.

### How They Work Together

Users combine slice and segment for powerful two-step drill-downs:

```
┌─ Filter Bar (SLICE) ──────────────────────────────────┐
│ Last 30 days ▾  │  Dallas, TX ▾  │  All channels ▾    │
└────────────────────────────────────────────────────────┘
         ↓ Everything below is scoped to Dallas

┌─ Chart: Return Rate ──────────────────────────────────┐
│                                                        │
│  Overall: 38.2%                                        │
│                                                        │
│  [Segment by: Channel ▾]  ← user selects this         │
│                                                        │
│  ── POS: 42.1%                                         │
│  ── Mobile App: 35.8%                                  │
│  ── Web Ordering: 31.2%                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

The user sliced to Dallas (filter bar), then segmented by Channel (chart dropdown). They're asking: "Within Dallas, how do channels compare on retention?"

### Available Dimensions for Slice and Segment

Both slice and segment should support the same dimension set:

- **Location** (individual location or location group)
- **Channel** (POS, Mobile App, Web Ordering, Delivery, 3rd Party)
- **Daypart** (Breakfast, Lunch, Afternoon, Dinner, Late Night)
- **Loyalty Status** (Loyalty member, Non-loyalty)
- **Guest Frequency** (Daily, Weekly, Monthly, Quarterly, Irregular)
- **Order Type** (Dine-in, Takeout, Delivery)
- **Segment** (any saved audience segment)

---

## Drill-Down Patterns

Drill-down is the UX that takes users from a high-level metric to the underlying detail. Every drill-down should follow a three-step arc:

### The Insight → Context → Action Framework

**Step 1 — Insight (the hook):** Something catches the user's eye on the dashboard or analytics page.

> "Churn rate is up 1.8% this month."

**Step 2 — Context (the why):** One click gives them the explanation — what's driving the change.

> "1,200 guests who visited in late January haven't returned. They're concentrated at Midtown and Eastgate — both locations saw menu changes last week."

**Step 3 — Action (the payoff):** From that same view, they can do something about it.

> [Create Segment] → [View Guests] → [Ask Ava]

### Pattern 1: Click Metric Card → Slide-Out Detail Panel

The user clicks a KPI card on the dashboard or any analytics page. A panel slides in from the right with context and actions. The user never leaves the page.

```
┌─ Dashboard ──────────────────────────────────────┐
│                                                   │
│  ┌─────────────┐   ┌──── Detail Panel ──────────┐│
│  │ Churn Rate   │   │                            ││
│  │ 12.3% ↑1.8% │──→│ Churn Rate Detail           ││
│  └─────────────┘   │                            ││
│                     │ Why it changed:            ││
│  other cards...     │ • Midtown: 18.4% (+3.2%)  ││
│                     │ • Eastgate: 16.1% (+2.8%) ││
│                     │ • Menu change on Jan 28    ││
│                     │                            ││
│                     │ 8,200 guests at risk       ││
│                     │                            ││
│                     │ [Create Segment]           ││
│                     │ [View Guests]              ││
│                     │ [Ask Ava: Why?]            ││
│                     │ [Go to At Risk page →]     ││
│                     └────────────────────────────┘│
└───────────────────────────────────────────────────┘
```

**When to use:** Dashboard cards, KPI metric cards on any page.
**Key detail:** The panel should include a link to the full analytics page for deeper investigation ("Go to At Risk page →").

### Pattern 2: Click Chart Data Point → Filtered Guest List

On any analytics page, the user clicks a specific bar, line segment, or data point in a chart. A filtered guest list appears below the chart with action buttons.

```
Frequency Distribution
├── Daily: 0.4%
├── Weekly: 2.8%
├── Monthly: 7.6%
├── Quarterly: 14.4%  ← user clicks this bar
└── Irregular: 74.8%

         ↓ Expands below the chart

┌─ Quarterly Guests (180,412) ──────────────────────┐
│ These guests visit ~4x/year. Converting them       │
│ to monthly would increase revenue by est. $2.1M    │
│                                                     │
│ [Create Segment]  [View Guests]  [Export CSV]       │
│                                                     │
│ Guest ID  │ Last Visit │ LTV    │ Visits │ Status   │
│ #G-48291  │ Feb 12     │ $340   │ 4      │ Active   │
│ #G-12847  │ Jan 28     │ $290   │ 3      │ Late     │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

**When to use:** Bar charts, funnel charts, heatmap cells, cohort table cells.
**Key detail:** The insight text ("Converting them to monthly would increase revenue by est. $2.1M") adds context that makes the action feel justified.

### Pattern 3: Ava Suggests Actions Alongside Insights

Ava (the AI assistant) proactively surfaces insights with suggested next steps. Each suggestion includes an action button.

```
┌─ What Changed This Week ──────────────────────────┐
│ AI   Week of Mar 3-9                               │
│                                                     │
│ • Repeat rate fell 2.3 pts                          │
│   1,200 guests from January haven't returned.       │
│   Concentrated at Midtown and Eastgate.             │
│                                                     │
│   [Create win-back segment (1,200 guests)]          │
│   [Compare Midtown vs. Eastgate]                    │
│   [See menu changes at these locations]             │
│                                                     │
│ • New guest acquisition up 8.7%                     │
│   Downtown and Westside drove the lift — both       │
│   ran in-app promotions this week.                  │
│                                                     │
│   [View new guest profiles]                         │
│   [Check loyalty enrollment rate]                   │
└─────────────────────────────────────────────────────┘
```

**When to use:** Dashboard "What Changed" card, Ava chat responses, alert notifications.
**Key detail:** Ava doesn't just explain — she offers the next step. One click from insight to action.

---

## The Three Universal Actions

Every drill-down, regardless of pattern, should surface some combination of these three actions:

| Action | What It Does | Why It Matters |
|--------|-------------|----------------|
| **Create Segment** | Saves the filtered guest group as a named, reusable segment. Pre-fills the segment builder with the current filter criteria. | Bridges analytics → marketing. The user goes from "I see a problem" to "I have an audience I can act on." |
| **View Guests** | Navigates to the Profiles page filtered to show the specific guests behind the metric. | Lets operators validate the data and see real people, not just numbers. Builds trust. |
| **Ask Ava** | Opens Ava with a pre-filled question about the current metric or data point. | Enables deeper investigation without the user having to formulate the question. |

For future integration (not MVP):

| Action | What It Does |
|--------|-------------|
| **Send to Campaign** | Auto-creates a segment and opens the campaign builder (Punchh) with that segment pre-selected. Combines Create Segment + campaign launch into one step. |

---

## The Full User Flow

Putting it all together, the complete analytics interaction arc is:

```
1. OVERVIEW     See the high-level metric (dashboard or analytics page)
       │
       ▼
2. SEGMENT      Break it out by dimension ("Segment by: Location")
       │         to find where the problem/opportunity is
       ▼
3. SLICE        Focus on the specific group (click Midtown → filters update)
       │
       ▼
4. DRILL-DOWN   Click the metric or chart to see the detail panel
       │         with context (why it changed) and guest-level data
       ▼
5. ACT          Create Segment / View Guests / Ask Ava
```

Each step uses a different interaction: segment dropdown, filter bar, click-to-drill, action buttons. The user can enter at any step and skip steps depending on what they already know.

---

## Design Implications

### For Every Analytics Page

1. **Global filter bar** at the top (slice controls) — consistent across all pages
2. **"Segment by" dropdown** on each chart section — lets users split any metric by dimension
3. **Clickable data points** — every bar, line segment, funnel step, heatmap cell, and table row should be interactive
4. **Action buttons** appear at every drill-down touchpoint (slide-out panels, expanded sections, Ava insights)

### For the Dashboard

1. **Metric cards are clickable** — clicking opens a slide-out detail panel
2. **Ava insight cards** include action buttons inline
3. **"Segment by" is less relevant here** (cards are small) — save it for full analytics pages

### For Figma Designs

Design these states for each analytics page:

- **Default state:** Page with charts showing aggregate data
- **Segmented state:** One chart showing data split by a dimension
- **Drill-down state:** Slide-out panel or expanded section visible
- **Action state:** Create Segment dialog or Profiles page with pre-applied filter

---

## Differentiator Summary

Most analytics tools stop at Step 2 (segment/compare). The user sees the data, understands the pattern, but then has to leave the tool, open a marketing platform, manually recreate the audience, and set up a campaign. The insight dies in that gap.

GDP's differentiator: **every insight is one click from "Create Segment" and two clicks from a campaign.** The analytics and action layers are unified, not separate workflows.
