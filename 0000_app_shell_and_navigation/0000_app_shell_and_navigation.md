# Iteration 0000 — App Shell & Navigation

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - **The DIY-vs-"Setnayan Concierge ₱4,999" choice card (Step 2.5b) is RETIRED.** `CONCIERGE_ENABLED = false` in `lib/concierge.ts`; `create-event/actions.ts` coerces the `concierge_choice` field to `'diy'` (the `trial`/`paid` enum values are dead cutover stubs). The planner SKU on the live site is **"Setnayan AI" ₱1,499** (not Concierge ₱4,999), and the couple-app Setnayan AI *wizard* is itself retired — guidance now comes from onboarding + per-service deadline timeline.
> - **The token-wallet pill / Wallet route / "Wallet" Add-ons card are RETIRED** (customer token wallet 0003 retired 2026-05-11; the spec body already strikes most of these). Payment is apply-then-pay per 0034 with manual admin approval — no in-app balance.
> - **All nine event types are live, but tapping a type now jumps straight into that type's tailored onboarding** (`onboardingHref` — wedding = `/onboarding/wedding`; the rest fall back to the inline name form). The "swipe a hero-photo carousel → pick a card → name field appears" framing is one shipped variant; roster is `event-types.ts`.
> - **Event-scoped routing shipped as `/dashboard/[eventId]/...`** with tabs Overview/Guests/Vendors/Schedule/Services/Seat-plan/Landing/QR/Gallery + add-ons (richer than the 4-tab Guest List/Vendors/Schedule/Add-ons described here). Add-ons live under `/dashboard/[eventId]/add-ons/...`.
> - **Vendor accounts are NOT a V1 placeholder** — a full vendor self-service dashboard shipped at `/vendor-dashboard` (~24 routes). The "vendor row is a stub, Din is Phase 3" framing is superseded.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0000
**Topic:** The app shell. Login, event picker, bottom-nav tabs, event-scoped routing.
**Status:** Drafted 2026-05-09
**Companion specs:** every other iteration (0001–0012) plugs into this shell.

---

## What this iteration ships

This is the foundation that lets people actually open and use Setnayan. Without 0000, every other iteration's panels exist as orphan URLs with no way for users to find them.

In plain language, this iteration delivers six things:

1. A **way to sign in** to Setnayan (universal account — same account works whether you're a couple, a guest, or eventually a vendor).
2. A **list of the events you belong to** after sign-in (with smart auto-jump when there's only one active event).
3. **Event QR code** generated when an event is created — couples share it so guests can scan and join.
4. **Join flow via QR scan** — scan the event QR, app detects if you have an account, signs you in (or registers you), asks what role you're joining as, and adds you to the event with that role.
5. A **simple set of tabs at the bottom of the screen** so couples can move between Guest List, Vendors, Schedule, and Add-ons.
6. A **launcher page** for all the paid Setnayan features (Panood, Papic, Mood Board, Photo Delivery, LED Background). *(2026-06-04: "Wallet" removed — the token wallet is retired; payment is order-and-pay per 0034. See § wallet-drift note.)*

That's it. No new features, just the shell that holds everything together.

> **Vendor accounts are a placeholder in V1.** This iteration's account model can support vendor sign-in cleanly, but the vendor-side dashboard surface — what a vendor sees when they log in — is deferred to a future iteration (Din, the supplier app). The vendor row in the join flow exists as a stub: vendors can be invited but their full self-service experience comes later. V1 focuses on the wedding event itself — couples and guests.

---

## How a couple uses Setnayan (the full flow)

### Step 1 — Sign in

Couple opens `setnayan.com`. If they're not signed in, they see a login screen with two options: **email magic-link** or **password** (existing options inherited from 0001's auth).

Once signed in, what happens next depends on how many active events they have.

### Step 2 — What happens after sign-in

| Couple has... | What they see |
|---|---|
| 0 events | A welcome screen: "Let's create your first event." Big "+ Create event" button. |
| 1 active event | We auto-jump them straight into that event. They land on the Guest List tab. No picker shown. |
| 2 or more active events | The **event picker**. They tap which event they want to work on. |

"Active" means an event the couple hasn't archived. Archived events are still listed in the picker (under a collapsed "Archived" section) but they don't count toward the auto-jump rule.

### Step 2.5 — Picking the event type (when creating a new event)

When the couple taps "+ Create event," the first thing they see is a **swipeable hero-photo carousel of event types** (redesigned 2026-06-03 from emoji tiles — PR #882). Each type is a full-bleed photo card; the couple swipes/scrolls horizontally through all of them (arrows + dots assist on desktop — it no longer loops infinitely). **All nine event types are live** — full-color cards with a gold "Available" badge, all tappable. **Wedding** routes into the onboarding flow; **every other type** routes into the create-event form (Event-name input on the full-page picker). There is **no "coming soon" tier and no notify-me flow** — owner decision "keep everything live" (2026-06-03 · #884 "unlock all events"), which superseded the earlier Wedding+Debut-only staging. On the full-page picker the **Event name** input still appears only after a card is picked. Hero photos live at `apps/web/public/event-types/{type}.webp`. The live roster is the nine in `apps/web/app/dashboard/create-event/_components/event-types.ts` (Anniversary / Graduation / Reunion exist as DB enum values only — seedable, not picker cards yet).

| Event type | V1 status | What the card does when tapped |
|---|---|---|
| **Wedding** | ✅ Live (full-color, gold "Available" badge, tappable) | Routes into the onboarding flow |
| **Debut** | ✅ Live | Routes into the create-event form |
| **Gender Reveal** | ✅ Live | Routes into the create-event form |
| **Birthday** | ✅ Live | Routes into the create-event form |
| **Celebration** | ✅ Live | Routes into the create-event form |
| **Travel** | ✅ Live | Routes into the create-event form |
| **Corporate** | ✅ Live | Routes into the create-event form |
| **Tournament** | ✅ Live | Routes into the create-event form |
| **Christening** | ✅ Live | Routes into the create-event form |

When Weddings is tapped, the **simplified single-field event-setup flow** runs (locked 2026-05-14):

**Step 2.5a — Event-name-only entry**

The couple types ONE field: **Event name** (default placeholder: `"{first_name}'s Wedding"` autopopulated from `users.full_name`). **The Event name auto-formats to Smart PH-aware title case live as they type** (same `titleCaseName()` rule the guest list uses — see [0001](../0001_creating_guest_list/0001_creating_guest_list.md) + DECISION_LOG 2026-06-03; the seeding `users.full_name` is itself title-cased at sign-up). They tap **Create event**. The event is created with:

```sql
INSERT INTO events (
  event_type,           -- 'wedding'
  event_name,           -- whatever they typed
  wedding_date,         -- NULL (deferred to Setnayan Concierge Step 1 OR Profile edit)
  venue_name,           -- NULL (deferred to Setnayan Concierge Step 2 OR Profile edit)
  venue_address,        -- NULL (same)
  concierge_status      -- 'diy' (default; changes after Step 2.5b)
) VALUES (...);
```

**No date · no venue · no address asked upfront.** This was a deliberate change from the prior 4-field create form — couples often don't know their date or venue when they sign up, and asking those fields upfront blocked their entry. Date + venue are Steps 1 + 2 of the Setnayan Concierge (iteration 0016) OR easily-filled Profile fields for DIY couples.

**Step 2.5b — DIY vs Setnayan Concierge choice card** (originally locked 2026-05-14 as 4-option Guided Planner card; collapsed to 3-option Setnayan Concierge card 2026-05-16; simplified to 2-option single-SKU card 2026-05-17 per the second 2026-05-17 decision-log row — Essentials retired, 3-day account-level trial replaces 7-day per-event preview)

Immediately after event creation, the couple sees a two-option choice card. The choice determines `events.concierge_status`:

```
   How would you like to plan your wedding?

   (Anchor strip rendered above the cards:
    Wedding coordinator ₱25,000+   ·   Setnayan Concierge ₱4,999
    Less than your invitation suite. More than worth it.)

   ┌──────────────────┐  ┌──────────────────────────────┐
   │  DIY MODE        │  │  SETNAYAN CONCIERGE  ✨       │
   │  Free            │  │  ₱4,999                      │
   │                  │  │  12 months                   │
   │                  │  │  ₱13.69 / day                │
   │                  │  │  Less than ₱25K coordinator. │
   │ All tools.       │  │ Full 9-step roadmap +        │
   │ Plan at your     │  │ daily nudges + priority      │
   │ own pace.        │  │ vendor matching + honeymoon. │
   │ No timeline      │  │                              │
   │ help.            │  │                              │
   │                  │  │                              │
   │ [Start Free]     │  │ [Buy ₱4,999]                 │
   └──────────────────┘  └──────────────────────────────┘

      Not ready to commit? [ Try 3 days free → ] (no card required)

      Optional — activate or change anytime from Settings → Setnayan Concierge.
```

- **DIY** → `concierge_status = 'diy'`; lands directly on dashboard
- **Try 3 days free** → calls `start_concierge_trial(event_id)` server-side directly (no order, no checkout); on pass flips status to `'trial'` for 3 days with full Concierge features. **One trial per ACCOUNT** (tracked on `users.concierge_trial_used_at`, not per event). The trial link is **hidden when** the account has already used its trial OR `users.concierge_enforcement_level IN ('trial_banned', 'full_banned')`. If the cross-account similarity check fires, trial-start is blocked AND a `concierge_abuse_flags` row is inserted for admin review (couple sees the under-review modal with appeal CTA — see iteration 0016 § 0 Anti-abuse subsection).
- **Buy ₱4,999** → creates an unpaid `service_order` (per 0034 apply-then-pay) with the `concierge_complete` SKU, routes to checkout instructions screen; once admin reconciles payment, server action `activate_concierge(event_id, order_id)` flips `concierge_status = 'active'` + sets `concierge_tier = 'complete'` + computes `concierge_expires_at = NOW() + INTERVAL '12 months'`. Blocked at the order-creation step if `users.concierge_enforcement_level = 'full_banned'` (purchase path closed on full-banned accounts).

Couples picking the paid SKU still land on the dashboard immediately — the dashboard shows "Setnayan Concierge pending payment" state until reconciliation completes. They are NOT blocked unless full-banned.

All nine event types in the picker are **live** (owner: "keep everything live," 2026-06-03). The lineup still signals Setnayan's broader **event-platform** ambition beyond weddings — more event types get added over time as their iterations mature (Anniversary, Graduation, and Reunion already exist as DB enum values awaiting a picker card + hero photo). Adding one is a picker-config change — a roster entry in `event-types.ts` (`enabled: true`) + a `public/event-types/{type}.webp` hero photo — not UI rework.

Schema (implementation note: ENUM, not CHECK):

```sql
CREATE TYPE public.event_type AS ENUM (
  'wedding', 'birthday', 'celebration', 'travel', 'corporate', 'tournament', 'christening'
);

ALTER TABLE events ADD COLUMN event_type public.event_type NOT NULL DEFAULT 'wedding';
```

The default `'wedding'` is a safety net for any pre-0000 events the migration finds — they all get classified as weddings (which is correct for V1).

### Step 3 — The event picker (only shown when needed)

If the couple has 2+ active events, they see this:

```
┌──────────────────────────────────────────────┐
│  Hi Maria 👋                                 │
│  Which event are you working on?             │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ ⭐ Maria & Juan                         │ │  ← primary, sorted first
│  │   August 15, 2026 · 247 guests         │ │
│  │   Add-ons: 5 active                  │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │   Friend's wedding (collaborator)      │ │
│  │   November 2, 2026 · 80 guests         │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  + Create another event                      │
│                                              │
│  ▸ Archived events (3)                       │
└──────────────────────────────────────────────┘
```

The "primary" event (the first event the couple ever created) shows first with a star. The couple can change which one is primary in Settings. Tapping any card opens that event.

### Step 3.5 — How guests join an event (the QR flow)

When a couple creates an event, the backend automatically generates an **Event QR code** unique to that event. The couple shares this QR (printed at the venue, sent in invitations, posted in a group chat — wherever).

Anyone who scans it lands at:

```
setnayan.com/join/[event-id]?token=[event-token]
```

The app then walks them through this:

```
1. Are you signed in?
   YES → next step
   NO  → sign in (or register a new account if you don't have one)

2. Are you already part of this event?
   YES → log them in as their existing role; they go straight to the event
   NO  → ask: "What role are you joining as?"
        Show role picker (18 wedding roles from 0001's taxonomy):
        Bride · Groom · Best Man · Maid of Honor · Principal Sponsor · 
        Secondary Sponsor · Bearer · Flower Girl · Family · Friend · etc.

3. After role selection:
   - Their account gets linked to this event with the chosen role
   - Their existing Setnayan profile photo + name gets attached
   - They're now an event member and can see what their role allows
```

For couples, the same flow applies but they're the owner of the event (created the event, so already linked).

**Vendor join (V1 placeholder):** the same QR can be scanned by a vendor. The app will detect a vendor account type, ask which service they provided, and link them to the event's vendor list. The vendor-side dashboard view is deferred to a future iteration — in V1, scanning as a vendor stubs the link but the experience past that point is minimal. Couples still encode their vendor list manually in 0006 for V1.

### Step 4 — Inside an event

Once an event is open, this is what the couple sees every screen:

**Top of screen (chrome) — single persistent strip, responsive (locked 2026-05-14):**

| Layout | Mobile | Desktop |
|---|---|---|
| Pattern | `[Monogram] ........... [(I)]` | `[Monogram ▾] [Event Name · Date pill] ........... [(I)]` |
| Switcher trigger | long-press monogram | click caret next to monogram |
| Event identity in chrome | monogram only | monogram + event-name pill |

**Monogram (left):**
- Renders the canonical event monogram from iteration 0004 — `events.monogram_svg` (auto-generated case) or `events.monogram_uploaded_url` (uploaded case). **The auto-generated `events.monogram_svg` IS the free onboarding auto-monogram** (owner-locked 2026-06-03) — the screen-5 "What should we call it?" free auto-mark (initials + chosen luxe gold frame + premium font · the 0037 free baseline), persisted from the create-event flow per the [Onboarding Blueprint](../03_Strategy/Onboarding_Blueprint_2026-05-30.md) — so **every couple's switcher icon is their own gold-framed monogram from the moment onboarding completes**. At chrome size (~28px) the icon renders **letters-forward** (initials + a simple ring); the ornate frame reads in the larger onboarding medallion + the Website-editor monogram, not the tiny switcher disc. Falls back to a 1–2-letter circle of the event-name's initials **only for the pre-onboarding edge case** (events created before this binding, or a path that skipped screen 5).
- **Tap** → returns to the event dashboard from any sub-page.
- **Long-press** (mobile) / **caret affordance ▾** (desktop) → opens the event switcher (see below).
- **Empty state** (signed in, zero events) → behavior depends on the user's role (locked 2026-05-15, amends 2026-05-14 chrome row):
  - **Customer-only** (no vendor or admin grant) → renders as a "+" in a circle; tap launches the event-create flow per Step 2.5. (Original 2026-05-14 behavior preserved for this case.)
  - **Vendor with zero events** → renders as the vendor's logo (from `vendors.logo_r2_key`); tap routes directly to the Shop console (iteration 0022). No switcher opens — the vendor's home base IS the shop console; there is no event to switch to.
  - **Admin with zero events** → renders as the Setnayan admin badge (🟣 disc); tap routes directly to the Admin console (iteration 0023). Same no-switcher logic.
  - **Multi-role user with at least one event** → standard switcher (see below) regardless of which role they are currently in.

**(I) menu (right):**
- Custom dropdown (replaces the prior generic avatar / Clerk `<UserButton>` so we control item styling and copy).
- Tap → menu with **Profile**, **Settings**, **Sign Out**.

**Event switcher (anchored to the monogram):**
- Mobile pattern: bottom sheet rises from the bottom.
- Desktop pattern: dropdown / popover anchored under the monogram caret.
- Contents (top to bottom):
  1. `+ Add event` row → opens the same hero-photo event-type carousel as a bottom sheet (mobile) / popover (desktop), with all nine event types live + tappable. Subtitle: *"Swipe through and tap the one you're planning."* (The earlier "tap an upcoming tile to be notified" copy was removed 2026-06-03 — no notify flow; the "more event types unlock over time" line was replaced 2026-06-04 (#928) to match the all-live state.)
  2. Event list — primary first, marked with star; each row showing monogram + event name + wedding-date pill (or "date TBD" when `wedding_date IS NULL`).
  3. **Role-switch rows** (locked 2026-05-15) — thin separator above, then:
     - **Shop console** — visible when the user is a vendor owner (`vendors.owner_user_id = auth.uid()`) OR sits in any `vendor_service_agents.member_id` row. Tap routes to iteration 0022. When the user sits across multiple vendors, this expands into a sub-menu listing each vendor with its logo + business name; tap one to enter that shop console.
     - **Admin console** — visible when the user has any admin grant. Tap routes to iteration 0023.
- The role-switch rows complement the global "Switch view" pill from CLAUDE.md 2026-05-11. The pill is always-visible chrome; the switcher rows are inside the sheet for vendor admins whose mental model starts from "which event am I in."
- **Long-press an event row** (mobile) / **"..." kebab on the event row** (desktop) → "Set as primary." Replaces the prior Settings-based primary-event toggle. Role-switch rows do NOT have a kebab.

**Removed from prior chrome spec (2026-05-14):**
- **Token wallet pill.** Setnayan's actual payment model is order-and-pay (per iteration 0034); no wallet exists in the product. The pill was spec drift and is dropped from chrome. Other 0000 references to "Wallet" as an Add-ons card / route remain pending a separate cleanup pass.
- **Event name + date as a top-strip pill on mobile.** Kept on desktop; on mobile it surfaces only inside the switcher to keep the chrome minimal.

**Deferred to V1.1:**
- Centralized in-app notification **bell + feed** surface (separate from the per-iteration in-UI badges already shipped across V1, which remain). Email channel ships in V1 per iteration 0028.

**Bottom of screen (mobile) / left sidebar (desktop) — the four tabs:**

| Tab | Icon | What's inside |
|---|---|---|
| **Guest List** | 👥 | Everything about your guests — the list, your invitation site, place cards, seating chart. |
| **Vendors** | 💼 | Your vendor list and your budget. |
| **Schedule** | 📅 | One calendar view for everything time-based — meetings, payment deadlines, your event-day timeline. |
| **Add-ons** | ✨ | All the paid Setnayan features — Panood, Papic, Mood Board, Photo Delivery, LED. *(Wallet removed 2026-06-04 — token wallet retired; order-and-pay per 0034.)* |

The active tab is highlighted. Tapping a tab switches sections. Each tab has its own sub-pages but the bottom nav stays put.

---

## The four tabs in detail

### Guest List tab

Lives at `/dashboard/[event-id]/...`. Three sub-sections, switched via a pill row at the top of the screen:

| Sub-section | URL | Owned by |
|---|---|---|
| Guests | `/dashboard/[event-id]/guests` | 0001 |
| Invitation Site | `/dashboard/[event-id]/invitation` | 0002 + 0004 |
| Seating Chart | `/dashboard/[event-id]/seating` | 0008 |

Default landing inside the tab = Guests (the most common task).

### Vendors tab

Two sub-sections:

| Sub-section | URL | Owned by |
|---|---|---|
| Vendor List | `/dashboard/[event-id]/vendors` | 0006 |
| Budget | `/dashboard/[event-id]/budget` | 0007 |

Default landing = Vendor List.

### Schedule tab

One unified view at `/dashboard/[event-id]/schedule`. This is a **new surface** that 0000 ships — there's no single iteration that owns the schedule today, so 0000 builds the calendar view and pulls data from three sources:

1. **Vendor meetings** (from 0006 `vendor_meetings` table)
2. **Payment deadlines** (from 0007 `VendorLineItem.deadline_date`)
3. **Event-day timeline** (from 0004 `invitation_widgets` where `widget_type = 'schedule'`)

Plus the wedding date itself (from `events.wedding_date`) as a countdown header.

The view renders as a list grouped by date (today / tomorrow / this week / later) with options to switch to a month-grid view. Each item shows: time, title, source (color-coded dot), and a tap-target that opens the source iteration's detail page.

The .ics calendar export already exists in 0007 — the Schedule tab adds a "Subscribe to calendar" button that exposes it.

### Add-ons tab

A launcher grid at `/dashboard/[event-id]/services`. Each card represents one Setnayan feature:

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 🧾 Orders        │  │ 🎨 Mood Board    │  │ 📸 Papic     │
│ ₱2,500 active    │  │ 3 palettes saved │  │ Not yet bought   │
│ [View orders]    │  │ [Open]           │  │ [Buy seats]      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 📺 Panood   │  │ ☁ Photo Delivery │  │ 🌟 LED Background│
│ Tier 2 unlocked  │  │ Drive connected  │  │ Not yet bought   │
│ [Open]           │  │ [Open]           │  │ [Choose template]│
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

Each card shows three things:
- **Service name + icon**
- **Current state** (count, status, or "not yet bought")
- **One primary action** (Open / Buy / Connect / Top up)

Tapping a card routes to that service's detail page:

| Service | URL | Owned by |
|---|---|---|
| ~~Wallet~~ | ~~`/dashboard/[event-id]/services/wallet`~~ | ~~0003~~ — **RETIRED 2026-06-04** · token wallet removed; no wallet route exists. Payment is order-and-pay (0034). |
| Mood Board | `/dashboard/[event-id]/services/mood-board` | 0010 |
| LED Background | `/dashboard/[event-id]/services/led` | 0005 |
| Photo Delivery | `/dashboard/[event-id]/services/photo-delivery` | 0009 |
| Panood | `/dashboard/[event-id]/services/panood` | 0011 |
| Papic | `/dashboard/[event-id]/services/papic` | 0012 |

When a new service ships in a future iteration, it adds a card to the grid by registering with 0000's launcher manifest (a config file, not a database). One row of code per new service.

---

## Profile + Settings

Outside any event. Reachable from the avatar in the chrome (top-right). Lives at `/dashboard/profile`.

What's inside (V1):
- Couple name(s), email, phone
- Profile photo
- Login method (magic-link / password)
- "Make this event primary" event picker (so the couple can change which event auto-jumps)
- Sign out
- Delete account

This is intentionally minimal. Most settings that affect a single event live inside that event's tabs (e.g., Setnayan Guide on/off lives in 0010 Mood Board, not in global settings).

---

## URL pattern (locked)

This is the convention every iteration follows from 0000 forward:

| Pattern | Meaning |
|---|---|
| `setnayan.com/login` | Sign-in screen |
| `setnayan.com/dashboard` | Top-level (event picker if 2+ events; auto-redirect if 1 event) |
| `setnayan.com/dashboard/profile` | Profile + Settings (couple-level, no event scope) |
| `setnayan.com/dashboard/[event-id]` | Event home — auto-redirects to the Guest List tab's default sub-page |
| `setnayan.com/dashboard/[event-id]/[section]` | Any tab's sub-page (events/vendors/schedule/services/...) |
| `setnayan.com/dashboard/[event-id]/services/[service]` | A specific In-App Service's detail page |
| `setnayan.com/[event-slug]?invite=[token]` | Guest-facing personal invitation site (existing, owned by 0002) |
| `setnayan.com/[event-slug]/r/[render_id].mp4` | Hosted LED background playback (existing, owned by 0005) |

`[event-id]` is the database UUID. `[event-slug]` is the human-friendly slug used on guest-facing URLs (already a thing — owned by 0002).

---

## Schema changes

This iteration adds two columns to the existing `events` table, plus three new tables.

### Three columns on `events` (existing table from 0001)

```sql
ALTER TABLE events ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN archived   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN event_type public.event_type NOT NULL DEFAULT 'wedding';

CREATE UNIQUE INDEX events_one_primary_per_couple
  ON events (couple_id) WHERE is_primary = TRUE;
```

`event_type` defaults to `'wedding'` for any pre-existing rows. V1 only allows the create-event flow to set `'wedding'`; the other six values are reserved for future iterations.

### One new `users` table (universal Setnayan account)

This is the user's identity in Setnayan, separate from the role they play in any specific event. Same account can be a couple at one event, a guest at another, eventually a vendor at another.

```sql
CREATE TABLE users (
  user_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  phone        TEXT,
  display_name TEXT,
  profile_photo_url TEXT,
  account_type TEXT NOT NULL DEFAULT 'customer'
                 CHECK (account_type IN ('customer','vendor','admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_account_type ON users(account_type);

-- For existing deployments where the users table was created before this column existed:
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'customer'
              CHECK (account_type IN ('customer','vendor','admin'));
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
```

**`account_type` — locked 2026-05-12.** One login, three doorways. Every user has exactly one `account_type` at login time. `customer` is the default for self-registration; `vendor` is set when a user accepts a vendor-team invite (or registers as a vendor owner via `/register-vendor`); `admin` is set via the two-admin approval flow per § 9.1. The role-router in 0000 sends users to `/dashboard/customer/...`, `/dashboard/vendor/...`, or `/admin/...` based on this column. The previous design that derived role from `event_members.member_type` is retired — that table now describes the user's role within a specific event (couple/guest/vendor team-member), while `users.account_type` describes the user's permanent platform identity. A user is one of the three types globally; multi-role users (e.g., a vendor owner who is also a customer planning their own wedding) use the "Switch view" pill in the top chrome to flip between contexts, but their `account_type` row stays single-valued.

### One new `event_join_tokens` table (per-event QR)

One row per event. Backend generates the row when an event is created.

```sql
CREATE TABLE event_join_tokens (
  event_id    UUID PRIMARY KEY REFERENCES events,
  token       TEXT NOT NULL UNIQUE,           -- 32-hex
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at  TIMESTAMPTZ                      -- couple can rotate the QR if it leaks
);
```

The couple-facing QR URL: `setnayan.com/join/[event-id]?token=[token]`. Couples can rotate the token from event settings if it gets shared somewhere they didn't intend.

### One new `event_members` table (account ↔ event link)

This is how a Setnayan account becomes a guest of a specific event. It's separate from the existing `guests` table from 0001 because `guests` represents the couple's master list (someone the couple invited, who may or may not have ever signed in to Setnayan). `event_members` represents the actual signed-in user.

```sql
CREATE TABLE event_members (
  member_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events,
  user_id      UUID NOT NULL REFERENCES users,
  member_type  TEXT NOT NULL CHECK (member_type IN ('couple', 'guest', 'vendor')),
  role         TEXT,                           -- 18-value role for guests; service slug for vendors
  guest_id     UUID REFERENCES guests,         -- if this user matches an existing guest record
  vendor_id    UUID REFERENCES vendors,        -- if this user matches an existing vendor record
  joined_via   TEXT,                           -- 'qr_scan' | 'invited' | 'created_event'
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id, member_type)
);
```

When someone scans the event QR and signs in:
- If their email matches an existing `guests.email` for that event, the join links to that guest record (`guest_id` set).
- If no match, the backend creates a new `guests` row and links it.
- Vendors follow the same pattern with `vendors`. (V1 stops here for vendors — no vendor-facing dashboard yet.)

### The auto-jump query

```sql
SELECT e.event_id, e.is_primary, em.member_type
FROM event_members em
JOIN events e ON em.event_id = e.event_id
WHERE em.user_id = $1
  AND em.member_type = 'couple'
  AND e.archived = FALSE
ORDER BY e.is_primary DESC, e.wedding_date ASC;
```

Filters to `member_type = 'couple'` because only couples have the inside-event dashboard view in V1. Guests land on their invitation site (existing 0002 surface), not the dashboard. If exactly 1 row → redirect to that event's `/dashboard/[event-id]/guests`. Otherwise → show the picker.

---

## Builds on (consumes)

This iteration is the foundation, so it depends on very little:

| From | What 0000 needs |
|---|---|
| Existing platform | Authentication primitives (email magic-link sender, password reset, session cookies) |
| 0001 | The `events` table (0000 extends it with two columns) and the `couples` association |

That's the entire upstream dependency list.

---

## Provides (every other iteration consumes 0000)

| To | What 0000 publishes |
|---|---|
| 0001 | Dashboard chrome (top bar with event pill + avatar — **no wallet pill**; customer wallet retired → order-and-pay per 0034), bottom-nav routing, "Guest List" tab as the home for the guest list panel. |
| 0002 | Routes the guest QR admin and the invitation site editor under the Guest List tab. |
| ~~0003~~ | ~~Wallet pill + panel + receipt history~~ — **RETIRED 2026-06-04** (customer token wallet retired 2026-05-11; no wallet pill / panel / route). Payment is order-and-pay per **0034**; `service_catalog` survives under 0034. |
| 0004 | Routes the invitation widget editor under the Guest List tab. |
| 0005 | Adds a Services launcher card; routes the LED editor under the Add-ons tab. |
| 0006 | Routes the vendor registry under the Vendors tab. Publishes `vendor_meetings` to the unified Schedule view. |
| 0007 | Routes the budget panel under the Vendors tab. Publishes `VendorLineItem.deadline_date` to the unified Schedule view. |
| 0008 | Routes the seating chart under the Guest List tab. |
| 0009 | Adds a Services launcher card; routes the photo delivery panel under the Add-ons tab. |
| 0010 | Adds a Services launcher card; routes the mood board under the Add-ons tab. |
| 0011 | Adds a Services launcher card; routes the live stream panel under the Add-ons tab. |
| 0012 | Adds a Services launcher card; routes the couple-side gallery + seat purchase under the Add-ons tab. |

Each downstream iteration's `.md` spec must declare which tab it lives under so the shell knows where to route it.

---

## Build order

This is the foundation iteration. **Build 0000 first.** Sprint plan:

1. **Sprint 1** — Login screen + magic-link / password handling (extends existing primitives). Auth session cookie / JWT.
2. **Sprint 2** — Schema migration: add `is_primary` and `archived` columns to `events`. Backfill `is_primary = TRUE` for the oldest event of each existing couple.
3. **Sprint 3** — Event picker page (`/dashboard`). Auto-jump logic. Empty state for 0-event couples.
4. **Sprint 4** — Inside-event chrome: top bar (event pill + avatar — **no wallet pill**; customer wallet retired → order-and-pay per 0034) + bottom-nav (mobile) / sidebar (desktop). Active-tab highlighting. Routing setup for all four tabs.
5. **Sprint 5** — Schedule tab (the unified calendar view). Pull from `vendor_meetings`, `VendorLineItem`, and `invitation_widgets`. List view + month grid. .ics export reuse from 0007.
6. **Sprint 6** — Add-ons launcher grid. Card config manifest. Empty / unbought / connected states. Route to each service's detail page.
7. **Sprint 7** — Profile + Settings page. Avatar dropdown chrome. Sign-out flow.
8. **Sprint 8** — Polish + acceptance tests.

Iterations 0001–0012 can ship their internal panels in parallel; each plugs into 0000's routing once 0000's chrome is in place.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- [ ] `events.is_primary`, `events.archived`, and `events.event_type` columns exist with the partial unique index on `is_primary` and the `public.event_type` ENUM covering wedding, birthday, celebration, travel, corporate, tournament, christening.
- [ ] Create-event flow shows all nine event types as full-bleed hero-photo cards in a swipeable horizontal carousel (no infinite loop; arrows + dots assist on desktop); all nine are live and tappable (Wedding → onboarding flow, every other type → create-event form) with a gold "Available" badge; there is no "coming soon" tier and no notify flow; on the full-page picker the Event-name input is hidden until a card is picked.
- [ ] Newly created events have `event_type = 'wedding'`; other values can only be inserted via direct SQL (V1 has no UI path to them).
- [ ] `users`, `event_join_tokens`, `event_members` tables exist per schema above.
- [ ] When a couple creates an event, an `event_join_tokens` row is auto-created with a 32-hex token.
- [ ] On sign-in, the auto-jump query returns the right answer for the three cases (0 events, 1 active event, 2+ active events).
- [ ] Couples with 1 active event never see the event picker.
- [ ] Couples with 2+ active events always see the event picker on sign-in.
- [ ] The event picker sorts the primary event first.
- [ ] Scanning an event QR opens `/join/[event-id]?token=[token]` and walks through the four-step join flow (auth check → membership check → role picker → link).
- [ ] After joining, the new `event_members` row exists with the correct `member_type`, `role`, and `joined_via='qr_scan'`.
- [ ] If the joining user's email matches an existing `guests.email` for that event, the new `event_members` row's `guest_id` is set to that guest record.
- [ ] If no guest match, a new `guests` row is auto-created and linked.
- [ ] Vendor join via QR creates an `event_members` row with `member_type='vendor'` but the vendor-facing dashboard is intentionally minimal in V1 (placeholder for Din).
- [ ] Tapping an event card in the picker routes to `/dashboard/[event-id]` and lands on the Guest List tab.
- [ ] Inside an event, the four bottom-nav tabs are visible on mobile and as a sidebar on desktop.
- [ ] Active-tab highlight matches the current URL prefix.
- [ ] Top bar shows the event pill (with quick switcher) and the avatar (with Profile dropdown). *(No wallet pill — customer token wallet retired; payment is order-and-pay per 0034.)*
- [ ] Schedule tab pulls from all three sources (0004, 0006, 0007) and renders one unified calendar.
- [ ] Add-ons launcher shows one card per registered service with the correct state and primary action.
- [ ] Tapping a service card routes to that service's detail page under `/dashboard/[event-id]/services/[service]`.
- [ ] Profile + Settings page is reachable from the avatar dropdown and includes the "make this event primary" toggle.
- [ ] All event-scoped dashboard routes 404 if the signed-in user is not a `couple` member of that event.
- [ ] Couples can rotate (regenerate) the event QR token from event settings.
- [ ] Mobile tap targets are ≥ 44pt; bottom nav stays in the thumb zone.

---

## Open questions

- Do we need an "Invite a collaborator" feature in V1 so a couple can give planning access to a wedding planner or family member? Defer to V1.1.
- Does the event picker need a search bar? V1 says no — most couples have ≤ 2 events. Add if real-world usage shows otherwise.
- For the Schedule tab, should past items auto-collapse or stay visible? Default V1 = past items collapsed under a "Show past" link.

---

## Companion specs and cross-references

- `0001_creating_guest_list/` — extends the `events` table this iteration adds columns to.
- `0002_qr_invitation_system/` through `0012_papic/` — every iteration plugs into this shell. See each iteration's `.md` for which tab it lives under.
- `00_Iteration_Connection_Map.md` — top-level map of which iteration provides which contract.
- `CLAUDE.md` — decision log including the 2026-05-09 app shell architecture decision.

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0000_app_shell_and_navigation/0000_app_shell_and_navigation.html)
