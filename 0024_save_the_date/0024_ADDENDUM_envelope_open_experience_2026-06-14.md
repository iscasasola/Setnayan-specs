# 0024 Addendum — Envelope-Open Experiential Intro (design exploration · 2026-06-14)

> **STATUS: DESIGN EXPLORATION — pending owner scope sign-off.** This is a *new interactive layer* on the Phase 1 Save-the-Date hero (the free lifecycle landing page in `0002`), NOT a shipped change and NOT the existing ₱99/₱199 MP4 render add-on. It is captured here as design history per the relaxed corpus-sync rule. No repo code has been written. Two working prototypes were built in-session as Claude visual widgets (drag-to-open, then full scroll-scrub timeline) to pressure-test the feel.
>
> **Flagged as a V1 scope expansion** (per the locked "V1 scope is locked — flag expansions" guardrail). Owner must green-light before build.

---

## 1. Concept

The guest's Save-the-Date opens as a **sealed envelope**: two folded paper panels (a gatefold) overlapping at the centre, held by a **wax seal pressed with the couple's monogram**. The entire Save-the-Date is **one continuous scroll-scrubbed timeline** — scrolling scrubs the envelope open, reveals the invitation, plays through the content, and runs to the end. It must feel like *thick paper being opened gently*, not a slide transition.

This is deliberately a fusion of two patterns that the market keeps separate:
- the **wedding-envelope aesthetic** (liner + seal + music before any words — Greenvelope / Bliss & Bone),
- the **Apple-product-page scroll-scrub mechanic** (pinned section, scroll drives progress to the end).

No wedding-invite product currently combines them — this is genuine white space.

## 1a. Opening library + free/pro tiers (owner-directed 2026-06-14)

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
