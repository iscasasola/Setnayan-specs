# Iteration 0049 — Multi-Payer Cart with Per-Item Attribution

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **NOT BUILT.** The `paid_by_role[]` + `payment_split_percentages` + `payment_status_per_role` columns exist (added by the 0048 foundation migration `20260519100000_*`), but **no app code reads or writes them.** There is no per-role cart view, no "Check out my items" per-moderator checkout, no `vendor_order_receipts` table, and no budget per-payer view. Pattern B/C never shipped.
> - **The fee math is RETIRED.** This spec's checkout shows "Setnayan 5% fee + BIR 0.5% withholding" and per-payer BIR Form 2307. All of that is dead: **commission is 0% ("0% commission, ever")**, the **BIR tax surface (0026) is being retired**, and there is no automated charge — in-app SKUs use **apply-then-pay with single-admin manual approval** at `/admin/payments` (no card capture, no marketplace withholding).
> - **Vendor↔customer money is OFF-PLATFORM (RA 11967).** A vendor venue/service is settled vendor-direct (link/QR/bank shown at settlement); Setnayan never holds or splits the money, so a "multi-payer split-checkout that captures each share" is not how V1 collects vendor payments.
> - **The retired-SKU "Maya / GCash / Card / Bank" gateway list does not exist** — in-app payment instructions are admin-uploaded BDO + GCash details only, paid externally with a screenshot upload.
> - **Receipts:** the BIR Official Receipt format shown here is tied to 0026, which is retiring; the shipped `receipts` row is a lightweight in-app record created on admin approval, not a BIR-numbered OR.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0049
**Topic:** Cart line items get `paid_by_role[]` attribution — moderators can add items to cart, multiple moderators can pay (parents pay venue, couple pays photography, sponsors pay entourage attire). Optional split-cost per item across multiple payers.
**Surface:** Cart UI extensions ([0034_payments_and_cart](../0034_payments_and_cart/0034_payments_and_cart.md)) + per-item visibility editor ([0048_multi_moderator_event_access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md)) + checkout flow (per-moderator subset checkout) + vendor receipts (couple name + payer name)
**Status:** Drafted 2026-05-19 · V1.2 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.2 — engineering sequenced after 0048 ships
**Builds on:** 0034 (cart + order infrastructure), 0048 (event_moderators role model + visibility tags)
**Consumed by:** 0007 (budget tracks per-payer attribution), 0028 (payment confirmation emails per payer)
**Companion specs:** 0007, 0028, 0034, 0048

---

## What this iteration ships

A multi-payer cart model where Filipino-wedding multi-funding (parents pay venue, sponsors pay entourage attire, couple pays photography, etc.) becomes a first-class flow instead of off-platform coordination:

1. **`paid_by_role[]`** on every cart line item — tags which moderator role(s) is funding it
2. **Per-moderator checkout flow** — each moderator sees + pays for only their tagged line items
3. **Optional split-cost** — line items can be funded by multiple roles with percentage split (e.g., 50/50 parents on venue)
4. **Receipt formatting** — vendor receipts show couple name + ceremony date + payer name (matches PH cultural norm)
5. **Budget integration** — per-payer attribution flows to [0007 budget](../0007_budget_expenses/0007_budget_expenses.md) for "who paid what" view

V1.2 ships **Pattern A (single-payer, existing) + Pattern B (per-item attribution, new)**. Pattern C (split-cost per item) ships V1.3.

---

## The three patterns

### Pattern A — Single-payer cart (preserved from V1.1 [0034](../0034_payments_and_cart/0034_payments_and_cart.md))

Whoever clicks "Check out" pays the entire cart. Existing flow unchanged. Couples who don't need multi-payer use this.

### Pattern B — Per-item payer attribution (V1.2 default)

Each cart line item has a `paid_by_role` tag set when added:
- Bride adds gown to cart → `paid_by_role: ['bride']`
- Parent of Bride adds venue deposit → `paid_by_role: ['parent_of_bride']`
- Groom adds photography → `paid_by_role: ['groom']`

At checkout, each moderator sees only their tagged items. Multiple checkout sessions happen in parallel — each moderator pays independently.

### Pattern C — Split-cost per item (V1.3+)

A single cart line item can be split across multiple payers:
- Couple jointly pays photography: `paid_by_role: ['bride', 'groom']`, `payment_split_percentages: {'bride': 50, 'groom': 50}`
- Parents split venue 50/50: `paid_by_role: ['parent_of_bride', 'parent_of_groom']`, split 50/50

Each payer sees their portion at checkout; payment captures their share. Item fulfills only when all shares are paid.

---

## Schema

