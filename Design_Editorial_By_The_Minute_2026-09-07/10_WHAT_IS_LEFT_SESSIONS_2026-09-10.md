# 10 · WHAT IS LEFT — the series of builds, in order (rev 3, 2026-09-10)

> ⛔ **STICKERS ARE OFF FOR NOW — owner 2026-09-10: _"remove the stickers for now for both phone and
> computer."_** Deferred, not retired. Removed from the prototype and from every step below. The
> Kwento decorator's own stickers are untouched. Do not build a sticker in the Story Maker until he
> says so.

> Supersedes the "LEFT" row of `09_SESSIONS_AND_PROMPTS_2026-09-09.md` and rev 1 of this file.
> **S1–S15 of the Story plan are ALL MERGED** (#5329–#5389; S15 = commit `5f7d8f04`). Papic item 3's
> core is built and live (corrected 2026-09-10) — and its sponsor share is now built too (PR #5418, 2026-09-11).
> ⚠ Verify any PR state with `gh pr view <n> --json state,mergedAt` before trusting it.
>
> **The design being built:** `prototypes/story_make_it_yours_2026-09-10.html` (three rounds of
> real-browser testing) · its test plan `10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md` · the
> `DECISION_LOG.md` 2026-09-10 🧩 row.

## The series

| Step | Build | What a person gets | Model | Effort | Starts when | May run beside |
|---|---|---|---|---|---|---|
| **0** | ✅ **Owner gate — PASSED 2026-09-10** (*"this is fine"*), with one change: the words toolbar | — | — | — | done | — |
| **1** | Papic · sponsors get a bigger share | A sponsor's guests start with more shots | Opus 5 | high | ✅ **done** (PR #5418) | 2 |
| **2** | Story · A4, one minute per page | The story prints as a booklet | Sonnet 5 | medium | ✅ **done** (PR #5416) | 1 |
| **3** | Story · where the arrangement is kept | "Make it yours" saves for every celebration | Opus 5 | high | ✅ **done** (PR #5419, merged + verified in prod 2026-09-11) | 1, 2 |
| **4** | Story · the editor, part 1 — photos | Tray, tap-to-add, ×, Automatic / I choose, Put all back, Undo, autosave | Opus 5 | high | ✅ **done** (PR #5430, merged + verified in prod 2026-09-11) | 5 |
| **5** | Story · guests see the arranged pages | The public story shows each moment as laid out | Opus 5 | medium | ✅ **done** (PR #5428, merged + verified in prod 2026-09-11) | 4, 6 |
| **6** | Story · the editor, part 2 — words and moments | Words + looks, the phone toolbar, naming, sets, reorder | Opus 5 | **medium** | after **4** | 5 |
| **7** | Story · the prints carry the arrangement | A3 and A4 print each moment as laid out | Sonnet 5 | medium | ✅ **done** (PR [#5448](https://github.com/iscasasola/setnayan-platform/pull/5448), merged + verified in prod 2026-09-11) | 6 |
| **8** | Story · the whole thing, driven end to end | Proof it works for a real host on a real phone | Opus 5 | high | after **6** and **7** | — |

⛔ **Never together:** 3 with 4/5/6/7 (all build on 3's data shape) · **4 with 6** (same editor files)
· 5 with 7 only if 7 waits for 5's render to merge (7 reuses it).
🔑 **Critical path:** 3 → 4 → 6 → 8. Everything else fits beside it. Steps 1, 2 and 3 can all start now.

## Step 0 — the owner's five design calls — ✅ PASSED 2026-09-10

Owner, on the prototype: *"this is fine. but the text toolbar needs to be cleaner and more familiar. it feels like multiple different ideas taken together and programmed one by one."* Read as approval of the five calls below; the toolbar was redesigned the same day (see step 6). Recorded in `DECISION_LOG.md` 2026-09-10.
1. A photo is in **one** moment only.
2. The page is a **fixed sheet scaled to fit** — what you arrange on a laptop is what a phone shows, smaller.
3. **No animated text effects** (they cannot print).
4. **No pop-ups** — every removal is instant, with Undo.
5. **On a phone**, words get the toolbar instead of handles on the object.

(Stickers: ruled OFF for now, 2026-09-10 — not a design call any more.)

Record the answer as a `DECISION_LOG.md` row before step 3 starts. Also still open, not blocking:
the 10 items in `NEEDS_THE_OWNER_2026-09-09.md`. Housekeeping: close PR #5012 (older open copy of
merged #5378); PR #5140 is owner item 3.

---

## SHARED HEADER — paste at the top of every prompt

Use the SHARED HEADER in `09_SESSIONS_AND_PROMPTS_2026-09-09.md` (RULE 0, build beside the repo
never in /tmp, commit before the first mutation, print TSC_EXIT beside ERROR_LINES, a guard must be
able to fail — print the sabotage's occurrence count before → after, verify a migration IN PROD BY
THE OBJECT, changelog fragment, auto-merge, prune the worktree, reply to the owner in plain
English). For steps 3–8 also paste:

> **Drive it in a real browser before calling it done.** Testing the prototype found 61 defects in
> round 1 and ~40 more in round 3 that reading the code could not see. Playwright is installed:
> `node_modules/.pnpm/playwright@1.60.0/node_modules/playwright`. Every item in
> `10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md` that touches your step must be re-driven against the app.
> Test paywalls and entitlements on a `testnayan` account, **never** the owner's (it is internal and
> every gate silently passes — see `TEST_SCRIPT_E2E_2026-07-27.md`).

---

## 1 · Papic — sponsors get a bigger share · **Opus 5 · high** · ✅ DONE, MERGED, VERIFIED LIVE 2026-09-11 (code PR #5418, merge `1c11d4055`)

**Verify with the object, not this line:** `gh pr view 5418 --json state,mergedAt`, and in prod
`pg_get_functiondef('public.papic_guest_spend_ceiling(uuid)'::regprocedure) LIKE '%(v_heads + v_extra)%'`
plus `SELECT public.papic_share_weight('principal_sponsor','{}')` → 3. Read 2026-09-11 after the
deploy: one overload · sponsor division + multiply present · named and release arms kept · weights
3/2/2/1 · anon cannot execute · 8 live sponsors recognised · 0 guests with a ceiling (no celebration
has the switch on, so nobody's number moved on merge). Migration `20271220526938`.

**What shipped, and two calls made here (see the 2026-09-11 DECISION_LOG row):**
- **Weighted, not multiplied on top** — a sponsor counts as 3 (or 2) heads in the division, so every
  ceiling still adds up to the pot.
- **Who is a sponsor = the guest list** (`guests.role` + `extra_roles`), not the sponsors page's link
  — prod had 8 sponsor-role guests and 0 sponsors-page rows, so the couple's sheet recognised none.
- A couple's typed "everyone else" number is one ordinary share; a sponsor gets her multiple of it.
- ⚠ **Found, not fixed (separate task):** the sheet caps a typed "everyone else" number at the fair
  share, but the database enforces the typed number raw. Pre-existing; flagged for its own session.


```
GOAL: on a celebration with sponsors, a sponsor's guests start with a bigger share of shots by
default — the owner's 2026-08-29 addition.
READ FIRST: WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md § 3 ("One addition made 2026-08-29:
sponsors default to a bigger share") and WHATS_NEXT_Shots_Per_Guest_2026-08-28.md.
ALREADY SHIPS — DO NOT REBUILD (read out of prod 2026-09-10): the per-guest ceiling is LIVE.
papic_record_guest_capture asks papic_guest_spend_ceiling() first (named · equal share · release);
a guest's own purchase is exempt. PRs #5014 #5017 #5019 #5024 #5028 #5034 #5052. Missing: nothing in
Papic knows about sponsors (lib/event-sponsors.ts is imported by nothing in Papic).
DELTA: a sponsor guest's default share is larger, derived at spend time inside
papic_guest_spend_ceiling (a named guest's own number still wins; release still applies). Show it
where the couple sets the numbers and on the guest's counter.
TRAPS: CREATE OR REPLACE is a time machine — start from prod's live body (pg_get_functiondef), never
an old migration, or you silently revert #5052 and #5034. Prove the ceiling BINDS on a real pool event.
DONE WHEN: a sponsor guest's ceiling beats a plain guest's on the same event, proven by a db test
that fails when the sponsor arm is removed; migration verified in prod by the object.
```

## 2 · Story — A4, one minute per page · **Sonnet 5 · medium** · ✅ DONE, MERGED, VERIFIED LIVE 2026-09-11 (code PR #5416, merge `44bd36e3d`)

**Verify with the object, not this line:** `gh pr view 5416 --json state,mergedAt` and load
`https://www.setnayan.com/<a real published slug>/print?format=a4`.

⚠ **Solemn-quiet print suppression shipped as a FLAGGED JUDGMENT CALL, not an owner ruling —
see the 2026-09-11 DECISION_LOG.md row for the interpretation (festive colour suppressed, content
never suppressed) and surface any objection there.**

🔎 **PROD VERIFICATION — CONFIRMED LIVE 2026-09-11.** `origin/main` merge commit
`44bd36e3d8bb6164d0246b489d9e62c26c970ad4` (PR #5416, itself preceded by a same-day follow-up
push `0a60c4ae5` that fixed a CI typecheck/lint failure — `pair[0]` under
`noUncheckedIndexedAccess` and a hand-rolled comment-stripper duplicating
`lib/strip-comments.ts` — both caught by CI before merge, not after). Deployment
`dpl_3YRAwP5hfXupawJqSbU6gWxMpc7k` (target `production`) was `BUILDING` immediately after merge
(an ordinary in-flight build in a fast-moving queue — four more PRs, #5417–#5420, landed on
`main` within the same few minutes) and reached `READY` shortly after: **`GET
https://setnayan-platform-web.vercel.app/api/health` now reports `"version":"44bd36e"`**, i.e.
prod is serving the exact merged object, verified by the object per this repo's own rule — not
by a migration comment or `schema_migrations`. ⚠ **What was NOT directly observed:** the only
known live slug at hand (`cale-ice`) 307-redirects `/cale-ice/print?format=a4` to `/cale-ice`
both before and after this deploy — its story is not in the published/QR-visible audience state,
which is the SAME pre-existing publish gate every print format has always had, not a defect from
this PR. No credentials for a published couple account were available this session, so the
actual rendered A4 booklet was not screenshotted end-to-end; the shipped tests
(`a4-pagination.test.ts`, `a4-inherits-the-withdrawal.test.ts`,
`the-keepsake-stays-quiet-at-a-wake.test.ts`) all ran and passed in CI's "Unit tests" step against
this exact commit before merge. A future session with a real published slug + host login should
still open `/print?format=a4` and eyeball it once.
GOAL: the story prints as an A4 booklet, one minute of the day per page — the last unbuilt part of S12.
ALREADY SHIPS — DO NOT REBUILD: the A3 keepsake with its QR back to the living page
(app/[slug]/print/*), the S14 edition stamp, the 9:16 card, the share sheet (#5380). The "A4" in
keepsake.css.ts is only a screen-preview width that scales to A3 in print.
DELTA: a second format on the same route and toolbar — A4, one minute per page, with the edition
stamp and the QR; S14's taken-back rules apply exactly as to A3; solemn events print quiet.
Leave a clear seam for step 7 (a moment's arranged sheet will later replace the minute layout for
moments the host arranged by hand).
DONE WHEN: print-to-PDF gives one page per minute with content, every page stamped, nothing taken
back appears, and a test fails if a minute is split across pages.
```

## 3 · Story — where the arrangement is kept · **Opus 5 · high** · ✅ DONE 2026-09-11 (PR #5419)

**Verify with the object, not this line:** `gh pr view 5419 --json state,mergedAt`, then in prod
`event_editorial.arrangement` / `arrangement_version` exist, `save_story_arrangement` is executable by
`service_role` only, and trigger `event_editorial_arrangement_has_one_door` is enabled. Verified
2026-09-11 in a rolled-back transaction on a testnayan event: first save `saved:1` · stale tab
`conflict:1` (nothing written) · same save again `unchanged:1` · reloaded tab `saved:2` · a host
PATCHing the column directly refused `story:arrangement_has_one_door`, while the same host still
reaches their own row.

**What steps 4 · 5 · 7 build on** (see the 2026-09-11 DECISION_LOG row for the two flagged calls):
- READ through `loadStoryArrangement(admin, eventId, viewer)` (`apps/web/lib/story-arrangement-store.ts`)
  — never read the column yourself; that function applies S3 and S14. The host's editor uses
  `app/dashboard/[eventId]/story/_lib/load-arrangement.ts`.
- SAVE with `saveArrangement(eventId, storedFromResolved(view), version)` — the editor saves what it
  SHOWS. On `conflict`, say `ARRANGEMENT_CONFLICT_MESSAGE` and reload. **Never save while
  `unreadable` is non-empty.** New ids from `newArrangementId`, never a counter.
- The sheet geometry (660 wide, photo 146×100, the 4-column grid, `freeSlot`, `sheetHeight`) is
  exported from `apps/web/lib/story-arrangement.ts` — steps 5 and 7 render from it, never a copy.
- The mode is ONE switch for the story; every resolved moment still carries `mode`.

```
GOAL: what a host arranges in "Make it yours" is saved for their celebration and read back.
THE DESIGN (binding — port, never redraw): prototypes/story_make_it_yours_2026-09-10.html and the
owner's step-0 ruling in DECISION_LOG.md (read it first — build what he signed off, not rev 1).
RULE 0, pre-answered: the Story Maker saves into event_editorial.draft_json through
app/dashboard/[eventId]/story/actions.ts (saveEditorial). The arrangement very likely belongs there
as one key — decide from the code; prefer that over a new table.
STORE per moment: mode (automatic | by hand), the host's order and names, host-added moments; for
by-hand pages every object — photo/snippet ref, words (text, colour, backing, size, turn) — with x, y in SHEET UNITS (660-wide sheet); named photo sets. AUTOMATIC IS
DERIVED, NOT STORED: compute it from the run of show and Papic's capture minutes on every read, and
restore any run-of-show moment the host removed by hand when they return to Automatic.
SAVE MODEL: the prototype autosaves every change and Undo restores a snapshot — design the action
so a save is cheap and idempotent (whole-arrangement write with a version check, so two tabs cannot
silently overwrite each other; say what happens when they do).
TRAPS: a photo ref must be one the viewer may see (S3 guests-only; S14 taken back) — enforce on
READ. Reject a save that puts one photo in two moments. The /[slug] read is service-role — S5 of
this series depends on your read helper applying both rules.
DONE WHEN: save → reload returns the arrangement exactly; a taken-back photo drops out of every
saved page; tests fail when the one-photo-one-moment check or the visibility filter is removed.
```

## 4 · Story — the editor, part 1: photos · **Opus 5 · high** · ✅ DONE 2026-09-11 (PR #5430)

**Verify with the object, not this line:** `gh pr view 5430 --json state,mergedAt` (merged
2026-09-10T23:05:36Z, `13b8ae7`); `https://setnayan-platform-web.vercel.app/api/health` reported
`"version":"13b8ae7"` after the deploy. No migration — it saves through step 3's
`save_story_arrangement` (still service-role only; `authenticated` cannot execute it).

**What step 6 builds on** (see the 2026-09-11 DECISION_LOG row):
- The editor is `app/dashboard/[eventId]/story/_components/make-it-yours.tsx` (+ `.module.css`, the
  prototype's CSS ported, corners on `--m-r-*`). Every move is a pure function in
  `apps/web/lib/make-it-yours.ts` that ends in the server's own `resolveArrangement` — add words'
  moves there, never a second rule set in the component.
- It is fed by `_lib/load-make-it-yours.ts` (`makeItYoursInputFrom`) from step 3's one read;
  `LoadedArrangement.runOfShow` now comes back with it.
- **Extend the real-browser drive, don't start a new one:** `step4_make_it_yours_drive/` (README
  says how). On the shipped code it passed 124 checks at 1280 mouse and 112 at 390 touch on a
  production build — zero dialogs, zero console errors, zero CSP reports.
- ⚠ It drives the real component + step 3's real read/save over an in-memory stand-in for the
  database: this machine cannot hold the production service role (sensitive in Vercel), has no
  Docker, and signing in to the live site would mean typing a password. Step 8 drives the live
  path. Ten stand-in captures are seeded on testnayan1's "Song Desk Test Night" for it.
- `make-it-yours-keeps-what-the-browser-found.test.ts` pins the ten lines the browser proved matter.


```
GOAL: step "The story" of the six-step Story Maker (#5389) becomes "Make it yours" — the photo half.
PORT from prototypes/story_make_it_yours_2026-09-10.html (never redraw): the moments rail beside
the page; the desk and the fixed 660 sheet scaled to fit; the tray of UNPLACED Papic photos AND
snippets; a tap is the add (first free slot, never over words); the × on every photo,
always showing, counter-scaled, no invisible halo; drag with a 4px/10px threshold, bring to front,
the sheet grows downward; Automatic vs I choose (Automatic read-only, every refusal says why, on a
TAP not a swipe); Put all back; Undo for every removal (the undo belongs to the ACTION — a later
change retires it, a message never does); autosave through step 3's action; keyboard (Tab, Enter,
arrows move, Delete, Cmd/Ctrl+Z); aria-disabled never disabled; no prompt/confirm anywhere.
NOT IN THIS STEP: words, looks, the phone toolbar, naming, sets, moment reorder — step 6. NO STICKERS AT ALL (owner, for now).
THE TEST PLAN: every photo-related item in 10a (rounds 1 and 3) — double presses, held keys, a page
wider than a phone, a × covered by a neighbour, resize never moving anything, a press still landing
after something above it changes size.
DONE WHEN: a Playwright script at 1280 and at 390 touch adds, drags, removes, undoes and reloads
with zero dialogs, zero console errors, (photos on pages + tray) always equal to the photo count,
and no horizontal scroll.
```

## 5 · Story — guests see the arranged pages · **Opus 5 · medium** · ✅ DONE 2026-09-11 (PR #5428)

**Verify with the object, not this line:** `gh pr view 5428 --json state,mergedAt`, then
`curl -s https://setnayan-platform-web.vercel.app/api/health` → `version` at or after `d295b3e`.
Read 2026-09-11 after the deploy: prod served `d295b3e` (the merge commit); CI's full check green
(unit + DB replay); `/movie-night`, `/cale-ice`, `/ana-miguel` and the Maria & Juan sample all 200,
the sample still drawing its 5 minutes. ⚠ No story in prod has a hand arrangement yet (the only
event with captures is the owner's), so a real arranged page on the live site is step 8's to drive.

**What step 7 builds on** (see the 2026-09-11 DECISION_LOG row for the two flagged calls):
- RENDER with `ArrangedSheet` (`apps/web/app/[slug]/_components/story/arranged-sheet.tsx`) — pass
  `stills` on paper (a snippet prints as its still with ▶). Never a second renderer. Every length is
  in sheet units (`--sn-u` = 1/660 of the sheet's container), so it scales to any page width as is.
- READ with `loadStoryPages(admin, eventId, viewer, sign)` (`apps/web/lib/story-pages.ts`) — it goes
  through step 3's `loadStoryArrangement`, so S3 + S14 hold. `sheetsOf` / `placeSheetsOnDays` /
  `withoutPlacedMedia` (`apps/web/lib/story-sheet.ts`) decide which moments draw, where they go, and
  which minute media to leave out.
- A guard (`lib/the-public-story-reads-the-arrangement-once.test.ts`) fails if a route under
  `app/[slug]`, `app/api` or `app/realstories` reads the arrangement any other way — the print route
  is under `app/[slug]`, so step 7 must use `loadStoryPages` too.


```
GOAL: the public story (/[slug]) shows each moment the way the host arranged it.
WHERE: each run-of-show moment is already a part of the minute spine (S9). A moment arranged by
hand renders its sheet there, scaled to the reader's width (same composition on every screen); an
Automatic moment renders exactly as today. Word looks render as the host set them;
nothing editable, no ×, no handles.
TRAPS: the /[slug] read is service-role, outside every RLS rule — use step 3's read helper so the
guests-only (S3) and taken-back (S14) rules apply; a test fetches the page ANONYMOUSLY and asserts a
taken-back photo is absent from the HTML and the OG card. Solemn events keep the quiet register
(S13).
DONE WHEN: a by-hand moment looks the same at 1280 and 390; nothing taken back appears in the HTML,
the OG card or the recap.
```

## 6 · Story — the editor, part 2: words and moments · **Opus 5 · medium** · after step 4

```
GOAL: the rest of "Make it yours" inside the Story Maker.
PORT from the prototype: + Words (an EMPTY box with a placeholder, placed below everything; leaving
it empty removes it quietly; clearing words that had text is a removal WITH Undo; plain-text paste;
Escape stops typing and deselects; a press on the grip is a drag even when a phone retargets it to
the text); THE WORDS TOOLBAR, exactly as the prototype draws it (owner 2026-09-10: "cleaner and more familiar"):
one floating bar just above the selected words (below when there is no room), same square icon
buttons, groups split by hairlines — [ − size + ] | [ A text colour ▾ (a menu of Ink · Terracotta ·
Blue · Gold, opening away from the words) ] [ A background ] | [ turn left · turn right ] | [ remove ];
nothing on it takes the caret out of the words; it follows the words when they move;
⛔ NO STICKERS (owner, for now — keep the object model open to more kinds, build none); the round handle on desktop (resize + turn, snap
straight within 5°, kept inside the sheet by its TURNED box); ON A PHONE the handle and the
words × give way to that same toolbar (also the keyboard route); moments: + New
and ✎ as an inline field in the header (empty or Escape cancels a new moment; the press that ends
the typing still lands), row × with Undo, grip reorder with mouse AND touch (pointer events, capture
on the LIST), Alt+Arrow reorder; named sets (inline field, one chip per name, chip × with Undo,
chip shows what is still free to place).
THE TEST PLAN: every remaining item in 10a, skipping the sticker items. Known OPEN in the prototype — do them properly here: the
moment row must not be role=button with a nested button; words need a keyboard way to MOVE; Tab out
of a still-empty new box.
ALSO IN THIS STEP — FOUND LIVE 2026-09-11 (after step 4 merged): the page for "The story" shows 
"Make it yours" and then, UNDERNEATH it, the whole older editor — What goes in · The words · Your 
photos (cover + gallery uploads) · Section order · Your own columns · What they said · What shows. 
The approved prototype shows only "Make it yours" in this step. Owner ruling S6 (2026-09-09): nothing 
the shipped editor can do may be lost. So: keep every one of those controls working, but fold them 
under ONE closed disclosure at the bottom of the step, "More settings", so the step reads as Make it 
yours first. Do not delete, rename or re-order what is inside; a guard must fail if a control goes 
missing (there is a lost-controls lint — use it, do not regenerate its baseline to go green).
DONE WHEN: the step-4 Playwright script extended to words, looks, the phone toolbar,
naming and reorder passes at 1280 and 390 touch with zero dialogs and zero errors.
```

## 7 · Story — the prints carry the arrangement · **Sonnet 5 · medium** · ✅ DONE, MERGED, VERIFIED LIVE 2026-09-11 (code PR #5448, merge `0250084`)

**Verified with the object, not this line:** `gh pr view 5448 --json state,mergedAt` → merged
2026-09-11T05:14:46Z; `curl -s https://setnayan-platform-web.vercel.app/api/health` reports
`"version":"0250084"` — the merge commit's short SHA, confirmed serving live after 20 polls at
~20s apart (~6–7 minutes for the Vercel deploy to roll out). Worktree pruned the same session.

🔎 **WHAT SHIPPED.** Step 2's A4 seam (`keepsake-layout.ts`'s `A4PageSource.arranged` — a documented
placeholder nothing produced) now carries a real `DrawnSheet`; `arrangedA4PageResolver` inserts one
arranged page per hand-arranged moment, in time order (sheet-before-minute at a tie, same rule
`story-spine.tsx` uses), alongside the mechanical one-minute-per-page pages — every chapter still
becomes exactly one 'minute' page, never merged or dropped. The A3 broadsheet had **no seam at all**;
it now gives each hand-arranged moment its own dedicated full page, appended after the curated
front/back, in the same time order — the couple's locked close + QR colophon move to the LAST such
page. Both formats strip a chapter's media of any capture a sheet already shows
(`withoutPlacedMedia`/`refsOnSheets` — the exact functions the public page uses), and neither clips an
arranged page the way the curated grid's fixed-height sheet does (a host's composition isn't
pre-capped to one page, so its own page lifts the fixed height + `overflow:hidden`).

⚠ **THE ONLY READ IS `loadStoryPages`** (step 3's one gated door — S3 + S14), on BOTH formats — no
second gate, no bypass; `the-public-story-reads-the-arrangement-once.test.ts` (which scans the WHOLE
`app/[slug]` tree for any other way in) now also pins the print route's own call site.

🚩 **FLAGGED FOR THE OWNER, NOT DECIDED SILENTLY — see the PR body.** The A3 layout for a
hand-arranged moment: a composed sheet (up to 660 units, growing downward) doesn't fit the curated
compact chapter grid, so this PR gives it a dedicated full broadsheet page instead of shrinking it
into the grid (the rejected alternative would either enlarge the host's composition past its own
660-unit sheet, or shrink it illegibly).

⚠ **NOT SCREENSHOTTED END-TO-END** — no story in prod carries a hand arrangement yet (the
arrangement itself shipped 2026-09-11); step 8 drives the real end-to-end proof. This step's own
coverage is `arranged-pages.test.ts` (new — chapter preservation, tie-break ordering, an untimed
host-added moment still placed, the one-photo-one-place strip, and a sabotage proving a resolver
that forgets to strip a placed capture is caught) plus `a4-pagination.test.ts` updated for the new
`arranged` shape. All pass; `TSC_EXIT=0`; `pnpm lint` clean.

```
GOAL: the A3 keepsake and the A4 booklet print each hand-arranged moment exactly as the host laid it
out; Automatic moments print as today.
REUSE step 5's sheet render (never a second renderer) and step 2's A4 seam. The edition stamp, the
QR and S14's taken-back rules apply unchanged.
DONE WHEN: print-to-PDF of a celebration with one hand-arranged moment matches the on-screen sheet,
and a test fails if a taken-back photo reaches a printed page.
```

## 8 · Story — the whole thing, driven end to end · **Opus 5 · high** · after steps 6 and 7

```
GOAL: prove a real host can build, publish and share an arranged story on a phone and a computer,
and a guest sees it right — on the preview deploy, with Playwright, on testnayan accounts.
SCRIPT: create a celebration with a run of show and Papic captures → open the Story Maker → The
story → Automatic → I choose → arrange a moment (photos, words with a look) → Undo →
reload → publish (S8) → open /[slug] signed out, as a guest, as the host → a guest takes a photo
back (S14) → it leaves the page, the OG card and both prints → A4 and A3 print.
Re-drive the whole of 10a against the app. Fix what you find in small PRs; anything that is the
owner's call goes to NEEDS_THE_OWNER, never decided.
DONE WHEN: the script passes at 1280 and 390 touch, light and dark; a written list of every 10a item
with PASS and evidence is in the PR body; the owner gets a plain-English "here is what a host sees".
```
