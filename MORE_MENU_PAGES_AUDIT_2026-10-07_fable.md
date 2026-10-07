# More-menu pages audit — the five service pages against the rules and the owner's targets
**2026-10-07 · Fable (auditor) · read-only: no app code, no PRs.** Five Sonnet readers read `origin/main` (508cb3fef, detached worktree — never `~`), one per page; the five pages were walked at 375 px on the preview `setnayan-platform-web-git-preview-maker-redraws` signed in as the owner (view only, nothing pressed that writes). Prototypes: `prototypes/more-menu-pages-2026-10-07/` (delta only, 375 px PNGs + the "today" screenshots).

**Owner, verbatim (2026-10-07), on the couple's More menu — Planner · Setnayan AI / Guest photos · Papic / Live stream · Live Watch / Music · Music Maker / Video booth · Patiktok:** *"the pages of each of this menu is not fixed to our rules. minimal, simple, efficient and other rules"* · *"those have so many words. it doesn't feel simple and easy to understand"*.

## 0 · Where the five rows go (Rule 0 — found, not guessed)
The More sheet reads `lib/service-names.ts` (plain name · brand) and `lib/our-services.ts` → `addOnHref()` in `lib/add-ons-catalog.ts`:

| Row | Route on `origin/main` | What it is today |
|---|---|---|
| Planner · Setnayan AI | `/dashboard/[eventId]/studio/setnayan-ai` | a pitch page (`StudioBuyHero` + 4 spotlights) |
| Guest photos · Papic | `/studio/papic` | ONE controller page (2,559 lines) + 9 sub-pages |
| Live stream · Live Watch | `/studio/live-studio-control` | a SALES page (`AppStoreLayout`); the real controller is `/panood/control/[eventId]` (`liveStudioControlPath`) |
| Music · Music Maker | `/studio/pakanta` | a 5-field form + read-only story tile |
| Video booth · Patiktok | `/studio/patiktok` | template gallery; booth at `/patiktok/booth`, render at `/patiktok/[templateId]`, `?queued=` mode |

Re-measure: `git grep -n "addOnHref\|SERVICE_NAMES" origin/main -- apps/web/lib/our-services.ts apps/web/lib/service-names.ts`.

## 1 · The scoreboard (measured at 375 px, signed in, event `947e7bab…` "Maria & Jose")

| Page | Words today | Words in the delta prototype | Boxes today | Screens tall | Pages to finish the job | Rules failed (of 14) |
|---|---|---|---|---|---|---|
| **Live stream · Live Watch** | **≥500** on the sales page alone (page text truncated at 3,000 chars) + the controller page | 58 | ≈9 (+7 `sn-tile` on the controller) | 1 scroll + a second route | 2 routes, 7 stops (buy → hosted-channel sheet → YouTube OAuth → controller → cameras → link → go live) | **11** |
| **Guest photos · Papic** | **749** | 61 | **22** (DOM count; ≈25–33 incl. components) | **7** | 1 + **9 sub-pages** (/crew · /crew/print · /challenges · /run-of-show · /moderation · /recap · /magazine · /life-flash · /guests) | **10** |
| **Video booth · Patiktok** | **503** | 59 | 14 (code; DOM saw 2 `rounded` + article cards) | **13** | 3 routes + `?queued` (5–6 loads to pick → capture → render → share) | **10** |
| **Planner · Setnayan AI** | **227** | 79 | 8 | 4 | 1 (but nothing to control) | **7** |
| **Music · Music Maker** | 111 (owned/in-production state) · ≈190 when buying | 73 | 5 | 2 | 1 + `/details` link-out for the story | **8** |

Word target per page: **≤ 40 % of today** (owner: *"so many words"*). Every prototype lands at 58–79 words INCLUDING the top/bottom nav chrome (≈12 words), i.e. 65–92 % fewer. Numbers are from `document.querySelector('main').innerText` at 375 px on 2026-10-07; re-measure with the same expression, never trust this table.

## 2 · Per-page tables

Legend: ✓ pass · ✗ fail · ◐ partial · – n/a. Evidence cites a greppable symbol, never a line number.

