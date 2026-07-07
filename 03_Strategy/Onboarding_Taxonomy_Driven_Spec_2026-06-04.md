# Spec — Fully Taxonomy-Driven Onboarding (+ adaptive rendering)

**Status: DRAFT for owner ratification · 2026-06-04.** Reverses a locked decision (see §1). Once ratified, Cowork folds the canonical parts into iterations **0000** (onboarding shell), **0006** (`vendor_category`), **0021** (couple plan), **0007** (budget), and adds a `DECISION_LOG.md` reversal row. Build happens in an isolated worktree off `origin/main`; migration lands before feature code (repo rule).

> **⚠ UPDATE 2026-06-04 — read §0 first.** After owner review the model converged: onboarding is **available-only** (not the full taxonomy), the **customer dashboard shows all**, vendor **listings are supply-gated**, and the product is **English-only** for V1. **§0 is authoritative and supersedes any conflicting detail in §1–§10 below** — notably the original "full-taxonomy onboarding picker" and "coming-soon-at-0" framing.

---

## 0. Converged model — LOCKED 2026-06-04 (authoritative)

Deciding principle: **selling vs. planning.**

> **You're selling → show only what's real. You're helping them plan → show everything, and flag what's not ready yet.**

| Surface | What it shows | Why |
|---|---|---|
| **Onboarding picker** (acquisition) | **Available categories only** (e.g. 10 of 190) | Don't advertise empty inventory — it reads as a dead product and kills conversion. Concise by nature. |
| **Customer dashboard › Services** (planning) | **ALL categories.** Available add normally; not-yet-available add as a plan slot marked *"we'll help you source this"* + a demand signal | The dashboard is a wedding-**planning** tool — its job is to help the couple plan the whole wedding, not just what's in stock today. |
| **Vendor listings inside a category** (both) | **Supply-gated** — real available vendors, else *"coming soon / Setnayan can help"* | Never show phantom listings. |

**"Available" =** a category has **≥1 bookable vendor OR a Setnayan first-party service** (Papic, Pakanta, Live Studio, Monogram, Pa-ilaw, Patiktok…). First-party seeding is the standard marketplace cold-start move and keeps the founder-only catalog from looking barren.

**Self-healing:** every surface reads availability live — a category appears in onboarding, or flips from "we'll source this" → bookable on the dashboard, the moment supply lands. No deploy.

**Demand capture:** each not-yet-available category a couple adds on the dashboard logs a geolocated signal ("N couples in {region} want {category}") — the supply-recruitment input. Lightweight signal, not a full "request a category" UI.

**Relevance:** among shown categories, faith / event-type filtering stays on (no Muslim-only services for a Catholic civil wedding).

**Storage:** every pick (onboarding *or* dashboard-add) is a plan slot in `event_vendors`, keyed by `category_key` (the taxonomy tile) — the PR-1 migration.

### Language — English-only (V1)
The product ships **English-only**. This **reverses** the locked "EN-primary + TL · CEB toggles" plan (mainly 0015 marketing site + brand voice). SaaS-correct: ship one language, localize later when traction shows which markets justify the cost. Help center (0029) was already EN-only V1.

### Cowork decision-log rows needed
1. *"2026-06-04 · Onboarding = available-only; customer dashboard Services = show-all (gaps flagged + demand capture); vendor listings supply-gated; available = ≥1 vendor OR Setnayan first-party. Selling-vs-planning split."*
2. *"2026-06-04 · Product is English-only for V1; supersedes the EN-primary + TL/CEB-toggles plan (0015 + brand voice)."*
3. Plus the couple-side-curation reversal already in §1.

---

## 1. The locked-decision reversal (read first)

