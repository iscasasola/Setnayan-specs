# Setnayan — E-Signature Legal Review Package (for counsel)

> **Not legal advice.** This is a business/engineering brief plus DRAFT terms
> prepared for your lawyer to review, correct, and finalize. Nothing below ships
> until counsel approves it in writing.

---

## The ask, in 30 seconds

We want couples and vendors to **sign a service contract inside our website
before the customer pays** — no printing, no notary. Three things we need you to
confirm:

1. **Is that in-app electronic signature legally binding under RA 8792** (E-Commerce
   Act), given the identity/IP/timestamp/document-hash evidence we keep, and
   **without notarization**?
2. **Is it safe for us to host the signing itself** (not just store a signed PDF)?
3. **Please finalize our two short drafts** (Parts 2 & 3) — the customer disclaimer
   and the Terms clause that keep us a neutral record-keeper and cap our refund
   liability.

We're **not** processing card payments in this flow — the customer pays our
BDO/GCash receiving account and we reconcile manually — so please read the refund
clause with that in mind.

---

## Part 1 — Brief for counsel

**What Setnayan is.** A Philippines-first online platform where couples plan events
and book vendors (photographers, caterers, etc.). Operated by SETNAYAN SOFTWARE
DEVELOPMENT SERVICE (sole proprietorship, PH; proprietor Indalecio Sacdalan
Casasola II, DTI BN 8297508). Setnayan charges 0% commission and, in the current model, does
**not** hold or take money from what customers pay vendors.

**What we want to build (and need cleared first).** A "sign-before-pay" checkout.
A vendor uploads their service contract (PDF) and marks where each party signs.
At checkout the customer ticks a disclaimer, views the contract in-app, and signs.
The **vendor is then notified to counter-sign to confirm the booking** (the
customer signs first, the vendor confirms — a "request → accept" order). Only
once both parties have signed does the customer see the payment step. The system
then stamps the PDF "Fully Executed", locks it with a cryptographic seal, and
emails the final copy to both parties.

**How long / how we keep the evidence (for the data-privacy question).** The
signing audit trail (identity, timestamp, IP, device, document hash, signature
image) and the executed PDF are stored on our access-controlled cloud storage
(Cloudflare R2), served only through short-lived private links — never a public
URL. We retain them for the life of the contract plus our standard records-
retention window, as proof of execution. We would like your confirmation that
this retention, and the specific fields we keep, are properly grounded under
RA 10173 (legitimate purpose: proof of a validly executed contract) and reflected
in the disclaimer/consent language.

**How the electronic signature is captured (the evidence we retain per signing).**
- The signer's account identity and full name (they are logged in).
- The date and time of signing.
- The signer's IP address and device/browser (user-agent).
- A cryptographic hash (SHA-256) of the **exact document** the signer saw, so we can
  later prove the document was not altered after signing.
- A separate, versioned record of the disclaimer text the signer accepted (with its
  own hash), so we can prove which terms were agreed to.
- The drawn/affixed signature image, stored privately.

**We need your written opinion on three questions:**

1. **Validity/enforceability.** Is an electronic signature affixed in-app as
   described — captured with the audit trail above, by a logged-in user, **without
   notarization** — valid and binding between the vendor and the customer under
   **RA 8792 (E-Commerce Act)** and its rules? Is anything more required for a
   reliable "consent to sign electronically" and for signer authentication (e.g.
   should we force a password re-entry at the moment of signing, or is an
   authenticated session plus the audit trail sufficient)?

2. **Setnayan hosting the signing.** Is there added legal exposure to Setnayan
   *hosting the act of signing* (vs. merely storing an already-signed PDF)? Any
   conditions we must meet to keep Setnayan a neutral facilitator rather than a
   party to the contract?

3. **Terms.** Please review and finalize the two DRAFTS in Parts 2 and 3 below:
   the customer-facing signing disclaimer, and the platform Terms clause on
   Setnayan's neutral role + refunds. Confirm (a) the RA 8792 e-signature consent
   language, (b) the **RA 10173 (Data Privacy Act)** basis for retaining IP,
   device, and the signature image, and (c) that the refund/neutral-arbitrator
   wording protects Setnayan.

**What we need back to proceed:** a short written opinion greenlighting (1) and (2),
and approved final text for the two DRAFTS (we will lock an exact "disclaimer
version" string once you approve, so we can prove which text each signer accepted).

---

## Part 2 — DRAFT: customer-facing signing disclaimer *(for counsel to finalize)*

*Shown as a blocking panel at checkout; the customer must tick an un-pre-checked box to proceed.*

> **Before you sign and pay**
>
> - **Setnayan is a neutral platform and record-keeper.** We are not a party to
>   this contract, we do not guarantee the vendor's services, and we do not act
>   as a judge, mediator, or arbitrator in any dispute between you and the vendor.
> - **You are signing electronically.** Under the Philippine E-Commerce Act
>   (RA 8792), your electronic signature is as valid and binding as a handwritten
>   one. To record it, Setnayan will save your name, the date and time, your IP
>   address and device, a secure fingerprint of the exact document you sign, and
>   your signature image — consistent with the Data Privacy Act (RA 10173).
> - **Payments and refunds are governed by the vendor's contract** you are about
>   to sign. Any dispute over the vendor's services is settled directly between
>   you and the vendor.
>
> ☐ I have read and agree to sign this contract electronically. *(unticked by default)*

---

## Part 3 — DRAFT: Terms of Service clause — neutral medium + refunds *(for counsel to finalize)*

> **Setnayan as a neutral medium.** Setnayan operates the platform as a neutral
> technology provider and record-keeper. For any contract signed between a
> customer and a vendor through Setnayan, Setnayan is **not a party** to that
> contract, is **not a guarantor** of any vendor's performance, and does **not
> act as arbitrator, mediator, or judge** of any dispute between the parties.
>
> **Electronic signatures.** Contracts executed through Setnayan are signed
> electronically pursuant to RA 8792. By signing, each party consents to the use
> of electronic signatures and to Setnayan's retention of the signing audit trail
> (identity, timestamp, IP address, device, document hash, and signature image)
> as evidence of execution, in accordance with RA 10173.
>
> **Payments and refunds.** Where a customer remits payment for a vendor service
> to a Setnayan-designated receiving account, Setnayan acts only as a facilitator
> of the transfer and record-keeper of the signed contract, and is **not the
> merchant of record** for the vendor's service. **Refund eligibility for a
> vendor service is governed solely by the terms of the vendor's signed
> contract**, and any refund dispute is resolved directly between the customer
> and the vendor. Setnayan processes refunds only for its own platform software
> fees, per its published refund policy, and assumes **no liability** for the
> vendor's services or for any breach of the vendor's contract by either party.

---

*Counsel: please red-line freely. Once approved, we lock the disclaimer version
string and build against your final text.*
