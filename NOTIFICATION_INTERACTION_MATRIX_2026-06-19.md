# Setnayan — Notification & Interaction Matrix (couple · vendor · admin)
Date: 2026-06-19 · code @ 70684a81 (fresh origin/main) · read-only audit

**21 correct · 26 broken/minor** across ~67 cross-account events.

## Verdict — is data given == received?
'Data given == data received' holds reliably for ONE class only: the recipient-only RLS read substrate. notifications uses Pattern A (SELECT/UPDATE USING user_id = auth.uid(), service-role insert), so wherever a row IS emitted, the intended recipient — couple, vendor, or admin — always reads exactly their own row through the correct role page/bell, independent of any feature-table RLS. So the *delivery floor* is sound. It breaks above that floor in three big bands. (1) ADMIN<->VENDOR is the worst: data is correctly WRITTEN to the DB but never DELIVERED across the boundary. Verification approve/reject/demote, payout paid/hold, token & subscription rejections, and the entire vendor-quality threshold chain (5 dead email helpers, 0 callers) all store reasons/state the vendor can technically see if they self-navigate, but push nothing — so given != received. The verification-rejection case is actively misleading: the admin UI asserts 'vendor was notified with the decision reason' when no channel ever carried it. The vendor->admin direction is equally broken on the inbound legs: new verification applications and apply-then-pay orders reach no admin (silent SLA clock / poll-only reconciliation). (2) COUPLE<->VENDOR breaks on every non-chat coordination surface: the founder-operated demo-vendor accept/decline/reply path (the production-primary path) is silent to the couple; pax-surcharge money changes, schedule-suggestion handshakes (both legs), vendor public review replies, in-thread service offers, the 'delivered' tracker flip, completion confirm/report, guest-claim rejection, and manual-vendor invite claims all change shared state with no notification — given (the state change) reaches the DB but not the other party. (3) COUPLE<->ADMIN is the healthiest: the payments lifecycle (matched/paid/rejected/resubmit/refunded/quoted) and help intake correctly deliver data==received; the breaks are the silent showcase/editorial confirmations, the anonymous-help-reply dead-end (sender_email given, never used), one-sided dispute resolutions, and the generic-email-on-every-type foundation gap that also violates the kwento audit-only 'not emailed' intent. Net: given==received is guaranteed only for the in-app read path and the couple<->admin payment loop; it FAILS systematically across admin<->vendor lifecycle/billing and couple<->vendor coordination, where the DB is the source of truth but no delivery channel carries the change to the counterparty.

