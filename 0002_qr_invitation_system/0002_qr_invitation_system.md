# 0002 — Guest QR Code System & Event Landing Page

> **Spec note (2026-05-16):** This iteration now also owns the **Event Landing Page** — one free landing page per event at `setnayan.com/{couple-slug}` that morphs through four lifecycle phases (Save-the-Date → Invitation → Logistics → Post-event). Retired iteration 0024 (Save-the-Date) folded into this spec as the Phase 1 hero layout; § 5a of the original 0024 absorbed into the new **Event Landing Page lifecycle** section below. See `CLAUDE.md` decision log 2026-05-16 for the full reframe rationale.

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web (couple dashboard + guest-facing invitation site) + cross-cutting QR architecture · **Bottom-nav tab: Guest List** · Couple-side URLs: `setnayan.com/dashboard/[event-id]/invitation` (admin) and `setnayan.com/dashboard/[event-id]/invitation/print` (print pack); guest-facing: `setnayan.com/[event-slug]?invite=[token]` (unchanged)
**Phase:** Phase 1 (web-first build sequence) — with deliberate hooks for Phase 2 (Setnayan native) and Phase 3 (Din)
**Status:** Ready for Claude Code
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL pattern, bottom-nav routing), 0001_creating_guest_list (consumes the `guests.qr_token` column)

---

## What to build

The unified QR code architecture for Setnayan, plus the guest-facing personal invitation site that the QR resolves to.

Every guest carries one QR token. The same token, scanned from different surfaces, performs different actions:

| Scanner | Action |
|---|---|
| **Phone camera / web browser** | Opens the guest's personal invitation site at `setnayan.com/[event-slug]?invite=[token]` |
| **Setnayan (native capture app)** in tag mode | Tags the next photo/video to that guest |
| **Din (vendor / coordinator app)** | Marks the guest as "claimed" for whatever service the vendor is delivering at that moment |

Same QR. Same token format. Three contexts. The native apps register themselves as preferred handlers for the URI scheme so the OS routes the scan correctly when those apps are installed; otherwise the browser handles it.

This iteration delivers the **web-side foundation**: the token generation, the personal invitation site, the couple's QR admin / print sheet view, and the database schema for scan events. The native-app scanning UIs are designed in stub form here but implemented in Phase 2 (Setnayan) and Phase 3 (Din).

---

## Event Landing Page lifecycle (locked 2026-05-16)

The personal invitation site at `setnayan.com/{couple-slug}` is **one free page per event** that auto-transitions through four lifecycle phases on calendar thresholds. Each phase ships a first-class hero layout — not an MP4 embed, not a separate page. The page is the destination for every shared link, every QR scan, and every couple-to-guest broadcast.

**Why this is in 0002 (and not 0024):** The original 0024 § 5a already imagined the landing page as one lifecycle-phased surface. The reframe (decision log 2026-05-16) drops the MP4-rendering primitive entirely and makes Phase 1 a first-class layout that runs on web tech only (animated SVG monogram + countdown + calendar-add + Open Graph card + music). No FFmpeg pipeline, no render storage, no aspect-ratio multiplexing. The lifecycle machinery belongs to the landing-page chassis, which lives in this iteration.

### The four phases

**Phase 1 — Save-the-Date (T-event to T-90d):**
- Hero: animated SVG-trace monogram reveal (Monogram Hero upgrade in 0004 unlocks the trace + custom video/photo background) + couple names + date overlay + countdown
- Soft RSVP intent prompt ("I plan to attend") — non-binding head-count signal
- Calendar-add row: one-tap Apple / Google / Outlook
- Below hero: brief "Save the date" message, music autoplay-muted, social share row
- Other widgets minimal — guests are here to bookmark and share
- Open Graph metadata renders a beautiful link-preview card for FB / WhatsApp / Messenger / email

**Phase 2 — Invitation (T-90d to T-30d):**
- Hero: shifts to the formal invitation card — still date/venue, but emphasizes RSVP
- The Phase 1 monogram-hero animation/video moves to a smaller "Our story so far" section below the fold
- RSVP form: prominent above-the-fold call-to-action
- Schedule, dress code, gift registry, accommodations surface as scroll sections
- All 0004 widgets become visible per their `is_visible` flags

**Phase 3 — Final logistics (T-30d to T-1d):**
- Hero: countdown card + driving directions / parking / venue map
- RSVP form: gated to RSVPed guests only — non-RSVPed see a soft prompt
- Day-of timeline, what-to-wear reminders, contact info for the coordinator
- Live Schedule widget (0004 upgrade) glows on its current block if owned

**Phase 4 — Post-event (T+1d onwards):**
- Hero: gallery feed from Papic / Panood / Patiktok (consumes 0012 / 0011 / 0017 when shipped)
- Phase 1 monogram-hero moves to a small "Where it started" archive section
- RSVP form removed
- 30-day photo download window already documented elsewhere in this spec

### Auto-transition mechanics

Phase boundaries are computed from `events.event_date` and the current timestamp:

```sql
-- Phase computation (pseudo)
CASE
  WHEN now() < event_date - INTERVAL '90 days' THEN 'save_the_date'
  WHEN now() < event_date - INTERVAL '30 days' THEN 'invitation'
  WHEN now() < event_date + INTERVAL '1 day'   THEN 'logistics'
  ELSE 'post_event'
END AS lifecycle_phase
```

