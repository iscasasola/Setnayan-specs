# Setnayan Pricing — V1 Master Reference

> **Purpose.** Single consolidated view of every Setnayan-platform price + vendor-side fee structure. Each row cross-references the owning iteration `.md` where the canonical decision lives — this doc is a navigable index, not the source of truth.
>
> **Last sweep:** 2026-06-04 — **LIVE-SITE RECONCILIATION.** Realigned to the published catalog on setnayan.com (`/pricing`, `/`, `/features`, `/for-vendors`, `/how-it-works`). The live site is now the source of truth; where it contradicts itself, `/pricing` wins. See **§ 0** for the authoritative live catalog and **§ 0.1** for unresolved site-internal contradictions the owner must settle. Sections § 2–§ 8 below are the pre-reconciliation spec history, retained for lineage but **superseded by § 0 wherever they disagree.**
> **Update protocol** (see § 11): when a price changes, update the owning iteration `.md` → CLAUDE.md decision log → this doc → regenerate `Pricing.docx` via pandoc.
>
> **Known drift:** the CLAUDE.md § Cost-per-event cheat sheet is stale in places — see § 7. As of 2026-06-04 the larger drift is spec-vs-live-site; see § 0 and the standalone `Site_vs_Spec_Reconciliation_2026-06-04.md`.

---

## 0. LIVE SITE CATALOG — authoritative as of 2026-06-04

> Mirrors setnayan.com/pricing exactly. Each customer SKU carries a build state the site shows: **Live**, **In build**, or **Coming soon**. `[Token]` = "Token Worthy" — redeemable with vendor tokens at a rate the vendor sets in their dashboard. This section supersedes §§ 2–8 wherever they disagree.

### 0.A Couple-side software SKUs

| SKU | Price | Build state | What the site says |
|---|---|---|---|
| Animated Monogram | ₱2,499 | **Live** | Bespoke Monogram with Animation |
| Custom QR per Guest | ₱1,499 | **Live** | 1 QR code per guest (up to 250 pax) |
| Indoor Blueprint | ₱1,499 | **Live** | Guided from entrance to table |
| Papic (5 Seats) `[Token]` | ₱2,999 | **Live** | Unlimited photos + unlimited videos for 5 hours |
| Papic Guest (Disposable Camera) `[Token]` | from ₱2,999 | **Live** | 24 photos + 10 × 5-second videos |
| Today's Focus | ₱1,499 | **Live** | Assisted planning (the AI planner — replaces "Setnayan Concierge" naming) |
| High Res Archive | ₱2,999 / yr | In build | Yearly archive, billed per year |
| Live Background `[Token]` | ₱2,499 | In build | LED wall design background with monogram (was "Pailaw"/LED Background) |
| Panood (Website Add-on) `[Token]` | ₱3,499 / day | In build | Live streaming per day embedded on the event page |
| Patiktok `[Token]` | ₱2,499 | In build | Up to 250 TikTok recordings |
| Pro Website `[Token]` | ₱5,499 | In build | Premium invitation + event page + editorial |
| Call-Time Escalator | ₱1,999 | Coming soon | SMS update to all vendors |
| Camera Bridge | ₱1,999 | Coming soon | Connect DSLR to Papic and Panood |
| Guest Stories (Papic Add-on) | ₱1,999 | Coming soon | 30-second story maker for guests |
| Live Venue Photo Wall `[Token]` | ₱2,499 | Coming soon | Live photo collage with live count |
| Pabati | ₱999 | Coming soon | Up to 300 × 5-second videos |
| Pakanta `[Token]` | ₱2,499 | Coming soon | Create a special song for the couple (single SKU — was 3 tiers) |
| Pakulay | ₱0 | Coming soon | Free mood board · palette + visual identity for every account |
| SDE (Papic Add-on) `[Token]` | ₱3,499 | Coming soon | 3-minute video compilation from Papic (a.k.a. "Same-Day Edit") |
| Thank You Video (Papic Add-on) `[Token]` | ₱5,499 | Coming soon | 5-minute thank-you video for attendees |

### 0.B Bundles

| Bundle | Price | Scope |
|---|---|---|
| Setnayan Guided Planner Suite | ₱11,999 | one-time, per event |
| Setnayan Comprehensive Media Pack Bundle | ₱16,999 | one-time, per event |

### 0.C Vendor-side (canonical = `/pricing`)

| SKU | Price | Annual | Notes |
|---|---|---|---|
| Pro Vendor (28-day prepaid block) | ₱2,499 / 28 days | ₱24,999 / yr (save ₱7,488 · 23%) | 1 category · 5 sub-seats · free vendor site · 100 complimentary tokens once verified |
| Enterprise Vendor (28-day prepaid block) | ₱5,499 / 28 days | ₱54,999 / yr (save ₱16,488 · 23%) | all categories · unlimited sub-seats · 100 tokens |
| Additional Branch (per branch) | ₱999 / 28 days | — | Enterprise only · apply-then-pay (0034) · BUILT 2026-06-05 (price ₱999 charm + Enterprise gate owner-locked 2026-06-05; supersedes the prior "Pro+ only") |
| Feature boost (per feature, 7 days) | 4–100 tokens | — | redeemed from token balance |

