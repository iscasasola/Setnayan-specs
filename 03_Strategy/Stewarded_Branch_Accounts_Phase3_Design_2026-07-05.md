# Stewarded ("Branch") Accounts — Phase 3 Design

**Date:** 2026-07-05
**Status:** DESIGN — Phase 3, **counsel-first**. Nothing here is built or live. Adults-only Phase 2 is what shipped; this is the deliberate next phase.
**Owner framing (2026-07-05):** "A branch account that can be transferred to a new account anytime — like an investment, ready for inheritance."
**Relates to:** `People_Graph_and_Lifelong_Identity_2026-07-04.md` (§ Plan→Live→Archive→Legacy), memory `project_setnayan_person_spine_model`, `project_setnayan_face_recognition_boundary`.

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
4. **Preservation is FREE forever; monetize ENHANCEMENT, not preservation** (owner-aligned recommendation). Never a recurring fee to *prevent loss* of a deceased's memories — that would poison the "memories are never lost" promise, and base storage cost (R2) is near-zero and falling. A premium **Legacy Vault** (high-res masters, expanded storage, curated books/prints, designed memorial page, AI tribute films) is the fair paid layer. **Principle only — exact pricing rides the holistic review.**
5. **Legacy default = MEMORIAL, kept as THEIRS** (owner-locked 2026-07-05). On death the person's page becomes a **permanent memorial that stays active under their OWN name/identity** — read-mostly, a living tribute. It is **NOT renamed or absorbed** into anyone else's account (this is the key difference from a *minor's* branch, which becomes the child's own account). Direct-line next of kin **inherit the KEEPER / steward role** — curate, protect privacy, add tributes, decide who may contribute — **not ownership of the identity**. Any branches the deceased was stewarding pass down the line to the next appropriate kin. In model terms: the memorial is the deceased's node, frozen as theirs, with a `person_stewardships` (kind `estate`) row assigning a direct-line kin as *keeper*.
6. **Multiple branches per steward = YES** (owner-locked 2026-07-05). One steward (e.g. a parent) can hold several branches at once (3 kids). Schema already supports it (no one-branch-per-steward constraint).
7. **No teen "assisted access" for now — ownership at 18 only** (owner-locked 2026-07-05, superseding the "optional teen window" note in item 1). Keep the simplest, safest line: nothing autonomous before majority; a supervised teen mode can be added later ONLY if counsel blesses it.

### Remaining for counsel
- **Guardian consent** — what standard proves guardianship, and its scope on a minor's behalf?
- **Majority transfer** — identity-verification bar to hand over the node? Any notice/waiting period? And is a counsel-approved teen "assisted access" (view-only, guardian-owned) permissible before 18?
- **Post-life** — proof of death + proof of direct-line heir required before an inheritance transfer? Memorial-by-default until then?
- **Data-retention** — limits on how long a stewarded branch may accrue data pre-claim?
- **Revocation** — compliant reversal path if a transfer was wrongful?

## 6. Build sequence (when counsel clears it)

1. **Inert scaffolding (safe now, additive):** `person_stewardships` table (empty, deny-by-default RLS) + reserved transfer-audit table. No behavior. *(Mirrors how Phase 2 schema shipped ahead of its flow.)*
2. **Guardian branch creation + minor wall-off** (flag-gated).
3. **Majority transfer flow** (verification + relinquishment + audit).
4. **Legacy: pre-designation + death-gate + memorial/inherit** (the Legacy slot goes active).

Each step flag-gated, counsel-cleared, DPIA where required (minors + post-mortem each warrant one).

---

*Design only. The primitive is already in the shipped spine; Phase 3 is the governance + legal clearance around transferring ownership of a stewarded node. Paired deliverable: a minors-and-legacy counsel brief (same format as `Phase2_Counsel_Review_Brief_2026-07-05.md`).*
