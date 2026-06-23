# Iteration 0047 — Style-Driven Vendor Marketplaces (per-category filter UX)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **The 7 bespoke style-driven marketplaces are NOT built** — there are **no** `/vendors/{stylists,food,photography,music,attire,hosts,stations-booths}/` routes, no palette-ΔE stylist matching, no edit-aesthetic mood wall, no host voice-clip preview, and no Stations & Booths category surface. What ships is a **single `/vendors` browse** + `/vendors/categories` + `/vendors/compare`, with the primary couple-facing search living **in-dashboard** at `/dashboard/[eventId]/vendors`.
> - **Filters are GENERIC, not per-category** — the shipped filter drawer (`app/vendors/_components/filter-drawer.tsx`) exposes City + Sort + Verified-only + Match-my-wedding (ceremony/venue) + Show-all-venues + folder/category, not silhouette/neckline/fabric/booth-type/etc. Per-category matching depth comes from the 6-dim `lib/compat-score.ts` GATE+SCORE, not bespoke filter UX.
> - **No 5-column vendor mega-menu** component exists.
> - **SETNAYAN SERVICE inserts** — the `is_setnayan_service` flag IS wired in browse + the in-dashboard plan/budget accordion; first-party services surface as supplementary listings (per the locked "in-app services = vendor listings" model), but the named placements in the mega-menu table are aspirational.
> - **"Setnayan Concierge" SETNAYAN-SERVICE row is stale** — the planner SKU is **Setnayan AI ₱1,499**, and the couple-app planner wizard is retired.
> - **Showcase discovery hooks (0046) are absent** — every "Used at N real weddings" / inline real-wedding card depends on the unbuilt 0046 showcase + unbuilt 0045 product catalog, so they don't render. Commission is **0%**; vendor↔customer money is **off-platform**.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0047
**Topic:** Per-canonical-service vendor marketplaces with category-appropriate filter UX, replacing the generic "all vendors" browse with structured search surfaces tailored to each canonical_service
**Surface:** Public + couple-side vendor browse routes (`/vendors/[category-slug]/`); homepage 5-column vendor mega-menu; per-category landing pages
**Status:** Drafted 2026-05-18 · V1.1 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.1 — Stylist marketplace ships first (sequence rationale below); other marketplaces roll out V1.1.x in defined order
**Builds on:** 0006 (vendors + canonical_services + saturation rules), 0015 (public website nav + routing), 0043 (ceremony_type drives default filters), 0044 (per-category schemas declare filter facets), 0045 (product catalogs enable product-level filters), 0046 (showcase appears as discovery hook in marketplace results)
**Consumed by:** 0006 (vendor browse routes), 0019 (couple-initiated chat from marketplace), 0034 (cart add from marketplace)
**Companion specs:** 0006, 0015, 0043, 0044, 0045, 0046

---

## What this iteration ships

A set of style-driven vendor marketplaces — one per canonical_service (or per logical category group) — where each marketplace has:

1. **Its own filter UX** rendered dynamically from the [0044](../0044_per_category_schemas/0044_per_category_schemas.md) per-category schema (silhouette pickers for gowns, edit-aesthetic mood walls for photography, song catalog search for bands, milk-options + drink-menu for coffee booths, etc.)
2. **Compound search** at both attribute and product levels (per [0045](../0045_product_catalogs/0045_product_catalogs.md))
3. **Smart-default filtering** based on couple's wedding type ([0043](../0043_wedding_type_picker/0043_wedding_type_picker.md)) — INC couples auto-see only `inc_friendly` caterers, Muslim couples auto-see only `halal_certified`+`halal_compatible` vendors, etc.
4. **Showcase integration** — discovery hooks appear alongside marketplace results ("Couples like you used these caterers — see their real wedding")
5. **SETNAYAN SERVICE badge inserts** — Papic appears in Photographers marketplace, Panood in Music & Entertainment, Pakanta in Music & Dance, etc., as first-class marketplace listings
6. **5-column vendor mega-menu** in the website header nav (desktop) / bottom-sheet drill-down (mobile)

The pattern: WedMeGood collapses everything into one generic `/vendors/` page with the same filters across all categories. Setnayan splits into category-specific marketplaces, each with its own filter UX, that share the underlying vendor data but render differently per category.

---

## The 7 primary marketplaces (V1.1 sequenced rollout)

