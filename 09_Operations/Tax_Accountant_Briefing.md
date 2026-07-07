# Tax Accountant Briefing — Setnayan V1 Launch Review

**Locked 2026-05-20.** Owner-side launch-prep document. Send this to an external PH CPA before V1 launch. Engineering has built the BIR-compliance system (iteration [0026](../0026_bir_tax_compliance/0026_bir_tax_compliance.md), 681 lines, ready for review); we need the accountant to validate **9 specific decisions** before we accept the first paying customer.

> **Why this matters.** Per NIRC § 237 + Oplan Kandado, Setnayan legally cannot accept Philippine payment without issuing a BIR-compliant Official Receipt. The engineering system is rate-agnostic (rates live in a config table) so adjustments after this review don't require code changes — just config flips.

> **For the accountant:** if you'd rather review the full spec, it's at `0026_bir_tax_compliance/0026_bir_tax_compliance.md` (681 lines). This briefing summarizes the 9 decisions that need your sign-off; the engineering team will adjust the config based on your answers.

---

## 1. Setnayan business model — 60-second summary

**What Setnayan is:** A Philippine-incorporated marketplace platform for Filipino weddings. Couples plan their wedding on the platform, browse + book vendors (photographers, caterers, florists, etc.), and pay through the platform or off-platform.

**Money flowing INTO Setnayan (taxable receipts requiring OR):**

| Revenue line | What it is | Amount |
|---|---|---|
| **Setnayan Pay convenience fee** | 5% surcharge on every vendor booking processed through the platform | 5.0% of vendor's listed price |
| **Pro / Max vendor subscriptions** | Weekly or annual subscriptions for vendors who want more platform tools | ₱4,999/wk (Pro) or ₱24,999/wk (Max) — both with annual options at 23% discount |
| **Boosted Ads / Sponsored Boost** | Marketing placements vendors can buy | ₱4,999–₱19,999/wk · ₱249,999/qtr · ₱799,999/yr |
| **Profile Spotlight** | Homepage feature placement, 3 weekly slots | ₱1,499–₱3,499/wk seasonal |
| **In-platform feature SKUs** (couple-side) | Save-the-Date renders, Setnayan Concierge wizard, Pakanta custom songs, Bespoke Monogram, Couple Keepsake Bundle | ₱49 to ₱9,999 each |

**Money flowing OUT of Setnayan (payouts to vendors triggering EWT obligations):**

| Payout line | What it is |
|---|---|
| Vendor's gross booking amount, minus the 5% Setnayan Pay fee, minus gateway terminal fee (vendor absorbs), minus BIR Marketplace Withholding 0.5% (pass-through per RMC 8-2024) | Paid out via Maya Business Bulk Fund Transfer (planned V1.5 primary gateway; V1 is manual bank transfer) |

**Current registration assumption:** Setnayan registers as a **Philippine stock corporation** with BIR Form 2303, electing **Percentage Tax (non-VAT)** at V1 launch given trailing-12-month receipts will be below ₱3M for at least the first year.

---

## 2. The 9 decisions that need your sign-off

### Decision 1 — Percentage Tax vs. VAT registration at V1

**Engineering assumption:** Register Percentage Tax (non-VAT) at V1. Switch to VAT-registered when trailing-12-month gross receipts approach ₱2.5M.

**What we need you to confirm:**
- Is Percentage Tax the right election given Setnayan will earn from a mix of marketplace fees + subscriptions + SKUs?
- Is the 3% Percentage Tax rate still applicable in 2026, or has the CREATE Law temporary 1% relief been re-extended / made permanent?
- What's the actual administrative cost of switching VAT-registered later (paperwork, OR re-printing, the 3-year irrevocability)?
- Should Setnayan voluntarily elect VAT registration at launch despite being below threshold? (Yes if input VAT recovery on R2 / Vercel / Supabase invoices is meaningful; No if simpler administration matters more)

---

### Decision 2 — ~~The 5% Setnayan Pay convenience fee tax treatment~~ ❌ WITHDRAWN (no convenience fee)

> **WITHDRAWN — no CPA input needed.** Setnayan charges **no convenience fee (0%)** and **no commission (0%)** on vendor bookings; vendor↔customer money settles **off-platform** (Setnayan never holds checkout funds, RA 11967). The 5%/3% Setnayan Pay surcharge this decision asked about was RETIRED at the 2026-06-07 reset and does not exist in the launch product, so there is nothing for the CPA to validate here. (Decision number retained to keep cross-references stable; the remaining decisions — VAT election, EWT on payouts, OR formatting for first-party SKUs — are unaffected.) Setnayan's taxable receipts are its **first-party in-app SKU sales** only.

