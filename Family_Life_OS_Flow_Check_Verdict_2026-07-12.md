# Flow-Integrity Synthesis Verdict — Family Life OS

## 1. Headline

**HAS-BREAKS.** Not clean, not perfect. All five independent lenses returned `has-breaks` — that unanimity is itself the finding. This is a genuinely strong design with a coherent spine (the anchor model, the People layer, the deterministic-AI discipline), but it has **three live or near-live blockers** and a cluster of majors that will each stall or mis-build if a builder starts today. Two of the breaks are already **shipped to main** (the wedding hard-block; the sensitive-PI collection sits one build away). The council checked the *ideas*; it did **not** fully check that the shipped code, the design docs, and the phase gates tell the same story — and in several load-bearing places they don't.

Do not build from this as-is. It needs a reconciliation pass first — most of it is decisions, not engineering.

---

## 2. Must-fix-before-build (blockers + majors, deduped, ranked)

### 🔴 BLOCKERS

**B1 — The shipped wedding hard-block contradicts the design it was built from, and dead-ends real PH couples (live on main now).**
*Flagged by 4 of 5 lenses (journey, contradiction, edge, sequencing).* `#3183` shipped a flat "one-wedding-at-a-time HARD block." Design §4b explicitly rules enforcement must be **"guided, not walled… never a hard block."** The gap dead-ends the most common PH pattern: a couple married civilly who tries to create their church wedding (often years later), and any widow/annulled user attempting a legit remarriage. The retrofit fixes (B1 two-ceremony list, B8 Muslim PD-1083 concurrency) are **unsigned §B sign-offs** — so the dead-end is live while its fix is un-ratified.
**Decision needed:** Code is canonical, so the hard-block wins the *text* fight — but the owner must confirm `#3183` actually (i) **frees the wedding slot on cancelled/archived/completed** status so remarriage works, and (ii) routes second-wedding attempts through the §4b disambiguation branch (church-of-same-marriage / vow-renewal / new-union) instead of a support-ticket wall. Then correct §4b + lock B1 before item 8 builds. **If the slot doesn't free on completed/cancelled, this is a defect against real remarriage/annulment cases — fix the code, not the doc.**

**B2 — Phase 1 is declared "UN-GATED (no counsel)" but its very first item collects two SENSITIVE-PI fields (own religion + civil status).**
*Flagged by 2 lenses (sequencing, gate) — and it invalidates the whole safety story.* The plan's own standing principle: "counsel-gate anything touching… sensitive PI." Faith §1 and Design §3c both label religion + civil status sensitive PI under RA 10173 §3(l). G1's counsel scope covers only *dependents'* religion/gender — never the user's own. So Phase 1 item 1 either violates the headline rule or secretly depends on a Phase-3 gate. Compounding it (gate lens): the "higher-consent capture" is **named but never specified** — no per-field opt-in, purpose statement, or withdrawal path is designed, and "we store events, not documents" is a data-minimization slogan being treated as if it were a consent basis (it is not, legally).
**Decision needed:** Explicitly document whether self-consented sensitive PI is **carved out** of the counsel-gate (with a DPO note that self opt-in copy needs no external review) or **move item 1 behind G1**. Either way, specify the actual consent UX (separate per-field opt-in for religion and civil status + plain purpose line + easy withdrawal) *before* item 1 builds. Do not ship on an unstated exemption.

**B3 — The "never miss a birthday" headline promise breaks for the single most common recurring event: an 18–50 relative's birthday.**
*Flagged by edge lens.* The Birthday anchor targets only Me / Partner / dependent, and the <18/>50 fence forbids a stored anchor for anyone in between — so a sibling, friend, parent-under-50, or adult child has **no recurring reminder**, and "invite them, never register" fails for surprise parties and on-platform adults. Positioning §6's headline ("you never miss what matters") is false by default for this whole band.
**Decision needed:** Either add a "someone else" branch with a reminder-only contact (name + date, no full dependent record, no fence), or **scope the Positioning §6 promise down** to Me/Partner/<18/>50 and stop advertising universal birthday coverage. Also decide surprise-mode (hide-from-honoree) — memory flags it as an unbuilt primitive not in this program.

### 🟠 MAJORS

