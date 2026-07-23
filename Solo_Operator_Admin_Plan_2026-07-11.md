# The One-Person Admin — Council Synthesis (2026-07-11)

> **What this is.** A definitive plan to make the entire Setnayan platform operable by a **single person** through the admin console (iteration 0023). Produced by a 6-architect design council + 3-judge panel, then fused. Every mechanism runs on the **already-wired stack** (Claude API, Supabase + Edge Functions, Cloudflare Workers/Queue/R2, Resend, PostHog, Persona, face-api.js) and the corpus's **cron-free** house pattern (DB-trigger → webhook → `after()` lazy sweep + Resend `scheduledAt`).
>
> ⚠️ **Two owner sign-offs required before build** (flagged, not assumed — see §7): (1) softening the locked *"the matcher never auto-approves"* rule into a **bounded, reversible, audited** auto-activate band; (2) the **Custodian** — a non-human second signer for the four-eyes gate. Both ship **flag-off** behind a PostHog kill-switch. The DB four-eyes trigger itself is **never deleted**.

---

## 1. The core idea

**Approve exceptions, never transactions.** The admin console stops being 53 browsable surfaces and becomes **one Exception Desk whose resting state is empty**. Every queue self-clears its clean lane under a *deterministic trust threshold + fraud interlock + reversal window*; the human only ever sees the residue the machines could not safely settle. Because every automation's pass-through rate is **volume-independent** (only the ambiguous *tail* reaches a human), owner-minutes/day stay **flat from 1× to 10× volume**. Automation spend is aimed at driving the **exception rate down**, not at processing exceptions faster.

---

## 2. The operating model (what the day becomes)

- **One screen — the Exception Desk.** Every actionable thing (recon-tail, verify-amber, dispute-draft, flagged content, help-escalation, pending co-sign) is a polymorphic **case** arriving *pre-decided*: Claude's proposed disposition + the evidence inline + a one-key **Approve / Edit / Reject**. Ranked by `PriorityScore = money-at-risk × age × SLA-urgency`, with a **Risk multiplier** so a low-value fraud-vector item still floats to the top. Keyboard-first (j/k), batch-approve homogeneous cards.
- **Two sittings a day, not continuous.** A **Resend `scheduledAt`** digest (morning/evening) pulls the operator in: *"Desk has N items, top value ₱X, est. M minutes; K co-signs waiting."* **No per-item pings, ever.**
- **Interrupt only when it truly can't wait.** **Better Stack** pages ONLY for the **RED lane** — fraud auto-suspend review, a receiving-account **change** pending, a security anomaly, a force-majeure blast, an RA-10173 data-subject deadline. Deduped, rate-limited, target **<3/day at 10×**.
- **Auto-dispositioned work is visible-but-collapsed** — an audit trail, not a task list.
- **Read-only analytics is a push, not a page.** The ~14 dashboard/insight mirrors retire into **PostHog** + one weekly digest. The daily "go check the consoles" time goes to ~0.

**Load-shedding keeps the ceiling hard.** A Postgres `governor()` admits cases by score up to a **daily human-minute budget B (~180 min)**; the human is *physically never shown more than B*. Overflow sheds gracefully: defer low-value items to tomorrow with an **auto-extended SLA + a "received, expect reply by <date>" Resend email** (managed expectation, never a silent breach); batch homogeneous work; RED/legal/fraud items are **never** shed. So `minutes/day = min(B, must-be-human-work)` **by construction**.

---

## 3. The automation pillars (ordered by ROI)

