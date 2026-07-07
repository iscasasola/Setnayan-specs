# Sign-Before-Pay — Unified Checkout + E-Signature Design (2026-07-01)

> DESIGN ONLY — legally gated. Grounded in a code audit of the real checkout,
> contract, and consent surfaces (setnayan-platform @ origin/main). Nothing
> builds until Phase 0 (PH legal counsel + owner decisions) clears.

## The core insight

The **evidentiary spine already exists**. Migration `20260518200000` shipped a full
dual-signature schema — `vendor_contract_signatures` (signer role, IP, user-agent,
timestamp, signature PNG, `UNIQUE(contract_id, signer_role)`, an auto-seal
`fully_signed` trigger) + the `vendor_contracts` lifecycle + a booking-sync trigger
— **but the signing half was descoped to upload-only the same day** and is dead
code (the UI even tells users to sign outside the app). Sign-before-pay mostly
*reactivates* this. Only **3 pieces are genuinely new**: signature-box coordinates,
a versioned append-only consent record, and document hashes.

## The 8-step flow (each mapped to a real surface)

| # | Actor | Step | Maps to |
|---|---|---|---|
| 1 | Vendor | Upload PDF + drop 2 signature boxes + set price | EXTEND `/vendor-dashboard/contracts` + new PDF.js box-placement UI |
| 2 | Vendor | Publish → "Awaiting signatures" | existing `publishContractToCouple` (relabel copy) |
| 3 | Customer | Buy/Pay detects contract-gated SKU → routes to signing | EXTEND `inline-checkout-drawer` (contract-required flag) |
| 4 | Customer | Legal gateway — un-pre-checked "I agree" toggle | NEW `legal-gateway` panel + `legal_consent_acceptances` |
| 5 | Customer | View PDF in-app + sign the box | NEW PDF.js viewer → writes the dormant `vendor_contract_signatures` |
| 6 | System | **Both signed → seal → payment unlocks (THE GATE)** | existing `fully_signed` trigger; gate release |
| 7 | Customer | Pay (V1 manual QR+proof · V1.5 gateway) | existing `submitOrderAction` + orders/payments |
| 8 | Admin | Confirm payment → "Fully Executed" + emailed | existing `approvePayment` + pdf-lib flatten + Resend |

## Database (extend the dormant schema)

- **`vendor_contracts`** (EXTEND): `+service_key`, `+requested_total_php` (display; price re-resolved server-side), `+source_doc_hash`, `+executed_file_url`, `+executed_doc_hash`, `+executed_at`.
- **`vendor_contract_signatures`** (EXTEND the dormant table — start WRITING it): `+document_hash_at_signing`, `+signature_box_id`, `+disclaimer_acceptance_id`. Keep the fully_signed trigger + self-INSERT RLS.
- **`vendor_contract_signature_boxes`** (NEW): box_id, contract_id, signer_role, page_index, x/y/w/h as 0..1 normalized %, `UNIQUE(contract_id, signer_role)`.
- **`legal_consent_acceptances`** (NEW, append-only): acceptance_id, user/event/contract, `disclaimer_version`, `disclaimer_text_hash`, accepted (never pre-checked), IP, UA, accepted_at. REVOKE UPDATE/DELETE.
- **`orders`** (EXTEND): `+contract_id` (nullable; NULL = non-gated SKU). Gate reveal on `contract.status='fully_signed'`.

## Build stack — OSS self-host (no DocuSign/Adobe fees)

- **PDF.js (`pdfjs-dist`)** — in-app PDF viewer (vendor box-placement + customer signing). None exists today.
- **`signature_pad`** — canvas signature capture → PNG.
- **`pdf-lib`** (already a dependency; proven in `seating-pdf.ts`/`lockup-pdf.ts`) — server-side flatten: burn each PNG into its box, stamp "Fully Executed" + metadata, seal.
- **`node:crypto` sha256** (already in `lib/api-keys.ts`) — hashes at signing + at seal.
- **R2 private + presigned GET** (`r2SignedGet`, the BIR/verification-doc pattern) — signature PNGs + the executed PDF must NOT be public-if-you-know-the-URL. Keeps marginal cost at R2-only.
- Small NEW header helper for IP (`x-forwarded-for`) — today only user-agent is read.

