# Budget "Build" — Pin Constraint Solver (Phase 3) — Implementation Plan (2026-06-09)

> **⚡ 2026-06-11 UPDATE: Phase 3a SHIPPED** (PR [#1248](https://github.com/iscasasola/setnayan-platform/pull/1248) merged — the §4 "What's fixed?" pin modes on the live Build tab, localStorage + snapshot-stamp persistence, find-date bridges, typical-pricing disclaimer). Phases 3b / 3c / 3d remain planned; the §9 owner decisions remain open (3a's §9.4 persistence defaulted to client-local + snapshot stamp pending owner). See DECISION_LOG 2026-06-11.
>
> **Status: PLAN — no code yet.** Owner asked to "plan it first properly before executing."
> Parent: `Budget_Build_Services_Takeover_2026-06-08.md` (the shipped/live takeover). This plans
> the one remaining spec piece — Phase 3, the Pin solver. Nothing here ships until owner sign-off
> on the phasing + the open decisions in §9.
>
> **Grounded in shipped `origin/main`:** the planner's per-leaf pins
> (`budget/_components/budget-allocation-planner.tsx` — `pins`/`setPin`/`pinOrder` →
> `pinnedAmountPhp`), the pure engine `lib/budget-allocation.ts`, `/find-date` (the Schedule-Matrix
> Date Finder, `lib/schedule-matrix.ts` + `find-your-date.tsx`), and the last-minute surcharge
> primitive (`lib/last-minute.ts` + `vendor_services.last_minute_surcharge_pct/_end_months`).
> Companion: `Wedding_Date_Aligner_Expansion_2026-06-04.md` (the multi-objective date ranker draft).

---

## 1 · The concept (confirmed with owner 2026-06-09)

**Pinning = locking one dimension so the engine searches + auto-recommends the rest.** The dimensions:
**Budget** (the money) · **Services** (what you want) · **a category's price** · **Date** (the day).
Key principle (from the Date Aligner lock): **the date is naturally an *output*** — you optimize *for* it
— so "pin Date" means "my date is fixed," which *constrains* the others rather than being solved.

## 2 · What already exists (so Phase 3 is mostly small)

| Capability | Status |
|---|---|
| **Pin a category's price** → rest re-balances | ✅ **Shipped** — the planner's per-leaf peso-pin (`pins` + `pinnedAmountPhp`) |
| **Pin Budget** → recommend the service mix | ✅ **Shipped** — that's the default allocator behavior |
| **Pin Services** → the budget you'd need | ⚠️ Trivial — sum the picks' medians/ranges (no engine work) |
| **Pin Services/Budget → best Date** | ✅ **Shipped** — `/find-date` ranks dates by vendors-kept (+ "pin a non-negotiable vendor") |
| **Pin Date → re-price budget/services** | ⚠️ **Engine work** — the allocator has no date→price; needs last-minute surcharge + seasonality |
| Per-head (pax) pricing accuracy | ⚠️ **Engine follow-on** — V1 benchmarks are flat per-leaf |

So **two of three macro-pins work on today's engine.** Only the **Date pin's re-pricing** is genuinely new.

## 3 · Pin taxonomy → what each pin does

```
PIN Budget   (default) → allocator recommends the service mix that fits      [exists]
PIN Services           → lock the chosen leaf set; show "needs ₱X–₱Y";       [trivial]
                          budget field becomes a derived readout; → find-date
PIN a category price   → that leaf is fixed; the rest re-balances            [exists: planner pin]
PIN Date               → fix the day → (a) availability filter (find-date),  [filter exists;
                          (b) last-minute surcharge + seasonality re-price     re-price = 3b]
```

## 4 · Phase 3a — Pin modes on the Build tab (NO engine work, NO migration)

A **"What's fixed?"** segmented control at the top of the Build tab (Budget · Services · Date):

- **Budget-fixed (default):** today's allocator (services recommended to fit). No change.
- **Services-fixed:** lock the selected leaf set; the budget figure becomes a **derived readout**
  ("this plan needs **₱X–₱Y**" = Σ leaf ranges), with a **"find your date"** CTA → `/find-date`.
- **Date-fixed:** capture/show the fixed date; surface availability context + a `/find-date` link
  (pricing stays median until 3b — labeled "typical" so we never imply date-aware pricing we don't have).
- **Category-price pin:** unchanged — the existing per-leaf peso-pin already covers it.

**Persistence:** add `pinMode` (+ optional pinned date) to the existing `budget_builds.snapshot` JSONB
(no migration — it's already `jsonb`) and/or local UI state. **Reuse `/find-date`** — do NOT fork the
date ranker (locked). **Free vs paid:** the Services→find-date bridge is free; the *auto-fill* of a
pinned gap stays the Setnayan-AI (paid) path (§8). **PR: ~1, client-mostly, no migration.**

## 5 · Phase 3b — Date-aware pricing (the real engine work)

Make "Pin Date → re-price" real by applying a **date adjustment factor** to the gate-scoped per-leaf
prices inside `resolveAllocationInputs` / the engine:

1. **Last-minute surcharge — already modeled.** `lib/last-minute.ts` + `vendor_services.last_minute_*`
   give a 0–100% surcharge when the booking is within N months of the date. Fold it into the per-leaf
   floor/median when a date is pinned and close. *(Reuse, low risk.)*
2. **Seasonality — net-new, deterministic, owner-to-set.** An **admin reference table**
   `wedding_season_factors(region, month, factor)` (per the Date Aligner draft §E) multiplies prices by
   month/region (peak months cost more). Admin-edited; **values are owner-to-set** (never invented).
3. With both, the allocator re-prices on the pinned date → "Pin Date → budget/services adjust" and
   "Pin Budget+Date → services solve on that date's prices" both work.

**PR: ~2** (engine factor + a small admin reference table/editor + the migration). **Biggest effort;
gated on the owner's seasonality values.**

## 6 · Phase 3c — pax-axis price normalization (independent engine follow-on)

Per-head leaves (venue, catering) should price as **per-head rate × pax**, not a flat benchmark
(today's V1 limitation, already noted in the allocation spec). Extend `LeafInput` with a pax-axis flag
+ per-head rate; `resolveAllocationInputs` computes `rate × pax` for those leaves. Independent of date;
sharpens accuracy for the biggest budget lines. **PR: ~1** (engine + resolver; no UI change).

## 7 · Date-solve = reuse `/find-date` (+ the Date Aligner expansion)

"Pin Budget/Services → best date" is **already** `/find-date` (ranks dates by vendors-kept; supports
pin-a-vendor). The Build tab's Services-fixed / Date modes link to it. The
`Wedding_Date_Aligner_Expansion_2026-06-04.md` multi-objective upgrade (Least-stressful / Soonest /
cultural) is a **separate, owner-to-ratify** effort — not part of Phase 3, but the natural partner.

## 8 · Marketplace sourcing ladder (the paid auto-fill)

From the parent spec: when a pin leaves a hole the bench can't fill, source **bench → marketplace →
relax-a-pin**. This is the **Setnayan-AI (paid) auto-fill** — gated on `isSetnayanAiActive()`. The
**free** path *surfaces* the gap + the relax-a-pin levers; the **paid** path auto-slots a real matched
vendor. Plan it as an extension of the Setnayan AI matching layer, not the free allocator. **PR: ~1–2,
paid-gated.** (Lower priority than 3a–3c.)

## 9 · Open owner decisions (need sign-off before the relevant phase)

1. **Seasonality model (blocks 3b):** the `wedding_season_factors` values (per-region month multipliers)
   are owner-to-set. Do you want seasonality at all in V1, or just the last-minute surcharge?
2. **Is a date ever a *hard* input?** Some couples have a fixed date (anniversary). Confirm Date-fixed
   simply re-prices + filters availability (never blocks), consistent with "guide, never rule."
3. **Free vs paid line for the Date-solve / auto-fill:** confirm find-date bridge = free; AI auto-fill of
   a pinned gap = paid (`isSetnayanAiActive`).
4. **Pin-mode persistence:** on the `budget_builds` snapshot (cross-device) vs local UI only.

## 10 · Recommended phasing (Claude Code time, not human-months)

| Phase | What | Engine work? | Migration? | Effort |
|---|---|---|---|---|
| **3a** | Pin modes UI (Budget/Services/Date) + find-date bridges | No | No | ~half a day · 1 PR |
| **3c** | pax-axis normalization | Yes (small) | No | ~half a day · 1 PR |
| **3b** | Date-aware pricing (last-minute + seasonality) | Yes | Yes (season table) | ~1–2 days · 2 PRs · **owner values needed** |
| **3d** | Paid marketplace sourcing ladder | Yes (matching) | Maybe | ~1 day · 1–2 PRs · paid-gated |

**Recommendation:** ship **3a first** — it delivers the "lock one, recommend the rest" experience on the
*live* Build tab with **zero engine work and no migration**, and the date-solve already exists via
`/find-date`. Then **3c** (pax accuracy), then **3b** (date pricing — the real engine effort, gated on
your seasonality decision), then **3d** (paid auto-fill). Each is its own flag-dark-then-verified PR,
same as the Phase 1–2b cadence.

## 11 · Cross-references

- `Budget_Build_Services_Takeover_2026-06-08.md` — the live takeover (Build tab host).
- `Wedding_Date_Aligner_Expansion_2026-06-04.md` / `Schedule_Matrix_and_Date_Finder_2026-06-02.md` — the date ranker.
- `Budget_Planner_Allocation_Engine_2026-06-05.md` — the engine + pin/tilt model.
- DECISION_LOG 2026-06-09 (build + review rows) — feature state.

---

## 12 · Lock vs Flag (owner refinement 2026-06-09) — supersedes the deferred bulk-auto-fill

> **🚫 SUPERSEDED 2026-06-16 — kept for lineage.** This 2-state Lock/Flag control is replaced by the **3-state Locked/Auto/Excluded solver** in **[`Build_3State_Solver_2026-06-16.md`](Build_3State_Solver_2026-06-16.md)** (legacy mapping: Lock→Locked · Flag→Auto · neither→Excluded). Read that doc for the current Build design.

A per-**category** two-state control, distinct from the macro "What is fixed?" selector (§4a). It makes the auto-fill explicit + per-category (better + safer than a blind bulk-add):

| State | Meaning | Solver |
|---|---|---|
| **🔒 Lock** | decided — "don't touch this" | untouched (= `finalizeVendor` + the planner peso-pin; both exist) |
| **🚩 Flag** | "generate / fill this one for me" | sourced + recommended (below) |
| *(neither)* | open, not yet requested | ignored until flagged |

**What a Flag does (the sourcing ladder):** SHORTLIST (the bench) first → else **request next best** from the marketplace. **Setnayan AI on → auto-pick the best match; regular → surface the next-best options to choose.** Re-runnable ("get next best" pulls more). Writes only to the SHORTLIST (`event_vendors` 'considering' — non-destructive, couple-only; Lock is the finalize). Never-empty: marketplace dry → "widen the area / relax a constraint," never blank.

**Build (flag-dark PRs):**
- **PR-1 — foundation:** the Flag marker + persistence (`budget_category_flags`, couple-own RLS) + the Summary Lock/Flag/open UX + the free/paid messaging. *(No vendor write — safe.)*
- **PR-2 — generation:** the action — Setnayan AI auto-adds the top-compat match to the Shortlist for each flagged category; regular surfaces the options. Reuses `category-search` + `compat-score` + the add-to-shortlist insert. *(The write pipeline — built + verified deliberately.)*

---

## 13 · Phase 3d — the 3-State Solver (2026-06-16) → see dedicated doc

The § 12 two-state control evolved (owner session 2026-06-16) into a full **3-state Locked/Auto/Excluded** solver across every row (taxonomy rows + Date/Budget/Location), with `Reset · Build · Save As`, Setnayan-AI-aware Auto, a marketplace fallback search, and a vendor re-quote nudge. **Canonical spec: [`Build_3State_Solver_2026-06-16.md`](Build_3State_Solver_2026-06-16.md).** Highlights:

- **Rows = quoted inquiries only** (`total_cost_php != null`) + the 3 dimension rows.
- **Auto:** OFF = cheapest quote that fits budget · ON = the deterministic `compat-score` engine (reception-anchored + refinements + ladder) ranking among the couple's quotes.
- **Fallback:** Auto can't fit → marketplace search (top 10, +5), ordered by a **hidden** compat %.
- **Nudge:** a quoted vendor who passes date+location but fails budget → in-thread "create a new proposition?" (one per `(event,vendor,service)`, reply-gated, English, budget withheld).
- **Depends on Improvement ①** (vendor-authored quotes → `total_cost_php`), greenlit 2026-06-16.
- **Open owner sign-offs** in that doc § 9 (hidden-% scope · budget-number reveal · Save-As naming · Auto icon · reply-gate · inquiries-only sourcing).
