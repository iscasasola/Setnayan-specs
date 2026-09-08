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

## 3 · Withdrawal after publish ⛔ unhandled today

The only `photo_consent = false` write is the host's guest form; its revalidations are
`/dashboard/${eventId}/guests` and `backTo` — **never** `/${slug}`, `/${slug}/recap` or
`/${slug}/print`. The guest's own "Not me" (`removeMyTag`) revalidates only `/${ev.slug}`.
Meanwhile `/[slug]/recap` and `/[slug]/print` are `revalidate = 300` and the OG card is
`max-age=3600, stale-while-revalidate=86400`.

**So a withdrawal today comes down on the next read and not before, and a printed copy never knows.**

**Fix — ✅ RULED 2026-09-09, BUILD IT (`07` Q6):** every consent write revalidates the story, the
recap, the print route and busts the OG card; the story carries a version stamp so a printed copy
can say which edition it is; and the Story Maker gains a fourth state — **Taken back** — with the
cache invalidation named.
🔑 **Say what the stamp cannot do:** a copy printed before this ships carries no stamp and can
never know. Paper cannot be recalled — the stamp lets a reader CHECK, it does not reach a printed
page. Never let copy imply otherwise.

## 4 · Copy that is already correct — keep it verbatim

* *"A guest who asked not to be shown is not here, or appears blurred — and is never named as the
  one who shot a photo. Their choice beats the host's curation."*
* *"Letters carry a byline only if the writer agreed to be named. The role rides the same consent
  as the name."*
* *"Every answer here passed five separate yeses…"*
