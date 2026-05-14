# CHANGELOG — 2026-05-11 Session

> Reference for Claude Code: this document captures every meaningful change made in the 2026-05-11 working session. Use this as the canonical "what's new" reference before reading any iteration spec.

## TL;DR — the big shifts

1. **Token wallet retired.** All pricing is PHP-only via PayMongo. Iteration 0003 is now a "billing rail" not a wallet ledger.
2. **Apply-then-pay payment flow.** Not instant checkout. Customer applies → email with payment instructions → pay (bank/GCash/Maya/PayMongo) → Setnayan Team confirms → 24-hr activation SLA.
3. **Pricing pivoted to unlock-tier model.** Landing page, Personalized QR, Panood, Papic all sold as one-time unlocks. Plus event-day storage packs for Papic.
4. **Two folder renames.** `0011_live_stream` → `0011_panood`, `0012_paparazzi` → `0012_papic`.
5. **One new iteration.** `0017_patiktok` — guest TikTok mimic station with X-mark floor sticker + auto-compiled group reel.
6. **Photo retention dropped from 5 years to 90 days.** 30 days full quality + 60 days compressed + deletion at day 91.
7. **6-month launch promo.** Most non-locked SKUs run free for the first 6 months; existing paid SKUs stay paid from day 1.

## Renames (use the new names in all new code)

| Old name | New name | Iteration folder |
|---|---|---|
| Paparazzi | **Papic** | `0012_papic/` (was `0012_paparazzi/`) |
| Live Stream | **Panood** | `0011_panood/` (was `0011_live_stream/`) |
| Token wallet | **Billing rail** | `0003_token_wallet_and_packs/` (folder name unchanged for git history; spec rewritten) |
| Pro Camera Bridge | **SLR Sync** | Cross-iteration feature in both Papic and Panood |
| Pro Bundle | **Landing Page Pro** | Same scope, marketing rename |
| Setnayan Plus | **Setnayan Premium** | Couple subscription |

## New iteration — 0017 Patiktok

See `0017_patiktok/0017_patiktok.md` for full spec.

- **What it is:** Physical X-mark floor sticker at venue. Guests stand on X, app records 3 seconds of them mimicking a TikTok reel. App auto-compiles all 3-sec clips into one continuous video with masked transitions + looping Setnayan-owned music.
- **Pricing:** ₱1,499 per Station Pack (one-time, per event). ₱999 per additional station.
- **Margin:** ~90% (Setnayan cost ~₱150 incl. decal print + shipping + compilation render).
- **Anti-abuse:** Max 500 submissions per station, max 3 submissions per guest QR, station active only during event-day pack window.

## Full pricing structure as of 2026-05-11

### Landing Page tier (per-event 1-year unlocks)

| SKU | Price | Status |
|---|---|---|
| Unlock landing page (basic) | ₱499 | NEW |
| Unlock Pro features of landing page | ₱499 | NEW (replaces ₱200 Pro Bundle / ₱300 recommended) |
| Unlock personalized QR (gateway) | ₱499 | NEW — required to connect Papic + Panood |
| Renewal per component (year 2+) | ₱499/yr | NEW |

### Panood (broadcast — was Live Stream)

| SKU | Price | Notes |
|---|---|---|
| Unlock Panood base | ₱2,999 per event | Includes 3 cameras + 3 hours streaming + HDMI cast free |
| Panood — per additional hour | ₱799/hr | Metered from GO LIVE tap. Auto-pause after 30 min no inbound video. |
| Panood — per additional camera-hour | ₱199/cam-hr | Only counts while cam actively publishing |
| SLR Sync (per camera) | ₱99/cam | Shared with Papic. Pair Canon/Nikon/Sony/Fujifilm via WiFi SDK. |

### Papic (capture — was Paparazzi)

| SKU | Price | Notes |
|---|---|---|
| Unlock Papic | ₱1,999 per event | 3 cameras + system. No storage included. |
| Event days — 1 day / 17 GB | ₱499 | Storage cap = 17 GB |
| Event days — 7 days / 100 GB | ₱2,999 | Storage cap = 100 GB |
| Event days — 30 days / 500 GB | ₱12,999 | Storage cap = 500 GB |
| Storage overage | ₱99/GB | If cap exceeded |
| SLR Sync (per camera) | ₱99/cam | Same shared SKU as Panood |
| Reels maker (per reel) | ₱99 | Per render |
| Reels maker (200-reel bundle) | ₱8,999 | ~55% saving vs per-reel |
| Reels maker (additional after 200) | ₱49 | Discounted overage |

### Capture / Output add-ons

