# Family Life-OS — Master Build Plan

**Authored:** 2026-07-12 — owner directive ("create our plan… finalize everything before we build it"). The capstone that consolidates this session's design + build into one dependency-ordered plan.
**Consolidates:** [`Event_Anchor_Model_Council_Verdict`](Event_Anchor_Model_Council_Verdict_2026-07-12.md) · [`Event_Anchor_Minimalist_Setup_Design`](Event_Anchor_Minimalist_Setup_Design_2026-07-12.md) · [`Faith_Aware_Person_Graph`](Faith_Aware_Person_Graph_2026-07-12.md) · [`Positioning_Family_Life_OS`](Positioning_Family_Life_OS_2026-07-12.md) · [`Lifecycle_Strategy_Research`](Lifecycle_Strategy_Research_2026-07-12.md).
**How to read it:** § A = what's already live. **§ B = FINALIZE FIRST (owner sign-offs to lock before we build).** § C = external gates to clear. § D = the phased build. § E = deferred. Nothing in § D Phase 1 starts until § B is signed and (per phase) § C is cleared.

**Standing principles (every phase obeys):** wedding-first wedge · demand-pull (build where families pull) · Rule 1 (deterministic, free AI) · cron-free · unlock-not-gate (optional data never required) · reference-only sensitive fields · **we store events, not documents** · counsel-gate anything touching a minor / sensitive PI / third-party-notify / money.

---

## A. Already shipped (Phase 0 — LIVE on main)

| PR | What |
|---|---|
| #3175 | Anchor foundation — schema (anchor_kind/date/origin/recurs) + the deterministic derivation engine (milestone ladder, recurrence, lead-time) |
| #3176 | Anniversary capture (typed origin) + memorable-date reminders (fires off anchor_date) |
| #3178 | "Your year" moments surface |
| #3180 | Home "Your year" strip |
| #3183 | Wedding cardinality — one-wedding-at-a-time hard block |

The couple's OWN lifecycle already works end to end: create an anniversary → home + Year view → annual email.

---

## B. FINALIZE FIRST — ✅ ALL RESOLVED 2026-07-12 (+ flow-check reconciliation)

*Owner answered all sign-offs + the 3 flow-check blockers. Locked outcomes:*
- **B1 civil+church** → **one wedding, two-ceremony list** (option a). **+ FLOW-CHECK FIX:** the shipped wedding guard must **free the slot on COMPLETED or CANCELLED status (not only archived)** + show a guided "is this a new marriage?" step → the next immediate CODE fix (§D Phase 1 item 0).
- **B2 First Communion** → **added** (with Confirmation). **B3 rites** → single "Religious Rite" type + picker. **B4 reunion/graduation** → Standard bucket. **B5 holidays** → Christmas · Valentine's · **Mother's/Father's Day · New Year** (⭐ also a vendor hook — holiday specials/promos). **B6 household** → kids auto-shared + own-relatives-opt-in + dissolution co-parenting. **B7** 18–50 dependent gap → accepted. **B8 Muslim concurrency** → blocked V1 accepted. **B9** → G1 + G2 **authorized**.
- **Flow-check blockers:** own religion + civil status = **self opt-in carve-out** (Phase 1, adults-only accounts, per-field consent + purpose + withdrawal); "never miss a birthday" → **scoped to the user's own graph** ("keep it to just you" — no arbitrary 18–50 contacts).
- **Clear-winner reconciliations applied:** §4b→shipped hard-block; drop the memorial origin; e-gift row→counsel-gated; age-out→21 for male; married-state derived from event/anchor facts (not the profile field); "completed"→occurred-confirmation; love-story dates→structured fields.

*Original sign-off table (for lineage):*

