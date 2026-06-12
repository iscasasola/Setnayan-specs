# V2 Replacement · Next Session Handoff · 2026-05-28

> **Cold-start brief for a fresh Claude Code conversation.** This is the canonical, self-contained scope for actually making the V2 blueprint work on www.setnayan.com. The infrastructure exists (schema in prod, routes deployed) but no V1 surface has been replaced yet. This session's job is to **execute the V1→V2 replacement** so real users see the new behavior.

> Operationalizes [V2_Cutover_Plan_2026-05-28.md](V2_Cutover_Plan_2026-05-28.md) (the architectural lock) and the in-conversation directive from 2026-05-28: *"make sure the blueprint I sent and sql will work · it needs to replace the appropriate changes · also include the pakanta and handshake of vendors to earn tokens."*

---

## Canonical pricing source-of-truth · 2026-05-28 lock

Owner supplied the definitive V2 pricing table 2026-05-28. **These are the ONLY purchasables. No 5/10% commission anywhere.** All other V1 SKUs (concierge_complete · save_the_date_video · monogram_hero_upgrade · ai_*_highlight · pro_widget_schedule · vendor_pro_weekly · all_tools_unlock_annual · tool_*_weekly · paparazzi_3_seats/5_seats/camera_addon · panood_daily_broadcast/annual_streaming · patiktok_setnayan_tiktok/personal_tiktok/cam_bridge_*/video_overage · papic_cam_bridge_* · vendor_verification_*) are NOT in the V2 catalog and need to be retired alongside the `/pricing` page rewrite (Phase 1 of this session).

### Customer-side · 19 individual SKUs in `platform_retail_catalog_v2` + 2 bundles in `platform_package_catalog`

| SKU code | Title | Price | Token Worthy |
|---|---|---|---|
| ANIMATED_MONOGRAM | Animated Monogram | ₱2,499 | ✅ |
| PRO_WEBSITE | Pro Website | ₱2,999 | ✅ |
| CUSTOM_QR_GUEST | Custom QR per Guest | ₱1,499 | |
| TODAYS_FOCUS | Setnayan AI | ₱1,499 | |
| PINOY_MAP_ROUTE | Pinoy Map Route | ₱1,499 | |
| INDOOR_BLUEPRINT | Indoor Blueprint | ₱1,499 | |
| CALL_TIME_ESCALATOR | Call-Time Escalator | ₱1,999 | |
| PANOOD_SYSTEM | Panood | ₱3,499 | ✅ |
| PATIKTOK_COMPILER | Patiktok | ₱2,499 | ✅ |
| PABATI | Pabati | ₱999 | |
| PAKANTA | Pakanta | ₱1,499 | |
| PAPIC_GUEST | Papic Guest | ₱2,999 | ✅ |
| PAPIC_GUEST_STORIES | Papic Guest with Stories | ₱3,499 | ✅ |
| PAPIC_MEDIA_PACK | Papic Guest with Stories + Thank You Video | ₱9,999 | ✅ |
| PAPIC_SEATS | Papic (5 Seats) | ₱2,999 | ✅ |
| SDE | SDE | ₱5,499 | ✅ |
| CAMERA_BRIDGE | Camera Bridge | ₱1,999 | |
| LIVE_WALL | Live Venue Photo Wall + Background | ₱3,499 | ✅ |
| HIGH_RES_ARCHIVE | High Res Archive | ₱2,999/yr | |
| GUIDED_PACK *(bundle)* | Guided Pack | ₱11,999 | ✅ |
| MEDIA_PACK *(bundle)* | Media Pack | ₱16,999 | ✅ |

Notes:
- "Token Worthy" → `is_token_able=TRUE` → eligible for 14-token stacking ladder reward when the consumer service fires `/verify-telemetry` with the matching checkpoint criteria
- PAKANTA dropped from ₱3,499 to ₱1,499 per owner directive 2026-05-28 (latest spec supersedes earlier prices)
- TODAYS_FOCUS is the **paid Concierge wizard** — without buying it, the customer's dashboard default is a **bid-marketplace view grouped by category** (see "Default customer UX" section below)
- Papic Guest + Papic 5 Seats both note "3 months High Res + Must provide Google Drive for auto transfer" (matches blueprint Part 1 § 2)
- High Res Archive is `/year` billing · all other SKUs are one-time event purchases

### Vendor-side · 7 SKUs in `vendor_billing_catalog` (new V2 table)

| sku_code | Title | Price | Type | Constraint |
|---|---|---|---|---|
| pro_vendor_monthly | Pro Vendor (Monthly) | ₱1,999/mo | subscription_monthly | max 1 category · 5 sub-seats |
| enterprise_vendor_monthly | Enterprise Vendor (Monthly) | ₱5,499/mo | subscription_monthly | unlimited cats + sub-accounts |
| vendor_token_pack_4 | 4 Bidding Tokens | ₱1,000 | token_pack | 4 tokens → purchased_tokens |
| vendor_token_pack_10 | 10 Bidding Tokens | ₱2,400 | token_pack | 10 tokens |
| vendor_token_pack_25 | 25 Bidding Tokens | ₱5,500 | token_pack | 25 tokens |
| vendor_token_pack_50 | 50 Bidding Tokens | ₱10,000 | token_pack | 50 tokens |
| vendor_token_pack_100 | 100 Bidding Tokens | ₱18,000 | token_pack | 100 tokens |

Notes:
- Token packs deposit `token_grant_count` into `vendor_wallets.purchased_tokens` on purchase (never expire · unlike earned_tokens which expire 45d post-event)
- Subscription tiers enforced at application layer · read `max_categories` + `max_sub_seats` from this table when validating vendor team-member assignments + category bindings
- Pro tier max_categories=1 means a Pro vendor can only register ONE canonical_service category at a time (per blueprint Part 2 § 1)
- Enterprise tier max_categories=NULL means unlimited (multi-category vendor profile)

