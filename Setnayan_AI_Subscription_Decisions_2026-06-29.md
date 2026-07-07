> **🔴 SETNAYAN AI PRICE SUPERSEDED 2026-07-02 (owner-locked): ₱499 first 28-day cycle (intro) → ₱799/28-day cycle.** Single tier, unlock-all, event-anchored. Every ₱3,999 / ₱1,499 *Setnayan AI planner* figure below is RETIRED — the ₱499/28d that was the working price is now the first-cycle intro (non-AI SKU prices unaffected). Canonical: `Pricing.md` §00.A + DECISION_LOG 2026-07-02 + [[project_setnayan_pricing_tiers]].

# Setnayan AI — Subscription Model: Decisions to Settle

> **Owner sign-off doc.** Output of the 2026-06-29 brainstorm. Companion to `Setnayan_AI_Template_Library.md`. Six decisions gate making the per-user subscription model + template library canonical. Each has the options, a recommendation, and the implication. Settle them here; once ratified, log the locks in `DECISION_LOG.md` and the template library flips PROPOSED → canonical.

## Background (what's being decided)

The brainstorm reframed Setnayan AI from a **per-event ₱3,999 one-time** matchmaking layer (live in prod since 2026-06-22) to a **per-user monthly subscription** — an always-on "assistant secretary + guard + coach" that covers all of a user's events, learns their taste, and grows on aggregate cohort data. The intelligence stays **deterministic (templated, not LLM)** so marginal cost ≈ storage (~95–99% margin).

The model is sound; six load-bearing calls remain. None should be applied to the live paywall plumbing until signed off.

---

## Decision 1 — Final price + term structure

**Working figure:** ₱499/mo, sold as prepaid **term passes** (3/6/12-month) on today's manual apply-then-pay rails, upgrading to provider-run auto-renew when PayMongo/GCash subscriptions land.

| Option | Pros | Cons |
|---|---|---|
| **A. Flat ₱499 × N** (recommended) | Premium, no discount theater (matches "we don't want to look cheap"); simplest | Leaves no commitment incentive |
| B. Prepay discount (e.g., 12mo ≈ 10mo) | Pulls couples to longer commitments → kills the pause-leak harder | Discount theater; erodes premium positioning |

**Recommendation:** **A (flat)**, decided in the holistic pricing pass. Margins (~95–99%, cost ≈ R2) survive either; this is positioning, not cost.
**Implication:** sets the `platform_retail_catalog_v2` term-pass SKU rows (PHP centavos, admin-managed).

**Decision (2026-06-29 · OWNER):** ✅ **₱499 per 28-day cycle.** Term passes = ₱499 × number of 28-day cycles (matches the vendor 28-day billing cadence). Stored admin-managed in `platform_retail_catalog_v2` (never hardcoded). **Unblocks the term-pass SKU build.** ⚠ This is a billing-MODEL change (one-time ₱3,999 → recurring ₱499/28d); the public `/pricing` + homepage + llms.txt still show the old one-time AI price and must be reconciled at the holistic pricing pass / before go-live.

---

## Decision 2 — Per-user vs the live per-event ₱3,999 SKU

The per-event AI paywall (`events.setnayan_ai_active`, `platform_settings.setnayan_ai_paywall_enabled = true`) is **live in prod**. The per-user model wraps it: a `user_ai_subscription.active_until` that **fans out** the flag to all the user's events.

| Option | Notes |
|---|---|
| **A. Per-user replaces per-event** (recommended destination) | Cleanest story; the only model where "monthly" is honest |
| B. Run both during transition | Lower risk; some catalog/UX duplication while both exist |

**Recommendation:** **B short-term → A** — keep per-event as the entitlement *mechanism*, sell the per-user *pass* over it now, retire the standalone per-event SKU once term passes are proven.
**Implication:** new `user_ai_subscription` table + fan-out + the `isSetnayanAiActive()` chokepoint reads the user window. No teardown of the live flag. **Couples (2 users, 1 event) must never be double-charged** — entitlement covers events you host *or* co-host.

