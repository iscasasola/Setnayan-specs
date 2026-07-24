# Vendor Value Proposition + Promotion Plan — 2026-07-24

**Purpose:** how to promote the vendor side now that the fee model moved off "0% commission forever" → flat 5% (no cap). Grounded against a live-code audit of `origin/main` (2026-07-24).
**As-built SSOT:** `apps/web/VENDOR_TIERS_AND_BENEFITS.md` §6 (repo). This doc is the *marketing/positioning* layer on top of it — do not let the two diverge.
**Status:** working plan. Fee reprice = DECISION_LOG 2026-07-24. Page copy not yet built; "0% commission" public copy not yet reconciled.

---

## 0 · The timing truth that reframes everything

**The 5% is coded but NOT collectible.** Booking-fee enforcement is behind TWO flags (`NEXT_PUBLIC_BOOKING_FEE_ENABLED` + `NEXT_PUBLIC_BOOKING_FEE_RAIL_LIVE`, both default OFF) AND the PayMongo checkout to charge it is unbuilt (`lib/booking-fee-gate.ts`). **So in production today, vendors pay 0%.**

→ We are NOT promoting "the end of 0%." We promote **"free to join, 0% while we launch, then a flat 5% only on the couples we bring you"** — honest today, and it pre-frames the future fee as a finder's fee on *new* business, not a loss.

**Two-phase messaging:**
- **Phase A (now, fee dark):** "Free to list. 0% commission. We never hold your money."
- **Phase B (when flags + rail go live):** "Free until you book — then a flat 5%, only on couples Setnayan brings you. Your imported clients stay free forever."

---

## 1 · Positioning spine

> **"List free. Keep your own clients free, forever. Pay only when Setnayan brings you a booking — and only when it closes."**

Promise order on the page: **(1) zero risk to join → (2) you only pay on OUR leads → (3) a storefront + booth no competitor has → (4) the fee, as a footnote.** Never lead with the fee; we lose on that axis (5%-no-cap is the expensive end vs 0%-commission competitors who charge subscriptions instead).

---

## 2 · The benefit stack — in THREE honesty tiers

### ✅ PROMOTE NOW — live, reachable, true today

- **Free to join** — 2-step `/open-shop` wizard (shop name + primary service + city; then contact/website/socials). No subscription to operate.
- **0% commission / we never hold your money** — structurally true (fee rail dark; you settle off-platform).
- **Full vendor dashboard, free** — ~50 routes: home, services, calendar, clients, bookings, earnings, performance, messages, team, shop, contracts, recaps, on-the-day, reviews.
- **Proposal Maker** — templates + merge fields, send in-chat, public accept page `/proposals/[publicId]`. (Ungated in code today.)
- **Public vendor page `/v/[slug]`** — profile + microsite + unified photo/video gallery + inquiry composer.
- **3D booth in the couple's walkable Plan** — your logo renders on `BoothSign` inside the 3D venue guests walk through. *No competitor has this.* (Pro/Enterprise perk; branding bug fixed in `public_venue_scene` v8/v9 — confirm deploy before any demo.)
- **Performance / Market Intel** — Demand Radar, funnel (views→inquiry→quote→booked by source), price-position percentile. ⚠️ *Currently reachable by ALL vendors* (paywall flag off) — see §3.
- **Import your existing clients — free, cost 0** — CRM, claim-QR; you only ever pay on Setnayan-sourced bookings.
- **Team seats** — Solo 1 / Pro 3 / Enterprise 10 + multi-admin governance + paid extra-seat buy flow.
- **Past-events gallery (facts layer)** — venue + month/year + event-type, no couple PII.
- **Manpower marketplace, partnerships/co-listing, contracts + e-sign, .ics export, mood-board preview.**
- **Customizable services with flexible pricing** — three bases: **fixed**, **per-guest**, **per-hour**, each with packages, inclusions (worth ₱), add-ons, refinements, coverage panel, crew/transport line-items, and **custom payment schedules**. *(Say "fixed / per-guest / per-hour" — do NOT say "tiered": multi-tier pax brackets are a later phase.)*
- **In-thread video + audio calls** — free peer-to-peer (WebRTC/TURN), room UI complete, wired on 4 thread surfaces. **Never recorded** (media never touches a Setnayan server — the calls-never-recorded lock). Currently open to every vendor (the Solo+ paywall is flag-dark).
- **Verified vendor badges + bot-protected signup** (Cloudflare Turnstile) — the honest, live slice of "trust/fraud." *(This is what you CAN say about fraud — see the flag-dark stack below for what you can't.)*
- **"First 5 bookings are on us."** (owner-locked tagline, 2026-07-24) — the launch hook + primary CTA. The observation window that seeds each vendor's pricing baseline; couple-confirmation stays on. *(Honesty asterisk: it's per **verified vendor identity** — so the reg-number unique-index must land first, or "on us" is farmable by re-registering.)*

