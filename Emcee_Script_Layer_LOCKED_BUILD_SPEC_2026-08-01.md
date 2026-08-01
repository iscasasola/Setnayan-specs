# Emcee Script Layer — LOCKED BUILD SPEC (2026-08-01)

> **Status: 🔒 OWNER-LOCKED 2026-08-01** ("lock it"). Build to this. The model below is decided —
> do not redesign it, do not re-derive it, do not ask about it again.
>
> **Design artifact:** [`Emcee_Script_Prototype_2026-08-01.html`](Emcee_Script_Prototype_2026-08-01.html) (v2, carries the same lock banner).
> **Reasoning:** `DECISION_LOG.md` 2026-08-01 + the 2026-07-31 row (the layer itself).
> **Already shipped, do NOT rebuild:** the layer model + its 14-test suite (PR #3977) and the
> day-of Stage-Script desk.

---

## 0 · Why v1 was rejected — read this before you touch the design

Owner: *"the emcee should have the easiest and most efficient way to create their script… if there
is a better approach, then we must lead to that way."*

**v1 was a well-organised form**: ~18 blank boxes and a "6 to go" counter, on every wedding, from
scratch. An emcee does **~40 weddings a year and says nearly the same things with the names
swapped**. Making him retype it is the defect. The lock is the fix.

---

## 1 · THE MODEL — the third instance of a house split the owner already locked

Owner, **2026-07-27**: *"stays per wedding. **but his questionaire can be saved as his template. to
use for succeeding customers.**"* That split already ships twice:

| his craft — TRAVELS with him | the event's copy — DIES with it |
|---|---|
| `vendor_songs` | `event_song_picks` |
| `vendor_activities` | `event_activity_picks` |
| **`vendor_lines`** ← the only new table | **`vendor_block_scripts`** ✅ shipped #3977, **unchanged** |

**The absolute rule, stated in `20271015817050_emcee_activity_catalogue.sql`'s own header:
nothing personal to a couple may ever ride along to the next wedding.** Enforce it in the
converter, never in the emcee's diligence.

**The hero experience is the SECOND wedding.** He opens a new event and it is *already written* —
his own words, this couple's names already filled. He edits only what is genuinely special. The
blank-box flow survives only as the first-ever wedding, a state he sees once.

---

## 2 · THE KEYING LADDER (the hard part — solved, do not re-litigate)

`BLOCK_CUE` has **9 coarse block types**; real moments are specific ("Money Dance", "Grand
Entrance"). Keying on `block_type` alone would put one line on every `program` block. The locked
answer is a **three-rung ladder, surfaced honestly as a provenance chip on every pre-filled card**:

| # | Rung | Key | UI |
|---|---|---|---|
| 1 | **Exact** | his own named segment — `activity_id` via the shipped `event_activity_picks.scheduled_block_id` bridge | "Yours · your segment" |
| 2 | **By name** | normalized `label_key` remembered on the library row | filled but flagged **"Matched by name — glance it"**, warning rail + Keep/Detach |
| 3 | **Day-part** | `block_type` — **singleton framing moments ONLY** (cocktails, dinner, send-off) | quiet chip |
| — | **No match** | — | **no fill**, said plainly: *"Nothing in your lines fits '…' yet"* + the compounding promise |

🔑 **A repeated `block_type` NEVER auto-fills.** That designs out the "same line on every program
block" failure rather than papering over it.

The library screen offers one-tap promotion of a named moment into a real segment — upgrading
future matches from rung 2 to rung 1.

---

## 3 · LOCKED BEHAVIOURS

1. **Save is AUTOMATIC, not a button.** An explicit "save to my lines" is curation homework skipped
   40×/year and the library never compounds. Newest-wins, one line per key — the
   `vendor_reply_templates` *cache, not log* overwrite semantics. A visible **save receipt** shows
   the conversion (*"Carla at Miggo" → ⟨the couple⟩*) with **Undo**, so one-offs stay out.
2. **Two slot classes**, reusing the shipped `lib/vendor-autoreply/phrasings.ts` mechanic (the
   template carries no names; fill at render, so a corrected name propagates everywhere):
   - **auto-slots** — ⟨the couple⟩, ⟨the date⟩: event fields he may already read.
   - **ask-slots** — ⟨how they're announced⟩: he fills once per wedding. An unfilled ask-slot
     prints in the compiled text as a marked **`⟨…⟩ — FILL BEFORE THE DAY`** gap, so paper catches
     it too.
   - Pills are **loud in the edit box, invisible in every read view.**
3. **Triage replaces the completion counter.** "Get these right — N." Surface only: a couple ask on
   an unwritten moment · an unfilled ask-slot · **an ask sitting ON TOP of a library-filled line**
   (the subtle case v1's binary missed entirely) · an unmatched moment. Blanks he would ad-lib stay
   **silent**. The compile footer stops counting too.
4. **🔴 The private-block treatment is UNCHANGED and non-negotiable** — ink-black **DON'T READ
   ALOUD** bar, hazard-striped edge (shape, not hue — survives dim light and colour-blindness),
   "not for the mic" relabel in the UI grotesque, **never hidden**. He is holding a live microphone.
   **NEW RULE: private notes NEVER pre-fill** — "watch for Grace by the sound booth" is *last*
   wedding's coordinator.
5. **Vendor-private throughout.** No share-with-couple affordance. No guest names on any surface.
6. **Serif = say this.** Only his read-aloud line gets the reading serif; ≥16.5px on the day-of desk.

---

## 4 · BUILD LIST

| # | Item | Notes |
|---|---|---|
| 1 | **`vendor_lines` table** | Keyed to `vendor_profile_id`; **no `event_id` by schema** (that is what makes it travel). Sibling RLS of `vendor_songs` — `current_vendor_ids()` to author. ⚠ `REVOKE ALL … FROM anon, authenticated` + RLS at `CREATE TABLE` time. ⚠ Allocate the prefix ABOVE the applied head; regenerate the exposure baseline in the SAME PR. |
| 2 | **Materialize-on-open** | Pre-fill is a **one-time materialization when the Script tab first opens** — the `precompute.ts` "once per edit, never per read" shape — so `buildScriptWorkbook`, `compileScriptText` and the day-of desk run **unmodified**. |
| 3 | **Generalize the workbook** | `written / blank / unanswered` → **`needsAttention[]`** (asks incl. those on library-filled lines · unfilled ask-slots · unmatched moments). The counter fields become internal. Extend `emcee-script-layer.test.ts`. |
| 4 | **Prep surface** | New **Script** tab inside the shipped `/vendor-dashboard/clients/[eventId]` Customer Card. Not a new route. |
| 5 | **My Lines surface** | His library — browse, edit, promote a named moment to a segment. |
| 6 | **Day-of delta** | His line added to the shipped `stage-script.tsx`. One block type. Nothing else on that desk moves. |

---

## 5 · CONSTRAINTS FROM SHIPPED CODE (verified — do not rediscover)

- **A booked vendor CANNOT read `guests`.** The shipped compiler deliberately omits the roster. So
  sponsor/title slots **cannot auto-resolve** — that is precisely why ask-slots exist. Auto-filling
  ninong names would need a new RLS lane = a deliberate exposure widening, **not** in this build.
- `event_activity_picks.scheduled_block_id` is **`ON DELETE SET NULL`** — if the couple deletes a
  bridged block and retypes it, rung 1 is lost and matching honestly degrades to rung 2.
- `vendor_activities.block_type` is **free TEXT, no FK** — an unknown type must fall through the
  ladder (the `phrasings.ts` unknown-language fallback), never throw.
- `vendor_block_scripts.body` caps at **2000 chars** — slot tokens count toward it.

---

## 6 · Open, and NOT blocking this build

- Whether the host may ever see a band's finished setlist (a separate Song Desk question).
- Nobody has opened any of this on a phone yet — **expected, the product is still being built**
  (owner, 2026-07-31). Not a gate.
