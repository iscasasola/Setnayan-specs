# Event Details — setup by stage, one record, edited on the page (study, 2026-10-04, Fable)

**Owner's ask (4 Oct, verbatim):** *"The Event Details — these are the basic setup needed like picking a theme, colors, fonts, button styles, transition styles, guestlist rules, toggles if needs and rsvp or not, etc and information needed like event date, venue, time, schedule, love story. I need you to study these concepts and create an improved approach for both desktop and mobile view."* — plus, same day: scenes are groups of elements; each scene can be customised (background · framed/full width · animation in/during/out · transition · fonts · colours · button); every text, image and design on a scene is editable; element In animations combine; *"Themes has different scenes, each scene has different element. Theme covers the overall rules. Scenes are like themes but for a smaller scale. Elements are now more customization."*

**Prototype:** `prototypes/event_details_improved_2026-10-04_fable.html` (11 screens, phone 375 + desktop 1280 scaled, light + dark, **zero `<script>`**) · screenshots `…_fable-1.jpg … -12.jpg` (12 = dark).

**Measured on `origin/main` at `a08b7e9bfa`** (worktree `wt-read-details`, removed after). Every anchor is a greppable symbol or a command, never a line number. RULE 0: nothing below is a new screen — every frame starts from an approved design or a shipped component and shows only what **MOVES**, a **RULE**, or what is **NEW**.

---

## 0 · The spine — THEME → SCENE → ELEMENT (owner, 4 Oct)

| Layer | What it governs | Ships today (anchor) | Edited where | Reset |
|---|---|---|---|---|
| **THEME** (the whole Event Hub) | theme · background behind every scene · font · colours · **buttons** · **between-scenes transition default** · logo · opening | `lib/maker-look-sections.ts` `LOOK_SECTIONS` = theme · background · font · colours; `lib/invite-themes.ts` (10 themes, each `palette.accent` / `accentInk` / `radius` / `ornament`); `lib/hub-fonts.ts`; `lib/mood-board.ts` `palette_style` | **Look** (one sheet; Maker toolbar `MAKER_LOOK_LABEL`) — and the same rows appear in Event Details › Set up · how it looks, which open the same sheet | "↺ Use the theme's" |
| **SCENE** (a theme at smaller scale) | Style ▾ (its real designs) · background kind · framed/full width · motion preset or in/during/out · into the next scene · **text style shortcut** · shown · move · button override | `lib/hub-canvas.ts` `HUB_BACKGROUND_KINDS` (8) · `HUB_SCENE_SHAPES` framed/full · `HUB_MOTION_PRESETS` still/calm/editorial/cinematic · `HUB_IN`/`HUB_OUT`/`HUB_DURING` with `HUB_DIRECTIONS`; `lib/hub-scenes.ts` `HUB_TRANSITIONS` scroll/scrub/auto + `HUB_AUTO_SPEEDS`; `lib/scene-styles-stages.ts` `STAGE_SCENE_STYLE_SETS`; `invitation_widgets.is_visible` | the scene's **one sheet** on the canvas (`scene-inspector.tsx`; phone = rows, desktop may keep Format · Animate · Arrange · Content) | "↺ Use the Event Hub's" |
| **ELEMENT** (fine customisation) | font · colour · size · motion (in **combinable** · from · during · out · speed · delay) · **shown/hidden** · its content (text typed in place, photo replace/focus/remove, ornament pick/hide, button style) | `lib/element-style.ts` `HUB_EL_IN` rise/fade/none · `HUB_EL_DURING` · `HUB_EL_OUT` · timeline/duration/delay; `element-sheet.tsx`; `type-in-place.tsx` (Wording ▾ · Format ▾ · Style ▾ · Hide); `lib/hub-part-words.ts` `HUB_TYPE_PARTS` | tap the element on the page → the element sheet / type bar | "↺ Use the scene's" |

**Scroll · Scrub · Auto-scroll move BETWEEN scenes** (`lib/hub-scenes.ts`: *"the value stored on scene N means the transition from scene N to scene N+1"*). A scene is a composed group (the top of a stage = logo · eyebrow · names · joiner · date · time · button), never one scene per element. "+ Add a scene" stays for whole new blocks (`CUSTOM_SECTION_TYPES` custom_1…6); "+ Add to this scene" (NEW) adds an element inside an existing one.

