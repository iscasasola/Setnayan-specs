# 0001 — Create Guest List Management

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard · **Bottom-nav tab: Guest List** · URL: `setnayan.com/dashboard/[event-id]/guests`
**Builds on:** 0000 (app shell, sign-in, event picker, bottom-nav routing, `users` + `event_members` tables, event-scoped URLs)
**Phase:** Phase 1 (web-first build sequence, locked 2026-05-08)
**Status:** Ready for Claude Code
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)

---

## What to build

The couple-facing guest list management page on the Setnayan web dashboard. The couple uses this page to add, edit, categorize, filter, and track RSVPs for every guest invited to their wedding. This is the foundational data surface for the entire wedding lifecycle — invitations, seating chart, paparazzi seat assignments, vendor coordination, and gallery access all read off the guest list.

This is the first concrete feature being built for Setnayan, and it's gated by being on web (per the locked Phase 1 sequence).

---

## Visual reference (canonical)

`0001_creating_guest_list.html` (in this same folder) is the canonical visual reference. Open it and look at:

- The **desktop frame** for the full dashboard layout — top nav, page header, stats strip, toolbar, two-column body (filter facets + guest table), detail drawer on the right, add-guest modal.
- The **mobile frame** for responsive behavior — compact app header, stat strip, horizontal-scrolling filter chips, card-list, FAB, bottom tab bar.
- The **typography and color tokens** in the `<style>` block — these are the Filipino Heritage theme tokens (cream `#FAF6F0`, charcoal `#1A1A1A`, terracotta `#C97B4B`, fonts Cormorant Garamond + Manrope + DM Mono). Reuse them — don't reinvent.

The implementation must visually match the mockup at desktop and mobile widths. Pixel-perfect parity isn't required, but the layout, hierarchy, color coding (bride/groom/both, RSVP states, role chips), and component primitives (rsvp-pill, tag, filter-chip) must all be there.

---

## Stack & conventions

Per `CLAUDE.md` and `15_Couple_Landing_Page_Feature_Specification.md`:

- **Frontend:** Next.js 15 App Router, React Server Components for the list view; Client Components for interactive bits (search, filter, drawer, modal). TypeScript strict.
- **UI:** Tailwind for styling; reuse the design tokens from the mockup. shadcn/ui for primitive components (Dialog, Sheet, Select, Input, Button, Tabs) where it accelerates development. Otherwise inline components.
- **Data:** Postgres via the existing Setnayan backend. Prisma or Drizzle (whatever the repo already uses — defer to existing convention).
- **Auth:** the couple must be logged in via the existing Setnayan couple-auth flow before they can access the dashboard. Server-side guard: redirect to login if not authenticated; redirect to events landing if authenticated user has no event bound.
- **Validation:** Zod schemas server- and client-side for all guest data.

---

## Route

```
setnayan.com/dashboard/guests
```

This sits inside the couple dashboard. Nested under the existing dashboard shell (top nav, event pill, avatar). If the dashboard shell doesn't exist yet, build a minimal version per the mockup and document it as a separate concern in a follow-up ticket.

---

## Data model

### `guests` table

