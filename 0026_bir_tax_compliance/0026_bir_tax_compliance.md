# Iteration 0026 — BIR / Tax Compliance

**Iteration number:** 0026
**Topic:** Bureau of Internal Revenue (BIR) tax compliance for the Setnayan marketplace. BIR-compliant Official Receipts issued to every paying customer, VAT vs Percentage Tax decision for the 3% Setnayan Pay convenience fee, Expanded Withholding Tax on vendor payouts, quarterly Form 2307 issuance to vendors, and admin-side tax-report exports that feed Setnayan's accountant for eFPS filing.
**Surface:** Mostly invisible (PDF generation pipelines + admin reports). Customer-facing surface is a "Tax Documents" sub-section of Profile Settings → Privacy & Data (consumed by 0025). Vendor-facing surface is a "Tax Documents" entry in the vendor dashboard's Settings (consumed by 0022). Admin-facing surface is `/admin/finance/tax-reports` (consumed by 0023).
**URL patterns:**
- Customer: `setnayan.com/dashboard/customer/settings/tax-documents`
- Vendor: `setnayan.com/dashboard/vendor/settings/tax-documents`
- Admin: `setnayan.com/admin/finance/tax-reports`
**Builds on:** 0013 (Supabase Edge Functions + R2 platform stack), 0022 (vendor records + `vendors.tin` field — added here if not present), 0023 (admin payment reconciliation surface that flips `service_orders` to `paid`), and the post-token-wallet PHP-direct apply-then-pay model (decision log 2026-05-11).
**Provides to downstream iterations:**
- **0025 Profile Settings** consumes the customer-facing "Tax Documents" list + the "Update my TIN / business address" form
- **0022 Vendor Dashboard** consumes the vendor-facing "Tax Documents" list (Form 2307 PDFs per quarter)
- **0023 Admin Console** consumes the `tax-reports` exports (monthly Percentage Tax / VAT, quarterly Form 1601-EQ, annual income tax inputs)
- **0028 Email Notifications** consumes the OR-issued and Form-2307-issued events to send transactional emails
**Status:** Drafted 2026-05-12.
**Phase:** **V1 launch-blocking.** Setnayan legally cannot accept payment from a Philippine customer without issuing a BIR-compliant Official Receipt. This iteration must ship before the first paid order — even a single ₱49 Save-the-Date charge requires an OR.

---

## Why this iteration exists

