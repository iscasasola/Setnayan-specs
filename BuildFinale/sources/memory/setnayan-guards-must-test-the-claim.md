---
name: setnayan-guards-must-test-the-claim
description: A Setnayan guard that asserts a cheaper proxy than the property it claims will accuse correct code or miss a real sabotage — ten instances measured 2026-09-06/09; test the claim on data that distinguishes it from the proxy, never prove a no-op where nothing could have moved, and for SOURCE scans assert the derivation and the rendering, never the name
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a324cf7e-2380-4bfe-b745-b770f1223643
  modified: 2026-09-05T23:46:17.660Z
---

Measured 2026-09-06 across MB28 (PR #5233), the reception celebration zones
(PR #5242) and RV2's booked-supplier chips (PR #5273) — **five instances**, four
of which accused correct code and one of which let a real sabotage pass:

- **Substring vs equality, undetectable on today's data.** MB14b caught a
  substring subtype match with a SOURCE assertion over `page.tsx`'s predicate.
  MB28 moved that predicate into `lib/moodboard-board-picks.ts` so the guards
  could run it, and the source check went on scanning a call site that no
  longer contained it. Swapping `===` for `.includes()` left all 17 tests
  GREEN — **none of the nineteen live `asset_subtype` values is a substring of
  another**, so no fixture could tell the two predicates apart. Fixed by a
  fixture carrying the data the claim is about: a `<setting>_backdrop` decoy
  placed first in row order.
- **Bounding boxes vs shapes.** "The dance floor does not cover the guest
  tables" tested as an x-extent comparison. The aisle is a trapezoid that
  narrows toward the back, so the boxes overlap where the shapes never touch —
  red on correct code.
- **A rectangle read off a screenshot by eye.** The replacement did real
  point-in-polygon against guest-table bounds of `x 660–890` that I had
  eyeballed from a render. The tables do not reach that far — red again.
  Settled by pixels: 1,260 table pixels, 0 repainted.
- **A string prefix as an identity.** `moodboard-make-it-real.test.ts` excluded
  the People zone from the whole-look brief via `line.startsWith('Who')`. A new
  `program` zone labelled an attribute "Who plays" and the guard reported that
  People had leaked into the brief. Fixed both halves: relabelled, and the
  guard now finds People by part id.

- **A fixture where both rules give the same answer** (RV2, PR #5273). A guard
  claimed the suggested option is the vocabulary's editorial first match, not an
  alphabetical one — and used a caterer, which resolves to `buffet` under BOTH
  rules (`buffet` < `family_style` < `plated`). Inserting a `.sort()` into the
  picker left it **GREEN**. Fixed with a band that also DJs: `live_band` is the
  vocabulary's first, `dj` is the alphabet's, and the test now asserts both
  premises ("the vocabulary puts the band first" / "the alphabet disagrees")
  before asserting the answer.

- **A "nothing moved" test where nothing COULD move** (bench tail ordering,
  PR #5351, 2026-09-09). A guard claimed *"a sort with nothing to sort by leaves
  the ladder alone"* and proved it with rows that all had a null price. Deleting
  the check entirely left it **GREEN**: every card ties at `Infinity` and
  `Array.prototype.sort` is **stable**, so the comparator returns the input
  order either way. Rewritten against a ranking lens where only one of three
  cards has a measured distance — §15.2 refuses the lens, but the scorer would
  float that one card to the front if allowed to run, and it is placed LAST so
  the move cannot be missed. 🔑 **A test that an operation is a no-op is
  worthless unless the operation would visibly do something when unguarded** —
  a tie under a stable sort is exactly such a hiding place.

- **Three at once in the S8 publish ladder (PR #5364, 2026-09-09), all found by
  MEASURING rather than by reading, and each a distinct shape of source-scan
  proxy.** These are the ones to expect when a guard reads source rather than
  running code:
  - **The wiring instead of the value.** The guard asserted `deskClear` appeared
    as a key in the `publishBlockers({…})` call. Hardcoding `deskClear = true`
    in the action took `deskClear = deskIsClear(desk.items)` from 1 → 0 and the
    guard stayed **8/8 green** — the whole gate removed. Assert the DERIVATION
    (`x = f(source)`), then the name reaching the call, as two checks.
  - **The statement instead of its guard clause.** The guard matched
    `…return frozen`. `if (false) return frozen;` took `if (frozen) return
    frozen;` 1 → 0 and stayed **21/21 green**. Match the condition, not the
    keyword.
  - **The READER instead of the WRITER.** A privacy guard built a snapshot
    carrying a guest id, ran it through `readRoomSnapshot`, and asserted no
    guest id came out. Smuggling `doc.room.seats = doc.seats` into
    `roomSnapshotOf` left it **26/26 green** — the reader REBUILDS the room from
    validated fields and strips anything smuggled in, so it reports clean
    whatever the writer did, while guest ids went into the stored document.
    *A guard that tests the reader cannot see a defect in the writer* — and the
    writer is what decides what is STORED, which was the claim. Assert both ends
    whenever a round trip has a validating reader in it.
  - **An import instead of a rendering.** A checklist row needed
    `/PUBLISH_CONSENT_SENTENCE/`. Replacing the JSX with the words "I agree to
    publish." took the rendering 2 → 1 — **the survivor was the import line** —
    and the checklist still reported 0 missing. For a "is it on screen" claim,
    match `{NAME}` in JSX, never the bare identifier.

**Why:** each guard tested something cheaper and easier to compute than the
property it claimed. The failure is symmetric and both directions are costly —
a cheap proxy either misses the defect the guard exists for, or accuses working
code and gets "fixed" by loosening the real constraint, which is how the
original defect comes back.

**How to apply:** before writing a Setnayan guard, ask *what data would tell my
assertion apart from the claim it stands for* — and put that data in the
fixture. Prefer the expensive honest unit: pixels through the real
`recolorRGBA` over geometry, the real imported function over a predicate
rebuilt in the test, an id over a label prefix. Always pair a "nothing moved"
assertion with one proving the thing is drawn/present at all, or it passes
vacuously. When a guard distinguishes rule A from rule B, **assert in the test
that the fixture actually separates them** — a one-line premise assertion is
what turns "green" into evidence.

⚠ **AND ONE OF THE FIXES ACCUSED CORRECT CODE ON THE WAY IN** (same session):
`doesNotMatch(JSON.stringify(room), /guest-abc|seats/)` went red on a perfectly
private `StoryRoom`, because it legitimately carries `seatingSurface` and
`seatsAssigned`. A substring proxy for "the seating is not in here". The claim
was two exact things — no guest id, and no `seats` KEY — so assert those two,
not a word that appears in innocent field names.

A second, cheaper trap from the same session: a source-scanning guard that reads
RAW file text will accuse the file's own PROSE about the thing it bans — RV2's
`dismissRoomSuggestion` comment names `saveReceptionDesign` while explaining it
must not call it, and the editor's comment says "no 'we picked this for you'".
Both went red on correct code until routed through `lib/strip-comments.ts` (see
[[setnayan-repo-has-one-comment-stripper]]). See [[setnayan-local-ci-parity-traps]] for the companion trap that
`tsx --test` strips types, so only `tsc` catches a bad `as const`.

## The same disease in a PLAN: "not built" from a PR search (2026-09-11)

S2 wrote H3 (drag to rearrange the bench) into `WHATS_NEXT_Build_Plan_2026-09-10.md`
as unbuilt after searching **PR titles** ("drag", "rearrange") and **remote branches**.
It had shipped the day before as **#5367** — titled "a couple can **arrange** their own
shortlist", branch deleted on merge. The previous orchestrator then "confirmed no one
has S8" the same way, and three documents called it unstarted. A new orchestrator
caught it by reading the code.

**An absence claim is only as good as a code grep for the thing's STORE and UI** —
here `event_bench_arrangement` / "Your order" in `shortlist-categories.tsx`. PR
titles are prose, and GitHub search does not match "arrange" for "rearrange".
Before planning ANY session as "not started": grep `origin/main` for its table, its
action, and its user-visible string. (Same class as
[[setnayan-decisions-view-merges-three-sources]]'s field-name trap: a cheaper proxy
that agrees with you today.)

**A windowed scan can pass by proximity (2026-09-11).** `lib/host-means-host.test.ts`
checks, within 2,500 characters after each `event_members` read that selects
`member_type`, that the column is compared. The data export's membership read (which
reports member_type as DATA) passed only because the NEXT statement, a different
read, had `.eq('member_type','couple')`. Moving that neighbour exposed it. The fix was
a named exemption (exact file plus exact select, with a reason, and a stale check),
not re-arranging code until the window happened to contain the word again.
