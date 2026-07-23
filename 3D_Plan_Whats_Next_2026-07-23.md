# 3D Plan — What's Next (next build batch) · 2026-07-23

> **Purpose.** Queue the 3D Plan build items into the "run all what's-next" batch. Registered in [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) §5. Obey that index's §2 (worktrees/migrations), §6 (serialize shared files), and §1 (route every non-`NONE` gate to the human queue).
>
> Owner intent (2026-07-23): defined the 3D Plan, priced it, and said *"place this to what's next for next batch building."*

## Context (decided 2026-07-23 — see DECISION_LOG)

The **3D Plan** is the integrative product — the third projection (List · 2D Plan · **3D Plan**) that composes **four data inputs** (2D Seat Plan · Guest List · Indoor Blueprint · Mood Board) **plus an actor-presence layer** (avatar makers + booths for Vendors + Hosts). Canonical definition: [`Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md`](Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md) § "3D Plan = the integrative product."

**Price = ₱1,500** host-activation, one-time/event (`SEATING_3D`) — owner 2026-07-23; the ₱2,999 standalone, the interim ₱1,000, and the #3526 vendor-enabled couple discount are all **retired**. Vendors separately pay **₱1,500/28d** (#3526 `vendor_3d_booth`) for ad/booth presence — unchanged, independent.

**Canonical checkout** (index §7.1): `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` (the live worktree fleet). Confirm `origin`/`main` before any code.

## Execution metadata (index §3 schema)

```
- id:            3dplan#1
  title:         Reprice SEATING_3D ₱2,999 → ₱1,500 (host-activation) + drop the dead couple-discount resolver path
  type:          migration + code
  depends_on:    []
  parallel_safe: no          # touches Pricing.md § 00 + catalog → serialize with ALL Pricing/Papic migrations (index §6)
  safety_gate:   NONE        # owner-decided 2026-07-23. ⚠ it LOWERS a live prod price — call it out in the PR, do not flip blind
  touches:       service_catalog SEATING_3D row · new migration (allocate prefix, no round 000000) · resolvePaxPricedOrderCentavos (SEATING_3D discount branch now dead) · Pricing.md
  verify:        migration doctor + tsc + price-drift guard test + confirm live catalog row = ₱1,500 after push
  gap:           live catalog still charges ₱2,999 (decision recorded, NOT in code)

- id:            3dplan#2
  title:         Mood Board palette → full venue recolour (derive venue element colours FROM the 0010 Mood Board palette)
  type:          code
  depends_on:    []
  parallel_safe: yes         # 3D render layer; disjoint from pricing/migration
  safety_gate:   NONE        # matches the locked design ("rooms re-tint to mood board", 2026-07-19 council); ship behind a default-OFF flag if visual risk
  touches:       lib/seating-3d.ts (venue element materials) · Mood Board palette read
  verify:        tsc + lint + build + live-check the room re-tints to the couple's palette (not accent-only)
  gap:           partial today — accent-only; full palette-driven recolour unbuilt

- id:            3dplan#3
  title:         Shared-room co-presence go-live — 2-device test → flip NEXT_PUBLIC_PLAN3D_SHARED_ROOM
  type:          verify → flag-flip
  depends_on:    []
  parallel_safe: yes         # code already shipped (#3041–#3050); this is a test + a prod flag flip
  safety_gate:   FLAG_FLIP_PROD   # human-gated: run the 2-device test first, then the owner flips
  touches:       NEXT_PUBLIC_PLAN3D_SHARED_ROOM (prod env)
  verify:        real 2-device roam test on /[slug]/venue + couple lab "Play"; then owner flips
  gap:           built flag-OFF; now a LAUNCH DEPENDENCY — the ₱1,500 value prop sells co-presence roaming

- id:            3dplan#4
  title:         Seated-crowd LOD / instancing for 250-pax phones (so "all guests roam at once" actually holds)
  type:          code
  depends_on:    [3dplan#3]   # only matters once co-presence is live
  parallel_safe: yes
  safety_gate:   OWNER_DECISION   # alters the locked "one articulated Figure everywhere" look — needs sign-off (already chip task_07960d16)
  touches:       seated-crowd render (lib/seating-3d.ts figures) · LOD/instancing
  verify:        250-pax phone frame-budget test + a Supabase Realtime throughput test at high fan-out (the two ceilings)
  gap:           UNPROVEN at scale — this is the honest answer to the owner's "can it run all guests at the same time?"

- id:            3dplan#5
  title:         Actor layer — avatar makers + booths (Vendors + Hosts) per the Venue Makers council build order
  type:          code
  depends_on:    []
  parallel_safe: no          # follow the council's own P0→P3 order; P0 doorway fix first
  safety_gate:   NONE        # the SEATING_3D-vs-free-lab OWNER gate is RESOLVED (₱1,500); P1–P3 are the maker builds
  touches:       /seating/lab Build-mode Design panel (couple/host) · "Your booth" tab (vendor) · guest 3-tap sheet · public_venue_scene (cardItems bug) · ReceptionDesign stage 3D consumer
  verify:        per 3D_Venue_Makers_Council_Verdict_2026-07-19.md §6 sign-offs + live-check each maker
  gap:           council 2026-07-19 = NOT built in-app (prototype only). Host booths are NOT new — already scoped here.
```

## Serialize / notes

- **3dplan#1** is a Pricing.md + migration task → serialize with every other Pricing/Papic migration (index §6); re-fetch `main` between them.
- **3dplan#3 → 3dplan#4**: don't chase the 250-pax LOD until co-presence is actually live and the flag is on.
- **3dplan#5** should follow `3D_Venue_Makers_Council_Verdict_2026-07-19.md`'s build order (P0 doorway/cardItems fix → P1 couple → P2 vendor → P3 guest); its 7 sign-offs (§6) are the gate list.
- The vendor 3D-Booth add-on (#3526) is already shipped flag-dark — nothing to build there; it just renders inside this product.
