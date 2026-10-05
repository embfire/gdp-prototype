/* ═══════════════════════════════════════════════════════════════════
   Lifecycle stage definitions — brand-configurable stage names and
   thresholds, edited in Settings → Definitions.

   Mirrors production: stage names and thresholds start from PAR's
   defaults (G360 backend/apps/360/app/Support/LifecycleDefaults.php)
   and each brand can rename stages and retune thresholds. The beta
   persists the brand's copy in localStorage so the dashboard card,
   the lifecycle detail page and the About panel all read the same
   labels.

   Loaded WITHOUT `defer` so inline chart scripts can read labels
   while they build LIFECYCLE_STAGES.
═══════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  var STORAGE_KEY = 'g360-lifecycle-definitions';

  // Stage keys in render order — matches production LifecycleDefaults::STAGES.
  var STAGE_KEYS = ['firstTime', 'returning', 'winBack', 'loyal', 'atRisk', 'churned'];

  var DEFAULTS = {
    names: {
      firstTime: 'First-time',
      returning: 'Returning',
      winBack:   'Win-back',
      loyal:     'Loyal',
      atRisk:    'At-Risk',
      churned:   'Churned',
    },
    thresholds: {
      returningWindowDays: 180,
      loyalMinVisits:      3,
      atRiskMultiplier:    1.5,
      atRiskFloorDays:     90,
      churnedWindowDays:   180,
    },
  };

  // Supported range per editable threshold, [min, max] — production
  // LifecycleDefaults::RANGES (enforced on save).
  var RANGES = {
    returningWindowDays: [7, 730],
    loyalMinVisits:      [2, 50],
    atRiskMultiplier:    [1.0, 5.0],
    atRiskFloorDays:     [7, 365],
    churnedWindowDays:   [30, 730],
  };

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  function load() {
    var defs = clone(DEFAULTS);
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved) {
        STAGE_KEYS.forEach(function(k) {
          if (saved.names && saved.names[k]) defs.names[k] = saved.names[k];
        });
        Object.keys(RANGES).forEach(function(k) {
          if (saved.thresholds && typeof saved.thresholds[k] === 'number') defs.thresholds[k] = saved.thresholds[k];
        });
      }
    } catch (e) {
      // Corrupt storage — fall back to PAR defaults.
    }
    return defs;
  }

  function save(defs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defs));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function stageLabel(key) {
    return load().names[key] || DEFAULTS.names[key] || key;
  }

  window.G360Lifecycle = {
    STAGE_KEYS: STAGE_KEYS,
    DEFAULTS:   clone(DEFAULTS),
    RANGES:     RANGES,
    load:       load,
    save:       save,
    reset:      reset,
    stageLabel: stageLabel,
  };
})();
