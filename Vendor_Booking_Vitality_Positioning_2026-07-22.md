# Vendor Booking Vitality & Positioning — Decision Doc (2026-07-22)

> **Status: OWNER-DIRECTED, adopted this session. Positioning + mechanism locked; two items still open (marked ⚠ OPEN).**
> Sits on top of, and does not replace, [`3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`](3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md) (the fee mechanism) and [`Booking_Fee_Build_Plan_2026-07-21.md`](0012_papic/Booking_Fee_Build_Plan_2026-07-21.md) (the build). This doc is the **vendor-facing narrative + the card-truth reconciliation strategy** that answers the owner's leakage worry — *"a vendor might under-declare or just not declare it."*

---

## 0 · TL;DR — what this decides

The leakage problem is **not solved by enforcement — it is dissolved by self-interest.** A vendor declares because declaring is how they get vitality, trust, and control over how the market sees them. This is the Rightmove / The Knot move (sell *presence and prominence*, never a cut of the deal) translated to Setnayan's constraints, taken one layer deeper: **we sell the vendor their own visible business health, and the Booking Fee is the key that turns it on.**

Three things are settled here:
1. **Positioning** — declaration = booking vitality; the fee is a *key, not a toll*; transparency is mutual (§3, §4).
2. **The fee-unlock list** — exactly what the ₱50–₱4,000 buys the vendor, which also resolves the refund-on-walk-away question (§4, §7).
3. **Card-Truth reconciliation** — how vendors are nudged to declare their honest *lowest* price up front, and how the card is kept honest over time via a 3-strike loop, Competition-Act-safe (§5, §6).

---

## 1 · The problem this answers

Owner's worry: under a per-deal Booking Fee, a vendor could **under-declare** (report a smaller value) or **not declare at all** (take the deal off-platform). Both were analysed against the current mechanism (the prepaid finalized-proposal gate):

- **Under-declaration is largely self-punishing** already — the declared amount *is* the proposal the customer pays against, so shrinking it under-charges the customer by the same amount (model doc §3.0d-ii). Not the real exposure.
- **Non-declaration / off-platform substitution** is the real residual, and no 0%/don't-hold-money marketplace has ever fully closed it (model doc §3.0d-ii residual leak; build plan §5 V1).

The resolution is **not** a detector. It is to make the on-platform path worth more than the dodge — by tying declaration to the vendor's own visible vitality, and by pricing the fee so low and so capped that evasion isn't worth the friction.

---

## 2 · Why this shape is right — the comparables

Every marketplace close to Setnayan's problem sorts by one question: **does the platform hold the money?**