## Matrix (every cross-account notification event)
| Event | Direction | Recipient | Channel | Status |
|---|---|---|---|---|
| Couple sends first inquiry → vendor (vendor_inquiry_received) | couple->vendor | vendor owning user | in_app + email + push | correct |
| Couple/vendor subsequent chat message (chat_message) | couple->vendor | vendor owning user / all couple members (sender skipped) | in_app + email + push | correct |
| Vendor accepts inquiry → couple (inquiry_accepted) | vendor->couple | all couple members | in_app + email + push | correct |
| Vendor accept: Setnayan Exclusive perk reveal (system chat rows) | vendor->couple | couple | none (no notification) | minor |
| Vendor declines inquiry → couple (inquiry_declined) | vendor->couple | all couple members | in_app + email | correct |
| Couple finalizes/locks marketplace vendor → vendor (booking_confirmed) | couple->vendor | vendor owning user | in_app + email | correct |
| Host cancels pre-downpayment booking → vendor (booking_cancelled) | couple->vendor | vendor owning user | in_app + email | correct |
| Couple marks vendor 'delivered' on tracker → vendor | couple->vendor | vendor (intended) | none (no vendor signal; review_request goes only to acting member) | broken |
| Vendor marks service complete → couple (review_request) | vendor->couple | ONE couple member via .maybeSingle() | in_app + email | minor |
| Couple confirms receipt / reports non-delivery → vendor | couple->vendor | vendor (intended) | none | broken |
| Couple submits review → vendor (review_received) | couple->vendor | vendor owning user | in_app + email | correct |
| Vendor posts public reply to review → couple | vendor->couple | couple (intended) | none | broken |
| Couple recommends vendor → vendor (review_received reused) | couple->vendor | vendor owning user | in_app + email | minor |
| System review nudge after event date (review_request) | couple->vendor | only viewing couple member (status-flip idempotent) | in_app + email | minor |
| Vendor offers a service in-thread (offerServiceInterest) → couple | vendor->couple | couple (intended) | none (chip only) | broken |
| Pax-surcharge cost change accept/decline → couple | vendor->couple | couple (intended, money-changing) | none (vendor-render-only card) | broken |
| Vendor suggests schedule change → couple | vendor->couple | couple (intended) | none | broken |
| Couple accepts/declines vendor schedule suggestion → vendor | couple->vendor | vendor (intended) | none | broken |
| Admin (founder) accepts/declines demo-vendor inquiry → couple | vendor->couple | couple (intended inquiry_accepted/declined) | none | broken |
| Admin (founder) replies as demo-vendor → couple (chat_message) | vendor->couple | couple (intended) | none | broken |
| Guest RSVPs → couple (rsvp_received) | vendor->couple | all couple members | in_app + email | correct |
| Guest invite-claim lands in review queue → couple (guest_claim_pending) | vendor->couple | all couple members | in_app + email | correct |
| Couple approves guest claim → claimer | couple->vendor | claimer (conditional: email only, no in-app) | email (conditional) | minor |
| Couple rejects guest claim → claimer | couple->vendor | claimer (intended) | none | broken |
| Manual off-platform vendor claims invite link → inviting host | vendor->couple | inviting host couple (coupleUserIds returned but discarded) | none | broken |
| Couple submits order (apply-then-pay) → admin | couple->admin | admin (intended; awaiting reconciliation) | none (buyer email only; no admin signal) | broken |
| Order payment instructions email → couple/buyer | admin->couple | buyer | email | correct |
| Admin matches/approves payment → couple (payment_matched) | admin->couple | buyer | in_app + email | correct |
| Admin promotes order to paid → couple (order_paid) | admin->couple | buyer | in_app + email | minor |
| Admin rejects payment → couple (payment_rejected) | admin->couple | buyer | in_app + email | correct |
| Admin requests resubmit → couple (payment_resubmit_requested) | admin->couple | buyer | in_app + email | correct |
| Admin records refund → couple (payment_refunded) | admin->couple | buyer | in_app + email | correct |
| Admin quotes order total → couple (order_quoted) | admin->couple | buyer | in_app + email | correct |
| Help/contact form submitted → admins (chat_message reused) | couple->admin | all internal/team/admin users (fan-out) | in_app + email + push | minor |
| Admin replies to help ticket → submitter (help_ticket_replied) | admin->couple | signed-in submitter only; anonymous get nothing | in_app + email (signed-in only) | broken |
| Admin features couple's event in Real Stories showcase → couple | admin->couple | couple (intended) | none | minor |
| Admin approves/rejects couple editorial → couple | admin->couple | couple (intended) | none | minor |
| Couple files force-majeure → admins (force_majeure_filed) | couple->admin | admins via is_internal/is_team_member (omits account_type='admin') | in_app + email | minor |
| Couple files vendor-scoped dispute → named vendor (dispute_filed) | couple->vendor | named marketplace vendor | in_app + email | correct |
| Admin resolves force-majeure flag → couple (order_quoted reused) | admin->couple | couple opener ONLY (named vendor not told) | in_app + email | broken |
| Admin resolves vendor_disputes record → opener (order_quoted reused) | admin->couple | opener only (counterparty not told); relatedUrl=null | in_app + email (no deep-link) | broken |
| Admin force-completes vendor service → couple + vendor (booking_confirmed) | admin->couple | all couple members + vendor | in_app + email | correct |
| Admin upholds non-delivery report → couple (dispute_filed reused) | admin->couple | couple ONLY (vendor — the adverse party — not told) | in_app + email | broken |
| Couple submits handshake non-delivery report → admins + vendor | couple->admin | admins + vendor (intended; both severed) | none (no signal, no /admin/completions revalidate) | broken |
| Vendor submits verification application → admins | vendor->admin | admins (intended; SLA clock starts silently) | none | broken |
| Admin approves verification → vendor (vendor_status_change) | admin->vendor | vendor (intended) | none | broken |
| Admin rejects verification → vendor | admin->vendor | vendor (intended; reason stored not delivered; UI falsely claims 'vendor was notified') | none | broken |
| Admin/cron demotes vendor → vendor | admin->vendor | vendor (intended; manual + 3-dispute auto-demote) | none | broken |
| Vendor token purchase pending → admins (vendor_token_purchase_pending) | vendor->admin | all admins (incl. account_type='admin') | in_app + email | correct |
| Admin approves token purchase → vendor (vendor_tokens_credited) | admin->vendor | vendor | in_app + email | correct |
| Admin rejects token purchase → vendor | admin->vendor | vendor (intended; reason stored not delivered) | none | broken |
| Vendor subscription pending → admins (token enum reused) | vendor->admin | all admins | in_app + email | minor |
| Admin activates subscription → vendor (token enum reused) | admin->vendor | vendor | in_app + email | minor |
| Admin rejects subscription → vendor | admin->vendor | vendor (intended; reason stored not delivered) | none | broken |
| Admin marks vendor payout PAID → vendor | admin->vendor | vendor (intended; money disbursed) | none | broken |
| Admin places vendor payout ON HOLD → vendor | admin->vendor | vendor (intended; no earnings revalidate either) | none | broken |
| Payout scheduled on order payment → vendor | admin->vendor | vendor (intended) | none (visible on earnings page only) | minor |
| Admin dismisses vendor fake-review flag → vendor + couple | admin->vendor | flagging vendor + reviewed couple (both intended) | none (sendReviewFlagOutcomeEmail dead) | broken |
| Admin overrides/publishes appealed review → vendor + couple | admin->vendor | vendor + appealing couple (intended) | none | broken |
| Vendor quality threshold actions (under-review/suspension/ghost-warn/slow-response) | admin->vendor | vendor (intended) | none (5 email helpers are dead code, 0 callers) | broken |
| Editorial assignment nudge → guest (kwento_assignment_nudge) | couple->vendor | assigned guest | email + in_app (in-app dead-ends: deep-link 404s, no guest bell) | broken |
| Flagged guest Story batch → couple (kwento_story_batch) | vendor->couple | all couple members | in_app + email | minor |
| Flagged guest caption held (kwento_flagged) → couple | vendor->couple | couple (intended; type registered but emitted nowhere) | none | broken |
| Flash auto-walled audit (kwento_flash_auto_walled) | vendor->couple | coordinator audit (design: NOT emailed) | in_app + email (email fires against design intent) | minor |
| Photo delivery complete/failed → couple | vendor->couple | all couple members | in_app + email | correct |
| Concierge-abuse warn/ban/restore → user (chat_message reused) | admin->couple | flagged user (ban not push-escalated; leaks admin notes on lift) | in_app + email | minor |
| 0028 templates with no live path (payment_instructions/refund_processed/new_vendor_message/save_the_date_sent/wedding_day_reminder/vendor_unresponsive_48h) | admin->couple | various (intended per 0028) | none (no emitter; some covered by adjacent types) | broken |

