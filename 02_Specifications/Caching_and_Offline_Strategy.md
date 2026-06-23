# Caching & Offline Strategy

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas (or "still accurate"):
> - **Architecture is STILL ACCURATE as a target and partially SHIPPED.** `apps/web/package.json` carries `@tanstack/react-query`, `@tanstack/query-sync-storage-persister`, `@tanstack/react-query-persist-client`, and `sharp`; `apps/web/public/sw.js` exists (the PWA service worker the asset layer extends). The two-layer (TanStack data + service-worker asset) model, 100 MB budget, SWR/staleTime tiers, and "never cache auth/payment intents" rules are sound.
> - **Cross-cutting product corrections** (don't let stale references mislead): the planner SKU is **"Setnayan AI" ₱1,499** (not "Concierge ₱4,999"); commission is **0%**; the **customer token wallet (0003) is RETIRED**; **BIR receipts (0026) are retiring** — §4.2's "BIR receipts must never be cached" / §6's "BIR receipt metadata" tier are historical (the never-cache discipline is still fine, but BIR is no longer a live surface).
> - **Native offline (§8) is no longer pure Phase 2:** the native shell shipped as a **Capacitor remote-URL WebView loading hosted setnayan.com** (Android built, PR #1044) — it reuses this web cache stack rather than the Core-Data/Room architectures §8 anticipated. 0031 day-of guest experience (the offline-first consumer of this spec) ships as part of the live app.
> - Verify acceptance-criteria items (Lighthouse, LRU fill, ESLint `setnayan/no-raw-mutation`) against current CI before citing them as passing — they were Sprint-0 targets, not confirmed-green gates in this doc.
>
> When this body disagrees with the above, **the above wins.**

**Status:** Locked 2026-05-14
**Owner:** Platform / Sprint 0
**Applies to:** All web surfaces (customer dashboard 0021, vendor dashboard 0022, admin console 0023, marketing site 0015, day-of guest experience 0031). Native iOS/Android explicitly out of scope (Phase 2).

---

## 1. Goal

Fast perceived load and tappable-instantly UI on return visits, without consuming user device storage unbounded.

Two failure modes this spec is engineered to prevent:

1. **Cold start latency** — a returning user opening the app on Day 8 of their wedding planning shouldn't wait on a network roundtrip to see their guest list. They should see the last-known state in <100 ms, with a background revalidation.
2. **Unbounded storage bloat** — a user who has visited a year's worth of vendor portrait images, mood boards, and save-the-date previews shouldn't end up with 500 MB of Setnayan assets eating their device storage.

---

## 2. Storage Budget

**Hard ceiling: 100 MB total per user / per install.**

Gated by `navigator.storage.estimate()` at app startup:

```ts
const { quota, usage } = await navigator.storage.estimate();
const headroom = quota - usage;

const budget = headroom < 100 * 1024 * 1024
  ? Math.floor(headroom * 0.5)   // fallback: 50% of available
  : 100 * 1024 * 1024;            // standard: 100 MB
```

**Allocation inside the 100 MB:**

| Layer | Budget | Contents |
|---|---|---|
| Images | ~75 MB | Cover photos, vendor portraits, mood-board thumbnails, save-the-date previews, monograms |
| JSON / data | ~20 MB | Guest lists, vendor profiles, schedule, budget, mood board metadata |
| Headroom | ~5 MB | Buffer for spikes |

Splits are **soft** — whichever layer fills first triggers LRU eviction within that layer. We don't reserve the unused portion of one layer for another; that's deliberate, to keep eviction reasoning local.

---

## 3. Two-Layer Architecture

### 3.1 Data Layer — TanStack Query + IndexedDB

Library: `@tanstack/react-query` + `@tanstack/query-sync-storage-persister` + `persistQueryClient`.

```ts
const persister = createSyncStoragePersister({
  storage: indexedDBStorage,
  key: 'setnayan-query-cache',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7,   // 7-day hard ceiling
  buster: process.env.NEXT_PUBLIC_CACHE_BUSTER,  // bumped per schema change
});
```

Pattern: **stale-while-revalidate** with per-query TTL.

The `buster` key prevents the persisted blob from carrying stale schema across deploys — bump it in CI whenever a query response shape changes.

### 3.2 Asset Layer — Service Worker + CacheExpiration

File: `apps/web/public/sw.js` (extended from the existing PWA service worker).

Route-scoped caches with `CacheExpiration`:

```js
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'setnayan-images-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 30 * 24 * 60 * 60,  // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'setnayan-static-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,  // 7 days
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'setnayan-fonts-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60,  // 1 year (fonts are immutable)
      }),
    ],
  })
);
```

---

## 4. Cache Inclusion / Exclusion Rules

### 4.1 MUST be cached

- **App shell** — `/`, role-router entry points (`/dashboard/[event_id]/*`), nav chrome.
- **JS chunks** — all Next.js route bundles.
- **Fonts** — Cormorant Garamond, Manrope, DM Mono.
- **Public-read data:**
  - Events list (`events` rows the user is a member of)
  - Guest list (per event)
  - Vendor profiles (public marketplace surface + linked vendor profiles)
  - Mood board (palettes, theme manifests)
  - Schedule
  - Budget line items
  - Save-the-date assets (template previews, rendered output URLs)

### 4.2 MUST NEVER be cached

- **Auth tokens** — Supabase JWT, refresh tokens. Always live, always validated against Supabase Auth.
- **Supabase session object** — same reason.
- **Payment intents** — `service_orders` rows during the `pending_payment` state, BDO/GCash QR codes (these are per-order one-time artifacts).
- **BIR receipts** — Official Receipts per iteration 0026; legal documents, must always reflect current state.
- **Contract files** — vendor agreements, signed PDFs. Sensitive; thread-scoped storage per 0019.
- **API gateway responses bound to a per-request key** — when iteration 0033 ships public API endpoints with per-request nonces or signed payloads.
- **Live chat messages** — use Supabase Realtime, never the cache. Caching chat would break presence + typing indicators and create message-ordering bugs.

---

## 5. Cache Invalidation Discipline

**Every mutation MUST invalidate its query key.**

Enforced via a thin wrapper around `useMutation`:

```ts
// apps/web/src/lib/use-tracked-mutation.ts
export function useTrackedMutation<TData, TError, TVariables>(
  options: UseMutationOptions<TData, TError, TVariables> & {
    invalidates: QueryKey[];  // REQUIRED — TypeScript enforces this
  }
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    onSuccess: async (data, vars, ctx) => {
      await Promise.all(
        options.invalidates.map(key => queryClient.invalidateQueries({ queryKey: key }))
      );
      options.onSuccess?.(data, vars, ctx);
    },
  });
}
```

**Rule:** never use raw `useMutation` in feature code. ESLint rule `setnayan/no-raw-mutation` flags it. The wrapper makes invalidation impossible to forget.

---

## 6. Stale-Time Defaults

Per-query overridable, but the baseline:

| Tier | Examples | `staleTime` |
|---|---|---|
| **Hot lists** | Guest list on day-of (T-1hr to T+8hr per 0031), live schedule, paparazzi gallery during event | 60 s |
| **Warm data** | Vendor profiles, mood board, budget, seating chart, save-the-date previews | 5 min |
| **Cold / immutable** | BIR receipt metadata, finalized invitation themes, archived events, owned music tracks | 1 hr |

Override pattern:

```ts
useQuery({
  queryKey: ['guest-list', eventId],
  queryFn: () => fetchGuestList(eventId),
  staleTime: isWeddingDay ? 60 * 1000 : 5 * 60 * 1000,
});
```

---

## 7. Eviction Policy

**LRU within each layer.**

- **Asset layer:** evicts oldest images first (by `lastAccessedAt`). `purgeOnQuotaError: true` ensures the service worker recovers gracefully when the OS-level quota is hit.
- **Data layer:** evicts queries by `dataUpdatedAt` ascending. TanStack Query's `gcTime` (default 5 min after last subscriber) handles in-memory; the persister handles IndexedDB eviction when the persisted blob approaches `maxAge`.

**No cross-layer fallback.** If images hit 75 MB, we evict images — we don't borrow from the data layer's 20 MB. Keeps eviction reasoning local and predictable.

---

## 8. Out of Scope

The following are explicitly NOT covered by this strategy and ship through other paths:

- **Native iOS/Android offline** — Phase 2 / V1.5. Native apps will use their own cache architectures (Core Data on iOS, Room on Android) when they ship.
- **Photo gallery archive downloads** — handled by iteration 0009 (Photo Delivery) via direct R2 signed URLs + native share sheet. The 30-day post-download compression rule applies on the R2 side; the PWA cache never holds full-resolution originals.
- **Music catalogue files** — served from R2 with HTTP cache headers, played via `<audio>` streaming. Not cached in the service worker layer; the catalogue is too large (~400 tracks) and individual tracks are referenced infrequently per user.

---

## 9. Acceptance Criteria

For Sprint 0 platform stack validation:

1. **Cold visit** — first paint < 1.5 s on throttled 4G (Lighthouse mobile).
2. **Warm return** — return visit to dashboard renders cached guest list in < 100 ms before revalidation completes.
3. **Quota hit** — programmatically fill image cache to 75 MB, verify LRU evicts oldest images and new requests succeed.
4. **Schema buster** — bump `NEXT_PUBLIC_CACHE_BUSTER`, verify persisted query cache is wiped on next load.
5. **Mutation discipline** — ESLint rule `setnayan/no-raw-mutation` blocks merge if raw `useMutation` is used in feature code.
6. **Sensitive data audit** — automated test asserts that auth tokens, payment intents, BIR receipts, and contract URLs never appear in the IndexedDB blob or service worker caches.
7. **Day-of stress** — simulate 200-guest event opening guest list on day-of: hot-list 60s staleTime kicks in, network usage stays bounded.

---

## 10. Cross-Iteration References

This strategy is consumed by:

- **0013 Platform Stack & Sync Setup** — Section B (Claude Code Implementation Guide) references this doc for the PWA cache layer.
- **0021 Couple Dashboard** — all 9 surfaces follow the warm-data 5-min staleTime default.
- **0022 Vendor Dashboard** — same pattern.
- **0023 Admin Console** — admin queries follow the cold/immutable 1-hr staleTime for audit data; hot 60s for active payment reconciliation inbox.
- **0031 Day-of Guest Experience** — auto-flips hot-list staleTime to 60s during the T-1hr to T+8hr live window. Offline-first PWA shell relies on the asset layer.
- **0035 Observability** — cache hit/miss rates surface in PostHog as a custom metric (`cache_layer`, `cache_outcome`) without including any cached data content in logs.

---

## 11. Open Questions (Deferred)

None for V1. Native offline + photo archive caching deferred to Phase 2 by design.
