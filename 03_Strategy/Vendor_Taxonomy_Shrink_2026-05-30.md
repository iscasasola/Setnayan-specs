# Vendor Taxonomy — Shrink to 10 Parents (Wedding) · Design Lock 2026-05-30

**Status.** Design-locked 2026-05-30 with the owner. **SHIPPED to production 2026-05-31** via PR [#689](https://github.com/iscasasola/setnayan-platform/pull/689) — owner override of the post-pilot lock ("Ship it now"). Supersedes the *visible* structure in [02_Specifications/Vendor_Taxonomy_V1_Master.md](../02_Specifications/Vendor_Taxonomy_V1_Master.md) (12 folders / ~196 canonicals) with the shrunk **10-parent / ~53-tile** wedding taxonomy. **Code-only, no migration** — all 196 canonicals preserved (canonical key-set diff: zero removed → no orphaned vendors), 3 new canonicals added (`orchestra` · `fireworks_pyro` · `led_video_wall`), 20 officiant/paperwork canonicals set `marketplaceHidden`. **Deferred follow-ups** (not correctness blockers, every canonical stays mapped): the DB-side cleanup in §6 (retire hidden rows · vendor re-tag · facet attributes) + the Master-doc rewrite. See CLAUDE.md decision log 2026-05-31.

> **⚠️ AMENDMENT 2026-06-03 — Setnayan in-app services re-mapped + new `DESIGN › Digital Services` tile.** Owner re-placed the first-party services: a NEW **`Design › Digital Services`** tile (Design's 8th) now hosts **Pakanta · Animated Monogram · Pro Website · Live Venue Photo Wall · Live Background (Pailaw)** — pulling Pakanta out of Program, Monogram out of Stylist/Decorator, Pailaw out of LED Wall, and adding Pro Website + Live Venue Photo Wall to the marketplace for the first time. **`Booths › Photo Booth`** now also hosts **Patiktok** (folded from its own former Booths entry) **+ Pabati** (new). Documentary is unchanged (Papic → Photo & Video · Panood → Livestream · Editorial → Editorial); **Guest Stories · SDE · Thank You Video are Papic add-ons**, not tiles. §2, §3 and §6 below carry the amended placements inline. **Code not yet shipped** — the `apps/web/lib/taxonomy.ts` re-grouping is a separate follow-up PR. See the 2026-06-03 decision-log row.

**Scope — wedding only.** V1 is weddings-only (other event types stay "Coming soon"). When Birthday / Christening / Debut etc. activate later, each gets its own tile set; the shared parents (Food · Photo & Video · Booths · Program · Design · Transport · Planning) reuse, the wedding-only ones (Venue › Ceremony, bridal LOOK) don't apply.

---

## 1. The shrink principle

**A tile exists only for a real shopping decision.** Everything else — religion, cultural tradition, rental, dietary, shoot-type, cart-type, booth-type, accessories, outdoor-equipment-type — lives as a **filter or facet** underneath, never its own tile. Three levers did almost all the collapse:

1. **Merge the splits** — gown custom/rental + 3 Filipiniana + 3 Muslim-cultural → one "Bridal Gown / Filipiniana" tile; rental + tradition are facets.
2. **Faith → filter** — INC / Muslim / Christian coordinators, halal caterers, modest gowns collapse into the religion filter (`vendor_profiles.compatible_ceremony_types[]`, already shipped). Dietary (halal / alcohol-free) is a *separate* attribute the couple's faith pre-sets.
3. **Officiants + paperwork leave the marketplace** — Ceremony becomes a *venue*; the officiant auto-resolves from it (already shipped — Card 04, 2026-05-29); seminars / license / CENOMAR live in the Setnayan AI wizard as tasks.

Result: ~196 canonicals → ~55 visible tiles (Setnayan services absorbed as options under their parent category, not a separate ★ tier), faith preserved as a filter, nothing critical lost.

---

## 2. The locked structure (10 parents)

★ = Setnayan first-party service.

| Parent | Tiles |
|---|---|
| **VENUE** | Reception · Ceremony |
| **PLANNING** | Coordinator / Planner |
| **FEAST** | Cake · Catering · Stations |
| **DESIGN** | Stylist / Decorator · Florist · Lights & Sound · Dance Floor · Outdoor · Fireworks · LED Wall · Digital Services |
| **PROGRAM** | Live Band · Choir · Orchestra · Wedding Singer · DJ · Choreographer · Performers · Host / MC |
| **DOCUMENTARY** | Photo & Video · Editorial · Livestream |
| **LOOK** | Bride's Attire · Groom's Attire · Women's Attire · Men's Attire · Filipiniana & Barongs · HMUA · Grooming · Wellness & Fitness · Jewelleries & Accessories |
| **BOOTHS** | Mobile Bar · Coffee / Espresso · Mocktail · Food Truck · Dessert · Massage Chair · Food Cart · Photo Booth · Perfume Bar · Arcade / Games · Henna / Tattoo · Mini Nail Bar · Tarot / Astrology / Palmistry · Caricature / Calligraphy / Painting · Engraving / Embroidery |
| **PRINTS** | Printing · Souvenir / Giveaways |
| **TRANSPORT** | Bridal Car · Guest Shuttle · Escort |

**Parent order (locked 2026-05-31):** 1 Venue → 2 Planning → 3 Feast → 4 Design → 5 Program → 6 Documentary → 7 Look → 8 Booths → 9 Prints → 10 Transport. This is the marketplace browse / folder-tab order — the wedding's build sequence (the place → who runs it → what's served → how it looks → the show → capturing it → how you look → the extras → the paper → getting there). **Browse order ≠ booking urgency:** Photo & Video (Documentary, #6) should still be booked *early* via the Setnayan AI wizard deadlines — top photo/video books 12+ months out — even though it sits 6th in the browse.

**~49 tiles across 10 parents** (down from ~196; `Digital Services` added to DESIGN 2026-06-03). BOOTHS is the heaviest (15); LOOK is 9 (attire + beauty + adornment); DESIGN is now 8.

**Setnayan services live under their parent category** — *not* a separate ★ tier (owner directive 2026-05-30 "Setnayan services can live under the categories"; **placements amended 2026-06-03** — see the amendment banner up top): Concierge → Planning · **Pakanta + Animated Monogram + Pro Website + Live Venue Photo Wall + Live Background (Pailaw) → Design › Digital Services** (new tile) · **Patiktok + Pabati → Booths › Photo Booth** · Papic (with **Guest Stories · SDE · Thank You Video** as add-ons) → Documentary › Photo & Video · Panood → Documentary › Livestream · the Setnayan editorial service → Documentary › Editorial. **No visible tile carries a "Setnayan" label** — the services sit inside the generic category tiles.

**DOCUMENTARY = Photo & Video · Editorial · Livestream** (3 tiles). **Photo & Video** is one tile — photographer / videographer / drone / SDE / pre-nup are facets inside it (photographer-only vs both = a filter); documentation *outputs* (albums · photo books · highlight reels · save-the-date videos) are vendor package inclusions, **not tiles** — most photo/video vendors already bundle them. **Editorial** = the published real-wedding feature (Setnayan's editorial + any third-party feature as options). **Livestream** = event broadcast coverage (Panood is the Setnayan option). Newspaper / print announcement — **removed** (owner call 2026-05-30; fading tradition, not worth a tile).

**Feast › Stations vs Booths › Food Cart** — Stations = chef-attended live stations *within* the catering spread (carving, pasta, sushi). Booths/Carts = standalone hired experiences (coffee cart, sorbetes, donut wall). Keep the line at "part of the catering" vs "separate hired vendor."

**Design › Digital Services (added 2026-06-03)** — the home for Setnayan's digital / AI-generated productions: **Pakanta** (custom song) · **Animated Monogram** · **Pro Website** · **Live Venue Photo Wall** · **Live Background / Pailaw**. It reads as a generic tile — a future 3rd-party monogram designer, wedding-website builder, or LED-content studio could populate it too — so it does *not* reintroduce a "Setnayan-branded" tier; at launch its membership is simply all first-party. This pulls Pakanta out of Program, Animated Monogram out of Stylist / Decorator, and Live Background out of LED Wall (**LED Wall now = 3rd-party LED video walls only**). ⚠️ Discoverability trade-off (owner-acknowledged): a couple browsing the **Program** music shelf will no longer find Pakanta there.

**Booths › Photo Booth — Patiktok + Pabati live here (added 2026-06-03)** — **Patiktok** (vertical TikTok-format clip booth) folds in from its own former Booths entry, and **Pabati** (short video-greeting product) enters the marketplace for the first time, both as options under the Photo Booth tile.

---

## 3. Before → after map (every current canonical → destination)

Source: production `TAXONOMY_MAP` in `apps/web/lib/taxonomy.ts` (196 entries).

### Current folder 1 — Ceremony (17) → leaves the marketplace
| Current canonical | Destination |
|---|---|
| catholic_priest · civil_judge · civil_mayor · civil_justice_of_peace · inc_minister · born_again_pastor · charismatic_pastor · mainline_protestant_pastor · muslim_imam · cultural_tribal_elder · officiant_priest_minister | **VENUE › Ceremony** — officiant auto-resolves from the venue; "use a different officiant" override stays. **Retire as categories.** |
| pre_cana_seminar · inc_counseling · muslim_pre_wedding_counseling | Comes with the venue / wizard reminder. **Retire as categories.** |
| cfo_seminar · marriage_license_expediting · apostille_dfa_authentication | **Setnayan AI wizard** host-tasks. **Retire as categories.** |

### Current folder 2 — Reception (0) → unchanged
VENUE › Reception, filter-only via `venue_setting`. V1.2 adds bookable venue records.

### Current folder 3 — Planning / Logistics / Travel (29)
| Current canonical | Destination |
|---|---|
| wedding_coordination | **PLANNING › Coordinator / Planner** (tile) |
| day_of_coordinator · wedding_planner_partial · destination_wedding_specialist | facet: service-type under Coordinator |
| pamamanhikan_coordinator · despedida_planner · sponsor_coordinator | facet: PH service-type under Coordinator |
| gender_separated_reception_coordinator · religious_venue_coordinator · inc_wedding_coordinator · mahr_coordination | **filter: religion / capability** under Coordinator |
| setnayan_concierge ★ | **PLANNING › Concierge ★** (tile) |
| transportation_bridal_car | **TRANSPORT › Bridal Car** (tile) |
| transportation_guest_shuttle | **TRANSPORT › Guest Shuttle** (tile) |
| motorcycle_escort | **TRANSPORT › Escort** (tile) |
| vintage_classic_vehicle · horse_drawn_carriage · bridal_boat_yacht | facet: vehicle-type (specialty) under Bridal Car |
| generator_rental · tent_rental · mobile_restroom_rental · cooling_fans_misters · parasol_hat_rental · bug_repellent_station · wedding_day_weather_forecaster | **DESIGN › Outdoor** (facets under the Outdoor tile) |
| honeymoon_planner | Setnayan AI wizard — honeymoon-planning host-task (NOT a marketplace tile; Honeymoon tile dropped 2026-05-31) |
| destination_wedding_travel_coordinator · visa_wedding_logistics | deferred V1.5+ (niche) |
| accommodation | **VENUE › Reception** (hotels are reception venues; keep catering cross-list as a filter) |

### Current folder 4 — Photo & Video (15) → DOCUMENTARY
| Current canonical | Destination |
|---|---|
| photography · videography | **DOCUMENTARY › Photo & Video** (one tile) |
| engagement_photographer · family_day2_photographer · boudoir_photographer · studio_portrait_photographer · pre_nup_photographer | facet: shoot-type under Photo & Video (photographer-only / videographer-only / both · engagement · pre-nup) |
| drone · drone_videographer | facet: aerial under Photo & Video |
| same_day_edit · highlight_reel_specialist | facet: deliverable under Photo & Video — albums · books · SDE · highlights · save-the-dates are vendor package inclusions, not tiles |
| pre_nup_shoot_locations | facet: location (V1.2) |
| setnayan_papic · setnayan_ai_edited_highlight · setnayan_save_the_date_mp4 | Setnayan options under Photo & Video (not separate tiles) |
| setnayan_panood (0011) | Setnayan option under **DOCUMENTARY › Livestream** (its own tile; moved from Program) |
| *(0046 Wedding Showcase / editorial)* | **DOCUMENTARY › Editorial** — the published real-wedding feature (Setnayan's editorial + third-party features as options) |

### Current folder 5 — Catering (23)
| Current canonical | Destination |
|---|---|
| catering | **Feast › Catering** (plated / buffet = facet) |
| halal_catering | **filter: dietary (halal)** under Catering |
| lechonero | facet under Catering |
| live_cooking_station | **Feast › Stations** (tile) |
| wedding_cake | **Feast › Cake** (tile) |
| dessert_station | **BOOTHS › Dessert** |
| food_truck | **BOOTHS › Food Truck** |
| mobile_bar | **BOOTHS › Mobile Bar** |
| coffee_booth | **BOOTHS › Coffee / Espresso** |
| mocktail_bar · mocktail_only_caterer · mocktail_booth_mini | **BOOTHS › Mocktail** (consolidate 3 → 1; dietary filter) |
| tea_bar · whiskey_cigar_bar | facet: bar-type under Mobile Bar / Coffee |
| halo_halo_station · mini_lechon_station · sorbetes_cart · ice_cream_cart · crepe_pancake_station · cotton_candy_cart · charcuterie_board · donut_wall_display · food_cart_generic | **BOOTHS › Food Cart** (facet: cart-type) |

### Current folder 6 — Attire (23)
| Current canonical | Destination |
|---|---|
| bridal_gown_custom · bridal_gown_rental · filipiniana_terno/maria_clara/balintawak · muslim_modest_bridal · inc_modest_bridal · maranao/tausug/yakan_wedding_attire | **LOOK › Bride's Attire** — Filipiniana + cultural = tradition facet (keep prominent) · religion = filter · rental = facet |
| groom_suit_custom · groom_suit_rental · barong_tagalog_custom · barong_tagalog_rental | **LOOK › Groom's Attire** — barong = facet (keep prominent) · rental = facet |
| bridesmaid_dress · junior_bridesmaid_dress · mother_of_bride_gown · ninang_attire · flower_girl_dress | **LOOK › Women's Attire** — role = facet (bridesmaid / mother / ninang / flower girl) · bespoke vs rental = facet |
| groomsman_set · junior_groomsman · ninong_attire · ring_bearer_suit (+ father role) | **LOOK › Men's Attire** — role = facet (groomsman / ninong / father / ring bearer) · bespoke vs rental = facet |

**LOOK › Filipiniana & Barongs** is a **cross-tile view, not a separate bucket.** The same terno/barong vendors tagged under Bride's / Groom's / Women's / Men's Attire surface here via the `tradition = Filipiniana / Barong` facet. One vendor, categorized once, two discovery paths (their role tile + the Filipiniana view) — no duplicate data.

### Current folder 7 — Hair & Makeup (13)
| Current canonical | Destination |
|---|---|
| bridal_hmua · bridal_hair_stylist · family_mua · touchup_mua · maternity_bride_mua · mature_bride_mua | **LOOK › HMUA** — hair / family / touch-up / maternity / mature = facets |
| groom_grooming | **LOOK › Grooming** |
| bridal_fitness · bridal_nutritionist · bridal_dental · bridal_spa · bridal_dermatology | **LOOK › Wellness & Fitness** — fitness / nutritionist / dental / spa / derm = facets |
| muslim_henna_artist | **BOOTHS › Henna / Tattoo** (cultural style = filter) |

### Current folder 8 — Music & Program (16)
| Current canonical | Destination |
|---|---|
| live_band · band_live_music | **PROGRAM › Live Band** (consolidate — duplicate; one retires) |
| choir_string_quartet | **PROGRAM › Choir** (string quartet = facet) |
| *(none)* | **PROGRAM › Orchestra** — **NEW canonical needed** |
| wedding_singer | **PROGRAM › Wedding Singer** |
| dj | **PROGRAM › DJ** |
| entourage_choreographer · first_dance_choreographer · pre_cana_dance_trainer | **PROGRAM › Choreographer** (consolidate 3 → 1; type = facet) |
| acoustic_performer · wedding_entertainment · kulintang_ensemble · rondalla_ensemble · folk_performer | **PROGRAM › Performers** (consolidate; cultural = filter) |
| host_emcee | **PROGRAM › Host / Emcee** |
| setnayan_pakanta ★ | **DESIGN › Digital Services** (amended 2026-06-03 · moved from Program) |
| setnayan_panood ★ | **DOCUMENTARY › Livestream** (corrected 2026-06-03 · the §2 prose + the folder-4 Photo&Video map already placed it here) |

### Current folder 9 — Decor / Florals / Sound (14)
| Current canonical | Destination |
|---|---|
| stylist_decorator · decorator_general | **DESIGN › Stylist / Decorator** (consolidate) |
| capiz_native_decor · hacienda_heritage_decor · maranao_okir_decor | facet: tradition/style under Stylist / Decorator (maranao = religion filter) |
| florals · garden_wedding_florist · beach_wedding_florist | **DESIGN › Florist** (style = facet) |
| lights_sound | **DESIGN › Lights & Sound** |
| outdoor_sound_system · outdoor_lighting_specialist | **DESIGN › Outdoor** (or facet under Lights & Sound) |
| led_dance_floor | **DESIGN › Dance Floor** |
| *(NEW canonical)* | **DESIGN › Fireworks** — cold sparklers · pyro · special effects |
| *(NEW canonical)* | **DESIGN › LED Wall** — third-party LED video walls |
| setnayan_pailaw ★ | Setnayan option under **DESIGN › Digital Services** (amended 2026-06-03 · moved from LED Wall) |
| setnayan_custom_monogram ★ | Setnayan option under **DESIGN › Digital Services** (amended 2026-06-03 · moved from Stylist / Decorator) |

### Current folder 10 — Rings & Accessories (11) → now under LOOK
| Current canonical | Destination |
|---|---|
| engagement_ring · wedding_ring | **LOOK › Jewelleries & Accessories** (engagement = facet) |
| bridal_jewellery · bridal_jewellery_rental · floral_jewellery | **LOOK › Jewelleries & Accessories** (rental / floral = facet) |
| wedding_veil · wedding_garter · bridal_headpiece · flower_girl_tiara · sponsor_corsage | facet: accessories under **LOOK › Jewelleries & Accessories** |
| bridal_bouquet_specialty | facet under DESIGN › Florist |

### Current folder 11 — Booths & Stations (16)
| Current canonical | Destination |
|---|---|
| photo_booth | **BOOTHS › Photo Booth** |
| gif_booth · polaroid_booth · booth_360 · selfie_magic_mirror | facet: booth-type under Photo Booth |
| vr_ar_station · arcade_retro_games | **BOOTHS › Arcade / Games** |
| perfume_bar | **BOOTHS › Perfume Bar** |
| henna_tattoo_booth | **BOOTHS › Henna / Tattoo** |
| massage_chair_station | **BOOTHS › Massage Chair** |
| mini_nail_bar | **BOOTHS › Mini Nail Bar** |
| hair_touchup_station · aromatherapy_station | facet: wellness under Massage Chair / Mini Nail Bar |
| tarot_astrology · palmistry_reader | **BOOTHS › Tarot / Astrology / Palmistry** |
| setnayan_patiktok ★ | **BOOTHS › Photo Booth** (amended 2026-06-03 · folded under Photo Booth · joined by Pabati) |

### Current folder 12 — Invitations & Keepsakes (19)
| Current canonical | Destination |
|---|---|
| invitation_print · invitation_digital · wedding_cards_designer · save_the_date_digital · ceremony_program · place_card · menu_card · stationery_signage | **PRINTS › Printing** (facet: print-item) |
| souvenirs_giveaways | **PRINTS › Souvenir / Giveaways** |
| pasalubong_box · sponsor_token · godchild_token | facet: PH keepsake under Souvenir / Giveaways |
| wedding_portrait_painter · caricature_artist · silhouette_artist · live_calligraphy · poetry_typewriter | **BOOTHS › Caricature / Calligraphy / Painting** |
| keychain_engraving · live_embroidery | **BOOTHS › Engraving / Embroidery** |

---

## 4. Filter & facet dimensions

These replace the ~136 retired/merged categories. None is a tile.

| Dimension | Mechanism | Drives |
|---|---|---|
| **Religion** | `vendor_profiles.compatible_ceremony_types[]` (shipped) | Per-category religion filter (INC / Muslim / Christian coordinators, modest attire, etc.). Couple's `events.ceremony_type` auto-filters; "show all faiths" toggle. |
| **Dietary** | New caterer/bar attribute (halal-certified · alcohol-free) | Pre-set by the couple's faith, but anyone can toggle (non-Muslim hosting Muslim guests). |
| **Rental** | Attribute on attire / jewellery / vehicle vendors | Custom vs rental. |
| **Tradition** | Attribute on attire / decor vendors | Filipiniana variants · Maranao / Tausug / Yakan · Capiz · Hacienda · Okir. |
| **Shoot-type** | Attribute on photographers | Engagement · family-day-2 · boudoir · studio portrait. |
| **Cart / booth-type** | Attribute on booth vendors | Sorbetes · halo-halo · donut wall · GIF · polaroid · 360 · etc. |
| **Service-type** | Attribute on coordinators / MUA | Full / partial / day-of / month-of · pamamanhikan · despedida · mahr · touch-up · maternity. |
| **Accessories** | Facet under Bridal Jewellery | Garter · headpiece · corsage · tiara. |

---

## 5. What leaves the marketplace

- **Officiants** (11) — come *with* the ceremony venue (auto-resolve, shipped Card 04). Override path preserved.
- **Pre-marriage paperwork** — religious seminars (Pre-Cana, INC/Muslim counseling) ride with the venue; civil docs (marriage license, CFO, apostille/DFA) → Setnayan AI wizard host-tasks.

---

## 6. Engineering impact — code SHIPPED 2026-05-31 · DB-side deferred

**Shipped to production** (PR #689, owner override) — the code-only re-grouping:

- ✅ `apps/web/lib/taxonomy.ts` — rewritten to the 10 parents; facet model encoded as `TaxonomyEntry` attributes; **+3 new canonicals** (`orchestra`, `fireworks_pyro`, `led_video_wall`); 20 officiant/paperwork canonicals set `marketplaceHidden: true` (no orphaned vendors).
- ✅ Marketplace UI (`/vendors`) + supporting components (`category-tile`, `icon-tile-folder-strip`, `wedding-plan-groups`, `vendor-counts`, `marketplace-tease-strip`, `add-a-category-card`) — folder tabs render the 10 parents in the locked order.

**Deferred follow-ups** (not correctness blockers — every canonical stays mapped, so vendors keep their tags and nothing breaks):

- ⏳ `canonical_service_schemas` — actually retire the 20 hidden officiant/paperwork rows from the DB; merge faith/cultural/rental variants into facets; resolve the `live_band` / `band_live_music` duplicate at the DB.
- ⏳ `0044` per-category schemas — the facets become schema attributes (shoot-type, cart-type, tradition, dietary, rental, accessories).
- ⏳ `0045` product catalogs · `0006` vendor onboarding — vendors re-tag against the new structure.
- ⏳ Setnayan AI wizard cards + SEO surfaces — reference canonicals; reconcile.
- ⏳ `02_Specifications/Vendor_Taxonomy_V1_Master.md` — rewrite to match (still the 12-folder / 196 canonical reference).
- ⏳ **(amended 2026-06-03) `DESIGN › Digital Services` re-grouping — NOT yet shipped** (this 2026-05-31 lock predates the change). `apps/web/lib/taxonomy.ts` + marketplace components: add the new Design tile · re-parent `setnayan_pakanta` / `setnayan_custom_monogram` / `setnayan_pailaw` into it · fold `setnayan_patiktok` + add a new `pabati` option under Photo Booth · surface Pro Website + Live Venue Photo Wall as Digital-Services options. See the 2026-06-03 decision-log row.

**Pilot timing — override.** The original recommendation was to land this post-pilot; the owner directed **"Ship it now"** on 2026-05-31, so the 10-parent taxonomy went live the day before the 2026-06-01 pilot. The ship was de-risked by keeping it **code-only with every canonical preserved** (a key-set diff confirmed zero drops) — a re-grouping, not a destructive migration.

---

## 7. Cleanups applied in this lock

- **TRANSPORT › Escort** — de-duped (the two "Escort" cells → one tile; motorcycle / security = facet).
- **PRINTS** — "Printing Services" + "Printing" were redundant → merged to **Printing Services** + **Souvenir / Giveaways** (2 tiles). If "Printing" meant a distinct production-vs-design service, split back.

---

## 8. Cross-references

- [02_Specifications/Vendor_Taxonomy_V1_Master.md](../02_Specifications/Vendor_Taxonomy_V1_Master.md) — the structure this supersedes (rewrite pending).
- `apps/web/lib/taxonomy.ts` — production `TAXONOMY_MAP` (before state).
- [0006_vendors_management](../0006_vendors_management/0006_vendors_management.md) — canonical_services + saturation rules.
- [0043_wedding_type_picker](../0043_wedding_type_picker/0043_wedding_type_picker.md) — ceremony_type axis driving the religion filter.
- [0044_per_category_schemas](../0044_per_category_schemas/0044_per_category_schemas.md) — where facets become attributes.
- CLAUDE.md decision log 2026-05-30 "Vendor taxonomy shrink" row.
- Card 04 officiant auto-resolve — CLAUDE.md 2026-05-29 / 2026-05-30 rows.
