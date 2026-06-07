# Iteration 0028 — Email Notification Fallback

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - Email is a **single thin Resend sender** (`lib/email.ts` → `sendEmail`, plaintext only), gated on `RESEND_API_KEY` (no-ops when unset). **None of the heavy infra in this spec is built:** no SendGrid fallback / provider failover, no Cloudflare Queue + dead-letter, no provider webhooks, no `email_dispatches`/`email_suppressions`/`email_unsubscribe_tokens` tables, no React Email templates, no RFC 8058 one-click unsubscribe, no DMARC/BIMI pipeline, no 0023 "Email Operations" admin panel.
> - Emails fire **inline off notification emits** (`lib/notification-emit.ts`) and specific actions (payments approve, vendor invite, signup, disputes, force-majeure, hiring alerts) — there is no central dispatcher resolving `notification_preferences`, quiet hours, or per-category cadence. HTML rendering is an explicit "follow-on."
> - The `payment_instructions` / `payment_confirmed` templates describe an **apply-then-pay** flow that is accurate in shape, but the **"3% Setnayan Pay convenience fee"** in § 6.1/§ 6.2 surrounding copy is RETIRED — **commission is 0%**; off-platform vendor money is never charged by Setnayan.
> - **0026 BIR attachments are dead:** `payment_confirmed`'s "BIR-attached Official Receipt PDF" and any Form-2307 email hooks reference a retiring iteration (0026) — do not wire them.
> - The owner-only hiring digest/alert/milestone/countdown templates (§ 6.11–6.14) DO have shipped lib equivalents (`lib/hiring-guide/emails.ts`); the V1.2 moderator-aware routing amendment (§ end) is unbuilt forward spec.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0028
**Topic:** Email-only notification layer that augments the in-UI notifications already shipped across V1 iterations. Covers transactional, coordination, and (opt-in) marketing emails. SMS is explicitly out of V1 scope.
**Surface:** Cross-cutting infrastructure — no user-facing screen of its own. Surfaces as outbound emails to customers / vendors / admins, plus an Email Operations sub-section inside the 0023 admin console.
**URL pattern:** N/A (outbound only). One-click unsubscribe links resolve at `setnayan.com/u/[token]`. Provider webhooks land at `setnayan.com/api/email/webhook/[provider]`.
**Builds on:** 0000 (users + auth), 0013 (Supabase Edge Functions + Cloudflare Queue), 0019 (chat-message triggers), 0023 (admin observability surface), 0025 (per-user notification preferences), 0026 (BIR Official Receipt + Form 2307 attachments).
**Provides to downstream iterations:** Every iteration with a critical event now has a reliable email rail. Push notifications and SMS fallback ship in later iterations and consume the same `email_dispatches`-style queue pattern.
**Status:** Drafted 2026-05-12.
**Phase:** V1 launch-blocking for payments (customers must receive payment instructions + confirmations) and for wedding-day reliability (T-1d / T-1h reminders).

---

## 1. Why this iteration exists

The existing V1 notification posture is "in-UI only." That's fine for "your wedding has 3 unread messages" — couples and vendors check the app daily and see the badge. It is **not** fine for:

- **Payments.** Customers apply for a service and then leave the app. The next touch is a payment-instructions email pointing them at Setnayan's static BDO + GCash accounts. Without email, the apply-then-pay model breaks at the second step.
- **Wedding-day reliability.** A vendor who hasn't opened the app in three weeks needs a T-1d reminder of call time and venue address. The in-UI badge they can't see is useless.
- **Account security.** New-device logins and password changes need to leave a trail in the user's inbox so a hijacked account is visible even when the attacker controls the in-app surface.
- **Cross-platform reach.** Couples handle 80% of planning on mobile; vendors handle 60% on desktop. Email is the lowest-common-denominator inbox both sides already check.

V1 ships **email only**. SMS, push, and in-app digest emails are V1.1+ work. The architecture is multi-channel-ready (the dispatch table carries a `provider` field that today only knows `resend` / `sendgrid` but tomorrow extends to `twilio_sms` / `apns` / `fcm`), so adding channels later is a schema-additive change.

---

## 2. Reference designs

| Concern | Reference | Why |
|---|---|---|
| Transactional email DX | **Stripe** | Subject-line clarity, pre-header copy, single primary CTA, plaintext alternative. Stripe's emails are the de facto standard PH startups copy from. |
| Provider primary | **Resend** | Same team as Vercel; React Email native; ₱0.0006/email at PH conversion; modern webhook + suppression API. |
| Provider fallback | **SendGrid** | Mature deliverability infra; admin-toggleable in 0023 if Resend has an outage. |
| Bulk-sender compliance | **Gmail / Yahoo 2024 sender requirements** | SPF + DKIM + DMARC aligned, one-click unsubscribe per RFC 8058, bounce rate < 0.3%, spam rate < 0.1%. |
| Wedding-day reminder cadence | **Calendly + Airbnb checkin emails** | T-7d / T-1d / T-1h ladder with calendar attachment + venue address front and center. |

We are **not** cloning Stripe's templates. We are matching their **deliverability discipline** (sender domain, alignment, suppression hygiene) so we never end up in the spam folder when a couple needs the payment-instructions email at 11pm three weeks before the wedding.

---

## 3. Scope (V1)

**In scope:**

- One sender domain (`notifications@setnayan.com`) with SPF, DKIM, DMARC, and BIMI-ready record setup.
- Resend as primary provider; SendGrid as admin-toggleable fallback.
- Ten transactional / coordination templates spanning five categories (payments, vendors, events, account, marketing).
- React Email components rendered server-side, stored as compiled HTML in the dispatch payload for replay.
- Async dispatch via Cloudflare Queue (retries, dead-letter).
- Provider webhook ingest for delivered / opened / clicked / bounced / complained / unsubscribed.
- Suppression list (hard bounces + spam complaints + unsubscribes + admin blocks).
- One-click unsubscribe per category.
- Per-user notification preferences (`notification_preferences` from 0025), quiet-hours support, category opt-outs.
- Admin observability inside 0023 Settings → Email Operations.
- Plaintext alternative for every HTML email.
- Mobile-responsive templates (Gmail, Apple Mail, Outlook).

**Out of scope (deferred to V1.1+):**

