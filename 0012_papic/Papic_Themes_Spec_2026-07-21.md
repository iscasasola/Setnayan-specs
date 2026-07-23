# Papic Themes — Kodak+ retune, date stamp, and Drag mode

**Spec · 2026-07-21 · owner session**

> **Status: the engine is SHIPPED; these are three additions to it.** Owner decisions in-session:
> Retro adopts the **Kodak+** curve · Retro carries a **vintage date stamp** with time, date and event
> name · add a **motion-blur capture mode**.
>
> `[VERIFIED-CODE]` = read at a cited path on `origin/main`.

---

## § 1 — What already ships

`apps/web/lib/papic-photo-styles.ts` — five looks, **real per-pixel pipelines** (tone curves, channel
WB, split-toning, grain, bloom, chromatic aberration, vignette), running **on the guest's own device**
`[VERIFIED-CODE]`. Cost to us: **₱0**, same as face embedding.

| Code | Label | Blurb |
|---|---|---|
| `ORIG` | Orig | Clean & true — a touch more pop |
| `RETRO` | Retro | Warm film, matte shadows, fine grain |
| `MONO` | Mono | Rich black & white, bright skin |
| `CINE` | Cine | Teal & orange, soft bloom, widescreen |
| `LOMO` | Lomo | Lo-fi toy camera — saturated, leaky |

Also shipped: `events.papic_style` (event-wide, migration `20270307004141`) ·
`studio/papic/style-picker.tsx` · wired into guest + seat capture, the public event page, the Kwento
decorator and the demo · already a Demand Radar dimension.

**The only structural gap: it is not surfaced in the purchase/setup flow.** The owner asked for the
theme to be chosen *"in the beginning"* — that is a placement change, not a build.

---

## § 2 — 🔒 Constraints that must not break

| | Why |
|---|---|
| **Faces embed from the CLEAN frame, BEFORE styling** | MONO crushes colour, LOMO shifts channels, CINE re-tones — each wrecks face-api's 128-d descriptors and would **silently** tank the ≥0.85 auto-tag. Order is `draw clean → embed → applyPapicStyle → stamp → encode` |
| **CINE letterboxes, never crops** | it paints 2.39:1 bars so frame size and every face box are unchanged, preserving the untagged-still-delivered and mixed-aspect guarantees |
| **`cssPreviewFilter` must track the real pipeline** | it is the live viewfinder. The module states it is *"only an APPROXIMATION (CSS can't do grain / bloom / channel-shift / light leaks)"* — but if it drifts, **the shooter frames one look and gets another.** Retune both in the same commit |

⚠ **Known gap, and it gets worse here:** *"V1 has no video render pipeline, so clip BODIES stay
un-styled; the clip POSTER frame is styled."* A colour shift is subtle. **A date stamp is glaring** —
a stamped thumbnail beside an unstamped video. Decide whether Retro ships stamped before clips can
carry it.

---

## § 3 — Retro → the **Kodak+** curve (owner-approved)

Sepia is the wrong tool: it desaturates *then* tints uniformly, flattening reds and greens. Kodak is
**channel-specific**, not a wash.

| | Shipped | Kodak | **Kodak+ ← adopted** |
|---|---|---|---|
| sepia | 0.16 | 0.10 | **0.05** |
| saturate | 1.05 | 1.18 | **1.34** |
| contrast | 0.92 | 0.90 | **0.82** |
| hue-rotate | — | −6° | **−9°** |
| shadow lift | — | — | **warm, matte** |

**The shadow lift is the point.** A matte, warm-brown black is the most recognisable Kodak trait —
more than the highlight warmth. It is also the part the prototype could only fake.

### 3.1 Two implementation notes

**Use SPLIT-TONING, not a global wash.** The mock used a screen-blend overlay, which also lifts
highlights — that is why the string lights read milky in it. The real pipeline **already does
split-toning**: warm the shadows, leave highlights alone. The correct version is a curve, not an
overlay.

**The real output can go flatter than the mock.** Contrast 0.82 looks hazy in CSS because there is no
grain. In the shipped pipeline, fine grain adds perceived micro-detail and rescues flatness — which is
exactly why real film is low-contrast without looking soft. **Do not judge the target by the CSS
approximation.**