### 2.1 Planner · Setnayan AI — `studio/setnayan-ai/page.tsx` · `_components/setnayan-ai-value.tsx`
**Owner's target:** *"Setnayan Coverage with toggles. Activate. and the complete data of what it covers. erase data."*

| Rule | | Evidence | Fix (one line) |
|---|---|---|---|
| R1 buttons | ✗ | only control is the hero's `InlineCheckoutDrawer` "Unlock Setnayan AI"; "Back to add-ons" is a 28 px `py-1.5 text-xs` pill | one 40 px thumb bar: **Activate** (green) · **Erase data** (red outline) · ⓘ |
| R2 one dropdown | – | no choices | — |
| R3 no link-outs | ✓ | — | the only off-switch is `launch/_components/plan-myself.tsx` "Plan it myself" — bring it here as the switches |
| R4 thumb zone | ✗ | the single CTA sits in the hero (top third); active state ends in prose | thumb bar |
| R5 phone first | ✓ | single column | — |
| R6 no boxes | ✗ | `rounded-xl border bg-mulberry/5` active card, `sn-tile` "Working right now", 4 spotlight image tiles, closing card (8 in DOM) | rows on paper |
| R7 minimal words | ✗ | 227 words; four 40–60-word spotlights + a 30-word closer; h1 is `sr-only` | title + one line; spotlight words move behind each row's ⓘ |
| R8 words | ◐ | no banned words; but `display_name ?? 'your wedding'` and "yours for the whole wedding" are hard-coded for every event type; brand line missing in the active state | use `eventWord`; "Planner / SETNAYAN AI" |
| R9 easy | – | nothing to do but buy | — |
| R10 guests | – | host page | — |
| R11 tour | ✗ | no `setnayan_ai`/planner key in `lib/tours.ts`; no `<MiniTour>` | add `customer_planner_v1` + mount |
| R12 honest failure | ◐ | `loadAiActivity` "fail-softs every query" → a refused read renders as an empty briefing; price `.catch(() => 0)` is at least worded | render the reason + Try again |
| R13 apply publishes | – | (applies once switches exist) | switches preview; **Activate** commits |
| R14 one open | – | — | — |

**Target vs today.** Exists: `events.setnayan_ai_active` + the gate in `lib/setnayan-ai.ts`; SKU `SETNAYAN_AI`; the nine-capability inventory `AiCapabilityId` (rank · deadlines · next_move · payments · budget · demand · price_watch · date_watch · schedule_clash) already feeding `buildAiValueSpotlights`; the data snapshot `loadAiActivity` (`figureRanked` · `figureDeadlines` · `figureNextMove` · `figurePayments`). Missing: per-area switches (nothing stored per capability), one Activate on this page (today buy-only; the owned state shows no button at all), a readable data list, any Erase (only guest-face erasure exists: `eraseGuestFaceData`). **Delta:** nine switch rows over `AiCapabilityId`; one green **Activate** reusing the SKU; a "What it uses" list from `loadAiActivity` inputs (counts animate, Rule 2); red **Erase data** with the one confirm the rules allow (destructive) — map to DPO safeguard 7 of `Setnayan_AI_Data_Use_DPO_Review_2026-06-29.md` (data deletion) and safeguard 3 (opt-out on `users.consent_state`) rather than a new store. ⚠ Owner call: does "Erase data" mean the AI's derived snapshot only, or the per-user behavioural data of the DPO review? The prototype draws the former.

### 2.2 Guest photos · Papic — `studio/papic/page.tsx` + `_components/*`
**Owner's target:** *"Papic full controller."*

