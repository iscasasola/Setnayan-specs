# Setnayan Taxonomy & Refinements — Master Reference

**Generated 2026-06-04 · mirrors shipped `origin/main` code.** This is a derived reference (a readable mirror of the live taxonomy + 0044 refinement schemas), built to drive **concise onboarding filtering**. The SHIPPED parts are a faithful mirror of code; the PROPOSED parts (26 stub refinements, the onboarding redesign, venue-vocab reconciliation) are **flagged for Cowork ratification** into 0044 / 0043 / 0006 before they become canonical.

**Sources of truth:**
- Tree: `apps/web/lib/taxonomy.ts` (`TAXONOMY_MAP`, `WeddingFolder`, `WeddingTile`).
- Refinements: 0044 migrations (`canonical_service_schemas` + 5 `shared_attribute_groups`).
- Venues: a **separate** subsystem (`venue_directory`) — NOT in 0044. See caveat below.

## Counts at a glance
- **10 parents** → **53 primary tiles** (+ `filipiniana_barongs` cross-view) → **195 canonical leaves**.
- **169 leaves have shipped rich refinements**; **26 are stubs** (Part 4).
- **20 leaves are `marketplaceHidden`** (11 officiants + 6 paperwork + 3 travel) — they auto-resolve or live in the planner, never shown as shopping tiles.
- **9 Setnayan first-party services** render as options under generic tiles (never a "★ Setnayan" tile).
- ⚠ **Reception + Ceremony venues are not 0044 schemas** — their refinements come from `venue_directory` (and the 4 un-reconciled venue vocabularies; see Part 5).

---

# PART 1 — The conciseness model (the answer to "make onboarding more concise")

The mistake to avoid: asking every category's facets. Catering alone has 7 filter facets; photography has 7. Multiply by the ~8 categories a couple picks and onboarding becomes a 60-question slog. Instead, split every refinement into **4 layers** by where it's asked:

### Layer 0 — Universal filters · asked ONCE · filters every category
These live in the 5 shared groups and the onboarding axes. They appear in nearly every leaf's `filter_facets`, so asking them once filters the *whole* marketplace:

| Question | Backing facet | Coverage |
|---|---|---|
| **Where? (region)** | `service_regions` | 100% of schemas |
| **Budget?** | `starting_price_centavos` | ~95% of schemas |
| **How many guests? (pax)** | capacity (venue/catering/stations) | capacity-bound tiles |
| **When? (date)** | availability (`vendor_calendar_blocks`) | all |
| **Event type / faith** | `event_types`, `compatible_ceremony_types`, `faith_compatibility`, `dietary_accommodations` | all; faith **auto-sets** dietary (Muslim→halal, INC→alcohol-free) |

→ **~6 questions, mostly already asked.** Faith silently pre-locks dietary/alcohol facets — the couple never answers those directly. That's a conciseness win already shipped.

### Layer 1 — Primary tile facet · asked PER SELECTED TILE · one chip-row each
When the couple picks a tile in the 53-tile picker, surface **exactly one** highest-signal facet for it (the required, most-discriminating one). A couple who picks 8 tiles answers 8 quick one-tap rows — not 56. Part 3 names the primary facet for every tile.

### Layer 2 — Browse refinements · NOT in onboarding · live on `/vendors`
Every other `filter_facet`. The couple narrows further *inside* a category when browsing. Keeps onboarding short; keeps power available.

### Layer 3 — Vendor-profile detail · vendor fills · never asked of the couple
The non-facet attributes (crew size, turnaround SLA, equipment lists). These rank/inform but don't filter.

### Proposed concise onboarding flow
```
welcome → role → event kind → faith ──┐
                                       ├─ Layer 0 (asked once): region · pax · date · budget
name → date → region → pax → budget ──┘     (faith auto-sets dietary/alcohol)
   ↓
PICKER (53 tiles) — couple taps the categories they want
   ↓
For each picked tile → ONE primary-facet chip row (Layer 1)   ← the only per-category questions
   ↓
account → find vendors (same engine) → congrats → plan
```
**Net:** ~6 universal questions + 1 tap per chosen category. Everything else defers to browse. That's the concise filter.

