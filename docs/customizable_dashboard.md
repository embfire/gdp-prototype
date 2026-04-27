# Customizable Dashboard — Proposition

## Why Customization

The case for a customizable dashboard is grounded in three things: customer pain, user diversity, and competitive positioning.

### Customer Pain (Dovetail Evidence)

The #2 pain point from customer interviews is rigid, pre-canned reporting:

> "The Punch dashboard today is a little bit limiting. There's a lot of pre-canned reports, but you can't maybe add or look by different KPIs." — Joanna, Zaxby's

> "I find static screenshots of data points in time to be a little bit less helpful — you need to be able to track the changes in time." — Raymond, PAG

A fixed dashboard solves half the problem (self-serve > quarterly delivery). A customizable dashboard solves the other half (my KPIs > your KPIs).

### User Diversity

The analytics research identifies two user intents that demand different dashboard configurations:

| User | Role | What They Pin to Their Dashboard |
|------|------|----------------------------------|
| **Strategic** | CMO, VP Marketing, CEO | Total Guests, LTV (loyalty vs. non-loyalty), Repeat Rate, Revenue Concentration |
| **Operational** | CRM manager, loyalty coordinator | Active Guests, Campaign Performance, At-Risk Count, Segment Health |

Beyond role differences, every brand has a different "north star":
- **Condado Tacos** would pin Menu Item Retention Rate (menu analytics drove their most successful LTO)
- **Graeter's** would pin the Location Scoreboard (store teams compete on loyalty enrollment)
- **Zaxby's** would pin Incrementality metrics (their top priority is proving loyalty drives incremental visits)
- **Luna Grill** would pin Segment-level metrics (they think in archetypes: light, medium, heavy users)

A single fixed layout cannot serve all of these well.

### Competitive Positioning

| Platform | Dashboard Approach |
|----------|--------------------|
| **Punchh (today)** | Fixed quarterly report slides — no self-serve, no customization |
| **Bikky** | Fixed dashboard pages — self-serve but one-size-fits-all |
| **Olo Engage** | Tableau-based — flexible but requires technical skill |
| **Stripe** | Customizable widget grid — Add, Edit, Remove, Rearrange |
| **GDP (proposed)** | Customizable widget grid with smart defaults and curated card library |

Stripe's model is the gold standard for dashboard customization in SaaS. It proves that a widget-based grid with Add/Edit controls works for both power users and casual users. GDP should follow this pattern.

---

## Customization Model

### Core Mechanics

1. **Default state:** The dashboard ships pre-populated with a curated set of KPI cards and charts. Users get immediate value without configuration.
2. **Edit mode:** An "Edit" button (top-right, Stripe pattern) toggles the dashboard into edit mode where users can:
   - **Add** new cards from a curated library
   - **Remove** cards they don't need
   - **Rearrange** cards via drag-and-drop
   - **Resize** cards between 1x1 (standard) and 2x1 (double-width)
3. **Save state:** Layout persists per user (or per organization, depending on multi-tenancy model). Leaving edit mode saves automatically.

### Card Library (Not Freeform)

Users pick from a curated library of pre-built widget cards — they do not build custom metrics. This is a deliberate constraint:

