# EMCEE SCRIPT SYSTEM — BUILD SPEC

> **2026-07-29 · the contract.** Per `CLAUDE.md` Rule 0 §4, a dated `*_BUILD_SPEC_*` **outranks
> any handoff**. Where this disagrees with a handoff or a memory, this wins.
>
> **Read in this order:** §0 (what already exists — do not rebuild) → §1 (traps) → §2 (the build,
> in order) → §7 (verification) → **§11 (the open-questions register — check it before assuming
> anything is settled).** The concept and the *why* live in
> [`Emcee_Script_System_Concept_2026-07-29.md`](Emcee_Script_System_Concept_2026-07-29.md); this
> file is the *how*.

---

## 0 · State of play — verified against live prod / `origin/main`, 2026-07-29

### ✅ SHIPPED — do NOT rebuild any of this

| What | Where | Evidence |
|---|---|---|
| Host/MC day-of desk ("Script & cues") | `…/on-the-day/live/[eventId]/_components/stage-script/` | PR #3812 merged |
| Its decision core, 30 tests | `apps/web/lib/stage-script.ts` | on `main` |
| `BLOCK_CUE` exported for reuse | `apps/web/lib/emcee-script.ts` | on `main` |
| Coordinator desk (`floor_command`) | `…/_components/floor-command/` | `46c395839` (another session) |
| Song desk (`song_desk`) | `…/_components/song-desk/` | on `main` |
| **Activity catalogue** — schema + authoring + picker + timeline bridge | `vendor_activities` · `event_activity_picks` · `lib/vendor-activities.ts` · `/vendor-dashboard/activities` · `…/schedule/_components/emcee-picks.tsx` | PR #3831 merged, **migration applied + object-verified in prod** |
| Vendor↔couple **working folder** (private/shared notes, couple can write) | `lib/vendor-working-notes.ts` · `…/vendors/[vendorId]/workspace/` | on `main` |
| Vendor **private CRM notes** per client | `vendor_client_notes` · `…/clients/[eventId]/_components/customer-card-notes.tsx` | on `main` |
| Per-feature **ask/approve access** for a vendor | `FLOOR_REQUESTABLE_AREAS` (includes `schedule`) · `…/floor-command/ask-access.tsx` | on `main` |
| Schedule **templates** (starter skeletons) | `lib/schedule-templates.ts` | on `main` |

### 🟡 WRITTEN, on a branch, NOT a PR

Branch **`claude/emcee-script-layer`**, commit `2011b6c9d`. Two complete units, reviewed below
in §3 and §4. **Continue from here — do not start over.**

- `supabase/migrations/20271020117627_emcee_block_scripts.sql`
- `apps/web/lib/emcee-script-layer.ts`

### ⛔ NOT BUILT — this spec

1. Tests for `emcee-script-layer.ts` (§4.3)
2. The **script page** (§5)
3. **Day-of wiring** — his line on the night (§6)
4. The **questionnaire** (§8) — a later PR, specified here so it is not designed twice
5. Wiring the emcee into the **`schedule` ask/approve** flow (§9)

---

## 1 · TRAPS — every one of these already cost a build cycle

1. **The canonical checkout `/Users/icecasasola` goes stale.** It was once 1,455 commits behind,
   which made shipped files look absent. `git fetch origin && git rev-list --count HEAD..origin/main`
   before trusting anything. **Always build in a fresh worktree off `origin/main`.**
2. **Two sessions built the same screen in parallel** and only found out at merge. Before
   starting: `gh pr list --state open --limit 40 --json number,title,headRefName` and grep for
   your area. If someone is mid-flight, say so rather than race.
3. **`test:unit` is NOT the test suite.** There is a second — `tests/db/*.db.test.ts`, PGlite
   in-process, ~594 tests, no skip path. Skipping it pushed a broken PR. **Run both.**
4. **A policy named `_host_` / `_couple_` must use `current_couple_event_ids()`**, never the
   member-wide `current_event_ids()` (which includes invited guests). A `_host_`-named policy on
   the member-wide function would have let a guest write the couple's picks. Guarded by
   `tests/db/couple-host-policy-scope.db.test.ts`. *(This spec's table is vendor-scoped and named
   accordingly — see §3.)*
5. **Every new table ships OPEN.** `REVOKE ALL … FROM anon, authenticated`, then grant only what
   is needed. The **exposure freeze** will then fail your PR by design — regenerate
   (`corepack pnpm --filter @setnayan/web exposure:baseline`) **in the same PR**, and read the
   diff: every added line is new reach.
