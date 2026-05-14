# 16 — Vendor Benefits & App Evidence

> Working document. For every benefit Setnayan plans to offer vendors, this doc cites the iteration spec that supports it, OR flags it as not yet supported. The goal is to make sure Setnayan's vendor pitch only promises features the platform actually has — and to identify exactly what would need to ship to deliver the full pitch.
>
> **Authored:** 2026-05-09
> **Owner:** Ice
> **Audience:** Product, Engineering, Sales, Customer Success
> **Companion specs:** all iteration specs `0000–0013`, plus master specs `09_Panood_Feature_Specification.md`, `10_Papic_Feature_Specification.md`, `15_Couple_Landing_Page_Feature_Specification.md`.

---

## Why this document exists

The vendor value proposition Setnayan wants to publish includes a long list of benefits — analytics, scheduling, landing pages, promotional placements, access to couple-side tools. Some of those benefits are real today. Some are partially built. Some don't exist yet anywhere in the platform spec.

If the vendor pitch promises features that aren't in the codebase, two things go wrong: vendors sign up expecting them and churn when they don't appear, and engineering spends launch week firefighting requests for things that were never on the roadmap.

This document is the firewall. Every benefit gets either:
- ✅ **Supported in V1** — the feature exists in a current iteration spec; can be promised to V1 vendors today
- 🚧 **Partially supported** — foundation exists, but the vendor-facing surface is missing; partial promise possible with caveats
- ⏳ **Deferred to Din (Phase 3)** — planned but not in V1; vendors should be told the timeline
- ❌ **Not specced** — would need a brand-new iteration; cannot be promised until that work is funded

The audit below maps each benefit to one of those four states. The closing sections summarize the gap and recommend the iterations that would close it.

---

## Section 1 — Paid Services

### 1.1 Data Analytics

**The pitch:** "Creates a data view of how much of the market is interested in products similar to yours, and how much of those interested are purchasing from them. Plus recommendations."

**Status:** ❌ **Not specced.**

**Evidence in the app today:** None. There is no analytics iteration anywhere in `0000–0013`. There is no vendor account model in V1 — vendors are couple-encoded only per `0006_vendors_management/`. The only "engine" in the platform that produces structured recommendations is the Setnayan Guide rule engine in `0010_mood_board/`, and that's couple-facing palette guidance, not vendor market analytics.

**What would be needed to deliver this benefit:**
- Vendor account model (deferred to Din Phase 3)
- An analytics dashboard iteration with: aggregated cross-vendor data (anonymized), category-level demand signals, conversion funnel from inquiry to booking, comparison-to-peers metrics
- A recommendation engine (built on top of the analytics data) that suggests pricing, scheduling, or service mix changes
- Cross-vendor data pipeline running on Supabase + warehoused for trend analysis

**Realistic timeline:** Earliest possible is 12+ months post-V1 launch — needs Din Phase 3 to ship first, then needs enough vendor + booking data accumulated to make the analytics meaningful. A vendor analytics dashboard built today on a marketplace with 50 vendors would produce noise, not signal.

**Recommendation for vendor pitch:** Remove from V1 and Din Phase 3 launch materials. Position as "Data Analytics — coming once the marketplace has scale (year 2+)."

---

### 1.2 Events Scheduler

**The pitch:** "Keep a well-tabulated schedule of all your customers registered on our app and we will keep you informed for all schedules, payables, and other reminders."

**Status:** 🚧 **Partially supported.** The data foundation exists; the vendor-facing view is deferred.

**Evidence in the app today:**
- `0006_vendors_management/0006_vendors_management.md` — defines `vendor_meetings` table with title, datetime, mode (in-person/video/phone), location, agenda, attendees, post-meeting notes. Couple-encoded in V1, but the schema includes a `created_by_actor` column ('couple' in V1, schema-ready for 'vendor' in Din).
- `0007_budget_expenses/0007_budget_expenses.md` — `VendorLineItem.deadline_date` for payment milestones. Each vendor has up to three line items (Package, Crew Meal, Transportation), each with its own deadline + payment log.
- `0007_budget_expenses/0007_budget_expenses.md` — `.ics` calendar export with stable VEVENT UIDs (`{event_id}-{line_item_id}@setnayan.ph`). Exports both meetings AND payment deadlines.
- `0000_app_shell_and_navigation/0000_app_shell_and_navigation.md` — unified Schedule tab pulling from all three sources (vendor_meetings, VendorLineItem deadlines, invitation Schedule widget).