### Pillar 1 — Straight-through payment reconciliation *(the dominant cost)* · effort **M**
Promote the existing 4-tier `match_inbox_to_order` from *propose-only* to **auto-approve + auto-activate on the exact tier**.
- **Mechanism:** when `confidence='exact'` (unique reference-code hit) **AND** `payment_inbox_messages.parsed_amount == service_orders.amount_php` to the centavo **AND** exactly one pending candidate **AND** order age < 7d **AND every interlock holds**, set `status='paid'`, run the existing SKU-activation + 0026 OR generation inside the Edge Function's `after()` sweep. **Key on the bank's own BDO-Alert / GCash notification row — never the customer screenshot** — so "exact" means money genuinely arrived.
- **Graft — salted-centavo amount key** *(product-minimalist; judges' top cheap idea):* add a per-order random centavo tail to Setnayan's fixed prices (₱499 → ₱499.37). The **deposited amount becomes a near-unique second key** alongside the Crockford ref — simultaneously *raises* the auto-match rate and *cuts* false-positive risk, for one column + one branch.
- **Graft — three-source agreement for the fuzzy tier** *(ai-copilot):* where a screenshot is involved, require `screenshot ↔ payment_inbox_messages ↔ order` to agree (Claude vision reads the screenshot) before a card goes green; screenshot-only stays amber HOLD.
- **Interlocks (all must hold):** receiving-account unchanged for 24h · amount ≤ ₱10,000 full-auto ceiling · buyer not in a fraud-flagged `identity_cluster` · per-customer velocity guard · message from the authenticated ingestion source only (never an admin-manual insert) · PostHog `payments.autoapprove.enabled` global kill-switch back to propose-only.
- **Safety spine — nightly authoritative-statement cross-check + auto-revert clawback** *(automation-engineer):* a nightly bank-statement CSV confirms each deposit; anything unconfirmed in 48–72h **auto-deactivates the SKU** and reverts to `pending_payment`. Cheap and safe because SKUs are **idempotent digital grants** and, at **0% commission, no vendor money is ever at stake** — there are no funds to claw back, only a status we fully control.
- **Impact:** at a realistic ~65% exact-match rate, ~33 of ~50 daily clicks vanish. **~250 min/day → ~30 min/day (~220 min/day recovered)** — the single biggest saver, on code that already runs.

### Pillar 2 — Zero-touch vendor verification clean lane *(the #2 cost, breaks the solo model first)* · effort **L**
Auto-clear the clean lane so the human reviews only the ambiguous third; the 15-min live Meet becomes an **exception**, not the default gate on every vendor.
- **Finish the Persona webhook (today a STUB):** verify HMAC signature → upsert `kyc_verifications` from `inquiry.completed` / `verification.passed` → flip the identity gate. This is the single highest-leverage wire in verification.
- **Claude-vision doc-check:** a `vendor-doc-check` Edge Function calls **Claude Sonnet** with a structured-output schema over the 12 docs to **cross-validate** (DTI ↔ BIR-2303 ↔ gov-ID name match · Mayor's-permit expiry · TIN format · address consistency · bank micro-deposit confirmed), returning per-doc verdicts + confidence.
- **Auto-approve fires only when:** Persona=approved **AND** doc-confidence all-pass **AND** AMLC/sanctions clear **AND** portfolio reverse-image (perceptual-hash against the **live anti-fraud identity-cluster engine**) = no stolen-image hit **AND** fraud-cluster clean. It grants a **bounded probationary tier** (capped leads, no boost, watermarked, **reversible** single-admin force-delist) + 100 free tokens, and **skips the Meet**. Anything else routes to the Desk with Claude's findings pre-attached.
- **Backstop:** the **live fraud auto-suspend (score ≥ 90, reversible)** catches any bad vendor that slips the clean lane; the badge is revocable in one action.
- **Impact:** ~55% clean-lane auto-clear (~30–40 min read + 15-min Meet eliminated each, ~9–10 hrs/week). **~200 min/day → ~45 min/day**. Claude cost ≈ $0.30/vendor (~$40–80/mo) versus the 2–3 FTEs it would otherwise take at 10×.

### Pillar 3 — Concierge Brain on the help inbox + self-shrinking corpus · effort **S** *(best ROI-per-build-week after Pillar 1)*
Point the **already-built** RAG Brain (pgvector over `concierge_brain_chunks` + Haiku) at inbound tickets.
- **Mechanism:** on ticket create, the Brain drafts a cited answer. High-confidence + maps to a known chunk → **auto-reply via Resend** with a *"was this helpful / talk to a human"* escape on every message (never generative-only). Mid → edit-and-send draft on the Desk. Low / angry / money-touching → escalate.
- **Graft — self-shrinking corpus** *(product-minimalist):* every human-authored answer appends to the existing **unanswered-Q queue → becomes a new chunk**, so the same question never reaches a human twice. This makes the support exception **rate trend *down* over time**, not merely stay flat.
- **Impact:** deflects ~50–65% of tickets at **<$10/mo Haiku spend**. **~80 min/day → ~28 min/day.**

### Pillar 4 — One disputes + moderation lane, every item pre-decided · effort **M**
Fold disputes + the whole content-moderation family (reviews / editorial / real-stories / repost-watch / integrity-watch / concierge-abuse / promoted / ads) into **one flagged lane**.
- **Mechanism:** an intake bot assembles order-status + render-job logs + **Contract Intelligence (0032, Sonnet, 14-element)** clause analysis + (only if the existing 7-day/two-admin FM gate clears) the last-10 snippet, then proposes **Refund / Replace / Vendor-fault** with clause citations. **Deterministic digital-SKU faults** (render failed, activation never fired) **auto-refund ≤ ₱25K** (already a single-admin bound, reversible). NSFW/text classifiers auto-approve clean content, auto-hold only flagged; concierge trial-cycling folds into the fraud engine.
- **Impact:** #8 + ~10 moderation surfaces collapse to one lane; the human sees only genuinely ambiguous cases, each carrying a decided-outcome draft — one-click confirmations instead of multi-minute evidence reads.

### Pillar 5 — Surface reduction: 53 → ~6 · effort **M**
See the full map in §5. The console's resting state is **empty**; a surface exists only if it hosts a decision automation could not close.

### Pillar 6 — The Minutes Meter (tripwire telemetry) · effort **S** *(the meta-saver)*
Make the flat-minutes invariant **measurable** so you deepen automation or hire **before** drowning, not after.
- **Mechanism:** PostHog instruments handle-time per Desk item; a nightly rollup computes per-surface `residual_minutes = touched_items × median_handle_time` and `exception_rate`. **Better Stack** (already auto-paging) alarms when any surface crosses **60 min/day sustained 7 days**, or when its exception rate trends up (the early warning a tripwire is snapping back).
- **Payoff:** converts *"hire the second human"* from a panic into a **pre-computed trigger**, and shows which surface earns the next automation dollar. (Modeled: **verification hits its tripwire first, ~35–40 vendors/day** — so it gets the next investment after Pillar 1 is straight-through.)

---

## 4. Solving the two-admin blocker *(the make-or-break section)*

The four-eyes gate (`CHECK(approver_id != initiated_by)`, enforced in DB triggers, 7-day expiry) bundles **three different harms**, and only a couple genuinely need a second *human*. **Decompose by harm, apply the minimal correct control, and keep the trigger intact by giving it a distinct, accountable principal to *match* — never by deleting it.** The key economic insight: **gated actions are rare and do NOT scale with transaction volume** (you don't change your receiving account 500×/day at 10×), so the gate never threatens flat-minutes — it only threatens whether one person can do it *at all*.

**The substrate — the Custodian.** Register a **distinct, login-less system principal** (`custodian@setnayan`, a real `admin_id` with no session) that acts only through a version-controlled policy-runner Edge Function. Because it is a genuinely distinct id, `CHECK(approver_id != initiated_by)` is satisfied **honestly, not bypassed** — zero new infra, pure `admin_approval_requests` + Resend + reused vendor micro-deposit. **The AI is wired asymmetrically: deterministic SQL is the load-bearing "approve"; the LLM can only ever push a decision toward HOLD/flag — a model can never be the thing that grants or releases money.** This neutralizes prompt-injection-to-approve as an entire class.

| Class | Actions | The "second eye" substitute |
|---|---|---|
| **A — reversible / bounded** | refund > ₱25K · comp > ₱10K · re-publish rejected vendor · bulk change within a row cap | **Custodian co-signs in <5s** *iff* a deterministic policy passes **within a hard envelope**, a scaled **cool-off (24–72h)** elapses with founder **notify-and-veto**, and a reversal window applies. Out-of-envelope → falls through to human/time-lock. *(Was a 7-day-expiry dead end for a solo op; now instant + audited.)* |
| **B — reversible but sensitive** | mid-quarter SKU reprice / frequency change · bulk price > 100 accounts | **A second eye across *time*:** written to a staged/dormant state → **WebAuthn/passkey step-up from a separate device** arms it → activates only after a cool-down during which the anomaly monitor and the owner can **abort in one click**. |
| **C — self-dealing / irreversible** | **change Setnayan's own BDO/GCash receiving account** (top fraud vector) · hard-delete cascade · view-as/takeover start · brand flip · kill-switch · promote admin | **Never delegated to a machine.** Separate-device **passkey step-up + 24–72h time-lock + dormant-until-unlock**, and — critically — **invert the receiving-account `Notify=No` → `Notify=OWNER`**: for a solo business *the fraud target is Setnayan itself*, so the owner is exactly who to alarm. Any receiving-account change also requires **micro-deposit name-match re-verification** of the new account (reuse the vendor micro-deposit primitive) — even a fully compromised session can **stage but never silently redirect money**. |
| **privacy** | read chat body / FM snippet · decrypt face vectors · edit KYC | Stay **human-initiated + purpose-bound**: mandatory purpose + evidence-ref, **real-time data-subject notification** (a *stronger* control than a collusion-capable second admin), append-only access log, auto-delete (FM snippet already purges 30 days post-resolution). |

**Two standing controls make fast solo operation provably accountable:**
1. **Merkle-anchored append-only ledger** — extend the HMAC-chained `admin_audit_log` with a **daily Merkle root anchored out-of-band** (email + optional third-party immutable sink). This is the *only* control that closes the hole every design otherwise leaves: **the owner is a DB superuser who could rewrite the audit chain.** With the anchor, even that is detectable after the fact.
2. **Re-point the LIVE fraud anomaly engine at the admin's *own* action stream** — spikes in comps, refunds, receiving-account edits, or privacy reads **auto-page and can auto-HOLD the Custodian**. A standing second eye that watches 10× volume **for free**, built entirely from shipped `lib/fraud-detection*.ts` code.

**The honest residual.** For the 2–3 genuinely catastrophic-irreversible actions (hard-delete cascade, fraud wipe+ban) the DPIA (AF-3) legitimately still wants a human. Keep a **zero-console external magic-link co-signer** — the owner's accountant / lawyer / DPO-delegate / spouse, a real distinct human on a different device, whose *only* power is approve/deny on the enumerated list via a signed Resend link (*"Owner requests: change receiving account to X — approve within 7 days?"*), no login, no data visibility beyond a one-line summary + evidence hash, **~1 request/month**. Designate a **2–3-person pool** so no single unavailability stalls a monthly item before the 7-day expiry. The one-time founder self-promote **bootstrap** stays only as an emergency hatch.

**RA 10173 framing.** The Custodian is documented in the DPIA under **§12(f) legitimate interest**; because it can **never** ban, delete, or charge anyone (asymmetric — approve-within-bounds-or-HOLD only), it stays clean of the §16(c)/§34 automated-adverse-decision provisions that the fraud auto-suspend must address.

---

## 5. Surface reduction — 53 → ~6

Every retired surface is one of three things:

- **DEAD WORK (delete):** BIR payout/EWT/2307 + dev-plumbing (smoke-test / cron / offline / agent) — the work no longer exists at 0% commission (Setnayan isn't a withholding agent). *Keep Official-Receipt generation — that is NOT dead at 0% commission.*
- **PULL → PUSH (delete the page):** the ~14 read-only analytics mirrors (funnels / growth / insights / intelligence / telemetry / completions / recaps / revenue-milestones) → PostHog dashboards + one weekly Resend digest. Sentry + Better Stack already auto-page, so the smoke-test/health pages go too.
- **DECISION MOVED UPSTREAM (queue designed out):** reconciliation / verification / help / disputes / moderation pre-empted by Pillars 1–4 so no queue fills.

**The surviving ~6 (rare, not daily):**
1. **Exception Desk** — the one daily screen (resting state empty).
2. **Approvals & Co-sign** — the Class A/B/C gate console (§4).
3. **Fraud review** — the `/admin/fraud` scored queue + admin-action anomaly monitor.
4. **Accounts & Takeover** — user/vendor/event directory + the privacy-tier actions.
5. **Catalog & Content** — the ~22 pricing/addon/token/discount/taxonomy/website/asset config tabs merged into one **monthly-visited** workspace (the money-touching **two-admin price CHECK stays schema-enforced**, independent of UI — surface count can't weaken a DB trigger). Taxonomy-request tickets get Claude dupe-classification so most auto-resolve into an existing node.
6. **Compliance & Export** — RA 10173 data-subject requests, the Merkle audit viewer, DPIA artifacts.

---

## 6. Build order (sequenced; each pushes a tripwire out)

> **PayMongo re-sequencing (owner update 2026-07-11).** Owner files the **BIR COR (Form 2303) Mon 2026-07-13**, then submits the PayMongo merchant application and waits on approval — so a payment **gateway is ~weeks out, not months.** This flips the payments strategy: **do NOT build the heavy Pillar-1 bridge** (salted-centavo key, matcher auto-approve, clawback spine). A PayMongo `payment.paid` **signed webhook is confirmed money** → it feeds the *existing* activation path (`status→paid` → OR gen → SKU flag) directly, delivering Pillar 1's ~220 min/day "for free." Two knock-on effects: **(a) owner sign-off #1 dissolves** — "softening the *matcher-never-auto-approves* lock" was an artifact of the manual-screenshot era; activating on a signed gateway webhook is *confirmed payment*, not a heuristic auto-approve, so only the **Custodian** sign-off remains; **(b) the two-admin/Custodian work RISES in priority** — PayMongo makes refunds an instant API money-out, so the Class-A refund co-sign now guards a real fraud surface. Re-ordered into three windows:
>
> - **Window A — during the PayMongo wait (build what the gateway can't solve):** Phase 0 instrument (Minutes Meter + kill-switches + Merkle anchor) → **Pillar 3 Concierge Brain on help inbox** (S, pure wiring) → **Pillar 2 verification clean lane** (finish Persona webhook + Claude-vision — the surface that breaks the solo model first, and PayMongo does nothing for it) → cheap slice of Pillar 5 (delete dead work + pull→push analytics). **Payments stay on today's manual reconciliation + the existing propose-only matcher, untouched.**
> - **Window B — PayMongo approved (integration):** wire PayMongo checkout + `payment.paid` webhook → SKU auto-activation (reuse the existing activation path); keep a **thin** manual-transfer fallback lane on the propose-only matcher for the shrinking bank-transfer minority; the COR also unlocks **compliant OR issuance (0026)** for gateway sales.
> - **Window C — the durable hard problems:** Pillar 4 dispute + moderation lane → **Custodian / two-admin gate** (Class-A refund co-sign first, then receiving-account hardening) → finish the Pillar-5 config-surface merge.
>
> Division of labor: owner runs the real-world registration track (COR → PayMongo KYB); the code track builds Windows A/C in parallel, so when approval lands the gateway wire-up is the *only* payments task left and everything else is already automated.
>
> **Build-ahead: align everything now, don't wait for approval.** Window B's *code* moves INTO the wait window — build behind a **provider-agnostic `PaymentProvider` adapter** (PayMongo is one implementation; matches the corpus's "PayMongo *probable* OR GCash Merchant API" — never hardwire the vendor), fully wired and integration-tested against **PayMongo test-mode keys** (issued on signup, *before* live approval — approval only gates accepting *real* money). The webhook plugs into the activation path that **already exists** from the manual flow, so it is a genuine *connection*, not new plumbing. Everything ships **flag-off** (`PAYMONGO_ENABLED=false`). Only three things truly wait for approval: **(1) swap test keys → live keys, (2) register the live webhook signing secret, (3) flip the flag** — plus the payout bank-account config on the approved account. So "PayMongo is ready" becomes a **~1-day key-swap + smoke test**, not a build project.
>
> **Resilience — dual-rail payments, manual is the permanent floor.** Manual apply-then-pay is NOT throwaway; it stays forever as the fallback rail. Two `PaymentProvider` implementations coexist: **(1) PayMongo** (automated, primary once live) and **(2) `ManualBankTransfer`** (instructions + reference code → `pending_payment` → admin/matcher approves — the flow that already exists today). Dual-rail checkout offers the customer both, with a **circuit-breaker auto-failover**: if PayMongo is unreachable/erroring, the online option auto-hides and checkout falls back to manual — mirroring the codebase's existing **0028 Resend → SendGrid** email-failover pattern. Consequences: the app **never has a moment it cannot take a payment** (today it already runs 100% on manual — PayMongo is purely additive); during a gateway outage, activation latency degrades gracefully from *instant* → *≤24h manual SLA* (customer sees "payment received, confirming shortly"), and the plan's **capacity governor + managed-expectation SLA emails** are exactly the shock absorber for the temporary manual-volume spike. Keep manual permanently anyway — it's the **zero-gateway-fee option** and serves the real PH segment that distrusts online payment. Only the *heavy* manual **automation** (salted-centavo key, matcher auto-approve, clawback spine) is skipped; the existing manual flow + propose-only matcher badge IS the fallback.
>
> **Manual rail methods (owner-specified 2026-07-11).** The `ManualBankTransfer` instructions screen presents Setnayan's own receiving accounts three ways: **(1) BDO — QR code** (scan-to-pay in the BDO app) **+ copyable account name & number**; **(2) GCash — QR code + copyable GCash number & account name**; **(3) manual entry** — the raw bank details and GCash number shown as **copyable text** for customers who can't/won't scan (desktop, or typing into their own banking app). Each order carries a **unique reference code** (8-char Crockford, per 0034) the customer includes in the transfer note; the customer uploads a **payment screenshot**; the order sits `pending_payment` until the admin reconciles (matcher badge assists) within the **24-hr SLA**, then activates. **Design locks:** the QR images + account details are **admin-managed data** in the Payment Methods surface (`/admin/settings/payment-methods`, admin #19) — never hardcoded — and **changing a receiving account is a Class-C two-admin-gated action** (the top fraud vector; Notify→OWNER + micro-deposit re-verify + time-lock per §4). Fully consistent with the locked apply-then-pay model, the 0034 screenshot-reconciliation flow, and the 0028 `payment_instructions` email template.


**Phase 0 — instrument first (days).** Ship the **Minutes Meter** read-only + the global **propose-only kill-switches**, so every autonomy lane is measurable and instantly reversible *before* it goes live. Turn on the **Merkle out-of-band anchor** over the existing HMAC chain (near-zero effort; makes every later friction-only control provably defensible).

**Phase 1 — gut the dominant cost (highest ROI).**
1. **Salted-centavo tail + Tier-1 auto-activate** (Pillar 1) — reuses code already labeled *"auto-resolvable"*; buys back ~220 min/day.
2. **Concierge Brain → help inbox** (Pillar 3) — the engine already exists; deflects the FAQ tail at <$10/mo.
3. **Retire dead work + pull→push** (Pillar 5) — pure deletion, zero decision-risk; 53 → the teens overnight.

**Phase 2 — the surface that breaks first.**
4. **Finish the Persona webhook** → **Claude-vision doc-check** → clean-lane auto-approve (Pillar 2). *(Verification is modeled to hit its 60-min/day tripwire first at ~35–40 vendors/day.)*

**Phase 3 — collapse the rest.**
5. **Disputes + moderation lane** (Pillar 4) and the **Exception Desk** unification with pre-staged decision packets + capacity governor + load-shedding.

**Phase 4 — unblock the gate (owner sign-off gated, flag-off).**
6. **Custodian Class-A** for refund > ₱25K / comp > ₱10K first (the two most common stuck gates) → then **invert receiving-account Notify + micro-deposit + 48–72h time-lock** (Class C) → then **repoint the fraud engine at the admin's own stream**.

**The tripwire that replaces "when do I hire?":** any single surface's residual crossing **60 min/day sustained 7 days** is the pre-computed signal to deepen *that* surface's automation or add a second operator. This roadmap is designed to push that tripwire out to **~10× current volume**.

---

## 7. Risks & guardrails

- **Auto-activation on a mis-parsed bank/GCash message** → bounded (₱499–₱2,999, reversible deactivation), guarded by authenticated-ingestion-only + salted-amount near-uniqueness + the **nightly authoritative-statement cross-check + auto-revert** + the ≤ ₱10K full-auto ceiling + a per-day velocity cap. **⚠️ Softens the locked "matcher never auto-approves" rule — owner sign-off required.** It is a *bounded, reversible, sampled* exception, not a silent break, and touches nothing in the two-admin gate.
- **Claude false-clearing a forged-but-consistent DTI/BIR set** → reverse-image + AMLC + fraud-cluster interlocks + the **live auto-suspend (≥90) backstop** + one-click revocable probationary badge + a mandatory **post-approval spot-audit sample**.
- **Forged/edited payment screenshot** → never trust the screenshot alone; green requires agreement with the **independent bank-inbox row**; screenshot-only stays amber HOLD.
- **Prompt injection** via ticket text / vendor docs / screenshots / contracts → treat all tool-read content as **data, not instructions**; structured-verdict outputs only; the **asymmetric-AI invariant** (LLM can only push to HOLD, never grant) means injection can at worst *block*, never approve.
- **Automation bias / rubber-stamping** → the **graduation ratchet** (a category auto-promotes Amber→Green only after N consecutive human agreements and **instantly demotes on any override-rate spike** via a per-category PostHog kill-switch) + mandatory-read fields on amber + random forced full-reviews.
- **Custodian mis-scoping weakening self-dealing protection** → Class C is **never delegated to a machine**; ships **flag-off pending explicit owner + counsel sign-off**. ⚠️ Touches a locked, intentional-safety decision.
- **RA 10173 exposure** from Claude reading KYC/ticket bodies → persist **structured verdicts only**, no raw PII in logs, honor the CI lint guard barring service-role reads of `chat_messages.body` and face vectors; face-vector decrypt + chat-body read stay Class-privacy gated regardless of automation pressure. The **DPIA §6 transparency gap must land** — real-time data-subject notification only counts if it's disclosed in the privacy notice.
- **Merkle/audit as second-eye** only holds if the **out-of-band anchor + third-party immutable sink ship BEFORE** Class-A/B automation is trusted at scale.

**What must stay human, always:** the 2–3 catastrophic-irreversible actions (external magic-link co-signer), privacy-tier data *reads*, and any action outside a Custodian envelope.

---

## 8. The success metric

**Owner admin-minutes/day = Σ over surfaces (human-touched items × median handle-time)**, dashboarded per-surface with a 30-day trend **plotted against transaction volume**.

- **Health = the minutes-vs-volume slope is ~0 (flat)** as volume 10×'s — achieved by holding **exception *rates* low** (target: reconciliation < 10%, verification < 20%, help deflection ≥ 50%), *not* by working faster.
- **Absolute target: keep total under ~180 min/day (3 hrs) through a 10× ramp.** Today's un-automated load ≈ **650 min/day**; the automation stack brings *current* volume to ≈ **155 min/day**.
- **Gate health:** median Class-A co-sign latency **< 5s** regardless of count; share of gated requests that **expire unactioned → ~0** (was effectively ~100% for a solo op); four-eyes minutes/day hold **< ~10 flat** across 10×.
- **Tripwire alarm:** any surface's residual crossing **60 min/day sustained 7 days** → deepen automation or hire. **< 3 RED pages/day at 10×.**

---

### Appendix — council provenance
6 architect proposals (automation-first · AI-copilot · exception-ops · compliance/risk · surface-reduction · scale-economics) + 3 judges (solo-time ROI · feasibility · compliance/risk). Judge scores: **automation-engineer 88/88/89**, **scale-realist 91/79/85**, **compliance-officer 64/93/71** (polarizing — best reasoning on the gate, but its WebAuthn + Merkle-sink are the only genuinely new infra). Unanimous verdict: **best two-admin reasoning = compliance-officer, shipped on the automation-engineer/scale-realist distinct-DB-principal substrate.** This synthesis fuses the strongest pillar from each worldview and the eight grafted ideas the judges flagged across proposals.
