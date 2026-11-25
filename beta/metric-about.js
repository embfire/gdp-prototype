/* ═══════════════════════════════════════════════════════════════════
   Metric "About this metric" panel — shared across all dashboard
   widgets and detail pages.

   Pattern: every dashboard chart has three disclosure layers:
     1. Info tooltip next to the chart title (one-sentence definition)
     2. "About this metric" help (?) button next to the ⋮ overflow menu
        — production moved it out of the menu in G360-257
     3. A side panel. Production's layout is What it shows / How it's
        calculated / How to read it / Formula (a stacked fraction or an
        equation), plus a "Stages" section for Guest lifecycle. The
        detail pages of the simple metrics (total guests, active
        guests, new guests, AOV, visit frequency, repeat rate) still
        use the older What it shows / Formula / Why it matters /
        How to read it layout.

   Spec: beta/_docs/metric-about-panel.md
═══════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // ──────────────────────────────────────────────────────────────────
  // Metric content. Two contexts per metric: widget (dashboard card)
  // and detail (chart-detail page). A context with a `sections` array
  // uses the current production layout; a context with whatItShows /
  // howToRead uses the older layout, with the metric-level formula and
  // whyItMatters shared.
  // ──────────────────────────────────────────────────────────────────
  // Copy is lifted verbatim from production
  // (G360 frontend/apps/360/src/locales/en.ts → dashboard.<metric>).
  // Lifecycle placeholders are filled with PAR's default thresholds
  // (backend/apps/360/app/Support/LifecycleDefaults.php).
  var METRIC_INFO = {
    'total-guests': {
      title: 'About total guests',
      infoTooltip: 'All known guests as of the last day of the selected period, including guests from before the period started',
      formula:
        'Total guests = count of distinct identified guests acquired on or before the period end\n' +
        'Delta % = (base at this period’s end − base at previous period’s end) ÷ base at previous period’s end × 100',
      whyItMatters:
        'Identified guests are the audience you can segment, message, and measure. Growth in this number tells you whether your marketing, loyalty, and channel programs are expanding the addressable base',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'The number of known guests your brand has, counted up to the last day of the selected period' },
          { heading: 'How it’s calculated', body: 'Every known guest first seen on or before the last day of the period. It includes guests from before the period started. The number next to the total is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is the guest count on each day. A steeper line means you are adding known guests faster. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', equation: { label: 'Total guests', expression: 'known guests first seen on or before the period end' } },
        ],
      },
      detail: {
        whatItShows: 'How identified guests trend over the selected period, with an optional breakdown by acquisition channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether the current trend is better or worse than usual. In a breakdown, each line is one channel — watch for shifts in the mix, not just the overall total. A channel pulling ahead means more new identities came from that source',
      },
    },

    'active-guests': {
      title: 'About active guests',
      infoTooltip: 'Known guests with at least 1 transaction in the selected period. Each guest counts once.',
      formula:
        'Active guests = count of distinct identified guests with ≥1 verified transaction in the selected period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Active guests is your working audience for retention and per-guest metrics. It can rise or fall as guests engage and lapse independently of how fast you identify new ones — so a flat or declining active line while total guests grows means you are identifying faster than you re-engage',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'The number of known guests who bought at least once in the selected period' },
          { heading: 'How it’s calculated', body: 'Each guest counts once, no matter how many times they bought. The number next to the total is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is how many guests bought on each day. The total is not the sum of the days, because a guest who bought on 3 days counts once. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', equation: { label: 'Active guests', expression: 'known guests with at least 1 transaction in the period' } },
        ],
      },
      detail: {
        whatItShows: 'How many distinct identified guests transacted on each day of the selected period, with optional segmentation by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether the active base is healthy. In a breakdown, each line is one channel — watch for shifts in which channel is keeping guests active. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'new-guest-acquisition': {
      title: 'About new guest acquisition',
      infoTooltip: 'Guests whose first known transaction falls in the selected period. Each guest counts once.',
      formula:
        'New guests = count of identified guests whose first visit falls in the period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Acquisition is the input to every downstream guest metric — repeat rate, lifetime value, and retention. Watching the trend tells you whether your marketing and channel mix is growing the addressable base, or whether you are just churning through the same customers',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'The number of guests seen for the first time in the selected period' },
          { heading: 'How it’s calculated', body: 'Each guest counts once, on the date of their first known transaction. If no date is on file, they count on the day their profile was created. The number next to the total is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is new guests per day, and the total adds up every day. A spike often lines up with a campaign or a launch. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', equation: { label: 'New guests', expression: 'known guests whose first transaction falls in the period' } },
        ],
      },
      detail: {
        whatItShows: 'How many new identified guests are added each day in the selected period, with an optional breakdown by acquisition channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether acquisition is improving. In a breakdown, each line is one channel; watch for shifts in which channel is driving acquisition. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'avg-order-value': {
      title: 'About average order value',
      infoTooltip: 'Average spend per transaction from known guests in the selected period, based on the check total before discounts',
      formula:
        'AOV = total gross check revenue ÷ total transaction count\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Tracks spend efficiency per visit. Comparing AOV across segments — loyalty vs non-loyalty, frequent vs occasional — reveals upsell and offer-optimization opportunities',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'The average amount a known guest spends per transaction in the selected period' },
          { heading: 'How it’s calculated', body: 'Total spend ÷ number of transactions, across the whole period. Spend is the check total before discounts. Transactions with no known guest are left out. The number next to the average is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is the average for each day. The average at the top is not the average of the daily values, because busy days count for more. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', fraction: { label: 'AOV', numerator: 'Total spend', denominator: 'Transactions' } },
        ],
      },
      detail: {
        whatItShows: 'How average spend per visit is trending day by day, with an optional breakdown by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether spend per visit is improving. In a breakdown, each line is one channel; watch for shifts in which channel commands the highest AOV. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'reachability': {
      title: 'About reachability',
      infoTooltip: 'Share of guests who bought in the selected period and are opted in to email, SMS, or push marketing',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'Of the guests who bought in the selected period, the share you can reach with email, SMS, or push marketing' },
          { heading: 'How it’s calculated', body: 'Reachable guests ÷ identified guests. Identified guests are known guests who bought in the selected period. A guest is reachable when they are currently opted in to marketing on at least 1 channel. Only loyalty members have an opt-in today, so no other guest counts as reachable. The change is this period’s rate minus the previous period’s rate, in percentage points. For example, going from 60% to 64% shows as +4 pts.' },
          { heading: 'How to read it', body: 'Each guest is in only 1 group. Email only, SMS only, and Push only hold guests opted in to that 1 channel. Multi-channel holds guests opted in to 2 or more. Not reachable holds guests with no opt-in.' },
          { heading: 'Formula', fraction: { label: 'Reachable', numerator: 'Guests opted in on at least 1 channel', denominator: 'Identified guests', multiplier: '× 100' }, equation: { label: 'Change', expression: 'this period − previous period', note: 'Shown in percentage points (pts)' } },
        ],
      },
      detail: {
        sections: [
          { heading: 'What it shows', body: 'Of the guests who bought in the selected period, the share you can reach with email, SMS, or push marketing' },
          { heading: 'How it’s calculated', body: 'Reachable guests ÷ identified guests. Identified guests are known guests who bought in the selected period. A guest is reachable when they are currently opted in to marketing on at least 1 channel. Only loyalty members have an opt-in today, so no other guest counts as reachable. The change is this period’s rate minus the previous period’s rate, in percentage points. For example, going from 60% to 64% shows as +4 pts.' },
          { heading: 'How to read it', body: 'Each guest is in only 1 group. Email only, SMS only, and Push only hold guests opted in to that 1 channel. Multi-channel holds guests opted in to 2 or more. Not reachable holds guests with no opt-in.' },
          { heading: 'Formula', fraction: { label: 'Reachable', numerator: 'Guests opted in on at least 1 channel', denominator: 'Identified guests', multiplier: '× 100' }, equation: { label: 'Change', expression: 'this period − previous period', note: 'Shown in percentage points (pts)' } },
        ],
      },
    },

    'guest-repeat-rate': {
      title: 'About guest repeat rate',
      infoTooltip: 'Of the guests who bought in a month, the share who bought again the next month',
      formula:
        'Repeat rate = base-period guests who returned in the next period ÷ base-period guests × 100\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'Repeat rate is a fast, leading indicator of guest stickiness — far quicker to read than full retention curves. A rising rate means guests are coming back; a falling one means acquisition is outpacing retention and downstream lifetime value will follow',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'Of the guests who bought in a month, the share who bought again the next month' },
          { heading: 'How it’s calculated', body: 'For each full month in the range, guests who bought that month and again the next month ÷ guests who bought that month. The rate at the top uses all of those months together. A month counts only after the next month has ended. Ranges under 90 days use 90 days. The number next to the rate is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is the rate for each month. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', fraction: { label: 'Repeat rate', numerator: 'Guests who bought again the next month', denominator: 'Guests who bought that month', multiplier: '× 100' } },
        ],
      },
      detail: {
        whatItShows: 'How the repeat rate has trended over base periods, with an optional breakdown by channel using the dropdown above the chart',
        howToRead:   'In Total mode, the solid line is this period and the striped line is the previous period — compare them to judge whether returns are getting better or worse than usual. In a breakdown, each line is one channel; watch for shifts in which channel is driving or dragging the overall rate. A coming-soon message means that breakdown is not yet computed',
      },
    },

    'retention-cohort': {
      title: 'About retention cohort',
      infoTooltip: 'The share of new guests who came back the month after their first visit',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'Of the guests whose first visit was in a month, the share who came back the next month' },
          { heading: 'How it’s calculated', body: 'Each month’s new guests form a group. Retention = guests in the group who bought in the next calendar month ÷ guests in the group. Unlike Guest repeat rate, this counts only guests in their first month. The rate at the top is the newest group with a full next month. Ranges under 90 days use 90 days. The number next to the rate is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'The line is the rate for each month’s new guests. A rising line means newer guests are coming back more. The solid line is this period, and the striped line is the comparison period.' },
          { heading: 'Formula', fraction: { label: 'Retention', numerator: 'New guests who bought the next month', denominator: 'New guests that month', multiplier: '× 100' } },
        ],
      },
      detail: {
        sections: [
          { heading: 'What it shows', body: 'How each month’s new guests come back over time. Each row is 1 month’s new guests, and each column is a later month.' },
          { heading: 'How it’s calculated', body: 'Each month’s new guests form a group. Each cell = guests in the group who bought in that later month ÷ guests in the group. Month 1 is the month after the first visit, Month 2 is the month after that, and so on. A guest counts in every later month they bought in. A month shows only after it has ended. The rate at the top is the newest group’s Month 1 rate, the same as next-month retention on the dashboard card. Ranges under 90 days use 90 days. The number next to the rate is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'Read across a row to follow 1 group over time. Read down a column to compare groups at the same point. A darker cell means a higher rate. Hover a cell to see the rate and the group size.' },
          { heading: 'Formula', fraction: { label: 'Retention in a month', numerator: 'New guests who bought in that month', denominator: 'New guests in the group', multiplier: '× 100' } },
        ],
      },
    },

    'guest-lifecycle-breakdown': {
      title: 'About guest lifecycle',
      infoTooltip: 'How your known guests split across 6 stages, from first-time to churned, on the snapshot date',
      formula:
        'A visit = one distinct guest + business day (multiple same-day transactions count once)\n' +
        'Each stage = count of distinct identified guests classified in that stage as of the snapshot date\n' +
        'At-Risk threshold = 1.5 × per-guest average gap between visits (90-day floor if fewer than 3 visits)\n' +
        'Churned threshold = more than 180 days since last visit',
      whyItMatters:
        'The lifecycle mix tells you whether you are growing loyal guests faster than you are losing them. Watching the at-risk and churned stages early gives you time to act before revenue follows them out',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'How your known guests split across 6 stages, from first-time to churned, on the snapshot date' },
          { heading: 'How it’s calculated', body: 'Each guest goes in 1 stage, based on their visits up to the snapshot date. Stages are checked in the order below, and the first match wins.' },
          { heading: 'How to read it', body: 'Each bar is the number of guests in a stage. The strip above the bars shows each stage as a share of all guests. The number at the top is the count of At-Risk guests.' },
          { heading: 'Formula', equation: { label: 'Each stage', expression: 'guests in that stage on the snapshot date' } },
        ],
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
          { term: 'Churned',    color: '#E83162', body: 'No visit for more than 180 days' },
          { term: 'First-time', color: '#30ACEE', body: 'Only 1 visit' },
          { term: 'At-Risk',    color: '#F8931C', body: 'No visit for more than 1.5× their usual gap between visits. With fewer than 3 visits, the gap is set to 90 days' },
          { term: 'Win-back',   color: '#8C9FFF', body: 'Came back after being At-Risk or Churned' },
          { term: 'Loyal',      color: '#0CC281', body: '3 or more visits' },
          { term: 'Returning',  color: '#5A55E3', body: 'Everyone else' },
        ],
      },
    },

    'visit-frequency': {
      title: 'About visit frequency',
      infoTooltip: 'Average visits per known guest in the selected period, with guests grouped by number of visits. A visit is 1 day with at least 1 transaction.',
      formula:
        'A visit = one distinct guest + business day (multiple same-day transactions count once)\n' +
        'Average visits = total visits in the period ÷ identified guests in the period\n' +
        'Bucket count = identified guests with that number of visits in the period\n' +
        'Delta % = (this period − previous period) ÷ previous period × 100',
      whyItMatters:
        'The shape of the distribution tells you more than the average alone. A tall single-visit bar with a thin tail says you have an acquisition machine that does not retain; a fatter middle says habitual customers. Watching how the curve shifts period over period reveals whether your loyalty, frequency, and reactivation programs are pushing guests up the frequency ladder',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'How many times guests visited in the selected period, and the average visits per guest' },
          { heading: 'How it’s calculated', body: 'A visit is 1 day with at least 1 transaction, so 2 transactions on the same day count as 1 visit. Each guest goes in 1 group: 1 visit, 2 visits, 3-5, 6-10, or 11+. The number next to the average is the % change from the comparison period.' },
          { heading: 'How to read it', body: 'Each bar is the number of guests in that group. Solid bars are this period, and striped bars are the comparison period. Taller bars on the right mean guests are coming back more often.' },
          { heading: 'Formula', fraction: { label: 'Average visits', numerator: 'Total visits', denominator: 'Guests with at least 1 visit' } },
        ],
      },
      detail: {
        whatItShows: 'How identified guests are distributed across visit-count buckets for the selected period, alongside per-bucket counts in the table below',
        howToRead:   'Each bar is one visit-count bucket — its height is how many identified guests fall into that bucket. Solid bars are this period; striped bars are the previous period. Look for shifts in the shape — more guests on the right means deeper engagement, more on the left means acquisition is outpacing repeat behavior. The table below gives exact counts and the change versus the previous period for each bucket',
      },
    },

    'loyalty-penetration': {
      title: 'About loyalty penetration',
      infoTooltip: 'Share of identified transactions tied to a loyalty member in the selected period',
      widget: {
        sections: [
          { heading: 'What it shows', body: 'The share of transactions tied to a known guest that belong to a loyalty member. The percentage of transactions tied to a loyalty guest compared to your entire guest base' },
          { heading: 'How it’s calculated', body: 'Loyalty transactions ÷ identified transactions. The change is this period’s rate minus the previous period’s rate, in percentage points. For example, going from 24% to 28% shows as +4 pts.' },
          { heading: 'How to read it', body: 'The line is the loyalty share across the selected period, read left to right. Where it rises, a larger share of transactions belonged to loyalty members. The solid line is this period, and the striped line is the previous period.' },
          { heading: 'Formula', fraction: { label: 'Penetration', numerator: 'Loyalty transactions', denominator: 'Identified transactions', multiplier: '× 100' }, equation: { label: 'Change', expression: 'this period − previous period', note: 'Shown in percentage points (pts)' } },
        ],
      },
      detail: {
        sections: [
          { heading: 'What it shows', body: 'The share of transactions tied to a known guest that belong to a loyalty member. The percentage of transactions tied to a loyalty guest compared to your entire guest base' },
          { heading: 'How it’s calculated', body: 'Loyalty transactions ÷ identified transactions. The change is this period’s rate minus the previous period’s rate, in percentage points. For example, going from 24% to 28% shows as +4 pts.' },
          { heading: 'How to read it', body: 'The line is the loyalty share across the selected period, read left to right. Where it rises, a larger share of transactions belonged to loyalty members. The solid line is this period, and the striped line is the previous period.' },
          { heading: 'Formula', fraction: { label: 'Penetration', numerator: 'Loyalty transactions', denominator: 'Identified transactions', multiplier: '× 100' }, equation: { label: 'Change', expression: 'this period − previous period', note: 'Shown in percentage points (pts)' } },
        ],
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

  // Structured formula: `label = numerator / denominator multiplier`
  // drawn as a stacked fraction, with an optional equation line under a
  // divider (mirrors production's MetricInfoPanel).
  function renderStructuredFormula(s) {
    var html = '';
    if (s.fraction) {
      var f = s.fraction;
      html +=
        '<div class="about-panel__fraction-row">' +
          '<span class="about-panel__formula-label">' + escapeHTML(f.label) + ' =</span>' +
          '<span class="about-panel__fraction">' +
            '<span class="about-panel__fraction-numerator">' + escapeHTML(f.numerator) + '</span>' +
            '<span class="about-panel__fraction-denominator">' + escapeHTML(f.denominator) + '</span>' +
          '</span>' +
          (f.multiplier ? '<span class="about-panel__fraction-multiplier">' + escapeHTML(f.multiplier) + '</span>' : '') +
        '</div>';
    }
    if (s.equation) {
      var e = s.equation;
      html +=
        '<div class="about-panel__equation">' +
          '<p class="about-panel__equation-line"><span class="about-panel__formula-label">' + escapeHTML(e.label) + '</span> = ' + escapeHTML(e.expression) + '</p>' +
          (e.note ? '<p class="about-panel__equation-note">' + escapeHTML(e.note) + '</p>' : '') +
        '</div>';
    }
    return '<div class="about-panel__formula about-panel__formula--structured">' + html + '</div>';
  }

  function renderSections(info, context) {
    var ctx = info[context] || info.widget;
    var sections = ctx.sections ? ctx.sections.slice() : [
      { heading: 'What it shows',  body: ctx.whatItShows },
      { heading: 'Formula',        formula: info.formula },
      { heading: 'Why it matters', body: info.whyItMatters },
      { heading: 'How to read it', body: ctx.howToRead },
    ];
    if (info.stages) {
      sections.push({ heading: 'Stages', notice: info.stages.notice, definitions: info.stages.definitions });
    }
    return sections.map(function(s) {
      var inner;
      if (s.fraction || s.equation) {
        inner = renderStructuredFormula(s);
      } else if (s.formula) {
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
        inner = '<p class="about-panel__text">' + escapeHTML(s.body) + '</p>';
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
      firstTime: 'Only 1 visit',
      returning: 'Everyone else',
      // Production copy names the PAR stages; once renamed, name the
      // brand's own labels so the sentence still reads correctly.
      winBack:   (n.atRisk === 'At-Risk' && n.churned === 'Churned')
        ? 'Came back after being At-Risk or Churned'
        : 'Came back after being ' + n.atRisk + ' or ' + n.churned,
      loyal:     t.loyalMinVisits + ' or more visits',
      atRisk:    'No visit for more than ' + t.atRiskMultiplier + '× their usual gap between visits. With fewer than ' + t.loyalMinVisits + ' visits, the gap is set to ' + t.atRiskFloorDays + ' days',
      churned:   'No visit for more than ' + t.churnedWindowDays + ' days',
    };
    // Rule order: the first matching stage wins.
    var RULE_ORDER = ['churned', 'firstTime', 'atRisk', 'winBack', 'loyal', 'returning'];
    info.stages = {
      notice: base.stages.notice,
      definitions: RULE_ORDER.map(function(k) {
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
