# Taxonomy — Event-Type Applicability + Wedding Faith-Exclusivity (Design)

> **Status:** IN BUILD — Phases 0–3 SHIPPED 2026-06-11 (PRs #1223 Ph0 refinement-FK · #1224 Ph1 event-type cols · #1226 admin event UI · #1232 de-faith food · #1235 unit tests · #1238 Ph2 faith_vocab+admin faith control · #1241 couple-side shared filters; migrations `20261103/04/05/09` applied to prod). Owner ratifications: §8.3 match-scope-only · §8.4 cultural-stays-universal (AMENDED 2026-06-11: halal catering removed from faith-tagged examples per `Catering_Dietary_Halal_Model_2026-06-11.md` option 1c); remaining §8 items use the recommended defaults. Remaining: Ph4 wedding-only-tile backfill · dietary graded-capability cutover · non-wedding refinement content · 0043 `mixed_resolution`.
> **Date:** 2026-06-10 · **Author:** Claude Code (lead-architect workflow: 5 readers → 3 designs → synthesis → 3 adversarial critics → memo).
> **Grounding:** reflects shipped code at `~/.setnayan-tax-read/apps/web` @ `origin/main` (code wins over corpus). Critiques verified against shipped code.
> **Companion to:** the in-flight taxonomy unification (single-source + FK-anchor refinements + de-hardcode + photo-per-refinement).

**One-line thesis:** Ship the *event-type* half cleanly (genuinely additive and safe). For the *faith* half, **do NOT lowercase the live `faith` column** — that breaks the marketplace on apply. Reconcile faith at the read boundary with a vocabulary lookup, keep storage as-is, add the missing admin write control. Drop the two reversal traps the critiques caught (`faith_mode='except'` hard-hide; `event_type_launch_status`).

---

## 1. The model in one picture

```
service_categories  (THE SPINE — 10 parents · 54 tiles · tier3=0)
│
├─ tier1 PARENT (venue, look, booths, …)
│     • applicable_event_types TEXT[]  ← admin-set ONLY, read for THIS node; NEVER cascades
│
├─ tier2 TILE (ceremony_venue, catering, henna_tattoo, …)   ◄── EVENT-TYPE attaches HERE (primary)
│     • applicable_event_types TEXT[]  NULL = universal      ◄── the one genuinely net-new column
│     • (NO faith column on tiles in V1 — except-hide dropped)
│        │
│        └─ canonical_service_taxonomy  (199 rows, FK → tile_id)   ◄── FAITH attaches HERE (authoritative, REUSED)
│              • faith TEXT  (EXISTING column — Catholic/Christian/INC/Muslim/Cultural, title-case, 25/199 tagged)
│              • applicable_event_types TEXT[]  NULL = inherit tile (rare per-service override)
│
└─ onboarding_refinements  (38 leaves, FK → tile_id once unification lands)
      • NO scoping columns — inherits its anchor tile's resolved (event_type, faith) visibility

Resolution (computed ONCE in snapshotFromRows / getTaxonomy — the single chokepoint):
  effectiveEventTypes = canonical.applicable_event_types ?? tile.applicable_event_types ?? UNIVERSAL
  faithApplies        = (COALESCE(events.event_type,'wedding') === 'wedding')   ← hard guard, NOT ceremony_type presence
  faithMatch          = !faithApplies OR canonical.faith IS NULL OR canonical.faith ∈ coupleFaithSet
```

**Two requirements, two natural homes, deliberately split:** event-type relevance is a whole-tile property (admins reason over 54 tiles, not 199 services); faith-exclusivity is intrinsic to the *service* (an imam under a generic officiant grouping), so it stays at the canonical grain on the column that already exists.

---

## 2. Event applicability

**Net-new columns (additive, nullable):**
- `service_categories.applicable_event_types TEXT[] NULL` — **primary control, tile grain** (+ GIN index for the reverse "which tiles serve event X" query).
- `canonical_service_taxonomy.applicable_event_types TEXT[] NULL` — optional per-service override (override-wins when non-NULL).
- Validation via **lookup table, not the live enum:** new `public.event_type_vocab(event_type PK, label_en, sort_order, status)`, seeded from the enum values; a `BEFORE INSERT/UPDATE` trigger checks each array member ∈ vocab. *(Why: the `event_type` enum is evolved by a RENAME-recreate-swap migration; a trigger that casts to the enum or reads `enum_range()` throws mid-swap. A vocab table survives the swap and makes "a dropped value degrades to a harmless dead string" actually true.)*

**Semantics — include-set, admit-unknown:** `NULL`/empty = universal (all event types); non-empty = exclusive allow-list. Membership = the same NULL-safe-OR shape `vendor_profiles.event_types` already uses.

**Default for an unassigned category on a new event type → FAIL-OPEN (universal).** Every existing row backfills to NULL = universal = byte-identical wedding behavior on landing; onboarding a new type means *narrowing* (tag the ~10 wedding-only tiles OUT), never re-tagging 54; fail-closed would empty a new type's catalog on day one.

**Two guards the critics forced:**
- **Event-side never-empty:** consumers must `COALESCE(events.event_type,'wedding')` — a legacy NULL-type row would otherwise test `NULL = ANY({wedding})` → NULL → wedding-only tiles vanish. Invariant: never-empty holds on BOTH the tile side (NULL tile = universal) AND the event side (NULL/absent event_type → treat as wedding).
- **Hide-empty interaction:** the display pass also runs `passesHideEmpty` (zero-vendor tiles hidden unless phase ∈ `CATALOG_LIVE_PHASES`). A freshly-launched event type has ~zero vendors → near-empty catalog even though event-type filter says "show." The never-empty proof must hold against the FULL pass, not the new filter alone → owner decision §8.8.

---

## 3. Wedding faith-exclusivity

**The reuse — and the blocker it must not trip.** `canonical_service_taxonomy.faith` already exists, is already hydrated into `TaxonomyEntry.faith` (`taxonomy-db.ts`), and is already consumed by `passesReligionFilter` (`vendors/page.tsx`). Real gaps: (a) **no admin WRITE control** (`createCanonicalLeaf` mints every service faith-NULL); (b) vocabulary drift.

**🚫 BLOCKER — do NOT lowercase the column.** Verified in code: `FaithKey` is title-case (`Catholic|Christian|INC|Muslim|Cultural|Chinese|Jewish|Born Again`); `passesReligionFilter` does strict `meta.faith === activeFaith`; `mapCeremonyTypeToFaith` converts the lowercase `ceremony_type` UP to title-case before comparing. Lowercasing the 25 tagged rows makes `'catholic' === 'Catholic'` false → **every faith-tagged service (all 25, incl. the 20 marketplace_hidden officiants) silently vanishes** — the "untagged always delivered" contract inverts into "tagged never delivered." Migration `20260803001000` also ends with `faith = EXCLUDED.faith` over title-case seed VALUES, so any re-seed clobbers a lowercase migration straight back.

**The fix — reconcile at the read boundary, leave storage title-case:**
1. New `public.faith_vocab(faith_key PK, label_en, sort_order, is_civil BOOL, status)` seeded with the title-case keys **+ `Civil` (is_civil=TRUE)**. Single source of truth; `events.ceremony_type` (lowercase) bridges via the existing `mapCeremonyTypeToFaith`. Storage untouched → zero data mutation, zero comparator break.
2. Widen the `faith` CHECK from 5 → the `faith_vocab` set (FK or FK-validating trigger) so `Chinese/Jewish/Born Again` become taggable (additive — widening an allow-list never invalidates rows).
3. Make re-seed durable: add the widened set to the seed VALUES **or drop `faith = EXCLUDED.faith`** from the `ON CONFLICT`. Add a CI assertion: no `faith` value outside `faith_vocab`.
4. Add the admin write control (§5).

> A *later* one-lowercase-vocabulary-everywhere is an **atomic data+code+seed cutover PR** (lowercase 25 rows + `mapCeremonyTypeToFaith`→identity + retype `FaithKey`/`FAITH_URL_TO_KEY`/`FAITH_KEY_TO_LABEL`/`passesReligionFilter` + lowercase seed VALUES, all together). Owner's choice (§8.1) — not smuggled into this migration.

**Three states, INCLUDE-only:**
- **Universal** (`faith IS NULL`, 174/199) — surfaces for every couple. Default; "untagged always delivered."
- **Faith-exclusive (INCLUDE)** (`faith='Muslim'`) — surfaces ONLY for matching couples (`muslim_imam`, `pre_cana_seminar`). Additive; never subtracts a tile a couple would otherwise see.
- **Faith-EXCLUDED ("everyone except faith X") → DROPPED from V1.** It's the only construct that can *silently subtract* a generic tile (an open-bar tile vanishing from a Muslim couple with no explanation), and its composition with the mixed two-rite union is undefined. A Muslim couple should still SEE a bar tile and decide; the alcohol case is served by a **non-destructive advisory chip** (reuse `PlanCardCompatibilityIssue`), never a hard hide. **Net: faith has exactly ONE grain in V1 — the canonical column — and only ever ADDS.**

**Civil / no-religion:** `Civil` is a first-class `faith_vocab` key (`is_civil=TRUE`), not a tag on ordinary services. A civil couple matches every `faith IS NULL` service + the civil-officiant canonicals (`civil_judge/mayor/justice_of_peace`, tagged `Civil`) and sees no religious officiants. `buildSequence` already skips the faith grid for civil — no onboarding change.

**Mixed & inter-faith (a SET rewrite, not a one-liner).** Shipped `passesReligionFilter` compares a single scalar `activeFaith` (primary `ceremony_type` only); the secondary-rite union lives only in the vendor-gate query, not the catalog tile filter. Fix: build `activeFaithSet` from primary AND secondary ceremony type; `passesReligionFilter(meta) = set.size===0 || !meta.faith || set.has(meta.faith)`; audit every single-value caller (`crossFolderFaithCounts`, the Ceremony faith-pill UI) and **add the filter to `category-search.ts`/`wizard-recommendations.ts`, which has NO tile faith filter today** — both couple-facing surfaces must apply the same predicate or they disagree.

**Hard `event_type==='wedding'` guard:** wrap ALL faith resolution — `ceremony_type` DEFAULTS to `'catholic'`, so a corporate event carries a stale faith; without the guard a corporate event would narrow to Catholic. Regression test: corporate event w/ `ceremony_type='catholic'` sees the full faith-NULL universe.

**Neutral-single inter-faith — scoped OUT, prerequisite stated.** The "neutral-single strips faith venues; dual=union" model is a 2026-06-04 memory note "pending Cowork into 0043," absent from code/migration/spec. No `events` column captures ceremony COUNT, so a neutral-single couple is stored as `mixed`+secondary and would get the dual union. **This design assumes shipped dual-union Mixed.** Neutral-single is BLOCKED until 0043 lands a flag (e.g. `events.mixed_resolution CHECK IN ('single_neutral','dual_union')`): `single_neutral → activeFaithSet=∅`, `dual_union → union`.

**Cultural vs religious.** Do **NOT** put faith scoping on attire/booth tiles (`filipiniana_barongs`, `henna_tattoo`). A Filipiniana barong is a *look* choice orthogonal to ceremony faith — a Catholic couple wanting one must not have it hidden. Cultural *flavor* is a refinement/option concern (already modeled in `onboarding_refinement_options`), not a faith gate. Reserve `faith` tags for genuinely faith-restricted *services* (officiants, pre-cana, counseling). **§8.4-AMENDED 2026-06-11:** halal-certified catering is NOT a faith-tagged service — dietary is a per-vendor graded capability, never a faith gate (`Catering_Dietary_Halal_Model_2026-06-11.md`, owner option 1c; the live `halal_catering` carve-out was de-faithed in PR #1232 and stays a faith-NEUTRAL "Halal Catering Specialists" discovery canonical visible to all). The henna "faith-exclusive in weddings / generic for birthdays" tension dissolves: faith bites only when `event_type='wedding'`, and a generic henna service stays `faith IS NULL`; only a `muslim_henna_artist` *canonical* would carry a tag.

---

## 4. Grain & inheritance

| Attaches at | Event-type | Faith |
|---|---|---|
| **Parent (tier1)** | explicit admin value, read for that node only — **NEVER cascades** | none |
| **Tile (tier2)** | **PRIMARY** `applicable_event_types` | none in V1 |
| **Canonical-service** | optional override | **AUTHORITATIVE** `faith` (reused column) |
| **Refinement leaf** | inherits anchor tile | inherits anchor tile |

Event-type cascade: canonical override → tile → universal, resolved **once** in `snapshotFromRows()`. Faith: canonical-only, INCLUDE-only, wedding-only.

**🚫 HARD ordering dependency:** refinements gate on their anchor tile's scope **only once `onboarding_refinements.tile_id` FK lands** (Phase 0). Today the table has no tile_id; 11/38 leaves anchor by naming-alias only. Event-type/faith gating of refinements MUST NOT ship before the FK, or birthday couples see wedding refinement cards. If this design ships first: resolve via the 11-alias map at read time; absent resolution, default refinements to admit-all (never empty), never name-match-mis-gate.

---

## 5. Admin assignment UI

**Surface: extend the existing `/admin/taxonomy` — NO new page.** Controls land on rows that already exist; all writes clone `remapCanonical` (`actions.ts` L190: `requireAdmin()` → read before-state → UPDATE → `admin_audit_log` → `revalidatePath('/admin/taxonomy','/vendors')`).

- **Event-type (tile row + optional canonical override):** multi-select chip group of the `event_type_vocab` values, "All events (universal)" as cleared default. Empty save = NULL = universal. Actions `setCategoryEventTypes` / `setServiceEventTypes`.
- **Faith (canonical ServiceLine):** the faith Badge is **read-only today** (`page.tsx` ~L827) — replace with an editable dropdown from `faith_vocab` (Universal + faiths + Civil). Action `setServiceFaith`. **Add `faith` to `createCanonicalLeaf`/Advanced-add** so admin-minted services aren't born faith-blind.
- **Bulk write (54 tiles × 199 canonicals is unworkable per-row):** (1) parent-grain BULK SET writing the same `applicable_event_types` to all child tiles in one explicit action (NOT a silent cascade — preserves no-cascade while making "tag whole `look` parent {wedding}" one click); (2) copy-scope-to-siblings; (3) filtered views ("faith-tagged only" / "wedding-only tiles").
- **Effective-preview caption:** each row shows the resolved outcome per ambiguous context — "Effective for: [civil] [mixed Cath+Muslim] [corporate]" — plus a blast-radius readout ("hides tile X from N in-flight events").

**Client integrity:** cloned actions MUST use the same **RLS-respecting, `is_admin()`-gated** client `remapCanonical` uses — not a service-role client. New tables copy the verbatim RLS block (read-all anon/auth, admin_write `is_admin()`) at CREATE TABLE time. `requireAdmin()` + `admin_audit_log` non-optional.

**Launch gating NOT in scope.** Per DECISION_LOG row 583 (2026-06-04 "keep everything live"), all 9 event tiles are `enabled:true`. This design does **NOT** add `event_type_launch_status` (that resurrects killed gating and is orthogonal: "can a couple pick this type" vs "which categories it sees"). The unbuilt non-wedding gap is a tailored `onboardingHref`, not a launch gate. `/admin/wedding-types` stays the per-faith launch lever, unchanged.

---

## 6. Three-actor connections

- **ADMIN assigns** on `/admin/taxonomy`: tiles get `applicable_event_types`; faith-exclusive *canonicals* get `faith` via the now-editable dropdown. Audit-logged; no deploy (`getTaxonomy` re-reads live). Faith finally has the write control it always lacked.
- **COUPLE sees** a pre-filtered catalog, no controls. Wedding Catholic = universal + Catholic services (not `muslim_imam`); civil = universal + civil officiants; mixed Cath-Muslim = both rites' officiants (additive); future birthday = universal tiles only, no faith branch. Where a tile is absent for clear reason, surface a non-destructive chip ("officiant services are wedding-specific") rather than a silently-narrower screen.
- **VENDOR declares** coverage via the EXISTING `/vendor-dashboard/profile`: `vendor_profiles.event_types[]` + `compatible_ceremony_types[]` (unchanged runtime gate). **Composition:** category-applicability is the OUTER gate (does this tile exist for this event/faith at all), vendor-coverage the INNER gate (which vendors fill it).

**Connection gaps surfaced (not silently closed):**
1. **Faith-exclusivity is DISPLAY/match scope, NOT a vendor publish-eligibility gate.** Nothing today stops an arbitrary vendor listing under `catholic_priest`. In practice the faith-exclusive canonicals are the 20 admin-seeded `marketplace_hidden` rows (not vendor-self-served), so it's contained. Vendor-listable faith-restricted services would need a net-new vendor-side faith-publish check → §8.3. **V1 = match-scope only.**
2. **Admin→vendor silent-unreach:** tagging a tile `{corporate}` makes a `event_types=['wedding']` vendor under it unreachable with no notification → flag for a future admin→vendor signal.
3. **Two-admin gate (§3.15):** recommend single-admin for event-type tagging (reversible, low blast radius); surface whether faith-exclusivity / whole-class INCLUDE allow-lists warrant the two-admin gate → §8.7.

---

## 7. Migration phasing (folds into the unification, additive & ordered)

- **Phase 0 (prerequisite, separate PR) — refinement FK.** Land `onboarding_refinements.tile_id` FK → `service_categories` (resolve the 11 alias leaves to real tile_id; **no destructive leaf_key rename**). Refinement event/faith gating ships only after this; if event-type tagging precedes it, refinements ship admit-all.
- **Phase 1 — event-type columns (safe, ships alone).** `event_type_vocab` (+RLS, seed) · `service_categories.applicable_event_types` (+GIN) · `canonical_service_taxonomy.applicable_event_types` · BEFORE INSERT/UPDATE validation trigger (vs vocab, not enum). All rows NULL = universal = byte-identical. Read-through (`effectiveEventTypes` in `snapshotFromRows`) ships safely same-or-later PR.
- **Phase 2 — faith reconciliation (atomic data+code+seed, one transaction, NO lowercase).** `faith_vocab` (+RLS, title-case + Civil) · widen `faith` CHECK → FK/trigger (174 NULLs + 25 title-case values already satisfy → no data UPDATE, no orphan window) · make re-seed durable (seed VALUES or drop `EXCLUDED.faith`) · CI assertion.
- **Phase 3 — admin write + consumer wiring.** Clone `remapCanonical` → `setServiceFaith`/`setCategoryEventTypes`/`setServiceEventTypes` (RLS client, audit) · editable faith dropdown + event-type chips · `faith` in `createCanonicalLeaf` · parent bulk-set · **extract a SHARED filter builder** (`passesEventTypeFilter` + SET-based `passesReligionFilter` reading both ceremony columns) imported by `vendors/page.tsx` AND `category-search.ts`/`wizard-recommendations.ts` (no two inline copies) · add the wedding + COALESCE guards.
- **Phase 4 — backfill (SEPARATE, reversible, data-only).** Tag genuinely wedding-exclusive tiles `{wedding}` (`ceremony_venue`, `brides_attire`, `grooms_attire`, officiant/paperwork groupings) + the 20 marketplace_hidden officiant canonicals. **Leave debut-plausible tiles NULL=universal** (`bridal_car`, `guest_shuttle`, `escort`, `filipiniana_barongs`, `womens_attire`, `mens_attire`). Idempotent + reversible. The list is a UX judgment call → gate any non-wedding launch on a blocking admin catalog review.

---

## 8. Open decisions for the owner (ratify before build)

1. **Faith vocabulary direction.** Recommended: keep storage **title-case**, reconcile via `faith_vocab` + the existing `mapCeremonyTypeToFaith` bridge (zero data mutation, no comparator break). Alternative: a full atomic lowercase cutover PR. *Title-case path is lower-risk and is what this memo assumes.*
2. **Default-applicability.** Recommended **FAIL-OPEN** (unassigned = universal). Load-bearing for never-empty and "narrow, don't re-tag."
3. **Faith = match-scope vs publish-gate. ✅ DECIDED 2026-06-10 — MATCH-SCOPE ONLY (V1).** Faith tags only filter what couples *see*; they do NOT restrict which vendors may list under a faith-exclusive category. (Faith-exclusive services today are admin-seeded officiants, so this is contained; a vendor-side faith-publish check is a future proposal if vendors ever self-serve faith-restricted categories.)
4. **Cultural vs religious split. ✅ DECIDED 2026-06-10 — CULTURAL STAYS UNIVERSAL.** Cultural *flavor* (Filipiniana, barong, henna) stays faith-universal and lives in refinements; only true faith-restricted *services* (officiants, pre-cana, counseling) carry a `faith` tag. *(Amended 2026-06-11: halal catering removed from this list — dietary became a per-vendor graded capability per `Catering_Dietary_Halal_Model_2026-06-11.md` option 1c; food is never faith-gated, enforced by the `setServiceFaith` dietary-guard + the unit-test regression guard.)* A Catholic couple can still pick a Filipiniana look.
5. **`except`/faith-exclude hard-hide → DROPPED.** Confirm alcohol-bar case = non-destructive advisory chip, not a silent tile hide.
6. **`event_type_launch_status` → NOT built.** Confirm we don't re-introduce per-event-type launch gating (reverses the 2026-06-04 "keep everything live" lock).
7. **Two-admin gate scope.** Single-admin for event-type tagging; owner decides whether faith-exclusivity + whole-class INCLUDE allow-lists need the two-admin gate.
8. **Hide-empty vs new-type launch.** For a launching non-wedding type with sparse supply: exempt it from `passesHideEmpty`, or require seeded vendor `event_types` coverage first.
9. **Neutral-single inter-faith — BLOCKED on 0043.** This design assumes dual-union Mixed; neutral-single needs an `events` ceremony-count/`mixed_resolution` flag landed first. Confirm sequencing.
10. **Non-wedding refinement content.** Event-type tile-filtering yields a *subset* of wedding refinements, never event-appropriate ones (a birthday wants "theme," not "attire kind"). Authoring per-event-type refinement sets is a separate prerequisite for real non-wedding onboarding.

**Key files for the implementing engineer:** `supabase/migrations/20260803001000_service_categories_tree_foundation.sql` (faith CHECK ~L82, re-seed clobber ~L399-403), `apps/web/lib/taxonomy-db.ts` (`getTaxonomy`/`snapshotFromRows` chokepoint), `apps/web/app/vendors/page.tsx` (`FaithKey`, `mapCeremonyTypeToFaith`, `passesReligionFilter`, `passesHideEmpty`), `apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts` (no faith filter today — must add), `apps/web/lib/wizard-recommendations.ts`, `apps/web/app/admin/taxonomy/actions.ts` (`remapCanonical` template), `apps/web/app/admin/taxonomy/page.tsx` (ServiceLine faith Badge), `supabase/migrations/20260521000000_iteration_0043_wedding_type_picker.sql` (ceremony columns), `apps/web/app/onboarding/wedding/onboarding-refinements.ts` (FK-anchor target).
