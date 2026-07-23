> Filed to corpus · council run `wf_bf92bd98-824` · 8 design lenses + adversarial synthesis judge · 46 raw ideas → ~19 distinct capabilities. Companion to Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md §7A/§7A.1.

# Council Verdict — Free Vendor-Value from the Vendor's Own Data
**Setnayan vendor platform · synthesis judge ruling · 2026-07-21**

Scope recap: what Setnayan can proactively do **for a vendor, for ₱0, off the vendor's OWN data**, driven by how the business progresses. Two engines only — **Deep Search** (metered ₱500/run, the sole paid exception) and **deterministic booking-analysis** (free ground truth). 46 raw ideas came in across 8 lenses. After dedupe the real count is ~19 distinct capabilities. This verdict rejects/merges the majority and racks the survivors on a stage ladder.

---

## 1. The adversarial pass — merges & rejections

### 1a. Hard rejections / re-classifications

| Idea | Ruling | Reason |
|---|---|---|
| **Deep-Search Store Bootstrap** (lifecycle) | **NOT FREE + NOT DETERMINISTIC — reclassified** | Self-admits `deterministic:false`. It IS the ₱500 metered run (first free with first subscription). It is the sanctioned exception, not a free capability. Keep it — but it lives in the "valuable, not free" section, never sold as free. |
| **Cadence-Timed Follow-Up Queue** (conversion) | **PARTIAL REJECT** | The idle-detection + win-cadence timing is free/deterministic and survives. The "pre-drafts the follow-up from prior sent messages / voice_profile phrasing" is text generation — if that touches an LLM in the hot path it violates Rule 1. Ships as a **queue only** (surfaces the thread + timing); any drafting is out of scope for free. |
| **Store Self-Consistency Lint** (hygiene) | **KEEP w/ scope flag** | Genuinely ₱0 and isolation-safe, but it uses **neither** named engine — it's store-internal integrity lint. Owner must confirm it belongs under the "own-data free" umbrella. Recommended keep; it's the cheapest, safest item in the whole set. |

No isolation violations found — every survivor reads only the vendor's own rows. (Cross-vendor "vs the market" was correctly kept OUT by all lenses; that's Pro Market Intel, not free.)

### 1b. Dedupe map — 46 → 19

| Canonical survivor | Absorbs (duplicate/near-duplicate raw ideas) |
|---|---|
| **Booking-Drift Price Reconciler** | Close-Price Correction · Booking-Drift Price Reconciler |
| **Web-vs-Store Price Reconciler** | Web-vs-Reality Price Mismatch · Web-vs-Platform Consistency Reconcile · Consistency-Flag Resolver |
| **Co-Book Bundle Discoverer** | Co-Book Bundle Discoverer · Co-Book → New Bundle |
| **Default-Inclusion Promoter** | Default-Inclusion Promoter · Add-On → Default Inclusion |
| **Dead-Config Flag** | Dead-Config Retirement · Dead-Listing Flag |
| **Shop Readiness Ladder** | Shop Readiness Ladder · Missing-Field Completeness Meter · Profile Completeness Trust Nudge |
| **Missing-Service Finder** | Missing-Service Finder · (day-1 slice of Deep-Search Bootstrap) · Web-Advertised Bundle Importer · Day-1 Price Seed |
| **Coverage & Event-Type Expansion** | Coverage & Event-Type Expansion · Tier-&-Reach Fit Signal (reach half) |
| **Seasonal family** (one feature, one histogram) | Own-History Seasonal Demand Curve · Seasonal Price Drift/Peak Premium · Seasonal Bundle Assembler · Slow-Season Fill Prompt |
| **Capacity family** (one saturation model) | Capacity Saturation Map · Over-Capacity Guard at Accept · Lead-Time Tuner |
| **Proof family** | Best-Booked Proof Showcase · Verified-Review Pull-Quote Placement · Review Coverage Gap Meter · New-Proof Surfacer |
| **Staleness Refresh Nudge** | Dossier Staleness Refresh Nudge · Stale-Dossier Refresh Nudge |

