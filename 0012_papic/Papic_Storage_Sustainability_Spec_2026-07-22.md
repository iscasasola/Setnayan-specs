<!-- Council-produced (ground+design+red-team, 8 agents), 2026-07-22. KEY: cold tiering (R2-IA/B2) is FILED-NOT-BUILT — retrieval fees make it net-costlier for viewable objects. The forever-affordability win (P17->P4.14/event/yr, 13x fleet reduction) comes from clip web-copy transcode + reliable drop on R2-STANDARD (PR-1..PR-5). Companion to Papic_One_Pool_Model_Spec_2026-07-22.md. -->

# Papic Storage-Sustainability Spec — Build-Ready (FINAL)

**Goal:** every Papic memory survives forever, at viewable resolution, for a one-time price — with no gallery ever going dark and no only-copy ever deleted unverified.

**Grounding:** designed against the real code paths supplied (I did not re-derive them). Base: `/Users/icecasasola/setnayan-platform-recovered/apps/web/` · migrations `supabase/migrations/`.

**Headline correction from red-team (do not soften):** the forever-affordability win is **~95% captured by clip-transcode + the full-res drop on R2-Standard alone** (`₱17.0 → ₱4.14/event/yr`). The hot→cold tiering (R2-IA / B2) is the **least** valuable lever and the **most** dangerous surface. R2-Infrequent-Access is **net more expensive** for objects on the viewable path because it bills a per-GB retrieval fee on every read — the exact reads a wedding gallery is built to serve forever. **Therefore the tiering machinery is fully specified below but filed-not-built; "ship PR-6 first" is rejected.** The affordable-forever guarantee is delivered by PR-1..PR-5, all on R2-Standard.

---

## Core architecture decision (the spine)

**The forever-copy is the cheap derivative, not the original.** Photos already have one (`display_r2_key`, AVIF ≈ 0.32 MB). Clips do **not** — their `display_r2_key` is a **poster still** (`papic-derivatives.ts:225` sets `displayKey = posterRef`), and the ~8 MB raw video plays verbatim and never drops. So the single highest-leverage fix is **give every clip a real ~0.5 MB playable web-copy** (`clip_web_r2_key`), after which clips join the exact 90-day drop photos already use and the forever pool collapses to ~0.36 GB/event — **81% of which is today wasted on undropped raw clips.**

Two guards, kept strictly separate:

- **Guard A — memory-preservation (new, universal, hard):** never delete a full-res original or raw clip unless a **verified, durable, playable** derivative exists. Not "a column is non-null" — the object must be **HEAD-confirmed to exist and exceed a byte floor**. This is the only-copy-can't-vanish guarantee.
- **Guard B — full-res custody (already built, keep, extend to clips):** when a Drive is connected, defer until the high-res copy is *confirmed* (`isDriveDeferred`); when Keep-Full-Res (`HIGH_RES_ARCHIVE`) is purchased, skip. Clips **must** be run through this guard too, not just Guard A.

`not_connected` events still drop the **original** at 90 d (Guard A preserves the viewable memory) — that is the free-tier economics. Full-res recoverability is what Drive / Keep-Full-Res buys.

---

# Part 1 — The four-piece architecture

## Piece 1 — Reliable full-res purge (photos AND clips, no orphans, no unverified deletes)

### What changes
- **Extend the sweep to clips.** Today `papic-fullres-drop.ts:207/216` filters `photo_type='photo'` / `media_type in (null,photo)`. Add a **clip branch** deleting the raw video `r2_object_key` — same `resolveOriginalRef`, same `full_res_dropped_at` stamp.

### Guard A for clips — the poster trap (BLOCKER)
**Do NOT reuse `isEligibleForDrop` for clips.** A clip's `display_r2_key` is its **poster still**, which is *always* populated — so the existing `!row.display_r2_key` check passes for every clip even when `clip_web_r2_key IS NULL`. Reusing it would delete the ~8 MB motion clip while only a single still survives.

Clip eligibility, as its own predicate in `papic-fullres-drop-core.ts`:
```
clipEligibleForDrop(row):
  clip_web_r2_key IS NOT NULL
  AND clip_web_r2_key != poster_r2_key          # poster may never masquerade as the web-copy
  AND clip_web_r2_key != display_r2_key          # same, display==poster for clips
  AND clip_web_bytes >= CLIP_WEB_MIN_BYTES        # persisted at upload; refuse if absent
  AND HEAD(clip_web_r2_key).size == clip_web_bytes AND content-type video/*   # custody proof
  AND NOT isDriveDeferred(row.r2_object_key, driveState)   # Guard B, see below
  AND NOT sample/ AND NOT already dropped
```
**Test (required):** a clip with `clip_web_r2_key IS NULL` but a present `display_r2_key`/`poster_r2_key` is **INELIGIBLE**.

