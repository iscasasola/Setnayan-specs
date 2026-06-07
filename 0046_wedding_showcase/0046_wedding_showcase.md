# Iteration 0046 — Wedding Showcase (Real Weddings)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **NOT BUILT** — there is **no** `/real-weddings` browse, **no** showcase tables (`wedding_showcases` / `_vendor_credits` / `_captures` / `_product_credits` / `_facets` / `_vendor_claims` are all absent), **no** couple/vendor showcase routes, and **no** `wedding_guest_reviews` / `vendor_event_feedback` tables. The whole iteration is unshipped.
> - **The 5% Setnayan Pay fee this spec is built around is RETIRED** — commission is now **0%, ever**, and vendor↔customer money is **off-platform** (RA 11967). The entire "two-tier editorial credit (Verified = paid 5% Pay / Claimed = free)" mechanic and the "what the 5% buys" value-bundle table are obsolete; there is no Setnayan Pay escrow/`bookings` ledger to gate Verified credits on.
> - **Couple Keepsake Bundle ₱2,499 SKU NOT in the catalog** — it is not in `service_catalog`, not on the live-site pricing page (which lists the canonical ~24 SKUs). Treat as unbuilt/unshipped.
> - **Guest reviews are unbuilt** — the ground truth notes guest→vendor has no path today and guest reviews are not wired; the per-guest-review model (incl. 0031/0002 capture) is forward spec only.
> - **No depended-on upstreams exist either** — this consumes 0045 `vendor_products` (unbuilt) and the 0046-extension auto-editorial/AI pipeline; only generic vendor reviews (`/vendor-dashboard/reviews`) ship, unrelated to showcases.
> - Planner-SKU references should read **Today's Focus ₱1,499**, not Setnayan Concierge ₱4,999.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0046
**Topic:** Post-wedding showcase as a structured, faceted, vendor-portfolio-auto-populating discovery surface — the Setnayan answer to WedMeGood's Real Weddings editorial moat
**Surface:** Public website `/real-weddings/` browse + per-showcase pages `/real-weddings/{slug}` + vendor profile "Weddings I worked on" sections + couple dashboard showcase consent flow
**Status:** Drafted 2026-05-18 · V1.1 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.1 — engineering depends on [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) faceting + [0044](../0044_per_category_schemas/0044_per_category_schemas.md) per-category schemas + [0045](../0045_product_catalogs/0045_product_catalogs.md) product catalogs
**Builds on:** 0001 (events), 0006 (vendors + vendor reviews + canonical_services), 0007 (budget anonymized brackets), 0015 (public website routing), 0019 (chat for vendor-initiated showcase requests), 0021 (couple dashboard showcase consent), 0034 (cart history for vendor credits), 0043 (ceremony_type + venue_setting facets), 0044 (vendor attribute schemas), 0045 (vendor product catalogs)
**Consumed by:** 0006 (vendor profile "Weddings I worked on" pulls from here), 0045 (product "Used at N weddings" pulls from here), 0047 (showcase appears alongside marketplace results as discovery hook)
**Companion specs:** 0015, 0043, 0044, 0045

---

## Architectural lock · the Phase 4 page IS the editorial (2026-05-22)

> **The standalone-showcase trigger model from the 2026-05-18 base spec below is SUPERSEDED by the 2026-05-19 row 426 architectural lock + the 2026-05-22 unified QR lifecycle lock. The Phase 4 (T+30d → forever) state of [0002 § Event Landing Page lifecycle](../0002_qr_invitation_system/0002_qr_invitation_system.md) IS the wedding's editorial by default. No separate `wedding_showcases` trigger row is created; the `events` row itself carries the editorial state once it crosses the T+30d boundary AND the couple has not opted out via the 8 RA 10173 guardrails locked 2026-05-19 (Third row).**

**What stays canonical from the 2026-05-18 base spec below:**

