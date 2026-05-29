# Iteration 0045 — Vendor Product Catalogs

**Iteration number:** 0045
**Topic:** Per-vendor product catalog entities (specific dishes on a catering menu, specific drinks on a coffee booth menu, specific gowns in a designer's portfolio, specific songs in a band's repertoire) — the layer beneath attribute schemas
**Surface:** Vendor dashboard catalog management ([0022_vendor_dashboard](../0022_vendor_dashboard/0022_vendor_dashboard.md)) + couple-facing product-level filters + cart integration ([0034_payments_and_cart](../0034_payments_and_cart/0034_payments_and_cart.md))
**Status:** Drafted 2026-05-18 · V1.1 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.1 — engineering depends on [0044](../0044_per_category_schemas/0044_per_category_schemas.md) attribute schemas being live
**Builds on:** 0006 (vendors), 0022 (vendor dashboard), 0034 (cart accepts product-level line items), 0044 (per-category schemas declare which categories have product catalogs)
**Consumed by:** 0046 (showcase credits specific products used), 0047 (marketplace product-level filters), 0034 (cart line items reference vendor_products)
**Companion specs:** 0044, 0046, 0034

---

## What this iteration ships

A `vendor_products` table that gives ~20 of the ~115 canonical_services a **product-level catalog** — specific items the vendor sells, each with their own attributes, photos, and pricing. Distinct from attribute schemas:

- **Attributes** (from [0044](../0044_per_category_schemas/0044_per_category_schemas.md)) = what the vendor IS / CAN do (cuisine specialties, milk options, silhouettes offered, languages spoken)
- **Products** (this iteration) = what the vendor actually SELLS (Spanish Latte, Lechon Cebu, Mermaid Lace Gown, specific song titles, specific vehicles)

Couples search BOTH levels:
- Attribute filter: "coffee booths that do oat milk" (boolean attribute on vendor)
- Product filter: "coffee booths that serve Spanish Latte" (product-list match)
- Compound: "coffee booths with oat milk AND Spanish Latte"

This is the second layer of structural depth vs WedMeGood's free-text-and-photo-gallery model.

> **Vendor scan-at-venue product picker · cross-reference (2026-05-22):** When a TIER 2 vendor self-claims credit on a wedding via the venue-master-QR scan (per [0006 § Vendor scan at venue · TIER 1 / TIER 2](../0006_vendors_management/0006_vendors_management.md) + [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md)), the scan-time form includes a **product picker** sourcing rows from this iteration's `vendor_products` table (filtered to the scanning vendor's own products). Vendor picks the specific product they delivered ("Spanish Latte coffee booth" · "3-tier chocolate ganache cake" · "Maria Clara terno") — links the editorial credit to a specific catalog row, not just the canonical_service. Drives the "Used at N real weddings" badge on each product page (see 0046 § product profile integration). `wedding_showcase_vendor_claims.product_id` (added in 2026-05-22 0006 schema extension) is the FK back to this iteration's `vendor_products(product_id)`.

---

## Schema

### `vendor_products` table (NEW)

```sql
CREATE TABLE vendor_products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  canonical_service TEXT NOT NULL REFERENCES canonical_service_schemas(canonical_service),
  product_name TEXT NOT NULL,                           -- "Spanish Latte" / "Lechon Cebu-style" / "Mermaid Lace Gown" / "Perfect by Ed Sheeran"
  product_category TEXT,                                -- per-canonical_service sub-grouping: "espresso_drinks" / "mains" / "desserts" / "rock_pop"
  attributes JSONB NOT NULL,                            -- per-product attributes (price, allergens, modifications, customizations)
  photo_r2_keys TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],-- R2 storage keys for product photos
  audio_r2_keys TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],-- R2 storage keys for audio samples (band songs, host voice clips)
  video_r2_keys TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],-- R2 storage keys for video samples (photo booth GIFs, band performance clips)
  starting_price_centavos BIGINT,                       -- optional; per-product pricing
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,                 -- vendor-controlled ordering on their public catalog page
  external_links JSONB,                                 -- e.g., Spotify link for songs, YouTube for booth video samples
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX vendor_products_vendor_idx ON vendor_products (vendor_id, canonical_service);
CREATE INDEX vendor_products_canonical_active_idx ON vendor_products (canonical_service, is_active) WHERE is_active = TRUE;
CREATE INDEX vendor_products_name_trgm_idx ON vendor_products USING GIN (product_name gin_trgm_ops);
CREATE INDEX vendor_products_attrs_gin ON vendor_products USING GIN (attributes jsonb_path_ops);
```

