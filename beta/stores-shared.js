/* Shared mock data + helpers for the Stores and store groups pages
 * (settings-stores.html, settings-store-group.html). Store groups persist in
 * sessionStorage so edits survive navigating between the two pages. */
/* ───────── Mock data ───────── */
var STATE_NAMES = { AZ: 'Arizona', CA: 'California', CO: 'Colorado', CT: 'Connecticut', FL: 'Florida', GA: 'Georgia',
  IL: 'Illinois', MA: 'Massachusetts', MD: 'Maryland', NC: 'North Carolina', NH: 'New Hampshire', NJ: 'New Jersey',
  NY: 'New York', OH: 'Ohio', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', TX: 'Texas', VA: 'Virginia', WA: 'Washington' };

// [number, name, address, city, state, zip]
var STORES = [
  [1001,'Lowell - Middle St.','194 Middle St.','Lowell','MA','01852'],
  [1002,'Chelmsford - Main St.','88 Main St.','Chelmsford','MA','01824'],
  [1003,'Methuen - Broadway','410 Broadway','Methuen','MA','01844'],
  [1004,'Boston - Boylston St.','600 Boylston St.','Boston','MA','02116'],
  [1005,'Cambridge - Mass Ave.','1105 Massachusetts Ave.','Cambridge','MA','02138'],
  [1006,'Worcester - Park Ave.','721 Park Ave.','Worcester','MA','01603'],
  [1007,'Springfield - Boston Rd.','1300 Boston Rd.','Springfield','MA','01119'],
  [1008,'Nashua - Daniel Webster Hwy.','310 Daniel Webster Hwy.','Nashua','NH','03060'],
  [1009,'Manchester - Elm St.','945 Elm St.','Manchester','NH','03101'],
  [1010,'Portsmouth - Market St.','55 Market St.','Portsmouth','NH','03801'],
  [1011,'Providence - Atwells Ave.','220 Atwells Ave.','Providence','RI','02903'],
  [1012,'Hartford - Asylum St.','150 Asylum St.','Hartford','CT','06103'],
  [1013,'New Haven - Chapel St.','880 Chapel St.','New Haven','CT','06510'],
  [1014,'Stamford - Summer St.','300 Summer St.','Stamford','CT','06901'],
  [1015,'Albany - Central Ave.','1450 Central Ave.','Albany','NY','12205'],
  [1016,'Brooklyn - Atlantic Ave.','625 Atlantic Ave.','Brooklyn','NY','11217'],
  [1017,'Queens - Queens Blvd.','9001 Queens Blvd.','Queens','NY','11373'],
  [1018,'Buffalo - Elmwood Ave.','1020 Elmwood Ave.','Buffalo','NY','14222'],
  [1019,'Philadelphia - Market St.','1500 Market St.','Philadelphia','PA','19102'],
  [1020,'Pittsburgh - Forbes Ave.','3700 Forbes Ave.','Pittsburgh','PA','15213'],
  [1021,'Newark - Broad St.','790 Broad St.','Newark','NJ','07102'],
  [1022,'Baltimore - Eastern Ave.','2300 Eastern Ave.','Baltimore','MD','21224'],
  [1023,'Arlington - Wilson Blvd.','1850 Wilson Blvd.','Arlington','VA','22201'],
  [1024,'Raleigh - Glenwood Ave.','4100 Glenwood Ave.','Raleigh','NC','27612'],
  [1025,'Atlanta - Peachtree St.','1200 Peachtree St.','Atlanta','GA','30309'],
  [1026,'Miami - Brickell Ave.','900 Brickell Ave.','Miami','FL','33131'],
  [1027,'Orlando - E. Colonial Dr.','2400 E. Colonial Dr.','Orlando','FL','32803'],
  [1028,'Chicago - W. Randolph St.','330 W. Randolph St.','Chicago','IL','60606'],
  [1029,'Columbus - N. High St.','1560 N. High St.','Columbus','OH','43201'],
  [1030,'Austin - S. Lamar Blvd.','1800 S. Lamar Blvd.','Austin','TX','78704'],
  [1031,'Dallas - McKinney Ave.','2700 McKinney Ave.','Dallas','TX','75204'],
  [1032,'Denver - E. Colfax Ave.','1600 E. Colfax Ave.','Denver','CO','80218'],
  [1033,'Phoenix - E. Camelback Rd.','3300 E. Camelback Rd.','Phoenix','AZ','85018'],
  [1034,'Los Angeles - Sunset Blvd.','7200 Sunset Blvd.','Los Angeles','CA','90046'],
  [1035,'San Diego - El Cajon Blvd.','3500 El Cajon Blvd.','San Diego','CA','92104'],
  [1036,'San Francisco - Valencia St.','900 Valencia St.','San Francisco','CA','94110'],
  [1037,'Portland - E. Burnside St.','1100 E. Burnside St.','Portland','OR','97214'],
  [1038,'Seattle - E. Pike St.','1420 E. Pike St.','Seattle','WA','98122']
].map(function (r) { return { id: r[0], number: r[0], name: r[1], address: r[2], city: r[3], state: r[4], zip: r[5] }; });

var STORAGE_KEY = 'g360-beta-store-groups';
var nextGroupId = 5;
var GROUPS = [
  { id: 1, name: 'Northeast', stores: [1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018], created: new Date(2026, 2, 3, 9, 15), updated: new Date(2026, 7, 11, 10, 20) },
  { id: 2, name: 'West Coast', stores: [1034,1035,1036,1037,1038], created: new Date(2026, 3, 22, 14, 5), updated: new Date(2026, 5, 2, 16, 40) },
  { id: 3, name: 'Loyalty pilot', stores: [1001,1002,1008,1011], created: new Date(2026, 4, 14, 11, 30), updated: new Date(2026, 4, 14, 11, 30) },
  { id: 4, name: 'Test', stores: [1003,1020,1026], created: new Date(2026, 1, 9, 8, 0), updated: new Date(2026, 1, 9, 8, 0) }
];

// Groups are edited on both pages, so keep them for the session.
(function loadGroups() {
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    GROUPS = saved.groups.map(function (g) {
      return { id: g.id, name: g.name, stores: g.stores, created: new Date(g.created), updated: new Date(g.updated) };
    });
    nextGroupId = saved.nextId;
  } catch (e) { /* fall back to the defaults */ }
})();

