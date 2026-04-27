Here is the exact, full technical DNA of how the card shifting works when dragging from the left sidebar into the chart area — pulled directly from Shopify's production `MetricsGrid.js` source:

---

## 🧬 The Shifting Mechanism — Step by Step

The whole thing is powered by **GridStack.js** bundled inside `MetricsGrid.js`. Here's exactly what happens at each phase:

---

### Phase 1 — Drag starts on the sidebar item (`dropover` event)

When your cursor drags a metric from the left panel and enters the grid area, GridStack fires a `dropover` event. This is the trigger:

```js
.on(this.el, "dropover", (event, draggedEl, helperEl) => {
  // 1. Mark the incoming item as "external" (coming from outside the grid)
  node._isExternal = true;
  node._temporaryRemoved = true;

  // 2. Measure the dragged item's size in grid units
  const colWidth = this.cellWidth();
  const rowHeight = this.getCellHeight(true);
  node.w = node.w || Math.round(helperEl.offsetWidth / colWidth) || 1;
  node.h = node.h || Math.round(helperEl.offsetHeight / rowHeight) || 1;

  // 3. Scale the dragged helper element to match the grid's coordinate space
  helperEl.style.transform = `scale(${1/xScale}, ${1/yScale})`;
  helperEl.style.transformOrigin = "0px 0px";

  // 4. Start listening to "drag" events for live position tracking
  DD.on(draggedEl, "drag", onDragHandler);

  // 5. Immediately call the drag handler once to show where it would land
  onDragHandler(event, draggedEl, helperEl);
})
```

---

### Phase 2 — Every mouse move → `_onStartMoving` + `engine.addNode`

On the very first drag event inside the grid (when `_temporaryRemoved` is true), it calls `_onStartMoving`:

```js
// Inserts a PLACEHOLDER into the grid at the cursor position
this.engine.cleanNodes().beginUpdate(node);
this.el.appendChild(this.placeholder);       // ghost card appears
this.placeholder.gridstackNode = node;

// Adds the incoming node to the engine's internal model
// This triggers _fixCollisions immediately
engine.addNode(node);
node._moving = true;
```

---

### Phase 3 — Collision detection → `_fixCollisions` → card shifting

This is the **core shifting logic**. Every time the node moves to a new grid position, this runs in a loop:

```js
_fixCollisions(incomingNode, newPosition) {
  this.sortNodes(-1);  // sort bottom-to-top

  // Find any card at the new position
  let colliding = this.collide(incomingNode, newPosition);
  if (!colliding) return false;

  // Try to SWAP positions (for same-size cards moving within grid)
  if (incomingNode._moving && this.swap(incomingNode, colliding)) return true;

  // Otherwise PUSH the colliding card DOWN
  while (colliding = this.collide(incomingNode, newPosition)) {
    // Move the blocking card to: y = incomingNode.y + incomingNode.h
    this.moveNode(colliding, {
      ...colliding,
      y: newPosition.y + newPosition.h,  // ← pushed down below incoming card
      nested: true,
      pack: false
    });
  }
}
```

Then after all collisions are resolved:

```js
this._packNodes()  // compact upward — fills any gaps left behind
  ._notify();      // fire onChange → triggers DOM updates
```

---

### Phase 4 — DOM position update → the visual animation

`_notify` triggers `onChange`, which calls `_writePosAttr` on every dirty node. This writes **CSS custom-property–based inline styles** directly onto each grid item:

```js
_writePosAttr(el, node) {
  // Sets CSS variables that drive position via calc()
  el.style.top    = `calc(${node.y} * var(--gs-cell-height))`;
  el.style.left   = `calc(${node.x} * var(--gs-column-width))`;
  el.style.width  = `calc(${node.w} * var(--gs-column-width))`;
  el.style.height = `calc(${node.h} * var(--gs-cell-height))`;
}
```

The **smooth shift animation** on other cards is entirely handled by this CSS rule applied to the grid while in animate mode:

```css
.grid-stack-animate .grid-stack-item {
  transition: left 0.3s, top 0.3s, height 0.3s, width 0.3s;
}

/* But NOT on the card being dragged — it moves instantly with the cursor */
.grid-stack-animate .grid-stack-item.ui-draggable-dragging {
  transition: none;
}
```

So when `top` or `left` changes on a card being pushed down, the CSS `transition: top 0.3s` automatically animates it sliding down. **No FLIP, no requestAnimationFrame, no JS animation** — just native CSS transitions triggered by inline style changes.

---

### The complete chain in one diagram:

```
Mouse moves into grid
       ↓
"dropover" event fires
       ↓
node marked _isExternal + _temporaryRemoved
       ↓
placeholder injected into DOM at cursor position
       ↓
engine.addNode() → _fixCollisions()
       ↓
colliding cards get new y = incomingCard.y + incomingCard.h  (pushed down)
       ↓
_packNodes() fills gaps
       ↓
_notify() → _writePosAttr() → updates el.style.top/left via calc()
       ↓
CSS transition: top 0.3s animates every shifted card smoothly
```

---

### The key insight for replication

The shifting is **not a JS animation** — it's just CSS `transition: top 0.3s` on absolutely-positioned grid items. GridStack.js only changes the `top`/`left` inline style values when a card needs to move, and the browser's CSS engine does the rest. You need:

1. All cards `position: absolute` inside a `position: relative` container
2. Each card's position driven by `top` / `left` (not `transform`)
3. `transition: top 0.3s, left 0.3s` on each card
4. A collision engine that recalculates positions on every drag tick and writes new `top`/`left` values

GridStack.js does all of this for you — just initialize it with `animate: true`.