# Iteration 0044 — Per-Category Vendor Attribute Schemas

**Iteration number:** 0044
**Topic:** Per-canonical-service attribute schema framework + shared attribute groups (faith compatibility, dietary accommodations, etc.) so each marketplace gets the right slots for vendors to fill
**Surface:** Vendor dashboard onboarding wizard ([0022_vendor_dashboard](../0022_vendor_dashboard/0022_vendor_dashboard.md)) + couple-facing marketplace filter UX ([0006_vendors_management](../0006_vendors_management/0006_vendors_management.md) extended)
**Status:** Drafted 2026-05-18 · V1.1 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.1 — drafts after pilot wraps; engineering depends on [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) ceremony types being live
**Builds on:** 0006 (canonical_services enum + vendor_services junction), 0022 (vendor dashboard wizard host), 0043 (ceremony_type + venue_setting drive default filters)
**Consumed by:** 0045 (product catalogs use the same per-category framework), 0046 (showcase faceted by vendor attributes), 0047 (style-driven marketplaces use the schemas as filter UX source)
**Companion specs:** 0006, 0022, 0043

---

## What this iteration ships

A framework where **each canonical_service has its own attribute schema** — the slots vendors fill that define what they offer and how they're searchable. Two structural primitives:

1. **`canonical_service_schemas` table** — JSONB-stored schema definitions per canonical_service, declaring what fields a vendor of that type fills out
2. **`vendor_service_attributes` table** — per-vendor per-category attribute payloads, validated against the schema definition

Plus **shared attribute groups** (faith_compatibility, dietary_accommodations, geographic_service_areas) that multiple canonical_services inherit instead of redefining.

This replaces WedMeGood's "one generic vendor profile with free-text bio" pattern with structured, queryable, per-category vendor data — which becomes the foundation for the style-driven marketplaces ([0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md)) and the faceted Wedding Showcase ([0046](../0046_wedding_showcase/0046_wedding_showcase.md)).

V1.1 ships with **schemas for the top 15 canonical_services** (covering ~80% of vendor traffic); remaining schemas roll out V1.2+.

---

## Why this is the foundation

The "venue for vendors to populate" thesis (per 2026-05-18 CLAUDE.md decision log row) means Setnayan builds the slots, vendors fill them. But the slots can't be one-size-fits-all:

- A gown designer has 12+ dimensions that matter (silhouette, neckline, fabric, fittings, etc.)
- A photographer has 6+ dimensions (edit aesthetic, deliverables, awards, response time, crew size, past venues)
- A caterer has 8+ dimensions (cuisine, dietary, service style, headcount range, sample menus, halal/INC tags, equipment, tasting availability)
- A band has 5+ dimensions (genre, ensemble configurations, ceremony vs reception ready, accepts requests, sample audio)

Each category needs DIFFERENT slots. WedMeGood collapses these into a generic profile because their schema isn't faceted. Setnayan's per-category schemas are the structural moat.

---

## Schema

### `canonical_service_schemas` table (NEW)

