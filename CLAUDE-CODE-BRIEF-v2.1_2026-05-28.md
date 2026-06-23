# Setnayan · Build Brief for Claude Code

**Project:** Setnayan — the first Filipino-built operating system for weddings (other event types follow)
**Founders:** Claire Buanhog and Indalecio "Ice" Casasola II
**First wedding:** December 18, 2026 — Claire & Ice's own wedding will be the first wedding shipped through the app
**This doc:** Locked v2.1 product spec + handoff package, written May 28, 2026

This is the single document to read first. After this, the deeper context lives in `HANDOFF.md` (the original engineering handoff) and `docs/` (component inventory, data models, full playbook). When this file and an older doc disagree, **this file wins** — it reflects the most recent founder decisions.

---

## 1 · What Setnayan is, in one paragraph

Setnayan is a discovery + planning platform for Filipino weddings. Couples plan their wedding with free tools (guest list, RSVP, budget, mood board, schedule, personal wedding website, per-guest QR, verified vendor directory, unlimited bidding, reviews). Vendors get a free profile, can verify once (₱1,499) for a lifetime badge, and use **tokens** (₱100 each · region-weighted 1–3 per lead = ₱100/₱200/₱300, banded by the wedding region's minimum wage) to respond to couple bid requests. Setnayan takes **0% commission** on vendor bookings — it never sees the money between vendor and couple. Revenue is subscription + tokens + Setnayan Productions (a 22-service à-la-carte catalog Setnayan sells directly to couples).

---

## 2 · The pricing model (v2.1 · locked)

### 2.1 · Commission

- **0% commission on every vendor booking.** Setnayan does not process, hold, or touch any vendor-to-couple payment.
- Couple and vendor agree on price + terms directly. The vendor invoices, the couple pays, the vendor keeps 100% (minus their own EWT).
- The platform tracks the booking in the couple's dashboard for coordination, but **no money flows through Setnayan**.
- No BIR Official Receipts issued by Setnayan for vendor bookings. No EWT. No Form 2307. No milestone-protected payments. No on-platform-vs-off-platform distinction.
- Couples never see a surcharge on what their vendor lists.

### 2.2 · Revenue lines

| Line | Amount | Who pays | When |
|---|---|---|---|
| **Vendor verification** | ₱1,499 one-time | Vendor | At onboarding · lifetime verified badge |
| **Document refresh** | ₱499 | Vendor | When business documents change |
| **Pro subscription** | ₱2,499–₱3,999 / 28 days (region-tiered) | Verified vendors | Recurring · 1 category · 5 team accounts · current built pilot ₱499/wk → sunsetting at token cutover |
| **Enterprise subscription** | ₱5,499–₱8,499 / 28 days (region-tiered) | Verified vendors | Recurring · multi-category · unlimited team accounts · not yet built |
| **Bidding token packs** | ₱100 / token · packs 4/10/25/50/100 | Vendor | As needed · region-weighted 1–3 tokens (₱100/₱200/₱300, min-wage banded) to answer a lead |
| **Boosted Ads** | ₱1,200 / wk | Pro+ vendors | Pausable any time |
| **Sponsored Boost** | By category | Pro+ vendors | Quarterly or annual |
| **On-site verification + content package** | Vendor-set range · Request bid | Vendor (premium) | One-off |
| **Setnayan Productions services** | ₱999 – ₱18,000 per service · à la carte | Couples | Per-event purchase |

### 2.3 · Founder bonus (time-limited)

- **100 free bidding tokens** dropped into a vendor's wallet on verification.
- **Available only to vendors who verify before 31 January 2027.** After that date, the founder bonus ends.

### 2.4 · Token economy

- **Earn**
  - 100-token founder bonus on verification (until 31 Jan 2027).
  - +1 token every time a vendor's recommendation link drives a couple's purchase of a Setnayan Productions Token-Worthy service AND the service is used at the event (handshake-confirmed).
- **Buy** *(canonical source: `Token_Economy_Flow_Map_2026-06-01.html`)*
  - **₱100 per token, flat** — one universal token. **No per-token volume discount.**
  - Pack sizes: 4 · 10 · 25 · 50 · 100. **Bulk orders earn bonus tokens on top** (buy a larger pack → extra tokens free, not a cheaper per-token price) — bonus ladder owner-to-set, never invented.
  - *₱100/token is the only rate (owner: "no more 250" + flat-price-with-bonus-tokens, 2026-06-04).*
- **Spend — region-weighted burn to answer a qualified lead**
  - Cost is keyed to the **wedding's region**, flat within a band, **never by booking size**, banded by the region's **minimum wage**: lowest-wage regions (Bicol · E.Visayas · Zamboanga · SOCCSKSARGEN · Caraga · BARMM) **1** · regional hubs (Cebu · Iloilo · Davao · CDO · CAR · Ilocos · Cagayan · MIMAROPA) **2** · NCR/CALABARZON/Central Luzon **3** tokens (= **₱100 / ₱200 / ₱300**, ₱300 ceiling). _Repriced 2026-06-05 — supersedes the 3‑4‑5‑6 ladder. Region→band stored admin-editable; re-band only when a wage order crosses a threshold._
  - One burn covers the entire conversation: chat, video call (Verified+), file sharing (Pro+), final quote, acceptance. No per-message or per-call charges.
  - Without tokens, vendors can still receive bid requests but cannot answer.
- **Handshake liability**
  - When a vendor earns a token via Productions referral, they're accountable for the service being used at the event. A two-party handshake at delivery confirms it. Failure to deliver claws the token back and may trigger a Trust & Safety case.

---

## 3 · Vendor tier matrix (4 tiers · the canonical feature gates)

| Capability | FREE | VERIFIED | PRO (₱2,499–₱3,999 / 28d · region) | ENTERPRISE (₱5,499–₱8,499 / 28d · region) |
|---|---|---|---|---|
| Profile + microsite | ✓ | ✓ | ✓ | ✓ |
| In-app chat (couple-initiated) | ✓ | ✓ | ✓ | ✓ |
| Pipeline · Bid → Chat → Quote → Accept | ✓ | ✓ | ✓ | ✓ |
| Create service packages | ✓ | ✓ | ✓ | ✓ |
| Photo portfolio | Up to 15 | Unlimited | Unlimited | Unlimited |
| Calendar with .ics export | ✓ | ✓ | ✓ | ✓ |
| **Bids per week** | **Up to 10** | **Unlimited** | **Unlimited** | **Unlimited** |
| Bidding token packs | Buy | Buy | Buy | Buy |
| Founder bonus 100 tokens (until 31 Jan 2027) | — | On verification | On verification | On verification |
| Ongoing token bonus qualification | — | ✓ | ✓ | ✓ |
| Earn tokens from Productions referrals | ✓ | ✓ | ✓ | ✓ |
| **Boost radius** | **10 km** | **20 km** | **50 km** | **100 km** |
| Sponsored Boost · top of category search | — | — | ✓ | ✓ |
| Boosted Ads (₱1,200/wk add-on) | — | — | ✓ | ✓ |
| Sharable bid link for social media | — | — | — | ✓ |
| Public vendor website | — | Standard | Custom | Custom |
| Custom slug · setnayan.com/v/yourname | — | — | ✓ | ✓ |
| Bid Button on your website | — | — | ✓ | ✓ |
| Video call with couples | — | ✓ | ✓ | ✓ |
| Show star ratings on profile | — | ✓ | ✓ | ✓ |
| Show full reviews on profile | — | — | ✓ | ✓ |
| Scheduling mode | Manual | Hybrid | Hybrid | Hybrid |
| Multiple events per day | — | — | ✓ | ✓ |
| Editorial Tagging · auto-featured in couples' editorials | — | — | ✓ | ✓ |
| On-Boarding Bundle Maker | — | — | ✓ | ✓ |
| File sharing with couples | — | — | ✓ | ✓ |
| Specialized Tools (category-specific toolkit) | — | — | ✓ | ✓ |
| AI Proposal Builder | — | — | ✓ | ✓ |
| Category benchmark analytics | — | — | ✓ | ✓ |
| Demand pulse · what couples are searching | — | — | ✓ | ✓ |
| Reverse-image portfolio theft monitoring | — | — | ✓ | ✓ |
| Crew-rate marketplace | — | — | ✓ | ✓ |
| Co-listing with Setnayan Productions | — | — | ✓ | ✓ |
| Categories vendor can list under | 1 | 1 | 1 | Multiple |
| Team accounts | 1 | 1 | Up to 5 | Unlimited |
| Setnayan Concierge matching | Free | Free | Priority | Priority |
| Priority support · sub-4h response | — | — | ✓ | ✓ |
| Quarterly business review | — | — | — | ✓ |

### Notes on the matrix

- **Verification is the gate.** Pro and Enterprise are only available to verified vendors. Verification = ₱1,499 one-time.
- **Hybrid scheduling explained:** vendor still plots manually, but pending bids show as a white-marker hold on the calendar; locked (accepted) bids auto-block the date.
- **Specialized Tools** = category-specific toolkits we build per vendor type. Stylists get an advanced mood-board maker. Wedding coordinators get an advanced scheduler. Photographers get a portfolio editor. Etc.
- **Editorial Tagging** = when a couple publishes their wedding editorial on Setnayan, the system auto-tags every Pro+ vendor that participated. The editorial then appears on those vendors' profiles as part of their "successful weddings" collection.

---

## 4 · Couple-facing feature inventory (the 18 things that are free)

Everything below is **free forever** for every couple. No subscription, no per-guest fee, no upgrade tier.

### Plan it (8)
1. Guest List Maker
2. Seat Plan
3. Budget Tracker
4. Scheduler
5. Checklist · "Never miss a thing"
6. Inspiration Board
7. Your personal monogram (basic version · Animated Monogram is paid)
8. Your own wedding website (basic version · Pro Website is paid)

### Find your vendors (7)
9. Recommended vendors for you (Setnayan Concierge matching)
10. Compare every quotation side-by-side
11. Bid to as many vendors as you want · unlimited
12. Chat directly with vendors
13. Video call directly with vendors (Verified+ vendors can accept)
14. Invite outside vendors (Tita's florist welcome · BYO vendor flow)
15. Pick what best suits you

### Trust comes free (3)
16. Verified Badge on every vendor
17. Real reviews from real Setnayan weddings
18. Get notified when another bidder enters your schedule (shortlist collision alert)

---

## 5 · Setnayan Productions catalog (22 services · à la carte to couples)

Two delivery models:

### 5.1 · Token-Worthy services (crew-delivered · vendor-recommendable)

| # | Service | Price | Notes |
|---|---|---|---|
| 1 | Animated Monogram | ₱2,499 | Bespoke monogram with animation |
| 2 | Pro Website | ₱5,499 | Premium Invitation + Event Page + Editorial |
| 3 | Panood | ₱3,499 / day | Live stream embedded on event page · 12am–12mn = 1 day · multi-day scales |
| 4 | Patiktok | ₱2,499 | Up to 250 vertical TikTok-format clips |
| 5 | Pakanta | ₱2,499 | Custom AI wedding song · royalty-free |
| 6 | Papic Guest (Disposable Camera) | ₱2,999 | 24 photos + 10 5-sec videos · 3mo high-res + Drive |
| 7 | Thank You Video (Papic Add-on) | ₱5,499 | 5-min thank you video |
| 8 | SDE (Papic Add-on) | ₱3,499 | 3-min same-day compilation |
| 9 | Papic (5 Seats) | ₱2,999 | Unlimited photos + videos for 5 hours |
| 10 | Live Venue Photo Wall | ₱2,499 | Live collage + live count |
| 11 | Live Background | ₱2,499 | LED wall design with monogram |
| 12 | Guided Pack (bundle) | ₱11,999 | Curated bundle · 3mo high-res + Drive |
| 13 | Media Pack (bundle) | ₱16,999 | Everything Setnayan ships |

### 5.2 · Direct services (Setnayan-delivered · automated · no vendor)

| # | Service | Price | Notes |
|---|---|---|---|
| 14 | Pakulay (Mood Board) | **FREE** | Included with every account · cultural conflict catcher |
| 15 | Custom QR per Guest | ₱1,499 | 1 QR per guest, up to 250 pax |
| 16 | Setnayan AI (Assisted Planning) | ₱1,499 | 65-step concierge planning process |
| 17 | Indoor Blueprint | ₱1,499 | Entrance → table guide |
| 18 | Call-Time Escalator | ₱1,999 | SMS update to all vendors |
| 19 | Pabati | ₱999 | Up to 300 5-sec videos |
| 20 | Guest Stories (Papic Add-on) | ₱1,999 | 30-sec story maker |
| 21 | Camera Bridge | ₱1,999 | Connect DSLR to Papic + Panood |
| 22 | High Res Archive | ₱2,999 / year | Annual archive · cancel anytime |

### 5.3 · Productions ↔ vendors

- Pro+ vendors can **resell** Productions services at their markup. Vendor pays Setnayan at wholesale, vendor bills couple at marked-up rate, vendor keeps the spread.
- Pro+ vendors **earn 1 token** every time a couple buys a Token-Worthy service via the vendor's recommendation link AND the service is used at the event (handshake-confirmed). This is the platform's organic distribution channel.
- Productions services are operated by Setnayan; vendors can apply to be on the e-prod roster (Panood broadcasters, Papic crew leads, AI Reel editors) and earn per-gig at platform rates.

---

## 6 · Bid pipeline (the core couple↔vendor flow)

Stages:
1. **Bid Request** — couple submits a brief through the marketplace or vendor microsite. Costs the couple nothing; couple can submit unlimited bid requests.
2. **Chat** — vendor spends tokens to answer the bid request and open the thread (pilot: 1 token · post-pilot: region-weighted 1–3 by the wedding's region = ₱100/₱200/₱300, min-wage banded). Chat is freeform; vendor and couple discuss, share files (Pro+), do video calls (Verified+), iterate on a quote.
3. **Quote** — vendor builds a custom quote inside the chat thread. Couple sees the quote.
4. **Accept** — couple accepts the quote. Booking is now locked in the couple's coordination dashboard (no money flows through Setnayan — vendor and couple settle directly).
5. **Completed** — after the event, the booking moves to Completed. Reviews open 24 hours after the event date. Only couples who actually went through the Setnayan bid flow can review.

### Backend rules
- A vendor must have enough tokens to answer a bid request (pilot: 1 · post-pilot: 1–3 by region = ₱100/₱200/₱300, min-wage banded). Without tokens, bid requests sit in the inbox unread by the vendor.
- A vendor cannot start a chat thread with a couple cold. Threads are always couple-initiated via a bid request.
- A couple's contact details (phone, email) are NOT automatically exposed to the vendor. Communication happens inside Setnayan's chat. Vendors can optionally list a "Direct Line" phone on their profile so couples can call them — that's the vendor's choice, never the couple's.

---

## 7 · Critical business rules (enforce in backend)

### 7.1 · Verification (founder policy)
- Every vendor we list, we vouch for. **No auto-approve, ever.**
- Three documents: DTI Business Name Registration, BIR Certificate of Registration, Mayor's Permit.
- Pipeline: vendor uploads → Claude Haiku 4.5 extracts fields per doc → Claude cross-checks the three docs → admin reviews summary + does gov-DB cross-check (DTI BNRS, BIR, Mayor's permit) → human approves.
- Target SLA: 24 hours (current avg 18h).
- Cost: ~₱1.50/vendor in Claude API calls. 40× cheaper than a verification specialist.

### 7.2 · Vendor exclusive perk (required)
- Every vendor must declare one Setnayan-customer-only perk on their profile.
- The perk is surfaced in marketplace cards, the couple's shortlist, and the vendor microsite.
- If a couple reports the perk doesn't apply, Trust & Safety investigates.

### 7.3 · Capacity cap
- Free + Verified vendors capped at 1 event per day.
- Pro + Enterprise can take multiple (set 1, 2, 3, or unlimited).
- Past the daily cap, the date greys out for couples in the vendor's availability calendar.

### 7.4 · Pricing cap (NEW · weak — needs founder confirmation)
- Couples can report price violations (vendor charges more outside Setnayan than the Setnayan listed price).
- Reports route to Trust & Safety. Policy ladder for first offense vs. repeat is TBD — see Open Questions §13.

### 7.5 · Watchlist
- Banned vendors trying to re-apply under a new name get flagged via cross-document analysis (TIN matching, owner name matching, address proximity).
- Watchlist hits go to the admin verification queue with a "watchlist flag" badge.

### 7.6 · Reverse-image theft monitoring (Pro+)
- Monthly reverse-image scans of Pro+ vendors' portfolios across the open web.
- Hits surface evidence to the vendor (URL, screenshot, date detected). Vendor decides whether to act.

### 7.7 · Setnayan content team attendance (opt-in)
- For weddings on Setnayan, 1–3 Setnayan personnel may attend for content + documentation (photos, videos, case-study material).
- Disclosed at booking confirmation to both the couple and every vendor.
- Couple can opt out; default ON during pilot, OFF post-launch (founder to confirm — see §13).

---

## 8 · Design system + brand

> **AMENDED 2026-05-29 · Clean Editorial palette supersedes the burnt sienna palette below.** Per CLAUDE.md 2026-05-29 row "🎨 CLEAN EDITORIAL PALETTE LOCK" the brand palette flips from Filipino-warm burnt sienna register to Premium Event SaaS editorial register. The original palette text below is preserved as historical reference; the **canonical palette** is now:
>
> | Role | Hex | Token | Notes |
> |---|---|---|---|
> | Background (60%) | `#FBFBFA` | `--m-paper` | Warm Alabaster |
> | Text + Structure (30%) | `#1E2229` | `--m-ink` | Deep Obsidian · WCAG AAA on alabaster (16.42:1) |
> | Primary Accent (10%) | `#C5A059` | `--m-orange` (token name retained for codebase compat) | Royal Champagne Gold · active nav · borders · accents · highlights |
> | CTA Buttons | `#5C2542` | `--m-mulberry` (NEW family) | Rich Mulberry · primary interactive buttons · WCAG AAA on alabaster (12.84:1) · hover `--m-mulberry-2 #4A1D36` |
>
> Supporting palette colors (Blush · Sage) retained pending owner future call. Burnt sienna deeper sienna + light wash + ivory callouts retired. Mandatory consumer surfaces (homepage · /pricing · /for-vendors · /signup · /login · dashboards · marketplace · microsites · email templates · og-card) all consume `--m-*` token values via CSS variables and auto-propagate when `globals.css` token values change. See decision-log row + project_setnayan_palette memory rule for canonical lock.

### Historical reference (retired 2026-05-29 · superseded by Clean Editorial palette above)

- ~~**Primary palette:** Burnt sienna `#C96B3A` + deeper sienna `#A84F25` + light wash `#F8E6DC` + slate `#545860` + ink `#2D3038` + cream paper `#FBF8F2` + ivory callouts `#EDE5D2`~~
- ~~**Supporting:** Blush `#F4D7C9`, deep blush `#B65A3A`, sage `#C5D2BD`, deep sage `#4F6B4A`~~
- **Typography:**
  - Display: **Saira Condensed** 700/800 (uppercase, tight tracking, decisive)
  - Serif: **Instrument Serif** italic (emotion, headlines, quiet moments)
  - Sans: **Geist** 300–700 (body)
  - Mono: **JetBrains Mono** (labels, eyebrows, data)
- **Voice:** editorial wedding photography aesthetic — quiet, not shouty. Confident, intimate, sometimes Filipino-specific ("Set na 'yan" · "Tita's florist" · "Pakulay"). No exclamation points. No marketing speak.
- **Token tokens:** All design tokens live in `styles.css` as CSS variables (`--paper`, `--ink`, `--orange`, etc.). The whole design system is variable-driven.
- **Hero copy (load-bearing — keep verbatim):**
  - "Set na 'yan. / Plan your wedding the easy way."
  - "We never charge you if we cannot bring you customers."
  - "Every peso is yours."
  - "Almost everything you need to plan a wedding, we give away."

See `components/brand-system.jsx` for the in-canvas brand reference + `styles.css` for the full token set.

---

## 9 · What's been designed (the design canvas inventory)

Everything below lives in this project as HTML preview files + JSX components. Open `Setnayan Redesign.html` to see them all in one canvas.

### 9.1 · Public marketing
| Page | Live HTML | Source |
|---|---|---|
| `/` Homepage (canonical) | `Setnayan Site (Jobs+Ive).html` | `components/homepage-jobsive.jsx` |
| `/for-vendors` | `Setnayan For Vendors.html` | `components/homepage-extras.jsx` |
| `/keynote` Customer keynote | `Customer (Ternus).html` | `components/keynote-ternus.jsx` |
| `/keynote/vendors` Vendor keynote | `Vendor (Ternus).html` | `components/keynote-vendors.jsx` |
| `/keynote` (alt · Apple-style) | `Setnayan Keynote.html` | `components/keynote.jsx` |

### 9.2 · Auth
| Page | Source |
|---|---|
| `/login` + `/signup` (8 surfaces: light/dark × desktop/mobile × login/signup) | `components/login-signup.jsx` |

### 9.3 · Couple-facing app
| Page | Source |
|---|---|
| `/dashboard` (desktop) | `components/couple-dashboard.jsx` + `couple-dashboard-tabs.jsx` |
| `/dashboard` (mobile) | `components/couple-mobile.jsx` |
| `/e/[slug]` Guest microsite | `components/guest-microsite.jsx` |
| `/vendors` Marketplace search | `components/marketplace.jsx` (NEW) |
| `/productions` Productions catalog | `components/productions-catalog.jsx` (NEW) |

### 9.4 · Vendor-facing app
| Page | Source |
|---|---|
| `/vendor-dashboard` (desktop) — Pipeline / Inbox / Calendar / Tokens / Profile / Bundle Maker | `components/vendor-dashboard.jsx` |
| `/vendor-dashboard` (mobile) | `components/role-mobile.jsx` (`VendorMobile`) |
| `/vendors/apply` Vendor application + verification | `components/vendor-application.jsx` (NEW) |
| `/vendors/[slug]` Vendor microsite | `components/vendor-microsite.jsx` |

### 9.5 · Admin
| Page | Source |
|---|---|
| `/admin` (desktop) — Verification queue, Trust & Safety, Event Types, Finance | `components/admin-dashboard.jsx` |
| `/admin` (mobile) | `components/role-mobile.jsx` (`AdminMobile`) |

### 9.6 · Reference / internal (do not ship publicly)
| Surface | Source |
|---|---|
| Brand system reference | `components/brand-system.jsx` |
| System map | `components/system-map.jsx` |
| Hero direction variations (pick one) | `components/hero-variations.jsx` |
| iOS handoff pattern | `components/ios-handoff.jsx` |

---

## 10 · What needs to be built (production phases)

Cherry-pick the JSX components above. They are React with inline styles + a few utility CSS classes. You'll rewrite as Next.js pages + Tailwind/CSS modules. The structure transfers cleanly; the styles are token-driven.

### Phase 0 · Project setup (1 day)
- `npx create-next-app@latest setnayan --typescript --tailwind --app --src-dir`
- Initialize Prisma + PostgreSQL.
- Set up env: `DATABASE_URL`, `RESEND_API_KEY`, `TWILIO_*`, `XENDIT_*` (Productions payments only), `ANTHROPIC_API_KEY`, `R2_*`.
- Drop the CSS-variable block from `styles.css` into `globals.css`. Don't import the rest — rewrite component styles as Tailwind during port.
- Copy `/brand` to `public/brand` so logo + Productions imagery resolves.

### Phase 1 · Routes scaffold (1 day)
Lay out empty pages so the URL map exists before component porting:

```
src/app/
├── (marketing)/
│   ├── page.tsx                     ← / (homepage · Jobs+Ive)
│   ├── for-vendors/page.tsx
│   ├── productions/page.tsx          ← NEW
│   ├── pricing/page.tsx              ← NEW (TBD design)
│   └── about/page.tsx                ← NEW (TBD design)
├── keynote/
│   ├── page.tsx                      ← /keynote (customer keynote)
│   └── vendors/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/                        ← couple dashboard (signed-in)
├── vendor-dashboard/                 ← vendor dashboard (signed-in)
├── vendors/
│   ├── page.tsx                      ← /vendors (marketplace)
│   ├── apply/page.tsx                ← NEW (verification flow)
│   └── [slug]/page.tsx               ← per-vendor microsite
├── admin/                            ← admin (signed-in)
├── e/[slug]/page.tsx                 ← guest microsite
└── api/
    ├── bids/...
    ├── tokens/...
    ├── productions/...
    ├── verify-vendor-docs/...        ← Claude AI pipeline
    └── webhooks/xendit/...           ← Productions payments only
```

### Phase 2 · Port the marketing site (2–3 days)
- Start with `/` (Jobs+Ive homepage).
- Then `/for-vendors`, `/productions`, `/keynote`, `/keynote/vendors`.
- All static content; no backend needed.

### Phase 3 · Auth + roles (2 days)
- Pick NextAuth.js or Clerk.
- Email + password + magic link (the demographic isn't tech-savvy).
- Role assignment at signup — couple / vendor / admin.
- Session middleware gating `/dashboard`, `/vendor-dashboard`, `/admin`.

### Phase 4 · Couple dashboard (3–4 days)
Port `components/couple-dashboard.jsx` + `couple-dashboard-tabs.jsx`. Per-tab work:

| Tab | Replace mock with |
|---|---|
| Overview | `/api/events/[id]/focus` + batch `PATCH /guests` |
| Guests | `PATCH /guests/[id]` (RSVP cycle yes→pending→no) |
| Vendors | `/api/bookings` + `/api/threads/[id]/messages` |
| Shortlist | `/api/users/[id]/favorites` + per-event shortlist |
| Schedule | `/api/timeline-items` |
| Invitations | bulk QR generation + email send |
| Mood board | `/api/moodboards` (Pakulay) |
| Productions | `/api/productions/cart` + Xendit checkout |
| Budget | `/api/budget-lines` |

### Phase 5 · Vendor + Admin dashboards (3–4 days)
Same pattern. The Vendor dashboard's Tokens tab is the most new code (token ledger, pack purchase via Xendit, founder bonus claim, referral tracking).

### Phase 6 · Marketplace + search (3 days)
- `/vendors` — port `components/marketplace.jsx`. Implement search backend (192-category taxonomy, location-aware, tier-aware sort, sponsored boost slots).
- `/vendors/[slug]` — port `components/vendor-microsite.jsx`. **Bottom CTA is a Bid Request form**, not a chat box. Submit creates a `BidRequest` record.

### Phase 7 · Vendor verification + token pipeline (3 days)
- `/vendors/apply` — port `components/vendor-application.jsx`. Multi-step form ending in ₱1,499 QR payment.
- Document upload → `/api/verify-vendor-docs/extract` → Claude Haiku 4.5 vision → store extracted JSON.
- All-docs-uploaded trigger → cross-check Claude call → `Vendor.aiVerificationSummary`.
- Admin verification queue UI already exists in `admin-dashboard.jsx`.
- Token ledger: every grant + spend logged in `TokenLedger`. Founder bonus only granted if `verifiedAt < 2027-01-31`.

### Phase 8 · Bid flow (4 days)
- Bid Request submission (couple side) → costs nothing, no token check.
- Vendor accepts → token deduction transaction (atomic: check balance >= answer cost [pilot 1 · post-pilot 3–6 by region], decrement, create Thread, return).
- Thread API: messages, file attachments (Pro+ only), video call signaling (Verified+ only via Daily.co / Twilio Video).
- Quote builder inside thread → couple accepts → Booking created (status: "accepted", paidVia: null since Setnayan doesn't process the money).

### Phase 9 · Setnayan Productions payments (2 days · Productions ONLY)
- Productions is the ONLY place Setnayan touches money. Couples buy Productions services directly from Setnayan.
- Cart + checkout via Xendit (GCash QR, Maya QR, InstaPay, cards).
- Generate simple receipts (not BIR-stamped for vendor bookings — but for Productions services Setnayan IS the merchant, so receipts can be BIR-issued via partner like IceTax · vendor selection TBD).

### Phase 10 · Guest microsite (2 days)
- `/e/[slug]` — port `components/guest-microsite.jsx`. Phase-aware: server computes `Date.now()` vs `event.date` and switches between Save-the-Date → Invitation → Logistics → Day-of → After templates.
- Camera access (Papic) gated by `Date.now() > event.startTime - 1h`.

### Phase 11 · Native shells (Expo · 5–7 days)
- `npx create-expo-app setnayan-mobile -t expo-template-blank-typescript`
- Most product UIs work as web views inside an Expo shell.
- Productions purchases open native QR / Xendit. Exempt from Apple IAP under Guideline 3.1.5(a) (real-world services).
- Push via Expo Notifications.

---

## 11 · Tech stack (recommended)

- **Framework:** Next.js 14+ (App Router) · TypeScript
- **Styling:** Tailwind v3+ on top of CSS variables from `styles.css`
- **DB + ORM:** PostgreSQL + Prisma
- **Auth:** NextAuth.js or Clerk
- **Email:** Resend
- **SMS:** Twilio
- **Payments (Productions only):** Xendit (GCash + Maya + InstaPay + cards)
- **File storage:** Cloudflare R2 (vendor portfolios, Papic uploads, contract PDFs)
- **AI:** Anthropic SDK · Claude Haiku 4.5 (verification, proposal drafting, mood-board sanity check)
- **Video calls:** Daily.co or Twilio Video (Verified+ vendors)
- **BIR partner for Productions receipts:** IceTax / Globe myBusiness / similar (vendor selection TBD)
- **Native shells:** Expo (React Native)

---

## 12 · Data models (TypeScript-ready · drop into `types/`)

```ts
// ─── Event ─────────────────────────────────────────────────────────────
type EventStatus = "dreaming" | "booking" | "inviting" | "finalizing" | "day" | "after";

interface Event {
  id: string;
  slug: string;                          // /e/<slug>
  type: "wedding" | "debut" | "birthday" | "baptism" | "corporate" | "anniversary";
  date: string;                          // ISO
  venue: string;
  location: string;
  status: EventStatus;
  ownerId: string;
  cohostIds: string[];                   // V1.2 — empty array for now
  headcount: number;
  confirmedHeadcount: number;
  budget: number;
  spent: number;
  contentTeamOptIn: boolean;
  shortlistVendorIds: string[];
}

// ─── Guest ─────────────────────────────────────────────────────────────
type RsvpStatus = "yes" | "pending" | "no";

interface Guest {
  id: string;
  eventId: string;
  name: string;
  group: string;
  qrSlug: string;                        // unique per guest
  rsvp: RsvpStatus;
  plusOne: boolean;
  plusOneName: string | null;
  table: number | null;
  diet: string;
  songRequest: string | null;
  invitationSentAt: string | null;
  rsvpAt: string | null;
}

// ─── Vendor ────────────────────────────────────────────────────────────
type VendorStatus = "active" | "pending" | "banned";
type VendorTier = "free" | "verified" | "pro" | "enterprise";

interface Vendor {
  id: string;
  slug: string;                          // /vendors/<slug>
  name: string;
  category: string;
  taxonomyId: string;                    // FK to one of 192 categories
  location: string;
  status: VendorStatus;
  verifiedAt: string | null;             // null = not yet verified
  isFirstParty: boolean;                 // true for "Setnayan Productions"
  tier: VendorTier;
  proSubscriptionActiveUntil: string | null;
  enterpriseSubscriptionActiveUntil: string | null;
  founderRate: false;                    // retired in v2.1 — always false
  exclusivePerk: string;                 // required field
  dailyCapacity: number | null;          // 1 | 2 | 3 | null (unlimited)
  capacityOverrides: Record<string, number>;
  verificationDocs: VerificationDoc[];
  aiVerificationSummary: string | null;
  aiConfidence: number | null;
}

interface VerificationDoc {
  id: string;
  vendorId: string;
  type: "dti" | "bir" | "mayors_permit" | "portfolio" | "sample_work";
  url: string;
  extractedFields: Record<string, string>;
  status: "uploaded" | "extracted" | "verified" | "rejected";
}

// ─── BidRequest / Thread / Quote / Booking ─────────────────────────────
type BidStatus = "submitted" | "accepted" | "declined" | "expired";
type BookingStatus = "accepted" | "completed" | "cancelled";

interface BidRequest {
  id: string;
  eventId: string;
  vendorId: string;
  requestedBy: string;                   // couple userId
  fields: {
    weddingDate: string;
    headcount: number;
    dietaryTags: string[];
    style: string[];
    budget: number;
    notes: string;
  };
  status: BidStatus;
  createdAt: string;
  acceptedAt: string | null;             // null until vendor spends a token
  tokenLedgerEntryId: string | null;     // FK to TokenLedger entry that paid for acceptance
}

interface Thread {
  id: string;
  bidRequestId: string;                  // 1:1 with BidRequest after acceptance
  eventId: string;
  vendorId: string;
  coupleUserId: string;
  messages: Message[];
}

interface Message {
  id: string;
  threadId: string;
  from: "couple" | "vendor";
  text: string;
  attachments: Attachment[];             // Pro+ vendor only for sending
  sentAt: string;
}

interface Quote {
  id: string;
  threadId: string;
  vendorId: string;
  amount: number;                        // PHP integer
  lineItems: Array<{ label: string; amount: number }>;
  status: "draft" | "sent" | "accepted" | "declined";
  sentAt: string | null;
  respondedAt: string | null;
}

interface Booking {
  id: string;
  eventId: string;
  vendorId: string;
  quoteId: string;                       // FK to the accepted Quote
  status: BookingStatus;
  amount: number;                        // from Quote · for coordination tracking only
  // No paidVia, no milestones, no BIR fields — Setnayan does not process this
  createdAt: string;
  completedAt: string | null;
  contentTeamDisclosed: boolean;
}

// ─── Token economy ────────────────────────────────────────────────────
type TokenLedgerKind =
  | "founder_bonus_grant"
  | "pack_purchase"
  | "bid_acceptance_spend"
  | "productions_referral_earn"
  | "productions_referral_clawback"
  | "admin_grant"
  | "admin_revoke";

interface TokenWallet {
  vendorId: string;
  balance: number;
  founderBonusClaimed: boolean;
  founderBonusClaimedAt: string | null;
}

interface TokenLedger {
  id: string;
  vendorId: string;
  delta: number;                         // positive = earned/bought, negative = spent
  kind: TokenLedgerKind;
  refId: string | null;                  // FK to BidRequest, Pack purchase, Productions order
  note: string;
  at: string;
  balanceAfter: number;
}

interface ProductionsReferral {
  id: string;
  vendorId: string;                      // the vendor who recommended
  productionsOrderId: string;
  serviceId: string;                     // which Productions service (Token-Worthy only)
  handshakeAt: string | null;            // null until event-day handshake confirms delivery
  tokenLedgerEntryId: string | null;     // set when the +1 token is granted post-handshake
}

// ─── Productions ──────────────────────────────────────────────────────
type ProductionsServiceId =
  | "animated_monogram" | "pro_website" | "panood" | "patiktok" | "pakanta"
  | "papic_guest" | "thank_you_video" | "sde" | "papic_5_seats"
  | "live_venue_photo_wall" | "live_background" | "guided_pack" | "media_pack"
  | "pakulay" | "custom_qr_per_guest" | "todays_focus" | "indoor_blueprint"
  | "call_time_escalator" | "pabati" | "guest_stories" | "camera_bridge"
  | "high_res_archive";

interface ProductionsService {
  id: ProductionsServiceId;
  name: string;
  price: number;                         // PHP, 0 for FREE (Pakulay)
  priceUnit: "flat" | "per_day" | "per_year";
  tokenWorthy: boolean;                  // can vendors earn referral tokens for this?
  deliveryModel: "direct" | "crew";
  description: string;
}

interface ProductionsOrder {
  id: string;
  eventId: string;
  buyerUserId: string;                   // couple userId
  items: Array<{ serviceId: ProductionsServiceId; price: number; days?: number }>;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  xenditInvoiceId: string | null;
  birReceiptId: string | null;           // Setnayan IS the merchant for these
  vendorReferralId: string | null;       // FK to ProductionsReferral if vendor-driven
  createdAt: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────
interface Review {
  id: string;
  vendorId: string;
  bookingId: string;                     // only bookings can produce reviews
  couple: string;                        // display name
  rating: number;                        // 1-5
  text: string;
  createdAt: string;                     // must be >= booking.completedAt + 24h
  visibilityTier: "verified_only" | "pro_full";  // stars only on Verified, full text on Pro+
}

// ─── Trust & Safety ───────────────────────────────────────────────────
type TSCaseKind = "Identity" | "Pricing" | "Watchlist" | "Theft" | "Other";
type TSCaseSeverity = "low" | "med" | "high" | "critical";

interface TSCase {
  id: string;
  kind: TSCaseKind;
  parties: string[];
  detail: string;
  severity: TSCaseSeverity;
  openedAt: string;
  resolvedAt: string | null;
  assignedAdminId: string | null;
}

// ─── User ──────────────────────────────────────────────────────────────
type UserRole = "couple" | "vendor" | "admin";

interface User {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  favoriteVendorIds: string[];           // account-level, persists across events
  events?: string[];                     // for couples — usually 1, multi later
}
```

---

## 13 · Open questions for the founders

These weren't fully resolved during design. Lock them before launch:

1. **Pricing violation policy** — what's the response ladder when a couple reports a vendor's listed Setnayan price doesn't match what they quote outside? First-offense warning + 30-day cure, or immediate ban?
2. **Content team attendance default** — opt-in default ON during pilot, OFF post-launch? Or opt-in either way?
3. **Pro/Enterprise token allowance** — do these subscriptions include any tokens (e.g., 50/mo refill), or do Pro/Enterprise vendors still buy token packs separately at the same rate as Free/Verified?
4. **On-site verification + content package** — what's the starting price floor or is it always custom quote per visit?
5. **BIR partner for Productions services** — IceTax / Globe myBusiness / DIY? Need a decision before any couple buys Pakanta/Panood/etc.
6. **192-category taxonomy** — get the canonical CSV from the founders. Without it, the marketplace search is built on guesses.
7. **Multi-host events (V1.2)** — target ship date? Pilot ships single-owner only.
8. **iOS / Android timeline** — web-first locked. Native shell ships pre-pilot (Dec 2026) or post-pilot (Q1 2027)?
9. **NPC registration** — confirm PIC-2026-0042 is live before launch.

---

## 14 · The deeper docs

After this brief, dig into these for more depth:

| Path | What it has |
|---|---|
| [`/HANDOFF.md`](./HANDOFF.md) | Original v1 + v2 engineering handoff. Some sections superseded by THIS doc (commission, BIR, force-majeure) — but data models, microsite specs, and admin pipeline notes are still good. |
| [`/docs/PROJECT-MAP.md`](./docs/PROJECT-MAP.md) | Per-file inventory of every component + asset |
| [`/docs/COMPONENT-INVENTORY.md`](./docs/COMPONENT-INVENTORY.md) | Per-file breakdown of every JSX module |
| [`/docs/DATA-MODELS.md`](./docs/DATA-MODELS.md) | Earlier TS interfaces (this brief's §12 supersedes some) |
| [`/docs/CLAUDE-CODE-PLAYBOOK.md`](./docs/CLAUDE-CODE-PLAYBOOK.md) | Phased migration playbook |
| [`/docs/OPEN-QUESTIONS.md`](./docs/OPEN-QUESTIONS.md) | Earlier open questions (some now resolved · see §13 above for current) |
| [`/IMAGE-PROMPTS.md`](./IMAGE-PROMPTS.md) | 10 Recraft.ai prompts for the brand imagery |

When in doubt, **this brief is canon** for v2.1 decisions. The older docs in `/docs/` retain useful structural detail (component inventory, migration phases) but their pricing/commission references are stale.

---

## 15 · A note from the founders

This is being built so Claire and Ice can ship their own wedding through it on **December 18, 2026**. Every decision — the 0% commission, the 100 free founder tokens, the price-protection commitment, the "we never charge if we can't bring you customers" framing — is rooted in that.

Build it like it's going to be the first wedding on it. Because it is.

---

## 16 · Amendments

Lock-in-order list of refinements to this brief. Each amendment cites a CLAUDE.md decision-log row at corpus root that carries the canonical WHY. The brief body above stays authoritative on everything NOT in this list; everything in this list supersedes the brief body for the cited section.

### Amendment 1 (2026-05-28) · Annual vendor subscriptions

Per CLAUDE.md eleventh 2026-05-28 row "v2.1 amendment · Vendor verification fees RETIRED + Pro Vendor annual ₱19,999/yr + Enterprise Vendor annual ₱54,999/yr added". Supersedes § 2.2 + § 3 monthly-only Pro/Enterprise. Vendor verification annual renewal ₱1,499/yr + re-verification after demotion ₱2,499 both RETIRED (lifetime badge model).

### Amendment 2 (2026-05-30) · Vendor matrix from screenshot

Per CLAUDE.md 2026-05-30 row "🔒 V2.1 BRIEF AMENDMENT #2 LOCKED · vendor matrix from owner screenshot adopted as canonical". Supersedes § 3 vendor matrix and the eleventh 2026-05-28 amendment's Pro Annual price. Key shifts: Pro 28-day prepaid ₱2,499 (not ₱1,999/mo) · Pro Annual ₱24,999/yr (~23% off, not ~17%) · Boosters surface reinstated · Add Branch ₱999/28-day SKU reinstated · hybrid-anonymity reveal mechanic (Free + Verified vendor business name HIDDEN until vendor sends first chat reply · then revealed globally · Pro + Enterprise show real name from day 1).

### Amendment 2 refinement (2026-05-30) · Venue exception + Bark screen names

Per CLAUDE.md 2026-05-30 row "V2.1 BRIEF AMENDMENT #2 REFINEMENT · venue exception locked + engineering kickoff for the screen-name reveal mechanic from line 544 row". Extends Amendment 2:

- **Venue exception** — vendors whose `vendor_profiles.services` array overlaps with `ARRAY['religious_venue', 'venue']` ALWAYS show real `business_name` regardless of tier or reveal-timestamp. Ceremony + reception venues are physical places with addresses, GMB listings, and SEO discoverability; anonymizing them breaks search + makes admin-seeded famous venues (Conrad · Shangri-La · Cebu Marriott · etc.) pointless.

- **Bark-format screen names** — Free + Verified non-venue vendors get auto-generated `vendor_profiles.screen_name` like `"Manila Wedding Photographer #4218"` on signup. Format: `{City} {Canonical Service Display Label} #{ID}` with monotonic ID per `(city, canonical_service)` namespace via `vendor_screen_name_sequences` table. Persists forever — never regenerated even if vendor changes services or location_city.

- **Pro + Enterprise = real name from day 1** — paid tier visibility privilege. Tracked via new `vendor_tier_state` ENUM (`free`/`verified`/`pro`/`enterprise`) on `vendor_profiles.tier_state`. Backfilled from `verification_state='verified'` for existing rows; Pro + Enterprise stay admin-flippable for pilot.

- **Platform-wide unlock on first vendor reply** — `vendor_profiles.name_revealed_at` (PR #662) or `real_name_unlocked_at` (PR #673 · duplicate column, V1.x cleanup) stamps `NOW()` on first vendor `chat_messages` INSERT with `sender_role='vendor'`. Once stamped, real `business_name` shows everywhere globally · NOT per-customer · NOT per-thread.

- **Helper** `resolveVendorDisplayName()` in `apps/web/lib/vendors.ts` returns real `business_name` when: services contain venue-exempt key · OR `isPaidTier === true` · OR `name_revealed_at !== null`. Otherwise returns stored `screen_name` if present, else legacy computed `"{service} · {city}"` placeholder.

**Schema** ships via migration `20260714000000_v2_screen_name_reveal_mechanic.sql` (PR #673). Helper extension ships via PR #677. Both merged 2026-05-30 pre-pilot.

**What's NOT in this amendment** — admin surfaces continue showing real `business_name` (moderation/payouts/disputes need it). Plan grid + messaging UI continue using direct `business_name` reads in V1 (vendors shown there are already in chat with the couple → name globally revealed by trigger anyway). Cleanup of duplicate `real_name_unlocked_at` column from PR #673 → deferred V1.x post-pilot.


---

## Amendment 3 — Verified-only marketplace · Free tier retired (owner 2026-06-01)

Amends **§3 (vendor tier matrix)**. Canonical lock: CLAUDE.md decision-log row 2026-06-01 "🔒 Verified-only marketplace — vendor tier REMODELLED."

**The rule.** A vendor must pass Setnayan's verification **before any of its services appear on the marketplace.** Before that, the vendor has a full dashboard but **zero marketplace presence** (not in browse/search, no public `/v/[slug]`, no couple inquiries).

**Tier model — a lifecycle *state* + 3 marketplace tiers (the §3 4-tier matrix's "Free" column is RETIRED):**
- **Registered (unverified)** — *state*, not a tier · dashboard-only · ₱0 · zero marketplace presence.
- **Verified** — free marketplace floor · ₱0 (+ verification; fee ₱0-vs-₱1,499 still the open item) · the old "Verified" feature set · name hidden-until-first-reply (the hybrid-anonymity now applies *here*, Free being gone).
- **Pro** — ₱2,499 / 28 days · real name shown · offered post-verification.
- **Enterprise** — ₱5,499 / 28 days · offered post-verification.

The old "Free" tier's two roles split: dashboard-only-minimal → the **Registered state**; free-floor-on-marketplace → **Verified**.

**Knock-on:** `vendors.public_visibility` default `coming_soon` → **`unverified`** (the 2026-05-15 "coming_soon muted card" behavior retired) · the couple onboarding "all-vs-verified" screen + `events.vendor_pool_preference` retired · DIY "Verified only" browse toggle moot · hybrid-anonymity simplifies to "Verified hidden-until-reply / Pro+ shown / venue exception holds."

Full remodelled matrix: [Vendor_Match_Personalization_2026-06-01.md](03_Strategy/Vendor_Match_Personalization_2026-06-01.md) §5.1.
