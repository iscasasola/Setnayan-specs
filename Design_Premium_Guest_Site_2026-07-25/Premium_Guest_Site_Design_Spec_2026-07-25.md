# Premium Guest Site Design Spec — "Pahina" (the commissioned editorial)

**Date:** 2026-07-25 · **Author:** Fable (design pass, no code) · **Builds from:** owner ask *"make the invitation and event website more premium looking than those event websites on the market."*
**Prototype:** `premium_site_prototype.html` (this folder — open at phone width; demo palette switcher bottom-left proves the bespoke re-skin, including the candlelight dark direction).
**Build plan:** `BUILD_INSTRUCTIONS_FOR_OPUS_2026-07-25.md` (this folder).

---

## 0. The one-line direction

**The guest site should read like a privately commissioned magazine issue about this couple — not a themed template.** Every move below serves that: type behaves like a masthead, sections behave like numbered chapters, the couple's palette behaves like an art director's choice, and the only "card" left on the page is the one thing that *is* a card in real life — the RSVP reply card.

This is an **elevation of the existing architecture**, not a replacement. The veil reveal, STD film, 5-tab menu, phases, widget registry, and `role_palette` → CSS-vars pipeline all stay exactly where they are. What changes is the visual grammar the widgets speak.

## 1. What's wrong today (from the shipped code, `apps/web/app/[slug]/**` @ origin/main)

1. **Everything is the same rounded-2xl cream card** (`rounded-2xl border border-ink/10 bg-cream p-5 shadow-sm`). RSVP, photos-of-you, claim-account, vendor credits — identical shells. That's the visual grammar of a dashboard, not an invitation. Premium print has *no* cards; it has plates, rules, and whitespace.
2. **Symmetric center-everything.** Hero centered, greeting centered, hr centered. No asymmetry → no art direction → template feel.
3. **The palette is applied timidly.** `buildSitePaletteVars` does excellent WCAG work, but the accent shows up only as eyebrow text + button fills. There's no *second* material (metallic/gild), no texture, no palette-driven art direction fork.
4. **Cormorant at text sizes is wispy**; at 5xl italic it's pretty but it's also the single most-used "elegant wedding" face on the internet (it IS the template signal).
5. **Functional colors invade the aesthetic**: `success-600` green RSVP buttons, `success-50` banners, warn-yellow notices — straight app-palette green/yellow on a wedding page. Zola/Joy make the same mistake; this is a differentiation point, not just a fix.
6. **No texture, no depth, no motion.** Flat cream, flat cards, zero scroll choreography (the reveal/film has all of it; the page after has none — the drop-off is jarring).

## 2. Market benchmark — what we beat, and how

| Competitor | What reads premium | Where it's weak (our opening) |
|---|---|---|
| **Zola** | Clean templates, good photos-first layouts | Utterly template-y — thousands of identical sites; app-grade UI chrome; no motion; RSVP is a form, not a moment |
| **Joy (withjoy)** | Slick app, good guest UX | Same: web-app grammar (cards, tabs, buttons), one design language for every couple |
| **Minted** | Genuinely nice stationery-derived art, letterpress feel | The site is a static brochure — no live layer, no day-of, no personalization beyond names |
| **Riley & Grey** (the premium ceiling, ~$35/mo) | Real editorial art direction, custom type, texture | Tiny template set, US-priced, zero event-day features, no PH presence |
| **Squarespace weddings** | Typography + whitespace | Generic — it's a website builder wearing a veil |

**The gap we exploit:** nobody combines Riley-&-Grey-level art direction with a *per-couple generative* palette system AND a live event layer (QR, seats, live wall, Papic). Competitors pick one: pretty-but-static (Minted, R&G) or functional-but-template (Zola, Joy). Setnayan's `role_palette` pipeline already makes every site chromatically unique — the missing half is a design system worthy of it. Pahina supplies that half. The pitch line: *"every Setnayan site is commissioned, not themed."*

## 3. Type system

| Role | Face (Google Fonts) | Fallback stack | Usage |
|---|---|---|---|
| **Display** | **Fraunces** (variable; `opsz` 144, `SOFT` ~40, `WONK` 0) | Cormorant Garamond → Didot → Georgia | Couple names, chapter headings, big date numerals, RSVP word, pull quotes (italic) |
| **Body** | **Manrope** (already loaded) | system sans | prose, addresses, form labels — unchanged |
| **Label** | **DM Mono / Space Mono** (already loaded) | ui-monospace | eyebrows, times, captions, tab bar, ticket stubs — unchanged |

- **Why Fraunces over Cormorant:** real optical sizing (display cuts have ink-trap character; text cuts hold weight), warmer and less ubiquitous than Cormorant/Playfair, variable file ≈ one request via `next/font` subsetting. It photographs as "commissioned type." Cormorant stays in the fallback stack so the swap degrades gracefully.
- **Scale (mobile-first, clamp-based):**
  - Names/H1: `clamp(3.4rem, 14vw, 6.5rem)`, weight ~480, line-height 0.96, tracking −0.015em
  - Big date: `clamp(2.6rem, 9vw, 4rem)`, weight 300, gild color, lining numerals
  - Chapter H2: `clamp(2rem, 7.4vw, 2.9rem)`, weight ~420
  - Plate H3: 1.55rem · body 1rem/1.65 · small 0.85rem
  - Eyebrow: 0.66rem mono, tracking 0.28em, uppercase, **with a chapter number** (`№ 01`…`№ 07`) in the gild color + a trailing hairline
- **Signature moves:** stacked names with a small italic "and/&" line between (0.42em, gild); drop caps on the story's first paragraph; letterpress text-shadow on the RSVP word; italic Fraunces pull quote with a gild left rule.

## 4. Color derivation (extends `lib/site-palette.ts` — do not fork it)

Keep `buildSitePaletteVars` (paper/ink/accent/cta + WCAG floors) exactly as is. **Add three derived tokens** to the same function:

| New var | Derivation | Duty |
|---|---|---|
| `--color-gild` | The palette's warmest mid-luminance swatch nudged toward metallic (blend 35% toward `#B08D57`); fallback = Atelier gold `#A9834B`. Decor-only — never body text below AA-large. | Numerals, chapter №s, seal, rules' accents, active-tab dot, swatch pins |
| `--color-paper-deep` | `paper` darkened ~4% (light direction) / lightened ~5% (dark) | Recessed plates (venues, reply card) — replaces "another white card" |
| `--color-veil` | Existing `veilColorFromPalette` output, exposed as a page var | Countdown strip wash, hero tint, chips |

**Art-direction fork (the deliberate variation axis):** when the couple's palette carries a very dark dominant swatch (deepest swatch luminance < 0.18 AND they toggle "Candlelight" in the editor), flip to the **dark direction**: paper ↔ near-black warm ink, ink ↔ warm cream, accents brightened to their `-300` equivalents (mirror of the existing `[data-theme="dark"]` recipe in globals.css). Default stays **Daylight**. This is one switch, two genuinely different-feeling sites — palette C in the prototype shows it.

**Functional-color exile:** inside `.sn-editorial`, `success-*`/`warn-*` are re-pointed at palette-derived equivalents (confirm = `accent-deep`, notice = `veil` + ink text). Green "I'll be there" buttons become accent-deep. App-green never appears on a wedding page again.

## 5. Texture & material vocabulary