```sql
-- Extend existing service_order_line_items (from 0034)
ALTER TABLE service_order_line_items
  ADD COLUMN paid_by_role TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    -- Empty array → fallback to whoever checks out (Pattern A backwards-compat)
    -- Single role → Pattern B
    -- Multiple roles → Pattern C
  ADD COLUMN payment_split_percentages JSONB,
    -- Pattern C only: {'bride': 50, 'groom': 50} or {'parent_of_bride': 50, 'parent_of_groom': 50}
    -- Must sum to 100 across the roles in paid_by_role
    -- NULL when paid_by_role has ≤ 1 entry
  ADD COLUMN added_to_cart_by_user_id UUID NOT NULL REFERENCES users(user_id),
    -- Audit: which moderator added this item
  ADD COLUMN payment_status_per_role JSONB NOT NULL DEFAULT '{}'::jsonb;
    -- Tracks per-role payment state for split items:
    -- {'bride': 'paid', 'groom': 'pending'} or {'parent_of_bride': 'paid', 'parent_of_groom': 'paid'}
    -- Item fulfills only when all roles have 'paid' status

-- Constraint: payment_split_percentages must sum to 100 when set
ALTER TABLE service_order_line_items
  ADD CONSTRAINT split_percentages_sum_to_100
    CHECK (
      payment_split_percentages IS NULL OR
      (SELECT SUM((value::numeric)) FROM jsonb_each_text(payment_split_percentages)) = 100
    );

CREATE INDEX service_order_paid_by_role_gin ON service_order_line_items USING GIN (paid_by_role);
```

### Vendor receipt formatting (audit table)

```sql
-- New table: tracks receipt issuance per payer for an order
CREATE TABLE vendor_order_receipts (
  receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES service_orders(order_id),
  line_item_id UUID NOT NULL REFERENCES service_order_line_items(line_item_id),
  payer_user_id UUID NOT NULL REFERENCES users(user_id),
  payer_role_subtype TEXT NOT NULL,                     -- snapshot of role at payment time
  payer_name_snapshot TEXT NOT NULL,                    -- snapshot of payer's name
  payer_display_label_snapshot TEXT,                    -- snapshot of display_label from 0048
  amount_paid_centavos BIGINT NOT NULL,
  payment_method TEXT NOT NULL,                          -- gateway used
  bir_official_receipt_number TEXT,                     -- BIR OR from 0026
  receipt_pdf_r2_key TEXT,                              -- generated receipt
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX vendor_order_receipts_order_idx ON vendor_order_receipts (order_id);
CREATE INDEX vendor_order_receipts_payer_idx ON vendor_order_receipts (payer_user_id);
```

### Budget integration

[0007 budget_expenses](../0007_budget_expenses/0007_budget_expenses.md) gains a per-payer view:

```sql
-- budget_line_items already exists from 0007; add per-payer tracking
ALTER TABLE budget_line_items
  ADD COLUMN paid_by_role TEXT[],
  ADD COLUMN linked_order_line_item_id UUID REFERENCES service_order_line_items(line_item_id);
  -- when a cart item checks out, automatically creates a budget_line_items row with same paid_by_role
```

---

## Cart UI extensions

### Cart view per role

Each moderator's cart view shows:

**For Bride viewing the cart:**
```
🛒 Your Cart

YOUR ITEMS (you'll pay for these)
─────────────────────────────────
🎁 Bridal Gown — Aurora Mermaid    ₱45,000   [Edit · Remove · Visibility 🔒]
   (private to Bride)
👁 Photography — Lumiere Studios   ₱85,000   [Edit · Remove · Visibility 👁️]
   (visible to all moderators)
─────────────────────────────────
Your subtotal: ₱130,000
[Check out my items →]

OTHER MODERATORS' ITEMS (FYI only)
─────────────────────────────────
👁 Venue — Hidden Falls Tagaytay    ₱180,000   [Visibility 👁️]
   ⏳ Paid by: Parent of Bride · payment pending
👁 Catering — Bizu Catering          ₱120,000   [Visibility 👁️]
   ✅ Paid by: Parent of Groom · paid May 14
👁 Entourage Attire — Ninang Sets    ₱48,000   [Visibility 👁️]
   ⏳ Paid by: Ninang Lita · payment pending
─────────────────────────────────
Total cart value: ₱478,000   |   Paid so far: ₱120,000   |   Pending: ₱358,000
```

Key UX rules:
- Hidden items (visibility-restricted from current viewer) NOT shown
- Other moderators' items appear as **FYI rows** (read-only; can't edit or pay for someone else's items)
- Cart total reflects ALL visible items, even those someone else is paying
- "Check out my items" CTA only triggers payment for current moderator's tagged items
- Status indicators ✅ paid / ⏳ pending help couple track collective progress