- The **`wedding_showcase_facets` index layer** (lines 192–218 below) — pre-computed faceted browse data for `/real-weddings/`. Refreshed on `events.completed_at + 30d` boundary AND on couple-edit. This stays as the index optimization for the cross-wedding browse surface.
- The **`/real-weddings/` faceted browse page** (lines 224–246 below) + per-facet SEO landing pages. The browse surface is real.
- The **`wedding_showcase_vendor_credits` table** (lines 124–145 below) — the join between events + vendors for "Weddings I worked on" surfaces. Stays canonical. Auto-populated from `event_vendor_relationships.delivered_at` (set per 0006's TIER 1 vendor scan-confirm) for VERIFIED credits + from `wedding_showcase_vendor_claims` (per 2026-05-20 extension below) for CLAIMED credits.
- The **`wedding_showcase_product_credits` table** (lines 169–186 below) — product-level credits auto-populated from cart history. Stays canonical.
- All 2026-05-20 extensions below (DIY editor · self-tag claim flow · 4-layer moderation · 2-tier credit linkage · Couple Keepsake Bundle · `wedding_guest_reviews` · `vendor_event_feedback`) stay canonical AS features OF Phase 4. They are not standalone trigger primitives; they are the editorial's authoring + claim + monetization + voice-source layers.

**What is structurally retired:**

- The standalone **`wedding_showcases` trigger table** (lines 91–121 below) — its `status` state machine (`requested` → `couple_approved` → `awaiting_vendor_captures` → `awaiting_couple_picks` → `published`) is retired. The Phase 4 page activates automatically at T+30d unless the couple opts out; vendor-initiated "request to feature" + couple-approves + vendor-submits-3 + couple-picks-1 is **not the model**.
- The 4-step vendor-initiated trigger flow (lines 29–86 below) — vendors don't trigger a separate showcase object. Vendors who delivered (TIER 1 verified or TIER 2 self-claim per 2026-05-22 0002 + 0006 lock) get credited in the Phase 4 editorial automatically; the editorial publishes whether the vendor explicitly opts in or not (vendors retain a per-credit remove action via 0046 base § "Vendor controls" line 374).
- The standalone **`wedding_showcase_captures` table** (lines 147–166 below) — vendor-submits-up-to-3, couple-picks-1 mechanic is retired in favor of the 2026-05-20 DIY editor + self-tag claim flow (vendors claim credit on specific photos rather than submitting candidates).

**Why this lands cleanly:**

Per the 2026-05-19 row 426 architectural call, every couple's Phase 4 page is the wedding showcase by default — no editorial team needed; content fills organically from Dec 1 2026 couple-launch onward. The 0046 iteration retains ownership of the **cross-wedding index/browse layer** (faceted `/real-weddings/`, vendor portfolio "Weddings I worked on", product "used at N weddings" badges, Setnayan-curated Featured selection) while [0002 Phase 4](../0002_qr_invitation_system/0002_qr_invitation_system.md) + the 2026-05-20 0046 extensions own the **per-wedding editorial surface** itself.

The cross-iteration ownership split locked at 2026-05-19 row 426 stands: 0002 owns per-wedding canonical page (the Phase 4 editorial surface) · 0046 owns the cross-wedding browse + faceted SEO landing pages + vendor-portfolio auto-population + product-credit auto-population + Setnayan-curated Featured admin surface.

### Cross-references

- **[0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md)** — canonical lock for 3 lifecycle states · 4 scan actors · Phase 4 editorial mode entry point.
- **[0006 § Vendor scan at venue · TIER 1 / TIER 2](../0006_vendors_management/0006_vendors_management.md)** — vendor scan flow that writes to `event_vendor_relationships.delivered_at` (TIER 1 auto-credit) or `wedding_showcase_vendor_claims` (TIER 2 self-claim). Auto-feeds `wedding_showcase_vendor_credits` for both tiers.
- **CLAUDE.md decision-log row 2026-05-22** — the unified QR/lifecycle/vendor-scan lock that produced this section.
- **CLAUDE.md decision-log row 2026-05-19 Third row** — the original "Phase 4 IS the editorial" architectural call.

---

## What this iteration ships

A wedding showcase system where every completed wedding (where the couple consents) becomes a permanent, structured, searchable case study that:

1. **Acts as SEO content** — `/real-weddings/{couple-slug}` pages, faceted browse by City × Ceremony × Venue × Theme × Budget × Season
2. **Auto-populates vendor portfolios** — "Weddings I worked on" section on every vendor profile pulls from showcases the vendor appeared in
3. **Auto-populates product catalogs** — "Used at N real weddings" badge on every product
4. **Enables couple-to-couple discovery** — couples find vendors via showcased weddings, not vendor profiles directly
5. **Serves as Setnayan testimonial engine** — each showcase has a "Setnayan helped us" review block

This is the SEO + cold-start killer vs WedMeGood. They have Real Weddings as editorial (human-curated, expensive). Setnayan has Real Weddings as structured database (vendor + couple-populated, near-zero marginal cost, faceted search).

---

## Showcase trigger flow (vendor-initiated → couple confirms → vendor submits → couple approves)

Three-step asymmetric trust pattern:

### Step 1 — Vendor initiates the request

Post-wedding (`events.completed_at IS NOT NULL`), any vendor who served the wedding can request to feature it:

- Vendor dashboard surface: `/vendor-dashboard/showcases/request`
- Vendor sees list of past weddings they served (from `vendor_services` × `events.completed_at`)
- Vendor picks a wedding → optional note to couple ("Your wedding was beautiful — would love to feature it in our portfolio")
- System sends couple in-app + email notification via [0028](../0028_email_notifications/0028_email_notifications.md): "{Vendor Name} would like to feature your wedding in their portfolio and on Setnayan's Real Weddings. Tap to review."

Vendor business incentive: showcase appearances drive their portfolio + SEO + lead flow. Strong organic motivation to initiate.

### Step 2 — Couple confirms (1-click with privacy options)

Couple opens the request from notification → modal:

> {Vendor Name} would like to feature your wedding.
> 
> **Choose your privacy level:**
> - [x] Full names visible ("Maria & Juan")
> - [ ] First names only ("Maria & Juan" → "M. & J.")
> - [ ] Anonymous ("A couple in Manila")
>
> **What gets shown:**
> - [x] Real Weddings on setnayan.com (public)
> - [x] Vendor's portfolio (their site only)
> - [x] Couple-to-couple discovery (logged-in Setnayan users)
>
> **Photos:**
> - [x] Allow vendors who worked on this wedding to submit their best capture
> - [ ] Let me approve each photo before publishing
>
> [Approve · Decline · Save for later]

Couples can also **initiate showcases themselves** without a vendor request: from event dashboard post-event, see "Publish your wedding to Real Weddings" CTA.

### Step 3 — Vendor submits captures, couple picks

Once couple approves the showcase, all vendors who served the wedding get notified: "Submit your best capture of {Couple Names}'s wedding for the Real Weddings feature."

- Each vendor uploads **up to 3 captures** (photo or video) representing their work
- Per-capture caption (50 chars): e.g., "First dance shot at the reception"
- Couple sees all submitted captures, **picks 1 per vendor** to feature publicly
- Optionally vetoes a vendor's capture entirely (vendor row stays as credit but no photo)

Asymmetric trust: vendor knows their best work (submits 3 candidates), couple owns final say (picks the 1). Vendor can't push a photo the couple doesn't like; couple can't ghost the vendor entirely without explicit veto.

### Step 4 — Showcase publishes

After couple confirms picks (or after a 14-day soft-deadline auto-pick of vendor's first capture), showcase publishes to:

- Public: `/real-weddings/{couple-slug}` URL
- Vendor profiles: appears in each vendor's "Weddings I worked on" section
- Per-product catalogs: products used at the wedding get "Used at this wedding" credit

---

## Schema

### `wedding_showcases` table (NEW)

```sql
CREATE TABLE wedding_showcases (
  showcase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  showcase_slug TEXT NOT NULL UNIQUE,                      -- URL slug: 'maria-juan-tagaytay-garden'
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'couple_approved', 'awaiting_vendor_captures', 'awaiting_couple_picks', 'published', 'unpublished_by_couple', 'admin_hidden')),
  initiated_by_vendor_id UUID REFERENCES vendors(vendor_id), -- nullable when couple-initiated
  initiated_by_couple_user_id UUID REFERENCES users(user_id),-- nullable when vendor-initiated
  privacy_level TEXT NOT NULL DEFAULT 'first_names_only'
    CHECK (privacy_level IN ('full_names', 'first_names_only', 'anonymous')),
  visible_on_public_web BOOLEAN NOT NULL DEFAULT TRUE,
  visible_on_vendor_portfolios BOOLEAN NOT NULL DEFAULT TRUE,
  visible_on_logged_in_discovery BOOLEAN NOT NULL DEFAULT TRUE,
  couple_must_approve_each_photo BOOLEAN NOT NULL DEFAULT FALSE,
  couple_narrative_short TEXT,                             -- 1-2 sentence story
  couple_narrative_long TEXT,                              -- optional editorial section
  setnayan_helped_review TEXT,                             -- the "how Setnayan helped" testimonial
  hero_photo_r2_key TEXT,                                  -- showcase cover image
  hero_video_r2_key TEXT,                                  -- optional hero video reel
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX wedding_showcases_event_idx ON wedding_showcases (event_id);
CREATE INDEX wedding_showcases_status_published_idx ON wedding_showcases (status, published_at DESC) WHERE status = 'published';
CREATE INDEX wedding_showcases_slug_idx ON wedding_showcases (showcase_slug);
```

### `wedding_showcase_vendor_credits` table (NEW)

One row per vendor that served the wedding.

```sql
CREATE TABLE wedding_showcase_vendor_credits (
  credit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL REFERENCES wedding_showcases(showcase_id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  canonical_service TEXT NOT NULL,                         -- which service vendor provided ('catering', 'photography', etc.)
  vendor_submitted_capture_count INT NOT NULL DEFAULT 0,   -- 0-3 (vendor uploads up to 3)
  couple_picked_capture_id UUID,                           -- FK to wedding_showcase_captures.capture_id
  display_order INT NOT NULL DEFAULT 0,                    -- couple controls order
  per_vendor_review_short TEXT,                            -- e.g., "Delivered SDE 4hrs after reception, beyond expectations"
  per_vendor_review_rating INT CHECK (per_vendor_review_rating BETWEEN 1 AND 5),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,                -- couple can hide a credit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (showcase_id, vendor_id, canonical_service)       -- vendor can appear once per service (or multiple times if multi-service)
);

CREATE INDEX showcase_vendor_credits_vendor_idx ON wedding_showcase_vendor_credits (vendor_id) WHERE is_visible = TRUE;
CREATE INDEX showcase_vendor_credits_canonical_idx ON wedding_showcase_vendor_credits (canonical_service);
```

### `wedding_showcase_captures` table (NEW)

Per-vendor capture submissions; couple picks 1 of up to 3.

```sql
CREATE TABLE wedding_showcase_captures (
  capture_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL REFERENCES wedding_showcases(showcase_id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  canonical_service TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_r2_key TEXT NOT NULL,
  caption_short TEXT,                                      -- 50 chars max
  picked_by_couple BOOLEAN NOT NULL DEFAULT FALSE,         -- TRUE for the 1 capture couple picks
  picked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX showcase_captures_picked_idx ON wedding_showcase_captures (showcase_id, picked_by_couple) WHERE picked_by_couple = TRUE;
```

### `wedding_showcase_product_credits` table (NEW)

Specific products used at the wedding (from [0045](../0045_product_catalogs/0045_product_catalogs.md) `vendor_products` table).

```sql
CREATE TABLE wedding_showcase_product_credits (
  credit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID NOT NULL REFERENCES wedding_showcases(showcase_id) ON DELETE CASCADE,
  vendor_product_id UUID NOT NULL REFERENCES vendor_products(product_id),
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  was_in_cart BOOLEAN NOT NULL DEFAULT TRUE,               -- product was in the order (auto-populated from cart history)
  couple_confirmed_at_showcase TIMESTAMPTZ,                -- couple confirmed this product was actually used (vs ordered-but-substituted)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (showcase_id, vendor_product_id)
);

CREATE INDEX showcase_product_credits_product_idx ON wedding_showcase_product_credits (vendor_product_id);
```

This table is auto-populated from the wedding's cart history (cart line items → showcase credits). Couple can confirm or remove credits in the showcase consent flow.

### `wedding_showcase_facets` table (NEW)

Pre-computed facet values per showcase for fast browse-page queries.

```sql
CREATE TABLE wedding_showcase_facets (
  showcase_id UUID PRIMARY KEY REFERENCES wedding_showcases(showcase_id) ON DELETE CASCADE,
  city TEXT,                                               -- 'manila', 'cebu', 'tagaytay', etc.
  region TEXT,                                             -- 'metro_manila', 'visayas', etc.
  ceremony_type TEXT,                                      -- from events.ceremony_type
  ceremony_sub_type TEXT,                                  -- from events.ceremony_sub_type
  venue_setting TEXT,                                      -- from events.venue_setting
  theme_tags TEXT[],                                       -- ['boho', 'garden', 'intimate']
  guest_count_bracket TEXT,                                -- 'intimate_under_50', 'standard_50_to_200', etc.
  budget_bracket TEXT,                                     -- 'under_500k', '500k_to_1m', '1m_to_3m', '3m_plus'
  season TEXT,                                             -- 'dry_season_nov_apr', 'wet_season_may_oct'
  month_held INT,                                          -- 1-12
  year_held INT,
  has_video_hero BOOLEAN NOT NULL DEFAULT FALSE,
  vendor_count INT NOT NULL DEFAULT 0,
  product_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX showcase_facets_city_idx ON wedding_showcase_facets (city);
CREATE INDEX showcase_facets_ceremony_idx ON wedding_showcase_facets (ceremony_type, venue_setting);
CREATE INDEX showcase_facets_theme_gin ON wedding_showcase_facets USING GIN (theme_tags);
CREATE INDEX showcase_facets_budget_idx ON wedding_showcase_facets (budget_bracket);
CREATE INDEX showcase_facets_season_year ON wedding_showcase_facets (year_held DESC, season);
```

Refreshed on showcase publish + on couple-edit. Faceted queries against this table are fast (~ms for browse pages).

---

## Public discovery surface: `/real-weddings/`

### Top-level browse page

Three-facet structure copied from WedMeGood pattern (per session screenshot analysis):

**By City:** Manila · Cebu · Davao · Tagaytay · Iloilo · Baguio · Boracay · Palawan · Bohol · Others

**By Wedding Type:** Catholic · Civil · INC · Christian · Muslim · Cultural · Mixed (only active types from [0043 wedding_type_launch_status](../0043_wedding_type_picker/0043_wedding_type_picker.md) shown)

**By Theme:** Destination · Grand & Luxurious · Pocket-Friendly Stunners · Intimate & Minimalist · Modern & Stylish · Garden · Beach · Cultural · Heritage · Others

**By Venue Setting:** Banquet Hall · Garden · Beach · Destination · Heritage · Outdoor Tent · Civil Registrar

Plus sidebar:

**Latest Real Weddings** — 6 thumbnails of most recently published showcases

### Compound facet queries

Faceted browse supports compound queries via URL params: `/real-weddings/?city=tagaytay&ceremony=catholic&venue=garden&theme=boho&guests=100-200&budget=500k-1m`

Each filter combination is **its own SEO landing page** with a unique URL → indexed by Google for the specific combination. E.g., couples searching "boho garden wedding Tagaytay 150 guests" find the Setnayan results page that lists matching real weddings.

### Per-showcase page: `/real-weddings/{showcase-slug}`

Layout:

**Hero section**
- Hero photo or video (couple-picked)
- Couple names (per `privacy_level`)
- Date, city, venue setting
- Ceremony type badge
- Theme tags

**The story** (couple_narrative_long if filled)
- 1-2 paragraphs from the couple
- Auto-prompted with templates: "How we met", "The proposal", "Why this venue", "The vibe we wanted"

**The team** (vendor credits gallery)
- Grid of vendor cards with their couple-picked capture
- Each card: vendor name, canonical service, photo, "Visit profile →" CTA
- Hover/tap reveals per-vendor review snippet

**The products used** (auto-populated from cart history + couple confirmation)
- "Caterer served: Lechon Cebu-style · Pancit Palabok · Halo-halo Station"
- "Coffee booth served: Spanish Latte with oat milk · Matcha Latte"
- "Bridal gown: Aurora Mermaid Lace Gown by [Designer]"
- Each product links to its `/v/{vendor}/products/{product}` page

**Real budget bracket** (anonymized)
- "Total: ₱500K-1M · Photography ~12% · Catering ~35% · Venue ~25% · Florals ~8% · Other ~20%"
- Anonymized to bracket + percentage breakdown
- Helps future couples sanity-check their own budgets — data WedMeGood doesn't have

**Day-of timeline** (vendor-stamped, optional)
- Real timestamps: "10:15 AM — Photographer arrived", "10:45 AM — HMUA finished bridal touch-up", "11:00 AM — Ceremony procession started"
- Generated from event-day timeline tracking + vendor stamps
- Useful as planning reference for future couples

**How Setnayan helped** (the platform testimonial)
- 2-3 sentence couple review specifically about the platform
- Auto-prompted: "What part of using Setnayan made the biggest difference?"

**Related showcases**
- "More like this" — algorithmic recommendation: same theme + ceremony type + region

### SEO structure

- Each showcase has structured data (Schema.org `Event` + `Review` schemas)
- Couple narrative content + vendor names + product names all crawlable
- Hero image set as Open Graph image for social sharing
- URL slugs descriptive: `/real-weddings/maria-juan-tagaytay-garden-catholic`

---

## Vendor profile integration

Each vendor profile gets a "Weddings I worked on" section that auto-pulls from `wedding_showcase_vendor_credits`:

```sql
-- Query for vendor's showcase appearances
SELECT s.showcase_slug, s.hero_photo_r2_key, sf.city, sf.ceremony_type, sf.venue_setting, c.couple_picked_capture_id
FROM wedding_showcases s
JOIN wedding_showcase_vendor_credits c ON c.showcase_id = s.showcase_id
JOIN wedding_showcase_facets sf ON sf.showcase_id = s.showcase_id
WHERE c.vendor_id = $1
  AND c.is_visible = TRUE
  AND s.status = 'published'
  AND s.visible_on_vendor_portfolios = TRUE
ORDER BY s.published_at DESC
LIMIT 20;
```

Vendor profile section renders:
- Grid of vendor's showcase appearances
- Each card shows: hero photo (or vendor's picked capture from that wedding), couple name (per privacy), date, city
- Hover/tap → opens the showcase page (with vendor's section highlighted)

This is the **portfolio auto-populator** — vendors don't need to maintain a separate portfolio gallery. Real weddings they worked on become their portfolio with zero maintenance.

---

## Product profile integration

Each product page (`/v/{vendor}/products/{product}` from [0045](../0045_product_catalogs/0045_product_catalogs.md)) shows "Used at N real weddings" + thumbnails of showcases where this specific product appeared:

```sql
SELECT s.showcase_slug, s.hero_photo_r2_key, sf.city
FROM wedding_showcases s
JOIN wedding_showcase_product_credits pc ON pc.showcase_id = s.showcase_id
JOIN wedding_showcase_facets sf ON sf.showcase_id = s.showcase_id
WHERE pc.vendor_product_id = $1
  AND s.status = 'published'
ORDER BY s.published_at DESC
LIMIT 10;
```

Couples browsing a product see "This Spanish Latte was served at 8 real weddings" with thumbnails. Massively more credible than a vendor's curated portfolio.

---

## Couple-to-couple discovery

A logged-in couple browsing `/real-weddings/` can:

1. Filter by faceted attributes matching their own event (auto-pre-filtered on first visit: "Showing weddings like yours — Catholic + Garden + Cebu")
2. Click any showcase to see the vendor list
3. Save a vendor to their shortlist directly from the showcase ("Add {Vendor Name} to my vendors")
4. Message the vendor with showcase context auto-filled ("I saw your work at Maria & Juan's wedding — want to chat about my own wedding")

This shifts vendor discovery from "search by name" to **"discover via aspirational wedding"** — a fundamentally different and more emotionally-resonant flow.

---

## Couple privacy controls

Couples retain full control:

- **Edit privacy at any time** — change from `full_names` to `first_names_only` or `anonymous` post-publish; vendor portfolio surfacing respects current setting
- **Unpublish** — couple can unpublish at any time; showcase status flips to `unpublished_by_couple`; URL returns 404; vendor portfolio entries hidden
- **Photo veto post-publish** — couple can hide a specific capture even after publish; vendor row stays as credit, photo removed
- **Per-vendor visibility** — couple can hide specific vendor credits ("I don't want to associate with this vendor anymore"); credit set `is_visible=FALSE`
- **Budget bracket opt-out** — couples can hide the budget bracket section entirely (`hide_budget_bracket=TRUE` on showcase)
- **Day-of timeline opt-out** — couples can hide vendor-stamped timeline

All edits logged in `admin_audit_log` for accountability.

---

## Vendor controls

Vendors can:

- **Decline a showcase request from a couple** — don't want to associate with that wedding (rare; usually for quality reasons)
- **Choose which canonical_services they're credited for** — if vendor served both Photography and Drone but only wants Photography on showcase, can opt out of Drone credit
- **Remove themselves from a showcase post-publish** — credit set `is_visible=FALSE`; doesn't affect couple's showcase otherwise
- **Approve/edit per-vendor review wording** — couple drafts the review, vendor sees it before publish, can flag for moderation if inaccurate

---

## Quality control

1. **Photo moderation** — captures uploaded by vendors run through automatic checks (no nudity, no copyrighted material, minimum resolution); admin queue for borderline cases ([0023](../0023_admin_console/0023_admin_console.md))
2. **Couple-name verification** — couples must verify identity to publish under full_names (prevents fraudulent showcases)
3. **Vendor-credit verification** — vendor credit only allowed if `vendor_services` × `events` join confirms vendor actually served the wedding (no fraudulent claiming)
4. **Reporting flow** — anyone can report a showcase as inaccurate/inappropriate; admin queue handles
5. **Minimum-content rule** — showcase doesn't publish until at least 3 vendor credits + 5 photos + couple narrative present

---

## Email + notification copy

Several touchpoints across the lifecycle:

| Trigger | Recipient | Template |
|---|---|---|
| Vendor requests showcase | Couple | "Your wedding made an impression — {Vendor} would love to feature it" |
| Couple approves showcase | All wedding vendors | "Submit your best capture of {Couple}'s wedding for the Real Weddings feature" |
| Vendor uploads captures | Couple | "{N} of your vendors have submitted captures — pick your favorites" |
| Showcase publishes | Couple + all vendors | "Your wedding is now featured at /real-weddings/{slug} — share it with friends!" |
| Showcase featured (Setnayan-curated) | Couple + all vendors | "Your wedding has been featured on the Setnayan homepage" |
| Couple unpublishes | All vendors | "{Couple} has unpublished their showcase — your portfolio entries have been hidden" |

All templates available in EN/TL/Cebuano per [0028](../0028_email_notifications/0028_email_notifications.md) i18n.

---

## Setnayan-curated featured showcases

Admin surface ([0023 admin console](../0023_admin_console/0023_admin_console.md)) can pin showcases as:

- **Featured on homepage** — appears in `Latest Real Weddings` hero section
- **Featured in city pages** — `/real-weddings/?city=cebu` top-of-page featured slot
- **Featured by theme** — `/real-weddings/?theme=garden` top spot

Featured showcases:
- Boost vendor visibility (vendors notified, can use "Featured by Setnayan" badge in marketing)
- Drive SEO juice (linked from high-traffic pages)
- Set quality bar for couples submitting future showcases

Featured selection criteria:
- Visual quality (hero photo professionally lit, well-composed)
- Vendor diversity (showcases featuring 6+ vendors get priority — more vendor portfolios benefit)
- Geographic + cultural diversity (curated rotation across regions and ceremony types)
- Couple narrative quality (well-written stories get featured)

---

## Cold-start strategy

V1.1 launch shows the showcase surface but starts with **near-zero published showcases** (pilot weddings being the first 5-20). Two mitigations:

1. **Setnayan-curated "Editorial Showcases"** — owner can hand-pick 5-10 weddings from pilot cohort (with explicit couple consent) and produce high-quality editorial-style showcases as launch content. This seeds the "Latest Real Weddings" section with quality content.

2. **Vendor-submitted "Past Work" alternative** — vendors with existing portfolios (pre-Setnayan weddings) can submit a "Past Work" showcase that doesn't require event linkage. Flagged differently ("Past work by {vendor}" instead of "Real wedding"), but provides content. Lower trust signal (no couple verification) but available for cold-start.

By V1.2 (~3 months post-launch), real showcases from Setnayan-served weddings begin populating organically.

---

## Phasing

**V1.1 launch:**
- Schema + tables for showcases, captures, vendor credits, product credits, facets
- Vendor-initiated request flow + couple consent flow + vendor capture submission flow + couple picks flow
- Public `/real-weddings/` browse with City + Ceremony Type + Venue Setting + Theme facets
- Per-showcase page with hero + story + vendor team + products + budget bracket + Setnayan helped review
- Vendor profile "Weddings I worked on" auto-population
- Product profile "Used at N real weddings" auto-population
- Couple privacy controls (full/first-name/anonymous + unpublish + photo veto)
- Admin moderation queue
- ~5-10 Setnayan-curated editorial showcases from pilot cohort as launch content

**V1.2:**
- Faceted compound queries with rich filter UI (palette × ceremony × venue × budget × season)
- Day-of timeline display (vendor-stamped)
- Couple narrative templates ("how we met", "the proposal" prompts)
- Featured showcase admin queue + homepage hero rotation
- Couple-to-couple shortlist-from-showcase flow
- Past-work alternative submissions

**V1.3+:**
- ML-driven "More like this" recommendations
- Couple "Save this showcase" personal collections
- Showcase comments / heart reactions (public engagement layer)
- Vendor cross-sell: "Couples who used this Lechonero also used these caterers"

---

## SEO + content moat compounding

The compounding pattern:

1. **Vendor submits showcase →** vendor's portfolio + SEO grows
2. **Couple publishes →** Setnayan's content + SEO grows
3. **Couple-to-couple discovery →** vendor leads grow
4. **Vendor leads grow →** vendors invest in better profiles + more showcases
5. **Better profiles →** higher search rankings → more couples discover Setnayan
6. **More couples →** more weddings → more showcases → loop

WedMeGood's editorial moat is a content-team cost center. Setnayan's showcase moat is a **vendor + couple-populated growth engine** with near-zero marginal cost. Once it crosses critical mass (~500 showcases), it self-compounds.

---

## Edge cases

1. **Couple opts out post-publish.** Showcase status → `unpublished_by_couple`. URL returns 410 Gone. Vendor portfolio entries hide gracefully ("Wedding no longer showcased").
2. **Vendor leaves Setnayan after appearing in showcase.** Showcase preserves vendor credit (vendor name + canonical_service) but link to vendor profile becomes "Vendor no longer on Setnayan" badge.
3. **Couple disputes vendor's submitted capture.** Soft veto: couple picks "None of these" → vendor credit stays without photo. If vendor pushes back, admin moderation.
4. **Multiple vendors served same canonical_service** (e.g., wedding had 2 photographers — main + drone). Each gets their own credit row + own capture submission.
5. **Couple changes wedding type post-event** (rare, but possible if civil + later Catholic blessing). Showcase facets re-compute on event change.
6. **Vendor uploads inappropriate capture.** Captures run through pre-publish moderation (image classification model + admin queue for borderline).
7. **Couple's wedding involved an off-platform vendor not in Setnayan.** Couple can add manual credit ("Catering by: Lola's Kitchen [off-platform]") — credit appears without vendor link. Drives recruitment ("Lola's Kitchen — claim your vendor profile?").

---

## Open questions

1. **Showcase trigger window.** Vendors can request immediately post-event? Or wait 7 days for cooldown? Recommend 7-day cooldown — gives couple emotional space before requesting consent.
2. **Hero video vs photo as default.** Some weddings have great videos but only OK photos. Should showcase support video hero? Recommend yes, but tested for mobile bandwidth (autoplay-muted with photo fallback for slow connections).
3. **Couple anonymity edge case.** If a couple picks `anonymous` privacy, do vendor portfolios still show the showcase (with "A couple in Manila" framing)? Recommend yes — vendor work credibility preserved without compromising couple privacy.
4. **Showcase as input to AI recommendation.** Could showcases drive a "couples like you" engine? Recommend yes for V1.3+; structure data with that future use in mind from V1.1 schema.
5. **Multilingual showcase content.** Couple narrative in EN, TL, or Cebuano — display all or translate? Recommend display original language with `[Translate to EN]` toggle (Haiku 4.5 from [0032](../0032_contract_intelligence/0032_contract_intelligence.md) handles translation).
6. **Showcase claim period.** Should couples be able to claim a showcase years later if they didn't initially? Recommend yes — anyone with verified `users.user_id = events.couple_user_id` can publish/edit retroactively.

---

## Cross-references

- Consumes: [0001](../0001_creating_guest_list/0001_creating_guest_list.md) (events), [0006](../0006_vendors_management/0006_vendors_management.md) (vendors), [0007](../0007_budget_expenses/0007_budget_expenses.md) (budget for anonymized bracket), [0015](../0015_main_website/0015_main_website.md) (public website routing), [0019](../0019_communications/0019_communications.md) (vendor → couple chat for showcase requests), [0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) (couple dashboard consent flow), [0023](../0023_admin_console/0023_admin_console.md) (moderation queue + featured selection), [0028](../0028_email_notifications/0028_email_notifications.md) (notification templates), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart history for product credits), [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) (ceremony_type + venue_setting facets), [0044](../0044_per_category_schemas/0044_per_category_schemas.md) (vendor attribute data), [0045](../0045_product_catalogs/0045_product_catalogs.md) (product credits)
- Provides: `wedding_showcases` · `wedding_showcase_vendor_credits` · `wedding_showcase_captures` · `wedding_showcase_product_credits` · `wedding_showcase_facets` tables + public discovery surface + vendor portfolio auto-population + product "used at N weddings" credits
- Consumed by: vendor profiles (portfolio section), product pages (real-wedding credits), [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) (showcases surface as discovery hook alongside marketplace results), [0015](../0015_main_website/0015_main_website.md) (homepage Featured Real Weddings hero)

---

## 0046 extensions locked 2026-05-20 — auto-editorial pipeline + DIY editor + self-tag + 2-tier credit + Keepsake Bundle + new data captures

The 2026-05-18 base spec covers vendor-initiated showcases with couple consent. This 2026-05-20 extension adds six new surfaces that emerged from the V1.5 inspiration strategy session. All sit inside this iteration (no new 0050 iteration needed — the "0036_inspiration" placeholder name used in CLAUDE.md decision-log rows 2026-05-20 refers to these extensions of 0046).

### Wedding-slug lifecycle — single URL morphs through phases

The same canonical `setnayan.com/[event-slug]` URL evolves through four states over the event lifecycle:

```
Slug created → Pre-event (T-90d → T-1h)     — invitation, invite-token-gated, guest-hydrated per [[0002]]
            → Live event (T-1h → T+8h)      — day-of guest experience per [[0031]]
            → Cooldown (T+8h → T+30d)       — private gallery for guests only
            → Editorial (T+30d → forever)   — public showcase if couple opts in, anonymized fallback otherwise
```

QR codes printed months in advance keep resolving to the same slug regardless of lifecycle phase. Privacy invariants from [[0015]] § "Privacy invariants" hold at every phase — only opted-in couples flip to the public editorial phase; default anonymization = initials.

### Multi-vendor self-tag claim flow (parallel to vendor-initiated)

The base spec's vendor-initiated flow assumes the vendor proactively requests a showcase. Many weddings have vendors who DIDN'T initiate but who deserve credit on photos the showcase publishes. **Self-tag** lets any vendor (verified marketplace participant) claim credit on a published wedding photo, gated by 4-layer moderation.

**Tag types per photo:**

| Tag type | Cardinality | Example |
|---|---|---|
| `primary_credit` | 1 per photo | The photographer who shot it |
| `service_credit` | N per photo | Florals · cake · venue · makeup credits |
| `featured_service` | N per photo, links to vendor's catalog row | "These centerpieces" → that specific `vendor_services` row |

**4-layer moderation pipeline:**

| Layer | Check | Outcome |
|---|---|---|
| Auto-1 | Vendor verified + covers that canonical_service + active in that city around event date | Auto-approve within 5 min if all yes |
| Auto-2 | Vendor has 5+ approved claims with no recent disputes | Reputation auto-approval bypass |
| Couple veto | Couple sees a digest ("3 new claims on your wedding photos") and can confirm/dispute | Dispute auto-revokes |
| Admin | Disputed or low-reputation claims hit moderation queue ([[0023]]) | 48-hr SLA manual review |

**Anti-spam:**
- 5 claims per vendor per day cap
- 3 rejected claims in 30 days → 30-day claim ban
- Couples can permanently block a vendor from their wedding's photos
- Verified + reputable path bypasses queue

**New schema additions:**

```sql
CREATE TABLE wedding_showcase_vendor_claims (
  claim_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id         UUID NOT NULL REFERENCES wedding_showcases(showcase_id) ON DELETE CASCADE,
  capture_id          UUID NOT NULL REFERENCES wedding_showcase_captures(capture_id) ON DELETE CASCADE,
  vendor_id           UUID NOT NULL REFERENCES vendors(vendor_id),
  canonical_service   TEXT NOT NULL REFERENCES canonical_service_schemas(canonical_service),
  tag_type            TEXT NOT NULL CHECK (tag_type IN ('primary_credit','service_credit','featured_service')),
  featured_service_id UUID REFERENCES vendor_services(service_id),       -- nullable, only for featured_service tag_type
  description         TEXT,                                              -- vendor's optional one-line ("centerpieces + ceremony arch")
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','auto_approved','admin_approved','rejected','revoked')),
  reviewed_by         UUID REFERENCES users(user_id),
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wedding_showcase_vendor_claims_capture_idx ON wedding_showcase_vendor_claims(capture_id);
CREATE INDEX wedding_showcase_vendor_claims_vendor_idx ON wedding_showcase_vendor_claims(vendor_id);
```

### Two-tier editorial credit (verified vs. claimed)

The credit shown on each photo + the showcase vendor strip distinguishes vendors by their relationship to Setnayan Pay:

| Tier | Triggered when | Visual treatment | Vendor cost | Moderation |
|---|---|---|---|---|
| **Verified** | Vendor closed through Setnayan Pay for that event (payment record + booking record both present in `bookings`) | Premium featured-strip placement · "Verified Setnayan booking" badge · vendor analytics included · bundle CTA inclusion | Already paid 5% Pay fee — no extra | None (Setnayan Pay transaction IS the verification) |
| **Claimed** | Vendor self-tagged via above flow | Normal credit in the credits list · no premium strip · no analytics dashboard · lower visual prominence | Free | 4-layer moderation per above |

This reframes the **5% Setnayan Pay convenience fee** (per [[0015]] § "Pricing transparency") as a complete platform-participation value bundle:

| Phase | What the 5% buys |
|---|---|
| Pre-booking | Discovery, chat with identity masking, in-platform messaging protection |
| Booking | Payment processing, escrow, dispute resolution, BIR-compliant OR receipts |
| Day-of | Coordinator chat join (if applicable), day-of guest experience integration |
| Post-event | **Verified vendor credit in showcase + premium featured-strip + bundle inquiry + analytics dashboard** |

Off-platform bookings get only `claimed` credit — structurally reinforcing the booking funnel.

### DIY editor — couple builds their own showcase

Parallel to vendor-initiated trigger flow, couples can author their own showcase directly. Phase 0 of the editorial product (lowest engineering cost, no AI dependencies):

**Editor surface:** `/dashboard/[eventId]/showcase/edit` (couple-only)

**Slot interactions:**
- **Hero** — couple uploads hero image, sets initials, sees auto-populated date + city
- **Mood** — couple can drag in mood-board palette swatch from [[0001]]; one-line intention statement
- **Chapter blocks (N drag-orderable)** — per chapter: label · photo grid up to 8 photos · 200-word reflection · optional 5-sec clip embed · vendor credits picker (browse credited vendors from `wedding_showcase_vendor_credits`)
- **Real numbers sidebar** — auto-populated from event data: guest count · vendor count · avg vendor rating · hours documented · Setnayan Pay processed (optional toggle)
- **Vendor strip** — auto-populated from `wedding_showcase_vendor_credits` (couple can re-order)
- **Preview + Publish** — full-page preview, couple toggles `is_published=TRUE`

No AI, no auto-curation. Couple's own content + own reflections + own picks. Storage of uploaded photos via R2 + GDrive offload pattern (see GDrive extension below).

### Auto editorial — template-driven data-fed pipeline (Phase 1 of editorial product)

For couples who prefer zero effort, Setnayan auto-generates a publishable draft template-filled from event data. **Template-first, NOT LLM-generated.** Couple reviews + edits before publish.

**9-stage pipeline (T-event-end + 14 days trigger):**

1. **Data harvest** — pull from `events` + `papic_photos` + `panood_clips` + `bookings` + `vendor_services` + schedule + reviews + couple opt-in consent flags
2. **Image AI extraction** (V2 add-on, deferred from V1.5) — palette + moment classification + style fingerprint + vendor work detection
3. **Template selector** — picks story arc (church / garden / beach / modern / traditional) from event metadata
4. **Chapter slot binding** — every slot is data-driven; no LLM-generated prose. Couple's own 200-word reflections fill the body
5. **Photo curator** — algorithmically picks 30–40 photos: per-chapter quota (5 per chapter) · diversity scoring (wide/medium/detail) · couple-approved · vendor coverage
6. **Vendor tag pre-population** — auto-credits booked vendors from `bookings` ledger (no claim flow needed for these)
7. **Trilingual generation** — translation pass (LLM cheap-tier OR human review depending on tier)
8. **Couple review window** — draft delivered T+14d; 30-day review window; auto-publish OR couple-publish-early
9. **Publish + notification** — vendors notified, untagged elements become claimable via self-tag, engagement tracking starts

**AI polish narrow optional V2 add-on only:**
- Filipino-moment chapter labels from cached generic set (cord & veil → "The cord that binds")
- Couple reflection grammar polish (couple sees both, picks one)
- Per-editorial LLM cost: <₱20 (Claude Haiku tier)

No image AI, no FFmpeg, no Sonnet polish at V1.5. Per-editorial cost = ₱0 for V1.5 Phase 0 + Phase 1.

### Setnayan-Curated Premium tier — admin picks, Setnayan funds

Top 5–10 showcases per month get the full AI multimedia treatment, funded by Setnayan as content marketing (~₱2–4k/mo line item). Admin curates which showcases get the premium investment via [[0023]] § Setnayan-curated featured showcases (already specced in 0046 base).

**No vendor sponsorship tier** — vendors already pay 5% Pay fee; charging again for editorial credit double-bills the same value. Setnayan funds the AI premium for quality reasons (best weddings featured, not richest-vendor weddings), not vendor reasons.

### Couple Keepsake Bundle — ₱2,499 post-event upsell SKU

Optional purchase couples can make after their showcase publishes:

- Print-ready PDF (full showcase formatted for ~50-page coffee-table book printer)
- Photo bundle download (compressed previews in ZIP)
- Panood SDE reel download
- Wedding playlist artifact (track list + Pakanta-generated song if purchased per [[0036]])

Schema addition:

```sql
ALTER TABLE service_catalog
  ADD COLUMN IF NOT EXISTS sku TEXT;

INSERT INTO service_catalog (sku, display_name_en, price_centavos, category, is_active)
VALUES ('couple_keepsake_bundle', 'Wedding Showcase Keepsake Bundle', 249900, 'showcase', TRUE)
ON CONFLICT (sku) DO NOTHING;
```

Couple-side checkout via [[0034]] cart. Doesn't break [[0015]] § "Free to plan" lock — Keepsake is post-event finished-product, not planning.

### Net-new data captures — wedding_guest_reviews + vendor_event_feedback

Two new third-party voice sources for showcase pull-quotes + vendor BTS blurbs that WedMeGood structurally lacks:

**`wedding_guest_reviews`** — post-event email to attendees via [[0031]] QR scans; optional 60-sec form: 1 rating + 1 quote.

```sql
CREATE TABLE wedding_guest_reviews (
  review_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id            UUID REFERENCES guests(guest_id),                  -- nullable, anonymous submissions OK
  rating              INT CHECK (rating BETWEEN 1 AND 5),
  quote               TEXT,
  attribution_opt_in  BOOLEAN NOT NULL DEFAULT FALSE,                    -- guest opts in to show their name
  display_name        TEXT,                                              -- shown only if attribution_opt_in=TRUE
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX wedding_guest_reviews_event_idx ON wedding_guest_reviews(event_id);
```

Privacy: anonymous default per RA 10173; guest must opt in to display name. Used for showcase pull-quotes: *"First time I cried at a wedding. — Tita Cora, guest"*.

**`vendor_event_feedback`** — vendor dashboard prompt 7 days post-event: private rating of couple experience + optional public-quote opt-in.

```sql
CREATE TABLE vendor_event_feedback (
  feedback_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id           UUID NOT NULL REFERENCES vendors(vendor_id),
  event_id            UUID NOT NULL REFERENCES events(event_id),
  private_rating      INT CHECK (private_rating BETWEEN 1 AND 5),       -- vendor's rating of the couple, private
  public_quote        TEXT,                                              -- vendor's BTS blurb, public opt-in
  public_opt_in       BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX vendor_event_feedback_vendor_idx ON vendor_event_feedback(vendor_id);
CREATE INDEX vendor_event_feedback_event_idx ON vendor_event_feedback(event_id);
```

Private ratings feed admin bad-actor-couple flagging. Public quotes (opt-in) become vendor BTS blurbs in showcases: *"We sourced the calla lilies from a Benguet farm at 5 AM. — Florist X"*.

Both schemas slot 2 new email templates in [[0028]]: `wedding_guest_review_request` + `vendor_couple_feedback_request`.

### Phasing of 0046 extensions

| Phase | What ships | Duration | Cost |
|---|---|---|---|
| **0046 base (already drafted)** | Vendor-initiated showcase trigger + couple consent + facets + browse | (drafted) | — |
| **0046 ext Phase 0** | DIY editor + self-tag claim flow + 4-layer moderation + 2-tier credit linkage + Couple Keepsake SKU | ~2–3 weeks dev | ₱0 LLM cost |
| **0046 ext Phase 1** | Auto-editorial template-driven pipeline + photo curator algorithm + Filipino-moment detection + vendor tag pre-population | ~3–4 weeks dev | ₱0 LLM (template-first) |
| **0046 ext Phase 2** | AI polish narrow add-on + Setnayan-Curated Premium (full AI multimedia) + new data captures (guest reviews + vendor feedback) | V2 only | ~₱200-400/editorial |

### Updated dependencies

This extension consumes:

- [[0001]] events + mood board palette
- [[0002]] guest invitation slug + token hydration
- [[0006]] vendors + vendor reviews + canonical_service_schemas (192-entry v11 taxonomy per [[0044]])
- [[0007]] budget aggregations for real-numbers sidebar
- [[0011]] Panood clips for SDE embed
- [[0012]] Papic photos for showcase captures
- [[0028]] new email templates: `wedding_guest_review_request`, `vendor_couple_feedback_request`
- [[0031]] QR scan data for guest-review email targeting
- [[0034]] cart for Couple Keepsake checkout
- [[0036]] Pakanta song for Keepsake playlist artifact (optional)

This extension consumed by:

- [[0015]] homepage Featured Real Weddings hero (already specced in 0046 base)
- [[0023]] admin moderation queue for self-tag claims + Curated Premium picker

## Decision log

- **2026-05-18 — Iteration drafted.** Vendor-initiated → couple-approves → vendor-submits-3 → couple-picks-1 trigger flow locks the asymmetric trust pattern. Faceted browse (City × Ceremony × Venue × Theme × Budget × Season) creates SEO landing pages per filter combination. Vendor portfolio auto-population + product "used at N weddings" badges close the cold-start problem differently than WedMeGood (vendor-populated content engine instead of editorial team). Setnayan-curated editorial showcases seed launch content (5-10 from pilot cohort). Couple privacy controls (full/first-name/anonymous + unpublish + photo veto) preserve agency. Real budget brackets + day-of timeline are unique data WedMeGood structurally lacks.

- **2026-05-20 — Six extensions added** (this section above). Self-tag claim flow + 2-tier credit linked to 5% Pay fee + DIY editor + auto-editorial template pipeline + Curated Premium funded by Setnayan + Couple Keepsake ₱2,499 SKU + new data captures (`wedding_guest_reviews` + `vendor_event_feedback`). Replaces the placeholder "0036_inspiration" iteration name used in 2026-05-20 CLAUDE.md decision-log rows — all the work lives in this iteration (0046) as extensions, not a new iteration. Phasing: Phase 0 (DIY + self-tag + 2-tier credit + Keepsake) is V1.5 priority; Phase 1 (Auto-editorial) is V1.5 secondary; Phase 2 (AI polish + new data captures + Curated Premium) is V2.
