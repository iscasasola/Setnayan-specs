# Vendor Value Proposition + Reviews, Outside-Event Sync & Anti-Fraud — Canonical Lock

> **Status:** owner-locked 2026-06-05 (this design session).
> **What this is.** The canonical vendor-acquisition pitch for `/for-vendors` **and** the spec for the net-new vendor mechanics the owner locked alongside it: event-bound reviews, the in-app-vs-outside review asymmetry, guest-level reviews, the 1-token outside-event sync, the free compile-all-events vendor website, the unified anti-double-book calendar, and the zero-tolerance review-fraud policy.
> **Relationship to existing locks.** The *economics* here (0% commission · pay-per-result · 1–3 token unlock · 100 free founder tokens · 6-dim AI matching · weddings → all events) **restate decisions already locked** — see the token-economy memory + DECISION_LOG 2026-06-05 burn-reprice row. The *mechanics* in Part C are **net-new** this session.
> **Affected surfaces:** 0015 (marketing `/for-vendors`) · 0022 (vendor dashboard — reviews, portfolio website, calendar, sync) · 0023 (admin console — review-fraud enforcement) · 0034 (token spend) · Pricing.md § 0.C (token sink). Iteration `.md`/`.docx` threading pending where flagged.

---

## Part A — The vendor value proposition (canonical `/for-vendors` copy)

**One-line thesis (hero):**
> *"We can't promise you a million weddings. We promise that every inquiry counts."*

**1. The honest promise.** We won't pretend to flood you with a million events a year. What we guarantee is better: every inquiry that reaches you is a couple who already fits what you do.

**2. Pay for results — never for your sales.** Other platforms take a percentage of everything you book. Setnayan takes **0%**. What you earn stays yours. And if we don't send you inquiries, you pay nothing — no retainer, no monthly minimum, no fee just to show up.

**3. Stop bleeding ad spend while you wait.** You shouldn't have to spend thousands a day to catch one or two couples a week. With Setnayan there's no money lost waiting — the cost only begins when a real, matched couple is already in front of you.

**4. What an inquiry costs — and everything it unlocks.** One matched inquiry costs **1–3 tokens. A token is ₱100.** Other platforms charge you for *every service you list*. Setnayan charges **once — to unlock the couple** — and that single **₱100–₱300** unlock lets you offer them as many services as you can for that event: every message, every package, every rebooking. You decide which leads are worth answering.

**5. The AI does the handpicking.** When couples onboard, Setnayan asks exactly what they want — budget, style, region, date, guest count, venue. Our AI filters those needs against your profile and matches on **six dimensions of fit**. The couples who reach you are pre-qualified — warm leads we handpicked for your service, not cold ones you chase.

**6. Why we're ahead of the market.** No other wedding platform in the Philippines does all three at once: match couples on six dimensions of fit, charge you **per-result instead of per-click or per-sale**, and take **zero commission** on what you close. Setnayan is built more like a matchmaker than a directory.

**7. Your reputation, compounding.** Real weddings. Real reviews. The longer you're with Setnayan, the more weddings you collect — and every wedding builds your reviews, your stats, your standing. A couple who came through your inquiries can earn you reviews from across the whole celebration — **up to 250 guests or more**, not just one. The flywheel only spins one way: more events → more reviews → a stronger business.

**8. A free website that builds itself.** Stop paying to build and maintain your own site. Setnayan gives you a **free profile that compiles every event you've done** into one living showcase — inside the most advanced wedding platform in the world. Your portfolio, your reviews, your calendar, always up to date, all in one place.

**9. Never double-book again.** No more typing schedules by hand. Every event you register — **whether it's your own client or one of ours** — lands in a single shared calendar across your whole team and every service you list. Setnayan blocks the double-booking before it can happen.

**10. Bring your outside events in for 1 token.** Already booked elsewhere? **Sync any outside event into Setnayan for just 1 token (₱100).** It joins your stats, your portfolio, and earns you **one verified review** — so the work you do off-platform still strengthens your profile on it.

**11. We protect your name.** Reviews on Setnayan are tied to **real, proven events** — no one can buy or fake their reputation. And there's no three-strike leniency: **if a vendor is proven to have staged a fake event, they lose their account and start from scratch.** Your reputation is earned here, and we keep it that way.

**12. This is only the beginning — every event, not just weddings.** Today Setnayan is weddings. In time it holds **every event a Filipino marks** — birthdays, debuts, christenings, reunions, corporate gatherings, and beyond. Your market doesn't stay the size of the wedding industry; it grows into every celebration in the country. And the couples you win today become the clients who remember you for the next one.

---

## Part B — Reaffirmed vs. net-new

