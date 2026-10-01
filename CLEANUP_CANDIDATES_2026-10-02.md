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

---

## SLICE E — unused lib/component exports (bytes + noise only; frees no routes and no server actions — the server-action cases are in Slice A)

Method: knip, tests counted as entries (so an export used only by a test is NOT here). Of 1,366 unused export names (625 files), **1,094 are used inside their own file** (drop the `export` keyword only — zero behaviour change, no byte change; skipped, regenerate with `npx knip --fix` if wanted) and **272 are not referenced even in their own file**; 127 of those names sit in EXCLUDE files and are dropped here, leaving **256 genuinely dead exports in 146 files** (none in EXCLUDE). A second pass searched every dead name as a whole word across app/lib/components/scripts/packages (non-comment lines, other files):
- **E1 — 144 names with zero textual hit anywhere** → delete the declaration. Risk low. Several clusters are whole retired features (wizard — retired 2026-06-13; Concierge pricing — scrubbed 2026-05-28; token-era `vendor-tier-caps`; planner step resolver). List below.
- **E2 — 112 names with some textual hit elsewhere** (a same-named local, a type, a comment-as-code string, or a re-export barrel such as `app/_components/plan3d/kit/index.ts` — 12 names). Needs a human glance per name; list shortened to files.

### E1 (delete)