The `gin_trgm_ops` index enables fuzzy name search (couple types "spanish lat" → matches "Spanish Latte"). The JSONB GIN index enables faceted filtering on per-product attributes.

### `vendor_product_catalog_schemas` (extends [0044](../0044_per_category_schemas/0044_per_category_schemas.md))

Each canonical_service that has a product catalog also has a `product_catalog_schema` declaring what attributes a product carries. Stored as an additional column on `canonical_service_schemas`:

```sql
ALTER TABLE canonical_service_schemas
  ADD COLUMN has_product_catalog BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN product_catalog_schema JSONB,   -- nullable when has_product_catalog=FALSE
  ADD COLUMN product_min_count_for_visibility INT NOT NULL DEFAULT 0;
```

---

## Which canonical_services get product catalogs

**~20 of ~115 canonical_services** have product catalogs (everything sold as discrete items). The rest are package-based (photographers sell hours of coverage, officiants sell ceremonies — single service unit, attributes alone suffice).

### Product-catalog categories (V1.1 launch set)

| Canonical service | Products = | `product_category` examples | Min count for visibility |
|---|---|---|---|
| `catering` | Dishes on menu | `mains`, `appetizers`, `desserts`, `vegetarian`, `halal`, `regional_filipino` | 10 |
| `coffee_booth` | Drinks served | `espresso_drinks`, `iced_drinks`, `specialty`, `non_coffee_alternatives` | 5 |
| `mobile_bar` | Cocktails / drinks offered | `cocktails`, `mocktails`, `beer_wine`, `signature_drinks`, `specialty_themed` | 5 |
| `dessert_station` | Desserts/pastries available | `cakes_minis`, `pastries`, `frozen_desserts`, `filipino_desserts`, `chocolate` | 5 |
| `live_cooking_station` | Dishes prepared on-site | `pasta_station`, `paella`, `taco_station`, `noodle_bowls`, `grill_station` | 3 |
| `wedding_cake` | Cake designs/flavors | `flavors`, `design_styles`, `tier_options` | 5 |
| `lechonero` | Lechon offerings | `whole_pig_sizes`, `regional_styles`, `accompaniments` | 3 |
| `food_truck` | Truck menu items | (per-truck cuisine) | 5 |
| `tea_ceremony_station` | Tea varieties | `green_teas`, `black_teas`, `traditional_filipino_brews` | 3 |
| `bridal_gown_custom` | Specific gowns in portfolio | `bridal`, `bridesmaid`, `flower_girl`, `filipiniana`, `mother_of_bride` | 15 |
| `groom_suit_custom` | Specific suits | `tuxedos`, `barongs`, `wedding_suits`, `cocktail_attire` | 10 |
| `florals` | Bouquet styles + centerpiece options + arch designs | `bridal_bouquet`, `centerpieces`, `arches`, `wearable` | 8 |
| `stylist_decorator` | Mood boards (each board = product) | `boho`, `modern`, `traditional_filipino`, `garden`, `beach`, etc. | 5 |
| `band_live_music` | Songs in repertoire | `opm`, `pop`, `jazz`, `standards`, `acoustic`, `ceremony_processional`, `first_dance`, `reception_party` | 20 |
| `acoustic_performer` | Songs in repertoire | (same phase tags as band) | 15 |
| `choir_string_quartet` | Songs in repertoire | `liturgical`, `classical`, `contemporary`, `processional`, `recessional` | 15 |
| `photo_booth` | Backdrop designs + prop packages | `backdrops`, `prop_themes`, `print_template_designs` | 5 |
| `led_background_decorators` | Backdrop designs / arch styles / centerpiece kits | (per-design type) | 5 |
| `transportation_bridal_car` | Specific vehicles for rent | `luxury_sedans`, `vintage_cars`, `limousines`, `suvs`, `unique_vehicles` | 1 |
| `custom_monogram` | Monogram style options | `script_classic`, `modern_minimal`, `cultural_motif`, `art_deco` | 5 |
| `stationery_signage` | Invitation designs · save-the-date templates | `invitation_designs`, `save_the_date`, `programs`, `place_cards`, `menus` | 5 |
| `wedding_coordinator` | Package tiers offered | `day_of_packages`, `partial_packages`, `full_service_packages` | 3 |
| `pakanta` (Setnayan service) | Sample songs in library | `wedding_anthems`, `processional`, `first_dance`, `recessional` | (Setnayan-curated) |