| Pillar | Status | Source of truth |
|---|---|---|
| 0% commission on what you book | **Reaffirmed** | Interaction-map audit (0%-commission fee) · Pricing § 0.D |
| Pay-per-result · no inquiries → nothing to pay | **Reaffirmed** | Token economy (burn at answer, not subscription) |
| 1–3 token unlock = ₱100–₱300, idempotent per (vendor, event), covers ALL the vendor's services | **Reaffirmed** | DECISION_LOG 2026-06-05 burn-reprice · booking ruleset |
| 100 free founder tokens on verification | **Reaffirmed** | Pricing § 0.C |
| 6-dimension AI matching = pre-qualified leads | **Reaffirmed** | Leaf-match contract (6 dims shipped 2026-06-04) |
| Weddings → all Filipino life events | **Reaffirmed** | Product premise (CLAUDE.md) |
| **Event-bound reviews + in-app(250+)/outside(1) asymmetry** | **NET-NEW** | This doc, Part C1 |
| **Guest-level reviews** | **NET-NEW** | This doc, Part C1 |
| **1-token outside-event sync** | **NET-NEW** | This doc, Part C2 · Pricing § 0.C |
| **Reputation flywheel as a retention promise** | **NET-NEW (framing)** | This doc, Part C3 |
| **Free "compile-all-events" vendor website** | **NET-NEW (extends free vendor site)** | This doc, Part C4 · 0022 |
| **Unified anti-double-book calendar incl. the vendor's OWN external events** | **NET-NEW (extends booking ruleset)** | This doc, Part C5 · 0022 |
| **Zero-tolerance review-fraud policy (no 3-strike)** | **NET-NEW** | This doc, Part C6 · 0023 |

---

## Part C — Net-new mechanics (specced)

### C1. Reviews are event-bound — and in-app events out-earn outside events

**Provenance rule (the anti-fraud foundation).** Every review is bound to a real, proven event. No review can exist without an event behind it. There are exactly two ways a vendor accrues reviews:

| Event origin | Who can review | Cap | Why the asymmetry |
|---|---|---|---|
| **In-app event** — couple came through the vendor's Setnayan inquiries | The couple **and every verified guest** who attended | **Up to 250 (or more) per event** — one review per verified guest, keyed to the 250-pax ceiling (`Custom QR per Guest`); larger weddings can exceed 250 | The guest list is real and verifiable, so many real people can vouch |
| **Outside event** — vendor self-syncs a job booked off-platform (Part C2) | The vendor's attestation only | **Exactly 1 per synced event** | No verifiable Setnayan guest list exists, so it's capped to prevent self-inflation |

**Locked interpretation of "up to 250."** The owner's "up to 250 or more reviews from in-app customers" is locked as **guest-level reviews: one review per verified guest at an in-app event** (not 250 reviews aggregated across many customers). This is adjustable if the owner meant the aggregate reading — flag to re-open.

