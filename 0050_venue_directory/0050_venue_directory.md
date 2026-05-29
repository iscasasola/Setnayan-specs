# Iteration 0050 — Venue Directory (V1 — promoted from V1.2 2026-05-22)

**Iteration number:** 0050
**Topic:** Reception folder gets real venue cards backed by `venue_directory`. ~50 synthetic Filipino reception venues across NCR · Tagaytay · Cebu · Davao · Boracay land as `is_demo=TRUE` seed data with capacity, day-rate range, amenities, and faceted compatibility tags. Couples browse + filter + view detail; booking flows through chat inquiry in V1, with calendar-backed real bookability deferred to V1.5+.
**Surface:** `/vendors` Reception folder + new `/venue/[slug]` detail page (Agent C) + `/dashboard/[eventId]` Reception planning-group [Search] button + admin `/admin/demo-vendors` cleanup batch (extended).
**Status:** Drafted 2026-05-22 · V1 scope expansion · spec + schema + seed shipping in three coordinated PRs (Agent A foundation · Agent B UI · Agent C detail page).
**Owner:** Ice
**Phase:** V1 — promoted from V1.2 2026-05-22 evening per CLAUDE.md decision-log row pending append.
**Builds on:** [0006](../0006_vendors_management/0006_vendors_management.md) (canonical vendor / venue patterns), [0008](../0008_seating_chart_editor/0008_seating_chart_editor.md) (`venue_setting` enum referenced by `compatible_venue_settings`), [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) (`compatible_ceremony_types` pattern), `20260526010000_venue_directory_seed.sql` (existing ceremony venue table + RLS).
**Consumed by:** [0007](../0007_budget_expenses/0007_budget_expenses.md) (venue day-rate becomes a budget line when couple inquires + books), [0019](../0019_communications/0019_communications.md) (venue inquiry chat threads), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (V1.5+ when venue day-rates become orderable SKUs).
**Companion specs:** [0006](../0006_vendors_management/0006_vendors_management.md), [0008](../0008_seating_chart_editor/0008_seating_chart_editor.md), [0034](../0034_payments_and_cart/0034_payments_and_cart.md), [Vendor_Taxonomy_V1_Master.md](../02_Specifications/Vendor_Taxonomy_V1_Master.md).

---

## What this iteration ships

[CLAUDE.md 2026-05-20 row 470](../CLAUDE.md) ("12-folder marketplace remap") locked Reception as filter-only via the `events.venue_setting` enum, with bookable venue records (per-location calendars + day-rates) deferred to V1.2. Reception folder in production today renders seven faceted chips but zero venue cards — couples land on the folder, see no venues, and bounce.

Owner approved pulling the V1.2 work forward to V1 on 2026-05-22 evening. The realized architecture is lighter than the V1.2 brief: shipping a **read-only venue directory with capacity + day-rate display + amenities + faceted compatibility** (this iteration) covers most of the couple-value at marketplace surface time, while **calendar-backed real bookability** stays V1.5+. Couples in V1 inquire via chat; the existing Setnayan Pay flow at [0034](../0034_payments_and_cart/0034_payments_and_cart.md) handles the booking once the venue confirms.

V1 ships:

1. **Schema extension** (`supabase/migrations/20260604000000_venue_directory_reception_support.sql`) — adds 6 reception-venue enum values + 9 columns (`venue_category`, `capacity_min/max`, `day_rate_php_min/max`, `description`, `amenities`, `compatible_venue_settings`, `is_bookable_via_setnayan`, `is_demo`, `demo_batch_id`) to `venue_directory`, plus 4 partial indexes.
2. **Synthetic seed** (`supabase/migrations/20260604010000_venue_directory_reception_seed.sql`) — 50 reception venues across 5 PH cities (16 NCR · 9 Tagaytay · 9 Cebu · 6 Davao · 6 Boracay · 4 nearby destinations). All `is_demo=TRUE`, deterministic batch UUID `00000000-0000-0000-0000-000000000050`. Cleanup deadline **2026-12-01** before public launch.
3. **Reception folder rewrite** (Agent B PR) — venue cards rendered from `venue_directory WHERE venue_category IN ('reception', 'combined')`, faceted by `compatible_venue_settings` + capacity + price range.
4. **Venue detail page** (Agent C PR) — new route `/venue/[slug]` reading from `venue_directory` with hero image (existing `hero_image_url` column from `20260526020000_venue_directory_hero_images.sql`), capacity, day-rate range, amenities chips, description, "Inquire about this venue" CTA opening a chat thread.

