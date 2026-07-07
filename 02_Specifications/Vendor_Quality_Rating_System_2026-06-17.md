# Vendor Quality & Rating System
**Authored:** 2026-06-17 — design session with owner  
**Status:** Spec complete · build queued  
**Relates to:** Iteration 0022 (vendor dashboard) · Iteration 0023 (admin console) · Iteration 0019 (communications) · Iteration 0028 (email notifications) · `Adaptive_Checklist_Design_2026-06-17.md §17–§19`

---

## 1. Overview — two scores, two audiences

Vendor quality is expressed as two distinct scores that serve different audiences and are never merged into a single number.

| Score | Visibility | Purpose |
|-------|-----------|---------|
| **Couple Trust Score** (0–100) | Public — couples see it on search cards and vendor profiles | Helps couples evaluate and compare vendors before booking |
| **Platform Health Score** (0–100) | Internal — HQ only | Informs featured placement, at-risk flags, tier recommendations, proactive vendor outreach |

Both scores are **precomputed and stored** on `vendor_activity_stats`. Neither is computed at search or page-load time. Both update asynchronously via `after()` / `waitUntil` after each triggering event. No cron.

---

## 2. Couple Trust Score (public · 0–100)

Every signal in this score is something a couple genuinely cares about when choosing a vendor.

### Formula

| Signal | Weight | Source |
|--------|--------|--------|
| Review quality — Bayesian average star rating weighted by review count | 40% | `vendor_reviews` |
| Reliability — booking completion rate minus vendor cancellation rate | 30% | `event_vendors` status transitions |
| Responsiveness — response rate within 48h plus median first-reply time (inverse) | 30% | `messages` timestamps |

### Bayesian average (non-negotiable)

A vendor with 3 reviews cannot hold a 5.0 against a vendor with 80 reviews. The formula pulls every new vendor's score toward a platform-wide prior (approximately 4.0) until they accumulate enough reviews to move it meaningfully.

```
bayesian_avg = (prior_weight × prior_mean + review_count × raw_avg)
               / (prior_weight + review_count)

prior_mean   = 4.0  (platform baseline)
prior_weight = 10   (equivalent to 10 reviews worth of evidence)
```

This protects couples from artificially inflated new profiles and prevents gaming by asking friends for quick 5-star reviews. It also prevents one bad review from collapsing a vendor with a long track record.

### Reliability component

```
reliability_score = booking_completion_rate_pct − (vendor_cancellation_count × 15)
```

