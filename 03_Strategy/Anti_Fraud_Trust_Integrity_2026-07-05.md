# Anti-Fraud & Trust Integrity — "No fakes. No pay-to-win. Ever."

> Owner principle (2026-07-05): "We study and hunt fake results continuously — and it only gets sharper as we grow. Any vendor caught faking to boost themselves loses all their data and is permanently banned. In return, we ask one thing: your best work, and honest communication with couples."
>
> This doc is the source-of-truth for **what counts toward a vendor's trust signals, how we detect fakes, and what happens to cheaters.** Every badge, ranking, and public stat inherits these rules — no exceptions, no future badge opts out.

---

## 1. Threat model — how a crooked vendor would cheat

The attack the owner named, made concrete:

1. **Fake event count** — a vendor self-imports (or self-creates) "delivered" events so `Most Booked` / `Experience tier` climb.
2. **Fake reviews** — a vendor spins up sockpuppet couple accounts, each creates an event, adds the vendor, marks it delivered, and writes a 5★ review → inflates `Couple Trusted`, `Top Pick`, and the public star average.
3. **Identity rings** — many sockpuppets on shared devices / addresses / payment sources, all pointing at one vendor.

The prize is always the same: unearned trust badges + top ranking = pay-to-win by faking.

---

## 2. Current state (audited 2026-07-05)

**The vulnerability is real today, but narrow — and the machinery to close it already exists.**

### What already defends us (shipped)
- **Reviews can't be conjured** — `vendor_reviews` INSERT RLS requires a `delivered`/`complete` `event_vendors` row linking that couple to that vendor.
- **Receipt provenance** — `vendor_reviews.booked_through_setnayan` (migration `20270321252758`) is stamped **server-side**, couples can never set it, a BEFORE trigger re-derives it on every write.
- **A clean, self-dealing-proof events view already exists** — `vendor_public_completed_events_stats` (migration `20260515020000`) counts only bookings linked via `linked_vendor_profile_id`, status delivered/complete, **excluding**: archived events, the vendor owner on the event, any team member on the event, internal accounts tied to the vendor, and self-comp grants.
- **Sockpuppet signals** — self-review hard-gate (`20260515030000`), `user_devices` device fingerprint, `users.address_normalized`.
- **Origin tracking** — `event_vendors.source` records how each row was created (`host_manual`, `auto_cascade_from_finalize`, `invite_claim`, …).

### The gap (the hole)
The **badge engine bypasses the clean data**:
- `Most Booked` / `Experience` → `fetchCompletedBookingCounts` counts **raw** `event_vendors` (delivered/complete by `marketplace_vendor_id`) with **no exclusions**.
- `Couple Trusted` / `Top Pick` / public star average → `vendor_review_stats` (materialized view) counts **every** `vendor_reviews` row with **no `booked_through_setnayan` filter and no arm's-length exclusion**.

So the badges compute on the un-vetted population while the vetted population sits unused. **Fixing this = routing badge inputs through vetted data.** Right now prod has **0 reviews**, so there is zero live exposure — we harden before any review exists.

---

## 3. The rules — what COUNTS toward a badge / ranking / public stat

A review or event counts toward *any* public trust signal only if **all** hold:

1. **Receipt-backed** — the review's booking is `booked_through_setnayan = TRUE` (links to the vendor's marketplace profile). No receipt → invisible to badges.
2. **Real via EITHER path (owner-decided 2026-07-05):** a countable event/review is proven real by **(a)** a reconciled Setnayan SKU payment **OR (b)** a couple-confirmed, arm's-length, identity-deduped booking marked delivered by a real couple account. Vendors are paid **off-platform** (0% commission, Setnayan holds no money), so most legitimate bookings use path (b) — a reconciled payment is a **bonus strength signal, not a requirement**. **Self-imported / manual events with neither a reconciled payment nor an arm's-length couple confirmation are CRM-only and never count.**
3. **Arm's-length** — the reviewing/booking couple must not share identity with the vendor: not the owner, not a team member, not an internal account, not a self-comp — and (Phase 2) not sharing device / normalized address / payment sender / IP with the vendor or its team.
4. **Distinct real couple** — dedup by identity cluster (device + address + payment + IP). N reviews from one cluster count as **one** (or zero if the cluster is flagged).
5. **One review per (couple, vendor, event)** — already enforced.

> **Inheritance lock:** these five rules are computed once, in the vetted stat layer. Every current and future badge reads that layer. A new badge cannot define its own looser counting rule.

