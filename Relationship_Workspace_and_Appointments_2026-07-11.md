# Relationship Workspace + Appointments — design spec

> Dated 2026-07-11. The unified two-sided vendor↔couple workspace (chat-first, tabbed) + a category-aware Appointments system. Companion to the proposal maker ([`Vendor_Proposal_Maker_2026-07-10.md`](Vendor_Proposal_Maker_2026-07-10.md)) and the connection build plan ([`Vendor_Customer_Connection_Build_Plan_2026-07-10.md`](Vendor_Customer_Connection_Build_Plan_2026-07-10.md)). Theme: shipped "Clean Editorial" — ivory paper, obsidian ink, champagne-gold, Cormorant Garamond serif; mulberry primary. **Design-only — not built.**

## The model

Every vendor↔couple relationship is **one two-sided page**, mirrored:
- Vendor's side = the **Customer Card** (`/vendor-dashboard/clients/[eventId]`).
- Couple's side = the **Vendor Workspace** (`/dashboard/[eventId]/vendors/[vendorId]/workspace`).

Three navigation layers:
1. **Inbox** — the list of all customers (vendor) / vendors (couple). Navigation only, not the profile.
2. **Card lands on Chat** — opening a relationship shows the conversation under a thin context header; it is NOT a separate summary screen before chat.
3. **Tabs** — Chat · Quote · Payments · Files · Call · Details.

**Activation:** the thread exists from **inquiry-accept** (vendor spends **a flat 1 token** via `unlock_vendor_event` — owner-locked 2026-07-11, uniform across all locations). **Sending the quote promotes** the thread to the full workspace (surfaces the card in the couple's Vendors list + the vendor's Clients list). Some tabs populate later — Payments' dated plan fills at **lock**.

## Landing = context header + chat

- The card opens to the **live chat** (the built thread already inlines the quote card, payment prompts, pax surcharge as chat events).
- A **context strip** is pinned above it — each side shows *its own next action*: vendor sees "awaiting their lock · ₱13,500"; couple sees a **Lock** button. Desktop shows it as a persistent right rail; mobile as a one-line header.

## Tabs

### Chat — built
Realtime, both sides (`chat_messages` + Supabase Realtime). File sharing in the composer is the one gap (see Files).

### Quote (+ modifications) — built + enhancement
The proposal maker (separate spec). Send = `vendor_proposals` row + `chat_messages.proposal_id` card. Modifications = re-quote (fresh proposal) + change orders (`vendor_change_orders`).

### Payments — BUILT + two-sided (core), enhancement (crew credit + tab UI)
- Couple reads the plan and acts; vendor confirms. Both read `event_vendor_payment_plan` (`fetchPlanProgressForCouple` / `fetchPlanProgressForVendor`).
- Couple `logPayment` → `event_vendor_payments` (+ receipt `proof_r2_key`) → notifies vendor → vendor `confirm_vendor_payment` → installment flips **pending → paid on both sides**. States from `computeStepper` (due / pending / paid). PR 1 (shipped) seeds the plan at lock.
- **Progress summary** (paid / pending / due bar), the **installment stepper**, **how-to-pay** (`vendor_payment_methods` — BDO/GCash/etc.), **receipt upload**, and the **crew-meal credit shown on the final installment** (per the proposal-maker rule). Trust footer: off-platform · vendor confirms · 0% commission.

### Files — to build
Attach any file (photo/PDF/doc) in the thread → R2 (`uploadPublicAsset`, matching the handover precedent). New attachment columns on `chat_messages`.

### Call — to build (free P2P)
Ad-hoc voice/video reusing the demo transport (`lib/call-webrtc.ts`, perfect-negotiation over `call:{room}`, STUN-only, ₱0 — same as the demo). Voice = mic only; video = camera+mic; mid-call camera toggle. Gated to accepted threads; rung via `emitNotification`.

### Details — the this-event profile hub — to build (as the tab)
- **Quick-action bar** at the top: Chat · Files · Call · Video · **Quote** (Quote emphasized in mulberry). Payments stays a tab (a view, not an action).
- **Scoped to this event only** — request (pax · hours · location), services requested, locked vendors, mood board, downpayment-to-lock — all from `event_vendors` + the event. No other event's details bleed in.
- **Returning-client marker** — "worked together N×" (the existing returning-client signal = count of prior `event_vendors` bookings between this vendor + this couple; drives the 1-token accept). A **Past events together** list names each prior booking and **links to its own card**.
- **Private notes** — vendor-org-only CRM (`vendor_client_notes`), invisible to the couple.
- The couple's mirror Details = the vendor's profile + the same "booked them N×" history, minus private notes.

## Appointments system (generalizes "video meeting")

A single appointments feature — some in-person, some online.

- **Modes:** In-person · Video · Voice.
- **Types are category-aware** — driven by the vendor's service category (`Feature_Access_By_Vendor_Category` taxonomy). Each vendor sees the types that fit their category.
- **A "Custom" option is ALWAYS available — to both the vendor AND the couple.** Selecting Custom reveals a free-text "Name this appointment" field (+ mode, location/date/time), so any bespoke meeting the taxonomy doesn't cover can still be scheduled. Custom is never hidden by category; it sits alongside the presets on every scheduler, both sides.
- **In-person** → carries a **location + Directions** (map link) + Add to calendar. **Video/Voice** → carries **Join** (the free P2P call), gated to open at `scheduled_at`.
- **Propose → confirm, either direction.** Vendor proposes from *their* free slots; couple proposes from the *vendor's* open slots (read from `vendor_calendar_blocks`) → the other side confirms or proposes a new time. Same pattern as `event_schedule_suggestions` / `vendor_change_orders`.
- **On confirm:** `.ics` entry + reminder email (0028; new `appointment_reminder` template). Lifecycle: proposed → confirmed → done.

