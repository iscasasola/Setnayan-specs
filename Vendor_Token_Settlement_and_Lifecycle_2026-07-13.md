# Vendor Token — Settlement & Lifecycle Model

> Dated 2026-07-13. **When a lead-token is *earned* (consumed) vs *returned* (refunded)** — the settlement half of the vendor lead economy. Companion to [`Vendor_Fake_Inquiry_Protection_Build_Plan_2026-07-11.md`](Vendor_Fake_Inquiry_Protection_Build_Plan_2026-07-11.md) (the *anti-fake* half: gate, cluster, fingerprint) and [`Vendor_Customer_Connection_Build_Plan_2026-07-10.md`](Vendor_Customer_Connection_Build_Plan_2026-07-10.md) / [`Vendor_Customer_Master_Build_Plan_2026-07-11.md`](Vendor_Customer_Master_Build_Plan_2026-07-11.md). Depends on [`Vendor_Proposal_Maker_2026-07-10.md`](Vendor_Proposal_Maker_2026-07-10.md) for the trackable quote.
>
> Grounded in the shipped lead flow (`unlock_vendor_event`, `threads.inquiry_status`, `chat_messages`) + the owner-locked **flat 1 token (₱100) on accept · hold-and-release · light-touch couple gate** (2026-07-11). Owner-decided in the 2026-07-13 design session. **Refines** the 2026-07-11 plan's *"ghost 7d → release"* into *"value consumed → settle; fake-ghost → release"* (§ 9). Corpus = specs only; code follows the repo PR workflow. Cross-refs: [[project_setnayan_vendor_monetization]], [[project_setnayan_fake_inquiry_protection]], [[project_setnayan_solo_admin_plan]], [[project_setnayan_cron_free]], [[project_setnayan_proposal_maker]].

## 0. The one principle everything derives from

**You pay for *access delivered*, not for a transaction.** A lead-token buys a vendor genuine access to a *real* couple. It is **earned the moment the vendor delivers value the couple consumes**, and **returned only when there was never a real couple to reach.** Everything below is that sentence made mechanical. (0% commission stands — the couple booking or comparing *off-platform* is the expected, fully-paid-for outcome.)

---

## 1. The token state machine (centerpiece)

```
        unlock_vendor_event (accept masked lead)
                    │  flat 1 token (₱100) → HELD, 7-day clock starts on vendor's first outreach
                    ▼
                 ┌──────┐
                 │ HELD │
                 └──┬───┘
     ┌──────────────┼───────────────────────────┐
     ▼              ▼                             ▼
 couple VIEWS   couple REPLIES              window expires with
 a delivered    (any genuine reply,        · vendor DID try (real quote/msg)
 QUOTATION      incl. "no thanks")         · couple consumed NOTHING (no view, no reply)
     │              │                       · fakeness CORROBORATED (see §3)
     └──────┬───────┘                             │
            ▼                                      ▼
       ┌─────────┐                            ┌────────┐
       │ SETTLED │  token earned              │  DEAD  │  → auto-refund token
       └─────────┘  (platform keeps it)       └───┬────┘     + pairwise block (§5)
                                                  ▼
                                          cluster of these → §5 escalation
```

Three terminal reads, and only three: **SETTLED** (earned), **DEAD** (refunded), or still **HELD** (clock running).

---

## 2. Settlement triggers — what counts as "value consumed"

A HELD token flips to **SETTLED** the instant *either* happens (whichever is first):

1. **The couple opens a delivered quotation.** A viewed quote is the value — the vendor priced the event, the couple took the number. Reply or not, booking or not, *in-app compare tool or manual off-app compare or not* — **opening it is utilization.** This closes the free-quote-extraction hole: a couple cannot take the price, comparison-shop, ghost, and cost the vendor a token.
2. **The couple sends any genuine reply** in the thread — *including a polite decline.* "Thanks, we went another way" is a real answer; the access was delivered and answered. (Couples have zero incentive to game settlement — only the vendor cares about the token — so any real reply settles.)

**The bar is *viewed / replied*, not merely *sent*.** A quote the couple never opens is not yet consumed. And **the vendor must have genuinely tried** — a vendor who unlocked (saw the full reveal) and then sat idle does **not** get a refund; they consumed the reveal, that's on them (guardrail against unlock-to-harvest-contact).

