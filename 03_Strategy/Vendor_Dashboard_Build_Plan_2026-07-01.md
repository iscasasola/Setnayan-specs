# Vendor Dashboard — Build Plan (reorg + this-session decisions)

> **✅ CORRECTED against `origin/main` (re-audited 2026-07-01).** The first pass ran on a checkout 462 commits behind and missed the shipped **vendor = multi-admin store** model. This §0.5 supersedes the token/subscription/team parts of §1–§2 below; nav-regroup + calendar + performance are unaffected.

## 0.5 CORRECTED MODEL — vendor = multi-admin STORE (as-built on origin/main)

Three shipped migrations (`20270401574089` org/multi-admin · `20270401611377` personal wallets · `20270402296556` admin-grant-to-member) enforce this at the DB/trigger level:

**Creation & roles.** `/signup?as=vendor` (or onboarding flip) sets `account_type='vendor'` → `handle_new_vendor_user()` creates the `vendor_profiles` **store** row and seeds the creator into `vendor_team_members` as **`role='admin'`**. **`owner` is RETIRED** (backfilled → admin). Roles = **Admin** (top; manages team, roles, subscription, buy-for-teammate) · **Agent** (service-scoped) · **Viewer** (read-only). There is no singular owner — a store has **plural admins**.

**Governance (DB-enforced).** ≥1-admin floor (`VENDOR_LAST_ADMIN`); removing/demoting a **peer admin needs a majority vote of the other admins** (`vendor_admin_motions`/`_votes` + propose/vote/cancel RPCs); self-step-down needs no vote. **Subscription purchase is admin-only** (`create_vendor_subscription` → `NOT_VENDOR_ADMIN`). Team UI already built.

**Tokens are PERSONAL PER MEMBER.** Founder keeps `vendor_wallets` (store wallet: earned/voucher/telemetry/grant). Every other member has their own `vendor_member_token_wallets(vendor_id,user_id).purchased`. Burn (`unlock_vendor_event`) admits **any answering member** (viewers blocked) and debits **that member's own** balance. Purchase carries `holder_user_id` — an **admin can buy FOR a teammate**; admins can also comp a teammate (`grant_member_purchased_tokens`). Non-transferable.

### ✅ Already shipped & correct — BUILD TO IT (not from scratch)
- Admin-only subscription (fully enforced end-to-end).
- Buy-for-teammate holder mechanism + Team-balances panel + admin grant-to-member UI.
- Per-member wallet schema + burn logic (idempotent, tier-gated, region-banded).
- Multi-admin governance (floor, motions/votes, step-down) + Team UI.
- 100-on-verification grant already retired.

### ❌ Unmet session decisions — the real gaps
| # | Decision | Reality on origin/main |
|---|---|---|
| **D3** | Buy/subscribe require **verification** | **NOT built anywhere.** Neither purchase RPC reads `verification_state`; `canBuyTokens()` returns true for all + is called nowhere. **Biggest gap** — needs a new server-authoritative migration. |
| **D2** | **No free tokens** | Only the on-verify bonus is gone. **5 faucets still fire:** subscription bundles (Pro 5/50, Ent 10/100), admin direct grant, **admin grant-to-member (added the SAME day — looks intentionally kept)**, redeem-code voucher, manpower telemetry reward. |
| **D5** | Redeem-code retired | Still mounted + nav-linked. |
| **D8** | Caps Solo1/Pro2/Ent10 | Misaligned with shipped `agentAccounts` **solo0/pro3/ent∞**; an extra **admin consumes an agent seat** (`team/actions.ts`). |
| **D7** | Recommend = mutual-accept | Unchanged — still one-sided admin-curated two-admin verify. Rework (worked-together *is* derivable from `event_vendors` co-occurrence). |

