# Setnayan AI — Complete Assessment

> Single source of truth for **what Setnayan AI is, does, and where it stands** (as of 2026-06-29). Consolidates `Setnayan_AI_Template_Library.md`, `Setnayan_AI_Subscription_Decisions_2026-06-29.md`, `Setnayan_AI_Data_Use_DPO_Review_2026-06-29.md`, and the DECISION_LOG. Everything below is **built and dormant** unless marked otherwise.

---

## 1. What it is

Setnayan AI is the **per-user subscription planning assistant** (₱499 first 28-day cycle intro, then ₱799 per 28-day cycle · owner-locked 2026-07-02). It covers **all of a user's events at once**, runs in the background, and is **deterministic** — rule-based, not a language model — so it costs ~nothing to run (~95–99% margin) and every suggestion is explainable.

Two sentences: *It does the planning legwork and guards you against costly mistakes. Free = you do it yourself; the subscription = it does it for you.*

---

## 2. What it does — five capability areas (33 templates)

| Area | Role | Templates | Examples |
|---|---|---|---|
| **Secretary** | Does the work | 9 | Finds & ranks vendors, chases quiet vendors, summarizes quotes, surfaces the next task, narrows a stuck choice, detects a converging date |
| **Guard** | Watches risk | 10 | Payment/deposit due, statutory deadlines (wedding), price hikes, flaky vendors, over-budget, double-booking, contract windows, unverified-vendor warning, availability changes, last-minute rescue |
| **Commend** | Reassures | 4 | "Great choice — 47 reviews, 4.8★" (post-booking), evidence (pre-booking), progress affirmation, good-deal |
| **Inference** | Learns *you* | 5 | "I noticed you keep looking at garden venues…", cross-connect ("your photographer also does booths"), budget/region signals |
| **Trend** | Learns from everyone | 5 | "68% of couples like you added a coordinator", spend/timing benchmarks — anonymized, min-group-size gated |

**The intelligence engine** (how templates fire): a **trigger engine** reads a planning snapshot → fires interventions → a **restraint engine** dedups/ranks/cools-down/caps ("earn the interruption") → a **weekly digest** assembles the receipt (honest "quiet week" vs "busy week"). All deterministic.

**Voice rules (enforced):** warm, plain, premium; inform-never-pressure; praise only when earned; inferences always self-disclosed ("I noticed…").

---

## 3. Pricing & model

- **₱499 first 28-day cycle (intro) → ₱799 per 28-day cycle** (owner-locked 2026-07-02 — the ₱499/28d that was the 2026-06-29 flat price is now the first-cycle intro; ₱799 is the new recurring), sold as **prepaid term passes** on the existing apply-then-pay rails. Reverses the old one-time ₱3,999.
- **Per-user**, covering all the buyer's events; a couple is covered by either partner's subscription (never double-charged).
- Early renewals **stack**; lapsed ones start fresh. Lazy (cron-free) expiry.
- Upgrades to provider-run auto-renew (PayMongo/GCash) when those rails land.

---

## 4. Event-type coverage

- **The engine is event-agnostic** — wedding, birthday, debut, christening, corporate, anniversary, etc. Terminology adapts automatically ("the couple"→"the host", "wedding date"→"party date"). 32 of 33 templates work across all types; only the PH statutory guard is wedding-only.
- **Depth is wedding-first today** — only weddings have the rich onboarding that feeds personalization and the legal/paperwork guard. Other types run the same engine but shallower until their content packs are filled (birthday + debut are the obvious next ones).
- **Most valuable** where there's real money, many vendors, and lead time (weddings, big debuts, corporate galas); weak fit for tiny vendor-free events.

---

## 5. Data & privacy

- **Deterministic = free + explainable.** No LLM in the loop (even "drafted" vendor messages are templated). Going LLM is the only thing that would add per-user cost — deliberately avoided.
- **Two data features are consent-gated** (Inference + Trend): personal data used for you (personalization) needs notice + opt-out; everyone's data used for everyone (trends) is anonymized + min-group-size (proposed ≥25) so it's not personal data. **Off until the DPO signs off** the one-pager.
- RA 10173 aligned: self-disclosing use, real off-switch, minimization + retention, included in existing export/delete tools.

---

## 6. Build state (what's shipped vs pending)

**✅ BUILT (shipped to prod, all dormant behind a default-off flag):**

| PR | Piece |
|---|---|
| #2407 | Entitlement foundation + 33-template library + renderer + gate |
| #2413 | Buy→entitlement engine (term-pass SKU + cycle math + activation hook) |
| #2421 | Trigger engine + restraint + weekly-digest assembly |
| #2427 | Eventless + per-cycle checkout (money path) |
| #2428 | Buy page (account-level cycle picker) |
| #2430 | DB→snapshot adapter + weekly-digest surface (engine now fires) |

The engine is now **fed and surfaced**: real budget data → snapshot → triggers → restraint → weekly digest on the account page. V1 fires the **money guard floor** (payment-due + over-budget); the other triggers fire as their data sources are added (no engine change). The brain is complete and wired — it just needs the flag on.

**⏸ DEFERRED (acceptable while dormant):** an eventless order-detail view (links fall back to /dashboard).

---

## 7. To turn it on (owner steps — nothing is live yet)

1. **Go live (pricing pass):** flip the SKU active (`platform_retail_catalog_v2 SET is_active=true WHERE service_code='SETNAYAN_AI_SUB'`) · flip the flag (`platform_settings SET setnayan_ai_per_user_enabled=true WHERE id=1`) · reconcile public `/pricing`+homepage+llms.txt (still show the old one-time ₱3,999) · link the buy page into account nav.
2. **Turn on Inference + Trend:** DPO sign-off on `Setnayan_AI_Data_Use_DPO_Review_2026-06-29.md`.

*(The snapshot adapter + digest surface that make the assistant fire are now BUILT — #2430. Once the flag is on, the money guard fires on real budget data.)*

Plus housekeeping: refresh the stale `SUPABASE_DB_URL` password.

---

## 8. What it deliberately does NOT do

- No language-model generation (keeps it free + explainable + private).
- No invisible profiling — every behavioral use is surfaced.
- No pressure/FOMO selling — trends inform, never push.
- No selling basic safety — verification + anti-double-book stay free; only the *proactive/personalized* layer is paid.
- No autonomous money movement or signing — acts on small/reversible things, asks on money/contracts/outbound.
