# BuildFinale: start here

Everything still missing from Setnayan as of **2026-09-11**, in one place. Production is at `25c6952`.
It was made because the build credits are nearly used up, so a new session (or a person) can continue
with nothing but this folder.

## Read in this order

| File | What it is | Who it's for |
|---|---|---|
| `00_START_HERE.md` | this page | everyone |
| `01_STILL_MISSING.md` | every open item in four layers: the build plan, the top ten, all 265 by area, and repo loose ends | everyone |
| `02_OWNER_DECISIONS.md` | what only the owner can decide, with choices and a recommendation | the owner |
| `02b_ALL_OPEN_QUESTIONS_verbatim.md` | all ~95 open questions, word for word, with sources | the owner / the next orchestrator |
| `03_BUILD_PROMPTS.md` | a ready-to-paste brief for every remaining build session | the next orchestrator |
| `04_TEST_ROUNDS.md` | the live test: where it paused, every finding, round 2 | the owner + orchestrator |
| `05_WHAT_IS_LIVE.md` | what's served, with proof | everyone |
| `06_HOW_TO_RUN_THE_BUILD.md` | the handoff prompt for a new orchestrator: rules and traps | the next orchestrator |
| `_research/` | the two full sweeps: 265 open items across 32 areas, and the repo's open PRs and branches | detail |
| `sources/` | copies of every plan, register, drawing and decision log the above cite. `corpus/` = the Setnayan folder, `repo/` = files from the code on main, `memory/` = the working notes sessions kept | detail |

## The state in five lines

1. **Live:** the whole path from a supplier's card, to a couple's inquiry, to a quote, to a lock, to a price change after the lock, with the security work behind it. Plus today's four test fixes. See `05`.
2. **Built and held:** four display fixes from the live test (DRAFT #5463), which go out when the test resumes and ends.
3. **Paused:** the live test, at step 5 (a deal before any quote). The owner paused it on 2026-09-11.
4. **Waiting on the owner:** three drawing looks (they unblock the new shop page and the six-door My Shop) and the booking-fee setting. Then the rest of `02`.
5. **Beyond the plan:** 265 open items, of which 96 not started, 77 waiting on the owner, 23 built but switched off, 33 partly built, 6 waiting on a device and 29 unverified. The top ten are in `01`.

## Where things live

- Code: `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` (GitHub `iscasasola/setnayan-platform`)
- Specs: `/Users/icecasasola/Documents/Claude/Projects/Setnayan` (this pack sits inside it)
- The live register the pack was cut from: `WHATS_NEXT_Build_SEQUENCE_2026-09-10.md` (keep updating that one)
- Production database: Supabase project `njrupjnvkjkitfctetvi` (read-only for sessions)
- ⛔ Never read code from `/Users/icecasasola` itself: it's a stale copy from 2026-08-09.