Everything else (Winning-Band Confidence, Effective-Price Detector, Good-Better-Best, Milestone NBA, Wrong-Canonical Remap, Verification-Readiness Pre-Check, Fit-Ranked Inbox Triage, First-Response-Wins, What Converts For You, Post-Event Review Nudge, Reviews-vs-Reality Responsiveness, Store Self-Consistency Lint) stands as distinct.

---

## 2. The FREE Vendor-Value Ladder

### 🌱 DAY-1 — 0 bookings, Deep-Search seeds
The vendor has no settlement history yet. Value comes from their own public footprint (metered) + store-shape checks (free).

| Capability | Powered by | What it does | Trigger | Reuse | Guardrail |
|---|---|---|---|---|---|
| **Shop Readiness Ladder** | booking_analysis (store state) | Names the single next missing rung to get visible — priced service → coverage → logo → package → **"complete but public_visibility OFF"** terminal rung. One action, never a wall of red. | day-1, re-eval on every store edit | `vendor_profiles`, `vendor_services`, `vendor_coverages`, `vendor_packages` | Free · propose · attacks the "built but invisible on /explore" supply defect |
| **Missing-Service Finder** | deep_search | Diffs stored dossier `detected_services` vs actual `vendor_services`; drafts confirmable rows (title + canonical leaf + source-linked price) for services on the vendor's own site not yet listed. | day-1 + each refresh | `vendor_web_dossiers`, `vendor_services`, §7A "What We Learned" screen | Reads last dossier free; **fresh detection needs the ₱500 run** · confirm-before-live |
| **Wrong-Canonical Remap** | both | Detects services mapped to a dead/unreachable marketplace leaf and proposes a valid target leaf so the vendor isn't stranded on an empty tile. | day-1 category_match; again on booking mismatch | `category_match`, canonical leaf registry, `vendor_services.category` | Booking corroboration is free; category_match half needs a dossier · propose · **directly fixes the empty-tile defect** |
| **Fit-Ranked Inbox Triage** | booking_analysis | Sorts open inquiry threads by deterministic compat fit instead of newest-first; pins high-fit unanswered leads with a one-line "why hot" chip. | fires on every inbound thread | `compat-score.ts` / `explainCompatScore()`, `chat_threads` snapshot, event-brief | Free · isolation-safe (own store vs each brief) · propose (sort only) |
| **Verification-Readiness Pre-Check** | both | Confirms all required fields present before a vendor hits the ~8/day admin verify queue, so nothing bounces on missing basics. | on "submit for verification" | field-presence over profile/services/coverage; optional dossier corroboration | Deterministic pre-check free; "prove it's real" corroboration is **opt-in ₱500**, never required |

### 📈 GROWING — bookings accumulate (≥3–5 closed deals), booking-analysis switches on