```sql
CREATE TABLE canonical_service_schemas (
  canonical_service TEXT PRIMARY KEY,  -- e.g., 'photography', 'catering', 'bridal_gown_custom'
  schema_version INT NOT NULL DEFAULT 1,
  display_name_en TEXT NOT NULL,
  display_name_tl TEXT,
  display_name_ceb TEXT,
  shared_attribute_groups TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    -- e.g., ARRAY['faith_compatibility','dietary_accommodations']
  category_specific_attributes JSONB NOT NULL,
    -- field definitions: { field_name: { type, required, options, validation } }
  filter_facets JSONB NOT NULL,
    -- which fields appear as marketplace filter sidebars
  required_for_visibility JSONB NOT NULL,
    -- minimum fields/products vendor must fill before listing surfaces in marketplace
  ranking_signal_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- how attribute completeness affects marketplace ranking
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Schema versioning is critical — schemas evolve. Adding a new field to `photography` shouldn't break existing photographer profiles filled out under an older schema_version. Migration paths described in § Schema evolution below.

### `shared_attribute_groups` table (NEW)

Reusable attribute sets that multiple canonical_services inherit.

```sql
CREATE TABLE shared_attribute_groups (
  group_name TEXT PRIMARY KEY,  -- e.g., 'faith_compatibility', 'dietary_accommodations'
  display_name_en TEXT NOT NULL,
  display_name_tl TEXT,
  attributes JSONB NOT NULL,
    -- field definitions same shape as category_specific_attributes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `vendor_service_attributes` table (NEW)

Per-vendor per-category attribute payloads.

```sql
CREATE TABLE vendor_service_attributes (
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  canonical_service TEXT NOT NULL REFERENCES canonical_service_schemas(canonical_service),
  attribute_payload JSONB NOT NULL,
    -- vendor-filled values, validated against schema
  schema_version_at_fill INT NOT NULL,
    -- which schema_version vendor filled against; used for migration handling
  completeness_score INT NOT NULL DEFAULT 0,
    -- 0-100, computed: filled_fields / total_fields × 100
  meets_visibility_minimum BOOLEAN NOT NULL DEFAULT FALSE,
    -- whether vendor meets required_for_visibility for this category
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (vendor_id, canonical_service)
);

CREATE INDEX vendor_attrs_visibility_idx ON vendor_service_attributes (canonical_service, meets_visibility_minimum) WHERE meets_visibility_minimum = TRUE;
CREATE INDEX vendor_attrs_completeness_idx ON vendor_service_attributes (canonical_service, completeness_score DESC);
-- GIN index on JSONB for faceted search
CREATE INDEX vendor_attrs_payload_gin ON vendor_service_attributes USING GIN (attribute_payload jsonb_path_ops);
```

---

## Shared attribute groups (V1.1 launch set)

### `faith_compatibility` (consumed by all consumable categories)

```jsonc
{
  "halal_certified": { "type": "boolean", "label": "Halal-certified (with official certification)" },
  "halal_compatible": { "type": "boolean", "label": "Halal-compatible (no pork/alcohol, not formally certified)" },
  "inc_friendly": { "type": "boolean", "label": "INC-friendly (no alcohol anywhere in food/sauces/desserts)" },
  "kosher_certified": { "type": "boolean", "label": "Kosher-certified" },
  "kosher_compatible": { "type": "boolean", "label": "Kosher-compatible" },
  "vegetarian_capable": { "type": "boolean", "label": "Full vegetarian menu available" },
  "vegan_capable": { "type": "boolean", "label": "Full vegan menu available" },
  "lenten_compliant": { "type": "boolean", "label": "No-meat Lenten menu (Catholic Lent season)" },
  "allergen_aware": { "type": "boolean", "label": "Trained in cross-contamination prevention" }
}
```

**Inherited by:** `catering`, `mobile_bar`, `coffee_booth`, `dessert_station`, `live_cooking_station`, `wedding_cake`, `lechonero`, `food_truck`, `tea_ceremony_station`

**Couple-side default filtering** (driven by [0043 ceremony_type](../0043_wedding_type_picker/0043_wedding_type_picker.md)):
- `ceremony_type='muslim'` → auto-filter `halal_certified=TRUE OR halal_compatible=TRUE`
- `ceremony_type='inc'` → auto-filter `inc_friendly=TRUE`
- `ceremony_type='mixed'` with Muslim or INC half → intersection of constraints
- Couple can manually expand filter (e.g., "show me caterers that say they can adapt even if not formally tagged")

### `dietary_accommodations` (consumed by all food/beverage categories)

```jsonc
{
  "gluten_free_capable": { "type": "boolean" },
  "nut_free_capable": { "type": "boolean" },
  "dairy_free_capable": { "type": "boolean" },
  "diabetic_friendly": { "type": "boolean" },
  "keto_capable": { "type": "boolean" },
  "low_sodium_capable": { "type": "boolean" }
}
```

**Inherited by:** Same set as `faith_compatibility`.

### `geographic_service_areas` (consumed by every category)

```jsonc
{
  "service_regions": {
    "type": "multi_select",
    "options": [
      "metro_manila", "rizal", "cavite", "laguna", "batangas", "bulacan",
      "tagaytay", "cebu", "cebu_metro", "mactan",
      "davao", "iloilo", "bacolod", "cagayan_de_oro", "baguio",
      "boracay", "palawan", "el_nido", "siargao", "bohol", "batanes", "vigan",
      "barmm_general", "lanao_del_sur", "maguindanao", "sulu", "tawi_tawi", "basilan",
      "international_destination"
    ]
  },
  "travel_radius_km_from_base": { "type": "int" },
  "willing_to_travel_destination": { "type": "boolean" },
  "destination_travel_fee_centavos": { "type": "int", "required_if": "willing_to_travel_destination=true" }
}
```

**Inherited by:** every canonical_service (universal).

### `pricing_signal` (consumed by every category)

```jsonc
{
  "starting_price_centavos": { "type": "int", "label": "Starting price (PHP centavos)" },
  "typical_range_min_centavos": { "type": "int" },
  "typical_range_max_centavos": { "type": "int" },
  "price_model": {
    "type": "enum",
    "options": ["fixed_per_package", "tiered", "per_hour", "per_pax", "custom_quote_only"]
  },
  "show_prices_publicly": { "type": "boolean", "default": false }
}
```

**Inherited by:** every canonical_service. Couples can filter by price tier; vendors who keep prices private get a "Request Quote" CTA only.

### `vendor_credentials` (consumed by every category)

```jsonc
{
  "years_operating": { "type": "int" },
  "awards_received": { "type": "multi_select", "options": ["PWP", "PEPP", "Junebug", "WPJA", "ISPWP", "BridesPH", "other"] },
  "magazine_features": { "type": "multi_select", "options": ["Wedding_Essentials", "Bride_PH", "Metro_Society", "OneFineDay", "other"] },
  "notable_past_clients": { "type": "text_short" },
  "celebrity_weddings_handled": { "type": "boolean" }
}
```

**Inherited by:** every canonical_service.

---

## Category-specific attribute schemas (V1.1 launch set — top 15 canonical_services)

### `catering`

```jsonc
{
  "shared_attribute_groups": ["faith_compatibility", "dietary_accommodations", "geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "cuisine_specialties": {
      "type": "multi_select",
      "options": ["filipino_traditional", "filipino_chinese", "western", "japanese", "korean", "mediterranean", "spanish", "italian", "thai", "indian", "halal_specialty", "fusion"],
      "required": true
    },
    "service_styles": {
      "type": "multi_select",
      "options": ["plated", "buffet", "family_style", "cocktail", "live_station_focused", "lechon_focused", "intimate_only"],
      "required": true
    },
    "headcount_range_min": { "type": "int", "required": true },
    "headcount_range_max": { "type": "int", "required": true },
    "tasting_availability": { "type": "enum", "options": ["free_tasting", "paid_tasting", "no_tasting"] },
    "tasting_fee_centavos": { "type": "int", "required_if": "tasting_availability=paid_tasting" },
    "equipment_provided": {
      "type": "multi_select",
      "options": ["chafers", "china", "silverware", "table_linens", "glassware", "napkins"]
    },
    "crew_size_typical": { "type": "int" },
    "setup_hours_required": { "type": "int" },
    "sample_menu_uploads_count": { "type": "int", "min": 1, "label": "Upload at least 1 sample menu PDF/image" },
    "kitchen_facility_type": { "type": "enum", "options": ["full_commissary", "shared_kitchen", "off_site_prep_only"] }
  },
  "filter_facets": ["cuisine_specialties", "service_styles", "headcount_range_min", "faith_compatibility", "dietary_accommodations", "starting_price_centavos", "service_regions"],
  "required_for_visibility": {
    "minimum_fields": ["cuisine_specialties", "service_styles", "headcount_range_min", "headcount_range_max", "service_regions"],
    "minimum_uploads": { "sample_menu": 1, "vendor_logo": 1 },
    "minimum_products": 10  // product catalog from 0045 — 10 dishes minimum
  }
}
```

### `photography`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "edit_aesthetics": {
      "type": "multi_select",
      "options": ["moody", "bright_airy", "fine_art", "documentary", "editorial", "film_emulation", "bw_heavy", "warm_toned", "cool_toned"],
      "required": true
    },
    "shooting_styles": {
      "type": "multi_select",
      "options": ["photojournalistic", "posed_traditional", "cinematic", "candid", "fashion_inspired"]
    },
    "deliverables": {
      "type": "multi_select",
      "options": ["wedding_day_photos", "pre_nup_photos", "engagement_photos", "drone_footage", "same_day_edit_stills", "album_design", "reels_for_social"]
    },
    "crew_size_typical": { "type": "int" },
    "response_time_sla_hours": { "type": "int" },
    "past_venues_worked": { "type": "multi_select_open", "label": "Venues you've shot at (add up to 50)" },
    "sample_portfolio_uploads_count": { "type": "int", "min": 10, "label": "Upload at least 10 portfolio photos" },
    "wedding_count_handled": { "type": "int" }
  },
  "filter_facets": ["edit_aesthetics", "shooting_styles", "deliverables", "awards_received", "starting_price_centavos", "service_regions", "response_time_sla_hours"],
  "required_for_visibility": {
    "minimum_fields": ["edit_aesthetics", "shooting_styles", "deliverables", "service_regions"],
    "minimum_uploads": { "portfolio_photos": 10, "vendor_logo": 1 }
  }
}
```

### `videography`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "edit_aesthetics": { "type": "multi_select", "options": ["cinematic_moody", "documentary", "highlight_focused", "long_form_narrative", "music_video_style"] },
    "deliverables": { "type": "multi_select", "options": ["full_film", "highlight_reel", "same_day_edit", "social_reels", "raw_footage", "drone_footage"] },
    "sample_reels_count": { "type": "int", "min": 3, "label": "Upload at least 3 sample reels" },
    "delivery_turnaround_weeks": { "type": "int" }
  },
  "filter_facets": ["edit_aesthetics", "deliverables", "starting_price_centavos", "service_regions"]
}
```