- `app/[slug]/_components/editorial/living-moments.tsx`: LivingMoments
- `app/[slug]/_components/reveal/veil-shared.ts`: makeVeilMaterial
- `app/_components/event-monogram.tsx`: EmptyEventMonogram
- `app/_components/plan3d/kit/blocky-parts.ts`: RIG_PART_KEYS
- `app/_components/theme-provider.tsx`: THEME_MODES, isThemeMode
- `app/_components/verification/verification-status-card.tsx`: VerificationStatusCard
- `app/dashboard/(account)/create-event/_components/event-types.ts`: EVENT_TYPE_PHOTO_FALLBACK
- `lib/account-face-profile.ts`: refineAccountProfileFromConfirmedTag
- `lib/add-on-state.ts`: isEventExpired
- `lib/api-keys.ts`: maskKey
- `lib/background-videos.ts`: fetchPublishedBackgroundVideos
- `lib/bespoke-monogram-shared.ts`: MAX_BESPOKE_ROUNDS_PER_EVENT, CANDIDATES_PER_ROUND
- `lib/booking-fee.ts`: BOOKING_FEE_TAIL_RATE, BOOKING_FEE_TIER1_LIMIT_PHP
- `lib/booth-poster.ts`: POSTER_MOBILE_W, POSTER_MOBILE_H
- `lib/build-3state.ts`: isBuildState
- `lib/checklist-state.ts`: CATEGORY_STATE_PROMPTS
- `lib/closed-shop-slug.ts`: closedEventSlugHeldUntil
- `lib/colour-access.ts`: domainLabelOf
- `lib/concierge.ts`: CONCIERGE_PRICE_CENTAVOS, CONCIERGE_PRICE_PHP, CONCIERGE_STATUS_LABEL, CONCIERGE_STATUS_TONE
- `lib/cookie-consent.ts`: hasDecidedConsent
- `lib/coverage-allowed-events.ts`: isRestricted
- `lib/creator-offers.ts`: fetchActiveCreatorCollabs
- `lib/dangling-trade-keys.ts`: reportedHolders
- `lib/demo-mode.ts`: isDemoModeFromRequest
- `lib/dependency-graph.ts`: MUTUAL_PAIRS
- `lib/details-bound.ts`: isDetailsFact
- `lib/element-style.ts`: HUB_ELEMENT_MIN_CONTRAST (es)
- `lib/email-verification.ts`: postSignupMessage
- `lib/event-hero.ts`: HERO_ALSO_ON, HERO_STARTS
- `lib/event-moderators.ts`: ROLE_SUBTYPE_HINT, isCurrentEventHost
- `lib/event-noun.ts`: eventNounCap
- `lib/event-poster.ts`: WHITE_TYPE_MIN_CONTRAST, whiteContrastOn
- `lib/face-embed-core.ts`: FACE_EMBED_INPUT_SIZE
- `lib/feel-palettes.ts`: seedPaletteFromFeel
- `lib/fraud-detection-runner.ts`: maybeRunNightlyFraudScoring
- `lib/fraud-enforcement.ts`: FRAUD_ENFORCEMENT_ACTIONS
- `lib/gate-writers.ts`: isMentioned
- `lib/geo.ts`: googleMapsSearchUrl
- `lib/guest-journey.ts`: buildGuestJourney, activeJourneyKey, isGuestJourneyPath
- `lib/guest-side-question.ts`: SIDELESS_GROUP_CATEGORY
- `lib/hiring-guide/emails.ts`: sendHiringWeeklyDigestEmail
- `lib/indoor-blueprint.ts`: wayfindingDefaultGrid
- `lib/integration-config.ts`: getSecretPresenceMap
- `lib/loader-config.ts`: LOADER_VARIANTS
- `lib/logo-layers.ts`: penTime, logoTimeline
- `lib/maker-media-limits.ts`: readCoupleMediaBytes
- `lib/match-criteria.ts`: ALLOWED_REGIONS
- `lib/monogram-studio-shared.ts`: STUDIO_INKS
- `lib/monogram.ts`: compositeMonogram
- `lib/moodboard-finalization.ts`: FINALIZABLE_PARTS
- `lib/moodboard-slots.ts`: MOODBOARD_MAX_PHOTOS_PER_SLOT
- `lib/oauth-token-vault.ts`: sealTokenOrNull
- `lib/onboarding/solemn-content.ts`: baseAxesFor
- `lib/papic-challenge-sql.ts`: CHALLENGE_SEED_MIGRATION
- `lib/papic-one.ts`: papicOnePointsForSku, fetchPapicOneDedicatedPoints
- `lib/papic-pass-tiers.ts`: isPapicPassSku
- `lib/payment-channels.ts`: usesAccountList
- `lib/payment-destination.ts`: describeDestinationChange, ACCOUNT_RAIL_CONTROLS
- `lib/people-roster.ts`: EMPTY_ROSTER
- `lib/person-life-stories.ts`: MEDIA_STORY_ORIGINS
- `lib/planner.ts`: fetchManualStepCompletions, resolveStepStatuses, plannerProgress
- `lib/post-event-styles.ts`: SUPPLIERS_LABEL
- `lib/print-pieces.ts`: EMPTY_PRINT_DETAILS
- `lib/provisional-approval.ts`: REVIEW_TZ_OFFSET
- `lib/ranking-lenses.ts`: lensWeights
- `lib/real-weddings.ts`: relatedRealWeddings, eventTypesInUse, weddingCeremonyTypesInUse, weddingCitiesInUse
- `lib/region-source.ts`: regionByPsgc, regionDescriptor, regionCentroid, regionBurnBand
- `lib/reveal-stages.ts`: revealStagesSentence
- `lib/role-group-dress-code.ts`: groupRoleCount
- `lib/role-names.ts`: hasRoleNames
- `lib/roster-arrangement.ts`: arrangeLabel, serializeGrouping
- `lib/rsvp-ask.ts`: rsvpAskConfigFits
- `lib/rsvp-stage.ts`: isRsvpStageScene
- `lib/scene-templates.ts`: sceneTemplateNeedsMedia
- `lib/schedule-rail.ts`: pxToMinutes
- `lib/security/kwento-moderation-authz.ts`: KWENTO_MODERATOR_MEMBER_TYPES
- `lib/service-card-record.ts`: fetchServiceCardRecord
- `lib/side-colors.ts`: SIDE_RING, SIDE_CHIP_SOFT, SIDE_CHIP
- `lib/sku-catalog.ts`: RETIRED_SKU_CODES, BIR_MARKETPLACE_WITHHOLDING_PCT
- `lib/spotlight-awards.ts`: fetchHomepageSpotlight
- `lib/stories-templates.ts`: STORIES_ASPECT
- `lib/taxonomy.ts`: MEGA_MENU_COLUMN_LABEL
- `lib/theme-text-intent-model.ts`: clearThemeIntentModelCache, themeIntentModelCacheSize
- `lib/turnstile.ts`: turnstileConfigured
- `lib/two-admin-promise.ts`: compNeedsTwoAdmins
- `lib/vendor-category-taxonomy.ts`: isExemptVendorCategory
- `lib/vendor-counts.ts`: findTopVendorsByTile
- `lib/vendor-day-of.ts`: servicesMatchConsoleKind, DAY_OF_CONSOLE_META
- `lib/vendor-dayof-flags.ts`: isVendorGuestDeliveryEnabled
- `lib/vendor-dayof-modules.ts`: getModule
- `lib/vendor-event-fee-access.server.ts`: resolveEventFeeGates
- `lib/vendor-invites.ts`: INVITE_PILL_COPY, INVITE_PILL_TONE, pillVariantFor, daysLeftFor
- `lib/vendor-microsite.ts`: youTubeThumb
- `lib/vendor-tier-caps.ts`: canAcceptInAppInquiries, vendorWhitelistPerDate, canUseWaitlist
- `lib/vendors-plan-budget.ts`: formatPesoPrecise
- `lib/venue-recommendations.ts`: PAIRED_VENUE_CONFIG, isCombinedVenue, formatVenueDayRate, formatVenueCapacity
- `lib/vouchers/calculate.ts`: formatCentavosPeso
- `lib/wedding-essentials.ts`: getWeddingEssential, isEssentialPlanGroup
- `lib/wedding-roadmap.ts`: countRoadmapDone, ROADMAP_TOTAL, ROADMAP_ITEM_KEYS
- `lib/wizard-recommendations.ts`: VENDOR_PICK_TASK_CANONICAL_SERVICES, fetchBookedMarketplaceVendorIdsForDate
- `lib/wizard.ts`: getFirstUnmetPrereq, listInFlightTaskIds, countCompletedTasks

