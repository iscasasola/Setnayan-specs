# Event-Day Hub — Build Plan (Phase 2 of the event-day guest-hub program)

> Created 2026-06-28. Cold-start brief for a dedicated session to build the
> fullscreen, no-scroll event-day guest hub. Companion to the `DECISION_LOG.md`
> rows "Event-day guest-hub program" (PR1 unify #2356, PR4 3-shot selfie #2360,
> PR5 souvenir station #2361). **Code is canonical** (2026-06-07 ground-truth
> posture) — verify every file/function below against `apps/web` @ origin/main
> before building; this doc is reference + history.

## Why this exists

Owner ask (2026-06-28): on the day, a guest opens their event page on their
phone and sees **one screen-filling, no-scroll hub with a bottom MENU that
toggles between the day-of functions** — instead of a long scrolling page.
"Everything shows in realtime, fills the screen, menu to toggle between
functions."

Phase 1 (shipped) unified the event-day bottom bar across guest / anonymous /
host-preview views and added the genuinely-new capabilities (3-shot selfie,
souvenir station). Phase 2 is the fullscreen hub itself — the centerpiece.

## Locked decision: a NEW route, NOT a rewrite of `/[slug]`

`apps/web/app/[slug]/page.tsx` is 4,100+ lines serving guests, anonymous
visitors, STD/reveal, RSVP, and day-of. It branches:
`if (!guest)` → `<PublicLanding>` (no personal data), else → `<InvitationSite>`
+ `<GuestHubBar>`. A fullscreen rewrite of this file risks regressing all of
that.

**Build a separate fullscreen route — `/[slug]/hub` (or `?view=live`) —**
reachable from the event-day bottom bar that already exists (`GuestHubBar` /
`PublicEventDayBar`). The current page stays 100% intact. *(Open choice to
confirm with owner: distinct route vs. `?view=live` mode. Recommendation:
distinct route for cleanest isolation.)*

## Panels (bottom toggle menu swaps screen-filling panels; no page scroll)

| Panel | Content | Reuse |
|---|---|---|
| **Now** | happening-now + next schedule block + your table/seat + arrival | `guest-hub-card.tsx` (`pickNextScheduleBlock`), `day-of-mode/whats-happening-card.tsx`, `your-table-card.tsx` |
| **Schedule** | full live program, auto-refreshing | `app/[slug]/_components/schedule-widget.tsx`; `day-of-mode/live-schedule-card.tsx` (60s tick) |
| **Directions** | Google Maps + Waze + Apple Maps to the venue | `app/_components/nav-links.tsx` `<NavLinksRow>` from `events.venue_latitude/longitude` (address fallback); see `<VenueWidget>` in page.tsx |
| **Watch** | Panood live stream (when live) | `watchLive` / `<WatchLiveBlock>` in page.tsx, `lib/panood-control.ts` |
| **Camera** | Papic launch | `guest-hub-bar.tsx` logic: `/papic/me/{qr_token}` (personal roll) or `/papic/guest` (candid); `papicGuestActive` via `lib/papic-guest` |
| **Photos** | "photos of you" + live photo wall | `lib/guest-live-gallery.ts` (`getGuestLiveGallery`), `/papic/me/{token}`, `live-wall-block.tsx` + `/[slug]/live-wall` |
| **Me** | guest QR (crew tagging + souvenir scan) + 3-shot face enroll | QR modal in `guest-hub-bar.tsx`; `day-of-face-enroll.tsx` (already `multiShot`, #2360) |

Respect the responsive ruleset: ≤5 primary menu slots + a "More" overflow on
mobile. Seat/table wayfinding also exists: `/[slug]/find-my-table`, 3D venue
`/[slug]/venue`.

## Data + identity

- **Phase gating:** `lib/day-of-mode.ts` `getDayOfPhase` (pre/live/post/inactive).
  The hub is meaningful in the live/post window.
- **Identity:** resolve the guest the same way `page.tsx` does
  (`setnayan_guest_session` cookie / `qr_token`). The personal panels (Me,
  Photos-of-you, personal Camera) need it.
- **No-guest degrade:** mirror `app/[slug]/_components/public-event-day-bar.tsx`
  (#2356) — candid Camera + public Photos only, no personal QR.

## Constraints (locked — surface a question rather than violate)

- No-scroll fixed-height shell: use the **card-vertical-fit** skill / `.inv-shell`
  pattern (topbar safe-area + bottom menu + home-indicator inset math).
- `useModalA11y` for any overlay; the shared **BottomNav** pattern for the menu;
  `--m-*` / cream·ink·mulberry·terracotta palette; lucide icons.
- Premium-UI doctrine: ONE signature moment, restrained motion.
- Prices are admin-catalog-driven, never hardcoded. RA 10173 for face/QR data.
- No server-side render with non-owned music. **V1 scope is locked** — flag any
  expansion. Seat plan stays free.
- Honor lint guards: `lint-nav-icon-source`, `lint-bottom-nav`, `lint-radius`.

## Definition of done

`tsc --noEmit` clean · `next lint` clean · production `next build` green (verify
with a prod build, not just dev). Add a `changelog.d/<slug>.md` fragment (do NOT
edit `CHANGELOG.md`/`STATUS.md`). Append a `DECISION_LOG.md` row in the corpus.
PR + auto-merge. Leave a Vercel preview link.

## Already shipped (do not rebuild)

- **PR #2356** — `public-event-day-bar.tsx`: unified event-day chrome on the
  no-guest / host-preview view.
- **PR #2360** — 3-angle face enrollment (`selfie-capture.tsx` `multiShot`,
  `enrollGuestFace` writes up to 3 `guest_face_enrollments` rows). Gated on the
  DORMANT on-device embedder (`lib/face-embed.ts`, `NEXT_PUBLIC_FACE_MODEL_URL`).
- **PR #2361** — souvenir station `/dashboard/[eventId]/guests/souvenirs` +
  `guest_souvenir_claims` table (migration `20270316014670`, applied to prod).
- **Directions, live schedule, your-table, live wall, watch-live, gallery,
  camera** already exist on the guest page — the hub WIRES them, doesn't rebuild.
- `day-of-mode/coordinator-broadcast-card.tsx` is a STUB ("coming soon", no
  backend) — skip it unless the broadcast feature is built first.