### Attribute-only categories (no product catalog)

| Canonical service | Why no product catalog |
|---|---|
| `photography`, `videography`, `drone`, `prenup_shoot`, `same_day_edit` | Package-based, sold as hours-of-coverage + deliverables; attributes alone suffice |
| `officiant_priest_minister` | Single service unit (one ceremony) |
| `wedding_coordinator` (potentially product) | Has product catalog for package tiers, see above |
| `transportation_guest_shuttle` | Bulk service, vehicles fungible (couples care about capacity, not specific buses) |
| `pre_cana_seminar`, `cfo_seminar` (PH-required Pre-Marriage) | Session-based, attribute-only |
| `florals` (could be either) | Has product catalog for arrangement types |

---

## Per-category product schema examples

### `catering` product (a dish on the menu)

```jsonc
{
  "product_name": "Lechon Cebu-style",
  "product_category": "regional_filipino",
  "attributes": {
    "ingredients_summary": "Whole roasted pig, Cebuano spice rub, served with lechon sauce",
    "allergens": ["soy"],
    "dietary_tags": {
      "halal_compatible": false,  // pork
      "vegetarian": false,
      "vegan": false,
      "gluten_free": true,
      "dairy_free": true,
      "alcohol_in_recipe": false
    },
    "serving_size": "Whole pig serves ~50 pax",
    "minimum_order_quantity": 1,
    "price_per_unit_centavos": 1500000,   // ₱15,000 per whole pig
    "lead_time_days": 3,
    "preparation_notes": "Roasted on-site or delivered same-day per couple preference"
  },
  "photo_r2_keys": ["catering/vendor_xyz/lechon_cebu_1.jpg", "catering/vendor_xyz/lechon_cebu_2.jpg"],
  "starting_price_centavos": 1500000,
  "external_links": null
}
```

### `coffee_booth` product (a drink on the menu)

```jsonc
{
  "product_name": "Spanish Latte",
  "product_category": "espresso_drinks",
  "attributes": {
    "description": "Espresso + condensed milk + steamed milk; PH wedding favorite",
    "size_options": ["8oz", "12oz", "16oz"],
    "milk_options": ["whole", "oat", "almond"],
    "sugar_options": ["regular", "less_sweet", "unsweetened"],
    "iced_available": true,
    "hot_available": true,
    "price_per_cup_centavos": 12000,    // ₱120 per cup
    "vegan_capable": true,              // when oat or almond milk picked
    "decaf_capable": true
  },
  "photo_r2_keys": ["coffee/vendor_abc/spanish_latte.jpg"]
}
```

### `mobile_bar` product (a cocktail offered)

```jsonc
{
  "product_name": "Calamansi Margarita",
  "product_category": "signature_cocktails",
  "attributes": {
    "ingredients": ["tequila", "calamansi juice", "agave syrup", "salt rim"],
    "alcohol_content": "12% ABV",
    "alcohol_free_version_available": true,
    "price_per_serving_centavos": 18000,
    "garnish": "calamansi wheel + salt rim",
    "preparation_method": "shaken_chilled",
    "signature_to_vendor": true
  },
  "photo_r2_keys": ["mobile_bar/vendor_def/calamansi_marg.jpg"]
}
```

### `bridal_gown_custom` product (a specific gown in portfolio)