> **Dependency:** settlement-on-view requires the quote to be a **structured, view-trackable object** — the Proposal Maker. A view-receipt makes settlement objective, not a judgment call. It's also why vendors should quote *in-app*: quoting over email forfeits the receipt that protects them.

---

## 3. Cold vs Fake — the discriminator (why refunds are rare)

A HELD token that reaches the window with **no view and no reply** is *not automatically* a refund. Split it:

| | Who's on the other end | Ruling | Why |
|---|---|---|---|
| **COLD** | a *real* couple who just didn't open **this** vendor (opened others / verified / has history) | **SETTLE** | The vendor got genuine access to a *provably real* couple — exactly what the token buys. A cold lead is normal lead-gen risk, not a platform failure. |
| **FAKE / DEAD** | *no* real couple — bot, sock-puppet, spray-ghoster | **REFUND** | There was nothing real to reach. This is the only thing the refund exists for. |

**Cold ≠ Fake.** You tell them apart by **corroboration**, never by a single silent thread:
- **Real (→ cold → settle):** verified · engaging *some* vendor · has genuine event history (§4).
- **Fake (→ dead → refund):** unverified · engaging *no one* · trips the **≥3-vendor ghost cluster** (per the fake-inquiry plan Phase C).

> **⚠ OWNER DECISION (2026-07-13, revised after settle-on-view shipped): KEEP the shipped "refund ALL ghosts" sweep — do NOT narrow it to fakes-only.** Once settle-on-view ships (PR #3228), a couple who *engaged at all* (opened the quote) already settles, so the free-quote-extraction hole is closed **without** touching the sweep. A remaining pure-ghost (never opened + never replied in 7 days) shows zero engagement, so refunding the vendor is defensible and keeps the model maximally vendor-friendly — the deliberate shipped invariant. **The earlier draft below (cold-verified-non-viewer → SETTLE) is SUPERSEDED for the SWEEP** and kept only as lineage. Consequence: the cold-vs-fake *distinction no longer gates the sweep*, and the prior-events signal (§4) is **demoted from a money-gate to a front-end vendor badge only.** Settle-on-view + refund-all-ghosts is the whole lifecycle; nothing further is needed for the token to be "complete."
>
> *(Superseded lineage — the 2026-07-13 first-pass ruling:) a lone unopened quote from a real/verified couple SETTLES; refunds reserved for corroborated fakes.*

---

## 4. Trust tiers — realness is earned once; good standing is ongoing

**Realness and behavior are different axes.** A signal that proves *real* kills the fake-refund path; it does **not** excuse bad behavior.

| Signal | Establishes | Effect |
|---|---|---|
| **Genuine prior event(s)** — a past event that actually *ran* (engaged vendors / guests / a date that passed / a settled connection or payment) | **REAL** (strongest signal — better than email/KYC-lite; a completed event *is* organic verification) | Fake-refund path can't fire (removes the "unverified/not-real" leg). Their cold non-opens **settle**. |
| Email-verified · complete event | plausibly real | neutral-positive |
| **New account, no history** | *unproven* — **NOT fake** | neutral (admit-unknown, like compat-score's 0.6 default). Fakeness needs *positive* corroboration, never just "new." |

Guardrails on the prior-events signal:
- **"Ran," not "clicked create."** Event *count > 0* is not the signal — real activity is. **Empty events created-and-abandoned are not trust**, and mass-create-then-delete is itself a mild *red* flag (account-seasoning / farming shape).
- A proven-real account can **still spray-and-ghost** — that stays governed by the *behavioral* layer (responsiveness score · concurrent-inquiry cap · cluster), untouched by realness.

**Vendor protection is FRONT-loaded, not back-loaded.** Rather than refund a real lead that didn't convert, ensure a vendor never *unknowingly* pays for a weak one: show — *before* the token is spent — **responsiveness** ("opens 4 of 5 quotes · replied this week"), the **verified** badge, and **event-realness / events-hosted**. A well-informed unlock beats a refund: the vendor picks good leads, so a cold one is *their* read, and fakes are filtered before a token is ever spent.

---

## 5. Refund → pairwise block → cluster escalation

A refund and a block share one trigger — *"this wasn't genuine"* — so they travel together, else a vendor could re-unlock the same dead couple and be refunded forever.

- **Pairwise, not global.** A refund severs *that vendor ↔ that couple* pair: the vendor can't re-spend a token to re-unlock them; that couple can't re-hit that vendor. **One refund never bans the couple platform-wide** — a single dead thread isn't proof they're fake everywhere.
- **Fake-bucket only.** Cold/settled leads are *never* blocked (real couple — vendor may retry, couple may return).
- **Reversible on genuine re-engagement.** "Dead" is a *presumption*. If the couple later actually reaches out / replies (real intent rebuts it), the pair reopens. The block stops the vendor *re-paying blind*, not the couple from ever returning (protects the real-but-slow couple wrongly swept in).
- **Escalation is global.** Refunds/blocks piling up against the same couple across vendors → the **≥3-vendor ghost cluster** → platform-wide throttle + admin queue. *Local block → global gate.*

---

## 6. Event deletion / cancellation reconciliation

Deletion can't be hard-blocked "if an inquiry exists" — **RA 10173 gives the couple the right to erase their own event**, and real events genuinely die. So allow it, and reconcile tokens by state.

1. **Offer *postpone* first.** Most "deletes" are date-slips. **"Change the date"** keeps the event, the vendor connections, and every token intact. Only a true *cancel* triggers reconciliation. This alone prevents most needless churn.
2. **On a real cancel:**
   - **HELD tokens → refund** (same rule as a ghost — the vendor never got consumed value).
   - **SETTLED tokens → keep** (value was delivered — a viewed quote / a reply). **Notify** those vendors the event was cancelled so they stop chasing a booking; **retain a minimal vendor-side record** (10-yr disputes/tax floor, per [[project_setnayan_data_retention]]).
   - Show the couple the impact at the tap: *"3 vendors are connected. Vendors who haven't been engaged are refunded; the rest are notified."*
3. **Cancel ≠ hard-erase.** *Cancel* ends the event, keeps vendor records, runs the token math. *Hard-delete (RA 10173 erasure)* purges the couple's PII **but the same held-vs-settled logic still fires** and the minimal vendor record survives.
4. **Out of scope:** the couple's **own SKU purchases** (Papic, monogram, …) are a *different pot* — they follow the normal payment/refund policy, untouched by event deletion.

---

## 7. Couple-side anti-spray (why "inquire to many, never reply" doesn't pay)

Settlement rules protect the vendor's *wallet*; they don't, alone, protect vendor *attention* or platform revenue from spray. That friction sits on the couple's ability to *create* dead inquiries — all **non-monetary** (free-to-plan + 0% commission stand). Most is already locked in the fake-inquiry plan:
- **Cap concurrent *unanswered* inquiries** (default ~15/event) — browse freely, but can't *hoard dead threads*; reply to or close some to open more.
- **Responsiveness score** the vendor sees *before* unlocking (§4) — a ghoster's later inquiries rarely cost a vendor a token; reputation is the couple-side cost when money can't be.
- **≥3-vendor ghost cluster** (fake-inquiry Phase C) — the spray-and-ghost *pattern* detector → throttle.
- **Shortlist-first (Merkado)** — the default path is *curate a few to compare*, not *blast the category*; spray becomes the deliberate, friction-ful path, not the easy one.

Net: a couple **cannot** freely inquire-to-many-and-never-reply — not because the token settles differently, but because the cap stops the hoarding, the cluster catches the pattern, and their responsiveness score makes vendors stop unlocking them. Legit comparison of a handful of vendors is untouched.

---

## 8. Automatic vs the Exception Desk (solo-operator)

The platform runs one-person on **"approve exceptions, never transactions"** ([[project_setnayan_solo_admin_plan]]). Every step here is a *transaction*, so every step is **automatic**:

**Automatic (no human):** settle (quote view-receipt / reply event) · the 7-day hold + refund sweep (pure date math, **cron-free** on the `claim_periodic_job` traffic-fired primitive, per [[project_setnayan_cron_free]] — no scheduler) · cold-vs-fake classification (machine-readable signals vs **admin-tunable thresholds**) · pairwise block · cluster escalation · anti-spray caps · deletion reconciliation · the vendor front-end signals.

Safe to fully automate because it's **deterministic (Rule 1)** — every settle/refund/block carries a concrete stated reason (*"quote viewed 14:02," "no engagement + unverified + 3rd-vendor cluster"*) → defensible, and appeals stay rare — and because **tokens are internal access-credits, not money** (0% commission, off-platform settlement): a refund just credits a token back, no fund movement to gate.

**Touches the operator (the edge, not the flow):**
- **Appeals / disputes** — a vendor contests a refund, a couple contests a throttle → the single Exception Desk. Rare by design.
- **The one consequential action** — a *hard, platform-wide* ban at the cluster stage. The system auto-*throttles*; a full ban gets a one-tap human confirm (still reversible/appealable).
- **Threshold tuning** — the windows (7 days), cluster count (3), caps (~15) are config, set once and rarely touched.

---

## 9. What this REVISES from the 2026-07-11 fake-inquiry plan

The 2026-07-11 lifecycle read: `HOLD → [couple replies → CONSUME] OR [ghost 7d → RELEASE, refund]`. This spec sharpens it on two points the owner decided this session:
1. **Settlement is *value consumed*, not *reply* — a viewed quotation settles too** (§2). Prevents free-quote-extraction.
2. **Release/refund is *fake-only*, not *any ghost*** (§3–§4). A real-but-cold couple **settles**; only a *corroborated fake* releases. Prior real events / verification is what tells them apart. Everything else in the 2026-07-11 plan (the gate, cluster, fingerprint, presumption-of-a-real-couple invariant) stands unchanged and is the foundation this sits on.

---

## 10. Build order & open items

> **BUILD STATUS (2026-07-13).** Exploration found **the entire hold→settle-on-reply→7-day-ghost-sweep→report+cluster-refund spine is ALREADY SHIPPED, flag-off** behind `NEXT_PUBLIC_LEAD_TOKEN_HOLD_ENABLED` (fake-inquiry Phase B/C). So only the **delta** remained:
> - **✅ SHIPPED — settle-on-view (§2.1)** — PR #3228 (`mark_proposal_viewed` + `markProposalViewedAndSettle` + proposal-page wire; rides the hold flag, off in prod).
> - **✅ DECIDED — cold-vs-fake sweep = KEEP refund-all-ghosts** (owner, above). No build; the sweep is unchanged.
> - **Prior-events trust signal** → demoted to a front-end **vendor badge** only (no longer gates money). Additive, optional.
> - **Pairwise block on refund (§5)** → additive; the report/cluster path releases holds + drops unlock rows but does not block re-unlock. Nice-to-have (with holds, a re-unlocked ghost just re-refunds — churn, not loss).
> - **Event-deletion reconciliation (§6)** → the one substantial remaining piece — but there is **NO couple-facing cancel/delete flow today** (only admin hard-delete, raw cascade, no token reconciliation). This is a new surface needing its own design pass (postpone-first UI + the held-refund/settled-keep math).
>
> **Net: with settle-on-view shipped + refund-all-ghosts kept, the token lifecycle is functionally complete (flag-off).** The rest is refinement.

**Build order** (extends the fake-inquiry phases):
1. **Hold + auto-release sweep** (cron-free) — the state machine spine (§1). *(Fake-inquiry Phase B.)*
2. **Settle-on-reply** — the cheap, already-trackable trigger (§2.2).
3. **Settle-on-quote-view** — gated on the **Proposal Maker** shipping a view-trackable quote (§2.1 dependency).
4. **Trust tiers + front-end vendor signals** (§4) — responsiveness / verified / events-hosted on the unlock card.
5. **Refund → pairwise block + cluster escalation** (§5) — with the fake-inquiry Phase C cluster.
6. **Deletion / cancel reconciliation + postpone-first** (§6).
7. **Exception Desk surface** (§8) — appeals + hard-ban confirm in 0023 admin.

**Open sign-offs (carry the fake-inquiry plan's counsel gates):**
- Counsel: the fake-detection/blocking/cluster mechanics (shared with the 2026-07-11 plan's pending sign-offs — NOT yet cleared).
- Product: confirm the **cold-lead-settles** ruling (§3) as the standing default (owner leaned settle this session — treat as decided unless reversed).
- Dependency: **Proposal Maker** must ship the structured, view-trackable quote before §2.1 (settle-on-view) can be enforced.
- Retention: a "wipe/erase" or cancel must *actually* delete the rows it claims (the live `chat_messages` account-deletion PII gap, [[project_setnayan_data_retention]]) — a settlement/cancel record must not lie.