`DECISION_LOG.md` locks: *"the couple-side `vendor_category` 28-enum is curated, code-only, and does NOT auto-expand."* Owner chose **fully taxonomy-driven** (2026-06-04): any new taxonomy tile auto-appears in onboarding, with no curation gate. **This spec reverses that lock.** Required Cowork action: a new decision-log row recording the reversal, e.g.
> `| 2026-06-04 | Couple-side onboarding is now fully taxonomy-driven; vendor_category enum → TEXT keyed on service_categories; supersedes the 2026-05-30 "couple side does not auto-expand" lock | apps/web/app/onboarding/*, migration event_vendors.category→TEXT |`

---

## 2. Goal & non-goals

**Goal.** The onboarding picker, the couple's stored selections, and the auto-inquiries all derive from the **live taxonomy** (`service_categories` / `getTaxonomy()`), so adding a tile makes it appear in onboarding with **no code change and no deploy** — and the experience **degrades gracefully** for blank/thin tiles (§6).

**Non-goals.** No new SKUs, no pricing change, no wallet. Not changing the marketplace `/vendors` (already taxonomy-driven). Not changing the matching engine's never-empty contract (reused as-is).

---

## 3. The crux: storage must stop being a rigid enum

Today the couple's chosen category is `event_vendors.category` = the `vendor_category` Postgres **enum** (~30 fixed values, `ALTER TYPE`-only). A fully taxonomy-driven picker can offer a freshly-promoted tile with **no enum value to store it in**. So:

**Decision (recommended): migrate `event_vendors.category` from the `vendor_category` enum → `TEXT` keyed on the taxonomy tile** (`service_categories.id`, tier-2).

### Expand–contract migration (safe, reversible)
1. **Expand.** Add nullable `category_key TEXT`. Add a soft validity check against tier-2 tiles in `service_categories` (FK *or* a trigger — see §8 open decision). Keep the old enum column.
2. **Backfill.** Map every existing `vendor_category` enum value → its tile key via an exhaustive `CASE` (sourced from `lib/vendor-category-taxonomy.ts`, which already encodes this bridge). Zero-downtime: old rows keep working.
3. **Dual-write.** Feature code writes both columns during the deprecation window.
4. **Cut over readers.** Audit and repoint every consumer of `event_vendors.category` (see §5) to `category_key`.
5. **Contract (later PR).** Drop the enum column + the `vendor_category` type once nothing reads it.

**Reversibility:** until step 5, the enum column still exists — a single revert restores prior behavior.

---

## 4. Picker derives from the taxonomy

- Replace the hardcoded `PICK_GROUPS` literal (`onboarding-shell.tsx:256`) with data derived **server-side** from `getTaxonomy()` → `WEDDING_TILES_BY_PARENT` (the 53 tiles under 10 parents), passed into the shell as a prop. (`onboarding-shell.tsx` is a client component; fetch in its server wrapper.)
- Each tile already carries `WEDDING_TILE_LABEL` + slug + parent. Render exactly as today, just data-sourced.
- **Retire `PICK_TO_GROUP`** (and its ~14 dead entries): selection maps to the plan via the taxonomy tile key directly, and **auto-inquiry creation keys off the tile** — so new tiles also create inquiries (fixes the silent no-op class).
- **Assets:** each tile needs `/onboarding/picker/{tileSlug}.webp`. New tiles fall back to a default image / the tile icon until an asset is generated (Recraft follow-up). Never blocks a tile from appearing.

---

## 5. Downstream blast radius (audit at build time)

Everything that reads `event_vendors.category` or the `VendorCategory` type must move to the tile key:
- `lib/vendors.ts` (`VendorCategory` type, `SERVICE_GROUPS`)
- `lib/vendor-category-taxonomy.ts` (the enum↔tile bridge — becomes the backfill source, then simplifies)
- Budget ledger (0007) — reads category per line item
- Couple plan grid (0021) + `finalizeVendor` one-per-category gate (`HARD_SINGLE_PICK_GROUPS`)
- Any RLS policy / view referencing the column (preserve policies; this is an `ALTER COLUMN`, not a table re-create)

