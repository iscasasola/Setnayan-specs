# Vendor Taxonomy — V1 / V1.1 → V1.5+ Master Reference

**Purpose.** Single canonical source for Setnayan's vendor taxonomy, mapping every searchable vendor sub-category to its target launch phase, marketplace surface, and category dependencies. Future iteration drafting + vendor recruitment + marketplace launch sequencing all reference this doc instead of re-deriving from individual iteration specs.

**Status.** Drafted 2026-05-19 · Consolidates session-locked taxonomy work from V1.5→V1 promotion (2026-05-18) + V1.1 content-engine spec drafting (2026-05-19) into one read-once reference.

**Authoritative iteration specs (this doc consolidates, doesn't replace):**
- [0006_vendors_management](../0006_vendors_management/0006_vendors_management.md) — canonical_services enum source-of-truth
- [0043_wedding_type_picker](../0043_wedding_type_picker/0043_wedding_type_picker.md) — ceremony_type × venue_setting axes that gate faith/cultural categories
- [0044_per_category_schemas](../0044_per_category_schemas/0044_per_category_schemas.md) — per-category attribute schemas + shared attribute groups
- [0045_product_catalogs](../0045_product_catalogs/0045_product_catalogs.md) — product-level entities for ~20 categories
- [0046_wedding_showcase](../0046_wedding_showcase/0046_wedding_showcase.md) — showcase taxonomy facets
- [0047_style_driven_marketplaces](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md) — 5-column vendor mega-menu + 7 marketplace launch sequence

**Maintenance.** When a new sub-category is added or a phase is shifted, update this doc + the source iteration spec in the same commit. When a faith activates (Christian → INC → Muslim → Cultural per [0043 phasing](../0043_wedding_type_picker/0043_wedding_type_picker.md)), strike-through "Coming Soon" markers here.

---

## 1. Top-level structure (5-column vendor mega-menu)

Adopted from WedMeGood pattern (per session screenshot analysis) and locked in [0047 § The 5-column vendor mega-menu](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md).

| # | Column | Couple-facing label | Marketplace route |
|---|---|---|---|
| 1 | **Capture** (Visual) | Photographers · Videographers · Pre-Nup Locations | `/vendors/photography/` + `/vendors/pre-nup-locations/` |
| 2 | **Music & Entertainment** | Bands · DJs · Hosts · Choreographers | `/vendors/music/` + `/vendors/hosts/` |
| 3 | **Food & Beverage** | Catering · Cake · Bar · Stations & Booths | `/vendors/food/` + `/vendors/stations-booths/` |
| 4 | **Look** (Attire / Beauty / Decor) | Bridal Wear · Groom Wear · Beauty · Jewelry · Decor | `/vendors/attire/` + `/vendors/beauty/` + `/vendors/decor/` |
| 5 | **Ceremony · Coordination · Logistics · Stationery · Travel** | Officiants · Planners · Logistics · Invitations · Honeymoon | `/vendors/coordination/` + `/vendors/logistics/` + `/vendors/stationery/` + `/vendors/travel/` |

Mobile pattern (per [Responsive UI default](../CLAUDE.md) feedback): single "Browse Vendors" bottom-sheet drawer with collapsible category groups, drill-down to sub-categories.

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

**Choreographers**
| # | Sub-category | Status | Phase |
|---|---|---|---|
| 28 | Entourage Choreographer | `[NEW]` `[PH-specific]` | V1.2 |
| 29 | First Dance Choreographer | `[NEW]` | V1.2 |
| 30 | Pre-Cana Dance Trainer | `[NEW]` `[PH-specific]` | V1.2 |

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

**Column 3 total: 44 sub-categories** (6 in V1.1 base / 5 in V1.1.1 / 28 in V1.1.6 / others gated by faith)

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

## 10. Maintenance log

| Date | Change | Affected |
|---|---|---|
| 2026-05-19 | Initial consolidation. Taxonomy + phasing + recruitment plan locked across 192 sub-categories spanning V1.1 → V1.5+. Sourced from session work 2026-05-18 → 2026-05-19. | Whole doc |
| 2026-05-19 | Cross-reference note added: V1.2 introduces multi-moderator event access ([0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md)) + multi-payer cart ([0049](../0049_multi_payer_cart/0049_multi_payer_cart.md)). Vendor taxonomy + phasing unchanged; couples can now have multiple moderators (parents · sponsors · maid of honor · etc.) each able to add to cart and pay independently. Vendor profile + onboarding unchanged by V1.2 (vendor sees event context, not individual moderator context). Affects how couples + moderators interact with the marketplace + Wedding Showcase, not the taxonomy itself. | § 9 Cross-references (this row) |

When updating this doc:
- New sub-category → append row in matching column section + bump column total + update grand total
- Phase shift → update phase column + cumulative tally table
- Faith activation → strike-through "Coming Soon" markers + update faith activation timeline
- Re-numbering → if # collisions, re-number in sequence from 1; cross-references in iteration specs update accordingly
