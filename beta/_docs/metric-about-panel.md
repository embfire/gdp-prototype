# Frontend — Metric "About this metric" panel

Every dashboard chart that shows a calculated metric must have three disclosure layers: an info tooltip on the title, an overflow menu entry, and an "About this metric" side panel. This card defines the content structure, copy rules, and implementation pattern.

---

## Pattern components

| Component | Where | What it contains |
|---|---|---|
| Info tooltip (`tooltip-content` on `BSubHeading`) | Next to chart title | One sentence — what the metric measures. No formula |
| "About this metric" in overflow menu | `⋮` context menu | Icon: `info` (Material). Label: "About this metric". Opens the side panel |
| Side panel (`MetricInfoPanel`) | Mounted via `v-if` | Four sections — see below |

---

## Side panel section structure

Every panel has exactly these four sections in this order. Only the formula section uses a code block; the rest are plain text paragraphs.

### 1 — What it shows
One sentence. Describes what data the chart renders — not why it matters, not how to read it. Widget and detail page often need different body text because the chart type differs (aggregate vs. time series).

**Copy rules:**
- Start with "How…" or a noun phrase
- No formula in this section — that lives in section 2
- If widget and detail chart are the same type, one body text is enough

### 2 — Formula
Shows the exact calculation. Uses a code block (no copy button, text wraps). Shared between widget and detail page — the math never changes.

**Copy rules:**
- Use `−` (minus sign) not `-` (hyphen)
- Use `÷` not `/`
- Use `×` not `*`
- Each variable on its own line if the formula is multi-part
- No punctuation

### 3 — Why it matters
One to two sentences. The business reason this metric exists — the consequence of ignoring it or the decision it informs.

**Copy rules:**
- Never start with "This metric…"
- Focus on the outcome or risk, not the math
- Shared between widget and detail page

### 4 — How to read it
Two to four sentences. Concrete guidance on interpreting the chart the user is currently looking at. Widget and detail versions are almost always different.

**Copy rules:**
- Name actual things in the chart (bars, line, dashed line, buckets, columns)
- State what "good" looks like and what warrants investigation
- Reference UI elements like "the ⓘ notice" or "the dashed line" where relevant

---

## When to fork widget vs. detail copy

Fork **What it shows** and **How to read it** when:
- The widget shows an aggregate (single number, two bars) but the detail shows a time series
- The detail adds a compare period line the widget doesn't have
- The detail shows a breakdown (cohorts, buckets) the widget collapses

Keep **Formula** and **Why it matters** identical — they describe the metric, not the chart.

---

## Chart inventory

All copy follows `ux-copy.md`. No trailing punctuation on single sentences. Periods between sentences in multi-sentence paragraphs only.

---

### Loyalty spend lift
**Info tooltip:** Shows how much more — or less — enrolled guests spend per visit compared to before they joined

**What it shows (widget):** How loyalty enrollment changes what guests spend per visit — using the same guests as their own baseline, not comparing different people

**What it shows (detail):** How lift per enrollment cohort has changed over time — each point is the lift for guests who enrolled on that date

**Formula:**
```
Lift = avg post-enrollment spend − avg pre-enrollment spend
Delta % = lift ÷ avg pre-enrollment spend × 100
```

**Why it matters:** Loyalty members often spend more — but high spenders also tend to join more. This metric removes that bias by using the same guest as their own baseline

**How to read it (widget):** Positive lift means members spend more per visit after joining. Negative lift is worth investigating — could be redemption behavior or a sampling issue. The cohort window (shown in the notice) is the enrollment period the date range selects

**How to read it (detail):** An upward trend means newer cohorts are showing stronger lift. A spike on a specific date could reflect a promotion or campaign driving higher post-enrollment spend. The dashed line is the previous period — use it to judge whether the current trend is better or worse than normal

---

### Total guests
**Info tooltip:** Unique identified guests with at least one visit in the selected period

**What it shows (widget + detail):** How the total count of identified guests has changed over time

**Formula:**
```
Total guests = distinct count of identified guests
               with at least one transaction in the selected range
```

**Why it matters:** Total guests is the baseline for every other metric. A drop here affects all downstream numbers — repeat rate, reachability, lifecycle all depend on this count

**How to read it (widget):** An upward trend means the guest base is growing. A flat line means you are retaining at roughly the same pace you are losing guests

**How to read it (detail):** The time series shows day-by-day guest count. Use the compare period line to judge whether growth is accelerating or slowing relative to the previous period

---

### New guest acquisition
**Info tooltip:** Guests making their first recorded visit in the selected period

**What it shows (widget + detail):** How many guests visited for the first time each day or week during the selected period

**Formula:**
```
New guests = guests whose first transaction date
             falls within the selected date range
```

