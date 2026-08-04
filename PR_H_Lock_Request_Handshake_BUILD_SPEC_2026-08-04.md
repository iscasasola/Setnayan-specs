# PR-H — the vendor-agrees step · BUILD SPEC
**Date:** 2026-08-04 · **Status:** DESIGNED, adversarially reviewed, **4 owner answers RECEIVED 2026-08-04**, BUILD NOT STARTED
**Parent:** `Explore_Replan_BUILD_SPEC_2026-07-27.md` §7 (PR-H). **Depends on:** PR-I (#4083) for `lib/lock-handshake-flag.ts`.

> ## 🔒 THE OWNER HAS ANSWERED — §6 IS NO LONGER A QUESTION LIST
>
> All four blocking decisions were answered on 2026-08-04. **§6 now records the answers, and one of
> them CHANGES THE DESIGN in a way that is easy to miss.**
>
> **⚠ THE WEDDING DATE ANSWER MATCHES NEITHER OPTION THIS SPEC OFFERED.** §6 asked "does the date fix
> when the couple ASKS, or when the vendor AGREES?" The owner's answer is a third thing — the date is
> a property of the EVENT narrowing to one candidate, not of any vendor's answer. **An implementer who
> reads only the old §6 will pick one of the two offered options and be wrong.** Read §6 in full.
>
> **The owner's answers do NOT clear the build.** §9's adversarial review found 14 HIGH problems in
> the PLAN — those are engineering defects, not owner calls, and they are still open. The clearest:
> **the vendor cannot open the page the agree card is specified to live on.** Fix the plan before
> writing the screen.

> Produced by a 12-agent mapping + design + adversarial workflow on 2026-08-04. Every claim below is file:line-backed against `origin/main`. This is the cold-start contract for the build — read it fully before writing code.


> ## 🚨 READ BEFORE USING ANY LINE NUMBER IN THIS DOCUMENT
>
> **The `file:line` citations throughout drift by up to ~85 lines.** They were gathered from a
> working copy that was **99 commits behind `origin/main`** at the time. The FINDINGS check out —
> independently re-verified on 2026-08-04 — but the LINE NUMBERS do not. Grep for the symbol, never
> jump to the line.
>
> This is the same stale-checkout trap that has already cost this project real money: a search of an
> out-of-date copy reports that shipped features "do not exist". Before building from this spec,
> `git fetch && git merge --ff-only origin/main` and re-locate every anchor.


## 0 · The one-line problem
A couple pressing **Lock** books the vendor outright. The vendor is never asked. The owner ruled 2026-07-27 that a lock is a **REQUEST** and the vendor must agree — steps 1, 3, 4 and 5 of the handshake all ship today; **step 2 does not exist.**

## 1 · Schema decision
**NEW COLUMNS on event_vendors — ~~five~~ SIX nullable, orthogonal markers (lock_requested_at, lock_agreed_at, lock_request_closed_at, lock_request_closed_reason, lock_request_note, **lock_request_nudged_at**) plus two new partial indexes and ~~four~~ FIVE new SECURITY DEFINER RPCs. NO new table. NO new *_user_id column anywhere.**

> ⚠ **Updated by owner answer 6.3.** The sixth column (`lock_request_nudged_at`) and the fifth RPC
> (`nudge_stale_lock_requests`) come from the day-5 nudge the owner ordered on 2026-08-04. They are
> the same *class* of change — nullable marker, no actor column, no new FK — so every guardrail
> argument below (erasure, export, the hard_single_group reuse, the single `.maybeSingle()` read)
> holds unchanged. The migration in §7 predates this and is missing both.

### Why (verbatim from the design)
1) It is literally what shipped step-5 does, and the spec says mirror it: 20270320429117_deposit_lockfree.sql:37-49 adds three nullable marker columns to event_vendors and drives them from one DEFINER RPC, and its own header (:15-18) states the 'orthogonal to the status ladder, never repurpose status' rule the PR-H spec quotes. Copying the pattern is a one-file change; inventing a table is a new shape.  2) hard_single_group is a GENERATED ALWAYS STORED column ON event_vendors (20261210000000_hard_single_lock_guard.sql:78-91). Keeping the request on the same row lets the new pending-request unique index reuse it verbatim; a separate table would force the 7-category CASE into a THIRD copy.  3) The vendor client page resolves its whole booking state from ONE .maybeSingle() read of event_vendors (vendor-dashboard/clients/[eventId]/page.tsx:458-465). Columns keep that read working; a second row per booking would blank the entire deposit + completion section.  4) DECISIVE: a new table carrying any actor column fails TWO guardrails whose escape hatches are BOTH closed — erasure's UNDECIDED_BACKLOG is empty with BACKLOG_HIGH_WATER = 0 (lib/erasure/coverage-guardrail.test.ts:349-354,434-451) and export's KNOWN_GAPS sits at exactly 90/90 against KNOWN_GAP_CEILING = 90 with a shrink-only ratchet (lib/export-coverage-guardrail.test.ts:443,494-500). Marker columns on an already-classified table add zero erasure/export surface. Step 5 has no actor column either (deposit_acknowledged_at records WHEN, not WHO) — we match that deliberately; 'who clicked agree' is already recoverable from the action's fault/console log path.  5) vendor_lock_proposals is the WRONG thing to mirror despite being named in the spec: it shipped with no REVOKE at all (exposure-surface.baseline.txt:572-573 records 'tpriv public.vendor_lock_proposals|anon SIUD' and all 9 columns anon=SIU), its three RLS policies have never been exercised (all four call sites use createAdminClient()), it has no expiry machinery, and its RLS direction is inverted from what PR-H needs (couple resolves, vendor cannot even read). We take exactly ONE idea from it: the partial-unique-index-on-the-live-state idiom (20270729130000:45-47).

### Columns
- event_vendors.lock_requested_at TIMESTAMPTZ — COUPLE-set. The moment the couple pressed Lock under the handshake. NULL = no request. Never a status value.
- event_vendors.lock_agreed_at TIMESTAMPTZ — VENDOR-set, ONLY via agree_vendor_lock_request(). Protected by a BEFORE UPDATE trigger clone of guard_event_vendor_deposit_ack (20270323841750:22-71) because authenticated holds a TABLE-WIDE UPDATE grant on event_vendors that defeats any column-level REVOKE.
- event_vendors.lock_request_closed_at TIMESTAMPTZ — the request ended WITHOUT agreement. Set by decline / cancel / expiry / supersede. Trigger-guarded (vendor+service_role only) so a couple cannot forge 'the vendor declined'.
- event_vendors.lock_request_closed_reason TEXT CHECK IN ('declined','expired','cancelled','superseded') — CHECK also enforces (closed_at IS NULL) = (closed_reason IS NULL). Four reasons, four different couple-facing sentences.
- event_vendors.lock_request_note TEXT — the vendor's optional decline reason, left(…,500) in SQL and .slice(0,500) in the action. Trigger-guarded with the other two.
- (NO new column) service_time_slot_id is REUSED: the request stamps the couple's chosen slot; capacity is only consumed at agree, because acquire_service_time_slot counts occupancy on CONFIRMED statuses only (20270405381226:161-166), so a 'considering' row holding a slot id consumes nothing.
- (NO new column) lock_request_expires_at — the 7-day deadline is DERIVED from lock_requested_at, exactly as lib/completion-handshake.ts:29,45-66 derives its M=7d / N=30d auto-resolve from timestamps. Expiry is still a WRITE (closed_at + reason='expired') so the partial index actually releases the slot.
- NEW INDEX event_vendors_hard_single_request_uniq — one PENDING request per (event_id, hard_single_group).
- NEW INDEX event_vendors_pending_lock_request_idx — the vendor Overview feed's read path.
- notification_type ENUM += lock_request_received (vendor), lock_request_agreed, lock_request_declined, lock_request_expired (couple).

## 2 · Expiry
SHAPE — the deadline is DERIVED (lock_requested_at + 7 days, exactly as lib/completion-handshake.ts derives its M=7d / N=30d auto-resolve from timestamps), but the expiry itself is a WRITE. That distinction is load-bearing: event_vendors_hard_single_request_uniq is a partial index and cannot see a computed deadline, so a purely-derived expiry would leave a 7-day-dead request holding the venue slot forever.

MECHANISM — cron-free, on the repo's compare-and-swap pattern. `public.expire_stale_lock_requests(p_days DEFAULT 7, p_limit DEFAULT 200)` selects live requests older than p_days with `FOR UPDATE SKIP LOCKED` (one wedged row cannot block the batch), stamps lock_request_closed_at + reason='expired', and RETURNS the closed rows so the caller can notify. BOUNDED at 200 — an unbounded `WHERE requested_at < now() - 7 days` puts unbounded work on whichever real user's request wins the claim, which is why every shipped sweep bounds itself (anon-draft-sweep uses BATCH = 50).

DRIVER — `apps/web/lib/lock-request-expiry.ts`, copying lib/retention-sweep.ts:17-40 line for line: an exported work BODY (`runLockRequestExpirySweep`) plus a `maybeRunLockRequestExpiry()` wrapper that is `if (!isLockHandshakeEnabled()) return;` then `if (await claimPeriodicJob('lock-request-expiry', DAILY_GAP_MS)) await runLockRequestExpirySweep();` inside try/catch, never throwing. DAILY_GAP_MS (20h), not WEEKLY — a 7-day fuse checked weekly can fire on day 13.

MOUNTS — `after(() => maybeRunLockRequestExpiry().catch(() => {}))` in BOTH apps/web/app/admin/layout.tsx (:107-157) and apps/web/app/vendor-dashboard/layout.tsx (:263-274). Double-mounting is safe because the DB compare-and-swap picks exactly one winner per gap window, and it is necessary because an after() sweep only fires when someone visits — an admin-only mount waits for an admin page view, and prod is pre-launch-empty. A late expiry is acceptable and documented ('a missed day retries on the next eligible request'); a never-firing one is not.

WHAT EXPIRY MUST ALSO RELEASE — closing the request drops the row out of event_vendors_hard_single_request_uniq, which frees the category. That is the whole point: the creator-offer sweep had to refund escrow in the same transaction for the same reason, one layer down. Nothing else is orphaned, because a request holds no money, no ledger row, and no schedule-pool reservation (both stay at step 5), and the chosen service_time_slot_id reserves nothing while the row is 'considering'.

NOTIFICATION — one `lock_request_expired` per couple member per expired row, emitted from the sweep body (not from SQL), fail-soft. Body: '{vendor} did not answer within 7 days. Your request is closed — you can ask them again or pick someone else.'

TESTING THE THROTTLE — never call `maybeRunLockRequestExpiry()` twice in a test or from a manual 'Run now' control: claimPeriodicJob has a 5-minute per-key in-memory pre-throttle that returns false BEFORE it ever reaches the DB, so the second call silently does nothing and looks broken. Manual triggers call the exported BODY directly, exactly as the SEO surface does.

~~NOT BUILT ON PURPOSE — no reminder-before-expiry nudge (a second scheduled signal to design and throttle)~~, and no per-vendor configurable window. 7 days is hardcoded as the RPC's default, changeable by argument without a migration.

> 🔒 **OVERTURNED BY THE OWNER 2026-08-04 — THE DAY-5 NUDGE IS ORDERED.** See §6.3. The reasoning that
> justified skipping it ("a second scheduled signal to design and throttle") is answered by NOT making
> it a second signal: `nudge_stale_lock_requests(p_days DEFAULT 5, p_limit DEFAULT 200)` ships in the
> same migration and runs in the SAME daily sweep pass as the expiry, guarded by a new
> `lock_request_nudged_at` stamp so it fires once, not every day from 5 to 7.
> 🪤 **NUDGE BEFORE EXPIRE, IN ONE PASS.** If the expiry runs first, a request that crossed both
> thresholds since the last sweep is closed having never warned the vendor — the exact outcome the
> owner added the nudge to prevent. The 20h `DAILY_GAP_MS` makes that a real window, not a theoretical
> one: prod is pre-launch-empty, so sweeps fire only when someone visits.
> ⚠ **Do not "fix" a missed nudge by nudging on expiry.** A message saying "2 days left" delivered in
> the same pass that closes the request is worse than silence.

## 3 · Call sites — the complete build list
**40 sites.** Order as listed.

### 1 · `supabase/migrations/<allocated>_notification_type_lock_request.sql`
NEW FILE 1. Bare `ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS` **x5** — lock_request_received, lock_request_agreed, lock_request_declined, lock_request_expired, **lock_request_nudge** (⚠ the fifth is new, from owner answer 6.3; every "x4"/"four types" count in §3 sites 3-4 and §5 is now five). NO BEGIN/COMMIT, nothing else in the file (Postgres forbids USING a value in the txn that adds it). Allocate the prefix with `pnpm migration:new` AFTER `git fetch origin` — origin/main's head is 20271103100614 and this worktree's newest local file (20271103100000) already sorts below it.

### 2 · `supabase/migrations/<allocated>_lock_request_handshake.sql`
NEW FILE 2 — the migration in `migrationSql`. Five columns, the coherence CHECK, two indexes, the guard trigger, four user RPCs + the sweep RPC, the DO $$ post-condition.

### 3 · `apps/web/lib/notifications.ts`
Add the four literals to the NotificationType union (:8-255) AND a key for each in BOTH exhaustive maps — NOTIFICATION_TYPE_LABEL (:256) and NOTIFICATION_TYPE_TONE (:329). Missing either is a typecheck failure and `next build` cannot run locally (7 GB heap), so CI is the only detector. Labels: 'Lock request' (received) · 'Lock agreed' (agreed) · 'Lock declined' (declined) · 'Lock request expired' (expired) · **'Lock request — 2 days left' (nudge)**. Tones: warn · success · warn · warn · **warn**.

### 4 · `apps/web/lib/notification-emit.ts`
Add all **five** to EMAIL_ENABLED_TYPES (:62-129). Deliberate: a request carries a 7-day fuse, so a vendor who is not in the app must still hear it, and a couple must hear the answer. **`lock_request_nudge` is email-enabled for the strongest version of that reason — the owner ordered it specifically for the vendor who never logs in, so an in-app-only nudge would reach exactly the vendors who do not need it.** Do NOT add to PUSH_ENABLED_TYPES (:21-35) — that list is 4 types and this is not that urgent.

### 5 · `apps/web/lib/lock-request-state.ts`
NEW PURE CORE — the ONE place the request state is derived, so the four couple surfaces cannot drift. `export type LockRequestState = 'none'|'requested'|'agreed'|'declined'|'expired'|'cancelled'|'superseded'|'locked'` and `export function lockRequestStateOf(row: {status; lock_requested_at; lock_agreed_at; lock_request_closed_at; lock_request_closed_reason}, enabled: boolean): LockRequestState`. Takes the flag as a PARAMETER and must never call isLockHandshakeEnabled() itself. RULES: enabled=false ⇒ always 'locked' when status ∈ the four confirmed, else 'none' (byte-identical to today). enabled=true ⇒ status ∈ confirmed ⇒ 'locked' (this is also what makes a legacy pre-flag lock and a Locked-QR claim, both of which have lock_requested_at NULL, read as locked and NOT as a phantom 'waiting' — derive, never backfill). Then requested & !agreed & !closed ⇒ 'requested'; closed ⇒ the reason verbatim. Also export `export function lockRequestExpiresAt(requestedAt: string): Date` (+7d) and `export function lockRequestDaysLeft(requestedAt, now): number`.

### 6 · `apps/web/app/dashboard/[eventId]/vendors/actions.ts`
SITE 1 + 2 — the canonical lock. (a) Extend FinalizeVendorResult (:510-604) with `| { status: 'lock_requested'; vendorId; vendorName; expiresAt: string }` and `| { status: 'lock_request_conflict'; groupId; groupLabel; existingVendorId; existingVendorName }`. (b) Widen isHardSingleUniqueViolation (:611-618) to match EITHER index name — the detector is a SUBSTRING match, so a second index with a different name is invisible to it; add 'event_vendors_hard_single_request_uniq' to the test and keep both names in one exported const so the db-test can assert against it. (c) The pre-emptive gate (:823-831) keeps its CONFIRMED-status read UNCHANGED, and when isLockHandshakeEnabled() ALSO runs a second read for a live PENDING sibling in groupCategories (lock_requested_at NOT NULL, lock_agreed_at IS NULL, lock_request_closed_at IS NULL, archived_at IS NULL, vendor_id <> this) → returns lock_request_conflict unless override_existing. (d) The Switch branch (:866-875) learns a second arm: when the displaced sibling is PENDING (not confirmed), call cancel_lock_request on it instead of demoting it to 'considering'. (e) SLOT PATH (:1163-1166): when the flag is ON, do NOT call acquire_service_time_slot — the slot_required gate still runs, and chosenSlotId is passed into request_vendor_lock as p_slot_id; capacity is consumed at agree. (f) GENERIC WRITE (:1409-1418): when the flag is ON, replace the status UPDATE with `supabase.rpc('request_vendor_lock', { p_event_id, p_event_vendor_id: vendorId, p_slot_id: chosenSlotId ?? null })`, map the envelope — ok ⇒ continue to the request return, already ⇒ same, already_locked ⇒ {status:'already_locked'}, group_taken ⇒ buildLockRequestConflict(...) — then emit the vendor notification and `return { status:'lock_requested', … }` BEFORE the post-lock side effects. (g) THE SIDE EFFECTS MOVE: with the flag ON, the archive-others sweep (:1730-1755), the inquiry-displacement + refund block (:1779-1900), the event_category_decisions auto-complete (:2140-2152) and the vendor_lock_proposals auto-resolve (:2155-2172) must NOT run at request time — extract them into an exported `applyPostLockEffects(admin, {eventId, vendorId, targetCategory, groupCategories, isHardSingle})` called from the request path only when the flag is OFF, and from vendorAgreeToLock when it is ON. Firing them at request time kills rival conversations before anyone agreed. (h) The booking-fee block (:2196) is UNCHANGED — it already reads `!isLockHandshakeEnabled()`. (i) NEW exported action `cancelLockRequest(formData)` → rpc('cancel_lock_request'), returns a typed Result, revalidates the vendors path and the workspace path.

**(j) 🔴 THE DATE GATE — ADDED BY OWNER ANSWER 6.1, AND IT IS NOT A NO-OP.** `finalizeVendor` carries the candidate-date narrowing gate (grep `forcedDateKey`, `intersectViableCandidates`, `date_will_lock`) and the post-lock date write (grep `event_date_precision: 'day'`, guarded by `.is('event_date', null)`). **When `isLockHandshakeEnabled()`, SKIP BOTH.** This is a live defect if left alone, not tidiness: the gate builds its constraining set as *the already-confirmed marketplace vendors **plus this target***, adding the target **explicitly** — so under the flag, merely ASKING a vendor would narrow the candidates against a vendor who has not agreed and can still decline, return `date_will_lock`, and on confirmation write the couple's **final wedding date** at request time. The date then survives a decline, because the post-lock write is `.is('event_date', null)`-guarded and nothing clears it. Instead: carry the couple's confirmed date key into `request_vendor_lock` as the value item 3 of §3 site 13 compares against, and let the AGREE path re-run the narrowing for real.

### 7 · `apps/web/app/dashboard/[eventId]/vendors/packages/actions.ts`
SITE 3 — lockPackage (:110). When isLockHandshakeEnabled(), build `baseRow.status` as `'considering'` instead of `'contracted'` (:476) and, immediately after the cascade insert returns `insertedRows`, call `request_vendor_lock` for the ANCHOR row only (never a covered row — they carry ₱0 and are excluded from the request index by `package_role IS DISTINCT FROM 'covered'`). One package = ONE request. The covered rows are promoted by the agree RPC's cascade. The fee block (:554) is UNCHANGED. Return a new `{status:'lock_requested'}` outcome so the /v/[slug] lock modal stops saying 'Booked'.

### 8 · `apps/web/lib/chat-lock-booking.server.ts`
SITE 4 — bookVendorAtChatLock (:46). Add `| { status: 'lock_requested' }` to ChatLockBookingOutcome (:29-44). When isLockHandshakeEnabled() and action === 'book': write total_cost_php ONLY (drop status/selection_match_rank/linked_vendor_profile_id from the update — the agree RPC stamps the last two), then call request_vendor_lock and return lock_requested; map group_taken to the existing hard_single_blocked outcome so the chat copy needs no new arm. The fee block (:127) is UNCHANGED. This is the site a vendors-folder grep walks past — its own docblock says so.

### 9 · `apps/web/app/_components/negotiation-actions.ts`
lockDeal (:846, calls at :909). Handle the new 'lock_requested' outcome: the thread's frozen-price write stays, but the message/UI wording flips from 'Locked' (:836-838) to 'Requested — waiting for {vendor} to agree'. Do NOT freeze the thread as if it were a booking.

### 10 · `apps/web/app/dashboard/[eventId]/wizard-actions.ts`
SITES 5-7 — completeVendorPickFromMarketplace (:488), completeVendorPickFromCustom (:572), lockBoothToEvent (:1147). All three INSERT at 'contracted' and have NO live caller, but they are exported server actions, so leaving them is a live bypass of the whole handshake. Change: insert at `isLockHandshakeEnabled() ? 'considering' : 'contracted'` and, when the flag is on, call request_vendor_lock on the inserted row. Do NOT retire them in this PR — retiring is a separate change with its own blast radius.

### 11 · `apps/web/app/dashboard/[eventId]/vendors/actions.ts (updateVendorStatus, :233-332)`
SITE 8 — the generic backdoor. isValidStatus (:81) accepts the whole 6-value union including 'contracted', and the write at :328-332 bypasses every lock guard. It has no client caller today. Change: when isLockHandshakeEnabled() and the posted status is 'contracted', return `{status:'error', message:'Locking is a request now — use the Lock button.'}` before the write. Everything else (including 'delivered', its one in-repo caller at :4028) is unchanged.

### 12 · `apps/web/app/vendor/lock/[token]/actions.ts + supabase vendor_claim_locked_qr`
SITE 9 — EXPLICITLY EXEMPT, and say so in a comment at :79. The vendor issued the Locked QR, so the vendor has already agreed; the RPC inserts straight at 'deposit_paid' and never passes through 'contracted'. NO code change and NO backfill — lockRequestStateOf returns 'locked' for any confirmed row with lock_requested_at NULL, so these bookings never render a phantom 'waiting'. Write the exemption down; an unstated exemption reads as a missed site.

