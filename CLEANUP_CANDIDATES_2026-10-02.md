# Cleanup candidates — 2026-10-02 (read-only finder; nothing has been changed)

Basis: DECISION_LOG 2026-10-02 "AFTER THE AUDIT FIXES: A CLEAN REMOVAL OF EVERY REPLACED SHELL" (code only; tables never dropped; every removal listed on the change tracker with what replaced it). Filters applied: "AUDIT FINDINGS NEVER RESURRECT WHAT WAS REMOVED" and "THE SIMPLIFICATIONS ARE A FILTER".
Source: `origin/main` @ 76c6ed108 (worktree wt-deadcode). Tool: **knip** (custom entry config: every app/** page/route/layout + middleware + all *.test.ts + tests/**; project = app, lib, components, types, models; `@/` alias resolved). Every hit was re-checked with `grep -w` over app, lib, components, tests, scripts, public, packages and root scripts (dynamic strings, tests, generated registries, baselines).
EXCLUDE list: union of files in all 18 open PRs + every branch with commits in the last 3 days + every local worktree branch + uncommitted worktree changes (~550 files). **No candidate below is in it** (candidates that ARE in it are listed as "skipped — touched by open work", never proposed).

Rule for every slice: a removal PR must also (a) delete the matching line in any guard baseline that names the file, (b) regenerate `lib/admin-map/admin-jobs.generated.ts` / `admin-routes.generated.ts` when an admin action/page goes (tests `admin-jobs-are-generated`, `admin-map-is-generated` fail otherwise), (c) add the changelog.d fragment + a tracker row "removed X — replaced by Y".

---

## SLICE A — zero-caller server actions, pure deletions (each export removed = 1 of the 1,225 server-action budget freed)

Proof method: knip lists the export as unused with tests counted as entries; then `grep -rnw <name>` over app/lib/components/tests/scripts/public/packages found only comments, its own definition, and the generated admin-jobs map. No `.bind`, no string dispatch, no namespace import.

| # | Path · export | Proof (zero hits besides) | Replaced by | Frees | Risk |
|---|---|---|---|---|---|
| A1 | `apps/web/app/(shell)/explore/actions.ts` · `addVenueDirectoryEntryToPlan` + type `AddVenueToPlanResult` + helper `venueDirectoryTypeToCategory` (lines ~342-496) | comment in lib/events.ts:811 only | the seeded "fake venue" directory listings were removed from Explore 2026-06-16 (commit f61c13c9d, "explore = live vendors only"); `saveVendorToPicks` (same file) is the surviving add path | 1 action, ~155 lines | low |
| A2 | `apps/web/app/admin/event-types/actions.ts` · `createEventType` `updateEventType` `setEventTypeEnabled` `retireEventType` `unretireEventType` (the other 5 exports in that file ARE used — keep them) | only `lib/admin-map/admin-jobs.generated.ts` (generated, regenerate) | `/admin/event-types` page is a redirect since 2026-07-03 ("fold /admin/event-types into the Studio"); the roster lives in Taxonomy Studio, Vocabularies > Event types (`createEventTypeVocab` etc. in admin/taxonomy/actions.ts) | 5 actions, ~90 lines | low (admin-only; regenerate admin map) |
| A3 | `apps/web/app/_components/negotiation-actions.ts` · `createChangeRequestFromChat` `counterChangeRequestFromChat` (~75 lines; rest of file used) | only `lib/the-change-marker-is-retired.test.ts`, which asserts exactly "nothing imports either" | council verdict 2026-07-24 (commit d3350b8e2): negotiation money cards collapsed to ONE Deal card; bundled amendment (`createAmendmentFromChat` etc.) is the superset | 2 actions | low — but that test must be updated in the same PR (it names both functions and reads the file); a change order stays live elsewhere (`vendor_change_orders` table — never touched) |
| A4 | `apps/web/app/dashboard/[eventId]/wizard-actions.ts` · `markTaskInFlight`, `listMoodboardSlots` | only docblock comments (wizard-actions.ts:31,736; lib/erasure/coverage.ts:51; lib/moodboard-slots.ts:66) | wizard render layer torn down 2026-06-13 (commit 4ded0dec4); mood-board slots now read through lib/moodboard-slots.ts | 2 actions | low-med (check lib/erasure/coverage.ts note names markTaskInFlight as a "meta_* passthrough" exposure — edit that comment) |
| A5 | `apps/web/app/dashboard/[eventId]/vendors/actions.ts` · `createVendor`, `updateManualVendor` | only comments (vendors/page.tsx:9, lib/wedding-plan-groups.ts:1010, lib/manual-venue-address.ts:93) | self-added suppliers rebuilt 2026-09-20 ("the service card"); `createManualVendor` + `attachManualVendorToCategory` (used internally by the modal wrapper at actions.ts:5457-5465) are the live path | 2 actions, ~150 lines | med (large recent churn in that file — rebase carefully) |

### A-unexport (keep the function, drop `export` — still frees the action slot because the file is "use server")
- `dashboard/(account)/profile/concierge/actions.ts` · `startConciergeTrial` (called only at :428 inside the same file)
- `dashboard/[eventId]/vendors/actions.ts` · `updateVendorStatus` (:5109), `createManualVendor` (:5457), `attachManualVendorToCategory` (:5465) — all internal-only callers
 → 4 actions freed, zero lines deleted, risk low.

### A-hold (zero callers but NOT recommended without the owner)
- `dashboard/(account)/profile/actions.ts` · `updateThemePreference` — "Deliberately dormant and documented" in tests/db/handles-have-gates.baseline.txt and app/_components/theme-provider.tsx:29 (light-lock decision 2026-06-04). A guard documents it as kept.
- `dashboard/(account)/create-event/actions.ts` · `notifyWhenWeddingTypeLaunches` — Coming-Soon email capture (table `couple_wedding_type_notify_signups`); created 2026-05-20, no caller, but I could not find the DECISION_LOG row that retired the UI — owner to confirm.
- `dashboard/[eventId]/orders/actions.ts` · `logPayment` — zero callers but rewritten 2026-10-01 (P5a money) and 2026-09-20; other files still cite it as "the customer's own I paid". Owner/controller to confirm it is superseded by the "Amount to pay" door.
- `dashboard/[eventId]/studio/papic/actions.ts` · `purchasePapicCameras` — referenced only by tests (the-banner-does-not-promise-an-email.test.ts list; papic-cameras.test.ts comments). Per-camera buy replaced by "Limited = the guest list" flow (2026-06-26) — confirm.
- Skipped — in files touched by open work: `admin/taxonomy/actions.ts` (setFolderEventTypes, deleteTaxonomyNode, moveTaxonomyNode, createEventTypeVocab — the prepared-jobs doc says no form renders them), `dashboard/[eventId]/invitation/actions.ts` (markGuestsInvitationSent), `dashboard/[eventId]/schedule/actions.ts` (reorderScheduleBlocks).

Slice A total: **12 actions deleted (A1-A5) + 4 un-exported = 16 server actions freed**, ~470 lines.

---

## SLICE B — files nothing imports (pure deletions; client-bundle bytes are already 0 because nothing imports them — this is source and lint/test noise, plus the action/route counts shown)

Proof method (per file): knip "unused file" with tests as entries; `grep -rnE "['\"/]<basename>(\.tsx?)?['\"]"` over apps/web, packages, scripts, supabase (non-migration), .github returns zero importers; no dynamic `import()` / string reference. Baseline rows that name a file must be deleted in the same PR (`tests/db/ugat-both-ends.baseline.txt` + `EXPECTED_BASELINE_ROWS`, `scripts/no-card.baseline.txt`).

| # | Files | Bytes | Replaced by / retiring evidence | Frees | Risk |
|---|---|---|---|---|---|
| B1 | `app/_components/OfflineSyncProvider.tsx` + `lib/indexedDB.ts` + `lib/mediaPipeline.ts` (a closed chain: the provider is the only importer of the other two) | 31 KB | V2 offline vault replaced by `lib/offline/{db,sync-daemon,types}.ts` + the flag `NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED`; provider unmounted since the Pabati→Papic retire 2026-08-23 (git: last touched by that commit). Baseline row `component-no-mount app/_components/OfflineSyncProvider.tsx` | 3 files | low |
| B2 | `lib/supplies/index.ts` `pricing.ts` `service-area.ts` `types.ts` | 10.6 KB | the Setnayan Supplies vertical was dropped by migration `20271234329420_drop_retired_token_wallet_supplies_vertical.sql`; DECISION_LOG 2026-08-07 "TOKEN RETIREMENT FINISHED" | 4 files | low |
| B3 | `lib/calligraphy.ts` (restroke engine, 8 KB) · `lib/event-initials.ts` · `lib/use-escape-key.ts` · `lib/use-tracked-mutation.ts` | 11.8 KB | calligraphy: Cipher Studio / Monogram Studio vector redesign (DECISION_LOG 2026-06-12, 2026-06-19) is the live monogram path; event-initials: plaque-as-menu rails (2026-07-16) no longer build the chip; the two hooks have zero users (no test either) | 4 files | low (calligraphy: owner may want the engine kept as a design asset — say so) |
| B4 | `app/_components/thread-call-launcher-lazy.tsx` · `app/papic/_papic-motion.tsx` (+ their rows in `scripts/no-card.baseline.txt`; the first also in ugat-both-ends baseline) | 5.4 KB | the call launcher is mounted directly, not lazily; `/papic` now mounts `DoorwayPage` + shared `_pa-motion.tsx` (its own docblock says the bold moment is "the only thing left" and nothing imports it) | 2 files | low |
| B5 | `app/vendor-dashboard/verify/actions.ts` — **whole file: `ensureDraftApplication` `updateDocUpload` `submitApplication` `withdrawApplication`** | 19 KB | the old verify page was retired to the papers screen 2026-09-11 (commit "retire the old verify page to the papers screen"); `/vendor-dashboard/verify` is now a redirect stub with no importer of this file | **4 server actions** | med — three guard tests READ this file by path (`lib/verification-upload-gate-normalises-like-the-database.test.ts`, `lib/vendor-verification-state.test.ts:289`, `lib/vendor-identity-retention-core.ts:170` comment, `app/papic/the-meter-is-the-only-door.test.ts` reads a DIFFERENT actions.ts — leave); re-anchor or delete those assertions in the same PR. Confirm the papers screen has its own upload gate first. DB tables untouched. |
| B6 | the dead Maya / manual-QR checkout chain: `components/billing/ManualCheckoutModal.tsx` (19 KB, baseline row money tier) + **route `app/api/v1/billing/initialize-maya/route.ts`** (20 KB) + `lib/maya-catalog-line.ts` + `lib/maya-catalog-line.test.ts` + the `initializeMaya` builder in `lib/routes.ts:225` | 43 KB | nothing fetches the route (only the unused `routes.ts` builder names it) and nothing renders the modal; payments are now the receiving-accounts page (DECISION_LOG 2026-10-02 "STAY WITH TWO RECEIVING ACCOUNTS (GCASH + BDO)"), apply-then-pay | **1 route**, 4 files | med — a payments file: controller confirm. Tables `manual_payment_logs`, `platform_retail_catalog_v2` untouched. |

### B-hold — unused by the tool but NOT dead (do not remove)
- `lib/package-credit-contracts.guard.ts` — type-level "make the bug not compile" guard (commit 2026-07-27); unused by import by design.
- `lib/slot-seat-reservations-flag.ts`, `lib/vendor-free-tier-booking-cap-flag.ts`, `lib/vendor-launch-free-window-flag.ts` — explicitly allow-listed in `lib/gates-have-handles.test.ts:340-342` as "owner-parked / built ahead of its consumer".
- `lib/stewarded-accounts.ts` — Phase-3 stewardship INERT scaffolding, counsel-first (2026-07-05).
- `lib/route-meta.ts` — touched by open work (EXCLUDE).
Slice B total: **19 files + 1 route + 4 server actions**, ~121 KB source.

---

## SLICE C — redirect-only stubs (each = 1 Vercel route). OWNER-RISK SLICE: the repo's own docblock (`/dashboard/year`) states the rule — a redirect, not a delete, "because of other people's links" (digest emails, bookmarks, DB-stored notification `relatedUrl`s). Nothing IN CODE links to these; I cannot see already-sent emails or stored rows.

C1 — zero in-app link (non-comment, non-test) + retired ≥ 3 months, redirect target exists. Ordered safest first:
| Route (file) | Retired | Redirects to | Note |
|---|---|---|---|
| `/dashboard/[eventId]/for-you` | 2026-06-04 | /vendors | its own docblock: "effectively orphaned" |
| `/dashboard/[eventId]/design` | 2026-06-17 | /studio | |
| `/dashboard/[eventId]/today` | 2026-06-03 | /dashboard/[id] | its docblock says V1 "Setnayan AI active" emails carried it — emails are > 4 months old |
| `/dashboard/[eventId]/studio/animated-monogram` | 2026-06-25 | /monogram | `lib/routes.ts` helper still builds it — check the helper is unused first |
| `/dashboard/[eventId]/website/launch` | 2026-07-25 | /website/editor | guard `one-event-hub-door.test.ts:110` names it as retired |
| `/dashboard/[eventId]/website/what-to-bring` | (folded into editor) | /website/editor?open=what-to-bring | **only the page.tsx** — `actions.ts` beside it is still used by tests/pins |
| `/admin/refinements` | 2026-07-03 | /admin/taxonomy | admin-only |
| `/admin/marketing` | 2026-07-04 | /admin/studio | admin-only |
| `/vendor-dashboard/funnel` | 2026-07-02 | /performance | `lib/vendor-more-rows.ts:131` lists the URL in a prefix array — remove entry |
| `/vendor-dashboard/tax-documents` | 2026-05-29 | /vendor-dashboard | `vendor-bottom-nav.tsx:155` lists it in a matchPrefix array — remove entry |
| `/explore/categories` | 2026-08-15 (sitemap-era) | /explore | `lib/seo/health-checks.ts:110` lists it — remove; Google may still hold the URL (sitemap) — 301 value |
→ **11 routes**.

C2 — redirect stubs that still appear in nav registries / admin menus (`admin-nav-groups.tsx`, `lib/nav-registry-defaults.ts`, `admin-bottom-nav.tsx`, DB `nav_slot_override`): `/admin/{queues,brain,wedding-traditions,connection-logs,offline,operations-hiring,compliance,notifications,seo,insights,npc-readiness,referrals,patiktok,custom-plans,addons}` and `/vendor-dashboard/{payment-options,branches}`. Each has a `matchPrefix`/registry row pointing at the OLD URL, so removal = also editing the registry (and `nav_slot_override` data). Several of the redirect targets' own code imports `actions`/components from the old dir (e.g. `/admin/compliance/_components/*`, `/admin/npc-readiness/actions.ts`) — only `page.tsx` goes, never the dir. Not proposed until C1 is done and the owner decides whether the admin console's old URLs matter. (17 routes.)

C3 — keep (docblock gives a live reason): `/dashboard/[eventId]/website/editorial` (admin editorial-review notification `relatedUrl`s stored in DB), `/dashboard/year` (daily digest email CTA), `/site-editor/**` (route builders still call them — 28-44 refs).

---

## SLICE D — pages/route handlers with no inbound path

Method: for all 602 `page.tsx|route.ts`, tail-path search (static run after the last dynamic segment) over apps/web + packages + scripts + .github, non-comment lines only, excluding the route's own dir, tests, baselines, generated registries and `lib/routes.ts`. 40 routes have zero hits; after hand-review:

| # | Route | Why it is dead | Replaced by | Frees | Risk |
|---|---|---|---|---|---|
| D1 | `/join/[eventId]/check-email` (page 4.9 KB + its test + `doors-are-designed.test.ts:115` entry + port-control baseline row) | the last redirect to it was removed by commit "one path for an invited guest — form then sign-up, or sign-up then form" (2026-09-26); grep for `check-email` finds only its own files | one-path invited-guest flow (`/join/[eventId]` → set-password/success) | 1 route | low-med (email-link entry? it is "we emailed you a sign-in link" — no email template links to it) |
| D2 | `/prototype/mesh-call` page + `_components/mesh-room.tsx` + `lib/mesh-call-webrtc.ts` (only importer is the prototype and `lib/encoder/audio-mixer.ts`, itself unused outside tests) | self-described "prototype route, not a product surface" (2026-07-14); nothing links | in-thread calls use `ThreadCallLauncher` | 1 route, 3 files, 16 KB | low |
| D3 | `/api/v1/manpower/sync-device` (13 KB) | zero callers; its own docblock says the token-reward consumer was deleted 2026-08-07; the crew device pairing that is wired is `/api/crew/register-device` | `/api/crew/register-device` + `event-qr` page | 1 route | med (crew pairing — verify no field app calls it; table `registered_crew_devices` untouched) |
| D4 | B6's `/api/v1/billing/initialize-maya` | see B6 | | 1 route | med |

### D-hold — zero hits but reachable by design (do NOT remove)
`/papic/lightcheck` (operator probe, typed URL) · `/privacy/google-access` (Google OAuth consent screen link) · `/dashboard/(.)create-event` (intercepting route — real) · `/dev/{home-lab,schedule-lab,booth-lab,hero-lab,details-lab}` (5 drive harnesses, 404 in prod but each is still a route in the count — see note) · `/dashboard/[eventId]/studio/{playlist,thank-you,editorial-pro}` (reached through the add-ons catalog's slug-built links) · `/onboarding/simple` (current setup engine) · `/api/cron/*`, `/api/admin/cron/*`, `/api/webhooks/{persona,veriff}`, `/api/live-studio/encoder/*`, `/api/telemetry/auto-resolve`, `/api/v1/reviews` (external cron/webhook/CLI/native entry points; `app/api/CONSUMER_INVENTORY.md` + `public-api-flag.ts` lock "plumb the gateway only") · `/api/vendor/chat/[threadId]/compose-options` (native-app bearer API) · `/dashboard/clusters` + `[clusterId]` (7c shipped 2026-09-02 as "the year gets a screen"; I found NO row retiring it, yet nothing links to it — **owner: unlinked-by-accident or retired?** 2 routes, 19 KB) · `/panood/demo/[token]` (QR target).
Note on dev labs: if the Vercel route cap is the pressure, the 5 `/dev/*` pages are the cheapest 5 routes to remove from the production build (e.g. move behind `pageExtensions` or delete once the owner has no drive left) — owner call.

Slice C1 (11) + D1 + D2 + D3 + D4 (+ B6 counted once) = **15 routes** freeable with proof; C2 would add 17; clusters 2; dev labs 5.