function saveGroups() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ nextId: nextGroupId, groups: GROUPS }));
}

// One-shot message handed to the next page load (e.g. after deleting from the detail page).
function flashToast(text) { sessionStorage.setItem('g360-beta-store-flash', text); }
function takeFlashToast() {
  var t = sessionStorage.getItem('g360-beta-store-flash');
  sessionStorage.removeItem('g360-beta-store-flash');
  return t;
}

function groupsOfStore(storeId) {
  return GROUPS.filter(function (g) { return g.stores.indexOf(storeId) !== -1; }).map(function (g) { return g.name; });
}

/* ───────── Helpers ───────── */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function timeStr(d) {
  var h = d.getHours(), m = d.getMinutes();
  return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'AM' : 'PM');
}
// Same output as production formatUpdatedAt()
function formatUpdatedAt(d) {
  var now = new Date();
  var mins = Math.floor((now - d) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins + ' min ago';
  if (d.toDateString() === now.toDateString()) return 'Today at ' + timeStr(d);
  return MONTHS[d.getMonth()] + ' ' + d.getDate() + ' at ' + timeStr(d);
}

var toastTimer;
function showToast(text, isError) {
  var t = document.getElementById('st-toast');
  document.getElementById('st-toast-text').textContent = text;
  document.getElementById('st-toast-body').className = 'toast__body ' + (isError ? 'toast__body_error' : 'toast__body_success');
  document.getElementById('st-toast-icon').textContent = isError ? 'error' : 'check_circle';
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.style.display = 'none'; }, 3500);
}

