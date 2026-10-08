/* Guest activity timeline for the guest profile pages.
 * renderGuestTimeline(containerId, orders, opts) renders order events newest-first,
 * `opts.pageSize` at a time, with a "Load more" footer until every order is shown.
 * Order: { at: 'YYYY-MM-DD HH:MM', n, type, via, store, items: [[qty, name, lineTotal]], fees }
 * `via` is the channel text ("In store" or "via Olo" style) and is bolded in the title. */
(function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function parse(at) {
    var p = at.split(/[- :]/).map(Number);
    return new Date(p[0], p[1] - 1, p[2], p[3], p[4]);
  }

  function formatDate(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ', ' +
      (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM');
  }

  function money(n) {
    return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function dayGap(newer, older) {
    var a = Date.UTC(newer.getFullYear(), newer.getMonth(), newer.getDate());
    var b = Date.UTC(older.getFullYear(), older.getMonth(), older.getDate());
    return Math.round((a - b) / 86400000);
  }

  function eventHtml(o, gap, hasMore) {
    var d = parse(o.at);
    var sum = o.items.reduce(function (t, i) { return t + i[2]; }, 0) + o.fees;
    var lines = o.items.map(function (i) {
      return '<p>' + i[0] + ' x ' + i[1] + ' ' + money(i[2]) + '</p>';
    }).join('');
    var below;
    if (gap != null) {
      below = '<div class="rail__below"><div class="rail__spacer"></div>' +
        '<div class="rail__line rail__line--flex"></div>' +
        '<div class="rail__label">' + gap + 'd</div>' +
        '<div class="rail__line rail__line--fixed"></div>' +
        '<div class="rail__spacer"></div></div>';
    } else if (hasMore) {
      // Last visible order with "Load more" below: line runs down to the footer.
      below = '<div class="rail__below"><div class="rail__spacer"></div>' +
        '<div class="rail__line rail__line--flex"></div></div>';
    } else {
      below = '';
    }
    return '<div class="timeline__event' + (gap == null && !hasMore ? ' timeline__event--last' : '') + '">' +
      '<span class="timeline__date">' + formatDate(d) + '</span>' +
      '<div class="timeline__rail"><div class="rail__icon"><span class="material-symbols-rounded">attach_money</span></div>' + below + '</div>' +
      '<div class="timeline__content">' +
      '<p class="timeline__title">Placed <strong>' + o.type + '</strong> order #' + o.n + ' ' + o.via + ' - ' + o.store + ' store</p>' +
      '<div class="timeline__order">' + lines +
      '<p>Tax, Tip &amp; Fees ' + money(o.fees) + '</p>' +
      '<p class="timeline__order-total">Total ' + money(sum) + '</p></div>' +
      '</div></div>';
  }

  var FOOTER =
    '<div class="timeline__footer"><span class="timeline__date" aria-hidden="true"></span>' +
    '<div class="timeline__rail timeline__rail--footer">' +
    '<div class="rail__spacer"></div><div class="rail__line rail__line--fixed"></div><div class="rail__spacer"></div>' +
    '<button type="button" class="link-button">Load more</button></div>' +
    '<span aria-hidden="true"></span></div>';

  window.renderGuestTimeline = function (containerId, orders, opts) {
    var el = document.getElementById(containerId);
    var pageSize = (opts && opts.pageSize) || 5;
    var shown = 0;

    function render() {
      shown = Math.min(shown + pageSize, orders.length);
      var html = '';
      for (var i = 0; i < shown; i++) {
        var last = i === shown - 1;
        html += eventHtml(orders[i], last ? null : dayGap(parse(orders[i].at), parse(orders[i + 1].at)), shown < orders.length);
      }
      el.innerHTML = html + (shown < orders.length ? FOOTER : '');
      var btn = el.querySelector('.link-button');
      if (btn) {
        btn.addEventListener('click', function () {
          render();
          var next = el.querySelector('.link-button');
          if (next) next.focus();
        });
      }
    }

    render();
  };
})();
