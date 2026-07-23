# Composable Event — Build Map (file-grounded) · 2026-07-15

> The "what to adjust" audit for the [composable-event vision](Composable_Event_Coordination_and_Token_Model_2026-07-15.md), grounded in `apps/web` (main @ `c6a5f1e03` — UI ~600 commits stale, but core systems current; migrations at `/Users/icecasasola/supabase/migrations`, 743 files). Produced by 5 parallel passes: taxonomy · reservations · tokens · event-model · pages/admin.
>
> Every line is tagged: **REUSE** (exists, use as-is) · **EXTEND** (exists, add a field/case) · **NEW** (nothing there today).

## Headline: this is EXTEND-and-WIRE, not greenfield

The money engine, reservation kernel, confirm-back pattern, hold-and-release, coordination anchor, timed itinerary, and the multi-vendor multiplier **already exist**. The vision's core monetizer — *one event → N independent vendor unlocks* — is **already structurally live** (unlocks key on `(vendor, event)` with **no category column**, so N vendors on one event = N burns today). **The only net-new layer is Community (Samahan).** Everything else extends a shipped primitive.

## The spine — sequenced by dependency, biggest levers first

1. **EXTEND — `event_class` + `layer_mode` on `event_type_profiles`** (seed per type). The prerequisite everything reads. Copies the proven `marketplace_enabled` deny-by-exception pattern → default preserves wedding behavior byte-for-byte. `event_class` = personal-only | community-eligible; `layer_mode` = anchored | roaming (drives catering-vs-dining + single-vs-multi-day). *(`lib/event-type-profile.ts`)*
2. **EXTEND — `service_nature` on `service_categories`** (`reservation | service | goods | in_app`, default `service`, fail-open, admin-editable). The 4-class spine; leaves the ~54 existing wedding tiles untouched. *(pattern from migration `20261104000000`; `lib/taxonomy.ts`)*
3. **EXTEND — promote gifts / lodging / dining to first-class plan groups** in `lib/wedding-plan-groups.ts` (pull `gifts_and_giveaways` out of the bundled `logistics` group; give `accommodation` a real vendor pool instead of the `venue` proxy). **This is the highest-ROI step: the instant these fan out as their own leads, one event becomes N category unlocks with ZERO change to the money path** — the convergence monetizes itself through the existing per-`(vendor,event)` burn.
4. **EXTEND kernel + NEW venue-confirm-back — `reservations` table + `confirm_reservation` RPC.** The RPC is a near-verbatim clone of `acknowledge_handover` (single-winner `FOR UPDATE` + status precondition + `ROW_COUNT`), actor flipped to the venue's `current_vendor_profile_ids()` = the one true missing seam (venue accepts the coordinated drop). Availability reuses `vendor_schedule_pools`/`acquire_schedule_pools` (extend `booked_date` → date-range for **nights**) and `vendor_service_time_slots`/`acquire_service_time_slot` (add **`party_size`/covers**). Anchor = existing `resolveReceptionAnchor()`.
5. **EXTEND — the coordination link + Itinerary.** `event_slot_bindings` (or a nullable FK on `supplies_orders`/`orders`) binding an order/handover → a reserved slot + `deliver_by` time; generalizes the one real place↔time binding already in code (`event_floor_plan.cocktail_schedule_block_id`). Surface it as an **Itinerary tab in Merkado** that turns Build picks (`lib/build-3state.ts`) into timed, located, slot-bindable items wired to `event_schedule_blocks`. Add `events.end_date` + day-awareness for multi-day roaming.
6. **NEW — Community (Samahan).** `communities` + `community_members` + `events.community_id` FK + CHECK (`community_id` NULL unless the type's `event_class` is community-eligible — copies the `events_wedding_fields_consistency` CHECK precedent) + a **community-organizer** role + invite-as-group (`guest_groups.source_community_id`) + the Spaces route tree (overview/members/events/memories/chat, nested). **The sole greenfield build** — and it depends on step 1.
7. **CONTROL — admin + flags.** Add `service_nature` / `event_class` / `layer_mode` / `community_eligible` to the live **Taxonomy Studio** editors (`/admin/taxonomy`); a reservation/coordination oversight queue (extend the `booking_handovers` dispute console); an admin view of `lead_token_holds` (none exists). **Flip `NEXT_PUBLIC_LEAD_TOKEN_HOLD_ENABLED` on** before scaling new categories, so lodging/gifts vendors get ghost-refund protection instead of paying for fakes.

## By area (REUSE / EXTEND / NEW)

### Taxonomy & categories
- **REUSE:** two category vocabularies (`VendorCategory` enum `lib/vendors.ts` + canonical taxonomy `lib/taxonomy.ts`), bridged by `lib/vendor-category-taxonomy.ts`; the per-category attribute system (`canonical_service_schemas`, `vendor_service_attributes`); the event-type→eligible-category plumbing (`applicable_event_types` + `passesEventTypeFilter`, `lib/taxonomy-filters.ts`) — just **unseeded**; `is_setnayan` flagging for in-app SKUs.
- **EXTEND:** `accommodation` (exists, mapped to `reception` tile, priced fixed/per_pax/per_hour) → promote to a `lodging` tile with `service_nature=reservation`; `gifts_and_giveaways`/`souvenir_giveaways` (exists) → add goods qty/single-bulk; add `service_nature`; add `per_night`/`per_table`/`per_item` to `vendor_services.pricing_basis`; **seed** `applicable_event_types` for roaming-vs-anchored.
- **NEW:** a `dining`/`restaurant_dine_in` category + tile (all food today is event-service).
- **⚠ DO NOT reuse `lib/supplies/` (iteration 0018) for goods** — it's a wholesale-markup in-app store with cart/checkout/shipping = the exact ₱0 boundary violation. Goods ride the off-platform inquiry/quote path.

### Reservations & coordination
- **REUSE:** `vendor_schedule_pools` + `acquire_schedule_pools` (per-day capacity, all-or-nothing atomic acquire); `vendor_service_time_slots` + `acquire_service_time_slot` (timeslots); `acknowledge_handover` + deposit-ack family (confirm-back pattern); `lib/lead-token-holds.ts` (hold-and-release + 7-day ghost sweep); `resolveReceptionAnchor()` (the "fixed where"); `supplies_orders.delivery_window_start/end` (goods delivery-target already exists).
- **EXTEND:** `vendor_schedule_pool_bookings.booked_date` → date-range for nights; add `party_size`/covers to time-slots; add a reserved-anchor FK to the order/handover.
- **NEW:** `reservations` table; `confirm_reservation` RPC (venue-side confirm-back — clone of `acknowledge_handover`); `event_slot_bindings` coordination link.
- Migration comment already **defers bookable venue inventory to "V1.2 (per-location calendar, day-rates, capacity tiers)"** — the platform anticipated this exact build.

### Token / lead economy
- **REUSE (as-is — category-agnostic):** `vendor_event_unlocks` (UNIQUE per vendor,event) + `unlock_vendor_event` burn (region band @ ₱100/token); wallets/packs; `lead_token_holds` + sweep + `handle_vendor_lead_report` (self + ≥3-cluster refund). **Multi-vendor-per-event and couple-side multi-category fan-out already work** (`unlockCategoryWithInquiry` + `Promise.allSettled(groupIds.map(...))`).
- **EXTEND:** promote gifts/lodging/dining to first-class groups (step 3); optional `unlockCoordination({groupIds})` bundle wrapper; **optional** per-category burn axis (`/admin/token-bands` is region-only today).
- **⚠ CORRECTION (already applied to the vision doc):** "**100 free tokens on verification" was RETIRED** (migration `20270110320020`, owner 2026-06-17). Tokens now come only from admin grants, subscription bundles, purchases. **Corpus `CLAUDE.md` still repeats the stale line — owner should fix it.**

### Event model, itinerary, community
- **REUSE:** `events` (venue lat/long anchor); `event_type_vocab`/`event_type_profiles` (open, admin-editable vocab + the `marketplace_enabled` deny-by-exception pattern); `event_vendors` (service-attach); `event_schedule_blocks` (timed run-of-show, `advance_schedule_block`); `event_moderators` (host/co-host, iteration 0048); `guest_groups` + `guests.invited_to_blocks` (guest→block); `event_floor_plan.cocktail_schedule_block_id` (the place↔time proof-pattern).
- **EXTEND:** `event_class` + `layer_mode` on `event_type_profiles`; `events.end_date` + day-aware itinerary; generic slot-typing on schedule blocks; `guest_groups.source_community_id`.
- **NEW:** `communities`/`community_members` + `events.community_id` + the class CHECK + community-organizer role + invite-as-group fan-out + the Spaces route tree.

### Pages, admin, permissions
- **REUSE:** Merkado (Shortlist/Build/Budget/Compare, `lib/budget-build.ts` + `lib/build-3state.ts`); Schedule (`lib/schedule.ts`); `app/explore` marketplace; `app/vendor-dashboard/*`; admin **Taxonomy Studio** (`/admin/taxonomy`) + ops queues; `lib/roles.ts` + `lib/event-moderators.ts`.
- **EXTEND:** add an **Itinerary tab** to Merkado (bind Build picks → timed/located/slot); marketplace layer facets + class-aware CTAs ("Reserve a table" / "Order souvenirs"); a vendor-dashboard **reservation-requests + confirm-back** queue; Taxonomy Studio gains `service_nature`/`event_class`/`layer_mode`/`community_eligible`; admin reservation/coordination oversight (extend the handover dispute console); **adopt the 4-surface launcher** (Events/Alaala/Spaces/You — itself a launcher edit; today it's 3 groups and "Your spaces" = *consoles*, a naming collision).
- **NEW:** the community **Spaces** route tree; community-organizer + personal-vs-community create gate.

## What kind of event for the coordination scenarios? (answering the mid-turn question)

Don't proliferate types — the capability rides on **`layer_mode`, not a bespoke type**:
- **Overnight monthsary getaway / friends' overnight** → **`travel`** (roaming, has lodging). `travel` is community-eligible *and* personally creatable, so a personal getaway is fine as personal `travel`.
- **Friends' timed lunch/dinner (no overnight)** → **`simple_event`** (or `celebration`) — roaming, no lodging.
- **Heuristic:** *lodging/overnight involved → `travel`; just a meal/small gathering → `simple_event`.* Coordination (flowers/gifts to the room or the table) works on both, because it's driven by the **reserved anchor** (room vs table) + time, not the event type.
- **Adding a bespoke type** (e.g. "Getaway", "Date night", "Staycation") is **cheap** — `event_type_vocab` is an open, admin-editable vocab (`/admin/event-types` CRUD) — but only warranted if the **onboarding/checklist/terminology genuinely diverges** from `travel`/`simple_event`. Default recommendation: **reuse travel + simple_event; add a type only for a real UX divergence.**

## Multi-day & the segment-vs-occasion rule (locked 2026-07-15)

- **A multi-day event is ONE event with several days**, not a bundle of sub-events. Rehearsal dinner, guest lodging, and brunch are **days/blocks on the wedding's timeline**, not new events. Reuse `event_schedule_blocks` (+ a `day_index`/date and `events.end_date`) and `guests.invited_to_blocks` (already links a guest → which part they attend).
- **Lodging is NEVER an event** — it's a **reservation that spans the days** (check-in → check-out), a layer on the multi-day event.
- **A separate event is only for a different *occasion*** (engagement party · bridal shower · bachelor/ette · prenup getaway) — its own date/guests, created from the home, shown as a **linked cluster** beside the wedding.
- **Rule of thumb:** same weekend + same-ish guests → a *day/block inside the one event*; different occasion → a *separate event*; a place to sleep → a *reservation across the days*, never an event.
- **Multi-day is a per-type flag**, not hardcoded to wedding+travel: ON for wedding · travel · reunion · corporate/conference · retreat; OFF for christening · gender_reveal · birthday · debut. Drive it from `event_type_profiles` (`layer_mode`/a `multi_day` flag) — single-day types keep today's single-`event_date` behavior untouched.

## Boundaries — all confirmed held in code
₱0 · off-platform settlement · 0% commission · no logistics/no money held · vendor-side tokens only · no in-app store for goods. Confirmed by code comments (`booking_handovers` "no money"; run-of-show "0% commission untouched"; `unlock-category.ts` "COUPLE-side never burns"; e-gift "Setnayan NEVER holds money").

## Stale-vision corrections surfaced by the audit (owner should confirm)
1. **100-free-tokens on verification = RETIRED** — fix corpus `CLAUDE.md`.
2. **Goods ≠ the `lib/supplies/` store** — that store violates ₱0; goods use the off-platform inquiry path.
3. **Hold-and-release is flag-OFF** (`NEXT_PUBLIC_LEAD_TOKEN_HOLD_ENABLED`) — flip before scaling new categories.