| Order | Marketplace | Primary filter UX | Sequencing rationale |
|---|---|---|---|
| **1st** | **Stylist** (`/vendors/stylists/`) | Palette ΔE matching against mood boards · theme tags · past venues styled | Reuses existing [0010](../0010_mood_board/0010_mood_board.md) palette engine — no new ML needed. Lowest cold-start: 1 stylist can publish 10 mood boards in an evening. Visual-first → demos beautifully on homepage. |
| **2nd** | **Food (Catering + Lechonero + Live Cooking)** (`/vendors/food/`) | Cuisine specialties · faith-compatibility tags (Halal/INC/Kosher/etc.) · dietary accommodations · service style · product menu search | Highest pre-existing demand. Compound queries (faith + product) showcase structural moat vs WedMeGood. |
| **3rd** | **Photography / Video** (`/vendors/photography/`) | Edit aesthetic mood wall · deliverables · awards · response time SLA · past venues | Highest revenue category in PH weddings. Mood-wall UX is the differentiator (scroll-and-tap walls of edit aesthetics, no name-based search) |
| **4th** | **Band & Music** (`/vendors/music/`) | Song catalog product search (typed by wedding phase: processional / first dance / reception / party) · ensemble configuration · genre · religious repertoire compatibility | Reuses [0036 Pakanta](../0036_pakanta/0036_pakanta.md) song schema. Strongest "always helping" payoff — couples find specific songs they want played. |
| **5th** | **Gown / Suit / Filipiniana / Barong** (`/vendors/attire/`) | Silhouette · neckline · fabric · palette · service model (MTM/RTW/Rental) · sub-product (bridal/groom/bridesmaid/Filipiniana) | Most attribute-heavy category. Bundled with [0045](../0045_product_catalogs/0045_product_catalogs.md) product catalog (specific gowns in portfolio). |
| **6th** | **Host (Emcee)** (`/vendors/hosts/`) | Language (English/Tagalog/Cebuano/Taglish) · style archetype · voice sample audio clip preview · format experience · religious-service comfort | Voice-clip preview is the differentiator — couples decide on voice, not bio text. |
| **7th** | **Stations & Booths** (`/vendors/stations-booths/`) | Booth type (~30 sub-types in 5 groups) · footprint · power · output · attendant included · product menu search (drinks/desserts/etc.) | Entirely new category — PH cocktail-hour booth culture has no WedMeGood equivalent. See § Stations & Booths sub-categorization. |

V1.1.x defined as a series of marketplace launches at ~2-week cadence post-V1.1 base ship. Each marketplace launch is independent and self-contained.

---

## The 5-column vendor mega-menu (per WedMeGood pattern analysis)

Following the WedMeGood vendor mega-menu structure observed in session screenshots (5-column layout with category families), adapted with PH-specific categories and SETNAYAN SERVICE inserts:

### Column 1 — Capture (Visual)

- **Photographers**
  - Wedding Photographers
  - Pre-Nup Photographers
  - Engagement Photographers
  - **Setnayan Papic** `SETNAYAN SERVICE`
- **Videographers**
  - Wedding Videographers
  - Same-Day Edit (SDE) Specialists
  - **Setnayan AI Edited Highlight** `SETNAYAN SERVICE`
- **Drone & Aerial**
  - Drone Operators
- **Pre-Nup Locations** (NEW — per WedMeGood model)
  - Pre-Nup Shoot Locations (scenic spots for rent)

### Column 2 — Music & Entertainment

- **Music & Dance**
  - Wedding Bands
  - Acoustic Performers
  - Choirs / String Quartets
  - Kulintang Ensembles (Muslim weddings)
  - Rondalla Ensembles (Filipiniana / Cultural)
  - DJs & Wedding Entertainment
  - Choreographers (entourage / first dance)
  - **Setnayan Pakanta** `SETNAYAN SERVICE`
  - **Setnayan Panood** `SETNAYAN SERVICE`
- **Hosts (Emcees)**
  - Wedding Hosts

### Column 3 — Food & Beverage

- **Catering**
  - Catering Services
  - Lechonero
  - Live Cooking Stations
  - Halal Catering Specialists
  - Mocktail-Only / INC-Friendly Caterers
- **Stations & Booths** (NEW category — see § below)
  - Food & Beverage Stations
  - Sensory & Beauty Stations
  - Visual & Keepsake Booths
  - Skill & Craft Booths
  - Interactive Booths
  - **Setnayan Patiktok** `SETNAYAN SERVICE`
- **Cake & Dessert**
  - Wedding Cakes
  - Dessert Stations

### Column 4 — Look (Attire, Beauty, Decor)

- **Bridal Wear**
  - Bridal Gowns (Custom)
  - Bridal Gowns (Rental)
  - Bridesmaid Dresses
  - Filipiniana (Terno · Maria Clara · Balintawak)
  - Mother-of-Bride Gowns
  - Flower Girl Dresses
- **Groom Wear**
  - Wedding Suits / Tuxedos
  - Barong Tagalog (Custom)
  - Barong Tagalog (Rental)
  - Groomsman Sets
- **Beauty**
  - Bridal Makeup Artists
  - Family Makeup Artists
  - Hair Stylists
  - Bridal Grooming / Skincare
  - Henna / Muslim Wedding Henna
- **Decor & Styling**
  - Wedding Stylists
  - Decorators
  - Florists
  - **Setnayan Pailaw (LED Background)** `SETNAYAN SERVICE`
  - **Setnayan Custom Monogram** `SETNAYAN SERVICE`

### Column 5 — Ceremony, Coordination, Logistics