| Capability | Powered by | What it does | Trigger | Reuse | Guardrail |
|---|---|---|---|---|---|
| **Milestone Next-Best-Action** | booking_analysis | Celebratory nudge + one next step at each threshold; the load-bearing one at ~5 deals: **"you now have enough real deals to refine prices/defaults"** — the meta-nudge that unlocks the whole growing tier. | milestone crossings (1st/5th/10th booking, 1st review) | `event_vendor_packages` count, `vendor_reviews` count | Free · propose · gives progression a heartbeat |
| **Booking-Drift Price Reconciler** | booking_analysis | Tallies settled amounts vs listed starting price; when close-band drifts past threshold ("last 8 closed ~₱76–80k, you list ₱85k") proposes a one-tap update. | after ≥3–5 closes, re-checks per settlement | `event_vendor_packages` vs `vendor_services`/`vendor_packages` | Free · min-sample gate · propose — **stops the store and bot quoting a price nobody pays** |
| **Effective-Price / Silent-Discount Detector** | booking_analysis | Flags (a) line items that never close at list — the list price is fiction; (b) add-ons that co-book ≥X% yet priced as cheap extras — effectively bundled and underpriced. | after ≥5 closes containing the item | line items in `event_vendor_packages`, `vendor_service_discounts` | Free · propose · distinct from drift (margin-leak, not drift) |
| **Web-vs-Store Price Reconciler** | both | Surfaces dossier `consistency_flags` ("FB ₱45k / profile ₱48k / you close ₱52k — align?") as one-tap fixes; writes only the confirmed value. | on-mismatch, per refresh | `vendor_web_dossiers.consistency_flags`, store rows | Resolving existing flags is **free**; generating new ones needs a ₱500 run · propose |
| **Co-Book Bundle Discoverer** | booking_analysis | Pairwise/triple co-occurrence tally over own closed deals; drafts a NEW `vendor_packages` skeleton pre-filled from service sets that keep selling together but have no formal bundle. | after ~3–5 deals show a stable co-book set | `event_vendor_packages` tally → `vendor_packages`+`items` writer | Free · price left blank for vendor · propose |
| **Default-Inclusion Promoter** | booking_analysis | When an add-on appears in ~80%+ of a package's closes, proposes folding it into the base inclusions and its price into the headline. | on attach-rate threshold, ≥3–5 closes of the package | `vendor_package_items` attach-rate | Free · propose — **stops chronic under-quoting** |
| **Dead-Config Flag** | booking_analysis | Flags services/packages/add-ons with zero attributions after a dormancy window while siblings sell; proposes hide/demote/merge. Never deletes. | dormancy window with 0 books | booking counts, `is_active` flag | Free · propose · keeps catalog + bot lean |
| **Coverage & Event-Type Expansion** | booking_analysis | Counts closes by event_type & location vs listed types/coverage; proposes adding a type ("8 debuts booked → add debut") or extending radius ("5 jobs in Cavite outside your reach"). | ≥3–5 closes cluster in an unlisted type/geo | `event_vendor_packages`↔`events`, `vendor_profiles.event_types`, `vendor_coverages` | Free · propose · **attacks the non-wedding-vendor-invisible gap** |
| **Post-Event Review Request Nudge** | booking_analysis | When a booking's event_date passes, one-tap deterministic email review request to that couple (skips already-reviewed). | after each event with a past date | `event_vendor_packages` + `vendor_reviews` + Resend template | Free · deterministic template (no LLM) · propose |
| **First-Response-Wins Nudge** | booking_analysis | Computes the vendor's own median first-reply latency (human messages only), pushes when a high-fit thread idles past it. | hot thread crosses idle threshold | `chat_messages` timestamps (exclude bot), compat snapshot | Free · propose · own-latency baseline only |
| **Cadence-Timed Follow-Up Queue** *(queue only)* | booking_analysis | Queues warm-but-quiet threads for follow-up timed to the vendor's own median days-to-close. **Drafting stripped** per §1a. | thread quiet past own re-contact window | `chat_messages` last-sender, `event_vendor_packages` win cadence | Free · propose · **no auto-generated message text** |
| **Store Self-Consistency Lint** | *neither engine (store lint)* | Internal integrity: package priced below item minimums, add-on pointing at a retired service, coverage radius 0, active service with no price, duplicate titles. One-tap fix/dismiss. | on store-edit save + periodic sweep | store rows only | Free · isolation-safe · **owner sign-off: confirm it counts as "own-data free"** |

### 🌳 ESTABLISHED — strong patterns (≥6–12 deals)

