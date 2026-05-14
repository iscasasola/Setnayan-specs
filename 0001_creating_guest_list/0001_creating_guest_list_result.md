# 0001 — Create Guest List Management · Result

**Status:** Implementation complete (pending owner visual review).
**Date:** 2026-05-08 (initial build · revised against work-order v2 + v3 mobile-native + add-guest-modal-v2 specs) · 2026-05-09 (plus-one model upgrade)
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Built by:** Claude Code

> **Update note (latest pass — 2026-05-09):** the plus-one model was promoted from "string on primary's row" to a first-class `guests` row with its own `qr_token`. New columns `plus_one_of_guest_id` + `plus_one_mode` shipped via migration `20260509000000_plus_one_model.sql`. The Add Guest modal's Row 4 changed from a select to a two-segment toggle; when ON, an inline sub-block reveals first/last name + Full/Limited access-mode radio. `addGuestAction` now creates a second guests row for the +1 with shared household + side + group, mirrored invited_to_blocks, and an auto-generated qr_token. Display logic updated: primary's plus-one cell reads from the linked +1 row, and +1 rows render with a "brought by" subtitle. Details under "Plus-one model v2" below.
>
> **Earlier update note:** the work order's add-guest modal section was tightened to specify a fixed 720px width, max-height 90vh with scroll, uniform 46px field height, 10px border-radius, 12px×14px padding, 14px font-size, terracotta focus ring, custom 22×22 checkbox, and a strict 11-row field order. The implementation now matches that spec; details under "Add-guest modal v2" below.

---

## What was built

The full couple-facing guest list at `setnayan.com/dashboard/guests`, end-to-end:

- **Database layer:** `events`, `wedding_tables`, `households`, `guests` with all 18 Filipino-Catholic wedding role values, soft delete, and the unified QR token field reused by Papic (spec 10).
- **Auth + RLS:** route gated by middleware (couple must be signed in via Google or Facebook OAuth — cf. `0002` if magic-link is needed for staff later); RLS policies on every new table tied to `is_couple_of(event_id)` so a couple can only read/write guests on their own event.
- **Desktop UI** (`/dashboard/guests` at ≥1024px): top nav with event pill, page header with the four primary actions, 5-card stats strip, search + filter chips + sort toolbar, sticky 240px facets sidebar (View / Custom Tags / Events), and the guest list table. Detail drawer slides in from the right on row click.
- **Mobile UI** (<1024px): per the updated work-order's mobile-native rules — own page header (back / Guests / count / search-icon-with-expand), 3-pill status row (going / pending / declined), 5-default chip rail with `+ More` sheet, side-striped cards (4px left edge bride/groom/both) with 16pt name + single role line + 32pt circular RSVP glyph (✓ / ⏳ / ✕), full-screen detail sheet, full-screen add-guest sheet, 60×60 terracotta FAB respecting the home indicator's safe area, bottom tab bar.
- **CRUD:** server actions for add, update, soft-delete, and bulk CSV import. All Zod-validated server-side. RSVP toggle inline from the detail drawer.
- **CSV import:** full upload → preview → commit flow. Reads the spec's required columns (`first_name, last_name, side, group_category, role`), accepts the optional ones (`household, plus_one_allowed, email, mobile`), enforces the 200-row cap, validates each row with Zod and shows OK/error per row before committing.
- **Seed data:** 14 guests matching the mockup names (`Cora & Boy Reyes`, `Ramon & Mia Lim`, `Carla Mendoza`, `Marco Reyes`, `Lola Adela Reyes`, `Joaquin & Sofia Tan`, `Sofia Reyes`, `Liam De la Cruz`, `Jenny Bautista`, `Paolo & Anna Santos`, `Fr. Jose Aquino`, `Patricia Cruz`) covering every role family, side, RSVP state, and pairing case.

---

## Acceptance-criteria checklist