## Broken / issues (worst-first, with fix)
### [blocker] Vendor quality threshold-action chain (under-review, suspension, ghost-warning, slow-response, fake-review-flag outcome to vendor+couple)
- **Problem:** BLOCKER. All 5 branded email senders in lib/vendor-email-triggers.ts (sendVendorUnderReviewEmail, sendVendorSuspensionEmail, sendVendorGhostWarningEmail, sendVendorSlowResponseEmail, sendReviewFlagOutcomeEmail) are dead code with zero callers. The auto-demote cron, dismissReviewFlag and overridePublishReview admin actions, and every suspension path fail to invoke them. Emails are fully composed but never sent — data given (the email) never reaches the recipient.
- **Fix:** Wire the 5 senders to their trigger sites: call sendVendorUnderReview/Suspension from the demotion+suspension paths and the dispute-counter cron; call sendReviewFlagOutcome from dismissReviewFlag AND a new uphold/remove action; call sendVendorSlowResponse from the ghosting/escalation path. Add the missing /vendor-dashboard/settings/notifications route the slow-response email links to.

### [blocker] Couple reports non-delivery on completion handshake (completion_status -> disputed)
- **Problem:** BLOCKER / SEVERED CHAIN. coupleReportNonDelivery sets event_vendors.completion_status='disputed' but emits ZERO notifications to admins and the accused vendor, and does not revalidate /admin/completions. The admin completions resolvers (forceCompleteVendor/upholdNonDelivery) have no upstream signal — admins must poll; the vendor never learns delivery is disputed and the review gate freezes silently. The parallel force-majeure path correctly fans out to admins + vendor; this leg got neither.
- **Fix:** In coupleReportNonDelivery emit force_majeure_filed (or a dedicated dispute type) to all admins via createAdminClient fan-out AND notify the named vendor's user_id; revalidatePath('/admin/completions').