/* ───────── Generic table (search, sort, selection, pagination, kebab menu) ───────── */
function makeTable(cfg) {
  var p = cfg.prefix;
  var T = {
    query: '', sort: cfg.sorts[0].value, page: 1, perPage: 10,
    selected: new Set(), pageIds: [], filters: cfg.filters || null
  };
  function $(s) { return document.getElementById(p + '-' + s); }

  T.rows = function () {
    var rows = cfg.data().filter(function (r) { return cfg.match(r, T.query, T.filters); });
    var s = cfg.sorts.filter(function (x) { return x.value === T.sort; })[0];
    rows.sort(s.cmp);
    return rows;
  };

  T.render = function () {
    var rows = T.rows();
    var total = rows.length;
    var pages = Math.max(1, Math.ceil(total / T.perPage));
    if (T.page > pages) T.page = pages;
    var slice = rows.slice((T.page - 1) * T.perPage, T.page * T.perPage);
    T.pageIds = slice.map(function (r) { return r.id; });

    $('count').textContent = total > 0 ? total + ' items' : '';
    $('sort-label').textContent = cfg.sorts.filter(function (x) { return x.value === T.sort; })[0].title;
    $('sort-options').firstElementChild.innerHTML = cfg.sorts.map(function (s) {
      return '<li><button onclick="' + cfg.name + '.setSort(\'' + s.value + '\')" style="background:none;border:none;width:100%;text-align:left;padding:8px;cursor:pointer;font-family:inherit;font-size:16px;font-weight:' + (s.value === T.sort ? 700 : 400) + ';">' + s.title + '</button></li>';
    }).join('');

    $('tbody').innerHTML = slice.map(function (r) {
      var on = T.selected.has(r.id);
      var href = cfg.rowHref ? cfg.rowHref(r) : '';
      return '<tr class="' + (on ? 'st-row--selected' : '') + (href ? ' st-row--link' : '') + '"' + (href ? ' onclick="location.href=\'' + href + '\'"' : '') + '>' +
        '<td class="st-check-cell" onclick="event.stopPropagation(); ' + cfg.name + '.toggleRow(' + r.id + ')"><span class="material-symbols-rounded guests-check-icon' + (on ? ' guests-check-icon--checked' : '') + '">' + (on ? 'check_box' : 'check_box_outline_blank') + '</span></td>' +
        cfg.cells(r) +
        '<td class="table__actions-column"><button class="guest-kebab-btn" onclick="' + cfg.name + '.openMenu(event,' + r.id + ')" aria-label="Row actions"><span class="material-symbols-rounded">more_vert</span></button></td></tr>';
    }).join('');
    $('empty').hidden = total !== 0;
    $('tbody').closest('table').style.display = total === 0 ? 'none' : '';

    T.renderPagination(total, pages);
    T.renderSelection();
  };

  T.renderSelection = function () {
    var n = T.pageIds.filter(function (id) { return T.selected.has(id); }).length;
    var icon = $('all');
    icon.textContent = n === 0 ? 'check_box_outline_blank' : (n === T.pageIds.length ? 'check_box' : 'indeterminate_check_box');
    icon.classList.toggle('guests-check-icon--checked', n > 0);
    $('bulk').hidden = T.selected.size === 0;
    $('bulk-count').textContent = T.selected.size;
  };

  T.renderPagination = function (total, pages) {
    var bar = $('pagination');
    // Production only shows pagination when there is more than one page.
    if (pages <= 1) { bar.style.display = 'none'; return; }
    bar.style.display = '';
    var per = [10, 25, 50, 100];
    bar.innerHTML =
      '<div class="pagination__items-per-page"><label>Items per page</label>' +
        '<div class="pagination-dropdown" style="position:relative;"><div class="dropdown__wrapper" style="min-width:80px;">' +
          '<button class="dropdown__button" onclick="' + cfg.name + '.toggleDd(\'per\')"><span>' + T.perPage + '</span><i class="ph ph-caret-down" style="font-size:14px;flex-shrink:0;"></i></button></div>' +
          '<div class="dropdown__options" id="' + p + '-per-options" style="bottom:calc(100% + 8px); top:auto !important;"><ul>' +
            per.map(function (n) { return '<li><button onclick="' + cfg.name + '.setPerPage(' + n + ')" style="background:none;border:none;width:100%;text-align:left;padding:8px 12px;cursor:pointer;font-family:\'Manrope\',sans-serif;font-size:16px;font-weight:' + (n === T.perPage ? 700 : 400) + ';">' + n + '</button></li>'; }).join('') +
          '</ul></div></div></div>' +
      '<div class="pagination__navigation"><div class="pagination-dropdown" style="position:relative;"><div class="dropdown__wrapper" style="min-width:80px;">' +
          '<button class="dropdown__button" onclick="' + cfg.name + '.toggleDd(\'page\')"><span>' + T.page + '</span><i class="ph ph-caret-down" style="font-size:14px;flex-shrink:0;"></i></button></div>' +
          '<div class="dropdown__options" id="' + p + '-page-options" style="bottom:calc(100% + 8px); top:auto !important;"><ul>' +
            Array.from({ length: pages }, function (_, i) { return i + 1; }).map(function (n) { return '<li><button onclick="' + cfg.name + '.goTo(' + n + ')" style="background:none;border:none;width:100%;text-align:left;padding:8px 12px;cursor:pointer;font-family:\'Manrope\',sans-serif;font-size:16px;font-weight:' + (n === T.page ? 700 : 400) + ';">' + n + '</button></li>'; }).join('') +
          '</ul></div></div>' +
        '<label>of ' + pages + ' page' + (pages !== 1 ? 's' : '') + '</label>' +
        '<div class="pagination__navigation__arrows">' +
          '<button class="pagination__nav-arrow" onclick="' + cfg.name + '.goTo(' + (T.page - 1) + ')"' + (T.page <= 1 ? ' disabled' : '') + '><i class="ph ph-caret-left"></i></button>' +
          '<button class="pagination__nav-arrow" onclick="' + cfg.name + '.goTo(' + (T.page + 1) + ')"' + (T.page >= pages ? ' disabled' : '') + '><i class="ph ph-caret-right"></i></button>' +
        '</div></div>';
  };

  T.toggleDd = function (which) {
    var el = $(which + '-options');
    var open = el.classList.contains('dropdown__options_open');
    closeDropdowns();
    if (!open) el.classList.add('dropdown__options_open');
  };
  T.toggleSort = function () { T.toggleDd('sort'); };
  T.setSort = function (v) { T.sort = v; T.page = 1; T.render(); };
  T.setQuery = function (q) { T.query = q; T.page = 1; T.render(); };
  T.setPerPage = function (n) { T.perPage = n; T.page = 1; T.render(); };
  T.goTo = function (n) { T.page = n; T.render(); };
  T.toggleRow = function (id) { if (T.selected.has(id)) T.selected.delete(id); else T.selected.add(id); T.render(); };
  T.toggleAll = function () {
    var all = T.pageIds.every(function (id) { return T.selected.has(id); });
    T.pageIds.forEach(function (id) { if (all) T.selected.delete(id); else T.selected.add(id); });
    T.render();
  };
  T.clearSelection = function () { T.selected.clear(); T.render(); };
  T.selectedIds = function () { return Array.from(T.selected); };
  T.openMenu = function (e, id) {
    e.stopPropagation();
    var menu = document.getElementById('row-menu');
    var btn = e.currentTarget;
    var same = menu.dataset.owner === p + id && menu.classList.contains('guest-row-menu--open');
    closeDropdowns();
    if (same) return;
    menu.innerHTML = cfg.menu(id);
    menu.dataset.owner = p + id;
    menu.classList.add('guest-row-menu--open');
    var r = btn.getBoundingClientRect();
    menu.style.left = Math.max(8, r.right - 220) + 'px';
    menu.style.top = (r.bottom + 4) + 'px';
  };
  return T;
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown__options_open').forEach(function (e) { e.classList.remove('dropdown__options_open'); });
  var m = document.getElementById('row-menu');
  m.classList.remove('guest-row-menu--open');
  m.dataset.owner = '';
}

function byStr(f, dir) { return function (a, b) { return dir * String(f(a)).localeCompare(String(f(b)), 'en', { numeric: true }); }; }

