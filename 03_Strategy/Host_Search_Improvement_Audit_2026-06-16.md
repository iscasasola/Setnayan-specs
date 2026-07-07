# Host Search Improvement Audit — 2026-06-16

> **Method:** adversarial multi-agent audit (`host-search-improvement-audit`, ultracode) of the couple-side vendor-search pipeline (Explore → Shortlist → Build → Compare → Lock + the Setnayan AI matchmaking layer). 8 stage-finders grounded candidates in `origin/main`; each candidate was independently verified by a skeptic (open the cited file, confirm it's real, mark already-shipped/rejected); a completeness critic caught gaps; a synthesizer deduped + ranked + sequenced. **70 agents · 60 candidates → 53 verified · 26 ranked improvements.**
>
> Validates the six improvements proposed 2026-06-16 (which the owner greenlit) and surfaces 20 more. Pairs with [`Build_3State_Solver_2026-06-16.md`](Build_3State_Solver_2026-06-16.md) (the Build correctness guards below are folded into that spec's § 12).

---

## 1 · The six — validated against the code

| # | Improvement | Verdict | Grounded reality |
|---|---|---|---|
| ① | Vendor-authored quotes | **SOUND** | `vendor_proposals` exists (`createProposal`, `total_centavos` + `line_items`) but **no code writes `total_cost_php` from a proposal** — `updateVendorCosts` is the only writer and is couple-typed. The bridge is genuinely missing. Highest-value unblock, at peak intent. |
| ② | Show-the-locked-treasure | **REFINE** | The gating is shipped (`categoryEmptyForGenericSearch`) but the empty return (`category-search.ts:284`) is a bare `{...EMPTY}` with **no `emptyReason`/`isLastMinuteLocked`** → UI signal unbuilt (~1hr). **AND inert in prod** until an admin seeds `planning_deadlines kind='last_minute_start'` (none seeded) — pair UI with seeding. |
| ③ | Hidden % → "why" | **REFINE** | The % is computed **only when AI is on** (hidden in Manual). But **45% of the weight (refinement .30 + dateHeadroom .15) is NEUTRAL today**, so the only honest reasons are distance/reviews/verified. **Add** a one-liner from LIVE dimensions; **keep the number** where it renders. Never name a neutral dimension (false signal). |
| ④ | Consolidate controls | **SOUND, gated** | Confirmed three scattered controls: `event_vendors.status` (6 states) + `budget_category_flags` (marker, **no state column**) + `event_build_picks`. **The Excluded state REQUIRES a schema change** before any UI ships. Do **not** rename `event_vendors.status` in the same PR (RLS/finalize/archive references). |
| ⑤ | Ship the AI gating PR | **REFINE** | The gate is one clean file (`setnayan-ai.ts`); paywall OFF = free `planning_mode` toggle. Manual mode still runs the distance ladder (only the pill hides). Plumbing exists; the gap is the **empty-state CTA + flag flip + compute short-circuit** (~200 lines, behind a flag). |
| ⑥ | Feed the machine | **SOUND** | `dateHeadroomRatio` is referenced **only inside** `compat-score.ts` (never populated by `category-search.ts`); `vendor_service_attributes` is schema-only/empty in prod. A **data-supply problem**, not a code one. Lean on density-independent levers (paired-venue, song→band, dependency graph) that ship today. |

**Net:** all six survive. ①④⑥ sound as-is; ②③⑤ need the refinements above. None rejected.

---

## 2 · New improvements beyond the six (verified, ranked)

Highest value-per-effort first. "New" = surfaced by the audit, not in the original six.

**Quick wins — low effort, high value, no schema:**
1. **Inquiry-accepted notification + "Waiting for quotes" summary** (P1) — when a vendor accepts (`pending→accepted`) the couple gets no signal beyond an unread badge; they discover the unlock by luck. Add `inquiry_accepted` to `PUSH_ENABLED_TYPES` + a "Ready to quote" badge + a read-only "Waiting for quotes" strip atop Shortlist.
2. **Pre-show pax surcharge on cards** (P1) — `pax_surcharge_php` is stored (`migration 20261211000000`) but never shown; couples lock at base then see +₱5k in Costing. One-line footnote, read-only.
3. **Headcount-at-inquiry pill** (P1) — `startServiceInquiry` silently snapshots live pax into `chat_threads.pax_at_inquiry`; the composer never shows it → a stale estimate produces a wrong quote. Show + Edit before send.
4. **`decline_reason` display + one follow-up / withdraw** (P1) — `decline_reason` is queried but never shown; pending threads disable the send form (can't nudge); no withdraw (the pick dangles as "considering").
5. **Boosted/Featured paid-placement disclosure** (P1) — `category-search.ts:532` floats `ad_rank` above the ranked tier with a "Featured" badge and **no disclosure** → couples read paid placement as an AI rec. Add "paid partnership" tooltip / a Promoted section. *(Ad-hygiene + trust.)*
6. **Hidden-name reveal transparency + similar-vendors hand-off on decline** (P2) — anonymized names read as fake; the "See similar" link drops the couple with no category scope.

**Build-stage:**
7. **⚠ Multi-pick data-loss FIX (verified bug, P1)** — `isMultiPickGroup` is honored in `build-pick-actions.ts` but **NOT in `build-flags-actions.ts`**, so Compute on a flagged multi-pick group (Look/Booths/Prints) pins one vendor and the `onConflict` upsert **silently overwrites the couple's other manual picks.** This is a real data-loss bug in prod today — fix the guard before any consolidation.
8. **Post-lock next-action checklist per service** (P1) — `finalizeVendor` flips to `contracted` then nothing; no per-service next steps (share mood board, confirm headcount, pay deposit). Turns a binary lock into an ongoing workflow.
9. **Budget overage forecast + per-category fair-share warning** (P2) — the sticky bar shows Σ-vs-target but never warns proactively; couples discover overage after Compute jumps the total.
10. **Find-a-free-date calendar across shortlisted vendors** (P1) — `vendor-availability-intersection` renders only in Lock for a venue date; flexible-date couples have no proactive "pick a date when most vendors are free" tool.

**Retention / discovery:**
11. **Cross-event favorites** (P2) — `category-search.ts:530` explicitly defers "Tier 1 favorites: empty until the cross-event favorites table ships." Star a vendor → surfaces next event.
12. **Marketplace name-search bar + saved-search presets** (P2) — discovery is tile-first; no text search for partial-name recall; filters reset on close.
13. **Onboarding refinements → `event_vendor_preferences`** (P2) — Dream-Team picks (`events.style_preferences.refinements`) are display-only, never reach the scorer. Pairs with ⑥ — both halves needed for the refinement dimension to lift.
14. **Shortlist annotations (notes + quick-tags)** (P2); **manual-vendor full costing + chat-quote regex helper** (P2, merges into ①); **coordinator notifications + read-only view** (P1, high effort); **draft persistence + returning-user vendor reuse + contact dedup** (P2 polish); **unified Nudge component + anchors config refactor + delete the dead 1985-line `plan-budget-accordion.tsx` view** (P3 tech-debt; KEEP `accordion-lock`/`accordion-build` — those back the live tabs).

*(Plus value/budget-fit scorer dimension — owner §9.2 "if we can," deferred until refinement/dateHeadroom mature.)*

---

## 3 · Critical risks & sequencing constraints (the load-bearing part)

1. **Schema blocker (④):** `budget_category_flags` has **no state column.** The 3-state Excluded + `[Reset]→all-Excluded` **cannot work** without a migration (add `state ENUM('locked'|'auto'|'excluded')` + `pinned_vendor_id`, or a unified `event_category_build_state` table). **This migration is the load-bearing prerequisite for all Phase-3d UI.**
2. **No status-rename in the same PR:** `event_vendors.status` is referenced by RLS, `finalizeVendor`/`deleteVendor` gates, and archive/force-majeure migrations. Split any rename into its own audited PR — or skip it.
3. **Quote-gate starvation (③/① prereq):** the `total_cost_php != null` row gate means a category with only **unpriced** inquiries shows **no Build rows.** So the **quote bridge (①) is a prerequisite** for the Phase-3d "quoted-rows-only" rule to not produce a confusing empty Build. Sequence quotes **before** the row-filtering UI.
4. **Multi-pick data loss (verified):** ship the `isMultiPickGroup` guard in compute **before** any consolidation/migration touches multi-pick groups.
5. **Price-anchoring (①):** keep **couple confirmation** (no silent write), transport/food editable, proposal-linked cost editable until the couple accepts. Never let a flat proposal zero out negotiated transport/food.
6. **Trust vs the number (③):** ADD the reason as a tooltip/fallback; **keep the % where it renders.** Don't ship a reason naming refinement/dateHeadroom while neutral.
7. **Punishing the free tier (②/⑤):** copy must say **"these vendors can still take your date"** (capability) not "locked" (dark-pattern). Don't let AI-gating make the free floor feel broken; keep `VENDOR_TIER_SEARCH_GATE` OFF until paid-tier supply exists.
8. **Inert-by-config:** ② is dormant until an admin seeds `last_minute_start`; ⑥'s lift needs `vendor_service_attributes` populated. Both are owner/ops actions, not pure engineering — ship the code, but flag the data step or it ships nothing visible.

---

## 4 · The build order — five waves (by value-per-effort + hard dependency, NOT the original numbering)

- **Wave 1 — visibility quick-wins** (low effort, high value, no schema; ship first): ② last-minute treasure UI + **admin seeds START months** · inquiry-accepted notify + Waiting-for-quotes · pax-surcharge footnote · headcount-at-inquiry pill · `decline_reason` + follow-up/withdraw · Boosted disclosure · hidden-name/similar-vendor transparency. *Surfaces what the engine already knows; de-risks the rest.*
- **Wave 2 — the quote bridge (①):** vendor-authored quote → one-tap into Build + the chat-quote regex helper. **Prerequisite for the Phase-3d quoted-rows-only rule** — must precede the Build refactor.
- **Wave 3 — AI gating behind the flag (⑤):** compat short-circuit in Manual + empty-state buy-CTA + entitlement plumbing, all behind `SETNAYAN_AI_PAYWALL_ENABLED=false` (prod untouched until the owner flips it with `/pricing`). Shares the empty-state CTA with Wave 1's ②.
- **Wave 4 — the Build refactor, strictly sequenced:** (a) the **state column/table** (the schema blocker) → (b) the **multi-pick guard** in compute (data-loss fix) → (c) **then** the 3-state toggle UI + the unified `buildWithFallback`. No status rename here.
- **Wave 5 — feed-the-machine + retention + polish** (parallelizable, mostly data/ops-bound): `vendor_service_attributes` backfill + `dateHeadroomRatio` wiring + onboarding refinements (⑥) · cross-event favorites · post-lock checklist · find-a-free-date · budget forecast · coordinator surfaces · tech-debt cleanup folded into whatever PR touches those files.

**Rationale:** Waves 1–3 cut host search effort with near-zero schema risk; Wave 4 is gated on the verified schema + data-loss blockers; Wave 5's biggest item (the % actually getting smarter) is an adoption/data problem on its own clock — it shouldn't block the UX wins.

---

## 5 · Cross-references
- [`Build_3State_Solver_2026-06-16.md`](Build_3State_Solver_2026-06-16.md) § 12 — the correctness guards (schema-first, multi-pick, no-rename) folded into the Build spec.
- [`What_Is_Setnayan_AI_2026-06-08.md`](What_Is_Setnayan_AI_2026-06-08.md) — the AI gating (⑤) + § 8 build-state gap.
- Code anchors: `lib/category-search.ts`, `lib/compat-score.ts`, `lib/setnayan-ai.ts`, `lib/pax.ts`, `vendors/build-flags-actions.ts`, `vendor_proposals` / `createProposal`, `lib/chat.ts`.
