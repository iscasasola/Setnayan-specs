# 07 · Open questions — the owner's, not engineering's

Eight. Each carries what the design does **today** so nothing is blocked, and what changes if the
answer differs. **None of these should be settled in code.**

---

## ✅ RULED 2026-09-09 — FIVE OF THEM. DO NOT RE-ASK.

Owner, presented with all five defaults side by side and what each costs: **_"follow your
recommendations"_**. Each recommendation was written out in full before he answered; he adopted
them as a set, he did not reason each one independently, and this file records it that way on
purpose.

| | Ruled | Unblocks |
|---|---|---|
| **Q1** | **NO.** Before publish a stranger sees a flat baseline and no counts. | **S3** |
| **Q2** | **YES** — the naming opt-in extends to photo messages. Unnamed unless the guest asked. | **S5** + one column in **S4** |
| **Q3** | **The quiet arm.** A wake gets a story, with the joy taken out — not a refusal. | **S13** |
| **Q6** | **BOTH: build "Taken back", and stamp the edition on every printed copy.** ⚠ Read the correction under Q6 — the row he was shown described today's brokenness, not a recommendation, and this is what was actually recommended in its place. | **S14** |
| **PRO** | **Keep the gate exactly as shipped.** The prototype's ungated screens were an omission, not a repricing. | **S6** |

⚖ **Q2 IS A DPO RULING AND THE OWNER IS THE DPO** (registered on the NPC DPO system 2026-07-07),
so his answer is the extension of the guest-columns ruling, not a proxy for one. It is **not**
outside counsel and must never be written up as "counsel cleared".

✅ **TWO MORE RULED 2026-09-09, both direct to the session that asked (S10). Do not re-ask.**

| | Ruled | Where it lives |
|---|---|---|
| **The loudest table's colour** | **GOLD** — *"gold is fine"*. Fixed, exactly as the prototype draws it; **not** derived from the couple's board. S10 had shipped it in their own accent, reasoning from owner lock 2, and flagged the departure; he was shown both and chose the gold. 🔑 **The loudest table is candlelight, not a swatch** — lock 2 governs the story's paper and its ink, not every mark on the page. ⚠ Its RIM is still corrected per light-stage, because the fixed gold measures only ~1.9:1 against the daylight grounds and would otherwise vanish as an edge. | `CANDLE` in `lib/story-light.ts` |
| **Small counts** | **WITHHELD** — *"yes that's the ruling"*, confirming the ruling S6 relayed. A table with one or two photographs shows a reader nothing. 🔑 **His reason was not the one he was asked** (it was put as privacy): *"this will subconsciously tell them they did not create enough memories for the story"* — so it is the rule that **the story never passes judgement on the day it is telling**, and it is HOUSE STYLE for any small number anywhere in the story, not a seating special case. | `SMALL_COUNTS_ARE_A_VERDICT` in `lib/story-room.ts` |

⏭ **STILL OPEN AND NOT RULED: Q5 · Q7 · Q8, and the Featured price.** None of them blocks a
session.

---

### Q1 · Are aggregate counts and bar heights public before publish?

> ✅ **RULED 2026-09-09 — NO.** A count is still the guests' data. Flat baseline ticks and no
> counts to a stranger before publish. What tempts a session to reverse this — that the live day
> is more compelling to a stranger with the pulse showing — is precisely the trade that was
> declined. **Do not re-ask.**

The dial's bar heights, "492 captures", "26 phones" — these describe the guests' layer without
showing any of it. Is that "the pulse of the day", fair to show a stranger during the event? Or is
a count still the guests' data?

**Today:** QR-only. A stranger before publish sees flat baseline ticks and no counts.
**If public:** the live day becomes far more compelling to a stranger, at the cost of telling
them how busy someone else's wedding is.

