<!-- Self-contained handoff for items 3-7 of WHATS_NEXT_Papic_Build_Order_2026-08-29.md, written
2026-08-29 because those items move to a DIFFERENT CLAUDE ACCOUNT. Everything needed is inlined.
No memory note is referenced, because none will exist. -->

# Papic items 3–7 — HANDOFF TO A NEW ACCOUNT (2026-08-29)

## § 0 · READ THIS FIRST

**You are on a new Claude Code account.** Assume:

- ❌ **`~/.claude/.../memory/` DOES NOT EXIST.** 476 memory notes were accumulated on the previous
  account and **none of them travel.** If any document you find writes `[[some_name]]`, treat it as
  a hint about a topic, **not a file you can open.** Everything you actually need for items 3–7 is
  inlined below.
- ✅ **Two git repos travel, and both are current:**
  - **specs / corpus** — `github.com/iscasasola/Setnayan-specs` → `~/Documents/Claude/Projects/Setnayan`
  - **code** — `github.com/iscasasola/setnayan-platform`
- ✅ **The live database and the live site travel** — they are the authority, above any document.

### How to verify ANY claim in here

This corpus has been wrong about a PR's state five separate times, and a migration comment is never
evidence. Three rules, and they are the whole method:

1. **Read the OBJECT, not the migration.** To know what a database function does, read its live
   body (`pg_get_functiondef`), never the migration that created it — functions are replaced and
   applied migrations are never edited.
2. **Read `origin/main`, never the shared checkout.** `git fetch`, then
   `git worktree add --detach ~/Documents/Claude/Projects/wt-read origin/main`. A local checkout can
   be hundreds of commits stale and will produce confidently wrong answers with real line numbers.
3. **Production self-reports its commit** at `/api/health`. A merge is not a ship — check the
   commit it names is an ancestor of what you expect.

### RULE 0 — the project's first rule

**Assume what you are about to build ALREADY EXISTS and your job is to locate and extend it.** This
codebase is ~2 years old. The owner has paid more than once to have a page rebuilt that already
shipped. **Sections 3–7 below pre-answer RULE 0 for each item** — that research is done; do not
redo it, but do re-verify a path before editing it.

---

## § 1 · The house rules that have each cost real work

Inlined because the notes recording them do not travel.

1. **Branch, then `git worktree add` IMMEDIATELY, beside the repo**
   (`~/Documents/Claude/Projects/wt-<name>`). **NEVER in `/tmp`** — on 2026-08-28 a finished,
   proved change was lost exactly that way, with zero commits ever made.
2. **`pnpm install` in the worktree before running anything.** A run in an uninstalled worktree
   means nothing.
3. **PUSH THE MOMENT IT TYPECHECKS.** An ugly WIP commit on the remote survives anything; a perfect
   working tree does not.
4. **Print the typecheck's exit code beside the error count.** An empty `tsc` log is NOT a clean
   one — it exits **134/144 on abort**. Two concurrent typechecks cause exactly that; never run two.
5. **Require `# tests` to be NON-ZERO** before believing any pass. Zero-tests-zero-failures is
   byte-identical to success and exits 0. ⚠ `npx tsx --test` on a path containing `[brackets]`
   matches nothing and prints a green zero — run such files by bare path with no `--test` flag, or
   `cd` into the directory.
6. **Mutation-test every guard and PRINT THE OCCURRENCE COUNT before → after.** An unmeasured
   sabotage proves nothing. **If a well-formed sabotage reports GREEN, suspect the sabotage before
   the guard** — three separate mutations in this project's history never landed and read as clean
   passes. ⚠ For an *append*-style mutation the anchor count does not move; prove it landed by the
   result changing, and say which measure you used.
7. **Strip comments before matching in a source guard.** Docblocks here quote the defect verbatim,
   so a raw-source match finds the disease and calls it the cure.
8. **`git fetch` and read the new tip before building.** Other sessions work this repo
   concurrently; `origin/main` moved three times during one planning session.
9. **Changelog fragment in `changelog.d/<branch-slug>.md`** — never edit `CHANGELOG.md` or
   `STATUS.md` directly.
10. **Auto-merge is the standing default:** `gh pr merge <n> --auto --merge` right after creating.
    **Except anything touching money logic** — open those as DRAFT and let the owner look.

### Two database traps that will bite items 3 and 6