### Add to cart with attribution

When ANY moderator adds an item to cart, a small modal appears:

```
Add to cart

Who's paying for this?
  ○ Just me (Bride)
  ○ Both of us (50/50)              [V1.3 — disabled in V1.2]
  ● Parent of Bride
  ○ Parent of Groom
  ○ Ninang Lita
  ○ Custom split                    [V1.3 — disabled in V1.2]

Visibility:
  ● Visible to all moderators
  ○ Private (only me)
  ○ Hide from: [multi-select]
  ○ Mark as surprise for: [Groom ▼]

[Add to cart]
```

Default attribution per role's typical contribution pattern (couples can save defaults — e.g., "Parent of Bride pays for: Venue, Catering, Florals" sets future Venue adds to auto-tag Parent of Bride).

### Pattern A backwards compat

If a moderator adds an item without selecting a payer (`paid_by_role` array empty), the cart falls back to Pattern A behavior: whoever clicks "Check out" pays everything in the cart that's not attributed to someone else. This preserves existing V1.1 flow for couples not using multi-payer.

---

## Checkout flow

### Per-role checkout session

When a moderator clicks "Check out my items":

1. Cart filters to items where `current_user_role = ANY(paid_by_role)` AND `payment_status_per_role[current_user_role] != 'paid'`
2. Order summary shown with subtotal + Setnayan 5% fee + BIR 0.5% withholding + total
3. Payment method selection (Maya / GCash / Card / Bank transfer per [0034](../0034_payments_and_cart/0034_payments_and_cart.md))
4. Payment captures → `payment_status_per_role[current_user_role] = 'paid'`
5. For Pattern B (single-payer items): item fulfills immediately
6. For Pattern C (split-cost items): item only fulfills when all roles in `paid_by_role` have `'paid'` status

### Parallel checkout sessions

Multiple moderators can be in checkout simultaneously:
- Bride checks out her items
- Parent of Bride checks out venue at the same time
- Parent of Groom checks out catering at the same time

Each session is independent. No cart-locking; no race conditions because each moderator's items are disjoint sets.

### Split-cost coordination (Pattern C, V1.3+)

If venue is split 50/50 between Parent of Bride and Parent of Groom:
- Item appears in both parents' "Your items" lists
- Each pays ₱90K (50% of ₱180K)
- Item fulfills only when both have paid
- If one parent delays, item stays in pending status; vendor sees order as "Awaiting full payment (₱90,000 / ₱180,000 received)"

---

## Vendor receipt formatting

Per PH cultural norm, vendor invoices/receipts list the couple's name + ceremony date as primary, with the payer's name as a secondary line:

```
═══════════════════════════════════
SETNAYAN OFFICIAL RECEIPT
═══════════════════════════════════
OR No: SET-2026-04829
Issued: May 19, 2026

For the wedding of:
   Maria Santos & Juan Cruz
   Wedding date: December 12, 2026

Service:
   Venue Reservation - Hidden Falls Tagaytay
   Hidden Falls Catering Co.

Payer:
   Tita Lita Santos
   (Ninang of the Bride)

Amount: ₱180,000.00 PHP
Setnayan Fee (5.0%): ₱9,000.00
BIR Marketplace Withholding (0.5%): ₱900.00
═══════════════════════════════════
Total Charged: ₱189,000.00 PHP
═══════════════════════════════════

This receipt is BIR-compliant under Tax Identification
Number 123-456-789-000.
```

Split-cost items generate one receipt per payer with their portion clearly labeled ("Bride's 50% share = ₱42,500 of total ₱85,000").

Vendor invoices in [0026 BIR tax compliance](../0026_bir_tax_compliance/0026_bir_tax_compliance.md) format follow the same convention.

---

## Edge cases

