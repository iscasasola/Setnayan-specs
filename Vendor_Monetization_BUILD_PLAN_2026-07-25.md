# Vendor Monetization — BUILD PLAN & Gap Map (2026-07-25)

**Companion to** `Vendor_Monetization_Model_LOCKED_2026-07-25.md` (the WHAT). This doc = the HOW: what already exists in code, what to build, in what order. Informed by a full code survey of `apps/web` + `supabase/migrations` on 2026-07-25.

## ⏱ BUILD PROGRESS (updated 2026-07-25 — 9 PRs shipped, all flag-dark)
**Merged to `main`:**
- **#3685** — add-on tiered price SSOT (`lib/vendor-addon-tier-pricing.ts` + `-flag.ts`; `resolveVendorAddonPricePhp(sku, tier)`).
- **#3687** — free-tier cap logic (`lib/vendor-free-tier-booking-cap.ts` + `-flag.ts`).
- **#3688** — cap DB trigger (migration `20271001120000`; `platform_settings.free_tier_booking_cap_enabled`, default FALSE). ⚠ **Do NOT flip** until the "Fully booked" UI + graceful lock-error handling ship, or a capped lock throws a raw error.
- **#3689** — launch free-window (`lib/vendor-launch-free-window.ts` + `-flag.ts`).
- **#3692** — Papic backend gate-open (migration `20271001130000`; `platform_settings.vendor_addon_tiered_pricing_enabled` + `photoChallengeEligibility.allTiersAllowed`).
- **#3697** — Papic buy-action + UI wired onto the gate + tiered price.
- **#3700** — 🚨 **MONEY-BUG FIX: activation tier floor.** #3692/#3697 + #3699 opened the BUY paths to every tier, but `sku-activation.ts` still re-asserted a hardcoded **Pro+ floor at ACTIVATION**. A verified Free/Solo vendor would buy → pay → and the hook would **throw** on admin approval: order `paid`, entitlement never granted. Not exotic — verification never sets `tier_state`, so **verified-and-Free is the ordinary shape**. New pure `lib/vendor-addon-activation-gate.ts`; the two opened SKUs now pass `isVendorAddonTieredPricingEnabled()`. **The tier half lifts, the verification half NEVER does** (6 tests). Also fixes a pre-existing bug: a Pro vendor whose sub lapsed mid-review lost a paid add-on.
- **#3701** — **"free until your 6th booking"** (owner 2026-07-25) on **3D Plan Ads + Papic Challenge** only; AI Chatbot + Deep Search charge from day one (Deep Search costs real money per run). New `lib/vendor-addon-first5-free.ts` + its **own** flag `NEXT_PUBLIC_VENDOR_ADDON_FIRST5_FREE`. **Replaces** the 3D booth's one-time free 28-day cycle (the trial marker is NOT consumed, so switching the policy off restores it). Papic gains a ₱0 direct-activate path. ⚠ **The counter reads `event_vendors`, NOT `booking_fee_ledger`** — `collectBookingFeeAtLock` no-ops while `NEXT_PUBLIC_BOOKING_FEE_ENABLED` is off, so the ledger is EMPTY and counting it would have made both add-ons **free forever**. Grants clamp to one cycle (no stacking); reads fail CLOSED.
- **#3699** — **3D Plan Ads gate-open, end-to-end** (no migration — the 3D booth had NO SQL tier gate; all TypeScript). `boothCanBrand`/`boothIsBranded` gain an optional `allTiersAllowed` (pure, default false); new `lib/booth-branding-tier-gate.ts` is the ONE place that feeds it from the flag, consumed by 5 render sites + the 2 `/v/[slug]` showcase gates; `booth-addon-actions.ts` + subscription card open to every tier at `resolveVendorAddonPricePhp('ads_3d_plan', tier)` (₱2,000 Free/Solo · ₱1,500 Pro/Ent). Verified-only, the free first cycle, and the **ACTIVE-add-on half of the render gate** are untouched — no entitlement, no branding, on any tier.