```jsonc
{
  "product_name": "Aurora Mermaid Lace Gown",
  "product_category": "bridal",
  "attributes": {
    "silhouette": "mermaid",
    "neckline": "sweetheart",
    "sleeve_style": "long_lace_sleeves",
    "back_style": "illusion_back",
    "train_length": "cathedral",
    "primary_fabric": "lace",
    "secondary_fabric": "satin_under_skirt",
    "embellishments": ["beadwork", "embroidery", "pearl_buttons"],
    "color_palette": ["ivory", "champagne"],
    "available_for_purchase": true,
    "available_for_rent": true,
    "rental_price_centavos": 4500000,    // ₱45,000 rental
    "purchase_price_centavos": 12000000, // ₱120,000 purchase
    "fitting_appointments_required": 4,
    "customization_scope": "color_adjustment_and_embellishment_substitution",
    "showroom_available_to_try": true,
    "sample_size_available": "size_8"
  },
  "photo_r2_keys": ["gown/vendor_xyz/aurora_front.jpg", "gown/vendor_xyz/aurora_back.jpg", "gown/vendor_xyz/aurora_detail.jpg"]
}
```

### `band_live_music` product (a song in repertoire)

```jsonc
{
  "product_name": "Perfect (Ed Sheeran)",
  "product_category": "first_dance",
  "attributes": {
    "original_artist": "Ed Sheeran",
    "genre": ["pop", "acoustic"],
    "wedding_phases_appropriate": ["first_dance", "reception"],
    "ensemble_arrangement": "acoustic_guitar_and_vocals",
    "language": "english",
    "tempo_bpm": 95,
    "duration_seconds": 263,
    "religious_acceptable": ["catholic", "civil", "christian", "inc"],  // INC OK since secular pop, no controversial content
    "key_signatures_available": ["original_Ab", "transposed_G", "transposed_A"]
  },
  "audio_r2_keys": ["band/vendor_def/perfect_sample.mp3"],
  "video_r2_keys": ["band/vendor_def/perfect_live_performance.mp4"],
  "external_links": {
    "spotify_original": "https://open.spotify.com/track/...",
    "youtube_band_performance": "https://youtube.com/..."
  }
}
```

### `transportation_bridal_car` product (a specific vehicle)

```jsonc
{
  "product_name": "1969 Vintage Volkswagen Beetle (Cream)",
  "product_category": "vintage_cars",
  "attributes": {
    "vehicle_year": 1969,
    "make": "Volkswagen",
    "model": "Beetle",
    "color": "cream",
    "seating_capacity": 4,
    "convertible": false,
    "decoration_included": true,
    "decoration_style_options": ["floral_white", "ribbon_minimal", "couple_monogram"],
    "driver_attire_options": ["uniformed_chauffeur", "vintage_themed"],
    "max_distance_km": 50,
    "rate_per_hour_centavos": 350000,    // ₱3,500/hr
    "minimum_hours": 4,
    "available_for_garlanding": true
  },
  "photo_r2_keys": ["transport/vendor_ghi/vw_beetle_1.jpg", "transport/vendor_ghi/vw_beetle_2.jpg"]
}
```

---

## Couple-side product search & filter UX

### Two-level search

Marketplace filter sidebar supports both attribute-level filters (from [0044](../0044_per_category_schemas/0044_per_category_schemas.md)) AND product-level filters:

**Catering example (compound query):**
- Attribute filter: `cuisine_specialties CONTAINS 'filipino_traditional'`
- Product filter: products with `product_name LIKE 'lechon%'` OR `product_name LIKE 'pancit%'`
- Combined: "Show me Filipino-cuisine caterers in Cebu that serve both Lechon and Pancit"

**Coffee booth example:**
- Attribute filter: `milk_options CONTAINS 'oat'`
- Product filter: products with `product_name = 'Spanish Latte'`
- Combined: "Coffee booths with oat milk that serve Spanish Latte"

### Product-name fuzzy search

Couples type partial product names into search; trigram index handles fuzzy match:
- "spanish lat" → Spanish Latte, Spanish Cake (if a dessert)
- "lechon" → Lechon Cebu, Lechon Manila, Lechon La Loma
- "mermaid" → Mermaid Gown, Mermaid Sheath, etc.

