# What only you can decide

Ordered by how much each one holds up. For every question: what it's about, the choices, and my
recommendation. The full list of about 95 open questions, word for word with sources, is in
`02b_ALL_OPEN_QUESTIONS_verbatim.md`. Everything here was checked against the decision log, so nothing
below has already been answered.

---

## A. Looks that unblock the next big builds

| # | What to look at | What it unblocks | Recommendation |
|---|---|---|---|
| A1 | **The universal shop page drawing** (`sources/corpus/prototypes/vendor_public_page_universal_2026-09-10.html`), plus the ruling on the **stock photo**. You asked for one on 2026-06-04; a later session read that as "never a stock photo", but those weren't your words. | D1 "Want to add them to your event?", then the new shop page (F1, F2), then test round 2 | Look at section F first, since it's the only part D1 needs. For the stock photo, show one only while a shop has no photo of its own, clearly marked as a sample. |
| A2 | **Free vs Solo shop page** (`…/shop_page_free_vs_solo_2026-09-10.html`). Two proposals, with the stock photo drawn both ways. | F1 | Pick one of the two proposals. |
| A3 | **Six-door My Shop** (`…/shop_page_2026-09-10.html`). Corrected, with a 91-row "every control → its door" table so nothing gets lost. | G1 → G3 | Look at doors 1–3 first. G1 can start on your yes. |

## B. From today's live test

| # | Question | Choices | Recommendation |
|---|---|---|---|
| B1 | **One "Send a quote" button** instead of "Build a quote" + "Send proposal" | (a) one button that asks "from a template or from scratch?" · (b) keep both, renamed · (c) keep as is | **(a)** |
| B2 | **"Propose schedule" before a booking exists** | (a) greyed out with "Opens once they book you" · (b) hidden until booking | **(a)**, matching your Lock ruling ("hide lock, say why") |
| B3 | **"You're chasing N of 3 customers for 13 Mar"**: should a couple who only said "March" count as wanting 13 March? | (a) exact-day couples only · (b) count month-only couples too · (c) exact-day count plus a separate "N more are looking at March" | **(c)**, or (a) if you want it simpler |
| B4 | **The booking fee is switched on in the code with one setting.** The decision log (2026-09-10) says the fee "computes and displays without charging". The code creates a real bill on the manual GCash/BDO rail from a verified shop's **6th** Setnayan-sourced booking, and the setting is recorded as ON. The first five are free, so no one has been billed. Production has never had a lock. | (a) that's intended, so correct the record · (b) not yet, so turn the setting off until PayMongo is live · (c) keep the setting but let only the admin issue bills by hand | Decide before any supplier reaches a 6th booking. **(b)** is safest until you're ready to collect. Our test lock will show whether the setting is on (a "free booking" record appears). |

## C. Money and plans

