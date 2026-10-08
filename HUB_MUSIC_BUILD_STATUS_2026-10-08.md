# Event Hub music ("Our music") — build status · 2026-10-08 · Builder M1

Owner, verbatim (DECISION_LOG 2026-10-08): *"background music. where can we upload via admin to add music they can pick?"* · *"skip the apple concept"* · *"ok. but can you temporarily upload it to where the upload music will be via admin dashboard?"*

## WHERE IT IS (updated 09:35 PHT — WORK IN PROGRESS, pushed early: the Mac was on battery)

- **PR A — #6430 (DRAFT, `do-not-auto-merge`, auto-merge OFF)** · branch `rd/hub-music-library` · worktree `~/Documents/Claude/Projects/wt-music` · first push `eb03067be` (wip).
- **Carries ONE migration: `supabase/migrations/20271266495922_hub_music_tracks.sql`** — announced to the owner by the controller before the deploy; never applied by hand.
- PR B (`rd/hub-music-our-music`, the couple's side) — NOT started; waits on Builder L1's `rd/look-three-tabs` PR 1.

## Names

| Thing | Name |
|---|---|
| Table | `hub_music_tracks` (track_id · public_id `S89M-…` · title · mood · r2_key · duration_seconds · file_bytes · is_published · sort_order · created_by · timestamps) |
| Moods (closed list, key → label in `apps/web/lib/hub-music.ts`) | classic_romantic · harana · garden_rustic · modern_minimal · grand_cinematic · beach_sunset · soft_jazz_reception · playful_joyful · warm_intimate · or none yet (a track cannot be published without one) |
| Admin page | `/admin/hub-music` (Studio group) |
| Storage | public media bucket, prefix `hub-music/` |
| Server action | `saveHubMusic` (one export: add · edit · remove) in `apps/web/app/admin/hub-music/actions.ts` |
| Codec + length reader | `apps/web/lib/audio-sniff.ts` |

## Written so far (in the wip commit — NOT yet typechecked or tested)

- the migration; `lib/hub-music.ts` (moods, title-from-file-name, mood guess, upload rule); `lib/audio-sniff.ts` (reads AAC / MP3 / Opus and the length from the bytes — run by hand against the owner's 20 originals and the 20 AAC copies: Opus refused, AAC accepted, lengths match); `lib/hub-music-server.ts`; `/api/upload` treats `hub-music/` as an admin's folder (admin · M4A/MP3/AAC · 20 MB); the admin page, its manager and its one action; `hub-music/` joined to Website media.

## TODO (PR A)

- tests (unit + DB), each seen red once · admin nav registries (nav groups, descriptions, nav-registry defaults, generated admin map) · Ugat node + claims · exposure baseline · FK-behaviour map · other table rosters · typecheck · lint · guards · changelog fragment is in.

## How to bulk-upload the owner's files, once this is deployed (three steps)

1. Open **Admin › Studio › Event Hub music** (`/admin/hub-music`) and press **＋ Add**.
2. Choose all 20 files in **`~/Documents/Claude/Projects/setnayan-hub-music/aac/`** (the AAC copies — NOT the originals in `~/Downloads/music`, which are Opus and are refused) and press **Add 20 tracks**. Each becomes a row titled from its file name ("Classic Romantic-2" → "Classic Romantic 2"), its mood guessed when the title starts with a mood's name; all start unpublished.
3. In the list, press ▶ to listen, pick a mood for the two "Velvet Court" tracks (they match none), and switch **Published** on for the ones couples should see.

## Traps

- **The generator's .m4a files are Opus, not AAC.** Opus in an .m4a wrapper does not play on every iPhone. The server reads the real codec from the stored bytes and refuses it in a plain sentence; upload AAC or MP3.
- **A browser does not call an .m4a `audio/mp4`** — Chrome and Safari say `audio/x-m4a`, which `/api/upload` does not hold. The admin page settles the name itself. The COUPLE's own "Your music" upload (`SiteChromePanel`, `<FileUpload>`) passes `file.type` through, so it likely refuses an .m4a in Chrome/Safari today and would accept an Opus one silently — a follow-up, not fixed here.
- `reel_music_tracks` (born `patiktok_music_tracks`) is NOT reused: every reel reader takes any active row as backing music for a rendered video, and its genre list and 240-second cap are a reel's.