## ⚠ Honest payment-model gap

The vision ("Pay → sign → the payment FORM unlocks → pays by card/GCash/Maya
in-app") implies an **automated charge that does not exist**. V1 is 100% manual
apply-then-pay against a **static Setnayan BDO/GCash account** with ~24h human
admin reconciliation (`setnayan_pay_methods` is retired `is_active=FALSE` per
"Setnayan will not take money from customer purchases"). So in V1, "unlock the
payment form" = **reveal the payment-instructions step after execution**.
Sign-before-pay works identically either way — the signature gate simply precedes
whichever payment path is live. An automated gateway (Maya/PayMongo/Xendit +
customer webhook) is a **later, owner-sign-off-gated policy reversal** of the
"0% / Setnayan doesn't hold customer money" lock — the design does NOT depend on it.

## Phase 0 — legal gate (BLOCKS all code)

PH counsel must clear: (1) **RA 8792** validity of an in-app drawn-canvas signature
(is the PNG + IP/UA/timestamp/hash trail adequate proof; is re-auth-at-signing
required; is un-notarized acceptable); (2) **reversing the 2026-05-18 descope**
that cut signing to upload-only precisely to avoid this exposure; (3) the
**neutral-medium ToS** — Setnayan as neutral record-keeper (not party, guarantor,
or arbitrator), the RA 8792 consent language, the RA 10173 basis for storing
IP/UA/PNG, versioned so we can prove which text was accepted. The **refund clause**
is load-bearing: because the couple pays a Setnayan-owned account, the ToS must
scope exactly which refunds Setnayan does/doesn't process and state that a signed
contract doesn't make Setnayan liable for either side's breach.

## Owner decisions (before build)

1. **Payment policy:** keep V1 manual (reveal instructions after signing) OR fund the automated gateway (reverses the 0%/no-custody lock).
2. **Signing order — DECIDED (owner 2026-07-01): couple signs first, vendor counter-signs to confirm, THEN payment unlocks.** This makes the flow ASYNC (a "request → vendor accepts → pay" model), so the build MUST add: (a) after the couple signs, a couple-side "awaiting vendor confirmation" state (no payment yet); (b) a notification to the vendor that a couple has signed and is waiting to counter-sign; (c) on the vendor's counter-signature the contract reaches `fully_signed`, and (d) a re-engagement notification/email to the couple ("your contract is confirmed — complete your payment") that returns them to the now-unlocked payment step. Without (d) the couple could sign and never come back. Flow reorders vs. the diagram: vendor uploads + publishes (does NOT pre-sign) → couple signs at checkout → **vendor counter-signs (accepts)** → seal → couple pays.
3. **Gate scope:** only vendor-service contracts, or also platform SKUs (which have no vendor to sign)?
4. **Prerequisite:** allow a payable contract as soon as a chat thread exists, or require a booking first?
5. **Disclaimer tone/length + canonical `disclaimer_version` string** (counsel-drafted).
6. **Admin dispute surface:** need a void/override UI? (admins can only READ contracts today.)
7. **Re-auth at signing** for stronger RA 8792 attribution, or is session + IP/UA/hash enough?

## Build phasing (post Phase 0)

- **P1 evidentiary core:** the migration (new boxes/consent tables + extend the dormant signatures table + orders.contract_id + vendor_contracts columns); IP helper; switch contract storage to private R2 + presigned GET; source-doc hashing.
- **P2 vendor authoring:** PDF.js box-placement UI + price binding; reverse "sign outside the app" copy.
- **P3 customer sign-before-pay:** legal-gateway (versioned acceptance) → in-app viewer → signature capture → `signContract` writes the dormant table; the existing trigger seals.
- **P4 gate + seal:** checkout gate on `fully_signed`; on admin approval, pdf-lib flatten → stamp → hash → email sealed PDF + receipt.
- **P5 (only if payment policy reversed):** automated gateway + customer confirm-by-reference webhook → instant unlock.
