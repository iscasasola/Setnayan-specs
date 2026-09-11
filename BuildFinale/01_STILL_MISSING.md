# Everything still missing (2026-09-11)

Four layers, from most immediate to broadest. Each item says what's needed and where its full detail lives.

## 1. The build plan: what's left of it (briefs in `03_BUILD_PROMPTS.md`)

| Id | What a person gets | Blocked on | Model |
|---|---|---|---|
| **D1** | "Want to add them to your event?" on a shop page: pick one of your ongoing events, or create one | your look at the shop-page drawing (02 · A1) | Opus · high |
| **F1** | The new universal shop page, top: identity, true facts only, the checks receipt | D1 + your look at A1/A2 (and the stock-photo ruling) | Opus · high |
| **F2** | The new shop page, body: services, portfolio, reviews ("one calm line" when there are none) | F1 | Opus · high |
| **G1 → G3** | My Shop in six doors, with nothing lost | your look at the six-door drawing (A3) | Opus · high |
| **FU-1** | Release the four held display fixes from the test (bench card photo, "Live Band" not "Band / DJ", clean perk messages, no "Miscellaneous"). DRAFT #5463 is built and fully checked. | the test round ending (it's paused) | Sonnet |
| **FU-2** | The supplier sees "your couple gets N free Papic photos" while building a quote | nothing | Opus · high |
| **FU-3** | "Propose schedule" greyed out with its reason until booking | nothing (02 · B2 has a default) | Sonnet |
| **FU-4** | One "Send a quote" button | your yes (02 · B1) | Sonnet |
| **FU-5** | Gift snapshot at lock: the gift can't be switched off, or swapped to another card, after the couple locks | nothing | Opus · xhigh · DRAFT |
| **FU-6** | "Who else wants this day" counts exact-day couples only | your pick (02 · B3) | Sonnet |
| **Test round 1** | Steps 5–11: deal before the quote (no Lock) → quote → accept → lock → the list order → price change after the lock | **paused by you, 2026-09-11** | owner-driven |
| **Test round 2** | A couple with two events adds a shop to the right one | D1 live | owner-driven |

## 2. The top ten outside the build plan (checked against the code)

1. **The booking fee bills with one setting.** From a shop's 6th sourced booking, not "display only" as the decision log says. Decide it (02 · B4).
2. **The desktop encoder can't go live for its default couple** (own YouTube channel: the stream address is saved empty), and it can't be downloaded (the R2 secrets are missing). No stream has ever reached YouTube, and the rehearsal needs a second device.
3. **Six story and Papic rulings from 2026-09-11 aren't built:** same-day Papic, the share card on unlisted sites, the takedown picker showing the actual photos, the host seeing takedown requests, the Story Maker remembering your step, and the smaller mute button. #12 conflicts with an earlier lock (02 · C3).
4. **The story's end-to-end proof (step 8) isn't finished.** 116 of 155 checks pass. Still to do: "a taken-back photo disappears everywhere", and one leftover page-load error on 6 of 32 loads.
5. **Invite themes: only Capiz exists.** Velvet, Galeriya, Abaca, the five fonts, the button colour and the weddings-only limit are all missing. Capiz has never been seen live.
6. **Privacy settings live without their sign-off:** the camera lane copy and retention, "people connections", the saved-supplier gate hiding free shops, plain-text sign-in tokens, and the guest-photo record (02 · D).
7. **Automatic document checking** for verification isn't started, and it needs your DPO sign-off. The "Approve refuses before the first outside shop" line is missing from the launch checklist.
8. **Decided in August, never built:** empty marketplace categories with your sentence, "Report this shop", and the guest song-request button (the database half has been live since July).
9. **About 95 open owner questions** (`02b_ALL_OPEN_QUESTIONS_verbatim.md`), including register items 1, 2, 4–10.
10. **Distribution:** Mac download, Windows signing, the Windows installer never run on Windows, iPhone resubmission, Android D-U-N-S, and the Mac installer never stapled.

## 3. Everything else: 265 items in 32 areas

One line per item: `_research/INDEX_all_open_items.md`. Full evidence, what it takes, and the owner question per
item: `_research/corpus_sweep.md`.

| Area | Open | Mostly |
|---|---|---|
| Production switches | 45 | 21 built but switched off · 17 waiting on you |
| Service cards, shop and supplier tools | 19 | not started |
| Other August registers (web, navigation, roadmap tail, owner ops) | 20 | mixed |
| Marketplace / Explore | 16 | not started |
| Desktop encoder + its infrastructure checklist + Live Studio | 16 | waiting on you or a device |
| Story & Story Maker (4 areas) | 27 | partly built · waiting on you |
| Event Hub + its controller | 15 | not started |
| Security, schema and compliance · ops and repo hygiene | 26 | not started |
| Invite link themes | 12 | not started |
| Papic, supplier Papic, free credits, gifts and deals | 20 | not started / waiting on you |
| Samahan | 9 | not started |
| Launch checklist and the 08-17 rulings | 8 | mixed |
| Chat and bench leftovers | 7 | not started |
| Supplier verification after the desk | 6 | not started |
| Mood board, store shell and distribution, pricing, booking fee, marketplace hygiene, legal | 23 | mixed |

Items that registers still list as open but the code shows **done** are in `_research/corpus_sweep.md` PART 3,
so no one rebuilds them.

## 4. Repo loose ends (`_research/repo_sweep.md`)

- #5405 (docs) fails a required check and has sat still.
- #4471 and #4472 were closed by you with no replacement. #4472's problem is still in the code (02 · G).
- Branch `handoff-hardening` holds two real fixes to the repo's handoff note (the `is_internal` false-green risk) that never merged.
- There are 13 security alerts on the code's outside packages, 5 of them high, and rising.
- The repo's working-notes inbox has 76 "pending" rows. They're documentation debt, not missing code.

## 5. Records to correct (no code)

- The decision-log row (2026-09-10) that says the booking fee doesn't charge yet.
- Four switch records that contradict later rows. One Vercel read settles each.
- A 2026-09-09 row still calls an item open that was ruled 2026-09-06 and built (#5400).
- `08_Build_Order.md` rows 0.2–0.4 say "not built", but they are.
- Three stale memory notes, and the `~/CLAUDE.md` header (the `~` checkout was ruled "leave it" on 2026-09-09).