### 🌓 COMING SOON — built but flag-dark (say "coming," don't demo as live)

- **In-chat negotiation cards** — auto-read schedules/discounts/inclusions → accept/revise/decline inline (`NEXT_PUBLIC_CHAT_NEGOTIATION_V1`).
- **Free front-desk chatbot / auto-reply** — deterministic, ₱0/reply (`NEXT_PUBLIC_VENDOR_AUTOREPLY_V1`).
- **Off-platform-contact protection** (`NEXT_PUBLIC_CHAT_CONTACT_FILTER_ENABLED`).
- **Deep Search auto-fill** — research your own business → "What We Learned" → auto-fill profile (₱500/search, Pro+ 1 free/cycle; gated by an admin data-privacy control).
- **Theft Watch** (reverse-image) — built, Pro, paywall dark.
- **Free-during-launch promo windows** (`PROMO_FREE_WINDOWS_ENABLED`).
- **Photo Challenge / Papic Games** — auto booth missions from `event_vendors` + custom challenges + guest leaderboard; **promotes the vendor through participation** (the "Kuha-can't-copy" hook). Flag-dark (`NEXT_PUBLIC_PAPIC_GAMES_V1`); ₱400/event add-on when live (guests + couple play free).
- **In-chat schedule / negotiation cards** (auto-read schedules/discounts/inclusions → accept/revise) — `NEXT_PUBLIC_CHAT_NEGOTIATION_V1`. *(The proposal card is already live; only the auto-reader is dark.)*
- **Vendor protection — SPLIT the old inquiry-fraud stack (owner 2026-07-24):**
  - 🗑️ **RETIRE `LEAD_TOKEN_HOLD_ENABLED`** (token hold-and-release) — built to protect the per-inquiry *token* spend; tokens are retired and inquiries are free, so there's nothing to hold or refund. Dead weight.
  - ✅ **KEEP + REPURPOSE the rest** — it protects vendor *time* and guards the free-5 window, both of which survive the token retirement:
    - **Inquiry velocity caps + Turnstile** (`NEXT_PUBLIC_INQUIRY_GATE_ENABLED`) → spam/bot floods still waste a vendor's *time* even when inquiries cost nothing.
    - **"Active planner" lead-trust badge** (`NEXT_PUBLIC_LEAD_TRUST_BADGE_ENABLED`) → helps vendors prioritize serious couples over tire-kickers.
    - **`identity_clusters` + device fingerprint** (`NEXT_PUBLIC_DEVICE_FINGERPRINT_ENABLED`, DPO-gated) → **now MORE important**, repurposed from "inquiry fraud" to **account-farming defense** — the exact defense the free-5-bookings window needs against re-registration abuse (pairs with the reg-number unique-index). Deleting this would undercut the free-window we just locked.
  - All still flag-dark / admin-shadow today.
- **"Booth Studio" — custom 3D booth design (the owner's "3D Plan boosting," clarified 2026-07-24).** A subscription upgrade — **₱1,500 / 28 days, unlimited** (owner 2026-07-24) — bundling: **custom posters/banners on the booth** + **custom booth styling** + **being favoritable** by couples. ⚠ Pin whether this is a standalone SKU or an add-on stacked on a base tier (Solo already includes the *basic* branded booth). Build status: booth **logo** branding is already built (Pro/Ent, paywall flag-dark via `VENDOR_TIER_FEATURE_GATE`); **poster/banner placement = NEW BUILD** (designed in the revenue doc, not shipped); favoritable = the built-but-dark `VENDOR_FAVORITES_SUBSCRIPTION_GATE`. ⚠ **Cosmetic, NOT ranking** — lock-compatible; never label it "boost/promote." ⚠ **Aesthetic guard:** compose posters from a STRUCTURED template in the couple's palette + scope per-event, so it enhances the couple's venue instead of reading as an ad. ⚠ **Timing:** don't flip the favorites gate during free-during-launch (4 vendors → marketplace blanks).

### 🚫 DO NOT CLAIM — roadmap / design-only / broken

- **🔒 "Boosting" / paid visibility / sponsored placement — DOES NOT EXIST + violates a hard lock.** No boost/ads/promoted-placement SKU exists for vendors (3D booth *branding* is a tier perk, not a boost; Photo Challenge is a flat sponsorship, not ranked promotion). **Ranking is "merit-only · can't-buy-your-way-up," owner-locked.** Never put "boost," "promote," or "sponsored" on the page — it's a fake door AND contradicts the lock. *(Reframe the vendor's intent as "get more visibility by participating" — via the Photo Challenge and a branded booth — never "pay to rank higher.")*
- **Multi-tier / bracket ("tiered") pricing** — not built; only fixed / per-guest / per-hour exist.
- **Verified-median price card + budget-matched leads** — the couple-facing median + budget-match is **NOT built**; only a vendor-only percentile exists. This was a headline in my earlier draft — **pull it** until built.
- **True "benchmarks vs peers"** — only time-over-time + percentile today; the vs-peers promise is placeholder.
- **"Read files in-thread" / file sharing with couples** — active over-claim in Help copy with **no feature behind it**. Do not repeat.
- **Photo/rich past-events galleries** — deferred (needs consent column + DPO).
- **Advanced/AI proposal drafting, Bid Button, QBR, custom-tier configurator, referrals** — marketing-only / not started.

