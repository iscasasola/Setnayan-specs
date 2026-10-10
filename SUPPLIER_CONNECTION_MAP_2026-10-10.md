# Supplier connection map — couple's Event Suppliers page <-> supplier dashboard (2026-10-10)

Read-only mapping. Nothing built, run, pushed or applied. Every claim cites a file and a greppable symbol, never a line number. All paths are under `apps/web/` unless they start with `supabase/` or `lib/` (= `apps/web/lib/`).

Checkouts read (never `~`):
- COUPLE = `wt-suppliers-now` (`rd/suppliers-on-main`, a73bb03fc: PR0 foundation, PR1 shell, PR2 Find + supplier sheet, merged onto main 64746f064).
- SUPPLIER = `wt-supdash-now` (`rd/supplier-dashboard-on-main`: S-PR0 foundations + S-PR1 Today only; every other supplier page is the OLD page).
- WRITTEN-unverified: `wt-sup-build` (`rd/suppliers-build-part`: `lib/book-this-build.ts`, `build-body.tsx`, `book-this-build.tsx`, `build-actions.ts`) and `wt-sup-booked` (`rd/suppliers-booked-part`: `booked-body.tsx`, `booked-row.tsx`, `lib/booked-rows.ts`, Budget screen).
- Documents: corpus origin/main, `SUPPLIERS_BUILD_PLAN_2026-10-07_fable.md` (PR0-PR6), `SUPPLIERS_PAGE_STATE_2026-10-10.md`, `SUPPLIER_DASHBOARD_REDESIGN_2026-10-08_fable.md` § 6 (S-PR0-S-PR12), `SUPPLIER_DASHBOARD_BUILD_STATUS_2026-10-08.md`, `HANDOFF_2026-10-10_Event_Hub_and_Suppliers.md`.

Status words used for the couple's surface: LIVE (on main today) · MERGED-DRAFT (in `rd/suppliers-on-main`, not on main) · UNVERIFIED (in `wt-sup-build` / `wt-sup-booked`) · NOT BUILT.
Supplier surface: REBUILT (S-PR0/S-PR1) · OLD page · NOT PLANNED.

---------------------------------------------------------------------------------------------------

## 0. The facts that decide many rows (read these first)

**F1. The email allowlist** is `EMAIL_ENABLED_TYPES` in `lib/notification-emit.ts` (push allowlist: `PUSH_ENABLED_TYPES`, same file; it holds only `chat_message`, `vendor_inquiry_received`, `security_alert`, `inquiry_accepted`). A type not in it reaches nobody away from the app. Checked one by one (EMAIL / in-app only):
- EMAIL: `chat_message` · `inquiry_accepted` · `lock_request_received` · `lock_request_agreed` · `lock_request_declined` · `lock_request_expired` · `lock_request_withdrawn` · `lock_request_nudge` · `booking_confirmed` · `payment_info_sent` · `payment_confirmed` · `payment_cleared` · `payment_rejected` · `date_change_requested` · `date_change_answered` · `date_change_closed` · `date_moved` · `schedule_change_requested` · `review_received` · `completion_accepted` · `deletion_request_received` (+ `_nudge/_agreed/_declined`) · `waitlist_picked` · `booking_fee_waived` · `order_quoted` · `vendor_credit_expiring`.
- IN-APP ONLY (not on the email allowlist): **`vendor_inquiry_received`** (push only) · `inquiry_declined` · `inquiry_displaced` · `inquiry_no_response` · `booking_cancelled` · **`payment_logged`** (the comment in `notification-emit.ts` says this is deliberate "vendor-facing nudge in-app/push register") · `vendor_payment_asked` · `schedule_suggestion` · `review_request` · `vendor_review_reply` · `vendor_joined` · `pax_surcharge_changed`.
- `lib/chat-actions.ts` `notifyOtherParty` says of `vendor_inquiry_received`: "the email it triggers via emitNotification's allowlist". **That is false on this tree**: the type is not in `EMAIL_ENABLED_TYPES`. The only supplier email about an unanswered inquiry is `sendVendorGhostWarningEmail`, sent by `lib/ghosting.ts` `runLoginGhostingCheck` once per LOGIN of the supplier — a supplier who never logs in never hears of the ask. No digest or cron that covers supplier inquiries was found (`lib/daily-email-jobs.ts` carries the anniversary digest, renewals, etc.; `app/api/cron/` holds anon-draft-sweep, oauth-refresh, papic-fullres-drop, photo-delivery-tick, retention-sweep).
- Same disease as the repo CLAUDE.md "THE OWNER IS NOW TOLD WHEN SOMEBODY PAYS" paragraph: a notification and the allowlist are two halves of one mechanism.

**F2. The status vocabulary actually written** (quote exactly):
- `chat_threads.inquiry_status` (enum `chat_inquiry_status`): `pending` (DB default) · `accepted` · `declined` · `withdrawn` · `expired` · `displaced`. Cancelled set: `CANCELLED_INQUIRY_STATUSES` in `lib/vendor-thread-stage.ts`.
- `event_vendors.status` (enum `vendor_status`): `considering` · `shortlisted` · `contracted` · `deposit_paid` · `delivered` · `complete`. Booked set: `CONFIRMED` in `lib/lock-request-state.ts` / `BOOKED_VENDOR_STATUSES` in `lib/vendors.ts`.
- `event_vendors.lock_request_state`: `pending` · `agreed` · `declined` · `cancelled` · `expired` (derived to `LockRequestState` = `none|requested|declined|cancelled|expired|locked` by `lockRequestStateOf` in `lib/lock-request-state.ts`; "agreed but not confirmed" reads as `cancelled`). Window: `LOCK_ANSWER_WINDOW_HOURS = 48`, enforced by the DB trigger `guard_event_vendor_lock_handshake`.
- `vendor_proposals.status`: `draft` · `sent` · `viewed` · `accepted` · `declined` (+ superseded by `supersede_prior_vendor_proposals`). Couple's answer RPC `respond_vendor_proposal` takes `accepted|declined` only from `sent|viewed`.
- `event_date_change_requests.state`: `open` · `withdrawn` · `applied`; per-supplier `event_date_change_answers.answer`: `asked` · `moved` · `unlocked` · `dropped` (`supabase/migrations/20271259875335_a_clashing_date_goes_to_the_supplier.sql`).
- `vendor_invites.status`: `pending` · `claimed` · `declined` · `expired`.
- Payments are timestamps, not a status enum: `event_vendor_payments.vendor_confirmed_at`, `payment_refused_at` (`confirm_vendor_payment`, `refuse_vendor_payment`); the deposit has `event_vendors` deposit markers (recorded / acknowledged / declined) read by `lib/booked-money-step.server.ts` into `depositStep` = `due|refused|sent|unknown|confirmed` (`lib/your-team-rows.ts`).
- Calendar: `vendor_calendar_blocks.block_source` = `manual` · `setnayan_booking` · `synced_calendar` · `external_client`; `vendor_calendar_day_states.day_state` = `locked` | `whitelist`; `vendor_schedule_pool_bookings.released_at`.

