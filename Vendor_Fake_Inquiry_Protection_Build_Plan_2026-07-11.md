# Fake-Inquiry Protection — Build Plan

> Dated 2026-07-11. How Setnayan protects a vendor when they receive fake / spam / weaponized inquiries. Grounded in the shipped `apps/web` lead flow (`unlock_vendor_event`, `threads.inquiry_status`, `chat_messages`) and the 2026-07-11 lead-price lock. Code repo: `~/apps` (PR workflow, auto-merge). Corpus = specs only.
>
> **This is the concrete answer to the watch-signal the owner already named** in the 2026-07-11 lead-pricing DECISION_LOG row: *"③ inquiry-spam / lead-farming → tighten the accept gate."*

## Why this is load-bearing

The whole vendor model is *"pay-per-lead = fair infra cost recovery"* (see [[project_setnayan_vendor_monetization]]). It's wired as **1 token (₱100) charged when a vendor accepts a masked lead** (`unlock_vendor_event`, flat 1 token all regions — owner-locked 2026-07-11). So a fake inquiry is not just noise:

- **It directly costs the vendor ₱100** the moment they accept it to see who it is.
- **The fairness promise collapses** — the instant a vendor feels *"Setnayan sends me garbage and charges me for it,"* the pay-per-lead argument dies and they churn.
- **It's weaponizable.** A rival vendor can spin up fake couple accounts to (a) drain a target's wallet / 100 free verify tokens (= ₱10,000 of runway) and (b) bury the target's *real* leads under junk. The "multiple fakes" burst is the signature of exactly this.

**Design goal:** a vendor must never lose a token — or miss a real lead — because of a fake one. Owner decisions (2026-07-11): **token model = hold-and-release + report/cluster backstop (BOTH)**; **couple gating = light-touch** (couples are the demand engine — do not friction the funnel).

## Threat actors (each needs a different lever)

| Actor | Motive | Signature | Primary lever |
|---|---|---|---|
| Bots / mass accounts | scrape vendor info, spam | high fan-out, empty events, burst velocity | Phase A rate-limit + Phase E fingerprint |
| **Competitor sock-puppets** | drain a rival's tokens, bury real leads | many "couples" → *one* vendor, shared device/IP | Phase C cluster + Phase E fingerprint |
| Tire-kickers | not serious, browsing | real account, no follow-through | Phase B hold auto-releases (free by design) |
| Harassment / dup sends | varied | repeat inquiries same vendor/event | Phase A one-per-vendor-per-event unique |

---

## Design invariant — presumption of a real couple (governs every phase)

A false positive on a *couple* is far worse than a false negative on a fake: couples are the demand engine, a wrongly-suspected couple is lost demand + bad word of mouth, and a real couple should never have to *prove* they're real. The hold model makes holding this bias free — a slipped-through fake auto-refunds (~zero cost), so we never need to be harsh at the couple's door. Every phase obeys:

- **No single-account signal ever flags a couple.** New account, incomplete event, no history, first-time, "just wants an event" — **none of these is suspicious.** That's simply a new couple. Only *coordinated cross-account patterns* (fingerprint-linked farm, concentration on one vendor, ≥K cluster reports) trigger anything — and those describe fake *farms*, which a real couple never resembles. One account behaving normally is invisible to every detector by design.
- **Ambiguity resolves in the couple's favor.** When unsure, let the inquiry reach the vendor (couple happy) and let the hold protect the token (vendor happy). The platform absorbs the tiny residual risk — which is ~free.
- **Couples never see suspicion.** No accusation, no "prove you're human" CAPTCHA, no hard block, no fraud-flag message. The harshest thing a real couple can encounter is a *friendly rate limit framed as help* ("focus on the vendors you're already talking to").
- **Silent quarantine is reserved for high-confidence farms only** — never a thin/new profile. Withholding a real couple's inquiry so it waits for a reply that never comes is the single worst outcome; a weak signal must never cause it.

