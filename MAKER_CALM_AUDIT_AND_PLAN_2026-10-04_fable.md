# The Maker edits the Event Hub itself — calm audit + plan (2026-10-04, Fable)

**Owner's ask (2026-10-04, verbatim):** *"You created a calmer Event Hub. but what I wan is a proper integration betweend Event Hub and Event Hub Maker. and how the Maker also calmly edits the Event Hub itself. Same concept. same task."*

**"Calm" = the concept approved for the guest Event Hub in #6308** (DECISION_LOG 2026-10-03 "#6308 EVENT HUB CALM — BOTH DESIGN DIFFERENCES APPROVED"): ONE main action per page · ONE place per control · nothing drawn twice across pages. Applied to the Maker it reads: **the page the host edits IS the guest's page (same stages, same pages, same parts, same order, same names), and every part of the Hub has exactly ONE place in the Maker where it is changed — on that part.**

Prototype: `prototypes/maker_calm_before_after_2026-10-04_fable.html` (+ `.png`, per-stage `-2.png` …). Script-free; light and dark.

Measured on `origin/main` at `777cf8f070` (worktree `wt-read-makercalm`, 2026-10-04) and on `origin/rd/event-hub-calm` (#6308, OPEN, not merged) for the guest side. Every anchor below is a greppable symbol or a command — never a line number.

---

## 0 · Where today's direction already got to (so nothing is rebuilt)

What ships and is RIGHT — keep, do not redraw:

- **The canvas is the real page.** The Maker's stage canvas is an iframe of `/<slug>?editor=1` with `EditorBridge` (`app/[slug]/_components/editor-bridge.tsx`: *"Mounts ONLY in the Maker's canvas"*). The scenes column is read off the canvas (`drawnMakerOrder`, `data-maker-section`), the tabs are the guest bar as drawn (`data-maker-bar`, `lib/maker-navigator-tabs.ts`). ✅
- **The toolbar is the Maker in 4** (`maker-bar.ts` `MAKER_TOOLBAR = exit · page · look · details · undo · view · apply · more`; phone bars = approved frame G, `lib/maker-phone-room.ts` `MAKER_BAR_PHONE`; #6297). ✅
- **Page ▾ is the guest bar's own words** (`lib/maker-guest-pages.ts` reads `resolveSiteNav` + `STAGE_BAR`; *"Nothing here names a page"*). ✅
- **Look is one panel: Theme · Background · Font · Colours** (`lib/maker-look-sections.ts` `LOOK_SECTIONS`). ✅
- **Tap to type, part 1 and 2** (`type-in-place-canvas.ts`, `type-in-place.tsx`: Wording ▾ · Format ▾ · Style ▾ · Hide; names → draft, "wait for apply"). ✅
- **The RSVP stage draws the REAL reply, thank-you and decline pages** (`lib/rsvp-stage.ts` `rsvpStageCanvasSrc` → `/invite/reply?editor=1`, `/invite/enter?editor=1&as=attending|declined`). ✅
- **Every Maker editor on a phone is one bottom sheet over a dimmed page** (`maker-sheet.tsx` `SheetScrim` · `SheetGrip`; room rule `MAKER_PREVIEW_MIN_SHARE = 0.55`). ✅
- **Nothing writes on open; Apply publishes** — held by `every-maker-form-drafts-or-says-so.test.ts`, `opening-the-maker-counts-zero-waiting.test.ts`. ✅ (one exception, F7.)

What the approved re-plan said and the code has NOT done yet (`MAKER_REPLAN_PLAN_2026-09-30.md` § A, owner-approved 2026-09-30 "approved, use your recommendations"): **"Details (slim) … Removed from Details: Words, Hero, Reveal, RSVP, Prints."** Today `lib/maker-details-items.ts` `DETAILS_ITEM_GROUPS` still lists **Look (theme · mood-board · logo · hero · reveal) · Your event · Words · Story & plans (love-story · schedule · rsvp) · Your Event Hub · Invitation set · For the day · Download**. That gap is the root of most findings below.

---

## 1 · THE MAP — every guest part (after #6308) → where the Maker edits it today

Legend: **places** = how many different doors in the Maker reach a control for this part · **canvas?** = does the host edit it ON the real page (R), on a second copy of the page (R2), on a still picture/panel (P), or not at all (—).

### Save the Date — guest bar Home · Story · Me (`STAGE_BAR.save_the_date`)

| Guest part | Maker today (door → control) | places | canvas? |
|---|---|---|---|
| The film (or the photo gallery when no film) | tile `f:film` "Save-the-Date film" → the `save-the-date` chapters row (media panel); film-or-photos pick `config_json.std_lead` on the `our_photos` row | 1–2 | R |
| Names & date (hero) | tap → type bar (Wording ▾ name style · Format ▾ date); **and** Event Details › Your event › Names; **and** Event Details › Your event › Date; **and** Look › Hero (Designs 1–4 · parts · photo) | **4** | R + P |
| Countdown · Love Story teaser | tap → scene inspector (Format · Animate · Arrange · Content) | 1 | R |
| Film closing beat "See our page · Add to calendar" | — | 0 | — |

### RSVP — a Maker stage (`RSVP_STAGE_KEY`), not a guest tab

| Guest part | Maker today | places | canvas? |
|---|---|---|---|
| The reply form `/invite/reply` (questions · Yes/No wording · who can reply · reply by · requests) | Page ▾ › RSVP › **Reply** → `MakerRsvpStage` (3 scenes, real pages) with `MakerRsvpSettings`; **and** Event Details › Story & plans › **RSVP** → the SAME settings beside a **4th iframe** of the form (`launch/page.tsx` `makerPageCanvasSrc(rsvpHome, 'rsvp-page', 'rsvp')`, `rsvpRepliedSrc`) | **2** (2 canvases) | R + R2 |
| Thank-you `/invite/enter` after Yes (✓ You replied · ticket · Save my ticket · How to use it · Open the invitation · Change my reply · shortcut line) | RSVP stage scene "After they submit": Heading · Message only | 1 | R |
| Decline page | RSVP stage scene "When they decline": Heading · Message | 1 | R |

### Invitation — guest bar Welcome · Details · Our Love Story · Me (`STAGE_BAR.rsvp`)

| Guest part | Maker today | places | canvas? |
|---|---|---|---|
| **Welcome** · the mark, names, date (hero) | as Save the Date (4 doors) | 4 | R + P |
| Welcome · RSVP / **You're going** (the one door, #6308) | fixed tile `rsvp` ("Each guest replies from their own link") — no control; the canvas shows the host's anonymous view, so the replied state is never seen; "See it as…" offers roles, not reply states | 0 | — |
| Welcome · the guest's look (`f:look`) | fixed tile "Guest's look" → Style only; the content is the Mood Board (Look › Mood Board, the whole studio, `ITEM_LAYOUT 'mood-board': 'fill'`) | 2 | P |
| Welcome · Reminders (`what_to_bring`) | tap → Content box (`CONTENT_ROW_FOR_TYPE.what_to_bring = 'what-to-bring'`) | 1 | R |
| Welcome · E-Gifts door | Event Details › Your event › "Accept gifts?" (`gifts_on`); fixed tile `gifts` has no control; the gift methods are the E-Gifts page's | 1 | P |
| Welcome · Everything else ▾ (3D room · keepsake reel) · Share · Report | — (platform) | 0 | — |
| **Details** · countdown · event details · schedule · venue · dress code · what to bring · entourage | tap → scene inspector; **Schedule** tap opens the `details` Content row while Event Details › Story & plans › Schedule is the full editor (moments + Announce) — two editors, one scene | 2 | R + P |
| Details · Special message | tap → `SpecialMessageField` in the inspector; **and** Event Details › Words › Special message; **and** the Finer Details print switch's field (`data-same-field`) — one component, THREE doors | 3 | R + P |
| Details · venue cards | Event Details › Your event › Venues (**writes LIVE** — `HubSavesImmediately`, `details-your-event.tsx`); canvas Style ▾ (Photo card · Full photo · The journey) | 2 | R + P |
| Details · entourage (parents & hosts · the march) | Event Details › Your event › Parents & hosts · March (`details-people.tsx`, `details-march.tsx`); fixed tile `entourage` no control | 1 | P |
| **Our Love Story** | Event Details › Story & plans › Love Story (scrapbook, `love-story-live.tsx`); tap on the story → the same editor (`factEditors`) | 2 doors | R + P |
| **Me** (ticket · Save my ticket · Copy link · Your guests · Face tagging · Save to my account · Change your reply · Sign out) | **never drawn** — Page ▾ › Me says *"It can't be shown on this canvas yet"* (`lib/maker-guest-pages.ts` `ME_NOT_ON_CANVAS`). Its two couple-set parts are edited elsewhere: ticket look → ⋯ › Prints › Digital ticket (pass card style); Face tagging → Event Details › Your event › "Photos from your guests?" (`papic_on`) | 2, blind | — |

### The Day — guest bar Live · Welcome · Camera · Gallery · Me (`STAGE_BAR.event`)

| Guest part | Maker today | places | canvas? |
|---|---|---|---|
| Live · announcements · directions · live stream & wall · schedule · song request · camera cues | fixed tiles `announcements` · `live_hub` (Style only) · scenes `schedule` · `venue_map` · `photo_moments` (Content row `photo-moments`); song request = RSVP › Requests | 1 each | R |
| Welcome (on the day) · your seat · look · reminders · gifts | `find_your_seat` fixed (Style); the rest as the Invitation's | 1 | R |
| Camera | leaves the page (`leaves: true`) — nothing to arrange | 0 | — |
| Gallery (photos of you) | fixed tile `photos_of_you` "Each guest's own photos" → Style | 1 | R |
| Me | as above — never drawn | — | — |

### Post Event — guest bar Recap · Film · Suppliers · Gallery · Me (`STAGE_BAR.editorial`)

| Guest part | Maker today | places | canvas? |
|---|---|---|---|
| Recap · the story scene by scene (`p:` scenes) | tap → Style ▾ · Shown · Order · Filled from; parts tapped in place (`post-event-scene-panel.tsx`) ✅ | 1 | R |
| Recap · love story · photos · special message · your photos | as the Invitation's | 1–3 | R + P |
| Footer "The Day (Live) · Watch the Film · Print the keepsake" | — | 0 | — |
| Film · Suppliers · Gallery | leave the page | 0 | — |

### The host's own view of the Hub (`owner-ribbon.tsx`, #6308)

"**Edit this site**" (`lib/owner-ribbon.ts` `editorLabel`) + **Preview ▾** (one PickMenu, #6308). The word "site" breaks the Event Hub rule; the ribbon's Preview ▾ (stages) and the Maker's ⋯ › "See it as…" (roles) are two preview menus for one idea.

### The Maker's own chrome today

- Toolbar (desktop): Exit · Page ▾ · Look · Event Details · Undo · Phone · Apply (n) · ⋯. Phone: top ‹ Exit · *stage* · ↶ · ⋯; bottom Page ▾ · Look · Event Details · Apply (n).
- **⋯ rows** (`maker-shell.tsx`, `grep -n "<MenuItem" …`): Phone/Desktop (phone only) · Add a scene · Play this scene · Scenes (desktop) · Phone and desktop · See it as… (host · each role) · Prints · Restore · Reset this stage… · **Your Event Hub address** · **Who can view** · About the Maker.
- **Look / Event Details / Prints are not sheets over the canvas — they open the Details PAGE** (`maker-details.tsx`, `details-workspace.tsx`: "navigator LEFT · body · editor RIGHT"; on a phone "the body on top, the navigator a sideways strip under it, and the editor a sheet"). Theme · Hero · Reveal · Mood Board · RSVP · Seating are `'fill'` (`ITEM_LAYOUT`): for Theme/Hero the body is a **second iframe of the page** (`details-look-pages.tsx`: `` `${look.publicLandingUrl}?phase=${maker.stage}&editor=1` ``, `iframe[data-maker-page-frame]`). Everything `'flow'` is a still picture + a form.
- Five sheet shapes on a phone: the scene inspector (tabs Format · Animate · Arrange · Content), the element sheet (font · colour · size · animation), the type bar, the Details editor ("Edit · *item* ▴"), the guide chip → guide sheet. One at a time (room rule) — but five different shapes to learn.

---

## 2 · FINDINGS — where the Maker breaks "calm" (today → proposed)

**F1 · Two canvases, three places to look.** Today Look and Event Details open a PAGE that covers the canvas, and Look's Theme/Hero body is a second iframe of the same page. The host sees "the page", then "the page again, smaller, under a list", then a still picture. → **Proposed:** ONE canvas, always. Look, Event Details and Prints open as the one bottom sheet (phone) / right column (desktop) over that same canvas. The Details page's left navigator retires; `ITEM_LAYOUT` 'fill' retires with it (the fill WAS the page). Guard: exactly one `iframe[data-maker-page-frame]` in a rendered Maker.

**F2 · The same control in two (or four) places.** Names (canvas · Event Details › Names · Look › Hero), date (canvas Format ▾ · Event Details › Date), the RSVP form (RSVP stage · Event Details › RSVP, with its own 4th iframe), the special message (canvas · Words · Finer Details), the schedule (canvas → "Event details" box · Event Details › Schedule), the address (Event Details › Your Event Hub › Address · ⋯ › Your Event Hub address · ⋯ › Who can view), the hero photo (Look › Hero · the still-live `/website/hero-photo` page with its own "Save photo" — FIRST_TIMER fix 22, open), show/hide (Arrange › Show · the scenes column's eye · the still-live `/website/widgets` page). → **Proposed:** **the part on the page is the one place.** Event Details in the Maker lists ONLY what the page cannot draw (F3). The RSVP form has one door (Page ▾ › RSVP). Address · Who can view leave ⋯ (they are Event Details rows). `/website/hero-photo`, `/website/widgets`, `/website/our-story`, `/website/dress-code`, `/website/photo-moments`, `/website/our-photos` redirect to the Maker's part (as `/website/special-message` and `/website/what-to-bring` already redirect — `grep -n "redirect(" app/dashboard/\[eventId\]/website/*/page.tsx`).

**F3 · Event Details inside the Maker is a second editor of the page.** The approved re-plan said *"Details slims … Removed: Words, Hero, Reveal, RSVP, Prints"*; today `DETAILS_ITEM_GROUPS` still carries all of them. → **Proposed `DETAILS_ITEM_GROUPS`** (the Maker's Event Details sheet): **Address · QR · Who can view · Photos from your guests · Accept gifts · Plan it myself · Seat plan · What's left (the guide).** Gone from it: Theme/Mood Board/Logo/Hero/Reveal (Look's), Names/Date/Venues/Parents/March (tap the hero · the venue card · the entourage on the page), Words (tap the message on the page; Thank-you = the E-Gifts page's part; Opening line + Kindly reply are print lines → Prints), Love Story/Schedule/RSVP (tap the story · a moment · Page ▾ › RSVP), Invitation set/For the day/Download (Prints, where ⋯ already puts them). The editors themselves are KEPT — they become the part's sheet (`factEditors` already hands the same nodes to a tapped part).

**F4 · Five sheet shapes; a tab row inside a sheet.** The scene inspector's Format · Animate · Arrange · Content tabs are a row of four choices (owner rule: 3+ choices = one dropdown, never a pill row); the element sheet, the Details editor and the guide each have another shape. → **Proposed:** ONE sheet shape on the phone — title = the part's Hub name; rows in this order: *the words* (typed on the page, the sheet only says so) · **Style ▾** (the real designs) · **Background ▾** (scene) · **Motion ▾** (Auto · Still · Calm · Editorial · Cinematic; "Into the next scene" folded under it) · **Shown** (switch) · **Move** ▲ ▼ · **Remove…** (a scene of their own). Desktop may keep Keynote's four tabs in the right column (approved 2026-09-27); the phone never shows a tab row.

**F5 · The Maker and the Hub do not speak the same words.** Measured: Maker tile `f:story` "Our story" · scene label "Our love story" (`WIDGET_CATALOG`) · Details item "Love Story" · guest tab **"Our Love Story"**; `f:hero` "Names & date" vs the guest's mark; `f:pass` "Guest's ticket" vs the guest's **Digital ticket** on **Me**; `f:greeting` "Personal greeting" vs **Welcome**; `f:editorial` "The story after the day" vs **Recap**; `photo_moments` "Camera cues" vs **Camera**; `your_photos` "Each guest's own photos" vs **Gallery**; `event_details` "Event details" vs the **Details** tab; Page ▾ "Reply" vs the guest's **RSVP** button; the host ribbon's "Edit this **site**". And one name for two things: the Maker's door "Event Details" opens the Maker's own Details PAGE, while Event Home's "Event Details" is `/dashboard/[eventId]/details`. → **Proposed:** one table `lib/hub-part-names.ts` — for every tile/part key, the word the GUEST's page prints for it; `MAKER_FIXED_LABEL`, `WIDGET_CATALOG.label` (Maker-facing), Page ▾ and the sheets read it. The ribbon says **"Edit your Event Hub"**. The Maker's Event Details door opens the SAME record Event Home opens (F3 makes that true).

**F6 · Hub parts the Maker cannot reach or see.** Me is never drawn (`ME_NOT_ON_CANVAS`), so the host designs a Digital ticket they see only in Prints and sets Face tagging in a switch two pages away; the Welcome's replied state ("You're going", #6308's one door) is never seen; the thank-you's "How to use it" lines have no control. → **Proposed:** Page ▾ › **Me** draws the page as a **sample guest** (the shipped `lib/simulated-guest-preview.ts`, `?as=replied`, no real guest read or written); the Digital ticket's Style ▾ and the Face-tagging switch are reached by tapping them there; everything else on Me is shown and not editable (the sheet says "This is each guest's own"). "See it as…" gains **"a guest who replied"** (the same sample) beside the roles. The thank-you's three fixed lines stay Setnayan's (no control; the sheet says so).

**F7 · One Maker editor writes live.** Event Details › Venues saves to `std_film_*` at once and says *"Saved"* (`HubSavesImmediately`), while every other Maker edit waits for Apply (owner 2026-10-01 *"will only take effect when pressed apply"*). → **Proposed:** the venue card on the page is a Maker part: its **Style ▾** and **Photo** go through the hub draft; the venue itself follows the booked venue (DECISION_LOG 2026-10-01 "THE EVENT HUB FOLLOWS THE LOCKED VENUES"); "Enter your own" (a booking fact) lives on Event Details / Your Team, outside the Maker, and the Maker's venue sheet shows it read-only with the booked name.

**F8 · What #6308 changed on the guest side that the Maker does not reflect.** (a) Me's "Change your reply" is day-gated and Me is never drawn — F6. (b) Welcome's single "You're going" / "RSVP" — never seen as a guest sees it — F6. (c) The thank-you lost Your guests · Copy my link · Save to my account — the canvas IS the page, so the RSVP stage already shows the new thank-you ✅; its panel still edits Heading · Message only ✅. (d) The ribbon's Preview ▾ became one dropdown ✅ but says "Edit this site" — F5. (e) Everything else ▾ shrank to two rows and the Post Event footer to three — no Maker tiles existed for them ✅ (nothing to remove). (f) `guest-account-card.tsx` deleted — the Maker never drew it ✅.

**F9 · Maker controls for things the Hub does not show.** Words › Opening line · Kindly reply are print-only lines listed beside Hub words (`wordsAndPlansItem` `usedOn` = the printed invitation / Finer Details); `tier_comparison` "Two ways to celebrate" is on no stage (`STAGE_SCENES`) yet stays in `WIDGET_TYPES`/`WIDGET_CATALOG` and the `/website/widgets` list; Look › **Reveal** as a Details item (the Reveal is the stage's opening — a Look, not a fact). → **Proposed:** Opening line + Kindly reply → Prints; `tier_comparison` leaves the catalogue the Maker lists (keep the DB CHECK, hide the row); Reveal → **Look › Opening ▾** (veil · seal · none …, per stage), the fifth row of the one Look sheet.

**F10 · ⋯ carries settings that have a home.** "Your Event Hub address" and "Who can view" open the old ⋯ settings sheet (`moreOpen`) while Event Details › Your Event Hub has Address · QR. → **Proposed ⋯:** Phone/Desktop (phone) · Add a scene · Play this scene · Phone and desktop (≥1024) · See it as… · Prints · Restore · Reset this stage… · About the Maker. Address · Who can view are Event Details rows only.

---

## 3 · THE PROPOSED MAKER, in one paragraph

Exit · Page ▾ · Look · Event Details · Undo · Phone · Apply (n) · ⋯ — unchanged. **Page ▾** lists Save the Date · RSVP · Invitation · The Day · Post Event, each with its guest pages in the guest's words, **Me included** (drawn for a sample guest). **The page is the editor:** tap words → type there (Wording ▾ · Format ▾ · Style ▾ · Hide); tap a part or scene → ONE sheet (its Hub name; Style ▾ · Background ▾ · Motion ▾ · Shown · Move · Remove…), the editors the Details items had (names, date, venues, parents, march, schedule, love story, RSVP settings) living INSIDE those sheets on the part they are about. **Look** = one sheet: Theme ▾ · Background ▾ · Font ▾ · Colours · Opening ▾ · Logo › · Mood Board › (the two studios open in place, as today). **Event Details** = one short sheet of what the page cannot draw: Address · QR · Who can view · Photos from your guests · Accept gifts · Plan it myself · Seat plan › · What's left. **Prints** stays in ⋯. One canvas, one sheet shape, the Hub's words, nothing twice.

---

## 4 · BUILD PLAN — PRs an Opus builder can do (order = dependency; D can run beside A)

Every PR: branch `rd/maker-calm-<letter>`, Opus, `INTERACTION_RULES.md` linked, phone check card at 375/390 on a TEST event, "REACHABLE, NOT JUST BUILT" trace in the body, run guards from `apps/web`.

**PR-A · One canvas.** Look · Event Details · Prints open as the one sheet (`maker-sheet.tsx` `SheetScrim`/`SheetGrip`; desktop right column) over the stage canvas; the Details page's left navigator and the `'fill'` bodies retire (`lib/maker-details-items.ts` `ITEM_LAYOUT`, `details-workspace.tsx`, `details-look-pages.tsx` — delete the second `iframe[data-maker-page-frame]`; Theme/Hero changes preview on the one canvas through the bridge's `sceneBg`/`elStyle`, which already exist). The Logo studio and the Mood Board keep `'whole'` (they are tools) but open from the Look sheet in place. Files: `maker-shell.tsx`, `maker-details.tsx`, `details-workspace.tsx`, `details-look-pages.tsx`, `lib/maker-details-items.ts`, `website/editor/_components/editor-shell.tsx` (the `pageJump` answer). Guards: NEW `the-maker-has-one-canvas.test.ts` (render the Maker at 375 and 1280: exactly one `data-maker-page-frame`); keep `the-look-is-one-panel.test.ts`, `the-maker-keeps-the-page-on-a-phone.test.ts`, `browsing-themes-never-moves-the-canvas.test.ts`, `view-as-reaches-the-render.test.ts` green.

**PR-B · Event Details slims; the editors move onto their parts.** `DETAILS_ITEM_GROUPS` → `hub` (Address · QR · Who can view) · `answers` (Photos from your guests · Accept gifts · Plan it myself) · `tools` (Seat plan) · `guide` (What's left). The removed items' editors are mounted by the part's sheet through `factEditors` (hero → Names · Date · Design; venue card → venue; entourage → Parents & hosts · March; special message → its field; schedule moment → `schedulePieces`; story → `LiveStoryPanel`). RSVP: only Page ▾ › RSVP; delete `rsvpSrc`/`rsvpRepliedSrc` from `launch/page.tsx`. Words › Opening line · Kindly reply → the Prints group. `movedPageItem`/`detailsItemFor` keep old addresses landing on the new place (never a dead door). Files: `lib/maker-details-items.ts`, `maker-details.tsx`, `details-your-event*.tsx`, `details-people.tsx`, `details-march.tsx`, `special-message-field.tsx`, `launch/page.tsx` (`detailsFactEditors`), `editor-shell.tsx` (`CONTENT_ROW_FOR_TYPE` → the part sheet). Guards: NEW `lib/hub-part-places.ts` — a table: every guest part key (the `MakerFixedKey`s, every `WidgetType` on a stage, the RSVP scenes, Me's two parts) → exactly ONE Maker door — with `every-hub-part-has-one-maker-place.test.ts` asserting the table against the rendered sheets, and `details-lists-only-what-the-page-cannot-draw.test.ts` (no `DetailsItemKey` names a part that `hub-part-places` puts on the page). Keep `details-pieces-are-lazy.test.ts`, `the-address-is-editable-here.test.ts` (the address stays editable in Event Details).

**PR-C · One sheet shape on the phone.** `scene-inspector.tsx`: under `lg` the four tabs become the rows of § 3 (Style ▾ · Background ▾ · Motion ▾ · Shown · Move · Remove…); `element-sheet.tsx` keeps its four rows (it is already that shape); the Details editors (PR-B) wear the same header. Files: `scene-inspector.tsx`, `part-inspector.tsx`, `element-sheet.tsx`, `details-workspace.tsx`. Guards: NEW `a-phone-sheet-has-no-tab-row.test.ts` (render each sheet at 375: no `role="tablist"`, no row of ≥3 sibling buttons that pick one of a set — it must be a `PickMenu`); keep `pick-menu-stays-inline.test.ts`, `the-maker-toolbars-lose-nothing.test.ts`.

**PR-D · The Hub's words in the Maker.** NEW `lib/hub-part-names.ts` (key → the guest page's own word; derived from `resolveSiteNav` labels and the page's headings — never typed twice); `MAKER_FIXED_LABEL`, the Maker-facing `WIDGET_CATALOG` labels, `makerPageMenu`, the sheets read it. `lib/owner-ribbon.ts` `editorLabel` → "Edit your Event Hub". `MAKER_RSVP_PAGE_LABEL` → "RSVP" (the guest's word). Files: `lib/maker-scene-list.ts`, `lib/invitation-widgets.ts`, `maker-bar.ts`, `lib/owner-ribbon.ts`. Guards: NEW `the-maker-speaks-the-hubs-words.test.ts` (every tile label === `hubPartName(key)`; the Maker's strings contain none of: site, website, vendor, lock/locked (the Pro and setup senses excepted by the existing allowlists), and "On the Day"); keep `lib/the-features-page-must-say-what-ships` style word guards green.

**PR-E · Me on the canvas.** Page ▾ › Me loads the canvas as the shipped sample guest (`lib/simulated-guest-preview.ts`, `?as=replied&editor=1`); `ME_NOT_ON_CANVAS` deleted; the Digital ticket's pass-card Style ▾ (`pass-card-design-picker.tsx`, drafted — DECISION_LOG 2026-10-02 Q7) and the Face-tagging switch (`papic` answer) open from their parts; the other Me controls render inert in the canvas with the sheet line "This is each guest's own". "See it as…" adds "A guest who replied". Files: `lib/maker-guest-pages.ts`, `editor-shell.tsx`, `app/[slug]/page.tsx` (the `meSlot` for the sample in the canvas only), `maker-shell.tsx`. Guards: NEW `me-is-on-the-canvas.test.ts`; keep `simulated-guest-preview.test.ts`, `one-invitation-one-account.test.ts`, `each-guest-page-has-one-main-action.test.ts` (#6308).

**PR-F · Nothing in the Maker writes live; old pages redirect.** Venue Style/Photo through `hubDraftAction`; the venue name read-only from the booking (`lib/event-venues.ts`), "Enter your own" on Event Details (`details/page.tsx`). `/website/hero-photo`, `/website/widgets`, `/website/our-story`, `/website/dress-code`, `/website/photo-moments`, `/website/our-photos`, `/website/colors`, `/website/living-hero` → `redirect()` to the Maker's part (`detailsItemHref` / `?scene=`). Guards: tighten `every-maker-form-drafts-or-says-so.test.ts` (no `HubSavesImmediately` inside `launch/`); NEW `old-editor-pages-redirect-to-the-maker.test.ts`; `lib/finished-pages-need-doorways.test.ts` stays green.

**PR-G · ⋯ slims.** Remove "Your Event Hub address" and "Who can view" rows and the old ⋯ settings sheet (`moreOpen`, `MAKER_MORE_ROWS_ID`); `tier_comparison` hidden from every Maker list. Guards: `the-toolbar-is-the-maker-in-four.test.ts` extended with the ⋯ row list.

Spec impact (apply with each PR): DECISION_LOG row "THE MAKER EDITS THE EVENT HUB ITSELF — ONE CANVAS · ONE PLACE PER PART · THE HUB'S WORDS" citing this file; `MAKER_REPLAN_PLAN_2026-09-30.md` § A marked "built by rd/maker-calm-B"; `INTERACTION_RULES.md` § 3 adds "the Maker: the page · Page ▾ (Me included) · Look · Event Details — Event Details holds only what the page cannot draw".

---

## 5 · OWNER QUESTIONS (at most 5 — recommendation first)

1. **Event Details inside the Maker.** *Recommend:* slim it to what the page cannot draw (Address · QR · Who can view · Photos from your guests · Accept gifts · Plan it myself · Seat plan · What's left); every fact that is on the page is edited by tapping it there. Alternative: keep Event Details as a full index where tapping a fact opens the same sheet the part opens (two doors, one control). The re-plan you approved on 2026-09-30 already said "Details slims".
2. **The Reveal (veil · seal).** *Recommend:* it becomes **Look › Opening ▾**, the fifth row of the one Look sheet, per stage — not a Details item. Alternative: leave it where it is as a Look item.
3. **Venues in the Maker.** *Recommend:* the Hub follows the booked venue (your 2026-10-01 ruling); the Maker edits only the venue card's Style ▾ and Photo (drafted, Apply); "Enter your own" is an Event Details / Your Team fact outside the Maker. Alternative: keep typing venues in the Maker, drafted.
4. **The phone sheet.** *Recommend:* fold Format · Animate · Arrange · Content into one scrolling sheet of rows on the phone (desktop keeps the four tabs). Alternative: keep the tabs on the phone too.
5. **Me on the canvas.** *Recommend:* draw Me for a **sample guest** (shipped simulated preview, no real guest read or written), so the host sees the Digital ticket and Face tagging where guests do. Alternative: keep Me off the canvas and edit the ticket under Prints.

---

## 6 · What was checked (re-measure before acting)

```bash
cd ~/Documents/Claude/Projects/setnayan-platform && git fetch -q origin
git worktree add --detach /tmp/wt-maker origin/main
cd /tmp/wt-maker/apps/web
grep -n "export const DETAILS_ITEM_GROUPS" -A 10 lib/maker-details-items.ts        # F3: what Details lists
grep -n "data-maker-page-frame" "app/dashboard/[eventId]/launch/_components/details-look-pages.tsx"   # F1: the second iframe
grep -n "makerPageCanvasSrc(rsvpHome" "app/dashboard/[eventId]/launch/page.tsx"    # F2: the RSVP 4th iframe
grep -n "ME_NOT_ON_CANVAS" lib/maker-guest-pages.ts                               # F6
grep -n "MAKER_FIXED_LABEL" -A 18 lib/maker-scene-list.ts                          # F5: the Maker's words
grep -n "editorLabel" lib/owner-ribbon.ts                                          # F5: "Edit this site"
grep -n "HubSavesImmediately" "app/dashboard/[eventId]/launch/_components/details-your-event.tsx"   # F7
grep -n "<MenuItem" "app/dashboard/[eventId]/launch/_components/maker-shell.tsx"  # F10: ⋯ rows
grep -n "redirect(" "app/dashboard/[eventId]/website/"*/page.tsx                    # F2: which old pages still live
git -C ~/Documents/Claude/Projects/setnayan-platform show "origin/rd/event-hub-calm:apps/web/app/[slug]/_components/owner-phase-menu.tsx" | head -30   # #6308 host ribbon
```

Not claimed: where Music is reached in the Maker today (the editor rail row `music` in `website/editor/page.tsx` — a builder should trace it before PR-B moves it into Look).