- **Paper grain:** one inline SVG `feTurbulence` data-URI tile (~500 bytes), `opacity .05` light / `.09` dark, `position:fixed` overlay. Zero requests, GPU-cheap.
- **Hairline inner frames** on plates (`::after` inset 0.45rem, 1px, ink/7%) — the printed-card cue.
- **Deckle/letterpress** on the reply card: drop-shadow filter + inset frame + letterpress text-shadow on "RSVP" (flipped shadow in dark).
- **Wax seal**: reuse the existing seal recipe (`sealColorFromPalette` + `wax_seal_config`) as a small page-level motif — a clipped-polygon circle riding the hero cover's bottom-right corner. The reveal's seal and the page's seal become the same object → continuity from envelope to page.
- **Silk swatches** for dress code: tall rounded-bottom chips with inner shading + a gild pin — reads as fabric samples, not color squares.

## 6. Motion vocabulary (CSS-first, PH 4G budget)

| Effect | Mechanism | Cost |
|---|---|---|
| Scroll reveal (opacity + 22px rise, 0.7s) | one `IntersectionObserver`, class `.in`, unobserve after fire | ~15 lines JS |
| Hero cover parallax (±6%) | rAF-throttled transform on the media wrapper | ~15 lines |
| Active-tab dot follows scroll | second IO over section anchors | ~12 lines |
| Countdown | existing component, restyled numerals only | 0 |
| Veil reveal / STD film | **unchanged** — already the strongest asset | 0 |

All three honor `prefers-reduced-motion` (reveal renders instantly; parallax off). **No libraries.** Total added JS < 2 KB. Note from prototyping: reveal elements must fail *visible* (hide only under a `js`-flagged root, and IO must be mounted before first paint) so a slow/broken script never blanks content.

## 7. Per-widget elevation map

| Widget | Today | Pahina |
|---|---|---|
| **Hero** | centered italic name over scrim-washed photo | Typographic **masthead**: eyebrow `№ 01` → stacked names + italic amp → hairline rule → oversized gild date opposite right-aligned venue block. Photo moves *below* as a full-bleed **cover plate** with mono caption + wax seal riding its corner. No more text-fighting-photo scrims. |
| **Countdown** | plain numbers | Full-width **strip** between hairlines on a veil wash; Fraunces tabular numerals + mono labels |
| **Greeting** | centered serif "Hi, {name}." | Keep the personalization (nobody else has it) but set it as a **salutation line** above the story chapter — italic display, left-aligned, guest name in gild |
| **Our story** | prose block | Chapter `№ 02` + drop cap + italic **pull quote** with gild rule; couple photos can interleave as offset plates |
| **Event details / venues** | rows in a card | Two **plates** (paper-deep, hairline inner frame): CEREMONY / RECEPTION keys in gild mono, Fraunces venue names, mono times, quiet map links. Asymmetric 1.15fr/0.85fr on desktop |
| **Schedule** | list in a card | **Programme rail**: mono gild time column + baseline-aligned entries between hairlines. Live day: the existing "happening now" logic highlights the current row (accent left rule) instead of wrapping the widget in a green box |
| **Dress code** | text + generic chips | Chapter `№ 05` + **silk swatches** + the "save white for the bride" line as styled small text |
| **Gallery / photo moments** | uniform grid | **Editorial mosaic**: 2-col with deliberate vertical offsets, one full-width plate, mono captions on-image. Live wall keeps its own component; this treatment is for the curated "our photos" set |
| **RSVP** | green buttons in gradient card | **The reply card**: paper-deep deckled plate, letterpress "RSVP", "kindly reply by…" line, ticket-stub `Nº {guest}` in gild mono, three quiet outlined options (selected = accent-deep fill), letterpress send button. Wording: "Joyfully accepts / Undecided, for now / Regretfully declines" |
| **QR card ("Me")** | functional card | Style as a **place card**: guest name in Fraunces italic, QR framed by the hairline inner frame, seal motif |
| **5-tab menu** | mono labels, flat | Keep structure; add **active gild dot** + scroll-following state; slightly quieter labels (0.52rem/0.1em at 375px — verified no jam) |
| **Setnayan chrome** | header "SETNAYAN · INVITATION" both sides | Platform recedes: wordmark stays smallcaps whisper left, **couple monogram in gild italic takes the right slot**. Footer keeps "Powered by Setnayan · setnayan.com" (free tier) under an italic sign-off + monogram |

## 8. Free vs Website Pro flourish map