- **Ceremony**
  - Catholic Priests (officiants)
  - Civil Officiants (Judges / Mayors)
  - INC Ministers
  - Born Again / Evangelical Pastors
  - Muslim Imams
  - Cultural Officiants
  - Pre-Cana / CFO Seminar Facilitators
  - Pamamanhikan Coordinators
- **Planning & Coordination**
  - Wedding Planners (Full-Service)
  - Day-Of Coordinators
  - **Setnayan Concierge** `SETNAYAN SERVICE`
  - Sponsor Coordinators (ninong/ninang handling)
- **Logistics**
  - Bridal Transportation (specific vehicles)
  - Guest Shuttles
  - Generator Rental (garden weddings)
  - Tent / Outdoor-Cover Rental
  - Sound & AV Equipment
- **Stationery & Keepsakes**
  - Invitations (Print + Digital)
  - Souvenirs / Giveaways / Pamahiya
  - Wedding Rings
  - Sponsor Tokens
- **Travel & Honeymoon**
  - Honeymoon Planners
  - Destination Wedding Specialists

---

## Stations & Booths sub-categorization (NEW category)

Per session concept work: PH cocktail-hour booth culture is rich and WedMeGood structurally has no equivalent. ~30 sub-types organized into 5 groups:

### Food & Beverage Stations

| Sub-type | Notes |
|---|---|
| Coffee / Espresso Bar | Drink-menu products required (Spanish Latte, etc.) |
| Halo-Halo / Local Dessert Station | PH-signature |
| Ice Cream Cart | |
| Crepe / Pancake Station | |
| Cotton Candy Cart | |
| Cheese / Charcuterie Board | |
| Mini Lechon Station | Smaller-scale lechon for booth-style |
| Wine / Whiskey / Cigar Bar | Premium; NOT for INC/Muslim |
| Mocktail Bar | INC + Muslim friendly |
| Tea Ceremony / Tea Bar | Cultural/Buddhist contexts |

### Sensory & Beauty Stations

| Sub-type | Notes |
|---|---|
| Perfume Bar (custom blend) | Rising trend in PH |
| Henna / Temporary Tattoo Booth | Distinct from Muslim henna wedding tradition |
| Massage Chair Station | |
| Mini Nail Bar | |
| Hair Touch-Up Station | |
| Aromatherapy Station | |

### Visual & Keepsake Booths

| Sub-type | Notes |
|---|---|
| Photo Booth | Setnayan-internal photo booth product |
| 360 Booth | |
| GIF Booth | |
| Polaroid / Instax Booth | |
| Live Wedding-Portrait Painter | The "live painting" the owner mentioned |
| Caricature Artist | |
| Silhouette / Profile Artist | |
| Selfie Magic Mirror | |

### Skill & Craft Booths

| Sub-type | Notes |
|---|---|
| Live Calligraphy / Name Printing | On invitations, handkerchiefs |
| Custom Keychain / Magnet Engraving | |
| Live Embroidery (initials on handkerchief) | |
| Live Poetry Typewriter | |
| Tarot / Astrology Reading | Cultural sensitivity per faith |
| Palmistry Reader | Same |

### Interactive Booths

| Sub-type | Notes |
|---|---|
| VR / AR Experience Station | |
| Arcade / Retro Games | |
| LED Dance Floor | |
| **Patiktok (Setnayan TikTok Booth)** `SETNAYAN SERVICE` | First-class entry in this category |

Per [0044 schema](../0044_per_category_schemas/0044_per_category_schemas.md), booth filter UX has:
- **Booth type** (the 30 sub-types) — primary filter
- **Output** (digital / physical takeaway / experiential only)
- **Footprint** (mini / small / medium / large)
- **Power requirement** (battery / standard / industrial)
- **Attendant included** (yes / no / optional)
- **Hours of coverage**
- **Indoor / Outdoor / Both**

---

## Per-marketplace filter UX sketches

### Stylist marketplace (ships first — `/vendors/stylists/`)

Primary search: **palette ΔE matching**. Couple sets their palette in [0010 mood board](../0010_mood_board/0010_mood_board.md). Stylists publish mood boards (as products per [0045](../0045_product_catalogs/0045_product_catalogs.md)) with color tokens. Server computes ΔE distance per board vs couple's palette. Returns top-N matching boards + their stylists.

Filter sidebar:
- **Theme tags** — Boho / Modern / Traditional Filipino / Garden / Beach / Industrial / Vintage / Cultural-specific
- **Treatment specializations** (locked 2026-05-22 per [0044 `stylist_decorator`](../0044_per_category_schemas/0044_per_category_schemas.md)) — Ceiling / Wall / Surroundings / Tunnel
- **Past venues styled** — checkbox of PH wedding venues
- **Signature flowers** — for stylists who specialize in florals too
- **Service regions**
- **Price tier**

