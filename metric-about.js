/* ═══════════════════════════════════════════════════════════════════
   Metric "About this metric" panel — shared across all dashboard
   widgets and detail pages.

   Pattern: every dashboard chart has three disclosure layers:
     1. Info tooltip next to the chart title (one-sentence definition)
     2. "About this metric" entry in the ⋮ overflow menu
     3. A side panel with four sections (What it shows / Formula /
        Why it matters / How to read it)

   Spec: beta/_docs/metric-about-panel.md
═══════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  // ──────────────────────────────────────────────────────────────────
  // Metric content. Two contexts per metric: widget (dashboard card)
  // and detail (chart-detail page). Formula and "why it matters" are
  // shared — they describe the metric, not the chart.
  // ──────────────────────────────────────────────────────────────────
  var METRIC_INFO = {
    'total-guests': {
      title: 'About total guests',
      infoTooltip: 'Unique identified guests with at least one visit in the selected period',
      formula: 'Total guests = distinct count of identified guests with at least one transaction in the selected range',
      whyItMatters:
        'Total guests is the baseline for every other metric. A drop here affects all downstream numbers — repeat rate, reachability, lifecycle all depend on this count',
      widget: {
        whatItShows: 'How the total count of identified guests has changed over time',
        howToRead:   'An upward trend means the guest base is growing. A flat line means you are retaining at roughly the same pace you are losing guests',
      },
      detail: {
        whatItShows: 'How the total count of identified guests has changed over time',
        howToRead:   'The time series shows day-by-day guest count. Use the compare period line to judge whether growth is accelerating or slowing relative to the previous period',
      },
    },

    'active-guests': {
      title: 'About active guests',
      infoTooltip: 'Guests who made at least one visit during the selected period',
      formula: 'Active guests = distinct count of guests with at least one transaction in the selected date range',
      whyItMatters:
        'Active guests are your currently engaged audience. This is the base for calculating campaign reach and per-guest revenue. A large gap between enrolled and active guests means many members have stopped engaging',
      widget: {
        whatItShows: 'The count of guests who visited at least once in the selected date range, tracked over time',
        howToRead:   'Compare to total enrolled guests to see what share of your loyalty base is active. A declining trend means the program is losing engagement faster than it is acquiring new members',
      },
      detail: {
        whatItShows: 'The count of guests who visited at least once in the selected date range, tracked over time',
        howToRead:   'The time series shows day-by-day active guest count. Align dips and spikes with promotions or seasonal patterns to understand what drives engagement',
      },
    },

    'new-guest-acquisition': {
      title: 'About new guest acquisition',
      infoTooltip: 'Guests making their first recorded visit in the selected period',
      formula: 'New guests = guests whose first transaction date falls within the selected date range',
      whyItMatters:
        'New guest acquisition is the top of the loyalty funnel. Without consistent acquisition, the program shrinks over time as existing guests lapse',
      widget: {
        whatItShows: 'How many guests visited for the first time each day or week during the selected period',
        howToRead:   'Consistent new guest flow is healthy. Spikes often follow marketing campaigns or new location openings. A sustained drop needs investigation',
      },
      detail: {
        whatItShows: 'How many guests visited for the first time each day or week during the selected period',
        howToRead:   'The time series shows day-by-day acquisition volume. Align spikes with campaign launch dates to measure impact. The compare period line shows whether this period is tracking ahead or behind',
      },
    },

    'reachability': {
      title: 'About reachability',
      infoTooltip: 'Share of identified guests who have at least one contact method on file',
      formula: 'Reachability % = guests with at least one contact method ÷ total identified guests × 100',
      whyItMatters:
        'Unreachable guests cannot receive loyalty campaigns. A high reachability rate means a larger actionable audience — every unreachable guest is a marketing opportunity missed',
      widget: {
        whatItShows: 'How many of your identified guests can be reached by email, SMS, or push — and which channel covers the most guests',
        howToRead:   'The chart shows guests reachable by each channel. A guest is counted once even if they have multiple channels. The gap between total guests and reachable guests is the audience you cannot market to',
      },
      detail: {
        whatItShows: 'How many of your identified guests can be reached by email, SMS, or push — and which channel covers the most guests',
        howToRead:   'Use the channel breakdown to decide which contact method to prioritise for enrollment prompts. Growing the smallest channel often has the biggest incremental impact',
      },
    },

    'guest-repeat-rate': {
      title: 'About guest repeat rate',
      infoTooltip: 'Share of guests from a base period who returned for at least one visit in the next period',
      formula: 'Repeat rate = guests who returned in the follow-up period ÷ total guests in the base period × 100',
      whyItMatters:
        'Repeat rate measures retention directly. Retention is more cost-effective than acquisition — and higher repeat rates compound over time as returning guests visit more often',
      widget: {
        whatItShows: 'The percentage of guests who visited in a base month and came back at least once in the following month',
        howToRead:   'A higher rate is better. Compare to the previous period line to see if retention is improving or declining. Only complete month pairs are included — shown in the ⓘ notice',
      },
      detail: {
        whatItShows: 'How repeat rate has changed across base periods over time',
        howToRead:   'The time series shows how repeat rate moves across base periods. A sustained decline may signal a product or experience issue. Short-term dips often coincide with holidays or calendar anomalies',
      },
    },

    'retention-cohort': {
      title: 'About retention cohort',
      infoTooltip: 'M+1 retention rate for each acquisition cohort — how many guests came back the month after their first visit',
      formula: 'Retention % (cohort M) = guests from cohort M who visited in month M+1 ÷ total guests in cohort M × 100',
      whyItMatters:
        'Cohort analysis separates long-term retention from short-term effects. A promotion can spike one month’s repeat rate — cohort data shows whether those guests actually stuck around',
      widget: {
        whatItShows: 'Each acquisition cohort’s one-month retention rate, plotted over time so you can compare newer cohorts to older ones',
        howToRead:   'Each point on the chart represents one acquisition cohort. An upward trend in recent cohorts means newer guests are retaining better',
      },
      detail: {
        whatItShows: 'Each acquisition cohort’s one-month retention rate, plotted over time so you can compare newer cohorts to older ones',
        howToRead:   'Each row in the heatmap is one acquisition cohort. Read across a row to track how that cohort ages. Read down a column to compare the same follow-up month across cohorts — improving values down the column mean your program is getting better over time',
      },
    },

    'guest-lifecycle-breakdown': {
      title: 'About guest lifecycle',
      infoTooltip: 'Your identified guests broken down by where they are in their relationship with the brand',
      formula: 'Stage = assigned based on recency of last visit relative to the guest’s typical visit frequency',
      whyItMatters:
        'The lifecycle view shows where your guest base is healthy and where it is at risk. A growing at-risk or lapsed segment represents revenue at risk — these guests still have some chance of returning if acted on now',
      widget: {
        whatItShows: 'The distribution of identified guests across lifecycle stages — new, active, at-risk, and lapsed',
        howToRead:   'A healthy program has a large active segment and small at-risk and lapsed segments. Watch for growth in the at-risk bucket — those guests are still reachable. Lapsed guests are the hardest to win back',
      },
      detail: {
        whatItShows: 'The distribution of identified guests across lifecycle stages — new, active, at-risk, and lapsed',
        howToRead:   'Use the trend lines to spot shifts between stages. Guests moving from active to at-risk before the program intervenes is the key signal to watch',
      },
    },

    'visit-frequency': {
      title: 'About visit frequency',
      infoTooltip: 'How your guests are distributed across visit-count tiers for the selected period',
      formula: 'Frequency bucket = total visit count per guest in the selected range, grouped into tiers (1, 2, 3–5, 6+, etc.)',
      whyItMatters:
        'High-frequency guests drive a disproportionate share of revenue. Understanding the frequency distribution shows whether your loyalty program is deepening engagement or just collecting one-time visitors',
      widget: {
        whatItShows: 'The share of guests who visited once, twice, three to five times, or six or more times during the selected period',
        howToRead:   'Most programs are top-heavy — a small group visits very often while most guests visit once or twice. If the 1-visit bucket is large and growing, you have an acquisition-without-retention problem',
      },
      detail: {
        whatItShows: 'The share of guests who visited once, twice, three to five times, or six or more times during the selected period',
        howToRead:   'Compare buckets across periods to see if guests are moving up the frequency ladder. The goal of most loyalty programs is to shift guests from the 1–2 visit bucket into the 3–5 range',
      },
    },

    'loyalty-spend-lift': {
      title: 'About loyalty spend lift',
      infoTooltip: 'Shows how much more — or less — enrolled guests spend per visit compared to before they joined',
      formula:
        'Lift = avg post-enrollment spend − avg pre-enrollment spend\n' +
        'Delta % = lift ÷ avg pre-enrollment spend × 100',
      // Two independent equations kept on separate lines; neither has
      // internal mid-equation breaks so each fills its line.
      whyItMatters:
        'Loyalty members often spend more — but high spenders also tend to join more. This metric removes that bias by using the same guest as their own baseline',
      widget: {
        whatItShows: 'How loyalty enrollment changes what guests spend per visit — using the same guests as their own baseline, not comparing different people',
        howToRead:   'Positive lift means members spend more per visit after joining. Negative lift is worth investigating — could be redemption behavior or a sampling issue. The cohort window (shown in the notice) is the enrollment period the date range selects',
      },
      detail: {
        whatItShows: 'How lift per enrollment cohort has changed over time — each point is the lift for guests who enrolled on that date',
        howToRead:   'An upward trend means newer cohorts are showing stronger lift. A spike on a specific date could reflect a promotion or campaign driving higher post-enrollment spend. The dashed line is the previous period — use it to judge whether the current trend is better or worse than normal',
      },
    },

    'loyalty-penetration': {
      title: 'About loyalty penetration',
      infoTooltip: 'Share of total transactions made by loyalty program members',
      formula: 'Loyalty penetration % = loyalty member transactions ÷ total transactions × 100',
      whyItMatters:
        'High penetration means you are capturing most guest data. Low penetration means a large share of revenue is untracked — you cannot market to those guests or measure their behavior',
      widget: {
        whatItShows: 'What percentage of all transactions or visits during the selected period were made by identified loyalty members',
        howToRead:   'A high percentage (70% or above) means your loyalty program is embedded in most guest interactions. A declining trend may mean staff are not prompting guests to identify at checkout',
      },
      detail: {
        whatItShows: 'What percentage of all transactions or visits during the selected period were made by identified loyalty members',
        howToRead:   'Use the time series to spot drops that correlate with specific locations or time periods. A single low-penetration location can pull the overall rate down significantly',
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

  function renderSections(info, context) {
    var ctx = info[context] || info.widget;
    return [
      { heading: 'What it shows',  text: ctx.whatItShows },
      { heading: 'Formula',        formula: info.formula },
      { heading: 'Why it matters', text: info.whyItMatters },
      { heading: 'How to read it', text: ctx.howToRead },
    ].map(function(s) {
      var inner = s.formula
        ? '<pre class="about-panel__formula">' + escapeHTML(s.formula) + '</pre>'
        : '<p class="about-panel__text">' + escapeHTML(s.text) + '</p>';
      return (
        '<section class="about-panel__section">' +
          '<p class="about-panel__heading">' + escapeHTML(s.heading) + '</p>' +
          inner +
        '</section>'
      );
    }).join('');
  }

  function openAboutPanel(metricId, opts) {
    var info = METRIC_INFO[metricId];
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

  // Returns the `<li>…</li>` markup for an "About this metric" entry
  // in a .chart-context-menu list. The onclick opens the panel for
  // the given metric id and stops propagation so the menu-close
  // handler doesn't intercept it before we open the panel.
  window.aboutMetricMenuItemHTML = function(metricId, context) {
    var ctxAttr = context === 'detail' ? 'detail' : 'widget';
    return (
      '<li data-about-metric-entry>' +
        '<button class="chart-context-menu__item" ' +
          'onmousedown="event.stopPropagation()" ' +
          'onclick="event.stopPropagation(); openAboutPanel(\'' + metricId + '\', { context: \'' + ctxAttr + '\' });">' +
          '<span class="material-symbols-rounded">info</span>' +
          '<span>About this metric</span>' +
        '</button>' +
      '</li>'
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
  // and inject the "About this metric" menu entry into every
  // `.chart-context-menu` whose containing card has that same
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

      // Inject "About this metric" into every overflow menu inside
      // this card.
      card.querySelectorAll('.chart-context-menu ul').forEach(function(ul) {
        if (ul.querySelector('[data-about-metric-entry]')) return;
        var li = document.createElement('li');
        li.setAttribute('data-about-metric-entry', '');
        li.innerHTML =
          '<button class="chart-context-menu__item" ' +
            'onmousedown="event.stopPropagation()">' +
            '<span class="material-symbols-rounded">info</span>' +
            '<span>About this metric</span>' +
          '</button>';
        li.querySelector('button').addEventListener('click', function(e) {
          e.stopPropagation();
          openAboutPanel(metricId, { context: context });
        });
        ul.appendChild(li);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateStaticPages);
  } else {
    decorateStaticPages();
  }
})();
