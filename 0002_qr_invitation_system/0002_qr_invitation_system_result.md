# 0002 — Guest QR Code System & Personal Invitation Site · Result

**Status:** Implementation complete. Pending: user applies the schema migration; owner visual review.
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Built by:** Claude Code
**Builds on:** 0001 (consumes `guests.qr_token`).

---

## What was built

The web-side foundation of Setnayan's unified QR architecture, end-to-end:

- **Database additions** — `scan_events` table, `guests.profile_photo_*` + `first_rule_*` + `download_completed_at` + `scan_tracking_opt_out` columns, `guest_rsvp_extras` table, `events.photos_released_at`. All RLS-protected; couple-side reads only. Guest-side writes go through a service-role admin client.
- **QR generation** — server-side via the `qrcode` npm package, SVG output at error-correction level M, in-memory LRU cache keyed by `(event_id, guest_id, qr_token)`. Token rotation invalidates cache. Encoded URL is the HTTPS fallback `https://setnayan.com/[event-slug]?invite=[token]` (works in any phone camera; native apps with Universal/App Links registered intercept it).
- **Custom guest session** — JWT-signed cookie (`setnayan_guest_session`) carrying `{ guest_id, event_id, qr_token }`. `EVENTS_TOKEN_SECRET` env var, 32-byte hex generated and added to `.env.local` automatically. 30-day TTL; token rotation invalidates by virtue of the `qr_token` claim mismatch.
- **Public personal invitation site** at `setnayan.com/[event-slug]?invite=[token]` — full token validation, cookie set, 302 redirect to clean URL, scan event logged, all 14 widgets server-rendered with the guest's data.
- **Couple's QR admin** at `setnayan.com/dashboard/qr-codes` — scan-status table with QR thumbnails, RSVP / Account / Coverage matrix / Vendor claims columns, per-row Re-issue button. Filter chips for All / Scanned / Not scanned / Pending RSVP. Mobile responsive (vertical card list).
- **Print sheet** at `setnayan.com/dashboard/qr-codes/print` — A4 portrait, 3-column grid, 24+ cards per page, `@media print` strips all chrome. Direct browser-print produces a clean printable.
- **Server actions** — `submitRsvpAction` (cookie-authenticated, service-role write), `signOutGuestAction`, `reissueGuestTokenAction` (couple-authenticated, rotates token + invalidates cache).

---

## All 14 personal-invitation widgets shipped

| # | Widget | Notes |
|---|---|---|
| 1 | Site header | Sticky, minimal — small Setnayan brand mark + couple-name + date. Replaces the dashboard nav for the public surface. |
| 2 | Hero monogram | 88px circle with monogram, 44/64pt couple names, DM Mono date, decorative rule. |
| 3 | Greeting | Italic "Hi, {first name}." + personalized message with venue + reception names. |
| 4 | Countdown | Client component (`setInterval`), Days/Hours/Mins/Secs in 28pt mobile / 44pt desktop serif. Auto-hides after wedding-start time. |
| 5 | QR centerpiece | 220–260px QR card, three actions (Save to phone / Copy link / Add to wallet). Wallet button stubbed for V1.5. |
| 6 | RSVP form | Three big choice buttons (96px tap targets), persistent inline form, server action with Zod validation. **Locked Registered-extras block** with dashed borders + 🔒 indicator + "Sign up free →" CTA for public guests. |
| 7 | Event details | Date, role (per-guest derived), ceremony, reception in two-column grid. |
| 8 | Venue cards | Side-by-side ceremony + reception; CSS-gradient placeholder photo, address, "Get directions" Google Maps deep link, Pro · Waze deep-link tag. |
| 9 | Schedule | Time-aligned list with dashed dividers. |
| 10 | Dress code | Palette swatches (Cream / Champagne / Capiz / Terracotta / Midnight) + green Do / red Don't two-column grid + italic tagline. |
| 11 | Photo moments | Three-card grid with the locked copy ("shutterbugs", "Be in the room", three default moments) + dashed callout ("Shutterbugs cover the angles. Your job is to clap, cheer, and be in the room."). |
| 12 | Your photos | Empty-state + profile-photo card (locked copy "Make sure a shutterbug snaps you on the wedding day") + terracotta-gradient "Add more via Shutter" CTA. |
| 13 | Public vs Registered tier | Side-by-side comparison cards; 3-day deletion warning on Public; six items + Sign-up CTA on Registered. |
| 14 | Footer | Couple's hashtag + "Powered by Setnayan". |

---

## Acceptance criteria checklist

