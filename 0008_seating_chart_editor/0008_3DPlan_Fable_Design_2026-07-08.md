# 0008 · 3D Plan — Fable-Level Design Dossier & Build Program (2026-07-08)

> Newer dated sibling in the 0008 seat-plan folder (stub rule: never re-expand the canonical stub).
> Owner-locked direction, this date: **"Sims-like + cinematic Play"** · all extras · shared kit → all surfaces · booths = locked vendors.
>
> **Canonical data equation (owner): Guest List × Seat Plan × Mood Board × Monogram × Locked Vendors.**
> Monogram is its own pillar — floor medallion (+ paid ANIMATED_MONOGRAM bloom) plus mural composite, stage backdrop, booth signage accents.
>
> **ADDENDUM — Slice 8 · `3dplan-shared-room` (locked after this dossier was synthesized):**
> Live multiplayer roam, "everywhere + 2-phone demo," OFFLINE-FIRST. Guests roaming on their phones appear moving on every
> other viewer's render (other guests + couple lab Play) via the per-event Supabase Realtime channel (same primitives as
> `use-seating-presence.ts` + Papic `use-demo-channel.ts`). Remote players enter the SAME moving-agent avoidance field as
> local walkers (Slice 3 machinery — remote positions are just more agents). Homepage demo gains "roam with a friend"
> (two visitors share the sample room, Papic 2-phone pattern). Offline fallback: the room always renders fully from local
> data; realtime positions are an enhancement layer that joins/drops silently (~8 Hz, only-while-moving, delta, client-
> authoritative). Depends on Slice 3; can run parallel to Slices 4–6.

---

# 3D Plan — Design Dossier & Build Program
**"Sims-like + cinematic Play" · owner-locked 2026-07-08 · authored against the 7-read inventory of 2026-07-07**

> **Ground rule before anything else:** the read worktree (`papic-demo-pr2`, HEAD `285ab880e`) is **stale vs `origin/main` (`fb51661a0`)**. Realism Wave 2a–2c, booth types, booth logos, photo avatars, atomic swap, and instanced chairs are ALREADY MERGED. Every slice below branches from **fresh `origin/main`**. File:line citations are from the inventory reads; where main has since relocated code (e.g. `instanced-chairs.tsx`, `scene-lighting.tsx`, `venue-objects.tsx`, `booth-vendor-card.tsx` now live under `app/_components/plan3d/`), the main location wins.

---

## 1. Capability Map — what exists today, shared vs duplicated

### 1.1 The three surfaces + one engine

| Surface | File | Renders today | Interactivity today |
|---|---|---|---|
| **Homepage demo overlay + phone guest walk** | `app/_components/plan3d/plan3d-scene.tsx` (507 ln, props-only, read-only) | Floor, stage slab, entrance arch, low-poly tables (serpentine drawn as a plain box — visual bug vs lab), cylinder+sphere guest tokens, one Walker, gold my-seat ring. No dance-floor mesh (avoidance-only). Real shadows ON (only surface). | Orbit + click-guest-to-mint-QR (desktop); scripted entrance→seat walk + tap-to-roam free walk with chase cam (phone). On main also: booths via `VenueFixtures`, swipe-to-look, booth tap → vendor card, "Walk to this booth". |
| **Couple lab (Build + Play)** | `app/dashboard/[eventId]/seating/lab/_components/seating-lab-3d.tsx` (3,442 ln, edit-capable) | Full room: cloths, centerpieces, chairs (instanced on main), serpentine curved band, monogram medallion + bloom (paid), VenueShell archetypes + VenueDecor (main), attire bodies (gown/suit), selfie billboard discs, walls, dance plane, entrance. | Build: full editor behind single-editor lock. Play: walk-everyone-in crowd, single walk-in, animated atomic swaps, first-person WalkController (joystick + look pad + pinch FOV). |
| **Public guest venue walk** | `app/[slug]/venue/_components/guest-venue-3d.tsx` (317 ln, self-contained) | Floor/stage/tables/chairs/tokens, my-seat ring, avatar capsule walk. No dance mesh, no walls, no attire, no monogram (some closed by Wave 2b on main). | Tap-to-roam; anonymized occupancy via `public_venue_scene` RPC (v5 adds booth offerings + vendor block — **flagged not-yet-applied-to-prod; verify**). |

**One engine:** `lib/seating-3d.ts` (752 ln, pure, dependency-free, unit-tested) supplies all shapes, seat math, obstacles, steering, palette resolution. This is the load-bearing shared layer and it is genuinely shared.

### 1.2 Shared vs duplicated

**Already shared (main):** `lib/seating-3d.ts` · `plan3d/scene-lighting.tsx` (Lightformer env, ACES, procedural marble/fabric textures) · `plan3d/instanced-chairs.tsx` · `plan3d/venue-decor.tsx` · `plan3d/venue-objects.tsx` (BoothMesh + silhouettes + BoothSign) · `plan3d/guest-avatar.tsx` (refcounted photo-disc cache) · `plan3d/booth-vendor-card.tsx` · `plan3d/use-look-gesture.ts` · `lib/svg-monogram-texture.ts`.

