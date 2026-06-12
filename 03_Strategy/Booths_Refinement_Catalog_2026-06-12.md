# Booths — Refinement Audit + Complete Catalog (Local 🇵🇭 + International 🌍)

**Date:** 2026-06-12 · **Source of truth audited:** live prod DB (`canonical_service_taxonomy`, `onboarding_refinements`, `onboarding_refinement_options`) + `apps/web/lib/taxonomy.ts` @ `origin/main` + `Vendor_Taxonomy_Shrink_2026-05-30.md`.

**Status: PROPOSAL.** §2's existing rows are live prod data; the ➕ proposed options are NOT seeded and NOT owner-locked. No prices anywhere (refinements are facets, not SKUs).

---

## §1 — Discrepancies found (live DB vs spec vs itself)

**1a. 7 of 15 Booths tiles have ZERO refinements** — the single largest refinement gap in the marketplace (next worst parent has 4 gaps). A couple tapping these tiles gets no facet question at all; vendors onboarding under them have nothing to declare:

| Tile (no refinements) | Canonicals stranded under it |
|---|---|
| `arcade_games` | arcade_retro_games · vr_ar_station |
| `caricature_calligraphy_painting` | wedding_portrait_painter · caricature_artist · silhouette_artist · live_calligraphy · poetry_typewriter |
| `engraving_embroidery` | keychain_engraving · live_embroidery |
| `massage_chair` | massage_chair_station · hair_touchup_station · aromatherapy_station |
| `mini_nail_bar` | mini_nail_bar |
| `perfume_bar` | perfume_bar |
| `tarot_astrology_palmistry` | tarot_astrology · palmistry_reader |

**1b. Donut wall lives in two homes.** Canonical `donut_wall_display` sits under tile `food_cart`, but the refinement option "Donut wall" is seeded under the `dessert` leaf. One of the two must win (recommend: **Dessert Station** — it's a display, not a roving cart — and retire the food_cart canonical's facet expectation).

**1c. `food_cart` options don't cover its own canonicals.** 9 canonicals, 7 options. Missing: donut wall (see 1b) and a "generic / other" option for `food_cart_generic`.

**1d. Pabati is missing everywhere.** The 2026-06-03 amendment (shrink doc banner + §3) places **Patiktok + Pabati under Booths › Photo Booth**. Patiktok exists (canonical + refinement option). Pabati exists in **neither** `canonical_service_taxonomy` nor the refinement options nor `taxonomy.ts` @ origin/main.

**1e. Henna refinement skips the Hindu canonical.** Tile `henna_tattoo` carries canonical `mehndi_artist` (faith: Hindu, V1.1.1 — earlier phase than the booth itself), but the options are Traditional Arabic · Modern minimalist · Elaborate bridal · Philippine Muslim. **No "Indian bridal mehndi" option** despite the canonical existing.

**1f. Cross-tile overlap options.** `mobile_bar` options include "Mocktail only" and "Coffee-focused" — both of which are *their own tiles* (`mocktail`, `coffee_espresso`). Likewise `coffee_espresso` has a "Tea bar" option duplicating canonical `tea_bar`, plus a vague "Both". Not necessarily wrong (a bar vendor can have a coffee capability) but the line needs a rule: **refinements describe the vendor's style within the tile; a capability that IS another tile routes there instead.** Recommend dropping "Mocktail only"/"Coffee-focused" from mobile_bar and renaming coffee's "Both" → "Coffee + tea".

**1g. `option_key` convention is split table-wide** (booths included): `catering`/`photo_video` use snake_case keys (`cuisine_filipino`, `pv_cinematic`); booths, `dj`, `florist` store the display label as the key ("Espresso bar", "Halo-halo"). Pick snake_case before seeding ~80 new booth options, or the keys become un-renameable once vendors reference them.

**1h. Leaf-key naming drift:** booth leaves are `coffee`, `henna`, `mocktail`… while their tiles are `coffee_espresso`, `henna_tattoo`. Works (joined via `tile_id`) but worth a naming rule for the 7 new leaves.

---

## §2 — Complete refinement catalog, tile by tile