V1.5+ ships separately (NOT in this iteration):
- Real venue calendars + per-location day-rate orders.
- Vendor invite flow promoting the seed venue to a claimed vendor profile.
- BIR-compliant deposit escrow + day-rate Setnayan Pay orders.

---

## Schema additions

Migration `20260604000000_venue_directory_reception_support.sql` extends the existing `venue_directory` table (shipped 2026-05-26 in `20260526010000_venue_directory_seed.sql`). All changes idempotent (`ADD VALUE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` / `IF NOT EXISTS` indexes).

### `venue_directory_type` enum — 6 new values (forward-compatible)

Already present pre-this-migration: `catholic_church`, `christian_church`, `inc_chapel`, `mosque`, `cultural_site`, `civil_registrar`, `hotel_ballroom`, `garden`, `beach`, `destination_resort`, `heritage`, `outdoor_tent`.

Added by this iteration:
- `banquet_hall` — generic hotel ballroom / convention space (distinct from the more-specific `hotel_ballroom` already in the enum)
- `garden_estate` — Antonio's / Sonya's / Hillcreek-style estates with combined garden ceremony + reception spaces
- `beach_resort` — Boracay / Mactan / Panglao multi-room beach resorts (distinct from the more-specific `beach` for ceremony-only beachfront)
- `heritage_hacienda` — Las Casas / Hacienda Isabella style heritage estates
- `restaurant` — Antonio's-style private-dining destinations used as intimate reception venues
- `multi_purpose_hall` — church halls / school auditoriums / sports clubs (budget-friendly banquet alternatives)

Pre-existing `destination_resort` + `outdoor_tent` keys are reused for the V1 promoted scope; not re-added.

**Seed venue_type mapping note:** Agent B's Reception folder (`apps/web/lib/venue-recommendations.ts → findReceptionVenuesByVenueSetting`) and Agent C's `/venue/[slug]` detail page (`displayVenueType()`) both shipped before this migration landed, and only know the original 6 reception types (`hotel_ballroom`, `garden`, `beach`, `destination_resort`, `heritage`, `outdoor_tent`). To make the 50-venue seed surface immediately in the deployed UI, the seed migration writes the existing 6 enum values per row (a generic hotel uses `hotel_ballroom`; a garden estate uses `garden`; a beach resort uses `beach`; etc.). The 6 new enum values are reserved for V1.x onboarding where vendor partners want a more-specific category — Agent B/C extend `displayVenueType()` + `RECEPTION_VENUE_TYPES` at that time. This is forward-compatible: any future row using a new value renders correctly the moment the UI helpers gain a switch-case for it.

### `venue_directory` table — 9 new columns

| Column | Type | Notes |
|---|---|---|
| `venue_category` | `TEXT NOT NULL DEFAULT 'ceremony'` | `ceremony` / `reception` / `combined`. Distinguishes Ceremony folder rows from Reception folder rows. Backfilled to `'ceremony'` on all pre-2026-06-04 rows (defensive). |
| `capacity_min` | `INT` | 1–5000. NULL for ceremony-only venues. |
| `capacity_max` | `INT` | ≥ `capacity_min`, ≤ 5000. |
| `day_rate_php_min` | `INT` | PHP whole pesos (matches `vendor_services.starting_price_php`). NULL = inquire-only. |
| `day_rate_php_max` | `INT` | ≥ `day_rate_php_min`. NULL for single-rate venues. |
| `description` | `TEXT` | 1–3 sentence summary. Max 2000 chars. |
| `amenities` | `JSONB NOT NULL DEFAULT '[]'::jsonb` | Array of amenity tags. Controlled vocabulary: `catering_included` · `in_house_decor` · `valet_parking` · `bridal_suite` · `ocean_view` · `garden_view` · `heritage_architecture` · `ballroom` · `outdoor_space` · `indoor_air_conditioned` · `accommodation_available` · `parking_50plus` · `av_equipment` · `dance_floor`. |
| `compatible_venue_settings` | `TEXT[] NOT NULL DEFAULT '{}'` | Which `venue_setting` enum values this venue maps to. Drives the venue-match filter on Reception folder. |
| `is_bookable_via_setnayan` | `BOOLEAN NOT NULL DEFAULT FALSE` | V1 always FALSE — couples inquire via chat. V1.5+ flips TRUE for venues with real calendars + day-rate orders. |
| `is_demo` | `BOOLEAN NOT NULL DEFAULT FALSE` | Mirrors `vendor_profiles.is_demo`. Synthetic venues for V1 marketplace dogfooding; cleanup deadline 2026-12-01. |
| `demo_batch_id` | `UUID` | Groups demo rows by seed batch (matches `vendor_profiles.demo_batch_id`). |