### Guard A must verify the object, not the column (BLOCKER)
The clip web-copy is produced **client-side** (ffmpeg.wasm) and uploaded via a separate signed PUT, then the column is written — two non-atomic ops on an unreliable device. A written key can point at a failed / truncated / 0-byte object. **Before dropping any clip raw, HEAD the `clip_web` object** (size > floor, `content-type video/*`) using the existing `resolveOriginalRef` + R2 client. Persist `clip_web_bytes` at upload and refuse to drop if bytes are absent or below floor. **Never trust a key column alone as custody proof for a client-produced derivative.** (Photos are server-produced so key-write follows a successful PUT; the HEAD is cheap insurance there too but load-bearing for clips.)

### Guard B for clips — explicit wiring (HIGH)
Guard A does **not** consult Drive state. Each clip candidate **MUST** be run through `isDriveDeferred(clip.r2_object_key, driveState)` exactly like photos, and `loadEventDriveCopyState`'s `confirmedKeys` **MUST** include clip keys (it already reads `drive_copy_artifacts`, which holds clip rows). **Test:** connected Drive + unconfirmed clip copy ⇒ clip **DEFERS**.

### Reference / orphan handling — nothing gets nulled
- **`r2_object_key` stays populated.** It remains the Drive-confirm match key and history. We only stamp `full_res_dropped_at`; the byte-object is deleted by design, and the timestamp is the "this key is dead" signal.
- **Polymorphic `(source_table, source_id)` pointers untouched** — `wall_feed` (serves its own `wall_safe_r2_key`), `photo_tags`, `photo_messages` (Kwento), `person_life_story_items`. The drop keeps the row.
- **Do NOT build row-delete under this plan.** A hard-delete of the papic *row* would orphan all FK-less polymorphic pointers; any future row-purge must cascade-null them first.

## Piece 2 — Drive-offload of full-res + clips

Clips are **already pushed** to Drive at capture (`actions.ts:576`, `guest-capture/route.ts:381`, full-res bytes, `copied_high_res=TRUE`). The gaps are recovery and the no-Drive path.

- **No-Drive fallback — decision: keep the derivative forever on R2-Standard, nudge, offer paid.** Do **not** force a Drive connection. Default free-forever = the ~0.36 GB derivative pool on R2-Standard (free egress, no retrieval fee). Keep the existing ~day-76 warning email (`daily-email-jobs.ts:352`, `WARN_LEAD_DAYS=14`) as the nudge; route wanters to paid Keep-Full-Res / Alaala.
- **Autonomous Drive-copy retry sweep (HIGH — silent leak fix).** A file at `attempt_count>=5` (`drive-copy.ts:65,191`) is stranded forever **and** correctly deferred forever by Guard B = a permanent hot leak. Add `claimPeriodicJob('papic-drive-copy-retry', …)` calling `runDriveCopyBatch` with exponential backoff past `MAX_ATTEMPTS` and a ceiling, and **surface the top stuck events to admin** (upgrade the `console.warn` at `fullres-drop.ts:333`).
- **Extend manual release to guest captures.** `photo-delivery-release.ts:61` queries `papic_photos` only; add `papic_guest_captures` so operators can backfill guest clips/photos before the (guest-inclusive) drop runs.

## Piece 3 — Clip web-copy transcode (~0.5 MB forever-copy)

**Vercel has no ffmpeg** (`papic-derivatives.ts:194`, `video-compress.ts:1`); Cloudflare Workers have no native ffmpeg either. So:

- **New clips: client-side transcode at capture** reusing `lib/video-compress.ts` (the ffmpeg.wasm path already shipped for Save-the-Date). A 5-second clip is tiny; the device produces the web-copy alongside the raw and uploads both. Target: short-side ≤ 480 px (9:16 → 480×854), H.264 baseline, CRF ~30, AAC 64 k → ~0.3–0.6 MB. Write `clip_web_r2_key` + `clip_web_bytes`.
- **Backfill + fallback: an off-Vercel transcode worker** for the existing raw-clip backlog **and** every client-transcode failure. Cheapest buildable: a Cloudflare Queue consumer running ffmpeg in a Cloudflare Container, or the Hetzner VM pool the corpus already names as render fallback. Pulls raw from R2 (free egress), writes `clip_web_r2_key`, enqueued from a periodic sweep over `clip_web_r2_key IS NULL`.
- **Client success is NOT ~100% (MEDIUM).** ffmpeg.wasm on low-end Android at a live event on battery has a material failure fraction. Size the backfill worker for a realistic **20–40% client-failure rate**, not just the one-time backlog. At 150 clips/event × 10 k events = 1.5 M clips/yr; 20% = 300 k server transcodes/yr. Add a telemetry counter for the client-vs-server split.
- **Transcode-permafail is a dead-letter, not a silent hot leak (MEDIUM).** A clip that fails client transcode AND dead-letters in backfill never gets a web-copy → never drops → never tiers → sits hot forever. **Surface permafail clips to admin** (like the drive stuck-events warning), keep the raw as the only viewable copy (or push to Drive), and **count that residual in the cost model** — do not assume 100% transcode coverage.