Legend: ✅ = live in prod today · ➕ = proposed addition · 🇵🇭 = Philippines-local · 🌍 = international · 🌐 = both/universal. Every ➕ option needs a sample photo per the refinements lock (Recraft pipeline / Sample_Render_Refresh_Program).

### 1. Photo Booth (`photo_booth`) — "What kind of booth experience?"
| Option | Scope | Status |
|---|---|---|
| Traditional (4R prints / strips) | 🌐 | ✅ |
| 360 booth | 🌐 | ✅ |
| GIF | 🌐 | ✅ |
| Polaroid / instax | 🌐 | ✅ |
| Magic mirror | 🌐 | ✅ |
| Patiktok | 🇵🇭 Setnayan | ✅ |
| Pabati (video greetings) | 🇵🇭 Setnayan | ➕ (closes §1d) |
| AI photo booth (themed AI portraits) | 🌍 | ➕ |
| Glam booth (B&W skin-smoothing) | 🌍 | ➕ |
| Slow-motion booth | 🌍 | ➕ |
| Audio guest book (vintage phone) | 🌍 | ➕ |
| Flipbook station | 🌍 | ➕ |
| Light-painting booth | 🌍 | ➕ |

### 2. Mobile Bar (`mobile_bar`) — "What does the bar pour?"
| Option | Scope | Status |
|---|---|---|
| Full cocktail | 🌐 | ✅ |
| Beer & wine | 🌐 | ✅ |
| Whiskey & cigar | 🌍 | ✅ |
| Themed | 🌐 | ✅ |
| Mocktail only | — | ✅ → **drop** (routes to Mocktail tile, §1f) |
| Coffee-focused | — | ✅ → **drop** (routes to Coffee tile, §1f) |
| Gin bar (gin-pomelo · craft gin) | 🇵🇭 | ➕ |
| Lambanog / tubâ tasting | 🇵🇭 | ➕ |
| Craft beer tap truck | 🌍 | ➕ |
| Champagne tower & wall | 🌍 | ➕ |
| Espresso martini bar | 🌍 | ➕ |
| Sake / soju bar | 🌍 | ➕ |

### 3. Coffee / Espresso (`coffee_espresso`) — "What's brewing?"
| Option | Scope | Status |
|---|---|---|
| Espresso bar | 🌐 | ✅ |
| Pour-over | 🌐 | ✅ |
| Specialty beans | 🌐 | ✅ |
| Tea bar | 🌐 | ✅ |
| Both | — | ✅ → **rename** "Coffee + tea" (§1f) |
| Kapeng barako | 🇵🇭 | ➕ |
| Spanish latte / iced coffee cart | 🌐 | ➕ |
| Matcha bar | 🌍 | ➕ |
| Cold brew / nitro | 🌍 | ➕ |
| Chai station | 🌍 | ➕ |

### 4. Mocktail (`mocktail`) — "What's the zero-proof style?"
| Option | Scope | Status |
|---|---|---|
| Fruit | 🌐 | ✅ |
| Herbal | 🌐 | ✅ |
| Sparkling | 🌐 | ✅ |
| Tea-based | 🌐 | ✅ |
| Tropical | 🌐 | ✅ |
| Dessert | 🌐 | ✅ |
| Fresh buko & tropical juices | 🇵🇭 | ➕ |
| Sago't gulaman / samalamig stand | 🇵🇭 | ➕ |
| Smoothie / slushie | 🌍 | ➕ |
| Zero-proof cocktails (NA spirits) | 🌍 | ➕ |

### 5. Food Truck (`food_truck`) — "What's on the truck?"
| Option | Scope | Status |
|---|---|---|
| Burgers | 🌐 | ✅ |
| Pizza | 🌐 | ✅ |
| Tacos | 🌍 | ✅ |
| Asian fusion | 🌐 | ✅ |
| Filipino street food | 🇵🇭 | ✅ |
| Ice cream | 🌐 | ✅ |
| Grilled skewers | 🌐 | ✅ |
| Silog / rice-meal truck | 🇵🇭 | ➕ |
| Shawarma | 🌐 | ➕ |
| BBQ / smokehouse | 🌍 | ➕ |
| Vegan / plant-based | 🌍 | ➕ |