- `booking_completion_rate_pct` — % of bookings (finalized statuses: contracted/deposit_paid/delivered/complete) that reached `complete` without vendor cancelling
- `vendor_cancellation_count` — vendor-initiated cancellations in the trailing 90 days. Tracked via `force_majeure_flags` table with `flag_type = 'vendor_cancellation'` joined to `event_vendors` (no `cancelled` status on `event_vendors` itself)
- Each vendor cancellation deducts 15 points from the component (hard penalty — vendor cancellations destroy a couple's wedding plans)

**Ghost detection** is the worst-case reliability failure: a vendor who confirms a booking and goes silent within 7 days of the event. Handled by the HQ alert system (§8).

### Responsiveness component

```
response_score = (response_rate_pct × 0.6) + (speed_score × 0.4)

speed_score = max(0, 100 − (avg_response_minutes / 60 × 10))
  → 0 minutes  = 100
  → 6 hours    = 100 − 1  = 99
  → 24 hours   = 100 − 4  = 96
  → 48 hours   = 100 − 8  = 92
  → 1 week     = 100 − 28 = 72
  → 2 weeks    = 100 − 56 = 44
```

Response rate carries more weight (60%) than raw speed (40%) — a vendor who answers every inquiry slowly is better than one who answers half quickly and ignores the rest.

### What couples see on a vendor card

- Star rating + review count: **"4.8 · 63 reviews"**
- Aspect breakdown: Communication / Quality of Service / Value for Money
- Response badge (derived from responsiveness component):
  - Responds within 2 hours (median ≤ 2h)
  - Responds within 4 hours (median 2–4h)
  - Responds within a day (median 4–24h)
  - Slow to respond (median > 24h or response rate < 50%)
- Activity label: "Active this week" (last login ≤ 7 days) or "Low recent activity" (last login > 60 days)
- Experience badge (§5)
- Verified badge (from iteration 0023 verification)

---

## 3. Platform Health Score (internal · HQ only · 0–100)

What Setnayan uses for: featured vendor placement, at-risk flags, tier upgrade recommendations, and proactive vendor outreach.

### Formula

| Signal | Weight | Why it matters internally |
|--------|--------|--------------------------|
| Couple Trust Score | 40% | Trust is the foundation — platform credibility depends on vendor quality |
| App engagement | 20% | Login recency + profile freshness + response to HQ notices |
| Business volume | 15% | Finalized booking count — signals platform commitment and accumulated experience |
| Conversion rate | 15% | % of inquiries that become confirmed bookings — accurate profile + fair pricing = high conversion |
| Growth contribution | 10% | Referrals: vendors or couples they bring into Setnayan |

### App engagement component

```
engagement_score = (login_recency_score × 0.5) + (profile_freshness_score × 0.3) + (hq_responsiveness × 0.2)

login_recency_score:
  0–7 days    = 100
  8–30 days   = 80
  31–60 days  = 50
  61–90 days  = 20
  90+ days    = 0

profile_freshness_score:
  Updated in last 30 days  = 100
  Updated in last 90 days  = 60
  Updated in last 180 days = 30
  Older                    = 0

hq_responsiveness:
  Replied to HQ notice within 48h = 100
  Replied within 7 days           = 60
  No reply to last HQ notice      = 0
```

### Conversion rate component

```
conversion_rate_pct = confirmed_bookings / total_inquiries_received × 100
```

A persistently low conversion rate signals one of:
- Pricing misaligned with what the profile implies
- Profile photos/descriptions misleading
- Slow reply causing couples to move on before they can book

Low conversion is a HQ coaching opportunity, not just a score penalty. HQ can proactively reach out: "Your profile gets inquiries but few convert — here's what we've seen work for similar vendors."

### Growth contribution component

```
growth_score = (referred_vendors × 10) + (attributed_couple_acquisitions × 5)
               capped at 100
```

- `referred_vendors` — other vendors who joined Setnayan through this vendor's referral link
- `attributed_couple_acquisitions` — new couple accounts where this vendor's profile page was the last-touch acquisition source

**Growth contribution is internal only.** Couples care about service quality, not marketing ability. A vendor great at marketing but mediocre at delivery should not rank above a vendor great at delivery. Keeping it in the Platform Health Score prevents gaming.

### HQ dashboard views

HQ sees every vendor's Platform Health Score alongside:
- Score trend (30-day delta)
- Which component is dragging the score down
- At-risk alerts (see §8)
- Recommended actions ("reach out — conversion rate dropped 20pts this month")

---

## 4. Review system

### Who can leave a review

**Only couples with a completed booking through Setnayan.** No unverified walk-ins. No accounts created purely to review.

The review is unlocked **30 days after the event date** — not after payment, not after booking confirmation. The event must happen and the couple must have time to experience the full service (receive photos, watch the video, etc.) before rating. This produces honest reviews about actual delivery, not post-signing excitement.

### Aspect ratings

Four aspects ship in the DB (`rating_communication`, `rating_quality`, `rating_value`, `rating_on_time`). The review UI exposes **three visible aspects** — more kills completion rate — with the 4th (`rating_on_time`) captured silently as a binary (did the vendor arrive and deliver on time? yes/no → maps to 5 or 1).

| Aspect | DB column | What it measures |
|--------|-----------|-----------------|
| **Communication** | `rating_communication` | Responsive, transparent, easy to reach throughout the process |
| **Quality of Service** | `rating_quality` | Delivered what was promised on the day |
| **Value for Money** | `rating_value` | Price was fair for what was delivered |
| **On Time** | `rating_on_time` | Arrived + delivered on schedule (shown as binary: "Yes / No" → 5 or 1) |

Each aspect is rated 1–5 stars independently. The overall star rating is the average of the four aspects. Couples can optionally write a free-text review alongside the star ratings.

### One review per booking

One review per `event_vendors` row — not per person, not per guest. The couple leaves one review as a unit. If they have a coordinator who also worked with the vendor, that coordinator cannot leave a separate review.

### Vendor response

Vendors can respond publicly to any review they receive. The response is appended below the review text on the vendor profile and is visible to all couples browsing that vendor. Responses cannot edit or remove the original review. Character limit: 500.

### Anti-manipulation rules

- Only `event_vendors` rows with `status = 'completed'` unlock a review
- Review window: opens 30 days after `events.event_date`, closes 365 days after (one year to leave a review)
- Same-IP detection: if multiple reviews for the same vendor come from the same IP within 30 days → flagged to HQ queue
- Newly-created account reviews: accounts created within 14 days of leaving a review → flagged
- Near-identical text: fuzzy match against existing reviews for the same vendor → flagged
- Vendor can flag any review as fake → goes to HQ adjudication queue (iteration 0023 admin console)
- HQ can: dismiss the flag (review stays) / remove the review (if confirmed fake) / escalate to owner

---

## 5. Experience badge — finalized bookings

Finalized booking count earns a badge displayed on the vendor's profile and search card. Transparent about platform experience without penalizing new vendors.

| Badge | Setnayan finalized bookings |
|-------|-----------------------------|
| New to Setnayan | 0 |
| Established | 1–10 |
| Experienced | 11–50 |
| Expert | 51–200 |
| Elite | 200+ |

**Setnayan-only count.** External experience (years in business, offline portfolio) stays in the vendor's bio. The badge is what Setnayan can vouch for — bookings that flowed through the platform and were completed. "New to Setnayan" is not a negative; it is honest. Many excellent vendors are new to the platform.

---

## 6. Vendor quality signals — activity-based search ranking

The `quality_score` column on `vendor_activity_stats` is the 7th factor in the Explore search filter priority stack. It slots above refinements because responsiveness and reliability are objective signals that affect whether the couple's day succeeds.

### Full filter priority stack

```
1. Available on locked date                       ← hard exclude
2. Can serve locked venue location                ← hard exclude
3. Capacity ≥ estimated_pax                       ← hard exclude
4. Price within category budget range             ← soft rank
5. Venue accreditation                            ← soft rank
6. Sponsored-included / recommended partners      ← soft rank + badge
7. Quality score (reviews + response + recency)   ← soft rank
8. Refinements (style / attributes)               ← soft rank
9. Normal match score                             ← tiebreaker
```

### Quality score formula (for search ranking)

A simplified version of the Couple Trust Score, computed for ranking speed:

```
quality_score (0–100) =
  (review_avg_bayesian / 5 × 100 × 0.35)
  + (response_rate_pct × 0.30)
  + (response_speed_score × 0.20)
  + (login_recency_score × 0.15)
```

This is distinct from the Couple Trust Score (§2) — the Trust Score is the authoritative public-facing number; the quality_score is the precomputed search-ranking signal updated after each event.

### Couple-facing activity labels

| State | Label shown |
|-------|------------|
| Median reply < 4h + last login ≤ 7 days | "Usually responds within [X] hours" |
| Last login ≤ 7 days | "Active this week" |
| Last login 8–60 days | No label — appears at normal rank |
| Last login 31–60 days | No label — quality_score login component decays quietly |
| Last login > 60 days | "Low recent activity — message to confirm availability" |

Dormant vendors are **never hidden.** A region may have only one vendor in a category. The couple sees the warning and decides.

---

## 7. Push notifications — event-driven, no cron

Vendors receive native push notifications when a couple sends an inquiry. The flow is a database webhook firing on the event — no polling, no scheduled job, nothing that runs on a timer.

### End-to-end flow

```
1. Couple sends message → INSERT into chat_messages
   (sender_role = 'couple' | 'coordinator'; vendor self-messages are filtered out)
2. Supabase database webhook fires on the INSERT (event-driven, fires exactly once)
   Webhook must be created in Supabase Dashboard → Database Webhooks → chat_messages INSERT
   → header x-webhook-secret (matched against SUPABASE_WEBHOOK_SECRET env var)
3. Webhook calls /api/notify (Next.js route, runs inside after())
   Returns 200 { ok, queued: true } immediately
4. Route reads last_push_notified_at on the thread
   → if within the last 10 minutes: skip (dedup)
   → otherwise: stamp last_push_notified_at = now() BEFORE sending (collapses concurrent fires)
5. Route looks up vendor_push_tokens WHERE vendor_profile_id = [from chat_messages.vendor_profile_id] AND is_active = true
   Note: vendor_profile_id is already denormalized on chat_messages — no extra join needed
6. Sends push concurrently to all active tokens via FCM (Android) · APNs (iOS) · Web Push API (PWA)
   Permanent delivery failure → is_active = false auto-set
7. Vendor receives a native push — app does not need to be open
8. Tap → deep-links directly into the thread
```

**Owner action required:** Create Supabase Database Webhook for `chat_messages` INSERT → `https://{your-app}/api/notify` with header `x-webhook-secret: {SUPABASE_WEBHOOK_SECRET}`. Add `SUPABASE_WEBHOOK_SECRET` to Vercel env vars.

### Notification content

> **[Couple Name] sent you an inquiry**  
> *[Service category] · [Event type]*  
> Tap to reply

10-minute dedup window: if a couple sends 4 messages in 3 minutes, the vendor receives one push, not four.

### In-app vs background

- **Vendor has the app open:** Supabase Realtime subscription updates the message panel live. Push is suppressed — no phone notification when they are already reading the thread.
- **Vendor app is backgrounded or closed:** Push fires via the webhook → `/api/notify` path.

### Per-platform delivery

| Platform | How |
|----------|-----|
| Android (Capacitor) | Capacitor Push Notifications plugin → FCM token → Firebase Cloud Messaging |
| iOS (Capacitor) | Capacitor Push Notifications plugin → APNs token → Apple Push Notification service |
| PWA (mobile browser) | Service Worker + Web Push API → push subscription endpoint · service worker receives and displays push even when the browser tab is closed |

### Token management

- Token registered when vendor opens the app on any device and grants push permission
- Multiple devices = multiple rows — push delivered to all active devices simultaneously
- Stale token (delivery returns "token invalid") → `is_active = false` auto-set by `/api/notify` on first delivery failure
- Token refreshed on each app open (re-registration is idempotent — same token + device upserts, not duplicates)

### How push feeds the quality score loop

Push notification → vendor replies faster → `avg_response_minutes` drops → `response_rate_pct` rises → `quality_score` rises → better search placement → more inquiries → stronger motivation to stay active and respond. The push system directly feeds the quality ranking.

---

## 8. Vendor recommendations and sponsored tie-ups

When a couple shortlists a vendor (especially a reception venue), that vendor's recommended partners surface in search results with badges and affect the AI's budget calculation.

### Four relationship types

| Type | What it means | Fee impact to couple |
|------|--------------|---------------------|
| `accredited` | Venue pre-approves this vendor for their premises (e.g., allowed caterers) | Standard market rate |
| `sponsored_included` | Recommended vendor is bundled into the anchor vendor's package | ₱0 additional |
| `sponsored_discounted` | Commercial tie-up: couple gets below-market rate through the recommending vendor | Lower than market rate |
| `general` | Personal recommendation — no formal arrangement | Standard market rate |

### Search result surfacing

```
Recommendations slot as factor 6 in the filter priority stack — soft rank, not hard filter.
Non-recommended vendors are never hidden.

sponsored_included  → pinned at top · badge: "Included with [Venue] · No extra fee"
sponsored_discounted → second group · badge: "Preferred partner of [Venue] · X% off"
accredited           → rises in standard sort · badge: "Accredited by [Venue]"
general              → subtle label: "Recommended by [Vendor]" · no position change
```

### AI budget arithmetic

- **sponsored_included:** AI removes this category's projected cost from remaining budget entirely (₱0 additional). Checklist category auto-advances to `one_option` with the included vendor pre-populated. The couple sees: *"Your reception venue includes catering. We've adjusted your remaining budget."* Common in PH — hotel packages resolve 4–6 checklist categories simultaneously.
- **sponsored_discounted:** AI uses the discounted rate instead of the market benchmark from `budget_leaf_benchmarks` (p25_php/benchmark_php/p75_php per plan_group_id) for budget projection. Note: `vendor_market_stats` is a vendor-directory view and has no price data.
- **accredited / general:** Quality tie-breaker only. No budget impact.

The AI is always willing to recommend a non-partner vendor if they are materially better value or a stronger match. Recommendations are preference signals, not locks.

### Admin verification gate (non-negotiable)

`admin_verified = false` by default. The badge is invisible to couples until HQ confirms the relationship is real. Vendors cannot self-declare a sponsored tie-up and instantly receive prime placement.

HQ verification checks:
- The recommended vendor has an active Setnayan profile
- The inclusion claim is plausible (hotel declaring in-house catering = yes; florist declaring another florist as "included" = flag)
- Any fee or discount figure is explicitly stated

### Transparency rules

- Sponsored relationships must use "Preferred partner" language — never neutral labels like "Top pick" or "Best match"
- The AI discloses the recommendation relationship when a couple asks why a vendor appears first
- Couples can always dismiss a recommendation and search freely — dismissal does not penalize their checklist

---

## 9. Threshold actions — automatic vs HQ gated

### Automatic (no HQ action needed)

| Condition | Action | Visible to couple? |
|-----------|--------|-------------------|
| Bayesian avg drops below 4.0 | "Approaching low rating" alert in HQ dashboard | No |
| Response rate < 50% | "Slow to respond" label on search cards | Yes |
| Last login > 60 days | "Low recent activity — confirm availability" on search cards | Yes |
| Profile completeness < 50% | Profile completeness nudge in vendor dashboard | No (vendor only) |

### HQ review queue (two-admin gate)

Per §9.1 of iteration 0023 admin console.

| Condition | Action |
|-----------|--------|
| Bayesian avg drops below 3.0 | Public "Under review" label on vendor profile · vendor notified · HQ review queue |
| 2+ vendor-initiated cancellations in 90 days | Temporary suspension + HQ review |
| Ghost detection: confirmed booking + vendor silent 7 days before event | HQ alert · "at-risk" marker on vendor profile until resolved |
| Fake review flag submitted by vendor | HQ adjudication queue |
| Suspicious review pattern (same IP, new accounts, identical text) | HQ adjudication queue |

### Owner sign-off required

- Permanent removal of a vendor from the platform
- Lifetime ban from re-registration

### Vendor-facing consequences

Vendors receive an email notification (via iteration 0028 email system) whenever a threshold action affects them:
- "Under review" label applied → email: reason + what they can do + appeal path via Help Center (iteration 0029)
- Temporary suspension → email: reason + duration + appeal path
- Fake review flag: the outcome of HQ adjudication (kept or removed) → email to both parties

---

## 10. Vendor self-view dashboard (iteration 0022)

Vendors see their own performance metrics in the vendor dashboard. Knowing the metric creates the incentive to improve it.

### Stats panel (vendor-facing)

| Metric | Description |
|--------|-------------|
| Response rate | % of inquiries replied to within 48h — last 90 days |
| Average reply time | Median time from inquiry to first reply — last 90 days |
| Review score | Bayesian average + raw average shown side by side, with review count |
| Booking completion rate | % of confirmed bookings that completed |
| Inquiry-to-booking rate | % of inquiries that became confirmed bookings |
| Profile completeness | % score with a breakdown of what's missing |
| Quality score trend | 30-day rolling chart of their quality_score |
| Experience badge | Current badge + how many more bookings until next tier |

Vendors also see: "Here is how you compare to the top vendors in your category (anonymous benchmark)" — not exact competitor data, just their percentile position.

### Improvement nudges

When a metric is below a threshold, a non-blocking nudge appears:
- Response rate < 70%: "Couples choose vendors who reply quickly. Enable push notifications to reply on the go."
- Profile completeness < 70%: "Profiles with more photos get 3× more inquiries. Add at least 8 photos."
- No reviews yet: "You have [N] completed bookings — remind your couples to leave a review."

---

## 11. Data model — complete

### New tables

```sql
-- Push notification tokens
-- Note: vendor PK is UUID (vendor_profile_id on vendor_profiles table)
vendor_push_tokens (
  id                    uuid primary key default gen_random_uuid(),
  vendor_profile_id     uuid not null references vendor_profiles(vendor_profile_id) on delete cascade,
  token                 text not null,
  platform              text not null check (platform in ('android', 'ios', 'web')),
  last_registered_at    timestamptz default now(),
  is_active             boolean not null default true,
  unique (vendor_profile_id, token)
);

-- Vendor-to-vendor recommendations
-- Named vendor_partnerships (not vendor_recommendations — that name is taken by couple→vendor recs)
vendor_partnerships (
  id                          uuid primary key default gen_random_uuid(),
  recommending_vendor_id      uuid not null references vendor_profiles(vendor_profile_id),
  recommended_vendor_id       uuid not null references vendor_profiles(vendor_profile_id),
  relationship_type           text not null check (relationship_type in (
                                'accredited', 'sponsored_included',
                                'sponsored_discounted', 'general'
                              )),
  additional_fee_centavos     integer,    -- null = unknown; 0 = included; positive = surcharge
  discount_pct                smallint,   -- populated for sponsored_discounted only
  covered_plan_groups         text[],     -- which plan-group categories this covers
  is_active                   boolean not null default true,
  admin_verified              boolean not null default false,
  created_at                  timestamptz default now(),
  check (recommending_vendor_id <> recommended_vendor_id)
);

-- Precomputed vendor performance stats
vendor_activity_stats (
  vendor_profile_id           uuid primary key references vendor_profiles(vendor_profile_id) on delete cascade,
  -- Responsiveness
  avg_response_minutes        integer,
  response_rate_pct           smallint,         -- 0–100: % threads replied within 48h
  -- Reliability
  booking_completion_rate_pct smallint,         -- % of confirmed bookings that completed
  vendor_cancellation_count   smallint,         -- vendor-initiated cancellations, 90-day rolling
  -- Conversion
  inquiry_to_booking_pct      smallint,         -- % inquiries → confirmed booking
  -- Volume
  finalized_booking_count     integer default 0,
  -- Reviews (mirrored from vendor_reviews for fast access)
  review_avg_raw              numeric(3,2),
  review_avg_bayesian         numeric(3,2),
  review_count                integer default 0,
  -- Engagement
  last_active_at              timestamptz,
  profile_completeness_pct    smallint,
  -- Scores
  quality_score               smallint,         -- 0–100: search ranking signal
  couple_trust_score          smallint,         -- 0–100: public-facing score
  platform_health_score       smallint,         -- 0–100: internal HQ score
  updated_at                  timestamptz default now()
);
-- Note: uses current_vendor_profile_ids() RLS helper (defined in 20260821000000_vendor_role_aware_rls.sql)
-- NOT current_vendor_ids() — that returns team-member UUIDs, not vendor profile IDs
```

### Altered tables

```sql
-- vendor_reviews already has these columns (shipped in earlier migration):
--   rating_communication   smallint  (1–5)
--   rating_quality         smallint  (1–5)
--   rating_value           smallint  (1–5)
--   rating_on_time         smallint  (1 or 5; captured as binary in UI: on-time=5, late=1)
--   vendor_reply           text
--   vendor_reply_at        timestamptz
-- NO ALTER needed — these exist under the actual shipped column names.

-- Add push deduplication to chat threads (SHIPPED PR #1650)
alter table chat_threads
  add column if not exists last_push_notified_at  timestamptz;
-- Note: table is chat_threads (not inquiry_threads)

-- Future gap: avg_response_minutes is currently stubbed at 0.
-- To fix: add vendor_first_reply_at timestamptz to chat_threads
-- (stamp when vendor sends first message in a thread; compute median across threads)
-- alter table chat_threads add column if not exists vendor_first_reply_at timestamptz;
```

### Update triggers (via after() / waitUntil — no cron)

| Triggering event | Fields updated |
|-----------------|---------------|
| New review submitted | `review_avg_raw`, `review_avg_bayesian`, `review_count`, `couple_trust_score`, `quality_score` |
| Vendor sends first reply to a thread | `avg_response_minutes`, `response_rate_pct`, `couple_trust_score`, `quality_score` |
| Booking reaches `completed` status | `finalized_booking_count`, `booking_completion_rate_pct`, `inquiry_to_booking_pct`, `couple_trust_score`, `platform_health_score` |
| Vendor-initiated booking cancellation | `vendor_cancellation_count`, `couple_trust_score`, `platform_health_score` |
| Vendor login | `last_active_at`, `quality_score`, `platform_health_score` |
| Profile updated | `profile_completeness_pct`, `platform_health_score` |
| Referral completes (new vendor / couple attributed) | `platform_health_score` |

---

## 12. Build sequence

| Step | What to build | File |
|------|--------------|------|
| 1 | Migration: `vendor_push_tokens` + `vendor_partnerships` + `vendor_activity_stats` (**SHIPPED PR #1650**) | `20270110320014–16_vendor_*.sql` |
| 2 | Migration ALTER: `chat_threads.last_push_notified_at` (**SHIPPED PR #1650**) · `vendor_reviews` aspect columns already exist as `rating_communication/rating_quality/rating_value/vendor_reply` — no ALTER needed | `20270110320017_chat_threads_push_dedup.sql` |
| 3 | `/api/notify` push route — dedup + token lookup + stub send (**SHIPPED PR #1652**); Supabase webhook config = owner action | `app/api/notify/route.ts` |
| 4 | Push token registration: PWA service worker Web Push subscription + Capacitor plugin setup | `apps/web/public/sw.js` + `apps/mobile/` |
| 5 | `/api/notify` route: dedup check + token lookup + FCM/APNs/WebPush dispatch | `app/api/notify/route.ts` (new) |
| 6 | `lib/vendor-activity.ts` — score recomputation functions (**SHIPPED PR #1653**); avg_response_minutes stubbed at 0 until `chat_threads.vendor_first_reply_at` migration | `lib/vendor-activity.ts` |
| 7 | Migration: `chat_threads.vendor_first_reply_at` + wire into vendor-activity.ts to unblock accurate response-time scoring | New migration |
| 8 | Quality score slot in Explore search soft-rank | `app/dashboard/[eventId]/explore/` |
| 9 | Recommendation badges + soft-rank in Explore search results | Same |
| 10 | HQ verification queue for `vendor_recommendations` (admin console, iteration 0023) | `app/admin/vendor-recommendations/` |
| 11 | Vendor dashboard stats panel (response rate, review avg, quality score trend, etc.) | `app/vendor-dashboard/` |
| 12 | Review aspect rating UI (couple side, post-event review flow) | `app/dashboard/[eventId]/vendors/[id]/review/` |
| 13 | Vendor review response UI (vendor dashboard, per-review reply) | `app/vendor-dashboard/reviews/` |
| 14 | HQ adjudication queue for fake review flags (admin console, iteration 0023) | `app/admin/review-flags/` |
| 15 | Vendor improvement nudges in dashboard (low response rate, profile completeness) | `app/vendor-dashboard/` |
| 16 | At-risk labels on public vendor search cards | `app/dashboard/[eventId]/explore/` |
| 17 | Threshold action emails via Resend (iteration 0028 email system) | New email templates |