| SKU | Price | Notes |
|---|---|---|
| Custom Monogram Pack | ₱2,500 per event | Event-wide (Papic + Panood + reels) |
| Broadcast Style Pack | ₱3,500 per event | 4 broadcast modes + transitions |
| AI Video Highlight (60s) | ₱2,500 per render | Multi-buy |
| AI Edited Highlight (3-min) | ₱6,000 per render | Multi-buy |
| **4K Upgrade** | **₱1,499 per event** | NEW — toggles all video to 4K. Storage cap auto-expands 3x. |

### Guest engagement

| SKU | Price | Notes |
|---|---|---|
| Video Dedication (15s, per 100-dedication block) | ₱299 | NEW — Voice-only removed, video-only |
| Video Dedication — additional 100-block | ₱299 | Multi-buy |
| **Patiktok Station Pack** | **₱1,499 per event** | NEW — TikTok mimic station |
| **Patiktok additional station** | **₱999 per extra station** | NEW |

### Setnayan Premium (couple subscription)

| SKU | Price | Notes |
|---|---|---|
| Setnayan Premium — weekly | ₱79/wk | Auto-cancels post-wedding |
| Setnayan Premium — quarterly upfront | ₱599 (₱46/wk effective) | One-time payment, 13 weeks access |

Unlocks: Assisted Vendor Search + Atelier + AI Albums + AI Highlight Reel + Voice/Video Guestbook compilation + premium filter/template packs + AI seating + OCR receipts + e-signatures + budget forecasting.

### Vendor subscription (Din, Phase 3 / ~6-9 mo post-V1)

| SKU | Price | Notes |
|---|---|---|
| Vendor — weekly | ₱249/wk | No commitment |
| Vendor — annual upfront | ₱9,999 (₱192/wk effective) | One-time, 52 weeks access. 23% off vs weekly. |
| LED logo placement (vendor) | ₱500/event | On top of subscription |
| Panood brand plug (vendor) | ₱500/event | On top of subscription |

### Planner Studio (per-account weekly)

| SKU | Price |
|---|---|
| Planner Studio — weekly | ₱499/wk |

## Payment flow (decided 2026-05-11)

**The flow:** Apply → Email payment instructions → Customer pays via bank transfer / GCash / Maya / PayMongo → Setnayan Team confirms manually → Service activates within 24 hours.

**Why:** PH B2B is bank-transfer + GCash heavy. Forcing instant card checkout would lock out the dominant payment method.

**Account states required:** `pending_application` → `pending_payment` → `active` → `expired` / `cancelled`.

**Refund window:** vendor annual ₱9,999 non-refundable past 14 days. Quarterly Premium ₱599 non-refundable past 14 days.

**PayMongo fee:** ~3.5% applies only to card payments. Bank transfer + GCash are free for Setnayan.

**Operational cost:** ~₱5-10 per application in Setnayan Team support time. Will be automated by Year 2.

See `project_setnayan_payment_flow.md` in memory for full spec.

## Photo retention policy (revised)

**Old (legacy):** 5-year cold tier retention on R2.

**New (2026-05-11):**
- Days 1-30: Full original quality, real-time download from dashboard
- Days 31-90: Files compress ~70% further. Still viewable + downloadable at reduced quality.
- Day 91+: Files deleted from Setnayan R2. Couple's responsibility for own archive.

Impact: storage cost drops ~45% for events past 30 days. Couples encouraged to download within first 30 days. The "Event-end auto-curation + 30-day download window" feature replaces the previous "Daily Drive transfer" SKU.

## Video format constraints

| Format | Length | Where used |
|---|---|---|
| Papic capture clip | 5 sec | Wedding-day candid coverage |
| Patiktok mimic clip | ~3 sec | Patiktok station — guest contribution |
| Video Dedication | 15 sec | Guest-to-couple messages |
| Voice-only Dedication | — | REMOVED. Video-only. |
| Panood broadcast | per-hour | Live broadcast (3 hr base) |

## Apparatus cost cheat sheet (Setnayan spend per event)

| SKU | Setnayan cost |
|---|---|
| Unlock landing page (basic / Pro) | ₱0 each |
| Unlock personalized QR | ₱1 |
| Unlock Panood base (if 3 cams × 3 hrs fully used) | ₱120 |
| Panood per extra hour | ₱50 |
| Panood per cam-hour | ₱30 |
| SLR Sync per camera | ₱0 |
| Unlock Papic base | ₱15 |
| Event days — 1 day / 17 GB | ₱23 |
| Event days — 7 days / 100 GB | ₱135 |
| Event days — 30 days / 500 GB | ₱675 |
| Reels render | ₱1 per reel |
| 4K Upgrade | ₱450 per event |
| Video Dedication 100-block | ₱10 per block |
| Patiktok Station Pack | ₱150 per event |
| Patiktok additional station | ₱120 per station |
| Custom Monogram Pack | ₱5 |
| Broadcast Style Pack | ₱5 |
| AI Video Highlight | ₱10 per render |
| AI Edited Highlight | ₱30 per render |

