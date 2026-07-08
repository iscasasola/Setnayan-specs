# 0008 · 3D Plan — Booth Template Catalog · ALL 57 Leaf Categories (2026-07-08)

> Owner-locked: "we want ALL leaf categories to have a booth template" + unified mascot-smooth style +
> "avatars on the map" (every booth staffed by a mascot character). Companion to the Fable dossier +
> Tunnel catalog. Taxonomy source: `apps/web/lib/taxonomy.ts` (10 parents · 57 leaves).
>
> SYSTEM, not 57 bespoke builds: **9 shared CHASSIS** (one smooth rounded geometry set each) ×
> per-category **PROP KITS** × **STAFF MASCOT** (the shipped figure kit + staff outfit variants) ×
> **SIGNAGE** (vendor logo/name via the shipped BoothSign). All procedural, mascot-smooth
> (filleted edges, high segments, soft sheen), palette-aware, obstacle-disc registered.

## The 9 chassis

| Chassis | Form | Used by |
|---|---|---|
| COUNTER | front counter + canopy, back shelf | bars, coffee, desserts, perfume |
| STATION | worktable + equipment piece | catering, cooking, tech, crafts |
| RISER | low performance platform | band, choir, singers, MC |
| BACKDROP | frame + floor zone | photobooth, dance floor, LED wall, choreo |
| DESK | welcome table + display board | planning, tarot, artists, digital |
| DISPLAY | shelf / rack / dress-form vitrine | attire, jewelry, souvenirs, trophies |
| VEHICLE | mascot-proportioned vehicle body | food truck, carts, bridal car, shuttle, escort |
| CHAIR_STATION | service chair + tool cart | HMUA, barber, massage, nails, henna |
| GARDEN | greenery + structure | florist, outdoor |

## The 57 templates