---

# PART 2 — The universal / shared refinement layer (verbatim)

The 5 `shared_attribute_groups` every leaf inherits some subset of. **Inheritance shorthand:** **univ** = geo+pricing+credentials · **foodbev** = +faith+dietary · **alcohol** = +faith.

**`faith_compatibility`** (all boolean): `halal_certified`, `halal_compatible`, `inc_friendly`, `kosher_certified`, `kosher_compatible`, `vegetarian_capable`, `vegan_capable`, `lenten_compliant`, `allergen_aware`

**`dietary_accommodations`** (all boolean): `gluten_free_capable`, `nut_free_capable`, `dairy_free_capable`, `diabetic_friendly`, `keto_capable`, `low_sodium_capable`

**`geographic_service_areas`**: `service_regions` (multi-select: metro_manila, rizal, cavite, laguna, batangas, bulacan, tagaytay, cebu, mactan, davao, iloilo, bacolod, cagayan_de_oro, baguio, boracay, palawan, el_nido, siargao, bohol, batanes, vigan, barmm_general, lanao_del_sur, maguindanao, sulu, tawi_tawi, basilan, international_destination) · `travel_radius_km_from_base` · `willing_to_travel_destination` · `destination_travel_fee_centavos`

**`pricing_signal`**: `starting_price_centavos` · `typical_range_min/max_centavos` · `price_model` (fixed_per_package / tiered / per_hour / per_pax / custom_quote_only) · `show_prices_publicly`

**`vendor_credentials`**: `years_operating` · `awards_received` (PWP, PEPP, Junebug, WPJA, ISPWP, BridesPH, other) · `magazine_features` · `notable_past_clients` · `celebrity_weddings_handled`

---

# PART 3 — The full tree, with the primary onboarding facet per tile

**Legend:** ⭐ = **Layer-1 primary facet** (the one onboarding asks if the couple picks the tile). `[rich]` = shipped 0044 schema · `[stub]` = needs refinements (Part 4) · `[SN]` = Setnayan first-party · `[hidden]` = marketplaceHidden.

## 1) VENUE
> ⚠ Reception + Ceremony refinements come from `venue_directory`, not 0044.

**Reception** — leaves: `accommodation` (+catering cross-list)
- ⭐ **venue setting/type**: hotel_ballroom / events_place_pavilion / convention_center / garden / beach_waterfront / resort_destination / heritage_hacienda / restaurant_private_dining / tent_open_field / clubhouse
- also: **capacity (pax)** · indoor_outdoor · in_house_catering (PH wrinkle — can suppress the separate Catering match)

**Ceremony** — (venue_directory; officiants auto-resolve, hidden)
- ⭐ **ceremony setting**: church / chapel / garden / beach / civil_registrar / mosque / inc_locale / ancestral_home / same_as_reception
- also: officiant_provided
- `[hidden]` officiants (11): catholic_priest, civil_judge, civil_mayor, civil_justice_of_peace, inc_minister, born_again_pastor, charismatic_pastor, mainline_protestant_pastor, muslim_imam, cultural_tribal_elder, officiant_priest_minister
- `[hidden]` paperwork (6): pre_cana_seminar, cfo_seminar, inc_counseling, muslim_pre_wedding_counseling, marriage_license_expediting, apostille_dfa_authentication

## 2) PLANNING
**Coordinator / Planner** — leaves: `wedding_coordination`[rich], `wedding_planner_partial`[rich], `day_of_coordinator`[rich], `destination_wedding_specialist`[rich], + PH/faith: pamamanhikan, despedida, sponsor, gender_separated, religious_venue, inc, mahr coordinators · `setnayan_concierge`[SN]
- ⭐ **coordinator_types**: day_of / month_of / partial_planner / full_service_planner / destination_specialist
- also: **ceremony_type_comfort** (catholic/civil/inc/christian/muslim/cultural/mixed) · team_size

