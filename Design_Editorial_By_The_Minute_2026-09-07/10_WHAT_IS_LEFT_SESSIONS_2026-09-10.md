# 10 · WHAT IS LEFT — the series of builds, in order (rev 2, 2026-09-10)

> Supersedes the "LEFT" row of `09_SESSIONS_AND_PROMPTS_2026-09-09.md` and rev 1 of this file.
> **S1–S15 of the Story plan are ALL MERGED** (#5329–#5389; S15 = commit `5f7d8f04`). Papic item 3's
> core is built and live (corrected 2026-09-10) — only its sponsor share is left.
> ⚠ Verify any PR state with `gh pr view <n> --json state,mergedAt` before trusting it.
>
> **The design being built:** `prototypes/story_make_it_yours_2026-09-10.html` (three rounds of
> real-browser testing) · its test plan `10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md` · the
> `DECISION_LOG.md` 2026-09-10 🧩 row.

## The series

| Step | Build | What a person gets | Model | Effort | Starts when | May run beside |
|---|---|---|---|---|---|---|
| **0** | **Owner gate** — try the prototype, sign off 5 design calls | — | — | — | now | — |
| **1** | Papic · sponsors get a bigger share | A sponsor's guests start with more shots | Opus 5 | high | **now** | 2 |
| **2** | Story · A4, one minute per page | The story prints as a booklet | Sonnet 5 | medium | **now** | 1 |
| **3** | Story · where the arrangement is kept | "Make it yours" saves for every celebration | Opus 5 | high | after **0** | 1, 2 |
| **4** | Story · the editor, part 1 — photos | Tray, tap-to-add, ×, Automatic / I choose, Put all back, Undo, autosave | Opus 5 | high | after **3** | 5 |
| **5** | Story · guests see the arranged pages | The public story shows each moment as laid out | Opus 5 | medium | after **3** | 4, 6 |
| **6** | Story · the editor, part 2 — words, stickers, moments | Words + looks, stickers, the phone toolbar, naming, sets, reorder | Opus 5 | high | after **4** | 5 |
| **7** | Story · the prints carry the arrangement | A3 and A4 print each moment as laid out | Sonnet 5 | medium | after **2** and **5** | 6 |
| **8** | Story · the whole thing, driven end to end | Proof it works for a real host on a real phone | Opus 5 | high | after **6** and **7** | — |

⛔ **Never together:** 3 with 4/5/6/7 (all build on 3's data shape) · **4 with 6** (same editor files)
· 5 with 7 only if 7 waits for 5's render to merge (7 reuses it).
🔑 **Critical path:** 0 → 3 → 4 → 6 → 8. Everything else fits beside it. Steps 1 and 2 are
independent of the gate and can start today.

## Step 0 — the owner's five design calls (not a session)

Try the prototype on a phone and a computer, then confirm or change:
1. A photo is in **one** moment only.
2. The page is a **fixed sheet scaled to fit** — what you arrange on a laptop is what a phone shows, smaller.
3. **No animated text effects** (they cannot print).
4. **No pop-ups** — every removal is instant, with Undo.
5. **On a phone**, words and stickers get a toolbar (A− A+ ↺ ↻ Remove) instead of handles on the object.

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

## 1 · Papic — sponsors get a bigger share · **Opus 5 · high** · now

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

## 2 · Story — A4, one minute per page · **Sonnet 5 · medium** · now

```
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

## 3 · Story — where the arrangement is kept · **Opus 5 · high** · after step 0

```
GOAL: what a host arranges in "Make it yours" is saved for their celebration and read back.
THE DESIGN (binding — port, never redraw): prototypes/story_make_it_yours_2026-09-10.html and the
owner's step-0 ruling in DECISION_LOG.md (read it first — build what he signed off, not rev 1).
RULE 0, pre-answered: the Story Maker saves into event_editorial.draft_json through
app/dashboard/[eventId]/story/actions.ts (saveEditorial). The arrangement very likely belongs there
as one key — decide from the code; prefer that over a new table.
STORE per moment: mode (automatic | by hand), the host's order and names, host-added moments; for
by-hand pages every object — photo/snippet ref, words (text, colour, backing, size, turn), sticker
(which, size, turn) — with x, y in SHEET UNITS (660-wide sheet); named photo sets. AUTOMATIC IS
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

## 4 · Story — the editor, part 1: photos · **Opus 5 · high** · after step 3

```
GOAL: step "The story" of the six-step Story Maker (#5389) becomes "Make it yours" — the photo half.
PORT from prototypes/story_make_it_yours_2026-09-10.html (never redraw): the moments rail beside
the page; the desk and the fixed 660 sheet scaled to fit; the tray of UNPLACED Papic photos AND
snippets; a tap is the add (first free slot, never over words/stickers); the × on every photo,
always showing, counter-scaled, no invisible halo; drag with a 4px/10px threshold, bring to front,
the sheet grows downward; Automatic vs I choose (Automatic read-only, every refusal says why, on a
TAP not a swipe); Put all back; Undo for every removal (the undo belongs to the ACTION — a later
change retires it, a message never does); autosave through step 3's action; keyboard (Tab, Enter,
arrows move, Delete, Cmd/Ctrl+Z); aria-disabled never disabled; no prompt/confirm anywhere.
NOT IN THIS STEP: words, stickers, looks, the phone toolbar, naming, sets, moment reorder — step 6.
THE TEST PLAN: every photo-related item in 10a (rounds 1 and 3) — double presses, held keys, a page
wider than a phone, a × covered by a neighbour, resize never moving anything, a press still landing
after something above it changes size.
DONE WHEN: a Playwright script at 1280 and at 390 touch adds, drags, removes, undoes and reloads
with zero dialogs, zero console errors, (photos on pages + tray) always equal to the photo count,
and no horizontal scroll.
```

## 5 · Story — guests see the arranged pages · **Opus 5 · medium** · after step 3

```
GOAL: the public story (/[slug]) shows each moment the way the host arranged it.
WHERE: each run-of-show moment is already a part of the minute spine (S9). A moment arranged by
hand renders its sheet there, scaled to the reader's width (same composition on every screen); an
Automatic moment renders exactly as today. Stickers and word looks render as the host set them;
nothing editable, no ×, no handles.
TRAPS: the /[slug] read is service-role, outside every RLS rule — use step 3's read helper so the
guests-only (S3) and taken-back (S14) rules apply; a test fetches the page ANONYMOUSLY and asserts a
taken-back photo is absent from the HTML and the OG card. Solemn events keep the quiet register
(S13): no joyful stickers on a wake unless the host placed them.
DONE WHEN: a by-hand moment looks the same at 1280 and 390; nothing taken back appears in the HTML,
the OG card or the recap.
```

## 6 · Story — the editor, part 2: words, stickers, moments · **Opus 5 · high** · after step 4

```
GOAL: the rest of "Make it yours" inside the Story Maker.
PORT from the prototype: + Words (an EMPTY box with a placeholder, placed below everything; leaving
it empty removes it quietly; clearing words that had text is a removal WITH Undo; plain-text paste;
Escape stops typing and deselects; a press on the grip is a drag even when a phone retargets it to
the text); word looks (Ink · Terracotta · Blue · Gold + Backing — the row keeps the caret);
stickers = the Kwento decorator's own 24 (reuse app/papic/decorate/_components/kwento-decorator.tsx's
list and transform model — never a second copy); the round handle on desktop (resize + turn, snap
straight within 5°, kept inside the sheet by its TURNED box); ON A PHONE the handle and the
words/sticker × give way to the toolbar A− A+ ↺ ↻ Remove (also the keyboard route); moments: + New
and ✎ as an inline field in the header (empty or Escape cancels a new moment; the press that ends
the typing still lands), row × with Undo, grip reorder with mouse AND touch (pointer events, capture
on the LIST), Alt+Arrow reorder; named sets (inline field, one chip per name, chip × with Undo,
chip shows what is still free to place).
THE TEST PLAN: every remaining item in 10a. Known OPEN in the prototype — do them properly here: the
moment row must not be role=button with a nested button; words need a keyboard way to MOVE; Tab out
of a still-empty new box.
DONE WHEN: the step-4 Playwright script extended to words, stickers, looks, the phone toolbar,
naming and reorder passes at 1280 and 390 touch with zero dialogs and zero errors.
```

## 7 · Story — the prints carry the arrangement · **Sonnet 5 · medium** · after steps 2 and 5

```
GOAL: the A3 keepsake and the A4 booklet print each hand-arranged moment exactly as the host laid it
out; Automatic moments print as today.
REUSE step 5's sheet render (never a second renderer) and step 2's A4 seam. The edition stamp, the
QR and S14's taken-back rules apply unchanged. Stickers print as emoji glyphs — check they render
in the print path's fonts, and fall back cleanly if one does not.
DONE WHEN: print-to-PDF of a celebration with one hand-arranged moment matches the on-screen sheet,
and a test fails if a taken-back photo reaches a printed page.
```

## 8 · Story — the whole thing, driven end to end · **Opus 5 · high** · after steps 6 and 7

```
GOAL: prove a real host can build, publish and share an arranged story on a phone and a computer,
and a guest sees it right — on the preview deploy, with Playwright, on testnayan accounts.
SCRIPT: create a celebration with a run of show and Papic captures → open the Story Maker → The
story → Automatic → I choose → arrange a moment (photos, words with a look, a sticker) → Undo →
reload → publish (S8) → open /[slug] signed out, as a guest, as the host → a guest takes a photo
back (S14) → it leaves the page, the OG card and both prints → A4 and A3 print.
Re-drive the whole of 10a against the app. Fix what you find in small PRs; anything that is the
owner's call goes to NEEDS_THE_OWNER, never decided.
DONE WHEN: the script passes at 1280 and 390 touch, light and dark; a written list of every 10a item
with PASS and evidence is in the PR body; the owner gets a plain-English "here is what a host sees".
```