| # | Question | Choices | Recommendation |
|---|---|---|---|
| C1 | **Featured supplier tier: price and name.** Nothing can be sold without a price. The documents disagree on whether "Featured" is simply Pro and above, or a separate paid product. "Featured" also already means three other things. | name + price, or "Featured = Pro and above" | Make it **Pro and above** (no new product) and give the paid badge its own word |
| C2 | **Vendor Custom plan**: a six-item sign-off list, untouched. The seat price is written as both ₱250 and ₱500. | approve the six items + pick the seat price | Pick one seat price first, since it blocks an open change |
| C3 | **Free Papic on a same-day celebration** (your 2026-09-11 ruling #12: add guests on the day; no guest list means anyone can use the free credits) **conflicts with your 2026-09-04 lock** "free credits on the first event only". The one-photo pool is the repeat-event grant, not an empty guest list. | which rule wins for a second celebration made on its own day | Let the **first-event rule win** and apply #12 to first events only |

## D. Privacy (you are the registered data-protection officer)

| # | Question | Recommendation |
|---|---|---|
| D1 | **Supplier camera lane is open.** Your ruled scope is "only for documentation of their products", but the on-screen copy says "candid event moments" and no retention period is shown. Keep it open, and with what wording and how long? | Keep it open. Change the copy to "your own products and setup", and set a 12-month retention. |
| D2 | **"People connections" is on** with no privacy or counsel record | Approve with a one-line record, or turn it off until January 2027 |
| D3 | **Saved-supplier gate is on.** Its own note says it hides every free shop from couples' saved lists during launch. | Turn it off for launch. Hiding free shops from couples who saved them isn't "run truthfully". |
| D4 | **Google/YouTube/Drive sign-in tokens are stored as plain text** | Not really a question: it's a build item. Say yes and it's encrypted. |
| D5 | **Automatic document checking** for supplier verification needs your sign-off to use an outside reader | Yes to a reader that doesn't keep copies. Otherwise stay manual (the desk works). |
| D6 | "In demand right now" for couples (`same_date_demand`) is one click at `/admin/data-privacy` | Leave it blocked until the January 2027 filing, as you ruled |

## E. The story and the celebration pages (register items 1, 2, 5, 7, 9, 10)

| # | Question | Choices | Recommendation |
|---|---|---|---|
| E1 | The published story's cover prints **"0 voices"** | drop a fact when it's zero · show zeros | **Drop zeros** (your small-count rule) |
| E2 | **May a session write to production to test?** One session moved six of your photos and moved them back. | never · only on a clearly-marked sample celebration | **Only on the sample "Maria & Jose"**, extended with a real day |
| E3 | Edition number for non-weddings | count weddings only · every story · per kind | **Per kind** ("No. 3 debut") |
| E4 | A Featured supplier's outside link inside the story | allow as secondary · never | **Never.** Your "never show links" and "don't let them leave the app" rulings already cover it; just confirm. |
| E5 | The Papic page says **"50 credits left"** to a stranger | fix the copy | Show "50 free credits with your first event" to strangers |
| E6 | Does next year's celebration inherit this year's guest list? | the 2026-07-12 lock (details only) · the story design (the list as a starting point) | Keep the **lock**. That's what's built, and it's the safe direction. |

## F. Distribution and accounts (things only you can do)

| # | What | Why it's yours |
|---|---|---|
| F1 | **Add the four R2 release secrets** to GitHub | Without them the Mac app can't be downloaded or updated. It's the single blocker for the desktop encoder going out. |
| F2 | **Windows code-signing certificate**: buy it (SSL.com OV ~$129/yr + eSigner is the default), or ship unsigned with "More info → Run anyway" instructions | Costs money. The documents disagree on whether you deferred it. |
| F3 | **iPhone resubmission** needs a real-iPhone recording of account deletion | A device you hold |
| F4 | **Android** is waiting on the D-U-N-S number | Company registration |
| F5 | **A second device for the encoder's end-to-end rehearsal** (S13) | You have one phone, one iPad and one MacBook. The rehearsal needs the coding Mac plus a separate streaming device. |
| F6 | **Save a theme on one real event** so Capiz is seen live once | Only a host can |

## G. Loose ends you closed without a replacement

| # | What | Choices |
|---|---|---|
| G1 | You closed #4472, "opening a shop no longer loses your events", on 2026-08-17 with no comment. The problem it fixed is still in the code: opening a shop flips the account to "vendor". | reopen the fix · confirm it's intended |
| G2 | You closed #4471, "suppliers may write about a day they worked", the same day, with no comment and no replacement | wanted later · dropped |
| G3 | Docs change #5405 fails its checks and has sat still | close it · have it fixed |

## H. Housekeeping only you should approve

| # | What | Recommendation |
|---|---|---|
| H1 | **Unsaved records in the Setnayan folder:** the decision-log row with your six story rulings from 2026-09-11, the matching register edits, and the story test's evidence folder exist **only on this Mac** (not committed). They're copied into this pack. | Let the orchestrator commit them. |
| H2 | **About 30 leftover build folders** beside the repo (`wt-*`), some from other sessions, plus log files | Let a session check each for unpushed work, then remove it |
| H3 | **13 security alerts on the code's outside packages** (5 high), up from 10 two days ago | Let a Sonnet session run a triage pass |
