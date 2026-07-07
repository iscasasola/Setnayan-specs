# Save-the-Date Reveal — Tuning & Door Spec (2026-06-17)

> **Status: DESIGN SPEC, pending port.** These settings were locked through an interactive 3D-preview design loop (≈17 widget iterations in chat). The reveal CODE in the repo (`apps/web/app/[slug]/_components/reveal/*`) does **not** yet reflect this tuning — it is the design intent for the next port pass (after PR4 content layer). The chat widgets used **procedural canvas/code stand-ins**; the real app wires real assets (see §10).
>
> Supersedes/extends: `0024_ADDENDUM_envelope_open_experience_2026-06-14.md`, `Wax_Seal_Creation_Rules_2026-06-15.md`.

---

## 1. Scope

Four "rigid" reveal templates were tuned here (the full Save-the-Date template library is larger and includes veils etc.; those are not covered by this doc):

1. **Four-flap envelope**
2. **Two-flap envelope · side open** (vertical split)
3. **Two-flap envelope · top open** (horizontal split)
4. **Church doors** (cathedral) — the most-developed template

All are **portrait, mobile-first, full-bleed** (the reveal fills the device screen).

---

## 2. Universal interaction model

- **Trigger, not scrub.** A **two-finger swipe up** *commits* and plays a **choreographed auto-play** open at a fixed pace — it is NOT scrubbed by swipe distance/speed (this fixes fast-swipe "snapping" of the last flap). Swipe down closes.
- **Wax-seal gate (envelopes only).** The couple's **monogram wax seal** must be **flicked/swiped off** the paper before the envelope can open. The flick is **directional + speed-sensitive**: a weak/idle release **drops the seal in place** (it stays, can be picked up again); a strong directional flick sends it flying off. **Church doors have NO seal.**
- **Light parallax.** The key light follows the pointer around its overhead anchor (see §7 light).

---

## 3. Envelope opening (flaps)

- **Each flap gets its own "moment."** Sequential cascade with slight overlap, order **top → right → left → bottom**, each flap **z-staggered** so opposite flaps never intersect mid-lift; the depth-stagger **scales with aspect ratio** so it stays clear on any screen.
- **Open duration: ~6.0s** (console Speed value **22**).
- Last flap **eases smoothly to fully open** (no snap).
- **Gold flap accents** (thin gilt edge trim) — **ON**.
- **Rounded flap tips.** The triangular flap apexes are **rounded, not sharp points** — soften the tip of each flap (round the apex of every flap geometry).
- **Paper texture** on flaps + the card behind.

---

## 4. Church-doors opening

- **Both doors swing open SIMULTANEOUSLY** (no cascade).
- **Slow-in easing** (a "creak" — `smoothstep^1.5`): doors start slowly, then build.
- **Open duration: ~6.0s.**  ⚠ *This replaces the earlier "doors run at 50% of envelope speed" rule — the owner now wants doors and envelope BOTH at ~6.0s.* (Console currently halves door speed; remove that so doors honor 6.0s directly.)
- **Door height = 80% of screen height.** Gothic pointed arch peaking at the **center seam**.
- **Bottom strip = church INTERIOR FLOOR with a RED CARPET** (color **customizable** by the couple) — NOT a wall/gap. (Previously the bottom 5% showed stone wall; that was wrong.)
- **Behind the doors = the church interior reveal** (dark interior, **red-carpet aisle** receding inward), NOT an outside garden/sky. (Earlier "outside scene" backdrop is replaced for cathedral by the interior.)
- **Couple's monogram carved into the wood, split across the seam** — the carving reads as one mark when closed and **splits apart as the doors open**. Same mark as the wax seal / cipher studio (existing platform object).
- **Carved stone gothic arch surround** (archivolt) with rosette/floral carvings.
- **Rose window** above the doorway.
- **Stone steps** at the base.

### 4a. Door style reference (owner photo, 2026-06-17)

Follow the supplied photograph of a real cathedral entrance:

