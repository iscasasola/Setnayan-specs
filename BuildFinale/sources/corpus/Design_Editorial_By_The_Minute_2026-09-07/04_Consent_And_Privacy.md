# 04 · Consent & privacy (RA 10173) — read before building anything above

Three of the review's blockers were here. These are not guidelines.

---

## 1 · The rules

| # | Rule | Why |
|---|---|---|
| **1** | **A person's day is exclusive to their own account.** No name field, on any surface, for anyone. "Were you there?" resolves from the signed-in guest's Papic link. | Owner ruling 2026-09-07. A name box let a stranger type "Bing" and learn who attended and where they sat. |
| **2** | **The public seating plan carries table numbers and photo-heat. Never names.** A guest sees **their own** table, and their tablemates, on their own account. | Shipped code has **no** public seating surface; the only shipped lookup is a guest finding their own seat by full name "as on your invite". **[review, blocker]** |
| **3** | **A guest's name and role render only where that guest asked to be named.** Otherwise the words run unnamed. | The DPO ruled this for guest columns: `guest_columns.author_named_publicly BOOLEAN NOT NULL DEFAULT FALSE`. The code treats a **role** as exactly as identifying as a name — there is one maid of honour. |
| **4** | **Every quoted voice declares its source** — Kwento · challenge · letter · the host's own. | The source determines the gate. A parent's words with no stated source have no consent behind them; attribute them as the host's retelling instead. |
| **5** | **A challenge answer needs five yeses**: share this answer · my captures may be public · screened clean · not opted out of photos · **named only if they asked**. | The first four are `challenge-answers-are-consented.test.ts`; the fifth is new and needs a column modelled on `author_named_publicly`. |
| **6** | **A capture's veto wins over the host's curation.** Vetoed → the blurred stand-in if one exists, else nothing. Veto unresolved → withhold everything. | `consent-veto.ts` `publicKeyForCapture` — monotone by construction: it can only ever show *less*. |
| **7** | **Nobody is ever named as the one who shot a photo**, and a 1–2-phone count beside a credited name identifies a single shooter — so per-table copy uses `event_tables.table_label`, never a person. | **[review]** |
| **8** | **The guests' layer is invisible to a stranger before publish** — including counts, bar heights, the minute sheet and the index. | **[review, blocker]** |
| **9** | **A guest can act on their own consent from the story.** "Hide it, or ask to be unnamed" — and it comes down everywhere, including the next print run. | Before this the host had every switch and the guest had none. |
| **10** | **The blur is all faces, not one.** A table of ten with one opt-out renders as ten blurred faces. Owner chose this knowingly 2026-08-18. Do not "improve" it into a partial blur without re-asking. | |
| **11** | **A count small enough to be a verdict is withheld** — a table with one or two photographs shows no count at all. ⚠ Its reason is **not** privacy (see `01` §5): the owner ruled it because *"this will subconsciously tell them they did not create enough memories for the story."* Recorded here because it *looks* like a privacy floor and will be mistaken for one — it must never be relaxed on the grounds that nobody can be identified. | Owner ruling 2026-09-09. |

## 2 · Two DPO questions — ✅ BOTH RULED 2026-09-09. Do not re-ask, do not re-decide in code.

* **Does the naming opt-in extend to Kwento? — YES.** A photo message carries a name only if the
  guest asked to be named; otherwise it runs unnamed, exactly as a letter does. ⚖ **The owner is
  the registered DPO** (NPC DPO system, 2026-07-07), so this IS the DPO ruling extending its own
  earlier one — not a proxy for it, and **not outside counsel**. It supersedes `DECISION_LOG`'s
  *"never put to the DPO and is NOT decided."*
  **Needs:** a column on `photo_messages` modelled on `guest_columns.author_named_publicly` —
  `BOOLEAN NOT NULL DEFAULT FALSE`, so the safe value is what a pre-existing row publishes as.
  🔑 **The role rides the same consent as the name.** There is one maid of honour; a role is
  exactly as identifying.
* **Are aggregate counts and bar heights public before publish? — NO.** A count is still the
  guests' data. A stranger sees flat baseline ticks, no counts, no heights, before publish.

## 3 · Withdrawal after publish ✅ BUILT — S14, 2026-09-09