| # | Decision | Recommendation |
|---|---|---|
| B1 | **Civil + church wedding** modeling (now forced by the hard-block: a 2nd wedding event is blocked, so the same-marriage pair can't be two events) | **(a) One wedding, a two-item ceremony list** (civil + church). Required for the hard-block not to break the common PH case. |
| B2 | **First Communion** — add to the Catholic ladder alongside Confirmation, or defer? | **Add it** (it's the middle rung ~age 7, a real PH celebration). |
| B3 | **Religious rites modeling** — one "Religious Rite" type + faith-driven rite picker, vs each rite its own event type | **One "Religious Rite" type + rite picker** (keeps the picker clean; faith→rites is authored data). |
| B4 | **Reunion + graduation** — Standard bucket (always creatable) or Personalized? | **Standard** (both can happen anytime; not one-time-per-person). |
| B5 | **Year-view holiday set** — which calendar holidays surface | Christmas ✅ · Valentine's ✅ · **+ Mother's/Father's Day, New Year?** · Undas stays OUT (burial retirement). |
| B6 | **Household** — consent asymmetry (joint kids auto-shared · each spouse's own relatives opt-in) + dissolution co-parenting rule | **Confirm both** (counsel-adjacent — feeds G1). |
| B7 | **18–50 dependent-adult gap** — accept for V1 (PWD/dependent adults outside the <18/>50 fence use plain date entry)? | **Accept for V1.** |
| B8 | **Muslim concurrent-wedding exception** — accept that the hard-block also blocks the PD-1083 concurrent case for V1, or build the exception path now? | **Accept for V1** (rare; add exception later). |
| B9 | **Authorize the batched counsel review (G1)** and the **recurring-billing build (G2)** | **Authorize both** (they gate Phases 2 & 3). |

*(Resolved already, no action: anniphary = memorable-date YES-with-guardrail; religion + civil status = reference-only/never-required; e-gifts = QR-display only.)*

---

## C. External gates to clear (prerequisites for Phases 2 & 3)

- **G1 · Batched DPO / counsel review** (DPO = owner). ONE review covering everything counsel-gated so it's not four serial reviews: dependents' data (minors' birthdate + religion + gender), faith rites for children, godparent links + third-party birthday reminders, gender-reveal due dates, the household layer, and the **BSP OPS opinion on QR-display e-gifts** (Circular 1049). → Unblocks Phase 3.
- **G2 · Recurring-billing gateway** — card-on-file + PayMongo/GCash-recurring + dunning/auto-freeze. Does not exist today; the single highest-leverage infra investment. → Unblocks Phase 2. (GCash reality: annual-prepaid + renewal reminder is the near-term path; true auto-charge is cards-only.)

---

## D. The phased build (dependency-ordered)

### Phase 1 — UN-GATED · HONESTLY RE-SCOPED to Me/Partner/self-only (flow-check)
The self-consented, couple's-own-data slate. **Flow-check correction: the dependent-driven pieces are NOT Phase 1** — the Personalized picker cards (Christening/Debut/Communion/Confirmation/Gender-Reveal), the Debut-hero onboarding, the faith-*rites* user-facing suggestions, and the Debut/60th/Christening lead-time rungs all need PR-D (Phase 3) and are DEFERRED. Phase 1 shows those as passive "coming soon" (not an actionable add-child CTA), and the personalization surface is Me + Partner + self-milestones only. Un-gated because it uses self-consented data; **the self religion/civil-status opt-in carve-out (B2) is documented, adults-only.**

0. **⚠ FIRST — wedding-guard fix (B1, code):** free the slot on COMPLETED/CANCELLED (not only archived) + the guided "is this a new marriage?" step. Fixes the live remarriage/widow defect in #3183 before anything else builds on the picker.
1. **Profile fields (self):** birthdate · civil status · religion — optional, reference-only, sensitive-PI consent copy + the "we store events, not documents" line.
2. **Life-stage picker — SELF version:** Personalized vs Standard buckets · show-but-disable · completed-milestone confirmation (own passed milestones excluded) · per-person logic scaffolded but reading only self until Phase 3.
3. **PR-B:** one-question capture for graduation / reunion / gala (org-aware copy).
4. **PR-E:** recurs toggle generalized to all types + season-window + clone-last-cycle (travel).
5. **4-page creator / per-type onboarding redirect** — align the real create flow to the design (What → Who → When → Confirm; each type redirects to its onboarding).
6. **Faith → wedding-ceremony pre-select** (religion drives the ceremony path; faith-registry already supports it) + the **faith→rites suggestion CATALOG** (authored map/logic only — no child records).
7. **Planning-timing reminders for the couple's OWN events** (the § 4c lead-time ladder + December override) + the **"first anniversary in N days" dashboard card** + silver/golden tiers on the Year view.
8. **B1 civil+church** = the wedding's two-ceremony list.

### Phase 2 — BILLING-DEPENDENT (needs G2)
9. **Recurring-billing gateway** (the infra) → then:
10. **Annual Setnayan Membership** (AI across all the couple's events) — annual-prepaid + renewal reminder near-term; card auto-renew later.
11. **Vendor 28-day auto-renew** (today manual) + **₱999/yr subdomains** (both sides).

### Phase 3 — COUNSEL-GATED (needs G1) · ships flag-off until cleared
12. **PR-D — dependent People layer:** children's birthdate + religion + gender · the <18/>50 age fence · age-out-at-18 hand-over.
13. **Life-stage picker — FULL version:** per-person milestone targeting off the dependent graph.
14. **PR-C — Debut for a dependent:** DOB → 18th (F) / 21st (M) derivation window.
15. **Faith rites for children:** Christening capture + First Communion + Confirmation (+ Aqiqah, dedication) — religion-gated, age-windowed, parish-dated, sponsor-linked.
16. **Godparents (ninong/ninang):** the edges + godchild birthday reminders (two-sided consent, never automatic).
17. **Gender reveal** due-date capture.
18. **E-gifts (QR-display only)** — after the BSP OPS opinion clears.
19. **PR-G — married household:** shared dependents + joint Year view (consent asymmetry from B6; dissolution co-parenting).

---

## E. Explicitly deferred / not in this program
- Muslim concurrent-wedding exception path (B8 accepted for V1).
- Automatic gift ledger (QR-display can't read transactions → manual social note only).
- Anything already outside V1 scope in the corpus.

---

## F. Definition of done (per phase)
- **Every PR:** typecheck + lint + tests green · changelog fragment · migration guard · verified · auto-merge.
- **Phase 1 done =** a couple can create/see their own lifecycle (all types, self milestones, planning reminders) with the personalized picker, no legal exposure.
- **Phase 2 done =** the Membership + vendor renewals bill on real recurring rails.
- **Phase 3 done =** the full family graph (children, godparents, faith rites, e-gifts, household) is live, each cleared by counsel.

**Bottom line:** § A is live. Sign § B, authorize G1+G2 (B9), and **Phase 1 can start immediately** (it needs neither). Phases 2 and 3 start when their gate clears — and the honest promise (Positioning § 6) is exactly Phase 1 today, growing to the full graph as G1/G2 land.