**What's there today:** the data layer is in place — every vendor meeting and payment deadline lives in Supabase with a structured shape. The couple sees this in their unified Schedule tab.

**What's missing:** the **vendor-side surface** to see this. A photographer with bookings at 30 different Setnayan weddings should be able to log in and see all 30 weddings' schedules merged into one calendar. That requires:
1. Vendor accounts (deferred to Din)
2. Vendor dashboard with a Schedule view
3. A Realtime subscription pattern across all events the vendor is attached to via `event_members.vendor_id`
4. Email/in-app reminders to the vendor for their own deadlines

**Recommendation for vendor pitch:** Position as **🚧 Partial in V1, full in Din Phase 3.** Specifically: "Couples already track your meetings and payment deadlines through Setnayan's Schedule view today. When Din launches in Phase 3, vendors get their own dashboard view of all their bookings across all weddings, with reminder emails."

---

### 1.3 Vendor Landing Page

**The pitch:** "Your landing page will consist of all your recent activities, curated, and reels will show how much people love your product. Customers will have reviews created for your service (0–5 stars). Verified Setnayan Badge will be helpful to prove your business's legitimacy."

**Status:** ❌ **Not specced** — though several pieces exist as primitives.

**Evidence in the app today:**
- Couple landing page exists per `15_Couple_Landing_Page_Feature_Specification.md`. Rendering pattern is solid — Setnayan can ship a vendor variant.
- `0006_vendors_management/` contains vendor records (name, profile, contracts, services, milestones) — could be the data source for a vendor profile page.
- `0011_live_stream/` — produces broadcast clips that could be embedded as "reels" of vendor work.
- `0012_paparazzi/` — produces gallery photos that could be "recent activities" surfaced on a vendor page.

**What's missing:**
- **Vendor account model** — deferred to Din Phase 3.
- **A "Vendor Landing Page" iteration spec** — there is none today.
- **Reviews / ratings system** — completely absent from V1. No tables for reviews, no rating aggregation, no moderation workflow.
- **Verified Setnayan Badge** — mentioned in passing in some specs as a future trust signal, but not specced as a structured feature with verification criteria, application flow, or display rules.
- **Recent activity curation** — there's no automated pipeline that pulls a vendor's recent broadcasts/photos and curates them. Curation logic would need to be built.

**Recommendation for vendor pitch:** Position as **⏳ Deferred to Din Phase 3.** Be explicit in the pitch that this is on the roadmap but not available today. Don't show mockups of the vendor landing page until the spec exists.

---

### 1.4 Invitation and Wedding Landing Page (vendor brand placement)

**The pitch:** "Your brand will show as one of their trusted vendors. A great asset for upping your market reach."

**Status:** 🚧 **Partially supported.** The couple landing page exists; vendor placement on it does not.

**Evidence in the app today:**
- `0002_qr_invitation_system/` + `0004_invitation_widgets/` + `15_Couple_Landing_Page_Feature_Specification.md` — the couple's invitation site and landing page are real V1 surfaces.
- `0004_invitation_widgets/0004_invitation_widgets.md` defines 11 widget types in V1: `hero_monogram`, `greeting`, `our_story`, `countdown`, `qr_code`, `rsvp`, `event_details`, `venue`, `schedule`, `dress_code`, `photo_moments`. **No "Vendors" or "Trusted Vendors" widget exists.**
- `0006_vendors_management/` has the vendor data ready to display — vendor name, service category, photo, contact link.

**What's missing:**
- A new widget type — call it `trusted_vendors` or `our_team` — added to `0004_invitation_widgets/`'s widget catalog. The widget would show a curated grid of the couple's vendors with logo, name, service category, optional link to vendor's own landing page (when that ships).
- A `vendor_consent` flag — vendors should opt in to being displayed publicly on couples' landing pages. Some vendors will want maximum exposure; others (smaller operations, photographers who don't want spam) will not.
- A widget Pro tier? — could be: Basic widget shows just vendor names; Pro widget shows logos + photos + linked profile pages. Couple pays Pro for the upgrade.

