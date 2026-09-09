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
| ~~**S1**~~ | 🛑 **CLOSED — DO NOT BUILD.** The change card is not missing; it was **built and deleted on purpose** (commit `d3350b8e2`, 2026-07-24, council verdict *"as simple as possible"* — the bundled **Deal** is a superset, so couples see ONE money card). Its producing chip went with it, and both writers of `chat_messages.change_order_id` have **zero importers**, so **nothing can put that marker on a message**. **Decisions therefore cannot omit a change — it is a THREE-marker filter** (`proposal_id · appointment_id · amendment_id`) + the payment and guest-count cards. Held by `lib/the-change-marker-is-retired.test.ts`. ⏭ Reversing that verdict is an **owner decision**, not a session. 🔴 **AND A BIGGER ONE SURFACED — corrected twice, third reading measured.** Accepting is an AGREEMENT by design; the money lands at **LOCK** (`total_cost_php`, an absolute write) and the couple is prompted with the exact figure, so the not-yet-booked path is fine. **The defect is the ALREADY-BOOKED path:** a `contracted` supplier is deliberately never repriced, yet the couple is still told *"Deal locked — price frozen"* while the budget keeps the old number. 🛑 **The obvious fix corrupts the budget** — a delta line on a headline-billed supplier returns **−₱15,000**, not ₱85,000 (pinned in `lib/a-settled-delta-must-not-erase-the-headline.test.ts`; `accept_change_order` already carries it). **Two owner decisions, neither taken.** | — | — | ⚠ Prod could not have answered this: **3 chat messages total, zero rows on ALL FOUR markers**, including the two that work — emptiness cannot tell *unreachable* from *unused*. The import count can. |
| **S2** | **Decisions** — the All · Decisions · Files switch, every card's **NOW** line, the standing sentence. **THREE markers, not four** (see S1). | opus · **xhigh** | — (S1 closed) | Three sources merge into one timeline (messages, the guest-count card, the payment card), and only the five ladder words may wear a pill. The most conceptually loaded piece left. |
| **S3** | **The conversation column** — the list beside the thread, its filter chips, the batched row builder. A branch is PARKED at `claude/parked-conversation-column`; reconcile with v4 first. | opus · **high** | — | Batched reads and a stage per row; easy to get quietly wrong. |
| **S4** | **Short previews** — fact-first generated lines; the element that could not ellipsis; the tag shown only when it varies. | sonnet · **medium** | S3 | Mechanical once the column exists. ⚠ The supplier's `/vendor-dashboard/bookings` inbox ALREADY renders a preview and already fetches the "You:" sender and throws it away — fix that one too. |
| ~~**S5**~~ | ✅ **BUILT** — a service offered in chat arrives as the supplier's CARD. PR [#5350](https://github.com/iscasasola/setnayan-platform/pull/5350). See § S5 below for three corrections this session measured. | opus · **high** | — | Touches the offer write path and the couple's render; the media is the pitch. |
| **S6** | **The bench standing sentence** + **"2 suppliers replied"** + the **Open conversation** relabel. | opus · **high** | S2 | Must reuse the ONE derivation (`resolveThreadStage` + `rowReadsCompleted`); a second one is the failure this repo keeps producing. |
| ~~**S7**~~ | ✅ **SHIPPED — PR [#5351](https://github.com/iscasasola/setnayan-platform/pull/5351).** The couple's lens joins the shipped tail-tier re-rank; relationship / boosted / top-reviews never move by algorithm. 🔑 **THE BOUNDARY IS ENFORCED BY CONSTRUCTION, NOT BY A WELL-BEHAVED COMPARATOR:** `orderInlineMoreRow` collects the INDICES holding tail rows, orders that sub-list and writes it back into the SAME indices, so a protected row cannot move because no other index is ever written. ⚠ **And the tail is NOT a contiguous suffix** — the service-date down-rank stable-partitions busy vendors to the very end ACROSS tier boundaries, so a boosted vendor busy on the date legitimately sits below tail rows and "sort the last N" would have dragged a paid card around. 🧩 **Two new fields, derived once where they are already known:** `ladderTier` (stamped at the four assembly steps in `category-search.ts`, never re-derived downstream — before this the tiers existed only as local variables, so no caller COULD have respected the boundary) and `startsAtPhp` (a service floor, **not a quote**; its read already ran unconditionally for the free budget-fit score, only the exposure is new, and the flag-gated `_startsAt` → `budgetPressure` path is untouched). ⛔ **`boosted` is deliberately withheld from the scorer** — it is `ad_rank > 0`, and feeding it would let ad spend buy score inside the one tier meant to be free of it. ONE comparator now serves both rows (`orderByBenchSort` extracted from `sortWithReasons`), and "can this lens discriminate?" reuses the shipped §15.2 `hideWhen` rather than a second copy. ✍ **The honest sentence ships too**, built from the tiers ACTUALLY PRESENT and from whether the sort could discriminate — *"Featured and most reviewed first, then your ‘Lowest price’."*, and *"…then Setnayan's order."* when it had nothing to go on. 🔬 **11 of 11 mutations proved red** (22 tests, exit 0); one guard was **decoration** and the battery caught it — with no prices every card ties at Infinity and `Array.sort` is stable, so deleting the no-signal check changed nothing, and the test was rewritten against a lens where the move is visible. All three bench guards green with the port baseline **untouched**. | opus · **xhigh** | — | It touches an **owner-locked commercial ladder** where paid placement lives. Getting the boundary wrong moves money. |
| **S8** | **Drag to rearrange** — long-press, pins beat sort, "Your order" + Reset, keyboard move-left/right, shared across every host of the event. | opus · **xhigh** | S7 | Gesture conflict with a horizontal snap carousel, a11y, and new shared per-event state. The hardest UI piece left. |
| **S9** | **The follow-gate Message** on a supplier's public profile — and it **silently drops the supplier's address** when the couple has no celebration yet. Plus deleting ~60 lines of follow-gate recovery with no caller since 2026-09-08. | sonnet · **medium** | — | Small and well understood; the deletion wants its own readable diff. |
| **S10** | **The Exclusive · the shelf and the publish gate.** Five products; price + cover photo + title + inclusions + a gift picked from the shelf. | opus · **high** | **G1 · G3 · G4** | Money-shaped, and it retires a free-text field two surfaces read. |
| **S11** | **The Exclusive · availability, fallback, and the grant.** Show what is GIFTABLE, never what the couple owns; the pick is a preference; the fallback matches the VALUE. Uses the shipped `comp_grants` / `vendor_self_comp`. | opus · **xhigh** | S10 · **G5** | Race between pick and grant, a quota trigger, and a rule that must never disclose the couple's purchases. |
| **S12** | **The Exclusive · the lock bill.** Added, never deducted. Granted when the money CLEARS. Supplier pays the lower price where a second one exists. | opus · **xhigh** | S11 · **G1 · G2 · G4** | Real money on a real bill. |

---

## SEQUENCE

```
NOW, nothing blocking:      S2 · S3 · S7 · S9        (S1 CLOSED · S5 CLOSED — do not build)
after S2:                   S6
after S3:                   S4
after S7:                   S8
behind owner gates:         S10 → S11 → S12
```

**Ten sessions of engineering, three of them gated on decisions only the owner can make.**

### ⛔ Pairs that must NEVER run together

They edit the same file and one will silently revert the other.

| never together | shared file |
|---|---|
| **S6 · S7 · S8** | `shortlist-categories.tsx` — run them in that order, one at a time |
| **S2 · S3** | the vendor thread page |
| **S10 · S11** | the service card + the publish gate |

⚠ **S5 (#5350) edited `service-card-face.tsx`** — it added an optional `footer`
prop so a live conversation does not render the preview's mock "Request a quote"
chip. **S10 and S11 both touch that file.** Rebase on `main` before starting
either, and keep the `footer === undefined` distinction: an omitted footer means
"draw the preview chip", `null` means "draw nothing".

Safe to run in parallel: **S2 + S7** · **S9 + anything**. (S5 is CLOSED — PR #5350.)

🔑 **Never more than two at once.** Ten parallel builds once shipped 44 defects
(`REDESIGN_SESSIONS_2026-08-12.md`).

---

## GATES — each one blocks its session, and only the owner can close it

| | gate | blocks |
|---|---|---|
| **G1** | **40% of the fee** — the shape is settled, the number is margin | S10 · S12 |
| **G2** | Do a supplier's **first five free bookings** carry a gift? Today's rule says no fee ⇒ no gift, and those five are when a new supplier most needs to impress | S12 |
| **G3** | A **measured cost** for the **Mood Board Render Pack** (50 renders) and **Live Studio** — the only two on the shelf that cost per unit, and neither has a figure | S10 |
| **G4** | A **supplier price** for Event Hub Pro · Live Studio · Mood Board pack (the other two already have a second price we can charge) | S10 · S12 |
| **G5** | Is **Live Studio** once per event, or **per event-day**? The 0011 spec says per-day | S11 |
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