---

### Decision 3 — Expanded Withholding Tax (EWT) rate on vendor payouts

**Engineering assumption:** Setnayan acts as withholding agent and applies a default 1% EWT on vendor payouts (the marketplace-withholding rate per RMC 8-2024, which we treat as pass-through to the vendor's income tax credit).

**What we need you to confirm:**
- Is 1% the correct rate at V1 for individual vendor income-earners (most Filipino wedding vendors)?
- Does the rate change for vendor categories (e.g., catering = goods + service, photography = service only)?
- Are vendors who themselves are VAT-registered subject to different EWT?
- Is Setnayan classified as a Top Withholding Agent (TWA — elevated rates 15% / 30%)? Our engineering assumption is **no** at V1 since we're under the gross-receipts thresholds, but the BIR has been moving more platforms onto TWA designation.
- When does Setnayan have to file Form 1601-EQ vs Form 1601-CQ?

---

### Decision 4 — Form 2307 issuance cadence

**Engineering assumption:** Quarterly Form 2307 generation, auto-emailed to each vendor at quarter-end. Engineering has a PDF template ready.

**What we need you to confirm:**
- Is quarterly the right cadence, or should we issue per-payout? (Some platforms issue per-payout for simpler vendor reconciliation; some issue quarterly as required minimum.)
- Are there formatting requirements on Form 2307 beyond what BIR publishes (e.g., specific paper size, OR-equivalent serial numbering)?
- What's our exposure if a vendor disputes the 2307 amounts during their own tax filing?

---

### Decision 5 — OR (Official Receipt) issuance — printed booklets vs. CAS (Computerized Accounting System)

**Engineering assumption:** Setnayan applies for BIR CAS (Computerized Accounting System) approval so OR-generation is electronic + sequential + gap-free in the database. Customer receives PDF, but a printed-book backup option exists if BIR requires it.

**What we need you to confirm:**
- Is CAS approval realistic for a platform of Setnayan's size, or do we need to start with printed booklets and migrate later?
- What's the typical BIR review timeline for CAS (we've heard 2–6 months)?
- If we start with printed booklets, what's the printer / supplier process we should follow?
- Does our gap-free OR sequence-numbering approach (DB-level sequence with reservation pattern) meet BIR requirements?

---

### Decision 6 — BIR Marketplace Withholding 0.5% pass-through (RMC 8-2024)

**Engineering assumption:** Setnayan applies a 0.5% withholding on vendor payouts (per RMC 8-2024 specifically for marketplace platforms) and remits to BIR. The vendor receives a separate certificate enabling them to credit this against their own tax.

**What we need you to confirm:**
- Is the 0.5% rate still current as of 2026, or has BIR revised it?
- Is this in ADDITION to or INSTEAD of the standard EWT in Decision 3?
- Are there any platform-specific filing forms (vs the standard 1601-EQ)?

---

### Decision 7 — ~~Vendor-of-record disclosure on customer OR~~ ❌ LARGELY MOOT (Setnayan not in the vendor money path)

