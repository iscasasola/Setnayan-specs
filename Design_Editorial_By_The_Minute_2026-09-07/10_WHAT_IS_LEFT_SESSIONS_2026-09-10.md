# 10 · WHAT IS LEFT — the sessions, in order (2026-09-10)

> Supersedes the "LEFT" row of `09_SESSIONS_AND_PROMPTS_2026-09-09.md`. **S1–S15 of the Story plan
> are ALL MERGED** (verified with `gh pr view`: #5329–#5389, S15 = commit `5f7d8f04`). What remains
> is below. ⚠ Verify any PR state with `gh pr view <n> --json state,mergedAt` before trusting it.

## The order

| # | Session | What a person gets | Model | Effort | Starts when |
|---|---|---|---|---|---|
| **1** | Papic · sponsors get a bigger share | A sponsor's guests start with more shots, automatically | **Opus 5** | **high** | now |
| **2** | Story · A4, one minute per page | The story prints as a booklet, one minute to a page | **Sonnet 5** | medium | now — safe beside 1 |
| **3** | Story · where the arrangement is kept | "Make it yours" saves for real, for every celebration | **Opus 5** | **high** | ⛔ after the owner OKs the prototype |
| **4** | Story · the "Make it yours" editor, in the app | The host arranges each moment's page inside the Story Maker | **Opus 5** | **high** | after 3 — safe beside 5 |
| **5** | Story · guests see the arranged pages | The public story shows each moment the way the host laid it out | **Opus 5** | medium | after 3 — safe beside 4 |

⛔ **Never together:** 3 with 4 or 5 (4 and 5 build on 3's data shape). 4 and 5 touch different
trees (`/dashboard/[eventId]/story` vs `/[slug]`) and may run side by side.

## Not sessions — the owner's to decide

* The 10 items in `NEEDS_THE_OWNER_2026-09-09.md` (item 11 is built — PR #5381).
* **Sign-off on the four design calls in "Make it yours"** (`DECISION_LOG.md` 2026-09-10 🧩):
  one photo · one moment · the page is a fixed sheet scaled to fit · no animated text effects ·
  no pop-ups, Undo instead. **Session 3 must not start until he has used the prototype.**
* Housekeeping: PR #5012 is an older open copy of #5378 (same title, #5378 merged) — close it;
  PR #5140 is owner item 3.

---

## SHARED HEADER — paste at the top of every prompt below

Use the SHARED HEADER in `09_SESSIONS_AND_PROMPTS_2026-09-09.md` (RULE 0, build beside the repo
never in /tmp, commit before the first mutation, print TSC_EXIT beside ERROR_LINES, a guard must be
able to fail — print the sabotage's occurrence count before → after, verify a migration IN PROD BY
THE OBJECT, reply to the owner in plain English). Add this line for sessions 3–5:

> **Drive it in a real browser before calling it done.** Round 1 of testing the prototype found 61
> defects that reading the code could not see (a remove button clipped by its own photo, a double
> Enter duplicating a photo, a page wider than a phone, a caption that swallowed the next tap).
> Playwright is installed: `node_modules/.pnpm/playwright@1.60.0/node_modules/playwright`.

---

## 1 · Papic — sponsors get a bigger share · **Opus 5 · high**

```
GOAL: on a celebration with sponsors, a sponsor's guests start with a bigger share of shots by
default — the addition the owner made on 2026-08-29.

READ FIRST: WHATS_NEXT_Papic_Items_3_7_HANDOFF_2026-08-29.md § 3, the part headed "One addition
made 2026-08-29: sponsors default to a bigger share", and WHATS_NEXT_Shots_Per_Guest_2026-08-28.md.

WHAT ALREADY SHIPS — DO NOT REBUILD (corrected 2026-09-10, read out of prod by the object):
the per-guest ceiling is LIVE. papic_record_guest_capture asks papic_guest_spend_ceiling() first;
that function has the named-guest, equal-share and release arms; a guest's own purchase is exempt
(papic_guest_ceiling_spend). PRs #5014 #5017 #5019 #5024 #5028 #5034 #5052. The ONLY missing piece:
no Papic function or file knows about sponsors (lib/event-sponsors.ts is imported by nothing in
Papic).

THE DELTA: the default share for a guest who is a sponsor is larger, derived at spend time inside
papic_guest_spend_ceiling (a named guest's own number still wins; release still applies). Show it
where the couple sets the numbers and on the guest's counter.

TRAPS: CREATE OR REPLACE on that function is a time machine — start from prod's live body
(pg_get_functiondef), never from an old migration, or you silently revert #5052 and #5034. Prove
the ceiling BINDS on a real pool event in a db test, not that a column exists.

DONE WHEN: a sponsor guest's ceiling is bigger than a plain guest's on the same event, proven by a
db test that fails when the sponsor arm is removed; migration verified in prod by the object.
```

## 2 · Story — A4, one minute per page · **Sonnet 5 · medium**

```
GOAL: the story prints as an A4 booklet with one minute of the day per page — the last unbuilt
part of S12 (01 §9, 08 step 2.7).

WHAT ALREADY SHIPS — DO NOT REBUILD: the A3 broadsheet keepsake with its QR back to the living page
(app/[slug]/print/: keepsake-layout.ts, keepsake.css.ts, print-sheet.tsx, print-toolbar.tsx,
page.tsx using renderUrlQrSvg); the edition stamp from S14; the 9:16 card; the share sheet (#5380).
keepsake.css.ts's "A4" today is only a screen-preview width that scales to A3 in print.

THE DELTA: a second print format on the same route and toolbar — A4, one minute per page, carrying
the edition stamp and the QR; the taken-back rules from S14 apply to it exactly as to A3. Solemn
events print in the quiet register.

DONE WHEN: printing to PDF gives one page per minute that has content, every page carries the stamp,
nothing a guest took back appears, and a test fails if a minute is split across pages.
```

## 3 · Story — where the arrangement is kept · **Opus 5 · high** · ⛔ owner OK first

```
GOAL: what a host arranges in "Make it yours" is saved for their celebration and read back.

THE DESIGN (binding — port, never redraw): prototypes/story_make_it_yours_2026-09-10.html and the
DECISION_LOG 2026-09-10 🧩 row. Four design calls the owner has signed off (check the log first):
one photo in one moment; positions stored in SHEET UNITS (a fixed 660-unit sheet scaled to fit,
never re-flowed); no animated text effects; no pop-ups — every removal instant with Undo.

RULE 0, pre-answered: the Story Maker already saves into event_editorial.draft_json through
app/dashboard/[eventId]/story/actions.ts (saveEditorial). The arrangement very likely belongs there
as one key — decide from the code, and prefer that over a new table.

WHAT TO STORE per moment: mode (automatic | by hand), the host's order and names of moments, and
for by-hand pages: each object (photo/snippet ref, words, sticker) with x, y, size, turn, colour,
backing; named photo sets. AUTOMATIC IS DERIVED, NOT STORED — compute it from the run of show and
Papic's capture minutes on every read.

TRAPS: a photo ref must be one the viewer may see (S3's guests-only rule; S14's taken-back rule) —
enforce on read, not only on save. A server-side check that the same photo is not in two moments.

DONE WHEN: save → reload returns the same arrangement exactly; a taken-back photo drops out of
every saved page; db/unit tests fail when the one-photo-one-moment check is removed.
```

## 4 · Story — the "Make it yours" editor in the app · **Opus 5 · high** · after 3

```
GOAL: step "The story" of the six-step Story Maker becomes the "Make it yours" editor.

PORT prototypes/story_make_it_yours_2026-09-10.html into
app/dashboard/[eventId]/story (the rail and the six steps ship — #5389). Keep every behaviour the
prototype was tested for: the tray holds only unplaced Papic photos AND snippets; a tap is the add;
× on every photo always showing and counter-scaled; Automatic vs I choose; Put all back; inline
naming (no prompt/confirm anywhere); Undo on every removal; stickers = the Kwento decorator's own 24
and its resize-and-turn handle (reuse app/papic/decorate/_components/kwento-decorator.tsx's model,
do not write a second one); four word colours + backing; keyboard (Tab, Enter, arrows, Delete,
Cmd/Ctrl+Z).

THE 61 + 20 LESSONS ARE THE TEST PLAN: 10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md lists every one —
re-drive each against the app — never rebuild the stage on a press; aria-disabled, never
disabled; minmax(0,1fr) on every grid; drag thresholds; the sheet grows as things move down.

DONE WHEN: a Playwright script at 1280 and 390 (touch) adds, drags, removes, undoes and saves with
zero dialogs, zero console errors, pills + tray always equal to the number of photos, and no
horizontal scroll.
```

## 5 · Story — guests see the arranged pages · **Opus 5 · medium** · after 3

```
GOAL: the public story (/[slug]) shows each moment the way the host arranged it.

WHERE IT GOES: each moment in the run of show is already a part of the minute-by-minute spine (S9).
A moment the host arranged by hand renders its sheet there, scaled to the reader's width (sheet
units → the same composition on every screen); an Automatic moment renders exactly as today. The
A3 and A4 prints (session 2) take the same sheet.

TRAPS: the service-role read on /[slug] is outside every RLS rule — the guests-only (S3) and
taken-back (S14) rules must be applied to the arrangement's photo refs in code, and a test must
fetch the page anonymously and assert a taken-back photo is absent from the HTML. Solemn events use
the quiet register (S13).

DONE WHEN: a by-hand moment looks the same at 1280 and 390; nothing a guest took back appears in
the HTML, the OG card or print.
```
