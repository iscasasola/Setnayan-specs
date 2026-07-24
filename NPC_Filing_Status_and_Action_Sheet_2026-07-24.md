# NPC Filing — Status & Action Sheet (2026-07-24)

> **What this is:** a verified, single-page answer to "what do we have, and what can we do now?"
> Built by reading each document in `NPC_Compliance/` + the live `apps/web/app/privacy/page.tsx` on `origin/main`, not by trusting the older audit. Where the 2026-07-16 audit is now stale, it's corrected below.
> **Not legal advice.** External PH counsel remains the gate before lodging (the pack says so itself).

---

## 1. Documents we possess (verified state)

All live in `NPC_Compliance/` (both `.md` + `.docx`), mirrored as PDFs in `NPC_Submission_PDF_2026-07-16/` and bundled into the app at `apps/web/assets/npc-docs/`.

| # | Document | NPC pillar it serves | Verified state |
|---|---|---|---|
| 00 | README / Compliance Pack index | — | ✅ Complete |
| 01 | **Privacy Manual** | (c) Privacy Management Program | 🟡 Drafted, strong (12 sections) — **DRAFT/unsigned** |
| 02 | **Records of Processing Activities (RoPA)** | RoPA | 🟡 Drafted (12 systems) — **DRAFT**; reconcile scope vs dossier |
| 03 | **DPO Designation + NPCRS Registration Sheet** | (a) DPO + (e1) DPS registration | 🟡 Drafted — **most blanks answerable from doc 07 (see §3)**; unsigned |
| 04 | **Data Breach Management Policy** | (e2) Breach | 🟡 Drafted, Circular-16-03-aligned — **DRAFT/unsigned** |
| 05 | DPIA Register (indexes R-01…R-08) | (b) DPIA | 🟡 Drafted |
| 06 | DPIA — Face Vectors (R-01) | (b) DPIA | 🟡 Drafted, unsigned |
| 07 | **Compliance Facts Register** | fills the blanks in all others | ✅ Facts supplied (see §3) |
| 08 | DPIA — Anti-Fraud / Trust & Integrity (R-08) | (b) DPIA | 🟡 Drafted, unsigned |
| — | Executive Dossier (`NPC_Privacy_Compliance_Dossier`) | summary backbone | ⚠ **Under-declares SPI** vs the pack — demote to summary |
| — | Creator-Economy + Vendor-AI/Deep-Search addenda | RoPA deltas | 🟡 Drafted (2026-07-17 / 07-22) |

**Reading:** every NPC "five pillar" has a real, well-drafted document. Document *existence* ≈ 90%. What's missing is **adoption (signatures), a few executed artifacts, and the counsel pass** — not drafting.

---

## 2. Corrections to the older (2026-07-16) audit — verified against live code today

- ✅ **Biometric "we do not collect" denial is FIXED.** `origin/main` `privacy/page.tsx` now properly discloses face-vector processing (opt-in + timestamp, 18+ only, per-event scoped, withdrawal deletes) and states the account-wide profile is "not active pending DPO review." The audit's B3 "biometric landmine" no longer applies.
- ✅ **NPC pack PDFs are already bundled** into the app (`apps/web/assets/npc-docs/`).
- ⚠ **DSR response-time contradiction is REAL and still open:** the live `/privacy` page says **15 business days**; the Privacy Manual (doc 01 §6) + DPO sheet (doc 03) say **7 business days**. Pick one before filing (see §5, decision D1).

---

## 3. NPCRS registration sheet — how close it actually is

Doc 03 shows 43 `[TO CONFIRM]` markers, but **doc 07 (Facts Register) already resolves most of them.** Merged view:

| NPCRS field | Value (from doc 07) | Still needed? |
|---|---|---|
| PIC legal name | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** (sole prop) | ✅ have |
| Proprietor / DPO | Indalecio Sacdalan Casasola II · iscasasolaii@gmail.com | ✅ have |
| DTI Business Name No. | **8297508** (National · 25 Jun 2026 – 25 Jun 2031) | ✅ have |
| Principal address | 76 Sampaguita Avenue, Quezon City | ⚠ **need barangay + ZIP** |
| BIR TIN / Form 2303 | held by owner in admin → Compliance (not in repo) | ⚠ **owner enters at filing** |
| DPO position/title | Proprietor also serving as DPO | ⚠ **confirm exact title string** |
| DPO employment basis | Internal (proprietor = DPO, 2-person team) | ✅ have (counsel to bless PIC=DPO) |
| DPO phone | — | ⚠ **need a contact number** |
| Total headcount | **2** (owner + Claire E. Buanhog, VP) | ✅ have |
| Total data subjects | ~**401** (19 customers + 50 vendors + 332 guests) | ✅ have (grows) |
| Data subjects w/ sensitive PII | **0 active biometric**; subset of vendors submit gov-ID | ✅ have |
| Automated decision w/ significant effect | YES — Anti-Fraud auto-suspend (reversible); irreversible ban is human-gated | ✅ have |
| Cross-border transfers | YES — SG + APAC + US sub-processors | ✅ have |
| Effectivity / adoption date | — | ⚠ **set = date you sign** |
| Breach hotline | — | ⚠ **one mobile suffices to start** |

**So the "43 holes" collapse to ~6 real owner inputs:** (1) barangay+ZIP, (2) BIR TIN (you hold it), (3) exact DPO title, (4) a phone number, (5) which sub-processors have a signed DPA, (6) the adoption/sign date.

---

## 4. What I can do now (no owner input, no counsel needed)

1. **Produce a consolidated, near-complete NPCRS data sheet** — doc 07 facts merged into doc 03, leaving only the 6 blanks in §3 highlighted. → *This file is step 1 of that; I can output the clean fillable sheet next.*
2. **Reconcile the internal contradictions** across the pack (one DPO email, one DSR SLA, one RoPA scope) — once you pick the DSR number (D1 below).
3. **Prepare clean signature-ready ("adopted") versions** of the Privacy Manual, DPO Designation, and Breach Policy — DRAFT banners removed, effectivity-date + signature blocks laid out for wet/e-signature.
4. **Draft the two missing HIGH-risk DPIAs** (R-03 Vendor Verification, R-05 Minors/Legacy) from the existing DPIA pattern, marked counsel-review-required.
5. **Write the Legitimate Interest Assessments (LIAs)** for Anti-Fraud + Device-Fingerprint (both named as required, neither written).

## 5. What needs YOU (owner) — the actual barriers

- **D1 — Decide the DSR response time: 7 or 15 business days?** Live site says 15; pack says 7. (Recommend **15** — it's already what you promise publicly and is easier to meet. I'll align the pack to it.)
- **Supply the 6 facts** in §3 (address granularity, DPO title, phone, DPA confirmations, adoption date; TIN you enter directly at filing).
- **Sign + date** the adopted Manual / DPO Designation / Breach Policy once I prep them.
- **Download each sub-processor's DPA** (Supabase, Vercel, Cloudflare, Resend, etc.) — mostly a click on their trust/legal page.
- **File the DPS on NPCRS** and capture the acknowledgment/registration number.

## 6. The one thing neither of us can skip

- **One external PH counsel pass** on: the minors cluster (§3(l)), the vendor gov-ID + AMLC/PEP basis, and the automated fraud-suspension (§16(c)/§34 contest path). Every document in the pack names this as the gate before lodging. It is the terminal step.

---

### Recommended order to actually clear the barrier
1. You answer **D1** + send the 6 facts → I close the NPCRS sheet + reconcile the pack (same day).
2. I prep the signable adopted docs + the 2 DPIAs + LIAs → you sign.
3. You collect DPAs + do the counsel pass.
4. You file on NPCRS, capture the reg number → **registered.**