**Duplicated ~3×, the kit's first target — the human figure:**
- demo `GuestToken` (plan3d-scene.tsx:110-140) and `Walker` (:296-307) — identical cylinder+sphere, copy-pasted;
- lab `SeatedAvatar` (lab:235-262, gown/suit geo :153-166), lab `Walker` (:2253-2265), `CrowdAgent` (:2424-2431), `MoverToken` (:2494-2503) — four more variants, walking figures carry **no attire/selfie**;
- guest walk `GuestAvatar` (guest-venue-3d.tsx:170-179).

Also duplicated: light rigs (three hand-rolled `<ambientLight/hemisphere/directional>` triples, hardcoded `#fff6ea` key in two), chair geometry in guest walk vs instanced chairs, stage material divergence (lab = `palette.accent`, guest walk = `palette.table`).

### 1.3 Walk / avoid / sit today vs the locked mechanics

| Locked mechanic | Today | Gap |
|---|---|---|
| **(a) Walkers avoid people + tables + chairs, no clipping** | `steerPath` (lib:638-700, 40 samples + repulsion + 3 hard passes) plans around **static discs** (tables/stage/dance/objects/booths); per-frame `pushOutOfDiscs` re-clamp is the anti-clip guarantee (proven by chord-regression test lib.test:96-144). Crowd adds `separateAgents` (lib:593-617), one O(n²) relaxation pass. | **Chairs and seated guests are NOT obstacles** (lab constraint list, explicit). Separation is reactive-only — no anticipation of *moving* agents, so head-on walkers shoulder-slide through each other's paths before re-clamp. Demo/guest surfaces have zero person-avoidance (single walker). No spatial grid. |
| **(b) Sit-down: chair slides back, turn, sit, chair tucks** | Nothing. Seating is a **swap/teleport**: walker unmounts after 1.2 s, static token appears on the chair (lab:1216-1223; crowd :2396-2403; demo fires `onWalkComplete` and the token reappears). No sit pose exists — seated guests are standing-ish tokens composed inside the chair group (lab:2134-2136). | Entire mechanic. Prerequisite identified by the geometry read: `chairLocalPositions` **drops facing** for every shape except serpentine (`SerpSeat.faceY`, lib:260, 300-321) — a faceY-carrying return type is step zero. |
| **(c) Free roam, walk anywhere** | ✅ Exists on all three surfaces (tap-to-roam in demo/guest, first-person WalkController in lab). `changelog.d/walk-controls.md` flags feel/tuning unverified. | Tuning pass + person-avoidance while roaming among the new crowd. |
| **(d) Interactive booths with per-booth cards** | ✅ Shipped further than assumed: `event_floor_booths` rows with `booth_type` (10-kind catalog incl. band/live_cooking), `offerings` ≤280 chars, `event_vendor_id` → vendor identity; BoothMesh silhouettes; tap → `booth-vendor-card.tsx` (name/logo/category/offerings/"Walk to this booth" via `boothApproach` lib:656). | Card content is one 280-char text blob — no **menu / songlist** structure. The primitives exist unread by 3D: `vendor_service_inclusions` (label + worth_php), `vendor_services.package_inclusions` JSONB. Sample vendors have `package_inclusions='[]'` and no logos → demo booths would render empty. Public-walk booth branding needs the one-line RPC `tier` addition; v5 migration prod state unverified. |

---

## 2. Kit Architecture

### 2.1 Principle

`app/_components/plan3d/` is already the de-facto shared home on main. Formalize it: everything scene-agnostic and JSX-bearing goes in **`app/_components/plan3d/kit/`**; everything pure-math and testable goes in **`lib/`** next to `seating-3d.ts` (same import-type-only, no-three-at-runtime discipline where possible — the rig math can be pure; the JSX cannot). Do **not** touch `HomeReskin`/`HomeOverlays`/pillar files — the demo overlay (`plan3d-demo-overlay.tsx`) already mounts `Plan3DScene`; all kit work lands *behind* that mount point, so the hot homepage files never appear in these PRs.

### 2.2 Layout