## 3) FEAST
**Cake** — `wedding_cake`[rich]
- ⭐ **cake_styles**: traditional_tiered / naked_rustic / minimalist_modern / fault_line / geode / buttercream_painted / fondant_sculptural / cultural_themed / single_tier_intimate
- also: faith_compatibility · alcohol_in_recipes · max_tier_count

**Catering** — `catering`[rich], `lechonero`[rich], `halal_catering`[rich]
- ⭐ **cuisine_specialties**: filipino_traditional / filipino_chinese / western / japanese / korean / mediterranean / spanish / italian / thai / indian / halal_specialty / fusion
- also: **service_styles** (plated/buffet/family_style/cocktail/live_station/lechon_focused/intimate) · **headcount range** · faith + dietary
- leaf specials: `lechonero` ⭐ pig_sizes + cooking_methods · `halal_catering` ⭐ halal_certification_body

**Stations** — `live_cooking_station`[rich]
- ⭐ **station_types**: paella / sushi / ramen / grill_bbq / pasta / stir_fry_wok / dimsum / taco_bar / carving_station / salad_assembly
- also: chef_demonstration_style · faith + dietary

## 4) DESIGN
**Stylist / Decorator** — `stylist_decorator`[rich], `decorator_general`[rich], cultural: `capiz_native_decor`[rich], `hacienda_heritage_decor`[rich], `maranao_okir_decor`[rich]
- ⭐ **decor/theme style**: modern_minimalist / traditional_classic / rustic_industrial / bohemian / themed_specialty / luxe_glamour (+ boho, garden_organic, beach_coastal, vintage, fairytale, moody, cultural_specific)
- leaf specials: capiz ⭐ native_material_specialties · hacienda ⭐ heritage_themes · maranao ⭐ okir_motif_specialties

**Florist** — `florals`[rich], `garden_wedding_florist`[rich], `beach_wedding_florist`[rich], `bridal_bouquet_specialty`[rich]
- ⭐ **arrangement_types**: bridal_bouquet / bridesmaid / boutonnieres / ceremony_aisle / ceremony_arch / reception_centerpieces / backdrop_florals / wearable_florals
- also: **flower_specialties** (roses/peonies/orchids/native_pinoy/sampaguita/ylang_ylang/...)

**Lights & Sound** — `lights_sound`[rich]
- ⭐ **rooms_handled**: small_intimate / medium / grand_ballroom · also: engineer_included · lighting_capable

**Dance Floor** — `led_dance_floor`[stub]
**Outdoor** — rentals: `tent_rental`[rich], `generator_rental`[rich], `mobile_restroom_rental`[rich], `cooling_fans_misters`[rich], `outdoor_sound_system`[rich], `outdoor_lighting_specialist`[rich], `parasol_hat_rental`[rich], `bug_repellent_station`[rich], `wedding_day_weather_forecaster`[rich]
- ⭐ **equipment/rental type** (per leaf): tent_styles · power_output_kva · unit_types · cooling_capacity · lighting_styles …

**Fireworks** — `fireworks_pyro`[stub]
**LED Wall** — `led_video_wall`[stub]
**Digital Services** `[SN]` — `setnayan_custom_monogram`[rich], `setnayan_pailaw`[rich], `setnayan_pakanta`[rich]
- ⭐ **design_styles** (monogram): classic_serif / modern_sans / script_calligraphy / themed / filipiniana_inspired

## 5) PROGRAM
**Live Band** — `live_band`[rich], `band_live_music`[rich]
- ⭐ **genres**: opm / pop / jazz / standards / acoustic / rock / classical / kundiman / folk_pinoy / contemporary_christian / broadway / rnb_soul
- also: **ensemble_size** · ceremony_ready / reception_ready · **religious_repertoire_available**

