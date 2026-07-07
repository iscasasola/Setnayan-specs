# Public Sample-Wedding Tour — Build Plan (2026-06-20)

> Maria & Jose curated public tour (Phase 2). Authored by the `scope-maria-jose-public-tour` ultracode workflow (8 mappers + architect synthesis), grounded in shipped code. PR1 (foundation + access boundary) shipped as #1910. PRs 2-7 below.

## Access boundary (the safety substrate — shipped in PR1)

Single resolver `app/tour/_lib/sample-event.ts`: service-role read, pinned to `is_sample=TRUE AND slug='maria-and-jose' AND event_type='wedding'`, NO client id, `cache()`+`notFound()` fail-safe. Every fetcher re-pins `event_id`. RSC-read only; `no-restricted-imports` lint forbids server actions under `app/tour/**`.

## Synthesized plan

All facts confirmed. Critical findings:

- Every lib data-fetcher (`fetchBudgetSnapshot`, `fetchGuestsByEvent`, `fetchTables`, `fetchAssignments`, `fetchPapicGallery`, `fetchWizardVendorRecommendations`) takes `supabase: SupabaseClient` as its **first arg** → the admin client is directly injectable. No rebuild of fetch logic needed.
- `getWallSnapshot` is the exception: it takes `eventId` first and builds its own admin client internally — still fine.
- Middleware matcher excludes only static assets; a `/tour` route passes through with no redirect rule touching it. No collision.
- Seed confirms slug `maria-and-jose`, `is_sample=TRUE`, `event_type='wedding'`, date `2026-12-12`, and no `landing_page_visibility` set (defaults public).

I have everything needed. Here is the build plan.

---

# Phase 2 Build Plan — Curated 5-Stop Public Wedding Tour

## 1. ACCESS ARCHITECTURE

### Route shape
A single, dedicated, hardcoded public segment that accepts **no event identifier from the client**:

```
app/tour/
  layout.tsx                 ← tour chrome (progress rail, "this is a demo" ribbon, next/prev)
  page.tsx                   ← intro / stop index
  _lib/sample-event.ts       ← THE resolver (the single trust boundary)
  _components/...             ← all client-only-interactive stop components
  invite/page.tsx            ← Stop 1 (Save-the-Date) — or deep-link to /maria-and-jose
  vendors/page.tsx           ← Stop 2 (AI match / shortlist)
  seating/page.tsx           ← Stop 3 (find-your-seat)
  budget/page.tsx            ← Stop 4 (budget + what-if)
  gallery/page.tsx           ← Stop 5 (live wall + mood board)
```

Stop routes can be flat segments **or** a single `page.tsx` with client-driven stop state. Recommendation: **separate RSC routes per stop** so each does its own server-side `is_sample`-pinned read and streams independently — simpler to reason about for the guardrail, and matches Next 15 ISR.

### The single trust boundary — `app/tour/_lib/sample-event.ts`

This is the **only** place an event is resolved for the entire tour. Every stop imports `getSampleEvent()` and `getSampleEventId()` from here; **no stop route ever reads `params`, `searchParams`, or any client value to pick an event.**

```ts
import 'server-only';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

// Hardcoded constant. NOT from URL. The slug is a belt to the is_sample suspenders.
const SAMPLE_SLUG = 'maria-and-jose';

export const getSampleEvent = cache(async () => {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('events')
    .select('event_id, display_name, slug, role_palette, love_story, event_date, monogram_svg_url, is_sample, event_type, landing_page_visibility, std_reveal_template, std_theme, our_photos')
    .eq('is_sample', true)            // ← PRIMARY gate: only an is_sample row can ever return
    .eq('slug', SAMPLE_SLUG)          // ← belt: pins to the one known sample
    .eq('event_type', 'wedding')
    .limit(1)
    .maybeSingle();

  // Hard assertion: refuse anything that isn't the sample, even if a future
  // seed mistake makes the query ambiguous.
  if (error || !data || data.is_sample !== true || data.slug !== SAMPLE_SLUG) {
    notFound();
  }
  return data;
});

export async function getSampleEventId(): Promise<string> {
  return (await getSampleEvent()).event_id;
}
```

### The hard guardrail (the single most important rule)
**No client-supplied id ever enters the data path.** The event is resolved server-side by `WHERE is_sample = TRUE AND slug = 'maria-and-jose'`. The resolved `event_id` lives only in server memory and is passed as an argument to each fetcher. Every downstream read re-pins it:

```ts
const sampleEventId = await getSampleEventId();
const guests = await fetchGuestsByEvent(admin, sampleEventId);   // .eq('event_id', sampleEventId) inside
```

Because there is **no URL segment carrying an id**, a visitor cannot tamper a real event into view — swapping any path segment lands back on the same hardcoded resolver or `notFound()`. This is structurally stronger than an anon RLS policy (whose blast radius would be every real event). **We add NO anon RLS policy** to `events`/`guests`/`event_vendors`/budget/seating/papic tables. `is_sample` becomes the *only* discriminator, and the tour code is the *first and only* place in the app that gates on it.

### Why this beats the alternatives (verified)
- `is_sample` has **zero** existing app-code references (greenfield — confirmed by grep).
- Every lib fetcher takes `supabase` as its first argument → the admin client injects cleanly with **no rebuild of fetch logic** (confirmed signatures above).
- `app/monogram/public-monogram-studio.tsx` is the proven precedent: public, no-login, reuses the dashboard engine, ends in a CTA, **never a server write**.
- The `/tour` path passes the middleware matcher untouched (no redirect rule applies; confirmed).

---

