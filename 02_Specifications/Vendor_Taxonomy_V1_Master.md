# Vendor Taxonomy — V1 / V1.1 → V1.5+ Master Reference

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code (`apps/web` @ `origin/main`) + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. The taxonomy *keys* + phase mapping here remain a useful reference (vendors keep their `services[]` tags), but several structural + SKU facts have moved:
> - **Visible structure is the 10-parent shrink, not the 12-folder/192-canonical model** below — this doc already flags it (§ top note) and the live `apps/web/lib/taxonomy.ts` / `lib/vendor-category-taxonomy.ts` ship the 10-parent grouping. The full rewrite to 10-parent is still a deferred follow-up.
> - **Vendor tiers don't gate on the old 5-col cap** — live ladder is Free (1 category) / Pro ₱2,499/28d (3 cats) / Enterprise ₱5,499/28d (unlimited); Additional Branch ₱999/28d. Tiers sell REACH not category-count features.
> - **Some Setnayan-service inserts use retired names/prices:** the planner is **"Setnayan AI" ₱1,499**, NOT "**Setnayan Concierge**" (#159 / §4 table — Concierge is RETIRED). **Pakanta is a SINGLE SKU ₱2,499** (the "Pakanta ₱1,999–₱9,999" 3-tier in §4's Setnayan AI-wizard table is stale). Monogram ships as **"Animated Monogram" ₱2,499** (not "Bespoke ₱2,999"). The whole "Setnayan AI wizard coverage" subsection (§4) reflects the **retired couple-app wizard** — that wizard is gone (SKUs persist, the carousel discovery path does not).
> - **0% commission, ever** (Setnayan never sits between vendor and couple at checkout); a **vendor token economy is LIVE** (burn-on-answer 1–3 tokens ₱100/200/300 region-banded); vendor↔customer money is OFF-PLATFORM (RA 11967).
> - Cross-ref iteration links (0011 as `0011_panood`, 0043–0047) are pre-resync corpus archive — trust the live taxonomy code + ground-truth doc over folder pointers.
>
> Net: the category KEYS are still valid; the PARENT grouping, vendor-tier model, and Setnayan-service SKU names/prices are not. When this body disagrees with the above, **the above wins.**

**Purpose.** Single canonical source for Setnayan's vendor taxonomy, mapping every searchable vendor sub-category to its target launch phase, marketplace surface, and category dependencies. Future iteration drafting + vendor recruitment + marketplace launch sequencing all reference this doc instead of re-deriving from individual iteration specs.

**Status.** Drafted 2026-05-19 · Consolidates session-locked taxonomy work from V1.5→V1 promotion (2026-05-18) + V1.1 content-engine spec drafting (2026-05-19) into one read-once reference.

> **⚠️ SUPERSEDED (visible structure) — shipped to production 2026-05-31.** The 12-folder / ~196-canonical structure documented below is now the *historical* reference. The marketplace ships the **10-parent shrink** (Venue · Planning · Feast · Design · Program · Documentary · Look · Booths · Prints · Transport) — see [Vendor_Taxonomy_Shrink_2026-05-30.md](../03_Strategy/Vendor_Taxonomy_Shrink_2026-05-30.md) (live via PR #689) + the CLAUDE.md decision log 2026-05-31. The canonical **KEYS** below are unchanged (vendors keep their `services[]` tags) — only the parent grouping moved + 3 new canonicals were added (`orchestra`, `fireworks_pyro`, `led_video_wall`). This doc's full rewrite to the 10-parent model is a deferred follow-up.

**Authoritative iteration specs (this doc consolidates, doesn't replace):**
- [0006_vendors_management](../0006_vendors_management/0006_vendors_management.md) — canonical_services enum source-of-truth
- [0043_wedding_type_picker](../0043_wedding_type_picker/0043_wedding_type_picker.md) — ceremony_type × venue_setting axes that gate faith/cultural categories
- [0044_per_category_schemas](../0044_per_category_schemas/0044_per_category_schemas.md) — per-category attribute schemas + shared attribute groups
- [0045_product_catalogs](../0045_product_catalogs/0045_product_catalogs.md) — product-level entities for ~20 categories
- [0046_wedding_showcase](../0046_wedding_showcase/0046_wedding_showcase.md) — showcase taxonomy facets
- [0047_style_driven_marketplaces](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) — 5-column vendor mega-menu + 7 marketplace launch sequence

**Maintenance.** When a new sub-category is added or a phase is shifted, update this doc + the source iteration spec in the same commit. When a faith activates (Christian → INC → Muslim → Cultural per [0043 phasing](../0043_wedding_type_picker/0043_wedding_type_picker.md)), strike-through "Coming Soon" markers here.

---

## 1. Top-level structure (12 PH-grounded wedding folders)

**Updated 2026-05-20.** Migrated from 5-column WedMeGood-style mega-menu to a 12-folder Filipino-wedding-culture-grounded taxonomy ordered by PH booking timeline. See [CLAUDE.md decision log 2026-05-20 "Marketplace taxonomy remap"](../CLAUDE.md) for rationale. The legacy 5-column structure remains in § 2 below as the row-by-row mapping reference; § 1 here is the catalog rendering source-of-truth.

**Ordering principle:** earliest bookings first (Ceremony locks the date 12-18 months out), latest last (Logistics + Travel slip into 1-3 months pre-event).

| # | Folder | Children | Book by | Cultural anchor |
|---|---|---|---|---|
| 1 | **Ceremony** | 17 | 12-18+ months | Multi-faith officiant bundle (Catholic · Christian · INC · Muslim · Cultural · Civil) + pre-marriage seminars + paperwork |
| 2 | **Reception** | filter-only | 12-18+ months | Backed by existing `venue_setting` enum (banquet_hall · garden · beach · destination · heritage · outdoor_tent · civil_registrar); combined-venue badge marks 5 settings that also host ceremony — V1.2 venue iteration adds bookable venue records |
| 3 | **Planning, Logistics & Travel** | 28 | 12-18 months (planner first) | Wedding planner + Pamamanhikan · Despedida · Sponsor Coord [PH] + transport + outdoor rentals (generator for brownouts · weather forecaster for Tagaytay · bug repellent) + honeymoon |
| 4 | **Photo & Video** | 15 | 12+ months | Top photographers/videographers scarcest; Pre-Nup shoot has its own PH-specific sub-section |
| 5 | **Catering** | 20 | 9-12 months | Lechonero + Mini Lechon + Halo-Halo as named PH-Signature sub-section; Halal [Muslim] + Mocktail-Only [INC] as faith-specific sub-section |
| 6 | **Attire** | 23 | 6-9 months | Filipiniana (Terno · Maria Clara · Balintawak) + Barong Tagalog as own sub-sections; Muslim cultural variants (Maranao · Tausug · Yakan); **Sponsor attire (Ninang · Ninong)** as first-class sub-section |
| 7 | **Hair & Makeup** | 13 | 6-12 months | **Family Makeup [PH]** for multi-generational glam; pre-wedding wellness regimen (spa · derm · dental); Muslim Henna Artist |
| 8 | **Music & Program** | 16 | 6-9 months | Host/Emcee folded here (per Option A); Kulintang [Muslim·PH] + Rondalla + Folk performers as Cultural sub-section; Pre-Cana Dance Trainer [PH] |
| 9 | **Decor, Florals & Sound** | 14 | 4-6 months | Capiz · Hacienda Heritage · Maranao Okir [Muslim] as Cultural Décor sub-section; Setnayan Pailaw + Custom Monogram; Lights & Sound merged in for event-design coherence |
| 10 | **Rings & Accessories** | 11 | 3-4 months | Engagement + Wedding rings; **Sponsor Corsage [PH]** as first-class sub-item |
| 11 | **Booths & Stations** | 16 | 2-3 months | Setnayan signature category — photo / tech / wellness / mystic booths. Carved out from old Col 3 catering dump |
| 12 | **Invitations & Keepsakes** | 19 | 3-6 months | Live craft booths (calligraphy · embroidery · portrait painter) + **Pasalubong Box · Sponsor Token · Godchild Token [all PH]** as Souvenirs sub-section |

**Total: 192 canonical_services** (zero new schema — pure reorganization of the existing 192 from `canonical_service_schemas`).

**Religion-default-on filter (2026-05-20).** When a couple has set `events.ceremony_type` (Catholic / Christian / INC / Muslim / Cultural / Civil), the marketplace auto-filters both vendor cards (`matchEvent=true`) AND catalog tiles to faith-compatible items. Cross-faith (untagged) tiles always surface — they're the secular base. Couple toggles off via `?match=0` ("Show all faiths" pill). Civil couples (no faith) keep all faith-tagged tiles hidden by default.

**Sub-section rendering.** Each folder renders visible sub-section headers within it (e.g. Attire → Bridal · Filipiniana · Faith-Modest · Groom · Bridal Party · Sponsors). Couples scan the spec sub-sections naturally without two levels of click.

**Mobile pattern** (per [Responsive UI default](../CLAUDE.md)): folder tabs horizontally scrollable, tiles stack 2-up, sub-section headers stay sticky as the user scrolls within a folder.

---

## 2. Full taxonomy with phase mapping

**Legend:**
- `[0006]` — already in current `canonical_services` enum
- `[NEW]` — proposed addition (V1.1 or V1.2)
- `[SETNAYAN SERVICE]` — first-party service surfaced with badge in marketplace
- `[PH-specific]` — Filipino-cultural category WedMeGood structurally lacks
- `[Faith: X]` — surfaces conditionally per `events.ceremony_type` from [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md)
- `[On Rent]` — rental variant of a category
- Phase column: `V1.1 base` · `V1.1.1` (Food mp) · `V1.1.2` (Photo mp) · `V1.1.3` (Music mp) · `V1.1.4` (Attire mp) · `V1.1.5` (Host mp) · `V1.1.6` (S&B mp) · `V1.2` · `V1.3` · `V1.4` · `V1.5+`

### 2.1 Column 1 — Capture (Visual)

**Photographers**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 1 | Wedding Photographer | `[0006: photography]` | V1.1 base |
| 2 | Pre-Nup Photographer | `[NEW]` splits from `prenup_shoot` | V1.1 base |
| 3 | Engagement Photographer | `[NEW]` | V1.1.2 |
| 4 | Drone Operator | `[0006: drone]` | V1.1 base |
| 5 | Same-Day Edit Specialist | `[0006: same_day_edit]` | V1.1 base |
| 6 | Family Day-2 / Brunch Photographer | `[NEW]` | V1.1.2 |
| 7 | Boudoir Photographer | `[NEW]` | V1.1.2 |
| 8 | Studio Portrait Photographer | `[NEW]` | V1.1.2 |
| 9 | **Setnayan Papic** | `[SETNAYAN SERVICE]` | V1.1 base |

**Videographers**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 10 | Wedding Videographer | `[0006: videography]` | V1.1 base |
| 11 | Same-Day Edit Videographer | `[0006: same_day_edit]` (shared) | V1.1 base |
| 12 | Drone Videographer | `[NEW]` splits from `drone` | V1.1 base |
| 13 | Highlight Reel Specialist | `[NEW]` | V1.1.2 |
| 14 | **Setnayan AI Edited Highlight** | `[SETNAYAN SERVICE]` | V1.1 base |

**Pre-Nup Locations (NEW top-level category)**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 15 | Pre-Nup Shoot Locations | `[NEW]` `[PH-specific]` (El Nido, Siargao, Tagaytay, etc.) | V1.2 |

**Column 1 total: 15 sub-categories** (10 in V1.1 base / 4 in V1.1.2 / 1 in V1.2)

---

### 2.2 Column 2 — Music & Entertainment

**Bands & Live Music**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 16 | Wedding Bands (full ensemble) | `[0006: live_band]` | V1.1.3 |
| 17 | Acoustic Performers (solo/duo) | `[0006: acoustic_performer]` | V1.1.3 |
| 18 | Choirs / String Quartets | `[0006: choir_string_quartet]` | V1.1.3 |
| 19 | Kulintang Ensembles | `[NEW]` `[PH-specific]` `[Faith: Muslim]` | V1.4 |
| 20 | Rondalla Ensembles | `[NEW]` `[PH-specific]` | V1.5+ |
| 21 | Folk Performers (Igorot dancers, Sagala troupes) | `[NEW]` `[PH-specific]` | V1.5+ |
| 22 | Wedding Singers (solo vocalists) | `[NEW]` | V1.1.3 |
| 23 | **Setnayan Pakanta** (Custom Song) | `[SETNAYAN SERVICE]` | V1.1 base |
| 24 | **Setnayan Panood** (Multi-Cam Livestream) | `[SETNAYAN SERVICE]` | V1.1 base |

**DJs & Entertainment**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 25 | DJs (split from `dj_emcee_host`) | `[0006]` (split) | V1.1.3 |
| 26 | Wedding Entertainment (magicians, fire dancers, etc.) | `[NEW]` | V1.1.3 |

**Hosts (Emcees)**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 27 | Wedding Hosts / MCs (split from `dj_emcee_host`) | `[0006]` (split) | V1.1 base |

**Choreographers** _(phase promoted V1.2 → V1.1 on 2026-05-24 — the Setnayan AI wizard now surfaces a `dance_instructor` card at position 20 with canonical service `choreographer`; couples need a vendor list to pick from at launch.)_
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 28 | Entourage Choreographer | `[NEW]` `[PH-specific]` | V1.1 |
| 29 | First Dance Choreographer | `[NEW]` | V1.1 |
| 30 | Pre-Cana Dance Trainer | `[NEW]` `[PH-specific]` | V1.1 |

**Column 2 total: 15 sub-categories** (4 in V1.1 base / 6 in V1.1.3 / 3 in V1.2 / 1 in V1.4 / 2 in V1.5+)

---

### 2.3 Column 3 — Food & Beverage

**Catering**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 31 | Catering Services (full-service) | `[0006: catering]` | V1.1 base |
| 32 | Lechonero (whole-pig roast specialist) | `[NEW]` `[PH-specific]` | V1.1 base |
| 33 | Live Cooking Stations (paella, sushi, etc.) | `[NEW]` | V1.1.1 |
| 34 | Halal Catering Specialists | `[NEW]` `[Faith: Muslim]` (tag visible V1.1; recruits V1.4) | V1.1.1 |
| 35 | Mocktail-Only Caterers | `[NEW]` `[Faith: INC + Muslim]` | V1.1.1 |
| 36 | Food Trucks | `[NEW]` | V1.1.1 |

**Cake & Desserts**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 37 | Wedding Cakes (split from `cake_desserts`) | `[0006]` (split) | V1.1 base |
| 38 | Dessert Stations | `[NEW]` | V1.1.1 |

**Beverage / Bar**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 39 | Mobile Bar (alcoholic) | `[0006: mobile_bar]` | V1.1 base |
| 40 | Mocktail Bar (alcohol-free) | `[NEW]` `[Faith: INC + Muslim]` | V1.1.1 |

**Stations & Booths (NEW top-level category — 30 sub-types in 5 groups)**

*Food & Beverage Stations (10)*
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 41 | Coffee / Espresso Bar | `[NEW]` | V1.1 base |
| 42 | Halo-Halo Station | `[NEW]` `[PH-specific]` | V1.1.6 |
| 43 | Ice Cream Cart | `[NEW]` | V1.1.6 |
| 44 | Crepe / Pancake Station | `[NEW]` | V1.1.6 |
| 45 | Cotton Candy Cart | `[NEW]` | V1.1.6 |
| 46 | Cheese / Charcuterie Board | `[NEW]` | V1.1.6 |
| 47 | Mini Lechon Station | `[NEW]` `[PH-specific]` | V1.1.6 |
| 48 | Wine / Whiskey / Cigar Bar | `[NEW]` | V1.1.6 |
| 49 | Mocktail Bar (booth-scale) | `[NEW]` `[Faith: INC + Muslim]` | V1.1.6 |
| 50 | Tea Ceremony / Tea Bar | `[NEW]` | V1.1.6 |
| 50a | Donut Wall / Display | `[NEW]` (added 2026-05-24 per owner directive) | V1.1.6 |
| 50b | Sorbetes Cart | `[NEW]` `[PH-specific]` (added 2026-05-24 per owner directive) | V1.1.6 |
| 50c | Food Cart (Generic) | `[NEW]` (added 2026-05-24 per owner directive · catch-all for cart-vendors who don't fit a specific category — e.g., taco cart · fish ball / chicharon / kakanin cart · kebab cart · samosa cart · shawarma cart · takoyaki cart · banana cue / camote cue cart) | V1.1.6 |

**Branded-vendor note (added 2026-05-24):** Branded chains (e.g., Dunkin Donuts, J.Co Donuts, Selecta Sorbetes) surface as vendor profiles UNDER the appropriate sub-category (Donut Wall, Sorbetes Cart, Ice Cream Cart) rather than as their own sub-categories. The taxonomy stays generic; the marketplace surfaces specific branded vendors via vendor_profiles rows tagged to the relevant sub-category. Souvenir booth coverage is similarly distributed across Visual & Keepsake (#57-64) + Skill & Craft (#65-70) groups — no generic "Souvenir Booth" sub-category needed; couples pick from the more specific keepsake/craft sub-types.

*Sensory & Beauty Stations (6)*
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 51 | Perfume Bar (custom blend) | `[NEW]` | V1.1.6 |
| 52 | Henna / Temporary Tattoo Booth | `[NEW]` | V1.1.6 |
| 53 | Massage Chair Station | `[NEW]` | V1.1.6 |
| 54 | Mini Nail Bar | `[NEW]` | V1.1.6 |
| 55 | Hair Touch-Up Station | `[NEW]` | V1.1.6 |
| 56 | Aromatherapy Station | `[NEW]` | V1.1.6 |

*Visual & Keepsake Booths (8)*
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 57 | Photo Booth | `[0006: photobooth]` (under S&B umbrella) | V1.1 base |
| 58 | 360 Booth | `[NEW]` | V1.1.6 |
| 59 | GIF Booth | `[NEW]` | V1.1.6 |
| 60 | Polaroid / Instax Booth | `[NEW]` | V1.1.6 |
| 61 | Live Wedding-Portrait Painter | `[NEW]` | V1.1.6 |
| 62 | Caricature Artist | `[NEW]` | V1.1.6 |
| 63 | Silhouette / Profile Artist | `[NEW]` | V1.1.6 |
| 64 | Selfie Magic Mirror | `[NEW]` | V1.1.6 |

*Skill & Craft Booths (6)*
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 65 | Live Calligraphy / Name Printing | `[NEW]` | V1.1.6 |
| 66 | Custom Keychain / Magnet Engraving | `[NEW]` | V1.1.6 |
| 67 | Live Embroidery (on handkerchiefs) | `[NEW]` | V1.1.6 |
| 68 | Live Poetry Typewriter | `[NEW]` | V1.1.6 |
| 69 | Tarot / Astrology Reading | `[NEW]` | V1.1.6 |
| 70 | Palmistry Reader | `[NEW]` | V1.1.6 |

*Interactive Booths (4)*
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 71 | VR / AR Experience Station | `[NEW]` | V1.1.6 |
| 72 | Arcade / Retro Games | `[NEW]` | V1.1.6 |
| 73 | LED Dance Floor | `[NEW]` | V1.1.6 |
| 74 | **Setnayan Patiktok** (TikTok Booth) | `[SETNAYAN SERVICE]` | V1.1 base |

**Column 3 total: 47 sub-categories** (6 in V1.1 base / 5 in V1.1.1 / 31 in V1.1.6 — Donut Wall + Sorbetes Cart + Food Cart Generic added 2026-05-24 / others gated by faith)

---

### 2.4 Column 4 — Look (Attire, Beauty, Decor)

**Bridal Wear**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 75 | Bridal Gown (Custom) | `[0006: bridal_gown]` (split) | V1.1 base |
| 76 | Bridal Gown (Rental) | `[NEW]` `[On Rent]` | V1.1.4 |
| 77 | Bridesmaid Dresses | `[0006: entourage_attire]` (split) | V1.1 base |
| 78 | Mother-of-Bride Gowns | `[NEW]` | V1.1 base |
| 79 | Flower Girl Dresses | `[NEW]` | V1.1 base |
| 80 | Junior Bridesmaid Dresses | `[NEW]` | V1.1.4 |
| 81 | Filipiniana Terno | `[NEW]` `[PH-specific]` | V1.1.4 |
| 82 | Filipiniana Maria Clara | `[NEW]` `[PH-specific]` | V1.1.4 |
| 83 | Filipiniana Balintawak | `[NEW]` `[PH-specific]` | V1.1.4 |
| 84 | Sponsor Attire — Ninang Sets | `[NEW]` `[PH-specific]` | V1.1.4 |
| 85 | Modest Muslim Bridal Attire | `[NEW]` `[Faith: Muslim]` | V1.4 |
| 86 | Modest INC Bridal Attire | `[NEW]` `[Faith: INC]` | V1.3 |
| 87 | Maranao Wedding Attire (malong-inspired) | `[NEW]` `[Faith: Muslim · Maranao]` | V1.4 |
| 88 | Tausug Wedding Attire (beadwork-heavy) | `[NEW]` `[Faith: Muslim · Tausug]` | V1.4 |
| 89 | Yakan Textile Bridal | `[NEW]` `[Faith: Muslim · Yakan]` | V1.4 |

**Groom Wear**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 90 | Wedding Suits / Tuxedos (Custom) | `[0006: groom_suit]` (split) | V1.1 base |
| 91 | Wedding Suits / Tuxedos (Rental) | `[NEW]` `[On Rent]` | V1.1.4 |
| 92 | Barong Tagalog (Custom) | `[NEW]` `[PH-specific]` | V1.1.4 |
| 93 | Barong Tagalog (Rental) | `[NEW]` `[PH-specific]` `[On Rent]` | V1.1.4 |
| 94 | Groomsman Sets (matched) | `[NEW]` | V1.1.4 |
| 95 | Junior Groomsman | `[NEW]` | V1.1.4 |
| 96 | Ring Bearer Suits | `[NEW]` | V1.1.4 |
| 97 | Sponsor Attire — Ninong Sets | `[NEW]` `[PH-specific]` | V1.1.4 |

**Beauty & Grooming**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 98 | Bridal Makeup Artists | `[0006: hmua]` (split) | V1.1 base |
| 99 | Family Makeup Artists | `[NEW]` | V1.1 base |
| 100 | Bridal Hair Stylists | `[0006: hmua]` (split) | V1.1 base |
| 101 | Touch-Up Artists (day-of) | `[NEW]` | V1.1.5 |
| 102 | Bridal Spa & Wellness | `[NEW]` | V1.2 |
| 103 | Bridal Fitness Programs (pre-wedding) | `[NEW]` | V1.2 |
| 104 | Bridal Nutritionist / Diet Coach | `[NEW]` | V1.2 |
| 105 | Bridal Dermatology (skin prep) | `[NEW]` | V1.2 |
| 106 | Bridal Dental (whitening/alignment) | `[NEW]` | V1.2 |
| 107 | Groom Grooming (skincare, beard, hair) | `[NEW]` | V1.2 |
| 108 | Muslim Henna Artist (cultural style) | `[NEW]` `[Faith: Muslim]` | V1.4 |
| 109 | Maternity Bride MUA | `[NEW]` | V1.2 |
| 110 | Mature Bride MUA | `[NEW]` | V1.2 |

**Jewelry & Accessories** (WedMeGood gap closure)
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 111 | Engagement Rings | `[NEW]` | V1.2 |
| 112 | Wedding Bands | `[0006: wedding_rings]` | V1.2 |
| 113 | Bridal Jewellery | `[NEW]` | V1.2 |
| 114 | Bridal Jewellery (Rental) | `[NEW]` `[On Rent]` | V1.2 |
| 115 | Wedding Veils & Trains | `[NEW]` | V1.2 |
| 116 | Bridal Bouquets (specialty separate from florals) | `[NEW]` | V1.2 |
| 117 | Garters | `[NEW]` | V1.2 |
| 118 | Bridal Headpieces | `[NEW]` | V1.2 |
| 119 | Sponsor Corsages | `[NEW]` `[PH-specific]` | V1.2 |
| 120 | Flower Girl Tiaras | `[NEW]` | V1.2 |
| 121 | Floral Jewellery (per WedMeGood pattern) | `[NEW]` | V1.2 |

**Decor & Styling**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 122 | Wedding Stylists | `[NEW]` | **V1.1 base (FIRST MARKETPLACE)** |
| 123 | Decorators (general) | `[NEW]` | V1.1 base |
| 124 | Florists | `[0006: florals]` | V1.1 base |
| 125 | Garden Wedding Florist (specialty) | `[NEW]` | V1.2 |
| 126 | Beach Wedding Florist (specialty) | `[NEW]` | V1.2 |
| 127 | Capiz / Native Décor Specialists | `[NEW]` `[PH-specific]` | V1.2 |
| 128 | Hacienda / Heritage Décor | `[NEW]` `[PH-specific]` | V1.2 |
| 129 | Maranao Okir Décor Specialists | `[NEW]` `[Faith: Muslim · Maranao]` | V1.4 |
| 130 | **Setnayan Pailaw** (LED Background) | `[SETNAYAN SERVICE]` | V1.1 base |
| 131 | **Setnayan Custom Monogram** | `[SETNAYAN SERVICE]` | V1.1 base |

**Column 4 total: 57 sub-categories** (15 in V1.1 base / 11 in V1.1.4 / 1 in V1.1.5 / 21 in V1.2 / 6 in V1.3-V1.4 / others)

---

### 2.5 Column 5 — Ceremony · Coordination · Logistics · Stationery · Travel

**Ceremony Officiants** (split by faith, replaces single `[0006: officiant]`)
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 132 | Catholic Priest | `[NEW]` (splits from `officiant`) | V1.1 base |
| 133 | Civil Judge | `[NEW]` | V1.1 base |
| 134 | Civil Mayor / Vice-Mayor | `[NEW]` | V1.1 base |
| 135 | Civil Justice of the Peace | `[NEW]` | V1.1 base |
| 136 | INC Minister | `[NEW]` `[Faith: INC]` | V1.3 |
| 137 | Born Again / Evangelical Pastor | `[NEW]` `[Faith: Christian]` | V1.2 |
| 138 | Charismatic Pastor (JIL, CCF, Victory) | `[NEW]` `[Faith: Christian]` | V1.2 |
| 139 | Mainline Protestant (Baptist, Methodist) | `[NEW]` `[Faith: Christian]` | V1.2 |
| 140 | Muslim Imam (BMA-registered) | `[NEW]` `[Faith: Muslim]` | V1.4 |
| 141 | Cultural Tribal Elder | `[NEW]` `[Faith: Cultural]` | V1.5+ |

**Pre-Marriage Requirements** (mostly PH-specific)
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 142 | Pre-Cana Seminar Facilitator | `[NEW]` `[PH-specific]` `[Faith: Catholic]` | V1.2 |
| 143 | CFO Seminar Facilitator | `[NEW]` `[PH-specific]` | V1.2 |
| 144 | INC Counseling Center | `[NEW]` `[PH-specific]` `[Faith: INC]` | V1.3 |
| 145 | Muslim Pre-Wedding Counseling | `[NEW]` `[PH-specific]` `[Faith: Muslim]` | V1.4 |
| 146 | Marriage License Expediting Service | `[NEW]` `[PH-specific]` | V1.2 |
| 147 | Apostille / DFA Authentication Services | `[NEW]` `[PH-specific]` | V1.3 |

**Planning & Coordination**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 148 | Wedding Planners (Full-Service) | `[0006: wedding_coordination]` | V1.1 base |
| 149 | Wedding Planners (Partial / Month-of) | `[NEW]` | V1.2 |
| 150 | Day-Of Coordinators | `[NEW]` (split) | V1.1 base |
| 151 | Destination Wedding Specialists | `[NEW]` | V1.2 |
| 152 | Pamamanhikan Coordinators | `[NEW]` `[PH-specific]` | V1.2 |
| 153 | Despedida Planners | `[NEW]` `[PH-specific]` | V1.2 |
| 154 | Sponsor Coordinators (ninong/ninang) | `[NEW]` `[PH-specific]` | V1.2 |
| 155 | Gender-Separated Reception Coordinators | `[NEW]` `[Faith: Muslim]` | V1.4 |
| 156 | Tabernakulo / Mosque Coordinators | `[NEW]` `[Faith: INC + Muslim]` | V1.3 (INC) / V1.4 (Muslim) |
| 157 | INC-Compatible Wedding Coordinators | `[NEW]` `[Faith: INC]` | V1.3 |
| 158 | Mahr Coordination Service | `[NEW]` `[Faith: Muslim]` | V1.4 |
| 159 | **Setnayan Concierge** | `[SETNAYAN SERVICE]` | V1.1 base |

**Transportation**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 160 | Bridal Transportation (Luxury Sedan / Limousine) | `[0006: transportation_bridal_car]` | V1.1 base |
| 161 | Vintage / Classic Vehicle Rental | `[NEW]` | V1.2 |
| 162 | Guest Shuttle Service | `[0006: transportation_guest_shuttle]` | V1.1 base |
| 163 | Motorcycle Escort | `[NEW]` | V1.5+ |
| 164 | Horse-Drawn Carriage | `[NEW]` (specialty) | V1.5+ |
| 165 | Bridal Boat / Yacht (destination weddings) | `[NEW]` | V1.5+ |

**Logistics & Infrastructure** (mostly garden/beach/outdoor)
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 166 | Generator Rental | `[NEW]` | V1.2 |
| 167 | Tent / Outdoor-Cover Rental | `[NEW]` | V1.2 |
| 168 | Mobile Restroom Rental | `[NEW]` | V1.2 |
| 169 | Cooling Fans / Misters Rental | `[NEW]` | V1.2 |
| 170 | Outdoor Sound System Specialist | `[NEW]` | V1.2 |
| 171 | Outdoor Lighting Specialist (string lights / market lights) | `[NEW]` | V1.2 |
| 172 | Bug / Mosquito Repellent Stations | `[NEW]` | V1.2 |
| 173 | Wedding-Day Weather Forecaster (Tagaytay-specialty) | `[NEW]` `[PH-specific]` | V1.2 |
| 174 | Parasol / Hat Rental Stations | `[NEW]` | V1.2 |
| 175 | Lights & Sound (banquet) | `[0006: lights_sound]` | V1.1 base |

**Stationery & Keepsakes**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 176 | Wedding Invitations (Print) | `[0006: invitation_print]` | V1.1 base |
| 177 | Wedding Invitations (Digital) | `[NEW]` (may fold into [0002 QR Invitation](../0002_qr_invitation_system/0002_qr_invitation_system.md)) | V1.2 |
| 178 | Wedding Cards Designer (specialty) | `[NEW]` (WedMeGood gap) | V1.2 |
| 179 | Save-the-Date (Digital) | `[NEW]` | V1.2 |
| 180 | **Setnayan Save-the-Date Video MP4** | `[SETNAYAN SERVICE]` | V1.1 base |
| 181 | Ceremony Programs (printed books) | `[NEW]` | V1.2 |
| 182 | Place Cards | `[NEW]` | V1.2 |
| 183 | Menu Cards | `[NEW]` | V1.2 |
| 184 | Signage (stationery_signage) | `[0006: stationery_signage]` | V1.1 base |
| 185 | Souvenirs / Giveaways | `[0006: souvenirs_giveaways]` | V1.1 base |
| 186 | Trousseau / Pasalubong Boxes | `[NEW]` `[PH-specific]` (WedMeGood gap) | V1.2 |
| 187 | Sponsor Tokens | `[NEW]` `[PH-specific]` | V1.2 |
| 188 | Inaanak / Godchild Tokens | `[NEW]` `[PH-specific]` | V1.2 |
| 189 | Wedding Rings (specific designer/retailer) | `[0006: wedding_rings]` | V1.1 base |

**Travel & Honeymoon**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 190 | Honeymoon Planners | `[0006: honeymoon_planner]` | V1.1 base |
| 191 | Destination Wedding Travel Coordinators | `[NEW]` | V1.2 |
| 192 | Visa-Wedding Logistics (Fil-Am couples) | `[NEW]` `[PH-specific]` | V1.5+ |

**Column 5 total: 61 sub-categories** (12 in V1.1 base / many V1.2 / faith-gated V1.3-V1.4 / niche V1.5+)

---

## 3. Grand totals & phase summary

| Column | Total sub-categories |
|---|---|
| Column 1 — Capture | 15 |
| Column 2 — Music & Entertainment | 15 |
| Column 3 — Food & Beverage (incl. 30 booths) | 44 |
| Column 4 — Look (Attire / Beauty / Jewelry / Decor) | 57 |
| Column 5 — Ceremony / Coordination / Logistics / Stationery / Travel | 61 |
| **TOTAL** | **192** |

### Of which:
- **Already in 0006 canonical_services:** 30
- **NEW additions proposed in V1.1+:** 162
- **PH-specific (WedMeGood structurally lacks):** ~38
- **Faith-specific (surfaces conditionally):** ~22
- **On Rent variants:** 5 (could expand to 10-15 in V1.3+)
- **SETNAYAN SERVICE inserts:** 8

vs **WedMeGood's ~30 generic vendor categories** with one shared filter UI across all → Setnayan's ~192 sub-categories with per-category schemas = **~6.4x deeper taxonomy**.

### Phase cumulative tally

| Phase end | Cumulative entries surfaceable | What's added since prior phase |
|---|---|---|
| Pilot end | 0 surfaced (canonicals exist but no marketplace) | — |
| **V1.1 base ship** | **~38** | 30 canonicals + 8 SETNAYAN inserts via Stylist mp + S&B surfacing |
| V1.1.1 (Food mp) | ~43 | +5 (live cooking, halal-spec, mocktail-only-cater, dessert station, food truck) |
| V1.1.2 (Photo mp) | ~48 | +5 (engagement, day-2, boudoir, studio portrait, highlight reel specialist) |
| V1.1.3 (Music mp) | ~54 | +6 (DJ split, wedding entertainment, wedding singers, bands surface, choir+acoustic surface) |
| V1.1.4 (Attire mp) | ~65 | +11 (Filipiniana 3 types, Barong custom/rental, gown rental, suit rental, sponsor sets, junior bridesmaid, ring bearer) |
| V1.1.5 (Host mp) | ~66 | +1 (touch-up artist) |
| V1.1.6 (S&B mp) | ~94 | +28 booth sub-types |
| **V1.2** | **~145** | +51 (Pre-Nup Locations, jewelry 10, beauty 10, logistics 9, stationery 8, coordination 4, Christian faith 3, pre-marriage 3, mixed specialty 3) |
| V1.3 (INC activation) | ~153 | +8 INC-specific |
| V1.4 (Muslim activation) | ~173 | +20 Muslim-specific incl. ethno-cultural variants |
| V1.5+ (Cultural + niche) | ~192 | +19 (Cultural officiants, niche transport, Visa logistics, Rondalla, Folk performers, etc.) |

---

## 4. SETNAYAN SERVICE inserts (the badge pattern)

> **⚠️ AMENDED 2026-06-03 (live placements moved).** The table below reflects the pre-shrink 5-column model. In the live 10-parent taxonomy the Setnayan inserts now sit at: **Concierge → Planning · Pakanta + Animated Monogram + Pro Website + Live Venue Photo Wall + Live Background (Pailaw) → Design › Digital Services (new tile) · Patiktok + Pabati → Booths › Photo Booth · Papic (+ Guest Stories / SDE / Thank You Video add-ons) → Documentary › Photo & Video · Panood → Documentary › Livestream · Editorial → Documentary › Editorial.** See [Vendor_Taxonomy_Shrink_2026-05-30.md](../03_Strategy/Vendor_Taxonomy_Shrink_2026-05-30.md) + the 2026-06-03 decision-log row. The table here is kept for its historical intra-tile ranking notes only.

Per [0047 § SETNAYAN SERVICE inserts](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md), first-party services appear as marketplace listings with a distinct visual badge. They populate per the same [0044 schema](../0044_per_category_schemas/0044_per_category_schemas.md) + [0045 product catalog](../0045_product_catalogs/0045_product_catalogs.md) framework as third-party vendors.

| Setnayan service | Marketplace placement | Iteration |
|---|---|---|
| **Concierge** | Top of "Wedding Planners" in Coordination | (existing service) |
| **Papic** | Position 3-5 in Photographers default results | [0012](../0012_papic/0012_papic.md) |
| **Panood** | Top of "Wedding Entertainment" sub-section | [0011](../0011_panood/0011_panood.md) |
| **Pailaw** | "Decorators" results with LED background filter | [0005](../0005_led_background_maker/0005_led_background_maker.md) |
| **Patiktok** | First entry in Interactive Booths sub-category | [0017](../0017_patiktok/0017_patiktok.md) |
| **Pakanta** | First entry in Music & Dance → Custom Songs sub-section | [0036](../0036_pakanta/0036_pakanta.md) |
| **Custom Monogram Pack** | First entry in Decor & Styling → Custom Design | (existing service) |
| **Save-the-Date Video MP4** | First entry in Stationery → Save-the-Date | [0024](../0024_save_the_date/0024_save_the_date.md) |
| **AI Edited Highlight** | Position 3-5 in Videographers default results | (existing service via 0011/0012 stack) |

**Total: 8-9 SETNAYAN SERVICE entries** surfacing as first-class marketplace listings.

### Setnayan AI wizard coverage (added 2026-05-24)

Every Setnayan paid service now has a dedicated wizard card in Setnayan AI, surfacing the SKU inside the host's planning carousel (not just inside the marketplace search):

| Service | Iteration | Wizard card | Position |
|---|---|---|---|
| Monogram (free + Bespoke ₱2,999) | [0037](../0037_bespoke_monogram/0037_bespoke_monogram.md) | `monogram` | 7 |
| Mood board (free) — inspiration | [0010](../0010_mood_board/0010_mood_board.md) | `mood_board` | 15 |
| Mood board (free) — rendered approval | [0010](../0010_mood_board/0010_mood_board.md) | `rendered_mood_board` | 17 |
| Pakanta (₱1,999-₱9,999) | [0036](../0036_pakanta/0036_pakanta.md) | `pakanta` | 19 |
| LED Background / Pailaw | [0005](../0005_led_background_maker/0005_led_background_maker.md) | `led_background` | 22 |
| Save-the-Date Video (₱199/render) | [0024](../0024_save_the_date/0024_save_the_date.md) | `save_the_date_video` | 32 |
| Website upgrades (Monogram Hero ₱1,999 + Live Schedule ₱999) | [0004](../0004_invitation_widgets/0004_invitation_widgets.md) | `website_upgrade` | 28 |
| Papic | [0012](../0012_papic/0012_papic.md) | `papic` | 29 |
| Panood | [0011](../0011_panood/0011_panood.md) | `panood` | 30 |
| Patiktok | [0017](../0017_patiktok/0017_patiktok.md) | `patiktok` | 31 |
| Same-Day Edit (₱9,999+) | [0011](../0011_panood/0011_panood.md) SDE | `same_day_edit` | 33 |
| Paprint | [0050](../0050_paprint/0050_paprint.md) | `paprint` | 53 |
| AI Highlights (₱999 / ₱2,999) | (post-event vision-AI) | `ai_highlights` | 60 |
| Couple Keepsake Bundle (₱2,499) | [0046](../0046_wedding_showcase/0046_wedding_showcase.md) Keepsake | `keepsake_bundle` | 61 |

**Marketplace insert pattern stays intact** — couples can still discover these services via the marketplace listings table above; the wizard adds a SECOND discovery path through the active-planning carousel.

**Host-task wizard cards (NOT vendor categories)** — for completeness: the wizard also includes 6 host-action cards that are not vendor taxonomy entries: `food_tasting` (12) · `song_list` (25) · `complete_guest_list` (36) · `gap_fill_guest_list` (40) · `gift_registry` (37) · `wedding_rehearsal` (55). These are couple-actions captured in the planning flow but don't surface in the vendor marketplace.

---

## 5. Faith activation cross-cutting timeline

Driven by `wedding_type_launch_status` table from [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md). Couples picking inactive faiths see "Coming Soon" + email capture; vendor compat tags ship from day 1 so non-Catholic vendors can pre-seed.

| Phase | Faith activated | Vendor recruitment target |
|---|---|---|
| **V1.1** | Catholic + Civil | Already have via vendor visibility states |
| **V1.2** | Christian (Born Again / Evangelical / Protestant) | 15-20 pastors across Manila, Cebu, Davao |
| **V1.3** | INC (Iglesia ni Cristo) | 10-15 INC ministers + 10 alcohol-free caterers + 5 INC-photographers + 5 INC-coordinators |
| **V1.4** | Muslim (region-by-region: BARMM → Metro Manila → other major cities) | 15-20 Imams + 10 halal caterers + 5 modest-attire designers + 3 Kulintang ensembles per region |
| **V1.5+** | Cultural / Folk (per-tribe per demand signal from email captures) | Variable; smallest market |

### Faith-specific category gating

These sub-categories DO NOT surface in marketplace until their parent faith activates:

| Sub-categories | Activates with |
|---|---|
| #137-139 (Christian pastors) | V1.2 Christian |
| #136 (INC Minister), #144 (INC Counseling), #156 INC half (Tabernakulo Coordinator), #157 (INC Coordinator), #86 (Modest INC Bridal), and the recruited INC-compatible photographers/coordinators | V1.3 INC |
| #34 (Halal Catering — surfaces as visible category but vendor pool gates), #85 (Modest Muslim Bridal), #87-89 (Maranao/Tausug/Yakan attire), #108 (Muslim Henna), #129 (Maranao Okir Décor), #140 (Muslim Imam), #145 (Muslim Pre-Wedding Counseling), #155 (Gender-Separated Coordinators), #156 Muslim half (Mosque Coordinators), #158 (Mahr Coordination), #19 (Kulintang Ensemble) | V1.4 Muslim |
| #141 (Cultural Tribal Elder), #20 (Rondalla), #21 (Folk Performers), and tribe-specific sub-categories | V1.5+ Cultural |

---

## 6. PH-specific moat list (categories WedMeGood structurally lacks)

38 categories that constitute Setnayan's structural moat — categories impossible to replicate without deep PH wedding-industry knowledge and local vendor recruitment:

| # | Category | Why WedMeGood lacks |
|---|---|---|
| 15 | Pre-Nup Shoot Locations | Scenic-density specific to PH (El Nido, Siargao, etc.) |
| 19 | Kulintang Ensembles | Muslim Mindanao instrumental music |
| 20 | Rondalla Ensembles | PH traditional ensemble |
| 21 | Folk Performers | Igorot, Sagala, Cordillera, etc. |
| 28 | Entourage Choreographer | PH wedding entourage entry dance tradition |
| 30 | Pre-Cana Dance Trainer | PH Catholic-tradition specific |
| 32 | Lechonero | Whole-pig lechon is PH wedding headline dish |
| 42 | Halo-Halo Station | Filipino dessert |
| 47 | Mini Lechon Station | Booth-scale PH dish |
| 81-83 | Filipiniana Terno / Maria Clara / Balintawak | PH traditional bridal attire |
| 84 | Sponsor Attire — Ninang Sets | PH sponsor entourage |
| 87-89 | Maranao / Tausug / Yakan Wedding Attire | PH Muslim ethno-cultural |
| 92-93 | Barong Tagalog Custom + Rental | PH traditional male attire |
| 97 | Sponsor Attire — Ninong Sets | PH sponsor entourage |
| 108 | Muslim Henna Artist | PH Muslim style distinct from Indian mehndi |
| 119 | Sponsor Corsages | PH wedding sponsor tradition |
| 127 | Capiz / Native Décor Specialists | Locally-sourced PH materials |
| 128 | Hacienda / Heritage Décor | PH colonial-era heritage venues |
| 129 | Maranao Okir Décor Specialists | PH Muslim cultural motifs |
| 142-143 | Pre-Cana + CFO Seminar Facilitator | PSA-required pre-marriage seminars |
| 144 | INC Counseling Center | PH INC-specific |
| 145 | Muslim Pre-Wedding Counseling | PH Muslim-specific |
| 146 | Marriage License Expediting Service | PH bureaucracy-navigation |
| 147 | Apostille / DFA Authentication | PH for foreign-spouse marriages |
| 152 | Pamamanhikan Coordinators | PH family-meeting tradition |
| 153 | Despedida Planners | PH bridal-farewell tradition |
| 154 | Sponsor Coordinators (ninong/ninang) | PH wedding sponsor tradition |
| 156 | Tabernakulo / Mosque Coordinators | PH-specific religious venue coordination |
| 173 | Wedding-Day Weather Forecaster | Tagaytay-specialty service |
| 186 | Trousseau / Pasalubong Boxes | PH gift-giving tradition |
| 187 | Sponsor Tokens | PH sponsor entourage |
| 188 | Inaanak / Godchild Tokens | PH godchild tradition |
| 192 | Visa-Wedding Logistics | Fil-Am couples |

**~38 categories** that competitors entering PH would need years to develop.

---

## 7. Vendor recruitment plan per phase

### V1.1 base ship recruitment target (~6-8 weeks pre-launch)

For each of the 30 V1.1 base canonicals, target **5 vendors per top-3-region** (Metro Manila, Cebu, Davao) = **450 vendor slots minimum**. Time-box at ~20 vendors/week sustained → ~22 weeks total recruitment (~5.5 months). Start NOW; ahead of V1.1 launch.

### V1.1.x marketplace launch recruitment (per ~2-week launch)

Each marketplace launch requires **5 additional vendors per sub-category × top-3-region** before the launch trigger. Saturation rules from [0006](../0006_vendors_management/0006_vendors_management.md) handle thinner sub-regions gracefully.

### V1.2 expansion recruitment

Niche categories (Wedding-Day Weather Forecaster, Bug Repellent Stations, Filipiniana Designer) likely 1-2 vendors per region at launch. Density grows organically post-launch.

### Faith activation recruitment (cross-cutting)

Per [0043 phasing](../0043_wedding_type_picker/0043_wedding_type_picker.md):
- **Christian (V1.2)**: 20 pastors recruited via Christian church networks
- **INC (V1.3)**: 15 ministers + 10 alcohol-free caterers + 5 photographers + 5 coordinators — owner outreach to INC community
- **Muslim (V1.4)**: 15 Imams + 10 halal caterers + 5 modest-attire designers + 3 Kulintang ensembles — BARMM community trust required
- **Cultural (V1.5+)**: Per-tribe per demand signal

---

## 8. Critical sequencing decisions (locked)

1. **Stylist marketplace ships first in V1.1** — lowest engineering (reuses [0010 mood board palette engine](../0010_mood_board/0010_mood_board.md)), lowest cold-start (1 stylist can publish 10 mood boards in an evening), visual demo, low vendor recruitment burden. Don't second-guess.

2. **Food marketplace at V1.1.1 (not V1.1.6)** — halal_catering + mocktail_caterer are essential for INC/Muslim couples to even consider the platform when their faith activates. Tag visibility + vendor pre-seeding builds trust before activation flips.

3. **Stations & Booths at V1.1.6 (last in V1.1.x)** — largest single batch (~30 sub-types) and depends on Coffee Booth + Photo Booth + Patiktok being live. Save for after the easier launches.

4. **Faith activation order (Christian → INC → Muslim → Cultural) is locked** but flexible by region. Muslim BARMM rollout can lead Muslim Metro Manila if vendor density supports it.

5. **Pre-Nup Locations as new top-level category at V1.2** — structurally a venue category (not vendor); needs different schema treatment (per-location calendar + half-day/full-day rental rates). Worth a small dedicated iteration in V1.2.

6. **Niche logistics ship V1.2 not V1.1** — Wedding-Day Weather Forecaster, Bug Repellent Stations, Bridal Boat are low-frequency + high-risk-of-empty-marketplace at launch. Couples won't notice them missing in V1.1.

7. **Vendor compat tags ship from day 1 for all 7 faiths** — non-Catholic vendors can pre-seed before couple-side visibility flip. Crucial for cold-start mitigation.

8. **`canonical_services` schema versioning starts from V1.1 schema v1** — additions don't require migrations; vendors re-validate against their `schema_version_at_fill` on next edit.

---

## 9. Cross-references

| Reference | Where |
|---|---|
| Source-of-truth `canonical_services` enum | [0006_vendors_management § 69-104](../0006_vendors_management/0006_vendors_management.md) |
| Two-axis wedding-type picker | [0043_wedding_type_picker](../0043_wedding_type_picker/0043_wedding_type_picker.md) |
| Per-category attribute schemas | [0044_per_category_schemas](../0044_per_category_schemas/0044_per_category_schemas.md) |
| Product-level catalogs | [0045_product_catalogs](../0045_product_catalogs/0045_product_catalogs.md) |
| Wedding Showcase faceting | [0046_wedding_showcase](../0046_wedding_showcase/0046_wedding_showcase.md) |
| Style-driven marketplaces (filter UX + 5-col mega-menu) | [0047_style_driven_marketplaces](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) |
| Iteration connection map (V1.1 § 7) | [00_Iteration_Connection_Map § 7](./00_Iteration_Connection_Map.md) |
| Code-shipped audit | [App_Build_Status.md](../App_Build_Status.md) |
| Vendor compat tags + saturation rules | [0006 § canonical_services + § vendor saturation](../0006_vendors_management/0006_vendors_management.md) |
| Existing in-app services that become SETNAYAN SERVICE inserts | [0005](../0005_led_background_maker/0005_led_background_maker.md), [0011](../0011_panood/0011_panood.md), [0012](../0012_papic/0012_papic.md), [0017](../0017_patiktok/0017_patiktok.md), [0024](../0024_save_the_date/0024_save_the_date.md), [0036](../0036_pakanta/0036_pakanta.md) |

---

## 10. Presentation pattern · Creations vs Locked (locked 2026-05-24)

**Lock context.** Owner directive 2026-05-24 closing a multi-turn architectural conversation: vendor categories split into two distinct presentation patterns based on how the vendor's offering is shopped, NOT based on what the vendor sells. Grid layout, search, filter, lock CTA, and compare flow are identical across all categories — what differs is the per-vendor TILE CONTENT (one hero photo vs multi-photo portfolio carousel).

### The two patterns

**Pattern A · Creations** — vendor sells *multiple curated services* that act as portfolio cards. Couples scroll the vendor's range, pick "this look" / "this menu" / "this song set," and what gets locked is one specific service inside the vendor's catalog (backed by `vendor_services` from [iteration 0045](../0045_product_catalogs/0045_product_catalogs.md)). Vendor tile in the grid surfaces 3–5 service photos cycling (auto-rotate on hover · 2×2 collage · or primary + thumbnail strip — final treatment TBD on the V1.1 multi-photo PR).

**Pattern B · Locked presentation** — vendor sells one fixed offering (a physical space, a person, a single rig, a single setup). One photo per vendor in the grid; locking the vendor locks the whole thing.

### Category assignment

| Pattern | Categories |
|---|---|
| **Creations** | Photographer · Videographer · Same-Day Edit editor · Prenup shoot specialist · Stylist · Florist · Catering · Cake / desserts · Attire (gown · suit · shoes · entourage · parents) · HMUA · Live band · Acoustic performer · Choir / string quartet · DJ · Host / MC · Choreographer · Live painter · Calligrapher · Magician / entertainer · Invitation designer · Stationery / signage · Souvenirs / favors · Rings / jewelry · STD video editor |
| **Locked** | Reception venue · Ceremony venue (church / mosque / INC chapel / civil registrar) · Officiant · Accommodation / hotel · Photobooth (per sub-tag — classic · mirror · 360 · polaroid · slow-mo) · Mobile bar (per sub-tag — cocktail · coffee · perfume · dessert · juice · tea) · Pyrotechnics / cold sparklers · Lights + Sound rig · Wedding coordinator (tier-based packages, not creations) · Drone operator · Bridal car · Inflatable / kids rentals |

### Filter approach per pattern (locked 2026-05-24)

| Filter family | Pattern + cards | Rationale |
|---|---|---|
| **Region → City cascade** | Pattern B vendors with fixed address (Reception · Officiant when parish-bound · Stylist hub-city V1.x) | Vendor has a physical address that doesn't move; couples shop by region first when city isn't decided |
| **Distance from Reception (10km initial · stepper)** | Pattern B vendors anchored to Reception (Ceremony · Accommodation · Lights+Sound · Mobile Bar · Photobooth · Pyro · Drone) | Reception is already locked by the time these render; proximity matters for day-of logistics |
| **Reviews-first · no geographic filter** | All Pattern A vendors + Pattern B vendors who travel routinely (Bridal Car · Coordinator) | Vendors travel; portfolio + reviews + sample work matter more than km from venue |

### V1 vs V1.1 split

- **V1 (current state · this lock)** — grid layout, search, filter, lock CTA, compare flow all uniform across categories. Tile renders ONE photo per vendor regardless of pattern.
- **V1.1 (follow-up PR)** — Pattern A vendor tiles upgrade to 3–5 photo carousel/collage sourced from `vendor_services.primary_photo_r2_key`. Pattern B vendor tiles unchanged (1 hero photo).

The grid primitive (`VendorPickGridCard`) is pattern-agnostic — the tile component branches based on `vendor.presentation_pattern` resolved from a new column added to `vendor_profiles` (or derived from category) in the V1.1 PR.

### Cross-reference

- [Iteration 0045 Product Catalogs](../0045_product_catalogs/0045_product_catalogs.md) — provides the multi-service schema (`vendor_services`) that powers Pattern A tile content
- [Iteration 0006 Vendors Management § canonical_services + § vendor saturation](../0006_vendors_management/0006_vendors_management.md) — saturation rules (hard-single · soft-single · multi) are orthogonal to presentation pattern; a vendor can be Pattern A (creations) AND soft-single (one lock per event) at the same time
- [CLAUDE.md decision log 2026-05-24 "Creations vs Locked spec lock"](../CLAUDE.md) — canonical lock row with full table + filter approach

---

## 11. Maintenance log

| Date | Change | Affected |
|---|---|---|
| 2026-05-19 | Initial consolidation. Taxonomy + phasing + recruitment plan locked across 192 sub-categories spanning V1.1 → V1.5+. Sourced from session work 2026-05-18 → 2026-05-19. | Whole doc |
| 2026-05-19 | Cross-reference note added: V1.2 introduces multi-moderator event access ([0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md)) + multi-payer cart ([0049](../0049_multi_payer_cart/0049_multi_payer_cart.md)). Vendor taxonomy + phasing unchanged; couples can now have multiple moderators (parents · sponsors · maid of honor · etc.) each able to add to cart and pay independently. Vendor profile + onboarding unchanged by V1.2 (vendor sees event context, not individual moderator context). Affects how couples + moderators interact with the marketplace + Wedding Showcase, not the taxonomy itself. | § 9 Cross-references (this row) |
| 2026-05-24 | **Presentation pattern lock** — categories split Creations (multi-service portfolio · 3–5 photo tile · V1.1 upgrade) vs Locked (single hero · 1 photo tile · V1 current). Filter approach also locked: Region→City cascade for fixed-address Pattern B · Distance from Reception for Reception-anchored Pattern B · Reviews-first for Pattern A + travelling Pattern B. | New § 10 + this row |

When updating this doc:
- New sub-category → append row in matching column section + bump column total + update grand total
- Phase shift → update phase column + cumulative tally table
- Faith activation → strike-through "Coming Soon" markers + update faith activation timeline
- Re-numbering → if # collisions, re-number in sequence from 1; cross-references in iteration specs update accordingly
- New presentation-pattern category → append to the matching cell in § 10 + add maintenance log row
