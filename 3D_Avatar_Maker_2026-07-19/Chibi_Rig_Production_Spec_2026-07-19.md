# Chibi Rig — Production Spec

**Date:** 2026-07-19 · **Status:** BUILD-READY SPEC — owner approved the direction (chibi, from the 5-way lineup) with directives: better craft · male + female · more customization · solid bodies · more lovable. Open items in §9.
**Reference build:** [`chibi_maker_prototype.html`](chibi_maker_prototype.html) (verified 2026-07-19) — the geometry, catalogs, and idle in that file are the visual contract.
**Supersedes:** the 2026-07-09 one-piece blob (`kit/figure.tsx` current body) for ALL 3D-Plan figures, per DECISION_LOG 2026-07-19 (reversal + pick rows). Faceless is retained — `photoUrl` selfie disc stays the only face.
**Working model:** this spec = the plan (Fable); the Opus build session grounds it reuse-first against the live kit and may adjust numbers, not intent.

## 1 · What ships

One new character system — the **chibi** — replacing the blob everywhere a figure renders: homepage demo, couple seating lab, public guest venue walk, instanced seated crowd, dance floor, walkers, and booth STAFF (staff = the garment-dressed chibi). Two bodies (female/male), part-based customization, solid geometry, charm idle.

## 2 · Rig geometry (from the prototype — the visual contract)

Proportions (metres at figure scale 1; ~1.9 heads tall):

| Part | Spec |
|---|---|
| Head | sphere r **0.34**, scaled (1, 0.93, 0.97), centre y **1.06**; soft ears r 0.055 at ±x·0.96·r |
| Body | closed lathe, y ≈ 0.10 → 0.74; silhouette per outfit (§4) |
| Arms | capsule r 0.062 · len 0.13, shoulder pivot (±0.265, 0.56), z-rot ±0.62; mitten sphere hands r 0.072 |
| Legs/feet | skin stub capsules r 0.07 where the outfit exposes them; bean shoes r 0.095 scaled (0.95, 0.62, 1.35) |
| Idle | whole-figure bounce: scale.y 1±0.018 @ ~2.2 rad/s (squash-stretch inverse on xz), lift max 0.012; head tilt z ±0.06 @ 0.7, look-around y ±0.14 @ 0.4; per-figure phase offset from the id hash (the existing idleSway convention) |

**Hard rules carried from the prototype:**
- **Closed-lathe law:** every lathe profile is forced to touch the axis at BOTH ends (`closedLathe`) + all figure materials `DoubleSide`. This is structural — the transparency bug the owner rejected cannot recur. Add a unit test that walks every figure geometry and asserts watertight profiles.
- **Faceless:** no eyes/mouth ever; `photoUrl` mounts the existing `GuestPhotoAvatar` billboard REPLACING the head sphere (disc radius scales to the 0.34 head). Same replace-not-overlay depth rule as today.
- **Scale vs furniture (owner call, §9.1):** recommend figure scale ≈ **1.0 → ~1.06 m tall** against product-true furniture (0.46 m seats, 0.74 m tables) — heads clear tabletops, seated legs dangle (charming, intended). The alternative (scale ~1.3 to read adult) loses the chibi charm; do not do it silently.

## 3 · Part catalogs (FigureSpec v2)