| Capability | Powered by | What it does | Trigger | Reuse | Guardrail |
|---|---|---|---|---|---|
| **Winning-Band Confidence** | booking_analysis | Measures how tightly closes cluster; a tight band ("₱78k ±₱2k, 9 of 11") lets the front-desk bot volunteer a **firm** number; a scatter tells it to quote a range and hand off. | ≥5 closes, recomputed per settlement | `event_vendor_packages`, chatbot PRICE-intent assembly | Free · propose · own distribution only |
| **Good-Better-Best Ladder Builder** | booking_analysis | Tercile-splits own closed amounts into low/mid/high clusters, drafts three package skeletons anchored to real price points the vendor already wins at. | ~6–9 deals so terciles are meaningful | settled amounts + line items, `vendor_packages` writer | Free · deterministic bucketing (no LLM) · propose |
| **Seasonal Engine** *(one histogram, four faces)* | booking_analysis | 12-month demand curve from own event_dates → (a) busy/slow map, (b) peak-premium proposal where Dec/Feb already close ~12% high, (c) slow-season fill prompt, (d) seasonal bundle skeleton timed to the run-up. | seasonal, ≥8 deals spanning the calendar | `event_vendor_packages`↔event_date, `vendor_service_discounts` (surcharge), `vendor_packages` | Free · propose · **bundle NAME must be a deterministic season-template label, not LLM copy** |
| **Capacity Engine** *(saturation + guard + lead-time)* | booking_analysis | Month-by-month saturation vs `daily_capacity` ("full in Dec, open in Jan"), an over-book **warning** (not block) at accept, and a lead-time setting tuned to real median booking-advance. | new confirmed booking / on accept / lead-time drift | `event_vendor_packages` vs `daily_capacity` (§7B availability handler) | Free · propose/warn · vendor overrides retained |
| **What Converts For You** | both | Joins own closed deals back to originating threads; tallies won/lost by response-latency band, first-message intent, first service asked. "Threads answered <1h booked 3.1×." | after a handful of won + lost threads | `event_vendor_packages` outcome, `chat_messages` + intent tags | Free · isolation-safe (own inbox, **no cross-vendor benchmark**) · propose |
| **Proof Engine** *(showcase + pull-quote + gap meter)* | both | Pins the actual most-booked package as "most-booked" proof; matches the top-band review verbatim to the exact package it praises; meters closed-bookings-vs-reviews and offers batch requests. | after N closes / new 5-star / on-mismatch | `event_vendor_packages` frequency, `vendor_reviews`, `vendor_packages` | On-platform tallies free; off-platform review count needs a ₱500 run · propose |
| **Tier-&-Reach Fit Signal** | booking_analysis | When bookings land outside coverage, categories exceed the tier cap (silently hidden), or volume brushes a slot limit, proposes a coverage edit or a fitting tier. **Never changes billing.** | established, ≥5 deals + coverage mismatch | `event_vendor_packages`, `vendor_coverages`, `vendor_billing_catalog` bounds (own tier) | Free · propose · non-salesy, self-evident |
| **Reviews-vs-Reality Responsiveness Flag** | deep_search | Reconciles responsiveness signals in own public reviews ("slow to reply") against measured in-app latency; proposes the front-desk bot / SLA auto-ack as the one-switch fix. | day-1 dossier + on refresh | dossier reviews + `chat_messages` latency | Cached read free; **fresh review signal needs ₱500** · propose |

---

## 3. TOP 6 — highest impact × most buildable, genuinely free

1. **Shop Readiness Ladder** — turns the platform's #1 supply defect (fully-built-but-invisible shops) into one obvious next click. Pure store-state read, zero new infra, day-1 value.
2. **Booking-Drift Price Reconciler** — the flagship of the free engine: the store and the front-desk bot stop quoting a list price nobody pays. Reuses the exact §7A.1 tally.
3. **Milestone Next-Best-Action (5-deal unlock)** — the meta-nudge that switches the whole booking-analysis tier on; cheap counters, load-bearing for everything downstream.
4. **Coverage & Event-Type Expansion** — grows discoverability to where the vendor already wins; the only free lever that directly attacks the *non-wedding-vendor-invisible* gap.
5. **Co-Book Bundle Discoverer + Default-Inclusion Promoter** (pair) — converts emergent buying patterns into sellable, bot-quotable bundles and stops chronic under-quoting; both are pairwise tallies over rows already in hand.
6. **Fit-Ranked Inbox Triage + First-Response-Wins Nudge** (pair) — pure reuse of `compat-score.ts` and message timestamps; in a race where first human reply wins the booking, the best-fit lead never goes cold. Nothing new to build.

