# Setnayan — Feature Documentation by Role

> A single reference covering every feature Setnayan ships in V1, organized by the role using it. Companion to the iteration specs in `0000_*` through `0018_*`. Last revised **2026-05-11**.

Setnayan is an event-planning platform for Filipino weddings (and, in time, the wider category of life events). V1 ships the wedding vertical. Other event types — birthdays, anniversaries, baptisms, vow renewals, corporate, concerts, and roughly two dozen more — are visible in the create-event picker as "coming soon" tiles and light up as their vendor supply matures.

The platform is multi-sided. The same person can be a couple at their own wedding and a guest at a friend's; their account is universal. The same is true for vendors and admins. Roles attach to events, not to people, via the `event_members` table.

---

## Roles at a glance

| Role | Who | How they get in | What they pay | Where they spend most of their time |
|---|---|---|---|---|
| **Couple** | The two people getting married | Self-signup → create event | PHP for service packages + apparatus SKUs | The couple dashboard (`/dashboard/[event-id]/...`) |
| **Guest** | Wedding attendee | Personal invitation site link, sent by couple | Nothing | The invitation site + their personal "Photos of me" gallery |
| **Paparazzo** | Trusted guest given a capture seat by the couple | QR-claim of a Papic seat (assigned from couple's dashboard) | Nothing — the seat was paid for by the couple | The Papic native app dashboard + camera |
| **Vendor** | External supplier — photographer, caterer, florist, etc. | V1: passive record encoded by couple. V2 (Din): self-service signup | Nothing in V1 (vendor money flows outside Setnayan). V2: marketplace fees | V1: nowhere — vendors don't log into Setnayan. V2: Din supplier app |
| **Admin (Setnayan Team)** | Internal Anthropic-of-Setnayan staff | Internal SSO into the admin console | N/A | Admin console — vendor verification queue, content moderation, payment confirmation |
| **Coordinator** | Wedding coordinator hired by couple | Deferred to a future phase | TBD | Future cluster — vendor list is the only V1 coordinator surface |

The rest of this doc walks through each role's surface and capabilities.

---

# Part 1 · Couple (paying customer)

The couple is Setnayan's primary paying user. Everything Setnayan charges for is purchased by the couple and consumed during their event.

## Account and event

The couple signs up with email + password (universal Setnayan account, not event-scoped). On first login they're walked through creating an event. The event picker shows six tiles — Birthday, Celebration, Travel, Corporate, **Weddings**, Burial — and Weddings is the only one selectable in V1 (the other five are visible as a product preview but show a "Coming soon" badge). After creating their wedding event, the couple is auto-jumped into its dashboard.

A single account can own multiple events. The picker shows all events the account belongs to (as couple, guest, or vendor), with a primary-event affordance and an archived-event filter. One active event auto-jumps in; two or more shows the picker.

## Dashboard chrome — the four bottom-nav tabs

Every event-scoped page lives at `/dashboard/[event-id]/[section]`. The bottom navigation has four tabs:

1. **Guest List** — see Part 1.3
2. **Vendors** — see Part 1.6
3. **Schedule** — unified view of every dated item across the event (vendor meetings, payment deadlines, ceremony milestones)
4. **In-App Services** — the services launcher grid (Patiktok feed of available add-ons, see Part 1.10)

Plus a profile/settings affordance in the header.

## Guest list management

Couples build and manage their guest list directly in the dashboard. Each guest entry includes:

- Name (first + last)
- Email and/or phone (for invitation delivery)
- Role classification — Principal Sponsor, Immediate Family (bride/groom side), Entourage, Secondary Sponsor, Bearer, Flower Girl, Extended Family, Friends, Work, School
- Plus-ones (counted as separate `guest` records, linkable to a primary)
- Table assignment (links to the seating chart from 0008)
- RSVP status, dietary notes, accessibility notes
- Personal QR token (auto-minted on create — never displayed in plain text)

Couples can bulk import a guest list from CSV, manually type entries, or — once the invitation site is live — let guests self-register via an "Am I on the list?" flow.

## Invitation widgets and personal invitation sites

Each guest gets a personal invitation site at a unique URL with a branded QR code. The couple customizes the site's design once and Setnayan renders a per-guest variant for every entry on the list.

The site is built from widgets. V1 widgets include Hero (cover image + names + date), Our Story (couple's narrative + photos), Schedule (event timeline with venue + map link), RSVP (per-guest acceptance flow), Plus-One Onboarding, Photos (post-event gallery embed), Voice/Video Guestbook (part of Wedding Challenges, future). Each widget has a **Basic** tier (free, ships with the wedding base SKU) and a **Pro** tier (paid upgrade, unlocked via a one-time PHP charge).

**Pro pricing.** Per Pro widget = ₱100. Pro Bundle (all 3 currently-Pro widgets, Hero + Our Story + Schedule) = ₱200.

## Token-free pricing (post-2026-05-11)

Setnayan retired the apply-then-pay flow on May 11, 2026 (decision log: `project_setnayan_billing_rail_php_only`). All pricing is now PHP-denominated and charged via PayMongo (or bank transfer + manual confirmation, depending on the customer flow). Couples see clear PHP totals on every checkout. The bonus-tokens mechanic that drove larger up-front commitments has been replaced by an **annual prepay discount** (12 weeks paid = 16 weeks of access). Subscriptions auto-renew; couples can cancel at any time, no refund minimums.

## Vendor management

The Vendors tab lets the couple track every external supplier — photographer, videographer, caterer, florist, HMUA, gowns, suits, lights & sound, DJ/emcee, cake, mobile bar, live band, photobooth, souvenirs, rings, honeymoon planner, and so on (28 canonical categories plus the ability to add custom rows scoped to this event).

Per vendor, the couple records:

- Contact info, package details
- **Flexible payment milestones** — any number, custom labels and amounts ("Reservation," "Down payment," "Balance," "Crew meal," etc.). Each has a due date and a payment-log entry with method, reference, and proof screenshot
- **Crew meals** — head count × per-meal cost, with a "vendor provides own meals" toggle. Rolls up to the event-wide catering aggregate
- **Meetings** — initial consult, tasting, walkthrough, fitting, etc. Each with title, datetime, mode (in-person/video/phone), location, agenda, attendees, post-meeting notes
- **Contracts and proofs** — uploaded to R2

Vendor payments are **tracking-only** in V1 — Setnayan records what the couple says they paid, never validates the transaction, never moves money. Vendor money flows external (cash / GCash / bank transfer direct to the vendor).

## Budget and expenses

The Budget tab is the couple's payment ledger. Per vendor, three top-level line items: Package, Crew Meal, Transportation. Each line has its own deadline and payment log. Vendor's GCash / Maya / bank QR is displayed per line for one-tap scan-to-pay (sourced from the vendor record). Rollup cards show total / paid / balance / next due across the whole wedding. Calendar export via .ics (universal — Apple/Google/Outlook); default reminders 24h + 1h before deadline.

**Setnayan's own platform charges auto-populate from the wallet ledger** (read-only inside Budget) so the couple sees a single combined view of everything they're spending on the wedding — vendor money + Setnayan money — in one place.

## Seating chart editor

The Seating Chart editor lets the couple lay out the reception floor plan. The table catalog has 13 fixed entries:

- Round 8 / Round 10 / Round 12
- Long banquet 6 / 8 / 10
- Family head 12 / 14 / 16 (long rectangulars, sized for immediate family)
- Sweetheart (2)
- Serpentine 6 / 12 / 18 (assembled from quarter-donut segments)

Plus stage, optional band platform, dancefloor, doors. Venue dimensions are optional — couples who know their room size flip a toolbar toggle for bounded mode (walls drawn at scale, no tables outside walls or on doors/dancefloor); couples who don't yet leave it blank for free-form placement. Rotation: round / sweetheart / family-head locked at 0°; long banquet and serpentine rotate in 45° increments.

Chair-level interaction is a first-class feature — every table renders chair circles around its perimeter, filled with guest profile photos when available, two-letter initials on a side-coded gradient when not. Tap a chair = swap that guest's seat; long-press = open guest details; tap the table body = swap the whole table; long-press the table = table settings.

Alignment guides snap moving tables to neighbors. Auto-fill uses role-tier rings centered on the stage (Tier 1 innermost = principals + officiant + immediate family; Tier 4 outermost = friends/work/school). Locked tables and already-placed guests are never moved by auto-fill.

Print pack downloads (PDF of the floor plan + table signs with QRs) unlock at publish; re-publish is idempotent (existing tokens unchanged, new tables get fresh tokens).

## Mood Board (V1: palettes only)

V1 ships palettes only — every guest role + venue gets a 6-color palette. Color input via hex, picker, name autocomplete (~300-entry library), or image extraction. 20 pre-template themes across Style (Classic, Pastel, Royalty, Nomadic, Sweet, Elegant, Dreamy, Muted, Boho), Color-led (Blue, Red, Green, Gold, Baby Blue, Army, Pink), and Seasonal (Spring, Summer, Autumn, Winter).

**Setnayan Guide rule engine** evaluates 7 categories on every change — cohesion (8-color hard limit + 60-30-10 soft target), contrast (per-tier minimums + inversion check), background-vs-foreground proximity (ΔE 10), temperature consistency, saturation hierarchy, photography color cast, cultural defaults (PH bride white/ivory + sponsor pairing). Returns pass / warn / contradict states with structured suggestions. Disable toggle per-event (default ON); override available per-palette.

Stylist persona, inspirations paste board, role outfit galleries, venue segments, concept-vs-actual all DEFERRED until stylist personas exist (V2 / Din Phase 3).

## In-app services launcher — the Patiktok feed (iteration 0017)

The fourth bottom-nav tab opens into a TikTok-style vertical-feed of every paid service the couple can unlock. Each card is a full-screen pitch for one SKU — visual, brief, with a single CTA. Couples swipe through, tap to learn more, buy with one tap.

This is the discovery surface for:

- LED Background Maker (₱2,000–₱8,000 depending on tier)
- Panood — Live Stream Base (₱2,500) + add-ons (+1 camera ₱1,000, +1 hour ₱1,000)
- Papic — 3 seats (₱1,500) / 5 seats (₱2,500)
- Per Template (₱200, multi-purchase)
- Pro Camera Bridge (₱1,500 per DSLR seat)
- Custom Monogram Pack (₱2,000, event-wide)
- Broadcast Style Pack (₱3,000)
- AI Video Highlight (₱2,000 per 60s)
- AI Edited Highlight (₱5,000 per 3-min)
- Pro widget purchases (₱100 each / ₱200 bundle)

Couples can purchase via Setnayan's apply-then-pay flow: apply for the SKU, receive payment-instructions email, pay via bank transfer / GCash / Maya / PayMongo, Setnayan Team confirms manually, service activates within 24 hours. Account states: pending_application → pending_payment → active.

## Step-by-step plan builder (iteration 0016)

A guided walkthrough for couples who've never planned a wedding. Sequenced checklist tied to a typical 6–12 month timeline; surfaces the right Setnayan iteration at the right moment (e.g., 4 months out → Mood Board; 6 weeks out → Seating Chart; 1 week out → Papic seats; etc.). Couples can skip ahead or skip steps entirely.

## Couple gallery and post-event review

After the wedding day, photos from every Papic seat (and uploaded vendor photos via iteration 0009) land in the couple's gallery. The couple has a **7-day review window** before public unlock — they can hide anything they'd rather keep private, extend the window, or release early. After release, every guest gets their tagged photos in real time.

Gallery filters in V1: Chronological, Photos of us, Untagged, Type (photo / clip / all). Bulk-hide for the review window.

## Personal data, privacy, and account controls

Couples control:

- Geolocation tagging on Papic photos (default ON for public venues; off for private home weddings)
- Face-detection auto-tag (per-event vector store, deleted at the 5-year retention boundary)
- NSFW filter (on by default, **cannot be disabled** — hard rule)
- Public gallery release date / time
- Guest face-blur opt-outs (sourced from each guest's RSVP consent)
- Data export at any time (full ZIP of every photo, every record, every chat)

---

# Part 2 · Guest (wedding attendee)

Guests are free users. Setnayan does not charge guests for anything. Every feature is paid for by the couple as part of their wedding package.

## How a guest enters Setnayan

The couple invites them via the personal invitation site. Each guest gets a unique URL with their personal QR code embedded. There are three entry paths:

1. **Email/SMS link from the couple** — most common. The link opens the personal invitation site, which prompts the guest to RSVP. RSVP'ing implicitly creates a Setnayan guest account linked to their email.
2. **QR-scan of the couple's event QR** — useful for last-minute additions. Scanning the event QR opens a role-picker (guest / vendor / etc.); they pick guest, enter their info, and the couple confirms.
3. **Manual register via the couple's web link** — guests who want to be on the list without an invitation can ask the couple to add them.

A guest's Setnayan account is universal — the same login can be a guest at multiple weddings.

## The personal invitation site

This is the guest's home base for the wedding. It's branded with the couple's design choices (Mood Board palette, Pro widget upgrades) and surfaces:

- Hero — couple's names, date, venue
- Our Story — narrative + photos
- Schedule — full timeline with venue + map link
- RSVP — accept/decline with dietary, plus-one, accessibility fields
- Plus-One Onboarding — invite a partner without contacting the couple
- Travel + Accommodation info (if the couple set it up)
- Photos — couple's pre-event shots; post-event, the full gallery and personal tagged photos
- Voice/Video Guestbook (part of Wedding Challenges, future)

The site is service-worker-cached so guests can view it offline once they've opened it once — useful at venues with weak signal.

## RSVP and plus-one flows

RSVP'ing is one tap (Yes / No / Maybe) with optional dietary, accessibility, plus-one info. The couple sees real-time RSVP counts in their dashboard. Plus-ones get their own personal invitation site once added.

## Face-detection enrollment

Guests can enroll their face for auto-tagging in three ways:

1. **RSVP profile photo** — already required in the RSVP flow. Baseline coverage (~90% of guests).
2. **Pre-event guest portal upload** — opt-in, via the personal invitation site. Higher-quality face vectors (1–3 photos).
3. **Day-of check-in kiosk** — laptop/tablet at venue entrance, controlled lighting. Highest-quality.

The matcher prefers the highest-quality enrollment per guest. Confidence ≥ 0.85 auto-tags; 0.65–0.85 surfaces a suggested tag; below 0.65 the photo uploads untagged. Face vectors are per-event-scoped and never reused across weddings. Guests can delete their face data at any time from their account settings; the deletion propagates within the next 5-minute cache refresh.

## "Photos of me" gallery

After the couple releases the public gallery (or before, if the guest is the couple's authorized reviewer), guests see a private "Photos of me" view at their personal invitation site URL. Filters: chronological, photos with me + my plus-one, photos at my table, clips only. Download originals (one or in bulk); 30-day grace period applies before originals are compressed on Setnayan's side.

## Personal Reels

Guests can build a Personal Reel from their tagged photos. Picks up to 5 guest photos + up to 5 memorable clips from the couple's coverage. Duration 1–30 seconds, vertical 9:16, template-driven. Music comes from Setnayan's owned AI-generated catalogue (~400 tracks across 6 categories — Bridgerton-Feel, Taylor-Swift-Feel, Michael-Jackson-Feel, Jazz, Sunday Morning Vibes, Hip Hop).

Render is server-side via FFmpeg on Cloudflare Workers; output lands at the guest's invitation site URL within 30–90 seconds of submitting. Reels are shareable via social with the couple's monogram (if the Custom Monogram Pack was purchased) or the Setnayan watermark (default).

## Peer-to-peer photo tagging

Guests cannot tag other guests from a roster — there's no browseable guest directory inside the gallery. The only way to tag another guest is to physically scan their personal QR code (printed on their place card from the seating chart's print pack). Table-sign QR auto-tags everyone seated at that table (capped at the 10-tag-per-photo limit; alphabetized truncation if a 12-person table fans out).

**Tag-once trust handshake.** Scanning a guest's personal QR is a one-time consent gesture per pair. Once A has scanned B's QR once, A can tag B in any of A's own future photos for the rest of the event without rescanning. Event-scoped and one-way (A→B).

## Live Stream viewing

Live Stream broadcasts are delivered exclusively via YouTube (V1 architectural decision). Every event with Live Stream gets a YouTube embed on the couple's landing page; guests open the embed and watch on YouTube's player. Audience is unlimited at zero marginal cost to Setnayan (and zero cost to the couple).

---

# Part 2.5 · Paparazzo (special guest role)

A Paparazzo is a guest who's been given a Papic seat by the couple. Mechanically a guest, but with an additional capture surface — the Papic native app.

## How a paparazzo gets in

The couple buys a 3-seat (₱1,500) or 5-seat (₱2,500) Papic package, then assigns each seat to a specific guest from the guest list. Each seat generates a unique seat-claim QR that the couple sends to the assigned guest. The guest opens the QR on their phone, which deep-links to the App Store (iOS) or Play Store (Android) for the native Papic app. After install, the QR claims the seat; the seat is bound to that phone for the event.

## The Papic dashboard

The dashboard is the Papic's workspace between captures — a TikTok-style ("patiktok") vertical feed with four tabs:

- **Untagged** — the feed of photos that need tagging. Default landing tab. Has a "My captures / Event-wide" sub-toggle. Event-wide shows thumbnails of every untagged photo from every Papic seat at the event (bandwidth-friendly because it's thumbnails only). Each card shows the suggested face match, confidence score, source seat, and offers Tag / Not-them buttons. Cross-Papic tagging means by event end the couple inherits a near-fully-tagged gallery.
- **Queue** — this seat's upload pipeline. Per-file status (uploading / done / weak-mode-held / failed). Progress bars. Bandwidth-mode badges.
- **Uploaded** — grid of this seat's own captures. Tag count + clip marker per tile. Tap to retag, favorite, or delete (within 24h).
- **Guests** — TikTok-style feed of every guest with their personal QR. One full-screen card per guest with avatar, name, role, table, full QR. "Tag in last 5 captures" applies that guest to recent shots without leaving the dashboard.

A pulsing camera FAB pinned lower-right enters the capture screen.

## The capture screen

Rear camera only — front camera is disabled by design (paparazzi shoot other people, not themselves). The gesture shutter has four modes triggered by a single button:

- **Tap** = photo, no flash
- **Drag up** = photo with flash
- **Drag right** = 5-second clip
- **Drag right → drag up (chord)** = 5-second clip with flash (torch on for the full 5 seconds)

Photos are capped at 5 seconds (hard cap, not configurable). Last-5 captures strip surfaces the 5 most recent for quick retag / delete / favorite. Tag drawer accepts QR scan (personal or table) or manual pick. Up to 10 tags per photo.

## Pro Camera Bridge (DSLR pairing)

If the couple purchased a Pro Camera Bridge unlock (₱1,500 per seat, multi-purchase), the paparazzo can pair one of Canon's, Nikon's, Sony's, or Fujifilm's mirrorless/DSLR bodies (full list in `0012_papic_compatible_cameras.md`) to their seat over WiFi. The phone keeps every responsibility — gesture shutter, tag drawer, face detection, EXIF stamping, adaptive compression, offline queue, upload — but the optical capture surface moves to the camera body. 1 phone : 1 DSLR; multi-DSLR-per-phone is V2.

## Privacy and storage defaults

Photos are NOT written to the paparazzo's camera roll by default — they live in the Papic app's sandbox only. An opt-in toggle in settings saves copies to camera roll for paparazzi who want a personal portfolio. After upload + 24h grace, the local sandbox copy is purged.

After the event, every Papic seat sees a "My contributions" view at the dashboard URL — full grid of their own captures.

---

# Part 3 · Vendor

Vendors are external suppliers — photographers, caterers, florists, HMUA artists, gowns/suits providers, lights & sound, DJ/emcee, mobile bar, live band, photobooth, souvenirs, rings, honeymoon planners, and so on. They cover 28 canonical service categories plus a long tail of custom additions.

## V1 — vendor records, no vendor login

**Vendors do not log into Setnayan in V1.** The vendor's presence in Setnayan is a record encoded by the couple in the Vendors tab. The couple writes down the vendor's contact info, package details, payment milestones, crew meals, meetings, contracts, payment proofs.

This is intentional — building a half-baked vendor login surface in V1 would block launch and create a migration we'd then have to throw away. Couple-encoded vendor records inherit cleanly into V2 (Din) when vendors get their own accounts.

A vendor CAN scan the couple's event QR to "join" as a vendor record (creating an `event_members` row with `member_type='vendor'`), but the vendor-facing dashboard view is intentionally minimal in V1 — placeholder copy that points to the upcoming Din supplier app.

## V1 — global vendor library (Setnayan Team curated)

Setnayan maintains a global library of verified vendors per service category. The first seeded dataset is the church library (`0006/church_library/`). Other categories get seeded over time as Setnayan Team verifies suppliers. Library entries default to "Pending Verification" until the Setnayan Team admin flips them to "Verified."

Couples can browse the global vendor library to discover suppliers they haven't worked with before. Once chosen, they add the vendor to their personal vendor list — the same record-encoding flow as a custom vendor.

## V2 — Din supplier app (Phase 3, not in V1)

Din is the dedicated supplier app for vendors. It will support:

- Vendor self-service signup with business verification (BIR, DTI, etc.)
- Calendar with availability, blocked dates, double-booking prevention
- Inquiry inbox from couples (without exposing personal phone/email until both sides agree)
- Quote builder with package templates
- Contract sender (PDF generation with e-signature)
- Payment milestone tracking on the vendor side (mirror of what the couple sees)
- Meeting scheduling with .ics export
- Photo / portfolio gallery accessible from the vendor's library profile
- Crew dispatch (for vendors with multiple teams running simultaneous events)
- Earnings dashboard with PH-tax-relevant exports

V2 vendor records inherit from V1 couple-encoded records — the same database row, just with vendor-write access enabled when the vendor onboards.

## V2 — global vendor library expansion

Once Din is live, vendors can self-list in the global library. Setnayan Team admin still gates "Verified" status — vendors get listed but unverified by default, and couples can filter by Verified-only.

---

# Part 4 · Admin (Setnayan Team)

Setnayan Team is the internal staff that runs the platform. They sign in via internal SSO into the admin console, separate from the customer-facing apps.

## Vendor verification queue

Every vendor library entry — whether seeded by Setnayan or created by a couple — starts in **Pending Verification**. Setnayan Team admin reviews the entry against legitimacy criteria (business registration, real address, working contact info, no scam signals) and flips to **Verified** or rejects with a reason.

Verified vendors are visible to all couples; pending vendors are visible only to the couple who created them. This protects against scam-vendor spam while still letting couples track their own informal vendors.

## Content moderation

Setnayan Team has visibility into:

- Reported guest content (photos, voice/video guestbook entries, chat)
- NSFW filter false positives / false negatives — review and retrain
- Custom monogram uploads (light moderation for trademark / inappropriate content)
- Vendor profile content (claims, package descriptions, portfolio photos)
- Custom mood-board themes contributed by stylists / vendors (Phase 3) — admin curation workflow decides whether a contribution gets approved for global use or stays isolated to one event

## Payment confirmation (apply-then-pay flow)

Setnayan's payment rails are PH-localized — bank transfer dominant, GCash / Maya / PayMongo for cards. The flow is:

1. Customer applies for a SKU (couple buying a Papic seat, vendor buying a Din subscription, etc.)
2. Setnayan emails payment instructions (bank account, GCash QR, Maya QR, PayMongo link)
3. Customer pays via their chosen channel
4. **Setnayan Team admin manually confirms the payment in the admin console** — they see the bank deposit notification or the gateway webhook, match it to the application, click Confirm
5. Service activates within 24 hours

Account states transition: `pending_application` → `pending_payment` → `active`. Admin's confirmation step is the gating action between pending_payment and active.

This manual step exists because PH B2B bank transfers don't carry reliable customer-reference metadata; automating the match-and-confirm is V2.

## Customer support and disputes

Setnayan Team handles:

- Couple questions about features, billing, vendor disputes (mediation only — Setnayan does not enforce vendor contracts)
- Guest questions about face-data, photo opt-outs, profile deletion
- Vendor library disputes (a vendor claims a record was created without permission)
- Account recovery (forgotten password, lost device, transferred ownership)
- Refund processing (the 14-day full-balance refund rule applies)

## Roles within Setnayan Team

The admin tier splits later, but V1 ships a single internal-staff role. First seeded use case: vendor verification (`project_setnayan_team_admin_verification`). Roles will split as the team grows — verification admin, content moderation admin, finance admin (handles refunds + payouts), support admin.

## Platform-level controls

Setnayan Team admin can:

- Feature-flag new iterations to specific events (canary releases)
- Adjust SKU pricing globally (PHP source of truth)
- Pause / resume event types (e.g., light up the Birthday tile when birthday-vendor supply matures)
- Read-only inspect any event's dashboard for support cases (with audit logging)
- Issue manual credits / refunds (PHP only, no token mechanics post-2026-05-11)
- Force-rotate a vendor library entry's verification status

Admin actions are audit-logged. Read access to a customer's data without their support ticket is flagged for the privacy officer (DPO).

---

# Part 5 · Roles deferred from V1

## Coordinator

Wedding coordinators are power users sitting between the couple and the vendors on the day. The coordinator cluster envisioned for V2 includes:

- Web QR scanning station (laptop at venue entrance)
- Multi-staff PIN access for the same event
- Three scanning modes (arrival, meal-served, departure)
- Real-time arrival count + dietary tracker
- Broadcast notifications to vendors ("DJ — start the next set")
- Encrypted local data bundle that works offline
- Thermal label printer support for name badges
- Geo-tag arrival pings
- Post-event PDF report

**In V1, the only coordinator surface is the Vendors tab** — coordinators access the couple's vendor list (with the couple's permission) to call/text vendors during the event. Everything else is deferred until V1 launch data shows the coordinator persona's actual workflow.

## Stylist

Stylists are a future role tier in Setnayan's Mood Board (V2 / Din Phase 3). When stylists exist, they get:

- Stylist persona profile (portfolio, style direction, contact info)
- Inspirations paste board (shared with the couple)
- Role outfit galleries (bride, groom, parents, entourage outfit boards)
- Venue segments with photos / videos (ceremony space, reception space, etc.)
- Concept-vs-actual comparison view
- Stylist-scoped saved palettes (vs V1's couple-scoped palettes)
- Contributing custom mood-board themes that, with admin approval, propagate to the global library

V1 ships palettes only and saves them couple-scoped; the schema is already shaped to add stylist scoping in V2 without migration.

## "All-Guest Unlock" tier (web upload by every guest)

A future Papic tier where every guest can upload photos via the web invitation site (instead of only designated Papic seats shooting via the native app). Not in V1 — the privacy and quality-control tradeoffs aren't worth the lift yet.

## Native Pro Capture Pack on phone-internal

RAW capture, manual focus peaking, manual ISO/shutter on the phone-internal Papic path. Not in V1. RAW IS supported in V1 via Pro Camera Bridge (DSLR bodies record their own RAW), just not from the phone's own sensor.

## Multi-DSLR pairing

V1 is strictly 1 phone : 1 DSLR. V2 unlocks 1 phone : multiple DSLR bodies (e.g., one paparazzo running two Canons simultaneously).

## USB-tethered DSLR pairing

V1 is WiFi-SDK only. USB tether is V2.

## BYO music in Personal Reels

Personal Reels in V1 are limited to Setnayan's owned AI-generated music catalogue (major-label music is never embedded in server-side renders — TOS shield doesn't apply when Setnayan is the direct infringer). V2 unlocks BYO music via client-side rendering on the guest's device (CapCut model — the only legal path).

---

# Appendix · Cross-reference

| Feature | Owning iteration | Primary role |
|---|---|---|
| App shell, login, event picker | 0000 | All roles |
| Guest list + roles | 0001 | Couple |
| QR invitation system + personal sites | 0002 | Couple → Guest |
| Token wallet (retired 2026-05-11) | 0003 | Couple |
| Invitation widgets + Pro tiers | 0004 | Couple → Guest |
| LED Background Maker | 0005 | Couple |
| Vendors management | 0006 | Couple (V1) → Vendor (Din V2) |
| Budget & expenses | 0007 | Couple |
| Seating chart editor | 0008 | Couple |
| Photo delivery (Google Drive integration) | 0009 | Couple → Guest |
| Mood board (palettes) | 0010 | Couple |
| Panood — Live Stream | 0011 | Couple → Guest viewer (via YouTube) |
| Papic — native capture | 0012 | Couple → Paparazzo → Guest |
| Platform stack & sync | 0013 | Internal |
| Setnayan marketing website | 0015 | Public / Prospect |
| Step-by-step plan builder | 0016 | Couple |
| Patiktok services launcher feed | 0017 | Couple |
| Supplies marketplace | 0018 | Couple → Vendor → Admin |

---

This document is maintained alongside the iteration ledger in `CLAUDE.md`. When a new iteration adds a feature, its primary role(s) are added to the cross-reference table and a paragraph in the relevant Part 1–4 section is written.