**What can be done in V1:** A simple version of this is shippable — add a `trusted_vendors` widget to the `0004` widget catalog. Vendor records already exist in `0006`. Pull the data, display in the widget. Skip the vendor-consent flag initially (default to display unless vendor objects). Skip the Pro tier initially.

**Realistic V1 scope:** 2–3 days of engineering work to add the widget. This could ship in V1 as part of `0004_invitation_widgets/` with a small spec extension.

**Recommendation for vendor pitch:** Position as **🚧 Partial in V1, with a clean path to ship in V1.** Either ship the simple `trusted_vendors` widget in V1 (preferred — it makes the vendor pitch real), or defer to V1.1 with a clear timeline.

---

## Section 2 — Tools the vendor can access for the couple

These are couple-side tools that the user wants vendors to "access" — meaning vendors can collaborate with the couple by viewing or contributing to these tools.

### 2.1 Palette Maker

**Status:** ✅ **Supported in V1 as couple-side tool. Vendor access ⏳ deferred to Din Phase 3.**

**Evidence in the app today:**
- `0010_mood_board/0010_mood_board.md` — V1 Mood Board ships palette creation. Six-color palettes per role + venue. Color input via hex / picker / 300-entry color name library / image extraction. 20 pre-template themes. Setnayan Guide rule engine evaluates 7 rule categories per palette.
- Palettes are stored in Supabase per `0010` schema; the `palette_template` JSON manifests at `/palette_templates/{slug}.json` are static assets in R2.

**What's there:** Couples build palettes. The palettes are stored, the rule engine evaluates them, the master palette dedups colors.

**What's missing for vendor access:**
- Vendor account model (deferred to Din)
- A vendor view of "the couple I'm working with's palette" — read-only at minimum, possibly contributable for stylists in Din
- Permission scoping — vendors should see the palettes for events they're attached to via `event_members`, not all palettes globally

**Recommendation for vendor pitch:** "When a couple shares their wedding palette with you (Din feature, Phase 3), you'll see exactly the colors they want — perfect for florists, stylists, cake designers, decor, attire."

---

### 2.2 Mood Board

**Status:** ✅ **Supported in V1 as couple-side tool. Vendor access ⏳ deferred.**

**Evidence in the app today:**
- Same as 2.1 above — `0010_mood_board/` is the iteration. In V1, "Mood Board" is palette-only (per the spec). Inspirations paste board, role outfit galleries, venue segments with photos/videos all DEFERRED until stylist persona exists.

**What's there:** Palettes only.

**What's missing:**
- The fuller "mood board" (inspirations + outfit galleries + venue segments + concept-vs-actual photos) is planned but explicitly deferred from V1 per the existing spec.
- Vendor view of the mood board (same as palette access above) — Din.

**Recommendation for vendor pitch:** Be careful here. "Mood Board" implies more than V1 ships. V1 = palettes only. The richer mood board is V2/Din. Distinguish in vendor materials between "wedding palette (ships V1)" and "full mood board (ships in Din)."

---

### 2.3 Seating Arrangement

**Status:** ✅ **Supported in V1 as couple-side tool. Vendor crew-meal counting also supported. Vendor view ⏳ deferred.**

**Evidence in the app today:**
- `0008_seating_chart_editor/0008_seating_chart_editor.md` — full V1 seating chart with 13-table-type catalog (round, long, family head, sweetheart, serpentine), free-placed stage, role-tier ring auto-fill, alignment guides, chair-level interaction with profile photos, table QR mint at Publish, Print pack with per-table signs and per-guest place cards.
- `0006_vendors_management/` — `vendor_crew` table with count × per-meal cost rollup. Couples enter the catering vendor's crew count; the seating chart's crew-meal calculation feeds into 0007's Budget. Already cross-iteration wired.

**What's there:** Catering, photo, video, lights & sound vendors implicitly benefit from the seating arrangement because their crew meals are calculated from it. Couples see the layout. Print pack vendors (printers) get a cleaner output to print.