Result card:
- Stylist name + logo
- 2x3 grid of their mood boards (sorted by ΔE match to couple's palette)
- "Match score: 87% to your palette" badge
- "Visit profile · Pin stylist · Message" CTAs
- **"Professional Mood Board enabled"** badge if stylist holds render pack credits (per [0010 Professional Mood Board pay-per-render model](../0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator)) — signals to couples that this stylist can generate Composite Scene visualizations of their wedding

Couple flow: scroll → pin matching stylists → message with palette + board reference auto-filled ("I love your 'Tropical Boho' board for our garden wedding — let's chat"). If stylist has Professional Mood Board credits, message thread offers "Request a Composite Scene render" CTA → stylist consumes 1 render credit to generate AI-composited scene from couple's references + palette → couple receives in thread + refines via Color Range Manipulator.

**Professional Mood Board ships V1.1 parallel with this Stylist marketplace launch.** Locked 2026-05-22 (CLAUDE.md decision log row "Specialized Pro Tools architecture locked"). Pay-per-render pack pricing: **₱199 single · ₱8,999 / 50-pack · ₱24,999 / 150-pack** · NO subscription · no activation gate · stylist-mediated host access is the primary marketing positioning (*"Stop quoting clients ₱45,000+ for design renders — generate unlimited concept visualizations from ₱167/render. Win more bookings."*) per Cross-service engine reuse, the Composite Scene engine built for Mood Board also powers the future Florist bouquet visualizer · Attire try-on visualizer · Cake design from theme · Stationery AI invitation designer (5+ downstream Specialized Pro Tools SKUs amortize Mood Board's ~6-week engineering investment).

### Food marketplace (`/vendors/food/`)

Two-level search:
- Attribute level: cuisine specialties · faith-compatibility (auto-filtered per [0043 ceremony_type](../0043_wedding_type_picker/0043_wedding_type_picker.md)) · service style · headcount range
- Product level: specific dishes (Lechon, Pancit, Adobo, etc.)

Default behavior on landing:
- INC couples see `inc_friendly=TRUE` auto-applied with "Filtering for INC-friendly caterers · [Remove filter]" badge
- Muslim couples see `halal_certified OR halal_compatible` auto-applied
- Catholic / Civil / Christian couples see no faith filter applied

Filter sidebar:
- **Cuisine** — Filipino / Filipino-Chinese / Western / Japanese / Korean / Mediterranean / Halal-specialty / Fusion
- **Faith compatibility** — Halal-certified / Halal-compatible / INC-friendly / Kosher / Lenten-compliant
- **Dietary accommodations** — Vegetarian / Vegan / Gluten-free / Nut-free / Dairy-free
- **Service style** — Plated / Buffet / Family-style / Cocktail / Live stations / Lechon-focused
- **Headcount range**
- **Has tasting available**
- **Service regions**

Product search: "Find caterers that serve [Lechon Cebu / Crispy Pata / Halo-Halo / etc.]"

Compound query example: "Filipino caterers in Cebu that serve both Lechon AND Pancit AND have halal-compatible menus" → returns vendors matching all three predicates.

Result card:
- Caterer logo + name
- 3 sample product thumbnails (top dishes from their catalog)
- Faith tags as small badges
- Price tier indicator
- "Used at N real weddings" link to showcases ([0046](../0046_wedding_showcase/0046_wedding_showcase.md))

### Photography / Video marketplace (`/vendors/photography/`)

Primary search: **edit aesthetic mood wall**. Instead of name search, couples land on a wall of photo thumbnails representing different edit aesthetics. Tap a mood → filter to photographers with that aesthetic.

Mood-wall categories:
- Moody (dark, dramatic)
- Bright & Airy (light, ethereal)
- Fine Art (editorial, magazine-quality)
- Documentary (candid, photojournalistic)
- Editorial (high-fashion-style)
- Film Emulation (Portra, Kodak warmth)
- B&W Heavy (monochrome-leaning portfolios)

Filter sidebar:
- **Edit aesthetic** (primary)
- **Shooting style** — Photojournalistic / Posed / Cinematic / Candid
- **Deliverables** — SDE / Pre-Nup / Drone / Album / Reels
- **Awards** — Junebug / WPJA / ISPWP / MPA / PWP
- **Crew size**
- **Response time SLA**
- **Past venues** (couples can see "this photographer has shot at Pico de Loro")
- **Service regions**

Result card:
- Photographer logo
- 4-up grid of their best work (sorted by edit-aesthetic match)
- Awards badges
- "Available for [your wedding date]" status
- Showcase link if appeared in past Real Weddings

### Band & Music marketplace (`/vendors/music/`)

Primary search: **song catalog by wedding phase**. Couple is building their day-of timeline; types in song they want → bands who can play it appear.

Filter sidebar:
- **Wedding phase needed** — Processional / Ceremony / Recessional / Cocktail Hour / First Dance / Party / Last Song
- **Ensemble configuration** — Solo / Duo / Trio / Quartet / Full Band / String Quartet / Brass / Kulintang / Rondalla / Choir
- **Genre** — OPM / Pop / Jazz / Standards / Acoustic / Rock / Classical / Kundiman
- **Religious repertoire** — Catholic Liturgical / INC-Acceptable / Christian Worship / Muslim-Acceptable / Secular
- **Accepts song requests**
- **Service regions**

Product search: "Find bands that can play [song title]"
- Example: couple types "Perfect by Ed Sheeran" → bands with that song in their catalog appear, sorted by ensemble match (acoustic for romantic vibe, full band for party vibe)

Result card:
- Band name + logo
- Embedded audio sample
- Repertoire highlights (top 5 songs)
- "Plays 200+ songs in catalog · See full list →" link
- Ensemble configuration badge

### Gown / Suit / Filipiniana / Barong marketplace (`/vendors/attire/`)

Tabs per sub-product type (Bridal Gown / Groom Suit / Bridesmaid / Filipiniana / Barong / Mother-of-Bride / Flower Girl). Tab determines filter sidebar.

For Bridal Gown tab:
- **Silhouette** — A-line / Ball gown / Mermaid / Trumpet / Sheath / Tea-length
- **Neckline** — Sweetheart / V-neck / Halter / Illusion / Off-shoulder
- **Fabric** — Silk / Satin / Lace / Tulle / Chiffon / Piña / Jusi
- **Color palette** — Ivory / Champagne / White / Blush / Off-white / Custom
- **Service model** — Made-to-Measure / Ready-to-Wear / Couture / Rental
- **Showroom available**
- **Service regions**

For Filipiniana tab:
- Filipiniana sub-style — Terno / Maria Clara / Balintawak
- Fabric — Piña / Jusi / Embroidered
- Embellishments — Beadwork / Embroidery / Cultural motifs

Each tab's filter UX is derived from the corresponding canonical_service schema from [0044](../0044_per_category_schemas/0044_per_category_schemas.md).

Result card:
- Designer logo
- 4-up grid of their best gowns (sorted by silhouette + palette match to filters)
- Service model badge
- Showroom locations
- "Used at N showcases" link

### Host (Emcee) marketplace (`/vendors/hosts/`)

Primary differentiator: **voice sample audio clip preview**. Each host profile has a 60-sec voice clip embedded inline; couples tap-to-listen before any other engagement.

Filter sidebar:
- **Language** — English / Tagalog / Cebuano / Taglish / Multi-lingual (primary)
- **Style archetype** — Comedic / Formal / Warm-sentimental / Energetic-party / Cultural-traditional
- **Format experience** — Catholic / Civil / INC / Christian / Muslim / Garden / Beach / Destination / Multi-day
- **Audience size handled** — Intimate ≤50 / Standard 50-200 / Grand 200-500 / Huge 500+
- **Religious service comfort** — All faiths / Catholic only / INC only / Muslim only / Secular only
- **Service regions**

Result card:
- Host name + headshot
- Inline audio player (60-sec voice sample) — TAP TO PREVIEW PROMINENTLY
- Style archetype badge
- Languages spoken as chips
- Past notable events
- "Available for [your wedding date]" status

### Stations & Booths marketplace (`/vendors/stations-booths/`)

Filter sidebar:
- **Booth type** (30 sub-types organized by 5 groups) — primary
- **Output** — Printed prints / Digital share / Physical takeaway / Experiential only
- **Footprint** — Mini / Small / Medium / Large
- **Power requirement** — Battery / Standard 110V / Industrial 220V
- **Attendant included**
- **Hours typical**
- **Indoor / Outdoor / Both**
- **Service regions**

Product search (for product-catalog booths like coffee + mobile bar):
- "Coffee booths that serve Spanish Latte with oat milk"
- "Mobile bars that do Calamansi Margarita + Mocktail Bar"
- "Dessert stations with halo-halo + leche flan"

Result card:
- Booth vendor name + logo
- 3-up grid showing booth setup photos + sample output (printed strip / GIF / photo)
- Booth type chips
- Product menu highlights (top 5 items)
- Setnayan Patiktok appears as `SETNAYAN SERVICE` listing

---

## Smart-default filtering driven by event context

When a couple is logged in with an event set up via [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md), every marketplace auto-applies relevant filters:

| Event context | Auto-applied filters on every marketplace |
|---|---|
| `ceremony_type='inc'` | `inc_friendly=TRUE` on all consumable categories; `religious_service_comfort INCLUDES 'inc'` on host marketplace; `religious_repertoire INCLUDES 'inc_acceptable'` on music; mobile_bar hidden by default |
| `ceremony_type='muslim'` | `halal_certified OR halal_compatible` on consumables; `religious_service_comfort INCLUDES 'muslim'` on host; `ceremony_sub_type` filters ethno-cultural specialists; mobile_bar hidden |
| `ceremony_type='catholic'` | No restrictive defaults (most permissive); `officiant_type='catholic_priest'` on officiant marketplace |
| `ceremony_type='christian'` | `religious_service_comfort INCLUDES 'christian'` on host; `religious_repertoire INCLUDES 'christian_worship'` on music |
| `ceremony_type='civil'` | `officiant_type IN ('civil_judge', 'civil_mayor', 'civil_justice_of_peace')` on officiant marketplace |
| `venue_setting='garden'` | Surface garden-specialist florists / decorators / sound vendors prominently; generator + tent rental categories highlighted |
| `venue_setting='beach'` | Beach-specialist filters; sand-friendly decor; salt-air-aware equipment |
| `venue_setting='destination'` | `willing_to_travel_destination=TRUE` required on all vendors |
| `venue_setting='civil_registrar'` | Intimate-scale caterers (`headcount_range_max < 50`), specialty City Hall photographers |

Auto-filtered state shows as a removable badge above results: "Filtering for INC-friendly caterers · [Remove filter]". Couples can manually expand to all (with re-confirmation modal if expanding to incompatible categories).

---

## Showcase integration as discovery hook ([0046](../0046_wedding_showcase/0046_wedding_showcase.md))

Marketplace results pages include showcase hooks:

**Above-results hook:**
> "**3 real weddings used these vendors** in {Cebu}: [Maria & Juan's wedding](#) · [Anna & Carlo's wedding](#) · [Ivy & Ramon's wedding](#)"

**Inline showcase cards within results:**
- Every 6-8 vendor cards, a "Real Wedding" card appears: hero photo + couple names + "5 of these vendors served this wedding · See showcase"

**Side rail (desktop):**
> "Couples like you with similar palettes / themes / venues used these weddings as inspiration: [list of 3 showcases]"

The showcase becomes the **discovery hook** — couples find vendors via aspirational wedding browsing, not by searching vendor name. This is fundamentally different from WedMeGood's vendor-name-search model.

---

## SETNAYAN SERVICE badge inserts (per "Setnayan eats its own marketplace")

First-party services appear as marketplace listings with a distinct visual badge:

| Setnayan service | Lives in marketplace | Marketplace position |
|---|---|---|
| **Setnayan Concierge** | Planning & Coordination | Top of "Wedding Planners" results with SETNAYAN SERVICE badge |
| **Setnayan Papic** | Photographers | Inserted at position 3-5 in default Photographers results (not always first, to look authentic) |
| **Setnayan Panood** | Music & Entertainment | Top of "Wedding Entertainment" sub-section |
| **Setnayan Pailaw** | Decorators | Inserted in "Decorators" results with LED background filter |
| **Setnayan Patiktok** | Stations & Booths → Interactive Booths | First entry in Interactive Booths sub-category |
| **Setnayan Pakanta** | Music & Dance → Custom Songs (new sub-category) | First and only entry initially |
| **Setnayan Custom Monogram** | Decor & Styling | First entry in custom-design sub-section |
| **Setnayan Save-the-Date Video** | Stationery & Keepsakes | First entry in Save-the-Date sub-section |
| **Setnayan AI Edited Highlight** | Videographers | Inserted at position 3-5 in Videographers results |

Couples shopping for a photographer stumble into Papic. Couples shopping for a planner stumble into Concierge. The funnel does the work.

---

## Mobile UX

Per [Responsive UI default](../CLAUDE.md) feedback, every marketplace works on mobile with platform-appropriate patterns:

| Desktop pattern | Mobile equivalent |
|---|---|
| 5-column vendor mega-menu (header dropdown) | Bottom-sheet "Browse Vendors" drawer with collapsible category groups |
| Filter sidebar (left rail) | Bottom-sheet filter modal with "Apply filters" CTA |
| 4-up vendor card grid | 2-up grid for mid-sized phones; 1-up vertical scroll for narrow phones |
| Mood wall (photography marketplace) | Horizontal scroll-snap rows of mood thumbnails; tap → filter applied |
| Voice clip player (host marketplace) | Same inline player; auto-pause on scroll-off-screen |
| Side rail showcase hooks | Inline cards between every 4-5 vendor results |
| Compare 2-3 vendors side-by-side | Vendor compare via swipe-between-vendors with sticky-left attribute column (per WedMeGood pattern session analysis) |
| 5-column vendor mega-menu in nav | Single "Browse Vendors" button → opens bottom-sheet drawer; drill-down to categories |

Mobile shopping is dominant in PH (95%+ traffic) so this is a primary surface, not an afterthought.

---

## Marketplace landing-page structure (per category)

Each `/vendors/[category-slug]/` page follows a consistent structure:

1. **Hero** — Category name + 1-line value prop + smart-default filter badge if active
2. **Featured showcase hook** — "3 real weddings used these [category]" with thumbnails
3. **Filter sidebar / bottom-sheet** — category-specific filters from [0044](../0044_per_category_schemas/0044_per_category_schemas.md) schema
4. **Results grid** — vendor cards with category-specific surface (gowns show silhouette, photographers show edit aesthetic, etc.)
5. **Inline showcase cards** — every 6-8 results
6. **SETNAYAN SERVICE inserts** — naturally placed per § above
7. **Saturation gate** — per [0006 saturation rules](../0006_vendors_management/0006_vendors_management.md), max N results per page in dense markets
8. **Pagination + "Load more"** — infinite scroll on mobile, paginated on desktop

---

## SEO + URL structure

| URL pattern | Purpose | Indexed for |
|---|---|---|
| `/vendors/` | Master vendor catalog landing | "wedding vendors Philippines" |
| `/vendors/{category-slug}/` | Category landing | "wedding photographers Philippines" |
| `/vendors/{category-slug}/{region-slug}/` | Region-filtered category | "wedding photographers Cebu" |
| `/vendors/{category-slug}/{region-slug}/?theme={theme}` | Theme + region + category | "boho wedding photographers Cebu" |
| `/v/{vendor-slug}/` | Vendor profile | Vendor name + region searches |
| `/v/{vendor-slug}/products/{product-slug}/` | Specific product page | "Spanish Latte wedding coffee Manila" |
| `/real-weddings/{showcase-slug}/` | Showcase per [0046](../0046_wedding_showcase/0046_wedding_showcase.md) | Couple name + venue + theme searches |

Faceted filter combinations generate unique URLs that Google indexes as separate landing pages. This is the SEO surface area moat — Setnayan ranks for `cuisine × region × theme × ceremony_type` combinations WedMeGood doesn't have URL structure for.

---

## Marketplace ranking algorithm

Per-category ranking weighs multiple signals:

1. **Smart-default match** — vendors matching all active smart-default filters rank highest
2. **Profile completeness** ([0044](../0044_per_category_schemas/0044_per_category_schemas.md) `completeness_score`) — more complete profiles rank higher
3. **Product catalog depth** ([0045](../0045_product_catalogs/0045_product_catalogs.md)) — vendors with rich product catalogs rank higher
4. **Showcase appearances** ([0046](../0046_wedding_showcase/0046_wedding_showcase.md)) — vendors appearing in published showcases rank higher
5. **Verification tier** ([PR #56 vendor visibility](../CLAUDE.md)) — verified vendors rank above coming_soon
6. **Boosted Ads + Sponsored Boost** ([0006 section](../0006_vendors_management/0006_vendors_management.md)) — paid boosting integrated per existing rules
7. **Reviews + ratings** — average rating × review volume (with anti-spam from [0023](../0023_admin_console/0023_admin_console.md))
8. **Recency** — newer vendors get a launch boost (~30 days)
9. **Saturation rules** — once 20 vendors in a category × region cluster surface, density gates kick in per [0006](../0006_vendors_management/0006_vendors_management.md)

Setnayan SERVICE inserts use a different lane (don't compete on rank with third-party vendors; placed at deterministic positions 3-5 to look authentic without overwhelming).

---

## Phasing

**V1.1 base ship (~6-8 weeks post-pilot):**
- Schema + 5-column vendor mega-menu nav
- `/vendors/` master page
- **Stylist marketplace** ships first (`/vendors/stylists/`)
- Smart-default filtering wired up for all marketplaces (even unbuilt ones; surfaces "Coming Soon" empty states gracefully)
- Showcase hook integration ([0046](../0046_wedding_showcase/0046_wedding_showcase.md))
- SETNAYAN SERVICE badge framework

**V1.1.1 (~2 weeks later):**
- **Food marketplace** (`/vendors/food/`)
- Faith-compatibility filter UX
- Product search

**V1.1.2 (~2 weeks later):**
- **Photography / Video marketplace** (`/vendors/photography/`)
- Mood-wall UX
- Edit aesthetic filtering

**V1.1.3 (~2 weeks later):**
- **Band & Music marketplace** (`/vendors/music/`)
- Song catalog product search
- Wedding-phase filtering

**V1.1.4 (~2 weeks later):**
- **Gown / Suit / Filipiniana / Barong marketplace** (`/vendors/attire/`)
- Tabbed per sub-product
- Silhouette / neckline / fabric filters

**V1.1.5 (~2 weeks later):**
- **Host marketplace** (`/vendors/hosts/`)
- Voice clip preview UX

**V1.1.6 (~2 weeks later):**
- **Stations & Booths marketplace** (`/vendors/stations-booths/`)
- 30 sub-types organized by group

**V1.2:**
- Remaining vendor categories (Pre-Nup Locations, Logistics, Stationery, Ceremony officiants by faith, Cultural sub-categories)
- Vendor compare view (3-up desktop, swipe-with-sticky-attribute mobile)
- Faceted SEO landing pages auto-generated per filter combination

**V1.3+:**
- ML-driven personalized vendor recommendations
- Cross-category shopping bundles ("Couples who booked this caterer also booked these florists")
- AI-powered natural-language search ("Find me a moody photographer in Cebu under ₱100K who shoots beach weddings")

---

## Edge cases

1. **Empty results page.** When smart-default filters return zero vendors (e.g., a Muslim couple in a region without halal caterers yet), show a graceful empty state: "We're still building our Muslim wedding vendor catalog in {Region}. Tell us what you need + we'll prioritize recruiting." → routes to email capture from [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md).
2. **Couple changes smart-default mid-browse.** Removing the "INC-friendly" filter shows a re-confirmation modal: "Showing all caterers — note that some may not align with your INC wedding requirements. Continue?"
3. **SETNAYAN SERVICE clicked from marketplace.** Routes to the same vendor profile UI but with SETNAYAN SERVICE badge prominent; CTA changes from "Message vendor" to "Add to cart" (Setnayan services are direct-purchase).
4. **Vendor appears in multiple marketplaces** (e.g., a Filipino-Chinese caterer also offers Bartending). Multiple marketplace appearances; each surface uses the relevant attribute payload from [0044](../0044_per_category_schemas/0044_per_category_schemas.md).
5. **Marketplace launches with thin vendor pool.** Per V1.1.x sequencing, each marketplace launch only happens after the recruiting team confirms 20+ vendors live in the category. Saturation gates from [0006](../0006_vendors_management/0006_vendors_management.md) handle thinner sub-regions gracefully.
6. **Couple shopping pre-event-creation** (no wedding type set yet). Marketplace surfaces all vendors with no smart-default filtering; CTA at top: "Tell us about your wedding to see better matches → [Create event]".

---

## Open questions

1. **Marketplace launch order.** Sequencing above (Stylist → Food → Photo → Music → Attire → Host → Booths). Is this the right order, or should Food go first (highest demand)? Recommend Stylist first per concept rationale (lowest engineering, reuses palette engine, visual demo), then Food second.
2. **Per-region marketplace activation.** Should all marketplaces launch in all regions simultaneously, or stagger by vendor density? Recommend launch all-regions but display "Coming Soon — N vendors recruited" for thin regions.
3. **Compare view scope.** Side-by-side vendor compare is a known WedMeGood gap. Worth shipping in V1.1.x or defer V1.2? Recommend V1.2 — adds complexity and isn't on critical path.
4. **AI-powered natural language search.** Worth integrating at V1.3+? Recommend yes once base marketplaces stabilize; Haiku 4.5 from [0032](../0032_contract_intelligence/0032_contract_intelligence.md) likely cheap enough.
5. **Stations & Booths as separate marketplace vs sub-section under Music/Food.** Recommend separate — it's a coherent category in PH wedding culture and warrants its own surface (per session concept work).
6. **Pre-Nup Locations as a vendor category.** WedMeGood has this; recommend including in V1.2 with simple schema (location + photo gallery + booking calendar + half-day/full-day rates). PH has dramatically better scenic density than India for this.

---

## Cross-references

- Consumes: [0006](../0006_vendors_management/0006_vendors_management.md) (vendors + canonical_services + saturation), [0015](../0015_main_website/0015_main_website.md) (public website nav + routing), [0019](../0019_communications/0019_communications.md) (couple-initiated chat from marketplace), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart add from marketplace), [0043](../0043_wedding_type_picker/0043_wedding_type_picker.md) (smart-default filtering), [0044](../0044_per_category_schemas/0044_per_category_schemas.md) (filter UX schema source), [0045](../0045_product_catalogs/0045_product_catalogs.md) (product-level filters + cart line items), [0046](../0046_wedding_showcase/0046_wedding_showcase.md) (discovery hook integration)
- Provides: per-category marketplace surfaces + 5-column vendor mega-menu + Stations & Booths new category + SETNAYAN SERVICE inserts + marketplace ranking algorithm + faceted SEO URL structure
- Consumed by: couple browsing flow (entry to vendor profiles + product cart), vendor onboarding (vendors see "you'll appear in these marketplaces" preview)

---

## Decision log

- **2026-05-18 — Iteration drafted.** 7 primary marketplaces sequenced V1.1.x with Stylist first (lowest engineering, reuses [0010 palette engine](../0010_mood_board/0010_mood_board.md)). 5-column vendor mega-menu adopted from WedMeGood pattern (session screenshot analysis). Stations & Booths as new category (30 sub-types in 5 groups) — PH-cocktail-hour culture has no WedMeGood equivalent. SETNAYAN SERVICE badge inserts per "Setnayan eats its own marketplace" pattern — Papic / Panood / Pailaw / Patiktok / Pakanta / Concierge / Custom Monogram / Save-the-Date Video all become first-class marketplace listings. Smart-default filtering driven by [0043 ceremony_type](../0043_wedding_type_picker/0043_wedding_type_picker.md) — INC couples auto-see only `inc_friendly` caterers, Muslim couples auto-see only halal vendors. Mood-wall UX (photography) + voice-clip preview (host) + palette-ΔE matching (stylist) + song-catalog phase search (band) — each marketplace has its own differentiator filter pattern. Faceted SEO URL structure (`/vendors/{category}/{region}/?theme={theme}`) creates per-combination landing pages WedMeGood structurally lacks.
