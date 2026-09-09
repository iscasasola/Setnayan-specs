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
| **1.6** | **Publish ladder** + the consent tick + "Feature our story in Stories" with its Event-Hub guard. | Publish is impossible with an undecided desk. |
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
| **4.1** | ✅ **Taken back, the revalidation set, the version stamp — ALL RULED 2026-09-09, build all three.** | A guest's withdrawal reaches the story, the recap, the print route and the OG card. ⚠ A copy printed before this ships carries no stamp and can never know — never imply otherwise. |
| **4.2** | Supplier reach: `?src=editorial&utm=story%3A{public_id}`; "how many reached them". | No copy anywhere promises identity. |
| **4.3** | Anniversaries — No. 2 opens with "Previously · No. 1". | The back cover becomes a live door. |

---

## Guard rules for every phase

* **A guard must test the claim, not a cheaper proxy.** A hand-written file list is not "anywhere".
  Prefer a walk + a reasoned baseline (`WEDDING_ONLY_BY_DESIGN` is the pattern).
* **Sabotage-check every new guard** — break the thing it protects, confirm it fails, restore.
* **One comment stripper** — `lib/strip-comments.ts`; the baseline may only shrink.
* **Never weaken a check to go green.**
