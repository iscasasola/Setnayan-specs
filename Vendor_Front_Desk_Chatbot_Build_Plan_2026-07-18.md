# Vendor Front-Desk Chatbot — Build Plan (2026-07-18)

> Status: **DRAFT for owner sign-off.** Nothing built yet. Load-bearing decisions (pre-acceptance messaging, token-gate interaction, free-vs-Pro split, pricing) are flagged in § 9 and must be signed off before schema lands.

## 0. One-paragraph summary

A vendor auto-responder that reads the vendor's **own structured store** and answers incoming couple inquiries automatically — a "BotCake, but you don't build the flows" front desk. It is **deterministic by default (₱0 per reply)**, consistent with the locked Rule 1 ("Setnayan AI = deterministic, not an LLM chatbot"). It answers the factual, catalog-based questions (price, availability, inclusions, coverage, discounts, reviews) *before* the vendor accepts the inquiry, then hands genuine leads (customization, booking) into the existing token-gated accept flow. A **Pro "smart" layer** adds the vendor's own speaking voice, natural phrasing, self-serve internet enrichment, higher caps, and lead analytics. On substance it beats Facebook's Page AI (it has real prices + availability + it's where the booking happens); the Pro layer makes it feel as smooth.

## 1. Why "free" is structurally possible

An LLM earns its per-message cost by *understanding unstructured text*. The vendor's store is already structured (`vendor_services` carries full pricing math; `vendor_packages` + `vendor_package_items` carry bundles; add-ons, discounts, coverage, reviews all normalized). So "understand the store" collapses from an AI call into a **database lookup** — a per-reply SQL query ≈ ₱0. This is the vendor-side twin of the deterministic couple-side Setnayan AI, not a new pattern.

## 2. Principles / locks to respect

1. **Deterministic base, ₱0/reply.** No LLM in the reply hot path for the free tier.
2. **Can't misquote.** The bot only emits prices/dates/inclusions that exist in the vendor's own rows — it can't hallucinate a number.
3. **Token model untouched.** The bot never auto-accepts an inquiry and never burns a token (see § 4). Acceptance stays a deliberate vendor action.
4. **Confidence-gated + labeled.** Below the confidence threshold, or on customization/booking intent, it hands off instead of guessing. Every bot message carries a visible "⚡ auto-reply" tag.
5. **Vendor owns the config.** Voice profile, daily cap, and enable/disable are vendor-set and vendor-approved. Bot-assisted, never bot-committed.

## 2A. Hard data-isolation lock (owner-locked 2026-07-18)

**The bot uses ONLY the vendor's own business data. It must never read, use, leak, or be trained on another vendor's data or any other customer's data, and must never interfere with another vendor's threads, inbox, or config.** Enforced *structurally* by the canonical RLS patterns (`current_vendor_ids`, RLS at `CREATE TABLE` time) — not just by policy. The bot runs inside the vendor's own scope and physically cannot see outside it. Per surface:

- **Store answers** — only rows owned by *this* vendor (`vendor_services`, `vendor_packages`, add-ons, discounts, coverage, reviews). RLS-scoped.
- **Voice profile** — trained ONLY on the vendor's own **outgoing** messages (`chat_messages` where `sender_role='vendor'`). Never on couples' message text (that is customer data), never on another vendor's messages.
- **Recommendation tallies** — computed ONLY over *this* vendor's own booking history (`event_vendor_packages` for their packages). **No cross-vendor "popular bundle" aggregates.**
- **Deep-search enrichment** — the vendor's OWN public internet footprint only. Never scrapes or ingests competitors.
- **Per-thread isolation** — a reply in one thread sees only that thread + this vendor's own store. Never surfaces another couple's info or another vendor's prices.
- **No cross-vendor / comparative data in customer replies** — `vendor_market_stats` and any market/positioning aggregates are for the vendor's own dashboard only, never quoted to a couple.
- **LLM layer isolation** — precompute/paraphrase runs per-vendor in an isolated context; never batch multiple vendors' data into one prompt; prompt-cache keyed per-vendor so there is no cross-vendor bleed. No customer PII sent to the model beyond what a single thread requires.

Any design that would require reading beyond the single vendor's own scope is out of bounds — surface it, don't build it. This lock is non-negotiable and overrides any convenience/quality tradeoff.

## 2B. AI-disclosure lock (owner-required 2026-07-18)

**Every message the bot sends is clearly labeled AI-generated to the recipient. Non-negotiable.**

- **Couple-facing:** each bot message carries a persistent, visually distinct tag (e.g., "⚡ AI auto-reply · [Business]"), never styled to look like a human vendor typing. A one-time context note on the first bot message: *"This vendor uses an AI assistant to reply instantly — a person will follow up."*
- **Applies to ALL bot output** — front-desk answers, clarifying questions, and especially the compatibility auto-accept **voice welcome**. A voice-matched reply in the vendor's own style MUST still be labeled AI; unlabeled voice-match would be impersonation.
- **Vendor-facing:** the vendor's own inbox marks which replies the bot auto-sent on their behalf (awareness + audit via `chat_messages.is_bot` / `vendor_bot_replies.was_llm`).
- **Human handoff is unlabeled:** once the vendor takes over, their messages are human ("from [Vendor]"). The tag always distinguishes AI from person.
- **Why:** trust, honesty, non-impersonation, and alignment with emerging AI-disclosure norms + the platform's transparency/privacy posture (RA 10173 spirit). Supersedes any "make it feel human" instinct — feel human in *tone*, never in *disguise*.

## 3. Architecture — the four-stage deterministic engine

Runs on each new inbound couple message in a thread, if the bot is enabled and under the daily cap.

1. **Intent classification** — deterministic keyword/pattern match (see § 5 taxonomy). No AI.
2. **Answer assembly** — pull the matching rows from the vendor's store and template-fill.
3. **Recommendation (optional)** — "customers who ask about X usually book X + Y", from a deterministic tally over the vendor's own `event_vendor_packages` history (same mechanism as couple-side preference-match).
4. **Confidence gate** — reply / ask one clarifying question / hand off. Ambiguous entity ("which service?") → deterministic clarifying question, still free.

