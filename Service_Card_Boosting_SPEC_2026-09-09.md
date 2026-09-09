# Service Card Boosting — build spec

> Owner rulings, 2026-09-09. **Prepare now, applies per coverage as the market arrives.**
> Research: The Knot · WeddingWire · Bridebook · Hitched · Thumbtack · Bark · Angi/HomeAdvisor
> · Houzz · Airtasker. Full findings in `DECISION_LOG.md` 2026-09-09.

## The one-line version

**A shop buys days on screen for ONE service card, in ONE coverage, at a published flat
price — never per inquiry, never by auction.**

---

## 🛑 Why not the pay-per-inquiry bidding first asked for

Recorded because it will be proposed again by somebody who has not read this.

- **No wedding marketplace on earth charges per lead.** The Knot, WeddingWire, Bridebook
  and Hitched all sell subscription or placement. Per-lead is a **home-services** model —
  many small fast jobs. Weddings are few, large and slow. **The opposite shape.**
- **The numbers:** a wedding-photography enquiry costs **$70–$130** on Thumbtack ($150+ when
  sole pro). One photographer: **~$1,200/month to book 3 weddings ≈ $400 per booked wedding.**
  Angi shared leads pass **$1,700 per booked job.** Shared leads close **5–12%**, exclusive
  **20–35%**, and **78% of customers go with the first responder** — so four of five shops
  bought a lottery on reply speed, at full retail.
- **Angi/HomeAdvisor paid a $7.2M FTC settlement** (Jan 2023, $3M+ refunded) over
  lead-quality and matching claims — then **cut lead volume 81% in 2025, lost ~30% of
  revenue, and came out MORE profitable** with better supplier win rates. *The biggest
  player in the model abandoned the model.*
- **A thin market cannot hold an auction.** Setnayan will have 2–10 shops per category. An
  auction there yields a quiet settle at the floor, or one shop owning the category.
- 🔴 **And the disqualifying one:** suppliers recover lead costs **inside their quotes**, so
  the couple pays. That makes *"others charge 25% commission, we only charge 5% and 1%"*
  untrue in substance while staying true on paper. **The sales line is really a promise
  about RISK — you pay us when you get paid.** Featured keeps that promise; per-lead breaks it.

🔑 **The closest structural cousin is Airtasker — and Setnayan already IS it:** 12.5–20%
charged only on jobs you are **assigned**, tapering to 1.9% for a repeat client. *"If you
don't win the task, you won't pay."* That is the booking fee.

---

## The model

| | |
|---|---|
| **Unit** | days on screen — 7-day blocks (28-day at a small discount) |
| **Subject** | ONE **service card** — never the shop (owner: *"boosting is not per vendor but per service card"*) |
| **Scope** | that card's **coverage** — its category **and** its service area |
| **Price** | **published, flat** within a coverage. Prepaid. No bid, no reserve, no dynamic pricing |
| **Position** | the **boosted rung the ladder already has** — below the couple's own relationships, above top-reviewed, above the tail |
| **Label** | every paid card is visibly **Featured**. Non-negotiable |

### 🚪 The traction gate — owner-set

> *"if there are already at least 20 in the same coverage as their service card. if less
> than 20, then boost is not needed."*

**A card is boostable only when ≥ 20 competing cards share its coverage.** Below 20 a couple
can see everybody, so a slot sells a position the shop already holds.

⚠ **Per coverage, automatic — never one global switch.** 58 vendor categories exist and
**four are in use**; a single flag opens boosting where it is meaningless.

### The three caps

1. **Cap as a SHARE of the page, never a count.** At most **1 card in 4** among the first
   results. In a category of three shops, three boosts means nobody is boosted.
   *This is the shipped ladder's own principle — `ad_rank` is documented as "a light nudge,
   NOT a takeover" — given a number.*
2. **Scarcity is the product.** The moment everyone can boost, boosting is worth nothing and
   shops have been trained to pay for parity.
3. **Cap consecutive blocks** — two, then one off.
   🔴 **COUNT THE SHOP, NOT THE CARD.** A shop with three cards in one category otherwise
   rotates them and owns the coverage forever while every card obeys the rule. The
   share-of-page cap must also count **distinct shops**, or one business fills every paid
   position on a page.

### Boostable is a higher bar than publishable

Measured today: **both live cards have no title, one has no cover photo.** A boosted card
showing its category where its name should be is worse than no boost — it wastes the shop's
money and puts the weakest card where a couple looks first.

⇒ a card qualifies only if it would **survive being looked at**: a real title, a cover photo
that resolves, a price, and what is included. Reuse the shipped publish gate **plus** the
card-health blockers; do not invent a third rule.

### The make-good

A block that showed the card to **zero** couples is credited back as another block,
**automatically — no ticket**. That is the one fear worth insuring: paying for silence.
⚠ In a scarce-slot model a free block is a block nobody else can buy. Price it in, or make
the make-good a **different** block.

### What the shop sees

A plain count: how many couples **saw** the card, **opened** it, **wrote**. Counted by us.
⛔ **No outcome claims.** Sell placement — *"your card shows here for 7 days"* — never
*"get X inquiries"* or *"shops like yours book Y%"*. Production has no data to support either.

---

## ⛔ What it must not break

- **The sales line.** Featured is a marketing spend **beside** the fee, never a fee on the booking.
- **The ungated inbox** (owner-locked 2026-07-24). Inquiries, replies, chat and proposals stay
  free on every plan. Anything that charges or meters a couple reaching out is a different
  product.
- **The match score.** Money never enters the compatibility percentage — the scorer takes
  `boosted` as a position hint only, and the tail-tier scorer refuses it entirely.
- **The relationship tier stays first.** A couple's own people are shown before any paid card, always.
- **The 2026-09-09 tail-tier boundary.** A couple's own sort re-orders the tail ONLY; the paid
  and top-reviewed rungs stay where the ladder puts them.

---

## What already ships — do not rebuild

- `ad_rank` on `vendor_market_stats`, and the **four-rung ladder** with paid already a rung.
- `inquiry_outcomes_won_lost` (migration `20270324681685`) — **Setnayan already knows whether an
  inquiry was won or lost**, which is what would let it refund losers automatically. *Recorded
  as an option; not built.*
- The apply-then-pay order path every other purchase uses.

**Build size: small-to-medium — roughly 3 PRs and one migration.**

---

## ⏭ Open — the owner's, and it does not block the build

**Is Featured a tier benefit, a separate purchase, or both?** The 2026-07-25 monetization lock
already lists *"Search boost + Featured slots — / small / bigger / top"* as a benefit of
Solo / Pro / Enterprise. The mechanism is the same either way; only where the entitlement
comes from changes. **Build the slot; bind the entitlement last.**

✅ **Settled 2026-09-09:** the 2026-05-28 ruling *"remove the current boosting · we add it
later"* — **later is now** (owner: *"we are building this now"*, *"we will prepare boosting also"*).