### `bridal_gown_custom`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "service_model": {
      "type": "multi_select",
      "options": ["made_to_measure", "ready_to_wear", "couture_one_of_one", "rental", "alterations_only"],
      "required": true
    },
    "specialty_types": {
      "type": "multi_select",
      "options": ["bridal_gown", "filipiniana_terno", "filipiniana_maria_clara", "filipiniana_balintawak", "bridesmaid", "mother_of_bride", "flower_girl", "junior_bridesmaid", "matrimonial_pair"]
    },
    "silhouettes_offered": {
      "type": "multi_select",
      "options": ["a_line", "ball_gown", "mermaid", "trumpet", "sheath", "tea_length", "fit_and_flare", "empire"]
    },
    "necklines_offered": {
      "type": "multi_select",
      "options": ["sweetheart", "v_neck", "halter", "illusion", "off_shoulder", "bateau", "queen_anne", "high_neck"]
    },
    "fabric_specialties": {
      "type": "multi_select",
      "options": ["silk", "satin", "lace", "tulle", "chiffon", "organza", "brocade", "pina", "jusi", "embroidered", "beaded"]
    },
    "embellishments": { "type": "multi_select", "options": ["beadwork", "embroidery", "applique", "pearls", "crystal", "3d_florals", "cultural_motifs"] },
    "typical_fittings_count": { "type": "int" },
    "lead_time_months": { "type": "int" },
    "rush_capacity_weeks": { "type": "int" },
    "showroom_locations": { "type": "multi_select_open" },
    "samples_available_for_try_on": { "type": "boolean" },
    "willing_to_travel_for_fitting": { "type": "boolean" },
    "wedding_day_attendant_available": { "type": "boolean" },
    "on_site_alterations_capable": { "type": "boolean" },
    "signature_designer_name": { "type": "text_short" }
  },
  "filter_facets": ["service_model", "specialty_types", "silhouettes_offered", "necklines_offered", "fabric_specialties", "starting_price_centavos", "service_regions"],
  "required_for_visibility": {
    "minimum_fields": ["service_model", "specialty_types", "silhouettes_offered", "service_regions"],
    "minimum_uploads": { "portfolio_photos": 15, "vendor_logo": 1 }
  }
}
```

### `band_live_music`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "ensemble_configurations": {
      "type": "multi_select",
      "options": ["solo_acoustic", "duo", "trio", "quartet", "full_band_5plus", "string_quartet", "brass_ensemble", "kulintang_ensemble", "rondalla_ensemble", "choir"]
    },
    "genres": {
      "type": "multi_select",
      "options": ["opm", "pop", "jazz", "standards", "acoustic", "rock", "classical", "kundiman", "folk_pinoy", "contemporary_christian", "broadway", "rnb_soul"]
    },
    "ceremony_ready": { "type": "boolean" },
    "reception_ready": { "type": "boolean" },
    "accepts_song_requests": { "type": "enum", "options": ["yes_any", "yes_from_pre_approved_list", "no"] },
    "song_catalog_count": { "type": "int", "min": 20, "label": "Tag at least 20 songs from your repertoire (see 0045 product catalog)" },
    "instruments_brought": { "type": "multi_select" },
    "sound_system_provided": { "type": "boolean" },
    "religious_repertoire_available": { "type": "multi_select", "options": ["catholic_liturgical", "inc_acceptable", "christian_worship", "muslim_acceptable", "secular_only"] }
  },
  "filter_facets": ["ensemble_configurations", "genres", "ceremony_ready", "reception_ready", "religious_repertoire_available", "starting_price_centavos", "service_regions"]
}
```

