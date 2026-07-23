# Setnayan AI — Gap Leaves + Travel Scheduling + Dinner Date · Build Spec · 2026-07-17

> Owner directive (2026-07-17): **build the gap categories; Travel tours/activities can be multiple → schedule + time-block them with conflict detection; add Dinner Date as a not-catering-intensive reservation event (restaurant booking + gifts/souvenirs/flowers).** Grounded in `lib/vendors.ts` · `lib/checklist-event-type-defs.ts` · `lib/event-type-profile.ts` · `Composable_Event_Coordination_and_Token_Model_2026-07-15.md`. Visual: Claude artifact `gaps-built-v2` (https://claude.ai/code/artifact/45f1f76c-bd68-446d-922c-4a56c5013c2a). NOT built — spec for Opus implementation.

This closes the loop on the per-type AI load/pricing thread: building the gaps re-ranks the tiers, so the price truly follows the load.

## Part A — The 12 gap leaves + the Dinner Date anchor (owner review 2026-07-17)

Each leaf = one row in `service_categories` (tier-2 tile) + `canonical_service_taxonomy` (leaf, with `applicable_event_types`) + the `VendorCategory` union/`VENDOR_CATEGORY_LABEL` in `lib/vendors.ts`. Pattern mirrors migration `20270310764093_chinese_specialist_leaves.sql`.

| Leaf slug (proposed) | Label | Parent tile | applicable_event_types |
|---|---|---|---|
| `referee_official` | Referees / Officials | logistics/safety | tournament |
| `event_medic` | Medic / First-aid | logistics/safety | tournament (+ wedding·corporate optional, large events) |
| `tour_activity` | Tours & Activities | experience | travel *(schedule-block-generating — see Part B)* |
| `tour_guide` | Tour Guide | experience | travel |
| `travel_insurance` | Travel Insurance | experience | travel |
| `av_production` | AV / Production | program/production | corporate (+ wedding·debut optional) |
| `speaker_talent` | Speakers / Talent | program/production | corporate *(keynotes/panelists — distinct from performers)* |
| `performers` | Performers (live acts) | program/production | birthday·corporate·celebration core; wedding·debut optional *(dancers, singers, magicians, specialty acts)* |
| `kids_entertainer` | Kids' Entertainer | program | birthday *(**clown / magician / mascot** for kiddie parties)* |
| `choreographer` | Choreographer | program | **wedding** (ritual dances) + **debut** (cotillion); celebration optional |
| `reveal_element` | Reveal Element | specialty | gender_reveal |
| `event_insurance` | Event Insurance | insurance | wedding·corporate core; debut·birthday·tournament·celebration·travel optional *(cancellation + liability)* |
| `personal_accident_insurance` | Personal Accident | insurance | tournament core; corporate·birthday·travel optional *(participant/athlete cover — pairs with event_medic)* |
| `restaurant_reservation` | Restaurant (reservation) | dining | dinner_date (+ travel optional) |

`travel_insurance` (added earlier) joins these as the **Insurance & protection** family. See Part F for the regulatory model + the parked Layer-2 life-stage play.

**Owner corrections applied 2026-07-17:**
- **`cotillion_choreographer` → generalized to `choreographer`** — weddings have ritual-dance choreo (money dance, grand entrance), not just debut cotillion. Core for wedding + debut.
- **`performers` added** — hosts can hire live acts (dancers, singers, specialty). Distinct from `band_dj` (music) and `speaker_talent` (corporate keynotes).
- **Magicians & clowns now have two homes:** `kids_entertainer` (kiddie parties) and `performers` (adult / stage acts). Previously unfindable.
- **Optionals kept** — no category is pruned from any type; the AI's coverage set = core + optional.

Reused, not rebuilt: **flowers = `florist`** (exists), **gifts/souvenirs = `gifts_and_giveaways`** (exists). "Souvenirs" folds into gifts_and_giveaways — no new leaf, per the composable model's don't-proliferate discipline.

## Part B — Travel: multiple hotels + multiple tours on one conflict-free itinerary

Travel is already `layer_mode='roaming'` (seed `20270221005058` + composable foundation `20270807254184`). Two reservation classes lay onto the multi-day itinerary (owner 2026-07-17: **multiple hotels AND multiple tours/activities**):

- **Multiple hotels = sequential night-blocks** — Hotel A nights 1–2, Hotel B nights 3–4. The composable "room × nights" geometry; each `accommodation` booking is a night-span on the trip. The guard flags a night with no hotel booked (a gap in lodging).
- **Multiple tours/activities = time-blocks** — the new `tour_activity` leaf is **not just a vendor category, it generates a schedule block** (start/end) on the trip.
- **Requires `multi_day=true` for travel** (verify/set — the composable migration lists travel among the multi-day types; the current profile seed leaves it at the generic default — confirm and set).
- **Conflict detection reuses the existing engine** — `lib/schedule.ts` + `lib/schedule-matrix.ts` (already labels "no conflict on file · confirm with vendor") + `lib/schedule-pools.ts` (2026-06-04 conflict audit). No new conflict primitive.
- **No two activities may overlap** — a double-book is rejected at save; the AI's existing clash guard **GRD-06** ("Two things land on {slot}: {item_a} and {item_b}") fires as the traveler-facing warning.
- Stretch (P2): warn when the gap between two back-to-back activities is too short for realistic travel time between their locations.

This is the single biggest load-raiser: Travel goes from 2 built categories (Tier D) to 5 + an itinerary engine → **Tier C**.

## Part C — Dinner Date: a roaming dining event (already in the composable model)

The composable model (owner-locked 2026-07-15) already specifies this exact shape — *"friends' timed lunch/dinner — same engine, different reserved slot,"* *"gifts staged at the dinner table before the party sits,"* *"roaming events → timed dining reservations (you go out to eat); catering is the wrong geometry."* So Dinner Date is a **configuration of the existing roaming/reservation spine**, not a new engine.

Proposed `dinner_date` profile:
- `terminology`: organizerNoun 'host', eventWord 'dinner', seatWord 'seat', vipTierLabel 'guests', personA/B null.
- **`layerMode: 'roaming'`** — the anchor is a **restaurant reservation, NOT catering** (the owner's core point; catering is the wrong geometry).
- `anchorCategory: 'restaurant_reservation'`.
- `multiDay: false` (single evening).
- `enabledSurfaces: ['rsvp', 'schedule', 'day_of', 'gallery']` — the reservation time + a small guest list + gallery. **No** website/save_the_date/monogram/seating/budget.
- `marketplaceEnabled: true` (restaurants, florists, gift shops).
- Categories the AI works: **`restaurant_reservation` (anchor) + `florist` (flowers) + `gifts_and_giveaways` (gifts/souvenirs)** — routed to the table via the composable coordination pattern (share where+when → confirm-back the restaurant → surface the plan). 3 categories → the lightest AI.
- Coverage window: **days to ~2 weeks.** AI job is tiny: confirm the reservation, remind, coordinate the flower/gift drop-off timing with the restaurant.

**⚠ LOAD-BEARING DECISION (owner reviews at the end, not per-item — owner 2026-07-17 "approval is after you fix everything and I check"):** Dinner Date as a **new `event_type`** vs a mode of an existing roaming type. The composable model is owner-locked on *"reuse travel/simple_event — don't proliferate."* Recommendation applied pending review: **new type** — it has a distinct master signal (dining reservation + occasion), distinct minimal surfaces, and is a high-frequency lifestyle acquisition funnel; the other event types wouldn't carry that identity.

## Part C-bis — The Setnayan AI cost rule (owner 2026-07-17, generalized)

Owner: *"If digital services only, then no cost for Setnayan AI. But if vendors are included, Setnayan AI needs to be present with cost."* This is the governing rule — the AI **is** the vendor-planning layer, so its presence and cost track vendor involvement, not just event type:

- **Digital services only → no vendors → Setnayan AI is NOT present → ₱0.** Nothing to match, plot, or guard; the in-app SKUs price themselves.
- **Vendors included → Setnayan AI IS present → priced** per the event's load tier. You pay for the AI exactly when there are vendors to plan.

**Simple Event = the clean ₱0 example.** `marketplace_enabled=false`, just Papic + Live Stream, no custom QR, unlimited guest capture; surfaces = `gallery` + `day_of` + Studio hub only. Every vendor-inclusive type — even a dining date — carries at least the lightest AI cost.

**Wedding window locked at 18 months** (owner 2026-07-17) — matches the 540-day checklist horizon; sets the top of the load scale. **Optionals kept** for every type (no pruning) — coverage set = core + optional.

## Part C-ter — Dining dates + restaurant-table reservation (owner 2026-07-17)

Owner: *"Dinner/lunch/breakfast date? Or these are short-time gatherings with all the recommended vendors. This means, we will have an opening for restaurant tables."*

- **Breakfast / lunch / dinner = the meal-timeslot attribute** — one roaming-dining type, not three. Barkada = the occasion attribute + `event_class='community_eligible'` (a Samahan can own it); a romantic date is `personal`.
- **A dining date is a short-time gathering that INCLUDES recommended vendors** — the restaurant (reservation) at minimum, plus flowers (`florist`) and gifts/souvenirs (`gifts_and_giveaways`) routed to the table; a celebration meal can add a photographer or cake. **Because vendors are included, the AI cost rule applies → Setnayan AI is present at the lightest cost (~₱199)** — not free. (This supersedes the earlier "free acquisition funnel" framing for Dinner Date; a deliberate free-first-suggestion funnel is still possible as a separate choice, mirroring the free first-venue-shortlist.)
- **NEW CAPABILITY — restaurant table reservation.** Dining events open the composable **"Reservation · dining"** class as a real surface: book a table by **restaurant × meal-timeslot × party-size**, with confirm-back from the restaurant. `restaurant_reservation` (Part A) is the leaf; the booking flow is the new build. Serves dining dates, travel dining, and any event's meal component. Settle on-site · 0% commission · Setnayan holds no money. Reuses the composable reservation/coordination spine (the same "share where+when → confirm-back → surface the plan" as lodging).

## Part F — Insurance & protection (owner "yes" 2026-07-17)

Two layers, one hard regulatory wall.

**Layer 1 — event insurance as a vendor category (BUILT NOW).** Three leaves form the Insurance & protection family:
- `event_insurance` — cancellation/postponement + liability. High-value for the PH market (typhoon/calamity cancellation, vendor no-show, guest-injury liability). Core for wedding · corporate; optional across the other big events.
- `personal_accident_insurance` — participant/athlete accident cover. **Pairs with `event_medic`** — tournament needs both. Core for tournament.
- `travel_insurance` — trip cancellation, medical abroad, baggage (travel).

These behave like any other vendor category: licensed insurance vendors list, the customer discovers + connects, settlement is off-platform, 0% commission.

**Layer 2 — life-stage protection (PARKED for counsel — a positioning play, not an event-day SKU).** The event is the trigger; the protection lives in the person/family graph:
- **Wedding → new-family protection** (life · health/HMO · home).
- **Christening / newborn → the child's educational plan / VUL** (a deeply embedded PH product).
- **Debut → a starter/accident policy** for the new 18-year-old.
This is the strongest vendor doorway Setnayan has — an insurance agent would pay to reach a couple the week of their wedding or a parent at a christening (the "monetize the doorway" model at its peak). Surfaced at the right life moment via the person graph.

**⚠ THE REGULATORY WALL (non-negotiable, gates BOTH layers):**
- Insurance is regulated by the PH **Insurance Commission**. Setnayan is a **referral marketplace to LICENSED insurance vendors — NEVER an underwriter, broker, or advisor.** The advice + sale happen off-platform between the licensed agent and the customer.
- **No advice from Setnayan or Setnayan AI.** The deterministic AI may show a factual trend nudge (existing TRD template — "couples like you also arranged event insurance"), but must never recommend a specific policy or give personalized financial advice. Hard line.
- **Ships behind counsel + Insurance Commission compliance sign-off** — rides with the NPC/privacy + counsel work already in flight. Layer 1's leaves can be added to the taxonomy now (they're just a vendor category); the customer-facing insurance surface + any life-stage nudge waits on the compliance gate.

## Part G — Event isolation contract: a smaller event can't be built into a wedding (owner 2026-07-17)

Owner concern: with all these categories available, a birthday/gender-reveal/dinner-date must NOT be capable of becoming a wedding-scale event. The guardrail is structural — each event type is **bounded to its own column in the matrix** — enforced by three existing locks:

1. **Category allow-list — `applicable_event_types` per category.** A birthday can add its ~8 categories; it physically cannot add officiant, rings, gown/suit designer, church fees, string quartet, choir, the 24-category wedding stack. This matrix IS that allow-list. **⚠ THE OPEN HOLE:** today `applicable_event_types` is mostly NULL (= universal), so most categories currently show for EVERY type — the guardrail exists as a mechanism but is unenforced. **Writing the confirmed matrix to `applicable_event_types` is what closes the hole** (build-order step 2). This is the single most important guardrail and it's already on the build list.
2. **Surface allow-list — `enabledSurfaces` per profile.** The wedding *signatures* stay off for smaller types: Save-the-Date cinematic reveal, Animated Monogram, and the editorial website are `surface`-gated (`save_the_date` / `monogram` / `website`), which the generic + smaller profiles don't enable. A birthday can't produce a wedding invitation suite.
3. **AI scope — wedding-only plotting + per-type tier.** The full 11-item roadmap/plotting is `followRoadmap: eventType === 'wedding'`; smaller types get the coarse date-peak sort at their bounded tier (₱499/₱299/free), never the 18-month wedding planning brain. Terminology (`couple/bride/groom`, "wedding") is per-profile, so a birthday never even reads as a wedding.

**Anti-arbitrage:** because paid wedding-signature SKUs are surface-gated, a couple can't create a cheap "birthday" to unlock the wedding features on a lower AI tier — the features aren't on that type's surface at all. Shared universal SKUs (Papic, Live Stream, Pakanta) remain available to smaller events by design and are priced per-use, so there's no leakage.

**Scale (recommendation, not a hard cap):** do NOT hard-cap guest counts per type (a big birthday is legitimate and a rigid cap annoys real users). Scale falls out naturally from bounded categories + surfaces + AI tier. If a smaller event balloons past a sensible threshold, the AI can surface a soft advisory ("this is looking like a full celebration — want to switch event types?"), never a block.

## Part D — Pricing ripple (the payoff of building the gaps)

**🔒 LOCKED 2026-07-22 (owner "go") — a DISCRETE per-event-type ladder, not a range.** The flat ₱1,499 `SETNAYAN_AI` is replaced by the five prices below; the driver is AI load ("how much data is needed to help them"). Prices are catalog-authoritative (per-tier rows in `platform_retail_catalog_v2`), gated by the existing per-event-pricing flag (default OFF; owner flips it with the paywall). See DECISION_LOG 2026-07-22 + [[project_setnayan_ai_per_type_pricing]].

| Tier | Price | Types | Notes |
|---|---|---|---|
| A · full planner | **₱1,499** | Wedding | 24 cats · 18-mo window · full roadmap + statutory guards |
| B · major milestone | **₱999** | Debut · Corporate | Corporate carries AV/production + speakers |
| C · standard event | **₱499** | Christening · Birthday · Celebration · Travel · Tournament · **Anniversary · Graduation · Reunion** | Travel/Tournament raised by the gap build; the 3 un-studied types are **Opus-assigned to C pending owner review** |
| D · light | **₱99** | Gender reveal · Dinner Date | 3 cats · short window · coarse date-sort only |
| — · absent | **₱0** | Simple Event / any digital-services-only | no vendors → AI not present → nothing to price |

_Superseded: the earlier ~₱899/~₱499/free–₱199 "load ripple" numbers and the interim ₱100–₱1,500 range. Governing rule (price tracks vendor involvement, not the label) is unchanged._

**Vendor-price-band note (separate axis, owner-raised):** vendor services are cheaper for smaller events. This doesn't change Setnayan's AI price — it changes the **budget band the AI matches against** per (category × event type): a birthday photographer shortlist surfaces ₱8–20k packages, not the ₱60–150k wedding tier; a Dinner Date restaurant is a per-head reservation, not a catering contract. This is matching-band config, not a new SKU.

## Build order (for Opus, after owner sign-off on the Dinner Date decision)

1. **Leaves** — one migration: 11 `service_categories` + `canonical_service_taxonomy` rows with `applicable_event_types`; extend `VendorCategory` + `VENDOR_CATEGORY_LABEL` + `VENDOR_CATEGORIES`. (Additive, no lock in the way.)
2. **Populate `applicable_event_types`** for the existing leaves too (today mostly NULL = universal) from the confirmed leaf-by-type matrix — so the marketplace finally scopes categories per type.
3. **Travel scheduling** — ✅ SHIPPED 2026-07-20 ([PR #3417](https://github.com/iscasasola/setnayan-platform/pull/3417) · migration `20270825683668`): travel `multi_day=TRUE`+`layer_mode='roaming'` asserted; `'lodging'` night-blocks + `'tour'` time-blocks on `event_schedule_blocks`; save-time overlap reject + GRD-06 clash guard + day-by-day itinerary lens on the travel schedule page (pure engine `lib/schedule-travel.ts`); inert for non-travel types. P2 stretch (travel-time-between-locations warning) NOT built.
4. **Dinner Date** (gated on the new-type sign-off) — `event_type_vocab` row + `event_type_profiles` row per Part C; onboarding flow; wire the composable coordination (flowers/gifts → the reserved table).
5. **Per-type checklist def** for `dinner_date` in `checklist-event-type-defs.ts` (anchor `restaurant_reservation`; tier2 `florist`, `gifts_and_giveaways`; ~4-item template: reserve table → order flowers → arrange gift/souvenir → confirm headcount).
6. **AI pricing** — add the per-type tier to `setnayan-ai-event-pricing.ts`; Dinner Date free (or ₱99–199).
