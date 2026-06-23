# 0042 — Industry Events & B2B Vendor Marketing (Wedding Fairs, Expos, Networking)

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **NOT BUILT.** No `/industry-events` public page, no vendor-dashboard "Industry Events / Opportunities" tab, no `industry_events` table, and no `is_industry_event_organizer` vendor flag exist on `origin/main`. This is a V1.6+ paper spec for a B2B layer that has no code yet.
> - The spec's revenue tier is "gated on Phase 3 commission decision" — note that commission is now **0% platform-wide** (any 3%/5% Setnayan Pay cut is RETIRED). Any future B2B monetization here must use the live model (apply-then-pay SKUs / paid placements / vendor tokens), not a booking commission.
> - Booth-booking/payment is explicitly deferred to V1.7 "once 0034 payments stabilizes" — 0034 shipped as apply-then-pay + manual admin approval (no card charge), so any future booth payment inherits that model, not an automated charge.
> - Depends on 0041 (multi-event catalog), which also has not shipped its 38-category model — see the 0041 AS-BUILT note.
>
> When this body disagrees with the above, **the above wins.**

> **Purpose.** Add a second-tier event layer to Setnayan distinct from the consumer life-event model (0041): **industry events** where the audience is vendors/suppliers, not couples/customers. Captures wedding fairs (e.g. Getting Married Bridal Fair / GMBF), vendor expos, networking mixers, industry conferences, certification workshops, and Setnayan-organized events (à la Bridestory's "Wedding Connect"). Becomes a distribution channel for fair organizers, an opportunity feed for vendors, and an additional revenue surface for Setnayan.
>
> **Status:** drafted 2026-05-14 · architecture locked by owner this session
> **Companions:** none (markdown-only spec; no `.html`/`.docx` until owner refines)
> **Depends on:** vendor profile model (existing), iteration 0041 (multi-event vendor catalog — provides the vendor base that industry events promote to)
> **Companion iterations:** 0040 (Catalog Studio) for vendor service catalog · 0041 (Multi-event consumer catalog) for couple-side event types
> **Real-world precedent:** Bridestory Wedding Connect (Singapore, 300+ vendors); Getting Married Bridal Fair (Manila SMX, 134 exhibitors); Jenks Productions (US multi-city expo circuit, monetized via tiered booth packages)

---

## 1. Overview

Setnayan's V1 + V1.5 (after 0040 + 0041 ship) is a consumer marketplace: couples plan their own life events; vendors list services; Setnayan brokers the discovery + booking. This iteration adds a **separate, B2B layer** on the same platform.

**The opportunity (validated by research):**

1. Wedding fairs are large real-world events with no good aggregator platform in PH. Vendors learn about them through Facebook groups, word of mouth, or direct organizer outreach. **Distribution gap.**
2. Bridestory (Setnayan's regional competitor) hosted a single "Wedding Connect" networking event in Singapore that drew 300+ vendors. They haven't replicated in PH. **Open lane.**
3. US wedding-expo industry has a proven monetization model: tiered booth packages (base + featured + sponsored social + grand-prize-giveaway slots), with premiums 2-5x base fees. **Revenue blueprint.**
4. B2B event tech is moving to AI-powered vendor-attendee matchmaking (Bizzabo's 2025 launch). **Differentiation opportunity.**
5. PH-specific: vendors hire other vendors all the time (a photographer needs a DJ for their own studio anniversary; a planner refers a florist). Industry event listings + cross-vendor networking is a real need. **Filipino market fit.**

**What 0042 ships:**

- A new entity `industry_events` (distinct from consumer `events` in 0041)
- A new vendor profile flag `is_industry_event_organizer` (industry events are listed by special vendors, usually expo companies and associations)
- A new vendor dashboard tab "Industry Events / Opportunities" — calendar feed of fairs, expos, networking events
- A public `/industry-events` page so couples can also discover bridal fairs (some attend to meet vendors in person)
- Vendor actions: Apply as exhibitor · RSVP as attendee · Reserve booth (paid or free, depending on organizer)
- Setnayan-organized events: Setnayan itself can host networking sessions à la Bridestory Wedding Connect
- Revenue tier (gated on Phase 3 commission decision): free listing for all organizers; premium "Featured" / "Sponsored notification" for Pro tier; ticket sales + sponsorships for Setnayan-organized events

**What 0042 does NOT ship in V1.6:**

- AI-powered vendor matchmaking (deferred to V2)
- In-app booth booking/payment flow (deferred to V1.7 once 0034 payments stabilizes)
- Vendor-to-vendor private DMs for industry-event coordination (deferred to V2; use existing chat threads)
- Full conference/workshop registration system (deferred; for V1.6, "RSVP" is a soft signal not a registration system)
- Industry event review/rating system (deferred to V2 — needs critical mass)

---

## 2. Scope

**Concrete deliverables (V1.6):**

| # | Deliverable | Effort |
|---|---|---|
| 1 | New `industry_events` table + `industry_event_type` enum + RLS | 1 day |
| 2 | New `vendor_profiles.is_industry_event_organizer BOOLEAN` flag | 0.5 day |
| 3 | Organizer self-registration flow (vendor opts in as organizer; admin verifies) | 0.5 day |
| 4 | Organizer dashboard surface for managing their listed industry events | 1 day |
| 5 | Vendor dashboard new tab `/vendor-dashboard/opportunities` (calendar + filters) | 1 day |
| 6 | Public surface `/industry-events` (couples + vendors browse) | 1 day |
| 7 | Vendor RSVP/Apply-as-exhibitor actions + organizer-side roster view | 1 day |
| 8 | Notification triggers (vendor opt-in: "Notify me about industry events in [Metro Manila / National / etc.]") | 0.5 day |
| 9 | Email digest: weekly "Industry events near you" via Resend (extends iteration 0028) | 0.5 day |
| 10 | Marketing copy + onboarding nudge for first-time organizers | 0.5 day |
| 11 | **(V1.6 couple-side)** Home fair-promotion card + "vendors from your list are there" cross-ref (`industry_event_attendees` `attendance_type='exhibitor'` ∩ couple `event_vendors`), ≈100km proximity gate, zero-match fallback (§ 3.4a) | 1 day |

**Total:** ~8-9 days with parallel agents.

**Pre-launch partnership target:** Get GMBF organizers to list their 2026/2027 events on Setnayan first as a launch case study.

---

## 3. Architecture

### 3.1 Two parallel event models

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSUMER EVENTS (iteration 0041)                                │
│  events table                                                    │
│  Audience: couples, customers                                    │
│  Hosted by: the customer themselves                              │
│  Examples: wedding, baptism, debut, birthday, anniversary        │
│  Discovery: marketplace browse by category                       │
│  Monetization: Setnayan platform fees (Phase 3 decision)         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INDUSTRY EVENTS (iteration 0042 — this doc)                     │
│  industry_events table                                           │
│  Audience: vendors, suppliers, planners                          │
│  Hosted by: fair organizer, association, expo company, Setnayan  │
│  Examples: bridal fair, expo, networking mixer, certification    │
│  Discovery: calendar feed + filters (location, date, type)       │
│  Monetization: featured listings, booth promotion, ticket sales  │
└─────────────────────────────────────────────────────────────────┘

These coexist on the same platform but never mix data — different
schemas, different RLS, different UI surfaces.
```

### 3.2 Why two separate tables, not one polymorphic table

- Different audiences → different RLS rules → different access patterns
- Different lifecycle (consumer events are 1-couple-1-event; industry events are 1-organizer-many-attendee-vendors)
- Different monetization → different billing logic
- Different discoverability → consumer events are private to the couple; industry events are public

Polymorphism here would couple unrelated concerns. Separate is cleaner.

### 3.3 Industry event organizer = special vendor

An organizer (e.g. Jenks Productions, GMBF Producers, an industry association) is a **vendor** in Setnayan's existing model, with one flag: `is_industry_event_organizer: TRUE`. They have a vendor profile, a business name, a logo. What's different:

- Their "service" is hosting industry events — they don't list services in the consumer marketplace
- They get a new dashboard surface at `/vendor-dashboard/industry-events` to create + manage their event listings
- Admin verifies them (no anonymous organizers; prevents fake fair listings)

This keeps the user model simple — no new "organizer" account type.

### 3.4 Cross-listing: industry events visible on public marketplace too

Couples planning weddings often attend bridal fairs to meet vendors in person before booking. So `/industry-events` is **public** (no auth required), browsable by couples too. The vendor dashboard tab `/vendor-dashboard/opportunities` is a **filtered, action-oriented** view of the same data (with vendor-specific actions like Apply-as-exhibitor).

### 3.4a Couple-side fair promotion · "the vendors from your list are there" (V1.6 · owner-locked 2026-06-03)

Beyond the public `/industry-events` browse, an upcoming fair is **promoted on the couple's dashboard Home** when it's near their event region (≈100km proximity gate: the fair venue vs `events.venue_latitude/longitude`). The card cross-references the **fair's confirmed exhibitor roster against the couple's own vendor picks** and leads with **"N vendors from your list will be there"** — turning a generic listing into a personal reason to attend: go meet, in person, the vendors you're already considering, before you book.

- **Match key:** couple `event_vendors` picks → `vendor_profile_id` → ∈ `industry_event_attendees` WHERE `attendance_type = 'exhibitor'` AND `industry_event_id = <fair>`. Only **platform** vendors match; the couple's off-platform / custom picks (0006 hybrid registry) have no `vendor_profile_id` and are silently excluded from the count.
- **Why this is V1.6, not V1 Home:** the cross-ref needs a real exhibitor roster, which exists only once vendors self-apply as exhibitors (this iteration's `industry_event_attendees`). Owner chose "ride 0042" over a lightweight admin-tagged version on V1 Home (AskUserQuestion, 2026-06-03).
- **Lineage:** this is the **complement** of the retired Concierge "Behavior B" fair-prep card (CLAUDE.md 2026-05-23), which surfaced *what categories you still need*. That card died with the Setnayan AI wizard; its successor re-homes onto Home and answers the inverse — *which of your chosen vendors are there*.
- **Zero-match fallback:** if none of the couple's picks are exhibiting, the card degrades to the generic "what to look for" prompt (their still-open categories), so there's always a reason to attend.

---

## 4. Data model

### 4.1 New enum: `industry_event_type`

```sql
CREATE TYPE public.industry_event_type AS ENUM (
  'bridal_fair',            -- e.g. GMBF, big public-facing wedding fairs
  'wedding_expo',           -- vendor-only expos
  'vendor_networking',      -- mixers, after-hours, casual meetups
  'industry_conference',    -- multi-day industry conferences with talks
  'certification_workshop', -- training (e.g. flower arrangement, photography masterclass)
  'trade_show',             -- supplier-to-vendor sales (catering equipment, decor wholesale)
  'setnayan_event'          -- Setnayan-organized (Wedding Connect-style)
);
```

### 4.2 `industry_events` table

```sql
CREATE TABLE public.industry_events (
  industry_event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT NOT NULL UNIQUE DEFAULT generate_public_id('I'),
  organizer_vendor_profile_id UUID REFERENCES public.vendor_profiles(vendor_profile_id),
  -- if organized by Setnayan itself, organizer is a special "Setnayan" vendor profile
  
  event_type public.industry_event_type NOT NULL,
  title TEXT NOT NULL CHECK (length(title) <= 200),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{3,80}$'),
  description TEXT,
  cover_image_url TEXT,  -- R2-stored, see iteration 0040/0042 file-upload UI
  
  -- Logistics
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  city TEXT NOT NULL,                     -- "Pasay", "Metro Manila", "Cebu"
  venue_name TEXT,                        -- "SMX Convention Center"
  venue_address TEXT,
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  online_url TEXT,                        -- if virtual or hybrid
  
  -- Audience targeting
  target_audience TEXT[] NOT NULL DEFAULT ARRAY['vendors']::TEXT[]
    CHECK (target_audience <@ ARRAY['vendors','couples','suppliers','public']),
  applies_to_categories public.vendor_category[] NOT NULL DEFAULT ARRAY[]::public.vendor_category[],
  -- e.g., a Catering Trade Show would have applies_to_categories = ['catering','bartending_services','bar_equipment']
  applies_to_events public.event_type[] NOT NULL DEFAULT ARRAY[]::public.event_type[],
  -- e.g., a wedding-specific fair would have applies_to_events = ['wedding']
  
  -- Cost (for vendors attending/exhibiting)
  exhibitor_booth_php BIGINT,             -- base booth cost in centavos (NULL if free)
  attendee_ticket_php BIGINT,             -- attendee ticket cost (NULL if free)
  has_featured_listing BOOLEAN DEFAULT FALSE,  -- did organizer pay Setnayan for featured?
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','sold_out','cancelled','completed')),
  
  -- Workflow
  is_setnayan_organized BOOLEAN NOT NULL DEFAULT FALSE,
  external_registration_url TEXT,         -- some fairs handle their own registration
  
  -- Verification (admin must approve before published)
  verified_at TIMESTAMPTZ,
  verified_by_user_id UUID REFERENCES public.users(user_id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_industry_events_status_start ON public.industry_events(status, start_at);
CREATE INDEX idx_industry_events_city ON public.industry_events(city);
CREATE INDEX idx_industry_events_organizer ON public.industry_events(organizer_vendor_profile_id);
```

### 4.3 `industry_event_attendees` table

Tracks who's RSVPed / applied as exhibitor.

```sql
CREATE TABLE public.industry_event_attendees (
  attendee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT NOT NULL UNIQUE DEFAULT generate_public_id('A'),
  industry_event_id UUID NOT NULL REFERENCES public.industry_events(industry_event_id) ON DELETE CASCADE,
  vendor_profile_id UUID NOT NULL REFERENCES public.vendor_profiles(vendor_profile_id),
  attendance_type TEXT NOT NULL
    CHECK (attendance_type IN ('attendee','exhibitor','sponsor','speaker')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','cancelled','waitlist')),
  notes TEXT,  -- "Booth size requested" / "Special dietary"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (industry_event_id, vendor_profile_id, attendance_type)
);

CREATE INDEX idx_iea_event ON public.industry_event_attendees(industry_event_id);
CREATE INDEX idx_iea_vendor ON public.industry_event_attendees(vendor_profile_id);
```

### 4.4 `vendor_profiles` additions

```sql
ALTER TABLE public.vendor_profiles
  ADD COLUMN IF NOT EXISTS is_industry_event_organizer BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS organizer_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opportunity_notification_zones TEXT[] DEFAULT ARRAY[]::TEXT[];
  -- vendor opts in to receive "Industry Events near you" notifications for specific zones
```

### 4.5 RLS policies

```sql
-- industry_events: public read for published; organizer manages own; admin manages all
ALTER TABLE public.industry_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY industry_events_public_read ON public.industry_events
  FOR SELECT
  USING (status = 'published');

CREATE POLICY industry_events_organizer_manage ON public.industry_events
  FOR ALL
  USING (organizer_vendor_profile_id IN (SELECT current_vendor_profile_ids()))
  WITH CHECK (organizer_vendor_profile_id IN (SELECT current_vendor_profile_ids()));

CREATE POLICY industry_events_admin_manage ON public.industry_events
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- industry_event_attendees: vendor manages own; organizer reads own event's roster; admin reads all
ALTER TABLE public.industry_event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY iea_vendor_manage ON public.industry_event_attendees
  FOR ALL
  USING (vendor_profile_id IN (SELECT current_vendor_profile_ids()))
  WITH CHECK (vendor_profile_id IN (SELECT current_vendor_profile_ids()));

CREATE POLICY iea_organizer_read ON public.industry_event_attendees
  FOR SELECT
  USING (
    industry_event_id IN (
      SELECT industry_event_id FROM public.industry_events
      WHERE organizer_vendor_profile_id IN (SELECT current_vendor_profile_ids())
    )
  );

CREATE POLICY iea_admin ON public.industry_event_attendees
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
```

---

## 5. UI / UX

### 5.1 Public surface: `/industry-events`

```
┌─ Industry Events Near You ─────────────────────────────────────┐
│                                                                  │
│  [📍 Location: Metro Manila ▾]  [🗓 Date: Next 90 days ▾]      │
│  [🎪 Type: All ▾]                                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🎪 Getting Married Bridal Fair 2026                    │    │
│  │ Jan 24-26, 2026 · SMX Convention Center, Pasay         │    │
│  │ 134 exhibitors expected · For: vendors + public         │    │
│  │ Apply as exhibitor: ₱25,000 base booth · Free for couples│   │
│  │ [📌 Save] [Apply as exhibitor] [Buy attendee ticket]    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🤝 Setnayan Wedding Connect — Vendor Networking        │    │
│  │ Feb 14, 2026 · The Manila Hotel, Roxas Blvd           │    │
│  │ Vendors only · Limited to 300 attendees                │    │
│  │ Free for Setnayan Pro · ₱500 for non-Pro vendors      │    │
│  │ [📌 Save] [RSVP]                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

Filters: location, date range, event type, applies-to-categories, applies-to-events.

### 5.2 Vendor dashboard tab: `/vendor-dashboard/opportunities`

Same data as public surface but personalized:
- Default-filtered to vendor's `opportunity_notification_zones` (e.g. Metro Manila)
- Default-filtered to vendor's `event_types` (only shows fairs that target vendor's served events)
- Default-filtered to vendor's categories (only shows fairs applicable to vendor's category mix)
- Action buttons emphasize "Apply as exhibitor" (the high-intent path for vendors)
- Shows vendor's current RSVPs/applications in a side panel

### 5.3 Organizer dashboard: `/vendor-dashboard/industry-events` (only visible if `is_industry_event_organizer = TRUE`)

For the wedding-fair organizer:
- Create/edit industry events they're hosting
- View attendee/exhibitor roster (with RLS — only their own events)
- Mark featured listings (paid via Setnayan billing)
- Download attendee CSV (for their offline records)

### 5.4 Setnayan-organized event flow

Setnayan itself is a special vendor profile (`organizer_vendor_profile_id = setnayan_official_vendor`). Setnayan team uses the admin console to create events of type `setnayan_event` (e.g., "Wedding Connect Manila"). Vendors RSVP via the standard flow. Setnayan handles ticket sales via the existing 0034 payments system.

### 5.5 Notification triggers

Extends iteration 0028 (email notifications):
- New notification type `industry_event_announced` — fires when a new published industry event matches the vendor's `opportunity_notification_zones` + categories. In-app + Resend email.
- New notification type `industry_event_reminder_7d` — 7 days before an event a vendor has RSVPed to.
- Weekly digest: "5 upcoming industry events near you" email (opt-in).

---

## 6. Revenue model (gated on Phase 3 commission decision)

This iteration introduces a NEW revenue surface, distinct from the consumer-side marketplace.

### 6.1 Free tier (all organizers)

- Organizer can list their fair → appears in public + vendor calendar
- Vendors can RSVP / apply as exhibitor → notifications fire
- Basic listing (title, date, location, description, cover image)

### 6.2 Pro tier (paid; ties to Phase 3 decision)

- **Featured listing** — pinned top of `/industry-events` for the city, gold border, "Featured" badge
- **Sponsored notification** — instead of organic notification, pushes to ALL vendors in the city regardless of category match (broader reach, paid premium)
- **AI matchmaking** (V2) — auto-suggest top 50 vendors most likely to attend based on past behavior

### 6.3 Setnayan-organized events

Setnayan as organizer earns:
- Ticket sales (couples + non-Pro vendors)
- Sponsorship slots (other vendors sponsor a Setnayan-organized fair)
- Featured booth fees from exhibitors

### 6.4 Partner-fair commission (V2)

If Setnayan facilitates exhibitor booth booking (vendor pays through Setnayan instead of directly to organizer), Setnayan takes a commission (5-10%). Deferred to V2 — requires booth-booking flow which depends on 0034 payments maturity.

### 6.5 Fair-to-couple boost · "promote your fair to our couples" (owner-locked 2026-06-03)

The revenue line the owner asked for: a **fair organizer pays Setnayan to promote their event to all our ongoing couples** — distinct from §6.2's vendor-facing Sponsored notification (this targets the *couple* audience). Mechanically it bundles the existing boost-service deliverables (SEO Playbook §11.3 / §11.7): the homepage **featured-fairs strip** slot (hard cap 3 concurrent · T-60 window) + a **dedicated email blast** to all in-region couples (T-30 + T-7 via 0028) + the **§3.4a couple-Home promotion card** ("N vendors from your list will be there").

| SKU key | Tier | Setnayan provides | Price |
|---|---|---|---|
| `boost_featured_plus_email` | **Featured + email blast** | Homepage strip + `/fairs/[slug]` + email blast to all in-region couples + §3.4a couple-Home card | **₱9,999 / fair cycle** |
| `boost_featured_only` | Featured only | Homepage strip + `/fairs/[slug]` + §3.4a card, no dedicated blast | ₱2,999 / fair cycle *(playbook ladder · not separately re-confirmed)* |

- **Headline `₱9,999/cycle` is owner-locked (2026-06-03)** — priced **up** from the playbook's ₱4,999 starting suggestion to reflect the **3-slot scarcity** (only 3 concurrent boosted fairs nationally · §11.3.1) + the hyper-qualified in-market couple audience. Supersedes SEO Playbook §11.7's ₱4,999 example.
- **Model A barter alternative** stays an organizer choice (no cash; the fair gives Setnayan a free booth + stage time + sponsor billing + the discount-code funnel — §11.7 Model A). Organizer picks Model A or the cash tier at signup.
- **Launch gate (AND):** the paid cash boost does **not** open until **500 verified vendors AND 10,000 active couples** (§11.7.1). Pre-gate, lead with Model A / early-mover terms — promoting to a tiny base for ₱9,999 cash would sour the partnership. Admin manual-override for strategic launch partners (e.g. Themes & Motifs).
- **Validation caveat:** ₱9,999 is owner-locked but still wants a real PH fair-operator validation conversation before it's published as a public rate (§11.7).
- **Home reconciliation:** this folds the SEO Playbook's proposed `0036_bridal_fair_boost_service` into **0042** (0036 was reassigned to Pakanta). Contract boilerplate still lands at `01_Contracts/Bridal_Fair_Boost_Service_Agreement.md`. CLAUDE.md SKU / cost-sheet append pending operator-validation.
- **Admin home:** the fair roster is compiled and broadcast from **0023 § 3.16 Promoted Events & Broadcast Schedule** (`/admin/promoted-events`) — the admin clicks *Generate mass schedule* to push the fair into in-region couples' Home Upcoming-schedules + fire the blast (cron-free; supersedes § 11.3.1's daily-cron sketch).

---

## 7. Migration path

This is a NEW feature — no data migration needed for existing tables. Just the additive schema + UI.

### 7.1 Schema migration (single file)

```sql
-- 20260601000000_iteration_0042_industry_events.sql

-- 1. New enum
CREATE TYPE public.industry_event_type AS ENUM (
  'bridal_fair','wedding_expo','vendor_networking','industry_conference',
  'certification_workshop','trade_show','setnayan_event'
);

-- 2. Public ID prefix for industry events (I) and attendees (A) — register in spec corpus
-- (depends on register_id_letter system)

-- 3. industry_events table (full DDL from § 4.2)

-- 4. industry_event_attendees table (full DDL from § 4.3)

-- 5. vendor_profiles additions (from § 4.4)

-- 6. RLS policies (from § 4.5)

-- 7. New notification types
ALTER TYPE public.notification_type
  ADD VALUE IF NOT EXISTS 'industry_event_announced';
ALTER TYPE public.notification_type
  ADD VALUE IF NOT EXISTS 'industry_event_reminder_7d';
```

### 7.2 Lib changes

- New `lib/industry-events.ts` — types, fetch helpers, status enums, audience constants
- Extend `lib/notifications.ts` — handlers for the 2 new notification types
- New `lib/i18n` keys for the surface labels

### 7.3 UI changes

- New route group `/industry-events` (public)
- New vendor dashboard tab + route `/vendor-dashboard/opportunities`
- New organizer dashboard route `/vendor-dashboard/industry-events` (conditionally rendered)
- New admin queue `/admin/industry-events` for organizer verification + event approval

### 7.4 Setnayan-as-organizer setup

- Create a special vendor_profile row for "Setnayan" itself (singleton, `is_industry_event_organizer = TRUE`, `is_setnayan_official = TRUE` — new flag)
- Admin console can post events on behalf of Setnayan

---

## 8. Tests (scenario-based)

### 8.1 Fair organizer journey

1. ✅ Fair organizer signs up as vendor at `/signup` → picks "Vendor"
2. ✅ Goes to `/vendor-dashboard/profile` → checks "I organize industry events" → status changes to `is_industry_event_organizer = TRUE`
3. ✅ Admin sees them in `/admin/industry-events` verification queue → verifies them (clicks "Approve as organizer")
4. ✅ Organizer now has a new dashboard tab `/vendor-dashboard/industry-events`
5. ✅ Creates an event: "Pinoy Wedding Fair 2026" · type bridal_fair · Manila · Mar 15 2026
6. ✅ Submits for admin approval; event sits in `draft` then admin moves to `published`
7. ✅ Event appears on public `/industry-events` and on all matching vendors' `/vendor-dashboard/opportunities` tab
8. ✅ Vendors RSVP / apply as exhibitor → organizer sees roster in their event detail page
9. ✅ Organizer downloads attendee CSV → manages day-of operations offline

### 8.2 Vendor opportunity discovery

1. ✅ Vendor goes to `/vendor-dashboard/opportunities`
2. ✅ Defaults: filtered to their `opportunity_notification_zones` + their `vendor_profiles.event_types`
3. ✅ Sees 3 upcoming events: Pinoy Wedding Fair, Setnayan Wedding Connect, Catering Trade Show
4. ✅ Clicks "Apply as exhibitor" on Pinoy Wedding Fair → row inserted in `industry_event_attendees` with `status = pending`
5. ✅ Organizer confirms → status updates to `confirmed` → vendor notified in-app + email
6. ✅ 7 days before event: vendor receives reminder notification

### 8.3 Couple discovers a bridal fair

1. ✅ Couple browsing `/industry-events` (no auth required)
2. ✅ Sees Pinoy Wedding Fair March 15 · public attendee ticket ₱200
3. ✅ Clicks "Buy attendee ticket" → if Setnayan-handled payment, routes through 0034 orders flow; if external, routes to organizer's external_registration_url
4. ✅ Couple attends fair, meets vendors in person; vendor-couple chat threads may already exist from Setnayan

### 8.4 Setnayan-organized event

1. ✅ Setnayan team uses `/admin/industry-events/new` to create "Wedding Connect Manila 2026" · type setnayan_event · Feb 14 · The Manila Hotel
2. ✅ Event is auto-organizer = Setnayan official profile
3. ✅ Pricing: free for Pro vendors, ₱500 for non-Pro (Phase 3 commission decision dependency)
4. ✅ Vendors RSVP → confirmed → reminded → attend
5. ✅ Post-event: Setnayan team marks event as `completed` and emails follow-up survey

### 8.5 RLS / access control

1. ✅ Anonymous user can SELECT from industry_events WHERE status = 'published' but nothing else
2. ✅ Vendor A cannot modify Vendor B's events
3. ✅ Organizer cannot see attendees of events they don't organize
4. ✅ Admin sees everything

---

## 9. Open questions for the owner

### 9.1 Audience for `/industry-events` page (BLOCKING)

Should industry events be:
- **(a) Public** — couples see them too (they often want to attend bridal fairs to meet vendors in person)
- **(b) Vendor-only** — gated to logged-in vendors; couples don't see them on Setnayan
- **(c) Hybrid** — public listings, but some events (vendor networking) hidden from couples

Recommendation: **(c) Hybrid**. Bridal fairs are public-facing in real life (GMBF sells public attendee tickets). Networking mixers are vendor-only. Make this a per-event `target_audience[]` field (already in schema § 4.2).

### 9.2 Setnayan as organizer from day 1?

Should Setnayan launch 0042 with one Setnayan-organized event (e.g. "Setnayan Wedding Connect Manila 2026") as the anchor, or wait for organic organizer adoption?

Recommendation: **YES, launch with one Setnayan event**. Lighthouse case study, draws vendors to the surface, demonstrates the value. Pick a date 60-90 days post-launch.

### 9.3 Phase 3 commission model — affects this iteration too

The Free vs Pro tier featured-listing model depends on the Phase 3 marketplace commission decision (the same blocking decision for 0040 and 0041). Resolve once across all three iterations.

### 9.4 Partnership with GMBF (or another major PH fair organizer)

Should Setnayan reach out to GMBF organizers before launch to secure them as a launch partner (their 2026/2027 events listed exclusively on Setnayan first)? This would be a marketing coup but requires owner-level outreach.

Recommendation: **Yes — owner-level outreach within the V1.5 sprint window (before 0042 ships)**.

### 9.5 Vendor-to-vendor chat threads for industry-event coordination

When a vendor RSVPs for a fair, should we auto-create a thread between them and the organizer? Or leave coordination to existing email/phone?

Recommendation: **No auto-thread in V1.6.** Organizer downloads attendee CSV and emails their list. Auto-threading bloats the chat surface. Revisit in V1.7 if vendors complain.

### 9.6 Booth booking flow — Setnayan handles payment or external?

If a fair charges ₱25,000 per exhibitor booth:
- **(a) Setnayan handles payment via 0034 orders flow** — Setnayan takes commission, organizer gets paid out via Setnayan disbursement (TBD — needs 0034 disbursement feature)
- **(b) External — organizer collects directly** — Setnayan just routes to organizer's payment link / bank details

Recommendation: **(b) External for V1.6**. Defer (a) to V1.7 once 0034 payment disbursement is built.

### 9.7 Cross-listing with `/vendors` marketplace?

Should fairs appear in `/vendors` marketplace too (under a special "Industry Events" category), or only on `/industry-events`?

Recommendation: **Only on `/industry-events`** — keeps the two concepts cleanly separated. Cross-link in the dashboard nav.

### 9.8 Reviews / ratings for industry events?

After an event completes, should attendees be able to review/rate it (à la Eventbrite)?

Recommendation: **Defer to V2.** Needs critical mass of attendees per event to be meaningful. Premature in V1.6.

### 9.9 PH partnership target list

Top 5 PH wedding industry events to court for launch listings:
- Getting Married Bridal Fair (GMBF) — SMX Manila
- Wedding Connect Philippines (if Bridestory hasn't trademarked the name)
- The Wedding Library (boutique events)
- Manila Bridal Show (recurring)
- WedCon (vendor-only industry conference, if it exists)

Plus international that PH vendors travel to:
- Wedding MBA (Las Vegas, October)
- WeddingPro CEO Summit
- Wedding Industry Conference

### 9.10 Localization of event categories for Setnayan-organized events

Beyond bridal fairs and vendor networking, what other formats should Setnayan organize?
- Vendor business workshops (e.g., "Pricing your wedding catering profitably")
- Annual award show ("Setnayan Top 100 Vendors 2026")
- Skill clinics (with masterclass-style organizers)
- Cross-vendor matchmaking event (caterers ↔ florists pairing speed-dating)

These could be a 3-year roadmap, not all at V1.6.

---

## 10. Resume checklist (for whoever picks this up next)

When implementation begins (post-spec-refinement):

1. Read this spec end-to-end + reach owner alignment on the 10 open questions
2. Resolve the audience question (§ 9.1) — determines whether `/industry-events` route exists at all or is vendor-only
3. Confirm GMBF partnership status (§ 9.4) — affects launch positioning
4. Branch off latest main: `git checkout -b claude/iteration-0042-industry-events`
5. Schema migration first (§ 7.1) — apply, smoke-test
6. Lib + types (§ 7.2)
7. Organizer dashboard surfaces (§ 5.3)
8. Vendor dashboard tab (§ 5.2)
9. Public surface (§ 5.1) — if § 9.1 is resolved to public/hybrid
10. Admin verification queue
11. Notification triggers (§ 5.5)
12. Setnayan-as-organizer setup (§ 7.4) + first Setnayan event seeded

Parallel-agent allocation:
- Agent 1: schema + lib foundation
- Agent 2: organizer dashboard + admin verification
- Agent 3: vendor opportunities feed + public surface
- Agent 4: notifications + email digest

Estimated parallel-agent effort: 5-7 days end-to-end.

---

## 11. Strategic context (for refresher)

Setnayan post-0040 + 0041 + 0042 becomes the only platform where:

- ✅ **Couples** plan any life event (wedding, baptism, debut, birthday, anniversary, corporate, religious)
- ✅ **Vendors** serve multiple event types from one profile, with rich configurable catalog
- ✅ **Vendors** discover networking + business opportunities via Industry Events feed
- ✅ **Fair organizers** reach a curated, verified vendor base for exhibitor recruitment
- ✅ **Setnayan itself** organizes Wedding Connect-style events as a marketing + revenue surface

No competitor in PH or globally has all five. TheKnot is wedding-only directory. HoneyBook is vendor CRM with no fair listings. Bridestory hosted one Wedding Connect but doesn't have a persistent platform feature for it. Eventbrite has events but no industry-vendor matchmaking. Setnayan can own this niche.

This iteration is the **B2B layer** that turns Setnayan from a marketplace into a **wedding industry platform**.

---

*Drafted 2026-05-14 by owner + Claude Code session. Will refine in Cowork.*