6. **The baseline conflicts on nearly every schema PR.** It is GENERATED. Resolve with
   `git checkout --theirs` **then regenerate** — never hand-merge two snapshots.
7. **Never run `supabase db push`.** It auto-applies on merge. And migrations apply **once**: if
   you edit a migration after it lands, prod keeps the old version forever while the command
   reports success. Verify the **object**, not the ledger, via Supabase MCP `execute_sql` on
   project `njrupjnvkjkitfctetvi`. There is no `psql` on this machine.
8. **Migration prefixes are allocator-only:** `corepack pnpm -C <worktree> migration:new "<name>"`.
9. **`tsc` and `next build` are ~10 min each and get SIGKILLed if run concurrently** (16 GB box).
   One at a time, with the heap flags in §7.
10. **Changelog fragment goes in the ROOT `changelog.d/`** — a CI guard fails otherwise.

---

## 2 · Build order

| # | PR | Depends on | Size |
|---|---|---|---|
| 1 | Script layer: migration + lib + tests + **the script page** | — | the core |
| 2 | Day-of wiring — his line on the `stage_script` desk | 1 | small |
| 3 | Emcee into the `schedule` ask/approve flow | — | small |
| 4 | The questionnaire | — | medium |

PR 1 is the whole feature's centre. **Do not split the page out of it** — a migration and a lib
with no surface is unverifiable in review.

---

## 3 · The data model (WRITTEN — review, do not redesign)

`supabase/migrations/20271020117627_emcee_block_scripts.sql`

```
vendor_block_scripts
  script_id          uuid pk
  event_id           uuid → events            on delete cascade
  block_id           uuid → event_schedule_blocks  on delete cascade
  vendor_profile_id  uuid → vendor_profiles   on delete cascade
  body               text  CHECK 1..2000 after btrim
  created_at, updated_at
  UNIQUE (block_id, vendor_profile_id)
```

**The three properties that matter, and why:**