- Avoids the "AI chatbot gives wrong data" problem customers already flagged (pain point #6)
- Guarantees data quality and consistent calculation methodology
- Keeps the interaction model consistent (every card supports click-to-drill)
- Reduces engineering complexity vs. a custom metric builder

The library is organized by analytics domain, mirroring the navigation structure:

| Domain | Available Cards |
|--------|----------------|
| **Guests** | Total Guests, Active Guests (30/90/180d), New Guests, Guest Lifecycle Funnel, Frequency Distribution, Identification Rate, Loyalty vs. Non-Loyalty Split |
| **Retention** | Repeat Rate, Avg Days to 2nd Visit, Habitual Guest %, Visit Frequency Trend, Engagement Funnel (mini), Retention Cohort (mini) |
| **At Risk** | Late Guests %, Churned Guests %, Churn Rate Trend, Intervention Tier Breakdown, Predicted Revenue at Risk |
| **Revenue** | Total Revenue, Revenue per Guest, Avg Check Size, Avg GLV, Spend Lift, Revenue Concentration ("Top 20% = X%"), Revenue by Lifecycle Stage |
| **Menu** | Avg Item Retention Rate, Avg Item Reorder Rate, Top Retaining Items, Top Churning Items |
| **Locations** | Top/Bottom Performers (mini scoreboard), Participation Rate by Location, Location Lifecycle Heatmap (mini) |
| **Campaigns** | Active Campaigns, Campaign Revenue Attributed, Best Performing Campaign, Channel Performance Summary |
| **Ava / AI** | What Changed This Week, Alerts & Anomalies |

Each card in the library includes a preview thumbnail and a one-line description so users understand what they're adding.

### Role-Based Default Presets

Rather than starting every user from the same layout, ship 2–3 default templates:

**Executive View (default for CMO, VP, CEO roles)**
| Row 1 | Row 2 | Row 3 |
|-------|-------|-------|
| Total Guests | Repeat Rate | Avg GLV |
| Revenue Concentration (2x1) | Spend Lift |
| What Changed This Week (2x1) | Top/Bottom Locations |

**Marketing Ops View (default for CRM, loyalty coordinator roles)**
| Row 1 | Row 2 | Row 3 |
|-------|-------|-------|
| Active Guests (90d) | Late Guests % | New Guests |
| Engagement Funnel (2x1) | Churn Rate Trend |
| Active Campaigns | Campaign Revenue | Intervention Tier Breakdown |

**Location Manager View (default for regional/store managers)**
| Row 1 | Row 2 | Row 3 |
|-------|-------|-------|
| Total Guests | Repeat Rate | Participation Rate |
| Top/Bottom Performers (2x1) | New Guests Trend |
| Lifecycle Heatmap (2x1) | Avg Check Size |

Users can switch between presets or start from one and customize it. The goal: **80% of users never need to customize** because the defaults match their role.

---

## Grid System

### 1:1 Aspect Ratio — Dashboard Only

All chart cards on the dashboard use a uniform square (1:1) aspect ratio as the base unit. This applies **only to the dashboard**, not to dedicated analytics pages.

**Why 1:1 works for the dashboard:**
- Clean visual rhythm — every row aligns regardless of content
- Drag-and-drop rearrangement is intuitive (no Tetris-style fitting)
- Forces information density discipline — each widget must earn its space
- Simpler responsive behavior: 3 columns → 2 columns → 1 column

**Why dedicated analytics pages are different:**
- A retention cohort table naturally needs width
- An engagement funnel needs height
- Time series charts need a 2:1 or 3:1 ratio for readability
- Those pages are purpose-built for deep analysis and need layout flexibility

### Card Sizes

Two sizes, both based on the 1:1 unit:

| Size | Dimensions | Use For |
|------|-----------|---------|
| **1x1** | Standard square | KPI cards with sparkline, small charts, compact lists |
| **2x1** | Double width, same height | Lifecycle funnel, What Changed (Ava), Location scoreboard, wider trend charts |

Height is always uniform so rows align cleanly. No 1x2 (tall) cards — if content needs vertical space, it belongs on a dedicated page.

### Responsive Breakpoints

| Viewport | Columns | Card Behavior |
|----------|---------|---------------|
| Desktop (≥1200px) | 3 columns | 1x1 = 1 column, 2x1 = 2 columns |
| Tablet (768–1199px) | 2 columns | 1x1 = 1 column, 2x1 = full width |
| Mobile (<768px) | 1 column | All cards stack full width |

---

## Interaction Model Preserved

Customization changes **what's shown**, not **how it behaves**. Every card, whether default or user-added, follows the same interaction patterns from the analytics proposition:

| Interaction | Behavior |
|-------------|----------|
| **Click KPI card** | Slide-out detail panel (Pattern 1) with "Why it changed", contributing factors, and action buttons |
| **Click chart data point** | Filtered guest list with [Create Segment], [View Guests], [Export CSV] |
| **Ava cards** | Inline action buttons: [Create Segment], [Compare Locations], [View Guests] |
| **Global filter bar** | Date range, Location/Group, Loyalty Status — applies to all cards on the dashboard |

The detail panel and drill-down always link to the relevant dedicated analytics page for deeper exploration (e.g., clicking the Repeat Rate card's detail panel includes a "Go to Retention page →" link).

---

## Scope & Phasing

### Phase 1 (MVP): Widget Architecture, Fixed Layout

- Build every dashboard card as a **self-contained widget component** (isolated data fetching, standard sizing interface, consistent click-to-drill behavior)
- Ship the dashboard with a fixed default layout matching the current Dashboard spec
- No edit mode, no drag-and-drop, no card library UI

This is the architectural bet. Building cards as widgets from day one means customization is a UI layer addition later, not a rebuild.

### Phase 1.5 (Fast Follow): Customization UI

- Add "Edit" mode toggle (top-right button)
- Card library panel (slide-out or modal) organized by domain
- Drag-and-drop rearrangement within the grid
- Add / Remove cards
- 1x1 ↔ 2x1 resize toggle per card
- Layout persistence (per-user)
- 2–3 role-based default presets with "Reset to default" option

### Phase 2: Advanced

- Organization-level default layouts (admin sets the default for all users of a role)
- Shared dashboard links ("Here's my dashboard view")
- Scheduled email snapshots of a user's customized dashboard (the "daily visual" Eugene described)
- Custom date range per card (most cards follow the global filter, but allow per-card override)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Blank canvas anxiety** — users don't know what to add | Ship with strong defaults. Role-based presets. "Reset to default" always available. |
| **Poor self-configuration** — users remove important cards and miss critical signals | Ava alerts are not removable (or prompt confirmation: "This card surfaces anomalies — are you sure?"). Anomaly notifications also appear in a separate notification center, not just the dashboard. |
| **Engineering complexity delays Phase 1** | Phase 1 ships with fixed layout. Customization is Phase 1.5. The only Phase 1 requirement is building cards as isolated widget components. |
| **Performance with many cards** | Lazy-load cards below the fold. Pre-compute KPI values (already planned per the analytics proposition). Limit maximum cards per dashboard (e.g., 12–15). |
| **Multi-tenancy complexity** | Start with per-user persistence. Org-level defaults are Phase 2. |

---

## Reference: Stripe's Dashboard Pattern

Stripe's "Your overview" page demonstrates the target UX:

- **Top bar:** Period selector (Last 7 days), comparison toggle (Previous period), granularity (Daily), Add/Edit buttons
- **Grid:** Mix of 1x1 and 2x1 cards — KPI summaries, sparkline charts, compact lists, trend visualizations
- **Card types:** Metric + chart combos (Gross volume), status lists (Failed payments), ranked lists (Top customers by spend), counters with sparklines (New customers)
- **Uniform row height:** Cards in the same row share height regardless of content type
- **Clean information hierarchy:** Each card has a clear title, primary metric, secondary context (vs. previous period), and a "View more" link to the dedicated page

GDP should follow this pattern while adding the restaurant-specific card library and the click-to-drill interaction model (slide-out panels, Create Segment actions) that Stripe doesn't need but GDP's users require.