## Piece 4 — Hot-to-cold tiering that stays viewable — SPECIFIED, FILED-NOT-BUILT

> **Economic verdict (BLOCKER/HIGH, do not soften):** R2-IA and B2 are **rejected as cost-savers for objects on the viewable path.** IA revokes R2-Standard's free reads and bills a per-GB Data-Retrieval fee (~$0.01/GB ≈ ₱0.56/GB) on **every** read plus 2× Class-A/B ops. The forever-copies are read repeatedly by design (gallery, public `/[slug]`, Life-Flash, reel re-render), so IA is **net more expensive** than leaving them on Standard. See the worked example in Part 2. **The tiering machinery below is architecture-on-file; it is not shipped now and is not a cost optimization at current scale.**

The architecture is specified so it can be built **if and only if** a measured, low-read cold tail justifies it — with the correctness guards baked in so a future build cannot lose an only-copy.

### Schema (migration on file, applied only with PR-6)
`storage_tier TEXT DEFAULT 'hot' CHECK (storage_tier IN ('hot','cool','cold'))` + index `(storage_tier, captured_at)` on `papic_photos` and `papic_guest_captures`. The **authoritative** location stays encoded in the ref scheme so the resolver is self-describing; `storage_tier` is only the mover's cursor.

### Provider-aware resolver (the unblock)
The `r2://bucket/key` ref encodes a bucket but **not** an endpoint/provider, and only 5 R2 buckets resolve (`uploads.ts:69`); there is exactly **one** S3 client on one endpoint (`r2.ts:76`).
- Extend the ref scheme: `r2://` (hot), `r2ia://` (cool), `b2://` (cold). `parseStoredAsset` (`uploads.ts:53`) recognizes all three; anything else still downgrades to `legacy_url`.
- `r2.ts` `getR2Client` → **`getStorageClient(provider)`**: R2 and R2-IA share endpoint/creds (different bucket) — trivial; B2 gets a second S3 client at `s3.<region>.backblazeb2.com`. Presign stays a plain `GetObjectCommand` (B2 is S3-compatible) — **no thaw/restore state machine.**

### Mover invariant — verify-before-delete of the last forever-copy (BLOCKER + HIGH)
After the full-res drop, the tiered derivative is the **only** surviving copy of the memory. `r2Copy` (`r2.ts:254`) is same-bucket only, so the mover is all-new cross-bucket/cross-provider GET+PUT+DELETE. It **MUST** be strictly ordered, verified, idempotent:
```
1. COPY derivative → cold bucket
2. HEAD/GET-verify cold object exists, byte-count matches source, (ideally) checksum matches
3. DURABLY COMMIT the repointed key (display/thumb/clip_web) + storage_tier in ONE transaction
4. ONLY THEN delete the hot object
On ANY verify failure: keep the hot object, leave storage_tier unchanged, re-run later.
```
This is **Guard A parity for tiering** — the same "unknown → defer, never delete; rather pay another week of R2 than lose the copy" philosophy already coded in `papic-fullres-drop-core`. A truncated cold copy or a hot-delete-before-commit permanently loses a wedding photo; the mover must make that unreachable.

### Serving CSP + CORS for a new origin (BLOCKER — B2 precondition)
B2 presigned GETs come from `s3.<region>.backblazeb2.com` — a **different origin**. Before any `b2://` object is served:
- Add the B2 endpoint origin to the app **CSP** `img-src` / `connect-src` / `media-src` (a missing origin is a hard browser block → blank tiles).
- Replicate the hot bucket's **CORS** policy (allowed origins, GET, Range) onto the **B2 bucket AND the new R2-IA bucket** — the client-side reel render (`guest-stories`) fetches the presigned image into a canvas; a missing CORS header **taints the canvas** so `toBlob`/export throws `SecurityError` → "Could not load a tagged photo" and the whole reel dies even though the bytes are reachable by curl.
- **Integration test:** render a reel from a tiered object. (R2-IA shares the R2 origin so CSP is fine, but confirm CORS carries to the new bucket.)

