# Veil Reveal — Final Spec & Locked Settings (2026-06-17)

> **Status: DESIGN LOCKED · ✅ PORTED 2026-06-17 (PR [#1671](https://github.com/iscasasola/setnayan-platform/pull/1671), auto-merge).** Tuned through a 47-iteration interactive 3D-preview (`show_widget`) loop with the owner on 2026-06-17, then ported into the app at `apps/web/app/[slug]/_components/reveal/veil-reveal.tsx`. This is the canonical record of the **sheer bridal-veil reveal** for the Save-the-Date page. The port is **flag-gated** (`NEXT_PUBLIC_STD_REVEAL=1` or per-visit `?reveal=veil-sheer`) until the per-event template chooser ships.
>
> **🎯 CANONICAL REFERENCE IMPLEMENTATION → [`0024_Veil_Reveal_Prototype_2026-06-17.html`](./0024_Veil_Reveal_Prototype_2026-06-17.html)** — the exact, owner-approved final widget (build `veil_lower_shakes_petals`, iteration #47). Open it in a browser to see/feel the locked behaviour. **The port translates THIS file** — it is the ground truth; this `.md` is the human-readable index of why each number is what it is. If the two ever disagree, the `.html` wins (it's what the owner signed off). The on-screen sliders are an authoring panel; bake the §6 LOCKED SETTINGS and ship the canvas + script only.
>
> Companion: `0024_Reveal_Tuning_and_Door_Spec_2026-06-17.md` (the rigid door/envelope reveals). This doc is the VEIL (organic) reveal only.

---

## 1. What it is

The trademark Setnayan veil reveal: a real-time **WebGL Verlet cloth simulation** of a sheer tulle veil draped over the invitation card on a transparent full-screen canvas. The guest lifts the veil off (swipe / double-tap) to reveal the card beneath. Portrait, mobile-first, full-bleed; rotation-safe.

The chat widget uses **procedural canvas stand-ins**; the behaviour/physics/timing port **exactly**. The real app wires the real tulle material + the couple's logo.

---

## 2. Interaction model (all gestures)

| Gesture | Effect |
|---|---|
| **Resting** | The veil hangs from the top edge, draping over the card; hem ends ~5% from the bottom (`Reaches`). Subtle hem-weighted wind; near-still crown. |
| **Tap-and-pull (hold)** | Grab any point → the fabric goes **taut and HOLDS** (inextensible). The grabbed spot lags your finger; folds/bends locally; springs back on release. **It must NOT stretch like rubber** (hard strain limit, §3). |
| **Swipe UP** | Lifts/folds the veil away to reveal (the fold, §4). |
| **Swipe DOWN** | **Pulls the veil back down** over the card (reversible). |
| **Double-tap** | Auto-plays the reveal hands-free (for anyone who can't swipe) — mimics **two hands grabbing both ends and swiping up**. |
| **Two-finger drag up** (mobile) | Same gather/lift as swipe-up. |
| **Device tilt / rotate** | **The reveal is orientation-LOCKED** — portrait on mobile, landscape on desktop; tilting does NOT reflow it during the reveal (see Content spec §4b). _(The widget's `Rotate` button + re-tile is a tuning tool; the fixed-px logo tiling stays stretch-safe whenever the stage genuinely resizes — e.g. desktop window resize.)_ |

**On-screen instruction (accessibility · owner 2026-06-20 "the text at the bottom should be visible so old people can understand the app").** A bottom-centered hint reads **"Lift the veil ↑"** with a second line **"or double-tap to lift it for you"**. It must be **legible for older guests**: ≥16px primary / ≥14px secondary, full-contrast cream on a **soft dark scrim pill** (so it never washes out on a light/ivory veil), positioned clear of the home-indicator safe area. It fades out once the veil is lifted. Implemented in `reveal-overlay.tsx` (veil branch).

---

## 3. The cloth physics (the resting veil)

- **Verlet grid** (~66×50), pinned along the **crown** (top edge, just above screen). Distance constraints (horizontal + vertical + diagonal), 6 solver iterations.
- **Flat crown → blooming folds.** The crown is pinned FLAT (no fold at the very top); each row carries **extra fullness that grows toward the hem** (`rowDx = pinW·(1+Fullness·env(rf))`, `env=0.16+0.84·rf^1.5`) so vertical folds **bloom from ~0 at the crown to full at the hem**. Folds are PHYSICS, not a painted sine.
- **Gravity drop.** The veil falls under real gravity (`Weight`); light = floaty, heavy = falls straight. `Drop again` replays the fall.
- **Wind = HEM-WEIGHTED.** Envelope `we = rf²·(0.35+0.65·rf)` → crown near-still, hem catches the drift. `Wind` dial.
- **HARD STRAIN LIMIT (inextensible — the "no rubber" rule).** After the normal constraint solve, a dedicated **clamp pass (4 iters) caps EVERY edge to `rest·1.012` (1.2% max stretch)**. This is what makes a tap-and-pull hold taut instead of stretching — the grabbed point lags the finger. A soft strain-ramp alone was NOT enough; this hard Provot-style cap is required.
- **Material:** sheer ivory tulle (`#f3ece1`), double-sided, `roughness 0.8`, fresnel sheen (whiter/more opaque where it folds away). **No gold emissive** (the logo is white, §5).
- **Lighting:** raking warm spot + warm rim + low hemi, so folds catch highlight/shadow (drama is ~50% light).

---

## 4. The reveal fold (the "paid drama")

The fold is **SIM-DRIVEN / trailing cloth — NEVER a rigid rotation.** Owner principle: *"the fabric must trail and not be a rigid material; it follows and bends on the trail direction just like when we pinch the fabric."*

- The **hem** is pulled along a path; the rest of the cloth **TRAILS + bends behind it** (Verlet inertia + constraint lag). `Trail` = pull strength (lower = looser/laggier follow).
- **Two-end-led:** the pull is weighted to the **two bottom corners** (`endW = max(0, 1−min(fx,1−fx)/0.3)`) so the ends lead and the fabric trails between — **two hands grabbing both ends and swiping up**. NO initial "toward-you" lunge.
- **Only the FOLD occupies the top ~`Top-valance%`; the END goes OFF-screen, not parked at the line.** The hem is pulled **up past the top edge** (`hy = topPin + vh·hemUp·lift`, `hemUp = max(0.2, clothH/vh − 4·Valance%)`) so the bulk trails up & away above and only the shallow fold-loop droops into view. The **droop (the hanging part of the fold) IS the `Top-valance%`.** Parking the hem AT the line (a prior bug) crammed the whole sheet into the band = a rubber-band wad — rejected.
- **Float keeps it high:** gravity is floated down during the fold (`g·(1−Float·0.92·le)`, `Float` dial) so the fold stays in the top band instead of drooping back over the card.
- **Feather settle:** the auto-reveal eases over `Feather` seconds with reduced gravity (gentle float into form).
- **Reversible (at the canvas):** swipe down → `setLift(0)` → gravity returns, the veil drops back over the card. **⚠ LIVE-PAGE MODEL 2026-06-19 (owner: "I still want the veil accessible but also want to navigate the messages") — SPATIAL GRAB-ZONE (PR-V, supersedes the PR-S "retire two-way" note):** the canvas renders full-screen but captures input only in a **grab-zone** that tracks `lift` — **full-screen while the veil COVERS** the page (grab anywhere to lift), shrinking to the **top valance band (`24vh`) once LIFTED**. So swipes in the top band grab/re-cover the veil (two-way RESTORED); swipes over the body fall through to the film (z-50) and **scrub the messages**. The wrapper is `pointer-events-none`; only the grab-zone is `pointer-events:auto`. (The mute toggle moved to bottom-right to clear the top band.) See `DECISION_LOG.md` 2026-06-19 (PR-V).

> ⚠ A full screen-covering veil has ~15× too much fabric to gather neatly into a 10% band — so we DON'T gather/compress (rubber); we keep the fold sliver and trail the bulk off the top.

---

## 5. The logo (the only pattern)

- **One motif only = the couple's / Setnayan mark** (`MARK_PATH` SVG, already in `veil-shared.ts`). Flower/star/filigree motifs are REMOVED.
- **WHITE, not gold; no emissive glow** — a subtle woven monogram.
- **SPARSE** — *"a logo, then the next far away; don't bombard the veil; most veils don't have a logo."* One small mark per **large** fixed-pixel tile (the tile = the GAP between marks). The veil is mostly plain with the occasional mark.
- **Fixed-pixel tiling (no stretch on rotation):** `repeat = (clothW/2vw)·W / LogoGapPx` keeps the tile exactly `LogoGapPx` square on **any** aspect → rotating ADDS marks (more fabric), rotating back gives the right count; the mark never stretches. Enforced by a **ResizeObserver** on the canvas (cheap `renderer.setSize`+`setRepeat` immediately, debounced full rebuild) — the root rotation-stretch bug was the WebGL buffer not re-fitting its container.
- Faint tulle weave stays as the fabric base (not a "pattern").

---

## 5b. Falling petals (added 2026-06-17)

Rose petals fall over the reveal (`Petals` dial = density; 0 = none). **TIMING (owner 2026-06-17): petals START falling when the veil is UP (revealed) and CONTINUE** — none during the covered state; the reveal triggers the shower, and it keeps going while revealed. **Petal COLOUR is couple-customizable** (see the Content & Customization spec). **Four mixed behaviours** (owner: *"some can cling on to the veil and when they get hit, falls also; some petals can fall like a feather; some can rotate; some can just fall"*):

- **Cling** (~30%): start **resting on the veil surface** (attached to a cloth vertex, following it). When that vertex's speed exceeds a threshold — the veil is **hit** (tapped/grabbed), folds, or gusts — the petal **detaches and falls** (as a feather). During the reveal fold, the clingers shower off. After leaving screen, re-attach to a new vertex.
- **Veil DOWN → ALL clinging petals shake loose (owner 2026-06-17):** when the veil is **lowered** (swipe-down · drag the slider down · the auto reversing back over the card), the downward movement **detaches every clinging petal** so they **cascade off and fall** as the veil descends. (Implemented by detecting `lift` decreasing → a short `shakeFrames` window in which clingers detach regardless of the usual speed threshold.)
- **Feather**: low gravity + high air-drag + sway + slow tumble (rotates on its long axis) → gentle flutter.
- **Rotate**: faster fall, **spins** on its face/axis as it drops.
- **Straight**: just falls, minimal sway, slow turn.

**Density: owner wants A LOT — default `Petals` = 100 (max).** **Tap-to-bounce (owner 2026-06-17): a quick tap on a falling petal BATS IT AWAY** — it gets a velocity away from the touch point + upward, switches to a fast tumble, then feathers back down. (Distance-based hit test in screen space; a tap near a petal bounces the nearest; swipes/holds don't bounce; the tap still feeds the double-tap reveal.) Implemented as an **InstancedMesh** (100 petals, one draw call) with per-petal type/velocity/rotation/size and per-instance colour (blush→rose via `setColorAt`). Recycled top↔bottom. Procedural petal texture in the widget; **port swaps in real petal images** (translucent, veined, multi-shape) per the Papic petal-asset pipeline. Renders over the veil (`renderOrder 2`).

---

## 6. LOCKED SETTINGS (owner-tuned 2026-06-17)

> **Now the admin DEFAULTS, not hard constants (PR [#1677](https://github.com/iscasasola/setnayan-platform/pull/1677), 2026-06-17).** These values are the **locked house defaults** baked in `apps/web/lib/reveal-config.ts` (`DEFAULT_VEIL_LOOK`/`DEFAULT_REVEAL_CONFIG`). Setnayan HQ can override them — and **activate/deactivate** the reveal + its features — from the **Reveal Studio** at `/admin/reveal-studio` (DB `reveal_studio_config`, read-all RLS, admin-write). A missing/partial config always resolves back to this table. The reveal also moved from the `NEXT_PUBLIC_STD_REVEAL` env flag to the admin master toggle (`config.enabled`); the env flag + `?reveal=` stay as fallbacks.

| Control | Value | Meaning |
|---|---|---|
| **Logo gap px** | **125** | spacing between marks (large = plain veil) |
| **Logo size** | **9** | mark size as % of the tile (small) |
| **Logo opacity** | **22** | subtle white |
| **Top valance %** | **30** | the droop (visible fold) size |
| **Reaches** | **10** | hem ends ~5–10% from the bottom |
| **Wind** | **48** | hem-weighted sway |
| **Folds** | **16** | bloom fold count |
| **Fullness** | **100** | fold depth at the hem |
| **Weight** | **26** | gravity |
| **Trail** | **100** | fold follow softness (loose/laggy) |
| **Float up** | **100** | keeps the fold high during reveal |
| **Feather** | **5.0 s** | auto-reveal duration |
| **Bounce** | **83** | settle damping (low = lively) |
| **Hold size / Hold lift** | **22 / 70** | tap-pinch radius / forward peak |
| **Strain clamp** | **1.012 (1.2%)** | hard inextensibility cap |
| **Tulle / Bloom** | 100 / 55 | weave fineness / fold-start envelope |

---

## 7. Port — ✅ DONE (PR [#1671](https://github.com/iscasasola/setnayan-platform/pull/1671), 2026-06-17)

Shipped into `apps/web/app/[slug]/_components/reveal/veil-reveal.tsx` — a faithful translation of the reference `.html` with the §6 settings baked as constants. What landed:
- ✅ Pinned-crown bloom-fold drape, gravity drop, hem wind, **hard 1.2% strain clamp**, the **two-end trailing fold** to a `Top-valance%` droop with the hem off-screen + float.
- ✅ Gestures: swipe-up reveal · swipe-down re-cover · double-tap auto · grab-and-pull inextensible hold · tap-to-bounce-a-petal.
- ✅ **White sparse `MARK_PATH`** (imported from `veil-shared.ts`) fixed-pixel tiled with a faint weave + the **ResizeObserver** re-fit on rotation. _(The texture + material are built **inline** in `veil-reveal.tsx`, not via `veil-shared.ts` — so `veil-crown` keeps its old gold/flower look untouched. `veil-shared.ts` was deliberately NOT changed.)_
- ✅ The **100-petal** shower (cling/feather/rotate/straight · tap-bounce · lower-shakes-loose · starts on first lift).
- ✅ Colour: tulle recolours live from `veilColor`; petals from `petalsColor`; the mark stays white.
- ✅ Flag/`?reveal=veil-sheer`-gated; reduced-motion + no-WebGL safe; three.js stays code-split.

**Not yet (separate work):** the PR4 **content layer** — the 7 required content elements, the 3 customizations wired from the Mood Board (background / veil colour / petals colour), the per-event template chooser, and the orientation lock (Content & Customization spec).

---

## 8. Exact constants & formulas (extracted verbatim from the reference prototype)

> So the math is human-readable and the port can be checked against it. **The `.html` is authoritative**; these are transcribed from build `veil_lower_shakes_petals`. Symbols: `rf` = row fraction crown→hem (0→1); `t` = time; `vw/vh` = half view width/height in world units; `dt` = frame delta.

**Cloth grid:** `cols = 66`, `rows = 50`. Crown row pinned. Constraints: horizontal + vertical + diagonal; **6** main solver iterations.

**Bloom fullness (flat crown → folds bloom to hem):**
`env(rf) = 0.16 + 0.84·rf^1.5` ; `rowDx = pinW·(1 + Fullness·env(rf))`.

**Hem-weighted wind:**
`we = rf²·(0.35 + 0.65·rf)` ;
`aw = Wind·we·( sin(t·0.6 + iy·0.24 + ix·0.13) + 0.35·sin(t·1.1 + ix·0.3) )` ;
`az = Wind·0.55·we·cos(t·0.5 + ix·0.12 + iy·0.1)`.

**Hard strain clamp (the "no rubber" rule):** `CL = 1.012`; after the main solve, **4** clamp iterations cap every edge length to `rest·CL`.

**Reveal fold (sim-driven, two-end-led, hem off-screen):**
`hemUp = max(0.2, clothH/vh − 4·(Valance/100))` ;
`hy = topPin + vh·hemUp·smoothstep(0.02, 1, lift)` ; `hz = frontZ − 0.25` ;
two-end weight `endW = max(0, 1 − min(fx, 1−fx)/0.3)` ; pull `w = pull0·(0.3 + 0.7·endW)`.
Lift easing each frame: `lift += (liftTarget − lift)·0.05`.

**Lower-veil-shakes-petals:** if `lift < prevLift − 0.0008` (the veil is descending) → set `shakeFrames = 18`; decrement each frame; while `shakeFrames > 0` the petal updater runs in "shaking" mode.

**Petals — `NP = 100`** `InstancedMesh(PlaneGeometry(1,1))`, per-instance colour (blush→rose).
- **Cling** (`spawnCling`): attached to cloth vertex at `iy = rows·(0.28 + rnd·0.5)`, random `ix`; offset `±0.05`; size `vh·(0.035 + rnd·0.03)`.
- **Detach** (cling→fall): `if sp > 0.045  OR  (shaking AND (sp > 0.012 OR rnd < 0.2))`, where `sp` = the clung vertex's speed.
- **Falling-type mix** (`spawnFalling`): `rnd < 0.40 → feather` · `< 0.72 → rotate` · else `straight`.
  - `feather`: `grav −1.4, drag 0.972, sway 0.5` (slow tumble) — gentle flutter.
  - `rotate`: `grav −2.7, drag 0.987, sway 0.16`, fast face/axis spin (`sy 2.4–5.0`).
  - `straight`: `grav −3.6, drag 0.992, sway 0.07` — just drops.
- **Integration:** `pVel += (grav, aw, az)·dt`, `pVel *= drag`, `+ sway·sin(t·swayF + swayPh)·dt`; recycle when `y < −vh·1.45` → respawn at top, `rnd < 0.3` re-clings.
- **Tap-to-bounce** (`bouncePetal`): screen-space hit radius **38 px**; on hit → detach, switch to `feather`, velocity `away-from-touch·0.7 + up(0.45–0.85)`, big tumble (`sx,sy,sz = 2.5–5.5`).

**Material:** `MeshStandardMaterial`, ivory `#f3ece1`, `roughness 0.8`, double-sided, `depthWrite false`; fresnel via `onBeforeCompile` (`fr = pow(1 − |dot(V,N)|, 1.8)` → `+0.7` rgb, `+0.5` alpha). Logo = white `MARK_PATH` on a fixed-px `RepeatWrapping` alpha tile; **ResizeObserver** re-fits on resize/rotate. _(Reference `makeVeilMaterial` in `veil-shared.ts` still carries the OLD gold emissive + scalloped flower hem — the port must switch it to the white-mark / faint-weave look per §5.)_