### E2 (check each)

- `app/[slug]/_components/reveal/veil-shared.ts`: markUrl
- `app/[slug]/_components/story/spine-data.ts`: minutesForDay
- `app/[slug]/print/keepsake-layout.ts`: editionVolume, toRoman, fmtCount
- `app/_components/frontdoor/command-data.ts`: EVENT_TYPE_BADGE, EVENT_TYPE_TERMS
- `app/_components/frontdoor/rail-data.ts`: RAIL_TOOLS
- `app/_components/plan3d/kit/emotes.tsx`: EMOTE_STANDING_Y
- `app/_components/plan3d/kit/figure.tsx`: WalkingFigure
- `app/_components/plan3d/kit/index.ts`: resolveFigureLook, standPose, walkCyclePose, runCyclePose, jellySquash, sitPose, idleSway, staffIdle, STAFF_IDLE_KINDS, overlayPose, damp, JOINTS, SKIN_TONES, HAIR_COLORS, HAIR_STYLE_COUNT, FACE_VARIANT_COUNT, outfitMaterial, BoothChassis, CHASSIS_SPECS, BoothProp, BoothTextSign, BOOTH_TEMPLATES, BOOTH_TEMPLATE_KEYS, boothTemplateFor, boothChassisSpec, boothHitVolume, GENERIC_BOOTH_HIT, templateBoothObstacles, coldSparkFrame, coldSparkObstacles, coldSparkPathNodes, coldSparkProgress, coldSparkIntensity, COLD_SPARK_LENGTH_M, COLD_SPARK_CLIMAX_T, EMOTE_STANDING_Y, ActiveChair, useSitController, stringLightStrandCount, stringLightBulbColor, buildSitBakedLocals, instanceColorFor, SIT_PART_KEYS
- `app/vendor-dashboard/bookings/surface.tsx`: metadata
- `app/vendor-dashboard/calendar/surface.tsx`: metadata
- `app/vendor-dashboard/clients/surface.tsx`: metadata
- `app/vendor-dashboard/contracts/surface.tsx`: metadata
- `app/vendor-dashboard/earnings/surface.tsx`: metadata
- `app/vendor-dashboard/messages/surface.tsx`: metadata
- `app/vendor-dashboard/payday/surface.tsx`: metadata
- `app/vendor-dashboard/payment-options/surface.tsx`: metadata
- `app/vendor-dashboard/proposals/surface.tsx`: metadata
- `lib/anniversary-emails.ts`: ANNIVERSARY_SUPPORT_EMAIL
- `lib/color-vocabulary.generated.ts`: SETNAYAN_PALETTES, SETNAYAN_ANCHORS
- `lib/creator-public.ts`: fetchPublishedChapters
- `lib/creator-teaser.ts`: TEASER_FOOTER, TEASER_PALETTE
- `lib/event-accepts-captures.ts`: EVENT_PUT_AWAY_CAPTURE_COPY
- `lib/event-moderators.ts`: HOST_ROLES_BY_EVENT_TYPE, hostRolesForEventType
- `lib/event-preload.ts`: eventBundleQueryKeys
- `lib/event-viewer.server.ts`: viewerAreaLevel
- `lib/export-completeness.ts`: exportedTables
- `lib/ghost-listing-detector.ts`: GHOST_LISTING_REASON_LABEL
- `lib/guest-claim.ts`: CONFIDENT_MATCH, UNAMBIGUOUS_MARGIN, MAX_NAME_LENGTH, normalizeName, nameSimilarity, classifyClaimMatch
- `lib/integrations/registry.ts`: projectNumberFromClientId
- `lib/live-studio-readiness-server.ts`: resolveLiveStudioReadiness
- `lib/monogram-studio-fonts.ts`: STUDIO_FONTS, studioFontUrl
- `lib/monogram-studio-shared.ts`: STUDIO_FONTS, studioFontUrl
- `lib/moodboard-gallery-upload.ts`: HIT_SEVERITY, blockingHits, flaggedHits, parseScreenFindings, rejectionSentence
- `lib/package-choice-tree.ts`: EMPTY_SELECTION
- `lib/papic-limited.ts`: PAPIC_CAMERAS_ORDER_KEY
- `lib/patiktok-tiktok.ts`: publishPatiktokCompilation
- `lib/patiktok.ts`: categoryLabel
- `lib/periodic-jobs.ts`: PERIODIC_JOBS, PERIODIC_JOB_KEYS, RETENTION_JOB_KEYS
- `lib/plausibility-scanner.ts`: PLAUSIBILITY_REASON_LABEL
- `lib/qr-monogram-raster.ts`: compositeMonogramOntoQrPng
- `lib/review-fraud-screener.ts`: REVIEW_FRAUD_REASON_LABEL
- `lib/save-the-date-emails.ts`: fanOutInvitationEmails
- `lib/seating-3d.ts`: effectiveCapacity
- `lib/site-search.ts`: READ_SOURCE_NOUNS
- `lib/story-sheet.ts`: sheetAspect
- `lib/studio-rail.ts`: RAIL_TOOLS
- `lib/thank-you-video.ts`: THANK_YOU_FOOTER, THANK_YOU_MIN_PHOTOS, THANK_YOU_PALETTE
- `lib/type-in-place.ts`: isHubTypePart
- `lib/vendor-microsite.ts`: youTubeEmbedUrl