Extend `lib/figure-rig.ts` (the dormant look system is the base — re-activate, don't re-invent):

```
bodyType:  'female' | 'male'                    // NEW — avatar body pick
skinTone:  SKIN_TONES[6]                        // existing table, unchanged
hairStyle: 0..7                                 // HAIR_STYLE_COUNT 6 → 8
           (crop · side · spiky · curly · bob · buns · pony · long)
hairColor: HAIR_COLORS 4 → 6 (+ '#8a8a92' silver, '#b98a2f' gold)
outfit:    per-body pools (§4) + the 5 staff garments (chef_whites/apron/vest/uniform/robe)
outfitColor: curated 8 (sage/champagne/blush/sky/navy/wine/gold/ivory)
accessory: 'none' | 'flower' | 'bow' | 'cap'    // NEW
```

`resolveFigureLook` keeps hash-derived defaults (id-stable crowds stay varied for free); explicit spec wins.

**⚠ Privacy fence:** `bodyType` is an AVATAR COSMETIC ("Body" in UI). It is never read from, written to, or inferred from `users.sex` (SPI, `sex_consent_at` pattern) — no join between the two, ever. Avatar parts persist as ordinary preference data: `users.avatar_parts` JSONB (account-level) consumed by the guest sheet's FigureSpec hook; guests without accounts fall back to hash defaults.

## 4 · Outfits

| Body | Outfit | Geometry notes (prototype-proven) |
|---|---|---|
| F | Dress | A-line closed lathe |
| F | Filipiniana | dress lathe + butterfly-sleeve spheres r 0.095 scaled (0.6, 0.9, 0.5), z-rot ±0.35, at (±0.235, 0.66) + gold waist band |
| F | Tee + Skirt | two-tone: tee lathe (outfitColor) + skirt lathe (darkened 0.72) |
| M | Tee + Shorts | tee lathe + shorts lathe (darkened 0.6), exposed stub legs |
| M | Barong | ivory `#f4efdf` shirt lathe + collar torus + placket box + `#2e2c33` trousers |
| M | Suit | jacket lathe + ivory shirt-V cone + tie sphere + darkened trousers |
| both | Staff garments ×5 | garment colour/texture on the body lathe (port `staffGarmentTexture` canvas details), trouser-darkened lower; booth staff = the vendor's own avatar wearing these (council Q3, unchanged) |

## 5 · Poses

Re-author the pose vocabulary on the chibi joints (head, 2 shoulders, body-lean; chibi has no knees/elbows — poses simplify):
- **stand** = the idle above · **walk/run** = waddle: body roll z ±, bounce amplified, arms swing from the shoulder only · **sit** = hips to seat, legs dangle (new sit bake) · **dance** + **staff idles** = port the existing pure clips in `lib/figure-rig` to the reduced joint set (tamp/shake/present/wave/snap/headBob/cardFlip/brushDab/boxPass survive with shoulder+head+bounce only — a chibi barista frozen mid-tamp still reads).
All clips stay pure functions in `figure-rig` (unit-tested), applied by the renderer — the existing architecture, reduced joint set.

## 6 · Instanced crowd re-cost (the perf contract)

Chibi is the cheapest crowd of the five lineup candidates, but variation moves from "tint-only" to "parts," so the batch key changes:

- One `InstancedMesh` per **part geometry**: head+ears (skin via instanceColor) · 8 hair-style buffers (hairColor via instanceColor) · body-per-outfit buffers (outfitColor via instanceColor; two-tone outfits = 2 buffers) · arm/hand/shoe shared buffers · accessories (3 buffers).
- Seated-crowd draw count ≈ **~30 batches for the whole room** regardless of guest count (vs ~21 single-variant batches today; vs 12–22 draws PER FIGURE unbatched). Accept the delta; quality-'low' keeps the same shadow/motion exclusions as today.
- **Pixel-identity guarantee carries over:** extend `figure-sit-bake` to extract per-(part × outfit × hairStyle) baked locals; the bake test asserts instanced output is pixel-identical to the individual `<Figure>` per combination class. This test is the merge gate for the crowd PR.

## 7 · Photo→avatar (owner-locked ₱0 on-device, DECISION_LOG 2026-07-19)

Unchanged pipeline, now with real targets: on-device extraction maps to `outfitColor` (dominant-colour, shipped in the venue-makers prototype incl. the hue-aware snap fix), and later `skinTone` (6-bucket) + `hairStyle` length bucket via on-device segmentation. Gates unchanged: consent tap · 18+/Alaga hard-block · notice line + ROPA row · DPO classification riding the open counsel packet. Never uploaded, never stored, ₱0 forever.

## 8 · Rollout (phased PRs, each with changelog.d fragment)

1. **PR-1 · kit chibi figure** — `kit/chibi-figure.tsx` + catalogs behind `NEXT_PUBLIC_FIGURE_CHIBI` (default off); homepage demo renders it flag-on. Closed-lathe unit test lands here.
2. **PR-2 · poses** — waddle/sit/dance/staff clips on the reduced joint set; SitController handoff parity.
3. **PR-3 · instanced crowd** — part-batched crowd + extended pixel-identity bake test (merge gate).
4. **PR-4 · avatar maker** — the guest 3-tap sheet on `/[slug]/venue` (council P3; depends on the P0 doorway fix) + `users.avatar_parts` JSONB + account-level maker entry; photo→tint rides here behind its consent tap.
5. **PR-5 · booth staff** — garment pool on the chibi, vendor avatar carry-over; retire the blob staff.
6. **PR-6 · default flip** — `NEXT_PUBLIC_FIGURE_CHIBI` on, blob code deleted (no "Classic" fallback — one character system; owner confirm §9.3).

## 9 · Owner sign-offs before/at PR-6

1. **Scale vs furniture** (§2): ~1.06 m chibi against true furniture (recommended) vs scaled-up.
2. **Accessories free vs SKU:** recommend free at launch (lovability is the product); creator-economy accessory drops are a later fork.
3. **Blob deletion** at PR-6 (recommended) vs kept as a hidden fallback.
4. **Fun hair colours** (silver/gold) in or out for V1.
5. (Standing) faces stay OFF unless the owner explicitly unlocks facial features — this spec does not include them.

## 10 · V4 appendix (owner directives, 2026-07-19 evening — supersedes §3/§4 catalogs)

- **Faces are IN** (retires §9.5): nose always-on (skin darkened ×0.88 — the front-facing cue), eyes ×4, mouths ×4, beauty marks ×4, bald. Selfie disc demoted to an option. Face parts join FigureSpec (`eyes`, `mouth`, `mark`); hair-cap geometry must keep rims ABOVE the brow line (V4 bug class: caps hiding eyes).
- **Wardrobe** (supersedes §4): one-piece dresses (wedding/ball gown/day/cocktail/red-carpet; wedding paintable, applied-default white) + tops ×10 (tee/blouse/filipiniana/barong/polo/suit/3-piece/tux/smart-casual/hoodie) + bottoms ×5 + accessories ×6 (adds specs, headband). One-piece and top+bottom are mutually exclusive slots.
- **Colour modes** on the avatar record: `auto` (room derives from mood-board palette — crowd stays palette-harmonized) · `custom` (curated swatches) · `paint` (per-part colour incl. shoes; 12-brush palette). Instancing note: paint mode widens per-instance colour variety but stays within instanceColor — no new batches.
- **Live shared room** (extends §6): 200 simultaneous movers = rendering already covered by part-batched instancing; networking = clients ~8Hz position up, server-aggregated room frames broadcast at 3–5Hz, client interpolation via the shared damp() convention; naive per-client fan-out is out of budget. Applies to the slice-8 shared-room build.
- Reference build: `chibi_studio_prototype.html` (verified 2026-07-19).

## 11 · V5 appendix — SEAMLESS SILHOUETTE (owner directive, 2026-07-21)

> **Owner:** *"we do not want the round circle on joints. we want them to look clean and not part by part."*

**Diagnosis: the circles come from parts ABUTTING, not from part-based construction.** §2's junctions touch rather than overlap:
- **Head bottom lands at y ≈ 0.74; body top is 0.74** — they meet exactly. A seam by construction.
- **Mitten sphere hands r 0.072 on capsule arms r 0.062** — a wider sphere on a narrower capsule reads as a ball joint.
- **Shoulder pivot (±0.265, 0.56)** leaves the arm capsule's cap exposed outside the body lathe.
- **Bean shoes on stub capsules** — same pattern.

**🔑 THE FIX IS TO CHANGE THE GEOMETRY, NOT TO OVERLAP PARTS (owner correction, 2026-07-21).**

> ⚠ **An earlier draft of this section said "overlap, not merging" and was WRONG** — it conflated two different merges. Merging the WHOLE FIGURE per look-combination would indeed explode the batch count (bodyType × outfit × hair × accessory × colour-mode). **Redesigning the PART geometry so each part conceals its own junction costs nothing**, because §6 already instances **one body buffer per outfit** — making that buffer a better shape is free.

**Overlap was hiding a fudge. Author the parts so there is nothing to hide.**

### 11.1 Part-geometry changes

| Part | Today | Becomes |
|---|---|---|
| **Body + ARMS + legs** | Lathe torso; arms stuck on at a pivot; separate mitten hands and bean shoes | **ONE geometry.** Integral neck; **arms are part of the silhouette — NO shoulder joint, no shoulder bulge** (owner 2026-07-21: *"no need for shoulder"*); hands are the arms' own rounded ends; shoes are the legs' |
| **Head** | Separate | **Stays separate** — it must tilt and look around independently (§2 idle) — and seats into the integral neck |
| Ears | Spheres at ±x·0.96·r | Already mostly embedded; fold into the head geometry |

**⚠ THE COST — §5's staff idles are mostly ARM gestures.** With no arm joint, `tamp · shake · present · wave · snap · cardFlip · brushDab · boxPass` lose their gesture; only `headBob` survives intact. A chibi barista frozen mid-tamp is what made booth staff read as *doing their job*, so this is a real loss, not a rounding error.

**✅ THE FIX — separate the crowd from the staff:**

| | Poses | How |
|---|---|---|
| **Crowd** (200 figures, INSTANCED) | stand · sit · waddle | Body roll + bounce + head tilt only. **No arms needed** — this is where the batch budget lives, and it gets simpler. |
| **Staff** (a handful, INDIVIDUAL meshes) | the 9 idles | **Pose-variant body geometry** — arms-down / arms-forward / arms-up authored into the shape, swapped per clip |

Staff figures are not instanced and there are only a few per room, so they can afford variant geometry that the crowd never pays for. **The 200-figure path keeps zero joints; the gestures survive where they are actually seen.**

**✅ BATCH COUNT UNCHANGED.** Same one-buffer-per-part-geometry instancing, same ~30 batches for the whole room (§6). The clean silhouette is structural, not paid for in draws.

**Authoring cost is near-zero:** §6 already specifies "body-per-outfit buffers", so the count of authored geometries does not change — only their shape does.

### 11.2 The no-exposed-cap law (hard rule + merge gate)

**Supersedes the "overlap law" of the earlier draft**, which policed a fudge rather than the real invariant.

**Rule:** no part may terminate in a **visible end-face outside its parent's surface**. That is a property of the AUTHORED GEOMETRY, which is where the invariant belongs — a repositioning test would pass on a badly-shaped part that happens to be shoved inside another.

Materials must still match across a junction: an `instanceColor` mismatch reintroduces the ring even when the geometry is correct.

**Unit test:** walk every figure geometry and assert no exposed terminal cap. **Merge gate on the chibi PRs**, exactly as the closed-lathe test gates the transparency bug class the owner already rejected once. Without it this regresses the first time someone re-tunes proportions.

### 11.4 Maker UX — ONE chibi, transformed in place (owner 2026-07-21)

> **Owner:** *"avatar maker should be only 1 chibi. and we transform there just like in games when they create their characters."*

**A game character-creator, not a picker.** ONE figure, centre stage, on a turntable. Every choice applies to **that same figure, live** — no lineup to choose from, no grid of variants, no apply/confirm step. You are dressing your own avatar, not shopping.

- **Options live in side panels grouped by subject** — Body · Face · Hair · Outfit · Colour. Tabs are correct HERE (the council's "scene is the nav" grammar governs the VENUE, where subjects are objects in the room; in a maker the avatar IS the single subject, so tabs *within* it are exactly the sanctioned pattern, max 3–4 per group).
- **Instant swap, no commit button.** State persists to `users.avatar_parts` on change (debounced).
- **The catalog prototype (`chibi_catalog_prototype.html`) is an AUTHORING reference, not the UX.** It lays out many figures so parts can be compared while building them; the shipped maker never shows more than one.

**⚡ TECHNICAL CONSEQUENCE — the maker figure is NOT instanced, so it is not on the crowd's budget.** One figure at high fidelity can afford more lathe/geometry segments, better materials, a real shadow and a nicer environment than a crowd member ever can. **Crowd and maker are the same DESIGN at two LODs**; only the crowd pays §6's batch contract. Do not let the crowd's constraints flatten the maker, and do not let the maker's fidelity leak into the crowd buffers.

**Two entry points, one figure, one record:**
- **Account-level maker** — the full creator (all panels).
- **Guest 3-tap sheet** on the venue walk (council P3) — a FAST SUBSET of the same surface: body · outfit · done, or a row of presets. Same `users.avatar_parts` record, same figure, fewer decisions. It is a shortcut into the maker, never a second maker.

### 11.3 Ordering

Land the geometry work in **PR-1** (`kit/chibi-figure.tsx`), not later — every downstream PR (poses, instanced crowd, bake tests, staff garments) inherits it, and the pixel-identity bake test in PR-3 would otherwise be gating the *wrong* silhouette. Re-shaping the body buffers after the crowd bake exists means re-baking every combination.

**§2's proportions table is the OLD part breakdown** (sphere head · lathe body · capsule arms · mitten hands · bean shoes). Read it as the target *silhouette and scale*, not as the part list — PR-1 re-authors those into the integral geometries above. The closed-lathe law and the scale-vs-furniture call (§9.1) are unaffected.

**§5's joint set is likewise superseded.** With arms in the body, `JOINTS` reduces to **head + body-lean/roll** for the crowd. PR-2 re-authors walk/run/sit/dance against that reduced set and moves the staff idles onto pose-variant geometry (§11.1). The pure-function-in-`figure-rig`, applied-by-the-renderer architecture is unchanged — only the joint list shrinks.

### 11.4 ✅ Resolved by this spec — the "mannequin identity fork" is CLOSED

§10 (V4) put **faces IN** (nose always-on, eyes ×4, mouths ×4, marks ×4), superseding both §9.5 and the older matte-white featureless mannequin direction. Any doc still describing figures as "featureless mannequins" or listing the identity fork as open is **stale** — including earlier passages of `3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`, corrected 2026-07-21.
