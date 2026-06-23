# Vendor Portal — Host-Event ⇄ Vendor Dashboard Data Link (Rule-Based, ₱0-to-run)

> **Status:** ✅ PHASES A1–A3 BUILT 2026-06-13 (same day as design) — shipped via repo PR #1323 (auto-merge armed), both migrations (`20261208003000` portion rules + catering metrics RPC, `20261208006000` proposals) applied to prod statement-by-statement + manual ledger rows. **Scope note vs § 3.4:** V1 ships proposals BOOKED-clients-only at the DB INSERT gate; inquiry-stage proposals stay parked until the owner rules on proposal=answer (§ 5.2). Phase B items (§ 1.6 block pin · § 2.4 lock-guest-list · § 2.5 Realtime ping) remain unbuilt pending sign-off. _Original design intent below._
> **Design:** 2026-06-13 — owner-requested expansion of the Vendor Portal. Three components: ① category-aware timeline lens, ② caterer RSVP metrics + portion math widget, ③ proposal auto-fill templates. **All deterministic SQL + TypeScript — zero LLM inference, zero per-event marginal cost** (consistent with `project_setnayan_ai_definition` and `project_setnayan_marginal_cost_model`).
> **Builds on (shipped 2026-06-12/13, do not duplicate):** Phase 1 Vendor Event Brief #1296 (`get_vendor_event_brief`), Phase 3 shared timeline + Suggest #1303 (`current_vendor_booked_event_ids()`, booked-vendor SELECT on `event_schedule_blocks`, `event_schedule_suggestions`, vendor `.ics`), Phase 4 seat-plan viewer #1305 (`get_vendor_seat_plan`, per-table meal counts), #1309 floor areas + booth pins.
> **Canonical sibling:** `Feature_Access_By_Vendor_Category_2026-06-12.md` — this doc extends its § 4 (timeline) and § 7 (dietary matrix); all five 2026-06-12 owner locks (D1–D5) remain binding.

---

## 0. Standing constraints this design inherits

