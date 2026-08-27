# The service card maker — the plan, and whether the shipped screen achieves it

> **Owner, 2026-08-28, in order:** *"when i click create service card. i just bounces to a page for a
> link to service card"* → *"i want it to be as simple as possible… i also want an
> onboarding/wizard for this so they do not feel bombarded"* → *"looking at our service card
> creation with so many categories? should the choices be only for the service we actually cover
> and not all?"* → *"look for the best easiest approach. make it animated and interactive"* →
> *"i don't mind 0 steps if it is easy to make as well"* → *"looks better"* → *"add it"* →
> *"build it"* → **"plan all the fixes and make sure we achieve that output"**.
>
> **The drawing this is measured against:**
> [`prototypes/service_card_wizard_2026-08-28.html`](prototypes/service_card_wizard_2026-08-28.html)
> (rev 2 — interactive, animated, owner-approved: *"looks better"*).
> **The build:** PR [#4930](https://github.com/iscasasola/setnayan-platform/pull/4930).
> ⚠ Verify its state with `gh pr view 4930 --json state,mergedAt` before trusting any line here —
> this corpus has been wrong about a PR's state five times.

---

## 0 · The two locks this had to satisfy at once, and how

**2026-07-27 (owner):** *"THE MAKER IS ZERO STEPS — THE CARD IS THE FORM."*
**2026-08-28 (owner):** *"i also want an onboarding/wizard… so they do not feel bombarded."*

They are not reconciled by compromise. **The wall was never the model — it was everything being on
screen at once.** What ships is a *first pass over the living card*: a short run of plain questions
that only decides **which sheet is open**, with the card visible above painting itself, ending ON
the card. There is no second form, no step validation, no page navigation, and one submit — so
`canvas-field-parity` is untouched and the server cannot tell which door drew the screen.

🔑 **The rule that made the pass safe to build:** the publish gate has only ever been **two things**
— a cover photo and a Setnayan Exclusive (read out of `lib/card-health.ts`, not remembered; the
title is *not* required and a blank one is stored as NULL). So the pass asks the gate and nothing
else. Anything longer would have been invented work.

---

## 1 · Every fix, drawn → built → how it was proved

| # | What the drawing promises | Built | Proof |
|---|---|---|---|
| 1 | The create button opens the **card**, not a page of links to it | ✅ | `/vendor-dashboard/services/new`; 4 call sites moved; guard asserts the route renders the maker |
| 2 | The kind of service is a **field on the card** | ✅ | one hidden input, posted from state; parity test unchanged |
| 3 | **Coverage-first** kinds; the rest one tap away; plan-blocked greyed **with the reason** | ✅ | `lib/vendor-category-parents.ts`, asked by the chooser **and imported by the save** |
| 4 | A one-service shop is **asked nothing** | ✅ | pre-filled from a single coverage, labelled *"from your shop · change"* |
| 5 | The pass asks **two questions** and stops | ✅ | steps are `media` + `excl`, frozen at mount |
| 6 | **Skip on every question**; the pass can always be left | ✅ | skip line + closing a guided sheet leaves the pass |
| 7 | **No score while building** | ✅ | the health header is unmounted during the pass |
| 8 | The card **paints itself** as answers land | ✅ | `.sn-paint-*`, keyed per value — **remounted, not class-toggled** |
| 9 | **Reduced motion** honoured | ✅ | all three keyframes frozen; asserted, not assumed |
| 10 | On a laptop the question sits **beside** the card | ✅ | the guided panel becomes a right-hand column at `lg` |
| 11 | A half-finished card is **kept and offered back** | ✅ | `lib/canvas-draft-keep.ts` — in the browser, never a card row |
| 12 | **Continue waits** for the required thing on that question | ✅ *(fixed in this pass)* | `passAnswered`; skip survives the gate |
| 13 | The card **name is written for them** | ✅ *(fixed in this pass)* | `"{kind} by {shop}"`, never over their typing |
| 14 | The covered band speaks **the shop's own words** | ✅ *(fixed in this pass)* | the band quotes the coverage leaves (*your Pabati*) |
| 15 | The full list is **searchable** | ✅ *(fixed in this pass)* | search + an honest "nothing matches" line |
| 16 | The optional depth is **named under the card** | ✅ *(fixed in this pass)* | *Make it richer*, shut by default, opening the shipped sheets |
| 17 | The publish moment **reassures and congratulates** | ✅ *(fixed in this pass)* | *"Everything you have typed stays…"* / *"Your card is ready."* |
| 18 | The explainer **shows a card** | ✅ *(fixed in this pass)* | a sample card, plainly labelled as another supplier's |
| 19 | **ONE DOOR** — the top bar and My Shop's own *Add a service* open the same thing | ✅ *(fixed in this pass)* | both My Shop controls moved; guard **counts** them, so a half-fix fails |

### Deliberately NOT built, and why

- **The desktop card is not pinned left at full size.** The page keeps its single centred column and
  the question becomes a right-hand panel. Same information, one layout instead of two.
- **The "Already done / Finish these two" split list** at the blocked moment. The shipped health
  header already names each missing thing and links to it; a second list of the same facts is the
  wall coming back.
- **The category drawer on My Shop stays** — it is how COVERAGE is added, and it is where
  `/services/new` sends a shop whose canvas maker is switched off. What was retired is the LINK to
  it (`SERVICE_PICKER_HASH`, zero callers once both shop controls moved), never the target.
- **`?from=` (start from one of your cards) and `?claim=` keep the old door.** Those screens already
  know the kind, so the pass has nothing to ask; the `[category]` route is byte-identical to before
  and a guard fails if it grows a chooser.

---

## 2 · What was measured, not assumed

- **The publish gate is two things.** Read out of `lib/card-health.ts`: `no_cover`, `no_exclusive`.
- **The category wall, on the owner's own shop.** 52 keys (~34 pills, 6 groups). SetnaProd is
  **Solo = one family**, covers **Pabati** (booths) + **Day-Of Coordinators** (planning), **0 cards**.
  ⇒ ~6 of ~34 pills could actually publish. 🚨 **And the caps were enforced AFTER the card was
  authored**, by a redirect that threw the work away — most of that wall was a refusal waiting to
  happen.
- **The two vocabularies.** Coverage speaks the newer taxonomy (*Pabati*); the kinds list speaks an
  older one with no such pill. **The bridge is the FAMILY, never the leaf name** — and the band that
  leads is labelled with the shop's own leaf words so nobody has to recognise their trade under a
  word they never chose.
- **The title is optional.** Blank is stored as NULL and the card falls back to the kind, so writing
  a name is a courtesy, not a gate.

---

## 3 · Traps paid for in this stream — assume a seventh

1. **A guard's own regex read half of every sheet.** `<CanvasSheet[\s\S]*?>` stops at the first `>`
   in the tag — **the arrow in `onClose={() => …}`** — so `confirmLabel` was never seen. It had been
   green and blind.
2. **An existing owner rule fired and was WIDENED, not weakened.** *"Pop ups must have update
   button"* (2026-07-28) now reads: a sheet may hide the confirm **only when it carries a real
   control of its own**. Two may hide it always, named.
3. **A CSS animation does not replay because its class is set again** — every painted value is keyed
   on its own value. A static `className` animates once and looks right in review.
4. **The ready-pulse had to move to a wrapper** — keying the card remounts the name field mid-typing.
5. **`tsc` aborts at 134 while printing `errors=0`.** Always print the exit code beside the count.
6. **Declaration order bites twice in one file** — an effect reading a `const` declared below it
   typechecks as a block-scope error, not a runtime surprise. Read the tsc output, never the count
   alone.

---

## 4 · Open, and only the owner can close them

1. **When a plan blocks a kind, where should the greyed pill lead?** Drawn: the sentence names the
   plan. Not built: a link straight to the pricing page vs a *"tell us what you do"* note.
2. **The two vocabularies should be reconciled properly.** Bridging by family is correct and is not
   the same as the coverage tree and the kinds list agreeing. That is its own piece of work.
3. **Nothing here has been seen in a browser.** The screen is behind a supplier login; everything
   above is source- and test-verified, with 29 measured mutations across the stream. **The last mile
   is the owner opening his own shop after this deploys.**