## 2. THE 5 TOUR STOPS (in order)

### Stop 1 — "You're invited" · Save-the-Date reveal + content film
- **Surface:** the existing public `/maria-and-jose` page in its `save_the_date` lifecycle phase (`app/[slug]/page.tsx` → `PublicLanding` → `<RevealOverlayServer>` + `<SaveTheDateView>`/`<SaveTheDateFilm>`).
- **What it shows:** the sheer-veil cinematic reveal lifting to uncover the self-playing Save-the-Date film, recoloured to Maria & Jose's mood-board palette (monogram → names → 12.12.2026 → love-story teaser → add-to-calendar).
- **Client-only-interactive moment:** **built-in and zero-build** — tap left/right thirds to scrub beats, press-and-hold to pause. All local RAF state in `save-the-date-film.tsx`; nothing persists.
- **Reuse vs rebuild:** **REUSE verbatim.** The tour deep-links to `/maria-and-jose` (already fully public, already `is_sample`, already `landing_page_visibility` default-public). The only code touch is a **one-line guard**: skip `<StdViewBeacon>` when `event.is_sample` so the tour doesn't inflate STD analytics (the flag is already SELECTed into scope at `page.tsx`).
- **Optional seed enrichment (data, not code):** add a finalized venue + religious_venue booking and populate `our_photos` so the film plays its full beat spine instead of the trimmed monogram→names→date version.

### Stop 2 — "The AI did the hard part" · Setnayan AI vendor match + shortlist (HEADLINE STOP)
- **Surface:** new `app/tour/vendors/page.tsx` (RSC, admin client, pinned to sample).
- **What it shows:** the sample's curated shortlist grouped by category (reuse the visual language of `shortlist-categories.tsx` / `plan-budget-accordion.tsx`), each pick carrying its **% match pill** (`computeCompatScore`), Verified/Setnayan badges, distance-from-venue chip, and the relationship-depth framing. Then a "See how Setnayan ranked them" panel for one category (e.g. Photographer) showing the ranked candidate list with the tier ladder (boosted → top-reviews → nearest).
- **Client-only-interactive moment:** a **Setnayan-AI toggle** (mirror `summary-ai-toggle.tsx`). Flipping it client-side re-sorts the already-loaded candidate list in the browser — strip % pills + drop proximity sort when OFF, restore when ON — so the visitor *feels* the intelligence appear/disappear with **zero DB write**. Secondary: tap "Add to shortlist" on a candidate → it moves into the picks column in **local React state only** (no `saveVendorToPicks`).
- **Reuse vs rebuild:** REUSE the ranking output shape (`CategoryVendorResult`) and presentational cards/pills/badges (they render from plain props). REUSE `fetchWizardVendorRecommendations(admin, …)` — but call it from this pinned route with **`excludeVendorIds: []`** so the `is_demo` sample vendors are kept IN (the real path excludes them via `fetchDemoVendorIds`), and pass a synthetic `{ planning_mode: 'guided' }` so `isSetnayanAiActive` returns true and the % pills show. REBUILD only: a thin client fork of the category-search overlay whose Add button calls **no server action** (the real one hits `saveVendorToPicks` — stubbed in the tour variant). Do **not** touch `page.tsx`'s auth gate, `fetchEventVendors`, or the demo-exclusion path.

### Stop 3 — "Everyone has a seat" · Find-your-seat
- **Surface:** new `app/tour/seating/page.tsx` (RSC, admin client, pinned).
- **What it shows:** Maria & Jose's finished reception floor — 7 tables + 28 seats around the stage — rendered with the production `<WayfindingMap>` (stage banner, conventional shapes, entrance marker), looking exactly like the real day-of guest experience.
- **Client-only-interactive moment:** a name-search box (reuse the `<NameSearch>`/`MatchCard` UX). Visitor types a demo guest name → matched table lights emerald with a dotted path from the entrance. **Recommended wiring: pass the sample tables + assignments to the client once and do the name→table match in-memory** (pure client filter, nothing saved, no rate limits, no dependency on `published_at`). Avoids even the `public_seat_lookup` network call.
- **Reuse vs rebuild:** REUSE `<WayfindingMap>` **verbatim** (props-only, no DB — confirmed) and the `lib/seating.ts` geometry helpers; REUSE `fetchTables(admin, sampleEventId)` + `fetchAssignments(admin, sampleEventId)`. REBUILD only the thin name-search-over-local-data client component. Do **NOT** mount `<SeatingEditor>` (4831 lines, auth+lock+RLS-bound) or `seating/actions.ts`.

### Stop 4 — "Money, handled" · Budget + what-if
- **Surface:** new `app/tour/budget/page.tsx` (RSC, admin client, pinned).
- **What it shows:** the Budget summary strip (Target / Committed / Budget-left), the StatsStrip, and per-vendor itemization cards from the sample's 18 budget lines (`VendorItemizationCard` render tree).
- **Client-only-interactive moment:** the **Suggested budget split planner** (`BudgetAllocationPlanner`) is **already a pure client engine** that re-runs on every slider tilt and never saves — ideal. The visitor drags per-category sliders and the split recomputes live with zero writes.
- **Reuse vs rebuild:** REUSE the render tree (`VendorItemizationCard`, summary/stats tiles, `BudgetAllocationPlanner`) and the totals math inside `fetchBudgetSnapshot(admin, sampleEventId)`. **STRIP** all mutation forms (add/delete line item, log payment), the `.ics` export, the orders/Setnayan-Pay reads, and the off-platform pay-method/installment helpers (`fetchPublishedMethodsForCouple`/`fetchPlanForCouple`) — they pull payment-method PII + real-money state and add no tour value.