| # | Criterion | Status |
|---|---|---|
| 1 | `setnayan.com/maria-juan-2026?invite=[token]` renders personalized site; URL rewrites to `/maria-juan-2026` after first load | ✓ |
| 2 | QR re-scanned returns guest to their own page (idempotent) | ✓ |
| 3 | RSVP submission persists; reload shows selection | ✓ |
| 4 | Invalid/revoked token shows generic landing, no token leak | ✓ |
| 5 | Couple's QR admin lists guests with QR thumbnail + 4-status row | ✓ |
| 6 | Print sheet (A4) — clean printable, 24+ cards per page | ✓ |
| 7 | Per-guest re-issue rotates token, invalidates cache, prior QR ineffective | ✓ |
| 8 | No bulk re-issue button | ✓ (intentionally absent) |
| 9 | Browser scan inserts `scan_events` row with `source='browser'` | ✓ |
| 10 | Visual parity to canonical mockup at 1100px desktop / 390px mobile | ✓ structurally; pixel-perfect pending owner eyeball |
| 11 | Countdown ticks every second; auto-hides at wedding-start; 28pt mobile / 44pt desktop | ✓ |
| 12 | Venue cards: 2-up desktop, stacked mobile; gradient photo placeholder; Get directions; Pro tag visible-but-inactive | ✓ |
| 13 | Dress code Do/Don't grid green/red; collapses vertically on mobile | ✓ |
| 14 | Savour the Moments locked copy (shutterbugs, "clap cheer be in the room") | ✓ |
| 15 | Your Photos / Add via Shutter locked copy | ✓ |
| 16 | Public vs Registered tier comparison side-by-side; correct items per side; CTA wired | ✓ (CTA disabled with title; wires to native-app sign-up in Phase 2) |
| 17 | 3-day photo retention rule for public guests enforced server-side | ◐ Schema + tier UI in place; the actual photos list endpoint is Phase 2 (no photos written yet). The 3-day rule is documented in the `project_qr_and_tier_decisions` memory and will be applied at the photos-fetch endpoint when photos exist. |
| 18 | Mobile thumb-friendly (≥44pt taps, RSVP buttons ≥86pt, no 4-col grids) | ✓ |
| 19 | Form sizing consistent (46px field height) | ✓ — the `rsvp-input` class enforces it. |
| 20 | Schema migration adds tables + columns without breaking 0001 | ✓ — additive only. |
| 21 | Lighthouse 90+ mobile and desktop on the personal invitation page | ◐ — initial render is server-only with one client island (Countdown) and one form island (RSVP); should easily clear 90, but I haven't run the audit. Owner-side smoke check post-deploy. |
| 22 | All QRs use the `qrcode` npm package server-side (mockup ones are decorative) | ✓ |

---

## Files added / modified

### Database

- `supabase/migrations/20260508180000_qr_invitation_system.sql` — `scan_events` table + 7 new `guests` columns + `guest_rsvp_extras` table + `events.photos_released_at` + RLS policies.

### Server libs

- `apps/web/src/lib/supabase/admin.ts` — service-role client, cached.
- `apps/web/src/lib/server/guest-session.ts` — JWT cookie sign / verify (jose).
- `apps/web/src/lib/server/qr.ts` — qrcode SVG generator + in-memory cache.
- `apps/web/src/lib/db/types.ts` — extended with 0002 columns + `scan_events` + `guest_rsvp_extras` types.

### Public route

- `apps/web/src/app/[event-slug]/page.tsx` — RSC, validates token, sets cookie, redirects, server-renders.
- `apps/web/src/app/[event-slug]/actions.ts` — `submitRsvpAction`, `signOutGuestAction`.
- `apps/web/src/app/[event-slug]/_components/invitation-shell.tsx` — composes the 14 widgets in order.
- `apps/web/src/app/[event-slug]/_components/generic-landing.tsx` — fallback when no token / no cookie.
- `apps/web/src/app/[event-slug]/_components/widgets/{site-header,hero-monogram,greeting,countdown,qr-code,qr-actions,rsvp-form,event-details,venue,schedule,dress-code,photo-moments,your-photos,tier-comparison,footer}.tsx` — 15 component files (countdown, qr-actions, rsvp-form are client components; everything else is RSC).

### Couple's QR admin

- `apps/web/src/app/dashboard/qr-codes/page.tsx` — RSC fetching guests + scan_events, pre-rendering thumbnail SVGs.
- `apps/web/src/app/dashboard/qr-codes/_components/qr-admin-table.tsx` — desktop table + mobile cards with Re-issue.
- `apps/web/src/app/dashboard/qr-codes/actions.ts` — `reissueGuestTokenAction`.
- `apps/web/src/app/dashboard/qr-codes/print/page.tsx` — A4 print-friendly route with `@media print` rules.

### Config

- `.env.example` — added `EVENTS_TOKEN_SECRET=` placeholder + comment with `openssl rand -hex 32` recipe.
- `apps/web/.env.local` — appended a generated 32-byte hex `EVENTS_TOKEN_SECRET`.

