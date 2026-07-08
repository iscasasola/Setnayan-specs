# Budget Health-Check + Planner — Wedding-Coupling Study & Per-Event-Type Design

**Authored:** 2026-07-08 (owner: "study how it conforms to wedding and how we can make it adapt to all types of events")
**Status:** Study complete · design proposed · **benchmark seeding is owner data** (blocked on sign-off, never invented)
**Code studied:** `lib/budget.ts` · `lib/checklist-budget.ts` · `lib/budget-allocation.ts` · `lib/budget-allocation-data.ts` · migrations `20260826000000` + `20260829000000`
**Siblings:** [`Adaptive_Checklist_Build_Plan_2026-07-08.md`](Adaptive_Checklist_Build_Plan_2026-07-08.md) (gap #5) · [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md`](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md) (per-type anchors/tiers)

---

## 1. The budgeting stack is THREE layers — and only the data layers are wedding-shaped

| Layer | Module | Job | Wedding-coupled? |
|---|---|---|---|
| **Tracking** | `lib/budget.ts` | What booked vendors ACTUALLY cost — line items + payments per `event_vendors` row | ✅ **Already generic** (0 wedding references; works for any event today) |
| **Health-check** | `lib/checklist-budget.ts` `computeBudgetHealth` | `buffer = total − committed − projected − paperwork`, best/worst-case range | 🔴 4 coupling points (H1–H4) |
| **Allocation planner** | `lib/budget-allocation.ts` (pure engine) + `budget-allocation-data.ts` (resolver) + `budget_leaf_benchmarks` | What each service SHOULD cost — ₱ target + shopping band per category, before picking vendors | 🔵 **Engine is pure/generic by design**; coupling is entirely in the DATA + resolver (P1–P4) |

**The headline finding:** the allocation engine (`computeBudgetAllocation` — medians → shares → ₱ targets, cushion/park, pins, soft floors) is explicitly integration-agnostic and needs **zero changes**. The same is true of the couple-facing inputs (`events.estimated_budget_centavos`, `estimated_pax` — type-agnostic columns). **Genericization is a data-keying problem, not an engine rewrite.**

## 2. The precise wedding-coupling points

### Health-check (`checklist-budget.ts`)
- **H1 — Tiers:** `CHECKLIST_BUDGET_TIERS` hardcodes `tier1 = ['reception_venue']`, `tier2 = ['ceremony_venue','catering','coordinator','photo_video']` (`checklist.ts:581-585`).
- **H2 — Scope mapping:** the couple's `interested_categories` → plan groups via `PICK_TO_GROUP` (wedding picker vocabulary).
- **H3 — Category universe:** `checklistTier3PlanGroups` derives from the 22-wedding-plan-group set.
- **H4 — Paperwork:** `estimatePaperworkCentavos(ceremony_type)` = marriage license + CENOMAR + church fee + pre-Cana / civil fee — PH *marriage* law, meaningless for a birthday.

### Planner (data + resolver)
- **P1 — Schema:** `budget_leaf_benchmarks.plan_group_id` is the **PRIMARY KEY** — one flat wedding category set with **no event-type dimension**. The seeded prices are wedding-scale (catering benchmark ₱450,000; reception venue ₱100,000).
- **P2 — Scoping:** `fetchActiveBenchmarks` returns ALL active rows → every event, regardless of type, gets the full ~26 wedding leaves in the planner.
- **P3 — Median mapping:** `LEAF_CANONICAL_SERVICES` (resolver-local const) maps each wedding plan group → the vendor `canonical_service` keys whose solo prices feed its market median.
- **P4 — Medians are NOT event-type-scoped:** `fetchLeafMedians` filters `vendor_services` by canonical_service only. A caterer's single `starting_price_php` serves as the median input whether the event is a 200-pax wedding or a kids' party — vendor prices carry no event-type axis yet. *(Note: the 2026-07-02 service-card redesign gives every service a "Serves" checklist of event types — once shipped, medians CAN be event-type-scoped.)*
- **P5 (noted, not a coupling):** pax-normalization is explicitly a follow-on ("benchmarks are flat per-leaf in V1") — and event types differ in pax-sensitivity (wedding catering scales with pax; a tournament's referees don't).

## 3. Design — key everything by `(event_type, category)`, engine untouched

**Principle:** one benchmark table, one engine, one resolver — with an event-type dimension on the *data* and per-type *category sets* from the already-shipped `EventTypeChecklistDef`. Wedding rows default-key to `'wedding'` → zero regression.

### D1 · Schema (small migration)
```sql
ALTER TABLE budget_leaf_benchmarks ADD COLUMN event_type TEXT NOT NULL DEFAULT 'wedding';
-- PK: plan_group_id → (event_type, plan_group_id)
```
Existing wedding rows are untouched (default backfills them). `/admin/budget-planner` gains an event-type selector so benchmarks per type are **admin-set, never invented** (the table's own standing rule).

### D2 · Per-type category sets (mostly already exists)
Each type's budget categories come from the shipped per-type defs: `anchorCategory` = tier 1, `tier2Core` = tier 2, the def's vendor tasks = tier 3 universe. E.g. birthday: `venue` / `catering·cake·entertainment·photo_video` / rest. Formalize as rows in the (now type-keyed) benchmarks table; extend `LEAF_CANONICAL_SERVICES` with the per-type category → canonical_service mappings (e.g. birthday `entertainment` → `host_emcee`, `band_dj`, kiddie entertainers when the taxonomy carries them).

### D3 · Resolver + health-check parameterization (the code PR)
- `fetchActiveBenchmarks(client, eventType)` filters by type; `resolveAllocationInputs` reads `events.event_type`.
- Health-check tiers resolve from the per-type def instead of `CHECKLIST_BUDGET_TIERS` (wedding falls back to the existing constants — byte-identical).
- Paperwork becomes the per-type **statutory pack** (christening: parish/baptismal fees · birthday: ₱0 · wedding: unchanged).
- **Fail-safe:** an event type with no benchmark rows → planner/health-check render "not configured for this event type yet" (or hide), NEVER wedding numbers. This guard is shippable immediately, before any data exists.

### D4 · Benchmark data per type — OWNER DATA (the real gate)
The prices themselves ("a kids' party venue in the PH runs ₱X–₱Y") are product/market judgment. Same class as `applicable_event_types`. Options: owner enters via admin UI as types launch (canonical), or Claude drafts research-based starter seeds **for owner review + sign-off** — never silently applied.

### D5 · V2 — event-type-scoped market medians
Once the service-card "Serves" data ships, `fetchLeafMedians` adds a serves-this-event-type filter so a caterer's wedding price stops informing birthday medians. Until then, non-wedding medians stay benchmark-carried (minSampleN gates thin data anyway).

### Build order
1. **PR-B1** — D3's fail-safe guard (hide/"not configured" for non-weddings) — tiny, removes the wrong-numbers risk immediately. *(Interim fix for audit gap #5.)*
2. **PR-B2** — D1 schema + admin event-type selector.
3. **PR-B3** — D3 full parameterization (tiers/paperwork/resolver by type; wedding byte-identical gate).
4. **Data** — D4 seeds per launching type (owner).
5. **V2** — D5 medians when "Serves" lands.

## 4. What does NOT need to change
- The pure allocation engine (all math, cushion, pins, confidence) — untouched.
- The tracking layer (`lib/budget.ts`) — already generic.
- `budget_allocation_config` knobs — statistical, type-agnostic.
- The couple-facing budget/health UI components — they render whatever the resolver hands them.