### 13 · `apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts`
NEW ACTIONS `vendorAgreeToLock(formData)` and `vendorDeclineLock(formData)`, placed beside vendorAcknowledgeDeposit (:108-217) and copying it EXACTLY: read only `event_id` + `vendor_id` from FormData, throw 'Invalid input' if either is not a string; `getUser()` → redirect('/login') and NO TypeScript authorization re-check (the DEFINER RPC owns the gate); forward under the vendor's OWN RLS client; fire side effects ONLY on `!error && env.status === 'ok'`; every side effect in its own try/catch with a console.error; finish with revalidatePath + redirect(`?lock_agree=${flag}` / `?lock_decline=${flag}`) where flag = error ? 'error' : env.status ?? 'ok'. vendorDeclineLock trims + .slice(0,500) the `reason`. ON AGREE ONLY: (1) emitNotification('lock_request_agreed') to every event_members row with member_type='couple'; (2) call the extracted applyPostLockEffects(...) — the archive sweep, the inquiry displacement/refund, the category auto-complete, the proposal auto-resolve; (3) ⚠ **REWRITTEN BY OWNER ANSWER 6.1 — was "if the couple's date-narrowing gate had deferred the wedding-date finalize, apply it now."** Do NOT replay a deferred decision. **RE-RUN the narrowing from scratch** now that this row is confirmed: read `events.event_date` + `date_candidates`, recompute `intersectViableCandidates` over the confirmed marketplace vendors, and finalize ONLY if (a) it collapses to exactly one, (b) `event_date IS NULL`, and (c) **the collapsed key is byte-identical to the date the couple confirmed at request time** (persist that key with the request). If it collapsed to a DIFFERENT date, write nothing and notify the couple to re-confirm — a consent captured up to 7 days earlier is not consent to today's answer. See §6.1's NEW HIGH. DO NOT bill and DO NOT acquire schedule pools here — both stay at step 5. ON DECLINE: emitNotification('lock_request_declined') with the reason in the body.

### 14 · `apps/web/lib/vendor-overview.ts`
Add `| { kind: 'lock_request'; id; eventId; eventVendorId; coupleName: string|null; eventDate: string|null; requestedAt: string; expiresAt: string; totalPhp: number|null }` to the WhatsNewCard union (:55-85). Add `fetchLockAgreementRequests(admin, vendorProfileId)` beside fetchLockRequests (:461-510), reading event_vendors via createAdminClient (event_vendors carries couple-only RLS) with `.eq('marketplace_vendor_id', …).not('lock_requested_at','is',null).is('lock_agreed_at',null).is('lock_request_closed_at',null)` PLUS THE TWO MANDATORY FILTERS `.or('package_role.is.null,package_role.eq.anchor')` and `.is('archived_at', null)` — a covered cascade row or an archived booking must never be offered for agreement. Add it to the existing Promise.all beside fetchEventMeta, and push the matching `ongoing` task (mirroring :273-281) with `awaitingChip(lr.requestedAt)` so it also appears in the open-task list with an 'Awaiting you N days' chip.

### 15 · `apps/web/app/vendor-dashboard/_components/overview-sections.tsx`
Add a `CARD_KIND` entry for 'lock_request' (:53-61 — the Record is exhaustive over the union, a missing kind fails typecheck): accent + eye = the terracotta CTA token already used by the couple-side PendingLockProposals strip, eyebrow 'Lock request — agree?'. Add `LockRequestBody` modeled on LockBody (:613-650): plain `<form action={agreeLock}>` with hidden event_id + vendor_id and `<SubmitButton pendingLabel="Agreeing…">Agree to this booking</SubmitButton>`; a `<details>` disclosure 'Can't take this booking?' containing `<form action={declineLock}>` with an optional `reason` input (maxLength 200); a secondary `<Link>` 'View' to /vendor-dashboard/clients/{eventId}; and an age/fuse line 'Asked N days ago · N days left to answer'. No client JS, no onSubmit. Add the branch in FeedCard (:540-552) and the two new action props on WhatsNewFeed (:472-482).

### 16 · `apps/web/app/vendor-dashboard/page.tsx`
Import vendorAgreeToLock + vendorDeclineLock from './clients/[eventId]/actions' (beside the :14 import) and pass them into `<WhatsNewFeed>` (:276-281).

### 17 · `apps/web/app/vendor-dashboard/clients/[eventId]/page.tsx`
Extend the single `.maybeSingle()` admin read (:458-465) to also select lock_requested_at / lock_agreed_at / lock_request_closed_at / lock_request_closed_reason, and derive the state via lockRequestStateOf. Render a NEW 'Lock request — agree?' card ABOVE the deposit card (:2064-2164 is the literal template) with the same agree + decline forms. Add `lock_agree` / `lock_decline` to the page's searchParams type (:395-396, :1717) and render their outcome banners OUTSIDE the card (:2067-2086) — a successful agree or decline erases the card that hosted the button, exactly as a successful reject does today. While state === 'requested', suppress the deposit card entirely: there is nothing to pay yet, step 3 (the vendor's payment request) has not happened.

### 18 · `apps/web/lib/lock-request-expiry.ts`
NEW. `export async function runLockRequestExpirySweep(): Promise<{nudged:number; expired:number}>` — **two RPCs in ONE pass, NUDGE FIRST** (owner answer 6.3): (1) createAdminClient().rpc('nudge_stale_lock_requests', {p_days:5, p_limit:200}), emitting 'lock_request_nudge' to the VENDOR for each returned row; then (2) .rpc('expire_stale_lock_requests', {p_days:7, p_limit:200}), emitting 'lock_request_expired' to every couple member of that event. **The order is load-bearing** — expire-first closes a request that crossed both thresholds since the last sweep without ever warning the vendor, which is the exact failure the owner added the nudge to prevent. Keep the function name (the flag registry and both layout mounts reference it) even though it now does two jobs; say so in its docblock. `export async function maybeRunLockRequestExpiry(): Promise<void>` — `if (!isLockHandshakeEnabled()) return;` then `if (await claimPeriodicJob('lock-request-expiry', DAILY_GAP_MS)) await runLockRequestExpirySweep();` wrapped in try/catch, never throws. Copy the shape of lib/retention-sweep.ts:17-40 exactly. Register this file in the flag registry's `gates`.

### 19 · `apps/web/app/admin/layout.tsx`
Add `after(() => maybeRunLockRequestExpiry().catch(() => {}))` to the existing twelve-strong after() block (:107-157).

### 20 · `apps/web/app/vendor-dashboard/layout.tsx`
Add the same `after(() => maybeRunLockRequestExpiry().catch(() => {}))` to the after() block (:263-274), beside maybeSweepExpiredCreatorOffers. Mounting in BOTH layouts is safe — the DB compare-and-swap means exactly one caller per gap window wins — and necessary, because an admin-only mount waits for an admin page view and prod is pre-launch-empty.

### 21 · `apps/web/lib/shortlist-taxonomy.ts`
Widen `ShortlistVendor.status` (:188) from 'considering'|'locked' to add 'requested', and change the derivation (:494, :518) to call lockRequestStateOf, passing the flag down from the page. The bench card literally cannot express a third state until this type carries one.

### 22 · `apps/web/lib/bench-card-actions.ts`
The `if (vendor.status === 'locked') return NO_ACTIONS` early return (:108) strips Add-to-build, Inquire AND Lock the instant a row goes locked. Add a 'requested' arm BEFORE it returning `{ build: null, inquiry: null, lockGroupId: null, cancelRequest: { eventVendorId, vendorName } }` — otherwise the spec's required Undo has nowhere to live, and if the request did not change the card state the couple could fire duplicate requests from the same card. Stays a pure core (already in the flag registry's pureCores).

### 23 · `apps/web/app/dashboard/[eventId]/vendors/_components/bench-vendor-actions.tsx`
Render the cancelRequest leg: a warn note 'Waiting for {vendor} — N days left' plus a 'Cancel request' form posting cancelLockRequest, mirroring the existing `.vact note` clash arm (:140-156).

### 24 · `apps/web/app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx`
The ★ Chosen ribbon (:589) gets a sibling for status==='requested' ('◷ Asked'). The per-tile lockedCount (:1158) gains a requestedCount computed the same way. Add a `.st-requested` rule to the scoped CSS (:397-408) — an unmatched `st-${state}` class silently renders as an unstyled dashed circle, which is the failure this line prevents.

### 25 · `apps/web/lib/coverage-strip.ts`
Add 'requested' to the CoverageState union (:36) and a glyph to COVERAGE_GLYPH (:39-45, use ◑). coverageStateOf (:80-91) precedence becomes covered → locked → **requested** → build → vendors → empty. CRITICAL: timelineStatusForTile (:107-122) must map 'requested' to childState 'considering', NOT 'finalized' — mapping it like 'locked' gives it URGENCY_RANK 4 (least urgent) and sinks the tile the couple most needs to chase to the far end of the strip. coverageBadgeOf (:184-193) precedence: covered → locked → requested → build. folderSummaryOf (:217-232) must NOT drop a requested tile from 'N to decide' (its `if (!t.covered && t.lockedCount === 0)` stays as-is) and gains a separate 'N waiting' pill.

### 26 · `apps/web/lib/explore-info-copy.ts`
Every strip string lives here and §11 rule 3 forbids putting it in JSX. Add the legend entry (:63-75), a new arm in the per-tile aria-label ladder (:90-109 — its final else says 'not started', which is exactly wrong for a request), the 'N waiting' folder pill (:112-115), the CTA copy ('Lock this' → 'Ask to book' when the flag is on; CARD_LOCKING is already 'Requesting…' at :220-221), and UPDATE THE HANDSHAKE LINE at :53-55 — its own docblock at :25-28 names PR-H as the owner of that update.

### 27 · `apps/web/lib/vendors-plan-budget.ts`
Add 'waiting' to ChildState and make childStateOf (:525-532) return locked → waiting → considering → empty. timelineStatusOf (:509-523) must keep 'waiting' at considering-level urgency, not 'locked'.

### 28 · `apps/web/app/dashboard/[eventId]/vendors/_components/build-locked.tsx`
'Your team'. The reserved slot at :387 (`{/* 2 · handshake-in-progress — the slot PR-H's tracker lands in. */}`) gets the tracker: a warn-tinted 'Waiting for the vendor' section, one row per pending request, each with a Clock pill 'Asked N days ago · N days left' and a 'Cancel request' form. Replace the LOCAL locked-status Set (:55) with lockRequestStateOf so this surface cannot drift from the bench. Split toLockRows so a requested row moves OUT of 'In your build — ready to lock' (it would otherwise offer 'Lock to confirm' on a booking already awaiting an answer).

### 29 · `apps/web/lib/your-team.ts`
(a) stillNeedsDecision (:101-113) currently drops every group in lockedGroupIds; add requestedGroupIds to the same exclusion so a category with a live request is not double-listed — it belongs in the waiting tracker, not the decision list. (b) teamMoney (:156-185) gains a THIRD bucket `requestedCentavos`; Buffer = budget − locked − requested − candidates. Counting an un-agreed request as Locked tells the couple money is committed that no vendor accepted; counting it as a candidate says it is still optional. Both are lies. Stays a pure core (already registered).

### 30 · `apps/web/app/dashboard/[eventId]/vendors/_components/team-summary-chip.tsx`
Report three counts — '{N} locked · {N} waiting · {N} in build' — in the visible chip (:77, :105) AND the screen-reader summary (:114). This is the only 'Your team' signal on a phone.

### 31 · `apps/web/app/dashboard/[eventId]/vendors/_components/accordion-lock.tsx`
(a) Add `| { kind: 'requested'; vendorName: string; expiresAt: string }` and `| { kind: 'request_conflict'; … }` to the LockState union (:69-124). (b) The success handler (:282-315) currently jumps straight to the congratulations toast — branch on result.status==='lock_requested' to show a REQUEST toast instead, and do NOT set askDone (:296-299), which pins the toast open asking the couple to declare a category finished before anyone agreed. (c) performUndo (:422-433) calls cancelLockRequest instead of revertVendorToConsidering when the state is 'requested'. (d) The ConflictSheet (:873-932) gets the request wording: today it says '{X} is already locked for {group}' / 'Switch to {Y}' — for a pending rival it must read 'You've already asked {X} for {group}. Cancel that request and ask {Y} instead?'. (e) The inline waiting note copies the SHIPPED 'proposed' arm at :124/:413-417/:471-478 verbatim in shape — a terracotta role="status" paragraph — rather than inventing a sixth waiting visual.

### 32 · `apps/web/app/dashboard/[eventId]/vendors/_components/lock-milestone.tsx`
Both post-lock experiences promise finality the handshake does not deliver. Under the flag: the toast (:154-156, :158) becomes 'Sent! {vendor} has 7 days to answer.' with no 🎉 and no 'Your wedding date is now locked in'.

⚠ **THE MODAL COPY IS REWRITTEN BY OWNER ANSWER 6.1.** The previously-specified string — *"You're asking {vendor} to hold {date}. Your date is set only once they agree."* — **must NOT be used.** It states the model the owner did not pick: it makes one vendor's answer the thing that sets the date. The owner's model is that the date becomes final when the candidate set collapses to one. Say that instead:

> **'{date} is the only date left that works for everyone you've booked. If {vendor} takes it, that date is final.'**

The `events.event_date` / `event_date_precision` write still moves off the request path, but it is **not** "deferred to vendorAgreeToLock" — the narrowing is **re-evaluated** there (§3 site 13 item 3), and it may legitimately produce nothing. Flag OFF: both strings unchanged.

### 33 · `apps/web/app/dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx`
(a) The hero pill (:1061-1064) renders an UNCONDITIONAL green 'Locked' — there is no status branch at that element at all. Add one: state==='requested' ⇒ warn pill 'Waiting for {vendor}'. (b) inferStage (:182-226) returns null for anything outside the four confirmed statuses, so a requested booking shows the payment blocks with NO progress context — add a pre-stage 'Requested' and render it. Do NOT reach for workspace_status; its docblock (:185-197) says the column is never written in V1. (c) The action row (:1111-1140) gains a 'Cancel request' arm for state==='requested'. (d) SUPPRESS the payment stack (:1393-1450 — PaymentPlanStepper, ReservationTermsAck, DepositReservation) while a request is pending; step 3 has not happened. (e) canOfferInvite (:441-451) gates on the four confirmed statuses — leave it, a requested row correctly does not offer the claim invite yet.

### 34 · `apps/web/app/dashboard/[eventId]/vendors/_components/plan-budget-accordion.tsx`
The legacy (flag-OFF) accordion is NOT flag-gated and renders its own '✓ Locked' chip from its own isLocked (:80-82, :1381-1389, :1750-1753). A requested row is 'considering' there, so it would keep offering Lock. Add a request-aware arm: swap the CTA to a disabled 'Waiting for vendor' and suppress the hard-single 'add another' affordance (:1277, :1284) while a request is pending — otherwise the UI itself invites the second competing request.

### 35 · `apps/web/app/dashboard/[eventId]/vendors/page.tsx`
Fetch the request markers alongside the existing proposal fetch (:244-271) and thread requestedCount / the pending-request list into the coverage strip source (:1145-1203 via shortlist-categories), the buildSlot for BuildLocked (:1788-1822) and the bench. Mount the couple-side waiting strip beside WaitingForQuotes + PendingLockProposals (:1467-1468) — reuse WaitingForQuotes' shipped age formatter ('2d waiting') rather than writing a sixth one.

### 36 · `apps/web/app/dashboard/[eventId]/vendors/_components/team-controls.tsx`
Its Clear-candidates confirm body already promises 'anything mid-handshake' survives (:110) — a sentence written before the state existed. Make clearBuildPicks actually skip rows with a live request, or that shipped line becomes a lie the moment PR-H merges.

### 37 · `apps/web/lib/flag-chokepoint-scan.test.ts`
Extend the NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED FlagSpec (:104-124). `gates` += 'app/dashboard/[eventId]/wizard-actions.ts', 'app/vendor-dashboard/clients/[eventId]/page.tsx', 'lib/vendor-overview.ts', 'lib/lock-request-expiry.ts', 'lib/shortlist-taxonomy.ts', 'app/dashboard/[eventId]/vendors/_components/accordion-lock.tsx'. `pureCores` += 'lib/lock-request-state.ts'. `locals` += 'requestFlow' if any new file uses that name — the check only knows the names in this array, so a bypass written as `const enabled = true` passes silently.

### 38 · `supabase/security/exposure-surface.baseline.txt`
Regenerate with `pnpm --filter @setnayan/web exposure:baseline` and commit IN THE SAME PR, or exposure-freeze.db.test.ts fails on the five new function lines. ⚠ REBASE ON origin/main FIRST — this worktree's copy says '# facts: 6176' vs main's 6197 and is missing two merged migrations; regenerating from here deletes 21 facts, which the freeze passes SILENTLY as a narrowing and would clobber vendor_reuse_requests. Read the diff: every new function line must read anon=- , never anon=SIU.

### 39 · `apps/web/tests/db/user-fk-behaviour.generated.txt + apps/web/tests/db/ugat-*.baseline.txt`
Regenerate rather than hand-edit. No new FKs are introduced (no actor column, by design), so user-fk-behaviour should be unchanged — if it moves, something added a user reference that was not planned. Run ugat-schema-claims.db.test.ts and ugat-concept-coverage.db.test.ts; the columns land on an already-mapped table in the parked `event_vendor_*` family so concept-coverage should stay green, but if a Package/Proposal/Contract node claim states the booking lifecycle has no request step, rewrite that claim.

### 40 · `changelog.d/pr-h-lock-request-handshake.md`
NEW fragment file (never edit CHANGELOG.md or STATUS.md in a feature PR). Dated `## YYYY-MM-DD · feat(booking): the vendor now has to agree before a lock is a booking (PR-H, flag-dark)` with a `SPEC IMPACT:` line — non-None: add a DECISION_LOG row recording that the couple's Lock is a request, that requests expire in 7 days, and that the wedding-date finalize moved to the vendor's agreement.

## 4 · UI plan
- VENDOR · Overview 'What's new' card (the primary surface). New WhatsNewCard kind 'lock_request', terracotta eyebrow 'Lock request — agree?', title '{Event} · {date}', a money line when the anchor carries a total, an age/fuse line 'Asked 2 days ago · 5 days left to answer', a primary `<form action={agreeLock}>` with hidden event_id + vendor_id and `<SubmitButton pendingLabel="Agreeing…">Agree to this booking</SubmitButton>`, a `<details>` 'Can't take this booking?' holding the decline form with an optional reason (maxLength 200), and a secondary 'View' link. Copy the LockBody shape exactly — plain forms, hidden inputs, no client JS.
- VENDOR · Overview 'Ongoing' task. Every request ALSO pushes an OngoingTask 'Agree (or decline) the booking from {event}' with awaitingChip(requestedAt) → 'Awaiting you 3 days'. Adding only the card leaves the vendor's open-task list under-reporting, and this chip is where the 7-day fuse becomes visible to a human.
- VENDOR · Client detail page. The same agree/decline pair rendered ABOVE the deposit card, with the deposit card SUPPRESSED while the request is pending (nothing to pay yet). The `?lock_agree=` / `?lock_decline=` outcome banners render OUTSIDE the card, because a successful agree or decline erases the card that hosted the button.
- VENDOR · loser outcomes, never a raw Postgres string and never a control that demotes a rival. group_taken ⇒ 'The couple has already booked another {category}. This request is closed.' not_verified ⇒ 'Finish your verification to accept bookings.' slot_full ⇒ 'That window filled up — ask the couple to pick another time.' closed ⇒ 'This request was withdrawn.' All read-only.
- COUPLE · the moment they press Lock. The button's pending label is ALREADY 'Requesting…'. On success: NOT the congratulations toast. A request toast — 'Sent! {vendor} has 7 days to answer.' — with an Undo that cancels the request, no 🎉, no 'Your wedding date is now locked in', and no 'done or add another?' question (that pins the toast open asking the couple to close a category before anyone agreed).
- COUPLE · the date modal. ⚠ **REWRITTEN BY OWNER ANSWER 6.1 — the string previously specified here ("Your date is set only once they agree") must NOT be used.** The date is not set by a vendor's answer; it is final when the candidate set collapses to one. 'This locks your wedding date… the date becomes official' becomes **'{date} is the only date left that works for everyone you've booked. If {vendor} takes it, that date is final.'** The write moves off the request path, and the narrowing is RE-EVALUATED at agree (it may produce nothing, or a different date — in which case the couple is asked again, never silently given a date they did not confirm).
- VENDOR · the day-5 nudge (owner answer 6.3). No new surface — it reuses the SAME 'Lock request — agree?' Overview card and the same email lane; only the notification and its subject line are new ('{Couple} is still waiting. You have 2 days left to answer.'). Fires once per request, never daily, because `lock_request_nudged_at` is stamped.
- COUPLE · bench card. Third state between plain and ★ Chosen: a '◷ Asked' corner mark, a warn note 'Waiting for {vendor} — 5 days left', and a 'Cancel request' action. Card actions must NOT all disappear (the shipped locked branch returns NO_ACTIONS), or the Undo the spec requires has nowhere to live.
- COUPLE · 'Your team'. The reserved slot in build-locked.tsx becomes a 'Waiting for the vendor' section between 'Locked in' and 'In your build', one row per request with a Clock pill and Cancel. A requested vendor leaves 'ready to lock' (it must not offer 'Lock to confirm' again) and leaves 'Still needs your decision' (it is decided, just unanswered).
- COUPLE · the three money tiles. A third bucket. Buffer = budget − locked − REQUESTED − candidates. Counting a request as Locked claims money no vendor accepted; counting it as a candidate claims it is still optional.
- COUPLE · mobile team chip. '{N} locked · {N} waiting · {N} in build' in both the visible chip and the screen-reader summary — the only 'Your team' signal on a phone.
- COUPLE · Coverage Strip. Sixth state 'requested' with glyph ◑ and its own CSS class, its own legend line, its own aria-label arm, its own folder pill 'N waiting'. Urgency rank must sit with 'considering', NOT with 'locked' — otherwise the tile the couple most needs to chase sinks to the quiet end of the strip and NEXT skips it.
- COUPLE · vendor workspace. The unconditional green 'Locked' hero pill gets a warn 'Waiting for {vendor}' branch; the 3-stage stepper gains a 'Requested' pre-stage (it currently renders NOTHING for a non-confirmed status); a 'Cancel request' action; and the whole payment stack hidden until the vendor agrees.
- REUSE, DO NOT INVENT. Five 'awaiting' vocabularies already ship. Use the deposit-reservation warn pill + Clock ('Date held · awaiting vendor confirmation' → 'Waiting for {vendor} to agree'), the WaitingForQuotes age formatter ('5d waiting'), the terracotta PendingLockProposals section shape, and the accordion's existing 'Proposed to the couple — …' inline role="status" note. A sixth visual is the defect.

