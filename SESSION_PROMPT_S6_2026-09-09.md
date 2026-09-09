# S6 · THE BENCH SAYS WHERE EACH SUPPLIER STANDS — opus · high

> Paste the **shared header** from `SESSION_PROMPTS_2026-09-09.md` first, then this block.
>
> ⛔ **NEVER run beside S7 or S8** — all three edit `shortlist-categories.tsx` and one will
> silently revert another.
>
> ⚠ **S6 was originally sequenced after S2 (Decisions). It now goes FIRST, and therefore
> OWNS the sentence** that S2 will later reuse. That inversion is deliberate: the bench is
> where the couple actually looks.

```
On the couple's shortlist bench, a supplier card offers Add to build · Inquire (or
"Check inquiry" once a conversation exists) · Lock this. What it never says is WHERE
THINGS STAND. "Check inquiry" looks identical whether the supplier replied an hour ago,
sent a quote, or went quiet for three weeks — the couple has to open each one to find out.

BUILD THREE THINGS.

1 · A STANDING SENTENCE on each bench card, under the meta block:
      Garden Buffet   — Quoted ₱187,500 · waiting on you
      Lumen Kitchen   — Replied yesterday
      Verde Catering  — No reply · 12 days
    Three caterers in one category row, and the couple can see which to open without
    opening any of them.

2 · "2 suppliers replied" at the top of the page — the roll-up, above the bench.

3 · RELABEL "Check inquiry" to "Open conversation" — but ONLY after (1) ships. The label
    alone is not the improvement; the sentence above it is.

── YOU OWN THE SENTENCE. BUILD IT ONCE. ────────────────────────────────────────────────
Nothing in the repo builds this sentence yet (grep confirms: no standingLine /
standingSentence / whereYouStand anywhere). You are writing it, and a later session
("Decisions", inside the conversation) will render THE SAME sentence. So put it in a pure,
testable module of its own with no React and no I/O, taking facts and returning a string —
not inside a component.

⛔ DO NOT DERIVE THE STAGE AGAIN. `resolveThreadStage` + `rowReadsCompleted`
(apps/web/lib/vendor-thread-stage.ts) are the ONE ladder — Inquiry · Quoted · Booked ·
Completed · Cancelled — and three surfaces already share them. A fourth derivation is the
failure this repo keeps producing. Only those five words may wear a stage pill.

🔑 REUSE THE BATCHED BUILDER THAT JUST MERGED. `apps/web/lib/conversation-list.ts`
(PR #5347) already fetches, per list and in ONE pass: the stage facts, the last message,
who sent it, and whether a reply is owed (`buildVendorConversationRows`,
`buildCoupleConversationRows`, `isUnanswered`, `previewFor`, `rowPills`). The bench needs
the same facts for the suppliers on it. EXTEND that module; do not write a second reader,
and do not add a query per card — the bench renders many cards.

── WHAT THE BENCH ALREADY IS, SO YOU DO NOT LOSE ANY OF IT ─────────────────────────────
`apps/web/app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx` is the
densest surface in this product. A design pass once redrew a card and silently dropped TEN
things. Two guards now stop that and BOTH MUST STAY GREEN:

 • `apps/web/lib/the-bench-card-keeps-everything.test.ts` pins every element BY COUNT —
   photograph, initials fallback, ★ Chosen / Asked corner, name, city, rating, Setnayan and
   Verified badges, fit badges, price, free dates, the actions, Find, Add manually. It
   counts because the file renders TWO card shapes and TWO Find-more sites. If it fires,
   put the element back; do not edit the count to go green.
 • `apps/web/lib/the-bench-is-legible.test.ts` COMPUTES contrast in both themes.
   ⚠ IF YOUR SENTENCE OR ROLL-UP INTRODUCES A TINTED LABEL, ADD A ROW TO THAT TABLE — it
   cannot know about a pairing nobody told it about. A colour on a wash of itself loses
   about half a point; that is how the last five failures happened.
 • `scripts/lint-port-no-lost-controls.mjs` must stay green. ⛔ Never regenerate its
   baseline to go green — read the diff and COUNT the removals first.

── THINGS THAT ARE TRUE TODAY AND MIGHT SURPRISE YOU ───────────────────────────────────
 • A BOOKED (★ Chosen) card now keeps its conversation leg (PR #5341). It withholds Add
   and Lock only. Those cards are exactly the ones most likely to have something waiting,
   so they are the point of this feature — do not skip them.
 • The whole bench is behind `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` and its value CANNOT be
   read from a session. Ask the owner rather than concluding anything about what renders.
 • The bench renders a second card shape (the row-2 "More in {category}" marketplace
   results). Decide deliberately whether the sentence belongs there too, and SAY which you
   chose — those are strangers the couple has not spoken to, so probably not.
 • The design is BINDING: prototypes/chat_interface_v4_2026-09-09.html, the
   "Couple · the bench" frame. Port it; do not redraw it.

── OWNER RULINGS THAT BIND THIS WORK — do not re-ask ───────────────────────────────────
 • "yes, it is fine to show it twice." The same sentence may appear on the bench card, in
   the sticky Picks column and inside the conversation. WHAT MAKES THAT SAFE is that it is
   DERIVED ONCE and rendered several times — never three derivations — and duplication may
   never mean two controls that do the same job differently.
 • The sticky right-hand "Picks" column carries at most the roll-up. The per-supplier
   detail belongs on the bench card, in the wide left column, which is where the couple
   spends their time. ("that shortlist area is what i meant.")

── THE MEASUREMENT THAT MATTERS MOST HERE ──────────────────────────────────────────────
Write a guard that fails if the sentence is derived anywhere but your one module, and
another that fails if a card can render a stage word outside the five. Then MUTATION-TEST
both: a call-count guard is walked past by
  `completed.has(id) ? 'completed' : resolveThreadStage(...)`
so assert that neither builder writes a rung's NAME, not merely that it calls the resolver.
That exact sabotage is what a sibling guard was rewritten to catch — read
`the-conversation-list-says-what-it-shows.test.ts` before writing yours.

Report to the owner in plain English: what a couple sees on the bench that they could not
see before, and anything you found that contradicts this brief.
```