## The lifecycle change (centerpiece)

Today: `Inquiry (masked) → Accept = burn 1 token → full reveal → chat`.

New: `Inquiry (masked, gated) → Accept = HOLD 1 token → full reveal + chat → [couple replies → CONSUME] OR [ghost 7d → RELEASE, refund] → report/cluster backstop`.

The token now pays for a *real relationship's* infra — which only materializes when the couple actually engages. A lead that never replies consumes ~no infra, so it costs ~nothing. **This respects the owner lock** ("charge at two-way intent") — it just sharpens *intent* from "vendor clicks accept" to "couple actually replies."

---

## Phase A — Light-touch couple gate 🟦 (ship first — independent, cheapest)

Rebalance the asymmetry: today *sending* an inquiry is free and frictionless while *accepting* costs money — fraud loves that gap. Add friction to the sender, keep the funnel light.

**Preconditions to send an inquiry** (all cheap, none block a real couple):
- **Email-verified** account (already required for most flows — enforce at inquiry send).
- **Real event behind it** — `event_date` + `pax` + `region` present (mostly there via `thread.pax_at_inquiry`; make it a hard precondition).
- **One inquiry per vendor per event** — DB unique `(event_id, vendor_profile_id)` on the thread; kills same-vendor dup bursts.
- **Rate limits** (config-driven so admin can tune): max **N concurrent open** inquiries per event (default 15 — real couples shortlist a handful per category), max **M sends/day** per couple account (default 20).

**Schema.** `inquiry_gate_config(key, int_value)` seed row set (admin-editable in 0023). Unique index on the thread table `(event_id, vendor_profile_id)`.

**Server.** Guard in the inquiry-create action: check email-verified + event completeness + rate-limit counts before insert; friendly error ("You've reached today's inquiry limit — you can continue tomorrow, or lock the vendors you're already talking to").

**Verify.** New unverified account can't inquire; a real couple with 5 open threads can still send; the 16th concurrent send is throttled; a second inquiry to the same vendor/event is rejected.

**Spec impact.** DECISION_LOG: "inquiry send is gated (email-verified + real event + rate limits) — light-touch, funnel-preserving."

> ⚙ **Build note (2026-07-12, from grounding in `apps/web`):** two plan assumptions corrected. (1) **One-inquiry-per-vendor-per-event is ALREADY enforced** (DB `UNIQUE(event_id, vendor_profile_id)` on `chat_threads` + upsert `onConflict`), and the **anonymous-account guard already exists** (`startServiceInquiry` returns `not_secured` for `user.is_anonymous`). (2) **Email-verification is a no-op today** — signup auto-confirms via the admin API, so `email_confirmed_at` is always set and is NOT a usable trust signal; the gate keys on `is_anonymous` (already there) + velocity instead. So Phase A's real gap was **velocity limits only** → shipped with **zero schema change** (two count queries on `chat_threads`). ✅ **SHIPPED — [PR #3132](https://github.com/iscasasola/setnayan-platform/pull/3132)** (flag `NEXT_PUBLIC_INQUIRY_GATE_ENABLED`, default OFF; caps 25/day · 40 concurrent/event; gates only new **manual** inquiries — system fan-outs exempt via `source:'system'`; onboarding fan-out untouched).

---

## Phase B — Token hold-and-release 🟦 (the centerpiece; changes `unlock_vendor_event`)

**Schema.** `lead_token_holds(hold_id, thread_id, vendor_profile_id, couple_user_id, token_amount default 1, status ∈ held|consumed|released, held_at, consumed_at, released_at, consume_reason, release_reason)`. RLS: the hold's vendor (via `current_vendor_ids`) + admin. The wallet balance separates **available** from **held**.

**Rewrite `unlock_vendor_event`.** Instead of a hard burn: (1) decrement wallet *available* by 1 and write a `held` row (funds show as "1 held", not "spent"); (2) set `inquiry_status='accepted'`; (3) full reveal (respects the owner disclosure lock — see flag ①). If the couple later engages, the hold converts to a real burn; if not, it reverses.