1. **Payer added item but is later removed as moderator.** Per [0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) data preservation rule: past payments stay; future cart items they tagged become orphaned. Couple must re-attribute or pay themselves. Modal warns couple at moderator-removal time: "Tita Lita has 3 unpaid cart items (₱48K total). These will need a new payer or be removed."
2. **Cart item tagged for a role that has no current moderator.** E.g., "Ninang" tagged but no ninang invited yet. Item shows status "Awaiting Ninang assignment" — when a ninang is added later, items auto-attribute (or couple manually assigns).
3. **Payment fails mid-checkout for split-cost item.** First payer's payment captures; second payer's fails. Item stays in "partially paid" state; vendor doesn't fulfill. UI shows "Awaiting ₱90,000 from Parent of Groom." Retry CTA available.
4. **Refund on a split-cost item.** Refund splits proportionally back to each payer per their share percentage. Multiple refund transactions issued.
5. **Currency / payment method differences across payers.** All payments in PHP via PH gateways (Maya / GCash / BDO / etc.). Foreign-based moderators (e.g., NRI parent of bride in California) use international card payment via Stripe (per [0034 § Setnayan Pay](../0034_payments_and_cart/0034_payments_and_cart.md) — international card support in V1.5+).
6. **Coupon / discount applied to a split-cost item.** Discount applies proportionally; each payer's share reduces by same percentage.
7. **Tax compliance per payer.** BIR Form 2307 (withholding tax) needs to be issued per payer per their share. [0026 BIR tax compliance](../0026_bir_tax_compliance/0026_bir_tax_compliance.md) flow extended to support multi-payer 2307 generation.
8. **Disputed payment.** Force-majeure dispute flow from [0019](../0019_communications/0019_communications.md) extends to per-payer scope — only the payer can dispute their share; couple can escalate.
9. **Item added by Maid of Honor but flagged `can_checkout=FALSE`.** Maid of Honor cannot pay; couple gets a notification "Maid of Honor added [Item] to cart and tagged you as payer." Couple confirms tag, then checks out.

---

## Phasing

**V1.2 base ship:**
- Schema (paid_by_role + payment_status_per_role + added_to_cart_by_user_id columns)
- Pattern A backwards compat (single-payer fallback)
- Pattern B (per-item attribution) — full flow
- Per-role cart view with attribution display
- Per-moderator checkout flow (parallel sessions)
- Receipt formatting with couple + payer name
- Budget integration (per-payer flow into 0007)

**V1.3:**
- Pattern C (split-cost per item) with percentage split
- Per-role default attribution templates (couple saves "Parent of Bride pays for: Venue, Catering")
- Split-cost coordination UI (visual progress bar showing % paid)
- International card payment for foreign-based moderators

**V1.5+:**
- Cross-payer settlements ("Bride paid ₱40K of Groom's share; Groom owes Bride ₱40K") — surfaces as informational; couple settles externally
- Automatic re-attribution when a moderator is removed
- Multi-currency support for destination weddings

---

## Open questions

1. **Should there be a "treasurer" role?** A specific moderator (often the bride's father or the couple themselves) who oversees all payments + can see all payer attributions + has settlement view. Recommend: NOT a separate role, but a permission flag (`can_view_all_payer_attributions`) that defaults to couple + parent of bride.
2. **What happens if no one pays an attributed item by the wedding date?** Vendor's force-majeure flow per [0019](../0019_communications/0019_communications.md). Couple notified at T-30, T-14, T-7, T-1 if items remain unpaid.
3. **Cart "shopping list" mode (no immediate payment intent)?** Some moderators add items as suggestions without committing payment. Recommend: cart shows two states — "Saved for later" (no payer attribution) vs "Ready to pay" (attribution set, awaiting checkout).
4. **Payer-side payment plan / installments?** PH wedding vendors often allow installments (e.g., 50% deposit + 50% on day-of). [0034](../0034_payments_and_cart/0034_payments_and_cart.md) handles this at the order level; per-payer installments add complexity. Recommend: V1.3+ feature.
5. **Receipts in PDF vs in-app only?** Couples likely want PDFs for accounting / tax purposes. Recommend PDF generation in V1.2 via existing R2 + receipt-template infrastructure from [0026](../0026_bir_tax_compliance/0026_bir_tax_compliance.md).

---

## Cross-references

- Consumes: [0007](../0007_budget_expenses/0007_budget_expenses.md) (budget tracks per-payer), [0028](../0028_email_notifications/0028_email_notifications.md) (payment confirmation per payer), [0034](../0034_payments_and_cart/0034_payments_and_cart.md) (cart + order infrastructure), [0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) (event_moderators role model)
- Provides: `paid_by_role[]` + `payment_split_percentages` + `payment_status_per_role` schema + `vendor_order_receipts` table + per-role cart view + per-moderator checkout flow + receipt formatting convention
- Consumed by: future budget analytics, future couple settlement views

---

## Decision log

- **2026-05-19 — Iteration drafted.** Multi-payer cart concept locked. Three patterns: A (single-payer, existing) + B (per-item attribution, V1.2 default) + C (split-cost, V1.3+). Per-role cart view shows current moderator's items + other moderators' items as FYI. Receipts format couple name + ceremony date as primary, payer name as secondary (PH cultural norm). Budget integration flows per-payer attribution to [0007 budget](../0007_budget_expenses/0007_budget_expenses.md). Edge cases covered: moderator removal (data preservation), split refunds (proportional), BIR 2307 per payer (extends [0026](../0026_bir_tax_compliance/0026_bir_tax_compliance.md)).