## 4. The pre-acceptance boundary (the key design decision)

Inquiries land as `pending`; today chat un-masks only when the vendor accepts (which burns a token). The bot operates in that **pre-acceptance window as a public "business assistant"**, using only data already public on the vendor's profile — so it leaks nothing new and doesn't count as the vendor "accepting":

| Bot may answer pre-acceptance (public catalog facts, ₱0, no token) | Bot must hand off → existing token-gated accept flow |
|---|---|
| Price / package price / rate math | Customization / "can you adjust / special request" |
| Availability status on a date | Negotiation / "can we lower it" |
| What's included (crew, meal, transport) | Booking / "I want to reserve / downpayment / how do we proceed" |
| Coverage area / venue reach | Meeting / call request |
| Published discounts / promos | Anything below the confidence threshold |
| Lead-time / last-minute + surcharge | |
| Reviews / portfolio / sample links | |

**Why this helps the token model rather than fighting it:** the free front desk filters tire-kickers (answers "how much" so only serious couples reach the customization/booking handoff), so the token burns on *better* leads. Requires owner sign-off to allow labeled bot messages in a `pending` thread (§ 9.1).

## 4A. Compatibility auto-accept — the token-crossing dial (reuses existing `compat-score.ts`)

Setnayan **already computes** a deterministic vendor × event compatibility score (0–100) — `computeCompatScore()` in [lib/compat-score.ts](apps/web/lib/compat-score.ts), with `explainCompatScore()` giving the "why" drivers. It is per (this vendor × this couple's event), **isolated** (no cross-vendor leaderboard), **fully deterministic**, unit-tested, and free to compute. Weights: style/preference 0.22, budget fit 0.20, distance 0.18, reviews 0.18, date headroom 0.08, faith fit 0.07, trust 0.07 (+ optional First-Look responsiveness blend). Today it's shown to the **couple** only (the "% match" ring); vendors see only their compatibility tags.

**The bot reuses this score as the dial that decides whether to cross the token line:**

- **compat < vendor threshold → pre-acceptance front desk (§ 4).** No accept, no token. Answers public facts, filters low-fit leads.
- **compat ≥ vendor threshold → auto-accept + voice welcome.** Bot accepts (thread un-masks, token burns — held, per fake-inquiry protection), then sends a personalized welcome whose *substance* comes from `explainCompatScore()` reasons ("we cover your venue, we're open on your date, your style matches our editorial work"), rendered in the vendor's voice (Pro). The reasons are deterministic — no LLM needed for the content, only optional voice polish.

**Decision rule (LOCKED 2026-07-18):** auto-accept **iff** `compat ≥ vendor-set threshold` AND **`vendor has an available token`** AND `not flagged` (fake-inquiry backstop) AND `under daily auto-accept cap`. Otherwise → free front desk. **No tokens → no auto-accept** (accept burns a token): the bot keeps answering questions, does *not* accept, and flags the vendor that high-fit leads are waiting and they're out of tokens (a natural top-up nudge). The threshold is **vendor-set**, not a fixed default.

**Grounded guardrails (from how the score actually behaves):**
- **Missing inputs default to a neutral 0.6**, so a sparse Event Brief scores ~60% by default. Set the auto-accept default threshold **above** the neutral baseline — recommend **75–80%** — so auto-accept requires *positive* fit signals, not just the absence of negatives. Warn vendors that a threshold ≤ ~60% effectively auto-accepts low-info/unknown leads and spends tokens on them.
- **Wallet protection:** daily auto-accept cap + a projected-spend estimate in setup ("≥80% ≈ ~N leads/mo ≈ ~N tokens").
- **Isolation satisfied by construction:** the score is already per (this vendor × this event); the bot uses only that pair's score (§ 2A). ✔
- **Vendor-side visibility (LOCKED 2026-07-18):** the vendor **sets the raw % themselves** (a threshold slider), so **show the %** — with tier bands (High/Med/Low) as supporting context. Surface each inbound lead's fit to the vendor too.

**Placement:** Pro feature (advanced automation + it spends tokens on best-fit leads). Free = manual accept + front desk.

**Cost:** evaluating the score at inquiry time ≈ ₱0 (deterministic). The only spend is the vendor's own held token on accept — which the compatibility gate ensures lands on a high-fit lead.

## 5. Intent taxonomy (deterministic triggers)

PH-wedding-vendor tuned; English + Taglish. Each intent → trigger patterns → data source → pre-acceptance? Handoff intents produce no auto-answer.

| Intent | Sample triggers (EN / TL) | Data source | Pre-accept |
|---|---|---|---|
| PRICE | how much, magkano, rate, package price, budget | `vendor_services` pricing math, `vendor_packages` | ✅ |
| AVAILABILITY | available, free on [date], may booking ba, book [date] | availability + `daily_capacity` | ✅ (status only, no hold) |
| INCLUSIONS | what's included, kasama ba, with crew/meal? | `vendor_package_items`, service inclusion fields | ✅ |
| CAPABILITY | do you do, gawa ba kayo ng [category] | `vendor_services` category / `vendor_service_attributes` | ✅ |
| COVERAGE | do you cover [city], pwede sa [venue] | `vendor_coverages` | ✅ |
| LEAD-TIME | this Saturday, next week, rush | recommended/last-minute lead + `last_minute_surcharge_pct` | ✅ |
| DISCOUNT | may discount ba, promo | `vendor_service_discounts` | ✅ |
| SOCIAL-PROOF | reviews, portfolio, sample | `vendor_reviews`, showcase media, `vendor_service_links` | ✅ |
| CUSTOMIZATION | customize, pwede i-adjust, special request | — | ❌ handoff |
| BOOKING | book, reserve, downpayment, how do we proceed | — | ❌ handoff → accept flow |
| UNKNOWN | (no confident match) | — | ❌ handoff (+ optional holding note) |

## 6. Voice-profile schema (Pro)

Derived **once** from the vendor's own sent `chat_messages` (how they actually reply) + their deep-search dossier copy, then **vendor-edited and approved** in a setup screen with a live "preview replies" panel. Stored as `vendor_bot_config.voice_profile` (jsonb):

```jsonc
{
  "greeting": "Hi po!",
  "signoff": "Salamat po! 💛",
  "language_mix": "taglish_light",   // english | taglish_light | taglish_heavy | cebuano
  "honorifics": true,                 // po / opo
  "emoji_level": "light",             // none | light | rich
  "warmth": "friendly",               // concise | friendly | effusive
  "sample_openers": ["Hello po, salamat sa message!"]   // approved
}
```

Free tier renders through a neutral house voice; Pro renders through this profile.

## 7. Reply-template / precompute schema

**Free:** intent → template with `{{slots}}` for injected data (price, date, inclusions). Deterministic fill.

**Pro (precompute-once):** at setup, a **one-time** LLM pass generates ~15–20 natural phrasings per `(intent × service/package)` in the vendor's voice, stored in `vendor_reply_templates.phrasings` (jsonb). Runtime picks one deterministically (rotate to avoid repetition) and injects live numbers — **₱0 at runtime, and still can't misquote** because numbers come from live rows, not the LLM. Regenerate when the vendor materially edits voice or catalog. Same "generate-once, own-forever" pattern as the music/template library.

## 7A. "Deep Search your business" — self-serve account refresh (₱500/run)

**Access point:** vendor dashboard → **Chatbot / Auto-Reply** section (enable/disable, voice profile, compatibility threshold, caps) → contains the **"Deep Search your business"** action.

**What it does:** runs a fresh deep search of the vendor's OWN public internet footprint — reuses [lib/vendor-deep-search.ts](apps/web/lib/vendor-deep-search.ts) (Haiku + web-search, stored in `vendor_web_dossiers`) — and updates their Setnayan account/dossier + the bot's enrichment.

**Broader purpose — the vendor data-gathering / auto-fill engine (owner 2026-07-21):** Deep Search's job is to gather **everything the app needs to know about the vendor** and pre-fill it. From the detected signals (`detected_services`, `price_signals` with source URLs, `business_summary`, `category_match`, `web_presence`, reviews), it drafts the vendor's **profile + store** — identity, service categories, price signals, coverage, portfolio/socials — so onboarding becomes *"review what we found"* instead of a blank multi-screen form (a big win given the supply constraint + the vendor-onboarding redesign).

**🔒 Hard rule — propose, never auto-commit.** Web-detected prices/services are **signals, not truth** (they can be stale or wrong). Deep Search fills them as **confirmable DRAFTS the vendor reviews and edits**; only vendor-**confirmed** data goes live / becomes quotable. This is load-bearing: the chatbot's *cannot-misquote* guarantee (§3) depends on quoting the vendor's OWN confirmed prices — never a raw web scrape. `consistency_flags` surface web-vs-profile mismatches as one-tap "update?" prompts.

**The "What We Learned" review screen (owner 2026-07-21 — "show what we learned").** Deep Search doesn't silently pre-fill — it **shows the vendor everything it learned**, source-attributed and confirmable, turning a blank form into a review (and a trust/delight beat: *"the app already understands my business"*). Grouped findings:
- **Your business** — `business_summary` ("this is who you are — right?").
- **Services we found** — `detected_services` → suggested canonical leaves via `category_match` (drafts `vendor_services` rows: title + `category` + `starting_price_php`; also a second guard against the onboarding wrong-canonical risk).
- **Packages we found** — a detected bundle (name + total, e.g. "Signature Wedding Package ₱85,000") drafts a `vendor_packages` shell. Deep Search rarely finds the full itemization, so it **suggests likely line items from the detected services** and the vendor confirms/completes the breakdown (`vendor_package_items`).
- **Prices we spotted** — `price_signals`, **each with its source link + date** ("₱48,000 — found on your Facebook, Jun 2026"). Marked *"found online — confirm before it goes live."*
- **Your presence** — `web_presence` (site · socials · listings).
- **Reviews** — detected rating/quotes.
- **Mismatches to fix** — `consistency_flags`, one-tap resolve.

Every item carries a **source link + confidence cue**, so the vendor trusts the confident ones and scrutinises the weak ones. Per-item actions: **Confirm / Edit / Dismiss** (+ "confirm all confident"). **Only confirmed items go live / quotable.** Showing the sources is also the hallucination guard — a wrong "learning" is visible and never auto-commits.

**This is the store bootstrap ("get started").** Confirmed findings write the vendor's actual store — `vendor_services` (category + starting price), `vendor_packages` + items, `vendor_coverages`, profile identity — so a vendor goes from nothing to a populated, live store in minutes instead of a manual multi-screen grind. ⚠ Two load-bearing caveats: **(a) confirm-before-live** on everything (packages + prices are commitments); **(b) category mapping is confirmed, not trusted** — `category_match` must land on a **marketplace-visible** leaf (never place a vendor on an unreachable tile — onboarding-verdict §6 wrong-canonical risk), and the vendor confirms it.

### 7A.1 Two refinement signals — Deep Search (web) + deterministic booking-analysis (your reality) (owner 2026-07-21)

Deep Search seeds the store from the *web*; the **deterministic AI then keeps it honest from real closed deals.** Over the vendor's OWN booking history (`event_vendor_packages` + the amounts actually settled), it corrects:
- **Typical close price** — *"your last 8 bookings closed around ₱76–80k; you list ₱85k — update your starting price?"*
- **Popular package config** — *"80% of your bookings include the drone add-on — make it a default inclusion?"*
- **Dead vs live services** — listed-but-never-booked flagged; always-booked promoted.
- **Drift** — seasonal / trending shifts over time.

**Which signal wins:** the booking-analysis is *ground truth* and **outranks stale web data** — a Deep Search price from an old post is superseded by what the vendor actually closes. Both are **deterministic (Rule 1 — tallies, no LLM, ₱0)** and **isolation-safe (the vendor's OWN deals only — never another vendor's;** cross-vendor "vs the market" is the separate, aggregate/anonymized Market Intel / Demand Radar, Pro). Both stay **propose-don't-commit** (the AI suggests; the vendor confirms — they may list high on purpose), gated on a **minimum sample** (≥ ~3–5 closed deals before suggesting). **Timing differs:** Deep Search works day-1 (0 bookings); booking-analysis kicks in as deals accumulate, surfacing the same "review & confirm" nudges in the store editor / a suggestions inbox.

**Price: ₱500 per run (LOCKED 2026-07-18).** Our cost ~₱18–35 → ~93–96% margin, in line with the platform's digital-SKU margins. Each run **learns from the web + updates** the vendor's account/store (propose-don't-commit; the "What We Learned" screen). **Allowance (owner 2026-07-22): Pro & Enterprise include 1 free Deep Search per 28-day cycle; Solo pays ₱500 per run** (no included allowance). Supersedes the earlier "first free with first subscription." Manual onboarding stays free — Deep Search is the paid auto-fill *accelerator*, never required to onboard.

**Benefits copy (vendor-facing, "why repeat this"):**
- Your online reality changes — new reviews, posts, portfolio, promos. A refresh keeps your Setnayan *and* your auto-reply bot current.
- Keeps the bot accurate — it answers couples using the freshest picture of your business.
- Catches mismatches — if your prices/services differ across the web vs your profile, we flag them to fix (consistency = trust = better matching with couples).
- Surfaces new proof — fresh 5-star reviews, features, press to showcase on your profile.
- Refreshes trust + completeness signals that feed your match ranking with couples.
- Re-syncs after you grow or rebrand — new package, new coverage area, new name → one refresh updates everything.
- Spot reputation shifts early — a new negative review to address, or momentum to ride.

**"Keeps you updated" framing:** each run re-pulls your current public footprint and updates your account, so your profile and bot reflect who you are **now**, not who you were at signup. Stale data → stale answers; a fresh scan → accurate, competitive presence.

**Own business vs similar-business trends (isolation-lock boundary — § 2A):**
- **"Deep Search your business" = the vendor's OWN footprint only.** Clean under § 2A. This is the ₱500 action.
- **Industry/market trends = a SEPARATE, clearly-labeled feature, public-aggregate only.** It *can* surface public category + region trends (typical price bands, trending styles, seasonal demand) from public sources — but it must **never** use other Setnayan vendors' private platform data (§ 2A), and even public competitor info stays **aggregate market context**, never a targeted dossier on a named rival. **Reuse/extend the existing Market Intel / Demand Radar / Price-Position (already Pro-and-up)** rather than build a parallel scraper. Keep the two doorways distinct so the isolation story stays crisp: "research me" (₱500) vs "read the market" (Demand Radar, Pro).

## 7B. Sources & Data — what powers the AI (vendor transparency + control)

Accessed from the same Auto-Reply Assistant page (My Shop). A **"What powers your replies"** panel makes every data source visible, fresh-dated, and controllable — satisfying both the isolation lock (§ 2A, shown as a plain guarantee) and RA 10173 data rights.

| Source | What it is | Freshness shown | Controls |
|---|---|---|---|
| **Your store** | catalog · packages · live prices | "edited 3 days ago" | Edit in Store (always on — this is *why* it can't misquote) |
| **Your voice** | learned from your own past replies | "from 214 replies" | View & edit · **Don't learn from my messages** (→ house voice) |
| **Your web dossier** | Deep Search of your public footprint | "refreshed 49 days ago" | View findings · Refresh ₱500 · Clear |
| **Your fit signals** | compatibility tags (ceremony / style) | — | Edit tags |

- **Dossier findings view** — business summary, detected services, price signals with source links, new reviews to showcase, and **flagged mismatches** (e.g. "your FB shows ₱45k, your profile ₱48k — update?") as one-tap fixes. This is *how the vendor accesses the Deep Search results.*
- **Activity log ("what your AI has said")** — every auto-reply + auto-accept, timestamped and AI-labeled: the vendor-side of the § 2B disclosure. Also surfaced in the inbox.
- **Isolation guarantee (shown, not just enforced)** — "Your AI uses only your own business data — never another vendor's or another couple's" (§ 2A made visible).
- **Data rights (RA 10173)** — Download what the AI uses · Turn the AI off · Delete AI data — deep-links to Profile Settings › Privacy & Data (iteration 0025).
- **Update notifications** — the daily briefing + email on Deep Search completion / when a mismatch is found + a "sources changed" note, so the vendor learns of data updates without hunting for them.

## 7C. Event data the AI consumes (the couple side)

The AI is **two-sided**: it reads the **vendor's** own data (§ 7B) *and* the **inquiring couple's Event Brief** — the details the couple already shared by inquiring (date, guest count, venue, budget band, style/preferences, and faith where the couple set it). This is what lets the bot answer "are you free June 14?" and personalize the auto-accept welcome; it is exactly what the deterministic `compat-score` already consumes.

**Scope & isolation (extends § 2A):**
- **Per couple, per thread.** The AI uses *this* couple's event data only, only inside *their* thread. Never another couple's event, never a standing database of couples — cross-couple isolation is as hard as cross-vendor.
- **Only what they shared.** Personalization echoes back only what the couple themselves provided (their date/venue/style) — which reads as attentive, not surveillant. The bot never reveals data the couple didn't share, and never infers new attributes.

**Sensitive data (RA 10173 special category):**
- **Faith/religion** feeds the AI only via the couple's **explicit faith profile → the existing `faithFit` compat signal** — never inferred from other data (mirrors the locked planning-style-personalization governance). Used to *score fit*, not surfaced or quoted back.
- ⚠ **Flag for DPO/counsel:** consuming a couple's faith in a vendor-facing AI reply / auto-accept flow inherits the faith-profile governance — fold into the existing NPC/DPO privacy review, not a silent add.

**Couple transparency (with § 2B):**
- Inquiring already means "share my event details with this vendor to get a response" — the bot uses exactly that, nothing more. The § 2B AI label tells the couple a bot may reply. Couple-side data rights (view/limit what they share, delete) run through the couple's Privacy & Data settings (iteration 0025), same as any other vendor-shared data.

## 7D. Data retention & growth — will it balloon?

**No, if we cap the one thing that grows.** The AI mostly *reads* live data rather than hoarding it, so most of its footprint is bounded:

| Store | Grows with | Size | Limit |
|---|---|---|---|
| Vendor store / catalog | catalog edits | KB | not AI-owned — read live |
| Voice profile (`vendor_bot_config`) | — | ~1 KB / vendor | single row, fixed |
| Precompute phrasings (`vendor_reply_templates`) | catalog size | tens of KB | **overwrite on edit** (cache, not log); ≤ ~20 phrasings per intent×package |
| Web dossier (`vendor_web_dossiers`) | ₱500 runs | ~10–50 KB / run | keep **current + last 3 runs** (or 12 mo) for "what changed"; prune older. Paid action ⇒ naturally bounded |
| **Activity log (`vendor_bot_replies`)** | **every reply** | **~0.5–1 KB / reply** | **the one that balloons — see below** |
| Compat snapshot (on `chat_threads`) | per thread | tiny | one per thread |
| **Couple event data** | — | **~0** | **never stored** — read live per thread (§ 2A / § 7C dividend); only the compat snapshot persists |

**The activity log is the only append-only growth.** A busy vendor at ~100 replies/day ≈ 36k rows ≈ ~30 MB/year; across thousands of vendors, that's the balloon risk. **Limit: keep full per-reply detail for 12 months, then roll up into monthly aggregates** (counts by intent/action, accept rate) and drop the per-row text — analytics stay forever at tiny size while detail growth is capped. Runs on the existing retention-sweep. (Platform retention policy's 5-yr default / 10-yr floor is for *legal* records; a bot reply log isn't one, so a 12-month detail window is appropriate — confirm with DPO.)

**"Too small" isn't a risk either.** The AI's intelligence lives in *live structured data + rules* (store, Event Brief, compat score), not a hoarded corpus — small **is** the design. It doesn't need to accumulate to work well, which is also why it's deterministic and cheap.

**Optional:** show the vendor their AI data footprint + retention in the Sources & Data panel ("~4 MB · activity kept 12 months").

## 8. Free vs Pro split

| Capability | Free (all tiers) | Pro / Enterprise |
|---|---|---|
| Deterministic front desk (price/availability/inclusions/coverage/discount/reviews) | ✅ | ✅ |
| Templated replies (neutral house voice) | ✅ | ✅ |
| Customization/booking → handoff to accept flow | ✅ | ✅ |
| Daily auto-reply cap (vendor-set) | ✅ default ~30 | ✅ higher / uncapped |
| Basic reply log | ✅ | ✅ |
| **Voice-match** (their own speaking style) | — | ✅ |
| **Natural phrasing** (precompute / optional live paraphrase) | — | ✅ |
| **Deep Search your business** (self-serve web refresh, § 7A) | ✅ buy at ₱500/run | ✅ (Pro may include N free refreshes/period) |
| **Reply in the couple's language** (auto-detect) | — | ✅ |
| **Lead analytics** (top questions, drop-off, accept conversion) | — | ✅ |

**Recommended positioning:** free base for every tier (₱0 to run; drives vendor responsiveness → feeds couples, the demand engine); the smart layer is the **headline reason to be on Pro** (₱999 → ₱2,499 upgrade magnet), *not* a standalone ₱1,500 add-on that undercuts Pro. Pricing is ~99% margin either way, so set it by the upgrade behavior you want, not by cost. (See § 9.3.)

## 9. Decisions — RESOLVED 2026-07-18

> **All primary sign-offs locked 2026-07-18.** (1) **Pre-acceptance front desk = YES** — it's the free fallback whenever the lead is below threshold, flagged, over cap, or the wallet is empty. (2) **Voice-match = Pro-only = YES.** (3) **Model = (B) free by capability** — the bot is free for every vendor; Pro buys volume/depth (higher caps, more deep-search runs, analytics). (4) **Deep-search self-serve on own business = YES.** (5) **Compatibility auto-accept** — the **vendor sets the % threshold**; **NO tokens → NO auto-accept**; show the **%** with tier bands as context (§ 4A updated). (6) **AI-disclosure label = LOCKED requirement** (§ 2B). (7) **Deep Search your business = ₱500/run; first run FREE with first subscription purchase** (§ 7A). **Remaining detail only:** exact AI-tag string + first-message notice copy.

**🔄 REVERSAL 2026-07-22 — Vendor AI is now PAID-TIER-GATED, not free-by-capability.** Owner: Vendor AI is a paid-tier benefit — **Solo = Basic · Pro = Medium · Enterprise = Full** Vendor AI. This SUPERSEDES resolution (3) "model (B) free by capability" above (the bot is no longer free for every vendor). Rationale strengthened by Meta charging for its Page AI from 2026-08-01 (~4–5¢/msg) → Vendor AI becomes the subscription's value driver. Capability→tier split + the ~19 free-value features distributed across tiers: see `Vendor_Free_Value_Whats_Next_2026-07-22.md` + the pricing council (running 2026-07-22). ⚠ **Launch nuance:** with vendors free-during-launch, decide whether launch vendors get **Basic AI as an acquisition perk** (recommended — SUPPLY is the bottleneck, only ~4 real vendors) or AI activates only when paid tiers go live. ("Free" still means ₱0-to-Setnayan/deterministic — the reversal is about charging the *vendor*, via tier, not about Setnayan's cost.)

**💰 PRICING STRUCTURE — owner-set 2026-07-22 (base + stackable paid add-ons; supersedes the pricing-council premise).** Vendor AI is a paid **ADD-ON** (tiered +₱500/+₱1,000/+₱1,500 = Basic/Medium/Full). **Naming note (per the locked ladder doc §2):** the *couple-facing front-desk chatbot base* (₱0/reply, "inbox never locked") is **not** "Vendor AI" and **stays free on every tier** (the anti-Bridestory line — couples always get a responsive vendor). **"Vendor AI" (paid) = the *vendor-productivity + bot-enhancement* layer** (Proposal Maker · booking analytics / price-reconciler · coverage signals · voice-match · precompute · in-booth embed). So base alone = the free couple-facing bot but no paid Vendor AI.

> ✅ **RECONCILED 2026-07-22 ("follow the latest") — in sync with the now-LOCKED `Vendor_Subscription_Ladder_2026-07-22.md` §1 matrix.** 🔁 **UPDATE 2026-07-22 (later same day) — TWO reversals, this doc's matrix + bot-protection line below are now STALE: (1) Vendor AI (= the AI Chatbot) is a FLAT ₱1,500/28d add-on, NOT graded 500/1,000/1,500. (2) There is NO free couple-facing base bot — the INBOX is free (couples message, vendor replies by hand) but the AI auto-answer IS the paid ₱1,500 Vendor AI. Also: no external/third-party chatbot sync (cannibalization + leakage + RA 10173). Canonical = the ladder doc §2; treat the rows below as prior-state lineage.** Base ₱1,000/₱2,500/₱8,000 (rounded — ⚠ DB `vendor_billing_catalog` + `Pricing.md §00` still hold ₱999/₱2,499/₱7,999; update owed) · Vendor AI +₱500/+₱1,000/+₱1,500 · 3D Plan ₱1,500 · Photo Challenge ₱400/event · Deep Search ₱500/search (Pro/Ent 1 free/cycle). **Bot-protection question resolved:** the **couple-facing front-desk chatbot base stays FREE on every tier** ("inbox never locked" — the anti-Bridestory line); **"Vendor AI" (paid) = the vendor-productivity + bot-enhancement layer only.** ⚠ **Photo Challenge is a LIVE FAKE DOOR** (advertised in `app/[slug]/page.tsx`, zero game machinery) — **build before selling** (`0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md`).

| Tier | Base /28d | + Vendor AI | + Unlimited 3D Plan | + Photo Challenge |
|---|---|---|---|---|
| **Solo** | ₱1,000 | +₱500 (Basic AI) | — (Pro/Ent only) | — (Pro/Ent only) |
| **Pro** | ₱2,500 | +₱1,000 (Medium AI) | +₱1,500 | +₱400 / event |
| **Enterprise** | ₱8,000 | +₱1,500 (Full AI) | +₱1,500 | +₱400 / event |

Fully-loaded: **Pro = ₱5,000/28d** (2,500+1,000+1,500) +₱400/event · **Enterprise = ₱11,000/28d** (8,000+1,500+1,500) +₱400/event · **Solo = base + AI only** (₱1,500; no 3D/Photo).

**Photo Challenge = Papic-gated (owner 2026-07-22):** the ₱400/event add-on is offered **only when Papic is active on the event** (guest-activated Papic unlocks it) — it's a guest photo-engagement layer on the Papic capture, on **any event type**. Broader framing: **a vendor's toolkit is Papic + Setnayan AI** — capture (Papic, with Photo Challenge) *and* the vendor AI both differentiate the vendor and drive their benefit. Build dependency: Photo Challenge rides Papic infrastructure (0012), not new capture. ✅ **Confirmed 2026-07-22:** the ₱400/event is the **vendor's** cost to *sponsor* Photo Challenge; it requires **Papic active on the event** (once Papic is activated, the vendor can apply); and it is **free & inclusive for the guests/couple** (part of the Papic experience — vendor sponsors, guests play free).

**3D Plan → vendor virtual booth (owner 2026-07-22):** when the 3D Plan is activated (Pro/Ent add-on), the vendor gets a **branded virtual booth inside the couple's 3D Plan** — a promotional surface (matches the parallel ladder doc's "3D booth"). **Net framing: vendors are a distribution channel — they promote Setnayan AI, Papic (+ free Photo Challenge), and the 3D Plan (booth) to their couples** — each differentiates the vendor AND drives Setnayan product adoption. (⚠ 3D-booth economics — sponsored-activation count, "booth renders only when the couple publishes" — live in `Vendor_Subscription_Ladder_2026-07-22.md`; reconcile.) ⚠ **Canonical update owed:** `Pricing.md § 00` + DB `vendor_billing_catalog`. **Open:** (a) launch-timing — Basic AI free during free-during-launch as an acquisition hook? (rec yes, supply is the bottleneck); (b) confirm base-without-the-AI-add-on gets ZERO AI (assumed); (c) ✅ RESOLVED 2026-07-22 — Deep Search = **₱500/search flat, SEPARATE from the AI add-on**; each run learns + updates; **Pro & Enterprise include 1 free/28-day cycle**, Solo pays each.

The original open items are kept below for lineage.

### Original open items (for lineage)

1. **Pre-acceptance bot messages (§ 4).** Allow labeled bot replies in a `pending` thread, scoped to public catalog data, not counting as acceptance and not burning a token / not un-masking the person. This is the load-bearing interaction with the token + masking model. **Recommend: yes** (it filters leads before the token burn).
2. **Voice-match = Pro-only?** Recommend yes.
3. **Pricing (owner asked "what is the correct price?" 2026-07-18).** Recommendation: **no standalone SKU.** Deterministic base = **₱0, free for every tier**; smart layer = **included in Pro (₱2,499/28d) and Enterprise (₱7,999/28d)** as the headline upgrade magnet. Effective price of the AI to a vendor = the **₱1,500/28d Pro-over-Solo delta** (Solo ₱999 → Pro ₱2,499) — which matches the owner's ₱1,500 instinct, but as the Pro delta, not a metered line item. Rationale: ~99% margin (don't undercharge a near-zero-cost feature into irrelevance), a cheap standalone add-on would cannibalize Pro and kill the upgrade lever, and bundling makes Pro's story far stronger ("your inbox answers itself, in your voice, 24/7"). Deep-search self-serve folded into Pro with fair-use (e.g. one refresh/quarter), not metered. If a standalone SKU is insisted on later, price it at ₱1,500/28d so Solo + bot = Pro and it self-funnels to Pro anyway.
4. **Deep-search self-serve gate.** Reusing the admin deep-search for a vendor's *own* business — confirm no new consent/cost gate needed beyond a per-vendor one-time run (it's their own public footprint).
5. **AI-disclosure label (LOCKED — owner-required 2026-07-18, § 2B).** Every bot message is labeled AI-generated to the couple and marked AI in the vendor inbox. Only the exact copy string remains a detail (e.g., "⚡ AI auto-reply · [Business]").
6. **Compatibility auto-accept (§ 4A).** Approve reusing `compat-score.ts` as a vendor-set auto-accept threshold (default 75–80%, above the 0.6 neutral baseline) with daily cap + fake-flag exclusion + hold-and-release. Show vendors a **tier band** (recommended) or the raw %?
7. **Free vs paid — reopened 2026-07-18 (owner: "can we provide this free?").** Two viable models: **(A)** free base + smart layer bundled into Pro (§ 9.3 original rec), or **(B)** *free by capability, Pro by volume/depth* — every vendor gets the full bot free, Pro buys higher caps + more deep-search refreshes + lead analytics. **(B) is affordable: recurring platform cost of giving the whole bot away ≈ ₱0** (deterministic runtime; auto-accept spends the vendor's *own* token, not ours); only a ~₱35 one-time per-vendor onboarding spend (precompute + one deep-search), itself gateable. Tradeoff: (B) forfeits the bot as the Pro magnet, so Pro must lean on its other levers (caps, refreshes, analytics, Market Intel/Demand Radar already Pro-and-up, placement, seats/categories).
8. **Deep Search your business = ₱500/run (owner-set 2026-07-18; § 7A).** Metered depth action, any tier, ~95% margin. Micro-decision: seed one free at signup, or ₱500 from the first run? **Similar-business trends:** keep the ₱500 action strictly own-business (§ 2A); route industry/market trends to a SEPARATE public-aggregate-only feature reusing Market Intel/Demand Radar — never other Setnayan vendors' private data, never a targeted named-competitor dossier. Confirm this split.

## 10. Data-model additions (minimal; RLS vendor-scoped)

- `vendor_bot_config` (`vendor_profile_id` PK/FK, `enabled`, `mode free|smart`, `daily_cap`, `voice_profile` jsonb, `updated_at`) — RLS `current_vendor_ids`.
- `vendor_reply_templates` (`id`, `vendor_profile_id`, `intent`, `service_id?`, `package_id?`, `phrasings` jsonb, `generated_at`) — Pro.
- `vendor_bot_replies` (`id`, `thread_id`, `message_id`, `intent`, `confidence`, `action reply|clarify|handoff`, `was_llm`, `created_at`) — log + cap counting + analytics.
- Column `is_bot boolean` on `chat_messages` (bot replies post as `sender_role='vendor'`, `is_bot=true`, labeled).
- Snapshot on `chat_threads` (or `vendor_bot_replies`): `compat_score_at_inquiry` (int), `compat_reasons` (jsonb) — the deterministic score + `explainCompatScore()` drivers captured at inquiry time, powering the auto-accept decision, the voice-welcome content, audit ("accepted: 84% ≥ 80%"), and analytics. Computed on-the-fly (the score isn't persisted today), vendor-scoped.

Schema lands **first**, RLS at `CREATE TABLE` time, per repo convention.

## 11. Integration points

- Hook on new inbound couple message (server action + cron-free `after()` job). If `enabled` and under cap: classify → answer/clarify/handoff → insert bot `chat_message` (labeled) → increment cap → log in `vendor_bot_replies`.
- **Never** calls the accept action (no token burn, no unmask). Handoff intents flag the thread for the vendor with an optional Pro-drafted suggested reply.
- Insertion surfaces: [lib/chat.ts](apps/web/lib/chat.ts), [app/v/[slug]/inquiry-actions.ts](apps/web/app/v/%5Bslug%5D/inquiry-actions.ts), vendor inbox `app/vendor-dashboard/messages/`.
- Enrichment reuses existing [lib/vendor-deep-search.ts](apps/web/lib/vendor-deep-search.ts) (already Haiku 4.5 + web-search, stored in `vendor_web_dossiers`).

## 11A. Placement — vendor doorway + where the bot appears

**Vendor control home (primary doorway): the "My Shop" menu (owner-set 2026-07-18).** The full chatbot config page lives under **My Shop** (store management) — **not** the dashboard/Home. Rationale: the bot *represents the shop* — it reads the shop's catalog, speaks in the shop's voice, and deep-searches the shop's web presence — so it belongs with store management. Config page holds: enable/disable, voice profile editor + preview, compatibility auto-accept threshold + cap, daily reply cap, **"Deep Search your business"** (₱500, § 7A), and (Pro) lead analytics. (Exact route/slug confirmed at build.)

**Quick access (secondary): Messages header toggle.** A simple **"⚡ Auto-Reply on/off"** toggle in the Messages/Threads header — operational convenience to flip it where the vendor reads the inbox — deep-linking into the My Shop config for full settings.

**NOT on the dashboard/Home (owner-set 2026-07-18).** No Home adoption card. (Reversible later if adoption needs a nudge.)

**Where the bot appears (customer-facing):** **no separate customer button.** The bot replies inside the existing chat thread (`chat_messages` stream) on the couple's inquiry/thread view, each message AI-labeled (§ 2B); on auto-accept it also posts the voice welcome there. The vendor sees the same thread with AI replies marked.

## 12. Cost model

| Item | Cost | Cadence |
|---|---|---|
| Deterministic reply | ~₱0 (DB query) | per reply |
| Precompute phrasings (Pro) | ~₱5–15 | one-time per vendor / on material edit |
| Deep Search your business (self-serve) | cost ~₱18–35, **priced ₱500/run** (~95% margin) | per run, vendor-initiated |
| Optional live-LLM paraphrase | ~₱0.30 (Haiku + prompt cache) | per reply, Pro, cap-bounded |

Even a fully live-LLM Pro tier is ~99% margin (a ₱1,500/28d fee buys ~5,000 Haiku replies; no cap approaches that).

## 13. Build sequence (phased PRs, repo workflow)

> **BUILD STATUS (2026-07-18) → see [Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md](Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md) for the full resume handoff.** Phase 1 ✅ MERGED (#3397). Phase 2 (engine) + 3a (adapter) 🟡 in PR #3399 (CI running), 36 tests green. Phase 3b (live inbox hook) + Phases 4–7 NOT built — fully spec'd in the What's Next doc. All flag-gated (`NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` OFF).

1. **Schema + RLS** — the four additions above.
2. **Deterministic engine** — intent classifier + answer assembly + confidence gate (free tier), behind a flag.
3. **Inbox integration** — hook, labeled bot messages, daily cap, handoff routing.
4. **Vendor setup UI** — enable/disable, daily cap, (Pro) voice profile editor + preview.
5. **Pro layer** — precompute library, self-serve deep-search surface, language auto-detect, lead analytics.
6. **Productivity + conversion (approved 2026-07-18)** — daily overnight briefing, smart inbox triage (reuse `compat-score.ts`), quote/proposal card (reuse Proposal Maker + `chat_messages` proposal cards), appointment proposing (reuse Appointments / `thread_calls`).
7. **Re-engagement (approved 2026-07-18, careful)** — post-event review request, booking-milestone updates, cold-lead nudge (accepted-threads only · opt-in · capped · AI-labeled), price-position insight.

On owner sign-off, record the locked decisions in `DECISION_LOG.md` and add a `changelog.d/` fragment per PR.

## 14. Candidate capability menu (competitor scan 2026-07-18)

Scanned BotCake, ManyChat, Meta Business Agent (2026), service-appointment AI setters, and wedding CRMs (HoneyBook / Nurture Pro / Tripleseat). Tags: **[Core]** free deterministic · **[Pro]** paid depth · **[Later]** phase 2 · **[Careful]** consent/risk · **[Skip]** off-model. All bound by § 2A isolation + § 2B AI-disclosure.

**A. Answer & respond** (largely in plan)
- Auto-reply 24/7 [Core]; FAQ/capability answers [Core]; package recommendation via tally [Core]; reply in the couple's language [Pro].
- *Positioning insight:* wedding-CRM data says **~50% of couples book whoever replies first** — instant auto-reply is a conversion lever, not just convenience.

**B. Qualify & convert** (new, high-value)
- **Use the already-shared Event Brief** [Core] *(owner correction 2026-07-18: NOT a questionnaire)* — the couple's date/budget/guest-count/venue are **already captured at inquiry** (they feed the compat score), so the bot **reads** them and is context-aware from message one — no interrogation, and the auto-accept welcome can reference their real date/venue without asking. Only if a load-bearing field is genuinely missing does it ask one targeted question (rare edge, not a feature).
- **Quote / proposal card** [Pro] — assemble a quote from the vendor's own catalog into the existing `chat_messages` proposal card; reuse the planned Vendor Proposal Maker.
- **Appointment proposing** [Pro] — propose call/meeting slots; reuse Appointments / Relationship Workspace + `thread_calls`.

**C. Follow-up & re-engagement** (proactive — careful)
- **Daily overnight briefing** [Pro, cheap] — "5 inquiries overnight · 2 auto-accepted (high fit) · 1 needs you." Meta is shipping this; deterministic, reuse `vendor_bot_replies` + threads.
- **Cold-lead nudge** [Careful] — gentle, capped, **accepted-threads only** (post-token), opt-in, AI-labeled — never pre-acceptance spam.
- **Post-event review request** [Later] — reuse `vendor_reviews`, deterministic trigger on event-date passed.
- **Booking-milestone updates** [Later] — downpayment received / schedule set; reuse payment + booking data.

**D. Vendor productivity**
- **Smart inbox triage** [Core] — sort/flag inbox by compat score + intent + "needs you"; reuse `compat-score.ts`.
- **Suggested reply (handoff draft)** [Pro] — in plan. **Lead auto-tagging/segmentation** [Pro] — by intent/stage/fit, deterministic.

**E. Intelligence**
- **Lead analytics** [Pro] (in plan) · **Market trends / Demand Radar** [Pro] (public-aggregate only, § 7A) · **Price-position insight** [Pro] — reuse Price-Position.

**Don't copy (off-model):**
- **Mass broadcast / promo blasts** [Careful/Skip] — BotCake/ManyChat's core, but blasting couples fights Setnayan's couple-first, anti-spam ethos + RA 10173 consent. If ever built: opted-in past clients only, consent-gated, hard-capped.
- **Multichannel sprawl (SMS / WhatsApp / IG / FB comments)** [Skip] — not our advantage (SMS locked out of V1); our edge is being *in* the booking flow, not everywhere. Email vendor-notify suffices.
- **Comment-to-DM** [Skip] — that's Meta's channel, not ours.

**APPROVED to build (owner 2026-07-18):** daily overnight briefing (C) · smart inbox triage (D) · **plus the strong candidates** — quote/proposal card, appointment proposing, post-event review request, booking-milestone updates, price-position insight, and cold-lead nudge (with the § C guardrails). Lead-qualification is **not** a new feature — the info is already shared at inquiry, so the bot reads the Event Brief. **NOT building:** mass broadcast, multichannel/SMS sprawl, comment-to-DM.