**Consume triggers (hold → consumed, token truly spent):**
- **Couple replies** — first `chat_messages` row with `sender_role='customer'` after accept moves the hold to **`provisional`** (genuine two-way signal, but *still refundable* — see next).
- **Value realized (hard consume)** — proposal accepted, couple locks + real downpayment (payment-gated lock, PR #3090), or vendor saves/exports contact. Only a value action converts `provisional → consumed` for good.
- **Anti "reply-once" rule** — a bare reply alone never hard-burns the token; it stays `provisional` and refundable via Report / cluster until a value action or a cooling window closes. This kills the competitor trick of having a fake couple send one throwaway message to force a charge (a saboteur won't send real downpayment money → never reaches a value action → token stays clawable).
- Idempotent — first trigger of each class wins; no double burn.

**Release triggers (hold → released, token refunded to available):**
- **Ghost** — no couple reply within **7 days** (default, config) and no value-realized event → auto-release via a daily scheduled sweep (Supabase/Vercel cron; ₱0). Notify the vendor: "No response from this lead — your token's been returned."
- **Report upheld** (Phase C) or **cluster suspension** (Phase C).

**UI.** Vendor wallet shows "Available N · Held M"; each held row links to its thread with its state ("held — waiting on reply", "returned — no response", "spent — active client"). Accept button copy stays **"Accept for 1 token"** but with a one-line reassurance: *"Returned if they don't reply."*

**Verify.** Accept a lead → wallet shows 1 held. Couple replies → held→consumed (available stays down 1). Fresh accept with no reply → after the sweep, held→released, available restored, vendor notified.

**Spec impact.** `unlock_vendor_event` moves from burn-at-accept to hold-at-accept + consume-on-reply. Still 1 token, still charged at two-way intent — sharpened. Supersedes the burn semantics in `Vendor_Customer_Master_Build_Plan_2026-07-11` Phase 0/1.

---

## Phase C — Report backstop + cross-vendor cluster 🟦 (needs B)

Handles the case the hold can't: a lead that **replies once then is clearly fake/troll** (auto-consume would wrongly charge), and coordinated attacks across many vendors.

**Schema.** `lead_fake_reports(report_id, thread_id, reporter_vendor_profile_id, couple_user_id, reason ∈ never_real|spam|abusive|contact_fishing|other, status ∈ auto_refunded|pending_admin|upheld|dismissed, created_at)`.

**"Report fake" button** in the vendor thread (accepted state):
- **Auto-refund path** — if the thread has **zero couple replies**, uphold immediately: release the hold / refund the token, close the thread. (The objective no-reply signal, not the vendor's word — this is also the guard against the report button being abused to claw back tokens on real engaged leads; see flag ③.)
- **Admin path** — if the couple *did* reply, route to the 0023 queue for a human (protects couples from vendors crying "fake" to dodge a legitimate charge).

**Cross-vendor cluster RPC** (the "multiple fakes / weaponized" answer): when a `couple_user_id` is reported by **≥ K distinct vendors** (default **K=3**, config) → flag the couple, push to the admin queue, **auto-release every outstanding hold on that couple's threads AND refund any already-consumed tokens within a lookback window** — protection across the *whole blast radius*, not just the vendor who happened to report. This is what makes a competitor's spray attack a net loss for the attacker and a net zero for every victim vendor.

**Report-abuse guard.** Track each vendor's report-accuracy (upheld ÷ total). A vendor who reports *everyone* fake (fishing for free unlocks) drops below threshold → their reports lose the auto-refund fast-path and always go to admin.

**Verify.** Report a no-reply lead → instant refund. Three vendors report the same couple → couple flagged, all their holds released, prior burns refunded, admin notified. A vendor over-reporting loses auto-refund.

**Spec impact.** DECISION_LOG: "vendors can report fake leads; no-reply auto-refunds, ≥3-vendor cluster suspends the couple + refunds the whole blast radius; report-accuracy guards the button."

---

## Phase D — Lead trust badge 🟦 (independent — can parallel B/C; informs the accept)

Let the vendor decide *well* before a token is ever at risk. The masked lead already shows date/region/pax/event-type/AI-status (`get_pending_inquiry_basics`). Add a **trust signal** so the accept is informed.

**Signal** (computed, no PII leak): account age, email-verified, event completeness (date/venue/pax/budget/mood board), count of *genuinely engaged* other vendors, `events.setnayan_ai_active` (paying couple = serious), prior fake-report history. Collapse to a badge — **"Verified couple · active planning"** for enriched profiles, or a neutral **"New here"** for fresh ones.

**The badge is a POSITIVE nudge, never a scarlet letter.** Per the presumption-of-a-real-couple invariant: the badge is **vendor-only** (the couple never sees their own badge and is never told they look "limited"), it is **never a gate** (every couple can inquire the same way), and **"New here" is not "suspicious"** — most real couples start new. Copy leans encouraging ("New here — say hi") not risk-coded, and pairs with the hold reassurance ("returned if they don't reply") so vendors give newcomers a fair shot instead of freezing them out. It informs, it never accuses.

**UI.** Badge on the masked lead card in the vendor inbox (`app/vendor-dashboard/messages/...` pending branch).

**Verify.** A brand-new empty-event account shows "New account · limited info"; a couple with a filled event + AI active + 3 engaged vendors shows "Verified couple · active planning."

**Spec impact.** Extends the Phase-1 masked-lead enhancement (still ⛔ owner-gated on the region-disclosure question) with a non-identifying trust badge — the badge itself reveals no new contact fields, so it's independent of that gate.

---

## Phase E — Admin T&S queue + fingerprinting 🟦 (the human backstop; needs C)

**0023 admin console — new "Fake-inquiry / lead disputes" surface** (same pattern as the vendor-verification queues):
- Report tickets + cluster flags, **auto-grouped by couple account, device, IP**.
- Signals per row: distinct-vendor report count, thread engagement, fingerprint overlaps, couple trust badge.
- Actions: refund token(s) · warn / throttle / suspend couple · blocklist device/IP · dismiss (false report).
- **Progressive penalties reuse the 0016 trial-abuse machinery** (warning → inquiry throttle → inquiry ban → account ban). Appeal routes to a **0029 help-center ticket** (same as the trial-abuse appeal path).

**Fingerprinting.** Store a **hashed** device/IP fingerprint at signup + inquiry (first-party, no paid service, ₱0). Velocity + shared-device detection: many "couples" from one device → **shadow-ban** — inquiries are created in a `quarantined` status and **never surface to vendors** pending admin review (the attacker sees "sent", the vendor never sees junk, no token ever at risk).

**Targeting-concentration detection (the competitor-sabotage signature).** Real demand spreads across *many* vendors; a competitor attack converges *many thin/new/fingerprint-linked accounts on ONE vendor*. That asymmetry is the tell. Trip on **account-quality-weighted** concentration (NOT raw volume — a genuinely popular/boosted vendor gets many inquiries from *diverse, established* couples and must never flag) → quarantine the converging inquiries + release any holds + flag admin. Covers both tempos: a *fast* flood trips velocity/concentration; a *slow* flood evades it but is harmless — slow fakes still never reply, so Phase B refunds them anyway.

**Attribution deterrent.** The 12-doc vendor verification means real vendors have identity on file — if fingerprints tie a sock-puppet farm back to a real vendor account, that vendor is suspended / de-verified. Sabotage is attributable and punishable, not anonymous.

**False-positive discipline (couple-protection — implements the invariant).** Quarantine fires **only on high-confidence coordinated signals** (fingerprint-linked farm + concentration), never on a single thin/new profile. Three safety valves so a real couple never gets stuck:
- **Vendor-visible "held for review" banner** (the owner-approved surface). When any of a vendor's inbound inquiries are held, the vendor sees a soft banner — *"We held N inquiries that looked automated — review them?"* — with a **one-tap "This one's real — let it through"**. The vendor is the best judge of their own leads, so this is the *fastest* false-positive release **and** it trains the detector. No couple-facing accusation involved.
- **Auto-heal.** A held account that keeps behaving like a real couple (fills its event, inquires elsewhere normally, `setnayan_ai_active`, no fingerprint linkage) auto-releases on the next sweep — most false positives self-clear without anyone acting.
- **24-hr admin SLA** on the quarantine queue as the backstop; appeal via 0029 is the last resort, not the primary path.

**Verify.** 5 fingerprint-linked fake accounts from one device → inquiries quarantined, vendors see nothing but the held-for-review banner, admin queue shows the cluster; admin suspends the couple + blocklists the device. A **real** couple that trips the net (rare) is released in one tap by the vendor's banner, auto-heals on continued normal behavior, or is dismissed by admin within 24 h — and never saw a suspicion message.

**Spec impact.** 0023 gains the fake-inquiry queue; 0016 enforcement + 0029 appeal reused, not reinvented.

> ⚙ **Build note (2026-07-12) — a whole anti-fraud engine is ALREADY MERGED; Phase E plugs in, doesn't rebuild.** PRs #2835/#2836/#2838/#2841/#2859 ("Phases 1–4") shipped: **`fraud_signals`** (scored 0–100 anomaly signals + `vendor_fraud_scores` aggregate matview; pure scorers in `lib/fraud-detection.ts`, emitted by `scoreVendorFraud()` in `lib/fraud-detection-runner.ts`), **`identity_clusters`** (a user-keyed matview grouping accounts by shared device/address/payment signal via `refresh_identity_clusters()`), and the **`/admin/fraud` queue + two-stage enforcement** (auto-suspend → two-admin wipe/ban via `admin_approval_requests`). BUT it is **vendor-subject-only** (`fraud_signals.vendor_profile_id NOT NULL`, enum-locked types) with **ZERO inquiry/couple/token coverage**, and — critically — **device/IP fingerprint CAPTURE is dormant** (nothing writes `user_devices`; only `payments.reference_number` actually feeds clusters). So Phase E = **mirror** these proven shapes for a couple/inquiry subject (a sibling `couple_fraud_signals` + a new `/admin/*` queue, or the per-item `integrity_flags` pattern), **extend `user_identity_signals`** with an inquiry edge, and **build the fingerprint-capture write path first** (net-new) before competitor-farm clustering can work. Reuse the `admin_approval_requests` two-admin gate + the `enforcementLevelForStrikes` ladder pattern verbatim.

---

## Worked example — the competitor-sabotage attack

A rival wants to make a target vendor pay for many fake inquiries and/or bury their real leads. A competitor attack has exactly **two payoffs** — the design kills both and makes the attack economically irrational.

| Attacker move | What stops it |
|---|---|
| **Payoff 1: "make them pay"** — send N fake inquiries, hope the vendor accepts and burns tokens | **Phase B hold** — accept only *holds* the token; fakes never genuinely engage → auto-refund in 7 days. The vendor cannot be made to pay for a lead that never talks back. |
| Sophistication: have each fake send **one throwaway reply** to force a consume | **Phase B anti-reply-once** — a bare reply → `provisional`, still refundable; only a *value action* (accepted quote / lock + real downpayment / contact save) hard-burns, and a saboteur won't send real money. Report + cluster claw it back. |
| **Payoff 2: "bury real leads"** — flood the inbox so real leads are lost | **Phase E concentration** — many thin/new/linked accounts → ONE vendor is the sabotage signature; converging inquiries are *quarantined* (never reach the inbox), real leads keep priority. |
| Use many fake couple accounts from one setup | **Phase E fingerprint** clusters them by device/IP/email-pattern → shadow-ban at source. **Phase A** one-per-vendor-per-event + rate limits make each fake account expensive to stand up. |
| Slow, low-and-slow flood to evade velocity | Harmless — slow fakes still never reply → **Phase B** refunds them; velocity and hold cover different tempos. |
| Lock up the wallet in 7-day holds (liquidity attack) | Quarantine happens *upstream* → the vendor never accepts the flood → no holds are ever placed. |
| Cross-vendor spray (hit many rivals) | **Phase C cluster** — ≥3 distinct vendors reporting the same couple suspends it + refunds the whole blast radius. |
| Stay anonymous | **Phase E attribution** — fingerprints tie the farm to a real (12-doc-verified) vendor → suspension / de-verification. |

**Net:** the attacker spends real effort standing up fingerprint-surviving fake accounts for a payoff of ~zero (tokens refunded, flood quarantined) — *and* risks their own verified account. Not just blocked — pointless.

## Dependency order

1. **Phase A** — couple gate (independent; ship first, immediate spam relief).
2. **Phase B** — token hold-and-release (core; changes `unlock_vendor_event`).
3. **Phase C** — report + cluster (needs B's holds).
4. **Phase D** — trust badge (independent; parallel with B/C).
5. **Phase E** — admin queue + fingerprinting (needs C's reports).

Each PR: `changelog.d/<slug>.md` fragment + `SPEC IMPACT` line, auto-merge on, tsc + lint green, graceful-degrade pre-migration.

## Cost

| Phase | Marginal cost | New infra |
|---|---|---|
| A couple gate | ₱0 | none (DB guards) |
| B token hold | ₱0 | scheduled sweep = free cron |
| C report + cluster | ₱0 | none |
| D trust badge | ₱0 | none (computed) |
| E admin + fingerprint | ₱0 | first-party hashed fingerprint, no paid service |

Anti-fraud that itself costs ₱0 — consistent with the whole vendor stack being ₱0-marginal.

---

## ⚠ Owner sign-offs to confirm before build (surfaced, not silently locked)

1. **Full reveal on accept is PRESERVED.** The hold model keeps the owner-locked disclosure ladder ("once they pay tokens all info unlocks", 2026-07-11) — accept still reveals everything; only the *token consumption* is deferred. No reversal of that lock. ✅ (confirm this is the intent — the alternative, name-only-until-engagement, *would* reverse it and is not proposed here).
2. **Token semantics change.** `unlock_vendor_event` goes from burn→hold. Still "flat 1 token, charged at two-way intent" — but *intent* now means "couple replied", not "vendor clicked accept". Confirm this refinement of the 2026-07-11 lock.
3. **Bounded, accepted leak.** Under full-reveal + ghost-release, a vendor can view a *real-but-ghosting* couple's contact and still get the token back. Accepted as a small bounded cost (that couple ghosted → ~zero lead value anyway; capped by report-accuracy tracking). Confirm it's acceptable vs. the huge win of never charging for fakes.
4. **Tunable defaults** (all config, admin-editable): ghost-release window **7 days**, cluster threshold **K=3 distinct vendors**, concurrent-inquiry cap **15/event**, daily send cap **20/couple**. Owner can move any of these.
5. **Deliberate bias toward couples** (the presumption-of-a-real-couple invariant). The system is tuned to *tolerate a slipped-through fake* (cheap — the hold refunds it) rather than risk suspecting a real couple. Consequence: it will *not* catch every fake at the door, by design. Confirm that trade — protecting the demand funnel over maximal fake-catching — is the intended posture. (It aligns with the light-touch couple-gating decision.)

---

## Build progress

| Phase | State | PR / notes |
|---|---|---|
| **A** velocity gate | ✅ **shipped** | [#3132](https://github.com/iscasasola/setnayan-platform/pull/3132) — flag `NEXT_PUBLIC_INQUIRY_GATE_ENABLED` (OFF), no schema, manual-path only, unit-tested. Owner action to go live: flip the flag. |
| **B** token hold-and-release | ✅ **shipped** | [#3133](https://github.com/iscasasola/setnayan-platform/pull/3133) + hardening [#3134](https://github.com/iscasasola/setnayan-platform/pull/3134). Parallel `unlock_vendor_event_hold` RPC + `lead_token_holds` ledger (live burn RPC untouched); consume-on-couple-reply hook; daily ghost-release cron. Flag `NEXT_PUBLIC_LEAD_TOKEN_HOLD_ENABLED` (OFF). **Adversarially reviewed** — no double-charge / lost-token / false-block / apply-failure; 2 under-charge gaps (concurrency, verified-quota) fixed in #3134. Owner to go live: `supabase db push` (2 migrations) → test → flip flag. Sign-offs #2/#3 confirmed. Flat-1 flattening left as a separate item. |
| **C** report + cluster | ✅ **shipped** | [#3136](https://github.com/iscasasola/setnayan-platform/pull/3136). Extends the EXISTING vendor "Report user" (`reportUser`→`user_reports`, admin queue `/admin/user-reports` already there — no new UI): `handle_vendor_lead_report` RPC refunds the reporting vendor's held token on a no-reply lead, and refunds the whole blast radius when ≥3 distinct users report the same couple. Suspension stays a human decision (no auto-ban). Flag-gated on the hold flag. |
| **D** trust badge | ✅ **shipped** | [#3137](https://github.com/iscasasola/setnayan-platform/pull/3137). `get_lead_trust_flags` RPC (mirrors returning-client badge) + an "Active planner" chip on the masked lead (couple already has ≥1 accepted vendor thread = real engagement). Purely POSITIVE: no risky/suspicious tier, new couples get no chip, couple never sees it, never a gate. Flag `NEXT_PUBLIC_LEAD_TRUST_BADGE_ENABLED` (OFF). |
| **E** admin queue + fingerprint | 🟡 **slices 1–2 shipped (shadow)** | **Slice 1 — device-fingerprint CAPTURE — [#3139](https://github.com/iscasasola/setnayan-platform/pull/3139):** deferred client ping → server action hashes a coarse first-party device id → owner-scoped `user_devices` upsert (no migration; readers already existed). Coarse (random id, no canvas FP, no SDK). Flag `NEXT_PUBLIC_DEVICE_FINGERPRINT_ENABLED` (OFF). ⚠ **RA 10173: DPO sign-off + privacy-policy update before enabling.** **Slice 2 — CONCENTRATION detection (SHADOW · owner-approved 2026-07-12 "flag admin only") — [#3143](https://github.com/iscasasola/setnayan-platform/pull/3143):** `detect_inquiry_concentration` raises an `integrity_flags(kind=inquiry_concentration)` WATCH row per (vendor, linked-cluster) that sprayed one vendor via ≥3 distinct accounts; enforcement-FREE surface (victim vendor never auto-penalized); daily `fraud-cluster-sweep` cron (`refresh_identity_clusters()`→detect), gated on device capture. **HUMAN review only — never quarantines.** **Admin "Inquiries" tab SHIPPED — [#3172](https://github.com/iscasasola/setnayan-platform/pull/3172):** 3rd `/admin/integrity-watch` tab surfacing the `inquiry_concentration` WATCH flags (Confirm attack = verdict-only + Dismiss; NO Hide-listing — victim vendor never penalized). **Remaining:** **QUARANTINE** = explicit owner decision, unbuilt (heaviest/highest-FP-risk action). |

**Discovery (2026-07-12):** grounding in `apps/web` revealed (a) a merged vendor-side anti-fraud engine (Phases 1–4) my Phase E now extends rather than rebuilds, (b) one-per-vendor-per-event + anon-guard already enforced, (c) email-verify is a no-op (auto-confirmed) → gate on `is_anonymous` + velocity. The corpus above is updated inline with ⚙ build notes.