- 🚨 **A NEW COLUMN ON `events` IS NOT DONE WHEN IT EXISTS.** That table revokes table-level SELECT
  and re-grants a **per-column allowlist**. A column without its own `GRANT SELECT (col)` makes
  PostgREST refuse the **whole query**, so every user-session read of `events` goes silently empty.
  You also need `GRANT UPDATE (col)` and the `events_host` view rebuilt.
  **`scripts/lint-events-column-grants.mjs` is the ONLY thing that catches this** — the db coverage
  tests structurally cannot, because their `before()` recomputes the allowlist over the new column.
  Worked precedent with both halves written out:
  `supabase/migrations/20271170068924_papic_uploads_open.sql:49-73`.
- 🪤 **Read a new column on its OWN round trip.** Naming an unknown column in a page's main event
  select makes PostgREST refuse that query, and the page answers an unreadable event with
  `notFound()` — turning a missing migration into **a live celebration rendering as missing**.

### And one about the test replay

`apps/web/tests/db/*.db.test.ts` replay migrations into an in-process Postgres. In that replay
`service_role` is created **`BYPASSRLS`** and tests largely run as superuser, so **a grant the
migration forgot passes green.** For anything touching grants or money: **dry-run the migration
against production inside `BEGIN…ROLLBACK` and put the transcript in the PR body.**

---

## § 2 · What Papic is, and the facts you will need

Guests photograph a celebration from their own phones — scan a code, the camera opens in the
browser, no app and no account — and photos sort back to the people in them. The couple receives
everything.

**The money model** (never type a number into a page; every figure is derived from live tables):

- **Free: 50 shots on every celebration** (`papic_event_pool_config.free_grant_points = 50`).
- **1 photo = 1 shot. A clip costs by length:** ≤2s = 2 · ≤3s = 3 · ≤6s = 5 · ≤10s = 8.
  Source of truth: `PAPIC_CLIP_COST_BANDS` in `apps/web/lib/papic-cameras-pure.ts`.
  ⚠ **An unmeasured clip costs the TOP band** — the duration is stamped by the browser, so failing
  expensive is the only safe direction.
- **16 top-up rungs, ₱50 → ₱11,200** (₱50 = 100 shots; ₱11,200 = 50,000). Repeatable, stacking.
- **Cameras are free and unlimited. The live wall is free** — `LIVE_WALL` is in `FREE_FOR_ALL_SKUS`
  (`apps/web/lib/entitlements.ts`) and both `eventOwnsSku` and `eventSkuActive` short-circuit true
  before any order read. **It is off the price list because there is nothing to buy** — do not read
  `is_active = false` as retired.
- **Dedicated credits are a FLOOR, not a ceiling** (owner-locked 2026-08-11): a capture spends a
  camera's own credits first and the pot pays the remainder. **Never build a ceiling out of them.**

**Production state, measured 2026-08-28** — and *empty is the plan, not a finding*: ~6 celebrations,
14 Papic photos, **0 face enrolments**, ~~0 orders that were ever paid~~ (FALSE — see below), **0 push subscribers**. Almost
nothing has been used by a stranger yet. **This is why almost every change below is safe by
arithmetic** — say so in the PR when it applies.

> 🚨 **CORRECTED 2026-08-30 — “0 ORDERS THAT WERE EVER PAID” IS FALSE, AND IT WAS
> BEING REPEATED INTO PR BODIES.** Measured against the live production database, not inferred:
> `select status::text, count(*), sum(coalesce(confirmed_total_php, requested_total_php, 0)) from public.orders group by status`
> → **paid 4 · ₱5,594** · **cancelled 2 · ₱548**, most recent **2026-08-29**. Real money has
> moved through this system. **“Safe by arithmetic because production is empty” may no longer be
> used unqualified.**
>
> ✅ **What survives, checked rather than assumed:** the paid rows are 3 × `ONBOARDING_SERVICES`
> (no `event_id`) and 1 × `SETNAYAN_AI`. **There is no `PAPIC_UNLOCK` / `PAPIC_UNLOCK_LTD` order in
> production at all**, so the pass branch every Papic gate consults still binds on nothing, and the
> blast-radius arguments for items 3–7 hold — for THAT reason, not for the one above.
>
> 🔑 **The line was TRUE when written and rotted within days** — the first paid order landed
> after this handoff was authored. **Re-measure; cite the QUERY, never the count.** Repo `CLAUDE.md`
> rule 7 as of C10b: *an anchor is a string, never a number.*

