# Roadmap to the Apple check — and after it (2026-10-06)

> Owner, 06 Oct 18:35 PHT: *"create the full documentation to transfer to the new account … includes
> everything until apple check and post apple check"*.
>
> **This is the plan of record from 06 Oct onward.** It merges (newest wins): the 06 Oct handoff
> `00-READ-ME-FIRST-CONTROLLER.md` (zip `setnayan-handoff-2026-10-06-1035Z`), `DECISION_LOG.md` rows
> 2026-10-05/06, `EVENT_HUB_BUILD_PLAN_2026-09-28.md` "FINAL BUILD SEQUENCE", `RELEASE_RSVP_INVITATION_2026-09-30.md`,
> `BUILD_PROMPTS_THU_2026-10-01.md`, `AFTER_APPLE_BUILD_LIST_2026-09-28.md`, `CONTROLLER_QUEUE.md`,
> and the repo's `build-sessions/{SUBMIT-CHECKLIST,APP-STORE-LISTING-DRAFT,CONTROLLER}.md`.
>
> ⚠ **A roadmap is not evidence.** Every "done" below was measured on 2026-10-06 ~10:40Z against
> `origin/main` and `https://www.setnayan.com/api/health`. Re-measure with the command given before acting.
> Effort sizes are rough: **S** = under 1 hour of builder time · **M** = a half-day builder · **L** = one
> full builder run plus review and train. They are not money numbers.

---

## 1 · LIVE NOW

Re-measure: `curl -sL https://www.setnayan.com/api/health` → `version`; `git log origin/main --first-parent --oneline -10`.

**Live = `217415f` = `origin/main` head (measured 10:37Z).** Nothing merged is waiting to deploy.

| Train | PR | Merged (UTC) | What it shipped |
|---|---|---|---|
| i | #6361 | 10-05 | guided setup round 2, palette is the source (#6356–#6360; #6359's content folded in; #6359 itself is still an open draft and can be closed as shipped-through-train) |
| — | #6362 | 10-05 | the creator is their own couple row, called "Host"; "This is me" |
| j | #6365 | 10-05 16:22 | Maker live-walk fixes (Apply sheet above the Maker, one-tap tools, logo → Logo Maker) + every guest chapter reveals |
| k | #6368 | 10-05 18:17 | Look without themes (Moving background ◆, Font/Colours/Buttons free) + approved section order |
| l | #6374 | 10-05 22:43 | QR sheet follows draft · named-item door · menu never peeks · style picks reach the canvas |
| m | #6376 | 10-06 00:06 | drag-and-drop two-column Wedding March (#6372) + When-yes celebration ◆ (#6375) |
| n | #6381 | 10-06 04:12 | Event Details rebuild steps 1–3, 6, 7 (#6377) + deploy sees its marker (#6378) |
| o | #6385 | 10-06 09:36 | march crash fix (#6379) + "Not walking" tray (#6380, new table `march_not_walking`, migration `20271265555437`) |