### Category → meeting map (seeds `appointment_type_catalog`)

| Service | Appointment types (in-person = 📍, online = 🎥) |
|---|---|
| Photo & Video | Pre-shoot call 🎥 · Engagement shoot 📍 · Shot-list review 🎥 |
| Caterer | Food tasting 📍 · Menu consult 🎥 · Final headcount 🎥 |
| Venue | Site visit / ocular 📍 · Final walkthrough 📍 |
| Bridal couturier | Measurements 📍 · 1st fitting 📍 · 2nd fitting 📍 · Final fitting 📍 |
| Hair & Makeup | Makeup trial 📍 · Look consult 🎥 |
| Cake & pastry | Cake tasting 📍 · Design consult 🎥 |
| Florist / Stylist | Styling consult 🎥 · Mock setup 📍 |
| Coordinator / Planner | Kickoff 🎥 · Monthly check-in 🎥 · Final walkthrough 📍 · Rehearsal 📍 |
| Band / DJ / Musician | Song-list consult 🎥 · Sound check 📍 |
| Officiant | Counseling 🎥 · Rehearsal 📍 |
| Any vendor | Consultation 🎥 · Voice call 🎥 · + custom |

Couple's appointments list = the **union across all booked vendors** (tasting + site visit + fitting + pre-shoot call, each from the right vendor).

### New tables
- **`event_appointments`** — `kind (in_person|video|voice) · type · location · scheduled_at · duration · status (proposed|confirmed|done) · initiated_by`. (Generalizes the earlier `thread_calls` idea; video/voice rows carry Join, in-person carry location.)
- **`appointment_type_catalog`** — `category · type · default_mode · default_duration`, seeded from the map above; vendors add custom rows.

## Responsive + performance strategy

**Desktop — 3-pane master/detail:** inbox · conversation · persistent context rail (quote/payment/next-action + quick Call/Files). Context never lost; tools open in center or expand the rail.

**Mobile — one column, chat-first:** compact header with the single next-action button, scrollable tab strip, pinned composer. Tools (Payments/Quote/Files/Call/Appointments) **slide up as full-screen sheets** with back-to-chat — only one surface mounted at a time.

**Performance:**
1. **SSR the shell + context header + first message batch** — fast first paint; context strip = one cheap aggregate query.
2. **One realtime channel** (chat only); tools don't each subscribe.
3. **Every tool tab is code-split + data-fetched on open** (lazy) with a skeleton.
4. **The call is dynamically imported on tap** — WebRTC/media never ships in the initial bundle (critical on mobile).
5. **Virtualize** long lists (messages, files); **lazy-load thumbnails** from the R2 CDN at responsive sizes.
6. **Optimistic chat send**; **prefetch-on-intent** (payment due → prefetch Payments bundle).
7. **Mobile mounts only the active surface**; **desktop keeps chat + rail** — same component, a **density switch** (compact desktop / comfortable mobile).

Net: on a phone the couple loads ~a chat screen's worth of JS to lock a vendor; editor/call code arrives only if those tabs open.

## Built vs. to-build

- **Built:** Chat (realtime, two-sided) · Quote/proposals + change orders · Payments plan + confirm round-trip (two-sided) · the underlying Customer Card + Vendor Workspace + returning-client signal + `vendor_client_notes` + `vendor_calendar_blocks`.
- **To build:** the **consolidation** (thread + workspace → one chat-first tabbed card per side) · **Files** tab · **Call** (free P2P, ad-hoc) · **Appointments** (in-person + scheduled call, category-aware) · Details-tab UI (action bar + returning marker + past-events links) · the proposal-maker enhancements (pricing basis on `vendor_package_items`, crew credit).

## Build plan (sequenced PRs)

1. **Consolidation shell** — merge the thread into the card as the default **Chat** tab; add the tab bar (Chat/Quote/Payments/Files/Call/Details) per side; SSR context header + first chat; lazy per-tab. Routing: couple home = Vendor Workspace, vendor home = Customer Card; thread becomes a tab.
2. **Details tab** — action bar (Chat/Files/Call/Video/Quote) + this-event profile + returning-client marker + past-events links + private notes.
3. **Files tab** — attachment columns on `chat_messages` + composer attach → R2 + render.
4. **Call** — `lib/call-webrtc.ts` ad-hoc voice/video, gated to accepted threads, rung via `emitNotification` (prototype already saved: `feat/thread-call-prototype`).
5. **Appointments** — `event_appointments` + `appointment_type_catalog` (seed the category map) + the scheduler (mode + category types + location/slots) + propose→confirm + `.ics` + `appointment_reminder` email; in-person = Directions, online = Join (reuses PR 4's call).
6. **Proposal-maker enhancements** — `pricing_basis` (+ per-pax/per-hour, crew/transport) on `vendor_package_items`; resolver vs pax/hours; crew-credit-to-final-payment.

(PR 1 of the connection plan — payment-plan default-seed at lock — already shipped as repo #3023.)
