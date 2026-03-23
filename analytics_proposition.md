# GDP Analytics — Research & Page Structure Proposal (v3)

## What Changed in v3

This revision incorporates learnings from the **PAG Metric Placement Exercise** (March 2025), where ~18 participants ranked analytics metrics by importance. Key changes:

1. **Phase re-prioritization** — Guests > Acquisition moved to Phase 1 (ranked #1 metric by participants at 78% selection rate). Menu > Performance moved to Phase 2.
2. **Dedicated page layout model** — Dedicated analytics pages now use chart-blocks with embedded headline metrics instead of small KPI cards. The Dashboard retains KPI cards as the scan layer. Rationale: users navigate to dedicated pages to focus — the layout should reflect that shift from scanning to analysis.
3. **PAG validation notes** — Added exercise data and interpretive context (including Lynn's structural observations) to the MVP Prioritization section.
4. **New chart components** — Loyalty Penetration added to Guest Overview (ranked #6 at 67% selection). Churn Risk Score added to At Risk (39% selection).

### What Changed in v2

v2 integrated four data sources into the original research:

1. **Customer interviews (Dovetail)** — Direct quotes from Condado Tacos, Zaxby's, Luna Grill, Graeter's, Charley's, and PAR Advisory Group participants across 7 research themes
2. **CDP Model Blueprint** — The actual data attributes available across PAR Loyalty, PAR Pay, PAR POS, and PAR Ordering
3. **QBR Data Dictionary** — Every metric Punchh currently calculates and reports quarterly
4. **Anil Raparla's framework** — User intent model (strategic vs. operational), product line matrix, metric dicing patterns
5. **Drill-down & slice interaction model** — The UX framework for how users explore, compare, and act on data

The result: every proposed page is now grounded in (a) what customers said they need, (b) what data we actually have, (c) what Punchh already reports, and (d) how users will interact with it.

---

## Table of Contents

- [User Intent Model](#user-intent-model)
- [Customer Pain Points — The Case for GDP Analytics](#customer-pain-points)
- [Current State: What Punchh Reports Today](#current-state-what-punchh-reports-today)
- [Gap Analysis: What Customers Want vs. What Exists](#gap-analysis)
- [Competitor Analysis](#competitor-analysis)
- [Industry Research Findings](#industry-research-findings)
- [Proposed Analytics Structure](#proposed-analytics-structure)
- [Interaction Model: Slice, Segment, Drill-Down & Act](#interaction-model)
- [Page-by-Page Breakdown](#page-by-page-breakdown)
- [Product Line Considerations](#product-line-considerations)
- [MVP Prioritization](#mvp-prioritization)
- [How This Differs from Bikky and Punchh](#how-this-differs-from-bikky-and-punchh)

---

## User Intent Model

Based on Anil's framework, GDP analytics must serve two fundamentally different user intents. The page structure, interaction model, and metric surfacing must account for both.

### Strategic Users — "Help me understand"

- **Persona:** CMO, VP Marketing, Head of Loyalty, Brand leadership
- **Behavior:** Exploratory. They browse, compare, look for patterns. Sometimes they have a target ("drive holiday sales"), sometimes they come with open curiosity.
- **Needs:**
  - Trends over time (not just point-in-time snapshots)
  - Benchmarks (vs. prior period, vs. cohort, vs. industry)
  - Ability to slice and dice across dimensions
  - Product-surfaced insights — they don't want to hunt, they want the system to flag what changed
- **Customer evidence:** Eugene (PAR) described the CMO texting during a board meeting: *"What is the most up-to-date LTV for loyalty and non-loyalty?"* Evan (Condado Tacos) described the CEO receiving weekly Bikky reports with lifecycle stage breakdowns.

### Operational Users — "Help me do"

- **Persona:** CRM manager, loyalty coordinator, campaign operator, marketing analyst
- **Behavior:** Task-driven. They execute workflows — find a segment, create a campaign, analyze results, report to leadership.
- **Needs:**
  - Context-specific metrics tied to the workflow they just executed
  - End-to-end automation: find users → create segment → schedule campaign → analyze results
  - Quick access to campaign performance and segment health
  - Exportable data for leadership reporting
- **Customer evidence:** April (Charley's) described her reality: *"We are doing a lot of reactive work — the most ideal scenario is that we would have some sort of data platform that could help us be more proactive."* Evan (Condado Tacos) described manually screenshotting Bikky data and reformatting it for board presentations.

### Design Implication

Every analytics page must serve both intents, but the layout differs by context:

- **Dashboard (scan mode):** KPI cards with sparkline trends and benchmark indicators. Small, scannable, clickable — each card is a door into a deeper page. Users haven't committed to a topic yet.
- **Dedicated pages (focus mode):** Chart-blocks with embedded headline metrics. Each chart leads with its key number (large, with trend indicator) and the full visualization sits immediately below. Users navigated here intentionally — the layout respects that shift from scanning to analysis.
- **Both layers share:** Segmentation dropdowns, benchmark comparisons, AI-surfaced insights, clickable drill-downs to guest lists, "Create Segment" buttons at every insight, exportable tables, "Ask Ava" pre-filled prompts.

---

## Customer Pain Points

Seven pain points emerged consistently from Dovetail interviews. These are the problems GDP analytics must solve — in priority order by frequency and intensity.

### 1. No Visibility Into Non-Loyalty Guests (the #1 structural gap)

> "We do value our Punch system to give us data for loyalty members, but we do not understand our non-loyalty members — which is over 80% of sales."

> "We know the value of a loyalty guest, but we don't really know the value of an anonymous guest. So it's hard to actually quantify the value of loyalty in Punch." — Evan, Condado Tacos

**Design response:** Every metric must support a Loyalty Status toggle (Loyalty / Non-loyalty / All). The Guest Overview page must show identification rate and the loyalty vs. non-loyalty value gap.

### 2. Pre-Canned Reports With No Flexibility

> "The Punch dashboard today is a little bit limiting. There's a lot of pre-canned reports, but you can't maybe add or look by different KPIs." — Joanna, Zaxby's

> "I find static screenshots of data points in time to be a little bit less helpful — you need to be able to track the changes in time." — Raymond, PAG

**Design response:** Every chart supports "Segment by" dropdowns and every page has a global filter bar. No static snapshots — all views are interactive and time-aware.

### 3. Report Generation is Too Slow

> "One of our biggest challenges with Punch is the time it takes to generate data. Waiting 30 minutes for a report, even though it might be really cool, is very challenging."

> "If this tool is about delivering insights, I can't be waiting 30 minutes."

**Design response:** Architecture for sub-second dashboard loads. Pre-compute KPI cards. Use progressive disclosure (summary → detail on click) rather than loading everything upfront.

### 4. Manual Work and API Dependency

> "Some of that is screenshots and downloads of Biki, some of it is taking that data and reformatting it for a different audience. For the board, we would typically not use a screenshot — we would make that our own." — Evan, Condado Tacos

**Design response:** Built-in export (CSV, PDF). Shareable dashboard links. Scheduled email reports (the "daily visual" Eugene described wanting).

### 5. Segment-Level Granularity is Missing

> "We want to create a segment of users and then be able to see those behaviors from just a specific segment, versus 'here are your most sold items for the whole program.'" — Maddie, Luna Grill

**Design response:** "Segment" is a first-class filter dimension on every page. Users can apply any saved segment as a lens to view all metrics through.

### 6. AI Tools Produce Unreliable Results for Non-Technical Users

> "We use an AI chatbot with some of our data, and the people who are prompting aren't data scientists. So they don't ask the right questions. And it'll give them incorrect data or correct data, but incorrectly formulated. And that has caused problems for us."

**Design response:** Ava suggests pre-formed questions and actions (not open-ended prompts). Ava cites the underlying data and shows its reasoning. Guardrails against statistically misleading queries.

### 7. Identity Resolution & Cross-Platform Data Integrity

> "We have documents upon documents on how the logic for our ID resolution is set up. And sometimes that doesn't work." — Joanna, Zaxby's

**Design response:** This is primarily a CDP infrastructure problem, not an analytics UI problem. However, the Guest Overview page should surface data quality metrics (identification rate, merge conflicts, data freshness) so users can trust what they see.

---

## Current State: What Punchh Reports Today

### QBR Metrics (Quarterly Business Reviews)

Punchh currently delivers these metrics through quarterly reviews — not through self-serve analytics. Users wait for QBR delivery rather than exploring data themselves.

| Category | Metrics Available Today |
|----------|------------------------|
| **Program Performance** | Signups, Unique Guests, Loyalty Sales, Loyalty Transactions, Avg Checkin Frequency, Avg Checkin Net Purchase Amount, Spend Lift (loyalty vs. anonymous), Participation Rate, Average Discount %, Loyalty Customer Retention Rate, Referral % of Signups |
| **Member Activity** | Active members (30/60/90/180/365 day windows), with benchmarking cohorts by program age |
| **Customer Lifetime Value** | Lifetime spend distribution by cohort (users who joined 90+ days ago), days between signup and most recent checkin |
| **Engagement Ladder** | 12-month engagement funnel: Signup → 1st → 2nd → 3rd → 5th → 10th transaction, with avg days between each step and conversion rates |
| **Frequency Cohorts** | Distribution of users by checkin frequency (1, 2-3, 4-6, 7-10, 11+), with loyalty sales and avg check per bucket |
| **Retention Cohort** | Quarter-over-quarter retention grid (first visit quarter vs. subsequent quarters) |
| **Core Loyalty** | Points earned/converted/expired, total conversions to rewards, discount through redemptions |
| **Tier Performance** | Members per tier, % checked in, total spend, avg spend, avg visits, offer redemptions, cost of redemptions |
| **Channel Metrics** | Online vs. POS vs. Mobile vs. Web checkins, online sales %, order type breakdown |
| **Campaigns** | Mass campaigns sent, targeting events, push notifications sent, campaign emails, redeemables sent, coupon codes generated |
| **Heatmaps** | Checkin/redemption by day-of-week and hour, signup/first-checkin timing, avg spend by day |
| **Benchmarks** | 50th and 75th percentile benchmarks across 25+ KPIs, segmented by program age cohort |
| **Cohort Behavior** | Visit behavior cohort, spend behavior cohort, avg check behavior cohort (all by acquisition quarter) |

### CDP Model — Data Attributes Available

The CDP blueprint documents 5 attribute pillars across 4 PAR data sources:

| Pillar | Source | Key Attributes |
|--------|--------|---------------|
| **Identity Meta** | PAR Loyalty | Name, email, phone, DOB, signup date, device, signup channel, favorite location, address, subscription statuses |
| **Identity Meta** | PAR Ordering | All of the above + vehicle info, latitude/longitude, government ID |
| **Identity Meta** | PAR Pay (Infinicept/Aurus) | Card first 6/last 4, expiry, issuing bank, card network, card type, cardholder name |
| **Transaction Behavior** | PAR Loyalty | Total loyalty transactions/amount, avg/median check, days between transactions, RFM quartiles, favorite items, daypart/day preferences |
| **Transaction Behavior** | PAR Ordering | Total transactions/amount by order type (dine-in, takeout, curbside, delivery), discount metrics by type, items per order, payment method %, tip data, delivery distance, cancellation %, partner channel % |
| **Transaction Behavior** | PAR Pay | Card-based transaction count/amount, credit vs. debit %, preferred day/time |
| **Loyalty Behavior** | PAR Loyalty | Points earned/converted/redeemed, membership tier, days since last points, available points |
| **Engagement** | PAR Loyalty | Campaign participation, email/PN/SMS metrics (sent, opened, clicked, rates), referrals, feedback/ratings, gift cards, subscriptions |
| **Predicted** | PAR Loyalty | Predicted spend (30/60/90 days), predicted CLV |

### Key Observations About Current State

1. **Rich data, poor self-serve access.** Punchh has extensive metrics but they're locked inside quarterly reviews and Tableau views. Customers wait for data instead of exploring it.
2. **Loyalty-only lens.** Every metric in the QBR is scoped to loyalty members. Non-loyalty guests are only visible through Spend Lift (loyalty vs. anonymous check size comparison).
3. **No menu analytics.** The QBR has no item-level reporting — no reorder rate, no retention by item, no item affinity. This is the gap Bikky fills and customers value most for speed-to-insight.
4. **No location-level trend analytics.** QBRs are delivered at the program level. Location-level data exists but isn't explorable interactively with trend comparison.
5. **Engagement ladder exists but isn't actionable.** The 12-month engagement funnel (signup → 1st → 2nd → 3rd → 5th → 10th) is exactly what customers want — but it's a static quarterly snapshot, not an interactive daily view.
6. **Benchmarking infrastructure is sophisticated.** 25+ KPIs are benchmarked by program age cohort at 50th and 75th percentile. This is a competitive advantage — no other CDP competitor surfaces cohort-adjusted benchmarks.
7. **Predicted attributes exist.** Predicted spend (30/60/90 day) and predicted CLV are in the CDP model. These can power the "At Risk" page and Ava insights.

---

## Gap Analysis

What customers told us they need, mapped against what Punchh currently provides.

| Customer Need | Punchh Today | Gap | GDP Must Solve |
|---------------|-------------|-----|---------------|
| Non-loyalty guest visibility | Only Spend Lift comparison | **Critical** | Full guest analytics with loyalty status as a filter dimension |
| Self-serve exploration | QBR delivery + Tableau views | **Critical** | Interactive, filterable, sub-second analytics pages |
| Menu item impact on retention | Not available | **Critical** | Item-level retention rate, reorder rate, churn rate, affinity |
| Visit latency as early warning | Not available as interactive metric | **High** | Avg days between visits, days to 2nd visit, latency trend |
| Location-level trends over time | Static QBR snapshots | **High** | Location scorecard with trend lines, comparison, heatmaps |
| Segment-level metric views | Not available (whole-program only) | **High** | "Segment" as filter dimension on every page |
| Real-time campaign feedback | Campaign data not real-time | **High** | Campaign impact page with revenue attribution |
| Incrementality / control groups | Not available | **Medium** | Campaign page with control group comparison |
| Proactive AI insights | Not available | **Medium** | Ava "What Changed" cards with suggested actions |
| Channel ordering behavior | Checkin channel exists, limited | **Medium** | Order channel analytics across dine-in, online, delivery, 3P |
| Engagement funnel (interactive) | Exists in QBR, static | **Low** | Real-time engagement ladder with click-to-segment |
| Retention cohort (interactive) | Exists in QBR, static | **Low** | Interactive cohort table with click-to-drill |
| Benchmarking | Sophisticated, exists | **Available** | Carry forward and surface in-context on every page |
| RFM scoring | Exists in CDP model | **Available** | Use for guest segmentation and value distribution |
| Predicted CLV / spend | Exists in CDP model | **Available** | Power "At Risk" predictions and dashboard KPIs |

---

## Competitor Analysis

### Bikky — Complete Product Map

Bikky is the #1 CDP for restaurants. Their analytics product is organized into the following sections:

| Section | Subsection | Our Research Coverage |
|---------|------------|----------------------|
| **Trends** | — | Partial (filters + new guests metric only) |
| **Lifecycle** | Overview | Screenshot captured (KPI cards: First-time, Onboarding, Engaged, Late + lifecycle revenue chart + lifecycle locations heatmap) |
| | Acquisition | Missing |
| | Onboarding | Missing |
| | Engagement | Partial (habitual guests, lifecycle/frequency breakdowns) |
| | Churn | Complete (late guests, churned guests, performance by dimension, seasonality, menu item, individual guests) |
| **Cohort Analysis** | — | Missing |
| **Latency** | — | Complete (avg days to 2nd order, days between orders, trends by dimension) |
| **Identifiers** | — | Missing |
| **Demographics** | — | Missing |
| **Revenue** | — | Missing |
| **Menu** | — | Screenshot captured (retention, reorder, churn per item + retention rate chart + menu item table) |
| **Marketing** | — | Missing |
| **Segments** | — | Missing |

#### Bikky — Key Product Capabilities (from marketing site)

**Guest Profiles**
- Unifies data from POS, payment processor, digital ordering, loyalty, kiosk, reservations
- Credit card tracking for cross-channel guest identification
- Visibility on up to 90% of guests (not just loyalty members)
- Tracks: New Guests, Repeat Guests, Recency, Frequency, Average Check, LTV

**Guest Lifecycle**
- Tracks acquisition, engagement, and churn across lifecycle stages
- Isolates impact of: Offers & Promotions, Paid Ads, LTOs, New Markets, New Store Formats, Price Changes
- Measures time and visits to loyalty conversion
- Predicts churn with personalized thresholds per guest (typically 90-120 days)
- Identifies which stores, dayparts, and menu items correlate with churn

**Menu Analysis**
- Goes beyond basic PMIX with guest-level menu analytics
- Core metrics: Retention Rate, Reorder Rate, Attachment Rate, Churn Rate, Guest Acquisition
- LTO analysis: incremental traffic vs. cannibalization
- Item combinations by daypart and channel
- Price change impact analysis

**Demographics**
- Tracks age, gender, income per transaction
- Demographic differences at market/location level
- Menu item performance by demographic group
- Lookalike audience building for acquisition campaigns

**Marketing Automation**
- 80+ restaurant-specific segmentation attributes
- Segmentation by: Order Frequency, Churn Risk, Menu Preferences, Location, Average Check, Lifetime Value
- Channels: Loyalty, Email, SMS, App Notifications
- Tracks conversions, revenue, and incrementality per campaign

**AI Data Assistant**
- Natural language Q&A across: Revenue/Check, Menu, Loyalty, Traffic/Frequency, Locations, Offers/Promotions
- Trained on restaurant-specific data model
- Aligns to brand's comping rules and fiscal calendar

#### What Customers Actually Say About Bikky

Condado Tacos is an active Bikky user. Their feedback reveals both what Bikky gets right and where it falls short:

**Fastest time to value — menu reporting:**
> "The fastest time to value was the menu reporting because we very quickly saw a few things were happening with specific items... the Chicken Bacon Ranch taco has a huge reorder rate for existing guests and has a higher return rate than the average product for new guests." — Evan, Condado Tacos

**Real-time segment feedback:**
> "The Biki segment builder — if you save the segment, it will share it immediately. Every time you change aspects of the segment it'll share like what the LTV is, what their average orders are, and how many people are in the segment as you're building it." — Evan

**Cross-org adoption:**
> "Marketing, FP&A, operations actively uses Biki, and then culinary uses Biki for the menu reporting." — Evan

**Segment builder less flexible than Punchh:**
> "Let's say I want to know everybody who's bought one product in a very specific time frame, but they may have come in more recently. I can build that in Punch, but I can't build that in Biki because of the options they give me." — Evan

---

### Olo Engage — Analytics & Reports

Olo Engage uses Tableau for all reporting. Their analytics include:

| Report | Description |
|--------|-------------|
| **Guest Book Growth Over Time** | Total guest count, opt-in rate, most effective channels for capturing guest data |
| **Guest Book Growth by Location** | Location-specific guest behavior and preference insights |
| **Revenue by GLV Percentile** | Revenue distribution by Guest Lifetime Value, Average Spend Per Visit by cohort |
| **Email Marketing Impact** | Guest engagement through opens/clicks, behavior and revenue attributed to engagement |
| **Email Campaign Trends** | Opens, clicks, unsubscribes, unmailable rates |
| **Email Automations Trends** | Total Sent, Delivered, Clicked, Delivery Rate, Click Rate |
| **SMS Campaign Trends** | Subscriber growth, unsubscribe drivers, SMS strategy optimization |
| **Menu Item Performance** | Top/under-performing items, trends, optimization opportunities |
| **Guest Data Enrichment** | RFM rankings (Recency, Frequency, Monetary), GLV and transaction insights |

---

### Other Competitors

**Thanx**
- 100+ near real-time reports organized around strategic questions
- 15 industry benchmarks in dashboard
- Metrics tied to: activation rates, retention windows, cart conversion, performance by location/lifecycle/menu item
- A/B testing with control groups
- Campaign performance with behavioral outcomes (not just opens/clicks)

**Punchh (PAR Engagement) — Current Offering**
- QBR-based delivery model (quarterly, not self-serve)
- 31+ segment types with infinite combinations — segment builder praised as "elite"
- Benchmarking by program age cohort (50th and 75th percentile)
- 12-month engagement funnel with conversion rates
- Retention cohort by acquisition quarter
- Frequency distribution analysis
- Loyalty-only: no non-loyalty guest analytics
- No menu-level analytics
- No interactive drill-down or exploration

---

## Industry Research Findings

### Key Insight 1: Retention is the #1 Priority

- **78% of first-time restaurant guests never return** (industry average)
- Repeat guests represent ~20% of the guest base but drive **50-80% of total revenue**
- A **5% retention improvement = 25-95% profit increase**
- It costs **5-7x more** to acquire a new guest than retain one
- Top-performing restaurants using integrated data platforms achieve **35-45% first-visit return rates** vs. the 25% industry average
- Quick-service restaurants generate roughly **71% of sales from repeat customers**

**Customer validation:** Every brand interviewed confirmed retention as the top metric. Market managers at Condado Tacos use new guest return rate as the single health indicator per location. Graeter's runs a structured 30/60/90/180/365-day intervention ladder. Zaxby's frames everything through incrementality.

> "That's really the metric that we're looking at as a brand and studying the health of it." — Evan, Condado Tacos (on new guest return rate)

*Sources: Bloom Intelligence 2025 Restaurant Guest Retention Report, Olo Blog*

### Key Insight 2: Guest Lifetime Value is the "North Star Metric"

- Restaurant analysts increasingly prioritize guest-level economics over same-store sales
- **Top 20% of guests can drive up to 90% of revenue** — understanding this concentration is critical
- GLV formula: Average Order Value × Purchase Frequency × Average Customer Lifespan
- Example QSR: $15/visit × 4 visits/month × 24 months = $1,440 GLV

**Customer validation:** Board-level metric. Eugene described the CMO texting during a board meeting asking for loyalty vs. non-loyalty LTV. Condado Tacos reports lifecycle stages to the CEO weekly.

> "Our CMO texted me for the board meeting: 'What is the most up-to-date LTV for loyalty and non-loyalty?'" — Eugene, PAR

**Data availability:** Punchh already calculates CLV distribution in QBRs and has Predicted CLV in the CDP model. The gap is making it self-serve and comparable (loyalty vs. non-loyalty).

*Source: Olo, Paytronix*

### Key Insight 3: The Third Visit is the Loyalty Threshold

- Multiple customers cite visit 3 (not visit 4 from industry literature) as the stickiness threshold
- The onboarding window (visits 1-3) is the most critical intervention point
- Punchh already tracks the engagement funnel (signup → 1st → 2nd → 3rd → 5th → 10th) with conversion rates and days between each step

**Customer validation:**
> "If you get a guest sticky on a transaction at least three times, they actually remain sticky — which is the ultimate goal, driving frequency." — Corey, PAG

> Bobby (Graeter's) described how first-to-third visit data drove their "Journey to Third Visit" campaign — audited annually.

**Data availability:** Punchh has this data. The gap is making it interactive and actionable (click a funnel step → see the guests → create a segment).

*Sources: Olo Guest Acquisition Guide, Dovetail customer interviews*

### Key Insight 4: Menu Items Directly Impact Guest Behavior

- Specific items drive retention or churn — this is unique to restaurant CDPs
- LTO analysis is a high-value feature: incremental traffic vs. cannibalization
- Menu reporting was cited as the single fastest path to value when onboarding a new analytics platform

**Customer validation:**
> "We get into Biki, we're like, whoa, the Chicken Bacon Ranch taco has a huge reorder rate for existing guests and has a higher return rate than the average product for new guests. So we were looking at what would be our first LTO burrito and we're like — it's a no brainer." — Evan, Condado Tacos

> "Marketing, FP&A, operations actively uses Biki, and then culinary uses Biki for the menu reporting." — Evan

**Data availability:** Punchh has item-level transaction data through PAR Loyalty and PAR Ordering (favorite items, items per order, item categories). The gap is calculating retention/reorder/churn rates per item — a transformation layer, not a data gap.

*Source: Bikky, Bridg, Dovetail customer interviews*

### Key Insight 5: 1:1 Personalization Drives Outsized Results

- 1:1 personalized marketing drives **400% higher guest retention** and **500% in realized sales**
- Blanket 30/60/90-day inactivity thresholds are ineffective
- Personalized churn thresholds per guest (based on their individual visit patterns) are more effective

**Customer validation:**
> "It would be really helpful if I knew more about activating around receipt tags and trying to figure out what in this guest's purchase history could be the right offer on the right product to recall them. Because we aren't picking up on that with our current resources, we do a lot of broad sweeps." — Maddie, Luna Grill

**Data availability:** Bikky already does personalized predicted next order dates (30-90 days per guest). Punchh's CDP model includes Predicted Spend (30/60/90 days). The infrastructure exists.

*Source: Data Delivers 2025 Restaurant Guest Engagement Report*

### Key Insight 6: Location Comparison is Essential for Multi-Unit

- Multi-unit operators need 10-15 standardized KPIs across locations
- Role-based views: executives see roll-ups, regional managers see territory, GMs see location-level
- Daily/weekly reporting is essential — monthly is too slow for course-correction

**Customer validation:** Location data has both an analytical and motivational dimension:
> "They were very excited that they went from the lowest spot to the third lowest — they jumped two spots on that score, and they had so much pride in just growing their loyalty program because they worked really hard at it." — Bobby, Graeter's (about the airport location)

> "Operations is looking at retention performance, at-term performance by location and by market. Now there's location-based reporting in Biki, which is incredibly helpful." — Evan, Condado Tacos

**Data availability:** PAR Loyalty and PAR Ordering both capture location. QBR has participation rate by location. The gap is interactive comparison and trend views.

*Source: Restaurant365, VisionWrights, Dovetail customer interviews*

### Key Questions Restaurant Marketers Ask

Validated and re-ordered by customer interview frequency:

1. Are guests coming back? What's our return rate? *(every brand)*
2. How much is a loyalty guest worth vs. a non-loyalty guest? *(board-level at 4+ brands)*
3. Which menu items drive retention and which correlate with churn? *(Condado Tacos, Luna Grill)*
4. How do my locations compare on guest health? *(Condado Tacos, Graeter's)*
5. Where in the journey do guests drop off — and what can I do about it? *(Graeter's, Charley's)*
6. Is my marketing campaign actually driving incremental visits? *(Zaxby's)*
7. What does our non-loyalty guest base look like? *(everyone — currently unanswerable)*
8. Which guest segments respond best to which offers? *(Luna Grill, Zaxby's)*
9. What do guests in a specific segment actually order? *(Luna Grill)*
10. How is my loyalty program health trending vs. benchmarks? *(Luna Grill, Charley's)*

---

## Proposed Analytics Structure

### Organizing Principle

Rather than organizing by data domain (Bikky's approach: Lifecycle, Revenue, Menu, Demographics) or by static report (Punchh's QBR approach), we organize around **strategic business questions**. This is more intuitive for marketers who think in terms of outcomes, not data categories.

### Navigation

```
Analytics
├── Dashboard              ← "How's my business doing right now?"
├── Guests
│   ├── Overview           ← "Who are my guests?"
│   ├── Acquisition        ← "Am I growing?"
│   ├── Retention          ← "Are guests coming back?"
│   └── At Risk            ← "Who am I about to lose?"
├── Revenue
│   ├── Overview           ← "What are my guests worth?"
│   └── Trends             ← "How is revenue changing?"
├── Menu
│   ├── Performance        ← "Which items drive loyalty?"
│   └── LTO Analysis       ← "Is my new item working?"
├── Locations              ← "How do my stores compare?"
└── Campaigns              ← "Is my marketing working?"
```

### Why This Structure (Post-Customer Validation)

The original v1 proposal was based on competitive research and industry patterns. Customer interviews confirmed the structure and refined the priority:

- **Retention** confirmed as the single most important page (every brand)
- **Menu Performance** confirmed as highest speed-to-value (Condado Tacos)
- **Locations** elevated in importance — not just analytical but motivational for store teams (Graeter's)
- **At Risk** validated as the right framing — customers think in intervention tiers (30/60/90/120/180/365 days), not in abstract "churn" categories
- **Campaigns** confirmed as high-need but dependent on closing the real-time data gap
- **Revenue** confirmed as board-level — loyalty vs. non-loyalty LTV is the most common executive request

---

## Interaction Model

Every analytics page in GDP follows a unified interaction framework. This ensures consistency across pages and teaches the user one mental model that works everywhere.

### Slice vs. Segment

| | Slice | Segment |
|--|-------|---------|
| **What it does** | Filters the entire page to a subset | Splits a metric by a dimension for comparison |
| **Question it answers** | "How is this specific group performing?" | "How do different groups compare?" |
| **Think of it as** | `WHERE` clause | `GROUP BY` clause |
| **UI control** | Global filter bar at top of page | "Segment by" dropdown on each chart |
| **Example** | "Show me everything for Dallas" | "Show me return rate split by Channel" |

Users combine slice and segment for two-step drill-downs: filter to Dallas (slice), then split return rate by Channel (segment) to answer "Within Dallas, how do channels compare on retention?"

### Available Dimensions for Slice and Segment

Every page supports these dimensions in both the global filter bar and per-chart segment dropdowns:

- **Location** (individual location or location group)
- **Channel** (POS, Mobile App, Web Ordering, Delivery, 3rd Party)
- **Daypart** (Breakfast, Lunch, Afternoon, Dinner, Late Night)
- **Loyalty Status** (Loyalty member, Non-loyalty)
- **Guest Frequency** (Daily, Weekly, Monthly, Quarterly, Irregular)
- **Order Type** (Dine-in, Takeout, Delivery)
- **Segment** (any saved audience segment)

### Drill-Down Patterns

Every drill-down follows the **Insight → Context → Action** arc:

**Step 1 — Insight:** Something catches the user's eye (e.g., "Churn rate is up 1.8%")
**Step 2 — Context:** One click reveals the why (e.g., "1,200 guests from January haven't returned — concentrated at Midtown and Eastgate")
**Step 3 — Action:** From that same view, they act (Create Segment, View Guests, Ask Ava)

#### Pattern 1: Click Dashboard KPI Card → Slide-Out Detail Panel

On the **Dashboard only**, user clicks a compact KPI card. A panel slides in from the right with context and actions. The user never leaves the page.

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

**When to use:** Dashboard KPI cards only. The slide-out panel compensates for the card's compact size by providing the "why" and linking to the dedicated page.

**Why Dashboard-only:** Dedicated analytics pages use chart-blocks (see Pattern 1b below) where the headline metric and full visualization are already visible together — no slide-out needed.

#### Pattern 1b: Chart-Block Layout on Dedicated Pages

On dedicated analytics pages (Acquisition, Retention, At Risk, Revenue, Menu), each metric is presented as a **chart-block**: a self-contained component with the headline metric embedded at the top and the full chart immediately visible below. This replaces small KPI cards on these pages.

```
┌─ Retention Page ─────────────────────────────────┐
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  Return Rate                                │  │
│  │  42.3%  ↑ 2.1% vs. prior period    [i]     │  │
│  │                                             │  │
│  │  ┌─────────────────────────────────────┐    │  │
│  │  │                                     │    │  │
│  │  │  (full trend chart)                 │    │  │
│  │  │                                     │    │  │
│  │  └─────────────────────────────────────┘    │  │
│  │                                             │  │
│  │  Segment by: [Channel ▾]   [Benchmark ▾]   │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  Avg Days to Second Visit                   │  │
│  │  8.2 days  ↓ 0.4d vs. prior period          │  │
│  │                                             │  │
│  │  ┌─────────────────────────────────────┐    │  │
│  │  │  (latency trend chart)              │    │  │
│  │  │                                     │    │  │
│  │  └─────────────────────────────────────┘    │  │
│  │                                             │  │
│  │  Segment by: [Location ▾]                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  (more chart-blocks below...)                     │
└───────────────────────────────────────────────────┘
```

**Rationale:** Users who navigate to a dedicated page have already committed to a topic. They came to analyze, not scan. Small KPI cards at the top of these pages repeat what the Dashboard already shows and force the user to scroll past them to reach the actual charts. Chart-blocks give immediate depth — the headline number and the visualization in one glance, with "Segment by" controls right there.

**When to use:** All dedicated analytics pages (everything except Dashboard).

#### Pattern 2: Click Chart Data Point → Filtered Guest List

User clicks a bar, line segment, or data point. A filtered guest list appears below the chart with action buttons.

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
└─────────────────────────────────────────────────────┘
```

**When to use:** Bar charts, funnel charts, heatmap cells, cohort table cells.

#### Pattern 3: Ava Suggests Actions Alongside Insights

Ava surfaces weekly changes with pre-formed action buttons.

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

### Three Universal Actions

Every drill-down surfaces some combination of these three actions:

| Action | What It Does | Why It Matters |
|--------|-------------|----------------|
| **Create Segment** | Saves the filtered guest group as a named, reusable segment. Pre-fills the segment builder with the current filter criteria. | Bridges analytics → marketing. "I see a problem" → "I have an audience I can act on." |
| **View Guests** | Navigates to Profiles filtered to show the specific guests behind the metric. | Lets operators validate and see real people. Builds trust. |
| **Ask Ava** | Opens Ava with a pre-filled question about the current metric. | Enables deeper investigation without formulating the question. |

Future (not MVP):

| Action | What It Does |
|--------|-------------|
| **Send to Campaign** | Auto-creates a segment and opens the campaign builder with that segment pre-selected. |

### Metric Dicing (from Anil's framework)

Every metric in GDP must be viewable across these dimensions:

| Dice Level | Description | Example |
|-----------|-------------|---------|
| **By Location** | Single location view | "Return rate at Downtown" |
| **By Location Group** | Market or region view | "Return rate across Texas locations" |
| **By Business** | Entire brand | "Overall return rate" |
| **Using Benchmarking Cohorts** | Compared to peer brands | "Our return rate vs. 50th/75th percentile for programs aged 2-3 years" |
| **Percentiles** | Distribution view | "Top 10% of guests account for X% of revenue" |
| **Quartiles** | Bucket view | "Q1 vs. Q2 vs. Q3 vs. Q4 guest value" |
| **Time Series** | Trend over time | "Return rate trend, last 12 months, YoY" |

---

## Page-by-Page Breakdown

### 1. Dashboard (The 30-Second Health Check)

**Purpose:** Instant pulse on business health. The landing page. Serves both strategic users (CEO weekly scan) and operational users (morning status check).

**Customer evidence:**
> "Our CEO gets the weekly Biki report — week over week performance of sales revenue per restaurant, new guests, re-engaged guests, re-onboarding guests." — Evan, Condado Tacos

> "Dashboards that our analysts made get exported out daily — something like this for loyalty would really be next level for us." — Eugene, PAR

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| KPI Cards (top row) | Total Guests, Active Guests (trailing 90d), Repeat Rate, Avg Guest Lifetime Value, Responsive Audience (% of reachable guests who engaged in last 90d) | PAR Loyalty + PAR Ordering (Total), QBR (Active 30/90/180/365d windows), PAR Loyalty engagement events |
| Trend Sparklines | Each KPI shows trend + % change vs. prior period + benchmark indicator | QBR benchmarks (50th/75th by program age) |
| Guest Lifecycle Funnel | First-time → Returning → Loyal → At Risk → Churned (counts + %) | Bikky lifecycle model + Punchh engagement ladder data |
| Revenue Concentration | "Your top 20% of guests drive X% of revenue" | QBR CLV distribution + RFM quartiles |
| What Changed (Ava) | AI-generated weekly changes with action buttons | Computed: WoW deltas on all KPIs |
| Alerts | "Repeat rate dropped 3.2%", "Location X has highest churn" | Computed: anomaly detection |

**Interaction model:**
- KPI cards are clickable → slide-out detail panel (Pattern 1)
- Lifecycle funnel steps are clickable → filtered guest list (Pattern 2)
- Ava insight cards include inline action buttons (Pattern 3)
- Global filter bar: Date range, Location/Group, Loyalty Status
- "Segment by" is less relevant here — cards are small; save it for full analytics pages

**Benchmarking:** Each KPI card shows a small benchmark indicator (e.g., ▲ above 75th percentile, ● between 50th-75th, ▼ below 50th) using Punchh's existing cohort benchmarks.

**Customizable dashboard:** The KPI cards above are the defaults. Users can swap, add, remove, and rearrange cards from a curated card library organized by analytics domain (see [Customizable Dashboard proposition](customizable_dashboard.md)). Metrics that ranked highly in the PAG exercise but aren't in the default layout — such as Loyalty Spend Lift (72% selection), Loyalty Penetration (67%), and Visit Frequency (72%) — are available as library cards. The goal: 80% of users never need to customize because the defaults match their role.

---

### 2. Guests > Overview

**Purpose:** Understand the composition and health of your guest base. The "who are my guests?" page.

**Customer evidence:**
> "We're always kind of looking for archetypes — what's a light, medium, heavy user? Who are these people, what are they doing?" — Maddie, Luna Grill

> "New guest count, return rate of new guests, engaged guest percentage, and then the whole can of worms of the value of loyalty — which is hard to actually quantify in Punch." — Evan, Condado Tacos

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| Guest Composition | Breakdown by lifecycle stage with counts and % | Lifecycle calculation (First-time, Onboarding, Engaged, Late, Churned) |
| Identification Rate | % of guests identified (loyalty vs. trackable vs. anonymous) | CDP identity resolution |
| Marketing Reachability | Funnel: Total Guests → Reachable (have valid contact method) → Responsive (opened/clicked/redeemed in last 90d) → Unreachable. Breakdown by channel (Email, SMS, Push, Multi-channel). Trend over time. | PAR Loyalty contact data + engagement event data |
| Loyalty vs. Non-Loyalty | Side-by-side: guest count, avg check, frequency, LTV | PAR Loyalty (loyalty) + PAR Pay/POS (non-loyalty via card matching) |
| Loyalty Penetration | Loyalty members as % of total identified guests, trend over time, enrollment rate by location. *Added in v3: ranked #6 in PAG exercise (67% selection). Previously only surfaced on the Locations page — elevated here as a core health metric.* | QBR Participation Rate + PAR Loyalty signup data |
| Guest Trends | Line chart: total guests, new vs. returning over time | PAR Loyalty + PAR Ordering |
| Guest Value Distribution | Histogram/percentile chart of GLV | QBR CLV distribution + Predicted CLV |
| Frequency Distribution | Guest distribution: daily / weekly / monthly / quarterly / irregular | QBR frequency cohorts |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Channel, Loyalty Status, Segment
- "Segment by" on each chart section
- Click any lifecycle stage → filtered guest list with actions
- Click any frequency bucket → filtered guest list with actions
- Click any reachability segment (Unreachable, Reachable but unresponsive, Responsive) → filtered guest list with actions (e.g., re-engagement campaign, channel switch from Email to SMS)
- Loyalty vs. Non-Loyalty comparison is a default view, togglable

**Punchh data available:** Unique guests, frequency cohorts, CLV distribution, active member windows, RFM quartiles, contact method availability (email, phone, push token), engagement events (opens, clicks, redemptions). Non-loyalty gap requires CDP card-matching or POS data.

---

### 3. Guests > Acquisition

**Purpose:** Are you growing? Where are new guests coming from?

**Customer evidence:**
> "Revenue, total orders, new guest orders over very large periods of time — those were questions that when we first onboarded, those reports weren't available, and now they are, and it's like mind-blowingly helpful." — Evan, Condado Tacos

| Chart-Block | Headline Metric | Visualization | Data Source |
|-------------|----------------|---------------|-------------|
| New Guest Acquisition | New Guests (period) + % change vs. prior | Line/bar chart: new guests over time with YoY comparison | QBR (Signups), QBR trend data. *PAG exercise #1 metric: 78% selection, 56% top 3.* |
| First-Visit Conversion | First-Visit Conversion Rate + trend | Funnel: signup → first checkin, with avg days between steps | Engagement Ladder (signup → 1st visit conversion) |
| Acquisition by Channel | Largest channel + share % | Source breakdown: In-store POS, Mobile, Online Order, Web, eClub | QBR channel metrics |
| Loyalty Enrollment Rate | Enrollment rate + trend | New guests → loyalty signup conversion funnel | QBR eClub metrics + signup data |
| First Visit Profile | Avg first check | Avg first check, most common daypart, most common items | PAR Ordering + PAR Loyalty transaction data |
| Largest Increase/Decrease by Location | Top mover + delta | Table of location-level acquisition changes | Bikky Trends pattern + location data |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Channel, Order Type
- "Segment by" on New Guests Over Time chart-block (by channel, location, daypart)
- Click location in table → slice page to that location
- Click channel bar → filtered guest list (Pattern 2)

**Punchh data available:** Signups, signup channel, eClub conversions, referral % of signups, signup/first-checkin heatmap. Benchmark: signup conversion rates by program age.

---

### 4. Guests > Retention (The Most Important Page)

**Purpose:** Are guests coming back? Combines what Bikky splits across Onboarding, Engagement, Latency, and Cohort Analysis into one holistic view.

**Customer evidence (strongest signal across all interviews):**

> "Having a baseline, literally understanding what is the baseline of our new guest return rate — we did not have that until Vicki, and I think that it's a powerful metric." — Maddie, Luna Grill

> "If you get a guest sticky on a transaction at least three times, they actually remain sticky — which is the ultimate goal, driving frequency." — Corey, PAG

> "When I was looking at mParticle, we could see time between visits pretty clearly. If their first to second purchase was 10 days, second to third was 25 days, and third to fourth was 80 days — that would be an indicator we're not trending in the right direction." — April, Charley's

| Chart-Block | Headline Metric | Visualization | Data Source |
|-------------|----------------|---------------|-------------|
| Return Rate | Overall Return Rate + trend | Line chart: return rate over time with benchmark band | Bikky Engagement + QBR. *PAG: Guest Repeat Rate ranked #4 (67% selection, 56% top 3).* |
| Visit Frequency | Avg Visit Frequency + trend | Guest distribution across daily / weekly / monthly / quarterly / irregular | QBR frequency cohorts, avg checkin frequency. *PAG: Visit Frequency ranked #2 (72% selection, 61% top 3).* |
| Visit Latency | Avg Days to Second Visit + trend | Line chart: avg days between visits over time (YoY) | Bikky Latency (avg days until 2nd order, avg days between all orders). *PAG: Avg Days Between Visits ranked #5 (67% selection, 56% top 3).* |
| Engagement Funnel | Habitual Guest % | Signup → 1st → 2nd → 3rd → 5th → 10th with conversion rates and avg days between each step | QBR 12-month engagement ladder (exists — make interactive). *PAG: Return Visit Funnel ranked #9 (56% selection, 44% top 3).* |
| Return Rate by Visit Number | 3rd-visit conversion rate | Bar chart: % who return after 1st, 2nd, 3rd visit — highlights the "third visit threshold" | QBR engagement ladder conversion rates |
| Retention Cohort Table | Current month retention rate | Month-over-month retention grid | QBR retention cohort (exists — make interactive and monthly instead of quarterly). *PAG: Retention Cohort 44% selection.* |
| Retention by Dimension | — | Tabs: by Location, by Channel, by Daypart, by Loyalty Status | QBR channel metrics + Bikky dimension analysis |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Channel, Loyalty Status, Guest Frequency, Segment
- "Segment by" on each chart-block
- Click any engagement funnel step → see the guests who dropped off between steps → Create Segment (Pattern 2)
- Click any cohort cell → filtered guest list (Pattern 2)
- Click any latency trend anomaly → "Ask Ava: Why did latency increase?"
- Benchmark indicators on Return Rate and Visit Frequency chart-blocks

**Punchh data available:** Engagement funnel (conversion rates + avg days), frequency cohorts, retention cohort (quarterly), avg checkin frequency. Latency (days between visits) needs calculation from transaction timestamps. Benchmark data available for visit conversion rates and days between visits.

**Design rationale:** Bikky splits this across 4+ pages. Customers think about retention holistically — "are they coming back, how fast, and where do they drop off?" Combining reduces navigation friction and keeps the answer in one view.

---

### 5. Guests > At Risk

**Purpose:** Who am I about to lose? Why? What can I do? This is where analytics becomes action.

**Customer evidence:**

> "I think of just like them lapsing — no purchases within 90 days. Once you're beyond 90 days, we're a little concerned. After about 120, I'm really sweating, and six months is where I'm like, okay, I think this might be a lot harder to recover this guest." — Maddie, Luna Grill

> "After 90 days, if you're not coming back in, typically we want to hit that person again. If a guest hasn't come in in six months, that's a 'hey, we really need to intervene.' And then lastly we have a last ditch effort at that year mark." — Bobby, Graeter's

> "We look at that seven-day window and see that 95% of the people that go on to make a purchase do so in the first day. If you download the app and didn't come back within a day or two, you're likely gone." — Andrew Hyde, Zaxby's

| Chart-Block | Headline Metric | Visualization | Data Source |
|-------------|----------------|---------------|-------------|
| Late Guests | Late Guests % + trend | Area chart: late vs. churned guests over time | Bikky Churn (late/churned %), Bikky Churn trend |
| Churned Guests | Churned Guests % + trend | Stacked with Late Guests chart or separate area chart | Bikky Churn (late/churned %) |
| Intervention Tiers | Total at-risk guests | Visual breakdown: 30d / 60d / 90d / 120d / 180d / 365d since last visit — with guest counts per tier | Calculated from transaction timestamps |
| Churn Risk Score | Distribution of churn risk across guest base | Histogram or score distribution: Low / Medium / High / Critical risk buckets with guest counts and predicted revenue at risk per bucket. *Added in v3: 39% of PAG participants independently selected this. Gives operators a single digestible risk score per guest, complementing the time-based intervention tiers.* | CDP Predicted Spend/CLV + days since last transaction + individual visit frequency patterns |
| Predicted Revenue at Risk | Revenue at risk ($) + trend | Bar chart: revenue at risk by intervention tier | CDP Predicted Spend/CLV |
| Churn by Dimension | Highest-churn dimension | Tabs: by Location, by Daypart, by Channel — showing which dimensions have highest churn | Bikky Churn dimension analysis |
| Churn by Menu Item | Highest-churn item | Items that correlate with higher churn (top 20) | Bikky Churn menu item analysis |
| At-Risk Guest List | — | Exportable table: last visit, predicted next visit, days overdue, churn risk score, recommended action | CDP Predicted attributes + transaction data |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Frequency, Source, Fulfillment Method
- Click any intervention tier → Create Segment (e.g., "Create win-back segment for 90-120 day lapsed guests") (Pattern 2)
- Click any churn risk bucket → Create Segment (e.g., "Critical risk guests") (Pattern 2)
- Click any churn-driving location → slice to that location
- Click any churn-driving menu item → cross-link to Menu Performance
- Each tier shows: [Create Segment] [View Guests] [Ask Ava: Best offer for this group?]

**Punchh data available:** QBR has Loyalty Customer Retention Rate. CDP model has days since last loyalty transaction, days since last redemption, Predicted Spend (30/60/90 days). Bikky-style personalized churn thresholds (30-90 day predicted next order) would need to be calculated.

**Design rationale:** "At Risk" is action-oriented framing. The intervention tiers directly mirror how brands actually think and operate — Graeter's 30/60/90/180/365 ladder, Luna Grill's 120/180 segments.

---

### 6. Revenue > Overview

**Purpose:** What are my guests worth? Where does revenue concentrate?

**Customer evidence:**

> "Everything is around incrementality. Are we driving more incremental visits, incremental checks, sales compared to non-loyalty guests — that's the top most important thing." — Andrew Hyde, Zaxby's

> "If I could go to a guest profile and see their average days between visits, their annual spend, their average check — things like that. And then I could segment based on those." — April, Charley's

| Chart-Block | Headline Metric | Visualization | Data Source |
|-------------|----------------|---------------|-------------|
| Total Revenue | Total Revenue + trend | Line chart: revenue over time with prior period comparison | QBR (Loyalty Sales). *PAG: Revenue Trend 39% selection.* |
| Avg Check Size | Avg Check Size + trend | Line chart with benchmark band | QBR (Avg Check). *PAG: Average Order Value ranked #8 (56% selection, 44% top 3).* |
| Guest Lifetime Value | Avg GLV + trend | Histogram of guest value distribution with quartile markers (GLV Distribution) | QBR CLV distribution + RFM quartiles + CDP (CLV). *PAG: Guest Lifetime Value 44% selection.* |
| Spend Lift | Spend Lift (loyalty vs. non-loyalty) + trend | Side-by-side: avg check, frequency, LTV, total revenue contribution (Loyalty vs. Non-Loyalty Value) | QBR Spend Lift + CDP data. *PAG: Loyalty Spend Lift ranked #3 (72% selection, 50% top 3).* |
| Revenue Concentration | "Top 10% of guests = X% of revenue" | Bar chart by GLV percentile | QBR CLV distribution |
| Revenue by Lifecycle Stage | — | Stacked bar: First-time, Returning, Loyal, At Risk | Bikky lifecycle revenue chart |
| Revenue by Channel | — | In-store vs. digital vs. delivery breakdown | QBR channel metrics (Online Sales %, Online Check) |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Channel, Segment
- "Segment by" on Revenue Concentration chart-block (by location, channel, lifecycle)
- Click any GLV percentile bucket → Create Segment (e.g., "Top 20% guests") (Pattern 2)
- Loyalty vs. Non-Loyalty is a toggle, not a separate view

**Punchh data available:** Loyalty Sales, Avg Check, Spend Lift, CLV distribution, RFM quartiles, online vs. POS revenue. Benchmark data available for avg check, spend lift.

---

### 7. Revenue > Trends

**Purpose:** How is revenue changing over time and why?

**Customer evidence:**

> "Week over week's not super relevant for us because of seasonality. I'd like to see the trends over time and then even better compared to our targets or a baseline that's pertinent." — PAG participant

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| Revenue Over Time | Line chart with YoY comparison + seasonality overlay | QBR Loyalty Sales trend |
| Revenue Drivers | Decomposition: more guests, more visits, or higher check? | Calculated from transaction counts × avg check |
| Avg Check Trend | Line chart over time with benchmark band | QBR Avg Check trend + benchmark |
| Revenue by Location | Ranked table with trend indicators | PAR Loyalty + POS location data |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Channel
- "Segment by" on Revenue Over Time (by channel, lifecycle, location)
- Time granularity toggle: daily / weekly / monthly / quarterly
- Comparison toggle: vs. prior period / vs. prior year / vs. benchmark

**Punchh data available:** Loyalty Sales, Avg Check (with QoQ benchmarks), online sales. Revenue decomposition (guests × visits × check) needs calculation from existing components.

---

### 8. Menu > Performance

**Purpose:** How do menu items impact guest behavior? This is the page that proved fastest-to-value at Condado Tacos.

**Customer evidence:**

> "The Chicken Bacon Ranch taco has a huge reorder rate for existing guests and has a higher return rate than the average product for new guests. So we were looking at what would be our first LTO burrito and we're like — it's a no brainer." — Evan, Condado Tacos

> "We want to create a segment of users and then be able to see those behaviors from just a specific segment — like if we could create users who are only coming for the kids-eat-free offer, what do the products purchased look like for that segment?" — Maddie, Luna Grill

| Chart-Block | Headline Metric | Visualization | Data Source |
|-------------|----------------|---------------|-------------|
| Item Retention | Avg Item Retention Rate + trend | Line chart per top items with "avg of other items" benchmark | Calculated from item-level transaction patterns, Bikky Menu pattern. *PAG: Menu Item Retention Score 33% selection.* |
| Item Reorder Rate | Avg Item Reorder Rate | Bar chart: top reordered items ranked by rate | Calculated from item-level transaction patterns |
| Item Churn | Avg Item Churn Rate | Top items correlated with guest churn (top 20) | Calculated from item-level transaction patterns. *PAG: Menu Item Churn 39% selection.* |
| Menu Item Table | — | Sortable: Item, Retention, Churn, Reorder Rate, Attachment Rate, Total Orders, Total Revenue | Bikky Menu pattern + PAR Ordering item data. *PAG: Top Menu Items 33% selection.* |
| Item Combinations | — | Top item pairings (upsell/attachment opportunities) | PAR Ordering (items per order, item categories) |
| Guest Type Tabs | — | Toggle: All guests / New guests / Repeat guests | Filter by visit count |
| Item Affinity by Segment | — | When a segment filter is applied, shows item purchase patterns for that segment | PAR Loyalty receipt data + segment filter |

**Interaction model:**
- Global filter bar: Date range, Location/Group, Item Category, Channel, Segment
- "Segment by" on Item Retention chart-block (by location, channel, guest type)
- Click any item in the table → slide-out with item detail (retention trend, guest profiles who ordered it, reorder curve)
- Click "high churn" items → cross-link to At Risk page
- Segment filter enables Maddie's use case: "Show me what the kids-eat-free segment orders"

**Punchh data available:** PAR Loyalty has favorite items (breakfast, main course, modifiers). PAR Ordering has items per order and item categories. Item-level retention/reorder/churn metrics need to be calculated — this is a transformation layer built on existing transaction + item data.

---

### 9. Menu > LTO Analysis (Phase 3)

**Purpose:** Is a limited-time offer or new item working?

**Customer evidence:**

> "So we were looking at what would be our first LTO burrito — it's obviously the Chicken Bacon Ranch needs to be a burrito. We launched the Chicken Bacon Ranch burrito and it was one of our most successful LTOs." — Evan, Condado Tacos

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| LTO Selector | Pick an LTO / new item to analyze | Item catalog from POS/Ordering |
| Impact KPIs | New guests attracted, Incremental orders, Cannibalization rate | Calculated: new items ordered by first-time vs. existing guests |
| Guest Acquisition | Did this item bring in first-time guests? | Transaction + guest lifecycle data |
| Cannibalization | What existing items lost orders? | Item-level time series comparison |
| Retention Impact | Do LTO guests come back? What do they order next? | Transaction sequence analysis |

**Interaction model:**
- LTO selector acts as the primary filter
- Charts compare LTO period vs. pre-LTO baseline
- Action: [Create Segment: "Guests acquired by this LTO"]

---

### 10. Locations

**Purpose:** How do my stores compare? This page serves both analytical (market managers) and motivational (store teams) purposes.

**Customer evidence:**

> "Market managers go into the location reports quite a bit — looking at each of their locations, comparing to each other, looking at new guest return rate. That's really the metric we're looking at as a brand." — Evan, Condado Tacos

> "Some managers are very competitive. They were very excited that they went from the lowest spot to the third lowest — they had so much pride in just growing their loyalty program." — Bobby, Graeter's

> "You need to be able to track the changes in time, not just say last week your data was this and this week your data is that." — Raymond, PAG

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| Location Scorecard Table | Ranked by: Guest Count, New Guests, Return Rate, Avg Check, Participation Rate, Churn Rate, Revenue | QBR metrics by location |
| Location Comparison | Select 2-3 locations to compare side-by-side with trend lines | Location-level data + time series |
| Top / Bottom Performers | Highlight best and worst on key metrics | Calculated from location scorecard |
| Lifecycle by Location | Heatmap: rows = locations, columns = lifecycle stages (%) | Bikky lifecycle heatmap pattern |
| Participation Rate by Location | Location-level loyalty participation with benchmark band | QBR Participation Rate + benchmark |
| Location Trends | Time series per location on selected metric | Location data + time dimension |

**Interaction model:**
- Global filter bar: Date range, Location Group, Metric Selector
- Click any location row → slice the entire scorecard to that location (or open side-by-side comparison)
- Click any heatmap cell → filtered guest list at that location in that lifecycle stage
- "Segment by" on trend charts (by channel, daypart, loyalty status)
- Toggle between: ranked view (scoreboard) and trend view (time series)

**Punchh data available:** Participation Rate by location, QBR metrics calculable at location level, location group support. Benchmark bands available. Location-level trend data needs to be served interactively rather than as QBR snapshots.

---

### 11. Campaigns (Phase 3)

**Purpose:** Is my marketing actually driving behavior? Close the loop between "campaign sent" and "behavior changed."

**Customer evidence:**

> "Something Attentive has — I really like when you send a campaign, you can see the segment performance." — Maddie, Luna Grill

> "One thing that's tricky is the data on the dashboard is real-time, but the campaign data isn't real-time. We'll go into the log to see that 5,000 people were gifted. Just having a very clear 'X people were targeted, here's how many we processed today' would be huge." — Andrew Hyde, Zaxby's

> "The number one thing we build in our current CDP, audience-wise, is around control groups. With testing — Control A, B, C, D — we generate that all in mParticle today." — Andrew Hyde, Zaxby's

| Component | Metrics | Data Source |
|-----------|---------|-------------|
| Audience Health (top section) | Reachable Guests (count + % of total), Responsive Guests (count + % of reachable), Unreachable Guests, Responsive trend over time. Gives campaign planners context before looking at individual campaigns. | PAR Loyalty contact data + engagement events |
| Campaign List | All campaigns with: Sent, Delivered, Revenue Attributed, Incremental Visits | PAR Loyalty campaign data |
| Campaign Impact | Visits driven, revenue attributed, guests re-engaged | Campaign + transaction join |
| Channel Performance | Email vs. SMS vs. Push — which drives actual visits? Which channel has highest responsiveness rate? | PAR Loyalty engagement attributes |
| Segment Performance | Which audience segments respond best? | Campaign + segment membership |
| Control Group Comparison | Campaign group vs. control group on key behavior metrics | Requires control group infrastructure |
| Top Redeemables | Best-performing offers with redemption rate, discount %, avg check | QBR Top 3 Redeemables pattern |

**Interaction model:**
- Audience Health cards are clickable → slide-out showing channel breakdown (Email reachable: X, SMS: Y, Push: Z, Multi-channel: W)
- Click "Unreachable" or "Reachable but unresponsive" → filtered guest list with actions (re-engagement, channel switch)
- Click any campaign → detail view with performance timeline
- Click any segment → cross-link to Guest Overview filtered to that segment
- Action: [Duplicate Campaign] [View Targeted Guests]

**Punchh data available:** Mass campaigns sent, targeting events, push/email counts, redeemables sent, coupon codes, top 3 redeemables with redemption rates and discount %. Contact method data (email, phone, push token) available. Campaign-to-transaction attribution and control group comparison are gaps.

---

## Product Line Considerations

Per Anil's framework, GDP analytics availability differs based on which PAR products a brand uses. This affects what data is available and what pages/metrics can be shown.

| Configuration | Data Available | Pages Fully Supported | Pages Partially Supported | Pages Not Available |
|--------------|---------------|----------------------|--------------------------|-------------------|
| **PAR Loyalty ONLY** | Loyalty transactions, user profiles, engagement, campaigns, points/rewards | Dashboard, Guests (all), Revenue Overview, Campaigns | Menu (loyalty item data only), Locations (loyalty metrics only) | Revenue Trends (limited to loyalty sales) |
| **PAR Ordering ONLY** | All orders (loyalty + non-loyalty), item-level data, channel data, delivery data | Dashboard, Guests > Overview, Menu Performance, Locations | Guests > Retention (transaction-based, no loyalty signals), Revenue (all) | Campaigns, Guests > At Risk (no predicted attributes) |
| **PAR Loyalty + PAR Ordering** | Full picture: loyalty + non-loyalty guests, all transactions, items, channels, engagement, campaigns | All pages fully supported | — | — |
| **+ PAR Pay** | Card-based identity resolution, non-loyalty guest identification via card matching | Enhanced: Guest Overview (higher identification rate), Revenue (non-loyalty spend data) | — | — |

### Design Implication

- Pages and metrics should gracefully degrade based on available data sources
- Empty states should explain what data source is needed to unlock a metric
- The "Loyalty vs. Non-Loyalty" toggle should only appear when non-loyalty guest data is available (PAR Ordering or PAR Pay)

---

## MVP Prioritization

Re-ranked based on customer pain intensity (from Dovetail interviews), data availability (from CDP Blueprint and QBR), competitive differentiation, **and the PAG Metric Placement Exercise (March 2025)**.

### PAG Exercise Summary

~18 participants were given a set of analytics metrics and asked to rank them by importance. Key findings:

| Metric | % Selected | % Top 3 | Signal |
|--------|-----------|---------|--------|
| New Guest Acquisition | 78% | 56% | #1 overall — strongest signal in the exercise |
| Visit Frequency | 72% | 61% | #2 — highest top-3 rate of any metric |
| Loyalty Spend Lift | 72% | 50% | #3 — board-level metric |
| Guest Repeat Rate | 67% | 56% | #4 — validates Retention as most important page |
| Avg Days Between Visits | 67% | 56% | #5 — validates latency in Retention |
| Loyalty Penetration | 67% | 44% | #6 — was under-surfaced; now added to Guest Overview |
| Active Guests | 61% | 56% | #7 — validates Dashboard KPI |
| Average Order Value | 56% | 44% | #8 — validates Revenue page prominence |
| Return Visit Funnel | 56% | 44% | #9 — validates Engagement Funnel in Retention |
| Guest Lifecycle Stage | 56% | 33% | #10 — validates Dashboard lifecycle funnel |

**Interpretive notes (from Lynn's analysis of exercise dynamics):**

1. **Bikky-mirror effect.** The top-ranked metrics mirror what Bikky leads with. Many participants are current or former Bikky users, so the exercise partly validates Bikky's playbook rather than revealing untapped demand. The more interesting differentiation signals are in the middle tier (Loyalty Penetration, Channel Mix, Loyalty Conversion Rate) — metrics Bikky doesn't emphasize that clients still selected.
2. **Revenue underperformed for structural reasons.** Revenue lives in POS mentally — participants didn't look for it in a loyalty/CDP tool. This is a positioning opportunity, not a signal to deprioritize revenue analytics.
3. **Non-loyalty metrics ranked low due to belief constraints.** Participants don't yet believe a loyalty tool can deliver non-loyalty visibility. Every Dovetail interview contradicts this — non-loyalty visibility is the #1 structural gap. Low exercise ranking reflects tool-shaped thinking, not actual preference.
4. **IDR metrics are correctly deprioritized.** Identity resolution is an IT/data engineering concern. Marketers want it to work invisibly, not monitor it on a dashboard.
5. **AI summary panel was discovered late.** "What Changed This Week" scored 39% despite being encountered late in the exercise. Qualitatively, it was the most enthusiastically received element. Selection rates understate its value.

### Phase 1 — Core (Build First)

| Page | Rationale | Customer Evidence Strength | Data Readiness |
|------|-----------|---------------------------|----------------|
| **Dashboard** | First impression. CEOs and CMOs check this weekly. | High — Condado CEO uses weekly Bikky report | High — Most KPIs exist in QBR |
| **Guests > Retention** | The #1 thing every brand cares about. Highest pain intensity. Validated by PAG: 4 of the top 5 metrics live on this page (Visit Frequency 72%, Repeat Rate 67%, Avg Days Between Visits 67%, Return Visit Funnel 56%). | Very High — Every single brand + PAG top 5 | Medium — Engagement ladder exists; latency needs calculation |
| **Guests > At Risk** | Directly actionable. Customers already run intervention tiers. Churn Risk Score (39% PAG) added as chart-block in v3. | Very High — Graeter's, Luna Grill, Charley's have detailed ladder models | Medium — Predicted attributes exist in CDP; intervention tiers need calculation |
| **Guests > Overview** | Foundational context. Answers "who are my guests?" including the loyalty vs. non-loyalty gap. Loyalty Penetration (67% PAG) added as chart in v3. | High — Universal ask | High — Frequency cohorts, CLV, active rates exist |
| **Guests > Acquisition** | *Moved from Phase 2 in v3.* New Guest Acquisition was the #1 metric in the PAG exercise (78% selection, 56% top 3). Growth tracking is foundational — you can't talk about retention without understanding acquisition. High data readiness makes this low-risk to include in Phase 1. | Very High — PAG #1 metric + Condado Tacos | High — Signups, channel data, eClub exist |

### Phase 2 — Growth

| Page | Rationale | Customer Evidence Strength | Data Readiness |
|------|-----------|---------------------------|----------------|
| **Menu > Performance** | *Moved from Phase 1 in v3.* Fastest path to value at Condado Tacos. Biggest competitive differentiator vs. Punchh QBRs (zero menu analytics). Moved to Phase 2 because PAG exercise ranked menu metrics at 33-39% (moderate, not top-tier). Lynn's interpretation: participants may be Bikky-influenced (already have menu analytics), so moderate ranking could mean "we have this, want more" rather than "don't care." Still high priority — just not Phase 1 given the Acquisition signal. | High — Condado Tacos (very strong single-brand evidence) | Medium — Item data exists; retention/reorder metrics need calculation |
| **Revenue > Overview** | Board-level metric (loyalty vs. non-loyalty LTV). Answers the CMO's board meeting question. Spend Lift ranked #3 in PAG (72%). Revenue underperformed in exercise due to POS mental model (Lynn's analysis), not lack of interest. | High — Eugene, Zaxby's, PAG #3 | High — CLV, Spend Lift, revenue data exist |
| **Locations** | Multi-unit operators need location comparison. Ranked low in PAG exercise (17%), but this audience was primarily marketing-focused — location analytics serves a different stakeholder (market managers, store teams). Motivational dimension (store scoreboard) is underweighted by a marketer-focused exercise. | Medium — Condado Tacos, Graeter's. PAG: 17% (low, but different audience) | High — Location data exists; trend view needs interactive layer |

### Phase 3 — Complete

| Page | Rationale | Customer Evidence Strength | Data Readiness |
|------|-----------|---------------------------|----------------|
| **Campaigns** | High need but depends on real-time campaign data and control group infrastructure. | High — Zaxby's, Luna Grill | Low — Campaign attribution and control groups are gaps |
| **Revenue > Trends** | Depth layer. Seasonality comparison, revenue decomposition. | Medium — PAG participant | Medium — Needs time series calculation |
| **Menu > LTO Analysis** | Advanced feature. Huge value when available (Condado proved it), but requires robust item tracking. | High — Condado Tacos | Low — Cannibalization analysis needs complex calculation |

---

## How This Differs from Bikky and Punchh

| Aspect | Bikky | Punchh QBR (Today) | GDP (Ours) |
|--------|-------|-------------------|------------|
| **Delivery model** | Self-serve dashboard | Quarterly report delivery | Self-serve dashboard |
| **Organization** | Data-domain (Lifecycle, Latency, Demographics, Revenue, Menu) | Report sections (Program Performance, Member Analysis, Core Loyalty, Trends) | Outcome-based questions (Guests, Revenue, Menu, Locations, Campaigns) |
| **Lifecycle pages** | 5 separate sub-pages | Engagement ladder + retention cohort (static) | 3 focused pages (Overview, Retention, At Risk) |
| **Cohort Analysis** | Standalone page | Quarterly retention cohort | Embedded in Retention as interactive component |
| **Latency** | Standalone page | Not available as interactive metric | Embedded in Retention |
| **Menu Analytics** | Full page with retention/reorder/churn per item | None | Full page with segment-level item affinity |
| **Non-loyalty guests** | Up to 90% visibility via card matching | None (loyalty-only) | Depends on data sources (PAR Ordering, PAR Pay) |
| **Benchmarking** | Limited | Sophisticated: 25+ KPIs by program age cohort | Carry forward Punchh benchmarks + contextual display |
| **Page layout** | Fixed KPI cards + charts on all pages | Static report slides | Dashboard: KPI cards (scan). Dedicated pages: chart-blocks with embedded headline metrics (focus) |
| **Interaction model** | Browse and filter | Static export | Slice → Segment → Drill-down → Act |
| **Framing** | Descriptive ("Churn", "Engagement") | Report ("Member Analysis", "Important Trends") | Action-oriented ("At Risk", "Retention") |
| **AI** | "Data Assistant" (open-ended Q&A) | None | "Ask Ava" (guided questions + suggested actions + guardrails) |
| **Analytics → Action bridge** | Export to marketing tools | Manual segment creation + campaign setup | [Create Segment] at every insight; future: [Send to Campaign] |
| **Segment builder feedback** | Real-time (shows LTV, count as you build) | Batch processing (wait for results) | Real-time (carry forward Bikky pattern) |
| **Page count** | 15+ pages | 20+ QBR slides | 11 pages (fewer pages, more depth each) |
| **User intent** | Primarily strategic | Primarily strategic (delivered to leadership) | Both strategic and operational (explore + act) |

### GDP's Core Differentiators

1. **Every insight is one click from "Create Segment"** — analytics and action are unified, not separate workflows
2. **Punchh's benchmark infrastructure** — no competitor has cohort-adjusted benchmarks across 25+ KPIs
3. **Punchh's segment builder** — "elite" (customers' word) — integrated with analytics, not a separate tool
4. **Ava with guardrails** — pre-formed questions and cited data, not open-ended prompts that mislead non-technical users
5. **Product line flexibility** — graceful degradation based on which PAR products a brand uses (vs. Bikky which requires specific POS integrations)

---

## Sources

- Dovetail Customer Interviews (Condado Tacos, Zaxby's, Luna Grill, Graeter's, Charley's, PAR Advisory Group)
- PAG Metric Placement Exercise (March 2025) — ~18 participants ranked analytics metrics by importance (internal)
- CDP Model Blueprint — Blue-print of CDP model from Brands across PAR (internal)
- Data Dictionary for QBRs (internal)
- [Bikky — Guest Lifecycle](https://www.bikky.com/guest-lifecycle)
- [Bikky — Menu Analysis](https://www.bikky.com/menu-analysis)
- [Bikky — Demographics](https://www.bikky.com/demographics)
- [Bikky — Marketing Automation](https://www.bikky.com/marketing-automation)
- [Bikky — Guest Profiles](https://www.bikky.com/guest-profiles)
- [Bikky — Data Assistant](https://www.bikky.com/data-assistant)
- [Olo — Guest Data Platform](https://www.olo.com/gdp)
- [Olo — Lifetime Value: The North-Star Metric for Restaurants](https://www.olo.com/blog/lifetime-value-explained-the-north-star-metric-for-restaurants)
- [Olo — Guide to Restaurant Guest Acquisition](https://www.olo.com/blog/guide-to-restaurant-guest-acquisition-part-3)
- [Olo — 6 Guest Retention Strategies](https://www.olo.com/blog/6-guest-retention-strategies-that-actually-work)
- [Bloom Intelligence — State of Restaurant Guest Retention 2025](https://bloomintelligence.com/blog/state-of-restaurant-guest-retention-2025/)
- [Data Delivers — 2025 Restaurant Guest Engagement Report](https://datadelivers.com/insights/2025-restaurant-guest-engagement-report/)
- [Thanx — Restaurant Reporting Software](https://www.thanx.com/restaurant-reporting-software)
- [Momos — KPIs That Will Define Restaurant Success in 2026](https://www.momos.com/blog/the-kpis-that-will-define-restaurant-success-in-2026-and-how-to-win-ahead-with-ai)
