# Event Hub music ("Our music") — build status · 2026-10-08 · Builder M1

Owner, verbatim (DECISION_LOG 2026-10-08): *"background music. where can we upload via admin to add music they can pick?"* · *"skip the apple concept"* · *"ok. but can you temporarily upload it to where the upload music will be via admin dashboard?"*

_Updated after each finished item. If a line says IN PROGRESS and nothing newer follows, the work stopped there._

## DONE

### PR A — #6430 · `rd/hub-music-library` · head `5cc4dd9bd` · base `main` @ `560e6d0f0`
DRAFT · label `do-not-auto-merge` · auto-merge OFF (read back from GitHub). Worktree `~/Documents/Claude/Projects/wt-music`.
**Carries ONE migration: `supabase/migrations/20271266495922_hub_music_tracks.sql`** — the controller announces it to the owner before the deploy; never applied by hand.

### PR B — #6434 · `rd/hub-music-our-music` · head `0538d9812` · base `main`
DRAFT · label `do-not-auto-merge` · auto-merge OFF. Worktree `~/Documents/Claude/Projects/wt-music-b`.
Cut from Builder L1's PR 1 head (`origin/rd/look-three-tabs` @ `bbeaa6742`, #6426) merged with PR A. **No migration of its own, no column on `events`.** Its diff against `main` also shows #6426 and #6430 until they merge.

## Names

| Thing | Name |
|---|---|
| Table | `hub_music_tracks` — track_id · public_id (`S89M-…`) · title · mood · r2_key (unique, under `hub-music/`) · duration_seconds · file_bytes · is_published · sort_order · created_by (→ `auth.users`, ON DELETE SET NULL) · created_at · updated_at |
| Moods (closed list; key in the table, label in `apps/web/lib/hub-music.ts`) | classic_romantic · harana · garden_rustic · modern_minimal · grand_cinematic · beach_sunset · soft_jazz_reception · playful_joyful · warm_intimate — or none yet (a track cannot be published without one) |
| RLS | Pattern H: `hub_music_tracks_read_published` (authenticated, `is_published`) · `hub_music_tracks_admin_write` (`is_admin()`); anon holds nothing; `created_by` is not in the SELECT grant |
| Admin page | `/admin/hub-music` — Admin › Studio › **Event Hub music** |
| Storage | the public media bucket, prefix `hub-music/` |
| Server action | `saveHubMusic` (ONE export: add · edit · remove), `apps/web/app/admin/hub-music/actions.ts` — **+1 exported "use server" function: 1199 → 1200 of 1225** |
| Codec + length reader | `apps/web/lib/audio-sniff.ts` |
| The couple's pick | `events.site_bg_music_r2_key` holding `r2://setnayan-media/hub-music/…` (no new column); recognised by `apps/web/lib/hub-music-ref.ts` |
| Couple's UI | Look › Music › **Source ▾** (Our music · Your music) → `our-music.tsx` (lazy, `maker-details` chunk) |

## How to bulk-upload the owner's files, once PR A is deployed (three steps)

1. Open **Admin › Studio › Event Hub music** (`/admin/hub-music`) and press **＋ Add** (under the list).
2. Choose all 20 files in **`~/Documents/Claude/Projects/setnayan-hub-music/aac/`** — the AAC copies, NOT the originals in `~/Downloads/music` (those are Opus and are refused, each with its reason) — and press **Add 20 tracks**. Each becomes a row titled from its file name ("Classic Romantic-2" → "Classic Romantic 2"); 18 get their mood from the title; all start unpublished.
3. In the list: ▶ to listen, pick a mood for the two **Velvet Court** rows (their title names none of the nine), and switch **Published** on for the ones couples should see.

Couples then pick them in **Event Hub Maker › Look › Music › Source ▾ › Our music** (PR B).

## What each PR does

**PR A** — the table; `/admin/hub-music` (list: ▶ · title · mood ▾ in the row · length · published switch · search · ＋ Add for one file or many · a sheet per track that saves as you leave a field · Remove with a confirm · "couldn't read" in place of an empty list); `/api/upload` treats `hub-music/` as an admin's folder (admin · M4A/MP3/AAC · 20 MB); on add the server reads the stored bytes — AAC and MP3 accepted with their real length, Opus-in-.m4a and everything else refused in a sentence; `hub-music/` joined to Website media; every admin write in `admin_audit_log`.

**PR B** — Source ▾ in Look › Music (both Makers); Our music's Song row and list by mood with ▶ per row; the pick goes into the draft and ✓ Apply publishes it; the form names a track and the server resolves its file (published only); Apply re-checks the track is still published; **an Our-music pick is free at Apply** (the prototype's words "free to use"), the couple's own song stays Pro; an event's deletion never deletes a shared file; a removed track's file stays while an Event Hub plays it.

## Checks run locally (CI judges the rest)