### `host_emcee`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "languages_offered": {
      "type": "multi_select",
      "options": ["english", "tagalog", "cebuano", "taglish", "ilocano", "kapampangan", "hiligaynon", "bisaya"],
      "required": true
    },
    "style_archetypes": {
      "type": "multi_select",
      "options": ["comedic", "formal", "warm_sentimental", "energetic_party", "cultural_traditional"]
    },
    "voice_sample_uploads_count": { "type": "int", "min": 1, "label": "Upload at least 1 voice sample (60-sec audio clip)" },
    "format_experience": {
      "type": "multi_select",
      "options": ["catholic_wedding", "civil_ceremony", "muslim_wedding", "inc_wedding", "christian_wedding", "garden_wedding", "beach_wedding", "destination_wedding", "multi_day_wedding"]
    },
    "audience_sizes_handled": {
      "type": "multi_select",
      "options": ["intimate_under_50", "standard_50_to_200", "grand_200_to_500", "huge_500_plus"]
    },
    "religious_service_comfort": {
      "type": "multi_select",
      "options": ["all_faiths", "catholic_only", "inc_only", "christian_only", "muslim_only", "secular_only"]
    }
  },
  "filter_facets": ["languages_offered", "style_archetypes", "format_experience", "audience_sizes_handled", "religious_service_comfort", "starting_price_centavos", "service_regions"]
}
```

### `wedding_coordination`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "coordinator_types": {
      "type": "multi_select",
      "options": ["day_of_coordinator", "month_of_coordinator", "partial_planner", "full_service_planner", "destination_specialist"]
    },
    "events_per_year_handled": { "type": "int" },
    "languages_spoken": { "type": "multi_select" },
    "ceremony_type_comfort": {
      "type": "multi_select",
      "options": ["catholic", "civil", "inc", "christian", "muslim", "cultural", "mixed"]
    },
    "team_size": { "type": "int" }
  },
  "filter_facets": ["coordinator_types", "ceremony_type_comfort", "starting_price_centavos", "service_regions"]
}
```

