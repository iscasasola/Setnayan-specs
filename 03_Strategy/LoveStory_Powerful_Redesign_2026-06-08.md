# "Tell it" — The Told-Back Love Story
### Recommended redesign of the onboarding love stage · 2026-06-08

> **Status:** Buildable recommendation. Folds the synthesized 7-beat spine into a **shippable 6-screen, no-scroll, covert** love stage by applying every valid fix from the feasibility and story-test critiques. Reference for the build, not yet code.

---

## 0) Why the current one feels like a form (preamble)

The current love stage collects the *components* of a story — a meet-field, a proposal-field, milestone-dates, a tone-chip — and hopes prose falls out the other side. It doesn't. Three structural failures make it read like a greeting card no matter how warm the copy is:

1. **It asks for fields, not moments.** "How did you meet?" gets "at a coffee shop." A box invites the shortest socially-safe answer, and the blank page makes a tired couple freeze.
2. **It has no middle.** The flow jumps met → proposal with nothing between. Real love stories turn on an *almost* — the part that nearly didn't happen — and without it every yes reads as inevitable, which is exactly the flavor of a card.
3. **It has one narrator and no causation.** A single voice listing "A happened, then B, then C" is a timeline, not a story. A story is "*because* of A, B was possible, which let C happen" — told by two people who remember it differently.

The redesign fixes all three: every ask is a **sentence-stem the couple finishes** (specificity engineered by the prompt), each tellable beat carries a **causal follow-up** that pushes past the safe answer, a new **obstacle beat** supplies the middle, a **two-voice toggle** makes it a duet, and the payoff is a **told-back published page** — not a preview card. Same fields harvested. It just feels like being interviewed about the best thing that ever happened to them.

---

## 1) Core idea