### Immediate wiring changes
- New **`vendor_trusted_review_stats`** view: `vendor_reviews` filtered to `booked_through_setnayan = TRUE` + the same owner/team/internal/self-comp/archived exclusions as `vendor_public_completed_events_stats`, joined via the review's `event_id`. Exposes `trusted_avg_rating` + `trusted_review_count`.
- **Couple Trusted** reads `trusted_review_count ≥ 10 AND trusted_avg_rating ≥ 4.7` (not the raw `vendor_review_stats`). — *Phase 1, ships with the badge.*
- **Most Booked / Experience** route through `vendor_public_completed_events_stats` (which already excludes self-dealing) instead of raw `fetchCompletedBookingCounts`. — *Phase 1 follow-up.*
- **Top Pick + public star average** migrate to the trusted review stat. — *Phase 1 follow-up (touches public `/v/[slug]` rating display; do with care + QA).*

---

## 4. Detection — hunting fakes continuously

Signals, scored and surfaced to an admin **fraud queue** (not auto-punished — human confirms before the nuclear penalty):

- **Ring detection** — couple accounts sharing device_hash / IP / `address_normalized` / payment sender / email-pattern that *only* ever interact with one vendor → flag the cluster.
- **Velocity anomaly** — a burst of brand-new couple accounts → one vendor → all 5★ → then dormant.
- **Graph isolation** — genuine couples have an organic footprint (browse multiple vendors, real guest lists, RSVPs, other events). Sockpuppets don't. Isolation = signal.
- **Import spike** — a jump in self-imported / `host_manual` events with no reconciled payment behind them.
- **Provenance mismatch** — reviews where `booked_through_setnayan` is FALSE but the vendor is surfacing them as social proof.
- **Rating-shape anomaly** — an all-5★ distribution with no 4★ tail, inconsistent with real review curves.

The system "gets sharper as we grow" because ring/graph/velocity models improve with more legitimate baseline data.

---

## 5. Enforcement — the penalty

- **Admin fraud queue** (new admin surface, or a tab on the existing verification/moderation console) — clusters + scored signals, evidence trail, one-click investigate.
- **Two-stage enforcement (owner-decided 2026-07-05):**
  - **Auto-suspend (reversible, system-initiated):** at a **high-confidence** fraud score the system automatically SUSPENDS the vendor — profile hidden from the marketplace, badges frozen, no data destroyed. Reversible with one admin action if it's a false positive.
  - **Permanent wipe + ban (irreversible, ADMIN-confirmed only):** a human admin confirms before the vendor loses all data and is permanently banned (wire to `vendor_profiles.demotion_count` + a hard ban flag + tombstone; purge their reviews/stats; audit-log the action + evidence). Never automated. Appeal routes through the help-center ticket queue.
- **Couple sockpuppets** in the ring are disabled; their reviews/events are voided from every stat.
- **No pay-to-win corollary:** boosts/subscriptions never touch badge eligibility — badges are organic-only (already enforced in `vendor-badges.ts`). This doc extends that guarantee to the data layer.

---

## 6. Phased build plan

| Phase | Scope | Touches |
|---|---|---|
| **1 — Fake-proof the counting** | `vendor_trusted_review_stats` view; **Couple Trusted** gated on it (ships with the badge); route Most Booked/Experience through the clean events view; migrate Top Pick + public average to trusted stats | migration + `lib/vendor-badges.ts` + review-stat readers |
| **2 — Identity-cluster dedup** | device/address/payment/IP clustering; dedup reviews+events to distinct real couples; extend arm's-length exclusion with cluster overlap | new `identity_clusters` logic; extend exclusion subqueries |
| **3 — Detection engine** | scored signals (ring/velocity/graph/import/shape) → `fraud_signals` table; nightly + on-write scoring (cron-free `after()`) | new tables + scoring lib |
| **4 — Admin fraud queue + enforcement** | admin surface; investigate; confirmed-fake → wipe + permanent ban + audit trail; appeal hook | admin console + ban/tombstone action |

Phase 1 is the launch gate — no review-based badge goes fully live until its inputs are vetted. Phases 2–4 are the "continuous hunt" that hardens over time.

---

## 7. Owner decisions (resolved 2026-07-05)
- ✅ **Countable event = EITHER path:** reconciled Setnayan SKU payment OR couple-confirmed arm's-length deduped booking (§ 3 rule 2). Reconciled payment is a bonus signal, not required — vendors are paid off-platform, so requiring it would have zeroed out legit vendor counts.
- ✅ **Enforcement = auto-suspend + admin-confirmed wipe** (§ 5): high-confidence score auto-SUSPENDS (reversible, no data loss); the permanent data-wipe + ban is ADMIN-confirmed only, never automated. Appeal via help-center ticket.
