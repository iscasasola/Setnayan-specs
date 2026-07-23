# Vendor Proposal Maker — design spec

> Dated 2026-07-10. The vendor's quote/proposal authoring tool for the vendor↔couple thread. Interactive prototype: [`prototypes/vendor_proposal_maker_2026-07-10.html`](prototypes/vendor_proposal_maker_2026-07-10.html) (open in a browser — it's self-contained). Part of the vendor↔customer connection work ([`Vendor_Customer_Connection_Build_Plan_2026-07-10.md`](Vendor_Customer_Connection_Build_Plan_2026-07-10.md)). Theme: shipped "Clean Editorial" — ivory paper, obsidian ink, champagne-gold accent (`#a88340`), Cormorant Garamond serif; mulberry send button (the thread's own accent).

## Where it sits in the flow

`Masked lead → vendor Accepts for X tokens (region-banded 1–3; returning = 1; unlock_vendor_event) → full brief revealed → **Proposal Maker (this)** → couple accepts quote → couple locks with the downpayment → vendor confirms → date held → payment plan runs → deliverables.`

The recommended first move after accept is **quote-first**: land on the brief with an AI-drafted opening quote (deterministic, ~99% margin), one tap to review & send; "Ask first" is the escape hatch. Personalization happens on top via re-quote + change orders.

## The rules (what the maker does)

0. **Seeded from the couple's request** — the editor's **pax (and coverage hours) default to the couple's requested pax** from the inquiry/brief (`thread.pax_at_inquiry` / live pax), so the opening/AI-drafted quote is priced to what they actually asked for. The header reads "Sized to their request · N pax"; if the vendor quotes a different count it flips to "Quoting M pax — request was N" with a **reset** link. Per-pax/per-hour lines resolve against this value from the first render.
1. **Line items** — each line prices one of three bases (from `vendor_services.pricing_basis`):
   - **Flat** — a fixed amount.
   - **Per pax** — `rate × max(pax, min_pax)` (per-guest, with a floor).
   - **Per hour** — `hour_base` covers `min_hours`, then `+extra_hour` per hour beyond. Resolves against the event's **pax** and **coverage hours** (both editable at the top).
2. **Freebies** — a line with **₱0 / null amount** renders as **Complimentary / Included** (the "thrown in to win the booking" move). Gift-icon toggles any line free ↔ paid.
3. **Bundles** — start from a `vendor_packages` package; its `vendor_package_items` seed the line items.
4. **Reorder** — drag the **6-dot handle** (drag-and-drop only; no arrows). Order = `vendor_package_items.display_order` / the `line_items` array order.
5. **Crew meal** — three states:
   - **Included** — in the package price (`crew_meal_included`).
   - **Charge** — `crew_size × ₱/head`, added to the total → the booking's `food_allowance_php`.
   - **Offset — couple provides** (`crew_meal_required`) — when the couple has booked a **crew-meal marketplace** service, this is auto-detected (banner) and defaults on. It becomes a **CREDIT** (crew × ₱/head) that is **deducted from the FINAL payment first**, leaving the downpayment/lock whole. If the credit exceeds the final payment, the schedule flags "over — trim a payment" rather than silently eating the downpayment.
6. **Transportation** — **Included** (`transport_included`) · **Flat fee** (`transport_flat_fee_php` → booking `transport_php`) · **By distance** (null fee → "quoted after site check").
7. **Discount** — a peso reduction on the total (a negative adjustment / manual-total override).
8. **Payment schedule — self-balancing, pays to ₱0** (`vendor_service_payment_schedules`):
   - Editable installments (First payment = downpayment, gold **locks** tag = seq-0 = the guest-side lock amount).
   - Each installment: label · **peso amount** (or %) · due timing — **On booking (locks)** / **X days before event** / **On the event day** (= `due_anchor` `on_lock` / `before_event` + `due_offset_days`).
   - An **auto "Final balance"** installment always covers the remainder → the schedule is always 100%. **Add payment** materializes the current balance into a real installment; editing any amount down **regenerates a fresh auto-balance** to cover the difference. Automatic until ₱0.
   - The crew-meal credit lands on this final balance (rule 5).
9. **Accepted payment methods** — toggle **BDO · GCash · Bank transfer · Maya** (`vendor_payment_methods`) — the rails the couple sees on "how to pay."
10. **Send** — inserts a `vendor_proposals` row (`total_centavos`, `line_items` jsonb, `valid_until`, `rendered_terms`) + posts the `chat_messages.proposal_id` card into the thread. Re-quote = send a fresh proposal.

## Data mapping (what's real vs. the enhancement)

**Already in code:**
- `vendor_services.pricing_basis` (`fixed | per_pax | per_hour`) + per-pax/per-hour fields, `crew_meal_included` / `crew_size`, `transport_included` / `transport_flat_fee_php`.
- `vendor_proposals` (`total_centavos`, `line_items`, `valid_until`, `rendered_terms`), `respond_vendor_proposal` RPC.
- `vendor_service_payment_schedules` (seq, label, amount_kind percent|fixed, due_anchor, due_offset_days), `computePlanInstances`, `event_vendor_payment_plan` (+ PR 1's default-seed at lock).
- `vendor_payment_methods`. `event_vendors.food_allowance_php` / `transport_php`. `vendor_package_items.display_order`.
- Crew-meal marketplace (Reserve→Confirm→Settle) — the cross-service booking that triggers the offset.

**The gap (enhancement this maker specs):**
- `vendor_packages` / `vendor_package_items` are **flat today** (`total_price_centavos`, no per-line basis). To bring per-line pricing bases + crew/transport into the **bundle maker**, add `pricing_basis` (+ per-pax/per-hour, crew/transport) to `vendor_package_items`, and have the resolver compute each line against the event's pax/hours.
- The **crew-meal-credit-to-final-payment** logic and the **self-balancing auto-final-balance** are new resolver/UI behavior.

## Build plan (2 PRs)

1. **Schema + resolver** — add `pricing_basis` (+ per-pax/per-hour fields, crew/transport, crew-meal-offset cross-read) to `vendor_package_items`; resolver computes lines against pax/hours, applies the crew credit to the last `seq`, and writes the self-balanced schedule (auto Final balance persisted as the final `seq`). Payment-schedule + methods tables already exist.
2. **UI** — this editor in the vendor thread → sends a real `vendor_proposals` row + proposal card. The couple's receive-and-lock screen renders the itemized quote (incl. freebies + crew credit) → accept → downpayment lock.

## Open decisions (owner)

- **Privacy default** for the vendor brief that precedes this (mood board + locked vendors: booked-only vs. visible at inquiry). Recommendation: booked-only for mood board + locked vendors; AI-status + request basics visible at inquiry.
- Whether installments store as **fixed peso** (as the prototype defaults) or **percent** (`amount_kind`) — both are supported; peso is more intuitive for the pay-to-zero model.
