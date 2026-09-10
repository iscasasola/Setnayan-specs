# Step 4 · "Make it yours" — the real-browser drive (2026-09-11)

The Playwright script that drove the photo half of "Make it yours" at **1280 mouse** and **390
touch** before it shipped. Step 6 extends THIS script (its brief: *"the step-4 Playwright script
extended to words, looks, the phone toolbar, naming and reorder"*) — do not start a new one.

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
4. `node mky-drive.cjs desk` · `node mky-drive.cjs phone` · `node mky-drive.cjs` (both).
   `TRACE=1` prints every save and its answer.

Result on the shipped code (PR #5430), on a production build (`next build` + `next start`):
**124 passed · 0 failed (1280)**, **112 passed · 0 failed (390)**, zero CSP reports,
zero dialogs, zero console errors, no sideways scroll; (photos on pages + tray) = 10 after every
step. Every check was shown able to fail: the double-tap quiet window, the held-key guard and the
"Saved only when nothing newer waits" fix were each removed and the drive went red.

## One defect it found that reading could not

A drag landed while the previous save was on the wire; that save came back and said **"Saved"**
for a page whose newest change was still in its 400 ms timer. Reloading on "Saved" lost the drag.
Fixed in the component (`if (saveTimer.current) return;` before `setSaveState('saved')`).