### Dietary-tag filtering at product level

Couples can filter products (not just vendors) by dietary tags:
- "Show me catering vendors with at least 5 vegan options" → joins on `vendor_products` where `attributes->>'dietary_tags'->>'vegan' = 'true'`
- "Show me dessert stations with at least 3 gluten-free items"

This is granular dietary support couples actually want, vs WedMeGood's binary "Has vegetarian options" attribute.

### Faith-compatibility filtering at product level (NEW with this iteration)

Some products are faith-incompatible even when the vendor is faith-compatible at the attribute level. Example:

- Caterer marks themselves `inc_friendly=TRUE` at attribute level (they CAN do alcohol-free menus)
- But a specific product (`Tiramisu Cake`) has `alcohol_in_recipe=TRUE`
- INC couples filtering for INC weddings see the caterer (attribute matches) but the tiramisu product is **flagged or hidden** in their catalog view

This solves the "vendor offers both halal and non-halal items" or "caterer offers both alcoholic and non-alcoholic desserts" case cleanly.

---

## Cart integration ([0034_payments_and_cart](../0034_payments_and_cart/0034_payments_and_cart.md))

Couples add specific products to cart, not just generic vendor packages:

**Before (current cart model):**
```
Cart:
  Catering Service: ABC Caterer       ₱150,000
  Mobile Bar:       XYZ Bartenders    ₱45,000
```

**After (with product catalog):**
```
Cart:
  ABC Caterer:
    Lechon Cebu-style × 1              ₱15,000
    Pancit Palabok 50pax               ₱18,000
    Halo-halo Station 100 servings     ₱25,000
    Buffet Service (Filipino, 150pax)  ₱92,000
    Subtotal: ₱150,000
  XYZ Bartenders:
    Calamansi Margarita station        ₱20,000
    Mocktail Bar (mango/watermelon)    ₱15,000
    Bartender + Setup (5 hrs)          ₱10,000
    Subtotal: ₱45,000
```

Schema implication for [0034](../0034_payments_and_cart/0034_payments_and_cart.md):

```sql
-- service_orders extension (existing table from 0034)
ALTER TABLE service_order_line_items
  ADD COLUMN vendor_product_id UUID REFERENCES vendor_products(product_id),
  ADD COLUMN product_name_snapshot TEXT,         -- preserves product name at time of order (in case vendor renames later)
  ADD COLUMN product_quantity INT NOT NULL DEFAULT 1,
  ADD COLUMN product_attributes_snapshot JSONB;  -- preserves attribute state at order time
```

The snapshot pattern preserves "what the couple ordered" even if the vendor edits the product later. Critical for dispute resolution and accounting.

---

## Vendor catalog management UX ([0022_vendor_dashboard](../0022_vendor_dashboard/0022_vendor_dashboard.md))

### Catalog editor

Vendor dashboard surface at `/vendor-dashboard/catalog`:

- List view: all products grouped by `canonical_service` and `product_category`
- Per-product CRUD: name, attributes (per the product_catalog_schema), photos, video, audio, links, price, active/inactive toggle
- Drag-to-reorder via `display_order`
- Bulk operations: "Mark all `is_active=FALSE` for products in category X" (for off-season menu changes)
- Search within catalog by product name

### Quick-add patterns

For vendors building large catalogs, surface quick-add affordances:

**For caterers:**
- "Use Standard PH Wedding Catering Menu Template" — pre-fills 30 common dishes (Lechon, Pancit, Adobo, Bistek, Kare-kare, etc.) with empty attributes the vendor fills in
- CSV import — vendors with existing menu spreadsheets can bulk upload (CSV schema published)
- Photo-first add: snap a photo, system OCRs the name + suggests product_category, vendor confirms

**For bands:**
- "Import song catalog from CSV (artist, song_name, genre)"
- "Browse Spotify Web API and tag tracks you can perform" (V1.2+ — Spotify integration)
- "Copy from another band's public song list as starting template"

