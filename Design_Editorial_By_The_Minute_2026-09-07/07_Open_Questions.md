# 07 · Open questions — the owner's, not engineering's

Eight. Each carries what the design does **today** so nothing is blocked, and what changes if the
answer differs. **None of these should be settled in code.**

---

### Q1 · Are aggregate counts and bar heights public before publish?

The dial's bar heights, "492 captures", "26 phones" — these describe the guests' layer without
showing any of it. Is that "the pulse of the day", fair to show a stranger during the event? Or is
a count still the guests' data?

**Today:** QR-only. A stranger before publish sees flat baseline ticks and no counts.
**If public:** the live day becomes far more compelling to a stranger, at the cost of telling
them how busy someone else's wedding is.

---

### Q2 · Does the Kwento naming opt-in match the letters'?

The DPO ruled for guest columns: name hidden by default, being named is the opt-in
(`guest_columns.author_named_publicly`). `DECISION_LOG` states plainly: *"Whether the ruling
extends to photo messages was never put to the DPO and is NOT decided."*

**Today:** assumed **yes** — Kwento shows unnamed unless the guest asked. Needs a new column on
`photo_messages` modelled on `author_named_publicly`.
**If no:** names flow from the roster as they do now, and the design's consent copy is wrong.

---

### Q3 · Does by-the-minute refuse the solemn register?

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

`editionNo` counts **weddings** in the awards cycle. For a debut, is "No. 7" the seventh wedding
(meaningless), the seventh **story** of any kind, or a per-kind count?

**Today:** unchanged and left filtering weddings, with the reason recorded in
`WEDDING_ONLY_BY_DESIGN` — *a filter not to flip quietly.*

---

### Q6 · Unpublish, and withdrawal after publish

There is no "taken back" state, no version stamp, and consent writes do not revalidate the story,
the recap, the print route or the OG card (`04` §3). A printed copy can never know.

**Needs:** the fourth publish state, the revalidation set, and a decision on whether a printed
edition carries a version stamp so an out-of-date copy can say so.

---

### Q7 · Does "Featured" get a different name?

The word already means three other things in the product: `showcase_featured_at` (admin pinning to
/realstories), "Featured in Stories" (the supplier's own page), and the admin feature rank. A
fourth meaning — a paid supplier tier — is one too many.

**Today:** LISTED / FEATURED as designed, flagged.

---

### Q8 · Does a live outside link leak a Setnayan-sourced lead?

Featured suppliers get their own links live inside the story. A couple who found them through
Setnayan and then books off-platform is a fee-free "import" under the booking-fee model
(`lib/booking-fee.ts`).

**Today:** **Book** stays on Setnayan and is the primary action; the outside link is secondary.

---

### Also not decided (pricing)

**The Featured tier price** — not set here. Prices live in `platform_retail_catalog_v2`.
**And:** the prototype shows today's PRO-gated capabilities (moments, section order, own columns,
featured wishes) **ungated**. That was an omission on my part, not a decision. Either the PRO chips
go back, or the tier line is deliberately being moved — **your call.**
