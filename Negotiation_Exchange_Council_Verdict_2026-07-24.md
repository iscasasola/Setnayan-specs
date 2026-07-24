# Negotiation Exchange — Council Verdict (2026-07-24)

**Question:** finalize the customer ↔ vendor ↔ Setnayan exchange. Owner constraint: **"as simple as possible — we do NOT want this to be complex."** (Payment/5%-fee mechanics = a SEPARATE session; this doc only leaves a clean seam.)

**Method:** 3-voice council — Couple-simplicity lens · Vendor+seam lens · Radical-de-complexity (contrarian). All three converged on the same model.

---

## THE VERDICT — two cards, one button, zero auto-magic

### 1. Collapse the money surface to ONE card
The bundled "proposal amendment" is a **superset** of the discount card + the inclusion card (a discount is a one-line amendment; an inclusion is a one-line amendment). Keeping three is maintaining three tables to say one thing.
- **DELETE** the discount card, the inclusion card, and the `vendor_change_orders` table.
- **KEEP** the amendment as the single money object — **renamed to plain language: "Deal" (or "Offer").** No customer ever sees "change order" / "amendment."
- It shows one thing always: **current total → the changes (any mix: discount / add-on / freebie / special request) → new total.** Actions: **Accept · Counter · Decline.**
- **One live Deal per thread.** A Counter **supersedes** the previous (mark old expired) — never a counter-of-counter tree.

### 2. Keep the Meeting card separate (it's time, not money)
A meeting has no price/total. Folding it into the money card is awkward. So the whole negotiation surface = **TWO cards: Deal (money) + Meeting (time).** Meeting = Accept / Suggest another time / Decline. Untouched.

### 3. Kill the per-message auto-detect chips
Auto-reading every message and sprinkling "turn this into a discount?" chips is the exact cleverness the owner doesn't want (false positives litter the thread; two ways to do everything; an LLM/heuristic inserting UI into a live money negotiation = disputes).
- **Replace with ONE explicit "+" in the composer → "Send a Deal" / "Request a Meeting."** Humans decide, deliberately, when a structured thing exists.
- The auto-reader/detector can be dropped (or left dark as an optional vendor-only hint) — it is NOT couple-facing.

### 4. "Deal" is ONE object across states — not new types
Negotiating → finalized is **STATE, not a new card.** The vendor Proposal Maker output = the same Deal object, later: it gains a **payment schedule** and becomes lockable/payable. Unify the vocabulary end-to-end.

### 5. Lock = the customer's single commit
- **One explicit "Lock this deal" button on the Deal card** (owner said "customer LOCKS the proposal" — keep it a visible, deliberate tap; recommended over making it implicit).
- Freezes **₱ total · what's included · event date.** Plain-language sheet: *"You're agreeing to this price and this list. After you lock, [Vendor] sends payment instructions. Price won't change unless you both agree."*
- Lock is **commitment, not payment, not final** — the couple still sees "waiting for payment options"; money hasn't moved. Preserves the refund safety valve without the couple needing to understand it.
- Lock sets `thread.agreed_price`.

### 6. Finalize → Pay → Approve → SOLD (the sale spine)
Vendor opens the **existing Proposal Maker**, **pre-filled + clamped to `agreed_price`**, adds the payment schedule → **SEND**. Customer pays the vendor **off-app** + uploads a **screenshot** → vendor **Approves** → **SOLD** (Setnayan never touches the couple's money). Vendor declines / 7-day timeout → **refund**.

### 7. Smallest state machine (on the Deal/proposal object)
```
draft ─vendor sends─▶ pending_send ─[5% fee held · SEAM]─▶ sent
  ─customer uploads screenshot─▶ awaiting_approval
      ├─ vendor Approve ─▶ SOLD        (fee held → captured)
      └─ decline / 7-day timeout ─▶ refunded (fee returned, deal closed)
```
5 states + a binary fee sub-state. `agreed_price` is a column on the thread, not a separate "locked" object. "Customer paid + screenshot" is one boolean+attachment, not a new machine.

### 8. Specialized asks / freebies = POST-SOLD fulfillment, not a negotiation state
The "mark delivered" checklist (e.g. "upload raw photos") lives **after SOLD** as a simple fulfillment view — it must NOT bloat the price-lock state machine.

---

## THE 5% SEAM (other session — do not build here)
The fee attaches at exactly ONE chokepoint: the **`pending_send → sent` transition inside `sendCustomProposalCore`** (the single code path that posts a proposal card; both the web action and native endpoint funnel through it). Gating there can't be bypassed: no card → no `respond_vendor_proposal` → no sale. Fee is **held, idempotent per `proposal_id`, refunded on the decline/timeout branch.** Not at Lock (customer action, negotiation can reopen); not at approval (too late).

---

## WHAT THIS CHANGES vs. what shipped this session (flag-dark, so safe to revise)
- **Cut:** `vendor_change_orders` + the discount/inclusion cards + the auto-detect chips.
- **Rename:** "amendment" → **Deal/Offer**; drop "change order" everywhere customer-facing.
- **Add:** an explicit composer **"+"** (Send a Deal / Request a Meeting), a **Lock** button, and the finalize→pay→approve→SOLD/refund spine (much of the *payment* half = the other session).
- **Keep:** the Meeting card; the Proposal Maker (as the Deal's finalized state).

## OWNER DECISIONS (2026-07-24 — resolved)
- **Collapse to ONE "Deal" card: YES.** Delete the separate discount/inclusion cards + `vendor_change_orders` path; rename "amendment" → **Deal** in the UI; the Deal is the single money card (discount/add-on/freebie/special-request = lines).
- **Entry points: BOTH.** Keep the auto-suggest chips AND add an explicit composer **"+" → Send a Deal / Request a Meeting.** (Owner overrode the council's "kill auto-detect" — wants both the deliberate button and the auto-suggest helper.)
- **Lock:** default to an **explicit "Lock this deal" button** on the Deal card (matches "customer LOCKS"; owner didn't object). Sets `thread.agreed_price`.

## BUILD SCOPE — "here" (this/negotiation session) vs. payment session
- **Here (negotiation rework):** relabel amendment→Deal (UI only; keep the `proposal_amendments` table); stop rendering the change-order card + drop its chat path (keep Meeting + Deal); add the explicit "+" composer entry (Send a Deal / Request a Meeting) alongside the existing auto-suggest chips; add the customer **Lock** action + `thread.agreed_price` (migration).
- **Payment session (separate):** the finalized-proposal SEND gate (`pending_send → sent`), the 5% hold/refund, the customer payment-screenshot + vendor-approve → SOLD/refund spine. Leave the clean seam at the Proposal Maker send.

**One line:** *Two cards (Deal, Meeting), a "+" button + auto-suggest, one Lock, one finalized proposal to pay. Payment/5% = other session.*