**Token packs** (vendors top up; redeem against any `[Token]` couple SKU at the vendor's dashboard rate):

| Pack | Price |
|---|---|
| 4 tokens | ₱1,000 |
| 10 tokens | ₱2,400 |
| 25 tokens | ₱5,500 |
| 50 tokens | ₱10,000 |
| 100 tokens | ₱18,000 |

Verified vendors receive **100 complimentary tokens** once verification is approved.

**Vendor token sinks (what a token buys):** (1) **answer a matched inquiry** — 1–3 tokens (₱100–₱300) to unlock a couple, idempotent per (vendor·event), covers ALL the vendor's services, banded by the wedding's region (see DECISION_LOG 2026-06-05 burn-reprice); (2) **redeem** against any `[Token]` couple SKU at the vendor's dashboard rate; (3) **feature boost** (4–100 tokens / 7 days); (4) **🆕 sync an outside event = 1 token (₱100)** — adds an off-platform event to the vendor's stats + free compile-all-events portfolio website + earns **1 verified review** + blocks the date on the shared anti-double-book calendar (owner-locked 2026-06-05; see [`Vendor_Value_Proposition_and_Reviews_2026-06-05.md`](Vendor_Value_Proposition_and_Reviews_2026-06-05.md) Part C2).

### 0.D How money flows (per `/pricing`)

- **You → Setnayan:** software SKUs above, paid at 100% retail. PHP only · BIR receipts on every transaction.
- **You → Vendor (off-platform):** vendor packages settle directly with the vendor (bank / GCash / in person). Setnayan takes **0% commission**.
- **Vendor → Setnayan:** 28-day prepaid subscription for marketplace presence + token top-ups to redeem software for their own events.

---

## 0.1 UNRESOLVED SITE-INTERNAL CONTRADICTIONS — owner must settle

The live site disagrees with itself. `/pricing` is treated as canonical above, but these need a real decision and a single-source fix on the website:

1. **Vendor Pro price appears four different ways.** `/pricing` ₱2,499 / 28 days · homepage ₱1,999 / 28 days · `/for-vendors` ₱4,999 / **week** (founder ₱3,999/wk) · `/how-it-works` ₱499 / **week**. These are different *models*, not typos.
2. **Commission.** Homepage + `/pricing` say **0% commission**; `/for-vendors` says Setnayan Pay is a **flat 5.0%** on every booking. Mutually exclusive.
3. **Verification badge.** Homepage charges **₱1,499 lifetime + ₱499 refresh**; `/pricing` and `/for-vendors` say listing/verification is free with **100 complimentary tokens** on approval.
4. **"Today's Focus" vs "Setnayan Concierge."** The AI planner SKU is **Today's Focus ₱1,499** (homepage, `/pricing`). But `/for-vendors` still advertises a free **"Setnayan Concierge"** worth **₱2,499** per booked couple. Same product two names + two prices, or two different things? Decide and unify.
5. **Enterprise** (₱5,499 / 28 days) and **Today's Focus** (₱1,499) are consistent across pages — no action.

---

## 1. Pricing rules (locked)

- **Currency:** PHP only. Never quote USD.
- **Storage format:** centavos in `service_catalog` (e.g., ₱4,999 = 499,900 centavos).
- **Display format:** ₱ with comma separators (₱4,999 not ₱4999).
- **Charm pricing ladder** (locked 2026-05-08, refined 2026-05-12, B2B tiers charm-corrected 2026-05-17): ₱49, ₱99, ₱199, ₱499, ₱999, ₱1,499, ₱1,999, ₱2,499, ₱2,999, ₱4,999, ₱9,999, ₱19,999, ₱24,999. Higher tiers follow the same -1 pattern (₱49,999, ₱99,999, ₱249,999, ₱799,999 for B2B).
- **Apparatus pricing principle:** every SKU prices the tool / service / capability — never raw hardware, labor, or hours (except per-day / per-hour capacity units for time-bounded services like Panood).
- **Payment model (reconciled 2026-06-04):** customers pay **apply-then-pay direct in PHP** with manual admin reconciliation (BIR receipt on every software purchase). The iteration 0003 *customer* token wallet stays retired — couples never see a token balance. **However, a vendor-side token economy is now LIVE on the site:** vendors buy token packs (4–100 tokens, ₱1,000–₱18,000), receive 100 complimentary tokens on verification, and redeem them against any "Token Worthy" couple SKU (marked `[Token]` in § 0) at a rate they set in their dashboard. This reverses the blanket "no tokens UI anywhere" memory rule — tokens exist on the **vendor** side only. See § 0.C.
- **No-refund SKUs** are marked explicitly; refundable SKUs default to 14-day refund window unless otherwise stated.
- **2D billing model** (locked 2026-05-17): every `service_catalog` row carries `time_recurrence ∈ (one_time, weekly, quarterly, annual, lifetime)` × `event_scope ∈ (per_event, all_events)`. Lets per-event couple SKUs and annual-all-events vendor / organizer subscriptions live in the same table without enum collision. See [0034 Payments & Cart](0034_payments_and_cart/0034_payments_and_cart.md) service_catalog seed sections (h)–(p).
- **Cost Watch primitive** (locked 2026-05-17): every paid SKU consumption logs actual Setnayan-incurred cost + `cost_breakdown JSONB` to `service_render_costs`. Materialized view `service_catalog_cost_watch` exposes highest-render / avg / p95 / cost-to-price ratio + 🟢/🟡/🔴 health flag inline in the [0023 admin console § 3.5](0023_admin_console/0023_admin_console.md). Pricing decisions use "highest single render" as the floor.
- **Frequency-change two-admin approval** (locked 2026-05-17): post-launch changes to `time_recurrence` or `event_scope` require two-admin approval (same gate as mid-quarter price changes > ₱500). Existing active subscriptions keep their old frequency until natural expiry (cart-snapshot principle, locked 2026-05-12).

---

## 2. Core platform SKUs · couple-side

### 2.1 Papic — paparazzi capture

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Papic 3-seat | ₱1,499 | 149,900 | ACTIVE | [0012_papic.md:86](0012_papic/0012_papic.md) |
| Papic 5-seat | ₱2,499 | 249,900 | ACTIVE | [0012_papic.md:87](0012_papic/0012_papic.md) |
| + Camera (per additional seat, multi-purchase) | ₱999 | 99,900 | ACTIVE | [0012_papic.md:88](0012_papic/0012_papic.md) |
| + Credits (per +1,000 capture-pool credits, multi-purchase) | ₱299 | 29,900 | **V1.5+ DEFERRED** | [0012_papic.md:78](0012_papic/0012_papic.md) |
| Cam Bridge — per slot / per day | ₱99 | 9,900 | ACTIVE | [0012_papic.md:89](0012_papic/0012_papic.md) |
| Cam Bridge — all slots / per day | ₱249 | 24,900 | ACTIVE | [0012_papic.md:90](0012_papic/0012_papic.md) |
| Cam Bridge — annual (all seats, unlimited events) | ₱2,499 | 249,900 | ACTIVE | [0012_papic.md:91](0012_papic/0012_papic.md) |
| Premium Guest Camera Pack (event-wide: archive + Drive sync + auto-recap + watermark-free) | ₱1,499 | 149,900 | **V1.5+ DEFERRED** | [0012_papic.md:98](0012_papic/0012_papic.md) |
| Personal Album (per guest, opt-in digital album) | ₱49 | 4,900 | **V1.5+ DEFERRED** | [0012_papic.md:99](0012_papic/0012_papic.md) |
| Memory Book (per guest, opt-in printable hardcover PDF) | ₱249 | 24,900 | **V1.5+ DEFERRED** | [0012_papic.md:100](0012_papic/0012_papic.md) |
| Per Template (premade unlock, multi-purchase) | ₱49 | 4,900 | ACTIVE | [0012_papic.md:173](0012_papic/0012_papic.md) |

> **Note on V1.5+ deferred SKUs in Papic:** seat SKUs + camera add-on + Cam Bridge tiers + per-template ship in V1. The 4 deferred SKUs (Credits, Premium Guest Camera Pack, Personal Album, Memory Book) reactivate in V1.5+ — they're documented here for spec continuity, not as bookable items at launch.

### 2.2 Panood — live broadcast

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Daily Broadcast (up to 6 cams, per event-day) | ₱2,499 / day | 249,900 | ACTIVE | [0011_panood.md:60](0011_panood/0011_panood.md) |
| Annual Streaming (unlimited days, all events on account) | ₱19,999 / year | 1,999,900 | ACTIVE | [0011_panood.md:61](0011_panood/0011_panood.md) |
| Cam Bridge — per slot / per day | ₱199 | 19,900 | ACTIVE | [0011_panood.md:62](0011_panood/0011_panood.md) |
| Cam Bridge — all slots / per day | ₱249 | 24,900 | ACTIVE | [0011_panood.md:62](0011_panood/0011_panood.md) |
| Cam Bridge — annual (all seats, unlimited events) | ₱2,499 / year | 249,900 | ACTIVE | [0011_panood.md:62](0011_panood/0011_panood.md) |
| Template Pack — per event-day | ₱799 | 79,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Template Pack — annual (all events) | ₱7,999 / year | 799,900 | ACTIVE | [0011_panood.md:63](0011_panood/0011_panood.md) |
| Broadcast Style Pack (News / Cinematic / Sports / Royalty + transitions, event-wide) | ₱2,999 | 299,900 | ACTIVE | [0011_panood.md:523](0011_panood/0011_panood.md) |
| AI Video Highlight (60-second auto-edit) | ₱1,999 / render | 199,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |
| AI Edited Highlight (3-minute auto-edit, repriced 2026-05-16 from ₱4,999) | ₱3,499 / render | 349,900 | ACTIVE — multi-purchase | [0011_panood.md:98](0011_panood/0011_panood.md) |
| Same-Day Edit (post-event human-curated highlight) | ₱24,999 / event | 2,499,900 | ACTIVE — multi-purchase | [0011_panood.md:575](0011_panood/0011_panood.md) |

### 2.3 Patiktok — guest reel builder (iteration 0017)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Patiktok Cam Bridge — per day (flat, all guests) | ₱49 / day | 4,900 | ACTIVE | [0017_patiktok.md](0017_patiktok/0017_patiktok.md) |
| Patiktok Cam Bridge — annual (all-events) | ₱249 / year | 24,900 | ACTIVE | [0017_patiktok.md](0017_patiktok/0017_patiktok.md) |

> Patiktok Cam Bridge tiers reflect lower per-DSLR value than Panood/Papic (short-form reels vs. broadcast / paparazzi). Locked 2026-05-17 as part of the 6-SKU Cam Bridge rollout.

### 2.4 Save-the-Date (iteration 0024)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Save-the-Date Video (MP4 download for social, repriced 2026-05-17 from ₱99) | ₱199 / render | 19,900 | ACTIVE | [0024_save_the_date.md:47](0024_save_the_date/0024_save_the_date.md) |

### 2.5 Invitation Widgets · Pro tiers (iteration 0004)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Monogram Hero (animated SVG-trace + custom video/photo background) | ₱1,999 | 199,900 | ACTIVE — **NO REFUND** | [0004_invitation_widgets.md:70](0004_invitation_widgets/0004_invitation_widgets.md) |
| Live Schedule (auto-scroll + "happening now" highlight) | ₱999 | 99,900 | ACTIVE — refundable 14d | [0004_invitation_widgets.md:78](0004_invitation_widgets/0004_invitation_widgets.md) |

### 2.6 Pakanta — AI-generated wedding song (iteration 0036)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Pakanta Basic (1 song, 1 style, 24-hr turnaround, no lyric approval) | ₱1,999 | 199,900 | ACTIVE | [0036_pakanta.md:37](0036_pakanta/0036_pakanta.md) |
| Pakanta Premium (1 song, 2 versions, 3 remakes, lyric approval, 2–5 day) | ₱3,999 | 399,900 | ACTIVE | [0036_pakanta.md:38](0036_pakanta/0036_pakanta.md) |
| Pakanta Wedding Suite (3 DNA-matched songs, 3 remakes total, 5–7 day) | ₱9,999 | 999,900 | ACTIVE | [0036_pakanta.md:39](0036_pakanta/0036_pakanta.md) |

### 2.7 Bespoke Monogram (iteration 0037)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Bespoke Monogram (AI-generated luxury mark, 30 refinements included) | ₱2,999 | 299,900 | ACTIVE — **NO REFUND** | [0037_bespoke_monogram.md:23](0037_bespoke_monogram/0037_bespoke_monogram.md) |
| Bespoke Monogram + 10 Refinements | ₱199 | 19,900 | ACTIVE — multi-buyable | [0037_bespoke_monogram.md:101](0037_bespoke_monogram/0037_bespoke_monogram.md) |

### 2.8 LED Background (iteration 0005)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| LED Background — Standard | ₱599 | 59,900 | ACTIVE | iteration 0005 |
| LED Background — Custom tier (up to 90-min loops) | ₱899 | 89,900 | ACTIVE | CLAUDE.md decision log 2026-05-08 |

> **Verify:** LED prices not directly grepped from 0005 iteration .md in the latest sweep. Cross-check against iteration 0005 before using in production.

### 2.9 Professional Mood Board · Composite Scene renders (iteration 0010 V1.1)

Pay-per-render pack pricing locked 2026-05-22 — NO subscription, no activation gate, use anytime. Render = AI-generated composite of host's reference photos + couple's palette, auto-segmented into layered transparent PNGs for live Color Range Manipulator recoloring. Per [0010 § Professional Mood Board (V1.1+) · Composite Scene generator](0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator).

| SKU | Renders | Price | Centavos | Per-render | Margin (API ~₱30) | Status | Source |
|---|---|---|---|---|---|---|---|
| Professional Mood Board · Single render | 1 | ₱199 | 19,900 | ₱199 | 85% | ACTIVE (V1.1) | [0010_mood_board.md § Professional Mood Board](0010_mood_board/0010_mood_board.md#professional-mood-board-v11--composite-scene-generator) · [CLAUDE.md 2026-05-22 fifth row](CLAUDE.md) |
| Professional Mood Board · Studio pack | 50 | ₱8,999 | 899,900 | ₱180 | 75% | ACTIVE (V1.1) | same |
| Professional Mood Board · Production pack | 150 | ₱24,999 | 2,499,900 | ₱167 | 68% | ACTIVE (V1.1) | same |

**Host access pattern:** hosts (couples) cannot trigger renders directly without purchasing packs. Two paths: (a) **stylist-mediated** — host pins a stylist who holds Professional Mood Board credits; stylist generates the render for them; (b) **DIY direct** — host purchases their own pack. Drives stylist marketplace adoption while preserving DIY access.

**Industry positioning:** premium 3D event design renderings cost ₱45K-₱560K per render at top design studios; Setnayan delivers comparable visualization at ₱167-₱199/render = 99%+ savings. Marketing copy locked: *"Stop quoting clients ₱45,000+ for design renders. Generate unlimited concept visualizations with Professional Mood Board from ₱167/render. Win more bookings."*

---

## 3. Setnayan Concierge (iteration 0016)

Single-SKU model locked 2026-05-17 (Essentials ₱2,499 tier retired same-week).

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Setnayan Concierge Complete (12-month access · 9-step roadmap · daily nudges · priority vendor matching · honeymoon planning included) | ₱4,999 / 12mo | 499,900 | ACTIVE — single tier | [0016_step_by_step_plan_builder.md:22](0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) |
| Concierge 3-day free trial (card-less, one per account, abuse-gated) | FREE | 0 | ACTIVE | [0016_step_by_step_plan_builder.md:66](0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) |

**Expiry rule** (per iteration 0016 § 0): `concierge_expires_at = LEAST(wedding_date + 30 days, concierge_activated_at + 24 months)`, minimum `activated_at + 12 months`. Wedding-anchored, not purchase-anchored.

---

## 4. Vendor-side platform SKUs · vendor pays Setnayan (iteration 0022)

These are what verified vendors pay Setnayan for visibility, tools, and integrations. Couple-side never sees these prices.

### 4.1 Vendor Pro subscription

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Vendor Pro Weekly (analytics + landing styling, auto-renew, pauseable anytime) | ₱499 / week | 49,900 | ACTIVE | [0022_vendor_dashboard.md:286](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Extended Pin (each, stacks with Pro, uncapped) | ₱49 / week | 4,900 | ACTIVE | [0022_vendor_dashboard.md:428](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.2 Boosted Ads (geo-radius targeting)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Boosted Ads 5km (top-of-search ranking, 5km radius) | ₱4,999 / week | 499,900 | ACTIVE | [0022_vendor_dashboard.md:464](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Boosted Ads 10km (citywide reach) | ₱7,999 / week | 799,900 | ACTIVE | [0022_vendor_dashboard.md:465](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Boosted Ads 20km (regional reach) | ₱14,999 / week | 1,499,900 | ACTIVE | [0022_vendor_dashboard.md:466](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.3 Sponsored Boost (premium long-commit)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Sponsored Boost Quarterly (3 months · 30km radius · verified-only) | ₱249,999 | 24,999,900 | ACTIVE | [0022_vendor_dashboard.md:479](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Sponsored Boost Annual (12 months · 30km · verified-only · ~20% discount vs Quarterly × 4) | ₱799,999 | 79,999,900 | ACTIVE | [0022_vendor_dashboard.md:480](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.4 Tool integrations (à la carte)

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| Mood Board Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:687](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Seat Arrangement Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:688](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Palette Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:689](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| QR Reader Integration | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:690](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| Advanced Pricing Tier (multi-rate / time-of-day / bundle engine) | ₱99 / week | 9,900 | ACTIVE | [0022_vendor_dashboard.md:691](0022_vendor_dashboard/0022_vendor_dashboard.md) |
| **All Tools Unlock Bundle** (all 5 integrations, unlimited per account) | ₱9,999 / year | 999,900 | ACTIVE | [0022_vendor_dashboard.md:695](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.5 Non-Pro vendor utilities

| SKU | Price | Centavos | Status | Source |
|---|---|---|---|---|
| QR Retrieval (per-event access for non-Pro vendors) | ₱500 / event | 50,000 | ACTIVE | [0022_vendor_dashboard.md:349](0022_vendor_dashboard/0022_vendor_dashboard.md) |

### 4.6 Specialized Pro Tools · per-service AI / specialized-coding add-ons (V1.x+ rollout · locked 2026-05-22)

Per-service Professional [Tool] subscriptions independent of the universal Free/Pro/Max vendor tier (§ 4.1-4.5). A vendor in any tier can subscribe to any Specialized Pro Tool matching their canonical_service. Per [CLAUDE.md 2026-05-22 fifth decision-log row](CLAUDE.md) and [0022 § 11 Specialized Pro Tools subscription management](0022_vendor_dashboard/0022_vendor_dashboard.md).

**13 SKUs at ₱888/wk PLACEHOLDER pricing** — deliberately non-charm-priced marker so they're impossible to miss when finalizing. Final pricing TBD per SKU; pure-code likely settles ₱499-₱999/wk, AI likely ₱1,999-₱2,999/wk with bundled allowance + overage packs.

| SKU | Cost shape | Vendor service category | Price (placeholder) | Status |
|---|---|---|---|---|
| Professional Coordination | Pure code | `wedding_coordination` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Catering | Pure code | `catering` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional HMUA | Pure code | `hmua` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Music DJ/Emcee/Host | Pure code | `dj_emcee_host` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Live Band | Pure code | `band_live_music` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Cake/Desserts | Pure code | `cake_desserts` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Sound/Lighting | Pure code | `lights_sound` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Rings/Officiant/Transport/Booth | Pure code | various | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Photo Tools | Hybrid (OpenCV + AI ranking) | `photographer` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Video Tools | AI (video editing) | `videographer` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Florist | AI (bouquet visualizer · reuses Mood Board engine) | `florist` | ₱888 / week | PLACEHOLDER · V1.x |
| Professional Stationery | AI (invitation designer) | `invitation_print` / `stationery_signage` | ₱888 / week | PLACEHOLDER · V1.x+ |
| Professional Attire | AI (try-on visualizer · reuses Mood Board engine) | `bridal_gown` / `groom_suit` / `entourage_attire` | ₱888 / week | PLACEHOLDER · V1.x+ |

> **Professional Mood Board (§ 2.9 above)** is the 14th SKU in this portfolio but ships pay-per-render packs instead of subscription. Owner directive: *"mood board out"* of the ₱888 placeholder set; its pack pricing is the FINAL model.

**V1.x rollout sequencing:** Professional Mood Board ships V1.1 first (parallel with Stylist marketplace launch per [0047](0047_style_driven_marketplaces/0047_style_driven_marketplaces.md)) · Professional Coordination second · Photo + Video + Catering + Florist third batch · others V1.x+ as marketplaces launch.

---

## 5. Vendor-to-couple fee structures · per-vendor policies (NOT Setnayan SKUs)

These are fee policies vendors set themselves at onboarding (iteration 0006). They're NOT Setnayan platform prices — they're between the vendor and the couple. Setnayan surfaces them in confirmation modals and applies them via the mediator (V1) or via 0034 Phase 2 auto-debit.

### 5.1 Reschedule fee policy (date changes · iteration 0021 § 10.9)

Vendor declares at onboarding whether they charge a fee for date changes, scaled to proximity. Common patterns:

- *"No fee 60+ days out, 50% inside 30 days, 100% inside 14 days"*
- *"₱5,000 flat fee for any date change inside T-21 days"*
- *"No reschedule fee — included in base price"*

Surfaced in the § 10.1 confirmation modal when ≥1 affected vendor has a non-zero fee at the current proximity. V1: manual mediator action. V2 (0034 Phase 2): auto-debit on vendor accept.

### 5.2 Relocation fee policy (venue changes · iteration 0021 § 11.3)

Vendor declares travel-cost rules at onboarding. **Illustrative examples** from the spec:

- *"Free within 30 km of home base; ₱5,000 per additional 10 km"*
- *"Free within Metro Manila; ₱15,000 flat for Tagaytay; case-by-case beyond"*
- *"₱8,000 equipment transport fee for any venue change inside T-30 days"*

> ⚠ **These examples are illustrative.** Vendors set their own policy; the numbers above are sample text in the spec, not platform-mandated rates.

Same surfacing pattern as reschedule fees — modal at § 11.1, manual mediator V1, auto-debit V2.

### 5.3 Per-head / per-table rates (guest count changes · iteration 0021 § 12.3)

Vendors who are guest-count-dependent (catering, florals, mobile bar, lights & sound, name cards/favors/print — see § 12.1 of 0021) capture per-head or per-table rates at booking. **Illustrative examples** from the spec:

- Casa Manila Catering — ₱1,200 / plate
- Bloomwood Florals — ₱5,500 / table
- Lumiere Lights & Sound — flat (capacity ceiling-bounded)

> ⚠ **These examples are illustrative.** Real vendor rates are captured per-vendor at booking via `vendor_event_window.confirmed_guest_count` × per-head rate. Vendors enter their actual numbers; Setnayan does not set them.

The § 12.3 modal computes the cost delta at the time of a guest-count increase (e.g., "+20 plates × ₱1,200 = +₱24,000") and surfaces both per-vendor and total impact before couple confirms.

### 5.4 Per-vendor change-acceptance cutoffs (iteration 0021 § 13.2)

V1 default cutoff values (days before event), pre-filled at vendor account creation. Vendors edit at onboarding. NOT prices — these are acceptance windows.

| Vendor category | Date | Venue | Guest count |
|---|---|---|---|
| Catering | 30 | 21 | 14 |
| Florals | 21 | 14 | 10 |
| Mobile bar | 21 | 14 | 7 |
| Lights & sound | 14 | 21 | 7 |
| Name cards / favors / print | 21 | 14 | 10 |
| Photography | 7 | 3 | N/A |
| Videography | 7 | 3 | N/A |
| HMUA | 7 | 3 | N/A |
| Planner / coordinator | 7 | 3 | 7 |
| Live stream / broadcast | 3 | 3 | N/A |

See [0021 § 13](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) for the snapshot rule + admin override path.

---

## 6. Cost-per-event reference (Setnayan-side · for margin tracking)

| SKU | Setnayan cost | Price | Margin |
|---|---|---|---|
| Save-the-Date Video | ~₱5 | ₱199 | ~97% |
| Papic 3-seat | ~₱195 | ₱1,499 | 87% |
| Papic 5-seat | ~₱265 | ₱2,499 | 89% |
| Per Template add-on | ~₱2 / render × ~30 reels = ~₱60 | ₱49 each | varies by usage |
| Monogram Hero (widget Pro) | ₱0 (animation/template assets) | ₱1,999 | ~100% |
| Live Schedule (widget Pro) | ₱0 | ₱999 | ~100% |
| Panood Daily Broadcast (3 cams × 3 hrs reference) | ~₱120 | ₱2,499 | 95% |
| Panood Daily + 2 cams (5 cams × 3 hrs) | ~₱180 | (now bundled into Daily Broadcast ₱2,499) | — |
| Bespoke Monogram | ~₱5 (DALL-E generation) | ₱2,999 | ~99% |
| Broadcast Style Pack | ~₱5 (LUT swaps) | ₱2,999 | ~99% |
| AI Video Highlight | ~₱10 (Claude API + ffmpeg) | ₱1,999 | ~99% |
| AI Edited Highlight (3-min) | ~₱30 (Claude API + ffmpeg + theme template) | ₱3,499 | ~99% |
| Same-Day Edit | (human editor billable to Setnayan) | ₱24,999 | — |
| Pakanta Wedding Suite | ~₱200 (Suno credits + Claude API) | ₱9,999 | 85–90% |
| Vendor Pro Weekly | ₱0 (analytics + landing styling) | ₱499 / wk | ~100% |
| All Tools Unlock Bundle | ₱0 | ₱9,999 / yr | ~100% |
| Sponsored Boost (Quarterly / Annual) | ₱0 (ranking is software-only) | ₱249,999 / ₱799,999 | ~100% |

**Per-render cost reference:** ~₱2–₱5 (FFmpeg compute + R2 storage; music is free since Suno catalogue is owned; CDN egress is free on R2).

**Live Stream cost is audience-independent.** YouTube absorbs all viewers at ₱0 marginal cost to Setnayan — bill scales only with camera count and stream hours, not viewer count.

---

## 7. CLAUDE.md cheat-sheet drift (reconcile when convenient)

The [CLAUDE.md § Cost-per-event cheat sheet](CLAUDE.md) was last updated 2026-05-09 and has drifted from current iteration spec. Rows to refresh:

| CLAUDE.md row | Current state |
|---|---|
| "Save-the-Date Render (₱49)" | Repriced to ₱199 on 2026-05-17 (iteration 0024) |
| "Pro tier per Widget (₱99)" | Retired; replaced by Monogram Hero ₱1,999 + Live Schedule ₱999 (2026-05-16) |
| "Pro Bundle (₱199)" | Retired 2026-05-16 |
| "Live Stream Base (₱2,499 — 3 cams × 3 hrs)" | Folded into Panood Daily Broadcast ₱2,499 / day (multi-cam built-in 2026-05-17) |
| "Custom Monogram Pack (₱1,999)" | Status uncertain — iteration 0021 § 1 still lists it active at ₱2,000; iteration 0037 introduces Bespoke Monogram at ₱2,999 as a replacement. **Reconciliation needed.** |
| "Sponsored Boost (₱1,499/wk)" | Retired 2026-05-16; replaced by Boosted Ads 5km/10km/20km weekly + Quarterly/Annual long-commit |
| "AI Edited Highlight (₱3,499 per 3-min · repriced 2026-05-16 from ₱4,999)" | ✅ current |
| "Vendor Pro Weekly (₱499/wk)" | ✅ current |

Refresh action: rewrite the [CLAUDE.md § Cost-per-event cheat sheet](CLAUDE.md) to match § 6 above, then mark `CLAUDE.md` section dated `(refreshed 2026-05-17)`.

---

## 8. Retired SKUs (historical context)

| Retired SKU | Last price | Retired | Replacement | New price |
|---|---|---|---|---|
| Token Wallet system (iteration 0003) | Per-pack model | 2026-05-11 | Apply-then-pay (PHP-direct) | N/A |
| Save-the-Date Render (₱99 MP4) | ₱99 | 2026-05-16 | Save-the-Date Video | ₱199 |
| Save-the-Date Render (₱49 MP4) | ₱49 | 2026-05-17 | Save-the-Date Video | ₱199 |
| Pro Widget Bundle | ₱199 | 2026-05-16 | Individual purchases (Monogram Hero ₱1,999 + Live Schedule ₱999) | — |
| Pro Widget Story (₱99) | ₱99 | 2026-05-16 | Folded to free (scroll parallax + Ken Burns) | FREE |
| Pro Widget Monogram (₱99) | ₱99 | 2026-05-16 | Monogram Hero | ₱1,999 |
| Pro Widget Schedule (₱99) | ₱99 | 2026-05-16 | Live Schedule | ₱999 |
| Custom Monogram Pack (₱1,999) | ₱1,999 | Status uncertain | Possibly Bespoke Monogram | ₱2,999 |
| Concierge Essentials (₱2,499 / 6mo) | ₱2,499 | 2026-05-16 | Concierge Complete (single SKU) | ₱4,999 / 12mo |
| Concierge 3-tier ladder (₱99 / ₱999 / ₱1,999) | varied | 2026-05-14 | Single-SKU Concierge model | ₱4,999 |
| AI Edited Highlight (prior) | ₱4,999 | 2026-05-16 | AI Edited Highlight (repriced) | ₱3,499 |
| Concierge 7-day card-less preview | FREE | 2026-05-17 | 3-day card-less trial (account-level cap) | FREE |
| Panood Annual Streaming Plus | ₱3,999 / yr | 2026-05-17 | Folded into Annual Streaming base | ₱19,999 / yr |
| Panood Camera Sync | ₱99 / day | 2026-05-17 | Built into Daily Broadcast base | ₱2,499 / day |
| Panood Camera Add-on (per camera) | ₱999 | 2026-05-17 | Folded into Daily Broadcast base (multi-cam now built-in) | ₱2,499 / day |
| Sponsored Boost Weekly | ₱1,499 / week | 2026-05-16 | Boosted Ads 5km/10km/20km weekly tiers | ₱4,999–14,999 / wk |
| Live Stream tiered SKUs (5–8 with crew bundles) | various | 2026-05-09 | Dropped from V1 — apparatus rule (price the tool, not the labor) | — |
| Wedding Ceremony +3 hrs add-on | ₱999 | 2026-05-09 | Per-day model (Daily Broadcast) | ₱2,499 / day |

---

## 9. Companion artifacts (binary; for stakeholder + financial modeling)

Located in [05_Financials/](05_Financials/):

| File | Format | Purpose |
|---|---|---|
| `00_Pricing_and_Costs.xlsx` | Spreadsheet | Canonical financial spreadsheet (SKU prices + costs) |
| `Pricing_Workbook_Plain_English.xlsx` | Spreadsheet | Stakeholder-facing pricing explainer |
| `Pricing_Workbook_Set_Your_Prices.xlsx` | Spreadsheet | Owner pricing-decision workbook |
| `Cost_vs_Revenue_Analysis.xlsx` | Spreadsheet | Margin + revenue projection model |
| `Revenue_Projection_Model.xlsx` | Spreadsheet | V1 revenue forecast |
| `Pricing_Audit_and_Subscription_Strategy_2026-05-10.docx` | Strategy report | Pricing audit + subscription pivot discussion |
| `Pricing_v2_Subscription_Pivot_Recommendation.docx` | Strategy report | Subscription-pivot recommendation memo |

These binary artifacts are the financial source-of-truth for owner-side budgeting. This Markdown doc mirrors the customer-facing SKU layer.

---

## 10. Cross-references · price-touching iterations

| Iteration | Pricing surface |
|---|---|
| [0003 (retired)](RETIRED_ITEMS.md) | Token Wallet — retired 2026-05-11, no longer active |
| [0004 Invitation Widgets](0004_invitation_widgets/0004_invitation_widgets.md) | Monogram Hero, Live Schedule |
| [0005 LED Background](0005_led_background_maker/0005_led_background_maker.md) | LED Standard + Custom tier |
| [0011 Panood](0011_panood/0011_panood.md) | All Panood SKUs + AI Highlights + SDE |
| [0012 Papic](0012_papic/0012_papic.md) | All Papic SKUs |
| [0016 Step-by-Step Plan Builder](0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) | Setnayan Concierge tier + trial |
| [0021 Couple Dashboard](0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) | Active apparatus table § 1 + vendor-to-couple fee policies § 10.9 / § 11.3 / § 12.3 / § 13.2 |
| [0022 Vendor Dashboard](0022_vendor_dashboard/0022_vendor_dashboard.md) | All vendor-side platform SKUs (Pro, Boosted Ads, Sponsored Boost, integrations) |
| [0024 Save-the-Date](0024_save_the_date/0024_save_the_date.md) | Save-the-Date Video |
| [0026 BIR Tax Compliance](0026_bir_tax_compliance/0026_bir_tax_compliance.md) | Tax + receipt rules (no pricing of its own; references all other SKUs) |
| [0034 Payments & Cart](0034_payments_and_cart/0034_payments_and_cart.md) | Apply-then-pay flow (consumes prices from this doc) |
| [0036 Pakanta](0036_pakanta/0036_pakanta.md) | Pakanta tiers |
| [0037 Bespoke Monogram](0037_bespoke_monogram/0037_bespoke_monogram.md) | Bespoke Monogram + refinement add-ons |

---

## 11. Update protocol

When a price changes:

1. **Decide + lock the new price** with the owner. Confirm it matches the charm ladder (§ 1).
2. **Update the owning iteration `.md`** — that's the canonical source.
3. **Append a row to the CLAUDE.md decision log** with date, what + why, affected iterations.
4. **Update this doc** — find the row in §§ 2–5 and refresh the price + centavos + status; if a SKU is retired, move the old row to § 8.
5. **Regenerate `Pricing.docx`** via pandoc:
   ```bash
   pandoc Pricing.md -o Pricing.docx
   ```
6. **Update memory if the rule is cross-iteration** (per CLAUDE.md memory guidance).
7. **Refresh the 05_Financials/ xlsx workbooks** when convenient — those drive financial modeling but are owner-edited binaries.

**Drift detection:** every owner-led pricing decision should follow this protocol. If a price is updated in one place but not the others, the CLAUDE.md decision log is the tie-breaker (most recently dated row wins).

**Future canonical workflow** (locked 2026-05-17 · ships with iteration [0023 § 3.12 Add-on Management](0023_admin_console/0023_admin_console.md)): admin updates SKU price / eligibility / 2D billing config in `/admin/addons` → `service_catalog` row updates with audit row → admin clicks "Generate Pricing Report" → this `Pricing.md` is regenerated from live database state + a timestamped snapshot written to `/admin/addons/reports/{ts}.md`. V1.5+ adds nightly auto-regeneration via pg_cron so this doc is never more than 24 hours stale. **Until that admin surface ships,** keep editing this doc by hand following the protocol above.

---

## 12. Companions

- `Pricing.docx` — Word-format mirror regenerated via pandoc.

---

*Last regenerated: 2026-05-22 (Specialized Pro Tools architecture + Professional Mood Board pack pricing + 13-SKU placeholder added per CLAUDE.md fifth 2026-05-22 decision-log row)*
