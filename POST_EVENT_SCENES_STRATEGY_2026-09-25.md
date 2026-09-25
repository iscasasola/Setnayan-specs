# Post Event — the scene strategy (Fable, 2026-09-25)

> Strategy + prototype for the Post Event stage of the Event Hub Maker. Prototype:
> `prototypes/post_event_scenes_strategy_2026-09-25.html` (script-free — the owner's viewer runs no
> JavaScript; every state is a CSS radio/checkbox). Sample couple **Indalecio & Claire · 18 December 2026**.
> Written against `origin/main` @ `4e28416b8` (read through `git show origin/main:…`, never from `~`).
> Every anchor below is a greppable symbol or a file path, never a line number.

---

## 0. What the owner said, verbatim (2026-09-25)

- *"use fable to strategize the different scenes for the post event website"*
- *"the story on that scene 1 of post event is the whole story, what we want is to cut them into smaller
  scenes to allow content for each part giving them freedom to add new scenes. So for post event. scene
  creation will have different preset scenes as well. different from save the date, invitation and on the day."*
- *"post event does not have guest bars. that is the whole summary"* → *"or recap and gallery and vendors?"*

Rows honoured: **POST EVENT IS MANY SMALL SCENES** (before AND after the event; before = placeholders) ·
**PHONE FIRST** (375 × 812 and 390 × 844, WebKit, touch, safe areas) · **THE EVENT HUB PRO FEATURE LIST**
(auto Post Event free; *"Post Event customised"*, *"custom scenes (6 per stage)"*, own media, music = Pro) ·
**THE EVENT CARD'S COVER IS THE EVENT HUB HERO** · the reader-aware gallery (guest **Yours / Everyone's** ·
stranger **shared only** · couple **everything**) · **GUEST BARS FRAME ONLY THE SLIDE** · **THE CANVAS
"GUEST BARS" SWITCH IS NOW "EVENT BAR"** · **PAID-TO-UNLOCK PARTS WEAR A PADLOCK; UNLOCKED ONES WEAR A
DIAMOND** · *read moves, do stays still* · "Event Hub", never "website".

---

## 1. RULE 0 — what exists · what is missing · the delta

**Exists (read on `origin/main`).** Phase 8 shipped as PR #5983 (`changelog.d/rd-maker-p8-post-event.md`):

| Concern | Shipped symbol |
|---|---|
| The 25 auto scenes, compiled from what happened; a source with nothing = a **skipped** scene with its reason, never an empty one | `lib/post-event-scenes.ts` → `compilePostEventScenes`, `FIXED`, `chapterScenes` |
| Lazy compile on the couple's first open after the day (no scheduler, by design) | `lib/post-event-compile.server.ts` → `readPostEventForMaker`, `postEventNeedsCompile` |
| Shown/hidden + order read from the story's own `draft_json.sections` / `sectionOrder` (one source of truth) | `draftToScenes`, `postEventSceneList` |
| The four **open-up** scenes (gallery · film · you · wishes), full screen over the same scroll position, URL hash so Back closes | `app/[slug]/_components/editorial/open-up-layer.tsx`, `openUpHash` |
| Gallery tabs follow the reader | `galleryTabsFor(reader)` → couple **Everything** · guest **Yours / Everyone's** · stranger **Shared with everyone** |
| The Maker's navigator lists Post Event's scenes in the page's order, skipped ones said as such | `lib/maker-scene-list.ts` → `MakerTile` `kind: 'post-event'` |
| The 25 scene templates (five families, phone + desktop arrangements, default preset + transition) | `lib/scene-templates.ts` → `SCENE_TEMPLATES`, `sceneTemplateDefaults` |
| The couple's own scenes — six `custom_N` slots, per-stage order/visibility in `config_json.canvas.stages` | `lib/custom-sections.ts`, `lib/hub-canvas.ts` |
| The guest bar's shape: **one bar, at most five slots, empty slots widen** — and it already says **Recap** on the `after` phase and keeps **Gallery** + **Me** | `app/[slug]/_lib/site-nav.ts` → `resolveSiteNav` |
| Stage words: Save the Date · Invitation · On the Day · **Post Event** | `lib/public-site-stage-labels.ts` |
| The couple's questions for guests (a Maker setup step) | DECISION_LOG 2026-09-25 *"WHAT DO YOU WANT TO ASK YOUR GUESTS?"* |