```sql
CREATE TABLE guests (
  guest_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  household_id        UUID REFERENCES households(household_id) ON DELETE SET NULL,
  pair_with_guest_id  UUID REFERENCES guests(guest_id) ON DELETE SET NULL,
    -- For paired entries (e.g., principal sponsor couples). When set, the two
    -- guests share a row in the UI and one invitation. Symmetric: if A pairs with B,
    -- B should also pair with A.
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  display_name        TEXT,
    -- Optional override. e.g., "Tito Boy & Tita Cora" for paired sponsors,
    -- or "Lola Adela" when first/last formal names feel wrong.
  side                TEXT NOT NULL CHECK (side IN ('bride', 'groom', 'both')),
  group_category      TEXT NOT NULL CHECK (group_category IN
                        ('family', 'friends', 'work', 'school', 'officiant', 'other')),
  role                TEXT NOT NULL DEFAULT 'guest',
    -- Enum below. CHECK constraint enforces the full Filipino-wedding role taxonomy.
  plus_one_allowed    BOOLEAN NOT NULL DEFAULT FALSE,
    -- Per-guest opt-in. Couples must explicitly grant +1 privilege per guest. Default OFF —
    -- "offer a +1 to this guest" is a deliberate decision the couple makes, never automatic.
  plus_one_name       TEXT,
    -- Quick-entry display name. NULL when allowed but not yet named ("TBA" in the mockup).
    -- Once the couple fills in the +1's actual details, the canonical +1 is a SEPARATE
    -- guests row (see plus_one_of_guest_id below); plus_one_name remains as the original
    -- placeholder label and as a UI hint on the primary's row ("+ Andres T." vs "+ TBA").
  plus_one_of_guest_id UUID REFERENCES guests(guest_id) ON DELETE SET NULL,
    -- When set, THIS row is itself a +1, invited under the referenced primary guest.
    -- A +1 is a first-class guests row: its own first/last name, its own qr_token, its own
    -- RSVP state, its own meal preference. The QR is NOT shared with the primary — every
    -- guest (including +1s) has their own QR. The link is purely relational.
  plus_one_mode       TEXT CHECK (plus_one_mode IN ('full', 'limited')) DEFAULT NULL,
    -- NULL when this row is a primary guest (i.e., plus_one_of_guest_id IS NULL).
    -- 'full'    — +1 has full Setnayan guest experience: their own personal invitation site,
    --             can register a Setnayan account, gets Shutter / Selfie Camera / Photo
    --             Challenges / reel builder like any other registered guest.
    -- 'limited' — +1 can be tagged in photos and submit RSVP, and their QR works for
    --             paparazzi tagging, but they CANNOT use the in-app features (Shutter,
    --             Selfie Camera, Challenges, reel builder). Photos tagged to a limited
    --             +1 auto-route into the primary inviter's gallery — the limited +1's
    --             "photos" connect to the inviter, who is the one with app access.
    -- Couples pick 'limited' for kids, casual plus-ones, or anyone they don't want
    -- participating in event challenges. Default for newly created +1s is 'full'.
  email               TEXT,
  mobile              TEXT,
  address             JSONB,
    -- {street, barangay, city, region, country, postal} — used for printed save-the-dates.
  meal_preference     TEXT CHECK (meal_preference IN
                        ('beef', 'chicken', 'fish', 'vegetarian', 'vegan', 'kids', 'no_preference')),
  dietary_restrictions TEXT,
  photo_consent       BOOLEAN NOT NULL DEFAULT TRUE,
    -- PH Data Privacy Act compliance. FALSE means face-blur in the gallery (per spec 10).
  table_assignment_id UUID REFERENCES tables(table_id) ON DELETE SET NULL,
  invited_to_blocks   TEXT[] NOT NULL DEFAULT ARRAY['ceremony', 'reception']::TEXT[],
    -- Multi-select: which schedule blocks this guest is invited to.
    -- Block keys match the event's schedule blocks (ceremony, reception, cocktails,
    -- after_party, rehearsal_dinner). Couples toggle these per guest.
  custom_tags         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  rsvp_status         TEXT NOT NULL DEFAULT 'pending'
                        CHECK (rsvp_status IN ('pending', 'attending', 'declined', 'maybe')),
  rsvp_responded_at   TIMESTAMPTZ,
  invitation_sent_at  TIMESTAMPTZ,
  notes               TEXT,
    -- Private to the couple. Shown in the detail drawer notes section.
  qr_token            TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    -- Per spec 10, every guest gets a personal QR token. Same token format as
    -- the unified QR scheme: setnayan://guest/{guest_id}?token={qr_token}.
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_guests_event_rsvp ON guests(event_id, rsvp_status);
CREATE INDEX idx_guests_household ON guests(household_id);
CREATE INDEX idx_guests_qr_token ON guests(qr_token);
```

### `households` table

