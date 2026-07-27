# Integration Contract — Booking session × Explore-replan session · 2026-07-27

> Owner directive: *"we are now building 'Multiple locked items in Explore' session. and this
> will intertwine with the service card. make sure you both integrate neatly to each other."*
> This is the seam document BOTH sessions build against. It re-specs nothing — every rule here
> points at a DECISION_LOG 2026-07-27 row or shipped code. If a slice needs to break a seam,
> log the row FIRST and update this file in the same commit.

## 1 · Ownership map (who edits what)

| Surface / file | Owner | The other session… |
|---|---|---|
| `shortlist-categories.tsx` card rails, `vendors/page.tsx`, accordion/lock-milestone, `checklist-state.ts`, `event_category_decisions` | **Explore** (slices A–J) | stays off; Booking holds no branches there (serialized 2026-07-27) |
| `inquiry-composer.tsx` + the inquiry sheet's CONTENT (customization, other-services-priced-to-inquiry, special requests) | **Booking** | wires the card's Inquire/Check-inquiry BUTTON to it (slice D); never forks a second composer |
| `service-wizard.tsx` · `services-manager.tsx` · `showcase-media-fields.tsx` · package-option machinery + its migrations (`parent_option_id`, `pick_min`/`pick_max`, `max_qty`) | **Booking** (wave pending owner go) | rebases past #3793's `compressImage` lines if touching these files |
| `lockPackage` / `LockPackageModal` / package anchor + credit + fee machinery (#3743–#3785) | **Booking** | PR-I moves the fee CALL SITE only (see §4); machinery is not re-implemented |
| PR-H (vendor agrees) + PR-I (fee + pool at acknowledge) + `finalizeVendor` tail | **Explore** | Booking adopts request-state wording in LockPackageModal/chat-lock AFTER PR-H lands |
| Admin/disputes rails for FOUND-YOU | **Explore** | Booking's fee attribution consumes, never resolves, found-state (§5) |

## 2 · The card (slice D builds it; both sessions' rows define it)

Final card = **＋ Add to build · Inquire / 💬 Check inquiry (stateful) · Lock this (request)**.

- **Add to build** → `event_build_picks` ◕ (soft, reversible) — Explore's two-speed model.
- **Inquiry action is STATEFUL off thread existence, resolved by the shipped
  `InquiryComposer` existing-thread guard — that guard is the SINGLE source of truth.**
  No thread → "Inquire" → fresh composer. Thread exists → "💬 Check inquiry" → open the
  EXISTING thread. Manual-added vendors with no thread keep "Inquire" even on the bench.
- **Lock** carries REQUEST wording from PR-H onward ("Lock this" → "⏳ lock in progress");
  finality language appears only at step 5 (vendor accepts payment). Until PR-H lands, the
  hardened `finalizeVendor` stays the action behind the button.
- Grey-out rule (Explore spec §6): incompatible cards disable Add-to-build + Lock, keep the
  inquiry path as "Ask anyway".
- Booking's standing card locks slice D must NOT regress: **Card → Details → Inquiry** flow,
  booked counts, adaptive pax/date/distance pricing, price freeze at inquiry,
  locked-category suppression.

## 3 · The inquiry seam — one button contract, two flags

- Explore ships the card under `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED`; Booking's composer
  extension (customization lines/options/follow-ups, set-vs-separate credit note, special
  requests) ships under its own flag later.
- **The seam must degrade cleanly:** Explore-flag ON + Booking-flag OFF ⇒ Inquire opens the
  SHIPPED composer exactly as today. Booking-flag ON ⇒ the same button opens the extended
  sheet. The button contract (what it's called, when it renders, what it opens) never changes
  with Booking's flag — only the sheet's content does.

## 4 · The lock/fee seam — ⚠ the one real hazard

**PR-I moves `collectBookingFeeAtLock`'s call to `vendorAcknowledgeDeposit`. For PACKAGE
bookings it MUST bill the ANCHOR row (one-anchor-N-covered model, BUILD_SPEC §4):**

- Lock-request state, acknowledge, fee, and pool-acquire all live on the **anchor**
  `event_vendors` row only. Covered rows carry no money, no fee, no request state — the same
  exemption that keeps them out of the uniqueness indexes.
- If an acknowledge path ever holds a covered row, resolve the anchor via its package booking
  BEFORE calling the fee. Safety net (shipped #3765, DB-enforced): the RPC hard-refuses
  covered rows (`covered_row_no_fee`) rather than freezing a free-5 ordinal on a ₱0 row —
  but the refusal is the backstop, not the design.
- The fee call itself is unchanged: anchor's `total_cost_php` base, 5%→1% taper over
  ₱100k, ₱50 floor, sourced-only, free-5 per event, two-key `BOOKING_FEE_RAIL_LIVE` gate.
- Attribution is read AT acknowledge time via `booking_fee_attribution_for` (#3758) and
  **fails safe to import = FREE**. See §5.

## 5 · FOUND-YOU × fee attribution

Explore's FOUND-YOU work (view-counter receipts, claim-sync authority, dispute ladder) is
UPSTREAM of the fee: it decides what counts as "found". The contract:

- `booking_fee_attribution_for` consumes the resolved attribution; it never re-derives
  found-state itself. If FOUND-YOU adds inputs (found-records beside `inquiry_source`),
  extend the resolver in ONE place and keep the invariant: **any resolution error or unknown
  state bills NOTHING** (fail-safe to import/free). A vendor must never be charged by a bug.
- Dispute outcomes (grace-first auto-accept, admin review) act on the LEDGER after the fact —
  they never retro-edit the attribution function's inputs mid-flight.

## 6 · Migrations + serialization discipline

- Both sessions create migrations this wave (Explore: `event_category_decisions` +'complete';
  Booking: three option columns). Standing rules apply to both: `pnpm migration:new` for
  timestamps, dispatch `supabase-migrations.yml` manually after merge, then **verify the
  OBJECT in prod** (schema_migrations lies), explicit `REVOKE ... FROM anon, authenticated`
  on every new object (default-ACL trap).
- Ping protocol: Explore pings before slice D (card/inquiry entry). Booking pings before
  touching `vendor-dashboard/services/actions.ts` (server no-blanks/contact gate) in case a
  slice is mid-flight there. Whoever merges second rebases; never resolve a stale-tree merge
  by hand-picking (the #3668 clobber).

## 7 · Publish-integrity rules (owner 2026-07-27) — apply on BOTH sides

"No blanks · no contact info or app-bypass" is a PLATFORM rule, not a maker feature: Booking
enforces it in the service/package save actions (reusing the #3606 chat-filter rules);
Explore's card surfaces render only published (already-clean) data and add no free-text
inputs that skip the gate. Any new vendor-authored text field anywhere routes through the
same detector.