**For gown designers:**
- Photo-first add: upload gown photo, system suggests silhouette / neckline via image analysis (Sonnet 4.6 vision per [0032](../0032_contract_intelligence/0032_contract_intelligence.md) stack), vendor confirms

### Mobile-first catalog management

Vendor mobile app (target V1.5+ per [0022](../0022_vendor_dashboard/0022_vendor_dashboard.md)) enables on-the-go catalog updates:
- "Add this dish to catalog" — snap photo, dictate name, pick category, save
- Critical for caterers updating seasonal menus, florists adding new arrangements, etc.

---

## Setnayan-side product catalogs (SETNAYAN SERVICE badge)

Per the "venue for vendors" + "Setnayan eats its own marketplace" pattern from 2026-05-18 CLAUDE.md decision log row, Setnayan's first-party services appear as vendors with the `SETNAYAN SERVICE` badge:

| Setnayan service | Canonical service | Product catalog content |
|---|---|---|
| **Pakanta** ([0036](../0036_pakanta/0036_pakanta.md)) | `pakanta` (custom song) | Sample songs from Setnayan's curated library (couples can preview before commissioning their own) |
| **Pailaw** ([0005](../0005_led_background_maker/0005_led_background_maker.md)) | `led_background_decorators` | 10 Lottie template backgrounds + sample renders |
| **Custom Monogram Pack** | `custom_monogram` | Monogram style options |
| **Save-the-Date Video MP4** ([0024](../0024_save_the_date/0024_save_the_date.md)) | `save_the_date_video` | Template designs |

Setnayan services share the same vendor_products schema and surface alongside third-party products in marketplace browse. This eats Setnayan's own marketplace cleanly without separate product surfaces.

---

## SEO at product-level

Each product gets its own URL (V1.2 SEO push):

- `/v/{vendor-slug}/products/{product-slug}` — e.g., `/v/manila-coffee-co/spanish-latte`
- Indexed by Google for "Spanish Latte wedding coffee booth Manila"
- Product page includes: product details, attribute breakdown, photos, "Used at N real weddings" auto-pulled from [0046 showcase](../0046_wedding_showcase/0046_wedding_showcase.md), CTA to message vendor or add to cart
- Schema.org structured data (Product schema) for rich snippets

This **doubles SEO surface area** vs WedMeGood — they have vendor URLs only; Setnayan has vendor URLs + product URLs.

---

## Quality control

1. **Required minimum products** per category for vendor visibility (see § Which canonical_services table) — a caterer can't surface in marketplace until 10 products are listed
2. **Photo requirement per product** — minimum 1 photo per product (except songs, which can be audio-only)
3. **AI-spam check on product names** (Haiku 4.5 from [0032](../0032_contract_intelligence/0032_contract_intelligence.md)) — flags suspicious names ("BEST CATERER EVER 100% GUARANTEED")
4. **Couple flagging** — couples can flag inaccurate product listings ("This vendor's 'Halal Lechon' is not actually halal"); admin queue ([0023](../0023_admin_console/0023_admin_console.md))
5. **Duplicate-detection** — when vendor adds a product, fuzzy-match against existing catalog and prompt "Did you mean to edit your existing 'Spanish Latte' product?"

---

## Edge cases

1. **Vendor edits product after couple orders.** Snapshot pattern preserves order-time state; couple sees what they ordered, vendor's current catalog may differ. Vendor edits don't retroactively change historical orders.
2. **Vendor deletes product after couple shortlists it.** Soft-delete: mark `is_active=FALSE`. Couple shortlist shows product as "no longer offered" with vendor messaging CTA.
3. **Product available at multiple price tiers.** Use `attributes.price_tiers[]` for tiered pricing (e.g., a gown might be ₱40K rental / ₱120K purchase). Multiple `starting_price_centavos` values within attributes.
4. **Seasonal availability.** Use `attributes.seasonal_availability` ENUM (year_round / spring_summer / fall_winter / valentine_only / christmas_only); product shows availability badge.
5. **Out of stock / fully booked.** Use `attributes.stock_status` ENUM (available / limited / fully_booked / waitlist_only); affects whether couple can add to cart.
6. **Vendor doesn't want to list specific prices.** Per-product `starting_price_centavos` is nullable; couples see "Request Quote" instead of price.
7. **Product belongs to multiple `product_category` values.** A "Spanish Latte" is both `espresso_drinks` and `signature_drinks`. Use `product_category TEXT[]` (multi-value) instead of single TEXT.

