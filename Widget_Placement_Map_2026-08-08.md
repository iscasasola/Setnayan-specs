# Widget Placement Map — where every widget sits on every page

> **What this is.** The owner asked: *"grab the data from claude design and incorporate the new
> adjustments and where we keep the widgets of each page properly?"* This document answers the
> second half — **for each app surface, which widgets belong on it, in page order, exactly where
> they sit, and where in the code the design says to put them.**
>
> **Where it came from.** Extracted **2026-08-08** from **10 of the owner's own Claude Design
> artifacts**, read in full. The source `.html` files are now saved in
> [`prototypes/`](prototypes/) and are the primary record; this file is the index over them.
>
> **Status of the designs.** Mixed, and it matters: **4 of the 10 are already fully built and
> shipped** (event home, Live Studio Control, payment flow, guest roster), **2 are decision
> records whose decision already closed**, and the rest are pre-lock sketches. Per-surface build
> state is called out in every section. Nothing here is a licence to rebuild a working screen.

---

## Source artifacts

| File in `prototypes/` | Surface | Dated | Build state |
|---|---|---|---|
| `papic_event_home_placements_2026-07-30.html` | Couple's event home | 30 Jul | ✅ **BUILT** (owner picked A+B) |
| `live_studio_branding_models_2026-07-25.html` | Live Studio broadcast overlay | 25 Jul | ✅ **DECIDED same day** |
| `live_studio_control_2026-07-25.html` | Live Studio Control (operator) | 25 Jul | ✅ **BUILT** (Waves 1–9) |
| `live_studio_roam_2026-07-25.html` | Live Studio buy page + camera setup | 25 Jul | ⚠️ ancestor of shipped screen |
| `payment_flow_2026-07-24.html` | Payment flow (all 3 payers) | 24 Jul | ✅ **BUILT** — explainer only |
| `for_vendors_2026-07-24.html` | Public `/vendors` page | 24 Jul | ⚠️ shipped page is different + bigger |
| `for_vendors_keep_100_2026-07-10.html` | Public `/vendors` page | 10 Jul | ⛔ ~25% unportable (tokens) |
| `floor_plan_tables_vendors_2026-07-10.html` | Seat / floor-plan editor | 10 Jul | ⚠️ sketch; shipped editor is far deeper |
| `guests_living_roster_2026-07-10.html` | Couple's Guests page | 10 Jul | ✅ **BUILT** (Living Roster P0/P2) |
| `phone_screen_mockups_2026-07-10.html` | Commercial storyboard, 6 surfaces | 10 Jul | 🎬 film board, not a page spec |

**Insertion points are thin on purpose.** Only ONE of the ten designs (`papic_event_home_placements`)
names real files, props and arrays. The other nine name **zero** code files. Every "not stated"
below is a verified absence, not an unread field — **do not guess a file.**

---

## 1 · Couple's event home — `/dashboard/[eventId]`

**Source:** `papic_event_home_placements_2026-07-30.html` (primary — the only design in the batch
with real insertion points) · `phone_screen_mockups_2026-07-10.html` Clip 01 (secondary).
**Rendered by:** `<EventDashboard>` in `event-dashboard.tsx`, mounted from `page.tsx`.
**Scope correction carried by the design itself:** the PR-G spec named three home surfaces; two no
longer exist — `today/` retired 2026-06-03, `for-you/` retired 2026-06-04, both now redirects. All
three mockups are the **same single page**.

### Page order (top → bottom)

| # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|
| 1 | Obsidian "Big Day" focal | Top of page, above the bento | not stated | permanent |
| 2 | **At-a-glance bento — Papic tile** ("Papic · 50 shots ready · 1 camera out"; flips to "312 photos gathered · 1,840 shots left" after first capture; footer link "Open Papic →") | 4th tile in the bento grid, beside Guests / Budget / Team | **`event-dashboard.tsx` → the `miniTiles` array, beside Guests / Budget / Team** | **permanent** — never dismissable. Passes the bento's "real-data-or-nothing" law because every event holds a live pool grant |
| 3 | **"Your free camera is ready" nudge** — eyebrow *Already yours* · title · one-sentence body · "Open Papic →" · ✕. Modelled bar-for-bar on `SetDateNudge` | **`slotAfterBento`** — full-width band between the bento and the journey rail | **`page.tsx` → the existing `slotAfterBento` prop, alongside `SetDateNudge` and `NikahEssentialsCard`** | **dismissible**, remembered per event in localStorage. Also self-hides once Papic is opened or a shot is taken. **Queues behind the set-date nudge** so two bands never collide |
| 4 | Journey rail (six stages) | Below `slotAfterBento` | not stated | permanent |
| 5 | Decisions board — "Needs your call" | Last block of the page | not stated | permanent |
| 5a | ⛔ *Papic row inside the decisions board* ("hand out your free camera") | Ranked between "Catering — final headcount" and "Hair & makeup — trial not booked" | `event-dashboard.tsx` → the cockpit decisions list | **DELIBERATELY NOT BUILT.** Design's reason: Papic is a capability they already own, not a decision. "A board that cries wolf about a free camera teaches couples to skim the board — and that board is where the photographer deadline lives." Only becomes right if Papic gains a real deadline |

### Shipped reality (verified against `origin/main` af8c84e2)

- Option A ships as `papicMini` pushed into `miniTiles` at `event-dashboard.tsx:1272`.
- Option B ships as `_components/papic-ready-nudge.tsx`, mounted at `page.tsx:424`.
- Guard test `lib/papic-home-tile.test.ts` asserts the push order — **don't reorder the array.**
- Tile links to `/dashboard/[eventId]/studio/papic`.

### Conflicts to know before porting

| Claim in the design | Reality |
|---|---|
| Bento is a 3-column grid, "nothing is displaced" | Shipped bento is `grid-cols-2` with `MAX_MINIS = 4`. On a full dashboard **Messages yields**; Guests/Budget/Schedule/Papic never drop |
| Counts read through the normal client | Counts read through the **service-role client behind an explicit `canViewPapicCounts` gate** — an RLS denial returns `count: 0` with no error, so a coordinator would have seen "0 cameras out" on an event already shooting. Owner ruled 2026-07-30 a delegated coordinator MAY see the numbers; capture-table RLS was **not** widened |
| Clip 01 bottom nav: Today · Guests · Vendors · More | Shipped couple nav is **Overview · Guests · Marketplace · Suite/Studio**. No "More" tab exists on the couple side |
| Clip 01 "Today's focus" card as free furniture | `Today's Focus ₱1,499` is an INACTIVE row in the live catalog. If activated, the film shows a paid widget as though free |

### Also on this surface from the storyboard (Clip 01, film-order)

Couple names headline → date + venue line → countdown ring (156 / DAYS TO GO) + progress readout
("68% planned" / "You're ahead of schedule") → three stat tiles (150 Guests · 6 Vendors · ₱480k
Budget) → "Today's focus" card (bottom, last before nav) → bottom nav. All insertion points: **not
stated**.

**DUPLICATE FILE WARNING.** The corpus already holds this same design at
`06_Prototypes/Papic_Home_Presence_2026-07-30.html` (32,217 B, clean). The `prototypes/` copy is
46,410 B — the difference is only the claude.ai frame-runtime preamble. **Keep the clean one; a
future session must not read the same design twice under two names.**

---

## 2 · Public vendor page — `/vendors` (was `/for-vendors`, 308 redirect)

