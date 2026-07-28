# End-to-End Test Script — 5 test accounts

> Written 2026-07-27. Grounded in shipped code at `origin/main`, not the spec corpus.
> Target: **production** (`setnayan-prod` · njrupjnvkjkitfctetvi) — the only Supabase project.
>
> **§1–§9 are the happy path** — one couple, one vendor, one purchase, everything going right.
> **§10–§14 are the parts that actually find bugs** — flags, caps, compliance, cross-feature
> collisions, security. If you only have one session, read **§10 first** (a dark feature flag
> explains "it doesn't work" far more often than a defect does), then run **§7** and **§13.1**.

---

## 0 · Setup

### Accounts

All five exist, email-confirmed, password `12345`.

| Account | Role in this script | Why |
|---|---|---|
| testnayan1@test.com | **Couple A** — the main customer | Creates the event, buys SKUs, sends inquiries |
| testnayan2@test.com | **Vendor A** — goes fully verified | The vendor under test |
| testnayan3@test.com | **Vendor B** — stays free + unverified | Control: proves what unverified *can't* do |
| testnayan4@test.com | **Couple B** | Control: proves account isolation (RLS) |
| testnayan5@test.com | **Guest** | Guest-side landing page / RSVP |
| iscasasolaii@gmail.com | **Admin** (your own account) | `is_internal = TRUE` → the only one who can reach `/admin` |

No DB setup needed to make the vendors vendors. All five were created as `account_type = 'customer'`, and
`/open-shop` **self-heals customer → vendor** on first shop creation
(`app/open-shop/actions.ts:145`). Testing that self-heal is itself worth a checkbox.

### Four ground rules — read before you click anything

1. **Never test a paywall on your own account.** `iscasasolaii@gmail.com` is `is_internal = TRUE`, and
   `eventSkuActive()` returns `true` for **every SKU** on an internal-hosted event
   (`lib/entitlements.ts:632`). Every gate silently passes. Same for founder seats
   (`:637`). This is the single biggest way to get a false green.
2. **`@test.com` inboxes don't exist.** Every Resend email — payment instructions, RSVP,
   vendor status change — will fail to deliver. Verify state in-app or in SQL, never by
   waiting for an email.
3. **This is production.** Orders you create are real rows; approving one issues a receipt,
   fires the referral hook, and schedules payouts. Use the ₱100 SKU
   (`PAPIC_CAMERA_MINI_DAY` · "Papic One") for repeat runs. Cleanup SQL is at the bottom.
4. **Use two browsers, not two tabs.** Sessions are cookie-based. Couple in normal Chrome,
   vendor in a private window, admin in a third profile. Otherwise you'll keep logging
   each other out.

### Current baseline (checked 2026-07-27)

1 vendor profile total · **0 verified** · 2 events · **0 orders** · 15 active SKUs.
The marketplace is effectively empty, so your test vendors will be trivially easy to spot.

---

## 1 · Couple A — profile → event

Browser 1. Log in as **testnayan1@test.com**.

- [ ] **1.1** Log in at `/login`. Lands on `/dashboard`.
- [ ] **1.2** `/dashboard/profile` — fill display name, photo, contact. Save.
- [ ] **1.3** `/dashboard/create-event` — create a **wedding**. Give it a date ~6 months out.
      *(Wedding is the richest surface; other types unlock fewer tiles.)*
- [ ] **1.4** Land on `/dashboard/[eventId]`. Note the eventId from the URL — you'll need it.
- [ ] **1.5** `/dashboard/[eventId]/details` — venue, pax, ceremony type. Save.
- [ ] **1.6** `/dashboard/[eventId]/guests` — add 3–5 guests. One with a real email you control
      *(so you can actually receive one invite and test the guest link)*.
- [ ] **1.7** `/dashboard/[eventId]/studio` — **screenshot this page.** This is your paywall
      baseline. Every paid tile should read locked / "Get this". You'll compare against it in Part 6.

**Expected:** every paid Studio tile is dark. If any paid tile is already unlocked, stop —
you're on an internal or founder-seat account, or a promo free window is live. Check:

```sql
select u.email, u.is_internal, e.event_id
from public.events e join public.users u on u.user_id = e.created_by
where u.email = 'testnayan1@test.com';
```

`is_internal` must be `false`.

---

## 2 · Vendor A — shop → service cards → verification

Browser 2 (private). Log in as **testnayan2@test.com**.

- [ ] **2.1** Go to `/open-shop`. Fill business name, category, city, **logo** (mandatory), tagline.
- [ ] **2.2** Submit. Confirm you're redirected to `/vendor-dashboard/shop`.
- [ ] **2.3** Confirm the self-heal fired:

```sql
select email, account_type from public.users where email = 'testnayan2@test.com';
```

Expect `account_type = 'vendor'` — it was `customer` a minute ago.

- [ ] **2.4** `/vendor-dashboard/profile` — complete the profile. Add portfolio images,
      service areas, event types.
- [ ] **2.5** `/vendor-dashboard/services` → `new/[category]` — create **exactly 2 service cards**
      with real prices and inclusions. These are what couples see and inquire against.
      **Do not try for 3.** `servicesPerLeaf = 2` on both the `free` *and* `verified` tiers
      (`lib/vendor-tier-caps.ts:186,41`) — 3 requires a paid Solo subscription. A blocked
      third card is the cap working, not a bug.
- [ ] **2.5b** *(cap probe)* Now **try** to add a 3rd card. Expect a clean upgrade prompt,
      not a crash or a silent failure. **Note which it is** — a silent failure here is a real defect.
- [ ] **2.6** `/vendor-dashboard/packages` — build one package.
- [ ] **2.7** Check visibility *before* verification:

```sql
select business_name, public_visibility, verification_state, is_published
from public.vendor_profiles where business_name ilike '%<your test business>%';
```

Expect `public_visibility` = `hidden` (or `coming_soon`), `verification_state` = `unverified`.

- [ ] **2.8** **Now confirm the vendor is NOT in the marketplace.** Open `/explore` in
      Browser 1 (as Couple A). Your vendor must not appear. `/explore` filters on
      `public_visibility` ∈ `PUBLIC_SURFACE_VISIBILITIES` (`app/explore/page.tsx:1406`) —
      `hidden` is excluded.
