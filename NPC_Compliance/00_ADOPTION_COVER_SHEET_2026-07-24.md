# NPC Pack — Adoption Cover Sheet (2026-07-24)

> **What this is:** the one page that tells you what's ready, what you still owe, and the exact order to file. Points at the three new `*_ADOPTED_2026-07-24.md` documents.
> **Posture (owner-locked 2026-07-24): adopt now, counsel later.** External PH counsel review is **recommended, not a precondition** to adoption or filing. Any change counsel or the NPC later requires is applied by a **dated amendment**, and any affected live feature can be switched off instantly via the in-app Data Privacy control board (`/admin/data-privacy`). **Not legal advice.**

---

## 1. The three adoption-ready documents

| Document | File | State |
|---|---|---|
| Privacy Manual | `01_Privacy_Manual_ADOPTED_2026-07-24.md` | ✅ Facts merged · signature block ready |
| DPO Designation + **consolidated NPCRS data sheet** | `03_DPO_Designation_and_NPCRS_ADOPTED_2026-07-24.md` | ✅ Facts merged · Part B is the fillable NPCRS sheet |
| Data Breach Management Policy | `04_Data_Breach_Management_Policy_ADOPTED_2026-07-24.md` | ✅ Team + timings set · signature block ready |

The original `*_DRAFT_2026-07-05.md` files are **untouched** (kept for lineage). The `.docx`/PDF mirrors are **not yet regenerated** — do that in one pass *after* the 6 fields below are filled, so we render once with final values.

## 2. What's already filled (verified from the Compliance Facts Register)

- PIC: **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** (sole prop of Indalecio S. Casasola II) · DTI **8297508** (25 Jun 2026 – 25 Jun 2031)
- DPO: **Indalecio S. Casasola II** · iscasasolaii@gmail.com · registered on the NPC DPO system **2026-07-07**
- Headcount: **2** (owner + Claire E. Buanhog, VP) · data subjects: **~401** (19 customers + 50 vendors + 332 guests; grows) · **0** active biometric
- DSR response SLA: **15 business days** everywhere · breach notification: **72 hours**
- Sub-processor jurisdictions filled (Vercel/Resend/Suno = US; Suno holds no personal data) · automated-decision declaration = Anti-Fraud auto-suspend (reversible)

## 3. The 6 fields only you can supply (before filing)

These are the *only* real blanks. They must be **real values, not placeholders** — do not file with blanks.

1. **Barangay + ZIP** for 76 Sampaguita Avenue, Quezon City
2. **BIR TIN / Form 2303 number** — enter directly at filing from admin → Compliance (never write it into these files)
3. **Exact DPO position/title string** (e.g. "Proprietor & Data Protection Officer")
4. **One contact phone number** — serves PIC contact + DPO contact + breach hotline
5. **Which sub-processors have a signed DPA on file** (+ the PostHog instance region: US or EU)
6. **Adoption / signature date**

## 4. One thing to resolve so the declaration is accurate

⚠ **Is third-party vendor ID verification actually live?** The draft NPCRS sheet lists Persona/Veriff/Onfido ID verification + AMLC/PEP screening as *active* sensitive-data flows, but the live `/privacy` notice says those providers are **not currently active (a stub, no data flowing)**. Every such spot is flagged `⚠ STATUS TO CONFIRM` in the docs. **Confirm the real status**; if inactive, declare them as **roadmap/planned**, not active. (This is the kind of thing worth a counsel eye when one is engaged — but it doesn't block filing.)

## 5. Order to file

1. Fill the **6 fields** (§3) + resolve the **verification-status flag** (§4).
2. Regenerate the `.docx`/PDF mirrors of the three docs in one pass.
3. DPO signs the approval blocks (Manual §12 · Designation A.5/B.9 · Breach §11) and sets the effectivity date.
4. File the data processing system on the **NPCRS**; capture the acknowledgment/registration number into the post-filing blanks.
5. (Recommended, non-blocking) Book the external PH counsel pass on the three risk areas — **minors' data, vendor gov-ID + AMLC basis, automated fraud-suspension** — and apply any change by dated amendment.

## 6. Your "just in case" kill switch (already built)

If the NPC objects to any specific processing, you do **not** need a lawyer or a redeploy: open **`/admin/data-privacy`** and flip that capability to **Blocked** / **Off**. Every feature gate reads that board **fail-closed**, so the processing stops immediately. Documents are handled by amendment; features are handled by the toggle.