### Prototype must change (all-screens mockup)
- Sidebar token pill → **per-viewer "Your tokens"** (founder: purchased+earned; member: personal purchased only — two balance shapes). Not a store total.
- Buy-tokens page → add admin-only **"buy for a teammate"** picker + **Team token balances** panel + non-transferable note.
- Subscription page → **admin-only** with a non-admin blocked state ("ask a store admin"); copy says "any admin," not owner.
- Team surface → full **multi-admin governance UI** (Admin-votes panel, step-down, roles **Admin/Agent/Viewer — no Owner**).
- Drop **"Owner"** everywhere; add **"Get verified first"** CTA-swap on Buy/Upgrade.

### New owner decisions (added by the org/wallet model)
1. **D2 scope** — does "no free tokens" mean *zero grants*, or just the retired on-verify bonus? (Admin comps look intentionally kept via `grant_member_purchased_tokens`.)
2. **Partnership declaration** — admin-only (parallel to subscription), or any member?
3. **Tier-cap source of truth** — session Solo1/Pro2/Ent10 vs shipped 0/3/∞; should an extra **admin** consume an agent seat?
4. **D7 target** — is "worked together" a hard eligibility block or a soft badge? Keep the two-admin HQ gate alongside mutual-accept, or retire it?
5. **Earned/45-day-voucher tokens** — if the earned faucets are retired under D2, drop the "Earned/voucher" framing (founder wallet becomes purchased-only)?

---

## 0.6 RECONCILED with the marketing session (2026-07-01 · their re-baselined §6 = as-built tier truth)

The `/for-vendors` (marketing) session **re-ran its audit in a clean `origin/main` worktree (HEAD `3dec2cb`) and rewrote §6 of `apps/web/VENDOR_TIERS_AND_BENEFITS.md` as the as-built tier SSOT** (`lib/vendor-tier-caps.ts` + DB `vendor_billing_catalog`). **Where our provisional numbers differ, §6 wins** — it's the reconciliation target.

### ✅ Confirmed by §6 / recent commits — our design ALIGNS (no rework)
- **Annual-first subscription** — shipped (`3e1dc17f7 ux(pricing): vendor tiers display annual-first`). Our subscription page's annual-first toggle matches shipped behavior; **not net-new**.
- **Solo burns tokens** (`inAppGated=true`) — the "Solo = no tokens" linchpin is **FALSE in code**. Our no-free-tokens + verification-gated design is consistent. Do **not** write "Solo = free answering" copy (owner linchpin still unconfirmed — §4.1).
- **Import is now FREE both ways** (`e95f77315`, `3d8973077`) — **Decision B is RESOLVED**: importing an outside client no longer burns a token, so the no-free-token gate no longer bricks the CRM on-ramp. (Decision B in §0 is superseded — drop from the blocker list.)
- **Demand Radar + Vendor funnel + Price-position card are already SHIPPED** (`/vendor-dashboard/demand` · `demand_radar_for_vendor` RPC · `/vendor-dashboard/funnel` · `lib/vendor-funnel.ts` · `lib/price-position.ts`). Our My Performance cockpit **builds ON these, not from scratch** — but ⚠ they are **time-over-time / percentile, NOT vs-peers**.

### 🆕 §6 caps that OVERRIDE our provisional numbers (Decisions E/F/G target these)
| axis | our provisional (prototype) | §6 as-built (**the target**) |
|---|---|---|
| team / agent accounts | Solo1 / Pro2 / Ent10 | **solo 0 · pro 3 · ent ∞** (an extra admin consumes a seat) |
| services per leaf | (folded into per-account 5/10/∞) | **solo 3 · pro 5 · ent ∞** (per leaf) |
| parent categories | — | free/solo 1 · **pro 3** · ent ∞ |
| bookings per date (no-double-book) | Free/Solo 1 · Pro+ multi | **slotsPerDay free0 / verified1 / solo1 / pro3 / ent∞** — ✅ our capacity rule maps cleanly onto this |
| branches | Pro+ (Decision E) | **Enterprise-only** (§6 confirms the shipped gate) |