- [ ] **2.9** `/vendor-dashboard/verify` — fill the verification application (business docs,
      IDs, proof of operation). **Submit.**
- [ ] **2.10** Confirm submission flipped state but *not* visibility:

```sql
select business_name, public_visibility, verification_state
from public.vendor_profiles where business_name ilike '%<your test business>%';
```

Expect `verification_state = 'pending_review'`, `public_visibility` **unchanged**.
This is the vendor-side mirror of the money question: *submitting ≠ being granted.*

---

## 3 · Vendor B — the control

Browser 2, log out. Log in as **testnayan3@test.com**.

- [ ] **3.1** `/open-shop` — create a second shop, different category and city.
- [ ] **3.2** Add one service card.
- [ ] **3.3** **Do not** submit verification. Leave it `unverified`.

Vendor B sits on the **`free` tier**, which is far more restricted than "unverified" suggests
(`lib/vendor-tier-caps.ts:183`):

| Cap | `free` (Vendor B) | `verified` (Vendor A, still ₱0) |
|---|---|---|
| `marketplaceSearchable` | **false** | true |
| `nameMode` | **hidden** (anonymized placeholder) | true name |
| `chat` | **'none'** | 'chat' |
| `inAppCustomersPerWeek` | **0** | 10 |
| `serviceRadiusKm` | **0** | 20 |

Two consequences my earlier draft got wrong:

1. **Discovery has two independent gates, not one.** `public_visibility` (admin-controlled) **and**
   `marketplaceSearchable` (tier-controlled). Vendor B fails the second one regardless of what
   the admin sets, so "not in `/explore`" is expected for *two* separate reasons.
2. ⚠ **There is a genuine contradiction in the code here — this is a real test, not a formality.**
   The caps table says `free.chat = 'none'` and `canAcceptInAppInquiries(free)` returns **false**
   (`:552`), but the send path had its free-tier gate **removed** on 2026-07-24
   (`lib/chat-send.ts:216`). So a free vendor may be unable to *receive* an inquiry while still
   being able to *reply* in an existing thread. **Record which gate actually wins** — see §11.3.

---

## 4 · Admin — verification approval

Browser 3. Log in as **iscasasolaii@gmail.com**.

- [ ] **4.1** `/admin/verify` — Vendor A's application should be in the queue with an SLA date
      (5 business days out).
- [ ] **4.2** Review the submitted docs. **Approve.**
- [ ] **4.3** Confirm both columns moved together:

```sql
select business_name, public_visibility, verification_state, last_verified_at, next_renewal_due_at
from public.vendor_profiles where verification_state = 'verified';
```

Expect `verification_state = 'verified'` **and** `public_visibility = 'verified'`, with
`last_verified_at` + `next_renewal_due_at` stamped. The approve path advances both so the
dashboard and the marketplace can't disagree (`app/admin/verify/actions.ts:349-357`).

- [ ] **4.4** Check the audit trail — a `vendor_tier_history` row should exist for the transition.

---

## 5 · Discovery — being seen

Browser 1, as **Couple A**.

- [ ] **5.1** `/explore` — Vendor A now appears. Vendor B does too (if `coming_soon`).
- [ ] **5.2** Toggle **"Verified only"**. Vendor A stays, **Vendor B disappears**
      (`allowedVisibilities` narrows to `['verified']` · `app/explore/page.tsx:1358`).
- [ ] **5.3** Filter by Vendor A's category and city — still found.
      ⚠ **Set Vendor A's HQ city to the same city as Couple A's event.** The `verified` tier is
      capped at `serviceRadiusKm = 20` (`lib/vendor-tier-caps.ts:40`). A vendor further than 20 km
      from the search origin is *correctly* filtered out — testing across cities produces a
      convincing false bug. 50 km needs Pro; 100 km needs Enterprise.
- [ ] **5.4** Open `/v/[slug]` — the public vendor page. Service cards, packages, logo,
      portfolio all render.
- [ ] **5.5** `/explore/compare` — add both vendors, compare.
- [ ] **5.6** Log out entirely and open `/v/[slug]` in a clean window. A logged-out visitor
      must see the public page. This is the real "seen by users" test.

---

## 6 · Inquiry → conversation → booking → completion

The full loop. Couple A in Browser 1, Vendor A in Browser 2.

- [ ] **6.1** *(Couple)* From `/v/[slug]` or `/explore`, send an **inquiry** — date, pax, budget, message.
- [ ] **6.2** *(Vendor)* `/vendor-dashboard/messages` — the inquiry appears as `pending`.
      Note the couple's contact details are **masked** at this stage (`lib/inquiry-mask.ts`).
- [ ] **6.3** *(Vendor)* **Accept** the inquiry. `chat_inquiry_status` → `accepted`.
- [ ] **6.4** Confirm:

```sql
select status, created_at from public.chat_inquiries order by created_at desc limit 5;
```

