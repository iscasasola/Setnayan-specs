# 0005 — FFmpeg + Lottie Reference

**Companion to:** `0005_led_background_maker.md`
**Purpose:** Concrete examples of what the FFmpeg + Lottie rendering pipeline looks like in code, plus links to existing wedding Lottie templates you can browse to evaluate the visual quality bar.

---

## Where the templates come from

The 10 LED background templates are not "found" — they're **designed**. You have two paths:

### Path A — License existing Lottie templates

LottieFiles has a large library of wedding animations, ornaments, and elegant motion graphics. Many are free; premium templates are typically $5–20 each. Browse:

- [LottieFiles · Wedding Event Animations](https://lottiefiles.com/free-animations/wedding) — free wedding-themed animations
- [LottieFiles · Wedding Day Animations](https://lottiefiles.com/free-animations/wedding-day) — additional wedding motion templates
- [LottieFiles · Marriage Animations](https://lottiefiles.com/free-animations/marriage) — celebration / marriage animations
- [LottieLab Templates](https://www.lottielab.com/templates) — premium motion graphics templates
- [Envato Elements · Lottie Templates](https://elements.envato.com/video-templates/lottie) — subscription-based, large library

For wedding monograms specifically, you'd typically **license a base ornament or wreath animation, then build the monogram + name reveal layer yourself** in After Effects. Total per-template content cost: $0–50 depending on what you license.

### Path B — Hire a motion designer

A wedding-specialist motion designer in the Philippines or via Upwork/Fiverr typically charges **$150–500 per template** for a custom 30-second loop in After Effects, exported as Lottie + reference MP4. Quality bar matches Renderforest's premium tier.

For 10 templates:
- License + tweak: ~₱5,000–25,000 total (cheap, fastest)
- Hire designer: ~₱75,000–250,000 total (custom, on-brand)
- Mix (5 licensed + 5 custom): ~₱40,000–125,000 total (recommended for V1)

---

## What a Lottie file actually is

Lottie files are JSON — the format After Effects exports via the Bodymovin plugin. Here's a heavily-simplified illustrative snippet showing the shape of the data:

```json
{
  "v": "5.7.0",
  "fr": 30,
  "ip": 0,
  "op": 900,
  "w": 1920,
  "h": 1080,
  "nm": "Filigree Bloom",
  "layers": [
    {
      "ty": 4,
      "nm": "Ornament Ring",
      "ks": {
        "p": { "a": 0, "k": [960, 540] },
        "r": {
          "a": 1,
          "k": [
            { "t": 0,   "s": [0]   },
            { "t": 900, "s": [360] }
          ]
        },
        "s": {
          "a": 1,
          "k": [
            { "t": 0,   "s": [100, 100] },
            { "t": 450, "s": [110, 110] },
            { "t": 900, "s": [100, 100] }
          ]
        }
      },
      "shapes": [ /* path data for the ornament */ ]
    },
    {
      "ty": 4,
      "nm": "Couple Names — TEXT_LAYER",
      "ks": { /* position, opacity keyframes for fade in */ },
      "t": {
        "d": {
          "k": [{ "s": { "t": "{{partner_a}} & {{partner_b}}", "s": 96 } }]
        }
      }
    }
  ]
}
```

The two key things to notice:

1. **Animation is a list of keyframes.** `"a": 1` means animated; `"k"` is the array of `{ time, value }` pairs. The renderer interpolates between them. Above: the ornament rotates 0→360° linearly across 900 frames (30s at 30fps).

2. **Text is parameterized.** The `{{partner_a}}` placeholder is what Lottie templates use for dynamic content — production substitutes the couple's actual names at render time. Same pattern works for colors, dates, and any other couple-specific value.

In practice, you don't write Lottie JSON by hand. The motion designer builds the animation in After Effects, marks certain text layers / color values / shape paths as parameterized, and exports. The renderer just substitutes the params and renders.

---

## What an FFmpeg filtergraph looks like

FFmpeg's filtergraph is the post-processing stage. It takes the Lottie-rendered PNG sequence (or MP4) and applies the additional effects that don't live in the Lottie file: particle overlays, color grading, film grain, light leaks, vignette, blur, etc.

Here's a real FFmpeg command for the **Filigree Bloom** template — composites the Lottie output with a particle layer, applies grain and a light leak, and outputs 8K H.264:

```bash
ffmpeg \
  -framerate 30 -i lottie_render_%04d.png \
  -i particles_loop.mov \
  -i light_leak_overlay.mp4 \
  -filter_complex "
    [0:v]format=rgba,scale=7680:4320[base];
    [1:v]format=rgba,scale=7680:4320,colorchannelmixer=aa=0.4[particles];
    [2:v]format=rgba,scale=7680:4320,colorchannelmixer=aa=0.25[leak];
    [base][particles]overlay=shortest=1:format=auto[withParticles];
    [withParticles][leak]overlay=shortest=1:format=auto[lit];
    [lit]curves=preset=increase_contrast,
         eq=brightness=-0.02:saturation=1.15,
         lutrgb=r='val*1.05':g='val*1.0':b='val*0.95',
         noise=alls=8:allf=t+u,
         vignette=PI/4
         [final]
  " \
  -map "[final]" \
  -c:v libx264 -preset slow -crf 18 \
  -pix_fmt yuv420p \
  -r 30 -t 30 \
  -movflags +faststart \
  output_8k.mp4
```

What that's doing, layer by layer:

- `format=rgba,scale=7680:4320` — normalize each input to 8K + alpha channel.
- First `overlay` composites the gold particle loop on top of the Lottie base (40% opacity via `aa=0.4`).
- Second `overlay` adds a soft light-leak gradient (25% opacity).
- `curves=preset=increase_contrast` — global contrast boost.
- `eq=brightness=-0.02:saturation=1.15` — slightly darker, more saturated.
- `lutrgb=r='val*1.05':g='val*1.0':b='val*0.95'` — warm color grade (push reds, pull blues).
- `noise=alls=8:allf=t+u` — film grain (alls=intensity, allf=temporal+uniform).
- `vignette=PI/4` — soft vignette around the edges.
- Encode H.264 at CRF 18 (high quality), 30fps, 30 seconds.

That single command produces an 8K MP4 ready for the venue's LED wall. Run time: roughly 5–8 minutes on a Cloudflare Container with FFmpeg compiled for your CPU.

---

## How the pipeline orchestrates

Pseudocode for the full render flow:

```typescript
async function renderLEDBackground(jobId: string, config: RenderConfig) {
  // 1. Load the template's Lottie JSON
  const lottieTemplate = await loadLottie(`/templates/${config.template_id}.json`);

  // 2. Substitute the couple's params (names, colors, monogram source)
  const lottieWithParams = applyParams(lottieTemplate, {
    partner_a: config.partner_a,
    partner_b: config.partner_b,
    monogram_svg: config.monogram_source === 'uploaded'
                    ? config.monogram_uploaded_url
                    : config.monogram_generated_svg,
    accent_color: config.background_color,
  });

  // 3. Render Lottie → PNG sequence at 8K
  // Using puppeteer-lottie or @lottiefiles/lottie-renderer-cli
  await renderLottieToFrames(lottieWithParams, {
    width: 7680,
    height: 4320,
    fps: 30,
    duration: config.loop_duration_s,
    output: `/tmp/${jobId}/frames/`,
  });

  // 4. Compose FFmpeg filtergraph with effects layered on top
  const ffmpegCmd = buildFilterGraph(config, {
    framesPath: `/tmp/${jobId}/frames/lottie_render_%04d.png`,
    overlays: getOverlaysForTemplate(config.template_id),  // particles, light leak, etc.
    grade: getColorGradeForTemplate(config.template_id),
    output: `/tmp/${jobId}/output_8k.mp4`,
  });

  // 5. Execute FFmpeg — the heavy lift
  await execFFmpeg(ffmpegCmd);

  // 6. Generate 4K + 1080p variants from the 8K master via FFmpeg scale
  await Promise.all([
    scaleAndEncode(`/tmp/${jobId}/output_8k.mp4`, 3840, 2160, `/tmp/${jobId}/output_4k.mp4`),
    scaleAndEncode(`/tmp/${jobId}/output_8k.mp4`, 1920, 1080, `/tmp/${jobId}/output_1080p.mp4`),
  ]);

  // 7. Upload all three to R2
  await uploadToR2(`led_backgrounds/${config.event_id}/${jobId}/`, [
    'output_8k.mp4',
    'output_4k.mp4',
    'output_1080p.mp4',
  ]);

  // 8. Update job row, send email
  await markJobComplete(jobId);
  await sendCompletionEmail(config.couple_email);
}
```

Total execution time per render: ~6–10 minutes for an 8K composition with ~12 layers. The 4K and 1080p variants are roughly 30 seconds each as additional FFmpeg scale passes.

---

## What the 10 templates would actually be

Each template = one Lottie file + one FFmpeg config + a thumbnail MP4. Practical breakdown:

| Template | Lottie content | FFmpeg overlays / effects |
|---|---|---|
| Filigree Bloom | Animated filigree paths + monogram + names + ornament ring | Gold particles, soft light leak, warm grade, grain, vignette |
| Capiz Shimmer | Layered capiz-shell shapes pulsing | Pearl glints overlay, cool grade |
| Sampaguita Drift | Petals falling, monogram center | Bokeh layer, soft focus, warm grade |
| Gold Particles | Monogram + frame minimal | High-density particle stock loop, deep grade |
| Ethereal Mist | Misty volumes scaling | Cloud overlay, blur, cool grade |
| Bokeh Lights | Defocused circles drifting | Multi-bokeh stock layers, depth grade |
| Watercolor Wash | Multi-color watercolor blooms | Paper texture overlay, warm-cool shift |
| Slow Pulse | Single concentric circle, monogram emphasis | Minimal grain, neutral grade |
| Constellation | Stars connecting/rotating | Star particle overlay, deep navy grade |
| Velvet Sweep | Ribbon-like color sweep | Subtle grain, jewel-tone grade |

The Lottie files handle the **structured animation** (paths, geometry, text). The FFmpeg layers handle the **organic texture** (particles, grain, color grade). Combined, you get Renderforest-class polish.

---

## Cost breakdown (vs Remotion option)

| Category | FFmpeg + Lottie | Remotion |
|---|---|---|
| Library/license | Free (FFmpeg) + $0–50/template (Lottie content) | $75–125/month commercial license |
| Per-render compute | ~₱10–50 (Cloudflare Container) | ~₱50–150 (Lambda) or self-host like FFmpeg |
| Engineering effort | Medium — write filtergraph templates + Lottie loader | Low — write React compositions |
| Visual quality ceiling | Excellent (FFmpeg + good Lottie content matches Renderforest) | Excellent (same — just programmed differently) |
| Iteration speed | Slow — designers in After Effects round-trip | Fast — engineers iterate in code |
| Customization range | Bounded by template params | Unbounded (full React) |

**The honest tradeoff:** Remotion is more pleasant for engineers; FFmpeg + Lottie is cheaper at scale. For 10 fixed templates with bounded customization (which is exactly what 0004 is), **FFmpeg + Lottie wins on margin** because you avoid the recurring license fee. For a future feature where couples build custom animations, Remotion would win on flexibility.

---

## Recommended V1 stack (locked decision)

- **Render orchestrator:** Node.js worker on Cloudflare Containers, running FFmpeg compiled with libx264.
- **Lottie renderer:** `@lottiefiles/lottie-renderer-cli` or `puppeteer-lottie` to convert Lottie JSON → PNG sequence at 8K.
- **FFmpeg post-process:** filtergraph per template, configured via JSON, applied to the PNG sequence + overlay assets.
- **Overlay assets:** purchase a one-time pack of high-res particle/bokeh/light-leak loops from Motion Array, Envato Elements, or similar (~$50–100 one-time license, reusable across all templates).
- **Templates source mix:** 5 licensed wedding Lottie files + 5 custom-designed by a motion designer = ~₱75,000 total content cost.
- **Cost per render at scale:** ~₱20–60 in cloud compute. Charging ₱99 single render = healthy margin.

---

## Sources

- [LottieFiles · Wedding Event Animations](https://lottiefiles.com/free-animations/wedding)
- [LottieFiles · Wedding Day Animations](https://lottiefiles.com/free-animations/wedding-day)
- [LottieFiles · Marriage Animations](https://lottiefiles.com/free-animations/marriage)
- [LottieLab Templates](https://www.lottielab.com/templates)
- [Envato Elements · Lottie Templates](https://elements.envato.com/video-templates/lottie)
- [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html)
- [Motion Array · 30 Bokeh Overlays](https://motionarray.com/learn/video-effects/bokeh-overlays/)
- [Motion Array · 45 Bokeh & Light Leaks Transitions](https://motionarray.com/stock-motion-graphics/45-bokeh-light-leaks-transitions-29733/)
- [Enchanted Media · Free Bokeh Light Leak Overlays](https://www.enchanted.media/downloads/free-bokeh-light-leak-overlay-transitions/)
- [My Digital Gobo · Animated Monograms portfolio](https://mydigitalgobo.com/portfolio_category/animated-monograms/) — visual reference for the quality bar
