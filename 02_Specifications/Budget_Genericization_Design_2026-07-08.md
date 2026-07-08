# Budget Health-Check + Planner — Definitive Per-Event-Type Plan

**Authored:** 2026-07-08 · **v2 (definitive)** — supersedes the same-day v1 study. Owner: "study it, do the best research and make a definitive plan that applies to our app properly and cleanly."
**Grounded in:** (1) full code study of the 3-layer budget stack, (2) a precise touch-point map of every budget surface on `origin/main`, (3) product research on multi-event budgeting (The Knot Budget Advisor · Zola Cost Index · Bridebook · Cvent · YNAB · corporate/event-pro doctrine), (4) cited PH market-price research per event type (draft seeds, § 6).
**Siblings:** [`Adaptive_Checklist_Build_Plan_2026-07-08.md`](Adaptive_Checklist_Build_Plan_2026-07-08.md) · [`Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md`](Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md)
**Product-depth axis (same day):** [`Budget_Product_Definitive_Plan_2026-07-08.md`](Budget_Product_Definitive_Plan_2026-07-08.md) — what the planner + health should BE (reminders · unified numbers · planner↔ledger loop · contributions); §5 there sequences the two plans.

---

## 0. TL;DR

The pure allocation engine and the tracking ledger need **zero changes**. Genericization = (a) an `event_type` dimension + a `cost_model` (fixed vs per-pax) column on `budget_leaf_benchmarks`, (b) per-type category templates (small — 6–11 lines per type, research-backed), (c) parameterizing the resolver + health-check by type with a **graceful degradation ladder** (never hide the ledger; degrade the *projection*), (d) owner-signed benchmark seeds (researched drafts in § 6). Market research confirms our median-anchored model is the strongest in the industry — **no competitor does benchmark-anchored allocation for non-wedding events at all**; this is whitespace.