- **Centralized in-app notification bell + feed** (separate from the per-iteration in-UI badges that 0028 augments). Deferred per nav redesign 2026-05-14 — top-nav simplifies to `[Monogram] ........ [(I)]` for V1; bell + feed return as part of the V1.1 multi-channel push effort and consume the same dispatch primitives this iteration ships.
- SMS fallback (separate iteration; Twilio or Globe Labs).
- Push notifications (Expo + web push; separate iteration).
- In-app digest emails (daily / weekly bundles for low-priority events).
- Marketing automation flows beyond simple one-off broadcasts (drip campaigns, behavioral triggers).
- Multi-language template rendering (EN / TL / CEB) — V1 ships EN primary with selective Tagalog warmth in subject lines per marketing voice memory; full TL / CEB localization is V1.1.
- Custom per-vendor branded templates (vendor logos in customer notifications about that vendor).
- A/B testing infrastructure.

---

## 4. Architecture

**Provider:** **Resend** (`resend.com`) primary.

Resend is chosen because:
1. Excellent transactional DX — clean SDK, React Email native rendering, helpful error messages.
2. Same team as Vercel (which Setnayan already uses for web hosting), aligned upgrade cadence.
3. Low cost — $0.00001/email base + sender domain free; ₱0.0006 effective at PH conversion.
4. Strong deliverability defaults; pre-warmed shared IPs for low-volume launches, dedicated IPs available at scale.
5. React Email templates match Setnayan's Next.js + React stack — same components can be reused across in-app, push, and email surfaces over time.

**Fallback provider:** **SendGrid**. Admin-toggleable from 0023 → Email Operations → Provider. Same template payload structure (compiled HTML + plaintext); the dispatcher chooses the provider at send time based on the global flag. If Resend is unreachable for > 5 minutes, the queue auto-routes to SendGrid (circuit-breaker pattern).

**Sender domain:** `notifications@setnayan.com`. SPF includes both Resend (`include:_spf.resend.com`) and SendGrid (`include:sendgrid.net`); DKIM signs with both providers' keys; DMARC starts at `p=quarantine; pct=100; rua=mailto:dmarc-reports@setnayan.com` and hardens to `p=reject` after 30 days of clean reports. BIMI record published once the verified mark certificate (VMC) lands — Setnayan symbol mark displayed inline in Gmail.

**Templates:** **React Email** components rendered server-side via `@react-email/render`. Each template is a TSX file under `apps/web/emails/`; compiled HTML + plaintext are inlined into the dispatch payload so a replay always produces the same bytes the user originally received.

**Queue:** Supabase Edge Function `dispatch-email` enqueues onto a **Cloudflare Queue** (`email-dispatch`). A Cloudflare Worker consumer picks up jobs, calls the active provider's API, updates the dispatch row, and ACKs the message. Failures route to a dead-letter queue inspected daily by the admin Email Operations panel.

**Webhooks:** Resend posts to `setnayan.com/api/email/webhook/resend`; SendGrid posts to `setnayan.com/api/email/webhook/sendgrid`. Both endpoints verify HMAC signatures, map provider-specific event names onto Setnayan's canonical set (`delivered`, `opened`, `clicked`, `bounced`, `complained`, `unsubscribed`), and update `email_dispatches` in place. Webhooks are idempotent on `provider_message_id` + event type.

---

## 5. Notification categories (5) + V1 templates (10)

Categories mirror the 0025 Profile Settings notification preference toggles so a single opt-out flips email + future push + future SMS together.

### Quick reference

| # | Template key | Category | Subject (EN-primary, Tagalog warmth where it lands) |
|---|---|---|---|
| 1 | `payment_instructions` | payments | Bayad mo, eto ang paraan — payment instructions for [SKU] |
| 2 | `payment_confirmed` | payments | Bayad mo nai-receive na 💌 — [SKU] activated |
| 3 | `refund_processed` | payments | Refund processed — ₱[amount] is on its way back |
| 4 | `new_vendor_message` | vendors | [Vendor business name] sent you a message |
| 5 | `vendor_status_change` | vendors | Your vendor [Name] is now [Tier] on Setnayan |
| 6 | `vendor_unresponsive_48h` | vendors | We nudged [Vendor] for you — here's what's next |
| 7 | `rsvp_received` | events | [Guest name] is in! RSVP confirmed for your wedding |
| 8 | `wedding_day_reminder` | events | [T-7d / T-1d / T-1h] reminder — [Event title] |
| 9 | `save_the_date_sent` | events | [Couple names] invite you to their wedding |
| 10 | `security_alert` | account | New sign-in to your Setnayan account |

Category 5 (marketing) ships with the infrastructure but no V1 templates — marketing emails (promotional, new vendor recommendations, feature announcements) are explicit opt-in via 0025 and the first marketing template lands in V1.1 once we have a curated send list.

---

## 6. Per-template specifications

Every template specification below states:

- **Template key** — canonical key the dispatch payload uses.
- **Category** — drives suppression resolution against `notification_preferences`.
- **Subject** + **Pre-header** — what the recipient sees in the inbox list.
- **Body structure** — greeting / main / CTA / footer at the shape level (the React Email TSX file is the source of truth for pixels).
- **Trigger** — where in the platform code the dispatch is enqueued.
- **Suppression rules** — when this dispatch is skipped.
- **Variables** — keys the `template_data` JSON must contain.

### 6.1 `payment_instructions`

- **Category:** payments
- **Subject:** `Bayad mo, eto ang paraan — payment instructions for {sku_name}`
- **Pre-header:** `Reference {reference_code}. Pay via BDO or GCash. Setnayan Team confirms within 24 hours.`
- **Body:** Greeting → "You applied for `{sku_name}` (₱`{amount_php}`). Send your payment to either of the accounts below and reply with your screenshot." → static BDO + GCash account block (account name, number, reference code in monospace) → "What happens next" 3-step explainer → CTA `View your order` → footer.
- **Trigger:** `service_orders` row created with `status = 'pending_payment'`.
- **Suppression:** Always sends (transactional). Bypasses quiet hours. Skips only if the email is on the global suppression list with reason `hard_bounce` or `admin_block`.
- **Variables:** `{customer_first_name, sku_name, sku_description, amount_php, reference_code, order_id, order_url, expiry_hint}`.

### 6.2 `payment_confirmed`