### 6. Dessert Station (`dessert`) — "What's the sweet spread?"
| Option | Scope | Status |
|---|---|---|
| Pastries | 🌐 | ✅ |
| Macarons | 🌍 | ✅ |
| Cupcakes | 🌐 | ✅ |
| Chocolate fountain | 🌐 | ✅ |
| Candy buffet | 🌐 | ✅ |
| Donut wall | 🌐 | ✅ (canonical home moves here, §1b) |
| Churros | 🌐 | ✅ |
| Kakanin | 🇵🇭 | ✅ |
| Bibingka & puto bumbong | 🇵🇭 (seasonal) | ➕ |
| Turon / banana cue | 🇵🇭 | ➕ |
| Gelato cart | 🌍 | ➕ |
| S'mores station | 🌍 | ➕ |
| Bubble waffle | 🌍 | ➕ |
| Dessert tower (croquembouche) | 🌍 | ➕ |

### 7. Food Cart (`food_cart`) — "Which cart?"
| Option | Scope | Status |
|---|---|---|
| Halo-halo | 🇵🇭 | ✅ |
| Ice cream | 🌐 | ✅ |
| Crepe / pancake | 🌐 | ✅ |
| Cotton candy | 🌐 | ✅ |
| Charcuterie | 🌍 | ✅ |
| Mini lechon | 🇵🇭 | ✅ |
| Sorbetes (dirty ice cream) | 🇵🇭 | ✅ |
| Taho | 🇵🇭 | ➕ |
| Kwek-kwek / tusok-tusok (fishball · kikiam) | 🇵🇭 | ➕ |
| Isaw / ihaw-ihaw grill | 🇵🇭 | ➕ |
| Mais con yelo | 🇵🇭 | ➕ |
| Buko shake / juice | 🇵🇭 | ➕ |
| Popcorn | 🌐 | ➕ |
| Pretzel | 🌍 | ➕ |
| Takoyaki | 🌐 | ➕ |
| Bubble tea | 🌐 | ➕ |
| Oyster / raw bar | 🌍 | ➕ |
| Raclette wheel | 🌍 | ➕ |
| Other / specialty cart | 🌐 | ➕ (covers `food_cart_generic`, §1c) |

### 8. Henna / Tattoo (`henna_tattoo`) — "What style?"
| Option | Scope | Status |
|---|---|---|
| Traditional Arabic | 🌍 | ✅ |
| Modern minimalist | 🌐 | ✅ |
| Elaborate bridal | 🌐 | ✅ |
| Philippine Muslim | 🇵🇭 | ✅ |
| Indian bridal mehndi | 🌍 | ➕ (closes §1e) |
| Jagua / temporary ink | 🌍 | ➕ |
| Flash / metallic foil tattoos | 🌍 | ➕ |
| Airbrush tattoo | 🌐 | ➕ |
| Glitter tattoos (kids) | 🌐 | ➕ |

### 9. Massage Chair → propose relabel "Wellness Station" (`massage_chair`) — NEW leaf, "What's the wellness treat?"
| Option | Scope | Status |
|---|---|---|
| Massage chair lounge | 🌐 | ➕ |
| Hilot hand & shoulder massage | 🇵🇭 | ➕ |
| Foot reflexology | 🌐 | ➕ |
| Aromatherapy bar | 🌍 | ➕ |
| Oxygen bar | 🌍 | ➕ |
| Hair touch-up station | 🌐 | ➕ (covers `hair_touchup_station`) |

### 10. Mini Nail Bar (`mini_nail_bar`) — NEW leaf, "What's on the menu?"
| Option | Scope | Status |
|---|---|---|
| Express manicure | 🌐 | ➕ |
| Nail art | 🌐 | ➕ |
| Gel polish | 🌐 | ➕ |
| Kids glitter nails | 🌐 | ➕ |
| Hand spa & paraffin | 🌍 | ➕ |

