# 03 · Data — what exists, and the seven things that do not

**Verify every row before building.** These were read from `origin/main` on 2026-09-07; cite a
greppable symbol, never a line number.

---

## 1 · Exists and is enough

| The story needs | It reads |
|---|---|
| A capture and its time | `papic_photos` · `papic_guest_captures` · `vendor_papic_captures` · `pabati_clips` — all carry `captured_at TIMESTAMPTZ` ⚠ *but see §2.1* |
| Guest → table | `papic_guest_captures.guest_id` → `event_seat_assignments(event_id, guest_id UNIQUE)` → `event_tables.table_label / x_pos / y_pos` |
| Supplier → the moment they made | `event_schedule_blocks.responsible_vendor_ids UUID[]` → `event_vendors.vendor_id`; `actual_start_at` / `actual_end_at` / `run_state` are the tapper's real instants; `lib/moments-from-the-schedule.ts` labels captures by block window |
| The saved theme | `events.role_palette` (JSONB; `reception` = five majors) · `moodboard_theme_name` · `moodboard_theme_description` · `mood_board_updated_at`; per-pillar snapshots in `event_moodboard_saves.palette_snapshot` |
| Road dates | theme: `mood_board_updated_at` · vendor booked: `event_vendors.contract_signed_at` / `status` / `updated_at` · pre-event captures: `captured_at < event_date` · save-the-date + invitation: the site lifecycle |
| Supplier follows | `vendor_follows(follower_user_id, vendor_profile_id, followed_at)` |
| "As featured in" on the portfolio | `/v/[slug]` → `loadVendorFeaturedStories` ✅ **fixed 2026-09-07, PR #5290** — was wedding-only |
| Supplier reach | `vendor_profile_views(vendor_profile_id, event_id, source, utm, viewer_hash, viewed_at)` via `lib/record-vendor-view.ts` ⚠ *see §2.3* |
| Edition number | `editionNo` (count in the awards cycle) + `editionVolume` (Nov 18 → Nov 17) ⚠ *see §2.4* |
| The last word + the song | `events.special_message` · `events.pakanta_song_r2_key` (presigned) |
| The monogram | `events.monogram_text / monogram_color / monogram_motion_key / monogram_font_key / monogram_custom_svg` |
| The 9:16 card | `app/[slug]/recap/_components/save-story-card-button.tsx` → `/api/og/…?format=story` (1080×1920) + `saveImageToDevice` |
| Supplier note + clips | `editorial_vendor_media(vendor_profile_id, event_vendor_id, media_type, boomerang_r2_key, still_r2_key, caption ≤140, moderation_state, hidden_by_couple)` |
| The photo wall | `wall_feed(source_table, source_id, wall_safe_r2_key, caption_text, sort_at, wall_hidden_at)` + `wall_visible_photos(event_id)` |
| Reviews / endorsements | `vendor_reviews(rating_overall, body, event_id)` · `vendor_recommendations(endorsement, event_id)` |
| Publish state | `event_editorial.status ('draft'|'published')` · `published_at` · `edited_by_couple` |
| The chapter cross-link | `creator_chapters(event_id, user_id, status, published_at, embed_url, host_included_at)` |
| Multi-day | `events.event_end_date` ("Last day of a multi-day event (inclusive)"); `multi_day = TRUE` for wedding, travel, reunion, corporate |
| Occasion words | `event_type_profiles.terminology` (`organizer_noun`, `person_a`, `person_b`, `seat_word`, `event_word`, `register`) via `lib/…/event-words.ts` |
| Next-event derivation | `lib/event-anchor.ts` — `ANCHOR_BY_TYPE`, `cadencesForType`, `milestoneAges`, `addYears` |

---

## 2 · The seven that do not exist

### 2.1 · The capture minute is the UPLOAD minute ⛔ blocks the dial
Both Papic write paths default to `NOW()`: `papic_record_guest_capture` has **no `p_captured_at`
parameter**, and the seat path drops `CapturedFile.capturedAtMs` at `papic-sink.ts`'s
`deps.record(...)`. A dial built on this is a chart of **when people had signal**.

**Fix** — follow the existing client-supplied / server-validated `p_geo_*` pattern: add
`p_captured_at` to the RPC, carry `capturedAtMs` through the sink and the offline queue, validate
server-side (reject a future time; clamp to a sane window around the event).
**Owner ruling 2026-09-07:** read it on ingest; **never ask the guest, never surface the mechanism.**