- **Category:** payments
- **Subject:** `Bayad mo nai-receive na 💌 — {sku_name} activated`
- **Pre-header:** `₱{amount_php} confirmed. {sku_name} is live on your event right now.`
- **Body:** Greeting → confirmation block (amount + date + reference) → "You can now do X, Y, Z" benefits list scoped to the SKU → CTA `Open my event` → BIR-attached Official Receipt PDF if 0026 is live and the customer is registered for OR issuance → footer.
- **Trigger:** Admin reconciles a `service_orders` row to `status = 'paid'` from the 0023 Payments Handler panel.
- **Suppression:** Always sends (transactional). Bypasses quiet hours.
- **Variables:** `{customer_first_name, sku_name, amount_php, reference_code, order_id, paid_at, event_name, event_url, benefits[]}`. PDF attachment via `or_pdf_r2_key` when present.

### 6.3 `refund_processed`

- **Category:** payments
- **Subject:** `Refund processed — ₱{amount_php} is on its way back`
- **Pre-header:** `Refund for {sku_name} sent to your {payment_method}. Reference {refund_reference}.`
- **Body:** Greeting → refund block (amount + method + estimated arrival date — BDO 1–3 banking days, GCash same-day) → "Why this refund happened" reason text → CTA `View refund details` → "Need help?" → footer.
- **Trigger:** Admin marks `service_orders.status = 'refunded'` and writes a `refunds` row.
- **Suppression:** Always sends.
- **Variables:** `{customer_first_name, sku_name, amount_php, refund_method, refund_reference, refund_reason_text, estimated_arrival_date}`.

### 6.4 `new_vendor_message`

- **Category:** vendors
- **Subject:** `{vendor_business_name} sent you a message`
- **Pre-header:** `{message_preview_60_chars}…`
- **Body:** Greeting → vendor avatar (vendor logo per identity-masking rule) + business name + first 280 chars of message → CTA `Reply in Setnayan` → "Why we're sending this" footer noting the user can change cadence (instant / 2hr batch / daily digest) in 0025 → unsubscribe link (category-specific) → footer.
- **Trigger:** New `chat_messages` row where `chat_thread_participants.notification_pref = 'all'` for the recipient AND the recipient hasn't opened the thread within 5 minutes (debounce to avoid emailing on every chime).
- **Cadence resolution:** `notification_preferences.vendors_email_cadence ∈ ('instant','batched_2h','daily_digest')`. `batched_2h` flushes the queued previews into one email per thread every 2 hours; `daily_digest` flushes once at 09:00 PHT.
- **Suppression:** Skips if the user has muted the thread, if `notification_preferences.vendors_email_enabled = false`, or if currently inside the user's quiet hours (defer to next active window unless quiet-hours window > 24h, in which case fold into the next digest).
- **Variables:** `{customer_first_name, vendor_business_name, vendor_logo_url, message_preview, thread_url, unread_count_in_thread}`.

### 6.5 `vendor_status_change`

- **Category:** vendors
- **Subject:** `Your vendor {vendor_business_name} is now {new_tier_label} on Setnayan`
- **Pre-header:** `Status changed from {old_tier_label} to {new_tier_label} on {effective_date}.`
- **Body:** Greeting → status change explainer ("Standard Verified → Certified means {Certified tier benefits}") → CTA `View {vendor_business_name}` → "What this means for your booking" note (in-flight bookings are unaffected) → footer.
- **Trigger:** Admin promotes/demotes a vendor in the 0023 Vendor Tier panel; row in `vendor_tier_changes` audit log is INSERTed.
- **Suppression:** Skips if user has no active booking with this vendor (avoid spamming customers who only browsed). Skips if `notification_preferences.vendors_email_enabled = false`.
- **Variables:** `{customer_first_name, vendor_business_name, vendor_logo_url, vendor_url, old_tier_label, new_tier_label, effective_date, tier_benefits_text}`.

### 6.6 `vendor_unresponsive_48h`

- **Category:** vendors
- **Subject:** `We nudged {vendor_business_name} for you — here's what's next`
- **Pre-header:** `It's been 48 hours since your last message. Here's how to escalate if you need to.`
- **Body:** Greeting → "Your message to `{vendor_business_name}` on `{last_message_date}` is still unread." → "We've sent them a reminder." → CTA `Open thread` → secondary actions (`Find a backup vendor` / `Escalate to Setnayan Team`) → footer.
- **Trigger:** Daily scheduled job at 14:00 PHT queries `chat_threads` for any thread where the last customer message is > 48h old, the last vendor activity is older than that, and the customer hasn't already received this template for this thread in the last 7 days.
- **Suppression:** Skips after one send per thread per 7 days. Skips if vendor responded within the same hour as the scan.
- **Variables:** `{customer_first_name, vendor_business_name, vendor_logo_url, thread_url, last_message_preview, last_message_date, escalate_url, find_backup_url}`.

### 6.7 `rsvp_received`

- **Category:** events
- **Subject:** `{guest_first_name} is in! RSVP confirmed for your wedding`
- **Pre-header:** `{plus_one_text}. Running total: {confirmed_count} of {invited_count} guests.`
- **Body:** Greeting → guest name + plus-one details → running RSVP counter → CTA `View guest list` → optional "thoughtful note from `{guest_first_name}`" if the guest left one on the RSVP form → footer.
- **Trigger:** `guests.rsvp_status` transitions from `pending` to `confirmed`.
- **Suppression:** Skips if `notification_preferences.events_email_enabled = false`. Honors per-event mute (organizer can mute their own RSVP emails from the 0001 guest list panel).
- **Variables:** `{organizer_first_name, guest_first_name, guest_last_name, plus_one_text, confirmed_count, invited_count, guest_note, guest_list_url}`.

### 6.8 `wedding_day_reminder`

- **Category:** events
- **Subject:** `{stage_label} reminder — {event_title}` (stage_label = "1 week away" / "Tomorrow" / "1 hour to go")
- **Pre-header:** `{call_time} at {venue_name}. {weather_hint}.`
- **Body:** Greeting → date / call time / venue address (clickable, opens Maps) → "Bring with you" checklist scoped to the recipient's role (organizer / vendor / coordinator) → CTA `Open event` → calendar attachment (`.ics` reattached at every stage so the recipient can re-add if they deleted) → footer.
- **Trigger:** Scheduled job at 09:00 PHT scans `events` for `event_date - now() ≈ 7d / 1d` and at top of each hour for `event_date - now() ≈ 1h`. T-1h reminder also dispatches at the actual venue's local timezone (V1 assumes Asia/Manila across the board).
- **Suppression:** Recipient-specific. T-7d skips if `notification_preferences.events_email_enabled = false`. T-1d and T-1h **always send** for organizers and confirmed vendors — wedding-day reliability overrides quiet hours and overrides standard category opt-out. T-1h skips for guests entirely (too noisy).
- **Variables:** `{recipient_first_name, recipient_role, stage_label, event_title, event_date, call_time_local, venue_name, venue_address, venue_maps_url, weather_hint, bring_checklist[], event_url, ics_attachment}`.

