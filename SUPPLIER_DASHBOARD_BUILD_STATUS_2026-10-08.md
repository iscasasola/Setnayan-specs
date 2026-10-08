# Supplier dashboard build — status (builder S, 2026-10-08)

Plan: `SUPPLIER_DASHBOARD_REDESIGN_2026-10-08_fable.md` § 6 · prototype `prototypes/supplier_dashboard_2026-10-08_fable.html`.
Worktree `~/Documents/Claude/Projects/wt-supplier-dash` · base `origin/main` 9b2065225. Scope of this session: **S-PR0 then S-PR1 only.**
Updated after every item. Newest state at the top of each section.

## S-PR0 · foundations — `rd/supplier-foundations` · PR #6443 (draft · do-not-auto-merge · auto-merge off) · head `0f799a4cf`

| Item | State |
|---|---|
| `SupplierThumbRow` (frosted `sn-glass-row`, portalled, slides in/out, one fit state, field ≥ 60 %) | DONE — component + CSS module; not mounted on a supplier page yet (People/Dates/Money/customer/Services/Page/Event Hub mount it in their PRs) |
| `SupplierSubmit` (a form's submit through the button rule: `SubmitButton` + `actionButtonClass`) | DONE |
| Shell: envelope + avatar | DONE — `UnreadMessagesBadge` added to the supplier cluster (seeded from the messages count the layout already reads); the avatar (`AccountSwitcher`) was already there; the bar names the shop. **Bell kept** (deviation 1) |
| Tour keys `vendor_shop_v1`, `vendor_hub_v1` | DONE — registered, one slide each, prototype's words; NOT mounted (mount with S-PR6 / S-PR11) |
| Guard: no bare `<button>` in swept supplier files, per component, count printed | DONE — `app/vendor-dashboard/every-supplier-action-is-a-button.test.ts` |
| `/dev/supplier-lab` (no session, 404 in production) | DONE — thumb-row states `?thumb=people|customer|money` |
| tsc (full, heavy lock) | 0 errors |
| root lint | 0 `Error:` |
| tests pinning touched files | 386 pass / 0 fail |
| sabotages | 7 seen red, restored (list in the PR body) |
| server actions | 1,199 → 1,199 |
| side-by-side at 375 | TAKEN — `prototypes/supplier-dashboard-built-2026-10-08/S-PR0-03-thumb-people` · `-05-thumb-money` · `-06-thumb-customer` (prototype left · built right). ⚠ All three predate the fit fix below; `-06` shows the fault |
| **Fault found on the side-by-side, fixed (`0f799a4cf`)** | the fit pass never ran — `useFitRow` was called in the shell that renders null before mount, so four buttons overflowed and the last was cut at "Ca". The fitted inner row is its own component (`ThumbFit`); guard + sabotage seen red. **NOT re-captured** (the heavy lock went to a production-incident fix) |

### Deviations (S-PR0)
1. **Bell kept beside the envelope.** Prototype shell = envelope + avatar; the notification list's new home (Settings › Notifications › Recent) is S-PR9. Removing the bell now leaves unread notifications with no badge, and `one-top-bar.test.ts` holds the bell on every signed-in tree. Recommend: remove in S-PR9.
2. **Shop name shows from 640 px up**, not at 375 — the top bar is the one shared bar; the supplier owns only its cluster. Recommend: an owner call at S-PR9/10 (shared-shell change).
3. **Sweep list = the two new files.** Existing `_components` files are converted by the PR that redraws their page (each needs its own side-by-side).
4. **The whole strip is frosted edge to edge** (the couple's Guests row, copied); the supplier prototype frosts only the field and the grey buttons. Recommend: owner look; one class to move.

### Owed (S-PR0)
- Re-capture `/dev/supplier-lab?thumb=customer|people|money` at 375 after the fit fix (a short lock hold).
- CI's typecheck on `0f799a4cf` (the full local tsc, 0 errors, ran on the first commit).

## S-PR1 · Today — `rd/supplier-today-rows` (on S-PR0) · PR #6450 (draft · do-not-auto-merge · auto-merge off · base `rd/supplier-foundations`) · head `4c5dffa80` — BUILT, PUSHED

Checks: root lint 0 `Error:` · tests mentioning any changed file 480 pass / 0 fail (supplier set on the final tree: 137 / 0) · 21 ci.yml node guards green · server actions 1,199 → 1,199 · no migration · 13 sabotages seen red and restored (PR body) · 375 px: 5 side-by-sides + 5 built-only states, 0 px sideways overflow, 0 page errors (`prototypes/supplier-dashboard-built-2026-10-08/S-PR1-*`).
⚠ **Full `tsc` ran once on this tree and found 4 errors, all fixed; it was NOT re-run** after those fixes and three small commits — the controller gave the heavy lock to a production-incident fix and swap was at 8.3 of 9.2 GB. CI's typecheck on `4c5dffa80` is the gate.
The dev server used for the shots ran with placeholder Supabase values (`https://example.supabase.co`, a dummy key) and the worktree holds no `.env.local` — it could not reach the production database. Lock held 06:05:43–06:19Z (13½ min, one hold); released on the controller's instruction.

| Item (plan row S-PR1) | State |
|---|---|
| Also-waiting list replaces `#today-all` | DONE — `#today-all` and "Everything else" are gone. One hairline row per remaining ask (`label · one line · "2 of 3" · ⌄`). **Each row opens its answer IN PLACE** (the shipped forms, unchanged) instead of linking to the customer card — deviation 1 |
| Banners deleted (rules live in `pickSupplierNext`) | DONE where a rule exists; kept as rows where it does not — table below |
| Event-day dark card | DONE — the Next card goes ink, title = the event, **Run the day** (brand) + **Chat** (grey, the event's thread). The three event-day numbers (waiting · next moment · checked in) and the "Also today" rows are NOT built — deviation 4 |
| Honest money number | DONE — "to come in"; an unread payday says "couldn't load" in the number's place (was a bare "—" over "owed to you"). The first number ("waiting on you") says "couldn't load" too when the desk could not be read and found nothing; "2+" when a short read found two |
| Toast for outcome notices | DONE — `SupplierToast`: the three notices (booking answer · date answer · payment-never-arrived) are one dark pill above the bottom bar; drawn by the server first (works with JavaScript off), then floats; a refusal never leaves by itself |
| NextCard: "1 of 3" + grey second + tones | DONE — counter top-right; Reply = info · Agree / money = ok · Run the day = brand · Try again = grey; "Their brief" beside a reply |
| Date change on the Next card (frame 31) | DONE — Move (ok) · Unlock (grey) post the shipped `vendorAnswerDateChange`; the refund sentence is under the buttons. No Chat button — deviation 5 |
| Shop line → one Shop row at the bottom | DONE — name · category · state · (award) · (milestone) · Live pill |

### Each deleted banner → its `pickSupplierNext` branch (or what kept its meaning)
| Was on Today | Branch of `pickSupplierNext` | Today now |
|---|---|---|
| Findability banner ("Couples can't find you yet") | `if (input.findability) → kind: 'findable'` ✔ | the Next card when it wins; a row under Also waiting when a busier rule wins |
| First-steps rail | `if (input.setupStep) → kind: 'setup'` ✔ (the rail's CURRENT step) | same — card or row |
| Booking-fee bills | `if (input.fee) → kind: 'fee'` ✔ — but the rule knows ONE bill, and only when nothing above it applies | **KEPT**: `<BookingFeeBills>` still lists every unpaid bill with its own Pay (minus the one the card shows). Owner 2026-09-20 "i never saw the payment screen to pay us"; `the-fee-finds-the-supplier.test.ts` holds it on Today — deviation 2 |
| Credit-expiring banner | **none** ✘ | **KEPT** as a row under Also waiting (same title, same body, same door to the plan) |
| Payout nudge ("couples can't see where to pay you") | **none** ✘ | **KEPT** as a row (the nudge's own words, one source: `payoutNudgeCopy`) |
| Spotlight Award banner | **none** ✘; planned home Shop › Page › Reviews = S-PR7 | its label rides on the Shop row's line until S-PR7 ("Setnayan's Top Pick"); the blurb and "See how couples discover you" link are gone — deviation 6 |
| Business-milestone pill | none; the plan names no fate | on the Shop row's line ("your 2nd anniversary in 12 days") |
| "Your money" tiles (Earned this year · Received of booked) | — (plan: → Customers › Money) | removed; "to come in" → Payday. Today has no door to Earnings until S-PR4 — deviation 7 |
| "Needs your answer" desk | `answer` | Also waiting (rows, answers in place) |
| "Nothing to answer" (lapsed booking window · flagged delay) | — (plan: remove as a duplicate) | **KEPT** as quiet rows — shown nowhere else — deviation 3 |
| Token note · Ongoing · Upcoming schedules | — | removed (the queue and Coming up say them) |

### Deviations (S-PR1) — each with a recommendation
1. **Also-waiting rows are folds, not doors to the customer card.** The plan's premise ("the customer card where the shipped inline forms already live") is false for two answers: the date-change answer and the delete-request answer are mounted by Today alone (measured; held by `today-is-rows.test.ts` test 2). A row that linked to the card would leave both with nowhere to be answered. A fold keeps every shipped form, the fee read before Agree and the receipt before Confirm. *Recommend: keep the folds; when S-PR5 redraws the customer card, mount those two answers there, then decide whether rows should become doors.*
2. **Booking-fee bills kept as the shipped block** (boxed rows), not deleted. *Recommend: redraw `BookingFeeBills` as hairline rows in S-PR4 (Money), where the same component is used.*
3. **"Nothing to answer" kept.** *Recommend: remove once Customers › People shows a lapsed ask and a flagged delay (S-PR2).*
4. **Event day: only the dark card is built.** "waiting · next moment · checked in" and "Also today" (Schedule · Shot list · Scan) need the Event Hub's reads (schedule blocks, shot-list progress, check-ins; Scan is S2's unbuilt schema). The plan's S-PR1 row lists the dark card only. On an event day the numbers stay waiting · events this week · to come in. *Recommend: build with S-PR11, where those reads are gathered.*
5. **No "Chat" button on a booking ask, a payment to check, a meeting or a date change** — those desk rows carry the event, not the thread id, and a bare client route reaches the chat only by a redirect. *Recommend: add `threadId` to those desk reads in S-PR5 and then show Chat.*
6. **The Spotlight Award's sentence and link are gone until S-PR7.** *Recommend: accept, or keep the banner until S-PR7 (one line to restore).*
7. **Today no longer links to Earnings.** *Recommend: accept until S-PR4.*
8. **The eyebrow reads "Your next step", not "Next".** The shared card's words (owner, live phone test 2026-10-02: "Your next step", not "Next"); the 2026-10-08 prototype draws "Next". *Recommend: owner call — one word, one shared file.*
9. **The fold answers keep their shipped buttons** (dark / green / red pills via `SubmitButton`, one bare `<button>`), not `ActionButton` tones — nine guard files pin those forms by their exact text. `overview-sections.tsx` is therefore not in the button sweep yet. *Recommend: a dedicated PR (S-PR1b) with its own side-by-side.*
10. **"to come in" is the compact string (₱48K), not counted** — `Count` has no compact format and adding one is shared client weight. *Recommend: accept.*
11. **Coming-up rows show the place only** ("Tagaytay"), not the time and package the prototype draws — the row's read (`UpcomingEventRow`) carries neither. *Recommend: add both to the read in S-PR3 (Dates).*
12. **The launch-offer line (frame 22) is not built** — § 7 marks it NEW (no code yet); not in row S-PR1.
13. **The Next card's words are `pickSupplierNext`'s** ("Today: Cruz wedding"; "Date change request" + its sentence), not the prototype's shorter lines — the plan says keep the nine rules exactly. *Owner call if the shorter words are wanted.*
14. **`app/_components/next-card.tsx` (shared with the couple's Home) gained five optional props.** The couple's Home passes none and is unchanged; said here because the file is shared.

### Next (not started — this session stops after S-PR1)
S-PR2 Customers segments · People. Before it: owner OK on the two side-by-sides; CI green on both heads.