- **Pointed gothic (lancet/ogee) arch**, two wooden plank doors with **arched tops**.
- **Vertical wood planks** with a **curved arched brace** following the arch line.
- **Black iron studs/nails** in a grid pattern along the borders and braces.
- **Black iron ring-pull handle** (on the leading/left door).
- **Carved pale-grey stone** gothic arch surround with **rosette/flower carvings** in the archivolt and capitals.
- **Stone steps** leading up to the doors.
- Palette: warm **honey-oak** wood · dark **iron** · pale **grey stone**.

(The carved couple's monogram is embedded *into* this plank-door style; both coexist.)

---

## 5. Effects

### Door reveal effect
- **ROSE PETALS ONLY.** ❌ **Snow REMOVED. Smoke/Fog REMOVED.**
- Petals fall **calm + feather-like** — slow, gentle, high air-resistance flutter (like a falling feather), NOT a quick drop.
- Petals **pile up** on the floor / red carpet (Floor mode = **Pile up**).
- **Petal size = 22** (console).

### Envelope effect
- **BUTTERFLIES.** **Size = 20** (console).
- Butterflies **fly TOWARD the screen** (toward the camera — grow as they approach) and **exit out ALL corners/edges** of the screen (disperse to all four corners), NOT just rise-and-exit-the-top. ⟵ *to build*
- Butterflies **cast shadows**, flap their wings, and emerge **staggered** as the envelope opens.
- *(Alternative envelope effect available but not chosen: rose petals falling from the top of the screen, landing on the card, piling, bouncing, pushing neighbours, casting shadows.)*

### Shadows
- Petals **and** butterflies are **lit, shadow-casting** meshes; soft shadow sits offset while airborne and **converges underneath as it settles**. Butterfly shadows sweep across the surface.

---

## 6. Pile-up physics (studied)

Petals do **not** form tall chunky heaps; model them as:
- **Flutter, not vertical** — tumble + x-sway on the way down.
- **Angle of repose** — on landing a petal **rolls to the lowest neighbouring column**, so the pile spreads into a natural low mound (no spikes — this was the v24 problem).
- **Dense low carpet** — each petal raises the surface only a fraction of its own height → loose, scattered, overlapping layer.
- **Small bounce + neighbour nudge** on impact.

---

## 7. Locked numeric settings (2026-06-17)

| Control | Locked value | Notes |
|---|---|---|
| **Envelope open** | **6.0s** | console Speed **22** |
| **Cathedral door open** | **6.0s** | both same; half-speed rule retired |
| Smoothness | **TBD** (default 50) | not locked this round |
| **Petal size** | **22** | calm feather fall |
| **Butterfly size** | **20** | fly-to-screen + all-corner exit |
| Snow / Fog | **removed** | — |
| **Light · Diameter** | **6** | shadow softness/radius |
| **Light · Diffusion** | **100** | penumbra + ambient fill |
| **Light · Brightness** | **40** | key intensity |
| Floor | **Pile up** | on red carpet |
| Flap accents | **On** | gold edge trim (envelope) |

### Console size → world mappings (for the port)
- `petalSize = 0.006 + (val/100)*0.05`  → 22 ≈ **0.017**
- `bflySize  = 0.05  + (val/100)*0.14`  → 20 ≈ **0.078**
- `snowSize  = 0.012 + (val/100)*0.06`  (removed)
- `openSpeed os = 0.001 + (Speed/100)*0.008`; full-open seconds = `1/os/60`. Speed 22 → os 0.00276 → **6.0s**.
- Light: Diameter→`shadow.radius`; Diffusion→`spot.penumbra = v/100` + `hemi.intensity = 0.4 + v/100*0.9`; Brightness→`spot.intensity = 0.6 + v/100*1.8`.
- Overhead softbox: spot anchor ≈ `(0, 0.82, 2.3)`, parallax `Rx 0.6 / Ry 0.3`, VSM shadow map.

---

## 8. Customization vs author-time (owner ruling)

- **Couple-facing taste choices ONLY:** template, effect (butterflies / petals), **red-carpet colour**, and their **own monogram/mark** (the cipher/seal). These are curate-don't-configure.
- **Author-time house defaults (baked, admin-tunable, NOT couple sliders):** Speed, Smoothness, all sizes, light Diameter/Diffusion/Brightness, pile/fall, accents. *(Owner: "set what I like." The tuning console's sliders are an authoring instrument, not a product feature.)*

---

## 9. Realism / asset plan (owner-confirmed)

The chat widget is a **motion/composition tool** — everything in it is painted procedurally in code so it can run inline with zero external files. The **behaviour/physics/timing carry over exactly**; only surface fidelity jumps when ported:

| Widget stand-in | Real app asset |
|---|---|
| Painted ellipse petals | Real photographic rose-petal cutouts (translucent, veined, multi-shape) |
| Flat triangle butterflies | Illustrated/animated butterfly sprites |
| Generated block stone | Real ashlar-stone scan + normal/roughness maps |
| Procedural wood | Real honey-oak texture + iron studs |
| Drawn "A & J" monogram | Real engraving of **the couple's** mark |
| Painted rose window | Real stained-glass rose window |
| Painted backdrop | Real church-interior backdrop (red-carpet aisle) |

Pipeline: `reveal-textures.ts` + `build-reveal-textures.mjs` + R2-hosted maps + Recraft/commissioned art.

---

## 10. Build status (PRs)

- ✅ PR1 — rigid reveals: swipe-the-seal + monogram wax seal + momentum (merged)
- ✅ PR2 — candle stamp maker / wax-seal minting (merged)
- ✅ PR3a — 3D WebGL scene + lighting (merged)
- ✅ PR3b — paper/liner TRUE-TEXTURE maps (merged, #1621)
- ✅ **Port A — reveal shell** (PR #1636): cathedral doors (plank + studs + ring + stone surround + rose window + carved split monogram + red-carpet interior), softbox light 6/100/40, rounded four-flap tips, 6.0s triggered open, doors slow-in + simultaneous. Wired across the whole rigid family (four-flap routes through `RigidFlaps` too).
- ✅ **Port B — effects** (PR #1636): feather-fall petals + angle-of-repose pile + shadows (doors); butterflies fly-to-screen + all-corner exit + shadows (envelopes); snow/fog dropped; sizes 22/20.
- ✅ **Real-asset pass** (PR #1636): Recraft-generated + processed textures in `public/reveal/assets/` — studded oak doors, ashlar stone wall, stained-glass rose window (circle-masked), candlelit red-carpet aisle interior, alpha-keyed petal + butterfly sprites. Loaded async over the procedural stand-ins (which remain as the fallback). _Still procedural:_ the couple's carved monogram (it's their own mark, drawn from `monogramText`). _Dormant:_ `--color-carpet` (carpet colour now baked into the aisle photo — needs a recolour pass to re-enable).
- ⬜ **PR4 — content layer** (NEXT — undesigned; needs an owner design pass, §12)
- ⬜ Per-event template chooser + go-live (currently flag/`?reveal=` gated) — product decision
- ⬜ Veil polish (veil-sheer/veil-crown already shipped; curtain "Veil C" later)

---

## 11. Open items to confirm / build

- Smoothness value (default 50).
- Confirm doors = exactly 6.0s (same as envelope) — half-speed rule retired here.
- Church-interior backdrop detail: altar/glow at the far end of the aisle?
- Build the butterfly **fly-to-screen + all-corner exit** choreography.
- Build the photo-accurate plank-door + iron-stud + stone-rosette-surround style.
- Red-carpet colour customization control (couple-facing).

---

## 12. Next phase — content layer (PR4)

After the reveal opens, design what lives on the Save-the-Date page: couple's **names**, **date**, **venue**, their **story**, **photo/video**, the **RSVP hook**, and how it **scroll-reveals** once the doors/flaps part. This is the substance of the page and the agreed next design step.