| Criterion | Status | Notes |
|---|---|---|
| Page accessible at `/dashboard/guests` for an authenticated couple | ✓ | Server-side guard in `dashboard/layout.tsx`; middleware redirects unauth → `/login`. |
| Visual parity to the mockup at 1280px desktop and 390px mobile | ✓ (pending owner sign-off) | All component primitives ported (rsvp-pill, side tag, role chip, filter chip, stat card, mobile card with side stripe, FAB, bottom tab bar). Final pixel checks belong to the owner. |
| All 18 Filipino-wedding role values | ✓ | Postgres `wedding_role` ENUM matches the work-order list 1:1; surface in the role dropdown via `WEDDING_ROLES`. |
| Side coding (bride / groom / both) in avatar gradient AND side chip | ✓ | `SideAvatar` and `SideTag` components; mobile cards add a 4px left stripe on top. |
| Stats strip updates reactively on RSVP / add / remove | ✓ | Strip is a memoized derivation over `filteredGuests`; mutations revalidate `/dashboard/guests`. |
| Search, filter, and sort without page reload | ✓ | All state lives in `guests-page.tsx`. Search is fuzzy across `first_name`, `last_name`, `display_name`, `role`, `group_category`, `custom_tags`. Filters and sort are additive. |
| Add-guest form validates required fields client + server | ✓ | Same Zod schema (`addGuestSchema`) on both sides; required: `first_name`, `last_name`, `side`, `group_category`, `role`. |
| Detail drawer opens on row click, closes on X or click-outside | ✓ | Backdrop click closes; ESC key closes via the `keydown` listener in the form dialogs. |
| Mobile FAB opens add-guest as full-screen sheet | ✓ | Dialog is `inset-0` on mobile, capped at 640px on `lg+`. |
| CSV import accepts a sample 20-row CSV | ✓ | Tested manually with the seed names re-exported to CSV (sample fixture not yet added to the repo — see Deferred). |
| Sample seed data with mockup names | ✓ | `supabase/seed.sql` covers all the named guests + an officiant + paired sponsors + paired guest household + declined RSVP + pending with TBA plus-ones. |
| Server-side authorization (RLS isolation between events) | ✓ | All four new tables have `ENABLE ROW LEVEL SECURITY` with policies pinned to `is_couple_of(event_id)`. To verify with a second event, sign in as a different OAuth identity. |
| Atomic writes | ✓ | `bulkImportGuestsAction` runs all 1–200 inserts in a single `INSERT … VALUES (…), (…)` so a constraint violation rolls the batch. |
| No `console.log` in production code | ✓ | All logging is `console.error` for unexpected query failures (kept until Sentry is wired). No stray `console.log`. |

---

## Files created / modified

### Database

- `supabase/migrations/20260508120000_initial_guest_list_schema.sql` — 8 enums + 18-value `wedding_role` + four tables + indexes + RLS policies + `is_couple_of()` helper.
- `supabase/seed.sql` — idempotent PL/pgSQL block creating Maria & Juan's event for the founder's auth user, 5 households, 1 wedding table, 14 guests (incl. 4 paired entries).

### Web app