> **Mostly moot post-2026-06-07 reset.** Because there is **no convenience fee** and vendor↔customer payments settle **off-platform**, Setnayan never receives vendor-booking money and so issues **no OR for a vendor service or fee** — the vendor issues their own OR directly to the couple for their service (their normal billing). Setnayan issues ORs **only for its own first-party in-app SKUs**.
>
> **Residual question still worth your confirmation:** when a couple buys a first-party Setnayan SKU (e.g. Papic, Save-the-Date), the OR shows Setnayan as the sole seller (Setnayan's TIN + OR Permit No.) — confirm that single-seller OR is correct and no vendor disclosure is required, since no vendor is party to that sale.

---

### Decision 8 — Annual corporate income tax — schedule + estimated payments

**Engineering assumption:** Setnayan files annual corporate income tax. Quarterly estimated payments use the standard schedule (Q1: May 15, Q2: Aug 15, Q3: Nov 15, Q4: Apr 15 of following year).

**What we need you to confirm:**
- Confirm the rate applicable to Setnayan in 2026 (currently 20% for MSMEs under CREATE; 25% for larger corporations) — Setnayan will be MSME at V1.
- Confirm Setnayan qualifies for MSME status (capital + assets thresholds).
- Are there any sector-specific credits / deductions Setnayan should track?

---

### Decision 9 — Documentary Stamp Tax (DST) on vendor contracts

**Engineering assumption:** Vendor contracts (signed via the free dual e-signature flow per V1 Gap Tier 1 #3, RA 8792-compliant) are NOT subject to DST because they're service agreements, not "loan agreements" or "lease of immovable property" under NIRC § 174-203.

**What we need you to confirm:**
- Is DST genuinely not applicable to Setnayan's vendor contracts? Or is there a "service contract DST" we've missed?
- If applicable, what's the rate + filing cadence?

---

## 3. What engineering has built (so you know what's flexible vs. fixed)

| Element | Status |
|---|---|
| Schema with effective-dated `setnayan_tax_config` | ✅ Shipped — rates updateable without code changes |
| OR sequence-numbering (gap-free DB sequence) | ✅ Shipped |
| OR PDF template (Percentage Tax + VAT variants) | ✅ Shipped — VAT variant unused until election |
| Form 2307 PDF generation (per-vendor, per-quarter) | ✅ Shipped |
| Admin tax-report exports (monthly Percentage Tax / VAT, quarterly Form 1601-EQ) | ✅ Shipped |
| TIN auto-format (PR #5) | ✅ Shipped |
| Email notification of OR issued + Form 2307 issued | ✅ Shipped via 0028 templates |
| External tax accountant review gate | ⏸️ **This document** — pending CPA sign-off before V1 launch |

**What's flexible:** all the rates (Percentage Tax %, EWT %, marketplace withholding %, MSME income tax %). All live in `setnayan_tax_config` and can be adjusted on your guidance without engineering changes.

**What's not flexible (would require engineering work to change):**
- Whether OR issuance is per-transaction (current) vs. batched (future change)
- Whether Form 2307 issuance is quarterly (current) vs. per-payout
- The CAS vs. printed-booklet decision
- VAT vs. Percentage Tax election (engineering supports both, but the election itself is a BIR filing not a config flip)

---

## 4. Setnayan operational ask of the accountant

Beyond the 9 decisions above, ongoing engagement Setnayan needs:

1. **Setup phase (before V1 launch):**
   - Validate Decisions 1–9 above
   - File BIR Form 2303 (Setnayan Ventures Inc. registration)
   - File BIR Form 1906 (permit to issue receipts) — either printed booklets or CAS approval
   - Register Books of Accounts (or get CAS approval)
   - Confirm TIN + RDO assignment for Setnayan

2. **Monthly cadence:**
   - File Setnayan's monthly Percentage Tax return (BIR Form 2551Q quarterly version OR monthly Form 2550M if VAT) via eFPS, using the admin tax-report exports
   - File monthly Form 1601-EQ (EWT remittance) for vendor withholding

3. **Quarterly cadence:**
   - Issue Form 2307 PDFs to vendors (engineering generates; accountant signs off + Setnayan distributes)
   - File quarterly Percentage Tax / VAT return

4. **Annual cadence:**
   - File Setnayan's annual corporate income tax
   - Reconcile against engineering's annual income summary

5. **Ad-hoc:**
   - Review tax treatment of new revenue lines (e.g., Setnayan Supplies markup, V1.5+ payment gateway choices)
   - Advise on VAT election timing as receipts approach ₱2.5M trailing-12-month

---

## 5. What we need back from you (deliverables)

Three things from the CPA review:

1. **Written sign-off** on Decisions 1–9 above (or proposed alternatives with rationale)
2. **Engagement letter** for ongoing monthly/quarterly/annual filings
3. **List of any BIR registrations that need amendments** before V1 launch (e.g., line-of-business code, address change post-incorporation)

---

## Cross-references

- Full BIR compliance spec (681 lines): `0026_bir_tax_compliance/0026_bir_tax_compliance.md`
- V1 Gap Analysis Tier 1 #2 (this gate item): `V1_Gap_Analysis_Status.md`
- Vendor Agreement § 3 (payment routing + tax treatment per vendor): `01_Contracts/Setnayan_Vendor_Agreement.md`
- Verified-app submission runbook (separate launch prep): `09_Operations/Verified_App_Submission_Runbook.md`
- Prod smoke-test runbook (Sentry + Resend): `09_Operations/Smoke_Test_Runbook.md`

## Decision log

- **2026-05-20 — Briefing drafted.** Consolidates the 9 specific accountant decisions needed before V1 launch into a single send-to-CPA document. Engineering side of 0026 is shipped; what gates launch is the CPA's signed-off review.
