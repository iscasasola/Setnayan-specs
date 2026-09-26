# Post Event scenes — build brief (Redesign Controller, 2026-09-26)

**Model · effort:** Opus · high. It touches the Maker's draft/Apply path, a Pro gate at Apply, and the guest
Event Bar resolver — mistakes there are expensive and hard to see. Not Sonnet: this is not a faithful
translation of one prototype, it reconciles a half-built branch with an approved strategy.
Run from `~/Documents/Claude/Projects/setnayan-platform` (never `~`). One builder only.

**Sources that outrank this brief:** `POST_EVENT_SCENES_STRATEGY_2026-09-25.md` (APPROVED, owner answers
1–5) · DECISION_LOG 2026-09-25 rows "POST EVENT IS MANY SMALL SCENES" and "POST EVENT — OWNER ANSWERS TO
FABLE'S FIVE" · prototype `prototypes/post_event_scenes_strategy_2026-09-25.html`.

---

---

## 0. ⚠ UPDATE 2026-09-26 (owner, later the same day) — DESIGN FIRST, THEN BUILD

The owner expanded Post Event into **13 scene types, each with its own ~3 styles; each scene on the page
picks one style independently; every part is tap-to-edit** (DECISION_LOG 2026-09-26 "POST EVENT: 13 SCENE
TYPES"). This changes L2 and adds a step **before** this build:

**Step A — Fable prototype (Fable · high), before any code:** all scene types × their styles at 375 px
(and one desktop), for a real-looking event, using only data the platform compiles. Open it in a browser
tab and send the owner PICTURES (his viewer runs no JavaScript). He picks; then Step B is this brief.

| Scene type | Compiles from | Proposed styles |
|---|---|---|
| Front Page | hero · names · date · venue · edition stamp | magazine cover · full-bleed photo · The Card |
| The Road to the Day | supplier bookings (dated) · finished tasks (dated) · pre-event uploads · Mood Board · *(meetings/tastings: Schedule Journey log — not built yet)* | diary · countdown timeline · scrapbook |
| Statistics | invited/attended · Papic captures · chapters · wishes · suppliers | big numbers · receipt tally · infographic row |
| Schedule | one per event-day block (= Papic chapter) + its photos | timeline · one chapter per screen · clock face |
| Gallery | clean Papic captures by time · couple uploads · photo wall | grid · mosaic · film strip |
| Messages | approved text wishes · letters (`guest_columns`) — NOT the photo-anchored Kwento | note wall · one letter at a time · quote cards |
| Where Everyone Sat | final seat plan + check-ins (3D plan) — guest sees own table; stranger sees NO names | 3D room · floor plan · list by table |
| Vendor Stories | vendors' day-of media · booked team · "would book again" · reviews | photo strip · credits roll · side by side |
| Entourage | guest-list roles | roll call · portrait grid · family tree |
| Specific Memory | couple-written (presets: The Toast, Before & After, Behind the Scenes, What Almost Happened…) | portrait + quote · before/after · three blocks |
| Papic Challenge | challenge questions + guest photo/text answers | Q&A cards · photo answers grid · poll results |
| Thank You | special message / composed until written | letter · words only · photo + words |
| Videos | YouTube links the couple pastes (SDE, prenup, highlights) — no upload; reuse `watchFilmEmbedUrl` / `creator-chapters.ts` parsing | featured film · playlist row · grid |
| Kwento | Papic photo-anchored guest messages (`photo_messages`) — a photo WITH its message; separate from Messages | photo + note card · scrapbook pairs · swipe story |
| Clips | the couple's own uploaded clips — 15 s max (refused, not trimmed), browser-compressed, within 100 MB/event, Pro; separate from Videos | single clip · clip reel · clips beside photos |
| Live Stream | the Live Studio replay (`watchFilmEmbedUrl`) — shown only if the event had Live Studio | full replay · highlights by chapter · watch-the-replay card |
| Auto extras (hide when empty) | Song · Were You There? · Before & After | one style each to start |

**Fonts (owner 2026-09-26):** one universal Event Hub font; tapping an element lets the couple give THAT element its own font, which wins for it only, with a "↺ use the Event Hub font" reset — like Keynote/Pages. Pro. Stored with the element's slot.

**Storage rule for styles:** a style is a per-scene choice stored with that scene (like `canvas.template`
today) — no new table. Keep the "one source of truth for order" rule from §2.

## 1. What the owner decided (verbatim, do not re-ask)

- *"the story on that scene 1 of post event is the whole story, what we want is to cut them into smaller
  scenes to allow content for each part giving them freedom to add new scenes … scene creation will have
  different preset scenes as well. different from save the date, invitation and on the day."*
- Answers to the strategy's five: *"1. yes 2. no more camera since that event is done 3. yes 4. yes 5. yes"* ⇒
  - **E1** Post Event Event Bar = **Recap · Film · Vendors · Gallery · Me/Join** (empty slots hide).
  - **E2** **No guest camera after the day** (the slot goes to Film/Vendors). The couple keeps theirs.
  - **E3** The **12** Post Event presets are **Pro**, word-only ones included.
  - **E4** Reorder / hide Post Event scenes is **free**; fix the "Editorial PRO" copy.
  - **E5** **Six custom scenes, shared across stages**; migrate only if a couple runs out.

## 2. What is DONE on `rd/post-event-scenes` (pushed · 2 commits · **102 behind main** at 08:45Z)

Commit `83a010547a` "Post Event is many small scenes" — 25 files, +2,351/−156:
- ✅ **Always its scenes.** The navigator lists every Post Event scene before the day too; a scene the day
  fills is `waiting` → **Not yet**, with its placeholder line (`POST_EVENT_WAITING`). Single "story after
  the day" tile kept only as the fallback when scenes can't be read.
- ✅ **A panel per scene** — `post-event-scene-panel.tsx`: what fills it · show/hide · earlier/later ·
  title/words/Remove for the couple's own.
- ✅ **One source of truth for order** — the Maker drafts a copy of the story's `sections` /
  `sectionOrder` / `customColumns` (`HubDraft.editorial`, `lib/post-event-draft.ts`); Apply writes those
  three keys into `event_editorial.draft_json`.
- ✅ Tour updated; tests `lib/post-event-draft.test.ts`, `lib/post-event-is-many-small-scenes.test.ts`,
  e2e `tests/e2e/post-event-scenes.spec.ts`.

## 3. ⚠ Where the branch DRIFTED from the approved strategy — fix, don't ship

1. **Wrong preset set.** The branch offers 10 of its own (thank-you note, letter, chapter of the day, line
   to remember, gallery grid, film, wishes wall, were-you-there, what's next, in memory). The approved
   catalogue (strategy §5) is **12 different ones**: P1 Thank You, From Us · P2 The Toast · P3 Best Of ·
   P4 Before & After · P5 Behind the Scenes · P6 What Almost Happened · P7 By Our Count · P8 From Near and
   Far · P9 Our Playlist · P10 The Guestbook · P11 Wish You Were Here · P12 Since Then — each mapped to one
   of the 25 templates with named fields. **Replace the set with the 12.** (Gallery / film / wishes /
   were-you-there are *built-in scenes* of the default set §2.2, not presets.)
2. **Wrong storage for a new scene.** The branch stores a preset as a story `customColumns` entry carrying
   `preset`. The strategy stores it as an ordinary **`custom_N` scene** (`canvas.template` 1–25,
   `canvas.slots`, `canvas.preset`) drawn by `renderScene` — which is what makes **E5 (six shared across
   stages)** true and keeps `sanitizeHubCanvas`'s cap. A column in the story would be a second, uncapped
   home for the same thing. **Follow the strategy.** Keep the branch's draft-of-order work for the
   built-in scenes.
3. **Pro line is too narrow.** Branch: only a *new* scene is Pro. E3: all 12 presets are Pro (tried in the
   draft, held at Apply without Event Hub Pro); show/hide/order stays free (E4).

## 4. What is LEFT

| # | Work | Where to start |
|---|---|---|
| L1 | **Start from fresh `main`, not a merge of the stale branch.** `editor-shell.tsx` changed heavily since (Maker pages #5996, navigator #5999). New branch from `origin/main`; bring over the branch's `lib/post-event-draft.ts`, `post-event-scene-panel.tsx`, the waiting/placeholder work and its tests by hand, re-fitting them to the current shell. | `git diff $(git merge-base origin/main origin/rd/post-event-scenes) origin/rd/post-event-scenes` |
| L2 | Replace the presets with the approved **12** (§3.1), stored as `custom_N` scenes (§3.2); picker per strategy §5 (real mini previews, padlock/diamond, ⓘ purpose, "six slots, N used"). | `lib/post-event-presets.ts`, `lib/hub-canvas.ts`, `scene-template-picker.tsx` |
| L3 | **Event Bar after the day** = Recap · Film · Vendors · Gallery · Me/Join, empty slots hide (E1), via the changes in strategy §6.3; bar items that open an open-up layer use `openUpHash`. | the guest bar resolver (`app/[slug]/_lib/site-nav.ts`, `stage-bar.ts`) |
| L4 | **No guest camera after the day** (E2) — guests/strangers: the Camera slot yields to Film/Vendors on `after`; the couple keeps it. | same resolver; supersedes the 2026-08-03 camera-slot ruling for `after` only |
| L5 | Pro gate at Apply for the 12 presets (E3); reorder/hide free (E4); replace the "Editorial PRO" copy (E4). | `hub-draft-actions.ts` Apply path; `app/[slug]/_components/editorial/editorial-order.ts` copy |
| L6 | First-visit tour mentions the presets + the bar (existing `TOURS` key, no new mechanism). | `lib/tours.ts` |

**Not in this build:** retiring `/story` and the old website editor (43 controls + 8 links must move into
the Maker first — separate build); per-scene Pro template swap rendering.

## 5. Tests to pass (all must be seen to FAIL once — sabotage, restore, print `git status --short`)

1. **Scenes before the day:** every default Post Event scene is listed with `Not yet` + its placeholder;
   none hidden, none empty.
2. **Twelve presets, exactly the approved ids,** each mapped to its template number from strategy §5; none
   of the branch's old ten remains.
3. **A preset is a `custom_N` scene** — adding one increments the shared custom count; a 7th across all
   stages is refused with the "six used" message (E5).
4. **Pro at Apply:** a free couple can place a preset in the draft; Apply holds it and applies the rest;
   a Pro couple's applies. Reorder/hide applies for free.
5. **Event Bar after the day:** Recap · Film · Vendors · Gallery · Me/Join in that order; a slot with no
   content is absent (not disabled).
6. **Camera:** after the day a guest/stranger sees no Camera slot; the couple still does; before the day
   nothing changed.
7. **One source of truth:** no second order store — the order lives in the story's `sectionOrder` only
   (assert no new key written).
8. Existing guards green: `every-maker-form-drafts-or-says-so`, `the-post-event-navigator-lists-its-scenes`,
   port-control (regenerate baseline on the merged tree, diff = your lines only), exposure, no-card, radius,
   and **`pnpm -s lint`** (not bare `npx eslint` — it silently lints nothing here).
9. **Route ceiling:** count `"use server"` exports before/after — **+0 target**; reuse `hubDraftAction`.
   Production is at the 2,048 limit.

## 6. Acceptance — phone first, then the owner's check card

Controller runs it at **375 and 390, touch**, on a test event dated in the past **and** one in the future,
then sends the owner:

> **Post Event scenes**
> **Open:** the Maker → Post Event (test event "after the day")
> **Do:** 1. Tap a scene tile. 2. Tap "+ Add a scene" and pick "By Our Count". 3. Tap ▶ Preview the whole stage.
> **You should see:** each part of the recap as its own scene; 12 Post-Event-only presets with a padlock;
> on the guest preview, the bar reads Recap · Film · Vendors · Gallery · Me/Join and there is no camera.
> **Screenshot:** phone-size, before and after the day.
> **Reply:** "ok" or what looks wrong.

## 7. Ship

Changelog fragment, PR, `gh pr merge <N> --auto --merge`, diff-check `-- apps` before opening. Do not
deploy. Prune the worktree once merged. Stop and report if blocked by a guard or an owner decision.
