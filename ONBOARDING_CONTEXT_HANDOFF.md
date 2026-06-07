# Setnayan · Wedding Onboarding — Context Handoff for a Visual Redesign

> **Audience:** a fresh Claude design session that will **redesign the visuals only**.
> **Date assembled:** 2026-06-07 · **Synthesized from:** the working prototype
> `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html` (the build — source of truth for
> *behavior*) and the spec `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` (reference +
> rationale). Both live at `/Users/icecasasola/Documents/Claude/Projects/Setnayan/`.

---

## 1 · What this is & how to use it

This document is the brief for a **visual-only redesign** of Setnayan's adaptive wedding
onboarding. There is already a **complete, working prototype** — a single self-contained
375px no-scroll "phone" mock built in vanilla HTML/CSS/JS, in the Clean Editorial design
system. **That prototype is the current build.** Your job in the design session is to make
it look better, *not* to change what it does.

**The contract:**

- **The prototype is the source of truth for behavior.** Screen order, branching, what each
  screen collects, the love-story copy constraints, the state machine — all of that is fixed
  and is documented below.
- **You redesign the *visuals*** — palette application, layout, type treatment, motion,
  spacing, photography direction, component styling, micro-copy polish (within the
  guardrails). You do **not** add/remove screens, re-wire forks, change which fields are
  collected, or touch the love-story copy constraints (§2.2).
- **The logic is rederived in the origin Setnayan session, not by you.** When your new visual
  design returns, it gets re-skinned onto this exact flow/data/logic by the origin session.
  The canonical logic lives in **this doc** and in **the original (non-inlined) prototype in
  the repo**. So you may freely restyle markup; the origin session re-attaches the flow.
- The spec `.md` is **reference + rationale** (the "why"); where the prototype and spec ever
  disagree on *behavior*, **the prototype wins**.

If a change you want to make would alter any item in §2, **stop and flag it for owner
sign-off** rather than shipping it.

---

## 2 · ⚠️ Non-negotiable guardrails (read first)

These are locked. Breaking any of them breaks the product, not just the polish.

### 2.1 · Adaptive, staged, skip-or-continue flow
- The flow is a **7-beat narrative arc**, not a questionnaire: **Hook → Identity →
  Personalize-live → Problem→solution → Account → Reveal → Offer**.
- It is **staged with checkpoints**. **Stage A (Identity floor)** is irreducible and
  un-skippable; **every later stage is skippable** via a low-guilt "I'll do this later" path
  that always lands on a *real working dashboard*, never a dead end.
- **Pro-by-default:** the full flow leads; the skip is always present and obvious. "Continue"
  is the primary action; the secondary skip never reads as "quit."
- **Every screen is a finish line.** Momentum/reward framing ("You've done X — add Y?"),
  never "answer N more questions." The progress indicator is **stage-based with an honest
  time estimate** — never a discouraging linear "17 to go" count.

**Beat → screen mapping (don't collapse beats thinking they're cosmetic merges):**
| Beat | Screen IDs | Notes |
|---|---|---|
| 1 · Hook | `intro` | Name the pain, promise the magic |
| 2 · Identity | `who`, `helper` (cond.), `couple`, `monogram` | **= Stage A floor (un-skippable).** Monogram is the *checkpoint* that closes Identity. |
| 3 · Personalize-live | `love_intro…love_preview`, `monogram` | The live, reactive personalization — monogram self-draws; the love spine renders the story back. |
| 4 · Problem→solution | `kind…budget`, `s1edu…aigate`, `s2pick…refine` | The planning substance: filters → reception ground-zero → AI matching → service picks/refinements |
| 5 · Account | L1 login (offered at `s4ai`/`s5paywall`; `s1payoff` no longer logs in) | Durable save; never blocks the dashboard |
| 6 · Reveal | `dashboard` | The "Set na 'yan" payoff hub (6 tiles) |
| 7 · Offer | `s4ai`, `s4bundle`, `s4boost`, `s5paywall`, settlement | Commercial-intent moment; soft paywall only |

*(The monogram screen is the **closing checkpoint of Stage A / Beat 2** and simultaneously the
first beat of the live personalization — it spans the Identity→Personalize seam. Treat it as
the boundary, not a cosmetic step.)*

**Stage ↔ screen mapping (the `STAGES` progress labels — exact strings, not guidelines):**
The progress bar shows the **current stage name** (`.stagename`) + an **honest time estimate**
(`.stageest`) + a continuous gold fill (`.stagefill`). It never shows a "N to go" count.
| Stage label | Screen range | Time estimate (illustrative — owner may tune) |
|---|---|---|
| **Welcome** | `intro → love_preview` | ~2 min |
| **The basics** | `kind → budget` | ~2 min |
| **Your venue** | `s1edu → s1payoff` | ~2 min |
| **Setnayan AI** | `aigate`, `s2pick`, `refine_basic` | ~3 min |
| **Essentials** | `s2pick`/`refine_basic` (AI path) | — folds into Setnayan AI on the bar |
| **The extras** | `s3pick`, `refine` | ~3 min |
| **Unforgettable** | `s4ai`, `s4bundle`, `s4boost` | ~2 min |
| **Your plan** | `s5paywall` | ~1 min |
| **One tap** | `survey`, settlement | <1 min |
| **All set** | `dashboard` | — |

If the love stage is skipped (`loveSkipped`), the **Welcome** estimate recalculates down
(fewer screens remain). Time estimates are flexible copy (§7.2) but must stay *honest* — they
recompute as forks add/drop screens; phrase them conversationally ("About 2 minutes").

### 2.2 · Love-story stage copy constraints (the most fragile thing here)
The **Love Story** stage (`love_intro → love_met → love_proposal → love_milestones →
love_tone → love_preview`) is anchored to **only the couple's wedding website**. Every screen,
hint, badge, and sub-line in this stage must speak about the wedding website and nothing else.
This is load-bearing — the must-say / must-never lists below are verbatim spirit, not
suggestions.

**MUST SAY (anchor every love-story screen to the website, and only the website):**
- "your wedding website" / "your wedding page"
- "This is the heart of your wedding website"
- "Opens your wedding website story"
- "A highlight of your website story"
- "Shows as your story timeline on your site"
- "We'll write your website copy in your voice"
- `Appears as "Our Love Story"` (the on-screen badge)
- "Your guests will love it"

**MUST NEVER SAY (anywhere on a couple-facing love-story screen, hint, badge, sub-line,
tooltip, or re-nudge):**
- **editorial · newspaper · song · Pakanta · lyrics / lyric**
- "feature" / "feature article" (when describing the love story)
- "Tell us your story so we can write you a song" / "write you a song" (any phrasing that
  frames song generation from the story the couple just told)
- "Everything you just told us becomes your wedding's own song"
- Any phrase that links the love-story collection to a newspaper/editorial **or** a song.

**ALLOWED — do not over-reject these (they are NOT love-story violations):**
- On the **Pakanta card in `s4boost` only** (Stage-4 à-la-carte carousel, *not* inside the love
  stage): "your wedding's own song" / "your song" / "custom song" / "Setnayan AI composes it" /
  the price ("from ₱1,999"). The card sells the song on its own merits with **zero**
  back-reference to the story collected earlier.
- The word **"editorial"** outside the love stage — see the "Allowed appearances of
  'editorial'" callout below (the Editorial-page settlement deliverable, the `s5paywall`
  freebies line, the "Editorial Feature" taxonomy leaf, the "Editorial" photo/video refinement
  option, and the "Clean Editorial" design-system name).