**What's missing for vendor access:**
- Vendor view (Din) — a photographer would benefit from seeing the seating layout to plan shot angles. A coordinator would benefit from seeing it to manage flow on event day.
- Read-only access for non-coordinator vendors via `event_members.vendor_id` permission scoping.

**Recommendation for vendor pitch:** Today, a couple can share their seating chart screenshot/PDF with you (the printable Print Pack). In Din, you'll have native access to the live seating chart on your vendor dashboard.

---

### 2.4 QR Scanner

**Status:** ✅ **Multiple QR scanners exist in V1 — but for couple/guest/paparazzo use cases, not vendors specifically.**

**Evidence in the app today:**
- `0002_qr_invitation_system/` — personal guest QR (`setnayan://guest/{id}?token=...`), printed on invitations and place cards, scanned for RSVP / personal invitation site access.
- `0008_seating_chart_editor/` — table QR (`setnayan://table/{id}?token=...`), printed on table signs at the venue.
- `0012_paparazzi/` — paparazzo capture app's tag scanner (scans guest QR for individual tagging, scans table QR for fan-out tagging across the table).
- `0000_app_shell_and_navigation/` — event-join QR (`setnayan.com/join/[event-id]?token=...`), scanned by anyone joining an event including (eventually) vendors.

**What's there:** QR scanners are heavily integrated into V1 as guest-side and paparazzo-side tools.

**What's missing for vendor use:**
- A vendor-specific QR scanner use case. Possibilities (none yet specced):
  - Vendor check-in QR — vendor scans on event day to mark themselves "on site"
  - Service-tagging QR — vendors who deliver something on event day (e.g., flowers, cake) scan to log delivery time
  - Crew member QR — each crew member scans their own QR for arrival logging (relevant for catering/lights/sound crews of 5+ people)
  - Vendor-specific event QR — alternate join-code for vendor-specific entry to the event

**Recommendation for vendor pitch:** The existing QR infrastructure supports building these vendor use cases without new architecture work. But none of them are V1 features today. Position as: "QR scanning is a Setnayan platform primitive that powers many vendor use cases shipping in Din."

---

## Section 3 — Promotion tools (Setnayan promotes the vendor)

### 3.1 Vendor's own personal landing page

**Status:** ❌ **Not specced.** See Section 1.3 above.

**Evidence:** None. No vendor landing page iteration exists.

**Recommendation for vendor pitch:** Cannot promise this in V1. Defer to Din Phase 3 — and note it's contingent on a dedicated iteration being drafted and built.

---

### 3.2 Couple's wedding page (vendor placement)

**Status:** 🚧 **Partial — see Section 1.4.** Foundation exists; widget needs to be added.

**Evidence:** Same as 1.4 — couple's landing page from `15` + invitation widgets from `0004` provide the surface. A new `trusted_vendors` widget needs to be added to the `0004` catalog.

**Recommendation for vendor pitch:** If you ship the simple `trusted_vendors` widget in V1, this becomes ✅. If you don't, this stays 🚧.

---

### 3.3 LED Background (vendor logo placement)

**The pitch:** "Place your logo on their wall."

**Status:** ❌ **Not specced for vendor branding.** Couple-only LED branding exists today.

**Evidence in the app today:**
- `0005_led_background_maker/0005_led_background_maker.md` — V1 LED Background Maker. 10 Lottie templates (filigree_bloom, capiz_shimmer, sampaguita_drift, gold_particles, ethereal_mist, bokeh_lights, watercolor_wash, slow_pulse, constellation, velvet_sweep). Couple's monogram from the Custom Monogram Pack (`0011`) appears on the LED background.

**What's there:** Couple's monogram appears on the LED. **There is no current feature to display vendor logos on the LED.**

**What's missing:**
- A "Vendor Logo Placement" feature in the LED background editor — likely a sub-element of a Pro tier or a new SKU
- Pricing model — does the couple pay extra to add vendor logos? Does the vendor pay Setnayan to be on the couple's LED? Does the vendor sponsor the couple's LED in exchange for a sponsored placement?
- Placement rules — only the catering / venue / photo / video vendors? Up to 5 logos? Bottom strip vs corner?
- Vendor consent and opt-in — vendors must opt in to having their logo displayed publicly