1. **Access keys on BOOKED status.** `event_vendors.status ∈ {contracted, deposit_paid, delivered, complete}` via `current_vendor_booked_event_ids()`. Inquiry-stage vendors get only what the couple disclosed in the inquiry (§ 3.4).
2. **Guest PII never crosses to vendors** — aggregates and counts only (RA 10173 guard already enforced in #1296). Nothing below returns a guest row.
3. **D2 lock: booked vendors see the FULL timeline by default** (couple can restrict per vendor). Therefore the timeline filter is a **lens, never a gate** — it highlights, it does not hide (§ 1.2).
4. **Vendors never write couple data directly** (conflict-architecture lock) — everything stays read + suggest.
5. **Cron-free.** No polling jobs; "real-time" = fetch-on-load + optional Supabase Realtime broadcast (§ 2.5).
6. **Tiers sell REACH, not features** (`project_setnayan_vendor_tier_ladder`) — all three components ship free to every booked vendor. No paywall.

---

## 1. Component ① — Category-aware timeline lens

### 1.1 What exists

Booked vendors already SELECT the full `event_schedule_blocks` row set (label, `block_type` enum, `start_at`, `end_at`, `location`; couple-private `notes` excluded at the UI layer) and can file `event_schedule_suggestions`. The Brief card shows the timeline snapshot.

### 1.2 The delta — a pure-TS relevance utility, no new DB surface

New `apps/web/lib/vendor-timeline.ts`, shared by the vendor Clients detail page and the Brief card:

```ts
type Relevance = 'primary' | 'supporting' | 'context'

interface VendorTimelineBlock {
  block: ScheduleBlock          // as selected under the #1303 RLS policy
  relevance: Relevance
  isMine: boolean               // an accepted suggestion from this org targets/created this block
  callTime?: string             // start_at minus category setup lead (§ 1.4)
}

function filterTimelineForVendor(
  blocks: ScheduleBlock[],
  bookedCategories: string[],   // ev.category values from event_vendors, same as the Brief RPC
  acceptedSuggestionBlockIds: Set<string>,
): VendorTimelineBlock[]
```

**Static relevance map** (`schedule_block_type` enum × canonical category — the deterministic "rule base"; data, not code, so it can later move to a taxonomy-driven table per `feedback_setnayan_categories_db_not_hardcoded`):

| `block_type` | primary for | supporting for |
|---|---|---|
| `pre_ceremony` | hair_makeup, photographers, videographers, coordinator | florists, transportation |
| `ceremony` | officiants, musicians (ceremony), florists, photographers, videographers, coordinator | venue |
| `cocktails` | **catering**, mobile_bar, musicians/strings, photographers | venue |
| `reception` | venue, coordinator, lights_sound | catering, florists |
| `dinner` | **catering**, cake_maker, mobile_bar | hosts_emcees, coordinator |
| `program` | **hosts_emcees, musicians_dj, bands**, lights_sound | photographers, videographers |
| `dancing` | **musicians_dj, bands**, lights_sound | photographers |
| `send_off` | photographers, transportation, coordinator | — |
| `after_party` | musicians_dj, mobile_bar | venue |
| `custom` | keyword fallback (§ 1.3) | — |

Coordinator (`planner_coordinator`) and venue resolve to `primary` on **every** block. Any (category, block_type) pair not matched → `context`.

### 1.3 `custom` blocks — deterministic keyword fallback

A static regex table over `label` (lowercased), first match wins: `/(dinner|lunch|buffet|merienda|cocktail|dessert|cake)/ → food`, `/(first dance|band|set|dj|sound ?check|performance)/ → music`, `/(photo|video|sde|same.?day)/ → media`, `/(prep|makeup|hair|getting ready)/ → prep` — then food→catering/cake/bar primary, etc. No match → `context`. Pure regex; no inference.

### 1.4 Call-time derivation (the useful by-product)

`callTime = earliest primary block start_at − setupLeadMinutes[category]` from a static lead-time map (catering 180 · lights_sound 150 · florists 120 · musicians_dj 90 · hair_makeup 0 — it IS the block · default 60). Rendered as *"Suggested call time — confirm with your couple"*, with a one-tap prefill into the existing `event_schedule_suggestions` Suggest flow (`kind='new'`, label "`{Vendor}` setup / call time"). This keeps vendors inside the suggest-not-write contract while making the lens actionable.

### 1.5 UI behavior (vendor Clients → event detail)

Default view = full timeline (D2), primary blocks visually elevated (left-border accent + "Your slot" chip), `context` blocks dimmed. A **"My slots only"** toggle collapses to primary+supporting — a client-side filter of already-authorized rows, never a second data path. The existing `.ics` route gains `?mine=1` applying the same utility server-side (same file, same map — one rule base, two consumers).

### 1.6 Optional Phase B (small migration, owner call)

Nullable `event_schedule_blocks.assigned_event_vendor_id UUID REFERENCES event_vendors` so couples can *explicitly* pin a block to a booked vendor ("Dinner — Grazia Catering"). `isMine` then prefers the explicit pin over heuristics. Couple-writable only; vendor sees it read-only. Not required for ① to ship.

---

## 2. Component ② — Caterer RSVP metrics + portion math ("Production Sheet" widget)

### 2.1 What exists

#1296 already returns `meal_counts` (jsonb agg over `guests.meal_preference` for `rsvp_status='attending'`) + `restriction_notes` count, gated to food-relevant categories (`catering, cake_maker, mobile_bar, venue, planner_coordinator`). #1305 returns per-table meal counts. `meal_preference` enum: `beef · chicken · fish · vegetarian · vegan · kids · no_preference`.

### 2.2 The delta — one new SECURITY DEFINER RPC

`get_vendor_catering_metrics(p_event_id UUID) RETURNS JSONB` — same caller-resolution + booked gate + food-category gate as #1296 (copy the pattern verbatim; no new RLS on `guests` — vendors still cannot SELECT guest rows, ever). Returns:

```jsonc
{
  "as_of": "2026-06-13T09:12:00Z",            // MAX(guests.rsvp_responded_at) — the freshness stamp
  "finality": {                                 // § 2.4
    "responded_pct": 0.78,
    "pending": 31, "maybe": 6,
    "is_provisional": true                      // pending+maybe > 0
  },
  "headcount_scenarios": {                      // deterministic floor/expected/ceiling
    "confirmed": 142,                           // attending
    "expected":  148,                           // attending + maybe
    "ceiling":   179                            // attending + maybe + pending
  },
  "meal_counts": { "beef": 61, "chicken": 44, "fish": 12, "vegetarian": 9,
                    "vegan": 3, "kids": 8, "no_preference": 5,
                    "unspecified": 0 },          // attending with NULL meal_preference
  "per_block_headcount": { "ceremony": 142, "reception": 138, "cocktails": 95 },
                                                // unnest(guests.invited_to_blocks), attending only —
                                                // cocktail pax ≠ dinner pax, caterers price these separately
  "dietary_restriction_count": 7,               // non-empty guests.dietary_restrictions, COUNT only (no text — PII guard)
  "kids_count": 8,
  "tables": { "table_count": 18, "assigned": 131 }   // reuse of #1305 aggregates
}
```

All `COUNT(*) FILTER` arithmetic — one indexed pass over `guests` (existing `guests(event_id)` index; `deleted_at IS NULL`). Marginal cost ₱0.

### 2.3 Ingredient totals = vendor-defined **portion rules** × live counts

Setnayan does not and cannot know recipes — so the "automated ingredient totals" are the **vendor's own per-head ratios**, multiplied deterministically. New table:

```sql
CREATE TABLE public.vendor_portion_rules (
  rule_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_profile_id  UUID NOT NULL REFERENCES vendor_profiles ON DELETE CASCADE,
  label              TEXT NOT NULL,            -- "Lechon belly", "Rice", "Welcome drinks"
  unit               TEXT NOT NULL,            -- kg · pcs · trays · liters · servings
  qty_per_guest      NUMERIC(10,3) NOT NULL CHECK (qty_per_guest > 0),
  applies_to_meals   public.meal_preference[], -- NULL = all attending; {'beef','no_preference'} = subset
  applies_to_block   public.schedule_block_type, -- NULL = headline count; 'cocktails' = that block's pax
  headcount_basis    TEXT NOT NULL DEFAULT 'confirmed'
                     CHECK (headcount_basis IN ('confirmed','expected','ceiling')),
  waste_factor_pct   NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (waste_factor_pct BETWEEN 0 AND 100),
  sort_order         INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- RLS: vendor org owner + team members CRUD their own rows (current_vendor_profile_ids()
-- pattern); no couple/admin read needed in V1. Rules are PER VENDOR, reused across events.
```

Widget math (client or server, same result): `total = ceil(matching_count × qty_per_guest × (1 + waste_factor_pct/100))` where `matching_count` comes straight from the RPC's meal/block counts. A caterer sets "Rice — 0.2 kg/guest, all meals, expected, +10%" once and every booked event renders its production sheet automatically. Pure multiplication — auditable, explainable, no inference.

### 2.4 "Finalized guest responses" — honest provisional/final states

There is no `rsvp_finalized_at` today. Rule-based finality, no new column required: the sheet is stamped **PROVISIONAL** while `pending + maybe > 0` and shows all three headcount scenarios; it flips to **FINAL** when `pending = maybe = 0` **or** `events.event_date − today ≤ N days` (N=7 default). *Optional Phase B:* a couple-side "Lock guest list" action setting `events.guest_list_locked_at`, which hard-flips the stamp and freezes the numbers vendors see — surface for owner sign-off, not needed to ship.

### 2.5 "Real-time" without crons

Fetch-on-load + a refresh button, `as_of` stamp always visible. Optional enhancement: a Supabase Realtime **broadcast** channel `catering:{event_id}` pinged from the existing RSVP server action (couple-side, `after()` — cron-free lock respected) carrying only `{ as_of }`; the widget refetches the RPC on ping. No guest data ever rides the channel.

### 2.6 Privacy + dietary-model alignment

Counts only; `dietary_restrictions` free-text is COUNTED, never returned (matches #1296). When the graded dietary capability cutover lands (`Catering_Dietary_Halal_Model_2026-06-11.md` § 4.3 guest-allergy rollup), its grades extend this same RPC — design reserves the key `dietary_rollup` for it.

---

## 3. Component ③ — Proposal auto-fill (saved packages → printable proposal)

### 3.1 What exists

`vendor_packages` + `vendor_package_items` (per-`canonical_service` line items, `total_price_centavos`, consumable budget) and `event_vendor_packages` (the booking row) — shipped 2026-06-04. Pax-based pricing axes are locked (`project_setnayan_pax_based_pricing`: pax-dependent 100-floor + per-50 · per-hour/pool · flat) — amounts owner/vendor-set, never invented.

### 3.2 Two new tables

```sql
CREATE TABLE public.vendor_proposal_templates (
  template_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_profile_id  UUID NOT NULL REFERENCES vendor_profiles ON DELETE CASCADE,
  template_name      TEXT NOT NULL,
  default_package_id UUID REFERENCES vendor_packages,   -- pre-selects line items
  sections           JSONB NOT NULL DEFAULT '[]',        -- ordered [{kind:'heading'|'paragraph'|'line_items'|'terms', body}]
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.vendor_proposals (
  proposal_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id          TEXT UNIQUE NOT NULL DEFAULT generate_public_id('Q'),
  vendor_profile_id  UUID NOT NULL REFERENCES vendor_profiles ON DELETE CASCADE,
  event_id           UUID NOT NULL REFERENCES events ON DELETE CASCADE,
  template_id        UUID REFERENCES vendor_proposal_templates ON DELETE SET NULL,
  merge_snapshot     JSONB NOT NULL,    -- § 3.5 frozen merge data
  rendered_sections  JSONB NOT NULL,    -- sections with tokens resolved
  total_centavos     BIGINT NOT NULL CHECK (total_centavos >= 0),
  status             TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
  valid_until        DATE,
  sent_at            TIMESTAMPTZ, resolved_at TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- RLS: templates = vendor-org CRUD (current_vendor_profile_ids() pattern).
-- Proposals: vendor-org full CRUD on drafts, no UPDATE of merge_snapshot after sent_at
--   (trigger-guard); couple SELECT via current_couple_event_ids() once status='sent';
--   couple may flip status sent→viewed/accepted/declined (status-flip-never-delete,
--   mirroring the booking-ruleset inquiry convention).
```

### 3.3 Merge tokens — deterministic resolver, tiered by relationship status

Templates embed `{{token}}` placeholders; a server action resolves them from data the vendor is **already authorized to see** — the resolver reuses the Brief RPC + catering metrics RPC, never a new privilege:

| Token | Source | Available at |
|---|---|---|
| `{{couple_name}}` | `events.display_name` | booked; inquiry-stage only if the inquiry thread disclosed it (screen-name/hybrid-anonymity rules unchanged) |
| `{{event_date}}` | `events.event_date` | inquiry + booked |
| `{{venue_name}}` / `{{venue_address}}` | `events.venue_name/_address` | booked |
| `{{guest_count}}` | `headcount_scenarios.confirmed` (booked) or `events.estimated_pax` (inquiry) — labeled which | inquiry + booked |
| `{{guest_count_expected}}` / `{{guest_count_ceiling}}` | catering metrics RPC | booked, food categories |
| `{{meal_breakdown}}` | `meal_counts` rendered as a list | booked, food categories |
| `{{table_count}}` / `{{floor_plan_status}}` | seat-plan aggregates (#1296/#1305) | booked, floor categories |
| `{{my_slot}}` / `{{call_time}}` | component ① output | booked |
| `{{package_*}}` | the vendor's own `vendor_packages` row | always |

Unresolvable tokens render as an explicit `⟨not yet shared by couple⟩` chip — never silently blank, never guessed (admit-unknown house rule).

### 3.4 Inquiry-stage proposals + the token economy

A proposal sent into an inquiry thread **is an answer** — it rides the existing burn-to-answer unlock (1× per (vendor, event); `project_setnayan_vendor_token_model`). It must NOT trigger a second burn, and must not become a burn bypass: sending a proposal to a not-yet-unlocked inquiry routes through the same unlock gate as a chat reply. No new economy primitive.

### 3.5 Snapshot-on-send + printable output

On `sent`: resolver output freezes into `merge_snapshot` + `rendered_sections` with an *"as of {as_of} — {confirmed} confirmed guests"* line. Later RSVP changes never mutate a sent proposal (the live widget ② is where freshness lives). Print = a dedicated `/vendor-dashboard/proposals/[id]/print` route with `@media print` CSS — same zero-dependency pattern as the seat-plan print pack and vendor `.ics`; no PDF service, no render queue. Couple sees the sent proposal on their vendor detail page; **accepting it is a signal, not a booking** — money stays off-platform (RA 11967 posture; the standing payment disclosure line renders in the print footer).

---

## 4. Build order & effort (CC-time)

| Phase | Scope | Size |
|---|---|---|
| A1 | ① `lib/vendor-timeline.ts` + Clients-page lens + `.ics ?mine=1` | ~half a CC-day, no migration |
| A2 | ② `get_vendor_catering_metrics` RPC + `vendor_portion_rules` + widget | ~1 CC-day, 1 migration |
| A3 | ③ templates + proposals tables + resolver + print route + couple view | ~1.5–2 CC-days, 1 migration |
| B (optional, owner call) | block→vendor pin column · `guest_list_locked_at` · Realtime ping | each ≤ half a CC-day |

Migrations land first with RLS at CREATE TABLE time; statement-by-statement apply per `project_setnayan_migration_application`; repo work via worktree + PR (corpus direct-edit does NOT extend to code).

## 5. Owner sign-offs requested (flagged, not assumed)

1. **§ 1.6 / § 2.4 Phase B columns** — explicit block-vendor pin and couple "Lock guest list": both small, both deferred-safe. Ship A-phases without them?
2. **§ 3.4 confirmation** that a proposal = an answer under the existing burn-to-answer unlock (recommended; alternative of a separate proposal burn would double-charge).
3. **Free-for-all-booked confirmed?** All three components ship un-gated per reach-not-features. (Pricing stays out per the standing holistic-review-later rule.)
