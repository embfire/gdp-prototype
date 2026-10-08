/* Shared hover interaction for the AG Charts time-series charts: snapped
 * tooltip, dashed hairline and hover dot. Port of production's
 * agChartHoverOverlay (G360 frontend/apps/360/src/utility/agChartHoverOverlay.ts).
 *
 * All three are driven from one snap decision against one measured plot rect,
 * so they cannot disagree:
 *
 * - The dot used to be AG Charts' own marker highlight. On a `time` axis the
 *   highlighted node is picked by 2D distance, so holding X still and moving
 *   the cursor in Y moved the dot days away from the tooltip's date. Markers
 *   are disabled in the chart options now and we place the dot ourselves.
 * - The hairline used to be an X-axis `crosshair`, redrawn by the chart a frame
 *   behind the tooltip. It is a plain DOM element now.
 * - The plot rect is read from AG Charts' `.ag-charts-series-area` element
 *   instead of being estimated from axis label widths (the old PLOT_LEFT
 *   constants were off by up to 12px per chart).
 *
 * Usage:
 *   ChartHover.attach(container, {
 *     data: ROWS,                         // same rows the chart renders, ascending by date
 *     series: function () { return [{ yKey: 'current', stroke: '#5A55E3' }]; },  // visible series
 *     yDomain: function () { return { min: 0, max: 10 }; },   // the chart's Y axis min/max, or null for no dot
 *     xDomain: function () { return { min: t0, max: t1 }; },  // optional: the X axis min/max (ms); defaults to first/last row
 *     renderTooltip: function (row) { return '<div>…</div>'; } // null hides everything
 *   });
 * Attaching again to the same container detaches the previous interaction.
 */
