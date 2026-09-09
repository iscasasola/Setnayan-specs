# 08 · Build order

Sequenced so nothing is built on a foundation that is about to move. Each step is a PR with its
own acceptance criteria. **Repo workflow:** fresh worktree off `origin/main`, a `changelog.d`
fragment with a `SPEC IMPACT` line, `gh pr create`, then `gh pr merge <PR#> --auto --merge`.

---

## Phase 0 · Make the data true  *(nothing renders correctly before this)*

| # | Work | Done when |
|---|---|---|
| **0.1** | **Shutter time.** `p_captured_at` on `papic_record_guest_capture`; carry `capturedAtMs` through `papic-sink.ts` and the offline queue; validate server-side. | A capture uploaded an hour late lands on the minute it was taken. A test proves a late upload does not move a bar. |
| **0.2** | **Bound the timeline read.** `captured_at` within the event's own days; a count-by-time-bucket aggregate for bar heights; presign only the opened bin. 🔶 **DATA LAYER BUILT, PR [#5329] — NOT MERGED as of 2026-09-09 01:0x +08.** ⚠ It failed `typecheck + lint` on an UNRELATED guard (*native encoder tests*) that `main` itself passes; the branch was updated and CI re-run, auto-merge armed. **VERIFY WITH `gh pr view 5329 --json state,mergedAt` BEFORE TRUSTING THIS LINE** — a ✅ in a register is not evidence, and this corpus has been wrong about a PR's state five times. — `lib/story-day-window.ts` bounds both timeline reads (public loader + couple curation editor) to `event_date`..`event_end_date`; new `story_dial_bucket_counts` RPC serves zero-filled per-bucket COUNTs. ⚠ **"presign only the opened bin" is NOT built** — no dial UI exists yet to open a bin from (that's S9, Phase 2); there is no per-bin API route yet. ⚠ **The RPC does NOT apply the RA 10173 consent veto** — its counts are a ceiling, not guest-safe, until 0.3 lands; do not surface it on a public page ahead of that gate. | With 100 pre-day captures seeded, the day's buckets still contain day-of photos. ✅ verified — `tests/db/story-day-timeline-bounds.db.test.ts`. |
| **0.3** | **Per-layer visibility.** Guest layer → the `event` audience until `published`; exclusion server-side on the shipped viewer classes. ✅ **Q1 RULED 2026-09-09: no counts, no bar heights, to a stranger before publish.** ⛔ **NOT YET BUILT** — no per-layer flag, no gate on `story_dial_bucket_counts`'s counts, exists in the repo as of PR #5329. | A stranger before publish receives no guest-layer node, no counts, no bar heights, no sheet contents. A test asserts the payload, not the CSS. |
| **0.4** | **Multi-day.** Select `event_end_date`; one segment per Manila calendar day. 🔶 **BUILT, PR [#5329] — NOT MERGED as of 2026-09-09 01:0x +08** (same PR as 0.2 above; verify its state before trusting this line) — both timeline reads select `event_end_date`; "As the Day Unfolded" chapters are built per Manila calendar day (`manilaDayOf` groups before the decile split), not as one flat split across the whole event. | A capture on day 2 never renders on a day-1 bar. ✅ verified — `tests/db/story-day-timeline-bounds.db.test.ts`. |
| **0.5** | `events.story_cover_kind` + `story_cover_ref`; `events.previous_event_id`; `panood_broadcasts.peak_concurrent_viewers`; ✅ **and the `photo_messages` naming column** (`NOT NULL DEFAULT FALSE`) — Q2 ruled 2026-09-09. | Migrations applied; a signed-in read of `events` still returns rows (per-column grant allowlist); Ugat map updated (two required db-tests will tell you). |

## Phase 1 · The Story Maker  *(the host must be able to decide before anything publishes)*

| # | Work | Done when |
|---|---|---|
| **1.1** | Route rename → `/dashboard/[eventId]/story`; redirect the old path; Untold shelf points at it. 🔶 **BUILT, PR [#5337] — verify with `gh pr view 5337 --json state,mergedAt` before trusting this line.** A redirect STUB, not a `next.config.ts` rule: `one-event-hub-door.test.ts` asserts every `/website/<child>/page.tsx` exists on disk, and a config redirect deletes the directory. | Old links resolve. |
| **1.2** | **The desk** — one loader unioning the four sources; accept/edit/reject writing to each table's own status column; consent state surfaced per card; partial accept on sets. 🔶 **BUILT, PR [#5338] — verify its state before trusting this line.** ⚠ **IT NEEDED A MIGRATION**: two of the four sources had NO host-decision column at all — see `03` § Bonus. ⏭ **Partial accept on a SET is NOT wired** (the split arithmetic and its sentence are built and tested, but no source in these four tables yet delivers a multi-capture set). ⏭ **The "We made" lane is absent** — those cards live in `event_editorial.draft_json` and belong to step 1.3. | A host decides every item without leaving the page; a rejected item is silent; a held-back capture cannot be accepted. |
| **1.3** | Carry forward from the shipped editor: **The words** (2 + 4 behind a fold, clear-to-rewrite), **your own columns**, **manual wishes**, **direct photo upload**, **What goes in** with save-before-navigate, the caps, and the **PRO chips** (pending `07`). | Nothing the shipped editor could do is lost. |
| **1.4** | **Theme** — three modes; the mood board's own `SwatchPopover`; live six-stage preview. | Auto follows the board; "make my own" detaches; neutral is offered as a choice. |
| **1.5** | **Cover** — candidates, the eligibility check, three live previews, write to `story_cover_*`. | The shelf card and the OG card both change when the cover changes. |
| **1.6** | **Publish ladder** + the consent tick + "Feature our story in Stories" with its Event-Hub guard. 🔶 **BUILT (S8) — verify the PR's state with `gh pr view <n> --json state,mergedAt` before trusting this line.** Three rungs ported from the prototype, each naming who can see it; the gate is ONE pure function (`lib/publish-once-knowing-who-reads-it.ts`) called by both the button and `saveEditorial`, because a disabled button is not a fence. ⚠ **One departure from the prototype, deliberate:** it selects a state then presses a separate *"Publish the story"*; here **the rung IS the press** — the shipped editor's own decision (*"Save draft / Publish" made privacy a side effect of which button you reached for*), so "Publish is disabled" means the Published RUNG is disabled. 🔑 **Only the way UP is gated** — draft and guests-only always pass, because the consent fine print promises the host they can go back whenever. ⚠ **An unreadable desk refuses**, with its own sentence. **It also carried `03` §2.4 (the edition stamped once, with a database trigger) and `03` §2.8 (the room frozen at publish).** ⏭ The full revalidation set on a GUEST's consent write, the fourth state and the print version stamp stay with **S14**; an audience change here revalidates the story, the recap and the print sheet, because `/${slug}` alone left a narrowed story readable on two cached routes for five minutes. | ✅ Publish is impossible with an undecided desk — proved over all 24 combinations of the three facts × the three rungs, not a sample; the number is stamped once and the database refuses to move it (`the-number-is-stamped-once.db.test.ts`); going back to guests-only revalidates all three public routes. |
| **1.7** | **What's next** — optional, nothing pre-selected; derived from `event-anchor.ts`; **Announce only** vs **Start it now**; writes `previous_event_id` on the tap. | Choosing nothing leaves the back cover absent. |

## Phase 2 · The Story

| # | Work | Done when |
|---|---|---|
| **2.1** | The spine: cover, dial (every bar opens, keyboard, HTML labels, full-width hit area), entries, gaps, layers. 🔶 **BUILT, PR [#5342] — verify its state with `gh pr view 5342 --json state,mergedAt` before trusting this line.** ⏭ **The per-bin presign route (0.2's last clause) is STILL not built** — the minute sheet names the minute, its count, the place and the nearest written moment, and shows no photographs. | Operable on a 390px phone and by keyboard alone. ✅ verified in a running browser: no body-level horizontal scroll at 375px, and the dial is focusable, ←/→ walk the bins, Enter opens, Escape closes and focus returns. |
| **2.2** | The light: six stages from `role_palette.reception`, **contrast-corrected**, ink chosen per frame. 🔶 **BUILT, PR TBD (S10) — verify its state with `gh pr view <n> --json state,mergedAt` before trusting this line.** `lib/story-light.ts` derives the six and corrects them; the ground crossfades and the ink is chosen per frame; painted through the SHIPPED re-skin mechanism (three `--color-*` overrides on the wrapper, as `buildSitePaletteVars` already does for the couple's website), so no component changed a colour class. Server-painted at rest, so the page is legible with JS off. **It replaced a hard-coded `bg-[#e7e2d6]` that was every couple's story whatever they had saved.** | ✅ Contrast check across all six stages × the neutral + three sample palettes + **the shipped default and a real board read out of production**: body ≥ 12:1, muted ≥ 4.6:1, accent ≥ 4.5:1. 🔴 **TWO THINGS THE CRITERION COULD NOT HAVE KNOWN, BOTH MEASURED:** (1) at the `text-ink/55` the spine shipped with, **4.6:1 was unreachable by any ink** — pure black at 55% on the neutral morning paper is 4.54:1 — so the markup moved to `/60` rather than the floor moving to the markup; (2) **12:1 is unreachable mid-crossfade by any ink** — the worst ground a light→dark fade passes through allows 4.67:1 at most — so the contract is split: 12:1 **at rest** (this criterion, which is what it always meant), AA **in the fade**, plus a measured budget on the softened window, taken from 82% to 32% by easing the ground twice. |
| **2.3** | The lens: five states, driven by `event_schedule_blocks`. **No seating outside the reception.** 🔶 **BUILT, PR TBD (S10) — verify its state before trusting this line.** `lib/story-room.ts` derives the five; `no_venue` comes from `event_type_profiles.enabled_surfaces` / `layer_mode` (measured: `date`, `hangout` and `travel` carry no seating surface, `travel` is the roaming one). Owner lock 6 has ONE test, `seatsAreShown`, and a guard fails the lens if it compares the state inline instead. ⏭ **Tapping a table is NOT built** — that is the index's big room, S11. | ✅ A ceremony minute shows rows; a roaming event shows no plan; **no name appears in the seating markup at all** — guarded at the source over the stripped files, because a render test proves one fixture drew no name and cannot prove there is no PATH to one. ⚠ **The heat has nothing real to light in production yet** — see `03` § 1's correction: 0 of 14 photographs resolve to a table, because the one published story is a `date` with no guest list. |
| **2.4** | The index (11 tabs), find-in-this-day, Relive. | Search cannot surface what the viewer may not see. |
| **2.5** | Were you there? — own account only, the consent control, the 9:16 card. | No name field exists in the markup. |
| **2.6** | The locked close, the colophon, the back cover. | Nothing renders after the song except the colophon and, if named, the back cover. |
| **2.7** | Print (A3 · PDF · A4-per-minute) and share (FB · Messenger · Pinterest · link · 9:16). | The A3 QR returns to the living page. |

## Phase 3 · Everything that is not a wedding

| # | Work | Done when |
|---|---|---|
| **3.1** | Words from `event_type_profiles.terminology`; single-name masthead when `person_b` is null. | No hard-coded "couple" survives a source scan. |
| **3.2** | ✅ **The solemn arm — RULED 2026-09-09, build it.** Not the refusal. | A wake renders a story with no Relive, no challenges, no anniversary, no countdown. ⚠ The shipped refusal of the *joyful auto-composed recap* for a wake is untouched. |
| **3.3** | Zero-supplier and no-venue empty states. | A hangout with no bookings shows no team tab and no #1-match tile. |

## Phase 4 · After publish

| # | Work | Done when |
|---|---|---|
| **4.1** | ✅ **BUILT 2026-09-09 — S14, PR [#5371](https://github.com/iscasasola/setnayan-platform/pull/5371)** (verify with `gh pr view 5371 --json state,mergedAt`). One list (`lib/a-withdrawal-reaches-every-copy.ts` · `everyCopyIsNowStale`) stamps `event_editorial.story_version_at` and THEN invalidates — that order matters, because revalidating first races the write and re-caches the old card address for another hour. **The OG card is busted by MOVING ITS URL**, not by revalidating it: its `Cache-Control` is honoured by browsers, the CDN and every platform that already fetched it, and nothing on the server can reach that. ⏭ `/realstories/{slug}` is deliberately NOT in the list — its slug set is fixed and every entry renders a curated SAMPLE, so no real guest is on it. | ✅ A guest's withdrawal reaches the story, the recap, the print route and the OG card. ⚠ **A copy printed before this shipped carries no stamp and can never know — the copy on the sheet says so, and `the-stamp-never-promises-paper.test.ts` fails on the vocabulary of recall so no kind rewording can undo it.** ⚠ Nor does it reach a share somebody already posted: that post holds the old card address. |
| **4.2** | Supplier reach: `?src=editorial&utm=story%3A{public_id}`; "how many reached them". | No copy anywhere promises identity. |
| **4.3** | Anniversaries — No. 2 opens with "Previously · No. 1". | The back cover becomes a live door. |

---

## Guard rules for every phase

> ⚖ **AND THE HONEST FINDING OF THE 2026-09-09 PAIR RUN: NEITHER SESSION CAUGHT ITS OWN WORST
> DEFECT, AND EACH CAUGHT THE OTHER'S.** Four real defects in one PR and one in the other, all
> found after both were called done; **none came from a test either session had written**, and in
> several the session's own test was green while the code was wrong. Two sessions building
> adjacent surfaces and reading each other's reasoning found what neither suite did. **That is an
> argument for the review, not for the tests** — and a reason to run the two lanes side by side
> and talking, rather than merely not-colliding.
>
> 🔑 **THE RULE AND ITS APPLICATION ARE TWO DIFFERENT THINGS, AND WRITING THE RULE IS NOT DOING
> THE SECOND.** Measured 2026-09-09, in this build: a module carried the rule *"by the time this
> is called the withdrawal is already durable, so this never throws"* — spelled out, with its
> reasoning — and **twenty lines away in the same file**, three surfaces read a column with no
> such arm, one of them inside `generateMetadata` where a throw fails the entire page. **A version
> stamp could have taken down a couple's wedding page**, written by the session that had spent
> that day correcting exactly this shape in other people's work. When you write a safety rule into
> a docblock, grep the same file for the places it should already apply — that is where it will be
> missing.

* **A guard must test the claim, not a cheaper proxy.** A hand-written file list is not "anywhere".
  Prefer a walk + a reasoned baseline (`WEDDING_ONLY_BY_DESIGN` is the pattern).
* 🚨 **A GUARD THAT PASSES BY ABSENCE IS NOT A GUARD.** `CREATION_PATHS` in
  `lib/vendor-event-creation.test.ts` checks only the paths LISTED in it, so a new creation path
  goes green **by not being there** — the shop-account ruling silently does not apply to code
  nobody remembered to list. **Demonstrated, not asserted** (S7, 2026-09-09): a new path went
  green while unlisted; listing it and then deleting the gate took the suite from **10 pass** to
  **9 pass / 1 fail**. Compare `GUARDED_EVENT_INSERT_PATHS` in `lib/life-event-gate.test.ts`,
  which scans `app/` for `.from('events').insert(` and therefore **fails closed**. When you write
  a guard, ask what it does about a file it has never heard of; if the answer is "passes", it is
  decoration for exactly the case you are afraid of.
* 🪤 **SABOTAGE THE CASE THAT DISCRIMINATES, NOT A CASE.** A guard can be green for the only
  fixture where both the right rule and the wrong one give the same answer. Demonstrated (S7,
  2026-09-09): a *"a vetoed capture is never the cover"* test seeded a veto with **no baked
  stand-in** — and with no bake, the softener returns null anyway, so the test passed whether the
  code DROPPED the photograph or BLURRED it. Adding the arm that splits them (vetoed **and** a
  bake exists) took a sabotage from **9 pass / 9** to **8 pass / 1 fail**; the identical sabotage
  had been green before. **Ask which fixture the two behaviours disagree on, and seed THAT one.**
* 🚨 **NEVER `2>/dev/null` A COMMAND WHOSE OUTPUT YOU ARE ABOUT TO CALL EVIDENCE.** Print
  `exit=$?` and the byte count beside the number, and read all three. **`exit=128 bytes=0` is not
  a finding.** Demonstrated the hard way (S7, 2026-09-09) while checking somebody else's number:
  in zsh, `git show $r:apps/web/…` had **`:a` consumed as a history modifier**, so the path became
  `<sha>pps/web/…`; `git show` exited 128 with *"ambiguous argument"*, `2>/dev/null` threw the
  error away, and `grep -c` counted an empty stream and printed a clean, confident **0**. A
  message telling the other session their count was wrong was already being written.
  🔑 **This is the project's oldest disease in miniature — a failure that renders identically to
  emptiness — and ZERO IS THE MOST QUOTABLE NUMBER THERE IS.** It is exactly how the false
  `04` §3 line came to be published under the word *"measured"*.
* 🚨 **`generateMetadata` IS A RENDER-CRITICAL PATH — a read that can throw there takes the PAGE,
  not the tag.** Same read in a body degrades; in `generateMetadata` it fails the whole route, and
  the difference is invisible unless you notice which function you are inside. The Server
  Component equivalent is the same class one level up: a throw anywhere in
  `/dashboard/[eventId]/story` takes the desk, the editor, the theme, the cover, what's next AND
  the publish ladder together. **Every optional load on a page owes the page a fallback**; ask of
  each one *"if this alone fails, what does the person lose?"* — the honest answer must be **that
  one thing**. (S14 · S7, 2026-09-09 — both shipped this defect on the same afternoon.)
* 🪤 **AND A THRESHOLD GUARD CANNOT CATCH IT.** Measured (S7, 2026-09-09): with one load left
  UNGUARDED the file still contained **8** `try` blocks, so *"at least N tries"* would have been
  green on the exact defect it existed to catch. **Resolve each loader's POSITION against the
  enclosing block** — walk brace depth — and sabotage each one separately (each gave
  **2 pass → 1 pass / 1 fail**). Exercise the walker itself on inputs with known answers,
  **including a negative** (a call after the block closes): the measurement's own plumbing is a
  place the answer can be manufactured.
* 📐 **PREFER A DIFFERENTIAL MEASUREMENT TO AN ABSOLUTE ONE — it carries its own control.** A
  sabotage pair (`before: 1` → `after: 0`, same command, same path, one edit apart) is safe from
  every muzzle above **for a structural reason**: if the invocation were mangled, the BEFORE would
  have printed 0 too. It printed 1, so the command was well-formed, so the 0 that follows is a
  real absence rather than a broken pipe. 🔑 **The hazard is therefore not `|| true` or
  `2>/dev/null` as such — it is QUOTING AN ISOLATED ZERO.** Any lone 0 with no non-zero sibling
  from the identical command is unproven. (S7 · S14, 2026-09-09.)
* ✅ **A COUNT OF 0 NEEDS A POSITIVE CONTROL.** Run the same command at a revision, or against a
  file, where the string is KNOWN to exist. If that also says 0, the harness is lying, not the
  tree. (A non-zero count is self-validating; a zero never is.)
* 🤝 **WHEN YOUR MEASUREMENT CONTRADICTS A PEER'S, SUSPECT YOUR OWN COMMAND FIRST.** They had to
  run theirs to write the number down; you have run yours once. Both sessions on 2026-09-09
  reached the right answer this way and one of them nearly did not.
* 🔑 **A GREP FOR A TABLE NAME CANNOT SEE ONE HOP.** Measured 2026-09-09: `lib/auto-recap.ts`
  contains **0** occurrences of `event_editorial` and calls `loadEditorialData` at **two** call
  sites, which reads it. The zero was published as *"the recap does not read `event_editorial` at
  all"* and reached three copies. **Measure the noun your conclusion is about** — the claim that
  was actually needed there was about `audience`, which really is 0.
* **Sabotage-check every new guard** — break the thing it protects, confirm it fails, restore.
* **One comment stripper** — `lib/strip-comments.ts`; the baseline may only shrink.
* **Never weaken a check to go green.**
