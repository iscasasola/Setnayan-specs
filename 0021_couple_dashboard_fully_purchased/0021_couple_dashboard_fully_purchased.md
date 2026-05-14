# 0021 — Couple Dashboard, Fully-Purchased State

> **Purpose.** Visualize what a couple's event dashboard looks like 14 days before their wedding with **every paid Setnayan SKU active**. Pure preview — no new product surface is proposed; this validates that the 0000 app shell + every iteration that contributes to the dashboard renders cleanly in the maximal-purchase state.
>
> **Status:** drafted 2026-05-11
> **Companions:** `0021_couple_dashboard_fully_purchased.html` · `0021_couple_dashboard_fully_purchased.docx`

---

## 1. The scenario

Aira Reyes & Boy Delos Santos. Wedding date **November 15, 2026 at Tagaytay Highlands**. Today is **November 1, 2026** — T-14 days. They've already bought everything Setnayan sells.

### Active Setnayan apparatus

| SKU | Quantity | PHP | Status |
|---|---|---|---|
| Papic · 5 seats | 1 | ₱2,500 | Active — 5 of 5 claimed |
| Pro Camera Bridge | 2 grants | ₱3,000 | Active — 2 of 2 bound (Papic Seat #2 · Live Stream Cam #2) |
| Live Stream · Base | 1 | ₱2,500 | Active — broadcaster set |
| Live Stream · +1 Camera add-on | 2 | ₱2,000 | 5 camera slots total |
| Live Stream · +1 Hour add-on | 3 | ₱3,000 | 6 hours of stream capacity |
| Custom Monogram Pack | 1 | ₱2,000 | Active — event-wide flag ON |
| Broadcast Style Pack | 1 | ₱3,000 | Active — 4 modes available |
| LED Background | 1 | ₱599 | Rendering — USB ships T-7 |
| Invitation Widgets Pro Bundle | 1 | ₱200 | Active — all 3 widgets upgraded |
| AI Video Highlight (60s) | 1 | ₱2,000 | Queued — renders post-event |
| AI Edited Highlight (3-min) | 1 | ₱5,000 | Queued — renders post-event |
| Template Add-ons | 4 | ₱800 | 4 of 14 unlocked premade templates |
| **Total platform spend** | | **₱26,599** | |

### State around the wedding

- **8 vendors booked** — photographer, video, catering, HMUA, florals, lights & sound, mobile bar, coordinator
- **200 guests invited** — 156 RSVP'd attending, 21 declined, 23 still pending
- **76 guest face enrollments** complete (RSVP profile photos + portal uploads)
- **Mood Board** — palettes locked for all roles + venue
- **Seating Chart** — published, 12 tables, all 12 table QR tokens minted, print pack ready
- **Schedule** — 47 day-of timeline items + 14 upcoming vendor meetings in the next 14 days
- **Budget** — ₱712,400 vendor commitments + ₱26,599 Setnayan = **₱738,999 total**. ₱428,200 already paid. ₱310,799 remaining across 16 milestones (mostly final balances due T-7 to T-3)

This is what we want to render.

---

## 2. The 8 surfaces

The dashboard is event-scoped at `setnayan.com/dashboard/[event_id]/...`. Eight surfaces, all clickable in the prototype:

| # | Surface | URL section | What it shows |
|---|---|---|---|
| 1 | **Overview** (home) | `/` (event root) | Stage indicator, "what's next" cards, active apparatus, **QR codes & print packs**, **Planning artifacts**, activity feed |
| 2 | **Guest List** | `/guests` | 200 invitees as one continuous list with expandable group headers (Table / Role / Side / Custom). Mobile uses a bottom-sheet filter & sort popup. |
| 3 | **Vendors** | `/vendors` | 8 booked vendors. **Mobile uses a tap-to-expand card pattern** — see 2.2b below. Desktop shows the full card inline. |
| 4 | **Schedule** | `/schedule` | Day-of timeline + vendor meetings, .ics export |
| 5 | **In-App Services** | `/services` | Every purchased apparatus with active status, deep-link to management |
| 6 | **Seat Plan** | `/seating` | Published seating chart canvas + 12 table QRs + Print Pack download (12 MB PDF). **Desktop: tables show every chair with profile photo or side-coded initials (per 0008 chair-circle interaction rule).** Mobile: tables only — chairs are too dense to render usefully on a phone screen. Tap a table on mobile → bottom sheet shows that table's guests as a list. |
| 7 | **Landing Page** | `/invitation` | Couple's public landing page editor with widget toggles, theme settings, live preview, page-view analytics |
| 8 | **QR Hub** | `/qr-codes` | All 5 QR sets consolidated · TTL rules visible per set · re-mint / re-issue actions · Print Pack regen |
| 9 | **Gallery** | `/gallery` | All event media in 5 sections — Papic photos, Panood broadcast recording, Patiktok guest reels, Video Messages from the voice/video guestbook, AI Highlights (60s + 3-min). Pre-event = placeholder explainers; post-event = live media library with 7-day couple-review gate before guest unlock. |

Mobile uses the 4-tab bottom-nav from 0000 (Guests / Vendors / Schedule / Services). Surfaces 1 (Overview), 6 (Seat Plan), 7 (Landing Page), 8 (QR Hub), 9 (Gallery) are reached via Home cards or the **dashboard home icon** (see 2.0a below).

### 2.0a Home layout · Guided mode default · DIY toggle

Home is the daily-driver. Couples spend more time here than anywhere else. The layout is intentionally **calmer than a dashboard** — closer to a friend giving you the day's checklist than an analytics screen.

**Top-to-bottom order:**

1. **Warm welcome row.** "Good morning, Aira" + date + "14 days until you marry Boy in Tagaytay" in italic Cormorant. Right-side: **Mode toggle pill** — `✦ Guided · DIY`.
2. **Stage strip.** 6-stage lifecycle bar with the current stage highlighted. Labels under each pip. No "stage banner" wall block — just the strip.
3. **Hero · NEXT UP card.** ONE highlight: the most imminent thing the couple needs to do/attend. Tomorrow's walkthrough by default. Single CTA button + a soft "view full schedule" link. Gradient-accent background distinguishes it from everything else.
4. **Your wedding journey · step N of 9.** The Guided Planner checklist (see 2.0b). Steps 1–6 collapsed and dim if completed. Step 7 (current) expanded with mini-checklist + CTA. Steps 8–9 dim placeholders ahead.
5. **Continue planning · 8-tile navigation grid.** All 9 surfaces accessible from one grid: Guests · Vendors · Schedule · Services · Seat Plan · Landing Page · QR Hub · Gallery. Each tile shows a one-line metric ("156 ✓ · 23 pending").
6. **Recent activity.** Compact dashed-divider list. 4-5 most recent events.
7. **Setnayan Pay info card.** Small, one-line — opt-in convenience reminder, not a sales pitch.

**Removed from V1 Home** (moved to their proper tabs):
- Full "Active Setnayan apparatus" detail cards → Services tab
- "Add more to your event" upsell catalog → Services tab
- "Vendor pulse" ring row → Vendors tab
- "Vendor readiness" 6-row table → Vendors tab
- QR codes 4-tile section → QR Hub surface
- Planning artifacts 3-card section → represented in the new navigation grid
- "What's next" 3-card row → consolidated into the Guided journey current-step block + the NEXT UP hero

The result is a Home that scans in 3 seconds: hero · journey · grid. The detail still exists; it just lives where it belongs.

### 2.0b Guided Planner · the 9-step journey (locked 2026-05-14 as paid optional SKU)

**Access model updated 2026-05-14.** The 9-step Guided Planner journey is now an **optional paid SKU** with three pricing tiers, defined canonically in iteration 0016 § 0 and CLAUDE.md decision log entry of the same date. **DIY mode is the free default** for every event; Guided is the upgrade.

A wedding journey is a **9-step checklist** that maps to the 6 lifecycle stages:

| # | Step | Maps to stage | When |
|---|---|---|---|
| 1 | Set your date + venue | Discovery → Planning | Months 1–2 |
| 2 | Build your guest list | Planning | Month 2–3 |
| 3 | Send invitations | Planning → Confirmation | Month 4–5 |
| 4 | Book your core vendors | Confirmation | Months 4–8 |
| 5 | Plan your reception look | Confirmation → Final Prep | Months 7–10 |
| 6 | Set up Setnayan capture | Final Prep | Months 8–11 |
| 7 | Final-week confirmations | Final Prep | Last 2 weeks |
| 8 | Event day | Event Day | The day |
| 9 | Post-event | Wrap | Days 1–30 after |

### Three dashboard surface variants

The dashboard Home renders one of three states based on `events.guided_planner_status` (schema lives in iteration 0016 § 0):

**(A) DIY mode** (`guided_planner_status = 'diy'` · default for every new event):
- 10-tile grid + activity feed (no journey checklist)
- **Upgrade banner pinned at the top** of the Home surface with the savings ladder:
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │ ✨ Activate Guided Planner — your assistant for setting     │
  │    your plans in the right direction.                       │
  │                                                              │
  │    1-Week Pass · ₱99   │   3-Month · ₱999 (save 22%)        │
  │    12-Month · ₱1,999 (save 61%) BEST VALUE                  │
  │                                                              │
  │    [Compare plans →]   [Continue with DIY ✕]                │
  └─────────────────────────────────────────────────────────────┘
  ```
- Couples can dismiss the banner (state stored in `users.dashboard_dismissed_banners`); reappears every 14 days OR when wedding date < T-90 days OR after every checkout
- All 10 dashboard tiles fully functional — no feature gating on tools themselves
- Each step links to the relevant surface(s) for couples who want to manually use the navigation

**(B) Active Guided** (`guided_planner_status = 'active'`):
- 9-step journey checklist surfaced prominently on Home with the per-step states:
  - Completed: dim with checkmark + month it was completed
  - Current: highlighted with accent gradient + mini-todo list + CTA
  - Future: dim placeholder with the date it'll activate
- Each step links to the relevant surface(s) so couples can dive in without hunting
- Days-remaining strip in the header: "Guided Planner active · X weeks remaining" with [Extend] CTA
- When `guided_planner_expires_at - NOW() < 14 days` → renewal nudge banner appears

**(C) Expired Guided** (`guided_planner_status = 'expired'`):
- 9-step journey **still visible but greyed-out** (so couples can see progress they made + entice re-purchase)
- Reactivation banner: "Reactivate Guided Planner — ₱99/wk · ₱999/3mo · ₱1,999/12mo"
- All 10 dashboard tiles remain fully functional (same as DIY — no tool gating, just no active assistant layer)

### Schema

```sql
-- Defined canonically in iteration 0016 § 0; restated here for clarity:
ALTER TABLE events
  ADD COLUMN guided_planner_status TEXT
    NOT NULL DEFAULT 'diy'
    CHECK (guided_planner_status IN ('diy', 'active', 'expired')),
  ADD COLUMN guided_planner_tier TEXT
    CHECK (guided_planner_tier IN ('1week', '3month', '12month')),
  ADD COLUMN guided_planner_expires_at TIMESTAMPTZ;

-- 9-step journey state (kept as before — auto-populated whether DIY or Guided,
-- but rendered prominently ONLY in Guided/Expired modes; DIY couples see grid only):
CREATE TABLE event_journey_steps (
  event_id   UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  step_id    SMALLINT NOT NULL CHECK (step_id BETWEEN 1 AND 9),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (event_id, step_id)
);
```

The 9 rows are seeded when the event is created — even for DIY couples — so that decisions persist across mode flips. If a DIY couple completes Step 1 (sets date + venue) and then activates Guided later, the journey reflects the work already done. Steps auto-complete based on real platform actions (e.g., Step 3 marks complete when invitations have been sent + at least 1 RSVP recorded; Step 4 marks complete when ≥3 vendors are in Accepted or Active stage; etc.). Couples can also manually mark a step done or undo it.

**Note on the prior `users.planner_mode` column:** the 2026-05-14 lock supersedes the original "guided is default + opt-out to DIY" model. The state has moved from `users.planner_mode` (account-level) to `events.guided_planner_status` (event-level, since couples may run DIY on one event and Guided on another). If `users.planner_mode` exists in the live schema, it's now ignored / can be dropped.

---

### 2.0c Profile avatar = dashboard home shortcut

The couple's **profile avatar in the upper-right** of every app bar is the always-visible "jump to dashboard" affordance. Clicking it returns to the Overview / Home surface from anywhere in the app. A soft accent ring around the avatar signals it's interactive.

Desktop: 30px round avatar with initials (e.g., "AB" for Aira & Boy) — shown as a profile photo once the couple uploads one (face-enrollment image doubles as their profile photo).

Mobile: 22px round avatar with the same initials/photo.

The avatar is the profile picture by convention; tapping it doubles as both "this is me" identity and "take me home." No separate dashboard icon needed — keeps the chrome clean and matches the native-app pattern most couples already know.

---

## 2.1 QR token rules — per QR type (locked)

Rules are applied **per QR code, not blanket**. Each QR type has its own profile.

| QR set | TTL | No-password? | Regen cost | Time-locked usage | How-to video on activation | Pre-event connection |
|---|---|---|---|---|---|---|
| **Event Join QR** | event_date + 90 days | yes | free | — | — | — |
| **Table QRs** | event_date + 30 days | yes | free (re-publish idempotent) | — | — | — |
| **Personal guest QRs** | event_date + 90 days | yes | free | — | — | — |
| **Papic seat claim QR** | one-shot · consumed on claim | **yes** | **₱500 per regen** | **Nov 15 capture window** | **yes** | **yes** |
| **Patiktok access QR** | one-shot per guest · consumed on claim | **yes** | **₱500 per regen** | — (post-event 90 days) | **yes** | **yes** |
| **Panood broadcaster QR** | one-shot · consumed on claim | (not specified) | (not specified) | **6 hrs of purchased stream capacity** | **yes** | **yes** |

**Rules explained:**

- **No password.** For QR-based services, the QR itself IS the credential. No additional password gate.
- **Regen cost.** ₱500 per regeneration (proposed). Covers lost phone / lost place card / accidental QR leak. Revokes prior token.
- **Time-locked usage.** Service is accessible from the dashboard anytime, but actual usage is bounded to a specific window. Papic capture is the wedding day. Panood usage is bounded by the hours purchased (Aira & Boy have 6 hrs).
- **How-to video on activation.** When a QR is scanned for the first time, a short tutorial video plays explaining how to use that service. Video is per-QR (Papic operator sees Papic instructions; Patiktok guest sees Patiktok instructions; Panood broadcaster sees broadcaster console).
- **Pre-event connection.** Devices can pair / register before the actual time window opens. Status displays as "Connected · waiting for [window]." When the window opens, devices auto-activate.

**Two more rules baked in.** (a) No cross-event reuse: every token carries `event_id`; tokens from another wedding are rejected. (b) Print Pack regeneration: re-minting any printable QR auto-regenerates the Print Pack PDF; old PDF downloads still resolve but flag as "outdated."

---

## 2.2 Naming — Papic · Patiktok · Panood (the media trio)

Setnayan's media services use Filipino-coined names:

| Name | What it does | Locked behaviors |
|---|---|---|
| **Papic** | Native paparazzi capture (Papic = paparazzi) | Seat claim QRs, no password, ₱500 regen, capture-window time-lock, how-to video, pre-event connection |
| **Panood** | Live broadcast (Panood = "to watch") | Broadcaster QR, time-locked to purchased hours, how-to video, pre-event connection |
| **Patiktok** | Guest reel builder (Patiktok = tiktok-style reels) | Per-guest access QRs, no password, ₱500 regen, how-to video, pre-event connection |

---

## 2.2a Guest List · spreadsheet bulk-edit mode (locked)

The Guest List surface offers three view modes on desktop:

| Mode | Best for | Notes |
|---|---|---|
| **List · Card** | Reviewing seating, scanning RSVPs | Default. Continuous list, expandable group headers. |
| **List · Spreadsheet** | Bulk entry, paste from clipboard, batch updates | Google Sheets-style table. Live-synced via Supabase Realtime. Coordinator can co-edit. Cursor presence shown per editor. |
| **Seat plan view** | Visual seat-by-seat editing | Renders the seating chart canvas (see Seat Plan surface). |

**Synced co-editing.** Both couple and coordinator (when granted thread access per 0019) can edit the spreadsheet simultaneously. Each editor's active cell highlights in their assigned color (couple = accent, coordinator = groom blue). Last-write-wins per cell; conflicts surface a tiny "X edited this 2s ago" inline hint. No locking.

**CSV / Google Sheets bridge.** For couples who'd rather work outside the app: export the full list as CSV, edit in Google Sheets or Excel, import back. Setnayan matches existing rows by guest_id; re-imports update without duplicating. New rows flag as "pending review" before going live, preventing accidental garbage data. Paste-from-clipboard also accepts TSV directly.

**Mobile note.** Spreadsheet view is desktop-only. On mobile, the "Bulk edit" CTA points to: "Open this on your laptop or import a CSV from your phone." Mobile users do bulk entry via the CSV import flow, then refine on the spreadsheet on a larger screen.

---

## 2.3a Per-vendor 6-stage readiness tracker (locked)

Every booked vendor exposes a 6-stage progress bar. The vendor self-updates from their own dashboard; the couple and the coordinator have read-only view. State changes log to `vendor_stage_log` with `(vendor_id, event_id, from_stage, to_stage, actor_id, transitioned_at)`.

| # | Stage | Meaning | Typical timing |
|---|---|---|---|
| 1 | **Planning Locked** | Contract signed, milestones agreed, scope frozen | Weeks/months pre-event |
| 2 | **Preparing Materials** | Sourcing, prep, kit assembly | T-30 to T-3 |
| 3 | **Ready to Deploy** | Materials packed, team scheduled, ready to leave | T-1 to event morning |
| 4 | **Arrived On-Site** | Team checked in at venue | Event day |
| 5 | **Installing** | Actively setting up | Event day |
| 6 | **Ready for Event** | Setup complete, waiting for first guests | Event day, pre-guest-arrival |

**Where it's surfaced:**
- **Home (Overview)** — aggregate readiness summary: how many vendors at each stage (e.g., "5/8 at stage 2"). Updates in real time.
- **Vendors tab** — each vendor card shows the 6-pip strip + current stage label + last updated timestamp.
- **Coordinator** — sees the same data through their per-thread access (per 0019 spec) when granted by the couple.

**Why stages, not just payment.** Pre-event, the couple cares about money. Approaching the event, they care about readiness. Stage tracking is the readiness signal. The mobile design enforces this — on mobile the Vendors view leads with stages, not payments (see 2.3b).

---

## 2.3b Mobile vital-info rule (locked)

On mobile, every surface shows only the **currently-vital** information for the lifecycle stage.

| Lifecycle stage | What's vital on mobile | What's hidden on mobile |
|---|---|---|
| Discovery / Planning | Vendor name, category, payment progress | Stage tracker (vendors haven't started) |
| Confirmation / Final Prep | **Stage tracker · readiness focus** | Payment details (move to Budget surface) |
| Event Day | Stage tracker · live updates | Everything else |
| Wrap | Gallery state · download counts | Stage tracker (all done) |

Aira & Boy are in Final Prep (T-14). Mobile Vendors view shows: vendor name + category + **6-pip stage bar + current stage label**. Payment info is one tap away in Budget surface, not on the vendor list.

Desktop carries fuller detail (stage + payment + meetings + chat) because the larger viewport supports it; mobile triages aggressively.

---

## 2.3c Vendor ingress / egress (locked)

Vendors don't just have a "service window." On event day each vendor has:

- **Ingress** — when they arrive on-site and start set-up. Begins hours before the service window for installer-heavy vendors (florals, lighting, catering).
- **Service window** — when their service is actually live to guests.
- **Egress** — when they tear down and leave. Often runs past midnight for sound/lights/catering crews.

Aira & Boy's ingress/egress table (modeled in the Schedule surface) shows total on-site time per vendor — useful for venue load-in coordination, vendor parking allocation, and crew-meal headcount. Coordinator surfaces this prominently; couple sees it as reference.

**Schema.** `vendor_event_window(vendor_booking_id, ingress_at, service_start_at, service_end_at, egress_at)`. Per-event so vendors with multiple wedding dates carry independent windows.

---

## 2.3d Extend-hours / extend-units for time-locked services (locked)

Couples can buy more capacity for time-locked services **continuously and at any time** — not just at initial purchase:

| Service | Extension SKU | Unit price | Notes |
|---|---|---|---|
| **Papic** | + Seat (₱500) · + Extra Day (₱500) | per unit | Day-extension widens the capture window beyond Nov 15 (rehearsal-dinner shoots, post-wedding brunch) |
| **Panood** | + 1 Hour (₱1,000) · + 1 Camera (₱1,000) | per unit | Already in V1 spec; surface the buy-more button on the active service card |
| **Patiktok** | + Extend reel window (₱500) · + Template (₱200 each) | per unit | Default reel window is event_date + 90 days; extension pushes the deadline back 30 days |
| **AI Highlight** | + Another render (₱2,000 / 60s or ₱5,000 / 3 min) | per unit | Multi-purchase by spec |
| **Pro Camera Bridge** | + Grant (₱1,500) | per unit | Adds another bound DSLR slot |

Surfaced in two places: the Active services section on Home (per-card "Extend" CTAs) AND a dedicated "Upgrades available" section on the Services catalog. Same apply-then-pay flow as the original purchase.

---

## 2.3e "Upgrade to ___" prompts (locked)

For couples who haven't bought the highest tier of a tiered service, the Services catalog surfaces the next tier with an Upgrade CTA. Examples (when applicable):

- **Papic 3-seat purchased** → "Upgrade to 5-seat · +₱1,000" / "Upgrade to 8-seat · +₱2,500"
- **AI Video Highlight (60s) purchased** → "Upgrade to AI Edited Highlight (3 min) · +₱3,000"
- **Pro Bundle purchased** (top widget tier) → no upgrade; show "Already at top tier"
- **No Live Stream purchased** → "Add Panood Base · ₱2,500"

Future SKUs that don't yet exist in V1 (Photo Book printing, photojournalism, etc.) show as "Notify me" coming-soon cards in the same upgrade list.

In Aira & Boy's case the prototype displays the upgrade catalog regardless — even though they have every base SKU, multi-purchasable extensions (more seats, more hours, more grants) always show as upgrade paths.

---

## 2.4 Deferred — built into the Vendor iteration (0022)

The following four mechanisms surface but are not yet built in this couple-facing prototype. They land in iteration 0022 (the vendor dashboard prototype):

### 2.4a Vendor Pro · weekly subscription (not per-event)

Vendor accounts are free during launch (per the locked 0015 memory). Post-launch, vendors who want Pro features (in-app scheduler, multi-service calendars, in-app payments + QR retrieval) subscribe **by the week, not per event**.

- A photographer running 10 weddings in one week pays for **one week of Pro** — covers all 10 events.
- Subscription auto-renews weekly; vendor can pause anytime; charged weeks include unlimited events.
- Photography teams, stylists, ateliers, planners, and any other vendor type can subscribe under the same Pro tier.
- Free vendors (non-Pro) retain basic visibility on the marketplace + chat with couples + accept bookings — but skip the Pro scheduler / multi-service calendar / QR-per-guest retrieval features.

### 2.4b One calendar per service for multi-service vendors

A vendor offering, e.g., "Wedding Documentary," "Prenup Shoot," and "Engagement Session" gets **three separate calendars** — one per service — plus a unified master view. Each service-calendar shows that service's bookings, blocks, and lead-time requirements. Premium-tier feature; non-Pro vendors get a single combined calendar.

### 2.4c In-app crew & teams — fixed rates with deductions

When Setnayan provides crew/personnel through the app (operators-for-hire, second photographers, on-call broadcasters, etc.), pricing follows a fixed-rate structure:

- **Per-project rate** — fixed amount the couple pays for the crew member
- **Per-extension rate** — fixed hourly rate for extending the engagement
- **Tax %** — withholding tax deducted from the crew member's share (PH BIR rules)
- **In-app service % ** — Setnayan's cut, deducted from the gross
- **Crew net payout** — what the crew member actually receives, calculated as `gross − tax − in_app_fee`

Schema: `crew_member(rate_per_project_php, rate_per_extension_hour_php, tax_pct, in_app_fee_pct, active)`.

### 2.4d QR-as-a-service for vendor types beyond V1

Photography teams, stylists, ateliers, florists, and any vendor needing per-guest QR retrieval (e.g., florist wanting to scan-and-deliver each guest's table bouquet) can opt into using Setnayan's QR infrastructure. They apply via the vendor dashboard; the corresponding Pro fee covers their use. Each scanned QR lookup runs through Setnayan's auth and event-scoping rules — no cross-event reuse.

---

## 2.2b Mobile Vendor Card pattern (locked)

**Collapsed card** (default state in the Vendors list):

- Photo on the left · 72×72 square · vendor cover image
- Three rows beside the photo:
  - **Category** (DM Mono small caps, accent color — e.g., PHOTOGRAPHY · DOCUMENTARY)
  - **Vendor name** (bold body)
  - **Contact person** (regular, ink-soft)
- A small "**Date: (task)**" pill **below the photo** — the next appointment / scheduled task with this vendor (e.g., NOV 10 · Walkthrough)
- Chevron `▾` on the right hinting at tap-to-expand

**Expanded card** (tap to open inline):

- Same header row at the top
- **Progress bar** — the 6-stage vendor readiness tracker, with current stage label + last-updated timestamp
- **Payment bar** — visual percent bar with amounts (₱X / ₱Y · N% paid · status)
- **Four action buttons** in a single row:
  - `📞 CALL` — dials vendor's mobile number
  - `💬 CHAT` — opens the chat thread (per 0019)
  - `📹 MEET` — starts/joins a video meeting (Daily.co)
  - `👁 VIEW` — opens the dedicated Vendor Profile screen

The card is the touch-zone for the whole interaction. Only one card expanded at a time on mobile.

## 2.2c Vendor Profile screen (opened by tap VIEW)

A dedicated detail screen for one vendor. Five blocks stacked:

1. **Hero** — large round vendor photo, category eyebrow, vendor name (display font), contact person, certified / years badges
2. **Communication row** — 3 buttons: CALL · CHAT · MEET
3. **Documents &amp; payment row** — 3 buttons:
   - `📄 View contract` — opens the signed PDF
   - `📎 View files · N` — opens the thread file shelf
   - `💰 Make payment` — shown only when balance &gt; 0 · displays due date + amount · routes to next-milestone payment flow
4. **Package carousel** — every package this vendor is providing for this event, side-by-side swipeable.
   - Each package card shows: package eyebrow (PACKAGE N · TYPE), package name (display font), and a **tappable price button** that reveals the inclusions list
   - Multi-service vendors (e.g., a photographer providing Wedding Day + Prenup) show multiple cards · carousel dots indicate position
5. **Booking history / activity log** — append-only timeline of every action on this vendor relationship:
   - `BOOKED` · initial booking + package + amount
   - `REVISION` · scope changes
   - `PAID` · each milestone payment with date + amount
   - `ADDED` · additional packages or inclusions
   - `UPDATE` · stage transitions (vendor self-reported)
   - `SCHEDULED` · meetings + on-site activities
   - `DUE` · upcoming payments / deadlines

Schema-wise, the activity log reads from `event_activity_log WHERE vendor_id = $1 ORDER BY created_at` — same audit log we use everywhere else, filtered to this vendor.

---

### Refund / dispute menu on the vendor detail view (locked 2026-05-12)

When a customer opens a booked vendor's detail page, the "..." menu at the top-right contains (in addition to existing options):

- **Request a refund** → opens a modal:
  - Reason picker (Vendor didn't deliver / Quality issue / Force majeure event / Mutual cancellation / Other)
  - Free-form description (required, min 50 chars)
  - Evidence upload (optional photos / files)
  - Refund amount requested (defaults to amount paid; customer can specify partial)
  - Submit → creates a row in `dispute_resolutions` (see 0023 schema) with `cause = 'refund_request'`, `status = 'pending_mediation'`
  - Notifies vendor immediately (in-app + email via 0028) — vendor has 48 hours to respond before escalating to Disputes Handler
- **Open a dispute** → similar modal but with `cause = 'general_dispute'` (used for non-refund disputes like contract terms, vendor behavior, etc.)
- **Flag force majeure** → opens the dedicated force-majeure flow specced in 0019 § Force majeure flag flow — handles natural disaster / illness / venue cancellation reschedule paths via a 4-option mediation modal (Reschedule / Partial refund / Full refund / Switch vendor), with 7-day auto-escalation to the Disputes Handler if no agreement is reached
- **Mediation history** → if there's an open or resolved dispute, opens the chat thread that Setnayan's Disputes Handler joined

Mobile parity: same menu, condensed via the existing `...` overflow pattern.

---

### Exclusive offer row on customer's vendor detail (locked 2026-05-12)

Mirror the marketing-site exclusive-offer surface (0015) on the customer's vendor detail card inside their dashboard. When the customer has selected a vendor and is reviewing the bundle, the exclusive offer appears prominently as a tinted row inside the service detail card. Already-booked customers see "✓ Setnayan Exclusive applied" badge.

---

## 2.2d Review-visibility rule (locked)

Reviews behave differently in different contexts. The rule is **when the review serves a decision**, show it. **When it serves no decision**, hide it.

| Surface / context | Reviews visible? | Why |
|---|---|---|
| **Marketplace · Discovery (pre-book)** | ✅ Yes — couples need them to evaluate | Reviews help the couple decide which vendor to book. Show ratings, distribution, sample reviews, "all reviews →" |
| **Booked vendor · planning stage** (Discovery → Final Prep) | ❌ **No** — hide both reviews and review prompts | Couple has already committed. Showing past reviews now adds anxiety without serving a decision. Showing future-review prompts is premature. |
| **Booked vendor · Wrap stage** (event_date &lt; today) | ✅ Yes — both reviews and "leave a review" prompt | Couple is now the reviewer. They see Mariposa&apos;s existing reviews + their own "Review your wedding vendors" prompt. |
| **Vendor side · 0022** | Always visible | Vendors see their own rating + recent reviews on their dashboard regardless of any single event&apos;s stage. |
| **Admin side · 0023** | Always visible | Admin sees all reviews for moderation purposes. |

**Implementation:**

```sql
SELECT * FROM vendor_reviews
WHERE vendor_id = $1
  AND (
    $context = 'marketplace_discovery'        -- always show on marketplace
    OR $context = 'vendor_dashboard'          -- vendors always see their own
    OR $context = 'admin'                     -- admin always sees
    OR ($context = 'booked_vendor_view' AND $event_stage = 'wrap')
  )
```

In Aira &amp; Boy's current state (T-14, Final Prep), the Vendor Profile screen shows NO reviews and NO review-request prompt for Mariposa Bloom. They&apos;ll automatically appear on Nov 16 (event_date + 1 day) when the event flips to Wrap stage and the cron sends the review request.

The same rule applies to all 8 of their vendors: review surfaces stay quiet during planning, then activate together post-event.

### 2.2d.i Self-review block (locked 2026-05-15)

The visibility rule above governs **who can SEE reviews**. A separate rule governs **who can WRITE a review** — vendors (or their team members or their related accounts) cannot review their own services. Closes the fake-review fraud vector that opens up when a customer becomes a vendor and keeps their customer account (see CLAUDE.md decision log 2026-05-15 + iteration 0006 § "Dual-role customer ↔ vendor — review gate").

| Reviewer ↔ vendor relationship | "Leave a review" CTA | Why |
|---|---|---|
| Reviewer = vendor's `owner_user_id` | **Disabled** with hint *"You can't review your own services"* | Owner cannot self-review their own catalog. |
| Reviewer ∈ `vendor_service_agents.member_id` | **Disabled** (same hint) | Team members cannot review the vendor they work for. |
| Reviewer shares payment method / device / household with vendor owner | **Disabled** (same hint) + **Appeal** sub-link to 0023 Help inbox | Catches the vendor-creates-customer-alt fraud pattern. Filipino households legitimately share GCash / devices / addresses, so the appeal path lets admins override-publish coincidental matches (single-admin authority). |
| Reviewer has no related-account match | **Enabled** at Wrap stage per § 2.2d above | Standard flow. |

**Implementation.** Enforced at three layers (schema CHECK + trigger / API `403 SELF_REVIEW_BLOCKED` / UI disabled CTA) — see iteration 0006 Reviews schema for the SQL.

In Aira & Boy's current state, the gate is invisible — neither is a vendor's owner or team member, and the related-account signals don't match Mariposa Bloom's owner. The disabled-CTA path only lights up when a Setnayan customer is ALSO operating a vendor account on the same platform.

---

## 2.3 The Services vs Home rule (locked)

- **Services tab** is the **catalog**. It's where couples **avail of new services** (browse + apply). Each SKU shows price, status (Active / Available to apply), and the appropriate CTA.
- **Home (Overview)** is where **availed products live**. Every active service shows up here in full detail — grouped by category (Capture & broadcast / Branding & styling / AI & physical / Patiktok & templates).

In the prototype, Aira & Boy have availed of everything, so every Services tile shows "Active · Manage" and the full detail lives at the top of Home.

---

## 3. Overview surface — the "everything is humming" view

This is the most opinionated screen in the dashboard. It's the daily-driver — the couple lands here when they open Setnayan, and it tells them, in order of importance:

### 3.1 Lifecycle stage banner

A single horizontal strip across the top showing the 6 wedding stages (see 0022 spec for full definition). Current stage **highlighted in accent**: **Final Prep** (T-30 to T-1). Days remaining: **14**.

### 3.2 "What's next" cards (3 cards)

Algorithmically surfaced based on what's not yet done + what's deadline-imminent. For Aira & Boy at T-14, the three cards are:

1. **Send reminders to 23 pending RSVPs** — opens Guest List filtered to pending. (CTA: "Send reminder email")
2. **Confirm Mariposa Bloom payment milestone #3 (₱30,000 balance) — due Nov 8** — opens Budget. (CTA: "Mark as paid")
3. **LED Background USB ships in 7 days — confirm venue contact** — opens Services > LED. (CTA: "Add venue tech contact")

These cards are dynamic — they shift as items complete.

### 3.3 Active apparatus summary

A compact strip of 5 tiles representing every active Setnayan apparatus, with a status microcopy on each. Clicking a tile deep-links into its management surface.

- **Papic** — "5 seats · all claimed · 76 face vectors cached"
- **Live Stream** — "5 cams · 6 hrs · style pack ON"
- **Branding** — "Monogram active · A & B"
- **LED** — "Rendering · USB ships T-7"
- **AI Highlights** — "Queued · 60s + 3-min"

A small "₱26,599 in Setnayan apparatus" total appears below the strip.

### 3.4 Vendor pulse

8 booked-vendor avatars across one row, each with a tiny progress ring showing % of milestones paid. Click any avatar → vendor detail.

### 3.5 Recent activity feed

The last 8 entries from `event_activity_log` for this event. Examples:

- "Mariposa Bloom confirmed prenup date · 2 hr ago"
- "Lia Pascual claimed Papic seat #4 · 6 hr ago"
- "Ramon Cruz RSVP'd attending · yesterday"
- "Live Stream broadcaster invitation sent · yesterday"

This is the couple's audit trail — exposed in a friendly format.

### 3.6 Quick actions row

Six pill buttons at the bottom: "Send a reminder," "Add a guest," "Add a vendor," "Open chat," "Download print pack," "View Live Stream embed."

---

## 4. Per-tab content (fully-loaded state)

### 4.1 Guest List

Three filter chips at the top: **Attending (156)** · **Declined (21)** · **Pending (23)**. Search box. Below, a 3-column-ish list (chair avatar, name + role, RSVP state) ordered by table assignment. Profile-photo avatars where face enrollment is done; initials-with-side-tint where not.

Bulk actions row: select N guests → "Send reminder," "Add to table," "Export contact list."

### 4.2 Vendors

8 vendor cards, each showing: business name, service category, next meeting datetime, milestone progress bar (e.g., "₱55K of ₱85K paid · 65%"), unread chat count badge. Open chat shortcut on each card.

Below: vendor coverage status — checkmarks for the 28 canonical wedding services that are filled; greyed for the ones marked "not needed"; warning amber for any canonical that's empty AND marked needed.

### 4.3 Schedule

Day-of timeline (Nov 15) at the top: 47 items from prenup-day breakfast through post-reception, color-coded by phase. Calendar export button.

Below: upcoming meetings (T-14 to T-1) — a vertical list of 14 vendor meetings with date, vendor, mode (in-person/video), and quick-join link.

### 4.4 In-App Services

Active apparatus grid (12 tiles, all green-dot active). Below: spend summary breakdown by category (Capture & Broadcast / Branding & Styling / AI & Physical / Widgets). "Buy more" CTA for any apparatus that's multi-purchasable (Pro Camera Bridge grants, Template Add-ons, AI Highlights, +1 Camera, +1 Hour).

---

## 5. Visual hierarchy

The Overview is information-dense but follows the established Setnayan voice: **luxurious, modern, restrained**. Cream surfaces, ink type, accent terracotta for active states + CTAs, status colors (green/amber/red) used sparingly. Cormorant Garamond italic for display headings ("Final Prep · 14 days to go"); Manrope for body; DM Mono for system metadata.

Mobile views collapse the apparatus strip to a horizontal scroll, stack the "what's next" cards vertically, and use thumb-zone-friendly tap targets per the existing memory rule.

---

## 6. What this prototype is NOT

- Not a new feature spec — every element here renders data already produced by iterations 0000–0019.
- Not a redesign of any existing tab — Guest List, Vendors, Schedule, Services keep their established layouts; this prototype just shows them populated.
- Not a proposal for new SKUs — uses only the locked V1 SKU list.

---

## 8. Navigation entry points for V1 features (locked 2026-05-12)

Iterations 0024–0035 were drafted after the dashboard's 9 surfaces were locked. This table closes the gap — every feature has one canonical entry point inside the couple dashboard so nothing is orphaned.

| Feature | Iteration | UI entry point |
|---|---|---|
| Profile & account settings | 0025 | Top-right profile avatar → dropdown → "Settings" |
| Email notification preferences | 0028 | Settings → "Notifications" tab |
| Help & FAQ | 0029 | Top-right profile avatar → dropdown → "Help" · also a `?` icon in every surface header |
| Replay guided tour | 0030 | Settings → "Tour" tab → "Replay first-time tour" button |
| Day-of guest mode | 0031 | Automatically activates T-1hr on the personal landing page; couple sees a "Live event mode" indicator on the dashboard Home and on the QR Hub surface |
| Save-the-Date Maker | 0024 | Services launcher grid card · also linked from the Schedule surface when within 90 days of the event date |
| Contracts | 0032 | Each Vendor card has a "Contract" button when a contract exists in the thread; opens contract viewer in modal |
| Tax receipts | 0026 | Settings → "Payment Methods & Receipts" tab → "Download official receipts" button |
| Sign out | — | Top-right profile avatar → dropdown → "Sign out" |

**Canonical profile-avatar dropdown layout.** The top-right avatar opens a single consistent menu across all three V1 dashboards (couple · vendor · admin): **Settings · Notifications · Help · Tour replay · Sign out**. Couple-specific affordances surface inside Settings tabs (Payment Methods & Receipts, Privacy & Data) rather than as separate top-level menu items, so the menu stays short and the pattern recognizable when a user with multiple roles switches views.

---

## 7. Companions

- `0021_couple_dashboard_fully_purchased.html` — interactive 5-surface walkthrough with web + mobile parity.
- `0021_couple_dashboard_fully_purchased.docx` — stakeholder mirror.
