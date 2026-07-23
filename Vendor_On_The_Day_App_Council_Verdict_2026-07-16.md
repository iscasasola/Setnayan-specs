# Vendor On-the-Day App — Council Verdict (2026-07-16)

## 1. The hardcoding answer

**Yes — the current "On the Day" console hardcodes its category controllers, and that has to go.** The 4-persona pill quad (photographer / caterer / coordinator / host `CATEGORY_PILLS`) is invented taxonomy that has no relationship to what vendors actually store. Vendors' `services[]` hold **canonical WeddingTile keys**, and the real, published taxonomy is DB-driven: `getTaxonomy()` in `apps/web/lib/taxonomy-db.ts` reads `public.service_categories` (tier-1/tier-2 folders) and `public.canonical_service_taxonomy`, falling back to the `lib/taxonomy.ts` constant (~49KB) only when unseeded. That is ~46 canonical tiles across the tier tree, not four personas.

The bridge already exists: `apps/web/lib/vendor-day-of.ts` **already maps canonical tile keys → console "kinds."** So the fix is not new mapping code — it is deleting the hardcoded quad and deriving controllers from `getTaxonomy()` ∩ today's booking's tiles.

**What replaces it:** a small set of **controller families** keyed to tier-1 folders (`service_categories.parent_id IS NULL`) — Capture, Serve/Deliver, Coordinate, Perform/Stream — each exposing a fixed toolset. A vendor's `services[]` intersected with the booked event's tiles selects which families light up; per-tile deviations (`is_rental`, `dietary`, `secondary_tiles` on `canonical_service_taxonomy`) are data lookups, not new components. This survives an admin taxonomy edit (spec 0023 §3.15) because it reads the DB source of truth, and it means **~4–5 families, not 46 bespoke consoles.**

## 2. Verdict summary

The target is a **4-step launcher** where configuration is an *override layer, not a prerequisite* — a vendor who just taps "Launch" writes nothing to the DB.