**Two designs cover this surface and they CONTRADICT EACH OTHER.**
`for_vendors_2026-07-24.html` (newer, gold, flat-5%) and `for_vendors_keep_100_2026-07-10.html`
(older, wine, tokens, "0% forever"). **Neither is the shipped page.**

> 🔴 **RULE 0 — this surface already ships, and was already redesigned once.**
> `apps/web/app/vendors/page.tsx` was rebuilt 2026-07-05 to a *third*, owner-approved prototype
> (`vendors_page_v2_final.html`, not archived). Shipped = photographic hero + ~13 narrative
> sections + a ~90-row **five-column** tier matrix (Free·Verified / Solo / Pro / Enterprise /
> **Custom**) reading live prices. Both designs below are shorter and four-tier. **Porting either
> wholesale would replace owner-approved shipped work.** Mine them for copy, not layout.

### Merged page order (24 Jul design as the spine)

| # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|
| 1 | Sticky top bar — brand lockup + "Open your shop" | Full-width sticky, z-50, blurred | not stated | ⚠️ **DELETE ON PORT** — shipped page renders neither header nor footer; both come from global `SiteChrome` |
| 2 | Hero — "Your first 5 bookings are on us." | First section of `<main>`, eyebrow *For vendors · Philippines*, gold glow bleeding bottom-right | not stated | permanent. ⚠️ omits **verified** — the lock is a *verified* vendor's first 5 *sourced* bookings |
| 3 | Hero CTA row — "Open your shop — free" (gold) + "See how the fee works" (ghost → `#fee`) | Under the lede | not stated | permanent |
| 4 | Four proof chips — ₱0 to join · 0% commission while we launch · No monthly fee required · Your inbox is never locked | Below CTAs, inside hero | not stated | 1/3/4 permanent; **chip 2 conditional** on `NEXT_PUBLIC_BOOKING_FEE_ENABLED` staying off |
| 5 | "The deal, plainly" 3-up grid — ₱0 · Only ours · 95% | Hairline band, second section | not stated | permanent. ⚠️ the 95% cell states the **superseded flat 5%** |
| 6 | "Why vendors switch" comparison ledger | Third section; left dimmed *The usual directory*, right gold-bordered *Setnayan*; 1-col under 860px | not stated | permanent (the ₱25,000–29,000 competitor figure will age) |
| 7 | "What you get today" — 6 cards, green **Live** tag | Fourth section, 3-across glass grid | not stated | each card conditional on its feature staying live — the tag must stay honest |
| 8 | "On the way" — 4 cards, muted **Soon** tag (Front-desk assistant · Agree in chat · Photo Challenge ₱400/event · Booth Studio ₱1,500/28d) | Fifth section, same grid | not stated | **self-retiring** — a card moves to the Live grid when it ships. Both gated flags default off today, so the labels are currently honest |
| 9 | Pricing tier row — 4 tiers, Pro carries a "Most chosen" ribbon | Sixth section, anchored `#fee` | not stated | permanent. ⚠️ prices **hardcoded**; shipped page reads `getVendorPrices()` from `vendor_billing_catalog` with `force-dynamic` |
| 10 | Booth Studio add-on strip | Dashed strip directly under the tier row, inside `#fee` | not stated | conditional — advertises an unshipped SKU **with a price**; same SKU already appears as a "Soon" card two sections above |
| 11 | Fee note paragraph — "When the fee starts:" | Last element of `#fee` | not stated | conditional — its "and today, while we launch, it's 0%" only holds while the fee is off |
| 12 | Closing panel — dark CTA card, `#start` | Final section; repeats the hero headline over its own gold glow | not stated | permanent. ⚠️ button is **inert** (`href="#"` + `return false`) — wire it to the real open-shop entry |
| 13 | Footer | Below `<main>` | not stated | ⚠️ **DELETE ON PORT** (global chrome); its left half names the retired `/for-vendors` route |
| 14 | Scroll-reveal controller (`.reveal` + IntersectionObserver, reduced-motion bypass) | invisible | not stated | **reuse `RevealOnView` in `app/vendors/_components/for-vendors-motion.tsx`** — do not re-implement |

### What the 10 Jul design adds that the 24 Jul one does not

| Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|
| **Keep / Take ledger card** with animated count-up ("YOU KEEP 100%" \| "WE TAKE 0%") | 52px under the hero CTAs, on ruled-ledger paper; 1-col under 620px; one `role="img"`, aria-label "You keep one hundred percent. We take zero percent commission." | not stated | permanent; the 0→100 count runs **once** at IntersectionObserver threshold .4 then disconnects, skipped under `prefers-reduced-motion`. **This is the one widget worth lifting from this file.** |
| "The model" inversion band (`#deal`) — full-bleed wine, serif kicker left, two body paragraphs right | Immediately after the hero | not stated | permanent |
| "Three deliberate promises" card row (01 freedom / 02 trust / 03 fairness) | After the wine band | not stated | permanent |
| ⛔ **Lead tokens block (`#tokens`)** — definition card + 4/10/25/50/100 pack table ₱400–₱10,000 | Fifth section, 1.1fr/.9fr grid | not stated | **UNPORTABLE — tokens are retired to zero.** ~25% of that page |
| Verification band (`#trust`) — 12-item checklist in two columns + "3–5 business days" stat | Sixth section, tinted + bordered top and bottom | not stated | permanent. ⚠️ item 10 is **"SMS one-time passcode"** — **NO SMS IN V1** |
| Closing CTA (`#register`) + footer legal note citing RA 11967 | Last two blocks | not stated | permanent. ⚠️ every CTA on that page hrefs to `#register`, i.e. itself — nothing is wired |

### Conflict table — the two vendor designs disagree

| Point | 10 Jul (`keep_100`) | 24 Jul (`for_vendors`) | **Current truth** |
|---|---|---|---|
| Booking fee | "0% commission … **forever**" | "a **flat 5%** on a closed booking" | **Neither.** 5% first ₱100k · 1% above · floor ₱50 · no cap · sourced clients only · first 5 free (locked 2026-07-25). **Derive from `lib/booking-fee.ts`, never type it** |
| Tokens | Whole section + nav link + Free-tier bullet | absent | **Retired.** Answering a couple is FREE |
| Tiers | Free / Solo / Pro / Enterprise | Free / Solo / Pro / Enterprise | Shipped has **five** — Custom is missing from both |
| Palette | wine `#5A1E2D` + blue `#24597F` + **dark mode + theme toggle** | gold `#9A741A` + **dark mode** | **Terracotta, LIGHT-ONLY** — cream `#FDFBF7` · ink `#2C2A29` · CTA `#C24E25` · gold `#A9834B` · link `#3B4E67` |
| Prices | ₱9,999/₱24,999/₱49,999 yr typed in | ₱1,000/₱2,500/₱8,000 typed in | Read the catalog. Owner lock: *prices from the admin page, not hardcoded* |

⚠️ **The word "commission" appears twice in the 24 Jul design** (hero chip + footer). Corpus lock:
it is a **booking/syncing fee**, never commission, anywhere. (Already live in shipped metadata too —
a site-wide issue, not one this design introduced, but do not re-port it without a ruling.)
⚠️ **Enterprise advertises "API access."** There are **no public API endpoints in V1**.

---

## 3 · Payment flow (all three payers)

**Source:** `payment_flow_2026-07-24.html`. **Not one page** — a 6-step walkthrough spanning the
payer checkout, the payer's wait state, and `/admin/payments`. **All six screens already ship.**

| # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|
| 1 | Header block — SETNAYAN / eyebrow / "One flow for every purchase." / sub-line | Top of `<header>` | not stated | permanent (explainer chrome) |
| 2 | Payer segmented toggle — Vendor (default) / User / Event | Under the sub-line, still in `<header>`; re-renders every screen below | not stated | **prototype control**, not a real product control |
| 3 | Step progress rail — 01 Order created · 02 Pay via QR · 03 Log your payment · 04 Up for verification · 05 Team confirms · 06 Activated | Top of `<main>`, above everything; scrolls horizontally on narrow | not stated | permanent |
| 4 | Lane badge — "● \<payer\> pays Setnayan" vs "◆ Setnayan · internal" | Between rail and screen frame | not stated | conditional on the step's lane — it is the **payer/staff boundary marker** |
| 5 | Screen frame | Centre of `<main>`, min-height 340px, one step at a time | not stated | permanent container |
| 6 | **Step 01 — Order summary card**: item + "awaiting payment" pill · divider · Amount due (large tabular) · Paying as · dashed REF chip | Inside the frame | not stated (design labels state `orders.status → awaiting_payment`) | conditional |
| 6a | **Vendor-only first-5-free callout** — gold on gold tint | Last element inside the step-01 card | not stated | **only in the vendor lane.** ⚠️ copy says "first 5 booked customers"; the rule is first 5 **sourced** bookings — own/invited/returning clients are free **forever** and never create an order |
| 7 | **Step 02 — Pay via QR**: headline + REF chip, two QR cards (GCash 0917 555 0134 / BDO 0012 8899 4471), "Reference to include" row | Inside the frame | not stated | conditional. ⚠️ shows ONE **static** receiving-account pair for every order — per-order QR with the amount injected postdates this design |
| 8 | **Step 03 — Log your payment**: Amount paid · Reference · dashed receipt dropzone · "payment · pending" pill + gold Submit | Inside the frame | not stated (`orders.status → submitted`, `payments.status → pending`) | conditional |
| 9 | **Step 04 — Up for verification**: circled hourglass, "Please wait for confirmation within 24 hours", REF chip | Inside the frame, centred | not stated | conditional — this is the payer's whole holding screen |
| 10 | **Step 05 — Admin payments queue** (the only internal screen): batch bar "3 clean matches · Approve all"; green clean-match row with ✓ Reference matches / ✓ amount reconciles + Approve; dimmed "amount short ₱200" row carrying **needs review** instead of a button | Inside the frame | **`/admin/payments`** — named verbatim in the caption; no component named | conditional; **staff only** |
| 11 | **Step 06 — Paid & activated**: green tick, provisioning line per payer, notified line, "order · fulfilled" pill | Inside the frame, centred | not stated (`paid → fulfilled`, `matched`) | conditional |
| 12 | Caption | Under the frame, 66ch cap | not stated | text per step |
| 13 | Nav bar — ‹ Back / "Step N of 6" / Next › (arrow keys bound) | Under the caption | not stated | permanent |
| 14 | "Under the hood" status strip | Last element, under a dashed rule | names `orders` + `payments` and their statuses — **verified correct against the shipped enums** | permanent |

**Design's thesis:** one spine for every payer; manual verification stays in V1 with an **honest
24-hour SLA shown to the payer**; the admin queue earns speed by making CLEAN matches one-click and
batch-approvable while anything partial gets a full manual check. Its closing commitment: *"Later, a
bank feed will make step 5 automatic — the payer's experience never changes."*

**Already shipped:** batch approve (`admin/payments/_components/batch-approve-controls.tsx` +
`batchApprovePayments`), the payer wait copy (`vendor-dashboard/booking-fees/[orderId]/page.tsx`),
checkout + receipt upload, and admin-uploaded static GCash/BDO QRs
(`admin/settings/payment-methods/`). **Not shown here but live:** duplicate-payment detection,
short-payment handling, the paste-the-bank-alert matcher, per-order QR.

⚠️ **Three payment-flow prototypes now sit in `prototypes/` unreconciled:**
`Payment_Flow_Prototype_2026-07-11.html`, `Payment_Flow_Desktop_2026-07-11.html`, and this one.
This is the newest and the only one putting all three payers on one spine.

---

## 4 · Seat / floor-plan editor — `/dashboard/[eventId]/seating`

**Source:** `floor_plan_tables_vendors_2026-07-10.html`. **A one-idea sketch, not a build spec** —
the shipped `_components/seating-editor.tsx` is 7,735 lines and already does everything here, plus a
3D lab this file has no notion of.

| # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|
| 1 | Sticky action bar | Page top, full width, sticky z-20, blurred, hairline bottom, wraps on narrow | not stated | permanent |
| 2 | Event eyebrow + title ("Isabela & Marco · Floor plan" / "Arrange the room") | Leftmost in the bar | not stated | permanent |
| 3 | **＋ Table** primary button | In the bar, right of the title | not stated | permanent |
| 4 | "New table" popover — Sweetheart 2 · Round 8 · Long 10 · Serpentine 18 · King's 12 | Fixed card anchored under the button (left clamped to `innerWidth − 220`, top +6px, max-height 60vh) | not stated | conditional — dismissed by picking a type or clicking the scrim |
| 5 | **＋ Vendor** button | In the bar, right of ＋ Table | not stated | permanent |
| 6 | "Add a booked vendor" popover — 🎸 Band/DJ · 🍽 Buffet · 🍸 Bar · 🎂 Cake table · 📸 Photo booth (Papic) · 🚪 Entrance · 🎁 Gift table · 🌿 Florals | Same anchored mechanics under ＋ Vendor | not stated | conditional. Gift table + Florals are **popover-only**, never seeded |
| 7 | Light / Dark segmented control | In the bar, right of ＋ Vendor | not stated | ⚠️ **prototype chrome** — palette lock is light-only |
| 8 | Legend — gold ring "Tables" / sky chip "Vendors" | Far right of the bar (`margin-left:auto`) | not stated | permanent |
| 9 | Room canvas | Page body, max-width 1080px centred, fixed 16/10, `overflow:hidden`, `touch-action:none` | not stated | permanent |
| 10 | Grid background — 40×40 hairlines at 22% | Absolutely inset, beneath everything, `pointer-events:none` | not stated | permanent, never interactive |
| 11 | **Stage band** — "▲ Stage & backdrop ▲" | Full canvas width, top 9%, dashed bottom edge | not stated | **permanent and non-draggable by design** — the room's orientation anchor; the drag clamp (y ≥ 9) stops anything landing on it |
| 12 | Dance floor block | Dead centre 50/50, 150×110, dashed gold on gold wash | not stated | permanent — exactly one; draggable, but no control adds or deletes it |
| 13 | Table markers T1–T6 | Free-placed: T1 Sweetheart 50/20 under the stage · T2 27/40 · T3 73/40 · T4 24/74 · T5 50/80 · T6 76/74 — a symmetrical horseshoe around the dance floor. Round = 70px gold circle; long/sweetheart/king's = 92×48 rect | not stated | user-authored, auto-numbered from T7. **No delete / rename / rotate / resize exists in this design** |
| 14 | Vendor chips | Free-placed on the **perimeter**, clear of the horseshoe: Band 13/14 · Cake 87/14 flanking the stage · Bar 8/50 · Buffet 92/50 on the side walls · Photo booth 11/90 · Entrance 89/90 at the back corners. Sky-blue fill, blue border | not stated | user-authored; no delete or re-link |
| 15 | Hint line — *"Drag anything — tables and vendors — to match your real venue. Same room, one plan."* | Directly under the canvas, centred | not stated | permanent — it carries the design's whole thesis, so it is **not** a dismissible coach-mark |
| 16 | Confirmation toast — "Added T{n} · {Type} — drag it into place" | Fixed bottom-centre, 26px up | not stated | transient, 2,200ms; a new toast replaces the old |
| 17 | Popover scrim | Full viewport z-55 under the popover (z-60), invisible | not stated | transient |