🔴 **CORRECTED 2026-09-09 (S10) — THIS PARAGRAPH SAID "STILL UNANSWERED" THREE INCHES UNDER THE
RULING THAT ANSWERED IT.** Q1 **is** ruled — NO — at the top of this file and in `09`'s gate table.
The stale sentence is the same failure `03` § 2.5 already records happening to *this exact
question* once before: the VALUE was right everywhere, the sentence beside it was not, "which is
exactly how a settled owner question gets asked a second time". **Do not re-ask it.**
S3 shipped (PR #5331) built to that ruling. The answer is a single named constant,
`COUNTS_ARE_THE_GUESTS_LAYER` in
`lib/the-guests-layer-is-theirs-until-you-publish.ts`: `true` today (counts and bar heights are the
guests'), `false` makes them the host's layer and public as the day happens, while the captures
themselves stay behind the gate either way. **Flipping it is one line and needs no other edit.**

✅ **S10 PUT THE FLOOR PLAN'S HEAT BEHIND THE SAME CONSTANT (2026-09-09).** How many photographs
came from each table is the same fact the dial draws, asked per seat instead of per minute — so it
rides this ruling through `drawnHeat()` in the same module. Gating the dial and forgetting the room
would have published the day's shape on the surface where it is easiest to read: a stranger could
not see the bars, and could see which table was loudest.

---

### Q2 · Does the Kwento naming opt-in match the letters'?

> ✅ **RULED 2026-09-09 — YES, it extends.** A photo message carries a name only if the guest
> asked to be named; otherwise it runs unnamed. Needs the new column on `photo_messages` modelled
> on `author_named_publicly`, **NOT NULL DEFAULT FALSE** — the default is the safe value, so a row
> that predates the column publishes unnamed. ⚖ The owner **is** the registered DPO, so this is
> the DPO ruling itself. **Do not re-ask, and do not write it up as outside counsel.**

The DPO ruled for guest columns: name hidden by default, being named is the opt-in
(`guest_columns.author_named_publicly`). `DECISION_LOG` states plainly: *"Whether the ruling
extends to photo messages was never put to the DPO and is NOT decided."*

**Today:** assumed **yes** — Kwento shows unnamed unless the guest asked. Needs a new column on
`photo_messages` modelled on `author_named_publicly`.
**If no:** names flow from the roster as they do now, and the design's consent copy is wrong.

---

### Q3 · Does by-the-minute refuse the solemn register?

> ✅ **RULED 2026-09-09 — arm (b), THE QUIET ARM.** A wake gets a story: no Relive, no
> challenges, no anniversary, no countdown, and the family's words. Filipino wake culture is
> served by a page that records five nights, the mass, and who came from abroad.
> ⚠ **This does NOT reverse the shipped refusal of the joyful auto-composed recap for a wake** —
> that stays refused. Two different things: the recap composes itself in a joyful voice with
> nobody's hand on it; the story is written by the family. Key the gate on the **register**, never
> on a surface flag.
>
> ✅ **BUILT 2026-09-09 — S13, `08` step 3.2. Q3 is CLOSED.**
> 🔴 **The two things were already ONE gate, which is why the story was missing.**
> `solemnAdjustedPhase` demoted BOTH `save_the_date` and `editorial` to `rsvp`, and the story lives
> in the editorial phase — so the gate that withheld the recap withheld the story with it, and a
> wake got no story at all. It now demotes `save_the_date` only.
> 📏 **The recap's refusal was MEASURED before the phase was granted**, rather than trusted:
> `composeCopy`'s joyful output is not rendered on the story page at all (S9's spine *"replaced the
> masthead and the lead"*), and the only field the story still takes from the composer is
> `pullQuote` — the host's own `special_message`. The body reads `data.draft.leadParagraphs`
> falling back to the host's own prose. Every sentence a wake's story can print was typed by the
> family, so granting the phase resurrected nothing. The composer's joyful voice reaches a reader
> only through `/[slug]/recap` (host-published) and the print sheet.
> 🔑 **Relive is gated on the REGISTER, never on `slides.length`** — a wake HAS minutes, so an
> emptiness gate is green on the empty story and wrong on the real one.

Shipped code refuses the joyful recap for a wake outright. Two arms:
**(a) refuse** — a wake keeps its ordinary page, as today;
**(b) the quiet arm** — the story runs with no Relive, no challenges, no anniversary, no
countdown, and the family's words.

**Today:** (b) is built and demonstrable. Filipino wake culture is genuinely served by a page that
records five nights, the mass, and who came from abroad — which argues for (b). It is still yours.

---

### Q4 · Five written minutes, or the ten locked moments?

Spec §3 locks ten canonical moments (Bridal March … Money Dance) and the editor offers them as a
datalist. The story writes a few and lets **every bar** open.

**Today:** a few written + every bar openable (owner lock 4). This **supersedes** §3's framing for
the story surface; §3 still governs the schedule tapper and the print keepsake.
**Needs:** a `DECISION_LOG` row saying so, or a correction.

---

### Q5 · What does the edition number count for a non-wedding story?

> ⏭ **STILL OPEN — not ruled 2026-09-09.** Blocks nothing; it stays filtering weddings with the
> reason recorded, which is a filter not to flip quietly.

`editionNo` counts **weddings** in the awards cycle. For a debut, is "No. 7" the seventh wedding
(meaningless), the seventh **story** of any kind, or a per-kind count?

**Today:** unchanged and left filtering weddings, with the reason recorded in
`WEDDING_ONLY_BY_DESIGN` — *a filter not to flip quietly.*

⚠ **THE FILTER MOVED HOUSE 2026-09-09 (S8), AND ITS `WEDDING_ONLY_BY_DESIGN` ENTRY MOVED WITH IT.**
The number used to be recomputed on every render inside
`app/[slug]/_components/editorial/data.ts`; it is now **stamped once at publish** by
`lib/story-edition.ts`, which is where the `.eq('event_type','wedding')` — and the exemption naming
this question — now lives. That file no longer counts anything. **Nothing about the answer changed;
only the address did.**

🔑 **AND FLIPPING IT IS NOW A DECISION WITH A BEFORE AND AN AFTER, NOT A TIDY-UP.** Because the
number is frozen at publish and the database refuses to move it, changing what the No. counts would
give future stories a different population from the ones already stamped, and no way to reconcile
them. That is an argument for ruling it, not against — but it is worth knowing before it is ruled.

---

### Q6 · Unpublish, and withdrawal after publish — ✅ **RULED AND BUILT 2026-09-09**

> ✅ **BUILT — PR [#5371](https://github.com/iscasasola/setnayan-platform/pull/5371) (S14).**
> Verify with `gh pr view 5371 --json state,mergedAt` before trusting this line; a ✅ in a
> register is not evidence.
> · Nine consent writes now call ONE list, `lib/a-withdrawal-reaches-every-copy.ts`.
> · The share card is busted by **moving its URL** (`?v={story_version_at}`), because
> `revalidatePath` cannot reach a `Cache-Control` header — calling it there would have looked
> like a fix and done nothing.
> · The fourth rung ships, offered only to a story that has actually been published.
> · The printed keepsake carries the moment it was true, in the celebration's own zone.
>
> 🔑 **AND THE ANSWER TO "how many writers are there" WAS WRONG IN THIS DOCUMENT.** Deriving the
> population from the source instead of listing it found **four more**: the account-level RA
> 10173 opt-out (which reached one host screen), the RSVP selfie and the day-of face enrolment
> (both LIFT a veto), and soft-deleting a guest (which un-vetoes every capture that tagged them).
> ⚖ That last one is a **widening hidden inside a delete** and whether it is the right rule is an
> OWNER question — S14 changed only the caches, never the rule.

> ✅ **RULED 2026-09-09 — BUILD BOTH.** The fourth publish state (**Taken back**), the full
> revalidation set on every consent write, and a version stamp on the printed edition.
>
> ⚠ **THE ROW HE WAS SHOWN WAS WRONG-SHAPED AND THIS IS THE CORRECTION.** The sessions register
> printed Q6's "default" as *"nothing today; the withdrawal lands on the next read and a print
> never knows"* — **that is a description of today's defect, not a recommendation**, so "follow
> your recommendations" could not have meant *leave it broken*. The recommendation, stated
> plainly: **a guest who withdraws must have it come down everywhere, and a printed copy must be
> able to say which edition it is.**
>
> 🔑 **WHAT THE STAMP CAN AND CANNOT DO, said out loud so nobody oversells it:** a copy printed
> BEFORE this ships carries no stamp and can never know anything. The stamp only helps from the
> first print after S14. **Paper cannot be recalled** — the stamp lets a reader check, it does not
> reach into a printed page.

There is no "taken back" state, no version stamp, and consent writes do not revalidate the story,
the recap, the print route or the OG card (`04` §3). A printed copy can never know.

**Needs:** the fourth publish state, the revalidation set, and a decision on whether a printed
edition carries a version stamp so an out-of-date copy can say so.

---

### Q7 · Does "Featured" get a different name?

> ⏭ **STILL OPEN — not ruled 2026-09-09.** Blocks nothing.

The word already means three other things in the product: `showcase_featured_at` (admin pinning to
/realstories), "Featured in Stories" (the supplier's own page), and the admin feature rank. A
fourth meaning — a paid supplier tier — is one too many.

**Today:** LISTED / FEATURED as designed, flagged.

---

### Q8 · Does a live outside link leak a Setnayan-sourced lead?

> ⏭ **STILL OPEN — not ruled 2026-09-09.** Blocks nothing.

Featured suppliers get their own links live inside the story. A couple who found them through
Setnayan and then books off-platform is a fee-free "import" under the booking-fee model
(`lib/booking-fee.ts`).

**Today:** **Book** stays on Setnayan and is the primary action; the outside link is secondary.

---

### Also not decided (pricing)

**The Featured tier price** — not set here. Prices live in `platform_retail_catalog_v2`.
**And:** the prototype shows today's PRO-gated capabilities (moments, section order, own columns,
featured wishes) **ungated**. That was an omission on my part, not a decision.

> ✅ **RULED 2026-09-09 — THE PRO CHIPS GO BACK. The tier line does not move.** Naming and writing
> the moments, section order, placing your own columns and featuring guest wishes stay PRO exactly
> as they ship today. **A prototype drawn without a gate is not a decision to remove one** — and
> quietly shipping four paid abilities as free is a repricing nobody chose. **Do not re-ask.**

**The Featured tier price is still not set** and does not block a session.