**Choir** — `choir_string_quartet`[rich]
- ⭐ **ensemble_type**: choir_small_8_to_15 / choir_large_15plus / string_quartet / string_trio / chamber_ensemble · also: service_categories (catholic_mass/christian_worship/civil/...)

**Orchestra** — `orchestra`[stub]
**Wedding Singer** — `wedding_singer`[rich]
- ⭐ **repertoire_genres**: opm / ballads / pop / jazz / classical / religious_liturgical / broadway / rnb · also: voice_type · ceremony_song_specialty

**DJ** — `dj`[rich]
- ⭐ **music_genres**: pop / dance_edm / hip_hop / opm / classic_rock / latin / reggae / world / throwback_80s_90s / kpop · also: takes_requests · mc_skills

**Choreographer** — `entourage_choreographer`[rich], `first_dance_choreographer`[rich], `pre_cana_dance_trainer`[rich]
- ⭐ **dance_styles**: traditional_filipino / ballroom / contemporary / latin_salsa / kpop / broadway / hip_hop

**Performers** — `acoustic_performer`[rich], `wedding_entertainment`[rich], `kulintang_ensemble`[rich], `rondalla_ensemble`[rich], `folk_performer`[rich]
- ⭐ **entertainment/ensemble type**: (wedding_entertainment) magician/fire_dancer/mentalist/juggler/comedy/illusionist… · (acoustic) configuration+genres · (kulintang/rondalla/folk) ensemble + ethnic_specialization

**Host / MC** — `host_emcee`[rich]
- ⭐ **languages_offered**: english / tagalog / cebuano / taglish / ilocano / kapampangan / hiligaynon / bisaya
- also: style_archetypes · format_experience · audience_sizes_handled · religious_service_comfort

## 6) DOCUMENTARY
**Photo & Video** — `photography`[rich], `videography`[rich], `pre_nup_photographer`[rich], `engagement_photographer`[rich], `drone`[rich], `drone_videographer`[rich], `same_day_edit`[rich], `family_day2_photographer`[rich], `boudoir_photographer`[rich], `studio_portrait_photographer`[rich], `highlight_reel_specialist`[rich] · `setnayan_papic`[SN], `setnayan_ai_edited_highlight`[SN], `setnayan_save_the_date_mp4`[SN]
- ⭐ **edit_aesthetics**: moody / bright_airy / fine_art / documentary / editorial / film_emulation / bw_heavy / warm_toned / cool_toned
- also: **shooting_styles** (photojournalistic/posed/cinematic/candid/fashion) · **deliverables** · response_time_sla

**Editorial** — (real-wedding feature; no canonical) — N/A for vendor filtering
**Livestream** — `setnayan_panood`[SN]
- ⭐ **stream_quality**: 1080p_standard / 1080p_premium / 4k · also: camera_count · duration_hours_max · platforms_supported

## 7) LOOK
**Bride's Attire** — `bridal_gown_custom`[rich], `bridal_gown_rental`[rich], filipiniana: `filipiniana_terno`[rich], `_maria_clara`[rich], `_balintawak`[rich], modest: `muslim_modest_bridal`[rich], `inc_modest_bridal`[rich], cultural: `maranao`/`tausug`/`yakan_wedding_attire`[rich]
- ⭐ **silhouettes_offered**: a_line / ball_gown / mermaid / trumpet / sheath / tea_length / fit_and_flare / empire
- also: **service_model** (made_to_measure/ready_to_wear/couture/rental) · fabric_specialties (incl. pina/jusi) · necklines
- leaf specials: filipiniana ⭐ design_styles + fabric (pina/jusi/embroidery) · muslim_modest ⭐ hijab_styling · cultural ⭐ textile authenticity

