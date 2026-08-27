# Vendor Subscription Ladder — Base + Add-Ons (2026-07-22)

> **Status:** **LOCKED** — the full matrix below (base prices, the three add-ons + their prices, Deep Search metering, Vendor AI graded-by-tier, "open it up"). **OPEN** — the small items in §5 (free-Basic-AI-during-launch, base-without-AI = zero AI, Photo-Challenge fake-door build, 3D booth-render economics).
> Companion docs: [`Vendor_Booking_Vitality_Positioning_2026-07-22.md`](Vendor_Booking_Vitality_Positioning_2026-07-22.md) (positioning), [`Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md`](Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md) (carries the same matrix + build detail), fee mechanism in [`3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`](3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md). This is the **value-capture layer** (Booking Fee capped at ₱4,000 → the subscription is where the money lives, model §6 #22).
> ⚠ **Not yet written to `vendor_billing_catalog` / `Pricing.md § 00`** — canonical update owed once signed off.

---

## 0 · The model — lean base + à-la-carte add-ons (owner-directed 2026-07-22)

The vendor buys a base subscription, then **chooses modules.** The through-line: **vendors are a distribution channel — each add-on differentiates the vendor AND drives Setnayan product adoption.** The vendor promotes Setnayan AI, Papic (+ Photo Challenge), and the 3D Plan (booth) to their own couples.

---

## 1 · The full matrix (LOCKED 2026-07-22)

| | **Solo** | **Pro** ⭐ | **Enterprise** |
|---|---|---|---|
| **Base** /28d | **₱1,000** | **₱2,500** | **₱8,000** |
| annual (~2 mo free) | ₱10,000 | ₱25,000 | ₱80,000 |
| Booking Fee | 2.0% | 1.5% | 1.0% |
| **+ Vendor AI** (= the AI Chatbot) /28d | +₱1,500 | +₱1,500 | +₱1,500 |
| **+ Unlimited 3D Plan** /28d | — | +₱1,500 | +₱1,500 |
| **+ Photo Challenge** /event | — | +₱400/event | +₱400/event |
| **Deep Search** (metered) | ₱500/search | 1 free/cycle, then ₱500 | 1 free/cycle, then ₱500 |

*(Also: **Free ₱0** base — the floor, no add-ons; **Custom** — the unlimited tier above Enterprise, **₱11,000/28d** since 2026-08-27. ⚠ **NEVER RE-TYPE EITHER FIGURE** — `vendor_billing_catalog` is the source; the numbers in this table are a snapshot.)*

> 🔓 **THE RULE, NOT A NUMBER: CUSTOM'S FLOOR TRACKS ₱1,000 ABOVE ENTERPRISE.** When Enterprise moves, Custom's base moves with it, because Custom is sold as the tier ABOVE Enterprise and a shop comparing them must never be asked to pay more for less.
>
> 🚨 **THIS LINE USED TO BE THE WARNING THAT PROVED WHY A DOC CANNOT HOLD A RULE.** For five weeks it read *"⚠ With Enterprise now ₱8,000, round Custom's floor to ₱9,000 for consistency"* — correct, unactioned, and by 2026-08-27 doubly stale (both figures had moved). Nobody actioned it, and on 2026-08-27 the owner raised Enterprise to ₱10,000 while Custom's base sat at ₱8,999: **the tier above cost ₱1,001 LESS than the tier below.** Caught before anyone was quoted it — production held two vendor profiles and both were `solo`.
>
> ✅ **SO THE RULE IS NOW ENFORCED IN CODE, AND THIS DOC IS NO LONGER THE ONLY THING HOLDING IT.** `apps/web/tests/db/custom-sits-above-enterprise.db.test.ts` reads BOTH prices out of the catalog — neither is typed into the guard — and fails the build if Custom's base is ever less than or equal to Enterprise's 28-day price. It pins the RELATIONSHIP, never the amounts, so any reprice the owner likes still passes as long as the ladder stays the right way up. Owner, 2026-08-27: *"tie it to Enterprise so it can never invert again."*
>
> 🔴 **AN OPEN ₱500 QUESTION SITS ON THAT ₱11,000.** It follows the ₱1,000-above shape of the old warning. The **signed** rate card states a different construction — *"owner-decided 2026-07-04: lean base = Enterprise ₱7,499 + **₱1,500 white-glove premium**"* (`VENDOR_TIERS_AND_BENEFITS.md` §11), which is literally how the live ₱8,999 was derived and whose floor note says *"the white-glove premium is the point of Custom"*. That rule gives **₱11,500** at Enterprise ₱10,000 — and it also shows the old warning was already off its own precedent (₱8,000 + ₱1,500 = ₱9,500, not ₱9,000). ₱11,000 stands because it is what the owner ruled on 2026-08-27; the discrepancy is recorded rather than silently corrected, because the number is his.

**Anchors:** Pro ₱2,500 ≈ **Bridestory Gold parity** (≈₱2,440) — but inbox never gated + 3D booth + market intel Bridestory has no equivalent of. Base prices **rounded to clean numbers** (was ₱999/₱2,499/₱7,999) — this diverges from the live-DB catalog; update owed (§6). Fee buy-down (2.0→1.5→1.0%) is a **sweetener** (₱4,000 cap makes it marginal), not the price basis.

---

## 2 · The add-ons

### + Vendor AI (= the AI Chatbot) — **flat ₱1,500/28d add-on** (owner-set 2026-07-22 · supersedes the graded 500/1,000/1,500)
**One vendor AI product** — "AI Chatbot" and "Vendor AI" are the same thing: a **flat ₱1,500/28d** add-on on top of any paid base tier (not graded by tier). It is the AI that **auto-answers couples on the vendor's behalf** + the productivity layer (Proposal Maker · booking analytics / price-reconciler · coverage signals · voice-match · precompute · in-booth embed).
- **📥 The INBOX is free; the AI is paid.** Couples can always message a vendor, and the vendor can always read + reply **by hand**, free — *"inbox never locked"* is about un-gated **messaging** (the anti-Bridestory line), **not** a free bot. The ₱1,500 buys the AI that auto-answers. **There is NO separate free auto-reply bot** — this **supersedes** the earlier "free couple-facing chatbot base."
- **🎁 FREE for the first cycle (28 days) on account activation + verification** — the standing onboarding trial (verification-gated → abuse-resistant + rewards verifying; one-time per verified account; Deep Search metered, 1 free search in the trial). The trial is also what **rescues the flat price** — a solo tries it before facing the ₱1,500. See §5 #1.
- Deterministic (₱0 marginal → high margin); Deep Search metered separately (₱500/search).
- 🚫 **No external / third-party chatbot sync — DECIDED (owner 2026-07-22).** The "what if a vendor doesn't want our AI?" case is already covered: they use the **free inbox** (reply by hand) or **try our AI free for a month** first — nothing is lost by declining. Reasons to decline: external sync cannibalizes this ₱1,500 SKU, opens a disintermediation/leakage channel inside the inbox, and egresses couple PII to an unconsented processor (RA 10173). Interoperability, if ever, = a paid Enterprise API that replies *through* Setnayan, not an outside bot operating inside it.

### Deep Search — **₱500/search flat, SEPARATE from the AI add-on** (owner-resolved 2026-07-22)
Web data-gathering + auto-fill; **each run learns + updates** the vendor's own data. Metered independently of Vendor AI: **Solo pays ₱500 each · Pro & Enterprise include 1 free per 28-day cycle, then ₱500.** Real web/compute cost sits here; the rest of Vendor AI is deterministic (₱0 marginal → high margin).

### + Unlimited 3D Plan — **₱1,500/28d · Pro / Enterprise only** (owner 2026-07-22)
The vendor's **branded virtual booth** inside their couples' 3D Plans + **unlimited** sponsored activations (the "how many activations?" question is answered: **unlimited**). ⚠ Booth only renders in **published** rooms (~1 in 12 couples publish unprompted) → the value is the vendor **activating the 3D Plan for their couples** ("your photographer unlocked the 3D plan"). Booth-render economics live in §5 / the 3D-plan memory.
- **🎁 FREE on first-time subscription (first 28-day cycle), one-time per account** (owner 2026-07-22) — mirrors the Vendor AI trial. **Two-for-one adoption hook:** the free month's *unlimited* activations also seed the **couple-side** 3D experience (their couples get published rooms free). ⚠ Cost is bounded by the vendor's real couple count — watch a big-roster Enterprise vendor publishing many rooms in the free window; one-time-per-account is the guard.

### + Photo Challenge — **₱400/event · Pro / Enterprise · Papic-gated** (owner 2026-07-22)
The vendor **sponsors** a guest photo-engagement challenge/mission at an event (unlimited challenges within that event). **Requires Papic active on the event**; **free & inclusive for guests/couple** (vendor pays, guests play free). **Booked-vendors-only, their own events** — no third-party placement, ever (the brand line that retired AdSense). Rides Papic infra (0012). ⚠ **"Photo Challenges" is a LIVE FAKE DOOR** (`app/[slug]/page.tsx:3152,:4178` advertise it; zero game machinery exists) — **build it before selling it** (`0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md`).

---

## 3 · "Open it up" — name & inbox are NEVER gated (owner: *"open it up"*)

The "website name reveal" paywall lever is **dropped.** Gating a vendor's *name* pre-inquiry violates *"search must never return empty"* and *"nothing couple-facing may be tiered,"* and is the Bridestory credit-gated-inbox move Setnayan attacks. Couples always see who's there and message them free, every tier. Paid tiers buy **prominence and reach** *among already-qualified* results — never *existence*. Money can't buy relevance.

---

## 4 · What each base contains

Add-ons aside, the base tiers differ on **reach · team seats · categories · market intel · fee buy-down:**
- **Free ₱0** — verified shop · unlimited free leads · **free inbox** (couples message free; vendor replies by hand — no AI auto-reply unless Vendor AI is bought) · reviews · verified median · past-events · 1 category · local reach · grey placeholder booth.
- **Solo ₱1,000** — Free + reach + analytics + booking-vitality dashboard + **eligible to add Vendor AI (₱1,500)**.
- **Pro ₱2,500** — Solo + **Market Intel** (Demand Radar + Price-Position) + expanded reach + up to 3 seats + featured placement + **eligible for Vendor AI (₱1,500) + 3D Plan & Photo Challenge.**
- **Enterprise ₱8,000** — Pro + up to 10 seats + 100 km reach + unlimited categories + priority + read API + SLA + **eligible for Vendor AI (₱1,500).**
- **Custom** — unlimited + à-la-carte.

---

## 5 · Open items

1. ✅ **RESOLVED — Vendor AI FREE for 1 cycle (28 days) upon account ACTIVATION + VERIFICATION** (owner 2026-07-22). A **standing onboarding trial**, not just a launch-window perk: every newly-verified vendor gets one free month of Vendor AI, then converts to paid. **Verification-gated = abuse-resistant** (each account needs real DTI/BIR docs → multi-account trial-farming is hard) **and it rewards completing verification.** *(Grade sub-decision is now moot — Vendor AI is flat ₱1,500, one product.)* ⚠ PROPOSED sub-decisions: **(a)** Deep Search stays metered, but include **1 free search** in the trial (it has real web cost — not unlimited-free); **(b)** **one-time per verified account**; **(c)** "1 month" = one 28-day cycle, to match the billing unit. *(The owner rejected the 3-month extension; the 1-month stands.)*
2. **Confirm base-without-the-AI-add-on gets ZERO AI** (assumed) — i.e. no AI leaks into the bare base tier.
3. **Photo Challenge is a fake door** — build the game machinery (rides Papic 0012) before selling the ₱400/event add-on, or pull the live copy.
4. **3D booth renders only when the couple publishes** (~8%) — the vendor's ₱1,500 buys unlimited activations, which is how the vendor *drives* publishing; make sure the pitch says "activate it for your couples," not "passive booth."
5. Carried: consumer disclosure of declared-amount-scoped protections (model §6 #3m-a).

---

## 6 · Reconciliation to prior canon (update owed)

- **Base prices moved to clean round numbers** — ₱1,000 / ₱2,500 / ₱8,000 (from ₱999 / ₱2,499 / ₱7,999). **Update `vendor_billing_catalog` + `Pricing.md § 00` + the `CLAUDE.md` vendor-side line** when locked.
- **Token packs are gone** (retired 2026-07-21). Pitch = **base subscription + Booking Fee + optional modules** (Vendor AI · Deep Search · 3D Plan · Photo Challenge). No third currency.

---

## Sign-off log

| Date | Item | Status |
|---|---|---|
| 2026-07-22 | Base prices → Solo ₱1,000 · Pro ₱2,500 · Enterprise ₱8,000 (round numbers) | ✅ owner-set |
| 2026-07-22 | ~~Vendor AI graded Basic/Medium/Full 500/1,000/1,500~~ → **SUPERSEDED same day** | 🔁 replaced by flat ₱1,500 |
| 2026-07-22 | **Vendor AI (= the AI Chatbot) = FLAT ₱1,500/28d add-on** (all paid tiers) | ✅ owner-set |
| 2026-07-22 | Deep Search ₱500/search, separate from AI; Pro/Ent 1 free/cycle | ✅ owner-set |
| 2026-07-22 | Unlimited 3D Plan +₱1,500/28d (Pro/Ent) — activations UNLIMITED | ✅ owner-set |
| 2026-07-22 | Photo Challenge +₱400/event (Pro/Ent), Papic-gated, free for guests | ✅ owner-set |
| 2026-07-22 | "Open it up" — name/inbox never gated | ✅ locked |
| 2026-07-22 | **INBOX free (manual reply); AI auto-answer is PAID** — NO separate free bot (supersedes "free couple-facing chatbot base") | ✅ owner-set |
| 2026-07-22 | No external/third-party chatbot sync — the "don't want our AI" case is covered by free inbox + free trial | ✅ owner-DECIDED (locked) |
| 2026-07-22 | 3D Plan add-on FREE on first-time subscription (first 28-day cycle, one-time/account) — also seeds couple-side 3D | ✅ owner-set |
| 2026-07-22 | Vendor AI FREE 1 cycle (28d) on activation + verification (standing trial) | ✅ owner-directed |
| — | Deep Search 1-free-in-trial · one-time-per-verified-account · base=zero-AI · Photo-Challenge build · 3D render economics | ⚠ OPEN (§5) |