### Stop 5 — "See it come alive" · Live photo wall + mood board
- **Surface:** new `app/tour/gallery/page.tsx` (RSC, admin client, pinned).
- **What it shows:** the `<LiveWallBlock>` grid of ~8–12 screened wall-safe tiles for the sample event (live header "Live from the celebration · N moments and counting" + Kwento lower-third), plus the mood-board palette swatches and 7 inspiration items. Optionally pair with `OurPhotosWidget` (`events.our_photos`, already PII-free public).
- **Client-only-interactive moment:** drive a client-only "new photo just arrived" animation — push a pre-seeded tile into `<LiveWallBlock>`'s `tiles` `useState` on a timer so a fresh tile rises in with the existing `animate-wall-enter` keyframe. Disable the 25s network poll (it would 404/no-op for a future-dated sample). Per-tile `SavePhotoButton` is a natural client-only affordance (downloads the presigned image, saves nothing). Palette swatch picker recolors a preview in local state.
- **Reuse vs rebuild:** REUSE `<LiveWallBlock>` and `getWallSnapshot(sampleEventId, …)` — both already render for the anonymous PublicLanding path. The wall data must exist in the screened `wall_feed` mirror for the sample (seed 8 wall-safe tiles via the `wall_ingest`/`wall_visible_photos` path, not raw `papic_photos`). REUSE mood-board palette utils (`lib/mood-board.ts`). Do **NOT** expose `papic_photos`/`papic_guest_captures` directly; do **NOT** reuse `getGuestLiveGallery` (needs a per-guest cookie + implies a fake guest identity).

---

## 3. PUBLIC ENTRY CTA + WHERE IT LIVES

- **Primary CTA:** a "See a real wedding — no sign-up" / "Take the tour" button on the **marketing homepage** (`app/page.tsx`) hero or the couple-band, linking to `/tour`. This is the conversion hook: anonymous visitors walk the whole thing, then hit a "Start planning free" CTA into the sign-up funnel (same end-pattern as `public-monogram-studio.tsx`).
- **Secondary placements:** in `/explore` (the public marketplace) as a "Not sure where to start? Walk a sample wedding" banner; and on `/for-vendors` reframed as "See how couples shortlist vendors."
- **Tour chrome:** `app/tour/layout.tsx` renders a persistent progress rail (1–5), prev/next, a subtle **"This is a demo wedding — nothing you do here is saved"** ribbon, and a closing "Start your own — free" CTA after Stop 5.

---

## 4. SCRIPTED CHAT APPROACH

Chat is **not** part of the 5 headline stops but is a strong inline beat inside Stop 2 (vendor) — a "message a vendor" affordance on a shortlisted pick.

- **Design: pure static script (Option A), self-contained client component.** Anon RLS already returns zero chat rows, and chat is not in the demo seed — so the tour **never queries `chat_threads`/`chat_messages` and never imports `sendChatMessage`**.
- **Build `<TourChatThread>`** (new client component under `app/tour/_components/`):
  - REUSE the bubble + typing-indicator JSX/Tailwind classes **verbatim** from `app/_components/chat-message-stream.tsx` (copy the render block, **not** the Realtime/presence effects).
  - REUSE the textarea + Send-button markup from `app/_components/chat-send-form.tsx`, but swap the server-action `action` for a local `onSubmit`.
  - Visitor types → `onSubmit` appends their message to local state (right-aligned "You" bubble) → ~1.2s "vendor is typing…" delay (reuse the existing indicator markup) → append a **scripted vendor reply** from a hardcoded array cursor.
  - `const VENDOR_SCRIPT = ['Hi Maria! We'd love to be part of your day…', …]` advanced one step per visitor send. On reload it resets.
- **Vendor identity:** to make the name/logo real, the parent RSC may read **only `vendor_profiles` for `is_demo=TRUE`** vendors on the sample shortlist (service-role, pinned) and pass `business_name`/logo as `counterpartyLabel`. Message bubbles stay client-side script constants — **never read `chat_messages`, never call `adminReplyAsVendor`.**

---

## 5. CLIENT-ONLY WRITE-SUPPRESSION MECHANISM

