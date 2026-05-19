# Iteration 0007 — Budget & Expenses

**Iteration number:** 0007
**Topic:** Couple's wedding budget tracker — vendor payment ledger
**Surface:** Setnayan Web → Couple Dashboard · **Bottom-nav tab: Vendors** (sub-section: Budget) · URL: `setnayan.com/dashboard/[event-id]/budget`
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, bottom-nav routing), 0001 (couple identity), 0003 (apply-then-pay flow — read-only WalletSpend rows for the Setnayan platform costs section), 0006 (`vendors`, `vendor_payment_milestones`, `vendor_crew_meal_totals`, `vendor_meetings`)
**Status:** Drafted 2026-05-09
**Companion specs:** `0006_vendors_management/`, `0003_token_wallet_and_packs/`, `0001_creating_guest_list/` (couple identity)
**Replaces:** prior placeholder `0007_budget_expenses.md` (2026-05-08), which used pre-cascade folder numbers.

---

## What this iteration ships

A budget panel inside the couple dashboard that **curates every amount the couple needs to settle for every vendor** at their wedding. The couple sees what's owed, what's paid, what's next due, and adds upcoming payment due-dates to their phone's native calendar with one tap.

Specifically delivered:

- **Per-vendor expense rows** sourced from `0006_vendors_management/`. Every booked vendor gets a row.
- **Three line items per vendor:** Package, Crew Meal, Transportation. Each has its own contracted amount and deadline (couple-input in V1).
- **Payment log** per line item — multiple payment records allowed (couples often pay in down + mid + final). Each payment record captures: amount, date, payment method, reference number, proof screenshot.
- **Vendor payment QR display** — when the vendor has uploaded their GCash, Maya, or bank QR in 0006, the budget panel surfaces it next to the line item so the couple scans to pay directly from their banking app.
- **Roll-up dashboard cards:** Total amount, Total paid, Remaining balance, Next payment due (date + vendor + line + amount).
- **Native calendar export (.ics) with duplicate avoidance:** per-line "Add to calendar" and bulk "Add all due dates to calendar" generate iCalendar `.ics` files compatible with Apple Calendar, Google Calendar, Outlook, and any standards-compliant calendar app. Default reminders: 24 hours before and 1 hour before each due date. Each line item carries a **`tracked_in_calendar` toggle** so the bulk export skips lines the couple has already added — no duplicates from re-importing.
- **Setnayan platform costs section** — auto-populated from `0003` wallet spends (Papic seats, templates, Custom Monogram Pack, Pro widgets, Panood tier, etc.). Already paid via Setnayan Pay; shown for the couple's full financial picture.
- **Free-form Miscellaneous expenses** — wedding rings, marriage license fees, save-the-date printing, decor extras the couple buys directly. Free-form rows the couple adds manually.

This iteration does NOT ship:

- Wedding budget category rollups (Catering / Photography / Decor / etc.) — out of scope; the 3-line-item structure per vendor is the V1 organizing principle.
- Budget target setting or variance-vs-target tracking — couples track actuals only in V1.
- Forecasting beyond next-payment-due — no end-of-event spend projection in V1.
- Multi-currency support (USD, etc.) — PHP only in V1.
- External share links (parents, planners) — V1 is couple-only access. PDF export possible via system print-to-PDF.
- Vendor-side deadline sync — vendors don't push deadlines to Setnayan in V1; couple inputs all deadlines manually based on the contract terms.

---

## Data model

