---
name: setnayan-gifts-g5-event-date-windows-landed
description: "G5 (event-dated promo free windows) built 2026-09-06; PAPIC_UNLOCK still bypasses the promo gate entirely; corpus had other sessions' uncommitted rows so nothing was committed there"
metadata: 
  node_type: memory
  type: project
  modified: 2026-09-05T23:04:13.957Z
  originSessionId: 1e215888-a10c-4e74-90cf-8655d0382b2d
---

G5 of the Gifts & Deals programme landed 2026-09-06 (branch `claude/event-dated-promo-windows`,
fragment `changelog.d/event-dated-promo-windows.md`). Owner ask 2026-09-05, verbatim: "(a) For an
event for a specific date (b) For a specific event for a specific date/range (c) For any event."
(b) — one NAMED event — already shipped via `comp_grants.event_id` (PR #5193). G5 built (a) and (c)
only; (c) needed no schema change (it was already the unfiltered `all_couples` behavior).

**Shape:** two nullable columns on `promo_free_windows` — `event_date_from` / `event_date_to` DATE
(migration `20271208727445`), NOT a new `audience_type` value. Both NULL = any event; either/both
set = only an event whose `events.event_date` falls in the inclusive range qualifies, and an event
with no locked `event_date` never qualifies (unknown excluded, never assumed included). New pure
predicate `coupleWindowCoversEvent` in `lib/promo-free-windows.ts`. `isSkuFreeForCouplesNow` /
`promoFreeSkusForCouples` both gained an optional `eventDate` param; the three call sites in
`lib/entitlements.ts` (`eventOwnsSku`, `eventSkuActive`, `eventActiveSkus`) fetch the event's own
`event_date` only behind `isPromoFreeWindowsEnabled()`, so flag-off stays a zero-extra-query path.

**Confirmed, still true, do not re-derive:** `PAPIC_UNLOCK` does NOT go through the promo gate —
`eventHasPapicUnlock` in `lib/entitlements.ts` calls `checkOrderActive` DIRECTLY, bypassing
`eventOwnsSku`/`eventSkuActive`/the promo reader entirely. A promo window listing `PAPIC_UNLOCK`
frees nothing. Fixing that is a separate, larger change to the Papic metered-allowance system
(camera day-quotas, guest 150-credit cap) — explicitly out of scope for G5, flag it again rather
than assuming someone already fixed it. `LIVE_STUDIO`'s entitlement gate IS correct/reachable
(`eventSkuActive(admin, eventId, 'LIVE_STUDIO')`), but the admin creation UI's SKU picker still
excludes `LIVE_STUDIO`/`LIVE_STUDIO_ROAM`/`LIVE_STUDIO_HOSTED_CHANNEL` by name while
`NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` is off — that's a v2-catalog picker limitation, independent
of and not fixed by G5.

`/admin/gifts` gained a "Couple free windows" section — its OWN `ConsoleTable` (Title/Event
dates/Services/Ends/Manage), not merged into the vendor-shaped table the 2026-09-05 cohort-deals
work added — a couple window has no vendor/tier concept. New reader
`lib/promo-free-window-admin.ts` (`fetchCoupleFreeWindows`), sibling to `vendor-tier-comps.ts`'s
`fetchVendorDealWindows` (that split — gate reader in `promo-free-windows.ts`, admin-listing reader
in a separate file — is the codebase's actual, already-established convention). The couple branch
of `createFreeWindow` (`free-windows-actions.ts`) now also requires `reason` (min 10 chars),
matching the vendor branch's existing bar — it previously logged none.

No dedicated iteration `.md`/`.docx` exists for the Gifts & Deals feature in the spec corpus (it is
tracked purely through `DECISION_LOG.md` rows + PR cross-links) — same as the two 2026-09-05 rows
before it (admin-gifts-single-target-comps, vendor-cohort-deals). `build-sessions/GIFTS-PLAN.md`,
referenced by name in at least two DECISION_LOG rows as tracking G1–G6, does **not exist** in the
corpus as of 2026-09-06 — if a future session needs "the plan," it isn't there; check with the
owner before assuming G6+ scope from a phantom file.

**Corpus state:** `~/Documents/Claude/Projects/Setnayan` carried 14 uncommitted changes (7 modified
+ 7 untracked, including a `DECISION_LOG.md.bak-2026-09-05-spotlights`) from other sessions when
this session edited `DECISION_LOG.md`. This session added its row but did NOT commit the corpus —
check `git status` there before committing anything. See
[[setnayan-vendor-papic-credits-g2-landed]] for the same situation one day earlier, and
[[setnayan-shared-checkout-is-switched-by-other-sessions]] for the platform-repo analog.
