# Stewarded ("Branch") Accounts — Phase 3 Design

**Date:** 2026-07-05
**Status:** DESIGN — Phase 3, **counsel-first**. Nothing here is built or live. Adults-only Phase 2 is what shipped; this is the deliberate next phase.
**Owner framing (2026-07-05):** "A branch account that can be transferred to a new account anytime — like an investment, ready for inheritance."
**Relates to:** `People_Graph_and_Lifelong_Identity_2026-07-04.md` (§ Plan→Live→Archive→Legacy), memory `project_setnayan_person_spine_model`, `project_setnayan_face_recognition_boundary`.

> ## ⚠ AMENDED 2026-07-30 — owner reversed decisions #4 and #5. Read § 5 before anything else.
>
> The owner re-decided three things on 2026-07-30, after the conflicts below were surfaced to him
> and he reaffirmed:
>
> 1. **#4 REVERSED — preservation is now PAID, not free.** Keeping a family line's stories is a
>    recurring charge, per account. The 2026-07-05 "preservation is FREE forever" lock is RETIRED.
>    🔴 **This reverses a statement made in writing to PH counsel** (`Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05` § 3.4 and § 5) — that brief carries a correction banner and **must be re-issued before counsel answers**, or their answer will be to a model we no longer run.
> 2. **#5 AMENDED — memorial AND per-child copies.** The memorial node stays canonical under the
>    deceased's own name (that half of #5 survives), **and** each direct-line child additionally gets
>    a copy of the ancestral stories inside their own account. Fan-out is now explicit.
> 3. **Time Capsule videos — NOTED AND PARKED** (§ 7). Not being specced or built.
>
> Everything else in this document (the one primitive, the direct-line rule, the counsel gate,
> the inert scaffolding) is UNCHANGED and still binding.

---

## 1. The one primitive

A **stewarded (branch) account** is a `people` node that:
- **exists and accrues value** — memories (life-stories), connections, editorials — from day one, and
- is **controlled by a steward** (another account) rather than by the person themselves, and
- can be **transferred** to a real owner **at any time**.

This single primitive covers what we'd been splitting into two phases:

| Direction in time | Steward | Transfer trigger | Becomes |
|---|---|---|---|
| **Pre-independence** (minor) | Parent / legal guardian | Age of majority (18 PH) — or any time the guardian chooses | The young adult's own account |
| **Post-life** (legacy) | The person (pre-designated) → estate | Death + verification | The designated heir's stewardship / a memorial |

"Minor → adult" and "deceased → heir" are the **same operation**: re-point ownership of a durable node. The node is the asset; **ownership is transferable, the memories are not lost.**

## 1a. The dependent-account mechanic (owner refinement 2026-07-05)

A branch is **not a full account while dependent** — it is a **grouped memory cluster (a "folder") that hangs off and *feeds from* a parent account.** It accrues memories from the parent's context/events while it stays nameless and dependent. The generic shape:

1. **Create** a dependent ("parasite") node that feeds from the original user — memories flow into it automatically from the parent's events.
2. **Accrue** — it clusters memories over time, walled off from adult/autonomous surfaces, with no login of its own.
3. **Cluster out on transfer** — when passed to the real person, the node **detaches** from the steward: `claimed_by_user_id` re-points to the recipient.
4. **Name it + align on birthday** — the new holder **creates their own name** for the account (`display_name` set by the claimant), and the folder **aligns to that account on the registered birthday** it has carried since creation. That act turns the dependent folder into *their* independent account.

**The registered birthday (`people.birth_date`) is the anchor** and does two jobs: (a) it is the **maturity clock** — the parent registers it when creating the folder, and majority (birthday + 18) is computed from it, which is *when* the transfer unlocks; and (b) it **carries over and aligns** the folder to the real person's account at claim. ⚠ The birthday drives *timing + alignment only* — it is **NOT identity verification** (birthdays aren't unique); the actual transfer still requires the counsel-defined verification bar (§3.2). Note: registering a minor's birthday is itself processing of a minor's personal data → counsel-first.