---

## Open questions

1. **`product_category` as multi-value vs single?** Recommend multi-value (TEXT[]) for flexibility (Spanish Latte = espresso + signature). Migration: change schema before V1.1 ships.
2. **Product reviews vs vendor reviews?** Should couples be able to review specific products ("Spanish Latte was great, latte art was a 7/10") separate from vendor reviews? Recommend NO for V1.1 (review volume per product would be too low to be useful); revisit V2.
3. **Product-level pricing transparency policy.** Some vendors don't want public prices on individual products even if attribute-level pricing is private. Recommend per-product `show_price_publicly` override that defaults to vendor-level setting.
4. **CSV import schema.** Need a published CSV schema for each canonical_service with products. Recommend Excel/Google Sheets templates published in vendor docs ([0029 help center](../0029_help_center/0029_help_center.md)).
5. **Image processing pipeline.** Product photos need thumbnail generation, format conversion (WebP), CDN delivery. Reuse existing R2 + image processing infra from [0013 platform stack](../0013_platform_stack_and_sync/0013_platform_stack_and_sync.md).

---

## Phasing

**V1.1 launch:**
- `vendor_products` table + schema
- `vendor_product_catalog_schemas` extension to `canonical_service_schemas`
- Catalog management UX in vendor dashboard for 5-10 categories: catering, coffee_booth, mobile_bar, bridal_gown_custom, band_live_music, photo_booth
- Couple-side product-level filters in 3 marketplaces: Food, Beverage, Gown
- Cart integration: order_line_items reference vendor_products
- Setnayan first-party services (Pakanta, Pailaw, Custom Monogram) populate via this same schema

**V1.2:**
- Remaining product-catalog categories (transportation_bridal_car, florals, stationery, wedding_cake, dessert_station, custom_monogram, stylist mood boards, choir/string quartet, acoustic_performer, led_background_decorators, etc.)
- Product-level SEO URLs (`/v/{vendor}/products/{product}`)
- Vendor mobile app catalog editor (snap-and-add)
- CSV import for power-users
- Photo-first add with vision-model attribute suggestion

**V1.3+:**
- Spotify integration for band catalog import
- Cross-vendor product comparison views ("Compare these 3 caterers' Lechon offerings side-by-side")
- Recommended-products ML ("Couples like you also booked these Lechons")

---

## Cross-references

- Consumes: [0006](../0006_vendors_management/0006_vendors_management.md) (vendors), [0022](../0022_vendor_dashboard/0022_vendor_dashboard.md) (vendor dashboard host), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart line items), [0044](../0044_per_category_schemas/0044_per_category_schemas.md) (schema framework + which categories have catalogs), [0013](../0013_platform_stack_and_sync/0013_platform_stack_and_sync.md) (R2 storage for product media)
- Provides: `vendor_products` table + product-catalog framework + per-product attribute schemas + cart line-item integration
- Consumed by: [0046](../0046_wedding_showcase/0046_wedding_showcase.md) (showcase credits specific products used at the wedding), [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) (product-level filters in marketplace), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart shows specific products with snapshot pricing)

---

## Decision log

- **2026-05-18 — Iteration drafted.** Product-level catalog as second layer beneath attribute schemas. ~20 of ~115 canonical_services get product catalogs (consumable categories like catering/coffee/bar + portfolio categories like gowns/bands/cars). Compound queries (attribute AND product) unlock filter depth WedMeGood structurally lacks. Cart integration uses snapshot pattern to preserve order-time product state. Setnayan first-party services (Pakanta, Pailaw, Custom Monogram) populate via same schema with SETNAYAN SERVICE badge per "Setnayan eats its own marketplace" pattern. SEO at product-level URLs doubles SEO surface area vs WedMeGood. Faith-incompatible products (alcohol-in-recipe desserts for INC couples) flagged at product level even when vendor is attribute-compatible.
