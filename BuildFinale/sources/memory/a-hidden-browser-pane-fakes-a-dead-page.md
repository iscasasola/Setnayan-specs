---
name: a-hidden-browser-pane-fakes-a-dead-page
description: "when the Browser pane is hidden, screenshots go stale and rAF/timers pause — verify with DOM reads, not pictures, or you will \"find\" bugs that are not there"
metadata: 
  node_type: memory
  type: reference
  originSessionId: fb08bb4a-6426-4423-8aa9-e53c227d63eb
  modified: 2026-09-08T22:08:52.896Z
---

When the Browser pane is **hidden** (the tool result says so, and `tabs_context` prints "The
Browser pane is currently hidden"), the page is not composited:

- **Screenshots return stale frames** — mine came back solid white and, later, showing content
  from a scroll position several hundred pixels away from where JS reported it. The DOM was
  correct the whole time.
- **`requestAnimationFrame` never fires, and timers are throttled hard.** A `javascript_tool`
  call whose promise waited on `setTimeout(1500)` timed out after 45s.

🔑 **This makes correct code look broken.** I spent a while chasing a "dead needle" that was only
a paused rAF — anything driven by `requestAnimationFrame` will appear frozen and any scroll-linked
readout will look stuck on its initial value.

**How to verify instead:** read the DOM. `javascript_tool` measuring `getBoundingClientRect`,
`document.body.scrollWidth` vs `innerWidth`, computed styles, `dispatchEvent(new KeyboardEvent…)`
and `document.activeElement` all work fine and prove far more than a picture does. `read_page`,
`find` and `get_page_text` also work.

⚖ **But one real bug hid inside the artefact and was worth having:** rAF pausing while hidden
means a coalescing guard of the shape `if (!frame) frame = requestAnimationFrame(read)` — where
`frame` is only cleared *inside* the callback — stays latched forever, so the handler is dead
even after the tab becomes visible again. Always pair that pattern with a `visibilitychange`
listener that cancels, resets the latch and re-reads.
