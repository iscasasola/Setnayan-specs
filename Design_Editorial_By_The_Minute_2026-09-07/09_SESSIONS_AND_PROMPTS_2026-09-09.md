# 09 · THE SESSIONS — prompt, model, effort, sequence
**Dated 2026-09-09 · the build plan for `01`–`08` · nothing in this folder is built yet**

> **Measured before writing this, not read.** Against `origin/main` `df0d78d16` (fetched
> 2026-09-09):
> * there is **no** `apps/web/app/dashboard/[eventId]/story` route — the host's desk does not exist;
> * **none** of `story_cover_kind` · `story_cover_ref` · `previous_event_id` ·
>   `peak_concurrent_viewers` · `p_captured_at` appears anywhere in `supabase/migrations`,
>   `apps/web/lib` or `apps/web/app`;
> * the shipped editor is `apps/web/app/dashboard/[eventId]/website/editorial/`
>   (`page.tsx` · `actions.ts` · `_components/`) and the shipped public story is
>   `apps/web/app/[slug]/_components/editorial/` (16 files — `data.ts`, `consent-veto.ts`,
>   `voices.ts`, `editorial-order.ts`, `compose.ts`, `living-moments.tsx` …), a page of
>   **sections**, not a clock;
> * `capturedAtMs` exists only as a **derived** field in `lib/kwento-magazine.ts` and
>   `lib/auto-recap.ts`. It is not carried on the capture write path.
>
> ⇒ **Phase 0 is genuinely unbuilt and everything else stands on it.** Do not let a session
> "start with the visuals".

---

## THE SHORT VERSION

**Fifteen sessions in five waves.**

> ✅ **2026-09-09 — ALL FIVE OWNER GATES ARE CLOSED. NOTHING IS BLOCKED. Do not re-ask any of
> them.** Owner, shown all five defaults with what each costs: **_"follow your recommendations"_**.
> Rulings, in full, with the Q6 correction: `07_Open_Questions.md`. **Every ⛔ below is struck.**
>
> | | Ruled |
> |---|---|
> | **Q1** | **No counts and no bar heights to a stranger before publish.** Flat baseline. |
> | **Q2** | **The naming opt-in extends to photo messages** — unnamed unless the guest asked. The owner is the DPO, so this is the ruling itself. |
> | **Q3** | **A wake gets the quiet arm** — a story with the joy taken out, not a refusal. |
> | **Q6** | **Build "Taken back" AND stamp the printed edition.** ⚠ The row he was shown described today's defect rather than a recommendation — see `07` Q6 for the correction. |
> | **PRO** | **Keep the gate as shipped.** The prototype's ungated screens were an omission, not a repricing. |

| | What a person gets | Model | Effort | Runs after | Gate |
|---|---|---|---|---|---|
| **S1** | A photo lands on the minute it was **taken**, not the minute it uploaded | **Opus 5** | **high** | — | |
| **S2** | The day's own photos fill the day — a hundred prenup shots stop eating it | **Opus 5** | **high** | S1 | |
| **S3** | Guests' photos stay guests-only until the host publishes — **counts and all** | **Opus 5** | **high** | — | ✅ Q1 |
| **S4** | The five things we do not store yet (columns only, nothing reads them) | **Sonnet 5** | medium | — | |
| **S5** | One desk where the host decides everything, instead of four screens | **Opus 5** | **high** | S4 | ✅ Q2 |
| **S6** | Nothing the shipped editor can do is lost, plus the theme | **Opus 5** | medium | S5 | ✅ PRO |
| **S7** | A cover picture, and naming the next celebration (or naming none) | **Opus 5** | medium | S4 · S5 | |
| **S8** | Publish — three states, the consent tick, the edition number stamped once | **Opus 5** | **high** | S5 · S6 | |
| **S9** | The story becomes a clock: cover, dial, minutes, gaps | **Opus 5** | **high** | S1 · S2 · S3 | |
| **S10** | The page's light moves morning → night, and the room lights up | **Opus 5** | **high** | S9 | |
| **S11** | Everything at once: the index, search, Relive, "were you there?" | **Opus 5** | **high** | S9 | |
| **S12** | The last word, the back cover, print and share | **Sonnet 5** | medium | S9 · S7 | |
| **S13** | Every celebration that is not a wedding, including a wake | **Opus 5** | medium | S9 | ✅ Q3 |
| **S14** | A guest changes their mind **after** publish and it actually comes down | **Opus 5** | **high** | S8 | ✅ Q6 |
| **S15** | A supplier sees how many people reached them; No. 2 opens on No. 1 | **Sonnet 5** | medium | S7 · S12 | |

### Sequence

```
WAVE A (data)      S1 → S2        ‖   S4        ‖   S3
WAVE B (the desk)  S5 → S6 → S8 → S7            ← ONE LANE. S7 lives inside S5's route.
WAVE C (the page)  S9 → S10       ‖   S11
WAVE D (the rest)  S12  ‖  S13
WAVE E (after)     S14  ‖  S15
```

**The desk lane (B) and the page lane (C) are the two that genuinely run side by side** — the
host's desk and the public page share no files. That is the pair to run when you want two at once.

### ▶ STATE, 2026-09-09 — measured, not read