**⚠ Immediate correctness item (PR-B1):** the checklist budget-health card (PR #2869) calls `computeBudgetHealth` with **no event-type guard**, and generic onboarding **does** write `estimated_budget_centavos` (`lib/onboarding/event-insert.ts:71-72`) — so a non-wedding event with a budget gets **wedding-shaped health numbers today**. The budget *page* already gates its planner (`isWeddingBudget`, `budget/page.tsx:141`); the checklist card must get the same guard now, ahead of everything else.

---

## 1. What the research proves (design rules we adopt)

1. **Median-anchored allocation is the winning model — keep it.** The Knot launched its Budget Advisor explicitly as a corrective to percentage rules (real local spend + visible high/low range per category); Zola runs a real-price Cost Index and demotes its own "50/20/30" to editorial. Percentage tables survive only as content marketing. Our engine is already the state of the art; nobody applies it beyond weddings.
2. **Category templates differ in STRUCTURE per event type, not just weights.** A debut adds choreographer/gown/HMUA; christening adds church-fee + souvenirs; corporate adds AV/production; travel switches to per-day × travelers. Generic party apps that reuse one list become inert trackers — avoid.
3. **Type every category as `fixed` or `per_pax`.** Industry doctrine: state budgets as fixed + (variable × pax), never blended per-head. Catering/cake/favors/souvenirs scale with pax; venue/photo/AV/coordinator don't. Event types differ in pax-elasticity (christening = food-dominated/elastic; corporate gala = production-dominated/inelastic). Cvent is the only tool that productizes this — cheap for us to carry in schema from day one.
4. **Degradation ladder — never hide the budget tool.** (The Knot within-vertical + Bridebook destination patterns): ① full median-anchored allocation (data-rich type) → ② template categories with benchmark bands flagged "estimate" → ③ template categories, **tracker-only** health (buffer = total − committed; no projected term) → ④ "build your own categories." Degrade the *projection*, keep the *ledger*.
5. **Thin-data fallback with confidence flags, never fabricated precision:** local vendor median → PH-wide median → published-range placeholder marked "estimate" → user-entered. (The Knot shows *no* estimate where data is thin; that restraint preserves trust.)
6. **Custom categories are first-class:** same object as benchmarked lines minus the market overlay; sum identically into cushion/buffer (mirrors our 28-canonical + custom vendor-taxonomy precedent).
7. **Keep default templates SMALL** (YNAB: over-granular budgets get abandoned): ~6 lines for gender reveal/tournament, ~8 birthday, ~9 christening, ~11 debut; weddings keep their 26.
8. **Contingency framing:** our cushion already implements the 10–15% norm — name-check it in copy ("a healthy 10–15% cushion").
9. **Out of V1 consciously:** revenue/break-even for ticketed types (tournament/corporate registrations) is a different formula; scope it out explicitly.

## 2. Verified architecture facts (touch-point map, `origin/main`)

**Already generic / needs NO change:** the pure engine (`lib/budget-allocation.ts`), the tracking ledger (`lib/budget.ts`), `budget-live-summary`, `share-budget-band-toggle`, `setEventBudget`, generic onboarding writers, and — critically — **the allocation-planner client is 100% row-driven** (labels from `budget_leaf_benchmarks.label` via `leaves[].label`; no hardcoded list). Once rows are type-keyed, the planner UI is automatically generic.

**Already type-aware:** `budget/page.tsx:141` `isWeddingBudget` gates the whole "Suggested budget split" section + planner to weddings; non-weddings already get total + per-vendor itemization only.

**Must change (file-precise):**

| File | What |
|---|---|
| `supabase/migrations/*` | `budget_leaf_benchmarks`: + `event_type TEXT NOT NULL DEFAULT 'wedding'` (PK → `(event_type, plan_group_id)`) + `cost_model TEXT NOT NULL DEFAULT 'fixed' CHECK (cost_model IN ('fixed','per_pax'))` + per-pax unit price column for per_pax rows |
| `lib/budget-allocation-data.ts` | `fetchActiveBenchmarks(client, eventType)`; `BenchmarkRow`/`AllocationInputs` types; `LEAF_CANONICAL_SERVICES` gains per-type entries |
| `lib/checklist-budget.ts` | per-type scope (see below) + per-type tiers + statutory pack; benchmark fetch by type |
| `lib/onboarding-availability.ts` | `PICK_TO_GROUP` is wedding-only; non-wedding picks currently resolve `undefined` and silently drop — needs per-type pick→category map (see § 3) |
| `lib/checklist.ts` | `CHECKLIST_BUDGET_TIERS` / `checklistTier3PlanGroups` → resolve from `EventTypeChecklistDef` for non-weddings |
| `app/admin/budget-planner/{page,actions}.tsx` | benchmark list + `updateLeafBenchmark` keyed by `(event_type, plan_group_id)`; UI gains event-type tabs |
| `app/dashboard/[eventId]/budget/allocation-actions.ts:61` | 🐛 hardcodes `event_type: 'wedding'` into `budget_allocation_decisions` — write the real type |
| Copy leaks | `budget-setter.tsx:74` "total **wedding** budget?" (unconditional) · `budget-countdown-header.tsx:76,166-175` wedding countdown labels (no event_type prop) · `budget/page.tsx:318` "typical Filipino **wedding** costs" |
| `app/dashboard/[eventId]/checklist/page.tsx` | PR-B1 guard on the health card |

**Key data fact (the scope-map finding):** wedding and generic onboarding write the **same vocabulary type** into `style_preferences.interested_categories` — tier-2 `service_categories.id` values — but **different id sets** (scoped by `applicable_event_types`). So the per-type scope map is a natural extension of `PICK_TO_GROUP`, not a new mechanism.

**Orthogonal (leave alone):** Muslim/Chinese budget cards branch on `ceremony_type` (a wedding *sub-type* axis) — stays inside the wedding branch. `budget_allocation_config` knobs stay global. `budget_band_config` (onboarding feel-bands) goes per-type only when a type's onboarding needs bands.

## 3. The design

### D1 · Schema
```sql
ALTER TABLE budget_leaf_benchmarks
  ADD COLUMN event_type TEXT NOT NULL DEFAULT 'wedding',
  ADD COLUMN cost_model TEXT NOT NULL DEFAULT 'fixed'
    CHECK (cost_model IN ('fixed','per_pax')),
  ADD COLUMN per_pax_php INTEGER CHECK (per_pax_php IS NULL OR per_pax_php >= 0);
-- PK: plan_group_id → (event_type, plan_group_id)
```
Wedding rows backfill via the default — **zero regression**. `per_pax` rows carry a per-head price (benchmark_php then = per_pax × a reference pax, or left null); V1 math may still consume flat benchmarks, but the schema carries the cost model from day one so no second migration.

### D2 · Per-type category templates (small, research-backed)
Category sets and tier structure come from the shipped `EventTypeChecklistDef` (`anchorCategory` = tier 1, `tier2Core` = tier 2) extended with the research templates in § 6. Per-type `PICK_TO_GROUP` extension maps each type's onboarding tile ids → its budget categories.

### D3 · Resolver + health-check parameterization, with the degradation ladder
- `resolveAllocationInputs` reads `events.event_type` → `fetchActiveBenchmarks(type)`.
- Health-check: tiers from the per-type def; statutory pack per type (wedding unchanged; christening = church donation/fee band ₱0–3,500 — see § 6 note on RCAM's 2021 fee abolition; birthday/corporate/etc = ₱0).
- **Ladder:** rows exist for type → full experience (band display per The Knot range pattern) · no rows → **tracker-only**: health = `total − committed` labeled "tracking only — estimates not configured for this event type yet", planner section replaced by the itemization the page already shows · always → ledger + custom lines work.
- Wedding output byte-identical (regression gate, same discipline as the checklist PRs).

### D4 · Benchmark data — owner-signed, never invented
§ 6 carries researched draft seeds (every figure cited + flagged [S] sourced / [E] extrapolated). The table's standing rule holds: prices are owner/admin-set. Owner reviews § 6 → approves/edits → rows land via admin UI or a seed migration.

### D5 · V2 (scoped, not now)
- **Per-pax projection math** in health-check/planner (`per_pax × estimated_pax` for elastic lines).
- **Event-type-scoped market medians** once the vendor service-card "Serves" data ships (a caterer's wedding price stops informing birthday medians).
- Custom category lines UI; per-type feel-bands; break-even for ticketed types.

## 4. PR sequence

| PR | Scope | Size | Gate |
|---|---|---|---|
| **B1** | Guard the checklist health card: non-wedding → `null` (card hidden) until per-type config exists. Fixes the live wedding-numbers leak. | tiny | ships immediately |
| **B2** | D1 migration + admin planner event-type tabs + type-keyed upsert + the `allocation-actions.ts:61` hardcode bug + the 3 copy leaks (setter/countdown/subheading) | med | wedding rows byte-identical; admin can enter type-keyed rows |
| **B3** | D3 parameterization + degradation ladder (tracker-only mode) + per-type scope map | med | wedding output byte-identical; a benchmark-less type shows tracker-only, never wedding numbers |
| **B4** | § 6 seeds per launching type — **after owner sign-off** | data | owner approval recorded in DECISION_LOG |
| **V2** | D5 items | later | — |

## 5. Owner decision points
1. **Approve/edit the § 6 draft seeds** (per type, before any seeding). Two dated anchors need re-verification: church fees (2013 survey; RCAM abolished fixed fees 2021 → model as donation band) and referee rates (2019 quotation).
2. **Which types launch with benchmarks vs tracker-only.** Recommendation: **debut first** (best-evidenced data — three independent 2024–26 package rate cards), birthday second; christening/corporate tracker-only until their thin anchors are re-verified; tournament/gender-reveal/travel/celebration tracker-only.
3. Whether §-6 seeding happens via admin UI (canonical) or a reviewed seed migration (faster).

## 6. Researched draft benchmark seeds (PHP · Metro Manila anchor · owner sign-off required)

> Every figure cited in the research log; [S] = directly sourced, [E] = extrapolated. Provincial deltas where known: Davao binyag catering ≈ 40–60% below MM; ceilings compress outside NCR while floors hold. p75 = seed for "high". Full source list in the research annex (DECISION_LOG row).

### Debut (best-evidenced — recommended pilot) · ~11 lines
| Category | cost_model | Floor | Typical | p75 |
|---|---|---|---|---|
| Venue + package anchor (100 pax all-in) | fixed | 77,000 [S] | 148,000–188,000 [S] | 250,000 [S] |
| Catering (per head) | per_pax | 345 [S] | 750 [S] | 1,250 [S] |
| Photo & video | fixed | 25,000 [S] | 30,000–50,000 [S] | 75,000+ [S] |
| Debut gown (custom / rent split line) | fixed | 1,500 rent [S] | 20,000–30,000 custom [E] | 60,000 [E] |
| HMUA | fixed | 1,200 [S] | 7,500 [S] | 30,000 [S] |
| Cotillion choreographer | fixed | 15,000 [S] | 25,000 [E] | 40,000 [S] |
| Host / emcee | fixed | 1,500 [S] | 5,000–15,000 [S] | 20,000 [S] |
| Lights & sound (+LED) | fixed | 5,000 [S] | 15,000–25,000 [E] | 40,000 [E] |
| Styling / decor | fixed | 15,000 [E] | 40,000–60,000 [E] | 99,000 [S] |
| Cake | fixed | 1,500 [S] | 3,500 [E] | 8,500 [S] |
| Program extras (18 roses/candles) | fixed | 0 [S] | 3,000–5,000 [E] | 10,000 [E] |

### Birthday · ~8 lines
| Category | cost_model | Floor | Typical | p75 |
|---|---|---|---|---|
| Venue / room hire | fixed | 3,000 [S] | 15,000–20,000 [S] | 50,000 [S] |
| Catering (per head) | per_pax | 345 [S] | 550–800 [E] | 1,250 [S] |
| Cake (custom/themed) | fixed | 1,000 [S] | 3,500 [E] | 8,500 [S] |
| Host / entertainer (clown·magician·mascot) | fixed | 1,500 [S] | 3,000–3,500 [S] | 8,000 [E] |
| Photographer | fixed | 3,000 [E] | 10,000 [S] | 25,000 [S] |
| Photo booth | fixed | 2,700 [S] | 7,500 [S] | 11,000 [S] |
| Styling / balloons | fixed | 3,000 [E] | 8,000–15,000 [E] ⚠ thin | 30,000 [E] |
| Favors (per pc) | per_pax | 20 [S] | 50–100 [S] | 200 [S] |

### Christening (binyag) · ~9 lines — ⚠ church anchor dated
| Category | cost_model | Floor | Typical | p75 |
|---|---|---|---|---|
| Church fee/donation | fixed | 0 [S — RCAM donation-based since 2021] | 500–1,000 [E] | 3,500 [E] |
| Reception venue/package | fixed | 12,000 [E] | 25,000–35,000 [E] | 50,000 [E] |
| Catering (per head) | per_pax | 345 [S] | 550–650 [S dated] | 1,250 [S] |
| Cake | fixed | 500 [S] | 1,500–3,000 [S/E] | 5,000 [E] |
| Photographer | fixed | 3,000 [E] | 5,000–10,000 [S/E] | 15,000 [S] |
| Baptismal outfit | fixed | 999 [S] | 2,000–2,555 [S] | 4,000 [E] |
| Souvenirs (per pc) | per_pax | 8 [S] | 50–100 [S] | 200 [S] |
| Styling | fixed | 3,000 [E] | 8,000 [E] ⚠ thin | 15,000 [E] |

### Corporate · ~7 lines
| Category | cost_model | Floor | Typical | p75 |
|---|---|---|---|---|
| Venue (function hall/day) | fixed | 15,000 [S] | 50,000 [S] | 150,000 [E] |
| Catering (per head, +10% SC +12% VAT) | per_pax | 345 [S] | 750–1,000 [S] | 1,400 [S] |
| AV / production | fixed | 40,000 [E] | 80,000–120,000 [E] | 150,000 [S — gov ABC anchor] |
| Host / emcee | fixed | 5,000 [S] | 10,000–15,000 [S] | 20,000+ [S] |
| Photo & video | fixed | 10,000 [S] | 25,000–40,000 [S] | 50,000+ [S] |
| Styling / branding | fixed | 20,000 [E] | 50,000 [S] | 300,000+ [S] |
| Teambuilding facilitator | fixed | 20,000 [E] | 60,000 [S] | 100,000+ [E] |

### Tournament · ~6 lines — ⚠ referee anchor 2019
Court/day 12,000[E]–25,000[E]–45,000[E] (hourly [S] 1,500–3,000–6,000) · officials/game 300[E]–600[S dated]–900[S dated] (per_game, model as per_pax-like unit) · medals/trophies 30–1,500 [E, thin] · medic 3,000/hr [S] · packed meals per_pax 150[E]–345[S]–500[E].

### Gender reveal · ~6 lines
Reveal props 150–600 [S] · small venue 8,000[E]–20,000[S]–35,000[S provincial-hotel] · catering/grazing 5,000[S]–11,500[S]–29,000[S] · reveal cake 500[S]–3,000[S]–5,000[E] · photographer 3,000[E]–10,000[S]–50,000[S].

### Travel / Celebration
Tracker-only at launch (travel is per-day × travelers math — a different engine mode; celebration is the generic fallback). Custom lines carry them.
