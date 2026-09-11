---
name: setnayan-sponsor-share-landed
description: "Papic sponsors-get-a-bigger-share is BUILT (PR #5418, 2026-09-11, verified in prod); Papic item 3 is fully done; sponsors are read off guests.role, not event_sponsors"
metadata: 
  node_type: memory
  type: project
  originSessionId: 07f9360d-521b-4e8a-9c58-0ad4f7746686
  modified: 2026-09-10T19:08:08.293Z
---

Papic item 3's last piece — sponsors default to a bigger share — merged as PR #5418 (merge 1c11d4055, migration 20271220526938) on 2026-09-11 and was verified in prod by the object.

- Un-named principal sponsor = 3 equal shares, cord/veil/coin/candle = 2, everyone else 1 — `papic_share_weight(role, extra_roles)` inside `papic_guest_spend_ceiling`. Weighted into the divisor (heads + Σ(weight−1)) so ceilings still sum to the pot.
- **Who is a sponsor = `guests.role` + `extra_roles`**, NOT `event_sponsors.linked_guest_id` — prod had 8 sponsor-role guests and 0 event_sponsors rows.
- START_HERE's "the sponsor default ships (AllotmentRole)" was half true: only a picker suggestion shipped. Corrected in the corpus.
- CLOSED 2026-09-11 by PR #5422 (migration 20271221350945, verified in prod): a typed "everyone else" number is now `LEAST(typed, share)` in the DB too, matching the sheet. Engineering call (no owner ruling on the typed number; justified by "capping everyone is the guarantee" + 7c) — reversible if the owner wants "exactly this".

**Why:** a fresh session reading older docs could rebuild this or trust the half-true line.
**How to apply:** don't start item 3 work; if touching the resolver, CREATE OR REPLACE from prod's live body — its migration assertion now refuses a body missing the named/release/late-release/floor/sponsor arms. Related: [[setnayan-guards-must-test-the-claim]], [[pglite-binds-a-js-array-as-its-first-element]].