## 5 · Test plan
- DB · the request does not touch the status ladder. After request_vendor_lock returns {status:'ok'}: assert `status = 'considering'` (positively, by value) AND `lock_requested_at IS NOT NULL` AND `lock_agreed_at IS NULL`. This is the spec's headline rule and the only test that proves it.
- DB · TWO COMPETING REQUESTS IN ONE HARD-SINGLE CATEGORY. Request vendor A (reception_venue) ⇒ 'ok'. Request vendor B (venue, same hard_single_group) ⇒ {status:'group_taken'} — a RETURNED status, not a raised 23505. Then assert `SELECT count(*) FROM event_vendors WHERE event_id=… AND hard_single_group='reception_venue' AND lock_requested_at IS NOT NULL AND lock_agreed_at IS NULL AND lock_request_closed_at IS NULL` = 1. Exactly one pending request survives.
- DB · a MULTI-pick category is unaffected. Two concurrent requests in 'music_entertainment' (not a hard-single group, hard_single_group IS NULL) both return 'ok' and both rows read as pending. Guards against a request index that is accidentally global.
- DB · agree is single-winner and idempotent. Call agree_vendor_lock_request twice. First ⇒ {status:'ok'}; capture lock_agreed_at. Second ⇒ {status:'already'} and `lock_agreed_at` is BYTE-IDENTICAL to the captured value (not merely 'it did not throw'). Then assert `status = 'contracted'`.
- DB · the two indexes are disjoint — no row can sit in both. After the agree fixture: `SELECT count(*) FROM event_vendors WHERE lock_requested_at IS NOT NULL AND lock_agreed_at IS NULL AND lock_request_closed_at IS NULL AND status IN ('contracted','deposit_paid','delivered','complete')` = 0.
- DB · index inventory. `SELECT indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND indexname IN ('event_vendors_hard_single_lock_uniq','event_vendors_hard_single_request_uniq')` returns 2 rows; BOTH indexdefs contain 'package_role'; the request one contains 'lock_agreed_at IS NULL'. And assert those two literal names are exactly the set the TypeScript detector matches on (export the names as one const from actions.ts and compare) — the detector is a SUBSTRING match, so a renamed index falls through to a raw Postgres string on the couple's screen with nothing failing.
- DB · package cascade. Lock a 3-line package under the flag: assert exactly ONE row has lock_requested_at set and it is the `package_role='anchor'` row; assert the two covered rows have lock_requested_at NULL. Then agree on the anchor and assert ALL THREE rows read `status='contracted'` (count = 3). A partial cascade shows the couple one line booked and the rest still considering.
- DB · the couple cannot forge the vendor's answer. As role `authenticated`, raw-UPDATE lock_agreed_at ⇒ raises 42501; then assert `lock_agreed_at IS STILL NULL` (post-condition, not just 'it threw'). Repeat for lock_request_closed_at and lock_request_closed_reason — a couple must not be able to write 'the vendor declined'.
- DB · decline frees the category. decline_vendor_lock_request(A, 'fully booked') ⇒ {status:'ok'}; assert `lock_request_closed_at IS NOT NULL AND lock_request_closed_reason='declined' AND lock_request_note='fully booked' AND status='considering' AND lock_agreed_at IS NULL`. THEN request vendor B in the same hard-single group ⇒ {status:'ok'} — the positive proof that closing releases the slot.
- DB · an agreed request is FINAL. decline after agree ⇒ {status:'already_agreed'}; cancel after agree ⇒ {status:'already_agreed'}; and assert lock_agreed_at and status are unchanged by both calls. Mirrors reject_vendor_deposit's already_confirmed rule.
- DB · expiry writes, and only to the right rows. Seed one request aged 8 days and one aged 6. Call expire_stale_lock_requests(7) ⇒ envelope reports expired = 1 and its `rows` array carries the 8-day row's event_vendor_id + event_id. Assert the 8-day row reads closed_reason='expired' and the 6-day row still reads `lock_request_closed_at IS NULL`. Then assert a rival request in the expired row's hard-single group now succeeds.
- DB · ownership gates. request_vendor_lock from a user who is neither couple nor coordinator on the event ⇒ raises 42501 'not_your_event'. agree_vendor_lock_request from a vendor who does not own the booking ⇒ raises 42501 'not_your_booking'. Both are RAISEs, matching step 5 — authorization is the ONE thing that is never a returned status.
- DB · anon cannot reach any of the five functions. Assert the four user RPCs have no anon EXECUTE and expire_stale_lock_requests has neither anon nor authenticated. Verify apps/web/tests/db/anon-rpc-surface.baseline.txt does NOT grow — the CI guard fails on any new anon-callable SECDEF without a stated reason.
- UNIT · lock-request-state.ts with enabled=false is byte-identical to today. A table of ~10 rows (confirmed / considering / with markers / without) asserting that every verdict equals the current 'is it in CONFIRMED_VENDOR_STATUSES' answer. This is the flag-OFF identity proof for the whole read model in one test.
- UNIT · a legacy or Locked-QR booking never shows a phantom 'waiting'. A row with status='deposit_paid' and lock_requested_at NULL returns 'locked', with enabled=true. Derive, never backfill.
- UNIT · the coverage strip's new state is complete, not half-wired. Assert `Object.keys(COVERAGE_GLYPH)` covers every CoverageState member; assert the legend array length equals the glyph count; assert the aria-label builder returns a non-default string for 'requested' (its final else says 'not started', which is exactly wrong); and string-scan shortlist-categories.tsx for a `.st-requested` rule — an unmatched `st-${state}` class renders as an unstyled dashed circle and nothing else catches it.
- UNIT · urgency. `timelineStatusForTile({state:'requested'})` yields a rank STRICTLY MORE urgent than `'locked'`. A request that sorts with 'locked' sinks the tile the couple most needs to chase.
- UNIT · the money never lies. teamMoney with one locked + one requested + one candidate returns three distinct buckets and Buffer = budget − locked − requested − candidates.
- UNIT · every hard-single group behaves the same. Extend the existing loop at apps/web/lib/bench-card-actions.test.ts:193 over HARD_SINGLE_PICK_GROUPS: a 'requested' vendor returns lockGroupId === null AND cancelRequest !== null in every group. Extend, do not write a new file.
- UNIT · the flag registry. flag-chokepoint-scan.test.ts must stay green with the six new gate paths and lib/lock-request-state.ts in pureCores. It asserts exactly one env reader (adding a second flag or a second reader fails), that every gate still CALLS isLockHandshakeEnabled(), and that the pure core does not.
- UNIT · notifications are wired end to end. Assert all **five** new types are keys in NOTIFICATION_TYPE_LABEL and NOTIFICATION_TYPE_TONE (typecheck already forces this, but assert at runtime so the failure names the type) and all **five** are members of EMAIL_ENABLED_TYPES — a new type is in-app-only by default, which for a 7-day fuse is a silent product bug, and for the nudge defeats its entire purpose.
- DB · THE DATE IS NOT SET BY A REQUEST (owner answer 6.1). Seed an event with `event_date IS NULL` and TWO candidate dates where the target vendor's calendar rules one out — i.e. the set would collapse to one. Press Lock under the flag. Assert `events.event_date IS STILL NULL` and no `date_status='locked'` write happened. This is the positive proof that asking a vendor cannot finalize a wedding date; without it the shipped gate silently does exactly that (it adds the un-agreed target to the constraining set explicitly).
- DB · the date IS set when the set collapses at AGREE. Same fixture; the vendor agrees. Assert `events.event_date` now equals the single viable candidate and precision is 'day'. Then re-run agree ⇒ 'already' and assert the date is BYTE-IDENTICAL (not merely non-null).
- DB · a STALE date confirmation is refused. Seed the request with confirmed key X; before agreeing, mutate the candidate set so the collapse now yields Y. Agree. Assert `events.event_date IS STILL NULL` (the couple is asked again) and specifically that it is NOT Y — a couple must never be handed a date they did not confirm.
- DB · the nudge fires once, at day 5, and never after an answer. Seed requests aged 6, 4 and 6-but-already-agreed. `nudge_stale_lock_requests(5)` ⇒ exactly ONE row returned (the live 6-day one); assert `lock_request_nudged_at` is now set on it and NULL on the other two. Call it again ⇒ ZERO rows and the stamp is byte-identical — the daily sweep must not re-nudge from day 5 to day 7.
- DB · nudge-before-expire in one pass. Seed a single request aged 8 days that has never been nudged, then run the sweep body once. Assert the vendor received a nudge AND the row then expired — proving the ordering, since an expire-first implementation returns zero nudges here and the vendor is never warned.
- INTEGRATION · flag OFF is byte-identical. With NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED unset, run finalizeVendor, lockPackage and bookVendorAtChatLock against fixtures and assert each produces `status='contracted'` AND `lock_requested_at IS NULL` AND the booking fee call site fired exactly where it fires today. Then flip the env and assert each produces `status='considering'` AND `lock_requested_at IS NOT NULL` AND no fee call.
- CI HOUSEKEEPING · exposure-freeze.db.test.ts green after regenerating the baseline ON TOP OF a fresh origin/main (this worktree is 21 facts behind), with the new function lines reading anon=- . user-fk-behaviour.generated.txt unchanged (no new FKs, by design — if it moves, an actor column crept in). erasure coverage-guardrail G3 and export-coverage-guardrail T1/T4 unchanged (no new subject-bearing table). Both ugat db-tests green. check-migration-timestamps.mjs green with prefixes allocated by `pnpm migration:new` above origin/main's 20271103100614.

## 6 · 🔒 OWNER DECISIONS — ANSWERED 2026-08-04

All four were answered. Three confirm the design. **One replaces it.**

### 6.1 · THE WEDDING DATE — ⚠ THE ANSWER IS NEITHER OPTION THAT WAS OFFERED

**Owner, verbatim:** *"upon finalization of date. the event can starts with multiple dates until it becomes one date. then that date becomes final."*

The question asked whether the date fixes when the couple **asks** or when the vendor **agrees**. The
owner answered with a third model: **an event holds MULTIPLE candidate dates and NARROWS. The date
becomes final when the set collapses to ONE.** That is a property of the **event**, not of any one
vendor's answer.

**🔑 THIS ALREADY SHIPS — DO NOT BUILD IT.** `lib/candidate-dates.ts`'s own docblock states the model
verbatim: the couple commits candidates at onboarding, locking vendors narrows the set to the days
every locked vendor is free on, *"When exactly one candidate survives, the next vendor lock can
finalize the wedding date."* The gate is `intersectViableCandidates(...)` → `viable.length === 1` in
`finalizeVendor`, which returns `date_will_lock` for confirmation and then writes the date in the
post-lock block. **The narrowing engine is the mechanism. PR-H consumes it; PR-H does not replace it.**

**What this OVERTURNS in this spec.** The design moved the date write to `vendorAgreeToLock` (§3
site 13 item 3) and rewrote the modal to *"your date is set only once they agree"* (§3 site 32).
**Both are now wrong** — they make the date a function of one vendor's answer, which is precisely the
model the owner did not pick. Corrected build rules:

1. **At REQUEST time — do NOT run the date gate and do NOT write a date.** A request does not change
   the confirmed set, so nothing has narrowed. ⚠ **This is a real defect in the shipped code path, not
   a no-op:** the gate adds `targetVendor.marketplace_vendor_id` to `profileIds` **explicitly**, so it
   constrains on a vendor who has not agreed. Left alone under the flag, pressing Lock would finalise
   the wedding date off the availability of a vendor who may decline. Skip the whole gate when
   `isLockHandshakeEnabled()`.
2. **At AGREE time — RE-RUN the narrowing, do not replay a stored decision.** Once the row is
   confirmed the vendor is legitimately in the locked set. Recompute `intersectViableCandidates`; if
   it collapses to exactly one **and** `events.event_date IS NULL`, finalize. Frame it correctly in
   your head: the set collapsed, and the agreement is what collapsed it — the vendor did not "set the
   date".
3. **Keep the existing `.is('event_date', null)` guard.** The shipped write never clobbers an existing
   date, and it must keep not clobbering one.
4. **The couple's date copy must describe narrowing, not agreement.** Not *"your date is set once they
   agree"*. Closer: *"You have one date left that works for everyone you've booked. Booking {vendor}
   would make {date} final."*