Runner-up worth flagging: **Store Self-Consistency Lint** — the single cheapest, safest, always-on item; the only caveat is it uses neither named engine (owner call).

---

## 4. Open questions / owner sign-offs

1. **Store Self-Consistency Lint scope** — it's ₱0 and isolation-safe but uses *neither* Deep Search nor booking-analysis. Does "free vendor value from own data" include store-internal lint? (Recommend yes.)
2. **`daily_capacity` existence** — ✅ **RESOLVED 2026-07-22 (verified on `origin/main`):** real shipped column — `20260925000002_vendor_services_daily_capacity.sql` adds `vendor_services.daily_capacity INT` ("tier feature #2"; `finalizeVendor` enforces same-date confirmed-bookings < it), already consumed by `vendor-tier-caps.ts` / `vendor-time-slots.ts` / the auto-reply adapter. **Capacity Engine = genuine reuse.**
3. **Intent tags for "What Converts For You"** — ✅ **RESOLVED 2026-07-22 (verified):** `vendor_bot_replies.intent` (Phase-1 column) is written deterministically by the merged `inbox-hook.ts` (`intent: decision.intent`, both insert paths) — no LLM at read time. ⚠ **Refinement:** intent is logged only when the bot *processes* a message (flag-on, couple messages it handles). To power "What Converts" across ALL inquiries, classify + log intent for **every inbound couple message even when the bot doesn't reply** (deterministic + ₱0, so cheap) — otherwise the sample is bot-handled threads only.
4. **Follow-up drafting** — approved as a **queue only**. Confirm no auto-generated message text ships under the free banner (any `voice_profile` phrasing that hits an LLM breaks Rule 1).
5. **Season-template naming** — the seasonal bundle label must come from a fixed template dictionary ("Ber-Months Package"), never an LLM. Confirm the label set.
6. **Refresh-nudge frequency** — Staleness Refresh Nudge is free, but it *sells* a ₱500 run. Owner must set the nag ceiling so it reads as "warranted," not "upsell spam."

## 5. Valuable but NOT free — do not smuggle in as free

| Capability | Why it's metered |
|---|---|
| **Deep-Search Store Bootstrap** | Self-admits `deterministic:false`. It **is** the ₱500 run (first free with first subscription). The single most powerful cold-start lever — but it is the sanctioned paid exception, marketed as such, never as "free." Every draft still lands confirm-before-live. |
| **Fresh Web-vs-Store / Missing-Service / Wrong-Canonical / Reviews-vs-Reality signals** | The *reconcile logic* is ₱0, but generating a **new** dossier to reconcile against costs ₱500. Rule: resolving the existing backlog is free; producing a fresh finding is metered — always name the run cost when the dossier is stale. |
| **Off-platform review count** (in Proof Engine / Review Gap Meter) | On-platform gap is free; the external review tally is only current after a ₱500 run. |
| **Cross-vendor "vs the market"** | Explicitly OUT — that is Pro Market Intel / Demand Radar (§isolation). Never fold it into the free tier. |

**Bottom line:** of 46 raw ideas, ~13 collapse into duplicates, 1 is reclassified as paid (Bootstrap), 1 is trimmed (Follow-Up drafting), leaving **~19 distinct free capabilities** that all clear the five hard filters. The free engine's spine is the deterministic booking-analysis tally — it does the heavy lifting once ~5 real deals exist; Deep Search is the day-1 seed and the periodic (paid) refresh, never the free hot path.