---

## § 3 · ITEM 3 — Shots per guest  *(the big one; start here)*

**Full spec, already written: [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md).
Session breakdown: [`WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md).**
Read both. They carry the file:line evidence and the full trap list. Summary here so this handoff
stands alone.

### What it is (owner, 2026-08-28)

> *"we can allot specific numbers for each guest. but also allow for the rest to share the other
> shots equally, and the excess can be used by anyone."*

**Three tiers:** named guests get a specific number each · everyone else splits the remainder
equally · whatever is left after that division is anyone's.
**It is a CEILING, NOT A RESERVATION** — nothing is carved out, so no per-guest wallet, no refunds,
no new price. **Capping everyone IS the guarantee:** if every other guest is capped at their share,
none of them can reach yours; the ceiling does the reserving by arithmetic.

### ⛔ THREE OWNER DECISIONS ALREADY MADE — DO NOT RE-ASK

1. **Unused shares:** a **button** — *"open the rest to everyone"* — **plus an automatic release**
   in the celebration's last stretch. ⛔ *Sharing only among guests who have started shooting* was
   **offered and rejected**: everyone's number would shrink as more people join, and **a number
   that gets worse on its own is a broken promise.** Do not re-propose it.
2. **Shots a guest BOUGHT:** *"both. they can claim it all or share it to everybody."* At purchase
   the guest picks **keep them for me** (outside the couple's ceiling) or **add them to the
   celebration** (into the shared pot; they revert to an ordinary share).
3. **A named guest's unused shots STAY HERS.** The release opens tiers 2 and 3 only. If she never
   arrives they go unused — and the couple lowering her allotment returns them, so nothing is ever
   permanently stranded.

### RULE 0, pre-answered — most of this exists

| Piece | State | Where |
|---|---|---|
| A per-guest ceiling | **WRITTEN, INERT** — hardcoded `150`, disarmed on every pool event | `supabase/migrations/20270920602517_guest_capture_restore_ugc_gates.sql:37,111-135` |
| A per-guest counter, advisory-locked | **SHIPS** | same file, :118-126 |
| Its refusal (`quota_exhausted`) | **SHIPS**, and the route already unwinds it | same file :126-134 · `apps/web/app/api/papic/guest-capture/route.ts:529-549` |
| Everything the share arithmetic needs | **SHIPS in one call** — `papic_event_pool_status(event_id)` returns `guest_count · total_points · used_points · remaining_points · soft_stop_at` | `supabase/migrations/20271131476413_papic_host_hands_out_shots_to_a_camera.sql:129` |
| Moving shots between a camera and the pot | **SHIPS** — `papic_dedicate_shots` takes a **TARGET, not a delta**, so giving and taking back are the same call | same migration |
| A place for the couple to choose | **DOES NOT EXIST** | — |
| A per-capture cost, stored | **DOES NOT EXIST** | — |

### Where it is enforced — and nowhere else

**Inside `papic_record_guest_capture`.** It is the one object an anonymous direct PostgREST caller
still reaches (`20271114597183_close_anon_camera_points_grant.sql:35` keeps its EXECUTE for `anon`
deliberately). A ceiling in the route or a helper is bypassable.

- ⛔ **`CREATE OR REPLACE` the newest body. DO NOT ADD AN OVERLOAD** — three live overloads exist
  and the route has a signature-fallback ladder that would **silently skip** a ceiling on a new
  signature.
- ⛔ **Never take the ceiling from the caller.** A sibling function was closed for exactly that
  (`p_limit IS NULL ⇒ unconditional TRUE`). Read the couple's number from a table inside the
  function.
- **Make the pool yield conditional:** today
  `v_unlimited := v_unlimited OR COALESCE(v_pool_applies, FALSE)`. After: the pool only disarms the
  per-guest gate **when no ceiling is set.** With none set this is byte-equivalent to today.

### Count SHOTS, not pictures

The existing gate counts `COUNT(*)` rows. A clip costs up to 8, so a guest given 12 could spend 96
of the pot. **Add `papic_guest_captures.points_cost`**, written by the record function from the cost
it is already given, and compare `SUM(points_cost) + this_cost <= ceiling`.
⛔ **Do NOT derive the clip bands in SQL** — that is a second copy of a money rule.
⚠ The count must **not** filter `hidden_at` — hiding a capture must never reset the meter.
⚠ `mode=web_copy` follow-ups are **not captures** and must never be metered.

### 🔴 The offline rule — a shot already taken is HONOURED

`apps/web/lib/offline/service-handlers/papic-drain.ts` holds `PAPIC_TERMINAL_ERRORS`. A refusal it
does not recognise **falls through to the queue and retries up to 50 times until a 7-day TTL evicts
it silently** — its own docblock records the cost: *"They finish the night believing they captured
dozens of photos that do not exist."* Registered as terminal, the shot is **thrown away**.

⚖ **Neither is acceptable. A guest watched themselves take that photograph.** The ceiling stops you
*taking* more; it does not reach back and destroy one you already took. **A drained offline capture
is admitted above the ceiling.** The pot still binds — that is the money gate, and it is untouched.
**Decide this classification explicitly and test it.**

### The three surfaces

- **The control centre** (`apps/web/app/dashboard/[eventId]/studio/papic/`): a `SettingRow` in
  *"Set once, change any time"*, opening a sheet — a number for everyone else, **naming guests off
  the guest list with an amount each** (the real new UI), a live *"120 guests · 8 named · everyone
  else gets 14 each · 32 spare"* line, and the release button. Copy the save path of
  `setPapicUploadsOpen` in that folder's `actions.ts` exactly: **post the value, never flip what you
  last saw**; *"a blank box is not zero"*; and **wire the outcome params THREE ways** or
  `_lib/outcomes-are-shown.test.ts` fails. ⚠ `shots_set` / `shots_error` are already taken.
  ⚠ The row must not render where guests cannot shoot.
- **The guest's camera + the Event Hub**: the pill already exists; add a **low state** before zero
  (there is none today) and the **honest refusal** with its own status, asked before the generic 409
  branch, **in both the photo and clip handlers** (two copies).
- **The promotion page**: only after the other two ship.

### ➕ One addition made 2026-08-29: sponsors default to a bigger share

`apps/web/lib/event-sponsors.ts` already models **principal sponsors** (one enum value; `side`
distinguishes **ninong** from **ninang**; `pair_index` couples each pair) plus **cord · veil · coin ·
candle** sponsors. **Nothing acts on it.** Defaulting an allotment by role is a small addition
inside this work, and it collects a differentiator the competitive research calls *"genuinely first,
nobody has it."*

### Sequence — four PRs, order fixed

1. The number's home + `points_cost` + the gate + the conditional yield. **Inert on merge** — no
   celebration has a ceiling set.
2. The couple's control. ⛔ **Never merge 2 before 1** — *gate the write, not the button.*
3. The guest's counter, low state and honest refusal. **Must land before anything is said publicly.**
4. The promotion-page claim.

### Proving it

**The ceiling must be proved to BIND on a real pool event**, not merely to exist. **Four limits on
this exact surface have shipped governing nothing** — the free tier was unmetered for weeks;
`papic_tier_config.points_per_day` is NULL on every active tier; the per-guest 150 is yielded on
every pool event; and `vendor_papic_capture_configs.photo_cap`/`clip_cap` have no reader at all.
A test that only asserts the column exists proves nothing.

---

## § 4 · ITEM 4 — Timed challenges reach the wall  *(small)*

**Owner ruled 2026-08-28:** *"we can add a timed challenge."*

**RULE 0, pre-answered — measured 2026-08-29:**

- ✅ A library of **500+ prompts** ships — `apps/web/lib/papic-challenge-pool.ts`
  (`CHALLENGE_POOL`, `CHALLENGE_POOL_FLOOR = 500`), categorised and filtered by event type
  (`fitsEventType`). Siblings: `papic-challenge-categories.ts`, `papic-challenge-picker.ts`,
  `papic-challenge-sql.ts`, `papic-missions.ts`.
- ✅ A challenge can already be **armed on a guest's camera** — `armedChallenge` in
  `apps/web/app/papic/guest/_components/papic-guest-capture.tsx` renders *"Next shot: {prompt}"*.
- ✅ The couple already manages them —
  `app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx` and `challenges/`.
- ❌ **A challenge has NO concept of time at all** — grep `papic-challenge-pool.ts` for
  `expires|deadline|countdown|starts_at|ends_at|duration`: nothing.
- ❌ **The wall renders no challenge** — grep `app/wall/[eventId]/_components/wall-projection.tsx`
  for `challenge`: nothing.

**Build:** a time window on a challenge, the wall rendering it with a **countdown**, and a **live
count of who has answered**. That is the whole delta.

⚠ **Competitive note, so it is not oversold:** photo challenges are **table stakes** — two rivals
ship them. **The wall half is the differentiator**, not the existence of challenges.

---

## § 5 · ITEM 5 — Challenges hang on the ceremony sequence  *(small)*

**RULE 0, pre-answered:** `apps/web/lib/kwento-moments.ts` already carries the Filipino ceremony
sequence in order — bridal march · exchange of vows · **veil & cord** · first kiss · leaving the
church · cocktail hour · newlywed entrance · first dance · cake cutting · **money dance**.

**The challenge library exists. The sequence exists. Nothing joins them.**

**Build:** key the prompt library to those markers so a coordinator picks a ceremony and gets a
schedule of challenges, instead of writing prompts from scratch. Two minutes of setup instead of
twenty.

⚠ Do **not** invent a new ritual list — use `KWENTO_MOMENTS`. A second list is a second copy that
will drift.

---

## § 6 · ITEM 6 — The guest chooses per audience  *(small, and the clearest market gap)*

**Nothing in the scanned competitive field lets a guest decline facial recognition. We already do.**
The finish is letting them choose **per audience**: *"keep me off the big screen but leave me in
their album"* is a sentence real people say and no product can express.

**RULE 0, pre-answered — the four audiences are ALREADY separate in the read paths:**

| Audience | Its gate today |
|---|---|
| The live wall | `guests.faceblock_enabled` — and `apps/web/lib/face-blur.ts` **bakes a server-side blurred derivative** (`wall_safe_r2_key`) which the wall REQUIRES. Fail-closed. |
| The shared gallery | its own control in `lib/data-privacy-controls.ts`, AND-gated with a flag; its read *"bakes the FaceBlock blur rule, the photo_consent veto, and web-copy-only keys"* |
| The couple's archive | always delivered — the untagged-still-delivered guarantee, which has no exception |
| Personal delivery | the guest's own tagged set |

Two independent guest flags already exist — `faceblock_enabled` and `photo_consent` — and
`lib/face-blur.ts` reads **both**.

⇒ **We are NOT retrofitting consent into a single face collection.** External advice calls this *"a
schema migration, not a sprint"*; **for us that is not true.** The surfaces exist; only the guest's
choice is missing. See
[`research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md`](research/STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md) § 2d.

**Also true and worth knowing:** deletion on withdrawal already ships —
`withdrawFaceConsent` in `app/[slug]/actions.ts` deletes the enrolment, the vector and the source
selfie in R2 — plus an automatic sweep **three months after the celebration ends**
(`lib/face-data-retention.ts`). ⚠ **Face Block SUPPRESSES; deletion is a separate control.** Do not
say "face-blocking deletes"; say deletion is offered and enforced.

**Ship a plain consent receipt with it** — what was collected, why, for how long, how to undo it.

⚠ **Design the opt-out path to be feature-equivalent.** A guest who declines face matching must
still get a good experience — manual browsing, filters, upload access. Do not build a degraded path.

---

## § 7 · ITEM 7 — The year  *(a project, not an adjustment)*

**The product question is already settled. Only the building is open.**

**Owner-locked 2026-07-15** (`Composable_Event_Build_Map_2026-07-15.md`):

> A separate **occasion** — engagement party · bridal shower · bachelor/ette · prenup getaway — is
> **its own celebration**, with its own date and guests, shown as a **linked cluster** beside the
> wedding. A multi-day celebration is **ONE celebration with several days**, never a bundle of
> sub-events. Lodging is never an event.

**Measured 2026-08-29:**

- ❌ **Nothing links two celebrations in code** — no parent, no cluster, no relation. The linked
  cluster is **specified and unbuilt.**
- ❌ **The shot pot is strictly per-celebration by construction** — `papic_event_pool_config`,
  `papic_reserve_event_points(event_id)`. **One pot across a year changes the primitive people pay
  for**, not a display.

**⚠ Two of the seven "chapters" in circulation do NOT fit the lock.** A **tasting** and a **venue
walkthrough** are appointments with no guests — under our own rule they are not celebrations at all.
Calling them chapters invents a third kind of thing. **Decide that deliberately; do not let a
drawing decide it.**

**✅ AND ITEM 3 ALREADY PROTECTED THIS BY ACCIDENT.** Item 3's share is **derived at spend time,
never stamped** — decided because the pot and the guest list both move. That is exactly what makes
the year survivable: a stamped share would have to be torn out; a derived one just asks a different
question. **Do not "optimise" it into a stored value.**

**Why it is worth the most:** it is the only play nobody can copy in a quarter, because it needs a
planning platform underneath — a guest list and dates months ahead. A standalone photo app has
nowhere to put a year.

---

## § 8 · Order, and what may run beside what

| # | Item | Size | May run beside | Never beside |
|---|---|---|---|---|
| **3** | Shots per guest | several sessions | 4 · 5 | 6 (both touch capture gating) |
| **4** | Timed challenges on the wall | 1 session | 3 · 5 · 6 | — |
| **5** | Challenges on the ceremony sequence | small | 3 · 4 · 6 | — |
| **6** | Guest chooses per audience | small | 4 · 5 | 3 |
| **7** | The year | project | — | everything (do it alone) |

**Recommended order: 3 → 4 → 5 → 6 → 7.** 4 and 5 are the cheapest visible wins and can fill gaps
while 3's PRs wait on review.

---

## § 9 · What NOT to do

1. ⛔ **Do not re-ask item 3's three decisions.** They are ruled and recorded in § 3.
2. ⛔ **Do not start Messenger or Viber delivery.** Web push is **already built, mounted and wired
   to 108 emit sites — and has never had a single subscriber in production**
   (`lib/web-push.ts`, `lib/push-actions.ts`, `lib/notification-emit.ts`). **Ask for push at the
   moment a guest scans the QR at the venue first** — the best permission moment this product will
   ever get, and we never ask. Zero policy risk, already built. ⚠ Note the product currently
   **blocks** guests naming Viber/Messenger in chat (`lib/chat-contact-filter.ts`) so relationships
   do not walk off Setnayan — compatible, but make it a knowing decision.
3. ⛔ **Do not claim any of these on any page:** a latency or speed figure (nothing measures one) ·
   per-guest limits as ours alone (a rival already ships them — **ours is limits PAIRED WITH A LIVE
   WALL**) · chapters/the year before it exists · *"the live service closes after six months"*
   (**nothing closes** — six months is the SHOOTING window; lead with the lifetime archive) ·
   dollar prices · a `papic.setnayan.com` subdomain · *"Papic Pool"* or *"Papic One"* (retired
   names) · **unlimited uploads, ever**. Full list:
   [`PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md`](PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md) § 3.
4. ⛔ **Do not build the per-guest ceiling out of dedicated credits.** *Dedicated is a FLOOR, not a
   ceiling* is an owner lock and the opposite semantic.
5. ⛔ **Do not reuse `papic_tier_config.points_per_day`.** It is per-camera-per-DAY, tier-keyed,
   NULL on every active tier, and the authoritative reserve never consults it.
6. ⚖ **The coordinator partner offer is OWNER territory, not engineering** — and it is how the
   strongest local rival actually wins. Do not scope it as a build.

---

## § 10 · The documents that travel with this

All in the corpus repo, all pushed:

- [`WHATS_NEXT_Papic_Build_Order_2026-08-29.md`](WHATS_NEXT_Papic_Build_Order_2026-08-29.md) — the
  seven items and why they are in that order
- [`WHATS_NEXT_Shots_Per_Guest_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_2026-08-28.md) — item 3's
  full spec, with every trap
- [`WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md`](WHATS_NEXT_Shots_Per_Guest_SESSIONS_2026-08-28.md)
  — item 3 broken into sessions
- [`PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md`](PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md) — what may
  and may not be claimed on either Papic surface, plus the design locks
- [`research/`](research/) — two volumes of competitor research, the feature strategy, and
  **`STRATEGY_DOC_CHECKED_AGAINST_THE_CODE_2026-08-29.md`**, which corrects all three against what
  we actually run
- [`prototypes/papic_promotion_page_2026-08-28.html`](prototypes/papic_promotion_page_2026-08-28.html)
  and [`prototypes/papic_control_center_2026-08-25.html`](prototypes/papic_control_center_2026-08-25.html)
  — the drawings
- `DECISION_LOG.md` — search it for `2026-08-28` and `2026-08-29`