**Why it matters:** New guest acquisition is the top of the loyalty funnel. Without consistent acquisition, the program shrinks over time as existing guests lapse

**How to read it (widget):** Consistent new guest flow is healthy. Spikes often follow marketing campaigns or new location openings. A sustained drop needs investigation

**How to read it (detail):** The time series shows day-by-day acquisition volume. Align spikes with campaign launch dates to measure impact. The compare period line shows whether this period is tracking ahead or behind

---

### Reachability
**Info tooltip:** Share of identified guests who have at least one contact method on file

**What it shows (widget + detail):** How many of your identified guests can be reached by email, SMS, or push — and which channel covers the most guests

**Formula:**
```
Reachability % = guests with at least one contact method
                 ÷ total identified guests × 100
```

**Why it matters:** Unreachable guests cannot receive loyalty campaigns. A high reachability rate means a larger actionable audience — every unreachable guest is a marketing opportunity missed

**How to read it (widget):** The chart shows guests reachable by each channel. A guest is counted once even if they have multiple channels. The gap between total guests and reachable guests is the audience you cannot market to

**How to read it (detail):** Use the channel breakdown to decide which contact method to prioritise for enrollment prompts. Growing the smallest channel often has the biggest incremental impact

---

### Guest repeat rate
**Info tooltip:** Share of guests from a base period who returned for at least one visit in the next period

**What it shows (widget):** The percentage of guests who visited in a base month and came back at least once in the following month

**What it shows (detail):** How repeat rate has changed across base periods over time

**Formula:**
```
Repeat rate = guests who returned in the follow-up period
              ÷ total guests in the base period × 100
```

**Why it matters:** Repeat rate measures retention directly. Retention is more cost-effective than acquisition — and higher repeat rates compound over time as returning guests visit more often

**How to read it (widget):** A higher rate is better. Compare to the previous period line to see if retention is improving or declining. Only complete month pairs are included — shown in the ⓘ notice

**How to read it (detail):** The time series shows how repeat rate moves across base periods. A sustained decline may signal a product or experience issue. Short-term dips often coincide with holidays or calendar anomalies

---

### Retention cohort
**Info tooltip:** M+1 retention rate for each acquisition cohort — how many guests came back the month after their first visit

**What it shows (widget + detail):** Each acquisition cohort's one-month retention rate, plotted over time so you can compare newer cohorts to older ones

**Formula:**
```
Retention % (cohort M) = guests from cohort M who visited in month M+1
                         ÷ total guests in cohort M × 100
```

**Why it matters:** Cohort analysis separates long-term retention from short-term effects. A promotion can spike one month's repeat rate — cohort data shows whether those guests actually stuck around

**How to read it (widget):** Each point on the chart represents one acquisition cohort. An upward trend in recent cohorts means newer guests are retaining better

**How to read it (detail):** Each row in the heatmap is one acquisition cohort. Read across a row to track how that cohort ages. Read down a column to compare the same follow-up month across cohorts — improving values down the column mean your program is getting better over time

---

### Guest lifecycle
**Info tooltip:** Your identified guests broken down by where they are in their relationship with the brand

**What it shows (widget + detail):** The distribution of identified guests across lifecycle stages — new, active, at-risk, and lapsed

**Formula:**
```
Stage = assigned based on recency of last visit
        relative to the guest's typical visit frequency
```

**Why it matters:** The lifecycle view shows where your guest base is healthy and where it is at risk. A growing at-risk or lapsed segment represents revenue at risk — these guests still have some chance of returning if acted on now

**How to read it (widget):** A healthy program has a large active segment and small at-risk and lapsed segments. Watch for growth in the at-risk bucket — those guests are still reachable. Lapsed guests are the hardest to win back

**How to read it (detail):** Use the trend lines to spot shifts between stages. Guests moving from active to at-risk before the program intervenes is the key signal to watch

---

### Visit frequency
**Info tooltip:** How your guests are distributed across visit-count tiers for the selected period

**What it shows (widget + detail):** The share of guests who visited once, twice, three to five times, or six or more times during the selected period

**Formula:**
```
Frequency bucket = total visit count per guest in the selected range,
                   grouped into tiers (1, 2, 3–5, 6+, etc.)
```

**Why it matters:** High-frequency guests drive a disproportionate share of revenue. Understanding the frequency distribution shows whether your loyalty program is deepening engagement or just collecting one-time visitors

**How to read it (widget):** Most programs are top-heavy — a small group visits very often while most guests visit once or twice. If the 1-visit bucket is large and growing, you have an acquisition-without-retention problem

**How to read it (detail):** Compare buckets across periods to see if guests are moving up the frequency ladder. The goal of most loyalty programs is to shift guests from the 1–2 visit bucket into the 3–5 range

---