This is a **generic mapping technique**, not minors-only: the same mechanic makes a child's folder, a legacy folder, or any dependent placeholder that later graduates to a real owner. **The legal gate attaches to the SUBJECT, not the mechanic** — a dependent for an *adult* placeholder is far less sensitive than one representing a *minor* or a *deceased* person (those two stay counsel-first).

Schema mapping: the dependent node is a `people` row `created_by` the steward; `person_stewardships` records the steward link + `is_minor` wall-off; the memories "feed from" the parent via the same life-story multi-homing that already exists; the "cluster out + rename" is a claim (`resolve_or_claim_person` re-points `claimed_by_user_id`, claimant sets `display_name`).

## 2. Why the built spine already supports it

Nothing new is needed at the core — Phase 1 already shipped the moving parts:

- `people.claimed_by_user_id` — **who owns the node** (`NULL` = unclaimed). This is the transfer target.
- `people.created_by_user_id` — **who seeded it** (the steward, for a branch).
- `resolve_or_claim_person(email, …, p_claimer, p_creator)` — the **claim/transfer mechanic**: find-or-create, then claim-if-unclaimed. Transfer = a controlled claim.
- `person_story_items` / `person_connections` — **value accrues on the node**, independent of who controls it. A child's tagged photos and a late grandparent's connections stay attached to their node through any transfer.

A branch account is therefore just: **a person node whose `claimed_by_user_id` is currently held/deferred by a steward, with a governed path to re-assign it.**

## 3. What Phase 3 adds (the genuinely new work)

The primitive exists; the **governance around transfer** is what's new — and it's the part that needs counsel.

1. **Stewardship as first-class control.** A `person_stewardships` concept: `(steward_user_id, branch_person_id, kind ∈ guardian|estate, basis, granted_at, ends_at?, relinquished_at?)`. The steward can manage the branch's consent, hide items, and manage connections **on the ward's behalf** — bounded, logged, and revocable.
2. **The transfer flow.** Steward-initiated or claimant-initiated: identity verification of the real owner → steward relinquishment → `claimed_by_user_id` re-points → an immutable audit record. Reversible only through a new governed transfer, never silently.
3. **Minor safety rails.** A branch flagged minor is **walled off from all adult surfaces** — no connections discovery, no vendor/marketplace, no autonomous actions — until transferred. (Extends the adults-only line already enforced.)
4. **Post-life controls.** Pre-designated legacy contact (the inert Legacy-contact settings slot reserved in Phase 0 becomes active), a death-verification gate, and a memorial vs. inherited-stewardship choice.
5. **Consent bookkeeping.** Guardian-given consent (for a minor) and pre-mortem directives (for legacy) recorded as first-class, timestamped, revocable records — the audit trail counsel will require.

## 4. The hard gate — this is counsel-**first**, and broader than privacy

Phase 2 was one law (RA 10173, adults). Phase 3 touches **three** distinct legal domains, so counsel signs off **before** code, not after:

- **Children's data (RA 10173 + NPC).** Parental/guardian consent on behalf of a minor is a specific construct; processing minors' personal data has the highest bar.
- **Post-mortem data + succession.** Who may inherit control of a deceased person's data, on what proof, is **estate/succession law**, not just privacy. PH has no clean "digital inheritance" statute — this needs real counsel.
- **Identity verification at transfer.** Handing a lifetime of data to "the real owner" requires a verification standard with legal weight (and liability if wrong).

**Recommendation:** do NOT build any of §3 to-live until PH counsel + the DPO (Indalecio Sacdalan Casasola II) sign off on a minors-and-legacy brief. Design and inert scaffolding are fine; activation is gated exactly like Phase 2 was.

## 5. Owner decisions (2026-07-05) + remaining counsel questions