**Pre-flight covertness grep (run before shipping any love-story copy change):** every screen
from `love_intro` through `love_preview` must pass, on all rendered copy locations (headline,
sub-line, eyebrow, every chip/button label, badge text, ghost-button text, any inline hint):
```
grep -Eiw 'editorial|newspaper|song|pakanta|lyric|lyrics|feature' <love-story screens>
# Expected: ZERO matches on couple-facing copy within love_intro…love_preview.
```
(Note: the grep is intentionally broad. "feature" and "editorial" can legitimately appear
*outside* this stage; the rule is they must never appear *inside* love_intro…love_preview.)

**Identifier covertness (not just rendered copy):** state/DB names are renamed so devtools,
`localStorage`, and network payloads never expose "editorial." Rename **BOTH** `editorialTone →
storyTone` **AND** `editorialLanguage → storyLanguage` (no conditionals), plus
`events.editorial_tone → events.story_tone` and `events.editorial_language →
events.story_language`. **Verify no other state key or column on a love-story field contains
"editorial," "song," or "pakanta."** Keep these names; do not introduce any new identifier
containing those substrings on a love-story field.

**The Pakanta offer is deliberately NOT in the love stage** — it lives as a card in the
Stage-4 `s4boost` carousel, selling on its own merits, with **no back-reference** to the
story the couple told. Do not move it back, and do not add story-callback copy to it.

> **Allowed appearances of "editorial" — do not over-sanitize.** The word "editorial" *does*
> legitimately appear in couple-facing copy **outside** the love stage, and that is fine:
> (a) the **Editorial page** as a named free settlement deliverable (`settleFree`/`settlePay`)
> and in the `s5paywall` freebies list "(RSVP · event site · editorial)"; (b) the
> **"Editorial Feature"** taxonomy leaf and the **"Editorial"** photo/video refinement option
> (catalog service names). These are overt products, not the hidden love-story reuse. The ban
> is specifically: never link the *love-story narrative collection* to a newspaper/editorial
> or a song. "Clean Editorial" is also the **design-system name** (internal).

### 2.3 · Golden onboarding rules (owner-locked 2026-06-01 — every screen obeys)
1. **No scrolling.** The body fits a fixed-height phone frame (≈665px effective inside a
   ~430px-max `.phone` column). Content that grows scrolls *internally* in a designated zone,
   never the page.
2. **Brand always visible.** The Setnayan mark + wordmark sit pinned in the top bar on every
   screen. **SETNAYAN** is spelled in full (never "STNYN").
3. **Minimal words, premium feel.** Serif italic headings, one action per screen, short
   sub-lines (≤32–34ch).
4. **Photos / app icons allowed**, used generously (every picker option gets a real photo).
5. **Thumb-zone split.** Upper zone = viewing/content (`.viewzone`); lower zone = controls
   (`.tapzone` + pinned `.bottom`). Tap targets ≥44px.
6. **Fully preloaded / instant.** No spinners, no lazy-load; photos fade in over a fallback
   gradient; SVGs inline and CSS-animated; monogram self-draws on mount.
7. **Give before you take.** No purely extractive question (the attribution survey) until
   *after* the reveal.

### 2.4 · The uniform refinement template (owner 2026-06-07)
**Every** refinement screen across **every** service is identical in structure. The taxonomy
maker supplies *only* the service label, the options array, and per-option photos; layout,
copy, and UX are standardized forever (see §6.3). Do not design bespoke refinement screens
per service.

### 2.5 · No-scroll 375px phone frame
The artifact renders as a single phone mock (`.phone`, max-width ~430px, `height:100dvh`,
`overflow:hidden`, flex column). On desktop it gets an 880px fixed-height rounded frame.
Keep this frame; design *inside* it.

**Frame anatomy (the ~665px budget — what stacks inside `.phone`):**
```
┌─ .phone  (flex column · max-width ~430px · height:100dvh · overflow:hidden) ─┐
│ .top      PINNED, ~64px   brand bar (.brandrow) + .stagebar + .saved hint    │ ← never scrolls
├──────────────────────────────────────────────────────────────────────────── │
│ .viewzone FLEX-GROW       content/viewing zone — THE ONLY internally-        │ ← internal scroll
│                           scrollable region (overflow-y:auto). Carousels,     │   lives HERE
│                           lists, accordions scroll *within* this zone, not    │
│                           the page. Upper thumb-zone = read/view.             │
├──────────────────────────────────────────────────────────────────────────── │
│ .tapzone  AUTO            interactive controls (chips, fields, pickers) —     │ ← lower thumb-zone
│                           lower thumb reach                                   │
│ .bottom   PINNED, ~72px   primary CTA + ghost/skip; always visible            │ ← never scrolls
└──────────────────────────────────────────────────────────────────────────── ┘
```
- The **~665px** is the *effective body height inside the frame* (≈ `.top` + `.viewzone` +
  `.tapzone` + `.bottom`), the working canvas you design within. `.top` and `.bottom` are
  pinned/fixed-height; `.viewzone` flexes to fill the remainder.
- **Internal scroll is allowed only inside `.viewzone`** (e.g. a long taxonomy accordion or a
  photo carousel). The page itself (`.phone`) never scrolls. A screen that can't fit must move
  overflow into the `.viewzone` scroll region, never grow the frame.
- **Hero photos** fill the `.viewzone` width edge-to-edge; full-bleed heroes (`.herofull`) span
  the zone with a scrim. Default hero aspect is landscape-ish, cropped to the available
  `.viewzone` height (object-fit:cover) — never letterboxed, never page-scrolling.
- **Desktop (880px frame):** same internal layout, just a taller fixed frame — fonts and
  spacing are NOT rescaled; the extra height gives `.viewzone` more room so fewer screens need
  internal scroll. No new breakpoints between 430px and 880px; it's one phone layout in a
  bigger rounded shell.

---

## 3 · Screen-by-screen flow

**31 screens** in canonical order (`ALL` array). Stage names drive the progress indicator
(`STAGES`): Welcome · The basics · Your venue · Setnayan AI · Essentials · The extras ·
Unforgettable · Your plan · One tap · All set.

