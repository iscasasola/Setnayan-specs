# Vendor data must survive a deletion — the classification

> **Owner, 2026-08-21:** *"only data from the user gets lost. But statistics and data
> for the vendor stays, including the reviews, statistics, etc that the vendor needs
> for their website."*

> ## ✅ SLICE 1 IS BUILT — `vendor_reviews` (PR #4665, 2026-08-21)
>
> **Do NOT rebuild it.** A review now survives its event: `event_id` is nullable
> + `ON DELETE SET NULL`, and once orphaned the review **freezes** so a couple
> cannot delete the celebration and then rewrite the supplier's record.
>
> 🔑 **IT WAS NOT NEW MACHINERY, AND THAT IS THE PATTERN FOR EVERY REMAINING
> ROW.** `couple_user_id` was ALREADY nullable + SET NULL, so a review already
> outlived the PERSON who wrote it — only the EVENT took it down. And
> `lib/erasure/coverage.ts` already stated the owner's rule almost word for word,
> months earlier: *"deleting it would silently move a vendor's public star
> rating, which is a third party's commercial record erasure does not reach."*
> **Before building any row below, check whether the user-erasure path already
> solved it — the answer for reviews was yes.**
>
> 🔑 **FOUR OF FIVE RLS POLICIES WERE ALREADY CORRECT FOR ORPHANS, FREE.** Public
> read stays `true`; couple-delete keys on `event_id` and `NULL IN (…)` is NULL
> so the couple cannot delete an orphan; couple-insert keys on `event_id` so an
> orphan cannot be FORGED; vendor-reply keys on the vendor. **Read the policies
> before assuming a row needs new ones.**
>
> 🚨 **AND ONE TRAP THAT WILL RECUR ON EVERY REMAINING ROW: RECREATING A POLICY
> SILENTLY DISCARDS ITS ROLE RESTRICTION.** A `CREATE POLICY` with no `TO` clause
> defaults to **PUBLIC**, including `anon`. `exposure-freeze.db.test.ts` caught
> it. Every `DROP POLICY … CREATE POLICY` in the slices below must restate
> `TO authenticated` explicitly.
>
> ⏭ **The application side needed ONE line.** Widening the type produced a single
> compiler error repo-wide; the couple-name lookup already filtered nulls and
> already fell back to "Verified couple". Expect the same for other rows — check
> before scoping.

> ## ✅ SLICE 2 IS BUILT — the completed-booking root (PR #4667, 2026-08-21)
>
> **Do NOT rebuild it.** `event_vendors.event_id` is nullable, and a BEFORE
> DELETE trigger detaches the bookings a supplier genuinely took part in.
>
> ⚖ **THIS SLICE IS WHERE "PRESERVING TOO MUCH" BECOMES THE REAL RISK** — the
> same table holds the couple's private shortlist. Preservation requires THREE
> conditions, each separately tested: a really-booked status
> (`BOOKED_VENDOR_STATUSES`, already exported by `lib/event-deletion-gate.ts`);
> **`marketplace_vendor_id`, NOT `linked_vendor_profile_id`** (the couple's own
> action can stamp the latter, so keying on it lets a couple plant a permanent
> "booking" on any supplier); and **not self-dealt**.
>
> 🚨 **"STORED DOES NOT MEAN SURVIVES" BIT AGAIN, IN A NEW COSTUME — AND IT WILL
> BIT EVERY REMAINING SLICE.** Preserving the row was NOT enough:
> `vendor_completed_events` reads `event_type`/`event_date` **from the event**
> and INNER JOINs it, so an orphaned booking dropped out of the view and the
> count still fell to zero. **Before building any row below, read the VIEW that
> publishes it — if it joins `events`, preserving the row is theatre.** The row
> now carries its own snapshot and the view LEFT JOINs.
>
> 🚨 **AND THE NAIVE FIX CREATES A FRAUD VECTOR.** The view's self-dealing
> exclusions read `event_members`, which **CASCADES** — once the event is gone
> they cannot run and pass permissively, so deleting the event would LAUNDER a
> vendor's own self-booked job into the public count forever. **Any guard that
> reads a cascading table must be evaluated AT DELETION TIME.** Assume other
> rows below have the same shape.
>
> 🔑 **A SECURITY DEFINER FUNCTION IS EXECUTABLE BY PUBLIC BY DEFAULT** —
> `anon-rpc-surface.db.test.ts` flagged the new trigger function for existing.
> A trigger function needs no EXECUTE grant. **Write the REVOKE in the same
> migration for every remaining slice.**
>
> ⚠ **A COLUMN-LEVEL REVOKE IS INERT HERE** — `authenticated` holds table-level
> UPDATE on `event_vendors`. The new snapshot columns are writable; the controls
> are that the trigger OVERWRITES anything pre-written (asserted by test) and
> that an orphaned row is unreachable through all four RLS policies, which key
> on `event_id`.

> ## ✅ SLICE 3 IS BUILT — `vendor_contracts` (PR #4670, 2026-08-21)
>
> **Do NOT rebuild it.** `event_id` nullable + SET NULL, and the client's name is
> stamped at deletion so the supplier's paperwork still names who they signed
> with. **No status test** — unlike `event_vendors`, the supplier authored every
> row (drafts included), so all of them survive. **Do not copy slice 2's three
> conditions onto a table that holds no couple planning; that is cargo.**
>
> 🚨 **THE SAME TRAP, IN ITS OTHER COSTUME — EXPECT BOTH SHAPES ON EVERY ROW
> BELOW.** In slice 2 the preserved row **VANISHED** (the view INNER JOINed the
> event). Here it survives and goes **ANONYMOUS** (the list falls back to the
> literal `'Unknown event'`). **One question finds both: WHAT ELSE READS THE
> EVENT? Read the surface, not just the table.**

> ## ✅ SLICE 4 IS BUILT — the money (PR #4672, 2026-08-21)
>
> **Do NOT rebuild it.** Supplier receipts, and the fees a supplier owes
> Setnayan, now outlive the celebration. The receipt keeps `amount_php`,
> `paid_at`, `schedule_instance_seq`, `vendor_confirmed_at`; `method`,
> `reference`, `notes` and `proof_r2_key` are **scrubbed** — the couple's rail,
> reference, private note and a photograph of their bank screen. An
> **unconfirmed** payment leaves: it is the couple's claim to have paid, not the
> supplier's record of being paid.
>
> 🚨 **IT ALSO FIXES A DEFECT SLICE 2 SHIPPED, AND THE LESSON GENERALISES TO
> EVERY REMAINING SLICE.** `event_vendor_payments` has a **COMPOSITE** FK
> `(event_id, vendor_id) → event_vendors(event_id, vendor_id)` with **no
> `ON UPDATE` clause**. Slice 2's preserve is an **UPDATE of a referenced
> column**, so it was REFUSED — and inside a `BEFORE DELETE` trigger that took
> the entire deletion with it: **the couple could never delete their celebration
> again.** Not a silent wrong answer, a hard failure.
>
> 🔑 **AN FK'S `ON DELETE` RULE SAYS NOTHING ABOUT UPDATES. Before nulling any
> referenced column in a later slice, list the children whose FK SPANS it** —
> `pg_constraint` with more than one column in `conkey`. Reproduce in the replay
> first; this one was.
>
> ⚠ **HALF A WIN, NAMED:** `booking_fee_charges_anchor_ck` requires
> `proposal_id` OR `event_vendor_id` and both still cascade. A charge anchored on
> `event_vendor_id` survives (slice 2); one anchored on `proposal_id`
> (`source='send'`) still dies with `vendor_proposals` — **that is the next
> slice.**

