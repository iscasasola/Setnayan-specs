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
