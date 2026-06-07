# Budget Planner — Median-Anchored Allocation Engine + Behavioral Capture (2026-06-05)

**Status:** design consolidation · **draft for Cowork ratification.** A NEW couple-side capability designed in the 2026-06-05 owner session: a **top-down budget *allocation* engine** (recommend a ₱ target + range per service *before* the couple picks anyone) layered on top of the existing budget *tracking* ledger — paired with a **first-party behavioral-decision capture** the owner designated a strategic **edge** and a **most-protected data class**.

This **extends, does not override** `0007` (budget), and **reuses the marketplace GATE** from [Customer_Vendor_Marketplace_Architecture_2026-06-04](Customer_Vendor_Marketplace_Architecture_2026-06-04.md). Folds into **0007 / 0025 / 0023** + a DECISION_LOG row via Cowork. **Prices are never invented** — all real amounts are owner-set / market-derived ([[project_setnayan_pax_based_pricing]]). **Build = follow-on** (design locked this session; no code yet).

Related existing artifacts: `Vendors_Plan_Budget_Tab_Spec_2026-05-31.md` (the plan/budget *tab* = tracking-ledger UI) · `apps/web/lib/budget.ts` (the tracking snapshot — *actuals*, not allocation).

---

## 0. The model in one paragraph

The budget planner has two halves. The **tracking** half (built) records what each booked vendor *actually* costs. The **allocation** half (this doc, new) tells the couple — *before* they pick anyone — *what each service should cost*: a recommended ₱ target + range per service, derived from the **median of real, solo vendor prices** on that service leaf, proportioned across the services the couple wants, scaled to their budget. It is a **guide, never a rule**: every number is a pre-filled suggestion the couple can override, nothing is ever blocked, and the suggestion stays visible so they can snap back. The couple's actual choices are captured as a **first-party, de-identified-for-analysis behavioral dataset** — Setnayan's edge: *how real couples prioritize money across services.*

---

## 1. The spine — median → proportion → ₱ target

For the set of service **leaves** the couple selects:
1. Each leaf `L` has a **weight** `w_L = median(solo prices on L)` (§2).
2. Its **share** `%_L = w_L / Σ(w of selected leaves)`.
3. Its **₱ target** `= %_L × budget`.

Base case (owner example): budget ₱1M, one leaf selected (reception venue) → share 100% → ₱1M target. One service = the whole budget. Adding services re-normalizes every share **down** (more claimants on the pie); dropping services grows the rest.

---

## 2. The median rule — solo prices only (LOCKED)

`median(L)` is built **only from prices that represent leaf `L` standalone.**

- ✅ **Include — `vendor_services.starting_price_php`** (one row = one `canonical_service` = one leaf, priced on its own). The "solo priced for that leaf."
- ❌ **Exclude — `vendor_packages` / `vendor_package_items`** (a bundle anchored on a `primary_canonical_service` carrying multiple `canonical_service` items under ONE price = "the service has links to other services"). Even each item's `replacement_value_centavos` is excluded — it's intra-bundle accounting, not a standalone market price.

**Why:** a leaf's percentage must reflect what that service costs *by itself*; including a ₱500k all-in package would poison the leaf's median upward and distort every downstream share.

**Forward-flag:** the finer **"linked-services-on-card"** concept ([[project_setnayan_booking_ruleset]]) is **not a schema field yet** — today the only concrete "links to other services" signal is the package/bundle. When linked-cards ship, a **solo-vs-linked marker on `vendor_services`** is needed so the median filter drops those too. Until then, "exclude bundles" fully covers the rule.

---

## 3. Refinement layers (on the same spine)

**Tier 1 — makes the percentage *correct* (non-optional):**
1. **Market-scoped median.** Compute each leaf's median over the *eligible* vendors using the **same GATE the matcher runs** — region · venue type · pax band · ceremony (Customer_Vendor_Marketplace_Architecture §2; [[project_setnayan_leaf_match_contract]]). A Manila 300-pax couple and a Cebu 100-pax couple get different medians. **Reuse the gate; don't fork it.**
2. **Pricing-axis normalization.** Pax-axis leaves (venue, catering) → median the **per-head rate** × the couple's pax; flat leaves (monogram, coordinator) → median the flat price ([[project_setnayan_pax_based_pricing]] 3-axis model). Don't median incomparable numbers.
3. **Fixed-then-proportion.** Setnayan's own SKUs (known exact prices) are deducted off the top as **fixed lines**; the proportion runs only over the *estimated external* leaves. `(budget − Σ fixed) = the pool that gets split`. Never hand a known SKU a "median share."

