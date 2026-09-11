---
name: setnayan-reception-design-is-a-closed-vocabulary
description: "events.reception_design cannot carry a non-PartId key — sanitizeReceptionDesign silently drops it on the next save, so side-state briefed \"onto reception_design\" needs its own column"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8500c81f-ec37-4cc0-b15b-5514f467a54d
  modified: 2026-09-06T13:26:21.036Z
---

`sanitizeReceptionDesign` (`apps/web/lib/reception-scene.ts`) is the single trust
boundary every writer and every 3D/SVG reader passes through, and it keeps
**only** known part → attribute → valid-option-id triples. The type says the
same thing: `ReceptionDesign` is `Partial<Record<PartId, …>>`.

So any extra key parked inside `events.reception_design` — a dismissal list, a
flag, a timestamp — is **deleted by `saveReceptionDesign` itself** on the next
ordinary save. Nothing errors; the state simply reappears as if never set.

Measured 2026-09-06 on RV2 (PR #5273), whose brief asked for
`reception_design.dismissed_suggestions`. It shipped as its own column,
`events.dismissed_room_suggestions` (migration `20271211125659`).

⚠ The database trigger is NOT the constraint here.
`reassert_part_finalization_design` (migration `20271203855754`) only touches
`room:<zone>` keys and leaves anything else alone — the app-side sanitizer is
what eats the key.

**Why:** a separate column is also the stronger design, not just the necessary
one. "Dismissing a suggestion never changes the room" becomes structural — the
writer touches a different column and never calls the design writer — instead of
a promise resting on a diff nobody re-reads.

**How to apply:** when a Setnayan brief says to store something "on
`reception_design`", check it against the `PartId` union first. If it is not a
zone, give it a column and say so in the PR — and note that
`mood_board_updated_at` should NOT be stamped for state that is not a design
edit. Related: [[setnayan-guards-must-test-the-claim]].