> #### 🔴 NEW HIGH — the owner's answer CREATES a defect the review could not have found
> **The couple's date consent is captured up to 7 days before the date is computed.** Today
> `confirm_date_lock` is collected in the same request that writes the date, so what the couple
> confirmed and what got written are the same thing. Under the handshake the couple confirms at ASK
> time and the collapse is evaluated at AGREE time — **days later, against a viable set that can have
> changed** (another vendor's calendar moves, another lock lands, a candidate passes). The couple can
> confirm date X and be given date Y, silently.
> **Rule: a stale confirmation is not a confirmation.** At agree time, only auto-finalize if the
> collapsed date is **byte-identical to the one the couple confirmed** (persist the confirmed key with
> the request). If it differs, write nothing and notify the couple to re-confirm. Never widen the
> `.is('event_date', null)` guard to cover this — that guard answers a different question.

### 6.2 · SEVEN DAYS — ✅ CONFIRMED
**Owner: 7 days MAX.** No change; `p_days DEFAULT 7` stands as the RPC's default.

### 6.3 · A DAY-5 NUDGE — ✅ ORDERED (this ADDS scope)
**Owner: nudge on day 5.** Without it a vendor who never logs in simply times out and the couple is
told "no answer" — and there is no SMS in V1, so email plus one in-app card is the whole channel.

**This overturns §2's "NOT BUILT ON PURPOSE — no reminder-before-expiry nudge."** Build it, and build
it on the sweep that already exists rather than a second scheduled signal:

- **A SIXTH COLUMN — `event_vendors.lock_request_nudged_at TIMESTAMPTZ`.** Without it the daily sweep
  re-nudges every day from day 5 to day 7. Trigger-guarded with the other vendor-set markers.
  ⚠ §1 says "five nullable markers" — **it is six.** Same class, no actor column, no new FK, so the
  erasure/export guardrail reasoning in §1 is unchanged.
- **One sweep, two actions.** `expire_stale_lock_requests` already scans live requests daily. Add
  `nudge_stale_lock_requests(p_days DEFAULT 5, p_limit DEFAULT 200)` in the same file and call both
  from `runLockRequestExpirySweep`. **Nudge BEFORE expire in the same pass**, or a request that
  crosses both thresholds between two sweeps expires having never nudged.
- **A fifth notification type** `lock_request_nudge` (vendor). Label 'Lock request — 2 days left',
  tone warn, **in `EMAIL_ENABLED_TYPES`** — the entire point is reaching a vendor who is not in the
  app. Body: '{Couple} is still waiting. You have 2 days left to answer.'
- **Do not send a nudge for a request that is already answered or closed** — the same
  `lock_agreed_at IS NULL AND lock_request_closed_at IS NULL` predicate as the expiry scan.

### 6.4 · THE PRINTED LOCKED QR STAYS A ONE-STEP BOOKING — ✅ CONFIRMED
**Owner: confirmed.** Scanning a vendor's own printed Locked QR books instantly with no agree step —
the vendor already agreed by printing it. §3 site 12's exemption stands exactly as written, including
the requirement to write the exemption down in a comment.

## 7 · The migration

> ## ⚠ THIS SQL PREDATES THE OWNER'S ANSWERS — DO NOT PASTE IT AS-IS
>
> The block below was written before 2026-08-04's four answers. It is still the right SHAPE, but it
> is **incomplete in three specific ways**, all from owner answer 6.3 (the day-5 nudge):
>
> 1. **Missing the sixth column** `lock_request_nudged_at TIMESTAMPTZ`. Add it beside the other five
>    and include it in the guard trigger's vendor/service_role-only column list — a couple must not be
>    able to stamp "already nudged" and mute the reminder.
> 2. **Missing the fifth RPC** `nudge_stale_lock_requests(p_days DEFAULT 5, p_limit DEFAULT 200)`.
>    Clone `expire_stale_lock_requests` exactly — same `FOR UPDATE SKIP LOCKED`, same 200 bound, same
>    `lock_agreed_at IS NULL AND lock_request_closed_at IS NULL` predicate — but stamp
>    `lock_request_nudged_at` instead of closing, and add `AND lock_request_nudged_at IS NULL` so it
>    fires once per request rather than every day from 5 to 7.
> 3. **The ENUM file needs a fifth value** — `lock_request_nudge`. Still its own migration file, still
>    no BEGIN/COMMIT.
>
> Neither addition changes the §1 guardrail reasoning (no actor column, no new FK, no new table), and
> the `DO $$` post-condition should be extended to assert the sixth column and fifth function exist.
> **Also re-read the §9 review before building any of this** — 14 HIGH plan defects are still open and
> several of them change this SQL.

```sql
-- ============================================================================
-- FILE 1 OF 2 — save as:
--   supabase/migrations/20271104217480_notification_type_lock_request.sql
--
-- ⚠ ALLOCATE THE REAL PREFIX WITH `pnpm migration:new` AFTER `git fetch origin`.
--   origin/main's head is 20271103100614_vendor_reuse_requests.sql; this
--   worktree's newest local file (20271103100000) already sorts BELOW it, so a
--   hand-picked low prefix merges GREEN and creates NOTHING. The values here
--   are a floor, not a blessing.
--
-- WHY ITS OWN FILE: notification_type is a Postgres ENUM, not a text CHECK
-- (20260513160000_iteration_0028_notifications.sql:25-31). Postgres forbids
-- USING a newly-added enum value in the same transaction that adds it, so this
-- file contains ONLY the ALTER TYPEs and carries NO BEGIN/COMMIT — the exact
-- shape of 20270904548818_notification_type_papic_challenge_pending.sql:9-15.
-- ============================================================================

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'lock_request_received';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'lock_request_agreed';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'lock_request_declined';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'lock_request_expired';


-- ============================================================================
-- FILE 2 OF 2 — save as:
--   supabase/migrations/20271104217481_lock_request_handshake.sql
--
-- PR-H · THE MISSING STEP 2 OF THE LOCK HANDSHAKE
--   couple locks (a REQUEST) → *** VENDOR AGREES *** → vendor sends payment
--   request → couple pays + screenshot → vendor accepts payment → LOCKED
--
-- ORTHOGONAL MARKERS (owner lock, restated): we do NOT repurpose the
-- event_vendors.status enum. "Requested-but-unagreed" and "vendor-agreed" are
-- nullable timestamp/text columns orthogonal to the status ladder — the exact
-- precedent set by contract_signed_at (20270217864104) and by
-- deposit_recorded_at / deposit_acknowledged_at (20270320429117:15-18).
--
-- THE RPCs ARE MODELED EXACTLY ON acknowledge_vendor_deposit()
-- (20270320429117:60-137): ownership gate → SELECT … FOR UPDATE → precondition
-- → atomic UPDATE repeating the precondition in its WHERE → GET DIAGNOSTICS →
-- idempotent graceful re-call. Ordinary out-of-order / duplicate calls are
-- RETURNED STATUSES; only authorization and a vanished row RAISE.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS · CREATE INDEX IF NOT EXISTS ·
-- CREATE OR REPLACE FUNCTION · DROP TRIGGER IF EXISTS before CREATE TRIGGER.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1 · Orthogonal lock-request markers on the booking ledger.
--     Nullable timestamps/text — NOT new status enum values, and deliberately
--     NO actor column: an actor uuid would drag this table into a fresh
--     erasure (G3) and export (T1) decision, and BOTH escape hatches are
--     closed (UNDECIDED_BACKLOG empty @ high-water 0; KNOWN_GAPS at 90/90).
--     Step 5 has no actor column either — deposit_acknowledged_at records
--     WHEN, not WHO. We match it on purpose.
-- ----------------------------------------------------------------------------

ALTER TABLE public.event_vendors
  ADD COLUMN IF NOT EXISTS lock_requested_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lock_agreed_at             TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lock_request_closed_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lock_request_closed_reason TEXT,
  ADD COLUMN IF NOT EXISTS lock_request_note          TEXT;

COMMENT ON COLUMN public.event_vendors.lock_requested_at IS
  'Set by the COUPLE via request_vendor_lock(). "I am ASKING this vendor to take my booking" — a REQUEST, not a booking (owner ruling 2026-07-27). NULL = no live request. Orthogonal to status: the row stays ''considering'' until the vendor agrees. The ~7-day expiry deadline is DERIVED from this timestamp; the sweep then WRITES lock_request_closed_at so the pending index actually releases the hard-single slot.';

COMMENT ON COLUMN public.event_vendors.lock_agreed_at IS
  'Set by the VENDOR via agree_vendor_lock_request() — "yes, I will take this booking". The same statement flips status to ''contracted''. Single-winner DEFINER transition (FOR UPDATE + precondition), never a 2-way write, and non-forgeable by the couple via the event_vendors_guard_lock_agreement trigger. Agreeing moves NO money — the syncing fee and the schedule reservation stay at STEP 5 (vendor accepts payment).';

COMMENT ON COLUMN public.event_vendors.lock_request_closed_at IS
  'The request ended WITHOUT agreement. Set by decline_vendor_lock_request (vendor), cancel_lock_request (couple Undo), expire_stale_lock_requests (7-day sweep), or the supersede branch inside agree_vendor_lock_request. Leaves lock_requested_at intact as history, and drops the row out of event_vendors_hard_single_request_uniq so the category is free again.';

COMMENT ON COLUMN public.event_vendors.lock_request_closed_reason IS
  'declined = the vendor said no · expired = nobody answered in ~7 days · cancelled = the couple withdrew (the Undo) · superseded = the couple locked someone else in this hard-single category first. Four reasons because they are four different sentences to a human; conflating them is how ''TOKEN PURCHASE AWAITING PAYMENT'' once reached a couple paying in pesos.';

COMMENT ON COLUMN public.event_vendors.lock_request_note IS
  'Optional vendor-written reason attached to a decline (<=500 chars). Vendor-set only — trigger-guarded alongside lock_agreed_at / lock_request_closed_at / lock_request_closed_reason.';

DO $constraints$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'event_vendors_lock_request_close_coherent'
       AND conrelid = 'public.event_vendors'::regclass
  ) THEN
    ALTER TABLE public.event_vendors
      ADD CONSTRAINT event_vendors_lock_request_close_coherent
      CHECK (
        (lock_request_closed_at IS NULL) = (lock_request_closed_reason IS NULL)
        AND (
          lock_request_closed_reason IS NULL
          OR lock_request_closed_reason IN ('declined','expired','cancelled','superseded')
        )
      );
  END IF;
END;
$constraints$;

-- ----------------------------------------------------------------------------
-- 2 · THE HARD-SINGLE ANSWER — a SECOND partial unique index, disjoint from
--     the existing one. DO NOT touch event_vendors_hard_single_lock_uniq:
--     its owning migration (20271009160000) ends in a DO $$ post-condition
--     that re-reads pg_indexes and RAISEs if the definition stops mentioning
--     package_role.
--
--     The shipped index covers CONFIRMED rows only
--     (status IN contracted/deposit_paid/delivered/complete), so it cannot see
--     a pending request — a request row is still ''considering''. Widening it
--     is WRONG: a row would then collide with itself during the agree
--     transition (requested → contracted).
--
--     Instead: two indexes with MUTUALLY EXCLUSIVE predicates. The
--     `status NOT IN (…confirmed…)` clause below is what guarantees the
--     disjointness, so agree_vendor_lock_request's single UPDATE moves the row
--     out of this index and into the confirmed one atomically.
--
--     package_role IS DISTINCT FROM 'covered' and archived_at IS NULL are
--     copied verbatim from the shipped index — a package cascade writes N rows
--     sharing a category and only the ANCHOR carries the request.
-- ----------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS event_vendors_hard_single_request_uniq
  ON public.event_vendors (event_id, hard_single_group)
  WHERE hard_single_group IS NOT NULL
    AND archived_at IS NULL
    AND package_role IS DISTINCT FROM 'covered'
    AND lock_requested_at IS NOT NULL
    AND lock_agreed_at IS NULL
    AND lock_request_closed_at IS NULL
    AND status NOT IN ('contracted','deposit_paid','delivered','complete');

COMMENT ON INDEX public.event_vendors_hard_single_request_uniq IS
  'ONE live lock REQUEST per hard-single group per event (venue / ceremony venue / officiant / coordinator / host-MC / LED). Deliberately DISJOINT from event_vendors_hard_single_lock_uniq — that one covers CONFIRMED rows, this one covers PENDING requests, and the status NOT IN clause makes it impossible for a row to sit in both. Two couples merely REQUESTING the same category is what this stops; a request racing an already-CONFIRMED sibling is stopped by finalizeVendor''s existing fast-path read plus the confirmed index at agree time.';

CREATE INDEX IF NOT EXISTS event_vendors_pending_lock_request_idx
  ON public.event_vendors (marketplace_vendor_id, lock_requested_at DESC)
  WHERE lock_requested_at IS NOT NULL
    AND lock_agreed_at IS NULL
    AND lock_request_closed_at IS NULL
    AND archived_at IS NULL;

COMMENT ON INDEX public.event_vendors_pending_lock_request_idx IS
  'Read path for the vendor Overview "Lock request — agree?" feed (fetchLockAgreementRequests), mirroring how fetchLockRequests reads the step-5 markers.';

-- ----------------------------------------------------------------------------
-- 3 · Non-forgeability. A column-level REVOKE UPDATE does NOT close this:
--     both authenticated and anon hold a TABLE-WIDE UPDATE grant on
--     event_vendors, and a table-level UPDATE confers UPDATE on every column.
--     Same reasoning, same shape, as guard_event_vendor_deposit_ack
--     (20270323841750:22-71). A SEPARATE trigger, not an edit to that one.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.guard_event_vendor_lock_agreement()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $guard$
BEGIN
  IF (
       NEW.lock_agreed_at             IS DISTINCT FROM OLD.lock_agreed_at
    OR NEW.lock_request_closed_at     IS DISTINCT FROM OLD.lock_request_closed_at
    OR NEW.lock_request_closed_reason IS DISTINCT FROM OLD.lock_request_closed_reason
    OR NEW.lock_request_note          IS DISTINCT FROM OLD.lock_request_note
     )
     AND current_user IN ('authenticated', 'anon') THEN
    RAISE EXCEPTION 'lock agreement/closure is RPC-set only (agree_vendor_lock_request / decline_vendor_lock_request / cancel_lock_request / expire_stale_lock_requests)'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$guard$;

DROP TRIGGER IF EXISTS event_vendors_guard_lock_agreement ON public.event_vendors;
CREATE TRIGGER event_vendors_guard_lock_agreement
  BEFORE UPDATE ON public.event_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_event_vendor_lock_agreement();

COMMENT ON FUNCTION public.guard_event_vendor_lock_agreement() IS
  'BEFORE UPDATE guard: rejects any direct authenticated/anon PostgREST change to lock_agreed_at, lock_request_closed_at, lock_request_closed_reason or lock_request_note. Without it a couple could forge "the vendor agreed" (or "the vendor declined") through the column-unrestricted FOR ALL couple-write policy. lock_requested_at is deliberately NOT guarded — it is the COUPLE''s own signal, exactly as deposit_recorded_at is.';

-- ----------------------------------------------------------------------------
-- 4 · request_vendor_lock — COUPLE single-winner request RPC.
--     Why an RPC and not a plain UPDATE: (a) re-requesting after a decline has
--     to CLEAR the trigger-guarded closure columns; (b) the pending-index
--     23505 must become a readable status, not a raw Postgres string on the
--     couple's screen; (c) it is the one place that can be serialized.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.request_vendor_lock(
  p_event_id        UUID,
  p_event_vendor_id UUID,
  p_slot_id         UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status      TEXT;
  v_requested   TIMESTAMPTZ;
  v_agreed      TIMESTAMPTZ;
  v_closed      TIMESTAMPTZ;
  v_rows        INTEGER;
BEGIN
  -- Ownership — DEFINER + granted to authenticated, so gate explicitly.
  -- current_couple_or_coordinator_event_ids() is the SAME resolver the shipped
  -- vendor_lock_proposals INSERT policy uses; do not invent a new one.
  IF p_event_id NOT IN (SELECT public.current_couple_or_coordinator_event_ids())
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_your_event' USING ERRCODE = '42501';
  END IF;

  SELECT status::TEXT, lock_requested_at, lock_agreed_at, lock_request_closed_at
    INTO v_status, v_requested, v_agreed, v_closed
    FROM public.event_vendors
   WHERE vendor_id = p_event_vendor_id
     AND event_id  = p_event_id
   FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_found' USING ERRCODE = 'P0002';
  END IF;

  -- Already a real booking (legacy pre-flag lock, Locked-QR claim, or an
  -- agreed request). Not an error — the caller renders "already locked".
  IF v_status IN ('contracted','deposit_paid','delivered','complete') THEN
    RETURN jsonb_build_object('status', 'already_locked');
  END IF;

  -- IDEMPOTENCY: a re-press on a live request is a benign no-op.
  IF v_requested IS NOT NULL AND v_agreed IS NULL AND v_closed IS NULL THEN
    RETURN jsonb_build_object('status', 'already', 'requested_at', v_requested);
  END IF;

  BEGIN
    UPDATE public.event_vendors
       SET lock_requested_at          = NOW(),
           lock_agreed_at             = NULL,
           lock_request_closed_at     = NULL,
           lock_request_closed_reason = NULL,
           lock_request_note          = NULL,
           service_time_slot_id       = COALESCE(p_slot_id, service_time_slot_id),
           updated_at                 = NOW()
     WHERE vendor_id = p_event_vendor_id
       AND event_id  = p_event_id
       AND lock_agreed_at IS NULL
       AND status NOT IN ('contracted','deposit_paid','delivered','complete');
    GET DIAGNOSTICS v_rows = ROW_COUNT;
  EXCEPTION WHEN unique_violation THEN
    -- event_vendors_hard_single_request_uniq: this event already has a LIVE
    -- request in the same hard-single group. Returned, never raised, so the
    -- couple gets the "cancel that request and ask this one instead?" sheet.
    RETURN jsonb_build_object('status', 'group_taken');
  END;

  IF v_rows = 0 THEN
    SELECT status::TEXT, lock_requested_at INTO v_status, v_requested
      FROM public.event_vendors WHERE vendor_id = p_event_vendor_id;
    IF v_status IN ('contracted','deposit_paid','delivered','complete') THEN
      RETURN jsonb_build_object('status', 'already_locked');
    END IF;
    RETURN jsonb_build_object('status', 'already', 'requested_at', v_requested);
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'requested_at', NOW());
END;
$$;

REVOKE ALL ON FUNCTION public.request_vendor_lock(UUID, UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.request_vendor_lock(UUID, UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.request_vendor_lock(UUID, UUID, UUID) TO authenticated;

COMMENT ON FUNCTION public.request_vendor_lock(UUID, UUID, UUID) IS
  'The couple ASKS a vendor to take the booking (handshake step 1). Stamps lock_requested_at and clears any prior closure so a re-ask after a decline works. Does NOT touch status — the row stays ''considering'' until the vendor agrees. Serialized via FOR UPDATE; idempotent re-call returns status=already; a second live request in the same hard-single group returns status=group_taken instead of a raw 23505. Couple/coordinator-gated via current_couple_or_coordinator_event_ids(). No money, no reservation.';

-- ----------------------------------------------------------------------------
-- 5 · agree_vendor_lock_request — VENDOR single-winner agree RPC.
--     THE mirror of acknowledge_vendor_deposit. This is the ONE statement that
--     turns a request into a booking; it also carries the package cascade and
--     the two loser branches (group_taken / not_verified) as STATUSES so the
--     vendor never sees a raw Postgres string and is never handed a control
--     that demotes a rival's booking.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.agree_vendor_lock_request(
  p_event_vendor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id    UUID;
  v_status      TEXT;
  v_requested   TIMESTAMPTZ;
  v_agreed      TIMESTAMPTZ;
  v_closed      TIMESTAMPTZ;
  v_closed_why  TEXT;
  v_slot_id     UUID;
  v_package_id  UUID;
  v_capacity    INTEGER;
  v_date        DATE;
  v_precision   TEXT;
  v_used        INTEGER;
  v_event_ids   UUID[];
  v_rows        INTEGER;
BEGIN
  -- Ownership — the SAME resolver the step-5 RPC uses. Do not invent another.
  IF p_event_vendor_id NOT IN (SELECT public.current_vendor_event_vendor_ids())
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_your_booking' USING ERRCODE = '42501';
  END IF;

  SELECT event_id, status::TEXT, lock_requested_at, lock_agreed_at,
         lock_request_closed_at, lock_request_closed_reason,
         service_time_slot_id, event_vendor_package_id
    INTO v_event_id, v_status, v_requested, v_agreed,
         v_closed, v_closed_why, v_slot_id, v_package_id
    FROM public.event_vendors
   WHERE vendor_id = p_event_vendor_id
   FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF v_requested IS NULL THEN
    RETURN jsonb_build_object('status', 'not_requested');
  END IF;

  -- IDEMPOTENCY first: an already-agreed row re-reads as confirmed, so a
  -- double-click / retry keeps showing "agreed", never a red error page.
  IF v_agreed IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already', 'agreed_at', v_agreed,
                              'event_id', v_event_id);
  END IF;

  IF v_closed IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'closed', 'reason', v_closed_why);
  END IF;

  -- Slot capacity is consumed HERE, not at request time: acquire_service_time_slot
  -- counts occupancy on CONFIRMED statuses only, so a pending request holding a
  -- slot id reserves nothing. Re-check under the slot's own row lock.
  -- (Vendor-set day states are deliberately NOT re-checked: the vendor is the
  -- party who sets them and the party clicking Agree — agreeing on a day they
  -- blocked is an intentional override, not a bypass.)
  IF v_slot_id IS NOT NULL THEN
    SELECT slot_capacity INTO v_capacity
      FROM public.vendor_service_time_slots
     WHERE slot_id = v_slot_id AND is_active
     FOR UPDATE;
    IF v_capacity IS NULL THEN
      RETURN jsonb_build_object('status', 'slot_gone');
    END IF;

    SELECT event_date, event_date_precision INTO v_date, v_precision
      FROM public.events WHERE event_id = v_event_id;

    IF v_date IS NOT NULL AND v_precision = 'day' THEN
      SELECT array_agg(event_id) INTO v_event_ids
        FROM public.events
       WHERE event_date = v_date AND event_date_precision = 'day';

      SELECT count(*) INTO v_used
        FROM public.event_vendors
       WHERE service_time_slot_id = v_slot_id
         AND status IN ('contracted','deposit_paid','delivered','complete')
         AND archived_at IS NULL
         AND event_id = ANY (v_event_ids)
         AND vendor_id <> p_event_vendor_id;

      IF v_used >= v_capacity THEN
        -- The request stays OPEN — the couple can pick another window.
        RETURN jsonb_build_object('status', 'slot_full');
      END IF;
    END IF;
  END IF;

  BEGIN
    -- Preconditions repeated in the WHERE (defense in depth alongside FOR
    -- UPDATE). lock_agreed_at IS NULL is the single-winner gate. The row
    -- leaves event_vendors_hard_single_request_uniq and enters
    -- event_vendors_hard_single_lock_uniq in this ONE statement.
    UPDATE public.event_vendors
       SET status                    = 'contracted',
           lock_agreed_at            = NOW(),
           selection_match_rank      = 1,
           linked_vendor_profile_id  = marketplace_vendor_id,
           updated_at                = NOW()
     WHERE vendor_id = p_event_vendor_id
       AND lock_requested_at      IS NOT NULL
       AND lock_agreed_at         IS NULL
       AND lock_request_closed_at IS NULL;
    GET DIAGNOSTICS v_rows = ROW_COUNT;
  EXCEPTION
    WHEN unique_violation THEN
      -- event_vendors_hard_single_lock_uniq: the couple already CONFIRMED
      -- someone else in this category through another path (package cascade /
      -- chat lock / Locked-QR). Close this request and tell the vendor plainly.
      -- Writes NOTHING to the rival's row — a vendor must never be handed a
      -- control that demotes another vendor's booking.
      UPDATE public.event_vendors
         SET lock_request_closed_at     = NOW(),
             lock_request_closed_reason = 'superseded',
             updated_at                 = NOW()
       WHERE vendor_id = p_event_vendor_id
         AND lock_request_closed_at IS NULL;
      RETURN jsonb_build_object('status', 'group_taken', 'event_id', v_event_id);
    WHEN check_violation THEN
      -- event_vendors_require_verified_before_lock (20270927437859) fires on
      -- the transition INTO a confirmed status — i.e. HERE, not at the request.
      -- A vendor whose verification lapsed between the ask and the agree gets a
      -- vendor-worded status, not the couple-worded trigger message.
      RETURN jsonb_build_object('status', 'not_verified', 'event_id', v_event_id);
  END;

  IF v_rows = 0 THEN
    SELECT lock_agreed_at INTO v_agreed
      FROM public.event_vendors WHERE vendor_id = p_event_vendor_id;
    RETURN jsonb_build_object('status', 'already', 'agreed_at', v_agreed,
                              'event_id', v_event_id);
  END IF;

  -- PACKAGE CASCADE: a package is N rows for ONE agreement. Only the ANCHOR
  -- carries the request markers (covered rows are excluded from the request
  -- index by package_role IS DISTINCT FROM 'covered'), so agreeing on the
  -- anchor must promote its covered siblings in the same transaction or the
  -- couple's plan shows one line booked and the rest still "considering".
  IF v_package_id IS NOT NULL THEN
    UPDATE public.event_vendors
       SET status = 'contracted', updated_at = NOW()
     WHERE event_vendor_package_id = v_package_id
       AND package_role = 'covered'
       AND archived_at IS NULL
       AND status NOT IN ('contracted','deposit_paid','delivered','complete');
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'agreed_at', NOW(),
                            'event_id', v_event_id);
END;
$$;

REVOKE ALL ON FUNCTION public.agree_vendor_lock_request(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.agree_vendor_lock_request(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.agree_vendor_lock_request(UUID) TO authenticated;

COMMENT ON FUNCTION public.agree_vendor_lock_request(UUID) IS
  'The VENDOR agrees to a couple''s lock request (handshake step 2 — the step that did not exist). Stamps lock_agreed_at AND flips status to ''contracted'' in ONE statement, so the row moves from the pending-request unique index to the confirmed one atomically. Serialized via SELECT FOR UPDATE + lock_agreed_at-IS-NULL precondition; idempotent re-call returns status=already. Returns (never raises) group_taken when the couple already confirmed a rival in the same hard-single category, not_verified when the vendor''s verification lapsed, slot_full when the chosen window filled up, closed when the request was withdrawn/expired. Ownership-gated to the booked vendor (current_vendor_event_vendor_ids) or admin. Agreeing moves NO MONEY and makes NO reservation — the syncing fee and acquire_schedule_pools stay at step 5 (vendor accepts payment).';

-- ----------------------------------------------------------------------------
-- 6 · decline_vendor_lock_request — the reject twin, modeled EXACTLY on
--     reject_vendor_deposit (20270722461308). Like it, a settled agreement is
--     FINAL and can never be declined; unlike a status flip, a decline CLOSES
--     the request so the category is immediately free again.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.decline_vendor_lock_request(
  p_event_vendor_id UUID,
  p_reason          TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id  UUID;
  v_requested TIMESTAMPTZ;
  v_agreed    TIMESTAMPTZ;
  v_closed    TIMESTAMPTZ;
  v_rows      INTEGER;
BEGIN
  IF p_event_vendor_id NOT IN (SELECT public.current_vendor_event_vendor_ids())
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_your_booking' USING ERRCODE = '42501';
  END IF;

  SELECT event_id, lock_requested_at, lock_agreed_at, lock_request_closed_at
    INTO v_event_id, v_requested, v_agreed, v_closed
    FROM public.event_vendors
   WHERE vendor_id = p_event_vendor_id
   FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF v_requested IS NULL THEN
    RETURN jsonb_build_object('status', 'not_requested');
  END IF;

  -- A settled agreement is FINAL — you cannot un-agree by declining. Cancelling
  -- an agreed booking is the existing cancel-booking flow, not this.
  IF v_agreed IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already_agreed', 'agreed_at', v_agreed);
  END IF;

  IF v_closed IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already');
  END IF;

  UPDATE public.event_vendors
     SET lock_request_closed_at     = NOW(),
         lock_request_closed_reason = 'declined',
         lock_request_note          = NULLIF(left(btrim(COALESCE(p_reason,'')), 500), ''),
         updated_at                 = NOW()
   WHERE vendor_id = p_event_vendor_id
     AND lock_requested_at      IS NOT NULL
     AND lock_agreed_at         IS NULL
     AND lock_request_closed_at IS NULL;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows = 0 THEN
    RETURN jsonb_build_object('status', 'already');
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'event_id', v_event_id,
                            'closed_at', NOW());
END;
$$;

REVOKE ALL ON FUNCTION public.decline_vendor_lock_request(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decline_vendor_lock_request(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.decline_vendor_lock_request(UUID, TEXT) TO authenticated;

COMMENT ON FUNCTION public.decline_vendor_lock_request(UUID, TEXT) IS
  'The VENDOR declines a lock request, optionally with a reason (<=500 chars). Modeled EXACTLY on reject_vendor_deposit: an already-AGREED request is FINAL and returns already_agreed; a decline CLOSES the request (reason=declined) rather than inventing a new status, which immediately frees the hard-single category for another vendor. Touches no money, no ledger, and never changes event_vendors.status.';

-- ----------------------------------------------------------------------------
-- 7 · cancel_lock_request — the couple's Undo. "Undo = cancel the request"
--     (spec). Needs to be an RPC because the closure columns are trigger-
--     guarded against direct authenticated writes.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cancel_lock_request(
  p_event_id        UUID,
  p_event_vendor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_requested TIMESTAMPTZ;
  v_agreed    TIMESTAMPTZ;
  v_closed    TIMESTAMPTZ;
  v_rows      INTEGER;
BEGIN
  IF p_event_id NOT IN (SELECT public.current_couple_or_coordinator_event_ids())
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_your_event' USING ERRCODE = '42501';
  END IF;

  SELECT lock_requested_at, lock_agreed_at, lock_request_closed_at
    INTO v_requested, v_agreed, v_closed
    FROM public.event_vendors
   WHERE vendor_id = p_event_vendor_id AND event_id = p_event_id
   FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_found' USING ERRCODE = 'P0002';
  END IF;

  IF v_requested IS NULL THEN
    RETURN jsonb_build_object('status', 'not_requested');
  END IF;
  IF v_agreed IS NOT NULL THEN
    -- The vendor already said yes; this is a real booking now. Cancelling it is
    -- the existing cancel-booking flow, deliberately not this one.
    RETURN jsonb_build_object('status', 'already_agreed', 'agreed_at', v_agreed);
  END IF;
  IF v_closed IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already');
  END IF;

  UPDATE public.event_vendors
     SET lock_request_closed_at     = NOW(),
         lock_request_closed_reason = 'cancelled',
         updated_at                 = NOW()
   WHERE vendor_id = p_event_vendor_id
     AND event_id  = p_event_id
     AND lock_agreed_at         IS NULL
     AND lock_request_closed_at IS NULL;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows = 0 THEN
    RETURN jsonb_build_object('status', 'already');
  END IF;

  RETURN jsonb_build_object('status', 'ok', 'closed_at', NOW());
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_lock_request(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_lock_request(UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.cancel_lock_request(UUID, UUID) TO authenticated;

COMMENT ON FUNCTION public.cancel_lock_request(UUID, UUID) IS
  'The couple withdraws a lock request (the Undo). Closes it with reason=cancelled, freeing the hard-single category instantly. Refuses once the vendor has agreed (already_agreed) — at that point it is a real booking and the existing cancel-booking flow owns it. Couple/coordinator-gated.';

-- ----------------------------------------------------------------------------
-- 8 · expire_stale_lock_requests — the ~7-day fuse, driven cron-free from
--     Next after() via claimPeriodicJob (lib/periodic-jobs.ts). BOUNDED
--     (p_limit) because the winner runs it on a real user's request, and
--     FOR UPDATE SKIP LOCKED so one wedged row cannot block the batch.
--     service_role ONLY — this is fleet work, not a user action.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.expire_stale_lock_requests(
  p_days  INTEGER DEFAULT 7,
  p_limit INTEGER DEFAULT 200
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_out JSONB;
BEGIN
  WITH doomed AS (
    SELECT vendor_id
      FROM public.event_vendors
     WHERE lock_requested_at IS NOT NULL
       AND lock_agreed_at         IS NULL
       AND lock_request_closed_at IS NULL
       AND archived_at            IS NULL
       AND lock_requested_at < NOW() - make_interval(days => GREATEST(p_days, 1))
     ORDER BY lock_requested_at
     LIMIT GREATEST(p_limit, 1)
     FOR UPDATE SKIP LOCKED
  ), swept AS (
    UPDATE public.event_vendors ev
       SET lock_request_closed_at     = NOW(),
           lock_request_closed_reason = 'expired',
           updated_at                 = NOW()
      FROM doomed d
     WHERE ev.vendor_id = d.vendor_id
    RETURNING ev.vendor_id, ev.event_id, ev.vendor_name
  )
  SELECT jsonb_build_object(
           'expired', count(*),
           'rows', COALESCE(jsonb_agg(jsonb_build_object(
                     'event_vendor_id', vendor_id,
                     'event_id',        event_id,
                     'vendor_name',     vendor_name)), '[]'::jsonb))
    INTO v_out
    FROM swept;

  RETURN COALESCE(v_out, jsonb_build_object('expired', 0, 'rows', '[]'::jsonb));
END;
$$;

REVOKE ALL ON FUNCTION public.expire_stale_lock_requests(INTEGER, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.expire_stale_lock_requests(INTEGER, INTEGER) FROM anon;
REVOKE ALL ON FUNCTION public.expire_stale_lock_requests(INTEGER, INTEGER) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.expire_stale_lock_requests(INTEGER, INTEGER) TO service_role;

COMMENT ON FUNCTION public.expire_stale_lock_requests(INTEGER, INTEGER) IS
  'Closes lock requests nobody answered within p_days (default 7) with reason=expired, and RETURNS the closed rows so the caller can notify each couple. Expiry is a WRITE, never a computed view — a derived deadline would leave the row inside event_vendors_hard_single_request_uniq forever, permanently blocking the category. Bounded batch + FOR UPDATE SKIP LOCKED because this runs cron-free on a real user''s request via claimPeriodicJob. service_role only.';

-- ----------------------------------------------------------------------------
-- 9 · Post-condition: BOTH hard-single indexes must exist and stay disjoint.
--     Copied in spirit from 20271009160000's own DO $$ guard, which is why
--     that migration must never be edited in place.
-- ----------------------------------------------------------------------------

DO $postcond$
DECLARE
  v_confirmed TEXT;
  v_request   TEXT;
BEGIN
  SELECT indexdef INTO v_confirmed FROM pg_indexes
   WHERE schemaname = 'public' AND indexname = 'event_vendors_hard_single_lock_uniq';
  SELECT indexdef INTO v_request FROM pg_indexes
   WHERE schemaname = 'public' AND indexname = 'event_vendors_hard_single_request_uniq';

  IF v_confirmed IS NULL THEN
    RAISE EXCEPTION 'event_vendors_hard_single_lock_uniq vanished — the confirmed-lock guard is gone';
  END IF;
  IF v_confirmed NOT LIKE '%package_role%' THEN
    RAISE EXCEPTION 'event_vendors_hard_single_lock_uniq lost its package_role clause — multi-line package locking is broken';
  END IF;
  IF v_request IS NULL THEN
    RAISE EXCEPTION 'event_vendors_hard_single_request_uniq was not created';
  END IF;
  IF v_request NOT LIKE '%package_role%' THEN
    RAISE EXCEPTION 'event_vendors_hard_single_request_uniq lost its package_role clause — a package cascade would collide with itself';
  END IF;
  IF v_request NOT LIKE '%lock_agreed_at IS NULL%' THEN
    RAISE EXCEPTION 'event_vendors_hard_single_request_uniq is not disjoint from the confirmed index — the agree transition would collide with itself';
  END IF;
END;
$postcond$;

COMMIT;
```

## 8 · Mapping evidence — hazards found per subsystem
### hard-single-gate
- ⚠ THE OBVIOUS TRAP: adding lock_requested_at to event_vendors and assuming the existing index now protects requests. It does not. The index predicate is `status IN ('contracted','deposit_paid','delivered','complete')` (20271009160000:92) — a timestamp column changes nothing. PR-H must ship a SECOND partial-unique index whose predicate keys on the request state, e.g. ON (event_id, hard_single_group) WHERE hard_single_group IS NOT NULL AND archived_at IS NULL AND package_role IS DISTINCT FROM 'covered' AND lock_requested_at IS NOT NULL AND lock_agreed_at IS NULL AND status NOT IN (the four confirmed).
- ⚠ Widening the EXISTING index to also cover pending rows instead of adding a second one would forbid the legitimate sequence 'request pending on vendor A' → 'A agrees' → 'A becomes contracted', because both states would collide on the same key during the flip. Two indexes with disjoint predicates, or one index over a coalesced state expression that treats requested and contracted as the same slot only when they belong to DIFFERENT vendors — decide this before writing the migration.
- ⚠ A new migration numbered below prefix 20271103100000 merges green and creates NOTHING. This has bitten 4 of 5 PRs in one session per the project memory. Check the head before choosing a prefix.
- ⚠ The `archived_at IS NULL` clause is load-bearing and finalizeVendor ARCHIVES the losing shortlist rows at lock time (actions.ts:1730-1755). If PR-H stores the request on the event_vendors row, an archive sweep silently un-registers a pending request from any new index. If it stores requests in a separate table, that table needs its own archive/withdraw semantics — a soft-deleted event_vendors row must not leave an orphan pending request holding the slot forever.
- ⚠ Both existing 23505 handlers live in the COUPLE's finalizeVendor. A vendor-side agree that flips status will raise 23505 with nobody listening — the vendor sees a raw Postgres string. And the existing recovery payload (buildHardSingleConflict) offers 'Switch to {vendor}', a control that demotes a rival booking; handing that to a vendor is a permissions defect, not a copy defect. The vendor-side loser needs its OWN outcome ('the couple booked someone else') that writes nothing.
- ⚠ The 23505 detector is a SUBSTRING MATCH on the index name inside err.message/err.details (actions.ts:614-617). A second index with a different name will NOT be recognised — every new write path must have its own detector arm, and the name must be added deliberately. Silently, the request collision would fall through to `{status:'error', message: rawPostgresText}`.
- ⚠ The pre-emptive gate and the index agree on the four confirmed statuses TODAY by hand — two hand-typed lists (lib/events.ts:476-481 and the SQL predicate). Adding a fifth request state means updating BOTH, and nothing fails if you update only one: the gate would go quiet while the index still rejects, producing a raw error instead of the modal. Prefer deriving the SQL predicate list, or add a db-test that reads pg_indexes and compares to the TS constant.
- ⚠ hard_single_group is GENERATED from `category` ALONE (20261210000000:80-91). If PR-H's request lives in a separate table, that table has no such column — a uniqueness guard there must re-derive the group in SQL, and the 7-literal CASE will then exist in THREE places (the generated column, the pre-dedupe CTE, and the new table). Reuse the column by keying the request table on event_vendors(vendor_id) and joining, rather than re-typing the map.
- ⚠ The verified-vendor trigger (20270927437859) fires on the transition INTO a confirmed status and grandfathers rows already confirmed. If PR-H moves the confirmed flip to the vendor's agree step, a vendor whose verification LAPSED between the couple's request and their own agree will hit a check_violation with a message written for the couple ('The vendor must complete verification...'). The vendor-side path needs its own handling of that error.
- ⚠ finalizeVendor's exclusivity block DISPLACES every losing vendor's inquiry thread and REFUNDS accepted ones (actions.ts:1779-1900) at lock time. Under PR-H the couple's lock is only a request, so firing this at request time kills rival conversations before anyone agreed — and a vendor whose request is later declined leaves the couple with no live threads at all. This side effect must move to the agree step, and its revive counterpart (actions.ts:2360-2420, gated on isPaymentGatedLockEnabled + HARD_SINGLE_PICK_GROUPS) must learn to fire when a request is cancelled or expires.
- ⚠ Expiry is not free. A pending request that expires must release the slot in whatever index enforces it. If expiry is a timestamp compared at read time rather than a written state change, the partial index cannot see it and a 7-day-dead request holds the hard-single slot permanently. Make expiry a WRITE (a status flip or a cleared timestamp) driven by the project's cron-free after() compare-and-swap pattern, not a computed view.
- ⚠ There is no 'waiting' state anywhere in the read model — childStateOf returns three values and coverageStateOf returns five, all derived from locked counts. A pending request will render as an ordinary shortlist on the service card, 'Your team', and the coverage strip, AND the urgency clock will keep nagging as if nothing happened. Adding the state to only one of the three surfaces produces exactly the drift the coverage-strip docblock (lib/coverage-strip.ts:505-508 region in vendors-plan-budget.ts) was written to prevent.
- ⚠ Nothing on the client blocks a second Lock press — plan-budget-accordion uses hardSingle only for copy and for hiding 'add another' (1162, 1277, 1284). Until the server gate counts pending requests, the UI actively invites the second competing request on a hard-single card.
- ⚠ package_role = 'covered' rows are EXEMPT from the index by design (a package cascade writes N rows sharing a category). Any request-side guard that forgets `package_role IS DISTINCT FROM 'covered'` will re-break multi-line package locking — the exact blocker migration 20271009160000 was written to clear, and its own DO $$ post-condition will refuse to apply if the clause goes missing.

### step5-pattern — the shipped vendor accept/reject machinery (acknowledge_vendor_deposit / reject_vendor_deposit + its actions, Overview card, feed query and notification) that PR-H must mirror for "vendor agrees to the lock"
- ⚠ Copying the RPC but returning an ERROR where step 5 returns a STATUS. The shipped pattern raises only for authorization ('not_your_booking' 42501) and a vanished row ('booking_not_found' P0002); every ordinary out-of-order or duplicate call is a returned JSONB status. If a step-2 RPC raises on 'already agreed', the double-click / retry path becomes a red error page for a vendor whose action actually succeeded.
- ⚠ Dropping `FOR UPDATE` because the UPDATE's WHERE already has the precondition. The migration's own comment says the WHERE is defense in depth ALONGSIDE the lock, not instead of it — without FOR UPDATE the second caller falls into the ROW_COUNT=0 branch and only looks correct because that branch exists. Both halves must be copied or the idempotent branch silently becomes the primary path.
- ⚠ Writing the new agreement marker with the admin client or a plain PostgREST update instead of a DEFINER RPC. `deposit_acknowledged_at` needed a BEFORE UPDATE trigger precisely because `authenticated` holds a TABLE-WIDE UPDATE grant on event_vendors that defeats any column-level REVOKE, and the couple's write policy is FOR ALL with no column restriction. A new `lock_agreed_at` column with no trigger clone is forgeable by the couple from the browser.
- ⚠ Repurposing `event_vendors.status`. The spec forbids it and the DB agrees for a second reason: the hard-single partial unique index keys off the CONFIRMED status set ('contracted','deposit_paid','delivered','complete'), so adding or shifting a status value silently changes which rows collide and can make a legitimate lock fail with 23505 in a code path that has no conflict modal.
- ⚠ Making the pending-request count part of the hard-single gate by adding it to the DB index. The index is a partial UNIQUE over confirmed rows and is path-independent; a pending request is not a lock. Counting pending requests belongs in `finalizeVendor`'s app-level check (which already produces the Switch/Cancel modal via buildHardSingleConflict), otherwise two couples merely REQUESTING the same venue produce a raw 23505 the UI cannot explain.
- ⚠ Feeding the new card raw event_vendors rows without `.or('package_role.is.null,package_role.eq.anchor')` and `.is('archived_at', null)`. fetchLockRequests carries a long comment saying nothing in the DB stops a covered cascade row (₱0) or an archived/withdrawn booking from carrying these markers — the filter IS the design. A step-2 feed missing it offers the vendor an 'agree?' card for a line item that is not a sale.
- ⚠ Assuming the vendor client page can show the new state as-is. It resolves the booking with a single `.eq('event_id',…).eq('marketplace_vendor_id',…).maybeSingle()`; if PR-H creates a second row per vendor per event (rather than columns on the existing row, or a child table), that read stops returning a row and the whole deposit + completion section on that page goes blank.
- ⚠ Emitting a new notification type without the enum migration. notification_type is a PG enum, not a text CHECK — adding only the TypeScript union member means every emit fails the INSERT at runtime, and emitNotification is fail-soft (try/catch + console.error), so the couple simply never hears anything and nothing turns red.
- ⚠ Adding the new type to the union but not to EMAIL_ENABLED_TYPES. 'A vendor agreed to your lock' would be in-app only, while its step-5 sibling payment_confirmed emails — an inconsistency invisible in tests, visible only to a couple who is not in the app.
- ⚠ Putting the syncing fee or the schedule-pool acquire on the step-2 agreement. The owner's ruling and the shipped code both put them on step 5 (vendor accepts PAYMENT), inside `isLockHandshakeEnabled()`. Moving or duplicating them at agreement bills a vendor twice, or freezes a ledger ordinal on a booking that has not been paid — and `collectBookingFeeAtLock`'s not_contracted skip means such a booking can then never be billed at all.
- ⚠ Building the expiry sweep as a cron job. This project is cron-free — periodic work runs as a DB compare-and-swap inside `after()`. A stale-request expiry needs the same treatment, and an expiry that clears markers must also clean up whatever derived rows it orphans (reject_vendor_deposit had to DELETE ledger rows for exactly this reason).
- ⚠ Treating 'Undo = cancel the request' as a status flip. reject_vendor_deposit shows the shipped answer is to CLEAR the markers so the prior party must re-submit — which also means the card that hosted the button vanishes, so the confirmation banner must be rendered outside that card or the vendor/couple sees no feedback at all.
- ⚠ Forgetting the second entry point. Every lock request appears twice in the Overview — a What's-new card AND an Ongoing task with an 'Awaiting you N days' chip. Adding only the card leaves the vendor's open-task list under-reporting, and the age chip is exactly where an expiry policy becomes visible to a human.
- ⚠ Adding a new SECURITY DEFINER function without checking the anon-RPC guard. A CI-required check reads tests/db/anon-rpc-surface.baseline.txt and fails on any new anon-callable SECDEF with no stated reason; the shipped RPCs avoid it only because of the REVOKE PUBLIC / REVOKE anon / GRANT authenticated trio, which must be copied verbatim.

### expiry-notify-flag — the three shipped mechanisms PR-H must reuse (cron-free expiry sweeps, the notification enum, the lock-handshake flag guard)
- ⚠ ADDING A NOTIFICATION TYPE INSIDE A FEATURE MIGRATION BREAKS THE DEPLOY. Postgres refuses to USE an enum value in the transaction that added it. The type must go in its own migration file containing nothing but `ALTER TYPE … ADD VALUE IF NOT EXISTS`, with no BEGIN/COMMIT (supabase/migrations/20270904548818:9-15). Any DML in that same file that references the value will fail at push time.
- ⚠ A HAND-TYPED MIGRATION PREFIX FAILS CI, AND A LOW ONE FAILS SILENTLY. `scripts/check-migration-timestamps.mjs` rejects any new `YYYYMMDD000000` prefix outright; worse, a prefix below the current head (20271103100000 on this branch) merges green and creates nothing. Always allocate with `pnpm migration:new`.
- ⚠ ADDING THE UNION MEMBER WITHOUT BOTH RECORD MAPS IS A TYPECHECK FAILURE — and the local build cannot run (7 GB heap), so CI is the only detector. lib/notifications.ts has TWO exhaustive `Record<NotificationType, string>` maps (:256, :329), not one.
- ⚠ A NEW TYPE IS IN-APP ONLY UNLESS YOU SAY OTHERWISE. If the product intent is 'the couple must hear that the vendor hasn't agreed even when they're not in the app', the type must be added to EMAIL_ENABLED_TYPES (notification-emit.ts:62-129). Emitting alone sends nothing but a tray row.
- ⚠ REUSING AN EXISTING TYPE MAY BEAT ADDING ONE. The booking-fee sweep does exactly this on purpose and says so. A wrong-tone reuse is visible though — the type drives both the tray LABEL and the badge COLOUR, which is why `order_awaiting_reconciliation` had to be split out after a couple's PHP order rendered as 'TOKEN PURCHASE AWAITING PAYMENT' (lib/notifications.ts:179-186).
- ⚠ AN `after()` SWEEP ONLY FIRES WHEN SOMEONE VISITS. A 7-day expiry hung on the admin layout waits for an admin page view; on the vendor layout it waits for vendor traffic. Prod is pre-launch-empty, so 'it will run daily' is an assumption, not a fact. Pick the layout whose visitors actually exist, and treat a late expiry as acceptable — the sweeps are all documented as 'a missed day retries on the next eligible request'.
- ⚠ `claimPeriodicJob` RETURNS FALSE FROM MEMORY BEFORE IT EVER REACHES THE DB — a 5-minute per-key, per-instance pre-throttle (periodic-jobs.ts:28-29). A test, or an admin 'Run now' button, that calls the `maybeRun…` wrapper twice inside 5 minutes silently does nothing and looks broken. Manual triggers must call the exported work BODY directly, which is exactly what the SEO surface does (app/admin/app-performance/_surfaces/seo-actions.ts:13).
- ⚠ AN UNBOUNDED SWEEP BODY PUTS UNBOUNDED WORK ON ONE USER'S REQUEST. Every shipped sweep bounds itself (BATCH = 50 in anon-draft-sweep.ts:33-35, ≤25 events for the NSFW re-screen). A `WHERE status='pending' AND requested_at < now() - 7 days` with no LIMIT is a latency bomb on whoever happens to win the claim.
- ⚠ EXPIRING A REQUEST MUST ALSO RELEASE WHAT IT HELD. The creator-offer sweep flips the status AND refunds the escrow inside the same transaction under `FOR UPDATE SKIP LOCKED` (migration 20270819350491:387-409). Since the spec says the hard-single conflict gate COUNTS pending requests, a PR-H expiry that only flips a status leaves a phantom conflict blocking every other vendor in that category — the same class of bug, one layer up.
- ⚠ MIRRORING `vendor_lock_proposals` GIVES YOU NO EXPIRY. That table has no `expires_at`, no `expired` status and no sweep (20270729130000:31-42). Copy its partial UNIQUE index (one live row per event_vendor) but not its lifecycle. Its RLS is also the wrong direction — read is couple+coordinator, resolve is couple-only; PR-H needs the VENDOR to read and resolve.
- ⚠ LISTING A NEW GATE IN flag-chokepoint-scan.test.ts IS MANDATORY BUT NOT FREE. A load-bearing surface left off `gates` gets zero protection (the §5.3 hole the test exists to close). A path listed in `gates` that doesn't call `isLockHandshakeEnabled()` fails, and a path that gets RENAMED later throws ENOENT from readFileSync rather than producing a readable assertion.
- ⚠ A SECOND ENV READER OR A SECOND FLAG BREAKS OR BYPASSES THE GUARD. Reading NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED anywhere but lib/lock-handshake-flag.ts fails the ONE-READER assertion; introducing a brand-new env var for the request states instead gets NO protection at all until it is registered as its own FlagSpec.
- ⚠ THE NO-HARDCODED-LOCAL CHECK ONLY KNOWS TWO NAMES. `locals: ['handshake','lockHandshake']` — a bypass written as `const enabled = true` or `const requestFlow = true` in a gate file passes the test. If PR-H adopts a different local name, add it to `locals` or the check is theatre in the new files.
- ⚠ A COUPLE-SIDE PURE CORE THAT READS THE FLAG ITSELF CANNOT BE UNIT-TESTED IN BOTH STATES. The 'waiting for vendor' state deriver for the service card / Your team / coverage strip should take the flag as a parameter and be registered in `pureCores` — the existing replan flag lists four such modules for exactly this reason.
- ⚠ NEXT_PUBLIC_* FLAGS INLINE AT BUILD TIME. Flipping NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED in Vercel does nothing until a redeploy — the same trap that is currently blocking the two SEO verification env vars.
- ⚠ THE VENDOR→COUPLE NOTIFY PRECEDENT REACHES ONLY `member_type='couple'`. Both shipped emitters loop event_members filtered to 'couple' (actions.ts:139-142, :262-265). A coordinator acting as the couple's delegate is NOT notified by that pattern — and the coordinator is precisely who may have raised the lock.

### couple-side-surfaces
- ⚠ THE LOCKED-STATUS SET IS COPIED IN AT LEAST FOUR PLACES and every couple surface derives 'locked' from it: shortlist-taxonomy.ts:49-56, vendors-plan-budget.ts:154-159, build-locked.tsx:55, and actions.ts's CONFIRMED_VENDOR_STATUSES. Since the spec forbids repurposing `event_vendors.status`, a new request signal must be threaded to all four independently — a naive PR that teaches only one will show 'requested' on the bench and 'Locked' in Your team on the same vendor.
- ⚠ THE UNDO REQUIREMENT IS ALREADY BROKEN BY A ONE-LINE EARLY RETURN. `resolveBenchCardActions` returns NO_ACTIONS on `status === 'locked'` (bench-card-actions.ts:108). If a request flips status, the couple loses every card control including the cancel the spec demands. If it does NOT flip status, the card keeps offering 'Lock this' and the couple can fire duplicate requests. Neither branch works without editing this resolver.
- ⚠ ADDING A SIXTH CoverageState SILENTLY DEGRADES FOUR CONSUMERS. `CoverageState` (coverage-strip.ts:36) drives a CSS class `st-${state}` with hand-written rules for only five values (shortlist-categories.tsx:397-408 — an unmatched class renders an unstyled dashed circle), the aria-label ladder (explore-info-copy.ts:98-107, whose final `else` says 'not started'), the ⓘ legend array (:63-75), and the urgency map. Only the last is exhaustiveness-checked by TypeScript; the other three fail quietly.
- ⚠ A PENDING REQUEST THAT READS AS 'LOCKED' SINKS THE TILE TO THE QUIETEST SLOT. `timelineStatusForTile` maps locked→'finalized'→TimelineStatus 'locked' = URGENCY_RANK 4, the least urgent (coverage-strip.ts:107-122, :94-100). The tile the couple most needs to chase would fall to the right end of the strip, and NEXT would skip it because `coverageSummary` keys NEXT off `covered` alone (:169). A waiting state must rank ABOVE 'locked', not with it.
- ⚠ THE CATEGORY VANISHES FROM 'STILL NEEDS YOUR DECISION' WITH NOTHING IN ITS PLACE. `stillNeedsDecision` filters out every group in `lockedGroupIds` (your-team.ts:108). Unless the tracker actually lands in the reserved slot at build-locked.tsx:387, a requested category disappears from both the decision list AND the ready-to-lock list, and the couple has no surface telling them anything is in flight.
- ⚠ THE BUFFER TILE WILL LIE. `teamMoney` (your-team.ts:156-170) has exactly two buckets and Buffer = budget − locked − candidates. Counting an un-agreed request as 'Locked' (build-locked.tsx:208) tells the couple money is committed that no vendor has accepted; counting it as a candidate tells them it is still optional. Both are wrong; the tiles need a third line.
- ⚠ THE WORKSPACE HERO PILL HAS NO BRANCH TO CHANGE. `page.tsx:1061-1064` renders a green success 'Locked' chip unconditionally — there is no status conditional at that element. A request-state booking that reaches this page reads as fully booked no matter what the bench says.
- ⚠ A NEW PRE-CONTRACTED STATUS RENDERS NO STEPPER AT ALL. `inferStage` returns null for any status outside contracted/deposit_paid/delivered/complete (workspace page.tsx:214-226), and the whole stage strip is suppressed on null — so the couple sees the payment blocks with no progress context. Do NOT reach for `workspace_status` as the fix: the docblock at :185-197 states its only writer ships unwired and the column is never written in V1.
- ⚠ THE POST-LOCK CELEBRATION CONTRADICTS THE HANDSHAKE. `LockMilestoneToast` says 'Congratulations! You have picked a {label}!' (lock-milestone.tsx:154-156) and can add 'Your wedding date is now locked in. 🎉' (:158); `LockDateConfirmModal` says 'This locks your wedding date… the date becomes official' (:74-82). Under a request-first model both are false at the moment they fire, and explore-info-copy.ts:25-28 already flags this as PR-H's job.
- ⚠ THE 'DONE OR ADD ANOTHER' QUESTION FIRES TOO EARLY. `askDone` is set on every multi-pick lock success (accordion-lock.tsx:296-299) and pins the toast open until answered — asking the couple to declare a category finished before the vendor has agreed to anything.
- ⚠ 'THE CONFLICT GATE COUNTS PENDING REQUESTS' MEANS TWO ENFORCEMENT POINTS, NOT ONE. The DB partial unique index `event_vendors_hard_single_lock_uniq` (detected at actions.ts:610-618) and the re-read `buildHardSingleConflict` filtered `.in('status', CONFIRMED_VENDOR_STATUSES)` (:629-650) both key on confirmed statuses only. Teaching only the TypeScript side means the UI claims to block a second pending venue request while the database happily accepts it.
- ⚠ THE FLAG SPLITS THE SURFACES. Everything replan-side is behind `isExploreReplanEnabled()` (build-locked.tsx:94, bench-card-actions.ts:107), but the vendor WORKSPACE page and the legacy `plan-budget-accordion.tsx` '✓ Locked' chip (:1381-1389) are NOT flag-gated. A request state visible only under the flag leaves two live surfaces still telling the couple the booking is locked.
- ⚠ DO NOT INVENT A NEW WAITING VISUAL. Five distinct 'awaiting' vocabularies already ship and PR-H should pick one rather than add a sixth: the warn pill + Clock 'Date held · awaiting vendor confirmation' (deposit-reservation.tsx:96-99), the same pill as 'Awaiting your confirmation' (handover-inbox.tsx:157-161), the WaitingForQuotes strip with its '2d waiting' age formatter (waiting-for-quotes.tsx:35-46), the terracotta PendingLockProposals section (pending-lock-proposals.tsx:74-125), and the amber 'Verifying — can't lock yet' pill on the lock button itself (accordion-lock.tsx:452-460).
- ⚠ THE STATE MACHINE ALREADY HAS A TESTED PRECEDENT — copying it is cheaper than designing one. `completion-handshake.ts` resolves a two-sided handshake purely from timestamps with a 7-day auto-confirm and no cron (:29, :31-33, :45-66). A PR-H that invents a status enum instead of `lock_requested_at` / `lock_agreed_at` + a derived state will not match the shipped pattern the spec asks it to mirror.
- ⚠ THE 'CLEAR CANDIDATES' PROMISE IS ALREADY WRITTEN AND UNTESTED. team-controls.tsx:110 tells the couple that 'anything mid-handshake' survives clearing. If PR-H stores requests as build picks or lets `clearBuildPicks` touch them, that shipped sentence becomes a lie the moment the state it names exists.

### lock-proposals-and-rls
- ⚠ Mirroring vendor_lock_proposals LITERALLY ships an anon-readable table. That migration has no REVOKE, and the committed baseline proves the result: 'tpriv public.vendor_lock_proposals|anon SIUD' plus all 9 columns at anon=SIU. A PR-H table holding a vendor's agree/reject decision would be readable and writable by anyone with the public anon key at the table-grant level. Copy the SHAPE from 20270729130000 and the ACL from 20271103100614.
- ⚠ Forgetting REVOKE will fail CI, not ship silently — but the failure message points at the baseline, and the tempting fix is to regenerate. Regenerating without reading the diff is exactly the 'rubber stamp' the README names. The new lines must read 'anon=-', never 'anon=SIU'.
- ⚠ Regenerating the exposure baseline from THIS worktree without rebasing will delete 21 facts that origin/main already has (local header 6176 vs main 6197, missing two merged migrations). That reads as a mass narrowing — which the freeze passes SILENTLY — and would clobber vendor_reuse_requests' entries.
- ⚠ vendor_lock_proposals' RLS policies are dead code: all four call sites use createAdminClient(). Anyone reading that table as 'the shipped RLS pattern' is reading policies that were never once exercised. If PR-H wants the VENDOR's browser to see a request live (Realtime only delivers rows the client is RLS-authorized to SELECT), the policies must actually work — and the shipped table has NO vendor arm at all.
- ⚠ There is no vendor-side policy on vendor_lock_proposals to copy. current_couple_or_coordinator_event_ids() and current_couple_event_ids() both resolve through event_members and admit nobody on the vendor side. A vendor read policy needs current_vendor_event_vendor_ids() (event_vendor_id-keyed) or current_vendor_profile_ids() (vendor_profile_id-keyed) — inventing a new resolver instead is the 'no invented patterns' violation.
- ⚠ A new table with any *_user_id column fails TWO guardrails immediately, and BOTH escape hatches are closed: erasure's UNDECIDED_BACKLOG is empty with high-water 0 (may not grow), and export's KNOWN_GAPS is exactly at its ceiling of 90 with a shrink-only ratchet. PR-H must make a real decision (export the table or write a DELIBERATE_EXCLUSIONS reason) in the same PR, not park it.
- ⚠ Declaring the vendor-agreement actor column NOT NULL with no FK repeats the exact defect vendor_reuse_requests had to retro-fix on 2026-08-04: dangling uuid on deletion, no verdict for G6 to read, and a red CI. Apply G6 — CASCADE+NOT NULL means the row is about them, SET NULL means it is only an actor stamp. A vendor's agreement should survive the erasure of whichever staff member clicked it, so it is SET NULL.
- ⚠ The migration text cannot be trusted as the schema. 20271032282809 rewrote 30 FKs from inside a DO $$ block via EXECUTE format(...), so grepping CREATE TABLE returns the pre-2026-08-02 clause. Settle FK behaviour against apps/web/tests/db/user-fk-behaviour.generated.txt, not against the SQL you can read.
- ⚠ Prefix rot: this worktree's newest local migration (20271103100000) already sorts BELOW origin/main's head (20271103100614). Migrations apply once in prefix order, so a PR-H migration allocated against this stale tree can merge with green CI and CREATE NOTHING. Allocate with `pnpm migration:new` AFTER fetching main, and verify the object (SELECT to_regclass('public.<table>')) rather than schema_migrations.
- ⚠ 'One pending per vendor' via a partial unique index means a duplicate insert throws 23505, not a clean upsert. The shipped code swallows this by not checking the error at all (actions.ts:769-775 awaits the insert and discards the result). If PR-H needs the couple to see 'your request is already in', it must READ the row rather than rely on the insert's return.
- ⚠ Making the hard-single conflict gate 'count pending requests' cannot be done by copying event_vendors_hard_single_lock_uniq — that index lives on event_vendors and its WHERE clause only matches locked statuses (contracted/deposit_paid/delivered/complete). A pending request in a different table is invisible to it, so a naive change either leaves the race open or widens a UNIQUE INDEX on the busiest table in the schema.
- ⚠ There is no expiry machinery anywhere near this table: no updated_at, no touch trigger, no scheduled job. The repo is cron-free (periodic work is a DB compare-and-swap inside after()), so a 7-day stale-request expiry has to be built as a derived read or a swept state, not a cron the platform does not have.
- ⚠ The propose-lock flag branch sits BEFORE the coordinator consent gate in finalizeVendor and the code comments say the ordering is deliberate ('Runs AFTER the propose-lock branch so that flag (if ever ON) keeps its propose path untouched'). Inserting PR-H's vendor-agreement gate in the wrong slot changes behaviour for two other flags at once.

### lock-write-sites — every non-test path that puts an event_vendors row into 'contracted' (or jumps past it), the status vocabulary, and the DB guards around it
- ⚠ Grepping only for 'contracted' in the vendors folder finds 2 of the 6 write sites. The other four live in wizard-actions.ts, packages/actions.ts and lib/chat-lock-booking.server.ts — the chat one bills from a message, not a lock screen, and the file itself warns a vendors-surface-only sweep walks straight past it.
- ⚠ The slot path does not use the same write as the rest of finalizeVendor: acquire_service_time_slot flips status INSIDE its own row lock. Gating only the TypeScript update at actions.ts:1411 leaves a fully-working lock for every vendor with active time slots on a day-precise event.
- ⚠ lockPackage creates N rows per agreement (one anchor + N-1 covered). A per-row request produces N requests for one deal, and agreeing or billing on a covered row is forbidden — a DB CHECK already makes covered rows carry no money.
- ⚠ vendor_claim_locked_qr writes 'deposit_paid' and never touches 'contracted'. Any state machine assuming 'a booking begins at contracted' silently mislabels every Locked-QR booking, and a coverage strip driven by request rows shows those bookings as having no request.
- ⚠ updateVendorStatus accepts 'contracted' straight from FormData with no lock guards. It has no client caller today but is an exported server action — gating only the named lock functions leaves it as a live route into the locked state.
- ⚠ The hard-single conflict gate is enforced twice: an app-side read AND a DB partial unique index that only sees confirmed statuses. Counting pending requests in the app read alone lets two pending requests in one category both convert the moment their vendors agree.
- ⚠ event_vendors_require_verified_before_lock fires only on the TRANSITION into a confirmed status and grandfathers already-confirmed rows. If the agree step updates an already-confirmed row, the verified check silently does not re-run.
- ⚠ An expiry sweep for stale requests must not touch money statuses: three write paths guard themselves with .not('status','in','("deposit_paid","delivered","complete")') precisely because a concurrent deposit can outrun a lock write. A sweep without the same precondition can downgrade a paid booking.
- ⚠ Reverting a request must undo more than a status: finalizeVendor also stamps selection_match_rank=1 and linked_vendor_profile_id, archives the losing shortlist with archived_by_lock_of, may finalize the wedding date, and may create a claim invite. Clearing a timestamp alone leaves all of that behind.
- ⚠ The repo tracks a stale duplicate of plan-budget-accordion.tsx under Setnayan/.claude/worktrees/accordion-live/. It carries its own LOCKED status set and appears in every lock-related grep — editing it changes nothing that ships.
- ⚠ The fee trigger has been ruled on five times; ruling 4 (charge at lock) is what the code does today and ruling 5 (charge at vendor acceptance) is what the flag turns on. Building PR-H against the wrong ruling is a money-behaviour change — read lock-handshake-flag.ts before touching any fee call site.

---

## 9 · ⚠ ADVERSARIAL REVIEW — 5 lenses, ALL returned NEEDS_CHANGES

**Do NOT build §3 as written.** Five independent skeptics attacked the design against the real code on 2026-08-04. Every one came back NEEDS_CHANGES; **14 problems are HIGH**, and several are fatal to the flow as designed (the vendor literally cannot open the page the agree card was placed on; the couple can still forge 'the vendor agreed'; the couple would be charged a downpayment before anyone agreed).

Fold every HIGH fix into §3 and re-verify BEFORE writing code.

### Hard-single conflict gate — the real partial-unique index predicates vs. the plan's paraphrase, and the existing Switch flow
**Verdict: NEEDS_CHANGES**

#### [HIGH] The new request index CANNOT see a confirmed rival, and the plan simultaneously removes the confirmed-status transition that four of the five lock paths use as their ONLY hard-single enforcement. Result: a couple who already has a locked venue can open a live 7-day lock request for a SECOND venue from the chat lock, the package lock, or any of the three wizard actions. Nothing stops it; the vendor sees a real 'Lock request — agree?' card, and the collision only surfaces when they press Agree (group_taken → superseded). The plan's stated defence — 'a request racing an already-CONFIRMED sibling is stopped by finalizeVendor's existing fast-path read' — is false for every one of those four paths, none of which go through finalizeVendor.
- **Evidence:** apps/web/lib/chat-lock-booking.server.ts:87-109 (its only hard-single guard is the 23505 raised BECAUSE it writes status:'contracted'; the plan's SITE 4 explicitly drops `status` from that update, killing the `/hard_single/` arm at :108-109) · apps/web/app/dashboard/[eventId]/vendors/packages/actions.ts:475 (`status: 'contracted' as const` — no pre-check anywhere in the file; grep for `hard_single` returns zero hits) · apps/web/app/dashboard/[eventId]/wizard-actions.ts:488,572,1147 (all three INSERT at 'contracted', no pre-check) · the shipped index only covers confirmed rows: supabase/migrations/20271009160000_package_anchor_role_and_cascade_indexes.sql:88-92 · the plan's new index excludes them by construction: `status NOT IN ('contracted','deposit_paid','delivered','complete')`
- **Fix:** Put the confirmed-sibling check inside `request_vendor_lock` itself, not in one caller. Before the marker UPDATE, add: `IF v_group IS NOT NULL AND EXISTS (SELECT 1 FROM public.event_vendors WHERE event_id = p_event_id AND hard_single_group = v_group AND archived_at IS NULL AND package_role IS DISTINCT FROM 'covered' AND vendor_id <> p_event_vendor_id AND status IN ('contracted','deposit_paid','delivered','complete')) THEN RETURN jsonb_build_object('status','group_taken'); END IF;` — reading `hard_single_group` off the target row in the same FOR UPDATE SELECT. That makes 'group_taken' mean both 'a pending rival' and 'a confirmed rival' from ONE chokepoint, so lockPackage / chat-lock / the wizard actions inherit the gate without each needing its own read. Then add a DB test asserting a request in a group that already holds a CONFIRMED row returns group_taken and leaves lock_requested_at NULL.

#### [HIGH] The existing Switch flow becomes a bad trade for the couple. It demotes a REAL confirmed booking to 'considering' up front; under the flag what replaces it is only a request the new vendor can decline or let expire. Nothing in the plan restores the demoted vendor. A couple who switches venues and then gets declined ends up with NO venue at all — and the plan's own (g) defers the post-lock effects, so it does not even notice.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:866-875 — the `existingLocked && overrideExisting` branch writes `status: 'considering'` on the prior vendor BEFORE any new write; the plan's call-site (f) then replaces the follow-up lock write with `request_vendor_lock`, which per its own COMMENT 'Does NOT touch status'.
- **Fix:** Do not demote the confirmed incumbent at request time. Under the flag, leave the incumbent contracted, stamp the request on the challenger, and move the demotion INTO `agree_vendor_lock_request` — the same single statement that flips the challenger to 'contracted' must demote the incumbent, or the confirmed unique index will reject it. Concretely: in the agree RPC, before the main UPDATE, `UPDATE public.event_vendors SET status='considering' WHERE event_id = v_event_id AND hard_single_group = v_group AND vendor_id <> p_event_vendor_id AND archived_at IS NULL AND package_role IS DISTINCT FROM 'covered' AND status IN ('contracted','deposit_paid','delivered','complete')` — gated on a `p_override BOOLEAN` carried on the request row (add `lock_request_override BOOLEAN` rather than inferring it), so a vendor can never silently displace a rival the couple did not agree to displace.

#### [MEDIUM] `agree_vendor_lock_request`'s `EXCEPTION WHEN check_violation THEN RETURN 'not_verified'` is a catch-all over at least two different guards. The free-tier 3-concurrent-booking cap raises the SAME errcode on the SAME UPDATE, so a fully-booked free vendor pressing Agree is told 'Finish your verification to accept bookings' — wrong and unactionable. The cap's own migration says in writing not to flip it until the lock paths handle its error; this plan adds a new lock path that mishandles it.
- **Evidence:** supabase/migrations/20271001120000_free_tier_booking_cap_trigger.sql:112-116 (BEFORE INSERT OR UPDATE trigger on event_vendors) + supabase/migrations/20271009160000_package_anchor_role_and_cascade_indexes.sql:152-157 (`RAISE EXCEPTION 'free_tier_booking_cap: …' USING ERRCODE = 'check_violation'`) vs. supabase/migrations/20270927437859_booking_requires_verified_vendor.sql:83-87 (same errcode) · the warning: 20271001120000_free_tier_booking_cap_trigger.sql:39
- **Fix:** Discriminate on the message, the way the shipped chat path already does at chat-lock-booking.server.ts:107 (`/vendor_not_verified/.test(...)`). In the handler capture `GET STACKED DIAGNOSTICS v_msg = MESSAGE_TEXT;` then branch: `v_msg LIKE 'vendor_not_verified%'` ⇒ 'not_verified'; `v_msg LIKE 'free_tier_booking_cap%'` ⇒ a new 'fully_booked' status with its own vendor-facing sentence; anything else ⇒ RE-RAISE rather than mislabel. Add the 'fully_booked' arm to the vendor Overview and client-detail copy lists.

#### [MEDIUM] `lockPackage` loses its rollback. Today the hard-single 23505 fires during the cascade INSERT and the `cascadeErr` branch deletes the orphan package booking. Under the flag the insert lands at 'considering' so nothing raises, and the plan's separate `request_vendor_lock` call can still come back 'group_taken' — with N event_vendors rows and an event_vendor_packages row already committed, no rollback specified, and the plan's stated return value still `{status:'lock_requested'}`.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/packages/actions.ts:505-519 — rollback is reached only via `if (cascadeErr)`; the plan's SITE 3 calls request_vendor_lock AFTER `insertedRows` returns and defines no failure branch.
- **Fix:** In lockPackage, treat a non-'ok'/'already' envelope from request_vendor_lock exactly as `cascadeErr`: delete the inserted event_vendors rows by `event_vendor_package_id = bookingId`, delete the `event_vendor_packages` row by `booking_id`, and return a `hard_single_conflict`-shaped result so the /v/[slug] modal can offer Switch. Cover it with a DB test: lock a package whose anchor category collides with an existing confirmed vendor, then assert `SELECT count(*) FROM event_vendors WHERE event_vendor_package_id = <id>` = 0.

#### [MEDIUM] `lockRequestStateOf` has no arm for a reachable state: a vendor who agreed and was then displaced by the Switch flow keeps `lock_agreed_at` set while `status` drops to 'considering' and `lock_request_closed_at` stays NULL. None of the plan's four stated rules match, so the pure core falls through to 'none' — and the vendor's own client page (which the plan derives from the same function) plus `agree_vendor_lock_request` (which returns 'already' whenever lock_agreed_at IS NOT NULL) keep telling the vendor the booking is agreed after the couple switched away from them.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:866-875 writes only `status` and `updated_at` — it never clears the lock markers; the plan's own derivation spec covers only: confirmed⇒locked, requested&&!agreed&&!closed⇒requested, closed⇒reason.
- **Fix:** Make the displacement explicit rather than inferred: in the Switch branch (or, per the HIGH finding above, in the agree RPC's demotion statement) also stamp `lock_agreed_at = NULL, lock_request_closed_at = NOW(), lock_request_closed_reason = 'superseded'` on the displaced row — which requires routing that write through a DEFINER RPC because the plan's own `guard_event_vendor_lock_agreement` trigger blocks `authenticated` from those columns. Then add an explicit `agreed && !confirmed` assertion to the lock-request-state unit table so the state can never go unclassified again.

#### [LOW] The plan's call-site (b) speaks of 'the detector' as if there were one. There are two, with different matching semantics, and only one is widened. The second matches on a bare `hard_single` regex, so it would already match the new index name — meaning under any code path that still raises 23505 from the request index, a pending-request collision would be reported to the couple through the chat path's confirmed-conflict copy ('another vendor already holds the one slot').
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:611-618 matches the full literal `event_vendors_hard_single_lock_uniq` (blind to the new index — plan is right here) vs. apps/web/lib/chat-lock-booking.server.ts:108 `/hard_single/.test(...)` (matches BOTH index names).
- **Fix:** Export both index names as one const from a shared module and have BOTH detectors compare against it, with separate return values per index — `event_vendors_hard_single_lock_uniq` ⇒ hard_single_conflict (a real booking), `event_vendors_hard_single_request_uniq` ⇒ lock_request_conflict (a pending ask). Assert in a db-test that the exported const equals the exact `indexname` set returned by `SELECT indexname FROM pg_indexes WHERE schemaname='public' AND indexname LIKE 'event_vendors_hard_single%'`, so a rename cannot silently drop either surface back to a raw Postgres string.

### COMPLETENESS — what the plan omits: uncovered write paths, dead-end states for the couple, missing undo on either side, whether the couple is actually told, and readers that answer "is this vendor locked?" wrongly for a pending request.
**Verdict: NEEDS_CHANGES**

#### [HIGH] THE VENDOR CANNOT OPEN THE PAGE THE PLAN PUTS THE AGREE/DECLINE CARD ON. The vendor customer-card page gates on `get_vendor_event_brief`, which RAISES `not_booked` unless the vendor's `event_vendors` row is already IN ('contracted','deposit_paid','delivered','complete') OR the vendor holds an accepted chat thread on that event. A lock REQUEST leaves the row at 'considering'. So for any request that did not come from a chat (bench lock, package lock, explore lock — the majority), the vendor's 'View' link, and both new actions' post-submit `redirect(?lock_agree=…/?lock_decline=…)`, bounce straight to the clients list. The decline banner the plan specifies is unreachable BY CONSTRUCTION: after a decline the row is still 'considering', so the page always redirects away. The plan touches this file but never widens the brief gate.
- **Evidence:** supabase/migrations/20270522618307_crew_meals_vendor_event_brief_budget_leaf.sql:55 (`AND ev.status IN ('contracted','deposit_paid','delivered','complete')`) → :72 (`RAISE EXCEPTION 'not_booked'`); apps/web/app/vendor-dashboard/clients/[eventId]/page.tsx:426-428 (`const { data, error } = await supabase.rpc('get_vendor_event_brief', …); if (error || !data) redirect('/vendor-dashboard/clients');`)
- **Fix:** Add a THIRD stage to `get_vendor_event_brief` — `v_stage := 'lock_request'` when the org has a live request row (lock_requested_at NOT NULL, lock_agreed_at NULL, lock_request_closed_at NULL) — and render the request card + banners under it, or host the whole agree/decline flow on the Overview card only and drop the client-page item (and its 'View' link) from the plan.

#### [HIGH] A COUPLE WHO CHANGES THEIR MIND AFTER THE VENDOR AGREES IS PERMANENTLY STUCK. The shipped 'Change pick' control calls `revertVendorToConsidering`, which sets status back to 'considering' and clears rank/link — but it knows nothing about the new markers, so `lock_agreed_at` stays set. `request_vendor_lock`'s UPDATE carries `AND lock_agreed_at IS NULL` in its WHERE, so its own `SET lock_agreed_at = NULL` can never execute; the re-request matches 0 rows and returns status='already'. The vendor's feed filters on `lock_agreed_at IS NULL`, so no new card ever appears. The booking can never be re-requested and never re-locked, and the couple is shown a silent no-op. The plan has no call-site entry for `revertVendorToConsidering` at all.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:2312-2320 (`.update({ status: 'considering', selection_match_rank: null, linked_vendor_profile_id: null, … })` — no lock_* columns); apps/web/app/dashboard/[eventId]/vendors/_components/plan-budget-accordion.tsx:1752 (`<ChangePickButton …/>`); apps/web/app/dashboard/[eventId]/vendors/_components/accordion-lock.tsx:428 (`revertVendorToConsidering(fd)`); plan migrationSql §4 (`WHERE … AND lock_agreed_at IS NULL` beside `SET lock_agreed_at = NULL`)
- **Fix:** Add `revertVendorToConsidering` to the call-site list: under the flag it must go through a new DEFINER RPC that clears lock_requested_at / lock_agreed_at / lock_request_closed_at / _reason / _note in the same statement (the columns are trigger-guarded, so a plain UPDATE will now 42501 — this ALSO breaks Undo outright, not just re-locking). Add a DB test: agree → revert → request again returns 'ok', not 'already'.

#### [HIGH] THE PAY-AT-LOCK PATH IS SILENTLY DROPPED, AND ITS HARD GATE IS UNADDRESSED. `finalizeVendor` runs `downpaymentGate()` as a HARD precondition before the lock write, and after committing it persists the couple's uploaded proof to R2, stamps deposit_recorded_at/method, inserts the `event_vendor_payments` ledger row and notifies the vendor. The plan replaces the write with `request_vendor_lock` and returns 'lock_requested' BEFORE the side effects, listing only four effects to move (archive sweep, inquiry displacement, category decisions, proposal auto-resolve). The downpayment gate and the whole deposit-capture block are never mentioned. Either the gate stays and the couple must PAY to merely ASK (which inverts the owner's handshake: payment is steps 3-4, after agreement), or the gate is skipped and a couple who filled in the amount, reference and proof screenshot has all three thrown away with no error.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:1378-1382 (`// HARD payment gate … const dpGateGeneric = await downpaymentGate(); if (dpGateGeneric) return dpGateGeneric;`); apps/web/app/dashboard/[eventId]/vendors/actions.ts:2061-2126 (proof upload → deposit markers → `event_vendor_payments` insert → `emitNotification('payment_logged')`)
- **Fix:** Add an explicit call-site entry: under the flag, SKIP `downpaymentGate()` (nothing is owed at request time) AND suppress the downpayment fields in the lock sheet so the couple is never asked for money/proof they cannot yet be charged for. If any of the pay-at-lock inputs arrive while the flag is on, return an error rather than dropping them.

#### [MEDIUM] THE VENDOR'S OWN OVERBOOKING LIMIT STOPS COUNTING. `finalizeVendor`'s soft-hold check counts rival bookings with `.eq('status','contracted')` against the vendor's `max_soft_holds_per_date`. Under the handshake a pending request is 'considering', so it is invisible to that count — and `agree_vendor_lock_request` re-checks only the time-slot capacity, never the soft-hold limit. A vendor with max_soft_holds_per_date = 1 can receive five requests for the same date and agree to all five, with nothing anywhere refusing. The plan's conflict work covers only the couple's own hard-single category.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:1350-1357 (`.eq('marketplace_vendor_id', …).eq('status','contracted').is('archived_at', null).in('event_id', sameDateEventIds)`); plan migrationSql §5 re-checks only `vendor_service_time_slots` capacity
- **Fix:** Either count live requests in the soft-hold query (add an OR on the pending-request predicate) or re-run the soft-hold check inside `agree_vendor_lock_request` and return a `date_full` status. Add a DB test: two requests on one date against a max_soft_holds_per_date=1 vendor — the second agree must not succeed.

#### [MEDIUM] THE COUPLE'S OTHER NAG ENGINES KEEP SAYING 'YOU HAVEN'T BOOKED THIS'. The plan correctly fixes the coverage strip's urgency rank, which proves the failure mode was understood — but three other surfaces derive the same 'not booked' answer from CONFIRMED_VENDOR_STATUSES and are absent from the call-site list. The dashboard hero ('today's one thing') ranks any category with no confirmed vendor as OVERDUE; the roadmap signals report receptionVenueBooked/ceremonyVenueBooked/coreVendorBooked as false; the checklist auto-complete never ticks. For up to seven days the couple is told to go book the venue they already asked for.
- **Evidence:** apps/web/lib/todays-one-thing.ts:39 + :62,:66 (a category counts as done only if it `has ≥1 vendor in CONFIRMED_VENDOR_STATUSES`); apps/web/lib/wedding-roadmap-signals.ts:79-86 (`isConfirmed` → receptionVenueBooked / ceremonyVenueBooked); apps/web/lib/checklist-autocomplete.ts:79 (`categories at a confirmed status`)
- **Fix:** Add these three to the call-site list with the same treatment the coverage strip gets: a pending request is NOT 'not started'. Cheapest correct shape — pass the requested set into each and suppress the nag (do not mark done).

#### [MEDIUM] THE PRE-AGREE MONEY LEAK THE CODE ALREADY WARNS ABOUT BECOMES REACHABLE. `recordDeposit` has no status precondition, and the shipped comment states that a deposit recorded on a 'considering' row makes acknowledge skip the fee as `not_contracted` — 'that booking is FREE FOREVER; the ordinal is computed once and never recovers' — and says it is unreachable only because today's call sites cannot produce it. The handshake creates exactly that state and keeps it alive for up to seven days. The plan's only defence is HIDING the payment stack in the workspace render; the server action itself is untouched and remains callable from a stale tab.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:3664-3700 (`recordDeposit` — no status read/precondition); apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts:183-190 (the `not_contracted` = 'FREE FOREVER' console.error)
- **Fix:** Add `recordDeposit` to the call-site list: when the flag is on and the row has a live request (or status is not confirmed), return a typed refusal before any write. Hiding a control is not gating it.

#### [MEDIUM] THE VENDOR'S DECLINE REASON HAS NO SURFACE, AND 'DECLINED' HAS NO STATE ANYWHERE ON THE COUPLE SIDE. The plan adds `lock_request_note`, trims it in SQL and in the action, and exposes 'declined' from `lockRequestStateOf` — but `ShortlistVendor.status` is widened only to add 'requested', `bench-card-actions` gains only a 'requested' arm, and no listed component renders the note. A declined row therefore reads as an ordinary 'considering' pick that still offers Lock, so the couple can re-fire a request at a vendor who already said no, with no trace of the refusal outside a single notification body.
- **Evidence:** plan callSites for apps/web/lib/shortlist-taxonomy.ts ('Widen ShortlistVendor.status … to add \'requested\'') and apps/web/lib/bench-card-actions.ts ('Add a \'requested\' arm'); no listed file consumes lock_request_note; apps/web/lib/bench-card-actions.ts:108 is the only other status arm (`if (vendor.status === 'locked') return NO_ACTIONS`)
- **Fix:** Either carry 'declined' through the same four couple surfaces as 'requested' (bench note with the reason, coverage strip, Your team, workspace), or drop `lock_request_note` from this PR and let the decline notification carry the reason. Shipping a column nothing reads is the half-wired failure the plan's own coverage-strip test is designed to catch.

#### [LOW] THE COORDINATOR MONEY-WALL EXISTS ONLY IN TYPESCRIPT AND THE NEW RPCs WIDEN WHO CAN REACH IT DIRECTLY. `finalizeVendor` routes a non-couple member to a `vendor_lock_proposals` row instead of locking, and separately checks a 'vendor_lock' consent scope. Both new couple-side RPCs are granted to `authenticated` and gated only by `current_couple_or_coordinator_event_ids()`, so a coordinator can call `request_vendor_lock` / `cancel_lock_request` straight through PostgREST and bypass the propose-and-consent path entirely. (Not a regression in kind — the moderator RLS write policy is similarly broad — but the plan asserts these RPCs reuse the shipped gate, and they do not reuse the one that matters.)
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:757-782 (the propose-lock branch: non-couple member → `vendor_lock_proposals` insert → `return { status: 'proposed' }`) and :790-800 (`coordinatorMoneyScopeAllowed(… 'vendor_lock')`); plan migrationSql §4/§7 gate on `current_couple_or_coordinator_event_ids()` only
- **Fix:** Gate `request_vendor_lock` on couple membership (`current_couple_event_ids()`), and let the coordinator path keep producing a proposal, so the money-wall is enforced where it cannot be walked around.

### MONEY and TIMING — does making the lock a REQUEST move the fee, the schedule reservation, the deposit, or the payment plan to the wrong moment, twice, or never; and does a rejected/expired request leave money or a pool row behind?
**Verdict: NEEDS_CHANGES**

#### [HIGH] The plan never touches `downpaymentGate`, so under the handshake the COUPLE is forced to pay the vendor's downpayment — real pesos, off-platform, plus a proof screenshot — at STEP 1, before the vendor has agreed. The gate is a hard server gate at both commit points and returns `downpayment_required` before anything commits; the plan's own step ordering says the payment request is step 3 and payment is step 4. The plan's 30-item callSites inventory contains no mention of downpaymentGate, deposit_method_id, isPaymentGatedLockEnabled, or the lock modal's `kind: 'downpayment'` step.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:1069-1082 (the gate), :1161-1162 and :1381-1382 (both commit points), :1042-1062 (pre-commit validation demands amount + proof File), apps/web/app/dashboard/[eventId]/vendors/_components/accordion-lock.tsx:108-120 (the modal step). The rationale comment at actions.ts:1159-1160 — "the slot RPC commits the lock atomically, so the downpayment must be collected BEFORE it" — evaporates once the flag is ON and nothing commits, yet the plan keeps the gate.
- **Fix:** Add a `!isLockHandshakeEnabled()` arm to `downpaymentGate` (and to `dpWantGate` at :1024) so the request path never asks for money, and move the whole downpayment collection to the vendor's payment request (step 3). If the owner wants the couple to pre-pay at request, say so explicitly in openQuestions — it is a money-ordering decision, not an implementation detail.

#### [HIGH] A DECLINED or EXPIRED request leaves the couple's recorded deposit fully live, and the vendor can still "confirm" it — which then reserves the vendor's schedule for a booking they refused. `decline_vendor_lock_request` / `cancel_lock_request` / `expire_stale_lock_requests` only stamp `lock_request_closed_at`; none clears `deposit_recorded_at` / `deposit_method_id` / `deposit_proof_url`, none deletes the `event_vendor_payments` ledger row, none calls `release_schedule_pools`. And `acknowledge_vendor_deposit` has NO status precondition — it fires on any row with `deposit_recorded_at IS NOT NULL AND deposit_acknowledged_at IS NULL`. The plan suppresses the vendor's deposit card only "while state === 'requested'", so after a decline the state is 'declined' and the card comes back.
- **Evidence:** supabase/migrations/20270320429117_deposit_lockfree.sql:112-116 (UPDATE ... WHERE deposit_recorded_at IS NOT NULL AND deposit_acknowledged_at IS NULL — no status test); apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts:205-207 (`acquireSchedulePoolsForBooking` runs unconditionally on ok); apps/web/lib/schedule-pools.ts:265-290 (no status filter anywhere in it); apps/web/app/dashboard/[eventId]/vendors/actions.ts:2062-2130 (the lock-time deposit persist that creates the markers + the ledger row). The fee itself is safe — booking_fee_open_lock_charge returns `not_contracted` at supabase/migrations/20271009140000_booking_fee_sourced_only_at_lock.sql:130-132 — but that path is exactly the loud false alarm PR-I wrote at clients/[eventId]/actions.ts:189-196, which will now fire routinely.
- **Fix:** Make the three closing RPCs also clear the deposit markers and call `release_schedule_pools(vendor_id, 'request_closed')`; and add `AND status IN ('contracted','deposit_paid','delivered','complete')` (or `lock_agreed_at IS NOT NULL`) as a precondition inside `acknowledge_vendor_deposit` so a never-agreed row cannot be acknowledged at all. Add a DB test: decline a request that carries a deposit, then assert the acknowledge RPC refuses and `schedule_pool_reservations` has no live row.

#### [HIGH] Three lock-time side effects that TELL THE COUPLE AND VENDOR THE BOOKING IS DONE are missing from the plan's `applyPostLockEffects` extraction list, so they fire at REQUEST time. The payment-plan snapshot writes a concrete plan and notifies the couple "Your booking with {vendor} is locked… open the workspace to see each payment and how to pay"; the vendor is separately told "You have a new confirmed booking" — at the same moment the plan's new Overview card asks them "Lock request — agree?". Worse, the plan's `on_lock` due dates anchor on `lockDateIso = today`, i.e. the REQUEST date, and the plan is only re-upserted on a re-lock — which under the handshake never happens, because `agree` does not re-run the snapshot. A vendor who answers on day 6 gets a downpayment dated 6 days before they agreed, frozen.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:1530-1538 (booking_confirmed to the vendor), :1575-1668 (plan upsert + payment_info_sent "is locked"), :1596 (`lockDateIso = new Date()`), apps/web/lib/vendor-service-payment-schedules.ts:257-258 (`on_lock` → shiftIsoDate(lockDateIso, offset)). The plan's extraction list names only :1730-1755, :1779-1900, :2140-2152 and :2155-2172.
- **Fix:** Add the payment-plan snapshot block (:1575-1694) and the booking_confirmed emit (:1500-1547) to `applyPostLockEffects`, and pass the AGREEMENT date as `lockDateIso` when it runs from `vendorAgreeToLock`. The vendor's request notification must be the new `lock_request_received`, never `booking_confirmed`.

#### [MEDIUM] `recordDeposit` — the couple-side deposit action — acquires schedule pools with no status precondition, and the plan's call-site inventory never mentions it. It is an exported server action; hiding the workspace payment stack (the plan's workspace item (d)) hides the button, not the action. Under the handshake this is the one couple-reachable path that both records money and consumes the vendor's real date capacity on a booking nobody agreed to — the same bypass class the plan carefully closed for `wizard-actions.ts` and `updateVendorStatus`.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:3664 (export), :3756-3790 ("HOLD THE DATE the instant the deposit is logged" → `acquireSchedulePools` at :3765), with the only status-shaped read at :3717-3726 selecting `deposit_recorded_at` and never `status`.
- **Fix:** Add an early `isLockHandshakeEnabled() && state !== 'agreed/locked' → return {status:'error'}` guard at the top of `recordDeposit`, and add it to the flag registry's `gates` alongside the other three write paths.

#### [MEDIUM] The plan's SITE 8 hardening of `updateVendorStatus` blocks only `'contracted'`, leaving `'deposit_paid'` open — which is a CONFIRMED status. A posted `deposit_paid` on a merely-REQUESTED row jumps it straight past the vendor's agreement into a state that `lockRequestStateOf` reads as 'locked', acquires the schedule pools on the way, and makes the booking billable at the next acknowledge. Blocking the smaller of the two doors is not a gate.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:233 (export), :276-320 (`willConsume = DOWNPAID_STATUSES.has(status)` → `acquireSchedulePools` at :302), :81 (`isValidStatus` accepts the whole union).
- **Fix:** Under the flag, refuse ANY posted status in CONFIRMED_VENDOR_STATUSES unless `lock_agreed_at IS NOT NULL`, not just `'contracted'`.

#### [MEDIUM] Turning the flag back OFF strands every in-flight request in a way nothing can clear, and the plan's own design guarantees it. The pending partial-unique index is a DB object and keeps blocking its hard-single category; the expiry sweep is explicitly `if (!isLockHandshakeEnabled()) return;` so it never fires; and `lockRequestStateOf(enabled:false)` returns 'none' for a pending row, so the couple's Cancel-request control disappears. On a later re-flip, `request_vendor_lock` returns `group_taken` because of a weeks-old invisible request. The testPlan asserts "flag OFF is byte-identical" only for fresh fixtures, never for a row created while ON.
- **Evidence:** The plan's own `lib/lock-request-expiry.ts` spec (`if (!isLockHandshakeEnabled()) return;`) and `lib/lock-request-state.ts` rule ("enabled=false ⇒ … else 'none'"), against the unconditional DB index `event_vendors_hard_single_request_uniq` in migrationSql §2. Precedent that the gap is real: apps/web/lib/periodic-jobs.ts:21-26 — the sweep only runs when a claim is won, and it is never even attempted while the flag is off.
- **Fix:** Let the sweep run regardless of the flag (closing a stale request is safe in both states), or have the flag-OFF `finalizeVendor` path clear `lock_requested_at` on the row it locks. Add the test: create a request with the flag ON, flip it OFF, assert the category is still lockable and the request self-closes.

#### [LOW] `triggerVendorActivityRecompute` fires at REQUEST time on a comment that says "The vendor just reached the first FINALIZED status ('contracted')" — which is false under the flag — and nothing recomputes at agree. The vendor's `finalized_booking_count` and `inquiry_to_booking_pct` (public-profile and tier-facing numbers) stop tracking real bookings.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:2049-2055; the fields at apps/web/lib/vendor-activity.ts:463-464.
- **Fix:** Move the `after(() => triggerVendorActivityRecompute(vpid))` call into `applyPostLockEffects` so it runs at the agreement, and fix the comment.

### FLAG-OFF GUARANTEE — with NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED unset, does every change in the plan leave production byte-identical, and would the plan's registry entries actually pass lib/flag-chokepoint-scan.test.ts's four properties?
**Verdict: NEEDS_CHANGES**

#### [HIGH] The `applyPostLockEffects(admin, {...})` extraction rewrites the FLAG-OFF path, not just the flag-on one. The plan calls the extracted function from the request path "when the flag is OFF" and hands it an `admin` client plus five scalars — but the shipped code these blocks live in runs under `supabase` (the couple's own RLS client) and reads three locals the proposed signature does not carry: `groupId`, `user.id`, and the second flag `isExploreReplanEnabled()`. Swapping the couple's RLS client for the admin client silently widens what the archive sweep and the thread-displacement writes are allowed to touch, and dropping `groupId`/`user.id` either breaks the call or changes what gets written — all with the handshake flag OFF.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:1731 (`supabase.from('event_vendors').update({archived_at…})`, stamping `archived_by_lock_of` at :1738) · :1800 and :1823 (`supabase.from('chat_threads')` select + displacement update) · :2138 (`if (isExploreReplanEnabled() && isHardSingle && groupId)`) · :2164 (`resolved_by_user_id: user.id`). The plan's signature is `applyPostLockEffects(admin, {eventId, vendorId, targetCategory, groupCategories, isHardSingle})` — no `groupId`, no `user.id`, no couple client.
- **Fix:** Do not move these blocks in PR-H. Leave the flag-OFF path executing the code exactly where it executes today and give the flag-ON path its own call, or — if extraction is unavoidable — pass the SAME `supabase` couple client plus `groupId`, `user`, and let the callee keep its own `isExploreReplanEnabled()` gate, and add a test that the flag-OFF run performs the identical writes under the identical client.

#### [HIGH] The plan's own registry entries would FAIL flag-chokepoint-scan.test.ts property 2. It adds `lib/shortlist-taxonomy.ts` to `gates` while simultaneously specifying that this module receives the flag "passing the flag down from the page" — a gate that takes the flag as a parameter never invokes `isLockHandshakeEnabled(`, so the gate test reddens. The same contradiction applies to `lib/vendor-overview.ts` and `app/vendor-dashboard/clients/[eventId]/page.tsx`: both are added to `gates`, and neither of their described changes contains a call to the helper (the page derives state via `lockRequestStateOf(row, enabled)`, which is a parameter, not a call).
- **Evidence:** apps/web/lib/flag-chokepoint-scan.test.ts:163-177 — the gate test regexes the comment-stripped source for `isLockHandshakeEnabled\s*\(` and fails naming each dark gate. The plan's callSites entry for lib/shortlist-taxonomy.ts says the derivation calls `lockRequestStateOf`, "passing the flag down from the page"; the entries for lib/vendor-overview.ts and app/vendor-dashboard/clients/[eventId]/page.tsx describe no flag read at all. Precedent for the correct split is in the same file at :98-108 (pureCores receive it) vs :80-96 (gates call it).
- **Fix:** Decide per file: a module that RECEIVES the flag belongs in `pureCores`, never `gates`. Move `lib/shortlist-taxonomy.ts` to `pureCores` alongside `lib/lock-request-state.ts`, and for `lib/vendor-overview.ts` / the vendor client page either add a real `isLockHandshakeEnabled()` early-return (so the extra fetch does not even run flag-off) or drop them from `gates`.

#### [HIGH] The copy edits in `lib/explore-info-copy.ts` are module-level constants with no flag input, so they ship to production the moment the PR merges — with the handshake flag OFF. The plan explicitly instructs updating the handshake line, adding a 'requested' legend entry, and flipping the Lock CTA to 'Ask to book' "when the flag is on", but the module offers no mechanism for that: §11 rule 3 forbids the strings living in JSX, and the consts are rendered directly. (These surfaces are behind the OTHER flag, `isExploreReplanEnabled()`, which is the state prod is intended to be in — replan on, handshake dark — so the leak is live, not theoretical.)
- **Evidence:** apps/web/lib/explore-info-copy.ts:53-55 (`EXPLORE_INFO_HANDSHAKE`), :63-75 (`EXPLORE_STATE_LEGEND`), :220-221 (`CARD_LOCK = 'Lock this'`). Rendered unconditionally at apps/web/app/dashboard/[eventId]/vendors/_components/services-takeover.tsx:426 (handshake line) and :428 (`EXPLORE_STATE_LEGEND.map`), and at apps/web/app/dashboard/[eventId]/vendors/_components/bench-vendor-actions.tsx:188-189 (`label={CARD_LOCK}`). The only flag those paths consult is `isExploreReplanEnabled()` (services-takeover.tsx:330).
- **Fix:** Convert every string PR-H touches into a function of the flag — e.g. `cardLockLabel(handshakeEnabled)`, `stateLegend(handshakeEnabled)`, `exploreInfoHandshake(handshakeEnabled)` — with the flag passed in by the already-gated caller, and pin the flag-off return values in a unit test asserting they equal today's literals.

#### [MEDIUM] The 'Your team' mobile chip is specified to report three counts unconditionally, so with the flag off every couple sees a '0 waiting' segment that does not exist today — in the visible chip AND in the screen-reader summary. This is the only 'Your team' signal on a phone, so it is a guaranteed visible flag-off regression.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/_components/team-summary-chip.tsx:77 (`const summary = `${lockedCount} locked, ${inBuildCount} in build, ${bufferText}``), :82 (aria-label built from it), :105 and :114 (the two visible segments). The plan states: "Report three counts — '{N} locked · {N} waiting · {N} in build' — in the visible chip (:77, :105) AND the screen-reader summary (:114)."
- **Fix:** Render the waiting segment only when `waitingCount > 0` (which is structurally impossible flag-off) and build the aria summary from the same condition, so the flag-off string is byte-identical to today's two-count form.

#### [MEDIUM] PR-H widens six SHARED pure modules but registers only one of them, so property 3 stops protecting the very modules the plan relies on for flag-off identity. `pureCores` for the handshake flag would contain just `lib/lock-request-state.ts`; `lib/coverage-strip.ts`, `lib/vendors-plan-budget.ts`, `lib/your-team.ts`, `lib/shortlist-taxonomy.ts` and `lib/explore-info-copy.ts` are all being given new states/buckets and none is registered, so any one of them could start reading the env with the whole suite green.
- **Evidence:** apps/web/lib/flag-chokepoint-scan.test.ts:178-192 (the pure-core check iterates ONLY `flag.pureCores`) and :123 (`pureCores: []` for NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED today). The modules being widened: lib/coverage-strip.ts:35 (`CoverageState`), :79-90 (`coverageStateOf`), :107-122 (`timelineStatusForTile`), :217-232 (`folderSummaryOf`); lib/vendors-plan-budget.ts:161 (`ChildState`), :525-532 (`childStateOf`); lib/your-team.ts (teamMoney third bucket, already a pureCore of the OTHER flag only).
- **Fix:** Add all five to `pureCores` of the NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED entry in the same PR that widens them, and give each a flag-off table test asserting the new state is unreachable when the marker columns are null.

#### [MEDIUM] The plan's flag-OFF identity test is DB-only. Its one integration case asserts `status='contracted'` and `lock_requested_at IS NULL` on three lock paths, and its one unit case covers `lock-request-state.ts` alone — nothing pins the RENDER-side pure modules whose outputs the plan changes. The plan's own claim that a request state is inert flag-off rests on 'the columns are always null', which is exactly the kind of derived judgement that needs a test, not an argument. The plan also describes `childStateOf` returning "locked → waiting → considering → empty", naming values that are not in the type, and never says which query must select the new columns for the legacy accordion — so the flag-ON behaviour there may silently never appear either.
- **Evidence:** apps/web/lib/vendors-plan-budget.ts:161 (`export type ChildState = 'empty' | 'considering' | 'finalized'` — there is no 'locked' member) and :525-532 (`function childStateOf(picks: AccordionPick[], hardSingle: boolean)` reads only `p.raw_status`, takes no flag and no marker columns); consumed by lib/coverage-strip.ts:229 via `timelineStatusOf(g, daysUntilWedding, childState)` and gated at lib/vendors-plan-budget.ts:513 (`if (state === 'finalized') return 'locked'`).
- **Fix:** Add a flag-off snapshot test per widened pure module — feed rows carrying all five marker columns as NULL and assert `coverageStateOf`, `timelineStatusForTile`, `folderSummaryOf`, `childStateOf`, `buildShortlistFolders` and `teamMoney` return exactly what they return today — and correct the `childStateOf` spec to name real `ChildState` members plus the query that must select the markers.

### SECURITY — REVOKE hygiene, ownership gates, forgeability (couple↔vendor), anon reach, exposure/anon-RPC baselines
**Verdict: NEEDS_CHANGES**

#### [HIGH] CONFUSED DEPUTY: the vendor's agree action runs ADMIN-CLIENT side effects against an event_id the VENDOR supplies in the form, and the RPC never validates that event_id against the booking. The plan's action spec says to read `event_id` + `vendor_id` from FormData and then call `applyPostLockEffects(admin, {eventId, vendorId, targetCategory, groupCategories, isHardSingle})` plus `emitNotification` to `event_members` for that eventId. `agree_vendor_lock_request(p_event_vendor_id UUID)` takes ONLY the booking id — event_id is never a parameter and is never cross-checked. So a vendor who legitimately owns ONE booking anywhere passes the gate with their own vendor_id, then aims the admin-client archive sweep, the inquiry-displacement + TOKEN REFUND block, the category auto-complete and the proposal auto-resolve at an arbitrary event_id. In finalizeVendor these same effects are safe only because they run on the COUPLE's RLS client (`const supabase = await createClient()`) inside the couple's own event scope; the plan changes BOTH guards at once — RLS client → admin client, and couple-supplied event id → vendor-supplied event id. The shipped `vendorAcknowledgeDeposit` already has the milder version of this bug (FormData eventId → `acquireSchedulePoolsForBooking(admin, eventId, anchorId)`), so copying it 'EXACTLY' as the plan instructs propagates it into a much larger blast radius.
- **Evidence:** apps/web/app/dashboard/[eventId]/vendors/actions.ts:682 (`const supabase = await createClient()` — finalizeVendor's effects run on the couple's RLS client), :1730-1745 (archive-others `.eq('event_id', eventId)`), :1779-1804 (inquiry displacement + refund `.eq('event_id', eventId)`); apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts:109-111 (eventId from FormData), :129-141 (`createAdminClient()` … `.eq('event_id', eventId)`), :206 (`acquireSchedulePoolsForBooking(admin, eventId, anchorId)`)
- **Fix:** Never trust the vendor-supplied event id for anything but the redirect path. The plan's own SQL already returns it — `agree_vendor_lock_request` builds `jsonb_build_object('status','ok','agreed_at',NOW(),'event_id', v_event_id)`. Use `env.event_id` (the value the DEFINER function read off the booking row it authorized) as the sole input to `applyPostLockEffects` and to the couple-notification lookup, and hard-fail the action when `env.event_id` differs from the posted one. Add a db/integration test: vendor owns booking B in event E1, posts `event_id=E2` — assert nothing in E2 is archived, refunded, or notified. Fix the same line in the shipped `vendorAcknowledgeDeposit` while you are there.

#### [HIGH] THE COUPLE CAN STILL FORGE 'THE VENDOR AGREED' — the plan guards the decorative columns and leaves the load-bearing one open. Under PR-H, `status='contracted'` stops meaning 'the couple locked' and starts meaning 'the vendor agreed'. But a couple holds a table-wide UPDATE grant on event_vendors plus a column-unrestricted `FOR ALL` RLS policy on their own event's rows, and the plan's new BEFORE UPDATE trigger guards only lock_agreed_at / lock_request_closed_at / lock_request_closed_reason / lock_request_note — NOT status. So `PATCH /rest/v1/event_vendors?vendor_id=eq.…` with `{"status":"contracted"}` from the browser still succeeds (the only DB objection is enforce_booking_requires_verified_vendor, which checks the vendor is VERIFIED, not that they agreed). Worse, the plan's own read model makes the forgery invisible: `lockRequestStateOf` is specified to return 'locked' for any confirmed status regardless of markers — deliberately, so legacy and Locked-QR bookings don't show a phantom 'waiting'. A forged row has status='contracted' with all lock_* markers NULL, which is byte-identical to a legacy booking. Every couple surface, the vendor's client page, and the step-5 money path then treat it as a real agreement. The plan's stated reason for not using column privileges — 'a column-level REVOKE UPDATE does NOT close this' — is true only if you skip the table-level revoke, which this project already does elsewhere.
- **Evidence:** supabase/security/exposure-surface.baseline.txt:229 (`tpriv public.event_vendors|authenticated SIUD`), :1934 (`col public.event_vendors.status anon=SIU authenticated=SIU`), :5443 (`event_vendors_couple_write mode=PERMISSIVE cmd=ALL roles=authenticated using=(event_id IN (SELECT current_couple_event_ids())) check=(…)` — no column restriction); supabase/migrations/20270927437859_booking_requires_verified_vendor.sql:76-85 (the only DB objection is verification state); precedent for the stronger fix: supabase/migrations/20271005100000_events_column_update_privileges.sql:202-204 (`REVOKE UPDATE, INSERT ON public.events FROM authenticated, anon` then `GRANT UPDATE (allowlist)`)
- **Fix:** Extend the new guard trigger to cover `status` itself: when `current_user IN ('authenticated','anon')` and `NEW.status IS DISTINCT FROM OLD.status` and NEW.status is one of ('contracted','deposit_paid','delivered','complete') and `OLD.status` was not already confirmed, RAISE 42501 — the transition INTO a booking becomes RPC-only, exactly the boundary `enforce_booking_requires_verified_vendor` already recognises. Gate it on `isLockHandshakeEnabled()`'s DB twin or ship it in the same flag-dark migration so flag-OFF behaviour is unchanged. Add the mirror of the plan's own forgery test: as role `authenticated`, raw-UPDATE status to 'contracted' ⇒ 42501, then assert status is STILL 'considering'. Also close SITE 8 (`updateVendorStatus`) at the DB, not only in TypeScript — the plan's TS-only check is bypassed by the same PATCH.

#### [HIGH] PRIVILEGE ESCALATION: the couple-side RPCs use a resolver that is strictly WIDER than the shipped write policy for this exact table. `request_vendor_lock` and `cancel_lock_request` gate on `current_couple_or_coordinator_event_ids()`, which returns every event where the caller has an `event_members` row of member_type couple OR coordinator — with no area-permission check at all. The shipped write path for event_vendors is `event_vendors_moderator_write`, gated on `moderator_area_level(event_id,'vendors') = 'edit'`, which requires an accepted, non-removed event_moderators row AND either an explicit `areas.vendors='edit'` or `edit_all=true`. And every accepted host gets an unconditional event_members 'coordinator' row — the accept code's own comment says access is 'enforced per-area by the moderator RLS policies', which is precisely the guarantee the new RPCs route around. Net: a host invited to help with the GUEST LIST, with vendors set to view-only, can create a binding lock request to a vendor, and can CANCEL the couple's live request to a vendor. The plan's justification ('the SAME resolver the shipped vendor_lock_proposals INSERT policy uses') copies a gate from a PROPOSAL table — proposing is not executing — and the plan itself notes all four of that table's call sites use createAdminClient(), so those policies have never actually enforced anything.
- **Evidence:** supabase/migrations/20270206186005_coordinator_can_submit_host_review_rls_one_per_vendor_event.sql:42-53 (`current_couple_or_coordinator_event_ids()` — `SELECT event_id FROM event_members WHERE user_id = auth.uid() AND member_type IN ('couple','coordinator')`); supabase/security/exposure-surface.baseline.txt:5445 (`event_vendors_moderator_write … using=(moderator_area_level(event_id,'vendors')='edit')`); supabase/migrations/20261129003000_coordinator_delegate_rls.sql:47-69 (moderator_area_level requires accepted_at NOT NULL, removed_at IS NULL, and edit); apps/web/app/host/accept/[token]/actions.ts:94-104 (unconditional `member_type: 'coordinator'` upsert on accept, with the comment at :92-93)
- **Fix:** Gate both couple-side RPCs on the SAME predicate the table's own write policy uses: `is_couple_member(p_event_id) OR public.moderator_area_level(p_event_id,'vendors') = 'edit' OR public.is_admin()`. Both helpers already ship (20261129003000:47,74). Add a db-test: a coordinator with `permissions_json->'areas'->>'vendors' = 'view'` calling request_vendor_lock and cancel_lock_request ⇒ 42501 both times, and assert lock_requested_at is unchanged after each — not merely that it threw.

#### [MEDIUM] NO ACTOR ON A BINDING ACT, and the plan's reason for omitting one is factually wrong. The plan drops the actor column and argues that 'who clicked agree is already recoverable from the action's fault/console log path'. It is not. The only actor-recording trigger on event_vendors is `log_delegate_write`, which returns early for anyone who is not an ACTIVE event_moderator on the event — a vendor is never one, so a vendor's agree writes zero audit rows. The event_action_log's `performed_by_role` has no vendor value either. And console.error only fires on FAILURE. Meanwhile the agree gate deliberately admits AGENTS (`agent_assigned_service_ids()`), so any staff seat assigned to the service can commit the vendor org to a booking with no attribution at all. The comparable shipped object, vendor_lock_proposals, carries `proposed_by_user_id` and its RLS enforces `proposed_by_user_id = auth.uid()`. This is a non-repudiation gap on the exact act the whole PR exists to create.
- **Evidence:** supabase/migrations/20261129003000_coordinator_delegate_rls.sql:128-140 (early return unless the actor is an active event_moderator), :177-190 (`performed_by_role` written as 'coordinator' only); supabase/migrations/20270315091571_vendor_read_payment_ledger_rls.sql:42-46 (`UNION … WHERE ev.service_id IN (SELECT public.agent_assigned_service_ids())` — agents pass the gate); supabase/security/exposure-surface.baseline.txt:5835 (`vendor_lock_proposals_host_insert … check=(… AND (proposed_by_user_id = auth.uid()))`)
- **Fix:** Either record the actor or stop claiming it is recoverable. Cheapest honest option that adds no new subject-bearing table and no new FK to auth.users: have `agree_vendor_lock_request` and `decline_vendor_lock_request` INSERT one row into the existing admin/audit ledger (or `event_action_log` with a widened role value) carrying `auth.uid()`, the booking id and the verdict. If the plan prefers no write at all, delete the sentence 'already recoverable from the action's fault/console log path' from the rationale — an untrue mitigation is worse than a stated gap, because the next reviewer will not re-check it.

#### [MEDIUM] THE AGREE GATE HAS NO PRINCIPAL FOR OFF-PLATFORM VENDORS, so flag-ON silently breaks locking for a whole class of bookings. `current_vendor_event_vendor_ids()` matches a booking only via `marketplace_vendor_id IN current_vendor_profile_ids()` or `service_id IN agent_assigned_service_ids()`. Off-platform / manual vendors carry NULL for both — finalizeVendor's own comment calls this out and deliberately leaves linked_vendor_profile_id NULL for them. The plan's call-site change (g) replaces the generic status UPDATE with `request_vendor_lock` unconditionally when the flag is on, with no marketplace_vendor_id branch anywhere in the plan. Result: a couple locking a vendor they found off-platform creates a request that NO account on earth can agree to, sits in 'considering' for 7 days, and is then closed as 'expired' with a message saying the vendor did not answer — for a vendor who was never told and has no way to answer. The same NULL check that exempts them from the verification trigger is the check the plan is missing.
- **Evidence:** supabase/migrations/20270315091571_vendor_read_payment_ledger_rls.sql:38-47 (the only two membership arms); apps/web/app/dashboard/[eventId]/vendors/actions.ts:1405-1407 (`NULL for off-platform / custom vendors (no profile to attribute to) — left NULL, which is correct`), :732-738 (the verification gate explicitly skips rows with no marketplace_vendor_id); supabase/migrations/20270927437859_booking_requires_verified_vendor.sql:56-59 (`IF NEW.marketplace_vendor_id IS NULL THEN RETURN NEW`)
- **Fix:** Mirror the existing exemption: in the flag-ON branch of finalizeVendor (and lockPackage, and bookVendorAtChatLock), take the request path ONLY when `targetVendor.marketplace_vendor_id` is non-null; otherwise keep today's direct lock to 'contracted', because there is no counterparty to agree. Belt-and-braces in SQL: have `request_vendor_lock` return `{'status':'no_counterparty'}` (and write nothing) when the row's marketplace_vendor_id IS NULL, so a future call site cannot re-open it. Add a db-test asserting a manual-vendor row still reaches status='contracted' with lock_requested_at NULL under flag ON.

#### [LOW] The agree RPC's `EXCEPTION WHEN check_violation` is over-broad and will report a data-integrity failure to the vendor as an authorization failure. The plan adds `event_vendors_lock_request_close_coherent` as a CHECK constraint on the same table, and the verified-vendor trigger raises with `ERRCODE = 'check_violation'`. Any violation of the new coherence CHECK inside that UPDATE — the plan's own supersede branch writes closed_at + closed_reason, so it is reachable — is caught by the same handler and returned as `{'status':'not_verified'}`, telling a fully verified vendor to 'finish your verification to accept bookings'. A misleading authorization message is how a real defect gets triaged as a user error and never investigated.
- **Evidence:** supabase/migrations/20270927437859_booking_requires_verified_vendor.sql:80-85 (`RAISE EXCEPTION 'vendor_not_verified: …' USING ERRCODE = 'check_violation'`); the plan's migrationSql adds `ADD CONSTRAINT event_vendors_lock_request_close_coherent CHECK (…)` on public.event_vendors and then catches `WHEN check_violation` around an UPDATE of that same table
- **Fix:** Discriminate inside the handler before deciding the verdict: capture `GET STACKED DIAGNOSTICS v_msg = MESSAGE_TEXT, v_con = CONSTRAINT_NAME` and return 'not_verified' only when the message starts with 'vendor_not_verified' (or v_con IS NULL); otherwise RE-RAISE. A coherence-constraint bug must fail loudly, not masquerade as a verification prompt.

#### [LOW] The baseline-regeneration instruction tells the reviewer to look for a string that does not exist in the file, and omits the lines that will actually change. The plan says 'every new function line must read anon=- , never anon=SIU'. Function facts are not rendered that way — they read `func <sig> secdef=yes exec=anon,authenticated`, and `anon=SIU` is the COLUMN fact format. Separately, the five new event_vendors columns will each add a `col … anon=SIU authenticated=SIU` widening line (they inherit the table-wide grant, which is exactly why the plan chose a trigger over column privileges), and the plan never mentions them — so a reviewer following it will diff for the wrong token, see nothing, and wave through five new anon-granted columns without noticing. They are inert today only because anon holds no RLS policy on event_vendors; that is a second fact worth stating in the PR rather than leaving implicit.
- **Evidence:** supabase/security/exposure-surface.baseline.txt:6030 and :6040 (`func public.current_couple_or_coordinator_event_ids() secdef=yes exec=anon,authenticated`), :1888-1941 (the `col public.event_vendors.* anon=SIU authenticated=SIU` block the new columns will join), :5442-5445 (all four event_vendors policies are roles=authenticated — anon has no policy); apps/web/tests/db/exposure-surface.ts:391-418 (func facts carry `exec=`, not `anon=`)
- **Fix:** Rewrite the instruction: after regenerating on top of a fresh origin/main, the diff must show exactly four added `func` lines reading `exec=authenticated` (never `exec=anon,authenticated`), zero `func` line for expire_stale_lock_requests (service_role-only functions are not emitted), and exactly five added `col public.event_vendors.lock_*` lines reading `anon=SIU authenticated=SIU` — stating in the PR body that anon is inert here because event_vendors carries no anon policy, and that the trigger is what actually guards those columns against `authenticated`. Also confirm apps/web/tests/db/anon-rpc-surface.baseline.txt gains ZERO lines, which it will, since `REVOKE ALL … FROM PUBLIC` is present on all five functions and is the only thing standing between them and anon (ALTER DEFAULT PRIVILEGES was revoked for anon/authenticated in 20271030569442:162-165 but never for PUBLIC).

_34 problems recorded across 5 lenses._