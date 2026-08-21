# BUILD SPEC — the supplier answers · vendor data survives

> **Planned by Fable, ground against the repo by Opus skeptics** (owner's locked
> working model, 2026-07-15: *"can fable do the planning but opus will do the
> coding?"*). Produced 2026-08-21 against `origin/main` @ `23d5955cd`.
>
> ⚠ **The corrections are the valuable half.** Fable's plans cited surfaces that
> do not exist and assumed a database shape that would fail silently; the Opus
> pass caught them. Where a correction changed the plan it is marked 🔴.

# BUILD-READY SPEC â "the supplier answers" + "vendor data survives"

Ground truth: `/tmp/wt-plan` @ `23d5955cd`. Everything below marked â was read out of that worktree in this session. Prod row counts came from the brief and were **NOT measured by me** â see Part C.

---

## PART A â THE SUPPLIER ANSWERS

### A.1 The exact surface being extended, and the delta

**RULE 0 result:** `grep -rn "delete_request_state" apps/web` returns exactly three places â the couple's gate (`app/dashboard/[eventId]/delete-actions.ts:309,347`), the doc comment in `lib/event-deletion-gate.ts:154`, and the db test. â **No supplier-facing deletion UI ships. This is not a rebuild.**

The surface to extend is the vendor Overview's **"What's new" decision feed** â it already renders the identical shape (couple asks â supplier agrees inline, or declines with an optional reason folded behind a `<details>`).

| File | What exists | Delta |
|---|---|---|
| `apps/web/lib/vendor-overview.ts` | `fetchLockAgreementRequests` (541) â admin client, `.eq('marketplace_vendor_id', â¦)`, floors, ordered â | Add sibling `fetchDeletionRequests`; new `WhatsNewCard` kind |
| `apps/web/app/vendor-dashboard/_components/overview-sections.tsx` | `CARD_KIND` Record (54) exhaustive over the union; `LockRequestBody` (652) â | Add `delete_request` palette entry + `DeleteRequestBody` |
| `apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts` | `vendorAgreeToLock` (882) / `vendorDeclineLock` (978) â | Two thin siblings calling the shipped RPC |
| `apps/web/app/vendor-dashboard/page.tsx` | `VendorOverviewPage()` â **no `searchParams` prop at all** (91) â | Add the prop + one outcome-banner component |
| `apps/web/app/dashboard/[eventId]/delete-actions.ts` | `askSuppliersToAgree` (584) â calls the RPC, **tells no human**; `withdrawSupplierAsk` (626) â **zero callers repo-wide** â | Emit notifications; return an unreachable count |
| `apps/web/app/dashboard/(launcher)/_components/event-card-menu.tsx` | Ask button (317â325), `asked` state (81), waiting line (353â358) â | Per-supplier answer list; wire Withdraw |
| `apps/web/lib/notifications.ts` / `notification-emit.ts` | `lock_request_*` family â | Four new types â **see the two corrections below** |

Nothing in the database needs building for the handshake itself. `request_event_deletion(p_event_id)`, `vendor_answer_event_deletion(p_event_vendor_id, p_agree, p_reason)`, `cancel_event_deletion_request(p_event_id)` all exist in `20271151830396`, are `SECURITY DEFINER`, and are `GRANT EXECUTE â¦ TO authenticated`. â The answer RPC returns `{ok, state}` and **no `event_id`** â â read the event off the row by the authorized `vendor_id`, never from the form.

---

### ð´ CORRECTIONS THAT CHANGED THE PLAN â Part A

**A-C1 Â· The plan said "nothing in the database needs building." That is wrong, and the failure is silent.**
`notification_type` is a Postgres ENUM (`20260513160000_iteration_0028_notifications.sql:25`) â. Four TS-only union members make the `notifications` insert fail, and `emitNotification` only `console.error`s (`notification-emit.ts:232â237`) â â the supplier is told nothing and nothing throws.
**â Ship a migration in its own file with NO transaction**, copying `20271142676882_notification_type_lock_request.sql` exactly (its own header states the reason: Postgres forbids using a new enum value in the transaction that adds it) â:

```sql
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'deletion_request_received';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'deletion_request_nudge';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'deletion_request_agreed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'deletion_request_declined';
```
No `BEGIN`/`COMMIT`, nothing else in the file. Allocate the prefix with `pnpm migration:new` â.

**A-C2 Â· The plan said "mirror the lock family." Mirroring it copies a LIVE BUG.**
All six `lock_request_*` types sit in **both** `EMAIL_ENABLED_TYPES` (`notification-emit.ts:150â157`) **and** `MARKETING_GATED_EMAIL_TYPES` (`:182â189`) â with the *same comment pasted into both*, arguing they are transactional and must reach a supplier who never opens the app â. `users.marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE` (`20260513140000_iteration_0025_profile_settings.sql:25`) â, and the gate is `!MARKETING_GATED.has(type) || recipient?.marketing_opt_in === true` (`:250`) â. **Every one of those emails is suppressed by default.** `lock-request-notifications.test.ts` asserts email-set membership and never looks at the gated set (`:63â77`) â â which is why it shipped.
**â Add the four new types to `EMAIL_ENABLED_TYPES` ONLY. Delete the six lock types from `MARKETING_GATED_EMAIL_TYPES` in the same PR. New tests must assert NON-membership of the marketing set.**

**A-C3 Â· "Withdraw already exists and stays" is FALSE.**
`withdrawSupplierAsk` has zero callers â, while its own docblock reads *"ð SHIPS BESIDE THE ASK, AND IS CALLED"* and cites `cancel_vendor_lock_request` as the cautionary tale â. The couple can ask and cannot un-ask.
**â Build the Withdraw button into the same `asked !== null` block and correct that docblock.**

**A-C4 Â· The card would render with no event name and no date.**
`fetchEventMeta` is fed only `inquiryEventIds` + `bookingEventIds` (`vendor-overview.ts:196â198`), and `fetchLockAgreementRequests` runs in the **same `Promise.all`** as it (`:203â210`) â â so a lock-request event id can never reach the meta set. The shipped `lock_request` card already has this hole (`meta?.eventDate ?? null`, `:244`).
**â Run the deletion fetch BEFORE `fetchEventMeta` and union its event ids in. Fix the lock card's identical blind spot in the same commit.**

**A-C5 Â· The query must carry the lock feed's two floors.**
`fetchLockAgreementRequests` applies `.or('package_role.is.null,package_role.eq.anchor')` and `.is('archived_at', null)` (`:557â558`) â; `request_event_deletion` applies neither â. A covered cascade line or an archived booking can be marked `pending`.
**â Mirror both predicates in the fetch, and preferably add them to `request_event_deletion` so such a row is never marked pending at all.**

**A-C6 Â· `no_pending_request` does not mean "withdrawn".**
The RPC returns it for cancelled, agreed, declined **and** never-asked (`vendor_answer_event_deletion`, the `coalesce(v_state,'') <> 'pending'` branch) â. Mapping it all to "they withdrew" tells a double-tapping supplier a lie.
**â On `no_pending_request`, admin-read `delete_request_state` for that `vendor_id` and branch: `cancelled` â withdrawn; `agreed`/`declined` â "you've already answered this one"; anything else â the generic failure.**

**A-C7 Â· Do NOT flag-gate the fetch.** `fetchLockAgreementRequests` sits behind `isLockHandshakeEnabled()` â, so **the card being siblinged has never rendered in production.** Copy its shape; do not describe it as proven-in-prod. The deletion handshake is live, so the deletion fetch is ungated.

**A-C8 Â· The money line is an owner call, not an engineering one.** `vendor-overview.ts:530` states a vendor SELECT policy on `event_vendors` is deliberately not opened because it *"would hand suppliers the couple's whole booking row, budget figures included"* â. `deposit_paid_php` is the **couple's ledger figure** and may not match what the supplier banked.
**â Until the owner rules, use the no-amount wording for everyone (Part D).**

**A-C9 Â· I am correcting the skeptic.** Its item 15 says adding a sweep breaks *two* guards. Only **one** exists: `app/admin/admin-carries-the-cron-free-jobs.test.ts` has a 13-entry `JOBS` list plus an exact `after(` count assertion â. There is **no** `after(` count assertion in `vendor-rail-context.test.ts` and **no test file in the repo mentions `vendor-dashboard/layout` together with `after(`** â. Edit the admin guard; the vendor layout mount needs no guard edit.

---

### A.2 How the supplier notices, and what they read

**Arrival.** The moment the couple presses *Ask them to agree*, `askSuppliersToAgree` must â after the RPC returns ok â admin-read the now-`pending` rows, resolve each linked shop's owner (`vendor_profiles.user_id`, the same way the lock nudge does), and `emitNotification` per reachable supplier, best-effort. A notify failure never unwinds the ask.

It must return **two** numbers: `asked`, and `unreachable` (rows marked pending whose `marketplace_vendor_id` is NULL â nobody can answer those). An unreachable ask counted as sent is a lie.

**Notification + email (supplier):**
> **Title:** {Couple} is asking to remove their celebration
> **Body:** {Couple} has asked to remove {event name} from Setnayan. Their records show you've been paid for it, so it can't come down without your okay. Open your dashboard to agree, or to say it should stay.
> **relatedUrl:** `/vendor-dashboard` (where the forms are â the lock family's own precedent)

**The card** â in "What's new", amber `--sn-warn`, matching the shipped `lock_request` entry (a question, not an alarm; the news behind it may be sad, so no red):

> *Eyebrow:* **Removing a celebration â your call**
> **{Event name} â {short date}**
> asked {2 days ago} Â· their records show a payment to you
>
> The people behind this celebration have asked to take it off Setnayan. Because their records show you've been paid, it can't come down without your okay.
>
> If you'd rather it stayed for now, say so â nothing is removed, and they'll see your answer.
>
> **[ Agree â they can remove it ]** â dark ink, not `--sn-success`. Agreeing to erase a wedding is consent, not good news.
> â¸ *Need it to stay for now?* â `Tell them why â they'll see this (optional)` â **[ Keep it in place ]**

**ð THE SENTENCE THAT IS CUT.** Plan A's card promised *"nothing of yours goes with it â your reviews, your track record and your numbers stay with your shop."* **That is false today.** `vendor_reviews.event_id UUID NOT NULL â¦ ON DELETE CASCADE` (`20260514100000_vendor_reviews.sql:53`) â, and the supplier's own `event_vendors` row cascades with it. **If Part A ships before Part B, that sentence is REMOVED from the card, the banner, both emails and the nudge â not softened.** It is the sentence the supplier consents on.

**Palette.** Amber `--sn-warn` + `text-ink`. Never `text-terracotta` (that slot is gold `#A9834B`, 3.37:1 on cream). Use `text-mulberry` or `text-link` for any tinted text; check both themes on a tinted block.

**Secondary surface.** Mirror the ask as a banner strip on `/vendor-dashboard/clients/[eventId]`, so the question is answerable wherever the supplier actually is.

**Threading.** `WhatsNewFeed` and `FeedCard` take five explicit action props and `page.tsx` passes them (`:300â306`) â â two more go through both. `CARD_KIND` is an exhaustive `Record<WhatsNewCard['kind'], â¦>` â, so a missed palette entry is a typecheck failure. Lean on that. The form carries **only** `name="vendor_id"` (the shipped hidden-input name, and `event_vendors`' PK column) â.

---

### A.3 Withdraw Â· silence Â· after answering

**On withdraw (couple).** `cancel_event_deletion_request` flips only `pending` â `cancelled`; an answer already given is never erased â. A supplier pressing either button on a withdrawn ask reads: *"They've withdrawn this request â nothing is being removed, and nothing is needed from you."* This is a normal outcome, never an error state.

**On silence.** One reminder, at day 5, then the ask stays open forever. **No expiry and no auto-agree** â an unanswered consent question has no honest default; auto-releasing after N days manufactures consent.

**A-C10 Â· "one nudge, once" is impossible as written.** The lock nudge fires once only because `event_vendors.lock_request_nudged_at` exists, `nudge_stale_lock_requests` selects on `IS NULL`, and the guard trigger resets it on every transition into pending (`20271143289546:92â95, 225â229`) â. There is **no `delete_request_nudged_at`**, so a TS-only date-window sweep re-nudges every ~20h forever.
**â Two honest options. (a) Add `delete_request_nudged_at TIMESTAMPTZ` + a `nudge_stale_deletion_requests` RPC selecting `IS NULL`, reset it inside `request_event_deletion` beside the other cleared columns, and extend `guard_event_vendor_delete_handshake()` to forbid `authenticated`/`anon` writing it** â otherwise a couple can stamp "already nudged" and mute their own supplier's reminder, which is the exact hazard `lock_request_nudged_at`'s own comment records â. **(b) Ship with no nudge at all.** Do not ship a date-window nudge in TS.
If (a): mount via `after()` on `app/admin/layout.tsx` **and** `app/vendor-dashboard/layout.tsx` (both already mount `maybeRunLockRequestExpiry`, `:161` / `:284`) â, and add the job to `JOBS` in `admin-carries-the-cron-free-jobs.test.ts` in the same commit. `claimPeriodicJob` has a 5-minute in-memory pre-throttle â tests call the work body directly.

**After answering (supplier).** `?delete_ask=agreed|kept|withdrawn|error` on the redirect, rendered as a one-line banner.
**A-C11 Â· Step 6 is an ADDITION, not a read.** `VendorOverviewPage()` has no `searchParams` prop â â add it as a Next 15 `Promise<Record<string, string|string[]|undefined>>`. **And close the shipped silence beside it:** `vendorAgreeToLock` / `vendorDeclineLock` already redirect with `?lock_agree=` / `?lock_decline=` (`actions.ts:975, 1036`) â and **nothing renders them** â the "a refusal in silence is indistinguishable from a pass" family. Render all three flags in the one component.

**After answering (couple).** `deletion_request_agreed` / `deletion_request_declined` to every couple member, carrying the supplier's own words verbatim. A refusal the couple cannot read is a disappearance, not a refusal. The dialog's waiting state becomes a per-supplier list: *Waiting for their answer* / *Agreed* / *Asked to keep it: "{their words}"*, plus for `marketplace_vendor_id IS NULL` rows: *"{Name} isn't on Setnayan yet, so they can't answer here."*

**A-C12 Â· The disputed dead end.** `supplierIsReleased` returns `false` for `completion_status === 'disputed'` unless they agreed â. `request_event_deletion` has no disputed clause and skips any paid supplier where the event has passed **and** `status IN ('delivered','complete')` â. So a supplier who is `disputed` **and** `delivered` on a past event is counted as blocking and is never asked â `asked: 0` â the dialog says *"Everyone has already been asked â we're waiting on them"*, which is untrue.
**â Two fixes, both required.** Reconcile the predicate (add the disputed clause to the RPC so such a supplier IS asked), **and** make the dialog honest whenever `asked === 0 && unsettledPaidSuppliers > 0` â that combination means nobody could be asked and must say so. *I could not confirm that `completion_status='disputed'` co-occurs with `status='delivered'` on any real row; the messaging fix is correct regardless.*

---

## PART B â VENDOR DATA SURVIVES

Owner: *"only data from the user gets lost. But statistics and data for the vendor stays, including the reviews."* Today the product does the opposite.

### B.1 Migration sequence, in order

Allocate every prefix with `pnpm migration:new` â (forward allocation, UNIQUE rule, and the PGlite replay applies in filename order).

**Migration 1 â `a_review_outlives_its_celebration`** (one transaction)

```
severed_event_id      UUID          -- the dead event's id; plain column, NO FK
severed_event_type    TEXT
severed_event_date    DATE
severed_couple_label  TEXT          -- â ADDED BY CORRECTION B-C1
severed_at            TIMESTAMPTZ
severed_arms_length   BOOLEAN
CHECK (event_id IS NOT NULL OR severed_at IS NOT NULL)
ALTER COLUMN event_id DROP NOT NULL
DROP FK; re-ADD ... ON DELETE SET NULL
```
Order inside the transaction: drop-FK â drop-NOT-NULL â add-FK, so no window admits an orphan. Both the CHECK and the FK re-add **scan the table** â re-query the row count immediately before pushing.

Then **redefine `stamp_review_provenance()`**: on UPDATE, when `NEW.event_id IS NULL`, keep `OLD.booked_through_setnayan` and `OLD.via_vendor_import` verbatim. **This trap is real and verified:** the trigger fires `BEFORE INSERT OR UPDATE OF event_id, vendor_profile_id, booked_through_setnayan, via_vendor_import` (`20270330100000:108â112`) â, and an FK `SET NULL` *is* an UPDATE of `event_id` â so without the short-circuit, the "Verified wedding" pill is stripped off every surviving review at the exact moment the event dies. Newest definition is `20270330100000`; `20271116688263` only revokes helpers â.

**B-C2 Â· The plan cites a constraint dropped 18 months ago.** It says *"`UNIQUE (vendor_profile_id, event_id, couple_user_id)` needs no change."* `20270206186005:126â138` dropped exactly that and replaced it with `UNIQUE (vendor_profile_id, event_id)` â. The NULLS-DISTINCT conclusion still holds; the object named does not exist.

**Migration 2 â `vendor_booking_records`**

One privacy-minimal row per qualifying booking, written at delete time. Columns: `record_id` PK Â· `vendor_profile_id` FKâ`vendor_profiles` CASCADE Â· **both** `marketplace_vendor_id` **and** `linked_vendor_profile_id` (see B-C4) Â· `source_event_id` UUID no FK Â· `source_vendor_id` UUID no FK Â· `category` Â· `category_key` Â· `event_type` Â· `event_date` Â· `completed_at` Â· `status_at_severance` Â· `total_cost_php` Â· `excluded_from_market_median` Â· `voided_by_fraud` Â· `source` Â· `severed_at`.

**Nothing of the couple's**: no couple identity, no `display_name`, no notes, no contact, no deposit proof.

RLS ON at `CREATE TABLE`; policies = vendor team read own + admin all. Then **`REVOKE ALL FROM anon, authenticated` BEFORE granting** â this DB's `ALTER DEFAULT PRIVILEGES` hands write bits to new objects, the lesson `20271143376954:149â160` paid for â. Note that a **table-level REVOKE also drops column grants**.

**B-C3 Â· One arms-length function cannot serve both sides.** `vendor_completed_events`' self-comp clause is `(cg.order_id = ev.vendor_id OR EXISTS(â¦))` (`20271143376954:68`) â â it needs the `event_vendors` row id â while `vendor_trusted_review_stats` omits that disjunct entirely (`:129â141`) â.
**â Build two:** `vendor_booking_is_arms_length(p_event_id, p_vendor_profile_id, p_event_vendor_id)` for the booking side, and a review-side variant without the `order_id` disjunct. **Extract both predicate blocks BY SCRIPT** from `20271143376954` â retyping is how the timezone-twin bug travelled. Agreement tests must seed a self-deal that uses the `order_id` path, or they prove nothing.

**Migration 3 â `the_record_survives_the_delete`** (redefines `sever_event_connections()` from `20271150589049`)

Two new sections inside the existing `BEFORE DELETE` function â a second trigger would race it alphabetically, and BEFORE is the only point where the children are still visible â.

- **Â§7 â stamp surviving reviews.** `UPDATE vendor_reviews SET severed_event_id, severed_event_type, severed_event_date, severed_couple_label, severed_at = now(), severed_arms_length = <review-side fn> WHERE event_id = OLD.event_id`. The `severed_*` columns are **not** in `stamp_review_provenance`'s `UPDATE OF` list â, so this write does not re-derive provenance early.
- **Â§8 â write booking records.** From `event_vendors WHERE event_id = OLD.event_id AND (linked_vendor_profile_id IS NOT NULL OR marketplace_vendor_id IS NOT NULL) AND status IN ('contracted','deposit_paid','delivered','complete') AND voided_by_fraud = FALSE AND <booking-side arms-length fn>`. **A self-dealt booking gets NO record** â writing one would launder it into the numbers the exclusions exist to protect.

Update the function `COMMENT`.

**Migration 4 â `public_record_counts_severed_bookings`**

**B-C4 Â· Three relations is FOUR.** `20271143376954` also rebuilds `vendor_full_completed_events_stats` â the deliberately-unredacted internal twin â. It carries **no grants at all** (its own comment: *"AND NO GRANT AT ALL"*, `:292`) â after `20271132024116` revoked anon and `20271145190664` revoked authenticated. Give `public` a severed arm and not `full` and you get **public > full** â a stranger subtracting them reads a *negative* written-off-jobs figure, the exact inference that grant narrowing exists to prevent.
**â All four relations get the arm. `vendor_full_completed_events_stats` gets NO grant. Re-read `pg_class.relacl` immediately before re-granting each â never copy a grant line out of an older migration.**

**B-C5 Â· The snapshot would INFLATE the public finished-jobs count.** Â§8 records `contracted`/`deposit_paid` too, while `vendor_completed_events`, `vendor_public_completed_events_stats` and `vendor_full_completed_events_stats` all count **only** `('delivered','complete')` â. With no status filter on the UNION arm, deleting an event makes a supplier's public count **go up**.
**â Every UNION arm reads `WHERE status_at_severance IN ('delivered','complete')`.** Contracted/deposit_paid rows stay in the table for the median and the activity count only.

Also note: all three stats relations carry an explicit `EXISTS (SELECT 1 FROM events e WHERE e.event_id = â¦)` â â so a severed row drops out by that predicate alone, before any exclusion is considered. The severed arm is what replaces it, using the **stamped** `severed_arms_length` flag (the `event_members` exclusions cannot be evaluated once the event is gone â that is the laundering vector).

Finally, redefine `vendor_track_record_by_event_type`, changing only the review join from `ON vr.event_id = c.event_id` (`20270415213000:92`) â to `ON COALESCE(vr.event_id, vr.severed_event_id) = c.event_id`.

**What a review renders as with no event**

Public shop card, after these changes: **identical to today** â stars, the couple's words, their name, the date, the Verified-wedding pill, the supplier's reply. No visible "this event was deleted" marker; a badge would advertise the couple's deletion to strangers.

**B-C6 Â· And the plan's "verified" claim here was false.** It said *"the public shop card needs no change â verified: it reads only row fields, couple name via `enrichReviewsWithCouple`, no event join."* **There is no `enrichReviewsWithCouple`** (the name survives only in a stale comment at `reviews.ts:91`) â. The real path is `fetchReviewsForVendorWithCouple` â `resolveCoupleDisplayNames` (`reviews.ts:139`), which reads **`events.display_name` keyed on `event_id`** â and is called by the live shop page at `app/v/[slug]/page.tsx:834` â. Without a fix, every severed review loses its couple attribution and renders "Verified couple" â while the plan's own copy promises the reader *their name*.
**â `severed_couple_label` (stamped in Â§7 from `OLD.display_name`) with `resolveCoupleDisplayNames`/`fetchReviewsForVendorWithCouple` falling back to it.** This deliberately contradicts the plan's "no `display_name` in the snapshot" boundary: that boundary is right for the **booking record** and wrong for the **review**, which already shows that name publicly today. Surface the split to the owner (Part D).

Admin surfaces that join the event for context show `severed_event_type` + `severed_event_date` and the line: **"For a celebration its organiser has removed."**

---

### B.2 Statistics that need their own fix â "stored" does not mean "survives"

| Number | Where | Why it moves | Fix |
|---|---|---|---|
| `finalized_booking_count` | `lib/vendor-activity.ts:343, 464` | `recomputeVendorActivityStats` **rewrites from live tables on any recompute** (a reply in an unrelated couple's chat triggers one). Counts by **`marketplace_vendor_id`** (`:271, 303`) â | Add a severed count on the same column |
| `bookingCompletionRatePct` | `vendor-activity.ts:346` â | `finalized / total`. Adding severed rows to the numerator only makes it **exceed 100%** | Add to `totalBookings` too, or compute from live rows only and comment why |
| trusted avg + count | `vendor_trusted_review_stats` | Its `EXISTS(events â¦)` drops any severed review â | Severed arm on `severed_arms_length AND booked_through_setnayan AND NOT voided_by_fraud` |
| public finished jobs | `vendor_public_completed_events_stats` | Rows are gone | Severed arm, **status-filtered** |
| internal finished jobs | `vendor_full_completed_events_stats` | Same â and the invariant `public â¤ full` breaks if only one gets an arm â | Severed arm, no grant |
| per-type track record | `vendor_track_record_by_event_type` | Joins reviews on `event_id` â | `COALESCE(event_id, severed_event_id)` |
| "typical price" | `lib/verified-median-read.ts` | Reads live `event_vendors` only, by **`linked_vendor_profile_id`** (`:96`) â. Below `MIN_MEDIAN_SAMPLE` the card **disappears**, not shrinks | Concatenate snapshot samples before `computeVerifiedMedian` |

â  **Two different columns.** The median reads `linked_vendor_profile_id`; the activity recompute reads `marketplace_vendor_id` â. That is why the snapshot must carry **both** and why Â§8's gate must be the OR of them (B-C4). Snapshot rows are only written at delete time, so the union with live rows is disjoint by construction â **assert that in a test rather than assuming it.**

**B-C7 Â· The verified-median harm is flag-dark, not live.** Both readers sit behind `verifiedMedianEnabled()` / `NEXT_PUBLIC_VERIFIED_MEDIAN_ENABLED`, default OFF (`verified-median-flag.ts:28`, `v/[slug]/page.tsx:895`, `performance/page.tsx:614`) â. The plan presented the vanishing public card as a present-tense harm and never named the flag. Say plainly: this protects a switch that is off today.

**B-C8 Â· `voided_by_fraud` in the snapshot is a gate with no handle â the sixth.** `executeFraudWipeBan` writes `event_vendors.voided_by_fraud` (`app/admin/fraud/actions.ts:315,320`) â; nothing would ever write the snapshot's copy. After a delete, a fraudulent booking is frozen as permanently-counted and unvoidable â **deletion becomes a laundering path.**
**â Either drop the column from the snapshot, or extend `executeFraudWipeBan` to void severed records. Do not ship it inert.**

**B-C9 Â· CI will hard-fail unless two artefacts are regenerated in the same PR.** `apps/web/tests/db/exposure-freeze.db.test.ts` diffs against `supabase/security/exposure-surface.baseline.txt` â â a new RLS table with two policies plus grants adds tpriv/col/policy facts. And `apps/web/tests/db/anon-table-grants-closed.db.test.ts` â must learn the new table.

**B-C10 Â· Type sweep â two files the plan did not list.** Once `ReviewRow.event_id` is `string | null`: `reviews.ts:178` (`names.get(r.event_id)`) and `app/dashboard/[eventId]/_components/vendor-marketplace-info.tsx:288` (`nameByEvent.get(r.event_id)`) both fail to typecheck â. *Refining the skeptic:* `resolveCoupleDisplayNames` already accepts `ReadonlyArray<string | null>` and filters nulls (`:139â145`) â, so line 174 does **not** break â only the `Map.get` calls do. Also replace the plan's `app/admin/reviews/*` with `lib/fraud-detection-runner.ts` + `lib/review-fraud-screener.ts`; the `event_id` on the admin reviews page belongs to `review_appeals`, not `vendor_reviews`.

**Unstated in both plans, decide it rather than inherit it:** with `event_id` NULL, `vendor_reviews_couple_update`'s `event_id IN (SELECT current_couple_or_coordinator_event_ids())` evaluates to NULL â â a couple can no longer edit their own severed review. Public read (`USING (TRUE)`) still serves it. That is probably right; it is still a behaviour change and belongs in the changelog.

---

### B.3 THE DESTROY LIST â what is the couple's, and the leak if it were kept

| Destroyed | Why it is the couple's | The leak if preserved |
|---|---|---|
| `shortlisted` / `considering` `event_vendors` rows | A list of who they were thinking about â a private planning artefact | A supplier could learn they were considered and passed over, which the product never told them |
| Notes, budget columns, per-vendor free text | The couple's own words about their own money | Hands a supplier the couple's whole budget row â the exact disclosure `vendor-overview.ts:530` says is deliberately not opened â |
| The event's `display_name` **in the booking record** | Names the celebration | A snapshot naming the wedding rebuilds a deleted event's identity from vendor-readable rows |
| Guest list, RSVPs, seating, schedule | Guests' data, not the supplier's | RA 10173 exposure with no lawful basis once the couple has withdrawn |
| Photos and clips (files in R2) | The couple's, and the delete promises they go | The confirm sheet's "deleted for good" becomes a lie |
| Typed-name suppliers (`linked_vendor_profile_id` and `marketplace_vendor_id` both NULL) | Nobody's business record â a name the couple typed | A record attached to no shop is unreachable and un-correctable by anyone |
| Self-dealt bookings + their reviews (fail arms-length) | Not an arms-length record at all | **The laundering vector**: with `event_members` gone, an unstamped severed self-review would enter trusted stats it is excluded from today |
| `concierge_unanswered_questions` | Free text with no screen, no RLS, absent from the erasure map â | â |

**Kept, and already correct in the shipped trigger** â: the `event_closed` slug hold, `person_connections` (a christening's ninong outlives the christening), `guest_saved_vendors`, `vendor_profile_views`, the `creator_chapters` row itself.

**Copy â one sentence, and the plan had it in the wrong place.**
**B-C11.** The plan inserted its survival sentence **before** the bold "deleted for good" line, in a paragraph whose own comment says that sentence is isolated on purpose (`event-card-menu.tsx:418â430`) â. It also promised *"Suppliers you hired keep their side of it"* unconditionally, when most prod supplier rows are typed names that produce no record.
**â Place it AFTER "â you can't bring any of it back, and neither can we.", gate it on a real linked-supplier count, and shorten to:**
> *The suppliers you booked keep the review you wrote and the record that they did the work.*

Drop "because that is their business record" â that is our reasoning, not their experience.

**ð´ THE LEAK NEITHER PLAN NOR THE SKEPTIC NAMED.** `vendor_reviews_couple_delete` is live â `FOR DELETE TO authenticated USING (event_id IN (SELECT current_couple_or_coordinator_event_ids()))`, last defined `20270206186005:112â116`, never dropped, and there is **no REVOKE on the table** â. So a host can delete their own review straight through PostgREST. **Part B makes the review survive the *event* delete and does nothing about a couple who deletes the review first, then the event** â the same shape as the address hold that was written in the admin action while an RLS delete lane stood open. Two taps defeats the whole promise. This is a product ruling, not a bug fix (Part D).

---

## PART C â SEQUENCING, RISK, AND WHAT MUST BE VERIFIED IN PROD FIRST

**Order: B before A, or both in one release.** Part A's card asks a supplier to consent on the strength of "your records stay with your shop." That sentence is false until B lands. If A must ship alone, cut the sentence â do not soften it.

**Within B: 1 â 2 â 3 â 4 â app â tests.** Filename order is load-bearing for the PGlite replay â.

**Verify in prod BEFORE pushing anything â I could not run these; I have no prod access from this session and every count below came from the brief, unmeasured:**

1. `SELECT count(*) FROM vendor_reviews;` â the CHECK and the FK re-add both **scan the table** and hard-fail on an orphan. "The constraints validate trivially" is only true at 0 rows.
2. `SELECT count(*) FROM vendor_reviews WHERE event_id IS NULL;` â must be 0 before the FK swap.
3. `SELECT delete_request_state, count(*) FROM event_vendors GROUP BY 1;` â how many asks are in flight, so A's arrival path does not surprise a live supplier.
4. `SELECT count(*) FROM event_vendors WHERE marketplace_vendor_id IS NOT NULL;` â if it is near zero, the deletion card cannot be observed live and A is test-proved only. **Do not report it as "verified live" on the strength of tests.**
5. Read `pg_class.relacl` for all four stats relations immediately before writing any GRANT line.
6. Read the four relation bodies **out of prod by the object** (`pg_get_viewdef` / `pg_matviewdef`), not from the migration file â this repo has been bitten by trusting migration text.
7. **Dry-run migrations 1 and 3 against prod inside a rolled-back transaction** before pushing. The PGlite replay runs as superuser and its `auth.role()` shim never returns NULL â â RLS-dependent assertions must set the session role explicitly.

**Testing, both directions, every mutation measured by occurrence count before â after.** An unmeasured sabotage proves nothing, and this repo has shipped five guards that passed while the thing they guarded was gone. Extend `apps/web/tests/db/sever-event-connections.db.test.ts` and `supplier-agrees-to-deletion.db.test.ts` â rather than building a harness. The seven B assertions: pill survives Â· record written with no couple identity Â· trusted stats unchanged after REFRESH Â· median sample count unchanged Â· **self-dealt review has `severed_arms_length = FALSE` and does not enter trusted stats** Â· shortlisted rows + notes gone with no record Â· typed-name supplier left no record.

**Both matviews still refresh only by hand** â â pre-existing, inherited, not created here. Both arms move inside the same delete, so any later refresh lands consistent.

**Concurrency.** Another session works this repo. `git fetch` and read the new tip before building; before any force-push the remote tip must equal your own `ORIG_HEAD`.

---

## PART D â STILL NEEDS THE OWNER

1. **Can a supplier see the amount the couple recorded paying them?** It is the couple's ledger figure and may not match what the supplier banked. Until he rules, the card says "their records show a payment to you" with no number.
2. **A supplier who is not on Setnayan can be asked and can never answer.** Should we route the couple to the existing invite link, let an admin settle it after an off-platform confirmation, or both?
3. **If nobody ever answers, what happens?** Proposal: it stays open forever with one reminder, and the couple can message them or contact us. Any automatic release after N days would manufacture consent.
4. **Should declining require a reason?** The shipped RPC accepts a reasonless decline, so the form stays optional unless he says otherwise.
5. **A couple can delete their own review at any time, before ever touching the event.** Does a review the couple retracts stay with the shop, or is retraction still theirs?
6. **The review keeps the couple's public label; the booking record keeps no identity at all.** Two different boundaries in one build â confirm that split is what he meant.
7. **Does the supplier keep the money figure in the record?** It is what keeps the public "typical price" honest, and the supplier quoted it â but it is also what the couple agreed to pay, outliving their data.
8. **Do the chat threads survive?** They CASCADE today, so the supplier loses the whole history and their response-rate inputs quietly shrink. By his own test the supplier took part in every message.
9. **Where does "the supplier took part" start?** Proposal: `contracted` onward â the platform's canonical booking gate. Stricter would drop contracted-but-unpaid work from the record.
10. **Should a supplier's own agreement to a deletion be reversible?** It is not today, and that is probably right, but nothing has said so out loud."
  },
  "workflowProgress": [
    {
      "type": "workflow_phase",
      "index": 1,
      "title": "Plan"
    },
    {
      "type": "workflow_phase",
      "index": 2,
      "title": "Ground"
    },
    {
      "type": "workflow_phase",
      "index": 3,
      "title": "Spec"
    },
    {
      "type": "workflow_agent",
      "index": 1,
      "label": "fable:vendor-answers",
      "phaseIndex": 1,
      "phaseTitle": "Plan",
      "agentId": "a8b106b8f3e6320cf",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1787272125517,
      "queuedAt": 1787272121071,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "â THE CARD â on the supplier's Overview, in "What's new" (aâ¦",
      "promptPreview": "Setnayan â a Philippines-first life-events platform. Couples plan events;
suppliers ("vendors") run shops; Setnayan is the software in between.

READ CODE ONLY FROM /tmp/wt-plan (worktree at current origin/main).
NEVER read /Users/icecasasola â ~750 commits stale, has produced confidently
wrong findings citing real line numbers from deleted code.
Schema: /tmp/wt-plan/supabase/migrations (1152 fileâ¦",
      "lastProgressAt": 1787272583277,
      "tokens": 167694,
      "toolCalls": 34,
      "durationMs": 457758,
      "resultPreview": "{"copy":"â THE CARD â on the supplier's Overview, in \"What's new\" (amber accent, like other questions that need an answer) â\n\nEyebrow: Removing a celebration â your call\n\nBold line: {Event name} â {short date}\nFact line: asked {2 days ago} Â· their records show {â±15,000} paid to you\n(If no amount was recorded, the fact line says \"their records show a payment to you\" â never â±0.)\n\nBody:\â¦"
    },
    {
      "type": "workflow_agent",
      "index": 2,
      "label": "fable:vendor-data-survives",
      "phaseIndex": 1,
      "phaseTitle": "Plan",
      "agentId": "a564efa4d969b9a48",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1787272128323,
      "queuedAt": 1787272121071,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "Make a supplier's record survive a couple deleting their ceâ¦",
      "promptPreview": "Setnayan â a Philippines-first life-events platform. Couples plan events;
suppliers ("vendors") run shops; Setnayan is the software in between.

READ CODE ONLY FROM /tmp/wt-plan (worktree at current origin/main).
NEVER read /Users/icecasasola â ~750 commits stale, has produced confidently
wrong findings citing real line numbers from deleted code.
Schema: /tmp/wt-plan/supabase/migrations (1152 fileâ¦",
      "lastProgressAt": 1787272750052,
      "tokens": 186179,
      "toolCalls": 47,
      "durationMs": 620984,
      "resultPreview": "{"summary":"Make a supplier's record survive a couple deleting their celebration, per the owner's 2026-08-21 rule (\"only data from the user gets lostâ¦ statistics and data for the vendor stays, including the reviews\"). Two mechanisms: (1) vendor_reviews rows OUTLIVE the event â event_id goes nullable with ON DELETE SET NULL, plus severance stamps (severed_event_id/type/date/at + an arms-length flâ¦"
    },
    {
      "type": "workflow_agent",
      "index": 3,
      "label": "ground:vendor-answers",
      "phaseIndex": 2,
      "phaseTitle": "Ground",
      "agentId": "a9fbdfe39bc447eb4",
      "model": "claude-opus-5",
      "state": "done",
      "startedAt": 1787272586927,
      "queuedAt": 1787272585140,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "VERIFIED CORRECT (do not re-litigate): every file path in `â¦",
      "promptPreview": "Setnayan â a Philippines-first life-events platform. Couples plan events;
suppliers ("vendors") run shops; Setnayan is the software in between.

READ CODE ONLY FROM /tmp/wt-plan (worktree at current origin/main).
NEVER read /Users/icecasasola â ~750 commits stale, has produced confidently
wrong findings citing real line numbers from deleted code.
Schema: /tmp/wt-plan/supabase/migrations (1152 fileâ¦",
      "lastProgressAt": 1787272986658,
      "tokens": 205531,
      "toolCalls": 44,
      "durationMs": 399731,
      "resultPreview": "{"wrong":["Step 1 needs a migration the plan says does not exist: `notification_type` is a real Postgres ENUM (20260513160000), so four TS-only types make the insert fail â and `emitNotification` only `console.error`s, so the supplier is told nothing, silently.","Step 1 mirroring \"the lock family\" copies a LIVE BUG: all six `lock_request_*` types sit in BOTH `EMAIL_ENABLED_TYPES` and `MARKETING_â¦"
    },
    {
      "type": "workflow_agent",
      "index": 4,
      "label": "ground:vendor-data-survives",
      "phaseIndex": 2,
      "phaseTitle": "Ground",
      "agentId": "afcef2dd539fd60bd",
      "model": "claude-opus-5",
      "state": "done",
      "startedAt": 1787272759452,
      "queuedAt": 1787272752739,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "SPINE IS SOUND â the trigger is the right place, trap 1 andâ¦",
      "promptPreview": "Setnayan â a Philippines-first life-events platform. Couples plan events;
suppliers ("vendors") run shops; Setnayan is the software in between.

READ CODE ONLY FROM /tmp/wt-plan (worktree at current origin/main).
NEVER read /Users/icecasasola â ~750 commits stale, has produced confidently
wrong findings citing real line numbers from deleted code.
Schema: /tmp/wt-plan/supabase/migrations (1152 fileâ¦",
      "lastProgressAt": 1787273244087,
      "tokens": 206728,
      "toolCalls": 51,
      "durationMs": 484635,
      "resultPreview": "{"wrong":["FALSE AND VERIFIED-SOUNDING: 'the public shop card needs no change â verified: it reads only row fields â¦ couple name via enrichReviewsWithCouple, no event join'. There is no `enrichReviewsWithCouple`. The real function is `resolveCoupleDisplayNames` (apps/web/lib/reviews.ts:139), which reads `events.display_name` keyed on `event_id`; `fetchReviewsForVendorWithCouple` feeds it `reviews.â¦"
    },
    {
      "type": "workflow_agent",
      "index": 5,
      "label": "build-spec",
      "phaseIndex": 3,
      "phaseTitle": "Spec",
      "agentId": "a0107f56afdb39b15",
      "model": "claude-opus-5",
      "state": "done",
      "startedAt": 1787273247684,
      "queuedAt": 1787273245785,
      "attempt": 1,
      "lastToolName": "Bash",
      "lastToolSummary": "cd /tmp/wt-plan && grep -n "migration:new" package.json appâ¦",
      "promptPreview": "Setnayan â a Philippines-first life-events platform. Couples plan events;
suppliers ("vendors") run shops; Setnayan is the software in between.

READ CODE ONLY FROM /tmp/wt-plan (worktree at current origin/main).
NEVER read /Users/icecasasola â ~750 commits stale, has produced confidently
wrong findings citing real line numbers from deleted code.
Schema: /tmp/wt-plan/supabase/migrations (1152 fileâ¦",
      "lastProgressAt": 1787273776841,
      "tokens": 227771,
      "toolCalls": 67,
      "durationMs": 529157,
      "resultPreview": "# BUILD-READY SPEC â "the supplier answers" + "vendor data survives"

Ground truth: `/tmp/wt-plan` @ `23d5955cd`. Everything below marked â was read out of that worktree in this session. Prod row counts came from the brief and were **NOT measured by me** â see Part C.

---

## PART A â THE SUPPLIER ANSWERS

### A.1 The exact surface being extended, and the delta

**RULE 0 result:** `grep -rn "deleâ¦"
    }
  ],
  "totalTokens": 993903,
  "totalToolCalls": 243
}