One motion vocabulary for scene and element (NEW): **In ▾** = a checklist in one dropdown — Fade · Move · Grow / Shrink (mutually exclusive) · Blur in — ticked together; **From ▾** only when Move is ticked — below · above · left · right · top-left · top-right · bottom-left · bottom-right; **Out ▾** the same set reversed (Fade away · Move away toward ▾ · Shrink away · Grow away) plus the single choices Settle back · Stay put; During · Speed · Delay as shipped. Reduced motion → still. The label sums the pick ("Fade + Move from top-left + Grow").

---

## 1 · Setup vs information — what belongs where, and where each is EDITED vs merely SHOWN

**Setup = a choice that shapes how the Hub looks or works. Information = a fact about the event.** A fact has exactly one home field; a choice has exactly one home field. Both are rows of the one record (Event Details). The difference is only which group they sit in and which editor the row opens.

### 1a · Set up · how it looks (THEME layer)
| Row | Home field (one) | Edited (the field opens from…) | Shown on | NEW? |
|---|---|---|---|---|
| Theme | `events.invite_theme` | Look sheet · Event Details row · setup step "the look" | every stage | — |
| Background behind every scene | hub draft `main` (`saveMain`) | Look › Background · setup "cover photo" step (same `saveMain`, 2026-10-01 row) | every stage | — |
| Font | `events.site_font_key` (`FontPick`) ◆ | Look › Font · Event Details row | every stage | — |
| Colours | `events.role_palette` + `palette_style` (Mood Board) · `site_button_color` ◆ | Look › Colours (opens the Mood Board in place) | Dress code scene "Our colours", each guest's Welcome, the invite doors' button | — |
| **Buttons ▾** = Shape (Theme's · Square · Rounded · Pill) · Fill (Solid · Outline) · Colour (theme accent · a colour from the event's palette) | NEW `events.hub_buttons` jsonb `{shape, fill, color}` (or three keys on the hub draft `main`) — default absent = the theme's `radius` / `accent` / `accentInk` | Look › Buttons; live sample = the real Reply button on the canvas | every pressable guests see: Reply, the RSVP answers, Save my ticket, Open the invitation, Add to calendar (the RSVP form stays standard — 2026-09-27; its buttons follow Look › Buttons, no per-element edit) | **NEW** |
| **Between scenes ▾** (Scroll · Scrub ◆ · Auto-scroll ◆ + Speed) | writes every scene's `config_json.canvas.transition` (+ `autoSpeed`) at once — a bulk set of the SAME per-scene field, never a second field | Look › Between scenes; a scene can still differ in its own sheet | every stage | **NEW** (the per-scene control ships) |
| Logo | the Logo studio's record | Look › Logo › (opens in place, as today) | hero · prints | — |