```sql
CREATE TABLE households (
  household_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
    -- Display label, e.g., "Reyes household", "De la Cruz household".
  address       JSONB,
    -- Shared mailing address for the household — used by the invitation system.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Role taxonomy (enum values)

The `guests.role` column accepts:

```
guest                       -- default
maid_of_honor
matron_of_honor
best_man
bridesmaid
groomsman
principal_sponsor           -- Ninong / Ninang (Filipino-Catholic structural role)
candle_sponsor
veil_sponsor
cord_sponsor
coin_sponsor                -- Arrhae sponsor
ring_bearer
bible_bearer
coin_bearer
flower_girl
officiant
reader_lector
soloist_musician
```

Add a `CHECK (role IN (...))` constraint with all 18 values, or implement as a Postgres ENUM type. ENUM is preferred for clarity; if the project already has a `_role_enum` convention, follow it.

---

## Page composition (desktop)

Match the mockup. Top to bottom:

1. **Dashboard top nav** (existing shell) — Setnayan brand, nav links (Overview, Landing Page, Guests active, Schedule, Suppliers, Gallery, Settings), event pill (couple names + days-out), avatar.
2. **Page header** — breadcrumb "Dashboard / Guests", H1 "Guest List", action buttons right-aligned: Import CSV, Export, Send invitations, **+ Add guest** (primary).
3. **Stats strip** — five cards: Invited, Attending (green-accented), Pending (amber-accented), Declined (red-accented), Plus-Ones. Numbers + sub-line context.
4. **Toolbar** — search box (left), filter chips (RSVP status + side), sort menu (right).
5. **Two-column body**:
   - **Left rail (240px sticky)** — facets sidebar: View (All, Wedding Party, Principal Sponsors, Secondary Sponsors, Bearers & Flower Girls, Family, Friends, Work, By Household), Custom Tags, Events.
   - **Main area** — guest list card with column header row + guest rows.
6. **Detail drawer (380px)** — slides in from the right when a guest row is clicked. Shows guest info grouped by Categorization / RSVP & Events / Contact / Notes, with action buttons at the bottom (Edit, Resend invitation, Remove).
7. **Add guest modal** — overlays the page when "+ Add guest" is clicked. Modal width 720px, max-height 90vh with scroll if needed. Form fields organized as a **2-column grid with consistent sizing for every input/select/textarea** — uniform 46px height, uniform border radius (10px), uniform padding (12px 14px), uniform font size (14px). Field rows top to bottom:
   1. First name * | Last name *
   2. Display name (optional) | Household
   3. Side * | Group *
   4. Role in wedding * | Plus-one toggle (default OFF)
      - When toggled ON, an inline sub-block reveals two extra rows below this one (still
        respecting the 2-column grid + uniform-height rule):
        - Sub-row A: Plus-one first name | Plus-one last name (both optional → "TBA" if blank)
        - Sub-row B: Plus-one access mode (segmented radio: `Full` default | `Limited`) — full-width
      - Saving creates the second `guests` row for the +1 with its own qr_token (see Functional
        scope · Plus-one management).
   5. Email | Mobile
   6. Meal | RSVP status
   7. Dietary restrictions (full-width — long allergy notes)
   8. Photo consent (full-width checkbox row, defaults checked, PH-DPA gate)
   9. Invited to (full-width chip selector — Ceremony, Reception, Cocktails, After-Party, Rehearsal Dinner; Ceremony + Reception default selected)
   10. Custom tags (full-width — type and press Enter)
   11. Notes (full-width textarea, private to couple)

   **Consistency rule:** every single-line field — input, select, dropdown, checkbox-row — has the same outer height (46px) and the same border-radius/padding. The textarea is the only exception (96px height). Don't let any field stretch to full-width unless it's in the explicit full-width list above (Dietary, Photo Consent, Invited To, Custom Tags, Notes). Selects with long option text (Role in wedding has 18 values) must NOT expand the field — keep the field half-width and let the dropdown menu render at full text width when opened.

   Footer (sticky bottom of modal): Cancel | Save & add another | Save guest (terracotta primary).

## Page composition (mobile)

Mobile is **not a scaled-down desktop**. It follows mobile-native conventions: thumb-zone primary actions, ≥44pt tap targets everywhere, simpler hierarchy, progressive disclosure. Match the mobile frame. Top to bottom:

1. **App header (60pt tall)** — back button (44×44pt, left edge), title "Guests" with count subline "212 guests", and **a single icon button** for search (44×44pt) on the right. No import/export/CSV buttons on mobile — couples do power-user actions on desktop.
2. **Status row** — a single horizontal row of three color-coded pills: "134 going" (green), "60 pending" (amber), "18 declined" (red). Replaces the desktop's 4-card stat grid; vertical density is wrong on mobile.
3. **Filter chip rail** — horizontal-scrolling, 5 default chips (All, Pending, Going, Bride's, Groom's) plus a "+ More" button that opens a bottom sheet with all the rest (Sponsors, Entourage, Family, custom tags, etc.). Each chip is at least 38pt tall.
4. **Card list** — grouped by section labels ("Wedding Party · 14", "Sponsors · 18", "Bearers & Flower Girls · 5", "Family & Friends · 175"). Each card is **72pt minimum height** with 16pt padding, showing only:
   - A 4pt-wide left-edge color stripe coded to the guest's side (rose for bride's-side, blue for groom's-side, gold for both).
   - Avatar (44pt) with side-coded gradient.
   - Guest name (16pt, primary text).
   - Single role line below the name (13pt, muted) — no household subtitle, no side tag chip on the card.
   - A 32pt circular RSVP icon at the right edge: ✓ green for attending, ⏳ amber for pending, ✕ red for declined. No text label — color + glyph is enough at this density.
   - The card's own width is the tap target. Tap → opens full-screen guest detail sheet (not a desktop-style drawer).
5. **FAB (+)** — bottom-right, 60pt diameter, terracotta. Opens the add-guest flow as a **full-screen sheet** (slides up from bottom). Modals don't belong on mobile — sheets do.
6. **Bottom tab bar** — Overview, Guests (active), Schedule, More. 48pt minimum height per tab.

The mobile detail screen and add-guest flow are full-screen sheets, not modals or drawers. They cover the full viewport, have a "Done" / "Save" CTA in the top-right, and dismiss by swipe-down or "Cancel".

---

## Functional scope

### Must work end-to-end

- **List view** — server-side fetch of all guests for the couple's event_id. Render as table on desktop, card list on mobile.
- **Search** — fuzzy match on first_name, last_name, display_name, household name, custom_tags. Client-side filter on already-loaded data is fine for V1.
- **Filter** — by RSVP status, side, group_category, role family (sponsor / entourage / bearer / guest), custom tag, household. Filters are additive.
- **Sort** — by last name (default), first name, RSVP responded_at, role.
- **Add guest** — form per modal mockup. Validates client + server. On submit, INSERT row, refresh list, show toast "{Name} added to guest list."
- **Edit guest** — open detail drawer, click Edit, fields become editable. Save persists.
- **Delete guest** — soft delete or hard delete? Soft delete (set `deleted_at`) is safer — couples sometimes accidentally remove guests. Add `deleted_at TIMESTAMPTZ` column and filter it out of queries.
- **Bulk import CSV** — accept CSV with columns: first_name, last_name, side, group, role, household, plus_one_allowed, email, mobile. Validate, show preview, commit on confirm. 200-row max for V1.
- **Per-event invitations** — toggle which schedule blocks each guest is invited to. Default: ceremony + reception. Configurable per-guest via the detail drawer.
- **Plus-one management** —
  - `plus_one_allowed` is per-guest, defaults FALSE. Couples opt in per guest; it is never automatic.
  - When the couple toggles ON for a guest, the modal exposes a **Plus-one details sub-block**:
    - First name + Last name (or leave blank for "TBA" — the couple has invited the +1 but
      doesn't know who they'll be yet, common when a guest hasn't decided who they're bringing).
    - **Plus-one access mode** radio — `Full` (default; +1 gets the full Setnayan guest experience)
      vs `Limited` (+1 can be tagged in photos and RSVP, but no Shutter / Selfie Camera /
      Challenges / reel builder; their tagged photos flow into the primary inviter's gallery).
  - On save, if any +1 details are provided OR the toggle is on with a TBA placeholder, the system
    creates a second `guests` row with `plus_one_of_guest_id = primary_guest.guest_id` and the
    chosen `plus_one_mode`. Both rows share the same `household_id`. **Each row gets its own
    `qr_token`** — the +1's QR is never shared with the primary.
  - **TBA +1s still get a usable QR.** The +1 row exists with first_name = "" and last_name = ""
    (or a "TBA" placeholder), and the couple can print/send the QR before the +1 is named. The
    name-capture step happens at first scan — see 0002 for the onboarding flow that the +1 is
    routed through before they hit their personal invitation site.
- **Custom tags** — free-form tag input, autocomplete suggestions from existing tags on the event.
- **Households** — couples and families are paired into a single row. Creating a guest with a `pair_with_guest_id` or assigning two guests to the same household renders them as one display row.

### Out of scope for this ticket (deferred to future work orders)

- **Sending invitations** — separate ticket. Just show the "Send invitations" button as disabled or stub-routed.
- **Magic-link RSVP page (guest-facing)** — separate ticket. The dashboard tracks RSVPs but the guest-side RSVP form is its own surface.
- **Seating chart / table assignments** — separate ticket. Show table_assignment_id field as read-only "Table 1 · Sponsor table" if set, but no editing UI.
- **Address book / contact import** — defer. Manual entry + CSV is enough for V1.
- **Din supplier vendor management** — separate phase entirely.
- **Native mobile app version** — Phase 2. Web responsive is the V1 mobile experience.

---

## Acceptance criteria

- [ ] Page accessible at `/dashboard/guests` for an authenticated couple with an event.
- [ ] Visual parity to `0001_creating_guest_list.html` at 1280px desktop and 390px mobile widths.
- [ ] All 18 Filipino-wedding role values selectable in the role dropdown and rendered with appropriate color-coded chips in the list.
- [ ] Side coding (bride / groom / both) reflected in the avatar gradient AND in the side chip on every row.
- [ ] Stats strip numbers update reactively when RSVP status changes or guests are added/removed.
- [ ] Search, filter, and sort all work without page reload.
- [ ] Add-guest form validates all required fields client-side AND server-side. Required: first_name, last_name, side, group, role.
- [ ] **Plus-one default OFF.** New guests render with the Plus-one toggle off. Toggling it on reveals the inline sub-block (name fields + access-mode radio defaulting to `Full`).
- [ ] **Plus-one creates a real row.** Saving a guest with Plus-one ON creates a second `guests` row with `plus_one_of_guest_id` pointing at the primary, the chosen `plus_one_mode`, and its own auto-generated `qr_token` (different from the primary's). The two rows share `household_id`.
- [ ] **TBA +1 is allowed.** Saving with Plus-one ON but blank +1 names persists the +1 row with empty first/last names; the list view renders it as "+ TBA · brought by [primary]" and the +1's QR is printable immediately.
- [ ] **Limited mode persists the field.** Saving with mode = Limited stores `plus_one_mode = 'limited'` on the +1 row. The list cell on the primary's row reads "+ {Name} (limited)" or "+ TBA (limited)".
- [ ] Detail drawer opens on row click, closes on X or click-outside.
- [ ] Mobile FAB opens the add-guest flow as a full-screen sheet.
- [ ] CSV import accepts a sample 20-row CSV (provide a fixture in the test suite).
- [ ] Sample seed data for development: ~15 guests covering bride's side, groom's side, paired sponsors, paired guest household, entourage roles, bearers, flower girl, officiant, declined RSVP. Use the names from the mockup so visual review is straightforward (Cora & Boy Reyes, Ramon & Mia Lim, Carla Mendoza, Marco Reyes, Lola Adela Reyes, Joaquin & Sofia Tan, Sofia Reyes, Liam De la Cruz, Jenny Bautista, Paolo & Anna Santos, Fr. Jose Aquino, Patricia Cruz).
- [ ] Server-side authorization: a couple can only read/write guests for their own events. Test with two events and verify isolation.
- [ ] All writes are atomic — no partial guest records on failure.
- [ ] No `console.log` in production code; structured logging only.

---

## Privacy & compliance

- Guest data (especially email, mobile, address) must respect PH Data Privacy Act (RA 10173).
- Photo consent (`photo_consent`) defaults to TRUE per spec 10. Couples can flip it to FALSE per guest in the detail drawer; that gates whether the guest can be tagged in the gallery.
- Guest data is only readable by: the couple of the event, Setnayan Staff, the guest themselves (for their own row).
- Implement Row-Level Security (RLS) on the `guests` table per the policy in `07_V1_Developer_Specification.md` Section 5.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context, locked SKUs, locked architecture, decision log.
2. `0001_creating_guest_list.html` (this folder) — visual reference (open in browser).
3. `0001_creating_guest_list.docx` (this folder) — narrative design summary for context.
3. `15_Couple_Landing_Page_Feature_Specification.md` — landing page spec; dashboard shell sits in the same surface.
4. `07_V1_Developer_Specification.md` — overall V1 dev spec; guest list ties into RSVP, magic-link auth, events, schedule blocks.
5. `10_Papic_Feature_Specification.md` — Papic feature; the guest's `qr_token` is the same token Sulyap (Setnayan native app) will scan.

---

## Notes for Claude Code

- This is the FIRST implementation work order for Setnayan. Before writing code, scan the repo to understand if any scaffolding exists (`apps/web`, `packages/db`, etc.). If the repo is empty or has only docs, ask the owner before initializing the Next.js project so the layout decision is intentional.
- The `events`, `tables`, and auth tables referenced in this work order may not exist yet. If they don't, create minimal versions sufficient for the guest list to function (an `events` row with a couple_id, a basic `tables` table for the FK). Create a follow-up ticket noting they'll be expanded later.
- Don't add features beyond what's listed in "Functional scope · Must work end-to-end." The temptation will be to add invitations, RSVP page, seating chart — resist. Each is its own ticket.
- Follow the design rule from `CLAUDE.md`: every visual deliverable includes both web and mobile. The mockup at `17_*` is the template — match it.
- When you finish, save a short summary at `0001_creating_guest_list_result.md` (in this same folder) describing what was built, what was deferred, what files were created, and any decisions you made that the owner should review.