> ## ✅ SLICE 5 IS BUILT — `vendor_proposals` (PR #4677, 2026-08-21)
>
> **Do NOT rebuild it.** A quote the supplier wrote survives, with **no status
> test** (same reasoning as contracts: they authored it, drafts included).
>
> ✅ **AND IT CLOSES THE QUOTE-STAGE FEE GAP SLICE 4 NAMED.** `proposal_id` was
> the other anchor of `booking_fee_charges_anchor_ck`; with it surviving, a fee
> raised at `source='send'` no longer disappears. A test asserts the surviving
> charge still satisfies its CHECK **and can still be marked paid** — a charge
> nothing can update is a tombstone, not a preserved debt.
>
> ✅ **THE SLICE-4 TRAP WAS CHECKED FIRST HERE, AND WAS ABSENT** — every child FK
> pointing at `vendor_proposals` is single-column. **That check is now the first
> step of every remaining slice.**
>
> 🔑 **THE "WHAT ELSE READS THE EVENT?" TRAP HAS NOW WORN THREE COSTUMES.**
> Slice 2: the row **VANISHES** (view inner-joined the event). Slice 3: it
> **GOES ANONYMOUS** (list fell back to "Unknown event"). Slice 5: it **BUILDS A
> BROKEN URL** (`/dashboard/null/vendors`). **Assume a fourth. One question finds
> them all — and it is a question about the SURFACE, not the table.**
>
> ⚠ And the anonymity trap genuinely did NOT apply here (the proposal carries its
> own rendered snapshot), so **no snapshot column was added out of symmetry with
> slice 3.** Measure before copying the previous slice's shape.

> ## ✅ SLICE 6 IS BUILT — amendments & change orders (PR #4682, 2026-08-21)
>
> **Do NOT rebuild it.** `proposal_amendments`, `proposal_amendment_items` and
> `vendor_change_orders` now survive.
>
> 🚨 **A NEW FAILURE SHAPE, AND IT IS THE WORST ONE YET: NOT A MISSING RECORD, A
> MISLEADING ONE.** Slices 3 and 5 made the contract and the quote survive — but
> the things that CHANGE those terms still cascaded, so a supplier kept a quote
> stating the ORIGINAL price with no record of the agreed discount, **and reads
> it as fact.** When you preserve a record, ask what AMENDS it.
>
> ⚠ **AND THE PARENT ALONE WAS NOT ENOUGH.** `proposal_amendments` holds the note
> and status; **every amount lives one table down** in
> `proposal_amendment_items.amount_php`. Preserving only the parent leaves an
> amendment that says "accepted" and cannot say WHAT — the same misleading-record
> failure reproduced inside the fix. **Check whether the money is in a child
> table before calling a preserve done.**
>
> ⚖ **No status test** — the amendment state machine starts at `'proposed'`,
> which means SENT, so there is no draft the supplier never saw and a DECLINED
> request survives as part of a negotiation both sides were in.

> ## ✅✅ ALL SIX SLICES ARE **LIVE IN PRODUCTION** — verified 2026-08-21 BY THE OBJECT
>
> Not by `schema_migrations`, not by the merge, not by the deployed commit —
> by querying `pg_constraint` / `pg_attribute` in the live database. **Ten checks,
> all true:** reviews · completed jobs · signed contracts (+ the client-name
> stamp) · payments (and the delete no longer blocked) · fees owed to Setnayan ·
> quotes · agreed changes · **the agreed amounts** · change orders.
>
> 🔑 **A DEPLOYED COMMIT IS NOT AN APPLIED MIGRATION.** Prod served a build
> containing both final merges for several minutes before this check was run;
> the check is what makes it a fact. This repo has been bitten by deploys that
> silently stopped migrating — always re-read the object.

**Status: SLICES 1–6 BUILT (reviews · the completed-booking root · contracts · the money · quotes · amendments) · THE REST MAPPED, NOT BUILT.**