**F3. Flags.** The new Find, Build and Booked all live behind `isExploreReplanEnabled()` (`lib/explore-replan-flag.ts`, `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED`); memory `explore-replan-flag-is-on-in-prod` says ON in Vercel production as of 2026-09-06 (re-measure). `isLockHandshakeEnabled()` (`lib/lock-handshake-flag.ts`, `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED`, code default OFF): memory `the-lock-handshake-is-couple-asks-supplier-agrees` shows it ON in the 2026-09-18 walk; **prod value not re-measured here** (a code default is not a prod value). Every row below that says "the ask" assumes it ON; with it OFF `finalizeVendor` books directly with no supplier answer. `BUDGET_BUILD_ENABLED` defaults ON in code. `VENDOR_TIER_SEARCH_GATE` defaults OFF (`lib/vendor-search-gate.ts`).

**F4. The thread page is in no supplier plan step.** S-PR0..S-PR12 (§ 6 of the redesign) do not name Messages / the thread page (frame 36 is "kept" in § 4 row 8 and § 9). The supplier's accept-inquiry, decline, send-quote and "Book" buttons live there (`app/vendor-dashboard/messages/[threadId]/page.tsx`, `proposal-actions.ts`). Only the envelope (S-PR0) and the Today rows (S-PR1) are rebuilt.

---------------------------------------------------------------------------------------------------

## PART 1 — every connection, one row each

Format per row: **C** couple's side · **M** the middle · **S** supplier's side · **R** the return · **Verdict**.
S-PR numbers are the supplier dashboard plan's. "PRn" is the Suppliers build plan's.

### A. Asking, answering, quoting

**1. Ask for a quote / inquire**
- C: LIVE and MERGED-DRAFT. Verb `ask` ("Ask for a quote", tone info, main) from `cardVerbs` in `lib/supplier-card-verbs.ts`, drawn by `vendors/_components/bench-vendor-actions.tsx`; handler `contactShortlistVendor` (`vendors/_actions/contact-shortlist-vendor.ts`) -> `startServiceInquiry` (`app/v/[slug]/inquiry-actions.ts`, stamps `inquiryAttribution`/`inquirySource: 'shortlist'`); also `unlockCategoryWithInquiry` (`vendors/_actions/unlock-category.ts`) and the supplier's public page.
- M: inserts/upserts `chat_threads` (`inquiry_status='pending'`, `UNIQUE(event_id, vendor_profile_id)`), first message via `notifyOtherParty` (`lib/chat-actions.ts`) with `isFirstMessage` -> notification `vendor_inquiry_received` to the shop's `user_id` (anonymised until accept). Allowlist: **push only, NOT email** (F1). Velocity gate `lib/inquiry-gate.ts` is dormant behind `NEXT_PUBLIC_INQUIRY_GATE_ENABLED`.
- S: OLD thread page + REBUILT Today row (WhatsNewCard `kind:'inquiry'`, title "Reply to a new inquiry", `lib/supplier-today.ts` `answerNext`, `lib/vendor-overview.ts` `WhatsNewCard`, `vendor-overview-inquiry-card.ts`). Answer buttons `acceptInquiry`/`declineInquiry` mounted from `app/vendor-dashboard/_components/overview-sections.tsx` and the thread page. Rebuilt by S-PR1 (Today); the thread by NO step (F4).
- R: Find card reads `sheetStateLine` ("Asked for a quote" when `hasThread`) and `lib/supplier-standing.ts`; row word comes from `categoryRowState` in `lib/suppliers-shell.ts`. Standing is derived from the same `inquiry_status` + proposals the supplier's action writes (`resolveThreadStage`).
- **Verdict: BROKEN** — the surfaces meet, but the supplier's only away-from-app signal for the ask is push, and an invited supplier with no push subscription who does not log in never learns of it (F1). Fix is one allowlist line plus an email template; it is in neither plan.

**2. Supplier accepts the inquiry (opens the conversation)**
- C: LIVE. Nothing to press; thread state read by Find (`standing`).
- M: `acceptInquiry` in `lib/chat-actions.ts` -> `chat_threads.inquiry_status='accepted'`, `accepted_at`; RPC `unlock_vendor_event_free` (no tier gate; "your inbox is never locked", owner 2026-07-24); notification `inquiry_accepted` to the couple — **EMAIL and push**.
- S: Today row (REBUILT, S-PR1) and thread page (OLD, no step).
- R: couple's Chat/Nudge/"Read their reply" verbs need the thread (`thread = actions.inquiry?.kind === 'check'` in `cardVerbs`); same status.
- **Verdict: WHOLE**.

**3. Supplier declines the inquiry**
- C: LIVE. Card reverts: `hasLiveInquiry` false -> verb `ask` again (`resolveBenchCardActions`, `lib/bench-card-actions.ts`); `lockWithheld='inquiry_declined'`; the sentence "Declined" comes from `lib/thread-decisions.ts`.
- M: `declineInquiry` (`lib/chat-actions.ts`) -> `inquiry_status='declined'`; notification `inquiry_declined` — **in-app only** (F1).
- S: Today/thread (same as 2).
- R: standing line only; no row-level state word in `categoryRowState`.
- **Verdict: BROKEN** (minor) — the couple who was declined is told in-app only; the answer is derived from the same status, so the halves agree, but the notification reaches nobody away from the app.

