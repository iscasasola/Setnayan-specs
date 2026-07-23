# Monogram_Maker_Council_Verdict_2026-07-17

> **Owner ask (verbatim):** "fix the monogram maker. use the council to replot the whole UX and UI of this feature. check what you can improve on how we create the logo, how we add frames (instead of drawing), lets provide different patterns? or keep lines and add fram patterns they can combine to create a pattern. And the animation."
>
> **Council:** 5 councilors (first-five-minutes usability · monogram/lettering design · frames & patterns · animation/reveal · defect audit) + 2 adversarial critics (feasibility · scope) + synthesis judge. All read the live engine at `~/Documents/Claude/Projects/setnayan-platform` `origin/main`.
>
> **Per the working model (Fable plans · Opus codes):** this document is the spec. Implementation PRs go to Opus, reuse-first, flag-off where marked.
>
> **Build state (2026-07-17 · ALL SIX PRs SHIPPED same day):** PR-1 §1 defects = [#3344](https://github.com/iscasasola/setnayan-platform/pull/3344) MERGED · PR-2 §5.1–5.3 upsell honesty = [#3346](https://github.com/iscasasola/setnayan-platform/pull/3346) MERGED · PR-3 §2 tabs+reskin = [#3350](https://github.com/iscasasola/setnayan-platform/pull/3350) MERGED · PR-4 §4 frame shelf = [#3351](https://github.com/iscasasola/setnayan-platform/pull/3351) MERGED · PR-5 §3 starting points = [#3352](https://github.com/iscasasola/setnayan-platform/pull/3352) · PR-6 §5.4–5.7 tempo chips = [#3353](https://github.com/iscasasola/setnayan-platform/pull/3353) (stacked, auto-merge armed). Every slice verified live on the v2 public studio; flag OFF verified byte-identical v1. **Owner launch steps:** (1) flip `NEXT_PUBLIC_MONOGRAM_STUDIO_V2=1` in Vercel once #3353 merges; (2) the §1.5 real-device touch pass — owner has iPhone + MacBook only (2026-07-17): the **iPhone pass covers the riskier engine (iOS WebKit)** — thumb-scroll from canvas · drag letter · pinch-then-lift-one · tap-to-skip · Names typo; Android Chrome ≈ desktop Chrome (synthetically exercised), stays a soft caveat until an Android is in reach; (3) eyeball the 12 frame patterns + 5 preset compositions on the Vercel preview and tune any recipe defaults. P2 queue (§7) unchanged — per-crossing weave next in line.

**Scope:** `apps/web/lib/monogram-studio/engine.ts` (1,784-line paper.js + opentype.js engine) · `apps/web/lib/monogram-studio/markup.ts` (shared `STUDIO_HTML` + scoped CSS) · `apps/web/lib/monogram-studio-shared.ts` (StudioConfig + sanitizers) · `apps/web/app/dashboard/[eventId]/monogram/{page,studio,animated-monogram-upgrade}.tsx` · `apps/web/app/monogram/public-monogram-studio.tsx` · reveal players (`studio-reveal-player.tsx`, `gold-monogram-reveal.tsx`, `molten-monogram-inline.tsx`) · `lib/monogram.ts` / `lib/monogram-motion.ts`. Recon baseline: five councilor briefs (usability · logo-creation · frames-patterns · animation · defect audit) plus feasibility and scope critiques, all read against the `origin/main` working tree; both critics independently re-verified the load-bearing line cites (`derive` wiring at engine.ts:1605, per-pair `pkey` at :331, the fill-only export walk at :1701–1706, the six-signature upsell copy at animated-monogram-upgrade.tsx:122–125).

**The organizing ruling:** The engine is right, the doorway is wrong, and the paywall lies. The paper.js + opentype machinery — per-crossing booleans, mirrored pen, procedural symbols, a pure-data config behind a reject-don't-repair sanitizer — is genuinely good and is KEPT wholesale. But the studio opens on a dead typeset seed with zero overlap (engine.ts:296–330), so its signature capability is undiscoverable; the only way to get a frame is freehand drawing that non-designers on mid-range Androids cannot do; the reveal ships as a collapsed accordion (markup.ts:194); a single keystroke in Names destroys the design and the undo history (engine.ts:1605); and the ₱999 upsell previews six motions the hero will never play, on a mark that isn't the couple's (animated-monogram-upgrade.tsx:122–125, 290–300 vs hero-monogram.tsx:97–110). The verdict therefore lands in this order: **fix the defects, make the paywall honest, then re-door the studio** — starting points in, drawing demoted (not deleted), a parametric frame library, the reveal promoted to a first-class step — with every addition compiling down to the existing StudioConfig so old marks re-open untouched. Six PRs, one flag (`monogram_studio_v2`), zero migrations, sanitizer stays reject-don't-repair, saved SVG stays pure paths.

---

## 1 · The fix list (the owner said "fix" — this ships first, PR-1)

All from the defect audit, adopted P1 by both critics unless noted. Each fix is unconditional — no flag, no redesign dependency.

1. **CHANGE — D1, Names input wipes the design + undo.** Guard lives in the **input-listener path** (wrap the engine.ts:1605 listener), NOT inside `derive()` — `applyConfig` deliberately calls `derive()` at :1638 and depends on its full reset (feasibility correction, adopted). If computed letters are unchanged → return; if changed → preserve per-index `st` where letters persist and push ONE undo entry instead of clearing both stacks.
2. **CHANGE — D2, lying copy.** markup.ts:109 + studio.tsx:190 promise letter rotation and pinch-resize that don't exist (gold dot only scales, engine.ts:1259–1262; pinch is always viewport zoom, :1217–1221). Copy becomes honest now; real letter rotation is P2.
3. **CHANGE — D3, gold/molten overlay has no exit.** Add ✕ on the React portal overlay (studio.tsx:236–253); clear it on any edit gesture and on mode/tab switch via one `onPreviewKind(null,null)` hook in the mode handler (engine.ts:1341–1352).
4. **CHANGE — D4, animation locks the editor for up to ~50 s.** Any `pointerdown` during `animating` calls `endAnim` (tap-to-skip); cap total run so per-item stagger scales to keep the run ≤ `dur + 2s`. This is a hard prerequisite for every reveal-promotion ruling below.
5. **CHANGE — D5 + D6, gesture politeness.** Wheel zoom only with `ctrlKey`, else the page scrolls (engine.ts:1318–1329); mobile `touch-action: pan-y` with `preventDefault` only on actual letter/symbol/handle hits (real-device pass required — it interacts with pointer-capture drags). Same surgery fixes D6: on pointerup with one finger remaining, don't force `mode='move'` (engine.ts:1311–1314) unless that pointer originally hit the selected letter.
6. **CHANGE — D7, no-op undo entries in draw mode.** Gate the pushes at engine.ts:1147/1156 behind the same moved-check arrange mode uses (:1289–1306).
7. **CHANGE — D8, symbol rotation drift.** Wrap, don't clamp, `rot` in `serialize()` (two lines; sanitizer clamp at monogram-studio-shared.ts:214 stays).
8. **CHANGE — D11, global Cmd/Ctrl+Z hijack.** `keyHandler` (engine.ts:1517–1528) bails when `e.target` is an input/textarea.
9. **ADD — a11y five-attribute pass (D15 partial).** `aria-live="polite"` on `#ro` (markup.ts:204), `aria-label`s on the four sliders + Names.
10. **ADD — surrogate-safe first-character split** (`Array.from` at engine.ts:302–306) + empty-glyph guard around the clone at :685, closing the suspected blank-canvas crash cheaply.

**P2 defect remainder:** D9 load-timeout/retry moved into the engine, D10 undo capturing colors/font, D13 rAF-throttled sliders using `fast()` (engine.ts:1463–1490), D14 draw-mode pan, real letter rotation, draft carry-through on non-CTA exits.

---

## 2 · The new spine: Letters · Frame · Reveal

Three councilors independently invented this restructure (usability-R3, frames-R4, animation-R8). Merged into one ruling; ships as PR-3 behind `monogram_studio_v2` (one flag covers dashboard + public — markup is shared verbatim).

1. **DELETE — the `Arrange | Draw frame` mode toggle** (markup.ts:108) and **the edithint paragraph** (markup.ts:109; `syncUI` already null-guards it at engine.ts:961–962). Replaced by three section tabs — **Letters · Frame · Reveal** — a segmented control pinned above the panel on mobile, atop the right column on desktop (container query at markup.ts:87–94 unchanged). Engine note (feasibility): tabs are panel-visibility state; `drawMode` becomes true **only while "Draw your own" is open inside the Frame tab**, and `syncUI` (engine.ts:963) learns the tab state — otherwise pen boxes reappear in the wrong tab and Frame-tab canvas taps would start strokes.
2. **CHANGE — panel order to the couple's mental order:** Canvas → starting-points strip (§ 3) → Names → Font → Colours → tabs. One static hint line ("Tap any letter to move it") replaces the six-instruction wall; selection-driven pro boxes keep appearing exactly as today — that progressive disclosure already works.
3. **CHANGE — sticky Save on mobile.** Wrap the existing save form (studio.tsx:257–263) in a bottom-sticky bar — React territory outside the inert subtree, no engine surgery. **No live thumbnail** (killed: `getExport()` runs `full()` twice per call — a jank machine on target hardware). Fit/Reset move into an overflow "⋯".
4. **CHANGE — atelier+glass reskin in the same markup rewrite** (constraint 6): Hanken Grotesk + Space Mono + gold replace Manrope/DM Mono/Cardo + mulberry throughout markup.ts:13–95; both host pages must load the faces; font-preview chips keep their own faces. Touch this CSS once.

---

## 3 · Owner ask 1 — how the logo gets created

**The diagnosis stands:** the seed is a font specimen, not a monogram — letters side-by-side at `offX=(i-1)*FS*0.36`, ampersand frozen at 0.62 (engine.ts:296–330), zero crossings, so the interlock engine (engine.ts:650–754) is invisible.

1. **ADD — the starting-points strip (PR-5).** Usability-R1 and logo-R1 proposed the same feature twice; merged with logo's implementation (each preset is a generator `build(letters) → Partial<StudioConfig>` — `applyConfig` at engine.ts:1609 already restores exactly that shape against deterministically-indexed letters) and usability's placement (horizontal strip of cards directly under the canvas, each rendered with **her actual initials**; "Blank · start from scratch" last). **Six presets, not twelve** (scope critic): *Duo repaired* (today's layout with per-font ampersand scale + tightened spacing via preset `st` values — safe under the current pivot), *Interlocked*, *Stacked*, *Framed duo* (compiles to a `frames[]` recipe, never baked strokes), *Solo with ring*, *Blank*. **At least three ship with a crossing decision already applied** — she sees the weave exist before being asked to understand it. The Interlocked preset's overlap uses logo-R1's deterministic bisect (nudge x-offset until intersection area lands in an 8–14% band of union area, using the same `intersect` calls `full()` makes) so it is font-proof; the bisect ships inside the preset builders in PR-5.
2. **Thumbnail implementation ruling (feasibility):** the engine cannot mount headless (`mountStudio` hard-requires the full DOM). Preset thumbnails render through the **single mounted instance** — transient apply → `getExport()` → restore (the pattern `buildExportSVG` already uses at engine.ts:1691–1699) — generated lazily on idle after first paint. Parallel offscreen mounts are rejected.
3. **ADD — `preset?: string` provenance field**, absorbing logo's separate `layout?` (one field, not two). Analytics only; rendering never reads it.
4. **DEFER (P2, first in line) — per-crossing weave (logo-R2).** The logo councilor declared this "never cut"; **the logo councilor loses on timing** to the scope critic, for two reasons the feasibility critic supplied: (a) `hit[i].intersect(hit[j])` at engine.ts:663 returns ONE compound per pair — "regions[] already enumerates crossings" is false as written; region decomposition + deterministic ordering + a centroid-rebind heuristic must be built, and `i-j-k` keys can rebind after re-edit (bounded regression: the saved SVG is always right, the reopened weave may need one tap); (b) the Interlocked preset ships correct today on single-crossing lockups with whole-pair booleans. The upgrade (`cut_swap` inside the :726–740 subtract loop, legacy `i-j` = all-regions) slots in later with zero migration, and it upgrades preset #2 in place. It is the one PR in this packet budgeted to slip.
5. **DEFER (P2) — baseline + optical placement (logo-R3), behind a config version.** The "ten invisible lines" framing loses to the feasibility critic: every saved `st[].tx/ty` was authored against the `bounds.center` pivot (engine.ts:347–354); changing `lp()` re-interprets stored coordinates and shifts every reopened mark. Requires `v: 2` — legacy configs render on the old pivot forever; fresh derives get baseline + optical scale.
6. **DEFER (P2) — joiner + three initials, trimmed.** Joiner becomes an enum (`amp_script | plus | none`) resolving to a hardcoded face internally — the general per-letter `fontKey` override is killed as over-general for one glyph. Canonical indexing is mandatory: L=0, joiner=1, R=2 always, joiner glyph simply absent on `none` — reindex-on-toggle is a config-corruption machine (feasibility). The 3-initials toggle ships as a toggle only; the caption/date lockup is killed outright (§ 8).
7. **DEFER (P2) — font roster swap (logo-R6), amended.** Never remove `'playfairsc'` from `STUDIO_FONT_KEYS` — the sanitizer's `oneOf` would silently rewrite old configs to `cardo`, changing saved marks on re-edit. Keep key + self-hosted TTF forever; remove only the chip; add Cormorant as one OFL file + one key. Suitability tags on chips are killed.

---

## 4 · Owner ask 2 — frame patterns, and the explicit fate of the pen

**Ruling on the owner's "or keep lines" question: the freehand pen SURVIVES — demoted, not deleted.** The Frame tab opens on the pattern shelf; a "✎ Draw your own" chip inside it reveals today's full pen/nib/mirror box (markup.ts:123–133) unchanged. Patterns are the doorway; the pen is the personalization layer on top. **Combination is free by construction:** `mirCopies` scales about `Point(0,0)` (engine.ts:578, verified), so a 4-way-mirrored hand flourish lands symmetrically *on* a wreath or ring; pattern frames ignore the mirror setting (intrinsically symmetric); stamps still sit on top. That is the owner's "combine to create a pattern," answered.

1. **ADD — `frameBuilder(kind, params)` (PR-4)**, sibling of `symBuilder` (engine.ts:403–440), every frame generated from a compact recipe; the only stored assets are two or three hand-authored flourish path strings shipped in the module (one-time authored — constraint 5 clean). Shared primitive `repeatAlongPath` = native `getPointAt`/`getTangentAt`.
2. **CHANGE — catalog is 12 kinds, not 16** (frames councilor loses four per their own cut list; the scope critic's "11" was a miscount of the same trim): `ring · double-ring · open-ring · diamond · cartouche · arch · scallop · laurel · wreath · sampaguita · corner-lines · corner-flourish`. Dropped: deco-fan, sun-crest, dotted-ring, oval. **Sampaguita and laurel are unconditional keeps — the Filipino identity pieces.**
3. **ADD — auto-fit as the default.** Frame sizes itself to the letter layer's bounds (computed before `decor()` adds overlay chrome) + inset. One tap = composed mark. V1 UI exposes Size + that pattern's 2–3 sliders only; `tx/ty` stay in the config, drag handles are P2.
4. **⚠ OWNER-OVERRIDDEN 2026-07-17 (app PR #3357), same day as shipping:** on first look at the shelf the owner ruled "we want frames that can intertwine to each other. and accent frames also" — the stack is now **≤4 (2 enclosures + 1 corner set + 1 accent)**, two band enclosures **weave over/under at their crossing lobes** (auto-offset + pre-woven on apply; ⤫ Weave toggle + Offset ↔ slider), and an **accent class** shipped (Side sprigs · Cardinal marks · Sparkle pair). §8.12's "stack of 3 killed" is dead. Original ruling kept below for lineage. **CHANGE — stack of TWO, not three** (one enclosure + one corner set covers ~90%). Fixed z-order, written down as the canonical export sequence to end the frames/animation conflict: **frames → letters → strokes → symbols** — frames on a new `frameLayer` inserted **below** the letter layer, letters winning over rules (the whole point of `open-ring`), while strokes/syms **stay above letters exactly as today** (feasibility amendment: moving them would silently change every existing saved config). `buildExportSVG` collects in that order.
5. **CHANGE — every frame bakes to FILLED geometry.** The export walk keeps only filled children (engine.ts:1701–1706), so `arch` and all line-like recipes are closed filled bands via PaperOffset `offsetStroke` (already a mount dependency), per the evenodd-ring precedent at :406–416. Sanitizer and 260 KB cap untouched.
6. **ADD — picker shelf:** mobile snap-scroll cards, desktop 3-across grid; **static thumbnails around a canned M·J silhouette in v1** (live-mark regeneration is P2 polish); tap applies with auto-fit, tap again removes; applied frames show as chips (× to delete). Frame colour defaults to the current outline colour (gold) — existing swatch rows reused, no new palette UI.
7. **Hard coupling (feasibility, binding):** frames can add ~hundreds of export paths; **PR-4 must include the normalized-stagger fix (§ 5.5) in the same release** — under today's `i * staggerMs` player math (studio-reveal-player.tsx:113) a repeated frame turns the reveal into a minute-long slideshow.

---

## 5 · Owner ask 3 — the animation

1. **DELETE — the six-signature `MONOGRAM_MOTIONS` pitch for studio marks (D12, PR-2).** The paid section sells "Drawn, Foil, Bloom, Editorial, Halo, Stardust" (animated-monogram-upgrade.tsx:122–125) while the live hero plays only the studio anim for studio marks (hero-monogram.tsx:97–110). One taxonomy per page: when a studio mark exists, copy/preview/confirmation speak only the five studio reveals. `MONOGRAM_MOTIONS` survives solely for the fallback-lockup path (hero-monogram.tsx:127–147).
2. **CHANGE — the buy + owned previews render the couple's real mark (PR-2).** `UnownedView` (:290–300) and `OwnedView`'s "exactly how it animates" (:195–211) switch to `<StudioRevealPlayer svg={monogram_custom_svg} anim={studioAnim}>` — the identical component the hero uses. Guard: pass `allowWebgl={false}` (or coordinate with the studio's molten portal) — one live WebGL context per mid-range phone. Highest revenue leverage per line in the packet.
3. **CHANGE — the free/paid line is said where the choice is made (PR-2).** Persistent status line under the reveal chips: owned → "Plays live on your website"; unowned → lock chip, "Guests see it live with Animated Monogram · ₱{catalog price}" scrolling to the buy section. Price threads via `mountStudio` opts or a React sibling **below** the card — React never reaches into the inert subtree. Public studio copy: "Included when you claim your event." The gate itself is unchanged (constraint 3: free studio never gated; ₱999 gates only the live reveal).
4. **CHANGE — three sliders become three tempo chips (PR-6):** Quick · Classic (default) · Ceremonial, each writing `dur/smooth/delay` internally — wire format untouched. A "Fine-tune" disclosure keeps the raw sliders (they already exist; collapsing is one class). **Usability-R4 loses to this** — its per-chip auto-play is superseded by auto-play-on-tab-entry, and chip-tap already auto-plays today (engine.ts:1363–1369).
5. **CHANGE — normalized stagger budget (PR-4/PR-6, engine `play()` at engine.ts:801–810 AND `studio-reveal-player.tsx:113`):** act duration fixed, per-path stagger = `budget / max(1, n−1)` — 6 paths or 200 land on time. No config change needed for this; it is the blocking prerequisite for frames.
6. **KEEP — the five kinds**, the golden-nib handwriting act (engine.ts:904–908), the reduced-motion static fallback. **CHANGE labels only:** `droplet` displays as **"Bloom"** (wire key unchanged); Molten is badged "needs a newer phone — falls back to Gold Turn" wherever picked (the silent degrade at studio-reveal-player.tsx:53–58 gets disclosed).
7. **CHANGE — the Reveal tab is the Finish step.** Entering it auto-plays the current reveal once (**hard-gated on the D4 tap-to-skip fix landing first**), with a thumb-reachable Replay on the canvas. Fix the stale "open Preview to animate" footer at engine.ts:1029–1031. The gold/molten portal mechanism stays (WYSIWYG via shipping components is correct) with the § 1.3 exits.
8. **DEFER (P2) — frame-first choreography (`anim.seq`) + `acts`,** with the feasibility correction baked in: `acts` is **tallied at export time from actual item counts inside `buildExportSVG`** (merged groups collapse; `drawShape` emits ring + fill per group — counts cannot be predicted from `letters.length`), saved atomically with the SVG. **DEFER (P2) — shimmer loop** (`anim.loop:'shimmer'`, player-side CSS only, paid, reduced-motion-aware) — the cheapest "keep the ₱999 alive" idea, but it is polish.

---

## 6 · Data model delta

All fields optional; **each field's sanitizer extension ships in the same PR that writes it** — `sanitizeStudioConfig` is a whitelist rebuild and silently drops unknown fields (feasibility, binding). `sanitizeStudioSvg` is untouched in every phase; the saved mark remains pure paths.

```ts
// ── Launch (PRs 4–6) ──────────────────────────────────────────
preset?: string;             // starting-point provenance · oneOf(PRESET_KEYS) · PR-5
frames?: StudioFrame[];      // MAX_FRAMES = 2 · PR-4
anim: { kind; dur; smooth; delay;                // unchanged wire format
        preset?: 'quick'|'classic'|'ceremonial'|'custom' };  // PR-6

const FRAME_KINDS = ['ring','double-ring','open-ring','diamond','cartouche','arch',
  'scallop','laurel','wreath','sampaguita','corner-lines','corner-flourish'] as const;

type StudioFrame = {
  kind: (typeof FRAME_KINDS)[number];
  c: string;                 // hex · default = outlineColor
  inset: number;             // clamp -60..200 · default 24
  scale: number;             // clamp 0.05..12 · default 1 (× auto-fit)
  tx: number; ty: number;    // clamp ±COORD · default 0 (config-only in v1; no UI)
  thick: number;             // clamp 1..40
  count: number;             // clamp 3..96 (repeats; ignored by rules)
  gap: number;               // clamp 0..160
  dbl: boolean;
};
// flat clamped numerics via existing num/hex/oneOf helpers; ≤2 frames ≈ 300B
// against the 260KB cap (shared.ts:121). strokes/syms unchanged.

// ── Reserved for P2 (named now so nobody re-designs them) ─────
// pstate keys widen /^\d{1,2}-\d{1,2}(-\d{1,2})?$/ + 'cut_swap'   (weave)
// v?: 2                                            (baseline/optical pivot gate)
// joiner?: 'amp_script'|'plus'|'none'              (canonical index: joiner = slot 1)
// anim.seq?: 'letters'|'frame'|'together' · anim.loop?: 'none'|'shimmer'
// acts?: { frames; letters; strokes; syms }        (export-time tallied only)
// st[i].rot                                        (real letter rotation)
```

---

## 7 · Build order

Six PRs, one flag, zero migrations (scope critic's slicing, adopted with the feasibility critic's ordering constraints).

- **PR-1 · Defect triage** (§ 1). Pure fixes, no flag, byte-visible copy corrections included. Lands first — presets are worthless while a Names keystroke wipes the design, and every reveal-promotion ruling amplifies the D4 lockout until tap-to-skip exists. Requires one real-device pass (touch-action × pointer-capture; verify the suspected dead double-tap).
- **PR-2 · Upsell honesty** (§ 5.1–5.3). Touches `animated-monogram-upgrade.tsx` + one status line; no engine change, no flag — it corrects false claims. Independent of PR-1.
- **PR-3 · Markup v2** (§ 2). Tabs + reorder + sticky save + reskin behind `monogram_studio_v2`; byte-identical when off; gates PRs 4–6.
- **PR-4 · Frames** (§ 4). `frameBuilder` + `frames[]` + shelf + `frameLayer`/export-order change + **the normalized-stagger fix in the same release**.
- **PR-5 · Starting points** (§ 3). Preset builders (incl. the interlock bisect) + strip + `preset?`.
- **PR-6 · Reveal presets** (§ 5.4–5.7). Tempo chips, Bloom label, molten badge, tab-entry auto-play, stale-copy fix.

PRs 4/5/6 are mutually independent behind the flag; the flag flip is the launch. **P2 queue, in order:** per-crossing weave → baseline/optical behind `v:2` → `seq`/`acts` choreography → joiner + 3-initials → shimmer → roster add → live-mark frame thumbnails + drag handles → defect remainder (D9/D10/D13/D14, letter rotation, draft carry).

---

## 8 · Rejected proposals

Killed. Cite this section before re-proposing any of them.

1. **Caption/name-date lockup under the mark** (logo-R5b) — a typesetting sub-product; the couple who wants names-and-date wants the invitation, which exists. (Its performance hazard — 60 glyphs through the O(n²) intersect loop — stands recorded.)
2. **Letter-in-letter archetype** (logo-R1) — fake door: `mainContour` finds the longest contour, not interior counters (engine.ts:755); fails I/L/T/V and most script capitals.
3. **Mirror duogram + `st[].flipX`** (logo-R1) — a config field + sanitizer change to serve one niche preset.
4. **Badge + solo-crest archetypes** (logo-R1) — reuse violation; ring frame + the existing outline ring (engine.ts:479–491) already compose these. Rings are `frames[]` recipes; two ring systems will not ship.
5. **Font-chip suitability glyphs** (logo-R6) — per-archetype micro-iconography no couple decodes.
6. **Removing `playfairsc` from the font-key allowlist** — the sanitizer would silently rewrite old configs to `cardo`, changing saved marks on re-edit. Key + TTF live forever; only the chip may go.
7. **Pulsing crossing dots** (usability-R6) — pre-woven presets teach the interlock by example; usability's own first cut.
8. **Contextual rotating canvas hints** (usability-R2) — one static line suffices.
9. **Live mini-thumbnail in the sticky save bar** (usability-R5) — `getExport()` runs `full()` twice per poll; jank on the exact hardware we serve.
10. **Twelve starting presets** — six, half pre-woven, beats twelve; the strip must be scannable on a 360px viewport.
11. **`deco-fan`, `sun-crest`, `dotted-ring`, `oval` frame kinds** — catalog bloat; every construction family survives at 12.
12. **Frame stack of 3** — two (enclosure + corner set) covers ~90% of real combinations.
13. **General per-letter `fontKey` override** (logo-R4) — over-general for one glyph; the joiner enum resolves its face internally (P2).
14. **Per-chip reveal auto-play** (usability-R4) — superseded by auto-play on Reveal-tab entry, itself gated on D4.
15. **Preset/frame thumbnails via parallel engine mounts** — the engine cannot mount headless (`mountStudio` requires the full DOM + a real canvas); single-mount apply→export→restore or static assets only.
16. **Fixing D1 inside `derive()`** — `applyConfig` depends on `derive`'s full reset (engine.ts:1638); the guard wraps the Names listener.
17. **Presets or badges baked into `strokes[]`** — eats undo, config bytes, and reveal stagger; ornament compiles to `frames[]` recipes, period.
18. **Six-signature motion pitch on studio-mark pages** — advertises animations the hero never plays for studio marks; survives only on the fallback-lockup path.
19. **Per-frame tx/ty drag handles in v1** — auto-fit + Size slider; the config keeps the fields so handles can land later without a delta.
20. **Predicting `acts` from `letters.length`** — merged groups and ring+fill emission make counts unpredictable; export-time tally or nothing.

---

# Appendix A — Full defect audit (councilor brief)


## 1. CONFIRMED DEFECTS

**D1 — Typing in the Names field destroys the whole design AND the undo history.**
`engine.ts:1605` wires `namesEl.addEventListener('input', derive)`. `derive()` (`engine.ts:296–315`) calls `initState()` — wiping every letter's position/scale/outline/gap and all crossing decisions — then hard-resets `undoStack = []; redoStack = []`. Scenario: a couple spends 15 minutes weaving "M & J", then adds a trailing space or fixes a typo in Names → the entire arrangement resets to defaults and **Undo is dead** (stack was cleared). This is unrecoverable data loss from a single keystroke and is my #1 candidate for "the maker feels broken."

**D2 — The UI promises letter rotation and pinch-resize; neither exists.**
`markup.ts:109` ("gold dot to **rotate**") and `studio.tsx:190` ("**pinch to size, twist to rotate**") describe interactions the engine never implements for letters: the gold-dot handle only scales (`engine.ts:1259–1262`, `mode='resize'` sets `st[sel].scale` only; `StudioLetterState` in `monogram-studio-shared.ts:71–79` has no `rot` field), and a two-finger pinch always becomes **viewport zoom** (`engine.ts:1217–1221`), never letter sizing. Symbols rotate (`symhandle`, `engine.ts:1235–1239`); letters cannot, ever. Couples will "twist" and conclude the app is broken.

**D3 — Gold/Molten preview overlay has no exit.**
Tapping "Gold Turn"/"Molten Gold" portals a full-cover dark overlay onto the canvas (`studio.tsx:236–253`, `absolute inset-0 z-[5]`). The engine clears it **only** when a canvas kind plays (`engine.ts:796` `onPreviewKind(null,null)`). The Arrange/Draw mode switcher (`engine.ts:1341–1352`) never calls `onPreviewKind`, and there is no close button. Scenario: tap "Molten Gold" → a WebGL shader permanently covers the editor; all canvas gestures hit the overlay; the only escape is guessing that tapping "Handwriting" restores the canvas.

**D4 — Canvas animations lock the whole editor for an unbounded duration, with no Stop.**
`play()`'s handwriting/trace stagger is **per paper.js item** — every mirrored stroke copy and mirrored symbol copy is its own item (`engine.ts:801–810`, `addStroke` pushes one path per mirror copy at `engine.ts:575–581`). With a 4-way-mirrored frame of 40 strokes that's 160+ items; at the default 0.3 s delay the run is ~50 s, during which every pointer handler, the mode switcher, Fit and Reset all bail on `animating` (`engine.ts:1137, 1225, 1274, 1343, 1530, 1536`). Selecting an anim chip also auto-plays (`engine.ts:1363–1369`), so merely browsing presets triggers the lockout repeatedly. (Undo/Redo are the *only* unguarded controls — clicking Undo mid-run destroys the animated items and relies on the `catch → endAnim` self-heal, `engine.ts:851–855`.)

**D5 — The canvas is a scroll trap on both form factors.**
`markup.ts:22` sets `touch-action:none`, and `engine.ts:1318–1329` `preventDefault()`s **every** wheel event. Desktop ≥760px gives the canvas up to `72vh` of the left column (`markup.ts:89`) — a mouse user scrolling the page stalls the moment the cursor crosses the canvas (wheel becomes zoom). Mobile: a thumb-scroll starting on the canvas pans the **artboard** instead (`mode='pan'`, `engine.ts:1211–1215`), silently dragging the mark off-center; the rescue ("Fit") is at the very bottom of the panel.

**D6 — Pinch, then lift one finger → the selected letter jumps under your remaining finger.**
`engine.ts:1311–1314`: on pointerup, if one pointer remains and a letter is selected, mode is force-set to `'move'`. A two-finger zoom that ends fingers-staggered (the normal way humans pinch on Android) turns into an accidental letter drag.

**D7 — Draw mode pollutes the undo stack with no-op entries.**
Arrange mode guards undo with `didModify` (`engine.ts:1289–1306`); draw mode pushes an undo snapshot on a mere symbol **tap-select** (`engine.ts:1156–1157`) and on grabbing the handle before any movement (`engine.ts:1147`). Users see Undo light up, press it, and "nothing happens."

**D8 — Symbol rotation drifts on save → re-edit.**
The handle accumulates rotation without wrapping (`engine.ts:1238`), but the sanitizer **clamps** `rot` to [-360, 360] (`monogram-studio-shared.ts:214`). A symbol rotated 1.5 turns (540° ≡ visually 180°) saves, reloads clamped to 360° ≡ 0° — the saved mark and the re-opened editor disagree with what the couple saw.

**D9 — The 15 s "still loading" safety net doesn't cover the case it documents.**
`studio.tsx:104–111` (and `public-monogram-studio.tsx:118–125`) claims to catch "a hung… font fetch", but `mountStudio` returns synchronously while its font boot is still pending (`engine.ts:1771–1781`), and `clearTimeout(failTimer)` fires immediately after (`studio.tsx:139–141`). A hung font fetch on a flaky PH mobile network leaves "Loading the typeface…" forever; a *failed* fetch shows "Could not load the typeface." with **no retry path** (`engine.ts:1772–1775`).

**D10 — Undo silently ignores ink/outline/backdrop/font changes.**
`snap()` (`engine.ts:168–180`) captures only `st/order/pstate/strokes/syms`. Change ink to navy, press Undo → letters move back but stay navy. Inconsistent undo semantics read as a bug.

**D11 — Cmd/Ctrl+Z is hijacked globally, including inside the Names input.**
`engine.ts:1517–1528` binds keydown on `document` with no `e.target` check and `preventDefault()`s. Typing in Names then pressing Cmd+Z blocks the input's native text undo AND fires canvas undo — whose stack D1 just emptied. The two defects compound into "I can't get my design back."

**D12 — The merged page sells two contradictory animation systems.**
The studio panel above offers 5 reveal kinds (handwriting/trace/droplet/gold/molten — the thing actually saved and played live via `StudioRevealPlayer`, `app/[slug]/page.tsx:495–498`); the paid block below promises "**six motion signatures (Drawn, Foil, Bloom, Editorial, Halo, Stardust)**" (`animated-monogram-upgrade.tsx:123–124`) and previews `AnimatedMonogramHero` built from the **lettered lockup** (`monogram_text/style`, `animated-monogram-upgrade.tsx:66, 74`) — not the couple's saved studio SVG. A studio-mark couple's ₱999 upsell preview animates a monogram that is not theirs, in a vocabulary the studio doesn't use.

**D13 — Sliders re-run the full boolean pipeline on every `input` tick.**
`s_outline`/`s_gap`/`cg`/`s_strength` call `full()` per tick (`engine.ts:1463–1490`), and `full()` does O(n²) `intersect` + PaperOffset `dilate` per group (`engine.ts:660–740`). Custom-color `<input type=color>` drag does the same (`engine.ts:1555–1560`). On mid-range Android this is visible jank; `fast()` exists for exactly this but isn't used here.

**D14 — Draw mode cannot pan.**
Any single-finger touch in draw mode starts a stroke (`engine.ts:1166–1174`); two fingers only zoom about a fixed midpoint (`zoomAt`, `engine.ts:1078–1084`, no translation term). Zoom into a corner, switch to Draw frame → you can't reach the rest of the mark without flipping back to Arrange.

**D15 — Accessibility is near-zero.** The `#ro` status line (`markup.ts:204`) is updated via `textContent` with no `aria-live`; sliders and the Names input have no programmatic labels (visual `lab/lab2` spans aren't associated); the canvas has no keyboard path (no arrow-nudge, no Delete for a selected symbol); keyboard slider changes bypass undo entirely (`wireSlider` snapshots on `pointerdown` only, `engine.ts:1085–1098`).

## 2. SUSPECTED / UNVERIFIED (worth a manual test)

- **Double-tap reset likely never fires on touch.** `pointerdown` `preventDefault()` (`engine.ts:1222`) suppresses compatibility mouse events, which should kill the `dblclick` listener (`engine.ts:1330`) on Android/iOS — the hint's "double-tap a letter to reset" would be a dead promise on the primary platform. Test on a real phone.
- **Exotic first characters can blank the canvas.** `parts[0][0]` (`engine.ts:302–306`) splits surrogate pairs (emoji); a glyph that `importSVG`s as an empty Group makes `base[i]` undefined (`engine.ts:276–285`), `hit[i]` null, and `hit[mem[0]].clone()` at `engine.ts:685` throws **outside** any try — `full()` aborts after `removeChildren()`, leaving a blank canvas. Needs a repro character (test "Ñ", emoji, Baybayin).
- **Draft carry-through misses the common exit.** The public studio stashes only on Download or the one CTA click (`public-monogram-studio.tsx:196, 266–268`); signing up via the site header or navigating away loses the design. Verify against the real funnel.
- **Save during a running canvas animation** re-enters `full()` while `onFrame` holds dead item refs — the catch self-heals, but confirm the exported SVG is never the mid-animation frame.

## 3. QUICK WINS (independent of any redesign)

1. **Fix D1 surgically:** in `derive()`, compare newly computed `letters` to the current ones; if unchanged, return. If changed, keep per-index `st` where letters persist and push ONE undo entry instead of wiping the stacks. Small diff, kills the worst data-loss path.
2. **Correct the lying copy now** (markup.ts:109, studio.tsx:190): "gold dot to resize · pinch to zoom the canvas". Ship real rotation later (add angle to the resize handle exactly like `symhandle`, plus `st[].rot` — sanitizer gains one clamped field).
3. **Overlay + animation escape:** clear `onPreviewKind` on mode-switch; add a ✕ on the portal overlay; make any `pointerdown` during `animating` call `endAnim` (tap-to-skip); scale the per-item stagger so total run ≤ `dur + 2s`.
4. **Scroll politeness:** wheel-zoom only with `ctrlKey` (trackpad pinch) else let the page scroll; on mobile, `touch-action: pan-y` + only `preventDefault` when the touch actually hits a letter/symbol/handle.
5. **Wrap, don't clamp, symbol `rot`** in `serialize()` (`((rot % 360) + 540) % 360 - 180`) — one line each side.
6. **Guard draw-mode undo pushes** behind the same `moved` check arrange mode uses.
7. **Move the load-timeout into the engine** (armed around `loadFont`, re-armed per font-chip click) + one automatic fetch retry; add a "Retry" button to the failure state.
8. **`keyHandler`: bail when `e.target` is an input/textarea.**
9. **rAF-throttle slider handlers** and use `fast()` during drag, `full()` on `change`.
10. **`aria-live="polite"` on `#ro`**, `aria-label`s on the four sliders and the Names input — five attributes in `markup.ts`.
11. **Reconcile the upsell block** (D12): preview `StudioRevealPlayer` with the saved studio SVG when one exists, and align the copy to the studio's five reveal kinds.