The only `photo_consent = false` write is the host's guest form; its revalidations are
`/dashboard/${eventId}/guests` and `backTo` — **never** `/${slug}`, `/${slug}/recap` or
`/${slug}/print`. The guest's own "Not me" (`removeMyTag`) revalidates only `/${ev.slug}`.
Meanwhile `/[slug]/recap` and `/[slug]/print` are `revalidate = 300` and the OG card is
`max-age=3600, stale-while-revalidate=86400`.

**So a withdrawal used to come down on the next read and not before, and a printed copy never knew.**

> ✅ **SHIPPED 2026-09-09 — S14.** Every consent write now calls ONE list
> (`lib/a-withdrawal-reaches-every-copy.ts` · `everyCopyIsNowStale`), which stamps
> `event_editorial.story_version_at` and then throws away the story, the recap, the keepsake and
> the nested account URL. **The share card is busted by MOVING ITS URL** — `og:image` carries
> `?v={story_version_at}` — because `revalidatePath` cannot reach a `Cache-Control` header, and
> calling it on that route would have looked like a fix and done nothing.
>
> 🔑 **FOUR WRITERS NOBODY HAD COUNTED WERE FOUND BY DERIVING THE POPULATION RATHER THAN LISTING
> IT**, and they are the reason this section understated the problem:
> · the **account-level RA 10173 opt-out** (`optOutOfEventStory` — *"remove me from this event's
> story entirely"*) reached only `/dashboard/people`, the person's own account page;
> · the **RSVP selfie** and the **day-of face enrolment** both write `photo_consent = TRUE`, so
> they LIFT a veto — photographs the story was withholding become showable, and a change in that
> direction publishes exactly as urgently as one in the other;
> · **soft-deleting a guest un-vetoes every capture that tagged them**, because the veto reads
> opted-out guests `AND deleted_at IS NULL`. A widening hidden inside a delete. ⚖ Whether that is
> the right RULE is an owner question and was NOT changed — only the caches now find out.
>
> ⛔ **AND THE FOURTH STATE SHIPPED WITH IT** — `event_editorial.status` accepts `taken_back`; the
> ladder offers it only to a story that has actually been published.

> 🔴 **AND ONE CLAIM THIS CORPUS MADE ABOUT THE RECAP IS FALSE. THE NUMBER WAS RIGHT AND THE
> SENTENCE IT BECAME WAS NOT.** S8 recorded, in a merged PR and in two code comments, that
> `/[slug]/recap` *"does not read `event_editorial` at all — measured, 0 references in
> `recap/page.tsx` and `lib/auto-recap.ts`."* Re-measured on `origin/main` after S7 refused to
> restate it:
>
> ⚠ **RE-MEASURE; DO NOT QUOTE THE NUMBERS** (repo `CLAUDE.md` rule 7 — *an anchor is a string,
> never a number*). **The commands ARE the citation.** What they returned on 2026-09-09 is a dated
> observation, not a fact to carry forward — and this table is written this way BECAUSE the false
> sentence it corrects was itself a number quoted as a fact.
>
> | command | 2026-09-09 |
> |---|---|
> | `grep -c event_editorial apps/web/app/[slug]/recap/page.tsx` | 0 |
> | `grep -c event_editorial apps/web/lib/auto-recap.ts` | 0 |
> | `grep -n loadEditorialData apps/web/lib/auto-recap.ts` | the import · `assembleRecapModel` · `loadRecapCardData` · `heroUrl: editorial.heroPhotoUrl ?? …` |
> | `grep -n 'heroPhotoUrl: card.heroUrl' apps/web/app/api/og/recap/[slug]/route.ts` | present — **the chain reaches the SHARE CARD** |
> | `grep -c audience apps/web/lib/auto-recap.ts` | 0 |
>
> ⇒ **The recap reads the story's row ONE HOP AWAY, where a grep for a table name cannot see it.**
> Correct fact, invented consequence — the same shape as the migration-prefix belief this project
> has killed twice.
> ⚖ **What survives is the conclusion that was actually needed:** narrowing the story's audience
> does not hide the recap, because it has its own switch. That had to be measured on the word
> **`audience`**, not on the name of a table — a grep for the wrong noun gave the right answer for
> the wrong reason, and the wrong reason is what got written down.
> 🔑 **What does not survive is the half S14 turns on:** a withdrawal is FULLY binding on the
> recap. `loadEditorialData` applies the consent veto to the very hero the recap leads with, and
> that site deliberately keeps the DROP rather than the 2026-08-17 blur.
> ⚖ **AND THE RECAP INHERITS THAT DROP** (S7, 2026-09-09): its hero IS `editorial.heroPhotoUrl` —
> the very rung carrying the exemption — so the story and the recap refuse the same photograph
> today.
>
> 🔑 **THE DROP BELONGS TO THE ROLE — "lead image" — NOT TO A FILE.** Stated as *"do not change
> `data.ts`'s hero rung"*, the next person adds a FIFTH lead-image surface somewhere else and
> softens there in perfectly good faith, and nothing fails. Stated as a role, the rule travels
> with the job. S7 acted on it the right way round: the drop now lives inside `resolveStoryCover`
> itself (`if (veto.failed || veto.ids.has(photoId)) return null;` **before** the softener), so
> there is no second path for a lead image to soften through — **four surfaces, one answer, one
> place.**
>
> ⚠ **THE DEFECT THIS PREVENTED WAS LIVE, NOT HYPOTHETICAL** (fixed in PR #5370 before merge):
> a vetoed capture chosen as the cover would have been DROPPED at the top of the story and
> **published with every face blurred** on the `/realstories` shelf card and the 1200×630 share
> card. Three surfaces disagreeing about one photograph, and the two that disagreed were the
> published ones. ⚖ **The blur is not "safer than nothing" for a LEAD image** — owner ruling
> 2026-08-17 softened the gallery precisely so a group shot is not deleted, and the lead image is
> the one place that ruling deliberately does not reach.
> ⚠ **The false sentence had reached THREE copies** — and two of them were written by the session
> "correcting" it. Corrected in all three.
>
> 🔑 **AND IT WAS WRONG WHEN WRITTEN, NOT DRIFTED — the question was asked and then MEASURED
> rather than left open.** Re-run it yourself; the command is the anchor, never the count:
> `git log -S loadEditorialData -- apps/web/lib/auto-recap.ts` returns **exactly one commit**, and
> it is the file's own first — the day the Auto-Recap shipped, nearly three months before S8. The
> call was present both at S8's merge commit AND **at its parent**
> (`git show <merge>^1:apps/web/lib/auto-recap.ts | grep -c loadEditorialData`).
> **There is no version of this repository in which that sentence was true.** Not drift — it was
> never checked in the direction it was used, and it was published carrying the word *"measured"*,
> which is precisely what made two later sessions trust it without re-running anything.
>
> ⚖ **It cost a second session a defect it had not shipped yet.** S7 was about to close a
> cover-image gap by teaching `loadEditorialData`'s hero ladder to prefer the host's chosen cover
> — which, on this chain, would have silently propagated the story's cover onto the Auto-Recap and
> its share card, a fourth surface `02` §6 does not name, with its own switch and its own
> audience. It changed shape to a separate field on `EditorialData` that only the story's masthead
> reads. **A false line in a document is not inert; it is a design input.**

**⚠ VERIFY BEFORE TRUSTING THIS BLOCK:** `gh pr view 5371 --json state,mergedAt`.

**Fix — ✅ RULED 2026-09-09 AND BUILT THE SAME DAY (`07` Q6):** every consent write revalidates the
story, the recap, the print route and busts the OG card; the story carries a version stamp so a
printed copy can say which edition it is; and the Story Maker gains a fourth state — **Taken
back** — with the cache invalidation named.
🔑 **Say what the stamp cannot do:** a copy printed before this ships carries no stamp and can
never know. Paper cannot be recalled — the stamp lets a reader CHECK, it does not reach a printed
page. Never let copy imply otherwise.

## 4 · Copy that is already correct — keep it verbatim

* *"A guest who asked not to be shown is not here, or appears blurred — and is never named as the
  one who shot a photo. Their choice beats the host's curation."*
* *"Letters carry a byline only if the writer agreed to be named. The role rides the same consent
  as the name."*
* *"Every answer here passed five separate yeses…"*