### Viewability + CDN (the stable media route)
Because only the small forever-copies move, the tiered object is exactly the ~0.32 MB AVIF the gallery already serves (`papic-gallery.ts:135`). Add a stable media route `app/papic/media/[...key]/route.ts`:
- It **STREAMS bytes** from the resolved provider — **it must NOT 302-redirect to a presign** (HIGH). A cached-immutable redirect pins a soon-dead signed URL for a year; OG/social crawlers and any long-lived cache then serve a broken preview. Streaming lets immutable caching be safe.
- **The immutable/CDN topology is a hard precondition for any IA or B2 read** — free egress and cheap reads exist **only** when Cloudflare (Worker/CDN) is in the delivery path. A Vercel route streaming B2 pays **Vercel** bandwidth (not free, not the Bandwidth-Alliance hop); a browser-direct B2 presign bypasses Cloudflare so B2 bills normal egress. To actually get free egress + caching, front B2 with a **Cloudflare Worker/CDN route, not a Vercel route.**
- **Do not pin `immutable` on non-content-addressed keys (MEDIUM).** The keys are path-derived (`derivatives/${originalKey}.display.avif`), not content hashes. A re-crop / re-moderate / re-transcode at a stable key would be invisible for up to a year. Either put a **content-hash/version token in the URL** (regeneration mints a new URL) or use a shorter `max-age` + **ETag** revalidation.

---

# Part 2 — Cost model

R2-Standard **₱11.5/GB-yr** (corpus, free egress, no retrieval fee) · R2-IA **≈₱7.0/GB-yr storage** *+ ₱0.56/GB per read + 2× ops* · B2 **≈₱4.2/GB-yr** *+ egress unless CF-proxied + Class-B download txns*. Model event = **800 photos @ 4 MB, 150 clips @ 8 MB (5 s)**.

| Bytes per event | GB |
|---|---|
| Hot window (0–90 d): full-res 3.2 + photo-deriv 0.28 + raw-clip 1.2 + clip-web 0.08 | **4.76** |
| **Forever pool (post-90 d): photo-deriv 0.28 + clip-web 0.08** | **0.36** |

**Forever ₱/yr per event (storage-only headline):**

| Scenario | Forever GB | R2-Std |
|---|---|---|
| Naive (no drop, no transcode) | 4.68 | ₱53.8 |
| **Today's actual** (photos drop, clips don't) | 1.48 | ₱17.0 |
| **This plan** (drop + clip transcode, on R2-Standard) | 0.36 | **₱4.14** |

**Clips dominate.** In today's actual state the 1.2 GB of raw clips is **81%** of the forever pool despite far fewer objects than photos. The clip transcode (1.2 GB → 0.08 GB) is the single biggest lever — **it does more than the photo drop and the B2 move combined.** `₱17.0 → ₱4.14/yr` from transcode + clip-drop **on R2-Standard, with zero tiering infra.**

### Why IA/B2 do NOT lower the real bill for viewable objects (BLOCKER)
The storage-only table above is a **trap** — it omits retrieval fees, and forever-copies are read-forever, not archival.

- **R2-IA worked example:** moving the 0.36 GB pool to IA saves ~**₱1.6/event/yr** in storage. One editorial page shared on Facebook — 40,000 views × 18 images × 0.32 MB ≈ **230 GB retrieved** × ₱0.56 = **~₱129 in retrieval for one event in one week** — vs **₱0** on R2-Standard. That is ~70–80× the storage "saving." IA is **net more expensive** on the viewable path, and the cache route only rescues *hot/popular* objects — the forever tail is cold-by-definition, so its cache-miss rate (and thus retrieval billing) is highest exactly where IA sits.
- **R2-IA 30-day minimum-storage-duration (MEDIUM):** an object deleted/moved before 30 days is billed the full 30. Normal 90-day-age entry is safe, but **RA 10173 right-to-erasure** hard-deletes a just-tiered object days later → full 30-day charge. Another reason to keep the small forever-copies on Standard (no minimum, no retrieval).
- **Mover op costs (MEDIUM):** every move is cross-bucket GET+PUT+DELETE (no server-side copy), at IA's 2× Class-A rate for moves into IA — ~₱0.5/event one-time vs ~₱1.6/yr saving, plus the weekly job re-scans both tables (Class-B) whether or not anything moves. For an object's first year-plus the move ops can exceed the storage saved.
- **B2 threshold + free egress are both wrong (HIGH):** B2 storage beats IA per-GB at **all** volumes — there is no storage crossover TB; the only crossover is fixed cost. IA→B2 saves ~₱2.8/GB-yr, so even "tens of TB" (10–40 TB) yields only ~₱28k–112k/yr — before the second-provider build + permanent ops + cross-provider mover risk. The 10 k-events / 3.6 TB case saves just **₱10.3k/yr** (₱25.8k→₱15.5k), which does not fund a new provider integration. And "free egress via Bandwidth Alliance" holds **only** when Cloudflare proxies B2; the shipped serving path presigns S3 GETs direct-to-browser → B2 bills egress and B2 ends up **costing more** than the IA it replaced.