"Accounts-per-tier 1/2/10" and "services-per-account 5/10/∞" were **owner-side numbers layered on top of code** — they are NOT enforced anywhere. Keep them flagged **unratified**; the §6 allocation is authoritative until the owner locks new numbers.

### ⛔ Still OPEN in §6 (owner must settle — do NOT publish)
- **Price RESOLVED (marketing session, 2026-07-01) → "Ladder B":** Solo **₱999** · Pro **₱2,499** · Enterprise **₱4,999** /28d (annual ₱9,999 / ₱24,999 / ₱49,999). Ladder A (₱2,000/6,000/10,000) is dead — purge from the `TIER_PRICE_PHP` fallback + any seed migration when wiring. Dashboard still reads `getVendorPrices()`, never hardcode.
- **⚠ Enterprise repriced AGAIN + new Custom tier (marketing session, same day, AFTER Ladder B):** Enterprise **₱4,999 → ₱7,499**/28d (annual ₱74,999), now **BOUNDED not `Infinity`** — provisional caps ~10 seats · nationwide · portfolio ~300 · ~8 events/day (confirm with owner before wiring). New **Custom "Talk to us"** tier (~₱15,000+/28d, negotiated) sits above for franchises / multi-location / truly-unlimited. **Full ladder: Free ₱0 · Solo ₱999 · Pro ₱2,499 · Enterprise ₱7,499 · Custom.** → **Prototype tier cards need updating** (Enterprise price + soften "unlimited team" + add a Custom card).
- **File sharing in threads NOT built** — help copy overstates it. Our Messenger info-panel "shared files" section is a **design proposal**, not a port.
- **`vendor-cards.ts` PAID_TIERS excludes Solo** from day-1 name reveal (contradicts `solo.nameMode='true'`) — a real code bug the marketing session filed; derive `isPaidTier` from `tierCaps(tier).nameMode`. Not our surface, but our masking/reveal UI must assume **Solo reveals name day-1** once that's fixed.

---

## 0.7 THIS-SESSION design decisions (now in the all-screens prototype)

The prototype grew **past the 5-menu plan → canonical structure is now 6 menus**. Read every "5 menus" below as **6** (add **On the Day**).