**Groom's Attire** — `groom_suit_custom`[rich], `groom_suit_rental`[rich], `barong_tagalog_custom`[rich], `barong_tagalog_rental`[rich]
- ⭐ **suit/barong styles**: (suit) classic_two_piece/slim/tuxedo/three_piece/destination_linen · (barong) formal_white/colored/embroidered_heritage/minimalist/polo_barong
- also: fabric_options (jusi/silk/pina) · embroidery_traditions

**Women's Attire** — `bridesmaid_dress`[rich], `junior_bridesmaid_dress`[rich], `mother_of_bride_gown`[rich], `flower_girl_dress`[rich], `ninang_attire`[rich]
- ⭐ **dress_styles** (per role) + color coordination

**Men's Attire** — `groomsman_set`[rich], `junior_groomsman`[rich], `ninong_attire`[rich], `ring_bearer_suit`[rich]
- ⭐ **match_style / dress_styles** + color coordination

**Filipiniana & Barongs** (cross-view of the attire terno/barong leaves)
- ⭐ **fabric / design**: pina / jusi / embroidery tradition (calado, modern couture, regional)

**HMUA** — `bridal_hmua`[rich], `family_mua`[rich], `bridal_hair_stylist`[rich], `touchup_mua`[rich], `maternity_bride_mua`[rich], `mature_bride_mua`[rich]
- ⭐ **makeup_styles**: natural_nofilter / classic_timeless / glamour_dramatic / editorial_fashion / ethereal_soft
- also: **skin_tone_specialization** · trial_session_included

**Grooming** — `groom_grooming`[rich]
- ⭐ **services_available**: haircut_style / beard_grooming / skincare_facial / manicure_pedicure / body_treatments

**Wellness & Fitness** — `bridal_fitness`[rich], `bridal_nutritionist`[rich], `bridal_dental`[rich], `bridal_spa`[rich], `bridal_dermatology`[rich]
- ⭐ **treatment/program type** (per leaf): fitness_styles · program_styles · treatments_available · treatment_types

**Jewelleries & Accessories** — `engagement_ring`[rich], `wedding_ring`[rich], `bridal_jewellery`[rich], `bridal_jewellery_rental`[rich], `floral_jewellery`[rich], `wedding_veil`[rich], `wedding_garter`[rich], `bridal_headpiece`[rich], `flower_girl_tiara`[rich], `sponsor_corsage`[rich]
- ⭐ **item + metal/style** (per leaf): metal_options (rings) · jewelry_types · veil_lengths · headpiece_styles …

## 8) BOOTHS
**Mobile Bar** — `mobile_bar`[rich], `whiskey_cigar_bar`[rich]
- ⭐ **bar_types**: full_cocktail / beer_wine_only / mocktail_only / coffee_focused / whiskey_cigar / specialty_themed · also: faith_compatibility

**Coffee / Espresso** — `coffee_booth`[rich], `tea_bar`[rich]
- ⭐ **drink focus**: (coffee) coffee_bean_origin + milk_options · (tea) tea_categories

**Mocktail** — `mocktail_bar`[rich], `mocktail_only_caterer`[rich], `mocktail_booth_mini`[rich]
- ⭐ **drink_categories** (fruit/herbal/sparkling/tea/coffee/dessert/savory/tropical) · also: **inc_compliance** · muslim_friendly

**Food Truck** — `food_truck`[rich]
- ⭐ **cuisine_type**: burgers / pizza / tacos / asian_fusion / filipino_street_food / ice_cream / coffee / vegan / breakfast / grilled_skewers

**Dessert** — `dessert_station`[rich]
- ⭐ **dessert_types**: pastries / macarons / cupcakes / chocolate_fountain / candy_buffet / donut_wall / churros / kakanin / ice_cream / sorbet