**Corrected staging trigger:** B2 is justified at a **measured forever pool of hundreds of TB to low-PB** (not "tens of TB"), **and** only with CF-proxied immutable serving proven live, **and** only after access telemetry shows low retrieval exposure.

### Amortization — the one-time price covers forever
The free forever-copy costs **₱4.14/event/yr on R2-Standard** (the honest, retrieval-free number). A single ₱2,999 Papic order funds it **≈725 event-years**. A ₱2,999/yr Keep-Full-Res covers even the 3.2 GB full-res retention (₱36.8/yr) **~80×**. The one-time price trivially amortizes storage — **without** any tiering.

### Aggregate @ 10,000 events/yr (forever pool after year 1), R2-Standard
| | Pool | R2-Standard |
|---|---|---|
| This plan (drop + transcode) | **3.6 TB** | **₱42.4 k/yr** |
| Naive | 47.9 TB | ₱551 k/yr |

The transcode alone keeps the fleet pool at **3.6 TB** vs a naive 47.9 TB — a ~13× reduction that **defers the entire B2 question by years**, which is the real reason B2 is PR-7 (filed), not PR-1.

---

# Part 3 — The always-viewable guarantee

**Invariant:** every read path resolves to a **playable/viewable derivative** whose bytes are proven to exist before any original is deleted; a render always gets a real input; a share card survives crawler re-fetch.

### Two disjoint resolvers — never conflate still vs video (HIGH)
`display_r2_key` is a **poster still** for clips but a real image for photos, and `clip_web_r2_key` is a **video**. One chained resolver would feed an `<img>` an `.mp4` the moment a web-copy lands (broken image icon in moderation, on `/[slug]`, in magazine renders) or feed a `<video>` a still. Split them and repoint each surface to the one matching its element:

```
resolveStillRef(row)   # ALWAYS an image → for <img>, OG image, thumbnails
  photo: thumb_r2_key ?? display_r2_key ?? r2_object_key
  clip : thumb_r2_key ?? poster_r2_key            # never r2_object_key (that's a video)

resolvePlayRef(row)    # ALWAYS a video → for <video>, reel input
  clip : clip_web_r2_key ?? r2_object_key         # no poster in this chain
```
Live in `lib/papic-display-ref.ts`.

### Repoint requires SELECT changes, not just a call-site swap (MEDIUM)
Surfaces often `SELECT` only `r2_object_key` (verified: `guest-stories` `readTaggedPhotos` selects `photo_id, r2_object_key` / `capture_id, r2_object_key`). A resolver cannot prefer a column that isn't in the row — a naive swap silently returns `r2_object_key` and the reel still 404s after the drop. **For every repointed surface, add `display_r2_key`/`thumb_r2_key`/`poster_r2_key`/`clip_web_r2_key` to the DB SELECT** and pass the full row. Test: drop an original in a fixture; assert each surface still resolves.

### Full read-path inventory to repoint (photos **and** clips)
Display/still surfaces (→ `resolveStillRef`):
- `app/[slug]/_components/editorial/data.ts:858/1072` (public `/[slug]` — highest value)
- `lib/life-story-moment-graph.ts:603/613` → `app/dashboard/(account)/life-flash/page.tsx:135/200`
- `app/dashboard/[eventId]/studio/papic/moderation/_components/kwento-queue.tsx:52`
- `app/dashboard/[eventId]/studio/papic/magazine/route.ts:76/84`
- `app/dashboard/(account)/library/_data/editorials.ts:209`
- `app/admin/user-reports/page.tsx:162`

Play surface (→ `resolvePlayRef`):
- `lib/guest-stories.ts:123/174` (reel render input)