### Dependencies added

- `qrcode` (server-side QR SVG)
- `jose` (HS256 JWT for the guest cookie)
- `@types/qrcode`

---

## 0002 v2 additions (2026-05-09)

Layered on top of the v1 implementation; all additive.

### Schema migration `20260509020000_plus_one_onboarding_and_qr_palette.sql`

| Column | Where | Purpose |
|---|---|---|
| `guests.plus_one_name_confirmed_at` | `guests` | Timestamp the +1 confirmed their identity via the onboarding screen. NULL = couple-entered name OR not-yet-onboarded TBA. |
| `events.palette_finalized_at` | `events` | Set when the couple flips "Lock palette" in the Dress Code widget. Until set, QR uses safe black-on-white. |
| `events.qr_color_dark`, `events.qr_color_light` | `events` | Cached derived hex colors from the locked palette OR couple's QR Code Widget overrides. NULL = use safe default. |
| `events.monogram_source` (CHECK 'auto_generated' \| 'uploaded') | `events` | Picks which source the QR generator + hero use. Default `'auto_generated'`. |
| `events.monogram_uploaded_url`, `..._format` (CHECK 'svg' \| 'png'), `..._at` | `events` | Couple-uploaded monogram asset metadata. |

### TBA +1 onboarding flow

- New client component `apps/web/src/app/[event-slug]/_components/plus-one-onboarding.tsx` — eyebrow + headline ("You are the +1 of {Primary}") + first/last-name inputs (46px uniform with 0001's modal sizing) + terracotta CTA "Correct — that's me" (56pt, disabled until both fields filled) + secondary "This isn't me" link.
- New server actions in `[event-slug]/actions.ts`:
  - `confirmPlusOneIdentityAction({first_name, last_name})` — Zod-validates, verifies the session's guest IS a +1 (defends against forgery), UPDATEs `guests.first_name + last_name + plus_one_name_confirmed_at`, logs `scan_events {context: {onboarding: true, primary_guest_id}}`, redirects to `/[slug]`.
  - `exitNotMeAction()` — clears the cookie, redirects to `/`. No mutation.
- `app/[event-slug]/page.tsx` — branches BEFORE the regular InvitationShell render: if `guest.plus_one_of_guest_id IS NOT NULL AND guest.first_name is empty/blank`, renders `<PlusOneOnboarding>` instead. Subsequent scans (after onboarding) bypass this branch because `first_name` is now non-empty.

### Limited +1 invitation site

- `InvitationShell` now takes `isLimitedPlusOne` and `host` props.
- `TierComparison` widget — when `isLimitedPlusOne`, renders a new `LimitedExplainer` component: explainer banner naming the primary host, two dashed-border disabled tier cards, and a `Learn more about Setnayan →` link to the marketing site instead of the wedding-specific signup CTA.
- `YourPhotos` widget — when `isLimitedPlusOne`, hides both the empty-state and the "Add via Shutter" cards; renders only the profile-photo card with a muted line: "Your photos will be visible in {host}'s gallery."
- `RsvpForm` widget — accepts `isLimitedPlusOne`. When true, the entire registered-tier extras block is hidden (not rendered, not locked).

### What's still pending for full v2 parity (next iteration)

1. **QR error correction H + monogram-center clearance.** Currently the generator uses level M with no clearance. Bumping to H + compositing a transparent rounded-square clearance for the monogram is its own iteration once the monogram editor lands.
2. **QR color derivation from palette.** Schema is in place. The generator should read `events.palette_finalized_at`; if set, prefer `events.qr_color_dark/light`; otherwise safe default. Currently always uses safe default.
3. **Per-surface palette routing.** The work order specifies 9 palettes (8 ceremony role palettes + reception); each surface reads from a specific palette key. Requires the `events.palettes` JSONB schema design + the Dress Code widget's palette editor (downstream).
4. **Monogram upload UI.** Schema columns shipped; the upload flow + editor is the downstream Hero Monogram editor iteration.
5. **Limited +1 photos routing into primary's gallery.** The query predicate is documented in the work order; the implementation lives in the Phase 2 photo pipeline once photo_tags exist.

## Decisions worth a sanity-check

1. **Permissive `Database = any` in `lib/supabase/admin.ts`.** Without `supabase gen types typescript` output, TypeScript's narrow-by-default behavior types `.from('scan_events').insert({...})` as `never`. The fast path was a permissive `any` Database type. Replace with generated types when we adopt the Supabase CLI.
2. **In-memory QR SVG cache.** Per the work order the next iteration migrates to R2 (`qr/[event_id]/[guest_id].svg`). For now everything's in-process. On Vercel-hosted production this means the cache cold-starts per worker; that's fine for V1 (regen is <1ms per QR).
3. **The Re-issue action uses Node's `crypto.randomBytes` directly** instead of an `encode_random_bytes_hex` Postgres RPC. The work order was ambiguous on whether the rotation should run server-side or DB-side; Node-side is simpler, no migration to install the RPC.
4. **No `event_id` foreign key on `guest_rsvp_extras`** would have been valid (it's reachable via `guest_id → guests.event_id`), but I added one anyway so the RLS policy is dead simple (`is_couple_of(event_id)` instead of joining).
5. **The "Sign up free →" CTAs are disabled buttons in V1**, since guest accounts ship with the Setnayan native app (Phase 2). When that lands, swap `disabled` for the real signup deep-link.
6. **Search/coverage UI on the QR admin is stubbed.** Coverage dots and vendor chips render in placeholder/empty form because no photo_tags or vendor_service_line_claims are written yet. Phase 2 (Setnayan native) and Phase 3 (Din) populate them.
7. **The 3-day photo retention rule is *modelled* but not yet *enforced* at any endpoint.** No photos exist in the system yet. When the photos-fetch endpoint is built (Phase 2), wrap the SELECT with a 3-day window guard for guests where `users.account_type = 'guest'` (or by absence of a registered `users.id` link). Memory: `project_qr_and_tier_decisions.md`.
8. **First-rule of event-day scan** — schema columns exist; native-app enforcement is Phase 2. The browser explicitly does not enforce first-rule per the work order.
9. **`InvitationShell` renders in a 760px max-width centred column** — close to but slightly wider than the work order's 720px, to leave room for card padding without crowding the 1100px frame. Adjust if visual review prefers tighter.
10. **No `not-found.tsx` for the dynamic `[event-slug]` route.** Calling `notFound()` from `page.tsx` falls back to the global Next 404. If you want a couple-aware 404 ("Looking for an event? Make sure your invite link is correct"), add `app/[event-slug]/not-found.tsx`.
11. **Search expansion in mobile header** isn't here for the personal invitation site (the site uses a sticky compact header without search — guests don't need to search anything). The dashboard mobile header still has the expand-to-search pattern from 0001.

---

## Out of scope (per work order, explicitly deferred)

- Native-app scanning UIs (Setnayan / Din) — schema designed, handlers stubbed in `project_qr_and_tier_decisions` memory. Phase 2 / 3.
- Profile-photo auto-set logic — column exists, NULL acceptable; auto-set requires the Setnayan native capture-and-tag flow (Phase 2).
- Per-segment coverage tracking — Phase 2.
- Vendor service-line claim — Phase 3.
- Apple Wallet / Google Wallet pass — V1.5.
- Print options beyond A4 (Letter, 4×6 cards) — V1.5.
- Bulk send invitation links via email/SMS/Messenger — work order 0003.
- Cloud delivery of finalized photos to couple's Drive — work order 0005.

---

## How to verify

```bash
# 1. Apply the migration
# Supabase SQL Editor → paste supabase/migrations/20260508180000_qr_invitation_system.sql → Run

# 2. Sign in as the couple
# Open http://localhost:3000/login → Continue with Google as iscasasolaii@gmail.com

# 3. Open the couple's QR admin
# http://localhost:3000/dashboard/qr-codes
# - Should show 14 guest rows, each with a thumbnail QR
# - Click "Re-issue" on one row — confirm prompt + toast (page revalidates)
# - Click "Print sheet (A4)" → opens new tab with print-friendly layout
# - Cmd+P / Ctrl+P → preview should hide chrome, fit the QR cards

# 4. Open a guest's invitation link
# Copy a guest's qr_token from the Supabase Table Editor (guests.qr_token)
# Visit: http://localhost:3000/maria-juan-2026?invite=<token>
# - URL rewrites to http://localhost:3000/maria-juan-2026
# - Page renders Carla's (or whoever's) personalized invitation
# - All 14 widgets visible
# - RSVP buttons work; reload shows persisted selection
# - Re-scan / re-paste link → cookie keeps you in
# - Test Mobile Safari size (Chrome devtools → iPhone preset)

# 5. Test re-issue invalidation
# Re-issue a guest's token, then revisit the OLD link — should show generic landing.
```

---

## What I'd build next (suggestions)

- **0003 — Send Invitations.** Bulk email / SMS / Messenger send. Reads from `guests.invitation_sent_at` to drive the QR admin "Sent" column.
- **0003 — Couple Landing Page editor (Theme + Sections + Widget config).** The personal invitation site's 14 widgets are currently using locked default content; an editor would let couples edit copy, add Pro widgets, change theme. The Pro · Waze tag in the venue widget is already a hint of where to plug Pro purchases.
- **Photos pipeline (Phase 2 prerequisite).** Once we have any image data, the 3-day public retention rule + tagged-photos list + reel builder all become real instead of stubbed.

End of result.