**Tier 2 — makes it *usable + honest*:**
4. **Band, not point.** Carry **p25 – median – p75** per leaf → output is "₱X–₱Y to work in." At `n=1` it collapses to the single price; widens as inventory grows.
5. **Feasibility clamp + shortfall.** Floor each target at the leaf's cheapest real solo price; if `Σ floors > budget`, say *"you're ₱X short for these N services"* rather than print impossible targets. Never-impossible (the cousin of never-empty).
6. **Thin-data fallback + confidence.** Below a **minimum-N** of solo prices, fall back to an **admin-seeded benchmark** and label it *"rough estimate"*; surface a per-leaf **confidence** (sample count + spread). The *only* place a non-market number enters — admin-set, never invented.

**Tier 3 — personal (IN):** couple **tilt** (§4).

---

## 4. Tilt — the couple steers (guide, never rule) (LOCKED)

The whole engine is **advisory**: defaults you can override, never rails; the suggested number stays visible so the couple sees how far they've strayed and can reset.

- **Primary gesture = peso-pin**, **pre-filled with the median.** Tapping a leaf opens **one bottom sheet** (mobile) / popover (desktop) with: a **₱ field (pre-filled)** · a **splurge / standard / save dial** (the low-effort path for small leaves a couple has no peso opinion on) · the live **% and range** as **readouts** (never the input — nobody thinks "venue should be 38%").
- Touching a leaf **pins** it; unpinned leaves re-flow (§5).
- **"Reset to suggested"** is always one tap (the median plan is the anchor they return to).

**Why peso-primary:** the headline move — setting the venue budget *before* the first venue search — is inherently a peso decision; couples think in pesos for big-ticket items; %-drag-to-hit-a-peso-target is indirect and fiddly on mobile ([[feedback_setnayan_ux_is_north_star]]).

---

## 5. The Cushion — slack-first absorption (LOCKED)

**Core principle:** *no auto-calculated leaf ever exceeds its own median.* Surplus is always either the couple's deliberate **pin** or a **visible Cushion** line.

