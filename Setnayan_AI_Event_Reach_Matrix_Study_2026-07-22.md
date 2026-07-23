# Setnayan AI — Event Reach Matrix (Category Isolation Study) · 2026-07-22

> Owner directive (2026-07-22): *"base it to what we can offer per event … we want to make sure that a debut cannot be done on a smaller event or a wedding cannot be completed on a specific event … each event holds a TRUE list of categories."* This study designs that true per-event-type category list (the "reach") so pricing rests on **offering, not planning duration** (duration dropped — the app compresses it). Grounded in the LIVE `service_categories` taxonomy (73 active leaves, pulled from prod 2026-07-22). Feeds the per-type price ladder (₱1,499/999/499/99/0, DECISION_LOG 2026-07-22) and the event-isolation build (populate `applicable_event_types`).

> **🔒 FINALIZED + BUILT 2026-07-22** — owner reviewed the full matrix and signed off with edits: booths reach **christening + gender-reveal**; christening carries **no band-heavy program**; **dinner date += cake**; **`livestream` removed** from the marketplace (= in-app Live Studio; `led_wall`/`photo_booth` kept); **`accommodation` → Travel + Wedding**; **Tournament AI price C → D (₱99)**, Travel stays C (itinerary engine). Shipped as migration `20270832295038_setnayan_ai_event_reach_matrix.sql` + `lib/setnayan-ai-type-pricing.ts`. Final reach (with edits) and the resolved decisions are in the sections below (superseding the first-draft numbers).

## Problem with today's taxonomy

Of 73 active leaves, **56 (77%) are `applicable_event_types = NULL` (universal)** — so every vendor-inclusive type "covers" 89–100% of the wedding set. The reach differences the pricing assumes are **not enforced**. This study replaces the universal flood with a **bounded true list per type**.

## The reach model

Each leaf is assigned the set of event types it TRULY serves (not "all"). A type's reach = the leaves whose set includes it. Design principles:

- **Wedding-exclusive ceremonials** never leak (marriage paperwork, bridal/groom attire, bridal car, honeymoon, wedding singer) → a wedding **cannot be completed** through any other event.
- **Rite-shared** (ceremony venue, officiants, counseling, choir) = wedding + christening only.
- **Formal-milestone** depth (orchestra, editorial, av/production, led wall, escort, date specialist, cotillion choreographer, crew meals) lifts Debut/Corporate above the casual events → a **debut cannot be done as a birthday/celebration**.
- **Travel** = its own reservation spine (tours, tour guide, hotel/restaurant reservation, travel insurance) — narrow but with the itinerary engine.
- **Light events** (Gender reveal, Dinner Date) hold only their true minimal set.

## The matrix (73 leaves → true type set)

Types: WED · DEB · COR · CHR · BDY · CEL · TRV · TRN · ANN · GRA · REU · GRV · DIN

**Wedding-only (6):** wedding_paperwork · brides_attire · grooms_attire · wedding_singer · bridal_car · travel_honeymoon
**Wedding + Christening (rite):** ceremony_venue · officiants · counseling_seminars · choir
**Travel-only (3):** tour_activity · tour_guide · travel_insurance · (restaurant_reservation = Travel + Dinner-Date)
**Sports (Tournament):** referee_official · personal_accident_insurance (+COR/BDY/TRV) · event_medic (+WED/COR) · trophies_awards (+COR/GRA)
**Corporate-lean:** speaker_talent (COR) · av_production (COR/WED/DEB) · editorial (WED/DEB/COR) · led_wall (WED/DEB/COR) · orchestra (WED/DEB/COR) · escort/date_specialist (WED/DEB/COR)
**Gender-reveal-only:** reveal_element
**Kids:** kids_entertainer (BDY/CHR)
**Broad-social** (WED DEB CHR BDY CEL ANN GRA REU ± COR/GRV): reception · catering · cake · host_mc · stylist_decorator · printing · souvenir_giveaways · coordinator · photo_video · florist · lights_sound · live_band · dj · performers · hmua · attire · stations · outdoor · guest_shuttle · the 15 party booths · etc.
**Dinner-Date (3):** restaurant_reservation · florist · souvenir_giveaways

_(The machine-checked full leaf→set mapping lives in the study script `reach.mjs`; transcribe into the migration when building.)_

## Computed reach (from the matrix above)

**SHIPPED + LIVE (migration `20270832295038` applied to prod 2026-07-22) — reconciled to the 14 REGISTERED `event_type_vocab` types:**

⚠ Correction on apply: the DB rejected `dinner_date` (NOT a registered event type — still a proposal), and the vocab contains **`gala_night`** (a registered type this study had missed — the type list was built from a migration grep, not the vocab). Fix: `dinner_date` dropped from the live matrix (its cake edit is deferred with the type itself); `gala_night` added with a **provisional reach = Celebration ∪ Corporate**.