### 11. Perfume Bar (`perfume_bar`) — NEW leaf, "What scent experience?"
| Option | Scope | Status |
|---|---|---|
| Custom scent blending | 🌍 | ➕ |
| Take-home mini bottles | 🌐 | ➕ |
| Oil-based / alcohol-free (halal) | 🌐 | ➕ |
| Solid perfume bar | 🌍 | ➕ |
| Bottle engraving add-on | 🌍 | ➕ |

### 12. Arcade / Games (`arcade_games`) — NEW leaf, "What's the play?"
| Option | Scope | Status |
|---|---|---|
| Retro arcade cabinets | 🌍 | ➕ |
| VR / AR station | 🌍 | ➕ |
| Claw machine | 🌐 | ➕ |
| Karaoke booth | 🇵🇭-beloved 🌐 | ➕ |
| Perya games (color game · ring toss) | 🇵🇭 | ➕ |
| Giant lawn games (Jenga · Connect 4) | 🌍 | ➕ |
| Console gaming lounge | 🌐 | ➕ |

### 13. Tarot / Astrology / Palmistry (`tarot_astrology_palmistry`) — NEW leaf, "What reading?"
| Option | Scope | Status |
|---|---|---|
| Tarot reading | 🌐 | ➕ |
| Palmistry | 🌐 | ➕ |
| Astrology / birth chart | 🌍 | ➕ |
| Chinese fortune sticks (kau cim) | 🌐 (Chinoy) | ➕ |
| Numerology | 🌍 | ➕ |
| Tea-leaf / coffee-cup reading | 🌍 | ➕ |

### 14. Caricature / Calligraphy / Painting (`caricature_calligraphy_painting`) — NEW leaf, "What does the artist make?"
| Option | Scope | Status |
|---|---|---|
| Live wedding painter (canvas) | 🌐 | ➕ |
| Caricature — traditional | 🌐 | ➕ |
| Digital caricature (iPad + instant print) | 🌍 | ➕ |
| Watercolor guest portraits | 🌍 | ➕ |
| Silhouette cutting | 🌍 | ➕ |
| Live calligraphy (place cards · gifts) | 🌐 | ➕ |
| Poetry typewriter | 🌍 | ➕ |

### 15. Engraving / Embroidery (`engraving_embroidery`) — NEW leaf, "What gets personalized?"
| Option | Scope | Status |
|---|---|---|
| Keychain & metal engraving | 🌐 | ➕ |
| Glassware engraving | 🌍 | ➕ |
| Jewelry engraving | 🌍 | ➕ |
| Live embroidery (caps · denim) | 🌐 | ➕ |
| Handkerchief embroidery | 🇵🇭 | ➕ |
| Leather stamping | 🌍 | ➕ |

**Totals:** 49 live options today → **~118 in the complete catalog** (69 proposed adds, 2 drops, 1 rename). Every tile gets a leaf; PH-local coverage goes from 7 options to 22.

---

## §3 — Data-hygiene rules to lock before seeding

1. **`option_key` = snake_case, tile-prefixed** (`pb_360`, `fc_taho`) — migrate the existing label-as-key rows in the same migration (§1g). Vendors' stored selections must be remapped, not orphaned.
2. **Leaf naming:** new leaves take the tile_id as leaf_key (`arcade_games`, `perfume_bar`…) — ends the `coffee`/`henna` drift (§1h).
3. **One home per concept:** donut wall → Dessert; mocktail/coffee capabilities → their own tiles (§1b, §1f).
4. **Every option ships with a sample photo** (refinements lock) — ~69 new renders via the Recraft pipeline.
5. **Pabati needs a canonical row** (`pabati`, folder booths, tile photo_booth, `is_setnayan=TRUE`) + refinement option, per the 2026-06-03 amendment (§1d).

## §4 — Next steps (not yet executed)

1. Owner reviews/edits the ➕ catalog above (especially drops in §1f and the balut-class judgment calls I left out).
2. Seed migration in Setnayan-App (worktree + PR): new leaves + options + key migration + Pabati canonical.
3. Recraft batch for the ~69 new sample photos.
4. Fold this doc's outcome back into `Vendor_Taxonomy_V1_Master.md` when the deferred 10-parent rewrite happens.
