# Indoor Blueprint → FREE · Handoff / What's-Next · 2026-07-23

> **Purpose.** Resume point for the "Indoor Blueprint is free and uses the 2D Plan for free" work (owner directive 2026-07-23). Registered in [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) §5. Read [`3D_Plan_Whats_Next_2026-07-23.md`](3D_Plan_Whats_Next_2026-07-23.md) alongside this — Indoor Blueprint is one of the 3D Plan's four integrated inputs.

## TL;DR — status

| Track | State |
|---|---|
| **Spec corpus** | ✅ DONE — reclassified RETIRED → FREE-via-2D-Plan in `Pricing.md` §0.A + §00.C, `AS_BUILT_GROUND_TRUTH_2026-06-07.md`, `DECISION_LOG.md` (2026-07-23, two rows). |
| **App code** | ✅ **MERGED to `main` 2026-07-23** — PR [#3593](https://github.com/iscasasola/setnayan-platform/pull/3593) (`claude/indoor-blueprint-free`). No migration. Live on origin/main. |
| **3D Plan reprice** | ⏳ SEPARATE item `3dplan#1` — owner set 3D Plan (`SEATING_3D`) = ₱1,500; live catalog still ₱2,999. NOT this work. Tracked in `3D_Plan_Whats_Next_2026-07-23.md`. |

## What the directive means

Owner (2026-07-23): *"indoor blueprint is free and uses the 2D Plan for free."*

Indoor Blueprint (the entrance→table wayfinding) rides on the already-free **2D seat plan** — so it is **no longer a paid SKU** and **no longer "retired/removed."** It is a FREE capability. The paid tier is the **3D Plan**, which **INTEGRATES** Indoor Blueprint as one of its four inputs (2D Seat Plan · Guest List · Indoor Blueprint · Mood Board) — it does not "upgrade" or "replace" it. See DECISION_LOG 2026-07-23 (two rows) + `3D_Plan_Whats_Next_2026-07-23.md`.

## What PR #3593 did (the code fix)

The retired ₱1,499 `INDOOR_BLUEPRINT` SKU was `is_active=false` but *retired-not-removed* and left mid-sale: the couple saw a live ₱1,499 buy drawer (`formatV2Sku` ignores `is_active`) that dead-ended at checkout (the generic `resolveServiceSellability` guard rejects the submit), while guests were gated on an order that could no longer be bought — mis-sold AND unreachable. PR #3593 makes it free everywhere:

- `apps/web/lib/add-ons-catalog.ts` — indoor-blueprint entry → `tier:'free'` + `opensDirect:true`, dropped `serviceKey` (Free pill, opens the studio directly, never buyable).
- `apps/web/app/dashboard/[eventId]/studio/indoor-blueprint/page.tsx` — removed the owns/active gate, `InlineCheckoutDrawer`, price read, marketing "Unowned" surface → always the free entrance-editor studio (empty chart → "build your seat plan first").
- `apps/web/app/[slug]/find-my-table/page.tsx` — removed the paid-order gate (free for every seated guest; empty-tables branch is the graceful fallback).
- `apps/web/app/[slug]/page.tsx` — removed the `eventSkuActive('INDOOR_BLUEPRINT')` gate on the inline "your seat" map.
- `apps/web/lib/indoor-blueprint.ts` — removed the now-orphaned paid-gate exports (`eventOwnsIndoorBlueprint` / `INDOOR_BLUEPRINT_SERVICE_KEY` / `INDOOR_BLUEPRINT_PRICE_PHP`) + `entitlements` imports; kept the wayfinding geometry.
- `apps/web/lib/suite-doorway-guardrails.test.ts` — added `indoor-blueprint` to the reviewed Suite free-layer set (intended conscious diff).
- `changelog.d/indoor-blueprint-free.md` — fragment.

**No migration.** The retired catalog row stays `is_active=false`; the server retirement guard still rejects any `INDOOR_BLUEPRINT` order (belt-and-suspenders).

**Verified locally before arming auto-merge:** `tsc --noEmit` clean · 113 unit tests · entitlement-gate/masthead/retired lints · eslint · production build ✓ (349/349). No e2e tests reference the feature.

## Remaining follow-ups (for the next session)

1. ✅ **PR #3593 MERGED to `main` 2026-07-23** (10:16 UTC). No migration; nothing to push. The `sn-indoor-blueprint` worktree can be removed (`git worktree remove`).
2. **(Optional, low priority) Maya demo-book scrub.** `apps/web/app/api/v1/billing/initialize-maya/route.ts` still lists `INDOOR_BLUEPRINT: 1499.0` in its `PRICING_BOOK` + a `TITLE_BOOK` entry. **Non-issue by design** — that book is documented DEMO-ONLY / non-billing (real charges read the admin catalog and fail closed) and Maya is dormant (PayMongo is the chosen gateway). The whole book is stale-on-purpose across many SKUs; scrub only as part of the holistic Maya/pricing pass, not piecemeal.
3. **3D Plan is a separate stream** — `3D_Plan_Whats_Next_2026-07-23.md` (`3dplan#1..5`): reprice `SEATING_3D` ₱2,999 → ₱1,500, Mood-Board venue recolour, shared-room flag-flip, 250-pax LOD, actor-layer makers. Indoor Blueprint being free does not block any of these.
4. **Dangling cross-ref to verify.** `3D_Plan_Whats_Next` + the `project_setnayan_indoor_blueprint_free` memory both cite `Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md § "3D Plan = the integrative product"`. That section may not yet exist in the directive doc — add it (4-inputs definition) when doing the 3D Plan stream.

## Canonical checkouts / repos

- **Code:** `github.com/iscasasola/setnayan-platform` · canonical local checkout `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` (index §7.1). PR #3593 branch `claude/indoor-blueprint-free`.
- **Spec corpus:** `github.com/iscasasola/Setnayan-specs` · local `/Users/icecasasola/Documents/Claude/Projects/Setnayan`.
- **Memory:** `[[project_setnayan_indoor_blueprint_free]]` (local `~/.claude/.../memory/`).