- [ ] **6.5** *(Both)* Exchange 3–4 messages. Confirm real-time delivery both directions.
- [ ] **6.6** **Try to send a phone number or email in chat.** The off-platform-contact filter
      should block it (shipped #3606). Confirm the block fires and lands in `/admin/chat-flags`.
- [ ] **6.7** *(Vendor)* `/vendor-dashboard/proposals` — build and send a **proposal** with
      pricing and a payment schedule. Thread stage → `quoted`.
- [ ] **6.8** *(Couple)* `/dashboard/[eventId]/messages/[threadId]` — read the proposal. The
      auto-reader should offer inline **accept / revise / reject**. Accept it.
- [ ] **6.9** *(Couple)* `/dashboard/[eventId]/vendors` — the vendor should now be attached
      to the event. Move `vendor_status`: `considering` → `shortlisted` → `contracted`.
- [ ] **6.10** *(Vendor)* `/vendor-dashboard/contracts/new` — issue a contract. Both parties sign.
- [ ] **6.11** *(Couple)* Log a payment milestone at `/dashboard/[eventId]/budget`.
      `vendor_status` → `deposit_paid`.
- [ ] **6.12** *(Vendor)* `/vendor-dashboard/clients/[eventId]` — confirm the vendor can now see
      the event workspace: production sheet, mood board, seat plan.
- [ ] **6.13** Mark **delivered** → **complete**. Thread stage → `delivered`,
      `vendor_status` → `complete`.
- [ ] **6.14** *(Couple)* `/dashboard/[eventId]/vendors/[vendorId]/review` — leave a review.
- [ ] **6.15** Confirm the review lands on `/v/[slug]` and moves `avg_rating_overall`.
- [ ] **6.16** *(Admin)* `/admin/completions` — the completed booking appears.

### 6b · Isolation control

- [ ] **6.17** Log in as **testnayan4@test.com** (Couple B). Create a throwaway event.
      Try to open Couple A's `/dashboard/[eventIdA]` directly by URL.
      **Must be denied.** If Couple B can read Couple A's event, that's an RLS defect — stop and report it.

---

## 7 · ★ THE MONEY TEST — does a SKU activate on submission or on approval?

**This is the headline question, and the code already answers it: approval, not submission.**
Part 7 is you confirming the code does what it says.

### What the code does

There are **two different readers**, and the distinction is the whole answer:

| Reader | Counts a `submitted` order? | What it drives |
|---|---|---|
| `checkOrderOwnership()` | **Yes** | Buy CTAs — stops you buying the same thing twice |
| `checkOrderActive()` | **No** — `paid` \| `fulfilled` only | **The actual feature gate** |

`ACTIVE_STATUSES = ['paid','fulfilled']` — `lib/entitlements.ts:51`.

And `activateOrderSku()` — the function that provisions every side effect (Papic seats,
Panood cameras, the AI flag, monogram credits) — is called from **exactly one place in the
entire codebase**: `app/admin/payments/actions.ts:405`. Nowhere else. It's guarded by:

```
shouldProvisionOnApproval({ promoteOrder, reconciledToPaid })
  = promoteOrder && reconciledToPaid          // lib/orders.ts:270
```

So both must be true: the admin ticked **promote to paid**, *and* the matched payments fully
cover the amount owed. A ₱1 payment against a ₱1,499 order does **not** provision.

### The test

- [ ] **7.1** *(Couple A)* `/dashboard/[eventId]/studio` — pick a SKU with an obvious
      on/off state. **3D Plan** (`SEATING_3D` ₱2,999) or **Couple Website PRO**
      (`COUPLE_WEBSITE_PRO` ₱3,500) are the clearest. Click buy.
- [ ] **7.2** Order created. Note the **reference code** (`SN` + 8 chars) and the order ID.
- [ ] **7.3** Confirm the order is *not* active:

```sql
select order_id, service_key, status, amount_php, reference_code
from public.orders order by created_at desc limit 3;
```

Expect `status = 'submitted'` or `'awaiting_payment'`. **Not** `paid`.

- [ ] **7.4** ★ **Go back to `/dashboard/[eventId]/studio`.** Compare against your 1.7 screenshot.
      **Expected — and this is the subtle part:**
      - The **buy CTA changes** (no longer offers a second purchase) — that's `checkOrderOwnership`
      - The **feature is still LOCKED** — that's `checkOrderActive`
- [ ] **7.5** Open the feature route directly by URL (e.g. `/dashboard/[eventId]/seating/lab`).
      **Must still be gated.** If it opens, the gate is reading ownership instead of active —
      that's a real money defect, report it.
- [ ] **7.6** Submit payment proof (upload any screenshot) at `/dashboard/[eventId]/orders/[orderId]`.
- [ ] **7.7** ★ **Re-check the Studio page. STILL LOCKED.** Submitting proof changes nothing about
      access — it only queues the payment for review. **This is the answer to your question.**

### 7b · Partial-payment guard

- [ ] **7.8** *(Admin)* `/admin/payments` — find the pending payment. Record an amount
      **less than** the order total (e.g. ₱100 against ₱2,999). Approve it.
- [ ] **7.9** Expect the shortfall notice: *"payment matched, order not promoted — ₱X short."*
- [ ] **7.10** Confirm:

```sql
select o.status as order_status, p.status as payment_status, p.amount_php
from public.orders o join public.payments p on p.order_id = o.order_id
order by o.created_at desc limit 3;
```

Expect `payment_status = 'matched'` but `order_status` **still not `paid`**.

- [ ] **7.11** ★ *(Couple)* Studio page — **still locked.** A matched-but-short payment must not
      unlock. (This exact bug shipped once and was fixed — the guard is worth re-testing.)

### 7c · Full approval — the unlock

- [ ] **7.12** *(Admin)* Record the **remaining balance** and approve with
      **"promote order to paid" checked**.
- [ ] **7.13** Confirm:

```sql
select order_id, service_key, status from public.orders order by created_at desc limit 3;
```

Expect `status = 'paid'`.

- [ ] **7.14** ★ *(Couple)* Reload `/dashboard/[eventId]/studio`. **The tile is now live.**
      Open the feature route — it works.
- [ ] **7.15** Confirm the side effects fired: a receipt at `/receipts/[receiptId]`, and for
      seat-based SKUs (Papic/Panood) the seat rows were provisioned.
- [ ] **7.16** *(Admin)* `/admin/money` and `/admin/receipts` — the order and receipt appear.

### 7d · The reversal

- [ ] **7.17** *(Admin)* Refund or cancel the order.
- [ ] **7.18** ★ *(Couple)* The feature **goes dark again** — `deactivateOrderSku` re-derives
      ownership and clears the entitlement. `RELINQUISHED_STATUSES` = `cancelled` · `refunded` · `lapsed`.

### ⚠ Six bypasses that will fake a pass — all verified clean 2026-07-27

If a paid feature is unlocked when you expect it dark, check these **before** filing a bug.
Each one legitimately grants SKUs for free. I checked all six against prod today:

| Bypass | Where | Prod state today |
|---|---|---|
| Internal account | `entitlements.ts:632` | ✅ only `iscasasolaii@gmail.com` |
| Founder seat | `entitlements.ts:637` | ✅ 1 seat — the owner's, no test account |
| Comp grant | `entitlements.ts:624` | ✅ `comp_grants` = **0 rows** |
| Promo free window | `entitlements.ts:620` | ✅ `promo_free_windows` = **0 rows** |
| Pilot free mode | `sku-catalog.ts:480` | ✅ **OFF** — banner absent from live site |
| Launch promo (16 SKUs) | `sku-catalog.ts:81` | ✅ **dead code** — zero live callers |

The last two are worth understanding, because both *look* alive:

- `NEXT_PUBLIC_PILOT_MODE_FREE_UNTIL` **is set in the prod env**, and its docstring claims it makes
  "EVERY paid SKU resolve to ₱0". It doesn't. Its only live caller is
  `app/_components/pilot-mode-banner.tsx` — a **banner**. The live V2 charge path
  (`order-charge-math.ts` / `v2-catalog.ts`) never consults it. The banner isn't rendering on
  www.setnayan.com, so the flag is currently a past date or false.
- `LAUNCH_PROMO_SKU_CODES` (16 SKUs free through 2027-01-30) is keyed on **legacy lowercase**
  codes (`vendor_pro_weekly`, `panood_daily_broadcast`) that no longer exist in the live V2
  catalog (`SEATING_3D`, `COUPLE_WEBSITE_PRO`). `getEffectivePriceCentavos` has **no callers**.

> 🐛 **Worth filing on its own:** if anyone ever sets `PILOT_MODE_FREE_UNTIL` to a future date,
> the site shows an "everything is free" banner while checkout charges full price. The banner
> and the charge path disagree. Not blocking your test — but it's a live trust bug waiting on
> one env change.

```sql
select u.email, u.is_internal,
       (select count(*) from public.comp_grants g
         where g.user_id = u.user_id and g.revoked_at is null) as comp_grants
from public.users u where u.email like 'testnayan%@test.com';
```

All should be `is_internal = false`, `comp_grants = 0`.

---

## 8 · Guest side

- [ ] **8.1** *(Couple A)* `/dashboard/[eventId]/website` — build the guest site. Launch it.
- [ ] **8.2** `/dashboard/[eventId]/guests/invite` — send an invite to a real inbox you control.
- [ ] **8.3** Open the guest link logged out. RSVP. Confirm it lands in the couple's guest list.
- [ ] **8.4** Log in as **testnayan5@test.com** and join via `/join/[eventId]`.
- [ ] **8.5** Test `/[slug]/find-my-table`, `/[slug]/hub`.

---

## 9 · Cleanup

Deleting the auth users cascades to `public.users` and most child rows. Vendor profiles and
orders may need explicit deletion first — and note `/admin` "Delete user" is **known broken**
for users with activity (41 `NO ACTION` FKs), so use SQL.

```sql
-- inspect first
select email from auth.users where email like 'testnayan%@test.com';
```

```bash
psql "$SUPABASE_DB_URL" -c "delete from auth.users where email like 'testnayan%@test.com';"
```

If that errors on a foreign key, delete the vendor profiles and orders for those users first,
then retry.

---

## 10 · ★ Feature flags — read this before filing ANY "feature doesn't work" bug

**Nearly every flag in this codebase defaults OFF.** The idiom is `process.env.X === 'true'`,
which is `false` when unset. Exactly one flag defaults ON: `seating-3d-flag.ts` (`!== 'false'`).

So a dark feature is the **overwhelmingly likely** explanation for "it didn't do anything" —
far more likely than a defect. Check the flag first, every time.

### Present in the production env (checked 2026-07-27 via `vercel env ls production`)

Values are encrypted, so **presence is necessary but not sufficient** — a flag can be set to
`false`. But an *absent* flag is definitively off.

`CHAT_CONTACT_FILTER_ENABLED` · `CHAT_NEGOTIATION_V1` · `INQUIRY_GATE_ENABLED` ·
`BOOKING_FEE_ENABLED` · `PAPIC_GAMES_V1` · `COORDINATOR_CONSENT_GATE_ENABLED` ·
`COORDINATOR_P3_ENABLED` · `VENDOR_AUTOREPLY_V1` · `VENDOR_FAVORITES_SUBSCRIPTION_GATE` ·
`MONOGRAM_STUDIO_V2` · `PANOOD_STREAMING_ENABLED` · `ONBOARDING_V2_BRIEF_ENABLED` ·
`DEPENDENT_PEOPLE` · `DEVICE_FINGERPRINT_ENABLED` · `LEAD_TRUST_BADGE_ENABLED` ·
`LEAD_TOKEN_HOLD_ENABLED` · `SMART_SORT_ENABLED` · `RELATIONSHIP_WORKSPACE_ENABLED` ·
`PAYMENT_GATED_LOCK_ENABLED` · `LIFE_STORY` · `SUITE` · `LIVE_STUDIO_ROAM_ENABLED` ·
`SETNAYAN_AI_PAYWALL_ENABLED` · `WEBSITE_PHASES_ENABLED` · `PROMO_FREE_WINDOWS_ENABLED` ·
`VENDOR_FREE_BOOKING_CAP` · `VENDOR_ADDON_TIERED_PRICING` · `REGISTER_GATES_ENABLED` ·
`EXPERIENCE_QUIZ_ENABLED` · `ANON_ONBOARDING_ENABLED` · `SCHEDULE_ROS_P2_ENABLED` ·
`PLAN3D_BOOTH_ADS` · `PLAN3D_DEMO_ADS` · `PABUYA_PUBLIC_ROUTE_ENABLED` ·
`PEOPLE_CONNECTIONS` · `PERSON_LIFE_STORIES`

- [ ] **10.1** Steps **6.6** (contact filter) and **6.8** (negotiation auto-reader) both depend on
      flags in the list above. If either does nothing, confirm the flag's *value* before filing.

### Absent from prod → **dark. Do not test these; there is nothing to find.**

`BOOTH_STUDIO_ENABLED` · `PACKAGE_AUTHORING` · `PACKAGE_CREDIT` · `PLAUSIBILITY_SCANNER_ENABLED` ·
`PUBLIC_API_ENABLED` · `VENDOR_AI_LADDER` · `VENDOR_SEO_TIER_GATE` · `FEATURE_ACCOUNT_AUTOSURFACE` ·
`SETNAYAN_AI_COCKPIT` · `GUEST_COLUMNS_ENABLED` · `BUDGET_BUILD_ENABLED` · `VENDOR_VOICE_MATCH` ·
`VENDOR_LAUNCH_FREE_WINDOW` · `VENDOR_ADDON_FIRST5_FREE` · `FIGURE_CHIBI` · `BAZI_BIRTHDATA` ·
`ACCOUNT_FACE_PROFILE_ENABLED` · `NAMED_CALENDARS_ENABLED` · `PANOOD_CAM_ANON_ENABLED` ·
`PAPIC_POOL` · `PAPIC_POOL_BAR`

### Gated by SUBSCRIPTION, not by a flag — don't go looking for a switch

The **vendor day-of specializations** (Song desk · Script & cues · Floor command) have **no
feature flag at all**. They are gated by `lib/vendor-specialization-gate.ts`
(`SPECIALIZATION_MIN_TIER = 'solo'`) × the vendor's category × booked × dated today. A
"specialization doesn't show" report is one of those four, in that order — never a dark flag.
See **§15**. (`floor_command` for coordinators is genuinely unbuilt: a held-but-unbuilt set
renders a named "coming soon" plate, which is correct, not a bug.)

---

## 11 · Restrictions — the caps that actually bind

My §1–§9 tested one happy path. These are the ~60 gate/cap modules it walked straight past.

### 11.1 Vendor tier ladder

| Cap | free | verified (₱0) | solo | pro | enterprise |
|---|---|---|---|---|---|
| `marketplaceSearchable` | ✗ | ✓ | ✓ | ✓ | ✓ |
| `servicesPerLeaf` | 2 | 2 | 3 | 5 | ∞ |
| `serviceRadiusKm` | 0 | 20 | 20 | 50 | 100 |
| `inAppCustomersPerWeek` | 0 | 10 | ∞ | ∞ | ∞ |
| `nameMode` | hidden | true | true | true | true |
| `chat` | none | chat | chat | chat | chat |

- [ ] **11.1a** ★ **The `verified` tier is free and unlocks nearly everything that matters** —
      searchable, true name, chat, 10 leads/week. Confirm a ₱0 verified vendor is genuinely
      usable. If verification alone doesn't make a vendor viable, the free→paid funnel has no
      first step.
- [ ] **11.1b** Vendor A on `verified`: send **11 inquiries** from different accounts in one week.
      The 11th should hit the `inAppCustomersPerWeek = 10` cap. Confirm the cap message names
      the upgrade, and confirm the counter is a rolling week, not a calendar week.

### 11.2 Event + capture caps

- [ ] **11.2a** **Event creation limit** — one IN-PLANNING event per (account × type × honoree).
      As Couple A, try to create a second wedding for the same couple. Expect a block.
- [ ] **11.2b** **20 LIVE tags per photo** (raised from 10 on 2026-07-23, migration
      `20270916200000`). Tag one photo 21 times. Confirm the 21st is refused and that
      *removed/tombstoned* tags do **not** count toward the cap.
- [ ] **11.2c** **Table-QR fan-out truncation** — a table with more guests than the remaining cap
      alphabetizes by RSVP name and truncates. Confirm the paparazzo sees a warning, not silence.
- [ ] **11.2d** **10-second clip cap** (owner-reversed from 5s on 2026-07-22). Confirm the UI
      enforces it client-side and a longer clip can't be smuggled in.
- [ ] **11.2e** **Untagged-still-delivered** — upload a photo that matches no guest. It must
      still land in the couple's gallery. This one is a product promise, not just a cap.

### 11.3 ★ The contradiction test (free-tier chat)

- [ ] **11.3** As Couple A, send an inquiry to **Vendor B** (free tier). Record precisely:
      - Can the inquiry be **sent** at all? (`canAcceptInAppInquiries(free)` = false says no)
      - If it arrives, can Vendor B **reply**? (`chat-send.ts:216` says yes)
      - Which of `vendor-tier-caps.ts` and `chat-send.ts` actually governs?

      Either answer is a finding. Whichever wins, the *other* file is stale and should be
      reconciled — two modules currently disagree about whether free vendors can talk to couples.

### 11.4 Role restrictions

- [ ] **11.4a** **Coordinator money wall** — a coordinator gets read-parity and
      *propose-not-execute*. Add testnayan5 as coordinator, then try to execute a payment or
      accept a proposal. Must be refused.
- [ ] **11.4b** **Privileged controls on public routes.** The role-surface model is one base page
      skinned per role, which means privileged controls can render on a **public** route. Open a
      vendor/guest public URL logged out and hunt for any admin/owner action that renders.
      **Gating must be server-side** — a hidden button that still works when POSTed is the bug class.
- [ ] **11.4c** **Inquiry masking** — couple contact details stay masked pre-acceptance
      (`lib/inquiry-mask.ts`). Confirm the *unmasked* value isn't sitting in the HTML source or
      the network payload. Look at the response body, not the rendered page.

---

## 12 · Compliance (RA 10173)

Entirely absent from my first draft. `data_privacy_controls` has 18 rows in prod;
`coordinator_access_consents` has 0.

- [ ] **12.1** **Data export** — as Couple A, request a full export from
      `/dashboard/profile` → Privacy & Data. Confirm it completes and actually contains the
      event, guests, photos, and messages. `lib/export-integrity.ts` +
      `export-coverage-guardrail` exist to catch a partial export; verify by inspection, not trust.
- [ ] **12.2** **Soft delete → hard delete.** Run the account-deletion request end to end.
      ⚠ **Known broken:** admin "Delete user" throws for any user with activity (41 `NO ACTION`
      FKs). Expect the failure; confirm it fails *loudly* rather than reporting success.
      `/admin/account-deletions` is the queue.
- [ ] **12.3** **Face-data revocation** — enroll a face, then revoke. Confirm `revoked_at` is
      stamped **and** the vector stops matching. A revocation that leaves the vector live is a
      serious defect.
- [ ] **12.4** **Per-event face scoping** — confirm a face enrolled at Couple A's event never
      auto-tags at Couple B's. Cross-event vector reuse is explicitly forbidden.
- [ ] **12.5** **Cookie consent** — decline non-essential. Confirm analytics stop firing and the
      choice persists 12 months.
- [ ] **12.6** **Marketing consent** (`marketing_share_consents`) — confirm opt-in is genuinely
      opt-in (unticked by default) and that withdrawing it stops the sharing.
- [ ] **12.7** **Coordinator consent gate** (`COORDINATOR_CONSENT_GATE_ENABLED`, flag present) —
      confirm a coordinator can't reach event data before consent is recorded, and that revoking
      consent cuts access immediately.
- [ ] **12.8** **NSFW filter cannot be disabled.** Hunt for any admin toggle that turns it off.
      Finding one is a compliance defect by spec.
- [ ] **12.9** **Geo stripped on outbound shares**, retained on the R2 original. Download a shared
      photo and inspect its EXIF. This is the kind of leak that only shows up in the bytes.
- [ ] **12.10** **Retention** — `lib/retention-sweep.ts` + `vendor-dossier-retention.ts`.
      Confirm nothing auto-deletes photos inside 5 years.
- [ ] **12.11** `/admin/npc-readiness` + `/admin/data-privacy` — walk the board. Per the standing
      default, privacy **documents** rather than **blocks**, so expect approvals to be recorded,
      not enforced as hard gates.

> ⚠ Known gap, don't re-file: the live `/privacy` page omits shipped SPI flows and **denies
> biometrics while face-enrolment is built**. Already logged.

---

## 13 · Cross-feature interactions

The part most likely to hide real bugs, because each feature is fine alone.

### 13.1 ★ Ownership aliases — buying one SKU silently unlocks another

`SKU_OWNERSHIP_ALIASES` (`lib/entitlements.ts:244`):

| Buying this… | …also unlocks |
|---|---|
| `COUPLE_WEBSITE_PRO` | `EDITORIAL_PRO` **and** `STD_PREMIUM_OPENINGS` |
| `ANIMATED_MONOGRAM` | `LIVE_BACKGROUND` |
| any Panood paid SKU | `LIVE_STUDIO` |

- [ ] **13.1a** Buy **only** `COUPLE_WEBSITE_PRO` (₱3,500) and get it approved. Confirm Editorial
      Pro **and** the premium Save-the-Date openings both light up with no second purchase.
- [ ] **13.1b** ★ Now **refund** it. Confirm **all three** go dark together. A partial reversal
      that leaves an alias unlocked is free product — the most likely money bug in this area.

### 13.2 Bundles

Bundle purchases land as a **single** order row, so a naive child-SKU check returns false.
`fetchBundleComponents()` reads `bundle_components` DB-first with a const fallback.

- [ ] **13.2a** Buy a bundle. Confirm **every** child SKU unlocks.
- [ ] **13.2b** Confirm the DB table and the `BUNDLE_CHILD_SKUS` const agree — `lint:entitlement-gates`
      GUARD 2 asserts this, so a mismatch means the guard isn't running.

### 13.3 Order lifecycle edges

- [ ] **13.3a** **Double-buy** — with a `submitted` order open, try to buy the same SKU again.
      `checkOrderOwnership` should prevent it.
- [ ] **13.3b** **7-day expiry** — a `pending_payment` order lapses. Confirm `lapsed` is in
      `RELINQUISHED_STATUSES` and the CTA returns to buyable.
- [ ] **13.3c** **Resubmission** — admin rejects with "needs more proof"
      (`payment_status = 'resubmit_requested'`), couple resubmits against the **same** order_id.
- [ ] **13.3d** **Duplicate approval** — approve the same payment twice. Hooks are documented as
      idempotent; confirm no double-provisioning (2 Papic seat sets, 2 receipts).
- [ ] **13.3e** **Reference-code mismatch** — pay with a wrong/absent reference. Confirm the
      4-tier fuzzy matcher degrades to `unmatched` rather than pairing the wrong order.

### 13.4 Vendor lifecycle edges

- [ ] **13.4a** **Demotion** — admin demotes a verified vendor. Confirm they drop out of
      `/explore` and lose the caps immediately.
- [ ] **13.4b** **Renewal lapse** — `next_renewal_due_at` passes. Confirm the demotion path fires.
- [ ] **13.4c** **Ghosting** (`lib/ghosting.ts`) — leave an accepted inquiry unanswered 48h.
      Confirm the unresponsive flow triggers.
- [ ] **13.4d** **Disputes** — open one at `/dashboard/[eventId]/disputes`, work it through
      `/admin/disputes`.
- [ ] **13.4e** **Self-review gate** (`lib/self-review-gate.ts`) — try to review your own vendor
      profile from a linked account. Must be refused.

### 13.5 Known live defects — **do not file these as new**

| Defect | Symptom you'll see |
|---|---|
| `date-selection` vendor pool always empty | Selects two non-existent columns → `42703` → feature silently dead |
| Admin "Delete user" broken | Throws for any user with activity (41 `NO ACTION` FKs) |
| Ceremony Venue taxonomy tile empty | 0 canonical entries |
| Vendor AI Advanced | An **empty rung** — do not flip the flag |

---

## 14 · Security spot-checks

- [ ] **14.1** ★ **Every new table in `public` ships OPEN.** The default ACL grants `arwdDxtm` to
      `anon` + `authenticated` unless a migration explicitly `REVOKE ALL`s — this was the root
      cause of a 368-table exposure. Spot-check the newest tables with the anon key:

```sql
select table_name from information_schema.role_table_grants
where grantee in ('anon','authenticated') and table_schema='public'
  and privilege_type='SELECT'
order by table_name desc limit 25;
```

- [ ] **14.2** **Horizontal access** — as Couple B, try Couple A's `event_id` on every
      `/dashboard/[eventId]/*` route, not just the landing page. One unguarded sub-route is enough.
- [ ] **14.3** **Vendor cross-tenancy** — as Vendor B, try Vendor A's `vendorProfileId` on
      `/vendor-dashboard/clients/[eventId]`.
- [ ] **14.4** **Guest token scope** — a Papic seat / guest token from Couple A's event must not
      work on Couple B's. Wedding-scoped tokens are a locked constraint.
- [ ] **14.5** **Presign lanes** — R2 presigned URLs shouldn't grant broader access than the
      caller's scope. Listed as still-open in the security handoff.
- [ ] **14.6** **Rate limits** (`lib/rate-limit.ts`, `anon-mint-throttle.ts`) — hammer the anon
      onboarding mint and confirm the throttle engages.

---

## 15 · The host/MC day-of desk — "Script & cues" (PR #3812, merged 2026-07-27)

The first tier-gated **specialization** on the live day-of console. There is **no feature
flag** — do not go hunting in §10 for one. Access is decided entirely by
(paid subscription × vendor category × booked × dated today), so a "nothing shows up"
report is almost always one of those four, in that order.

Route: `/vendor-dashboard/on-the-day/live/[eventId]`. Surface:
`…/live/[eventId]/_components/stage-script/`. Decisions:
`lib/stage-script.ts` (pure, 30 unit tests). Gate: `lib/vendor-specialization-gate.ts`
(`SPECIALIZATION_MIN_TIER = 'solo'`).

### 15.0 Setup — four things must all be true

This is the fiddliest setup in the script; get it wrong and you will "find" a bug that isn't one.

- [ ] **15.0a** A vendor whose `services[]` contains **`host_mc`**. None of the five accounts is
      one by default — add the Host / MC category to Vendor A's shop first.
- [ ] **15.0b** That vendor on a **paid tier** (`tier_state` ≥ `solo`, `tier_expires_at` in the
      future or NULL). Free is the *control*, not the test.
- [ ] **15.0c** **Booked** on Couple A's event (an accepted inquiry through §6).
- [ ] **15.0d** The event **dated today** (PH wall-clock). The console redirects out on any
      other day — that is the gate working, not a defect.
- [ ] **15.0e** The couple has built a **schedule** at `/dashboard/[eventId]/schedule` with:
      at least one **public** block carrying a **note**, one **private** (`is_public = false`)
      block carrying a note, and one **part nested inside** a parent block. Without these the
      desk is correct but shows you nothing interesting.

> ⚠ **Ground rule 1 applies double here.** On `iscasasolaii@gmail.com` every entitlement passes,
> so the paywall below will *always* look unlocked. Test the gate on a `@test.com` vendor or you
> will certify a paywall that isn't there.

### 15.1 ★ The gate — registering a surface must grant nothing

- [ ] **15.1a** **Free host/MC** → sees the **upsell** ("Built for your trade, included from
      Solo up"), **not** the desk. Every other tool on the screen unchanged.
- [ ] **15.1b** **Solo (or higher) host/MC** → sees the desk.
- [ ] **15.1c** **Lapsed** (paid `tier_state`, `tier_expires_at` in the past) → upsell reads
      **"Renew your plan"**, not "See the plans". Generic kit still intact.
- [ ] **15.1d** **Band/DJ vendor** on the same event → gets the **Song desk**, not this one.
      (Both shipped the same day and share one registry file — this proves they didn't cross.)
- [ ] **15.1e** **A category with no specialization** (e.g. caterer) → no specialization section
      at all, and no upsell. That is correct, not a gap.

### 15.2 ★ The privacy invariant — the one that matters

A booked vendor reads the **full** timeline, private blocks included, and this user is holding a
live microphone.

- [ ] **15.2a** The **private** block appears in the running script **with a worded
      "Don't read aloud" badge** — not hidden, not merely a different colour.
- [ ] **15.2b** Its note also appears under **Announcements**, badged the same way.
- [ ] **15.2c** If the private block is the current or next one, the badge shows on the **cue
      card** too.
- [ ] **15.2d** ★ **No guest names anywhere on this surface.** The wedding-party roster that the
      couple's downloadable emcee script prints is deliberately **absent** — a booked vendor
      cannot read `guests`. If you ever see a guest name here, that is a **privacy defect**, file
      it immediately (owner-locked 2026-07-27: "keep them private").
- [ ] **15.2e** ★ **No coordinator broadcasts.** Same reasoning. The coordinator relays to the
      host **in person** — there is no host inbox by design.

### 15.3 Run-state drives the desk, not the clock

- [ ] **15.3a** Nothing advanced yet → "Standing by. Opening: <first block>."
- [ ] **15.3b** Advance the run of show (couple/coordinator side, or the vendor brief) → the cue
      card follows to **"You're on: <block>"** within a refresh.
- [ ] **15.3c** Advance past a block with nothing live → **"Between moments. Next: <block>"** —
      it must not claim something is on.
- [ ] **15.3d** Advance to the end → **"That's a wrap"**, and the **cue card disappears
      entirely** (it has nothing left to say).
- [ ] **15.3e** Leave the wall clock alone and only change `run_state`. The desk must still
      follow — the run-state pointer is the truth, the clock is not.

### 15.4 Running late — the number must not vanish

- [ ] **15.4a** Start a block **later than planned** (`actual_start_at` after `start_at`) →
      header reads **"Running N min behind"**.
- [ ] **15.4b** With the show behind, the next block's planned time is already past → it must
      read **"due N min ago"**, **not** a blank. (The first cut of this hid the negative; a blank
      here is a regression.)
- [ ] **15.4c** On-time start → no drift line, or "on time".

### 15.5 Card order rearranges itself

There is no setting for this and nothing stored — the order is derived every render.

- [ ] **15.5a** Current or next block **has a note** → order is **cue → announcements → script**.
- [ ] **15.5b** Neither has a note → **cue → script → announcements**.
- [ ] **15.5c** Show wrapped → **script → announcements**, no cue card.

### 15.6 Ragged data must not break it

- [ ] **15.6a** **No schedule at all** → an honest sentence naming the couple, not an error, not
      an empty panel, not a spinner.
- [ ] **15.6b** A **part** (child block) renders indented under its parent, in reading order.
- [ ] **15.6c** Blocks with **blank / whitespace-only notes** produce **no** announcement entry.
- [ ] **15.6d** **Done** blocks are dimmed but still present — an emcee scrolls back.

### 15.7 The grantee path

- [ ] **15.7a** A teammate granted day-of access (launcher step 3) opens the same console and
      **also** gets the desk — their entitlement resolves through the **granting vendor's**
      subscription, not their own. A paying vendor's crew must not silently drop to the
      generic kit.

### 15.8 Not built — do not test, do not file

Two features exist **only in the prototype**
(`0022_vendor_dashboard/MC_Desk_Prototype_2026-07-27.html`), drawn dashed and gold:

| Prototype-only | Open question for the owner |
|---|---|
| **My notes** — the host's own cues, pinned to a moment | Do they persist to the host's *next* wedding (a career library) or start clean each time? |
| **Ask the couple** — a question into the existing thread | Is the coordinator copied, given they're the one relaying on the night? |

---

## 16 · The coordinator day-of desk — "Run the floor"

> ⚠ **Rewritten 2026-07-28.** The first version of this section described a
> coordinator surface that was **never merged** — two sessions built one the same
> day and the other shipped. These checks describe what is actually on `main`
> (`46c395839`), which is broader: it gates every panel on the host having
> **shared that area**, per the owner's 2026-07-27 access lock.

Same gate as §15 (no feature flag — subscription × category × booked × today),
**plus** a per-area grant from the host, **plus** a Data Privacy control for the
inbox. Three gates, so "half the panels are missing" is usually correct behaviour.

Surface: `…/live/[eventId]/_components/floor-command/`. Decisions:
`lib/floor-command.ts`.

### 16.0 Setup

- [ ] **16.0a** A vendor whose `services[]` contains **`coordinator`**, on a paid tier,
      booked, event dated today. (Same four-part setup as §15.0.)
- [ ] **16.0b** ★ **Being booked grants NOTHING.** Before the host shares anything, the
      coordinator must see the **"ask the host"** card and **no tools**. That is the
      feature, not a bug.
- [ ] **16.0c** Host approves the requested areas → the matching panels appear. Revoke one
      → that panel closes **the same minute, with no deploy**.
- [ ] **16.0d** For the requests inbox only: approve `coordinator_requests_inbox` in
      `/admin/data-privacy`. Without it that panel shows its closed state.

### 16.1 ★ The schedule updater — the hole this surface exists to close

Before it, the live page mounted `RunOfShowHeader` **without** `canAdvance`, so the
coordinator could watch the running order and not touch it.

- [ ] **16.1a** With a block live, advance it. `run_state` moves.
- [ ] **16.1b** ★ **Cross-surface:** with the emcee's desk (§15) open on a second device
      for the same event, advancing here must move **their** cue card to "You're on:
      <next>". Two browsers. This is the link that makes both desks worth having.
- [ ] **16.1c** The guest "what's happening now" card follows too.
- [ ] **16.1d** **Retime presets** (5/10/15/30) shift the running order without
      hand-editing each block.
- [ ] **16.1e** **Double-tap / race** with the couple's own screen — the RPC is
      single-winner and idempotent, so this must be a benign no-op, never a double-skip.
- [ ] **16.1f** Without the schedule area shared, this panel must be **closed**.

### 16.2 Seat scanner

- [ ] **16.2a** Scan a guest QR → their seat resolves.
- [ ] **16.2b** Scan something that isn't a guest code → a clear "not a guest code"
      outcome, not a crash or a silent nothing.
- [ ] **16.2c** Seating **not published** → the panel says so rather than showing an empty
      scanner.

### 16.3 Requests inbox

- [ ] **16.3a** A different booked supplier files a request → it reaches the coordinator.
- [ ] **16.3b** The supplier sees only their own, read-only; the coordinator triages
      (open → acknowledged → resolved). A plain vendor cannot triage any row, including
      their own.
- [ ] **16.3c** ⚠ **Known gap, not a bug to file:** the panel **links out** to
      `/vendor-dashboard/on-the-day` rather than showing the inbox inline, which navigates
      the coordinator out of the wake-locked console. A follow-up is scoped (see the closed
      PR #3822 for the inline version).

### 16.4 Nothing renders twice

- [ ] **16.4a** **One** timeline (`RunOfShowHeader`) and **one** countdown (`FloorClock`),
      both above the desk from the generic kit. Seeing two of either is the bug.

### 16.5 Degradation

- [ ] **16.5a** No timeline at all → an honest empty state, never an error.
- [ ] **16.5b** Every panel closed (nothing shared) → the desk still renders the ask-card;
      it must not go blank.

---

## 17 · The emcee's activity catalogue (PR #3831)

The host writes his segments down once; the couple ticks what they want; the picks
become timeline blocks. ⚠ **Needs the migration applied** — until `supabase db push`
runs, the tables do not exist and every screen below is correctly invisible.

### 17.1 The host authors his list — `/vendor-dashboard/activities`

- [ ] **17.1a** Add a segment (name · length · where in the day · blurb). It appears in
      the menu with its duration.
- [ ] **17.1b** Edit one in place; reorder with the arrows. Order is the host's own
      professional judgement and drives the order picks land in.
- [ ] **17.1c** ★ **"Stop offering" RETIRES, never deletes.** It moves to "Not offering"
      and can be offered again. A hard delete would cascade past couples' picks away.
- [ ] **17.1d** A retired segment **disappears from the couple's menu** but a couple who
      already picked it keeps it.
- [ ] **17.1e** Another vendor's `activity_id` in a forged form post changes nothing —
      RLS is the boundary, not the form.

### 17.2 The couple picks — on `/dashboard/[eventId]/schedule`

- [ ] **17.2a** ★ **No booked host/MC → the section does not render at all.** Not an empty
      panel, not an advert.
- [ ] **17.2b** Booked host who has written **nothing** → also renders nothing.
- [ ] **17.2c** Tick / untick segments; the "N min chosen" total tracks.

### 17.3 ★ The bridge — picks become the timeline

- [ ] **17.3a** Press "Add N to my timeline" → blocks appear **after everything already
      scheduled**, back to back, in the host's order.
- [ ] **17.3b** ★ **Nothing you already had moves or is overwritten.** Build a timeline by
      hand first, then add picks, and confirm every original block keeps its time.
- [ ] **17.3c** ★ **Press it twice → no duplicates.** Then tick one more and press again →
      only the new one lands.
- [ ] **17.3d** A placed segment shows "on your timeline" and can no longer be unticked —
      delete the block instead.
- [ ] **17.3e** **Empty timeline** → picks land from the event date, not from "now".

### 17.4 ★ The privacy boundary a DB guard already caught once

The picks policies were briefly member-wide, which would have let an **invited guest**
read *and write* the couple's picks. Fixed to couple-scoped before merge — re-check by
hand, because this is the class that keeps recurring:

- [ ] **17.4a** Sign in as **testnayan5 (guest)** on the couple's event. They must **not**
      see the emcee section and must **not** be able to change picks.
- [ ] **17.4b** Sign in as **Couple B** — no access to Couple A's picks at all.
- [ ] **17.4c** The booked host/MC **can** read what was picked from **his own** list, and
      cannot read another vendor's picks on the same event.

---

## Quick answer to the question that started this

**Setnayan apps activate on admin approval, not on submission.**

A couple who has applied and uploaded proof sees the buy button stop offering a second
purchase — but the feature stays dark. It lights up only when an admin approves the payment
**with "promote to paid" checked** *and* the payments fully cover the amount owed. Approving a
short payment marks the payment `matched` and deliberately leaves the order unpaid and the
feature locked.

Steps **7.4**, **7.7**, **7.11** and **7.14** are the four that prove it.