### `florals`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "arrangement_types": {
      "type": "multi_select",
      "options": ["bridal_bouquet", "bridesmaid_bouquets", "boutonnieres", "ceremony_aisle", "ceremony_arch", "reception_centerpieces", "backdrop_florals", "wearable_florals", "wreath_focal"]
    },
    "flower_specialties": { "type": "multi_select", "options": ["roses", "peonies", "hydrangeas", "orchids", "native_pinoy_florals", "sampaguita", "ylang_ylang", "garden_seasonal", "imported_only"] },
    "sustainability_practices": { "type": "multi_select", "options": ["locally_sourced", "seasonal_emphasis", "compostable_arrangements", "rental_arch_structures"] },
    "willing_to_dye_custom": { "type": "boolean" },
    "garden_wedding_specialist": { "type": "boolean" },
    "beach_wedding_specialist": { "type": "boolean" }
  },
  "filter_facets": ["arrangement_types", "flower_specialties", "starting_price_centavos", "service_regions"]
}
```

### `stylist_decorator`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "theme_specialties": {
      "type": "multi_select",
      "options": ["boho", "modern_minimalist", "traditional_filipino", "garden_organic", "beach_coastal", "rustic", "industrial", "vintage_classic", "fairytale_romantic", "moody_dark", "cultural_specific"]
    },
    "mood_board_uploads_count": { "type": "int", "min": 5, "label": "Upload at least 5 mood boards" },
    "venue_styling_capable": { "type": "boolean" },
    "props_inventory_listed": { "type": "boolean" },
    "rental_options_available": { "type": "boolean" }
  },
  "filter_facets": ["theme_specialties", "starting_price_centavos", "service_regions"]
}
```