### 2.2 · No live-viewer figure ⛔ blocks "1,140 watching"
Nothing stores it. **Fix:** one nullable `panood_broadcasts.peak_concurrent_viewers int`, filled by
extending the controller's existing during-broadcast poll with
`videos.list?part=liveStreamingDetails`, keeping a running max. Same poll also delivers the
controller's spec'd-but-unbuilt 👁 chip. Add `liveViewersPeak: number | null` to `ImpactMetrics`
(null omits, following its existing convention).

### 2.3 · No story key on a supplier tap ⛔ blocks Featured analytics
`/v/[slug]` maps `src ∈ {editorial, favorites, explore, search}` to `inquiry_source`. **Fix:** link
every supplier from the story as `/v/{slug}?src=editorial&utm=story%3A{event public_id}` through
`VendorCreditChip` — reuse `editorial`, do not invent `src=story`. Copy must say **"how many
reached them"**, never "who tapped them": the analytics model forbids identity and there is a
min-N floor.

### 2.4 · The edition number is recomputed at render
`editionNo` counts weddings in the awards cycle **on every render** — so "No. 1, theirs forever"
is not guaranteed, and for a non-wedding it counts the wrong population.
**Fix:** stamp `edition_volume` and `edition_no` once, on the **first** transition of
`event_editorial.status` to `'published'` (not on `published_at`, which stamps at the first
guests-only share). ⚠ **What the No. counts for a non-wedding story is an owner question** —
see `07` Q5. Deliberately left filtering weddings, with that reason recorded in
`WEDDING_ONLY_BY_DESIGN`.

### 2.5 · No per-layer visibility
`event_editorial.status` is **one audience for the whole story**. The three-layer model needs the
guest layer gated separately. **Fix:** a per-layer flag; guest layer maps to the `event` audience
until `published`. Exclusion server-side, on the viewer classes `/[slug]` already resolves.

### 2.6 · No story cover
The `/realstories` card inherits the living hero (`landing_page_hero_image_url` / `hero_video_r2_key`).
There is **no** story-cover column on `events` — the `showcase_photo_r2_key` hits in the tree are on
**vendor services**, a different table. **Fix:** `events.story_cover_kind` +
`events.story_cover_ref` (an R2 key, or a capture id, or `monogram`), written by the Story Maker.

### 2.7 · No event → event link
No `parent_event_id`, `series_id`, `previous_event_id` or chronicle column exists anywhere in
`supabase/migrations`. "Previously · No. 1" and the back cover's door both need one.
**Fix:** `events.previous_event_id UUID REFERENCES events(event_id)` (nullable, `ON DELETE SET
NULL` — an actor leaving keeps the record). Written only on the host's go-signal tap.

### Bonus · one inbox over four tables
The desk needs a single read across `photo_messages`, `guest_columns`,
`papic_mission_completions` and `editorial_vendor_media`, each with its own status column. **Nothing
new to store** — a view or a loader that unions them with `{source, id, status, arrived_at,
lands_in}`.

---

## 3 · Volume — the read that starves ⛔

✅ **RESOLVED (data layer) 2026-09-09 · PR #5329.** Both timeline reads now bound to
`events.event_date`..`events.event_end_date` (Manila days), via new `lib/story-day-window.ts`; a
new `story_dial_bucket_counts` RPC serves zero-filled per-bucket COUNTs for future bar heights.
⚠ Still open: presigning only the reader's opened bin (no per-bin API route exists — needs the
Phase 2 dial UI, S9) and the RA 10173 consent veto on the RPC's counts (08 step 0.3 / S3).

`data.ts` reads the day timeline as
`.from('papic_photos').order('captured_at', {ascending:true}).limit(EDITORIAL_TIMELINE_PHOTO_CAP)`
with the cap at **48** and **no `captured_at >= event_date` bound**. With ~100 pre-day captures
(prenup, despedida), **all 48 rows are pre-day shots and the day's buckets contain no wedding-day
photo at all.**

The same file records why a bigger read is not the answer: *"presigning 300 URLs to throw 276 away
is the shape that made the gallery slow."*

**Fix:** bound the timeline read to the event's own days; serve per-bar counts from a
**count-by-time-bucket aggregate** (no `generate_series` RPC exists yet — this is new), and presign
only the bin the reader opens. The recap is ISR (`revalidate = 300`), so a per-bar sheet cannot be
served from the page payload.