Special cases inside E: the nine `app/vendor-dashboard/*/surface.tsx` files each export an unused `metadata` (Next ignores metadata outside page/layout — safe, one line each). `lib/color-vocabulary.generated.ts` and `lib/papic-challenge-sql.ts` are generated — fix the generator, not the file. Test-only exports (used by a test but no production code) were deliberately NOT listed: ~1,700 more names; leave them, the tests pin behaviour.

---

## SLICE F — libs that only their own test imports (built + tested, never mounted)

Knip with tests ignored lists 53 more files whose only importer is a `*.test.ts`. 32 of them are **test infrastructure** (guards and scanners — `lib/security/*`, `lib/ugat/*`, `*-scan.ts`, `raw-number-scan`, `retired-names-scan`, `rsc-function-props`, `lingering-transform`, `probe-logging-rule`, `visibility-caller-rule`, `render-settled.test-helper`, `seating-golden-room.fixture`, `export-completeness`, `dangling-trade-keys`, `taxonomy-merge-holders`, `subprocessors`, `color-vocabulary.generated`, `papic-challenge-sql`) — KEEP, they are the guards. The rest are **features that were built and tested but nothing mounts them** — this is "unfinished or parked", not provably retired, so under the 2026-10-02 never-resurrect and simplification rules they go to the owner as a yes/no, never auto-removed:
`lib/dependent-moments.ts` (2026-07-31) · `lib/faith-rites.ts` (07-12) · `lib/life-story-summary-line.ts` (09-27) · `lib/merkado-build-options.ts` (07-10) · `lib/papic-pool-learning.ts` (09-22) · `lib/papic-pool-sizing.ts` (09-23) — both RECENT, likely in-flight · `lib/paid-placement-disclosure.ts` (09-22, backs a guard promise) · `lib/rsvp-projection.ts` (09-21) · `lib/self-comp-authority.ts` · `lib/self-purchase.ts` (self-purchase confirm, token era? — unverified) · `lib/setnayan-ai-pricing.ts` (07-02) · `lib/slot-seat-reservations.ts` + `-flag.ts` (parked, allow-listed) · `lib/vendor-free-tier-booking-cap.ts`, `lib/vendor-launch-free-window.ts` + `-flag.ts` (parked, allow-listed) · `lib/vendor-profile-tips.ts` (07-01) · `lib/wedding-essentials.ts` (08-27, "7-card free DIY surface") · `lib/render/recap-ffmpeg.ts` + `recap-select.ts` ("Group B prototype · Oracle Always-Free", 2026-06-28) · `lib/bespoke-monogram-engine.ts` · `lib/hub-fonts-most-used.ts` · `lib/encoder/{audio-mixer,audio-tap.worklet,backpressure-ring}.ts` + `lib/live-studio-encoder-bitrate.ts` (encoder S-series — ACTIVE build, do not touch) · `lib/recraft.ts` (used by scripts + secrets registry — keep).
Strongest by age + prototype self-label: `lib/render/recap-*.ts` (2 files + 2 tests), `lib/wedding-essentials.ts`. Not proposed — owner decision.