1. **6th menu · On the Day** — a **category-conditional** day-of console (`odayCat` switch). Different tools per service category: **Photo/Video** (shot list · timeline) · **Coordinator/Planner = full command center** (run-of-show timeline · vendor check-in · issues log · broadcast) · **Caterer** (pax/headcount) · **Band/DJ** (setlist). Free surface. → new **Phase 7**.
2. **Roles wired into visibility** (§0.5 Admin/Agent/Viewer). **Agents see only Overview · My Customers · My Performance · On the Day** (own records) — no Profile / Team / website-content / subscription / tokens-buy. **Calendar gets a per-agent filter** (admin can scope any one agent's calendar + performance). **Reply-to-review = admin-only.** **Specialist tools appear only on services in their category.**
3. **My Customers = Facebook-Messenger-style 2-pane chat** + info panel (thread list · conversation · customer-info rail). Payments live here: setup payment options · **ongoing vs total-expected this month**.
4. **Inquiry masking** — a customer renders as **"New Customer"** everywhere (Overview task rows + Messages) until the vendor **accepts** the inquiry (burns the region-banded token). Real name + event reveal **only on accept**. Consistent across all surfaces.
5. **No-double-booking + waitlist** — accepting is blocked once a date hits `slotsPerDay` capacity; when a date is full the **couple-side CTA becomes "Join waitlist"** (they cannot inquire-to-book it), and top-of-waitlist is promoted if a booking cancels. **Proposed: waitlist is free; the token burns only on conversion to a booking** (owner to confirm — mirrored to the §5 handoff log).
6. **My Performance upgrades** — app-vs-import **ROI attribution** (Setnayan-sourced revenue vs imported · the value-prop) · **traffic-source funnel** (Explore / Website / Shared → views → inquiries → quotes → booked) · detailed **Demand Radar** (by-area + attribute chips + capture rate) · animated health gauge + momentum. *(Funnel + radar EXTEND shipped surfaces; **ROI attribution + by-area detail are NEW build** — flag, not reconciliation.)*
7. **My Services card preview** — "**Your service card on Explore**" renders the shipped Explore unit, which is a **service card** (one per service), NOT a vendor card. Per the owner card contract in `app/explore/_components/vendor-card.tsx`: **Photo · Badges · "[Service] by [Vendor]" · Starting price/range · Distance from reception venue · Rating · Reviews carousel · [View Vendor] [Add to Plan]**. **[View Vendor] opens the vendor _website/microsite_ `/v/[slug]`** — not another card. Name is **masked** (anonymized "Verified Photographer in <city>" via `resolveVendorDisplayName`) for Free/Verified **until first reply** (`name_revealed_at`); **Solo+ reveals day-1** (`isTrueNameTier` — note the shipped `vendor-cards.ts` PAID_TIERS bug excludes Solo, flagged by the marketing session). Preview reads the **same fields the Explore card reads** (single source of truth).

---

## 0.8 BUILD ORDER — core spine first, specialized modules last (owner-agreed direction)

Build the **shared spine end-to-end first**, working across customer + vendor + admin:

> **create service → service card on Explore → couple opens vendor website `/v/[slug]` → inquiry → accept (token burn) → booking → chat cascade (proposal · contract · schedule · payment) → deliver → review**

**Then** layer the **specialized per-category modules** (On the Day coordinator/caterer/band consoles · per-category specialist service tools) **incrementally**. Their designs are already captured in the prototype, so deferring loses nothing. Rationale: they're **depth that plugs into the spine**, they each want **real domain input** (a real coordinator's run-of-show, a caterer's pax rules), and we're **mid-reconciliation** — stabilize the foundation first. → this makes **Phase 7 (specialized) the LAST phase**; do not start it until the spine is verified working.

---



> **Status: PLAN · pending owner sign-off (2026-07-01).** Turns the session's design decisions + the clickable prototypes into a sequenced code plan.
> **Verdict from the code audit: MODERATE WORK.** The 4→5 menu regroup is low-risk (one array edit); the real work is the money-integrity fixes, tier caps, partnerships rip-and-replace, the net-new calendar schema, and the My Performance page.
>
> **Design artifacts (the "what it looks like"):**
> - `Vendor_Dashboard_AllScreens_2026-07-01.html` — all 5 menus, 5 account types, live interactions (canonical actual-look)
> - `Vendor_Dashboard_Reorg_2026-07-01.html` — functional map (every route → menu, per-tile server actions / tables / cross-actor wiring)
> - Repo paths: code = `~/apps/web`, **migrations = `~/supabase/migrations`** (workspace root, NOT apps/web).

---

## 0.9 SUBSCRIPTION UPGRADE PRORATION (owner-specified 2026-07-01)

Rules for upgrading while on a current plan. **Backend billing rule — computed at charge time; the computation is NOT surfaced in the vendor UI** (owner 2026-07-01: "no need to show how we compute"). The vendor just sees the final upgrade price.

1. **Every tier gets 3 free 28-day cycles.** A subscription year = **13 cycles**; the vendor is **charged for only 10** — the **first 3 cycles are free** and **none of their paid money is consumed** during them. (This is exactly why each annual price = 10× the 28-day fee: Solo ₱9,999 = 10×₱999 · Pro ₱24,999 = 10×₱2,499 · Ent ₱74,999 = 10×₱7,499.) So an upgrade **during the first 3 free cycles** has nothing to prorate → charges the **full new-tier price**, and the **billing calendar resets**.
2. **Proration begins only after the 3 free cycles**, and is **rated at the current plan's 28-day (monthly) fee** — not the annual.
3. **Credit = current monthly fee × (days elapsed in the current paid cycle ÷ 28).**
4. **Upgrade bill = new-tier price − credit**, and the **calendar resets** on upgrade.

**Worked examples (owner's):**
| Scenario | Credit | Upgrade bill (→ Pro annual ₱24,999) | Calendar |
|---|---|---|---|
| Upgrade during Solo's 3 free cycles | ₱0 | **₱24,999** (full) | resets |
| Upgrade 5 days into the **first paid** Solo cycle | ₱999 × 5⁄28 = **₱178.39** | 24,999 − 178.39 = **₱24,820.61** | resets |

**✅ Resolved (owner 2026-07-01):** free cycles apply to **all tiers** (year = 13 cycles, charge 10, first 3 free). This is a NEW pricing fact absent from `VENDOR_TIERS_AND_BENEFITS §2/§6` — flag to the marketing session to fold in.

**⚠ Still to confirm (money rule — load-bearing):**
- **Credit is on days USED (elapsed), not days REMAINING.** This is the reverse of typical SaaS proration (which credits unused time). The owner's numbers are explicit (5 elapsed → 999×5/28), so the model does exactly that — but confirm before wiring the charge.
- **Monthly vs annual free-cycle interaction.** "First 3 free" applies to all tiers; confirm it applies to **monthly subscribers too** (owner said "always"), which makes monthly ≈ annual in year 1 — vs "charge 10 of 13" being the annual-only discount. And whether **upgrading forces the annual term** (the examples all charge the annual figure).

---

## ⚠ 0. OWNER SIGN-OFF REQUIRED (resolve before building the affected phase)

Several of our decisions **reverse recently-merged, owner-locked code**. Per the "surface load-bearing decisions" rule, these need an explicit yes before the code changes:

| # | Decision | What it reverses / the tension | Recommendation |
|---|---|---|---|
| A | **Tokens + Subscription leave the nav** (badge/balance in chrome) | They were *just* consolidated into the "Grow" group on **2026-06-14** (owner-locked REDESIGN_PLAN). | Proceed — chrome entry points replace the tiles; routes stay mounted. |
| B | ~~**No free tokens + buy requires verification**~~ **RESOLVED (§0.6)** | `canBuyTokens()` was opened to FREE on 2026-06-07 so free vendors could buy tokens to import clients. | **Import is now FREE both ways** (`e95f77315`, `3d8973077`) — no token burned, so the no-free-token gate no longer bricks the CRM on-ramp. **No action** — decision landed the way we recommended. |
| C | **Remove subscription-bundled tokens** | Bundles were repriced + made **LIFETIME** (2026-06-09) and Solo got +2/mo on **2026-06-25** — a recent owner perk. | Confirm removal (prices were lowered to compensate, per your 2026-07-01 note). |
| D | **Redeem-code / Special Codes retired** | Page actively maintained (last touched 2026-06-25); its action **mints free tokens** → an unlinked-but-reachable URL is a live backdoor. | **HARD-DELETE** the route (not just unlink). Also decide fate of the admin `grant_tokens` voucher type. |
| E | **Branches → Pro+** (Solo 1 / Pro 2 / Ent 10) | `branches/actions.ts` hard-codes Enterprise-only with an *"owner-locked 2026-06-05"* comment. | Confirm the flip. |
| F | **"Account = branch"** | Code has **no unified account cap**: `agentAccounts` (team seats: free0/verified1/pro3/ent∞) and `vendor_branches` are *separate* concepts. "Account" must be mapped to one. | Confirm **account = branch/location** (add a new `accountBranches` cap); leave team seats as-is. |
| G | **Per-account service ceiling** (Solo 5 / Pro 10 / ∞) | Brand-new cap on top of the shipped per-leaf cap; the registration picker hard-caps at a tier-agnostic **24**. | Confirm the numbers + that the ceiling is *in addition to* per-leaf. |
| H | **Recommend = mutual-accept** | Rips-and-replaces the admin two-admin partnership model that merged **days ago** (RLS hard-blocks vendor self-verify). The current `relationship_type` taxonomy (accredited/sponsored) is *asymmetric*; mutual-accept is symmetric. | Confirm rip-and-replace + which menu owns Partnerships (prov. My Shop). |
| I | **Calendar 6 states** | Only **booked + blocked** have storage today; locked/waitlist/whitelist/other are **net-new schema**. Per-date "service full" contradicts the deliberate **pool-grain** capacity lock (2026-06-12). | Confirm the 6-state model + per-date capacity override + the Whitelist definition (I assumed "vendor-approved priority hold"). |
| J | **Business-health score** | `platform_health_score` exists but is **intentionally HQ-internal**. | Build a **new sanitized vendor-safe composite** (5 pillars), never surface the internal score. |

---

## ✅ 1. ALREADY ALIGNED (no work — good news)

- **100-on-verification free-token grant is already retired** (`20270110320020` no-op stubs). Decision 2 ~60% done.
- **`tier_state` enum already = `free|verified|solo|pro|enterprise`** — our 5 account types match.
- **Location-band token burn (₱100/200/300) is shipped and correct** — Decision 4, keep as-is.
- **Nav icons are already one Lucide family, no emoji** — Decision 9 aligned (one public exception below).
- **Per-leaf service cap shipped + server-enforced** (free2/verified2/solo3/pro5/ent∞).
- **`event_vendors` co-occurrence data exists** (event_id + vendor FK + status + archived_at) — the "worked together" badge is computable; `explore/page.tsx` already runs that query shape.
- **Prices are NOT hardcoded** — read from the admin DB catalog via `getVendorPrices()`.
- **Marketing doesn't claim unverified can buy/subscribe** — no contradiction with the new gating.
- ~~**Personal/member token wallets do NOT exist in the codebase**~~ — **CORRECTED (see §0.5):** they DID ship (`20270401611377`). This line was written against the 462-behind checkout; superseded.
- **Annual-first subscription is already shipped** (`3e1dc17f7`) — our subscription page matches, not net-new (§0.6).
- **Demand Radar / Vendor funnel / Price-position surfaces already shipped** — My Performance builds on them (§0.6).

---

## 2. BUILD PLAN (sequenced)

### Phase 1 — Nav regroup (LOW RISK · do first, unblocks the IA)
Pure edit of the single in-code `VENDOR_NAV_GROUPS` array — every `href`/`matchPrefix` stays byte-identical, **no route folder moves**, the `/more` landing auto-derives, and all **908 hard-coded refs across 166 files** stay valid. Only the bottom-nav `activeMatch` roster is hand-synced.

| Item | Files | Size | Blocking |
|---|---|---|---|
| Rewrite `VENDOR_NAV_GROUPS` 4→5 menus (Overview · My Shop · My Customers · My Performance · My Services) | `vendor-sidebar.tsx` | M | — |
| Remove Subscription + Tokens **nav rows** (routes stay mounted; add chrome entry points → Subscription page + Buy-tokens page) | `vendor-sidebar.tsx`, `vendor-bottom-nav.tsx`, `more/page.tsx` | M | — |
| Bottom-nav `activeMatch` roster stays exhaustive after regroup (add My Performance, drop redeem-code) | `vendor-bottom-nav.tsx` | S | **yes** |
| Fix stale deep-link `/vendor-dashboard/settings/notifications` (404s today) → real `/notifications` | `lib/vendor-email-triggers.ts` | S | — |
| Fix pre-existing `sortOrder 17` collision (reviews + partnerships) while in the registry | `lib/nav-registry-defaults.ts` | S | — |
| Group-key strategy for the 2 new menus (reuse keys for localStorage open-state continuity) | `vendor-sidebar.tsx` | S | — |

### Phase 2 — Money integrity (BLOCKING · security-sensitive)
These close the free-token paths and enforce the verification gate. **Do together** — a half-done state is a backdoor.

| Item | Files | Size |
|---|---|---|
| Remove subscription-bundled tokens (zero `_apply_subscription_credit` bundle CASE + `TIER_SUBSCRIPTION_BUNDLE_TOKENS`=0) | new migration on `20261012000000_*`, `lib/vendor-tier-caps.ts`, `admin/vendors/actions.ts`, `subscription/page.tsx` | S |
| Gate **buy tokens** on verification server-side (RPC `create_vendor_token_purchase` → RAISE `NOT_VERIFIED`); wire `canBuyTokens()` (currently dead code returning true for all) | new migration on `20260916000000_*`, `tokens/actions.ts`, `tokens/page.tsx` | M |
| Gate **subscribe** on verification server-side (RPC `create_vendor_subscription`) + page/CTA | new migration on `20261010000000_*`, `subscription/actions.ts`, `subscription/page.tsx` | M |
| **Hard-delete redeem-code** route (page+actions+loading) — it mints free `earned_tokens` | `redeem-code/*`, `lib/routes.ts`, `lib/route-meta.ts` | S |
| Repoint in-content redeem CTAs (earnings "voucher code?" card, 2 manpower "Redeem code" links) → Buy-tokens/Subscription | `earnings/page.tsx`, `manpower/page.tsx`, `manpower/_components/gig-card.tsx` | S |
| Decide admin `grant_tokens` voucher type fate (remove option or keep dormant for audit) | `admin/discount-codes/*` | M |

### Phase 3 — Tier caps *(after decisions E/F/G)*
| Item | Files | Size |
|---|---|---|
| Branch gate Enterprise-only → **Pro+** (`requireBranchManager` line 67) | `branches/actions.ts` | S |
| Add `accountBranches` cap (Solo1/Pro2/Ent10) + enforce count on create | `lib/vendor-tier-caps.ts`, `branches/actions.ts` | M |
| Add `servicesPerAccount` ceiling (Solo5/Pro10/∞) **keeping** per-leaf cap | `lib/vendor-tier-caps.ts`, `services/actions.ts` | M |
| Reconcile hard-coded `MAX_SERVICES=24` picker vs the new ceiling | `services-picker.tsx` | S |
| Handle `is_founder` bypass (forces Infinity caps) so new caps don't break the founder | `services/actions.ts` | S |

### Phase 4 — Partnerships → mutual-accept *(after decision H — rip-and-replace of days-old code)*
Add `status(proposed|accepted|declined|withdrawn)` + `accepted_at` + unordered-pair UNIQUE; new vendor actions (propose/accept/decline/withdraw); two-way inbox UI; derived "worked together" RPC from `event_vendors`; **flip `explore` badge from `admin_verified=true` → `status='accepted'`** (else all badges vanish); retire/convert the admin queue. Files: `partnerships/*`, `admin/vendor-partnerships/*`, `explore/page.tsx`, new migrations. Size **L**.

### Phase 5 — Calendar *(after decision I — net-new schema)*
6-state taxonomy (net-new storage), per-date capacity override (threaded into the atomic pool RPC, not just UI), month→day→profile drill-down (`calendar/[date]` route), heat-map view, filter by type + service. Note **Named Calendars** (live-by-default flag) recently reshaped this area. Files: `calendar/*`, `lib/vendor-schedule.ts`, new migrations. Size **L**.

### Phase 6 — My Performance page *(after decision J)*
Standalone `/vendor-dashboard/performance` route (move `VendorStatsPanel` out of Home); new **vendor-safe** health composite + 5 pillars; monthly/annual momentum + funnel — **requires a new `vendor_activity_stats` history table** (today it's a single snapshot row, so time-series is impossible without it). Files: new `performance/page.tsx`, `vendor-stats-panel.tsx`, `lib/vendor-activity.ts`, new migration. Size **L**.
**Reuse shipped surfaces (§0.6):** **Demand Radar** (`/demand` · `demand_radar_for_vendor`), **Vendor funnel** (`lib/vendor-funnel.ts`), **Price-position** (`lib/price-position.ts`) already exist — compose them into the page rather than rebuild. **NET-NEW:** app-vs-import **ROI attribution** (needs a source dimension on bookings: Setnayan-sourced vs imported) + Demand-Radar **by-area / attribute / capture-rate** detail. Note shipped analytics are **time-over-time / percentile, not vs-peers**.

### Phase 7 — Specialized per-category modules *(LAST · after the spine is verified — §0.8)*
The category-conditional depth. Do NOT start until the core spine (service → card → inquiry → accept → booking → chat cascade → deliver → review) works end-to-end.
| Item | Notes | Size |
|---|---|---|
| **On the Day** menu (6th) — category switch (`odayCat`) | Photo shot-list/timeline · **Coordinator command center** (run-of-show · vendor check-in · issues log · broadcast) · Caterer pax · Band/DJ setlist. Free surface. New `on-the-day/page.tsx` + per-category components. | L |
| Per-category **specialist service tools** | Show only on services in the matching category (Manpower/Moodboard/Repertoire → My Services; verification-gated per §6). | M |
| Waitlist promotion + On-the-Day check-in wiring | Threads into the calendar capacity + booking state from Phase 5. | M |

---

## 3. Conflicts with recent code (resolve in-flight)
- **`is_founder` bypass** forces `parentCategories`+`servicesPerLeaf`=Infinity and skips the token gate — new per-account ceilings must respect it.
- **Subscription-bundle LIFETIME tokens** now sit in the same `purchased_tokens` bucket as genuine purchases — removal must not claw back already-granted tokens.
- **Partnerships RLS** hard-blocks vendor self-verify (`admin_verified=false WITH CHECK`) — mutual-accept needs new RLS.
- **Named Calendars** + **pool-grain capacity lock (2026-06-12)** — the calendar work must thread through these, not around them.
- **Client-import burns 1 token** — see Decision B; keep import free or the no-free-token rule bricks it.

## 4. Marketing sync (`/for-vendors`)
- Soften the **"free weekly unlocks"** claim (`vendor-vision.tsx:44`, `page-tail.tsx:464`) — no free token-equivalents.
- Replace **emoji** in `vendor-pricing-matrix.tsx` (section glyphs + tier markers) with Lucide — the one remaining Decision-9 violation, on a public surface.
- Reconcile subscription **prices**: live catalog = Solo ₱999 / Pro ₱2,499 / Ent ₱4,999, but FAQ hardcodes ₱6,000/₱10,000 (`page-tail.tsx`, `lib/v2-catalog.ts`).
- Cosmetic: clean stale "100 free tokens" comments in `vendor-hero.tsx` / `vendor-vision.tsx`.

---

## 5. Suggested order
**Phase 1 (nav) → Phase 2 (money integrity) → Phase 4/marketing copy in parallel → Phase 3 (caps) → Phase 5 (calendar) → Phase 6 (performance) → Phase 7 (specialized modules, LAST).**
Phase 1 is safe to ship immediately. Phase 2 is the security priority. Phases 3–6 each depend on an owner decision above. **Phase 7 stays last per §0.8** — build the core spine across all three actors, verify it, *then* layer the category-specific depth.

### Price reconciliation (RESOLVED 2026-07-01 · see §0.6)
Ladder settled: **Free ₱0 · Solo ₱999 · Pro ₱2,499 · Enterprise ₱7,499 · Custom (contact)** /28d. Ladder A (₱2,000/6,000/10,000) is dead — purge from `TIER_PRICE_PHP` fallback + seed migrations. Enterprise is now **bounded** (provisional caps — confirm before wiring). Dashboard reads `getVendorPrices()`, never hardcode. Marketing session owns the `/for-vendors` FAQ price fix.
