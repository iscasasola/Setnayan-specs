# Iteration 0037 — Event-Day Pre-load (couple + vendor)

**Iteration number:** 0037
**Topic:** Proactive event-day data + asset pre-load for offline-tolerant dashboards (couple-side T-3d → T+1d CTA + auto-prefetch T-24h → T+12h)
**Status:** ✅ Shipped via [PR #12](https://github.com/iscasasola/setnayan-platform/pull/12) (2026-05-14) · spec drafted retroactively 2026-05-16
**Display name in app:** *Prepare for event day* (couple-side banner CTA) · *Event day prep* (vendor-side card)
**Canonical ID prefix:** S37-

---

## Why this iteration exists

The owner's December 2026 wedding is the V1 launch's primary stress test, and venue WiFi during a Filipino wedding is unreliable — LTE drops to one bar in ballrooms, signal disappears in chapel basements, and venues with bridal-prep suites in concrete rooms routinely lose the dashboard mid-day. The day-of experience must therefore work **offline-first** on the data the couple, the planner, and the vendors need right then: guest list, seating chart, vendor contacts, schedule, budget rollups, mood-board palette, and recent thread messages.

Iteration 0010 (Caching & Offline Strategy) ships the **infrastructure** for cache-and-revalidate (TanStack Query + persistent cache via `idb-keyval` + service-worker asset cache). This iteration ships the **strategy on top**: a couple-side CTA that pre-loads the entire event bundle once the event is within 3 days, plus a silent auto-prefetch that fires inside the T-24h → T+12h window so the dashboard is fully hydrated even if the user never tapped the CTA. Vendors get the same affordance, scoped per chat-thread, so a vendor walking into a ballroom with three upcoming events still has the relevant guest names + the schedule + masked couple contact already cached.

The point is **proactive hydration, not opportunistic caching** — every screen the couple or vendor needs on event day has something to serve from cache the moment the network falters.

---

## What ships in V1 (PR #12)

### § 1 — Couple-side CTA: "Prepare for event day"

- **Location:** banner above the welcome strip on `apps/web/app/dashboard/[eventId]/page.tsx`.
- **Visibility:** rendered only when `T-3d ≤ today ≤ T+1d` (the 4-day window starting 3 days before the wedding date and closing 24 hours after).
- **Three phases:**
  1. **Idle** — copy *"Prepare for event day"* + sub-copy *"Pre-load every screen so the dashboard works on bad venue WiFi"* + primary button *"Pre-load now"*.
  2. **Loading** — button label switches to *"Pre-loading…"* with a spinner; copy unchanged. No abort affordance in V1 (the operation completes in ~5–15 seconds on a typical event).
  3. **Done** — copy switches to *"Ready for event day — works offline"* with a check icon; primary button hides. Banner remains rendered so the user can re-trigger if they suspect drift, via the *"Refresh"* secondary button.
- **Error state:** if `prepareForEventDay(eventId)` returns the error branch of its discriminated-union result, banner copy switches to *"Pre-load failed — tap to retry"* and the button reverts to *"Pre-load now"*. Underlying error logged to Sentry (per iteration 0035) and surfaced as a toast.
- **Pure RSC + server action.** The CTA is a Client Component that renders a server-action button; no client-side fetcher is bundled.

### § 2 — Silent auto-preload: T-24h → T+12h

- **Component:** `apps/web/app/_components/auto-preload-on-event-day.tsx` — Client Component mounted alongside the CTA, never rendered visibly.
- **Trigger window:** `T-24h ≤ now ≤ T+12h` (the 36-hour window starting 24 hours before the wedding date and closing 12 hours after).
- **Effect:** on mount, if `now` is inside the window AND `localStorage["setnayan:auto-preload:" + eventId]` is empty or older than 60 minutes, the component fires `prepareForEventDay(eventId)` silently. No UI change.
- **Deduplication:** the 60-minute window is enforced via `localStorage` — repeated dashboard opens within an hour are no-ops; opening the dashboard at minute 0 + minute 65 → fires twice (each cycle refreshes the bundle).
- **Why client-side dedupe:** the auto-preload runs on every dashboard mount; debouncing it server-side would either require a new "last preload timestamp" column on `events` (schema cost) or eat database round-trips for the read. `localStorage` is free, per-device, and the freshness contract ("hydrate cache within the last hour") is what the user observes — server-side dedupe would not improve it.

### § 3 — Vendor-side CTA: per-thread, per upcoming event

- **Location:** `apps/web/app/vendor-dashboard/page.tsx`. One CTA card rendered per upcoming chat thread where the linked event is in the T-3d → T+1d window. Server-side filter: threads where `event.wedding_date BETWEEN now() - INTERVAL '1 day' AND now() + INTERVAL '3 days'` and the vendor is a participant.
- **Scope of the pre-load:** narrower than the couple-side bundle — vendor only pre-loads (a) the last 50 messages of *that thread*, (b) the event's schedule, (c) masked couple contact (per iteration 0019 redaction rules). Vendor does NOT pre-load guests, seating, budget — those are couple-side surfaces.
- **Three phases:** same Idle / Loading / Done / Error model as § 1, copy adapted ("Pre-load for [Couple Names]'s event" → "Ready for event day — works offline").

### § 4 — What the pre-load bundle contains

Driven by `apps/web/lib/event-preload.ts` → `prefetchEventBundle(eventId)`. RLS-gated: the call from the server action reads only what the caller is authorized to see, so a non-participant calling this for someone else's event id returns an empty bundle, not an error.

**Couple-side bundle:**

| Group | Source | TanStack key |
|---|---|---|
| Guests | `event.guests` join | `['event', eventId, 'guests']` |
| Seat assignments | `event.seat_assignments` join | `['event', eventId, 'seatAssignments']` |
| Vendor list | `event.event_vendors` join + redacted contact | `['event', eventId, 'vendors']` |
| Schedule | `event.schedule_items` join | `['event', eventId, 'schedule']` |
| Budget rollups | `event.budget_lines` materialized aggregate | `['event', eventId, 'budget']` |
| Mood-board palette | `event.mood_boards` + per-board palette JSONB | `['event', eventId, 'palette']` |
| Recent messages | last 50 messages per `event_threads` where vendor participates | `['event', eventId, 'thread', threadId, 'messages']` |
| Asset URLs | vendor logos, monogram, palette swatch images | passed to service worker via `PRELOAD_ASSETS` |

**Vendor-side bundle:** subset — schedule, the specific thread's 50-message tail, masked couple contact. No guests / seating / budget / palette.

### § 5 — Service-worker asset warming

- **Channel:** `navigator.serviceWorker.controller.postMessage({ type: 'PRELOAD_ASSETS', urls: [...] })`.
- **Stub handler today:** `apps/web/public/sw.js` listens for `PRELOAD_ASSETS` and runs `await Promise.all(urls.map(u => fetch(u).then(r => cache.put(u, r))))` against the `setnayan-v1` cache.
- **V1.5+ handoff:** iteration 0010's Workbox-driven service worker will honor the same message shape, so the call site here does NOT change when 0010 lands.

### § 6 — UX guarantees (locked)

- **No new dependencies** — uses the TanStack Query + `idb-keyval` + service-worker stack from 0010, nothing new installed.
- **No new RLS / schema** — the operation is a server-action that orchestrates existing fetchers; no new tables, no new RLS policies.
- **No state shared across events** — each event's bundle is keyed by `eventId`, so a couple with two events (post-V1 multi-event) gets two independent bundles + two independent `localStorage` dedupe keys.
- **All client components under 200 lines** — the three new components (`event-day-prep-cta.tsx` · `auto-preload-on-event-day.tsx` · `vendor-event-day-prep-cta.tsx`) stay focused and readable.

---

## What's NOT in V1 (scope-cuts deliberately deferred)

- **Background sync after offline writes.** If the couple makes a guest-list edit while offline, the change persists to TanStack Query cache + is replayed on reconnect via iteration 0010's mutation queue — but there's no UI indicator showing "queued for sync" today. Deferred to V1.1.
- **Pre-load progress bar.** The Loading state shows a spinner, not a progress %. The bundle fetches in parallel and reports done atomically. Deferred to V1.1 if user feedback shows the 5–15 second wait feels uncertain.
- **Conflict resolution UI for offline writes.** If two devices edit the same guest row offline and reconnect with divergent values, last-write-wins per the standing pattern. A merge-UI is V1.5+ work.
- **Pre-load on other dashboard surfaces.** Today the CTA renders only on the event dashboard root + the vendor dashboard root. Sub-pages (guests, vendors, budget) do NOT have their own pre-load CTA — they rely on the dashboard root having warmed the cache. Per-page CTAs deferred to V1.1 if cache misses on sub-pages prove a real problem in production.
- **Multi-day events.** The T-3d → T+1d window assumes a one-day event. Multi-day Filipino weddings (prep day + ceremony day + reception day across 2-3 days) get a single window anchored to `wedding_date`; per-day re-pre-loads happen via the auto-prefetch when the user opens the dashboard each morning. A dedicated multi-day window is iteration 0011 Panood Daily Broadcast territory (per-day SKUs there already split the day model) — re-architect this iteration in V1.5+ if Panood per-day adoption proves multi-day is the dominant pattern.

---

## Files that ship this iteration (current `apps/web` paths)

| Path | Purpose |
|---|---|
| `apps/web/lib/event-preload.ts` | `server-only` module — `prefetchEventBundle(eventId)` packages everything under the canonical TanStack-Query keys. RLS gates the read. 268 lines. |
| `apps/web/app/_components/event-day-prep-actions.ts` | `'use server'` server actions: `prepareForEventDay(eventId)` (couple-side) + `prepareVendorEventDay({ eventId, threadId })` (vendor-side). Discriminated-union return type so the client surfaces retry-able errors. 66 lines. |
| `apps/web/app/_components/event-day-prep-cta.tsx` | Couple-side banner CTA. Visible T-3 / T+1. Three phases. 179 lines. |
| `apps/web/app/_components/auto-preload-on-event-day.tsx` | Silent Client Component. Auto-fires inside T-24h / T+12h. 60-min `localStorage` dedupe. 136 lines. |
| `apps/web/app/_components/vendor-event-day-prep-cta.tsx` | Vendor-side card. One per upcoming chat thread. 159 lines. |
| `apps/web/app/dashboard/[eventId]/page.tsx` | Renders the CTA + auto-preload component above the welcome strip. 4-line minimal edit. |
| `apps/web/app/vendor-dashboard/page.tsx` | Renders one CTA card per upcoming chat thread filtered server-side to T-3 / T+1. |
| `apps/web/public/sw.js` | `message` listener handles `PRELOAD_ASSETS` by `fetch + cache.put`-ing each URL into `setnayan-v1`. |

---

## Dependencies

- **Iteration 0010 (Caching & Offline Strategy)** — provides the TanStack Query persistence layer, `Providers` wrapper, `getQueryClient()`, `idb-keyval` persister, and the Workbox-driven service worker that this iteration's `PRELOAD_ASSETS` handler graduates into. 0010 shipped in PR #10 ahead of PR #12.
- **Iteration 0021 (Couple Dashboard, Fully-Purchased)** — provides the dashboard page chrome the banner renders inside.
- **Iteration 0022 (Vendor Dashboard)** — provides the vendor dashboard page chrome the per-thread cards render inside.
- **Iteration 0019 (Communications)** — provides the thread + 50-message-tail query the vendor-side bundle calls; the masked-contact redaction rule.
- **Iteration 0035 (Observability)** — Sentry receives `prepareForEventDay` errors; PostHog optionally captures pre-load-completed event.

---

## Acceptance criteria

Lifted from PR #12's test plan, retained here as the iteration's verifiable contract:

- [ ] Visual check: open `/dashboard/<event-with-date-T-2-days>` — CTA appears above the welcome strip, copy says *"Prepare for event day"*.
- [ ] Visual check: open `/dashboard/<event-with-date-T-30-days>` — CTA does NOT render.
- [ ] Click *"Pre-load now"* — button changes to *"Pre-loading…"* with a spinner.
- [ ] After action completes — copy changes to *"Ready for event day — works offline"* with a check icon; button hides.
- [ ] DevTools → Application → Cache Storage → `setnayan-v1` — vendor logo URLs from the bundle's `assetUrls` appear after pre-load.
- [ ] DevTools → Application → IndexedDB — TanStack query cache entries appear for `['event', <id>, 'guests']`, `['event', <id>, 'seatAssignments']`, etc.
- [ ] Reload the dashboard inside the same 60-minute window — auto-preload does NOT re-fire (check `localStorage["setnayan:auto-preload:<id>"]` timestamp unchanged).
- [ ] On vendor-dashboard with a thread tied to an upcoming event — one CTA card appears per upcoming thread; threads beyond T+1 day are filtered out server-side.
- [ ] `pnpm --filter @setnayan/web typecheck` — clean ✓.
- [ ] `pnpm --filter @setnayan/web lint` — clean ✓.

---

## Companion files

- `fixtures.json` — sample event + bundle payload (to be added when the iteration's test suite is built out — placeholder file).
- `tests.md` — acceptance criteria mirror of the list above (to be added).
- `0037_event_day_preload.docx` — `.docx` mirror (regenerate via pandoc once available — flagged as pending the way `CLAUDE.md` decision-log rows from 2026-05-16 flag pandoc).