| Event type | Leaves (true reach) | % of Wedding | AI price |
|---|---|---|---|
| Wedding | 62 | 100% | ₱1,499 |
| **Gala night** | 52 | **84%** | **₱999** (owner-locked — 84% reach is Debut-level) |
| Debut | 51 | 82% | ₱999 |
| Corporate | 47 | 76% | ₱999 |
| Anniversary | 42 | 68% | ₱499 |
| Birthday | 41 | 66% | ₱499 |
| Celebration | 41 | 66% | ₱499 |
| Graduation | 40 | 65% | ₱499 |
| Reunion | 39 | 63% | ₱499 |
| Christening | 38 | 61% | ₱499 |
| Gender reveal | 27 | 44% | ₱99 |
| Tournament | 15 | 24% | **₱99** (C→D) |
| Travel | 8 | 13% | ₱499 (itinerary engine) |
| _Simple event_ | 0 | — | ₱0 (no vendors) |
| **Date** (registered 2026-07-22) | 4 | 6% | ₱99 — romantic dinner/lunch/movie date · restaurant + florist + cake + souvenir |
| **Hangout** (registered 2026-07-22) | 4 | 6% | ₱99 — casual barkada get-together · restaurant + cake + souvenir + photos |

_The narrow "dinner_date" idea became two named types — **Date** (romantic) + **Hangout** (casual); "Outing" rejected (reads as travel). Registered via `event_type_vocab` (migration `20270902999627`). Full onboarding flow / bespoke terminology is later polish (both fall back to GENERIC_PROFILE for now)._

_(First-draft numbers before the owner edits were Christening 40% · Gender-reveal 19% · Travel 13% · Dinner-Date 5%; booths→christening/gender-reveal, +cake, +accommodation lifted them.)_

## Isolation — verified (machine-checked)

- **A wedding cannot be completed elsewhere** — 6 wedding-only leaves + 4 rite-shared (only christening) that no other type exposes. ✓
- **A debut cannot be done as a birthday** — debut has 12 leaves birthday lacks (filipiniana, wellness, jewelry, orchestra, choreographer, av_production, crew_meals, fireworks, led_wall, editorial, escort, date_specialist). ✓ (10 vs Celebration.)
- **A christening cannot be done as a birthday** — christening has 6 birthday lacks (ceremony_venue, officiants, counseling, filipiniana, choir, livestream). ✓
- **Each type holds a bounded true list** (5%–100%), not the 89–100% universal flood. ✓

## ⚠ Reach vs the locked price tiers — the open reconciliation

The reach spread does NOT line up cleanly with the locked 5-tier type→price assignment:

| Locked price | Types | Reach range | Issue |
|---|---|---|---|
| ₱1,499 | Wedding | 100% | ✓ clean |
| ₱999 | Debut · Corporate | 76–81% | ✓ clean |
| ₱499 | Christening · Birthday · Celebration · Travel · Tournament · Anniversary · Graduation · Reunion | **13%–67%** | ✗ 5× internal spread |
| ₱99 | Gender reveal · Dinner Date | 5–19% | ✓-ish |

Two anomalies inside the ₱499 tier:
1. **Travel (13%) and Tournament (25%)** are far lighter than Birthday/Celebration/Anniversary/Graduation/Reunion (~65%) — by reach they belong near the ₱99 light tier. (Travel is special: few categories but a bespoke itinerary engine, so its value ≠ category count.)
2. The **casual cluster (BDY/CEL/ANN/GRA/REU ~65%)** is heavier than the ₱499 label implies by reach — but they're low-willingness-to-pay events, so ₱499 fits commercially.

**Root cause:** reach (offering) and willingness-to-pay (event gravity) diverge — a birthday has high category reach but low WTP; a wedding has both. Pure-reach pricing would misprice both ends of the casual cluster. **Recommendation:** keep the 5 locked prices as WTP/gravity tiers; use reach as the FLOOR/justification (nothing over ~20% reach can sit at ₱99; nothing near-wedding reach sits below ₱499). Then settle the two anomalies (Travel, Tournament) explicitly — owner decision.

## Implementation (after owner sign-off)

1. Write `applicable_event_types` per this matrix into `service_categories` (+ `canonical_service_taxonomy`) — a taxonomy migration (mirror `20270825054104`). Closes the isolation guardrail.
2. Keep the wedding-only AI depth (`followRoadmap`, statutory pack) as the second offering axis.
3. Per-type price ladder already built (PR #3485) — no change unless the anomalies re-tier Travel/Tournament.

**Owner decisions — RESOLVED 2026-07-22:** (a) **Travel = ₱499** (kept — the itinerary engine is genuine value despite 16% reach). (b) **Tournament = ₱99** (dropped C→D — 25% reach = a few specialized vendors). (c) Judgment calls signed off WITH edits: booths now reach **christening + gender-reveal** (not travel/dinner); christening = rite + reception, **no band-heavy program**; **dinner date += cake**; anniversary ~ celebration (no ceremony venue); **`livestream` removed** from the marketplace (in-app Live Studio; `led_wall`/`photo_booth` kept as physically distinct); **`accommodation` scoped Travel + Wedding**. Shipped: migration `20270832295038` + `lib/setnayan-ai-type-pricing.ts`.