**LIVE state (2026-07-25):** `platform_settings.vendor_addon_tiered_pricing_enabled` = **TRUE** (owner flipped). Papic's DB gate is open to all tiers. Whether Papic is fully live to Free/Solo also depends on the Vercel env flag **`NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING`** — CONFIRM its state (they flip together). `free_tier_booking_cap_enabled` = FALSE (keep off). Other `NEXT_PUBLIC_VENDOR_*` env flags default OFF. No runtime errors.

**📋 SURVEY LANDED — read [`Vendor_Addon_Variant_Split_Survey_2026-07-25.md`](Vendor_Addon_Variant_Split_Survey_2026-07-25.md) before ANY add-on work.** 13-agent survey + adversarial fact-check of the AI + Deep Search subsystems, every claim file:line-cited. Its § 6 is a **15-item trap list**. The three that bite hardest: (a) the tier band must be **injected as `cyclePricePhp`, never as the final price** — both resolvers return ₱0 *before* reading it, so replacing the output silently deletes the Pro+ free search and bills the AI trial; (b) `admin/payments/actions.ts:404` tests ONE Deep Search literal — add a 2nd SKU without widening it and activation runs **synchronously inside the admin's Approve click** for 10–30s; (c) any new SKU code **must start `vendor_`** (`orders.ts:187` `isVatInclusiveServiceKey`) or every order strands on the VAT shortfall guard — the shipped `booth_studio` seed violates this, do NOT copy it as a template.

**NEXT, in order (fresh session):**
1. ~~**Variant splits foundation**~~ ✅ **SHIPPED #3702** — AI + Deep Search now price off the tier band (`ai_chatbot_basic` ₱2,000/₱1,500 · `deep_search_about_you` ₱1,000/₱500). No migration (both gates are pure TS); no SKUs added or renamed. ⚠ At flag-flip **Solo pays more** (AI +33%, Deep Search 2×) — locked § 2, but grandfathering existing Solo holders is an open owner call.
1b. **AI Chatbot Basic/Advanced — ✅ RESOLVED (owner 2026-07-25: *"we already separated this. advanced has the voice something and more."*).** Owner is right and this **overrides the survey's § 1 recommendation**, which was wrong on its facts. The split is already canonical in **[`Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md` § 8](Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md)** and already mirrored in the shipped DB schema (`20270822679405`): **Basic = the § 8 "Free (all tiers)" column** (deterministic front desk · templated neutral house voice · handoff · ~30/day cap · basic reply log); **Advanced = the § 8 "Pro/Enterprise" column = `vendor_bot_config.mode='smart'`** — **voice-match** (`voice_profile`) · **natural phrasing** (`vendor_reply_templates` = "precomputed voice phrasings") · **reply in the couple's language** (`reply_in_couple_language`) · **lead analytics** · higher/uncapped daily cap.
    - **⚠ The survey rejected this split on a FALSE premise** — it assumed voice/smart needs an LLM per reply, breaking the ₱0-marginal-cost rule. It does not: § 7 is a **precompute** schema. Phrasings are generated **once per voice/catalog edit**, stored in `vendor_reply_templates`, then served deterministically per reply. Per-reply cost stays **₱0**; the model spend is a rare bounded per-edit event (~₱35 one-time per vendor, build plan § 12). Fully compatible with the locked *"Setnayan AI = deterministic + free (Rule 1)"*.
    - **Build shape — a LADDER, not two windows.** `sku-activation.ts:1326` hardcodes `expiryColumn: 'ai_addon_expires_at' | 'booth_addon_expires_at'`, so a per-variant expiry column will not typecheck. Keep ONE entitlement window + a **server-written level marker** (`vendor_profiles.ai_addon_level ∈ ('basic','advanced')`, backfilled `'basic'` and read as `?? 'basic'`). ⚠ `vendor_bot_config.mode` is **vendor-writable under RLS**, so it can NOT be the entitlement marker — `mode='smart'` must be *gated by* the server-written level.