**`lib/alaala-orb.ts:87–113` (BLOCKER — the "safe" surface that isn't).** It selects `papic_guest_captures` clips and presigns the **raw video `r2_object_key`** directly (the comment states it deliberately plays the raw, not the poster). The design's assumption that alaala-orb is "safe because clips never drop" is **invalidated the moment PR-4 makes clips droppable** — after a public-showcase clip ages past 90 d its raw is dropped and the marketing-homepage orb 302s to a deleted object → dark orb on the public front page. **Add alaala-orb to the repoint (`resolvePlayRef`), and re-audit EVERY clip `r2_object_key` presign fleet-wide** — the "clips never drop" assumption is void everywhere after PR-4.

### Presign-boundary hardening (MEDIUM — belt & suspenders)
The resolver is opt-in; `presignDisplayUrl` still blindly signs whatever key it's handed, and `r2_object_key` stays populated as a live-looking dead pointer. **Harden at the presign boundary:** a ref whose row has `full_res_dropped_at` set (or that is a raw original) is treated as an **error/auto-fallback**, not silently signed — or make `resolveStillRef`/`resolvePlayRef` the only sanctioned entry and **lint against direct `r2_object_key` presigns.** This catches missed and future surfaces (the corpus already had ~8 live for photos).

### Outbound full-res download fallback — provider-aware (HIGH)
`save-photo/route.ts` and `me/[token]/photo/route.ts` stream `r2_object_key` bytes via the single-endpoint `getR2Client()` → 404 after the drop, and → 404 again for any derivative once tiering moves it off the R2 endpoint. Fix:
- If `full_res_dropped_at` set → redirect to Drive (`drive_file_id`) when present, else **stream the derivative** with a `X-Full-Resolution: archived` header.
- **Route every outbound stream (both routes + the fallback) through the provider-aware `getStorageClient(provider)`**, never `getR2Client()`, so a tiered derivative is still reachable.

### OG / social share durability (HIGH)
The public `/[slug]` OG:image resolves via `displayUrlForStoredAsset` → 24 h presign. Crawlers (Facebook, iMessage, Twitter) cache and re-fetch on their own schedule, carry no auth, and choke on expiring signed URLs → broken preview after ~24 h regardless of tiering. **OG images (and all crawler-fetched media) must point at the stable media route, and that route must STREAM bytes (never 302-to-presign).** Land the streaming media route **before or with** the public-page repoint — not as a late PR-6 dependency.

### Render input guarantee
A reel render (`guest-stories`) validates template-unlocked + photos-belong-to-event, then loads inputs via `resolvePlayRef`/`resolveStillRef` against SELECTs that include the derivative columns. Because Guard A refuses to drop a raw until a **verified** web-copy exists, and the mover refuses to delete a hot object until the cold copy is **verified + committed**, the render input always resolves to real bytes. The reel's canvas fetch is CORS-safe on every tier (CSP + CORS precondition above).

---

# Part 4 — Ordered, flag-gated PRs with file touch-points

> **Scope discipline (HIGH):** PR-1..PR-5 capture ~95% of the ₱ win with **zero tiering infra**, all on R2-Standard. **Stop there.** PR-6/PR-7 are **specs, filed-not-built**, revisited only when the forever pool is measured in multi-TB (PR-6) / hundreds-of-TB (PR-7) **and** access telemetry proves low retrieval exposure. This matches the corpus "file, don't build until non-zero" discipline. Current scale: 63 events, ~13 photos, forever pool ≈ 0.

Each PR ships behind a flag; migrations land before feature code; RLS at `CREATE TABLE` time.

**PR-1 — split resolvers + repoint every read path (safety, no schema, ship first).**
Closes a bug **already live for photos**. New `lib/papic-display-ref.ts` (`resolveStillRef`, `resolvePlayRef`). Add the derivative columns to each surface's SELECT. Repoint: `app/[slug]/_components/editorial/data.ts`, `lib/guest-stories.ts`, `lib/life-story-moment-graph.ts`, `.../moderation/_components/kwento-queue.tsx`, `.../magazine/route.ts`, `app/dashboard/(account)/library/_data/editorials.ts`, `app/admin/user-reports/page.tsx`, **`lib/alaala-orb.ts`**. Add `full_res_dropped_at` fallback (provider-aware) to `save-photo/route.ts` + `me/[token]/photo/route.ts`. **Land the streaming stable media route `app/papic/media/[...key]/route.ts` here** and point OG images at it. Presign-boundary hardening + lint rule.

**PR-2 — clip web-copy at capture.** Migration `papic_clip_web_copy.sql` (`clip_web_r2_key`, `clip_web_bytes` on `papic_photos` + `papic_guest_captures`). `app/papic/actions.ts` + `app/api/papic/guest-capture/route.ts` produce/upload the ~0.5 MB copy via `lib/video-compress.ts`, persist `clip_web_bytes`. `lib/papic-gallery.ts` serves `clip_web_r2_key` as `playUrl` when present, raw as fallback.

**PR-3 — backfill transcode worker + jobs table.** Off-Vercel worker (Cloudflare Container/Queue or Hetzner) + `papic_clip_transcode_jobs` + `claimPeriodicJob('papic-clip-transcode', …)` over `clip_web_r2_key IS NULL`. HEAD/size/codec verification before writing the key. **Dead-letter policy + admin surfacing** for permafail clips. Sized for a 20–40% client-failure rate, not just backlog. Telemetry: client-vs-server transcode split. **Backfilled clips get a grace window (MEDIUM):** a clip already >90 d old becomes drop-eligible the instant the key is written. Gate backfill drops on a `web_copy_verified_at` timestamp **plus a minimum grace period** (e.g. droppable only N days after `clip_web` was written) so a bad backfill transcode can't convert straight to raw loss.

**PR-4 — extend the drop to clips + Guard A + Guard B wiring. THE COST WIN.** `lib/papic-fullres-drop.ts` + `-core.ts`: new `clipEligibleForDrop` predicate (poster-trap guarded, HEAD-verified, byte-floored); clip candidate query; **each clip run through `isDriveDeferred`** with `confirmedKeys` including clip keys; delete raw clip `r2_object_key`, stamp `full_res_dropped_at`. Guard B untouched for photos. Tests: (a) null `clip_web_r2_key` + present poster ⇒ INELIGIBLE; (b) connected Drive + unconfirmed clip ⇒ DEFERS; (c) `clip_web` HEAD 404/undersized ⇒ INELIGIBLE.

> **✅ BUILT 2026-07-22 (shipped as the task's "storage PR-2", = this spec's PR-4). Two owner-facing deltas from the text above:**
> 1. **Go-live gate = a NEW env flag `PAPIC_CLIP_DROP_ENABLED` (OFF by default),** separate from the existing `PAPIC_FULLRES_DROP_ENABLED` (which is ON for photos). With the clip flag unset the sweep never even QUERIES clips → merging is data-safe (migrations auto-apply, so the gate is a flag, not "hold the migration"). Flipping `PAPIC_CLIP_DROP_ENABLED='true'` is the deliberate go-live switch. The master kill-switch still forces dry-run for everything.
> 2. **Fresh-grace is measured on the R2 object's `LastModified` (web copy must be ≥ `CLIP_WEB_DROP_GRACE_DAYS = 7` old), NOT a `web_copy_verified_at` DB column** (the provisional PR-3 mechanism below). This needs no new column and no capture-code change, and is strictly more robust — it gates on the real object's age, so a truncated/late backfill PUT today cannot drop today even if `captured_at` is already >90 d. The custody HEAD also requires `size === clip_web_bytes` (truncation catch) + `content-type video/*`. New `lib/r2.ts` `r2Head()`; summary adds `clipDropEnabled`/`clipsDropped`/`clipWebUnverified`. Tests (a)/(b)/(c) all landed, plus a DB test proving the drop UPDATE touches only `full_res_dropped_at`.

**PR-5 — Drive resilience + retention-lapse safety.** `lib/papic-drive-copy-retry.ts` (`claimPeriodicJob`, backoff past `MAX_ATTEMPTS`, ceiling, admin surfacing). Extend `lib/photo-delivery-release.ts` to `papic_guest_captures`. Codify the no-Drive fallback (keep-derivative-on-R2-Standard + nudge + paid route). **Retention buyer lapse (HIGH):** when `HIGH_RES_ARCHIVE` entitlement expires, an already->90-day original must **not** transition straight to deleted. On expiry, stamp a **fresh grace deadline** and **re-send the pre-drop warning**; block the drop until a new lead-time window elapses, with a Drive/renew offramp. A paying customer's full-res must never vanish in one silent sweep the day their SKU lapses.

> **✅ BUILT 2026-07-22 (shipped as the task's "storage PR-4", = this spec's PR-5). Three deltas from the text above:**
> 1. **Retry sweep:** `lib/papic-drive-copy-retry.ts` + pure `-core.ts` — `claimPeriodicJob('papic-drive-copy-retry', DAILY_GAP_MS)` from admin `after()`, exponential backoff (30 m·1 h·2 h·4 h… capped 24 h) up to `DRIVE_COPY_RETRY_CEILING=10` (above the batch's `MAX_ATTEMPTS=5`). `runDriveCopyBatch` gained backward-compatible `attemptCap`/`retryDue` params. Admin surfacing = `listStrandedDriveCopies()` rendered on `/admin/papic-storage` + a structured `console.warn`. Guest-capture release shipped via migration `20270910499209` (widen `photo_delivery_artifacts.source_table` CHECK to also admit `papic_guest_captures`).
> 2. **Retention-lapse GENERALIZED (not a bespoke SKU-expiry hook):** instead of a `HIGH_RES_ARCHIVE`-specific "on expiry stamp a fresh grace", the drop sweep now gates **every** no-Drive (`not_connected`) original on a **proven warn + grace** — droppable only once `events.full_res_drop_warned_at` is set AND `NO_DRIVE_DROP_WARN_GRACE_DAYS=7` elapsed (`noDriveDropAllowed`, `heldNoDriveUnwarned` counter). This SUBSUMES the lapse case: a lapsed Keep-Full-Res event (warn stamp null while the SKU was active → skipped by the warn job) is HELD on lapse until the now-eligible ~day-76 nudge lands. Gate behind `PAPIC_DROP_REQUIRE_WARN` (safe-default ON). The day-76 nudge (`runPapicDropWarning`, already free/no-upsell) was extended to cover aging clips too (gated on `PAPIC_CLIP_DROP_ENABLED`).
> 3. **The "paid route" in the no-Drive fallback is RETIRED (owner 2026-07-17, #3523) — NOT reintroduced.** The fallback is download-in-window / connect-Drive / else hold-and-warn, all free.

**PR-6 — [FILED-NOT-BUILT] tiering to R2-IA.** Migration `papic_storage_tier.sql`; `r2ia://` in `parseStoredAsset`; `getStorageClient(provider)`; `lib/papic-storage-tiering.ts` mover with the **copy→verify→commit→delete** invariant; content-addressed/ETag media caching; **CORS replicated to the IA bucket**. **Do not build as a cost-saver** — IA's per-GB retrieval fee makes it net-more-expensive for viewable objects. Build only for a **measured zero-read cold tail**, gated on last-viewed (not age alone), with the immutable CF cache route proven by cache-hit telemetry first.

**PR-7 — [FILED-NOT-BUILT] B2 cold tier.** B2 S3 client + `b2://` scheme; mover cool→cold. **Hard preconditions:** CSP origin added; CORS on B2 bucket; **Cloudflare-proxied immutable serving** (not a Vercel route) so free egress actually applies; reel-render-from-tiered-object integration test green. **Trigger: measured forever pool in the hundreds of TB** (not tens), with a stated annual-saving floor exceeding the ops budget.

**PR-8 — cost/telemetry (any time).** Extend `lib/papic-storage-telemetry.ts` for per-tier bytes, **modeled retrieval/op cost** (reads × size × per-GB retrieval + per-op), and projected ₱/yr; admin surface. Feed the read-frequency signal that gates any future PR-6/PR-7 move.

---

# Part 5 — Staging summary

- **Now (PR-1..PR-5):** everything on **R2-Standard**. Free egress, no retrieval fee, no minimum-duration. Forever pool ~0.36 GB/event @ ₱4.14/yr. This is the affordable-forever guarantee — **delivered without tiering.**
- **R2-IA (PR-6):** filed. **Rejected as a cost optimization for viewable objects** — only ever for a measured zero-read tail, gated on last-viewed, behind proven CF caching. Not "ship first."
- **B2 (PR-7):** filed. Trigger corrected from "tens of TB" to **hundreds of TB / low-PB**, with CF-proxied serving as a hard precondition for free egress.

---

# Part 6 — Residual risks + owner decisions

### Residual risks (accepted / to monitor)
- **Cold-read latency (MEDIUM):** if PR-6/PR-7 ever ship, the first viewer after a tier move (or after a cache eviction) pulls cold from IA/B2 — a gallery = dozens of concurrent cold reads, worse TTFB on B2 cross-region for APAC. Mitigate by keeping thumbs as the tile ref, optional first-access CDN warm, and preferring IA (same-region) over B2 for anything viewed with any frequency. Documented, not blocking, because tiering is filed.
- **Transcode-permafail residual (MEDIUM):** a small population of clips (old browsers, corrupt inputs) may never get a web-copy → stay hot. Handled by dead-letter + admin surfacing (PR-3); **counted in the cost model, not assumed away.**
- **Immutable-cache staleness:** any regeneration at a stable key is invisible under `immutable`. Handled by content-hash/version token or ETag in the media route.
- **Dangling `r2_object_key` by design:** the column stays populated post-drop; correctness depends on `full_res_dropped_at` being honored at every presign. Presign-boundary lint + hardening is the backstop; a future row-delete would orphan polymorphic pointers and is explicitly out of scope.

### Owner sign-off (load-bearing, per CLAUDE.md)
1. **Clip raw-drop policy:** is a verified 0.5 MB web-copy sufficient to drop the raw with **no Drive** (symmetric with photos), or do clips need a stronger custody bar? **Recommend symmetric** — but only because Guard A now HEAD-verifies the object, not just the column.
2. **No-Drive fallback = derivative-on-R2-Standard + nudge + paid route** (not forced Drive, not IA). Confirm.
3. **Tiering is filed-not-built.** Confirm PR-6/PR-7 stay specs until the forever pool is measured in multi-TB (IA) / hundreds-of-TB (B2), and that IA is **not** pursued as a cost-saver for viewable objects.
4. **Retention lapse behavior:** confirm a lapsed Keep-Full-Res triggers a fresh grace + warning before any drop (never a silent one-sweep delete of a paying customer's full-res).
5. **Keep-Full-Res SKU price** referenced in the cost model (₱2,999/yr `HIGH_RES_ARCHIVE`) — reconcile against `Pricing.md § 00` before quoting to couples.
6. **Off-Vercel transcode host** for PR-3 (Cloudflare Container vs Hetzner VM pool) — pick one; it also becomes the render fallback the corpus already names.