### [major] Admin (founder) demo/marketplace-vendor accept / decline / reply → couple
- **Problem:** MAJOR. adminAcceptInquiry, adminDeclineInquiry, adminReplyAsVendor (app/admin/demo-vendors/inquiries/actions.ts) emit zero couple notifications. Under the founder-only-vendor model this is the de-facto primary accept/decline/reply path in production, so most real interactions reach the couple silently — no inquiry_accepted (push-enabled), no inquiry_declined, no chat_message. Couple discovers replies only by reopening the thread.
- **Fix:** In the admin demo-vendor actions call notifyCoupleOfInquiryOutcome on accept/decline and route the reply through sendChatMessage->notifyOtherParty (or emit chat_message directly), exactly as lib/chat-actions.ts does.

### [major] Apply-then-pay 'apply' direction → admin
- **Problem:** MAJOR. submitOrderAction, createOrder, and logPayment create the orders/payments row and email ONLY the buyer; no in-app/email/push reaches any admin that a payment awaits reconciliation. Admins must poll /admin/payments, so the couple<->admin loop is effectively one-way (admin->couple only).
- **Fix:** After order creation, fan out a new (or reused) admin notification (createAdminClient over is_internal OR is_team_member OR account_type='admin') with deep-link to /admin/payments, mirroring the token/subscription pending fan-outs.

### [major] Pax-surcharge cost change → couple
- **Problem:** MAJOR. When a vendor accepts/declines a pax surcharge, event_vendors.total_cost_php/pax_surcharge_php changes via admin client with no notification. The proposal card renders only on the vendor's thread page, so the couple is never told a surcharge is pending nor that their confirmed cost changed — contradicting the owner 'never silent' lock for the couple-facing leg.
- **Fix:** Emit a notification to all couple members on both acceptPaxSurcharge (cost changed) and when a surcharge is proposed; surface the Accept/Decline card couple-side too.