**Massage Chair** — `massage_chair_station`[stub], `hair_touchup_station`[stub], `aromatherapy_station`[stub]
**Food Cart** — `halo_halo_station`[rich], `ice_cream_cart`[rich], `crepe_pancake_station`[rich], `cotton_candy_cart`[rich], `charcuterie_board`[rich], `mini_lechon_station`[rich], `donut_wall_display`[stub], `sorbetes_cart`[stub], `food_cart_generic`[stub]
- ⭐ **cart type** (the leaf itself is the choice) + per-leaf style facet

**Photo Booth** — `photo_booth`[rich], `gif_booth`[stub], `polaroid_booth`[stub], `booth_360`[stub], `selfie_magic_mirror`[stub] · `setnayan_patiktok`[SN/stub]
- ⭐ **booth_types**: traditional / 360_booth / gif / polaroid_instax / selfie_magic_mirror / patiktok · also: output_options · footprint_size

**Perfume Bar** — `perfume_bar`[stub]
**Arcade / Games** — `arcade_retro_games`[stub], `vr_ar_station`[stub]
**Henna / Tattoo** — `muslim_henna_artist`[rich], `henna_tattoo_booth`[stub]
- ⭐ **henna_styles**: traditional_arabic / modern_minimalist / elaborate_bridal / philippine_muslim_distinct
**Mini Nail Bar** — `mini_nail_bar`[stub]
**Tarot / Astrology / Palmistry** — `tarot_astrology`[stub], `palmistry_reader`[stub]
**Caricature / Calligraphy / Painting** — `wedding_portrait_painter`, `caricature_artist`, `silhouette_artist`, `live_calligraphy`, `poetry_typewriter` [all stub]
**Engraving / Embroidery** — `keychain_engraving`[stub], `live_embroidery`[stub]

## 9) PRINTS
**Printing** — `invitation_print`[rich], `invitation_digital`[rich], `wedding_cards_designer`[rich], `save_the_date_digital`[rich], `ceremony_program`[rich], `place_card`[rich], `menu_card`[rich], `stationery_signage`[rich]
- ⭐ **print item** (invitation / save-the-date / program / place-card / menu / signage) + **print_finishes** (matte/glossy/foil/embossed/letterpress/uv)

**Souvenir / Giveaways** — `souvenirs_giveaways`[rich], `pasalubong_box`[rich], `sponsor_token`[rich], `godchild_token`[rich]
- ⭐ **souvenir_types**: edible / practical_keychain / decorative_figurine / native_filipino / candle_diy / succulent_living

## 10) TRANSPORT
**Bridal Car** — `transportation_bridal_car`[rich], `vintage_classic_vehicle`[rich], `horse_drawn_carriage`[rich], `bridal_boat_yacht`[rich]
- ⭐ **vehicle_types_available**: luxury_sedan / limousine / vintage_classic / suv / van_minivan / bus_coaster / carriage_horsedrawn / motorcycle_escort

**Guest Shuttle** — `transportation_guest_shuttle`[rich]
- ⭐ **capacity_per_vehicle**: 12_pax_van / 24_pax_minibus / 48_pax_bus / 56_pax_coaster

**Escort** — `motorcycle_escort`[rich]
- ⭐ **formation_style**: parade / escort / police_style / ceremonial_diamond

---

# PART 4 — The 26 stub leaves that need refinements designed (PROPOSED — Cowork to ratify into 0044)

These have a display name + inherited shared groups but **empty** `category_specific_attributes`. Proposed primary facets (consistent with the shipped pattern), to complete coverage:

| Leaf | Tile | ⭐ Proposed primary facet (options) |
|---|---|---|
| `led_dance_floor` | Dance Floor | **floor_type**: led_interactive / classic_parquet / marble / mirror / custom_monogram |
| `fireworks_pyro` | Fireworks | **display_type**: cold_pyro_indoor / aerial_outdoor / sparkler_fountain / confetti_cannon |
| `led_video_wall` | LED Wall | **wall_use**: backdrop / monogram_panel / live_feed / ambient_animation |
| `orchestra` | Orchestra | **ensemble_size**: chamber_10_to_20 / full_orchestra_20plus; + repertoire_genres |
| `massage_chair_station` | Massage Chair | **service_type**: massage_chair / aromatherapy / hair_touchup |
| `aromatherapy_station` | Massage Chair | **scent_program**: relaxation / energizing / custom_couple_scent |
| `hair_touchup_station` | Massage Chair | **service**: touch_up / restyle / express |
| `perfume_bar` | Perfume Bar | **format**: custom_blend / branded_sampler / couple_signature_scent |
| `arcade_retro_games` | Arcade/Games | **game_type**: retro_arcade / console / claw_machine |
| `vr_ar_station` | Arcade/Games | **experience_type**: vr_immersive / ar_overlay / 360_video |
| `henna_tattoo_booth` | Henna/Tattoo | **style**: traditional / modern_minimalist / elaborate (mirror `muslim_henna_artist`) |
| `mini_nail_bar` | Mini Nail Bar | **service**: manicure / pedicure / nail_art / express_polish |
| `tarot_astrology` | Tarot/… | **reading_type**: tarot / astrology / numerology |
| `palmistry_reader` | Tarot/… | **reading_type**: palmistry / face_reading |
| `wedding_portrait_painter` | Caricature/… | **medium**: watercolor / oil / digital / live_portrait |
| `caricature_artist` | Caricature/… | **style**: classic / exaggerated / digital |
| `silhouette_artist` | Caricature/… | **format**: paper_cut / digital |
| `live_calligraphy` | Caricature/… | **application**: place_cards / vows / signage / gifts |
| `poetry_typewriter` | Caricature/… | **format**: vintage_typewriter / digital |
| `keychain_engraving` | Engraving/… | **material**: metal / acrylic / wood / leather |
| `live_embroidery` | Engraving/… | **application**: garments / handkerchiefs / patches |
| `gif_booth` | Photo Booth | **output**: gif / boomerang / slow_mo (mirror `photo_booth.booth_types`) |
| `polaroid_booth` | Photo Booth | **output**: instant_print / film_polaroid |
| `booth_360` | Photo Booth | **output**: 360_video / slow_mo_360 |
| `selfie_magic_mirror` | Photo Booth | **output**: mirror_print / touch_interactive |
| `setnayan_patiktok` | Photo Booth | **format**: tiktok_template / trend_reel (Setnayan first-party) |
| `donut_wall_display` / `sorbetes_cart` / `food_cart_generic` | Food Cart | **cart style** (mirror the rich food-cart leaves) |

> Cleanest path: most stubs can **inherit a sibling's schema** (e.g. all photo-booth stubs adopt `photo_booth.booth_types`; food-cart stubs adopt the food-cart pattern). Only Dance Floor / Fireworks / LED Wall / Orchestra need genuinely new facet sets.

---

# PART 5 — Open items for Cowork

1. **Venue refinements live outside 0044.** Reception/Ceremony filter on `venue_directory`, and there are **4 un-reconciled venue vocabularies** (`venue_setting` 7 · `venue_directory.venue_type` 12 · 0044 `reception_venue.venue_types` 10 · `ceremony_settings` 9). Ratify ONE reception vocab + ONE ceremony vocab before wiring venue refinements into onboarding. (See `Vendor_Match_Personalization_2026-06-01.md` + the 0043/0044 reconciliation note.)
2. **Ratify the 26 stub refinements** (Part 4) into 0044 — mostly sibling-inheritance, low effort.
3. **Adopt the Layer-0/1/2/3 onboarding model** (Part 1) — confirm "one primary facet per selected tile" as the onboarding rule; the primary facets are named per tile in Part 3.
4. **Drift to note:** the master taxonomy doc still describes the old 12-folder/192 structure; this reference reflects the shipped 10-parent/53-tile/195-leaf model.

*— End of reference. Generated from `apps/web/lib/taxonomy.ts` + 0044 migrations on 2026-06-04.*