| | | |
|---|---|---|
| **S1** | ✅ **MERGED + SERVED** — PR [#5332](https://github.com/iscasasola/setnayan-platform/pull/5332). Verified IN PROD BY THE OBJECT: `papic_record_guest_capture` now takes `p_captured_at`. |
| **S3** | ✅ **MERGED** — PR [#5331](https://github.com/iscasasola/setnayan-platform/pull/5331), built with the Q1 ruling. |
| **S4** | ✅ **MERGED + SERVED** — PR [#5330](https://github.com/iscasasola/setnayan-platform/pull/5330). All five columns verified in prod, and `photo_messages.author_named_publicly` is `NOT NULL DEFAULT FALSE` — the Q2 ruling is in the database. |
| **S2** | ✅ **MERGED** — PR [#5329](https://github.com/iscasasola/setnayan-platform/pull/5329), merge `fc3ced6`, verified an ancestor of `origin/main`. 🚨 **AND THE FIRST DIAGNOSIS OF WHY IT WAS RED WAS WRONG — the correction is worth more than the fix.** It was reported as failing on an *unrelated* guard (`native encoder tests`) that `main` passes. **False.** That step is SKIPPED once an earlier one fails and the aggregator counts *skipped* as FAIL, so it is the loudest line in the log and it is a SYMPTOM. The real failure sat above it in **both** runs: `THE FREEZE — the exposure surface has widened`, because `story_dial_bucket_counts` is a new capability reachable by `authenticated`. 🔑 **A LOG SEARCH FOR THE WORD "FAIL" FINDS THE LAST FAILURE, NOT THE FIRST — grep `not ok` too, and read upward.** Accepted deliberately after measuring prod: the function is `LANGUAGE sql STABLE`, **not** `SECURITY DEFINER`, so it runs under the caller's RLS, and `papic_photos` admits `authenticated` on three narrow arms only (the seat's claimer · the couple or an admin · a moderator holding the `photos` area) — no "any signed-in person reads a public event" policy exists, so a signed-in stranger gets **zeros** and the Q1 ruling is not crossed. Baseline regenerated in the same PR; the diff is **one added line plus its two counters** (6587→6588, func 254→255) and nothing else widened — which is the check that matters, because regenerating can otherwise record a real mistake as intended. |
| **S5** | ✅ **DONE + SERVED.** Step 1.1 (route move to `/dashboard/[eventId]/story`) PR [#5337](https://github.com/iscasasola/setnayan-platform/pull/5337) · step 1.2 (the desk) PR [#5338](https://github.com/iscasasola/setnayan-platform/pull/5338), merged 2026-09-09, merge `6e2d361` — **verified an ancestor of `origin/main` AND the exact commit production self-reports.** ⇒ **S6 AND S7 ARE UNBLOCKED.** ⛔ But they are ONE LANE with each other: **S6 → S8 → S7**, never two at once, and never while another session holds that page. |
| **S9** | ✅ **MERGED** — PR [#5342](https://github.com/iscasasola/setnayan-platform/pull/5342), merge `c8debfe`, verified an ancestor of `origin/main`. 3,664 lines: the spine, the clock, the minute media and their guards. ✅ **AND IT IS NOW SERVED — the confirmation this row asked for, 2026-09-08T23:46Z.** Production's `/api/health` reports `c8debfe`, and it is verified **BY THE OBJECT, the served HTML**, not by the deploy log: the live `/realstories/maria-and-juan-…` page carries the dial (61 rects, one of them the full-width hit area, plus the day divider and the needle), **five placed minutes**, the drop caps, the *Sample story* pill **on the cover**, and the old invented masthead title is gone (2 → 0 occurrences, measured against a snapshot taken before the merge). ⚠ **The road is absent on that page ON PURPOSE** — a fixture has no dated road facts and no filler row is ever drawn; do not read its absence as the road being unbuilt. ⇒ **S10 AND S11 ARE UNBLOCKED.** ⛔ Both edit the story render tree — run **ONE at a time** on the page lane, whatever the wave diagram suggests. |
| **S6** | ✅ **MERGED + SERVED 2026-09-09** — PR [#5346](https://github.com/iscasasola/setnayan-platform/pull/5346), merge `96355b9`, verified an ancestor of the commit production self-reports. The desk keeps the whole shipped editor and takes its colours from the mood board. |
| **S10** | ✅ **MERGED + SERVED 2026-09-09** — PR [#5349](https://github.com/iscasasola/setnayan-platform/pull/5349), merge `55e3bb7`, verified the same way. The page moves morning → night and the room lights up. |
| ⏭ **LEFT** | **S7 · S8 · S11 · S12 · S13 · S14 · S15.** Eight of fifteen are done. ⛔ **S7 and S8 are the desk lane — one at a time, S8 → S7.** ⛔ **S11 is the page lane — never beside S12's print work on the same tree.** |

> ✅ **AND IT IS SERVED — OBSERVED ON THE LIVE SITE 2026-09-09, not inferred from the merge.**
> `/api/health` reports `c8debfe`, PR #5342's own merge commit, and fetching the one published
> story (`/movie-night`) anonymously returns the clock in the HTML: the masthead *Vol. I · No. 1*,
> the four facts (*14 captures · 0 live films · 0 voices · 19 days told*), **THE ROAD** with its
> date marks, the dial's hour labels, *"Tap anywhere on the line to open that moment"*, and the
> day reading *"No minute of this day has been written up yet."*
>
> 🔑 **S2's BOUND IS VISIBLY WORKING ON REAL DATA.** That event's 14 captures (13 photos + 1 clip)
> ALL fall outside its own day, and the page files them on the road as *"13 before the day · The
> camera opens"* rather than letting them fill the wedding day. **That is exactly the defect S2
> existed to fix, visible on the live site.** ⚠ It also means **the only published story in prod
> has an empty dial for its day** — nobody can see a busy clock on real data yet, and that is the
> data's fault, not the build's. Seed a day-of capture before judging the dial.
>
> 🔴 **FLAGGED, NOT FIXED — TWO COUNTS OF ONE THING ON ONE PAGE.** The new cover says **14
> captures**; the older *By the Numbers* block lower down the same page says **15 Photos & …**.
> The database holds 13 photos + 1 clip = **14**, so the cover matches and the older block does
> not — but the two may simply be counting different populations under the same word, which is
> the more dangerous version. **Whoever takes S11 or S12 owns this**; do not "fix" it by matching
> one number to the other before establishing which population each is counting.

> ✅ **FIXED IN S9's PR #5342 — kept below because the REASONING generalises.**
> 🔴 **S9 INHERITED A NAMED DEFECT — IT WAS DELIBERATELY NOT PATCHED IN S2's PR.**
> `story_dial_bucket_counts` excludes `hidden_at` rows and unscreened rows, but **a VETOED capture
> still adds to a bar's height.** `04` rule 6 is that a capture's veto beats the host's curation,
> and `consent-veto.ts`'s `publicKeyForCapture` is monotone by construction — the counts do not go
> through it. **A bar height is data about the guests' layer exactly as a photograph is.**

⚠ **Verify every row above with `gh pr view <n> --json state,mergedAt`** before acting on it. A
checkmark in a register is not evidence; this corpus has been wrong about a PR's state five times,
and one of these rows was already ticked as DONE while its PR sat open and red.

> 🪤 **THREE TRAPS S9 PAID FOR, AND S10–S12 WILL MEET ALL THREE.**
> · **A THRESHOLD IS NOT A GUARD.** Two of eleven source guards were decoration in exactly
> the same way — *"at least three arms fail closed"* went GREEN when a sabotage DELETED one
> of four, and *"the file mentions the day window"* went GREEN when a sabotage deleted one
> query's lower bound because three other mentions still stood. **Derive the arms and check
> each one; never count them against a floor.** And a rejected query is an ABSENCE, so
> `if (error)` is as much a failure arm as `catch`.
> · **THE PROTOTYPE'S TYPE SCALE FAILS THE GUEST LEGIBILITY FLOOR.** Its eyebrows are 9–11px,
> fine on a 1000px desktop mock and illegible on the page a guest opens;
> `lint-guest-legibility` fails the PR. Set them at 12px and adapt the LAYOUT to the type
> (S9 thinned the dial's hour stamps to four and hid the road's date marks below `sm`), never
> the type back to the layout. ⚠ That guard matched **integers only** until S9 widened it, so
> `text-[9.5px]` used to walk past it.
> · **DO NOT HAND-ROLL A DIALOG'S FOCUS.** `lib/use-modal-a11y.ts` ships the trap, Escape,
> the restore and a modal stack; `modal-a11y-adoption.test.ts` fails any overlay that claims
> `aria-modal` without it. S9's first cut hand-rolled it and was caught.

**Never more than two at once.** Ten parallel builds once shipped 44 defects, and this machine
has killed a typecheck twice under four concurrent sessions — `tsc` exits **134 / 143 / 144**
while printing `errors=0`, so a session under contention can read its own typecheck as a pass.
**Print `TSC_EXIT` beside `ERROR_LINES`; either one alone is a lie.**

**Safe pairs:** S1+S3 · S1+S4 · S2+S4 · **S5+S9** (one is the host's desk, the other is the public
page — different trees entirely) · S9+S11 · S13 with anything · S12+S15.

⛔ **Never together:** S1+S2 (one capture path) · **S2+S3** (both rewrite the story's server read)
· S5+S6 (one desk page) · **S5+S7 and S6+S7** · **S9+S10** (one render tree) · S8 with S5 or S6.

> 🔴 **CORRECTED 2026-09-09 — THIS FILE CONTRADICTED ITSELF ON S5+S7 AND THE PAIR LIST WAS THE
> WRONG HALF.** It listed S5+S7 as a *safe pair* while the table above says S7 **runs after S5**,
> and both are true only if you never read the second one. **They are not parallel: S7 builds two
> STEPS INSIDE the route S5 creates**, so running them together is two sessions editing one page.
> The dependency column was right; the pair list was wrong. *A register that says a thing twice
> will be read from whichever half is convenient.*

---

## WHY EACH MODEL AND EFFORT

**The rule behind every row:** this repo's failure mode is *subtly wrong and green* — a guard that
is decoration, a read that returns empty because it was refused, a gate that admits one person too
many. So **anything deciding who may see what, or that writes to the capture path a live event
depends on, gets Opus at high effort.** Mechanical work with a written-down trap list gets Sonnet.

* **S1 touches the one function every capture at a live wedding goes through.** Getting it wrong
  does not produce a wrong chart — it refuses photographs at a wedding in progress. **Opus, high.**
* **S2 is a read that already starves** (cap 48, unbounded), and its fix is a new aggregate. A
  wrong bound silently deletes a day. **Opus, high.**
* **S3 is a review blocker.** The first design pass hid the entries and left the index, the bar
  heights, the minute sheet, the cover counts, Relive and the closing words public to a stranger.
  **Opus, high** — and the test asserts the payload, never the CSS.
* **S4 is five columns and no readers.** Written down completely. **Sonnet, medium.**
* **S5 surfaces consent per card and must make a held-back item unacceptable.** **Opus, high.**
* **S6 is loss-prevention** — the shipped editor's caps, folds, own-columns, manual wishes and
  save-before-you-navigate all have to survive. Careful, not deep. **Opus, medium.**
* **S7 writes new columns and one of its buttons creates a real event.** **Opus, medium.**
* **S8 stamps a number that is "theirs forever" and flips who can read the whole page.**
  **Opus, high.**
* **S9–S11 are the page**, and each carries a blocker from the review (illegible crossfade
  midpoint, seating outside the reception, search surfacing what the viewer may not see).
  **Opus, high.**
* **S12 is print and share**, both already shipped shapes to follow. **Sonnet, medium.**
* **S13 is sixteen event kinds through one already-shipped vocabulary.** Judgement only in the
  solemn arm. **Opus, medium.**
* **S14 is cache invalidation on a consent withdrawal** — the failure mode is a person's
  withdrawal not landing. **Opus, high.**
* **S15 is analytics plumbing with the copy rule already written.** **Sonnet, medium.**

---

## ✅ THE FIVE OWNER GATES — ALL CLOSED 2026-09-09. DO NOT RE-ASK.

Owner, shown all five with what each costs: **_"follow your recommendations"_**. Full text and
reasoning: `07_Open_Questions.md`.

| | Ruled | Which session now builds it |
|---|---|---|
| **Q1** | **No.** Before publish, a stranger sees flat baseline ticks — no counts, no bar heights. A count is still the guests' data. | **S3** |
| **Q2** | **Yes, it extends.** A photo message carries a name only if the guest asked. New column, `NOT NULL DEFAULT FALSE`. ⚖ The owner **is** the registered DPO — this is the ruling itself, and must never be written up as outside counsel. | **S4** (column) · **S5** (the copy) |
| **Q3** | **The quiet arm.** A wake gets a story: no Relive, no challenges, no anniversary, no countdown, the family's words. ⚠ Does **not** reverse the shipped refusal of the *joyful auto-composed recap* for a wake — different thing, stays refused. | **S13** |
| **Q6** | **Build both** — the fourth state ("Taken back"), the full revalidation set, and the version stamp on print. | **S14** |
| **PRO** | **Keep the gate exactly as shipped.** Naming/writing moments, section order, own columns, featuring wishes stay PRO. The prototype's ungated screens were an omission. | **S6** |

> ⚠ **THE Q6 ROW HE WAS SHOWN WAS WRONG-SHAPED, AND THIS IS THE CORRECTION.** Its "default" column
> read *"nothing today; the withdrawal lands on the next read and a print never knows"* — **a
> description of today's defect, not a recommendation.** *"Follow your recommendations"* cannot
> mean *leave it broken*, so what is recorded is the recommendation actually made: a guest who
> withdraws has it come down everywhere, and a printed copy can say which edition it is.
> 🔑 **And say what the stamp cannot do:** a copy printed before S14 ships carries no stamp and can
> never know. Paper cannot be recalled.

⏭ **Still open, blocking nothing:** what the edition number counts for a non-wedding (**Q5**) ·
whether "Featured" needs a different word (**Q7**) · whether a live outside link leaks a
Setnayan-sourced lead (**Q8**) · **the Featured price.**

---

## SHARED HEADER — paste this at the top of EVERY block below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first,
then this folder: ~/Documents/Claude/Projects/Setnayan/Design_Editorial_By_The_Minute_2026-09-07/
  00_BUILD_README.md · 01_The_Story.md · 02_The_Story_Maker.md · 03_Data_Requirements.md
  04_Consent_And_Privacy.md · 05_Occasions_Registers_MultiDay.md · 06_Supplier_Tiers.md
  07_Open_Questions.md · 08_Build_Order.md
The two prototypes in that folder's prototypes/ are the DESIGN, not decoration. Open them.
PORT THEM, NEVER REDRAW THEM — a delta between your screen and the prototype is a defect in
the port, not a fresh design decision.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. This project is ~2 years old. Assume what you are
  asked for already exists and your job is to locate and extend it. The "already ships" lines
  in your block were read from origin/main df0d78d16 on 2026-09-09 — confirm before changing.
- A DOCUMENT IS NOT EVIDENCE — including this prompt and including 03_Data_Requirements.md.
  Verify against shipped code and the live production database before acting.
- A rejected query is not a thrown error. A phantom column, enum value, function argument, a
  missing grant or a blocked iframe all fail the same way: the only symptom is an absence.
- SERVICE-ROLE READS ARE OUTSIDE EVERY RLS RULE. /[slug] renders with an admin client, so the
  app-side gate is the whole fence there. Authorization may use the service role scoped by a
  session-proved id; EVENT CONTENT NEVER DOES.
- Branch FIRST, then `git worktree add` beside the repo (never /tmp, never the shared checkout).
  Commit before your first mutation run. Prune the worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after `gh pr create`. Standing default.
- After merge, VERIFY THE CHANGE REACHED PRODUCTION BY QUERYING THE OBJECT — not
  schema_migrations, not a migration comment. Prod deploys have silently stopped migrating.
- A guard must be able to FAIL. Sabotage the thing it protects and PRINT THE OCCURRENCE COUNT
  before and after; an unmeasured mutation proves nothing. Assume one of your guards is
  decoration.
- Require `# tests` to be NON-ZERO before believing any pass. `npx tsx --test` on a path
  containing [brackets] runs zero tests and exits 0. So does a typo'd path.
- Print TSC_EXIT beside ERROR_LINES. An empty tsc log is not a clean one.
- Reply to the owner in plain English: what a PERSON experiences. No file paths, function
  names, table names, SQL or flag names in your answer to him.
```

---

# WAVE A — MAKE THE DATA TRUE

## S1 · The shutter, not the upload — **Opus 5 · high**

```
GOAL: a photograph lands on the minute it was TAKEN. Today it lands on the minute it finished
uploading, so at a venue with patchy signal a 2 PM photo files itself at 8 PM. Every screen in
this build is a clock, so this is the foundation: without it the dial is a chart of where the
reception had signal.

MEASURED 2026-09-09 (origin/main df0d78d16): `p_captured_at` appears NOWHERE in
supabase/migrations, apps/web/lib or apps/web/app. Both Papic write paths default to NOW().
`capturedAtMs` exists only as a DERIVED field in lib/kwento-magazine.ts and lib/auto-recap.ts.

BUILD (03 §2.1, 08 step 0.1):
- add p_captured_at to papic_record_guest_capture, following the EXISTING client-supplied /
  server-validated pattern that p_geo_* already uses in that same function — do not invent a
  second shape;
- carry capturedAtMs through papic-sink.ts's deps.record(...) and through the offline queue,
  which is exactly where the seat path drops it today;
- validate server-side: reject a future time, clamp to a sane window around the event, and fall
  back to now() when absent so an old client still works.

OWNER RULING 2026-09-07, verbatim: "when we get the photos and snippets, we know. but the guest
does not need to know." ⇒ read it on ingest. NEVER ask the guest, never surface the mechanism.

DO NOT: widen anything else in that function. It is the authoritative race-safe gate for credit
reservation and it is the one thing every capture at a live wedding goes through. A mistake here
refuses photographs at a wedding in progress, so build the refusal path first and test it.

DONE WHEN: a capture uploaded an hour late lands on the minute it was taken, and a test proves a
late upload does not move a bar. Dry-run the migration against prod inside BEGIN…ROLLBACK before
pushing — the PGlite replay runs as superuser and will not tell you the truth about grants.
```

## S2 · The day's own photos fill the day — **Opus 5 · high** · after S1

```
GOAL: the day's clock shows the day. Today it can show none of it.

MEASURED, and this is the whole bug: apps/web/app/[slug]/_components/editorial/data.ts reads the
timeline as .from('papic_photos').order('captured_at').limit(EDITORIAL_TIMELINE_PHOTO_CAP) with
the cap at 48 and NO lower bound on captured_at. Cameras may start shooting SIX MONTHS before the
event (owner lock). So with ~100 prenup/despedida captures, all 48 rows are pre-day shots and the
wedding day contains no photograph at all.

BUILD (03 §3, 08 steps 0.2 + 0.4):
- bound the timeline read to the event's own days;
- serve per-bar heights from a COUNT-BY-TIME-BUCKET aggregate. No generate_series RPC exists —
  this is new. Do not solve it by raising the cap: that same file already records why
  ("presigning 300 URLs to throw 276 away is the shape that made the gallery slow");
- presign ONLY the bin the reader opens. The recap is ISR (revalidate = 300), so a per-bar sheet
  cannot be served from the page payload;
- multi-day: select events.event_end_date and give each Manila calendar day its own clock, so a
  day-2 capture can never be drawn on a day-1 bar.

TRAP: a date is not an instant, and a wall clock is not an instant. CI runs in UTC — the one clock
where both mistakes cancel out. Run your suite under Asia/Manila AND a west-of-Greenwich zone.

DONE WHEN: with 100 pre-day captures seeded the day's buckets still contain day-of photos; a day-2
capture never renders on a day-1 bar; and the bar heights come from a count, not from the rows.
```

## S3 · The guests' layer is invisible until publish — **Opus 5 · high** · ✅ Q1 RULED

```
GOAL: before the host publishes, a stranger sees the invitation and the broadcast — and NOTHING
of what the guests made. Not the photos, and not the SHAPE of them either.

THIS IS A REVIEW BLOCKER AND THE OBVIOUS FIX IS THE WRONG ONE. Hiding the entries is not enough.
The first pass left ALL of these public to a pre-publish stranger: the index, the dial's bar
HEIGHTS, the minute sheet, the cover's counts, the Relive player and the closing words.

BUILD (01 §2, 04 rule 8, 08 step 0.3):
- event_editorial.status is ONE audience for the whole story today. The guest layer needs its own
  gate, mapped to the `event` audience until `published`;
- exclusion is SERVER-SIDE, on the viewer classes /[slug] already resolves — holdsGuestPass,
  isSeatHolder, isSignedInHost — and on storyAudienceAdmits(status, viewer). Every guest-made unit
  also carries data-layer="guest", but that is a marker, NOT the mechanism;
- future bins (after "now", before publish) are a baseline tick with NO height. A bar's height is
  data about a minute that has not happened yet.

✅ OWNER RULED 2026-09-09 — Q1 IS ANSWERED, DO NOT RE-ASK: NO. Aggregate counts and bar heights
are NOT public before publish. A stranger gets flat baseline ticks and no counts. A count is still
the guests' data. Build exactly that; do not offer him the other arm again.

DONE WHEN: a test asserts THE PAYLOAD — not the CSS — contains no guest-layer node, no counts and
no bar heights for a stranger before publish. A test that checks a class name proves nothing here.
```

## S4 · The five things we do not store — **Sonnet 5 · medium**

```
GOAL: columns only. Nothing reads them yet. This unblocks S5 and S7 without them fighting over a
migration.

MEASURED 2026-09-09: none of these exists anywhere in supabase/migrations, apps/web/lib or
apps/web/app.

BUILD (03 §2.5–2.7, 08 step 0.5):
- events.story_cover_kind + events.story_cover_ref (an R2 key, a capture id, or 'monogram');
- events.previous_event_id UUID REFERENCES events(event_id), NULLABLE, ON DELETE SET NULL — an
  actor leaving keeps the record. Written ONLY on the host's go-signal tap;
- panood_broadcasts.peak_concurrent_viewers int NULL;
- the per-layer flag S3 needs, if S3 has not already added it — coordinate, do not duplicate;
- the Kwento naming column modelled on guest_columns.author_named_publicly BOOLEAN NOT NULL
  DEFAULT FALSE — ONLY IF the owner has answered Q2 yes. If he has not, leave it out and say so.

🚨 A NEW COLUMN ON `events` IS NOT DONE WHEN IT EXISTS. That table revokes table-level SELECT and
re-grants a PER-COLUMN allowlist, so a column with no GRANT SELECT (col) makes PostgREST refuse
the WHOLE query — every user-session read of events goes silently empty. `events_host` also has an
explicit projection computed from those grants. lint-events-column-grants is the only thing that
catches this; the db coverage tests structurally CANNOT, because their before() recomputes the
allowlist over your new column.

Allocate the prefix with `pnpm migration:new`. Update the Ugat map — two required db-tests will
tell you if you have not.

DONE WHEN: migrations applied and VERIFIED IN PROD BY THE OBJECT; a signed-in read of events still
returns rows; nothing reads the new columns yet.
```

---

# WAVE B — THE STORY MAKER

## S5 · One desk — **Opus 5 · high** · after S4 · ✅ Q2 RULED

```
GOAL: the host decides everything about their own story in ONE place. Today they must visit four
separate screens to do it: the letters editor, the Kwento moderation queue, what a supplier sent,
and the editor itself.

RULE 0 FIRST: the four editors STAY WHERE THEY ARE. You are not moving them and not rebuilding
them. The desk is the single QUEUE that decides what reaches the story. The dashboard's "Untold"
shelf already links to the editor — keep its words, they are already right.

BUILD (02 §1–2, 08 steps 1.1 + 1.2):
- route rename /dashboard/[eventId]/website/editorial → /dashboard/[eventId]/story, with a
  redirect so old links resolve, and point the Untold shelf at it;
- ONE loader unioning four sources — photo_messages, guest_columns, papic_mission_completions,
  editorial_vendor_media — each with its own status column, into {source, id, status, arrived_at,
  lands_in}. Nothing new is stored;
- accept / edit / reject writing back to each table's own status column. Accept is the only way
  anything enters. Reject is SILENT — nobody is told — and undoable at any time;
- accepting a capture SET may be partial;
- every card carries its consent state (04): "She asked to be named." / "Not named, by choice." /
  the five yeses on a challenge answer;
- HELD-BACK ITEMS ARE SHOWN AS HELD BACK AND CANNOT BE ACCEPTED: "One of the twelve shows a guest
  who opted out of photos. That one is already held back — you cannot accept it, and it is not
  counted above." A capture's veto BEATS the host's curation (consent-veto.ts publicKeyForCapture
  is monotone by construction — it can only ever show less). An unresolved veto withholds
  everything.

✅ OWNER RULED 2026-09-09 — Q2 IS ANSWERED, DO NOT RE-ASK: YES, the naming opt-in extends. A
photo message carries a name only if the guest asked; otherwise it runs unnamed, exactly as a
letter does. The role rides the same consent as the name — there is one maid of honour.
⚖ The owner IS the registered DPO (NPC, 2026-07-07), so this is the DPO ruling extending its own
earlier one. NEVER write it up as outside counsel or as "counsel cleared".
The column S4 adds is NOT NULL DEFAULT FALSE, so a row that predates it publishes unnamed.

DONE WHEN: a host decides every item without leaving the page; a rejected item is silent; a
held-back capture cannot be accepted by any route including a hand-made request.
```

## S6 · Nothing the shipped editor can do is lost — **Opus 5 · medium** · after S5 · ✅ PRO RULED

```
GOAL: the host who already knows the editor loses nothing, and picks the story's colours from the
mood board they already made.

THIS IS LOSS-PREVENTION, NOT A FEATURE. Read the shipped editor and reproduce its real behaviour.

CARRY FORWARD (02 §4 + §9, 08 step 1.3) — all of it:
- THE WORDS: two boxes up front (Headline, Your story), four behind a fold (Eyebrow, Sub-headline,
  Pull quote, Byline). The split is by WHO THE FIELD BELONGS TO. Keep the shipped file's own
  reasoning: "Six equal boxes made the page read as a form to complete rather than a story to
  correct." Clearing a generated field lets us rewrite it;
- your own columns · manual wishes (Author/Role/Wish/Stars, reorder, remove) · direct photo upload
  with no Papic needed · "What goes in" with SAVE-BEFORE-YOU-NAVIGATE on a plain click, modifier
  clicks passing through;
- the caps, unchanged: 400 soft on a write-up · 280 soft on a wish (server hard-caps) · 12 wishes
  · 30 gallery uploads · 10 canonical moments offered as a datalist, not a constraint;
- a section with NOTHING ACCEPTED does not render at all. No empty headings, ever. Two locked
  rows: masthead and lead always show; the last word then the song always closes.

THEME (02 §5, 08 step 1.4): three modes — follow my mood board (tracks role_palette.reception;
swatches shown, NOT editable here, because two editable sources is how a board and a story drift
apart) · make my own (starts from the board, then detaches) · neutral (a real choice, not a
failure). The picker is the MOOD BOARD'S OWN swatch-popover.tsx — colour name, search by colour
name, and a "from your mood board" row. Do not write a second picker. The six light stages repaint
live underneath as colours change.

✅ OWNER RULED 2026-09-09 — THE PRO CHIPS GO BACK, DO NOT RE-ASK. Naming and writing the moments,
section order, placing your own columns and featuring guest wishes stay PRO exactly as they ship
today. The prototype drew them ungated; that was an omission, not a repricing. Port the SCREENS
from the prototype and the GATE from the shipped editor — a prototype drawn without a gate is not
a decision to remove one, and quietly shipping four paid abilities as free is a repricing nobody
chose.

DONE WHEN: a written checklist of every shipped editor capability is in the PR body, each ticked
against the new page. Nothing is "probably still there".
```

## S7 · The cover, and what comes next — **Opus 5 · medium** · after S4 and S5

```
GOAL: the host chooses the one picture their story is known by, and — only if they want to —
names the celebration that comes after it.

THE COVER (02 §6, 08 step 1.5): there is NO story-cover concept today; the /realstories card
inherits the living hero. One picture, three jobs, all three previewed live: the top of the story,
the card on setnayan.com/realstories, and the 1200×630 thumbnail when the link is shared.
Candidates: the living hero · any accepted capture from a written minute · a supplier frame · the
animated monogram · upload another. A CAPTURE CAN ONLY BE A COVER IF IT PASSED THE SAME CHECKS AS
EVERYTHING ELSE — screened, and nobody in it opted out. Writes story_cover_kind/story_cover_ref.
⚠ showcase_photo_r2_key is on VENDOR SERVICES, a different table. It is not this.

WHAT'S NEXT (02 §7, 08 step 1.7) — OWNER RULING: a story is finished on its own. Most end here and
that is a whole story. So: NOTHING IS PRE-SELECTED, the resting card reads "Nothing yet — the
story ends on your words", and the back-cover preview stays quiet and dashed until the host
chooses. NEVER offer a reader a menu of event kinds.
- candidates are DERIVED, never created — lib/event-anchor.ts already does this and its own owner
  lock governs this screen: "Recurrence is DERIVED at read time, never an auto-created row — an
  event exists only on the user's go-signal tap";
- the first anniversary is badged "⟳ Derived, not created"; a christening is badged "◇ Waiting on
  a date" — "We will not ask you for one, and we will not guess";
- two clearly DIFFERENT actions: "Announce it only" (back cover, creates nothing) vs "Start it
  now" (opens a new event, pre-filled, and writes previous_event_id on the tap).

DONE WHEN: the shelf card and the OG card both change when the cover changes; choosing nothing
leaves the back cover absent; and "Announce it only" provably creates no row.
```

## S8 · Publish — **Opus 5 · high** · after S5 and S6

```
GOAL: the host publishes once, knowing exactly who can then read it.

BUILD (02 §8, 08 step 1.6):
- three states, each NAMING who can see it: Draft (the host) · Guests only (everyone holding the
  Papic QR; not searchable, not shareable outside the day) · Published (anyone with the link);
- PUBLISH IS DISABLED until the desk is empty, a state is chosen and consent is ticked. The rail's
  progress meter reads "n% of the desk decided";
- the consent tick, verbatim: "I want this story to be public, and I understand it will carry our
  names, our photos, and the words our guests agreed to share." Under it: guests keep their own
  say either way, and the host can go back to guests-only whenever;
- "Feature our story in Stories" is a SEPARATE opt-in from publishing — carried from the shipped
  editor with its guard ("Set your Event Hub link first" / "Your Event Hub is Private");
- the last word is always the host's own words. Nobody writes it for them.

THE EDITION NUMBER (03 §2.4): today editionNo is RECOMPUTED AT EVERY RENDER, so "No. 1, theirs
forever" is not guaranteed. Stamp edition_volume and edition_no ONCE, on the FIRST transition of
status to 'published' — NOT on published_at, which stamps at the first guests-only share.
⚠ It counts WEDDINGS in the awards cycle. What it should count for a debut is owner question Q5 —
leave it filtering weddings and record the reason in WEDDING_ONLY_BY_DESIGN. A filter not to flip
quietly.

DONE WHEN: publish is impossible with an undecided desk; the number is stamped once and never
moves; and going back to guests-only actually takes the page back from a stranger.
```

---

# WAVE C — THE STORY

## S9 · The spine — **Opus 5 · high** · after S1, S2, S3

```
GOAL: the public page stops being a list of sections and becomes the event's clock — the road,
one segment per day, and after.

PORT prototypes/story.html. It is the design. Do not redraw it.

BUILD (01 §1 + §3, 08 step 2.1): the cover (monogram · Vol. · names very large · one sentence ·
four facts) — the EDITION NUMBER APPEARS ONLY AT PUBLISH, before that the masthead reads "Vol. I"
alone, and a sample story carries its "Sample story — not a real ⟨host⟩" pill ON THE COVER, not
buried in the colophon. Then the road's dated entries, the days' minutes (big stamp, title, media,
write-up with a drop cap, then Said / Asked / Made by / In the film / In the room), and the gaps
drawn AS GAPS so the day keeps its real proportions.

THE DIAL — every one of these is a review finding, not a preference:
- EVERY bar opens, written-up or not (owner lock 4). The whole strip is ONE hit area and the
  nearest bin wins — a 1.3px bar is not a tap target;
- labels are HTML positioned in percent, NEVER SVG text inside a stretched viewBox: that squashed
  every label to 35% width on a phone;
- the dial is focusable, ←/→ walk bins, Enter opens;
- the needle moves by TRANSFORM, not by rewriting an attribute;
- 44px minimum on every control; no body-level horizontal scroll at 390px.

FILMS (01 §6): ONE CARD PER BROADCAST SESSION, not one film — a single 2h48 file cannot span
2:38 → 9:47 PM. A minute's timecode is its clock time minus THAT SESSION'S went-live time.

MOTION (01 §7): entries RISE, never fade — the page must be fully legible at rest, in a screenshot
and with JS off. prefers-reduced-motion is honoured by the SCRIPT as well as the stylesheet: the
count-up, Relive's autoplay and every smooth scroll.

DONE WHEN: operable on a 390px phone and by keyboard alone.
```

## S10 · The light, and the room — **Opus 5 · high** · after S9 · never with S9

```
GOAL: the page moves from morning to night as you read it, and the floor plan shows where the
photographs came from.

THE LIGHT (01 §1 + §4, 08 step 2.2): six stages — before · morning · afternoon · dusk · night ·
after — derived from the host's SAVED palette, sanitizeRolePalette(events.role_palette).reception.
Slot labels are the shipped PALETTE_LIMITS.reception ones (Dominant · Supporting · Accent ·
Neutral · Accent 2) — never invented names. Neutral fallback when nothing was saved, framed as a
choice.

🔴 NEVER LERP GROUND AND INK TOGETHER. Doing so passes through a ~1.05:1 illegible midpoint for a
full screen of scrolling, twice per page. Crossfade the GROUND; choose the INK each frame as
whichever of the two stages' inks reads better on the ground actually present.
🔴 CORRECTION IS MANDATORY. A colour taken from a mood board is never trusted to be legible. Every
colour is contrast-checked before use and nudged toward black or white until it passes: body ink
≥ 12:1, muted ≥ 4.6:1, accent-as-text ≥ 4.5:1.

THE LENS (01 §3.4 + §5, 08 step 2.3): a sticky floor plan with five states, DERIVED FROM THE
SCHEDULE BLOCK IN USE, never from a clock constant — not built yet · designed · ceremony (rows
facing the arch, tables hidden) · reception (tables lit by captures per minute, gold = loudest
table) · no venue (a roaming event, and it says so).
🔒 OWNER LOCK 6, and he caught this himself: ASSIGNED SEATS EXIST ONLY WHILE THE RECEPTION VENUE
IS IN USE. The prototype had been lighting tables during the ceremony.
🔒 REVIEW BLOCKER: the public plan carries TABLE NUMBERS AND PHOTO-HEAT. NEVER NAMES. An earlier
design published 108 first names. And per-table copy uses the table's own label, never a person —
a 1–2-phone count beside a credited name identifies a single shooter, and nobody is ever named as
the one who shot a photo.

DONE WHEN: an automated contrast check passes across all six stages × the neutral palette + three
sample palettes; a ceremony minute shows rows; a roaming event shows no plan; and no name appears
in the seating markup at all.
```

## S11 · Everything at once — **Opus 5 · high** · after S9

```
GOAL: a reader can find anything in the day, and a guest can find themselves in it.

BUILD (01 §3.6–3.7 + §8, 08 steps 2.4 + 2.5):
- ELEVEN index tabs, each an honest index of one layer, every item linking back to its minute:
  captures · voices · asked · letters · the team · films · photo wall · the room · the look ·
  made with · by the numbers;
- FIND IN THIS DAY: one search over every layer THE CURRENT VIEWER MAY SEE. The index is rebuilt
  from the live DOM so a stranger cannot search what a stranger cannot read. It understands a time
  ("7:12", "9:47", "3 hapon") and offers "jump to that minute". Non-matching minutes dim;
- RELIVE: crossfading playback, prev/next invisible to the eye but NEVER invisible to the
  keyboard; focus moves into and back out of both overlays;
- WERE YOU THERE? — the guest's OWN ACCOUNT ONLY, resolved from their signed-in Papic link.
  🔒 THERE IS NO NAME FIELD, FOR ANYONE, EVER (owner ruling 2026-09-07). A name box let a stranger
  type any first name and learn who attended and where they sat. Shows the minutes they appear in,
  what they shot, what they said, their table — and ends in the 9:16 share card;
- it is also the ONLY place a guest can act on their own consent: "Something of yours here you'd
  rather not show? Hide it, or ask to be unnamed."

DONE WHEN: search provably cannot surface what the viewer may not see, and a grep of the rendered
markup finds no name input anywhere on the page.
```

## S12 · The close, print and share — **Sonnet 5 · medium** · after S9 and S7

```
GOAL: the story ends properly, and can be held in the hand or sent to anyone.

THE LOCKED CLOSE (01 §3.8): the host's last word, then their song. NOTHING AFTER IT.
Non-negotiable — EDITORIAL_LOCKED_CLOSE_KEYS already encodes this. Then the colophon.

THE BACK COVER (01 §3.9): AFTER the colophon, the way a series page sits after The End — outside
the locked close, which is why it does not break it. It exists ONLY if the host named a next
celebration in the Story Maker (S7); otherwise absent. Three doors by viewer: the host → "Open the
story maker"; a guest → "Tell me when there's more"; a stranger → "Start your story · free".
NEVER a menu of event kinds.

PRINT AND SHARE (01 §9, 08 step 2.7): the A3 keepsake broadsheet front and back with a QR that
RETURNS TO THE LIVING PAGE · a PDF · A4 one-minute-per-page. Share to Facebook · Messenger ·
Pinterest · copy link · the 9:16 card. The 9:16 card already ships — save-story-card-button.tsx →
/api/og/…?format=story at 1080×1920 with saveImageToDevice. REUSE IT.

METADATA (01 §10): canonical URL · og:type=article · og:locale=en_PH · the per-story 1200×630 card
· twitter:summary_large_image · three JSON-LD blocks. Headings are real: h1 names, h2 per part, h3
per entry.

DONE WHEN: nothing renders after the song except the colophon and, if named, the back cover; and
the A3's QR resolves to the living page.
```

---

# WAVE D — EVERY CELEBRATION THAT IS NOT A WEDDING

## S13 · Sixteen kinds, and the quiet one — **Opus 5 · medium** · ✅ Q3 RULED

```
GOAL: the story holds for all sixteen live event kinds. The owner already ruled, 2026-08-15:
"each event they create will have an editorial not just wedding."

BUILD (05, 08 steps 3.1–3.3):
- every "couple" in the page chrome is a TEMPLATE resolved from event_type_profiles.terminology
  through event-words.ts: "a note to the couple" → "a note to {theHost}", "future couples" →
  "future {hosts}", "Sample story · not a real couple" → "not a real {host}". The masthead renders
  ONE name when person_b is null;
- zero-supplier and no-venue empty states: a hangout with no bookings shows no team tab and no
  #1-match tile.

✅ OWNER RULED 2026-09-09 — BUILD ARM (b), THE QUIET ARM. DO NOT RE-ASK. A wake GETS a story:
no Relive, no challenges, no anniversary, no countdown, and the family's words. Filipino wake
culture is served by a page that records five nights, the mass, and who came from abroad.
⚠ THIS DOES NOT REVERSE THE SHIPPED REFUSAL OF THE JOYFUL AUTO-COMPOSED RECAP FOR A WAKE — that
stays refused, and the anniversary mail selector still excludes the solemn register. Two different
things: the recap composes itself in a joyful voice with nobody's hand on it; the story is written
by the family. Do not "simplify" them into one gate.

⚠ Key the solemn gate on the REGISTER, not on a surface flag — the funeral build already learned
this and its test freezes every celebratory type byte-identical.

DONE WHEN: no hard-coded "couple" survives a source scan of the story tree, and a wake renders
exactly the arm the owner chose.
```

---

# WAVE E — AFTER PUBLISH

## S14 · Taken back — **Opus 5 · high** · after S8 · ✅ Q6 RULED

```
GOAL: a guest changes their mind after publish and it actually comes down — everywhere.

WHAT IS TRUE TODAY (04 §3), and it is the whole reason this session exists: the only
photo_consent = false write is the host's guest form, and its revalidations are the guests page
and backTo — NEVER /{slug}, /{slug}/recap or /{slug}/print. The guest's own "Not me" revalidates
only /{slug}. Meanwhile the recap and print routes are revalidate = 300 and the OG card is
max-age=3600, stale-while-revalidate=86400.
⇒ A WITHDRAWAL COMES DOWN ON THE NEXT READ AND NOT BEFORE, AND A PRINTED COPY NEVER KNOWS.

BUILD (08 step 4.1): every consent write revalidates the story, the recap, the print route and
busts the OG card; the fourth publish state, "Taken back", with its cache invalidation named; and
a version stamp so a printed copy can say which edition it is.

✅ OWNER RULED 2026-09-09 — BUILD BOTH, DO NOT RE-ASK. The fourth state ("Taken back") and the
version stamp on the printed edition.
⚠ THE ROW HE ANSWERED WAS WRONG-SHAPED AND THIS IS THE CORRECTION: the register printed Q6's
"default" as "nothing today; the withdrawal lands on the next read and a print never knows" —
that is a DESCRIPTION OF TODAY'S DEFECT, not a recommendation. "Follow your recommendations"
cannot mean "leave it broken", so what is recorded is the recommendation actually made.
🔑 SAY WHAT THE STAMP CANNOT DO, in the copy and in the PR: a copy printed BEFORE this ships
carries no stamp and can never know. Paper cannot be recalled — the stamp lets a reader CHECK.
Never write copy that implies a printed page can be reached.

🔑 ENUMERATE THE READERS. A fix applied to one of them is not a fix — that lesson has been paid
for five times in this repo. Grep every reader of the preserved fact before declaring this done.

DONE WHEN: a withdrawal reaches the story, the recap, the print route and the OG card, proven by
fetching each one after the write, not by reading the code.
```

## S15 · Reach, and No. 2 — **Sonnet 5 · medium** · after S7 and S12

```
GOAL: a supplier can see how many people reached them from a story, and next year's edition opens
on this one.

SUPPLIER REACH (03 §2.3, 08 step 4.2): /v/[slug] already maps src ∈ {editorial, favorites,
explore, search} to inquiry_source, and record-vendor-view.ts already writes vendor_profile_views.
So link every supplier from the story as /v/{slug}?src=editorial&utm=story%3A{event public_id}
through the credit chip. REUSE `editorial`; do not invent src=story.
🔒 THE COPY MUST SAY "HOW MANY REACHED THEM", NEVER "WHO TAPPED THEM". The analytics model forbids
identity and there is a minimum-count floor. No copy anywhere promises identity.
🔒 And the tier rule that never bends (06): paying changes HOW RICHLY a supplier is credited, never
WHETHER they are credited. "#1 match" is a credit, not a tier.

ANNIVERSARIES (08 step 4.3): No. 2 opens with "Previously · No. 1", following previous_event_id.
The back cover becomes a live door.

LIVE VIEWERS (03 §2.2), if not already done: fill panood_broadcasts.peak_concurrent_viewers by
extending the controller's EXISTING during-broadcast poll with videos.list?part=liveStreamingDetails,
keeping a running max. The same poll also delivers the controller's spec'd-but-unbuilt 👁 chip. Add
liveViewersPeak: number | null to ImpactMetrics — null omits, following its existing convention.

DONE WHEN: a tap from a story is attributable to that story, no copy promises identity, and No. 2
opens on No. 1.
```

---

## GUARD RULES FOR EVERY SESSION (from `08`)

* **A guard must test the claim, not a cheaper proxy.** A hand-written file list is not "anywhere".
  Derive the file set; prefer a walk plus a reasoned baseline (`WEDDING_ONLY_BY_DESIGN` is the
  pattern).
* **Sabotage-check every new guard** — break the thing it protects, confirm it fails, restore, and
  print the occurrence count before and after.
* **One comment stripper** — `lib/strip-comments.ts`; the baseline may only shrink.
* **Never weaken a check to go green.**