**The only delta worth taking:** the composition idea — vendors as sky-blue **perimeter** chips
against gold-outlined tables, one legend, one drag model, one canvas.

⚠️ **Where the sketch is BEHIND the product — do not port these:** it offers **5 table types**;
the owner-locked catalog is **13** (`TABLE_TYPE_CATALOG` in `lib/seating.ts`). Its capacities
disagree (Serpentine 18 is not a number the product has; shipped serpentine defaults to 5). "King's"
does not exist — the nearest real type is Family head 12/14/16, and it even renders using the
`.long` class. Its eight vendors are hardcoded fixtures, while shipped booths **link to the couple's
actual booked vendors** via `event_vendor_id` — which is exactly what its own popover header
promises and does not deliver. Missing entirely: seat rings, per-seat assignment, removed seats,
linked serpentine chains, rotation, labels, QR publishing, auto-layout, 3D, PDF export.

---

## 5 · Couple's Guests page — "Living Roster" — `/dashboard/[eventId]/guests`

**Source:** `guests_living_roster_2026-07-10.html`. **This design is already built** — the shipped
code names it in comments ("Living Roster reskin (P0 · 2026-07-11)", "Capture-first (Living Roster
P2)") across 21 components. **Any gap between a shipped screen and this file is a port defect, not a
fresh design decision.**

### Desktop page order

| # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|
| 0 | Prototype chrome bar (Desktop/Mobile + Light/Dark + legend hint) | Sticky above the page frame | not stated | ⚠️ **prototype only — never port** (its own CSS says so) |
| 1 | Masthead — eyebrow "Isabela & Marco · Wedding" over h1 "Guests" | Header row, top-left | not stated | permanent. ⚠️ shipped title is "**N guests**", desktop-only (owner 2026-06-03) |
| 2 | Header actions — Invite link · **Needs you** (red count badge) · ⌘K Command · List/Mind-map toggle | Header row, top-right | not stated | permanent; badge count is live; Mind-map half is drawn but inert |
| 3 | **Pax card — "Planning for N"** — big serif live number, "your estimate" / "N over estimate" chip, two-colour confirmed/pending meter, caption | Full-width card under the header row | not stated (design states the rule: `livePax = max(estimated_pax, confirmed headcount)`) | permanent |
| 4 | Freeze chip — "🔒 Counts freeze in 12 days" (tooltip: late RSVPs no longer change vendor costs) | Right end of the pax card, top-aligned | not stated | conditional countdown |
| 5 | Nudge banner — "N guests haven't replied…" + "Nudge all →" | Gold wash, below the pax card | not stated | conditional on pending RSVPs |
| 6 | **Capture bar (the add doorway)** — Add/Find toggle, one input, keycap hint; placeholder teaches syntax `Ana Cruz +1 groom vip #Barkada` | Gold-outlined bar under the nudge banner | not stated | permanent; stays focused after each Enter so names type in a run. ⚠️ **the Add/Find toggle is RETIRED** — Find lives in the facet bar's query row |
| 7 | Lifecycle stage strip — Build ▸ Invite ▸ Confirm ▸ Seat ▸ Day-of with live counts | Thin strip under the capture bar | not stated | ⚠️ **RETIRED in shipped code** — "its steps live in the left nav + the roster's own affordances" |
| 8 | Facet bar card — Side · RSVP · View (Roles/Household/Seat) · Group (side-dot + member count) + dashed **＋ New group** | Own card 12px under the header block | not stated | permanent. Shipped adds a **Tags** row this design lacks |
| 9 | Active-filter breadcrumb — "Showing everyone" at rest, else crumbs + ⌫ clear | Right end of the facet bar (`margin-left:auto`) | not stated | permanent — deliberately renders a resting sentence rather than vanishing |
| 10 | **Roster table**, tier-sectioned (Bride & Groom / VIP Family / Wedding Party / Principal Sponsors / Guests) | Page body; 6 columns: select · Guest · Side · RSVP · Seat · actions | not stated | permanent |
| 10a | Guest identity cell — side-tinted initials, ★ pin, name (opens drawer), gold dot for a Setnayan account, "＋ names" plus-one sub-line, ≤2 group chips + "+N" | 2nd column of each row | not stated | permanent; sub-line and chips conditional |
| 10b | Side chip / RSVP chip inline editors | Side + RSVP columns, repeated at the drawer top | not stated | permanent; popover on desktop, cycles in place on mobile |
| 10c | Seat chip — "🪑 T3" placed · "◐ held · T2" · dashed "⌁ ~T5" suggestion, "+N" for plus-ones; replaced by an **amber release bar** ("Seat T2 now free — release it?" Release / Keep held) when a seat frees | Seat column | not stated (design cites the DB trigger `free_seat_on_decline`, owner-locked 2026-06-22) | conditional per row. The plan **self-drafts from role + side** on add, then transfers to the group's table once grouped |
| 10d | **Self-join "Needs you" row** — blush-tinted, "joined via your link · not on your list" + "🎫 Already has their QR & personal page", Keep / Link to invite / Remove | **Inline inside the roster, in the guest's own tier** — deliberately not a separate queue | not stated | conditional. ⚠️ **shipped as a route** `/guests/claims`; the roster only shows a banner |
| 10e | Row hover actions — ▦ personal QR · 🗑 remove | Rightmost column, hover-revealed | not stated | conditional |
| 11 | Bulk action bar — count, Mark Confirmed · Side · Group · Print QR pack · → Seat plan · Remove · ✕ | Fixed bottom-centre, desktop only | not stated | conditional on selection. ⚠️ shipped bar = role + group + side behind ONE Apply, plus Remove — **Mark Confirmed, Print QR pack and → Seat plan have no shipped counterpart** |
| 12 | Add FAB (focuses the capture bar, opens no form) | Fixed bottom-right, 26px | not stated | permanent (desktop) |
| 13 | Undo toast | Fixed bottom-centre, 88px up | not stated | auto-clears at 6s — used for decline-frees-seat, removals, bulk removals |
| 14 | Chip popovers (Set RSVP / Set side / Add to group) | Anchored under the clicked chip over a transparent scrim | not stated | dismissible |
| 15 | New-group popover — name, "Which side?" (defaults **Both**), "✦ Members are seated together — groups drive your table plan.", Create | Same anchored popover, 250px | not stated | dismissible. A group's side is **its own tag**, independent of members' |
| 16 | **Guest drawer** — right rail 392px full-height (bottom sheet on mobile) | Slides from the right | not stated | dismissible |
| 16a | Personal QR panel — QR art + "Branded" chip, "Opens \<name\>'s own page — one key to everything below, printable as a place-card in your Mood Board colors", Download PNG / Regenerate | First block of the drawer | not stated | permanent in drawer; Regenerate warns the old code stops working |
| 16b | "This one QR unlocks" — invitation & RSVP · their gallery (Papic photos they're tagged in, real time) · find-my-seat · Papic tagging · day-of check-in | Directly under the QR panel | not stated | permanent in drawer |
| 16c | Dress code block — 5 Mood Board swatches + tier-specific instruction + "\<name\> sees this on their invite page when they RSVP." | Under the unlock list | not stated | permanent; guidance varies by tier |
| 16d | Groups + Details — group chips with ✕, ＋ Add to group, Seat, **Plus-ones None/+1/+2**, Tier, Account status | Foot of the drawer | not stated | permanent. ⚠️ **the DB caps plus-ones at ONE** (`plus_one_allowed` BOOLEAN + `plus_one_name` TEXT) — the design's +2 model needs a migration |
| 17 | Invite link drawer — URL + Copy, then 4 numbered steps | Same right rail, from the header button | not stated | ⚠️ **shipped as a route** `/guests/invite`. Its own line *"Nothing here leaves this page"* is now false |

### Mobile page order

| # | Widget | Placement | Lifetime |
|---|---|---|---|
| 1 | Sticky top — eyebrow + "Guests", small Invite + Needs-you, one-line pax strip with freeze countdown, removable filter crumbs, scrolling Build/Invite/Confirm/Seat/Day-of strip | Under the prototype bar | permanent; crumbs conditional |
| 2 | Tools block — search, Roster/Groups/Day-of switch, RSVP pills (✓/⏳/✗/○ All), card-vs-list density toggle | Under the sticky top | permanent; density toggle hidden in Day-of |
| 3 | Card grid — sections by tier (or by group in Groups mode), 2/row, 3 for the general tier; side-tinted photo tile, corner side chip, ★ pin, name, plus-ones, RSVP chip, seat chip, ▦ QR chip | Body | permanent (compact rows replace it at list density) |
| 4 | Day-of check-in list — big checkbox, avatar, name, table, RSVP chip | Replaces the grid in Day-of mode | conditional. ⚠️ **shipped as a route** `/guests/checkin` |
| 5 | FAB + 5-slot bottom bar — Lens · Find · (gap) · Select · Seat plan | Bottom | permanent |

**Design's two stated principles:** *"Every action here happens on this one page"* — everything
resolves inline through chips, popovers, a right rail and an undoable toast, nothing navigates away
(⚠️ **three things have since moved to routes**, above); and a destructive automatic behaviour should
be **shown, not hidden** — the decline auto-frees the seat, but "make it VISIBLE + UNDOABLE instead
of silent, so a mis-tap is one tap back."

**Fixture, not product fact:** Isabela & Marco, 16 sample guests, T1–T6, groups "Katropa"/"College
Friends", estimate 14, "Search 250 guests", `setnayan.com/isabela-marco/invite`. The QR art is
generated noise.

---

## 6 · Live Studio

Three designs, three different layers of one product. Read them in this order.

### 6a · Broadcast overlay layer — `/panood/program/[eventId]` + control-room monitors

**Source:** `live_studio_branding_models_2026-07-25.html` — a **decision document about the overlay
layer**, not a page layout. Three 16:9 models: the 2026-07-21 lock, the 2026-07-25 proposal, and the
paid stream.

| Widget | Placement on the frame | Insertion point | Lifetime |
|---|---|---|---|
| Channel identifier chip ("CH 2 · MAIN STAGE") | **Bottom-left** in the 07-21 model; deliberately moved to **TOP-LEFT** in the 07-25 and paid models because the lower third now owns the bottom edge | not stated | permanent — all three models, free and paid |
| Full-screen SETNAYAN mark + "PROVE YOUR RIG · UNLOCK TO BROADCAST" | Covers the **entire** video surface as a scrim; deliberately "useless as an actual broadcast" | **`lib/panood-watermark.ts`** | ⛔ **RETIRED 2026-07-25** — the overlay WAS the paywall. Retirement is conditional on `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED`; with the flag off the legacy Cast control room still draws it |
| **Branded lower third** — "POWERED BY SETNAYAN" + "Free live stream · setnayan.com" + terracotta accent rule | Full-width bar pinned to the **bottom edge**, over a transparent→dark gradient, news-style; picture above stays clean | **`resolveOverlays()`** (`lib/live-studio-overlays.ts`) | ✅ **the locked free-tier branding.** Non-dismissible, "unstrippable (derived from entitlement)" — recomputed from ownership, so no free host can switch it off. **Replaced**, not hidden, on unlock |
| Couple monogram badge ("C ✕ S", italic serif, pill outline) | **Top-right**, diagonally opposite the channel chip | `resolveOverlays()` | paid only, and only when the couple supplied monogram text |
| Couple lower third ("MARIA ✕ JOSEF" + programme line) | **Same bottom-edge slot** — it **replaces** the powered-by bar, never stacks | `resolveOverlays()` | paid only. "Identical in both models — the paid experience was never in dispute" |

⚠️ **The footer line "both draw today" is the stalest assertion in that file** — true only while the
flag is off. **Do not read "retired" as "already gone everywhere."**

### 6b · Live Studio Control — the operator's screen — `/panood/control/[eventId]`

**Source:** `live_studio_control_2026-07-25.html`. **Owner approved this exact prototype ("build
it") and Waves 1–9 shipped.** Archival provenance, not a brief. Phone-first plus one desktop
breakpoint; Desktop re-flows the SAME components into grid-areas
`status status / mon sh / mon strip / tr strip / lay strip / unlock unlock`.

| Row | Widget | Placement | Lifetime |
|---|---|---|---|
| — | Plan toggle · Device toggle · left + right notes rails · four-up facts strip · footnote | Around the device frame | ⚠️ **prototype scaffolding — never ships** |
| 1 | Status strip — event name (truncating) left; "OFF AIR" grey / "LIVE mm:ss" red pulsing chip; monospace viewer count "👁 214" | Topmost row | chip permanent; viewer count hidden until on air, then ticks |
| 2 | **CH 1 monitor** (program monitor) | The hero, 16:9, directly under the status strip; 2px edge turns signal-red with an outer glow the instant it is on air. Desktop: left column across three rows | **permanent — the single fixed anchor.** ⚠️ **it is a placement REHEARSAL, not the air output** (see corrections) |
| 2a | Feed A + Feed B layers | Filled inside the monitor; B parks at `left:100%`, animates to `left:50%` in Split (2px divider) or an inset box at 61%/46% in PiP | B is `opacity:0` unless Split/PiP — **both are phase 2** |
| 2b | "CH 1 · CONTROLLED SCREEN" label | Fixed pill, monitor top-left | permanent — the vocabulary anchor |
| 2c | Ⓜ Monogram badge ("C ✕ S") | Inside the monitor, default **top-right**; tapping it cycles tr → br → bl → tc; drops to `top:38px` when the guest-pick chip owns that corner | conditional on the Ⓜ toggle **and** an unlocked plan |
| 2d | "GUESTS CAN SWITCH VIEWS" chip, green-tinted | Monitor top-right | only while guest-pick is on and unlocked |
| 2e | **Lower third** | Full width across the monitor's bottom, dark gradient + terracotta rule; when on it pushes the camera tag, ⚡ button and toast upward | **split by plan** — Free: permanent, non-dismissible "POWERED BY SETNAYAN"; Unlocked: host-toggleable with the couple's own text |
| 2f | Event-QR overlay ("SCAN TO JOIN") — white card + mini QR | Monitor top-left, just under the CH 1 label | ⚠️ **gated behind ₱2,999 in this prototype — that gate was REVERSED; the QR is FREE** |
| 2g | ⚡ Highlight-moment button + "Moment saved" toast | Circular glass button bottom-right; toast to its left | button exists **only while on air**; toast auto-dismisses at 1.3s |
| 2h | Camera-name tag + ON AIR tag | Monitor bottom-left ("CH 2 · MAIN STAGE"; collapses to "CH 2 ▎CH 3" in Split/PiP); red ON AIR to its left | name permanent, ON AIR conditional |
| 2i | Cut flash | White layer over the monitor | transient 0.28s, suppressed under `prefers-reduced-motion` |
| 3 | Transport row — "● Go live" / "■ End broadcast" (terracotta → signal-red) taking all remaining width + fixed-width **Guest-pick** tile with a two-line label and a physical switch | Immediately under the monitor | permanent |
| 4 | CH 1 layout + overlay icon row — "CH 1" label · Full · Split (P2) · PiP (P2) · divider · Ⓜ · lower-third · event-QR; 40×34 buttons | Single horizontally-scrolling strip, scrollbar hidden | permanent |
| 5 | Camera-strip header — "Camera channels · 4 of 12" + gesture hint that rewrites from "tap = put on Channel 1" to "tap = fill the second window" in Split/PiP | Title left, hint right | permanent. ⚠️ **"12" is unsourced prototype copy, not a locked cap** |
| 6 | **Camera-channel grid** — 2 columns, 112px tiles: live preview, "CH n" badge (→ "CH n · ON AIR" red-bordered when live), CUT badge on hover, host-editable name with ✎, venue subline, ★ on the default | **The ONLY internally scrolling region**, absorbs all flex growth. Desktop: right column across three rows | permanent — one tile per joined camera; **tap is the single gesture** |
| 6a | 🔒 "Unlock to use" badge on non-free tiles, preview desaturated | Centred over each locked tile | ⛔ **RETIRED** — owner: *"but they can still see it."* Extra cameras stay **fully visible** at full brightness. **Copy lock: "Unlock to BROADCAST", never "Unlock to use."** |
| 6b | "＋ Add camera" tile ("scan QR · no login") | Always the last cell | permanent |
| 7 | Unlock bar — "Unlock multi-cam — ₱2,999 · one event" + Unlock button hard-right | Pinned to the foot, full width, terracotta tint. Desktop: spans both columns | conditional, non-dismissible while free; **shakes 0.4s** whenever a locked control is touched; gone on unlock |
| — | "Add a camera" QR bottom sheet — heading, "Any phone scans this — no app, no login — and it appears in your strip", 132px QR, Done | Modal over the whole phone, dimmed blurred backdrop | dismissible |

**Design's position:** one screen runs the whole broadcast. **Tally discipline is absolute — red
means on air and nothing else in the interface is red.** The controller is deliberately dark: *"the
app stays cream; the control room earns the night"* — the one place the palette is intentionally
abandoned. Commercially it sells **in place**, never on a sales page. Positioned against Switcher
Studio: *"Their $65/month buys the switching. It doesn't buy guest-pick, QR joins, or a one-time
₱2,999 that ends when the event does."*

**Four corrections the build forced (do NOT port the prototype's version):**
1. Locked cameras stay **fully visible** — seeing them work IS the conversion.
2. **"Rehearse free, pay to broadcast"** — free hosts may add cameras by QR, name channels, cut
   between them, place the monogram and lower third and set guest-pick, unlimited, at the real
   rehearsal. The paywall fires at **go-live**, not at every control.
3. The **event QR is free**.
4. Overlays **do not composite on the CH 1 monitor** — the capture phone never encodes; the real
   encode surface is the chrome-less `/panood/program/[eventId]` the couple window-captures, and the
   overlays are DOM layers **there**.

### 6c · Live Studio buy page + camera setup — the ROAM-only ancestor

**Source:** `live_studio_roam_2026-07-25.html`. **Route, price and SKU are all dead** — see
staleness. Kept for the two screens' composition only.

| Screen | # | Widget | Placement | Insertion point | Lifetime |
|---|---|---|---|---|---|
| chrome | — | Mock eyebrow/H1, Buy/Controller tab toggle, faux browser frame + URL bar, footer caption | Around both views | names the routes and the flag only | ⚠️ **mock scaffolding — never port.** In the real app these are two different URLs, not tabs |
| Buy | 1 | Service hero — square terracotta app icon, eyebrow "In-app service · Live Studio", title, one-line pitch | First thing on the page, icon left / text right | route only | permanent |
| Buy | 2 | Four-tile stat strip — Rating "—" / Purchased "—" / Cameras "Multi" / Pricing | Under the hero; 4 cols → 2 under 560px | not stated | permanent; two tiles are deliberate empty states |
| Buy | 3 | Plan tile — heading left, price block + "Per event-day" pill right, then the scope paragraph ("Cameras join as phones via the event QR — no install, no per-camera fee") | Bordered card under the stat strip | not stated | permanent |
| Buy | 4 | Primary CTA, full-width terracotta | Bottom of the plan tile | not stated | **state-swapping** — "Once added, this button becomes **Open controller**" |
| Buy | 5 | Payment subnote — "Pays through GCash / BDO QR → verified within 24 hrs." | Centred under the CTA, last element | not stated | conditional (unowned) |
| Setup | 1 | Back link "← Back to Live Studio Roam" | Top-left chip | not stated | permanent |
| Setup | 2 | Header — eyebrow "Roam controller", H1 "Set up your cameras" + inline camera glyph, instruction paragraph | Under the back link | route only | permanent |
| Setup | 3 | Camera list header — "Your cameras" / "3 of 12 channels" left; green "Live-ready picker" ok-pill right | Top row of the cameras card | **`live_studio_roam_zones`** (named in the card caption) | permanent, live count |
| Setup | 4 | **Camera row** — default-view ★ toggle (filled terracotta on the default, hollow + "Set as default" elsewhere), name, venue line with map-pin, Remove trash button. Default row featured (terracotta border + tint) and its venue line appends "· default view" | Stacked rows, default first | `live_studio_roam_zones` | one per saved camera; exactly one carries the default flag |
| Setup | 5 | Add-camera inline form — "Camera name (e.g. Sweetheart Table)", optional "Venue / room", terracotta "+ Add camera" | Bottom of the cameras card | not stated | disappears/disables at the cap |
| Setup | 6 | **Streaming-not-connected notice** (amber) — "These channels define the guest picker now, but they go live only once your Setnayan YouTube channel + OAuth are set up." | Full-width panel **below** the cameras card | not stated | conditional — still honest: prod has **zero** livestream channels ever created |
| Setup | 7 | Technical caption "live_studio_roam_zones · RLS-scoped to your event · cap 12" | Centred monospace footnote | — | ⚠️ **a database table name on a couple's screen.** Documentation, not UI — grep the shipped setup page before reusing this file |

⚠️ **Biggest gap:** this controller shows only add / remove / set-default. The shipped one added
**Main Stage directing** — a live monitor, one-tap "Cut to Main Stage" per camera, and "Take off
air", backed by `live_studio_roam_zones.is_main_stage`. This is the **pre-unification** picture.

---

## 7 · Commercial storyboard — six surfaces, film order

**Source:** `phone_screen_mockups_2026-07-10.html` — 9:16 / 30s / 7 clips. **Not a page spec**; it
freezes six *different* surfaces "at the moment of tap". Every insertion point: **not stated**.
Every phone carries a status bar (9:41 + 3 dots) and a brand bar whose wordmark **is** the page
title. Clip 01 is folded into §1 above.

| Clip | Surface | Widgets in on-screen order | Tap indicator lands on |
|---|---|---|---|
| 02 | **Mood Board (Pakulay)** | Theme title "Garden Romance" → sub-line "Your palette & visual identity" → 5-swatch palette strip (Wine·Blush·Sage·Cream·Gold, 52px, labels at swatch bottom) → 2×2 mood tiles (Florals·Tablescape·Lighting·The Gown, label bottom-left) → **"Apply to my wedding"** CTA pushed to the bottom (`margin-top:auto`). **No bottom nav on this screen** | the CTA, centred at `bottom:22px` |
| 03 | **Seat Plan** | Canvas fills all height between brand bar and summary → "Head Table" stage block pinned top-centre 10px inside → dashed centre aisle from stage to bottom → 8 numbered tables (6 round 1–6, 2 square 7–8) mirrored either side of the aisle → summary row **below** the canvas: "18 tables" / "148 seated · 2 open" + "Auto-arranged" pill right | table 5, left column |
| 04 | **Vendors / match list** | Match sub-line "Matched to your date, budget & style" → card 1 Liwanag Florals ★4.9 with a **solid-wine "98% match" pill** (the only solid pill in the design) → card 2 Ilaw Lights "Verified" → card 3 Hantík Catering "Verified" (margin-bottom zeroed, terminal) | the first vendor card |
| 05 | **Guest List** | RSVP counters 142 Going / 8 Pending → 5 guest rows (avatar dot · name · status pill) → **just-arrived green highlight on the TOP row only** ("Going ✓") → ghost CTA "Send QR invitations", deliberately quieter than Clip 02's filled CTA | the top row's status pill |
| 06 | **Animated Monogram** | Monogram stage (M & J in a gold ring, radial cream backdrop) fills all height → confirmation caption "Your monogram is ready" + "Applied everywhere at your wedding" **below** the stage → application chips QR center · Save the Date · Signage · The Altar, centred wrapping row at the very bottom | the monogram itself |
| 07 | **payoff — no phone screen** | "she lowers the phone, turns, and walks the finished aisle" → SETNAYAN wordmark + "Set na 'yan." | — |

**Board furniture (never ships):** per-scene caption block (uppercase "Tap → …" · serif one-liner of
what happens **in the room** · "Builds in the room:" state line · build-status flag pill), and the
footer honesty note. **Tap indicators are storyboard annotation — they must never reach the app.**

**The design's own honesty ledger** lives in those flag pills, and it is where the one bad price
sits: Clip 06 reads "Live · **₱1,999**". Also amber-flagged by the design itself: Clip 04 is demo
vendors — *"present it as the vision, not a live directory."*

---

## 8 · OPEN DECISIONS

> ⚠️ **These have been sitting unanswered inside artifacts.** Two of the three surfaces below were
> already decided elsewhere and the artifact never caught up — that is exactly why they were
> invisible. **Only ONE genuinely open owner question survives.**

| # | Surface | Question the design asks | Design's own recommendation | Status |
|---|---|---|---|---|
| 1 | **Event home** | A, B, both, or C? | "Ship A and B together; leave C alone." They answer two different questions — the nudge tells the couple something they don't know and removes itself; the tile answers *where it stands*, forever | ✅ **ANSWERED — owner picked BOTH on 2026-07-30. Do not re-ask.** |
| 2 | **Event home** | What should the tile count before anyone shoots — shots, or cameras? | Lead with shots, flip to photos-gathered the moment the first lands | ✅ **ANSWERED — shipped exactly that; the code cites "owner default, PR-G question 2"** |
| 3 | **Event home** | Does the Papic nudge wait behind the set-date nudge? | Yes — set-date first, Papic once it's gone or the date is set | ✅ **ANSWERED — the nudge is gated on `event.event_date` being set** |
| 4 | **Live Studio overlay** | Full-screen SETNAYAN mark (overlay IS the paywall) or POWERED BY lower third (publish gate is the paywall)? | The lower third — "a free single-cam stream is unwatchable → contradicts the *Single-camera livestream — free* promise on your live pricing page" | ✅ **CLOSED the same day.** § 4f ① retired the full-screen mark; the design's recommendation won. Owner: *"yes we have a free single camera."* |
| 5 | **Live Studio overlay** | What does ₱2,999 actually buy — 24 hours from first go-live, or unlimited forever? | Explicitly **handed to the owner**, with one element recommended regardless: *"That 'never interrupt a running broadcast' rule is excellent either way — worth keeping."* | ✅ **CLOSED with a THIRD option neither card offered: ONE EVENT-DAY anchored on first go-live, EXTENDABLE at another ₱2,999, never cut off mid-broadcast.** The never-interrupt rule was carried forward verbatim |
| 6 | **Live Studio overlay** | The generosity check — a Filipino wedding runs across days; is unlimited more generous than intended at ₱2,999? | design declines to decide | ✅ Answered by #5 |
| 7 | 🔴 **Commercial film** | **Clip 01 production method — record the real Overview screen, or rebuild it as a 1:1 mock?** | none given — the design leaves it genuinely open | 🔴 **THE ONE REAL OPEN DECISION IN ALL TEN ARTIFACTS.** It is also now harder than when it was asked: the shipped nav no longer matches what the storyboard drew, so "record for real" produces a different screen than the board |

**Questions the designs do NOT ask but a port forces (flagged here, not decided):**

| Surface | Forced question |
|---|---|
| Guests | Plus-ones: the design specifies up to **two, individually named**; the schema allows **one**. Building the design needs a migration |
| Guests | Bulk bar: Mark Confirmed · Print QR pack · → Seat plan have no shipped counterpart — build or drop? |
| Guests | ⌘K command palette on the couple side does not exist (and is decorative in the design too) — unbuilt idea, not a regression |
| Vendors | Is the fee note's "0% commission" wording allowed to ship at all, given the never-say-commission lock? |
| Vendors | Booth Studio ₱1,500/28d appears **twice** on one page for an unshipped SKU, and the figure was not found in a catalog seed — verify before it goes public |
| Live Studio | "Up to 12 cameras" is unsourced. The only two real numbers are `GUEST_PICK_MAX_VIEWERS_PER_CAMERA = 3` and a pool channel's `concurrent_cap` (default 4), neither of which is a camera limit |

---

## 9 · STALENESS — what these designs assume that is no longer true

### 🔴 Money — never port a number from any of these files

| Where | Says | Truth |
|---|---|---|
| `payment_flow` step 01 (vendor lane) | 5% of ₱120,000 = **₱6,000** | Taper: 5% first ₱100k · 1% above ⇒ **₱5,200**. The file is dated **one day** before the lock |
| `for_vendors_2026-07-24` deal grid + fee note | "a **flat 5%** on a closed booking" | Same taper. `lib/booking-fee.ts` names flat 5% as superseded history |
| `for_vendors_keep_100` ×3 places | "0% commission … **forever**" / "the only thing you ever pay Setnayan" | Booking fee is flag-dark, **not cancelled**. "0% commission" itself is correct and stays — "forever" is not |
| `for_vendors_keep_100` tiers | ₱9,999 / ₱24,999 / ₱49,999 yr typed into HTML | Read `vendor_billing_catalog`. Owner lock: prices from the admin page, never hardcoded |
| `for_vendors_2026-07-24` tiers | ₱1,000 / ₱2,500 / ₱8,000 typed in | Match today's values, but still must be **read**, not typed |
| `live_studio_roam` ×4 places | **₱3,500 per event-DAY** | **₱2,999 per EVENT**, one-time. Amount AND unit both changed |
| `phone_screen_mockups` Clip 06 | Monogram **₱1,999** | **₱1,000** (owner 2026-07-22). Two repricings stale — and the file's own footer falsely claims its prices come from `Pricing.md § 00` |

### 🔴 Things that no longer exist

| Design | Names | Reality |
|---|---|---|
| `live_studio_roam` | route `/studio/live-studio-roam` (+ `/setup`) | **No such directory.** Shipped: `/studio/live-studio-control` |
| `live_studio_roam` | SKU `LIVE_STUDIO_ROAM` | `is_active=false`, folded into one `LIVE_STUDIO` SKU (migration `20271001110000`). Cast/`PANOOD_SYSTEM` retired separately |
| both vendor designs | route `setnayan.com/for-vendors` | 308-redirects to `/vendors` since 2026-07-05 |
| `for_vendors_keep_100` | lead tokens, packs, "burn a token to answer" | **Retired to zero** (owner 2026-07-21, executed 2026-08-07). Answering is FREE |
| `guests_living_roster` | Build ▸ Invite ▸ Confirm ▸ Seat ▸ Day-of stage strip | **Explicitly retired** in `page.tsx` |
| `guests_living_roster` | capture-bar Add/Find mode toggle | Retired — Find lives in the facet bar's query row |
| `papic_event_home` | `today/page.tsx`, `for-you/page.tsx` | Redirect stubs. (The design already says so — its own scope correction is TRUE) |
| `phone_screen_mockups` Clip 01 | nav: Today · Guests · Vendors · More | **Overview · Guests · Marketplace · Suite/Studio.** No "More" tab |

### 🟠 Things that moved off the page

`guests_living_roster` claims *"Every action here happens on this one page."* Three no longer do:
**Invite link** → `/guests/invite` · **self-join "Needs you"** → `/guests/claims` · **Day-of** →
`/guests/checkin`.

### 🟠 Palette — every single design predates the lock

| Design | Ships | Lock (2026-08-01) |
|---|---|---|
| `for_vendors_keep_100` | wine `#5A1E2D` + blue `#24597F` + dark mode + **a user-facing theme toggle** | terracotta, **LIGHT-ONLY**: cream `#FDFBF7` · ink `#2C2A29` · CTA `#C24E25` · gold `#A9834B` · link `#3B4E67` |
| `for_vendors_2026-07-24` | gold `#9A741A` + full dark mode | same |
| `payment_flow` | gold `#9A741A` + cream `#F1ECE0` + dark mode | same |
| `floor_plan` | ink `#1E2229` / gold `#C5A059` / sky `#5b90ad` + Light/Dark toggle | same |
| `guests_living_roster` | old "Clean Editorial" gold `#C5A059` + dark tokens (its own footer says so) | same |
| `phone_screen_mockups` | wine `#7A1F2B` + gold `#B0894C` + dark mode | same |

**Only exception:** the Live Studio **control room** is deliberately dark and that is locked — *"the
app stays cream; the control room earns the night."*

### 🟠 Outward claims that need checking before they go public

- `for_vendors_keep_100` verification checklist item **"SMS one-time passcode"** — **no SMS in V1.**
  The other 11 items (AMLC screening, bank micro-deposit, 15-min video call, 3–5 references,
  liveness, reverse-image search) plus "3–5 business days", "10 free couple unlocks/week",
  "sub-4-hour priority support", "Demand Pulse" (corpus name: **Demand Radar**), "AI Proposal
  Builder", "Reverse-image theft monitoring" — **none verified against `/admin/verify`.**
- `for_vendors_2026-07-24` Enterprise **"API access"** — no public API endpoints in V1.
- `for_vendors_2026-07-24` hero omits **verified** from the first-5-free promise.
- `payment_flow` first-5-free callout says "booked customers" — the rule is **sourced** bookings.
- `for_vendors_keep_100` footer cites **RA 11967** as the basis for not holding vendor money — legal
  copy is opened for review, never auto-merged.
- `phone_screen_mockups` footer: "no real vendors have signed up yet" (prod has 2, both hidden) and
  "the Merkado build-solver is prototype only" (Merkado is now the shipped Marketplace tab and the
  solver is real code) — **re-decide whether Merkado should now appear in the film.**

### 🟠 Two composition claims contradicted by shipped code

- `papic_event_home`: "responsive at 3 / 2 / 1 columns, so nothing is displaced" — shipped bento is
  `grid-cols-2`, `MAX_MINIS = 4`, **Messages yields**.
- `live_studio_control`: overlays composited WYSIWYG on the CH 1 monitor — they are **DOM layers on
  the program route**; the monitor is a rehearsal.

### ⚙️ Nothing in Live Studio is sellable today

`LIVE_STUDIO` is flag-dark behind `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED`, name-excluded from the
customer catalog, both per-day Cast SKUs are retired, and prod has **zero livestream channels ever
created**. The **free single-camera livestream** these designs defend is untouched and still promised
on the live pricing page. Vendor booking fees likewise charge **nothing** today
(`NEXT_PUBLIC_BOOKING_FEE_ENABLED` off; 0 fee charges against 13 booked vendors).

### 📄 File hygiene

- Nine of the ten saved `.html` files retain claude.ai's injected `<!-- frame-runtime -->` preamble
  (~11–15 KB of minified host code in `<head>`). **The design proper begins at the `<title>` tag.**
  Strip the preamble if a file is ever opened as a standalone prototype.
- `papic_event_home_placements_2026-07-30.html` **duplicates**
  `06_Prototypes/Papic_Home_Presence_2026-07-30.html`. Delete the new copy or cross-reference it.
- `floor_plan_tables_vendors_2026-07-10.html` carries **no date anywhere in its source** — the
  filename date came from the import instruction, not the artifact.

---

## 10 · How to use this map

1. **These are BINDING designs to PORT FROM, not to redraw.** A delta between a shipped screen and
   its design is a **defect in the port**, not a fresh design decision.
2. **RECONCILE, NEVER REDRAW.** Every design here is correct about **composition** and wrong about
   **colour** (and often about price). Take the layout; take the palette from the lock.
3. **Check the build state at the top of the section before you write a line.** Four of these ten
   surfaces already ship in full. Rebuilding one is the paid-twice mistake.
4. **Where a design names an insertion point, use it verbatim** — there are only three in the whole
   corpus (`miniTiles`, `slotAfterBento`, the cockpit decisions list). Everything else says **"not
   stated"**, which means the design genuinely names no file. **Do not guess one.**
5. **Never lift a number.** Prices, fee rates, table capacities, camera caps and shot counts must be
   **derived** from the catalog or the code. Every price in every one of these files is either stale
   or hardcoded against an owner lock — usually both.
6. **Where two designs cover one surface, the later one is not automatically right** — `/vendors` has
   three designs and the *shipped* one is none of them.

---

*Compiled 2026-08-08 from 10 imported Claude Design artifacts. Sources: `prototypes/`.
Related: `WHATS_NEXT_Design_Programme_2026-08-01.md` (the 19 approved archetypes),
`Live_Studio_Unified_Spec_2026-07-25.md` (§ 4b–4g, the corrections above), `Pricing.md § 00`.*