### `photo_booth` (and 360 / GIF / Patiktok variants — see [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) Stations & Booths)

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "booth_types": {
      "type": "multi_select",
      "options": ["traditional_photo_booth", "360_booth", "gif_booth", "polaroid_instax", "selfie_magic_mirror", "patiktok_tiktok_booth"]
    },
    "output_options": { "type": "multi_select", "options": ["printed_strips", "digital_email", "social_share_link", "physical_album"] },
    "footprint_size": { "type": "enum", "options": ["mini", "small", "medium", "large"] },
    "power_requirement": { "type": "enum", "options": ["battery_capable", "110v_standard", "220v_industrial"] },
    "attendant_included": { "type": "boolean" },
    "props_library_size": { "type": "int" },
    "backdrop_options_count": { "type": "int" },
    "hours_typical": { "type": "int" }
  },
  "filter_facets": ["booth_types", "output_options", "footprint_size", "attendant_included", "starting_price_centavos", "service_regions"]
}
```

### `mobile_bar`

```jsonc
{
  "shared_attribute_groups": ["faith_compatibility", "geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "bar_types": {
      "type": "multi_select",
      "options": ["full_cocktail_bar", "beer_wine_only", "mocktail_only", "coffee_focused", "whiskey_cigar", "specialty_themed"]
    },
    "non_alcoholic_specialist": { "type": "boolean", "label": "Mocktail-only capable (INC / Muslim wedding-ready)" },
    "drink_menu_count": { "type": "int", "min": 5, "label": "List at least 5 drinks (see 0045 product catalog)" },
    "attendant_included": { "type": "boolean" },
    "hours_typical": { "type": "int" },
    "alcohol_licensing_handled": { "type": "boolean" }
  },
  "filter_facets": ["bar_types", "non_alcoholic_specialist", "faith_compatibility", "starting_price_centavos", "service_regions"]
}
```

### `coffee_booth`

```jsonc
{
  "shared_attribute_groups": ["faith_compatibility", "dietary_accommodations", "geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "milk_options": {
      "type": "multi_select",
      "options": ["whole", "skim", "oat", "almond", "soy", "coconut", "lactose_free"]
    },
    "coffee_bean_origin": { "type": "multi_select", "options": ["single_origin", "blend", "filipino_grown", "imported", "fair_trade"] },
    "specialty_drinks_offered_count": { "type": "int", "min": 5 },
    "cup_branding_options": { "type": "multi_select", "options": ["plain", "couple_monogram", "custom_design", "biodegradable_kraft"] },
    "footprint_size": { "type": "enum", "options": ["mini", "standard", "grand"] },
    "power_requirement": { "type": "enum", "options": ["battery", "110v", "220v"] },
    "water_access_needed": { "type": "boolean" },
    "attendant_included": { "type": "boolean" },
    "tasting_available_pre_event": { "type": "boolean" }
  },
  "filter_facets": ["milk_options", "coffee_bean_origin", "cup_branding_options", "starting_price_centavos", "service_regions"]
}
```

### `officiant_priest_minister`

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "officiant_type": {
      "type": "enum",
      "options": ["catholic_priest", "civil_judge", "civil_mayor", "civil_justice_of_peace", "inc_minister", "born_again_pastor", "evangelical_pastor", "muslim_imam", "cultural_elder"],
      "required": true
    },
    "languages_offered": { "type": "multi_select", "options": ["english", "tagalog", "cebuano", "taglish", "latin_catholic", "arabic_islamic"] },
    "destination_travel_available": { "type": "boolean" },
    "pre_marriage_counseling_included": { "type": "boolean" },
    "documents_handled": { "type": "multi_select", "options": ["marriage_license_filing", "cenomar_assistance", "civil_registration"] }
  },
  "filter_facets": ["officiant_type", "languages_offered", "destination_travel_available", "starting_price_centavos", "service_regions"]
}
```

### `transportation_bridal_car` (and `transportation_guest_shuttle`)

```jsonc
{
  "shared_attribute_groups": ["geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "vehicle_types_available": {
      "type": "multi_select",
      "options": ["luxury_sedan", "limousine", "vintage_classic", "suv", "van_minivan", "bus_coaster", "carriage_horsedrawn", "motorcycle_escort"]
    },
    "specific_vehicles_listed_count": { "type": "int", "min": 1, "label": "List at least 1 specific vehicle (see 0045 product catalog)" },
    "driver_attire_options": { "type": "multi_select", "options": ["uniformed", "formal_suit", "ceremonial_white", "casual"] },
    "decoration_included": { "type": "boolean" },
    "destination_travel_capable": { "type": "boolean" }
  },
  "filter_facets": ["vehicle_types_available", "starting_price_centavos", "service_regions"]
}
```

### `wedding_cake`

```jsonc
{
  "shared_attribute_groups": ["faith_compatibility", "dietary_accommodations", "geographic_service_areas", "pricing_signal", "vendor_credentials"],
  "category_specific_attributes": {
    "cake_styles": {
      "type": "multi_select",
      "options": ["traditional_tiered", "naked_rustic", "minimalist_modern", "fault_line", "geode", "buttercream_painted", "fondant_sculptural", "cultural_themed", "single_tier_intimate"]
    },
    "flavor_options_count": { "type": "int", "min": 5, "label": "List at least 5 flavors (see 0045 product catalog)" },
    "alcohol_in_recipes": { "type": "boolean", "label": "Cakes contain alcohol (rum, bourbon, etc.) — affects INC/Muslim compatibility" },
    "max_tier_count": { "type": "int" },
    "delivery_included": { "type": "boolean" },
    "tasting_availability": { "type": "enum", "options": ["free", "paid", "none"] }
  },
  "filter_facets": ["cake_styles", "faith_compatibility", "alcohol_in_recipes", "max_tier_count", "starting_price_centavos", "service_regions"]
}
```