⏭ **RE-MEASURED 2026-08-21 after slice 5.** 38 tables still cascade from `events`
AND carry a vendor id — but **most are working state for a LIVE event**, not
records a supplier keeps: access grants, day-of reservations, crew devices,
scheduling suggestions, preparation items. **Do not sweep them in bulk; apply the
owner's test row by row.** The genuinely open candidates:
`vendor_client_notes` (the supplier's own CRM notes — ⚠ raises a question the
earlier slices did not: a supplier retaining private notes ABOUT a person who
deleted their event; decide it deliberately rather than by symmetry) ·
`booking_handovers` (the photographer's gallery link) · `vendor_guest_deliveries`
· `vendor_spotlight_awards` · `vendor_review_flags`.
⚠ **`chat_threads` carries `agreed_price_centavos`, the frozen final total, and
still cascades** — the amendment ITEMS now survive so the figure is derivable,
but the frozen number itself does not. Whether the conversation survives is a
product call, not an engineering one.

⏭ **RE-MEASURED 2026-08-21 against prod, not read off this doc.** Of the vendor-
side tables, **five already survived before any of this work** —
`guest_saved_vendors.source_event_id`, `vendor_profile_views`,
`vendor_date_waitlist`, `vendor_reuse_requests.source_event_id` — so **check the
FK before scoping any row here; several entries below may already be closed.**
⏭ **The clear next targets, both named by the owner and both unblocked by slice
2:** `event_vendor_payments` (its blocker was *"no `vendor_profile_id` column —
attribution runs through `event_vendors`"*, which now survives) and
`booking_fee_charges` + `booking_fee_ledger` — **money Setnayan is owed**, which
today disappears when a couple deletes their event. ⚠ `booking_fee_charges` has
a CHECK requiring `event_vendor_id` or `proposal_id` to be non-null and both
cascade; slice 2 makes the first survive for booked rows, so **re-test that
constraint rather than assuming it still blocks.**

⏭ **Slice 2 changes what is left.** `vendor_activity_stats`,
`vendor_completed_events`, `vendor_public_completed_events_stats` and
`vendor_track_record_by_event_type` are **all derived from `event_vendors`** —
the doc's own note says *"there is no independent record of a completed booking
anywhere in the schema"*. With the root preserved, **re-measure each of those
before scoping it**; several may now be satisfied, and the remaining question for
each is whether its VIEW joins `events` (see the trap above), not whether it
stores anything. This is the classification behind build #1. It was
produced by a 71-agent pass over the schema and the reading code; **40 agents
finished and 31 were cut off by an account session limit**, so the per-item
adversarial check is INCOMPLETE and the final synthesis never ran. What is below is
the classification phase, recovered from the run's journal. **Treat every row as
mapped-but-unverified and re-check before acting on it.**

## The problem, measured in production 2026-08-21

- **152 foreign keys to `events` CASCADE.** Only **10** are `SET NULL` and survive.
- ~~**`vendor_reviews.event_id` is `NOT NULL` and CASCADEs**~~ — ✅ **FIXED, PR #4665.**
  Re-measured 2026-08-21: 153 cascade / 11 survive (the doc's 152/10 was one
  migration stale before this one landed).
- Prod: 0 reviews · 13 booked `event_vendors` · 3 `event_vendor_payments` ·
  0 contracts · 0 booking-fee charges · 7 events. **The harm is latent, not live** —
  which makes now the cheap moment to fix it.

## 🔑 The two expensive errors, in both directions

1. **Calling something the vendor's when it is the couple's private planning** that
   merely mentions a supplier — their budget, their shortlist, who they considered
   and rejected. Preserving those **leaks the couple's planning to a supplier** and
   breaks the rule in the opposite direction.
2. **Destroying a supplier's business record** because it happens to be keyed on an
   event — reviews, completed-booking counts, earnings, money owed to Setnayan.

## 🚨 The finding that matters most: STORED DOES NOT MEAN SURVIVES

`vendor_activity_stats` holds the correct pre-delete numbers — **right up until any
unrelated event triggers a recompute.** A reply in a *different* couple's chat
thread, or any booking status change, silently rewrites them from the (now smaller)
live tables. A snapshot that anything can recompute is not a snapshot.

And the **verified median has a cliff edge**: below three qualifying locks the public
"typical price" card does not degrade — it **disappears entirely**. A supplier
sitting on exactly 3 or 4 locks loses their whole published price signal the moment a
couple deletes one celebration.

## ⚖ Where the owner's two sentences collide

**14 tables are SHARED** — both parties have a real claim (signed contracts, records
of the couple paying the supplier). *"Only data from the user gets lost"* and
*"vendor data stays"* both reach for these.

## ✅ OWNER RULING, 2026-08-21: **"vendors get to keep it."**

**Every SHARED row resolves to the VENDOR.** A signed contract, a record of a
deposit the couple paid, a completed booking — the supplier keeps their copy when a
couple deletes the celebration. Do not re-ask this.

⚠ **What that does NOT license.** The ruling settles rows where the supplier has a
genuine claim — a deal you both made. It does **not** convert the couple's private
planning into vendor data. The 15 COUPLE rows below still go: their budget, their
shortlist, who they considered and rejected, their private notes. Preserving those
would hand a supplier the couple's planning, which is a different harm and not what
the owner ruled on.

🔑 **The practical test:** did the supplier take part in it? A contract they signed,
a payment they received, a job they completed — theirs, kept. A note the couple
wrote *about* them, a shortlist they never knew they were on — the couple's, gone.

---

## VENDOR — must survive (20)

### `event_vendors.total_cost_php (the verified median)`
- **survives today:** no — cascades away
- **read by:** The public 'typical price' card on the shop page — the vendor's own median of their locked bookings, the one price figure Setnayan publishes on their behalf.
- **fix:** Compute the median from the preserved supplier-side booking record instead of from the live event_vendors table.
- **blocker:** This is the cliff-edged one. Below three qualifying locks the card does not degrade — it DISAPPEARS ('not_established', and the code says 'NEVER a number'). A supplier sitting on exactly 3 or 4 locks loses their entire published price signal the mome

### `guest_saved_vendors + vendor_follows`
- **survives today:** no — cascades away
- **read by:** The 'N saved' heart chip in the public shop-page hero (min-N floored at 3).
- **fix:** Already correct — no change needed. The only casualty is the 'saved at <wedding>' chip losing its label, which is right: the wedding is gone.
- **blocker:** None. Worth keeping in the register as the shape that works, so a future sweep does not 'tidy' the SET NULL into a CASCADE for consistency with its neighbours.

### `vendor_activity_stats`
- **survives today:** no — cascades away
- **read by:** quality_score is the MARKETPLACE SORT KEY on /explore (page.tsx:2612-2620), not just a displayed number. avg_response_minutes and last_active_at drive the public responsiveness and inactivity badges. The whole /vendor-da
- **fix:** Point the recompute at the preserved supplier-side records. Nothing about this table's shape needs to change — only its inputs.
- **blocker:** THE TRAP IN THIS SLICE: 'stored' does not mean 'survives'. The row holds the correct pre-delete numbers right up until any unrelated event triggers a recompute — a reply in a DIFFERENT couple's chat thread (lib/chat-send.ts:347), any booking status c

### `vendor_activity_stats (derived from event_vendors)`
- **survives today:** no — cascades away
- **read by:** /vendor-dashboard/performance:230 selects quality_score, booking_completion_rate_pct, inquiry_to_booking_pct, finalized_booking_count, review_count, avg_response_minutes; /explore:2344 reads finalized_booking_count for t
- **fix:** Nothing stored — it follows event_vendors. Named here because it is a CACHE, not a live read: the supplier's quality score, completion rate and conversion percentage do not move when the couple presses delete; they move at the next recompute, so the drop looks like an unrelated regression. If the su
- **blocker:** Wholly derived from event_vendors — there is no independent record of a completed booking anywhere in the schema. If the event_vendors row goes, the supplier's score has nothing to be rebuilt from.

### `vendor_client_notes`
- **survives today:** no — cascades away
- **read by:** The supplier's Customer Card in their own dashboard. Explicitly readable by nobody else, including Setnayan.
- **fix:** Sever, do not delete and do not keep whole: drop the NOT NULL on event_id and SET NULL it, so the supplier keeps their CRM history while the note stops being addressable as 'this person's file'. Whether the body itself may be retained is the owner's call, not engineering's.
- **blocker:** THIS IS THE TRAP IN THE OTHER DIRECTION AND IT IS WHERE THE OWNER RULE ACTUALLY BREAKS. It is unambiguously the vendor's business record, so 'vendor data stays' applies — but its SUBJECT is the couple, up to 2,000 characters written about a named per

### `vendor_completed_events (view) / vendor_track_record_by_event_type`
- **survives today:** no — cascades away
- **read by:** The dated Track Record block inside the public Reviews section on /v/[slug] ('Wedding, Jun 2026'), the venue-matched-events strip, and the whole /vendor-dashboard/track-record page plus the breakdown-by-event-type panel 
- **fix:** Same re-base. The view only needs event_type and event_date, both of which are cheap to copy onto the supplier-side record — no reference back to the live event is required.
- **blocker:** Nothing structural blocks this one; it is a plain view over two cascading tables. Worth noting the asymmetry it creates today: the dated list vanishes on the next page load, while the finished-jobs COUNT above it moves in the delete transaction — so 

### `vendor_completed_events / vendor_public_completed_events_stats`
- **survives today:** no — cascades away
- **read by:** The dated 'Track record' list and the public finished-jobs count on the shop page (app/v/[slug]/page.tsx:861 reads public_completed_count; lib/reviews.ts:587 fetchVendorCompletedEvents reads the view; lib/vendor-badges.t
- **fix:** Out of scope here, but the dependency must be stated: if event_vendors is not given the same treatment, a supplier ends up with a surviving 5-star review for a job that no longer appears in their completed-events count — the review says the wedding happened and the track record says it did not. The 
- **blocker:** Named to prevent a half-fix. Reviews alone is not a coherent deliverable; the review and the booking it attests to have to survive as a pair.

### `vendor_locked_qr_tokens`
- **survives today:** no — cascades away
- **read by:** /vendor-dashboard/locked-qr — "N pending · N claimed · N total", with total_php and initial_paid_php per token. Each row stands for a customer who already paid a downpayment.
- **fix:** Nothing to build — it already survives an event deletion intact, including total_php and initial_paid_php. This is the one table in the booking family that is correctly anchored to the supplier rather than to the event, and it is the shape the others should copy.
- **blocker:** None for the row itself. One leak to close as a by-product: source_contract_id REFERENCES vendor_contracts ON DELETE SET NULL (20270427844373:24-25), so fixing vendor_contracts also stops the surviving token losing its contract pointer.

### `vendor_profile_views`
- **survives today:** no — cascades away
- **read by:** The funnel's VIEWS stage and the whole views-by-source breakdown on /vendor-dashboard/performance.
- **fix:** Already correct — nothing to build. fetchViewsBySource (lib/vendor-funnel.ts:409-420) reads `source`, not event_id, so even the breakdown survives intact.
- **blocker:** It survives, and that is exactly what makes the damage LOOK like nothing happened. The funnel becomes internally incoherent rather than empty: 132 views → 0 inquiries → 0 quotes → 0 booked, on a supplier who really did book that couple. A vendor read

### `vendor_profiles.in_business_since_year / weddings_done_approx`
- **survives today:** no — cascades away
- **read by:** The 'N yrs in business · N+ weddings' chip in the shop-page hero, with the green DTI-verified tick when experience_verified_at is set.
- **fix:** Already correct — this is the vendor's own declaration on their own row and no event delete can reach it.
- **blocker:** None, but it creates a misleading pair on the live page: after a delete the hero can read '8 yrs in business · 200+ weddings' (self-declared, intact) directly beside 'New to Setnayan' (derived, just zeroed). The declared half surviving is what will m

### `vendor_proposals`
- **survives today:** no — cascades away
- **read by:** Vendor-private: the funnel's QUOTES stage, quote acceptance rate, average time-to-quote, deal size, lead time, and 'quotes lost' on /vendor-dashboard/performance.
- **fix:** SET NULL. Unlike a chat thread, the proposal is a document the VENDOR authored about their own pricing, so the body is theirs to keep — but strip or pseudonymise the couple-identifying fields, since the customer is entitled to disappear from it.
- **blocker:** Nothing structural. Flagging it only because it is not obviously vendor-owned at a glance: it lives on the couple's event and is titled for their wedding, which is exactly the shape that gets mis-filed as couple data and deleted.

### `vendor_public_completed_events_stats`
- **survives today:** no — cascades away
- **read by:** The experience-tier badge in the shop-page hero ('Established' / 'Experienced' / 'Expert' / 'Elite') and the same chip on every explore card, plus the top-10% `most_booking` badge and the monthly Spotlight 'Most booked' 
- **fix:** Re-base the matview on the supplier-side booking record above, so the count is of jobs finished rather than of couples who still have an account.
- **blocker:** The tier ladder is a step function, so the loss is not proportional: at 11 finished jobs, deleting one wedding that carried a single booking moves the supplier from 'Experienced' to 'Established' on their own shop page and on every search card. At 51

### `vendor_public_completed_events_stats / vendor_completed_events`
- **survives today:** no — cascades away
- **read by:** The public shop page's experience badge (app/v/[slug]/page.tsx:862 `.select('public_completed_count')` feeding experienceTier -> "New to Setnayan / Established / Experienced / Expert / Elite") and the dated Track Record 
- **fix:** Nothing to store — both are derived and follow automatically once the booked event_vendors row and an events tombstone survive. This entry exists to fix the shape of the remedy: a nullable event_id alone leaves both relations reading ZERO, because each one asks whether the events row still exists.
- **blocker:** The EXISTS(events) predicate and the JOIN events. Also both are MATERIALIZED with no cron — 20271143376954:31-32 says they are "refreshed by hand from the admin fraud screen" — so the supplier's public number does not fall at deletion time but at the

### `vendor_review_flags`
- **survives today:** no — cascades away
- **read by:** The HQ fake-review queue at app/admin/reviews/page.tsx:207 (`.eq('status','pending')`), fed by the vendor's own 'flag this review as fake' control (app/vendor-dashboard/reviews/actions.ts:88 submitFlagAsFake → lib/review
- **fix:** Nothing to write. Fixing vendor_reviews.event_id fixes this for free — the flag hangs off review_id, which stops disappearing. Worth one assertion in the db test: delete an event that has a flagged review and prove the pending flag is still in the admin queue afterwards.
- **blocker:** A moderation decision in flight is destroyed by a person with no standing in it. Filed as VENDOR because the flag is the supplier's own accusation about their own reputation — it is not the couple's record and the couple cannot see it.

### `vendor_review_stats`
- **survives today:** no — cascades away
- **read by:** The per-star histogram bars beside the headline (app/v/[slug]/page.tsx:3482 → ReviewHeroMetrics :3547-3553) and the 'load more' arithmetic at :973 (`reviewStats.total_count > reviews.length`). Also the vendor's own pages
- **fix:** No change needed to the view itself — it survives for free the moment vendor_reviews.event_id stops cascading. It is the CONTROL that proves the fix: after the migration, histogram counts and trusted count must agree.
- **blocker:** Named because it creates a visible contradiction if only half the work is done: with a nullable event_id but an unfixed trusted view, the same card shows '— / 0 reviews' in the hero while the histogram beside it still draws two 5-star bars and the li

### `vendor_reviews`
- **survives today:** no — cascades away
- **read by:** Public shop page review card (apps/web/app/v/[slug]/page.tsx:3595-3660 — stars, author, provenance pill, body, 4 axis stats, vendor reply); vendor's own Reviews page (app/vendor-dashboard/reviews/page.tsx:204); My Shop p
- **fix:** ALTER TABLE public.vendor_reviews ALTER COLUMN event_id DROP NOT NULL; then DROP the FK and re-ADD it as `REFERENCES public.events(event_id) ON DELETE SET NULL`. Add `source_event_removed_at TIMESTAMPTZ` stamped by the existing BEFORE DELETE trigger so an orphaned review is distinguishable from a ne
- **blocker:** NOT NULL + ON DELETE CASCADE. This is the headline violation: a couple tidying their own list destroys another business's public verdict outright.

### `vendor_reviews.booked_through_setnayan / via_vendor_import`
- **survives today:** no — cascades away
- **read by:** The 'Verified wedding' / 'Verified booking' pills on the public review card (app/v/[slug]/page.tsx:3626-3631, pill components at :3670 and :3688); public API app/api/v1/vendor/reviews/route.ts:64. booked_through_setnayan
- **fix:** Add one guard as the first statement of public.stamp_review_provenance(): `IF NEW.event_id IS NULL THEN RETURN NEW; END IF;` — an orphaned review's receipt is FROZEN at what it was proven to be, never re-derived from an absence. Verified: with the guard, both columns stay TRUE through the delete.
- **blocker:** This is the trap that makes the obvious fix look like it works. Nullable event_id ALONE preserves the review ROW while silently stripping its receipt — the rows survive, the record does not.

### `vendor_spotlight_awards`
- **survives today:** no — cascades away
- **read by:** The monthly 'Top Pick' / 'Most booked' recognition shown on the vendor's profile and the homepage feature slot.
- **fix:** Already correct, and this is the PRECEDENT the other twelve should copy: the badge criteria are computed from cascading tables, but the VERDICT is snapshotted onto a row keyed only on the vendor, so the award outlives its inputs.
- **blocker:** None for the award already won. But every future award is decided by fetchCompletedBookingCounts and vendor_trusted_review_stats (lib/spotlight-awards.ts:219-224, :296) — both of which a deleted event has just reduced. So the supplier keeps the medal

### `vendor_trusted_review_stats`
- **survives today:** no — cascades away
- **read by:** THE public headline score. app/v/[slug]/page.tsx:2102/2106 (hero '4.8 · 12 reviews'), :2890-2894 (sticky bar), :3543 (ReviewHeroMetrics big number), and :1713-1714 — the schema.org AggregateRating ratingValue/reviewCount
- **fix:** DROP + CREATE the matview replacing the positive EXISTS with `(vr.event_id IS NULL OR EXISTS (SELECT 1 FROM public.events e WHERE e.event_id = vr.event_id))`. The five NOT EXISTS self-dealing exclusions can stay byte-for-byte — they degrade correctly, matching nothing when event_id is NULL. Verified
- **blocker:** Two independent mechanisms each zero the score, so fixing only one still moves it. Deleting an event today silently lowers a supplier's advertised star average AND removes their rich-snippet rating from Google — an external consequence Setnayan canno

### `vendor_trusted_review_stats (and vendor_review_stats)`
- **survives today:** no — cascades away
- **read by:** THE headline public rating. fetchTrustedReviewStats backs the hero chip, the JSON-LD aggregateRating, the explore card, the `couple_trusted` badge (>=10 reviews AND >=4.7 avg) and the `top_pick` top-5% score. vendor_revi
- **fix:** Drop the events-EXISTS predicate and replace it with the snapshotted arm's-length flag from the review row. The matview keys only on vendor_profile_id, so nothing else about it needs to move.
- **blocker:** That migration states 'the three matviews have no cron — they are refreshed by hand from the admin fraud screen, so a supplier's public numbers only move when an operator refreshes.' THAT IS WRONG, and it is the sentence someone will rely on to call 


## SHARED — owner must rule (10)

### `booking_handovers`
- **survives today:** no — cascades away
- **read by:** Vendor overview's disputed-deliverables list (apps/web/lib/vendor-overview.ts:634 `.from('booking_handovers').eq('vendor_profile_id', vendorProfileId).eq('status','disputed')`), /vendor-dashboard/on-the-day:271, and /ven
- **fix:** Keep handover_id, vendor_profile_id, kind, delivered_at, couple_acknowledged_at, status. An acknowledged signoff is the supplier's only proof the job was accepted; a `disputed` row is live evidence in a disagreement. STRIP `payload` and `label` — payload is the couple's private gallery URL / R2 file
- **blocker:** event_id NOT NULL + CASCADE. Separately, a DISPUTED handover does not by itself stop the deletion: apps/web/app/dashboard/[eventId]/delete-actions.ts:335 `if (!paid) return false;` runs BEFORE the dispute check in supplierIsReleased, so a supplier wh

### `chat_threads`
- **survives today:** no — cascades away
- **read by:** PUBLIC: the 'Usually responds in Xh' badge on every explore card and the low-activity warning. VENDOR: response rate, median reply time, the funnel's INQUIRIES stage, inquiry-to-booking %, win-rate, quotes-lost, and the 
- **fix:** Preserve the TIMING FACTS ONLY — thread opened at, vendor first replied at, outcome (accepted / declined) — as a supplier-side counter row with no FK to events. The messages themselves are the couple's and should go with the event.
- **blocker:** THIS IS THE ONE MOST LIKELY TO BE GOT WRONG IN BOTH DIRECTIONS AT ONCE. Sparing the whole table to save the response-rate statistic would preserve the couple's private negotiation — their budget, their guest count, what they said about other supplier

### `chat_threads + chat_messages`
- **survives today:** no — cascades away
- **read by:** Couple inbox and /vendor-dashboard/messages. Derived: the supplier's response_rate_pct and avg_response_minutes on /vendor-dashboard/performance (page.tsx:228) and the public marketplace quality signal on /explore (page.
- **fix:** FREEZE THE NUMBER, NOT THE WORDS. vendor_activity_stats is vendor-keyed and physically survives (20270110320014_vendor_activity_stats.sql — PK REFERENCES vendor_profiles), but it is a recomputed CACHE: apps/web/lib/vendor-activity.ts:276-283 recomputes response_rate_pct and avg_response_minutes by r
- **blocker:** This is the only place where destroying couple content moves a number on a PUBLIC page. Both halves are real and they conflict: the transcript is the supplier's only defence in a money dispute, and it is also a private two-party conversation the coup

### `event_vendor_payment_plan`
- **survives today:** no — cascades away
- **read by:** /vendor-dashboard/customers?tab=payday — the supplier's entire Payday cash-flow calendar ("received vs owed", per-installment stepper). app/vendor-dashboard/customers/page.tsx:160 `supabase.rpc('vendor_payday_installment
- **fix:** Keep plan_id, instances_json, cleared_at with an explicit vendor attribution. Note event_vendor_id is deliberately NOT foreign-keyed (:70-72 "Not FK'd to keep this additive"), so this table already survives the event_vendors row dying — only the events FK kills it. It needs a vendor_profile_id of it
- **blocker:** event_id NOT NULL + CASCADE, and UNIQUE (event_id, event_vendor_id) — nulling event_id makes that key meaningless. The RPC also selects event_name/event_date from events, so the Payday rows would render nameless without a tombstone.

### `event_vendor_payments`
- **survives today:** no — cascades away
- **read by:** The supplier's thread payment card ("Confirm received") at app/vendor-dashboard/messages/[threadId]/pay-confirm-actions.ts and the `confirmed` flag on every Payday installment.
- **fix:** Keep only rows the supplier confirmed (vendor_confirmed_at IS NOT NULL): amount_php, paid_at, schedule_instance_seq, vendor_confirmed_at. That is the supplier's record of money actually received. DROP method, reference and notes — those are the couple's own bank rail, transfer reference and private 
- **blocker:** Two NOT NULL cascading FKs, and there is NO vendor_profile_id column on the table at all — attribution runs only through vendor_id -> event_vendors.marketplace_vendor_id, so a surviving payment cannot be tied to a supplier unless event_vendors surviv

### `event_vendor_policy_acknowledgements`
- **survives today:** no — cascades away
- **read by:** The admin dispute surface — the migration denormalises vendor_profile_id specifically "so the admin dispute surface can join evidence by vendor_profile_id in a single lookup".
- **fix:** Copy the snapshot into a vendor-keyed evidence row at delete time, or sever event_id to NULL keeping vendor_profile_id + acknowledged_at. The couple's identity can go; the fact that SOMEONE accepted these terms on this date must not.
- **blocker:** I will not claim this as couple-only even though it lives on the couple's event and records the couple's act — it is the supplier's ONLY proof that a non-refundable downpayment was accepted. And the money gate does not protect it: apps/web/lib/event-

### `event_vendors`
- **survives today:** no — cascades away
- **read by:** Public shop page /v/[slug] and the bare-root /{slug}: the "Established / Experienced / Expert / Elite" experience badge, the "typical price" band, and the dated Track Record list. Vendor-side: /vendor-dashboard/performan
- **fix:** Split the row, do not preserve it whole. SURVIVES only when status is contracted/deposit_paid/delivered/complete AND the row carries a real marketplace supplier (marketplace_vendor_id or linked_vendor_profile_id): keep status, category, total_cost_php, linked_vendor_profile_id, marketplace_vendor_id
- **blocker:** event_id is NOT NULL, so nothing survives without dropping NOT NULL or moving the row to an archive table. AND A NULLABLE FK ALONE IS NOT ENOUGH: all three public relations JOIN events for event_type/event_date and gate on `EXISTS (SELECT 1 FROM publ

### `events.display_name (review attribution)`
- **survives today:** n/a
- **read by:** The author line on every public review card — app/v/[slug]/page.tsx:3608-3610, vendor-dashboard/reviews/page.tsx:204-206, vendor-marketplace-info.tsx:638-640. All three already fall back to the literal string 'Verified c
- **fix:** Deliberately do NOT snapshot it onto the review row. Let it fall to 'Verified couple'. The precedent is already in this codebase for this exact table: lib/erasure/coverage.ts:508-510 rules that on account erasure `couple_user_id` is nulled because 'deleting it would silently move a vendor's public s
- **blocker:** This is the one genuinely shared field and it is a judgement call, not an engineering one. Preserving the name keeps the review maximally credible; dropping it honours 'only data from the user gets lost'. The cost of dropping it is cosmetic — the sta

### `vendor_contracts`
- **survives today:** no — cascades away
- **read by:** /vendor-dashboard/contracts — the supplier's own list of every contract they authored (app/vendor-dashboard/contracts/surface.tsx:21 `fetchVendorContracts(supabase, profile.vendor_profile_id)`, which filters on vendor_pr
- **fix:** The row is already keyed on vendor_profile_id, so ONLY event_id blocks it. Make event_id nullable and let the couple's deletion null it, keeping the whole contract row. Keep an events tombstone for the client name: the surface joins events for display_name (surface.tsx:27-31) and its own comment war
- **blocker:** event_id NOT NULL + CASCADE. Second-order: vendor_locked_qr_tokens.source_contract_id REFERENCES vendor_contracts ON DELETE SET NULL (20270427844373:24-25), so the supplier's surviving Locked QR silently loses its contract pointer when the contract c

### `vendor_recommendations`
- **survives today:** no — cascades away
- **read by:** PUBLIC. `vendor_recommendations_public_read ... USING (TRUE)` — the marketplace 'recommended by N couples' signal and the couple-editorial 'vendors we loved' block.
- **fix:** Exactly the guest_saved_vendors precedent already in the tree: 20270226218747_guest_saved_vendors.sql:18 `source_event_id uuid REFERENCES public.events(event_id) ON DELETE SET NULL` — the row lives, the event pointer dies. Keep vendor_profile_id, endorsement and created_at; null event_id and recomme
- **blocker:** I am NOT claiming this as the couple's, and I am flagging it because no register names it. It is the SECOND public supplier endorsement the delete silently removes — structurally identical to vendor_reviews, which is the acknowledged headline violati


## SETNAYAN — our own record (13)

### `booking_fee_charges`
- **survives today:** no — cascades away
- **read by:** /admin/booking-fees — the only screen in the product that lists who owes Setnayan a booking fee (apps/web/app/admin/booking-fees/page.tsx:59 `.from('booking_fee_charges')` filtered `.eq('status','pending')`). Its own doc
- **fix:** Change the FK to `ON DELETE SET NULL` (event_id must drop NOT NULL) and have sever_event_connections() stamp the event's name/date onto the charge before the delete, the same way it stamps orders.admin_notes today. The charge already carries vendor_profile_id, amounts, schedule_version and public_id
- **blocker:** event_vendor_id and proposal_id also CASCADE (20270927120000:77 and 20270916909942:71), and `booking_fee_charges_anchor_ck` requires at least one of them to be non-null. Nulling both on an event delete would violate the CHECK, so that constraint has 

### `booking_fee_charges (kind = 'amendment_credit')`
- **survives today:** no — cascades away
- **read by:** None found — I grepped every `.from('booking_fee_charges')` in apps/web and the admin page filters `.eq('status','pending')`, which an audit-only credit row never is. So this record has no reader today at all.
- **fix:** Survives automatically once the parent table survives (item 1). But it also needs a reader: an operator settling goodwill off-platform has no screen telling them a credit exists.
- **blocker:** This is money owed BY Setnayan TO the vendor, and the only record of it dies with the couple's event. It is the one row where the cascade favours us, which is exactly why nobody would notice it. Flagging the missing reader is a separate build, not pa

### `booking_fee_charges (the 'no_payer' path)`
- **survives today:** no — cascades away
- **read by:** Same /admin/booking-fees list — but this variant never gets an orders row, so it also never appears in /admin/payments.
- **fix:** Covered by item 1's SET NULL. Naming it separately because it is the case that proves the debt is NOT protected today.
- **blocker:** ⚠ CORRECTING THE OBVIOUS READ OF THE BRIEF: for the ordinary case the debt is already protected, by accident. collectBookingFeeAtLock writes a `payments` row (booking-fee-lock.server.ts:173-180) against an order carrying the couple's event_id, and de

### `booking_fee_ledger`
- **survives today:** no — cascades away
- **read by:** No screen reads it — verified: the only app-code mentions are two comments explaining why NOT to read it (apps/web/lib/vendor-addon-first5-free.ts:150, apps/web/app/vendor-dashboard/subscription/booth-addon-actions.ts:19
- **fix:** Same SET NULL treatment as the charges table. The ordinal is a COUNT over surviving rows, so survival is the whole fix — nothing else needs to change.
- **blocker:** 🚨 THIS IS THE SHARPEST MONEY DEFECT IN MY SLICE AND IT RUNS BACKWARDS FROM THE BRIEF. Deleting an event does not only erase a debt — it silently REFUNDS a vendor's free-5 allowance. Delete one event and the vendor's next booking is counted one rung l

### `event_action_log`
- **survives today:** n/a
- **read by:** /dashboard/[eventId]/hosts (apps/web/app/dashboard/[eventId]/hosts/page.tsx:141) and apps/web/lib/activity-attribution.ts:76 — who did what on this event.
- **fix:** Acceptable to destroy. Both readers are event-scoped screens that will not exist after the delete, and the log records the couple's own team acting on the couple's own event.
- **blocker:** Judgement call rather than a defect — but if a dispute ever turns on 'who cancelled this booking', this is the only place that answer lives, and it is gone. Worth an owner line rather than an engineering one.

### `events (via /admin/events → deleteEvent)`
- **survives today:** no — cascades away
- **read by:** apps/web/app/admin/events/actions.ts:60 — `const { error } = await admin.from('events').delete().eq('event_id', eventId);`
- **fix:** Either put the money gate in the database (a BEFORE DELETE RAISE when a paid/pending charge or a settled order exists) or give the admin path the same evidence read the couple path uses. The database is the right home for the same reason the address hold moved there.
- **blocker:** An admin delete destroys a PAID booking-fee charge and its frozen free-5 ordinal with no gate whatsoever — the couple-side protection described above does not exist here at all. It is also the path most likely to be used on a test or duplicate event,

### `force_majeure_flags`
- **survives today:** n/a
- **read by:** /admin/force-majeure and /admin/force-majeure/[flagId] (apps/web/app/admin/force-majeure/page.tsx:88, [flagId]/page.tsx:82) — a judgement queue the admin work list deliberately gives no fast button.
- **fix:** Acceptable to destroy — a force-majeure ruling is about whether THIS celebration may be moved or refunded, and it has no meaning once the celebration is gone.
- **blocker:** One caveat worth an owner line: if a flag is OPEN and a refund or a supplier concession was granted under it, the couple can delete the reasoning behind money that already moved. Prod has no such case (0 orders ever settled), so it is a rule to write

### `orders (service_key = 'vendor_booking_fee__{chargeId}')`
- **survives today:** no — cascades away
- **read by:** /admin/payments (the reconcile queue) and /admin/booking-fees, which joins to it by service_key (apps/web/app/admin/booking-fees/page.tsx:94-98).
- **fix:** Exclude vendor-payer bills from the cancel sweep — the trigger already has the discriminator it needs, since every booking-fee order's service_key starts `vendor_booking_fee__` (apps/web/lib/booking-fee-lock.server.ts, `bookingFeeLockServiceKey`). One extra `AND service_key NOT LIKE 'vendor_booking_
- **blocker:** The trigger's reasoning is sound for the case it was written for and simply does not cover this one: it assumes every order on an event was bought BY the couple FOR the event, and writes them a note reading 'the celebration this was bought for … was 

### `pax_change_audit · manual_payment_logs · slug_change_log · admin_audit_log`
- **survives today:** no — cascades away
- **read by:** /admin/pax-changes (apps/web/app/admin/pax-changes/page.tsx:59) and /admin/users/[userId]. All four survive an event delete today.
- **fix:** Already survives — and this is the recipe to copy for items 1, 2 and 10: a Setnayan record that mentions an event should HOLD the event id, not be OWNED by it. Every one of these keeps working with a dangling id; a joined name simply renders blank.
- **blocker:** Nothing to build — but say it explicitly so the next session does not 'tidy' these into proper foreign keys and destroy four durable audit trails in the name of referential integrity. What I could NOT confirm: the production value of NEXT_PUBLIC_BOOK

### `user_reports`
- **survives today:** no — cascades away
- **read by:** /admin/user-reports (apps/web/app/admin/user-reports/page.tsx:123) and the per-person admin dossier (apps/web/app/admin/users/[userId]/page.tsx:221, selecting `report_id, public_id, target_type, reason, status, reviewed_
- **fix:** SET NULL on event_id, with the event's display name copied into the report before the delete. Every other identity column in this table is already SET NULL, so the pattern is established inside the same migration.
- **blocker:** This is the record most worth protecting and the least obviously 'money': a report is evidence about a PERSON'S behaviour, not about the event. Deleting an event silently withdraws every abuse report filed on it — from the moderation queue and from t

### `vendor_event_unlocks`
- **survives today:** no — cascades away
- **read by:** Real readers exist despite the retired currency: apps/web/lib/inquiry-attribution.ts:146 (the returning-client signal, which searches this table across the couple's OTHER events), apps/web/app/(shell)/explore/page.tsx:23
- **fix:** SET NULL is wrong here because the UNIQUE key and every reader are keyed on event_id. Either keep the row with a `source_event_deleted_at` stamp and a retained event_id copied to a plain column, or accept the loss and say so.
- **blocker:** The consequence runs against the VENDOR, not against us: apps/web/lib/inquiry-attribution.ts:104-107 uses prior unlock rows on a DIFFERENT event to mark a couple as a returning client. Delete that earlier event and the vendor's returning customer rea

### `vendor_review_appeals`
- **survives today:** no — cascades away
- **read by:** app/admin/reviews/actions.ts:45-50 reads the appeal (including review_payload) to run overridePublishReview; the decided rows are the audit trail behind override_admin_id/override_reason shown in the flagged-reviews queu
- **fix:** Same shape as the review: `ALTER COLUMN event_id DROP NOT NULL` and re-point the FK at `ON DELETE SET NULL`. Keep event_vendor_id as-is (it is already an unconstrained UUID). A DECIDED appeal is Setnayan's own record of a judgement we made and must outlive the event it was about; a PENDING one is a 
- **blocker:** A couple can currently erase Setnayan's audit trail of its own moderation decisions as a side effect of tidying their events. Note the second-order effect: overridePublishReview inserts a vendor_reviews row using appeal.event_id, so with a NULL event

### `vendor_reviews (constraint + type consequences of going nullable)`
- **survives today:** no — cascades away
- **read by:** lib/reviews.ts:36 declares `event_id: string` on ReviewRow — non-nullable, which becomes a lie. Runtime callers are already null-safe: app/vendor-dashboard/reviews/actions.ts:69 does `relatedUrl: eventId ? ... : '/dashbo
- **fix:** Leave the UNIQUE as-is (no new review can be inserted against a deleted event anyway — the INSERT policy requires event_id IN current_couple_event_ids() and the FK would refuse it). Change ReviewRow.event_id to `string | null` in lib/reviews.ts and let typecheck find any caller that is not already g
- **blocker:** Nothing blocking; this is the residue the migration must not leave silent. A type that says string while the column says NULL is how a confidently-wrong reader is manufactured later.


## COUPLE — must still be destroyed (13)

### `budget_builds + budget_allocation_decisions + budget_category_flags`
- **survives today:** n/a
- **read by:** Couple: /dashboard/[eventId]/budget. Setnayan: /admin/budget-planner, service-role, AGGREGATE only. No vendor surface reads any of the three.
- **fix:** n/a. The market-intel aggregate loses one event out of the corpus, which is the correct price. If that matters, de-identify into a Layer-2 aggregate BEFORE the delete rather than retaining the Layer-1 rows.
- **blocker:** This is the record of what a couple sacrificed to afford something else — which category they cut, in what order, by how much. The ONLY thing a supplier is ever entitled to from it is a rounded, opt-in, live-only range: 20270508637171_customer_card_b

### `event_manual_vendors`
- **survives today:** n/a
- **read by:** The couple's own vendor list. Host-manage + admin-read policies only; no vendor read, because by construction these suppliers have no account.
- **fix:** n/a — and this one must be destroyed even more aggressively than it is today (see the media-sweep row: the photo orphans).
- **blocker:** THE MOST INDEFENSIBLE THING TO PRESERVE IN THE WHOLE SET. It is a private individual's mobile number and name, typed by a third party, for a business that never signed up to Setnayan and never consented to anything. Keeping it means Setnayan holds a 

### `event_vendor_line_items`
- **survives today:** n/a
- **read by:** None vendor-facing. Only the couple's own /dashboard/[eventId]/budget, lib/budget.ts, lib/preparation.ts, lib/upcoming-items.ts and the Setnayan AI snapshot. The supplier's thread SUBSCRIBES to it for Realtime (app/vendo
- **fix:** Destroy with the event. A vendor SELECT policy exists (event_vendor_line_items_vendor_read, 20270315091571) but it was added for Realtime delivery, not display — no vendor surface reads a value out of it. A policy is not a need.
- **blocker:** None — and note it would die anyway via vendor_id -> event_vendors CASCADE even if event_id were spared.

### `event_vendor_line_items + event_vendor_payments`
- **survives today:** n/a
- **read by:** Couple: /dashboard/[eventId]/budget. Vendor: a LIVE Accept card inside their own chat thread only (/vendor-dashboard/messages/[threadId]) — nothing archives these rows anywhere on the vendor side.
- **fix:** n/a. If the owner wants a supplier's earnings history to survive, it must be built as a vendor-keyed earnings row written at confirm time — not by preserving the couple's ledger. Preserving the source is not the same as preserving the number.
- **blocker:** These rows carry `notes`, `method` and `reference` on money Setnayan never touched, plus every milestone the couple PLANNED and did not pay — a forward schedule of what they still owe, per supplier. It reads like an earnings record and is not one: it

### `event_vendor_packages`
- **survives today:** n/a
- **read by:** Couple-only: /dashboard/[eventId]/vendors/packages and the workspace page. The single vendor-side read is a GUARD, not a display — app/vendor-dashboard/packages/actions.ts:440-444 counts bookings to refuse deleting a pac
- **fix:** Destroy. Preserving customizations_json would hand the supplier a list of what the couple removed from their package, which is private planning. The transaction value that matters (total_locked_centavos at lock) is already mirrored on the surviving event_vendors booking row as total_cost_php.
- **blocker:** None. One named consequence: deleting these rows drops the booking count to 0 and UNFREEZES a package the supplier had been refused permission to delete (actions.ts:444 `if ((count ?? 0) > 0) return { status: 'frozen' }`). Re-anchor that guard on eve

### `event_vendor_preferences`
- **survives today:** n/a
- **read by:** None today — the migration's own comment says the capture UI and the match-read are unbuilt, and vendor_service_attributes is empty in prod. It is designed to feed a couple-side sort, never a vendor-side read.
- **fix:** n/a.
- **blocker:** `attribute_payload` is documented with the example `{"dietary_accommodations":["halal"]}` — i.e. it can carry religious and medical inference about a household. It is named after a vendor concept and mirrors a vendor table, which is precisely why a p

### `event_vendor_working_notes`
- **survives today:** n/a
- **read by:** The couple's and the accepted coordinator's working folder on a booking. The 'coordinator_private' rows are not readable by the couple, and by no vendor in any state.
- **fix:** n/a — CASCADE is correct and must stay.
- **blocker:** This is the single most dangerous table in the whole question. It is 4,000 characters per row of candid assessment of a supplier — late, rude, overpriced, avoid — written by people who were promised the supplier would never see it. It mentions a vend

### `event_vendors (rows at 'considering' / 'shortlisted', incl. archived_by_lock_of losers)`
- **survives today:** n/a
- **read by:** Couple's vendor tracker at /dashboard/[eventId]/vendors ONLY. No vendor-facing surface reads a non-booked row: the supplier funnel is VIEWS→INQUIRIES→QUOTES→BOOKED with no shortlist stage (apps/web/lib/vendor-funnel.ts:1
- **fix:** n/a — keep the CASCADE exactly as it is. This is the row the counterweight exists to protect. If any preservation scheme is written by table name rather than by status, this is the row it will sweep up.
- **blocker:** 32 of prod's 45 rows are at a non-booked status and 44 of 45 carry no marketplace link at all — so most are a name a couple typed, attached to no supplier account that could ever be handed them. Preserving them publishes a verdict the couple never pu

### `guest_face_enrollments`
- **survives today:** n/a
- **read by:** Papic auto-tagging only, per-event-scoped, never reused across events. No vendor surface, no public surface.
- **fix:** n/a — this is the one row in the set where there is no argument to be had in either direction.
- **blocker:** Biometric templates are sensitive personal information under RA 10173. The consent was given for one event; when that event is gone the lawful basis is gone with it. NOTE THE SPLIT SUBSTRATE: the vector sits in Supabase Singapore and CASCADEs correct

### `guests + households + guest_groups + guest_columns + event_seat_assignments + event_tables`
- **survives today:** n/a
- **read by:** The couple's guest list and seat plan. A booked supplier only ever receives AGGREGATES via get_vendor_event_brief — its own comment (20270508637171:405) ends "Guest PII never crosses."
- **fix:** n/a. A supplier's headcount, if it must survive, is a NUMBER on their own booking record — never the list it was counted from.
- **blocker:** This is hundreds of named third parties with contact details, dietary needs, plus-ones, and a seating chart that records who was deliberately placed away from whom. None of these people are Setnayan users and none of them pressed delete. The couple's

### `papic_photos + the R2 objects behind event_manual_vendors, event_inspiration_assets, event_paperwork and payment proofs`
- **survives today:** n/a
- **read by:** The couple's gallery and their planning surfaces. The owner ruled on 2026-08-20 that a self-deleted event's photographs go too.
- **fix:** n/a — the opposite: this is the one place where the couple's data is under-destroyed rather than over-preserved.
- **blocker:** The rows cascade, the FILES do not. event_manual_vendors.photo_r2_key (a stranger's business photo), event_inspiration_assets, event_paperwork and payment-proof screenshots all survive in R2 with no row left to name them, so they can never be found o

### `vendor_proposals + event_vendor_packages`
- **survives today:** n/a
- **read by:** The couple's quote/manage screens. The supplier's own reusable asset is a DIFFERENT table that no event delete can reach.
- **fix:** n/a — and this is the cleanest case in the set, because the vendor already keeps their work. Nothing needs building.
- **blocker:** These read like the supplier's authored work and are the couple's instance of it: a frozen document containing the couple's names, date and headcount, plus a record of which line items they stripped out to afford the package — i.e. what they could no

### `vendor_reviews (couple-side private planning — the boundary check)`
- **survives today:** n/a
- **read by:** None on the vendor side. The couple's own review draft/edit surface is app/dashboard/[eventId]/vendors/[vendorId]/review/page.tsx; couple_user_id is never selected into any public read (REVIEW_COLUMNS includes it but no 
- **fix:** Keep the migration scoped to vendor_reviews, its two provenance columns, vendor_review_appeals and the trusted matview. Do not widen it to anything the couple authored privately. The one couple-owned field inside vendor_reviews — couple_user_id — should be nulled at event delete, mirroring the erasu
- **blocker:** No blocker; recorded as the explicit boundary so a later session does not read 'preserve the review' as licence to preserve the couple's planning context around it.

