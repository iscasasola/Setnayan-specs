# Invitation + RSVP + guest flow + Maker — what is left before the live-test rerun (audit, 2026-10-04)

Auditor, read-only. Measured against **production = `origin/main` 777cf8f** (`/api/health` → `"version":"777cf8f"`, checked 2026-10-04), from a detached worktree of `origin/main` (never `~`). Prod data read with SELECTs only. Sources: handoff `00-READ-ME-FIRST-CONTROLLER.md` (2026-10-02 22:30Z zip), `RELEASE_RSVP_INVITATION_2026-09-30.md`, `WEDDING_ONBOARDING_HUB_SETUP_EVENT_DETAILS_BUILD_SPEC_2026-10-01.md`, `MAKER_REPLAN_PLAN_2026-09-30.md` (its CUT list respected: no Search, no Quick setup, no presets, no Lane D/E), `BUILD_PROMPTS_THU_2026-10-01.md`, `HANDOFF_STATE_2026-10-03.md`, `CONTROLLER_SESSION_SUMMARY_2026-10-03_cloud.md`, and the DECISION_LOG rows 2026-09-29 → 2026-10-04. Open PRs: #6308 (calm guest Event Hub, 14 pass / 1 pending), #6310 (Discover card, 1 failing check), #6315 (People with access, 15 pass / 1 pending). All three are drafts labelled `do-not-auto-merge`. The live-test checklist artifact from 2 Oct (`EXzDMg21…`) could not be read from this account, so its "fail" rows are not included here.

---

## 1 · Verdict

**Yes, you can rerun the test today, using the phone browser.** Every fix from the 2 Oct test is live in 777cf8f: #6304, #6301, #6295, #6311, #6302 and #6300. In the code, every step of the path works: invitation link → one-button landing → reply → thank-you → save to account → the event on the guest's account → opens the Event Hub.