V1.1 schemas above cover ~15 of ~115 canonical_services. Remaining schemas (entourage_attire, drone, prenup_shoot, lighting_sound, choir_string_quartet, transportation_guest_shuttle, invitation_print, stationery_signage, souvenirs_giveaways, wedding_rings, honeymoon_planner, dessert_station, live_cooking_station, lechonero, tea_ceremony_station, plus the [0047 Stations & Booths](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) sub-categories, plus the wedding-type-specialty categories from [0043 § Cultural/Folk](../0043_wedding_type_picker/0043_wedding_type_picker.md)) roll out V1.2.

---

## Vendor onboarding flow

### Per-category attribute fill

1. Vendor signs up via [0022 vendor dashboard onboarding](../0022_vendor_dashboard/0022_vendor_dashboard.md)
2. Vendor selects the canonical_services they offer (multi-select from the full ~115 tree, shown grouped by family — Photography, Food & Beverage, Attire, etc.)
3. For EACH selected canonical_service, vendor gets a tailored attribute form derived from the schema:
   - Shared attribute groups appear once (e.g., faith_compatibility shows once even if vendor offers both catering AND wedding_cake)
   - Category-specific attributes appear per category
4. Vendor sees a per-category **completeness score** (`0-100`) computed from filled fields
5. Vendor sees **visibility threshold status** — "Your photography listing will appear in the marketplace once you fill these 4 remaining fields and upload 3 more portfolio photos"

### "Copy from category X" shortcut

For vendors in multiple related categories (e.g., Bridal Gown + Bridesmaid Dresses), surface a one-click "Copy shared fields from [Bridal Gown]" affordance. Saves repetition; vendor can override per-category.

### Mobile-friendly fill

Vendors can fill on mobile (target: vendor app from [0022](../0022_vendor_dashboard/0022_vendor_dashboard.md) Phase 2+). Schema rendering must work in narrow viewports (collapsible sections, bottom-sheet pickers for multi_select fields).

### Geo-aware pre-suggestions

When vendor first signs up, system pre-suggests faith compatibility tags based on:
- BARMM vendors → pre-suggest `halal_certified` or `halal_compatible` (vendor can uncheck)
- Metro Manila vendors → neutral defaults
- INC vendors who self-identify (via signup question "Do you have experience serving INC weddings?") → pre-suggest `inc_friendly`

Suggestions are advisory, never auto-applied.

---

## Couple-side filter UX (consumed by [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md))

Each marketplace renders a filter sidebar (desktop) / bottom-sheet (mobile) dynamically derived from the `canonical_service_schemas.filter_facets` field. Examples:

- **Gown/Suit marketplace** → silhouette · neckline · fabric · service_model · palette · MTM/RTW/Rental
- **Photography marketplace** → edit_aesthetic · shooting_style · deliverables · awards · response_time
- **Food marketplace** → cuisine · dietary · service_style · headcount_range · faith_compatibility · halal/INC tags
- **Band marketplace** → ensemble · genre · ceremony/reception ready · religious_repertoire
- **Host marketplace** → language · style · audience_size · religious_service_comfort · voice sample preview
- **Coffee Booth marketplace** → milk_options · drink_menu_specifics (from 0045) · footprint · power

Filter UI is **dynamic per marketplace**, not static. Same React component, different schemas, different filters rendered.

### Default filters from event context

When a couple is logged in with an event of `ceremony_type='inc'` set:
- All consumable marketplaces auto-apply `inc_friendly=TRUE` to filter sidebar by default
- Couple sees "Filtering for INC-friendly · [Remove filter]" badge above results
- Removing the badge expands to show all vendors (with a re-confirmation modal)

This is the **smart-default-filter pattern** — couples don't have to know to filter; the platform does it for them based on their wedding context.

---

## Schema evolution

Schemas WILL change over time. The framework handles this via `schema_version`:

1. **Adding a new field** — bump `schema_version`. Existing vendor profiles validate against their `schema_version_at_fill`; new fields appear in vendor dashboard as "New field to fill — boost your ranking" prompts.
2. **Renaming a field** — schema migration logic re-maps old field names to new ones via versioned migrators.
3. **Removing a field** — soft-deprecate (mark as `hidden_in_ui` in schema definition); preserve existing data; remove from rendering.
4. **Splitting a field** — versioned migrator splits old single value into new multi-value.