Stop collecting story parts and instead **walk the couple down the arc of their own love**, asking for one irreplaceable, sensory micro-moment per beat — completed as a half-finished sentence so the blank page never stares back, then deepened by a single causal follow-up so the answer earns its place in the arc. Two switches run underneath: a **two-voice "your turn / their turn" toggle** (so it's a duet, not a single narrator) and **one net-new obstacle beat** ("the part that almost didn't happen") that gives the story a middle and makes the yes read as a victory. The payoff isn't a preview card — the screen **confesses their own words back** as a published-looking page, leading with a verbatim pull-quote of the one detail only they would know.

**The single load-bearing change:** every ask is a **sentence-stem the couple finishes plus one causal follow-up**, never an open box. "How'd you meet?" → "we met at a coffee shop." But *"The first thing I noticed was ___"* → *"why did that stick?"* → "his hands were shaking when he handed me the coffee he'd ordered me by mistake." **Specificity is engineered by the stem; honesty is forced by the follow-up.**

---

## 2) The beat-by-beat flow (6 screens — replaces love_intro / met / proposal / milestones / tone / preview)

The 7-beat narrative spine (Before → Spark → Almost → Yes → Little Things → Voice → Reveal) is preserved as *story structure*, but **Spark and Almost share one screen** so the on-device flow stays at **6 screens**, matching today's count and the no-scroll frame. A persistent **"● / ●" partner pill** sits top-of-viewzone on the tellable screens (display-only on the hook, active toggle on Spark+Almost and Yes), pre-filled from `brideFirst`/`groomFirst` and defaulting to **"kami"** (joint) so it never blocks. A quiet **"✨ Help me say it"** ghost link appears on every free-text beat.

| # | Screen (beats) | Ask | Input mechanic | Example copy |
|---|---|---|---|---|
| **S0** | **The Hook** *(was love_intro)* | Tell it, or later? | Heartglyph hero + eyebrow **YOUR WEDDING WEBSITE** + h1. Tapzone: primary **"Tell it"** → spine · ghost **"Add it later"** → skips stage, `loveSkipped=true`, zero data. Two greyed name-pills tease the duet. | h1 *(Cormorant italic)*: **"How did the two of you happen?"** · sub: "Tell it like you'd tell a friend over coffee — we'll write it onto your page and read it back to you. Two minutes, mostly tapping." |
| **S1** | **The Spark + The Almost** *(was love_met; folds in NEW obstacle)* | The one thing you first noticed → then the part that almost won | **One screen, two stacked stems.** Partner pill ("Carlo, you noticed first"). **(a) Spark stem** (~2 rows, prefix visible) + sensory starter-chips that drop a stem (☂ weather · 🎵 song · 📍 place · 😅 the awkward part). **Causal follow-up appears the instant they type:** ghost line *"Why did that stick?"* — and the reveal favors the follow-up answer. Year demoted to one tiny pill below ("+ when?" → "· 2019 · together since 2019"), never spinners. **(b) Almost stem** below it: open stem **first**, chips are *cues not categories* (see §3). Causal follow-up: *"What kept you going?"* Ghost on the Almost row: **"Ours was easy — skip."** | Spark stem: **"The first thing I noticed was… "** → *"why did that stick?"* · Almost h-line: **"There was a moment we almost didn't make it because… "** → *"what kept you going?"* |
| **S2** | **The Yes** *(was love_proposal)* | What you remember most — and how it actually felt | Partner pill ("Maria — how did it actually feel?"). **5 setting chips demoted to a quick-row that sets the stem's opening** (Beach / Surprise / At home / On a trip / Somewhere meaningful) — they're the *opening*, not the answer. **Felt-moment stem** textarea. **Required two-tap "who asked?"** (I asked · they asked · we both knew → `proposal_voice`). **Required her/his-side feeling prompt** (*"How did you actually feel when that happened?"* — feeling, not description) → the two-voice braid seed. Year pill. | Stem: **"I knew the moment… "** · who-asked: I asked / they asked / we both knew · other-side: *"How did you actually feel right then?"* |
| **S3** | **The Little Things** *(was love_milestones, reframed)* | The stuff only you two would know | Partner pill retires (this beat is "us"). **2×2 tap-tile grid** (NOT 4-up — 375px-safe, 44px+ targets): 🎵 **Our song** (opens the shipped iTunes song picker → real track) · 📍 **Our place** · 😂 **What we call each other / in-joke** · 🍜 **Our food.** **Place + the yes-moment are linked structurally in the reveal** (not optional flavor — see §4). Below: quiet **"+ a moment that mattered"** row → quick-chips (First date · Pamamanhikan · Moved in · Reunited · Got a pet) + optional 24-char "why it mattered" + year → `milestones[]`. | h1: **"The stuff only you two would know."** · sub: "Tap what's yours. Skip the rest." · place placeholder: "the milk tea place on Maginhawa" |
| **S4** | **The Voice** *(was love_tone)* | How should it sound? | **3 single-select chips** (Warm default / Playful / Formal) with a **live one-line preview above them, rendered from their real Spark line** off a pre-computed prose cache, re-rendering instantly on tap. Covert badge: **"● Appears as 'Our Love Story' on your site."** No authorship copy. Nav label: **"See our story."** | Warm → "His hands were shaking when he handed her the coffee he'd ordered by mistake." · Playful → "He literally gave her the wrong coffee — hands shaking — and somehow that worked." |
| **S5** | **The Reveal** *(was love_preview — see §4)* | (no ask — affirm or edit) | Masthead + verbatim pull-quote, **rendered instantly** (no fake load delay). Tapzone: **"This is us"** (forward) · ghost **"Change a line"** → deep-links to the *exact* beat. | *(see §4)* |
| **+** | **The Encore** *(covert upsell, separate card AFTER reveal only)* | (no ask in the spine) | "Want to hear this as your sound?" → narrative already harvested, so it asks **only music feel/voice**; must-includes pre-filled with their anchors as a *delight*. Always **"Maybe later."** | "We'll turn your story into the music that plays on your page." |

**Screen count:** S0–S5 = **6 screens**, identical to today. The obstacle ships *on screen S1*, not as a 7th screen.

---

## 3) The obstacle beat + two-voice mechanics

### The Almost (the missing middle) — cues, not categories

The flat flow's biggest structural failure was jumping met → proposal with no middle. The Almost lives on **screen S1, stacked under the Spark**, so it adds the arc without adding a screen. Three moves make a tired Filipino couple answer instead of skip:

1. **Normalize it.** "Every story has an almost. Yours makes the ending land." removes the fear that admitting a rough patch is unromantic.
2. **Open stem FIRST, chips as cues second.** This is the key fix from the story test. The couple sees the open stem *"There was a moment we almost didn't make it because… "* and *then* a row of **inspiration cues** (not pre-writing taxonomy): *Time apart? · Family questions? · Different dreams? · Just wasn't sure?* Tapping a cue nudges a direction but the couple **finishes the real sentence themselves** — so a slow-burn-doubt couple or a different-trajectories couple isn't forced into an LDR template. Each cue maps to a **language-agnostic enum** (`obstacle_kind: 'distance' | 'family' | 'timing' | 'different_paths' | 'doubt' | 'other'`) with a translations table behind the label, so Taglish display ("Magkalayo?", "Pamilya?") can localize to TL/CEB/EN later without redesign.
3. **Causal follow-up + guilt-free exit.** The instant they type, a ghost follow-up *"What kept you going?"* appears — this is what links the obstacle causally to the yes ("…almost won. They didn't."). And **"Ours was easy — skip"** lets couples opt out so nobody manufactures fake drama (which reads false in the reveal). If skipped, the reveal **gracefully omits the middle** rather than fabricating one.

In the reveal the Almost becomes the load-bearing pivot and a **mulberry "peak" dot** among the gold timeline dots — the eye literally sees the turning point.

### Two-voice mechanic — a duet, not one narrator

Engineered structurally, **zero extra screens**:

- A lightweight **"● your turn / ● their turn / ● kami" pill** rides S1 and S2, defaulting to "kami." It lights up where his-vs-her contrast is most *kilig*: the Spark (she misread him / he never left), the Almost (who carried the hard part), the Yes (his nerves vs. did she see it coming).
- **The cheapest, always-on unlock is S2's required 2-tap "who asked?" toggle** (`proposal_voice`) — that alone lets the reveal render two people instead of one narrator, even if the couple touches nothing else.
- **The other-side feeling prompt on S2 is REQUIRED**, not optional, and it asks for a *feeling* ("how did you actually feel right then?"), not another description — because the braid only works when it captures the **gap between what one did and what the other experienced**: *"Carlo forgot every word; Maria swears she knew the second he got quiet."*
- Pass-the-phone is itself a kilig moment ("your turn, babe") and keeps each screen to one focused thumb-ask (golden-rule compliant).

**Scope note (build):** the full per-partner toggle on S1+S2 renders into a single shared `loveStory` told-story, **not** a per-partner branching schema. The only *required* two-voice capture is S2's `proposal_voice` (2-tap) + the one other-side feeling line. Expanding distinct his/her capture to the Spark beat is a Phase-2 schema decision, not a launch blocker.

---

## 4) The reveal design (fragments → told-back story)

Re-architected from "preview card" → **confession**, inside the existing `.sitecard` scaffold so it literally previews their real page. Honors `prefers-reduced-motion` → all instant.

1. **MASTHEAD / DATELINE — render instantly.** No fake "WEAVING YOUR STORY…" load delay (cut per the story test — the couple already did the work; a procedural delay reads as theater, not rhythm). Straight to the monogram lockup (initials, Cormorant italic mulberry, gold ampersand) + a newspaper-style mono dateline — `MARIA & CARLO · MARCH 2026 · BAGUIO`. Treating names+date+place as a dateline is what flips "form preview" → "published page." *(Optional: a single sub-200ms fade-up on the card, never a masked withhold.)*
2. **PULL-QUOTE FIRST & BIGGEST.** The very first prose is **not template text** — it's their single most irreplaceable line (favoring the causal follow-up answer), lifted **verbatim**, set as a centered editorial pull-quote (~26px Cormorant italic, mulberry accent on the keyword). Seeing their *own* untouched sentence framed beautifully = instant recognition, no Mad-Libs seam to detect.
3. **BRAIDED PROSE with causation.** Beneath it, the tone-voiced narrative tracing Before → Spark → **Obstacle-pivot** → Yes → threshold, with her-line/his-line **alternating** (fading in ~120ms apart). The prose is written on *because*-links, not *and-then*-links: the spark causes the noticing, the almost makes the ask mean something, the place makes the yes a full circle. Em-accented phrases are **their** anchors (the song, the place, the food) — never invented. **Place + the yes are woven together structurally** so anchors are skeleton, not decoration.
4. **TIMELINE draws dot-by-dot.** Each label carries its "why" ("Bingo chose us," not "Got a pet"), ending on the **mulberry peak** "We do." Live caption "Updates live as you tell it" stays.

CTAs: **"This is us"** (forward) · ghost **"Change a line"** → deep-links to the specific beat (2 taps to fix one word, not a re-run). The **tone toggle stays live** so they can taste all three voices against the *full* story.

### Worked example — Maria & Carlo (Baguio meet · OFW long-distance · meaningful-place proposal · March 2026)

**RAW FRAGMENTS the tired thumb actually enters:**

- **S1 Spark** *(Carlo's turn)* — stem "The first thing I noticed was…" → *"her hands."* · follow-up *"why did that stick?"* → *"she was holding the cup with both hands like it was the only warm thing in Baguio."* · 🎵 chip → "Kung 'Di Rin Lang Ikaw" was playing · year **2018**, together since **2019**.
- **S1 Almost** — open stem + cue **"Time apart?"** *(Maria's turn)* → *"…Manila to Cebu, Carlo sa Dubai. 3AM video calls bago ako matulog. We almost called it twice."* · follow-up *"what kept you going?"* → *"we kept counting down to the next time he'd land."* · `obstacle_kind: 'distance'`.
- **S2 Yes** — setting chip **Somewhere meaningful** · *(Carlo)* "I knew the moment…" → *"…we were back at the same church pew sa Benguet where we first really talked. I forgot every word I practiced."* · **who asked = I asked** (Carlo) · **other-side feeling (Maria, required):** *"Zero idea. I was annoyed he was walking so slow."* · year **2024**.
- **S3 Little Things** — 🎵 *Kung 'Di Rin Lang Ikaw* (song-picker track) · 📍 *Session Road, Baguio* · 😂 *"he calls me Gwapa, sarcastically"* · 🍜 *"strawberry taho, lagi"* · + moment: *Pamamanhikan, Benguet, 2023*; *Reunited — umuwi for good, 2024.*
- **S4 Voice** — heard all three on his "both hands" line, chose **Warm** (Maria teared up).

**WHAT THE FLAT FLOW WOULD HAVE PRODUCED:** *"It started in Baguio. Then Carlo proposed somewhere meaningful. In 2026, under everyone they love, Maria & Carlo finally say we do."* — a sentence, not a story. No almost, no 3AM calls, no taho, single narrator, no causation.

**WHAT THE TOLD-BACK REVEAL RENDERS (Warm):**

> **M & C** — *MARIA & CARLO · MARCH 2026 · BAGUIO*
>
> *"She was holding the cup with both hands, like it was the only warm thing in Baguio."*
>
> She wasn't even looking — fresh out of one season, buried in work. Carlo just couldn't stop noticing her hands. Then came the hard part: two years magka-time zone, Carlo sa Dubai, a hundred 3AM calls that almost won — but they kept counting down to the next landing, and **they didn't quit.** So when he finally came home and asked — back at the same church pew sa Benguet where they first really talked — it had to mean everything: Carlo forgot every word he'd practiced; Maria was just annoyed he was walking so slow, and said yes before he finished. This March, surrounded by everyone they love, they make it official. Still Session Road. Still strawberry taho. Still *Kung 'Di Rin Lang Ikaw.*
>
> **Timeline:** ● 2018 The coffee · ● 2023 Pamamanhikan · ◆ 2023–24 Two years apart *(mulberry peak)* · ● 2024 The pew, the yes · ● 2026 We do

**The transformation:** the stem + follow-up forced "both hands like the only warm thing in Baguio" (not "her smile"). The obstacle's open stem + "what kept you going" supplied the causal pivot — *"a hundred 3AM calls that almost won — but they kept counting down… they didn't quit. So when he asked, it had to mean everything."* The required two-voice feeling prompt produced the braid (his panic, her annoyance). The closing anchors ("strawberry taho," "*Kung 'Di Rin Lang Ikaw*") are something **no template could invent** — unmistakably theirs.

---

## 5) Covert-harvest map

Identical field harvest to the flat flow, plus the obstacle + anchors + two voices — and the couple only ever experiences "telling our wedding-website story." **No surface ever names the downstream reuse.**

| Harvested (couple sees a story prompt) | Stored | Secretly seeds *(never surfaced)* |
|---|---|---|
| `how_we_met.{her,him}` + the causal follow-up line, `met_year`, `together_since` | `loveStory` | **RSVP "Our Love Story" block** = the woven prose · **editorial spine** cold-open |
| `obstacle` + `obstacle_kind` (enum) + "what kept you going" *(S1, NEW)* | `loveStory` | **editorial spine** narrative middle ("the turn") · **song lyric seed** = the conflict |
| `proposal.{her,him}` + `proposal_setting` + `proposal_voice` + other-side feeling + `proposal_year` | `loveStory` | RSVP block climax · **editorial** resolution · **song** the "yes" hook |
| anchors = `{song(+track_id), place, in_joke, food}` *(S3, NEW)* | `loveStory.anchors` *(see build note)* | **song must-includes** (names, in-joke, place, the real OPM track) · **editorial** texture/color |
| `milestones[]` = `{year,month,day,title,why}` | `loveStory` | RSVP timeline · **editorial** chronology |
| `storyTone` → persists as `editorial_tone` | `state.storyTone` | drives the prose weave for **all three** uses |
| `loveSkipped` | runtime flag | conditionally builds the sequence; never persists |

**Covertness rules honored:**
- **Single honest surface, start to finish.** S0 "your wedding website" → S4 badge "Appears as 'Our Love Story'" → S5 "This is us." The words **editorial / newspaper / song bank / picker / Pakanta / lyrics / feature** never appear.
- **"Our song" tile, never "Song Bank picker."** The S3 music tile reads only as "our song" (a love-story anchor). No "bank"/"picker" sub-text — that language would flag that songs are being collected separately for music generation. Affordance: "tap to set a song; we'll weave it into your timeline." Harvest is silent.
- **"Help me say it"** is framed only as "a way to say this line for your website" — never "we'll draft your copy." Authorship is never claimed; it reflects *their* fragments back, fully editable.
- **The Encore** fires only after the reveal, as a gift at the emotional peak ("hear it as your sound"). Pre-filling music must-includes with their anchors reads as delight, never as harvest disclosure.

---

## 6) What to build (one-paragraph summary)

Ship a **6-screen, no-scroll, covert** love stage that reads as storytelling: **S0 Hook** (tell-it / add-later skip), **S1 Spark + Almost** (two stacked sentence-stems on one screen, each with a causal follow-up — *"why did that stick?"* / *"what kept you going?"* — the Almost using an open stem with inspiration *cues* mapped to a localizable `obstacle_kind` enum, plus a guilt-free skip), **S2 Yes** (felt-moment stem with a **required** 2-tap `proposal_voice` and a **required** other-side *feeling* prompt that powers the two-voice braid), **S3 Little Things** (a **2×2** 375px-safe tile grid — "Our song" via the existing iTunes picker, "Our place," in-joke, food — with place+yes linked structurally in the reveal), **S4 Voice** (3 tone chips over a **live preview rendered from a pre-computed prose cache**), and **S5 Reveal** (instant masthead + dateline + verbatim pull-quote + causation-driven braided prose + dot-by-dot timeline with a mulberry obstacle-peak — **no fake load animation**), with the Encore music upsell firing only after the reveal. **Build notes:** confirm storage for the new `anchors` branch (own `loveStory.anchors` object, or `milestones[]` rows with metadata tags) before implementation since it isn't in the current canonical field inventory; pre-compute the prose cache from S1–S3 so S4's tone preview is instant; keep the partner-toggle render collapsing into one shared `loveStory` (only `proposal_voice` + one feeling line are required two-voice capture); and back the obstacle chips with an enum + translations table so TL/CEB localization needs no redesign.

---

### Changes applied from the critiques

**From feasibility-covert (ship blockers):** folded the obstacle into S1 to hold 6 screens (no-scroll fix) · renamed "Song Bank picker" → "Our song" (covert leak closed) · S3 grid is now **2×2**, not 4-up (375px / 44px-target fix) · flagged the `anchors` storage decision before build · pre-compute prose cache for S4's live tone preview · obstacle stored as localizable enum + translations · two-voice required-capture scoped to S2 only.

**From story-test (depth blockers):** added a **causal follow-up** to the Spark ("why did that stick?"), the Almost ("what kept you going?"), and made the **other-side feeling prompt required** on the Yes — the three changes that turn the arc from a timeline into causation · reframed the obstacle chips as **cues, not categories** (open stem first) so non-dramatic / slow-burn obstacles surface · linked **place + the yes structurally** in the reveal so anchors are skeleton not flavor · **cut the fake "WEAVING…" withhold animation** (read as theater for a couple who already did the work).
