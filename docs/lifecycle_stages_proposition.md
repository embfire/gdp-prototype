# Guest Lifecycle Stages — Proposition

**Author:** Dragan Drlacic
**Audience:** PM
**Date:** 2026-04-28
**Status:** Discussion

## TL;DR

The current 5-stage model (New, Returning, Active/Loyal, At-Risk, Churned) is broadly defensible, but three changes are strongly supported by both customer interviews and industry frameworks. None are stylistic — each fixes a specific operational or definitional issue.

| # | Change | Why it matters |
|---|---|---|
| 1 | **Add Win-back** as a 6th stage | Customer-validated as a CEO-level metric. Distinct from Returning. Highest-ROI campaign cohort. |
| 2 | **Loyal threshold: 4 visits → 3 visits** | The 3-visit threshold is customer-validated. The 4-visit number has no source. |
| 3 | **Returning: rolling-window → journey-state** | Current "2–3 visits / 90 days" wording silently drops 2-visit guests on day 91. |

---

## 1. Add Win-back as a 6th stage

**The change:** Treat re-engaged guests (previously Loyal/At-Risk/Churned, now returning) as a distinct stage rather than collapsing them into Returning.

**Why "Returning" can't absorb them:** "Returning" in industry terminology means *"made it past visit 1"* — a first-journey state. Win-back is a *recovery* state. Different history, different campaign, different economics.

**Customer evidence:**

> "Our CEO gets the weekly Biki report — week over week performance of sales revenue per restaurant, new guests, **re-engaged guests, re-onboarding guests**." — Evan, Condado Tacos ([analytics_proposition.md:673](analytics_proposition.md))

The CEO at Condado Tacos *already* tracks these as separate cohorts. Collapsing them into Returning loses a board-level metric.

**Industry evidence:**

- **Optimove's lifecycle framework** explicitly separates "Returning visitors" from "Reactivated customers" — defining the latter as *"customers who had churned and then returned to make another purchase."* ([source](https://www.optimove.com/resources/learning-center/customer-lifecycle-marketing))
- **Mobile CDP frameworks** include Reactivated User as a sixth stage. ([source](https://reteno.com/blog/customer-lifecycle-management--6-main-stages-for-mobile-apps))
- Industry guidance: *"Reactivated customers are on par with first-time customers when it comes to the difficulty of retaining them"* — the exact reason they need their own stage and campaign treatment. ([source](https://hashmeta.com/blog/reactivation-campaigns-winning-back-lost-customers-through-strategic-re-engagement/))

**Counterpoint considered:** Braze treats win-back as an action, not a segment. This is the minority view in lifecycle marketing — most frameworks (and our own customer evidence) treat it as a stage.

**Fallback if a 6th stage is too much:** Expose Win-back as a sub-tag/filter on Returning ("first-journey vs. recovered"). Don't lose the cohort entirely.

---

## 2. Loyal threshold: 4 visits → 3 visits

**The change:** Define Loyal as 3+ visits, not 4+.

**Customer evidence:**

> "If you get a guest sticky on a transaction at least **three times**, they actually remain sticky — which is the ultimate goal, driving frequency." — Corey, PAG ([analytics_proposition.md:366](analytics_proposition.md))

> Bobby (Graeter's) described how first-to-third visit data drove their **"Journey to Third Visit"** campaign — audited annually. ([analytics_proposition.md:368](analytics_proposition.md))

**Industry evidence:** Restaurant CDP guidance (Bloom Intelligence, SevenRooms) consistently treats first/second/third visit as the critical inflection — not the fourth.

**Why the PRD's 4-visit number is hard to defend:** I could not find a source for it in our docs or in industry research. It appears to be either a Bikky-specific carry-over or an unsourced choice.

---

## 3. Returning: rolling-window → journey-state

**The change:** Redefine Returning from *"2–3 visits in a rolling 90-day window"* to *"2 visits ever, last visit within 180 days, not yet at Loyal threshold."*

**The bug in the current wording:** A guest with 2 visits 91 days ago is currently:
- Not Returning (outside the 90-day window)
- Not Loyal (only 2 visits)
- Not At-Risk (depends on personal baseline; may not qualify)

They become a silent dropout — present in the guest base but absent from the lifecycle distribution. This is a category error: "Returning" is conflating a *journey state* (where the guest is in their relationship) with a *recency measure* (how active they've been). Recency is what At-Risk and Churned already handle.

**Industry evidence:** No framework I found defines Returning as a rolling-window count. Optimove, Reteno, and Bikky all treat Returning/Active/Engaged as journey states — *has visited again, not yet established a habit*.

---

## Recommended model

| Stage | Definition | Threshold |
|---|---|---|
| **First-time** | One transaction ever | 1 visit |
| **Returning** | Building first-journey habit | 2 visits, last visit within 180 days |
| **Loyal** | Habit established | 3+ visits, still active per personal baseline |
| **At-Risk** | Missed expected window | > 1.5× personal inter-visit avg (90-day floor if <3 visits) |
| **Win-back** | Re-engaged after At-Risk/Churned | First transaction following At-Risk or Churned status; retains history |
| **Churned** | No engagement within churn window | 180 days inactive |

Per-guest At-Risk thresholds (already in the PRD) match Bikky's published differentiator and industry best practice — keep this as-is.

---

## What we keep from the current PRD

- **Per-guest At-Risk baseline (1.5× personal inter-visit avg).** Customer-validated, industry best practice, and the PRD's strongest design choice.
- **24-month stage transition history.** Required for cohort analysis and Win-back detection.
- **Hardcoded thresholds for beta, configurable at GA.** Matches industry pattern.
- **Lifecycle stage on every guest profile + as a segmentation filter.** Non-negotiable.

## Asks

1. Approve adding Win-back (or accept the sub-tag fallback).
2. Approve the 4 → 3 visit threshold change for Loyal.
3. Approve the Returning definition rewrite.

All three are scoped within the existing beta calculation pipeline — no new dependencies.

---

## Sources

**Internal:**
- [analytics_proposition.md](analytics_proposition.md) — Customer interviews (Evan/Condado Tacos, Corey/PAG, Bobby/Graeter's, Maddie/Luna Grill)

**External:**
- [Optimove — Customer Lifecycle Marketing](https://www.optimove.com/resources/learning-center/customer-lifecycle-marketing)
- [Bikky — Reducing Churn and Personalization](https://www.bikky.com/blog/reducing-churn-and-the-power-of-personalization)
- [Reteno — Customer Lifecycle 6 Stages (mobile CDP)](https://reteno.com/blog/customer-lifecycle-management--6-main-stages-for-mobile-apps)
- [Hashmeta — Reactivation Campaigns](https://hashmeta.com/blog/reactivation-campaigns-winning-back-lost-customers-through-strategic-re-engagement/)
- [Braze — RFM Segmentation](https://www.braze.com/resources/articles/rfm-segmentation) (counterpoint)
- [Bloom Intelligence — Restaurant Audience Segmentation](https://bloomintelligence.com/blog/restaurant-audience-segmentation/)