```
VendorExpense
  - vendor_expense_id
  - event_id (FK)
  - vendor_id (FK to 0006 vendors)
  - PRIMARY KEY (event_id, vendor_id)

VendorLineItem
  - line_item_id
  - vendor_expense_id (FK)
  - line_type: enum('package', 'crew_meal', 'transportation')
  - amount_centavos: int
  - deadline_date: date (nullable until couple inputs)
  - deadline_notes: text (e.g. "Final payment on event day")
  - tracked_in_calendar: bool (default false; flips true when couple taps + Calendar)
  - created_at, updated_at

PaymentRecord
  - payment_id
  - line_item_id (FK)
  - amount_centavos: int
  - payment_date: date
  - payment_method: enum('gcash', 'maya', 'bpi', 'bdo', 'unionbank', 'metrobank', 'cash', 'check', 'credit_card', 'bank_transfer', 'other')
  - reference_number: text (transaction ID, check number, GCash ref, etc.)
  - proof_r2_key: text (R2 object key for the uploaded screenshot)
  - notes: text (optional free-form)
  - recorded_at, recorded_by_user_id
  - audit_log: jsonb (edit history)

MiscExpense
  - misc_expense_id
  - event_id (FK)
  - title: text (e.g. "Marriage license fees", "Wedding rings")
  - amount_centavos: int
  - deadline_date: date (nullable)
  - tracked_in_calendar: bool (default false)
  - paid: bool
  - PaymentRecord rows can attach to a MiscExpense same way as a VendorLineItem
```

The `0003` apply-then-pay flow's `WalletSpend` records are read directly; no separate Setnayan platform expense table is created. The budget panel queries `WalletSpend WHERE event_id = ?` to populate the Setnayan platform costs section.

---

## Couple UX

### Dashboard rollup (top of panel)

Four cards in a row, prominent at the top of the Budget & Expenses page:

| Card | Calculation |
|---|---|
| **Total amount** | Sum of all `VendorLineItem.amount` + `MiscExpense.amount` + already-spent Setnayan platform costs |
| **Total paid** | Sum of all `PaymentRecord.amount` across all line items + paid `MiscExpense` + Setnayan platform spends |
| **Remaining balance** | Total amount − Total paid |
| **Next payment due** | Earliest unpaid `VendorLineItem.deadline_date` (with vendor name + line type + remaining amount) |

The "Next payment due" card is the action card — tapping it scrolls to the relevant vendor row and offers a one-tap "Pay now (open vendor's QR)" or "Record a payment."

### Vendor list

One row per vendor, expandable. Collapsed view shows: vendor name, vendor category (from 0006), total contracted (sum of 3 line items), paid-to-date, balance.

Expanded view shows three line item rows under the vendor:

```
Photographer · Studio Calle
─────────────────────────────────────
  Package           ₱45,000   Due 2026-04-01   [QR]  [+ Payment]  [+ Calendar]
  · Paid ₱15,000 (down) · 2026-02-01 · GCash · ref 2401XXX · [proof image]
  · Balance: ₱30,000

  Crew Meal         ₱3,000    Due 2026-05-08 (event day)   [QR]  [+ Payment]  [+ Calendar]
  · Balance: ₱3,000

  Transportation    ₱2,000    Due 2026-05-08 (event day)   [QR]  [+ Payment]  [+ Calendar]
  · Balance: ₱2,000
```

Per-line action buttons:

- **[QR]** — opens the vendor's GCash / Maya / bank QR in a modal so the couple can scan with their banking app. Sourced from the vendor's record in 0006. If the vendor hasn't uploaded a QR, this button is hidden and the couple uses the vendor's contact info (also in 0006) to coordinate payment manually.
- **[+ Payment]** — opens the payment recording modal (see below).
- **[+ Calendar]** — generates a one-event `.ics` file and triggers a download. Opening the file in iOS Safari adds it to the iPhone's Calendar app; same for Android with Google Calendar.

### Payment recording modal

Required fields:

- Amount (number, PHP, ≤ remaining balance — validation enforced)
- Payment date (defaults to today)
- Payment method (dropdown: GCash, Maya, BPI, BDO, UnionBank, Metrobank, Cash, Check, Credit Card, Bank Transfer, Other)
- Reference number (text input)
- Proof screenshot (image upload — JPEG, PNG, HEIC; stored in R2 at `events/{event_id}/payment_proofs/{payment_id}.{ext}`; max 10 MB)

