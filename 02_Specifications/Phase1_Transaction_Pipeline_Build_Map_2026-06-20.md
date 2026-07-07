# Phase 1 — Vendor Transaction Pipeline · Build Map (file:line)

> Read-only map produced 2026-06-20 for building Phase 1 of `Vendor_Transaction_Lifecycle_2026-06-20.md`. Line numbers verified against `origin/main` (worktree `ci-cut`). Use this to implement the 3 PR slices below. Maps to the QA-walkthrough fix-chips: PR1 = chip ③ (category), PR3 = chip ① (offer/bridge); PR2 is new lifecycle work.

## Core finding
Two priced channels exist and **neither writes a priced `event_vendors` row** — that's the missing bridge (lifecycle stage 4):
- **Proposal channel** (`vendor_proposals`): couple Accept → `respond_vendor_proposal` RPC flips `status='accepted'` only. Migration comment `supabase/migrations/20261208006000_vendor_proposals.sql:13`: *"Accepting is a SIGNAL, not a booking."*
- **QuoteBridge** (couple workspace): the ONLY path that writes `event_vendors.total_cost_php` — manual "Log as service price" button, buried on the per-vendor workspace.
- **Offer channel** (`thread_service_interests`): metadata-only, status `'asked'`, no price column, read-only chips.

## PR1 — Category fix (sub-part d) · no migration · lowest risk · = chip ③
- `coerceCategory` in `apps/web/app/explore/actions.ts:101-111` falls back to `'misc'` because `vendor_profiles.services[]` holds **leaf** taxonomy (e.g. `photography`), not the coarse `vendor_category` enum.
- Fix: run each service string through **`resolveVendorCategory()`** (`apps/web/lib/vendor-packages.ts:92-96`, mapping table :40-84, e.g. `photography→photographer`) before falling back to `'misc'`. Optionally thread the explore search-category (`?folder=&category=&tile=`) from `apps/web/app/explore/_components/save-vendor-button.tsx:60-91` into `saveVendorToPicks` FormData and prefer it. Resolution order: search-context → resolveVendorCategory(services) → misc.
- Other writers already correct (`attachMarketplaceVendorToCategory` vendors/actions.ts:2168, `addRecommendedVendorToCategory` :1233). Bug is isolated to the explore Save path.

## PR2 — Remove Explore "Lock" tab + show locked in Build (sub-parts b,c) · UI-only · new work
- `apps/web/lib/budget-build.ts:22` — drop `'lock'` from `BUDGET_BUILD_TABS`; remove `TAB_META.lock` (:59-63). Nav + slot map follow automatically.
- `apps/web/app/dashboard/[eventId]/vendors/_components/services-takeover.tsx` — remove `lockSlot` prop (:49-62) + slot-map entry (:104-111); desktop nav (:139-159) auto-drops it.
- `apps/web/app/dashboard/[eventId]/vendors/page.tsx` — delete `lockSlot={...}` (:907-922) + `lockAvailability` (:724-741); compose `BuildLocked`'s "Ready to lock" + "Locked in" sections into the Build slot (:879-890); stop filtering locked rows out of Build (`taxonomyRows` is quoted-only at :852-877 — locked rows live in `model.folders[].children[].picks[]` with `raw_status ∈ {contracted,deposit_paid,delivered,complete}`, the set `BuildLocked` already extracts at build-locked.tsx:42-53).
- `apps/web/app/dashboard/[eventId]/vendors/_components/build-compare.tsx:208` — change `goToBuildTab('lock')` → `goToBuildTab('build')`.
- `finalizeVendor` is **status-driven, not tab-driven** (`apps/web/app/dashboard/[eventId]/vendors/actions.ts:507-1168`, stamps `selection_match_rank=1`+`linked_vendor_profile_id` at :934-944) — unchanged; `AccordionLockButton` (build-locked.tsx:15) still calls it.

## PR3 — Proposal → priced shortlist bridge (sub-part a) · migration · load-bearing · = chip ①
- Make accept-a-proposal write a priced `event_vendors` row. **Preferred:** extend `respond_vendor_proposal` (`supabase/migrations/20261208006000_vendor_proposals.sql:142-181`) so on `accepted` it upserts the couple's `(event_id, marketplace_vendor_id=vendor_profile_id)` row — set `total_cost_php = total_centavos/100`, `category = resolveVendorCategory(first line-item canonical)` on insert, bump `considering → shortlisted` (status-guarded; never downgrade contracted+). Keep it in the SECURITY DEFINER RPC (couple can't normally write a vendor-authored figure) + idempotent upsert.
- Alternative: hook the `respondToProposal` server action (`apps/web/app/vendor-dashboard/proposals/actions.ts:296`) via an admin-client helper.
- New forward migration only alters the RPC (all `event_vendors` columns already exist). `linked_vendor_profile_id` IS a real separate column (`supabase/migrations/20260515020000_public_stats_exclusion.sql:62`), distinct from `marketplace_vendor_id`; both stamped on lock.

## Offers — UX decision (RESOLVED: interest-only)
Keep `thread_service_interests` as a lightweight pre-price "interest" (chip = "I also do X"); the **proposal** is the single priced path to Shortlist (matches the owner's canonical flow "the vendor will propose a cost"). Optional polish: flip a matching interest `'asked'→'quoted'` when a proposal covers it. Do NOT add a price column to `thread_service_interests` or a couple-accept affordance to the chips.

## Suggested sequence
PR1 → PR2 → PR3 (independent enough to land separately; PR3's value is only visible once PR2 shows locked + priced rows in Build). Then **Phase 1b** (Setnayan AI category carry-forward) layers on the inquiry pipeline.