**What breaks first is the last step if "the app" means the native Setnayan iPhone app.** The app hides Google and Apple sign-in on purpose. Google refuses to sign in inside an embedded web view (`login-data.ts` `getClientShell`). The native sign-in was ruled for "before the Apple check" (DECISION_LOG 2026-09-30, "LINK AFTER THE REPLY… GOOGLE + APPLE SIGN-IN COME TO THE PHONE APPS") and has not been built. So a guest who saved with Google cannot open their event in the native app. Their only way in is "Email me a link to set a password" (#6300).

**Next risks, in order:**
1. The personal link landed on the Event Hub on Claire's phone. The cause was never proven. #6301 hardened the service worker and middleware, but nobody has checked it on a device.
2. A dead tap was recorded once in the Maker, on the RSVP row ("Questions · who can reply · reply by"). That was on build 5666406, before the Maker phone rebuild. It has not been re-checked since.
3. A home-screen shortcut on iPhone may keep its own cookies, so it can ask the guest to "Get inside" again.

**Before the rerun:**
- Ship #6308 first. You approved it, it is 1 check from green, and it moves "Save to my account" to Me. The script in §5 assumes it is live.
- Do not deploy during the test. A deploy mid-session showed `ChunkLoadError` on `/[slug]` twice.
- ⚠ **`birthday-salubong` does not exist in prod.** No event slug or name matches. The only test event is **maria-and-jose** (your account = couple, testnayan1 = coordinator). It has 32 seeded guests, all "attending", none with a mobile number. It has no RSVP settings, no schedule, no typed venues, and the Classic theme. So the test must add a fresh guest.

---

## 2 · Item table

Status = DONE · PARTLY · NOT DONE · SUPERSEDED · UNVERIFIED (needs a phone tap) · OWNER CALL · IN FLIGHT. Evidence is a greppable symbol or file in `apps/web` at 777cf8f.

| # | Item | Area | Status | Evidence | Blocks the test? |
|---|---|---|---|---|---|
| I1 | Landing before the reply has ONE button, "Reply to the invitation" | Invitation | DONE | `app/[slug]/invite/_components/landing-pre-reply.tsx` `LandingPreReply`; guard `the-landing-before-the-reply-has-one-button.test.ts` | no |
| I2 | One invitation, one account: "This event QR is already assigned to someone." | Guest flow | DONE | `lib/seat-binding.ts` `SEAT_HELD_ELSEWHERE`; `join/[eventId]/connect/confirm/held-elsewhere-door.tsx`; DB partial unique `event_members(event_id, guest_id)` | no |
| I3 | Invite pages wear the event's look | Invitation | DONE (#6301) | `app/[slug]/invite/_lib/wear-the-hub.ts` | no |
| I4 | Personal link opened the Event Hub on Claire's phone | Guest flow | PARTLY: hardened, cause not proven | `lib/guest-pass-hop.ts` (service worker + middleware step aside on pass hops); #6301 body says "Not reproduced" | **yes (risk)**: capture device evidence in the rerun |
| I5 | Couple's line under the names shows on the invite landing but is hidden on the Event Hub | Invitation | OWNER CALL | `heroLineWord` (one-line change if "hidden on hub = hidden everywhere") | no |
| I6 | "Save to my account" label matches the provider it opens | Guest flow | DONE (#6301) | `SAVE_METHOD_FIELD`, `saveMethodFromForm` | no |
| I7 | Google sign-in hung on "loading" | Guest flow | DONE (#6301) | `ProviderStall`; Save button `overlay={false}` | no |
| I8 | One quiet "add this event to your home screen" line, after a Yes only | Invitation | DONE (#6301) | `ShortcutLine`; `the-shortcut-line-is-on-the-thank-you-only.test.ts` | no |
| I9 | iPhone home-screen tile may not share Safari's cookies → asks "Get inside" again | Guest flow | UNVERIFIED (flagged in #6301) | #6301 body § 5 ⚠ | yes, if "the app" = the home-screen tile |
| I10 | Calm guest Event Hub: thank-you keeps ticket · Save my ticket · How to use it · Open the invitation · Change my reply; Save to my account / Copy my link / Your guests move to Me | Invitation | IN FLIGHT #6308 (owner approved 1A, DECISION_LOG 2026-10-03) | branch `rd/event-hub-calm` @ 7868ce364 | changes the script (ship first) |
| I11 | Story-tab placement: Columns → Camera (day) + Recap; 3D room → Welcome; keepsake reel → Recap; "Everything else" removed | Invitation | NOT DONE (waits for #6308, same files) | DECISION_LOG 2026-10-04; `everything-else-sheet.tsx` still on main | no |
| I12 | One guest-writes / couple-approves Guest Columns test on maria-and-jose | Guest flow | NOT DONE | DECISION_LOG 2026-10-04 (flag live since 2026-10-03 18:46Z) | no |
| I13 | RSVP notice email said the Papic footer | RSVP | DONE (#6301) | `lib/notification-email-reason.ts` | no |
| I14 | Theme fonts only half wired: body + script fall back to the app font on every theme | Invitation | NOT DONE | `app/globals.css` `[data-hub-theme=…]` sets only `--font-display` / `--font-mono` (0 `font-body`/`font-script` lines); `skins/site-skin.tsx` docblock "not wired… yet"; #6160 (one dropdown) merged but did not wire the roles | no |
| R1 | Reply heading "Will you celebrate with us?" | RSVP | DONE | `rsvp-widget.tsx` | no |
| R2 | Dead tap on the Maker's RSVP row ("Questions · who can reply · reply by") | RSVP / Maker | UNVERIFIED | `app_fault_issues` DEAD_TAP `/dashboard/[id]/launch · RSVPQuestions · who can reply · reply by`, last seen on 5666406; row label in `lib/maker-details-items.ts` case `'rsvp'` | **yes, if still dead** (the RSVP stage via Page ▾ is the second door) |
| R3 | No "Who can reply?" pop-up; How guests get in = 5 choices under List only · Accept · Open, set in Event Details | RSVP | DONE | commit 8d070964 "show the five guest-entry choices…"; d23/d24 in #6298 | no |
| R4 | Generic QR "We found you!" + last 4 digits of the mobile | Guest flow | DONE (only on an "Accept" event) | `lib/find-me.ts`, `join/[eventId]/find-me-actions.ts` `checkLastFour` | no. Test data: maria-and-jose guests have **no mobile**, so a found name goes to Requests. Add a mobile to the test guest |
| R5 | A list-only event takes no join request from any path | Guest flow | DONE (#6301) | `createJoinRequest` gate; `INVITATION_ONLY_LINE` | no. A generic-link test needs "Accept" switched on |
| R6 | A requester gets a "Request pending" ticket; declined → "Sorry, your request was not approved." | Guest flow | DONE | `app/[slug]/request/page.tsx` | no |
| G1 | A guest reaching `/dashboard/{id}` lands on the Event Hub, never a 404 | Guest flow | DONE (#6295) | `app/dashboard/[eventId]/layout.tsx` (`member_type === 'guest'` → hub) | no |
| G2 | The event appears in the guest's account | Guest flow | DONE | `dashboard/(account)/_components/autosurfaced-events.tsx` `fetchUserEvents(…, 'guest')`; `frontdoor/command-data.ts` | no |
| G3 | The reply's mobile/meal/dietary carry into a new account; first account's profile is prefilled | Guest flow | DONE (#6295) | `lib/link-guest-account.ts` "A FIRST-TIME ACCOUNT STARTS WITH ITS PROFILE FILLED" | no |
| G4 | Linked guest row shows the account's profile read-only + one-tap "Use this on your profile" | Guest flow | PARTLY | `guest-card-data.ts` `profileName`; no "Use this on your profile" string anywhere | no |
| G5 | Google + Apple sign-in inside the native iOS/Android app | Guest flow | **NOT DONE** | `login/_components/login-data.ts` `getClientShell` hides OAuth in the app; `apps/mobile` has no native auth; DECISION_LOG 2026-09-30 | **yes, if "opens in the app" = native app** |
| G6 | A Google-only account that types a password gets "Email me a link to set a password" | Guest flow | DONE (#6300) | commit 0a86b875 | no |
| G7 | In-app browser (Messenger/Viber) → "Open in your browser" | Guest flow | DONE | `copy-my-link.tsx` `OpenInBrowser`, `in-app-bar.tsx` | no |
| G8 | Deleting a guest ends their account link | Guest flow | DONE (#6302) | commit a8957164 | no |
| G9 | Guest list: search everything, every heading folds, white space opens the card, ⋯ menu on screen, delete warning true (song requests) | Guest flow | DONE (#6311) | commit 6d751616 | no |
| G10 | Copy a guest's personal invitation link | Guest flow | DONE (#6304) | `guest-invite-cell.tsx` "Copy invitation link"; `lib/invitation-link.ts` `invitationLinkOn` | no |
| G11 | Security follow-up: `restoreDeletedGuests` restores only really-deleted guests and takes `decided_by_vendor_profile_id`/`decided_at` from the server, not the client · `/nikah` login return path · flaky `session-budget.test.ts` | Guest flow | **NOT DONE** (no `rd/train-b-follow-ups` on origin) | `guests/groups-actions.ts` `restoreDeletedGuests`; `nikah/page.tsx` `redirect('/login')` | no. DECISION_LOG 2026-10-04 says it ships FIRST, on its own |
| G12 | Name parser keeps "Arnaldo M. Espinas" → middle "M." | Guest flow | OWNER CALL (default kept) | `lib/person-name-parse.ts` `parsePersonName` | no |
| M1 | Names + date typed in the Maker wait for Apply | Maker | DONE | `lib/hub-draft.ts` allow-list (`bride_name`, `event_date`); `details-your-event.tsx` `draftFactsFull` | no |
| M2 | Name style waits for Apply | Maker | DONE | `HUB_DRAFT_PRINT_DETAILS_KEY = 'name_style'` | no |
| M3 | Maker Venues are free text: no map pin, typed "City or area" | Maker | **NOT DONE** | `details-your-event.tsx` venue inputs + `City or area` `<input>`; `AddressPinField` used only in `new-manual-vendor-modal.tsx` (DECISION_LOG 2026-10-01 "THE MAKER'S VENUES GET A REAL PIN"; Lane-2 answers 2026-10-02: km only, contact optional) | no (guests get directions only from a typed address) |
| M4 | Venues still write LIVE inside the Maker ("Saves immediately") | Maker | NOT DONE | `HubSavesImmediately` beside the venue `SaveRow`; breaks DECISION_LOG 2026-10-01 "NOTHING TAKES EFFECT UNTIL APPLY" | no |
| M5 | The Maker Date has no time ("Ceremony at…" comes from the Schedule) | Maker | PARTLY | setup step B1 `arrive` writes `event_schedule_blocks` (`lib/hub-setup-steps.ts`); Your event › Date shows no time line | no (invitation shows no time on maria-and-jose: 0 schedule blocks) |
| M6 | Main background panel SAVES ON OPEN | Maker | DONE | `main-background-panel.tsx` `HeroFrameSync` + `heroFrameWrites` ("NEVER ON OPENING ALONE") | no |
| M7 | 🎨 → Upload media did nothing | Maker | DONE (#6237) | `main-background-panel.tsx` | no |
| M8 | Main background behind a bare 🎨 icon | Maker | SUPERSEDED by Look = Theme · Background · Font · Colours (#6299, commit 70400409) | — | no |
| M9 | Maker phone: strip too tall, two-row top bar, one card visible | Maker | DONE (#6297, approved frame G) | commits 3d7b7f44, 2ac1047f | no (verify on phone) |
| M10 | Theme picker shows "Samples · Maria & Jose" on every event (looks like someone else's theme) | Maker | NOT DONE | `maker-theme-picker.tsx` literal "Samples · Maria &amp; Jose" | no |
| M11 | Unexplained "1" badge on the Maker ⋮ | Maker | SUPERSEDED by the Maker in 4 toolbar (#6291) | re-check in the rerun | no |
| M12 | Old `/website/dress-code` page duplicates the Mood Board's dress code | Maker | NOT DONE | `website/dress-code/page.tsx` still routed; linked from `nikah-essentials-card.tsx`; DECISION_LOG 2026-10-01 "THE DRESS CODE IS SET IN THE MOOD BOARD" | no |
| M13 | "Finish your Event Hub" B1–B7 + "Locked — finish ___" + Home card + What's left | Maker | DONE | `lib/hub-setup-steps.ts` `HUB_SETUP_STEPS`, `lib/hub-setup-locks.ts`, `lib/home-first-screen.ts` `pickHomeNext` | no |
| M14 | "Before we start" screen 0 (already have ✓ · media that helps · information we'll ask · I'm ready / Start anyway) | Maker | PARTLY | only a one-card sentence in `pickHomeNext` (`guide.offer`); no screen, no "I'm ready" anywhere; approved design `prototypes/finish_your_event_hub_v2_2026-10-01_fable.html` frame 0 | no |
| M15 | "Finish your Event Hub" carries the main background (cover photo also sets Behind every scene) | Maker | NOT DONE | no background step in `lib/details-guided-flow.ts` / `hub-setup-steps.ts` (DECISION_LOG 2026-10-01 "…CARRIES THE EVENT HUB'S IMPORTANT PARTS") | no |
| M16 | Event Details = one sheet + button on Home; venue "Not set" / "Banquet hall" bugs fixed | Maker | DONE | `dashboard/[eventId]/details/page.tsx` (title "Event Details", venues from `pickVenueBookingRows`); `home-first-screen.tsx` | no |
| M17 | Name clash: Maker "Details" vs Event Details | Maker | SUPERSEDED: "Event Details" everywhere (commit b4ea706f, d15) | — | no |
| M18 | A `?item=date` link opened Names (last viewed) | Maker | UNVERIFIED | `details-workspace.tsx` item ↔ address effect | no |
| M19 | One font dropdown | Maker | DONE (#6160 merged) | — | no |

---

## 3 · The build list, PR-sized, for Opus builders

Order: what blocks or shapes the test first. **∥** = can run in parallel (no shared files). **⏸6308** = must wait until #6308 merges (same guest Event Hub files: `app/[slug]/page.tsx`, `_components/site-body.tsx`, `guest-me.tsx`, `everything-else-sheet.tsx`, `invite/enter/page.tsx`, `lib/guest-landing.ts`).

### B0 · Ship #6308 (calm guest Event Hub). Controller task, not a builder.
- **Why first:** you approved it (DECISION_LOG 2026-10-03 "#6308 EVENT HUB CALM — BOTH DESIGN DIFFERENCES APPROVED"). It moves "Save to my account" to Me, so the rerun script depends on it.
- **Do:** wait for its last pending check, then train c, the independent audit, deploy, and confirm `/api/health`.
- **Verify:** the thank-you after a Yes shows ticket · Save my ticket · How to use it · Open the invitation · Change my reply. "Save to my account" shows on Me only.

### B1 · Security follow-ups from the train-b audit. ∥ (guests/actions files only, not #6308's)
- **Ruling:** DECISION_LOG 2026-10-04 "SECURITY FIX SHIPS FIRST". It goes live on its own, before train c.
- **Files:** `app/dashboard/[eventId]/guests/groups-actions.ts` (`restoreDeletedGuests`: restore only rows whose `deleted_at` is set; drop the client-supplied `decided_by_vendor_profile_id` / `decided_at`, so the server keeps the stored values), `guests/_components/guest-delete.tsx`, `app/dashboard/[eventId]/nikah/page.tsx` (`loginRedirectPath`), `lib/supabase/session-budget.test.ts` (make the wall-clock assert robust; never skip).
- **Verify:**
  - a forged restore payload changes nothing (unit/db test, sabotaged once);
  - Undo after a delete still puts back the guest and their song requests;
  - `/dashboard/<id>/nikah` signed out → login → back to `/nikah`.

### B2 · RSVP row: verify the tap, fix it if dead. ∥
- **What:** controller first, at 375 px on maria-and-jose: Maker → Event Details → the RSVP row. It must open the RSVP editor in under 1 s. If it does, close the item. If it is still dead, build the fix.
- **Files if dead:** `launch/_components/maker-details.tsx`, `details-workspace.tsx`, `lib/maker-details-items.ts` (`'rsvp'` case), `maker-rsvp-ask.tsx`.
- **Design:** the approved frame G Maker (`prototypes/maker_in_four_2026-09-30_fable.html`, DECISION_LOG 2026-10-03 "MAKER PHONE BARS = THE APPROVED DESIGN").
- **Verify:** a render guard that the row is a control that opens `maker-rsvp-ask`; no new DEAD_TAP row in `app_fault_issues` after a tap.

### B3 · Native app sign-in: Sign in with Apple (native sheet) + Google through the system browser, returning by app link. ∥ (Mac; touches `apps/mobile`, `app/auth/*`, `lib/request-platform.ts`, `app/login/_components/login-data.ts`, `app/_components/native-bridge.tsx`)
- **Ruling:** DECISION_LOG 2026-09-30 "…GOOGLE + APPLE SIGN-IN COME TO THE PHONE APPS BEFORE THE APPLE CHECK". Apple guideline 4.8: offering Google requires Sign in with Apple.
- **Blocks the test** only if "opens in the app" means the native app (owner decision 1).
- **Verify:**
  - iOS simulator: Continue with Apple → native sheet → signed in inside the app;
  - Continue with Google → system browser → back in the app, signed in;
  - an invitation saved with Google on Safari then opens in the app under the same account.

### B4 · Maker › Your event: venues get a real pin + a picked city, venues wait for Apply, Date shows the time. ∥ (one file family: `launch/_components/details-your-event*.tsx`)
- **Status (2026-10-04):** BUILT on `rd/maker-venues-pin-and-time` (draft PR #6327) — DECISION_LOG 2026-10-04 "B4 BUILT — VENUES GET A PIN AND A PICKED CITY…". Waits on checks + owner merge.
- **Rulings:** DECISION_LOG 2026-10-01 "THE MAKER'S VENUES GET A REAL PIN AND A PICKED CITY", 2026-10-02 "LANE 2 (VENUES & LOCKS) — THE OWNER'S ANSWERS" (km only, contact optional, locked first then typed name), 2026-10-01 "NOTHING TAKES EFFECT UNTIL APPLY".
- **Reuse:** `AddressPinField` (`dashboard/[eventId]/_components/address-pin-field.tsx`) and the onboarding place pick (`onboarding/wedding/_components/location-step.tsx`, `_data/wedding-cities` `resolvePick`); no new geocoder or map.
- **Venues → hub draft:** extend the `HubDraftEvents` allow-list narrowly; remove `HubSavesImmediately` from the venue row.
- **Date:** add the ceremony time line, typed in place into the same Schedule block that `print-set.server.ts` `blockTime(ceremony)` reads, also through the draft.
- **Design:** none drawn beyond the DECISION_LOG row. Controller gives the owner a 2-frame Fable sketch before the build ("Design check with owner → build").
- **Verify:**
  - pin set → guest "Directions" uses it;
  - the reception pin refreshes `events.venue_latitude/longitude`;
  - typing a venue writes no `events` row before Apply (db-test);
  - the invitation reads "Ceremony at 3:00 PM" after Apply.

### B5 · Theme fonts: all four roles wired (heading · body · labels/buttons · script) on all 10 themes. ∥ (`app/globals.css` theme blocks, `lib/invite-themes.ts` `fonts`, `app/[slug]/_components/skins/site-skin.tsx`)
- **Status (2026-10-04):** BUILT on `rd/look-fonts-and-buttons` (draft PR, with Look › Buttons). Ten spec faces not in the repo are worn through shipped stand-ins pending the owner — DECISION_LOG 2026-10-04 "LOOK › BUTTONS + B5 THEME FONTS — BUILT".
- **Rulings:** handoff §1 "THEME FONTS ARE ONLY HALF WIRED"; spec row A-Hub "Fonts: Header ▾ · Text ▾ · Accent ▾".
- **Watch:** the shared bundle (~0 B spare). Fonts load per theme, never in the shared chunk. Measure `check-bundle-size` before and after.
- **Verify:**
  - on a Luxe test page, paragraphs, RSVP questions and buttons render in the theme's body face, not Hanken Grotesk (computed style);
  - `lib/invite-themes.test.ts` extended to fail if a theme block lacks `--font-body`/`--font-script`.

### B6 · "Finish your Event Hub": the full "Before we start" screen + a background step + the theme-picker label. ∥ (`lib/home-first-screen.ts`, `app/dashboard/[eventId]/_components/home-first-screen.tsx`, `lib/hub-setup-steps.ts`, `lib/details-guided-flow.ts`, `launch/_components/details-workspace.tsx`, `launch/_components/maker-theme-picker.tsx`)
- **Rulings:** DECISION_LOG 2026-10-01 "THE EVENT HUB SETUP OPENS WITH 'BEFORE WE START'", "…CARRIES THE EVENT HUB'S IMPORTANT PARTS — THE MAIN BACKGROUND INCLUDED".
- **Design:** `prototypes/finish_your_event_hub_v2_2026-10-01_fable.html` frame 0 (already-have line · media that helps · information we'll ask · I'm ready / Start anyway).
- **Background step:** the cover-photo step writes the same `saveMain` / hub draft as Look › Background (one setting, two doors).
- **Theme picker label:** "Samples · Maria & Jose" → plain words (e.g. "Each theme on a sample Event Hub"); never another couple's names on this event.
- **Verify:**
  - a new event shows frame 0 once and "Start anyway" goes to step 1;
  - the background step and Look › Background show the same value;
  - the Maker first load stays ≤517,120 B.

### B7 · Remove the old `/website/dress-code` page (replace means remove). ∥
- **Ruling:** DECISION_LOG 2026-10-01 "THE DRESS CODE IS SET IN THE MOOD BOARD".
- **Do:** move `DressCodeListsForm` / `dress-code-fields` under `studio/mood-board`; `lib/legacy-redirects.ts` forwards `/website/dress-code` → the Mood Board; repoint `nikah-essentials-card.tsx` and the `role-name-actions.ts` revalidate.
- **Verify:** the old address 308s to the Mood Board; the Root map shows no screen with no way in; the dress code still saves from the Mood Board.

### B8 · Story-tab placement + Guest Columns test. ⏸6308
- **Ruling:** DECISION_LOG 2026-10-04 "STORY-TAB PLACEMENT CORRECTED AND APPROVED".
- **Moves:** "Write a column" → Camera on the day + Recap after · "Walk the room in 3D" → Welcome on the day · "Your keepsake reel" → Recap · delete "Everything else" (`everything-else-sheet.tsx`, `everything-else-rows.ts`).
- **Files:** `app/[slug]/_components/site-body.tsx`, `guest-column-card.tsx`, `app/[slug]/_lib/stage-bar.ts` consumers.
- **Verify:**
  - each card renders once, in its new tab only;
  - then the controller runs one Columns test on maria-and-jose (guest writes → couple approves → shows).

### B9 · Linked guest row: "Use this on your profile". ∥ (guests card files; wait for B1 if both touch `guest-card-*`)
- **Ruling:** DECISION_LOG 2026-09-30 "A GUEST ROW LINKED TO AN ACCOUNT SHOWS THE ACCOUNT PROFILE'S DETAILS".
- **Status:** read-only profile shows (PARTLY); the one-tap copy of the event's formal name into the person's profile is not found.
- **Verify:** on a linked row, one tap updates the profile's formal name and nothing else.

**Parallel map:**
- Run any time, side by side: B1 · B2 · B3 · B4 · B5 · B6 · B7.
- B4 and B6 do not share files, but both touch the Maker budget. Build one at a time on the Mac (heavy lock).
- B8 waits for #6308.
- B9 waits for B1.
- #6315 (People with access) touches Event Details. It does not overlap any build above except possibly B6's Home card. Rebase whichever lands second.

---

## 4 · Owner decisions (with recommendations)

1. **In the rerun, does "opens in the app" mean the native Setnayan app or the phone browser / home-screen shortcut?**
   **Recommend the phone browser (Safari/Chrome) today.** The native app has no Google/Apple sign-in yet (B3). Build B3 before the Apple check, then rerun step 5 in the app.
2. **Couple's line under the names:** it is hidden on the Event Hub but shown on the invite landing.
   **Recommend: "hidden on the Hub = hidden everywhere".** One switch per fact; a one-line change in `heroLineWord`.
3. **Rerun before or after #6308?**
   **Recommend after.** Ship the security fix (B1) alone, then #6308 in train c, then rerun. Then guests see the approved layout and you are not testing a screen that changes tomorrow.
4. **The name parser keeps "Arnaldo M. Espinas" → middle "M."** (an initial with a period).
   **Recommend keep.** That is how your real rosters write middle initials.
5. **A test event for non-wedding:** `birthday-salubong` does not exist in prod.
   **Recommend creating one birthday test event** from the account that owns maria-and-jose before the next walk-through, so the run isn't wedding-only. This rerun uses maria-and-jose.

---

## 5 · Rerun test script (maria-and-jose · never cale-ice)

**Before you start:** the controller confirms prod = the build with #6308 (or 777cf8f if decision 3 is "now") and promises no deploy during the test.
- **Phone A** = your phone, signed in as the couple.
- **Phone B** = the second person's phone. It starts signed out, with no Setnayan account, or an account that has never held a maria-and-jose seat.

### Part 1 · The couple sets it up (Phone A)
1. Open **setnayan.com** → your events → **maria-and-jose**. ✅ Home shows the event, an **Event Details** button beside the name, and one "next" card.
2. Bottom bar **Hub** → the Event Hub Maker opens. ✅ One row at the top (× · Page ▾ · Apply) and one at the bottom (Look · Event Details · Undo · ⋯). The page preview fills most of the screen. No floating "1".
3. **Event Details** (bottom bar) → **Your event** → **Names**: change one letter. ✅ "Saved — guests see it when you Apply". Change it back.
4. **Venues** → type a reception name and street address. ⚠ Known gap: no map pin yet (B4), and it saves live.
5. Still in Event Details → tap the **RSVP** row ("Questions · who can reply · reply by"). ✅ The RSVP editor opens within a second. ❌ If nothing happens, screenshot it (B2). Pick meal + allergies + plus-one. Set **Reply by** to a date in November.
6. **Look** → **Theme** → pick **Modern** (free). ✅ The page changes at once. Tap **Apply** → ✅ it says applied and the count goes to 0.
7. Back to the app → **Event Details** (Home button) → **How guests get in**. ✅ One dropdown grouped List only · Accept · Open. Leave it on **List only · Guests reply** for now.
8. Bottom bar **Guests** → round **+** → type a test guest's full name (e.g. "Test Guest Bea"), add their **mobile** (Phone B's number) → save. ✅ The row shows "No reply".
9. Tap the row's **Invite** → **Copy invitation link** → paste it to Phone B in Messenger or Viber. ✅ The copy says copied; the row is NOT marked sent by copying.

### Part 2 · The guest replies (Phone B)
10. Tap the link in Messenger. ✅ The couple's names, the greeting card in the Modern look, ONE button "Reply to the invitation", and a faded ticket picture. ❌ If you see the Event Hub or "Get inside" instead, that is the Claire bug (I4): screenshot it, note the app/browser, and tell the controller the time.
11. Tap **Reply to the invitation**. ✅ Questions come one at a time: "Will you celebrate with us?" → **Yes** → meal, allergies, plus-one → send.
12. ✅ The thank-you shows the ticket, **Save my ticket**, How to use it, Open the invitation, Change my reply, and one quiet line "Keep it handy — add this event to your home screen". If inside Messenger, tap **Open in your browser** first.
13. In Safari/Chrome go to **Me** → **Save to my account** → the button names the provider (Apple on iPhone, Google on Android). Sign in. ✅ You come back to the event, saved.
14. Optional: on a third account, open the same personal link and try to save it. ✅ "This event QR is already assigned to someone."
15. Open **setnayan.com** (signed in on Phone B). ✅ maria-and-jose shows among their events. Tap it. ✅ The Event Hub opens (not a dashboard, not an error).
16. "Opens in the app", per decision 1:
    - **Browser route:** Share → **Add to Home Screen** → open the tile. ✅ The event opens with the couple's icon. ⚠ If it asks to "Get inside", that is the iPhone cookie limit (I9); note it.
    - **Native app route:** sign in with email. A Google-only account must tap "Email me a link to set a password" first (G5/B3).

### Part 3 · The couple sees it (Phone A)
17. **Guests** → the test guest's row reads **Attending** with their answers; open the card. ✅ It shows they are linked to an account.

### Part 4 · The generic link / QR (both phones)
18. Phone A: **Event Details** → **How guests get in** → **Accept · Guests reply**. Then **Guests** → **Share the link**. Copy the link, or open the invite page's QR on screen.
19. Phone B, in a private tab (signed out): open the link or scan the QR → type the test guest's name exactly as listed. ✅ "We found you!" → type the **last 4 digits** of the mobile from step 8 → ✅ in as that guest (their own invitation).
20. Phone B: type a name that is NOT on the list → ask to join. ✅ A "Request pending" ticket. Phone A: **Guests** → **Requests** → **Keep** → ✅ Phone B's ticket unlocks on refresh.
21. Phone A: set **How guests get in** back to **List only · Guests reply**. ✅ Phone B's generic link now says "This event is by invitation only — ask the hosts for your link."

### Clean-up
Delete the test guests (card → Delete; the warning lists what goes with them) and the requester. The controller checks `app_fault_issues` for any new rows from the test window and sends you pass/fail per step.