**Missing (what row 4215 asks for and #5983 deferred, in its own words).**

1. **Per-scene content.** Each auto scene is drawn by its shipped editorial block; the couple can hide and
   reorder (in the story workroom) but cannot open *one* scene and put their own words or photos in it. A
   *"per-scene template SWAP (Pro) is recorded on the scene but not yet rendered"*.
2. **Post-Event-only presets on "+".** Today "+" on any stage opens the 25 templates. Post Event needs its
   own preset catalogue — content-shaped, pre-titled, different from the other three stages.
3. **The before-the-day state.** The compile runs only when `eventEnded`; before the day the Post Event
   stage has nothing to show a couple who opens it. Row 4215: *"before: placeholders 'your photos appear here'"*.
4. **The Event Bar for Post Event.** Open in row 4216.

**The delta this strategy defines.** (§2) the default ordered set with its before/after states · (§3) the
placeholder copy · (§4) free vs Pro · (§5) the preset catalogue · (§6) the Event Bar · (§7) audience ·
(§8) phone-first · (§9) how it sits in the Maker · (§10) the decisions only the owner can make.

---

## 2. The scene system

### 2.1 Three principles

1. **A Post Event scene is one part of the day with one source, one template, and one honest state.** The
   states are already in the code — `auto` (filled from what happened) · `skipped` (its source has nothing;
   said, never blank) · `optional` (absent until chosen). This strategy adds a fourth, **`awaiting`**: the
   source *will* fill after the day and the scene shows what is already true plus what will arrive. Awaiting
   is the before-the-day state of every scene that has a day-of source. **It is never an empty box.**
2. **The couple edits a scene, not the story.** Every scene gets its own words (headline + a line), its own
   photo slots when its template has them, an eye, and a place in the order. The auto text is the default
   value of the field, not a lock — the couple overwrites it and the scene keeps its source underneath
   (*"Written from what happened · edited by you"*).
3. **Auto scenes and the couple's own scenes are one ordered list to the reader, two stores underneath.**
   Auto scenes stay in `event_editorial.draft_json.scenes` (shipped); the couple's own live in the six
   `custom_N` rows with `canvas.stages.editorial` (shipped, D1/D12). `postEventSceneList` is the one place
   that merges them — the navigator, the canvas and the guest page all read that list and nothing else.
   Two mechanisms that disagree about the same fact each pass their own suite; the merge is the fence.

### 2.2 The default ordered set

Seven groups. Keys and templates are the shipped ones (`FIXED` in `lib/post-event-scenes.ts`); the group
headings are the navigator's, drawn as whitespace and a micro-label, never a box.

| # | Group · scene (key) | What it is for | Source | Before the day | After the day | Template | Tier |
|---|---|---|---|---|---|---|---|
| 0 | **THE COVER** · Cover (`cover`) | The one frame the story is remembered by | Hero (`resolveHero`) → chosen cover → a capture · names, date, venue · edition stamp | **Awaiting.** Hero + names + *"The story of the day — written the morning after"* + days-to-go readout | **Auto.** Hero (or chosen cover) + *"Are Married"* + date · venue · guest count · *Read the day* / *Watch the Film* | 4 Full photo, words on top ★ | Free |
| 1 | **BEFORE** · Before the day (`before`) | How they got here | `love_story.milestones` / moments | **Auto already** — the Love Story exists now | Auto | 24 Timeline | Free |
| 2 | **THE DAY** · By the Numbers (`numbers`) | The day in figures | `guests` (invited / attending) · `papic_photos` · chapters · wishes · suppliers | **Awaiting, partly true.** *168 invited · 154 said yes* are real now; captures / wishes read as *"counted after the day"* | Auto, all counters | 12 Big number | Free |
| 3–12 | **THE DAY** · As the Day Unfolded (`ch-1…10`) | One scene per chapter of the day, in the order it happened | Papic buckets named after run-of-show blocks (`event_schedule_blocks`) | **Awaiting, scaffolded.** The schedule exists before the day, so the chapters already stand: *"2:30 PM · The vows — your photos appear here"* | Auto. Clip leads with 5; photos alternate 1 / 2 | 1 · 2 · 5 | Free |
| 13 | **OPEN-UPS** · From the Day · Gallery (`gallery`) | Every clean capture, filed by time; the couple's uploads join here | `galleryPhotos` + `events.our_photos` | **Awaiting.** *"Your photos appear here. The camera opens on 18 Dec."* | Auto · open-up · tabs per reader | 21 Collage (preview) | Free |
| 14 | **OPEN-UPS** · Watch the Film (`film`) | The broadcast replay and any attached films | `watchFilmEmbedUrl`, films | **Awaiting** if Live Studio is booked (*"The replay lands here after the day"*); **skipped** if not | Auto · open-up | 14 Full clip (preview) | Free |
| 15 | **OPEN-UPS** · Were you there? (`you`) | Each guest's own captures and minutes | Their signed Papic link · no name field | **Awaiting.** *"Open this from your Papic link after the day to see your own captures."* | Auto · open-up | shipped part | Free |
| 16 | **OPEN-UPS** · What They Whispered (`wishes`) | Approved guest wishes | `photo_messages` | **Awaiting.** *"Wishes appear here as your guests leave them."* | Auto · open-up | 23 Three short blocks (preview) | Free |
| 17 | **VOICES** · What We Asked (`asked`) | The couple's questions, the guests' answers | `challengeAnswers` (+ the Maker's ask-your-guests setup) | **Awaiting, half-true.** The *questions* are real now and shown; answers read *"— answers arrive after the day"* | Auto | 25 Questions & answers | Free |
| 18 | **VOICES** · Letters to the Editor (`letters`) | Approved guest columns | `guest_columns` | Awaiting | Auto | 22 Two columns | Free |
| 19 | **THE TEAM** · From Your Vendors (`vendors`) | Suppliers' own day-of frames | `vendorMedia` | **Awaiting, team is real.** The booked team is listed; frames read *"arrive after the day"* | Auto | 20 Photo strip | Free |
| 20 | **THE TEAM** · Live Photo Wall (`wall`) | The wall, if the event had one | `photo_wall_photos` · LIVE_WALL | Awaiting if booked · skipped if not | Auto / skipped | 19 Grid of four | Free |
| 21 | **THE TEAM** · What They Said (`said`) | Reviews | `draft_json.reviews` | Skipped (*"no reviews yet"*) | Auto / skipped | 23 Three short blocks | Free |
| 22 | **THE TEAM** · Powered by Setnayan (`powered`) | The services they used | `orders` → services | **Auto already** — orders exist now | Auto | 8 Words only ★ | Free |
| 23 | **THE TEAM** · Vendors We Loved (`loved`) | The two or three they would book again | `vendor_recommendations` | **Awaiting.** *"After the day, pick the suppliers you'd book again."* | Auto | 17 Two side by side | Free |
| 24 | **THE CLOSE** · From the couple (`couple`) | Their thank-you | `events.special_message` — composed for them until written | **Auto if written** (they can write it now) · else composed | Auto · pinned to the close | 11 Letter | Free |
| 25 | **THE CLOSE** · Their Song (`song`) | The song they had made, or typed | `pakanta_song_r2_key` / `love_story.anchors.song` | Auto if it exists · skipped if not | Auto · pinned last | 8 Words only ★ | Free |
| 26 | **THE CLOSE** · What comes next (`next`) | The next edition | `whats-next` | Optional | Optional · after the song | 10 Title card | Free |
| + | **YOUR OWN** · up to six (`custom_1…6`, stage `editorial`) | Anything the day deserved that the software could not know | The couple | Whatever they wrote | Whatever they wrote | any of the 25, via a preset (§5) | **Pro** |

Notes on the set:

- **The Cover is the hero** (row *THE EVENT CARD'S COVER IS THE EVENT HUB HERO*; the shipped cover ladder
  already puts `resolveHero` before the software's own pick). Before the day it is the same hero — the
  couple sees continuity, not a placeholder image.
- **Chapters are the schedule, then the photos.** Because event-day schedule blocks *are* the Papic chapters
  (rows *SCHEDULE = JOURNEY LOG · PREPARATION · EVENT DAY; EVENT-DAY BLOCKS ARE THE PAPIC CHAPTERS* and
  *PAPIC CHAPTERS: AUTOMATIC BY DEFAULT*), the before-the-day chapter scaffold is real: names and times from
  the schedule, media awaiting. This is the single biggest reason the before-state is not a wall of "coming
  soon" — most of the story's skeleton already exists.
- **Skipped stays skipped, even before the day.** A scene whose source cannot exist on this event (no Live
  Studio, no Photo Wall) is skipped with its reason before *and* after, never "awaiting".
- **Nothing here is a new store.** Awaiting is a derived state (`eventEnded === false` and the scene's
  source is day-of), not a saved value.

### 2.3 What changes at midnight after the day

Nothing the couple did is lost. The compile (`readPostEventForMaker`) writes only `scenes` +
`scenesGeneratedAt`; the couple's own words in a scene, their eye and order, and their `custom_N` scenes
carry across untouched (the golden test in `post-event-scenes.test.ts` already holds this for the draft
keys; the per-scene words join the same rule). Awaiting scenes become auto or skipped. The navigator's
stage heading flips from *"Writes itself after 18 Dec"* to *"Auto · written 19 Dec, 6:02 AM"*.

---

## 3. Placeholders — the before-the-day copy

Rule: **say what is already true, then name what arrives, then when.** Three short lines at most, in the
scene's own template, in the theme's type. The same scene, the same layout, the same position — only the
words change. No dashed boxes, no grey rectangles, no "Coming soon".

| Scene | Placeholder copy (as drawn) |
|---|---|
| Cover | eyebrow *POST EVENT* · **Indalecio & Claire** · *Friday, 18 December 2026 · The Garden Pavilion, Tagaytay* · readout **83** *days to go* · line *"The story of the day, written the morning after."* |
| Before the day | Drawn for real from the Love Story; if none: *"Your Love Story comes first. Add a moment and it appears here."* |
| By the Numbers | **168** *invited* · **154** *said yes* · **—** *captures · counted after the day* · **—** *wishes · counted after the day* |
| Chapter (each) | **2:30 PM** · *The vows* · *"Your photos appear here."* — one line, the schedule's own words above it |
| Chapters (no schedule yet) | ONE scene: *"Set the day's schedule and each moment becomes a chapter here."* |
| Gallery | *FROM THE DAY* · **Your photos appear here.** · *The camera opens on 18 Dec. Everything your guests capture files itself by the minute.* |
| Watch the Film | booked: *"The Live Studio replay lands here after the day."* · not booked: skipped, *"No livestream on this event"* |
| Were you there? | *"After the day, open this from your Papic link to see your own captures and the minutes you were in."* |
| What They Whispered | *"Wishes appear here as your guests leave them."* |
| What We Asked | the couple's questions drawn as written · each answer slot: *"— answers arrive after the day"* · none written: *"Ask your guests something. Their answers land here."* |
| Letters to the Editor | *"Guests who write a longer note appear here, once you approve them."* |
| From Your Vendors | the booked team's names (real) · *"Their frames from the day arrive here."* |
| Live Photo Wall | booked: *"The wall's photos appear here."* · not: skipped |
| What They Said | skipped, *"No reviews yet"* |
| Powered by Setnayan | drawn for real from orders |
| Vendors We Loved | *"After the day, pick the suppliers you'd book again."* |
| From the couple | written: drawn for real · not: the composed letter, stamped *"composed for you until you write one"* |
| Their Song | exists: drawn · not: skipped, *"No song for the day"* |
| What comes next | optional, absent |

**Who sees the placeholder state?** Only the couple (in the Maker and in *Preview the whole stage*). Guests
are on Save the Date / Invitation / On the Day until the day ends; the Post Event stage is not the live
stage before then. The placeholders exist so the couple can *edit the story before it is written* — write
the thank-you, choose the questions, place their own scenes — and see exactly where each will land.

---

## 4. Free versus Pro

Follows the confirmed list (row *THE EVENT HUB PRO FEATURE LIST*: *"Post Event customised (auto story
free)"*, *"custom scenes (6 per stage)"*). Marks per row 4209: **padlock** = paid to unlock · **diamond** =
unlocked.

| | Free — stays complete | Pro — one `COUPLE_WEBSITE_PRO` unlock |
|---|---|---|
| The auto story | every scene in §2.2, compiled, in Classic | — |
| Words | edit every scene's headline and line | — |
| Show · hide · order | yes (D4: confirm free; fix the *"Editorial PRO"* copy) | — |
| Background | one colour + one effect (Plain · Dawn · Diagonal · Glow) | media backgrounds |
| Cover | the hero, or a capture from the day | own upload |
| Theme | Classic | the other nine · adaptive theme |
| Template | the compiled one | swap any scene's template (recorded today, to be rendered) |
| Own media in a scene | — | photos / clips in slots · adding to the gallery |
| Own scenes | — (the picker opens; tiles wear the padlock; try in the draft, pay at Apply) | up to six per stage, from the Post Event presets |
| Motion | Scroll | Scrub · Auto · hold cross-fade · scene animation |
| Music | — | their song plays |
| Publish to Discover | yes, consent rule unchanged | — |

Try-in-draft / pay-at-Apply is the ruled mechanic: a free couple can open the "+" picker, place *The
Toast* in the draft, and see it on the canvas; Apply refuses the Pro keys without the unlock and says so
once, in the Apply sheet — the picker itself never nags.

---

## 5. The Post Event presets — the "+" catalogue

**What a preset is.** A preset is *not* a 26th template. It is a **named, content-shaped start**: one of the
25 templates, pre-titled, with its fields named for what the day left behind, and a suggested source. It
stores as an ordinary custom scene — `custom_N` with `canvas.template` (1–25), `canvas.slots`, and a
`canvas.preset` key naming which preset seeded it — so the guest renderer (`renderScene`) draws it with no
new layout code, and `sanitizeHubCanvas` keeps its cap. Twelve presets. All differ from the Save the Date
(the countdown beats), Invitation (details, RSVP, entourage) and On the Day (now, camera, schedule) sets:
every one of these can only be written *after* something happened.

| # | Preset | Purpose | Layout (template) | Fields | Tier |
|---|---|---|---|---|---|
| P1 | **Thank You, From Us** | A second letter, to one group — parents, principal sponsors, the entourage, the ones who travelled | 11 Letter | To (group) · letter · signature | Pro |
| P2 | **The Toast** | One speech worth keeping | 6 Portrait + pull quote (5 Clip with a caption when a clip is given) | speaker · role · the line · photo or clip | Pro |
| P3 | **Best Of** | The couple's own six — hand-picked, not the software's | 21 Collage of 5–6 | 6 photos from the gallery · one caption | Pro |
| P4 | **Before & After** | The plan beside the day — mood board vs the real table, the sketch vs the gown | 17 Two side by side | left photo + label · right photo + label | Pro |
| P5 | **Behind the Scenes** | Getting ready, the things nobody saw | 18 Three mosaic | 3 photos · one line | Pro |
| P6 | **What Almost Happened** | The rain, the late car, the missing ring — told with love | 23 Three short blocks | 3 × (title · line) | Pro |
| P7 | **By Our Count** | The couple's own playful numbers — hours danced, lumpia eaten, tissues used | 12 Big number (three readouts) | 3 × (number · label) | Pro |
| P8 | **From Near and Far** | Where everyone came from | 22 Two columns | places · names (optional; suggested from the guest list's cities) | Pro |
| P9 | **Our Playlist** | The songs of the night, in order | 24 Timeline | up to 6 × (moment · song · artist) | Pro |
| P10 | **The Guestbook** | The paper guestbook, photographed | 19 Grid of four | 4 photos | Pro |
| P11 | **Wish You Were Here** | For the ones who could not come | 8 Words only (2 Photo right when a photo is given) | names (suggested from RSVP *declined*) · words · optional photo | Pro |
| P12 | **Since Then** | An update — the honeymoon, the first anniversary, the news | 1 Photo left, words right | date · photo · words | Pro |

Picker behaviour: headed *"Add a scene · Post Event"*, tiles are real mini previews in the current phone /
desktop view (row 4200), each with the padlock (free couple) or diamond (Pro owned), the template name in
small type under the preset name, and an ⓘ with the one-line purpose. Tapping a locked tile still places
the scene in the draft (try-in-draft). The free couple sees six slots and how many are used.

---

## 6. Guest navigation — the Event Bar

### 6.1 The three options, honestly

| Option | What it gives | What it costs |
|---|---|---|
| **(a) No bar** — *"the whole summary"* | The purest read: one continuous story, editorial from cover to song | On a phone the auto story is ~20 scenes ≈ 25 screens of scroll. A guest returning in March for *the photo of me at the toast* scrolls the whole story every time. It also **removes shipped behaviour**: `resolveSiteNav` already draws Recap · Camera · Gallery · Me on the `after` phase, so "no bar" is a deletion, not a non-decision. And it drops the stranger's **Join** — the one door that grows the guest list. |
| **(b) Recap · Gallery · Vendors** | Three honest jump points; the owner's own second thought | Drops **Me** — the guest's own door (Yours · Were you there? · their QR), the single most-wanted thing after a wedding. Drops **Film**. Keeps a bar shape that differs from the other three stages, so a guest learns two bars. |
| **(c) Recommended — the one bar, five slots, filled for after the day** | Recap · Gallery · Film · Vendors · Me/Join/Manage — the same five-slot shape the guest already learned on the day, and the *do* register the read scenes need (still, immediate, tappable) | Two slot rules change in `resolveSiteNav` (§6.3). The Camera question is the owner's (§10). |

### 6.2 The recommendation — (c), and why

**Post Event is a summary to read and four things to do.** The reading is the scenes — animated,
editorial, one after another. The doing is: get back to the top, open the gallery, watch the film, find
the suppliers, find *me*. Those five are exactly what the shipped bar shape holds. Owner's own rule: *"we
only animate the details, the functions of the event hub stay as an app. but must be presented properly."*
The bar is the functions; the scenes are the details.

The bar is **small, still and in the theme** — a translucent layer over the story (backdrop-blur, no
border), one-word labels, thumb-sized targets, safe-area aware. It **frames only the slide** in the Maker
(row 4200) and hides while an open-up layer is open (the layer has its own ✕ and Back).

| Slot | Label | Where it goes | Drawn when |
|---|---|---|---|
| 1 | **Recap** | top of the story (the cover) — shipped label | always |
| 2 | **Film** | `#open-film` — the Watch the Film open-up | a replay or film exists (else the slot is not drawn and the rest widen) |
| 3 | **Vendors** | scrolls to the first team scene (*From Your Vendors* or *Vendors We Loved*) | a team scene is drawn |
| 4 | **Gallery** | `#open-gallery` — the gallery open-up, tabs per reader — shipped slot | couple always · others when a chapter is public (shipped rule: hide content, announce features) |
| 5 | **Me** · **Join** · **Manage** | guest → `#open-you` (Were you there?) · stranger → `/[slug]/invite` (shipped) · couple → the Maker | always (shipped) |

A typical event draws **Recap · Gallery · Vendors · Me** — the owner's three plus the guest's own door —
and **Film** joins when there is one. Never more than five, never a dead button.

### 6.3 What changes in the shipped resolver (for the builder, not built here)

- slot 2: `phase === 'after'` + a replay/film → **Film** (today the `watch` slot exists only for `day`);
- slot 3: the `story` slot is empty after the day (its own comment says so) → **Vendors** takes it when a
  team scene is drawn;
- **Camera after the day** — today the guest's slot is drawn *locked* (*"The host has not opened the
  camera"*) because *"the camera is part of what the invitation promises"*; after the day that promise is
  spent, and a locked camera on the recap reads as broken. Recommendation: for guests and strangers the
  Camera slot yields to Film/Vendors on `after`; **the couple keeps it** (ruling 1: unconditional). This
  touches an owner ruling of 2026-08-03 — surfaced in §10, not assumed.
- Bar items that open an open-up layer use the shipped hash (`openUpHash`) so Back closes them.

---

## 7. Audience — how each scene reads

Reader comes from the page's own `StoryViewer` → `postEventReader` (couple · guest · stranger). A stranger
meets the story only once it is **published to Discover** (consent rule unchanged); before that they meet
the lock screen. Every photo has already passed `redactStoryLayers` for that viewer — tabs choose, they never
widen (shipped).

| Scene | Guest (belongs to the celebration) | Stranger (published only) | Couple |
|---|---|---|---|
| Cover · Before · Numbers | as drawn | as drawn; guest-layer counts only from the shared layer (`countForLayer`) | as drawn + *Edit* on tap |
| Chapters | shared + their own tagged captures | shared layer only | everything, incl. unshared |
| Gallery (open-up) | **Yours · Everyone's** | **Shared with everyone** | **Everything** |
| Watch the Film | replay + films | only if public | everything |
| Were you there? | **their own** captures and minutes, from their Papic link; no name field | not drawn | a note: *"Each guest sees their own day. You can hide this scene, not fill it."* |
| Wishes · Asked · Letters | approved, screened | approved + shared | approved + the queue |
| From Your Vendors · Loved · Powered by | as drawn | as drawn | as drawn + *Edit* |
| From the couple · Song · Next | as drawn | as drawn | editable in place |
| Their own scenes (custom) | as drawn | as drawn | editable in place |
| **Bar slot 5** | **Me** → Were you there? | **Join** → invite page | **Manage** → the Maker |
| **Before the day** | not the live stage — not shown | not shown | placeholders (§3) |

---

## 8. Phone-first — 375 × 812

Accepted on the phone first (row *PHONE FIRST*): WebKit and Chromium, touch, safe areas, the store shell.

- **One scene ≈ one screen.** `min-height: 70svh`, content centred, 16 px side gutters, no horizontal scroll.
  Phone arrangements come from `SCENE_TEMPLATES[id].thumb.phone`: side templates stack photo above words;
  the collage becomes two columns; the strip swipes; the timeline runs vertical; Q&A is a list.
- **The bar** sits above `env(safe-area-inset-bottom)`, five slots at most, 56 px tall, one-word labels
  (a label that wraps grows its slot and tilts the bar — shipped naming lock). Hidden while an open-up is
  open. Never animated (do stays still).
- **Open-ups** are full-screen layers over the same scroll position; ✕ top-right, the phone's Back closes
  (hash). Gallery: tabs as a segmented row, a time-of-day filter below, a two-column grid; *Add your own
  photos* wears the padlock for a free couple.
- **Readouts** are the interface: the numbers scene is four figures and four micro-labels, no sentences.
- **Video**: clips ≤ 15 s loop silently in place; long videos show a still with ▶ and open full screen
  (default) — the Phase 4/5 media rules.
- **Motion**: Scroll for free; reduced motion = fades; no transform lingers at rest. Text tone adapts to the
  background for everyone (`lib/hub-legibility.ts` rule — never Pro).
- **Tap targets ≥ 44 px**, incl. the ⓘ marks (18 px glyph inside a 44 px hit area).
- **Before the day** the phone shows the same scenes with the §3 copy — same heights, so the couple's
  sense of the page's length is honest.

---

## 9. In the Maker

- **The navigator** lists the seven groups as micro-labels with whitespace between them; each scene is a
  **real mini preview** (row 4200 — scaled render of its template with its words, theme and media), a
  status badge (Auto · Awaiting · Skipped · Optional · Yours), and the eye. Skipped and optional carry no
  number. The stage heading reads *"Writes itself after 18 Dec"* before the day, *"Auto · written <stamp>"*
  after (the stamp is `scenesGeneratedAt`, never "now").
- **Tap a tile → the inspector** shows: the scene's words (editable), its photo slots (padlock for a free
  couple), *What filled it* (the source, in words), *Template* (swap = Pro), *Show / Hide*, and for an
  open-up scene *Opens to*.
- **"+"** opens the Post Event preset sheet (§5) in the current phone/desktop view, headed with the stage.
  Six slots; the count is shown; each tile wears the padlock or diamond.
- **Event Bar switch** on the canvas draws the Post Event bar (§6) over the scene being edited only.
- **Apply** = live for the people of the celebration; **Publish to Discover** keeps the consent review.
  Both unchanged.
- **Retire step** stays deferred as #5983 said: show/hide/order move out of the story workroom only when
  `lint-port-no-lost-controls` shows every control has a home.

---

## 10. Decisions only the owner can make (each with a recommendation)

| # | Question | Recommendation |
|---|---|---|
| E1 | **Event Bar for Post Event:** (a) none · (b) Recap · Gallery · Vendors · (c) the one five-slot bar filled for after the day | **(c)** — §6.2 |
| E2 | **Camera slot after the day for guests/strangers** — today drawn locked by the 2026-08-03 ruling *"the camera is part of what the invitation promises"* | Yield it to Film/Vendors on `after`; the couple keeps theirs |
| E3 | **Word-only Post Event presets (P1 · P6 · P7 · P11) — free, like the five word-only Love Stories, or Pro with every custom scene** | Pro, per the confirmed list; the picker still opens and try-in-draft does the selling |
| E4 | **D4 restated:** reordering / hiding Post Event scenes is free; `editorial-order.ts` still says *"Editorial PRO"* | Confirm free; fix the copy |
| E5 | **Six custom scenes per stage** (the Pro list) vs six shared across stages (the shipped CHECK) — D1 | Ship six shared now, shown per stage by `canvas.stages`; add the migration only if a couple runs out |

---

## 11. The prototype

`prototypes/post_event_scenes_strategy_2026-09-25.html` — one file, inline CSS, **no JavaScript**, Google
Fonts only, marked PROTOTYPE. Three views on a 375 × 812 phone frame, switched by radio inputs:

1. **Maker** — the Post Event stage: navigator groups with scene tiles as real mini previews, status badges,
   the stage heading, and the "+" sheet open on the twelve Post Event presets (padlock on each; a Free/Pro
   switch shows the diamond).
2. **Guest** — the Post Event page scene by scene in Classic (the free look), with the recommended Event
   Bar; a reader switch (Guest · Stranger · Couple) changes the gallery tabs, slot 5, and Were you there?;
   the Gallery open-up opens as a layer.
3. **Before the day** — the same scenes in their placeholder state, the stage heading *"Writes itself
   after 18 Dec"*.

Sample data: Indalecio & Claire · Friday, 18 December 2026 · The Garden Pavilion, Tagaytay · 168 invited ·
154 attending · 1,032 captures · 37 wishes · 6 suppliers. No real phone or bank numbers appear.