## SLICE G — retired features: what the code search found

Searched the retirement rows named in the brief:
- **Token wallet, token balance, Pabati** — 0 hits in app/lib/components outside tests: already cleaned (token retirement 2026-08-07; Pabati→Papic 2026-08-23). Residue is only B1 (`OfflineSyncProvider`, the Pabati-era offline mount) and B2 (`lib/supplies`) above, and the payment chain B6.
- **Old monogram templates** — no `MONOGRAM_TEMPLATES` / `monogram_template` in code; the only leftover is `lib/calligraphy.ts` (B3).
- **"Your year"** — the page is a redirect stub (`/dashboard/year`, keep: digest email CTA). **Clusters** (`/dashboard/clusters`, `[clusterId]`, 19 KB, 2 routes) — shipped 2026-09-02 as Item 7 and NOT retired by any row I found, but nothing links to it (no nav entry, no card). It may be a build waiting for its door rather than a shell. Owner: wire it or retire it.
- **Padlocks → diamonds, Pakulay** — remaining hits are visible COPY, not dead code (`Pakulay mood board` strings in `app/page.tsx`, `app/features/page.tsx`, `app/tl/features/page.tsx`, `lib/help.ts`; `Lock` icons are real lock affordances in admin). `lib/retired-names-scan.ts` lists the retired names (Pakanta, Samahan, Alaala, Alaga, Panood, Kwento) as renames — identifiers are deliberately kept per DECISION_LOG "ONLY PAPIC KEEPS A CUSTOM NAME", so nothing there is removable. Whether "Pakulay" is also a retired display name is for the owner (it is in public marketing copy).
- **Old onboarding screens replaced by the setup engine** — `/onboarding/wedding`, `/onboarding/[type]`, `/onboarding/simple` are all linked or current and receive today's work (10-01 "finish the event onboarding engine"). Nothing to remove yet.

