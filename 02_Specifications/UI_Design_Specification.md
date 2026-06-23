# Setnayan — UI Design Specification

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Material deltas (this brief is from 2026-05-18 and has drifted on money, themes, and SKUs):
> - **Commission / "Setnayan Pay 5.0%" is RETIRED.** §3.5, §6.12, §11 (the whole "5.0% rule" + worked-example tile) no longer reflect reality. Live commission is **0% — "0% commission, ever."** Vendor↔customer money is **OFF-PLATFORM** (RA 11967); Setnayan never holds or charges it. In-app SKU payment is **apply-then-pay with manual admin approval** (no automated charge anywhere in V1). Do NOT design a +5% checkout breakdown or worked-example tile.
> - **"No wallet / no tokens, ever" is only half-true now.** The customer token wallet (0003) IS retired, so the couple-side no-wallet rule holds. But a **vendor-side token economy is LIVE** (burn-on-answer 1–3 tokens ₱100/200/300 banded by wedding region; 100 founder tokens on verification; packs). Vendor surfaces (`/vendor-dashboard/tokens`) DO show a token balance.
> - **Themes:** the "5 locked themes" (§4.2) and "theme picker in Appearance" (§6.15) never shipped that way and are retired — the app is **light-locked** (single Clean-Editorial light palette; picker removed). Remove the 5-theme requirement from the designer checklist (§13).
> - **Planner SKU:** any "Setnayan Concierge" / 9-step Guided Planner card (§6.2, §6.3, §8.11) is superseded by **"Setnayan AI" ₱1,499** (and the couple-app planner *wizard* is retired in code; only the SKU/branding persists). Drop the Concierge funnel.
> - **BIR:** the "BIR Official Receipts as a first-class screen" thread (§3.6, §5, §6.13, §10.6, §11) is **retiring** (0026 retired 2026-06-07; admin `bir/2307` tombstoned). Do not design OR/VAT/EWT receipt screens as a launch requirement.
> - **Admin console** is ~53 routes (6-group desktop sidebar + mobile bottom-nav), not "12 surfaces" (§8). **Vendor dashboard** host is `/vendor-dashboard` (~24 routes, 4-group sidebar), not `/dashboard/vendor`. Charm-pricing "-1 endings" (§4.5, §10.8) is loosely followed at best — live SKUs use ₱2,499/₱1,499/₱2,999 etc. (not -1).
> - Still broadly accurate: the responsive bottom-nav↔top-tabs pattern, empty/loading/error states, vendor logo-masking in chat, customer-initiates-chat invariant, public-ID `S89X-` mono rendering, Lucide-only iconography, monogram-as-identity.
>
> When this body disagrees with the above, **the above wins.**