- **VENDOR-PRIVATE.** Exactly one policy — `vendor_block_scripts_owner_all`, scoped to
  `current_vendor_ids()` + `is_admin()`. **No couple read. No coordinator read.** The couple
  booked a host, not a manuscript; showing them his working copy changes what he is willing to
  write down. Precedent: `vendor_client_notes` ("vendor-org-only … off-limits to couples and to
  Setnayan HQ admins").
- **Attached to `block_id`, not to a position.** The couple moves dinner and his line moves with
  it. This is the one thing a Word file can never do, and it is the reason the feature exists.
- **`ON DELETE CASCADE` from the block.** A script for a moment that no longer exists is worse
  than no script.

⚠ **Do not rename the policy to `_host_`.** That prefix carries an expectation of
`current_couple_event_ids()` scoping (trap 4). This is vendor-scoped and the name says so.

⚠ **`vendor_client_notes` was checked first and is the wrong vessel** — right privacy, wrong
granularity (one stream per *client*, with a remind-date, for CRM). A script must hang off a
*block*. Both tables stay.

---

## 4 · The pure lib (WRITTEN — needs tests)

`apps/web/lib/emcee-script-layer.ts`

### 4.1 What it does

`buildScriptWorkbook({ blocks, scripts, options })` joins the four things that meet on a moment:

| source | what | whose |
|---|---|---|
| `event_schedule_blocks.label` / `.start_at` | what happens, when | couple |
| `event_schedule_blocks.notes` | what they want said | couple |
| `BLOCK_CUE` | the shared prompt for the block type | ours |
| `vendor_block_scripts.body` | **what he will say** | his |

Returns `{ entries, written, blank, unanswered, empty }`. `unanswered` is the useful one for the
page: **moments the couple wrote an instruction on that he has not answered yet.**

`compileScriptText(workbook, header)` produces his printable copy.

### 4.2 Two invariants to preserve

- **`publicFacing` is `is_public === true`, strictly.** Anything else reads as private, so an
  unexpected value fails toward silence rather than toward a host reading a surprise into a
  microphone. Same rule as `lib/stage-script.ts`.
- **`compileScriptText` is NOT `buildEmceeScript`.** That one is the *couple's* export and prints
  the wedding-party roster from `guests` — **a booked vendor cannot read `guests`**, and must
  never be handed a compiler that does. Two audiences, two compilers, one shared `BLOCK_CUE`.

### 4.3 Tests owed — `lib/emcee-script-layer.test.ts`

Follow the house style: assert against the **real** imported `BLOCK_CUE`, inject `formatTime`, and
record a **neutralisation** run in the file header (break it, note exactly which tests fail and
how many pass, revert).

- ordering: chronological, `sort_order` tiebreak, parts nested under their parent
- an **orphan part** (parent RLS-filtered) is promoted, never dropped
- `written` / `blank` counts; `unanswered` = has a note, no script
- a script whose block was deleted simply does not appear
- whitespace-only `body` counts as blank
- **privacy**: a private block never yields `publicFacing: true`; pin from **both** directions
- `compileScriptText`: marks private blocks `[PRIVATE — DO NOT READ ALOUD]`, shows a blank rule
  for unwritten moments, handles an empty timeline

---

## 5 · The script page — `/vendor-dashboard/clients/[eventId]/script`

### 5.1 Why there

The **Customer Card** is the vendor's per-booking home, and **every trade already has a working
sub-page off it**: `production-sheet` (caterer) · `cocktail` (bar) · `editorial-media`
(photographer) · `seat-plan` · `mood-board`. **The emcee is the only trade without one.** This is
the missing instance of a shipped pattern — not a new concept.

Add the tab to `_components/customer-card-nav.tsx` (`CARD_TABS`), **conditionally**: it appears
only when the vendor's `services[]` contains `host_mc`. A caterer must not see a script tab.

**Not chat.** You cannot read a script out of a chat log at 9pm with a microphone in your hand. A
script is ordered by the night; a thread is ordered by when things were said; and a message never
updates itself when the couple moves dinner. He still *asks* through the thread and the working
folder — the **artefact** lives here.

### 5.2 Reads

One read of the blocks (caller's client, RLS decides:
`event_schedule_blocks_booked_vendor_read` gives a booked vendor the full timeline minus the
coordinator's unreleased prep), one of `vendor_block_scripts` scoped to
`(event_id, vendor_profile_id)`. **No admin client on this path.**

### 5.3 What it renders

- A progress line: **"5 of 7 moments written"**, and the count of *unanswered* couple instructions.
- The night in order. Per moment: time · label · `Private` chip when not public · the couple's
  instruction · the shared cue · **his line, editable in place** (plain `<form>` + server action,
  same idiom as `/vendor-dashboard/activities`).
- **Print / copy** via `compileScriptText`.
- Empty timeline → an honest sentence naming the couple, never a broken panel.

### 5.4 Server actions

`saveBlockScript(formData)` — upsert on `(block_id, vendor_profile_id)`; empty body deletes the
row rather than storing `''`. `revalidatePath` the page. **RLS is the boundary** — resolve the
vendor with `fetchOwnVendorProfile` and let the policy refuse a forged `block_id`.

---

## 6 · Day-of wiring (PR 2)

`lib/stage-script.ts` already builds the cue card, the running script and the announcements from
the blocks. Add his line to it:

- Extend `StageScriptEntry` and `StageCueBlock` with `script: string | null` (additive — the
  registry's props contract rule applies: **add**, never narrow).
- `…/stage-script/stage-script.tsx` reads `vendor_block_scripts` for
  `(eventId, vendorProfileId)` alongside the blocks it already reads.
- Render his line **under** the couple's note, visually distinct (gold), labelled so it is
  obviously his own writing.
- ⚠ Its existing neutralisation tests must still pass unchanged — the privacy invariant is not
  allowed to weaken because a field was added.

---

## 7 · Verification — the exact list CI enforces

```bash
cd /Users/icecasasola/<worktree> && corepack pnpm install --frozen-lockfile
cd apps/web
NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit        # 0 errors
npx next lint                                                   # exit 0, 0 errors
npx tsx --test "lib/**/*.test.ts" "app/**/*.test.ts"            # test:unit
npx tsx --test "tests/db/*.db.test.ts"                          # test:db:ci ← DO NOT SKIP
NODE_OPTIONS=--max-old-space-size=7168 npx next build           # exit 0
cd .. && node scripts/check-migration-timestamps.mjs && node scripts/migration-doctor.mjs
node scripts/lint-exposure-baseline.mjs
for g in lint-entitlement-gates lint-changelog-dir lint-nested-forms lint-guest-legibility \
         lint-retired-strings lint-vendor-layout-revalidate; do node apps/web/scripts/$g.mjs; done
RADIUS_LINT_STRICT=1 node apps/web/scripts/lint-radius.mjs
```

Plus: a root `changelog.d/<branch-slug>.md` with a dated block and a `SPEC IMPACT:` line, then
`gh pr create` → `gh pr merge <#> --auto --merge`.

**Radius:** if the page uses corner radii, use `var(--m-r-*)` tokens — **px literals fail
`lint-radius`** (strict in CI).

---

## 8 · The questionnaire (PR 4 — specified so it is not designed twice)

**Owner-decided 2026-07-27:** the emcee **creates his own questions**; the couple answers;
**answers stay per wedding, the question SET saves as his template** for future customers; the
coordinator sees it **only with approval**.

**Why it exists:** his hardest job is announcing ~30 principal sponsors by full name, and a booked
vendor **cannot read `guests`**. So he *asks*, and the names arrive as something the couple
deliberately typed — no new PI surface, the DPO/NPC item untouched.

**Only ask what the app cannot know.** It already has, free: both names · ceremony type · venue ·
pax · mood · love story · together-since · special message · the onboarding answers. The real gaps:

- how to pronounce these names — **the highest-value field for a PH emcee**
- titles and honorifics (Atty. · Dr. · Engr. · Hon.)
- who to acknowledge, in what order
- **what he must NOT say** — the estranged parent, the ex, the unannounced pregnancy. *Unknowable
  by any other means, and the one that ruins a night.*
- who speaks, in what order · language and register

**Shape:** `vendor_questions` (vendor-owned, reusable, **no `event_id`** — that absence is what
stops a past couple's details travelling) + answers per event. Mirror `vendor_activities` /
`event_activity_picks` exactly, **including the booked-vendor SELECT lane in the first
migration** — `event_song_picks` had to retrofit it and that is the mistake this pattern exists
to avoid.

**Where the couple answers:** the working folder they already share with that vendor
(`vendor_working_notes` — private/shared split, couple can write). **No new inbox.** ⚠ Its
visibility enum and author role are named coordinator-only, so a host/MC author needs adding — a
rename to something role-neutral, a migration, not a new table.

---

## 9 · Schedule access for the emcee (PR 3)

He plots his segments only while the couple has shared the schedule. **The mechanism ships and is
vendor-generic** — `FLOOR_REQUESTABLE_AREAS` already contains `schedule`, and
`…/floor-command/ask-access.tsx` is the ask/approve UI. **Reuse it; invent no access model.**

Then his page shows retime controls when `moderator_area_level(event,'schedule') === 'edit'`, and
is read-only otherwise. The banner must say the access is **on loan** — see the three-lenses
prototype.

---

## 10 · The permission model this must not break

| | Couple | Emcee | Coordinator |
|---|---|---|---|
| Own the timeline | ✅ | ✕ | ✕ |
| Add/move/retime *(planning)* | ✅ | if granted | if granted |
| **Advance the night** *(live)* | only if no coordinator | **never** | ✅ |
| Write the block instruction | ✅ | ✕ | ✕ |
| **Write the spoken script** | ✕ | ✅ | ✕ |
| **Read the emcee's script** | ✕ | ✅ | ✕ |
| See the guest list | ✅ | **never** | if granted |

**Many may plan. One may run.** Planning and running are different permissions and were never in
conflict — `advance_schedule_block` is the live one.

⚠ **Open defect, unrelated but adjacent:** that RPC currently admits **any booked vendor**, so a
caterer could advance the show. Narrowing it is item E of the handoff. **Do not add an advance
control to any vendor surface until it is narrowed.**

---

## 11 · OPEN QUESTIONS — the register

Everything still waiting on the owner, in one place, with what it blocks and where the
recommendation stands. **Nothing here blocks PR 1 (§2).** Two are genuinely load-bearing; the
rest are either non-blocking or housekeeping.

### 🔴 Load-bearing — a wrong guess is expensive

| # | Question | Status | What it changes | Recommendation |
|---|---|---|---|---|
| Q1 | **"activities which GUESTS can pick"** — do **guests** pick activities, or the **couple**? | **asked 3×, unanswered** | Everything built assumes the **couple** picks (`event_activity_picks` is couple-scoped, the picker lives on their schedule page). Guests picking = a **guest-facing surface**, new RLS, new anon/guest-token path, probably a new table. **An order of magnitude more work.** | **Do not guess.** If it turns out to mean guests, treat it as a separate feature with its own spec — do not stretch the couple's picker to cover it. |
| Q2 | **Narrow `advance_schedule_block`?** Today it admits **any booked vendor**, so a caterer or florist can advance the run of show. | **asked once, recommendation given, not answered** | Only the UI hides it. **The moment anyone adds an advance control to any vendor surface, every supplier gets the wheel.** | **Yes, narrow it** — drop the blanket booked-vendor arm, keep couple + `schedule:edit` coordinator + admin, and move the couple arm to `current_couple_event_ids()`. ⚠ Check nothing depends on it first (`git grep advanceScheduleBlock`). Item E of the day-of handoff. |

### 🟡 Decided in principle, one detail open — **build anyway, do not wait**

| # | Question | Status | Recommendation |
|---|---|---|---|
| Q3 | **Emergency notice: four presets, or a free text box?** | asked 2×; behaviour decided 2026-07-29 (push a notice, read on demand), wording not | **Presets.** A free box works on night one and is a chat by the third wedding — at which point the host stops watching the corner, which is exactly when a real emergency arrives. They are string constants; swapping them later is a one-file change. **Explicitly non-blocking.** |
| Q4 | **Is the coordinator copied on the host's questions to the couple?** Owner said *"if the coordinators gets and approval to see it"* — is that approval **once per event**, or **per question**? | answered in principle, granularity open | **Once per event**, matching the per-feature access model already locked. Per-question approval is a consent prompt nobody will read. |
| Q5 | **Acknowledge-back on the emergency notice** — should "Got it" tell the coordinator he has seen it? | proposed, never answered | **Yes.** On a real floor it is the difference between telling someone and knowing they heard. Small; do it with the bubble. |

### 🔵 Design — an owner call, not a blocker

| # | Question | Status | Recommendation |
|---|---|---|---|
| Q6 | **Does the rounder/glass language get adopted on the live console?** The prototype's radius pass **diverges** from the shipped console, which is square-cornered (`ConsolePlate` = border + inset hairline). | flagged, not asked directly | The **notice** being glass and round is settled (it is a different *material* on purpose). Rounding the **whole console** is a separate visual decision — **do not adopt it as a side effect of building this feature.** |

### ⚪ Housekeeping — no product decision, someone just has to do it

| # | Item | Why it matters |
|---|---|---|
| H1 | **Refresh the canonical checkout** `/Users/icecasasola` | It was 1,455 commits stale and made shipped files look absent — the single most expensive trap here. |
| H2 | **How do parallel sessions claim work before starting?** | Two sessions built `floor_command` the same day and found out at merge; one PR was closed. Rule 0 could not catch it — the work did not exist when the search ran. **A process answer, not a code one.** |
| H3 | **Which to-do list survives the compile?** | ⚠ Already investigated: `Known_Todos_Pre_Pilot.md` and `LIVE_QA_WALKTHROUGH_2026-06-18.md` have **0 checkboxes each** — one is an audit permission-slip, the other an unfilled template. **`TEST_SCRIPT_E2E_2026-07-27.md` is the only real list.** Probably nothing to reconcile. |
| H4 | **Prune merged worktrees** | 1–2 GB each; ENOSPC deadlocks Bash. |

### Already answered — recorded so they are not re-opened

- **Do a host's notes travel between weddings?** → **No — per wedding.** His *questionnaire* travels as a template. (⚠ An earlier log entry wrongly said the questionnaire *superseded* notes; corrected 2026-07-29. They are different jobs: notes are what he says, questions are what he needs to know.)
- **Who alters the schedule?** → Coordinator; the event owner if there is no coordinator; **the emcee never** — for the *live* pointer. Planning is separate and shared (§10).
- **Where does his script live?** → The Customer Card, `/vendor-dashboard/clients/[eventId]/script`. **Not chat.**
- **Where does the couple answer?** → The working folder they already share with that vendor. **No new inbox.**
- **Guest list / coordinator broadcasts to suppliers?** → **Stay closed.** Not a gap.

---

## 12 · Prototypes — copy these, do not redesign

- **The emcee's phone on the night** — `0022_vendor_dashboard/MC_Desk_Prototype_2026-07-27.html`
  · <https://claude.ai/code/artifact/c714b04e-defa-4324-8729-d468659ef48d>
  Carries six layout rules that are properties of the build, not of the prototype: the scroll area
  needs `flex:1; min-height:0` or content is *unreachable*; `padding-bottom` does **not** reserve
  space in a scrolling flex column (use a spacer); cap the notice stack; the notice is glass and
  round because it is a different *material*; **opening a notice must never move the script**; and
  always offer **"Back to now"**.
- **Two phases, three lenses** — `0022_vendor_dashboard/Three_Lenses_Prototype_2026-07-29.html`
  · <https://claude.ai/code/artifact/7349e085-1b79-484b-9bc5-0c95bf869b65>
  The permission model made visible: planning vs the night × couple / emcee / coordinator, with a
  control ledger and the full capability matrix.