**Principle: free must look commissioned too (it's the funnel). Pro buys the *cinematic* layer, not basic dignity.**

| Free (everyone) | Website Pro ₱3,500 (existing SKU, unchanged scope + these reskins land inside it) |
|---|---|
| Full Pahina type system, chapter grammar, plates, hairlines, grain | Cinematic reveal openings (existing STD_PREMIUM_OPENINGS tie-in — unchanged) |
| Palette-derived gild/veil/paper-deep tokens | STD film media beats (music/video/photos — unchanged) |
| Scroll reveals + tab dot + countdown strip | Hero cover **video** + background music (already Pro-side media) |
| Reply-card RSVP, programme rail, silk swatches | **Candlelight art-direction toggle** (the dark direction) |
| Wax-seal motif (default recipe) | Custom bg/button colors (existing §4.4) + **gild override** |
| One cover plate (their hero photo) | Editorial mosaic gallery (gallery is already Pro-adjacent) + parallax on cover |
| "Powered by Setnayan" watermark | Watermark removed (existing perk) |

Rationale: the dark direction and motion-on-media are the two flourishes that photograph as "expensive" in shares/reels — putting them behind Pro gives the upsell a visible before/after without making free look cheap. (Owner may re-slice; flagged in build doc.)

## 9. Spacing & rhythm

8pt base grid. Chapter spacing `5.5rem` mobile / `8rem` ≥720px. Column stays `max-w-3xl`-ish (42rem) but **plates and covers break it** (full-bleed `-mx` pulls, the mosaic's offsets). Hairline rules (`1px ink/10–16%`) replace boxed borders as the primary separator. Whitespace is the most legible luxury cue on a phone — protect it before adding anything.

## 10. Performance guardrails (PH mobile, slow 4G)

- One added font family (Fraunces variable, subset via `next/font`) ≈ 35–50 KB woff2; Cormorant can be *dropped* from the guest tree in the same PR → net near-zero.
- Grain = inline data URI; seal = CSS clip-path; swatches = CSS. Zero new image requests.
- JS additions < 2 KB inline; no libraries; IO-based everything; `prefers-reduced-motion` respected throughout.
- All effects are progressive enhancement: no-JS renders fully (reveal classes must default-visible without the `js` root flag).

---

## 11. The Five Timelines (owner model, 2026-07-25)

The owner's mental model is **five timelines**: **Save the Date · Invitation · RSVPed · Event Day · After Event.** The prototype now walks all five via the fixed demo strip at the very top of `premium_site_prototype.html` (labels SAVE · INVITE · RSVP'D · DAY · AFTER; the palette pill keeps working across all of them).

**Engine mapping (verified in code):** the site engine has FOUR date-driven phases — `LifecyclePhase = save_the_date | rsvp | event | editorial` (`lib/invitation-widgets.ts`, consumed by `resolveSiteBodyPlan`). **"RSVPed" is NOT a fifth date window — it is a per-GUEST state inside the `rsvp` phase**: the same page, transformed because THIS guest's `rsvp_status` is `attending`. Anonymous visitors can never see it (no guest identity → no reply state). No new phase is introduced.

### Per-timeline design (Pahina grammar)

| | Save the Date | Invitation | **RSVPed** (rsvp ∩ replied) | Event Day | After Event |
|---|---|---|---|---|---|
| **Job** | Announce. Tease, ask nothing. | Invite + ask | **Reassure + anticipate.** The most-revisited page — make it the screenshot. | Orient + include, live | Archive + thank |
| Hero eyebrow | "Save the date" | "You are invited" | "We'll see you there, {first name}" | "Happening today" | "Married · {date}" |
| Masthead + date block | ✓ | ✓ | ✓ | ✓ | ✓ (date reads as record) |
| Cover plate | ✓ (engagement) | ✓ | ✓ | ✓ | Caption flips to **issue cover**: "The wedding of X & Y · one day, in full" |
| Countdown | ✓ | ✓ | **Emotional center** — enlarged numerals + salutation line "Until we celebrate with you —" | — (replaced by **Happening-now strip**: live dot + venue, between hairlines on the veil wash) | — |
| Keepsake ticket | — | — | **THE object**: punched reply-card ticket — rotated rubber-stamp "JOYFULLY ACCEPTED", `Nº {guest}` + roman date stub, "{Name} & one seat, reserved" in Fraunces, perforation rule, Table/venue/time meta, "keep this page" line | — | Returns as **memento**: stamp reads "YOU WERE THERE", meta collapses to name · table, copy points at the gallery |
| RSVP ask (reply card) | — | ✓ (№ 07) | **Gone.** The ask never reappears once answered. | — | — |
| Story | — | ✓ | ✓ | — | ✓ — **leads** the page |
| Details/venues | — | ✓ | ✓ | ✓ + full-width **"Your table, {name}"** plate ("show this page — it's your place card and your QR") | — |
| Programme rail | — | ✓ | ✓ | ✓ with **NOW marker**: accent left rule + veil wash on the current row + pulsing "· Now" tag under the time (replaces today's green box) | — |
| Dress code | — | ✓ | ✓ | — | — |
| Gallery | — | ✓ ("Before the big day") | ✓ | **Live plates** instead: watch-live bar (play glyph, "The ceremony, live · for everyone celebrating from afar") + photo-wall plate (tile grid + "N photos · arriving live") | ✓ — retitled "The day, kept", the couple's curated set |
| STD announce plate | ✓ — "The formal invitation follows in September" + gild "hold the date" + letterpress add-to-calendar | — | — | — | — |
| Thank-you | — | — | — | — | ✓ — veil-washed plate, italic Fraunces note signed "— X & Y" |
| Footer sign-off | "See you on the ridge." | same | same | same | "Thank you for being there." |

**Design intents worth preserving in build:** (1) RSVPed is the *reward* state — the transformation from "form" to "stamped keepsake" is the emotional payoff of replying, and the page a guest opens weekly until the wedding; (2) Event Day stays in the plate/hairline grammar — live features render as printed plates with one pulsing dot each, never as app chrome; (3) After Event turns the same keepsake into proof-of-presence ("You were there · Nº 042"), which is also the platform's most shareable artifact.

---

## 11a. FULL inventory — "reskin, never drop" (owner correction #2, 2026-07-25)

> **RULE, stated for every future pass: Pahina is a RESKIN of the complete existing site. Every element the live site renders keeps its place and its job — nothing is dropped, ever.** The owner caught the first prototype missing the guest-personal functional layer ("camera button, their gallery, avatar, face tag, schedule, live schedule, egifts, save the day, rsvp, invite, connect to an account, wedding details, story"). This section is the complete inventory; the prototype now shows all of it (mirrored to `pahina_five_timelines.html`).

**Grammar note:** editorial chapters keep their `№` numbers; the guest-personal plates are marked with a gild `✦` instead — the personal layer is *starred, not numbered*, so it reads as belonging to the guest, not the magazine.

### Full per-state matrix (✓ = shown; components named from `site-body.tsx` / WIDGET_TYPES)

| Element (prod component) | STD | Invite | RSVP'd | Day | After |
|---|---|---|---|---|---|
| Hero masthead + date block | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cover plate + wax seal (HeroBackgroundMedia + seal) | ✓ | ✓ | ✓ | ✓ | ✓ (issue-cover caption) |
| Countdown (countdown) | ✓ | ✓ | ✓ emotional center | — | — |
| STD announce + add-to-calendar (SaveTheDateView, post-reveal) | ✓ | — | — | — | — |
| Greeting (greeting) — "Hi, {name}" salutation | — | ✓ | ✓ | — | — |
| Story (our_love_story / OurStory) | — | ✓ | ✓ | — | ✓ leads |
| Wedding details incl. venues (event_details / venue_map) | — | ✓ | ✓ | ✓ | — |
| **Seat / your table (YourSeatBlock)** | — | — | ✓ plate + on keepsake | ✓ plate | on memento |
| Schedule (schedule / ScheduleWidget) | — | ✓ rail | ✓ rail | ✓ **live rail + NOW row** (day-of pinned schedule) | — |
| Dress code (dress_code) | — | ✓ | ✓ | — | — |
| Good-to-know (special_message / what_to_bring) | — | ✓ | ✓ | — | — |
| Tsinoy tea ceremony (TeaCeremonyCard, conditional) | — | ✓* | ✓* | ✓* | — |
| RSVP ask (rsvp / RsvpWidget) | — | ✓ reply card | — (keepsake instead) | — | — |
| Keepsake / memento ticket | — | — | ✓ "Joyfully accepted" | — | ✓ "You were there" |
| **Face tag (DayOfFaceEnroll + FaceDataNotice)** | — | — | ✓ consent plate | ✓ consent plate | — |
| Watch live (WatchLiveBlock) | — | — | — | ✓ | — |
| Live photo wall (LiveWallBlock) | — | — | — | ✓ | — |
| **Camera (PapicGuestCapture / hub-bar center)** | — | — | — | ✓ **gilded shutter notch in the 5-tab nav** | — |
| **Your photos (your_photos / guest live gallery + "Not me")** | — | — | — | ✓ live grid | ✓ kept grid |
| **Keep-your-photos (tier_comparison + claim CTA)** | — | — | — | ✓ | ✓ |
| **E-gifts (Pabuya)** | — | — | ✓ | ✓ | ✓ |
| **Pabati 5-sec greeting (PabatiPrompt)** | — | — | — | ✓ | — |
| Couple gallery (our_photos / photo_moments) | — | ✓ | ✓ | — (live wall instead) | ✓ "The day, kept" |
| Thank-you plate (editorial) | — | — | — | — | ✓ |
| **Guest hub plate (GuestHubCard/Bar): avatar · name · role/side · status · personal QR · "Show my QR" · connect-to-account (claim)** | ✓ | ✓ | ✓ | ✓ (+ "Photos of me") | ✓ |
| 5-tab menu (SiteMenuBar) | ✓ | ✓ | ✓ | ✓ + camera notch | ✓ |
| Watermark (free) / footer sign-off | ✓ | ✓ | ✓ | ✓ | ✓ |

\* conditional — renders only for Chinese (Tsinoy) weddings, exactly as prod gates it (`isChineseWedding`).

### New treatments introduced by this correction
- **Guest hub plate ("✦ Yours, {name}")** — avatar circle (veil fill, gild ring, paper inset), Fraunces name, mono role/side line, outlined status pill (state-aware: awaiting → attending · table → you-were-there), letterpress "Show my QR", personal QR on a white plate with the couple's mark at center, and the connect-to-account block under a dashed perforation ("Keep this on your phone — sign-in link by email, no password"). One plate = the owner's "avatar + invite + connect to an account."
- **Camera = the gilded shutter notch**: a raised circle riding above the tab bar's center (accent-deep fill, double gild ring via paper-gap shadow, concentric shutter glyph, tiny mono CAMERA label). The 5 tabs keep their grammar; the notch appears only where capture is live (Day in the prototype; in prod, whenever `papicGuest`/`cameraReady` is truthy — same gates as today's GuestHubBar center button).
- **Face tag as a dignified plate**: consent-forward copy ("this celebration only · never reused · removable anytime"), one letterpress accept + one quiet underlined decline. Never a modal, never nagging.
- **Keep-your-photos**: tier_comparison reskinned as a two-column ledger ("Tonight" vs "With a free account", veil-washed right column) + one letterpress CTA.
- **E-gifts (Pabuya) + Pabati** share a "✦ Gifts & greetings" chapter — italic ask, quiet quota line ("212 of 300 greetings left").

---

## 11b. Correction #3 — bottom nav = the OWNER'S shipped chrome, reskinned only; Live Studio channel viewer (2026-07-25)

> **Rule hardened: reskin the owner's existing designs — never re-invent structure.** The v3 center-notch camera in the tab row was an invention and is REMOVED. Every chrome element below is grounded in a named source.

### The bottom chrome, slot by slot (sources: council verdict `Guest_Event_Website_Open_Browse_Council_Verdict_2026-07-22.md` §1.1 + shipped `site-menu-bar.tsx` / `guest-hub-bar.tsx`)

1. **SiteMenuBar — five TEXT tabs: Home · Details · Story · Photos · Me.** Nothing else ever enters the tab row (no notch, no icons-in-row). Pahina reskin = quieter mono labels + gild active dot only.
2. **GuestHubBar — the day-of high-frequency action row** (council §1.1 chrome-ownership line: the bar keeps "only My QR / Camera / Photos as high-frequency actions"). Reskinned with the SAME slots and placement as `guest-hub-bar.tsx`:
   - **left:** My QR — square chip (3.25rem), paper/blur fill, hairline border;
   - **center:** Camera — the prominent 4rem raised circle (accent-deep fill, inner gild hairline, shutter-ring glyph) — exactly the bar's `-translate-y` center action, NOT part of the tab row;
   - **right:** Photos — square chip with the gild count badge (GuestHubBar's `galleryCount` badge);
   - **the transient LIVE chip** (T-1h..T+8h) — ink pill "● Live hub" injected next to the center action, exactly as `GuestHubBar.hubHref` does today.
   The row floats ABOVE the text tabs during the live window; outside it, only the five tabs render.

### Live Studio channel viewer (source: `Live_Studio_Unified_Spec_2026-07-25.md`, owner-approved)

The Day state's watch surface is the guest-pick viewer, not a single "watch" bar:
- **CH 1 · Controlled screen** — the big 16:9 player (the directed program; `CH 1 · CONTROLLED SCREEN` mono label, red ON AIR chip, tally discipline).
- **A rail of SMALLER channel tiles** below — every camera is its own numbered channel with the **host's own name** (CH 2 "Main Stage", CH 3 "Garden Aisle", CH 4 "Reception Doors"), ★ marks the host default, the active tile carries a gild border. **Tapping a tile switches the guest's view to that channel on demand** (guest-pick); note line: "Stay with the couple's program on Channel 1 — or tap any camera to watch it on demand."
- The **Papic wall plate sits directly adjacent** (below the viewer) — this pairing is the owner's "place for the live studio with papic wall".

### The Papic layer on the site (sources: `OnTheDay_App_Build_Studies_2026-07-23.md` build ③ + owner prototype `0012_papic/0012_papic.html`)

- **Papic pool bar** (build ③) during the live window: mono "PAPIC POOL" + live points meter (accent gradient fill) + "6,480 of 10,250 points left" + rate line "photo = 1 pt · 10-s clip = 7 pts" + **Top up** (letterpress) and **Add a camera** (quiet) actions.
- **Camera + roll plate** ("the papic app itself", after 0012's capture screen): dark plate, the prototype's **white shutter circle with dark ring**, last-5 thumb strip with the **amber ring on tagged shots** (0012's `--tag-amber`), copy "scan a guest's QR after a shot to tag them", caption "Your roll · 12 shots · amber = tagged".

### 11b-addendum (correction #4, 2026-07-25) — the bottom chrome is a VISUAL CLONE: "clone, palette-map colors only"

The v4 redraw still changed geometry/iconography; the owner rejected it. The rule is now: **reproduce the shipped markup 1:1; the ONLY permitted change is palette-variable substitution** (cream→`--paper`, mulberry→`--accent-deep` [mulberry IS the default accent], terracotta→`--accent`, active/hover accents may use `--gild`). Reference markups, verbatim:

**SiteMenuBar (fetched from the LIVE site, setnayan.com/maria-and-jose):**
```html
<nav class="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 backdrop-blur [padding-bottom:env(safe-area-inset-bottom)]">
  <ul class="mx-auto flex max-w-md items-stretch justify-around px-2">
    <li class="flex-1"><a class="flex h-14 items-center justify-center px-1 text-center font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink/70 hover:text-terracotta">Home</a></li>
    <!-- … Details · Story · Photos · Me, identical anchors -->
  </ul>
</nav>
```
→ 56px bar · mono 0.7rem uppercase tracking-0.12em · ink/70 on cream/95 blur · hairline top border · equal flex tabs. No dots, no icons, no notch — ever.

**GuestHubBar bottom bar (`guest-hub-bar.tsx`, shipped):**
- Row: `mx-auto flex max-w-md items-end justify-between gap-3 px-5 pb-3 pt-2`
- My QR (left): `h-[3.25rem] w-[3.25rem] rounded-2xl border border-ink/10 bg-cream/95 shadow-lg backdrop-blur` — flex-col: `QrCode` icon (20px, stroke 1.75) ABOVE `text-[0.6rem] font-medium` label, both inside the chip
- Camera (center): `h-16 w-16 -translate-y-1.5 rounded-full bg-mulberry text-cream shadow-xl` — flex-col: `Camera` icon (24px, stroke 2) ABOVE `text-[0.6rem] font-semibold` label, BOTH INSIDE the circle; disabled = `bg-ink/10 text-ink/30`
- Photos (right): same chip with `Images` icon + label; badge `absolute -right-1 -top-1 min-w-[1.1rem] rounded-full bg-terracotta px-1 text-[0.6rem] font-semibold leading-[1.1rem] text-cream` ("99+" cap)
- LIVE hub chip: `h-10 rounded-full bg-ink px-3.5 text-sm font-semibold text-cream` + `LayoutGrid` icon — placement per council §1.1 (injected next to the center action)

The prototype now reproduces all of the above exactly (sizes, radii, raise, icon-above-label composition, badge corner, sans-serif label faces — not mono); its earlier "Pahina-ized" chip/notch/ring treatments are dead.

---

## 11c. V6 — the 20-feature interactive map (owner audit, 2026-07-25)

Prototype (`pahina_v6.html`) is now fully interactive: every feature below is present in its states and TAPPABLE (mock bottom sheets/modals/toasts in the Pahina grammar — paper, hairlines, gild grab handle; vanilla JS, no libraries). Status column is honest: ✅ = reskin of a shipped feature · 🟡 = shipped-adjacent (flag-dark/partial) · 🔴 = NEW build.

| # | Feature | States | Interaction mocked | Status |
|---|---|---|---|---|
| 1 | Watch the STD film again | Invite·RSVP'd·Day·After (Home chip) | fullscreen veil-film overlay | ✅ (STD film + reveal shipped; "rewatch" chip = small NEW doorway) |
| 2 | 3D Plan | Details plate; Day = "Find your table in 3D" | 3D sheet, ★ Table Seven, "walk to my table" | 🟡 (3D Plan/venue walk in build; seat-plan data shipped) |
| 3 | Papic camera app | Day (hub-bar Camera + roll plate shutter) | capture sheet: viewfinder, shutter, points chip (6,480 · photo=1 · clip=7), last-5 roll | ✅ (PapicGuestCapture + one-pool metering shipped) |
| 4 | 3D avatar | Me plate "Make your avatar" | 3-tap maker sheet (base/hair/outfit + turntable) | 🔴 NEW in-app (prototype exists outside app; tagged "coming with 3D Plan") |
| 5 | Face tag | RSVP'd·Day consent plate | selfie-frame sheet, consent copy, decline quietly | ✅ (DayOfFaceEnroll/FaceDataNotice shipped) |
| 6 | Link account | every state (hub connect block + "Keep them" CTA) | email sheet → "magic link sent ✓" | ✅ (claimAccountAction shipped) |
| 7 | Custom role | every state (hub role line) | renders "Ninang · Bride's side" as host wrote it | ✅ (custom role text shipped) |
| 8 | Custom QR + Papic tagging | every state (Me QR) | tap → fullscreen QR modal (mirrors shipped setQrOpen); note "Papic cameras tag you when this QR is seen" | ✅ (personal QR + QR-tagging shipped; Custom QR = paid styling layer) |
| 9 | E-gifts QR | RSVP'd·Day·After (Gifts plate) | gift sheet: big QR + "scan to send" | 🟡 (Pabuya BUILT #3124, flag `PABUYA_PUBLIC_ROUTE_ENABLED` unflipped) |
| 10 | Live schedule sync | Day programme rail | ● Now row + pulsing "synced live" tag | ✅ (run-of-show trigger LIVE; guest read = flag `NEXT_PUBLIC_GUEST_NOW_TRIGGER`) |
| 11 | Live maps | Details venues; Day adds Waze | Maps + Waze link rows | ✅ (maps links shipped; Waze row = trivial NEW link) |
| 12 | Photo wall | Day | tile tap → lightbox | ✅ (LiveWallBlock shipped; lightbox = small NEW) |
| 13 | By you / Of you | Day·After gallery | two-lane toggle OF YOU (27) / BY YOU (14) | 🟡 (of-you gallery + own-roll both shipped as separate surfaces; the two-lane merge = NEW UI) |
| 14 | Download | Of-you lane | "Download all ↓" → toast | 🟡 (per-photo save shipped; bulk zip = NEW) |
| 15 | Drive backup | Me account row | OFF/ON toggle + toast | 🔴 guest-side NEW (couple-side Drive delivery shipped only) — tagged "build pending" |
| 16 | Phones-down | Day banner plate | dismissible ink plate ("Noted") | 🟡 (Photo Moments 'present' mode exists; this guest-facing banner = NEW render) |
| 17 | Favorite vendors | After credits list | ♥ Save → fills + toast | ✅ (vendor credits + saveAttendedVendorAction shipped) |
| 18 | Logged-in unlocks | Day·After "Keep them" ledger | lock list flips 🔒→✓ on linking | ✅ (tier_comparison shipped; unlock list copy = reskin) |
| 19 | Guest column | Day·After plate | writer sheet: textarea + attach-from-Of-you picker | 🟡 (OnTheDay build ① — near-clone of shipped Kwento machinery; flag-dark plan) |
| 20 | Pabati | Day (Gifts plate) | recorder sheet: countdown ring + ● Record | ✅ (PabatiPrompt + 300-clip quota shipped) |

---

## 12. V7 — TRUE BASE = the owner's 5-Tab prototype (correction #5, 2026-07-25) · fidelity map

**Owner: "there is a newer version… this was already done. we should be only improving it."** The true base is **`Guest_Event_Website_5Tab_Prototype_2026-07-22.html`** (owner-made, the design the open-browse council verdict + 11-PR program came from). 0002/0031 are heritage; the earlier Pahina five-timeline restructure is RETIRED as a base. **v7 = the 5Tab file itself + a materials-only layer** (`<style id="pahina-materials">` appended) + tiny enrichments implemented at the prototype's own stubs. Its structure, tabs, copy, phase×viewer deck, and interaction model are untouched.

### Fidelity map — their element → kept / improved-how

| 5Tab element | Status in v7 |
|---|---|
| Demo deck (phase × viewer segments, status line) | KEPT verbatim; kicker notes the pass |
| Phone frame + top chips (B&M monogram · Edit site · More) | KEPT; frame gains paper-grain overlay (reduced-motion exempt) |
| 5-tab pill nav w/ icons + slider + navpop | KEPT byte-identical (mirrors shipped BottomNav) |
| Camera FAB (64px mul circle, breathe on event) + livechip + poolbar | KEPT byte-identical |
| Hero (mono-top · heroband · monogram float · names · countdown) | KEPT; type: names 2.65rem, countdown numerals → serif, mono-top + monogram ring → gild |
| Spotlight per phase (film / RSVP / find-invite / streaming) | KEPT verbatim |
| STD film overlay (veil sweep, staged fade-ups, skip) | KEPT verbatim; date line + monogram ring → gild |
| Details: programme (NOW block, coordinator-live note), venue (Maps/Waze/Apple), dress dots, seat + planScene + name search | KEPT verbatim (Waze was already theirs) |
| Story: replayable reveal card ("Always here"), 2022/2025/2026 rail, photos, guest columns (write→pending→approve) | KEPT verbatim |
| Photos: face registration, watch card, live wall (morphing tiles), Your gallery, pool gallery + link-modal ("Are you in this?" · 20-tag note), Papic challenges card | KEPT verbatim |
| **Watch card** | IMPROVED (grounded): bar label → "CH 1 · Controlled screen"; **channel rail added below** — CH 2 ★ Main Stage · CH 3 Garden Aisle · CH 4 Reception Doors, tap = watch on demand (Live_Studio_Unified_Spec vocabulary; rides the Roam #3666 substrate in prod) |
| Papic camera overlay (pts pill · challenges strip · hold-for-clip shutter · roll) | KEPT verbatim — this IS the corrected camera anatomy |
| Roll overlay ("Taken by you / Tagged of you" + Download all) | KEPT verbatim (the of/by lanes + bulk download were already theirs) |
| Story maker (feel picker → on-phone render → share/save) | KEPT verbatim |
| Host: pool top-up sheet (₱2,999 / add-cam ₱100), pool-gallery toggle, mirror-manager card, column review | KEPT verbatim |
| Me (guest): RSVP + plate, avatar builder (chibi swatches), personal QR (+ rotate), seat, column form, doorways (Keep forever · Pabuya · sign out) | KEPT; header gains the custom-role line "Ninang · Bride's side" (#7) |
| Pabuya doorway | IMPROVED: the toast stub is now a **gift sheet** (QR + GCash/Maya note + send) |
| More → vendor team | IMPROVED: the toast stub is now a **credits sheet with ♥ Save** ("rides with your account") |
| Me doorways | ADDED one row: "Auto-backup to Google Drive — guest-side, build pending" (honest tag; couple-side shipped only) |
| QR modal (crew-tag copy + rotate token) | KEPT verbatim |
| Editorial: Gazette paper, morning-after edition, claim flow | KEPT; paper gains printed inner hairline + gild dateline |

### Needs owner call (present in earlier Pahina passes, NOT in the 5Tab base — not added)
- **Phones-down / "Be present for these"** moments plate (0002 heritage; no 5Tab slot)
- **RSVPed keepsake ticket** (stamped "Joyfully accepted" — Pahina invention the owner liked in v3; could mount inside Me → RSVP card when attending)
- **Pabati 5-second video greeting** on the guest site (shipped feature; 5Tab has no slot — nearest home is the Pabuya doorway group)
- **Wall-tile lightbox** (5Tab tiles morph but don't open)
- **Lock-flip unlock ledger** (5Tab uses the "Keep this forever" doorway instead — leaner; keep theirs unless owner wants the ledger)

---

## 13. V8 — Coordinator & Vendor wedding-day lanes (owner ask 2026-07-25: "show me the coordinator and other vendor wedding day")

Two new viewer identities on the v8 deck — **Liza (coordinator)** and **Kusina Norte (vendor · caterer)**. Selecting either forces the Wedding-day phase and swaps the stage to THEIR world: the **app side** (utilitarian card grammar + Pahina materials), guest pill-nav/camera-FAB hidden. Nothing invented — every element maps to a shipped surface or a council-spec'd item, cited below.

### Coordinator × Wedding day (Liza) — element → grounding

| Element | Grounding |
|---|---|
| Header: "read-parity · propose, not execute" line | `Coordinator_Role_Feature_Spec_2026-07-18.md` §access model (host-ACCESS w/ guardrails) |
| **Run-of-show console**: rail with done-strikethrough, NOW row, per-row "✓ Done / +15m", "single-winner" note | SHIPPED `app/_actions/run-of-show.ts` + `run-of-show-header.tsx` (P2, PR #3412 LIVE — `run_state` + `advance_schedule_block()`); +15m/bulk-shift = the spec's bulk time-shift ("retime 50 items when the day slips") |
| **"Propose to couple" chip** on the money-adjacent row (Same-day-edit screening) | propose-not-execute pattern (spec §write-tiers; `vendor_lock_proposals` PR #3401 precedent) |
| **Broadcast composer** ("Send broadcast" → guests' what's-happening card; offline-PWA note) | `coordinator-broadcast-card.tsx` (stub today — P3 wires `coordinator_broadcasts`/`broadcast_acknowledgments`); guest surface = 0031 card 6 |
| **📵 Phones-down toggle** (drives the guest banner) | Photo Moments 'present' mode → guest banner (spec §11c #16 — still a NEW guest-render; the toggle rides the broadcast machinery) |
| **Arrivals glance** (96/142 · unseated) + check-in scan | shipped arrival flow (`guestHubData.arrived`, check-in scan surfaces) |
| **Vendor call-times** w/ On-site/En-route/No-reply + Nudge | spec §master-run-of-show per-party slices + P3 email call-time nudges |
| **🔒 "Budget · couple only" lockstub** | the money wall (DECISION_LOG 2026-06-22) — **as consent-scoped 2026-07-19**: `coordinator_access_consents.scopes` shipped, default-OFF toggles, flag `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` OFF → walled by default; copy says "unless they grant it" to stay truthful |

### Vendor × Wedding day (Kusina Norte) — element → grounding (all under `apps/web/app/vendor-dashboard/on-the-day/_components/` unless noted)

| Element | Grounding |
|---|---|
| Header + "Access · 10:00–23:00" pill | `access-grants.tsx` |
| "Today" card (event + venue) | `event-picker.tsx` |
| Their run-of-show slice (load-in → cocktails → dinner NOW → breakdown) + auto-retime note | coordinator spec §master-ROS per-vendor filtered views (P2) |
| Deliveries & meals scan CTA ("87 of 142 served" · dietary flags) | `vendor-event-day-prep-cta.tsx` + per-guest delivery scan (0031 folder `Vendor_Per_Guest_Delivery_Scan_Build_Plan_2026-06-28.md`) |
| Guest-review QR card ("ask a happy guest to scan" · 4 today) | `guest-review-qr.tsx` |
| Live reviews feed (two ★★★★★ entries) | `live-reviews.tsx` |
| Papic booth mission chip ("Get a shot with the caterer" · 12 cleared) | Papic Games vendor missions (flag LIVE; `Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md`) |
| Issues log (report → "logged on the coordinator's issues board") | `issues-log.tsx` |
| Capture controller row, tagged **flag-off in prod** | capture controller PR #3388 (flag-OFF/counsel) |
| (not drawn, exists) shot-list, module-configurator | `shot-list.tsx` / `module-configurator.tsx` — omitted for a caterer lane; a photographer lane would lead with shot-list |

---

## 14. Role × Feature Matrix — OWNER CANON (2026-07-25) · implemented in v9

The owner's day-of matrix, verbatim in structure, with per-row honesty status. `pahina_v9.html` implements every row; cross-lane wiring is live in the demo (Liza's broadcast + phones-down land on Maria's Day Home; Kusina's requests land in Liza's inbox). Two previously parked items are **owner-ordered IN**: phones-down and coordinator-announcement→guest.

### Guests (additions)
| Feature | Status |
|---|---|
| 1 · Phones-Down plate (dismissible ink plate, Day Home) | **NEW render** (driven by the coordinator toggle / Photo Moments 'present') — now IN by owner order |
| 2 · Announcement from Coordinator (timestamped what's-happening card: "Dinner is served — find your table") | **NEW wiring** = P3 broadcast (`coordinator_broadcasts` spec'd, no backend; guest card = 0031 card 6) — IN by owner order |

### Generic vendor features (EVERY vendor lane)
| # | Feature | Status |
|---|---|---|
| 1 | Request to coordinator (if not coordinator) | SHIPPED `issues-log.tsx` — restyle |
| 2 | Report update to coordinators (one-tap status → Liza's board) | **NEW** thin write on the issues/requests machinery |
| 3 | QR scanner for checklist (scan deliverables off the truck) | SHIPPED delivery-scan machinery — recomposition |
| 4 | Give-us-a-review QR | SHIPPED `guest-review-qr.tsx` |
| 5 | Papic Ads Gallery — **if purchased** (entitlement-gated) | gated; pairs with the 3D booth |
| + | **Your booth in the 3D venue** (avatar + stand in the couple's 3D Plan) | `vendor_3d_booth` ₱1,500/28d entitlement (3D_Plan_Whats_Next actor layer); **in-app maker pending** (council 2026-07-19: prototype only) |
| 6 | Reviews received | SHIPPED `live-reviews.tsx` |
| 7 | Column for the Couple (keepsake note, couple-approved, prints beside guest columns) | **NEW** — mirror of the guest-column machinery |
| 8 | New User Favorites (♥ from the event site + 3D Plan) | SHIPPED `guest_saved_vendors` — surface restyle |
| 9 | **Papic documentation allowance — PROPORTIONAL to the booking/syncing fee** (owner rule 2026-07-25, supersedes the flat 50) | **NEW wiring** on the SHIPPED tier substrate: capture controller #3388 already grants Lite 20 pts photos-only / Ltd 70 pts photos+5s-clips via `vendor_event_unlocks` (Vendor_Featured_Weddings_Whats_Next item 1; fail-closed behind the Data Privacy control). Fee→points curve = owner call, anchored to `Vendor_Monetization_Model_LOCKED_2026-07-25.md`. Drawn: Kusina 70 (Ltd) · Manila Strings 20 (Lite) |

### Coordinator (Liza) = generic vendor features +
| Feature | Status |
|---|---|
| Live schedule updater (run-of-show console) | SHIPPED #3412 (v8) |
| QR kit (event join · table ×12 · seat ×142 · print pack) | print packs SHIPPED; the kit card = new composition |
| **Find-my-seat scanner** (scan a guest QR → "Maria → Table 7 · Dahlia" + plan highlight + Show in 3D) | **NEW combo** of shipped pieces: seat-finder #3607 + published seat plan + 3D walk |
| Requests inbox — ONE card, chips Couple · Vendors · Hosts, rows acknowledge/done | vendors lane = `issues-log` receiving side (partial in v8); couple/hosts lanes **NEW** |

### Band / Singer / Orchestra (Manila Strings) = generic vendor features +
| Feature | Status |
|---|---|
| Song Requests (guest requests, accept/skip) | **NEW** family |
| Song List (set list, played-strikethrough) | **NEW** |
| What song is next (big now-playing + up-next; can double as a public card) | **NEW** |

### Hosts (Bea) = same as Coordinators
"**Run the day**" card in Bea's Me lane (event phase) opens the full coordinator console as Bea (run-of-show, broadcast, QR kit, seat scanner, requests) with "← My view" back — no duplication, one console component, host-parameterized. Grounding: coordinator role = host-ACCESS by definition, so the console is the host's own surface shared down.

### §14 addenda (same day, owner)

**Documentation-allowance formula (verbatim, replaces placeholders):** *50–200 Papic points, proportional to the Booking/Syncing fee across ₱500–₱5,000; below ₱500 fee = 50 points (floor).* Linear: `points = clamp(50, 50 + (fee_php − 500)/30, 200)` → ₱500→50 · ₱2,000→100 · ₱3,500→150 · ₱5,000+→200 (cap). Drawn: Kusina Norte ₱2,000→100 pts (photos+5s clips) · Manila Strings ₱800→60 pts (photos only) · Liza ₱1,400→80 pts. Meter copy: "Scales with your booking fee · 50 pt minimum." Rides the #3388 grant substrate (`vendor_event_unlocks`), fail-closed behind the Data Privacy control; the fee-proportional grant is the NEW wiring.

**Host card placement — "Arrange your day" (owner: "we can also customize for the host… place their host cards on their on the day"):** Bea's day console is a **card deck** (run-of-show · announcements+phones-down · arrivals · live wall · watch-live · gifts · QR kit · seat scanner · requests · call-times · vendor toolkit · budget) with an "Arrange your day ✎" mode: ↑/↓ reorder + Hide per card, arrangement persisting for HER view (demo ships with Arrivals moved to top, Gifts hidden). Coordinator (Liza) gets the fixed order. Mechanism = per-host card order/visibility prefs — **NEW, small**; precedent = the shipped sections-manager grammar (`invitation_widgets` display_order/visibility + `setSectionMode` Auto·Shown·Hidden). Host money card reads "Budget · yours alone" (she owns it; the wall is for her delegates).

### §14 addenda 2 — v10: per-role bottom tab menus + allowance ladder complete (owner: "give vendors menus at the bottom like public, maria and bea")

**Per-role tab IA (app bottom-nav grammar — icon above tiny label, active terra tint, top hairline on paper/94 blur; NOT the guest pill):**

| Role | Tabs (≤5) | Tab contents (v9 cards reorganized — content unchanged) |
|---|---|---|
| **Vendor** (Kusina Norte) | `Today · Scan · Papic · Reviews · Requests` | Today = access window + ROS slice + booth mission + capture-controller stub · Scan = checklist scanner + deliveries/meals (87 of 142) · Papic = allowance meter + camera + booth + Ads Gallery · Reviews = review-QR + received feed + favorites · Requests = to-coordinator + report updates + column-for-couple. **Capture FAB rides with the live allowance count** ("74 pts") |
| **Band** (Manila Strings) | `Today · Songs · Papic · Reviews · Requests` | Songs replaces Scan (up-next big card · requests accept/skip · set list); gear checklist lives in Today; FAB "41 pts" |
| **Coordinator** (Liza) | `Show · Announce · Requests · QRs · Guests` | Show = ROS console + call-times · Announce = broadcast + phones-down (+wall/watch/gifts glances) · Requests = inbox + vendor toolkit + money stub · QRs = QR kit + find-my-seat scanner · Guests = arrivals + check-in |
| **Host** (Bea, "Run the day") | coordinator tab set inside the mode; **her guest-site view keeps the guest pill nav** (two worlds, clearly separate) | Arrange-your-day works per tab (order/hide within the tab's cards) |

**Allowance ladder COMPLETE (owner addenda):** imported/BYO vendor (no booking fee under SOURCED-only) → **10 pts, labeled a gift** ("a gift from Setnayan, for quick documentation") · paid fee ≤₱500 → 50-pt floor · linear to 200 at ₱5,000+ · **ANY vendor below the cap can upgrade: +₱100 → 200 pts** (chip on the meter → standard apply-then-pay sheet; after purchase the chip becomes "Max · 200 pts"). All drawn + interactive in `pahina_v10.html`.

### §14 CORRECTION + addenda 3 — v11: "Hosts = Coordinators" means the HOST/MC VENDOR (owner clarification, verbatim: "we can also customize for the host. where they can place their host cards on their on the day as well. what i mean by this is the Host/MC vendor not the host of the event.")

**Re-attribution:** the matrix line "Hosts will also have the same feature as Coordinators" refers to the **Host/MC vendor role**, NOT Bea. The §14-addenda "Host card placement" section is accordingly re-attributed to the MC.

**New fourth vendor identity — Migs · Host/MC** (`pahina_v11.html`): Generic Vendor kit + **coordinator-parity** + MC cards + **the arrangeable card placement**:
- Tabs: `Show · Script · Announce · Papic · Requests` · capture FAB "138 pts" (fee ₱3,500 → 150 pts by the locked formula)
- **Show** = the same run-of-show console as Liza (parity; #3412 machinery, propose-chip intact)
- **Script** = HIS deck, with **"Arrange your cards ✎"** (reorder ↑/↓ + hide, his show flow): Segment cue (big "First dance · cue in 5 · lights to half") · **Emcee script per run-of-show block** (shipped substrate: `apps/web/app/dashboard/[eventId]/schedule/_components/emcee-script-button.tsx` — scripts authored on the schedule, each block carries its lines) · Couple intro card · Games/Papic callouts ("call the fireworks challenge at 8:55" → "Call it on mic")
- **Announce** = receives the coordinator broadcast + his own composer ("Send + say it" — feeds the same broadcast lane, he voices it)
- **Papic / Requests** = the generic kit as in other vendor lanes
- Card-placement prefs = the `invitation_widgets` display_order/mode grammar precedent, now attributed to the MC role

**Bea (event host) REVERTED:** her lane = guest site + the simple "Run the day" doorway into the coordinator-parity console she already holds via delegation (coordinator role = host-access, shipped) — **"Arrange your day" removed from her console** (it was the MC's feature). Her console renders the fixed coordinator order; money card still reads "yours alone".

### §14 addenda 4 — v12: Generic Vendor kit grows to 10 — "Column for the Guests" (owner: "i noticed the vendors doesn't have a place to write a column for the guest")

| # | Feature | Status |
|---|---|---|
| 10 | **Column for the Guests** — a short PUBLIC note, distinct from #7 (couple keepsake): composer "A note for the guests ✎" in every vendor lane's Requests tab beside the couple column, with an optional ONE-shot attach from the vendor's documentation roll; hint "guests will see this under your name tonight"; **couple-approval-gated** (same "approves before it prints" pattern as guest columns). Guest side: the approved note renders in the vendor credits ("The people who made it") under the vendor's name + category — italic quote + attached shot thumbnail + the existing ♥ Save. Live example drawn: Kusina Norte — "Salamat sa pag-tikim — the kare-kare was our lola's recipe." + shot. | **NEW**, approval-gated, surfaces in credits |

Verified interactive in `pahina_v12.html`: composer in all three vendor lanes (Kusina/band/MC), shot-pick + submit → "pending approval" card with thumbnail; the guest credits sheet shows the approved example with quote + thumb + ♥ intact.

### §14 addenda 5 — v13: kit #11 "File transfer in" (owner gap: "we still do not have a way to transfer their files to our app… are we still capable of tagging the photos as they upload it? while the event is running?")

**The live-tagging answer, recorded: YES.** The pipeline is per-upload and already real-time: NSFW screen → face-detect against THIS event's enrollments (≥0.85 auto-tag, 0.65–0.85 suggested) → tagged guests' galleries + the live wall. Nothing batches overnight — a shot uploaded at 7:04 is in Maria's gallery at 7:04. **The only missing piece is the INGEST**, so #11 has two paths:

| # | Feature | Status |
|---|---|---|
| 11a | **Upload from phone (NOW-path)** — vendor Papic tab, all lanes: camera-roll multi-select grid → upload → per-shot LIVE pipeline chips ("uploading… → screening → finding faces → **tagged: Maria +2** → on the wall ✓"). Copy: "Move shots to your phone the way you always do — upload here, and guests are tagged while the party's still going." Counts against the documentation allowance (photo = 1 pt · 10-s clip = 7 — verified: 4 shots incl. 1 clip deducted exactly 10). JPEG honesty line: "Phone-sized JPEGs tonight; full-res to the couple's Drive later" (papic full-res-drop + Drive-handover machinery shipped). | **NEW wiring** (ingest only; pipeline shipped) |
| 11b | **Camera Bridge (PRO-path)** — "Pair your camera · Canon R / Nikon Z / Sony α / Fuji X — shots flow in as you shoot · ₱499/day" chip, honesty tag **"coming"**. Grounding: `Camera_Bridge_Build_Plan_2026-06-11.md` + `0012_papic_compatible_cameras.md` + the ₱499/day packaging (Live Studio memory). | planned, not built |

**Noted, needs-owner-call (not drawn):** a dedicated **photographer lane** (shot-list substrate `shot-list.tsx` shipped) as an optional further vendor identity — the upload/Bridge cards would be its centerpiece.

### §14 addenda 6 — vendor point LOAD-UP ladder, FINAL (owner: "that is how they load up also for the app. 100 pesos - 250 pts / 1000 pesos - 3000 pts")

**Two tiers, one meter (spell-out):** the **fee-proportional GRANT** (50–200 pts + BYO 10-pt gift) is the *self-documentation* tier and keeps its 200-pt cap — **the cap applies to the grant only, never the balance**. The **LOAD-UP ladder** is the *delivery* tier: repeatable purchases stacking on top of the grant, no ceiling.

| SKU | Price → points | Notes |
|---|---|---|
| `VENDOR_TOPUP_SMALL` | **₱100 → +250 pts** | same rate as Papic One's ₱100/250 add-a-camera — rate consistency across the platform; repeatable; inert `is_active=false` until owner flips |
| `VENDOR_PRO_PACK` | **₱1,000 → +3,000 pts** | "enough to tag and deliver a full wedding in real time" — the pro photo/video delivery pack; sits between Papic One (2,500/₱1k) and guest top-up (~3,333/₱1k) on the existing ladder; repeatable; inert until flip |
| ~~upgrade-to-200 (+₱100)~~ | — | **REMOVED — superseded** by the ladder (the v10 `VENDOR_PAPIC_UPGRADE` row is dead; never build it) |

**Meter card as drawn (final):** balance "74 / 100 pts" (locale-formatted at any size) · fee line ("Booking fee ₱2,000 → 100 pts…") · progress meter · "Open vendor camera" + the two chips **"+250 pts · ₱100"** and **"+3,000 pts · ₱1,000"** · hint "Load up any time — the ₱1,000 pack is for full-wedding real-time delivery. Points stack on top of your allowance." · BYO line "…10 pts as a gift from Setnayan…; their gift tops up the same way." Both chips open apply-then-pay sheets; verified stacking 74/100 → 324/350 → 3,324/3,350.

### §14 addenda 7 — v14: the coordinator IS a vendor (owner: "where are the reviews for the coordinator?" + "why does the coordinator not have papic camera app? and the upload?")

**Omission fixed + row corrected:** the matrix's coordinator row means **Generic Vendor kit + coordinator specials** — coordination is a paying vendor category, and v13's console tabs had squeezed her kit (reviews included) out entirely.

**Liza's final tab map (≤5): `Show · Announce · Requests · Event · Biz`**
- **Show / Announce / Requests** — unchanged (console; requests tab keeps inbox + money stub)
- **Event** — merge of the old QRs + Guests tabs: QR kit (4 rows) · find-my-seat scanner · arrivals glance + check-in
- **Biz (NEW)** — the FULL kit for HER business: give-us-a-review QR ("it lands on your coordination profile tonight") · reviews-received feed ("Liza ran the day to the minute…") · new favorites ♥ · **her documentation allowance — fee ₱3,000 → 133 pts by the formula** ("118 / 133 pts" drawn) · the two load-up chips (₱100/+250 · ₱1,000/+3,000) · **Upload from phone** with the live pipeline chips · Camera Bridge chip · 3D booth + Ads Gallery (entitlements) · Column for the Couple · Column for the Guests. (Report-updates already live in Requests.)
- **The capture FAB rides her lane on every tab** — "118 pts", opening the same vendor capture sheet as every other vendor. She documents her own work (the styled tables, the run-of-show moments, the reveal) on the same model.
- **Bea's console is unaffected**: her delegation tab set is `Show · Announce · Requests · Event` (no Biz — she isn't the vendor), FAB hidden.

### §14 addenda 8 — v15 CHROME CORRECTION: one pill grammar everywhere (owner: "the bottom nav of bea changed. and the vendors also do not follow the same pill type bottom nav")

**Corrected chrome rule (supersedes the earlier "app-bar, not the pill" note): ALL bottom navs = the 5Tab pill grammar.** The guest `navpill` (floating rounded pill · blur + hairline · sliding active puck · icon above 10px label · active tint + nav-pop) is THE one nav component; **only the tab sets vary by role**. Implementation in `pahina_v15.html`: the role nav element now IS a `.navpill` (same class, same slider anatomy, N-column grid), the flat app-bar CSS is retired. Capture FABs keep riding beside the pill exactly as in the guest lanes.

Verified per lane (container class = `navpill`, border-radius 999px, height 64px, slider present + sliding):
| Lane | Tabs on the pill |
|---|---|
| Maria / public / Bea guest view | Home · Details · Story · Gallery · Me (**Bea's guest chrome verified BYTE-IDENTICAL to Maria's** — `outerHTML` equality — plus her Edit-site chip and Run-the-day card where they were) |
| Kusina Norte | Today · Scan · Papic · Reviews · Requests |
| Manila Strings | Today · Songs · Papic · Reviews · Requests |
| Migs (Host/MC) | Show · Script · Announce · Papic · Requests |
| Liza (coordinator) | Show · Announce · Requests · Event · Biz |
| Bea "Run the day" console | Show · Announce · Requests · Event |

### §14 authority rule — the host natively owns every coordinator capability (owner confirmation Q, 2026-07-25: "Bea, the owner of the event must have similar access like the coordinator? So, when they do not hire a coordinator, they can still do the tasks?" → YES, by construction)

**The couple/host OWNS every coordinator capability natively; hiring a coordinator DELEGATES a guarded subset** (read-parity, propose-not-execute, money wall — consent-scoped per 2026-07-19). **No coordinator hired → the host's Run-the-day console is the full command surface:** vendor "to coordinator" requests and status updates route to the HOST's Requests inbox; broadcasts, phones-down, and the run-of-show are direct. Host differences from a hired coordinator: **no propose-chip** (she approves directly — proposals are the delegate's guardrail, not hers), **Budget open** ("yours alone"), **no Biz tab / no capture FAB** (she isn't a vendor). Demo copy placed in Bea's console header: *"No coordinator hired? This console is yours — vendor requests come straight to you."*
