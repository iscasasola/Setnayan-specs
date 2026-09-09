# 03 · Data — what exists, and the seven things that do not

**Verify every row before building.** These were read from `origin/main` on 2026-09-07; cite a
greppable symbol, never a line number.

---

## 1 · Exists and is enough

| The story needs | It reads |
|---|---|
| A capture and its time | `papic_photos` · `papic_guest_captures` · `vendor_papic_captures` · `pabati_clips` — all carry `captured_at TIMESTAMPTZ` ⚠ *but see §2.1* |
| Guest → table | 🔴 **CORRECTED 2026-09-09 (S10) — THIS ROW NAMED THE ONE PATH WITH NO ROWS IN IT.** It said `papic_guest_captures.guest_id` → `event_seat_assignments` → `event_tables`. Measured against production: **`papic_guest_captures` holds 0 rows.** Every capture in the database is a `papic_photos` row — which is also the only table `story_dial_bucket_counts` counts, so building the lens on the documented path would have produced a heat counted from a *different population than the bars above it* (two counts of one thing on one page) **and** a plan that can never light. The links that exist on `papic_photos` are `paparazzi_seat_id` → `paparazzi_seats.guest_id` (a roll camera belongs to one guest) and `captured_by_person_id` → `guests.person_id`; either then reaches `event_seat_assignments(event_id, guest_id UNIQUE)` → `event_tables.table_label / x_pos / y_pos`. ⚠ **Neither resolves to a table in prod today**: 14 photographs, 14 with a person, **0** whose person is a guest of that event, **0** seats carrying a guest — the one published story is a `date` with no guest list. Built and guarded in S10; nothing real to light yet. |
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
✅ **RESOLVED 2026-09-09 · PR #5331 (S3 / 08 step 0.3) — and it needed NO COLUMN.**
🛑 **S4: DO NOT ADD A PER-LAYER FLAG. There is nothing left to add here.**

`lib/the-guests-layer-is-theirs-until-you-publish.ts` gates the three layers server-side:
`storyLayerAdmits(layer, status, viewer)`, with the guests' layer mapped to the `event` audience
until `published` and the edition left on `status`. The mapping is **derived, not stored** — it is
total, nobody has asked for a story whose guest layer opens earlier or later than the rule, and a
column would only add a second opinion that can disagree with `status`, plus a backfill. (RULE 0:
a flag/filter flip beats new schema.)

`redactStoryLayers(data, viewer)` takes the withheld layers **out of the payload** — captures,
Kwento, answers, letters, the wall, the day chapters, the cover's counts and the locked close —
before any component is handed them; monotone by construction, like `consent-veto.ts`. Wired into
all three public readers (`EditorialContent`, `/[slug]/print`, and the gallery-anchor probe in
`site-body.tsx`). `drawnBins()` is the only source of bar heights, and a bin after "now" has no
height **for everyone, the host included**.

🔴 **A live leak was found and closed on the way:** the gallery-anchor probe counted photo blocks
~120 lines before the story rendered, and that count decided whether a **Gallery tab appeared in
the menu** — so a stranger before publish was told the guests had been shooting.

✅ **Q1 IS RULED — NO, and 09's gate table has said so since 2026-09-09. DO NOT RE-ASK IT.**
Built to that ruling (no counts, flat baseline) behind one named constant,
`COUNTS_ARE_THE_GUESTS_LAYER` — flipping it would be that one line.
🔴 **This paragraph said "Q1 is NOT answered" until 2026-09-09 (S9), and so did the constant's
own docblock in the shipped file.** The VALUE was right in both places; the sentence beside it
was stale — which is exactly how a settled owner question gets asked a second time.
And `galleryPhotos`/`essayPhotos` merge the couple's own uploads with Papic captures before the
redaction sees them, so both are taken; separating them needs provenance carried at load.

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
`papic_mission_completions` and `editorial_vendor_media`, unioned as
`{source, id, status, arrived_at, lands_in}`.

> 🔴 **CORRECTED 2026-09-09 (S5, PR #5338) — "each with its own status column" and "nothing new to
> store" WERE BOTH FALSE, and false in the dangerous direction.** Measured against production, only
> **two** of the four carried a host decision:
>
> | Source | Host decision | What was actually there |
> |---|---|---|
> | `photo_messages` | ✅ `status` | `pending·approved·rejected·user_deleted` |
> | `guest_columns` | ✅ `status` | the same four |
> | `papic_mission_completions` | ❌ **none** | no status, no `moderation_state`, no hidden flag |
> | `editorial_vendor_media` | ❌ **none** | only `hidden_by_couple`, `DEFAULT FALSE` |
>
> So two of the four things the desk exists to decide had **nowhere to record a decision**, and they
> failed in OPPOSITE directions: a **challenge answer went public the moment the GUEST consented,
> with the host never asked at all**, and a **supplier's frame published itself unless hidden** —
> opt-OUT, the inverse of the desk's own promise (*"nothing a supplier sends appears until you
> accept it"*). ⚠ `hidden_by_couple` was additionally a **gate with no handle**: three readers, zero
> writers, already recorded in `gates-have-handles.baseline.txt`. The couple's "hide this from my
> story" control had never existed.
>
> **S5 therefore SHIPPED A MIGRATION** (`20271214724787`) adding `status TEXT NOT NULL DEFAULT
> 'pending'` to both, with the host's decision required by the public readers. Both are born
> pending, so both sources moved from *published unless stopped* to *published only if chosen* —
> monotone, it can only ever show less. Safe by arithmetic: all four tables held **0 rows**.
>
> 🪤 **And a table-level grant audit lied on the way.** `role_table_grants` reports `authenticated`
> holding **no UPDATE** on `editorial_vendor_media`; the grant is held **per column, on all 14**, so
> the table reads as closed while it is open (the same shape as the Papic INSERT hole where
> `has_table_privilege` answered FALSE over 39 column grants). **Read `column_privileges`, never
> `role_table_grants`, when the claim is about what a caller may write.**

---

## 3 · Volume — the read that starves ⛔

✅ **RESOLVED (data layer) 2026-09-09 · PR #5329.** Both timeline reads now bound to
`events.event_date`..`events.event_end_date` (Manila days), via new `lib/story-day-window.ts`; a
new `story_dial_bucket_counts` RPC serves zero-filled per-bucket COUNTs for future bar heights.
⚠ Still open: presigning only the reader's opened bin (no per-bin API route exists — needs the
Phase 2 dial UI, S9). 🔴 **CORRECTED 2026-09-09 (S9, PR #5342) — THE CONSENT VETO DID *NOT* LAND IN PR #5331, AND
THIS LINE SENT A READER PAST THE DEFECT.** `drawnBins()` applies the LAYER and the
has-it-happened-yet check; it has no veto in it, and the register's own S9 row says so.
Route the per-bucket counts through `drawnBins()` — that part is right — but the veto is a
SEPARATE subtraction, and it is exact rather than blanket: a vetoed capture with a baked
blurred stand-in IS on the page and keeps its height; only the ones `publicKeyForCapture`
resolves to null come off, and an unresolvable veto flattens every bar. ✅ Built in
`spine-data.ts` + `subtractWithheldFromBins` (PR #5342).

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