| # | id | Title | Purpose | Collects | Primary CTA |
|---|----|-------|---------|----------|-------------|
| 1 | `intro` | Intro (Hook) | Name the pain, promise the magic; earn the questions | — (no input) | Build my free plan |
| 2 | `who` | Who are you? | Role; shapes everything | `who` = bride/groom/helper | Continue |
| 3 | `helper` | A little about you | *(only if helper)* helper's own identity for co-host tracking | `helper.{first,last,role}` | Continue |
| 4 | `couple` | The two of you | Couple names — go on invitation/site/monogram | `brideFirst/Last`, `groomFirst/Last` | That's us |
| 5 | `monogram` | Basic Monogram Maker | Live identity; tap logo to restyle | `monoDesign` (0–2: bar/duo/infinity) | Love it ♥ |
| 6 | `love_intro` | Your Love Story (hook) | Threshold to the love spine (website-anchored) | — (Start / "Add it later" = skip stage) | (ghost buttons) |
| 7 | `love_met` | How did you two meet? | Opening beat; textarea + met-year + together-since | `loveStory.how_we_met/met_year/together_since` | Continue |
| 8 | `love_proposal` | And the proposal? | 2nd beat; context chips + optional textarea + year | `loveStory.proposal/proposal_setting/proposal_year` | Continue |
| 9 | `love_milestones` | A few moments along the way | 3rd beat; auto-sorted gold-dot timeline + add | `loveStory.milestones[]` *(deferred to dashboard editor in prod)* | Continue |
| 10 | `love_tone` | How should it sound? | Closer; Warm/Playful/Formal (default Warm) | `storyTone` (renamed from editorialTone) | Finish |
| 11 | `love_preview` | Here's your story | Payoff: renders story back as a site card | — (display only) | (ghost buttons) |
| 12 | `kind` | Wedding Kind | Ceremony type; shapes tradition picker | `kind` = religious/civil/mixed | Continue |
| 13 | `tradition` | Your ceremony tradition | *(if kind≠civil)* religious=1, mixed=2; auto-sets dietary | `traditions[]` | Continue |
| 14 | `date` | When is the big day? | Specific 1–4 dates OR flexible window | `dateMode`, `dateCandidates[]`, `windowStart/End` | Continue |
| 15 | `location` | Where will it be? | Up to 2 areas (Top-30 carousel + search + near-me) | `locations[]` (≤2) | Continue |
| 16 | `pax` | How many guests? | Slider (default 150); filters by capacity | `pax` | Continue |
| 17 | `budget` | Your working budget | Band + line-picker slider + editable amount | `band`, `budget` | Continue |
| 18 | `s1edu` | Why reception venue is first | Education beat: reception = ground 0 | — | Continue |
| 19 | `s1type` | Pick reception type | Photo-cards (Ballroom/Garden/Beach/Heritage/…) | `receptionTypes[]` | Continue |
| 20 | `s1search` | Venues that fit your wedding | Matched results + BYO (up to 2 locations) | `shortlistVenues[]`, `byoVenues[]` | Continue |
| 21 | `s1payoff` | Look how far you are | Stats-only proof of value (no login here anymore) | — (behavioral) | Continue |
| 22 | `aigate` | Setnayan AI gate | Want AI matching? Yes→Stage 2/3, No→Stage 4 | `ai` = true/false | (Yes / No) |
| 23 | `s2pick` | Stage 2 · Your basic services | *(AI=yes)* the 4 must-haves | `basicPicks[]` | Continue |
| 24 | `refine_basic` | Refine your essentials | *(AI=yes)* one chip-row per picked basic (queue) | `refinements[leaf]` | Continue/Next |
| 25 | `s3pick` | Stage 3 · The extras you love | *(AI=yes)* full taxonomy browser (10 parents→tiles) | `enhancePicks[]` | Continue |
| 26 | `refine` | Refine the extras you love | *(AI=yes)* one chip-row per chosen extra w/ a facet | `refinements[leaf]` | Continue/Next |
| 27 | `s4ai` | Stage 4 · Let Setnayan AI run your wedding | Value anchor + reality-check; **starts 30-min timer** | — (triggers timer) | Continue |
| 28 | `s4bundle` | Two ways to make it unforgettable | Bundle choice (Set Essentials / Set Complete) or stay free | `bundle`, `bundlePromo` | (pick / stay free) |
| 29 | `s4boost` | Browse individually (à-la-carte) | Heart/add individual Setnayan services (incl. Pakanta) | `boost[]` | Review my plan |
| 30 | `s5paywall` | Your plan (Summary + Paywall) | Savings hero + freebies + cart; soft paywall | — (`paid` decision) | Purchase now |
| 31 | `survey` | How did you find us? | Post-paywall attribution (one tap) | `survey` | Continue |
| — | `settleFree` | Settlement · Free path | Free Editorial-page second-chance nudge | — (`settlePath='free'`) | (buttons) |
| — | `settlePay` | Settlement · Purchase path | Payment QR + rails + free Editorial bonus | — (`settlePath='pay'`, L2 activation) | (buttons) |
| — | `dashboard` | Dashboard Reveal · Set na 'yan | The Reveal: 6 hub tiles; exits onboarding | — (display) | Take me in → |

*(`settleFree` and `settlePay` are mutually exclusive — only one is in the active sequence at
a time. Reveal `dashboard` tiles: Your venue · Vendors · Website · Guest list · Budget ·
Gallery.)*

**Copy direction for the two no-input "beat" screens (illustrative — flexible per §7.2, kept
honest):**
- **`s1edu` — "Why reception venue is first" (education beat, `.edu` style).** Centered,
  no-input lesson explaining that the **reception venue is ground-zero**: it anchors the date,
  the guest count, and which vendors are even available, so picking it first makes every later
  match accurate. Tone: reassuring, "here's why we ask in this order," not a sales pitch. A
  single supporting graphic/icon (`.eduic`) + one short "why" paragraph (`.eduwhy`); CTA
  "Continue." Example headline: *"Let's lock your venue first."* Example body: *"Your reception
  sets your date, your headcount, and who's free — so everything we match after this fits."*
- **`s4ai` — "Let Setnayan AI run your wedding" (value anchor + reality-check; starts the
  30-min timer).** Frames the **Setnayan AI value anchor** (≈ ₱25–50k equivalent of planning
  work, §7.3) and a gentle **reality-check** — the honest "doing this yourself is real work;
  here's what we'd take off your plate" beat that makes the upcoming offer feel earned, not
  pushy. May show the value anchor here (or carry it into `s4bundle`). Tone: confident, candid,
  never fear-mongering. CTA "Continue" (entering starts the promo countdown). Example
  reality-check line: *"Planning a wedding is dozens of decisions and weeks of back-and-forth —
  let Setnayan AI carry the heavy part."*

### 3.1 · Adaptive forks
| Fork | Condition | Effect |
|------|-----------|--------|
| Role branch | `who === 'helper'` | Insert `helper` before `couple`; others skip it |
| Love Story stage | `!loveSkipped` | After `love_intro`, push the spine `love_met → love_proposal → love_milestones → love_tone → love_preview`; "Add it later" sets `loveSkipped=true` and jumps to `kind` |
| Tradition branch | `kind !== 'civil'` | Religious/Mixed → show `tradition` (1 or 2 picks); Civil skips it |
| AI gate | `ai === true` | Include `s2pick, refine_basic, s3pick, refine`; AI=No skips all four → straight to `s4ai` |
| Settlement path | `settlePath === 'free' | 'pay'` | Push `settleFree` *or* `settlePay`; `dashboard` follows either |

**Threshold screens (`love_intro` and `love_preview`) are not standard content screens.** They
break the usual "primary Continue + secondary skip" pattern on purpose, and use **two ghost
buttons** instead of a single filled CTA:
- `love_intro` shows **"Start"** (enter the spine) and **"Add it later"** (sets
  `loveSkipped=true`, jumps to `kind`). These read as two *equal* doorways, not Continue/Skip —
  preserve that affordance; do not promote one to a filled primary or relabel "Add it later" as
  "Skip"/"Quit."
- `love_preview` is a display-only payoff card with ghost buttons (continue on / edit). No data
  is collected here.
Every *other* love-story screen (`love_met`…`love_tone`) uses the standard filled "Continue"
(and "Finish" on `love_tone`). Keep the threshold screens' twin-ghost affordance distinct.

### 3.2 · `buildSequence()` logic (the state machine)
The active screen list is **recomputed on every `render()`** by `buildSequence()`, so a state
change (`aiAnswer()`, `goFree()`, `goPurchase()`, `loveSkip()`) instantly reshapes the flow.
Order assembled:

1. `intro`, `who`
2. if `who==='helper'` → `helper`
3. `couple`, `monogram`
4. `love_intro`; if `!loveSkipped` → `love_met, love_proposal, love_milestones, love_tone, love_preview`
5. `kind`; if `kind!=='civil'` → `tradition`
6. `date, location, pax, budget` (the universal Pre-Stage filters)
7. `s1edu, s1type, s1search, s1payoff, aigate`
8. if `ai===true` → `s2pick, refine_basic, s3pick, refine` (two refinement passes)
9. `s4ai, s4bundle, s4boost, s5paywall, survey` (everyone)
10. if `settlePath==='free'` → `settleFree`; else if `'pay'` → `settlePay`
11. `dashboard`

