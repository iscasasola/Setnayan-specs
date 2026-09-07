# 08 · Build order

Sequenced so nothing is built on a foundation that is about to move. Each step is a PR with its
own acceptance criteria. **Repo workflow:** fresh worktree off `origin/main`, a `changelog.d`
fragment with a `SPEC IMPACT` line, `gh pr create`, then `gh pr merge <PR#> --auto --merge`.

---

## Phase 0 · Make the data true  *(nothing renders correctly before this)*

| # | Work | Done when |
|---|---|---|
| **0.1** | **Shutter time.** `p_captured_at` on `papic_record_guest_capture`; carry `capturedAtMs` through `papic-sink.ts` and the offline queue; validate server-side. | A capture uploaded an hour late lands on the minute it was taken. A test proves a late upload does not move a bar. |
| **0.2** | **Bound the timeline read.** `captured_at` within the event's own days; a count-by-time-bucket aggregate for bar heights; presign only the opened bin. | With 100 pre-day captures seeded, the day's buckets still contain day-of photos. |
| **0.3** | **Per-layer visibility.** Guest layer → the `event` audience until `published`; exclusion server-side on the shipped viewer classes. | A stranger before publish receives no guest-layer node, no counts, no bar heights, no sheet contents. A test asserts the payload, not the CSS. |
| **0.4** | **Multi-day.** Select `event_end_date`; one segment per Manila calendar day. | A capture on day 2 never renders on a day-1 bar. |
| **0.5** | `events.story_cover_kind` + `story_cover_ref`; `events.previous_event_id`; `panood_broadcasts.peak_concurrent_viewers`. | Migrations applied; Ugat map updated (two required db-tests will tell you). |

## Phase 1 · The Story Maker  *(the host must be able to decide before anything publishes)*

| # | Work | Done when |
|---|---|---|
| **1.1** | Route rename → `/dashboard/[eventId]/story`; redirect the old path; Untold shelf points at it. | Old links resolve. |
| **1.2** | **The desk** — one loader unioning the four sources; accept/edit/reject writing to each table's own status column; consent state surfaced per card; partial accept on sets. | A host decides every item without leaving the page; a rejected item is silent; a held-back capture cannot be accepted. |
| **1.3** | Carry forward from the shipped editor: **The words** (2 + 4 behind a fold, clear-to-rewrite), **your own columns**, **manual wishes**, **direct photo upload**, **What goes in** with save-before-navigate, the caps, and the **PRO chips** (pending `07`). | Nothing the shipped editor could do is lost. |
| **1.4** | **Theme** — three modes; the mood board's own `SwatchPopover`; live six-stage preview. | Auto follows the board; "make my own" detaches; neutral is offered as a choice. |
| **1.5** | **Cover** — candidates, the eligibility check, three live previews, write to `story_cover_*`. | The shelf card and the OG card both change when the cover changes. |
| **1.6** | **Publish ladder** + the consent tick + "Feature our story in Stories" with its Event-Hub guard. | Publish is impossible with an undecided desk. |
| **1.7** | **What's next** — optional, nothing pre-selected; derived from `event-anchor.ts`; **Announce only** vs **Start it now**; writes `previous_event_id` on the tap. | Choosing nothing leaves the back cover absent. |

## Phase 2 · The Story

| # | Work | Done when |
|---|---|---|
| **2.1** | The spine: cover, dial (every bar opens, keyboard, HTML labels, full-width hit area), entries, gaps, layers. | Operable on a 390px phone and by keyboard alone. |
| **2.2** | The light: six stages from `role_palette.reception`, **contrast-corrected**, ink chosen per frame. | Automated contrast check across all six stages × the neutral + three sample palettes: body ≥ 12:1, muted ≥ 4.6:1, accent-as-text ≥ 4.5:1. |
| **2.3** | The lens: five states, driven by `event_schedule_blocks`. **No seating outside the reception.** | A ceremony minute shows rows; a roaming event shows no plan. |
| **2.4** | The index (11 tabs), find-in-this-day, Relive. | Search cannot surface what the viewer may not see. |
| **2.5** | Were you there? — own account only, the consent control, the 9:16 card. | No name field exists in the markup. |
| **2.6** | The locked close, the colophon, the back cover. | Nothing renders after the song except the colophon and, if named, the back cover. |
| **2.7** | Print (A3 · PDF · A4-per-minute) and share (FB · Messenger · Pinterest · link · 9:16). | The A3 QR returns to the living page. |

## Phase 3 · Everything that is not a wedding

| # | Work | Done when |
|---|---|---|
| **3.1** | Words from `event_type_profiles.terminology`; single-name masthead when `person_b` is null. | No hard-coded "couple" survives a source scan. |
| **3.2** | The solemn arm (or the refusal — `07` Q3). | A wake renders no Relive, no challenges, no anniversary. |
| **3.3** | Zero-supplier and no-venue empty states. | A hangout with no bookings shows no team tab and no #1-match tile. |

## Phase 4 · After publish

| # | Work | Done when |
|---|---|---|
| **4.1** | **Taken back**, the revalidation set, the version stamp (`07` Q6). | A guest's withdrawal reaches the story, the recap, the print route and the OG card. |
| **4.2** | Supplier reach: `?src=editorial&utm=story%3A{public_id}`; "how many reached them". | No copy anywhere promises identity. |
| **4.3** | Anniversaries — No. 2 opens with "Previously · No. 1". | The back cover becomes a live door. |

---

## Guard rules for every phase

* **A guard must test the claim, not a cheaper proxy.** A hand-written file list is not "anywhere".
  Prefer a walk + a reasoned baseline (`WEDDING_ONLY_BY_DESIGN` is the pattern).
* **Sabotage-check every new guard** — break the thing it protects, confirm it fails, restore.
* **One comment stripper** — `lib/strip-comments.ts`; the baseline may only shrink.
* **Never weaken a check to go green.**