- **Default plan parks surplus as an explicit "Cushion."** When `budget > Σ medians`, the leftover shows as a Cushion line — we do **not** inflate every leaf above its market median to fill the budget (dishonest guidance + nudges overspend). When `budget < Σ medians` (tight regime), the defaults proportionally compress and Cushion = 0.
- **Absorption order when a leaf is tilted up:**
  1. Pull from **Cushion** first (→ 0) — no other leaf moves, no warning.
  2. Cushion empty → **proportional drain** from unpinned leaves (each shrinks by its median's share of the remaining need).
  3. Drain hits a leaf's **soft floor** → it can still go below, but now **warns** ("most photographers here start around ₱Y").
  4. Pinned past the whole budget → Cushion goes negative → **"over budget by ₱X."** Still never blocked.
- **Symmetric:** pinning a leaf *below* its median returns the freed money to the **Cushion** (not silently onto other leaves — that would push them above their medians and break the principle). The couple re-places it or banks it as savings.
- **One mechanic, both regimes:** in the tight regime Cushion is already 0, so a tilt goes straight to proportional drain. "Slack-first" = "cushion-first."

This keeps warnings **rare → meaningful** (they fire only when something real happened), which is what "a guide, not a rule" needs.

**Worked example (medians ILLUSTRATIVE — not price guidance):** B ₱1M; Venue 350 / Catering 300 / Photo+Video 120 / HMUA 30 / Coordinator 50 → Σ 850, **Cushion 150**. Pin venue → 450: Cushion 150→50, nothing else moves, no warning. Pin venue → 550 (only 50 cushion left): Cushion → 0, remaining 50 drains the unpinned set proportionally → Catering 270 / Photo 108 / HMUA 27 / Coord 45, with a gentle *"to fund this we trimmed your other services."*

---

## 6. Behavioral capture — the edge (staged) (LOCKED direction)

The couple's actual allocation choices are Setnayan's competitive **edge**: how real couples prioritize across services → effective + trending services, app-improvement signals, what to upsell ([[project_setnayan_behavioral_data_edge]]).

**What to capture** (per event, per leaf): **default-vs-final** (revealed preference vs the anchor) · **pin-order / first-touched** (the strongest "what I care about most" signal) · **what got cut to fund a tilt** · tagged with **budget band · region · pax band · event type**.

**Staged role (sequence, not a binary):**
- **Now → low N:** default = market median only; data captured but inert (forced — founder-only, no data yet).
- **At min-N per segment:** data powers **guidance copy** ("couples like you spend ~40% on venue"). Visible, trust-building, *zero risk* — annotates the number, never changes it. **Ship first.**
- **At high-N + validated:** data may **nudge the default** — but only a **bounded** adjustment on top of the median (capped deviation, market median retained as anchor/floor). Never a full replacement — guards the **feed-its-own-tail** drift (defaults derived from tilts that started from defaults).

---

## 7. Storage + protection — a most-protected class (LOCKED)

- **System of record = first-party Supabase Postgres (Singapore).** NEVER a 3rd-party analytics SaaS as SoR; PostHog/GA (0035) may mirror **aggregates** for dashboards only. We must own the edge + control residency + access.
- **Two layers, hard wall between them:**
  1. **Operational / identified** (`budget_allocation_decisions`-style, per-event) — **RLS-at-CREATE couple-own-only** (canonical `current_event_ids`), admins get **no blanket read** (gated + audited path only), aggregator = service-role, **RA 10173 erasable**, source feed for aggregation.
  2. **Analytical / de-identified** — pseudonymized, identity stripped, **segment-keyed** (budget band · region · pax band · event type · leaf); the mining layer. **PII never crosses into layer 2.**
- **Surfacing = aggregate + minimum-N (k-anonymity)** so a thin segment can't re-identify a couple or lie on tiny samples. Roll-ups **cron-free** (on-write / `after()` — [[project_setnayan_cron_free]]).
- **Governance:** bulk export / raw-layer access behind the **two-admin gate** (0023) + an **access audit log**; consent + opt-out in **0025**; no PII in logs (existing lock).
- **Upsell rule:** "push more services to each client" uses **that client's own data + de-identified population patterns** — NEVER one couple's identifiable data to target another.

---

## 8. Three-actor wiring

- **Customer:** sees the allocation plan + per-leaf ₱ target/range, tilts it, and gets **in-range / above-range** badges on vendor cards.
- **Vendor:** their **solo `starting_price_php`** feeds the medians; being "in range" is a soft-rank nudge in the matcher (never a gate). More vendors → sharper medians.
- **Admin:** tunes the allocation **weights/benchmarks** (the thin-leaf seeds — like the future `COMPAT_WEIGHTS` admin surface) and **governs data access** (audit + two-admin export) ([[feedback_setnayan_architect_mandate]]).

---

## 9. How it plugs into matching — advisory, never a gate

The recommended range is an **advisory badge** on vendor cards (in-range / above-range), **never a hard filter** — never-empty + UX-north-star stay intact. Optionally a small soft-rank boost for in-range vendors. The engine **reuses the matcher's GATE** to scope the median to the couple's market (§3.1) — **one eligibility definition, two consumers** (the matcher ranks survivors; the planner medians them).

---

## 10. Open items / owner-to-set

- **Thin-leaf benchmark seeds** — admin-set values for leaves below min-N (never invented).
- **Numeric knobs** — minimum-N threshold · band width (fixed ±15% vs category-specific) · soft-floor percentile (p10 vs min). Owner-to-set.
- **Pricing-axis amounts** — per-50 / per-hour already owner-locked-to-set ([[project_setnayan_pax_based_pricing]]).
- **`budget_allocation_decisions` schema** — final columns + RLS pattern at build.

---

## 11. Build sequence + where it folds

1. **`apps/web/lib/budget-allocation.ts`** — pure engine (`computeBudgetAllocation()`), weights/benchmarks a single **admin-tunable config constant** (mirrors `lib/compat-score.ts`). Median reader scoped via the matcher's GATE.
2. **0007** — the planner surface (allocation view + tilt sheet) on top of the existing tracking ledger; `budget_allocation_decisions` capture table (**RLS at CREATE**).
3. **0025** — consent + opt-out + RA 10173 erasure for the behavioral layer.
4. **0023** — admin weight/benchmark tuning + the two-admin export gate + access audit.
5. **DECISION_LOG** row (2026-06-05).

Folds into **0007 / 0025 / 0023** via Cowork. Relationship: this is the *allocation / planning* layer; `Vendors_Plan_Budget_Tab_Spec_2026-05-31` + `lib/budget.ts` remain the *tracking* layer.