**Guest-level reviews (net-new scope).** Guests at an in-app event can each leave a review of the vendors who served that event (the caterer they ate, the host they watched, etc.). Implementation notes (not new owner decisions — these follow existing locks):
- A guest reviews only vendors actually on that event (`event_vendors`), and only events they're a verified guest of (RSVP / QR identity from 0001 / 0008 / 0031).
- One review per (guest, vendor, event). No duplicates.
- Likely capture surfaces: the day-of / post-event guest experience (0031) and the personal landing page (0002).
- All reviews flow through the existing **admin Reviews moderation queue** (0023 surface #4) + the always-on NSFW filter.

### C2. Outside-event sync — 1 token

A vendor can **sync an event they booked off-platform** into Setnayan for **1 token (₱100)**. Syncing:
- Adds the event to the vendor's **stats** (event count, tenure signal) and **portfolio website** (Part C4).
- Earns the vendor **exactly 1 verified review** (Part C1).
- Is a **new vendor token sink** — additive to the existing two token uses (redeem against `[Token]` couple SKUs · feature boosts). Recorded in Pricing § 0.C.

This makes off-platform work still count toward on-platform reputation — a deliberate on-ramp that rewards bringing real history into Setnayan, while the 1-review cap keeps it honest.

### C3. Reputation flywheel (retention framing)

The core vendor-retention promise: **tenure compounds.** Longer on Setnayan → more weddings collected → more reviews earned → a stronger, higher-ranking profile → more inquiries. This is the answer to "why stay": the platform's value to a vendor grows with time served, not just spend.

### C4. Free "compile-all-events" vendor website

The vendor's in-app profile **is** their web presence — a free, living showcase that **auto-compiles every event** they've done (both in-app events and synced outside events) with portfolio, reviews, and calendar in one place, always current. Vendors no longer need to build or maintain a separate website. Extends the "free vendor site" already in Pricing § 0.C from a static profile to an event-portfolio site.

> **Reconciliation point (must honor):** the **vendor hybrid-anonymity** lock (Free + Verified vendor name hidden in browse/microsite/cards until first chat reply; Pro+ always visible) still governs identity reveal. The compile-all-events site must either (a) anonymize vendor identity until the reveal trigger for Free/Verified tiers, or (b) the fully-public, named portfolio is a Pro+ benefit. Owner to confirm which — do not ship a public named portfolio that contradicts hybrid-anonymity.

### C5. Unified anti-double-book calendar (incl. the vendor's own external events)

One shared calendar prevents double-booking before it happens:
- **Org-level shared schedule** across the vendor's whole team and every service/listing (already locked in the booking ruleset — the multi-listing double-book fix).
- **Net-new:** the vendor can **register their own off-platform events** into that same calendar (manually, or via the C2 sync), so a date booked outside Setnayan still blocks an in-app booking. "Any event — your own customer or ours — is compiled here."
- **No manual schedule typing** as the headline benefit: registering/syncing an event populates the calendar automatically.
- Capacity stays **1 booked event per day** per the booking ruleset (inquiries are unlimited; only booked events consume capacity).

### C6. Zero-tolerance review-fraud / fake-event policy

Reviews are protected by a **one-strike** policy, **distinct from and stricter than** the tiered Concierge trial-abuse enforcement (0016 / 0023 surface #7, which is warning → trial ban → full ban):
- **No three-strike leniency.** If a vendor is **proven** to have staged a **fake event** (to farm reviews/stats), they **lose their account and must start from scratch** — full termination, reputation reset to zero.
- "Proven" is an **admin-adjudicated** determination via the 0023 Reviews / Users surfaces (evidence-based; not automated termination).
- This coexists with the 0016 trial-abuse tiering — two policies for two different abuse vectors (review fraud = zero-tolerance; trial cycling = progressive). Confirmed intentional by the owner.

---

## Part D — Data-model sketch (forward — code not yet built)

Marked **proposed**; reconcile with the live schema at build time. None of this ships until owner sign-off to build the review/sync system.

```
-- Reviews, event-bound
vendor_reviews(
  review_id, vendor_id, event_id,
  origin enum('in_app','synced_outside'),
  reviewer_type enum('couple','guest','vendor_attest'),
  reviewer_guest_id NULL,            -- set when reviewer_type='guest'
  rating, body, verified_at,
  moderation_status enum('pending','published','hidden'),
  created_at
  -- UNIQUE (event_id, vendor_id, reviewer_guest_id)  per-guest single review
  -- in_app event: up to 250+ guest rows; synced_outside event: exactly 1 attest row
)

-- Outside events a vendor syncs in for 1 token
vendor_synced_events(
  synced_event_id, vendor_id, event_name, event_date, location_text,
  token_charge INT DEFAULT 1, review_id NULL,  -- the single earned review
  calendar_block_id NULL,                       -- blocks the date (Part C5)
  created_at
)

-- Calendar: org-level shared schedule already exists (vendor_calendar_blocks).
--   Extend so a synced/own external event creates a block (date capacity = 1 booked/day).

-- Fraud: zero-tolerance → an admin termination action, NOT a strike counter.
review_fraud_cases(
  case_id, vendor_id, synced_event_id NULL, evidence_ref,
  status enum('open','dismissed','proven'),
  action enum('none','account_terminated'),
  adjudicated_by_admin_id, adjudicated_at
)
```

Token spend rides the existing 0034 flow + vendor token balance; the sync charge is one token decremented at sync time (idempotent per synced_event_id).

---

## Part E — Open items / reconciliation

1. **"Up to 250" reading** — locked as one-review-per-guest (Part C1). Re-open only if the owner meant 250-aggregate-across-customers.
2. **Hybrid-anonymity vs. public portfolio** (Part C4) — owner to confirm: anonymize-until-reveal for Free/Verified, or public named portfolio is Pro+ only.
3. **Guest-review capture surface** — confirm 0031 (day-of/post-event) + 0002 (landing page) as the entry points; spec the exact prompt at build time.
4. **Token-sink in the economy** — Pricing § 0.C updated; ensure 0034 + the vendor wallet model account for a non-redemption token burn (sync) alongside SKU redemption + boosts.
5. **Abuse-policy coexistence** — review-fraud (zero-tolerance) and Concierge trial-abuse (tiered) confirmed as separate policies; ensure 0023 surfaces both without conflating them.

---

## Part F — Where this lands

- **0015 `/for-vendors`** — Part A is the canonical vendor value-prop copy (supersedes the older seven vendor beats where they disagree).
- **0022 vendor dashboard** — Parts C1/C3/C4/C5 (reviews, flywheel, portfolio website, unified calendar + own-event registration + sync).
- **0023 admin console** — Part C6 (review-fraud enforcement on the Reviews + Users surfaces).
- **0034 payments/cart + vendor wallet** — Part C2 token sink.
- **Pricing.md § 0.C** — the 1-token outside-event sync use.