**Purpose:** Hand this to a UI / visual designer. It tells them what every surface of Setnayan V1 is, who uses it, what it must contain, and how it must behave on mobile vs desktop. Anchored against the live product (https://www.setnayan.com), the locked spec corpus (`/Users/icecasasola/Documents/Claude/Projects/Setnayan/`), and the shipped code (`origin/main` of `iscasasola/setnayan-platform`). All pricing is PHP centavos. V1 scope = Wedding only.

**Status:** Generated 2026-05-18. Mirrors locked specs as of 2026-05-17. Re-read `App_Build_Status.md`, `V1_Gap_Analysis_Status.md`, and the matching iteration folder before designing any specific screen — those win on conflict.

---

## 1. What Setnayan is

Setnayan is a Filipino-built, web-first wedding planning + vendor marketplace. **One product, two operating surfaces.**

- **Couples** plan an event end-to-end inside Setnayan: guest list, RSVP, seating, budget, vendor selection, schedule, invitation pages, mood board, day-of broadcast, post-event highlight reels.
- **Vendors** use it as a working CRM + lead inbox + pipeline + payouts ledger — not a directory listing.

It is BIR-compliant (issues Official Receipts with VAT split), RA 10173-compliant (Philippine Privacy Act), bilingual (EN + Tagalog at V1; Cebuano deferred V1.1), and tuned for the Philippine market (PHP centavos, charm pricing, GCash/BDO payment rails, City-level coverage from Metro Manila to Davao).

Setnayan is **NOT** a wallet/credits product — payment is order-and-pay only. **NEVER design a wallet pill, balance, token counter, or credits surface.**

| Anchor | Value |
|---|---|
| **Tagline** | *"Set na 'yan." — Everything's set.* |
| **Domain** | setnayan.com (live) · setnayan.ph (queued) |
| **Lead headline** | *"Planning an event? Looking for vendors? Or a vendor looking for customers?"* |
| **Position line** | *"Built for both sides of the celebration."* |
| **Compliance line** | *"Built in the Philippines · BIR-compliant receipts · EN / Tagalog"* |
| **Geographic reach** | Metro Manila · Cebu City · Davao · Iloilo · Cagayan de Oro · Baguio (city-level only) |
| **Event types in V1** | Wedding only (8 others on roadmap with notify-me capture) |

---

## 2. Audiences (who the UI must serve)

| Role | Primary jobs | Account model |
|---|---|---|
| **Couple / planner** | Plans event · invites guests · books vendors · pays orders · runs day-of | Authenticated user owning ≥1 `events` row |
| **Vendor** | Lists services · takes bookings · chats with couples · manages team · receives payouts | Authenticated user with a `vendor_profile` row |
| **Vendor team member** | Acts on behalf of vendor (4 tiers: Owner / Admin / Agent / Viewer) | `vendor_team_members` row; per-agent service scoping |
| **Guest** | Receives QR invite · RSVPs · sees day-of media · uploads photos | Cookie-based session at `/[slug]` — **no account required** |
| **Admin** | Owner + spouse · runs the platform · approves verifications · matches payments | Tagged `is_internal=TRUE`; two-admin gate for major decisions |

**Dual-role pattern is locked.** A single human can hold multiple roles. Self-purchase is allowed with a confirm modal ("Pay full price" or "Comp for myself"). Self-review is hard-gated by Postgres trigger — design the UX assuming it's blocked at insert.

---

## 3. V1 scope guardrails — these CONSTRAIN the design

1. **Wedding only.** All other event types ("Birthday · Debut · Christening · Gender Reveal · Celebration · Travel · Corporate · Tournament · Anniversary · Graduation · Reunion" — burial retired 2026-05-16) show as "Coming soon" with notify-me. Don't design event-type-specific UI for non-weddings.
2. **No wallet UI.** No balance. No tokens. No credits. No wallet pill in chrome. Ever.
3. **Free planning forever.** Guest list, RSVP, seating, budget, schedule, mood board, basic personal invitation page — never paywalled.
4. **À la carte add-ons.** Optional features (Monogram Hero ₱1,999, Live Schedule ₱999, Save-the-Date Video ₱99, day-of services, vendor boost) are one-shot orders. Not subscriptions.
5. **Setnayan Pay convenience fee = flat 5.0%** on top of vendor's listed price, paid by couple at checkout. Always show the all-in number AND the worked example.
6. **BIR Official Receipts** on every checkout (OR number, VAT split, vendor TIN, EWT row when applicable). Receipt is a first-class screen, not a footnote.
7. **Two-admin approval gate** on major admin decisions (price changes, deletions, blacklist, payment-method config). Routine ops = single-admin. Visualize the co-sign step.
8. **Responsive by default.** Every surface ships desktop + mobile. Bottom nav on mobile = top tabs on desktop. Bottom sheets on mobile = dropdowns/poppers on desktop. Do not design mobile-only or desktop-only screens.
9. **Bilingual (EN + Tagalog).** Mock both. Tagalog strings run ~20% longer.
10. **Filipino visual cues.** 18 PH-specific guest role tags. Charm pricing (-1 endings). City-level coverage map — never barangay-level.

---

## 4. Brand foundation

### 4.1 Voice & tone

- **Filipino-first, code-switching welcome.** Marketing line: *"Wedding muna. May iba pang darating."*
- **Operational over aspirational.** Lead with what the platform DOES (book, ledger, broadcast) over emotional copy.
- **Direct about money + compliance.** Pricing visible. Worked example on the homepage. "BIR-compliant" said out loud.

### 4.2 Themes — 5 locked options

| Theme | Primary | Accent | Mood |
|---|---|---|---|
| **Setnayan Default** (default) | Mulberry CTA `#5C2542` + Champagne accent `#C5A059` | Alabaster `#FBFBFA` · Obsidian `#1E2229` ink | Premium Event SaaS · editorial — Clean Editorial palette locked 2026-05-29 (supersedes burgundy 2026-05-15 + terracotta original) |
| **Victorian** | Deep wine + cream | Gold filigree | Heritage, formal |
| **Classy** | Neutral mid-grey + black | Champagne | Minimal, editorial |
| **iOS** | iOS systemBackground | iOS systemBlue | Tech-forward, light |
| **Forest & Champagne Gold** | Forest `#2D4A3A` | Champagne gold `#C9A66B` | Outdoor, natural — added 2026-05-15 |

Themes are user-selectable in Profile → Appearance. Designs must hold up across all five. Avoid theme-specific imagery in chrome.

### 4.3 Typography (queued install — design now with named fonts)

- **Display:** Cormorant Garamond
- **Body:** Manrope
- **Mono:** DM Mono (codes, receipts, public IDs `S89X-XXXXXXXXXX`)

System stack is the current fallback. Mock with the named fonts.

### 4.4 Iconography

Lucide icons exclusively (`lucide-react`). No custom icons in chrome. Sizes 16 / 20 / 24 px. Stroke `1.5`.

### 4.5 Recurring motifs

- **Monogram-as-identity.** The couple's monogram anchors their event in chrome — top-left avatar position when in an event scope. Same monogram replaces the Setnayan watermark on every paid render output.
- **Service-card grid.** The "Day-of services" pattern: card with icon + service name + two-line promise + "Get your quote" CTA.
- **Worked-example tile.** Every pricing surface shows ₱100,000 → ₱105,000 expansion.
- **Verification badges.** Vendor states: `hidden` · `coming_soon` · `verified` · `archived`. Each gets a visually distinct badge.
- **Charm-priced ladders.** All SKU prices end in -1: ₱49 · ₱99 · ₱199 · ₱499 · ₱999 · ₱1,499 · ₱1,999 · ₱2,499 · ₱2,999 · ₱4,999.

---

## 5. Public marketing surface (unauthenticated)

### 5.1 Homepage `/` — 14 sections, in order

| # | Section | Promise | Visual pattern |
|---|---|---|---|
| 1 | Sticky header | Brand · Sign in · Create account · "Apply →" (vendor) | Logo left, three CTAs right |
| 2 | Hero / value prop | Three-question framing | Big headline, sub-line, two CTAs: "Start planning · free" + "I'm a vendor" |
| 3 | Problem statement | *"Five apps. Three spreadsheets. A WhatsApp group at 11pm."* | Pull quote |
| 4 | Positioning | *"Built for both sides of the celebration."* | Two-column couple/vendor benefits (6 bullets each) |
| 5 | Interactive demo | *"Maria & Juan: every moving piece, in one app."* | Live couple-dashboard mockup with role/theme toggles |
| 6 | Four core tabs | Guest List · Vendors · Schedule · In-App Services | Quad-card or tabbed module |
| 7 | Day-of services grid | 10 service cards | 4-up desktop / 2-up tablet / 1-up mobile |
| 8 | Pricing (transparent) | Free / À la carte / 5.0% checkout fee | 3-column tier table + worked example |
| 9 | Event-type roadmap | Wedding live + 8 coming-soon | Grid with "Live" badge and notify-me inputs |
| 10 | Geographic coverage | *"From Luzon to Mindanao."* | PH map illustration, city pins |
| 11 | Closing CTA | *"Set na 'yan."* | Two CTAs (couple + vendor) |
| 12 | Cross-device availability | Web live; Windows/macOS/iOS/Android coming | Device row with "Coming" badges |
| 13 | Footer | Navigate / Legal / Compliance / Language switcher | 4-column |
| 14 | (Implicit) | NO testimonials section at V1 | — |

**Day-of services** (Section 7) cards to design:

| Service | Promise |
|---|---|
| **Papic** — Designated Paparazzi | iOS/Android app for guests; gesture shutter; real-time photo delivery |
| **Panood** — Multi-Cam Live Stream | Up to 5 cameras; broadcast to couple's YouTube; custom monogram + AI highlight reels |
| **Pakulay** — Mood Board & Palette Engine | Per-role/venue palettes with contrast/temperature/cultural-default error catching |
| **Pailaw** — LED Background Maker | 8K loops for venue LED walls; USB-deliverable offline |
| **Pareto** — Pro Camera Bridge | Pair DSLR (Canon/Nikon/Sony/Fujifilm) with phone for broadcast-grade |
| **Custom Monogram Pack** | Replace Setnayan watermark with couple's monogram across all media |
| **Pro Invitation Widgets** — Hero · Story · Schedule | Pro tiers for invitation page blocks |
| **AI Edited Highlight** — same-day reels | Auto-curated highlights from photo + stream feeds (3-min ₱3,499) |
| **Photo Delivery** | Google Drive integration; 30-day compression grace; storage tiering after |
| **Supplies Marketplace** | Vetted Filipino vendors for prints, rentals, NFC keepsakes, decor to venue |

### 5.2 `/for-vendors` (in flight — Phase 2 agent)

Vendor-facing landing. Must cover:
- Free profile (logo + photos + services + packages)
- Lead inbox + pipeline (no commissions, no per-listing fees)
- Calendar + team roles
- Boosted Ads ladder (5km ₱4,999/wk · 10km ₱7,999/wk · 20km ₱14,999/wk)
- Sponsored Boost (Quarterly ₱249,999 / Annual ₱799,999 at 30km — verified-only)
- All Tools Unlock bundle ₱9,999/year
- Verification flow (FREE initial / ₱1,499 annual renewal / ₱2,499 re-verification after demotion)
- "Apply now" CTA → `/signup?as=vendor`

### 5.3 `/features` (in flight)

Deep-dive feature page. Anchored sections:
- `#guest-list` · `#vendors` · `#schedule` · `#in-app-services`

### 5.4 `/pricing`

Re-shows homepage pricing tile plus the full SKU catalog (charm-priced) and worked example.

### 5.5 `/help` — Help Center

Four role tiles: Customer / Vendor / Guest / Admin. ~90 articles total. Postgres GIN full-text search. Structured contact form routes tickets by role; 24-hour SLA. Reachable without account; logged-in users see role-specific tile pre-selected.

### 5.6 Legal

- `/privacy` · `/terms`

### 5.7 Personal invitation landing `/[slug]` (public — no account)

Same shell for everyone. **Lifecycle phase auto-switches** based on event date:

| Phase | Window | Content |
|---|---|---|
| **Save-the-Date** | T-∞ to T-30d | Hero, date, couple monogram, `.ics`, optional 30-60s MP4 (₱99 upgrade) |
| **Invitation** | T-30d to T-1d | Full invite: hero · story · schedule widget · venue map · RSVP form · gift registry stub |
| **Logistics** | T-1d to event start | Day-of mode: directions, parking, dress code, weather, "What to expect" |
| **Post-event** | T+1d onward | Highlight reel embed · photo wall · thank-you note |

Two paid widget upgrades surface here: **Monogram Hero** ₱1,999 (animated SVG monogram with background video/photo) and **Live Schedule** ₱999 (real-time schedule sync).

### 5.8 Authentication surfaces

- `/login` — email + password (Supabase Auth)
- `/signup` — couple signup
- `/signup?as=vendor` — vendor signup variant
- `/auth/callback` — Supabase OAuth callback
- `/auth/sign-out` — explicit sign-out

---

## 6. Couple dashboard (authenticated)

### 6.1 Shell chrome — applies to every authenticated screen

**Top bar (persistent):**
- **Top-left:** Couple's monogram → opens **event switcher** popover listing all events the user belongs to, plus Shop and Admin Console role rows (if applicable), plus "+ Add event" *(currently shipped as global Setnayan logo without switcher — chrome drift flagged in iteration 0000; designer should mock the spec-correct monogram + switcher)*
- **Top-right:** profile avatar → menu (Profile · Settings · Help · Theme · Locale · Sign out)
- **NO wallet pill. NO balance. NO token count. Ever.**

**Bottom nav (mobile) / top tab strip (desktop):**
Four tabs — **Plan** · **Guests** · **Vendors** · **Add-ons**
*(Note: "Add-ons" replaces previous "Services" name — PR #13 rename. Homepage marketing uses different surface names ("Schedule / Guest List / Vendors / In-App Services") — in-app nav is Plan/Guests/Vendors/Add-ons.)*

**Sub-menu strip (when in an event scope):** event monogram + couple name + event date countdown.

**Responsive cut:**
- **Mobile ≤640:** bottom nav, full-bleed cards, bottom sheets for actions
- **Tablet 640–1024:** bottom nav OR top tabs, two-column where useful
- **Desktop ≥1024:** top tabs + persistent secondary nav, three-column at home

### 6.2 Dashboard home `/dashboard`

User-level home (before picking an event). Shows:
- List of events (thumbnail monogram + name + date countdown)
- "+ Create event" CTA → `/dashboard/create-event`
- Notifications snippet (top 3 unread)
- Setnayan Concierge prompt if no event yet

### 6.3 Event home `/dashboard/[eventId]`

The most-visited screen. Pattern: vertical scroll of cards.

| Card | Shows | Primary CTA |
|---|---|---|
| **Countdown** | Days to event · weather (when T-7d) | — |
| **Setnayan Concierge** | 9-step progress (renamed from "Guided Planner" 2026-05-16) | "Continue" → next step |
| **Guests** | Total · RSVP'd yes · plus-ones · dietary flags | "Open guest list" |
| **Vendors** | Booked · paid · pending | "Open vendors" |
| **Budget** | Spent / total · upcoming payments | "Open budget" |
| **Schedule** | Next 3 milestones | "Open schedule" |
| **Mood board** | Latest palette | "Open mood board" |
| **Inbox** | Unread vendor chats | "Open messages" |
| **Day-of preload** (T-3d to T+1d) | "Prepare for event day" CTA | Pre-downloads day-of bundle |
| **Day-of mode** (T-1h to T+8h) | Live banner | "Enter day-of mode" |

### 6.4 Guest list `/dashboard/[eventId]/guests`

- **List view** — sortable / filterable by RSVP state · role · dietary · plus-one · table
- **18 PH role enum** — Ninong · Ninang · Abay · Best Man · Maid of Honor · Bridesmaid · Groomsman · Parent · Sibling · Family · Friend · Colleague · Coordinator · Officiant · Vendor crew · Plus-one · Child · Other
- **Add guest entry points** — `/new` (manual) · `/quick` (one-line bulk) · `/import` (CSV) · `/[guestId]` (edit)
- **Per-guest QR** — auto-generated; download/print
- **Print pack** — `/invitation/print` produces a printable sheet
- **Empty state** — "Add your first guest" with sample import CTA

### 6.5 Vendors `/dashboard/[eventId]/vendors`

Two surfaces:
- **My vendors** (tracker) — every vendor the couple is talking to or has booked. Per-vendor card: logo + service + status (Inquiry / Meeting set / Booked / Paid / Completed) + next milestone + "Open chat".
- **Browse vendors** (DIY mode with filter popup) — 11 filter chips: City · Service category · Price band · Available on date · Tier · Distance radius · Years operating · Has Setnayan-exclusive · Has reviews · Rating. 7 sort options: Recommended / Most reviews / Highest rated / Closest / Newest / Price low→high / Price high→low. URL-shareable. **"Verified only" toggle** is OFF by default — coming-soon vendors visible with badge.

**Per-vendor detail `/v/[slug]`:**
- Hero with logo + verification badge
- Photos · services · packages · pricing
- Reviews (post-event reviews via 24-hr email trigger; **PERMANENT** per Vendor Agreement; hero metrics + sort/filter strip + paginated cards)
- Exclusive offer row (tinted; gold / terracotta / neutral by tier)
- "Inquire" CTA → opens chat thread (**only couples can initiate**)
- Post-booking menu: Refund · Dispute · Force majeure · Mediation history

### 6.6 Budget `/dashboard/[eventId]/budget`

- Category groups (Venue · Catering · Photography · Attire · etc.)
- Line items with planned / actual / paid
- `.ics` export of payment deadlines
- "Add line item" CTA
- Crew meal totals (auto-aggregated from catering `crew_size` field)

### 6.7 Schedule `/dashboard/[eventId]/schedule`

- Single timeline of wedding milestones + vendor meetings + payment deadlines + RSVP cutoffs
- `.ics` sync with reminders
- "Add milestone" CTA

### 6.8 Seating `/dashboard/[eventId]/seating`

- Drag-drop table layout editor
- Tables get auto-QR for the seating-chart print
- Auto-assign suggestion (group by household / role / dietary)

### 6.9 Add-ons `/dashboard/[eventId]/add-ons` (renamed from `/services`)

Merchandising surface for paid SKUs. Grid of cards by category:

| Category | SKUs |
|---|---|
| **Invitation upgrades** | Monogram Hero ₱1,999 · Live Schedule ₱999 |
| **Save-the-Date Video MP4** | ₱99/render |
| **Day-of broadcast** (V1.5+) | Panood Daily Broadcast ₱499/day · Camera Sync ₱99/day · Annual ₱2,999 · Annual Plus ₱3,999 |
| **Day-of paparazzi** (V1.5+) | Papic 3-seats ₱1,499 · 5-seats ₱2,499 · camera addon ₱999 · credits addon ₱299 · premium guest pack ₱1,499 · personal album ₱49/guest · memory book ₱249/guest |
| **Day-of TikTok booth** (V1.5+) | Patiktok Setnayan TikTok ₱999/day · Personal TikTok ₱1,999/day (+ ₱49/+10 overage) |
| **Highlights** | AI Edited Highlight 3-min ₱3,499 |
| **LED background** (V1.5+) | 8K loops |
| **Supplies marketplace** (V1.5+) | Vetted Filipino vendors |

Anything V1.5+ shows as **"Coming soon"** with notify-me capture.

### 6.10 Mood board `/dashboard/[eventId]/mood-board`

- Per-role palette pickers (Couple / Bridesmaids / Groomsmen / Parents / Venue)
- Rule engine catches contrast / temperature / cultural-default errors
- Save palette → exports to invitation page styling

### 6.11 Messages `/dashboard/[eventId]/messages` and `/messages/[threadId]`

- Thread inbox sorted by recent activity
- Per-thread header: **vendor's masked identity** (vendor logo ALWAYS, NEVER personal photo)
- Attachments: photos · PDFs · `.docx` · `.xlsx` · `.csv` — with in-app viewers
- Force-majeure trigger entry (type picker + evidence upload + 4-option resolution: refund / reschedule / partial / dispute)
- **Video meetings RETIRED in V1** — external tools (Google Meet, Zoom, Messenger, WhatsApp) handoff pattern instead

### 6.12 Orders `/dashboard/[eventId]/orders`

- Order list with state (Quoted / Paid / Awaiting reconciliation / Completed / Disputed)
- Per-order detail at `/[orderId]`: line items · +5.0% breakdown · BIR receipt link · vendor handoff
- "Create order" `/new` (manual order entry from a vendor offer)

### 6.13 Receipts `/receipts/[receiptId]`

Standalone receipt view (shareable URL). Renders:
- Sequential OR number
- Date
- Vendor TIN (auto-formatted)
- Line items
- VAT split
- EWT (Form 2307) row when applicable
- Setnayan Pay convenience fee line
- "Download PDF" CTA

### 6.14 Day-of mode — auto-activates T-1h to T+8h

Replaces event home with a 5-card live grid:

1. **What's happening** — current schedule block highlighted
2. **Your table** — for the couple's own page
3. **Live photo wall** — Papic stream (stub in V1; full at V1.5+)
4. **Live schedule** — synced to the invitation page widget
5. **Coordinator broadcast** — broadcast notes from coordinator

Offline-first PWA shell — works on weak venue signal. **5-mode lifecycle:** pre-day · warmup · live · cooldown · post-day. Designer must visualize the banner taking over chrome.

### 6.15 Settings `/dashboard/profile` — 6 tabs (settings INSIDE the dashboard, not a separate surface)

| Tab | Contains |
|---|---|
| **Account** | Name · email · phone · password change |
| **Appearance** | Theme picker (5) · EN/TL locale toggle · text size |
| **Notifications** | Per-channel toggles (email · in-app) · per-type frequency |
| **Payment methods** | Saved bank/GCash references (no auto-charge; reconciliation only) |
| **Privacy & data** | RA 10173 § 16(e) data export (JSON download) · § 18 account delete · cookie prefs |
| **Devices** | Active sessions · revoke individually |

---

## 7. Vendor dashboard

### 7.1 Shell

Same chrome pattern as couple dashboard, but secondary nav surfaces vendor surfaces:
`Dashboard` · `Bookings` · `Services` · `Calendar` · `Team` · `Earnings` · `Messages` · `Settings`

Vendor public ID badge (e.g., `S89V-XXXXXXXXXX`) visible in profile chrome.

### 7.2 `/vendor-dashboard` home

Cards:
- **Public stats** — completed events (public count **excludes** vendor's own team/internal/self-comp; toggle to private full count via materialized-view pair)
- **Inquiry inbox** — new threads
- **Booking pipeline** — funnel: Inquiry → Meeting → Quote → Booked → Paid → Completed
- **Earnings snapshot** — payouts queued · last 30 days
- **Verification status** — hidden / coming_soon / verified / archived (with renewal countdown if verified)
- **Team pool** (if applicable) — monthly shared allowance widget
- **Boost status** — active boosts with km radius

### 7.3 Bookings inbox `/vendor-dashboard/bookings`

- New inquiries (open thread)
- Quoted (sent proposal)
- Booked (deposit paid)
- Completed (payout due)
- Disputed (escalation flag)

### 7.4 Services `/vendor-dashboard/services`

CRUD for the vendor's own offerings:
- Per service: name · photos · description · pricing · `crew_size` · `crew_meal_required` · exclusive-offer flag
- Service editor stepper guides through "How many of your team will be on-site?"

### 7.5 Calendar `/vendor-dashboard/calendar`

- Bookings overlay
- Team-role assignments per booking
- Service-scoped availability blocks
- `.ics` export

### 7.6 Team `/vendor-dashboard/team`

4 role tiers — **Owner** (one) · **Admin** · **Agent** · **Viewer**
- Per-agent service scoping (which services they can handle)
- Optional `team_label` feeds chat identity masking
- **Team Pool widget** for non-owner team (₱10K monthly cap · shared · use-it-or-lose-it · FCFS · 0.5% of prior-month sales formula)

### 7.7 Earnings `/vendor-dashboard/earnings`

- Payout queue
- Per-order breakdown: gross · gateway fee (vendor absorbs) · BIR 0.5% pass-through · Setnayan fee paid by couple (informational, not deducted from vendor) · vendor net
- Form 2307 quarterly PDF download (V1.5+ generation)
- **Payout model:** verified vendors = T+1 immediate full · coming_soon = 3-stage milestone 20/60/20 with T-14 + T+7 dispute windows
- **Demote trigger:** 3+ disputes / 30d → drop to coming_soon

### 7.8 Profile / brand `/vendor-dashboard/profile`

- **Logo** — mandatory at registration; PNG transparent, 512×512 min, ≤2 MB. This is what customers see in chat, NEVER the personal photo
- Cover photo · Bio · Service categories · Public landing slug (`/v/[slug]`)
- Verification documents upload (12-doc checklist via `setnayan-vendor-verification` R2 bucket)

### 7.9 Verification flow

**12 documents, all-or-nothing, 3–5 business-day SLA:**
1. DTI Certificate of Registration
2. BIR Form 2303
3. Mayor's Permit
4. Government ID (via Persona/Veriff/Onfido)
5. Bank micro-deposit verification
6. Portfolio + reverse-image-search check
7. Three references
8. Live selfie + liveness
9. 15-minute Google Meet
10. SMS OTP + email confirm
11. Social media presence check
12. AMLC sanctions screening

**Pricing:** FREE initial · ₱1,499 annual renewal · ₱2,499 re-verification after demotion.

`verified` state is **required** for Sponsored Boost ladder (30km, long-commit tier).

### 7.10 Marketing / Boost `/vendor-dashboard/boost`

| Product | Audience | Pricing |
|---|---|---|
| **Boosted Ads** | All paying vendors | 5km ₱4,999/wk · 10km ₱7,999/wk · 20km ₱14,999/wk |
| **Sponsored Boost** | Verified-only · 30km | Quarterly ₱249,999 · Annual ₱799,999 |
| **All Tools Unlock bundle** | All paying vendors | ₱9,999/year — Mood Board + Palette + Seating + QR Reader + Advanced Pricing Tier |

### 7.11 Messages

Same chat shell as couple side. **Vendor identity is always the masked logo.** Vendors **REPLY only** — they cannot cold-DM customers (customer-initiates-chat invariant).

### 7.12 Disputes / Force majeure

- Inbox tab for active force-majeure flags (4-option resolution)
- 7-day auto-resolution window
- Escalation to admin Disputes Handler

---

## 8. Admin console (owner + spouse only — `is_internal=TRUE`)

12 surfaces total. Two-admin approval gate for major decisions (lock icon + co-signer dialog).

### 8.1 `/admin` overview
- KPI strip: signups today · active events · pending payments · pending verifications · open disputes
- Funnel snapshot (7 V1 funnels)
- Recent activity feed

### 8.2 `/admin/users`
- User table with role badges (couple / vendor / guest / internal 🟣)
- Per-user actions: Delete · Blacklist · Comp grant
- Self-review moderation queue + appeal flow
- **Two-admin approval on Delete + Blacklist**

### 8.3 `/admin/events`
- Event table (date, status, vendor count, booking total)
- **Self-serve event delete is NOT supported** (admin-only via support ticket — design a confirm-and-route flow)
- Edit event (V1 = Wedding only — type lock visible)

### 8.4 `/admin/vendors`
- Vendor table with verification state column
- Filter by state (hidden / coming_soon / verified / archived)
- Public_visibility editor

### 8.5 `/admin/verify` (8th admin surface, added 2026-05-15)
- Verification queue (FCFS)
- Per-application: 12-doc checklist with evidence preview
- Status tabs: Pending / Approved / Rejected / Re-verify
- Audit-logged actions

### 8.6 `/admin/payments`
- Manual reconciliation inbox (V1; Maya Business automates at V1.5+)
- Per-payment: matched? · vendor reference · receipt issued?
- Bulk match by reference code
- Merchant QR auto-crop (BDO + GCash QR upload by admin via `jsQR`)

### 8.7 `/admin/receipts`
- Issued OR list
- Filter by date · vendor · customer
- Form 2307 quarterly batch generator (V1.5+ engineering)

### 8.8 `/admin/help`
- Support ticket queue (routed by role)
- 24-hour SLA timer per ticket
- Article editor for the 90-article FAQ corpus

### 8.9 `/admin/settings`
- Platform settings: BIR rates · bank info · GCash QR · merchant QR · feature flags
- **Payment Method Config** with two-admin approval gate
- **Payment-options policy matrix** (per-account-type): Customers / Vendors / Certified Vendors / per-Event override

### 8.10 `/admin/website` (added 2026-05-15)
- Homepage section reorder (native HTML5 drag-drop)
- Site widgets registry editor (`site_widgets` table)
- Platform availability editor

### 8.11 `/admin/funnels`
- **7 V1 funnels:**
  1. Customer signup → first booking
  2. Vendor signup → first booking
  3. Setnayan Concierge adoption
  4. DIY browse
  5. Save-the-Date
  6. Paparazzi (V1.5+ awaiting)
  7. Pro upgrade
- Cohort breakdowns + period compare

### 8.12 `/admin/force-majeure`
- Escalation queue
- Per-flag: type · evidence · couple side · vendor side · resolution status

---

## 9. Guest experience

### 9.1 `/[slug]` — personal invitation landing

Public · no account needed. Cookie session keyed to the slug. Same shell for everyone; lifecycle phase auto-switches.

**Page blocks:**
- Hero (monogram + couple name + date)
- Story
- Schedule widget
- Venue map (Mapbox/Google Maps — queued)
- RSVP form (per-guest, prefilled from QR token)
- `.ics` download
- Gift registry stub
- Phase-specific CTAs (Save the date · RSVP · Get directions · View highlights)

### 9.2 RSVP flow

1. Scan personal QR → `/[slug]/welcome?token=…`
2. Identity confirmed (name prefilled)
3. Select attendance · plus-one count · dietary
4. Optional message to couple
5. Receive `.ics` + map link
6. Receive in-app + email confirmation

### 9.3 Guest day-of mode (T-1h to T+8h)

Auto-activates on the personal landing page. Same 6-card grid as the couple's day-of mode but role-scoped (guests see what THEY need: their table, the schedule, the photo wall they can upload to, the coordinator broadcasts). Offline-first PWA shell.

### 9.4 `/join/[eventId]` + `/success`

For guests joining via QR scan at the venue (vendor crew check-in pattern).

---

## 10. Cross-cutting patterns

### 10.1 Responsive breakpoints

| Breakpoint | Behavior |
|---|---|
| `sm` (640) | Bottom nav (4 tabs) · bottom sheets · single-column cards |
| `md` (768) | Bottom nav OR top tabs · two-column where useful |
| `lg` (1024) | Top tabs · persistent secondary rail · dropdown poppers replace sheets |
| `xl` (1280) | Three-column home · expanded data tables |
| `2xl` (1536) | Max layout width |

### 10.2 Empty / loading / error states (mock all four for every list)

- **Empty** — illustration + 1-line copy + primary CTA + "Try import" secondary
- **Loading** — skeleton (not spinner)
- **Populated** — content
- **Error** — copy + retry + "Contact support" link

### 10.3 Notifications

- **In-app** — bell icon top-right · unread badge · thread on click
- **Email (Resend)** — 7 V1 templates live: welcome · chat_message · order_quoted · order_paid · payment_matched · payment_rejected · rsvp_received. Phase 2 adds help_ticket_replied + vendor_inquiry_received.
- **NO SMS in V1** (V1.5+ via Twilio/Globe/Smart)

### 10.4 Guided tour

Driver.js library. Per-role first-time tour:
- Customer 8-step
- Vendor 7-step
- Guest 4-step
- Admin 6-step

Plus 11 per-surface mini-tours (queued). Replayable from Settings → Appearance.

### 10.5 Persistent login

- Installed PWA / Tauri desktop = **10-year cookie**
- Web browser = **1-year cookie**

### 10.6 BIR receipt rendering

Every checkout produces an OR with:
- Sequential OR number (resettable on `tax_config` change)
- Vendor TIN (auto-formatted)
- VAT split
- EWT (Form 2307) row when applicable
- Setnayan convenience fee line (informational; vendor receives gross)
- Downloadable PDF (via `pdf-lib`, queued)

### 10.7 Public IDs

Every customer-facing entity uses `S89<TYPE>-<10-char Crockford>`:
- `S89E-…` event
- `S89V-…` vendor
- `S89U-…` user
- `S89O-…` order
- `S89R-…` receipt

Show in mono in the UI. Don't truncate.

### 10.8 Charm pricing

All SKU prices end in -1: ₱49 · ₱99 · ₱199 · ₱499 · ₱999 · ₱1,499 · ₱1,999 · ₱2,499 · ₱2,999 · ₱4,999. Round numbers like ₱1,000 or ₱2,500 are spec drift — never design them in.

### 10.9 No-wallet pattern

Never show a balance. Never show "tokens". Never show "credits". Payment is **order → invoice → BIR receipt** every time.

---

## 11. Setnayan Pay / pricing UI

### 11.1 The 5.0% rule

Vendor lists ₱X. Couple pays ₱X × 1.05 at checkout. Vendor receives ₱X (less their gateway fee + BIR 0.5%).

**Display convention:** Always show the all-in number (couple-facing) AND the vendor-listed number where relevant. Tooltip explains the breakdown.

### 11.2 Worked-example tile (reusable component)

```
Vendor lists:        ₱100,000
Setnayan Pay (5.0%): +₱5,000
─────────────────────────────
You pay:             ₱105,000
Vendor receives:     ₱100,000
```

Use this tile on:
- Pricing page
- Homepage pricing section
- Cart / checkout
- Order detail
- Vendor service detail (when in couple view)

### 11.3 Payment methods (V1)

- **Bank transfer (BDO)** — manual reconciliation
- **GCash QR** — manual reconciliation
- Admin-configurable per method (default uniform 5.0%)

V1.5+ unlocks Maya Business gateway + Maya QR Ph as primary rail.

---

## 12. What is NOT in V1 (do not design these)

- Wallet · balance · tokens · credits anywhere in chrome (spec drift — actively excluded)
- Native iOS / Android / Windows / macOS native apps (Tauri desktop ships, but treat web as primary)
- Video meetings in-app (RETIRED 2026-05-16 — couples + vendors handoff to external tools)
- Self-serve event delete (admin-only via support ticket)
- SMS notifications
- Cebuano (CEB) locale (V1.1)
- Auto-translation in chat (V2)
- Vendor-to-vendor private chat (privacy invariant)
- Group video > 8 participants
- Public API endpoints exposed to integrators (plumbing only in V1)
- Multi-region replication
- Testimonials section on the homepage

---

## 13. Designer pre-handoff checklist

Confirm each before approving mockups:

- [ ] All 5 themes hold up — Setnayan Default (burgundy) is the showcase, but Forest & Champagne Gold, Victorian, Classy, iOS shouldn't break
- [ ] Mobile + desktop layouts for every surface
- [ ] Empty / loading / error / populated states for every list
- [ ] EN + TL versions of every chrome string (TL strings run ~20% longer)
- [ ] No wallet / balance / token UI anywhere
- [ ] Vendor identity is always the logo, never the personal photo
- [ ] BIR receipt is a first-class screen, not a footnote
- [ ] All prices use charm endings (-1)
- [ ] All pricing surfaces include the +5.0% worked-example tile
- [ ] Couple-only chat initiation honored (vendor surfaces show Reply, not New)
- [ ] Day-of mode banner is unmissable in the T-1h to T+8h window
- [ ] Verification badges (hidden / coming_soon / verified / archived) visually distinct
- [ ] Two-admin approval gate visualization (lock icon + co-signer dialog) in admin
- [ ] Filipino role tags (Ninong, Ninang, Abay, etc.) feel native, not translated
- [ ] Monogram-anchor pattern: couple monogram top-left in event chrome, replaces watermark on paid renders
- [ ] All public IDs displayed in mono (DM Mono)

---

## 14. Where to keep going

| For | Open |
|---|---|
| Feature-level spec | Matching `00NN_*` iteration folder under `/Users/icecasasola/Documents/Claude/Projects/Setnayan/` |
| Pricing detail | `05_Financials/Pricing_Workbook_*.xlsx` |
| Shipped-vs-spec state | `App_Build_Status.md` |
| External dependency state | `Installed_Stack_Inventory.md` + `API_Integration_Checklist.md` |
| Locked decisions | `CLAUDE.md` decision log (bottom) |
| Live product (always confirm here) | https://www.setnayan.com |
| Code (the actual surfaces) | `iscasasola/setnayan-platform` `apps/web/app/` |

---

## 15. Iteration quick-map

If a screen isn't in this doc but you find it on the live site or in `apps/web/app/`, the iteration folder will be the source of truth:

```
0000 app_shell_and_navigation/    login, role-router, event picker, 4-tab nav
0001 creating_guest_list/         guest list, RSVP
0002 qr_invitation_system/        slug + personal QR + 4-phase landing page
0004 invitation_widgets/          11 widgets + paid upgrades
0005 led_background_maker/        V1.5+
0006 vendors_management/          marketplace, reviews, verification, payouts
0007 budget_expenses/             couple's payment ledger
0008 seating_chart_editor/        table layout + QR print pack
0009 photo_delivery/              V1.5+
0010 mood_board/                  palettes + rule engine
0011 panood/                      V1.5+ live stream
0012 papic/                       V1.5+ paparazzi
0013 platform_stack_and_sync/     infra
0015 main_website/                setnayan.com marketing
0016 step_by_step_plan_builder/   Setnayan Concierge (renamed)
0017 patiktok/                    V1.5+ TikTok booth
0018 supplies_marketplace/        V1.5+
0019 communications/              chat + files (video retired)
0021 couple_dashboard_fully_purchased/  9 customer surfaces
0022 vendor_dashboard/            6 vendor surfaces
0023 admin_console/               12 admin surfaces (with PR #54 + #56 adds)
0024 save_the_date/               Page-render retired · ₱99 MP4 SKU live
0025 profile_settings/            6-tab settings inside each dashboard
0026 bir_tax_compliance/          OR + VAT + EWT + Form 2307
0028 email_notifications/         10 templates · Resend
0029 help_center/                 FAQ + tickets
0030 guided_tour/                 Driver.js
0031 day_of_guest/                Live-event mode for guests
0032 contract_intelligence/       AI contract analysis (Claude Haiku 4.5)
0033 public_api_foundation/       OAuth2 (plumbing only)
0034 payments_and_cart/           Setnayan Pay 5.0% · order-and-pay
0035 observability/               Sentry + PostHog
0037 event_day_preload/           T-3d / T+1d pre-load CTA
```

---

**This is the single-pane UI brief for V1. If anything here conflicts with a locked iteration spec or the live product, the spec corpus + live product win. Re-anchor on `App_Build_Status.md` and `V1_Gap_Analysis_Status.md` before each design sprint.**