### Constraints

- `venue_directory_venue_category_valid` — CHECK in (`ceremony`, `reception`, `combined`).
- `venue_directory_description_length` — length ≤ 2000.
- `venue_directory_capacity_min_pos` — `capacity_min > 0 AND <= 5000`.
- `venue_directory_capacity_max_gte_min` — `capacity_max >= capacity_min AND <= 5000`.
- `venue_directory_day_rate_min_nonneg` — `day_rate_php_min >= 0`.
- `venue_directory_day_rate_max_gte_min` — `day_rate_php_max >= day_rate_php_min`.

All constraints use the `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN NULL; END $$` pattern from the 2026-05-26 hero-images migration so re-runs are no-ops.

### Indexes

| Index | Shape | Why |
|---|---|---|
| `venue_directory_category_idx` | full on `(venue_category)` | Reception folder query filters by category. |
| `venue_directory_compat_venue_set_idx` | GIN on `(compatible_venue_settings)` | "Match my wedding" filter uses array-containment (`&& ARRAY['garden']`). |
| `venue_directory_capacity_idx` | partial on `(capacity_min, capacity_max) WHERE capacity_max IS NOT NULL` | Capacity-range filter — ceremony venues without capacity skip the index. |
| `venue_directory_demo_idx` | partial on `(created_at DESC) WHERE is_demo = TRUE` | Admin cleanup queue. Matches `vendor_profiles_is_demo_idx`. |
| `venue_directory_demo_batch_id_idx` | partial on `(demo_batch_id) WHERE demo_batch_id IS NOT NULL` | Per-batch cleanup endpoint. |

### RLS — no changes needed

