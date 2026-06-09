# Vendor Tier Capability Matrix — canonical (2026-06-07)

> Owner-provided 4-tier capability matrix (2026-06-07). This is the **canonical
> definition of what each vendor tier can do**. It refines/supersedes the prior
> `project_setnayan_vendor_tier_ladder` lock (2026-06-04) and reconciles the
> /pricing contradictions. `tier_state` enum (`free | verified | pro |
> enterprise`) already exists on `vendor_profiles` (migration
> `20260714000000_v2_screen_name_reveal_mechanic.sql`).
>
> **Status of enforcement (audit 2026-06-07 vs origin/main):** ⛔ = not enforced,
> ⚠ = partial / wired to the wrong signal, ✅ = enforced.

## The matrix

| Capability | FREE | FREE-VERIFIED | PRO | ENTERPRISE | Enforced today |
|---|---|---|---|---|---|
| Distance Coverage (service radius) | ✗ | 20 km | 50 km | Unlimited | ⛔ (only ad-boost `ad_radius_km` exists) |
| Creating Package = **# service listings per leaf** (owner-defined 2026-06-07) | 2 | 2 | 5 | Unlimited | ⛔ build pending — needs: drop `vendor_services` UNIQUE(vendor,category) + add per-listing `title` + count-cap on create (Option A; 3 sites to fix: `lib/budget.ts` map collision, services-page "Added" gate + title display) |
| Chat Service | ✗ | Chat | Chat | Chat (~~+ Video~~) | ✅ FREE-blocked (PR #1142). **Video REMOVED 2026-06-09** (owner "let's remove the video calls then") — Enterprise = text Chat like Pro/Verified; reverses the same-day "build Enterprise video" decision. `chat_video` ChatLevel dropped; `/for-vendors` video-call claims stripped. |
| Parent Categories | 1 | 3 | 3 | Unlimited | ⛔ |
| Agent Accounts | 0 | 1 | 3 | Unlimited | ⛔ (`max_sub_seats` column dead) |
| Scheduling | Manual | Hybrid | Hybrid | Hybrid | ⛔ (no manual/hybrid mode) |
| Marketplace | ✗ (not searchable) | Searchable | Searchable | Searchable | ⚠ (gates on `public_visibility`, not `tier_state`) |
| Vendor Name | ✗ | Screen Name | True Name | True Name | ⚠ (`isPaidTier` hardcoded `false` — Pro/Ent day-1 true name not wired) |
| Slot per day = **vendor-declared daily booking CAPACITY per service** (owner-defined 2026-06-07: e.g. 2 photobooths → 2 bookings/day; tier caps the max declarable) | ✗ | 1 (flat) | 3 (flat — **NOT** time-bounded) | Unlimited **+ time-bound slots** | ✅ **SHIPPED.** #2 (flat daily capacity) shipped 2026-06-09 (migration `20260925000000`, `vendor_services.daily_capacity`). #3 (Enterprise time-bound) shipped 2026-06-09 (migration `20260928000000`, `vendor_service_time_slots` + `event_vendors.service_time_slot_id` + atomic `acquire_service_time_slot` RPC). **Owner refinement 2026-06-07:** time-bounding is **ENTERPRISE-ONLY** (Pro is a flat 3/day, no am/pm). Enterprise **plots named time slots, each with its own allotted capacity** (use case: a hotel scheduling its different rooms across the day); **the couple picks a window at lock time** (owner-locked). `canPlotTimeSlots(tier)` = Enterprise-only; `slotsTimeBounded` = true for ENTERPRISE only. |
| In-App Customer (volume) | ✗ | 10 / week | Unlimited | Unlimited | ⛔ (no cap, FREE not blocked) |
| **In-App Customer Gate (token cost to answer)** | ✗ | **✗ (free)** | **1–3 tokens** | **1–3 tokens** | ⛔ **+ CONTRADICTS shipped burn** (burns all tiers) |
| Import Customers Gate | 1 token | 1 token | 1 token | 1 token | ⚠ (sync-import path; tier-agnostic by design) |
| Portfolio | 30 photos | 50 | 100 | Unlimited | ⛔ (free-form array, no cap) |
| Editorial | ✗ | ✗ | Tagged | Tagged | ⛔ |
| Review Stars | ✗ | Counted | Counted | Counted | ⚠ (shown to all, no FREE gate) |
| Review Comments | ✗ | ✗ | Viewable | Viewable | ⛔ |
| Website | Basic | Custom | Custom | Custom | ⛔ (uniform microsite) |
| Website Name (custom slug) | ✗ | ✗ | Custom | Custom | ⛔ |
| Inquire Link | Link | Link | Link | Link | ✅ (open to all) |
| **Price + free tokens** (price UPDATED 2026-06-07; bundle REPRICED 2026-06-09) | FREE | FREE | **₱6,000 / 28 days + 5 tokens** · **₱60,000/yr + 50 tokens** | **₱10,000 / 28 days + 10 tokens** · **₱100,000/yr + 100 tokens** | ✅ SHIPPED (#5 PR #1157 · bundle reprice mig `20261011000000`). Bundle was 30/300 · 100/1000 until 2026-06-09. |
| **Cost per additional Lifetime Token** | **₱100 / token** (FREE may buy — for client import only; owner override 2026-06-07) | ₱100 / token | ₱100 / token | ₱100 / token | ⛔ (buy-token flow not built) |
| ~~Price (Phase A, superseded)~~ | FREE | FREE | ~~₱3,999/28d (₱39,999/yr)~~ | ~~₱9,999/28d (₱99,999/yr)~~ | shipped in PR #1061, now repriced |

> **UPDATE 2026-06-07 (second tier sheet):** Owner reissued the sheet with new prices + token mechanics. Deltas vs the version above:
> - **Prices ↑ + round (not charm/-1):** Pro ₱3,999→**₱6,000**/28d · ₱39,999→**₱60,000**/yr; Enterprise ₱9,999→**₱10,000**/28d · ₱99,999→**₱100,000**/yr. ⚠ These break the brand charm-pricing (-1 endings) lock — owner set them explicitly; flagged, not "corrected."
> - **NEW — subscriptions bundle free tokens:** Pro +5 (28d) / +50 (annual); Enterprise +10 (28d) / +100 (annual) — **REPRICED 2026-06-09** (was 30/300 · 100/1000). Granted on subscription activation/renewal → belongs to Phase D (no subscription-payment flow exists yet).
> - **NEW — buy-token rule:** ₱100/token (lifetime = non-expiring `purchased_tokens`). **ALL tiers may buy, INCLUDING FREE** (owner override 2026-06-07: "let FREE buy tokens to import their clients" — supersedes the sheet's "Not Allowed"). FREE's only token sink is the Import Customers gate (1 token/import); buying never unlocks in-app for FREE (tier-blocked regardless of balance). `canBuyTokens()` returns true for all tiers. The buy-token checkout itself isn't built yet (Phase D).
> - **✅ CONTRADICTION RESOLVED (owner confirmed · shipped PR #1063):** **FREE-VERIFIED is FREE** for in-app answers — ≤10/rolling-week at 0 tokens (gate ✗ stands); only **PRO/ENTERPRISE burn** 1-3 tokens; FREE blocked. This reverted Phase A's verified-burn. Also shipped: the **subscription token bundle** is granted **on admin tier-set** + on Phase-D subscription approval (Pro +5 / Ent +10 monthly · +50/+100 annual — **repriced 2026-06-09** from 30/100·300/1000, idempotent); and `canBuyTokens` (FREE = "Not Allowed", others ₱100/token) is recorded for the Phase D buy-token flow.

## Key reconciliations / conflicts to settle

1. **Token-gate model REVISES the just-shipped burn (PR #1057).** The burn currently fires for ALL tiers (region-banded ₱100/200/300, tier-blind). The matrix says: **FREE → blocked** (no in-app customers, no chat, not searchable); **FREE-VERIFIED → 10 free in-app customers/week, NO token**; **PRO/ENTERPRISE → unlimited, 1–3 tokens per (vendor,event) unlock.** So the burn is correct only for Pro/Enterprise. Needs a `tier_state` gate in `acceptInquiry` + a weekly free-allowance counter for verified. **This means "tokens universal across all tiers" (prior lock) is now FALSE — verified is token-exempt within its 10/week allowance.**

2. **Price supersede.** Matrix Pro ₱3,999 / Ent ₱9,999 per 28 days (₱39,999 / ₱99,999 annual) supersedes the catalog seeds (₱1,999 / ₱5,499) AND the prior tier-ladder memory (₱2,499 / ₱5,499). `vendor_billing_catalog` + /pricing need updating.

3. **No way to BECOME Pro/Enterprise.** `tier_state` is only ever set to `verified` (by the verification backfill). There is no admin tier control and no self-serve subscription checkout that writes `pro`/`enterprise`. **Until tier is settable, every paid-tier privilege is moot** — so a tier-setting mechanism (admin control first, self-serve later) is the foundation that must precede enforcing paid-tier gates.

4. **Two-tier "verified" split.** FREE and FREE-VERIFIED are distinct tiers with different capabilities (FREE: no chat, not searchable, manual scheduling, no agents; FREE-VERIFIED: chat, searchable, 1 agent, 10 leads/week, screen name). The FREE→FREE-VERIFIED transition = verification. (Note the open question: two "approve" surfaces — only the one flipping `verification_state` should move tier to `verified`.)

5. **Capability gates wired to the wrong signal:** marketplace searchability uses `public_visibility` (a FREE vendor with `public_visibility='verified'` is searchable — contradicts "FREE not searchable"); name-reveal hardcodes `isPaidTier=false` (Pro/Ent never get day-1 true name). Both should read `tier_state`.

## Proposed build sequence (phased — pending owner scope)

- **Phase 0 — foundation:** a central `tierCapability(tier)` helper (single source of the matrix in code) + admin tier control (`/admin/vendors/[id]` set tier) so tiers are reachable + the catalog price update.
- **Phase 1 — fix the shipped burn + the cheap correct gates:** tier-gate `acceptInquiry` (FREE deny · VERIFIED free w/ 10/week counter · PRO/ENT burn); fix searchability + name-reveal to read `tier_state`.
- **Phase 2 — count/cap gates (back the dead columns):** packages-per-leaf, parent categories, agent seats, portfolio caps, slots-per-day.
- **Phase 3 — feature gates:** chat (FREE block) + video (Ent), editorial tagging, review comments visibility, website Basic-vs-Custom + custom slug, distance coverage radius.
- **Phase 4 — self-serve subscription checkout** (writes `tier_state` on payment; ties to the 0034 payments spine).

Effort is in Claude Code time per phase (~0.5–1.5 days each); none requires inventing values (all caps come from this matrix).
