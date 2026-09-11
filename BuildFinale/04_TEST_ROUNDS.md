# Test rounds: where we stopped and what's left

> ⏸ **PAUSED by the owner on 2026-09-11** ("stop test for now … document everything") at step 5. Resume at step 5. When round 1 ends, run FU-1 (release #5463).

The full script is `sources/Test_Script_Live_Two_Sided_2026-09-10.md`. This page records where round 1
stood when this pack was made, every finding so far, and what round 2 needs.

## Who is who in the test

| Role | Account | What it is |
|---|---|---|
| Couple | `testnayan4@test.com` | "Ana & Miguel", wedding on **13 March 2027** (exact day), ~200 guests, CALABARZON. Event `cc47d373-04ba-43cc-b8c9-b45813c182e8` |
| Supplier | `testnayan2@test.com` | "Saysay Live Band & Hosting (FIXTURE)", Solo plan, verified. Two cards: Live band ₱35,000 (has a cover) and Host / MC ₱40,000 (no cover). Setnayan gift **off** on both. No bookings yet, so its first five are free (no booking fee, no gift). |
| Their conversation | — | thread `95f1cc15-daf5-42f2-ad55-dc35686aa524`. The inquiry was accepted 2026-09-11 08:26 UTC and the supplier replied "hello". |

⚠ Test accounts can carry `is_internal = true`, which some counts skip ("the is_internal false-green trap").
When a number looks too good, check that flag before believing it.

## Round 1: progress

| Step (script numbering) | State |
|---|---|
| 1 · Supplier publishes a card with the gift at "no" | ✅ done (cards already live) |
| 2 · Couple finds the shop and opens its page | ✅ done. Findings 1 and 2 below. |
| 3 · Couple sends an inquiry, with no email or phone offered | ✅ done |
| 4 · Supplier accepts and replies | ✅ done. The first supplier reply ever sent in production. |
| 5 · A deal in chat BEFORE any quote: **no Lock button may appear** | ⬜ **not done yet.** Do it before step 6. |
| 6 · Supplier sends a quote with a price | ⏸ it was blocked by finding 7 (the guest-count box refused 200). #5464 is now live, so it can resume. |
| 7 · Couple accepts the quote: the page must say accepting isn't booking and point to Lock | ⬜ |
| 8 · Couple presses Lock (a handshake) | ⬜ |
| 9 · Supplier agrees to the lock. No fee (first five bookings are free). | ⬜ |
| 10 · The locked shop sits first in its category on the couple's list | ⬜ |
| 11 · Price change after the lock: the budget shows "before · change · total now" | ⬜ The script's caveat that the list and event home still show the old ₱100,000 is **out of date**. B2 (#5390) now shows the total everywhere (owner ruling "Show the total now"), so the list should read the new total too. |

After each starred step, confirm the screen against the database. The tool is
`apps/web/scripts/prove-the-flow-watch.ts` (read-only; the script explains how to run it). Its
column names were fixed in #5413.

> **Also check at step 9 (the lock):** read `booking_fee_charges` for this supplier. A "free booking" row (ordinal 1) means the booking-fee setting is ON in production. See 02 · B4.

## Round 1: findings so far (owner, live, 2026-09-11)

| # | What the owner saw | Status |
|---|---|---|
| 1 | The bench's "More in …" card showed the shop's letters although its Live band card has a cover photo | 🔒 fixed in **DRAFT #5463**, held until the round ends (FU-1) |
| 2 | Inquiring from the "Live Band" row filed the shop as "Band / DJ", and both sides read "Inquiring about Band / DJ" | 🔒 #5463 |
| 3 | The perk messages printed raw `**` and raw keys ("live_band", "host_mc") and still said "Exclusive"; the supplier's "What's new" showed "🎁 Exclusive: live_band" | 🔒 #5463 (new wording: "🎁 A perk for Setnayan couples · Live Band — …") |
| 4 | The owner's own older thread read "Inquiring about Miscellaneous" | 🔒 #5463 |
| 5 | Chat box: Enter should send and Shift+Enter should start a new line | 🚀 #5465. Phones keep Return as a new line, since a phone keyboard has no Shift+Enter. |
| 6 | Phone: the supplier's tools were hidden behind an unlabelled ⓘ | 🚀 #5466, a visible "Tools" button |
| 7 | The quote builder refused 200 guests ("nearest valid values are 191 and 201") | 🚀 #5464. The box counted in tens from 1. A guard now checks every number box in the app. |
| 8 | With a tool open, the chat buried itself: the message box landed on the tabs, the page ran past its background, and on a phone the menu bar covered the box | 🚀 #5467. The chat column scrolls and the conversation keeps a minimum height. Also fixes the "20 % %" in the payment schedule. |
| 9 | "I cannot see the exclusive Setnayan" on the quote | ✅ correct that it doesn't show here: both of Saysay's cards have the gift off, and a first-five booking carries no gift. ⬜ But the supplier's builder never shows the gift line at all, so that's **FU-2**. |
| 10 | "What is the difference of quote and proposal?" | They're the same offer through two doors: build from scratch, or send a saved template. ⚖ **FU-4** recommends one "Send a quote" button, pending the owner's yes. |
| 11 | "What does Propose schedule do?" | It puts the supplier's arrival and set times into the couple's day plan, **after booking only**. It's offered before booking and leads to a locked page, so that's **FU-3** (greyed, with the reason). |

🚀 = pushed with auto-merge on; see `05_WHAT_IS_LIVE.md` for the served proof.

## Round 2: a couple with two events (after D1 is live)

Round 2 tests adding a shop to **one of several** ongoing events on purpose, not as a side effect of
messaging.

**Prep:** add a second ongoing event to `testnayan4@test.com` (or `testnayan3`).
**Walk:**
1. On the shop page, tap "Want to add them to your event?". Only ongoing and upcoming events are listed,
   plus "Create an event".
2. Pick event B. ★ In the database, the shop is on B's list and not on A's.
3. Send an inquiry from the same page. ★ The conversation opens under B.
4. Signed out: tap Add. You sign in over the page, then see the list.
5. A stranger (a different couple account) sees none of your event names. This is checked server-side.
