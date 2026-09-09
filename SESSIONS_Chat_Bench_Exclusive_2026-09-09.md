# SESSIONS — what is left, in the order to run it

> Written 2026-09-09. Design is **BINDING**:
> [`prototypes/chat_interface_v4_2026-09-09.html`](prototypes/chat_interface_v4_2026-09-09.html).
> Economics: [`Setnayan_Exclusive_Study_2026-09-09.md`](Setnayan_Exclusive_Study_2026-09-09.md).
> Decisions: `DECISION_LOG.md` 2026-09-09 (four rows).
>
> ⚠ **Verify every PR state below with `gh pr view <n> --json state,mergedAt` before
> trusting it.** This corpus has been wrong about a PR's state five times.

---

## DONE — do NOT rebuild any of it

| | what | PR |
|---|---|---|
| ✅ | Tools become a list; the panels mount once | [#5327](https://github.com/iscasasola/setnayan-platform/pull/5327) merged |
| ✅ | The ladder gains **Completed** and **Cancelled** | [#5328](https://github.com/iscasasola/setnayan-platform/pull/5328) merged |
| ✅ | A closed tool takes **no space**; one open at a time | [#5336](https://github.com/iscasasola/setnayan-platform/pull/5336) merged |
| ✅ | A booked supplier is reachable from the bench + the card's elements are pinned | [#5341](https://github.com/iscasasola/setnayan-platform/pull/5341) merged |
| ✅ | The bench is legible in both themes + a guard that computes | [#5343](https://github.com/iscasasola/setnayan-platform/pull/5343) merged |
| ⏳ | Chat files private + compressed | [#5339](https://github.com/iscasasola/setnayan-platform/pull/5339) open |
| ⏳ | Four "message this supplier" controls open the conversation | [#5344](https://github.com/iscasasola/setnayan-platform/pull/5344) open |

---

## THE SESSIONS

Effort is the reasoning tier, not a time estimate. **Fable** is used only where the work is
drawing or product judgement; it is not a coding tier.

| # | session | model · effort | depends on | why that tier |
|---|---|---|---|---|
| ~~**S1**~~ | 🛑 **CLOSED — DO NOT BUILD.** The change card is not missing; it was **built and deleted on purpose** (commit `d3350b8e2`, 2026-07-24, council verdict *"as simple as possible"* — the bundled **Deal** is a superset, so couples see ONE money card). Its producing chip went with it, and both writers of `chat_messages.change_order_id` have **zero importers**, so **nothing can put that marker on a message**. **Decisions therefore cannot omit a change — it is a THREE-marker filter** (`proposal_id · appointment_id · amendment_id`) + the payment and guest-count cards. Held by `lib/the-change-marker-is-retired.test.ts`. ⏭ Reversing that verdict is an **owner decision**, not a session. 🔴 **AND A BIGGER ONE SURFACED — corrected twice, third reading measured.** Accepting is an AGREEMENT by design; the money lands at **LOCK** (`total_cost_php`, an absolute write) and the couple is prompted with the exact figure, so the not-yet-booked path is fine. **The defect is the ALREADY-BOOKED path:** a `contracted` supplier is deliberately never repriced, yet the couple is still told *"Deal locked — price frozen"* while the budget keeps the old number. 🛑 **The obvious fix corrupts the budget** — a delta line on a headline-billed supplier returns **−₱15,000**, not ₱85,000 (pinned in `lib/a-settled-delta-must-not-erase-the-headline.test.ts`; `accept_change_order` already carries it). ✅ **CLOSED — owner chose the reprice.** The already-booked branch writes `total_cost_php` (price only), every price write now reports whether the row MATCHED, and `lockDeal` refuses to stamp when it did not. Held by `lib/a-locked-deal-reaches-the-budget.test.ts`. ⏭ Still open: making a delta line safe on a headline-billed supplier (would also repair `accept_change_order`). | — | — | ⚠ Prod could not have answered this: **3 chat messages total, zero rows on ALL FOUR markers**, including the two that work — emptiness cannot tell *unreachable* from *unused*. The import count can. |
| **S2** | **Decisions** — the All · Decisions · Files switch, every card's **NOW** line, the standing sentence. **THREE markers, not four** (see S1). | opus · **xhigh** | — (S1 closed) | Three sources merge into one timeline (messages, the guest-count card, the payment card), and only the five ladder words may wear a pill. The most conceptually loaded piece left. |
| ~~**S3**~~ | ✅ **BUILT — BOTH SIDES.** The list beside the thread, its chips, the batched row builder. PR [#5347](https://github.com/iscasasola/setnayan-platform/pull/5347). The parked branch was found and reconciled, not restarted. See § S3 below. | opus · **high** | — | Batched reads and a stage per row; easy to get quietly wrong. |
| **S4** | **Short previews** — fact-first generated lines; the element that could not ellipsis; the tag shown only when it varies. | sonnet · **medium** | S3 | Mechanical once the column exists. ⚠ The supplier's `/vendor-dashboard/bookings` inbox ALREADY renders a preview and already fetches the "You:" sender and throws it away — fix that one too. |
| ~~**S5**~~ | ✅ **BUILT** — a service offered in chat arrives as the supplier's CARD. PR [#5350](https://github.com/iscasasola/setnayan-platform/pull/5350). See § S5 below for three corrections this session measured. | opus · **high** | — | Touches the offer write path and the couple's render; the media is the pitch. |
| **S6** | **The bench standing sentence** + **"2 suppliers replied"** + the **Open conversation** relabel. | opus · **high** | S2 | Must reuse the ONE derivation (`resolveThreadStage` + `rowReadsCompleted`); a second one is the failure this repo keeps producing. |
| ~~**S7**~~ | ✅ **SHIPPED — PR [#5351](https://github.com/iscasasola/setnayan-platform/pull/5351).** The couple's lens joins the shipped tail-tier re-rank; relationship / boosted / top-reviews never move by algorithm. 🔑 **THE BOUNDARY IS ENFORCED BY CONSTRUCTION, NOT BY A WELL-BEHAVED COMPARATOR:** `orderInlineMoreRow` collects the INDICES holding tail rows, orders that sub-list and writes it back into the SAME indices, so a protected row cannot move because no other index is ever written. ⚠ **And the tail is NOT a contiguous suffix** — the service-date down-rank stable-partitions busy vendors to the very end ACROSS tier boundaries, so a boosted vendor busy on the date legitimately sits below tail rows and "sort the last N" would have dragged a paid card around. 🧩 **Two new fields, derived once where they are already known:** `ladderTier` (stamped at the four assembly steps in `category-search.ts`, never re-derived downstream — before this the tiers existed only as local variables, so no caller COULD have respected the boundary) and `startsAtPhp` (a service floor, **not a quote**; its read already ran unconditionally for the free budget-fit score, only the exposure is new, and the flag-gated `_startsAt` → `budgetPressure` path is untouched). ⛔ **`boosted` is deliberately withheld from the scorer** — it is `ad_rank > 0`, and feeding it would let ad spend buy score inside the one tier meant to be free of it. ONE comparator now serves both rows (`orderByBenchSort` extracted from `sortWithReasons`), and "can this lens discriminate?" reuses the shipped §15.2 `hideWhen` rather than a second copy. ✍ **The honest sentence ships too**, built from the tiers ACTUALLY PRESENT and from whether the sort could discriminate — *"Featured and most reviewed first, then your ‘Lowest price’."*, and *"…then Setnayan's order."* when it had nothing to go on. 🔬 **11 of 11 mutations proved red** (22 tests, exit 0); one guard was **decoration** and the battery caught it — with no prices every card ties at Infinity and `Array.sort` is stable, so deleting the no-signal check changed nothing, and the test was rewritten against a lens where the move is visible. All three bench guards green with the port baseline **untouched**. | opus · **xhigh** | — | It touches an **owner-locked commercial ladder** where paid placement lives. Getting the boundary wrong moves money. |
| **S8** | **Drag to rearrange** — long-press, pins beat sort, "Your order" + Reset, keyboard move-left/right, shared across every host of the event. ✅ **ITS ONE OPEN QUESTION IS CLOSED: PER CATEGORY** (owner 2026-09-09, *"per category"*) — the arrangement is keyed by (celebration, tile), a caterer can never outrank a florist, and **one Reset clears that category only**, never the whole bench. 🔑 **RULE 0, PAID BEFORE THE BUILD — THE OBVIOUS EXISTING HOME IS THE WRONG ONE.** `event_category_build_state` is already per-(event, category) and already has a column called `pinned_vendor_id`, and it must NOT be reused: there it means *the Build solver's Locked pick* — which supplier the build uses — not *where the couple dragged this card*. Reusing it would give one column two meanings, and it holds a single pin where an arrangement needs an ordered set. It is also dark behind `BUILD_3STATE_ENABLED`. ⇒ **its own store, one ROW PER PIN** keyed `(event_id, tile, vendor_id)`. 🔑 **Row-per-pin, not a JSON blob, for a measured reason:** removing a supplier from the shortlist is a real `DELETE` on `event_vendors` (`vendors/actions.ts`, `releaseSchedulePools` then `.delete()`), so `ON DELETE CASCADE` drops the pin with it — a blob would keep a dangling id and quietly hold a slot for a supplier that is gone. ✅ **And it covers EVERY card:** a manually-added supplier is not a separate card source — `20260604080000_event_manual_vendors_table.sql` states *"each category gets its own `event_vendors` row"* with `event_vendors.manual_vendor_id` linking the detail — so one FK reaches the whole rail. ⚠ **A migration drags two more things in:** the exposure baseline (`supabase/security/exposure-surface.baseline.txt` — a new table is a WIDENING and `exposure-freeze.db.test.ts` fails until it is regenerated off the replay) and the Ugat map (`CLAUDE.md` doc rule 4). | opus · **xhigh** | S7 ✅ | Gesture conflict with a horizontal snap carousel, a11y, and new shared per-event state. The hardest UI piece left. |
| **S9** | **The follow-gate Message** on a supplier's public profile — and it **silently drops the supplier's address** when the couple has no celebration yet. Plus deleting ~60 lines of follow-gate recovery with no caller since 2026-09-08. | sonnet · **medium** | — | Small and well understood; the deletion wants its own readable diff. |
| **S10** | 🔁 **REWRITTEN 2026-09-09 — THE SHELF IS ONE ITEM.** Owner: *"only offer papic credits. so it is simple and useful"*, after *"what if we just offer the free ones"* narrowed it to two. ⇒ **there is no shelf and no picker.** Mood Board Render Pack · Live Studio · Event Hub Pro · Setnayan AI are all OFF the gift path (they stay ordinary products a couple can buy). ⚠ **AND THE GIFT IS OPTIONAL (owner, 2026-09-09) — which is itself a code change:** `PUBLISH_REQUIREMENTS = ['price','exclusive']` makes it COMPULSORY today, so a supplier cannot publish a card without typing one. **Remove `'exclusive'` from that list in the same change that adds the switch.** Compulsory would have taken our headline rate from **5% to 7%** of the first ₱100,000 (fee + 40% of fee = 1.4 × fee) and made the owner's own *"we only charge 5% and 1%"* untrue. What is left of S10 is the **publish gate**: a card cannot publish without a cover photo, a title and what's included — and `exclusive_perk_text`, today a free-text promise anyone can type, is retired in favour of a computed photo count. ⚠ **The gate half was NEVER gated on an owner number and could have shipped days ago** — the cover photo is already a hard blocker in one place (`card-health.ts`) and not in the shared gate, which is its own defect. | opus · **high** | ✅ nothing — G1·G2·G3·G4·G5 all closed 2026-09-09 | Money-shaped, and it retires a free-text field two surfaces read. |
| ~~**S11**~~ | 🛑 **MOSTLY DELETED BY THE ONE-ITEM RULING — do not build it as written.** Its whole job was *availability · fallback · the pick*: show what is GIFTABLE never what the couple owns, treat the pick as a preference, match the fallback to the VALUE. **With credits as the only gift, every one of those disappears:** credits are unlimited so nothing can be "already taken", they stack so there is nothing to disclose about what the couple already bought, there is no pick so there is no race between pick and grant, and the fallback WAS Papic credits. 🔑 **The owner's own 2026-08-09 requirement — _"vendors need to see their current setnayan services availed already… in case that service is already taken"_ — is retired by his own simplification, and it was the ONE privacy-shaped risk in the feature.** ⏭ **What survives is one sentence: grant N credits to the event's pot when the money clears** — fold it into S12. | — | — | — |
| **S12** | **The Exclusive · the lock bill and the grant.** The gift is **ADDED** to what the supplier pays, never deducted (owner: *"an extra charge on top of the fee, so we always collect more, never less"*). Granted when the money **CLEARS**. Sized at **40% of the booking fee**, best combination over the live regular-price rungs — **read `platform_retail_catalog_v2`, never a number in a document.** ⛔ **No Exclusive at all below a ₱3,500 booking** — the ₱50 floor fee yields a ₱20 budget against a ₱70 cheapest rung, so the promise would otherwise produce nothing, silently. 🔑 **Say it in PHOTOGRAPHS, never in pesos:** *"give your couple 1,400 photos"*, not *"₱1,000 of credits"*. Uses the shipped `comp_grants` / `vendor_self_comp`. | opus · **xhigh** | ✅ nothing — all gates closed | Real money on a real bill. |

---

## SEQUENCE

```
NOW, nothing blocking:      S2 · S4 · S7 · S9   (S1 · S3 · S5 CLOSED — do not build)
after S2:                   S6
                            S4 is UNBLOCKED — S3 shipped the column it needed
after S7:                   S8
behind owner gates:         ~~S10 → S11 → S12~~ — ✅ **ALL GATES CLOSED 2026-09-09.** S11 is deleted; the stream is **S10 (publish gate) → S12 (the bill + the grant)**, and both are unblocked.
```

**Ten sessions of engineering, three of them gated on decisions only the owner can make.**

### ⛔ Pairs that must NEVER run together

They edit the same file and one will silently revert the other.

| never together | shared file |
|---|---|
| **S6 · S7 · S8** | `shortlist-categories.tsx` — run them in that order, one at a time |
| ~~S2 · S3~~ | the vendor thread page — **S3 is merged, so this pair is spent.** S2 must still rebase: S3 wrapped BOTH thread pages in a two-column flex and added a data block above each `return`. |
| **S10 · S11** | the service card + the publish gate |

⚠ **S5 (#5350) edited `service-card-face.tsx`** — it added an optional `footer`
prop so a live conversation does not render the preview's mock "Request a quote"
chip. **S10 and S11 both touch that file.** Rebase on `main` before starting
either, and keep the `footer === undefined` distinction: an omitted footer means
"draw the preview chip", `null` means "draw nothing".

Safe to run in parallel: **S2 + S7** · **S9 + anything** · **S4 + S7**. (S3 and S5 are CLOSED — PRs #5347, #5350.)

🔑 **Never more than two at once.** Ten parallel builds once shipped 44 defects
(`REDESIGN_SESSIONS_2026-08-12.md`).

---

## GATES — each one blocks its session, and only the owner can close it

| | gate | blocks |
|---|---|---|
| ~~**G1**~~ | ✅ **RULED 2026-09-09 — 40% of the booking fee**, no cap, **charged on top** of the fee. Do not re-ask. | — |
| ~~**G2**~~ | ✅ **RULED 2026-09-09 — _"no fee. no gift."_** A supplier's first five free sourced bookings carry NO Exclusive, and neither does a BYO / vendor-invited / returning client. Do not re-ask. | — |
| ~~**G3**~~ | ✅ **CLOSED 2026-09-09 by measurement, then made MOOT.** Mood Board pack ≈ **₱120** per 50-credit pack (~88% margin) and it is **NOT a free browser render** — the one item that made a paid Gemini call. Live Studio ≈ **₱0 today**, ₱26–₱269/event-day at scale. **Both are now off the gift shelf**, so neither figure gates anything; they remain true of the products themselves. | — |
| ~~**G4**~~ | ✅ **RULED 2026-09-09 — _"all regular price will always be the price"_**, then made MOOT by the one-item shelf: the only gift is Papic credits, at its regular rung price. There is no separate supplier rate card. | — |
| ~~**G5**~~ | ✅ **ALREADY RULED 2026-09-02 and was being re-asked — Live Studio is ONCE PER EVENT** (`LIVE_STUDIO` ₱2,500, `billing_period='one_time'`, verified in the live catalog and pinned by `live-studio-unlock-never-expires.test.ts`). The **per-day** product is `LIVE_STUDIO_HOSTED_CHANNEL` at ₱3,000/day, a different thing, per-day because only three channels exist. Moot for the Exclusive now. 🔑 Three live documents were still asking this a week after he answered it. | — |
| ~~**G6**~~ | ✅ **ANSWERED 2026-09-09 — it is `true` in production.** So is `NEXT_PUBLIC_CHAT_NEGOTIATION_V1`, i.e. Deal + Meeting are live for real users. 🔑 **Its value CAN be read from a session:** `vercel env pull` returns `NEXT_PUBLIC_*` in plaintext (only server-side vars come back encrypted) — `vercel env ls` alone shows just "Encrypted", which is what made this look unreadable. **S6 · S7 · S8 are unblocked.** | — |
| **G7** | **A supplier has TWO conversation lists over the same threads** — Conversations, and Bookings/inquiries. The design draws one and never says which it replaces. **Which survives?** | ⚠ blocks the RETIREMENT only — S3 and S4 can be built without it. It decides what the new column replaces, not whether it is built. |

⚠ **The Exclusive cannot be PROVEN until the booking fee charges somebody.** It is
flag-dark and production holds zero real shop bookings. Build it; test it with the fee's
own first live round.

---

## THE RULE THAT GOVERNS EVERY BENCH SESSION

Owner: *"make sure that we are adding value and not deleting feature on the pages that
will be edited (bench)."*

1. `lint-port-no-lost-controls` stays green. ⛔ **Regenerating its baseline to quiet it is
   forbidden here** — read the diff and COUNT the removals first; a substitution reads as a
   loss, and regenerating blind absorbs a real one.
2. `lib/the-bench-card-keeps-everything.test.ts` pins every element of a card **by count**,
   because the file renders two card shapes and two Find-more sites.
3. `lib/the-bench-is-legible.test.ts` computes contrast in both themes. **Add a row when
   you add a tinted label** — it cannot know about a pairing nobody told it about.


---

## § S3 — BUILT (PR #5347). What S4 inherits, and one claim of mine that was false.

**Shipped both sides.** One component, `app/_components/chat/conversation-column.tsx`,
renders the supplier's column and the couple's; the row builders are
`lib/conversation-list.ts` (`buildVendorConversationRows` · `buildCoupleConversationRows`).
Both rank through `resolveThreadStage` + `rowReadsCompleted`. No fourth ordering.

**Chips.** Supplier: All · Unanswered · Quoted · Booked · Completed · Cancelled.
Couple: All · Has a quote · Booked · Waiting · Closed — *Closed* folds **completed +
cancelled**, because to a couple both mean *done with*. The mapping is declared as data
(`COUPLE_CONVERSATION_FILTERS[].stages`), and a guard asserts every rung of the ladder is
reachable from some chip.

### What S4 must know before touching previews

- **`previewFor(last, selfRole)` already takes the reader's role.** "You:" is resolved per
  side; do NOT hard-code `'vendor'`. A guard pins both directions.
- ⚠ **THE `previewFor` EMPTY-BODY BRANCH RETURNS "Sent an attachment", AND ITS SAFETY IS
  NOT WHAT S5 SAID IT WAS.** S5 checked this and called it sound because
  `sendChatMessageCore` refuses a message with neither body nor attachment. True of that
  writer — but **the offer path never goes through it**: `lib/offer-service-core.ts` does a
  DIRECT `chat_messages` insert. It is still safe, by a different mechanism: that insert
  hard-codes `body: \`Offered: ${offeredName}\``, whose last fallback is the literal
  `'a service'`, so the body is never empty. 🔑 **The invariant is "every writer sets a
  body", not "one function refuses". A future marker writer that omits a body would make
  the column tell a supplier a file was sent when none was.** Re-check with
  `git grep -n "from('chat_messages').insert" apps/web`.
- **The fifth marker is real** (S5: `offered_service_id`). Today it previews as its own
  body — *Offered: Live Band* — which is legible and true, so nothing is broken; it is the
  fifth type needing a fact-first line.
- **The preview element is a `block`, not an inline span** — the v3 defect where `truncate`
  could not ellipsis is already fixed and guarded.
- 🔴 **THE SUPPLIER'S `/vendor-dashboard/bookings` PREVIEW IS STILL UNFIXED.** S3 did not
  touch it. That remains S4's, as the register says.

### A claim in my own PR #5347 that was false, corrected in #5359

I wrote that the supplier overview's dates "depend on the machine drawing them", citing a
docblock in `lib/plan3d-control.ts` — *"the CI runner says 28 Nov, this Mac says Nov 28"* —
which the parked branch had copied into `lib/format-date.ts` and which I repeated as a
finding. **It is not reproducible.** Measured on Node 22 / ICU 77.1: `en-PH` resolves to
real `en-PH` data (not a fallback) and yields "Dec 18", identical to `en-US` and `en`
across 4,800 comparisons. 🔑 **A docblock is not a measurement, and this one had been
inherited three times before anybody ran it.** Both docblocks are corrected in #5359.

⚠ **The real defect on that page was a different one**: the lapsed-lock date was a
TIMESTAMP rendered in the runtime's zone. Vercel runs UTC, Manila is UTC+8, so anything
lapsing before 08:00 Manila named the **previous day**. Fixed in #5359.

⏭ **Open, and NOT mine to decide:** G7 (which of the supplier's two lists the column
retires — neither was touched); whether the couple's column should ever say *they owe you
a reply* (the mirror of "Unanswered" — a real idea nobody designed, deliberately not
invented); and the **search box on the couple's side**, which the prototype does not draw
and #5347 added anyway.

---

## § S5 — BUILT (PR #5350). Three things the S5 brief got wrong.

Recorded because each one changed the build, and because a later session reading
only the brief would repeat them.

1. **`primary_photo_r2_key` is NOT "REQUIRED before a service can be published".**
   `lib/service-publish-gate.ts` holds `PUBLISH_REQUIREMENTS = ['price','exclusive']`
   — the cover is on neither. Measured in prod 2026-09-09: of the two live
   services, **one has no cover at all** and is `is_active = true`. A card that
   needs a photograph to exist would be blank for half the catalogue, so the
   coverless card is a first-class state with a test on it.

2. **The route the brief cited as the precedent does not exist.**
   `apps/web/app/api/chat/attachment/[messageId]/route.ts` is not in the tree,
   and chat attachments are **not** served through a membership-proving route at
   all — `bucketForPrefix` has no `chat/` rule, so they fall through to the
   PUBLIC bucket (already recorded in `DECISION_LOG.md` 2026-09-09 ⓻ and being
   fixed by PR #5339). The brief's *instruction* was right and was followed;
   only its evidence was wrong. Service media resolves through
   `displayUrlForStoredAsset` — short-lived presigned URLs, server-side.
   🔑 **The media is a stored REF, which is the real hazard; "private bucket" is
   not what makes it one.** The live cover sits in `setnayan-media`, the public
   bucket. A raw `r2://` ref in an `<img>` renders a broken glyph either way.

3. **"A word in a chip row" was, in production, worse than it sounds.**
   `interestChipLabel` prefers `vendor_services.title` and falls back to the
   category key — and **`title` is NULL on BOTH live services**, so the chip read
   "Live Band". This is also why the new card must not take its name from
   `readSnapshot`, whose fallback is *"Untitled service"*: taking it would have
   been a **regression** on every service that ships today. The card and the chip
   now resolve the name through the same two steps.

🔢 **Safe by arithmetic at build time:** `thread_service_interests` held exactly
one row (`source='initial'`) and **zero services had ever been offered**;
`chat_messages` held 3 rows across 1 thread. Nothing to backfill. Re-measure with
`select source, count(*) from thread_service_interests group by source` — never
trust this line as current.

⚠ **Still not proven:** that a forged `offered_service_id` (a couple naming a
rival supplier's service on their own message) is refused end to end at the
database level. `authenticated` holds INSERT on the column and RLS is row-level,
so the refusal lives in the READER and is unit-executed, not DB-tested. A
`tests/db/` behavioural test is the honest follow-up.