## 6-month launch promo rule

Anything **already-paid in CLAUDE.md** stays paid from day 1. Everything else runs **free for the first 6 months**, then flips to its recommended price. Physical goods (photo books, NFC pieces, QR cards, decals like Patiktok) stay paid from day 1 because they have real fulfillment cost.

## Storage / retention cost model

R2 hot tier: $0.015/GB/mo = ₱0.85/GB/mo.

Couple buys storage pack:
- 1 day = 17 GB capacity → cost ₱23 (storage over 90 days with compression-after-30-days)
- 7 days = 100 GB capacity → cost ₱135
- 30 days = 500 GB capacity → cost ₱675
- Margin on storage packs: ~95% after the compression-after-30-days policy

## Iteration cross-references

- **0003 (Billing Rail)**: handles apply-then-pay flow, payment confirmation, BIR receipts, account state machine. **Major rewrite from token wallet.**
- **0011 (Panood)**: was Live Stream. Rename folder + all internal references.
- **0012 (Papic)**: was Paparazzi. Rename folder + all internal references. Anti-abuse rules: 21-day active window, 5,000-photo cap, 90-day hard expiry from purchase, no-backdating.
- **0017 (Patiktok)**: NEW iteration. Guest mimic station with 3-sec clips + auto-compile + looping music.

## Companion artifacts

| Artifact | Purpose | Path |
|---|---|---|
| Master pricing catalogue | Every SKU + price + cost + margin + status | `Pricing_Workbook_Plain_English.xlsx` |
| Three-scenario revenue model | Basic / Premium / All-In couples with line-item math | `Cost_vs_Revenue_Analysis.xlsx` |
| Revenue projection slider | Interactive HTML with sliders for couples/vendors/planners | `Revenue_Slider_Prototype.html` |
| Subscription pivot recommendation | Strategic doc — supersedes hybrid recommendation | `Pricing_v2_Subscription_Pivot_Recommendation.docx` |
| Master service catalogue (legacy snapshot) | Earlier consolidated price list | `Master_Service_Catalogue_2026-05-10.docx` |

The xlsx workbook is the canonical source of truth. The .docx files are dated snapshots — generate fresh ones for new reports.

## Conflicts to resolve

These remain UNRESOLVED — owner decision needed before V1 launch:

1. **Pricing model mismatch.** Customer Magazine + Pricing Magazine describe a 4-tier model (Free / Essentials ₱2,499 / Premium ₱4,999 / Pro Event ₱9,999) with bundles. CLAUDE.md and this CHANGELOG describe unlock-tier + à la carte SKUs. Pick one.
2. **Shooter Slots ladder.** Master Blueprint mentions 4-tier shooter ladder (₱1,499 / ₱2,299 / ₱3,999 / ₱5,999). CLAUDE.md locks at 3-seat ₱2,000 / 5-seat ₱3,500. Reconcile.
3. **Photo Team service tiers.** Pricing Magazine sells crew (Solo ₱15K / Duo ₱28K / Premium ₱45K). CLAUDE.md says cut by apparatus rule.
4. **Founding Member program.** Marketing promises ₱500 off Premium + lifetime app access for first 500 couples. Not in CLAUDE.md SKU table.

## Memory references (for Claude Code session continuity)

The following memory files contain rules that apply across all iterations:

- `feedback_setnayan_pricing_workbook_sync.md` — every feature add/remove must sync to `Pricing_Workbook_Plain_English.xlsx`
- `project_setnayan_billing_rail_php_only.md` — token wallet retired, PHP-only via PayMongo
- `project_setnayan_payment_flow.md` — apply-then-pay flow + 24-hr SLA
- `feedback_setnayan_web_mobile_parity.md` — every mockup must include web + mobile side-by-side
- `feedback_setnayan_file_per_iteration.md` — every iteration = folder with 3 files (.md / .html / .docx)
- `feedback_setnayan_charge_for_apparatus.md` — every SKU prices equipment/seats/templates/widgets, NOT time
- `project_setnayan_universal_event_platform.md` — Setnayan is event platform, weddings are V1, ~22 event types planned

---

*This document is the authoritative reference for the 2026-05-11 session. If subsequent sessions diverge from anything stated here, update this CHANGELOG accordingly or supersede with a new dated CHANGELOG.*