Migration cadence: schemas can evolve weekly; vendor profiles re-validate lazily on next login. No mass migration required.

---

## Quality control

Per the "vendors populate the venue" thesis, quality control is critical:

1. **Required-for-visibility gates** — vendor doesn't appear in marketplace until minimum fields + uploads met
2. **AI-spam detection** on text fields (Haiku 4.5 from [0032](../0032_contract_intelligence/0032_contract_intelligence.md)) — catches keyword stuffing, fake awards, etc.
3. **Image quality gates** — reject uploads <500px, require aspect ratio variety in portfolios
4. **Moderation queue** ([0023 admin console](../0023_admin_console/0023_admin_console.md)) — flagged profiles route to admin for review
5. **Vendor verification gate boost** — verified vendors rank above coming_soon vendors per [PR #56 vendor visibility](../CLAUDE.md) (existing system)
6. **Couple flagging** — couples can flag incorrect vendor self-tags ("This vendor claims halal but doesn't actually offer halal-prep") via review system; admin queue handles

---

## Edge cases

1. **Vendor unchecks a field that's currently in a couple's shortlist criteria.** E.g., vendor was tagged `inc_friendly`, then unchecks it; couples who shortlisted them for INC wedding get a soft-notice: "Vendor X no longer marks themselves as INC-friendly. Review your shortlist."
2. **Schema version mismatch on vendor update.** When vendor edits profile and `schema_version` has advanced, vendor sees a prompt: "We've added 3 new fields since you last updated — fill them to boost your ranking."
3. **Shared attribute group conflict.** If `faith_compatibility` is updated in `shared_attribute_groups` table, all inheriting canonical_services automatically reflect the update (no per-schema duplication).
4. **Vendor in 5+ categories.** Onboarding UI shows categories as tabs; vendor fills one at a time; "Copy shared fields" available between tabs.
5. **Vendor without portfolio photos for a sub-category.** Vendor offering Bridal Gown + Bridesmaid Dresses may have 50 bridal photos and 3 bridesmaid photos. Visibility gates per-category — vendor visible in Bridal marketplace, not yet visible in Bridesmaid marketplace.

---

## Open questions

1. **JSONB vs typed columns?** Storing attributes in JSONB is flexible but loses type safety. Alternative: generate typed columns per canonical_service via DDL migrations. Recommend JSONB for V1.1 (flexibility), revisit if query performance becomes an issue at scale.
2. **Multi-language support for attribute labels?** Vendor onboarding wizard needs EN/TL/Cebuano labels per field. Where does translation live — in `canonical_service_schemas` JSONB or in a separate i18n table? Recommend JSONB with `label_en` / `label_tl` / `label_ceb` per field.
3. **Vendor-suggested schema additions.** A vendor offering an unusual service may request a new attribute field. Admin-approval flow? Or open-text "Other" field with admin curation pipeline?
4. **Filter-facet weighting.** Should vendors with more complete profiles rank higher than those with minimal profiles? Recommend yes (encourages completeness), but weight conservatively to avoid burying smaller new vendors.
5. **Schema export for vendor onboarding via CSV.** Power-user vendors with many products may want to bulk-upload via CSV/spreadsheet. Worth building a CSV importer for V1.2+.

---

## Cross-references

- Consumes: [0006](../0006_vendors_management/0006_vendors_management.md) (canonical_services + vendors), [0022](../0022_vendor_dashboard/0022_vendor_dashboard.md) (vendor dashboard host), [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) (ceremony_type drives default filters)
- Provides: `canonical_service_schemas` · `shared_attribute_groups` · `vendor_service_attributes` tables + the schema framework
- Consumed by: [0045](../0045_product_catalogs/0045_product_catalogs.md) (product catalogs extend per-category), [0046](../0046_wedding_showcase/0046_wedding_showcase.md) (showcase facets), [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) (marketplace filter UX rendering)

---

## Decision log

- **2026-05-18 — Iteration drafted.** Per-category attribute schemas framework locked. Shared attribute groups (faith_compatibility, dietary_accommodations, geographic_service_areas, pricing_signal, vendor_credentials) consumed by multiple canonical_services. Catering schema includes the faith-compatibility group with halal_certified / halal_compatible / inc_friendly / kosher_certified / kosher_compatible / vegetarian_capable / vegan_capable / lenten_compliant / allergen_aware tags. Lechonero edge case (self-filtering for Muslim) covered via vendor compatibility tags from 0043. V1.1 ships schemas for 15 top canonical_services; remaining ~100 roll out V1.2+.