### 3.2 Target characteristics (for the curve author)

- **Highlights** warm — push R and G, pull B slightly
- **Shadows** lifted and warm, never crushed to neutral black
- **Midtones** yellow-green shift *(this is what separates Kodak Gold from Portra — Gold is
  noticeably yellower in the greens; Portra stays neutral and warms only skin)*
- **Saturation** +30%, weighted to reds and yellows rather than uniform
- **Contrast** reduced — film is flatter than digital
- **Grain** fine, always present

---

## § 4 — The date stamp

Classic Kodak stamps carry date and sometimes time. **An event name is a deliberate departure** —
authentic cameras never knew it — but it works if it stays short.

```
MARIA & JUAN
'26 7 21  14:32
```

| | |
|---|---|
| Position | lower right |
| Colour | amber-orange with a slight bloom |
| Face | 7-segment ideal; monospace + letter-spacing + glow gets most of the way without loading a font |
| Date source | **`captured_at`**, never upload time |
| Format | `'26 7 21` — year first, apostrophe, no zero-padding |

⚠ **Names break it.** *"Maria Cristina & Juan Carlos Dela Cruz"* will not fit and looks wrong.
**Derive from first names only**, or let the couple set a short stamp label. **Cap at ~18 characters,
no wrapping.** Allow off — some couples want the pure date.

**Toggle, not a new style.** Bake it into `RETRO` with a single event-level off switch. Do **not**
split Retro into stamped/unstamped variants — the style count stays at five and no new codes are
minted.

**🔒 RETRO ONLY — owner-decided 2026-07-21. The other four NEVER carry a stamp.**

| | Stamp |
|---|---|
| `RETRO` | **amber — the only one** |
| `ORIG` · `MONO` · `CINE` · `LOMO` | **none, ever** |

*(A per-style stamp colour was considered and dropped for simplicity. The reasoning is worth keeping
in case it returns: the date back was an **LED exposing the film itself**, so it prints amber on
colour stock and **white on B&W** — an amber stamp on MONO is a physical contradiction. And CINE's
lower-right sits **inside the 2.39:1 letterbox bar**, so a stamp there would print on black. If the
stamp is ever extended beyond RETRO, those two constraints bind.)*

---

## § 4b — Mono, Cine and Lomo — the three other retunes

Each shipped look has a **different structural flaw**, and none of them is a matter of taste.

### Mono — channel-weighted grey, not flat desaturate

`grayscale(1)` applies standard luma (**0.299R · 0.587G · 0.114B**), which leaves skin muddy and
blues too bright. Real B&W film shot through an orange filter weights red heavily.

**Target: ~0.50 R · 0.40 G · 0.10 B**, plus a slight black lift and a gentle S-curve. Skin lifts,
blues deepen — which is the *"bright skin"* the shipped blurb already promises and does not deliver.

### Cine — `hue-rotate` is the bug

Teal-orange requires shadows and highlights to move in **opposite** directions. `hue-rotate` rotates
**every** hue uniformly, so they move together and the split collapses into "slightly cyan
everything."

**Target: true split-tone via per-channel transfer curves** — teal into the shadows, orange into the
highlights, plus the existing soft bloom and the 2.39:1 bars. Roughly:

| Channel | Shadow → highlight |
|---|---|
| R | `0.02 → 0.30 → 0.68 → 1.00` *(highlights push warm)* |
| G | `0.03 → 0.32 → 0.63 → 0.95` |
| B | `0.14 → 0.42 → 0.58 → 0.82` *(shadows lifted cyan, highlights pulled)* |

### Lomo — the curves are the only missing piece

Cross-processing is fundamentally **non-linear**, and CSS has no primitive for it. LOMO already ships
chromatic aberration, light leaks and a vignette — **only the per-channel power curves are absent.**

**Target: `R^1.2 × 1.10` · `G^1.1 × 1.05` · `B^0.9 + 0.05`** — the blue offset is what lifts shadows
toward cyan, which is the cross-process signature. Then saturation ~1.5 and a heavier vignette.

### ⚠ Where these run

The prototypes were built with SVG (`feColorMatrix`, `feComponentTransfer`) because those are the
primitives the fixes need — **but that is a SPECIFICATION OF THE TARGET, not the implementation.**