- **Step 1 — Pick event:** list every booked day-of-eligible event from `fetchVendorPoolBookings`, each stamped Upcoming / Today / Past from `booking.bookedDate` vs `phToday()`.
- **Decouple configure from go-live:** any booked event is *configurable* ahead of time; only **Today** events are *launchable* (the `bookedDate === phToday()` gate now arms the Launch button, not page access).
- **Step 2 — Modules:** taxonomy-driven controller families computed from `getTaxonomy()`; defaults live in code, overrides persist to one sparse row.
- **Step 3 — Access:** day-of crew = **device pairing** via `registered_crew_devices` + `events.master_qr_token`, *not* per-event staff-account grants. Step shows only when a grant-requiring module is on or teammates exist.
- **Step 4 — Launch:** fullscreen, wake-locked route in the **existing PWA** (`/vendor-dashboard/on-the-day/live/[eventId]`), not native, not a separate app.
- **The floor console is a read-and-coordinate surface** over data the couple already consented to — its one real state-changing action is `booking_handovers` → `acknowledge_handover()`.
- **Countdown** derives from `event_schedule_blocks.start_at/end_at` (the couple's run-of-show, vendor-readable) — never from fabricated vendor service hours.
- **Reviews QR** stays honest: it deep-links `/v/[slug]#reviews`; the "instant guest reviews" framing is killed.
- **Offline tolerance** follows the shipped `wall-projection.tsx` pattern: `supabase.channel` + ~12s reconcile timer, handover queued optimistically.
- **CUT from Phase 1:** vendor Papic capture, per-guest vendor delivery, live review ticker on the floor, real call-time countdown.

## 3. Module registry

| Module | Data source that exists TODAY | New schema needed | Phase |
|---|---|---|---|
| **Category controllers** | `getTaxonomy()` (`lib/taxonomy-db.ts`) + tile→kind map in `lib/vendor-day-of.ts` | Sparse override table `vendor_dayof_configs` (see §7) | **1** |
| **QR scanner** | `lib/qr-scan.ts` `makeQrDetector()` (native `BarcodeDetector` → jsQR); `parseGuestQrPayload` (`lib/checkin.ts`) | None — extract shared `<QrScanner>` from `checkin-desk.tsx` | **1** |
| **Delivery handover (booking-level)** | `public.booking_handovers` + `acknowledge_handover()` RPC + `event_vendors` completion fields | None | **1** |
| **Countdown / Run of Show** | `event_schedule_blocks.start_at/end_at` (vendor-readable via `event_schedule_blocks_booked_vendor_read`); `run-of-show-header.tsx` realtime | None | **1** |
| **Aggregate pax** | `get_vendor_event_brief` RPC (`brief.pax.attending/invited`) | None | **1** |
| **Crew device pairing** | `registered_crew_devices` + `events.master_qr_token` (5-device trigger cap); `/api/crew/register-device` | None — revive unlaunched pilot | **1–2** |
| **Review QR (relabeled)** | `guest-review-qr.tsx` → `/v/[slug]#reviews`; writes couple-side `dashboard/.../review/actions.ts` | None (copy change only) | **1** |
| **LIVE review feed** | `wall-projection.tsx` channel pattern; base table `public.vendor_reviews`; hydrate via `fetchReviewsForVendorWithCouple`/`fetchReviewStats` | `ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_reviews;` (vendor-private, read-only) | **2** |
| **Per-guest vendor delivery** ("meal served to guest X") | Only couple-side analogs exist (`guest_souvenir_claims`, check-in) — **no `vendor_profile_id`×`guest_id` link** | Net-new `vendor_guest_deliveries` + RLS; re-creates guest-PI-to-vendor exposure | **CUT** |
| **Free vendor Papic (10/3 + Ltd/Unli upsell)** | **No vendor capture path.** `paparazzi_seats`/`papic_photos` are `event_id`-keyed, couple-RLS, **no `vendor_profile_id`**. Free sampler was *removed* (`20270307073708_remove_papic_sampler.sql`) | Net-new vendor-scoped capture schema + RLS lane; breaks couple-provisioning lock | **CUT / counsel-gated** |
| **Hours-remaining countdown (vs booking hours)** | `event_vendors` has **date-only** `bookedDate`; no `service_start/end` column anywhere | New `event_vendors.service_start_at/end_at` + couple UI | **CUT** (use schedule-block countdown instead) |

## 4. Where the council disagreed

**Vendor Papic free-capture tier — cut vs. redesign.** The economics seat argued for a redesigned *portfolio-pool, token-upsell, consent-gated-to-Alaala* version rather than an outright cut. The skeptic and engineer argued for a hard cut on legal/schema grounds. **Ruling: CUT from V1, do not design on top of it yet.** The economics seat's cannibalization analysis is correct and important — a booked vendor handing couples 100 shots for a token undercuts the couple-side **₱2,999 PAPIC_SEATS** ladder — but that analysis is a *reason it must go through counsel and owner sign-off first*, not a reason to ship a redesign this council can bless. The decisive facts: (a) no `vendor_profile_id` exists on `papic_photos`; (b) the free sampler was already built and removed (`20270103000000` → `20270307073708`); (c) it makes the vendor a third-party controller of guest PI, widening an **open NPC filing** (see §5). If the owner reopens it, the economics seat's model (vendor pays in tokens at flat ₱200, portfolio pool by default, couple opt-in promote as the consent gate, **Unli cut** as redundant with the 3+3 `editorial_vendor_media` portfolio cap) is the design to start from.

**Countdown source — schedule-blocks vs. honest T-band.** UX and architect want the launched clock to count down to the next `event_schedule_blocks.start_at`. The skeptic warns this silently binds the vendor's clock to the *couple's* run-of-show and implies precision that per-vendor call-times don't have. **Ruling: use schedule-blocks when present, and label them as the couple's program** ("NEXT: Grand Entrance · in 0:42"), degrading honestly to elapsed-time off the T-1h band when no run-of-show exists ("Event day · started 1:20 ago"). Never render it as a countdown to a vendor service *end* that doesn't exist. A true per-vendor call-time is a separate, owner-gated column — deferred.

**Day-of crew access — accounts vs. devices.** The brief asked for "grant a staff account access to one event day." All technical seats converged: `vendor_team_members` is **workspace-wide** (`current_vendor_ids(min_role)`, no `event_id`), so per-event-day account scoping is a net-new RLS pattern — forbidden without sign-off per CLAUDE.md ("No invented patterns"). **Ruling: day-of crew = device pairing** via the already event+vendor-scoped `registered_crew_devices` (5-device DB-trigger cap), which was built for exactly this and never launched. No new grant primitive.

**Live review feed — feasible but a farming risk.** Engineer confirmed it's a known pattern (base-table subscription + timer fallback) needing one migration. Skeptic flagged that a live counter manufactures pressure to farm 5-stars. **Ruling: build it Phase 2, vendor-private and read-only, post-completion only.** The existing gate already blocks mid-event capture (couple/coordinator write + completion handshake + `UNIQUE(vendor_profile_id, event_id)`); the feed must not become a public volume leaderboard, and `vendor_reply` stays locked-once-set (`lock_vendor_reply` trigger).

## 5. Privacy & integrity gates

- **Vendor capture is a consent-chain break (RA 10173).** Today Papic's lawfulness rests on couple event consent + guest RSVP consent scoped to *paparazzi/friend* capture. A vendor collecting guest images for its own commercial portfolio is a **third-party controller** the guest never consented to, with **no schema hook** (`papic_photos` has no `vendor_profile_id`). It sits adjacent to biometrics (face auto-tag ≥0.85) and would widen the **live privacy gap register** (`project_setnayan_privacy_reconciliation`) — where `/privacy` already omits built face-enroll biometrics and NPC filing is mid-flight. **Gate: no vendor capture surface until counsel rules on the guest→vendor consent chain and the controller/processor split.**
- **Per-guest vendor delivery** re-creates the same guest-PI-to-vendor exposure with no existing `vendor_profile_id`×`guest_id` linkage — **same counsel gate; CUT.**
- **Review integrity.** No mid-event review capture — reviews open post-completion-handshake only (existing gate: `current_couple_or_coordinator_event_ids()` + `customer_confirmed_received_at`/auto-confirm windows, one verdict per booking). Relabel the QR from "instant reviews from guests" to "Have your couple confirm & rate this booking." The live feed stays vendor-private and read-only.
- **Data-integrity flag — quota numbers don't reconcile.** Roll tier is **30 photos/10 clips** in code (`lib/papic-cameras.ts:118`), **24 photos + 10×5s clips** in CLAUDE.md's SKU table. Any console that surfaces a quota must not repeat the doc's wrong number — reconcile before it becomes a customer-facing claim. (Moot for V1 since vendor Papic is cut, but the doc discrepancy is real and should be fixed.)

## 6. Owner sign-offs required

1. **Decouple gates:** confirm any booked event is *configurable* ahead of time, and only **Today** events are *launchable* (changes the meaning of the current `phToday()` gate). — yes/no
2. **Sparse persistence:** confirm we do *not* materialize a `vendor_dayof_configs` row per booking — a row exists only after an override. — yes/no
3. **Day-of crew = device pairing:** approve reviving the unlaunched `registered_crew_devices` / master-QR pilot instead of building per-event staff-account grants. — yes/no
4. **Launch target:** confirm fullscreen PWA route (`/on-the-day/live/[eventId]` + Screen Wake Lock), not native or a separate app. — yes/no
5. **Countdown source:** confirm the clock counts to `event_schedule_blocks` (labeled as the couple's program) or shows the honest T-band — no fabricated per-vendor service hours. — yes/no
6. **Vendor Papic capture:** confirm it is **CUT from V1** and parked for a counsel-and-DPO-gated future council (reopening the removed sampler decision). — yes/no
7. **Live review feed:** approve the one-line migration `ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_reviews;` for a vendor-private, read-only, post-completion feed. — yes/no
8. **Per-guest vendor delivery:** confirm it is **CUT**; vendor delivery granularity stays booking-level via `booking_handovers`. — yes/no

## 7. Phased build map for Opus

**Reuse-first. No fake doors. Every phase ships with its doorway (keep the "On the Day" item in the vendor-dashboard rail + a contextual vendor-Home tile that appears when `booking.bookedDate === phToday()`).**

### PR-1 — Kill the hardcoded quad; taxonomy-driven controllers (Phase 1)
- **Touch:** `apps/web/app/vendor-dashboard/on-the-day/page.tsx` (delete `CATEGORY_PILLS`), `apps/web/lib/vendor-day-of.ts` (surface tier-1 → controller-family grouping).
- **Add:** `apps/web/lib/vendor-dayof-modules.ts` — static module registry `{ id, label, defaultOnForKinds[], dataDeps, requiresGrant }`, `defaultOnForKinds` reusing the existing console-kind sets.
- **Read:** `getTaxonomy()` from `lib/taxonomy-db.ts` (falls back to `lib/taxonomy.ts`). Controllers = `getTaxonomy()` ∩ today's booking tiles. Defaults are a pure function of taxonomy — no DB read for defaults, no persisted row.

### PR-2 — Event picker + configure/launch decoupling (Phase 1)
- **Touch:** `on-the-day/page.tsx` picker; derive Upcoming/Today/Past chips from `fetchVendorPoolBookings` (`lib/vendor-schedule.ts`) vs `phToday()`.
- Launch button armed only on Today; configuration open on any booked event.

### PR-3 — Sparse override persistence (Phase 1)
- **Add migration:** `vendor_dayof_configs(vendor_profile_id, event_id, enabled_modules jsonb, updated_at, UNIQUE(vendor_profile_id, event_id))`, RLS at `CREATE TABLE` time — `current_vendor_ids('admin')` writes, booked-vendor reads. **Row written only on override**; absent row = code defaults (byte-for-byte current behavior).

### PR-4 — Floor Card (launched state) + booking handover + countdown (Phase 1)
- **Add route:** `/vendor-dashboard/on-the-day/live/[eventId]` — fullscreen, single-column, ≥64px tap targets, Screen Wake Lock, obsidian focal + gold/Space-Mono clock.
- **Wire:** primary action → `booking_handovers` + `acknowledge_handover()` RPC (optimistic outbox + retry); 3-dot delivery progress from `event_vendors` completion; countdown from `event_schedule_blocks` (reuse `run-of-show-header.tsx` realtime); aggregate pax from `get_vendor_event_brief`.
- **Offline:** `supabase.channel` + ~12s reconcile timer per `wall-projection.tsx`; connection pill (`LIVE`/`SYNCING`/`SAVED-OFFLINE`).

### PR-5 — Shared QR scanner + crew device pairing (Phase 1–2)
- **Add:** `apps/web/app/_components/qr-scanner.tsx` — extract viewfinder/start-stop/manual-fallback from `checkin-desk.tsx`, back it with `lib/qr-scan.ts` `makeQrDetector()` (native `BarcodeDetector` → jsQR). Do **not** inline a third jsQR loop.
- **Wire crew pairing:** `events.master_qr_token` + `registered_crew_devices` + `/api/crew/register-device` (5-device trigger cap). Step 3 renders only when a `requiresGrant` module is on or teammates (`vendor_team_members`) exist — solo owner never sees it.

### PR-6 — Relabel review QR (Phase 1) + live review feed (Phase 2)
- **Copy fix (Phase 1):** `on-the-day/_components/guest-review-qr.tsx` → "Have your couple confirm & rate this booking"; keep deep-link `/v/[slug]#reviews`.
- **Feed (Phase 2, gated on sign-off #7):** one migration `ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_reviews;`. Subscribe `supabase.channel('vendor-reviews:'+vendorId)` → `postgres_changes` on **base table** `public.vendor_reviews` filtered `vendor_profile_id=eq`, ~12s timer fallback; hydrate via `fetchReviewsForVendorWithCouple`/`fetchReviewStats`. Vendor-private, read-only, post-completion only.

### Deferred / counsel-gated (do not build in V1)
- Vendor Papic free-capture tier (sign-off #6 + counsel).
- Per-guest vendor delivery table (sign-off #8 + counsel).
- Per-vendor call-time countdown (`event_vendors.service_start_at/end_at` + couple UI).
---

## 8. Owner overrides (2026-07-16 · post-verdict sign-off)

The owner reviewed the eight sign-offs and OVERRODE the three council cuts. All three overridden modules are now IN scope. The owner explicitly owns the reopened legal/schema exposure.

| # | Council recommendation | Owner decision | Consequence the owner owns |
|---|---|---|---|
| Vendor Papic capture | CUT (counsel-gated) | **BUILD IT ANYWAY NOW** | Reopens the killed `20270307073708_remove_papic_sampler` decision; a vendor becomes a third-party controller of guest PI, widening the **live NPC filing**. Build proceeds WITH a consent gate + NSFW filter (non-negotiable RA 10173 minimums) — the override is on *shipping the surface*, not on skipping consent. |
| Per-guest vendor delivery | CUT (aggregate only) | **BUILD NET-NEW `vendor_guest_deliveries`** | New `vendor_profile_id` × `guest_id` link = guest-PI-to-vendor exposure; same counsel item as Papic capture. |
| Day-of crew access | Device pairing (`registered_crew_devices`) | **PER-EVENT ACCOUNT GRANTS** | Net-new RLS pattern — the CLAUDE.md "no invented patterns" bar is cleared by this explicit owner sign-off. New `vendor_event_access_grants` + a 9th documented helper, scoped to (vendor, event). |

Uncontested items (taxonomy-driven controllers, event picker + configure/launch decoupling, sparse `vendor_dayof_configs`, fullscreen PWA launch, run-of-show countdown, live review feed, review-QR relabel) ship as the verdict specifies.

**Standing counsel item (unchanged):** vendor capture of guest images + per-guest vendor delivery both still need the DPO/NPC consent-chain ruling. The owner's override means we BUILD behind the correct consent gate now rather than waiting for the ruling to start — the ruling still governs go-live/flag-flip.