---

## 3 · Tier map — and the paywall reality

Base subs (DECISION_LOG 2026-07-15 / this session; fee buy-downs DROPPED — subs sell features only):

| Tier | Price | The reason to buy it |
|---|---|---|
| **Free / Verified** | ₱0 | Storefront, proposals, dashboard. Verification is free. |
| **Solo** | ₱1,000/28d | The **branded 3D booth** (grey → branded) + 1 seat. |
| **Pro** | ₱2,500/28d | **Market Intel** + Theft Watch + 3 seats — the hero tier. |
| **Enterprise** | ₱8,000/28d | 10 seats, reach, unlimited categories, API access. |

⚠️ **The paywall is OFF today** (`VENDOR_TIER_FEATURE_GATE` default off — every demo vendor is `tier_state='free'`). So **Market Intel, Theft Watch, and the booth are currently reachable by everyone.** Marketing them as paid tiers while all vendors can reach them is a positioning risk — decide whether launch flips the gate on, or whether these stay free during launch (aligns with free-during-launch).

**Never tier (owner principle):** reviews, median, past-events, listing, and **the inbox**. ⚠️ See §4 — the inbox principle is currently violated in code.

---

## 4 · Two decisions that gate the pitch

1. **The inbox is currently GATED, contradicting our attack line.** In-app chat is verified-gated (`TIER_FREE_NO_INAPP` blocks unverified; verified capped **10 conversations/week**). We cannot honestly say "your inbox is never locked" while this holds. **Decide:** raise/remove the cap (so the attack line becomes true), or drop the claim. Recommend raising it — the ungated inbox is a genuine differentiator vs Bridestory's credit-gated one, and it's cheap (answering is deterministic ₱0).
2. **When does the fee go live?** Until PayMongo checkout ships + both flags flip, 0% is true. **Decide the transition trigger + the grandfathering message** ("everyone who joins during launch keeps 0% through their current bookings") so the switch doesn't feel like a bait-and-switch.

---

## 5 · `/for-vendors` page wireframe

1. **Hero** — the spine line + "Free to join. 0% while we launch."
2. **Cost-comparison card** — Bridestory ~₱29k/yr + credit-gated inbox **vs** Setnayan ₱0 + (later) 5% only on our leads.
3. **Objection-killer** — "Bring your whole book of business free. You only pay on couples *we* send you."
4. **The moat** — the 3D booth guests walk past + your free storefront + free business tools.
5. **Proof** — real vendor logos/booths (once we have the first cohort).
6. **Fee footnote** — "When we do charge, it's a flat 5%, only on Setnayan-sourced bookings. You keep 95%. Your clients stay free."
7. **CTA** — "Open your shop free — first 5 bookings on us."

---

## 6 · The real lever: channel, not tagline

Supply is the binding constraint (~4 real vendors). A page doesn't fix a cold start. **The best promotion right now is founder-led hand-recruitment of the first 20–50 quality vendors**, pitched with: *bring your clients free · 0% while we launch · first 5 bookings free · a 3D booth no one else has.* The page is the closer; direct outreach is the opener. Paid ads are premature until the cohort proves conversion.

---

## 7 · Honesty guardrails (no fake doors)

- Don't claim verified-median/budget-matching, "vs-peers," or "file sharing in chat" — not built.
- **Never say "boost," "promote," "sponsored placement," or "tiered pricing"** — boosting doesn't exist and violates the merit-only ranking lock; tiered pricing isn't built. (Video/audio calls ARE live; Photo Challenge is flag-dark, not live.)
- Don't imply any fee/charge rail is live — PayMongo checkout is unbuilt.
- Don't publish "Solo = token-free answering" — false in code; tokens are retired anyway (answering is free every tier, capped).
- Confirm `public_venue_scene` v8/v9 is deployed before any booth demo.
- Reconcile the live "0% commission" copy *before* Phase B, not after.