```
apps/web/lib/
  seating-3d.ts                    # existing engine; gains SeatPose/faceY + agent-avoidance helpers (pure, tested)
  figure-rig.ts                    # NEW pure: joint-angle presets (stand/walk-cycle/sit/idle-sway), FigureSpec resolution
  dance-mural-texture.ts           # NEW: CanvasTexture mural from role_palette (+ optional monogram composite)

apps/web/app/_components/plan3d/
  scene-lighting.tsx               # existing — becomes the kit LightingRig (adds warmth-from-palette + Play grade hooks)
  instanced-chairs.tsx             # existing — gains "detach one chair for animation" API
  venue-objects.tsx                # existing — BoothMesh/BoothSign/VenueFixtures
  venue-decor.tsx / guest-avatar.tsx / booth-vendor-card.tsx / use-look-gesture.ts   # existing
  kit/
    figure.tsx                     # <Figure spec pose phase/> articulated procedural rig (the ONE human)
    outfits.ts                     # gown | suit | barong | filipiniana | neutral — shared geometries + CanvasTexture details
    hair.ts                        # 4–6 procedural hairstyles, deterministic pick by guest id hash
    face.ts                        # simple face decal (eyes/smile CanvasTexture) + selfie head texture path
    sit-controller.tsx             # chair pull-back → turn → sit → tuck state machine (drives Figure + one detached chair)
    agents.ts                      # multi-agent walk sim: spatial hash + predictive separation + disc re-clamp (thin, math in lib)
    emotes.tsx                     # pooled sprite bubbles (CanvasTexture glyphs), data-driven
    ambient.tsx                    # petals / butterflies / music notes — one InstancedMesh per system
    cinematic.tsx                  # Play-mode film pass (dynamic-imported postprocessing; graceful null on low tier)
    booth-card-content.tsx         # menu/songlist sections inside booth-vendor-card (kind-aware layout)
    index.ts                       # public API surface
```

### 2.3 Public API (kit/index.ts)

```ts
export type FigureSpec = {
  id: string;
  outfit: 'gown' | 'suit' | 'barong' | 'filipiniana' | 'neutral';
  outfitColor: string | null;          // mood-board motif chain (lab page.tsx:122-123 today)
  skinTone?: string; hairStyle?: number; hairColor?: string;  // deterministic defaults from hash(id)
  photoUrl?: string | null;            // selfie — guests.photo_url ONLY, never face enrollments
  statusColor: string;                 // SIDE_COLOR / TENTATIVE — semantic, palette-independent (lib:122-129)
  scale?: number;
};
export type FigurePose = 'stand' | 'walk' | 'sit' | 'idle';   // phase: number drives limb cycle / sway

export type FurnitureSpec = { /* wraps existing tableDims/chairLocalPositions consumers; adds SeatPose */ };
export type SeatPose = { x: number; z: number; faceY: number; pullBackM: number };  // lib/seating-3d.ts promotion

export type BoothSpec = {
  boothId: string; kind: BoothType; label: string; x: Vec2world; zone: 'reception'|'cocktail';
  vendor: { name: string; logoUrl: string | null; category: string } | null;   // business identity only
  offerings: string | null;
  menu: Array<{ label: string; worthPhp: number | null }> | null;   // from vendor_service_inclusions / package_inclusions
};

export type LightingRigProps = { palette: Lab3DPalette; quality: 'high'|'low'; play?: boolean };  // wraps SceneLighting
export type AnimationClips = ReturnType<typeof useSitController> /* enterAndSit(seat: SeatPose), etc. */;
```

Pure pose math (`figure-rig.ts`: `walkCyclePose(phase)`, `sitPose()`, `idleSway(id, t)`) is unit-testable without three, mirroring the `walkVector`/`separateAgents` precedent.

### 2.4 Migration order (per consumer)

1. **Homepage demo (`plan3d-scene.tsx`)** — smallest, props-only, already imports from `plan3d/`; the visible-wow surface. First.
2. **Couple lab** — swap `SeatedAvatar`/`Walker`/`CrowdAgent`/`MoverToken` for `<Figure>`; it already has the richest data (attire, photoUrl, RSVP). Second, because Play mode is where sit + cinematic land.
3. **Guest venue walk** — last; it is deliberately self-contained ("no editor coupling" header) and privacy-scoped, so it adopts the kit once the API is stable. Its stage-color divergence (table vs accent) gets unified consciously here.

Constraints carried through unchanged: props-only/read-only in demo + guest walk; single-editor lock in lab; `usePrefersReducedMotion` on every clip; `damp(base, delta)` frame-rate independence; per-frame `pushOutOfDiscs` re-clamp always; PII slices stay minimal.

---

## 3. Technical Design per Locked Mechanic

### 3.1 Articulated figure rig — procedural, no GLTF

