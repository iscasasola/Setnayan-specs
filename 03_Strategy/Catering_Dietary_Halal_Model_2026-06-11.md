# Dietary, Halal & Food Restrictions Per Vendor — Architecture Memo

> **Status:** APPROVED-IN-PRINCIPLE 2026-06-11 — decisions #1 = **option 1(c)** (graded capability on every caterer + a faith-NEUTRAL "Halal Catering Specialists" discovery canonical visible to all) and #3 = **record-and-disclose, never attest** are owner-ratified. Decisions #2/#4/#5 take the recommended defaults pending objection. Build not yet started; the §8 cutover (incl. the `lib/taxonomy.ts` repo PR) sequences after the faith Phase 2.
> **Date:** 2026-06-11 · **Author:** Claude Code (adversarial workflow: 3 readers → 2 designs → synthesis → 2 critics → memo). Verified against shipped code at `~/.setnayan-tax-read/apps/web` @ `origin/main`.
> **Owner concern:** *"Caterers might have issues with halal, or food restrictions per vendor."*
> **Companion to:** `Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md` (this memo **contradicts its §8.4** — see decision #1).

**Bottom line:** You're right to worry — the current data model makes the problem worse, not better. We have a fix, but it touches an owner-locked faith doc and needs three sign-offs (§9). Nothing ships silently.

---

## 1. The answer in one line

**Dietary capability (halal, kosher, vegetarian, vegan, pork-free, alcohol-free, nut-free) is a graded property of a *vendor*, matched against a *couple's requirement* that is either HARD (must) or SOFT (prefer) — it is NOT a faith-gated category.** One catering tile, one bar tile; "halal" is a verified checkbox on the caterer, not a separate `halal_catering` listing only Muslim couples can see.

## 2. Why the model we have today is wrong

We model food restrictions **two contradictory ways at once** — confirmed live:

**Model A — faith-gated carve-out categories (broken).** `halal_catering` is a canonical service tagged `faith=Muslim, dietary=halal`; the three `mocktail_*` are tagged `faith=INC, dietary=alcohol_free`. These tags are **hardcoded in `apps/web/lib/taxonomy.ts` (lines 596, 739–741)** *and* mirrored in `canonical_service_taxonomy`.

**Model B — per-vendor facets on the generic service (right).** The generic `catering` schema already lists `cuisine_specialties`, `faith_compatibility`, `dietary_accommodations`. A caterer *can already* declare halal on the ordinary listing — only the data + matcher read are missing.

**Three things make Model A actively harmful:**
1. **It silently hides halal caterers from everyone except Muslim couples.** `passesReligionFilter` (`app/vendors/page.tsx:2485-2487`) is INCLUDE-only: `if (!meta.faith) return true; return meta.faith === activeFaith`. A `faith=Muslim` halal_catering row is **subtracted** from every non-Muslim couple — directly violating the 2026-06-10 lock ("faith never silently subtracts"). A faith-gated food category *is* that subtraction.
2. **`mocktail_*` is mis-tagged.** "Alcohol-free" is a beverage capability wanted by INC, Muslim, sober, pregnant-heavy, dry-venue couples — not INC-only. The carve-out even carries a `muslim_friendly` facet (proving the point). And `mocktail` is a separate **tile** from `mobile_bar`, fragmenting "alcohol-free bar."
3. **None of it works today — dead schema.** `vendor_service_attributes` (vendor facets) + `event_vendor_preferences` (couple requirements) are **both 0 rows live**; the couple's halal pick lands in display-only `events.style_preferences` the matcher never reads; `compat-score.ts` has **no dietary dimension** (only music overlap); and **`toStringArray` (`preference-match.ts:50`) drops booleans AND objects** → every dietary facet is unmatchable by construction (must-fix regardless).

**Net:** a Muslim wedding's halal need isn't modeled as a requirement at all — it's an optional cuisine chip in a display blob read by zero matching code, while a parallel faith-gated category hides halal caterers from most couples.

## 3. The dietary capability model (vendor side)

A vendor declares capability as a **tri-state grade per restriction** in existing `vendor_service_attributes.attribute_payload` (jsonb, PK `(vendor_profile_id, canonical_service)`). **No new columns on `vendor_profiles`; no new table.**

**The grade ordinal that makes it work:** `certified` (2) > `accommodates` (1) > `none`/absent (0) — the trust distinction (certified halal kitchen vs merely accommodates vs can't).

**Vocabulary** (new shared group `dietary_capability` replacing `faith_compatibility` + `dietary_accommodations`). **Grades stored as FLAT scalar match keys, not nested objects** (or the matcher drops them):

| Restriction | Match key (flat) | Detail keys |
|---|---|---|
| halal | `halal_grade` = certified/accommodates/none | `halal_cert_body`, `halal_cert_number`, `halal_cert_expiry`, `halal_segregation` (dedicated/shared_with_protocol/none), `halal_haram_avoidance[]`, `halal_cert_doc_uploaded` |
| kosher | `kosher_grade` | `kosher_hechsher` (free text), `kosher_meat_dairy_separation`, `kosher_passover_capable`, `kosher_cert_doc_uploaded` — axis-modeled, NOT a halal clone |
| alcohol_free | `alcohol_free_grade` = dedicated/accommodates/none | beverage **and** recipe scope |
| no_alcohol_in_recipes | `no_alcohol_in_recipes_grade` | maps the live `wedding_cake.alcohol_in_recipes` facet |
| pork_free | `pork_free_grade` | `pork_free_shared_equipment`, `pork_free_dedicated_utensils` |
| vegetarian / vegan | `vegetarian_grade` / `vegan_grade` = full_menu/accommodates/none | |
| nut_free / gluten_free / dairy_free | `<x>_grade` = dedicated_prep/accommodates/none | |
| allergen_aware | bool | baseline trust flag |

**Certification = a grade, never a separate object/canonical.** `halal_grade=certified` requires cert_body + number + expiry + doc_uploaded; admin reviews the doc (the same 0023 queue that used to gate visibility, repurposed to *award a trust badge*, decoupled from publish). `accommodates` = self-declared, no doc.

**Liability (do not over-claim):** badge is **not** "Setnayan verified." It reads **"Halal certificate on file ✓ — [body], exp. 2027-03 · verify with issuer"**, **auto-downgrades to "accommodates" when expiry passes**, with a standing disclosure (mirrors vendor-payment-disclosure): *"Setnayan records the certificate the vendor provided; we do not independently audit kitchens — confirm directly with the certifying body."* Arms-length RA 11967 posture.

Applies to every food/beverage leaf (`catering`, `mobile_bar`, `wedding_cake`, `live_cooking_station`, `dessert`, `food_truck`, `lechonero`, etc.). A caterer that can't do halal leaves `halal_grade=none` and **stays fully visible to everyone** — no faith gate.

## 4. Couple requirement model — HARD vs SOFT

Captured in `event_vendor_preferences.attribute_payload` (the table the matcher reads), carrying the **HARD-vs-SOFT distinction that exists nowhere today**:
```
{ restriction:"halal", level:"must"|"prefer", min_grade:"certified"|"accommodates",
  require_segregation:"dedicated"|"any", require:["no_cross_contamination_non_halal"],
  source:"faith_default"|"couple_explicit"|"guest_rollup" }
```
- `must` → HARD (hard-filter + admit-unknown + never-empty); `prefer` → SOFT (rank-float, never excludes); `min_grade` → certified vs accommodates; `require_segregation` → strict couple can demand a *dedicated* kitchen (a `certified` badge must never hide a shared kitchen from someone needing dedicated).

**Captured at 3 points:**
1. **Faith → smart default, defaulting to SOFT (corrected).** Muslim pre-seeds `{halal, prefer, accommodates}` + pork_free + alcohol_free; INC pre-seeds alcohol_free + no_alcohol_in_recipes. Pre-checked, with a one-tap **"Make this a hard requirement"** upgrade. Defaulting to HARD auto-excludes vendors for interfaith/less-observant couples — reserve HARD for an explicit action. **Amend the existing live `lockHalal`/`lockAlcoholFree` lock in `onboarding-shell.tsx` into a downgradeable pre-check** (don't build fresh).
2. **A faith-agnostic "Food & dietary needs" step + dashboard card** — any couple adds halal/kosher/veg/vegan/nut-free/alcohol-free, must/prefer, min_grade. Decouples dietary from faith (vegan, nut-allergy, dry weddings) and works for non-wedding events.
3. **Guest-allergy rollup (slot reserved).** `guests.dietary_restrictions` → requirements; severe allergies default SOFT but couple-promotable to HARD with a nudge.

**Capture fix:** write to `event_vendor_preferences` (matcher-read), not only display-only `events.style_preferences`. Un-defer the Phase-A2 write for the dietary dimension.

## 5. Match rule — hybrid, never-empty, severity-aware
1. **HARD (`must`)** — keep if `grade ≥ min_grade` for every must-restriction; only `grade=none` is hard-excluded; **admit-unknown** (no facet stored → "not yet specified" bucket below matched, with "confirm halal directly" chip — never excluded).
2. **Never-empty, split by severity:** soft OR `min_grade=accommodates` with zero results → ranked advisory banner ("closest; confirm directly"). **HARD + `min_grade=certified` (devout)** → **explicit empty-state + affirmative opt-in** ("Request we recruit one" / "Browse anyway (none halal-verified)") — surfacing a non-halal caterer to a hard-halal couple requires a click, never a banner.
3. **SOFT (`prefer`)** → pure rank-float.
4. **Alcohol advisory (locked):** non-destructive `PlanCardCompatibilityIssue` chip on bar tile; **extends to food/cake** (`no_alcohol_in_recipes` — rum cake, wine-braised, brandy) when `alcohol_free=must`.
5. **Two engineering fixes that make it real:** flatten grades to scalar match keys + a grade-ordinal comparator + unit test (certified>accommodates>unknown); wire the matcher onto the caterer surface (`matchEventId` into `category-search.ts:292`; `dietaryMatchRatio` into `compat-score.ts` refinement weight).

## 6. What happens to `halal_catering` & `mocktail_*`
Retired as faith-gated canonicals; specialization data migrates losslessly into grade keys (a transform, not a delete — no vendor loses standing):
- **halal_catering → generic `catering`:** cert_body/segregation/haram_avoidance/doc → grade keys; `barmm_serving_experience` → `geographic_service_areas`; cuisine options → `cuisine_specialties` (minus `halal_specialty`).
- **mocktail_* → de-faithed into `mobile_bar`:** `inc_compliance` → `alcohol_free_grade`; `muslim_friendly` deleted; `mocktail` tile collapses into `mobile_bar`.
- **After:** `faith=NULL` + `dietary=NULL` for all food/beverage rows. Faith then carries only genuinely faith-restricted *services* (officiants, pre-cana, INC-counseling) — exactly what the design doc says faith is for.
- **Kosher is NOT a halal clone** — ship declare-only V1 (`kosher_grade` + free-text hechsher + doc, **no verified badge**, notice to coordinate with rabbi/Beit Din). Genuine PH kosher supply ≈ zero → `kosher=must` always hits the empty-state (honest behavior). Jain/Buddhist-veg/SDA-veg deferred until axis-modeled.

## 7. Three-actor flow
- **Admin (0023):** cert-verify queue (award "certificate on file" badge, never a publish gate); manages the dietary vocabulary + cert-body enum (admin-extensible: IDCP/Philippine Halal Authority/JAKIM/NCMF-accredited/other+free-text); monitors the never-empty degrade as a **data-driven supply-gap recruitment signal** (BARMM-first, self-surfacing).
- **Vendor (`/vendor-dashboard/attributes`):** one generic catering/bar listing, halal is a graded checkbox; certified → cert body + segregation + number + expiry + doc. No separate `halal_catering` SKU. `grade=none` stays fully visible.
- **Couple:** faith pre-checks SOFT defaults (one tap → hard); faith-agnostic "Food & dietary needs"; caterer tile ranks certified-first, unknowns below, explicit empty-state for hard-halal-no-supply; bar advisory chip; guest-allergy rollup later.

## 8. Migration sketch (additive-then-cutover, reversible)
**Pre-flight inventory** every column holding a canonical_service value: `canonical_service_taxonomy`, `canonical_service_schemas`, `vendor_service_attributes.canonical_service`, `event_vendor_preferences.canonical_service`, `vendor_package_items`, `budget_allocation_decisions`, **`vendor_screen_name_sequences`** (live **44 rows** on the 4 carve-outs), **`vendor_services.category`** (free-text, NOT `canonical_service`), `orders.service_key`.
- **Ph1** additive jsonb schema (`dietary_capability` group, flat scalar keys) on all food/bev schemas.
- **Ph2** idempotent backfill (4 carve-out vendors' facets → grade keys; note both value stores 0 rows live → field-map, not data-preserve).
- **Ph3** re-point `vendor_services.category` (`halal_catering`→`catering`; `mocktail_*`→`mobile_bar`); merge `vendor_screen_name_sequences` counters; redirect the 4 schema rows.
- **Ph4 — repo PR (the blocker):** remove `faith`+`dietary` from the 4 carve-outs in **`apps/web/lib/taxonomy.ts` (596, 739–741)** + collapse `mocktail_*`→`mobile_bar` there, **in the same cutover** (a DB-only `SET faith=NULL` leaves stale TS driving `passesReligionFilter`). Re-verify `passesReligionFilter` returns true for halal rows. Normal worktree+PR (corpus-edit authorization does NOT extend to repo code).
- **Ph5** tombstone LAST, gated (`SET faith=NULL,dietary=NULL`; carve-outs → `marketplace_hidden` redirects, NOT hard DELETE; count-assert zero live refs).
- **Ph6** wire matcher reads (un-defer `event_vendor_preferences` write for dietary; amend `lockHalal`/`lockAlcoholFree`; add `matchEventId`; grade comparator + test; `dietaryMatchRatio`). NULL pref = today's behavior → ships behind the empty store, zero pilot impact.
- **Constraint notes:** `canonical_service_taxonomy` has a title-case `faith` CHECK AND a `dietary_check` (`dietary = ANY(ARRAY['halal','alcohol_free'])`); only ever `SET … NULL` (passes both); grades live exclusively in jsonb, never in the `dietary` column. RLS unchanged. Trivially reversible.

## 9. Open decisions for the owner (sign-off before cutover)

1. **✅ DECIDED 2026-06-11 — OPTION 1(c).** Halal becomes a graded capability on every caterer (visible to all) AND a faith-NEUTRAL "Halal Catering Specialists" discovery canonical (`faith=NULL`, visible to everyone) is kept — preserving BARMM/Muslim-vendor recruitment + cert depth WITHOUT the faith gate. `Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md` §8.4 to be amended to remove halal-catering from the faith-tagged examples (faith carries only officiants/pre-cana/INC-counseling). _(original options, kept for lineage:)_ This model contradicts §8.4 (lines 85 + 147), which still names "halal-certified catering" as a legitimate faith-tagged service — while the same doc's lines 74–75/146–148 lock faith as INCLUDE-only/never-subtracts. You can't have both. **Options were:**
   - **(a) RECOMMENDED — accept this model; amend §8.4.** Halal caterers visible to all; Muslim couples match the whole tile. Loses the `faith=Muslim` category boundary (the forbidden subtraction) — and dissolves the faith=Muslim anchor for BARMM-first Muslim-vertical recruitment (recruitment moves to the weaker data-driven supply-gap signal).
   - **(b) Keep the carve-out** — preserves recruitment + cert depth, but is a confirmed include-only violation (de-facto visibility gate).
   - **(c) THIRD OPTION — keep `halal_catering` as a NON-faith-tagged discovery canonical** (`faith=NULL`, a "Halal Catering Specialists" sub-tile visible to everyone). BARMM recruitment + cert depth survive WITHOUT the faith gate; capability grades on generic catering + a faith-NULL specialist canonical coexist. Best-of-both, but adds a canonical to maintain.
2. **Authoritative dietary vocabulary** — ratify the restriction list, cert-body enum, default-SOFT subset.
3. **✅ DECIDED 2026-06-11 — RECORD-AND-DISCLOSE, NEVER ATTEST.** Neutral "certificate on file — [body], exp. date · verify with issuer" badge + expiry auto-downgrade + standing non-vouching disclosure. RA 11967-consistent, lower liability. Setnayan never claims to audit a kitchen.
4. **Hard-halal, no supply** — confirm the explicit empty-state + affirmative opt-in (§5.2) for `must`+`certified`, ranked advisory only for soft/`accommodates`.
5. **Kosher & other faiths** — confirm kosher ships declare-only/no badge; Jain/Buddhist-veg/SDA-veg deferred until axis-modeled.

**Recommended path:** 1(a) or 1(c) + neutral cert badge (3) + severity-split never-empty (4) + kosher declare-only (5). The only model consistent with the 2026-06-10 locks; directly answers the owner's worry; ships behind the empty store with zero pilot impact. **Do not amend §8.4, retire carve-outs, or edit `lib/taxonomy.ts` until decision #1 is signed off.**

**Key files:** `apps/web/lib/taxonomy.ts` (596, 739–741); `apps/web/app/vendors/page.tsx` (~2480–2487 `passesReligionFilter`); `apps/web/lib/preference-match.ts` (50 `toStringArray`); `apps/web/lib/compat-score.ts` (`dietaryMatchRatio`); `apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts` (292 `matchEventId`); `apps/web/app/onboarding/wedding/onboarding-shell.tsx` (`lockHalal`/`lockAlcoholFree`); corpus `Taxonomy_Event_Faith_Scoping_Design_2026-06-10.md` §8.4.
