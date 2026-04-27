# Dashboard Customize Feature — Implementation Reference

This document covers the complete implementation of the Customize mode on the Guest360 Dashboard. It is written for developers building the real Vue/React application and includes all behaviours, edge cases, libraries, CSS patterns, and lessons learned from the prototype.

---

## 1. Overview

The dashboard shows a fixed grid of metric chart cards. Clicking **Customize** puts the dashboard into a special editing mode where the user can:

- **Drag cards** within the grid to reorder them.
- **Drag metric tiles** from a left sidebar onto the grid to add new cards.
- **Remove cards** from the grid using a per-card remove button that only appears in customize mode.
- **Save** the layout (persisted to localStorage in the prototype; should be user settings API in production).
- **Cancel** to restore the exact layout that existed before they opened customize mode.

---

## 2. Grid Library — GridStack.js

**Library:** [GridStack.js](https://gridstackjs.com/) v10.3.1  
**CDN (prototype):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gridstack@10.3.1/dist/gridstack.min.css">
<script src="https://cdn.jsdelivr.net/npm/gridstack@10.3.1/dist/gridstack-all.js"></script>
```

GridStack handles **in-grid card reordering only**. Sidebar → grid drops are handled manually (see Section 6). GridStack's built-in `acceptWidgets` / external drop pipeline was not used because it does not reliably register the grid as a drop target in our shell layout.

### Grid initialisation

```javascript
dashGrid = GridStack.init({
  column: 12,           // 12-column grid; each card uses w:6 (50% width)
  cellHeight: 467,      // card content height (435px) + bottom margin (32px)
  marginTop: 16,        // produces 32px row gap between cards (top + bottom)
  marginBottom: 16,
  marginLeft: 8,        // produces 16px column gap between cards (left + right)
  marginRight: 8,
  animate: true,        // enables CSS transition animations on card moves
  disableResize: true,  // no resize handles
  draggable: {
    handle: '.chart-card',         // the whole card surface initiates drag
    cancel: 'button, .dropdown, .chart-card__dots-btn, .chart-remove-wrap',
    scroll: false,
  },
  disableOneColumnMode: true,
  float: false,         // cards compact upward; no floating gaps
}, '#dashboard-grid');
```

**Important notes:**

- `column: 12` with `w: 6` per card gives a reliable 2-column layout using GridStack's bundled `.gs-12` CSS rules. Do not use a custom column count — it requires injecting dynamic CSS that can fail silently.
- `disableResize: true` suppresses resize handles at the GridStack level. Additional CSS is also needed to hide any handle elements GridStack may still emit (see Section 9).
- Do **not** use `staticGrid: true`. It tears down the internal drop-target registration and `setStatic(false)` doesn't reliably rebuild it. Instead, use `dashGrid.disable()` / `dashGrid.enable()`.
- `float: false` is essential. Without it, cards do not compact after removal, leaving visual gaps.

### Grid disable / enable

```javascript
// Normal mode — interactions locked
dashGrid.disable();

// Customize mode — in-grid drag enabled
dashGrid.enable();
```

### Body class for drag state tracking

GridStack fires `dragstart` / `dragstop` events for **in-grid** reorders only:

```javascript
dashGrid.on('dragstart', function() {
  document.body.classList.add('is-dragging-card');
});
dashGrid.on('dragstop', function() {
  document.body.classList.remove('is-dragging-card');
});
```

`body.is-dragging-card` is used in CSS to suppress hover outlines on non-dragged cards (see Section 8).

---

## 3. Metric Definitions

All available metrics are defined in a flat array. This is the source of truth for both the sidebar list and the grid cards:

```javascript
var ALL_METRICS = [
  { id: 'total-guests',               title: 'Total guests' },
  { id: 'guest-lifecycle-breakdown',  title: 'Guest lifecycle breakdown' },
  { id: 'retention-cohort',           title: 'Retention cohort' },
  { id: 'reachability',               title: 'Reachability' },
  { id: 'visit-frequency',            title: 'Visit frequency' },
  { id: 'loyalty-spend-lift',         title: 'Loyalty spend lift' },
  { id: 'guest-repeat-rate',          title: 'Guest repeat rate' },
  { id: 'avg-days-between-visits',    title: 'Avg days between visits' },
  { id: 'loyalty-penetration',        title: 'Loyalty penetration' },
  { id: 'active-guests',              title: 'Active guests' },
  { id: 'avg-order-value',            title: 'Avg order value' },
  { id: 'return-visit-funnel',        title: 'Return visit funnel' },
  { id: 'avg-visits-per-guest',       title: 'Avg visits per guest' },
];
```

The default layout (used when no saved layout exists):

```javascript
var DEFAULT_LAYOUT = [
  { id: 'total-guests',              x: 0, y: 0 },
  { id: 'guest-lifecycle-breakdown', x: 6, y: 0 },
  { id: 'retention-cohort',          x: 0, y: 1 },
  { id: 'reachability',              x: 6, y: 1 },
];
```

`x` is a GridStack column index (0–11). Cards always use `x: 0` (left column) or `x: 6` (right column).  
`y` is the row index (0-based).

---

## 4. Layout Persistence

```javascript
var LS_KEY = 'g360-dashboard-layout-v2';
```

The layout key is versioned. If the data model changes (e.g. a new column system), bump the version suffix to flush stale saved layouts from all browsers.

**Save:**
```javascript
function saveCustomize() {
  var layout = getLayoutSnapshot();
  localStorage.setItem(LS_KEY, JSON.stringify(layout));
  exitCustomizeMode();
}
```

**Load:**
```javascript
function loadLayout() {
  var saved = localStorage.getItem(LS_KEY);
  var items = saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
  dashGrid.removeAll();
  items.forEach(function(item) {
    var metric = metricById(item.id);
    if (metric) addCardToGrid(metric.id, metric.title, item.x, item.y, false);
  });
}
```

**Snapshot format** (stored per card):
```javascript
{ id: 'total-guests', x: 0, y: 0 }
```

In production, replace localStorage with a user settings API call. The snapshot format is minimal and framework-agnostic.

---

## 5. Customize Mode — Enter / Exit

### Entering customize mode

```javascript
function enterCustomizeMode() {
  originalItems = getLayoutSnapshot(); // snapshot for cancel
  document.querySelector('.app-shell').classList.add('app-shell--customize');
  document.getElementById('dashboard-action-bar').style.display = 'flex';
  dashGrid.enable();
  updateSidebar();
}
```

- `originalItems` stores the pre-edit layout so Cancel can restore it exactly.
- Adding `app-shell--customize` to the root element drives all visual changes via CSS (see Section 8).
- The floating action bar (Save / Cancel) is shown.
- GridStack interactions are enabled.
- The sidebar is populated with metrics not currently on the dashboard.

### Saving

```javascript
function saveCustomize() {
  var layout = getLayoutSnapshot();
  localStorage.setItem(LS_KEY, JSON.stringify(layout));
  exitCustomizeMode();
}
```

### Cancelling

```javascript
function cancelCustomize() {
  if (originalItems) {
    dashGrid.removeAll();
    originalItems.forEach(function(item) {
      var metric = metricById(item.id);
      if (metric) addCardToGrid(metric.id, metric.title, item.x, item.y, false);
    });
  }
  exitCustomizeMode();
}
```

Cancelling restores the exact pre-edit state by clearing the grid and re-adding all items from the snapshot.

### Exiting customize mode (shared cleanup)

```javascript
function exitCustomizeMode() {
  dashGrid.disable();
  document.querySelector('.app-shell').classList.remove('app-shell--customize');
  document.getElementById('dashboard-action-bar').style.display = 'none';
  originalItems = null;
}
```

---

## 6. Customize Sidebar

The sidebar is a second `<aside>` element that is hidden in normal mode and shown in customize mode via CSS.

### HTML structure

```html
<aside class="sidebar-customize">
  <div class="sidebar-customize__inner">
    <div class="sidebar-customize__label">Metrics</div>
    <div class="sidebar-customize__list" id="sidebar-list"></div>
  </div>
</aside>
```

### Populating the sidebar

`updateSidebar()` is called on enter and after every card removal. It shows only metrics **not** currently on the dashboard:

```javascript
function updateSidebar() {
  var onDash = getOnDashboardIds(); // current gs-id values from grid
  var list = document.getElementById('sidebar-list');
  list.innerHTML = '';
  ALL_METRICS.forEach(function(metric) {
    if (onDash.indexOf(metric.id) !== -1) return; // skip if already on grid
    var item = document.createElement('div');
    item.className = 'sidebar-customize__item';
    item.setAttribute('data-metric-id', metric.id);
    item.setAttribute('data-metric-title', metric.title);
    item.innerHTML =
      '<span class="material-symbols-rounded sidebar-customize__drag-icon">drag_indicator</span>' +
      '<span class="sidebar-customize__item-label">' + metric.title + '</span>';
    list.appendChild(item);
  });
  list.querySelectorAll('.sidebar-customize__item').forEach(function(el) {
    el.addEventListener('mousedown', startSidebarDrag);
  });
}
```

Each sidebar item shows a `drag_indicator` icon (Material Symbols Rounded) and the metric label. The `mousedown` listener initiates the manual drag (see Section 7).

---

## 7. Sidebar → Grid Drag-Drop (Manual Implementation)

GridStack's built-in external drop (`acceptWidgets`) was bypassed completely. Instead, sidebar drops use a pure DOM mouse event implementation. **GridStack's own drag/drop still handles in-grid card reordering.**

### Why manual?

GridStack v10.3.1's `_setupAcceptWidget` drop-target registration silently fails in certain shell layouts. `acceptWidgets: true` plus `setStatic(false)` toggling did not fix this reliably. The manual approach is more predictable and gives full control over UX (ghost helper, placeholder, insert position).

### Constants

```javascript
var SIDEBAR_DRAG_THRESHOLD = 4; // pixels of movement before drag activates
var CELL_HEIGHT = 467;          // must match GridStack cellHeight option
```

### Drag state object

```javascript
var sidebarDragState = null;
// Shape when active:
// {
//   metricId, metricTitle,
//   sourceItem,     // the sidebar DOM element
//   startX, startY, // initial mouse coords
//   offsetX, offsetY, // cursor offset within the item
//   helper,         // cloned ghost element appended to body
//   moved,          // boolean — true once threshold is crossed
//   rect,           // sourceItem.getBoundingClientRect() at mousedown
// }
```

### mousedown — start drag

```javascript
function startSidebarDrag(e) {
  if (e.button !== 0) return;
  e.preventDefault(); // prevents text selection on click-hold
  var item = e.currentTarget;
  sidebarDragState = {
    metricId: item.getAttribute('data-metric-id'),
    metricTitle: item.getAttribute('data-metric-title'),
    sourceItem: item,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: e.clientX - item.getBoundingClientRect().left,
    offsetY: e.clientY - item.getBoundingClientRect().top,
    helper: null,
    moved: false,
    rect: item.getBoundingClientRect(),
  };
  document.addEventListener('mousemove', onSidebarDragMove);
  document.addEventListener('mouseup', onSidebarDragEnd);
}
```

### mousemove — move ghost, update placeholder

```javascript
function onSidebarDragMove(e) {
  if (!sidebarDragState) return;
  var s = sidebarDragState;
  e.preventDefault();

  // Check threshold before creating helper
  if (!s.moved) {
    var dx = e.clientX - s.startX;
    var dy = e.clientY - s.startY;
    if (Math.abs(dx) < SIDEBAR_DRAG_THRESHOLD && Math.abs(dy) < SIDEBAR_DRAG_THRESHOLD) return;
    s.moved = true;

    // Create ghost helper — a visual clone of the sidebar item
    var helper = s.sourceItem.cloneNode(true);
    helper.style.position = 'fixed';
    helper.style.zIndex = '10000';
    helper.style.width = s.rect.width + 'px';
    helper.style.pointerEvents = 'none';
    helper.style.opacity = '0.95';
    helper.style.boxShadow = '0px 5px 20px rgba(0,0,0,0.18)';
    document.body.appendChild(helper);
    s.helper = helper;

    document.body.classList.add('is-dragging-card');
    s.sourceItem.style.opacity = '0.4'; // dim the source item
  }

  // Track helper to cursor
  s.helper.style.left = (e.clientX - s.offsetX) + 'px';
  s.helper.style.top  = (e.clientY - s.offsetY) + 'px';

  // Show/hide drop placeholder
  var target = targetCoordsFromEvent(e);
  if (target) showDropPlaceholder(target);
  else hideDropPlaceholder();
}
```

### Coordinate math — map cursor to grid cell

```javascript
function targetCoordsFromEvent(e) {
  var gridEl = document.getElementById('dashboard-grid');
  if (!gridEl) return null;
  var r = gridEl.getBoundingClientRect();
  // Return null if cursor is outside the grid bounds
  if (e.clientX < r.left || e.clientX > r.right ||
      e.clientY < r.top  || e.clientY > r.bottom) return null;
  return {
    x: (e.clientX - r.left) < r.width / 2 ? 0 : 6,  // left column = 0, right = 6
    y: Math.max(0, Math.floor((e.clientY - r.top) / CELL_HEIGHT)),
    gridEl: gridEl,
  };
}
```

Cards always land in one of two columns (`x: 0` or `x: 6`). The row is calculated by dividing the cursor's Y offset inside the grid by `CELL_HEIGHT`.

### Drop placeholder — visual landing zone

A `#drop-placeholder` `<div>` is created inside the grid element and positioned absolutely to show a grey rectangle at the target cell:

```javascript
function showDropPlaceholder(target) {
  var ph = document.getElementById('drop-placeholder');
  if (!ph) {
    ph = document.createElement('div');
    ph.id = 'drop-placeholder';
    ph.className = 'drop-placeholder';
    target.gridEl.appendChild(ph);
  }
  var leftPct = (target.x / 12) * 100;     // 0% or 50%
  ph.style.left   = 'calc(' + leftPct + '% + 8px)';   // account for item marginLeft
  ph.style.top    = (target.y * CELL_HEIGHT + 16) + 'px'; // account for item marginTop
  ph.style.width  = 'calc(50% - 16px)';    // 50% minus left+right margin
  ph.style.height = (CELL_HEIGHT - 32) + 'px'; // minus top+bottom margin
}

function hideDropPlaceholder() {
  var ph = document.getElementById('drop-placeholder');
  if (ph) ph.remove();
}
```

The placeholder uses `transition: left 0.12s ease, top 0.12s ease` so it slides smoothly between columns as the cursor moves.

### mouseup — insert card

```javascript
function onSidebarDragEnd(e) {
  if (!sidebarDragState) return;
  var s = sidebarDragState;
  sidebarDragState = null;

  document.removeEventListener('mousemove', onSidebarDragMove);
  document.removeEventListener('mouseup', onSidebarDragEnd);

  if (s.helper) s.helper.remove();
  hideDropPlaceholder();
  document.body.classList.remove('is-dragging-card');
  if (s.sourceItem) s.sourceItem.style.opacity = '';

  if (!s.moved) return; // short click — no action

  var target = targetCoordsFromEvent(e);
  if (!target) return; // dropped outside grid

  var metric = metricById(s.metricId);
  if (!metric) return;

  // Insert-and-shift: move all items at y >= target.y down by 1 row,
  // then add the new card at the exact target position.
  dashGrid.batchUpdate();
  var nodes = dashGrid.engine.nodes.slice().sort(function(a, b) { return b.y - a.y; });
  nodes.forEach(function(n) {
    if (n.y >= target.y) {
      dashGrid.update(n.el, { y: n.y + 1 });
    }
  });
  addCardToGrid(metric.id, metric.title, target.x, target.y, true /* flash */);
  dashGrid.commit();

  // Remove the sidebar item (it's now on the grid)
  if (s.sourceItem && s.sourceItem.parentNode) {
    s.sourceItem.parentNode.removeChild(s.sourceItem);
  }
}
```

**Why insert-and-shift?** GridStack with `float: false` resolves placement collisions by moving the new item to the next available free slot — not the user's intended row. The workaround is to pre-shift all existing items at or below the target row downward by one before inserting, ensuring the new card occupies exactly the cell the user dropped onto.

Sort nodes in **descending Y order** before shifting so that items don't collide with each other during the batch update.

---

## 8. Adding and Removing Cards

### Adding a card to the grid

```javascript
function addCardToGrid(id, title, x, y, flash) {
  var widget = dashGrid.addWidget({
    id: id,
    x: x,
    y: y,
    w: 6,
    h: 1,
    noResize: true,
    content: createCardHTML(id, title),
  });
  if (flash) {
    var card = widget.querySelector('.chart-card');
    if (card) {
      card.classList.add('chart-card--added');
      setTimeout(function() { card.classList.remove('chart-card--added'); }, 1000);
    }
  }
}
```

The `flash` parameter triggers a blue inset border animation (`card-add-flash`) when a card is dropped from the sidebar, giving the user confirmation that the card was placed. The animation runs for 1 second and then fades.

### Removing a card

```javascript
function removeCard(id) {
  var el = document.querySelector('.grid-stack-item[gs-id="' + id + '"]');
  if (el) dashGrid.removeWidget(el);
  updateSidebar(); // adds the metric back to the sidebar list
}
```

The remove button appears per-card in customize mode (hidden in normal mode via CSS). It has a "Remove" tooltip that appears on hover.

---

## 9. CSS — Customize Mode Overrides

All visual changes for customize mode are driven by a single class on the root element:

```css
/* Nav sidebar slides out, customize sidebar slides in */
.app-shell--customize .sidebar            { display: none; }
.app-shell--customize .sidebar-customize  { display: flex; flex-direction: column; }

/* Title/filter/meta bars hidden */
.app-shell--customize .dashboard-title-bar__actions { display: none; }
.app-shell--customize .dashboard-filter-bar          { display: none; }
.app-shell--customize .dashboard-meta-bar            { display: none; }

/* Card controls */
.app-shell--customize .chart-card__dots-btn   { display: none; }
.app-shell--customize .chart-card__breakdown  { display: none; }
.app-shell--customize .chart-card__drag-icon  { display: inline-block; }
.app-shell--customize .chart-card             { cursor: grab; }

/* Card header — not a navigation target in customize mode */
.app-shell--customize .chart-card__header       { cursor: default; }
.app-shell--customize .chart-card__header:hover { background: transparent; }

/* Blue hover outline on cards */
.app-shell--customize .chart-card:hover {
  box-shadow: inset 0 0 0 2px #1d5eff;
}

/* Remove button */
.app-shell--customize .chart-remove-wrap { display: inline-flex; }
```

The drag icon (`drag_indicator`, Material Symbols Rounded) lives inside every card header but is `display: none` in normal mode. The CSS rule that hides it in normal mode must use two classes to override any specificity from bento.css:

```css
.chart-card .chart-card__drag-icon { display: none; }
```

---

## 10. CSS — Drag Interactions

### Card being dragged (internal reorder)

```css
.grid-stack-item.ui-draggable-dragging .chart-card,
.grid-stack-item.gs-dragging .chart-card {
  box-shadow:
    inset 0 0 0 2px #1d5eff,
    0px 0px 0px 1px rgba(0,0,0,0.05),
    0px 5px 20px 0px rgba(0,0,0,0.1) !important;
}
```

The dragged card gets a blue inset border (indicating it's selected/active) plus an elevation shadow.

### Suppress hover on non-dragged cards

```css
body.is-dragging-card .app-shell--customize .chart-card:hover {
  box-shadow: none;
}
```

Without this, hovering over other cards during a drag shows the blue hover outline on cards the user isn't interacting with.

### Prevent text selection on sidebar items

```css
.sidebar-customize__item,
.sidebar-customize__item * {
  user-select: none;
  -webkit-user-select: none;
}
```

`e.preventDefault()` on mousedown is also required. Without both, click-and-hold starts a browser text selection before the drag threshold is crossed.

### Drop placeholder

```css
.drop-placeholder {
  position: absolute;
  background: #f4f4f4;
  border-radius: 8px;
  pointer-events: none;
  z-index: 5;
  box-sizing: border-box;
  transition: left 0.12s ease, top 0.12s ease;
}
```

The `transition` makes the placeholder glide to its new column when the cursor crosses the vertical midpoint of the grid.

---

## 11. CSS — Card Add Flash Animation

When a card is dropped from the sidebar, a brief blue inset border flash confirms placement:

```css
@keyframes card-add-flash {
  0%   { box-shadow: inset 0 0 0 2px #1d5eff; }
  60%  { box-shadow: inset 0 0 0 2px #1d5eff; }
  100% { box-shadow: none; }
}

.chart-card--added {
  animation: card-add-flash 1s ease-out forwards;
}
```

The class is added on drop and removed after 1000ms via `setTimeout`.

---

## 12. CSS — GridStack Corrections

### Grid container negative margins

GridStack applies `margin` to each item. To keep the outer grid flush with the 48px page padding (rather than adding extra inset), compensate with negative margins on the grid container:

```css
.grid-stack {
  width: calc(100% + 16px); /* cancel left + right item margins (8+8) */
  margin-left: -8px;
  margin-right: -8px;
  margin-top: -16px;        /* cancel top margin on the first row */
}
```

### GridStack internal reorder placeholder

GridStack shows its own placeholder behind the dragged card:

```css
.grid-stack-placeholder > .placeholder-content {
  background: #f4f4f4 !important;
  border-radius: 8px !important;
  border: 1px dashed #dfe1e2 !important;
}
```

### Suppress resize handles

GridStack may still emit resize handle elements even with `disableResize: true`. Hide them all:

```css
.grid-stack-item .ui-resizable-handle,
.grid-stack-item .ui-resizable-se,
.grid-stack-item .ui-resizable-sw,
.grid-stack-item .ui-resizable-ne,
.grid-stack-item .ui-resizable-nw,
.grid-stack-item .ui-resizable-n,
.grid-stack-item .ui-resizable-e,
.grid-stack-item .ui-resizable-s,
.grid-stack-item .ui-resizable-w,
.grid-stack-item > .gs-resize-handle,
.grid-stack-item > .grid-stack-resize-handle {
  display: none !important;
}
```

### Overflow on grid items

GridStack sets `overflow: hidden` on `.grid-stack-item-content`. Dropdowns inside card headers need `overflow: visible` to not be clipped:

```css
.grid-stack-item-content {
  overflow: visible !important;
}
```

---

## 13. CSS — Remove Button & Tooltip

The remove button is hidden by default and shown only in customize mode:

```css
.chart-remove-wrap         { position: relative; display: none; }
.app-shell--customize .chart-remove-wrap { display: inline-flex; }
```

The "Remove" tooltip appears above the button on hover:

```css
.chart-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 4px);
  right: 0;
  background: #141414;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 10;
}

.chart-remove-wrap:hover .chart-tooltip {
  visibility: visible;
  opacity: 1;
}
```

The remove button and its parent must call `event.stopPropagation()` and `onmousedown="event.stopPropagation()"` so that clicking remove does not trigger the card's drag behaviour.

---

## 14. Card HTML Structure

Each card follows this structure (abbreviated):

```html
<div class="chart-card" data-metric-id="total-guests">
  <div class="chart-card__header" onclick="openChartDetail(id)" role="button" tabindex="0">
    <span class="material-symbols-rounded chart-card__drag-icon">drag_indicator</span>
    <div class="chart-card__header-text">
      <p class="chart-card__title">Total guests</p>
      <p class="chart-card__subtitle">Chart explanation</p>
    </div>
    <div class="chart-card__header-controls">
      <!-- optional breakdown dropdown (metric-specific) -->
      <button class="chart-card__dots-btn" onmousedown="event.stopPropagation()">…</button>
      <div class="chart-remove-wrap">
        <button onmousedown="event.stopPropagation()" onclick="event.stopPropagation(); removeCard(id)">
          <span class="material-symbols-rounded">do_not_disturb_on</span>
        </button>
        <div class="chart-tooltip">Remove</div>
      </div>
    </div>
  </div>
  <div class="chart-card__body">
    <div class="chart-card__metric">
      <p class="chart-card__metric-value">…</p>
      <p class="chart-card__metric-period">…</p>
    </div>
    <div class="chart-card__placeholder"><!-- chart renders here --></div>
  </div>
</div>
```

Key points:
- The drag handle is the **entire `.chart-card`** surface (not just the header), configured via GridStack's `handle` option.
- Buttons inside the card use both `onmousedown="event.stopPropagation()"` and `onclick="event.stopPropagation()"` to prevent the card drag from starting when a control is clicked.
- In normal mode, clicking the `.chart-card__header` navigates to the chart detail page. In customize mode, this is suppressed by checking for `app-shell--customize` in the click handler.
- The drag icon is always present in the DOM but hidden via CSS until customize mode is active.

---

## 15. Action Bar (Save / Cancel)

A fixed bottom bar is shown only in customize mode:

```html
<div class="features-action-bar" id="dashboard-action-bar" style="display: none;">
  <button class="button primary" onclick="saveCustomize()">
    <span>Save</span>
  </button>
  <button class="features-action-bar__cancel" onclick="cancelCustomize()">Cancel</button>
</div>
```

```css
.features-action-bar {
  position: fixed;
  bottom: 0;
  left: 256px; /* nav sidebar width */
  right: 0;
  height: 80px;
  background: #eeeefc;
  box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 0 48px;
  align-items: center;
  gap: 24px;
}
```

In customize mode the nav sidebar is hidden so the action bar effectively spans the full viewport width. In production, if the sidebar remains visible in customize mode, `left` should be adjusted accordingly.

---

## 16. Complete Behaviour Summary

| Action | Normal mode | Customize mode |
|---|---|---|
| Click card header | Navigate to chart detail | No action (cursor: default) |
| Hover card | No change | Blue inset border |
| Drag card | Not possible | Reorders within grid (GridStack) |
| Drag sidebar item | No sidebar visible | Ghost follows cursor; placeholder shows landing zone; drop inserts at correct row |
| Release outside grid | — | Ghost removed, nothing added |
| Remove button | Hidden | Visible, removes card and adds it back to sidebar |
| Nav sidebar | Visible | Hidden |
| Customize sidebar | Hidden | Visible, shows metrics not on grid |
| Filter bar | Visible | Hidden |
| Action bar | Hidden | Visible (fixed bottom) |
| Card drag icon | Hidden | Visible |
| Card dots button | Visible | Hidden |

---

## 17. Key Pitfalls & Implementation Notes

1. **GridStack column count must be 12.** Using a custom count (e.g. 2) requires dynamically injected CSS that can fail silently, causing all cards to overlap at the top-left. Always use `column: 12` with `w: 6` per card.

2. **Do not use GridStack's `acceptWidgets` for sidebar drops.** In GridStack v10.3.1, the internal `_setupAcceptWidget` registration is unreliable in flex-based shell layouts. Use a manual mousedown/mousemove/mouseup pipeline instead.

3. **Sort nodes descending before insert-and-shift.** When shifting existing items down to make room for a new card, always sort nodes by Y descending first. Shifting ascending can cause collisions within the batch where one shifted item lands on top of another.

4. **`float: false` is required.** Without it, gaps appear after card removal because cards don't compact upward.

5. **`e.preventDefault()` on sidebar item mousedown is required** to prevent the browser from starting a text selection on click-and-hold, which happens before the drag threshold is crossed. Pair with `user-select: none` on the item and all descendants.

6. **The grid container needs negative margin compensation.** GridStack's item margins create unintended inset that breaks the page's 48px edge padding. Use negative margins on the `.grid-stack` container to cancel them.

7. **`overflow: visible` on `.grid-stack-item-content`.** GridStack sets `overflow: hidden` by default, which clips dropdown menus in card headers.

8. **Buttons inside cards need both `onmousedown` and `onclick` stopPropagation.** GridStack's drag attaches to mousedown — stopping only `onclick` is not enough to prevent accidental drag starts when clicking interactive elements.

9. **The `is-dragging-card` body class must be set for both sidebar drags and in-grid drags.** For in-grid drags, set it in GridStack's `dragstart`/`dragstop` events. For sidebar drags, set it manually in `onSidebarDragMove` (on first real move past threshold) and remove in `onSidebarDragEnd`.

10. **Cancel must fully reconstruct the grid from the snapshot.** Simply calling `revert` or relying on GridStack state is insufficient after adds and removes. The safe approach is `removeAll()` followed by re-adding each item from the snapshot.

---

## 18. Known Limitation — No Live Shifting (and How to Fix It in Production)

### The limitation

In the prototype, when you drag a metric tile from the sidebar over the grid, the grid shows a static grey **drop placeholder** at the landing cell. Existing cards do **not** slide out of the way live as you hover — they only shift after you release the mouse, via the insert-and-shift logic in `onSidebarDragEnd` (Section 7).

For internal card-to-card reordering (drag a card already on the grid), GridStack does animate cards live thanks to `animate: true`. The issue is exclusively for **sidebar → grid** drops.

### Why this is the case

The prototype bypassed GridStack's native external-drop pipeline entirely (see Section 7, "Why manual?") because `acceptWidgets: true` did not reliably register the grid as a drop target in our flex shell layout — GridStack's `dropover` event never fired. Without `dropover`, none of GridStack's internal collision/shift logic runs for external items.

The manual implementation handles drop placement correctly but does not reproduce GridStack's live collision response.

### Reference implementation — how Shopify solves the same problem

Shopify's production `MetricsGrid.js` uses GridStack with the **native** external-drop pipeline, and it gives them live shifting plus smooth CSS animations effectively for free. The pipeline:

```
Mouse moves into grid
       ↓
"dropover" event fires on the grid
       ↓
Incoming node marked _isExternal + _temporaryRemoved
       ↓
Placeholder injected into DOM at cursor position
       ↓
engine.addNode() → _fixCollisions()
       ↓
Each colliding card gets new y = incomingNode.y + incomingNode.h  (pushed down)
       ↓
_packNodes() compacts upward, filling gaps
       ↓
_notify() → _writePosAttr() updates el.style.top / el.style.left via calc(...)
       ↓
CSS `transition: top 0.3s, left 0.3s` on each grid item animates the slide
```

The animation is **not** a JS animation. It is a CSS transition on `top` / `left` triggered automatically when GridStack rewrites inline styles. The CSS rule is:

```css
.grid-stack-animate .grid-stack-item {
  transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;
}

/* The card under the cursor itself moves instantly with the mouse */
.grid-stack-animate .grid-stack-item.ui-draggable-dragging {
  transition: none;
}
```

The grid container in the prototype already has class `grid-stack-animate` and `animate: true`, so this CSS path is wired up for in-grid reorders. All that is missing is getting GridStack's `dropover` event to fire for sidebar items.

### Path A (recommended) — get GridStack's native `dropover` firing

This is the higher-leverage fix. If `dropover` fires, the entire Shopify model drops in and you get live shifting and animations for free with no custom collision code.

To use it, the source items must be registered with GridStack and the grid must accept external widgets:

```javascript
// On the grid
GridStack.init({
  acceptWidgets: true,    // grid will accept external items
  // …other options unchanged
});

// On the sidebar items (call after each updateSidebar() rebuild)
GridStack.setupDragIn('.sidebar-customize__item', {
  appendTo: 'body',
  helper: 'clone',
});

// Each sidebar item must carry the size attributes GridStack reads:
//   gs-w="6" gs-h="1"
// Optionally an id via gs-id, which surfaces as newWidget.id on drop.
```

Then listen for `dropped` (or `added`) on the grid to learn what was placed:

```javascript
dashGrid.on('dropped', function(event, previousWidget, newWidget) {
  // newWidget.id is the metric id from the sidebar item's gs-id attribute
  // newWidget.x / newWidget.y is the resolved drop position
  // Replace the placeholder content with the real card HTML at this point.
});
```

In our prototype, this pipeline did **not** work — `dropover` never fired. A production developer should diagnose why. Likely culprits, in order of probability:

1. **HTML5 native DnD vs jQuery UI conflict.** GridStack 10.x uses HTML5 native drag-drop by default. If anything in the parent app installs a jQuery UI draggable on the same elements (or on a parent), GridStack's drop registration can fail silently. Audit the page for any `$.ui` usage on or above the grid.

2. **`GridStack.setupDragIn` not called (or called before items exist).** `setupDragIn` must be re-run every time the sidebar list is rebuilt — sidebar items created after the call are not registered as drag sources.

3. **Sidebar items missing `gs-w` / `gs-h` attributes.** Without these, GridStack cannot compute the incoming node size, and `dropover` may bail out early.

4. **`pointer-events` blocked on the grid element or an ancestor.** If a sticky header/overlay/spacer covers the grid with `pointer-events: auto` and a higher `z-index`, the drag target test against the grid fails. Check the grid's bounding rect against an `elementFromPoint` test mid-drag.

5. **`overflow: hidden` clipping the drop zone.** GridStack registers the drop target on the grid root. If a wrapper has `overflow: hidden` and the cursor is technically over a clipped region, hit-testing can miss. Try `overflow: visible` on the immediate parent.

6. **`acceptWidgets: false` (the default).** Worth re-confirming this is set; the prototype removed it deliberately when going manual.

7. **Source item event.preventDefault on `dragstart`.** If a parent component cancels native drag events, GridStack's HTML5 drag never starts. Check global `dragstart`/`dragenter` listeners.

A useful debug technique: add `dashGrid.on('dropover', console.log.bind(null, 'dropover'))` and `dashGrid.on('drag', console.log.bind(null, 'drag'))`, then drag a sidebar item slowly across the grid edge. If neither logs, the drop target is not registered. If `dropover` logs but `drag` does not, the helper is not reaching the grid coordinate space (likely a transform / scale issue — see Shopify's `transform: scale(...)` workaround).

If Path A succeeds, **delete the manual `startSidebarDrag` / `onSidebarDragMove` / `onSidebarDragEnd` pipeline entirely** along with the `#drop-placeholder` div and its CSS. GridStack's built-in placeholder takes over.

### Path B (fallback) — replicate live shifting on top of the manual pipeline

If `dropover` cannot be made to fire (e.g. due to constraints in the production framework), you can keep the manual pipeline and add live shifting yourself. The algorithm is straightforward — the hard part is **state revert**.

**Algorithm on every `onSidebarDragMove`:**

1. Compute target `(x, y)` from cursor (already implemented as `targetCoordsFromEvent`).
2. If target equals last target, do nothing (avoid thrashing).
3. **Restore baseline first.** Reset all cards to their pre-drag positions from a snapshot taken at `mousedown`.
4. Find any card whose `(x, y, w, h)` overlaps the incoming `(target.x, target.y, 6, 1)`.
5. For each colliding card, set its new `y` to `target.y + 1`.
6. Call `dashGrid.engine._packNodes()` (or replicate it) to compact upward.
7. Apply the new positions via `dashGrid.update(el, { y: newY })` inside a `batchUpdate()` / `commit()` block.

**State revert on drop / bail-out:**

- On `mousedown`, snapshot every grid card's position: `[{ id, x, y }, …]`.
- On every move, the live shift is derived from the **snapshot**, not from the current DOM. Always recompute from the baseline so moves don't compound.
- If the user drops outside the grid or releases without crossing the threshold, restore positions from the snapshot.
- If the user drops on a valid cell, the speculative positions are already correct — just call `addCardToGrid` at `(target.x, target.y)` and commit.

**Animations:**

The CSS contract from Shopify is already partly wired up. To finish it, ensure each grid item has `transition: top 0.3s, left 0.3s` (GridStack's `animate: true` adds this via the `grid-stack-animate` class on the container). When `dashGrid.update()` rewrites the inline `top` / `left`, the browser animates the change. No custom JS animation is needed.

Verify the dragging card itself has `transition: none` so it tracks the cursor without lag:

```css
.grid-stack-animate .grid-stack-item.ui-draggable-dragging {
  transition: none;
}
```

In our case the dragged source is a sidebar ghost (not a grid item), so this rule may not apply directly — but the principle holds for any element being position-tracked to the cursor.

**Why this is harder than it looks:**

- Live shifting means you are mutating *real* card positions as preview. Without `_temporaryRemoved`, those mutations are committed to the GridStack engine and you have to undo them. Always work from a fresh baseline snapshot, never from current state.
- `_packNodes` is an internal method. Calling it directly works in v10.3.1 but is not part of the public API. If you upgrade GridStack, re-verify.
- Throttle the move handler (e.g. via `requestAnimationFrame`) so you do not run the full collision pass on every mousemove tick — it can stutter on slower machines.

### Recommended order of attack for production

1. **First, instrument and diagnose.** Add the `dropover` / `drag` console listeners. Confirm whether the event fires at all in the production framework. Two minutes of logging beats hours of speculation.
2. **If `dropover` fires** — switch to Path A, delete the manual pipeline, and you are done. Animations and shifting come for free.
3. **If `dropover` does not fire** — work through the diagnostic checklist (HTML5/jQuery UI conflict, `setupDragIn` timing, attributes, pointer-events, overflow). Most of these are 5-minute fixes.
4. **Only if all of the above fail** — implement Path B. Budget a day for it; the algorithm is simple but the snapshot/revert state machine is fiddly.

The CSS animation contract is the same for both paths, so any work spent on `transition: top 0.3s, left 0.3s` is not wasted regardless of which path wins.