Setnayan is a domestic Philippine marketplace incorporated as a stock corporation (`Setnayan Ventures Inc.` is the working assumption pending DTI / SEC registration). The platform receives money from customers (in-app SKUs + 3% convenience fee on vendor bookings routed through Setnayan Pay) and disburses money to vendors (the vendor's gross booking amount). Both directions trigger BIR obligations:

- **Money in.** Every payment received by Setnayan from a Philippine resident or business is a taxable receipt. The platform must issue a BIR-registered Official Receipt (OR) for each one. Operating without OR issuance is a violation of NIRC § 237 and exposes Setnayan to closure under the BIR's Oplan Kandado program.
- **Money out.** Every payout to a Philippine resident vendor (individual or corporation) is subject to Expanded Withholding Tax (EWT). Setnayan acts as the withholding agent, retains a percentage of the gross payment, remits it to BIR monthly (Form 1601-EQ), and issues each vendor a Certificate of Creditable Tax Withheld at Source (Form 2307) quarterly so the vendor can credit the withheld amount against their own income tax.

The platform also has to file its own returns — monthly Percentage Tax (or VAT) returns on Setnayan's gross receipts, plus annual corporate income tax. These are operationally filed by Setnayan's tax accountant via BIR's eFPS, but the engineering system needs to produce the inputs.

This iteration covers all six pieces. None of it is glamorous. All of it is required.

> **Important caveat.** Tax rules and rates change. The specific rates and thresholds named in this iteration are the current best estimates as of drafting (May 2026); every one of them is marked **"subject to confirmation with Setnayan's tax accountant"** wherever an engineering decision depends on a specific number. The schema and the report-generation pipelines are designed to be rate-agnostic — a configuration table holds the actual rates so they can be updated without code changes.

---

## 1. Setnayan business registration (operational prerequisites — non-engineering)

This section documents the legal-operational steps Setnayan must complete before any of the engineering in this iteration becomes meaningful. Engineering does not build any of this; it is captured here so the iteration's reader understands what has to be in place before the OR pipeline can issue a single receipt.

### 1.1 Required registrations

| Step | Authority | What it produces | Owner |
|---|---|---|---|
| Incorporation | SEC (Securities and Exchange Commission) | Certificate of Incorporation; SEC Registration Number | Setnayan founders + corporate lawyer |
| Business name registration | DTI (if sole prop) **OR** SEC (if corporation) | DTI / SEC business name certificate | Same |
| Mayor's permit / Business permit | LGU (City Hall of the registered business address) | Annual local business permit | Operations |
| BIR Certificate of Registration (Form 2303) | BIR Revenue District Office (RDO) | TIN; line-of-business code; tax type registration (VAT or Percentage Tax) | Tax accountant |
| BIR "Ask for Receipt" notice | BIR | Required posted notice at place of business | Operations |
| BIR Permit to Issue Receipts / Invoices (Form 1906) | BIR | Authority to print or to use a Computerized Accounting System (CAS) | Tax accountant |
| Books of Accounts registration | BIR | Stamped books (or CAS approval) | Tax accountant |
| Tax type election | BIR (filed with Form 2303 or via amendment) | Setnayan registered as either VAT-registered or Percentage Tax (non-VAT) — see § 3 | Founders + tax accountant |

### 1.2 BIR-stamped OR books vs Computerized Accounting System (CAS)

A Philippine business may issue ORs via either route:

- **Manual OR booklets.** BIR-printed booklets, each receipt hand-written or typed, signed and stamped. Cheap to start, but unworkable for a digital marketplace doing thousands of transactions per month.
- **Computerized Accounting System (CAS).** Software-generated ORs that comply with the BIR's CAS guidelines (Revenue Memorandum Order 29-2002, as amended). Requires a CAS application (BIR Form 1900) and approval from the RDO. Once approved, the system generates BIR-sequence-compliant ORs digitally, including in PDF form for email delivery.

**Setnayan's path:** apply for CAS from day one. The OR generation pipeline in § 4 below is designed to satisfy CAS requirements (sequential numbering with no gaps, no overwrites, audit trail, RDO permit number printed on every OR). The CAS application typically takes 4–6 weeks to be approved, **subject to confirmation with the assigned RDO** — Setnayan must start this in parallel with engineering build of the OR pipeline so they land at roughly the same time.

While CAS is pending, Setnayan can either (a) delay paid-product launch (acceptable for V1 since the platform itself is still pre-launch) or (b) issue manual ORs from a stamped booklet as a temporary stopgap (acceptable for the first few customers but does not scale).

### 1.3 Quarterly compliance check-ins

The assigned RDO conducts routine compliance check-ins. Setnayan operations is responsible for attending; the engineering surface only needs to produce the supporting reports (§ 7) the accountant carries to the RDO.

---

## 2. Tax-relevant concepts cheat sheet

Captured here so every later section can refer to a single shared vocabulary.

| Term | Meaning in Setnayan context | Source authority |
|---|---|---|
| **TIN** | Taxpayer Identification Number — 12-digit Philippine taxpayer ID. Setnayan has one (the corporation's); every vendor has one; customers optionally provide theirs if they want an OR they can claim as a business expense. | BIR (NIRC § 236) |
| **VAT** | Value Added Tax — 12% on most goods and services in the Philippines. Applies if a taxpayer's annual gross receipts exceed ₱3 million, or if the taxpayer voluntarily elects VAT registration. | NIRC § 105–115, as amended by TRAIN Law |
| **Percentage Tax** | 3% of gross receipts; the alternative to VAT for non-VAT-registered taxpayers. Setnayan defaults here in V1 (§ 3). **Subject to confirmation — the 3% rate has historically been 1% under temporary relief measures; current applicable rate must be confirmed with the tax accountant before launch.** | NIRC § 116, CREATE Law amendments |
| **EWT** | Expanded Withholding Tax — Setnayan withholds a percentage of each vendor payout, remits to BIR, gives vendor a credit document (Form 2307). | NIRC § 57(B), RR 2-98 as amended |
| **Top Withholding Agent (TWA)** | A taxpayer designated by BIR with elevated withholding rates (typically 15% / 30%). Setnayan is **NOT** a TWA at V1 launch (subject to confirmation; TWA designation typically follows large gross-receipts thresholds and is BIR-issued, not self-elected). | RR 11-2018 |
| **Official Receipt (OR)** | The legal proof of sale issued to the buyer. Required for every receipt of money. Contains BIR Permit Number, sequence number, parties, amounts, VAT breakdown (if applicable). | NIRC § 237 |
| **Form 2307** | Certificate of Creditable Tax Withheld at Source — issued by the withholding agent (Setnayan) to the income earner (vendor) quarterly. | BIR Form 2307 |
| **Form 1601-EQ** | Quarterly remittance return of creditable income taxes withheld (expanded). Setnayan files monthly variants and a quarterly consolidator. | BIR Form 1601-EQ |
| **eFPS** | Electronic Filing and Payment System. Setnayan's accountant uses this to file all of the above online. | BIR (Section 27.5 of NIRC implementing regs) |

---

## 3. VAT vs Percentage Tax decision matrix

A foundational tax-type election — irreversible for three years once VAT is elected, per NIRC § 109(BB).

### 3.1 The two options

| Criterion | Percentage Tax (non-VAT) | VAT-registered |
|---|---|---|
| Rate | 3% of gross receipts (subject to confirmation — see § 2) | 12% of value added |
| Trigger | Annual gross receipts ≤ ₱3,000,000 | Annual gross receipts > ₱3,000,000 **OR** voluntary election |
| Can claim input VAT? | No | Yes (on Setnayan's own expenses: R2 invoices, Vercel, Supabase, Daily.co — provided those vendors issue VAT-able invoices) |
| OR template | Includes "THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX" footer | Includes 12% VAT line and breakdown; no disclaimer |
| Setnayan Pay 3% convenience fee | 3% billed to the customer; no VAT layered on | 3% billed to the customer + 12% VAT on the 3% fee = effective 3.36% |
| Filing frequency | Monthly (Form 2551Q quarterly) | Monthly (Form 2550M) + Quarterly (Form 2550Q) |
| Switching cost | Easy upgrade to VAT later (just amend Form 2303) | **Irrevocable for 3 years** |

### 3.2 V1 recommendation (subject to confirmation)

**Setnayan launches as Percentage Tax (non-VAT).** Rationale:

- V1 launch revenue is likely to land well under ₱3M annual in the first 12 months (typical bootstrapped two-sided marketplace ramp).
- The 3-year irrevocability on VAT election is a meaningful constraint to take on before product-market fit is proven.
- The OR template is simpler under Percentage Tax (no VAT breakdown to compute).
- The 3% convenience fee stays at a clean 3% to the customer (no 3.36% rounding awkwardness).

**Migration trigger.** When Setnayan's trailing-12-month gross receipts approach ₱2.5M (i.e., 83% of the ₱3M threshold), the tax accountant initiates the VAT election with BIR. The OR template flips to the VAT variant on the effective date issued in the BIR approval letter. Schema-side this is a single configuration flip (§ 4.4).

**Both branches built in V1.** The OR generation pipeline supports both templates from day one, controlled by a single configuration row. This avoids a future rewrite when the migration happens. **Final decision subject to confirmation with Setnayan's tax accountant before BIR Form 2303 is filed.**

### 3.3 Effect on the 3% convenience fee

When a customer books a vendor through Setnayan Pay, the customer is invoiced:

```
Vendor package amount    ₱25,000.00
Setnayan Pay convenience  ₱   750.00  (3% of vendor amount)
─────────────────────────────────────
Customer pays             ₱25,750.00
```

The convenience fee is Setnayan's revenue. Under Percentage Tax, the ₱750 is taxable at 3% (₱22.50 owed to BIR). Under VAT-registered, the ₱750 becomes ₱840 (the additional ₱90 is the 12% VAT on the convenience fee), and ₱90 is owed to BIR as output VAT.

The vendor receives ₱25,000 in full (less their own EWT — see § 5). The convenience fee never touches the vendor's books.

---

## 4. Customer-facing Official Receipt generation

The engineering heart of this iteration. Every paid `service_orders` row produces exactly one Official Receipt on activation. ORs are stored as PDFs in R2 and exposed to the customer through the surface defined in § 8.

### 4.1 Schema

```sql
CREATE TABLE official_receipts (
  receipt_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number          TEXT UNIQUE NOT NULL,
    -- BIR-sequence-compliant: e.g. '2026-00001'. Format = {year}-{6-digit zero-padded sequence}.
    -- Sequence resets at the start of each calendar year and is monotonically increasing within the year.
    -- Gaps are NOT permitted — voided receipts retain their number with is_void=TRUE rather than freeing it.
  service_order_id        UUID NOT NULL REFERENCES service_orders(order_id),
  customer_user_id        UUID NOT NULL REFERENCES users(user_id),
  customer_tin            TEXT,                      -- optional, customer-supplied at order time or in settings
  customer_business_name  TEXT,                      -- optional, for corporate ORs
  customer_address        TEXT,                      -- optional, for corporate ORs
  issued_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  line_items_json         JSONB NOT NULL,
    -- Array of {description, qty, unit_php, line_total_php}.
    -- Example: [{"description":"Paparazzi 5-seat pack","qty":1,"unit_php":2499.00,"line_total_php":2499.00}]
  gross_php               NUMERIC(12,2) NOT NULL,    -- sum of line_total_php across all line_items
  vat_php                 NUMERIC(12,2) NOT NULL DEFAULT 0,   -- 0 when Setnayan is non-VAT
  net_php                 NUMERIC(12,2) NOT NULL,    -- gross + vat (the amount actually charged)
  payment_method          TEXT NOT NULL,             -- 'bdo_bank' | 'gcash' | 'paymongo_card' | etc.
  payment_reference       TEXT NOT NULL,             -- reference code matched at reconciliation
  pdf_r2_key              TEXT NOT NULL,             -- R2 key under 'setnayan-tax-docs/customers/{user_id}/or/{receipt_id}.pdf'
  is_void                 BOOLEAN NOT NULL DEFAULT FALSE,
  voided_at               TIMESTAMPTZ,
  voided_by_admin         UUID REFERENCES users(user_id),
  void_reason             TEXT,
  bir_permit_number       TEXT NOT NULL,             -- snapshot at issuance time from setnayan_tax_config
  bir_tax_type_at_issue   TEXT NOT NULL,             -- 'percentage_tax' | 'vat' — snapshot at issuance
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_or_customer ON official_receipts (customer_user_id, issued_at DESC);
CREATE INDEX idx_or_order ON official_receipts (service_order_id);
CREATE UNIQUE INDEX idx_or_number ON official_receipts (receipt_number);
```

### 4.2 OR sequence assignment — gap-free guarantee

Per BIR CAS rules, OR sequence numbers cannot have gaps. The pipeline enforces this with a Postgres-level sequence reserved per calendar year:

```sql
CREATE TABLE or_sequence_state (
  year                INT PRIMARY KEY,
  next_sequence       INT NOT NULL DEFAULT 1,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Atomic next-sequence allocation:
-- Wrapped in a SECURITY DEFINER function so callers can't bypass the ordering.
CREATE OR REPLACE FUNCTION allocate_or_sequence(p_year INT) RETURNS INT AS $$
DECLARE
  next_seq INT;
BEGIN
  INSERT INTO or_sequence_state (year, next_sequence) VALUES (p_year, 2)
    ON CONFLICT (year) DO UPDATE SET next_sequence = or_sequence_state.next_sequence + 1
    RETURNING or_sequence_state.next_sequence - 1 INTO next_seq;
  RETURN next_seq;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Voids do not free the number — the OR row keeps `receipt_number = '2026-00042'` with `is_void = TRUE` so the BIR audit trail shows 42 was issued, then voided, never skipped.

### 4.3 OR generation flow

1. **Customer pays for an in-app SKU.** Examples: ₱49 Save-the-Date Render, ₱2,499 Paparazzi 5-seat pack, ₱1,999 Custom Monogram Pack, ₱750 Setnayan Pay convenience fee on a vendor booking.
2. **Admin reconciles via the 0023 Payments surface.** Once the inbound payment is matched against the customer's order, `service_orders.status` flips to `'paid'`.
3. **Trigger:** an `AFTER UPDATE ON service_orders WHEN NEW.status = 'paid' AND OLD.status != 'paid'` row trigger fires `generate_official_receipt(order_id)` via Supabase Edge Function invocation. The trigger is idempotent — re-running on the same order is a no-op once an `official_receipts` row exists for that `service_order_id`.
4. **Edge Function runs:**
   - Pulls the customer + order rows
   - Pulls Setnayan's current tax config (TIN, BIR Permit Number, registered tax type) from `setnayan_tax_config` (§ 4.4)
   - Computes `vat_php` if VAT-registered (else 0)
   - Allocates the next OR sequence via `allocate_or_sequence(extract(year from now()))`
   - Renders the PDF via headless Chromium (using the BIR-compliant HTML template — § 4.5)
   - Uploads to R2 bucket `setnayan-tax-docs` under `customers/{user_id}/or/{receipt_id}.pdf`
   - Inserts the `official_receipts` row, snapshotting `bir_permit_number` and `bir_tax_type_at_issue` so retroactive config changes don't rewrite history
5. **Notification fired** via 0028 — email to the customer with the OR attached + a deep link to the in-app Tax Documents surface.
6. **Customer sees the OR** in Profile Settings → Privacy & Data → Tax Documents from this moment onward, indefinitely.

### 4.4 Setnayan tax configuration table

```sql
CREATE TABLE setnayan_tax_config (
  config_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  effective_from      DATE NOT NULL,
  effective_to        DATE,                  -- nullable = currently active
  business_name       TEXT NOT NULL,         -- e.g. 'Setnayan Ventures Inc.'
  business_address    TEXT NOT NULL,
  tin                 TEXT NOT NULL,
  bir_permit_number   TEXT NOT NULL,
  rdo_code            TEXT NOT NULL,
  tax_type            TEXT NOT NULL CHECK (tax_type IN ('percentage_tax','vat')),
  percentage_tax_rate NUMERIC(5,2),          -- e.g. 3.00 (subject to confirmation per § 2)
  vat_rate            NUMERIC(5,2) DEFAULT 12.00,
  is_top_withholding_agent BOOLEAN NOT NULL DEFAULT FALSE,
  ewt_default_rate_individual_pct NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    -- 5% if individual vendor's gross income ≤ ₱720K; 10% if > ₱720K — see § 5
    -- Default here is the lower-rate fallback; per-vendor override in vendors.ewt_rate_pct
  ewt_default_rate_corporate_pct NUMERIC(5,2) NOT NULL DEFAULT 2.00,
    -- Subject to confirmation — typical creditable WT on corporate professional services
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tax_config_effective ON setnayan_tax_config (effective_from DESC);
```

Tax-rate changes (e.g., BIR adjusts the Percentage Tax rate) are handled by closing the current row (`effective_to = today`) and inserting a new row (`effective_from = tomorrow`). Historical ORs continue to display the rate that was active at issuance time because `bir_tax_type_at_issue` and the line items are snapshotted on the OR row itself.

### 4.5 OR PDF template

The OR PDF is rendered from an HTML template. Per BIR CAS guidelines, the template must include every field in the template below; deviations require RDO re-approval.

**Non-VAT (Percentage Tax) variant:**

```
                           SETNAYAN VENTURES INC.
                  [Business Address — single line, registered with BIR]
                TIN: XXX-XXX-XXX-XXX · BIR PERMIT NO.: XXXXX-XXXX-XX
                       NON-VAT REGISTERED TAXPAYER

                          OFFICIAL RECEIPT
                          No. 2026-00001
                       Issued: 15 November 2026 · 14:32 PHT

Received from:
  Aira Reyes & Boy Delos Santos
  aira@example.ph · +63 917 555 0123
  TIN: (optional)             Address: (optional, for business OR)

For:
  Description                              Qty    Unit Price       Total
  Paparazzi 5-seat pack                     1     ₱2,499.00     ₱ 2,499.00
  Setnayan Pay convenience fee (3%)         1     ₱   74.97     ₱    74.97
                                                  ─────────────────────────
                                                  Subtotal      ₱ 2,573.97
                                                  VAT (12%)     ₱     0.00*
                                                  ─────────────────────────
                                                  TOTAL         ₱ 2,573.97

  * This receipt is issued by a non-VAT registered entity.

Payment received via: BDO Bank Transfer · Ref: STN-2026-AB1234

THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX.

   [BIR Permit Stamp]              [Setnayan Authorized Signature]
```

**VAT variant (post-migration):**

The footer disclaimer is removed; the VAT line shows the actual 12% computed value; line items break out VAT-exclusive amounts; a "VAT-INCLUSIVE" header is added near the total. Sequence numbering is unaffected.

### 4.6 Voiding an OR

Voiding is admin-only and lives in 0023 Admin Console → Payments → OR detail. A void requires:

- A reason (free text, ≥ 20 characters)
- Two-admin approval (per CLAUDE.md decision log 2026-05-12 § 9.1 — OR voids over ₱25K refunds count as "refund > ₱25K"; OR voids under that threshold can be single-admin but **a refund-and-reissue pattern is preferred over a void wherever feasible** because BIR auditors scrutinize void rates)
- An audit log entry

A void does not free the receipt number. The voided OR is marked `is_void = TRUE`, a replacement OR is generated with a fresh sequence number, and the relationship is recorded in a separate `or_replacements` table:

```sql
CREATE TABLE or_replacements (
  replacement_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voided_receipt_id    UUID NOT NULL REFERENCES official_receipts(receipt_id),
  replacement_receipt_id UUID NOT NULL REFERENCES official_receipts(receipt_id),
  reason               TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.7 Refunds

A refund triggers an OR void + the issuance of a Credit Memo (CM). Credit Memos follow the same BIR-permit-required rules as ORs and are a separate document class. **V1 scope note:** Credit Memo generation is a follow-on engineering surface tracked in 0026's V1.1 backlog. Until that ships, refunds are documented as a manual operations process — Setnayan's accountant writes the CM by hand from a stamped CM booklet — and engineering only voids the OR row.

---

## 5. Vendor payout withholding + Form 2307

When Setnayan disburses money to a Philippine resident vendor, the platform retains a percentage as EWT, sends the rest to the vendor, remits the withheld portion to BIR, and (quarterly) gives the vendor a Form 2307 certificate.

### 5.1 Applicable rates (subject to confirmation with accountant)

| Vendor type | Withholding rate | Source |
|---|---|---|
| Individual (sole prop / freelancer / professional) — gross income ≤ ₱720K | **5%** | RR 11-2018, § 2.57.2(I) — best estimate; subject to confirmation |
| Individual — gross income > ₱720K | **10%** | RR 11-2018, § 2.57.2(I) — best estimate; subject to confirmation |
| Corporation (vendor incorporated as Inc. / Corp.) | **2%** | RR 2-98 as amended — best estimate; subject to confirmation |
| Top Withholding Agent applies | **10% / 15%** | Subject to TWA designation status — confirm with accountant |

Vendors self-declare their type during onboarding (already captured in 0022 — `vendors.tax_type` may need to be added). The default rate is the conservative-low default; per-vendor overrides allowed when supporting documentation (latest year's tax returns showing income tier) is provided.

### 5.2 Schema

```sql
-- Augment vendors with tax-relevant fields
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS tin TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_tax_type TEXT
  CHECK (vendor_tax_type IN ('individual_low', 'individual_high', 'corporate', 'twa_individual', 'twa_corporate'));
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS ewt_rate_pct NUMERIC(5,2);
  -- Override; if null, derive from vendor_tax_type via setnayan_tax_config defaults
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS registered_business_name TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS registered_business_address TEXT;

CREATE TABLE vendor_payouts (
  payout_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id              UUID NOT NULL REFERENCES vendors(vendor_id),
  service_order_id       UUID REFERENCES service_orders(order_id),
    -- Nullable for bulk payouts that aggregate multiple orders into a single transfer
  vendor_invoice_amount  NUMERIC(12,2) NOT NULL,
    -- What the customer paid the vendor for (vendor's package amount, NOT including Setnayan's 3% fee)
  ewt_rate_pct           NUMERIC(5,2) NOT NULL,
  ewt_php                NUMERIC(12,2) NOT NULL,
    -- vendor_invoice_amount × ewt_rate_pct / 100
  setnayan_fee_php       NUMERIC(12,2) NOT NULL,
    -- 3% convenience fee charged to the customer (recorded here for ledger completeness, not deducted from vendor)
  payout_net_php         NUMERIC(12,2) NOT NULL,
    -- vendor_invoice_amount - ewt_php
  payout_status          TEXT NOT NULL DEFAULT 'pending'
                         CHECK (payout_status IN ('pending','scheduled','sent','failed','clawed_back')),
  payout_method          TEXT NOT NULL,           -- 'bdo' | 'gcash' | 'maya' | etc.
  payout_reference       TEXT,                    -- bank or GCash transaction reference once sent
  scheduled_for          DATE,
  sent_at                TIMESTAMPTZ,
  failed_reason          TEXT,
  form_2307_quarter      TEXT,                    -- '2026-Q4' assigned at end-of-quarter aggregation
  form_2307_pdf_r2_key   TEXT,                    -- populated when the quarterly Form 2307 PDF is generated
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_vendor_quarter ON vendor_payouts (vendor_id, form_2307_quarter);
CREATE INDEX idx_payouts_status ON vendor_payouts (payout_status);
CREATE INDEX idx_payouts_scheduled ON vendor_payouts (scheduled_for) WHERE payout_status = 'scheduled';
```

### 5.3 Payout flow (V1 — manual bank transfer / GCash)

V1 mirrors the inbound-payment model: payouts are manually executed by Setnayan operations via BDO online banking or GCash for Business. Engineering produces the work queue and records the result.

1. **Trigger.** When a `service_order` reaches a vendor-payable state (e.g., the event date has passed, or per the vendor agreement § 8 the milestone is due), a `vendor_payouts` row is created in `payout_status = 'pending'` with EWT calculated.
2. **Admin review.** Payouts surface in 0023 Admin Console → Finance → Vendor Payouts queue. Admin verifies vendor's bank details on file, confirms EWT calculation, marks `payout_status = 'scheduled'` with a `scheduled_for` date.
3. **Manual disbursement.** On the scheduled date, operations executes the transfer via BDO online banking or GCash for Business, copies the transaction reference back into 0023 admin, marks `payout_status = 'sent'` with `payout_reference` and `sent_at`.
4. **Vendor notification.** 0028 emails the vendor "₱X has been sent to your registered account · reference Y" with a remittance advice attached (PDF — separate template from Form 2307; the remittance advice is informal, Form 2307 is the legally binding tax document issued quarterly).

V1.5 automated payouts via PayMongo / GCash Merchant API are a follow-on iteration tracked in 0023's roadmap, not built here.

### 5.4 Form 2307 quarterly generation

```sql
CREATE TABLE form_2307_issuances (
  issuance_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id            UUID NOT NULL REFERENCES vendors(vendor_id),
  quarter              TEXT NOT NULL,             -- '2026-Q1' | '2026-Q2' | ...
  total_gross_php      NUMERIC(12,2) NOT NULL,    -- sum of vendor_invoice_amount for the quarter
  total_ewt_php        NUMERIC(12,2) NOT NULL,    -- sum of ewt_php for the quarter
  payout_ids           UUID[] NOT NULL,           -- the vendor_payouts.payout_id list aggregated
  pdf_r2_key           TEXT NOT NULL,
  issued_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emailed_to_vendor    BOOLEAN NOT NULL DEFAULT FALSE,
  emailed_at           TIMESTAMPTZ,
  UNIQUE (vendor_id, quarter)
);
```

**Generation cron.** A scheduled job runs on the last day of every quarter at 23:59 PHT (Mar 31, Jun 30, Sep 30, Dec 31) — actually executed on the **5th of the following month** to ensure all in-quarter payouts have been reconciled and any late-arriving EWT corrections are absorbed. The job:

1. Groups all `vendor_payouts` rows for the quarter by `vendor_id` where `payout_status IN ('sent')` (sent, not pending or scheduled — only completed payouts get Form 2307'd; pending payouts roll to the next quarter).
2. For each vendor, sums `vendor_invoice_amount` and `ewt_php`, renders the Form 2307 PDF, uploads to R2 at `setnayan-tax-docs/vendors/{vendor_id}/form_2307/{year}_Q{n}.pdf`.
3. Inserts a `form_2307_issuances` row.
4. Updates each contributing `vendor_payouts.form_2307_quarter` and `form_2307_pdf_r2_key`.
5. Triggers 0028 to email the vendor.

**Form 2307 template** mirrors the official BIR layout. Single page. Header section identifies the withholding agent (Setnayan) and the income payee (the vendor). Body has a single-row table for the quarter's aggregated EWT. Signed by Setnayan's authorized signatory (e.g., the President or CFO of Setnayan Ventures Inc.). The exact BIR Form 2307 template is **subject to the latest version published by BIR at the time of issuance** — engineering uses the BIR-published template image as the canonical layout, refreshed annually.

### 5.5 EWT remittance to BIR (Form 1601-EQ)

Separate from the vendor-facing Form 2307. Setnayan owes BIR the withheld amount **monthly** (10th of the following month), filed as Form 1601-EQ. This is a return-and-payment, not a per-vendor document.

Engineering produces the input as a CSV export (§ 7.2). The accountant files via eFPS and pays BIR via the eFPS-linked authorized agent bank (AAB). The remittance is operational; engineering only generates the supporting figures.

---

## 6. eFPS reporting outputs

Engineering does **not** file eFPS returns directly. eFPS is a BIR-operated portal accessed by Setnayan's tax accountant. The 0023 Admin Console produces the reports the accountant needs to file.

All reports live at `/admin/finance/tax-reports` with admin role gates per CLAUDE.md decision log 2026-05-12 § 9.1 (Finance role required).

### 6.1 Reports produced

| Report | Frequency | Format | Used to file |
|---|---|---|---|
| Monthly Gross Receipts Summary | Monthly | CSV + PDF | Form 2551Q (Percentage Tax) — quarterly Percentage Tax return, or Form 2550M (VAT monthly) if VAT-registered |
| Quarterly Withholding Tax Summary | Quarterly | CSV + PDF | Form 1601-EQ + supporting alphalist (per-vendor breakdown) |
| Annual Income Summary | Annual | CSV + PDF | BIR Form 1702 (Corporate Income Tax Return) — accountant computes net income from this plus expense records (out-of-scope) |
| Alphalist of Payees Subjected to Withholding | Quarterly | CSV (BIR-specified format) | Required attachment to Form 1601-EQ |
| Voided OR audit log | On demand | CSV | RDO compliance check-ins |

### 6.2 Report formats

**Monthly Gross Receipts Summary CSV** (per month, one row per OR):

```
receipt_number, issued_at, customer_user_id, customer_name, customer_tin,
gross_php, vat_php, net_php, payment_method, payment_reference, is_void
```

**Quarterly Withholding Tax Summary CSV** (per quarter, one row per `form_2307_issuances`):

```
vendor_tin, vendor_name, vendor_address, quarter, gross_paid_php, ewt_rate_pct,
ewt_withheld_php, payout_count
```

**Alphalist CSV** follows the BIR-published Alphalist Data Entry format (BIR Form 1604-E / 1604-EQ schemas). The exact column order and headers are **subject to BIR's current published schema** — engineering reads the BIR data dictionary at the start of each tax-year cycle to confirm format compatibility before the cron generates the file.

### 6.3 Admin tax-report surface (consumed by 0023)

The Admin Console renders a simple report-builder at `/admin/finance/tax-reports`:

- Period selector (month / quarter / year picker)
- Report type selector (radio: Gross Receipts · Withholding · Alphalist · Income · Void Audit)
- "Generate report" button → produces CSV + PDF, uploads to R2 under `setnayan-tax-docs/admin/reports/{report_type}/{period}.{ext}`, presents a download link.
- "Email report to accountant" button → sends to a pre-configured accountant email on file in admin settings.

All report generations are logged in the admin audit log (per CLAUDE.md § 9.1 — single-admin authority for report export).

---

## 7. Customer-facing tax-document download surface (consumed by 0025)

A new section in Profile Settings → Privacy & Data → **Tax Documents**.

### 7.1 UI structure

```
Profile Settings
  └── Privacy & Data
        └── Tax Documents
              ├── My TIN (optional)               [editable]
              ├── My business name (optional)     [editable]
              ├── My billing address (optional)   [editable]
              │
              ├── Official Receipts
              │     ├── OR No. 2026-00042 — ₱2,573.97 — 15 Nov 2026  [Download] [Re-email]
              │     ├── OR No. 2026-00031 — ₱49.00    — 02 Nov 2026  [Download] [Re-email]
              │     └── ...
              │
              └── Need help? Contact support@setnayan.com
```

### 7.2 Field additions

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS tin_optional TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_business_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT;
```

These are optional. If populated, future ORs issued to this user automatically include them on the OR PDF. Retroactive ORs are **not** automatically reissued (BIR audit trail concern — an OR's content is the content at issuance time). The customer can request a reissuance via support; admin handles via the void-and-reissue flow in § 4.6.

### 7.3 Vendor-facing tax-document surface (consumed by 0022)

Vendor dashboard → Settings → **Tax Documents** has the parallel surface for Form 2307 PDFs:

```
Settings
  └── Tax Documents
        ├── My TIN                              [editable, but flagged as needing re-verification if changed]
        ├── My registered business name         [editable, re-verification flag]
        ├── My registered business address      [editable, re-verification flag]
        ├── My EWT classification               [shows current vendor_tax_type, support-only to change]
        │
        └── Form 2307 — Quarterly Withholding Tax Certificates
              ├── 2026 Q4 — Gross ₱45,000.00 — EWT ₱2,250.00  [Download] [Re-email]
              ├── 2026 Q3 — Gross ₱72,500.00 — EWT ₱3,625.00  [Download] [Re-email]
              └── ...
```

Vendor TIN changes flip the vendor record's `verification_status` back to pending (per Vendor Agreement § 1.1) because the TIN is part of legal identity. Operations re-verifies via the same 3-business-day SLA before the next payout cycle.

---

## 8. Cross-iteration touch points

| Iteration | What 0026 provides | What 0026 consumes |
|---|---|---|
| **0013 Platform Stack** | — | Supabase Edge Function runtime for OR/2307 PDF generation; R2 bucket `setnayan-tax-docs` (new) |
| **0022 Vendor Dashboard** | Form 2307 PDFs + tax-document surface | `vendors.tin`, `vendors.vendor_tax_type`, `vendors.ewt_rate_pct`, `vendors.registered_business_name`, `vendors.registered_business_address` (added here) |
| **0023 Admin Console** | Tax report exports + payout reconciliation queue | The 0023 payment-reconciliation hook that flips `service_orders.status = 'paid'` |
| **0025 Profile Settings** | Customer-side tax document surface | `users.tin_optional`, `users.billing_business_name`, `users.billing_address` |
| **0028 Email Notifications** | OR-issued and Form-2307-issued event hooks | Daily.co / SMTP infrastructure |
| **Vendor Agreement § 8** | EWT mechanics referenced in the vendor pricing schedule | Pricing constraints (the 3% Setnayan Pay convenience fee) |
| **Vendor Agreement § 12** | TIN + tax-classification fields collected at signing | Vendor signature-block schema |
| **Privacy & Security Policy** | TIN treated as Sensitive Personal Information under RA 10173; encryption at rest in Supabase + access restricted via RLS to the owning vendor user + Finance admin role | RA 10173 compliance framework |

---

## 9. Schema additions summary

New tables:

```sql
-- § 4.1
official_receipts
-- § 4.2
or_sequence_state
-- § 4.4
setnayan_tax_config
-- § 4.6
or_replacements
-- § 5.2
vendor_payouts
-- § 5.4
form_2307_issuances
```

`ALTER TABLE` additions:

```sql
-- § 5.2 — vendors
ALTER TABLE vendors ADD COLUMN tin TEXT;
ALTER TABLE vendors ADD COLUMN vendor_tax_type TEXT;
ALTER TABLE vendors ADD COLUMN ewt_rate_pct NUMERIC(5,2);
ALTER TABLE vendors ADD COLUMN registered_business_name TEXT;
ALTER TABLE vendors ADD COLUMN registered_business_address TEXT;

-- § 7.2 — users
ALTER TABLE users ADD COLUMN tin_optional TEXT;
ALTER TABLE users ADD COLUMN billing_business_name TEXT;
ALTER TABLE users ADD COLUMN billing_address TEXT;
```

New Postgres function:

```sql
allocate_or_sequence(year INT) → INT     -- § 4.2, gap-free sequence
```

New R2 bucket:

```
setnayan-tax-docs/
  customers/{user_id}/or/{receipt_id}.pdf
  vendors/{vendor_id}/form_2307/{year}_Q{n}.pdf
  admin/reports/{report_type}/{period}.{csv|pdf}
```

New scheduled jobs:

- `generate_quarterly_form_2307` — runs 5th of every Apr / Jul / Oct / Jan at 06:00 PHT
- `aggregate_monthly_gross_receipts` — runs 5th of every month at 06:00 PHT
- `flag_pending_vendor_tin_verifications` — runs daily at 09:00 PHT (surfaces vendor TIN changes awaiting re-verification)

---

## 10. Tax-law assertions marked "subject to confirmation"

Every numeric tax rate or rule in this iteration is captured as a configurable value rather than a hard-coded constant, because tax rates change and because engineering should not be asserting tax law. The specific items that **must be reviewed with Setnayan's tax accountant** before launch:

1. **The 3% Percentage Tax rate** (§ 2, § 3) — historically temporarily reduced to 1% under CREATE Law transitional provisions; current rate must be confirmed.
2. **The ₱720K individual-EWT-rate threshold** (§ 5.1) — RR 11-2018 has been amended multiple times; the threshold and the 5% vs 10% boundaries must be confirmed.
3. **The 2% corporate EWT rate** (§ 5.1) — RR 2-98's professional-services rate has been amended; confirm whether 2% or another rate applies to marketplace-disbursed vendor payments specifically.
4. **TWA designation status** (§ 5.1) — Setnayan is assumed NOT to be a Top Withholding Agent at V1 launch; confirm with BIR upon registration.
5. **CAS approval timeline** (§ 1.2) — assumed 4–6 weeks; varies by RDO.
6. **Form 1601-EQ filing dates** (§ 5.5) — the 10th-of-following-month rule is the historical default but specific cutoffs vary by category; confirm.
7. **VAT election irrevocability** (§ 3.1) — assumed 3 years per current NIRC; confirm under latest amendments.
8. **The exact BIR-published Form 2307 template** (§ 5.4) — refresh annually; engineering's PDF render must match the current BIR layout.
9. **Alphalist data dictionary** (§ 6.2) — BIR publishes the schema; confirm at start of each tax-year cycle.
10. **OR template requirements for the specific RDO** (§ 4.5) — RDO-level interpretation varies; confirm with the assigned RDO during CAS application.

This list is a launch-readiness checklist for the tax accountant. None of the items block engineering work — the schema accommodates any answer.

---

## 11. Build order

**Phase A — Legal / operational (Setnayan founders + tax accountant, no engineering).** Run in parallel with Phase B; both must complete before Phase E goes live.

- A1. SEC incorporation of Setnayan Ventures Inc.
- A2. BIR Form 2303 Certificate of Registration + tax type election (Percentage Tax — § 3.2 recommendation)
- A3. BIR Form 1900 — Application for CAS approval (submit the OR template from § 4.5 and the system documentation from this iteration)
- A4. BIR Permit to Issue Receipts (Form 1906) — issued upon CAS approval; the Permit Number populates `setnayan_tax_config.bir_permit_number`
- A5. Mayor's Permit + Books of Accounts registration
- A6. Authorized signatory designation (for Form 2307 signing) — typically the corporate President or CFO

**Phase B — Engineering: OR generation pipeline.**

- B1. Create `setnayan-tax-docs` R2 bucket; configure access policy (admin + owning-user signed URLs only)
- B2. Implement `setnayan_tax_config` table + admin surface to edit (read-only after launch; updates create new effective-dated rows)
- B3. Implement `or_sequence_state` + `allocate_or_sequence(year)` Postgres function with transactional gap-free guarantee
- B4. Implement `official_receipts` schema + the `AFTER UPDATE ON service_orders` trigger
- B5. Build the OR-generation Edge Function (HTML template → headless Chromium → PDF → R2 upload → row insert)
- B6. Implement `or_replacements` table + admin void surface in 0023
- B7. Run integration tests: ₱49, ₱2,499, ₱25,750 (vendor-booking-via-Setnayan-Pay), refund void, replacement issuance

**Phase C — Engineering: Vendor payout + EWT + Form 2307.**

- C1. `ALTER TABLE vendors` additions (TIN, vendor_tax_type, ewt_rate_pct, registered_business_name, registered_business_address)
- C2. Implement `vendor_payouts` schema + admin payout queue surface in 0023
- C3. Build the EWT calculator: `(vendor_invoice_amount, vendor_tax_type, override_rate) → ewt_php`
- C4. Implement `form_2307_issuances` schema + the quarterly cron + the Form 2307 PDF renderer
- C5. Vendor TIN change flow → flags vendor for re-verification (per § 7.3)
- C6. Vendor-side tax-document surface in 0022's settings panel

**Phase D — Engineering: Admin tax-report exports.**

- D1. Build the `/admin/finance/tax-reports` UI per § 6.3
- D2. Implement CSV generators for each report type
- D3. Implement PDF generators (where applicable — summary cover sheets)
- D4. Hook up the "Email report to accountant" action via 0028

**Phase E — Customer/vendor-facing download surfaces.**

- E1. Customer tax-documents UI in Profile Settings (consumed by 0025)
- E2. Vendor tax-documents UI in Settings (consumed by 0022)
- E3. 0028 email templates for "OR issued" and "Form 2307 issued"

**Phase F — Pre-launch dry run.**

- F1. Generate test ORs against a sandbox `setnayan_tax_config` (test TIN, test permit number)
- F2. Walk the accountant through one full quarter of test data — confirm Form 2307 output matches BIR's expected format
- F3. Submit one paper OR (manual booklet) to RDO as a parallel control; verify CAS-generated OR matches all required fields
- F4. Flip production `setnayan_tax_config.effective_from` to the launch date; first real OR issued in production is sequence `{launch_year}-000001`

---

## 12. Companions and next steps

- **0023 Admin Console** — payment reconciliation flips `service_orders.status = 'paid'`, which is the trigger for OR issuance; also hosts the payout queue, void surface, and tax-report exports.
- **0025 Profile Settings** — surfaces the customer-facing OR list + the optional TIN / business address fields.
- **0022 Vendor Dashboard** — surfaces vendor-facing Form 2307 list + the TIN / classification fields (added in § 5.2).
- **0028 Email Notifications** — transactional emails for OR issued + Form 2307 issued + remittance advice on payout sent.
- **Vendor Agreement § 8 (pricing constraints)** — references the 3% convenience fee and the EWT mechanic; reciprocally, this iteration is the engineering implementation of that section.
- **Vendor Agreement § 12 (signing)** — collects vendor TIN + classification at signing time; reciprocally, vendor onboarding writes those fields into the schema this iteration consumes.
- **Privacy & Security Policy** — TINs and registered business addresses are Sensitive Personal Information under RA 10173; access is gated by RLS to the owning user + Finance admin role + DPO. Retention follows the standard 5-year window post-account-closure.
- **0013 Platform Stack** — Supabase Edge Functions are the OR-generation runtime; R2 stores all tax PDFs; the quarterly Form 2307 cron runs on Supabase scheduled functions or a Cloudflare Worker — final choice to be decided during Phase B implementation.

---

*End of Iteration 0026 spec.*