Also merged: Capacitor iOS/Android 8.4.3 + rustls bumps (#6382–#6384, dependabot).

**Plan stages already finished** (measured against merged PRs): Event Hub Stage A, Stage E, Stage D (event menu #6153);
RELEASE_RSVP step 1 (RSVP + Invitation live), step 2 (The Day + Post Event), step 5 (admin audit + P5a/P5b);
BUILD_PROMPTS P1a, P1b, P2, P3, P4, P5, P6a, P7, P9. Stage C was replaced by the Event Details rebuild (DECISION_LOG
2026-10-06 "EVENT DETAILS IS REBUILT").

---

## 2 · BUILD NOW — none of these depend on the Stages | Studio decision

Order = as listed. Each one goes into a train the usual way (draft PR + `do-not-auto-merge` → fold → every check green → deploy).

### 2.1 Wedding March edits wait for Apply  ·  M  ·  🔗 VITAL TO THE NEW MAKER ("Apply publishes") — folded into the Stages | Studio build as PR 4b (Lane B, after PR 4).
- **What:** every march step, including "walking / not walking", becomes a hub-draft entry; Apply replays the steps through
  the shipped actions. Remove `HubSavesImmediately` and `data-writes-live` from `details-march.tsx`, and lower the
  opt-in count in guard (22).
- **Why:** owner: *"Wait for apply"* (DECISION_LOG 2026-10-06 "THE WEDDING MARCH ITEM IS A DRAG-AND-DROP MARCH MAKER").
  This reverses the 10-05 "keep instant" call.
- **Where:** `lib/hub-draft.ts`, `hubDraftAction`, `planHubDraftApply` in `hub-draft-actions.ts`. Notes are in
  `build-sessions/MARCH-TRAY-PROGRESS.md` on branch `rd/march-not-walking-tray` ("NEXT SESSION").
- **Done when:** a drag on the phone changes nothing for guests until Apply; Apply names the march change; Undo works;
  guard (22) is green.
- **Owner question open:** a sponsor taken out of a pair prints **alone at the end of their section**. Their role still
  prints; the pairing doesn't. OK?

### 2.2 Event Details rebuild — the leftovers of #6377  ·  L  ·  ⛔ SUPERSEDED 2026-10-06 by the Stages | Studio build (`EVENT_HUB_MAKER_STAGES_STUDIO_BUILD_PLAN_2026-10-06.md`: Reveal → PR 3, cover/background + Kindly reply/RSVP → PR 4). Do not build separately.
Notes: `build-sessions/EVENT-DETAILS-REBUILD-PROGRESS.md` on `rd/event-details-rebuild` ("NEXT SESSION" + "Controller sweep").
- **Step 4 · cover:** the frame is removed; the cover wears the Global Background; Darker ↔ Lighter (Darker · Dark ·
  As is · Light · Lighter) with text that stays above the contrast floor, the page header included
  (`adaptive-theme`, `CALMER_CLIP_SCRIM`, `lib/hub-legibility`, `mainGroundLegibility`). Owner: *"cover has this frame
  that we can remove … can have it go darker or lighter (do make sure it can show and make the texts readable)"*.
- **Step 5 · Reveal:** Reveal becomes the first scene of Save the Date / Invitation / The Day, with show/hide, and sits on
  top of the cover only. Owner: *"reveal only stays on top of the cover and the next slide will not have the reveal anymore"*.
- **Kindly reply** → the RSVP stage.
- **Sweep:** ellipsis only at a word boundary; desktop label "Invitation › Details" over Schedule; the remaining pill
  rows become one PickMenu each (Match/Keep my colours, `main-background-panel.tsx` Choice stack, Colours tiles in
  `pro-panels.tsx`); a Retry (`router.refresh`) on "Could not be read just now" rows.
- **Done when:** walked at 375 px on maria-and-jose with each item visible; guards green.

### 2.3 PGRST002 — a schema-cache blip retries instead of erroring  ·  M
- **What:** on PGRST002/5xx, show "Reconnecting…" and retry reads for a few seconds. Never show not-found, redirect, or
  empty. Start with the `EventLayout` `event_members` read, `fetchUserEvents`, `LaunchPage.membership`, and the Maker open.
- **Why:** prod bursts at 10-05 13:54Z and 10-06 02:12Z. The Maker failed to open and Home bounced to
  /dashboard/library. Every deploy that carries a migration causes a 20 s–1 min blip.
- **Done when:** a test that throws PGRST002 once and then succeeds renders the page, not an error, with no redirect.
- **Ops rule until this ships:** warn the owner before deploying a train that carries a migration.

### 2.4 /guests 400 — a public id passed where a uuid is expected  ·  S
- **What:** an `S89E-…` public id reaches a uuid column (Vercel error group "invalid input syntax for type uuid").
  Resolve the public id first, and add a `readEventTypeRow`-style `isUuid` guard.
- **Done when:** the Vercel group stops recurring; a unit test passes on the public-id path.

### 2.5 The guest camera — the best quality a browser allows  ·  L (measure first)
- **Why:** owner, 06 Oct: *"we want to be able to provide the best quality at browser mode too. the best there can be."*
- **Today (shipped, `papic-guest-capture.tsx` + `lib/use-papic-camera.ts`):**
  - stills are a frame of the video stream (`ideal` 2560×1440 ≈ 3.7 MP)
  - no flash/torch, no tap-to-focus or exposure, no night/HDR, no pinch zoom
  - 0.5×/1× only where the phone exposes it (never on iPhone Safari)
  - clips max 10 s and un-styled
- **Build, each measured on a real iPhone + a real Android before and after:**
  1. **Full-sensor stills where the browser allows.** Use `ImageCapture.takePhoto()` on Android Chrome; the hook's own comment says this was deferred only because iOS lacks it. iOS keeps the video frame.
  2. **Ask for the largest stream the phone offers.** Read `track.getCapabilities()` max width/height instead of a fixed `ideal`.
  3. **Tap to focus + exposure** (`pointsOfInterest` / `focusMode` / `exposureCompensation`) where the track supports it.
  4. **Torch while recording** where supported. **Pinch zoom** from the track's `zoom` range.
  5. **Low light:** run the existing `/papic/lightcheck` probe in a dark room on both phones first (it is the gate named in `Papic_Low_Light_Council_Verdict_2026-07-21`). Only then decide multi-frame stacking (cost it at 3.7 MP per frame, per the `papic-photo-styles.ts` docblock).
  6. **Fix:** guest clip posters skip the couple's Look (`grabPoster` never calls `applyPapicStyle`). Correct the stale "5 s", "1 photo · 7 clip" and "1080p" comments.
- **Done when:** a side-by-side contact sheet (old vs new, day and dark room, iPhone and Android) shows the gain, and the guest flow is unchanged (tap = photo, hold = 10 s video, Challenge, Tag who's in it, offline queue).
- **Honest ceiling:** on iPhone, a web page cannot get full-sensor stills, extra lenses, flash or night mode. That is what §7's native camera is for.

---

## 3 · AFTER THE OWNER APPROVES THE STAGES | STUDIO PROTOTYPE — one build of the new Maker

> ⛔ **SUPERSEDED 2026-10-06 — this whole section IS the Stages | Studio build now running** (`EVENT_HUB_MAKER_STAGES_STUDIO_BUILD_PLAN_2026-10-06.md`, six PRs). Two rows below are BUGS, not design, and were carried into PR 2's prompt so they are not lost: *Animate effects play in Preview/Play* and *Every style reachable in place*. Nothing here is built separately.


**Status: PLANNING ONLY. Nothing here builds until the owner says "approve".**
Prototype: `prototypes/maker_two_dropdowns_owner_wireframe_2026-10-06_fable.html`, plus sibling studies
`maker_toolbar_style_text_animate_2026-10-06_fable.*` and `event_hub_what_lives_where_2026-10-06_fable.*`.
DECISION_LOG 2026-10-06 "PLANNING ONLY — phone toolbar per element".
Owner, verbatim: *"this is just planning"*. The pending design change: Animate as one column with toggles.

**The agreed shape, as of 06 Oct evening:**
- **Top bar:** ✕ Exit · [Stages | Studio] · ↺ Undo · ✓ Apply (count).
  - **Stages** = how it LOOKS and MOVES. No typing.
  - **Studio** = what it SAYS: Look · Info · Logo · Mood Board & Dress Code · Wedding March · Love Story · Schedule ·
    Seat plan · E-Gifts · RSVP. Info is one form and includes the Event Hub settings.
- **Lower third (Stages):**
  - **Stage ▾** — a multi-page stage expands to its guest pages:
    - Invitation › Welcome · Details · Our Love Story · Me
    - The Day › Live · Welcome · Camera · Gallery · Me
    - RSVP › form · When yes · When no
  - [Style | Text | Animate] · ▶ Play (replaces Preview).
  - Collapses to one row until a piece is picked. The guest tab bar is also tappable on the canvas.
- **Every visible piece is its own element.** Names, date and place are split. A "Section ⌃" chip selects the whole
  section. No INFO/STUDIO badges on the canvas.
- **Style:** "Edit in Studio › …" (only for Studio-backed pieces) · Layout ▾ · Background (None/Plain/Diagonal/Glow/
  Photo-video · framed/full · colour · Gallery › · Upload ◆ · Darker↔Lighter) · part extras · Arrange (show · order ·
  alignment · spacing).
- **Text:** font · colour · size · weight · alignment. No typing.
- **Animate:** Build in | Action | Build out · How it moves ▾ · toggles (Fade, Blur, Move ←→↑↓, Size Grow/Shrink) ·
  Duration/Delay sliders · Into the next scene ▾ (Scroll · Scrub · Auto-scroll).
- **Venue + date come from Suppliers** (Date Finder in compare; the lock sets the date; manual venue entry).
  "Plan it myself" leaves the Maker. "How guests get in" → Event Setup.
- **Home:** one "Event Hub · n of 10 ready ›" card.

**The one build includes these, each already owner-approved in DECISION_LOG:**

| Item | Owner / row | Est. |
|---|---|---|
| Toolbar + pieces + Style/Text/Animate (supersedes Text · Motion · Arrange) | planning row 10-06 | L |
| **Bottom toolbar = 50% of the screen** (supersedes "resizable lower third", owner 06 Oct evening, prototype): no resize; every control scales with the phone's height and the rows fill the half (*"maximize the spaces"*); the picked part jumps to the centre of the preview above it; every pop-up rises from the bottom (phone) | prototype `maker_two_dropdowns_owner_wireframe_2026-10-06_fable.html` | M |
| Animate effects play in Preview/Play (owner desktop screenshot: Schedule › Animate · Editorial · follows scroll · fade/right/grow/blur did nothing); `pahina-motion.tsx` reveal safety net must not show sections instantly; "Cinematic" clipped; pill rows → dropdowns | handoff NEXT BUILDS 3 | M |
| Every style reachable in place: RSVP form's 3 styles (`FIXED_STYLE_SCENES` omits rsvp; the reply page passes no sceneStyle) · palette picker wherever Our colours shows (`layoutDrawsPaletteLook`) · Dress code layouts B/C · cover designs from the cover tap · guest-style tab bar page picker · tap-to-edit words on RSVP form / When yes / When no (`data-rsvp-word`) | handoff NEXT BUILDS 4 | M |
| Tap-to-edit words move to Studio | planning | S |
| Moves out: Date Finder → Suppliers, Venue → Suppliers, How guests get in → Event Setup, Plan it myself → dashboard Settings | *"Venue: needs to come from the suppliers"* | M |
| Home "Event Hub · n of 10 ready ›" card | planning | S |

**Before the build — the existence audit (owner's last request, NOT done):** *"check what we have on event hub maker.
and check which is existing and which is new. and make sure nothing is gone"*. Every shipped Maker control is mapped to
its place in the new design, in one table: Look panel, Details items, scene Format/Animate/Arrange/Content, fixed-part
styles, palette looks, pass styles, cover designs, RSVP stage, Post Event panel, Prints, guided flow, Apply/Undo/Restore,
Who can view, QR, address, music, reveal, and the rest. Columns: control · where it lives today · where it goes ·
NEW / KEPT / **NO HOME**. Every NO HOME row is an owner question before the build starts.

---

## 4 · SAVED LOOKS (Pro)  ·  M — after §3

- **What:** save the current design as a look and apply it to another event. It copies Background · Colours · Font ·
  effects · animations. It **never** copies the event's data (names, dates, guests, words).
- **Why:** owner: *"Comes with Pro. it will use the animations, fonts, colors, effects, background, everything except the
  data of the event"* (DECISION_LOG 2026-10-05 "THEMES ARE REPLACED BY BACKGROUND · COLOURS · FONT").
- **Done when:** a look saved on event A applies to event B through the draft + Apply; B's words and data are unchanged;
  free couples see ◆.
- **Related, after the Apple check:** users save and share themes, Community Templates = Pro (see §7).

---

## 5 · THE AFTER-TEST QUEUE — owner-approved, waiting since test #2

Owner: *"wait after the test"*. All reuse shipped code. Batch by area.

**5.1 Supplier batch (one builder)  ·  L**
- **Remove on every non-booked bench card** (`deleteVendor`; refused for booked suppliers). DECISION_LOG 2026-10-05
  "EVERY BENCH SUPPLIER GETS A REMOVE".
  - Shortlisted supplier → off the shortlist, conversation archived.
  - Self-added supplier → deleted, with Undo. Ask first if payments are logged.
- **Then, through the app, on cale-ice:** remove "Saysay Live Band & Hosting (FIXTURE)", "Dunkin Donuts", "Seda Hotel" and
  "adsfasdf" (₱80,000). **Keep "Seda Vertis North"** (the booked venue). Also find out how a FIXTURE supplier got onto a
  real event.
- **Payment plan:** add the hint "dates start when you lock".
- **Edit sheet:** mount `SupplierConnectPanel` in the manual Edit sheet, plus "Send by email" (`sendVendorInvite`).
- **Peso input:** one shared `PesoInput` (extract `formatPhpInput`/`reformatPhpInput` from the budget setter).
- **"Paid so far":** amount + date → `logPayment`.
- **Inclusion chips** per category → `host_inclusions`.
- **"Price per head × guests" mode** (`lib/pax.ts`).
- **Locked groups:** `lockedGroupIdsFromVendorRows` reads `covers_plan_groups`.
- **Manual add with an agreed price** = BOOKED and on the bench.
- **The picked tile sticks:** save `category_key` (e.g. `food_truck`), and backfill where recoverable. Copy: "You added X".
- **"Not needed? Remove" fails:** `event_category_decisions_event_tile_key` is a PARTIAL unique index. Migration: make it a
  full unique index. Use friendly copy and `logQueryError`, never a raw `error.message`.
- **One pill height** in `services-covered-picker.tsx`.

**5.2 Guest list  ·  M**
- **Desktop table:** cells vertically centred; columns aligned; no grey band; bride/groom show their role once.
- **Import page:** "Download my guest list", pre-filled, same columns as `/templates/setnayan-guest-list-wedding.xlsx`, is
  the primary action; "Blank file" is secondary.
- **iPhone batch 3** (handoff "QUEUED 2026-10-04 16:45Z"):
  - Notifications: tag pill too wide; "celebration" → "event"; "Papic"; the floating nav covers the list.
  - Guests header: the bare black circle.
  - "Sort" appears twice.
  - Tabs and a segmented control share one row.
  - Guest card label styles.
  - The "…" menu spills off the card.
  - Ticket thumbnail too small.

**5.3 Home and money labels  ·  S each**
- 🔨 **MOVED INTO THE MAKER BUILD'S FINAL FIXES PR 2026-10-07 (owner asked again).** **Home event header card** wears the event's poster (`resolveEventPoster` → `sceneCoverFor`). Owner: *"i thought this
  will have the same background as our event hub?"*
- **"Settle a payment"** shows the catalogue title, not the code. Fix the "2 vs 1 waiting" badge.
- **Home tile "Guest photos · Papic"** → "Event Gallery".
- **cale-ice order SNCNJ1E3Y8** (₱350 test) — cancel ONLY if the owner says *"cancel it"*.

**5.4 Small fixes  ·  S each**
- **People › Remove:** `withdrawConnection` should match either side and refuse honestly on 0 rows.
- **Desktop rail event mark** `.fd-rctx-mark`: draw the real logo scaled to fit, with "MJ" as the fallback.
- ⛔ SUPERSEDED 2026-10-06 (Mood Board redraw row: each role told its own outfit, **no default**; lanes + "follows until set" → Maker PR 5). Was: **Attire defaults by role**, venue extras, and the linked/"yours" colour behaviour. DECISION_LOG 2026-10-05 "THE 5 MAIN
  COLOURS": *"right after test #2"*.
- **Date change moves the whole schedule**, and the Apply sheet names each change. Owner yes, 4 Oct. Re-measure: may be
  partly shipped.
- **Copy sweep "celebration" → "event"** in UI labels (~593 hits). Re-measure with grep.
- **OFL.txt licence files** for the older font folders.

**5.5 Performance (offered, not yet approved)**
- Home/dashboard server render takes 4.5–6.5 s. Owner: *"takes too long"*.

---

## 6 · THE APPLE CHECK (RELEASE_RSVP step 7 · Event Hub plan Stage B — runs LAST)

**What it is:**
1. Run the guest path and the Maker in the iOS Simulator and in an in-app webview (Messenger-style), and fix what that finds.
2. The owner tests on a real iPhone.
3. A NEW build is uploaded and submitted to App Review.

The iOS app is a remote-URL Capacitor shell (`apps/mobile/capacitor.config.ts` loads `https://www.setnayan.com`). **Once
Apple approves the binary, every website change reaches iOS users without a new review.**

**History:**
- Build 1 was rejected on 06-30 (3.1.1 · 5.1.1(v) · 5.1.2(i)).
- Build 3 was rejected on **09-22: Guideline 2.1, "The app crashed on launch"** — a hung first load left a blank white WebView.
- Build 1.0 (4) was uploaded but never submitted.

### 6.1 Must happen BEFORE the check (in this order)

| # | Item | State 06 Oct | Who | Est. |
|---|---|---|---|---|
| a | Everything in §2 (and §3/§5 if the owner wants them in the reviewed build) | open | builders | — |
| b | **Launch watchdog proven on a REAL iPhone with a HANGING connection** (not airplane mode — offline already passes) | code on main (`SetnayanBridgeViewController.swift` `startLaunchWatchdog`, commit 240af87bc); **"Simulator only — physical-device confirmation still required"** | owner + controller | S |
| c | **Native Apple/Google sign-in owner setup** (#6330 + #6334 merged): Supabase Redirect URL `setnayan://auth/callback**`; Supabase Apple provider Client ID `com.setnayan.app`; Apple Developer → `com.setnayan.app` → Sign In with Apple ON + regenerate the profile. Guideline 4.8: offering Google requires Apple. Check the release build says "Setnayan", not "App". | **owner setup NOT recorded as done** | **owner** | S |
| d | **Spotlight tours — the last feature build before the check.** Owner: *"We create tour as the final step before apple check"*. Use the shipped `lib/tours.ts` MiniTour/TOURS, never a new mechanism. Tip popups have been off since #6305. | not built | builder | M |
| e | **P8 address renames**, alone, after everything else merges: `/panood` → `/live-watch` · `/<event>/pabuya` → `/<event>/gifts` · `/dashboard/<event>/suite` → `/dashboard/<event>/services`, with old addresses forwarding and the AASA/assetlinks app-link lists updated (iOS reads AASA from Apple's CDN — allow for the lag). Owner: *"we can do this at the end before apple check"*. | **not built** (`app/panood`, `app/[slug]/pabuya` still on main) | builder | M |
| f | Simulator + in-app-webview walk of the guest path and the Maker; fix what it finds | not done | controller | M |
| g | **New build 1.0 (5)**: native code changed after build 4 (82edba775 native save, cd76884ab native sign-in), so build 4 is stale. `CURRENT_PROJECT_VERSION` 4 → 5. | not done | controller builds; owner uploads | S |

### 6.2 Submission (owner does these in App Store Connect — `build-sessions/SUBMIT-CHECKLIST.md`)
0. Build processed in TestFlight; answer "Missing Compliance" with no non-exempt encryption.
1. Reviewer account `testnayan1@test.com`, email + password, never the Google button. It must have fake guests, a table
   and a supplier conversation. Confirmed working on 09-22.
2. Six screenshots at 6.9" (1320×2868) from the TestFlight build on the demo event.
3. Listing: `build-sessions/APP-STORE-LISTING-DRAFT.md`. Support URL `/help`, marketing URL `setnayan.com`, privacy
   `/privacy`. **Never `/contact` (404).**
4. Age rating: all None, user-generated content yes. Privacy: no tracking.
5. Attach the build, review notes, demo credentials, the NFC tag note → Add for Review → Submit.

**Listing fixes needed before pasting:**
- The notes say "wedding planning tool" — change to all events.
- The PREVIOUS REVIEW paragraph must cover the 09-22 2.1 crash and the fix.
- Rename to Live Watch and Suppliers.
- Mention Sign in with Apple if it is enabled.

**Known review risks:**
- **3.1.1 / 3.1.3(b):** web-bought extras play in the app. Lever: `STORE_SHELL_WEB_ONLY_STUDIO_SEGMENTS`. Real fix: IAP, v1.1.
- **4.2:** minimum functionality — answer with camera, push and NFC.
- **5.2:** the Patiktok name. Owner chose *"keep patiktok"*.
- Budget for one more round-trip.

**Done when:** the build is "Waiting for Review" — then "Ready for Sale".

---

## 7 · AFTER THE APPLE CHECK — owner-approved, nothing starts before step 7

| Item | Owner / source |
|---|---|
| **Native Papic camera (Phase 2)** — full sensor, every lens (0.5× · 2×/3×), the phone’s own night mode / HDR / stabilisation, flash, background upload. Owner, 06 Oct: *"allow this after the apple check when we have a native app"*. `@capacitor/camera` is declared but has zero importers (`app-install-banner.tsx`). | owner 2026-10-06 |
| **App-Bound Domains** (`WKAppBoundDomains`). List every in-app domain (setnayan.com, www, Supabase auth, checkout host) and test on a device. | *"we do it after apple check"* — DECISION_LOG 2026-10-02 |
| **NFC write on:** `NEXT_PUBLIC_NFC_WRITE_ENABLED=true` (NFC-OWNER-STEPS step 9) | after approval |
| **Setnayan's name on Google's sign-in screen** (Supabase custom domain) | *"setnayan name after apple check"* |
| **Event Hub Plus** ₱2,500/₱1,500 + **Pro** ₱5,000/₱3,000 · Community Templates = Pro · creators reuse their own theme free. **Read prices from `platform_retail_catalog_v2`, never from this line.** | handoff 2 Oct "AFTER APPLE CHECK" |
| **Theme library upgrade:** admin theme generator · users save and share themes · "By …" filter | DECISION_LOG 2026-10-01 "THE THEME LIBRARY UPGRADE WAITS" |
| **Admin rebuild:** prototypes `admin_final` + `admin_pages_simple`, Needs-action list, theme maker | handoff 2 Oct |
| **Service cards + marketplace as ONE build:** `ServiceCardView` everywhere; `sizes`; crew-meal line; test bookings don't count; clipped header; a Maker-style card creator | AFTER_APPLE_BUILD_LIST §2A |
| **SEO/GEO:** footer Suppliers link · region pages · guide copy · /explore on `service-card-faces` · "supplier, never vendor" phases 2–4 · llms.txt · Search Console | *"SEO GEO will be after apple. not now"* — §2B |
| **Supplier + coordinator toolkit**, vendor readiness checklist, scan-to-claim | *"after apple yes"* |
| **Mood Board supplier edits** · help chatbot · 5 onboarding monograms | AUDIT_TWO_WEEKS "Waiting for after the Apple check" |
| **Sign-up upsells / prices in first-run flows** | FIRST_TIMER_TEST item 25 |
| **Tighten RLS** on `guest_face_enrollments` | CONTROLLER_QUEUE §5 |
| **Theme pricing (d13)** · Event Hub middle tier / still vs moving themes (d14) | CONTROLLER_QUEUE §5 |
| **Apple IAP** for paid extras (v1.1) — closes the 3.1.1 risk | STORE-SHELL-CLOSEOUT §6 |
| **Words layer in the Root map**; Root map waves 4–8 | handoff 2 Oct |
| **Future direction beyond events** (my things, nearest services). Don't build now; don't close the door. | DECISION_LOG 2026-10-02 "FUTURE DIRECTION" |

**Owner questions that block §7 items** (AFTER_APPLE_BUILD_LIST §2C):
- demo-flag SetnaProd and Saysay?
- "vendor" in the legal pages?
- /vendors vs /for-suppliers (#6206 may have answered this — re-measure)?
- make the specs repo private?
- region pages?

---

## 8 · OPEN OWNER QUESTIONS (ask once; don't re-ask answered ones)

1. RSVP question: replace "Will you celebrate with us?" with "Will you join us?" (recommend yes).
2. Celebration also on the Event Hub page's own reply card? (recommend yes)
3. #6377 questions:
   - Buttons inside Colours OK?
   - Keep the name "Story & plans"?
   - Phone menu: the 4 parts, or every item?
   - `events.rsvp_backdrop` retired, or does it need a home?
   - The E-Gifts manager saves immediately (and says so) — OK, or must it wait for Apply?
4. May the cover set its own photo/video on the cover only? (recommend yes)
5. Sponsor out of a pair prints alone at the end of their section (§2.1)?
6. Links still leaving the Maker (DECISION_LOG 2026-10-05 three-zones row):
   - guest import + Send/Preview
   - 3D seat plan / Pro purchase links
   - Gifts → E-Gifts
   - date-clash supplier link
   - logo studio canvas
7. Stages | Studio prototype — "approve"? (gates §3)
8. Native sign-in setup (§6.1c) done?

## 8a · NEXT AFTER THE EVENT HUB MAKER — THE SUPPLIERS PAGE (owner 2026-10-07: *"after we finish event hub maker, this is what we will do."*)
The handoff `SUPPLIERS_HANDOFF_2026-10-07_fable.md` (corpus root) is the plan: seven PRs, the prototype `prototypes/suppliers_page_2026-10-07_fable.html` is the contract, acceptance pictures in `prototypes/suppliers_final_2026-10-07/`. PR0 (ActionButton · Count · Fill · tones) is being built TONIGHT by the Maker's button-rule builder (`rd/maker-button-rule`) to the PR0 spec — Suppliers starts at PR1 (plus PR0's Ugat nodes). PR6 (booking-fee rules) needs four owner rulings first: charge at the yes or at the deposit acknowledgement · `host_marketplace_search` sourced · self-added = claim or direct · gate manpower / appointments / story credit (+ import rows toward free-5).

## 8b · WAIT LIST — discuss before building (owner 2026-10-06: *"Can we put this to wait list? Once we have properly discussed these"*)
- **Passcodes — all of it.** The event passcode after Welcome · a personal code per guest (a short form of their personal link → straight to their own profile) · a "Have an event code?" box on setnayan.com and the app's first screen. Controller's proposal on the table, NOT decided: Setnayan-generated codes only, 8 characters, pause on wrong tries per device and network, one-tap new code, a code opens exactly what the personal link opens, couple notified of replies made through a code, "Not you?" sign-out. Open: generated vs chosen event code; replace "Find your invitation" by name. Removed from the Maker build (PR 6) — no migration in that build now.

## 9 · Operating rules that still bind

- **Trains:** draft member PRs + `do-not-auto-merge` → fold into `rd/train-…` with `--no-ff` → regenerate baselines
  (`pnpm -s port:baseline / ugat:screens / root-map / lint:no-card --update-baseline / exposure:baseline`) → merge
  `--match-head-commit` ONLY when every check is green → `gh workflow run deploy-prod.yml --ref main` → verify
  `/api/health`.
- **Never merge before every check clears.** Never apply a migration directly to prod.
- **Builders are Opus; Fable designs.** Stop and hand off at 98% weekly; never downgrade the model.
- **Phone first (375/390 with touch).** Every build comes with a check card for the owner.
- "Job was not acquired by Runner" = GitHub infra; re-run the failed jobs.