**4. Supplier lets an inquiry go unanswered**
- C: nothing on the Suppliers page.
- M: `lib/ghosting.ts` `runLoginGhostingCheck` (48 h `GHOST_THRESHOLD_HOURS`, runs on the actor's LOGIN only, no cron): `inquiry_no_response` to the couple / supplier warning email (`sendVendorGhostWarningEmail`). I found no writer that sets an inquiry to `expired`.
- S: none planned.
- R: none on the page.
- **Verdict: UNKNOWN** — what ends a never-answered inquiry (the `expired` value exists in the enum and `CANCELLED_INQUIRY_STATUSES`) I could not find writing.

**5. Supplier sends a quote**
- C: LIVE (reads). A quote lands as a chat card (`chat_messages.proposal_id`) and `/proposals/[publicId]`.
- M: `sendProposalCore`/`sendProposalFromChat` (`lib/proposal-send.ts`, `app/vendor-dashboard/messages/[threadId]/proposal-actions.ts`): requires `inquiry_status === 'accepted'` ("You can only send a quote on an open conversation"); `vendor_proposals` `draft -> sent`; `supersede_prior_vendor_proposals`; `vendor_may_requote` refuses `deal_locked` / `lock_requested`; notification via `notifyOtherParty` as `chat_message` (EMAIL + push). The tier gate was removed (comment "Inbox ungated").
- S: OLD thread page (Quote button) and OLD `proposals/`; Today "Send your quote" row (REBUILT). The Quote button moves to the thread/customer card thumb row in S-PR5 ("Quote ‹ Customer", frame 36).
- R: `buildBenchStandings` -> `SupplierStanding.needsYou` (quoted stage = `sent|viewed`) -> row word "N quote in" (`categoryRowState`, `quoteInCount`) and verb "Read their reply" (`cardVerbs`, `quoteIn`). Same status the supplier's action writes.
- **Verdict: MEETS ONLY ON THE OLD PAGE** (the couple half is done; the supplier sends the quote on the page no S-PR rebuilds).

**6. Couple reads, accepts or declines a quote**
- C: LIVE: chat card + `/proposals/[publicId]` (`respond_vendor_proposal` via `respondToProposal`). Accepting upserts an `event_vendors` row; "accepting a quote is not booking it" (`lib/accepting-a-quote-is-not-booking-it.test.ts`).
- M: RPC `respond_vendor_proposal(accepted|declined)`. **No notification is emitted to the supplier by TS or by the DB function** (searched; no `proposal_accepted`-type exists).
- S: `lib/supplier-next-move.ts` derives "accepted your quote and asked to lock you in" / "accepted your quote… nothing to do until then" on the customer card; Today rebuilt (S-PR1) shows the lock ask when it comes.
- R: standing line.
- **Verdict: WHOLE** by pull (the supplier sees it on opening the card); no push.

**7. Nudge**
- C: MERGED-DRAFT verb `nudge` ("Nudge", warn) in `cardVerbs` for a card with a thread and no price/ask; `contactShortlistVendor({nudgeThreadId})` sends `NUDGE_MESSAGE` through `sendChatMessageCore` (`lib/chat-send.ts`).
- M: the one-follow-up rule: while the thread is `pending` the couple may send the inquiry plus ONE follow-up; a second returns `followup_used`. On an `accepted` thread no limit. Notification `chat_message` (EMAIL).
- S: chat in the thread (OLD).
- R: "Nudged <name>." or the honest error message (`bench-vendor-actions.tsx` `nudge`).
- **Verdict: WHOLE** (the Nudge verb is still offered after the follow-up is used and then refuses with the message — honest, not silent).

**8. Chat, both directions**
- C: LIVE `/dashboard/[eventId]/messages/[threadId]`; the verb `chat` (info). The Suppliers shell has no Messages section (approvals 5/8: the shell's Messages icon is the only inbox door).
- M: `sendChatMessage` -> `sendChatMessageCore`; `notifyOtherParty`; `chat_message` EMAIL + push both ways.
- S: REBUILT envelope with unread badge (S-PR0 `UnreadMessagesBadge`); the inbox and thread pages are OLD (`messages/surface.tsx`, `messages/[threadId]/page.tsx`); desk rows lack a Chat button (deviation 5, needs `threadId` on the desk reads in S-PR5).
- R: same thread.
- **Verdict: MEETS ONLY ON THE OLD PAGE**.

### B. Interest signals (no answer expected)

**9. Save / shortlist** — C: LIVE `event_vendors.status='considering'` (`saveVendorToPicks`, `app/explore/actions.ts`). S: nothing, by owner ruling (`lib/same-date-demand.ts` header: saving "is NOT competition", counted only from a thread). **Verdict: ONE-SIDED by design** (supplier half deliberately absent).

**10. Follow a supplier** — C: MERGED-DRAFT sheet "Follow" (`vendors/_components/supplier-sheet.tsx`) -> `followVendor` (`lib/follow-actions.ts`, table `vendor_follows`); the claim flow also auto-follows (`applyClaimAutoLink`). S: no follower count or notice anywhere in `app/vendor-dashboard` (searched). **Verdict: ONE-SIDED** (supplier half missing; not in any S-PR).

**11. Add to a build** — C: MERGED-DRAFT verb `add`/`in_build` (`setBuildPick`, `build-pick-actions.ts`, table `event_build_picks`); Build body UNVERIFIED in `wt-sup-build` (`build-body.tsx`, `lib/suppliers-build.ts`). S: nothing (a build is the couple's private plan). **Verdict: ONE-SIDED by design**.

### C. Booking: the ask and the yes

**12. "Book" / "Book this build" — the couple asks**
- C: LIVE verb `book` (`accordion-lock.tsx`, `finalizeVendor`); MERGED-DRAFT button in the card row; "Book this build" = loop over `finalizeVendor` is UNVERIFIED (`lib/book-this-build.ts` `bookOutcomeOf`, `book-this-build.tsx`). Packages: `lockPackage` (`vendors/packages/actions.ts`).
- M: `finalizeVendor` (`vendors/actions.ts`): with the handshake `handshakeAsk = isLockHandshakeEnabled() && !!marketplace_vendor_id` -> writes `lock_request_state='pending'` (status stays `considering`) and returns `{status:'lock_requested'}`; notification `lock_request_received` — **EMAIL** ("You have 48 hours"). Ask is blocked on the date when the supplier is unavailable (`isUnavailableOnDate`). The ask returns BEFORE the booking side-effects (claim-link invite, `booking_confirmed`, payment-plan snapshot, rival sweep, category auto-complete).
- S: REBUILT Today: WhatsNewCard `kind:'lock_request'` ("Agree to this booking", Agree/Decline in place, `vendorAgreeToLock` / `vendorDeclineLock`, `app/vendor-dashboard/clients/[eventId]/actions.ts`); S-PR1 done. Docblock in `lib/vendor-overview.ts` still says "7-day deadline"; the DB and the email say 48 hours.
- R: "Waiting for their yes": old `your-team-rows.ts` group `asked` pill "Waiting", next "they confirm your booking · <fuse>"; Find sheet line "Asked to book · waiting for their yes" (`sheetStateLine`); Booked-tab section "Waiting for their yes" is UNVERIFIED (`lib/booked-rows.ts` `WAITING_HEADING`). All derived from `lockRequestStateOf`, which reads the same `(status, lock_request_state)` the supplier's RPC writes.
- **Verdict: WHOLE** on the ask itself (the best-connected pair in the product). Caveat: `finalizeVendor` returns `expiresAt` computed as +7 days (`7 * 86_400_000`) while the DB enforces 48 h; no component reads it (searched), so harmless today.

**13. Supplier agrees — the yes**
- C: LIVE/MERGED-DRAFT row flips to Booked.
- M: `vendorAgreeToLock` -> RPC `vendor_agree_to_lock` (`status='contracted'`, `lock_request_state='agreed'`, slot capacity, package cascade) then TS: `stamp_setnayan_gift_at_lock`, `narrowEventDateAfterAgreement`, notification `lock_request_agreed` — **EMAIL** ("They will send you their payment details next").
- S: Today row (REBUILT) / customer card (OLD).
- R: `lockRequestStateOf` -> `locked`; "Booked ✓" (`categoryRowState`), Booked-tab row.
- **Verdict: WHOLE** for the status. What it does NOT do is in rows 19 and 30 (no payment plan written; no calendar block).

**14. Supplier declines the ask** — M: `vendorDeclineLock` -> `lock_request_state='declined'`; `lock_request_declined` EMAIL. R: `lockRequestStateOf` returns `declined`, but no row/word consumes it (`lib/your-team-rows.ts`, `lib/suppliers-shell.ts`, `lib/supplier-sheet.ts` and the UNVERIFIED `lib/booked-rows.ts` contain no declined/expired/lapsed wording): the "Waiting for their yes" row simply disappears. S: Today "A booking window closed" quiet row (`lock_request_lapsed`) only for lapsed. **Verdict: ONE-SIDED** (couple's return half missing; email is the only word).

**15. The ask lapses (48 h)** — M: `lib/lock-request-expiry.ts` emits `lock_request_nudge` (near expiry) and `lock_request_expired` (both EMAIL); lazy expiry on the answer path. S: `lock_request_lapsed` card kept a week with no buttons (REBUILT as a quiet row, deviation 3: remove once People S-PR2 shows it). R: as row 14. **Verdict: ONE-SIDED** (same missing word as 14).

**16. Couple withdraws the ask** — C: LIVE/MERGED-DRAFT verb `withdraw` (`withdraw-ask-button.tsx`, `withdrawVendorLockRequest`, RPC `cancel_vendor_lock_request`, state `cancelled`). M: `lock_request_withdrawn` EMAIL. S: the Today row clears (derived from `lock_request_state='pending'`). **Verdict: WHOLE**.

**17. "✕ Remove" on a card that has a conversation**
- C: LIVE/MERGED-DRAFT verb `remove` -> `deleteVendor` (`vendors/actions.ts`): deletes the `event_vendors` row. It does NOT touch `chat_threads` (no `archived_at`, no `inquiry_status='withdrawn'`) and emits nothing; category removal does archive threads (`archiveCategoryThreads` in `vendors/category-decision-actions.ts`), a single card does not.
- S: the inquiry stays on Today as "Reply to a new inquiry" (a supplier can accept and quote a couple who dropped them).
- **Verdict: BROKEN** (the halves disagree: the couple's side thinks the supplier is gone, the supplier's side still has a live ask).

**18. Cancel a booking** — C: LIVE verb in `cancel-booking-button.tsx` -> `cancelBookingAsHost` (hard delete only before a payment; releases a forced date). M: `booking_cancelled` to the supplier — **in-app only**. S: booking leaves Today/Upcoming; date re-opens via `vendor_date_reopens_when_booking_released` (20271121865976). **Verdict: BROKEN** (minor: notification reaches nobody away from the app).

### D. Money

**19. The payment PLAN of a booking** (plan meaning (a); distinct from the payment METHOD)
- Who sets it: the SUPPLIER authors a template per service (`vendor_service_payment_schedules`, `setServicePaymentSchedule` in `vendor-dashboard/services/actions.ts`); at lock `finalizeVendor` freezes it into `event_vendor_payment_plan` (`computePlanInstances`, `is_default_seeded` for the 50/50 pencil-in) and emits `payment_info_sent` (EMAIL); for a self-added supplier the COUPLE writes it (`saveSelfAddedPaymentPlan`, `lib/self-added-payment-plan.ts`); the Locked-QR claim writes one in SQL (migrations `*_locked_qr_*`).
- **Measured gap:** the writer in `finalizeVendor` runs only AFTER the `if (handshakeAsk) { ... return }` block, and the code comment says these effects "run from vendorAgreeToLock". `vendorAgreeToLock` (clients actions) and the SQL `vendor_agree_to_lock` (latest `20271223386305_...`) contain no payment-plan write, no `payment_info_sent`, no `booking_confirmed` (grep of every `from('event_vendor_payment_plan')` writer: `finalizeVendor`, `saveSelfAddedPaymentPlan`, locked-QR SQL only). So with the handshake ON a normal marketplace booking gets NO frozen plan on the supplier's yes; the stand-in is the supplier's "ask for a payment" (row 22). Confirm with a count: marketplace `event_vendors` at `contracted+` with `lock_request_state='agreed'` versus rows in `event_vendor_payment_plan`.
- S: plan is read in `clients/[eventId]/page.tsx` and the thread page (`fetchPlanProgressForVendor`, `lib/vendor-service-payment-schedules.server.ts`) — OLD; Money fold rebuilt by S-PR4/S-PR5. R (couple): `fetchPlanForCouple` null => workspace/pay sheet has no ladder; PR4 plan promises the ladder ("no 50/50 guess").
- **Verdict: BROKEN** (code-measured; not confirmed against production rows).

**20. Pay: the couple logs a payment (deposit or instalment), the supplier confirms**
- C: LIVE `workspace` pay card (`recordDeposit`, `vendors/actions.ts`), Budget (`logScheduledPayment`, `dashboard/[eventId]/budget/actions.ts`); verb `pay`/`payments` (`cardVerbs`, only when `payDue`); the Pay sheet with channels is NOT BUILT (PR4; UNVERIFIED branch has Booked rows only).
- M: writes `event_vendor_payments` + deposit markers; notification `payment_logged` to the supplier — **in-app only** (F1). Supplier answers: `vendorAcknowledgeDeposit`/`vendorRejectDeposit` (clients actions) or `confirmVendorPayment`/`refuseVendorPayment` (`messages/[threadId]/pay-confirm-actions.ts`: RPC `confirm_vendor_payment` sets `vendor_confirmed_at`; `refuse_vendor_payment` sets `payment_refused_at`).
- S: Today card `kind:'lock'` "Confirm <couple>'s payment" (REBUILT S-PR1) for the deposit; instalments on the thread page `vendor-payment-live.tsx` (OLD); Money fold S-PR4/S-PR5.
- R: `depositStep` -> `due | sent ("they confirm your first payment") | confirmed | refused ("Payment not received")` (`lib/your-team-rows.ts`, `lib/booked-money-step.server.ts`) — derived from the markers the supplier's action writes. `payment_confirmed` EMAIL, `payment_rejected` EMAIL.
- **Verdict: BROKEN** — the return path is solid; the supplier's trigger (a payment waiting for their confirmation) is the one money event with no email. (A confirmed deposit also writes the pool booking: `acquireSchedulePoolsForBooking` via `lib/deposit-acknowledged-effects.server.ts`, see row 30.)

**21. Supplier says "it never arrived"** — `refuse_vendor_payment` -> `payment_rejected` EMAIL; couple sees `depositStep='refused'` ("Payment not received" pill + Pay again). **Verdict: WHOLE**.

**22. Supplier asks for a payment** — S: `vendorAskForPayment` (clients actions, migration `20271177403026_a_shop_can_ask_for_a_payment.sql`) OLD customer card, rebuilt as Money fold S-PR5. M: `vendor_payment_asked` — **in-app only**. R: couple's Pay appears when `depositStep`/plan says due. **Verdict: BROKEN** (the one notification that tells a couple an amount is owed is in-app only).

**23. Plan cleared** — `clearVendorPaymentPlan` -> `payment_cleared` EMAIL; couple stepper `fetchPlanProgressForCouple`. **Verdict: WHOLE**.

**24. Price and changes after booking** — C: "Set price" (self-added: `updateVendorCosts`, `self-added-price.tsx`; marketplace: the accepted quote is the price, `lib/accepted-quote-terms.ts`); change orders `raiseChangeOrder`/`respondChangeOrder`/`withdrawChangeOrder` (couple) vs `vendorRaiseChangeOrder`/`vendorRespondChangeOrder`/`vendorWithdrawChangeOrder` (supplier). M: no change-order notification type was found in the `emitNotification` call sites I scanned. **Verdict: UNKNOWN** (what tells the other party about a change order).

### E. Date and calendar

**25. Date change (the couple asks to move; the supplier moves or unlocks)**
- C: LIVE but only from the Event Hub draft (`dashboard/[eventId]/website/hub-draft-actions.ts` -> `askDateChange`, `lib/date-change.server.ts`). The Suppliers page has no date-change state (no reference in `vendors/`); date/place sheets are NOT BUILT (PR5, approval 2).
- M: RPC `ask_event_date_change` -> `event_date_change_requests.state='open'` + `event_date_change_answers.answer='asked'`; supplier answer `answer_event_date_change` -> `moved|unlocked`; couple `settle_event_date_change` -> `applied|withdrawn`; unanswered after 3 days the couple may release -> `dropped`. Notifications `date_change_requested/answered/closed`, `date_moved`: all EMAIL.
- S: REBUILT Today Next card (Move / Unlock, `vendorAnswerDateChange`; S-PR1 frame 31). Deviation 1: the answer is mounted by Today alone.
- R: couple's Hub/Home reads `readOpenDateChange`; the Suppliers page does not.
- **Verdict: ONE-SIDED** on the Suppliers page (it is WHOLE Hub <-> Today).

**26. Room size, "Ask them"** — C: NOT BUILT (PR4; read side `lib/venue-room-size.ts` exists and the seat plan uses it, `dashboard/[eventId]/seating/page.tsx`). S: the venue types its size on its shop (OLD Shop page `shop/_components/editable-row.tsx`; rebuilt in S-PR7). M: canned message via `sendChatMessageCore` is planned. **Verdict: ONE-SIDED** (couple's ask half missing).

### F. After the event

**27. Reviews and completion** — C: LIVE `vendors/[vendorId]/review/actions.ts` (`review_received` EMAIL; `completion_accepted` EMAIL). S: Today `kind:'review'` (REBUILT) and `reviews/` (OLD; Shop > Page > Reviews in S-PR7); `postVendorReply` -> `vendor_review_reply` (in-app only). The starter: `vendorMarkServiceComplete` -> `review_request` to the couple (in-app only), card `mark_complete` on Today. R: reviews feed the supplier sheet (`lib/supplier-sheet-read.ts`). **Verdict: BROKEN** (`review_request` — how the couple is asked to review — and `vendor_review_reply` reach nobody away from the app).

### G. "Add your own" and the claim link (traced in full in 28a-28e)

**28a. The couple adds a supplier by hand**
- C: LIVE (OLD `NewManualVendorModal`, `addManualSupplier`, `vendors/actions.ts`; `event_manual_vendors` + `event_vendors` at `status='considering'`, `marketplace_vendor_id` NULL). The planned screens (twin match "Is it one of these? Yes — Inquire", record sheet, claim QR) are NOT BUILT (PR2-rest; approvals 10, 11). Migration `event_manual_vendors.leak_match_vendor_profile_id` + `platform_settings.fee_leak_price_tolerance` NOT BUILT (the number is the owner's).
- S: nothing — a shop that does not exist yet.
- **Verdict: ONE-SIDED** until claimed.

**28b. The claim link** — C: `createManualVendorInvite` (`vendors/actions.ts`) -> `ensureAutoShareInvite` -> `vendor_invites` (`pending`, `expires_at`) -> `buildClaimUrl(claim_token)` + QR (`claim-link-share.tsx`, `qr-actions.tsx`); also `createAutoShareInviteAction` from the workspace; also auto-created at lock of a manual supplier. Refused for a supplier already on Setnayan (`canInviteSupplier`).

**28c. What the link opens (supplier side)** — `/vendor/claim/[token]` (`app/vendor/claim/[token]/page.tsx`, public, `robots: noindex`, `fetchClaimLandingByToken`): shows the host, event date, category; Decline = `declineVendorInviteByToken` (`status='declined'`); sign-up / log-in then `/vendor/claim/[token]/finalize` (`finalize/page.tsx`): ensures a `vendor_profiles` row (placeholder business name), then `applyClaimAutoLink` (`lib/vendor-invite-actions.ts`).

**28d. The tie** — `applyClaimAutoLink`: requires `vendor_invites.status='pending'` and not expired; sets `event_vendors.marketplace_vendor_id` on the invite's row AND on sibling rows with the same `manual_vendor_id`+`event_id`; invite -> `claimed` (`claimed_by_user_id`, `claimed_vendor_profile_id`); upserts `vendor_follows` for each couple member; upserts `chat_threads(event_id, vendor_profile_id)` — **`inquiry_status` takes the DB default `pending`**; calls `claim_unlock_vendor_event` (a flat 1-"token" burn, `MANUAL_CLAIM_UNLOCK`, `consume_vendor_assets_per_voucher`; failure is swallowed "link kept" — the token wallet was retired 2026-05-11). Then, if the shop has no services, redirect to `services/new/<category>?claim=<token>`; `registerClaimedServiceToCouple` sets `event_vendors.service_id` (only if NULL and category matches) and emits `vendor_joined` to the couple (in-app only). Otherwise `/vendor-dashboard?claimed=1`.

**28e. Where the customer, date and plan then appear for the supplier**
- Customer: Clients list built from `fetchVendorThreadsDetailed` (`lib/chat.ts`) + `fetchVendorRoomEventsDetailed` (`lib/vendor-room-access.ts`) in `clients/surface.tsx` (OLD; People in S-PR2). The claimed customer arrives as a thread at **`pending`** — i.e. an unaccepted, masked inquiry ("anonymization until accept") from the couple who just handed over the link — until the supplier presses Accept.
- Date and brief: `get_vendor_event_brief` returns stage `booked` if the row's `status` is `contracted|deposit_paid|delivered|complete` (a hand-recorded booking can be there), else `inquiry` (pending thread). The timeline/venue/dietary stay withheld until the booking fee gate says `unlocked` (`vendor_event_fee_gate_stage`); a manual supplier never had a charge (`booking_fee_open_lock_charge` -> `not_verified_vendor`).
- Payment plan and payments: stay on the same `event_vendors.vendor_id` row (the claim updates it, it does not copy), so `event_vendor_payment_plan` and `event_vendor_payments` the couple recorded are readable by the supplier on the customer card/thread (`fetchPlanProgressForVendor`) once the stage is `booked`. `confirm_vendor_payment` raises `not_a_marketplace_booking` before the claim and works after it.
- Calendar: **the claim writes nothing on the supplier's calendar.** `event_vendor_autoblock_on_booking` is `AFTER INSERT OR UPDATE OF status` and returns early when `marketplace_vendor_id IS NULL`; setting `marketplace_vendor_id` later is not a status update, so it never fires. The pool booking comes only from `acquireSchedulePoolsForBooking` when the supplier acknowledges a deposit. `fetchVendorRoomEvents` admits a booking only by pool booking, `lock_request_state='agreed'`, or a claimed Locked-QR token (`lib/vendor-room-access-rule.ts` `admitRoomBookings`), so a claimed manual booking is NOT in the supplier's Room / Upcoming / event-day console unless one of those happens.
- **Verdict (28a-e as one): BROKEN** (code-measured, no two-account walk): the couple's record can say booked-and-paid while the supplier sees a pending masked inquiry, no held date and no Room entry; the plan only appears once the stage reads `booked`. The invite (`vendor_invites.status`) state is not shown on the couple's side beyond the `vendor_joined` notice.

**29. Supplier-started booking: the Locked QR** — S: `issueLockedQr` (`invite/actions.ts`; QR folds into Dates in S-PR3). C: scan door. M: SQL `vendor_claim_locked_qr` writes `status='deposit_paid'`, the plan row and the date reservation (migrations `20271174176372_locked_qr_claim_reserves_its_date`, `20271174880981_locked_qr_stamps_the_link`); arm 3 of `admitRoomBookings`. **Verdict: WHOLE** (not walked in this session).

### H. Calendar, schedule, plans (the owner's addition of 2026-10-10)

**30. The supplier's CALENDAR / availability <-> the couple's page**

What writes a date onto a supplier's calendar (exact):
- An inquiry or quote writes NOTHING (supplier sees `pendingInquiryDates`, `lib/vendor-inquiry-dates.ts`, as a display only). A lock ASK writes nothing. The supplier's yes (`vendor_agree_to_lock`) consumes time-slot capacity only (`vendor_service_time_slots`), not the day.
- A deposit acknowledged by the supplier (`acknowledge_vendor_deposit` -> `lib/deposit-acknowledged-effects.server.ts` -> `acquire_schedule_pools`) inserts `vendor_schedule_pool_bookings(booked_date, released_at NULL)` (counts against `vendor_schedule_pools.daily_booking_capacity`).
- `event_vendors.status` becoming `deposit_paid` with a `marketplace_vendor_id` fires `event_vendor_autoblock_on_booking` -> `vendor_block_booked_date` -> `vendor_calendar_blocks` row `block_source='setnayan_booking'`.
- A settled booking-fee charge calls `vendor_hold_date_on_fee_settled` (from `lib/sku-activation.ts`) -> a block (migration `20271239789106_the_paid_fee_holds_the_date`; `paid | waived_free5 | waived_import` count).
- The supplier's own hand: `addManualBlock` (`manual`), synced calendar (`synced_calendar`), imported outside clients (`external_client`, needs a pool), `setCalendarDayState` (`locked` | `whitelist`) in `vendor-dashboard/calendar/actions.ts`.
- NOT writers: a hand-recorded "Add your own" booking (no `marketplace_vendor_id`, the trigger returns early), a claim (not a status update), a date-change request.

What the couple's page reads — THREE different reads that disagree:
1. The "Free on your date" / "Booked that day" line and the Compare/Build window: `getBatchVendorAvailableDays` (`lib/vendor-availability.ts`) reads **`vendor_calendar_blocks` only**. `dateFitByVendorId` is set in `vendors/page.tsx`; `sheetFits` (`lib/supplier-sheet.ts`) prints `'Free on your date'` for `dateFit === 'free'`. It ignores `vendor_calendar_day_states` ('locked'), pool capacity and slot capacity.
2. "More to compare" hiding: `service_cards_unbookable_on(uuid[], date[], bool)` (`supabase/migrations/20271221805341_service_cards_unbookable_on.sql`, wrapper `lib/bench-bookable-days.server.ts`) refuses a day for a manual/synced block, a `locked` day state, a pool at capacity (`pool bookings + external_client blocks >= daily_booking_capacity`) or a full time slot.
3. Down-rank in search: `vendors_blocked_on_date` (migration `20270721314905`) — blocks only, comment "fail-open on the caller side".
So a supplier whose pool is full or whose day is `locked` is hidden from "More to compare" yet reads "Free on your date" on the shortlist card.

**Unread calendar = FREE, in the code's own words** (`lib/vendor-availability.ts`, `getBatchVendorAvailableDays`): "Vendors with no blocks get the full window (V1 default — undeclared calendar = fully available)" and on a read error "every input vendor receives the full window (failing-open…)". In `service_cards_unbookable_on` an absent row is "not refused". In `vendors/page.tsx` the comment is "A calendar flake reads 'free', never a false 'booked'". Only `profileByVendorId` excludes manual suppliers ("Off-platform / manual vendors have no calendar -> never a date badge"). There is no "unknown" state: a supplier who never set a calendar and a supplier who is genuinely open are indistinguishable, so "Free on your date" is printed for both.

Planned couple side: fit line + "Ask about another day" (`another_day` verb, built; its target flow = PR5 date sheet NOT BUILT) + Help me choose (`FindYourDate`, PR5 NOT BUILT). Supplier side: Dates (calendar + waitlist + capacity) is OLD (`calendar/surface.tsx`, `customers/`), rebuilt in S-PR3.
Return words: "Free on your date", "Booked that day" (`sheetFits`), verb "Ask about another day" (`cardVerbs`, `build === 'not_available'`).
- **Verdict: BROKEN** (unset reads as free; two reads of one fact disagree; booking writes land on the calendar only at deposit/fee time and never for hand-made or claimed bookings).

**31. Date clash note and "Help me choose"** — C: LIVE in the Maker/Hub date finder (`lib/date-clash.server.ts` `datePickClash`, `find-your-date.tsx`, `details-date-clash.tsx`); the Suppliers-page date sheet and Help me choose NOT BUILT (PR5). M: both read `vendor_calendar_blocks` via `getAvailableDaysForVendorSet` (a ranking by "days every priced pick is free"). S: calendar OLD. **Verdict: ONE-SIDED** on the Suppliers page; inherits row 30's unset-is-free.

**32. Supplier services and prices -> the couple's cards** — S: OLD `services/` (maker redesign S-PR6/6b/6c). M: `lib/bench-service-cards.ts` (`fetchBenchServiceCards`, `fetchMarketServiceCards`) reads ACTIVE `vendor_services` only, withholds every peso for a shop hiding prices (`fetchVendorsHidingPricesPublicly`), failed read = `null` not `{}`. C: MERGED-DRAFT service cards in Find rows + sheet. Gap: a self-added supplier's card says "No price recorded". **Verdict: MEETS ONLY ON THE OLD PAGE** (supplier edits on the old services pages; the maker lands in S-PR6b/6c).

**33. Plans meaning (b): packages** — S: OLD `vendor-dashboard/packages/` (`savePackage`, `setPackageActive`), S-PR6c folds into Shop > Services. Couple: packages reach the couple only on the supplier's public page (`app/v/[slug]/page.tsx` + `app/_components/vendor-packages/lock-modal.tsx` -> `lockPackage`, which also writes `lock_request_state='pending'` and emits `lock_request_received`). The Suppliers page Find, sheet, Build and "Book this build" never mention packages (searched `shortlist-categories.tsx`, `lib/supplier-sheet*.ts`, `lib/bench-service-cards.ts`, `lib/suppliers-build.ts`). **Verdict: ONE-SIDED** (the couple's Suppliers-page half is missing).

**34. Plans meaning (c): the supplier's Setnayan plan (tier)** — gates read by the couple's page, quoted:
- Reach: `tierCaps(asVendorTier(tier_state)).serviceRadiusKm` in `vendors/page.tsx` and `vendors/_actions/category-search.ts` ("unknown/Free tier -> 0 (unscoped -> within), Enterprise -> infinity").
- Name: `isTrueNameTier` = `tierCaps(tier).nameMode === 'true'` (`lib/vendor-cards.ts`, `dashboard/(account)/library/_data/saved-vendors.ts`): Free `nameMode:'hidden'`, Solo+ `'true'`.
- Searchability: `tierCaps('free').marketplaceSearchable === false` is enforced only behind `VENDOR_TIER_SEARCH_GATE` (`lib/vendor-search-gate.ts`, default OFF; called from `shop/page.tsx` and `lib/vendor-feature-gate.ts`, not from the Suppliers page).
- Portfolio photos: `portfolioPhotos` cap; Services per category: `servicesPerLeaf`.
- NOT gated by tier: answering. `lib/proposal-send.ts` ("Inbox ungated (owner 2026-07-24)") and `lib/chat-send.ts` removed the tier gate; the codes `tier_free`/`fee_unpaid` remain in the error union only.
- The booking fee (`lib/booking-fee-gate.ts`, `booking_fee_is_sourced_surface`) is the revenue gate, not the tier; first 5 sourced bookings free.
S: Plan screens OLD `subscription/` (S-PR9). **Verdict: UNKNOWN** (the production value of `VENDOR_TIER_SEARCH_GATE` is not readable here; if ON, free suppliers vanish from Find).

**35. The supplier's SCHEDULE <-> the event** — S sees: `get_vendor_event_brief` returns `timeline` = `event_schedule_blocks` rows (`label, block_type, start_at, end_at, location`; `visibility <> 'coordinator_only'`) + seat-plan status; **no per-supplier call time exists in that payload or table** (grep for call-time found only Maker/manpower code). Withheld until the fee gate is `unlocked` (timeline, venue, dietary, seat plan). Booked suppliers also read the shared run-of-show by RLS `event_schedule_blocks_booked_vendor_read`. OLD places: customer card tabs (`clients/[eventId]/page.tsx`, `_components/script-tab.tsx`, `calendar.ics/route.ts`) and `on-the-day/`. Rebuilt: S-PR5 (customer card Brief row) and S-PR11 (Event Hub > Schedule). Supplier -> couple: `suggestScheduleChange` (clients actions) writes `event_schedule_suggestions` and emits `schedule_suggestion` (in-app only; the allowlisted `schedule_change_requested` is the coordinator path). C: the couple answers on `/dashboard/[eventId]/schedule`. **Verdict: MEETS ONLY ON THE OLD PAGE**.

**36. Event-day work** — S: OLD `on-the-day/` + `live/[eventId]`; Today's dark "Run the day" card is REBUILT (S-PR1), the "waiting · next moment · checked in" numbers are not (deviation 4, S-PR11). Admission to the console: `admitRoomBookings` arms (pool booking / `agreed` / claimed Locked-QR) — day-precision date required. Coordinator access: `askHostForAccess` (supplier) -> `event_access_requests`; the host answers at `/dashboard/[eventId]/access-requests`. C: the Event Hub (Maker, not the Suppliers page). **Verdict: MEETS ONLY ON THE OLD PAGE**.

**37. The booking fee (cross-cutting)** — M: inquiry source stamped in `startServiceInquiry`; charge via `collectBookingFeeAtLock` / `booking_fee_open_lock_charge`; supplier-side bills on Today (`BookingFeeBills`, kept boxed, deviation 2) and gate `vendor_event_fee_gate_stage`; couple-side PR6 "booking-fee rules, whole app" NOT BUILT (held for `BOOKING_FEE_RULES_AUDIT_2026-10-07.md`; the five audit files under `BOOKING_FEE_AUDIT_2026-10-07/` exist in the corpus and I did not read them). Gap named by the plan: `vendor_profile_views` is recorded but never read for the fee; a manual add never gets a charge. **Verdict: UNKNOWN** (audits not read; see Part 4).

### Verdict count (37 rows; 28a-e counted once)
- WHOLE: 9 (rows 2, 6, 7, 12, 13, 16, 21, 23, 29)
- MEETS ONLY ON THE OLD PAGE: 5 (rows 5, 8, 32, 35, 36)
- ONE-SIDED: 9 (rows 9, 10, 11, 14, 15, 25, 26, 31, 33)
- BROKEN: 10 (rows 1, 3, 17, 18, 19, 20, 22, 27, 28, 30)
- UNKNOWN: 4 (rows 4, 24, 34, 37)
(9 + 5 + 9 + 10 + 4 = 37; the "Add your own" trace 28a-e is counted once as row 28.)

---------------------------------------------------------------------------------------------------

## PART 2 — the pairs (couple step + supplier step, built and checked together)

Labs that exist (no sign-in, fixtures, 404 in production):
- Supplier side: `/dev/supplier-lab` (`app/dev/supplier-lab/page.tsx`, in `wt-supdash-now`): `?s=today|day|fail|datechange|doors|clear`, `&toast=1|refused`, `?thumb=people|customer|money`. It mounts the SHIPPED answer actions, which refuse with no session, so nothing is written.
- Couple side: `/dev/suppliers-lab` (shell + Find + supplier sheet; `?open=catering`, `&fail=1`, `&sheetfail=1`, `&slow=1`, `&empty=1`); `wt-sup-build` adds `lab-build.tsx`/`build-fixtures.ts` (Build tab); `wt-sup-booked` adds `/dev/budget-lab`. Needs `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED=true` locally.
- Hub-side labs that touch these connections: `/dev/details-lab` (date and place), `/dev/schedule-lab`, `/dev/home-lab`.
- No lab draws both halves. Nothing in the middle (a notification landing, a status written and read back) can be seen without two real signed-in accounts.

| Pair | Couple step | Supplier step | What it makes work end to end | Seen without real accounts | Needs two real accounts |
|---|---|---|---|---|---|
| **P0 Notices** (rows 1, 3, 18, 20, 22, 27, 35) | none in either plan (new, tiny) | S-PR9 Notifications + Recent list | the allowlist matches the steps that need a human: `vendor_inquiry_received`, `payment_logged`, `vendor_payment_asked`, `inquiry_declined`, `review_request`, `booking_cancelled` | a unit test on `EMAIL_ENABLED_TYPES`; email preview | send + receive an email each |
| **P1 Ask -> answer -> quote -> read** (rows 1-8) | PR2 Find (MERGED-DRAFT); "Read their reply" target | S-PR0 envelope + S-PR1 Today (REBUILT); **new step needed for the thread page (Messages, Quote, accept/decline) — in no S-PR**; deviation 5 (`threadId` on desk rows, S-PR5) | a couple asks, the supplier is told, accepts, quotes, the couple reads "N quote in" | couple: `/dev/suppliers-lab`; supplier: `/dev/supplier-lab?s=today` | the whole round trip |
| **P2 Book -> yes -> booked** (rows 12-16) | PR3 Build + "Book this build" (UNVERIFIED), PR4 part 1 "Waiting for their yes" (UNVERIFIED) + a declined/expired word (new) | S-PR1 Today (REBUILT) + S-PR5 customer card (Agree in place; deviation 1 folds -> doors) | ask, agree, decline, lapse, withdraw all show on both pages in the same words | `suppliers-lab` build fixtures; `supplier-lab?s=today` | agree/decline/expire timing (48 h), email |
| **P3 Money** (rows 19-24) | PR4 pay sheet + Budget (UNVERIFIED Booked/Budget), **plan snapshot fix on the agree path (new)** | S-PR4 Money + S-PR5 Money fold (`logPayment`, instalment confirm, ask-for-payment; deviation 2 fee bills) | plan exists after the yes; couple logs; supplier confirms/refuses; "Paid" returns | `/dev/budget-lab`; `supplier-lab?thumb=money` | log -> confirm -> cleared |
| **P4 Add your own + claim** (rows 28a-e, 29) | PR2-rest: add flow with twin match, record sheet, claim QR; migration `leak_match_vendor_profile_id` + `fee_leak_price_tolerance`; approvals 10, 11 | S-PR2 People (outside clients), a claim-landing check, S-PR5 customer card; **claim must accept the thread, hold the date and show the booking (new)** | the link works, the supplier's side shows the couple's customer, date, plan and payments | lab for the record sheet (none yet) | the claim (a second browser profile + a real shop account) |
| **P5 Calendar truth** (rows 30, 31) | PR5 date + place sheets, Help me choose; a "not set" state in the fit line (new) | S-PR3 Dates (one calendar, Block / Waitlist / Capacity) | the line says Free / Booked / **Not set**; booking writes the date; "Ask about another day" opens the ask | `suppliers-lab` (needs a fixture with an unset calendar) + `supplier-lab` | blocking a day and reading it from the couple side |
| **P6 Date change** (row 25) | PR5 shows the open request on the Suppliers page | S-PR1 Next-card Move/Unlock (REBUILT) | ask, answer, apply visible on both | `supplier-lab?s=datechange`; `/dev/details-lab` | the 3-day timer, the money case |
| **P7 Services, packages, price** (rows 32, 33) | PR2 cards (MERGED-DRAFT) + packages into Find/Build (new) | S-PR6, S-PR6b maker, S-PR6c edit sheet + packages | what the supplier publishes is what the couple's card says | `suppliers-lab` | publish and re-read |
| **P8 After the event** (row 27) | review entry (LIVE) | S-PR7 Page > Reviews; S-PR1 review card (REBUILT) | request -> review -> reply | none | all |
| **P9 Schedule and event day** (rows 35, 36) | Event Hub Schedule (Maker stream) | S-PR5 Brief row, S-PR11 Event Hub; deviation 4 | the supplier sees the run of show and answers a suggestion | `/dev/schedule-lab`; `supplier-lab?s=day` | fee gate, suggestion round trip |
| **P10 Fee rules** (row 37) | PR6 (held for the audit) | S-PR4 fee rows | sourced vs imported, leak check | none | all |
| **P11 Room size** (row 26) | PR4 "Ask them" | S-PR7 Profile (venue dimensions) | the seat plan takes the venue's size | none | all |

---------------------------------------------------------------------------------------------------

## PART 3 — the order

Goal: a couple finds a supplier, asks, gets an answer, books, pays; the supplier sees each step and answers.

★ = in the MINIMUM SET before real suppliers can be invited.

1. ★ **P0 Notices** — first, because it is small, in neither plan, and every later pair rides it. Dependencies: S-PR1 deviation 8 no; none of the 12 approvals.
2. ★ **P1 Ask -> quote** — the couple half is merged-draft; needs the S-PR0/S-PR1 drafts (#6443 conflicts with main) merged, then a decision on the thread page. Without the thread rebuilt, the supplier still uses the old page for accept and quote, which works (row 5, 8). Depends on: Suppliers approvals 1, 3, 6, 7, 8, 8b (the shell and Find), S-PR0 deviations 1-4, S-PR1 deviations 5, 8, 13, 14.
3. ★ **P2 Book -> yes** — the couple's PR3 + PR4 part 1; the supplier half already exists. Must add the "declined / lapsed" word (rows 14-15). Depends on approvals 7 ("Build"), 8b; S-PR1 deviations 1 (folds), 3 (lapsed row).
4. ★ **P3 Money** — fix the plan-snapshot gap first (row 19), then PR4 pay sheet / Budget with S-PR4/S-PR5. A supplier cannot be invited to be paid through a path that writes no plan. Depends on S-PR1 deviations 2, 7; approval 9 not at all.
5. ★ **P4 Add your own + claim** — literally "invite vendors" (the claim link is the invitation). Needs approvals 10 and 11 and the owner's tolerance number; the claim must leave the supplier with the customer, the date and the plan (row 28e). Depends on S-PR2 (People: outside clients).
6. ★ **P5 Calendar truth** — before inviting, because a freshly invited supplier with an empty calendar reads "Free on your date" to every couple (row 30). The "Not set" state and the single read are small; PR5's sheets can follow. Depends on approval 2 (date · place line), S-PR3.
7. **P6 Date change** (needs PR5's Suppliers-page state; Hub <-> Today already works), **P7 Services/packages** (S-PR6 family; the OLD pages work until then), **P8 After the event** (post-event), **P9 Schedule/event day** (S-PR11), **P10 Fee rules** (PR6, after the audit; the fee does not block the connection), **P11 Room size** — all after the minimum set.

Deviation and approval dependencies by pair: P0 none · P1 approvals 1, 3, 6, 7, 8, 8b; deviations S-PR0 1-4, S-PR1 5, 8, 13, 14 · P2 approvals 7, 8b; S-PR1 1, 3 · P3 S-PR1 2, 7 (+ the unlisted plan-snapshot fix) · P4 approvals 10, 11 and the tolerance number; S-PR1 3, 11 · P5 approval 2; S-PR1 11 · P6 approval 2; S-PR1 1 · P7 S-PR1 12 (launch offer) is S-PR9 · P8 S-PR1 6 · P9 S-PR1 4, 5 · P10 approval 11 · P11 none. Approval 9 (Light/Dark) and 4/5 do not gate any pair; approval 12's text is not in the files I could read (Part 4).

---------------------------------------------------------------------------------------------------

## PART 4 — what I could not determine

1. Production values: `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED` (row 12-16 assume ON; with it OFF there is no supplier "yes"), `VENDOR_TIER_SEARCH_GATE`, and whether `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` is still ON (last measured 2026-09-06 in memory). A code default is not a prod value.
2. Row 19: whether any production path writes `event_vendor_payment_plan` for handshake bookings. Confirm with a count of marketplace `event_vendors` at `contracted+` with `lock_request_state='agreed'` against plan rows.
3. Row 28: nobody walked the claim with two accounts; the masked-pending-thread outcome, the missing calendar block and Room admission are read from code. Whether the supplier can then use the Today "Confirm payment" card (`kind:'lock'`) on a claimed manual row, and so take the date through `acquire_schedule_pools`, is not proven.
4. Row 4: what moves an unanswered inquiry to `expired`; row 24: which notification (if any) a change order emits; row 6: whether a declined quote needs a notice.
5. Row 37: the five audit files in `BOOKING_FEE_AUDIT_2026-10-07/` and `BOOKING_FEE_RULES_AUDIT_2026-10-07.md` were not read.
6. Suppliers approval 12: `SUPPLIERS_PAGE_STATE_2026-10-10.md` says it lists 11 and 12 but prints only 11; `SUPPLIERS_PAGE_CHECK_2026-10-07_fable.md` was not opened.
7. The two unfinished branches are read as written, not verified; their merge-base is older than `rd/suppliers-on-main` for `wt-sup-booked`, so its Budget files may conflict.
8. I did not open any page in a browser and ran no test, typecheck or build.
