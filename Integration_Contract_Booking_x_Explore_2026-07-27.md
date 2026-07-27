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

**AMENDED same-day, twice — read both amendments before wiring anything to the detector.**

### 7a · A blank NEVER blocks — auto-name it (owner: "saving builds blank will make us
### autocreate a name for the build")

"No blanks" is the OUTCOME; auto-naming is the MECHANISM. Refusing a save on a blank is
RETIRED. A blank name is filled from its own group + position (`Item N` · `Choice N` ·
`Add-on N` · `Extra N` · `Option N`), shown as the field's placeholder BEFORE saving so the
name is never a surprise, and reported afterwards as "we named these for you — tap to
change". Applies to anything nameable on either side, including a couple's saved **build**
(the owner's own example). A couple/vendor must never be stuck behind a blank.

### 7b · ⛔ DO NOT route non-chat text through the RAW #3606 detector — it misfires

The earlier line "any new vendor-authored text field routes through the same detector" is
**too strong and would ship defects.** A 27-agent adversarial review (workflow
`wf_80fe5417-ec0`, 22 findings raised, **7 confirmed by running the shipped
`evaluateMessage`**) proved the chat rules refuse honest non-chat text:

| Text | Refused today as |
|---|---|
| `Instagram teaser reel` · `TikTok highlights` · `FB Live stream` | app name (they are DELIVERABLES on a card; Setnayan's own **Patiktok** copy is refused too) |
| `Php 9,000 per hour, minimum 4 hours, 150 pax, 20 staff` | phone number (digits fuse into a PH-mobile shape) |
| `Valid 2026-09-17 - 2026-12-31` | phone number (the most common discount-terms string there is) |
| `Coverage @Tagaytay` · `Reception @Shangri-La` | @handle (the `@` means "at") |
| **`Message me on Setnayan for the full menu`** | off-platform solicitation — for pointing AT us |

_(Corrected on the record: `Photo@Manila` is NOT refused — the rule needs a non-word char
before the `@`. Measured, not assumed.)_

**The rule for both sessions:** the detector is called through a **PROFILE**, never raw.
`chat` = today's rules, untouched. `card` (Booking is specifying it) = drop the app-name and
coded-app rules, drop the long-digit-run rule, narrow the phone-fuse gap from 20 → 2 chars
(verified: `(0917) 880 7163`, `+63 917 880 7163`, `0917-880-7163`, `09178807163` and the
spelled-out "zero nine one seven…" ALL still block), and never fire solicitation when the
destination is Setnayan itself. Phone · email · social link · @handle · solicitation still
block.

**Explore's audit (plan names, manual-vendor names, found-you payload) must use a profile.**
A couple naming a plan after a date range, or adding a manual vendor called "IG Studio" or
"Coverage @Tagaytay", would be refused by the raw rules. Pick the profile per FIELD by what
the text IS, not by who typed it. If a field needs a third profile, add it beside `card` in
ONE module — never a second detector.

⛔ **The flag must not be flipped until the profile ships**, and until the package editor
stops discarding the gate's message (`package-editor.tsx:173` sets a fixed string and never
reads `res.problems` → "see the notes below" with no notes, no field named).

### 7c · Known-unguarded couple-visible vendor text (surfaced, NOT introduced by either wave)

`vendor_profiles.tagline` · review replies · proposal template body/terms · reservation
`cancellation_terms` (renders above the couple's "I agree") · `microsite_about` ·
payment-schedule labels. Publish/activate paths also never re-run any gate, so rows authored
while a flag was off go live unchecked. Whoever touches one of these surfaces first owns
wiring it to the right profile.