Optional fields:

- Notes (free-form text)

On save: creates a `PaymentRecord`, decrements the line item's running balance, updates the rollup cards, refreshes the next-payment-due card. Edits to existing payments are allowed but logged in `audit_log` so deleted-amount fraud isn't possible silently.

### Setnayan platform costs section

Below the vendor list. Shows every wallet spend tied to the event:

```
Setnayan Platform · already paid
─────────────────────────────────────
  Custom Monogram Pack          ₱2,000    paid 2026-04-12 via Setnayan Pay
  5 Papic seats             ₱2,500    paid 2026-04-12 via Setnayan Pay
  Personal Reel templates × 3   ₱600      paid 2026-04-15 via Setnayan Pay
  Panood Tier 1            ₱4,500    paid 2026-04-20 via Setnayan Pay
  Pro Bundle (3 widgets)        ₱200      paid 2026-04-22 via Setnayan Pay
                                ─────────
  Total Setnayan platform           ₱9,800
```

Read-only — auto-populated from the `0003` wallet's `WalletSpend` records. No "+ Payment" or "+ Calendar" actions because these are already paid (and bought via Setnayan Pay, not direct PHP).

### Miscellaneous expenses

Free-form section at the bottom for things the couple buys directly without a Setnayan vendor:

- Wedding rings
- Marriage license fees
- Save-the-date printing
- Gift bags
- Decor extras