| | Use |
|---|---|
| **Live viewfinder** | **keep CSS.** The module chose it deliberately for zero CPU; SVG filters over a live `<video>` are materially slower on mobile, which is the only device this runs on |
| **Capture pipeline** | implement in the existing **per-pixel JS**, which can do all of this more precisely than either prototype |

And neither prototype shows grain, bloom, chromatic aberration or light leaks — so **the real output
beats both columns.** Judge the final by a real capture, never by the approximation.

---

## § 5 — Drag mode (motion blur) — a CAPTURE axis, not a style

**You cannot fake this from one frame.** Motion blur is temporal; a post-process on a single sharp
frame can only smear the whole image, which reads as camera shake rather than a subject moving
through a static scene.

**Do it for real: blend 8–12 frames over ~300 ms.** Video frames already stream through the capture
surface, so this is canvas compositing with falling opacity — moving things smear, static things stay
sharp. Authentic, on-device, **₱0**. It produces the flash-drag disposable-camera look: a face frozen
while lights and hands trail.

### 5.1 The face-embed order saves it

```
frame 1 (sharp) → embed faces → blend frames 1..N → applyPapicStyle → stamp → encode
```

**Embed from the first, sharpest frame; blur only the output.** A blurred face would wreck the
descriptor and quietly degrade auto-tagging.

### 5.2 Consequences

| | |
|---|---|
| **Second axis** | it is *look* × *shutter*. Drag pairs with any of the five styles — it does not slot into `PAPIC_STYLES` |
| **Shutter is no longer instant** | ~300 ms. The chrome must show a brief hold state, or it reads as a bug |
| **Needs a fallback** | on a slow phone the frames arrive sparse and the blur goes chunky. Below a minimum frame count, **drop to a single frame** rather than ship something ugly |
| **Per-shot, never event-wide** | blurry photos delight occasionally and ruin 3,000. The five styles are already per-shot on the capture chrome; Drag joins them there |

---

## § 6 — Open

1. **Labels were never product-reviewed.** *"Retro"* is developer shorthand; the owner called it
   **"Film"**. Codes are permanent (schema CHECK + existing rows) but **labels are display-only and
   change freely** — same rule as `roll` → "Papic Mini". Candidates: True · **Film** · Black & White ·
   Cinema · Toy Camera.
2. **Surface the picker in the setup flow** (owner asked for it "in the beginning"). Placement only.
3. **Does Retro ship stamped before clip bodies can carry the style?** § 2.
4. **Visual pass with real photographs before merge.** Film emulation is judged by eye, not by
   numbers, and every value here was tuned against a stylised mock.

---

*Compiled 2026-07-21. The engine, the event-level column and the picker are all shipped; these are
three additions plus a placement fix.*

---

## § 7 — Accurate Looks via our own LUTs (owner-decided 2026-07-21)

**Hand-tuned per-channel curves top out around 70% fidelity.** They structurally cannot capture
cross-channel behaviour — how a saturated red behaves differently in shadow than in highlight — which
is most of what makes film read as film. Accurate emulation needs a **3D LUT**.

**LUTs are already in the architecture:** the corpus specifies renders as *"template-driven via
Remotion + Lottie + **LUTs**."* This extends the same asset class to capture.

### 7.1 🔑 What a LUT can and cannot do

| | |
|---|---|
| **LUT handles** | **colour only** — the full 3D transform. Curves, cross-talk, hue shifts, black/white points |
| **LUT CANNOT handle** | anything **spatial**: grain · halation · bloom · vignette · chromatic aberration · light leaks |

**A LUT has no spatial component — it is a per-pixel colour mapping.** So the existing procedural code
does **not** get replaced; it composes with the LUT:

```
draw clean → embed faces → LUT (colour) → grain + halation + vignette + CA (spatial) → stamp → encode
```

That split is the whole design. Do not try to bake grain into a LUT; it is mathematically impossible.

### 7.2 The reference for each Look

