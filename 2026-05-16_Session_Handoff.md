# Setnayan — 2026-05-16 Session Handoff (RECONSTRUCTED)

> ⚠️ **This file is a reconstruction, not the original.**
>
> The original `2026-05-16_Session_Handoff.md` (~60 KB) was present in the spec-corpus root at **2026-05-18 12:56** but was silently deleted between 12:56 and 13:02 — most likely by a concurrent Claude session writing into the same folder while several handoffs were being generated in parallel. Because the corpus root had no committed snapshot of the file, there is no git, Trash, or Time Machine path to recover it.
>
> This reconstruction was rebuilt **2026-05-18** from three canonical sources that survived the deletion:
>
> 1. **`CLAUDE.md` decision log** — 17 rows dated `2026-05-16` (lines 375–392 of CLAUDE.md as of reconstruction; row 391 is a 2026-05-17 row interleaved by append order). The CLAUDE.md rows ARE the canonical record; treat them as the source of truth where this file is thin.
> 2. **`HANDOFF_2026-05-17.md` § 2** — compact 16-row table summarising the 05-16 locks.
> 3. **`2026-05-17_Session_Handoff_Pricing_and_Payments.md`** — covers the evening 05-16 pricing/payments work in narrative form (Setnayan Pay 5.0%, marketplace mega-lock, vendor disbursement preamble).
>
> What's preserved here: the decision titles, why each one mattered, what files each one touched, and where to read the full canonical text. What's lost vs. the original: the day's narrative tone, owner quotes, what-was-tried-and-rejected sidebars, and any context outside the decision-log rows themselves.

---

## 1. Quick orientation (read this first)

If you've just been transferred this conversation, the SessionStart hook points you at three sources of truth:

1. **Live product** — https://www.setnayan.com (WebFetch when needed)
2. **Spec corpus** — `/Users/icecasasola/Documents/Claude/Projects/Setnayan/`
3. **Code repos** — Setnayan-App monorepo (`apps/web` for surfaces) + setnayan-platform (auth shell)

**Read these status anchors BEFORE any new work:**

- [`CLAUDE.md`](CLAUDE.md) — engineering context primer; **decision log lives at the bottom** (search `## Decision log`).
- [`COWORK.md`](COWORK.md) — update workflow; lines 44–54 are the canonical sequence.
- [`V1_Gap_Analysis_Status.md`](V1_Gap_Analysis_Status.md), [`App_Build_Status.md`](App_Build_Status.md), [`Installed_Stack_Inventory.md`](Installed_Stack_Inventory.md), [`API_Integration_Checklist.md`](API_Integration_Checklist.md).

**Locked guardrails (do not violate without owner sign-off):**

- V1 scope is locked. Flag feature expansion explicitly before producing code.
- Pricing is PHP centavos in `service_catalog` (iteration 0034). No USD; no invented prices.
- NO wallet UI. Payment is order-and-pay only.
- Responsive by default — design for both desktop and mobile.

---

## 2. Session context