**Refinement queues** (`refineQueue` / `refinePos` / `refineScope`) are built on entry to each
refine pass from **(picked leaves in this scope) ∩ (leaves that HAVE a `REFINEMENTS` entry)**.
Queue order is **canonical** (`BASIC[]` order for basics; `EXTRAS_TAXONOMY`/`ENHANCE` order for
extras), **not** pick order, and deduped. A picked leaf with no refinement entry **skips
silently** (the §14 conditional rule). `refine_basic` walks `basicPicks` (N of 4); `refine`
walks `enhancePicks` (N of however many chosen extras carry a facet).

**Worked example (queue order):** in `s2pick` the couple taps **Catering first, then Ceremony
Venue, then Photo & Video** (skips Coordinator). The `refine_basic` queue is built in canonical
`BASIC[]` order — **[Ceremony Venue, Catering, Photo & Video]** — *never* in tap order
(Catering, Ceremony Venue, Photo & Video). Counts read "Service 1 of 3 · Ceremony Venue", "2 of
3 · Catering", "3 of 3 · Photo & Video". The same applies to `refine`: extras walk in
`EXTRAS_TAXONOMY`/`ENHANCE` order regardless of tap order. A leaf can't be picked twice, so the
dedupe never changes a count in practice — it's a safety net.

**Worked example (silent skip):** the couple picks **Catering** (has a facet) and **Live Band**
(`live_band` has a `REFINEMENTS` entry → refines) but also **Lights & Sound** (`lights_sound`
has **no** entry). The refine pass shows screens for Catering and Live Band; **Lights & Sound
produces no screen at all** — it is silently absent from the queue, not an empty/error screen.

**Null-handling rule (downstream contract):** a picked leaf with **no** `REFINEMENTS` entry is
**omitted entirely** from `state.refinements{}` — no key is written (not `null`, not `[]`). The
API/event-preferences layer treats an absent key as **"no preference"** for that service. So
`refinements{}` only ever contains keys for leaves the couple actually refined. Do not invent a
placeholder value for un-refinable leaves.

---

## 4 · Complete data inventory

### 4.1 · Fields collected (user-facing meaning)
| Field / state key | Collected on | Meaning |
|---|---|---|
| `who` | `who` | Role: bride / groom / helper |
| `helper.{first,last,role}` | `helper` (if helper) | Helper identity; role ∈ planner/family/friend/vendor → `event_moderators` |
| `brideFirst/Last`, `groomFirst/Last` | `couple` | Couple names → `events.bride_name/groom_name`; seeded as guests |
| `monoDesign` | `monogram` (tap to cycle) | 0–2 index into `MONO_DESIGNS` (bar/duo/infinity) → `events.monogram_*` |
| `loveStory.how_we_met` | `love_met` | How-we-met narrative (textarea) |
| `loveStory.met_year` | `love_met` | Year met (optional chip) |
| `loveStory.together_since` | `love_met` (inline) | Years together (optional chip) |
| `loveStory.proposal` | `love_proposal` | Proposal narrative (optional textarea) |
| `loveStory.proposal_setting` | `love_proposal` | Context chip: Beach/Surprise/At home/On a trip/Somewhere meaningful |
| `loveStory.proposal_year` | `love_proposal` | Year of proposal (optional chip) |
| `loveStory.milestones[]` | `love_milestones` | `{title, year, month, day}` (deferred to dashboard editor in prod) |
| `storyTone` | `love_tone` | warm/playful/formal (default warm) |
| `storyLanguage` | inherited silently | en/tl/ceb — never asked on screen |
| `loveSkipped` | `love_intro` | true if whole stage skipped |
| `specialMessage` | website editor (not onboarding) | "A note to your guests"; carried on state only |
| `kind` | `kind` | religious / civil / mixed |
| `traditions[]` | `tradition` (if kind≠civil) | 1 (religious) or 2 (mixed) faiths; silently sets dietary defaults |
| `dateMode`, `dateCandidates[]`, `windowStart/End` | `date` | specific (≤4 ISO dates) or window (≤30 days); `event_date` stays null |
| `locations[]` | `location` | ≤2 areas → vendor filter + reception anchor seed |
| `pax` | `pax` | guest count (default 150) |
| `band`, `budget` | `budget` | band (classic/moderate/upscale/luxury/nolimit) + amount (₱; default 650000) |
| `receptionTypes[]` | `s1type` | reception setting(s) → `events.venue_setting` |
| `shortlistVenues[]` | `s1search` | shortlisted venue keys → `event_vendors` 'considering' + reception anchor |
| `byoVenues[]` | `s1search` | BYO venue objects `{name, contact, email}` (≤2) |
| `ai` | `aigate` | true=want AI matching; controls Stage 2/3 inclusion |
| `basicPicks[]` | `s2pick` | the 4 basics (Ceremony Venue/Catering/Coordinator/Photo & Video) |
| `enhancePicks[]` | `s3pick` | chosen enhancement leaves |
| `refinements{leaf:[opts]}` | `refine_basic`+`refine` | Layer-1 facet per picked leaf → `event_vendor_preferences` |
| `bundle`, `bundlePromo` | `s4bundle` | chosen bundle (essentials/complete/null) + whether promo price was live (frozen) |
| `boost[]` | `s4boost` | à-la-carte service keys (animated_monogram, papic, panood, sde, pakanta, custom_qr) |
| `paid` | `s5paywall` | true → settlePath='pay' |
| `survey` | `survey` | attribution: friend/vendor/facebook/google/fair/other |
| `account` | login (L1 activation) | null=local-only; user object once logged in (durable save) |

**State shape (canonical, from the prototype):**
```js
var state = {
  who:null, helper:{first:'',last:'',role:'planner'},
  brideFirst:'', brideLast:'', groomFirst:'', groomLast:'',
  monoDesign:0,
  kind:null, traditions:[], dateMode:'specific', dateCandidates:[], windowStart:null, windowEnd:null,
  locations:[], pax:150, band:'classic', budget:650000,
  loveStory:{ how_we_met:'', met_year:'', together_since:'', proposal:'',
              proposal_setting:'', proposal_year:'', milestones:[] },
  specialMessage:'', storyTone:null, storyLanguage:null,
  loveSkipped:false,
  receptionTypes:[], shortlistVenues:[], byoVenues:[],
  account:null, ai:null,
  basicPicks:[], enhancePicks:[], refinements:{},
  bundle:null, bundlePromo:false,
  boost:[], paid:false, survey:null
};
```
Persistence: not-logged-in → `localStorage` autosave (`saveDraft()`); logged-in → durable
server-side patch-per-page. **L1 = account** (durable + hub usable); **L2 = pay** (unlocks paid
services). `event_date` always commits as **null** (only candidates/window persist).

**L1 / L2 activation — state branching (no hard gates):**
- **Logged-out** is fully playable. State lives in `localStorage` (`saveDraft()` per page); the
  whole flow can be completed without an account, ending on a working dashboard.
- **L1 (account / login)** happens when the couple chooses to **save durably** — offered at
  `s4ai` and `s5paywall` (the old `s1payoff` login was removed). On login, `state.account`
  becomes the user object and persistence flips to **server-side patch-per-page**; the
  `localStorage` draft is migrated up. L1 does **not** lock anything: a logged-in couple can
  still choose the free/DIY path, change bundle/boost picks, or revisit the paywall later.
- **L2 (pay)** is purchase (`paid=true` → `settlePath='pay'` → `settlePay`). It unlocks paid
  services but is **never required** to reach the dashboard — the soft paywall always keeps
  "stay free / DIY" alive (§7.1). A couple may go L0→dashboard, L0→L1→dashboard, or
  L1→L2→dashboard; none of these dead-ends, and none blocks going back to reconsider.

