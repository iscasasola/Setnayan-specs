# 0041 — Multi-Event Vendor Catalog (Hybrid Taxonomy + Cross-Cutting Tags)

> **Purpose.** Expand Setnayan from wedding-only to all Filipino life events (baptism, debut, birthday, anniversary, corporate, religious gatherings). Lock the platform's service taxonomy as a **hybrid 3-layer hierarchy + cross-cutting tags** so every vendor manages ONE profile that serves multiple event types, every couple/customer browses by event type with faceted filtering, and edge cases (mascot characters, ice cream carts, cigar lounges) resolve via tags rather than category bloat.
>
> **Status:** drafted 2026-05-14 · architecture locked by owner this session after competitive research across Toast, Square, Thumbtack, WeddingWire, TheKnot, Zola, Shopify, Google Product Taxonomy
>
> **2026-05-20 deferral lock — V1.1 vs V2 boundary** (mirror of CLAUDE.md decision-log row dated 2026-05-20):
> - **Wedding** (V1) and **Debut** (V1.1) are the only enabled event_types as of 2026-05-20. The DB `public.event_type` enum carries 8 reserved values; only these two have `enabled: true` in `apps/web/app/dashboard/create-event/_components/event-type-picker.tsx` and `ALLOWED_TYPES` in `apps/web/app/dashboard/create-event/actions.ts`.
> - **Tournament + pageant deferred to V2.** Both need tournament-management tooling (judges scoring · scoreboards · bracket structures · tournament templates · year-long media-contract management) that's a distinct product surface from Setnayan's V1.x event-planning core (vendor coordination · venue booking · budget · guest list). The `tournament` enum value stays reserved; pageant is NOT added to the enum until V2 (will likely model as a `tournament_format` sub-value).
> - **One event = one logical celebration** is the canonical rule. Multi-venue + multi-date scenarios consolidate via a future `event_schedules` table (one row per stage/venue/date/region), NOT via parent/child events nor sibling-series. Wedding ceremony + reception = one event (2 schedule rows when the table ships). Sportsfest = one event (N schedule rows). Wedding + honeymoon = two events (distinct celebrations).
> - **Two-axis sub-pattern locked.** Wedding has `ceremony_type` (catholic/civil/inc/muslim/christian/mixed/cultural — already shipped via iteration 0043). Birthday will have `party_type` (kids/adult/milestone/senior — V1.2+ when birthday enables). Tournament will have `tournament_duration` (one_day · one_week · one_month · one_year — V2). Other event_types add similar sub-axes as cultural reality requires. Mirrors the wedding pattern; avoids enum bloat.
> - **Tournament duration semantics** (for V2 reference): one_day = single-venue performance comp (dance / singing / mini pageant); one_week = city-wide multi-venue sportsfest; one_month = e-sports league (Mobile Legends et al.); one_year = nationwide circuit with regional qualifiers + 1 final venue. Each tier maps to a substantially different vendor pool.
> - **`event_schedules` table also deferred to V2** — the design is documented (above + in the 2026-05-20 decision-log row) but isn't urgent without tournament. The current wedding model flattens church + reception into a single `venue_setting` enum, which is acceptable for V1 even though imperfect.
> - **Setnayan plans events, not tournaments.** V2 tournament-management surface handles brackets / scoring / leaderboards / competitor registration / prize pools. V1.x event-planning handles vendor coordination + venue booking + budget. The boundary is explicit so V2 doesn't bloat the V1 model.
>
> **Companions:** none (markdown-only spec; no `.html`/`.docx` until owner refines)
> **Depends on:** PR #33 (`religious_venue` precursor — merged into the V1.5 list) · supersedes the spec's earlier "28 categories" locked decision (now 38 categories across 8 clusters)
> **Companion iteration:** 0040 (Vendor Catalog v2 — Catalog Studio + modifier groups + CPQ + AI catalog generator) ships wedding-only first; 0041 retrofits 0040 to be event-type-aware once stable

---

## 1. Overview

Setnayan's tagline (auto-injected on every Cowork session) is **"Filipino-first life-events platform."** V1 ships wedding-only. Every Filipino vendor today — caterer, photographer, DJ, host, planner — actually serves *multiple* event types: weddings AND baptisms AND debuts AND birthdays AND anniversaries AND corporate events. The current 29-category wedding-only model (with PR #33's `religious_venue` addition) forces vendors to either mis-categorize themselves for non-wedding work or maintain multiple profiles.

V1.5 fixes this by:
1. Adding `event_type` as a first-class concept (couple's `events.event_type`, vendor's `vendor_profiles.event_types[]`, per-service `vendor_services.event_types[]`)
2. Restructuring the catalog into **8 clusters → 38 categories** so the hierarchy stays manageable
3. Layering **cross-cutting tags** (`settings`, `delivery_type`, `pricing_model`, `synonyms`, `specializations`, `languages`, `travel_zones`) so every cross-cutting attribute filters without polluting the category list
4. Pushing service-level naming down to **vendor-defined Layer 3** so we don't need a category for every niche (cigar lounge attendant, tarot reader, pet coordinator are all SERVICES inside `performers` — not separate categories)

This unblocks Setnayan from competing not just with TheKnot / WeddingWire / Zola (wedding-only directories) but with HoneyBook / Dubsado (general event CRMs) and Bridestory / Kasal (PH wedding directories) — none of which have a configurable catalog system, and most of which have wedding-only or US-centric category lists.

---

## 2. Scope

**V1.5 ships:**

