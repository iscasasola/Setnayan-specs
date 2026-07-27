# The Service Card Wizard — THE service card maker · 2026-07-27

> Owner: *"plan the service card wizard. which will be the service card maker."*
> One wizard. A vendor builds the whole card in it — photo, price, exclusive, media,
> customization — and never meets a second editor. Grounded in `service-wizard.tsx` as it
> ships today; every "SHIPS" claim below was read off `origin/main`, not remembered.

## 0 · The rule that shapes it

**The couple meets ONE card, so the vendor meets ONE maker.** (Owner-locked 2026-07-27,
`DECISION_LOG` 🔒 ONE MAKER.) The wizard is that maker. Anything that ends up on the card is
authored here — nothing gets its own separate screen.

⚠ **Structural constraint, load-bearing for every step below:** the wizard is ONE `<form>`.
Every step is rendered at once and hidden with the `hidden` attribute (`show(id)`,
`service-wizard.tsx:88`), so **all fields post together** in a single `commitVendorService`
submit. A step is a *view*, not a save. Anything added must serialise into that one FormData.

## 1 · The steps

| # | Step | Holds | State |
|---|---|---|---|
| 1 | **What you offer** | category · **cover photo** · listing title | **SHIPS** |
| 2 | **Pricing** | `pricing_basis` (fixed / per-head / per-hour) · starting price · pax brackets | **SHIPS** |
| 3 | **Setnayan Exclusive** | the one thing couples get only by booking through Setnayan | **SHIPS** |
| 4 | **Value & media** | free inclusions (+ worth) · discounts · showcase photos + ≤30s clip | **SHIPS** |
| 5 | **★ Customization** | the choice/option structure the couple configures | **BUILDING** |
| 6 | **Comes with** | links to the vendor's OTHER service cards (pruned when they have none) | **SHIPS** |
| 7 | **Review & publish** | recap + the publish gate | **SHIPS** |

★ Customization sits at 5 deliberately: it builds on step 4's inclusions (the ⑂ split turns an
inclusion into lines), and a vendor should have said what the thing IS before saying how it
varies.

## 2 · The two the owner named — both already ship

**Cover photo (step 1).** `primary_photo_r2_key`. Copy: *"Couples see this on your service card
— it's the first thing they notice. PNG, JPEG, or WebP up to 5 MB. Required to publish."*
Carries the SETNAYAN watermark (owner-locked 2026-07-03) and, since #3793, downsizes in the
browser to 2000 px on the longest edge. **Gallery photos are separate**, in step 4: up to 5
showcase photos + one ≤30s clip, same watermark, same downsizing.

**Setnayan Exclusive (step 3).** `exclusive_perk_text`, max 500 chars. Copy: *"One thing couples
only get by booking you through Setnayan. This is required to publish — you can save a draft
without it."* Suggestion chips: Free add-on · Priority date hold · Setnayan-only rate ·
Complimentary upgrade.

That is exactly the owner's framing — *what they can offer on top of what they offer on the
market*. **No new field is needed; the concept is built and is a publish blocker.**

## 3 · The publish gate

Today: `canPublish = hasPhoto && hasPerk` (`:84`). A draft saves without either; **publishing
needs both**. Extended by the card-text gate (#3800/#3802, flag now ON): contact info, links or
an `@handle` in any card text refuses the save with the field named, `@Tagaytay` is told to
write *at Tagaytay*, and a blank name is **auto-named, never refused**.

⏭ Card health (below) reports; only these hard rules block.

## 4 · ★ Customization — the step being built

Reuses the shipped package machinery pointed at this service (one-service package, no new
tables). Four groups, a line lands in its group, changing a line's state moves it:

**Included in the price · Choices · Quantities · Optional add-ons**

- **Options** carry an **amount-only** price with a `+₱` prefix and live thousands-grouping.
  0 or blank RENDERS as "included" — the vendor never types that word (owner-locked).
- **Pick-N** — "choose 3 of 5" via `pick_min`/`pick_max`. Below the minimum the couple cannot
  send: an unfinished order, not a cheaper one.
- **Follow-ups** — any option can branch into its own line via `parent_option_id`; the couple
  sees it only once that option is picked, and follow-ups branch again, unlimited depth.
  ⛔ A follow-up can never be default-included or required — enforced by DB CHECK (#3823), so
  it cannot be priced while unpicked.
- **Quantities** — `max_extra_hours` caps extra hours on the existing hourly model.

⏭ Not in the first cut, in this order: **⑂ split** (an inclusion's "+"/count parsed into
lines) · **drag-and-drop** (the ⠿ grip; within a group reorders, across groups changes what the
line is) · **card health**.

## 5 · Card health — the advisory panel

Deterministic, no LLM, ₱0 per check (Rule 1). Recomputed on every edit, on every step. Extends
the shipped publish gate and the attributes completeness score to the whole card:

- ✕ **blockers** — no cover photo · no Exclusive · contact info · a pick-N asking for more than
  the options offered
- ⚠ **too complex** — more than ~6 up-front questions, with the fix taught: *fold the rare ones
  into ⑂ follow-ups; they only appear when picked*
- ✎ **auto-named** — "we named these for you — tap to change"
- ＋ **add** — fewer than 3 photos and no clip · a choice of one

## 6 · What the couple sees — the other half of the same rule

The wizard's whole purpose is the card, so the maker shows the couple's side live beside it
(the v20 principle: *"when we create a service card, we want to see the exact card"*). Card →
Details → Inquiry is the shipped flow; the **Details** screen, the **booked count** and the
**adaptive card** ride with the Explore session's card work
(`Integration_Contract_Booking_x_Explore_2026-07-27.md` §2).

## 7 · Build order

1. ★ Customization as a wizard step — core authoring. **BUILDING.**
2. Couple-side render of choices + follow-ups, with pricing that counts only what is visible.
   **BUILDING.** ⛔ Must ship together — the visibility rule cannot lag the renderer.
3. ⑂ split helper.
4. Drag-and-drop.
5. Card health.
6. §6.7 per-line special requests ("Anything else you need?").

## 8 · Open, owner's call

- **Guided-flow faith chips** — unrelated to this wizard but adjacent: the flow offers 16 and
  folds born-again under Christian. Reading a `born_again` value back is fixed (#3838); adding
  a chip is a product decision.
- **A bare platform name on a card** ("Viber only") passes the text gate — accepted trade, the
  price of allowing "Instagram teaser reel". Reversible if it ever bites.
