---
name: setnayan-decisions-view-merges-three-sources
description: "A chat thread's decisions live in THREE places, not one: four card markers on chat_messages plus two page sections (payments, guest count) that never enter the stream; a payment's refusal is read via lib/payment-refusal (deposit row → booking) since H4"
metadata:
  type: project
---

Built 2026-09-09 (PR #5372), `lib/thread-decisions.ts` — All · Decisions · Files
on both thread pages.

**The non-obvious shape:** "the cards in this conversation" is NOT a filter over
`chat_messages`. Four kinds ride on message markers (`proposal_id`,
`appointment_id`, `amendment_id`, and `offered_service_id`), but the **couple's
logged payment** and the **guest-count surcharge** are PAGE SECTIONS rendered
around the stream. Any feature that says "show me everything decided here" must
merge three sources, and the two non-message ones can only arrive as props from
the server (`lib/thread-decision-sources.server.ts`).

## Traps measured

- **A reschedule destroyed the old time.** `respondToAppointment`'s
  `propose_new` overwrote `scheduled_at` in place, posted no chat message, and
  `event_appointments` had no audit trail. Fixed by nullable
  `previous_scheduled_at`, written in the same UPDATE. ⚠ It is client-writable
  over REST (like `scheduled_at`), so it is a convenience, **not evidence**.
- **`fetchPendingVendorPayments` filters `vendor_confirmed_at IS NULL`.** It is
  for the supplier's confirm-this section. Any "record of what happened" fed
  from it silently loses every SETTLED payment.
- **Real status vocabularies** (don't guess): proposals
  `draft|sent|viewed|accepted|declined|expired` (+ `resolved_at` = when the
  current status was reached); appointments `proposed|confirmed|done|cancelled`;
  amendments `proposed|accepted|declined|withdrawn`.
- **An offered service has NO state** — nothing closes, spends or accepts it —
  so it has no "current verdict" and got no kind. Same reasoning retired a
  `settled` flag for guest counts: `fetchVendorPaxProposals` returns a row only
  while the surcharge is owed, so absence IS settled.
- **Dates:** `en-PH` orders short dates "Sep 1" and `en-GB` renders "1 Sept".
  Build the string from `formatToParts` with an explicit `Asia/Manila` — there
  is a guard (`a-date-is-not-decided-by-the-machine`) against a zoneless
  formatter.

See [[setnayan-the-standing-sentence-is-couple-voiced]] for why the standing
line renders on the couple's side only.

## ⚠ ONE SUM OF MONEY, TWO SUPPLIER ANSWERS (measured 2026-09-10)

The couple's **deposit** is recorded twice: on `event_vendors.deposit_*` AND as
an `event_vendor_payments` ledger row. They carry INDEPENDENT supplier answers:

- ledger row → `confirm_vendor_payment` RPC (what "Confirm received" in the
  thread and on Decisions calls) stamps ONLY `vendor_confirmed_at`;
- booking → `acknowledge_vendor_deposit` / `reject_vendor_deposit`, and a
  rejection goes to the admin queue (`settle_vendor_deposit_dispute`,
  `/admin/disputes`), guarded by trigger `guard_event_vendor_deposit_ack`.

**RESOLVED by H4 (PR #5443, SERVED 2026-09-11 at 21ffe0a; owner ruled "one path
for every payment").**
- `event_vendor_payments.is_deposit_record` is stamped by a BEFORE INSERT
  trigger from the two exact notes the deposit writers use. A guard pins those
  notes to `vendors/actions.ts`.
- `refuse_vendor_payment` routes the deposit's row to `reject_vendor_deposit`;
  an installment gets mirrored `payment_refused_*` / `payment_dispute_*`
  columns, refereed by `settle_vendor_payment_dispute` on `/admin/disputes`.
- Confirming the deposit's row acknowledges the deposit, and an AFTER trigger
  on `event_vendors` confirms the row whenever the deposit is acknowledged.
- Read a payment's refusal ONLY through `lib/payment-refusal.ts`
  `readPaymentDispute`: the deposit row's own refusal columns are always empty
  (a CHECK forbids them), and the truth is on the booking.
- The ledger guard runs on INSERT, UPDATE and DELETE. A session may not set,
  CLEAR or delete a refusal or a ruling; that closed a vendor_confirmed_* insert
  forgery hole and an erasure hole the orchestrator caught at review.

Reply actions on Decisions (#5402): meeting `respondAppointment` reads
`return_path`, adjustment `respondAmendmentFromChat` reads `return_to` — the
field names DIFFER; guard `a-decision-reply-posts-what-the-action-reads`.
`revalidatePath` with a `?query` purges nothing (Next 15.5 tags verbatim) —
revalidate `revalidationTarget(path)` from `lib/return-path.ts`.