Three layers guarantee non-persistence (owner's "actions update on-screen but never save"):

1. **No server actions wired anywhere in `/tour`.** Stop RSCs render data; all "alive" interactions live in client components that hold **local React state only**. No `'use server'` files, no route handlers, no `<form action={serverAction}>` under `app/tour/`.
2. **Import boundary (belt):** tour client components **must not import any existing dashboard/chat/seating server actions** (`saveVendorToPicks`, `sendChatMessage`, `submitRsvp`, `addLineItem`, `logPayment`, seating `actions.ts`, etc.). Enforce with an ESLint `no-restricted-imports` rule scoped to `app/tour/**` (the codebase already uses import-boundary lint per the app-independence contract). A CI guard makes accidental wiring fail the build.
3. **Service-role is read-only by convention here.** The admin client is used **only** for SELECTs in the tour resolver + fetchers. No `.insert/.update/.delete/.upsert/.rpc(write…)` appears anywhere under `app/tour/`. Add it to the same lint scope as a forbidden pattern if you want a hard stop.

Net: a visitor's "Add to shortlist", "Send message", slider drag, name-search highlight, and "new photo arrived" all mutate component state and reset on reload. Nothing reaches Postgres.

---

## 6. RISKS (esp. real-data leakage)

- **R1 — a real event surfacing (highest severity, fully mitigated).** Mitigation: the single resolver pins `WHERE is_sample=TRUE AND slug='maria-and-jose' AND event_type='wedding'`, asserts `is_sample===true && slug===SAMPLE_SLUG` post-fetch, and **accepts no client id**. A real event (`is_sample=FALSE`) is structurally unreachable. Every fetcher re-pins `event_id=sampleEventId`.
- **R2 — adding an anon RLS policy by mistake.** Do **not**. Service-role + `WHERE is_sample` is far narrower and reversible; an anon policy on `events`/`guests` would expose **every** real event. Belt: a migration-review note.
- **R3 — demo vendors leaking into real surfaces.** The tour deliberately passes `excludeVendorIds:[]` to keep demo vendors in — this is **scoped to the tour route only**. Risk = someone widens the real `/explore`/`category-search` exclusion. Mitigation: the tour calls `fetchWizardVendorRecommendations` directly with its own args; it never edits the shared exclusion logic.
- **R4 — PII in budget/seating.** Render only `{table_label, display_name, x/y}` for seating; **strip** the off-platform pay-method/installment/orders reads in budget. No `qr_token`, contact, meal, or `guest_id` crosses to the client.
- **R5 — Papic raw tables.** Only `wall_feed` (screened mirror, no PII, event-scoped) is read via `getWallSnapshot`. `papic_photos`/`papic_guest_captures` and `getGuestLiveGallery` are **never** touched.
- **R6 — analytics pollution.** Suppress `<StdViewBeacon>` and the wall 25s poll when `is_sample`, so the tour doesn't inflate STD/wall stats or hit a 404.
- **R7 — accidental server write via an imported action.** Mitigated by the §5 import-boundary lint + CI guard.
- **R8 — sample event de-flagged.** If a future seed flips `is_sample` off, the resolver `notFound()`s (fails safe — tour 404s rather than showing a real event).

---

## 7. PR-BY-PR BUILD SEQUENCE (smallest safe foundation first)

**PR1 — Tour foundation + access boundary (no UI).** `app/tour/_lib/sample-event.ts` (the pinned `cache()` resolver), `app/tour/layout.tsx` (chrome shell, demo ribbon), `app/tour/page.tsx` (intro/index). Add the ESLint `no-restricted-imports` rule scoped to `app/tour/**` forbidding all dashboard/chat/seating server actions + the admin client's write methods; wire it as a CI check. **This is the entire safety substrate — review it hardest.** Verify: `/tour` renders, resolver returns only the sample, swapping nothing leaks.

**PR2 — Stop 1 (Save-the-Date), lowest-effort, mostly data.** Add the one-line `is_sample` guard suppressing `<StdViewBeacon>` in `app/[slug]/page.tsx`. Wire the tour intro to deep-link / embed `/maria-and-jose`. Seed enrichment (venue + religious_venue booking, `our_photos`) as a separate seed script so the film plays its full spine. Proves the read-only public surface end-to-end with near-zero new code.

**PR3 — Stop 3 (Seating).** `app/tour/seating/page.tsx` (admin client, `fetchTables`/`fetchAssignments` pinned) + `<WayfindingMap>` reuse + the in-memory name-search client component. Self-contained, no shared-surface risk — good second build to validate the fetcher-injection pattern.

**PR4 — Stop 4 (Budget).** `app/tour/budget/page.tsx` reusing `fetchBudgetSnapshot(admin, id)` + `VendorItemizationCard` + `BudgetAllocationPlanner`, with all mutation/PII/money reads stripped.

**PR5 — Stop 5 (Gallery + live wall).** Seed 8 wall-safe tiles into `wall_feed` for the sample; `app/tour/gallery/page.tsx` reusing `<LiveWallBlock>` + `getWallSnapshot` with poll disabled + the timer-driven "new tile" animation; mood-board palette picker.

**PR6 — Stop 2 (AI match) + scripted chat — the headline, built last because it has the most reuse-fork surface.** `app/tour/vendors/page.tsx` calling `fetchWizardVendorRecommendations(admin, { …sample coords/ceremony/pax, excludeVendorIds: [], planning_mode:'guided' })`; client fork of the category-search overlay with a stubbed Add button; the AI on/off client re-sort; `<TourChatThread>` with the verbatim bubble markup + `VENDOR_SCRIPT`.

**PR7 — Entry CTAs + polish.** Homepage / `/explore` / `/for-vendors` CTAs into `/tour`; the closing "Start free" CTA after Stop 5; progress-rail wiring; final pass confirming the import-boundary lint is green and zero write calls exist under `app/tour/`.

---

### Key file paths (all under `/Users/icecasasola/wt-public-surface/apps/web/`)
- Access boundary: `app/tour/_lib/sample-event.ts` (new) · admin client `lib/supabase/admin.ts`
- Reuse-as-is: `app/_components/wayfinding-map.tsx`, `app/[slug]/_components/save-the-date-film.tsx`, `app/[slug]/_components/live-wall-block.tsx`, `app/[slug]/_components/reveal/reveal-overlay-server.tsx`, `app/monogram/public-monogram-studio.tsx` (precedent)
- Fetchers (admin-injectable, confirmed first-arg `supabase`): `lib/budget.ts:459`, `lib/guests.ts:249`, `lib/seating.ts:85/111`, `lib/wizard-recommendations.ts:279`, `lib/live-wall.ts:191`, `lib/papic-gallery.ts:35`
- Component-markup donors (copy JSX, drop effects/actions): `app/_components/chat-message-stream.tsx`, `app/_components/chat-send-form.tsx`, `app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx`, `app/dashboard/[eventId]/budget/_components/budget-allocation-planner.tsx`, `app/dashboard/[eventId]/_components/vendor-itemization-card.tsx`
- Never reuse in tour: `app/dashboard/[eventId]/seating/_components/seating-editor.tsx`, `seating/actions.ts`, `lib/chat-actions.ts` (`sendChatMessage`), `app/admin/demo-vendors/inquiries/actions.ts` (`adminReplyAsVendor`), `lib/guest-live-gallery.ts`
- One-line guard: `<StdViewBeacon>` suppression in `app/[slug]/page.tsx` when `event.is_sample`

## Mapper findings (per surface)

### ACCESS MODEL — auth/RLS map + safest architecture for a public no-login read-only tour of ONLY the is_sample event
- **files:** /Users/icecasasola/wt-public-surface/apps/web/middleware.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/supabase/middleware.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/supabase/server.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/supabase/admin.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/layout.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/wall/[eventId]/page.tsx
- **data:** THREE distinct data paths exist; the tour must use the THIRD.

(1) NORMAL DASHBOARD (authenticated, RLS-scoped): RSC layout/pages build a per-request anon-key client via createClient() (lib/supabase/server.ts — wraps @supabase/ssr createServerClient with NEXT_PUBLIC_SUPABASE_ANON_KEY + cookie session, React-cache()'d per request). Every .from('events'|'guests'|...) call is constrained by Postgres RLS keyed on the signed-in user.

(2) MIDDLEWARE (session refresh ONLY, NOT a gate): middleware.ts → updateSession() (lib/supabase/middleware.ts) only validates/refreshes the auth cookie via supabase.
- **auth:** DASHBOARD GATE (app/dashboard/[eventId]/layout.tsx, lines 76-128): getCurrentUser() → if null redirect(loginRedirectPath(...)); then membership check event_members WHERE event_id=? AND user_id=? requiring member_type==='couple', ELSE fallback event_moderators (accepted, not removed) check, ELSE notFound(). So a logged-in non-member 404s; an anonymous visitor is redirected to /login. RLS BACKSTOP: 
- **readonly:** HIGHLY FEASIBLE and LOW-RISK — the codebase already has the exact pattern. RECOMMENDED ARCHITECTURE: a dedicated, hardcoded route (NO event-id/slug param accepted from the client), e.g. app/tour/page.tsx + app/tour/[stop]/page.tsx, server-only, that reads via createAdminClient().

THE NAMED GUARDRAIL (single most important rule): resolve the event with a SERVER-SIDE-ONLY filtered query and NEVER accept an event_id/slug from the URL or client. Concretely: admin.from('events').select(...).eq('is_sample', true).eq('event_type','wedding').limit(1).maybeSingle() — if the row is missing, notFound().
- **stop:** YES — build it as a dedicated public tour. Shape:

ROUTE: app/tour/page.tsx (intro) + stop routes (or one page with client-driven stop state). Single server resolver getSampleEvent() (cache()'d, service-role, WHERE is_sample=TRUE AND event_type='wedding', maybeSingle → notFound). Every stop fetcher takes the resolved sampleEventId as an argument; never from params.

5 STOPS mapped to seeded data: (1) Couple Website / Save-the-Date — REUSE app/[slug] near-verbatim since it is ALREADY public+service-role; the sample's slug is 'maria-and-jose', so this stop links to /maria-and-jose (zero rebuild)

### Papic guest photo gallery (couple gallery + on-the-day guest/wall galleries on /[slug])
- **files:** /Users/icecasasola/wt-public-surface/apps/web/lib/papic-gallery.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/guest-live-gallery.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/live-wall.ts, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/live-wall-block.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/live-wall/route.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/studio/papic/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/studio/papic/_components/papic-gallery-grid.tsx
- **data:** There are THREE distinct Papic gallery surfaces with three different data paths:

(1) COUPLE GALLERY (dashboard, auth-only). `app/dashboard/[eventId]/studio/papic/page.tsx` → at line 1320 calls `fetchPapicGallery(supabase, eventId)` (lib/papic-gallery.ts) using the AUTH-BOUND server client `createClient()`. It reads `papic_photos` + `papic_guest_captures` directly under the couple's RLS session, joins `photo_tags` for tag dots, filters out NSFW/hidden/expired, and presigns thumbnails via `displayUrlForStoredAsset`. The page hard-gates: line 205-206 `auth.getUser()` → `redirect('/login')`. This
- **auth:** papic_photos RLS (migration 20260520015000): only `papic_photos_couple_full` (TO authenticated, event_members membership) + `papic_photos_claimer_own` (TO authenticated, seat claimer). papic_guest_captures (20260718000000): `papic_guest_captures_couple_read` + `_admin_all`. wall_feed (20261104000959): `wall_feed_member_read` + `wall_feed_admin_all`, with an EXPLICIT comment 'NO TO anon policy by d
- **readonly:** FEASIBLE and LOW-RISK — the safest of all the Papic surfaces because the wall path NEVER touches raw capture tables and carries no guest PII. The Live Photo Wall mirror (getWallSnapshot via admin client → screened wall_feed, event-scoped) already renders for a cookie-less anonymous visitor today; it only needs two application-code unlocks, no schema/RLS change and no new public read of papic_photos:
  (a) the `dayOfPhase==='live'` gate (page.tsx line 678) — the sample event isn't 'live' by date, so add an `event.is_sample` OR-branch that forces the wall block to render (mirroring the existing 
- **stop:** YES — this should be a tour stop ('The live photo wall — see the wedding unfold'). What it shows: the LiveWallBlock grid of ~8-12 screened wall-safe tiles for Maria & Jose, with the live header ('Live from the celebration · N moments and counting') and a Kwento lower-third caption — exactly the on-the-day experience a remote relative sees. REUSE vs REBUILD: REUSE the existing `<LiveWallBlock>` component and `getWallSnapshot` read verbatim — both are already wired for the anonymous PublicLanding path; the only changes are the two is_sample gate bypasses described above plus seeding wall_feed fo

### Setnayan AI vendor match / recommendations / shortlist (the matchmaking moat)
- **files:** /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/vendors/_actions/category-search.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/wizard-recommendations.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/setnayan-ai.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/compat-score.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/vendors/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/vendors/_components/category-search-overlay.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/vendors/_components/plan-budget-accordion.tsx
- **data:** Two distinct surfaces:

(A) IN-EVENT "AI match" overlay (the moat) — server entry app/dashboard/[eventId]/vendors/page.tsx (RSC). The live match runs in the server action searchCategoryVendors() in _actions/category-search.ts, called by the client overlay category-search-overlay.tsx (opened from shortlist-categories.tsx). It: (1) auth+membership-gates via supabase.auth.getUser() then reads events RLS-bounded (non-member => ev===null => bail); (2) resolves the plan group's canonical services; (3) calls fetchWizardVendorRecommendations(admin, …) in lib/wizard-recommendations.ts, which queries th
- **auth:** In-event match + shortlist are hard authenticated + member-gated. page.tsx: getCurrentUser() => redirect('/login'). searchCategoryVendors: getUser() => EMPTY if no user, then events RLS (event_member_can_read, base migration 20260512000000: USING event_id IN (SELECT current_event_ids())) returns null for non-members => EMPTY. event_vendors SELECT policy (20260513100000 event_vendors_couple_read) i
- **readonly:** MIXED. The RANKING ENGINE is already anon-safe (vendor_market_stats + vendor_profiles are anon-GRANTed; /explore renders with no user). But the SAMPLE SHORTLIST is NOT publicly readable today and the is_sample plumbing is half-built:

BLOCKERS: (1) events SELECT RLS has only event_member_can_read — no anon/is_sample carve-out. (2) event_vendors SELECT is TO authenticated + current_couple_event_ids() — an anon visitor cannot read the sample event's 38 shortlisted picks at all. (3) ZERO app code reads events.is_sample — grep across apps/web returns nothing; migration 20270203791173 explicitly sa
- **stop:** YES — this is the headline tour stop ("the AI did the hard part"). What it shows: the sample event's curated shortlist grouped by category (reuse the visual language of shortlist-categories.tsx / plan-budget-accordion.tsx) with each pick carrying its compat % pill, Verified/Setnayan badges, distance-from-venue chip, and the relationship-depth/"Your vendor" framing — exactly what searchCategoryVendors + computeCompatScore produce. Then a "See how Setnayan ranked them" moment: open a read-only version of the category-search overlay for one category (e.g. Photographer) showing the ranked candidat

### Seating chart (seat plan) — couple editor + the two public guest-facing read-only seat surfaces
- **files:** /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/seating/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/seating/_components/seating-editor.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/seating/actions.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/seating.ts, /Users/icecasasola/wt-public-surface/apps/web/app/_components/wayfinding-map.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/find-my-table/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/find-seat/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/find-seat/_components/name-search.tsx
- **data:** Three distinct surfaces, three distinct data paths:

(1) COUPLE EDITOR — `app/dashboard/[eventId]/seating/page.tsx` is an async RSC. It calls `getCurrentUser()` (redirect('/login') if absent), then an authed RLS Supabase server client (`@/lib/supabase/server`) drives `fetchTables` / `fetchAssignments` / `fetchFloorPlan` / `fetchBooths` / `fetchSigns` (all in `lib/seating.ts`, reading `event_tables`, `event_seat_assignments`, `event_floor_plan`, `event_floor_booths`, `event_floor_signs`) plus guests/groups. It passes everything to the client `<SeatingEditor>` (4831 lines). Every mutation (seat 
- **auth:** Surface-by-surface: (1) The couple editor is hard-gated — RSC does `getCurrentUser()` → redirect('/login'); every server action in actions.ts repeats `supabase.auth.getUser()` → redirect('/login') and runs under RLS on `event_tables`/`event_seat_assignments` (event-member / coordinator-delegate policies, e.g. migrations 20261129003000, 20260513090000) plus an exclusive editor lock. NOT anon-reacha
- **readonly:** LOW difficulty — the read-only render path already exists and is anon-clean. Two safe build options, no editor reuse:

EASIEST / SAFEST: lean on what already ships. `<WayfindingMap>` (app/_components/wayfinding-map.tsx) is a pure props-in, zero-DB, read-only floor renderer (stage + tables + entrance + path). For a tour stop, fetch the sample event's `event_tables` + `event_seat_assignments` in a NEW anon RSC scoped by `events.is_sample = TRUE` (or slug 'maria-and-jose' AND is_sample) via the admin client, the same admin-client + slug-scope pattern find-my-table already uses, and pass them into
- **stop:** YES — strong tour stop. WHAT IT SHOWS: the finished reception floor for Maria & Jose — 7 tables + 28 seats laid out around the stage, rendered with the production `<WayfindingMap>` so it looks exactly like the real day-of guest experience (stage banner, conventional table shapes, entrance marker).

CLIENT-ONLY-INTERACTIVE MOMENT: a name-search box (port/reuse the `<NameSearch>` UX) where the visitor types a demo guest name → the matched table lights up emerald with a dotted path drawn from the entrance ('You're here'). This is naturally client-only/non-persisting: it only reads + highlights, i

### Save-the-Date reveal + content film (the public /[slug] couple page in its save_the_date lifecycle phase)
- **files:** /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/save-the-date.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/save-the-date-film.tsx, /Users/icecasasola/wt-public-surface/apps/web/lib/save-the-date-content.ts, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/reveal/reveal-overlay-server.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/reveal/reveal-overlay.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/[slug]/_components/reveal/veil-reveal.tsx, /Users/icecasasola/wt-public-surface/apps/web/lib/invitation-widgets.ts
- **data:** RSC route app/[slug]/page.tsx (export const revalidate = 60, ISR). The default export PublicInvitationPage resolves the event via cache(fetchEventBySlug) using createAdminClient() (service-role; this page renders for anonymous visitors so it deliberately bypasses RLS) with .ilike('slug', slug). It selects the full STD/website column set including std_reveal_template, std_reveal_effects, std_invitation_launch_date, std_theme, std_background, std_media, std_film_*, role_palette, love_story, monogram_*. With no guest-session cookie it renders the PublicLanding component (line ~1278). The lifecycl
- **auth:** None for this sample event. landing_page_visibility on maria-and-jose is 'public' (verified live), so the private-mode gate at page.tsx ~line 499 (which would render <PrivateLanding> for non-guests on a 'private' event) is skipped entirely. The route requires only event_type==='wedding' (else notFound()) and a non-reserved slug. No Supabase auth session, no guest-session cookie, and no RLS check a
- **readonly:** Already public and already read-only for an unauthenticated visitor — trivially feasible; essentially zero build. The sample event meets every gate: is_sample=TRUE, landing_page_visibility='public', event_date=2026-12-12 (~175 days out, so getLifecyclePhase returns 'save_the_date'), role_palette + love_story populated, std_reveal_template NULL => inherits the live 'veil-sheer' house reveal. There is NO is_sample branch anywhere in app code (grep confirms is_sample exists only as a DB column/index in migration 20270203791173) — meaning the public route treats the sample exactly like any real we
- **stop:** YES — this is the natural opening stop of the 5-stop tour ('You're invited'). What it shows: the cinematic sheer-veil reveal lifting to uncover the self-playing Save-the-Date film recoloured to Maria & Jose's mood-board palette (monogram, names, 12.12.2026, the love-story teaser, add-to-calendar close). Client-only-interactive moment is built-in and perfect for the brief: tap left/right thirds to scrub between beats, press-and-hold to pause, all driven by local RAF state in save-the-date-film.tsx with zero persistence — nothing to gate or sandbox. Reuse vs rebuild: REUSE as-is — point the tour

### Budget
- **files:** /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/budget/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/lib/budget.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/_components/vendor-itemization-card.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/budget/_components/budget-allocation-planner.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/budget/_components/budget-setter.tsx, /Users/icecasasola/wt-public-surface/apps/web/lib/budget-allocation-data.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/layout.tsx, /Users/icecasasola/wt-public-surface/apps/web/lib/supabase/admin.ts
- **data:** RSC server component. BudgetPage (app/dashboard/[eventId]/budget/page.tsx) is an async Server Component. On render it: (1) getCurrentUser() then redirect('/login') if absent; (2) createClient() = authed (anon-key + user-session-cookie) Supabase server client; (3) a Promise.all of four reads: events SELECT (estimated_budget_centavos, region), fetchBudgetSnapshot(supabase, eventId) (lib/budget.ts), an orders SELECT (paid/fulfilled totals for Setnayan-Pay SKUs), and resolveAllocationInputs(supabase, eventId) (lib/budget-allocation-data.ts, median benchmarks for the suggested-split planner). Core 
- **auth:** Three stacked gates, all auth-bound. (1) Page: getCurrentUser() then redirect('/login'). (2) Layout (app/dashboard/[eventId]/layout.tsx) wraps every event route: requires an event_members row with member_type='couple' (or an accepted event_moderators row) else notFound(). (3) DB RLS (migration 20260513110000): event_vendor_line_items + event_vendor_payments are RLS-enabled with read/write policies
- **readonly:** Moderate effort, low risk if isolated. The blocker is structural: every budget read is gated on auth.uid() via current_couple_event_ids(), and the page hard-redirects to /login before rendering, so BudgetPage cannot be reused as-is for an anon visitor. SAFEST approach: build a SEPARATE public RSC route (e.g. /tour/budget under a /tour shell) that NEVER calls createClient()/getCurrentUser(). Read with createAdminClient() (service_role) but HARD-SCOPED to the sample event only: resolve the event by slug='maria-and-jose' AND is_sample=TRUE (column from migration 20270203791173), capture its event
- **stop:** YES — strong tour stop. Shows: the Budget summary strip (Target / Committed / Budget-left), the StatsStrip (Total budget / Paid so far / Still to pay / Due in 30 days), and the per-vendor itemization cards (line items from the vendor catalog + logged payments) using the sample event's 18 budget lines and demo vendors. Client-only-interactive moment: the Suggested budget split planner (BudgetAllocationPlanner) is ALREADY a pure client engine that re-runs on every slider tilt and never saves — ideal non-persisting interactivity; let the visitor drag per-category sliders and watch the split recom

### Couple website (public /[slug] 4-in-1) + day-of guest experience
- **files:** apps/web/app/[slug]/page.tsx, apps/web/app/[slug]/actions.ts, apps/web/app/[slug]/not-found.tsx, apps/web/app/[slug]/_components/save-the-date.tsx, apps/web/app/[slug]/_components/save-the-date-film.tsx, apps/web/app/[slug]/_components/reveal/reveal-overlay-server.tsx, apps/web/app/[slug]/_components/countdown.tsx, apps/web/app/[slug]/_components/schedule-widget.tsx
- **data:** RSC (server component) at apps/web/app/[slug]/page.tsx (3221 lines), `export const revalidate = 60`. It resolves the event by slug with `fetchEventBySlug` = a `cache()`'d `createAdminClient()` (SERVICE-ROLE, RLS-BYPASSING) read of `events` by `.ilike('slug', slug).maybeSingle()`. Gates: `notFound()` unless `event_type === 'wedding'`. Then it reads the guest-session cookie via `readGuestSession()` (lib/guest-session.ts) and branches into THREE render functions, all in the same file: `PublicLanding` (anonymous, line 1278), `InvitationSite` (cookie-bearing guest, line 1752), `PrivateLanding` (loc
- **auth:** NO LOGIN required for the public path — this is the one already-public surface for an event. `landing_page_visibility` (events column) drives it: 'public'/'unlisted' render identically (PublicLanding for anonymous); 'private' renders a `PrivateLanding` lock screen unless the viewer has (a) a guest-session cookie for THIS event or (b) is a signed-in host in event_members/event_moderators. Personali
- **readonly:** EASY / mostly already done — this surface is the closest to "ready for the tour" of any in the app, and it ALREADY renders the sample event with no login. Confirmed: the sample event is event_type='wedding', slug 'maria-and-jose', is_sample=TRUE, and the seed never sets landing_page_visibility (defaults to 'public'), so https://www.setnayan.com/maria-and-jose resolves through PublicLanding for an anonymous visitor today. Because event_date is 2026-12-12 (far future), getLifecyclePhase => 'save_the_date' and getDayOfPhase => 'inactive', so the page shows: the auto-playing Save-the-Date film + c
- **stop:** STRONG tour stop — this should be the 'their wedding website' / 'the day-of guest view' stops (likely 1-2 of the 5). WHAT IT SHOWS: the live public /[slug] for maria-and-jose — Save-the-Date film + countdown, mood-board-recolored hero/chrome, schedule, venue, and (if floor-plan published) the free 'Find your seat' name search. REUSE-VS-REBUILD: REUSE PublicLanding as-is for the website stop — it's already anonymous-safe and event_id-scoped; the only seed-side work is enriching the sample (hero photo, schedule blocks, love_story, publish floor plan) so the widgets aren't empty. The find-seat na

### Vendor chat (scripted fake reply) — couple↔demo-vendor thread on the public sample event
- **files:** /Users/icecasasola/wt-public-surface/apps/web/lib/chat.ts, /Users/icecasasola/wt-public-surface/apps/web/lib/chat-actions.ts, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/messages/[threadId]/page.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/dashboard/[eventId]/messages/actions.ts, /Users/icecasasola/wt-public-surface/apps/web/app/_components/chat-send-form.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/_components/chat-message-stream.tsx, /Users/icecasasola/wt-public-surface/apps/web/app/admin/demo-vendors/inquiries/actions.ts, /Users/icecasasola/wt-public-surface/apps/web/app/admin/demo-vendors/inquiries/[threadId]/page.tsx
- **data:** REAL flow (authenticated): The couple thread page is an RSC at app/dashboard/[eventId]/messages/[threadId]/page.tsx. It server-fetches via fetchThreadById() + fetchMessages() (lib/chat.ts) using the per-request RLS-scoped createClient() (lib/supabase/server.ts), SSR-renders the first message batch, then hands off to two client components: <ChatMessageStream> (app/_components/chat-message-stream.tsx) which subscribes to Supabase Realtime postgres_changes INSERT/UPDATE on chat_messages filtered by thread_id, and <ChatSendForm> (app/_components/chat-send-form.tsx) whose form `action` invokes the 
- **auth:** Hard gate — fully closed to anonymous visitors. The RSC redirects to /login when !user (page.tsx:27). chat_threads + chat_messages RLS (migration 20260513130000) grant SELECT/INSERT only `TO authenticated` with USING/WITH CHECK = `event_id IN (SELECT current_couple_event_ids()) OR vendor_profile_id IN (SELECT current_vendor_profile_ids())`. Those helpers (migration 20260513040000) resolve from aut
- **readonly:** Straightforward and safe IF built as a self-contained public route that NEVER queries chat_threads/chat_messages and NEVER calls sendChatMessage. Because anon RLS already returns zero chat rows, the only viable design is to NOT use the live chat data path and instead drive a faux thread entirely client-side. Two build options, safest first: (A) PURE STATIC SCRIPT (recommended) — hardcode a small scripted conversation (couple inquiry + a curated demo-vendor reply or two, attributed to one of the 38 is_demo vendors shortlisted on maria-and-jose) as a TS constant in the public tour route; no DB r
- **stop:** YES — strong tour stop. WHAT IT SHOWS: a real-feeling couple↔vendor thread on the maria-and-jose sample event — SSR message bubbles (reuse <ChatMessageStream>'s exact bubble markup/styling) showing the couple's booking inquiry and the demo vendor's warm reply, with the real demo-vendor business_name/logo as counterpartyLabel. CLIENT-ONLY-INTERACTIVE MOMENT: the visitor types into a clone of <ChatSendForm> and hits Send → instead of calling the sendChatMessage server action, an onSubmit handler appends their message to local React state (right-aligned 'You' bubble), then after a ~1.2s 'vendor i

