# Service Specifications — detailed per-service (2026-06-02)

**Status:** design draft · owner-elicited · V1.x post-pilot · zero code. Folds into iteration **0044** (`canonical_service_schemas`) + the **Service Schedule & Quotation Flow** lock (2026-06-02). The owner-dictated tiles (Reception, Ceremony) are **LOCKED**; the rest are **PROPOSALS** for the owner to confirm / edit / override per real PH-vendor practice.

## The Universal Service Template (owner-proposed 2026-06-02 · v2)

ONE form every vendor fills, regardless of category. The per-category *variation* lives inside **ADVANCED** (drawn from a per-child-category **vocabulary** so it stays matchable) + **INCLUSIONS**. This template **is** the vendor's listing AND the skeleton of their quotation.

**1 · BASIC** *(universal — powers schedule, capacity, distance, base pax-pricing)*
- **Date(s)** — availability
- **Time** — coverage window
- **Starting Pax** — headcount the base package covers
- **Max Pax / capacity ceiling** — *capacity-bound services only (venue · catering · stations · shuttle · lights&sound)* → the hard filter
- **Additional Cost: ₱___ / pax** — per-head escalation above Starting Pax
- **Distance** — vendor enters **service area + travel radius + destination/travel fee**; Setnayan **computes the distance from the reception** (ground 0). *(Vendor doesn't type a distance — the couple sees it computed.)*

**2 · ADVANCED** *(the service identity + its variations)*
- **Parent Category → Child Category** — locks the tile (e.g. DOCUMENTARY → Photo & Video)
- **Details** — the child's **variation tags** from a curated **vocabulary** (e.g. Photo&Video → edit aesthetic + shooting style; Catering → cuisine + service style) **+ vendor-custom free additions**
- ⚠️ **Details must be tag-structured (from the child vocabulary), not pure free text** — otherwise onboarding can't reduce-to-a-number and search/filter/sort/match break. The per-tile detail below = that **vocabulary library**.

**3 · INCLUSIONS** *(what's IN this package — sub-items, repeatable)*
- `inclusion line` **(+) create variations** (e.g. "Album" → 20-page · 30-page · leather)
- **(+) add** more
- *Rule:* if an inclusion is itself a browsable category/tile → put it in **LINKED** instead.

**4 · LINKED SERVICES** *(other full categories bundled in — auto-cover those tiles)* — ✅ **BUILT 2026-06-09** (`vendor_service_links` + `vendor_services.is_linked_only`; couple card "✓ comes with X · Y · Z"; vendor "Comes with" picker; migration `20261014000000`, PR #1187)
- **Parent Category → Child Category (+) create variations** (e.g. Reception links FEAST → Catering)
- *Effect:* auto-tags that tile **"✓ included with {vendor}"** in the couple's plan.

**5 · FEES** *(repeatable line items → build the quotation + budget)*
- **Downpayment** — reservation amount (the schedule-lock signal)
- **Service Fee** — base package price *(can fold the downpayment)*
- **Transportation**
- **Food Allowance**
- **Excess Pax** — the per-head overage *(= BASIC's Additional Cost/pax — the rate lives in BASIC, this is the computed line)*
- **(+) add** as needed (corkage · ingress/egress · overtime · generator · …)

**6 · EXCLUSIVE SETNAYAN PERKS** *(the Setnayan in-app tool the vendor offers as a differentiator)*
- e.g. "Free Papic guest cameras" · "Setnayan AI included" · "Pakanta discount" · "Live Setnayan gallery delivery" · "Free Setnayan wedding-website setup"
- Ties to the vendor token economy + the "Recommend Setnayan Services" capability. **Open:** is the perk a Setnayan SKU the vendor *gifts/bundles* (who bears cost?), or a *capability flag* ("we deliver via Setnayan X")? — to settle.

**Always-on (every listing, behind the template):** price model · credentials (years · awards · features · **sample photos**) · verification status.

### What computes "best fit" — BASIC + ADVANCED + reviews

**BASIC + ADVANCED + reviews are the ranking inputs.** INCLUSIONS / LINKED / FEES / PERKS = the package + quotation, not the rank. They compose with the locked Vendor Match Personalization layered model. The critical split is **eliminate vs sort**:

**HARD filters (eliminate — must pass to even appear):**
- BASIC **Date** — available on the couple's candidate date(s) → the schedule gate
- BASIC **Max Pax** — fits the guest count *(capacity-bound services only)*
- Universal **service area** — covers the reception's region/distance
- ADVANCED **faith / dietary / cert** tags — halal · INC alcohol-free · required certs *(the only ADVANCED tags that filter)*

**SOFT signals (sort the survivors into best-fit order — never eliminate):**
- ADVANCED **Details** preference-match → "Matches your preference" floats above "More to consider"
- **Reviews** (rating + count) → Top-rated tier
- BASIC **Distance** from reception → Nearest tier
- BASIC **price / per-pax** → budget fit
- + Favorites + Boosted tiers on top

→ best-fit = pass hard filters → rank by **Favorites → Boosted → preference-match (ADVANCED) + Top-rated (reviews) + Nearest (distance) + budget fit**. Anyone available still **shows** (in "More to consider" / Expand) — soft signals sort, they don't hide good vendors.

---

## ADVANCED · Details vocabulary library (per child category)

The detail below is no longer 48 separate forms — it's the **vocabulary that populates ADVANCED's Details** (the variation tags) + suggests **INCLUSIONS** + typical **LINKED** + **FEES** per child category. `[LOCKED]` owner-dictated · `[0044]` schema drafted · `[PROPOSED]` for owner review.

---

## 1 · VENUE

### Reception Venue `[LOCKED — owner-dictated]`
- **Schedule:** Date · Time · **PAX** (capacity min/max — hard filter)
- **Match facet — venue type:** Hotel Ballroom · Events Place · Heritage House · Restaurant · Garden · Beach · Resort / Destination
- **Service option:** With Styling? → conditional **Ingress / Egress Fee** (load-in/out for outside suppliers)
- **Linked / inclusions:** usual package inclusions — catering (in-house / outside-allowed) · lights & sound · coordinator-on-the-day · tables & chairs · bridal suite · parking · generator
- **Fees:** Corkage Fee (cake / wine / food) · **Other Fees** (security bond · overtime per hr · extension)
- **Onboarding pick:** venue type + PAX

### Ceremony Venue `[LOCKED — owner-dictated]`
- **Schedule:** Date · Time
- **Match facet — venue type:** Church · Garden · Beach · Civil Registrar · Same as Reception
- **Linked / inclusions:** usual package inclusions
- **Specific:** Officiant (provided?) · Choir (provided?)
- **Fees:** **Other Fees** (parish/aircon donation · sound system)
- **Onboarding pick:** ceremony setting (from faith)

---

## 2 · PLANNING

### Coordinator / Planner `[0044 — wedding_coordination]`
- **Schedule:** Date · planning start window (how early they take a wedding on)
- **Match facet — coordinator type:** Full planning · Partial planning · On-the-day · Hybrid
- **Specific needs:** ceremony-type comfort (Catholic / Civil / INC / Muslim / Chinese / Mixed) · team size · brings own vendor network? · services [budget mgmt · vendor sourcing · timeline · RSVP · styling direction · day-of execution]
- **Linked / inclusions:** sometimes bundles styling, hosting, or a vendor roster
- **Fees:** package tiers · additional coordinator per head/hr · ingress
- **Onboarding pick:** service level

---

## 3 · FEAST

### Catering `[0044 — catering]`
- **Schedule:** Date · **PAX** (headcount min/max — hard filter)
- **Match facet — cuisine:** Filipino · International · Chinese · Asian · Spanish · Italian · Fusion · **service style** [plated/seated · buffet · food stations · family-style · cocktail]
- **Specific needs:** tasting (free/paid) · menu tiers · **dietary/faith** (halal-certified/-compatible · INC alcohol-free · vegetarian/vegan · allergen) · crew meals · equipment included (tables/chairs/linens/tableware) · mobile kitchen for no-kitchen venues
- **Linked / inclusions:** sometimes lights & sound, coordinator, cake
- **Fees:** per-pax · additional dishes · server count · corkage (if external) · lechon/premium add-ons
- **Onboarding pick:** cuisine + service style + dietary

### Cake `[0044 — wedding_cake]`
- **Schedule:** Date · delivery time
- **Match facet — cake style:** classic tiered · naked · buttercream · fondant · textured · floral · themed · geometric · minimalist
- **Specific needs:** flavor count · **alcohol in recipe** (INC-relevant) · max tiers · real vs dummy tiers · dietary (eggless · gluten-free) · cupcake/dessert-table add-on
- **Fees:** delivery · setup · stand rental
- **Onboarding pick:** style (from mood) + dietary

### Stations `[PROPOSED]`
- **Schedule:** Date · **PAX** (servings — hard filter)
- **Match facet — station type:** carving/lechon · pasta · sushi · taco · grill · dimsum · seafood · cheese & charcuterie · salad
- **Specific needs:** chef-attended? · servings count · setup footprint · power needs
- **Fees:** per-station · per-pax · server count
- **Onboarding pick:** station type(s)

---

## 4 · DESIGN

### Stylist / Decorator `[0044 — stylist_decorator]`
- **Schedule:** Date · setup/teardown time
- **Match facet — theme:** classic/timeless · modern · boho · rustic · glam · royalty/Bridgerton · Filipiniana · garden · minimalist · fairytale · **treatment** [ceiling/draping · walls/backdrop · aisle/surroundings · entrance/tunnel · stage · centerpieces]
- **Specific needs:** mood-board collab · props inventory · rental vs custom-build · scale (intimate vs grand)
- **Linked / inclusions:** sometimes florals, lights, furniture rental
- **Fees:** package by scale · ingress/egress · additional areas · rush
- **Onboarding pick:** aesthetic (from mood/feel)

### Florist `[0044 — florals]`
- **Schedule:** Date · delivery time
- **Match facet — arrangement types:** bridal bouquet · entourage bouquets · boutonnieres · corsages · ceremony arch/aisle · centerpieces · car flowers · hanging installations · **style** [garden/loose · structured · minimalist · lush · tropical]
- **Specific needs:** fresh-imported / fresh-local / preserved-dried / silk / mixed · in-season vs imported · sustainability
- **Fees:** per-arrangement · delivery · setup · dismantle
- **Onboarding pick:** floral style (from mood)

### Lights & Sound `[PROPOSED]`
- **Schedule:** Date · setup time
- **Match facet — services:** stage lighting · ambient/mood · uplighting · dancefloor lighting · spotlight/follow · LED par · moving heads · sound system · wireless mics · DJ booth · AV/projector · cold-spark/pyro · fog/haze
- **Specific needs:** scale (intimate/grand) · technician count · power/generator
- **Fees:** package by scale · additional fixtures · overtime · generator
- **Onboarding pick:** production scale

### Dance Floor `[PROPOSED]`
- **Schedule:** Date · setup time
- **Match facet — floor type:** LED dance floor · acrylic/glass · wooden parquet · white gloss · custom-printed monogram floor · mirror
- **Specific needs:** size (sqm) · with-lighting?
- **Fees:** per-sqm · delivery/setup · custom-print
- **Onboarding pick:** floor type

### Outdoor `[PROPOSED]`
- **Schedule:** Date · setup time
- **Match facet — equipment:** tents/marquee (clear · peaked · A-frame) · flooring/staging · cooling (industrial fans · aircon · misting) · heating · generator · portable comfort rooms · perimeter/draping
- **Specific needs:** capacity · weather contingency plan
- **Fees:** per-equipment · generator · contingency standby
- **Onboarding pick:** equipment needs

### Fireworks `[PROPOSED — new canonical]`
- **Schedule:** Date · show time
- **Match facet — effect type:** aerial fireworks · cold-spark/indoor · sparklers · fountain · confetti/CO₂ cannon · low-lying fog · flame
- **Specific needs:** duration · indoor-safe? · **PNP permit + licensed pyrotechnician** (cert — required)
- **Fees:** per-show · permit handling · standby
- **Onboarding pick:** effect type

### LED Wall `[PROPOSED — new canonical]`
- **Schedule:** Date · setup time
- **Match facet — screen:** size/sqm · resolution (P2.5 / P3 / P4) · indoor/outdoor
- **Specific needs:** content support [live feed · SDE playback · monogram/loop · slideshow] · operator included? · live-camera feed?
- **Fees:** per-sqm · operator · content prep
- **Onboarding pick:** size / use

### Digital Services `[NEW TILE — owner-dictated 2026-06-03 · Setnayan-first-party cluster]`
The DESIGN tile (Design's 8th) that gathers Setnayan's **digital / AI-generated productions** onto one marketplace shelf. The tile reads as generic — a future 3rd-party monogram designer, wedding-website builder, or LED-content studio could list here too — so it does *not* reintroduce a "Setnayan-branded" tier; at launch its membership is all first-party. Each member keeps its **own SKU intake** (this tile is the shelf, not a single quotation form).
- **Members:** Pakanta (custom AI wedding song) · Animated Monogram · Pro Website (premium invitation + event page + editorial) · Live Venue Photo Wall (live collage + live count) · Live Background / Pailaw (LED-wall design with monogram)
- **Match facet — production type:** custom song · monogram · wedding website · live photo wall · LED background
- **Specific needs:** per-member — song persona (0036) · monogram brief (0037) · website theme (0004) · photo-wall display mode · LED loop (0005); see each SKU's own spec
- **Fees:** per-SKU flat (no pax dependency)
- **Onboarding pick:** which digital production(s)
- **Moves (2026-06-03):** Pakanta in from PROGRAM · Animated Monogram in from Stylist / Decorator · Live Background in from LED Wall → **LED Wall now = 3rd-party LED video walls only**. Pro Website + Live Venue Photo Wall enter the marketplace here for the first time.

---

## 5 · PROGRAM

### Live Band `[0044 — band_live_music]`
- **Schedule:** Date · set times
- **Match facet — ensemble:** duo · trio · 4-pc · 5-pc · full band · with horns · **genres** [OPM · pop/top40 · jazz · acoustic · R&B · rock · classic/standards]
- **Specific needs:** ceremony-ready + reception-ready · song-catalog size · religious repertoire · learn-new-songs? · sound system included?
- **Fees:** package by hours/sets · additional set/hr · sound system
- **Onboarding pick:** music vibe

### Choir `[PROPOSED]`
- **Schedule:** Date · ceremony time
- **Match facet — type:** church choir · chamber · gospel · acoustic group · kids choir · **size**
- **Specific needs:** sacred/liturgical repertoire · denomination [Catholic mass parts · INC · Christian · ecumenical] · with-organist/instrumentalist · languages
- **Fees:** per-mass · additional songs · transport
- **Onboarding pick:** ceremony music style

### Orchestra `[PROPOSED — new canonical]`
- **Schedule:** Date · set times
- **Match facet — config:** string quartet · string ensemble · chamber orchestra · full orchestra · **repertoire** [classical · film scores · modern arrangements · OPM-orchestral]
- **Specific needs:** ceremony/reception · conductor included?
- **Fees:** per-set · by ensemble size
- **Onboarding pick:** ensemble size/feel

### Wedding Singer `[PROPOSED]`
- **Schedule:** Date · set/song times
- **Match facet — voice/genre + role:** processional · recessional · communion · first dance · reception sets
- **Specific needs:** with-own-accompaniment? · languages · special-request songs
- **Fees:** per-song · per-set
- **Onboarding pick:** vibe/role

### DJ `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — services:** reception DJ · party/after-party · ceremony music · MC-DJ combo · **genres**
- **Specific needs:** equipment (decks/speakers/lights) · mixing style · MC capability · request-handling
- **Fees:** per-hours · additional hour · lights add-on
- **Onboarding pick:** music vibe

### Choreographer `[PROPOSED]`
- **Schedule:** session dates + wedding date
- **Match facet — services:** first dance · couple's routine · entourage/grand march · surprise dance · prenup dance video · **styles** [contemporary · ballroom · hip-hop · traditional Filipino · theatrical]
- **Specific needs:** sessions count · location (studio/home)
- **Fees:** per-session · package
- **Onboarding pick:** dance style

### Performers `[PROPOSED]`
- **Schedule:** Date · slot
- **Match facet — act type:** magician · fire dancer · cultural/folk dance · acrobat · roaming sax/violin · stilt walkers · LED dancers · comedian · impersonator
- **Specific needs:** duration · indoor/outdoor
- **Fees:** per-act · per-hour
- **Onboarding pick:** act type

### Host / MC `[0044 — host_emcee]`
- **Schedule:** Date · program hours
- **Match facet — style:** formal/elegant · fun/energetic · comedic · storyteller · hybrid · **languages** [Tagalog · English · Taglish · Bisaya · …]
- **Specific needs:** format experience (Catholic / Civil / Chinese tea / Muslim) · audience sizes · program-flow prep · voice sample
- **Fees:** per-event · ingress · overtime
- **Onboarding pick:** hosting style

---

## 6 · DOCUMENTARY

### Photo & Video `[0044 — photography + videography]`
- **Schedule:** Date · coverage hours
- **Match facet — edit aesthetic:** true-to-color/classic · light & airy · dark & moody · film/analog · editorial/fashion · photojournalistic · **shooting style** [traditional/posed · candid/documentary · fine-art]
- **Specific needs — coverage:** wedding day · prenup/engagement · save-the-date · same-day edit · drone (CAAP permit) · second shooter · photo+video combo · **deliverables** [edited count · raw · album · prints · highlight reel · full film · online gallery] · crew size · turnaround/SLA · past venues
- **Fees:** package by coverage hours · additional hour · album · drone · SDE · second shooter · travel
- **Onboarding pick:** photo/video style + coverage inclusions
- **Papic add-ons (Setnayan · 2026-06-03):** **Guest Stories · SDE · Thank You Video** are sold as **add-ons to Papic**, not standalone tiles — they surface under the Setnayan Papic option inside this Photo & Video shelf.

### Editorial `[PROPOSED — mostly Setnayan + 3rd-party]`
- **Match facet — services (3rd-party):** real-wedding feature · blog feature · magazine submission · content/reels · social-media coverage
- **Specific needs:** turnaround · rights/usage
- **Onboarding pick:** n/a (Setnayan editorial is the default surface)

### Livestream `[PROPOSED — Panood is Setnayan; 3rd-party schema]`
- **Schedule:** Date · stream hours
- **Match facet — services:** multi-cam · single-cam · platform [YouTube · FB · Zoom] · recording · with-screen-at-venue
- **Specific needs:** camera count · operator included
- **Fees:** per-hours · additional camera
- **Onboarding pick:** coverage / cameras

---

## 7 · LOOK

### Bride's Attire `[0044 — bridal_gown_custom]`
- **Schedule:** booking date · **lead time** (custom) · fitting dates
- **Match facet — service model:** custom-made · rental · ready-to-wear · made-to-order · **gown type** [ball gown · mermaid/trumpet · A-line · sheath · fit-and-flare · tea-length · two-piece] · **Filipiniana** option (terno / Maria Clara)
- **Specific needs:** necklines · fabrics · embellishments · fittings count · alterations · veil/train · sizes (incl. plus/petite)
- **Fees:** gown price · additional fittings · rush · alterations · deposit
- **Onboarding pick:** acquisition + silhouette/tradition

### Groom's Attire `[PROPOSED — new canonical]`
- **Schedule:** booking date · lead time · fitting dates
- **Match facet — service model:** custom-tailored · rental · RTW · made-to-measure · **type** [tuxedo · suit (2/3-piece) · Barong Tagalog (jusi/piña/organza) · Filipiniana coat · cultural/sherwani]
- **Specific needs:** fabrics · fit · fittings count
- **Fees:** price · fittings · rush · alterations
- **Onboarding pick:** acquisition + suit-vs-barong

### Women's Attire (entourage) `[PROPOSED — entourage]`
- **Schedule:** booking date · lead time · fittings
- **Match facet — service model + roles:** bridesmaid · maid/matron of honor · mothers · ninang/principal sponsor · flower girl · **acquisition** [custom · rental · RTW] · Filipiniana option
- **Specific needs:** coordinated sets · color-match to palette · sizes (plus/petite/kids) · bulk
- **Fees:** per-piece · bulk discount · fittings
- **Onboarding pick:** acquisition + role set

### Men's Attire (entourage) `[PROPOSED — entourage]`
- **Schedule:** booking date · lead time · fittings
- **Match facet — service model + roles:** groomsman · best man · fathers · ninong · ring bearer · coin/bible bearer · **acquisition** [custom · rental · RTW] · barong vs suit
- **Specific needs:** coordinated sets · sizes (kids) · bulk
- **Fees:** per-piece · bulk discount · fittings
- **Onboarding pick:** acquisition + role set

### Filipiniana & Barongs `[cross-tile view — no own schema]`
Surfaces Bride's/Groom's/Women's/Men's attire vendors filtered by the **tradition facet**: terno · Maria Clara · Filipiniana gown · Barong (jusi/piña) · modern Filipiniana · Mindanao/cultural. Facet-driven; no separate fields.

### HMUA (Hair & Makeup) `[PROPOSED]`
- **Schedule:** Date · early-call time · trial date
- **Match facet — look:** natural/soft glam · full glam · classic · editorial · no-makeup-makeup · Asian/Korean · **morena-skin specialist**
- **Specific needs:** services [bridal · entourage · trial · airbrush vs traditional · lashes · extensions · on-site touch-up] · team size (entourage volume) · brands used · home-service/travel · trial included? · modest/religious considerations
- **Fees:** bridal rate · per-head entourage · trial · early-call fee · travel
- **Onboarding pick:** makeup look

### Grooming `[PROPOSED]`
- **Schedule:** Date / pre-wedding
- **Match facet — services:** groom haircut + styling · beard grooming · facial · manicure · on-site barber · grooming kit
- **Specific needs:** home-service?
- **Fees:** per-service · travel
- **Onboarding pick:** services needed

### Wellness & Fitness `[PROPOSED — pre-wedding]`
- **Schedule:** start window (weeks to wedding)
- **Match facet — focus:** bridal fitness/training · nutritionist/meal plan · spa/massage · facial/skincare · dental/whitening · derma/laser · slimming · IV drip · sauna
- **Specific needs:** package duration · home vs clinic
- **Fees:** per-session · package
- **Onboarding pick:** focus area

### Jewelleries & Accessories `[PROPOSED]`
- **Schedule:** order date · lead time (custom/engraving)
- **Match facet — item type:** wedding/engagement rings · bridal jewelry set · tiara/headpiece · veil · garter · brooch bouquet · hair accessories · cufflinks · men's accessories
- **Specific needs:** materials [gold · white gold · platinum · silver · gemstone · pearl · CZ] · custom vs ready · engraving · rental (tiara/veil)
- **Fees:** per-piece · custom · engraving · resize
- **Onboarding pick:** item type

---

## 8 · BOOTHS

### Mobile Bar `[0044 — mobile_bar]`
- **Schedule:** Date · hours
- **Match facet — bar type:** cocktail/mixology · beer · wine · whiskey · gin · rum · full open bar · signature drinks · **non-alcoholic option**
- **Specific needs:** bartender count · drink-menu count · alcohol licensing · branded/custom bar · consumption vs package · dietary (alcohol-free for INC/Muslim)
- **Fees:** per-hours · per-head · additional bartender · premium liquor · corkage
- **Onboarding pick:** bar type + dietary

### Coffee / Espresso `[0044 — coffee_booth]`
- **Schedule:** Date · hours
- **Match facet — milk options:** dairy · oat · almond · soy · lactose-free · **drinks** [espresso · latte · cappuccino · cold brew · seasonal/specialty]
- **Specific needs:** bean origin/specialty · cup branding/custom · barista count · footprint · with-pastries?
- **Fees:** per-hours · per-cup / unlimited · branding
- **Onboarding pick:** sub-type

### Mocktail `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — drink type:** fruit-based · mojito-style · slushies · smoothies · infused water · kombucha · juice bar
- **Specific needs:** alcohol-free guaranteed (INC/Muslim-friendly) · branding · menu count
- **Fees:** per-hours · per-head
- **Onboarding pick:** sub-type / dietary

### Food Truck `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — cuisine:** burgers · tacos · pizza · fries · hotdog · Korean · shawarma · ice-cream truck
- **Specific needs:** vehicle/setup space · servings · power needs
- **Fees:** per-hours · per-serving · minimum
- **Onboarding pick:** cuisine

### Dessert `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — dessert type:** donut wall · churros · cotton candy · ice-pops · chocolate fountain · candy buffet · halo-halo · taho · kakanin/native · macaron tower · grazing table
- **Specific needs:** servings · branding · dietary
- **Fees:** per-station · per-head
- **Onboarding pick:** dessert type

### Massage Chair `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — service:** massage chairs · on-site masseuse · foot spa · neck/shoulder · reflexology
- **Specific needs:** stations · duration
- **Fees:** per-hours · per-station
- **Onboarding pick:** service

### Food Cart `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — cart type:** fish ball/kwek-kwek · isaw/BBQ · taho · sorbetes/dirty ice cream · banana cue/camote cue · popcorn · cotton candy · samalamig/juice · nachos · fries · takoyaki · shawarma · kebab
- **Specific needs:** servings · cart count · branding
- **Fees:** per-hours · per-serving · per-cart
- **Onboarding pick:** cart type(s)

### Photo Booth `[0044 — photo_booth]`
- **Schedule:** Date · hours
- **Match facet — booth type:** classic enclosed · open-air · 360 video · mirror · GIF · slow-mo · green screen · vintage/analog · roaming/iPad
- **Specific needs:** output [unlimited prints · digital/QR · props · custom layout/monogram · guestbook · backdrop] · footprint · power · attendant · idle time
- **Fees:** per-hours · additional hour · custom backdrop · guestbook
- **Onboarding pick:** booth type

### Perfume Bar `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — format:** custom scent blending · perfume favors · scent station · branded bottles
- **Specific needs:** scents count · branding · take-home
- **Fees:** per-hours · per-head/bottle
- **Onboarding pick:** format

### Arcade / Games `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — game type:** retro arcade · claw machine · basketball arcade · racing sim · VR · foosball/billiards · giant lawn games · photo games
- **Specific needs:** units · power/space
- **Fees:** per-hours · per-unit
- **Onboarding pick:** game type

### Henna / Tattoo `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — art type:** henna/mehndi · temporary/airbrush tattoo · glitter tattoo · metallic flash
- **Specific needs:** artist count · designs
- **Fees:** per-hours · per-head
- **Onboarding pick:** art type

### Mini Nail Bar `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — service:** express manicure · nail art · mini pedicure · polish bar
- **Specific needs:** technician count · duration
- **Fees:** per-hours · per-head
- **Onboarding pick:** service

### Tarot / Astrology / Palmistry `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — reading type:** tarot · astrology/birth chart · palm reading · fortune-telling
- **Specific needs:** reader count · session length
- **Fees:** per-hours · per-reading
- **Onboarding pick:** reading type

### Caricature / Calligraphy / Painting (Live Art) `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — art type:** live caricature · digital caricature · live calligraphy (place cards/vows) · live event painting · portrait sketch · watercolor
- **Specific needs:** artist count · take-home output
- **Fees:** per-hours · per-head/piece · the painting itself
- **Onboarding pick:** art type

### Engraving / Embroidery `[PROPOSED]`
- **Schedule:** Date · hours
- **Match facet — personalization type:** on-site engraving (glass/metal/leather) · live embroidery (denim/tote/cap) · monogramming · favor personalization
- **Specific needs:** station/machine · per-piece time
- **Fees:** per-hours · per-piece
- **Onboarding pick:** personalization type

---

## 9 · PRINTS

### Printing `[PROPOSED — invitations + stationery + signage]`
- **Schedule:** order date · turnaround · min order
- **Match facet — products:** save-the-date · invitation suites · RSVP cards · programs/missalette · menu cards · place/escort cards · table numbers · seating chart · signage/welcome board · thank-you cards · guestbook · stickers/labels · monogram prints
- **Specific needs — style:** classic · modern · minimalist · rustic · luxe/foil · watercolor · Filipiniana · laser-cut · acrylic · **method** [digital · offset · letterpress · foil-stamp · laser-cut · UV] · paper stock · custom vs template design
- **Fees:** per-piece by quantity · design fee · rush · special finishes
- **Onboarding pick:** style + products

### Souvenir / Giveaways `[PROPOSED]`
- **Schedule:** order date · turnaround · min order
- **Match facet — product:** personalized favors · edibles (cookies/honey/coffee) · candles · fans · towels · plants/succulents · eco/native crafts · magnets · keychains · tumblers
- **Specific needs:** customization (monogram/names) · packaging
- **Fees:** per-piece by quantity · customization · packaging
- **Onboarding pick:** favor type

---

## 10 · TRANSPORT

### Bridal Car `[0044 — transportation_bridal_car]`
- **Schedule:** Date · coverage hours
- **Match facet — vehicle type:** luxury sedan (Mercedes/BMW) · vintage/classic · sports car · SUV · limousine · convertible · themed bridal car · motorcade
- **Specific needs:** specific vehicles · driver attire (formal/livery) · decoration (flowers/ribbons) · multiple-pickup
- **Fees:** per-hours · additional hour · decoration · extra stops · fuel/distance
- **Onboarding pick:** vehicle type

### Guest Shuttle `[0044 — shares transportation schema]`
- **Schedule:** Date · coverage hours
- **Match facet — vehicle type:** van/coaster · mini-bus · full bus · trolley/jeepney-themed · **capacity (seats)**
- **Specific needs:** trips/routes · multiple venues · driver
- **Fees:** per-unit · per-trip · per-hours · fuel
- **Onboarding pick:** capacity / route

### Escort `[PROPOSED]`
- **Schedule:** Date · coverage
- **Match facet — escort type:** motorcycle escort · security escort · traffic marshal · VIP escort · convoy lead
- **Specific needs:** units · coverage area/route
- **Fees:** per-unit · per-hours · distance
- **Onboarding pick:** escort type

---

## Gap status (what's locked vs proposed)

- **LOCKED (owner-dictated):** Reception · Ceremony
- **0044 schema exists (extended here):** Catering · Cake · Coordinator · Stylist/Decorator · Florist · Live Band · Host/MC · Photo & Video · Bride's Attire · Mobile Bar · Coffee · Photo Booth · Bridal Car · Guest Shuttle · Ceremony-officiant
- **PROPOSED (owner to confirm/edit):** Stations · Lights & Sound · Dance Floor · Outdoor · Fireworks · LED Wall · Choir · Orchestra · Wedding Singer · DJ · Choreographer · Performers · Editorial · Livestream · Groom's Attire · Women's Attire · Men's Attire · HMUA · Grooming · Wellness & Fitness · Jewelleries & Accessories · Mocktail · Food Truck · Dessert · Massage Chair · Food Cart · Perfume Bar · Arcade/Games · Henna/Tattoo · Mini Nail Bar · Tarot/Astrology · Caricature/Calligraphy · Engraving/Embroidery · Printing · Souvenir/Giveaways · Escort

## Next step

Once the owner confirms/edits these, this folds into **0044** schemas + a CLAUDE.md decision-log row, and then I seed **≥20 sample vendor services per tile** (different vendors · varied regions/prices · sample photos · facets filled) so we can test search · distance-from-reception · pricing · positioning · and personalization consistency.