### Active guests *(GDP/beta prototype only)*
**Info tooltip:** Guests who made at least one visit during the selected period

**What it shows (widget + detail):** The count of guests who visited at least once in the selected date range, tracked over time

**Formula:**
```
Active guests = distinct count of guests with at least one
                transaction in the selected date range
```

**Why it matters:** Active guests are your currently engaged audience. This is the base for calculating campaign reach and per-guest revenue. A large gap between enrolled and active guests means many members have stopped engaging

**How to read it (widget):** Compare to total enrolled guests to see what share of your loyalty base is active. A declining trend means the program is losing engagement faster than it is acquiring new members

**How to read it (detail):** The time series shows day-by-day active guest count. Align dips and spikes with promotions or seasonal patterns to understand what drives engagement

---

### Loyalty penetration *(GDP/beta prototype only)*
**Info tooltip:** Share of total transactions made by loyalty program members

**What it shows (widget + detail):** What percentage of all transactions or visits during the selected period were made by identified loyalty members

**Formula:**
```
Loyalty penetration % = loyalty member transactions
                        ÷ total transactions × 100
```

**Why it matters:** High penetration means you are capturing most guest data. Low penetration means a large share of revenue is untracked — you cannot market to those guests or measure their behavior

**How to read it (widget):** A high percentage (70% or above) means your loyalty program is embedded in most guest interactions. A declining trend may mean staff are not prompting guests to identify at checkout

**How to read it (detail):** Use the time series to spot drops that correlate with specific locations or time periods. A single low-penetration location can pull the overall rate down significantly

---

## G360 implementation checklist

For each new or existing widget:

1. **i18n keys** — add to `src/locales/en.ts` under `dashboard.<metricKey>`:
   ```
   infoTooltip: '...'
   about: {
     title: 'About <metric name>'
     gotIt: 'Got it'
     whatItShows: { heading: 'What it shows', body: '...' }
     formula:     { heading: 'Formula', code: '...' }
     whyItMatters: { heading: 'Why it matters', body: '...' }
     howToRead:   { heading: 'How to read it', body: '...' }
     detail: {                          // only if detail copy differs
       whatItShows: { body: '...' }
       howToRead:   { body: '...' }
     }
   }
   ```

2. **Widget** (`*Widget.vue`):
   - Add `tooltip-content` prop to `BSubHeading`
   - Add `:show-about-metric="true"` to `WidgetOverflowMenu`
   - Add `aboutPanelOpen = ref(false)` and `aboutSections` computed
   - Handle `'about-metric'` in `onOverflowAction`
   - Add `<MetricInfoPanel v-if="aboutPanelOpen" :open="true" … @close="aboutPanelOpen = false" />`

3. **Detail card** (`*DetailCard.vue`):
   - Same steps as widget
   - Use `detail.whatItShows.body` and `detail.howToRead.body` keys if they exist
   - The inline `BContextMenu` options array gets the about-metric entry directly (no `WidgetOverflowMenu`)

**Components involved:**
- `src/components/Dashboard/MetricInfoPanel.vue` — shared, no changes needed per chart
- `src/components/Dashboard/WidgetOverflowMenu.vue` — add `:show-about-metric="true"` prop per widget

---

## GDP/beta implementation checklist

For each dashboard HTML page:

1. **Info tooltip** — add `title` attribute or a `.chart-card__metric-info-tooltip` element next to the chart heading with the info tooltip text

2. **Overflow menu** — add the "About this metric" list item to `.chart-context-menu`:
   ```html
   <li>
     <button class="chart-context-menu__item" onclick="openAboutPanel('<metric-id>')">
       <span class="material-symbols-rounded">info</span>
       <span>About this metric</span>
     </button>
   </li>
   ```

3. **Side panel HTML** — add a `.about-panel` element (see `beta.css` for styles once added):
   ```html
   <div class="about-panel" id="about-<metric-id>" aria-hidden="true">
     <div class="about-panel__header">
       <h3>About <metric name></h3>
       <button class="about-panel__close" onclick="closeAboutPanel('<metric-id>')">
         <span class="material-symbols-rounded">close</span>
       </button>
     </div>
     <div class="about-panel__body">
       <div class="about-panel__section">
         <p class="about-panel__heading">What it shows</p>
         <p class="about-panel__text">…</p>
       </div>
       <div class="about-panel__section">
         <p class="about-panel__heading">Formula</p>
         <pre class="about-panel__formula">…</pre>
       </div>
       <!-- repeat for Why it matters / How to read it -->
     </div>
     <div class="about-panel__footer">
       <button class="about-panel__got-it" onclick="closeAboutPanel('<metric-id>')">Got it</button>
     </div>
   </div>
   ```

4. **JS** — add open/close handlers and a backdrop overlay to `beta.css` / inline script