| # | Leaf | Chassis | Signature props | Staff mascot · idle |
|---|---|---|---|---|
| **VENUE** |||||
| 1 | reception | DESK | ballroom maquette on table | venue manager, lanyard · presenting sweep |
| 2 | ceremony_venue | BACKDROP | mini chapel arch + pew pair | coordinator · candle light |
| **PLANNING** |||||
| 3 | coordinator | DESK | clipboard + timeline board | coordinator, headset · clipboard check |
| 4 | date_specialist | DESK | oversized calendar board | consultant · page flip |
| **FEAST** |||||
| 5 | cake | STATION | tiered cake on pedestal | pastry chef · piping swirl |
| 6 | catering | STATION | chafing-dish run + plate stacks | chef, whites + toque · cloche lift |
| 7 | stations | STATION | live wok/grill + flame flicker | cook · pan toss |
| 8 | crew_meals | STATION | packed-meal crates + warmer | server · box pass |
| **DESIGN** |||||
| 9 | stylist_decorator | DISPLAY | drape wall + swatch frames | stylist · fabric toss |
| 10 | florist | GARDEN | overflowing bloom cart | florist · bloom trim |
| 11 | lights_sound | STATION | console + speaker stacks + moving head | tech, one-ear headphones · fader slide |
| 12 | dance_floor | BACKDROP | glossy tile sample + LED edge | installer · tile place |
| 13 | outdoor | GARDEN | pergola + lanterns + turf roll | landscaper · lantern hang |
| 14 | fireworks | STATION | cartoon mortar rack + starburst sign | pyrotech · spark-puff thumbs-up |
| 15 | led_wall | BACKDROP | emissive LED panel (animated scroll) | tech · tablet swipe |
| 16 | digital_services | DESK | laptop + QR standee | tech · typing |
| **PROGRAM** |||||
| 17 | live_band | RISER | drum kit + guitar stands + mics | 3-piece mini-band · strum + drum |
| 18 | choir | RISER | 2-step riser + folders | 3 robed singers · sway |
| 19 | orchestra | RISER | music stands + cello | violinist · bow draw |
| 20 | wedding_singer | RISER | mic + monitor wedge | singer · mic sway |
| 21 | dj | STATION | deck console + vinyl crate | DJ, headphones · crossfade + head bob |
| 22 | choreographer | BACKDROP | dance-mark floor spots | choreographer · 5-6-7-8 count |
| 23 | performers | RISER | hoop + ribbon props | performer · ribbon swirl |
| 24 | host_mc | RISER | podium + cue cards | MC · card flip + gesture |
| **DOCUMENTARY** |||||
| 25 | photo_video | STATION | tripod camera + slider rig | shooter · crouch + shutter |
| 26 | editorial | DESK | magazine spread rack | editor · proof-page turn |
| 27 | livestream | STATION | multi-cam cart + emissive LIVE lamp | switcher op · cut press |
| **LOOK** |||||
| 28 | brides_attire | DISPLAY | gown on dress form | fitter, pin cushion · hem adjust |
| 29 | grooms_attire | DISPLAY | barong/suit on form | tailor · tape measure |
| 30 | womens_attire | DISPLAY | gown rack | stylist · hanger slide |
| 31 | mens_attire | DISPLAY | suit rack | tailor · lapel brush |
| 32 | filipiniana_barongs | DISPLAY | barong + terno pair, capiz accents | fitter · sleeve fluff |
| 33 | hmua | CHAIR_STATION | bulb mirror (emissive) + chair | MUA · brush dab |
| 34 | grooming | CHAIR_STATION | barber chair + cape | barber · clipper pass |
| 35 | wellness_fitness | STATION | mat roll + towel stack | trainer · stretch |
| 36 | jewelleries_accessories | DISPLAY | glass case + sparkles | jeweler, loupe · tray present |
| **BOOTHS** |||||
| 37 | mobile_bar | COUNTER | bottle shelf + shaker | bartender · shake |
| 38 | coffee_espresso | COUNTER | espresso machine + steam puff | barista · tamp |
| 39 | mocktail | COUNTER | fruit garnish tower | mixologist · pour arc |
| 40 | food_truck | VEHICLE | mini truck + awning window | cook at window · tray hand-out |
| 41 | dessert | COUNTER | donut board + tiered sweets | server · donut place |
| 42 | massage_chair | CHAIR_STATION | recliner pair | therapist · shoulder press |
| 43 | food_cart | VEHICLE | cart + umbrella | vendor · bell ring |
| 44 | photo_booth | BACKDROP | curtain frame + tripod + prop basket | photographer · wave-in + snap |
| 45 | perfume_bar | COUNTER | bottle organ display | perfumer · spritz puff |
| 46 | arcade_games | STATION | claw machine + mini hoop | attendant · token flip |
| 47 | henna_tattoo | CHAIR_STATION | low table + cushions | artist · hand stroke |
| 48 | mini_nail_bar | CHAIR_STATION | nail desk + polish rack | tech · polish stroke |
| 49 | tarot_astrology_palmistry | DESK | draped table + cards + crystal ball (envMap) | reader · card flip |
| 50 | caricature_calligraphy_painting | DESK | easel + sketch pad | artist · pen stroke |
| **PRINTS** |||||
| 51 | engraving_embroidery | STATION | hoop frame + engraver | artisan · stitch motion |
| 52 | printing | STATION | press + poster rack | printer · sheet lift |
| 53 | souvenir_giveaways | DISPLAY | gift-box shelf + ribbon | attendant · bow tie |
| 54 | trophies_awards | DISPLAY | gold trophy shelf (envMap glint) | engraver · polish wipe |
| **TRANSPORT** |||||
| 55 | bridal_car | VEHICLE | vintage mascot car + ribbon + cans | chauffeur, cap · door-open gesture |
| 56 | guest_shuttle | VEHICLE | mini bus front | driver · wave |
| 57 | escort | VEHICLE | motorcycle + cone | rider · helmet tuck |

## Build notes
- **Staff avatars** = the shipped figure kit + staff outfit variants (chef whites/apron/vest/robe/uniform — new `outfits.ts` entries) + 1 handheld prop each; idle clips are per-category 2-key loops on the existing pose system.
- **Multi-figure booths** (band/choir): 3 figures max, quality 'low'.
- **Emissive props** (mirror bulbs, LIVE lamp, LED wall, steam/spark puffs) become the bloom stars of cinematic Play.
- **Every template registers obstacle discs** (slice-3 system) and a tap target → the vendor card (menu/songlist per slice 4) → the ad CTA (booth-ads slice).
- Chassis + prop kits ship over 2 PRs: `3dplan-booth-chassis` (9 chassis + 20 highest-traffic categories) → `3dplan-booth-catalog-complete` (remaining 37).