| Rule | | Evidence | Fix |
|---|---|---|---|
| R1 | ✗ | "Open moderation ›" (ChevronRight text link); "Pick your challenges →"; on/off are `sn-btn-secondary` "Turn this off" buttons; colour drifts (QR = mulberry, "Continue to payment" = terracotta-700, grey elsewhere) | one `ActionButton` set; switches for on/off; green Add credits |
| R2 | ✗ | `StylePicker` grid of gradient cards; `GuestCameraTierPicker` two radio cards | PickMenu "Look" · PickMenu "Guest cameras" |
| R3 | ✗ | `LimitedCard` "Go to guest list" / "Add more guests"; `guest-allotments-choice` "Add guests there…"; `live-wall-card` "Set up your Papic crew" → /crew | sheets in place |
| R4 | ✗ | window picker, coverage, allotment, look all top/middle; no thumb bar | thumb bar: Add credits · QR codes · Library |
| R5 | ◐ | three side-by-side native date inputs in `PapicWindowPicker` are tight | one date-range row → sheet |
| R6 | ✗ | **22 boxes in the DOM** (`rounded-2xl`/`sn-tile`), ≈25–33 with components | rows in phase order (the design's S1–S7 already say rows) |
| R7 | ✗ | **749 words**, 7 screens; "Apply-then-pay — payment instructions next" is a developer note shown to couples; `papic-pool-card.tsx` "deliberately queued" | title + one status line; every row 1–3 words + ⓘ |
| R8 | ✗ | **9 × "celebration"** in visible strings (page.tsx ×4, live-wall-card, live-wall-controls, guest-allotments-choice ×3) | "event" |
| R9 | ◐ | `GuestAllotmentsChoice` is expert-level (minimums, per-head splits, "a promise broken for all of them") | hide behind one "Customize" row |
| R10 | – | host page | — |
| R11 | ✓ | `customer_papic_v1` in `TourKey`, `<MiniTour tourKey="customer_papic_v1" />` mounted | keep |
| R12 | ✓ | "We couldn't count your guests' cameras just now…", guarded by `the-allotment-row-never-draws-a-failed-read.test.ts` | keep |
| R13 | ◐ | look saves on click ("Look saved — every camera… shoots it"), no preview-then-Apply | preview in the stage, Apply saves |
| R14 | ◐ | sheets are modal (good); `<details>` "Setup & help" is independent | fold joins the one-open rule |

**Target vs today.** The "full controller" **exists as one page** — `SERVICE_CONTROL_CENTERS_DESIGN_2026-08-28.md` slots S1–S7 all shipped (`PapicStage`, "do this first", "Four ways into your library" rows, Coverage/Allotment/Filter/More, `HostPoolMeterCard`/`PapicPoolCard`, offers last); the three-rooms plan is superseded (`StatusBanners` comment: "THIS SECTION IS WHAT REPLACED THE THREE TABS"). What breaks the target is **nine controls still living on sub-pages** and **nine cards the design never asked for** (challenges, live wall, shared gallery, magazine, recap, life flash, moderation, supplier media, Drive). **Delta:** not a new page — the same page with 22 boxes → 11 rows in Before/Day/After order, sub-page controls as sheets, PickMenus for look and tier, a thumb bar, "celebration" → "event", the developer notes deleted. Keep `PapicStage`, the tour, and the honest-read guards.

### 2.3 Live stream · Live Watch — `studio/live-studio-control/page.tsx` + `app/panood/control/[eventId]/page.tsx`
**Owner's target:** *"Live Stream full controller."*

| Rule | | Evidence | Fix |
|---|---|---|---|
| R1 | ✗ | CTA "Open the controller — go live free with one camera →" is a text pill with an arrow; "Disconnect" is `text-xs`; Connect is mulberry (not a tone) | Go live (green) · Cut · Camera (grey); Disconnect red |
| R2 | ◐ | no pill rows on the sales page; the controller's channel/overlay choices are `<details>` | PickMenu where a value is picked |
| R3 | ✗ | the More row lands on a page whose main action is "go elsewhere" (`liveStudioControlPath`); the controller's "Leave the controller — back to Live Watch" | the More row opens the controller once owned; buy = one row/sheet |
| R4 | ✗ | CTA in the hero; Connect/Disconnect mid-page | thumb bar |
| R5 | ◐ | 4-tile stat row + plans table on the sales page; the controller is scroll-free (Unified Spec §4g shipped) | drop the shop window |
| R6 | ✗ | sales page ≈9 boxes (stat tiles, `YoutubeChannelPanel`, `HostedChannelUpsell`, banners); controller 7 `sn-tile` cards | rows |
| R7 | ✗ | **≥500 words** before the fold ends; 3-paragraph "About this feature"; `notIncluded` shows **"Build state: the switching controller and picker are in place…"** — a developer note to couples | title + one line; words behind ⓘ |
| R8 | ✗ | "Live Watch streams your celebration live…", "A celebration happens in more than one place…", controller `'Your celebration'` fallback, "only works for this celebration" (6) | "event" |
| R9 | ✗ | 7 stops with encoder/OAuth/RTMP concepts | one screen, phone-cameras default |
| R10 | – | host side | — |
| R11 | ✗ | no live-studio/panood key in `lib/tours.ts`; no `<MiniTour>` on either page | add `customer_live_watch_v1` |
| R12 | ◐ | `ackError`/`grantRawError` are logged and then rendered as "Not available yet" / a Connect button; `youtube_error` banner shows a mono code | failure line + Try again |
| R13 | ◐ | guest-pick on/off posts immediately ("Guest-pick is on"); overlays save separately | one Apply |
| R14 | ✗ | several uncoordinated `<details>` folds on the controller | one open at a time |

**Target vs today.** The controller **already exists** at `/panood/control/[eventId]` (monitor · transport · channel grid · camera QRs · overlays · moments · guest-pick · YouTube · The Day — Unified Spec §4e/§4g shipped; `ChannelFreshness` keeps it honest, see memory `panood-controller-never-re-renders`). What the More row opens is the **old shop page in front of it**, and the YouTube panel is rendered on both. The 2026-08-28 Live Studio brief (monitor first, camera strip, QRs as the next step, YouTube as a "set once" row + sheet) is NOT shipped. **Delta:** the More row goes to the controller once owned; the sales page collapses to one "More cameras · Add Live Watch" row + sheet; YouTube/hosted channel/strike notice become "Set once" rows (keep all four channel states and the Disconnect guarded by `lib/live-studio-cast-retirement.test.ts`); 7 cards → rows; thumb bar Go live · Cut · Camera; tour.

### 2.4 Music · Music Maker — `studio/pakanta/page.tsx` · `_components/pakanta-music-form.tsx` · `use-song-button.tsx`
**Owner's target:** *"Give me the information and keywords. adapt their love story. plus more details."*

| Rule | | Evidence | Fix |
|---|---|---|---|
| R1 | ✗ | "← Back to services" text link; "Save for later" bare text; "Continue to payment" is `rounded-lg`, not a 40 px pill; mulberry used for both primary and confirm | Save (grey) · Continue (green) in a thumb bar |
| R2 | ◐ | "What kind of music?" is free text where a pick fits; `story_tone`/`story_language` exist on `events` but are not surfaced | PickMenu "Kind of music" · PickMenu "Tone · language" |
| R3 | ✗ | empty state: "Finish the **love-story details** and your song will be written from it" → `/details` | the story is a prefilled, editable field here (writes `events.love_story`, one source of truth) |
| R4 | ✗ | Save/Continue at the bottom of the form, no thumb bar | glass thumb bar |
| R5 | ✓ | stacks at 375 | — |
| R6 | ✗ | 5 boxes: `ServiceParts` tile, story `sn-tile`, alert box, in-production/delivered box, the form card (`rounded-xl border shadow-sm`) | rows |
| R7 | ✗ | "Your song is being composed with Setnayan AI from your story. When it's ready it will appear here — and play on your wedding page automatically." (28 words) + the 30-word empty state | one status line; words behind ⓘ |
| R8 | ✗ | **"Use this song on my site"**, "browse your **wedding page**", "Now playing on your wedding page" | "Event Hub" |
| R9 | ◐ | 5 fields, singer names required; success = `router.refresh`, no toast | prefill from the story; toast |
| R10 | – | — | — |
| R11 | ✗ | no pakanta/music key in `lib/tours.ts`; no `<MiniTour>` | add `customer_music_maker_v1` |
| R12 | ◐ | `draftError` is rendered (good); a refused `events.love_story` read falls to "We don't have your love story yet" | render the reason |
| R13 | ◐ | brief preview is not live; draft saves only on click | live brief line as they type; Save/Continue publish |
| R14 | – | — | — |

**Target vs today.** Exists: information (`pet_names`, `groom/bride_favorite_singer`, `music_type`), the love story — **read-only** — via `composePakantaBrief` from `events.love_story` (JSONB: `how_we_met`, `spark`, `proposal`, `milestones[]`… per `lib/pakanta-brief.ts LoveStoryBlob`) + `events.story_tone` + `story_language`; "more details" (`story_to_add`). Missing: a **keywords** field (none; `music_type` is the nearest); the story is display-only, so "adapt" (include/edit before the song is written) has no control; tone/language never surfaced. Design: `0036_pakanta` (git `573a96c`) had an 8-section intake and no keywords line — the shipped page already made the story the source, which is the right half of the owner's target. **Delta:** "Use our story" switch + the story as an editable prefilled field; a Keywords field; two PickMenus; More details kept; thumb bar; copy to Event Hub. Drafts stay in `pakanta_intake_drafts.responses`.

### 2.5 Video booth · Patiktok — `studio/patiktok/page.tsx` · `booth/page.tsx` · `[templateId]/page.tsx` · `_components/*`
**Owner's target:** *"Full Controller"*

| Rule | | Evidence | Fix |
|---|---|---|---|
| R1 | ✗ | "Open booth dashboard →" text-arrow link in the top row AND a duplicate button in `BoothLaunchPanel`; 5+ buttons at 28–32 px (`py-1.5 text-xs`); mulberry for everything | Record (terracotta) · Render (grey) · Share (blue) |
| R2 | ◐ | category is a `LinkPickMenu` (pass); music track is a native `<select>` in `render-form.tsx`; primary/backup is a two-slot pair with "↔ Swap" | PickMenu for template ×2 and music |
| R3 | ✗ | booth "Change primary" → gallery `?role=`; template page → gallery `?queued=`; capture and render never on one page | pick in place |
| R4 | ✗ | top-row links; "Render reel" under the form; capture controls in flow | thumb bar |
| R5 | ◐ | 1-column, but 9:16 preview per template card → **13 screens** | template = a row + PickMenu, preview in a sheet |
| R6 | ✗ | ≈14 boxes (`BoothLaunchPanel`, `TiktokConnectPanel`, `SaveShareCard`, `YourRenders`, `HowItWorks`, `ReelRenderer`; 3 on the template page; `CapacityStrip`, 2 slots, `OperatorTips`) + an `article` card per template | rows |
| R7 | ✗ | **503 words**; `HowItWorks` 3 paragraphs; `OperatorTips`; "What ships in the Station Pack"; "Spec range" copy in `render-form.tsx` | behind ⓘ |
| R8 | ✓ | zero banned words | — |
| R9 | ✗ | "Pick 2 templates", a 1–30 s "Mimic duration" slider, "spec range" sentence; "Render queued" is a box not a toast | one default, a toast |
| R10 | ◐ | `TagSheet` offers scan / search / manual — the user picks the method | we pick: scan if a QR is in view, else search |
| R11 | ✗ | no patiktok key in `lib/tours.ts`; no `<MiniTour>` | add `customer_video_booth_v1` |
| R12 | ◐ | `logQueryError('PatiktokPage.jobsRaw', …, 'graceful_degrade')` → a refused read renders as no renders at all; music fetch degrades to an "Auto-pick"-only dropdown | reason + Try again |
| R13 | ◐ | "Use as primary" and Swap save immediately | preview + Apply |
| R14 | ✓ | one dropdown, one sheet | — |

**Target vs today.** No designed controller exists (`SERVICE_CONTROL_CENTERS_DESIGN_2026-08-28.md` has no Patiktok section; `0017_patiktok.md` is a title). Exists, spread over 3 routes: gallery + templates, capture + `TagSheet`, renders list, TikTok connect, Save & share checkout. Missing: any booth on/off (the "booth" is a route), a reels/share step beyond Download, a tour. **Delta:** one page, one segmented control Templates · Booth · Reels (≤3, Rule R2 exception); Booth = switch + 2 PickMenus + music PickMenu + today's count (animated) ; Reels = rows; thumb bar Record · Render · Share; How-it-works/Operator tips/Station Pack behind ⓘ; the duplicate "Open booth dashboard" gone.

## 3 · Ranked fix list — PR-sized steps for a later Opus build
Order = worst page first, then shared mechanics. Each PR: before/after at 375 and 1280 in the body + a one-line check card (link · 3 steps · what you should see). Builders follow `BUTTON_RULE_2026-10-07_fable.md` for tones and `ActionButton`.

1. **Live Watch: the More row opens the controller** — once owned, `addOnHref('live-studio-roam')` → `liveStudioControlPath`; the sales page becomes a "More cameras · Add Live Watch" row + `ChoosePlanSheet`; delete the "Build state:" line. Guard: `lib/live-studio-cast-retirement.test.ts` stays green.
2. **Live Watch: Set-once rows + thumb bar** — YouTube / Setnayan mark / Guest pick / Watch link as rows (all four channel states kept, one YouTube panel not two); 7 `sn-tile` cards → rows; Go live · Cut · Camera thumb bar; `<details>` folds → one open at a time; "celebration" → "event" (6).
3. **Papic: 22 boxes → rows in phase order** — `page.tsx` blocks become `SettingRow`-style rows (the component already exists); nine orphan cards fold into three rows (Challenges · Moderation · Recap/Magazine/Flash); delete the two developer notes; "celebration" → "event" (9). Keep `PapicStage`, `ord()`, the tour and the honest-read guards.
4. **Papic: sub-pages become sheets** — crew QR (show/print), challenges picker, moderation queue, guest-camera tier as sheets on the page; `StylePicker` grid → PickMenu with the look previewed in the stage and Apply; thumb bar Add credits · QR codes · Library.
5. **Patiktok: one page, three segments** — fold `/booth`, `/[templateId]` and `?queued` into `/studio/patiktok` with `ISegmented` Templates · Booth · Reels; template/backup/music as PickMenus; `HowItWorks`/`OperatorTips`/Station Pack behind ⓘ; Record · Render · Share thumb bar; renders as rows with a reason on a refused read; toast on queue.
6. **Setnayan AI: coverage switches + Activate + data list + Erase** — nine switches over `AiCapabilityId` (new per-event coverage store, RLS at CREATE TABLE); green Activate reusing SKU `SETNAYAN_AI`; "What it uses" rows from `loadAiActivity` inputs with animated counts; red Erase with one confirm → owner must say which data (§2.1 ⚠). Replace the spotlight tiles with rows + ⓘ; `eventWord` instead of "wedding".
7. **Music Maker: story + keywords + picks** — "Use our story" switch, `events.love_story` as an editable prefilled field (one source of truth, no `/details` link), Keywords field, PickMenus for `music_type` and `story_tone · story_language`, Save/Continue thumb bar, 5 boxes → rows, "site/wedding page" → Event Hub, toast on save.
8. **Tours for four pages** — `customer_planner_v1`, `customer_live_watch_v1`, `customer_music_maker_v1`, `customer_video_booth_v1` in `lib/tours.ts` + `<MiniTour>` on each page (words only while `TIP_POPUPS_ON` is false).
9. **Honest reads on three pages** — Setnayan AI `loadAiActivity`, Live Watch `ackError`/`grantRawError`, Patiktok `jobsRaw`/music tracks: the failure reaches the render with a reason + Try again, copying `reads-are-honest.test.ts` / `guests-read-is-honest.test.ts`.
10. **A word guard for the five routes** — a test that counts visible words per page under a ceiling (≈ 40 % of today's: AI ≤ 90 · Papic ≤ 300 · Live ≤ 200 · Music ≤ 80 · Patiktok ≤ 200) and refuses "celebration", "website", "site", "vendor" in their visible strings; re-measure before setting the ceilings — the counts above are one day's reading.

## 4 · Open owner calls (not engineering)
- **Erase data (Setnayan AI):** the derived snapshot only, or the DPO review's per-user behavioural data (safeguard 7)? The prototype shows a single red button; the scope decides the confirm text.
- **Live Watch free tier:** with the sales page gone, where does the free single-camera door live — the same controller with the "More cameras" row, as drawn?
- **Patiktok booth on/off:** today there is no such switch; drawn as a row because "Full Controller" implies it.

## 5 · Files
- This doc: `MORE_MENU_PAGES_AUDIT_2026-10-07_fable.md`
- Prototypes (delta only, 375 px): `prototypes/more-menu-pages-2026-10-07/{1-setnayan-ai,2-papic,3-live-watch,4-music-maker,5-patiktok}.html` + `*-375.png`; shipped-page screenshots `today-*-375.jpg`; `shared.css` (tokens mirror `globals.css`).
- Each prototype's caption carries its before/after word count.