## SLICE I — flags permanently off with code behind them (item 4)
Cannot be proven from code: every flag is an env var whose value lives only in Vercel (46 `lib/*-flag.ts` files; only 3 have zero importers, all in B-hold as allow-listed "built ahead of consumer"). To finish this item, pull the prod env into the scratchpad (per memory "Read a Setnayan prod flag value"), then any flag that is unset/false AND whose feature a DECISION_LOG row retired is a candidate. Most likely sets: `chat-negotiation-flag` (the change-request half is dead — Slice A3), `public-api-flag` (locked "plumb the gateway only"), `onboarding-v2-brief-flag`. Not proposed without the values.

## SLICE H — public/ images (deploy size, not bundle)
662 of 994 files (32.8 MB of 120 MB) are not named by any code string. Most live in directories addressed by a slug built at run time or stored in the database (onboarding refinements/prefs/cities/picker, demo/*, reveal/textures) — **do not remove on this evidence**. Directories with ZERO textual reference of any kind, the only ones worth a run-time check against DB paths: `public/hero/variants` (5 files, 0.63 MB), `public/bir-forms/2307-2018-ENCS.pdf` (0.34 MB — BIR 2307 retired 2026-05-29), `public/cipher/{strokes,glyphs}` (15 files, 0.55 MB — Cipher Studio assets), `public/taxonomy/tiles` (11 files, 0.8 MB), `public/onboarding/{budget,pax}` (42 files, 1.65 MB). The BIR form is the one with a retiring row (V2 publisher posture, 2026-05-29).

---

## SUMMARY (counts are tool-proven and outside the EXCLUDE list)
| Slice | What | Files | Routes freed | Server actions freed | Approx source bytes |
|---|---|---|---|---|---|
| A | zero-caller actions (delete 12, un-export 4) | 6 edited | 0 | 16 | ~25 KB |
| B | files nothing imports (B1-B6) | 19 deleted + route | 1 (initialize-maya) | 4 (verify actions) | ~121 KB |
| C1 | redirect stubs, no in-app link | 11 | 11 | 0 | ~10 KB |
| C2 | stubs still in nav registries | 17 | 17 | 0 | ~15 KB (owner call) |
| D | unreachable pages/routes (D1 check-email, D2 mesh-call chain, D3 sync-device) | 8 | 3 (+1 counted in B6) | 0 | ~50 KB |
| E | dead exports (E1 144 / E2 112 to eyeball) | 146 edited | 0 | 0 | ~30 KB est. |
| F | tested-but-unmounted libs | owner list | 0 | 0 | — |
| G/I/H | retired features, flags, public images | see text | clusters 2 (owner) | 0 | public/ up to ~3.5 MB |

Routes freeable with proof today: **15** (C1 11 + D1 + D2 + D3 + B6's route). Cap is 2,057 vs 2,048 = 9 over, so C1 alone clears it. Server actions freed: **20** (A 16 + B5 4).

## HOW EACH SLICE SHOULD BE REMOVED (one small PR each, in this order)
1. A (actions) — pure deletions + regenerate `admin-jobs.generated.ts`; fix `the-change-marker-is-retired.test.ts`.
2. B2 + B3 + B4 + B1 (no guards read them except baseline rows).
3. C1 (+ drop the 3 registry-array entries it names).
4. D1/D2.
5. B5, B6, D3 (guard tests that read the files by path need re-anchoring; payments/crew files want the controller's eye).
6. E1.
Everything else waits for the owner.

Method caveats (what I could NOT see): already-sent emails, DB-stored URLs (notification `relatedUrl`, `nav_slot_override`), Vercel env flag values, bookmarks. Static `import()` strings, `.bind`, `next/dynamic` and string route references were all searched. Knip ran with `@/` alias resolved; unresolved/generated imports could hide a user (Slice E2 flags them).