### 1b · Set up · how it works
| Row | Home field | Edited | Shown on | Note |
|---|---|---|---|---|
| How guests get in (5 choices, grouped List only · Accept · Open) | `events.rsvp_ask_config.{guestsReply, whoCanRsvp, approveEach}` (`lib/who-can-reply.ts` `GUESTS_GET_IN_CHOICES`, `guestsGetInPatch`) | Event Details row (one PickMenu) · RSVP-stage setup step · onboarding card | Welcome's Reply / "You're going", the join door, the Guest list (shows, never sets — 2026-10-02) | **RULE: "RSVP or not" is NOT a second switch.** The "No reply" choices already turn RSVP off; a separate toggle would be a second source of truth for one fact. |
| What to ask guests | `rsvp_ask_config.{plus_ones, meal, dietary, song_request, note, mobile}` (`RSVP_ASK_FIELDS`) | Event Details row · Page ▾ › RSVP (the RSVP stage's `MakerRsvpSettings` is the SAME component) | the reply form | hidden when guests do not reply |
| Reply by | `events.guest_list_edit_deadline` (`resolveReplyBy`) | Event Details row · RSVP stage · setup step B5–6 | reply form ("Please reply by…"), Key dates | hidden when guests do not reply |
| Photos from your guests | `events.papic_on` (`lib/event-answers.ts`) | Event Details row · onboarding card · The Day setup step | Me › Face tagging, Camera tab | — |
| E-Gifts | `events.gifts_on` + the E-Gifts page's methods | Event Details row · E-Gifts page | Welcome's E-Gifts door | — |
| Logo wanted / cover wanted | `events.logo_wanted` · `cover_photo_wanted` | setup steps; Event Details shows the answer | — | answers, not facts |
| Shown on each stage | each scene's `invitation_widgets.is_visible` / `mode` | the scene's own Shown switch; Event Details gathers them in one list (same flag) | that stage | — |
| Address · Who can view · QR | `events.slug`, visibility setting | Event Details › Your Event Hub (the Maker's ⋯ rows leave — calm audit F10) | share, prints | MOVED |

### 1c · Your event (information)
| Row | Home field | Edited (same field, every door) | Shown on (stage · scene) |
|---|---|---|---|
| Names | `events.bride_name` / `groom_name` / `display_name` (name style `name-style.ts`) | tap the names on the hero (type bar, drafted) · Event Details row · onboarding A1 | every stage's top scene · prints |
| Kind · area | `ceremony_type…` · `region` | onboarding A2/A4; Event Details shows (changing them is `details/change` — Event settings) | supplier search |
| Date · time | `events.event_date` (+ precision) · the Ceremony moment's time (`event_schedule_blocks`, `blockTime`) | tap the date/time on the hero (Format ▾) · Event Details row · Save the Date setup step | hero · countdown · prints |
| Guests arrive | the public `pre_ceremony` moment (`hub-setup-steps.ts` B1) | Event Details row · Invitation setup step · tap the Schedule scene | Details/Schedule scene · "Arrive by" |
| Ceremony venue | LOCKED booking (`event_vendors`, `pickVenueBookingRows`) — else the typed name | 🔒 follows the booked parish; "Enter your own" on Event Details (outside the Maker, calm audit F7) | When & where scene · The Day · prints |
| Reception venue | same, with the address pin (`AddressPinField`) | Event Details row (sheet over the When & where scene) · Invitation setup step B2 | same |
| Schedule | `event_schedule_blocks` (+ suppliers' own rows, 2026-10-03) | tap a moment on the Schedule scene · Event Details row | Invitation · The Day · prints |
| Love Story | `events.love_story` moments (`lib/love-story-moments.ts`) | the shipped chapters editor (`love-story-live.tsx`) opened from the scene, the row, or the step — one editor, three doors | Our Love Story scene (Save the Date teaser · Invitation · Post Event) |
| Parents & hosts · the march | guest roles (`details-people.tsx`, `details-march.tsx`) | tap the entourage on the page · Event Details row | Invitation's entourage · prints |
| What everyone wears | `events.dress_code_config` (Mood Board) | Event Details row · tap the Dress code scene · setup step B4 | Dress code scene · guest's look |
| Special message · Reminders | `events.special_message` · `what_to_bring` | typed on the page (`SCENE_TYPE_FIELDS`) · Event Details row | Invitation's Details |
| Guests (estimate · listed · replied) | `estimated_pax` · `guests` | estimate: Event Details row; names: the Guest list only | Papic sizing · prints |
| Budget · suppliers · services · purchases | their own tables | **read-only here** (the Budget page, the Bench, orders own them); 🔒 + "Contact support" on locked rows | — |

**Where each is SHOWN vs EDITED, in one line:** a fact is *shown* on its scene(s) and in Event Details; it is *edited* through ONE field component that mounts in three doors — the scene's sheet (Maker), the Event Details row, the setup step. There is no fourth place. Money rows are shown only.

---

## 2 · One home per fact — how Event Details and the Maker share one editor

Already in the tree, extend it, do not invent:

- **`lib/ugat/fields.ts`** (the Ugat map's Fields layer, 2026-10-02 row): a fact an event question writes must have exactly one home field, shown in Event Details. This is the table; the build adds the two columns it lacks — `editor` (the component) and `doors` (`scene` · `details-row` · `setup-step`).
- **`factEditors`** (`launch/page.tsx` `detailsFactEditors`): the Maker already hands the same editor node to a tapped part. Event Details mounts the same node in a sheet.
- **`lib/hub-setup-steps.ts`**: each setup step already names its Details `item` and `writes` — the step IS the item's editor opened in order. Nothing new.
- **`data-same-field`** (the Special message's three doors): the pattern that makes one component serve several doors — generalise its name to `data-field="<home field>"` on every editor, and a guard reads it.

**Drafts and Apply (owner rule 3).** Everything the Hub draws rides the hub draft (`hubDraftAction`, `maker-draft-store.ts`): typed on the page or picked in a sheet, it shows at once, saves quietly, and reaches guests at **Apply**. Event Details carries the same draft bar (Undo · Apply (n)) so a change made from the record is the same waiting change. Facts the Hub does not draw (the guest-count estimate, "Enter your own" for a venue, Event settings) keep their own Save in `details/change` — they are not Hub publications. Nothing writes on open (held by `every-maker-form-drafts-or-says-so.test.ts`).

**Guard (NEW):** `every-fact-has-one-editor.test.ts` — for every row in `ugat/fields.ts`, the Event Details row, the scene sheet and the setup step render the same `data-field`; two different components for one field fail.

---

## 3 · The setup flow vs Event Details — one screen in two modes (recommended)

**Recommendation: ONE screen (Event Details) with a guided mode, not two screens.**

- The record is the list. The setup is the same list walked in order, filtered by stage. Technically it is what ships: `lib/details-guided-flow.ts` already opens Details items one at a time with Skip/Next and derives "done" from the items' own done; `hub-setup-steps.ts` already makes each step a Details item. The only change is **the order and the filter: by stage** (owner: *"know what stage you want to complete"*).
- Screen 1 "Which stage do you want ready?" replaces the linear Round 0→3 entry: each stage's count = the facts that stage's scenes draw (`STAGE_SCENES` + the fixed top scene + the RSVP stage's three settings) that are not yet filled. Post Event has no step (it fills from the day). Round 1/2/3 in `details-guided-flow.ts` are already Save the Date / Invitations / The day — add RSVP as its own round and let the picker choose the round. **A stage is a filter over the one record, never a second home**, so a fact two stages share (names, date) is asked once and counted for both.
- Screen 2 "Before we start" (approved 2026-10-01) is kept and filtered to the stage: "Already have from sign-up" · "Media that helps" · "We'll ask" (only that stage's facts).
- The Home card "Finish your Event Hub — n of m · Continue", the Maker's What's left, and the once-offer after onboarding stay the three doors (owner-approved default 2026-10-01) — all three open screen 1.
- Afterwards the same page is the record: the stage card at the top shows each stage's count and continues where it stopped.

**Why not two screens:** two screens would need two lists of the same facts with two "done" rules — the exact two-mechanisms-for-one-fact disease the 2026-10-02 row forbids.

**Reconciling "information only" (2026-10-01) with "every answer lives in Event Details, changeable there" (2026-10-02):** the later row wins for facts and choices; the earlier row's "one quiet link per section" survives only for the rows another flow owns (Budget · Suppliers · Services · Purchases), where the row opens that page as itself (no "edit it over there" words). Owner question 1 below.

---

## 4 · Desktop vs phone

**Phone (99%).** One column, full width (owner rule 2). The record page is the list; a row opens its field as **one bottom sheet over the stage page where the fact shows** (the Maker's `maker-sheet.tsx` shape; `MAKER_PREVIEW_MIN_SHARE = 0.55` keeps the page in view). The change is on the page at once; "Done" keeps it in the draft; Back returns to the record. Slim bars only: top ‹ · stage · ↶ · Apply (n); no side column, no tab row (calm audit F4). One sheet shape for a fact, a scene, an element: title = the Hub's own name for it; rows = dropdowns and switches; "↺" in the header.

**Desktop.** The record (one or two columns, 430–560 px) beside the live stage; a tapped row opens in place in the record column and the stage scrolls to the scene and rings it. The Maker's approved four tabs (Format · Animate · Arrange · Content; element sheet Font · Colour · Size · Motion) may stay on desktop; every control is still one dropdown.

---

## 5 · Every scene → its texts · images · designs · styles today → what is missing

Legend: **T** texts typed in place today · **I** images tappable today · **D** designs (ornaments) pickable today · **S** real styles that ship.

| Scene (Hub name) | Stages | T today | I today | D today | S today | Missing |
|---|---|---|---|---|---|---|
| Top scene — Names & date (`hero`) | all | ✓ eyebrow · line · names · joiner · link · caption · date · time (`HUB_TYPE_PARTS`) | hero photo via Look › Hero / `poster-photo-picker.tsx` (not a tap on the photo) | theme ornament fixed | Designs 1–4 (Look › Hero) | photo tap → Replace · Focus · Remove (NEW wiring) · ornament pick/hide (NEW) · hide an element (NEW) · + Add to this scene (NEW) |
| Counting down (`countdown`) | Save the Date · Invitation | — (label not typed) | — | — | 3 (Four tiles · Big number · The calendar) | label typed in place |
| Our Love Story (`our_love_story`) | Save the Date · Invitation · Post Event | — (chapters via `love-story-live.tsx`) | chapter photos in the editor, not on the page | ornament fixed | 3 (Chapters · The essay · The years) | heading tap (NEW) · photo tap (NEW wiring) · ornament ▾ (NEW) |
| Special message (`special_message`) | Invitation · Post Event | ✓ `message` | — | — | 3 (The note · The letter · The quote) | — |
| When & where (`event_details`) | Invitation | — (venue = booking fact) | venue photo in the card (NEW tap) | — | 3 (The plate · Big date, two places · The card) | — |
| Schedule (`schedule`) | Invitation · The Day | — (moments in their editor) | — | — | 3 (Programme rail · One chapter per screen · Clock face) | tap a moment → its row (RULE, exists via Content row) |
| Venue cards (`venue_map`) | Invitation · The Day | — | venue photo | — | 3 (Photo card · Full photo · The journey) | photo tap (NEW wiring); venue name read-only 🔒 |
| Dress code (`dress_code`) | Invitation | — (Mood Board words) | — | palette style ×5 | 3 (Colours and roles · The palette · The line) | words typed in place |
| Reminders (`what_to_bring`) | Invitation | ✓ `reminders` | — | — | 3 (The note · The list · The gift line) | — |
| Camera cues (`photo_moments`) | The Day | — | — | — | 3 (Cards · Down the day · Yes and no) | — |
| Gallery (`your_photos`, `our_photos`) | The Day · Post Event · Save the Date | — | the gallery editor (`media-panels.tsx` chapters) | — | 3 (Mosaic · Grid · Film strip) | photo tap (NEW wiring) |
| RSVP (`rsvp` fixed) | Invitation | words via the RSVP stage panel | — | — | 3 (The reply card · The question · The ticket) | the form stays standard |
| Entourage (fixed) | Invitation · The Day | names from roles | — | — | 3 (Roll call · Two sides · The march) | — |
| Find your seat · Each guest's photos · Announcements · Live hub (fixed) | The Day | — | — | — | 3 each (`FIXED_STYLE_SCENES`) | — |
| A scene of their own (`custom_1…6`) | any | ✓ `title` · `body` | — | — | **0** | **S = 0 → a NEW style set is the only gap worth filling** (owner to approve; never pad others to five) |
| Greeting · ticket · guest's look · E-Gifts (guest-link, fixed) | Invitation · The Day | — (each guest's own) | — | — | ticket: pass-card styles (Prints) | Me drawn for a sample guest (calm audit PR-E) |
| Post Event recap scenes | Post Event | ✓ (post-event panel) | ✓ | — | 14 preset sets (`POST_EVENT_SCENE_STYLE_SETS`) | — |

**Designs today:** each theme carries ONE ornament set (`invite-themes.ts` `ornament`: engraved-gold · twine-sprig · hairline-arch · silver-arch · gilt-double · lace-postmark · confetti-butterfly · gilt-ribbon · deco-fan · hud-glow), tinted by `lib/adaptive-theme.ts`; the host cannot pick or hide one. **NEW: Ornament ▾** (Theme's · any of the ten sets · None) on the Hub (Look) and per scene — the sets exist, only the pick is new.

---

## 6 · What changes vs today — today's place → new place → why

| # | Change | Kind | Today (file / prototype) | New place | Why |
|---|---|---|---|---|---|
| 1 | Setup entry asks "Which stage do you want ready?" | RULE · MOVED | `lib/details-guided-flow.ts` rounds 1–3 in a fixed order; `hub-setup-steps.ts` round 0 | screen 1; rounds become stages incl. RSVP; the picker chooses | owner: by stage |
| 2 | "Before we start" filtered to the stage | RULE | `prototypes/finish_your_event_hub_v2_2026-10-01_fable.html` screen 0 (approved) | screen 2 | only that stage's facts |
| 3 | A step = the fact's field over the page | RULE | guided flow opens Details items one at a time (ships) | screen 3; the sheet over the canvas on the phone | rule 2 + 3 |
| 4 | Event Details rows open the field | RULE | `app/dashboard/[eventId]/details/page.tsx` = information only + "Open … ›" links (2026-10-01) | screen 4/5; rows open the same editor in a sheet; links remain only for money/supplier rows | 2026-10-02 row; "the field goes right there" |
| 5 | Set-up rows (Theme · Font · Colours · Buttons · Between scenes · How guests get in · What to ask · Reply by · Papic · Gifts · Logo · Shown on each stage) grouped at the top | MOVED | spread over `EVENT_DETAILS_SECTIONS` look/guests/rsvp | Set up · how it looks / how it works | the owner's "setup vs information" split |
| 6 | The Maker's Event Details door opens the SAME record | RULE | `maker-details.tsx` opens the Maker's own Details PAGE (`DETAILS_ITEM_GROUPS`) | the one record (calm audit PR-A/B) | one name, one place |
| 7 | No "RSVP on/off" switch | RULE | none exists; `GUESTS_GET_IN_CHOICES` encode it | stays inside How guests get in | one fact, one home |
| 8 | Look gains **Buttons ▾** | NEW | theme-only (`invite-themes.ts` `radius`/`accent`/`accentInk`; `site_button_color` ◆ for the invite doors) | Look › Buttons; Event Details › Set up row | owner: "we have buttons" |
| 9 | Look gains **Between scenes ▾** | NEW (bulk set) | per scene only (`HUB_TRANSITIONS`) | Look row; writes every scene | a global default without a second field |
| 10 | Scene sheet = rows on the phone | MOVED | `scene-inspector.tsx` tabs Format · Animate · Arrange · Content | screen 8 rows: Style · Background · Width · Motion · Into the next scene · Text style · Shown · Move | calm audit F4; no pill rows |
| 11 | Scene **Text style ▾** shortcut | NEW | per element only (`element-style.ts`) | the scene sheet | one tap for the whole scene |
| 12 | A scene is a group of elements; **hide an element**; **+ Add to this scene** | RULE · NEW | elements exist for the hero (`HUB_TYPE_PARTS`); Hide exists on the type bar for words | screen 10 | owner 4 Oct |
| 13 | Element motion **combinable** In/Out + From (corners) + Grow/Shrink + Blur; scenes share the vocabulary | NEW | `HUB_EL_IN` rise/fade/none; `HUB_IN` with 4 directions | screen 11 | owner 4 Oct |
| 14 | Photo tap → Replace · Focus · Remove | NEW wiring | controls ship (`scene-background-row.tsx` focal/zoom, FileUpload compress) | on every picture a scene draws | owner: "if there is image, can edit" |
| 15 | Ornament ▾ pick/hide | NEW | ten sets, theme-fixed | Look + scene sheet | owner: "if there are designs, can edit" |
| 16 | "Your info" name retired | RULE (already ruled) | `maker-bar.ts` `MAKER_DETAILS_LABEL = 'Event Details'` (d15, 2026-10-02) | the 2026-10-02 "(YOUR INFO)" row title is a leftover; say Event Details everywhere | one name |

---

## 7 · Build plan — PR-sized steps (Opus builders; phone 375/390 first; guards from `apps/web`; each PR a changelog fragment + check card)

**PR-1 · The record edits (Event Details rows open the field).** `details/page.tsx`: rows become `<RowField field=…>` that mount the editor `ugat/fields.ts` names, in `maker-sheet.tsx`'s sheet (phone) / in place (desktop); hub-drawn facts write the hub draft (`hubDraftAction`), the page carries `hub-draft-bar.tsx`. Set-up groups per § 1a/1b. Money/supplier rows unchanged (read-only, 🔒). Guards: extend `event-details-shows-the-map.test.ts` (every MAP fact still present) + NEW `every-fact-has-one-editor.test.ts`.
**PR-2 · Setup by stage.** `details-guided-flow.ts`: `GuidedRound` → stage keys incl. RSVP; NEW `lib/stage-setup.ts` deriving each stage's facts from `STAGE_SCENES` + the top scene + the RSVP stage; the picker (screen 1) and the filtered "Before we start" (screen 2) reuse `finish_your_event_hub_v2`'s components; Home card + What's left + once-offer open the picker. Guards: `hub-setup-steps.test.ts` stays; NEW `a-stage-counts-only-its-own-facts.test.ts`.
**PR-3 · One editor, three doors.** `ugat/fields.ts` gains `editor` + `doors`; `data-field` on every editor; the Maker's `factEditors` and the setup read the same table; the Maker's Details page slims per calm audit PR-B (`DETAILS_ITEM_GROUPS` → hub · answers · tools · guide). Guard: `details-lists-only-what-the-page-cannot-draw.test.ts` (calm audit).
**PR-4 · Look › Buttons ▾ (NEW).** Field `events.hub_buttons` (migration, RLS pattern of `events` columns — remember the GRANT for every role; Ugat map node). Where the theme's vars are set — `lib/adaptive-theme.ts` tokens (`--hub-accent`, `--hub-accent-ink`) and the theme `radius` read by the guest page — the host's choice overrides per event, drafted, published at Apply. Label colour from `lib/hub-legibility.ts` (AA `AA_BODY`); a palette colour that fails is not offered (filter at option-build time, never at render). The RSVP form's answer buttons read the same vars, no per-element edit. Guard: NEW `a-button-label-is-always-readable.test.ts` (every offered combination clears AA on both inks).
**PR-5 · Look › Between scenes ▾ + Ornament ▾.** Bulk write of `canvas.transition`/`autoSpeed` on every scene of the draft (Pro asked at Apply as today, `nextTransition`); `events.hub_ornament` / per-scene `canvas.ornament` from the closed set of theme ornament keys. Guards: closed-set checks.
**PR-6 · Scene sheet rows on the phone + Text style shortcut.** `scene-inspector.tsx` under `lg`: rows (screen 8); `canvas.textStyle` applies the element defaults to every element of the scene (an element's own value still wins; ↺ clears). Guard: `a-phone-sheet-has-no-tab-row.test.ts` (calm audit PR-C).
**PR-7 · Elements: hide + add.** Storage without a new table: `invitation_widgets.config_json.canvas.elements` = `{ hidden: HubElementKey[], added: Array<{id, kind: 'text'|'photo'|'button'|'divider', text?, mediaRef?, slot}> }` (closed kinds; `slot` = where in the Style's layout; media by ref, never a URL from input). A hidden element is ghosted in the canvas (`?editor=1`) and not rendered for guests. Guards: NEW `a-hidden-element-is-absent-for-guests.test.ts`, `added-elements-are-closed-kinds.test.ts`.
**PR-8 · One motion vocabulary.** `element-style.ts`: `HubElementMotion.in` becomes `{ effects: Set<'fade'|'move'|'grow'|'shrink'|'blur'>, from?: HubDirection }` (grow/shrink exclusive, validated), `out` likewise + `settle`/`stay`; `hub-canvas.ts` `HUB_IN`/`HUB_OUT` extended with grow/shrink and the four corners in `HUB_DIRECTIONS`. CSS keyframes are generated from the closed keys into custom properties (`--o0 --x0 --y0 --s0 --b0`) composed in ONE animation (the prototype's `mIn` is the shape); reduced motion → still. Guards: NEW `motion-keys-are-a-closed-set.test.ts`; `the-motion-reaches-the-guest.test.ts` extended.
**PR-9 · Content taps.** Photo tap → Replace · Focus · Remove through `scene-background-row.tsx`'s controls; Love Story heading and the countdown label join `SCENE_TYPE_FIELDS`; old `/website/*` editor pages redirect (calm audit PR-F). Guards: `the-print-only-words-are-tappable.test.ts` style, extended.

Spec impact per PR: DECISION_LOG row "EVENT DETAILS — SETUP BY STAGE · ONE RECORD · THEME → SCENE → ELEMENT" citing this file; `WEDDING_ONBOARDING_HUB_SETUP_EVENT_DETAILS_BUILD_SPEC_2026-10-01.md` § C amended (rows edit); `INTERACTION_RULES.md` § 8 cites the three phone rules.

---

## 8 · Owner questions (at most 5 — recommendation first)

1. **Event Details rows edit in place.** *Recommend yes* — facts and set-up rows open the same field the Maker opens (drafted, Apply publishes); only Budget · Suppliers · Services · Purchases stay read-only with their quiet link. This supersedes the 2026-10-01 "information only" line for those rows, as your 2026-10-02 "changeable there" row already implies. Alternative: keep the sheet read-only and send every edit to the Maker.
2. **Buttons ▾ (NEW) — scope.** *Recommend* whole-Event-Hub only at first (shape · fill · colour, default Theme's), with a per-scene override later. Alternative: build both now.
3. **Between scenes ▾ (NEW, bulk set).** *Recommend yes* — it writes the shipped per-scene field on every scene, so there is still one field; a scene may differ afterwards. Alternative: leave transitions per scene only.
4. **A scene of their own has zero styles.** *Recommend* one small real style set (e.g. Plain · Card · Full photo) for `custom_1…6` — the only scene with none; never pad other scenes toward five. Alternative: leave own scenes unstyled.
5. **Blur in.** *Recommend include* — it is one CSS filter in the same composed keyframe, free. Alternative: drop it to keep the In list at four.

---

## 9 · What was checked (re-measure before acting)

```bash
cd ~/Documents/Claude/Projects/setnayan-platform && git fetch -q origin
git worktree add --detach /tmp/wt-details origin/main && cd /tmp/wt-details/apps/web
grep -n "export const EVENT_DETAILS_SECTIONS" -A 15 lib/event-details-sheet.ts        # the shipped record's sections
grep -n "export const DETAILS_ITEM_GROUPS" -A 10 lib/maker-details-items.ts            # the Maker's Details page today
grep -n "export const HUB_SETUP_STEPS" -A 60 lib/hub-setup-steps.ts                    # the setup steps = Details items
grep -n "Round 1\|Round 2\|Round 3" lib/details-guided-flow.ts                          # rounds already per stage
grep -n "export const STAGE_SCENES" -A 16 lib/stage-scenes.ts                           # which scenes each stage draws
grep -n "GUESTS_GET_IN_CHOICES" -A 20 lib/who-can-reply.ts                              # the five choices (RSVP on/off inside)
grep -n "LOOK_SECTIONS" lib/maker-look-sections.ts                                      # Look = theme · background · font · colours
grep -n "HUB_TRANSITIONS\|HUB_AUTO_SPEEDS" lib/hub-scenes.ts                            # Scroll · Scrub · Auto-scroll
grep -n "HUB_BACKGROUND_KINDS\|HUB_SCENE_SHAPES\|HUB_MOTION_PRESETS\|HUB_IN \|HUB_OUT \|HUB_DURING " lib/hub-canvas.ts
grep -n "HUB_EL_IN\|HUB_EL_OUT\|HUB_EL_DURING" lib/element-style.ts                      # element motion today
grep -n "accent:\|accentInk:\|radius:\|ornament:" lib/invite-themes.ts                  # buttons are theme-only today
grep -n "HUB_TYPE_PARTS\|SCENE_TYPE_FIELDS" lib/hub-part-words.ts                        # which texts are typed in place
grep -n "type: '" lib/scene-styles-stages.ts                                            # three real styles per scene
grep -n "MAKER_DETAILS_LABEL" "app/dashboard/[eventId]/launch/_components/maker-bar.ts"  # "Your info" retired
```