**Recommendation for vendor pitch:** Cannot promise in V1. **Real risk** of overpromising — couples and vendors will both be confused if the marketing claims this and it doesn't ship. Position as: "Vendor logo placement on LED backgrounds is a planned Din feature — pricing and design TBD."

---

### 3.4 Live Stream (vendor brand plug)

**The pitch:** "Moments on live stream will plug your business in the upper right, or with an overlay hero effect."

**Status:** ❌ **Not specced for vendor branding.** Couple-only Live Stream branding exists today.

**Evidence in the app today:**
- `0011_live_stream/0011_live_stream.md` — V1 Live Stream. Custom Monogram Pack (₱2,000) replaces Setnayan logo with the couple's monogram on every output. Broadcast Style Pack (₱3,000) unlocks 4 modes (News / Cinematic / Sports / Royalty), all transitions, color presets. **There is no current feature to display vendor logos or brand plugs during the broadcast.**

**What's missing:**
- A "Vendor Brand Plug" feature in the Live Stream compositor — could be: rotating vendor logo in the upper-right during specific broadcast moments, or a hero-overlay that announces "Catering by Pearl & Plate" between scenes
- Trigger logic — broadcaster manually triggers, or auto-triggers based on the broadcast schedule (e.g., "show catering vendor logo during dinner block")
- Pricing model — same questions as 3.3 LED Background
- Vendor consent and opt-in

**Recommendation for vendor pitch:** Cannot promise in V1. Same overpromising risk as 3.3. Position as: "Vendor brand plugs in Live Stream broadcasts — planned for a future iteration once the Live Stream platform has launched and the Broadcast Style Pack pattern is validated."

---

## Section 4 — Summary gap analysis

| # | Benefit | Status | Evidence | What's missing |
|---|---|---|---|---|
| 1.1 | Data Analytics | ❌ | None | Whole new analytics iteration; needs vendor accounts + warehoused data + recommendation engine |
| 1.2 | Events Scheduler | 🚧 | 0006 vendor_meetings, 0007 deadlines, 0000 unified Schedule, .ics export | Vendor-side dashboard view (Din) |
| 1.3 | Vendor Landing Page | ❌ | Couple landing page pattern from 15 | Vendor account model + new iteration + reviews + verified-vendor badge |
| 1.4 | Trusted Vendors widget on couple's page | 🚧 | 0004 widget catalog, 0006 vendor records | New widget type added to 0004 (small spec extension) |
| 2.1 | Palette Maker | ✅ V1 / ⏳ vendor view | 0010 ships V1 | Vendor read-only view (Din) |
| 2.2 | Mood Board | 🚧 V1 / ⏳ vendor view | 0010 V1 = palettes only; richer Mood Board deferred | Mood Board V2 + vendor view |
| 2.3 | Seating Arrangement | ✅ V1 / ⏳ vendor view | 0008 ships V1; 0006 vendor crew_meal feed | Vendor read-only view (Din) |
| 2.4 | QR Scanner | ✅ V1 multi-use / ⏳ vendor-specific | 0002, 0008, 0012, 0000 all use QRs | Vendor-specific use cases (check-in, delivery log, etc.) |
| 3.1 | Vendor's own landing page | ❌ | None | Vendor account + new iteration |
| 3.2 | Vendor on couple's page | 🚧 | Couple landing page exists | Trusted Vendors widget (see 1.4) |
| 3.3 | Vendor logo on LED Background | ❌ | 0005 LED Maker exists; couple-only branding | New "Vendor Branding" feature with pricing model + opt-in |
| 3.4 | Vendor brand plug in Live Stream | ❌ | 0011 Live Stream exists; couple-only Custom Monogram Pack | New "Vendor Brand Plug" feature with pricing model + opt-in |

**Total:**
- ✅ Fully supported V1: 2 (palette, seating — both as couple-side tools)
- ✅ V1 + vendor view deferred: 2 (palette/mood, seating with vendor read-only access pending)
- 🚧 Partial: 4 (Events Scheduler, Trusted Vendors widget, Mood Board richness, QR scanner vendor-specific)
- ❌ Not specced: 4 (Data Analytics, Vendor Landing Page, LED vendor logo, Live Stream vendor plug)

