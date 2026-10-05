/* ═══════════════════════════════════════════════════════════════════
   Metric "About this metric" panel — shared across all dashboard
   widgets and detail pages.

   Pattern: every dashboard chart has three disclosure layers:
     1. Info tooltip next to the chart title (one-sentence definition)
     2. "About this metric" help (?) button next to the ⋮ overflow menu
        — production moved it out of the menu in G360-257
     3. A side panel with four sections (What it shows / Formula /
        Why it matters / How to read it), plus a fifth "Stages"
        section for categorical metrics (Guest lifecycle)

   Spec: beta/_docs/metric-about-panel.md
═══════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // ──────────────────────────────────────────────────────────────────
  // Metric content. Two contexts per metric: widget (dashboard card)
  // and detail (chart-detail page). Formula and "why it matters" are
  // shared — they describe the metric, not the chart.
  // ──────────────────────────────────────────────────────────────────
  // Copy is lifted verbatim from production
  // (G360 frontend/apps/360/src/locales/en.ts → dashboard.<metric>).
  // Lifecycle placeholders are filled with PAR's default thresholds
  // (backend/apps/360/app/Support/LifecycleDefaults.php).
  var METRIC_INFO = {
    'total-guests': {
      title: 'About total guests',
      infoTooltip: 'Cumulative identified guest base as of the end of the selected period — every guest resolved to a single identity across channels, from their first visit onward',
      formula:
        'Total guests = count of distinct identified guests acquired on or before the period end\n' +
        'Delta % = (base at this period’s end − base at previous period’s end) ÷ base at previous period’s end × 100',
      whyItMatters:
        'Identified guests are the audience you can segment, message, and measure. Growth in this number tells you whether your marketing, loyalty, and channel programs are expanding the addressable base',
      widget: {
        whatItShows: 'The size of your brand’s whole identified guest base and how it grows over the selected period — cumulative, so it only rises and is always at least as large as Active guests',
        howToRead:   'The solid line is this period; the striped line is the previous period. An upward trend means profile stitching is keeping pace with traffic. A flat or falling line while transactions grow points to identity capture gaps — for example, fewer guests checking in at the POS',
      },
      detail: {
        whatItShows: 'How identified guests trend over the selected period, with an optional breakdown by acquisition channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether the current trend is better or worse than usual. In a breakdown, each line is one channel — watch for shifts in the mix, not just the overall total. A channel pulling ahead means more new identities came from that source',
      },
    },

    'active-guests': {
      title: 'About active guests',
      infoTooltip: 'Distinct identified guests with at least one verified transaction in the selected period — your transacting base, not the cumulative identified base',
      formula:
        'Active guests = count of distinct identified guests with ≥1 verified transaction in the selected period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Active guests is your working audience for retention and per-guest metrics. It can rise or fall as guests engage and lapse independently of how fast you identify new ones — so a flat or declining active line while total guests grows means you are identifying faster than you re-engage',
      widget: {
        whatItShows: 'How many identified guests are active — guests with at least one verified transaction in the selected period',
        howToRead:   'The solid line is this period; the striped line is the previous period — compare them to judge whether your active base is growing or shrinking. The hero number is the distinct active guests across the whole selected period, not an average of the daily counts',
      },
      detail: {
        whatItShows: 'How many distinct identified guests transacted on each day of the selected period, with optional segmentation by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether the active base is healthy. In a breakdown, each line is one channel — watch for shifts in which channel is keeping guests active. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'new-guest-acquisition': {
      title: 'About new guest acquisition',
      infoTooltip: 'New identified guests acquired in the selected period — each guest counts on the day of their first visit',
      formula:
        'New guests = count of identified guests whose first visit falls in the period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Acquisition is the input to every downstream guest metric — repeat rate, lifetime value, and retention. Watching the trend tells you whether your marketing and channel mix is growing the addressable base, or whether you are just churning through the same customers',
      widget: {
        whatItShows: 'How many new identified guests are being acquired each day — each guest counts once, on the day of their first visit',
        howToRead:   'Each point is one day of new identified guests. The solid line is this period; the striped line is the previous period. An upward trend means acquisition is accelerating. Sharp spikes usually map to a campaign or channel launch; sustained dips warrant investigating loyalty signups, POS capture, and channel performance',
      },
      detail: {
        whatItShows: 'How many new identified guests are added each day in the selected period, with an optional breakdown by acquisition channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether acquisition is improving. In a breakdown, each line is one channel; watch for shifts in which channel is driving acquisition. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'avg-order-value': {
      title: 'About average order value',
      infoTooltip: 'Average spend per identified guest visit in the selected period, based on the gross check amount (before discounts)',
      formula:
        'AOV = total gross check revenue ÷ total transaction count\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Tracks spend efficiency per visit. Comparing AOV across segments — loyalty vs non-loyalty, frequent vs occasional — reveals upsell and offer-optimization opportunities',
      widget: {
        whatItShows: 'Average spend per identified guest visit across the selected period, based on the gross check amount (before discounts) — a measure of how much each transaction is worth on average',
        howToRead:   'Each point is the weighted AOV for that day. A rising trend means guests are spending more per visit, whether through upsell, larger party sizes, or premium item mix. The dashed line is the previous period — use it to judge whether the current trend is better or worse than normal',
      },
      detail: {
        whatItShows: 'How average spend per visit is trending day by day, with an optional breakdown by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether spend per visit is improving. In a breakdown, each line is one channel; watch for shifts in which channel commands the highest AOV. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'reachability': {
      title: 'About reachability',
      infoTooltip: 'Reachability (Beta) currently reflects loyalty guests only — marketing consent (email/SMS/push) is available for loyalty members today. Broader coverage for non-loyalty guests is coming',
      formula:
        'Reachable % = guests reachable on at least one channel ÷ identified guests × 100\n' +
        'Delta % = current reachable % − previous reachable %',
      whyItMatters:
        'Reachable guests are the audience you can actually market to. Tracking reachable share tells you whether identity capture, opt-in capture, and channel consent are keeping pace with acquisition — if reachable share falls while identified grows, you are losing marketing access faster than you are gaining audience',
      widget: {
        whatItShows: 'How loyalty guests split across reachable channels — email, SMS, push, and multi-channel — plus the share with no reachable channel. Beta note: marketing consent exists for loyalty members only today, so non-loyalty guests are not yet included',
        howToRead:   'The stacked bar splits identified guests into mutually exclusive buckets — each guest counts toward exactly one channel. A guest reachable on more than one channel falls into multi-channel. The not-reachable bucket is identified guests with no contactable channel — useful for analysis, but you cannot message them. The ⓘ snapshot note marks that this is a point-in-time view with no daily trend',
      },
      detail: {
        whatItShows: 'The reachable channel mix for the guests active in the selected period — reachable %, per-channel counts, and the share with no reachable channel. It reflects each guest’s current channel consent, so it’s a point-in-time view with no trend line',
        howToRead:   'The snapshot table breaks identified guests into mutually exclusive buckets — each guest counts toward exactly one channel, with multi-channel for guests reachable on more than one, and a not-reachable bucket you can analyze but not message. The note above the table marks the snapshot date; this is a point-in-time view with no daily trend to plot',
      },
    },

    'guest-repeat-rate': {
      title: 'About guest repeat rate',
      infoTooltip: 'Share of base-period guests who came back for at least one more transaction in the next complete period',
      formula:
        'Repeat rate = base-period guests who returned in the next period ÷ base-period guests × 100\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Repeat rate is a fast, leading indicator of guest stickiness — far quicker to read than full retention curves. A rising rate means guests are coming back; a falling one means acquisition is outpacing retention and downstream lifetime value will follow',
      widget: {
        whatItShows: 'How the share of guests returning in the following period has trended — for each base period, the percentage who came back at least once in the next complete period',
        howToRead:   'Each point is one base period and the share of those guests who came back the next period. The solid line is this period; the striped line is the previous period. An upward trend means retention is improving; a dip on a single period points to that month — campaign, channel, or operational change. The ⓘ notice flags short ranges that fall back to the 90-day minimum window',
      },
      detail: {
        whatItShows: 'How the repeat rate has trended over base periods, with an optional breakdown by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether returns are getting better or worse than usual. In a breakdown, each line is one channel; watch for shifts in which channel is driving or dragging the overall rate. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'retention-cohort': {
      title: 'About retention cohort',
      infoTooltip: 'Share of new guests who come back the month after their first visit, tracked across recent acquisition cohorts',
      formula:
        'M+1 retention = guests in cohort who returned the next month ÷ guests in cohort × 100\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'M+1 retention is the earliest signal of new-guest stickiness — improving it lifts downstream lifetime value. Watching the trend across cohorts tells you whether acquisition and onboarding changes are paying off month after month',
      widget: {
        whatItShows: 'How M+1 retention has trended cohort by cohort — for each acquisition month, the share of new guests who came back the following month',
        howToRead:   'Each point is one acquisition cohort and its M+1 retention rate. The solid line is this period; the striped line is the previous period. An upward trend means newer cohorts are sticking better than older ones. A sharp dip on a single cohort points to that month — campaign mix, channel changes, or a one-off event',
      },
      detail: {
        whatItShows: 'How each acquisition cohort retains over time — every row is one cohort, every column is months since acquisition (M+1, M+2, and so on), and the cell color shows the retention rate',
        howToRead:   'Read across a row to see one cohort’s retention curve over time. Read down a column to compare cohorts at the same age. Stronger color means higher retention. The 90-day minimum guards against short windows that do not have enough cohort age to be reliable',
      },
    },

    'guest-lifecycle-breakdown': {
      title: 'About guest lifecycle',
      infoTooltip: 'How identified guests split across lifecycle stages — from first-time through loyal to churned — as of the latest snapshot',
      formula:
        'A visit = one distinct guest + business day (multiple same-day transactions count once)\n' +
        'Each stage = count of distinct identified guests classified in that stage as of the snapshot date\n' +
        'At-Risk threshold = 1.5 × per-guest average gap between visits (90-day floor if fewer than 3 visits)\n' +
        'Churned threshold = more than 180 days since last visit',
      whyItMatters:
        'The lifecycle mix tells you whether you are growing loyal guests faster than you are losing them. Watching the at-risk and churned stages early gives you time to act before revenue follows them out',
      widget: {
        whatItShows: 'How identified guests split across the 6 lifecycle stages — first-time, returning, win-back, loyal, at-risk, and churned — as of the latest snapshot, so you can read the overall mix at a glance',
        howToRead:   'Each bar is one lifecycle stage, and the thin strip above shows each stage as a share of the whole. A large loyal share is a healthy base, while a large at-risk or churned share is worth acting on. Toggle stages in the legend to focus on one, and check the ⓘ snapshot note for the date these counts reflect',
      },
      detail: {
        whatItShows: 'How identified guests split across the 6 lifecycle stages as of the latest snapshot — one bar per stage, with a share strip above the bars',
        howToRead:   'Each bar is one lifecycle stage, and the thin strip above shows each stage as a share of the whole. A large loyal share is a healthy base, while a large at-risk or churned share is worth acting on. Toggle stages in the legend to focus on one, and check the ⓘ snapshot note for the date these counts reflect',
      },
      // Categorical metric — fifth "Stages" section after "How to read it".
      // Swatch colors match the chart bands (LIFECYCLE_STAGES in each page).
      // Stage names and thresholds are brand-configurable in production
      // (Settings → Definitions), so the notice labels these as PAR defaults.
      stages: {
        notice: 'Stage names and thresholds start from PAR’s defaults. Each brand can rename stages and adjust thresholds in Settings → Definitions.',
        definitions: [
          { term: 'First-time', color: '#30ACEE', body: 'First and only visit so far' },
          { term: 'Returning',  color: '#5A55E3', body: 'Second visit ever, latest in the last 180 days' },
          { term: 'Win-back',   color: '#8C9FFF', body: 'First visit after an At-Risk or Churned period' },
          { term: 'Loyal',      color: '#0CC281', body: '3 or more lifetime visits, still active within their typical visit cadence' },
          { term: 'At-Risk',    color: '#F8931C', body: 'Time since last visit is more than 1.5× their typical gap between visits — or more than 90 days for guests with fewer than 3 visits' },
          { term: 'Churned',    color: '#E83162', body: 'No visit in more than 180 days' },
        ],
      },
    },

    'visit-frequency': {
      title: 'About visit frequency',
      infoTooltip: 'Average number of visits per identified guest in the selected period, alongside the distribution across visit-count buckets',
      formula:
        'A visit = one distinct guest + business day (multiple same-day transactions count once)\n' +
        'Average visits = total visits in the period ÷ identified guests in the period\n' +
        'Bucket count = identified guests with that number of visits in the period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'The shape of the distribution tells you more than the average alone. A tall single-visit bar with a thin tail says you have an acquisition machine that does not retain; a fatter middle says habitual customers. Watching how the curve shifts period over period reveals whether your loyalty, frequency, and reactivation programs are pushing guests up the frequency ladder',
      widget: {
        whatItShows: 'How identified guests are distributed across visit-count buckets — each bar is one bucket showing how many guests visited that many times — alongside the average visits per guest in the hero',
        howToRead:   'Each bar is one visit-count bucket — its height is how many identified guests fall into that bucket. Solid bars are this period; striped bars are the previous period overlay. Look at the overall shape, not just the bars individually — a shift to the right means guests are coming back more often, a shift to the left means frequency is dropping. The hero shows the period average for a single-number summary',
      },
      detail: {
        whatItShows: 'How identified guests are distributed across visit-count buckets for the selected period, alongside per-bucket counts in the table below',
        howToRead:   'Each bar is one visit-count bucket — its height is how many identified guests fall into that bucket. Solid bars are this period; striped bars are the previous period. Look for shifts in the shape — more guests on the right means deeper engagement, more on the left means acquisition is outpacing repeat behavior. The table below gives exact counts and the change versus the previous period for each bucket',
      },
    },

    'loyalty-spend-lift': {
      title: 'About enrollment spend lift',
      infoTooltip: 'Shows how much more — or less — enrolled guests spend per visit compared to before they joined. New metric — not the same as the QBR “Spend Lift” (which compares loyalty vs anonymous guests)',
      formula:
        'Lift = avg post-enrollment spend − avg pre-enrollment spend (gross check amount)\n' +
        'Delta % = lift ÷ avg pre-enrollment spend × 100',
      whyItMatters:
        'Loyalty members often spend more — but high spenders also tend to join more. This metric removes that bias by using the same guest as their own baseline',
      widget: {
        whatItShows: 'How loyalty enrollment changes what guests spend per visit — using the same guests as their own baseline, not comparing different people. This is a new metric, distinct from the QBR “Spend Lift” (loyalty vs anonymous guests with outlier trimming)',
        howToRead:   'Positive lift means members spend more per visit after joining. Negative lift is worth investigating — could be redemption behavior or a sampling issue. The cohort window (shown in the notice) is the enrollment period the date range selects',
      },
      detail: {
        whatItShows: 'How lift per enrollment cohort has changed over time — each point is the lift for guests who enrolled on that date',
        howToRead:   'An upward trend means newer cohorts are showing stronger lift. A spike on a specific date could reflect a promotion or campaign driving higher post-enrollment spend. The dashed line is the previous period — use it to judge whether the current trend is better or worse than normal',
      },
    },

    'loyalty-penetration': {
      title: 'About loyalty penetration',
      infoTooltip: 'Share of identified transactions tied to a loyalty member in the selected period',
      formula:
        'Loyalty penetration = loyalty transactions ÷ identified transactions × 100\n' +
        'Delta = this period − previous period (additive points, not relative %)',
      whyItMatters:
        'Loyalty members are typically your most valuable guests. A rising penetration means more of your identified business is being captured by the program — better data, better personalization, and a stronger lever for retention campaigns',
      widget: {
        whatItShows: 'The share of identified transactions tied to a loyalty member over the selected period — how much of your identified business runs through the loyalty program. Beta note: the denominator currently covers POS transactions; online ordering and payment channels will be included as their data lands',
        howToRead:   'Each point is one month and the share of identified transactions tied to a loyalty member. The solid line is this period; the striped line is the previous period. The pill shows the additive points change vs the prior comparison window — “+4pts” means penetration is four percentage points higher than before',
      },
      detail: {
        whatItShows: 'How loyalty penetration has trended month over month, with an optional breakdown by channel (in-store, online, delivery) using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether penetration is improving. In By channel mode, each line is one channel; watch for shifts in which channel is driving penetration. A coming-soon message means the channel breakdown is not yet computed',
      },
    },
  };

  // Expose the dictionary so pages can pull infoTooltip text without
  // hard-coding it. Useful for the title-info tooltip.
  window.METRIC_INFO = METRIC_INFO;

  // ──────────────────────────────────────────────────────────────────
  // Panel host. One backdrop + panel pair lives on document.body,
  // built lazily on first open.
  // ──────────────────────────────────────────────────────────────────
  var backdropEl = null;
  var panelEl    = null;
  var titleEl    = null;
  var bodyEl     = null;
  var escHandler = null;

  function ensureHost() {
    if (panelEl) return;

    backdropEl = document.createElement('div');
    backdropEl.className = 'about-panel-backdrop';
    backdropEl.addEventListener('click', closeAboutPanel);
    document.body.appendChild(backdropEl);

    panelEl = document.createElement('aside');
    panelEl.className = 'about-panel';
    panelEl.setAttribute('role', 'dialog');
    panelEl.setAttribute('aria-modal', 'true');
    panelEl.setAttribute('aria-hidden', 'true');
    panelEl.innerHTML =
      '<header class="about-panel__header">' +
        '<h3 class="about-panel__title"></h3>' +
        '<button type="button" class="about-panel__close" aria-label="Close">' +
          '<span class="material-symbols-rounded">close</span>' +
        '</button>' +
      '</header>' +
      '<div class="about-panel__body"></div>' +
      '<div class="about-panel__footer">' +
        '<button type="button" class="button primary button__full-width about-panel__got-it">' +
          '<span>Got it</span>' +
        '</button>' +
      '</div>';

    titleEl = panelEl.querySelector('.about-panel__title');
    bodyEl  = panelEl.querySelector('.about-panel__body');
    panelEl.querySelector('.about-panel__close').addEventListener('click', closeAboutPanel);
    panelEl.querySelector('.about-panel__got-it').addEventListener('click', closeAboutPanel);

    document.body.appendChild(panelEl);
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderDefinitions(definitions) {
    return (
      '<dl class="about-panel__definitions">' +
        definitions.map(function(d) {
          var swatch = d.color
            ? '<span class="about-panel__swatch" style="background:' + d.color + ';" aria-hidden="true"></span>'
            : '';
          return (
            '<div class="about-panel__definition">' +
              '<dt class="about-panel__term">' + swatch + escapeHTML(d.term) + '</dt>' +
              '<dd class="about-panel__definition-body">' + escapeHTML(d.body) + '</dd>' +
            '</div>'
          );
        }).join('') +
      '</dl>'
    );
  }

  function renderSections(info, context) {
    var ctx = info[context] || info.widget;
    var sections = [
      { heading: 'What it shows',  text: ctx.whatItShows },
      { heading: 'Formula',        formula: info.formula },
      { heading: 'Why it matters', text: info.whyItMatters },
      { heading: 'How to read it', text: ctx.howToRead },
    ];
    if (info.stages) {
      sections.push({ heading: 'Stages', notice: info.stages.notice, definitions: info.stages.definitions });
    }
    return sections.map(function(s) {
      var inner;
      if (s.formula) {
        inner = '<pre class="about-panel__formula">' + escapeHTML(s.formula) + '</pre>';
      } else if (s.definitions) {
        inner =
          (s.notice
            ? '<div class="about-panel__notice">' +
                '<span class="material-symbols-rounded about-panel__notice-icon" aria-hidden="true">info</span>' +
                '<p class="about-panel__notice-text">' + escapeHTML(s.notice) + '</p>' +
              '</div>'
            : '') +
          renderDefinitions(s.definitions);
      } else {
        inner = '<p class="about-panel__text">' + escapeHTML(s.text) + '</p>';
      }
      return (
        '<section class="about-panel__section">' +
          '<p class="about-panel__heading">' + escapeHTML(s.heading) + '</p>' +
          inner +
        '</section>'
      );
    }).join('');
  }

  // Guest lifecycle copy follows the brand's saved definitions
  // (lifecycle-definitions.js) — stage names in the Stages section and
  // threshold numbers in the formula and definitions. Falls back to the
  // static PAR-default copy above when the helper isn't loaded.
  var LIFECYCLE_COLORS = {
    firstTime: '#30ACEE', returning: '#5A55E3', winBack: '#8C9FFF',
    loyal: '#0CC281', atRisk: '#F8931C', churned: '#E83162',
  };

  function resolveLifecycleInfo(base) {
    if (!window.G360Lifecycle) return base;
    var defs = window.G360Lifecycle.load();
    var n = defs.names, t = defs.thresholds;
    var info = Object.assign({}, base);
    info.formula =
      'A visit = one distinct guest + business day (multiple same-day transactions count once)\n' +
      'Each stage = count of distinct identified guests classified in that stage as of the snapshot date\n' +
      'At-Risk threshold = ' + t.atRiskMultiplier + ' × per-guest average gap between visits (' + t.atRiskFloorDays + '-day floor if fewer than ' + t.loyalMinVisits + ' visits)\n' +
      'Churned threshold = more than ' + t.churnedWindowDays + ' days since last visit';
    var bodies = {
      firstTime: 'First and only visit so far',
      returning: 'Second visit ever, latest in the last ' + t.returningWindowDays + ' days',
      // Production copy names the PAR stages; once renamed, avoid the
      // "an <name>" article so any brand label reads correctly.
      winBack:   (n.atRisk === 'At-Risk' && n.churned === 'Churned')
        ? 'First visit after an At-Risk or Churned period'
        : 'First visit after a period in ' + n.atRisk + ' or ' + n.churned,
      loyal:     t.loyalMinVisits + ' or more lifetime visits, still active within their typical visit cadence',
      atRisk:    'Time since last visit is more than ' + t.atRiskMultiplier + '× their typical gap between visits — or more than ' + t.atRiskFloorDays + ' days for guests with fewer than ' + t.loyalMinVisits + ' visits',
      churned:   'No visit in more than ' + t.churnedWindowDays + ' days',
    };
    info.stages = {
      notice: base.stages.notice,
      definitions: window.G360Lifecycle.STAGE_KEYS.map(function(k) {
        return { term: n[k], color: LIFECYCLE_COLORS[k], body: bodies[k] };
      }),
    };
    return info;
  }

  function openAboutPanel(metricId, opts) {
    var info = METRIC_INFO[metricId];
    if (info && metricId === 'guest-lifecycle-breakdown') info = resolveLifecycleInfo(info);
    if (!info) {
      console.warn('[metric-about] unknown metric id:', metricId);
      return;
    }
    opts = opts || {};
    var context = opts.context || 'widget';

    ensureHost();
    titleEl.textContent = info.title;
    bodyEl.innerHTML    = renderSections(info, context);

    backdropEl.classList.add('about-panel-backdrop--open');
    panelEl.classList.add('about-panel--open');
    panelEl.setAttribute('aria-hidden', 'false');

    // Close any open context menus that triggered this
    document.querySelectorAll('.chart-context-menu--open').forEach(function(m) {
      m.classList.remove('chart-context-menu--open');
      var prev = m.previousElementSibling;
      if (prev) prev.setAttribute('aria-expanded', 'false');
    });

    escHandler = function(e) { if (e.key === 'Escape') closeAboutPanel(); };
    document.addEventListener('keydown', escHandler);
  }

  function closeAboutPanel() {
    if (!panelEl) return;
    panelEl.classList.remove('about-panel--open');
    backdropEl.classList.remove('about-panel-backdrop--open');
    panelEl.setAttribute('aria-hidden', 'true');
    if (escHandler) {
      document.removeEventListener('keydown', escHandler);
      escHandler = null;
    }
  }

  window.openAboutPanel  = openAboutPanel;
  window.closeAboutPanel = closeAboutPanel;

  // ──────────────────────────────────────────────────────────────────
  // Helpers for HTML pages. Pages can call these from their existing
  // markup to avoid duplicating the snippet across files.
  // ──────────────────────────────────────────────────────────────────

  // Returns the "About this metric" help (?) button that sits next to
  // the ⋮ overflow trigger in a chart-card header. Mirrors production's
  // AboutMetricButton: icon-only transparent button, hover tooltip is
  // the only label. Stops propagation so the header's open-detail click
  // doesn't fire.
  window.aboutMetricButtonHTML = function(metricId, context) {
    var ctxAttr = context === 'detail' ? 'detail' : 'widget';
    return (
      '<div class="chart-help-wrap" data-about-metric-entry>' +
        '<button type="button" class="button transparent no-content chart-card__help-btn" ' +
          'aria-label="About this metric" ' +
          'onmousedown="event.stopPropagation()" ' +
          'onclick="event.stopPropagation(); openAboutPanel(\'' + metricId + '\', { context: \'' + ctxAttr + '\' });">' +
          '<span class="material-symbols-rounded">help</span>' +
        '</button>' +
        '<div class="chart-tooltip">About this metric</div>' +
      '</div>'
    );
  };

  // Returns the info-icon + tooltip markup that sits next to a
  // chart-card title. Uses the bento `.tooltip` pattern — purple
  // 16x16 SVG icon, dark tooltip bubble shown on hover. The hover
  // visibility override lives in beta.css.
  window.titleInfoTooltipHTML = function(text) {
    if (!text) return '';
    var safe = escapeHTML(text);
    return (
      '<span class="tooltip chart-card__title-info">' +
        '<svg class="tooltip_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
          '<path d="M7.50002 11.1667H8.49999V7.33334H7.50002V11.1667ZM8 6.19232C8.15257 6.19232 8.28045 6.14072 8.38365 6.03752C8.48685 5.93432 8.53845 5.80644 8.53845 5.65387C8.53845 5.50132 8.48685 5.37343 8.38365 5.27022C8.28045 5.16702 8.15257 5.11542 8 5.11542C7.84744 5.11542 7.71955 5.16702 7.61635 5.27022C7.51315 5.37343 7.46155 5.50132 7.46155 5.65387C7.46155 5.80644 7.51315 5.93432 7.61635 6.03752C7.71955 6.14072 7.84744 6.19232 8 6.19232ZM8.00112 14.3333C7.12516 14.3333 6.30181 14.1671 5.53105 13.8347C4.76029 13.5022 4.08983 13.051 3.51969 12.4812C2.94953 11.9113 2.49816 11.2411 2.16557 10.4707C1.83298 9.70026 1.66669 8.87708 1.66669 8.00112C1.66669 7.12516 1.83291 6.30181 2.16535 5.53105C2.4978 4.76029 2.94896 4.08983 3.51885 3.51969C4.08875 2.94953 4.75891 2.49816 5.52934 2.16557C6.29975 1.83298 7.12293 1.66669 7.99889 1.66669C8.87484 1.66669 9.6982 1.83291 10.469 2.16535C11.2397 2.4978 11.9102 2.94896 12.4803 3.51885C13.0505 4.08875 13.5018 4.75892 13.8344 5.52934C14.167 6.29975 14.3333 7.12293 14.3333 7.99889C14.3333 8.87484 14.1671 9.6982 13.8347 10.469C13.5022 11.2397 13.051 11.9102 12.4812 12.4803C11.9113 13.0505 11.2411 13.5018 10.4707 13.8344C9.70026 14.167 8.87708 14.3333 8.00112 14.3333Z" fill="currentColor"/>' +
        '</svg>' +
        '<span class="tooltip__container tooltip__container_top">' +
          '<span class="tooltip__container_arrow-top"></span>' +
          '<span class="tooltip__text-container_content">' +
            '<span class="tooltip_text">' + safe + '</span>' +
          '</span>' +
        '</span>' +
      '</span>'
    );
  };

  // Convenience: after DOM is ready, decorate any static chart-card
  // title that has a `data-metric-id` attribute with the info icon,
  // and insert the "About this metric" help button before every
  // `.chart-context-wrap` whose containing card has that same
  // attribute. Detail pages set `data-metric-id` on the chart-card
  // root and we walk from there.
  function decorateStaticPages() {
    document.querySelectorAll('.chart-card[data-metric-id]').forEach(function(card) {
      var metricId = card.getAttribute('data-metric-id');
      var info = METRIC_INFO[metricId];
      if (!info) return;
      var context = card.getAttribute('data-metric-context') === 'detail' ? 'detail' : 'widget';

      // Insert info icon next to title, only if not already there
      var titleNode = card.querySelector('.chart-card__title');
      if (titleNode && !titleNode.parentNode.querySelector('.chart-card__title-info')) {
        var wrap = document.createElement('div');
        wrap.className = 'chart-card__title-row';
        titleNode.parentNode.insertBefore(wrap, titleNode);
        wrap.appendChild(titleNode);
        wrap.insertAdjacentHTML('beforeend', window.titleInfoTooltipHTML(info.infoTooltip));
      }

      // Insert the help button in front of every overflow menu inside
      // this card, only if not already there.
      card.querySelectorAll('.chart-context-wrap').forEach(function(wrap) {
        var prev = wrap.previousElementSibling;
        if (prev && prev.hasAttribute('data-about-metric-entry')) return;
        wrap.insertAdjacentHTML('beforebegin', window.aboutMetricButtonHTML(metricId, context));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateStaticPages);
  } else {
    decorateStaticPages();
  }
})();
