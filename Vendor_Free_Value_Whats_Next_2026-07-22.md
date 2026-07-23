# Vendor Free-Value — Build Streams / What's Next (2026-07-22)

> Turns the council verdict ([Vendor_Free_Value_Council_Verdict_2026-07-21.md](Vendor_Free_Value_Council_Verdict_2026-07-21.md) — ~19 free capabilities) into **orchestration-ready build streams** for the master-runbook runner. Design source = that verdict. Repo/workflow facts = [Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md](Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md) §1 (home-rooted repo · `pnpm migration:new` · `tsx --test` · worktree · gh auto-merge). Everything here is **flag-gated (default OFF)**, **propose-don't-commit**, **off the vendor's OWN data**, **deterministic (₱0, no LLM in any hot path)**.

## 0. Status

Nothing built. **Foundation-first:** two shared foundations (FV-F1 tally core, FV-F2 suggestions surface) unblock everything; the 8 feature clusters hang off them. Grounding already verified on `main`: `vendor_services.daily_capacity` ships (mig `20260925000002`), and `vendor_bot_replies.intent` is persisted deterministically by `inbox-hook.ts`.

## 0b. Orchestration metadata (for the multi-stream runner)

```yaml
stream: vendor-free-value            # a CLUSTER of sub-streams
status: not-started
design-source: Vendor_Free_Value_Council_Verdict_2026-07-21.md
external-blockers:
  - none to START FV-F1 / FV-F2 (foundations); every feature stream blocks on them
sub-streams:                         # id · depends-on
  - FV-F1  Booking-Analysis Tally Core (pure lib over event_vendor_packages)     # depends: none
  - FV-F2  Store-Suggestions surface (propose-don't-commit inbox + confirm-writer) # depends: none
  - FV-1   Pricing (drift · effective-price · winning-band · good-better-best)     # depends: FV-F1, FV-F2
  - FV-2   Bundles (co-book · default-inclusion · dead-config)                     # depends: FV-F1, FV-F2
  - FV-3   Catalog & Coverage (missing-service · coverage/event-type expansion · wrong-canonical)  # depends: FV-F1, FV-F2 ⚠ onboarding defect-A
  - FV-4   Planning (seasonal engine · capacity engine)                           # depends: FV-F1, FV-F2
  - FV-5   Lifecycle (shop-readiness ladder · milestone NBA · verification pre-check) # depends: FV-F2 (+FV-F1 for milestones)
  - FV-6   Reputation (proof engine · post-event review nudge)                     # depends: FV-F1, FV-F2
  - FV-7   Conversion (fit-triage · first-response-wins · what-converts · follow-up queue) # depends: FV-F1 ⚠ chatbot inbox
  - FV-8   Hygiene (self-consistency lint · web-vs-store reconciler · staleness nudge) # depends: FV-F2
parallel-safe-with: all unrelated streams (flag-gated). Internally FV-F1 ∥ FV-F2; then features parallelize EXCEPT on shared conflict-surfaces.
conflict-surfaces:
  - vendor_services / vendor_packages(+items) price & category WRITES (FV-1/FV-2/FV-3 all propose edits) — route ALL writes through FV-F2's confirm-writer; never two writers
  - vendor_coverages + vendor_profiles.event_types (FV-3 expansion) — ⚠ SAME propagation as onboarding-redesign DEFECT A; serialize with that stream, ADDITIVE-ONLY (never remove 'wedding')
  - apps/web/lib/vendor-autoreply/* + inbox-hook + chat_threads/chat_messages + compat-score (FV-7 + the intent-log-all refinement) — serialize with chatbot Phase 3b/5
  - the Store-Suggestions surface / store-editor UI (every propose feature renders here) — FV-F2 OWNS it; features add cards, don't rebuild it
reuse-read-only:
  - event_vendor_packages (tally source), compat-score.ts, event-brief, vendor_reviews, vendor_web_dossiers, daily_capacity (verified), vendor-tier-caps.ts, vendor-time-slots.ts, Resend templates
safety-gates:
  - one cluster flag NEXT_PUBLIC_VENDOR_FREEVALUE_V1, default OFF
  - PROPOSE-DON'T-COMMIT — FV-F2 confirm-writer is the ONLY store mutator; features only draft
  - MIN-SAMPLE (~3–5 closes) before any booking-analysis suggestion
  - ISOLATION §2A — own rows only; cross-vendor "vs market" = Pro Market Intel, OUT
  - metered exceptions FENCED: fresh Deep Search = ₱500 (never labelled free); no LLM anywhere (Rule 1); season/bundle labels from a fixed template dict
gap-checks:
  - FV-F1 + FV-F2 merged before any feature stream
  - the confirm-writer is the SOLE store mutator (no feature writes the store directly)
  - FV-3 coordinated with onboarding defect-A (don't double-fix event_types; additive-only)
  - intent logged for ALL inbound couple msgs (not just bot-handled) before FV-7 "what-converts"
```

## 1. Foundations (build first — FV-F1 ∥ FV-F2)