**M1 — The show-but-disable picker rule collides with honesty in Phase 1.** *(journey, sequencing, gate — 3 lenses)* §3c mandates "show everything, disable what doesn't apply, NOT hidden," but every Personalized card (Christening, First Communion, Confirmation, dependent Debut, Gender Reveal) can only unlock via PR-D or pregnancy capture — both Phase 3, un-buildable in Phase 1. So the Phase-1 picker either shows greyed cards whose "unlocks when you add your child" CTA routes into a flag-off flow (dishonest dead-end, violates Positioning §6) or hides them (violates §3c's lock). **Fix:** define Phase-1 copy that is truthful without a live dependent flow — passive "coming soon," not an actionable add-child CTA — or record a deliberate temporary deviation from the show-everything lock until Phase 3.

**M2 — Reference-only religion/civil-status lock vs. features that functionally depend on those fields.** *(contradiction)* The lock says these are "never to verify, gate, share, or require." But §2b ("household forms at married"), §3c ("civil status → union-anchor stage"; disabling the Wedding card on civil_status=married *is* gating), and §4b ("concurrency only under the Muslim flow" gates on religion=Muslim) all make them load-bearing. If a user leaves civil status blank (their right), does the married household never form? **Winner: the reference-only lock.** Derive married-state, wedding-disable, and union stage from **event/anchor facts** (an on-platform wedding, the union anchor's stage), never the profile field; make the Muslim rite an event attribute, not a profile-religion gate.

**M3 — The burial-retirement lock is leaking back in through the memorable-date catch-all.** *(contradiction)* The council killed generalized anniversaries 3-to-1 to avoid reopening owner-retired burial/babang-luksa. §3b's override keeps a catch-all origin "A date that matters to us," a "user's words" free-label, and a nudge branch "some memorable dates are for remembering, not partying" — which is *designing for the mourning case*. A user can enter a parent's death anniversary; `#3176` then fires an annual reminder = a death-anniversary tracker, exactly what 2026-05-16 killed. **Winner: the burial-retirement lock.** Drop the catch-all origin and the free-label, delete the "for remembering" nudge branch (it concedes the leak). Label-only guardrails don't hold.

**M4 — Age-out-at-18 contradicts the 21M debut rung.** *(contradiction, edge)* §2 hands a dependent record to the child at 18 and goes dormant; but the ladder derives the male debut at **21** (18F/21M, PR-C). A son's record is handed over three years *before* his 21st debut, so the parent-planned 21M debut loses its anchor and the T-12mo heads-up can never fire. **Fix:** male records persist to their actual derived last milestone (21), not a flat 18 — or explicitly declare the 21M debut not parent-anchorable. Pick one.

**M5 — "Completed = event date passed" can't tell a wedding that happened from one postponed/ghosted.** *(edge)* When an unheld date slips by, the union flips to "married," the slot frees, and anniversary/silver/golden derivation starts firing off a wedding that never occurred. **Fix:** gate "completed" on an explicit held/occurred confirmation (or reschedule signal), not date-passed alone, before flipping stage or deriving anniversaries.

**M6 — A pre-marriage breakup has no teardown; the union anchor keeps sending anniversary reminders for a dead relationship.** *(edge)* §2b defines dissolution only for the *married* stage, but §5 fires "relationship anniversary" nudges off the dating/engaged union anchor too. **Fix:** define a pre-marriage union-anchor teardown symmetric to the called-off-wedding slot-free rule.

**M7 — Minor self-accounts process sensitive PI on void consent.** *(edge)* Phase 1's "self-consented, no counsel" rests on valid consent, but no minimum self-signup age is set and §3c enables the debut milestone "at ~17," implying minor self-accounts — whose self-consent is not valid under RA 10173. **Fix:** set/enforce an adult minimum for self-accounts (or route minors through guardian consent) and state it in the Phase-1 gate rationale.

**M8 — No moment ever prompts the optional self profile fields, so personalization is starved by default.** *(journey — 2 related findings)* The journey assumes new user → profile → picker, but the birthdate/civil/religion fields are only ever "gained" opt-in via Settings; the default wedding customer reaches the picker with an empty profile, the entire Personalized bucket is inert, and the empty-profile completed-milestone confirmation is undefined (a dead greyed panel is the first impression of the "personalized" half). **Fix:** define where the self fields are offered (skippable card in create-flow screen 1, or first-run nudge) with the consent copy at that point, and specify the empty-profile picker state (collapse the Personalized section or show one "Add your birthday to personalize" prompt instead of a wall of greyed cards).

**M9 — The 4-page creator promises "each type redirects to its onboarding" as if all 14 exist in Phase 1.** *(sequencing)* Debut (the second revenue hero, hero-ordered in the grid), Christening, and dependent Birthday all need PR-D (Phase 3). A Phase-1 user taps the Debut hero and hits "add dependent" — a dead end. **Fix:** in item 5, enumerate which onboardings are Phase-1-live (Me/Partner-scoped) vs. Phase-3 stubs, and specify the stubbed-hero behavior (placeholder / "coming soon" / self-only).

**M10 — Me/Partner person-store schema ownership is unresolved across the phase boundary.** *(sequencing)* §2 introduces the People layer (Me + Partner + Dependents) as one PR-D unit (Phase 3), but the Phase-1 picker needs a Me/Partner store. No Phase-1 PR creates it, and it's unstated whether Me = profile.birthdate + Partner = union anchor, or a shared table entangled with the gated dependent schema. **Fix:** add a Phase-1 sub-item defining the Phase-1 person store (Me = profile field, Partner = union anchor/PR-A) and state that **no** PR-D dependent table/RLS is required for the self picker.

**M11 — The faith→rites catalog (item 6) is inert in Phase 1.** *(sequencing)* Every rite except Matrimony targets a child; a self-only couple with no dependents gets **zero** actionable suggestions, so collecting religion "to unlock its rites" pays off nothing beyond the wedding-ceremony pre-select. **Fix:** reframe item 6's Phase-1 scope to the wedding-ceremony pre-select only; label the rites catalog as authored groundwork whose user-facing suggestions are Phase 3. Reconcile with Positioning §6.

**M12 — Item 7 imports "the §4c lead-time ladder" wholesale, but ~half its rungs need PR-D.** *(sequencing, gate)* Debut (T-12mo), 60th (T-9mo, >50 fence), and the Christening birth-window all fire off stored dependents/elders — Phase 3. For a newly-married couple the only near-term Phase-1 reminder is "1st anniversary"; silver/golden are 25/50 years out. **Fix:** scope item 7 to self/union-triggered tiers only and explicitly defer Debut/Christening/60th to Phase 3.

**M13 — Blended-family duplicate child records defeat the "1 per person, ever" and canonical-source guarantees.** *(edge)* An individually-owned, un-shared child exists as a separate record in each parent's account; §4b and Verdict §6 both assume one canonical record, so duplicate debut/christening become creatable inside the very feature built to prevent them. **Fix:** define cross-account person identity/dedup, or explicitly downgrade the guarantee to per-account (drop "ever").

**M14 — The §6 build/gate table calls e-gifts "Light — NOT a payments/EMI concern," contradicting the open BSP OPS gate.** *(gate)* The same doc's §5, the master plan's G1, Phase-3 item 18, and Positioning §6.4 all say launch is **counsel-gated on the BSP OPS Circular 1049 question.** The gate-reference table conflates the settled point (not an EMI) with the open one (OPS registration) and lands on "not a concern" — a builder reading the gate table would ship e-gifts ungated. **Winner: counsel-gated.** Rewrite the §6 row to match §5.

**M15 — Love-story date extraction risks breaking Rule 1 (deterministic AI).** *(contradiction)* §2/§7/PR-A capture relationship-start + proposal dates "via the love story." If those come from a prose paragraph, inferring dates is LLM/NLP work, which Rule 1 forbids. **Fix:** confirm both are explicit **structured date-picker fields**, not inferred from prose. If only prose exists today, add the fields — do not add an extraction LLM.

---

## 3. The genuine contradictions — and which side wins

| Contradiction | Winner | Why |
|---|---|---|
| §4b "never a hard block / lean-(b) two events" vs shipped `#3183` hard-block + B1(a) | **Shipped code + B1(a)** | Code is canonical (CLAUDE.md source-of-truth order). §4b text must be corrected. *But* owner must verify the slot frees on completed/cancelled so remarriage isn't a defect. |
| Reference-only religion/civil-status lock vs features gating on them | **The reference-only lock** | It's an explicit lock; derive state from event/anchor facts instead. |
| Burial-retirement lock vs §3b memorable-date catch-all + memorial nudge | **The burial-retirement lock** | Owner-retired 2026-05-16; label-only guardrail doesn't hold. |
| Age-out-at-18 vs 21M debut rung | **Persist to actual last milestone (21)** | The flat-18 text is simply wrong given the 21M rung. |
| B1(a) one-wedding-ceremony-list vs §4b lean-(b) two events | **(a), forced by shipped code** | (b) is impossible under `#3183`; the design doc still advertises the dead option. |
| §6 e-gift "not a concern" vs BSP OPS gate | **Counsel-gated** | Three other locations say launch is blocked on OPS. |
| Love-story date extraction vs Rule 1 | **Rule 1 (deterministic)** | Structured fields, never an LLM. |

---

## 4. What actually flows cleanly (the solid core)

- **The anchor-as-attribute model** (Council "YES-BUT-RESHAPED") is sound — anchors as attributes not buckets, the union anchor's staged lifecycle, the calendar-holiday layer as a PII-free ruleset. No lens attacked the core concept.
- **The deterministic-AI discipline (Rule 1)** is coherent everywhere *except* the one love-story extraction seam (M15) — and that's a "confirm the field is structured" fix, not a design flaw.
- **The People-layer single-table shape** is clean design; its only problem is *phase placement/ownership* (M10), not the model.
- **The gender-neutral civil-status + reference-only religion** stance is genuinely privacy-forward; the same-sex/social-married handling just needs one explicit "married = self-declared social stage, not a legal check" line (edge minor).
- **The cardinality anti-abuse dividend** (1-per-union, staged anchor, fenced dependent) is a real structural win — it only needs the §3b non-union memorable-date surface capped to close the one leak (contradiction minor).
- **The honesty audit (Positioning §6) itself** is a strength — several breaks were caught *because* §6 already states what's not deliverable. The problem is other docs contradicting §6, not §6 being wrong.

---

## 5. Did Phase 1's "un-gated, buildable now" claim survive?

**No — it did not survive the sequencing or gate audits.** Both lenses independently broke it, on two separate grounds:

1. **The gate leak (B2/G-M1):** Phase 1 item 1 collects self religion + civil status = sensitive PI, which the plan's own standing principle says to counsel-gate. The "un-gated" claim rests on an **unstated, unspecified** self-consent carve-out. Until that carve-out is written down (and the consent UX designed), "no counsel needed" is not a safe claim.

2. **The dependency leak (M9–M12):** roughly half of what Phase 1 promises — the show-everything picker's Personalized cards, the Debut hero's onboarding, the faith→rites suggestions, and half the lead-time ladder — silently depends on PR-D / pregnancy capture, which are **Phase 3, counsel-gated**. Phase 1 as written promises more than Phase 1 can build. It's not that Phase 1 is un-buildable; it's that its *scope is overstated* and the honest Phase-1 surface is Me/Partner/self-only, materially thinner than the docs imply.

**Verdict on the claim:** Phase 1 is buildable *after* (a) the self-sensitive-PI consent decision is documented and (b) its scope is honestly cut to self/union-triggered features with the dependent-driven cards deferred. As currently written, "un-gated, buildable now" is not true.

---

## 6. So, is it perfect?

**No.** It's a strong, thoughtful design with a solid core — but it is not clean and it is not ready to build. The council checked that the *ideas* flow; it did not fully check that the **shipped code, the design docs, and the phase gates agree** — and in the load-bearing places they don't. You have **3 blockers** (one already live on main hard-walling real remarriages, one collecting sensitive PI under a "no counsel" banner, one breaking your headline birthday promise) and **~15 majors**, most of which are *decisions and reconciliations*, not engineering.

The good news: almost none of this is "the design is wrong." It's "three docs disagree and nobody picked a winner." Spend a reconciliation pass — settle the seven contradictions in §3, write down the Phase-1 consent carve-out, and honestly re-scope Phase 1 to self/union-only — and this becomes buildable. Don't let anyone start item 1 until B1, B2, and B3 have owner decisions attached.