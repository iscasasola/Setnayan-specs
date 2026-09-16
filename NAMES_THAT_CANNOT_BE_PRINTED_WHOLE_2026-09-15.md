# 35 surfaces that cannot print a guest's whole name — measured 2026-09-15

**Why this file exists:** the list came from a CI guard FAILURE nobody was meant
to read, not from a search anyone can repeat — and the baseline was then
regenerated so #5506 could land, which means **re-running the guard no longer
finds them.** This is the only copy. (Owner: *"fix the 36 surfaces that cant
print full name."*)

**How it was found:** naming ten columns in `ENTOURAGE_COLUMNS` made
`lint:dup-rule` measure every other `.from('guests')` against a canonical list
that had grown — 230 facts across **39 read sites**.

**To re-measure from scratch:** widen a canonical column list bound to `guests`,
run `pnpm --filter @setnayan/web lint:dup-rule`, and read the `MISSING` lines.

---

## ✅ DONE (1)

| Surface | What it prints |
|---|---|
| `app/[slug]/_components/editorial/data.ts` — guest-column byline | A guest's name published under their own words. Was `display_name ?? first+last`, a private copy of the composer. **PR #5515, merged and served.** |

## ⛔ CORRECT AS THEY ARE — do not "fix" (9)

These read a **first name only**. They are greetings. *"Hi Ana"* becoming
*"Hi Atty. Ana Reyes"* is a regression, not a fix.

`app/[slug]/avatar/page.tsx` · `app/[slug]/rotate-qr-actions.ts` ·
`app/api/guest/qr/route.ts` · `app/dashboard/[eventId]/alaala/assignments/page.tsx` ·
`app/dashboard/[eventId]/alaala/page.tsx` ·
`app/dashboard/[eventId]/studio/papic/magazine/route.ts` ·
`app/dashboard/[eventId]/studio/papic/moderation/page.tsx` · `lib/auto-recap.ts` ·
`lib/capture-credit.ts`

## ⚠ NEEDS A DECISION BEFORE ANY CODE (1)

| Surface | The decision |
|---|---|
| `app/api/v1/events/[eventId]/guests/route.ts` | **Public API.** Widening the select changes **what a response contains** — a disclosure change, not a formatting one. Needs the owner as DPO, not a sweep. |

## 🔶 JUDGEMENT — what should this surface print? (25)

Each needs one look at what reaches a person's eye. A formal name is right for a
printed list; wrong for a seat card or a plus-one row.

**Guest-facing / published — most likely YES to the whole name**
`app/[slug]/_components/guest-column-card.tsx` (renders the byline #5515 fixed
upstream) · `app/[slug]/invite/enter/page.tsx` · `app/[slug]/invite/reply/page.tsx` ·
`app/[slug]/welcome/page.tsx` · `app/[slug]/seat/page.tsx` (tablemates — probably
first+last, NOT titles) · `lib/save-the-date-emails.ts` (a greeting? check)

**The couple's own desks — a full name usually helps**
`app/dashboard/[eventId]/guests/checkin/page.tsx` ·
`app/dashboard/[eventId]/guests/claims/page.tsx` ·
`app/dashboard/[eventId]/guests/souvenirs/page.tsx` ·
`app/dashboard/[eventId]/guests/[guestId]/page.tsx` (plus-one lookup — probably NOT) ·
`app/dashboard/[eventId]/guests/[guestId]/actions.ts` ·
`app/dashboard/[eventId]/guests/groups-actions.ts` ·
`app/dashboard/[eventId]/guests/quick-add-actions.ts` ·
`app/dashboard/[eventId]/story/_lib/load-desk.ts` ·
`app/dashboard/[eventId]/studio/guest-columns/page.tsx` ·
`app/dashboard/[eventId]/studio/papic/moderation/_components/kwento-queue.tsx` ·
`app/dashboard/[eventId]/studio/papic/_components/guest-allotments-choice.tsx` ·
`app/dashboard/[eventId]/studio/patiktok/actions.ts` ·
`app/dashboard/[eventId]/website/widgets/page.tsx`

**Other**
`app/[slug]/_lib/loaders.ts` · `app/[slug]/actions.ts` ·
`app/_actions/plan3d-demo-actions.ts` · `app/join/[eventId]/actions.ts` ·
`app/tour/seating/page.tsx` · `lib/life-story-moment-graph.ts` ·
`lib/people-you-can-invite.ts`

---

🔑 **The rule that decides each one:** `guestDisplayName` is the COMPACT name (a
chip, a seat card, a row) and has 83 call sites. `guestFullName` is the FORMAL
name (an invitation, a byline, a printed list). Widening the compact one moves
every name in the product at once; that is why the two exist separately.

⚠ **Sweeping all 35 would put a title on a seat card, a title in a greeting, and
new fields in a public API response — three regressions in the name of one fix.**
