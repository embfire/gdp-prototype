# GDP Analytics — KPI & Chart Inventory

Every KPI card and chart across all 11 analytics pages. Dashboard uses compact KPI cards (scan mode). All dedicated pages use chart-blocks with embedded headline metrics (focus mode).

---

## 1. Dashboard (Phase 1) — KPI Cards


| #   | Component                                                                   | Type     |
| --- | --------------------------------------------------------------------------- | -------- |
| 1   | Total Guests                                                                | KPI card |
| 2   | Active Guests (trailing 90d)                                                | KPI card |
| 3   | Repeat Rate                                                                 | KPI card |
| 4   | Avg Guest Lifetime Value                                                    | KPI card |
| 5   | Responsive Audience                                                         | KPI card |
| 6   | Guest Lifecycle Funnel (First-time → Returning → Loyal → At Risk → Churned) | Chart    |
| 7   | Revenue Concentration ("Top 20% drive X%")                                  | Chart    |
| 8   | What Changed (Ava)                                                          | AI card  |
| 9   | Alerts                                                                      | AI card  |


Dashboard KPI cards are customizable — users can swap from a curated card library. Metrics like Loyalty Spend Lift, Loyalty Penetration, and Visit Frequency are available as library cards.

---

## 2. Guests > Overview (Phase 1) — Charts


| #   | Component                                                                     | Type  |
| --- | ----------------------------------------------------------------------------- | ----- |
| 1   | Guest Composition (by lifecycle stage)                                        | Chart |
| 2   | Identification Rate                                                           | Chart |
| 3   | Marketing Reachability (funnel: Total → Reachable → Responsive → Unreachable) | Chart |
| 4   | Loyalty vs. Non-Loyalty (side-by-side comparison)                             | Chart |
| 5   | Loyalty Penetration (% + trend + by location)                                 | Chart |
| 6   | Guest Trends (total, new vs. returning over time)                             | Chart |
| 7   | Guest Value Distribution (GLV histogram)                                      | Chart |
| 8   | Frequency Distribution (daily/weekly/monthly/quarterly/irregular)             | Chart |


---

## 3. Guests > Acquisition (Phase 1) — Chart-Blocks


| #   | Chart-Block                           | Headline Metric             |
| --- | ------------------------------------- | --------------------------- |
| 1   | New Guest Acquisition                 | New Guests + % change       |
| 2   | First-Visit Conversion                | First-Visit Conversion Rate |
| 3   | Acquisition by Channel                | Largest channel + share %   |
| 4   | Loyalty Enrollment Rate               | Enrollment rate + trend     |
| 5   | First Visit Profile                   | Avg first check             |
| 6   | Largest Increase/Decrease by Location | Top mover + delta           |


---

## 4. Guests > Retention (Phase 1) — Chart-Blocks


| #   | Chart-Block                 | Headline Metric                                    |
| --- | --------------------------- | -------------------------------------------------- |
| 1   | Return Rate                 | Overall Return Rate + trend                        |
| 2   | Visit Frequency             | Avg Visit Frequency + trend                        |
| 3   | Visit Latency               | Avg Days to Second Visit + trend                   |
| 4   | Engagement Funnel           | Habitual Guest %                                   |
| 5   | Return Rate by Visit Number | 3rd-visit conversion rate                          |
| 6   | Retention Cohort Table      | Current month retention rate                       |
| 7   | Retention by Dimension      | (tabs: Location, Channel, Daypart, Loyalty Status) |


---

## 5. Guests > At Risk (Phase 1) — Chart-Blocks


| #   | Chart-Block               | Headline Metric                              |
| --- | ------------------------- | -------------------------------------------- |
| 1   | Late Guests               | Late Guests % + trend                        |
| 2   | Churned Guests            | Churned Guests % + trend                     |
| 3   | Intervention Tiers        | Total at-risk guests (30/60/90/120/180/365d) |
| 4   | Churn Risk Score          | Risk distribution (Low/Medium/High/Critical) |
| 5   | Predicted Revenue at Risk | Revenue at risk ($) + trend                  |
| 6   | Churn by Dimension        | Highest-churn dimension (tabs)               |
| 7   | Churn by Menu Item        | Highest-churn item (top 20)                  |
| 8   | At-Risk Guest List        | Exportable table                             |


---

## 6. Revenue > Overview (Phase 2) — Chart-Blocks


