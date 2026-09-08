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

---

### Q6 · Unpublish, and withdrawal after publish

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
