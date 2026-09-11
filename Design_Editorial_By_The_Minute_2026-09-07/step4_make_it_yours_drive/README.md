# Steps 4 + 6 · "Make it yours" — the real-browser drive (2026-09-11)

The Playwright script that drove "Make it yours" at **1280 mouse** and **390 touch** before it
shipped: the photo half (step 4, `mky-drive.cjs`) and, in the SAME run, words, the words toolbar,
the round handle / phone toolbar, moments, naming, named sets and reorder (step 6,
`mky-step6.cjs`, called from the end of `mky-drive.cjs`). One run, one log: every dialog, console
error and CSP report from either half fails it. Extend this; do not start a new one.

## What it drives, and what it does not

- ✅ The REAL `<MakeItYours>` component, fed by step 3's REAL read (`loadStoryArrangement`) and
  the REAL shaping (`makeItYoursInputFrom`), saving through step 3's REAL `saveStoryArrangement`.
- ⚠ Over an in-memory stand-in for the database (`harness/store.ts`), which answers the same
  queries and mirrors `save_story_arrangement`'s compare-and-set exactly (saved · unchanged ·
  conflict). **Why:** the production service role is marked sensitive in Vercel and does not
  come down with `vercel env pull`, there is no Docker for a local Supabase, and signing in to
  the live site would mean typing a password. Step 8 drives the live path end to end.
- The stills are drawn stand-ins served by Playwright for `…/story-step4-fixture/<n>…`, from a
  host the site's content policy allows (`*.r2.cloudflarestorage.com`) — the drive fails on any
  CSP report, console error or dialog.
- The same ten captures (8 photos, 2 snippets) are seeded in PROD on testnayan1's
  "Song Desk Test Night" (`device_model = 'story-step4-fixture'`, one revoked seat, index 900)
  for step 8 to use; delete with
  `delete from papic_photos where device_model = 'story-step4-fixture';` and the seat with
  `seat_index = 900 and claim_qr_token like 'storystep4fixture%'`.

## Run it

1. In a worktree: copy `harness/` to `apps/web/app/mky-harness/` and list that folder in
   `.git/info/exclude` — **it is never committed**.
2. `apps/web/.env.local` needs only `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (the app's layout reads them); nothing secret.
3. `pnpm --dir apps/web dev` (or `next build && next start` for the strict run).
4. `MKY_WT=<your worktree> MKY_BASE=http://localhost:<port> node mky-drive.cjs desk` · `… phone` ·
   `…` (both). `MKY_WT` is the worktree whose `node_modules` holds Playwright; both default to the
   step-4 values. `TRACE=1` prints every save and its answer. The test page shows what the stand-in
   store holds in `[data-harness-doc]`, which the step-6 checks compare with what is drawn.

Result on the shipped code (PR #5430), on a production build (`next build` + `next start`):
**124 passed · 0 failed (1280)**, **112 passed · 0 failed (390)**, zero CSP reports,
zero dialogs, zero console errors, no sideways scroll; (photos on pages + tray) = 10 after every
step. Every check was shown able to fail: the double-tap quiet window, the held-key guard and the
"Saved only when nothing newer waits" fix were each removed and the drive went red.

## One defect it found that reading could not

A drag landed while the previous save was on the wire; that save came back and said **"Saved"**
for a page whose newest change was still in its 400 ms timer. Reloading on "Saved" lost the drag.
Fixed in the component (`if (saveTimer.current) return;` before `setSaveState('saved')`).

## Step 6 (2026-09-11) — what it drives, and what it found

Result on the step-6 code: **1280 mouse and 390 touch both pass with 0 failed, zero dialogs, zero
console errors** (counts in the step-6 PR body and `DECISION_LOG.md` 2026-09-11). Every step-6 item
of `10a_MAKE_IT_YOURS_TEST_PLAN_2026-09-10.md` is re-driven (each check names its 10a id), sticker
items skipped (owner, for now) — including the three the prototype left OPEN: the moment row is a
list item, not a button holding a button; words move by the keyboard; Tab out of a still-empty box.

**Four defects reading could not see, each caught by this drive and fixed in the component:**
1. **Typed letters vanished.** React 19 re-applies inline HTML whenever its object is new; a fresh
   `{ __html }` per render wiped each letter as it was typed. Fixed by one unchanging object.
2. **The toolbar took a ×'s press.** New words land just under the photos, so a bar above them sat
   on the photo row. "Below when there is no room" now counts "would cover a control" as no room,
   and the bar stays inside the page's own box.
3. **A caption's kept size went stale.** Clearing words measures the EMPTY box (its placeholder);
   Undo then brought the words back at that size and Automatic dealt photos under them. Captions
   are now kept at the size they are drawn.
4. **The × was a tall oval** — the app's 44px button floor on a 26px circle (step 4 shipped it).

**One check shown able to fail by sabotage, on purpose:** with the layout freeze disabled, a press
near a tray photo's edge after an empty box that made the page tall is LOST (photos 3 → 3); with it,
it lands (3 → 4). Before that check existed, disabling the freeze left the whole run green — the
earlier flows never moved anything under the finger.

⚠ **A harness difference, measured:** on the 390 run, Chromium's emulated Cmd+A after a drag selected
a stray line break OUTSIDE the caption (the tap itself leaves the caret inside — traced). A phone
selects from its long-press menu, so the phone run selects the caption's contents directly.
