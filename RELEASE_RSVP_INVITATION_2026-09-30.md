# RSVP + Invitation release — live before Oct 1 (plan, 2026-09-30)

> **OWNER DATES (2026-09-30, verbatim): "Oct 1 release of RSVP and INVITATION · Oct 3 THE DAY and POST EVENT".**
> Oct 1 = everything in the table below. Oct 3 = each tab its own full page (Invitation + The Day, reusing hub-shell) · The Day menu Live · Welcome · Camera · Gallery · Me · Post Event (train n #6166 / #6156 scene styles + Post Event, fixed and re-checked). Profile and Name style ride alongside when they don't risk Oct 3. **Sequence to Tue 6 Oct (owner, 7 steps): 1 RSVP + Invitation + what they depend on (Oct 1) → 2 The Day + Post Event (Oct 3) → 3 the rest of the Event Hub incl. SPEED → 4 the rest of the site incl. suppliers + purchases → 5 Admin fixes → 6 adaptation to all event types + religions → 7 Apple check.**


Owner, verbatim: *"we really need to release RSVP before Oct1"* · *"our build needs to be safe for releasing RSVP"* · *"this means we need to fix both RSVP and Invitation"*.

## 🗓 BUILD SEQUENCE ACROSS THE THREE ACCOUNTS (owner, 2026-09-30: three 20x accounts — resets Thu 2 AM, Sun 2 AM, and this one [usage page: Tue 6 Oct 10 PM; owner said Wed 10 PM])
ONE controller at a time. Switch at ~97% or at the reset; hand off with make-handoff.sh + this file + CURRENT-STATE.md.

| When | Account | Work |
|---|---|---|
| Wed 30 Sep → Thu 1 Oct 2 AM | **this one** (39% left) | Midnight batch (#6191 #6194 #6195 #6196 #6197 #6198 #6199 #6201 #6202 + E/F1/More Services if green) · Maker core 1–2 progress · handoff 1:17 AM |
| Thu 1 Oct | **Thu-2AM account (fresh)** | Finish step 1: E #6192 → F2 (search, Hosts fold, first-visit "Who can reply?") · Profile (cloud) · face tagging + rescan if not shipped · ship Maker core 1 (instant) · Try first, pay at Apply · #6159 public events |
| Fri 2 Oct | Thu account | Maker core 2 (tap-to-type) + 3 (simpler layout) · event onboarding part 1: engine + Wedding + simple types (Birthday · Hangout · Date · Get-together) + roles/groups per type |
| Sat 3 Oct | Thu account | **Step 2 due:** The Day + Post Event walk-through on a test event · onboarding part 2: Wake + Corporate · venue styles (Fable → build) · rebase + ship font dropdown #6160 · Both view #6164 · palette styles · Mood Board supplier edits |
| Sun 4 Oct | **Sun-2AM account (fresh)** | Onboarding part 3: the remaining types · "Finish your Event Hub" fallback card · wording/tone sweep per type · step 3 wrap-up |
| Mon 5 Oct | Sun account | **Step 4:** ship held PRs (#6175 dropdowns+tours · #6179 dead ends · #6180 supplier paywalls · #6162 Partner · #6161 Patiktok) · Lane 2 (demo shops migration · /vendors → /for-suppliers · region pages) · purchases/checkout review |
| Tue 6 Oct | Sun account | **Step 5** admin audit + fixes · **Step 6** every event type + religion audit · Google + Apple sign-in in the iOS/Android apps · final walk-through |
| Tue 6 Oct evening → Wed 7 Oct | this account (fresh after its reset) | Buffer for anything that slipped · **Step 7 Apple check** (owner + iPhone) |

**Cloud credit:** the Thursday and Sunday accounts each have $250 of cloud-session credit — CLAIMED by the owner 2026-09-30 evening — ~7 self-contained builds each. Use it for: onboarding parts (per type), venue styles, rebasing + finishing the held step-4 PRs, Lane 2 (demo shops, /for-suppliers, region pages), the admin audit + fixes, the event-type/religion sweep. Keep ON THE MAC: release trains, security/database/face work, and anything touching the Maker budget. The controller writes each cloud prompt into CLOUD_PROMPTS_*.md; the owner pastes it.
Rules: ≤3–4 builders at once (16 GB Mac, one heavy lock) · merge only through green CI + auto-merge · deploy database changes in quiet hours · each day ends with a batch + a phone walk-through · cloud credit (~$56) only for self-contained builds.

## ✅ CHECKLIST BY STEP (updated 2026-09-30 evening — the one list to read)

**Step 1 · RSVP + Invitation (+ the parts they depend on)**
- [x] Oct 1 release (#6181): tickets, no email, no maybe, venues, dress code, seats on the day, Best Woman/renames, wrong-account fix, round QR, RSVP stage, Page ▾ — LIVE
- [x] Text fixes #6183 · Invite column (sends the Digital Ticket) #6185 · "We found you!" generic QR #6184 — LIVE
- [x] A · guest landing page (Fable) #6186 — in ABC train #6193, deploying
- [x] Pairing fix #6189 — in #6193
- [ ] Name style + Prefix dropdown + Live Studio #6194 (owner picks applied) — next batch
- [ ] Face tagging rules (Papic-only, selfie on the day, erase on log out / Papic close, end-of-event rescan, account reuse switch) — building here
- [ ] #6191 Access column + Hosts out of the menu — being brought up to main
- [ ] E · Guest card + Guest list redesign (full width, header dropdowns, Access/Check-in) — building in the cloud
- [ ] F1 · Hosts pieces outside E's files — building here · [ ] F2 · top-bar guest search, Hosts onto the card, parts row removed — after E merges
- [ ] Reply heading wording aligned ("Will you celebrate with us?")

**Step 2 · The Day + Post Event (Oct 3)**
- [x] B · auto-seat #6188 — in #6193, deploying
- [x] C · Post Event + scene styles #6187 — in #6193, deploying
- [ ] D · each tab its own page + The Day menu + Welcome on the day — building here
- [ ] Ticket seat on the day + "ticket updated" pop-up — in A ✅ (verify on the day rule)

**Step 3 · The rest of the Event Hub incl. speed**
- [ ] Maker core part 1: instant editing + faster Love Story & Programme editors — next slot
- [ ] Maker core part 2: tap-to-type + Wording ▾ + Format ▾
- [ ] Maker core part 3: simple top menu + one-pick theme
- [ ] Rebase + ship: font dropdown #6160 · Both view #6164 · palette styles (paused branch)
- [ ] Venue styles (3; Fable draws first) · Mood Board supplier edits beyond colour · Profile (linked profile, first account filled) · Try first, pay at Apply

**Step 4 · The rest of the site incl. suppliers + purchases**
- [ ] Ship held: #6179 dead ends · #6175 dropdowns + tours · #6180 supplier paywalls (owner OK'd) · #6162 Partner · #6161 Patiktok · #6159 Discover
- [ ] Lane 2: demo shops is_demo (migration) · /vendors → /for-suppliers · region supplier pages
- [ ] Purchases / checkout review

**Step 5 · Admin fixes** — [ ] audit first
**Step 6 · Every event type + religion** — [ ] audit first · [ ] Google + Apple sign-in in the apps
**Step 7 · Apple check** — owner + iPhone

## The rule
One release that carries ONLY RSVP + guest Invitation work. Everything else is held (label `do-not-auto-merge`, auto-merge off) until this is live and walked through. After it is live: **freeze the guest pages** while friends reply — new findings go on a list, not into prod.

## In the release (PR · what the guest sees)
| # | Item | PR / branch |
|---|---|---|
| 1 | No email to guests; digital tickets; requester gets a pending ticket; thank-you | #6157 `rd/owner-answers-0929` |
| 2 | Yes / No only — no "maybe" | #6167 `rd/rsvp-no-maybe` |
| 3 | Sponsor names: no role under every name; secondary sponsors grouped; pairs on one line | #6165 `rd/entourage-no-repeated-role` |
| 4 | Home-screen card removed; camera terms = small card | #6168 `rd/no-home-screen-card` |
| 5 | Digital ticket on **Me** only; Home loses the pass, keepsake, summary card, "Need to change your reply", scan-trail notice (opt-out moves into Your details) | `rd/hub-shows-the-ticket` (building) |
| 6 | Seat plan only on the event day; no table on the ticket; no "Find your seat" before the day | `rd/seats-show-on-the-day` (building) |
| 7 | A login never grabs someone else's seat; sign-out clears the guest cookie; safe Unlink | `rd/seat-links-only-on-purpose` (building) |
| 8 | Dress code: couple can hide the outfit figure; Do's & Don'ts editable in place | `rd/dress-code-figure-toggle` (building) |
| 9 | Best Woman · either-or honour attendants · rename roles (Bride's Crew / Groom's Crew) | `rd/best-woman-matron` (building) |
| 11 | Maker: **Page ▾ Home · Details · Story · Me** dropdown at the top of the navigator (jumps, never filters) so the couple fixes each guest page — Maker only, guests unchanged | `rd/maker-page-dropdown` (building) |
| 12 | Venues: name/address/buttons readable (≥4.5:1); venue photo from the booked supplier's own photos (couple picks, cover by default), manual upload if none; address already from the supplier | `rd/venue-cards-readable-with-photos` (building) |
| 13 | Custom QR: a round QR sits in a ROUND slot on every print + ticket (never a square frame round a round QR) | `rd/round-qr-round-slot` (building) |
| 14 | Every guest's QR ready: every guest row has a token; ticket QR uses the event's QR look and decodes to that guest | in `rd/hub-shows-the-ticket` |
| 15 | Invitation **Home** = the guest's own page: their Mood Board look · Reminders (couple-set) · E-Gifts shown now | `rd/invitation-home-is-personal` (building) |
| 10 | Invitation text fixes from the guest-side audit (list: scratchpad `invite-audit/REPORT.md`, "blocks sending" + "should fix" only) | one small PR after the audit |

## Held until after the release
Train n #6166 (event menu + scene styles/Post Event) · #6160 font dropdown · #6164 Both view · #6162 Partner + handshakes · palette styles · #6161 Patiktok · #6159 Discover · all Maker re-plan lanes (start ~11:30 only once this is verified).

## Order
1. Builders finish → each PR green on its own.
2. ONE train branch folding 1–10, baseline regenerated once, ONE CI run.
3. Auto-merge only after every check passes (never --admin) → deploy (`deploy-prod.yml`) → confirm the version on `/api/health`.
4. Phone walk-through (390 px) on the TEST wedding `cc47d373-…` — never the owner's real one: guest opens the link → finds their name → fills details (+1s) → gets the digital ticket → connects an account; couple uses Send invite / Copy message. Timed, with pictures.
5. Owner sends. Freeze.

Target: live ~10:00 AM 30 Sep PHT; hard limit before 1 Oct.

## After the release (in this order)
1. **Profile** — a guest row linked to an account shows that account's profile (read-only); one tap copies the event's formal name into the person's profile; a first account made from an invitation starts with its profile filled.
2. **Name style ▾** — Full · Middle initial · Surname first (DECISION_LOG "THE COUPLE PICKS A NAME STYLE").
3. **Themes** — theme sets background + fonts + colours (Lane C) · one font dropdown #6160 · palette styles · venue styles (3: Photo card · Full photo · The journey — prototype first).
4. **Maker core** — Lane A structure + Lane B stage editing (instant by design), then Invitation → The Day → Post Event stages.
5. **Mood Board** — supplier can alter every detail (extend MB16 grants beyond colour).
6. **The Day menu** — Live · Welcome (their table, look, reminders, E-Gifts) · Camera · Gallery · Me (DECISION_LOG "THE DAY'S MENU HAS FIVE").
0. **FIRST after the release — each menu tab is its own full page** (Invitation + The Day), reusing `hub-shell.tsx` (DECISION_LOG "EACH MENU TAB IS ITS OWN FULL PAGE").
7. **Before the Apple check:** Google + Apple sign-in in the iOS/Android apps (native Apple sheet; Google via system browser + app link). "Save it to your account" on Me offers Google/Apple one-tap.
8. **Oct 3 (The Day):** ticket shows the seat from the event day; a new/changed ticket pops up first with Save my ticket (DECISION_LOG "THE TICKET GAINS THE SEAT ON THE DAY").
9. **Right after the release (first):** the guest landing page (DECISION_LOG "THE PERSONAL LINK OPENS THE GUEST'S OWN LANDING PAGE"), then generic-QR "We found you" + last 4, then the Guest list Invite column + tour.
10. **Oct 3:** auto-seat — principal sponsors one table, both families one table, then groups (DECISION_LOG "AUTO-SEAT: SPONSORS TOGETHER").
11. **Step 3 (queued from DECISION_LOG "THREE OF THE CONTROLLER'S OPEN QUESTIONS ANSWERED"):** Panood's plain name = **Live Studio** ("Watch Live" ok for the guest watch page) — rename in UI copy; remove the separate **Logo Maker** menu row (it lives inside the Event Hub Maker). Seat plan on the day = already shipped in the Oct 1 release (#6169, switch "Show guests their seats early").
12. **Step 4 (from DECISION_LOG "LANE 2 §2C — ALL FIVE OWNER QUESTIONS ANSWERED"):** SetnaProd + Saysay → is_demo=true via a data migration through the pipeline (never a direct prod write; Discover Shops shelf + marketplace go empty until a real supplier joins) · legal pages keep "vendor" · /vendors → /for-suppliers with a permanent redirect · region supplier pages under the ≥3 cards / ≥2 shops rule · (owner) Setnayan-specs → private — check cloud sessions can still read it.
13. **Thursday batch (step 4 start):** #6159 public events (Concert · Open house · Grand opening; Get tickets; Public → Ask to join) — GREEN at ad6e67003, 2 migrations; regenerate baselines when folding.
14. **Event onboarding build (approved concept):** essentials + type steps + Yes/No list; per-type styling; five new event-type profile fields; roles + groups per type; quiz → Setnayan AI. Likely on the new account after Maker core.
15. **Cloud 3 (this account, ~$37):** Lane 2 — demo shops is_demo migration · /vendors → /for-suppliers · region supplier pages (branch rd/lane-2). Started 2026-09-30 evening; fold into the next batch when green. (So G4 in CLOUD_PROMPTS_OCT1_2026.md is ALREADY RUNNING — don't start it again.)
