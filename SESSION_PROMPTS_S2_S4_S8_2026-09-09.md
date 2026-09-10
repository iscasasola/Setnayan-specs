# S2 · S4 · S8 — the last three of the chat/bench plan

> ✅ **ALL THREE ARE BUILT — DO NOT RELAUNCH ANY PROMPT IN THIS FILE** (checked against `origin/main`,
> 2026-09-11). **S2** Decisions → #5372 · #5402 · #5411. **S4** short previews → #5369. **S8** arrange
> your own shortlist → #5367. Live register: `WHATS_NEXT_Build_Plan_2026-09-10.md`.

> Paste the **shared header** from `SESSION_PROMPTS_2026-09-09.md` first, then ONE block.
>
> ⛔ **S4 and S8 must NOT run together with each other or with S2 until S6 (#5360) has
> MERGED** — S6 writes `lib/supplier-standing.ts` and extends `lib/conversation-list.ts`,
> and S8 edits the same bench file S6 does. Check `gh pr view 5360 --json state` first.
> ⛔ **S2 and S4 both touch `lib/conversation-list.ts`.** Run at most one of them at a time.
> ✅ **S8 is safe beside S2** (bench vs thread page) once S6 has landed.

---

## S2 · DECISIONS — the filter that shows only what was decided — opus · xhigh

```
A supplier and a couple share a conversation that mixes chat with STRUCTURED CARDS.
Owner: "anyway to filter what their current cards are for easier tracking? like meetings,
schedules, payments, quotes, adjustments? so it can eliminate other conversation and just
show what is the current verdict for those?"

BUILD a three-way switch at the top of the conversation — All · Decisions · Files.
On Decisions every text bubble, system line and day divider falls away and only the cards
remain, oldest to newest, with ONE standing line above them.

🔑 THE RULE THE WHOLE THING RESTS ON: EVERY CARD SHOWS WHERE IT STANDS **NOW**, NOT WHAT
IT SAID WHEN IT WAS SENT. A quote sent in July and accepted in August reads "Booked ·
accepted 1 Sep". A meeting that moved shows the old time struck through and the new one.
Without this the filter is a tidy list of stale announcements and is WORSE than scrolling,
because it is trusted.

── WHAT YOU MUST REUSE, NOT REBUILD ────────────────────────────────────────────────────
 • THE STANDING SENTENCE ALREADY EXISTS. S6 shipped `apps/web/lib/supplier-standing.ts` —
   `buildSupplierStanding(facts)`, `standingSentence(standing)`, `STANDING_LABEL`,
   `StandingRollUp`. The bench renders it today. Decisions renders THE SAME SENTENCE.
   ⛔ Do not write a second one. The owner ruled "yes, it is fine to show it twice" — what
   makes that safe is ONE derivation rendered in several places.
 • THE LADDER. `resolveThreadStage` + `rowReadsCompleted` (lib/vendor-thread-stage.ts).
   ONLY the five words — Inquiry · Quoted · Booked · Completed · Cancelled — may wear a
   coloured stage pill, and only on a card that actually moved the stage. Meetings and
   payments carry a dated sentence, never a pill. "Needs you" is an outline and a count,
   never a sixth word.

── THE CARDS, MEASURED ─────────────────────────────────────────────────────────────────
A message can carry `proposal_id` (a quote), `appointment_id` (a meeting),
`amendment_id` (an adjustment) and `offered_service_id` (a service the supplier offered —
S5 shipped its card). ⚠ `change_order_id` STILL EXISTS AS A COLUMN BUT IS RETIRED: S1
measured that nothing in the product can create one and shipped
`lib/the-change-marker-is-retired.test.ts` saying so. Do NOT build a renderer for it, and
do NOT let Decisions imply it exists.

🚨 AND TWO OF THE THINGS THAT BELONG IN DECISIONS ARE NOT MESSAGES AT ALL. The
guest-count-changed card and the couple's logged-payment card are PAGE SECTIONS rendered
around the stream, not rows in it. Decisions must merge THREE sources into one timeline in
date order. That merge is the hard part of this session — do it in one pure, tested
function, not inside the component.

── ALSO ────────────────────────────────────────────────────────────────────────────────
 • The Files third of the switch lists the files shared in THIS conversation. A file is
   fetched ONLY through `/api/chat/attachment/<message_id>`, which re-proves thread
   membership on every request. Never render a stored reference or a public URL. PR #5362
   did the same job on the supplier's customer card — read it.
 • BOTH SIDES. The couple's version of "where are we with this supplier?" is this same
   view. Their thread page is app/dashboard/[eventId]/messages/[threadId]/page.tsx.
 • On a phone it may be the most useful thing on the screen — do not make it desktop-only.
 • Design is BINDING: prototypes/chat_interface_v4_2026-09-09.html.

⛔ DO NOT run beside S4 — you both touch lib/conversation-list.ts.
```

---

## S4 · THE LIST SAYS SOMETHING BEFORE IT RUNS OUT — sonnet · medium

```
A conversation-list row shows a one-line preview of the last message. Measured in a
browser: the desktop column gives about 32 CHARACTERS, a phone about 50. So the generated
lines we write ourselves run out before the fact:

  "Guest count changed — now planning…"        (42 chars — it never fitted)
  "You: Deposit received — see you on th…"
  "You: Sent the Intimate 50 quote — vali…"

FIX BY WRITING THE LINE SHORT, NOT BY WIDENING THE BOX OR ADDING A SECOND ROW:

  Guests → 170 (was 150)   ·   You: ₱50,000 deposit received   ·   You: Quote ₱187,500 sent

Only a message a PERSON TYPED is ever truncated with "…", because there is no short
version of somebody's sentence. Every line we generate ourselves gets written to fit.

── WHERE ──────────────────────────────────────────────────────────────────────────────
 • `apps/web/lib/conversation-list.ts` — `previewFor` already exists and already takes the
   reader's role, so the "You:" prefix is correct on both sides. Extend it; do not fork it.
 • 🚨 A SHIPPED LIST ALREADY RENDERS A PREVIEW AND ALREADY THROWS THE SENDER AWAY:
   `apps/web/app/vendor-dashboard/bookings/surface.tsx`. It is the inbox a supplier's phone
   nav points at and where every new-inquiry notification lands, and its rows cannot say
   who spoke last — "Can we do a tasting first?" and "Deposit received" look identical.
   FIX THAT ONE TOO. It is the list suppliers actually use.
 • ⚠ MEASURE ITS FETCH. That preview is built by pulling EVERY message of EVERY thread on
   each page load, with no row limit. Cheap today; expensive the first time a shop is busy.
   Bound it, and say in the PR what you measured before and after.

── THE TAGS ───────────────────────────────────────────────────────────────────────────
A tag that appears on every row carries no information and costs a line. On a caterer's
inbox every row says "Catering". Show a service tag ONLY when the shop sells more than one
thing, and a date tag only when the date is within about 60 days.
⚠ THE SHIPPED LISTS MAY ALREADY DO SOME OF THIS — check before "fixing" it. The
"Catering on every row" problem was measured to exist in a DRAWING, not necessarily in the
product. Report what you find; a correction to this brief is worth more than agreeing.

── AND CHECK THE ELEMENT CAN ACTUALLY ELLIPSIS ────────────────────────────────────────
A previous version of this column clipped text with NO "…" at all, because the preview was
an inline span and `text-overflow: ellipsis` needs a block box with a width. Verify in a
browser at both widths and put the character counts in the PR — do not conclude it is fine
by reading the stylesheet.

⛔ DO NOT run beside S2 — you both touch lib/conversation-list.ts.
```

---

## S8 · A COUPLE CAN REARRANGE THEIR OWN SHORTLIST — opus · xhigh

```
On the couple's shortlist bench, the supplier cards in a category sit in an order the
platform chose. Let the couple choose it instead.

⚖ OWNER RULINGS 2026-09-09 — these are settled, do NOT re-ask any of them:
 • "bottom tier only" for the SORT — already shipped by #5351. Nothing paid moves by
   algorithm. Leave that alone.
 • "top tier can be long pressed and dragged to be rearranged", then "okay then. let both
   rearrange" ⇒ ONE GESTURE FOR THE WHOLE RAIL. A long-press that works on three cards and
   not the fourth reads as broken, and the case it would block — promoting a supplier the
   couple loves from low in the list — is the reason the feature exists.
 • "all hosts of that event see the same order" ⇒ the arrangement is stored ON THE
   CELEBRATION, not per browser like the sort lens. Every host sees one order.
 • Per CATEGORY, not across the whole bench.

── THE MODEL: PINS BEAT SORT ───────────────────────────────────────────────────────────
A dragged card is PINNED where it was put. The sort orders everything UNPINNED (still tail
tier only). The chip reads "Your order" once anything is pinned, with ONE Reset that clears
the pins and restores the real ranking. A supplier arriving later lands in its normal
computed position among the unpinned — never jumping to the front.

⚠ LONG-PRESS FIRST IS LOAD-BEARING, NOT A FLOURISH. The rail is a horizontal snap
carousel: a plain drag would hijack the swipe that scrolls it. The press enters a rearrange
mode and ordinary swiping keeps working.
⚠ KEYBOARD IS NOT OPTIONAL. A drag-only reorder is unreachable without a mouse or a
touchscreen. The focused card also takes move-left / move-right.
⚠ DRAGGING IS NEVER THE ONLY ROUTE TO AN ORDER. Most couples will never long-press
anything; the named lenses stay exactly as they are.

🔑 RULE 0 — A LIST DRAG-REORDER ALREADY SHIPS: `apps/web/app/_components/proposal-maker.tsx`
(the quote builder's line items). Reuse that shape. DO NOT add a drag library.

── THE BENCH IS THE DENSEST SURFACE IN THIS PRODUCT ────────────────────────────────────
`app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx`. Owner: "make sure
that we are adding value and not deleting feature on the pages that will be edited
(bench)." THREE guards enforce that and all must stay green:
 • `lib/the-bench-card-keeps-everything.test.ts` — pins every card element BY COUNT (the
   file renders TWO card shapes). If it fires, put the element back; never edit the count.
 • `lib/the-bench-is-legible.test.ts` — COMPUTES contrast in both themes. ADD A ROW if you
   introduce a tinted label; it cannot know about a pairing nobody told it about.
 • `scripts/lint-port-no-lost-controls.mjs` — ⛔ never regenerate its baseline to go green;
   read the diff and COUNT the removals.

⚠ You will need new SHARED PER-EVENT STATE, so a migration. Follow the repo's migration
rules exactly (`pnpm migration:new`, RLS at CREATE TABLE time, never apply directly to
production). The arrangement is the couple's own view data — it must not leak to suppliers.
⚠ The whole bench is behind NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED and its value cannot be read
from a session. Ask the owner rather than concluding anything about what renders.

⛔ Do not start until S6 (#5360) has MERGED — it edits this same file.
```
