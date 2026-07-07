# Adaptive Checklist — Per-Event-Type Definitions & Generalization

**Authored:** 2026-07-08 — owner directive ("generate the checklist for each event now")
**Status:** Spec draft · corpus-first (owner chose corpus review before the repo PR)
**Home iteration:** 0016 / Adaptive Checklist. Newer dated sibling of [`Adaptive_Checklist_Design_2026-06-17.md`](Adaptive_Checklist_Design_2026-06-17.md) — do NOT re-expand the archive stubs; this file carries the per-type detail.
**Code targets (repo PR, follows this spec):** `apps/web/lib/checklist.ts` · `apps/web/lib/checklist-taxonomy.ts` · `event_type_profiles` (admin data)

---

## 0. What the owner decided (2026-07-08)

> ⚠ **This advances past the locked "V1 = wedding-only" scope.** Owner explicitly chose **(a) build the generalization framework AND (b) fill all 8 enabled non-wedding event types** — a deliberate scope decision, surfaced here per the corpus load-bearing-decision rule, not a silent change. The UI spec's "Wedding only · others Coming soon" line ([`UI_Design_Specification.md` §](UI_Design_Specification.md)) is superseded for the checklist surface by this directive.

The realization that triggered this: because Checklist **Layer 2 is taxonomy-driven** (it reads the *active event type's plan-group tree*), the checklist is Setnayan's single "what needs to get done" guide for an event — and it currently only has real content for **weddings**. The 8 enabled non-wedding types (debut · birthday · christening · corporate · tournament · gender_reveal · travel · celebration) are **live but empty** ("zero usage, 0 content-override rows" — [`03_Strategy/Onboarding_Map_2026-07-04.md`](../03_Strategy/Onboarding_Map_2026-07-04.md)), so today they'd fall back to wedding-shaped defaults that don't fit.

**The work is two jobs, in this order:**
1. **De-hardcode** the wedding assumptions baked into `lib/checklist.ts` into a per-type definition (this spec's § 1–4).
2. **Fill the data** for wedding (as the reference type) + the 8 enabled types (§ 5).

---

## 1. What is wedding-specific in the code today (the de-hardcode list)

The current checklist hard-codes four wedding-only assumptions. Each must lift into a per-type field:

| Hardcoded today | Wedding value | Generalizes to |
|---|---|---|
| **The date is an OUTPUT** — "never frame set-your-date as step 1" | true (venue availability drives the date) | `date_model: 'output' \| 'input'` — most non-wedding types the date is an **input** |
| **Reception venue is THE anchor** — Tier 1, comes before everything | `reception_venue` | `anchor_category` — the single most date/capacity-constraining vendor for that type (may be null) |
| **Phase-1 reception→ceremony→find-date→lock ordering** | 12-step wedding sequence (§ 4 of the design doc) | `phase_ordering[]` — a per-type ordered task list |
| **Paperwork line = marriage license + CENOMAR + church + pre-Cana** | Catholic-wedding statutory pack | `statutory_pack[]` — type- + faith-scoped; empty for most types |

Everything else already generalizes cleanly and needs **no** code change: the three-layer structure, the adaptive state machine (§ 6 of the design doc), the budget health-check formula, the terminology-slot system, and `ensureChecklistSeeded()`'s re-seed-on-open. Layer 2's plan-group tree is *already* read from `event_type_profiles` per type — that pipe exists; the types just have no rows.

---

## 2. The `EventTypeChecklistDef` schema (the framework)

One definition per event type. Backbone/statutory/phase live as **data** (seedable into `event_type_profiles` sibling columns, admin-editable, zero-deploy — matching the 0053 engine thesis); the code reads the def instead of the current hardcoded wedding constants.

```
EventTypeChecklistDef {
  event_type            // 'wedding' | 'debut' | 'birthday' | ...
  terminology           // {organizer, event, event_day, date_label} — already in event_type_profiles
  date_model            // 'output' (venue-anchored → /find-date matrix) | 'input' (date chosen up front)
  anchor_category       // plan-group key of the date/capacity anchor, or null
  backbone[]            // Layer-1 static tasks for THIS type (was the fixed wedding backbone)
  statutory_pack[]      // legal/paperwork tasks, type- + faith-scoped (was the wedding paperwork line)
  phase_ordering[]      // ordered task keys for the guided sequence
  budget_tiers          // { tier1: anchor, tier2: core cluster, tier3: 'dynamic from plan-groups' }
  creates_connections[] // people-graph edges the ceremony creates (per 2026-07-04 decision), or []
  // plan_group_tree is NOT stored here — Layer 2 reads it live from event_type_profiles
}
```

**Read path (unchanged mechanically):** `ensureChecklistSeeded(event)` → load `EventTypeChecklistDef[event.event_type]` → seed backbone + statutory + Layer-2 tasks from the plan-group tree → apply `phase_ordering` → run the same adaptive state machine.

---

## 3. The biggest generalization — `date_model`

The wedding design's central idea ("the date is the OUTPUT of vendor discovery") is **wedding- and christening-specific**. It's true only when a scarce, externally-scheduled resource (a church + a booked-out reception venue) drives the calendar. For most events the date is fixed *first* and everything is planned around it.

| date_model | Meaning | Types | Checklist behaviour |
|---|---|---|---|
| **`output`** | Date emerges from venue/venue-pair availability | wedding, christening | Never step 1. Shortlist anchor → `/find-date` Schedule Matrix → lock. |
| **`input`** | Date is chosen/fixed up front | debut, birthday, corporate, tournament, gender_reveal, travel, celebration | Date **is** an early step. Skip the Matrix; deadlines count backward from the set date. |

For `input` types the "reception venue anchors the date" logic is off; the anchor category still exists (it's the biggest cost + capacity constraint) but it no longer *reshapes* the date — it's just booked first.

---

## 4. Budget-tier generalization

The wedding "Tier 1 anchor / Tier 2 the 4-Big / Tier 3 the rest" model generalizes with the anchor swapped per type:

- **Tier 1** = `anchor_category` — the single most capacity/date/cost-constraining vendor. Booked first.
- **Tier 2** = the type's **core cluster** — the 2–4 categories that dominate the remaining budget (60–75% for weddings; per-type below).
- **Tier 3** = everything else, **computed dynamically** from `interested_categories ∩ plan-group tree − (Tier 1 ∪ Tier 2)`. Already dynamic in code — no change.

The health-check formula (`buffer = total − committed − projected(min..max) − paperwork`) is unchanged; only the **paperwork** term becomes the per-type `statutory_pack` (empty → ₱0 for most types).

---

## 5. Per-type definitions

Wedding is the **reference** (re-expressed from today's hardcoded constants so nothing regresses). The 8 enabled types follow.

### 5.0 Wedding (`wedding` / Kasal) — REFERENCE

| Field | Value |
|---|---|
| date_model | **output** |
| anchor_category | `reception_venue` (then `ceremony_venue`) |
| Tier 2 core | ceremony venue · catering · coordinator · photo & video (60–75% of budget) |
| statutory_pack | `marriage_license` · `psa_cenomar` · `church_fee` (Catholic) · `pre_cana` (Catholic) — faith-scoped; Muslim pack per [`Muslim_Wedding_Build_Plan_2026-06-28.md`](Muslim_Wedding_Build_Plan_2026-06-28.md) |
| creates_connections | `spouse` (the couple) · `principal_sponsor` (ninong/ninang) |
| phase highlights | type & vibe → who-pays → guest count → budget → **reception shortlist → ceremony shortlist → parish reqs → /find-date → lock date** |

### 5.1 Debut (`debut`)

The Filipino 18th. Date is essentially fixed (on/near the 18th birthday).

| Field | Value |
|---|---|
| date_model | **input** (anchored to the 18th birthday; venue booked around it) |
| anchor_category | `venue` (banquet hall / events place) |
| Tier 2 core | catering · photo & video · host/emcee · lights & sounds |
| statutory_pack | — (none) |
| creates_connections | — |
| type-signature backbone tasks | pick the **court** (18 roses · 18 candles · 18 treasures · 18 shots) · cotillion choreographer & rehearsal · debut gown + escort attire · program script (grand entrance, first dance, message segments) |
| Tier-3 plan groups (typical) | HMUA · gowns/attire · cake · florist/stylist · souvenirs · photobooth · emcee · AVP/same-day-slideshow |

### 5.2 Birthday (`birthday`)

Covers kids' and adults' parties — the checklist reads `interested_categories`, so a kids' party seeds entertainers and an adult party seeds a bar.

| Field | Value |
|---|---|
| date_model | **input** (the birthday) |
| anchor_category | `venue` (may be home → anchor null if "at home" chosen) |
| Tier 2 core | catering · cake · host/entertainer · photo |
| statutory_pack | — |
| creates_connections | — |
| type-signature backbone tasks | set theme · finalize headcount · cake & food order · entertainment (clown/magician/mascot for kids · band/DJ for adults) · party favors |
| Tier-3 plan groups (typical) | decor/balloons · photobooth · face-painting/games · mobile bar · styling · souvenirs |

### 5.3 Christening (`christening` / Binyag)

Second `output`-date type — the **parish baptism schedule** constrains the date like a wedding's church does.

| Field | Value |
|---|---|
| date_model | **output** (parish baptism slot + reception venue availability) |
| anchor_category | `parish_schedule` → `reception_venue` |
| Tier 2 core | catering/reception · photo & video · cake |
| statutory_pack | `baptismal_application` · `godparents_requirements` (confirmation certs for ninong/ninang) · `pre_baptism_seminar` · `parish_fee` — parish-dependent |
| creates_connections | `godparent ↔ godchild` (minor gate — child side is Phase 3 / guardian-held, per [`People_Graph_and_Lifelong_Identity_2026-07-04.md`](../03_Strategy/People_Graph_and_Lifelong_Identity_2026-07-04.md)) |
| type-signature backbone tasks | book parish + confirm baptism date · confirm godparents & collect their requirements · attend pre-baptism seminar · baptismal outfit/gown · candle & shell |
| Tier-3 plan groups (typical) | host · decor/stylist · souvenirs · photobooth · AVP |

### 5.4 Corporate (`corporate`)

Conference / gala / launch / teambuilding. Date is set by the company calendar.

| Field | Value |
|---|---|
| date_model | **input** (company-chosen date) |
| anchor_category | `venue` (function hall / hotel / resort) |
| Tier 2 core | catering · AV & production · host/emcee · photo & video |
| statutory_pack | `venue_permits` · `contract_signoff` (may link 0032 Contract Intelligence); BIR ORs handled by 0026, not a checklist task |
| creates_connections | — |
| type-signature backbone tasks | define objective & format · finalize program/agenda · confirm headcount & RSVP list · AV/tech run-through · giveaways/tokens · signage & branding |
| Tier-3 plan groups (typical) | livestream (Live Studio) · photobooth · transport/logistics · accommodation · registration/badging · entertainment |

### 5.5 Tournament (`tournament`)

Logistics- and registration-heavy rather than styling-heavy.

| Field | Value |
|---|---|
| date_model | **input** (scheduled play dates) |
| anchor_category | `venue` (court / field / gym booking) |
| Tier 2 core | officials/referees · awards (medals/trophies) · catering · first-aid/medic |
| statutory_pack | `venue_permit` · `liability_waiver` (participant waivers) |
| creates_connections | — |
| type-signature backbone tasks | set format & brackets · open & close registration · confirm officials · secure medic/first-aid · awards & prizes · scheduling/fixtures |
| Tier-3 plan groups (typical) | livestream · photo & video · sponsorship/signage · merch · transport · food concessions |

### 5.6 Gender reveal (`gender_reveal`)

Small, single-moment event. Simple checklist.

| Field | Value |
|---|---|
| date_model | **input** |
| anchor_category | `venue` (often home → anchor may be null) |
| Tier 2 core | the **reveal element** (smoke/confetti/balloon/cake) · catering · photo & video |
| statutory_pack | — |
| creates_connections | — |
| type-signature backbone tasks | choose reveal mechanic · assign the "keeper of the secret" · order reveal element + backup · headcount |
| Tier-3 plan groups (typical) | decor/balloons · host · cake · photobooth · souvenirs |

### 5.7 Travel (`travel`)

The **outlier** — itinerary-shaped, not vendor-shortlist-shaped. Flagged as an open call (§ 6) because it may deserve a distinct "itinerary" surface rather than the vendor checklist. Interim definition:

| Field | Value |
|---|---|
| date_model | **input** (travel window) |
| anchor_category | `accommodation` (+ implicit destination) |
| Tier 2 core | flights/transport · accommodation · tours/activities |
| statutory_pack | `travel_documents` (passport/visa validity · IDs) — advisory, not a vendor task |
| creates_connections | — |
| type-signature backbone tasks | fix destination & dates · book transport · book accommodation · build day-by-day itinerary · travel docs check · travel insurance |
| Tier-3 plan groups (typical) | tour operator · car rental · photographer · activities/excursions |

### 5.8 Celebration (`celebration`) — GENERIC FALLBACK

Catch-all for anniversary / reunion / general party. Deliberately the thinnest def — it's what an event lands on when nothing more specific applies.

| Field | Value |
|---|---|
| date_model | **input** |
| anchor_category | `venue` |
| Tier 2 core | catering · photo · host |
| statutory_pack | — |
| creates_connections | — |
| type-signature backbone tasks | set purpose & theme · headcount · venue · food · program |
| Tier-3 plan groups (typical) | decor · cake · photobooth · souvenirs · entertainment |

---

## 6. Build sequence & open owner calls

**Sequence (schema/data first, per the repo per-iteration workflow):**
1. **PR-1 · De-hardcode.** Lift the four wedding constants (§ 1) into `EventTypeChecklistDef`; re-express wedding from the def so the live wedding checklist is byte-for-byte unchanged (regression gate: wedding output identical before/after). Flag-gated.
2. **PR-2 · Seed the 8 defs** into `event_type_profiles` sibling data + wire `date_model='input'` path (skip `/find-date`, count deadlines back from the set date). Each type behind the existing "Coming soon"→enabled toggle so they can go live one at a time.
3. **PR-3 · Plan-group trees.** Ensure each type's Layer-2 taxonomy tree exists in `event_type_profiles` (admin data task, not code) so Tier 3 populates.

**Open owner calls:**
1. **Travel (§ 5.7)** — vendor checklist, or a separate itinerary surface? It's the one type that doesn't fit the shortlist-a-vendor-per-category model. *Recommend:* interim vendor checklist as above; revisit an itinerary builder post-launch.
2. **Anchor-null types** (birthday / gender_reveal "at home") — confirm the checklist should drop Tier 1 gracefully rather than nag for a venue.
3. **Statutory accuracy** — the christening and (Catholic) wedding statutory packs are the only legally-loaded ones; confirm parish-requirement wording with a real parish list before these types go live to couples.
4. **Go-live gating** — do the 8 types launch together or staged? The per-type enable toggle supports either; *recommend* staged, ceremony family (christening) first since it reuses the most wedding infrastructure.