> Build step 0 is a complete `git grep` audit of `vendor_category` / `event_vendors.category` so nothing is missed before cut-over.

---

## 6. Adaptive rendering — how blank/thin tiles self-adjust

The app reads three live signals **per tile at render time** and picks its mode automatically (no per-category config; self-heals as data fills in). Primitives already exist (`fetchVendorCountsByService`, the `coming_soon` tile mode, `meets_visibility_minimum`, the empty-state degradation).

| Signal | Value | Behavior |
|---|---|---|
| **Refinements** `filter_facets.length` | 0 (stub) | Show tile, **skip the Layer-1 facet question**. Schema lands later → question auto-appears. |
| | ≥1 | Ask the one primary facet (concise-onboarding Layer 1). |
| **Supply** `vendor_market_stats` count | 0 | **Coming-soon** mode + **demand capture** (§7); offer Setnayan first-party where one exists. Never a dead grid. |
| | 1–5 (heuristic) | Show **all**, **rank-only**, no narrowing filter. |
| | ≥6 (heuristic) | Full filter + rank engages. |
| **Quality** `meets_visibility_minimum` | below min | Vendor counts toward "coming soon", stays out of the live grid. |

Thresholds are tunable (same pattern as the existing faith-readiness threshold in `/admin/wedding-types`), not locked numbers.

---

## 7. Blank/thin = demand signal, not dead end

When a couple picks a tile with **0 or thin supply**, record a structured demand signal — *"wants `{tile}` in `{region}`"* — into the existing demand machinery (`taxonomy_category_requests` / demand counts from the governance branch). This turns founder-only thin supply into the product's best **supply-recruitment + promote-next** instrument. Onboarding becomes a sensor, not a wall.

---

## 8. Open decisions for owner

1. **Validation mechanism:** FK `category_key → service_categories(id)` (strict, clean) **vs** a soft trigger/app-validation (more tolerant of taxonomy fallback). *Recommend FK*, since `service_categories` is seeded and authoritative.
2. **Store the tile key (53) or the canonical key (195)?** *Recommend tile key* — that's the shopping decision the couple makes; canonical granularity stays vendor-side.
3. **Clutter UX** (you chose pure auto-appear, no admin curation gate): mitigate with tile **search/typeahead** + **relevance ranking** (faith/region/event-type first) over the existing 10-parent grouping + progressive "show more." Confirm this is the intended trade (vs. a `show_in_onboarding` admin flag, which you declined).
4. **Threshold values** (the 5 / 6 cut-points in §6) — accept starting heuristics or set your own.

---

## 9. Build sequence (post-ratification)

1. **PR-1 (migration, expand):** add `category_key TEXT` + backfill + validation. No behavior change.
2. **PR-2 (feature):** picker-derive + retire `PICK_TO_GROUP` + adaptive rendering (§6) + demand capture (§7) + dual-write. This is the user-visible change.
3. **PR-3 (cut-over):** repoint all readers (§5) to `category_key`.
4. **PR-4 (contract, later):** drop the enum column + `vendor_category` type.
Each PR: CHANGELOG + COWORK_INBOX `[PENDING]` + STATUS per repo rules.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Enum→TEXT on a core table | Expand–contract; enum kept until PR-4; full reader audit (§5) before cut-over. |
| A tile appears with no asset/refinements/supply | §6 handles all three states gracefully; default asset; skip facet; coming-soon. |
| Onboarding clutter (53+ tiles) | Search + relevance ranking + progressive disclosure (§8.3). |
| Taxonomy fallback (`getTaxonomy` serves the `lib/taxonomy.ts` constant if DB empty) | Picker still renders from the constant — safe; FK validates against the DB seed. |
| Lock reversal not recorded | §1 Cowork decision-log row is a ship gate. |

*— DRAFT. Ratify §8 decisions + the §1 reversal, then I build PR-1.*
