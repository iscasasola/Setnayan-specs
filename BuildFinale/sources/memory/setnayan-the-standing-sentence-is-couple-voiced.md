---
name: setnayan-the-standing-sentence-is-couple-voiced
description: "buildSupplierStanding (S6) was couple-voiced; since 2026-09-10 it takes viewer:'vendor' and turns the subject around INSIDE the one derivation — pass it on any supplier surface, never write a supplier copy; its one-derivation guard is an allowlist you extend, never weaken"
metadata:
  type: project
---

`lib/supplier-standing.ts` (`buildSupplierStanding` → `standingSentence`) reads
as neutral but is **not viewer-agnostic**. Measured 2026-09-09 while building
the conversation's Decisions view (PR #5372):

- its `STAGE_VOICE.quoted.answerIsOwedByCouple` emits **"waiting on you"**
  meaning *the couple* owes the answer;
- its reply clause emits **"Replied yesterday"** *about the supplier*;
- `"No reply · 12 days"` is a statement that **the supplier** has gone quiet.

Rendered unchanged on a supplier-facing page it is **backwards on the one rung
that asks anyone to act** — it tells a supplier they owe an answer they are in
fact waiting for.

✅ **RESOLVED 2026-09-10 (the PR after #5402):** `SupplierStandingFacts` gained
an optional `viewer?: 'couple' | 'vendor'` (default `couple`, so every existing
caller is byte-identical). With `viewer: 'vendor'` the SAME function says
"Quoted ₱187,500 · waiting on them" (quiet) and "They replied yesterday"
(said); the supplier line never carries a `need` segment, because a supplier's
decisions arrive as Decisions entries. The supplier's thread page now renders
it. **On any new supplier surface: pass `viewer: 'vendor'`. Never write a
supplier copy of the sentence** — that is the second derivation S6 forbids.
The supplier copy was proposed by a build session, not signed off — the owner
may still reword it (change it IN the module). Guard:
`lib/the-standing-turns-around-for-the-supplier.test.ts`.

Related: [[setnayan-decisions-view-merges-three-sources]].

## The guard is an allowlist, and the fix is to extend it

`lib/the-bench-says-where-you-stand.test.ts` → *"🔑 13 · the sentence is derived
in ONE module and nowhere else"* walks `lib/` + `app/` and asserts the exact set
of files calling `buildSupplierStanding(`. A NEW legitimate call site fails it.

Calling the one function from a third surface is what the owner's *"yes, it is
fine to show it twice"* permits — the guard is aimed at a second *derivation*.
Add the path to the array **with a comment saying why**; never relax the
assertion. Its second half also checks named files don't hand-type
`waiting on you` / `No reply ·` / `Replied yesterday` / `suppliers replied` —
add your new surface to THAT list too, which strengthens the guard rather than
diluting it.