| #   | Chart-Block                | Headline Metric                      |
| --- | -------------------------- | ------------------------------------ |
| 1   | Total Revenue              | Total Revenue + trend                |
| 2   | Avg Check Size             | Avg Check Size + trend               |
| 3   | Guest Lifetime Value       | Avg GLV + trend                      |
| 4   | Spend Lift                 | Loyalty vs. non-loyalty lift + trend |
| 5   | Revenue Concentration      | "Top 10% = X% of revenue"            |
| 6   | Revenue by Lifecycle Stage | (stacked bar)                        |
| 7   | Revenue by Channel         | (breakdown)                          |


---

## 7. Revenue > Trends (Phase 3) — Charts


| #   | Component           | Type                                    |
| --- | ------------------- | --------------------------------------- |
| 1   | Revenue Over Time   | Line chart (YoY + seasonality)          |
| 2   | Revenue Drivers     | Decomposition (guests × visits × check) |
| 3   | Avg Check Trend     | Line chart + benchmark band             |
| 4   | Revenue by Location | Ranked table + trend indicators         |


---

## 8. Menu > Performance (Phase 2) — Chart-Blocks


| #   | Chart-Block              | Headline Metric                                                         |
| --- | ------------------------ | ----------------------------------------------------------------------- |
| 1   | Item Retention           | Avg Item Retention Rate + trend                                         |
| 2   | Item Reorder Rate        | Avg Item Reorder Rate                                                   |
| 3   | Item Churn               | Avg Item Churn Rate                                                     |
| 4   | Menu Item Table          | Sortable table (Retention, Churn, Reorder, Attachment, Orders, Revenue) |
| 5   | Item Combinations        | Top item pairings                                                       |
| 6   | Guest Type Tabs          | Toggle: All / New / Repeat guests                                       |
| 7   | Item Affinity by Segment | Item patterns for applied segment filter                                |


---

## 9. Menu > LTO Analysis (Phase 3) — Charts


| #   | Component         | Type                                                           |
| --- | ----------------- | -------------------------------------------------------------- |
| 1   | LTO Selector      | Filter/picker                                                  |
| 2   | Impact KPIs       | New guests attracted, Incremental orders, Cannibalization rate |
| 3   | Guest Acquisition | First-time guests from LTO                                     |
| 4   | Cannibalization   | Items that lost orders                                         |
| 5   | Retention Impact  | LTO guest return rate + next order                             |


---

## 10. Locations (Phase 2) — Charts


| #   | Component                      | Type                                                                                                    |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | Location Scorecard Table       | Ranked table (Guest Count, New Guests, Return Rate, Avg Check, Participation Rate, Churn Rate, Revenue) |
| 2   | Location Comparison            | Side-by-side trend lines (2-3 locations)                                                                |
| 3   | Top / Bottom Performers        | Highlight chart                                                                                         |
| 4   | Lifecycle by Location          | Heatmap (locations × lifecycle stages)                                                                  |
| 5   | Participation Rate by Location | Chart + benchmark band                                                                                  |
| 6   | Location Trends                | Time series per location                                                                                |


---

## 11. Campaigns (Phase 3) — Charts


| #   | Component                | Type                                                            |
| --- | ------------------------ | --------------------------------------------------------------- |
| 1   | Audience Health          | Reachable / Responsive / Unreachable (counts + %, trend)        |
| 2   | Campaign List            | Table (Sent, Delivered, Revenue Attributed, Incremental Visits) |
| 3   | Campaign Impact          | Visits driven, revenue attributed, guests re-engaged            |
| 4   | Channel Performance      | Email vs. SMS vs. Push comparison                               |
| 5   | Segment Performance      | Audience segment response rates                                 |
| 6   | Control Group Comparison | Campaign vs. control group                                      |
| 7   | Top Redeemables          | Best offers (redemption rate, discount %, avg check)            |


---

## Summary


| Page                 | Phase | KPI Cards | Charts / Chart-Blocks |
| -------------------- | ----- | --------- | --------------------- |
| Dashboard            | 1     | 5         | 4                     |
| Guests > Overview    | 1     | —         | 8                     |
| Guests > Acquisition | 1     | —         | 6                     |
| Guests > Retention   | 1     | —         | 7                     |
| Guests > At Risk     | 1     | —         | 8                     |
| Revenue > Overview   | 2     | —         | 7                     |
| Revenue > Trends     | 3     | —         | 4                     |
| Menu > Performance   | 2     | —         | 7                     |
| Menu > LTO Analysis  | 3     | —         | 5                     |
| Locations            | 2     | —         | 6                     |
| Campaigns            | 3     | —         | 7                     |
| **Total**            |       | **5**     | **69**                |