---

### 4.2 · INTERNAL — do not surface in user copy

> **⚠ This subsection describes hidden downstream reuse. None of it may render in any
> couple-facing screen, hint, badge, tooltip, devtools-inspectable state, or network payload.
> The couple is told ONLY "your wedding website."** R = RSVP (the one visible/allowed use) ·
> E = Editorial (always hidden) · P = Pakanta (hidden upstream; overt only at the song step).

**Covert renames (keep these — they exist to prevent identifier leaks):**
| User-facing | Internal column / state | Note |
|---|---|---|
| `storyTone` (Warm/Playful/Formal · badge `Appears as "Our Love Story"`) | `events.story_tone` (was `editorial_tone`) | Couple thinks: site voice. Also drives hidden Editorial voice. Pakanta mood does NOT use it. |
| `storyLanguage` (no on-screen control) | `events.story_language` (was `editorial_language`) | Silent inherit (en/tl/ceb); feeds hidden Editorial generation language. |
| "How did you meet?" + year chips | `events.love_story.{how_we_met,met_year,together_since}` | Couple thinks: site story. Also Editorial narrative + Pakanta coarse pre-fill. |
| "And the proposal?" + chips + year | `events.love_story.{proposal,proposal_setting,proposal_year}` | Couple thinks: site highlight. Also Editorial engagement-length + Pakanta coarse pre-fill. |
| "A few moments along the way" | `events.love_story.milestones[]` | Couple sees: site timeline. Also Editorial sidebar. Deferred to dashboard editor. |
| "A note to your guests" | `events.special_message` | Re-homed off the deleted `love_note` to the website editor; covert Editorial pull-quote. |

**Downstream map (each datum → what it secretly feeds):**
| Collected as | R | E | P | Notes |
|---|---|---|---|---|
| Couple names + display name | ✓ | hidden | hidden | masthead/byline; Pakanta names + must-includes pre-fill |
| Wedding date | ✓ | hidden | – | edition line/tense |
| Location/region (≤2) | ✓ | hidden | – | dateline; also vendor match + token band |
| `how_we_met` (+met year) | ✓ | hidden | PARTIAL→top-up | coarse JSONB; fine beats at optional song-step |
| `together_since` | ✓ | hidden | – | "after N years"; Pakanta derivable, dropped |
| proposal (+year, +setting) | ✓ | hidden | PARTIAL→top-up | engagement-length; fine beats at song-step |
| `story_tone` | ✓ | hidden | ✗ | E voice modulation; Pakanta mood DROPPED |
| `story_language` | ✓ | hidden | – | E generation language |
| `milestones[]` | ✓ | hidden | – | timeline/sidebar |
| `special_message` | ✓ | hidden | – | pull-quote |
| pax → Scale, budget → Spend | ✓/– | hidden | – | E archetype axes (silent derive) |
| ceremony kind/faith | ✓ | hidden | – | E color; dietary defaults |
| silent behavioral capture | – | hidden | – | first-party moat; tunes E archetype; never exported |
| Pakanta feel/voice/mood/tempo/length/photo | – | – | OVERT | net-new, collected only at the song step if purchased |
| Pakanta fine-beat top-ups | – | – | OVERT | overt, gated on `how_we_met`+`proposal` present |
| attribution survey | – | – | – | NOT a content input (recommend-earn + ad-spend) |
| `site_bg_music_source` | ✓ | hidden | OUTPUT-SINK | `'pakanta'` value appears only AFTER the song is purchased |

**Why Pakanta moved out of the love stage:** firing the song offer right after the story
harvest makes "they had me tell my whole story so they could sell me a song"
reverse-engineerable. Re-homing it in `s4boost` (with the whole kind→date→location→pax→budget→
reception→AI→service-pick run in between) breaks the causal adjacency, keeps the love spine
short and pure, and lands the purchase at the natural commercial-intent moment. The "your
story's already in" pre-fill delight lives at the **overt** song step, never in the card.

---

## 5 · Design system (Clean Editorial)

### 5.1 · Palette (CSS custom props on `:root`)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FBFBFA` | Body bg, phone container, sheet base, neutral backdrop |
| `--ink` | `#1E2229` | Primary text, headings, dark buttons, high-contrast fg |
| `--ink-soft` | `#4F535B` | Secondary text, descriptions, muted labels |
| `--ink-faint` | `#8A8F97` | Disabled text, hints, light meta |
| `--gold` | `#C5A059` | Primary accent, highlights, hover borders, progress fill |
| `--gold-deep` | `#A88340` | Eyebrows, mono labels, monogram accents |
| `--gold-wash` | `#F4ECD8` | Subtle bg, info boxes, hover chip, stat strips |
| `--mulberry` | `#5C2542` | **Primary CTA buttons**, secondary accent, timeline peaks, heart/love |
| `--mulberry-deep` | `#4A1D36` | Deepened mulberry for emphasis |
| `--mulberry-wash` | `#F5E8EE` | Subtle mulberry bg, info boxes, refinement tiles |
| `--line` | `rgba(30,34,41,.1)` | Standard borders/dividers |
| `--line-2` | `rgba(30,34,41,.18)` | Stronger borders, fields, card separators |
| `--surface` | `#fff` | Cards, inputs, chip/opt containers, floating surfaces |

*(Body page bg behind the phone frame is `#E9E6DF`.)*

### 5.2 · Typography
- **Headings — serif:** `Cormorant Garamond`, Georgia, serif — *italic, 600*. Q-major 33px,
  edu 32px, moment-q 30px, sheet-h 22px, vname 21px. Editorial/premium voice.
- **Body — sans:** `Manrope`, system-ui — regular, 14–15px. Descriptions, option text.
- **Mono accents:** `DM Mono` — 8–12px, **uppercase, wide tracking** (0.06–0.34em). Eyebrows,
  stage labels, counts, role/kind labels.
- **Display extras:** `Playfair Display` (italic) for the `duo` monogram lockup; `Great
  Vibes` / `Cinzel` available. Large italic serif (18–28px) for plan totals/prices/story
  pull-quotes.
- Line-height: body 1.45–1.6, headings 1.05–1.2, mono labels ~1.15. Letter-spacing: serif 0,
  mono 0.06–0.34em, sans 0.

### 5.3 · Golden rules (restated as build constraints)
- No page scroll — fixed-height `.phone { display:flex; flex-direction:column; height:100dvh }`.
- `.top` brand bar pinned (z-index 5, `--paper` bg) with `.brandrow` (mark + wordmark),
  `.stagebar/.stagefill/.stagename/.stageest` progress, and a `.saved` autosave hint.
- `.viewzone` = content (upper); `.tapzone` + `.bottom` = controls (lower thumb zone).
- Photos fade in (opacity 0.4–0.5s) over a fallback gradient; **no spinners**; inline animated
  SVGs; self-drawing monogram on mount.
- Stage-based progress (`.stagefill` gold gradient, width animates) — never "N to go."
- Give-before-take: attribution only after the reveal.