### Resolved by owner
1. **Minor transfer age = majority (18).** No PH statutory sub-18 self-consent age exists (unlike US COPPA-13 / EU-16); RA 10173 treats a minor's consent as the guardian's to give until majority (RA 6809). **Ownership + consent authority transfer at 18.** An optional **teen "assisted access"** window (e.g. 13+) may let the minor *view/use under guardian oversight* — but that's *access, not ownership*, and only if counsel blesses it. No hard sub-18 *ownership* transfer is promised. *(Owner floated "12"; there is no PH rule at 12 — corrected to the majority line.)*
2. **Guardian holds until age.** The parent/guardian is the steward and lawful decision-maker for the child's memories the entire 0–18 window; memories accrue on the child's node throughout. ✅ locked.
3. **Ancestral memories pass down the DIRECT LINE only** (child → grandchild → …), never sideways (no siblings/cousins). Maps to the family-graph `parent`/`child` edges; also *reduces succession-law exposure* since direct descendants are the least-ambiguous heirs. ✅ locked (counsel still confirms death + heir proof).
4. 🔁 **REVERSED 2026-07-30 — PRESERVATION IS PAID. Each holding account pays to keep the family line's stories.** Owner-decided 2026-07-30 ("charge to keep the data, as I said"), after the conflict with the lock below was surfaced and he reaffirmed it. **Every account that holds an ancestor's stories pays its own recurring fee** — four siblings holding Lolo's line = four charges. Non-payment ends preservation for *that account's copy*.

   **What this reverses, kept verbatim for lineage:** ~~*"Preservation is FREE forever; monetize ENHANCEMENT, not preservation (owner-aligned recommendation). Never a recurring fee to prevent loss of a deceased's memories — that would poison the 'memories are never lost' promise, and base storage cost (R2) is near-zero and falling. A premium Legacy Vault (high-res masters, expanded storage, curated books/prints, designed memorial page, AI tribute films) is the fair paid layer."*~~

   **🔴 Three consequences the build MUST answer before it ships — none is a re-litigation of the decision, each is a mechanic the decision now requires:**
   - **The counsel brief is now wrong.** § 3.4 and § 5 of `Phase3_Minors_and_Legacy_Counsel_Brief_2026-07-05` state "preservation is free; we only charge for enhancement" **to PH counsel**. Corrected in place 2026-07-30 + `.docx` re-issued; **re-send before counsel answers.**
   - **A new counsel question exists** (§ 5 "Remaining for counsel"): may we *delete a deceased person's data for a survivor's non-payment*, and does an heir hold a right that survives the lapse? This is not the same question as "may an heir inherit control".
   - **The public promise must change wherever it is made.** "Memories are never lost" cannot survive a deletion-for-non-payment model unqualified. Sweep marketing + `/privacy` + retention copy for it before the feature is sellable.

   **What is still open (owner has NOT set these):** the price, the billing period, the grace period after a lapse, and what actually happens at lapse — hard delete vs downgrade-to-compressed vs read-only freeze. **Recommended shape when the owner sets it:** lapse degrades to the compressed copy rather than hard-deleting, which keeps the charge real (full-res + vault features are what lapse) without a family ever being told their grandfather was erased for ₱999. Exact pricing rides the holistic review; the nearest designed line is **Alaala Keep ₱999/yr per ACCOUNT** (`Papic_Monetization_Council_Verdict_2026-07-20.md` § 64) — note `HIGH_RES_ARCHIVE` was **retired in code 2026-07-22** (PR #3523, migration `20270908796702`) and would need reviving.
5. **Legacy default = MEMORIAL, kept as THEIRS** (owner-locked 2026-07-05). On death the person's page becomes a **permanent memorial that stays active under their OWN name/identity** — read-mostly, a living tribute. It is **NOT renamed or absorbed** into anyone else's account (this is the key difference from a *minor's* branch, which becomes the child's own account). Direct-line next of kin **inherit the KEEPER / steward role** — curate, protect privacy, add tributes, decide who may contribute — **not ownership of the identity**. Any branches the deceased was stewarding pass down the line to the next appropriate kin. In model terms: the memorial is the deceased's node, frozen as theirs, with a `person_stewardships` (kind `estate`) row assigning a direct-line kin as *keeper*.
   🔁 **AMENDED 2026-07-30 (owner "both"):** this stays true — the memorial is **still not absorbed into anyone's account** — but it is **no longer the only surface.** Each direct-line child *also* gets a personally-curated copy of the stories in their own account, per **#8**. The owner's word for this was "absorbed"; what he chose is the *additive* reading, not the replacing one. Keeper role and copy-holding are **different rights** and one account may hold both.
6. **Multiple branches per steward = YES** (owner-locked 2026-07-05). One steward (e.g. a parent) can hold several branches at once (3 kids). Schema already supports it (no one-branch-per-steward constraint).

8. 🆕 **THE INVERSE ALSO — one ancestor, many holders: memorial node PLUS a per-child copy** (owner-decided 2026-07-30, "both"). #6 covered *one steward → many branches*; this covers *one branch → many holders*, which was never designed.
   - **The memorial node stays canonical and singular**, under the deceased's own name/identity, exactly as #5 locks it. It is not duplicated, not renamed, not absorbed.
   - **Each direct-line child additionally holds a COPY** of the ancestral stories inside their own account, which they may curate personally. Copies flow **down the direct line only** (#3 unchanged) — never sideways to siblings-of-the-deceased, cousins, or in-laws.
   - **Each copy is separately billed** (per #4 as reversed). Four children = four charges.
   - **🔴 The build must solve fan-out consistency, and this is the hard part.** With N copies of one deceased person's data: (a) an RA 10173 erasure or takedown request must reach **every** copy, not just the memorial — so a copy needs a durable pointer to its source node, never a detached duplicate; (b) the memorial's keeper (#5) and a copy-holder can disagree about what is shown — **the memorial wins for anything public, the copy-holder governs only their private view**; (c) a lapsed payment on one copy must not affect the memorial or any sibling's copy. **Design implication: implement copies as scoped VIEWS over the one node (per-holder curation state + visibility overlay), not as row duplication.** Row duplication makes erasure unenforceable and is the failure mode to avoid.
7. **No teen "assisted access" for now — ownership at 18 only** (owner-locked 2026-07-05, superseding the "optional teen window" note in item 1). Keep the simplest, safest line: nothing autonomous before majority; a supervised teen mode can be added later ONLY if counsel blesses it.

### Remaining for counsel
- **Guardian consent** — what standard proves guardianship, and its scope on a minor's behalf?
- **Majority transfer** — identity-verification bar to hand over the node? Any notice/waiting period? And is a counsel-approved teen "assisted access" (view-only, guardian-owned) permissible before 18?
- **Post-life** — proof of death + proof of direct-line heir required before an inheritance transfer? Memorial-by-default until then?
- **Data-retention** — limits on how long a stewarded branch may accrue data pre-claim?
- **Revocation** — compliant reversal path if a transfer was wrongful?
- 🆕 **Deletion for non-payment (added 2026-07-30, arises from the #4 reversal)** — where a survivor pays a recurring fee to preserve a deceased relative's memories, **may we delete that data when payment lapses?** Does an heir or the estate hold any right in the data that *survives* the lapse and constrains us? What notice is required before deletion? And where several direct-line descendants each hold a copy (#8), does one payer's lapse affect only their copy? **This is a different question from "who may inherit control" (§ 4 Q4–Q6) and counsel must be asked it explicitly.**
- 🆕 **Fan-out and erasure (added 2026-07-30, arises from #8)** — with one deceased person's stories held across several descendants' accounts, what is required so an erasure/takedown reaches every copy? Does the multi-copy model itself change our obligations versus a single memorial node?

## 6. Build sequence (when counsel clears it)

1. ✅ **SHIPPED — inert scaffolding:** migration `20270517133592_phase3_stewardship_scaffolding.sql` is on `origin/main` and applied — `person_stewardships` (empty, deny-by-default RLS, `kind ∈ guardian|estate`) + the reserved transfer-audit table. **No behavior, no triggers, no functions, no data.** *(Mirrors how Phase 2 schema shipped ahead of its flow.)* ✅ **DPO name corrected 2026-07-31** (PR [#3943](https://github.com/iscasasola/setnayan-platform/pull/3943)) — its header had named the DPO as "Claire E. Buanhog"; the DPO is **Indalecio Sacdalan Casasola II**. Chasing that one comment surfaced something much larger: the 2026-07-07 DPO directive **had never reached the code repo or the database**, and `platform_compliance_facts` — the source for the **`/admin/compliance/data-sheet` NPC registration export** — still named the VP as DPO in prod, `updated_at 2026-07-06`, alongside a backwards breach-response team and an `automated_decisions='None'` that went false the same day the directive was issued. Fixed by data-only migration `20271025017078`.
2. **Guardian branch creation + minor wall-off** (flag-gated).
3. **Majority transfer flow** (verification + relinquishment + audit).
4. **Legacy: pre-designation + death-gate + memorial/inherit** (the Legacy slot goes active).

Each step flag-gated, counsel-cleared, DPIA where required (minors + post-mortem each warrant one).

## 7. Time Capsule videos — NOTED AND PARKED (2026-07-30)

**Owner asked 2026-07-30:** *"Time Capsule videos? do we make these too? so ancestors can leave a message to their future generations?"* **Owner decision the same day: note it and park it.** Not being specced, not being built. Recorded here so the next session does not re-derive it from scratch.

**Verified state:** zero hits for "time capsule" anywhere in the corpus **or** in `apps/web` — this is genuinely new, the only item in the 2026-07-30 conversation that was.

**What already exists that would build it** (so nobody rebuilds these):
- **Pabati** (`₱1,299`, LIVE, paid) — up to 300 × 5s recorded video messages. This *is* the capture primitive; a capsule is Pabati plus a **recipient** (a person node rather than an event), a **release date**, and a **lock**.
- The **event-anchor spine** already computes the future dates a capsule would key off (a grandchild's 18th, a wedding, an anniversary).
- **Client-side render** (Guest Stories / Life-Flash) — ₱0 marginal cost.

**The three constraints, pre-solved so the analysis isn't lost:**
1. **No cron** (locked, cron-free architecture — periodic work is compare-and-swap inside `after()`). A capsule cannot "fire" on a date in 2046. It must **unlock lazily on read**: the heir opens it, the date is checked, it plays. Same pattern as Setnayan AI's lazy expiry. Not a blocker.
2. **Retention.** We have filed **5 years** (10-yr floor `[PENDING COUNSEL]`). **A 20–30 year capsule cannot be held under a 5-year retention notice** — it needs its own retention basis and therefore a filing change, not just code.
3. **It is post-mortem by construction** — "an ancestor leaves a message for future generations" implies the recorder may be dead at playback, which puts it inside the Phase 3 counsel gate (DPIA register **R-05**, HIGH, *"counsel required before any design-to-build"*).

**The recommended shape if it is ever un-parked:** build the **living-elder** version first — a 50+ elder (already the shipped `'elder'` fence band) records messages released on future dates *while alive and consenting*. That carries **no post-mortem law and no minor's data**, so it clears the R-05 gate entirely. The death-triggered variant is the same table with one extra release condition, added after counsel answers. It is also the strongest paid-vault candidate found to date — it monetizes **enhancement**, which is the side of the line the whole Legacy Vault idea sits on.

---

*Design only. The primitive is already in the shipped spine; Phase 3 is the governance + legal clearance around transferring ownership of a stewarded node. Paired deliverable: a minors-and-legacy counsel brief (same format as `Phase2_Counsel_Review_Brief_2026-07-05.md`).*