1c. **Deep Search About-You / Market Scan.** About-You **is** today's behaviour verbatim — keep the `vendor_deep_search` SKU (it is load-bearing in 6 places incl. the frozen `EXACT_HOOKS` key and the DPO control key). Market Scan is **net-new**, needs its own SKU + DPO control + counsel review (the platform deliberately makes no cross-vendor judgement — `verified-median-read.ts:39`), and should have **no free path** (that also sidesteps a live bug where a free run with no API key silently returns own-site data).
2. **Cap "Fully booked" UI** + graceful lock-error handling (touches payment session's `finalizeVendor`/`chat-lock-booking`) — THEN flip `free_tier_booking_cap_enabled`.
3. **Two-ring reach** + free-transport enforcement (geocode + proposal `TransportMode`).
4. **Paid boost + Featured slots** (`lib/vendor-badges.ts`; do NOT enable `VENDOR_TIER_SEARCH_GATE`).
5. **Roles Financial/Secretary** + agent assignment notifications (`lib/vendor-team.ts`).
6. **Tier-gating flips** (market intel / SEO / favorites → Pro+).
7. **Launch-window coverage** — apply `vendorLaunchAdjustedPricePhp` to the chosen SKUs.
8. **Fee taper — PAYMENT SESSION** (see § "EXACT fee-taper spec" below).

**✅ RESOLVED (owner 2026-07-25) — the 3D booth free-cycle question raised by #3699.** Owner: *"for the 3D booth (first 5 bookings - FREE in proportion to the Booking/Synching Fee)."* Locked as **"free until their 6th booking"** — the add-on is ₱0 for as long as the vendor is inside the same first-5 window in which the booking fee is waived; their 6th booking flips it to the banded price. **Scope: 3D booth + Papic Challenge** (the two couple-visibility add-ons); AI Chatbot + Deep Search charge from day one. This **replaces** the one-time free 28-day cycle. Shipped in #3701.

**⚠ Known trade-off, accepted:** a vendor who never reaches 6 bookings advertises free indefinitely, and an established vendor with an unused legacy trial loses it at flag-flip (they gain the first-5 window instead). Pre-launch with ~4 real vendors, both are immaterial.

**Gotchas:** changelog fragments go in **ROOT `changelog.d/`** (not apps/web — CI guard). Worktree → PR → `gh pr merge <#> --auto --merge`, flag-dark. Migrations auto-apply on merge but verify (`gh workflow run supabase-migrations.yml --ref main`).

## Reconciliation decisions (locked, owner 2026-07-25)
1. **First-5-free = KEEP** as a standing free-tier perk (already live in the fee engine).
2. **Lead "priority" = delivered via ranking/visibility boost**, NOT a separate lead queue (the model is direct-connect 1:1 inquiry — there is no queue to prioritize).
3. **Fee is already sourced-only in code** (imports = free forever). Only the RATE differs → the taper.
4. **Do NOT flip `VENDOR_TIER_SEARCH_GATE`** — it buries free vendors, contradicting the merit-first rule.
5. **Subs bill per 28-day cycle** (matches the shipped catalog — no open question).
6. **Roles: extend** existing `owner/admin/agent/viewer` with Financial + Secretary scopes — don't rebuild the team system.

## Already BUILT (survey 2026-07-25) — extend, don't rebuild
- **Subscription tiers + `vendor_billing_catalog` + checkout** — LIVE. Prices already Solo ₱1,000 / Pro ₱2,500 / Ent ₱8,000 (state on `vendor_profiles.tier_state` + `tier_expires_at`).
- **Sourced-vs-BYO attribution** — `booking-fee-gate.ts` `SOURCED_INQUIRY_SOURCES`; imports (`host_manual`/`invite_claim`/etc.) free forever; driven by `chat_threads.inquiry_source`.
- **Fee engine** — `booking-fee.ts` + `booking_fee_centavos()` + `booking_fee_open_lock_charge`; fires at LOCK on `event_vendors.total_cost_php`; **first-5-free**; flags `NEXT_PUBLIC_BOOKING_FEE_ENABLED` + `_RAIL_LIVE` (off).
- **Merit-first Bayesian ranking** — `vendor-badges.ts` (`top_pick`/`most_booking`), "new vendors not buried."
- **Market intel ×3** — Demand Radar, verified-median (`NEXT_PUBLIC_VERIFIED_MEDIAN_ENABLED`), plausibility scanner (`NEXT_PUBLIC_PLAUSIBILITY_SCANNER_ENABLED`) — all flag-dark.
- **Favorites gate** — `vendor-favorite-gate.ts` (`VENDOR_FAVORITES_SUBSCRIPTION_GATE`, off).
- **Team seats + roles + per-agent scheduling** — `vendor-team.ts` (owner/admin/agent/viewer), `vendor_service_agents`, `vendor-schedule.ts`; extra seats ₱250/28d (Enterprise).
- **All 4 add-on SKUs** — AI Chatbot `vendor_ai_addon` ₱1,500, 3D Booth `vendor_3d_booth` ₱1,500, Deep Search `vendor_deep_search` ₱500/search, Papic Challenge ₱400/event.
- **SEO/GEO/AEO** — monitoring spine, structured data, sitemaps, `llms.txt`.

**Retired — do NOT resurrect:** vendor tokens / token packs / token-burn answering / peso-per-lead.

## Build phases (each a flag-dark PR)
| PR | Owner | Scope |
|---|---|---|
| **1** | me | **Add-on repricing + variants** — tiered Free/Solo vs Pro/Ent (Papic ₱500/₱400 · 3D Ads ₱2,000/₱1,500); **split AI Chatbot → Basic ₱2,000/₱1,500 + Advanced ₱3,000/₱2,500**; **split Deep Search → About-You ₱1,000/₱500 + Market ₱2,000/₱1,500**. Files: `vendor-addon-pricing.ts`, `vendor_billing_catalog` seeds, `sku-activation.ts`. *(Safe — no payment-session files.)* |
| **2** | **PAYMENT SESSION** | **Fee taper** — see exact spec below. Their files (`booking-fee.ts`, `booking_fee_centavos`, PR #3658). |
| **3** | me | **Free-tier 3-concurrent cap** + "Fully booked" lock-gate (inbox/chat never gated). ⚠ touches the lock path (`finalizeVendor`/`chat-lock-booking`) — coordinate with payment session. |
| **4** | me | **Two-ring reach** + free-transport enforcement (build on geocode cols + proposal `TransportMode`; Ring-1 venue → transport forced `included`/₱0 + field disabled). |
| **5** | me | **Paid boost + labeled Featured slots** — extend `vendor-badges.ts`/ranking + spotlight; NOT the search-gate. |
| **6** | me | **Roles Financial/Secretary** + agent-assignment notifications (extend `vendor-team.ts`). |
| **7** | me | **Tier-gate** market intel→Pro+, SEO/GEO/AEO→Solo+/Pro+, flip favorites gate (config/gating). |
| **8** | me | **Launch window** — free-until-2026-11-30 resolver for selected paid features (clone the intro=₱0 trial-resolver pattern). |

## EXACT fee-taper spec (for the payment session)
Change `apps/web/lib/booking-fee.ts` + SQL `public.booking_fee_centavos(BIGINT)`:
- **FROM:** flat 5%, floor ₱50, no cap.
- **TO:** **5% on the first ₱100,000 of the booking, then 1% on the amount above; floor ₱50; no cap.**
- Centavos formula: `tier1 = min(amount, 10_000_000); tier2 = max(0, amount − 10_000_000); fee = round(tier1*0.05 + tier2*0.01); return amount>0 ? max(fee, 5000) : 0`.
- Check: ₱1M→₱14,000 · ₱10M→₱104,000 · ₱60k→₱3,000.
- **KEEP unchanged:** sourced-only gate, first-5-free, LOCK trigger, verified-gate, idempotency. Bump the schedule version string.
- Deals > ~₱3–5M: advisory flag for Enterprise/Custom hand-pricing (the 1% tail already softens the top).

## Flags — stay OFF until owner go-live
`NEXT_PUBLIC_BOOKING_FEE_ENABLED` (+ `_RAIL_LIVE`), `NEXT_PUBLIC_VERIFIED_MEDIAN_ENABLED`, `NEXT_PUBLIC_PLAUSIBILITY_SCANNER_ENABLED`, `VENDOR_FAVORITES_SUBSCRIPTION_GATE`. **Never enable `VENDOR_TIER_SEARCH_GATE`.**
