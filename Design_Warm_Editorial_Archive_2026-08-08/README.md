# Handoff: Setnayan — full surface redesign (Warm Editorial Archive)

> ⛔ **SUPERSEDED ON THE ACTION COLOUR — owner ruling 2026-08-08: GOLD is the action
> colour, not terracotta.** Wherever this document says *"terracotta is the only
> action colour"* or *"gold is never a button"*, read the opposite. Everything else
> in this document still stands. See **`ACTION_COLOUR_OVERRIDE_2026-08-08.md`**.

## Overview
A full redesign pass over Setnayan's four doorways — signed-in home, event dashboard, vendor dashboard, admin console — plus the guest surfaces (invitation, wedding website, Papic), the public pair (storyteller pages / vendor shop pages / Stories / Journal), the marketplace, and the inquiry→lock flow. Everything is reconciled against the **live codebase** (`iscasasola/setnayan-platform`, main @ af8c84e, 2026-08-08) — this is a restyle-and-extend of what ships, not a from-scratch product.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy. The task is to **recreate these designs inside the existing Next.js 15 app** (`apps/web/`), using its established patterns: the `--m-*` / `--color-*` token families in `apps/web/app/globals.css`, the canonical `<BottomNav>` / `<SubNav>` / sidebar primitives, the inspector-column pattern, and the shipped ServicePoster motion classes. Never introduce a parallel styling system.

## Fidelity
**High-fidelity.** Colors, type, spacing and copy are final intent. Recreate pixel-close using the shipped Tailwind tokens (`bg-cream`, `text-ink`, `bg-mulberry`, `text-terracotta`, `--m-*` vars) — the hex values below already ARE the shipped values, so most styling maps 1:1 onto existing classes.

## Files
- `Shell.dc.html` — the full canvas: every screen, grouped by deliverable, each frame numbered (1a…8c) with an implementation caption under it. Open in a browser; pan/zoom.
- `event-dashboard-handoff.html` — the deep-dive spec for `/dashboard/[eventId]` Overview: page order, per-widget insert points, lifetimes, open questions Q1–Q3.
- `android-frame.jsx`, `image-slot.js`, `support.js` — prototype runtime helpers; ignore for implementation.

## Screens / Views (canvas frame → target route)
| Frames | Surface | Target in repo |
|---|---|---|
| 1a–1d | App shell: phone bottom bar ×2 states, desktop rail, borrow-table | `apps/web/app/dashboard/layout.tsx`, `app/_components/nav/` |
| 2a–2g | Invitation, wedding website (all sections + day-of strip), save-the-date, Papic camera + challenges, your-photos + face tagging | `apps/web/app/[slug]/`, `app/papic/` — NOTE: `/[slug]` guest tree is owner-excluded from the Atelier reskin (keeps Cormorant editorial faces) |
| 3a–3f | Signed-in home (4 areas), Spaces (+ your-public-page door), create-event sheet, event dashboard, Add-ons store, guest list | `app/dashboard/(launcher)/`, `app/dashboard/[eventId]/` (+ `guests/`, `orders/`) |
| 4a–4g | Storyteller page + chapter series, vendor shop page (reconciled, + socials), Stories browse (YouTube-shaped), Journal article with embedded chapters + SPONSORED rule | `app/creators/`, `app/v/[slug]/` (**reconcile, do not redraw** — 175KB page ships), `app/realstories/`, `app/blog/` |
| 5a–5c | Marketplace browse (taxonomy search + Setnayan AI sort), plan builder, compare (2-way) | `app/explore/` + `_components/` (vendor-card contract is locked — see rules below), plan = `app/dashboard/[eventId]/budget/` + `vendors/` |
| 6a–6d | Inquiry composer → chat thread with ➕ structured sends (proposal, appointment, amendment, payment request) + audio/video calls → accept/receipt/lock handshake → vendor booking-fee confirm | `app/v/[slug]/_components/inquiry-composer.tsx`, `app/_components/chat-*.tsx`, `app/_actions/thread-call-actions.ts`, `lib/booking-fee*.ts` |
| 7a–7d | Vendor dashboard: 5 locked pages (Overview decision feed, My Shop with calendar tabs), phone + desktop | `app/vendor-dashboard/` (`shop/`, `services/`) |
| 8a–8c | Admin Exception Desk (work list + inspector), phone triage, vendor service editor | `app/admin/`, `app/vendor-dashboard/services/` |

## Interactions & Behavior (the non-negotiables)
- Terracotta `#C24E25` is the ONLY action color; labels are cream `#FDFBF7`, never pure white. Gold is never a button.
- Nav active state: gold-700 `#8A6B39` icon/label + pill indicator (the shipped BottomNav pill grammar; a lint guard enforces the canonical template).
- Lock handshake (6c): two-sided — couple attaches receipt, vendor confirms, THEN state flips; the flip updates plan, budget, vendor calendar, team list atomically.
- Booking fee (6d): computed by `lib/booking-fee.ts` — 5% of first ₱100k then 1%, floor ₱50; sourced clients only; first 5 sourced bookings free (verified). Flag-gated (`NEXT_PUBLIC_BOOKING_FEE_ENABLED`). Never say "commission".
- Marketplace cards: no prices (V1 hide-prices lock); hybrid anonymity via `resolveVendorDisplayName` (stable screen name until revealed; verified names never hidden); distance renders only when both ends exist; rating "new", never 0★.
- Empty/failed states: zero ≠ failed-to-load (hollow dot, never "0"); every empty state is a written invitation; no fake doors.
- Face tagging (2g): suggestions surface only to the person themself, opt-in, per-event; "Not me" remembered.
- Timed services (Papic, Panood): DB-state + on-access checks — NO cron (owner-locked).
- 44×44 minimum tap targets; ₱ amounts and dates always in Space Mono; dates as "12 Dec 2026".

## Design Tokens (= shipped globals.css values, verbatim)
- Page + card: `#FDFBF7` (separate cards by border `#E1DCD1`/`#EBE5D9` + shadow, never a second surface)
- Ink `#2C2A29` · muted `#6E6A62` / `#8A857B` / `#A09A8E`
- CTA `#C24E25`, hover `#B04722`, deepest `#9D3F1E`
- Gold accent `#A9834B` (UI/large text only) · readable-text gold `#8A6B39`
- Link/secondary `#3B4E67`, hover `#304055`
- Status tints: sage `#7A8B6F` on `rgba(122,139,111,.14)` · waiting `#C9A96E`
- Type: Hanken Grotesk (all app chrome incl. display) · Cormorant Garamond (ONLY `/[slug]` guest surfaces + Journal headlines) · Space Mono (numerals, money, eyebrows)
- Radii: 8 / 14 / 22 / 999 (`--m-r-*`) · light mode only

## State Management / Data
All widgets read shipped sources — events row, `event_vendors` (plan groups, status considering→locked), guests roster, budget ledger, `booking_fee_charges`, vendor calendar. No new stores invented; where a slot wasn't verifiable the handoff says "not stated" rather than guessing.

## Assets
No binary assets. All imagery is `<image-slot>` placeholders — production uses real event/vendor media from R2. Icons are inline stroke SVGs matching Lucide 1.6–1.7px stroke grammar; use the repo's Lucide set.

## Open questions for the owner (blocking Q's from the deep-dive)
1. In-event bottom bar: re-scope to Event·Guests·➕·Budget·Find, or keep the global bar?
2. Add-ons rail: on the event Overview, or only behind a SubNav tab?
3. Does a "Find" type-to-jump palette already ship?