| Platform | Fee event | Holds money? | Leakage handling |
|---|---|---|---|
| Airbnb / Upwork / Fiverr / Etsy | Commission on the booking | **Yes** | Solved by construction — they are the rail; contact masked until booking |
| Thumbtack / Bark / Angi / Zillow Premier Agent | **Per-lead** | No | Tax the lead — the category's most-hated model (Thumbtack true CPA **$500–$1,188**; pay *"even if the client does not purchase"*; Angi junk-lead class actions) |
| **Rightmove** | **Subscription** to list + rank | No | **Doesn't tax the deal at all.** 0% of the sale. Nothing to leak. Called *"one of the best businesses ever conceived."* |
| **The Knot + WeddingWire** | **Subscription / advertising** for presence | No | Same — couples free, vendors pay for visibility. Indifferent to leakage. (TKWW = a **$933M** vendor-funded business, Setnayan's exact shape.) |

**The rule:** if you don't hold the money, you cannot reliably tax the transaction — so you tax the *lead* (hated) or you sell *presence* (subscription). Setnayan is unambiguously in the bottom half. **Its structural twins do not tax the transaction; they monetize presence and prominence and don't care about leakage because there is nothing to leak.** Hence: subscription carries value capture, the capped Booking Fee is a thin feature-unlock layer, and we stop expecting any per-deal fee to be leak-proof.

*Sources: Thumbtack cost-per-lead 2026; The Knot / WeddingWire vendor pricing 2026; Upwork fees 2026; Rightmove / Zillow revenue-model teardowns. Full links in the session record.*

---

## 3 · The positioning — three pillars

The owner's ten lines organize into three pillars. **Declaration is sold as self-interest, never policed.**

### Pillar A — Declaration = your visible business vitality (carrot replaces stick)
- Performance naturally boosts you.
- Locking more means performing more.
- More bookings = more trust ratings for you.
- You have the power to control how the market perceives you.

A vendor who hides bookings isn't "evading a fee" — they are **starving their own ranking**. Setnayan never has to accuse anyone; the incentive does the work. (This is model-doc §3.0m forces 2 & 3, stated as *reward* rather than *deterrent* — the correct emotional register.)

### Pillar B — The Booking Fee is a key, not a toll
- *"Your booking fee unlocks your control to the event and updates your website accordingly."*
- *"Our booking fee starts at ₱50 only, up to ₱4,000. Even a ₱3,000,000 bundle is charged at most ₱4,000."*

Reframing the prepaid gate as **unlocking event control + a live storefront update** answers the vendor's only real question — *"what am I paying for?"* — with something concrete and durable. See §4 for the exact unlock list.

### Pillar C — Transparency is the deal, and it's mutual
- Transparency is key to a successful business with Setnayan.
- *"Our goal is to help you, but this means you need to help us maintain our services to provide the best output for your business."*

Honest, and it lands **because** Pillars A and B already gave the vendor a selfish reason to be transparent. Keep it light — overplayed, "you need to help us" reads as "pay up."

---

## 4 · The fee-unlock list (owner-confirmed — resolves §3.0d-iii-b)

The Booking Fee is charged when the vendor **prepays to send their finalized proposal** (model doc §3.0d). The moment the fee clears, the vendor unlocks — and **keeps** — the following, regardless of whether the couple ultimately accepts or walks:

1. **Event control panel** — the vendor's working surface for that specific engagement: call-time / schedule, deliverables, the couple's relevant details, and the booking thread pinned to the event.
2. **Live storefront update** — the vendor appears as a confirmed vendor on the couple's live event site/landing; **and** their own public card, past-events, and verified median update from this recorded booking.
3. **Verified booking record** — counts toward trust rating, review eligibility, and boosted placement (performance → boost).
4. **Proposal delivery** — the finalized proposal is delivered to the couple to accept.

> **⭐ Why this resolves the open refund question (model doc §3.0d-iii-b).** The refund question was open because the fee felt like it bought *nothing* if the deal died. But items 1–3 are **durable unlocks the vendor keeps even if the couple walks** — they got the workspace, the record, and the positioning update. So **"no refund on walk-away" is now fair and obvious**: the vendor already received what they paid for. The fee buys *control and standing*, not a guaranteed sale.

---

## 5 · Card-Truth — getting (and keeping) the vendor's honest lowest price

**Goal (owner): vendors offer their real lowest price up front, bound to the services it buys — so budget couples can find them.** This is **liquidity engineering**, not fraud control: a vendor who cards *"from ₱100k"* but books ₱60k jobs is invisible to every ₱60k couple, and that dead demand is what kills a young marketplace. The fee already self-protects (§1); this mechanism protects **matching quality and market coverage.**

### The trap it must avoid (model doc §4.2c, a durable rule)
*"Offer your lowest price"* must **not** become *"post a fake ₱500 anchor and upsell."* That is the drift that killed price-banding. **Firewall: a declared floor is BINDING to its inclusions.** A ₱500 entry package buys exactly ₱500 of defined service, contractually. Low is fine; *fake*-low is structurally impossible because price is chained to what it delivers.

### Moment 1 — Onboarding: capture the honest floor
Make *"your real starting package — the lowest thing you'll actually do, and exactly what's included"* a **required setup step**, framed as *"this is how budget couples find you."* Higher tiers stack above it. This is where *"offer your lowest price in the beginning"* is achieved — as an onboarding design goal, not a policing one.

### Moment 2 — Ongoing: the 3-strike reconciliation loop
Each finalized booking is reconciled against the vendor's **own card** (never the market):

1. **Trigger** — a booking whose value falls materially below the vendor's own declared entry floor for that category = a candidate flag.
2. **Exclusion valve (this is what makes "3" fair)** — at the moment of a below-floor booking, the vendor may tag it *family rate / comp / off-season / stripped scope*, capped at N per year (model doc §3.0a already allows this). Tagged bookings **do not count** toward the flag. Without the valve, three legitimate favors would falsely convict an honest vendor.
3. **Pattern** — **3 similar *untagged* flags** (same category, comparable scope and gap). One low booking is noise; three is the vendor's actual price. That is precisely why 3 — it is the line where an exception becomes a market.
4. **Assessment — assisted, not punitive** — *"Your last 3 photography bookings landed near ₱60k; your card starts at ₱100k. Update your entry package so the right couples find you?"* One-tap accept. This is Pillar C in action.

### The bite — soft-suggest + quiet-median (owner-adopted this session)
- **Displayed card = soft suggest only.** Setnayan *offers* the correction; the vendor chooses. This honors *"you control how the market perceives you"* — we never forcibly rewrite a vendor's public packages.
- **Matching = quiet observed-median.** Regardless of what the vendor leaves on the *displayed* card, Setnayan AI / Merkado / budget-matching route on the **observed median of real bookings** (model doc §3.0a). A stubborn vendor who ignores the suggestion still gets matched to their real couples — the truth wins passively, no confrontation.
- **Escalate (badge → demotion) only** for the rare vendor who is provably deceptive *and* games the exclusion valve. That is the existing §3.0b ladder, scoped to **listing accuracy**, not the fee.

**The elegance:** we get to say *"you're in full control of your prices"* (true — the displayed card is theirs) **and** the marketplace never misroutes demand (matching follows observed reality). Vendor autonomy and liquidity health stop being in tension.

---

## 6 · The Competition-Act guard (owner-confirmed: own card only)

Everything in §5 compares a vendor's bookings **to their own declared card — never to the market.** This is the line the PH Competition Act draws (model doc §3.0b legacy guard, owner decision 8):

| ❌ Never say | ✅ Always say |
|---|---|
| "Your price is below market." | "Your bookings don't match your own card." |
| "We'll adjust you to the market." | "We'll match you to where your **own declared prices** put you." |

Rule of thumb, owner-locked: **consistency with your own card is fine; conformity to the market is forbidden.** Budget vendors are market coverage we *want* — a mechanism that makes them feel policed costs us the entire low-tier supply.

---

## 7 · What this resolves, what stays open

**Resolved this session:**
- **Refund on walk-away (model doc §3.0d-iii-b)** — resolved by the fee-unlock list (§4): the fee buys durable control + standing, so no refund is owed. → close the sign-off as *"no refund; fee buys unlocks, not a guaranteed sale."*
- **Competition-Act wording** — own card only (§6).
- **Displayed-card vs internal matching** — soft-suggest displayed + quiet-median matching (§5).

**⚠ OPEN — still needs owner/counsel:**
- **The fee-unlock list (§4) must be built to match the copy exactly.** "Unlocks event control + website" is now load-bearing (it is both the value story *and* the refund answer). The exact panel/site behaviors in §4 items 1–4 must ship as described, or the pitch is a fake door.
- **Consumer disclosure of declared-amount-scoped protections (model doc §6 #3m-a)** — Pillar A's "the customer becomes the enforcer" force only works if couples are told their recourse scopes to the declared number. Needs consumer-facing copy + probably counsel.
- **Subscription ladder pricing (model doc §6 #22)** — this whole doc assumes the subscription carries value capture (the Rightmove/The Knot answer). The four tiers remain unpriced. **This is the real open revenue work — not the fee-event debate.**

---

## 8 · Vendor-facing copy — first draft (to the ten lines, Competition-Act-safe)

> **Your bookings are your business — show them, and grow.**
>
> On Setnayan, every booking you record is how the right couples find you.
>
> - **Performance boosts you.** The more you book, the higher you rank — automatically.
> - **Your prices are your packages.** Set your real starting price and what it includes; couples find you by it.
> - **Your bookings keep your packages honest.** If your bookings keep landing below your own card, we'll suggest updating it so the right couples reach you — you're always in control of your prices.
> - **More bookings = more trust.** Every recorded booking builds your ratings and your standing.
> - **You control how the market sees you.** Transparency is how you win here.
>
> **And the fee is tiny — and it's a key, not a cut.**
>
> - Your Booking Fee starts at **₱50**, and never exceeds **₱4,000** — even on a ₱3,000,000 booking.
> - Paying it **unlocks your control of the event and updates your live storefront** — your event workspace, your booking on the couple's site, and your verified record all go live.
>
> **We grow when you grow** — the fee is what keeps the service running so it keeps working for your business.

*(⚠ Copy is a commitment, not marketing — every claim above must match the shipped mechanism. The "keep your packages honest" line is the Competition-Act-safe rewrite of the owner's original "adjust you to your market.")*

---

## Sign-off log

| Date | Item | Owner call |
|---|---|---|
| 2026-07-22 | Positioning = declaration-as-vitality; fee = key not toll; transparency mutual | ✅ adopted |
| 2026-07-22 | Fee-unlock list buys durable control + standing → resolves refund-on-walk-away (no refund) | ✅ adopted |
| 2026-07-22 | Card-Truth: onboarding floor + 3-strike reconciliation, exclusion valve, own-card-only | ✅ adopted |
| 2026-07-22 | Bite = soft-suggest displayed card + quiet observed-median matching | ✅ adopted |
| 2026-07-22 | Competition-Act wording: consistency-with-own-card only, never market conformity | ✅ adopted |
| — | Subscription ladder pricing (the real value-capture layer) | ⚠ OPEN (model doc §6 #22) |
| — | Consumer disclosure of declared-amount-scoped protections | ⚠ OPEN (model doc §6 #3m-a) |
