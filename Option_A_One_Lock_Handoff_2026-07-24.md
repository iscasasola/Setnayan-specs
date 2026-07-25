# Option A — "One Lock" · payment-session handoff (2026-07-24)

> **✅ UPDATE — already implemented by the payment session (draft PR #3658 `feat/wire-chat-lock-to-fee`, OPEN · MERGEABLE · CLEAN, not yet on main).** They chose a **more complete** realization than the "clamp at proposal-send" seam proposed below: **`lockDeal` itself becomes the booking** — it advances the real `event_vendors` row into `contracted` at the negotiated total and fires `collectBookingFeeAtLock` on that exact number, reusing the SAME verified-gate (`isMarketplaceVendorBookable` + the `event_vendors_require_verified_before_lock` DB trigger) and the SAME lock-charge RPC as the vendor-page `finalizeVendor`. Both entry points converge on `event_vendors.total_cost_php` + one fee RPC, so the chat price and the charged base are identical **by construction**, and a second lock from either side is a no-op (ledger deduped per vendor×event). New shared core: `lib/chat-lock-booking.server.ts` (`bookVendorAtChatLock`) + pure `lib/chat-lock-booking.ts` (`planChatLockBooking`); it edits `lockDeal` in `app/_components/negotiation-actions.ts`. **Nothing owed on the chat side — Option A is in flight in the right session.** The clamp approach documented below is the lighter alternative; superseded by PR #3658's direct booking. ⚠ Before merge, confirm the `contracted`-advance is gated so a chat lock can't surprise-book a vendor before the owner intends it live (the fee charge is already gated on `NEXT_PUBLIC_BOOKING_FEE_ENABLED`).


**Owner decision (2026-07-24):** the chat **"Lock this deal"** and the vendor booking must be **ONE lock, one price** — the 5% fee is charged on the price the couple actually agreed to in chat, never a second number typed elsewhere. (Chosen over Option B "two deliberate steps.")

## The good news: Option A is ONE clamp, not a rewrite

We traced the whole path. The pieces already line up — they're just not joined at the price:

1. **Chat side (DONE, this/negotiation session):** when the couple taps "🔒 Lock this deal", `lockDeal` (`apps/web/app/_components/negotiation-actions.ts`) writes the negotiated total to **`chat_threads.agreed_price_centavos`** (+ `locked_at`, `locked_by_user_id`). This column already exists in prod (migration `20270927781343`) and is populated. **It is the handoff.**

2. **Fee side (DONE, payment session PR #3639):** `finalizeVendor` fires the 5% via `collectBookingFeeAtLock` → RPC `booking_fee_open_lock_charge`, and the fee **base = `event_vendors.total_cost_php`** (migration `20270927120000`).

3. **The join that already exists:** `respond_vendor_proposal` (migrations `20270201674389`, `20270227551916`) sets **`event_vendors.total_cost_php = proposal.total_centavos / 100`** when the couple accepts a vendor proposal. So *whatever price a vendor's accepted proposal carries becomes the fee base.*

**Therefore Option A = make the vendor's finalized proposal carry the agreed price.** Do that and the existing chain does the rest: accept → `total_cost_php = agreed_price` → finalize → 5% on the agreed price. No chat-side booking logic, no new "lock fires the fee" path (which would collide with `finalizeVendor`'s couple-facing gates — verification, date-lock modal, reservation-terms ack, slot pick — that correctly live on the Vendors page).

## The one change (payment session's files)

**Clamp the finalized proposal to `agreed_price_centavos` at send.** In `sendCustomProposalCore` (`apps/web/lib/proposal-send.ts` / Proposal Maker): when the target thread has a non-null `chat_threads.agreed_price_centavos`, pre-fill **and clamp** the proposal `total_centavos` to it (the council's "vendor sends FINALIZED proposal, pre-filled + clamped to `agreed_price`"). A vendor can't quietly send a higher number than what was locked.

That's it. Everything downstream (accept → `total_cost_php` → finalize → 5%) is already built and already reads `total_cost_php`.

### Optional belt (only if you want lock→fee without waiting for a re-sent proposal)
If the owner wants the 5% to fire the *instant* the couple locks in chat — even before the vendor re-sends a clamped proposal — the payment session can, inside its own booking path, treat a locked thread as authoritative: resolve the `event_vendors` row from `(chat_threads.event_id, chat_threads.vendor_profile_id → event_vendors.linked_vendor_profile_id)` and set `total_cost_php = agreed_price` before charging. **Caveat we verified:** at chat-lock time there is often **no confirmed `event_vendors` row yet** (`linked_vendor_profile_id` + `total_cost_php` are only written *at* lock by the accept/slot-lock path), so this belt has to create/upgrade the booking row — i.e. it's real booking logic and must live in the payment session next to `finalizeVendor`, not bolted onto the chat action. Recommend shipping the clamp first; add this belt only if the "re-send finalized proposal" step proves too slow in practice.

## What NOT to do
- Do **not** call `finalizeVendor` headless from the chat `lockDeal` — it has couple-facing gates (verification pre-check, date-lock confirmation modal, reservation-terms acknowledgement, slot selection) that can't be satisfied from a chat button.
- Do **not** add a second fee trigger at chat-lock alongside `finalizeVendor` — keep **one** trigger; just make its base the agreed price.

## Status
- Chat handoff column: **shipped + live** (`agreed_price_centavos`).
- Both flags live in prod: `NEXT_PUBLIC_CHAT_NEGOTIATION_V1` ✅, `NEXT_PUBLIC_BOOKING_FEE_ENABLED` ✅.
- Blast radius today ≈ zero (free-during-launch + free-first-5-per-verified-vendor + ~4 real vendors → nobody charged yet).
- **Owed (payment session):** the one clamp in `sendCustomProposalCore`. Ship dark, verify on a dummy thread, then it's live.

See `DECISION_LOG.md` (2026-07-24 "TWO-LOCK FORK" row + its Option-A resolution row).
