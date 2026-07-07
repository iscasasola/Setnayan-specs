# 0024 Addendum — Envelope-Open Experiential Intro (design exploration · 2026-06-14)

> **STATUS: DESIGN EXPLORATION — pending owner scope sign-off.** This is a *new interactive layer* on the Phase 1 Save-the-Date hero (the free lifecycle landing page in `0002`), NOT a shipped change and NOT the existing ₱99/₱199 MP4 render add-on. It is captured here as design history per the relaxed corpus-sync rule. No repo code has been written. Two working prototypes were built in-session as Claude visual widgets (drag-to-open, then full scroll-scrub timeline) to pressure-test the feel.
>
> **Flagged as a V1 scope expansion** (per the locked "V1 scope is locked — flag expansions" guardrail). Owner must green-light before build.

> **★ TRADEMARK RSVP (owner-locked 2026-06-15).** The **bridal-veil reveal** (§1a · luxe scalloped-lace veil + the animated monogram **playing behind** the sheer fabric + **hold-&-swipe-up-to-fold** gesture) is elevated to **Setnayan's signature, trademark RSVP** — the hallmark opening of the RSVP / invitation surface (couple-website **RSVP path**, iteration `0002` / 4-path program). It is the recognizable, ownable Setnayan moment: a guest who has seen one Setnayan invite knows the next on sight. **Build implication:** the post-veil content beats must flow straight into the **RSVP ask** (attendance + hold-a-place seat reservation + face-reg + optional login). **Surfaces:** guest lifts the veil on RSVP · couple's invite leads with the veil (moodboard-recoloured, their monogram behind) · admin manages it as a platform-owned signature template in the reveal library. **Owner flags:** (a) it is wedding-specific (mimics a bride's veil) — fits V1 (weddings); **non-wedding event types will each need their own signature reveal** (the rigid flaps/doors serve there); (b) a distinctive branded interaction is a possible **trade-dress / "the Setnayan veil" naming + IP** angle worth a real look. The rigid envelope reveals remain the broader opening library; the veil is the hero/default for RSVP.

> **◼ DESIGN-PHASE WRAP (owner-directed 2026-06-15).** After the luxe veil, **close the reveal-design exploration with this set** and **place it on the Save-the-Date templates** (§7: couple-facing chooser previewed w/ the couple's monogram + moodboard colours · admin library management). **Locked set:** RIGID real-3D envelopes (four-flap · two-flap-vertical · two-flap-horizontal · church-doors) + ORGANIC **luxe sheer bridal VEIL** (cloth sim · multi-touch · monogram-playing-behind · = trademark RSVP). **Veil look** = sheer fine tulle + beaded scalloped floral-lace hem + 3D fabric-flower appliqués (flutter w/ the cloth) + pearl/sequin sparkle. **Veil interaction** = multi-touch grab, drag ANY direction incl. down, lift up-&-over to reveal (elastic return). **Deferred to future library additions:** curtain reveal type 2 · flower bloom · satin-silk unveil. **Next build = template integration, not more new reveals.**

---

## 1. Concept

The guest's Save-the-Date opens as a **sealed envelope**: two folded paper panels (a gatefold) overlapping at the centre, held by a **wax seal pressed with the couple's monogram**. The entire Save-the-Date is **one continuous scroll-scrubbed timeline** — scrolling scrubs the envelope open, reveals the invitation, plays through the content, and runs to the end. It must feel like *thick paper being opened gently*, not a slide transition.

This is deliberately a fusion of two patterns that the market keeps separate:
- the **wedding-envelope aesthetic** (liner + seal + music before any words — Greenvelope / Bliss & Bone),
- the **Apple-product-page scroll-scrub mechanic** (pinned section, scroll drives progress to the end).

No wedding-invite product currently combines them — this is genuine white space.

## 1a. Opening library + free/pro tiers (owner-directed 2026-06-14)

> **🔁 REDEFINED 2026-06-15 — the library is now 7 MECHANIC-BASED REVEALS (the "screen IS the envelope" model), in two build families. This supersedes the object-based list further down (envelope/gift box/ring box/scroll/newspaper — those become content/style variants, not the opening mechanics).**
>
> **Family A — rigid panels · ONE shared code engine (Claude-built, reliable, full-screen, photoreal texture):**
> 1. **2-flap envelope (vertical cut)** — splits left|right, swings open
> 2. **2-flap envelope (horizontal cut)** — splits top|bottom, swings open
> 3. **4-flap envelope** — overlapping flaps, open in SEQUENCE (top flap first)
> 4. **Church doors** — two grand doors swing wide
>
> **Family B — soft / organic · flowing motion = VIDEO's strength (AI video is GOOD at fabric/petals — the opposite of the rigid envelope it failed at):**
> 5. **Curtain reveal** — white curtains part open
> 6. **Flower bloom** — petals open to reveal
> 7. **Silk unveiling** — satin cloth lifts away (elegant car-reveal)
>
> **Layered architecture + animation (owner-directed, CONSOLIDATED 2026-06-15):**
> - **Full-page paper — NO envelope border.** The invitation PAPER fills the WHOLE screen (maximize viewing); we do NOT render a visible liner/border that mimics the envelope. The paper sits at the back, **always present, never fades** — the flaps lift OFF it (a TRUE UNCOVER, not a reveal-by-fade). Layer stack back→front = **invitation paper (full-bleed) → overlapping FLAPS (front).**
> - **Seal = a wax stamp resting ON the paper that you SWIPE off to GATE the reveal (owner-directed 2026-06-15, physics corrected).** The monogram candle stamp **sits on the paper surface** at dead-centre where the flaps meet. Interaction:
>   - **Pick it up** → it lifts slightly off the surface and follows your finger.
>   - **SWIPE it away** (a deliberate flick toward/over an edge) → it **slides ACROSS the paper surface and off the screen edge** — it does NOT fall downward. *(Correction: an earlier version applied gravity so the seal "fell," which is wrong — the paper is right there behind it, so a seal resting on paper can't fall into anything; it can only be swiped across and off an edge. Gravity/tumble only kicks in once it's PAST the edge and off the paper.)* Once it's gone → the reveal begins.
>   - **Release WITHOUT swiping** (let go in place / weak gesture) → the stamp **DROPS BACK DOWN onto the paper** and settles (a real fall + small bounce, following motion), and the **envelope stays sealed** — you must swipe it to open. "They have to swipe it away."
>   - **NO shadow on the candle stamp** — neither casts nor receives (owner-explicit).
>   - Placement / monogram / wax colour fully programmable (0037 monogram · moodboard wax colour). *(Supersedes both the passive "breaks FIRST" and the gravity-throw versions.)*
> - **Cascade relay timing:** flap 1 starts → **as it opens, flap 2 follows** → 3 → 4 (overlapping windows — a flowing relay; NOT strict one-at-a-time, NOT all-together). Tuned to **optimum/efficient** time (the whole open is quick) yet staggered enough to stay graceful/majestic and so no flap opens into another's space.
> - **Overlap:** true envelopes overlap their flaps → flaps are z-layered, the topmost opens first.
> - **Tilt-reactive parallax (owner-directed 2026-06-15):** reacts to **device tilt (gyroscope · DeviceOrientation)** on mobile / mouse-move on desktop — but it is **PURELY a shadow effect: the single centre light moves, the shadows slide, and the paper + flaps stay LOCKED** (see the parallax rule below). No card rotation, no layer drift, no "seal shifts more than paper." **Recommend gyroscope, NOT eye/head-tracking** — front-camera face-tracking is technically possible but rejected for V1: invasive (asking a guest for camera), battery/CPU-heavy, and against the privacy-first stance (RA 10173 / face-data locks). Honor `prefers-reduced-motion` + an off toggle (motion sensitivity). Rides on the "light = eyes" model, so it's cheap to add.
> - **Shadows = REAL 3D (WebGL shadow maps), not faked — ONE light at SCREEN CENTRE → real shadows (owner-directed 2026-06-15).** Build the rigid family as an **actual 3D scene** (flaps = real meshes, one real light, renderer-computed shadow maps) — the owner asked for "actual 3D shadowing," and it's correct: cast-shadow-on-paper, flap-onto-flap occlusion, self-shading and contact darkening all fall out of geometry + light automatically, and stay correct under parallax with no hand-faking. The single soft, **diffused light is the GUEST'S EYES at the CENTRE of the screen by DEFAULT** — **never off in a corner** (an off-centre light on a four-flap reads as four separate corner lights, which the owner rejected). Centred → shadows **radiate symmetrically outward** from the middle. **LOCKED light values (owner-set 2026-06-15 via the live diameter/diffusion/brightness picker): DIAMETER 5 · DIFFUSION 100 · BRIGHTNESS 50.** Translated to the 3D-build engine params: VSM **shadow.radius = 5** (blurSamples ≈ 12) → tight, well-defined shadow edges; **diffusion 100** → spotlight **penumbra = 1.0** + **hemisphere fill ≈ 1.1** (full wrap, shadows lifted to a soft gray, never harsh black); **brightness 50** → spotlight **intensity ≈ 1.4**. Net look = crisp-but-faint, calm shadows under one bright, fully-diffused centre light. *(These three remain tunable knobs in the prototype; 5/100/50 is the chosen default. Supersedes the earlier "large-diameter" experiment.)* This one light governs *everything* — flap shading, every cast shadow, the seams. (Earlier CSS prototypes hand-modelled the three shadow types below; the real build gets them for free from the renderer — they remain the correctness checklist.) The three types:
>   1. **Form shading (self-shadow on the flap):** luminance ∝ surface normal · light. A flat flap facing you is fully lit; as it tilts toward edge-on it **dims**, and a flap whose face turns *toward* the light catches a faint **sheen**. (Same paper — just catching more/less light.)
>   2. **Cast shadow (flap onto the paper):** shaped like the **flap's own silhouette** (the triangle / the panel) — NEVER a circle. **Anchored hard + dark at the hinge** (where the flap still contacts the paper) and **softening + blurring toward the lifted edge** (penumbra widens with height). Thrown in the light-**away** direction, and **visible only where it actually falls on revealed paper** — a bottom flap under a top light casts down, off-frame, so it shows almost nothing (correct). Magnitude peaks mid-open (highest occlusion of the revealed paper) and recedes as the flap folds clear.
>   3. **Contact / seam occlusion:** the crease where flaps meet (the X for four-flap, the centre seam for two-flap/doors) is **darkest when closed** and opens up as the flaps part; plus a tight contact line at each hinge and the seal's base ring.
>   - **CURTAIN REVEAL · BRIDAL VEIL = reveal #5, built as REAL CLOTH SIM (owner-directed 2026-06-15).** "2 types of curtain reveal; type 1 = the curtain **pulls UP as they scroll**, **no seal**; **fabric-motion oriented** with **WIND** so the fabric flows; it **mimics the VEIL OF THE BRIDE.**" Built as a genuine **cloth simulation** — a Verlet particle grid + distance constraints + gravity + wind, **pinned along the top** (veil hung from the crown). It drapes over the invitation and **billows in the wind**; **scroll lifts the pin line** so the veil rises up and off (the free hem trails and billows), revealing the invitation beneath; then the content beats animate (background stays). **Wind is a tunable dial.** No seal gate — scroll is active immediately. **This RECLASSIFIES the organic reveals (curtain/flower/silk) from the earlier "video / AI's strength" plan to REAL-TIME WEBGL** (cloth sim / shader) — better: controllable, recolourable to the moodboard, ₱0, no AI-render dependency, same engine as the rigid family. **Type 2 curtain reveal still pending the owner's description.**
>   - **VEIL C · CURTAIN OF THE VEIL = added to the locked set (owner-directed 2026-06-16).** Type-2 curtain reveal: **TWO panels of the same veil lace**, hung from a top rail, **parting left+right like a curtain** (scroll/drag-down opens; opening reverses to close). **Cloth model = SHAPE-MATCHED DRAPE, NOT free Verlet constraints** (build note — the free distance-constraint version collapsed each panel into a narrow band at deep folds and cracked the centre): every thread springs back toward a **rest shape that fully covers the frame when closed**, with the **S-fold living in the depth (z) target only** so it can **never eat horizontal width**; wind + sag only add life on top. **Closed = fully covered by construction at any fold depth; centre seam sealed** (inner-overlap columns held flat); **rails sit at the screen corners + a fat centre overlap.** **Open = every thread gathers INTO the locked outer ~5% edge band at the two corners** → centre completely clear, gathered lace swag at each side; the **outer 5% stays pinned to the frame edge** (no floating side seam) and the **hem runs off-screen** so wind never exposes it. Same lace material as the bridal veil, but **doubled** (two panels). Joins the locked reveal set; superseded the earlier "type 2 pending" note.
>   - **★ REVEAL LIBRARY = 7 TOTAL TEMPLATES (owner-confirmed 2026-06-16).** Final locked count: **4 RIGID envelopes** (four-flap · two-flap-vertical · two-flap-horizontal · church-doors) **+ 2 VEILS + 1 CURTAIN**. The two veils are: **(V1) Sheer · multi-touch** — full sheer veil covering the frame, scattered white lace florets/stars + subtle gold Setnayan accents, **grab anywhere → lift up & over** the crown; **(V2) Crown-pinned · folding** — gathered narrow at the crown, draping in deep folds fanning to the hem, **scroll/drag → hem up & back over** the crown. The curtain = **Veil C** (two panels of the veil lace parting left & right). All 3 organic reveals share the **net body + new procedural lace hem** (filigree star-flower + scalloped picot edge, studied from the owner's reference) + fold-whitening + locked motion (S-fold full · wind 0.40 · gap 11) + colour-only customization. Live demo: `veil_assets/veil_two_types.html` (V1+V2 toggle). _(This supersedes the earlier "3 veils A/B/C" framing — same three organic reveals, re-grouped as 2 veils + 1 curtain.)_
>   - **★ VEIL-FAMILY CUSTOMIZATION SURFACE = COLOUR ONLY (owner-locked 2026-06-16).** Across the whole veil family (scroll-veil · multitouch-veil · Veil C curtain), **S depth, wind, and thread gap are FIXED Setnayan craft constants** — tuned once by us, **baked identical into every couple's reveal** (NOT user controls). The prototype sliders were tuning instruments only; they do **not** ship. **The ONLY couple-customizable knob is COLOUR**, and even that **defaults from the Mood Board palette** (luminance-preserving recolour per §2e / §4) — the couple may nudge it but the default is computed, never blank. **Locked tuned defaults (the build uses these verbatim):** S-fold = full (z-amplitude ≈ 0.62) · wind ≈ 0.40 · thread-gap ≈ 11 (lace-net line spacing) · colour = Mood Board accent, ivory fallback. Changing a craft constant later is a **one-place global edit** (affects all couples), never a per-couple setting.
>   - **SCROLL-DRIVEN timeline + BEST LIGHT at full open + BACKGROUND-STAYS / CONTENT-MOVES + PREMIUM TEXTURES (owner-directed 2026-06-15).** Four linked rules for the experience layer:
>     - **Scroll is the driver (like the site hero scrub).** After the seal is swiped off, **SCROLL scrubs the flaps open**, and **continuing to scroll carries through the next information beats** — one continuous scroll-scrubbed timeline (open → content beat 1 → beat 2 …), reusing the `HeroVideoScrub` pattern. (This supersedes the earlier "self-paced auto-open island"; the open itself is now scroll-scrubbed.)
>     - **At FULL OPEN the scene resolves to BEST LIGHT** — as the flaps clear, the lighting **blooms** to an even, bright presentation wash (fill + intensity + exposure lift) so the invitation sits at its most beautiful with zero residual shadow.
>     - **BACKGROUND STAYS, CONTENT MOVES.** During the scroll-through, the lit textured paper/envelope is a **fixed background — it does NOT translate, scale, or fade.** Only the **content (the typography beats) animates and moves.** So ALL wording lives on an **animated content layer**, not baked into the paper; the paper is pure material behind it.
>     - **PREMIUM TEXTURES (make it feel real).** Real material on every surface: **paper** = fibre + grain + soft mottle + a faint **blind-emboss monogram** (as a bump map so the soft light catches the relief); **flaps** = the same sheet; **wax seal** = waxy sheen + a **pressed/embossed monogram** (bump). The big soft light makes the grain tactile. (Prototype builds these procedurally on canvas; production can swap in real scanned paper/wax maps.)
>   - **PARALLAX IS ON THE SHADOWS ONLY — the paper and flaps are LOCKED (owner-directed 2026-06-15).** On parallax (gyroscope on mobile / cursor on desktop) the **paper and the flaps NEVER move, rotate, or shift** — they are fixed geometry. The **only thing that moves is the single centre light**, and therefore the **shadows** it casts slide to create the depth illusion. Do NOT rotate the card / tilt the invitation / drift the layers (the earlier "perspective shift + seal shifts more than paper" idea is RETIRED). Locked paper + locked flaps + moving shadows = the whole parallax effect. At rest the light returns to dead-centre. This one-light model is parametric per design, proven across four-flap · two-flap-vertical · two-flap-horizontal · church-doors in the same code. All soft/faint, tunable, and NEVER a border that eats content.
>   - **COMPOSITING / Z-ORDER RULE (owner-directed 2026-06-15, after a "we no longer see the flaps" reject — the cast shadows were depth-sorting on top of the flaps).** Hard separation, NOT one shared `preserve-3d` space: **(layer 1, back) paper + printed content; (layer 1) cast-shadow-on-paper — strictly BENEATH all flaps**, so a flap's cast shadow is only ever visible on paper the flaps have **uncovered** (the opening gap); where a flap still covers paper you see the *flap*, never the shadow under it. **(layer 2) the flaps** (own perspective/3D fold, higher z so they always paint over the paper shadows). **The ONLY darkening permitted ON a flap is light being BLOCKED from reaching it:** its own **self-shading** (angling away), the **overlap band** where a neighbour flap covers it, and the **seam crease** where flaps meet (layer 3, fades as they part). No paper-cast shadow ever lands on a flap. In CSS terms: cast shadows go in the flat backplate (z-index below the flap stage), never inside the flaps' `preserve-3d` context.
>   - **Two-sided flaps:** each flap is **paper on the front, the LINER ACCENT colour on the back** (double-sided), so as a flap swings past upright you glimpse its inner accent instead of it blinking out.
>   - **The opening RUNS UNTIL THE SHADOWS ARE GONE (owner-directed 2026-06-15).** Once triggered (stamp thrown off), the flaps open all the way — folding back over the screen edges and **fully off-frame** — so that at the end **no flap remains over the paper and NO shadow is left**. The end state is a **clean, shadowless invitation**, never a half-open envelope with residual shadow. (Flaps open ~150–170° so they clear the viewport entirely.)
> - **Responsive for free:** flaps are % of the screen + content reflows → the SAME code build fills desktop AND mobile, no per-aspect renders (a real edge over video).
> - **★ TRUE TEXTURE — BUILD-BLOCKING REQUIREMENT (owner-agreed, re-confirmed 2026-06-16).** Every surface ships with a **real photoreal material map, NOT the procedural canvas/CSS textures** the prototypes draw — those only ever demonstrated MOTION + STRUCTURE, never the final look. Per surface:
>     - **Paper** (invitation + envelope sheet): real premium paper — cotton/linen **fibre + grain + subtle emboss + deckle edge** (albedo + normal/bump + roughness).
>     - **Envelope** (flaps): the **same paper sheet** texture folding, + the **liner accent** (real liner paper) on the flap backs.
>     - **Church doors:** a real **carved/panelled material** (wood-grain cathedral doors, or a heavy paper-panel variant) — albedo + normal + roughness.
>     - **Veil:** real **tulle/lace fabric** (albedo + **alpha** net + normal) with lace appliqués + the fresnel sheen (per the photoreal-net work). **★ Hem lace SOURCED 2026-06-16** (owner supplied a reference after rejecting procedural hems): pipeline = take a **dark-lace-on-light** stock image → **luminance-key** the lace out (dark→opaque, light→transparent; works even when the "transparent" bg is fake/painted, as the supplied JPEG was) → **level** the diagonal crop → **mirror-tile** into a seamless horizontal hem border → use the **alpha channel as the cloth coverage map** (white lace = opaque, holes = sheer) → recolours luminance-preserving to the veil colour; **gold Setnayan accent stays a SEPARATE layer** (body field, not in the lace) so it holds gold while the body recolours. Proven across ivory/blush/mulberry. Assets: `veil_assets/veil_lace_hem_tiled_2026-06-16.png` (hem tile) · `…_motif_extracted…` · `…_recolor_3up…` · `…_SOURCE_ref.avif`. **This same drop-in pipeline accepts any future lace PNG/SVG** — swap the source, re-run, done. (Live chat-widget couldn't embed the full-res lace — CSP limits images to a few CDNs + inline size cap — so the on-cloth look was shown as a composed still; the cloth *deformation* was already proven on the procedural lace, so the real map rides the folds identically in the build.)
>     - **Wax seal:** real wax surface (the pressed-blob bake) — covered by §3.
>     - **Sourcing keeps it ₱0 / no per-couple designer:** each map is made **ONCE per template** (scanned/photographed real material · CC0 PBR sets — Poly Haven/ambientCG · or Recraft-generated tileable maps) and **reused** by every couple; **recoloured LIVE from the moodboard** with a **luminance-preserving** recolour (blend, not repaint) so the fibre/weave/grain/emboss detail survives the colour change. Do **NOT** ship the prototype's procedural textures as the product.
> - **Animated logo/monogram = VISIBILITY-GATED (owner-directed 2026-06-15):** if the monogram (or any logo) is animated, its intro **fires the moment the flaps first uncover it** — NOT while hidden behind the flaps (wasted), NOT only after a full open. It then plays as the reveal finishes; in production this triggers the real 0037 monogram motion (#1240 draw/foil/bloom). The paper SURFACE still never fades — only the logo's OWN animation is gated. The trigger point (the % open where it first shows) is programmable; secondary content (eyebrow · date · location) cues in just after.
> - Free/pro tiering provisional (e.g. FREE = monogram or 2-flap; PRO = the rest).


Quality bar: **must NOT look Canva-made.** Each opening is a **baked offline render of real materials** (paper, satin, velvet, wax) with real light + weight — a film, not a flat-vector preset — then personalised (monogram + moodboard recolour via §2e). The couple **picks one** opening from a library:

| Tier | Opening | Notes |
|---|---|---|
| **FREE** | Animated monogram | Their `0037` mark comes alive. Largely already built — reuses the 0037 monogram motion library (#1240). |
| **PRO** | Envelope | Embossed paper, wax seal, unfold (the reference look). |
| **PRO** | Gift box + ribbon | Satin ribbon untied, lid lifts, card revealed. |
| **PRO** | Velvet ring box | Snaps open — the proposal callback; the monogram + date rise from the cushion (not a ring). |
| **PRO** | Wax-sealed scroll | Rolled invitation, silk ribbon + wax seal break, unfurls. |
| **PRO** | Newspaper | Folds open to a vintage front page — the most *text-personal* opening: masthead crest = monogram · headline = names · dateline = date · lead article = love story · halftone = photo. Newsprint recolours to the moodboard (paper = soft tone · ink/headline = accent). Synergy with the website newspaper-editorial concept. |

**≥6 openings at launch** (1 free + 5 pro: envelope · gift box · ring box · scroll · newspaper). **Bench alternates** (future / swap-in): silk-veil unveiling · floral bloom · music box (Pakanta-driven, plays their song).

**All run on the ONE hybrid pipeline** (§2d / §2e) — baked template + per-region matte recolour + composited monogram + moodboard role mapping (§4). Adding a design later is a *production* task (render one template), NOT re-engineering. **Production note:** each PRO opening = one baked template, produced once — the real long-pole for the anti-Canva quality bar. **Authoring tool = Blender (free, open-source, commercial-OK).** Cycles renders photoreal paper / velvet / satin / wax; **Cryptomatte** outputs the per-region mattes §2e needs natively → our exact asset format (beauty frames + mattes) is a built-in, not custom work. **Software cost = ₱0;** the only real cost is **3D-artist time per template** (in-house or commissioned), a **one-time** cost per template — never per couple (render once, every couple reuses; recolour is live in-browser). Render compute = free on a local GPU or pennies one-time on a farm. The FREE-tier monogram needs **no Blender** (2D; reuses the #1240 motion library). Free-vs-pro gating is provisional (holistic pricing pass).

**Why Blender and NOT AI video (e.g. Higgsfield) for the template** (owner asked 2026-06-14): the template needs **mattes + deterministic, tracked motion** to support live recolour + monogram compositing. AI video outputs a **flat RGB clip with no mattes** and **non-repeatable** motion (text/logos warp, edges shimmer) → it would break the §2e paper/accent separation (owner-locked), the live moodboard recolour, and the §3 seal tracked-compositing / seam-sync; per-couple AI-gen would also be non-₱0 + unreliable. **Higgsfield IS used — for the right layers:** organic accent elements (butterflies / petals / dust composited *over* the Blender base — AI excels at organic motion), rapid art-direction prototyping, and marketing hero clips (+ the existing trained-likeness motion-ad work). Look-targets rendered 2026-06-14 (envelope, gift box, ring box, scroll) under `~/Downloads/setnayan_*`.

---

## 2. The scrub timeline + the video island (load-bearing architecture)

Two requirements have to coexist: *"scrub until the end"* and *"the uploaded video plays and cannot be scrubbed out."* The reconciliation:

> The whole experience is one scrubbed timeline **except the video, which is a pinned real-time-playback island.** Scroll scrubs the envelope open → scrubs through the invitation → **reaches the video, scrub hands off to the video clock (locked, plays to the end with sound) → on `ended`, scrub resumes** → crossfade to the closing details.

Timeline phases (progress 0 → 1, illustrative anchors from the prototype):

| Range | Phase | Behaviour |
|---|---|---|
| 0.00–0.40 | Sealed → opening | Gatefold panels swing on outer hinges with a secondary inner-crease bend (paper curl); seal releases, lifts, fades. |
| 0.40–0.55 | Names reveal | Monogram + names + "Save the Date" + date fade/scale in. |
| 0.55 (lock) | **Video island** | Scrub locks at the video; video plays real-time with sound; scrub input ignored until `ended`. |
| post-video | Hand-off | On `ended`, lock releases, scrub auto-nudges forward, video crossfades out. |
| 0.66–1.00 | Closing details | Location, countdown, add-to-calendar, RSVP teaser, "formal invitation to follow". |

### 2a. Reuse the existing hero scrub engine (no GSAP) — confirmed 2026-06-14

The homepage hero **already ships a scroll-scrub** — `apps/web/app/_components/marketing/HeroVideoScrub.tsx` (#1372/#1384). The Save-the-Date reuses its **scroll driver**, not a new library:

- Tall section (`height: 300vh`) + `sticky top-0` 100vh stage; progress `p` computed from `getBoundingClientRect().top / total`; throttled with `requestAnimationFrame`; passive scroll listener; `prefers-reduced-motion` → static final state. **Zero-dependency, no GSAP** — matches the repo's marketing-motion house style.
- **Different render target by necessity:** the hero swaps *pre-baked JPEG frames* (one admin video — fine to bake to R2). The Save-the-Date drives **live CSS 3D transforms** instead, because the seal = the couple's monogram, colours = their moodboard, content = their video — per-couple dynamic, so baking frames would reintroduce a per-couple render cost. Live transforms keep it ₱0. **Same `p`, different target.**
- **The hero's own code proves the video-island.** Its comment: *"browser `<video>` currentTime scrubbing does NOT hold seeks during scroll"* — which is exactly why we do **not** scrub the uploaded video; we play it real-time as the locked island (§2). The hero worked around the same browser fact by baking frames; we work around it by not scrubbing the video at all. Both valid.
- House-style inheritance available: `--m-*` tokens, `m-serif`/`m-mono`, the `scroll ↓` affordance, contained presentation. (The Save-the-Date is per-couple branded, so it uses the moodboard palette rather than the hero's dark `#0e0f12` canvas — that's a deliberate divergence, not an inconsistency.)

### 2b. The "majestic" open — cinematography + a self-paced island (refined 2026-06-14)

Owner bar: the open must feel **majestic** (ref: `@eventlabcostudio` TikTok — *"an envelope, a soft reveal, a touch of butterflies… minimal yet luxurious Save the Date"*). Majesty is cinematography, not a faster flip. Locked levers:

- **Classic flap envelope + the card floats OUT** (supersedes the gatefold). Top + bottom flaps overlap at the centre under the wax seal (this matches the owner's original "two sheets overlap, stamp in the centre"); on open the flap lifts and the invitation **rises up and forward toward the viewer** — the hero move that reads as grand.
- **Slow, weighted timing (~5s) with anticipation** — stillness → seal breaks → flap lifts → card floats → settle with a gentle overshoot. Eased, never linear.
- **Atmosphere** — a warm glow blooms, a light sweep crosses the card, and **moodboard-driven decorative particles drift up** (gold dust / soft butterflies / petals / candle embers — motif + colour from the couple's palette). This is the "touch of butterflies," templated *and* personalised — something gallery-template incumbents cannot do.
- **Depth** — a subtle scene push-in (dolly) + per-layer parallax + depth-of-field feel, on a dark cinematic backdrop so the cream paper and wax glow.
- **Music swell** — pair the open with the Setnayan owned catalogue (Bridgerton-feel strings).

**Architectural refinement — the open is a SELF-PACED island, NOT raw-scrubbable.** Raw scrub would let a fast scroll wreck the majestic timing. So the open behaves like the video island: **one scroll *triggers* it, then it plays at its own ~5s pace**; scrub resumes for the content afterwards. The timeline therefore has **two self-paced islands — the open and the video — with scrub between them.** Same scroll driver, specific beats just earn their own clock.

### 2c. 3D render target — real-time WebGL, so it stays customizable (owner-directed 2026-06-14)

Owner clarified the reference open reads *real* because it's **3D**, and required the envelope stay **live-customizable** (page colour, candle-stamp look). Those two only co-exist one way:

- **Baked 3D render (their way):** photoreal but frozen — colour / wax / monogram cooked into the clip; any edit = re-render; per-couple render cost. ✗ Not customizable, not ₱0.
- **Real-time WebGL 3D (our way):** a live 3D envelope (**Three.js / React Three Fiber**) where paper colour, wax colour + the stamp, and the liner are **live material parameters** the couple edits with instant preview. Renders on the guest's device → ₱0 per couple. ✓

**Decision:** the OPEN beat is a **real-time WebGL 3D scene**, superseding the earlier "live CSS-transform" render target *for the open specifically*. The scroll **driver is unchanged** (scroll → progress drives the 3D open timeline; still a self-paced island per §2b). The 2D content beats (overture, details) and the video island are unchanged. **Trade-off flagged:** this adds a 3D-engine dependency for this surface — a deliberate divergence from the no-dependency hero scrub, justified by the 3D-realism + live-customization requirement. Proven in-session with a live Three.js prototype (orbit + open + live paper/wax/liner colour pickers).

### 2d. Render approach REFINED → hybrid baked-template + live recolour + stamp overlay (ref-driven 2026-06-14)

The owner's reference frames (`@eventlabcostudio`) set the quality bar at **baked offline render**: embossed floral relief, true fold shadows, paper physically unfolding, a real butterfly, camera flying *into* the envelope. Real-time WebGL (§2c) can't cheaply match that on a phone — and the owner's actual customization needs are only **page colour + an added candle stamp.** So the approach is refined to a **hybrid** that hits the baked quality AND those two customizations at ₱0:

- **Baked template (made once, reused by every couple):** the envelope-open animation itself — embossed paper, fold shadows, unfold, butterflies — rendered offline at full quality as a **neutral master** (clip / frame-sequence). A **library** of templates (this floral, a plain, a geometric…); the couple picks one. ₱0 to reuse.
- **Live page-colour recolour:** the neutral master is **recoloured** to the couple's moodboard colour at play time — luminance preserved, so embossing + shadows stay intact; only the hue shifts. Cream → blush / sage / dusty-blue / mulberry. A **recolour, NOT a repaint** (no neon; ideal for wedding palettes).
- **Composited candle stamp:** the reference has NO seal — we **add** the bespoke `0037` monogram wax seal as a separate overlay at the centre seam, breaking in sync with the baked unfold (authored once per template to match its seam timing). Any wax colour.
- **Consistency for free:** the content page reuses the same recoloured palette + butterfly motif → one cohesive piece (the owner's own observation).

**This SUPERSEDES §2c's pure real-time-3D decision for matching this reference**, and **drops the 3D-engine dependency** — back toward the lightweight hero-scrub frame approach: the baked open is a self-paced played clip / frame-sequence; recolour + stamp are composited layers. Real-time WebGL 3D (§2c) is retained as the **ALTERNATIVE** only if the owner later wants full live paper-repaint or orbit, at a quality cost. **Recommended: the hybrid.** Demonstrated via 2 Recraft renders (embossed-floral envelope + wax monogram seal, cream + blush page colours).

### 2e. Recolour mechanism — per-region blend-mode at low opacity, via baked mattes (owner-specced 2026-06-14)

Owner: the recolour must be a **Photoshop-style blend (Hue / Color) at low opacity (~20%)**, NOT a flat tint or a transparent colour overlay. And **paper vs accent must recolour independently.** Both are fully achievable in-browser at ₱0:

- **Blend, not tint.** Canvas natively supports the W3C blend modes `hue` / `saturation` / `color` / `luminosity` (`globalCompositeOperation`) + opacity (`globalAlpha`). So whatever blend + % the designer dials in Photoshop, we reproduce **1:1**, live, per frame. Luminance (embossing + shadows) is preserved; only hue/sat shift by the chosen amount.
  - *Nuance:* `Hue` keeps the base's **saturation** → a subtle, gorgeous shift on tinted stock (cream / ecru / kraft) but barely moves **pure white** (no saturation to carry the hue). For visible colour on white stock use `Color` (hue + sat). Expose **blend-mode + opacity** as parameters; **`Hue @ ~20%` is the whisper-subtle default.**
- **Separation = baked mattes, NOT after-the-fact extraction.** Each template is rendered once with **region mattes** output alongside the beauty frames — a **paper matte**, an **accent matte** (foil / edges), a **liner matte**, etc. (trivial in 3D: object / material-ID passes → the renderer knows which pixel is which → pixel-perfect, no fringing). The live recolour is applied **per matte**: paper-matte → the moodboard *paper* role, accent-matte → the moodboard *accent* role. We **never** colour-key the flat render (the fragile, fringy "magic-wand" way).
- **The wax seal needs no matte** — it's our own composited overlay (§3), already independently coloured.

**Template asset format therefore = beauty frames + per-region mattes.** Matte authoring is a once-per-template step; recolour at runtime is ₱0 per couple.

### 2f. Production reality → real-time WebGL is the CHOSEN V1 build path (no designer · 2026-06-14)

**Owner has no designer and no time/budget to craft 3D scenes.** This flips the build path: the baked-Blender route (§2d / §2e) needs a 3D artist the owner doesn't have, so it is **deferred to a future quality-upgrade** (if a designer/budget ever appears — same architecture, swappable, nothing wasted). The **chosen V1 path is REAL-TIME WebGL (§2c) — built by Claude Code (engineering, not design).** Proven in-session by the live 3D envelope with working paper / wax / liner colour pickers.

Why it works with **no designer**:
- **Free CC0 asset libraries** (Poly Haven, ambientCG) supply photoreal paper / velvet / satin / wax textures + HDRI lighting — nobody paints them.
- **AI image-gen feeds the textures** — Recraft (no designer) generates bespoke texture maps (e.g. the embossed-floral paper) → mapped onto the real-time meshes.
- **Separation + recolour get EASIER, not harder** — in real-time 3D each part (paper / wax / liner) is a **separate mesh**, so the owner's "separate them properly" is **native (no mattes needed)** and recolour is just a material colour (the demonstrated sliders). The §2e matte system is needed ONLY for the baked path.

**Honest trade:** real-time on mobile won't be pixel-identical to an offline render (the absolute-photoreal ceiling needs a designer / render farm — kept as the future upgrade), but it is premium, clearly anti-Canva, **fully customizable**, ₱0, and needs **no designer + none of the owner's time.** Given the constraints, this is the right call. The FREE monogram is already built (#1240, 2D).

### 2g. V1 PRAGMATIC PIVOT → AI-generated generic opening clips (Higgsfield), personalisation via post-open content (owner-directed 2026-06-14)

Given no designer + the real-time prototype reading "geometric / fake," the owner chose a pragmatic V1: **generate the 5 PRO openings as AI video clips on Higgsfield (image-to-video on the existing Recraft stills), ship 5 templates now, improve over time.**

**Honest trade (owner-accepted):** an AI clip is **baked / fixed** → the opening itself does NOT live-recolour to the moodboard or carry the composited monogram seal. **Personalisation is preserved by the structure:** the AI clip is the *generic opening wrapper*, which **crossfades into the couple's personalised content** (names · date · love story · their video · details — built in code / 2D, §5) where the monogram + moodboard colours live. So it still feels personal; the *bespoke envelope* (recoloured + monogram-sealed) becomes the **"improve in time" upgrade** = the real-time WebGL (§2c / §2f) or commissioned baked (§2d / §2e) path, swapped in later with zero rework.

**Cost:** 5 clips generated **once**, shared by every couple → ₱0 marginal per couple.

**Method = image-to-video** on the existing approved stills (control + consistency), NOT text-to-video. The 5 motion prompts are in the 2026-06-14 chat handoff. SPEC IMPACT: V1 opening = AI clip + personalised-content crossfade; full bespoke customization (live recolour + monogram seal on the envelope) deferred to a post-V1 upgrade.

### 2h. Placing the candle seal on an AI-video opening + the two-clip structure (V1 · 2026-06-14)

The opening clip is AI-generated (§2g) and **sealless** — the couple's monogram wax seal is **our own layer**, never baked into the AI video, and never tracks the AI motion. It works by **sequencing**:
1. **Sealed (our layer):** the AI clip's first frame is a sealless closed envelope; we composite the couple's monogram seal (0037 + moodboard wax colour) at the centre seam (placement trivial — static).
2. **Seal releases (our ~0.6s animation):** on trigger the seal lifts + fades — the one personalised element, ours to animate.
3. **Envelope opens (AI 5s clip):** crossfade to the sealless AI clip, which opens.
4. **Content:** crossfade to the personalised content over the looping background.

**Seamless because the AI clip is image-to-video from the SAME sealless still** → the envelope matches exactly, the seal sits perfectly, the break hands off cleanly, and the seal is gone before the flap motion gets complex (no tracking / morphing). The seal stays fully personalised (monogram + moodboard wax) at ₱0.

**Two 5s AI clips per template (both generic, made once, ₱0 / couple):**
- **(a) 5s opening clip** — sealless object opening (image-to-video from the approved still).
- **(b) 5s seamless ambient loop** — soft motion backdrop (bokeh / drifting dust / candlelight) behind the **pre-video overture AND the post-video details**. Moodboard-tintable via a CSS colour blend.

Production: generate the open clip from a **sealless** still so nothing conflicts with our seal overlay.

## 3. Wax seal from the monogram — zero marginal cost

**No image generation per couple.** The monogram already exists as an **SVG** (iteration `0037`). The seal is that SVG re-lit and re-coloured at render time:
- one reusable owned **wax base** (grayscale height/specular texture, made once, shared by every couple — ₱0 per couple);
- the monogram **embossed into it** (drawn as offset highlight + shadow copies → "pressed" relief);
- **colour pulled from the moodboard palette** (`0010`), not an API.

Consistent with the "marginal cost = R2 only" lock. Re-colours instantly and stays in sync if the couple changes their monogram.

## 4. Envelope: colours, patterns, paper — all moodboard- + template-driven

| Choice | Source | Cost |
|---|---|---|
| Colours (paper, wax, liner) | moodboard palette tokens (`0010`) | ₱0 |
| Patterns (liner motif — floral / art-deco / geometric…) | couple picks from a template library; recoloured from the moodboard; design swappable per template | ₱0 |
| Paper style | toggle: textured high-end (grain + deckle edge + shadow overlay) ↔ clean digital | ₱0 |

All deterministic, template-driven, no per-render AI — consistent with the platform's template-driven lock.

**Live edit (hybrid pipeline · §2d / §2e).** Each is edited with instant preview — the recolour is the per-region blend-over-matte of §2e, not a 3D material param:
- **Page / paper colour** — recolour the paper matte from the moodboard (or custom).
- **Candle stamp** — wax colour + seal shape + the **monogram pressed into it** (`0037`); the seal is our own composited overlay.
- **Liner** — pattern motif (template choice) + colour, recoloured from the moodboard via the liner matte.
- **Paper finish / pattern** — chosen by picking a template (each baked once).

**Moodboard → envelope role mapping (LOCKED 2026-06-14 — owner: "this is perfect").** A moodboard isn't one colour — it's a palette with **roles**, mapped onto the envelope's parts, each recoloured independently via its baked matte (§2e):

| Envelope part | Moodboard role |
|---|---|
| Paper / page | the soft, light tone |
| Liner (inside pattern) | a secondary colour |
| Wax seal | the deep accent |
| Drifting particles (dust / butterflies) | a highlight |

Deterministic, with **graceful fallback** when a palette is sparse (no distinct highlight → particles fall back to the accent or a paper tint). The same palette flows into the content page after the open → one cohesive piece. Seeded automatically; the couple can override any part (any swatch or custom).

## 5. Content arc — three acts (refined 2026-06-14)

The scroll is a **narrative, not a flat list**: an emotional *overture* before the video, the video as the hero beat, then the practical *details* after. Logistics never appear before the video — they break the spell.

### Act 1 — before the video (overture · sparse + emotional)
Job: identify the couple, deliver the one essential fact (the date), create feeling, hand off to the video. NO logistics.
1. Monogram + couple names (the reveal beat, as the seal breaks)
2. "Save the date" + the date (the hero fact — unmissable; everything else can be looked up later)
3. One line in the couple's voice (a single curated sentence — not a paragraph)
4. Lead-in cue → "watch our story" (hands into the locked video)

**Recommendation (owner to confirm): keep Act 1 typographic only — no couple portrait** — so the video is the FIRST time guests see the couple in motion. A still photo first softens that payoff; the restraint is what reads as premium.

### Act 2 — the video (hero beat · locked)
Plays to the end with sound; landscape clips prompt "hold your phone sideways" first. See §6.

### Act 3 — after the video (the details · practical)
1. Venue + city + time
2. Countdown
3. Love story (optional longer narrative) + photo gallery
4. Add to calendar (`.ics`, from `0007`)
5. RSVP / link to the wedding website
6. Dress code / theme + hashtag (optional)
7. "Formal invitation to follow"
8. Travel / accommodation (destination weddings)

Couple can reorder/toggle within each act; ship a tasteful default. (Act 3 detailed once Act 1 is locked.)

## 6. Video upload behaviour

Couple-uploaded video, screened by the always-on NSFW filter (platform lock) before going live.

1. **Vertical video → scroll-pins and plays to the end with sound.** Scroll locks on entry; releases only on `ended`.
2. **The page is portrait-locked and NEVER reflows** — even for a landscape clip the layout stays portrait when the phone is tilted (requirement #2). (Refined 2026-06-14.)
3. **Landscape video → present it rotated 90° inside the portrait page, and prompt "hold your phone sideways" before it plays** (refined 2026-06-14). The page does NOT switch to a landscape layout — only the video element is rotated to fill the screen when the guest physically turns the phone. On `loadedmetadata` we read the aspect ratio; if landscape, show the rotate prompt and begin playback on confirm. The prompt is a viewing-comfort step, not a layout change.
4. **On `ended` → crossfade to the closing details.**

### Two browser constraints to design around (not assume away)
- **Sound-on autoplay is blocked** unless a user gesture triggered playback (iOS Safari strictest). Mitigation: fire `play()` from inside the scroll/touch gesture that reaches the video (that gesture *is* the user interaction). Fallback: a single tasteful **"tap to play"** frame rather than a silent autoplay. Build this as a fallback, not a guarantee.
- **No true orientation lock on the web** outside fullscreen, and none on iOS Safari. We cannot stop the device rotating — we keep the *layout* portrait so it doesn't matter. Visually identical to the intent.

## 7. Surfaces + connections (architect mandate)

- **Couple (editor):** **choose their OPENING TEMPLATE from a gallery/chooser page** — the free monogram + the 5 pro templates (envelope · gift box · ring box · scroll · newspaper), each **previewed with their own monogram + moodboard colours**, PRO ones gated by tier; then set colours, upload the video, arrange the content, preview the open. *(Template chooser is a required surface — owner 2026-06-14.)*
- **Guest (experience):** the chosen opening + personalised landing page.
- **Setnayan HQ (admin):** **manage the OPENING-TEMPLATE LIBRARY** (add / remove / reorder, set free vs pro tier, upload the AI clips + assets, set availability); the uploaded video runs through the NSFW screen before publish; pricing lives in the admin catalog (admin-managed + provisional — none quoted here).
- **Connections:** moodboard (`0010`) → palette → envelope colours; monogram (`0037`) → wax seal; video → R2 + NSFW gate; calendar → `0007` `.ics`; page extends the personal invite site (`0002`).

## 8. Reference set (curated 2026-06-14)

**Production gold standard (the bar):**
- Greenvelope — animated envelope with custom liner + stamp + music before any words: https://www.greenvelope.com/
- Bliss & Bone — "real paper" shadows/textures/dimension (material-realism reference): https://caratsandcake.com/articles/digital-wedding-invitations
- Paperless Post — guest's name on the envelope front: https://www.womangettingmarried.com/paperless-post/
- Riley & Grey — editorial high-end art direction: https://withjoy.com/blog/the-best-wedding-invitation-sites/
- Love, D. Concepts (🇵🇭 local benchmark / closest competitor): https://lovedconcepts.com/wedding-invitation-website/

**"Scrub to the end" mechanic (Apple-style):**
- CSS-Tricks — Apple product-page scroll animation (canvas image sequence): https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- GSAP ScrollTrigger docs (`pin` + `scrub`): https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP Vault — scroll image sequence: https://gsapvault.com/effects/scroll-image-sequence
- Builder.io — Apple-style scroll with CSS `view-timeline` (no-JS option): https://www.builder.io/blog/view-timeline

**Paper-fold realism (the bend):**
- Codrops — PFold paper-like unfolding: https://tympanus.net/codrops/2012/10/17/pfold-paper-like-unfolding-effect/
- Codrops — on-scroll folding 3D box (Three.js + GSAP): https://tympanus.net/codrops/2022/12/13/how-to-code-an-on-scroll-folding-3d-cardboard-box-animation-with-three-js-and-gsap/
- Codrops — 3D folding layout technique (CSS): https://tympanus.net/codrops/2020/01/14/3d-folding-technique/

**Envelope + wax seal code (lift-ready):**
- CodePen — letter envelope + wax seal: https://codepen.io/15156/pen/ybzdMN/
- CodePen — opening envelope 3D: https://codepen.io/amiriftikhar/pen/KKbPdww
- Designer write-up — "opens like a real card" (concrete keyframes: flap `rotateX` 180→0 `transform-origin: center top`, card `translateY` + `rotate(-90deg)`, z-index depth): https://www.saahiljaffer.com/articles/how-i-designed-a-digital-invitation-that-opens-like-a-real-card

## 9. Open decisions for the owner

1. **Scope sign-off** — green-light the envelope-open experiential intro as a layer on the Phase 1 hero (and confirm it's separate from / additive to the existing MP4 render add-on).
2. **Seal-break style** — (a) seal lifts off whole and floats up (gentlest) vs (b) cracks down the middle, each half travels with its panel (more realistic, more dramatic).
3. **Scrub engine** — ✅ RESOLVED 2026-06-14: reuse the existing hero scrub driver (`HeroVideoScrub.tsx`) — zero-dep scroll listener + rAF, no GSAP. Live CSS-transform render target (not baked frames) because content is per-couple. See §2a.
4. **Video real-time playback** — accept the "tap to play" fallback where sound-on autoplay is blocked (recommended), or insist on gesture-triggered autoplay only.
5. **Pricing** — whether this is part of the free landing experience or a paid upgrade (admin-catalog, provisional — batch into the holistic pricing pass).
6. **Envelope form + fidelity** — two Recraft *look-reference* renders generated 2026-06-14 (premium textured paper + real-depth wax seal + champagne-gold patterned liner, our moodboard palette; saved under `~/Downloads/setnayan_env_*`) set the aesthetic bar — far above the flat-CSS prototype. They render the **classic flap envelope** with the gold liner **revealed on open** (a beautiful beat that also showcases the moodboard pattern), vs the **gatefold/wrap** in the prototype. Recommend leaning into **flap + liner-reveal**. The renders are look-alignment only — production animates real owned-texture layers (made once, reused), monogram composited onto the wax procedurally, colours from the moodboard → per-couple cost stays ₱0.

## 10. Build handoff — implementation deferred; design complete (2026-06-14)

Design fully specified above; **programming is a separate later job** (owner confirmed). When ready:

1. **Assets (no app code · STARTED):** generate on Higgsfield — **image-to-video from SEALLESS stills** (§2g/§2h): 5 opening clips (envelope · gift box · ring box · scroll · newspaper) + 1–2 seamless ambient loops. **Format: composed centered at a 1:1 master** so one asset crops cleanly to **desktop AND portrait** (matches `HeroVideoScrub` object-fit:cover); optional dedicated 16:9 desktop render later. Store in R2. *(First validation clip — envelope, Seedance 2.0, 1:1, 5s, 1080p — generating 2026-06-14.)*
2. **Schema:** `events` gets chosen-opening-template + opening config; an admin-managed **opening-template library** table (clip URLs, free/pro tier, order, availability). RLS at create time.
3. **Couple chooser page (§7):** gallery of free monogram + 5 pro, tier-gated, each previewed with the couple's monogram + moodboard colours.
4. **Admin library surface (0023):** add/remove/reorder, set tier, upload clips, availability.
5. **Guest experience:** scroll-scrubbed landing reusing the `HeroVideoScrub` driver — Sealed (still + our monogram-seal overlay §2h) → seal break (~0.6s) → AI open clip → overture (over ambient loop) → couple video island (locked §6) → details (over ambient loop). Two self-paced islands (open, video) with scrub between (§2b).
6. **FREE monogram** reuses #1240 (no new asset).
7. **Personalisation:** monogram seal = 0037 + moodboard wax colour; content palette + ambient-loop tint from the moodboard (CSS blend); NSFW screen on the uploaded video.
8. **Deferred upgrade:** bespoke recoloured/monogram-sealed real-time (§2c/§2f) or commissioned baked (§2d/§2e) — swap-in later, zero rework.

Nothing blocked; design + decisions durable here + in `DECISION_LOG.md`.