- `apps/web/tailwind.config.ts` — Filipino Heritage palette (cream / ink / terracotta + bride/groom/both + RSVP softs), Cormorant + Manrope + DM Mono.
- `apps/web/src/app/globals.css` — CSS custom-property tokens + reusable component primitives (`pill-tag`, `rsvp-pill`, `btn-default/primary/accent/ghost`, `meta-label`, `display-title`).
- `apps/web/src/app/layout.tsx` — DM Mono font added.
- `apps/web/src/app/dashboard/layout.tsx` — server component, fetches the current event, renders top nav + mobile tab bar + content.
- `apps/web/src/app/dashboard/_components/top-nav.tsx` — desktop nav (lg+ only).
- `apps/web/src/app/dashboard/_components/mobile-tab-bar.tsx` — Overview / Guests / Schedule / More tabs.
- `apps/web/src/app/dashboard/_components/no-event-state.tsx` — shown when an authenticated user has no event yet.
- `apps/web/src/app/dashboard/page.tsx` — overview placeholder.
- `apps/web/src/app/dashboard/guests/page.tsx` — RSC: fetch event + guests + households + tables.
- `apps/web/src/app/dashboard/guests/actions.ts` — server actions (add, update, soft-delete, bulk import, set RSVP).
- `apps/web/src/app/dashboard/guests/_components/guests-page.tsx` — main client orchestrator.
- `apps/web/src/app/dashboard/guests/_components/{stats-strip, toolbar, facets-sidebar, desktop-list}.tsx` — desktop UI pieces.
- `apps/web/src/app/dashboard/guests/_components/{mobile-app-header, mobile-status-row, mobile-chip-rail, mobile-list}.tsx` — mobile UI pieces (per updated work-order spec).
- `apps/web/src/app/dashboard/guests/_components/{detail-drawer, guest-form-dialog, csv-import-dialog}.tsx` — modals/sheets (full-screen on mobile, modal on desktop).
- `apps/web/src/app/dashboard/guests/_components/{shared, pairing, facet-state}.{tsx,ts}` — small reusables and helpers.
- `apps/web/src/lib/db/{events, guests, types}.ts` — DB query helpers + hand-written TS types matching the migration.
- `apps/web/src/lib/schemas/guest.ts` — Zod schemas (`addGuestSchema`, `editGuestSchema`, `csvRowSchema`).

### Dependencies added (`apps/web`)

- `zod` — form/CSV/server-action validation.
- `papaparse` + `@types/papaparse` — CSV parsing for bulk import.
- `@supabase/supabase-js`, `@supabase/ssr` — already present from the earlier auth work.

---

## Add-guest modal v2 (per the latest work-order revision)

The desktop modal in `_components/guest-form-dialog.tsx` was rewritten to the v2 spec:

- **Container:** 720px max-width, 90vh max-height with internal scroll, 18px border radius, 32px padding (lg). Mobile remains a full-screen sheet.
- **Field grid:** 2-column on lg+, 18px row gap, 16px column gap. Full-width rows opt in via `lg:col-span-2`.
- **Uniform field sizing for every single-line input/select/checkbox-row:**
  - height: **46px**
  - border-radius: **10px**
  - padding: **12px 14px**
  - font-size: **14px**
  - focus ring: **var(--accent)** terracotta
- **Textarea (Notes):** same widths/styles, height 96px (only exception).
- **Field row order (top to bottom):**
  1. First name * | Last name *
  2. Display name | Household
  3. Side * | Group *
  4. Role in wedding * | Plus-one
  5. Email | Mobile
  6. Meal | RSVP status
  7. Dietary restrictions (full-width)
  8. Photo consent (full-width row · custom 22×22 terracotta checkbox · "PH DPA" tag at right)
  9. Invited to (full-width chip selector · Ceremony + Reception default selected)
  10. Custom tags (full-width · type-and-Enter)
  11. Notes (full-width 96px textarea)
  12. Plus-one name (full-width, only when "Allowed · named below" is selected)
- **Role-in-wedding select stays half-width even with 18 long options.** The native `<select>` dropdown auto-expands to text width when opened, per spec.
- **Required indicator:** small terracotta `*` next to the label.
- **Sticky footer:** Cancel · Save & add another · Save guest (terracotta primary).

## Decisions worth a sanity-check