### 5.4 · Reusable components (CSS class names — preserve these hooks)
| Component | Class | What it is |
|---|---|---|
| Screen container | `.screen` (`.active` shows) | base; `rise` entry animation |
| Content / control zones | `.viewzone` / `.tapzone` / `.bottom` | thumb-zone split; `.bottom` pinned footer |
| Eyebrow / tags | `.eyebrow`, `.tag.new`, `.tag.cond` | mono uppercase context label + NEW/CONDITIONAL pills |
| Heading | `h1.q`, `.sub` | serif-italic Q + sans sub-line |
| Toggle chip | `.chip` (`.sel`), `.chips.eq` | pill select; `.eq` = equal-width grid (role/kind/tone) |
| Stacked option card | `.opt` (`.sel`), `.otrow/.ot/.od/.check` | checkbox card (role/kind) |
| Text field | `.field`, `.field.sans`, `textarea.field` | serif-italic input; `.sans` override |
| Ghost / skip link | `.ghost`, `.stayfree`, `.plan-skip` | low-guilt secondary action |
| Photo card | `.pcard` (`.sel`), `.pimg/.plbl/.ck` | picker tile; photo fades over gradient+emoji |
| Photo carousel / strip | `.pgrid.car`, `.pgrid.strip` | scroll-snap horizontal pickers (62% / 46% cards) |
| Monogram | `.monogram/.mono-host/.mono-lk` + `.mt-*` | 3 live lockups (bar/duo/infinity); tap to cycle, self-draws |

