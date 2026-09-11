---
name: setnayan-buttons-have-a-44px-floor
description: "globals.css gives every <button> min-height 44px; a small round button in a CSS module without `all: unset` or `min-height: 0` draws as a tall oval"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 305d8925-2b7c-44aa-8e2d-a5d286f6f205
  modified: 2026-09-11T05:07:12.741Z
---

`apps/web/app/globals.css` (base layer) sets `button, [role='button'], a.button, input[type='submit'] { min-height: 44px }`
("touch targets ≥ 44pt"). A ported prototype's 26px circular button in a CSS module that does not
reset it becomes a 26×44 oval — the Story Maker photo × shipped that way in step 4 (PR #5430) and
was fixed in step 6 with `min-height: 0` (the prototype's circle is counter-scaled to stay
finger-sized).

**Why:** a stretched hit area is a visible halo over neighbours — the exact thing 10a round 3
removed. **How to apply:** when porting a prototype's small buttons, either `all: unset` (as the
toolbar buttons do) or set `min-height: 0` and check the rendered box, not the CSS. Related:
[[setnayan-make-it-yours-step6-landed]].