**Decision (2026-06-29 · my call per "do as you'd recommend", owner may override):** ✅ **B → A.** Run per-user *alongside* per-event short-term; retire the standalone per-event ₱3,999 SKU once term passes are proven. The shipped foundation (PR #2407) already built it this way — the per-user gate fans out *over* the existing per-event flag, so both coexist with no teardown.

---

## Decision 3 — Consent posture for behavioral personalization (INF-* templates)

Behavioral inference (taste drift, cross-connect, budget/region signals) uses how a user navigates *their own* experience. RA 10173: first-party, but a disclosure obligation.

| Option | Pros | Cons |
|---|---|---|
| A. Opt-in | Safest under RA 10173 | Most users never enable → the flywheel starves |
| **B. Disclosed, on-by-default + toggle** (recommended) | Far more data; defensible because every use self-discloses ("I noticed…") | Needs genuinely upfront disclosure + the toggle in the existing privacy tab (0025) |

**Recommendation:** **B**, *contingent on PH counsel* — the "I noticed…" pattern makes every use transparent, which is the legal and the UX safeguard in one. Lives on the existing `users.consent_state` + privacy tab.
**Implication:** privacy-policy copy + a `consent_state` key + the toggle surface. **Legal checkpoint, not a product call.**

**Decision (2026-06-29):** ⚖️ **ROUTED TO PH COUNSEL — I will not self-approve a consent posture.** Recommended proposal to put to counsel: **disclosed, on-by-default + a privacy-tab toggle**, with every use self-disclosing ("I noticed…"). **Inference (INF-*) activation stays blocked** until counsel clears it.

---

## Decision 4 — Aggregate analytics consent + the min-N value (TRD-* templates)

Cross-account trends/benchmarks use de-identified population data. The **minimum cohort size (min-N)** is the privacy *and* statistical floor — below it, a "trend" can re-identify people and is statistically meaningless.

- **Consent basis:** privacy-policy disclosure + `consent_state` (lower-risk because de-identified + min-N).
- **Set min-N:** proposed **≥ 25** per cohort before any TRD-* fires (tune with counsel + data density). A reusable `public.min_n_ok(count, floor)` helper already exists in prod (Wave-2 substrate, PR #2393) — reuse it.

**Recommendation:** disclose in policy; **min-N = 25** as the starting floor, admin-tunable (`platform_settings.radar_min_n_floor` pattern already shipped).
**Implication:** cohort aggregate views enforce min-N at the query layer; never surface a sub-floor cohort.

**Decision (2026-06-29):** ⚖️ **ROUTED TO PH COUNSEL.** Recommended: disclose in the privacy policy; **min-N = 25** as the starting floor (reuse the shipped `public.min_n_ok(count, floor)` helper), admin-tunable. **Trend (TRD-*) activation stays blocked** until cleared.

---

## Decision 5 — LLM boundary (what stays free)

The whole library is deterministic → free. Any template rendered by an LLM flips to per-use cost, per user.

| Option | Notes |
|---|---|
| **A. Everything templated, incl. message-drafting (SEC-04)** (recommended) | Holds the ~95–99% margin fully; SEC-04 proves drafting works templated |
| B. One budgeted exception: a conversational chat / NLG digest | Better feel where it matters; real recurring per-user API cost — price it in |

**Recommendation:** **A by default**; only revisit B if a conversational interface is later judged worth a per-user cost. "Costs us nothing" and "stays deterministic" are the same decision.
**Implication:** build `renderTemplate(id, slots, profile)` as pure string substitution; no model calls in the loop.

**Decision (2026-06-29 · my call, owner may override):** ✅ **A — everything templated/free**, including SEC-04 message-drafting. Already built this way in PR #2407 (`renderTemplate` is pure substitution, no model). Revisit a single budgeted LLM exception only if a conversational interface is later judged worth a per-user cost.

---

## Decision 6 — Autonomy: ask vs act

A real secretary sometimes *does* the small thing and tells you after. Today's templates mostly *ask*.

| Option | Notes |
|---|---|
| A. Always ask first | Safest; can feel like a tool, not an assistant |
| **B. Act on small/reversible, ask on big/irreversible** (recommended) | Feels like a real assistant; needs a crisp small-vs-big line |
| C. Full autonomy | Too far for V1 (money/contracts at stake) |

**Recommendation:** **B** — e.g., *acts*: pre-fills a shortlist, holds a tentative date, queues a templated nudge for one-tap send. *Asks*: anything touching money, contracts, or an outbound message actually sending. Never sends money or signs anything autonomously.
**Implication:** each template carries an `autonomy: ask | act-then-report` field; the restraint engine enforces the money/contract/outbound guardrail.

**Decision (2026-06-29 · my call, owner may override):** ✅ **B — act on small/reversible, ask on big.** *Acts:* pre-fill a shortlist, hold a tentative date, queue a templated nudge for one-tap send. *Asks:* anything touching money, contracts, or an outbound message actually sending. **Never** autonomously sends money or signs. Templates already carry the `autonomy` field (default `ask`); the trigger engine will honor it.

---

## After sign-off

1. Append the locks to `DECISION_LOG.md` (date-ordered row).
2. Flip `Setnayan_AI_Template_Library.md` PROPOSED → canonical (v2).
3. Hand to a build session: `user_ai_subscription` schema + fan-out, `isSetnayanAiActive()` extension, term-pass SKU rows, `renderTemplate()`, the consent/min-N plumbing. (Code = worktree + PR, per the repo workflow.)