- **Date:** 2026-05-16 (full workday + evening)
- **Predecessor:** 2026-05-15 session ended with production partially broken (admin/website + admin/reviews 500'ing pending Supabase migration push). See [`2026-05-15_Handoff_to_Next_Agent.md`](2026-05-15_Handoff_to_Next_Agent.md) for the EOD state.
- **What this day was about:** continuing the owner walkthrough started 2026-05-15. Items #6–#14 closed across the day (the 05-17 session would later close #15–#20). Heavy pricing-architecture work in the evening.
- **Net result:** **17 decision-log rows** appended to `CLAUDE.md` (row 15 — Concierge V1 lock — was later superseded same-week by 2026-05-17 row 2; row 8 was later charm-corrected in place by 2026-05-17 row 4).
- **Discipline established:** "latest spec wins" — if a SKU got repriced multiple times in one session, only the last reprice counts.

---

## 3. Locked decisions (in chronological / dependency order)

Each lock below corresponds to one CLAUDE.md decision-log row. Row numbers are 1-indexed within the day. **For full canonical text, read the matching `2026-05-16` row in `CLAUDE.md`'s decision log.**

### Row 1 — Save-the-Date reframe + widget pricing reset (closes walkthrough item #6)

**The lock:**
- `save_the_date_render` ₱99 SKU retired. 0024's three-aspect-ratio MP4 render pipeline retired.
- 0024 collapses into **0002 as the Phase 1 hero layout** of the lifecycle-phased landing page (Phase 1 Save-the-Date → 2 Invitation → 3 Logistics → 4 Post-event). Landing page is free for every event at `setnayan.com/{couple-slug}`.
- Phase 1 hero is web-tech only — animated trace SVG monogram + countdown + calendar-add + OG metadata + music. No FFmpeg, no R2 render storage.
- **0004 widget pricing reset:** all 11 widgets ship free Basic-tier in V1; only two paid upgrades survive — **Monogram Hero ₱1,999 no-refund** (SVG-stroke trace + custom video/photo background; SVG-only originally) and **Live Schedule ₱999** (re-priced from ₱99). Retired: `pro_widget_story`, `pro_widget_bundle` ₱199.
- Reserved-for-V1.5+ widget slots: Panood / Papic / Patiktok widgets (inherit pricing from parent iteration when those activate).

**Item #6 closes without a render-pipeline decision** (Cloudflare Containers vs Fly.io vs browser MediaRecorder no longer relevant — page is web-tech only).

**Files touched:** `CLAUDE.md` · `0024_save_the_date.md` (gutted to thin redirect) · `0002_qr_invitation_system.md` (absorbs § 5a as first-class) · `0004_invitation_widgets.md` (full pricing table rewrite + schema extension for `pro_background_*` fields) · `App_Build_Status.md` · `API_Integration_Checklist.md` (Tier 5.1 Save-the-Date row removed) · `V1_Gap_Analysis_Status.md`.

### Row 2 — Monogram Hero PNG → SVG via Potrace (amends row 1)

**The lock:** row 1's *"SVG-only: PNG monogram uploads rejected at upload time"* hard-block is **softened to a hybrid policy with preview gate.**

- 6-step flow: couple uploads PNG → "Convert to SVG so it can animate?" → server-side Potrace via Cloudflare Worker WASM (~2s) → side-by-side preview (PNG vs animated SVG trace looping ~3s) → 3 CTAs (Use this SVG · Try different file · Use auto-generated instead) → on accept, converted SVG stored canonical, PNG kept as backup.
- **Engine: Potrace** (open-source, WASM-wrapped, ~₱0 marginal cost). Vectorizer.ai / ImageTracerJS / Adobe Image Trace rejected.
- **No-refund clause still stands** — the preview gate IS the consent mechanism.
- Schema additions on `hero_monogram.config_json`: `converted_svg_url`, `converted_svg_approved_at`, `converted_svg_potrace_settings`.

**Files touched:** `CLAUDE.md` · `0004_invitation_widgets.md` (purchase flow rewritten + 6-step preview path · earlier hard-block line replaced) · `API_Integration_Checklist.md` (new Tier 5 Potrace WASM + Cloudflare Worker row).

### Row 3 — Papic V1.5+ architecture lock (deferred build, frozen architecture)

**The lock:** Papic native iOS/Android is **deferred to V1.5+** (no V1 engineering bandwidth) but architecture frozen so the V1.5+ build cannot re-litigate decisions.

- **207-camera per event** = 5 paid paparazzi + 200 guest cameras + couple seat.
- **150 captured-photo credits per guest**, bundled free in Premium Guest Camera Pack.
- **Drive transfer at T+30d** via couple-OAuth; Setnayan pushes full archive to `Setnayan/[Event Name]/` folder root.
- **Cold-tier R2 mirror T+30d through T+120d** (~80% cost reduction vs hot-tier indefinite).
- **XMP/EXIF tag embedding** on Drive transfer (face-tags, table-tags, capture timestamp, geo, photographer ID).
- **Auto-Recap** 60–90s reel rendered T+24h post-event via **FFmpeg, NO AI** (deterministic ordering: capture timestamp + sharpness + face-count + exposure-curve median). Free with Premium Guest Camera Pack. Music = Setnayan-owned AI track.
- **Folder structure:** `00_Cover / 01_Pre-event / 02_Ceremony / 03_Reception / 04_Auto-Recap/`.
- **File naming:** `{couple-slug}_{ISO-8601 timestamp}_{photographer-id}_{capture-id}.{ext}`.
- **Pooled credit pool per event:** 5,000 (3-paparazzi pack) / 10,000 (5-paparazzi pack). Soft-warning at 80%. Extension SKU `paparazzi_credits_addon` ₱299 / +1,000 credits (multi-purchase).

**V1.5+ SKU table (locked, deferred build):** `paparazzi_3_seats` ₱1,499 · `paparazzi_5_seats` ₱2,499 · `paparazzi_camera_addon` ₱999 · `paparazzi_credits_addon` ₱299/1K · `premium_guest_camera_pack` ₱1,499 (event-wide) · `personal_album_per_guest` ₱49 · `memory_book_per_guest` ₱249.

**Files touched:** `CLAUDE.md` · `0012_papic.md` (new top-of-file § "V1.5+ Architecture Lock — locked 2026-05-16") · `0034_payments_and_cart.md` (service_catalog rows added, all marked V1.5+) · `App_Build_Status.md` · `V1_Gap_Analysis_Status.md`.

### Row 4 — Panood V1 SKU lock (BYO YouTube · per-day pricing)

**The lock — architecture pivot:** drop Cloudflare Stream Live SFU + server-side FFmpeg compositor + RTMP relay through master `@SetnayanWeddings` channel. Replace with **couple's own YouTube channel via OAuth.**

- Setnayan provides broadcaster web UI + multi-cam switching + auto landing-page IFrame embed; video lives on the couple's YouTube forever.
- **Daily Broadcast** `panood_daily_broadcast` ₱499/day (multi-purchase — prep day + ceremony + reception = 3 × ₱499 = ₱1,497).
- **Camera Sync** `panood_camera_sync_daily` ₱99/day (unlocks multi-cam switching for that day).
- **Annual Streaming** `panood_annual_streaming` ₱2,999/year (single-cam unlimited days).
- **Annual Streaming Plus** `panood_annual_streaming_plus` ₱3,999/year (multi-cam unlimited days).

**Retired:** `live_stream_base` ₱2,499 · `live_stream_camera_addon` ₱999 · `live_stream_hour_addon` ₱999 · `broadcast_style_pack` ₱2,999. All Cloudflare-composite features (lower-thirds, scene cards, 4-mode style switching, monogram overlay) are gone — couples use YouTube's own tools or third-party OBS apps.

**Architecture impact:** 0011 becomes a thin broadcaster orchestration layer. SDE / AI Highlight / AI Edited Highlight now consume the couple's YouTube archive via OAuth instead of Cloudflare-recorded feeds. **Day-of-build engineering surface drops ~60%.**

**Files touched:** `CLAUDE.md` · `0011_panood.md` (Pricing table rewritten · "Delivery architecture" section rewritten · Cloudflare-Stream subsections retired · IFrame embed simplification) · `0034_payments_and_cart.md` (retire 4 rows + add 4 rows) · `API_Integration_Checklist.md` (Tier 5.1 Cloudflare Stream Live RETIRED · Tier 5.3 YouTube Live OAuth reframed to per-couple).

### Row 5 — Save-the-Date Video ₱99/render (separate SKU from retired `save_the_date_render`)

**The lock:** add `save_the_date_video_render` ₱99/render as a separate SKU from the retired `save_the_date_render` (which dies with row 1's reframe). The new SKU is for couples who specifically want a 15s social-native teaser MP4 for IG Reels / TikTok, **on top of** the free landing page.

The retired SKU was the *whole* save-the-date primitive at ₱99; this new SKU is a *companion* render that the couple can buy *in addition to* the free landing page when they want shareable video assets.

**Files touched:** `CLAUDE.md` · `0024_save_the_date.md` (preserves the video-render path as an optional add-on) · `0034_payments_and_cart.md` (new SKU row, `is_active=TRUE`).

### Row 6 — Patiktok V1 SKU dual-tier

**The lock:**
- **Setnayan TikTok** ₱999/day — couple posts to the platform's `@SetnayanWeddings` TikTok (cross-marketing).
- **Personal TikTok** ₱1,999/day — couple posts to their own TikTok via OAuth (couple keeps the audience).
- **Overage** ₱49 per +10 videos.

**Files touched:** `CLAUDE.md` · `0017_patiktok.md` · `0034_payments_and_cart.md`.

### Row 7 — V1 blended net margin lock

**The lock (verification ratchet, not new pricing):**
- V1 blended net margin **67–72%** at V1 tax tier (3% PT + 1% LBT + 25% income).
- **~₱4M annual net at 1,000 events.**

Sets the floor that every later SKU change must respect.

**Files touched:** `CLAUDE.md` · `V1_Gap_Analysis_Status.md` · `Pricing.md` (margin table).

### Row 8 — **Marketplace + payment + verification mega-lock**

**The lock (the biggest 05-16 row · multi-system):**

| Component | Lock |
|---|---|
| **Setnayan Pay** | **5.5%** (later superseded by **5.0% flat** in row 16) |
| **Payment gateway** | **Maya Business deferred to V1.5+** (V1 uses manual QR + screenshot reconciliation) |
| **Withholding** | **BIR 0.5%** retained on vendor payouts |
| **Vendor Verification** | **FREE** (unverified) · **₱1,499/yr** (Verified — coming_soon paywall removed) · **₱2,499/yr** (Verified Premium — adds priority placement, photo gallery boost) |
| **All Tools Unlock** | **₱9,999/yr** vendor-side bundle (CRM + analytics + reviews + scheduling + portfolio + Cam Bridge ops) |
| **Boosted Ads** | **3 tiers** — `boost_basic` ₱499/wk · `boost_premium` ₱999/wk · `boost_pro` ₱1,999/wk (impression caps + placement priority + analytics depth differ) |
| **Sponsored Boost long-commit** | **Quarterly** ₱4,999 (13 weeks · 15% discount) · **Annual** ₱14,999 (52 weeks · 40% discount). Replaces `sponsored_boost_weekly` (retired) |
| **Daily.co** | **Retired** — 0019 communications shifts to text-only chat; video deferred to V1.5+ |
| **Anthropic Console** | Per-feature cost caps locked in API_Integration_Checklist |
| **AI Edited Highlight** | **₱4,999 → ₱3,499** (resolves Strategy B ₱2,999 vs charm-pricing conflict) |

**All round-number prices charm-corrected 2026-05-17 per the 4th 2026-05-17 row** (₱5K → ₱4,999 · ₱8K → ₱7,999 · ₱15K → ₱14,999 · ₱1,500 → ₱1,499 · ₱2,500 → ₱2,499). Row 8 amended in place 05-17 with original round-numbers preserved in strikethrough.

**Files touched:** `CLAUDE.md` (huge row) · `0006_vendors_management.md` · `0019_communications.md` · `0034_payments_and_cart.md` · `Pricing.md` · `API_Integration_Checklist.md` · `App_Build_Status.md` · `V1_Gap_Analysis_Status.md`.

### Row 9 — Website copy reconciliation (couple-side 5.5% disclosure)

**The lock:** marketing-site copy on www.setnayan.com gets a transparent-pricing block disclosing the Setnayan Pay rate. **Originally 5.5%** — now needs update to **5.0%** post-row-16 supersede. **Live site as of 2026-05-18 still shows 5.5%** — flagged as a live-site copy fix in `HANDOFF_2026-05-17.md` § 7 Option C.

**Files touched:** `CLAUDE.md` · `0015_main_website.md` (pricing copy section) · `App_Build_Status.md` (live-site copy row).

### Row 10 — Iteration 0037 drafted retroactively + reconciliation backlog

**The lock:**
- Iteration **0037 Event-Day Pre-load** drafted retroactively (was missing from the corpus despite being implied by 0011 + 0012 day-of-event flows).
- **`comp_grants` reconciliation pending** — schema landed before this iteration but no spec; backlogged.
- **turbo.json passlist gap** — observed during a build attempt; backlogged.
- **Sentry prod smoke test deferred** — needs owner Sentry account setup before testable.

**Files touched:** `CLAUDE.md` · new folder `0037_event_day_preload/` (placeholder spec) · `API_Integration_Checklist.md` (Sentry + comp_grants + turbo rows added to backlog section).

### Row 11 — 0023 § 3.4 + 0025 § 3.6.2 reconciled with PR #9 Delete-vs-Blacklist

**The lock:** PR #9 (admin delete-vs-blacklist redesign — landed prior session) had spec drift; § 3.4 of `0023_admin_console.md` and § 3.6.2 of `0025_profile_settings.md` reconciled to match the shipped UI. No new functionality; spec-aligns-to-code.

**Files touched:** `CLAUDE.md` · `0023_admin_console.md` · `0025_profile_settings.md`.

### Row 12 — V1.5+ scaffold unlock (6 iterations ship real routes)

**The lock:** 6 iterations that were "spec-only, no code" before now ship as **scaffolded real routes** in V1 (empty-state landing pages with "Coming V1.5+" CTAs), so couples can see the product surface even when the feature isn't live yet:

- **0005** LED background maker
- **0009** Photo delivery
- **0011** Panood (architecture pivoted in row 4; route shell still ships in V1)
- **0012** Papic (V1.5+ deferred; route shell ships)
- **0017** Patiktok
- **0018** Supplies marketplace

**Files touched:** `CLAUDE.md` · the 6 iteration `.md` files (each gains a "V1 scaffold route" section) · `App_Build_Status.md` (6 rows updated).

### Row 13 — V1 launch walkthrough items #15–#20 closed + Services → Add-ons rename

**The lock:**
- Walkthrough items #15–#20 closed (continuation of the 05-15 + 05-16 walkthrough sweep). Item details in `CLAUDE.md` row text.
- **"Services" → "Add-ons" rename** across customer-facing surfaces (couples thought "services" meant the vendors offering them; "Add-ons" makes the spend-extra-on-top semantics clear).

**Files touched:** `CLAUDE.md` · `0021_couple_dashboard_fully_purchased.md` · `0015_main_website.md` · `0034_payments_and_cart.md` (UI copy).

### Row 14 — Iteration 0000 event-type tile reshuffle

**The lock — event-creation choice carousel:**
- **Drop:** Burial tile (low-fit with platform identity; route remains in schema as a placeholder).
- **Add:** Tournament tile · Christening tile.
- **Pattern:** Carousel + gated-input — couple picks tile first, then event-name field unlocks.
- **V1 still wedding-only selectable** (other tiles route to "Coming soon" empty state).

**Files touched:** `CLAUDE.md` · `0000_app_shell_and_navigation.md` § 2.5b (tile list rewrite).

### Row 15 — Setnayan Concierge V1 lock (2-tier · 7-day trial · later superseded)

**The lock at this point in the day:**
- **2-tier:** `concierge_essentials` ₱2,499 · `concierge_complete` ₱4,999.
- **7-day per-event preview** (later changed to 3-day card-less trial per account in 05-17).
- **Tiered abuse enforcement** (kept in the 05-17 supersede).
- **Rebranded from "Guided Planner"** to "Setnayan Concierge".

**⚠️ SUPERSEDED SAME-WEEK** by 2026-05-17 row 2:
- 2-tier → single-SKU (`concierge_essentials` retired)
- 7-day per-event → 3-day card-less per account
- Wedding-anchored access formula added: `LEAST(GREATEST(wedding + 30d, activated + 12mo), activated + 24mo)`

**Files touched at row 15 lock-time:** `CLAUDE.md` · `0016_step_by_step_plan_builder.md` (renamed conceptually to Concierge) · `0025_profile_settings.md` Tab 7 · `0034_payments_and_cart.md` (2 SKUs added — Essentials later retired).

### Row 16 — **Setnayan Pay flat 5.0%** (supersedes morning's 5.5%/6.5% dual rate)

**The lock — biggest evening reversal:**
- Setnayan Pay convenience fee: **flat 5.0%** on top of vendor price.
- **₱50 minimum** (activates only on vendor bookings below ₱1,000 — ~1–2% of bookings).
- **Option B — vendor absorbs gateway** (Stripe Connect / Airbnb / Lazada pattern).

**The math that ratified 5.0%:** 3% net to Setnayan after all taxes at worst-case tier. Required gross = 3% / (1 − tax_wedge):
- V1 28% wedge → 4.17% gross
- V2 35% wedge (VAT-reg + LBT 2%) → 4.62% gross
- Extreme 40% wedge → 5.00% gross

5.0% holds the 3% net floor under every plausible tax scenario, with cushion for chargebacks, failed transactions, gateway-fee absorption.

**Formula:**
```
fees_centavos = (vendor booking)
              ? MAX(subtotal_centavos × 500 / 10000, 5000)
              : 0
-- i.e., MAX(5% of subtotal, ₱50)
```

**Three rate epochs documented in CLAUDE.md log:** morning 3% (retired) → mid-day 5.5%/6.5% dual-rate (retired) → **evening flat 5.0% LIVE**.

**Files touched:** `CLAUDE.md` · `0034_payments_and_cart.md` § 6 (full rewrite) · `0015_main_website.md` (transparent-pricing copy block needs follow-up — see row 9 above) · `Pricing.md` · `App_Build_Status.md`.

### Row 17 — Vendor convenience-fee absorption opt-in

**The lock:** vendors can opt to absorb the 5.0% convenience fee out of their own listed price, earning a **public-facing "No Convenience Fee" badge** + marketplace filter chip.

**Cart math change** when `vendor.absorbs_convenience_fee = TRUE`:
- Customer sees vendor list price flat (no fee row at checkout).
- Setnayan revenue: unchanged (5% × subtotal, comes out of vendor's payout).
- Vendor effective revenue: 95% of listed price.

**Worked example at ₱100K booking:** Option A (vendor absorbs) → vendor net ~₱93,100; Option B (default) → vendor net ~₱98,000. Vendor sacrifices ~₱4,900 for the badge.

**Schema:**
- `vendors.absorbs_convenience_fee BOOLEAN DEFAULT FALSE`
- `service_orders.vendor_absorbed_fee BOOLEAN DEFAULT FALSE` (snapshot at order time)

**Files touched:** `CLAUDE.md` · `0034_payments_and_cart.md` § 6.8 · `0006_vendors_management.md` (absorbs-fee opt-in section).

---

## 4. Spec corpus files touched on 2026-05-16 (consolidated)

Compiled from the file-trail of each row above:

- **`CLAUDE.md`** — 17 new decision-log rows
- **`Pricing.md`** — margin table · row 8 SKU rows · later charm-corrected 05-17
- **`V1_Gap_Analysis_Status.md`** — multiple iteration rows updated
- **`App_Build_Status.md`** — multiple iteration rows updated
- **`API_Integration_Checklist.md`** — Cloudflare Stream Live retired · Potrace + Worker added · Sentry + comp_grants + turbo backlog
- **`0000_app_shell_and_navigation.md`** — § 2.5b event-type tiles
- **`0002_qr_invitation_system.md`** — absorbs § 5a as first-class Phase 1 hero
- **`0004_invitation_widgets.md`** — pricing table rewrite + Monogram Hero Potrace flow
- **`0006_vendors_management.md`** — verification fee table · absorbs-fee opt-in
- **`0011_panood.md`** — BYO YouTube architecture rewrite
- **`0012_papic.md`** — V1.5+ architecture lock at top of file
- **`0015_main_website.md`** — pricing copy reconciliation (5.5% — needs 5.0% update)
- **`0016_step_by_step_plan_builder.md`** — Concierge V1 lock (later superseded 05-17)
- **`0017_patiktok.md`** — dual-tier pricing
- **`0019_communications.md`** — Daily.co retired
- **`0021_couple_dashboard_fully_purchased.md`** — Services → Add-ons rename
- **`0023_admin_console.md`** — § 3.4 reconciliation with PR #9
- **`0024_save_the_date.md`** — gutted to thin redirect (folded into 0002 Phase 1)
- **`0025_profile_settings.md`** — § 3.6.2 reconciliation · Concierge tab (later updated 05-17)
- **`0034_payments_and_cart.md`** — service_catalog seed: many adds, many retirements
- **`0037_event_day_preload/`** — new folder · placeholder spec
- **`.docx` mirrors** — NOT regenerated (pandoc unavailable in 05-16 env; standing flag)

---

## 5. Engineering gap (what's NOT in the app yet, as of 05-16 EOD)

The 05-16 session was spec-side only. Carried forward into 05-17 sessions:

1. **Production migrations still unshipped** (carried over from 05-15 EOD) — admin/website and admin/reviews routes still 500'ing in prod pending `supabase db push`. See [`2026-05-15_Handoff_to_Next_Agent.md`](2026-05-15_Handoff_to_Next_Agent.md) for the exact command.
2. **None of the 05-16 row schemas exist in any migration yet:**
   - `service_catalog` reprice migrations (Panood retire + add · Patiktok add · Save-the-Date Video add · AI Edited Highlight reprice · Setnayan Pay 5.0% bps · vendor fee-absorption)
   - `vendors.absorbs_convenience_fee` + `service_orders.vendor_absorbed_fee`
   - `hero_monogram.config_json` Potrace fields
   - `events` event_type ENUM swap (Burial out · Tournament + Christening in)
3. **App UI not built** for: marketing pricing page reflecting 5.0% · vendor "No Convenience Fee" badge · marketplace filter chip · 0000 carousel tile reshuffle · Monogram Hero PNG→SVG preview gate · Panood broadcaster UI.
4. **Live site:** still shows 5.5% Setnayan Pay (row 9 copy reconciliation not yet pushed live).
5. **`.docx` mirrors:** flagged for next Cowork session (pandoc unavailable in 05-16 env).

---

## 6. Open questions / parking lot at end-of-day

(Inferred from what 05-17 sessions then picked up.)

1. **Concierge tier model** — 2-tier (₱2,499 / ₱4,999) was locked but Essentials feels weakly differentiated; revisit next session. *(Resolved 05-17: Essentials retired, single-SKU.)*
2. **Concierge trial duration** — 7-day per-event preview ratified; cross-account abuse-detection details not yet specced. *(Resolved 05-17: 3-day card-less per-account + similarity check + tiered enforcement.)*
3. **Wedding-anchored Concierge access formula** — not yet locked. *(Resolved 05-17 row 3.)*
4. **Maya Business V1.5+ disbursement detail** — booked for V1.5+ but the three-rail architecture (Intra-Maya / InstaPay / PESONet) not yet specced. *(Resolved 05-17 row 1.)*
5. **Payment Options Policy Matrix** — admin-side per-account-type method enable/disable not yet specced. *(Resolved 05-17 row 5.)*
6. **Per-vendor pricing copy** — vendor profiles displaying the 5.0% rate to couples vs. vendor's listed-price-only display: copy not yet locked.

---

## 7. Pointer index — where to look for what

| Question | File |
|---|---|
| Full canonical text for any 05-16 lock | `CLAUDE.md` decision log, search row `2026-05-16` (17 rows) |
| Compact 16-row summary of 05-16 | `HANDOFF_2026-05-17.md` § 2 |
| 05-16 evening pricing/payments narrative | `2026-05-17_Session_Handoff_Pricing_and_Payments.md` |
| Predecessor session (prod-broken EOD) | `2026-05-15_Handoff_to_Next_Agent.md` |
| Successor session (event-change flow) | `2026-05-17_Session_Handoff.md` |
| Successor session (consolidated end-of-week) | `HANDOFF_2026-05-17.md` |
| What got superseded same-week | Concierge (row 15) — see `CLAUDE.md` 2026-05-17 row 2 · row 8 prices — charm-corrected per `CLAUDE.md` 2026-05-17 row 4 · Setnayan Pay 5.5% (row 8) — superseded by row 16 same-day |
| Current Setnayan Pay rate | **5.0% flat** (row 16) |
| What the live site currently shows | `WebFetch https://www.setnayan.com` — 5.5% as of 2026-05-17 verification |

---

## 8. Reconstruction provenance + integrity check

**Built:** 2026-05-18 by next-agent Claude session after observing original file deleted during a concurrent-write window 12:56–13:02.

**Sources cross-checked during reconstruction:**

- `CLAUDE.md` lines 375–390 + 392 (17 rows dated 2026-05-16) — full canonical text read
- `HANDOFF_2026-05-17.md` § 2 (16-row summary table) — used for narrative cross-check
- `2026-05-17_Session_Handoff_Pricing_and_Payments.md` (locked-decisions section) — used for rows 8 + 16 + 17 detail enrichment

**Integrity caveats:**

- **Row count:** 17 rows dated 2026-05-16 in `CLAUDE.md` decision log. Earlier "sixteen total" wording in `HANDOFF_2026-05-17.md` § 2 was corrected to "seventeen total" during this reconstruction pass.
- **Tone vs. original:** the original 05-16 handoff was 60 KB; this reconstruction is ~27 KB. The shrinkage is mostly elision of owner-quote prose and what-was-tried-rejected sidebars not preserved in canonical sources.
- **No claim of completeness:** if you find a 2026-05-16 decision referenced elsewhere in the corpus that isn't covered above, treat that as a gap in this reconstruction and update both this file and `CLAUDE.md` if needed.

**Recommended hardening:** commit `2026-05-1{5,6,7}_*.md` and `HANDOFF_*.md` files into git so the next concurrent-write window can't silently delete them.

---

*Reconstructed 2026-05-18 to replace the silently-deleted original. Treat `CLAUDE.md` decision-log rows as canonical; treat this file as a narrative wrapper around them.*