**Honest read:** out of the 12 benefit items the pitch lists, only 2 (palette + seating, both couple-side) are fully shippable in V1 as the pitch describes. The other 10 are partial-or-missing and would not be honest to promise to V1 vendors.

---

## Section 5 — Recommended new iterations to close the gap

If you commit to delivering the full vendor pitch, here's the iteration ladder needed (in roughly the order they'd ship):

| Iteration | Scope | Estimated effort | Phase |
|---|---|---|---|
| **0014.5 (V1 small extension)** | `trusted_vendors` widget added to 0004 invitation widgets catalog. Simple grid of vendors on the couple's invitation page. No vendor consent flag in V1 (default-display); add in V1.1. | 2–3 days | V1 |
| **TD-1 — Vendor Accounts** (Din Phase 3 #1) | Vendor account model. Vendor sign-up flow. `vendor_users` table. Auth via Supabase. Free signup baseline. Vendor profile basic fields (logo, services, contact). | 2 weeks | Din launch |
| **TD-2 — Vendor Dashboard** (Din Phase 3 #2) | Vendor-side dashboard. Multi-event Schedule view (pulls from `event_members.vendor_id`). Read-only access to couple's palette + seating chart for events the vendor is attached to. In-app messaging with couples. | 3 weeks | Din launch + 2 mo |
| **TD-3 — Vendor Landing Page + Reviews** | A vendor's own landing page at `setnayan.com/v/[vendor-slug]`. Recent activity curation (pulled from couple-tagged photos / broadcasts they shot). Reviews 0–5 stars from couples who've worked with them. Verified Setnayan Badge with verification application flow. | 4 weeks | Din + 4 mo |
| **TD-4 — Vendor Brand Placement (LED + Live Stream)** | Adds vendor logo display to LED Background Maker (0005) and Live Stream broadcast (0011) compositors. Pricing model + opt-in flow on both sides. Couple consent + vendor consent both required for placement. | 6 weeks | Din + 6 mo |
| **TD-5 — Vendor Analytics Dashboard** | The analytics + recommendations features from Section 1.1 above. Requires accumulated marketplace data; deploy once 200+ vendors have 6+ months of bookings. | 8 weeks | Din + 12 mo |
| **TD-6 — Vendor SaaS Subscription Tiers** | Pro (₱500/mo) and Studio (₱1,500/mo) tiers — featured listings, advanced analytics, multi-user team access, calendar sync to Google Calendar / Outlook. Per the monetization model from earlier. | 4 weeks | Din + 14 mo |

Total realistic timeline from V1 launch to "full vendor pitch delivered": **14–18 months.**

---

## Section 6 — Honest vendor pitch by phase

What can be promised at each platform phase:

### V1 launch — what you can honestly tell a vendor on day 1

> "Setnayan currently lets your couples coordinate their wedding through a unified app — guest list, vendor list, schedule, mood board, seating chart. Your couple will use Setnayan to track their bookings with you and your payment milestones to you. They'll send you their wedding palette so your floral / styling / catering matches. They'll share their seating chart so your crew meals are calculated from real headcounts. Setnayan's vendor marketplace, vendor analytics, and vendor self-service dashboard launch in Din (Phase 3) — about 6–9 months from now. **Vendor signup at Din launch will be free.**"

**No paid vendor services in V1.** No Setnayan charges to vendors. The V1 message to vendors is "we're building toward a marketplace; here's the timeline."

### Din launch (V1 + ~6-9 months) — Phase 3 Day 1

Vendors who sign up at Din launch get:
- Free vendor account + profile
- Listed in Setnayan's vendor directory; couples can discover them
- Read-only access to the palette / seating / Schedule of any couple they're booked with via `event_members`
- In-app messaging with couples
- Multi-event Schedule view in their vendor dashboard
- The Trusted Vendors widget (already in V1) means their brand shows on the couples' invitation pages

**Still no paid vendor services. Free signup, free baseline.**

### Din + 4 months — vendor landing pages + reviews

- Vendors get their own landing page at `setnayan.com/v/[vendor-slug]` showing recent activities + reviews + Verified Setnayan Badge
- Couples can leave reviews on vendors they've worked with through Setnayan
- Verified Setnayan Badge available via application

### Din + 6 months — paid promotional placements

- "Vendor Brand Placement Pack" — vendor pays a small fee to opt-in to their logo appearing on couples' LED Backgrounds (3.3) and Live Stream broadcasts (3.4) for events they're booked with. Couple must also opt in. ~₱500-1,000/event-placement.
- This is the first paid vendor-side SKU.

### Din + 12 months — vendor analytics

- Vendor analytics dashboard (Section 1.1) ships once marketplace has scale.
- Vendors see: leads, conversion rates, comparison-to-peers, demand-by-category trends, recommendations.
- Available to vendors on the Pro and Studio SaaS tiers (introduced same time).

### Din + 14 months — vendor SaaS subscription tiers

- Pro (₱500/mo): featured listings, analytics, calendar sync.
- Studio (₱1,500/mo): everything in Pro + multi-user team access + bulk client management.

---

## Section 7 — Recommendation

**Don't publish the full pitch as written.** It overpromises against V1's actual capabilities by ~80%. Two paths forward:

**Option 1 — Ship the simple `trusted_vendors` widget in V1, narrow the pitch to honest claims.**

V1 vendor pitch reduces to 3 real promises:
- Your couple uses Setnayan to coordinate with you
- Your brand appears on the couple's invitation page (Trusted Vendors widget)
- Free vendor signup is coming with Din launch in 6–9 months

This is honest, deliverable, and doesn't burn future trust.

**Option 2 — Ship the full pitch but as a Din launch deck, not a V1 promise.**

Restructure the vendor pitch to be the **Din Phase 3 promise**. Each line items gets a "Available at Din launch (6–9 months)" or "Available 6 months post-Din launch" qualifier. Don't market this to vendors during V1. The V1 vendor surface is just couples coordinating with you through Setnayan's couple-side tools.

I recommend **Option 1** for V1 launch communications, with Option 2 prepared as the Din launch deck for Phase 3.

---

## Section 8 — Action items

If you accept the recommendation:

1. **Add the `trusted_vendors` widget to `0004_invitation_widgets/`** — small spec extension, 2–3 days of engineering. Closes one of the four 🚧 partial benefits.
2. **Draft the Din Phase 3 iteration ladder** — TD-1 through TD-6 above. Each gets its own iteration spec when Din planning begins.
3. **Trim the vendor pitch document** that exists outside this audit to remove every ❌-status benefit. Replace with the V1-honest version.
4. **Save a memory entry** documenting the vendor monetization stance (no fees in V1, free signup at Din launch, paid SaaS tiers at TD + 14 months) so future planning sessions stay aligned.
5. **Schedule the Din kick-off** for V1 launch + 4–6 months once V1 has launch data and the marketplace value proposition is grounded in real demand.

---

## Companion specs and cross-references

- `0000_app_shell_and_navigation/0000_app_shell_and_navigation.md` — unified Schedule tab + event_members + URL pattern.
- `0004_invitation_widgets/0004_invitation_widgets.md` — current widget catalog (where the `trusted_vendors` widget would be added).
- `0005_led_background_maker/0005_led_background_maker.md` — current LED branding (couple monogram only).
- `0006_vendors_management/0006_vendors_management.md` — vendor records + meetings + crew meals.
- `0007_budget_expenses/0007_budget_expenses.md` — vendor payment deadlines + .ics export.
- `0008_seating_chart_editor/0008_seating_chart_editor.md` — V1 seating chart.
- `0010_mood_board/0010_mood_board.md` — V1 palettes + Setnayan Guide rule engine (mood board features deferred).
- `0011_live_stream/0011_live_stream.md` — current Live Stream branding (Custom Monogram Pack — couple only).
- `15_Couple_Landing_Page_Feature_Specification.md` — couple landing page rendering pattern.
- `CLAUDE.md` — decision log including 2026-05-09 vendor monetization stance (free signup, layered SaaS post-Din).