**PR A** (`wt-music`): full `tsc` 0 errors (3 min 36 s under the lock, on the tree before the last roster lines; those lines were typechecked again inside PR B's run) · `pnpm lint` 0 errors (15 warnings, none in these files) · new tests: `lib/hub-music.test.ts` 13/13, `lib/audio-sniff.test.ts` 13/13, `tests/db/hub-music-tracks.db.test.ts` 8/8 · every test under `app/admin` 400/400 · 146 guard files that pin the touched files or walk the tree: 1,407/1,407 (three were red first and are fixed: the model-choice cap, the `is_published` roster, the media-prefix list) · 12 schema-wide DB guards green (exposure-freeze, ugat ×3, user-delete-fk-surface, user-fk-behaviour, schema-drift, anon-table-grants-closed, erasure-completeness, every-person-keyed-table, gates/handles) · 37 of 37 non-build `ci.yml` node guards · `lint:dup-rule` clean.
**PR B** (`wt-music-b`): full `tsc` 0 errors (2 min 50 s under the lock, on the pushed head) · `pnpm lint` 0 errors · new test `lib/our-music-is-a-pick.test.ts` 9/9 · 177 pinning files 1,626 tests: 4 red first (the Maker preload list, two `onChange={draftNow}` counts, a 900-character window) → fixed → the 66 files that pin the changed code 606/606 · 5 schema DB guards on the merged tree green · 37 of 37 node guards · `lint:dup-rule` clean.
**NOT run locally, either PR:** the full unit suite, the full DB suite, `next build`, the Maker 507 KB budget, the shared-bundle budget, the Vercel route count.

Sabotages, each seen red then restored from a copy — 20 for PR A (5 on the migration, 6 on the codec reader, 9 on the rules and wiring) and 14 for PR B; each is listed in its test file's header.

**NOT verified (no browser sign-in from here):** `/admin/hub-music` on screen; a real upload, ▶ and Remove; the sticky tools row on a phone; Look › Music at 375 against screens 13–14; a pick → ✓ Apply → the guest page playing it; the bundle budgets.

## TODO

- Controller: 375 side-by-sides (PR B against screens 13–14; the admin page against the data-list frames), then the owner's OK.
- Restudy § 6 row 5 remainder (not built): Starts ▾ · Button ▾ · Fade out for videos · the Music switch as picture 13's first row.
- Follow-up, NOT fixed: the couple's own "Your music" upload (`SiteChromePanel` → `<FileUpload>`) sends the browser's own type, and Chrome/Safari call an .m4a `audio/x-m4a`, which `/api/upload` does not hold — so it likely refuses an .m4a there today; and it does not read the codec, so an Opus .m4a from a browser that says `audio/mp4` is accepted and is silent on some iPhones. The check exists (`lib/audio-sniff.ts`) but wiring it there is not a one-line reuse (the file is uploaded before any server code sees it, and the write goes through the draft).
- Owner calls: (1) should some tracks be ◆? — the DECISION_LOG row says "free or ◆"; there is no such flag and every track is free. (2) "Velvet Court" as a tenth mood, or filed under one of the nine?

## Traps

- **The generator's .m4a files are Opus, not AAC** (measured on all 20: `Opus` sample entry, 48 kHz stereo). The extension, the browser's type and `afinfo` all hide it; only the bytes say. The server refuses it by name.
- **A browser does not call an .m4a `audio/mp4`** — Chrome and Safari say `audio/x-m4a`. The admin page settles the name itself (`hubMusicContentTypeFor`) and does its own presign + PUT, like its neighbour `background-videos-manager.tsx`; `<FileUpload>` would have refused the owner's files.
- `reel_music_tracks` (born `patiktok_music_tracks`) is NOT reused: every reel reader takes any active row as backing music for a rendered video; its genre list and 240-second cap are a reel's.
- A new admin page raises `MODEL_CHOICE_CAP` by one (`lib/admin-map/rank-choices.ts`, 142 → 143) and joins `CONVERTED` in `admin-console-is-one-table.test.ts`; a file that filters on `is_published` joins `ALLOWED_FILTERS` in `one-definition-of-live.test.ts`; a new media prefix joins `website-media.test.ts`. None of these is in a per-file test run.
- `try-then-pay-the-last-three.test.ts` reads a 900-character window after the draft door in `site-chrome/actions.ts`; new draft logic goes in a helper above it. `the-look-is-one-panel` splits the Music form on `) : (` — use `&&`, not a nested ternary, inside the music branch.
- A lazy piece the Maker can open must be reached through a stand-in the Maker warms (`scene-styles-lazy.tsx`), or `maker-tools-are-all-preloaded` fails.
- `git stash` is shared by every worktree of the repo: a `stash pop` in a clean worktree applies ANOTHER session's stash. (It happened once here; one file conflicted and was restored from HEAD, the stash entry was kept — nothing lost.)