**Monogram microinteraction (the `monogram` screen).** A **single tap anywhere on the
monogram** advances `monoDesign` to the next design, cycling `0→1→2→0` (bar → duo → infinity →
bar) **infinitely** (no end stop, no prev/next arrows — tap = "next", wraps around). On each
cycle the new lockup **re-runs its self-draw** (`mt-draw` → `mt-fill` → `mt-fade`, ~1s total),
i.e. it redraws in place rather than spinning/flipping. A small affordance hint ("tap to
restyle") sits beneath it. The CTA "Love it ♥" commits the current `monoDesign`. Restyle freely
(crossfade vs. redraw is a visual choice) but keep: tap-anywhere, infinite wrap-around cycle of
the 3 designs, and a redraw/transition on each change.
| Love year chip | `.loveyear` | year input (met / together-since) |
| Love glyph | `.loveglyph` | gold circle marker on love screens |
| Timeline | `.lovetl`, `.sc-tl` | gold-dot milestone timeline; `.sc-tl .peak` = mulberry |
| Story site-card | `.sitecard/.sc-inner/.sc-mono/.sc-story/.sc-tl` | `love_preview` payoff card |
| Education screen | `.edu/.eduic/.eduwhy` | centered no-input lesson |
| Hero (full-bleed) | `.herofull/.herophoto/.heroscrim/.heroeye/.heromark` | welcome/intro hero |
| In-flow photo | `.flowphoto` | role/kind/tradition photo (SETNAYAN watermark) |
| Venue result card | `.vcard` (`.short`), `.vphoto/.vbody/.vname/.vprice/.vbadge` | **photo fills the whole card**; info on bottom scrim |
| Accordion | `.exgroup` (`.open`), `.exhead/.exname/.excount/.exchev/.exbody` | taxonomy parent → tiles carousel |
| Bottom sheet | `.sheet` (`.open`), `.sheet-backdrop/.sheet-handle/.sheet-h` | BYO add-venue modal |
| Note box | `.note`, `.note.mul` | gold / mulberry info hint |
| Stat strip | `.statstrip/.stat` | payoff stats |
| AI benefits | `.aibenefits/.aibene` | AI-gate value rows |
| Boost carousel | `.boostscroll/.boostcard/.heart` | paid à-la-carte services |
| Bundle cards | `.bdl-card` (`.reco`), `.bc-name/.bc-pricerow/.bc-was/.bc-now/.bc-off/.bc-save/.bc-cta` | two-bundle choice |
| Cart / plan | `.cart/.cartrow/.cn/.cp/.cx/.carttotal/.tv`, `.freeli` | paywall summary |
| Settlement | `.editimg/.editbody/.editfree` | Editorial-page nudge/bonus |
| Dashboard reveal | `.dashtiles/.dashtile/.setna` | 6-tile hub reveal |
| Progress | `.stagebar/.stagefill/.stagename/.stageest` | stage-based indicator |
| Autosave | `.saved` (`.show`) | "✓ Saved" / "✓ Saved to your account" |

### 5.5 · Animation conventions (keep the vocabulary; restyle freely)
| Name | Timing | Use |
|---|---|---|
| `rise` | 0.4s `cubic-bezier(.2,.7,.3,1)` | screen entry, accordion open, hero |
| `chippop` | 0.22s | tactile chip/heart select |
| `storyfade` | 0.5s | love-story narrative fade-in |
| `momentIn` / `momentOut` | 0.52s / 0.3s | question-moment enter/exit |
| `sayIn` / `markPop` | 0.5s / 0.42s | reveal callout + checkmark pop |
| `glowPulse` | looped | primary CTA glow during the promo countdown |
| `pop` | 0.3s | calendar day select |
| `mt-draw` / `mt-fill` / `mt-fade` | 1s / 0.45s@.85s / 0.5s@1.2s | monogram self-draw → fill → names fade |
| `ring` | 1.8s loop | live-capture pulse |

All motion is gated under `@media (prefers-reduced-motion: reduce)` where it loops or draws —
keep that respect for reduced motion. **This gating is the designer's responsibility, not a
later build-pass add-on:** any new looped/drawn animation you introduce must ship with its
`prefers-reduced-motion: reduce` fallback (reduce to a static end-state or a quick fade).
Animations listed without an explicit easing default to `ease-out`; spell out a custom
`cubic-bezier` if you want one.

### 5.6 · Accessibility (AA target — keep these intact while restyling)
- **Contrast:** body/heading text on `--paper` must hold WCAG AA (≥4.5:1 normal, ≥3:1 large).
  `--ink`/`--ink-soft` on `--paper` pass; **`--gold` (#C5A059) on `--paper` does NOT** — never
  use gold for body copy, only for ≥18px/bold accents, fills, borders, and the progress bar.
  Mulberry CTA text is white-on-`--mulberry` (passes).
- **Tap targets ≥44px** on every interactive element (chips, opts, photo cards, ghost links,
  carousel items, CTAs) — already a golden rule; re-verify per component after restyle.
- **Alt text:** every hero photo and every refinement/picker photo card carries meaningful
  `alt` (the option/leaf label), not empty or filename.
- **Keyboard + focus:** pickers, carousels, the taxonomy accordion, and the BYO bottom sheet
  must remain keyboard-operable with a visible focus ring; don't remove focus outlines when
  restyling chips/cards.

---

## 6 · Imagery & taxonomy

### 6.1 · Image slots per screen (paths the prototype expects under `assets/`)
| Screen | Slot | Asset path pattern |
|---|---|---|
| `intro` | hero | `assets/welcome.webp` |
| `who` | hero | `assets/role.webp` |
| `kind` | hero | `assets/wed_{religious|civil|mixed}.webp` (default `wed_none.webp`) |
| `tradition` | hero | `assets/faith/wed_{catholic|christian|inc|muslim|bornagain|jewish|chinese|cultural}.webp` |
| `pax` | hero | `assets/pax/{t1..t6}.webp` |
| `budget` | hero | `assets/budget/{t1..t6}_{classic|modern|garden}.webp` |
| `s1type` | photo cards | `assets/prefs/setting_{ballroom|garden|beach|heritage}.webp` |
| `s2pick` | carousel hero + tiles | `assets/prefs/ceremony_church.webp` · `assets/picker/{ceremony_venue|catering|coordinator|photo_video}.webp` |
| `s3pick` | all tiles | `assets/picker/{leaf_key}.webp` (every extras leaf) |
| `refine` (ceremony_venue) | carousel | `assets/prefs/ceremony_{church|garden|beach|civil|same_reception}.webp` |
| `refine` (catering) | carousel | `assets/prefs/cuisine_{filipino|spanish|italian|asian|international|fusion}.webp` |
| `refine` (photo_video) | carousel | `assets/prefs/pv_{classic|fineart|photojournalistic|cinematic|editorial}.webp` |
| `refine` (live_band) | carousel | `assets/prefs/music_{acoustic|jazz|pop|opm|classical}.webp` |
| refine fallback | generic | `assets/welcome.webp` |
| `location` | bg gradient | `assets/cities/{location_code}.webp` |
| `s4boost` | cards | `assets/bundle/{animated_monogram|papic_seats|panood|sde|pakanta|custom_qr}.webp` |

**Photo fallback hierarchy (every refinement option):** (1) curated per-option photo if set
(`REFINEMENTS[leaf].photos[option]`); (2) the leaf's own picker/hero photo
(`LEAF_IMG[leaf]`); (3) the single generic fallback `assets/welcome.webp`. **Every option
shows a real photo — never a bare gradient + emoji.** Photos are admin-uploadable fields.

**Runtime / missing-photo behavior:**
- **Pre-load + fade:** photos fade in (opacity, ~0.4–0.5s) over a **fallback gradient** while
  loading — the gradient is a generic `--paper → --gold-wash` wash (not a per-screen bespoke
  color), with the option emoji badge centered as a placeholder until the image paints.
- **Broken URL at runtime:** if an image errors (`onerror`), it falls **down the same hierarchy**
  (per-option → leaf photo → `assets/welcome.webp`); only if even the generic fallback fails
  does it rest on the gradient+emoji. The option **never disappears** — a refinement option or
  picker tile with no resolvable photo still renders (gradient + emoji + label), it is just less
  pretty. Do not hide an option because its photo is missing.
- This applies identically to refinement carousels, `s2pick`/`s3pick` picker tiles, and hero
  slots.

### 6.2 · The taxonomy: 10 → 53 → 195
- **10 parents:** Planning · Feast · Design · Program · Documentary · Look · Booths · Prints ·
  Transport · (Reception — picked in Stage 1, not in `s3pick`).
- **53 primary tiles (leaves)** under those parents.
- **195 leaf-level facet options** (the refinement option values).
- **4 basics** (always refined, `s2pick`): Ceremony Venue (`ceremony_setting`, faith-adaptive)
  · Catering (`cuisine`) · Coordinator (`coordination_scope`) · Photo & Video
  (`edit_aesthetic`).
- **`s3pick`** browses the full `EXTRAS_TAXONOMY` (parents expand to tile carousels;
  multi-select). The 4 basics and Reception are **excluded** so nothing is offered twice (an
  emptied parent never renders).
- **38 leaves have a `REFINEMENTS` entry** (all 4 basics + 34 extras) → surface a refinement
  screen when picked; ~15 extras have **no entry** and **skip refinement silently**
  (host_mc, lights_sound, dance_floor, fireworks, led_wall, orchestra, wellness, perfume_bar,
  arcade, nail_bar, tarot, caricature, engraving, massage_chair, editorial).

### 6.3 · The uniform refinement template (admin taxonomy-maker model)
Every refinement screen is identical; the taxonomy maker supplies only `label`, `options[]`,
and per-option `photos`. Standardized structure:
- **Header:** eyebrow (service counter "N of M") + H1 "What kind of {service_label}?"
- **Sub-line:** single supportive line ("Pick the ones that feel like you — we'll match the
  rest.")
- **Visual:** photo-card **multi-select carousel** (`.pgrid.car`) — every option a real photo.
- **Emoji badge:** optional small overlay per option (default ✦).
- **Hint:** "Service N of M · {service_label}" (counts only this pass's queue).
- **CTA:** "Next service" (or "Continue" if last). **Progress:** dot-bar over the queue.
- **Dynamic options:** some leaves compute options at render time (e.g. `ceremony_venue` is
  faith-adaptive via `ceremonyVenueOptions()` from `kind`+`traditions`); others use static
  `options[]`.
- **Admin requirement (owner 2026-06-07):** the taxonomy editor exposes a **"primary
  onboarding facet"** field + a sample photo per leaf. A leaf auto-surfaces a refinement
  chip-row **only if** its facet is set. No facet = no refinement (not an error). This is the
  conditional §14 rule — refinement screens are **generated from the taxonomy, never
  hardcoded**.

  **"Facet is set" — precise semantics (so a designer can't get the seam wrong):**
  - **Build-time data, render-time conditional.** "Facet set" means the leaf has a non-null
    `primary onboarding facet` in the taxonomy editor — i.e. a `REFINEMENTS[leaf]` entry exists.
    The admin sets it once at build time; the onboarding flow reads it at render time and
    *conditionally* emits a screen.
  - **Missing facet does NOT vanish the pick.** If a picked leaf has no facet, only its
    **refinement screen** is skipped — the leaf **still appears** in `enhancePicks[]`/`basicPicks[]`,
    in the plan/cart summary, and is forwarded to matching as "no preference." Only the refine
    step is absent; the service itself survives.
  - **`REFINEMENTS` entry ⇔ facet-enabled.** The "38 leaves have a `REFINEMENTS` entry" list
    (§6.2) **is** the set of facet-enabled leaves; the ~15 with no entry (§6.2) are the
    facet-missing leaves that skip silently. A designer should expect **some refinement screens
    to never fire** — that is correct, not a gap.
  - **Worked example:** couple picks **Catering** (facet set) and **Live Band** (facet set) and
    **Lights & Sound** (no facet) → refine Catering + Live Band; **silently skip Lights &
    Sound's refinement** while keeping Lights & Sound in the plan. (See the matching null-rule
    in §3.2.)
  - **Stub leaves:** the 26 stub-leaf facet ratification is a **separate admin-build thread**
    (§7.3) — onboarding does not block on it; a leaf whose facet hasn't landed yet simply skips
    refinement until the taxonomy team sets it.

---

## 7 · Locked vs flexible & owner sign-off

### 7.1 · LOCKED — preserve exactly
- The adaptive **staged skip-or-continue** flow; the **7-beat arc**; **Stage A floor**
  un-skippable, B–E skippable with checkpoints; **pro-by-default**.
- **No-scroll ~665px phone frame**; brand always visible; all 7 golden rules.
- The **screen set and order** (§3), the **forks** (§3.1), and `buildSequence()` logic (§3.2).
- The **data collected** (§4) and the **covert renames + downstream map** (§4.2).
- The **love-story copy constraints** (§2.2) — must-say / must-never verbatim spirit.
- The **uniform refinement template** (§6.3) and the taxonomy-driven generation rule.
- **Stage-4 offer structure:** AI value anchor → two-bundle choice → à-la-carte carousel, all
  reachable, no hard walls. The **30-min first-purchase promo** (starts on first view of the
  offer at `s4ai`; prices auto-revert to full at expiry with a "promo ended" line; nothing
  hides; bundle price frozen at selection via `bundlePromo`).

  **Countdown UX (restyle the look, keep the behavior):**
  - **Where:** a persistent countdown lives in/near the offer header on `s4bundle` **and**
    `s4boost` (both surface the same promo prices), plus a compact mirror on the bundle cards'
    price row (`.bc-pricerow` showing `.bc-was` struck → `.bc-now`). It is **not** on the
    individual `s4boost` boost cards beyond the shared header.
  - **Visual:** a small `mm:ss` timer (text or pill) ticking down; the primary CTA may carry the
    looped `glowPulse` (§5.5) **while the promo is active** to signal urgency. No hard lockout
    visuals.
  - **On expiry:** timer hits 00:00 → prices swap to full, a quiet **"Promo ended"** line
    replaces the savings framing, `glowPulse` stops. Nothing is hidden or disabled; the couple
    can still buy at full price or stay free. A bundle already selected keeps its frozen promo
    price (`bundlePromo=true`).
- **Soft paywall** — "stay free / DIY" always alive as a ghost path. A hard "pay to finish"
  gate is **brand repositioning** and needs explicit owner sign-off (it contradicts the live
  "Start planning · free" promise).
- **Survey after the reveal** (give-before-take), one optional tap.
- **Settlement paths** (`settleFree` soft re-offer / `settlePay` checkout) → dashboard reveal.
- Silent instrumentation throughout (zero UX cost).

### 7.2 · FLEXIBLE — free to restyle
- Visual styling, layout, motion, spacing (within no-scroll + thumb-zone).
- Color application, type treatment, photography direction, component look.
- Exact micro-copy / stage names / screen titles **within the §2.2 covertness rules**.

  **Micro-copy rephrase guide — what's sacred vs. flexible:**
  - **Flexible (reword freely, keeping meaning + tone):** CTA labels ("Continue" → "Next"/"Got
    it"), sub-lines, eyebrow text, screen titles, stage labels + time estimates, survey wording,
    education-beat and value-anchor copy (`s1edu`, `s4ai`), "finish setup" re-entry tone. The
    couple-screen CTAs like "That's us" / "Love it ♥" / "Build my free plan" are **flexible
    flavor** — swap for an equivalent warm phrase if a redesign calls for it.
  - **Sacred (do NOT reword — load-bearing):** every **MUST-SAY** anchor and every
    **MUST-NEVER** ban in §2.2; the badge string `Appears as "Our Love Story"`; the
    twin-ghost-button affordance + "Add it later" framing on `love_intro`; the "stay free / DIY"
    ghost path wording intent (it must always read as a real, non-punitive option); the
    "promo ended" revert line's *meaning*.
- Checkpoint screen visual treatment; bundle-card layout; countdown presentation; survey
  wording; dashboard re-entry "finish setup" tone; refinement chip-row look.
- The free-settlement bonus *example* ("Editorial page") may be a different free service.
  **Guidance:** because the Editorial-page example is not final (§7.3), keep `settleFree`'s
  bonus visual **generic / placeholder** rather than commissioning bespoke Editorial-specific
  photography. Use the `.editimg/.editbody/.editfree` hooks with a swappable graphic so the
  free service can be re-pointed without a redesign. `settleFree` is a real second-chance nudge,
  not a dead end — it must still look finished and lead to the dashboard.
- On-screen time estimates and progress thresholds (subject to the honest-time rule).

### 7.3 · Open decisions flagged as illustrative (owner sign-off required — do NOT treat as final)
- **Bundle pricing is illustrative** (owner-supplied placeholders): Set Essentials **promo
  ₱21,000 / full ₱35,000** · Set Complete **promo ₱36,000 / full ₱67,000** (Best value) ·
  Setnayan AI alone **promo ₱8,000 / full ₱10,000**. No SKU locked. Keep the *structure*
  (two bundles + AI anchor + promo-revert); prices may change on owner redline.
- **Bundle names** "Set Essentials" / "Set Complete" are working proposals (acceptance
  required).
- **Setnayan AI value anchor** framed at ₱25–50k equivalent (positioning confirmed
  2026-06-07).
- **Pakanta tier ladder** — spec ₱1,999 / ₱3,999 / ₱9,999 vs AS-BUILT single **₱2,499** live
  SKU. Unresolved; blocks the song-step tier/intake-depth branch. **Decision required before
  build.** *(In the prototype the `s4boost` card shows "from ₱1,999"; placement is LOCKED — do
  not move it back into the love stage.)*
- **Love-story schema** ships in **PR #1060** (`20260910000000_...sql`), **not yet applied to
  prod** — the `editorial_*` → `story_*` renames must land there so no "editorial" leaks; writes
  are best-effort / non-fatal until then.
- **Admin "primary onboarding facet" field** + 26 stub-leaf facet ratification + venue-vocab
  reconciliation (Reception/Ceremony) are **separate admin-build threads**; onboarding assumes
  the facet data exists (missing facet = no refinement, not an error).

---

## 8 · How to rederive (re-skinning the new visuals back onto this flow)

When your visual redesign returns, the **origin Setnayan session** (not the design session)
re-attaches it to the canonical logic. Process:

1. The canonical **logic** lives in two places: **this document** (§3 flow, §3.2 state
   machine, §4 data) and **the original non-inlined prototype in the repo** (the
   `apps/web/app/onboarding/wedding/...` build the spec references, plus this corpus
   prototype). Treat both as the spec for *what happens*.
2. Take the redesigned visuals (markup/CSS/motion/photography) and **re-skin them onto this
   exact flow**: same 31 screens in the same order, same forks, same `buildSequence()`
   behavior, same fields written to the same state keys.
3. **Re-verify the guardrails (§2) after re-skinning** — especially the covertness grep: no
   "editorial / newspaper / song / Pakanta / lyrics" on any love-story screen, hint, badge, or
   in any state/DB identifier on a love-story field. (The standing verification in the
   prototype was a clean full-screen render walk with zero banned strings on couple-facing
   love-story copy.)
4. Keep the component class hooks (§5.4) where practical so the re-skin maps cleanly; if you
   rename a class, the origin session re-wires the JS handler to match.
5. Honor the locked vs flexible split (§7): restyle freely within FLEXIBLE; surface anything
   touching LOCKED or the illustrative-pricing items for owner sign-off.

The design session **only** produces the new look. The flow, the screens, the data, and the
covert rules survive the redesign unchanged.

---

## 9 · Companion files

| File (corpus root) | Role |
|---|---|
| **`Onboarding_Wedding_Adaptive_Flow_2026-06-07_SELFCONTAINED.html`** | ⭐ **RENDER THIS.** Single file, ~5.8 MB, **zero external dependencies** — all 176 photos baked in as data-URIs (96 static + an 80-entry `IMGMAP` for the runtime-built families: cities, pax tiers, budget moods, kind). Open it in any browser / preview tool and the whole flow renders standalone. This is the *visual* artifact the design session looks at. Too big to read as text — render it, don't paste it. |
| `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html` | **The canonical behavioral source + readable code** (~282 KB, vanilla JS). The build the redesign re-skins and the origin session rederives onto. ⚠️ **Needs the `assets/` folder beside it to render** (272 webp photos) — it does *not* render standalone; that's what the `_SELFCONTAINED` export above is for. Read this one for the code; render the other. |
| `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md` | **Reference + rationale** (the "why"). §12 = canonical owner flow, §2.5 = love-story stage, §2.5a = covert-collection map, §13 = data inventory, §14 = refinements model. Behavior conflicts → the prototype wins. |
| `ONBOARDING_CONTEXT_HANDOFF.md` (this file) | **The brief.** Everything the design session needs without re-reading the other two. |
| `HANDOFF_to_Onboarding__LoveStory_Stage_2026-06-07.md` | Source handoff for the love-story stage (from the wedding-website session). |
| `LoveStory_Preview_Mockup_2026-06-07.html` | The site-card preview (`love_preview`) the prototype ports. |
| `Taxonomy_and_Refinements_Master_2026-06-04.md` | The 10→53→195 taxonomy + per-leaf ⭐ primary facets (mirrors `apps/web/lib/taxonomy.ts`). |

**How a fresh design session uses these:** read **this brief** + render the **`_SELFCONTAINED.html`**
to see the current look; redesign the visuals; hand the new look back. The origin session reads
the **canonical `.html`** (the small one) for the code and rederives the new visuals onto the flow.

> **Note on §6.1 image slots:** those `assets/...` paths describe *where photos live and what
> they depict* (useful art direction). In the `_SELFCONTAINED` file they're already inlined —
> you don't need the `assets/` folder to see them; you only reference §6.1 when art-directing
> replacement photography.

**Bottom line for the design session:** make it beautiful inside the phone frame, keep every
screen and field, and never let the love story say anything but "your wedding website."