Same payment recording flow as vendor line items. No vendor QR (since there's no vendor record), no auto-create — couple types the title and amount manually.

---

## Calendar export — `.ics` mechanics

### Single-line export

Per-line "Add to calendar" generates one VEVENT:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Setnayan//Wedding Budget//EN
BEGIN:VEVENT
UID:{event_id}-{line_item_id}@setnayan.ph
DTSTAMP:{now in UTC}
DTSTART;VALUE=DATE:{deadline_date}
SUMMARY:Setnayan: Payment due — {Vendor name} — {Line type}
DESCRIPTION:Amount: ₱{remaining}\nVendor contact: {vendor_phone}\nReference: {vendor_id}
LOCATION:{vendor_address if available}
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Setnayan: Payment due tomorrow
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Setnayan: Payment due in 1 hour
END:VALARM
END:VEVENT
END:VCALENDAR
```

### Bulk export

"Add all due dates to calendar" generates one `.ics` containing every unpaid `VendorLineItem.deadline_date` plus every `MiscExpense.deadline_date` that has a deadline set **and** `tracked_in_calendar = false`. Lines already flagged as tracked are skipped — re-clicking the bulk button won't create duplicates of already-added entries.

Filename format: `setnayan-{couple-slug}-payments.ics` (e.g. `setnayan-maria-and-juan-payments.ics`).

The bulk button text adapts to the current state:

- "Add 5 new dates to calendar" — when 5 lines have `tracked_in_calendar = false`
- "Add all due dates to calendar" — when nothing's been tracked yet
- "All dates already on calendar — re-export to update?" — when every line is flagged tracked; tapping anyway re-exports the full set in case the couple wants to refresh

### Duplicate avoidance — two layers

**Layer 1: stable UIDs.** Every VEVENT uses the format `{event_id}-{line_item_id}@setnayan.ph`. Apple Calendar, Google Calendar, and Outlook all match incoming `.ics` events by UID and **update the existing event instead of creating a duplicate** when the same UID is imported twice. So even without the toggle, re-importing Setnayan's `.ics` won't multiply entries.

**Layer 2: `tracked_in_calendar` toggle.** Each line item carries a boolean flag. Tapping the per-line "+ Calendar" button or downloading the bulk `.ics` flips affected lines to `tracked_in_calendar = true`. Couple can manually toggle in either direction — for example, if they removed an event from their calendar and want it back in the next bulk export, they un-toggle. The toggle visible state is a small status pill on the line item:

- **Not on calendar** (gray pill) — default
- **On calendar** (green pill) — flagged after couple added it via Setnayan's export, or set manually

Together, the two layers handle the common cases without needing read access to the user's actual calendar.

### Why .ics over native API integration

`.ics` works on every modern OS with no permission grants, no API keys, no OAuth dance, no recurring server-side state. Couple downloads, opens, picks "Add all" — done. Native EventKit / CalendarContract integrations and OAuth with Google Calendar / Outlook to *read* the calendar are V2 candidates — they'd let Setnayan see what's already there directly rather than relying on the toggle. V1's two-layer approach gets ~95% of the value for ~5% of the build effort.

---

## Vendor QR display (depends on 0006)

This iteration consumes a field from 0006 vendors:

```
Vendor (extending 0006)
  - payment_qr_r2_key: text (nullable — vendor uploads their GCash/Maya/bank QR PNG)
  - payment_qr_method: text (e.g. "GCash 0917-555-1234", "BPI Account 1234-5678")
```

The budget panel renders the QR when present:

- Tap the [QR] button on a line item
- Modal shows the QR image, the vendor's payment method label, and a "Save QR" button to download to the couple's phone for offline payment

If the vendor hasn't provided a QR, the [QR] button is hidden and replaced with a "Contact vendor" button that opens the vendor's phone number / email from 0006.

---

## Wallet integration (depends on 0003)

This iteration **does not register any new wallet services**. It's a read-only consumer of `0003`:

- Reads `WalletSpend` records filtered by `event_id` to populate the Setnayan platform costs section
- No new `service_key` registrations, no spend calls, no new wallet primitives needed

All payments tracked in this iteration are **off-platform** (couple paying vendors directly via GCash/bank/cash, recorded for tracking only). Setnayan doesn't process or hold these payments — that's a 0006 vendors / payments processor question and remains out of scope here.

---

## Privacy & access

- **Couple-only access** — the budget panel uses Setnayan's existing couple-shared session (per 0001). Both spouses see and edit; no third-party access in V1.
- **Proof screenshots** stored in R2 at `events/{event_id}/payment_proofs/`. R2 access is wedding-scoped via signed URLs; expires after 90 days (refreshes on viewing).
- **Audit log** on every payment record edit. Lists who changed what and when.
- **No PII shared externally.** Vendor QRs are vendor-provided assets (vendor consents to display in 0006 onboarding).
- **Data retention** matches Setnayan's 5-year wedding industry standard. Payment records keep their proof images for the full 5-year window.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- Every vendor in the couple's 0006 vendor list automatically appears as a row in Budget & Expenses with three editable line items (Package, Crew Meal, Transportation).
- Couple can input an amount and a deadline for each line item; both fields are independent and optional (a line item with zero amount is hidden but not deleted).
- Couple can record multiple payments against any single line item; running balance auto-updates.
- Payment records require amount, date, method, reference, and a proof screenshot upload; validation prevents amount from exceeding the line's remaining balance.
- Proof screenshots are stored in R2 and viewable inline on the payment row.
- Vendor's GCash/Maya/bank QR (if uploaded in 0006) is displayed next to each line item for one-tap scan-to-pay.
- Top-of-panel rollup cards show Total amount, Total paid, Remaining balance, and Next payment due, all updating in real-time as payments are recorded.
- "Add to calendar" buttons (per-line and bulk) generate valid `.ics` files that import successfully into Apple Calendar, Google Calendar, and Outlook.
- VEVENT UIDs are stable per line item — re-importing the same `.ics` updates the existing calendar entry rather than duplicating.
- Per-line `tracked_in_calendar` toggle exists; flips to true on download via the per-line button or bulk export; couple can manually toggle in either direction.
- Bulk export skips lines where `tracked_in_calendar = true`; bulk button text adapts to show the count of lines that would actually be added.
- Default reminders on calendar events fire at 24h before and 1h before the deadline.
- Setnayan platform costs section auto-populates from service_orders (V1 apply-then-pay) spends and shows accurate totals.
- Miscellaneous expenses can be added free-form with the same payment recording flow.
- Edit history audit log is queryable for any payment record.

---

## Open questions

- Whether to add **vendor-side push** of deadlines (vendor logs into a partner portal and sets the schedule themselves) — V2. For V1, the couple inputs all deadlines.
- Whether to add **EventKit / CalendarContract two-way sync** — V2. V1 ships .ics export only.
- Whether to add **payment plan templates** (e.g., 50/50, 30/40/30 down/mid/final) that pre-fill multi-installment schedules per line item — V1.1 nice-to-have. V1 keeps it simple: one deadline per line, multiple payment records allowed.
- Whether to add **OCR on payment proof screenshots** to auto-extract reference number and amount — V2.

---

## Companion specs and cross-references

- `0001_creating_guest_list/` — couple identity and shared access model
- `0003_token_wallet_and_packs/` — `WalletSpend` records consumed for the Setnayan platform costs section
- `0006_vendors_management/` — vendor records, contact info, payment QR uploads
- `12_Master_Blueprint.docx` — overall couple dashboard architecture
- `CLAUDE.md` — decision log including the 2026-05-09 Budget & Expenses scope lock

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0007_budget_expenses/0007_budget_expenses.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0007_budget_expenses/0007_budget_expenses.docx)

---

## V1.2 Amendment — Per-Payer Attribution + Visibility Tags (added 2026-05-19)

Per [0048 Multi-Moderator Event Access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) and [0049 Multi-Payer Cart](../0049_multi_payer_cart/0049_multi_payer_cart.md), budget line items extend to track per-payer attribution + role-based visibility in V1.2.

### Schema additions to `budget_line_items`

```sql
ALTER TABLE budget_line_items
  ADD COLUMN paid_by_role TEXT[],                          -- mirror of paid_by_role from cart line items
  ADD COLUMN linked_order_line_item_id UUID REFERENCES service_order_line_items(line_item_id),
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT,
  ADD COLUMN amount_revealed_to_aggregate BOOLEAN NOT NULL DEFAULT TRUE;
```

### Automatic flow from cart

When a cart line item checks out via [0049](../0049_multi_payer_cart/0049_multi_payer_cart.md) checkout flow, a corresponding `budget_line_items` row is auto-created with:
- Same `paid_by_role` as the cart item
- `linked_order_line_item_id` populated for traceability
- Same visibility tags propagated

### Budget view changes

Three new views on `/dashboard/{eventId}/budget`:

1. **"Who paid what"** tab — group budget lines by `paid_by_role`. Shows "Bride: ₱X / Parent of Bride: ₱Y / Ninang Lita: ₱Z" subtotals. Useful for couples managing multi-payer reality.
2. **"By category"** tab (existing) — extended to show payer attribution per line item.
3. **"Pending"** tab — items added to cart but not yet paid; grouped by attributed payer for tracking.

### Visibility-aware aggregate

Critical leak-prevention rule from [0048 § Aggregate budget handling](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md):

- Hidden line items (e.g., bridal_gown order in groom's view) show as "Reserved — Bride's items ₱X" with line items hidden but total preserved.
- Groom's aggregate total rounded to nearest ₱5K to prevent reverse-calculation of hidden item exact amount.
- Bride + parents see full breakdown.

### CSV export

Existing budget CSV export gains a `paid_by_role` column. Couples exporting for off-platform accounting see per-payer attribution.

### Forward-compat

V1.1 single-couple events backfill with `paid_by_role: ['bride', 'groom']` (joint attribution) on existing budget lines. UI hides the per-payer view if the event has only `bride` + `groom` moderators (no real multi-payer to show).