**FV-F1 · Booking-Analysis Tally Core.** A pure, unit-tested lib (same shape as the chatbot engine/adapter) over the vendor's own `event_vendor_packages`: close-price distribution (median / band / tercile), service+add-on co-occurrence, attach-rates, event-type & geo clusters, event-date histogram (seasonal), capacity saturation vs `daily_capacity`, milestone counts. **Input = loaded booking rows** (adapter pattern → fixture-testable). **Output = typed "signals"** the features read. **No writes.** Deterministic, ₱0, min-sample gated.

**FV-F2 · Store-Suggestions surface (propose-don't-commit).** The shared "review & confirm" surface + storage. New `vendor_suggestions` table (RLS vendor-scoped): `type · target (table+row) · proposed_value · source (booking_analysis|deep_search) · confidence · status (pending|confirmed|dismissed)`. The **confirm-writer** is the ONLY code that mutates the store (applies a confirmed suggestion to vendor_services/packages/coverages). Surfaces as cards in the store editor + a suggestions inbox; reuses the "What We Learned" card pattern (build-plan §7A). Every feature EMITS suggestions here; nothing else writes the store.

## 2. Feature streams (each hangs off FV-F1 + FV-F2)

| Stream | Builds (council items) | Powered by | Key reuse | Its conflict slice |
|---|---|---|---|---|
| **FV-1 Pricing** | Booking-Drift Reconciler · Effective-Price/Silent-Discount · Winning-Band Confidence · Good-Better-Best | booking_analysis | FV-F1 distribution/tercile; chatbot PRICE-intent assembly (Winning-Band feeds the bot) | `vendor_services`/`vendor_packages` price writes → confirm-writer only |
| **FV-2 Bundles** | Co-Book Discoverer · Default-Inclusion Promoter · Dead-Config Flag | booking_analysis | FV-F1 co-occurrence/attach-rate; `vendor_packages`+items writer (via FV-F2) | `vendor_packages(+items)` writes → confirm-writer only |
| **FV-3 Catalog & Coverage** | Missing-Service Finder · Coverage & Event-Type Expansion · Wrong-Canonical Remap | both | `vendor_web_dossiers`, `category_match`, canonical leaf registry | ⚠ `vendor_coverages`+`event_types` = onboarding defect-A — serialize, additive-only |
| **FV-4 Planning** | Seasonal Engine (4 faces, 1 histogram) · Capacity Engine (saturation+guard+lead-time) | booking_analysis | FV-F1 date-histogram + saturation; `daily_capacity`, `vendor_service_discounts` (surcharge) | availability handler (§7B) — coordinate |
| **FV-5 Lifecycle** | Shop Readiness Ladder · Milestone NBA (5-deal unlock) · Verification Pre-Check | booking_analysis (store-state) | `vendor_profiles/services/coverages/packages` presence; FV-F1 counts | low — read-mostly + FV-F2 cards |
| **FV-6 Reputation** | Proof Engine (showcase+pull-quote+gap-meter) · Post-Event Review Nudge | both | `vendor_reviews`, `event_vendor_packages` frequency, Resend template | low |
| **FV-7 Conversion** | Fit-Ranked Triage · First-Response-Wins · What-Converts · Follow-Up **queue only** | booking_analysis | `compat-score.ts`, `chat_*` timestamps, `vendor_bot_replies.intent` | ⚠ inbox-hook + chat surfaces = chatbot Phase 3b/5 — serialize |
| **FV-8 Hygiene** | Store Self-Consistency Lint · Web-vs-Store Reconciler · Staleness Refresh Nudge | store-lint / deep_search | store rows only; `vendor_web_dossiers.consistency_flags` | low |

## 3. Guardrails (cluster-wide — every stream inherits)

Propose-don't-commit (confirm-writer is the sole mutator) · min-sample gate · isolation (own rows only) · **metered exceptions fenced** (fresh Deep Search = ₱500, off-platform review count = ₱500, cross-vendor = Pro/OUT) · **no LLM in any hot path** (season/bundle names from a fixed template dictionary) · one flag OFF.

## 4. Owner sign-offs (carried from council §4)

- Store-lint counts as "own-data free" though it uses neither engine (recommend yes).
- Seasonal/bundle labels from a fixed template dictionary, never LLM. Confirm the label set.
- Refresh-nudge nag ceiling (it *sells* a ₱500 run — must read as warranted, not upsell).
- Follow-up stays **queue-only** (no auto-drafted text).
- **Refinement:** log intent for EVERY inbound couple message (not just bot-handled) before FV-7 "What-Converts" — deterministic + ₱0.

## 5. Resume / orchestration

**Build order:** FV-F1 ∥ FV-F2 (foundations, parallel) → then feature streams, parallelizing disjoint ones and **serializing on the shared writer + the coverage/inbox surfaces**. Per stream: fresh worktree/branch off latest `main` → build → `tsx --test` → **adversarial Workflow verify** → `changelog.d/` fragment → `gh pr create` + `gh pr merge --auto --merge` → gap-check → next. Flag `NEXT_PUBLIC_VENDOR_FREEVALUE_V1` stays OFF until wired + an activation call.