**Grounding:** the deps read confirms **zero .glb/.gltf/.hdr assets anywhere in public/**, no loader config in `next.config.ts`, and a hard "no runtime asset fetches in the 3D engine" constraint from the realism waves. `useGLTF` is installed-but-unused headroom; adding binary figure assets would also poke the Vercel build-memory ceiling (#1258). **Verdict: procedural rig from primitives**, exactly the house style (module-scope shared geometries, lab:153-166).

**Rig:** a group hierarchy — pelvis → torso → head; 2 arms (upper/forearm, capsule pairs), 2 legs (thigh/shin). ~11 meshes from **6 shared BufferGeometries** total (capsule ×2 sizes, sphere, outfit shells). Walk cycle: limb swing angles = `sin(phase)` / `sin(phase+π)` driven by the **existing `bobRef`** (plan3d-scene.tsx:267-269 already ticks 9 rad/s while moving and freezes on arrival — it becomes the rig clock for free). Extends/replaces: `GuestToken` + `Walker` (plan3d-scene.tsx:110-140, 296-307), lab avatar family (lab:235-262, 2253-2265, 2424-2431, 2494-2503), `GuestAvatar` (guest-venue-3d.tsx:170-179).

**Outfits:** keep `GOWN_GEO`/`SUIT_GEO` silhouettes (lab:163-164) as the gown/suit shells; **barong tagalog** = suit shell in near-white with a subtle vertical-stripe embroidery CanvasTexture (same procedural-texture pattern as `fabricBumpMap`, scene-lighting.tsx) + slight translucency; **filipiniana** = gown shell + two flattened-sphere butterfly sleeves at the shoulders. Colors via the existing motif chain (`wedding_party[0]→bride[0]` / `groom[0]`, lab page.tsx:122-123). Attire resolution stays `resolveGuestAttire` (lib/guests.ts:104-107); barong/filipiniana selection is a **new couple-facing pick** on the existing `guests.attire` enum → **needs an enum widening migration** (see Build Program, slice 1 note) or a code-side style variant keyed off attire+culture flag — recommend the latter first (no migration): `outfitStyle` derived in code, owner question if per-guest persistence is wanted.

**Faces:** simple CanvasTexture decal (two eyes + smile, 3 variants) on the head sphere front hemisphere — matches "simple faces" in the reference.

**Perf budget:** figure = ≤12 draw calls naive; for seated crowds (150 guests) use one `InstancedMesh` per body-part per outfit-class (drei `Merged`/instancing precedent already documented at lab:150-155). Target: seated room ≤ ~40 figure draws. Mobile/low tier: static seated figures skip limb animation entirely (pose baked), walkers cap at 8 concurrent.

### 3.2 Seated pose + chair pull-back animation

**Seat transform derivation (the geometry-lib change):** promote `chairLocalPositions` (lib/seating-3d.ts:347-379) to return `SeatPose {x, z, faceY}` for all shapes — serpentine already computes `faceY` and drops it (:351); round derives `faceY = atan2(−x, −z)`; sweetheart faces +z; banquet/family rows face across by row sign. This is the extension point the geometry read explicitly identified, composed through unchanged `rotateLocal` (:387-392) + `seatWorld` (:395-401). Unit tests extend `seating-3d.test.ts`.

**Chair animation vs instancing:** chairs are 2 InstancedMesh draws per table on main (`instanced-chairs.tsx:55`). For the sit sequence: zero-scale the target instance (the removedSeats pattern already zero-scales), mount a single **ActiveChair** real mesh at its transform, animate it, then restore the instance. One extra mesh only during the ~1.6 s clip.

**Sequence (sit-controller.tsx):** on walker arrival at a pre-seat approach point (0.55 m out along −faceY): (1) chair eases back 0.35 m along −faceY, 350 ms ease-out; (2) figure steps into the gap, turns to `faceY + π` (shortest-arc `lerpAngle`, plan3d-scene.tsx:198-202) and blends stand→sit joint preset over 450 ms; (3) chair + figure tuck forward together 0.3 m, 400 ms. Insertion seams are exactly the swap points the lab read identified: lab:1216-1223 (single), lab:1229/2396-2403 (crowd), demo `firedRef`/`onWalkComplete` (plan3d-scene.tsx:290-293). Reduced motion: snap to seated, still fire completion (house rule). Reverse clip for stand-up (future swap animations reuse it).

### 3.3 Dynamic crowd avoidance — people, tables, chairs

**Recommendation: boids-style predictive separation on top of the existing disc fields — not full RVO.** RVO/ORCA is overkill for ≤150 agents at wedding walking speeds and would replace tested machinery; the inventory shows the right substrate already exists.

Layered, per frame, in `agents.ts` (math in lib):
1. **Path layer (unchanged):** `steerPath` per agent against static discs, own-destination table skipped (lab:1191-1211 pattern).
2. **NEW chair discs:** add per-chair static discs r ≈ 0.3 m (from the promoted SeatPose positions) to each agent's obstacle set, *excluding the agent's own destination chair and its immediate neighbors' approach cone*. Seated guests are covered by their chair discs — closes the "chairs and seated guests are not obstacles" gap with zero new machinery (they are just more discs, exactly as `floorObstacles`' doc anticipated for booths, lib:456-458). Disc count grows (~150 chairs + ~20 tables) → introduce a **spatial hash grid** (cell 1.5 m) in the same slice; it is the documented `separateAgents` v2 (lab:2285-2288).
3. **NEW predictive agent separation:** upgrade `separateAgents` (lib:593-617) — for each nearby pair, compare positions **projected 0.4 s ahead** (`p + v·0.4`); if projected distance < 0.6 m, apply a steering push perpendicular-biased to the right (Filipino corridor convention reads naturally; also prevents the mutual-mirror deadlock). Keep the current same-frame overlap push as the fallback. Still one relaxation pass/frame, converging over time — same philosophy, now anticipatory.
4. **Hard guarantee (unchanged, load-bearing):** `pushOutOfDiscs` re-clamp with `AVATAR_BODY_R` inflation every sampled frame (plan3d-scene.tsx:241-255; regression test lib.test:96-144). Agents can be shoved but never through geometry.

Demo/guest surfaces generalize `WalkState` + `walkerPosRef` (plan3d-scene.tsx:216-223, 359) to arrays — the extension point the demo read named. **Perf:** O(n·k) with the grid; cap concurrent movers at 24 (lab Play), 8 (phone). Reduced motion: agents snap (existing behavior).

### 3.4 Tappable booths — cards with real menus

**Raycast + card: already shipped** (invisible hit targets over BoothMesh → `booth-vendor-card.tsx` bottom-sheet/drawer, + `boothApproach`). The work is **content depth + demo data**:

- **Lab (real vendors):** the lab page (server component, couple-authed, RLS-fine) resolves each booth's `event_vendor_id` → `event_vendors.service_id` → `vendor_services` and fetches `vendor_service_inclusions` (label + worth_php — the canonical name+price primitive, lib/vendor-services.ts:191-224, existing fail-soft `fetchInclusionsByService`) with `package_inclusions` JSONB as fallback, plus `event_vendors.host_inclusions[]` for manual vendors. Pass as `BoothSpec.menu`. **No schema change.**
- **Demo (fictional vendors):** homepage booths read the Maria & Jose cast via the existing `getSampleEventId()` admin-client trust boundary (app/tour/_lib/sample-event.ts rules; read-only tour contract — SELECTs only, display-safe fields, no contact/payment fields). Their `package_inclusions` are mostly `'[]'` → **seed-script extension, not a migration**: give Hain Catering a plated menu array, Saysay Live Band a songlist, Tagay Mobile Bar a drinks list, in `scripts/seed-sample-event-maria-jose*.sql` (content must live in the seed or it evaporates on re-seed — vendors read constraint). Fictional data on the is_demo batch does not violate the no-fabrication doctrine; real vendors render only what exists (degrade to offerings-only / initials — existing pattern).
- **Kind-aware card layout** (`booth-card-content.tsx`): caterer → "Menu" with worth chips; band/live_performance → "Songlist / Set"; mobile_bar → "On the bar"; default → inclusions list. Booth-kind mapping lives **in code** next to `BOOTH_CATALOG` (house style per taxonomy.ts:27-29).
- **Public guest walk:** apply the flagged one-line RPC change (`'tier', vp.tier_state` in `public_venue_scene` booth jsonb) and, if menus should reach guests, extend the same jsonb — **but first verify migration `20270510377963` (v5) is applied to prod** (flagged unapplied in its fragment).

**Perf:** card is DOM (Sheet primitive), zero GPU cost; hit targets already exist.

### 3.5 Cinematic Play pass

**Deps reality:** `postprocessing` / `@react-three/postprocessing` are **NOT installed** (verified in node_modules); today's glow is emissive + fog fakes. Drei's installed-but-unused kit (Environment, SoftShadows, Sparkles, PerformanceMonitor, AdaptiveDpr) is free headroom.

**Recommendation — two tiers, one dep:**
- **Tier A (no new dep, ships first):** golden-hour grade via ACES exposure + warm key derived from palette (SceneLighting already exists; the `#fff6ea` hardcode becomes palette-mixed warmth — the theming read's extension point), fog tuned per Play, drei `Sparkles` for dust-in-light shafts, emissive string-light bulbs (one instanced mesh, no real lights), vignette faked with a screen-space radial-gradient DOM overlay. This alone reads "film look" on phones.
- **Tier B (add `postprocessing` + `@react-three/postprocessing`):** DepthOfField (focus on room center / followed walker), Bloom (string lights, candles), subtle grain + vignette. **Dynamic-import inside `kit/cinematic.tsx` only when Play mode + quality 'high'** — it never enters the phone walk chunk or the main bundle (bundle-size CI + Vercel 8GB build-memory ceiling both guarded; postprocessing is ~small but the discipline matters). Mount drei `PerformanceMonitor`; on decline, drop Tier B → Tier A automatically. Reduced motion: no petal drift, static grade only.

**Owner-relevant:** Tier B is the only new npm dependency in this entire program. If vetoed, Tier A alone is ~80 % of the look.

### 3.6 Emote bubbles

**Sprites, not drei Html.** The lab deliberately has zero in-scene Html (everything is DOM overlay; the only billboard is the selfie disc) — Html elements don't occlude, cost DOM layout per guest, and fight the chase cam. Build `emotes.tsx` as a **pooled sprite system**: glyphs (🍗 meal-chosen, ✔ confirmed, ？ pending, 🎵 near dance floor, 💬 idle chatter) pre-rasterized to one CanvasTexture atlas, rendered as `Sprite`/billboarded quads above heads, pop-in scale tween, ≤6 visible at once (rotating picker so the room feels alive without noise).

**Data source & PII:** lab — `Lab3DGuest.rsvp` exists today; **meal choice is not in the slice** and adding it to the *lab* is couple-scoped and fine (page-level fetch addition). Homepage demo — `Plan3DGuest` is deliberately name+seat+side only (plan3d-demo-actions.ts:29-37); demo bubbles use RSVP/side-derived emotes only, sample-event meal data may ride since the cast is fictional, but keep the slice minimal by default. Public guest walk — anonymized: generic ambient emotes only, no per-guest status (RA 10173 posture).

### 3.7 Mood-board dance-floor mural

Replace/overlay the flat accent plane (lab:1889-1894) with a **CanvasTexture mural** generated in `lib/dance-mural-texture.ts`: derive `[bg, accent1, accent2]` via the existing `ledPaletteFromMoodBoard` math (site-palette.ts:299-332), paint a radial-gradient terrazzo/gobo-wash motif, optionally composite the couple's monogram center via `svg-monogram-texture` (its header already names future consumers; the MonogramPlane pattern — `meshBasicMaterial`, `alphaTest`, raycast-off, rasterize-once + dispose — is the template, lab:1709-1776). Add the missing dance mesh to demo scene (sibling of the stage slab, plan3d-scene.tsx:435-442) and guest walk (after guest-venue-3d.tsx:270; `floor.dance` already arrives via RPC for obstacles). Rasterized once, keyed on palette+monogram, never per frame. Monogram-on-mural for free events stays static; the bloom stays gated to ANIMATED_MONOGRAM (monetization boundary).

### 3.8 Selfie faces on figures

**Keep the shipped billboard disc as the canonical selfie** (`GuestPhotoAvatar`, guest-avatar.tsx:215 — refcounted texture cache, initials fallback, R2-CORS-graceful) and mount it as the rig's head at distance. **Add a near-camera option**: map the photo as a circular decal on the head sphere's front hemisphere (same cached texture, `polarAngle`-limited sphere segment) so in Play close-ups the face sits *on* the head instead of floating. Photos come from `guests.photo_url` ONLY (never `guest_face_enrollments` — locked), consent-gated upstream, host visibility toggle respected on the public walk. Open item carried from prior art: 0/28 Maria & Jose guests have `photo_url` — the demo shows initials-token heads until seeded (owner question §6).

### 3.9 Ambient life

One `InstancedMesh` per system, all in `kit/ambient.tsx`, all quality-gated and reduced-motion-off:
- **Petals:** ~40 instanced quads, per-instance phase; drift = sin-field, respawn at top. Colors from palette accents.
- **Butterflies (garden/beach archetypes only):** ~6 two-triangle flappers on lazy Lissajous paths.
- **Music notes:** small sprite pool spawning near the dance-floor center when Play mode + (future) Panood/band booth present.
- **Idle motion:** seated figures get `idleSway(id, t)` — ±1.5° torso sway + occasional head turn, per-guest phase from id hash; costs one uniform update per instanced group.

**Budget:** ≤3 extra draw calls total; 'low' tier drops butterflies + notes, halves petals.

---

## 4. Prior Art — reuse or reconcile

| Branch | Status | Action |
|---|---|---|
| `3dplan-realism-pass` (Waves 2a–2c) | **MERGED to main** | Build on it. Do not re-implement lighting/materials. |
| `3dplan-booth-types` | **MERGED** | Reuse BoothMesh silhouettes; extend the generic ones (dessert_station, gift_table, souvenir_table, registration_desk, photo_booth, custom still render block+canopy — cited extension point). |
| `3dplan-booth-logo` | **MERGED** | Reuse BoothSign + `boothCanBrand` tier lock (pro/enterprise only, owner-locked 2026-07-04). Apply the flagged public-RPC `tier` line in the booth slice. |
| `seating-3d-photo-avatars` | **MERGED** | Reuse GuestPhotoAvatar cache verbatim as the rig's face-texture source. |
| `seating-3d-rsvp-furniture` | **Merged everywhere** | Nothing to do. |
| `seating-3d-swap` (tip `a757b508c`) | **Unmerged, SUPERSEDED** — main shipped atomic `swap_seat_assignments`/`swap_table_assignments` RPCs + unique index (20270506562608) with persisted animated swaps | **Do not resurrect. Delete/ignore the branch.** The sit/stand clips from §3.2 later upgrade the swap mover animation. |
| `seatfinding-wayfinding` | **Does not exist** as a remote branch | Nothing to merge; wayfinding signs on main are static posts — out of scope here. |

**Net: no merges, no cherry-picks. Branch from `origin/main` and supersede nothing that shipped.** The only reconciliation is *knowledge*: the stale worktree must not be used as a base, and its file:line cites shift slightly on main.

---

## 5. Build Program — PR-sized slices in dependency order

All slices: repo worktree + PR workflow, `gh pr merge --auto --merge` immediately after create, one `changelog.d/<branch-slug>.md` fragment with `SPEC IMPACT:` line per PR, no direct CHANGELOG/STATUS edits. None of these touch HomeReskin/HomeOverlays/pillars — the demo mounts via the existing `Plan3DSceneLoader` seam only.

### Slice 1 — `3dplan-kit-figures` ★ THE VISIBLE WOW
**Files:** `lib/figure-rig.ts` (+tests), `plan3d/kit/{figure,outfits,hair,face}.tsx`, `kit/index.ts`; swap call sites in `plan3d-scene.tsx` (GuestToken + Walker) and lab `SeatedAvatar`/`Walker`/`CrowdAgent`/`MoverToken`.
**Demoable:** open the homepage — Sims-like articulated people with hair, faces, gowns/suits/barongs/filipinianas seated at every table; the phone walk-in is a walking human with swinging limbs. Lab Play shows the same cast with selfie faces + mood-board attire colors.
**Risk:** draw-call growth on 150-guest rooms — instanced body parts land in this slice or a fast-follow; test on a real phone before merge. Outfit persistence (barong as an explicit per-guest pick) deferred pending owner answer (Q3).

### Slice 2 — `3dplan-sit-animation`
**Files:** `lib/seating-3d.ts` (SeatPose/faceY promotion + tests), `plan3d/instanced-chairs.tsx` (detach-one API), `kit/sit-controller.tsx`; wire at the three swap seams (lab single/crowd, demo walk-complete).
**Demoable:** phone demo — guest walks to their chair, the chair slides back, they turn and sit, the chair tucks in. Lab "walk everyone in" ends with a wave of staggered sit-downs.
**Risk:** faceY math per shape must match drawn chair orientation (the `rotateLocal` parity lock) — the extended unit tests are the guard. Serpentine is the reference implementation.
**Arrival-chain fix (2026-07-08 · `fix/3dplan-arrival-chain`):** live bug — under a starved rAF stream (hidden tab / embedded dev-preview panel delivering frames in bursts) the walk + sit choreography played visually but the demo pill never flipped to "You're at &lt;table&gt;": the Walker's wall-clock `raw` finished the walk on one delivered frame, while the SitController advanced only one phase per frame (pull → step → tuck → ~12 settle frames), so `finish()` → `onSeated` → `onWalkComplete` starved. Fix makes sit-clip completion **wall-clock-owned**: phase hand-offs carry the clock remainder (`advance(next, spentMs)`) and one post-mount frame resolves every phase time already paid for; the Walker's completion one-shot + gait re-arm moved into the frame loop keyed to the walk object (kills a double-fire/stale-fired race in the old passive effect). Choreography timings unchanged; reduced-motion path untouched. Regression guard: `apps/web/tests/e2e/plan3d-arrival.spec.ts` — a real `demo_sessions`-minted e2e that stubs rAF, starves the whole walk, pumps frames by hand, and requires arrival within the pump budget (verified red pre-fix, green post-fix).

### Slice 3 — `3dplan-crowd-avoidance`
**Files:** `lib/seating-3d.ts` (chair discs, spatial hash, predictive `separateAgents` v2 + tests), `kit/agents.ts`, generalize demo `WalkState`→array, lab `Crowd` adoption.
**Demoable:** lab Play crowd flows around each other, around chairs and seated guests, with no clipping; roaming in the demo among moving walkers, they step around you.
**Risk:** feel-tuning (push strengths, lookahead) is subjective — budget a tuning pass; keep the chord-regression guarantee test green. Perf on phone with 24 movers — cap + grid in same PR.

### Slice 4 — `3dplan-booth-menus` (+ seed + RPC line)
**Files:** `kit/booth-card-content.tsx`, `booth-vendor-card.tsx` extension, lab page booth-content fetch (inclusions/package_inclusions/host_inclusions), demo booth fetch via `getSampleEventId`, `scripts/seed-sample-event-maria-jose-content.sql` menu/songlist arrays, `public_venue_scene` `tier` one-liner (**after** verifying v5 prod state — `supabase db push` rules apply; if a new RPC version is needed: `pnpm migration:new`, SECURITY DEFINER pattern; no new tables → no RLS-at-CREATE needed).
**Demoable:** tap the demo's Tagay Mobile Bar → drinks list; tap Hain Catering → plated menu with worth chips; tap Saysay Live Band → songlist. Lab shows the couple's real booked vendors' inclusions.
**Risk:** v5 migration prod state unverified (blocking check, 10 min); centavos-vs-PHP unit lockstep on seed prices; hide-prices lock means real-vendor worth chips render only what vendors authored.

### Slice 5 — `3dplan-mural-emotes-ambient`
**Files:** `lib/dance-mural-texture.ts`, `kit/{emotes,ambient}.tsx`, dance mesh added to demo + guest walk, lab dance plane swap, lab page meal fetch (couple-scoped) for meal emotes.
**Demoable:** the couple's palette painted as a mural on the dance floor across all three surfaces; emote bubbles popping over guests from real RSVP/meal data in the lab; petals drifting, seated guests swaying.
**Risk:** emote noise — cap + rotate; PII: demo/public bubbles stay status-generic (locked posture).

### Slice 6 — `3dplan-cinematic-play`
**Files:** `kit/cinematic.tsx`, `scene-lighting.tsx` (palette-warmth key, string-light instanced bulbs), `package.json` (+`postprocessing`, `@react-three/postprocessing` — **the program's only new dep**), PerformanceMonitor degrade wiring.
**Demoable:** flip lab to Play — depth of field, bloom on string lights, golden-hour grade, dust motes; phone falls back to Tier A grade automatically.
**Risk:** bundle-size CI + build-memory ceiling — dep must stay dynamic-imported in the Play chunk; verify `scripts/check-bundle-size.mjs` passes before enabling auto-merge confidence. If the dep is vetoed, Tier A ships alone from this same branch.

### Slice 7 — `3dplan-kit-unify-guestwalk`
**Files:** `guest-venue-3d.tsx` kit adoption, delete duplicated figure/chair code, resolve stage-color divergence, remove dead `paletteHexes` prop (lab page.tsx:188-189 → lab:112, never used), docs.
**Demoable:** guest venue walk shows the full cast/mural/ambient at 'low' quality tier; codebase has exactly one human figure implementation.
**Risk:** lowest — pure consolidation; regression-watch the anonymization contract (no per-guest attire colors on public walk without Q5 sign-off).

**Schema/migration summary:** the program needs **zero new tables**. Possible migrations: (a) `guests.attire` enum widening if barong/filipiniana become explicit per-guest picks (Q3), (b) a new `public_venue_scene` version for booth tier/menus on the public walk (slice 4). Both follow `pnpm migration:new`; no CREATE TABLE → the RLS-at-CREATE rule isn't triggered; RPC stays SECURITY DEFINER + published-gated.

---

## 6. Risks & Open Questions for the Owner (build-order-changing only)

1. **New dependency for the film look (slice 6).** `postprocessing` is the only way to get true depth-of-field/bloom; it's the program's single new npm dep, dynamic-imported into the Play chunk only. **If vetoed**, slice 6 ships Tier A fakes (grade/fog/emissive/sparkles) and drops ~2 days. Answer changes slice 6 scope, nothing upstream.
2. **`public_venue_scene` v5 prod state.** The fragment for migration `20270510377963` (booth offerings + vendor block on the *public* walk) says it was not applied to prod at write time. If it's missing, slice 4 gains a deploy step and the public-walk booth cards may need to wait a slice. **Verify before slice 4 starts** (10-minute check, but it gates whether guests see menus at launch or only lab/demo do).
3. **Barong/filipiniana persistence.** Ship as a code-derived style (no migration, slice 1) or as an explicit per-guest attire pick (enum migration + guest-list UI touch, moves into its own mini-slice)? Default plan assumes code-derived first.
4. **Meal choice on emote bubbles outside the lab.** Locked PII slice keeps `Plan3DGuest` to name/seat/side. Showing meal emotes on the homepage demo (fictional cast) is safe but widens the slice type; on the public guest walk it should stay off entirely. Confirm "lab-only meal emotes" — if the owner wants them on the demo, slice 5 touches `plan3d-demo-actions.ts`.
5. **Anonymized attire/hair variety on the public guest walk.** Giving anonymous seated figures varied outfits/hair (color-only, no names/photos) technically extends the privacy-scoped RPC payload. Non-PII, but the 2026-06-26 "their table named, rest anonymous" lock should be re-confirmed before slice 7 widens it; otherwise public-walk strangers stay neutral-toned figures.
6. **Sample-event selfies.** 0/28 Maria & Jose guests have `photo_url`, so the wow slice's demo shows initials heads. If the owner wants photographed faces on the homepage, an AI-portrait seeding task (flagged in prior art) should run parallel to slice 1 — it changes what the first demo *looks like*, not the code order.

---
**Non-negotiables carried through every slice:** branch from fresh `origin/main`; seat-plan stays FREE (only ANIMATED_MONOGRAM bloom is paid); one data model with the 2D editor (AS_BUILT §13); per-frame `pushOutOfDiscs` guarantee; `prefers-reduced-motion` completes every flow; frame-rate-independent `damp` smoothing; PII slices minimal; no runtime asset fetches; dynamic `ssr:false` mounts; changelog fragment per PR with SPEC IMPACT, decision-log row at the bottom of `DECISION_LOG.md` for the kit-architecture lock.