| Look | Target |
|---|---|
| **Retro** | **Kodak Gold 200** — consumer stock, yellow-shifted greens, warm. *This is literally the film in a disposable camera*, which is what Papic is. (Portra 400 is the "professional" alternative: neutral, warms skin only. **Gold is right for this product**) |
| **Mono** | **Kodak Tri-X 400** + orange filter — punchy, grainy, luminous skin. Matches the shipped blurb's "bright skin" better than Ilford HP5+, which is softer and flatter |
| **Cine** | ⚠ **NOT a film stock.** Teal-orange is a post-2000s digital grade. Honest reference = **Kodak Vision3 2383 print stock + the grade**. Say so internally rather than pretending it is emulation |
| **Lomo** | **Cross-process — E-6 slide film in C-41 chemistry** (Elite Chrome · Sensia · Agfa Precisa). Extreme contrast, cyan-green shadows, blown warm highlights |

### 7.3 How to generate them — the practical method

**Grade-to-match in DaVinci Resolve (free), validated against reference photographs.**

This is how commercial packs are made. Shooting our own reference charts on real film (colour target →
lab → scan → compute the transform) is the gold standard but needs film, a lab, a scanner and
controlled lighting for four stocks — weeks of calendar for a marginal gain. **And for CINE it is not
even possible**, because there is no stock to shoot.

**Process per Look:**

1. Collect **reference photographs** known to be shot on that stock — varied: skin, sky, foliage,
   tungsten interior, high-contrast
2. Take a **neutral digital frame** of a comparable scene
3. Grade in Resolve until it matches the reference by eye
4. **Export the node graph as `.cube`**
5. Validate against a *second, unseen* reference set — the check that catches over-fitting to one image

### 7.4 Format and delivery

| | |
|---|---|
| Format | **`.cube` at 33³** (35,937 entries). 17³ is too coarse for film curves; 65³ is overkill on a phone |
| Web delivery | **encode as a HALD PNG strip** — 1089 × 33 px, **a few KB each** |
| Hosting | **R2, like the face models** (`NEXT_PUBLIC_FACE_MODEL_URL` pattern) — free egress, and it keeps the JS bundle untouched |
| ⚠ Custom domain | same trap as the face models: **do not serve from rate-limited `r2.dev`.** Put the LUT bucket behind `media.setnayan.com` or a packed wedding will throttle |

### 7.5 Applying it on-device

Load the PNG → read into a `Float32Array` → **trilinear interpolation** per pixel.

⚠ **Benchmark this.** A 3D LUT with trilinear interpolation is heavier than today's per-channel
curves — roughly 10–20 ops per pixel, so **~74M ops on a 3.7 MP frame**.

> 🔴 **CORRECTION 2026-07-21.** This line originally said "~40M ops on a 2 MP frame", inherited from a
> stale comment in `papic-photo-styles.ts`. **Frames are ~3.7 MP** — `HI_RES = {width: 2560, height:
> 1440}` at `lib/use-papic-camera.ts:200` `[VERIFIED-CODE]`. The old figure under-costed this by
> **~1.85×**. **Every multi-frame proposal in this document — the LUT, Drag mode, night stacking —
> must be re-costed against 3.7 MP per frame.** Source comment fixed in PR #3450. The module's own perf note says
the current heaviest pass is *"well under a deliberate shutter's budget"*, but that was measured
**without** a LUT. **If pure JS is too slow, WebGL is the escape hatch** — a LUT is a single texture
lookup on the GPU and would be trivially fast.

**The live viewfinder keeps CSS.** LUT application belongs on the captured frame only; running it on
every video frame is the thing that would actually hurt.

### 7.6 ⚠ Validation is not optional

**Accurate emulation is judged against photographs, never against parameters.** Every number in this
document was tuned against a stylised mock built from six flat colours.

Before any Look merges: a side-by-side pass with real photographs, ideally the same scene shot on the
actual stock. **Skin tone is the failure mode** — a LUT that flatters foliage and ruins skin is worse
than the hand-tuned curve it replaced, and skin is what a wedding gallery is made of.

### 7.7 Licensing

**Generating our own avoids the trap entirely** — commercial film-emulation LUT packs are licensed
products and cannot ship inside an app without a licence. **Do not let anyone download a `.cube` off
the internet and commit it.** Ours are ours.

⚠ The **reference photographs** used for grading are third-party works. They are a private input to a
grading session, not redistributed — but do not ship them in the repo or the bucket.