### [major] Pure-guest-recipient notifications (editorial assignment nudge + any guest-addressed type)
- **Problem:** MAJOR. kwento_assignment_nudge's in-app deep-link sends a guest to /dashboard/{eventId}/alaala which notFound()s any member_type!='couple'; guest event_members are member_type='guest', so the bell click 404s. More broadly, guests have NO bell/inbox surface (only couple/vendor/admin reader pages exist), so in-app delivery is dead for guests — they rely on email/push only. Double-email risk: sendEmail(guest.email) + emitNotification's own users.email send may both fire.
- **Fix:** Point guest-recipient relatedUrls at the public /[slug] page (where guests contribute), and either build a guest notification surface or mark guest-recipient types email/push-only to avoid the dead in-app row and the double email.

### [major] Admin verification chain — submit→queue AND decision→vendor (approve/reject/demote)
- **Problem:** MAJOR. submitApplication notifies no admins (SLA clock starts silently). approve/reject/demote and the 3-dispute auto-demote cron notify no vendor. 'vendor_status_change' (a named 0028 template) is absent from the enum with zero callers. WORSE: the admin verify page claims 'Application rejected — vendor was notified with the decision reason' which is FALSE — the reason is only visible if the vendor self-navigates. On rejection, data given (decision_reason) never reaches the recipient.
- **Fix:** Add a vendor_status_change notification type. Fan out to admins on submit; emit to the vendor on approve/reject/demote (manual + cron), carrying decision_reason. Remove or make true the admin UI 'vendor was notified' string.

### [major] Vendor money-movement: payout PAID, payout HOLD, token-purchase reject, subscription reject
- **Problem:** MAJOR. markPayoutPaid (money disbursed), holdPayout (mid-dispute freeze; also no earnings revalidate), rejectTokenPurchase, and rejectSubscription all complete silently. Approvals notify; rejections and payout state changes do not. For rejects the stored reason never reaches the vendor; for paid/hold the vendor only learns by visiting earnings.
- **Fix:** Add a payout/billing notification type (or reuse vendor_tokens_credited family) and emit to the vendor on payout paid, payout hold (with hold_reason), token-purchase reject (with reason), and subscription reject (with reason). Revalidate /vendor-dashboard/earnings on hold.

### [major] Vendor posts public reply to a couple's review → couple
- **Problem:** MAJOR. submitVendorReply only UPDATEs vendor_reviews.vendor_reply; postVendorReply emits nothing. The public reply appears on the couple's review + the vendor profile (a real cross-account state change) but the couple is never told — even though the review-submit email tells the vendor they can post a public reply.
- **Fix:** After submitVendorReply, emit a notification (new vendor_review_reply type or reuse chat_message) to all couple members with a deep-link to the review.

### [major] Guest claim REJECTION → claimer
- **Problem:** MAJOR. rejectClaimAction only flips guest_claims.status='rejected' — no email, no in-app. The person who asked to join is never told; they keep seeing 'pending'. (Approval is also email-only and conditional — minor, separate.)
- **Fix:** On rejection, sendEmail to claimer_email and/or emit an in-app notification to claimer_user_id; mirror the approval path.

### [major] Vendor schedule-suggestion handshake (both directions)
- **Problem:** MAJOR. suggestScheduleChange inserts an event_schedule_suggestions row (vendor changing the day-of timeline) with no couple notification; resolveScheduleSuggestion accepts/declines with no vendor notification. A live coordination loop silent in both directions.
- **Fix:** Emit to all couple members on suggestScheduleChange (deep-link /dashboard/{eventId}/schedule) and to the vendor on resolveScheduleSuggestion (accept/decline outcome).

### [major] Manual off-platform vendor claims invite link → inviting host
- **Problem:** MAJOR. applyClaimAutoLink links the booking, inserts vendor_follows, and RETURNS coupleUserIds, but the finalize page discards the return and emits nothing. The host who sent the claim link is never told their vendor joined Setnayan and is reachable in chat — the data to notify is produced but never consumed.
- **Fix:** Consume the returned coupleUserIds in the finalize page and emit a booking/vendor-joined notification to each host member.