### 6.9 `save_the_date_sent`

- **Category:** events
- **Subject:** `{organizer_names} invite you to their wedding`
- **Pre-header:** `{event_date_pretty} · {venue_city}. RSVP inside.`
- **Body:** Editorial-warm greeting → couple names in display font → date + city → embedded preview image (Save-the-Date render thumbnail or hero photo) → CTA `View invitation` → `Add to calendar` secondary → footer.
- **Trigger:** Organizer dispatches their save-the-date batch from the 0024 Save-the-Date surface; one dispatch row per guest with a valid email.
- **Suppression:** Guests without valid emails fall back to the in-app invite (still works because guests have accounts per the 2026-05-12 memory rule). Skips if guest is on global suppression list. Marketing opt-out does NOT suppress this (it's a personal invitation, not marketing).
- **Variables:** `{guest_first_name, organizer_names, event_date_pretty, venue_city, hero_image_url, invitation_url, ics_attachment}`.

### 6.10 `security_alert`

- **Category:** account
- **Subject:** `New sign-in to your Setnayan account`
- **Pre-header:** `{device_summary} from {city_or_region} at {login_time_local}. Was this you?`
- **Body:** Greeting → "We noticed a sign-in" block (device + IP-derived city + timestamp) → `Yes, this was me` (no-op confirmation) + `No, secure my account` (forces logout-all + password reset) → "We send this whenever you sign in from a device or city we haven't seen before" → footer.
- **Trigger:** Auth event where the device fingerprint OR the IP-derived city is not in the user's `known_devices` / `known_cities` set. Also fires on password change, email change, internal-account creation (admin recipient).
- **Suppression:** Always sends — security alerts override all category opt-outs and all quiet hours. Cannot be suppressed except via global block.
- **Variables:** `{recipient_first_name, event_type, device_summary, city_or_region, login_time_local, secure_account_url, ip_address_truncated}`.

---

### 6.11 `hiring_weekly_digest` (owner-only — locked 2026-05-20, shipped PR #212)

- **Category:** account (owner notification class)
- **Subject:** `Setnayan Growth Digest — Week of {week_label}`
- **Body:** Plain-text — vendor count + signups (with w-o-w growth %) + weekly bookings + Setnayan 5% revenue + bottleneck signals (🔴🟡🟢) + milestone forecasts + hiring countdowns + dashboard URL. Text-only following the existing `sendVendorInviteEmail` pattern; HTML follow-on deferred.
- **Trigger:** Recurring Mon 8am PHT — caller wires the schedule (manual page-load OK during V1; cron deferred per [[reference_setnayan_cron_strategy]]).
- **Suppression:** No suppression — owner notification.
- **Recipient:** `process.env.OWNER_NOTIFICATION_EMAIL` (fallback `iscasasolaii@gmail.com` per [[reference_setnayan_owner_email]]).
- **Variables:** `{verifiedActiveVendors, signupsLastWeek, signupsPriorWeek, weeklyBookingsPhp, setnayanRevenue5pctPhp, bottlenecks[], hireByCountdowns[], milestones[], dashboardUrl}`.

### 6.12 `hiring_bottleneck_alert` (owner-only — locked 2026-05-20, shipped PR #212)

- **Category:** account
- **Subject:** `🚨 Setnayan Alert — {signal_label} at {level}`
- **Body:** Current value + threshold + recommended role + salary range + 7-day suppression notice + dashboard URL.
- **Trigger:** Fires from `runHiringAlertSweep()` on-access sweep when a bottleneck signal flips to red (yellow is dashboard-only, not emailed). Signal flips checked per dashboard load.
- **Suppression:** 7-day suppression after fire (queried against `owner_alerts.fired_at`) to prevent alert fatigue.
- **Recipient:** Owner notification email (per 6.11).
- **Variables:** `{signal, level, currentValue, threshold, recommendedRole, recommendedSalaryRange, dashboardUrl}`.

### 6.13 `hiring_milestone_hit` (owner-only — locked 2026-05-20, shipped PR #212)

- **Category:** account
- **Subject:** `🎉 Milestone — {milestone_value} verified vendors`
- **Body:** Celebratory open line + milestone label + "This milestone unlocks:" block (when applicable — e.g., 1,000 unlocks Marketing SKUs + 50% launch discount for first 30 pre-registered vendors) + dashboard URL.
- **Trigger:** Fires once per milestone target (100 / 1,000 / 5,000 / 25,000 verified vendors) via on-access sweep. Deduped against `owner_alerts.milestone_value`.
- **Suppression:** Permanent — once a milestone fires, it never re-fires.
- **Recipient:** Owner notification email.
- **Variables:** `{milestoneValue, milestoneLabel, unlocks[], dashboardUrl}`.

### 6.14 `hiring_countdown` (owner-only — locked 2026-05-20, shipped PR #212)

- **Category:** account
- **Subject:** `{urgency} {role_title} hire` (urgency labels: "30 days to", "⚠️ 2 weeks to", "🚨 1 week to")
- **Body:** Hire-by date + salary range + current status + related bottleneck signal if applicable + notes + dashboard URL.
- **Trigger:** Fires at T-30 / T-14 / T-7 days before each `hiring_roadmap.hire_by_date` (deduped per role + threshold pair). Skipped for roles with status `hired` or `deferred`.
- **Suppression:** Dedup per (role, threshold) — each role fires each of the 3 thresholds exactly once.
- **Recipient:** Owner notification email.
- **Variables:** `{role, daysRemaining, bottleneckStatus, dashboardUrl}`.

**Cross-references:** all 4 templates wired in PR #212. Sweep entrypoint at `apps/web/lib/hiring-guide/alert-engine.ts`. Templates at `apps/web/lib/hiring-guide/emails.ts`. Dashboard at `/admin/operations-hiring` per [[0023]] § 3.14.

---

## 7. Schema

```sql
-- Email dispatch queue (one row per outbound email; never deleted)
CREATE TABLE email_dispatches (
  dispatch_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(user_id),
  category             TEXT NOT NULL CHECK (category IN ('payments','vendors','events','account','marketing')),
  template_key         TEXT NOT NULL,         -- e.g. 'payment_confirmed', 'rsvp_received'
  template_data        JSONB NOT NULL,        -- variables fed into the React Email template
  subject              TEXT NOT NULL,         -- rendered subject (snapshot)
  to_email             TEXT NOT NULL,         -- snapshot of users.email at dispatch time
  scheduled_for        TIMESTAMPTZ,           -- NULL = send immediately; otherwise defer
  sent_at              TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,           -- from provider webhook
  opened_at            TIMESTAMPTZ,
  clicked_at           TIMESTAMPTZ,
  bounced_at           TIMESTAMPTZ,
  bounce_reason        TEXT,
  unsubscribe_at       TIMESTAMPTZ,
  provider             TEXT NOT NULL DEFAULT 'resend' CHECK (provider IN ('resend','sendgrid')),
  provider_message_id  TEXT,                  -- correlation key for webhooks
  status               TEXT NOT NULL DEFAULT 'queued'
                         CHECK (status IN ('queued','sent','delivered','bounced','complained','failed','suppressed')),
  suppression_reason   TEXT,                  -- e.g. 'user_preference','quiet_hours_overflow','global_suppression'
  retry_count          INT NOT NULL DEFAULT 0,
  next_retry_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_dispatches_user        ON email_dispatches(user_id, scheduled_for DESC);
CREATE INDEX idx_dispatches_status      ON email_dispatches(status) WHERE status IN ('queued','failed');
CREATE INDEX idx_dispatches_scheduled   ON email_dispatches(scheduled_for) WHERE status = 'queued' AND scheduled_for IS NOT NULL;
CREATE INDEX idx_dispatches_provider_id ON email_dispatches(provider_message_id);

-- Suppression list (auto-populated on hard bounce + spam complaint + unsubscribe)
CREATE TABLE email_suppressions (
  email_address  TEXT PRIMARY KEY,
  reason         TEXT NOT NULL CHECK (reason IN ('hard_bounce','spam_complaint','unsubscribe','admin_block')),
  category       TEXT CHECK (category IN ('payments','vendors','events','account','marketing')),
                                              -- NULL = global suppression; otherwise category-specific
  suppressed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  override_at    TIMESTAMPTZ,                 -- admin manual override
  override_by    UUID REFERENCES users(user_id),
  notes          TEXT
);

-- Unsubscribe tokens (one-click per RFC 8058)
CREATE TABLE email_unsubscribe_tokens (
  token        TEXT PRIMARY KEY,              -- 32 hex chars, URL-safe
  user_id      UUID NOT NULL REFERENCES users(user_id),
  category     TEXT NOT NULL CHECK (category IN ('payments','vendors','events','account','marketing')),
  dispatch_id  UUID REFERENCES email_dispatches(dispatch_id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at  TIMESTAMPTZ
);

CREATE INDEX idx_unsub_user_category ON email_unsubscribe_tokens(user_id, category);

-- Daily aggregated metrics (refreshed by scheduled job)
CREATE MATERIALIZED VIEW email_metrics_daily AS
SELECT
  DATE(sent_at)  AS day,
  category,
  template_key,
  COUNT(*)                                                 AS sent,
  COUNT(*) FILTER (WHERE delivered_at IS NOT NULL)         AS delivered,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL)            AS opened,
  COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)           AS clicked,
  COUNT(*) FILTER (WHERE bounced_at IS NOT NULL)           AS bounced,
  COUNT(*) FILTER (WHERE status = 'complained')            AS complained,
  COUNT(*) FILTER (WHERE status = 'suppressed')            AS suppressed
FROM email_dispatches
WHERE sent_at IS NOT NULL
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX idx_metrics_day_template ON email_metrics_daily(day, category, template_key);
```

`notification_preferences` (already defined in 0025) is the upstream source for per-user opt-outs. The relevant columns:

```sql
-- Snippet from 0025; reproduced for clarity, NOT re-created here
-- notification_preferences (
--   user_id UUID PRIMARY KEY REFERENCES users(user_id),
--   payments_email_enabled  BOOLEAN NOT NULL DEFAULT TRUE,   -- transactional default-on
--   vendors_email_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
--   vendors_email_cadence   TEXT NOT NULL DEFAULT 'instant'
--                             CHECK (vendors_email_cadence IN ('instant','batched_2h','daily_digest')),
--   events_email_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
--   account_email_enabled   BOOLEAN NOT NULL DEFAULT TRUE,   -- security overrides this anyway
--   marketing_email_enabled BOOLEAN NOT NULL DEFAULT FALSE,  -- marketing default-off; explicit opt-in
--   quiet_hours_start       TIME,                            -- e.g. '22:00'
--   quiet_hours_end         TIME,                            -- e.g. '07:00'
--   timezone                TEXT NOT NULL DEFAULT 'Asia/Manila'
-- )
```

---

## 8. Per-user preference resolution

Before enqueuing, the dispatcher resolves the user's preferences:

1. **Global suppression check.** If `to_email` is in `email_suppressions` with `reason ∈ ('hard_bounce','admin_block')` AND no `override_at`, mark dispatch `suppressed` and return.
2. **Category opt-out check.** Look up `notification_preferences.{category}_email_enabled`. If FALSE, mark `suppressed` with `suppression_reason = 'user_preference'`. **Exception:** payments + account categories always send regardless (transactional baseline per CAN-SPAM / RA 10173).
3. **Security override.** If template is `security_alert`, send immediately regardless of quiet hours, opt-outs, or cadence settings.
4. **Quiet hours.** If now() (in user's timezone) is within `[quiet_hours_start, quiet_hours_end]`, defer `scheduled_for` to the start of the next active window. **Exception:** payments + account + T-1d / T-1h wedding-day reminders bypass quiet hours.
5. **Cadence (vendor messages only).** If template is `new_vendor_message` and `vendors_email_cadence ∈ ('batched_2h','daily_digest')`, enqueue with the next flush window's `scheduled_for`.
6. **Idempotency.** A dispatch is keyed on `(user_id, template_key, dedupe_key)` where `dedupe_key` is template-specific (order_id for payment templates, message_id for vendor messages, event_id+stage for wedding-day reminders). Re-enqueue within the dedupe window is a no-op.

---

## 9. Delivery + reliability

**Async dispatch flow:**

1. Trigger code calls `enqueueEmail({user_id, template_key, template_data, category})`.
2. Edge Function `dispatch-email` resolves preferences (§ 8), inserts an `email_dispatches` row with `status = 'queued'`, and pushes a job onto the Cloudflare Queue `email-dispatch`.
3. Worker consumer pulls the job, renders the React Email component to HTML + plaintext, calls the active provider's send API, stores the returned `provider_message_id`, and sets `status = 'sent'` + `sent_at = now()`.
4. Provider webhook fires asynchronously over the next minutes / hours; the webhook handler updates `delivered_at`, `opened_at`, `clicked_at`, `bounced_at` in place.

**Retry policy:** exponential backoff `5s → 30s → 5min → 30min → 2hr → fail`. After 5 failed attempts the dispatch lands in `status = 'failed'` and the worker pushes a dead-letter queue message that surfaces in the admin Email Operations panel.

**Provider failover:** If Resend returns 5xx for > 5 minutes (rolling), the dispatcher switches the per-dispatch `provider` field to `sendgrid` for new jobs. Admin can also force the failover from 0023 Settings → Email Operations → Provider. In-flight Resend jobs retry through Resend; the failover only affects newly enqueued work.

**Bounce + complaint handling:**

- **Hard bounce** → email added to `email_suppressions` with `reason = 'hard_bounce'`. Future sends to this address skip with `status = 'suppressed'`. Admin can manually un-suppress via 0023.
- **Soft bounce** → retry per backoff. After 5 soft bounces in 30 days the address is treated as hard.
- **Spam complaint (FBL)** → `reason = 'spam_complaint'`, auto-suppress globally, log to admin audit, flag the user for review (a customer marking us as spam is a UX signal as much as a deliverability signal).
- **Unsubscribe** → `reason = 'unsubscribe'`, suppress only for the matching `category` (per RFC 8058 one-click unsubscribe). Other categories continue to send.

**RFC 8058 one-click unsubscribe.** Every marketing-eligible email carries:

```
List-Unsubscribe: <https://setnayan.com/u/{token}>, <mailto:unsubscribe+{token}@notifications.setnayan.com>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

The token resolves to a `email_unsubscribe_tokens` row, flips the matching `notification_preferences.{category}_email_enabled` to FALSE, inserts a category-specific row in `email_suppressions`, and renders a confirmation page with a one-click "resubscribe" affordance.

---

## 10. Branding

- **Header:** Setnayan symbol mark (terracotta pin/star until the new mark from `0015_main_website/setnayan_logo.svg` lands, then that mark) at 40×40 px, left-aligned. SETNAYAN wordmark in DM Mono uppercase tracking, right of the mark. Cream `#FAF6F0` background.
- **Body:** Ink `#1A1A1A` text on cream. Manrope (or web-safe fallback `system-ui, -apple-system, Segoe UI, Helvetica Neue, sans-serif`) for body; Cormorant Garamond italic (or web-safe fallback `Georgia, "Times New Roman", serif`) for display lines.
- **CTA button:** Terracotta `#C97B4B` background, cream text, 12 px corner radius, 16 px / 24 px padding. One primary CTA per email.
- **Footer:** Light terracotta divider line → "Setnayan, Inc. · [registered business address]" → DPO contact `dpo@setnayan.com` → Privacy Policy + Terms links → category-specific unsubscribe link → "Why you're getting this email" sentence.
- **Plaintext alternative:** Every HTML email ships with a plaintext version generated alongside (React Email exposes both). Critical for deliverability (Gmail downranks HTML-only) and accessibility (screen readers + plaintext-only mail clients).
- **Mobile responsiveness:** Single column, max-width 600 px, fluid below 480 px. Tested in Gmail (iOS, Android, web), Apple Mail (iOS, macOS), Outlook (Windows, web). Litmus or similar previews enforced in CI on the React Email components.
- **Dark mode:** Honor `prefers-color-scheme: dark` in supporting clients via CSS media query — flip cream → ink and ink → cream. Apple Mail and Gmail web honor this; Outlook does not (we don't fight it).

### 10.1 Tone — helping voice, never announcement voice (locked 2026-05-18)

Every email's copy must read as **Setnayan actively helping** the recipient, not Setnayan announcing a system event. This is the "always helping" north-star (memory: `project_setnayan_always_helping_principle.md` · CLAUDE.md 2026-05-18 sixth decision-log row) applied to email tone.

**Pattern:**

| Announcement voice (avoid) | Helping voice (use) |
|---|---|
| "Your verification was renewed." | "Your verification renews next month — we'll handle the docs check Tuesday." |
| "Payment received." | "We've confirmed your ₱25,000 deposit to Caterer Y — Anna (your coordinator) marked it received this morning." |
| "Trial expired." | "Your trial just ended — your plan and conversations stay saved. Come back anytime by re-activating Concierge." |
| "New message from Photographer X." | "Photographer X replied to your tasting question — read it here." |
| "RSVP received from Maria Santos." | "Maria Santos said yes! She's confirmed for your wedding on Feb 14." |

**Mechanics:**
- Subject lines lead with the helpful action or the human moment, not the system event
- Pre-header copy expands the warmth ("We've got this handled" / "Here's what's next" / "Pick up where you left off")
- Body copy positions Setnayan as the proactive party — "we" + helpful verbs ("we've confirmed", "we're tracking", "we'll send you a reminder")
- Single primary CTA stays — but framed as opening continued help, not completing a transaction

**This pattern also applies to vendor-side notifications.** Vendor emails (booking confirmations, payout notifications, verification renewals, message alerts) shift to helping voice — *"We're processing your ₱45,000 payout — should clear by Friday"* not *"Payout scheduled."*

**Existing V1 templates to revise per this rule:**

- `payment_instructions` · `payment_confirmed` · `refund_processed` — replace transactional language with progress-narrative language
- `new_vendor_message` · `vendor_status_change` · `vendor_unresponsive_48h` — frame as "here's where things stand" + a helpful next step
- `rsvp_received` — celebrate the moment, name the guest
- `wedding_day_reminder` — countdown narrative, not system reminder
- `save_the_date_sent` · `security_alert` — keep security alert formal (helping doesn't mean casual); but everything else shifts

The 6 brand-truth lines from § 10 (Setnayan visual identity) stay — this is purely a copy direction layered on top.

---

## 11. Compliance

- **PH Data Privacy Act (RA 10173).** Marketing emails require explicit opt-in (`marketing_email_enabled = TRUE`, defaulted FALSE in 0025). Transactional categories (payments, account security, event coordination) are lawful under the legitimate-interest basis without explicit opt-in, but they still respect category-specific unsubscribe-from-marketing. DPO contact `dpo@setnayan.com` is in every footer. Suppression list is one of the data points covered by 0025's "delete my account" flow.
- **CAN-SPAM (US visitors / vendors).** Clear sender ID (`Setnayan <notifications@setnayan.com>`), valid physical mailing address in every footer, working unsubscribe mechanism processed within 10 business days (we process in seconds), no deceptive subject lines or false header info.
- **GDPR (EU visitors).** Same opt-in / opt-out / right-to-be-forgotten patterns as RA 10173. Suppression list survives account deletion (the email address stays in `email_suppressions` even if the user row is deleted, so we can't accidentally re-mail a deleted user who later re-registers with the same address — separate question of whether to allow re-registration is owned by 0025).
- **Gmail / Yahoo 2024 bulk sender requirements.** SPF + DKIM + DMARC aligned at `p=quarantine` minimum (target `p=reject` 30 days post-launch). One-click unsubscribe per RFC 8058 on every marketing email. Bounce rate < 0.3% and spam rate < 0.1% are operational SLAs monitored in the admin Email Operations panel.

---

## 12. Admin observability (in 0023)

A new sub-section ships inside 0023 Settings → **Email Operations** (admin role gate: Operations Handler tier or higher):

- **Queue health card** — queued / sending / failed / dead-letter counts, last 24h.
- **Daily volume + funnel** — sent / delivered / opened / clicked / bounced / complained, sliceable by category and by template_key, last 30 days.
- **Suppression list** — paginated table of `email_suppressions` rows; search by email; per-row "Override" action (logged to admin audit with two-admin approval if `reason = 'spam_complaint'`).
- **Template preview** — pick a template + paste sample JSON → renders the email server-side and shows the HTML + plaintext side-by-side.
- **Send test email** — admin sends any template to their own email (or a test inbox under `*@notifications.setnayan.com`). One-click; logs to audit.
- **Provider toggle** — Resend ⇄ SendGrid radio. Toggle is two-admin-approved (per the 2026-05-12 § 9.1 memory rule, this counts as "modify Setnayan payment-account-equivalent settings" because it controls deliverability).
- **Deliverability health** — DMARC reports parsed, SPF/DKIM alignment status, bounce + complaint rate trend, BIMI status.
- **Dead-letter inspector** — shows failed dispatches with last error from the provider, raw payload, and `Retry` button.

---

## 13. Cost projection

At ₱0.0006 per Resend email and an estimated 30 emails per event lifecycle × 1,000 events/month = 30,000 emails/month = **₱18/month**. Cost is negligible at V1 scale.

Sensitivity:

- 10,000 events/month → 300,000 emails → ₱180/month.
- 100,000 events/month → 3,000,000 emails → ₱1,800/month + likely move to a dedicated IP at ~$30/month (₱1,700) → ~₱3,500/month all-in. Still well under one Custom Monogram Pack sale per month.

Revisit only if monthly volume exceeds 100K, at which point dedicated IPs + multi-domain warmup become relevant.

SendGrid as fallback adds zero cost while idle (their free tier covers 100 emails/day; we pay only if we actually fail over and stay there for hours).

---

## 14. Forward-compatibility hooks

- **Schema multi-channel.** `email_dispatches.provider` is intentionally a free-string CHECK column. The next iteration adds `'twilio_sms'`, `'apns'`, `'fcm'` without altering the table shape.
- **Notification preferences shape.** 0025's `notification_preferences` table will grow `*_sms_enabled`, `*_push_enabled` columns alongside `*_email_enabled` when those channels ship; existing email-side code reads its own column and is unaffected.
- **Localization.** Template files are keyed `payment_confirmed.en.tsx`. When TL + CEB localized templates ship in V1.1, the dispatcher reads `users.preferred_locale` and picks the right file. EN remains the default fallback.
- **Vendor-branded templates.** Vendor-specific templates (`new_vendor_message`, `vendor_unresponsive_48h`) carry the vendor logo via `vendor_logo_url` already. The full vendor-branded layout (vendor's color scheme as header chrome) is a V1.1 toggle gated on Vendor Pro Weekly.

---

## 15. Acceptance tests

1. Customer applies for the ₱1,999 Custom Monogram Pack → within 60 seconds receives `payment_instructions` email with correct BDO + GCash blocks + matching `reference_code`.
2. Admin reconciles the same order to `paid` → customer receives `payment_confirmed` within 60 seconds; email opens are tracked via webhook within 5 minutes.
3. Customer mutes the `vendors` category in 0025 → next vendor message generates an `email_dispatches` row with `status = 'suppressed'` and `suppression_reason = 'user_preference'` and the email is NOT sent.
4. Customer's email lands on `email_suppressions` after a hard bounce → next `wedding_day_reminder` skips with `suppression_reason = 'global_suppression'`; admin manual un-suppress restores delivery on the subsequent send.
5. Customer clicks the one-click unsubscribe link in a vendor-category email → `notification_preferences.vendors_email_enabled` flips to FALSE within 5 seconds; `email_unsubscribe_tokens.consumed_at` is set; the customer's payment-category emails continue to send.
6. Resend returns 5xx for > 5 minutes (simulated) → dispatcher auto-flips to SendGrid for new jobs; admin sees the provider state change in 0023; in-flight Resend jobs retry through Resend per backoff.
7. T-7d / T-1d / T-1h `wedding_day_reminder` sends fire at the correct local-time thresholds; T-1h sends to organizers + confirmed vendors but NOT to guests; T-1d send overrides organizer's quiet hours.
8. Security alert for a new-city sign-in sends within 60 seconds even when the user has all categories muted and is inside quiet hours.
9. Spam complaint webhook posts → `email_suppressions` row INSERTed with `reason = 'spam_complaint'`; admin audit log entry written; admin un-suppress requires two-admin approval per § 9.1.
10. Template preview tool in 0023 renders `rsvp_received` with sample JSON correctly in HTML + plaintext; both versions match what the customer would actually receive.
11. Send-test-email button in 0023 dispatches `payment_confirmed` to the admin's own email; dispatch row created with `is_test = TRUE` semantic flag (admin-audit only, not user-facing).
12. DMARC report parser ingests a sample AGGREGATE XML and surfaces SPF/DKIM alignment counts in 0023.
13. Bounce rate exceeds 0.3% rolling 7d → 0023 surfaces a red banner; daily volume auto-throttles per provider best practice until rate falls below threshold.
14. Plaintext alternative is present on every dispatched email (validated in CI by parsing the multipart MIME structure on a sample of templates).
15. Mobile-responsive rendering passes Litmus (or similar) snapshot checks for Gmail iOS, Apple Mail iOS, Outlook web on every PR that touches `apps/web/emails/`.

---

## 16. Companion documents

- **0025 Profile Settings** — `notification_preferences` schema is the source of truth for per-user opt-outs and quiet hours; this iteration reads, never writes, that table (except via the unsubscribe-token flow).
- **0023 Admin console** — Email Operations sub-section; provider toggle gated on two-admin approval per § 9.1.
- **0019 Communications** — `new_vendor_message` trigger; dedupe + cadence resolution.
- **0026 BIR tax compliance** — Official Receipt + Form 2307 PDF attachments on `payment_confirmed` for OR-eligible customers.
- **0013 Platform stack** — Supabase Edge Functions for dispatcher; Cloudflare Queue for retry; sender domain `notifications@setnayan.com` lives in Cloudflare DNS.
- **Setnayan Privacy & Security Policy** — § on lawful basis for transactional vs marketing email; suppression list survives account deletion; DPO contact in every email footer.

---

## 17. Decision log (this iteration)

| Decision | Why |
|---|---|
| Resend primary / SendGrid fallback (not the reverse) | Resend's React Email integration cuts template authoring time roughly in half vs SendGrid's templating, and the Vercel-aligned roadmap means the DX gap will widen, not narrow. SendGrid is the deliverability-veteran insurance policy. |
| Marketing opt-in default-FALSE; transactional categories not opt-out-able | RA 10173 + CAN-SPAM both treat marketing as a higher-consent bar than transactional. Defaulting marketing OFF avoids any "we surprise-spammed our own users" launch incident. |
| One-click unsubscribe is category-specific, not global | A customer annoyed at vendor-message density should not also lose their payment-confirmation emails. Category-level granularity matches the 0025 preference shape. |
| Wedding-day T-1d and T-1h reminders bypass quiet hours | Wedding-day reliability is the hill these emails are designed to die on. A 6am call time means a 5am T-1h reminder, and the couple wants that reminder even if they normally mute. |
| Security alerts override everything | Standard practice; never a compliance question. |
| BIMI + verified mark certificate deferred to post-launch | VMC costs ~$1,500/year and requires registered trademark on the symbol mark. Setnayan trademark is in flight; once the registration lands, VMC is a 2-week procurement and a DNS record. Until then, Gmail shows our domain initial as the inbox avatar — acceptable. |
| Plaintext alternative is mandatory, never optional | Gmail's reputation algorithm penalizes HTML-only email; we lose nothing by always shipping both. |
| Sender domain is `notifications@setnayan.com`, not `setnayan.com` directly | Isolates transactional/marketing reputation from the corporate domain. If a campaign goes sideways, the corporate domain's deliverability is unaffected. |

---

## V1.2 Amendment — Moderator-Aware Notification Routing (added 2026-05-19)

Per [0048 Multi-Moderator Event Access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md), notifications gain visibility-aware routing in V1.2 to prevent surprise leaks.

### Routing rules per template

| Template | V1.1 recipient | V1.2 recipient (role-aware) |
|---|---|---|
| `rsvp_received` | Couple | All moderators with `can_view_guests=TRUE` |
| `payment_matched` | Couple | Specifically the payer who completed the transaction (per `paid_by_role` from [0049](../0049_multi_payer_cart/0049_multi_payer_cart.md)) |
| `vendor_inquiry_received` | Couple | Moderator who initiated the chat thread + other moderators with `can_message_vendors=TRUE` (respecting thread visibility tags) |
| `chat_message` | Couple | Moderators with chat-read access for that thread (filtered by `private_to_role` / `hidden_from_role` / `surprise_for_role`) |
| `welcome` | Couple | Moderator who just accepted invitation per [0048 § Moderator invitation flow](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) |
| `bridal_gown_fitting_ready` (new) | n/a | Bride + moderators who can see bridal_gown orders (parents of bride by default; NOT groom) |
| `groom_suit_ready` (new) | n/a | Groom + moderators who can see groom_suit orders (parents of groom by default; NOT bride) |

### New templates added in V1.2 (template count 9 → 12+)

- `moderator_invitation_sent` — invitation email/SMS to invitee with role + permissions summary
- `moderator_invitation_accepted` — confirmation to inviter + welcome to invitee
- `moderator_removed_from_event` — polite removal notification ("Thank you for helping plan [Couple]'s wedding")
- `surprise_item_ready` — generic template for surprise-tagged items (e.g., "Your surprise dance song is ready — keep it secret!")

### Per-moderator notification preferences

New `notification_preferences_json` column on `event_moderators` lets each moderator mute specific template types. Defaults:
- Couples: all enabled
- Parents: chat_message + payment_matched + RSVP enabled; marketing emails opt-in
- Sponsors / Family Helpers: schedule + day-of templates only
- Viewers: weekly digest only

### Surprise-item leak prevention

Notifications referring to hidden items use neutral copy:
- "Your bridal gown is ready for fitting" → only to bride + parents of bride
- Groom's notification feed for the same event-day shows: "Bride has an appointment today" (no vendor name, no item details)

Subject lines, preview text, and email body all sanitized per visibility tags.

### Email-forwarding leak risk

If a moderator forwards a Setnayan email to a shared inbox, surprise content could leak to the hidden role. Mitigations:
- Footer notice: "This email contains private wedding-planning content. Forward only to people who should see it."
- Per-template `is_sensitive_for_surprise` flag — sensitive templates include extra reminder language
- No shared-inbox forwarding from Setnayan itself (every recipient is a per-user email address; never a group alias)