- New `event_type` enum: 7 values (wedding, baptism, debut, birthday, anniversary, corporate, religious_event)
- `events.event_type` column (default `'wedding'` for V1 backfill)
- `vendor_profiles.event_types[]` column (default `['wedding']` for V1 backfill)
- `vendor_services.event_types[]` column (default `['wedding']`)
- New `vendor_services.settings[]`, `delivery_type`, `synonyms[]` (or central synonyms map) columns
- `vendor_category` enum expanded from 29 → 38 values (9 new, 7 renamed via lib-level label changes only, 2 schema-affecting renames that need backfill, 1 deprecation)
- `lib/vendors.ts` regenerated with `VENDOR_CATEGORIES`, `VENDOR_CATEGORY_LABEL`, `CLUSTERS` (was `SERVICE_GROUPS`), `CROSS_LISTED` set, `EVENT_TYPES`, `EVENT_TYPE_LABEL`, `SETTINGS`, `DELIVERY_TYPES`, `SYNONYMS_MAP`
- Vendor onboarding: "Which events do you serve?" multi-select on signup + 2-step service creation picker (Choose Cluster → Identify Service → Configure)
- Couple/customer onboarding: "What event are you planning?" event type picker at event creation
- Couple-side marketplace browse: event-type-aware (couple's event type drives which categories AND vendors surface), with faceted tag filters (settings, languages, travel zones, specializations)
- Vendor-side `/vendors` public marketplace: event-type filter chips (wedding, baptism, debut, birthday, anniversary, corporate, religious_event)
- Backfill scripts for existing data

**V1.5 does NOT ship:**

- Funeral event type (sensitive marketing approach needed — V2 candidate after legal/cultural review)
- "Other" / custom event type (deferred; let real-world demand surface what's missing)
- Configure-Price-Quote (CPQ) booking customization — that's iteration **0040 Vendor Catalog v2** (modifier groups + AI catalog generator + couple-side configurator)
- Per-event-type pricing (same service different prices per event type — open question §10)
- Pro tier feature gating — that's blocked on the Phase 3 marketplace commission model decision (§10)
- New service categories beyond the locked 38 — any future addition goes through this spec's "add a category" amendment process

---

## 3. Architecture (LOCKED — Hybrid 3-Layer + Cross-Cutting Tags)

```
┌──────────────────────────────────────────────────────────────────┐
│  EVENT  →  CLUSTER  →  CATEGORY  →  SERVICE  →  CONFIG           │
│  (tag)      (8)        (38)        (vendor)    (modifier groups) │
│                                                                  │
│            ↑           ↑           ↑           ↑                 │
│         Layer 1     Layer 2     Layer 3     Iteration 0040       │
└──────────────────────────────────────────────────────────────────┘

CROSS-CUTTING TAGS (faceted filters applied per-service):
  • event_types[]     — which life events this service is for
  • settings[]        — indoor / outdoor / covered_outdoor / destination
  • delivery_type     — manpower | equipment | hybrid | space | goods | fees
  • pricing_model     — flat | per_pax | per_hour | per_day | base_plus_pax
  • synonyms[]        — search aliases (per-category, central map)
  • specializations[] — vendor free-form
  • languages[]       — en | tl | ceb | custom
  • travel_zones[]    — PH region tags (vendor-defined)
```

### Why hybrid (not pure hierarchy, not pure tags)

- **Pure hierarchy** is rigid (forces a mascot character to live in exactly one place — either Performers or Game Stations — both wrong)
- **Pure tags** are chaotic (couples can't browse "Photography" if it's just a tag among thousands)
- **Hybrid** = hierarchy for primary mental-model navigation, tags for everything cross-cutting. Validated by Shopify, Google Product Taxonomy (5,585 categories at scale), Toast restaurant POS (modifier groups + items + categories), and modern CPQ platforms.

### Why 3 layers (not 2, not 4)

- **Layer 1 (Cluster)** — high-level mental category. 8 is the cognitive sweet spot (5±2 chunks scale comfortably to 8). Used in the vendor's "Choose a Cluster" picker and the couple's top-level browse.
- **Layer 2 (Category)** — the official platform-recognized service type. 38 covers every Filipino life-event need without over-fragmenting. New categories require spec amendment.
- **Layer 3 (Service)** — vendor-defined free naming. A vendor lists "Sunset Beach Photography Package" inside the `photographer` category. Couples find it via category browse + search across service names + tag filters.

### Why we don't need a category for every niche

The "mascot character" question recurred in the design discussion: should it be its own category? The answer is **no** — it's a *service* (Layer 3) named "Branded Mascot Appearance" inside the `performers` category (Layer 2), tagged `delivery_type: hybrid` (person + costume) and `event_types: [birthday, debut, corporate]`. Same logic for cigar lounge, tarot reader, ice cream cart, face painter, balloon twister, and every future edge case.

**The category answers "where do I list it." Tags answer "who finds it."**

---

## 4. Data model

### 4.1 New enum: `event_type`

```sql
CREATE TYPE public.event_type AS ENUM (
  'wedding',
  'baptism',
  'debut',
  'birthday',
  'anniversary',
  'corporate',
  'religious_event'
);
-- Deferred to V2: 'funeral', 'other'
```

### 4.2 `events` table

```sql
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_type public.event_type NOT NULL DEFAULT 'wedding';
-- Backfill: all existing rows → 'wedding' (the default handles this implicitly for new inserts;
-- for existing data the default applies on add-column so no separate UPDATE needed)
```

### 4.3 `vendor_profiles` table

```sql
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS event_types public.event_type[]
    NOT NULL DEFAULT ARRAY['wedding']::public.event_type[];
-- Backfill: all existing rows → {wedding}
```

### 4.4 `vendor_services` table (significant additions)

```sql
ALTER TABLE public.vendor_services
  ADD COLUMN IF NOT EXISTS event_types public.event_type[]
    NOT NULL DEFAULT ARRAY['wedding']::public.event_type[],
  ADD COLUMN IF NOT EXISTS settings TEXT[]
    NOT NULL DEFAULT ARRAY[]::TEXT[]
    CHECK (settings <@ ARRAY['indoor','outdoor','covered_outdoor','destination']),
  ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'manpower'
    CHECK (delivery_type IN ('manpower','equipment','hybrid','space','goods','fees')),
  -- pricing_model already added in iteration 0040 (modifier groups)
  ADD COLUMN IF NOT EXISTS pricing_model TEXT NOT NULL DEFAULT 'flat'
    CHECK (pricing_model IN ('flat','per_pax','per_hour','per_day','base_plus_pax'));
```

### 4.5 `vendor_category` enum (additions, renames, deprecations)

The enum expands from 29 → 38 values. Migration is additive (`ADD VALUE IF NOT EXISTS`) plus a small backfill for the 2 schema-affecting renames (`band_dj` → split; `string_quartet` + `choir` → merge).

| Action | Enum changes |
|---|---|
| ADD | `bartending_services`, `pre_marital_counseling`, `live_painter`, `calligrapher`, `dj`, `live_band`, `mini_booths`, `game_stations`, `event_rentals`, `child_care`, `dance_instructor`, `ceremony_musicians`, `bar_equipment`, `religious_fees`, `event_stylist`, `jewelry` |
| KEEP (label-only relabel handled in `lib/vendors.ts`) | `venue` ("Reception Venue"), `religious_venue` (from PR #33), `catering`, `officiant`, `photographer`, `videographer`, `florist`, `cake_maker`, `host_emcee`, `transportation`, `security`, `gown_designer`, `suit_designer` ("Suit / Barong Designer"), `hair_stylist`, `makeup_artist`, `planner_coordinator`, `invitations_stationery`, `gifts_and_giveaways` ("Souvenirs / Pasalubong"), `lights_and_sound`, `led_screens` |
| DEPRECATE (still valid enum value for backwards compat; hidden from UI) | `band_dj` (vendors auto-migrated), `string_quartet`, `choir`, `mobile_bar`, `reception_decor`, `church_fees`, `rings`, `photobooth`, `misc` |

**Why we DEPRECATE (not DROP) old enum values:** Postgres enums can't drop values cleanly. We keep them queryable (existing data stays valid) but the lib layer (`VENDOR_CATEGORIES` array, `VENDOR_CATEGORY_LABEL` map) omits them from the UI dropdown. Backfill scripts migrate existing service rows to the new values.

### 4.6 Central synonyms map (in `lib/vendors.ts`, NOT a DB table for V1.5)

```ts
export const CATEGORY_SYNONYMS: Record<VendorCategory, string[]> = {
  venue: ['venue', 'function hall', 'reception hall', 'ballroom', 'garden venue', 'beach venue'],
  religious_venue: ['church', 'chapel', 'temple', 'mosque', 'religious venue'],
  catering: ['caterer', 'food', 'buffet', 'lechon', 'lugaw', 'kakanin'],
  // …38 entries
};
```

Drives search at `/vendors` (couple-side marketplace). If demand surfaces for vendor-customized synonyms (e.g., a caterer who wants "kamayan-style" as a custom search term), promote to a DB column in V1.6.

### 4.7 Cross-listed categories

Exactly one category is currently cross-listed (appears in two cluster browse views, single DB row):

- `religious_venue` appears in BOTH **Cluster 1 (Reception & Foundation)** and **Cluster 2 (Ceremony & Religious)**

Implementation: `CROSS_LISTED: ReadonlySet<VendorCategory> = new Set(['religious_venue'])` in `lib/vendors.ts`. The two-step picker shows it in both clusters; the underlying data is identical.

---

## 5. The 38 categories (LOCKED)

### Cluster 1 · 🏛 Reception & Foundation (5)

| # | Slug | Label | Included services (Layer 3 examples) | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 1 | `venue` | Reception Venue | Hotels, function halls, restaurants for private events, ballrooms, beach resorts, condo function rooms, country clubs, school auditoriums | all 7 | space |
| 2 | `religious_venue` | Religious Ceremony Venue *(cross-listed in Cluster 2)* | Catholic church, chapel, INC chapel, Buddhist temple, Hindu temple, mosque, garden venues that are part of a religious institute | wedding, baptism, religious_event | space |
| 3 | `catering` | Catering | Full-service caterer, **lechon services**, food trucks, private chef, plated dinner, buffet, cocktail reception, halal-certified, vegan-specialty, kakanin/merienda specialist, lugaw/champorado station | all 7 | hybrid |
| 4 | `bartending_services` | Bartending Services | Mixologist for hire, sommelier, coffee station barista, mobile bar staff, cocktail flair bartender | wedding, debut, birthday, anniversary, corporate | manpower |
| 5 | `bar_equipment` | Bar Equipment & Rental *(was: `mobile_bar`)* | Bar setup/teardown, glassware rental, drink dispensers, kegs, mocktail station equipment, espresso machine, juice dispensers | all 7 except baptism | equipment |

### Cluster 2 · ⛪ Ceremony & Religious (5)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 6 | `officiant` | Officiant | Catholic priest, Christian pastor, INC minister, imam, civil judge, non-denominational officiant, multilingual officiant | wedding, baptism, religious_event | manpower |
| 7 | `religious_fees` | Religious Ceremony Fees *(was: `church_fees`)* | Parish fees, sacrament fees, stipend/donation, mosque fees, temple fees, candle/flower offerings | wedding, baptism, religious_event | fees |
| 8 | `ceremony_musicians` | Ceremony Musicians *(CONSOLIDATES `string_quartet` + `choir`)* | String quartet, full choir, solo violin, solo pianist/organist, acoustic guitarist, harpist, chamber ensemble, scripture-music singer | wedding, baptism, debut, religious_event | manpower |
| 9 | `pre_marital_counseling` | Pre-Marital Counseling | Catholic pre-cana seminar, marriage encounter weekend, diocesan seminar, premarital therapy/counseling, couple workshops | wedding | manpower |
| — | *(`religious_venue` cross-listed from Cluster 1)* | — | — | — | — |

### Cluster 3 · 📸 Media & Documentation (4)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 10 | `photographer` | Photographer | Event photographer, pre-event/engagement shoot, debut shoot, baptism shoot, same-day-edit photographer, photojournalistic, portrait specialist, prenup shoot | all 7 | manpower |
| 11 | `videographer` | Videographer | Cinematographer, documentary videographer, same-day-edit videographer, livestream service, drone videographer, music-video-style | all 7 | manpower |
| 12 | `live_painter` | Live Painter / Artist | Live event painter, caricature artist, sketch artist, custom portrait artist | wedding, debut, birthday, anniversary, corporate | manpower |
| 13 | `calligrapher` | Calligrapher / Custom Art | Hand-lettered signage, place cards, welcome boards, menu cards, table numbers, custom keepsake calligraphy, custom monogram art | all 7 | hybrid |

### Cluster 4 · 🎵 Music & Entertainment (6)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 14 | `dj` | DJ / Music Provider *(SPLIT from `band_dj`)* | Wedding DJ, debut DJ, party DJ, corporate event DJ, sound design, OPM specialist DJ, club-style DJ, throwback DJ | wedding, debut, birthday, anniversary, corporate, religious_event | hybrid |
| 15 | `live_band` | Live Band *(SPLIT from `band_dj`)* | Cover band, acoustic duo/trio, jazz band, full reception band, OPM band, rock band, gospel band | wedding, debut, birthday, anniversary, corporate, religious_event | manpower |
| 16 | `host_emcee` | Host / Emcee | Bilingual EN/Tagalog emcee, comedian emcee, debut emcee specialist, corporate event host, wedding emcee, baptism host, kids party host | all 7 | manpower |
| 17 | `performers` | Performers / Entertainment | Dance troupe, magician, fire dancers, **cotillion dance group**, belly dancer, tarot reader, fortune teller, drum corps, stilt walkers, mascot characters, cigar lounge attendant, hookah operator | wedding, debut, birthday, anniversary, corporate, religious_event | hybrid |
| 18 | `mini_booths` | Mini Booths / Interactive Booths *(was: `photobooth`)* | Classic photo booth, 360° video booth, GIF/boomerang booth, AR/Snapchat booth, magic mirror booth, slow-mo booth, selfie booth, roaming-photographer booth | wedding, debut, birthday, anniversary, corporate | equipment |
| 19 | `game_stations` | Game Stations & Activity Rentals | Arcade machine rental, **claw machine**, pinball, carnival/midway games, lawn games (giant Jenga, cornhole, croquet), casino tables, VR experiences, **bounce house/inflatables**, face painting station, balloon twister, ice cream/popcorn/candy cart | debut, birthday, anniversary, corporate, religious_event | equipment |

### Cluster 5 · 🌸 Decor & Production (6)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 20 | `florist` | Florist | Bouquets, boutonnières, centerpieces, floral arches, aisle florals, hanging installations, ceremony backdrop florals, **sampaguita garlands**, bridal car florals | all 7 | hybrid |
| 21 | `event_stylist` | Event Stylist / Decor *(was: `reception_decor`)* | Theme curation, backdrops, **balloon installations**, table settings, signage, draping, props, candle styling, decorative lighting design, Instagram-able installation | all 7 | hybrid |
| 22 | `cake_maker` | Cake & Sweets | Wedding cake, cupcake tower, dessert table, **kakanin/Filipino sweets bar**, candy buffet, debut cake, baptism cake, kids' birthday cake, pastry chef | all 7 | goods |
| 23 | `lights_and_sound` | Lights & Sound *(kept slug, label clarification)* | Audio system rental, stage lighting, mic setup, in-ear monitors, line array, par cans, intelligent lighting, color wash, follow spot | wedding, debut, birthday, anniversary, corporate, religious_event | equipment |
| 24 | `led_screens` | LED Screens / Video Wall | LED video walls, projector + screen, live event display feed, slow-mo replay, presentation screens, lobby signage | wedding, debut, corporate, religious_event | equipment |
| 25 | `event_rentals` | Event Rentals | Tables, chairs, chiavari/tiffany chairs, linens, drape, dance floor, generator, tent, podium, kids' table sets | all 7 | equipment |

### Cluster 6 · 👗 Attire & Beauty (5)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 26 | `gown_designer` | Gown Designer | Bridal gown, **debut gown**, maid of honor / bridesmaid, mother of bride/groom, **Filipiniana terno**, custom couture, ready-to-wear, gown rental | wedding, debut, anniversary | goods |
| 27 | `suit_designer` | Suit / Barong Designer *(label adds Barong)* | Groom suit, **barong tagalog**, groomsmen, **Filipiniana for men**, fathers attire, formal suits, custom tailoring | wedding, debut, anniversary, corporate | goods |
| 28 | `hair_stylist` | Hair Stylist | Bridal hair, debut hair, event styling, on-location service, hair extensions, hair color refresh | wedding, debut, anniversary, birthday | manpower |
| 29 | `makeup_artist` | Makeup Artist | Bridal makeup, HD/airbrush, debut makeup, special effects makeup, on-location, kids makeup (themed), gentle makeup for first-timers | wedding, debut, anniversary, birthday | manpower |
| 30 | `jewelry` | Jewelry *(was: `rings`, expanded)* | Wedding rings, engagement ring, **debut tiara**, bridal jewelry set, earrings/necklace coordination, custom pieces, jewelry rental for events | wedding, debut, anniversary | goods |

### Cluster 7 · 🚗 Logistics & Support (5)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 31 | `planner_coordinator` | Event Planner / Coordinator *(kept slug)* | Full-service planner, day-of coordinator, month-of coordinator, designer/stylist, debut planner, baptism planner, corporate event planner | all 7 | manpower |
| 32 | `transportation` | Transportation | Bridal car (decorated), limousine, guest shuttle, **kalesa (heritage weddings)**, vintage car, party bus, **jeepney rental** | all 7 | hybrid |
| 33 | `security` | Security | Event security, crowd control, VIP protection (for celebrity guests), perimeter security, parking management | all 7 | manpower |
| 34 | `child_care` | Child Care Services | On-site babysitting (critical for PH family events), kids' entertainment area, kids' magician/face painter, kids' food station, kids activities supervisor | all 7 | manpower |
| 35 | `dance_instructor` | Dance Instructor | First-dance lessons, **cotillion practice (debut staple)**, waltz/ballroom lesson, salsa lesson, choreography for performance | wedding, debut | manpower |

### Cluster 8 · 🎁 Print & Gifts (2)

| # | Slug | Label | Included services | Default `event_types` | `delivery_type` |
|---|---|---|---|---|---|
| 36 | `invitations_stationery` | Invitations & Stationery | Save-the-date, invitation suite, RSVP cards, programs, menus, thank-you cards, baby christening invitations, **debut invitation**, digital invitation design | all 7 | goods |
| 37 | `gifts_and_giveaways` | Souvenirs / Pasalubong *(kept slug, label clarified)* | Wedding favors, **debut giveaways**, baptism tokens, **Filipino-themed pasalubong**, personalized items, kids' birthday loot bags, custom keepsakes, coin/sand/butterflies for ceremony | all 7 | goods |

### Deprecated (data still valid; UI hides)

`misc` — catch-all redundant when vendors can name services freely at Layer 3. Existing rows tagged `misc` migrate by hand or get a "Please re-categorize" prompt on next vendor login.

---

## 6. UI / UX

### 6.1 Vendor: "Create a new service" — 2-step picker

```
┌─ Step 1: Choose a Cluster ──────────────────────┐
│                                                  │
│  🏛  Reception & Foundation     5 categories     │
│  ⛪  Ceremony & Religious       5 categories     │
│  📸  Media & Documentation      4 categories     │
│  🎵  Music & Entertainment      6 categories     │
│  🌸  Decor & Production         6 categories     │
│  👗  Attire & Beauty            5 categories     │
│  🚗  Logistics & Support        5 categories     │
│  🎁  Print & Gifts              2 categories     │
│                                                  │
└──────────────────────────────────────────────────┘
              ↓ (vendor clicks 🎵)
┌─ Step 2: Identify Your Service ────────────────────┐
│  Music & Entertainment > Pick one:                  │
│                                                     │
│  🎧  DJ / Music Provider                           │
│  🎸  Live Band                                     │
│  🎤  Host / Emcee                                  │
│  ⭐  Performers / Entertainment                    │
│  🎪  Mini Booths / Interactive Booths              │
│  🎮  Game Stations & Activity Rentals              │
│                                                     │
│  [← Back to clusters]                              │
└────────────────────────────────────────────────────┘
              ↓ (vendor clicks 🎧)
┌─ Step 3: Configure Your Service ──────────────────┐
│  (handed off to iteration 0040 Catalog Studio:     │
│   modifier groups, pricing model, photos/videos,   │
│   AI catalog generator, event_types selector,      │
│   settings selector)                               │
└────────────────────────────────────────────────────┘
```

### 6.2 Vendor onboarding: "Which events do you serve?"

At signup, the vendor checks the events they serve at the profile level:

```
☑ Wedding
☑ Baptism
☑ Debut
☑ Birthday
☐ Anniversary       ← vendor opts in/out per event type
☐ Corporate
☐ Religious event
```

Defaults: all 7 for new vendors (broadest reach). Vendor can narrow at any time via profile editor. Existing V1 vendors backfilled to `['wedding']` only — they get a one-time prompt to expand on next login.

### 6.3 Couple-side: "What event are you planning?"

At event creation, the couple/customer picks their event type:

```
What are you planning?
○ Wedding              (full Setnayan wedding suite — guests, seating, RSVPs, registry)
○ Baptism              (lighter weight — guest list, location, vendor coordination)
○ Debut                (Filipino 18th birthday — full suite minus seating-by-tables)
○ Birthday             (any age — kids, milestones, adult parties)
○ Anniversary          (silver, golden, vow renewals)
○ Corporate event      (company events, conferences, team-building)
○ Religious event      (fiesta, Christmas party, family reunion, pamisa)
```

The selected event type drives:
- Which dashboard tiles surface (e.g., no "Officiant" tile for a birthday)
- Which vendor categories the marketplace filters to
- Which dashboard copy uses ("Wedding day" vs "Event day" vs "Birthday party")
- Which iteration 0028 email templates fire

### 6.4 Couple-side marketplace: faceted browse

```
/vendors?event=birthday

┌─── Filters ──────────┐    ┌─── Results ──────────────┐
│ Event type:          │    │ Photographers (3)        │
│  ◉ Birthday         │    │   • Sunset Studios       │
│                      │    │   • Childhood Memories   │
│ Setting:             │    │   • Quick Cam Bday       │
│  ☑ Indoor           │    │                          │
│  ☑ Outdoor          │    │ Game Stations (8)        │
│  ☐ Covered outdoor  │    │   • Bounce House Bro     │
│                      │    │   • Arcade On Wheels     │
│ Category cluster:    │    │   ...                    │
│  ☑ Game Stations    │    │                          │
│  ☑ Photographer     │    │ Mini Booths (5)          │
│  ☑ Mini Booths      │    │   ...                    │
│  ☐ Catering         │    │                          │
│                      │    │ Cake & Sweets (12)       │
│ Language:            │    │   ...                    │
│  ☑ English          │    │                          │
│  ☑ Tagalog          │    │                          │
│                      │    │                          │
│ Travel zone:         │    │                          │
│  ☑ Metro Manila     │    │                          │
└──────────────────────┘    └──────────────────────────┘
```

Categories that aren't in `applies_to_events` for the selected event type are hidden by default (with a "Show all categories" escape hatch). E.g., for birthday: Officiant / Pre-Marital Counseling / Religious Fees / Religious Venue / Religious Musicians are hidden.

### 6.5 Manpower vs Equipment distinction surfacing

On vendor service-creation form (Step 3), the `delivery_type` tag drives a subtle UI nudge:

- `manpower` → vendor sees "Crew size" and "Hours of availability" fields prominently
- `equipment` → vendor sees "Setup time" and "Operating duration" fields prominently
- `hybrid` → vendor sees both
- `space` → vendor sees "Capacity (pax)" prominently
- `goods` → vendor sees "Lead time for production" prominently
- `fees` → vendor sees "Payment instructions / pass-through detail" prominently

Couple-side, these tags drive subtle UX too (e.g., a `manpower` service shows the operator's name and photo on the listing card; an `equipment` service shows photos of the gear).

---

## 7. Migration path

### 7.1 Schema migration (single migration file)

```sql
-- 20260520000000_iteration_0041_multi_event.sql

-- 1. New event_type enum
CREATE TYPE public.event_type AS ENUM (
  'wedding','baptism','debut','birthday','anniversary','corporate','religious_event'
);

-- 2. New event_type column on events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS event_type public.event_type NOT NULL DEFAULT 'wedding';

-- 3. event_types[] on vendor_profiles
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS event_types public.event_type[]
    NOT NULL DEFAULT ARRAY['wedding']::public.event_type[];

-- 4. event_types[], settings[], delivery_type on vendor_services
ALTER TABLE public.vendor_services
  ADD COLUMN IF NOT EXISTS event_types public.event_type[]
    NOT NULL DEFAULT ARRAY['wedding']::public.event_type[],
  ADD COLUMN IF NOT EXISTS settings TEXT[]
    NOT NULL DEFAULT ARRAY[]::TEXT[]
    CHECK (settings <@ ARRAY['indoor','outdoor','covered_outdoor','destination']),
  ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'manpower'
    CHECK (delivery_type IN ('manpower','equipment','hybrid','space','goods','fees'));

-- 5. New vendor_category enum values (additive, idempotent)
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'bartending_services';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'bar_equipment';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'pre_marital_counseling';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'ceremony_musicians';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'religious_fees';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'live_painter';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'calligrapher';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'dj';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'live_band';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'mini_booths';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'game_stations';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'event_stylist';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'event_rentals';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'jewelry';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'child_care';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'dance_instructor';
-- religious_venue already added in PR #33

-- 6. Backfill: rewrite old category values to new ones
-- Note: postgres can't drop enum values; these are migrate-and-leave-behind.
UPDATE public.vendor_services SET category = 'bar_equipment'      WHERE category = 'mobile_bar';
UPDATE public.vendor_services SET category = 'religious_fees'     WHERE category = 'church_fees';
UPDATE public.vendor_services SET category = 'event_stylist'      WHERE category = 'reception_decor';
UPDATE public.vendor_services SET category = 'mini_booths'        WHERE category = 'photobooth';
UPDATE public.vendor_services SET category = 'jewelry'            WHERE category = 'rings';

-- string_quartet + choir → ceremony_musicians (consolidation)
UPDATE public.vendor_services SET category = 'ceremony_musicians' WHERE category IN ('string_quartet','choir');

-- band_dj → split. Strategy: duplicate the service row so vendors keep both listings,
-- they can clean up on next login. Conservative choice over auto-picking one.
INSERT INTO public.vendor_services (vendor_profile_id, category, name, /* other fields… */)
  SELECT vendor_profile_id, 'dj', name || ' (DJ)', /* same fields */
  FROM public.vendor_services
  WHERE category = 'band_dj';
UPDATE public.vendor_services SET category = 'live_band', name = name || ' (Live Band)'
  WHERE category = 'band_dj';
-- After this: every old 'band_dj' service is now 2 rows (one 'dj', one 'live_band').
-- Vendor can delete whichever doesn't apply on next login.

-- misc: leave existing rows as-is; UI hides 'misc' from new picker; nudge vendor to recategorize
-- on next login. No automated migration since 'misc' might genuinely be miscellaneous.

COMMIT;
```

### 7.2 Lib-layer migration (`apps/web/lib/vendors.ts`)

- Rewrite `VENDOR_CATEGORIES` array to 38 entries (active categories only; old deprecated values omitted)
- Rewrite `VENDOR_CATEGORY_LABEL` map with new labels (Reception Venue, Suit / Barong Designer, Religious Ceremony Fees, Souvenirs / Pasalubong, etc.)
- Rename `SERVICE_GROUPS` → `CLUSTERS` with 8 groups
- Add `CROSS_LISTED: ReadonlySet<VendorCategory>` set containing `'religious_venue'`
- Add `EVENT_TYPES: ReadonlyArray<EventType>` and `EVENT_TYPE_LABEL`
- Add `SETTINGS`, `DELIVERY_TYPES` enums and labels
- Add `CATEGORY_DEFAULT_EVENT_TYPES: Record<VendorCategory, EventType[]>` (the "applies to events" matrix)
- Add `CATEGORY_DEFAULT_DELIVERY_TYPE: Record<VendorCategory, DeliveryType>`
- Add `CATEGORY_SYNONYMS: Record<VendorCategory, string[]>`

### 7.3 UI migration

- Vendor onboarding flow: insert "Which events do you serve?" multi-select step (defaults to all 7 for new vendors)
- Vendor service-creation form: replace single-step category picker with 2-step Cluster → Category picker
- Vendor service-creation form: add `event_types`, `settings`, `delivery_type` tag selectors (default to vendor profile's `event_types` for `event_types`; default to all for `settings`; default to category's `delivery_type` for delivery_type)
- Couple event creation: add event type picker (`/dashboard/new-event` form)
- Couple-side dashboard: rebrand all "wedding" copy to event-type-aware copy via `lib/i18n` (currently has EN/TL locale toggle from iteration 0025; piggyback the same machinery)
- Couple-side marketplace: add event_type filter chips + faceted tag filters
- Vendor public marketplace `/vendors`: add event_type filter
- Public API `/api/v1/vendors`: add `?event_type=X` and `?settings[]=indoor` query params

### 7.4 Backfill prompts

On first login after migration:
- Vendors with `event_types = ['wedding']` see a banner: "You can now serve baptisms, debuts, birthdays, and more. [Update your event types]"
- Vendors with auto-duplicated `band_dj → dj + live_band` services see a banner: "We split your DJ/Band service into two. Review both and delete the one you don't offer."
- Vendors with `misc` services see a banner: "Re-categorize your 'Misc' services with the new 38-category picker."

### 7.5 Order-of-operations on rollout

1. Apply schema migration (5 min, idempotent, safe)
2. Deploy lib + UI changes (Vercel auto-deploys)
3. Existing data continues to work (backfill defaults handle old rows)
4. Vendors see banners on next login; they opt in to new event types at their own pace
5. After 30 days, run a one-time SQL job to flag vendors who haven't opted into additional event types (no auto-update; just a stat for the team)

---

## 8. Tests (scenario-based validation)

The taxonomy must pass these real-world user journeys. Each scenario is a hand-walk through the couple's experience:

### 8.1 Catholic wedding (V1 parity)

Couple plans a Catholic wedding. Should find via marketplace:
- ✅ Reception Venue, Religious Ceremony Venue, Catering, Bartending Services, Bar Equipment
- ✅ Officiant, Religious Ceremony Fees, Ceremony Musicians, Pre-Marital Counseling
- ✅ Photographer, Videographer, Live Painter, Calligrapher
- ✅ DJ, Live Band, Host/Emcee, Performers, Mini Booths
- ✅ Florist, Event Stylist, Cake & Sweets, Lights & Sound, LED Screens, Event Rentals
- ✅ Gown Designer, Suit/Barong Designer, Hair Stylist, Makeup Artist, Jewelry
- ✅ Planner, Transportation, Security, Child Care, Dance Instructor
- ✅ Invitations & Stationery, Souvenirs / Pasalubong
- ❌ Game Stations should NOT surface by default (couples can opt in via filter override)

### 8.2 Kids' 7th birthday party

Couple plans their child's 7th birthday. Should find:
- ✅ Reception Venue (with `settings: outdoor` filter common — backyards), Catering, Cake & Sweets, Bar Equipment (for adult drinks)
- ✅ Photographer (with event_types `birthday`), Videographer
- ✅ Host/Emcee (kids party host), Performers (clown, magician, mascot)
- ✅ Mini Booths (photo booth themed), Game Stations (bounce house, face painting, balloon twister)
- ✅ Event Stylist (theme decor), Florist, Event Rentals, Lights & Sound (party music setup)
- ✅ Child Care (for parents who want to relax)
- ✅ Invitations & Stationery, Souvenirs / Pasalubong (loot bags)
- ❌ Officiant, Religious Fees, Religious Musicians, Pre-Marital Counseling, Religious Venue, Gown, Suit, Hair, Makeup, Jewelry, Dance Instructor, Transportation (bridal car), Bartending Services should NOT surface
- ❌ LED Screens, Security typically not needed for small birthday

### 8.3 Debut (Filipino 18th birthday)

Should find:
- ✅ Reception Venue (often hotel ballroom), Catering, Bartending Services, Bar Equipment
- ✅ Photographer (debut shoot specialty), Videographer, Live Painter, Calligrapher
- ✅ DJ, Live Band, Host/Emcee (debut emcee specialist), Performers (cotillion dance group, fire dancers), Mini Booths (photo booth heavy), Game Stations (debut activities)
- ✅ Florist, Event Stylist, Cake & Sweets, Lights & Sound, LED Screens, Event Rentals
- ✅ Gown Designer (debut gown — different cut from bridal), Suit/Barong Designer (escorts attire), Hair Stylist, Makeup Artist, Jewelry (tiara)
- ✅ Planner, Transportation (party bus or bridal-car-style), Security, Child Care (younger cousins)
- ✅ Dance Instructor (cotillion practice — REQUIRED for traditional debut)
- ✅ Invitations & Stationery, Souvenirs / Pasalubong (debut giveaways)
- ❌ Religious Venue, Officiant, Religious Fees, Religious Musicians, Pre-Marital Counseling should NOT surface

### 8.4 Corporate company anniversary event

Should find:
- ✅ Reception Venue, Catering, Bartending Services, Bar Equipment
- ✅ Photographer (corporate event), Videographer (livestream), Calligrapher (signage)
- ✅ DJ, Host/Emcee (corporate event host), Performers (entertainment acts), Mini Booths, Game Stations (casino night)
- ✅ Florist (minimal), Event Stylist (branded decor), Cake & Sweets, Lights & Sound, LED Screens (presentation), Event Rentals
- ✅ Suit/Barong Designer (executive attire — V1.5 nice-to-have)
- ✅ Planner, Transportation (shuttle), Security
- ✅ Invitations & Stationery (corporate invites)
- ❌ Religious Venue, Officiant, Religious Fees, Religious Musicians, Pre-Marital Counseling, Gown, Hair, Makeup, Jewelry, Dance Instructor, Child Care, Souvenirs (depending — could be giveaways) should typically not surface as defaults

### 8.5 Baptism (PH Catholic)

Should find:
- ✅ Reception Venue (after-baptism luncheon), Religious Ceremony Venue (church), Catering, Cake & Sweets
- ✅ Photographer (baptism shoot), Videographer
- ✅ Host/Emcee (baptism host — light), Calligrapher (signage)
- ✅ Officiant (priest), Religious Ceremony Fees, Ceremony Musicians (lighter choir)
- ✅ Florist (church flowers, table centerpieces), Event Stylist (theme decor — often pastel)
- ✅ Planner, Transportation (family car), Security (rarely), Child Care (lots of small kids)
- ✅ Invitations & Stationery (christening invites), Souvenirs (baptism tokens)
- ❌ Religious Musicians' "string quartet" sub-service rare for baptism; Bartending, Bar Equipment, Performers, Mini Booths, Game Stations, LED Screens, Gown/Suit/Jewelry typically not needed
- ❌ Pre-Marital Counseling not applicable

### 8.6 Religious event (fiesta, Christmas party, family reunion)

Should find:
- ✅ Reception Venue, Catering, Cake & Sweets
- ✅ Photographer (event photog), Videographer
- ✅ DJ, Live Band, Host/Emcee, Performers, Mini Booths, Game Stations (for community fun)
- ✅ Florist, Event Stylist, Lights & Sound, LED Screens, Event Rentals
- ✅ Planner, Transportation, Security
- ✅ Officiant (for prayer/blessing), Ceremony Musicians (choir for fiesta)
- ✅ Invitations & Stationery, Souvenirs
- ❌ Pre-Marital Counseling, Gown/Suit (formal wear specific to wedding/debut), Jewelry, Dance Instructor not typically needed

### 8.7 Anniversary (silver, golden, vow renewal)

Should find:
- ✅ Reception Venue, Religious Ceremony Venue (for vow renewal), Catering, Bartending, Bar Equipment
- ✅ Officiant (for vow renewal), Religious Ceremony Fees, Ceremony Musicians
- ✅ Photographer, Videographer, Live Painter, Calligrapher
- ✅ DJ, Live Band, Host/Emcee, Performers, Mini Booths
- ✅ Florist, Event Stylist, Cake & Sweets, Lights & Sound, LED Screens, Event Rentals
- ✅ Gown Designer, Suit/Barong, Hair, Makeup, Jewelry
- ✅ Planner, Transportation, Security, Child Care, Dance Instructor (first-dance refresh)
- ✅ Invitations & Stationery, Souvenirs
- ❌ Game Stations, Pre-Marital Counseling not typically needed

### 8.8 Edge-case service discovery

These services must surface via the right category + tags:

| Service | Category (Layer 2) | Tags |
|---|---|---|
| Branded mascot for kids' birthday | `performers` | `delivery_type: hybrid`, `event_types: [birthday, debut]` |
| Cigar lounge for corporate gala | `performers` | `delivery_type: hybrid`, `event_types: [wedding, debut, corporate]`, `specializations: 18+` |
| Tarot reader at a debut | `performers` | `delivery_type: manpower`, `event_types: [debut, birthday]`, `specializations: mystical` |
| Ice cream cart at a kids' party | `game_stations` | `delivery_type: hybrid`, `event_types: [birthday, debut]`, `specializations: food-as-activity` |
| Face painter at a birthday | `game_stations` | `delivery_type: hybrid`, `event_types: [birthday, debut]` |
| Sampaguita garland for a wedding | `florist` | `delivery_type: hybrid`, `event_types: [wedding, religious_event]`, `specializations: traditional Filipino` |
| Lechon catering for fiesta | `catering` | `delivery_type: hybrid`, `event_types: all 7`, `specializations: lechon` |
| Kalesa for heritage wedding | `transportation` | `delivery_type: hybrid`, `event_types: [wedding]`, `specializations: heritage` |
| Cotillion practice for debut | `dance_instructor` | `delivery_type: manpower`, `event_types: [debut]` |
| Catholic pre-cana | `pre_marital_counseling` | `delivery_type: manpower`, `event_types: [wedding]`, `specializations: Catholic` |

### 8.9 Migration correctness

For every existing vendor in production (currently small N — owner + test accounts):
- ✅ Existing event row gets `event_type = 'wedding'`
- ✅ Existing vendor_profile gets `event_types = ['wedding']`
- ✅ Existing vendor_service rows get `event_types = ['wedding']`
- ✅ Existing `mobile_bar` services migrate to `bar_equipment`
- ✅ Existing `church_fees` migrate to `religious_fees`
- ✅ Existing `reception_decor` migrate to `event_stylist`
- ✅ Existing `photobooth` migrate to `mini_booths`
- ✅ Existing `rings` migrate to `jewelry`
- ✅ Existing `string_quartet` + `choir` migrate to `ceremony_musicians`
- ✅ Existing `band_dj` are duplicated into `dj` + `live_band` rows with name suffixes; vendor cleans up on next login
- ✅ `misc` rows are untouched; vendor sees a banner prompting recategorization
- ✅ No data lost; no silent failures

---

## 9. Companion iteration coordination (0040 vs 0041)

Iteration **0040 Vendor Catalog v2** (designed in parallel during the same 2026-05-14 session) introduces:
- Modifier groups (reusable libraries; couple-side configurator)
- Pricing models (flat, per_pax, per_hour, per_day, base_plus_pax)
- AI catalog generator (text + voice + photo-OCR input → structured catalog)
- Collaborative deal rooms

Iteration **0041 Multi-Event Support** (this doc) introduces:
- Event types
- Cluster→Category 2-step picker
- Cross-cutting tag layer
- Multi-event vendor profile model

**Sequencing:** 0040 ships first (wedding-only) so the configurable catalog system is stable and proven. 0041 retrofits it to be event-type-aware. The schema design (above) is forward-compatible — `vendor_services.event_types[]` can be added on top of 0040 without breaking it.

If pressed to ship one before the other:
- **Ship 0041 first** if multi-event reach matters more than catalog richness (broader vendor adoption, less moat)
- **Ship 0040 first** if the configurable catalog moat matters more than event-type breadth (deeper moat, slower vendor adoption)

Owner's current call (2026-05-14) is to ship 0040 first (V1.0 → V1.1), then 0041 (V1.1 → V1.5).

---

## 10. Open questions for the owner

These need owner answers before the implementation iteration starts:

### 10.1 Phase 3 marketplace commission model decision (BLOCKING)

V1.5 introduces multi-event support but does NOT introduce vendor monetization. The Phase 3 commission decision (already on STATUS.md as decision-gated) determines whether 0041 also ships a Pro tier feature gate. Three options:

- **Free forever** — no gating, every vendor gets every feature including multi-event support
- **Commission per booking** — Free tier ships full features; Setnayan takes % of completed bookings
- **Paid Pro subscription** — Free tier ships single-event-type (wedding-only) profiles; Pro unlocks multi-event + CPQ + AI catalog generator + collaborative deal rooms

Decision affects whether 0041's vendor onboarding asks "Which events do you serve?" universally or only for Pro vendors.

### 10.2 Funeral event type V2 timing

Filipino funerals are a real market with real vendor needs (catering, florals, transportation, religious officiant for the wake/burial mass, religious musicians for sympathy choir, photographer for documenting the wake, video for distant relatives streaming in). But:
- Marketing is sensitive — Setnayan branding/copy needs adjustment for grief-context
- Some vendors (e.g., kids party hosts, balloon twisters) explicitly do NOT want to be in this market
- Requires per-vendor opt-in even more than other event types

Recommended approach: add `funeral` as a hidden opt-in event type in V1.6 with a separate vendor onboarding flow ("Are you willing to serve memorial services?"). Defer beyond V1.5.

### 10.3 Auto-tag existing wedding vendors

Should existing V1 vendors who currently have `event_types = ['wedding']` be auto-tagged for additional event types based on category likelihood (e.g., a Photographer → auto-tag for all 7, a Religious Fees → keep wedding-only)? Or should they explicitly opt in?

- **Auto-tag pro:** vendors immediately discoverable for non-wedding events without lifting a finger; broader reach faster
- **Auto-tag con:** vendor might not want non-wedding bookings; could feel like over-reach

Recommended: opt-in by default for V1.5 launch. After 30 days, if data shows vendors aren't opting in, switch to opt-out for the largest cluster (Music & Entertainment, Documentation).

### 10.4 Per-event-type pricing

A wedding catering package at ₱2,500/pax is rarely the same as a birthday catering package at the same scale. Should `vendor_services` allow different prices per event type, OR should vendors create separate service rows per event type?

- **Different prices per event type:** richer model, supports the real-world pricing reality (wedding premium); requires schema for `prices_by_event_type JSONB`
- **Separate service rows:** simpler; vendor manages "Catering — Wedding" and "Catering — Birthday" as separate listings

Recommended: separate service rows for V1.5 (KISS). Revisit in V2 if vendor feedback demands it.

### 10.5 Bartending Services vs. Bar Equipment split — verify with real vendors

The split (locked by owner this session per the manpower-vs-equipment distinction) needs validation with 3-5 real Filipino bar vendors. Most PH "mobile bar" vendors bundle equipment + bartender. If real-world feedback says "this split annoys me, I'd rather list once," reconsider in V1.6.

### 10.6 Cross-listed `religious_venue` UX

`religious_venue` cross-lists in Cluster 1 (Reception & Foundation) AND Cluster 2 (Ceremony & Religious). Two open UX questions:
- When a vendor lists a religious_venue service, do they see it in BOTH clusters in their service list, or just one (their primary)?
- When a couple browses Cluster 1 to find a Reception Venue, should they see religious_venue listings inline, or get a "Religious Venues are listed separately in Ceremony & Religious" link?

Recommended: vendor sees one canonical entry tagged "cross-listed in both Reception & Foundation and Ceremony & Religious"; couple browse hides religious_venue from Cluster 1 view by default but shows a "Also see: Religious Ceremony Venues" link at the top of the Reception Venue category.

### 10.7 Synonyms — central or per-vendor?

V1.5 ships with a CENTRAL `CATEGORY_SYNONYMS` map in `lib/vendors.ts`. Should vendors be allowed to add their own per-service synonyms in V1.6+?

- **Per-vendor synonyms:** richer search, vendor knows their niche better (e.g., "kamayan-style catering" as a search term)
- **Central only:** controlled, no spam, scalable

Recommended: central only for V1.5; per-vendor in V2 if search analytics shows misses.

### 10.8 How does 0041 interact with iteration 0040 (Catalog Studio + AI catalog generator)?

The AI catalog generator (0040) should be aware of event types when generating catalogs. A vendor saying "I'm a Catholic wedding caterer" should generate a catering service tagged `event_types: [wedding]` and `specializations: [Catholic, Filipino]`. The prompts to the LLM need to surface event types as a structured output.

Coordination: 0041 spec doc (this one) lists event types as data model facts. 0040 spec doc (separate) should reference 0041's event types as input to the AI prompts.

### 10.9 PostHog funnel tracking for event type breakdown

Once V1.5 ships, observability needs to track:
- Signups by event type (which is most common for couple onboarding?)
- Vendor profile completion rate by event_types opt-in count (do vendors who serve more events have higher completion?)
- Marketplace browse → booking conversion rate by event type (which events have highest conversion?)

This is iteration 0035 Observability follow-on, not blocking 0041 ship.

---

## 11. Resume checklist (for whoever picks this up next)

When implementation kicks off:

1. Read this spec end-to-end
2. Read the locked taxonomy table in § 5 carefully
3. Verify the 38 categories haven't shifted by checking with the owner
4. Resolve the 9 open questions in § 10 (especially Phase 3 commission model)
5. Branch off latest main: `git checkout -b claude/iteration-0041-multi-event`
6. Schema migration first (§ 7.1) — apply, smoke-test, verify all existing rows survive
7. Lib changes second (§ 7.2)
8. UI third (§ 7.3) — vendor onboarding, service creation, couple event creation, marketplace
9. Backfill prompts fourth (§ 7.4) — banners on first login
10. Tests: run § 8 scenarios manually + automated, then add to playwright suite

Spawning parallel agents (the workflow proven on 2026-05-14):
- Agent 1: schema + lib rewrite (foundational, others wait for this)
- Agent 2: vendor onboarding + service creation UI
- Agent 3: couple event creation + marketplace UI
- Agent 4: backfill prompts + post-migration vendor experience

Estimated parallel-agent effort: 5-7 days end-to-end (schema 1 day, lib 1 day, UI 3-4 days, polish 1 day).

---

*Drafted 2026-05-14 by owner + Claude Code session. Will refine in Cowork.*
