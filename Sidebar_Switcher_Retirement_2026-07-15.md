# Sidebar Switcher Retirement — Identity Plaque IS the Home Doorway

> **🚫 SUPERSEDED 2026-07-16 — do not build from this file.** The owner asked the
> council to stress-test account-action reachability and leaned toward "the
> event icon as the popup instead of having 2 there." The council verdict is
> **Model B+ (plaque = popup trigger, wordmark = 1-click home link)** —
> see **`Sidebar_Identity_Council_Verdict_2026-07-16.md`**, which replaces this
> Model-A spec (plaque = direct home link). Kept for lineage only.

**Date:** 2026-07-15 · **Status:** SUPERSEDED (was: owner-directed, spec ready for build)
**Owner directive:** "there is a switcher and the event icon when clicked would go back to home. If the event icon goes to home, the switcher can be removed and the event / vendor / admin icon can serve as the back-to-home."

## Verdict

Agreed — and the codebase is already halfway there. This spec completes a
convergence that started on 2026-07-10 (switcher panel slimmed to a home-hub
jump) and 2026-07-15 (event plaque made the event switcher by linking to
`/dashboard`). Today the couple's desktop rail stacks TWO adjacent controls
that both mean "leave this doorway → home": the account-switcher pill and the
event plaque one inch below it. Collapse to one: **the identity plaque is the
single back-to-home doorway on every desktop rail.**

## Ground truth (origin/main, 2026-07-15)

| Piece | File | State |
|---|---|---|
| Doorway header (all 3 rails) | `apps/web/app/_components/nav/doorway-sidebar-header.tsx` | Wordmark + eyebrow + `AccountSwitcherStandalone` pill |
| Switcher panel body | `apps/web/app/_components/account-switcher/account-switcher.tsx` | Home → `/dashboard` · Shop/HQ rail (vendor/admin only) · Profile & settings · Setnayan AI · Sign out / Secure-your-plan |
| Couple event plaque | `apps/web/app/dashboard/[eventId]/_components/customer-sidebar.tsx` (~L252) | **Already** `<Link href="/dashboard">`, aria "switch events" |
| Vendor identity card | `apps/web/app/vendor-dashboard/_components/vendor-sidebar.tsx` (`VendorIdentityCard`) | Plain `<div>` — NOT a link |
| Admin rail | `apps/web/app/admin/_components/admin-sidebar.tsx` | No identity plaque at all |
| Desktop top bars | vendor + admin layouts | Both already have their own Sign out button; couple top bar does NOT |
| Mobile top bars (all doorways) + home launcher / account spokes | `lg:hidden` `AccountSwitcher` instances | Untouched by this spec — mobile has no rail/plaque, so the avatar menu stays |

## The change (desktop rails only)

1. **`DoorwaySidebarHeader`** — remove `AccountSwitcherStandalone` and the
   `switcherData` prop; stop threading `switcherData` into the header from the
   three doorway layouts (couple `dashboard/[eventId]/layout.tsx`, vendor
   `vendor-dashboard/layout.tsx`, admin `admin/layout.tsx`). Keep Wordmark +
   eyebrow. Make the Wordmark a `<Link href="/dashboard">` (logo-goes-home is
   the universal convention and already how the launcher/account top bars
   behave) — the plaque stays the *featured* doorway; the wordmark is the
   conventional fallback.
2. **Couple** — plaque already links home. Add a subtle trailing affordance
   (e.g. a muted `⌂`/grid glyph that brightens on hover) so a name-card reads
   as a doorway, not a label. Keep the existing aria-label.
3. **Vendor** — wrap `VendorIdentityCard` in `<Link href="/dashboard">`, same
   hover-lift + aria pattern as the couple plaque ("(Business) — back to your
   Setnayan home").
4. **Admin** — add an HQ identity plaque (Setnayan mark + "Setnayan HQ") at the
   rail top linking to `/dashboard`, matching the plaque design language.
5. **Mobile + launcher/account chrome** — no change. The `lg:hidden`
   `AccountSwitcher` pills in the top bars remain the mobile home/console
   doorway, and the home launcher's avatar menu remains the account hub
   (Profile · Setnayan AI · Shop/HQ · Sign out).

## Accepted trade-offs (surfaced, not hidden)

- **Couple desktop loses in-rail Sign out / Profile / Setnayan AI** (those
  lived only in the switcher panel; the couple top bar has no Sign out).
  New path: plaque → home → avatar menu. One extra hop for rare actions;
  vendor + admin keep their top-bar Sign out, so they lose nothing.
- **Vendor/admin lose the direct Shop↔HQ hop** from inside a doorway; the hop
  now goes through home's avatar menu. Console-switching is rare — accepted.
- **No orphaned pages** (wayfinding rule): every destination the switcher
  offered still has a doorway at home; nothing goes dark.

## Out of scope

- The mobile switcher/bottom-sheet, the launcher + account-spoke top bars,
  and the panel component itself (still used by those surfaces).