### Default customer UX (when Setnayan AI NOT purchased)

Per owner directive 2026-05-28: *"by default they will only have biddings of different vendors. which will be grouped based on categories. similar categories, they can compare."*

The customer dashboard default state (no TODAYS_FOCUS bought) becomes a **bid marketplace browse view**:
- Bids grouped by category (Photographer · Caterer · DJ · etc · matching the existing canonical_service taxonomy)
- Within each category, customer can compare submitted bids side-by-side
- Buying TODAYS_FOCUS unlocks the 38-card guided wizard layered on top (the "Concierge" experience from the V2 Cutover Plan)

Implementation note for the new session: this default view is a **major UI surface** that doesn't exist yet — it reads from `vendor_bid_submissions` joined to `vendor_profiles` for category grouping. The wizard surface (`/today` route per prior session work) becomes paid-gated behind the TODAYS_FOCUS purchase.

---

## TL;DR · The mission

Make the **V2 blueprint** ([💎 Part 1 Final Customer (B2C) Pricing Verification.md](../../../../Desktop/setnayan_blueprint/💎%20Part%201%20Final%20Customer%20%28B2C%29%20Pricing%20Verification.md) + [SQL Guide.pdf](../../../../Desktop/SQL%20Guide.pdf)) function end-to-end for real users by **replacing** the V1 surfaces it supersedes.

The V2 schema is already live in prod. The V2 API routes (3 of them) are already deployed. **Zero user-visible UI is rewired yet.** A customer or vendor visiting www.setnayan.com today still sees pure V1 (V1 pricing · V1 commission · V1 weekly vendor subs · V1 SKU catalog).

The new session's task is to **flip the UI**, **retire conflicting V1 surfaces**, and **wire the Pakanta SKU + vendor handshake mechanic** into the live app.

---

## ⚠️ OPEN QUESTION at session close (2026-05-28 PM) · pick path before resuming engineering

Owner asked end-of-session for a Bark.com / Houzz Pro lead-broker model: name-redact FREE vendors to "Manila Wedding Photographer #[ID]" · couples submit "Free Inquiry" · vendor pays 1 token to unlock couple's contact details · Pro/Enterprise (₱2,000/28-day) gets instant lead access at zero cost · Vanity Subdomain Routing gated to Pro+.

I refused to write the code because it contradicts **7 separately-locked V2 directives** from earlier today. See CLAUDE.md "OPEN QUESTION · lead-broker pivot vs V2 publisher posture" row (2026-05-28 sixth row) for the full 7-conflict breakdown with file:line evidence.

**Owner needs to pick before fresh session resumes:**

- **Path (A) — keep V2 publisher posture.** Build Free-vs-Pro differentiation that respects all 7 locks (response-time badge · priority routing for Pro inquiries · advanced analytics for Pro+ · multi-service catalog · ad_rank-pinned marketplace search · etc.). Free vendors keep their real name + slug.setnayan.com. ~1 day work.
- **Path (B) — explicit strategic pivot from V2 publisher to lead-broker.** Requires reversal commits on PRs #560/#561/#562/#563/#564 from today (all "0% commission" + "free baseline" copy retires) · new iteration spec · PH DTI + NPC legal review · new Vendor Agreement language · decision on VAT treatment of 1-token unlock fee.

If (A): say "go path A" and the fresh session can ship it today. If (B): say "yes, pivot from V2 publisher to lead-broker" + acknowledge that 5 PRs from today need follow-up reversal commits.

**Until owner picks, the V2 publisher posture from the third 2026-05-28 row remains canonical.** Pilot 2026-06-01 scope unchanged either way.

---

## Phase B SHIPPED · 2026-05-28 PM batch · public surfaces now read V2 truth

5 PRs merged in single session — 4 parallel agents + 1 sequential ship:

| PR | Scope | Files |
|---|---|---|
| [#560](https://github.com/iscasasola/setnayan-platform/pull/560) | `/pricing` rewrite (async server component reading 3 V2 catalogs · BUILD_STATUS chips) · homepage `_TransparentPricing` (3 columns: free websites · software at retail · 0% on bookings) · `/for-vendors/_sections/*` (5 files) · `/privacy` (Concierge → Setnayan AI) · `/waitlist` (free websites both sides) · `/features/_Compliance` (EWT-on-Setnayan-Pay tile retired) · new `apps/web/lib/v2-catalog.ts` shared reader | 13 files +838/-590 |
| [#561](https://github.com/iscasasola/setnayan-platform/pull/561) | Bucket E · `_FAQ` 3 Q&A rewrites · supplies-marketplace page + cart-drawer + products data (Setnayan Pay rail dropped · take-rate parentheticals scrubbed) | 4 files |
| [#562](https://github.com/iscasasola/setnayan-platform/pull/562) | Bucket D · vendor-dashboard earnings ("You keep 100%" KPI + direct-booking ledger) · marketing redesigning banner · tax-documents (software receipts only) · verify (100-token approval reward card) | 4 files |
| [#563](https://github.com/iscasasola/setnayan-platform/pull/563) | Bucket A · admin console (12 files) · admin-nav rebranded · brain Setnayan AI rename · concierge-abuse retired banner · operations-hiring Jan 30 2027 reframed · settings/payment-methods full retired banner | 12 files +217/-86 |
| [#564](https://github.com/iscasasola/setnayan-platform/pull/564) | Bucket B · customer dashboard + i18n · `section.concierge` key kept (load-bearing) · concierge-banner full rewrite · /dashboard/profile/concierge route + page reframed · create-event drops trial · event-home historical-context comments · pro-upgrade-panel drops Free-during-launch branching | 14 files +349/-954 |

**Method**: 4 general-purpose agents dispatched in 1 message, each in own worktree under `~/Setnayan/.claude/worktrees/v2-cleanup-{admin,dashboard,vendor-dashboard,marketing-sections}`, each owning a disjoint bucket. Zero merge conflicts. Total wall-clock ~15 min dispatch-to-last-merge.

**Verification**: final grep across `apps/web/app/` for "Setnayan Pay" / "5.0%" / "₱2,499" / "Concierge" / "LAUNCH_PROMO" / "Pro Weekly" / "Jan 30, 2027" returns only intentional historical-context markers (JSDoc retirement banners + file-header docstrings + the polite "Legacy Setnayan Pay methods · Retired 2026-05-28 V2 cutover · read-only historical view" page header — that IS the V2 retirement-banner UX). Public user-facing V2 alignment is complete.

**What's left after Phase B**:

- **Bucket C — wizard substrate** (`lib/wizard.ts` · `lib/concierge.ts` · `lib/wizard-recommendations.ts` · 16 `wizard-cards/*.tsx` · `wizard-hero` · `wizard-carousel` · `wizard-card` · `in-flight-tray` · `bottom-nav` · `wizard-actions.ts`) — pure brand-layer rename Concierge → Setnayan AI across interdependent files. Best as 1 coordinated PR.
- **Bucket F — lib substrate** (`lib/sku-catalog.ts` · `lib/payouts.ts` · `lib/vendor-earnings.ts` · `lib/vendor-ads.ts` · `lib/vendor-verification.ts` · `lib/subscriptions.ts` · `lib/bir/filings.ts` · `lib/hiring-guide/emails.ts` · `lib/upcoming-items.ts` · `lib/regions.ts` · `lib/taxonomy.ts`) — per-file judgment calls · 1-2 coordinated PRs.
- **Schema-completion sprint** (Phase A continuation): drop `setnayan_pay_methods` table · drop `events.concierge_*` + `events.todays_focus_*` columns · drop `users.concierge_trial_used_at` + `users.show_todays_focus_wizard` · drop `concierge_abuse_flags` table · archive `vendor_payouts` table · retire `service_catalog_price_history` audit columns.
- **Follow-ups surfaced by parallel agents**: TierCard CTA gating on cutover day · `startConciergeTrial` action removal (still mounted but no UI invokes it) · concierge-abuse server action rename (kept to avoid cross-iteration import churn).

---

## State of the world (2026-05-28T00:02:00Z snapshot)

### ✅ Already live in prod (do not redo)

| Layer | What's there | Where |
|---|---|---|
| V2 database schema | 9 V2 tables · 2 plpgsql functions · 2 triggers · RLS on all 9 | migration `20260628000000_v2_additive_phase_a.sql` |
| V2 catalog seed | 19 SKUs in `platform_retail_catalog_v2` incl. PAKANTA ₱3,499 `is_token_able=TRUE` | same migration |
| Bundle seed | GUIDED_PACK ₱11,999 + MEDIA_PACK ₱16,999 in `platform_package_catalog` | same migration |
| Bid marketplace schema | `couple_briefs` + `vendor_bid_submissions` + auto-derive token-cost trigger | same migration |
| Vendor wallet schema | `vendor_wallets` (purchased + earned dual-balance) + `consume_vendor_assets()` FIFO burn + `token_rewards_log` audit | same migration |
| Crew handshake schema | `registered_crew_devices` + 5-cap trigger + `event_software_activations_v2` + `execute_manpower_telemetry_reward()` 14-token ladder | same migration |
| Manual payment audit | `manual_payment_logs` table | same migration |
| Billing API route | `POST /api/v1/billing/initialize-maya` · dual-branch (MANUAL_QR_OVERLAY default + Maya API gated) · 100% retail · `discount_applied: false` | apps/web/app/api/v1/billing/initialize-maya/route.ts |
| Crew handshake API route | `POST /api/v1/manpower/sync-device` · master QR HMAC validation + 5-cap insert + activation upsert | apps/web/app/api/v1/manpower/sync-device/route.ts |
| Telemetry API route | `POST /api/v1/manpower/verify-telemetry` · per-service checkpoint validation (8 SKUs incl PAKANTA) · calls reward RPC | apps/web/app/api/v1/manpower/verify-telemetry/route.ts |
| Manual checkout modal | GCash + BDO dual-channel · opacity fade · titanium-gray theme · `?v=Date.now()` cache buster | apps/web/components/billing/ManualCheckoutModal.tsx |
| Offline vault | IndexedDB + media pipeline + sync provider | apps/web/lib/indexedDB.ts · apps/web/lib/mediaPipeline.ts · apps/web/app/_components/OfflineSyncProvider.tsx |
| V1 boost retired | 5 SKUs marked `is_active=FALSE` + `retired_at` stamped | migration `20260629000000_retire_v1_boost_skus.sql` |

### 🔴 Still V1 on the live site (the actual work)

> **Update 2026-05-28 PM**: 4 rows below crossed out — closed by Phase B PRs #560/#561/#562/#563/#564 this session. Remaining rows are post-pilot Phase C-J engineering scope.

| What | Current state | Target state | Priority |
|---|---|---|---|
| ~~`/pricing` page · `/for-vendors` page · homepage `_TransparentPricing` · `/privacy` · `/waitlist` · `/features/_Compliance`~~ | ~~Reads V1 catalog + 5% convenience fee copy~~ | **✅ DONE in PR #560 + #561 + #564** · `/pricing` now async server component reading V2 catalogs · 19 SKUs + 2 bundles + Pro Vendor ₱1,999/mo + Enterprise ₱5,499/mo + 5 token packs · BUILD_STATUS chips (Live / In build / Coming soon) per SKU · publisher model "How money flows" tri-card · 0% commission everywhere · free websites both sides | **✅** |
| ~~Marketplace checkout (couple booking a vendor)~~ | ~~Setnayan Pay 5% routing~~ | **Partial · in build** · `setnayan_pay_methods` table marked `is_active=FALSE` via PR #559 · `/checkout/*` surfaces still exist + need to route to off-platform-direct messaging (couples pay vendor off-platform · vendor stamps booking via 2-token handshake at venue) · admin /settings/payment-methods now shows polite "Legacy Setnayan Pay methods · Retired 2026-05-28 V2 cutover" historical-view banner per PR #563 | **P0 next** |
| ~~Vendor dashboard subscription~~ | ~~`vendor_pro_weekly` ₱499/wk shown~~ | **Partial · in build** · `/vendor-dashboard/*` now reads V2 thesis copy via PR #562 (verify page shows 100-token reward · earnings shows "You keep 100%" · marketing shows redesigning banner · tax-documents reframed) · Pro Vendor ₱1,999/mo + Enterprise ₱5,499/mo schema lives in `vendor_billing_catalog` per PR #557 · subscription PURCHASE flow still needs to be wired through cart + admin reconciliation | **P1 next** |
| Vendor dashboard wallet | Doesn't exist | Build `/vendor-dashboard/wallet` reading `vendor_wallets` · show purchased_tokens + earned_tokens (with 45-day expiry countdown) · "Buy more tokens" CTA → token pack purchase | **P0** |
| Token pack purchase | Doesn't exist (no schema, no UI) | Build 5-tier pack purchase: 4 tokens ₱1,000 · 10 ₱2,400 · 25 ₱5,500 · 50 ₱10,000 · 100 ₱18,000 · seed as service_catalog rows or new `vendor_token_packs` table | **P0** |
| Bid marketplace UI | Schema exists · zero UI surfaces | Build couple-side `/dashboard/[eventId]/briefs/new` (post brief) · vendor-side `/vendor-dashboard/bid-inbox` (browse + submit · burns tokens via `consume_vendor_assets()`) · admin moderation `/admin/briefs` | **P1** |
| Vendor handshake at venue | Schema + API route exist · no client | Build couple-side master event QR display (rolling 60s HMAC hash) · vendor-side QR scanner page that POSTs to `/api/v1/manpower/sync-device` · 2-token deduction via `consume_vendor_assets()` stamps vendor as owner | **P0** |
| Telemetry checkpoints (token earning) | Schema + API route exist · no client triggers | For each is_token_able SKU (8 of them incl PAKANTA) · the consumer service needs a "ping when threshold met" call to `/api/v1/manpower/verify-telemetry` | **P1** |
| `manual_payment_logs` admin reconciliation | Table receives inserts from billing route · no admin UI | Build `/admin/payments-manual` listing pending payments · approve flips status + activates customer's services · reject flips status + sends email | **P0** |
| Env vars in Vercel | Not set | Set NEXT_PUBLIC_GCASH_QR_URL + NEXT_PUBLIC_BDO_QR_URL with real QR image URLs · NEXT_PUBLIC_GCASH_ACCOUNT_NAME + NEXT_PUBLIC_BDO_ACCOUNT_NAME with display strings · MASTER_QR_SECRET for HMAC signing of master event QRs | **P0** (owner-side action) |

---

## The 6 architectural pillars from owner's 2026-05-28 audit · target state

Owner's verbatim list of what V2 should do (from the audit conversation):

1. **No Setnayan commission · vendors paid directly off-platform.** Setnayan handles ₱0 of vendor cash. Per blueprint Part 3 § Payment Flow. *Retire* `setnayan_pay_methods` rows + checkout 5% math + commission language across marketing pages.
2. **Vendor tokens launched.** Dual-balance wallet (purchased + earned). Earned tokens expire 45 days post-event. *Build* vendor wallet UI + token pack purchase flow + telemetry-driven earning.
3. **Request bid launched.** Couples post briefs · vendors burn tokens to submit bids (1/3/5-8 tokens by `estimated_budget_range`). *Build* couple brief-authoring + vendor bid-inbox + admin moderation.
4. **Simpler payment structure.** 100% retail · no discounts · manual reconciliation via GCash + BDO QR (Branch A) until Maya API approval lands (Branch B). *Replace* the V1 Setnayan Pay flow.
5. **Customers only buy added features.** No subscription · no commission · no booking-through-Setnayan. Just the 19-SKU catalog + 2 bundles. *Rewire* `/pricing` + `/add-ons` to V2 catalog.
6. **Vendors have free baseline + Pro + Enterprise.** Per blueprint Part 2 § 1. *Add* Pro ₱1,999/month + Enterprise ₱5,499/month SKUs · 28-day prepaid blocks · manual renewal · auto-downgrade on lapse.

(Item 7 from owner's list — "engineered boosting" — was a V1 holdover and is now retired per 2026-05-28T00:01:47Z migration.)

---

## Pakanta specifics (per owner directive 2026-05-28 fourth row of CLAUDE.md)

**SKU code:** `PAKANTA`  
**Catalog row:** `platform_retail_catalog_v2.PAKANTA` · ₱3,499 · `is_token_able=TRUE`  
**SaaS overhead:** ₱200 per render  
**Telemetry checkpoint:** Suno API audio stream mapping validation success  
**Verify-telemetry payload shape:**

```json
{
  "event_id": "<uuid>",
  "vendor_id": "<uuid>",
  "service_code": "PAKANTA",
  "telemetry_payload": {
    "pakanta": {
      "suno_audio_url": "https://...",
      "suno_validation_status": "ok"
    }
  }
}
```

When the checkpoint validates and `execute_manpower_telemetry_reward()` is called:
- The vendor's `event_software_activations_v2` row for PAKANTA flips to `is_reward_issued=TRUE`
- The 14-token stacking ladder advances (Pakanta counted alongside the 7 blueprint services)
- A row lands in `token_rewards_log`
- `vendor_wallets.earned_tokens` increments (1/2/2/2/2/2/3 token ladder by completion order · max 14 per event)
- Audit timestamp `rewarded_at` set

The earned token expiry is 45 days from `event_date` (lazy-eval on read · the route already computes this in the `voucher_expires_at` response field · no separate cron needed).

**Customer-facing copy:** Pakanta is the AI-generated custom wedding song service. Customer pays ₱3,499 at full retail. The vendor (musician / Setnayan-team-of-record) earns the token reward when the Suno render succeeds. Setnayan's SaaS overhead (Suno API call cost) is ~₱200 per render → ~95% margin.

**Not yet built:** the Pakanta consumer page where customers buy this SKU + the Suno API integration that fires the telemetry checkpoint. Both are part of this session's scope.

---

## Vendor handshake at venue (per blueprint Part 4 § 1 + Part 3 § 1)

The handshake is the mechanism that **stamps a Vendor ID as the definitive owner-stamp** for an event's software activation. It's how vendors get attributed for the token rewards their service work earns.

### Couple side (event day setup)

1. Couple opens their Phase 2 wedding website route (e.g., `setnayan.com/{couple-slug}` per iteration 0002 spec).
2. Page renders a **Master Event QR** that regenerates every 60 seconds with a fresh HMAC signature:
   ```
   payload format: `{event_id}.{bucket_int}.{sig_hex}`
   bucket_int     = Math.floor(Date.now() / 60000)
   sig_hex        = HMAC_SHA256(MASTER_QR_SECRET, `${event_id}:${bucket}`).slice(0, 32)
   ```
3. Couple holds up the QR (phone or printed display) during venue setup so vendor crews can scan it.

**Why rolling 60s:** prevents remote QR-photo-sharing fraud · only physically-present crews at the venue can scan a fresh enough hash. The server accepts hashes within ±2 buckets (±2 minutes) of current server time to absorb scan latency + clock skew.

### Vendor side (claim the gig at venue)

1. Vendor crew member opens the Setnayan vendor app (web · mobile-friendly · scans QR using browser `BarcodeDetector` or `getUserMedia`).
2. Scans the couple's Master Event QR.
3. Vendor app POSTs to `/api/v1/manpower/sync-device`:
   ```json
   {
     "event_id": "<from_qr>",
     "vendor_id": "<authed_vendor>",
     "device_fingerprint": "<browser_fingerprint>",
     "master_qr_payload": "<scanned_payload>",
     "service_code": "PAPIC_SEATS"
   }
   ```
4. Route validates the HMAC, checks the 5-cap (`registered_crew_devices` trigger raises `CREW_SEAT_LIMIT_EXCEEDED` if event already has 5 devices), and INSERTs the device row.
5. Route also UPSERTs `event_software_activations_v2` for the (event_id, service_code) pair · the vendor_id from the request becomes the owner-stamp.
6. **The first vendor to claim a service for an event wins the owner-stamp** (UNIQUE constraint on `event_id, service_code`).

### 2-token handshake fee (manpower SKU only · blueprint Part 3 § 1)

When the vendor claims a **manpower staffing gig** specifically (not a regular software-only activation), the system also deducts **2 tokens** from the vendor's `purchased_tokens` (or `earned_tokens` first via FIFO) via `consume_vendor_assets()` to cover transaction routing.

This handshake fee is the ONLY Setnayan touch on the manpower flow. The ₱15,000 staffing fee is paid 100% offline cash from couple → vendor (Setnayan handles ₱0 · BIR-exempt for Setnayan per blueprint Part 3 § Payment Flow + RR 16-2023 1% Intermediary Tax exemption).

**Implementation TODO for the next session:** the `/sync-device` route as written doesn't yet differentiate between "software activation" vs "manpower handshake." Add a `claim_type: 'software' | 'manpower'` field in the request body · when `claim_type='manpower'`, additionally call `consume_vendor_assets(vendor_id, 2)` and surface insufficient-balance errors back to the vendor. Without this branch the 2-token fee never fires.

### Token rewards triggered by handshake

Once the vendor is stamped as owner for a service, all subsequent telemetry checkpoints for that service on that event funnel rewards to that vendor. The 14-token stacking ladder applies (cumulative 1+2+2+2+2+2+3 = 14 max per vendor per event).

The reward fires lazily when the consumer service POSTs telemetry to `/verify-telemetry` and the checkpoint criteria validate. No automatic firing · the consumer service is responsible for the heartbeat.

---

## Execution order (dependency-correct)

The new session should execute in this order to avoid breaking the live site:

### Phase 1 · Catalog rebind (P0 · ~4-6 hours)

**Goal:** `/pricing` shows V2 SKUs.

1. Edit `apps/web/lib/sku-catalog.ts` to add the V2 catalog entries (mirror of `platform_retail_catalog_v2`). Keep V1 entries with `isActive: false` for grandfather compatibility.
2. Rewrite `/pricing` page (`apps/web/app/(marketing)/pricing/page.tsx` if that's the canonical path · grep to confirm) to read V2 catalog rows:
   - Drop the "5% Setnayan Pay convenience fee" worked example
   - Drop the "₱100,000 → ₱5,000 fee · ₱105,000 customer pays" math block
   - Replace with V2 publisher copy: "100% retail · zero commission · pay directly via QR or future Maya integration"
   - List the 19 SKUs (sorted by category) + 2 bundles
   - Note PAKANTA as a featured item
3. Audit + update any other marketing pages that mention Setnayan Pay 5% (likely `/for-vendors`, `/how-it-works`, `/privacy` re: payment flow).

### Phase 2 · V1 commission retirement (P0 · ~2-3 hours)

**Goal:** Marketplace booking no longer charges 5%.

1. Migration: `UPDATE setnayan_pay_methods SET is_active=FALSE` (assuming this table has such a column · or `DELETE`/mark differently per schema). Run the inspection query first to confirm shape.
2. Find every code path that reads `setnayan_pay_methods` for fee math · gate it behind a `SETNAYAN_PAY_ENABLED` flag (default off) OR route directly to the new `/api/v1/billing/initialize-maya` flow.
3. Communicate change to in-flight pilot family/friends: they ALREADY signed up with V1 expectations · grandfather their bookings (don't apply 5% retroactively · don't refund retroactively).

### Phase 3 · Vendor token wallet UI (P0 · ~6-8 hours)

**Goal:** Vendors can see their wallet + buy tokens.

1. Build `/vendor-dashboard/wallet/page.tsx`:
   - Read `vendor_wallets` for the authed vendor
   - Show purchased + earned balances with 45-day countdown chip on each earned tranche (`SELECT processed_at FROM token_rewards_log` to compute expiry per row)
   - Recent ledger from `token_rewards_log` (last 20 rows)
   - "Buy more tokens" CTA → token pack purchase
2. Build `/vendor-dashboard/wallet/buy/page.tsx`:
   - 5 pack tiers (4/10/25/50/100 tokens)
   - On purchase, route through the same MANUAL_QR_OVERLAY flow as customer billing (insert to `manual_payment_logs` with `items_ordered=['TOKEN_PACK_4']` etc · admin reconciles + manually credits `vendor_wallets.purchased_tokens` post-payment)
3. Seed the 5 token pack SKUs in `service_catalog` OR `platform_retail_catalog_v2` (decide based on whether the pack flow is publisher-managed vs vendor-managed).

### Phase 4 · Vendor handshake mobile UI (P0 · ~4-6 hours)

**Goal:** Vendors can claim event gigs by scanning the master QR.

1. Build couple-side master QR display: extend `/dashboard/[eventId]/page.tsx` (or the existing Phase 2 wedding website renderer) to add a "Master Event QR · show this to your crew on event day" section that renders the rolling-60s QR via `qrcode` library + 60s `setInterval` regen.
2. Build vendor-side scanner: `/vendor-dashboard/claim-event/page.tsx` with browser camera + `BarcodeDetector` API (fallback to file upload of QR image). On scan, POST to `/api/v1/manpower/sync-device`.
3. Add `MASTER_QR_SECRET` to Vercel env vars (32-byte random hex string).
4. Surface success state: "You're now the owner of {SERVICE_CODE} for {couple_name}'s event" + 2-token deduction confirmation if `claim_type='manpower'`.
5. Modify `/api/v1/manpower/sync-device` to accept `claim_type` and call `consume_vendor_assets()` when manpower.

### Phase 5 · Pakanta consumer flow (P1 · ~4-6 hours)

**Goal:** Customers can buy + receive a Pakanta song.

1. Build `/dashboard/[eventId]/pakanta/page.tsx`: brief intake form (couple names + story snippets + musical preferences).
2. On submit, POST to `/api/v1/billing/initialize-maya` with `selectedServices: ['PAKANTA']` · render `ManualCheckoutModal` with the response.
3. After payment confirmed (admin flips `manual_payment_logs.payment_status` → CONFIRMED), trigger a Suno API call (server-side) to generate the song.
4. On Suno success, server hits `/api/v1/manpower/verify-telemetry` internally with `service_code='PAKANTA'` + `telemetry_payload.pakanta.suno_validation_status='ok'`. This fires the 14-token reward to the vendor (whoever's stamped as owner via the handshake · likely a Setnayan-team-of-record account during pilot).
5. Customer downloads the song + lyric sheet.

**Note:** Suno API integration is the heavy lift here. If Suno doesn't have a public API yet (it didn't last I checked), this requires manual fulfillment: admin generates via Suno Premier UI · uploads to R2 · marks Pakanta delivered. The telemetry checkpoint fires manually from the admin tool.

### Phase 6 · Bid marketplace (P1 · ~8-10 hours)

**Goal:** Couples post briefs · vendors bid by burning tokens.

1. Couple-side: `/dashboard/[eventId]/briefs/new/page.tsx` (intake form) + `/dashboard/[eventId]/briefs/[briefId]/page.tsx` (view + manage). Insert into `couple_briefs` with `estimated_budget_range` · the existing `derive_brief_token_cost()` trigger sets `token_cost_per_submission`.
2. Vendor-side: `/vendor-dashboard/bid-inbox/page.tsx` lists open briefs in the vendor's canonical_service coverage. Filter by `couple_briefs.status='open' AND expires_at > NOW()`.
3. Vendor clicks a brief → `/vendor-dashboard/bid-inbox/[briefId]/page.tsx` → submit form (proposal_body · proposed_price). On submit: call `consume_vendor_assets(vendor_id, token_cost)` then INSERT into `vendor_bid_submissions`. Show insufficient-balance error if tokens too low.
4. Couple-side review: list of submitted bids on the brief detail page · "Shortlist" / "Award" / "Decline" actions update `vendor_bid_submissions.status`.
5. Admin moderation `/admin/briefs/page.tsx`: surface flagged briefs (spam · inappropriate content) for review.

### Phase 7 · Vendor monthly subscriptions (P1 · ~3-4 hours)

**Goal:** Vendors can subscribe to Pro ₱1,999/month or Enterprise ₱5,499/month.

1. Seed `service_catalog` (or a new `vendor_subscriptions` table) with:
   - `vendor_pro_monthly` ₱1,999 · 28-day prepaid block · single category · max 5 sub-seats
   - `vendor_enterprise_monthly` ₱5,499 · 28-day prepaid block · multi-category · unlimited sub-accounts
2. Migration to mark V1 weekly SKUs (`vendor_pro_weekly` + 5 `tool_*_weekly` + `all_tools_unlock_annual`) `is_active=FALSE` + `retired_at` stamped. Grandfather existing subscribers until natural expiry.
3. Build `/vendor-dashboard/subscription/page.tsx` showing current tier · renewal countdown (7-day email + dashboard countdown before lapse) · lapse → auto-downgrade to Free.
4. Renewal flow: 7 days before expiry, dashboard surfaces a "Renew now" CTA that hits `/api/v1/billing/initialize-maya` with `selectedServices: ['vendor_pro_monthly']`.

### Phase 8 · `manual_payment_logs` admin reconciliation (P0 · ~3-4 hours)

**Goal:** Admin can see + confirm pending manual payments.

1. Build `/admin/payments-manual/page.tsx`: list rows from `manual_payment_logs` where `payment_status='PENDING_MANUAL_VERIFICATION'`. Sort by `created_at DESC`. Columns: reference_number · event_id (linked) · amount_php · items_ordered · created_at.
2. Each row: "Confirm received" action → set `payment_status='CONFIRMED'` + `verified_at=NOW()` + `verified_by_admin_id` + dispatch activation logic (mark the customer's event as having paid for the items).
3. "Reject" action → set `payment_status='REJECTED'` + `rejection_reason` + email customer (via Resend per iteration 0028).
4. "Upload screenshot proof" affordance: store image in R2 with key `manual_payments/{manual_payment_id}/{filename}` · link from the row.

### Phase 9 · Telemetry triggers (P1 · ~varies by service · 2-4 hours per service)

**Goal:** Token rewards actually fire when work is done.

For each is_token_able SKU, instrument the consumer to call `/verify-telemetry` when checkpoint criteria are met:

- **PAPIC**: in the Papic upload backend, after every 50 valid files >500KB from ≥3 of 5 devices, fire one call
- **PANOOD**: in the Panood RTMP gateway, after 30 cumulative minutes of stream, fire one call
- **PATIKTOK**: in the Patiktok WASM render worker, after first valid reel asset, fire one call
- **PABATI**: in the Pabati guest clip processor, after 15 unique 5-second clips, fire one call
- **SDE**: in the SDE render callback, after status='ok', fire one call
- **CAMERA_BRIDGE**: in the bridge media tracker, after 1GB transit, fire one call
- **LIVE_WALL**: in the WebSocket gateway, after 60 cumulative minutes of uninterrupted connection, fire one call
- **PAKANTA**: in the Suno integration (or admin fulfillment tool), after audio file written + validated, fire one call

Each call is idempotent (the function early-returns if `is_reward_issued=TRUE` already), so triggering multiple times per checkpoint is safe.

---

## Owner-side action items (do these BEFORE the new session can fully test)

1. **Vercel env vars** (Settings → Environment Variables → Production):
   - ~~`NEXT_PUBLIC_GCASH_QR_URL`~~ · **retired 2026-05-28 PR #556** · GCash QR URL now reads from `platform_settings.gcash_qr_url` (admin-uploaded via dashboard · live URL: `https://njrupjnvkjkitfctetvi.supabase.co/storage/v1/object/public/platform-assets/merchant-qr/gcash/1778727799654-aqmayr.png`)
   - ~~`NEXT_PUBLIC_BDO_QR_URL`~~ · **retired 2026-05-28 PR #556** · same · admin dashboard owns the value
   - ~~`NEXT_PUBLIC_GCASH_ACCOUNT_NAME`~~ + ~~`NEXT_PUBLIC_BDO_ACCOUNT_NAME`~~ · also retired · read from `platform_settings.gcash_account_name` + `bdo_account_name`
   - `MASTER_QR_SECRET` = 32-byte hex string (generate via `openssl rand -hex 32`) · used by `/sync-device` HMAC validation · **still required**
2. **Suno API account** (if Pakanta is in scope this session): credentials for the Suno Premier API or whichever provider · OR confirm "manual admin fulfillment" path is acceptable for now
3. **Confirm pilot couple/vendor list** so we know who is grandfathered on V1 commission · who continues to see V1 weekly subs · who shouldn't be hit by surprise UI changes mid-pilot

## Verified-vendor 100-token bonus · LIVE 2026-05-28 (PR #556)

The 100-token grant **fires automatically the moment a vendor's `verification_state` transitions into `'verified'`** — not as a bulk cutover-day grant. Per owner clarification 2026-05-28: *"only give the complementary 100 tokens once the vendor is verified."*

Migration `20260630000000_verified_vendor_token_bonus_trigger.sql` (applied to setnayan-prod 2026-05-28) installs:

- `vendor_verified_bonus_trigger` · AFTER UPDATE OF `verification_state` on `vendor_profiles`
- `vendor_verified_bonus_trigger_insert` · AFTER INSERT on `vendor_profiles` (covers admin batch-import-into-verified path)
- `grant_verified_vendor_bonus()` + `grant_verified_vendor_bonus_on_insert()` plpgsql functions

Both trigger functions:
1. Check transition logic (NEW = 'verified' AND OLD ≠ 'verified' for UPDATE · NEW = 'verified' for INSERT)
2. Idempotency · `SELECT EXISTS()` on `token_rewards_log` with `service_code='VERIFIED_VENDOR_BONUS_100'` · early-return if already paid (handles verified → demoted → re-verified scenarios)
3. UPSERT `vendor_wallets` · adds 100 to `earned_tokens` (creates row if vendor has no wallet yet)
4. INSERT `token_rewards_log` audit row with sentinel `event_id='00000000-0000-0000-0000-000000000000'` (the bonus isn't event-tied · sentinel UUID satisfies the NOT NULL constraint)

**Phase I (Task #11) from the V2 Cutover Plan is now CLOSED** — was originally "cutover-day bulk grant to verified-as-of-cutover vendors" · reframed and shipped as "per-vendor-on-verification-event grant via DB trigger." The pilot cohort (currently all `verification_state='unverified'` per prod query) will naturally receive the bonus when owner verifies them via the admin verification queue.

The 45-day expiry on earned tokens applies to this bonus too · the `voucher_expires_at` field in `/verify-telemetry` responses includes the bonus tranche in the 45-day countdown.

---

## Files + tables · canonical reference

### Tables (live in setnayan-prod 2026-05-28)

**V2 tables (new):**
- `vendor_wallets` (vendor_id PK · purchased_tokens · earned_tokens · updated_at)
- `platform_retail_catalog_v2` (service_code PK · title · retail_price_php · saas_overhead_cost_php · is_token_able)
- `platform_package_catalog` (package_code PK · title · retail_price_php)
- `event_software_activations_v2` (id PK · event_id · vendor_id · service_code FK · is_reward_issued · rewarded_at · created_at · UNIQUE(event_id, service_code))
- `registered_crew_devices` (id PK · event_id · vendor_id · device_fingerprint · registered_at · UNIQUE(event_id, device_fingerprint))
- `token_rewards_log` (id PK · vendor_id · event_id · service_code · tokens_awarded · processed_at)
- `couple_briefs` (brief_id PK · event_id · brief_title · brief_body · category · estimated_budget_range · brief_valuation_tier · token_cost_per_submission · status · awarded_vendor_id · expires_at · created_at · updated_at)
- `vendor_bid_submissions` (bid_id PK · brief_id FK · vendor_id · proposal_body · proposed_price · tokens_burned · status · submitted_at · updated_at · UNIQUE(brief_id, vendor_id))
- `manual_payment_logs` (manual_payment_id PK · event_id · reference_number UNIQUE · amount_php · payment_status · items_ordered JSONB · customer_user_id · verified_at · verified_by_admin_id · rejection_reason · expires_at · created_at · updated_at)

**V1 tables (preserved):**
- `service_catalog` (V1 SKUs · keep as-is · just mark deprecated SKUs `is_active=FALSE`)
- `setnayan_pay_methods` (V1 commission rails · retire by marking inactive)
- `users` / `events` / `event_members` / `vendor_profiles` / `vendor_service_agents` / `orders` / etc · all V1 core · do not touch

**V2 functions (live):**
- `execute_manpower_telemetry_reward(p_vendor_id, p_event_id, p_service_code)` → VOID · 14-token stacking ladder · FOR UPDATE locking
- `consume_vendor_assets(p_vendor_id, p_spend_amount)` → BOOLEAN · earned-first FIFO burn · RAISES on insufficient balance
- `check_crew_device_seat_allocation()` → TRIGGER on `registered_crew_devices` BEFORE INSERT · 5-cap enforcement
- `derive_brief_token_cost()` → TRIGGER on `couple_briefs` BEFORE INSERT/UPDATE · sets token_cost_per_submission from estimated_budget_range

### API routes (live)

- `POST /api/v1/billing/initialize-maya` · dual-branch checkout
- `POST /api/v1/manpower/sync-device` · vendor handshake + 5-cap enforcement
- `POST /api/v1/manpower/verify-telemetry` · checkpoint validator + reward trigger

### Components (deployed but not mounted)

- `apps/web/components/billing/ManualCheckoutModal.tsx` · GCash + BDO dual-channel checkout modal
- `apps/web/app/_components/OfflineSyncProvider.tsx` · background sync daemon + UploadChip
- `apps/web/lib/indexedDB.ts` · vault primitives
- `apps/web/lib/mediaPipeline.ts` · intake + flush pipeline

### Modules NOT yet built (this session)

- Vendor wallet UI · token pack purchase · bid marketplace UIs · master QR display · vendor scanner UI · vendor subscription UI · admin payment reconciliation UI · Pakanta consumer page · per-service telemetry triggers

---

## Memory rule alignment

The new session should honor these established rules:

- `[[feedback_setnayan_pr_auto_merge]]` · open PR via `gh pr create` · arm `gh pr merge <num> --auto --merge`
- `[[feedback_setnayan_push_migrations_myself]]` · push migrations via `supabase db push --linked` from `~/setnayan-db-push/` BEFORE merging the consuming PR
- `[[feedback_setnayan_document_changes_with_why]]` · every PR body + decision-log row carries the canonical WHY
- `[[feedback_setnayan_orphan_prevention]]` · every new route/component must have an entry point (no orphans)
- `[[feedback_setnayan_no_dev_text_post_launch]]` · all user-facing copy in brand voice (editorial · luxurious-Filipino-modern · no engineering jargon)
- `[[feedback_setnayan_no_secrets_in_pr_files]]` · NEVER embed secret values in committed files · deliver via chat-only
- `[[feedback_setnayan_latest_spec_priority]]` · latest spec wins · check this doc + V2_Cutover_Plan + most recent CLAUDE.md rows before acting
- `[[reference_setnayan_cron_strategy]]` · no-cron preference · lazy-eval on read patterns
- `[[reference_setnayan_owner_email]]` · system alerts route to iscasasolaii@gmail.com

---

## Sanity check before starting

The new session should run these queries first to confirm the world matches this doc:

```sql
-- 1. V2 catalog exists with 19 rows including PAKANTA
SELECT COUNT(*) FROM platform_retail_catalog_v2;  -- expect 19
SELECT service_code, retail_price_php, is_token_able FROM platform_retail_catalog_v2 WHERE service_code='PAKANTA';
-- expect 1 row · 3499.00 · true

-- 2. V1 boost retired
SELECT sku_code, is_active, retired_at FROM service_catalog WHERE sku_code LIKE 'boost%' OR sku_code LIKE 'sponsored_boost%';
-- expect all rows is_active=FALSE · retired_at populated

-- 3. V1 concierge intact (per non-destructive guarantee)
SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='concierge_abuse_flags');
-- expect TRUE
```

If any of these fail, STOP and audit before proceeding. The state of the world may have shifted since this doc was written.

---

## Companions

- [V2_Cutover_Plan_2026-05-28.md](V2_Cutover_Plan_2026-05-28.md) · architectural lock + 6-decision matrix
- [CLAUDE.md](../CLAUDE.md) decision-log rows from 2026-05-28 · canonical state-of-the-world
- Blueprint at `~/Desktop/setnayan-blueprint/💎 Part 1 Final Customer (B2C) Pricing Verification.md` · owner's source-of-truth pricing matrix
- SQL Guide at `~/Desktop/SQL Guide.pdf` · 5-pass schema definition (verbatim source for the V2 migration)
- Migration `20260628000000_v2_additive_phase_a.sql` · live in prod · V2 schema
- Migration `20260629000000_retire_v1_boost_skus.sql` · live in prod · V1 boost retirement