Existing policies `venue_directory_read_all` (anon + auth read) + `venue_directory_admin_write` (admin write) from `20260526010000_venue_directory_seed.sql` already cover the new columns. Demo filtering happens at the query layer (Agent B's Reception folder rewrite) not via RLS, matching the demo-vendors pattern shipped 2026-06-03.

---

## Reception folder integration

Agent B's PR rewrites the `/vendors` Reception folder section to render venue cards from `venue_directory WHERE venue_category IN ('reception', 'combined')`. See [Agent B PR description] for UI details. Key contract points:

- **Card data source:** `venue_directory` (NOT `vendor_profiles` — venues are a separate model in V1; the V1.5+ bookable migration may reconcile).
- **Filter chips:** `compatible_venue_settings` driven (banquet_hall / garden / beach / destination / heritage / outdoor_tent / civil_registrar) plus capacity range slider + day-rate range slider.
- **Religion match:** when host has `events.ceremony_type` set, default-on filter applies `compatible_ceremony_types` array-containment with NULL-safe valve (matches the religion-match pattern from PR #305 / Task #42).
- **Venue-setting match:** when host has `events.venue_setting` set, default-on filter applies `compatible_venue_settings` array-containment via `?venue=1` (matches the venue-match pattern from PR #311 / Task #48).
- **Demo gate:** demo venues hidden by default; `?demo=1` (admin-only via `setnayan_demo_mode` cookie per `apps/web/lib/demo-mode.ts`) surfaces them. V1 cohort is 100% demo until real venues land via the vendor invite + claim flow.
- **Honest-empty:** when filters narrow results to 0, broadened-scope count signals "Show all" CTA (matches the existing Reception scope-broaden pattern).

---

## Venue detail page

Agent C's PR ships `/venue/[slug]` reading from `venue_directory`. See [Agent C PR description] for UI details. Key contract points:

- **Route:** `apps/web/app/venue/[slug]/page.tsx`. Mirrors `/v/[slug]` vendor detail page architecture but reads from `venue_directory` not `vendor_profiles`.
- **Hero:** uses existing `hero_image_url` + `hero_image_attribution` + `hero_image_license` + `hero_image_source_url` columns from `20260526020000_venue_directory_hero_images.sql`. Reception venues need their own hero photo pass — owner curation OR `press-kit` / `owner-uploaded` license values (see `venue_directory_hero_image_license_known` constraint).
- **Display blocks:** name + category badge · hero image + attribution · description · capacity range · day-rate range · amenities chips · map (Google Maps embed using `hq_latitude` + `hq_longitude`) · compatible ceremony types + venue settings badges.
- **CTA:** "Inquire about this venue" opens a chat thread targeting Setnayan's central inquiry routing (V1) — vendor-side message routing TBD via the vendor invite + claim flow. V1.5+: direct messaging the claimed vendor.
- **Demo banner:** if `is_demo = TRUE`, render the same demo banner the `/v/[slug]` page renders for demo vendors (per `apps/web/lib/demo-mode.ts`).

---

## Booking flow

### V1 — inquiry-only via chat
- Couple opens `/venue/[slug]`, clicks "Inquire about this venue".
- Setnayan creates a chat thread routed to the central inquiry queue (admin handles routing in V1 — venue ownership isn't claimed yet).
- Couple + venue exchange messages, agree on date + day-rate.
- Couple manually adds the venue to their event via `/dashboard/[eventId]/vendors/new` (with a future helper that pre-fills from the chat thread → cuts paste-friction).
- Setnayan Pay 5% flat fee applies per [0034](../0034_payments_and_cart/0034_payments_and_cart.md) if couple chooses Setnayan Pay; otherwise off-platform settlement (couple pays venue direct, Setnayan tracks via 0007 budget).

### V1.5+ — real bookability
- `is_bookable_via_setnayan = TRUE` venues expose a calendar UI on `/venue/[slug]`.
- Couple picks a date → system creates a Setnayan Pay order at the day-rate.
- Standard Setnayan Pay flow per [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (5% convenience fee + BIR 0.5% withholding + 3-stage payout for coming_soon vendors).
- Calendar updates atomically on order confirmation to prevent double-booking.

---

## Demo seed (cleanup before Dec 1)

The 50 venues seeded by `20260604010000_venue_directory_reception_seed.sql` are synthetic representations of real Filipino wedding venues — useful for V1 marketplace dogfooding, NOT for real customer-facing transactions. All rows carry:

- `is_demo = TRUE`
- `demo_batch_id = '00000000-0000-0000-0000-000000000050'::uuid` (deterministic, matches iteration number)
- `source_note = 'Synthetic demo venue · 2026-05-22 V1 scope expansion · cleanup before 2026-12-01'`

Cleanup paths:
- **Vendor invite + claim** — Setnayan owner invites real venue partners; signed-up venues replace the demo row's slug + content. The synthetic row archives (`is_demo` flips FALSE on claim by admin).
- **Wholesale cleanup** — `/admin/demo-vendors` regenerate endpoint extended to cover venues. Wipes all `is_demo=TRUE` rows matching the batch ID.
- **CI guard** — `apps/web/scripts/check-no-demo-in-prod.ts` extended to enforce a maximum demo-venue count post-launch (currently enforces for vendor_profiles only).

---

## Cross-references

- **[0006](../0006_vendors_management/0006_vendors_management.md):** Canonical vendor + venue patterns. `vendor_profiles` is the model used when a venue claims their listing; `venue_directory` is the V1 staging table for unclaimed reception venues. V1.5+ may reconcile via a vendor_profiles ALTER + data copy.
- **[0008](../0008_seating_chart_editor/0008_seating_chart_editor.md):** Defines the `venue_setting` enum (banquet_hall · garden · beach · destination · heritage · outdoor_tent · civil_registrar). `compatible_venue_settings` arrays reference these values.
- **[0034](../0034_payments_and_cart/0034_payments_and_cart.md):** Setnayan Pay 5% convenience fee + BIR 0.5% withholding apply to V1.5+ venue day-rate orders. V1 venues bypass this (inquiry-only; settlement off-platform OR via a manually-created `vendor_services` row at couple's request).
- **[Vendor_Taxonomy_V1_Master.md](../02_Specifications/Vendor_Taxonomy_V1_Master.md):** Reception folder taxonomy spec. Reception is folder #2 in the 12-folder marketplace remap; this iteration backs it with real data.
- **[Live_Site_Snapshot_2026-05-18](../Live_Site_Snapshot_2026-05-18/README.md):** Reception folder drift baseline — pre-iteration-0050 rendering showed empty cards under the seven faceted chips.

---

## Acceptance criteria

1. **Schema migration applied** — `venue_directory_type` enum contains the 6 new values; `venue_directory` has 9 new columns; 5 indexes exist.
2. **Seed migration applied** — 50 new rows in `venue_directory` with `is_demo=TRUE` and `venue_category` IN (`reception`, `combined`).
3. **RLS unchanged** — anon + auth can read all rows including demo; admin can write (existing policies cover).
4. **Reception folder** (Agent B) — venue cards render from `venue_directory` when host visits `/vendors?folder=reception`.
5. **Venue detail page** (Agent C) — `/venue/[slug]` renders for each of the 50 seeded venues.
6. **Inquiry CTA** — clicking "Inquire about this venue" opens a chat thread (V1: central inquiry queue; V1.5+: direct to claimed vendor).
7. **Demo gate** — demo venues hidden from `/vendors` browse by default; `?demo=1` surfaces them (admin-only via `setnayan_demo_mode` cookie).
8. **CI green** — typecheck + lint + build + bundle-size guard pass on the foundation PR.
9. **Idempotent migrations** — re-running both migrations is a no-op (verified via `IF NOT EXISTS` + `ON CONFLICT DO NOTHING`).
10. **Cleanup deadline tracked** — `is_demo=TRUE` venues counted alongside vendors in the 2026-12-01 cleanup punch list.

---

## Out of scope (V1.5+ or later)

- **Real venue calendars** — per-location availability calendar with intra-day blocks (deferred to V1.5+; matches the vendor calendar pattern shipped earlier in 0022).
- **Day-rate orders** — turning day-rate into orderable Setnayan Pay SKUs via [0034](../0034_payments_and_cart/0034_payments_and_cart.md) `service_orders` flow (V1.5+).
- **Vendor claim flow for venues** — venue partners claiming a `venue_directory` row and migrating it to `vendor_profiles` (V1.5+).
- **Deposit escrow** — multi-stage day-rate payouts (reservation deposit → balance due) similar to vendor payouts in [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (V1.5+).
- **Real photography** — Wikimedia-sourced or press-kit hero photos for the 50 demo venues (Agent C + a follow-up photo-curation pass; venues seed without hero photos initially).
- **Combined venue badges** — UI badge indicating combined ceremony + reception capability on `/venue/[slug]` cards (Agent B / Agent C polish).
- **Reception-side `vendor_market_stats` view extension** — the existing view (per `20260601020000_iteration_0006_vendor_market_stats_view.sql`) covers `vendor_profiles`; extending to cover `venue_directory` is a V1.5+ analytics consideration.

---

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-22 | V1.2 venue iteration promoted to V1 with scope shrunk to read-only directory + inquiry-only booking. | Reception folder shipping empty was a poor first impression. Foundation (schema + seed + UI cards + detail page) ships in V1; calendar-backed real bookability moves to V1.5+. Matches the pilot-before-June-1 scope guard ([CLAUDE.md decision-log row 8](../CLAUDE.md)). |
| 2026-05-22 | Synthetic seed via `is_demo=TRUE` instead of real venue agreements. | Owner doesn't have signed agreements with these 50 venues yet. Demo flag plus the 2026-12-01 cleanup deadline mirrors the demo-vendors pattern shipped 2026-06-03 — couples in V1 pilot see venues at marketplace surface, real curation continues in parallel. |
| 2026-05-22 | `venue_directory` extended in place rather than new `venues` table. | Hero-image columns + RLS + read-all policy already exist on `venue_directory`. Reusing the table avoids a parallel schema + the slug-matching ambiguity flagged in `20260530000000_event_vendors_venue_directory_link.sql` (which already pairs `event_vendors.source_venue_directory_id` to this table). |
| 2026-05-22 | Reception folder filter-only architecture preserved. | [CLAUDE.md 2026-05-20 row 470](../CLAUDE.md) locked Reception as filter-only via `events.venue_setting`. This iteration extends the directory but doesn't change the filter-only behavior — couples filter by setting, then see real venues that match. |

---

## Companion artifacts

- `supabase/migrations/20260604000000_venue_directory_reception_support.sql` — schema migration.
- `supabase/migrations/20260604010000_venue_directory_reception_seed.sql` — 50-venue seed.
- Agent B PR — `/vendors` Reception folder rewrite (separate PR, depends on this PR).
- Agent C PR — `/venue/[slug]` detail page (separate PR, depends on this PR).