Auto-transitions happen on first request after the boundary. Couples can manually override any phase from the landing-page editor (in 0004's couple-side customize surface). The override flag is per-phase; a couple can stay on the Save-the-Date hero forever if they want.

### Schema addition

```sql
ALTER TABLE events ADD COLUMN lifecycle_phase_override TEXT
  CHECK (lifecycle_phase_override IS NULL OR lifecycle_phase_override IN
    ('save_the_date','invitation','logistics','post_event'));
-- NULL = auto-compute from event_date thresholds
-- non-NULL = couple has pinned this phase, ignore date math
```

### Why default-on (no opt-in)

The first 6–8 months of a landing page's life is announcement traffic. Defaulting Phase 1 as the hero matches what those visitors came expecting — the polished Save-the-Date moment from the couple's social share. Forcing opt-in means most couples never set up Phase 1 and the landing page launches with an empty or generic hero. Couples who want a different starting state use the per-phase override.

### Pricing

The landing page itself is **free** for every event. Couples customize it via 0004's widget editor. Two paid Phase 1 upgrades (V1):

- **Monogram Hero ₱1,999** (no-refund · all sales final) — animated SVG-trace monogram reveal + custom video (max 30MB) or photo background; SVG-only monogram upload required
- **Live Schedule ₱999** — "Happening now" highlight + auto-scroll, primarily a Phase 3 feature but available from purchase

Full V1 pricing + retired SKUs + V1.5+ widget plans in iteration 0004.

---

## Visual reference (canonical)

`0002_qr_invitation_system.html` (in this same folder) is the canonical visual reference. The mockup has two top-level toggles:

- **Guest's Invitation** — what a guest sees when they scan/click their QR. Web (1100px frame) and mobile (390×844 frame).
- **Couple's QR Admin** — the dashboard view where the couple prints QRs, sees scan/RSVP/photographed status across all guests. Web and mobile.

Open the mockup, click through both screens at both viewports, then come back here for implementation specifics.

---

## Stack & conventions

Per `CLAUDE.md` and existing iterations:

- **Frontend:** Next.js 15 App Router, RSC for server-rendered guest invitation pages; Client Components for the RSVP form and QR generation.
- **QR rendering:** server-side via `qrcode` npm package (https://www.npmjs.com/package/qrcode), with **error-correction level H (~30% redundancy)** so we can composite the couple's monogram in the center without breaking scannability. Render as SVG for sharp rendering at any scale; cache the generated SVG in R2 so re-rendering on subsequent visits is free.
- **Branded QR (couple's monogram in center):** when the couple finalizes their monogram in the Hero Monogram widget (configured downstream), every guest's QR is regenerated with that monogram composited in the center. **The QR pattern is rendered with a reserved center clearance** — the generator skips data cells in the central ~33% region (a 7×7 cell window for a 21×21 module Version 1, scaling proportionally for higher-version codes), and the monogram badge is laid into that cleared area as a circular terracotta-bordered ring inside a white rounded-square. Compositing approach: render the QR SVG, then layer a white rounded-square at the center (the clearance), then layer the monogram circle (the badge) on top. The error-correction level H (~30% redundancy) ensures scannability even with the cleared center. Color, border, and inner typography of the monogram badge follow the couple's selected theme. **Critical:** changing the monogram in the downstream editor invalidates the cached QR SVGs and triggers a regeneration job for all guest QRs on that event. Guests revisiting their personal invitation see the updated branded QR on next page load (cache invalidation via cache-busting URL `?v={monogram_updated_at}`).
- **Token format:** 32 hex characters from `crypto.randomBytes(16).toString('hex')`. Stored in `guests.qr_token` (already exists per 0001's schema). Unique constraint enforced.
- **URL routes:**
  - Public invitation: `setnayan.com/[event-slug]?invite=[token]` — magic-link auth happens server-side.
  - Couple admin: `setnayan.com/dashboard/qr-codes` — shows all QRs + scan status.
  - Print sheet: `setnayan.com/dashboard/qr-codes/print` — A4-formatted view for direct browser print.
  - Native handler stubs (no implementation yet): URI scheme `setnayan://guest/[guest_id]?token=[token]`. Universal Links / App Links registered on `setnayan.com`.
- **Auth:** the personal invitation site uses a **persistent magic-link session** — opening the URL with a valid `?invite=` token sets a cookie session for that guest, drops the query param, and renders the personalized page. The token is reusable as a sign-in credential (so re-scanning the QR or pasting the link in a new browser still works), and the cookie persists from the first visit **until 30 days after the event ends, or until the guest's token is rotated**, whichever comes first. There is no per-visit re-registration; once a guest is in, they stay in for the duration. The 30-day post-event window is the photo-download window: guests have 30 days to grab their tagged photos before the QR ends.
- **Validation:** Zod schemas server-side for token validation, RSVP submission, and scan events.

---

## Token format and URI scheme

### Token

```
guests.qr_token = 32 hex chars (e.g., "carla_a8f3d2c1b4e6f9027a3b8c5d1e0f7896")
```

The token is generated at guest creation (already in 0001's schema as `DEFAULT encode(gen_random_bytes(16), 'hex')`). It is unique per guest and never recycled even if a guest is soft-deleted.

**Every guest gets exactly one QR token — including +1s.** The QR is per-person, not per-couple and not per-household. A primary guest and their +1 each have a separate `guests` row (per 0001) and therefore separate, distinct `qr_token` values. The two QRs print on two separate cards, scan to two different personal invitation sites, and tag separately for paparazzi photos. Sharing a single QR between a primary and a +1 is not supported and would break tagging, RSVP, and the per-guest scan history.

### URI scheme — unified across surfaces

```
setnayan://[entity_type]/[entity_id]?token=[token]
```

Entity types in V1: `guest`, `table`, `event`, `vendor_service`, `coordinator_checkin`. For this iteration only `guest` is implemented end-to-end on the web side; the others are reserved for future iterations (Din work).

### Browser fallback URL

Browsers and OS-level QR scanners can't handle `setnayan://` schemes natively, so the printed/encoded QR uses the HTTPS fallback:

```
https://setnayan.com/[event-slug]?invite=[token]
```

This is what gets encoded into the printed QR on the guest's invitation card. The same URL works when scanned by a phone camera (opens browser to the personal invitation site) or pasted into any browser.

When the **Setnayan or Din native apps are installed**, iOS Universal Links / Android App Links intercept the URL and route to the in-app handler instead of opening the browser. The native apps look at the path (`/[event-slug]`) plus the query token, validate, and dispatch the right action (tag photo / mark claim).

If the user wants to manually trigger native-app scanning (e.g., they're already in Sulyap mode), the apps can also scan and parse the URL, decoding the token + entity from the path.

### Encoding choice — why we don't use the `setnayan://` scheme directly in printed QRs

Two reasons. First, native apps may not be installed; printing `setnayan://guest/...` would fail to open in a phone camera, leaving guests stuck. Second, App Store reviewers and link-preview tools (Messenger, Viber) don't recognize custom schemes — invitations sent via Messenger need a `https://` URL that previews properly with the wedding's OG image.

The `setnayan://` scheme exists as a parsing convenience inside the native apps, but the printed/encoded QR is always the HTTPS fallback URL.

---

## Personal invitation site

### Route

```
setnayan.com/[event-slug]?invite=[token]
```

Server flow:

1. Validate `invite` token: look up the guest where `qr_token = ?` AND `event.slug = ?`. If invalid → render generic landing page with sign-in CTA.
2. Set magic-link cookie: `setnayan_guest_session={signed JWT with guest_id, event_id, exp 30d}`.
3. Insert a `scan_events` row: `(guest_id, event_id, source='browser', scanned_at=NOW())`. Used for the couple's "scanned/not scanned" admin view.
4. **Branch on guest identity completeness.** If the guest row is a +1 (`plus_one_of_guest_id IS NOT NULL`) AND `first_name` is empty / NULL / a "TBA" placeholder, intercept the flow and route to the **+1 onboarding screen** (see next subsection). Don't render the personal invitation site yet — the +1 needs to identify themselves first.
5. Otherwise, redirect (302) to the canonical clean URL: `setnayan.com/[event-slug]` — query param dropped from history.
6. Server-render the personalized page using the cookie session for guest identity.

### +1 onboarding flow (when name not yet captured)

When a +1 row exists with a TBA placeholder (couple printed/sent the QR before knowing who the +1 would be), the first-time scan routes into a single onboarding screen *before* the regular personal invitation site. This is the moment the +1 identifies themselves to the system.

**Onboarding screen composition (single page, mobile-first since most first scans are from a phone camera):**

1. **Eyebrow** — small "You're invited!" in DM Mono caps.
2. **Headline** — italic serif: `"You are the +1 of [Primary first name + last name]"`. The primary's name is read from `guests` via `plus_one_of_guest_id`. Example: *"You are the +1 of Carla Mendoza"*.
3. **Sub-line** — supporting copy: `"Carla didn't have your details yet when she sent in her RSVP, so let's get you set up. This takes 10 seconds."`
4. **Name capture form** — two side-by-side inputs on desktop (single column on mobile, per the standing thumb-friendly rule), 46px height each (matching 0001's modal-sizing rule):
   - First name * (required)
   - Last name * (required)
5. **Confirmation copy** — small italic text below the name fields: `"This name will appear on your invitation, in the couple's guest list, and on photos you're tagged in."`
6. **Primary CTA** — terracotta button labeled `Correct — that's me`, 56pt height, full-width on mobile. Disabled until both first_name and last_name are non-empty.
7. **Secondary text link** — small `"This isn't me — I scanned the wrong code"` link below the CTA. Tapping it ends the magic-link cookie session and routes to the generic landing page so a misdirected scan doesn't accidentally claim the +1 identity.

**On `Correct — that's me`:**

1. Server validates the name fields (Zod: non-empty, ≤80 chars each, trimmed).
2. UPDATE `guests` SET `first_name = ?`, `last_name = ?`, `plus_one_name_confirmed_at = NOW()` WHERE `guest_id = session.guest_id`.
3. Insert a `scan_events` row with `context = { onboarding: true, primary_guest_id: <primary> }` so the couple's admin view can show "Onboarded by guest 2:14 PM" against this +1.
4. Redirect to the standard personal invitation site at `setnayan.com/[event-slug]` — magic-link cookie is already set, so the +1 lands directly on their personalized page (greeting now uses the name they just entered).
5. Notify the couple via the standard activity feed: `"[Primary] +1 onboarded as [Name]"` — useful for couples tracking who's coming.

**On subsequent scans from the same +1:** the row's `first_name` is now populated, so the server flow's branch at step 4 falls through to the normal redirect — they go straight to their personalized invitation site, no re-onboarding.

**If the +1's name was already captured by the couple at guest-list time** (couple knew Andres was Carla's +1 from the start, entered his name in the modal): the row's `first_name` is non-empty from creation, the onboarding screen never triggers, and the +1's first scan goes straight to the personal invitation site — same as a primary guest's first scan.

**Schema addition:**

```sql
ALTER TABLE guests ADD COLUMN plus_one_name_confirmed_at TIMESTAMPTZ;
-- Set when a TBA +1 confirms their identity via the onboarding flow.
-- Distinguishes "couple-entered name" (NULL here, name set at row creation) from
-- "+1 self-identified name" (timestamp here, name set at first scan).
-- Used by the couple's admin view to surface onboarding events distinctly from RSVPs.
```

**Edge cases:**

- *Couple updates the +1's name in the dashboard between print time and first scan.* The onboarding screen only triggers when `first_name` is empty/TBA at scan time. If the couple has already filled it in, no onboarding — the +1 lands on a regular invitation site greeting them by the couple-entered name.
- *+1 corrects a typo from onboarding.* They can edit their name later from the personal invitation site footer (`Edit my name` link), which writes back to `guests.first_name` / `last_name` directly. No re-onboarding screen.
- *Limited-mode +1s.* Same onboarding flow regardless of `plus_one_mode`. After confirmation, a limited +1 lands on the locked-down version of the personal invitation site (see "Limited +1 invitation site" below) instead of the full one.

### Page composition (desktop)

The personal invitation site is a sequence of **widgets**. Each widget has a basic tier (free, included with the wedding) and optionally a Pro tier (paid one-time upgrade — implementation deferred to a downstream editor + purchase flow iteration). Widgets render top to bottom, centered in a ~720px content column inside the 1100px viewport.

1. **Site header** — small Setnayan brand mark (left) + couple-name + date (right). Minimal.
2. **Hero Monogram Widget** — eyebrow ("You are invited"), couple monogram (88px circle, terracotta border, basic = static), couple names in serif at 64pt, date in DM Mono caps, decorative rule. Pro tier (deferred): names animate into the monogram on page load.
3. **Greeting Widget** — italic greeting "Hi, [first name]." in serif, then a personalized message: "[Couple] would love to celebrate with you on [date] — see you at [ceremony venue] at [ceremony time], then dinner and dancing at [reception venue]." Couple-editable in the downstream editor.
4. **Countdown Widget** — eyebrow "Until we say 'I do'" + four boxes (Days / Hours / Mins / Secs) with the numerical values in 44pt serif. Updates every second client-side via `setInterval`. Auto-hides after the wedding starts.
5. **QR Code Widget (centerpiece)** — 200×200 QR with eyebrow, title "For tagging & pickup", hint text, and three action buttons (Save to phone, Copy link, Add to wallet). The most prominent visual on the page after the hero.
6. **RSVP Widget** — visually distinct (subtle gradient + accent border). Status pill (Pending/Going/Maybe/Declined). Three big radio-style buttons "I'll be there / Maybe / Can't make it" (100pt+ tap targets). Below: plus-one selector, meal preference, dietary notes (full-width), note to couple (full-width textarea).
7. **Event Details Widget** — date, ceremony venue + time summary, reception venue + time summary, the guest's own role ("Maid of Honor · Bride's side · Reyes household"). At-a-glance row format.
8. **Venue Widget** — two photo cards side-by-side (Ceremony, Reception). Each card: 140px-tall photo with a "Ceremony" or "Reception" overlay pill, time + day in eyebrow caps, venue name in serif, full address + arrival/parking notes, and a "Get directions" button (basic = generic geo URL). Pro tier (deferred): replaces "Get directions" with native Waze and Google Maps deep links. Pro badge "Pro · Waze deep-link" rendered subtly next to the basic button.
9. **Schedule Widget** — full run-of-show as a time-aligned list.
10. **Dress Code Widget — "Look magical"** — title, intro paragraph, 5-swatch palette row (Cream, Champagne, Capiz, Terracotta, Midnight), then a two-column **Do / Don't** grid. Do column (green-tinted): "Look magical — formal evening wear", "Long gowns, ternos, tuxedos, well-cut suits", "Lean into the palette", "A little sparkle, sequins, or velvet — encouraged". Don't column (red-tinted): "No barong tagalog", "No white or ivory — those are reserved for the bride", "No casual — please, no jeans or t-shirts", "No flash photography during the Mass". Closes with a centered italic tagline ("Dress like the night was made for you"). Couple-editable.
11. **Photo Moments Widget — "Savour the moments"** — three-card grid showcasing the moments the couple wants guests present for (phone-down moments). Intro copy: "We'll have **shutterbugs** around to make sure you have photos of the event — so we'd love it if you'd savour these moments with us, and skip the videos. Just witness them." Each card has a glyph, a time + segment label, the moment title, and a short location/context note. The three default moments: **The Bridal Walk** (3:00 PM ceremony processional), **The Kiss** (3:45 PM after vows), and **First Entrance** (6:30 PM newlyweds entering reception). Below the grid, a dashed callout: "Shutterbugs cover the angles. Your job is to clap, cheer, and be in the room." Couples can edit the three moments and add more.
12. **Your Photos Widget — "All curated for you"** — empty-state card ("All your photos will appear here"), the profile photo card explaining auto-set behavior with the new copy ("Make sure a shutterbug snaps you on the wedding day — your first photo becomes your profile picture"), and the **"Add more via Shutter"** card with terracotta gradient: "You can also add your own photos and videos through Shutter, our in-app camera. Tag up to 5 guests per post — Maria & Juan are tagged for you automatically." CTA "Get Setnayan →" deep-links to the App Store / Play Store.
13. **Public vs Registered Tier Widget — "Two ways to celebrate with us"** — side-by-side comparison cards. Left card "Public · As you are now" (free, no sign-up needed) lists: view invitation, RSVP, see tagged photos for **3 days only**, save QR to phone — and a muted note that photos delete after 3 days unless guest signs up. Right card "With Setnayan account" (free, one-tap sign-up) emphasized with terracotta gradient: everything in Public plus **Shutter** (capture & tag photos as a guest), **Selfie Camera** (branded wedding selfie cam with the couple's frame), **Photo & Video Challenges** (fun mini-quests during the event), **Saved Forever** (photos kept permanently), and reel-builder access. CTA "Sign up free →".
14. **Footer** — couple's hashtag, "Powered by Setnayan".

### Page composition (mobile)

Per the standing thumb-friendly rule. Top to bottom, single column:

1. **Compact brand row** — Setnayan brand mark + date.
2. **Hero** — smaller monogram (64px), names at 38pt, date, italic greeting. No long intro paragraph here (saves vertical space).
3. **QR card** — top-of-fold. 200×200 QR, hint text, two action buttons (Save / Copy).
4. **RSVP block** — Three big buttons (going/maybe/can't), then plus-one + meal selectors stacked vertically, then optional note textarea. Each input is 46px tall for thumb-friendliness.
5. **Event details** — vertical stacked rows.
6. **Schedule** — same time-list, narrower.
7. **Dress code** — 5 swatches, smaller, with paragraph.
8. **Photos placeholder** — same content, smaller card.
9. **Footer**.

### What the guest can do

- See their personalized invitation rendering (their name in the greeting, their role in the event details).
- Submit/edit their RSVP. Submission writes to `guests.rsvp_status`, `guests.rsvp_responded_at`, and the dietary/meal/plus-one/note fields. Changing the RSVP later returns them to the same page with their existing values pre-filled.
- View their personal QR. Save it to phone (download as PNG), copy the link, or add to Apple Wallet / Google Wallet (deferred to a later iteration if scope creeps).
- Read the schedule, venues, dress code.
- Pre-event: see the empty-state for their photos. Post-event: see their tagged photos + reel builder (when those features ship).

### Limited +1 invitation site (locked variant)

A +1 with `plus_one_mode = 'limited'` (per 0001's schema) gets a stripped-down version of the personal invitation site. The same QR scan flow, the same magic-link cookie, the same TBA onboarding if applicable — but once they land on the personalized page, several capabilities are locked:

| Capability | Limited +1 |
|---|:-:|
| View this invitation (greeting, schedule, venues, dress code, photo moments) | ✓ |
| RSVP for the wedding (going / maybe / declined, meal, dietary, note) | ✓ |
| Save personal QR to phone | ✓ |
| Be tagged in paparazzi photos (their QR works for tagging) | ✓ |
| See their tagged photos | via primary inviter's gallery |
| Sign up for a Setnayan account | — (locked CTA) |
| **Shutter** (in-app camera) | — |
| **Selfie Camera** (branded wedding cam) | — |
| **Photo & Video Challenges** | — |
| Build & download souvenir reel | — |

**Photo connection — the defining limited-mode behavior.** Limited +1s do not get a personal photo gallery. When a paparazzo tags a photo to a limited +1 (their QR scanned during capture), the `PhotoTag` row is written for the +1 normally — they're a real subject of the photo — but the photo is **also surfaced in the primary inviter's gallery**, regardless of whether the inviter was tagged. This is the "connect their photos to another person" rule: the +1's photos connect through to the inviter, who has app access and can show them to the +1 in person. The limited +1 can ask the primary to share photos out-of-band; Setnayan doesn't ship a per-+1 export flow.

Implementation:

```sql
-- View predicate for the primary's "Photos" tab on their personal invitation site:
SELECT DISTINCT p.*
FROM photos p
JOIN photo_tags pt ON pt.photo_id = p.photo_id
WHERE pt.guest_id IN (
  -- the primary themselves
  SELECT :primary_guest_id
  UNION
  -- plus any of their limited-mode +1s
  SELECT g.guest_id FROM guests g
  WHERE g.plus_one_of_guest_id = :primary_guest_id
    AND g.plus_one_mode = 'limited'
)
ORDER BY p.captured_at DESC;
```

The primary's photo list visually marks photos surfaced through the limited-+1 connection with a small badge ("Photo of [+1 name]") so the primary knows why a photo without their face appeared in their gallery.

**Locked-state UI.** On the limited +1's invitation site:

- The **Public vs Registered tier widget** renders with both columns visually disabled (dashed borders, 55% opacity) and a small explainer banner above: *"You're a +1 to [Primary]. Your photos will appear in [Primary]'s gallery — ask them to show you. Want full access? You can register your own Setnayan account anytime — but for this wedding, you're invited as [Primary]'s +1."* The "Sign up free →" CTA is replaced by `Learn more about Setnayan` linking to the marketing site, not the wedding-specific signup.
- The **Your Photos widget** renders only the `Make sure a shutterbug snaps you on the wedding day` profile-photo card (so first-rule still applies — every guest needs a portrait). The "Add more via Shutter" card is removed entirely. A muted line below the profile-photo card reads: *"Your photos will be visible in [Primary]'s gallery."*
- The **Photo & Video Challenges** section, if present elsewhere on the site, is hidden.
- The **Selfie Camera** deep-link, if present elsewhere, is hidden.
- The **registered-tier extras block** in the RSVP widget (song request, dance style, challenges opt-in) is hidden entirely — limited +1s can't write registered extras even if they manually attempt to.

The limited +1's QR continues to work for paparazzi tagging and for the first-rule profile-photo capture on event day. The limitations are about the *app/web experience*, not the photo identity system.

**Switching modes.** A couple can flip a +1 from `'limited'` to `'full'` (or vice versa) from the dashboard guest list at any time. Flipping unlocks the locked features on next page load — no token regeneration needed. Going from `'full'` → `'limited'` is non-destructive: any RSVP and tagged photos persist; only the locked features hide.

---

## Couple's QR admin view

### Route

```
setnayan.com/dashboard/qr-codes
```

### Page composition (desktop)

Match the "Couple's QR Admin" → Web frame in the mockup.

1. **Page header** — breadcrumb, title "Guest QRs & Scan Status", action buttons (Print sheet A4, Export PDF, Send invitation links). No bulk re-issue button — token rotation is per-guest only.
2. **Print sheet preview** — a styled rendering of the printable A4 sheet with a 3-column QR grid. Each cell: 100×100 QR, guest name, role/household. Designed for **direct browser print** (Cmd+P / Ctrl+P) — no print dialog tweaks needed; CSS `@media print` hides the surrounding chrome.
3. **Scan status table** — seven-column table:
   - **Guest** — name + role/household.
   - **Invitation** — Sent + timestamp, or Not sent.
   - **RSVP** — Pending / Going / Maybe / Declined.
   - **Account** — Public (no Setnayan account) or Registered (signed up). Sub-line shows sign-up date for registered guests, "Not signed up" for public. This is the conversion-funnel column — couples can see at a glance how many of their guests have created Setnayan accounts.
   - **Photographed (coverage matrix)** — a row of small per-segment dot indicators (Pre-event, Ceremony, Cocktails, Reception — configurable per event), each filled when the guest has at least one photo from that segment. Filled dots with a small terracotta corner mark indicate the segment also has a video clip. Below the dots, a summary count "8 photos · 2 clips" or "0 photos · 0 clips". Replaces the prior single-badge representation, since photographers shoot across multiple segments throughout the event.
   - **Vendor claims (chip strip)** — a horizontal strip of mini-chips, one per contracted vendor (e.g., Floral, Catering, Souvenirs, Coordinator, plus any custom). Each chip shows checked (claimed, green-tinted) or unchecked (not yet, neutral). Replaces the prior single-badge representation, since a single guest can be claimed by multiple vendors at the same event (florist for corsage + caterer for dietary meal + coordinator for arrival check-in + souvenir vendor for pickup).
   - **Actions** — per-row "Re-issue" button (rotates this guest's token only).

A coverage legend renders above the table explaining the dot/chip meanings (P / C / Co / R for segments; ✓ for has photo; ✓ + corner mark for has photo + clip).

### Mobile composition

Match the mobile frame. App bar with title + count subline ("212 generated · 134 sent · 86 photographed · 38 registered"), two primary actions (Print sheet, Send), then a vertical list of guest rows. Each row: 64×64 QR thumbnail, name, role, then a meta row with status badges:

- Sent / Not sent badge.
- RSVP state badge (Going / Pending / Declined / Maybe).
- Account pill — small Public (gray) or Registered (green) chip.
- Coverage strip — 4 small dots (one per segment, filled = photographed) + tiny count "8 ph · 2 clips".
- Vendor strip — small "X/Y vendors" count, green when full coverage achieved.

Tapping a guest row opens a full-screen detail sheet with the full coverage breakdown per segment and per vendor.

### Print sheet format

A4 portrait. 8 cards per row in a 3×2 grid (24 cards per page). Each card is ~85×54mm (matches a credit-card-style printable sticker). Includes guest name, role, and a footer line "setnayan.com · powered by Setnayan".

When the couple clicks **Print sheet (A4)** on the admin page, the browser opens the print dialog targeting `setnayan.com/dashboard/qr-codes/print` which is a print-optimized route with `@media print` rules that hide all chrome.

---

## Database schema additions

### `scan_events` — every QR scan, regardless of surface

```sql
CREATE TABLE scan_events (
  scan_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id       UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  scanned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source         TEXT NOT NULL CHECK (source IN ('browser', 'setnayan_native', 'setnayan_din', 'coordinator')),
  scanner_user_id UUID REFERENCES users(user_id),  -- who did the scan (paparazzo, vendor staff, etc.); NULL if browser
  context        JSONB,                            -- e.g., { segment: 'ceremony', service_line_id: '...', photo_id: '...' }
  user_agent     TEXT,
  ip_anon        TEXT                              -- first 3 octets only, per PH-DPA
);

CREATE INDEX idx_scan_events_guest ON scan_events(guest_id, scanned_at DESC);
CREATE INDEX idx_scan_events_event ON scan_events(event_id, source, scanned_at DESC);
```

This single table records every QR scan across all surfaces. The `source` distinguishes the scanning context, and `context` carries the action-specific metadata (e.g., for `setnayan_native`, `context.photo_id` is the photo that was tagged; for `setnayan_din`, `context.service_line_id` is the line item that was claimed).

### Customer slug — real-time availability check (locked 2026-05-12)

Customer landing pages live at `setnayan.com/{customer-slug}` (the `event-slug` referenced throughout this spec is the same column under a generalized name). Slugs are **user-configurable with real-time availability checking** — no save button, no commit step. The customer types into the slug field, the app checks availability as they type, and the change saves (or silently reverts) on blur.

**Schema:**

```sql
ALTER TABLE events
  ADD COLUMN slug TEXT UNIQUE NOT NULL,
  ADD CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]{3,32}$');

CREATE UNIQUE INDEX events_slug_lower_idx ON events (LOWER(slug));

-- Vendor slugs share the same namespace; the v/ prefix on vendor URLs is purely cosmetic
ALTER TABLE vendors
  ADD COLUMN slug TEXT UNIQUE NOT NULL,
  ADD CONSTRAINT vendor_slug_format CHECK (slug ~ '^[a-z0-9-]{3,32}$');

CREATE UNIQUE INDEX vendors_slug_lower_idx ON vendors (LOWER(slug));

-- Optional: slug change history for SEO 301 redirects (90-day window)
CREATE TABLE slug_change_log (
  change_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type    TEXT NOT NULL CHECK (entity_type IN ('event','vendor')),
  entity_id      UUID NOT NULL,
  old_slug       TEXT NOT NULL,
  new_slug       TEXT NOT NULL,
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by     UUID REFERENCES users(user_id),
  redirect_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days')
);

CREATE INDEX idx_slug_change_old ON slug_change_log(LOWER(old_slug)) WHERE redirect_until > NOW();
```

**The user flow:**

1. Customer opens **Settings → Landing Page → Slug**
2. Current slug renders in the text field (e.g., `aira-boy`) with a copy-to-clipboard button next to it showing the full URL: `setnayan.com/aira-boy`
3. Customer starts typing a new slug
4. **300ms debounced API call** to `GET /api/slugs/check?slug={value}&entity_type={event|vendor}&entity_id={uuid}` fires on every keystroke after the debounce window settles
5. **Visual feedback right next to the field:**
   - ⋯ (gray, animated dots) — checking
   - ✓ (green) — available
   - ✗ (red, with tooltip) — taken, showing 3 suggested alternatives (`airaandboy` · `aira-boy-2026` · `aira-boy-wedding`) the user can tap to apply instantly
   - ⚠ (amber) — invalid format (e.g., spaces, uppercase, special chars, too short, too long, or matches a reserved slug)
6. Customer continues typing — each keystroke after 300ms quiet triggers a fresh check
7. **On blur (clicking away from the field):**
   - If current value is **available + valid (3–32 chars, lowercase a–z 0–9 hyphens only, not reserved)** → save immediately to `events.slug` (or `vendors.slug`), write a row to `slug_change_log`, update the canonical URL displayed below the field, and show a brief toast "Saved · your URL is now setnayan.com/{new-slug}"
   - If current value is **taken** OR **invalid** OR **empty** → **silently revert to the previous valid slug** (no error popup, no confirmation modal — just snap the field back to the last good value and clear any error state)

**The check endpoint:**

```ts
GET /api/slugs/check?slug={value}&entity_type={event|vendor}&entity_id={uuid}

Response:
{
  "status": "available" | "taken" | "invalid_format" | "reserved" | "current",
  "slug": "aira-and-boy",
  "suggestions": ["airaandboy", "aira-boy-2026", "aira-boy-wedding"]  // present only when status='taken'
  "reason": "Slugs must be 3–32 characters, lowercase letters, numbers, hyphens only"  // present only when status='invalid_format'
}
```

The endpoint is rate-limited (60 requests/minute per session) to discourage scraping the slug namespace as a vendor/customer directory.

**Reserved slug pool** (admin-managed, hard-blocked from claim by any customer/vendor):
- System routes: `admin`, `vendor`, `v`, `dashboard`, `api`, `register`, `login`, `settings`, `dpo`, `legal`, `privacy`, `support`, `terms`, `about`, `help`, `contact`
- Brand-protected terms and trademarks (admin policy adds these as they emerge)
- Profanity / NSFW (auto-blocked by content filter)
- Existing-but-archived slugs in the 90-day SEO-redirect window (returns `status='reserved'` with a hint that the slug becomes available on a future date)

Reserved slugs are managed in the admin console under **Settings → Reserved Slugs** (0023 surface). Adding a new reserved slug is a single-admin operation (Customer Accounts Handler or Vendor Accounts Handler); removing one requires two-admin approval since it can release a previously-protected name back into the public pool.

**Edge cases:**

- **Simultaneous claim race:** if two customers attempt the same slug at the exact same moment, the first DB commit wins (Postgres `UNIQUE` constraint enforces). The second customer's next check returns `status='taken'` within 300ms of their next keystroke.
- **Vendor + customer namespace:** vendor slugs and customer slugs share one global namespace (the `v/` prefix on vendor URLs is purely cosmetic). The check endpoint enforces uniqueness across both tables.
- **Slug change SEO behavior:** every slug change writes to `slug_change_log` with a 90-day `redirect_until`. The Next.js middleware on `setnayan.com/{slug}` consults this log first — if the requested slug is in the redirect window, return `301` to the new slug; if it's past 90 days, the old slug returns 404 (or becomes available for someone else to claim).
- **Empty-field blur:** if the customer deletes the entire slug and clicks away, treat it as `invalid_format` and silently revert. Never allow `events.slug = NULL`.
- **Admin force-rename:** Setnayan Team admin can force-rename a slug via the admin console for content-policy violations (e.g., the slug becomes profane after the fact, or violates a trademark filed after registration). Force-rename writes to `slug_change_log` with `changed_by` = admin user, sets up the 90-day redirect, and the customer is emailed.

**UX copy on the slug settings card (couple-side):**

> Your URL is your personal corner of Setnayan.
>
> `setnayan.com/[ aira-boy ]                                              ✓ Yours`
>
> Type a new slug to change it. We'll check availability as you type — no need to save.
>
> 3–32 characters · lowercase letters, numbers, hyphens · changes redirect old links for 90 days

This card lives on the couple Settings surface (consumed by 0021 and any future settings entry-points) and on the vendor Settings surface (consumed by 0022). Both surfaces reuse the same `<SlugField>` React component with `entity_type` as a prop.

### Monogram frame at QR center — simplified variant for scannability

The Hero Monogram widget (configured downstream) lets the couple pick from a library of **25 frames** organized into 5 categories (Simple, Geometric, Botanical, Decorative, Filipino Heritage). The frame wraps the monogram on the hero, the print sheet, and other large-display surfaces.

**At the QR center, the renderer uses a SIMPLIFIED variant of the chosen frame.** Complex frames (filigree, sampaguita wreath, baybayin script border, art deco fan, etc.) carry detail that disappears or muddies at the QR-center badge size (28×28 to 56×56 pixels) and would compromise scannability. Each frame in the library ships with two SVG variants stored under `/assets/monogram_frames/{frame_id}/`:

- `full.svg` — rendered at sizes ≥80px (hero monogram, print sheet, OG image).
- `simplified.svg` — rendered at QR center sizes ≤56px. Reduces to the frame's basic geometric shape (e.g., a Sampaguita Wreath simplifies to a circle; a Filigree simplifies to a rounded square; a Baybayin Script Frame simplifies to a hexagon outline).

The simplification map is curated by Setnayan's design team and is **not couple-configurable** — it's a renderer-level decision optimized for QR scannability. Couples see their full chosen frame on the hero and on printed cards; the QR center version is a tasteful reduction that still ties visually to the chosen frame's geometry.

The frame stroke inherits the wedding's accent color from the locked palette by default. If the couple picked Custom QR colors (per the QR Code Widget settings), the frame stroke can be independently overridden — but the simplified variant at QR center always renders cleanly against the QR's pattern color.

### Monogram source (auto-generated vs uploaded by couple)

The monogram composited at the QR's center comes from one of two sources, both maintained on the events row:

```sql
ALTER TABLE events ADD COLUMN monogram_source TEXT NOT NULL DEFAULT 'auto_generated'
  CHECK (monogram_source IN ('auto_generated', 'uploaded'));
ALTER TABLE events ADD COLUMN monogram_svg TEXT;            -- auto-generated SVG
ALTER TABLE events ADD COLUMN monogram_uploaded_url TEXT;   -- R2 signed URL of couple-uploaded asset
ALTER TABLE events ADD COLUMN monogram_uploaded_format TEXT
  CHECK (monogram_uploaded_format IN ('svg', 'png') OR monogram_uploaded_format IS NULL);
ALTER TABLE events ADD COLUMN monogram_uploaded_at TIMESTAMPTZ;
```

The QR generator reads whichever source is active per `monogram_source`:

- `'auto_generated'`: composite the SVG from `events.monogram_svg` at the center clearance.
- `'uploaded'`: composite the asset from `events.monogram_uploaded_url` at the center clearance. SVG and PNG handled identically (PNG rendered with transparent background preserved).

Couples switch between sources via the downstream Hero Monogram editor. Switching triggers QR regeneration for all event guest QRs (cache-busting via `?v={monogram_updated_at}`). The badge container (white rounded-square clearance + circular accent border) stays the same across sources; only the inner content changes.

**File validation rules** (enforced at upload time, before R2 storage):
- SVG accepted at any reasonable size (≤1 MB).
- PNG accepted only if ≥800×800 pixels with transparent or white background.
- Square or near-square aspect ratio (within 10%); non-square assets center-cropped.
- JPG, GIF, WebP, and other formats rejected with a clear error: "We need SVG or transparent PNG so your monogram stays sharp at QR-center sizing and on printed cards."

This means a couple who's already worked with a wedding-branding designer can use that monogram everywhere Setnayan shows their identity — hero, QR center, print sheet, OG image — without redoing the design through Setnayan's auto-generator.

### `guests.profile_photo_url` — auto-set from first paparazzi capture

Already partly hinted at in 0001's schema; extend the existing `guests` table:

```sql
ALTER TABLE guests ADD COLUMN profile_photo_url TEXT;
ALTER TABLE guests ADD COLUMN profile_photo_set_at TIMESTAMPTZ;
ALTER TABLE guests ADD COLUMN profile_photo_segment TEXT;  -- 'ceremony' | 'cocktails' | 'reception' | manually set
```

The setter logic (a paparazzo's first photo of a guest auto-becomes the guest's profile photo) lives in the Setnayan native app implementation (Phase 2). For this iteration, the **column exists** and the **schema enforces NULL is acceptable** (no profile photo = the dashed empty-state placeholder shown in the mockup). The personal invitation site renders `profile_photo_url` if set, the placeholder if not.

### `guests.invitation_sent_at` — already exists per 0001

When the couple hits "Send invitation links" from the QR admin (or from the standalone Send Invitations iteration when it ships), the timestamp is recorded here. The QR admin "Invitation" column reads from this column.

---

## Native-app scanning context handlers (stubs only in this iteration)

The unified URI handler logic is designed end-to-end here but only the **browser handler** is implemented. The other two are stubbed.

### Browser (implemented)

Already specified above: token validates → magic-link cookie → personal invitation site.

### Setnayan native (Phase 2 — stub only)

When the paparazzo scans the guest QR while in the capture flow:

1. App parses URL, extracts token + guest_id
2. Validates against backend (token belongs to event seat is bound to)
3. Adds `PhotoTag(photo_id=most-recent-or-next-photo, guest_id, source='individual_qr')` per spec 10
4. Inserts `scan_events(source='setnayan_native', context={photo_id, segment})`
5. **If guest has no profile_photo_url AND segment is 'ceremony' or 'cocktails':** sets `guests.profile_photo_url` to the photo's R2 URL, `guests.profile_photo_set_at = NOW()`, `guests.profile_photo_segment = current_segment`. This is the auto-profile-photo logic.
6. Optionally adds the guest to "photographed in segment X" coverage list (consumed by the per-segment "not yet photographed" UI)

### Din (Phase 3 — stub only)

When the vendor scans a guest QR while a service line is selected:

1. App parses URL, extracts token + guest_id
2. Validates against backend (token belongs to event vendor is contracted for)
3. Inserts `scan_events(source='setnayan_din', context={service_line_id})`
4. Marks `vendor_service_line_claims(service_line_id, guest_id, claimed_at=NOW(), vendor_id)`
5. Updates the couple's dashboard "vendor claim" column for that guest

These two are explicitly out of scope for 0002 implementation but their schemas should be designed compatibly here so Phase 2/3 work doesn't require migrations.

---

## Functional scope

### Must work end-to-end (this iteration)

- **Token generation** — every guest has a unique `qr_token` (already from 0001).
- **QR rendering** — server renders a SVG QR per guest containing the HTTPS fallback URL. Cached in R2.
- **Personal invitation site** at `setnayan.com/[event-slug]?invite=[token]` — token validates, magic-link cookie sets, page renders with personalized greeting and the guest's role/data pre-filled.
- **RSVP submission from the invitation site** — guest can pick going/maybe/declined, plus-one, meal, dietary, note. Writes back to `guests` table. Reload shows their selection persisted.
- **Couple's QR admin page** at `setnayan.com/dashboard/qr-codes` — lists every guest with their QR thumbnail and current scan/RSVP/photographed/vendor-claim status.
- **Print sheet** at `setnayan.com/dashboard/qr-codes/print` — print-friendly CSS, browser-print produces a clean A4 with all guest QRs + names + roles.
- **Scan event recording** — every browser scan inserts a `scan_events` row.
- **Per-guest re-issue token** — small "Re-issue" button on each row of the admin scan-status table. Rotates only that guest's `qr_token`, regenerates their cached QR SVG in R2, and renders the previously-printed QR for that guest invalid. Used for the common case ("Tita Cora lost her QR card"). Triggers a confirmation toast naming the guest and reminding the couple to re-print/re-send. Underlying guest data (RSVP, profile photo, household) is preserved — only the token rotates.
- **Auth** — magic-link cookie session works across page refreshes and bookmarks. Cookie expiry 30 days.
- **PH-DPA compliance** — only first 3 octets of IP stored; user-agent stored as-is for analytics; guest can opt out of scan tracking via a setting in their personal site (deferred field, but schema supports `guests.scan_tracking_opt_out BOOLEAN DEFAULT FALSE`).

### QR scan reliability — locked math, customizable visuals (2026-05-08)

The QR generator splits its rules into two layers: **structural rules locked by QR-spec requirements** (couples cannot override these — scanners would fail), and **visual customization** that couples can shape via the downstream editor as long as they stay within scan-safe boundaries.

#### Locked structural rules (couples cannot change)

| Spec | Locked value | Why |
|---|---|---|
| **Error correction** | Level H (~30% redundancy) | Tolerates center monogram clearance + print imperfections. Encoding-capacity tradeoff is fine because URLs are short. |
| **Quiet zone** | ≥ 4 modules of margin around the QR | Below this, scanners can't find the code. Enforced in the SVG output, not just CSS. |
| **Min print size** | 4cm (40mm) wide at 300 DPI | The "10:1 rule": a 4cm QR scans at 40cm (arm's length). |
| **Min module size when printed** | 0.6mm per cell | Slightly above the 0.4mm absolute minimum, absorbs home-printer imperfections. |
| **Logo coverage of QR area** | ≤ 25% (default ~11%) | Above 25%, level H error correction can't reconstruct. Stay well under. |
| **Logo placement** | Geometric center only | Must not overlap the three finder patterns or the timing rows/columns. |
| **URL length** | ≤ 100 characters | Keeps encoding within QR Version 2 (25×25). Longer URLs bump to higher versions with smaller per-module size, which hurts print scannability. |
| **Pattern↔background contrast** | Luminance contrast ratio ≥ 4:1 (≥ 7:1 strongly recommended) | Below 4:1, scanners reject the code in low light. Locked threshold; the *colors* themselves are customizable as long as they pass. |

#### Per-surface palette routing — locked 2026-05-08

The wedding has 9 palettes total (8 ceremony role palettes + 1 Reception palette per the Dress Code widget (defined downstream)). Each surface in Setnayan reads from a **specific** palette:

| Surface | Palette source | Why |
|---|---|---|
| Invitation site theme (overall) | **Reception palette** | The site is the formal invitation card; reception palette = wedding's primary identity |
| Hero Monogram | **Bride and Groom palette** | The monogram is THEIR identity, not the entourage's — uses their specific colors |
| LED Background Maker | **Reception palette** | Evening venue ambiance pairs with reception colors |
| **Guest's QR Code** | **The guest's role palette** | Each guest's QR matches what they're wearing on the day — Best Man's QR uses Best Man palette, MoH's uses MoH palette, etc. |

**The QR-by-role routing is the most novel piece.** Every guest has a role (recorded on `guests.role`). That role maps to a palette key in `events.palettes.ceremony[role_key]`:

| Guest role | Palette source key |
|---|---|
| `bride`, `groom` | `palettes.ceremony.bride_and_groom` |
| `best_man` | `palettes.ceremony.best_man` |
| `maid_of_honor`, `matron_of_honor` | `palettes.ceremony.maid_of_honor` |
| `bridesmaid`, `flower_girl` (when on bride's side) | `palettes.ceremony.team_bride` |
| `groomsman`, `ring_bearer` (when on groom's side) | `palettes.ceremony.team_groom` |
| `principal_sponsor` | `palettes.ceremony.principal_sponsors` |
| `candle_sponsor`, `veil_sponsor`, `cord_sponsor`, `coin_sponsor` | `palettes.ceremony.secondary_sponsors` |
| Plain `guest` and everything else | `palettes.ceremony.guests` |

The renderer picks the role palette, then derives QR colors using the existing rule (darkest swatch with ≥7:1 contrast as pattern, lightest as background, fallback to ≥4:1).

#### Recommended palette fallback (when role palette can't produce a scan-safe QR)

Sometimes a role's palette has no combination clearing the contrast threshold — e.g., Team Bride's palette is all soft blush + champagne tones. In that case, the renderer **generates a recommended QR palette for that specific guest's QR**:

1. Take the role palette's primary swatch (the most distinctive color of the role).
2. Compute a complementary dark variant (HSL: rotate 180° if very light; otherwise darken to L=15-25%).
3. Compute a complementary light variant (lighten the primary to L=92-96% with reduced saturation).
4. Validate the new pair clears ≥7:1 contrast.
5. If yes, use this recommended pair for that QR. Cache as `guests.qr_color_dark_recommended` / `guests.qr_color_light_recommended`.
6. If even this synthesis fails (extremely rare), fall back to safe black-on-white default with a debug log.

The recommended palette stays visually tied to the role (uses the role's primary hue) without violating scan reliability. Couples don't see this happen — it's silent renderer behavior. If they want to override, they can set custom QR colors via the QR Code Widget like always.

#### Default: auto-derive from event palette — *gated on palette finalization*

The QR's auto-derivation **does not fire until the couple has explicitly finalized their wedding palette** (a "Lock palette" toggle on the Dress Code widget (defined downstream)). Before finalization:

- Every event is seeded with default palette swatches (Filipino Heritage by default), but those defaults are placeholder — the couple may swap themes or tweak hex values multiple times during planning.
- During this in-flux period, the QR uses **safe black-on-white** so couples don't see their QR colors flickering as they iterate on the palette.
- The QR Code Widget's "Auto from palette" `color_mode` option in the editor is rendered **disabled with a tooltip**: "Lock your palette in the Dress Code widget to enable on-brand QR colors."

Once the couple flips the **"Lock palette"** toggle (sets `events.palette_finalized_at` to NOW()):

1. The renderer reads the event's locked palette swatches.
2. Picks the **darkest swatch with luminance contrast ≥7:1 against the lightest swatch** as the pattern color (preferred — extra-safe for low-light scanning).
3. Picks the **lightest swatch** as the background.
4. If no combination from the palette clears 7:1, falls back to ≥4:1 (still scan-safe). If none clears 4:1 (very rare), falls back to safe-default black-on-white.
5. Caches the derived `dark` and `light` hex values on `events.qr_color_dark` / `events.qr_color_light`.
6. Triggers a one-time QR regeneration job for all event QRs with the new colors.
7. The QR Code Widget's editor option flips from disabled → enabled, with `auto_from_palette` becoming the default.

**Re-opening a finalized palette:** the couple can re-edit their palette, but flipping the lock OFF triggers a confirmation modal: "Editing the palette will regenerate all guest QRs after you re-lock. Continue?" After re-edits and re-locking, the regen job fires again. This protects couples from accidental palette tweaks that would silently rotate every printed QR's appearance.

Schema:

```sql
ALTER TABLE events ADD COLUMN palette_finalized_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN qr_color_dark TEXT;        -- cached derived value
ALTER TABLE events ADD COLUMN qr_color_light TEXT;       -- cached derived value
```

Couples who don't think about QR styling get an on-brand QR — but only after they've committed to a palette. Until then, the safe default protects them from flickering QR appearances during planning.

#### Override: couples customize via the QR Code Widget

Couples who want something specific can override the auto-derived colors via the QR Code Widget's settings inspector in the downstream editor. The editor surfaces these options and runs a real-time contrast check on color choices, rejecting combinations that don't clear the 4:1 threshold.

| Visual | Customization | Constraint |
|---|---|---|
| **Pattern color (data cells)** | Couple picks any dark tone — black, navy, forest, oxblood, deep terracotta, deep indigo | Must clear ≥ 4:1 luminance contrast against the chosen background. The picker shows live contrast ratio + warning if below threshold. |
| **Background color** | Couple picks any light tone — white, cream, parchment, soft sand, blush, ivory | Same contrast constraint. |
| **Monogram badge color** | Inherits from the Hero Monogram widget (style + motif + border) | Already shaped in the Hero Monogram widget; QR Code Widget reads from it. |
| **Card frame styling** | Corner radius, drop shadow, padding, optional decorative border around the QR card | Doesn't touch the data — purely visual chrome. |
| **QR style preset** | Pick from 4-6 pre-validated combinations (Classic Black, Filipino Heritage = deep terracotta on cream, Modern Pinoy = oxblood on parchment, Garden = forest on ivory, etc.) | Each preset is contrast-tested before being added to the picker. Couples avoid building a bad combo from scratch. |

**Renderer implementation contract (`qrcode` npm package):**

```javascript
const colors = await loadEventQrColors(eventId); // returns { dark, light } from couple's choice
assertContrastRatio(colors.dark, colors.light, /* min */ 4.0);
QRCode.toString(url, {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 4,                       // quiet zone — locked
  color: {
    dark: colors.dark,             // customizable, contrast-validated
    light: colors.light
  },
  width: 800
});
// then composite monogram clearance + badge at center via SVG layering
```

The `assertContrastRatio` function uses WCAG luminance formula. If the couple's choice fails (e.g., they pick a pastel pink on white), the editor refuses to save and shows: "These colors won't scan reliably — pattern needs ≥4:1 contrast against background. Try [suggested fix]."

**Pre-flight validation that the renderer runs on every QR generated:**

1. Verify URL ≤ 100 characters before encoding. Error if longer; never silently truncate.
2. Verify pattern↔background contrast ≥ 4:1. Error if not; the editor should have caught this earlier.
3. After encoding, verify QR is Version ≤ 5 (target 1-3). If higher, URL needs shortening.
4. Compute clearance window dynamically from module count: `clearance = Math.floor(moduleCount * 0.33)`, centered. Don't hard-code "7×7".
5. Clearance must NOT overlap the three corner finder patterns or timing rows/columns.
6. Round-trip-test the final composited SVG by decoding with `jsqr` — asserts the URL is recoverable.

**Summary for the couple's mental model:**

The QR's *math* is locked because scanner-spec requirements aren't negotiable. The QR's *look* is customizable — couples can match it to their wedding's color palette as long as the contrast stays scan-friendly. The editor runs validation in real-time so couples never end up with an unscannable QR no matter what they configure. This is the same pattern Spotify codes, Apple Wallet passes, and branded marketing QRs at scale use: locked structure, customizable surface.

### First-rule of event-day scan (locked 2026-05-08)

**The first time a guest's QR is scanned on the day of the event, the scanning app must capture a photo of them in their wedding outfit before any other action proceeds.** This is the gate that produces the auto-set profile photo and ensures every guest is photographically known to the system.

Implementation across surfaces:

- **Setnayan native app (paparazzi seat or registered guest in Shutter mode)** — when the guest QR is scanned and `guest.profile_photo_url IS NULL` AND `now() >= event.start_at` (event-day window), the camera UI presents a single-shot capture prompt: "Take Carla's portrait — first-rule." The shutter button is the only enabled action; tagging, saving, or proceeding without capture is blocked. Once captured, that photo is uploaded, written to `guests.profile_photo_url`, and the scan flow continues normally (then proceeds to tag).
- **Din coordinator app** — same constraint at the arrival check-in QR scan. Coordinator scans the guest's QR at the venue entrance; if no profile photo, the app prompts for a portrait capture before allowing the guest to be marked "checked in."
- **Din vendor app (florist, caterer, etc.)** — vendors don't capture profile photos. They scan to mark a service line claimed; if `profile_photo_url IS NULL`, the vendor app surfaces a soft warning ("This guest hasn't been first-rule'd yet — please point them to the arrival station") but does not block the vendor's own claim action.
- **Browser scan** — the first-rule does not apply; browser scanning continues to open the personal invitation site.

The first segment in the coverage matrix (labeled "Arrival" with the **A** glyph and a small first-rule indicator) tracks completion of this rule. The matrix's coverage summary on Arrival reads "Awaiting arrival" for guests not yet scanned, and "Arrived 2:48 PM · 8 photos · 2 clips" once captured.

Schema additions:

```sql
ALTER TABLE guests ADD COLUMN first_rule_completed_at TIMESTAMPTZ;
ALTER TABLE guests ADD COLUMN first_rule_captured_by_user_id UUID REFERENCES users(user_id);
-- Both NULL until the first event-day scan completes the capture.
```

The `scan_events.context` JSON for first-rule scans includes `{ first_rule: true, photo_id: <uuid> }` so the admin coverage view can highlight first-rule scans separately from regular tagging.

### Smart QR routing — Public vs Registered vs Limited +1 (locked 2026-05-08)

The same QR token, same encoded URL, behaves differently based on (a) whether the scanner is signed in to a Setnayan account and (b) whether the guest row is a limited-mode +1. **The session persists across visits — guests never re-register on subsequent opens.**

A limited-mode +1 (`plus_one_mode = 'limited'`) lands on the locked-down invitation site variant described above; their QR cannot be used to register a Setnayan account regardless of scanner state. The Universal/App Link routing for native Setnayan skips auto-signin for limited +1s — the app, on detecting a limited-+1 token, opens to the same locked invitation view rather than the full registered guest experience.

- **Public guest (no account)** — phone camera scans QR → opens browser → personal invitation site at `setnayan.com/[event-slug]?invite=[token]` → magic-link cookie session set → personalized invitation rendered. This URL becomes the guest's *event-specific account page*: their RSVP, schedule, photos, and personal QR all live here. They can bookmark it, save it to their home screen as a PWA shortcut (the "Save to phone" button drives the Add to Home Screen / Install prompt), and return any time without re-entering the magic-link token. The cookie keeps them in.
- **Registered guest (has account, app installed)** — phone camera scans QR → iOS Universal Link / Android App Link intercepts → Setnayan app opens → app reads the token in the URL, validates against backend, finds the matching `guests.user_id` → auto-signs them in to their account → opens the personalized invitation view inside the app with the registered tier's features active (Shutter, Selfie Camera, Photo Challenges, etc.). No password prompt; the QR token itself is the credential. Subsequent opens of the link or the app icon resume the existing session — they don't re-authenticate.
- **Registered guest, app NOT installed** — phone camera scans QR → Universal/App Link not registered → iOS routes to App Store with deferred deep-link metadata; once the user installs and opens the Setnayan app, the deep-link replays and auto-signs them in via the QR token. Android: same pattern via Play Store deferred link. After the first install, the app's session persists — they don't re-download or re-register on subsequent scans.

**Session persistence — invalidation triggers:**

The session (magic-link cookie for public, app session for registered) lasts until ONE of these triggers fires:

1. **30 days after the event ends — the QR ends.** The magic-link cookie expires; subsequent visits to `setnayan.com/[event-slug]?invite=[old_token]` render an "This invitation has ended" page. For registered guests, the app session falls back to standard auth (they remain logged into Setnayan via their account; only the QR-as-credential link is severed). The 30-day window post-event is the entire lifetime of the QR — no extensions, no re-issues unless the couple explicitly rotates the token.
2. **The guest's token is rotated** — via the per-guest "Re-issue" action on the couple's QR admin page. The new token resets the 30-days-post-event clock. The old token is invalidated immediately, both for browser cookie sessions and any app session bound to it.

There is no time-of-day session expiry, no idle timeout, no re-registration prompt. Once a guest is in, they stay in for the entire wedding lifecycle (including the 30-day post-event window for revisiting their photos and building reels).

The QR token therefore plays two roles: as a magic-link bearer for browser sessions, and as an auto-login credential for native-app sessions. Both end together. Either trigger above ends them. Nothing else.

### Separated RSVP — Public form + Registered extras (locked 2026-05-08)

Both Public and Registered guests RSVP from the same personal invitation site, with the same core form (going / maybe / declined, plus-one, meal preference, dietary, optional kind word to the couple). RSVP completion does NOT require an account — friction here would tank RSVP rates.

**Registered guests see additional fields below the core form** in a clearly-marked "Registered guest extras" block:

- Song request (text input — for the dance floor)
- Dance style (select — slow / line dancing / hip-hop / no preference)
- Photo & Video Challenges opt-in (yes / no)
- Anything else? (text — allergies, special asks, kind words)

For Public guests, the same block renders in **locked state** with all fields disabled, a 🔒 lock indicator, and a "Sign up free →" CTA. Public guests can see what they're missing and convert in-place. The block uses dashed borders and 55% opacity on its disabled fields to communicate the locked state without hiding the structure.

Database: registered extras live in a new `guest_rsvp_extras` table keyed by `guest_id` (FK to `guests`). Only writable when the guest's session is account-authenticated; rejected with 403 for cookie-only magic-link sessions.

```sql
CREATE TABLE guest_rsvp_extras (
  guest_id          UUID PRIMARY KEY REFERENCES guests(guest_id) ON DELETE CASCADE,
  song_request      TEXT,
  dance_style       TEXT,
  photo_challenges_opt_in BOOLEAN DEFAULT TRUE,
  freeform_note     TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

The personal invitation site reads from `guest_rsvp_extras` only if the session is account-authenticated; otherwise the locked-state UI shows.

### Post-download conversion flow (locked 2026-05-08)

The 30-day post-event window has a clear purpose: let public guests download their tagged photos before the QR ends. The personal invitation site's Photos section now surfaces a **"Download all my photos"** CTA — a green-tinted card alongside the profile-photo and Shutter cards — that bundles the guest's tagged photos and clips into a zip download.

When the download completes, the site presents a **post-download moment-of-truth** screen with two paths:

1. **"I'm done — close out my access"** — explicitly ends the magic-link cookie session; the guest got what they came for. Polite exit. Doesn't preserve any data on the guest's side beyond the downloaded zip.
2. **"Register to keep them forever — and use Setnayan for my own wedding someday"** — converts the public guest to a registered Setnayan account. Tagged photos move from 3-day public-mode access to permanent. Ports the existing magic-link cookie session into a real account session. Pitches Setnayan as a future-self product: this guest could be planning their own wedding within the next year or two; catching them in a wedding-app mindset, right after they got value, is the highest-conversion moment we have.

**Why this is the right conversion moment.** Most "Sign up free" CTAs throughout the invitation experience compete with the guest's actual goal (RSVP, view photos, etc.) and feel like friction. Post-download is the moment after the guest has gotten everything they came for; the conversion ask is no longer interrupting their goal, it's offering an upgrade for the next time. That asymmetry makes it convert better than upstream prompts.

Schema: no new tables, but `guests.download_completed_at` (TIMESTAMPTZ, nullable) tracks when the guest first triggered a successful zip download. Used to suppress the post-download screen on subsequent visits unless they download again.

### Deferred — Couple's photo delivery to their cloud (future iteration)

A separate-but-adjacent feature requested 2026-05-08: at the end of the event, after photos are finalized and ready for release, Setnayan automatically uploads the entire finalized photo + clip archive to a Google Drive folder the couple has provided. This is the photographer's-final-cut delivery problem — couples want their wedding photos in their own cloud, not living in an app forever.

**The trigger pipeline:**

1. Event ends.
2. Photos pass through the couple's review window (7 days configurable per spec 10).
3. Couple flips an explicit "Release to Drive" toggle on their dashboard.
4. Setnayan enqueues a background job that batches the entire finalized archive (full-resolution photos + 5-second clips) and uploads to the couple's connected Drive folder.
5. Couple receives a notification when upload completes, with a count and link.

**Integration option (recommended):** OAuth Google Drive integration, not a "paste-link" flow. Couple clicks "Connect Google Drive" in their dashboard, authorizes Setnayan with scoped write access, Setnayan creates a folder named `Setnayan · Maria & Juan Wedding · 2026-10-24` and writes there. Folder stays private to the couple; Setnayan only has write access to its own folder. Industry-standard pattern, much safer than a public-edit-link approach.

**Why this isn't in 0002:** it touches couple settings (a new "Photo Delivery" panel), runs as a long-running background job, depends on the Phase 2 photo finalization flow (couple's review / approve workflow), and is about the couple's archive — not the guest experience that 0002 covers. Properly designed in its own iteration.

**Architecture compatibility for 0002:** the schema is already compatible — `events.photos_released_at` (TIMESTAMPTZ, nullable) is the trigger flag; the cloud-delivery job reads from existing `Photo` and `Photo.r2_object_key` rows. No 0002-side changes required, just don't paint into a corner that prevents this.

The full feature lives in a future iteration (likely **0005 — Photo delivery to couple's cloud**), with its own folder + work order + mockup of the dashboard "Photo Delivery" settings panel and the post-release notification.

### Native-app guest-upload rules (Phase 2 — captured here for forward consistency)

The Setnayan native consumer app's Camera function (branded as **Shutter**) lets guests (not just paparazzi seats) capture and upload photos / videos to the wedding gallery. Implementation is Phase 2, but the rules are locked now so the schema and tagging logic are consistent:

- **Guests can tag up to 5 OTHER guests per photo** (paparazzi-uploaded photos still allow up to 10 per spec 10).
- **The couple is auto-tagged on every guest-uploaded photo** — guests don't need to scan or tap the couple. The auto-tag fires server-side at upload time using `Photo.event_id` → `events.couple_user_ids[]`.
- **Couple does NOT count against the 5-tag cap** — they're implicit subjects.
- The 5-tag cap is enforced client-side in the Setnayan app's tagger and server-side at the `/photos` endpoint.

These rules go into spec 10 (Papic Feature Specification) when CLAUDE.md gets its next pass; for now they live here as the canonical reference.

### Public vs Registered vs Limited +1 tier model — locked 2026-05-08

Guests can experience the wedding in three modes, with sharply different feature access:

| Capability | Public (no account) | Registered (free Setnayan account) | Limited +1 |
|---|:-:|:-:|:-:|
| View this invitation | ✓ | ✓ | ✓ |
| RSVP for the wedding | ✓ | ✓ | ✓ |
| Save personal QR to phone | ✓ | ✓ | ✓ |
| Be tagged in photos (their QR scans for tagging) | ✓ | ✓ | ✓ |
| See tagged photos | 3 days | Permanent | via primary's gallery |
| Sign up for a Setnayan account from this invitation | ✓ | (already) | — locked |
| **Shutter** (in-app camera, capture & tag) | — | ✓ | — |
| **Selfie Camera** (branded wedding cam) | — | ✓ | — |
| **Photo & Video Challenges** (event mini-quests) | — | ✓ | — |
| Build & download souvenir reel | — | ✓ | — |

The first two modes (Public, Registered) are about the guest's account state and can be flipped by the guest themselves at any time. The third mode (Limited +1) is set by the *couple* on the +1's `guests.plus_one_mode` column and cannot be self-elevated by the +1 — it represents the couple's deliberate choice to grant photo-presence-only invitation, not full participation.

**The 3-day deletion rule supersedes earlier 90-day post-event language.** Public guests have access to their tagged photos for 3 days from the photo being tagged to them; after that, the photo is *not deleted from R2* (couples retain access for the full 5-year retention window per spec 10), but the public guest's view of the photo is hidden behind a sign-up gate. This creates strong, fast urgency to register without destroying the underlying data.

**The free Setnayan account is genuinely free.** No paid tier is required to unlock Shutter, Selfie Camera, Photo Challenges, or Saved Photos. The acquisition motion is: get every wedding guest to register a Setnayan account. Revenue comes from the couple's tier (Essentials / Premium / Pro Event) and per-event Pro widget upgrades, not from charging guests.

### In-app features (Phase 2 / Phase 2.5)

These are designed end-to-end here and stubbed in the personal invitation site's tier comparison, but their implementation lives in the Setnayan native app (Phase 2) and is not built in this iteration:

- **Shutter** — the in-app camera function. Guests with a Setnayan account can capture photos and short videos at the event, automatically deposited into the couple's gallery. Tag up to 5 guests per shot; couple is auto-tagged.
- **Selfie Camera** — a branded selfie cam with the couple's monogram, hashtag, and date as a frame overlay. Like a digital photo booth. Photos go to the couple's gallery and the guest's saved photos.
- **Photo & Video Challenges** — couple-defined or platform-default mini-quests during the event ("find someone in champagne and take a photo", "selfie with a sponsor", "5-second clip of the dance floor"). Drives engagement and ensures broad photo coverage. Backend stores challenges per event; frontend shows a list and tracks completion.
- **Saved Photos** — registered guests get permanent access to their tagged photos. The 3-day public-mode countdown becomes irrelevant once they sign up. Photos backed by R2's 5-year retention.

When these features ship, the tier comparison widget on the personal invitation site auto-updates the registered-tier descriptions; no copy changes needed because the widget reads feature flags from a config.

### Out of scope (deferred)

- **Native-app scanning** (Setnayan, Din) — schema designed, handlers stubbed, but in-app UIs are Phase 2/3 work.
- **Native-app guest upload UI** — same as above. The "Share your own" card on the personal invitation site is a Phase-2-aware CTA in V1; the actual upload flow ships with the native app.
- **Profile photo auto-set logic** — schema column exists, NULL is acceptable; auto-set requires the Setnayan native capture-and-tag flow (Phase 2). Personal site renders placeholder if NULL.
- **Per-segment coverage tracking** ("not yet photographed in cocktails") — Phase 2.
- **Vendor service-line claim** — Phase 3.
- **Apple Wallet / Google Wallet pass generation** — V1.5 nice-to-have.
- **Print options beyond A4** (Letter, 4×6 cards) — V1.5.
- **Bulk send invitation links via email/SMS/Messenger** — that's a separate downstream iteration.

---

## Acceptance criteria

- [ ] Visiting `setnayan.com/maria-juan-2026?invite=[carla_token]` renders the personal invitation site with Carla's name, role, and household pre-filled. Browser URL rewrites to `setnayan.com/maria-juan-2026` after first load.
- [ ] The QR shown on the personal invitation site, when re-scanned, returns Carla to her own page (idempotent).
- [ ] Carla can submit her RSVP (going + meal + dietary). Returning to the page shows her selection persisted.
- [ ] An invalid or revoked token shows the generic public landing page with a "Sign in with your invite link" CTA — no error stack trace, no token leak.
- [ ] The couple's QR admin page lists 212 guests with QR thumbnails, name, role, and four status columns (Invitation / RSVP / Photographed / Vendor claim) populated from real data.
- [ ] Clicking **Print sheet (A4)** opens browser print preview. The printed page is clean, with no dashboard chrome, and fits 24 QR cards per A4 sheet.
- [ ] **Per-guest re-issue token** action on each scan-status row rotates that single guest's `qr_token`, regenerates the cached QR SVG, invalidates the prior QR (scanning it lands on a "this invitation has been re-issued — contact the couple" page), and surfaces a confirmation toast. The guest's RSVP, profile photo, and other data are preserved.
- [ ] No bulk "re-issue all tokens" button anywhere in V1. If a security incident requires mass rotation, an internal admin script can iterate per-guest re-issue across all guests; that's a Setnayan Staff operation, not a couple-facing feature.
- [ ] Every guest scan from the browser inserts a `scan_events` row with `source='browser'`. The couple's dashboard "Sent / scanned" badge updates accordingly.
- [ ] Visual parity to `0002_qr_invitation_system.html` at 1100px desktop and 390px mobile widths for both the guest invitation site and the couple's admin view.
- [ ] **Countdown Widget** ticks every second client-side; auto-hides when wedding-start time is reached. Numbers render in 44pt serif on desktop, 28pt on mobile.
- [ ] **Venue Widget** renders two side-by-side cards on desktop (Ceremony, Reception), stacks vertically on mobile. Each card has a 140px photo (basic = CSS gradient placeholder; uploaded photo replaces it), venue name, time, address with parking notes, "Get directions" button. The Pro tier indicator ("Pro · Waze deep-link") is visible but inactive — actual Pro purchase + Waze integration ships in a downstream iteration.
- [ ] **Dress code Do/Don't grid** renders with green-tinted Do column and red-tinted Don't column on desktop; collapses to a vertical stack of color-coded lines on mobile.
- [ ] **Savour the Moments** section uses the locked copy: intro mentions "shutterbugs", presence callout reads "Shutterbugs cover the angles. Your job is to clap, cheer, and be in the room." Three default moments editable from couple dashboard.
- [ ] **Your Photos / Add via Shutter card** uses the locked copy: profile photo card says "Make sure a shutterbug snaps you on the wedding day"; share card titled "Add more via Shutter" with explanation of in-app camera.
- [ ] **Public vs Registered tier comparison** renders side-by-side on desktop, stacked on mobile. Public card lists 4 capabilities + the 3-day photo deletion warning. Registered card lists Shutter, Selfie Camera, Photo Challenges, Saved Forever, and reel-builder access. CTA "Sign up free →" wires to the existing Setnayan account creation flow.
- [ ] **3-day photo retention rule for public guests** enforced server-side on the personal invitation site's photos list. After 3 days, the photo's URL returns a 401 with a "Sign up to keep your photos" page. The photo file itself is not deleted from R2 — couple retains access per the 5-year retention policy.
- [ ] **Mobile is thumb-friendly** per the standing rule: ≥44pt tap targets, primary RSVP buttons are 86pt minimum, no 4-column grids, single search button in headers.
- [ ] **Modal/form sizing is consistent** per iteration 0001's rule: every input/select has uniform 46px height; only legitimately full-width fields (notes textarea, dietary input) span both columns.
- [ ] Schema migration adds `scan_events` table and the three `guests.profile_photo_*` columns without breaking existing 0001 functionality.
- [ ] Lighthouse 90+ mobile and desktop on the personal invitation page (this is a guest's first impression — must load fast).
- [ ] All 13 sample QRs in the mockup are decorative (CSS-art); the **real implementation must use the `qrcode` npm package** server-side, encoding the actual HTTPS fallback URL.
- [ ] **+1 has its own QR.** A +1 row (one with `plus_one_of_guest_id` set) renders a distinct QR thumbnail in the couple's admin view, encoding a URL with the +1's own `qr_token`. Re-scanning the primary's QR never lands on the +1's invitation site, and vice versa.
- [ ] **TBA +1 onboarding screen renders before the personal invitation site.** When a +1 row has empty/TBA first_name and is scanned for the first time, the server flow intercepts at step 4 and renders the onboarding screen with: eyebrow "You're invited!", headline "You are the +1 of [Primary first + last name]", first-name + last-name inputs (uniform 46px height), and a `Correct — that's me` terracotta CTA disabled until both fields are non-empty.
- [ ] **Onboarding writes back.** Submitting the onboarding form UPDATEs `guests.first_name`, `guests.last_name`, and `guests.plus_one_name_confirmed_at`, then redirects to the standard personal invitation site at `setnayan.com/[event-slug]` with the magic-link cookie still set. The greeting on the next page reads the just-entered name.
- [ ] **Onboarding only triggers for TBA.** A +1 row with non-empty first_name (couple-entered name at guest-list creation time) bypasses onboarding on first scan and goes straight to the personal invitation site.
- [ ] **Onboarding does not retrigger.** Subsequent scans of the same +1's QR — after onboarding completes — go directly to the personal invitation site. The branch at server-flow step 4 falls through.
- [ ] **"This isn't me" exit works.** Tapping the secondary text link on the onboarding screen ends the magic-link cookie session and routes to the generic landing page. No `guests` row is mutated.
- [ ] **Limited +1 invitation site renders the locked variant.** A +1 with `plus_one_mode = 'limited'` lands on a personal invitation site where: the Public-vs-Registered tier widget is fully disabled with the "+1 to [Primary]" explainer, the "Add more via Shutter" card is removed, the registered-tier extras block in the RSVP widget is hidden, and the Photos section text reads "Your photos will be visible in [Primary]'s gallery."
- [ ] **Limited +1 photos route to the primary's gallery.** A photo tagged to a limited +1 surfaces in the primary inviter's "Photos" tab on the primary's personal invitation site, marked with a small "Photo of [+1 name]" badge. The +1's own personal invitation site does NOT render a photo gallery (locked).
- [ ] **Limited +1 cannot register.** The "Sign up free →" CTAs on the limited +1's invitation site are replaced by a `Learn more about Setnayan` link to the marketing site. Programmatic POST to the registration endpoint with a limited-+1 session cookie is rejected with 403.
- [ ] **Mode flip is non-destructive.** Toggling a +1 from `'limited'` to `'full'` (via the couple's dashboard) unlocks the locked features on next page load without rotating tokens, without losing existing RSVP/photos, and without re-triggering the onboarding screen.

---

## Privacy & compliance

- Tokens are 16-byte random; brute-force resistance is fine.
- Magic-link sessions are JWT-signed with `EVENTS_TOKEN_SECRET` env var; rotate-able.
- Guest can revoke their session ("sign out") from the personal site footer — clears cookie, doesn't invalidate token (so they can re-enter via the QR).
- IP addresses are anonymized to first 3 octets at write time (per RA 10173).
- Scan events for a guest are only readable by: that guest, the couple, Setnayan Staff. Apply RLS.
- The personal invitation page sets `<meta name="robots" content="noindex, nofollow">` always — guest invitation pages must never appear in search engines.
- The couple's admin page sets the same.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context, decision log, locked architecture.
2. `0002_qr_invitation_system.html` (this folder) — visual reference. Open and click through both screen toggles + both viewports.
3. `0001_creating_guest_list/0001_creating_guest_list.md` — the prior iteration that establishes the `guests.qr_token` column and the data this iteration consumes.
4. `15_Couple_Landing_Page_Feature_Specification.md` — Part 10.6 documents the broader QR-context-aware architecture across browsers / Setnayan native / Din / Coordinator. This iteration implements the web side of it.
5. `10_Papic_Feature_Specification.md` — Section on `PhotoTag(photo_id, guest_id, source='individual_qr')` is what the native app's Phase 2 handler will write into. Schema must remain compatible.
6. `0001_creating_guest_list/0001_creating_guest_list.docx` — narrative summary, useful for context.

---

## Notes for Claude Code

- **The personal invitation site is a guest's first impression of Setnayan.** Visual quality matters more here than on the dashboard. Match the mockup carefully; pay attention to typography hierarchy and the QR card's prominence.
- **Don't reuse the dashboard nav on the personal site.** The personal invitation site is a stripped-down public surface — it has its own minimal header (small Setnayan brand mark + couple-name on the right). The dashboard nav from 0001 is for the couple, not for guests.
- **Magic-link sessions vs full auth — keep them separate.** The couple authenticates with the existing Setnayan couple-auth flow. Guests authenticate via magic link from QR. Don't merge them.
- **The QR rendering library: `qrcode` package, SVG output, error correction level M.** Cache the SVG in R2 with key `qr/[event_id]/[guest_id].svg`. Re-generate on token rotation only.
- **The couple's admin page builds on the existing dashboard shell** from 0001. If 0001's shell doesn't exist in the repo yet, build a minimal one as part of this work; document in the result.md.
- **When you finish, save a result summary at `0002_qr_invitation_system_result.md`** (in this same folder) describing what was built, what schema migrations ran, what was deferred, and any decisions you made worth surfacing.
