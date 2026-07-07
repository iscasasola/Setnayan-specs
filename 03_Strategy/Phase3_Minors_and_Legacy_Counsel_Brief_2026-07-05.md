# Phase 3 (Stewarded Accounts — Minors & Legacy) — Counsel Review Brief

**Date:** 2026-07-05
**For:** PH data-privacy + general counsel (RA 10173 · National Privacy Commission · Family Code / succession)
**From:** Setnayan — operating as **SETNAYAN SOFTWARE DEVELOPMENT SERVICE**, a sole proprietorship of Indalecio S. Casasola II (DTI Business Name No. 8297508, national scope, valid 25 Jun 2026 – 25 Jun 2031)
**Data Protection Officer:** Indalecio Sacdalan Casasola II
**Purpose:** Guidance **before we build**. Unlike our Phase 2 review (features already built, awaiting a flag flip), **Phase 3 is design-only** — nothing is built yet. We want your direction to build it right the first time, because it touches areas beyond data privacy (minors, post-mortem data, succession).

> Companion to `Phase2_Counsel_Review_Brief_2026-07-05.md` (adults connections/life-stories). Full design: `03_Strategy/Stewarded_Branch_Accounts_Phase3_Design_2026-07-05.md`. Read time: ~10 minutes.

---

## 1. What Phase 3 does (one paragraph)

Setnayan stores each person as a durable profile ("person node") that accumulates their memories (photos/clips they appear in) and their confirmed relationships. Phase 3 introduces a **stewarded ("branch") account**: a person node that is **created and controlled by someone else** and whose **ownership can later be transferred** to the real person. This one mechanism serves two cases: **(a) minors** — a parent/guardian holds a child's branch, and it transfers to the child at the age of majority; and **(b) legacy/inheritance** — when a person dies, their memories pass **down their direct line** (child, then grandchild) to a designated heir, or become a memorial. The intent is that **memories are never lost** and can be passed on.

## 2. What data is involved

| Data | Purpose | Sensitivity |
|---|---|---|
| **Branch person node** — a minor's or deceased person's name, photo, relationships, and the media they appear in | The durable archive that accrues + transfers | **Personal (incl. a minor's / a deceased's)** |
| **Stewardship record** — who controls a branch (guardian / estate), on what basis, from/until when | Governs who may act for the ward | Relationship + authority |
| **Transfer + consent records** — guardian consent, pre-mortem directives, majority-transfer and inheritance-transfer audit trail | Lawful basis + immutable audit | Consent / legal |

No biometric data is used (same as Phase 2 — association is by manual tag / QR / confirmed identity only, never cross-event face recognition).

## 3. Decisions we've already made (please confirm or correct)

1. **Ownership transfers at age of majority (18).** The guardian is the lawful decision-maker for the child's data until 18; at 18 ownership + consent authority transfer to the person. We are **not** promising any sub-18 ownership transfer. *(We considered an optional teen "assisted access" — view-only use under guardian oversight, guardian keeps ownership/consent — see Q2.)*
2. **Guardian is steward until majority.** Memories accrue on the child's node throughout 0–18, managed by the guardian.
3. **Legacy passes down the DIRECT LINE only** — child → grandchild → … — never sideways (no siblings/cousins), using confirmed parent/child relationships.
4. **Preservation is free; we only charge for enhancement.** We will **not** charge a fee to prevent loss of a deceased person's memories. (A premium "vault" of *extra* features may be paid — not relevant to this review.)

## 4. The specific questions we need answered

**Minors**
1. **Guardianship + consent** — What standard should we require to prove a person is a child's parent/legal guardian, and what may a guardian consent to on the child's behalf regarding this data?
2. **Teen assisted access** — May a minor (say 13+) *view/use* their branch under guardian oversight before 18, while the guardian retains ownership and consent authority? If so, is there a minimum age?
3. **Majority handover** — At 18, must we obtain the now-adult's own fresh consent to continue processing the memories accrued during childhood? Any notice/waiting period for the transfer itself?

**Legacy / post-mortem**
4. **Post-mortem data** — Does RA 10173 (or other PH law) govern a deceased person's personal data, and who may control it after death? Any constraints on treating memories as inheritable?
5. **Proof to inherit** — What proof of death, and what proof of a direct-line heir's authority, should we require before an inheritance transfer? Is **memorial-by-default** (read-only) the right posture until that proof exists?
6. **Pre-designation** — May a living person validly designate, in-app, who inherits their memories (a directive we'd honor at death), and how binding is that against other heirs?

**Cross-cutting**
7. **Verification + reversal** — What identity-verification bar should gate *any* ownership transfer, and what is the compliant path to reverse a wrongful transfer?

## 5. What is explicitly NOT in this review

- **No biometric / facial recognition** (as in Phase 2; any future on-device face feature gets its own DPIA).
- **No pricing/payment** decision (preservation is free; a premium vault is a separate commercial matter).
- **Nothing is built** — we will scaffold only empty, inert structures until you clear the model.

## 6. What we're asking for

A written **yes / yes-with-changes** on the model in §1–3, and answers to §4 — enough for us to build minors and legacy correctly and compliantly. We understand minors and post-mortem data each likely warrant a Data Privacy Impact Assessment; we're glad to do those with your input.

---

*Plain-language brief; the underlying design, schema, and audit model can be walked through with a technical reviewer on request.*