(function () {
  var HAIRLINE_STROKE = '#c6c6c6';
  var HAIRLINE_DASH_PX = 4;

  // Hover dot, per Figma: coloured core, white ring, then the same colour at
  // 20% — 10 / 14 / 16px across. The colour is the line the dot lands on.
  var DOT_CORE_PX = 10;
  var DOT_WHITE_RING_PX = 2;
  var DOT_OUTER_RING_PX = 1;
  var DOT_OUTER_RING_ALPHA = '20%';

  var Z_HAIRLINE = 9997;
  var Z_DOT = 9998;
  var Z_TOOLTIP = 9999;

  /** Plot (series) area in viewport coordinates, or null before first layout. */
  function readPlotRect(container) {
    var area = container.querySelector('.ag-charts-series-area');
    if (!area) return null;
    var r = area.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return null;
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  /** Index of the value in an ascending array closest to `target`. */
  function nearestIndex(values, target) {
    var low = 0, high = values.length - 1;
    while (low < high) {
      var mid = (low + high) >> 1;
      if (values[mid] < target) low = mid + 1; else high = mid;
    }
    var before = low - 1;
    if (before >= 0 && Math.abs(values[before] - target) <= Math.abs(values[low] - target)) return before;
    return low;
  }

  function domainOf(timestamps, xDomain) {
    var d = xDomain && xDomain();
    if (d && isFinite(d.min) && isFinite(d.max) && d.max > d.min) return d;
    return { min: timestamps[0], max: timestamps[timestamps.length - 1] };
  }

  /** Nearest datum index for a viewport X, or null outside the plot. Interpolates on timestamps, like the axis. */
  function snapIndex(cursorX, rect, timestamps, xDomain, edgeSlopPx) {
    var slop = edgeSlopPx || 0;
    if (!timestamps.length || rect.width <= 0) return null;
    if (cursorX < rect.left - slop || cursorX > rect.left + rect.width + slop) return null;
    if (timestamps.length === 1) return 0;
    var dom = domainOf(timestamps, xDomain);
    var span = dom.max - dom.min;
    if (span <= 0) return 0;
    return nearestIndex(timestamps, dom.min + ((cursorX - rect.left) / rect.width) * span);
  }

  /** X offset from the plot's left edge for a timestamp. */
  function projectTimestamp(ts, timestamps, rect, xDomain) {
    var dom = domainOf(timestamps, xDomain);
    if (!(dom.max > dom.min)) return rect.width / 2;
    return ((ts - dom.min) / (dom.max - dom.min)) * rect.width;
  }

  /** Y offset from the plot's top edge for a value, given the Y axis min/max. */
  function projectValue(value, domain, rect) {
    var span = domain.max - domain.min;
    if (span <= 0) return rect.height / 2;
    return (1 - (value - domain.min) / span) * rect.height;
  }

  /** Of the visible series with a value on this row, the one closest (in Y) to the cursor. */
  function pickNearestSeries(row, series, cursorOffsetY, domain, rect) {
    var best = null, bestDist = Infinity;
    series.forEach(function (spec) {
      var v = row[spec.yKey];
      if (typeof v !== 'number' || isNaN(v)) return;
      var dist = Math.abs(projectValue(v, domain, rect) - cursorOffsetY);
      if (dist < bestDist) { bestDist = dist; best = { spec: spec, value: v }; }
    });
    return best;
  }

  function positionTooltipNearCursor(el, e) {
    var tw = el.offsetWidth, th = el.offsetHeight;
    var x = e.clientX + 16;
    var y = e.clientY - Math.round(th / 2);
    if (x + tw > window.innerWidth - 8) x = e.clientX - tw - 16;
    if (y < 8) y = 8;
    if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function overlayEl(kind, z) {
    var el = document.createElement('div');
    el.dataset.chartOverlay = kind;
    if (kind !== 'tooltip') el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;pointer-events:none;display:none;z-index:' + z + ';';
    return el;
  }

  function withAlpha(color) {
    return 'color-mix(in srgb, ' + color + ' ' + DOT_OUTER_RING_ALPHA + ', transparent)';
  }

  function attach(container, options) {
    if (container.__chartHover) container.__chartHover.detach();

    var tooltipEl = overlayEl('tooltip', Z_TOOLTIP);
    tooltipEl.setAttribute('role', 'tooltip');
    var hairlineEl = overlayEl('hairline', Z_HAIRLINE);
    hairlineEl.style.width = '1px';
    hairlineEl.style.backgroundImage = 'repeating-linear-gradient(to bottom, ' + HAIRLINE_STROKE + ' 0 ' + HAIRLINE_DASH_PX + 'px, transparent ' + HAIRLINE_DASH_PX + 'px ' + (HAIRLINE_DASH_PX * 2) + 'px)';
    var dotEl = overlayEl('dot', Z_DOT);
    dotEl.style.width = DOT_CORE_PX + 'px';
    dotEl.style.height = DOT_CORE_PX + 'px';
    dotEl.style.borderRadius = '50%';
    dotEl.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(tooltipEl);
    document.body.appendChild(hairlineEl);
    document.body.appendChild(dotEl);

    var data = options.data;
    var timestamps = data.map(function (row) { return row.date.getTime(); });
    // Measured once per pointer entry, not per move, to avoid a forced reflow every frame.
    var plotRect = null;
    var renderedHtml = null;

    function hide() {
      tooltipEl.style.display = 'none';
      hairlineEl.style.display = 'none';
      dotEl.style.display = 'none';
    }

    function onEnter() { plotRect = readPlotRect(container); }

    function onMove(e) {
      if (!container.isConnected) { api.detach(); return; }
      if (!plotRect) plotRect = readPlotRect(container);
      if (!plotRect) { hide(); return; }

      var index = snapIndex(e.clientX, plotRect, timestamps, options.xDomain, options.edgeSlopPx);
      if (index === null) { hide(); return; }

      var row = data[index];
      var html = options.renderTooltip(row);
      if (html === null || html === undefined) { hide(); return; }

      if (html !== renderedHtml) { tooltipEl.innerHTML = html; renderedHtml = html; }
      tooltipEl.style.display = 'block';
      positionTooltipNearCursor(tooltipEl, e);

      var pointX = projectTimestamp(timestamps[index], timestamps, plotRect, options.xDomain);
      hairlineEl.style.display = 'block';
      hairlineEl.style.left = (plotRect.left + pointX) + 'px';
      hairlineEl.style.top = plotRect.top + 'px';
      hairlineEl.style.height = plotRect.height + 'px';

      var domain = options.yDomain ? options.yDomain() : null;
      var nearest = domain ? pickNearestSeries(row, options.series(), e.clientY - plotRect.top, domain, plotRect) : null;
      if (!domain || !nearest) { dotEl.style.display = 'none'; return; }
      dotEl.style.display = 'block';
      dotEl.style.left = (plotRect.left + pointX) + 'px';
      dotEl.style.top = (plotRect.top + projectValue(nearest.value, domain, plotRect)) + 'px';
      dotEl.style.background = nearest.spec.stroke;
      dotEl.style.boxShadow = '0 0 0 ' + DOT_WHITE_RING_PX + 'px #ffffff, 0 0 0 ' + (DOT_WHITE_RING_PX + DOT_OUTER_RING_PX) + 'px ' + withAlpha(nearest.spec.stroke);
    }

    function onLeave() { plotRect = null; hide(); }
    function onViewportChange() { plotRect = null; hide(); }

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onViewportChange, { capture: true, passive: true });
    window.addEventListener('resize', onViewportChange);

    var api = {
      tooltipEl: tooltipEl,
      hide: hide,
      detach: function () {
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mousemove', onMove);
        container.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('scroll', onViewportChange, true);
        window.removeEventListener('resize', onViewportChange);
        tooltipEl.remove(); hairlineEl.remove(); dotEl.remove();
        if (container.__chartHover === api) container.__chartHover = null;
      }
    };
    container.__chartHover = api;
    return api;
  }

  window.ChartHover = {
    attach: attach,
    readPlotRect: readPlotRect,
    snapIndex: snapIndex,
    projectValue: projectValue,
    pickNearestSeries: pickNearestSeries
  };
})();