### [major] Couple marks vendor service 'delivered' on tracker → vendor
- **Problem:** MAJOR. updateVendorStatus on the delivered transition fires only a review_request to the acting couple member.id; the vendor (no RLS read path to event_vendors) gets no signal — the same silent-break class finalizeVendor/cancelBookingAsHost were fixed for. The review_request also reaches only the acting member, not all couple members.
- **Fix:** On the delivered transition emit a notification to the vendor's user_id via admin client, and fan the review_request to all couple members.

### [major] Admin force-majeure / vendor_disputes RESOLUTION → counterparty
- **Problem:** MAJOR. resolveFlag notifies only the couple opener — the named vendor (told a flag was filed, 'we'll reach out') is never told the outcome even on refund_issued/partial_credit. resolveDispute notifies only opened_by_user_id with relatedUrl=null (non-actionable), never the counterparty. Both reuse type='order_quoted' (wrong amber 'Order quoted' tray label).
- **Fix:** Notify BOTH parties on resolution; add a dedicated dispute_resolved type with correct label/tone and a valid relatedUrl per actor.

### [major] Admin upholds non-delivery report → vendor
- **Problem:** MAJOR. upholdNonDelivery notifies only the couple; the vendor whose non-delivery was upheld — a serious reputational outcome (review frozen, completion stays disputed) — gets no email and no bell. forceCompleteVendor in the same file correctly notifies both, proving the omission.
- **Fix:** Add the named vendor's user_id as a recipient in upholdNonDelivery (off-platform skipped), with appropriate adverse-outcome copy; use a non-'dispute_filed' type for the outcome.

### [major] Admin replies to help ticket → anonymous submitter
- **Problem:** MAJOR. setHelpMessageStatus gates help_ticket_replied on prior?.user_id, so an anonymous submitter (user_id NULL, sender_email captured at intake) gets no notification and no email when an admin replies. No sendEmail(sender_email) fallback exists — anonymous tickets are a dead-end.
- **Fix:** Add an else-branch that sends a Resend email to help_messages.sender_email when user_id is NULL.

### [major] Admin fake-review-flag adjudication (dismiss / override-publish) → vendor + couple
- **Problem:** MAJOR. dismissReviewFlag and overridePublishReview emit nothing to the flagging vendor or the reviewed/appealing couple; overridePublishReview even publishes a review to a vendor profile with no review_received notification. The 'kept/removed/published' outcome never reaches either party (sendReviewFlagOutcomeEmail exists but is uncalled).
- **Fix:** Invoke sendReviewFlagOutcomeEmail (and/or emit in-app) to both parties on dismiss and on a new uphold/remove action; emit review_received to the vendor when a review is published via override.

### [minor] Vendor in-thread service offer (offerServiceInterest) → couple
- **Problem:** BROKEN (minor-major). Records a thread_service_interests chip ('Inquiring about') but never notifies the couple, so the vendor's cross-sell proposal is invisible until the couple reopens the thread.
- **Fix:** Emit a chat_message (or dedicated offer) notification to the couple on offerServiceInterest.

### [minor] Couple confirms receipt / reports non-delivery → vendor (the couple->vendor completion leg)
- **Problem:** BROKEN. coupleConfirmReceived (completion_status='confirmed') and coupleReportNonDelivery (='disputed') send no notification to the vendor; the vendor learns of confirmation/dispute only by reopening the client page — asymmetric with vendorMarkServiceComplete which notifies the couple.
- **Fix:** Emit to the vendor on both coupleConfirmReceived and coupleReportNonDelivery (the non-delivery leg also feeds the severed admin chain above).

### [minor] Flagged guest caption held from wall (kwento_flagged) → couple
- **Problem:** BROKEN. kwento_flagged (and kwento_flash_auto_walled) are registered notification types (enum+label+tone) but emitted nowhere — only kwento_story_batch fires. A flagged non-story caption held from the wall produces no couple signal, falling through the route's if/else-if chain.
- **Fix:** Emit kwento_flagged for held captions in app/api/papic/kwento/route.ts, not only kwento_story_batch for story-depth content.

### [major] Six named 0028 email templates with no live delivery path
- **Problem:** BROKEN. Of the 10 named 0028 templates, only rsvp_received + security_alert are truly wired notification types. payment_instructions/refund_processed/new_vendor_message are functionally covered by adjacent enum types; vendor_status_change + vendor_unresponsive_48h exist only as uncalled dead helpers; save_the_date_sent + wedding_day_reminder have no emitter at all (wedding_day_reminder is an explicit cron-free deviation; save_the_date_sent is catalog copy only).
- **Fix:** Decide per template: implement vendor_status_change (see verification fix) and the slow-response/ghost path for vendor_unresponsive_48h; formally retire/document save_the_date_sent + wedding_day_reminder as deliberate non-implementations to remove the spec-vs-code drift.

### [major] Email channel has NO per-type allowlist (emits generic untemplated text on every type)
- **Problem:** MAJOR (foundation). emitNotification emails the recipient on EVERY notification type whenever RESEND_API_KEY is set, using a single generic plain-text body — never the branded renderBrandedEmail() HTML in lib/email-template.ts. This diverges from the 0028 design (only ~10 curated branded templates email) and causes the kwento_flash_auto_walled 'not emailed' design intent to be violated (it will email).
- **Fix:** Add an EMAIL_ENABLED_TYPES allowlist analogous to PUSH_ENABLED_TYPES, and route those through renderBrandedEmail() instead of the generic text body; gate audit-only types (kwento_flash_auto_walled) out of email.

### [minor] order_paid email body ships a literal HTML entity into plaintext
- **Problem:** MINOR. The body string 'Your order is fully paid. We&apos;ll start work right away.' ships into a plaintext-only email (emitNotification sets text, no html), so the buyer reads 'We&apos;ll' verbatim. Cosmetic data-fidelity defect.
- **Fix:** Replace &apos; with a literal apostrophe in the order_paid body string.

### [minor] Admin features couple's event in Real Stories showcase → couple
- **Problem:** BROKEN (minor). Promoting a couple's wedding into the public showcase emits zero notification; the couple is never told their event went public (the feature/rank action is silent even though they opted-in via privacy toggle).
- **Fix:** Emit a couple-facing confirmation notification in app/admin/real-stories/actions.ts on feature/rank.

### [minor] Admin approves/rejects couple editorial → couple
- **Problem:** BROKEN (minor). Editorial review/approve/reject emits no notification; a couple whose editorial is approved or rejected by the Setnayan team gets no in-app/email signal in either direction.
- **Fix:** Emit a couple-facing notification in app/admin/editorial-review/[editorialId]/actions.ts on approve and reject.

## Note
Counts are over a deduped union of the ~67 distinct cross-account events across the 5 audit segments (segments overlapped heavily on the couple<->vendor chat/booking chain; I kept one canonical row each). 'correct'=21, 'minor'=20, 'broken'=26 (brokenCount=26 includes the 2 blocker-severity rows: the dead vendor-quality email chain and the severed completion->dispute chain). Self-directed events (security_alert, login-driven ghosting nudges) are correct-by-design and counted toward 'correct' where they appear as the recipient's own read path, but most are excluded from the cross-account matrix since they are self->self, not a true direction between two accounts; the matrix direction enum forced me to map a few non-couple/vendor/admin recipients (guests, claimers) onto the nearest enum value — guest editorial nudge and guest-claim events are tagged couple->vendor/vendor->couple as the closest available direction. The single highest-leverage fix is the email-channel allowlist + branded-template routing in lib/notification-emit.ts, and the single highest-impact missing wiring is the founder demo-vendor notification gap plus the 5 dead vendor-email senders, because under the founder-only-vendor production model those silent paths are the ones real users actually hit. All findings verified read-only against commit 70684a81; no code was changed.