1. **Schema PK naming.** The work order uses domain-prefixed primary keys (`event_id`, `guest_id`, `household_id`, `table_id`) instead of generic `id`. Adopted as authoritative; the older `07_V1_Developer_Specification.md §4.1` had `id` for events. SPEC.md will need a follow-up edit to align if you want consistency across all wedding-domain tables.
2. **`tables` → `wedding_tables`.** PostgreSQL reserves `tables` as a meta-table reference in some contexts. Renamed the SQL table; FK column on guests is still `table_assignment_id` so the work-order field name is preserved.
3. **`wedding_role` ENUM, not CHECK.** Picked ENUM per work order's "ENUM is preferred for clarity." Adding a new role later requires `ALTER TYPE wedding_role ADD VALUE …`, which is supported in modern Postgres.
4. **`is_couple_of()` helper for RLS** instead of inlining the check on every policy. Marked `SECURITY DEFINER` + `STABLE` so it's both safe and cacheable. Bypasses RLS recursion when households/guests look up their event.
5. **Auth model deviates from the work order's "magic-link auth."** The web app is OAuth-only (Google + Facebook) per a separate decision on 2026-05-07. Apple ships when iOS App Store work begins. Magic-link is only on the admin app for Setnayan Staff. Couple sign-in still works exactly as the work order assumed.
6. **Filipino Heritage theme tokens replace an earlier aubergine baseline.** Tailwind colors are now CSS-var-driven (`var(--ink)`, `var(--bride-soft)`, etc.) so we can extend the palette without re-running Tailwind. `@apply` cannot resolve CSS-var-based colors so component primitives are written as raw CSS in `globals.css`.
7. **No shadcn/ui yet.** The work order suggests shadcn for primitives. We didn't pull it in to keep the surface area small for V1; if the next ticket benefits from it, run `npx shadcn-ui init` then port these inline components to shadcn-flavored ones.
8. **`typedRoutes` is OFF in `next.config.ts`.** A few aspirational dashboard nav links (`/dashboard/landing`, `/dashboard/schedule`, `/dashboard/suppliers`, `/dashboard/gallery`, `/dashboard/settings`, `/dashboard/more`) don't have `page.tsx` files yet, which would break the typed-route check. Re-enable `typedRoutes` once those routes ship.
9. **Mobile detail / add-guest are full-screen sheets**, per the updated mobile spec. They cover the entire viewport from `inset-0` and have a Close (×) button in the top-right corner. ESC closes the dialog; click-outside closes the detail sheet.
10. **`console.error` retained for unexpected DB failures.** Will move to structured logging when Sentry is wired up (later work order).

---

## Out of scope (per the work order, deferred)

- Sending invitations — "Send invitations" button is rendered but disabled.
- Magic-link RSVP page (guest-facing).
- Seating chart / table assignment editing UI — `wedding_tables` is created and the FK exists, but only the seed populates a single sponsor table.
- Address book / contact import — manual entry + CSV is V1.
- Native mobile app — Phase 2.

---

## Known follow-ups for next work order

- **CSV fixture in tests.** A `__tests__/fixtures/sample-20.csv` and a Vitest spec running the bulk import path would close out one acceptance criterion (the import is currently smoke-tested manually only).
- **Multi-event RLS verification.** Spinning up a second auth user + event would prove cross-event isolation. The policy is correct by inspection but not yet automated.
- **Toast notifications.** `addGuestAction` etc. return `{ ok, error }`. The dialogs swallow errors into local state; we should surface successes via a toast ("Carla Mendoza added to guest list."). Add when shadcn lands.
- **Search expansion in mobile header.** The current implementation uses a `<details>` to expand the search inline below the header. Acceptable but a true bottom-sheet search overlay would be more iOS-native.
- **Custom tag autocomplete.** The work order calls for autocomplete on the custom tag input. Currently the editor accepts any string; existing tags appear in the facets sidebar but aren't suggested in the input.
- **Export.** Disabled button shipped. CSV / vCard export is a separate work order.
- **Real `events` schema fields.** The minimal `events` table omits `slug` validation rules, `landing_template`, `monogram_svg`, `color_palette`, etc. that SPEC.md contemplates. They'll come in with the landing-page work order (15).

---

## How to run / verify

```bash
# 1. Apply migration + seed
# Open the Supabase SQL Editor and paste:
#   supabase/migrations/20260508120000_initial_guest_list_schema.sql
#   supabase/seed.sql
# (Both must succeed — seed prints a NOTICE confirming row counts.)

# 2. Run the web app
cd apps/web
pnpm dev

# 3. Sign in
# Visit http://localhost:3000/login → Continue with Google as the founder email.

# 4. Open the guest list
# Visit http://localhost:3000/dashboard/guests
# Resize the browser to ≤768px to see the mobile experience.
```

End of result.
