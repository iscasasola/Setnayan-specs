# Setnayan Wedding Planning Reference + Setnayan Concierge SKU

> Master reference for the Plan Builder's category sequence, importance tiers, per-head budget allocation per couple's tier, sub-event + sibling-event handling, post-wedding coordination, vendor registration schema, and representative PH wedding venue inventory. **Simplified 2026-05-17 to single-SKU model + 3-day card-less trial + tiered abuse enforcement (supersedes the 2026-05-16 2-tier ladder); DIY remains free default.** Companion HTMLs: `0016_plan_builder_prototype.html` (main), `0016_guided_vs_diy_flow.html`, `0016_venue_food_flow.html`.

---

## 0. Access Model — DIY vs Setnayan Concierge (Locked 2026-05-17)

The wedding-planning content in Sections 1–N below describes Setnayan's complete planning system. **Couples access this content in one of two modes**, simplified 2026-05-17 (supersedes the 2026-05-16 2-tier ladder which retired the Essentials SKU same-week; see CLAUDE.md decision log second 2026-05-17 row for the full rationale):

### DIY mode (free, default for every event)

- **Cost:** Free. No purchase required.
- **What couples see:** Full access to every dashboard surface — guest list, vendor tracker, budget, seating chart, mood board, etc. The planning categories from Section 1 are organized as a 10-tile launcher on iteration 0021's dashboard.
- **What couples DON'T see:** No active timeline, no deadline alerts, no daily nudges, no vendor-pick recommendations matched to event style, no step-by-step roadmap. Couples discover and navigate the tools on their own.
- **Switch to Concierge:** Anytime from Settings → Setnayan Concierge OR via the upgrade banner on the dashboard. Couples can also start a card-less **3-day free trial** of Concierge without paying — see the Trial subsection below — provided their account hasn't already used a trial AND isn't under abuse enforcement.

### Setnayan Concierge (paid · single SKU · wedding-anchored access)

| SKU | Access duration | Price | Features |
|---|---|---|---|
| `concierge_complete` | **Wedding-anchored** — `LEAST(wedding_date + 30 days, activation + 24 months)`, min `activation + 12 months` | **₱2,499** | Full 9-step roadmap · daily nudges · priority vendor matching · honeymoon planning included |

**Access duration is wedding-anchored** (locked 2026-05-17 third decision-log row). Every paying couple gets:
- A **12-month floor** from activation — so couples who haven't entered a wedding date yet, OR couples with a very-soon wedding, still receive a full year of Concierge access (including post-wedding tail).
- A **24-month cap** from activation — so couples with long engagements (e.g., 3-year-out weddings) don't get an unbounded ₱2,499-for-5-years experience. The cap protects per-event economics; long-engagement couples receive a one-time advisory to renew closer to the wedding (see below).
- Between those bounds, access runs until `wedding_date + 30 days` — so couples planning 18 months out get 18.5 months of access (with the post-wedding tail), couples planning 8 months out hit the 12-month floor.

**Access-duration examples:**

| Wedding from activation | `concierge_expires_at` | Notes |
|---|---|---|
| Not yet entered (NULL) | activation + 12 months | Default; recomputes when date is set |
| 3 months | activation + 12 months | 12-month floor wins · couple gets ~9 months post-wedding tail |
| 8 months | activation + 12 months | 12-month floor |
| 12 months | wedding + 30 days (≈ 12.5 months from activation) | Wedding+30 wins |
| 18 months | wedding + 30 days (≈ 18.5 months) | Wedding+30 |
| 24 months | activation + 24 months | 24-month cap |
| **36 months** | **activation + 24 months** | **Cap · couple sees long-engagement advisory** |

**Pricing rationale (locked 2026-05-17).** ₱2,499 lands in the "wedding-line-item reasonable zone" (₱3,999–7,999) alongside invitation suites, prenup shoots, custom monograms, and premium wedding websites — where Filipino couples already spend without blinking. **5× cheaper than the cheapest human wedding coordinator** (₱25,000+) — the strongest single anchor in the marketplace comparison set. **Single SKU (not a tier ladder)** signals product confidence — the Apple iPhone playbook (one price per model · optional add-ons not optional tiers), not a SaaS discount stack. The 2026-05-16 ₱2,499 Essentials tier was retired same-week: it projected to under-convert vs Complete (the ₱500/6-month savings math didn't anchor) and added a "save face" branch that diluted the premium-product framing. Net revenue per Concierge customer is now uniformly ₱2,499.

**What couples get:**
- 9-step expert roadmap (the Locked Sequence in § 1) walked through step-by-step instead of self-serve
- Smart timeline auto-built from wedding date + venue book date + lead-time matrix
- Deadline alerts (in-app + email per iteration 0028) at T-90, T-30, T-7, T-1 day per category
- Priority vendor picks matched to event style + budget tier (pulls from iteration 0006 marketplace; ranks by 0010 Mood Board palette match) — verified-badge vendors surface first
- Daily nudges on the "next thing to do" pinned at the top of iteration 0021 dashboard
- Post-wedding coordination prompts (per § Post-event content below) — marriage certificate pickup, thank-you cards
- Honeymoon planning surface (Concierge's 12-month runway covers the post-wedding tail)

**Pre-paid blocks** — V1 uses one-time payment via apply-then-pay (BDO + GCash). No recurring auto-renewal. Couples can re-purchase after expiry — the dashboard "Reactivate" CTA leads to checkout. **Re-purchase is always at the full ₱2,499** (locked 2026-05-17 follow-up) — no loyalty discount, no extension-rate, no returning-customer SKU. Each purchase is treated as a fresh activation: extends `concierge_expires_at` per the wedding-anchored formula using the new activation moment as the anchor.

**Auto-renew lands at V1.5** — pending GCash Merchant API approval. Until then, manual renewal via the Settings → Setnayan Concierge "Buy Another Plan" CTA.

**Access doesn't end at the wedding date.** The 30-day post-wedding extension built into the formula above gives every couple a tail for marriage-certificate pickup, thank-you cards, and honeymoon coordination. Couples with engagements ≤ 12 months get longer post-wedding tails because the 12-month floor adds runway beyond `wedding+30`.

**Wedding-date update behavior (extend-only).** If the couple updates `events.wedding_date` after activation, `concierge_expires_at` recomputes per the formula above — **but only extends, never shrinks**. A couple who postpones their wedding gets more runway automatically. A couple who moves their wedding earlier keeps the original `expires_at` value (they already paid for that runway). The recomputation fires from the `events.wedding_date` update trigger via `recompute_concierge_expiry(event_id)`.

**Long-engagement advisory (one-time).** When `wedding_date` is set or updated to a value more than 24 months from `concierge_activated_at`, a one-time in-app + email advisory fires (per 0028):

> *"Your wedding is more than 24 months away. Setnayan Concierge covers up to 24 months from your purchase date — you'll lose access ~{N} months before your wedding day. We recommend renewing closer to your wedding for full coverage."*

The advisory is stamped on `events.concierge_long_engagement_advised_at` to prevent re-fire on subsequent date updates. Couples who postpone past 24 months again later see the advisory once per advisory-firing transition (not every save).

### 3-day card-less free trial (locked 2026-05-17)

Replaces the 2026-05-16 7-day per-event preview. **No charge. No card required. No bait-and-switch.**

- **One trial per account** (not per event). Tracked on `users.concierge_trial_used_at`. Closes the prior loophole where a couple could create Event A, exhaust trial, then create Event B for another trial on the same account.
- Couples in DIY mode can start a trial from the dashboard upgrade banner OR Settings → Setnayan Concierge OR the inline "Not ready to commit? Try 3 days free →" link below the choice card (per iteration 0000 § 2.5b).
- Trial surfaces the **full Concierge feature set** (9-step roadmap, daily nudges, priority vendor matching, honeymoon planning) for 3 days.
- A persistent banner above the dashboard reads: *"Trial · X days left → Continue with Setnayan Concierge (₱2,499)"*.
- At T+3 the daily expiry-sweep cron flips `concierge_status = 'expired'` and the event returns to DIY (all planning progress preserved — the 9-step journey rows in `event_journey_steps` remain populated).
- **Trial-start gating** — the `start_concierge_trial(event_id)` server action is blocked when ANY of:
  - `users.concierge_trial_used_at IS NOT NULL` (already used)
  - `users.concierge_enforcement_level IN ('trial_banned', 'full_banned')` (under enforcement)
  - Cross-account similarity check fires (see next subsection) — trial-start blocked AND flag inserted into `concierge_abuse_flags`

### Anti-abuse — tiered enforcement on multi-account trial cycling (locked 2026-05-17)

The 3-day trial is generous, but the multi-account abuse vector is real: a single person could create N accounts with near-identical wedding profiles to harvest N×3 days of free Concierge. The framework below catches that without permanently banning legitimate edge cases (sibling couples · wedding-planner agencies managing multiple clients · same venue + different couples on different dates).

**Detection — runs on trial-start attempt only** (cheapest detection path; doesn't run on every event create). When a new account calls `start_concierge_trial(event_id)`, similarity check executes against the full set of `users.concierge_trial_used_at IS NOT NULL` accounts using these weighted signals:

| Signal | Weight | Source |
|---|---|---|
| Same `wedding_date` (exact match) | High | `events.wedding_date` |
| Same venue name (fuzzy match · token-set ratio ≥ 0.85) | High | `events.venue_name` |
| Same venue address | High | `events.venue_address` |
| Same couple-name overlap (full-name token match ≥ 0.6) | High | `events.event_name` / `users.full_name` |
| Same phone number across accounts | **Critical · auto-flag** | `users.phone` |
| Same payment-method fingerprint (BDO last4 / GCash mobile) | **Critical · auto-flag** | payment-method records |
| Same device fingerprint / IP (≤14-day window) | Medium | session metadata |

Composite score ≥ threshold → trial-start BLOCKED + flag inserted into `concierge_abuse_flags` (status `'pending_review'`) + couple sees *"Your account is under review. Contact support if you believe this is in error."* with a 0029 help-center ticket CTA. **No auto-ban** — admin decides.

**Tiered penalties — admin-actioned via 0023 Concierge Abuse tab.** Each confirmed-abuse decision increments `users.concierge_abuse_strike_count` and bumps `users.concierge_enforcement_level`:

| Strike | Enforcement level | Effect |
|---|---|---|
| 1 | `'warning'` | Audit only · trial still works · in-app notification "Your account was flagged for review and cleared with a warning." |
| 2 | `'trial_banned'` | Trial blocked · purchase ₱2,499 Concierge still allowed · banner in Settings explains state + appeal CTA |
| 3+ | `'full_banned'` | Trial blocked · purchase blocked · Concierge feature entirely unavailable on this account · banner with appeal CTA |

`'none'` (default) = no flags confirmed. Admin can decrement strikes via the appeal flow (0029 help-center ticket → admin Clear action) which audit-logs the reversion.

**Appeal path.** Banned accounts see explanatory copy + CTA *"Setnayan Concierge unavailable on this account. Contact support if you believe this is in error."* → opens a 0029 help-center ticket routed to the abuse-review admin role. Admin can lift the ban (decrement strike count + reset `concierge_enforcement_level`) with reason logged. See 0023 § Concierge Abuse for the queue + admin actions, and 0029 for the appeal ticket category.

### Choice card on event creation (iteration 0000)

After the couple enters their event name, two options appear (collapsed from the 2026-05-16 three-option card — Essentials retired):

```
┌──────────────────┐  ┌──────────────────────────────┐
│  DIY MODE        │  │  SETNAYAN CONCIERGE  ✨       │
│  Free            │  │  ₱2,499                      │
│                  │  │  12 months                   │
│                  │  │  ₱13.69 / day                │
│                  │  │  Less than ₱25K coordinator. │
│ All tools.       │  │ Full 9-step roadmap +        │
│ Plan at your     │  │ daily nudges + priority      │
│ own pace.        │  │ vendor matching + honeymoon. │
│ No timeline      │  │                              │
│ help.            │  │                              │
│                  │  │                              │
│ [Start Free]     │  │ [Buy ₱2,499]                 │
└──────────────────┘  └──────────────────────────────┘

      Not ready to commit? [ Try 3 days free → ] (no card required)

      Optional — activate or change anytime from Settings → Setnayan Concierge.
```

The 3-day-trial inline link is hidden when the account has already used its trial OR is under `'trial_banned'` / `'full_banned'` enforcement.

Per the pricing-page anchor strategy (carried forward from the 2026-05-16 lock), the choice card should be preceded by the human-coordinator anchor strip — *"Wedding coordinator ₱25,000+ · Setnayan Concierge ₱2,499"* — so couples mentally compare against the real alternative (human planner), not against free apps.

### Schema additions

**On `events`** (same shape as 2026-05-16; preview state retained as `'trial'` semantics but column names unchanged):

```sql
ALTER TABLE events
  ADD COLUMN concierge_status TEXT
    NOT NULL DEFAULT 'diy'
    CHECK (concierge_status IN ('diy', 'trial', 'active', 'expired')),
  ADD COLUMN concierge_tier TEXT
    CHECK (concierge_tier IN ('complete')),                    -- Essentials retired 2026-05-17; enum kept for forward-compat
  ADD COLUMN concierge_activated_at TIMESTAMPTZ,               -- stamped when status first flips to 'active' (referenced by expires_at formula + advisory)
  ADD COLUMN concierge_expires_at TIMESTAMPTZ,                 -- wedding-anchored: LEAST(wedding_date+30d, activated+24mo), min activated+12mo
  ADD COLUMN concierge_long_engagement_advised_at TIMESTAMPTZ; -- one-time advisory de-dup when wedding > 24mo from activation
-- events.concierge_preview_used_at RETIRED 2026-05-17 (moved to users.concierge_trial_used_at — account-level cap)
```

The `'preview'` value is renamed to `'trial'` to match the 3-day card-less framing; if the prior `'preview'` value has already shipped to production it can be remapped via text round-trip cast in the same migration. The `concierge_tier` CHECK constraint is left in place as a single-value enum (`'complete'`) so future tier reintroductions don't require a re-migration; current code treats it as non-NULL when `concierge_status IN ('trial', 'active')`.

**On `users`** — account-level trial cap + abuse-enforcement state:

```sql
ALTER TABLE users
  ADD COLUMN concierge_trial_used_at        TIMESTAMPTZ,      -- one trial per account, account-level cap
  ADD COLUMN concierge_abuse_strike_count   INT NOT NULL DEFAULT 0,
  ADD COLUMN concierge_enforcement_level    TEXT NOT NULL DEFAULT 'none'
                                            CHECK (concierge_enforcement_level IN ('none', 'warning', 'trial_banned', 'full_banned')),
  ADD COLUMN concierge_enforcement_at       TIMESTAMPTZ,
  ADD COLUMN concierge_enforcement_by       UUID REFERENCES users(user_id),
  ADD COLUMN concierge_enforcement_reason   TEXT;
```

**New table `concierge_abuse_flags`** — abuse-review audit trail (powers the 0023 Concierge Abuse tab):

```sql
CREATE TABLE concierge_abuse_flags (
  flag_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flagged_user_id   UUID NOT NULL REFERENCES users(user_id),
  matched_user_ids  UUID[] NOT NULL,                                  -- the trial-used accounts that triggered the match
  similarity_score  NUMERIC NOT NULL,
  signals           JSONB NOT NULL,                                   -- which signals fired, e.g. {"date":true,"venue":true,"phone":false}
  status            TEXT NOT NULL DEFAULT 'pending_review'
                    CHECK (status IN ('pending_review', 'cleared', 'confirmed_abuse')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ,
  reviewed_by       UUID REFERENCES users(user_id),
  admin_notes       TEXT
);

CREATE INDEX idx_concierge_abuse_flags_status ON concierge_abuse_flags(status, created_at DESC);
```

**Migration note (engineering):** the 2026-05-16 `events.concierge_preview_used_at` column is **retired in the same migration** (if shipped). The 2026-05-14 `guided_planner_*` columns (if they ever shipped) likewise rename through the same pass per the 2026-05-16 migration note above. RLS posture on `concierge_abuse_flags` — admin-only read/write via the existing `is_admin()` predicate; no couple-side exposure.

### Daily expiry sweep

Cron job (depends on Phase 1 of `Install_Sequence_V1.md` — Supabase pg_cron + pg_net per V1 cron strategy). One pass handles both trial-expiry and active-expiry:

```sql
UPDATE events
SET concierge_status = 'expired'
WHERE concierge_status IN ('active', 'trial')
  AND concierge_expires_at < NOW();
```

On status flip → in-app notification + email (per 0028) → DIY dashboard surface variant takes over. Notification copy differs by source state: trial-expired emphasizes "Continue with Setnayan Concierge (₱2,499) to keep your roadmap"; active-expired emphasizes "Reactivate to pick up where you left off."

### Server actions

- `activate_concierge(event_id, order_id)` — flips status to `'active'`, sets `concierge_tier = 'complete'`, stamps `concierge_activated_at = NOW()`, computes `concierge_expires_at` per the wedding-anchored formula: `LEAST(GREATEST(events.wedding_date + INTERVAL '30 days', NOW() + INTERVAL '12 months'), NOW() + INTERVAL '24 months')`. If `events.wedding_date IS NULL` at activation, expires_at defaults to `NOW() + INTERVAL '12 months'` (the 12-month floor); it will recompute when wedding_date is later set via `recompute_concierge_expiry`. If status was already `'trial'`, the trial is overwritten cleanly. If `users.concierge_enforcement_level = 'full_banned'` → fails with `enforcement_blocked` error. If `events.wedding_date` is already set and exceeds `NOW() + INTERVAL '24 months'`, fires the long-engagement advisory and stamps `events.concierge_long_engagement_advised_at`.
- `recompute_concierge_expiry(event_id)` (NEW 2026-05-17) — fired from the `events.wedding_date` update trigger OR app-layer hook in the Concierge Step 1 + Profile edit flows. Recomputes `concierge_expires_at` per the formula above using the current `concierge_activated_at` as the activation anchor. **Extend-only rule:** if the new expires_at would be later than the current value, update; if earlier, no-op (couple keeps the runway they paid for). If the new `wedding_date` exceeds `concierge_activated_at + INTERVAL '24 months'` AND `concierge_long_engagement_advised_at IS NULL`, fires the long-engagement advisory + stamps the column. Safe to call repeatedly (idempotent — extend-only + advisory de-dup).
- `cancel_concierge(event_id)` — early cancel; sets a `cancellation_requested_at` flag (status stays `'active'` until natural expiry — couple keeps the access they paid for); pro-rated refund optional admin action per 0034 refund flow.
- `start_concierge_trial(event_id)` (renamed from `start_concierge_preview` 2026-05-17) — pre-flight checks: (a) `users.concierge_trial_used_at IS NULL` (account-level cap) · (b) `users.concierge_enforcement_level NOT IN ('trial_banned', 'full_banned')` · (c) cross-account similarity check (returns score + signals). If all pass → flips event status to `'trial'`, sets `concierge_expires_at = NOW() + INTERVAL '3 days'`, stamps `users.concierge_trial_used_at = NOW()`. If similarity check fires → inserts row into `concierge_abuse_flags(status='pending_review')` and returns `under_review` error WITHOUT consuming the trial slot (so a falsely-flagged user who's later cleared can still start their trial). Idempotent on retry within an event that's already `'trial'` (returns existing trial row).
- `admin_clear_concierge_flag(flag_id, admin_user_id, notes)` — admin action from 0023 Concierge Abuse tab; sets `concierge_abuse_flags.status = 'cleared'`, no strike increment, in-app notification to flagged user.
- `admin_confirm_concierge_abuse(flag_id, admin_user_id, notes)` — admin action; sets `concierge_abuse_flags.status = 'confirmed_abuse'`, increments `users.concierge_abuse_strike_count`, auto-bumps `concierge_enforcement_level` per the tier table (1→`'warning'`, 2→`'trial_banned'`, 3+→`'full_banned'`), audit-logs the transition, in-app + email notification to flagged user.
- `admin_lift_concierge_enforcement(user_id, admin_user_id, notes)` — admin action invoked via the 0029 appeal-ticket flow; decrements strike count + resets `concierge_enforcement_level` (typically `'none'`), audit-logs.

---

## 0a. Concierge AI Brain (Locked 2026-05-18)

The Setnayan Concierge surface evolves from a static 9-step checklist
into a conversational planner powered by a curated Filipino-wedding
knowledge base ("the Brain") + a free-tier embedding/synthesis
pipeline + a paid-tier Haiku 4.5 synthesizer. The existing access
model (DIY default · 3-day card-less trial · `concierge_complete`
₱2,499/12mo) is preserved unchanged; the AI is the engine *inside*
that surface.

Canonical brain architecture + chunk template + governance rules
live in `02_Specifications/18_Concierge_Brain/`. This section is the
0016-side contract — what the iteration surfaces to couples and how
the access tiers gate the brain.

### Free-question quota — 3 questions per event (locked 2026-05-18)

Every DIY-mode event gets **3 free concierge questions**. Counter
lives on the `events` row (`concierge_free_questions_used INT NOT
NULL DEFAULT 0` with `CHECK (concierge_free_questions_used BETWEEN 0
AND 3)`). Counter increments only after a successful LLM response
(failures don't burn quota). Resets to 0 only on admin override (no
self-serve reset).

**Why per-event and not per-account.** V1 is one event per couple
(Wedding only). Per-event aligns with the existing
`events.concierge_status` state machine. When V2 unlocks additional
event types per couple, each event gets its own 3-question allowance —
matches the existing 0021 separation between events.

**Why 3 specifically.** Q1 = "is this real?"; Q2 = first substantive
question; Q3 = pattern emerges (the AI references prior turns,
surfaces specifically Filipino context, suggests deep-link CTAs).
The cliffhanger lands at Q3 with the mental model now "this is
useful" instead of "let me see if this is useful." Lower (1 or 2)
doesn't earn the conviction; higher (5+) gives away the moat and
cannibalizes the trial conversion.

### Surface integration — chat widget on dashboard Home

The conversational surface renders as the Concierge chat widget on
the dashboard Home (0021 § 2.0a). Responsive default per the
session-wide rule:

- **Mobile**: bottom-sheet that drags up from the persistent
  "Ask the Concierge" pill in the thumb-zone
- **Desktop**: right-side drawer (480px) anchored to the
  Concierge journey block

In DIY mode the widget collapses to a single CTA tile ("Ask Setnayan
Concierge — 3 free questions") above the 10-tile grid. After Q3 the
tile flips to the trial-upsell card (existing variant per § 0).

In Trial + Active modes the widget is always-available with a chat
history sidebar (paid tier only — DIY is stateless).

### Tier capability matrix

| Capability | DIY (free) | Trial (3 days) | Concierge Complete (₱2,499/12mo) |
|---|:---:|:---:|:---:|
| Questions per event | 3 | unlimited | unlimited |
| Synthesis model | Llama 3.1 8B (Cloudflare free) | Llama 3.1 8B | Claude Haiku 4.5 (0032 workspace) |
| Brain chunk access | non-paid-only chunks | full | full |
| Event-data integration in prompt | ❌ | partial (guest count, venue) | full (guest list status, vendor ledger, budget tier, milestone schedule) |
| Conversation history persisted | ❌ (stateless) | session-scoped | 12-month thread per event |
| Daily proactive nudges | ❌ | ❌ | ✓ (per the 9-step journey) |
| Honeymoon planning depth | ❌ | ❌ | ✓ (paid-tier-only chunks) |
| Priority vendor matching | ❌ | ❌ | ✓ |

The DIY tier deliberately exposes **quality** (Filipino fluency,
Setnayan feature awareness, sensible answers). The paid tier adds
**personalization** (your specific event data) + **persistence**
(memory across the 12 months) + **proactive surfacing** (daily
nudges). Same engine, different prompts, different state.

### Schema additions

```sql
-- Free-question quota counter
ALTER TABLE events
  ADD COLUMN concierge_free_questions_used INT NOT NULL DEFAULT 0
  CHECK (concierge_free_questions_used BETWEEN 0 AND 3);

-- Conversation history (paid + trial only — DIY is stateless)
CREATE TABLE concierge_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE concierge_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id     UUID NOT NULL REFERENCES concierge_conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant')),
  body                TEXT NOT NULL,
  retrieved_chunk_ids UUID[] NOT NULL DEFAULT '{}',
  synthesis_model     TEXT,
  tokens_in           INT,
  tokens_out          INT,
  cost_centavos       INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unanswered questions feed brain growth
CREATE TABLE concierge_unanswered_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID NOT NULL REFERENCES events(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  question_text   TEXT NOT NULL,
  reason          TEXT NOT NULL,            -- 'no_chunks_above_threshold' | 'llm_refused' | 'admin_flagged'
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  resolution      TEXT,                     -- 'new_chunk_authored' | 'out_of_scope' | 'duplicate'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Brain-chunk table + response-cache table + retrieval indexes are
spec'd in `18_Concierge_Brain/00_Architecture.md` § 5. They sit
under the brain spec rather than 0016 because they're cross-iteration
infrastructure (referenced by future iterations that want to use the
brain — see V2 candidates in § 12 of that doc).

### Server actions

- `ask_concierge(event_id, user_id, question_text)` — full RAG
  pipeline per `18_Concierge_Brain/00_Architecture.md` § 3.
  Returns `{response, sources, remaining_free_questions,
  upgrade_card_state, synthesis_model}`. Increments
  `events.concierge_free_questions_used` only on successful response
  (failures don't burn quota).
- `admin_reset_concierge_free_questions(event_id, admin_user_id,
  reason)` — admin override under § 0023 admin actions; resets
  counter to 0 with `admin_audit_log` row. Single-admin authority.

### Fallback when free-tier exhausted

When Cloudflare Workers AI returns rate-limit error (free tier
exhausted for the day across all couples), DIY responses fall back
to **chunk-1 verbatim** — return the top-1 retrieved chunk's body
text directly with a footer note: "Quick answer below — full
personalized answer when daily capacity resets in the morning."
Paid tier falls through cleanly to Haiku (different provider, no
shared quota). This degradation path means the free experience
never hard-fails; it just gets less polished on rate-limit days.

### Acceptance criteria additions to tests.md

- DIY couple asking Q1–Q3 gets full LLM responses; Q4 renders trial
  upsell card with zero LLM call
- DIY response stamped `synthesis_model = 'llama-3.1-8b'`; Active
  response stamped `'claude-haiku-4-5'`
- Trial couple's Haiku-equivalent answer NEVER includes event-data
  integration (guest count, vendor list); only Active does
- Cloudflare 429 simulation → DIY response falls back to chunk-1
  verbatim with capacity-reset footer
- Anthropic 5xx simulation on Active → response falls through to
  Llama 8B with degradation log row in `admin_audit_log`
- Chunk `paid_tier_only = TRUE` never retrieved for DIY/Trial
- Successful Q3 response on DIY → next interaction renders trial
  upsell card (no LLM call) regardless of question text
- `events.concierge_free_questions_used` only increments on
  successful LLM response; failures preserve quota
- Admin reset action audit-logged in `admin_audit_log` with
  reason text

### Launch-promo exclusion (cross-ref CLAUDE.md 2026-05-18 row 1)

The Setnayan launch promo locked earlier on 2026-05-18 makes 16
zero-marginal-cost SKUs FREE until 2027-03-31; `concierge_complete`
₱2,499/12mo is **explicitly excluded** from that promo. The promo
row's original rationale ("real coordinator labor") predates this
section's AI-evolution lock — under the new architecture, the
per-paid-couple inference cost is ~₱25 over 12 months (negligible),
NOT coordinator labor. The exclusion still holds for a different
reason: **the paid value is the event-data integration +
12-month thread persistence + 9-step daily nudges + paid-tier-only
brain chunks (honeymoon planning · priority vendor matching),
not the LLM call itself.** Free-tier DIY (3 Q · stateless ·
generic-but-Filipino) demonstrates quality; paid tier demonstrates
**your-wedding-specific** personalization. Two products on the
same engine, deliberately differentiated.

`service_catalog.launch_promo_until` stays `NULL` for the
`concierge_complete` SKU. No app-layer change to the promo
helpers in `apps/web/lib/sku-catalog.ts` — Concierge isn't in
`LAUNCH_PROMO_SKU_CODES` and the AI-brain evolution doesn't
add it.

### Cross-iteration touchpoints

- **0021 Couple Dashboard § 2.0a upgrade banner**: when couple
  reaches Q3 and is in DIY mode, the existing banner's "Try 3 days
  free" CTA gets a contextual prefix ("Love this? Keep going free
  for 3 days. ↓").
- **0023 Admin Console**: new tabs for Brain Editor, Unanswered
  Questions queue, and Concierge Cost Watch. Spec'd in
  `18_Concierge_Brain/00_Architecture.md` § 10.
- **0029 Help Center**: appeals for admin reset of free-question
  quota route through the existing help-ticket flow alongside
  trial-ban appeals.
- **0032 Contract Intelligence**: shares the Anthropic workspace
  and Haiku 4.5 model — see 0032 § 4a (added 2026-05-18).
- **0035 Observability**: adds `concierge_*` event funnels (asked,
  responded, exhausted, trial_triggered, converted_to_paid) to the
  PostHog 3-event base set.

---

## 0b. Concierge Wizard Architecture (Locked 2026-05-18)

This section is the **active-wizard layer** that sits on top of the AI Brain (§ 0a). The Brain answers questions; the Wizard **drives the planning flow**. Together they form the paid-tier experience that justifies the ₱2,499 SKU.

### The split — Brain vs Wizard

| Layer | What it does | Cost mechanism |
|---|---|---|
| **AI Brain (§ 0a)** | Retrieves cultural/legal/pricing/feature knowledge from `concierge_brain_chunks` and synthesizes an answer when the couple asks a free-form question | LLM call (Llama free / Haiku paid), cached forever by `hash(query_embedding, chunk_ids, combination_bucket)` |
| **Wizard (this section)** | Decides what to ask/recommend/nudge **next** based on event state (intake answers, booked vendors, payment status, wedding-date countdown) | Deterministic state machine + template engine. **₱0 cost.** |

The wizard's "personal feel" comes from **event-data substitution at render time** (couple's names, exact date, exact guest count, locked vendors), not LLM paraphrasing. Templates with variable interpolation produce indistinguishable output for a fraction of the cost.

### The conducted flow

After a couple activates Concierge (via direct purchase, trial, or Pro Weekly bundle — see § 0c), the wizard runs them through this flow:

1. **Intake forms (Stage 1)** — 5 structured form fields, no free-form sentence input: wedding date · religious tradition (Catholic / Christian non-Catholic / Civil / Muslim / Other) · estimated guest count (50/80/100/150/200/250/300+) · region (NCR / Cebu / Davao / Tagaytay / Boracay / Other) · working-budget tier (the 5 tiers from § 4) · foundation status (church / venue / both / neither). Forms-only. **₱0 inference cost.**

2. **Foundation lock (Stage 2)** — branches off the foundation answer:
   - **Neither** → ask which to anchor (default recommendation: venue first; peak-month dates lock fast in PH)
   - **Church only** → lock the church; recommend reception venues within 30km radius
   - **Venue only** → lock the venue; recommend churches within 30km (skip if Civil)
   - **Both** → lock both; validate distance is reasonable; advance to Stage 3
   - **Civil only** → skip church branch entirely

3. **Vendor recommendations (Stage 3)** — proximity-based + saturation-aware. **Single-pick categories** (per § Saturation Rules below) lock at first booking; **multi-pick categories** (cocktail booths) saturate at the sub-tag level. Vendor radius defaults to 8km per § 2.

4. **Tracking layer (Stage 4)** — the **Next Actions surface** aggregates `event_vendors`, `vendor_meetings`, payment milestones (0007), guest list status (0001), seat plan status (0008), mood board status (0010), and journey progress into a 3-tier feed:
   - 🔴 **Overdue** — past hard-lock window for a still-unbooked category, or unpaid payment milestone past due
   - 🟡 **This week** — meetings, payments due, vendor quotes expiring
   - 🔵 **Next priorities** — Locked-Sequence-aware (highest-importance unbooked category surfaces next)

5. **Vendor share packs (Stage 5)** — once a vendor is booked AND the relevant artifact is ready, the wizard offers to bundle the artifact subset that vendor needs (photographer gets palette + role roster + schedule; caterer gets final headcount + dietary + seat plan; florist gets palette + venue list + role bouquet assignments; coordinator gets the master pack). V1 delivery rides on 0019 chat (PDF/CSV attached to existing thread); V1.5+ adds a vendor-portal magic-link view.

### Personalized plan generation (1-prompt per novel combination, cached forever)

After intake completes, the wizard fires **one Haiku 4.5 call** to generate a personalized plan tailored to the couple's intake answers. The prompt stuffs in the relevant brain chunks retrieved by the intake combination plus the couple's specific facts.

The plan template is **cached by combination hash** to drive the per-couple cost toward ₱0:

```
plan_signature_hash = hash(
  religion, region, guest_count_bucket, budget_tier, foundation_state, season
)

→ Lookup concierge_plan_templates WHERE signature_hash = X
  → HIT  → use cached plan template, substitute the couple's names/date/specific facts at render time → ₱0
  → MISS → 1 Haiku call (~₱1), cache the result indefinitely, substitute → ₱1 (once for that combination, forever)
```

There are ~19,200 possible input combinations (5 religions × 6 regions × 8 guest buckets × 5 budget tiers × 4 foundation states × 4 seasons), but the distribution is heavily skewed (NCR Catholic 150-guest tier-3 is a thousand times more common than Boracay Muslim 80-guest tier-5). Admin pre-seeds the top 100 combinations at launch (~₱100 platform cost) so the first 100 couples all hit cache. Marginal cost per paid couple approaches ₱0 as the cache saturates over time.

The plan is **regenerated** when an anchor fact changes (wedding date moves > 3 months, guest count changes ± 50, budget tier changes, region changes, religion changes). Re-runs cost the same ₱0/₱1 and are rare. The cached plan template is **admin-editable** for quality — the first generation for a new combination can be hand-tweaked by admin before the next 50 couples in that combination see it.

### Cache invalidation

When admin edits a brain chunk via the Brain Editor (0023), plan templates that reference that chunk are flagged `stale`. They regenerate lazily on next access — no mass-regenerate batch needed.

### Couples see the plan as a take-away document

The personalized plan stays visible to the couple as a static document they can re-open anytime — even on DIY downgrade. Surfaced as "Your Setnayan Plan" tile on the dashboard. Maximizes the "Setnayan handed me a plan" perception. Per § Data Permanence below, the plan survives forever.

### Vendor saturation rules

The wizard enforces single-pick / multi-pick discipline for the 28 canonical_services declared in [0006 § Data model](../0006_vendors_management/0006_vendors_management.md). Locked 2026-05-18:

- **Hard single-pick (9 categories)** — wizard caps at 1, hard: `ceremony_venue`, `reception_venue`, `wedding_coordination`, `officiant`, `wedding_rings`, `honeymoon_planner`, `bridal_gown`, `groom_suit`, `transportation_bridal_car`
- **Soft single-pick (12 categories)** — wizard defaults to 1, couple may explicitly add a 2nd: `catering`, `photography`, `videography`, `same_day_edit`, `prenup_shoot`, `drone`, `cake_desserts`, `florals`, `invitation_print`, `stationery_signage`, `souvenirs_giveaways`, `dj_emcee_host`
- **Multi-pick uncapped (7 categories)** — wizard never saturates: `hmua`, `entourage_attire`, `transportation_guest_shuttle`, `lights_sound`, `live_band`, `acoustic_performer`, `choir_string_quartet`
- **Multi-pick with sub-tag saturation (2 categories)** — multi at canonical level, 1 per sub-tag:
  - `mobile_bar` → `cocktail` · `coffee` · `juice` · `tea` · `perfume` · `dessert_drinks`
  - `photobooth` → `classic` · `mirror` · `360` · `slow_mo` · `polaroid`

Sub-tags ride on existing `vendor_packages.recommended_for_tags TEXT[]`. Wizard saturation logic checks tag intersection within the canonical, not just canonical count. Custom services (`event_custom_services`) are always multi-pick uncapped — the couple defined them, they own the cap.

### Canonical wedding timeline (the wizard's calendar engine)

Each vendor category has two timestamps: `start_surfacing_months_before` (when the wizard first nudges) and `hard_lock_months_before` (when the wizard escalates to 🔴 Overdue). The gap is the couple's research-decide-inquire window (typically 2-3 months for major vendors). Full timeline lives in the Brain at [`04_Planning_Timelines.md`](../02_Specifications/18_Concierge_Brain/04_Planning_Timelines.md) (filled with canonical content 2026-05-18).

The wizard reads `events.wedding_date` + `events.religious_tradition` and surfaces the appropriate cards as Next Actions:

```
For each category in the wedding's plan:
  months_until_wedding = (events.wedding_date - NOW()) / 30
  IF months_until_wedding <= start_surfacing AND not booked
    → surface in Next Actions (priority by phase order)
  IF months_until_wedding <= hard_lock AND not booked
    → escalate to 🔴 Overdue tier
  IF months_until_wedding > start_surfacing
    → not surfaced yet (will surface when its time comes)
```

PH-specific hard floors: marriage license has a 4-month application window (120-day validity); Pre-Cana needs 60-90 day parish notice; custom bridal gown needs 3-6 month production lead.

### Compressed-timeline handling

If a couple gets engaged with a short window (e.g., 6 months from wedding), the wizard:
1. Computes `months_until_wedding = 6`
2. Identifies all categories whose `start_surfacing >= 6` — past their ideal window
3. Surfaces them all at once with a 🟡 banner: *"You're working with a compressed timeline. Here are 8 things to tackle in parallel, ordered by urgency."*
4. Flags impossible-in-time items (e.g., "Custom gown won't be ready — consider off-the-rack alternatives")

The marriage license is the only **hard floor** — it can't be applied for more than 4 months before the wedding regardless of urgency.

### Data permanence is a brand truth

Setnayan never deletes wedding data on downgrade, trial expiry, or cancel. The only deletion event is **explicit account deletion via support**. The trial-end CTA focuses on the value of the active helper — never threatens loss of data, because no loss occurs. Data permanence surfaces only where couples might doubt it: help center FAQ, Settings → Concierge tab, post-trial DIY state.

### DIY ↔ Concierge UI = one codebase, conditional wizard layer

Same routes, same artifact surfaces, same data substrate. The **wizard layer** (Next Actions strip, proactive nudges, weekly email digest via 0028, active vendor recommendations, saturation enforcement, unlimited brain Q&A) is conditional on `concierge_status IN ('active','trial')`. DIY home is marketplace-forward; Concierge home is wizard-forward. Downgrade is non-destructive — all artifacts + the personalized plan template + Q&A history survive as read-only documents; only the active wizard surfaces disappear.

**Smart intake on upgrade:** if a DIY couple later upgrades to Concierge, pre-fill the intake form from existing event data (date, region we have, guest count) and only ask the missing pieces (religion, foundation state, budget tier).

### Symmetric vendor wizard — always free for vendors

The same wizard pattern applies to the vendor side via 0022:
- **Next Actions surface for vendors:** "3 unread couple messages · ₱45,000 payout clearing Friday · 2 NCR couples matched your profile · verification renewal in 21 days"
- **Vendor onboarding plan generation:** 1-prompt Haiku call at signup, cached by `(category, region, tier, capacity_bucket)` — ~1,700 combos
- **Always free for vendors** — vendor success = booked weddings = platform revenue via Setnayan Pay 5%

### Triggering / cron policy

Per PR #47 cron lock, no new cron jobs. The wizard's Next Actions surface is **state-evaluated on access** — when the couple opens the dashboard, the server runs `getNextActions(event_id)` and returns the current feed. The weekly email digest piggy-backs on the existing email batcher (one of the 2 grandfathered cron jobs) which iterates eligible events at send time.

---

## 0c. Pro Weekly bundles Concierge (Locked 2026-05-18)

When a couple books a vendor whose `vendor_pro_weekly` subscription is active, that couple **auto-unlocks Concierge for their wedding-anchored window at no additional charge**. This is the primary funnel from vendor subscriptions into couple wizard engagement.

### Mechanics

```
Couple books a Pro Weekly vendor (contract uploaded → status='booked')
   → trigger fires: event_concierge_unlock_via_vendor(event_id, vendor_id)
   → IF events.concierge_status IN ('diy','expired')
     → set concierge_status = 'active'
     → set concierge_unlock_source = 'vendor_pro_weekly_perk'
     → set concierge_unlock_via_vendor_id = <vendor_id>
     → set concierge_activated_at = NOW()
     → compute concierge_expires_at per the wedding-anchored formula
     → in-app notification + email: "Concierge unlocked through your booking with {vendor_name}"
   → ELSE no-op (couple already on Concierge — perk doesn't extend; existing access continues)
```

### Schema additions

```sql
ALTER TABLE events
  ADD COLUMN concierge_unlock_source TEXT
    CHECK (concierge_unlock_source IN ('purchased', 'trial', 'vendor_pro_weekly_perk')),
  ADD COLUMN concierge_unlock_via_vendor_id UUID REFERENCES vendors(id);
```

### Activation trigger

**First booking confirmed (contract uploaded)** — not first inquiry, not first deposit. The contract upload is the strongest commitment signal the couple has made; before that point a couple could inquire with many vendors without indicating they'll actually use the platform.

### All vendor categories qualify

Every Pro Weekly vendor (photographer, caterer, coordinator, florist, HMUA, etc.) unlocks the perk for couples who book them. This simplifies the product story ("Every vendor on Pro Weekly gives their couples free Concierge") and drives broader Pro Weekly adoption.

### What happens if the vendor cancels Pro Weekly later

**The couple's existing unlock persists.** Their `concierge_status` stays `active` until natural expiry per the wedding-anchored formula. Don't punish couples for vendor decisions; the perk was already earned.

Future couples who would have booked that vendor (now off Pro Weekly) don't get the auto-unlock. They can still pay ₱2,499 directly for the same access.

### Supplements (not replaces) the direct ₱2,499 path

Couples who want Concierge **before** booking any vendor can still pay ₱2,499 directly (existing checkout flow per 0034). Couples who naturally book a Pro Weekly vendor get it free as a side-effect. Both paths land on the same `concierge_status = 'active'` state and the same wizard experience.

### Economics

| Per Pro Weekly vendor / year | Number |
|---|---|
| Pro Weekly revenue (₱499/wk × 52) | **₱25,948** |
| Avg couples booked / vendor / year | 10–30 (varies by category) |
| Concierge marginal cost × 20 couples | ~₱20 |
| **Net margin per Pro Weekly vendor** | **~₱25,928 (99.9%)** |

The bundling cost is rounding error. Pro Weekly becomes substantially more attractive to vendors; Setnayan's revenue per vendor barely moves.

### Marketing copy

Pro Weekly vendor-facing surfaces in 0022 + the `/for-vendors` marketing site gain three new lines:

> *"Subscribe to Pro Weekly and give every couple you book free Setnayan Concierge — a ₱2,499 value per couple."*

> *"Couples planning with Concierge come to you with their mood board, palette, guest count, and dietary already shared. Less prep, faster proposals, better-fit bookings."*

> *"Couples actively using Concierge book 3× more vendors through Setnayan. Pro Weekly makes you the vendor that unlocks that experience for them."*

### Coordinator-specific value

Coordinators on Pro Weekly are the strongest case for the bundle: their value pitch becomes "Subscribe to me and Setnayan unlocks your wedding planner." Combined with coordinator delegation (§ 0d), this creates a virtuous loop — coordinators sell Pro Weekly to themselves implicitly by selling Setnayan Concierge to their couples.

---

## 0d. Coordinator delegation (Locked 2026-05-18)

When a couple books a coordinator (any vendor in canonical category `wedding_coordination`), that coordinator **auto-receives scoped delegate access** to the couple's event. The coordinator can read the couple's Next Actions feed, act on items on the couple's behalf, and the couple sees every action attributed to the coordinator.

### Schema

Two new tables:

```sql
-- Who has delegated access to which event
CREATE TABLE event_delegates (
  event_id           UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  delegate_user_id   UUID NOT NULL REFERENCES users(user_id),
  delegate_vendor_id UUID REFERENCES vendors(id),
  role               TEXT NOT NULL CHECK (role IN ('coordinator','planner')),
  granted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by_user_id UUID NOT NULL REFERENCES users(user_id),
  revoked_at         TIMESTAMPTZ,
  PRIMARY KEY (event_id, delegate_user_id)
);

-- Audit trail: who did what, when (powers attribution + transparency)
CREATE TABLE event_action_log (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id             UUID NOT NULL REFERENCES events(event_id),
  action_type          TEXT NOT NULL,
    -- examples: payment_confirmed · meeting_scheduled · vendor_replied
    --           artifact_shared · action_marked_done
  action_target_id     UUID,
  performed_by_user_id UUID NOT NULL REFERENCES users(user_id),
  performed_by_role    TEXT NOT NULL CHECK (performed_by_role IN ('couple','coordinator','planner','system')),
  notes                TEXT,
  performed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX event_action_log_event_idx ON event_action_log (event_id, performed_at DESC);
```

### Auto-grant trigger

Booking confirmation (contract uploaded) for any vendor with `canonical_service IN ('wedding_coordination')` fires `grant_coordinator_delegate(event_id, vendor_id, vendor_user_id)`. The couple is asked to confirm delegate access at booking confirmation; default = accepted (paying for a coordinator implies "do my coordination work"). Couple can revoke from the vendor list at any time.

### Scope of "act on behalf of"

| Coordinator CAN do | Coordinator CANNOT do |
|---|---|
| Mark payments confirmed once received | Charge the couple's payment method |
| Schedule / reschedule vendor meetings | Change the wedding date |
| Reply in vendor chat threads (per 0019) | Book new vendors without couple approval |
| Share artifacts (mood board, palette, guest list) with vendors | Edit the guest list (add/remove guests) |
| Update vendor notes on the couple's vendor cards | Cancel bookings |
| Mark action items "done" | Delete the event |

V1.5+ adds a per-couple toggle "let my coordinator book new vendors without my confirmation" for couples who want full delegation. V1 default = couple must confirm new bookings.

### Couple-side "your coordinator did X" stream

The couple's dashboard surfaces a chronological stream of coordinator actions:

```
This week your coordinator Anna handled:
  ✓ Confirmed ₱25,000 deposit received by Caterer Y · Wed 11am
  ✓ Rescheduled Photographer X tasting to Saturday · Wed 2pm
  ✓ Shared your mood-board palette with Florist Z · Thu 9am
  ✓ Replied to Florist Z's quote question · Thu 9am
```

Every entry pulls from `event_action_log WHERE performed_by_role = 'coordinator'`. Builds trust — couple sees their money being spent doing real work.

### Coordinator-side multi-couple dashboard

In 0022, coordinators get a new "My Couples" view showing all their booked couples with badge counts derived from `getNextActions(event_id)` scoped to delegate access:

```
Your couples this month:
  🔴 Anna & Marco · Feb 14 wedding · 3 overdue items
  🟡 Bea & Carlo · Mar 21 wedding · 2 due this week
  🔵 Cris & Diane · May 30 wedding · all on track
  🔵 Eli & Fina · Jun 12 wedding · all on track
```

Click into any couple → see their Next Actions feed scoped for the coordinator + action history. The coordinator's daily login pattern looks like "open dashboard → scan badge counts → triage couples with red/yellow → act on items."

### Notification when coordinator acts

Each action logged in `event_action_log` fires an in-app notification + email (per 0028) to the couple:

> *"Anna (your coordinator) confirmed your ₱25,000 deposit was received by Caterer Y."*

Couple can tap the line to see the action log entry with timestamp + notes.

### Why this is V1, not V1.5+

The Pro Weekly bundle (§ 0c) makes coordinator delegation strategically important in V1:
- Coordinators on Pro Weekly drive Concierge adoption for their couples
- The delegation feature makes Pro Weekly *more valuable* to coordinators specifically
- Network-effect: coordinator becomes a daily Setnayan user → couples expect this experience → coordinators competing for couples must offer it → more coordinators subscribe to Pro Weekly

V1.5+ extends delegation to other vendor categories (e.g., a stylist with mood-board delegate access) if/when the case arises. V1 keeps it scoped to coordinators only.

---

## 0e. Intra-day vendor calendar blocks (cross-ref to 0022)

Vendors can create **intra-day blocks** in their 0022 calendar with custom labels — previously the calendar was full-day granularity. Locked 2026-05-18.

Full mechanics, schema, and UX live in 0022's calendar section. Summary here for cross-reference:

- **Granularity:** 30-minute increments
- **Label privacy:** private by default (couples see "Unavailable", not the label); vendor can opt to expose specific labels
- **Block sources:** `manual` (vendor-created) · `setnayan_booking` (auto-populated from confirmed bookings) · `synced_calendar` (V1.5+ Google Calendar sync)
- **Schema:** new `vendor_calendar_blocks` table (`vendor_id`, `starts_at`, `ends_at`, `block_label`, `block_source`, `is_private`)
- **Effect on couple marketplace:** vendor search excludes vendors with blocks overlapping the couple's wedding date; vendor detail pages show greyed "Unavailable" windows without labels
- **Effect on the Concierge wizard:** the recommendation filter queries `vendor_calendar_blocks` and excludes blocked vendors from "next vendor" cards

Relevant because the wizard recommendation logic in § 0b depends on `vendor_calendar_blocks` being honored — a vendor on a multi-day off-platform shoot shouldn't be recommended for a couple's same-week event.

---

## 1. The Locked Sequence

The plan builder routes couples through categories in this order. The order is determined by three forces: **lead time** (how far ahead a vendor must be booked), **dependency** (does the category need other decisions first?), and **bundling cascade** (does picking it auto-resolve others?).

### Phase 1 — Anchors (set everything else)

1. **Ceremony venue** — geographic anchor; locks the radius for reception search
2. **Reception venue** (must be ≤8km from ceremony unless overridden)
3. **Catering** — auto-routed by reception's food arrangement

### Phase 2 — Major commitments (book 8–12 months out)

4. **Photography**
5. **Wedding Coordinator**
6. **Bridal gown · Groom suit** (custom = 3–6 month lead)

### Phase 3 — Style + Design layer (4–8 months out)

7. **Stylist** (parent-vendor; absorbs florals + lights + decor when hired)
8. **Florals** (or auto-bundled with stylist/venue)
9. **Lights and Sounds** (or auto-bundled)
10. **Cake** (bundled at hotels; solo at gardens)

### Phase 4 — Programming + Entertainment (3–6 months out)

11. **Host / Emcee**
12. **Band / DJ** (multi-vendor allowed)
13. **Cocktail vendors** — multi-slot multi-vendor: food · drinks · souvenirs · attractions · photobooth · entertainment · others

### Phase 5 — Logistics + Finishing (2–4 months out)

14. **HMUA** (coverage roster)
15. **Bridal car** (bundled at hotels)
16. **Dressing Room / Hotel Stay** (bundled at hotels; solo for out-of-town guest blocks)
17. **Invitations** (needs final guest list)
18. **Rings** (couple-led; often external)

### Pre-event (after photographer is locked)

- **Pre-nup shoot** (2–6 months before wedding, with the same photo team)
- **Dance Guide / Choreographer** (4–8 weeks before; first dance + entourage grand march)

### Post-event (Setnayan coordination tasks)

- **Marriage certificate pickup** (Setnayan nudges 14 days post-wedding)
- **Honeymoon** (coordination + budget line)
- **Wedding registry / thank-you cards** (curated external links in V1; Setnayan SKU in V2)

---

## 2. The 8km Proximity Rule

Reception venue search filters to ≤8km from the ceremony venue by default.

**Reasoning:**
- Manila weekend traffic: 8km ≈ 30–45 minutes drive
- Guest comfort: long transitions kill event momentum
- Couple efficiency: outfit changes need short transitions
- Photography: golden-hour timing depends on quick venue moves

**Override:** "Show beyond 8km" toggle. Far venue cards display a `+Nkm · ~Nmin travel` badge so the trade-off is visible. Adapts for Tagaytay / destination ceremonies — the radius pulls in same-region venues.

---

## 3. Importance Tiers (which categories couples can't skip)

| Tier | Categories | Why |
|---|---|---|
| **Tier 1 — Non-negotiable** | Ceremony, Reception+food, Photography, Bride's gown, HMUA, Coordinator, Rings, Marriage license | Wedding can't happen without these |
| **Tier 2 — High-impact** | Florals (or Stylist), Cake, Music/Band/Host, Bridal car, Invitations, Videography | Defines the *feel* of the day |
| **Tier 3 — Style amplifiers** | Stylist (full-service), Lights & Sounds, SDE, Cocktail food + drinks, Pre-nup | Elevates the experience |
| **Tier 4 — Nice-to-haves** | Photobooth, Souvenirs, Drone, Cocktail attractions, Dance Guide | Adds delight |
| **Tier 5 — Bonus** | Lounge furniture, Cigar bar, Custom signage, Sparkler send-off | Pure flourish |

**Unlock progression:** Tier 1 categories must be placeholder-filled before Tier 2 unlocks for vendor browsing, and so on.

---

## 4. Working Budget Tiers (Per-Head Spend)

Replaces the previous absolute-budget framing. **Tier is determined by per-head spend, not total budget.** Couples pick a tier first; the plan builder computes the working budget by multiplying the tier's per-head range by the guest count.

### The Five Tiers

| Tier | Name | Per-head ₱ | Feel |
|---|---|---|---|
| 1 | **Simple and Intimate** | ₱1,500–3,000 | Restaurant or modest hotel; immediate family + closest friends; minimal extras |
| 2 | **Charming and Personal** | ₱3,000–5,000 | Mid-tier hotel or curated garden; wedding party + extended family; thoughtful styling |
| 3 | **Grand and Beautiful** | ₱5,000–8,000 | Premium hotel or full-service garden estate; full design layer; SDE + cocktail extras |
| 4 | **Distinguished and Refined** | ₱8,000–13,000 | Top-tier hotel or destination estate; stylist-driven full design; premium photo/video; couture-adjacent gown |
| 5 | **Luxurious and Beyond** | ₱13,000+ | Iconic hotel grand ballroom or premium destination; couture gown; full-event stylist team; multi-vendor cocktail; designer everything |

### Working Budget by Tier × Guest Count

| Guests | Tier 1 (Simple) | Tier 2 (Charming) | Tier 3 (Grand) | Tier 4 (Distinguished) | Tier 5 (Luxurious) |
|---|---|---|---|---|---|
| 50 | ₱75K – ₱150K | ₱150K – ₱250K | ₱250K – ₱400K | ₱400K – ₱650K | ₱650K+ |
| 80 | ₱120K – ₱240K | ₱240K – ₱400K | ₱400K – ₱640K | ₱640K – ₱1.04M | ₱1.04M+ |
| 100 | ₱150K – ₱300K | ₱300K – ₱500K | ₱500K – ₱800K | ₱800K – ₱1.3M | ₱1.3M+ |
| 150 | ₱225K – ₱450K | ₱450K – ₱750K | ₱750K – ₱1.2M | ₱1.2M – ₱1.95M | ₱1.95M+ |
| 200 | ₱300K – ₱600K | ₱600K – ₱1M | ₱1M – ₱1.6M | ₱1.6M – ₱2.6M | ₱2.6M+ |
| 230 | ₱345K – ₱690K | ₱690K – ₱1.15M | ₱1.15M – ₱1.84M | ₱1.84M – ₱3M | ₱3M+ |
| 250 | ₱375K – ₱750K | ₱750K – ₱1.25M | ₱1.25M – ₱2M | ₱2M – ₱3.25M | ₱3.25M+ |
| 300 | ₱450K – ₱900K | ₱900K – ₱1.5M | ₱1.5M – ₱2.4M | ₱2.4M – ₱3.9M | ₱3.9M+ |

### Key Properties

**Tier is decoupled from headcount.** A 100-guest wedding can be Luxurious. A 250-guest wedding can be Simple. Tier is about *kind of wedding*, not *size of wedding*.

**Couples pick tier first, never the budget.** No cold "type your number" prompt. The wizard shows 5 cards; couple picks one; computed budget appears.

**Budget flexibility — Stick or Play.** After picking a tier, couple is asked: *Stick with this budget, or play with it?* Stick locks at the tier's midpoint. Play opens a slider with ±20% range, with annotations explaining what tightens/stretches:
- Lower: "Restaurant or smaller-hotel receptions; skip cocktail attractions"
- Higher: "Premium hotel options; stylist-driven full design"

---

## 5. Budget Allocation by Tier

These are typical PH market allocations. Refine after launch with real Setnayan data.

### Tier 1 · Simple and Intimate (₱1,500–3,000/head)

Example: 100 guests × ₱2,250/head = ₱225K target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (often restaurant-bundled) | 50–55% | ₱110K – ₱125K |
| Attire (bride + groom) | 8–10% | ₱18K – ₱22K |
| Photography (limited coverage) | 8–10% | ₱18K – ₱22K |
| HMUA | 4–6% | ₱9K – ₱14K |
| Coordinator (day-of only) | 4–6% | ₱9K – ₱14K |
| Florals (minimal — bouquet + small centerpieces) | 4–6% | ₱9K – ₱14K |
| Cake | 1–2% | ₱2K – ₱4K |
| Music / DJ | 2–3% | ₱4K – ₱7K |
| Bridal car | 2–3% | ₱4K – ₱7K |
| Invitations | 1–2% | ₱2K – ₱4K |
| Pre-nup (optional) | 2–3% | ₱4K – ₱7K |
| Buffer | 8–10% | ₱18K – ₱22K |

Notes: Stylist + lights typically skipped. Cocktail layer skipped. Restaurant-bundled receptions common.

### Tier 2 · Charming and Personal (₱3,000–5,000/head)

Example: 150 guests × ₱4,000/head = ₱600K target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (mid-tier hotel or curated garden) | 45–50% | ₱270K – ₱300K |
| Photography + Video (basic) | 10–12% | ₱60K – ₱72K |
| Florals + simple lights | 7–9% | ₱42K – ₱54K |
| Attire (bride + groom + entourage assist) | 8–10% | ₱48K – ₱60K |
| HMUA (bride + mothers) | 3–4% | ₱18K – ₱24K |
| Coordinator | 3–4% | ₱18K – ₱24K |
| Music + Host | 3–5% | ₱18K – ₱30K |
| Cocktail (light layer) | 2–3% | ₱12K – ₱18K |
| Cake | 1–2% | ₱6K – ₱12K |
| Bridal car (often bundled) | 1–2% | ₱6K – ₱12K |
| Invitations | 2–3% | ₱12K – ₱18K |
| Pre-nup | 2–3% | ₱12K – ₱18K |
| Buffer | 6–8% | ₱36K – ₱48K |

### Tier 3 · Grand and Beautiful (₱5,000–8,000/head)

Example: 200 guests × ₱6,500/head = ₱1.3M target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (premium hotel or full-service garden) | 35–45% | ₱455K – ₱585K |
| Photography + Video | 12–15% | ₱156K – ₱195K |
| Florals + Stylist + Lights | 10–12% | ₱130K – ₱156K |
| Attire (bride + groom + entourage assist) | 8–12% | ₱104K – ₱156K |
| HMUA (bride + mothers + entourage) | 3–4% | ₱39K – ₱52K |
| Coordinator (full-event) | 3–4% | ₱39K – ₱52K |
| Music + Band + Host | 4–6% | ₱52K – ₱78K |
| Cocktail vendors (multi-slot) | 3–5% | ₱39K – ₱65K |
| Cake | 1–2% | ₱13K – ₱26K |
| Bridal car (often bundled) | 1–2% | ₱13K – ₱26K |
| Invitations | 2–3% | ₱26K – ₱39K |
| Pre-nup | 2–3% | ₱26K – ₱39K |
| Buffer | 5–8% | ₱65K – ₱104K |

### Tier 4 · Distinguished and Refined (₱8,000–13,000/head)

Example: 230 guests × ₱13,000/head = ₱3M target *(real-world reference: matches the user's wedding profile)*

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (top-tier hotel) | 30–40% | ₱900K – ₱1.2M |
| Florals + Stylist + Lights | 12–15% | ₱360K – ₱450K |
| Attire (couture-adjacent gown + entourage) | 10–12% | ₱300K – ₱360K |
| Photography + Video (premium team) | 10–13% | ₱300K – ₱390K |
| Music (band + DJ + ceremony quartet) | 4–6% | ₱120K – ₱180K |
| Cocktail vendors (multi-vendor) | 4–6% | ₱120K – ₱180K |
| HMUA (full team + touch-up) | 3–4% | ₱90K – ₱120K |
| Coordinator (premium full-event) | 3–4% | ₱90K – ₱120K |
| Cake | 1–2% | ₱30K – ₱60K |
| Bridal car (often bundled) | 1–2% | ₱30K – ₱60K |
| Invitations (premium stationery) | 2–3% | ₱60K – ₱90K |
| Pre-nup (destination shoot) | 2–3% | ₱60K – ₱90K |
| Buffer | 6–10% | ₱180K – ₱300K |

### Tier 5 · Luxurious and Beyond (₱13,000+/head)

Example: 250 guests × ₱18,000/head = ₱4.5M target

| Category | % | ₱ range |
|---|---|---|
| Reception venue + food (iconic hotel grand ballroom or destination) | 28–38% | ₱1.26M – ₱1.71M |
| Florals + Stylist + Lights (full design team) | 15–20% | ₱675K – ₱900K |
| Attire (couture gown + couture entourage) | 10–15% | ₱450K – ₱675K |
| Photography + Video (couture team) | 8–12% | ₱360K – ₱540K |
| Music (band + DJ + ceremony quartet + late-night DJ) | 5–8% | ₱225K – ₱360K |
| Cocktail vendors (multi-vendor multi-slot) | 5–8% | ₱225K – ₱360K |
| Coordinator (premium team) | 3–5% | ₱135K – ₱225K |
| HMUA (full team + dual-shoot touch-ups) | 3–4% | ₱135K – ₱180K |
| Invitations (curated calligraphy stationery) | 2–4% | ₱90K – ₱180K |
| Pre-nup (destination + multi-day) | 2–3% | ₱90K – ₱135K |
| Cake (couture multi-tier) | 1–2% | ₱45K – ₱90K |
| Bridal car | 1–2% | ₱45K – ₱90K |
| Buffer | 8–12% | ₱360K – ₱540K |

---

## 6. Vendor Registration Schema (Din Phase 3)

The plan builder's match criteria mirrors the vendor registration form. Same vocabulary on both sides of the marketplace.

### Required Declarations on Vendor Sign-Up

**Identity**
- Business name, contact email/phone, billing address
- Service area (cities served + travel willingness)
- Years in business + portfolio link

**Service Categorization**
- Primary category (multi-select from locked list — see Section 1)
- Subtype where applicable (Hotel / Restaurant / Garden Estate / etc.)
- Coverage scope (for multi-slot categories — see Section 8 below)

**Tier Positioning** (which per-head tiers does this vendor fit?)
- Tier 1 (Simple) ✓/✗
- Tier 2 (Charming) ✓/✗
- Tier 3 (Grand) ✓/✗
- Tier 4 (Distinguished) ✓/✗
- Tier 5 (Luxurious) ✓/✗

Most vendors span 2–3 adjacent tiers via package tiers. Plan builder filters vendors whose pricing fits the couple's category budget.

**Pricing Model**
- Per-pax (catering, hotels, restaurants, cocktail food)
- Flat fee (photography, coordinator, host, gown, stylist base)
- Tiered packages (Silver/Gold/Platinum with declared inclusions per tier)
- Hybrid (e.g., stylist base + per-head scaling)

**Inclusion Manifest** (for venues + stylists + parent-vendor types)
Per-package declaration of what's bundled — drives the bundling cascade. See Section 7 for examples.

**Coverage Scope** (for multi-slot categories)
- Photography: pre-nup ✓/✗, wedding ✓/✗, SDE ✓/✗, album ✓/✗, second-shooter ✓/✗
- HMUA: bride ✓, mothers ✓/✗, bridesmaids ✓/✗, touch-up ✓/✗
- Videography: SDE ✓/✗, full-feature ✓/✗, drone ✓/✗, multi-cam ✓/✗

**Relationships**
- Recommended pairings (venue → preferred caterers; stylist → florist partners)
- Corkage policy (for venues that allow outside catering — flat ₱/head)
- `absorbs_categories[]` (for stylists/parent-vendors)

**Capacity Range** (for venues)
- Min guests, max guests, layout options (round / long / mixed)

**Verification Tier**
- *Self-attested* (free): vendor uploads license + portfolio
- *Verified Setnayan Badge* (paid): Setnayan team validates docs, past events, real Setnayan couple reviews

### Match Logic

```
plan_builder.couple → vendor.match if:
  vendor.service_category ⊇ category_being_shopped
  AND tier_overlap(vendor.tiers, couple.working_tier)
  AND distance(vendor.service_area, couple.ceremony_venue) ≤ category_radius
  AND price_in_range(vendor.pricing_model, couple.category_budget)
  AND coverage_match(vendor.coverage_scope, couple.required_coverage)
  AND quality_floor: vendor.rating ≥ 4.0 OR vendor.verified_setnayan_badge
```

Couples never need to filter manually. The plan builder's category page is pre-filtered to vendors who match all of the above. Don't-undersell rule still applies: low-priced quality vendors at any tier remain visible.

---

## 7. Bundling Cascade Reference

When a couple picks a venue, the plan engine reads its `inclusions` manifest and auto-marks downstream categories as bundled.

### Hotel Premium Package (₱2,500+/pax)

| Category | Auto-bundled? |
|---|---|
| Catering | ✓ |
| Cake | ✓ (3–4 tier typical) |
| Reception florals | ✓ (centerpieces + arch) |
| Bridal car | ✓ (5 hrs) |
| Bridal suite + Family suite | ✓ (1 night each) |
| Day-of coordinator | ✓ |
| Sound system + AV | ✓ |
| Ceremony coordination (if hotel chapel) | ✓ |

### Restaurant Bundle (₱1,500–2,500/pax)

| Category | Auto-bundled? |
|---|---|
| Catering | ✓ |
| Cake | ✓ (smaller, 1–2 tier) |
| Basic centerpieces | ✓ (sometimes) |
| Sound system | ✓ |

### Garden Estate (₱150–400K rent)

| Category | Auto-bundled? |
|---|---|
| Catering | — (preferred caterer or open) |
| Sound system | ✓ (sometimes) |
| Basic decor | ✓ (sometimes) |
| Everything else | — (sourced separately) |

### Stylist Parent-Vendor

When a couple hires a full-service stylist:

| Category | Auto-bundled? |
|---|---|
| Reception florals | ✓ |
| Ceremony florals | ✓ |
| Lights & Sounds (design lighting) | ✓ |
| Decor + table styling | ✓ |
| Stage backdrop | ✓ |
| Bouquets + boutonnières | ✓ (often) |

### Food Card Pattern (refined)

The catering category appears in the plan even when food is bundled by the venue, in a "confirm or modify" state:

> **Catering** *✓ Included with your venue*
> [ Keep this menu ] · [ Upgrade to premium ] · [ Switch caterers ]

Translation by food arrangement:
- **Included** → *Switch caterers* warns that food is part of venue contract; *Upgrade* opens premium add-ons
- **Exclusive caterer** → *Switch* shows venue's mandated list only
- **Preferred + corkage** → All three actions live; switching to outside triggers corkage warning
- **Open** → Full browse mode

---

## 8. Sub-Events and Sibling Events

### Engagement Party (Sub-Event)

Same Setnayan event, schema-linked via `parent_event_id`. Smaller guest list (subset of main wedding), separate date, reusable vendor relationships.

**Surfaces in:**
- Couple's event picker → nested under the main wedding ("Wedding · Sept 2026 ▸ Engagement Party · Mar 2026")
- Plan builder → sub-event tab with own category list (often fewer categories: venue, food, photography, attire only)
- Budget (0007) → its own line items, separate from main wedding budget

**Common patterns:**
- 6–12 months before wedding
- 30–80 guests (close family + best friends)
- Reuses photographer (often becomes the pre-nup shoot)
- Reuses caterer / venue from a curated list
- Optional: announces the engagement on the couple's invitation site

### Bridal Shower / Stag Night (Sibling Event)

Friend-organized; the friend is the event owner, not the couple. Friend creates their own Setnayan event with `linked_to_event_id` pointing to the main wedding.

**Why the link matters:**
- Guest list overlap detection (don't double-invite)
- Date conflict warning (don't conflict with prep day)
- Surprise-keeping mode (couple cannot see the friend's event by default)
- Optional vendor sharing (some HMUAs / photographers do both events)

**Privacy:** Surprise mode hides the sibling event from the couple's view entirely. Friend can flip surprise off when they want the couple in the loop.

### Engagement / Stag / Shower Vendor Reuse

When a couple's main wedding photographer also covers their engagement party (or pre-nup shoot), the plan engine recognizes the shared vendor and shows a unified "Photography" view spanning all events.

---

## 9. Post-Wedding Coordination Tasks

The plan doesn't end at the reception send-off. Setnayan nudges couples through the post-wedding tail.

### Marriage Certificate Pickup

- **Trigger**: 14 days after wedding date
- **Nudge copy**: "Your marriage certificate is ready for pickup at [your LCR office]. Bring 2 valid IDs and the original receipt."
- **Optional**: Annulment of bachelorhood claim (if the diocese requires it)
- **Why this matters**: Often forgotten in PH weddings; couples discover months later they need it for legal name changes, joint accounts, immigration filings

### Honeymoon Coordination

- **Surfaces in**: Plan builder as "Post-wedding · Honeymoon" card; Budget (0007) as a separate budget line
- **Type**: Coordination task with budget allocation field; no Setnayan SKU (couple-led booking via airlines/hotels/agencies directly)
- **Reminders**:
  - 30 days post-wedding: "Confirm flight and accommodation bookings"
  - 14 days before honeymoon date: "Pack list checklist"
  - Day of departure: "Travel documents check (passports, visas, insurance)"
- **V2 candidate**: Setnayan travel-agency partnerships for one-click honeymoon packages

### Wedding Registry / Cash Gift App

- **V1 implementation**: Coordination task with curated PH options
  - Lazada Wishlist (most common for physical gifts)
  - Shopee Wishlist (alternative)
  - GCash Gift QR (most common for cash)
  - Honeyfund / Hitchd / Zola (international registry apps)
- **Surfaces in**: Couple's invitation site (0002/0004) as a "Gifts" widget
- **V2 candidate**: Native Setnayan Registry + GCash gift integration with auto-thank-you note generation
- **Etiquette nuance**: PH wedding culture leans toward cash gifts. Couples may want a "soft" gift register (suggested items) without forcing physical-gift expectations

### Thank-You Cards

- **Trigger**: 21 days post-wedding ("Most of your gifts have arrived. Time to send thank-yous.")
- **Surfaces**: Curated stationery vendors + GCash gift QR as a "send a personalized thank-you with photo" option
- **V2 SKU**: Setnayan Thank-You Cards — auto-generated cards with the couple's wedding photo, custom message, and per-guest personalization (ties into the Papic gallery and Photo Delivery)

---

## 10. Wizard Flow Refactor (Path C V1)

### Old flow (pre-tier-first refactor)

date → location → guests → style → **type your budget** → tier classification → category guidance

### New flow (tier-first, locked)

date → location → guests → style → **pick a tier** → **stick or play with budget** → category guidance

### Tier Picker Screen

5 cards arranged vertically (mobile) or in a 5-column grid (desktop):

```
┌─────────────────────────────────────────────────┐
│ TIER 1 · Simple and Intimate                    │
│ ₱1,500–3,000 per head                           │
│ For your 200 guests: ₱300K – ₱600K              │
│ Restaurant or modest hotel · close family       │
│ + minimal extras                                │
│ [photo strip]                                   │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ TIER 2 · Charming and Personal                  │
│ ₱3,000–5,000 per head                           │
│ For your 200 guests: ₱600K – ₱1M                │
│ ...                                             │
└─────────────────────────────────────────────────┘
... (3 more tiers)
```

### Stick or Play Screen

After tier pick, this screen shows:

> **Your working budget: ₱2.3M** *(Distinguished tier × 230 guests)*
>
> Want to stick with this, or play with the range?
>
> [ Stick — keep ₱2.3M ]  [ Play — give me a range ]

If *Play*, opens a slider:

```
₱1.84M ◀━━━━━━━━●━━━━━━━━▶ ₱3M
                |
              ₱2.3M (current)

← Tighten by ₱400K: Restaurant or smaller-hotel options;
   skip cocktail attractions
→ Stretch by ₱400K: Premium hotel options unlock; full
   stylist-driven design
```

### Category Page Headers

Every category card shows:
- Category name + importance tier badge
- Status (open / in-progress / done / bundled)
- Typical ₱ range for couple's tier ("Distinguished tier typically: ₱120K–₱180K for music")
- Lead-time hint ("Book by [month]")
- Bundled badge if absorbed by venue or stylist

---

## 11. Representative Venue Inventory

> **CAVEAT**: The lists below are illustrative samples drawn from common-knowledge of the PH wedding scene. Prices are rough ranges and **change yearly**. Capacity figures are typical, not maximums. Use these as research starting points for your team — Din Phase 3 (vendor self-onboarding) is the canonical mechanism for collecting verified, current vendor data. Do not present these prices to couples without verification.

### 11A. Hotels (Metro Manila + nearby)

| # | Hotel | Area | Capacity | Typical ₱/pax | Tier Span |
|---|---|---|---|---|---|
| 1 | Manila Hotel | Ermita | 250–500 | ₱2,500–4,000 | T2–T4 |
| 2 | The Peninsula Manila | Makati | 200–700 | ₱2,800–4,500 | T2–T5 |
| 3 | Conrad Manila | Pasay | 200–280 | ₱2,400–3,500 | T2–T4 |
| 4 | Sofitel Philippine Plaza | Pasay | 200–600 | ₱2,200–3,800 | T2–T4 |
| 5 | Marriott Hotel Manila | Pasay | 200–500 | ₱2,300–3,500 | T2–T4 |
| 6 | Shangri-La The Fort | BGC | 200–800 | ₱3,000–5,000 | T3–T5 |
| 7 | Shangri-La Makati | Makati | 200–600 | ₱3,000–4,800 | T3–T5 |
| 8 | Edsa Shangri-La | Mandaluyong | 200–500 | ₱2,500–3,800 | T2–T4 |
| 9 | Solaire Resort & Casino | Pasay | 200–800 | ₱3,000–5,500 | T3–T5 |
| 10 | Okada Manila | Parañaque | 250–1,000 | ₱2,500–4,500 | T2–T4 |
| 11 | City of Dreams Manila | Parañaque | 200–500 | ₱2,800–4,500 | T2–T5 |
| 12 | Resorts World Manila | Pasay | 200–600 | ₱2,200–3,800 | T2–T4 |
| 13 | Grand Hyatt Manila | BGC | 200–600 | ₱2,800–4,500 | T2–T5 |
| 14 | Hyatt Regency Manila | Pasay | 200–500 | ₱2,200–3,500 | T2–T4 |
| 15 | Diamond Hotel | Manila | 150–350 | ₱2,000–3,200 | T2–T4 |
| 16 | Dusit Thani Manila | Makati | 200–600 | ₱2,300–3,500 | T2–T4 |
| 17 | New World Makati Hotel | Makati | 150–400 | ₱2,200–3,500 | T2–T4 |
| 18 | Fairmont Makati | Makati | 200–400 | ₱2,500–4,000 | T2–T4 |
| 19 | Raffles Makati | Makati | 100–200 | ₱3,500–5,500 | T3–T5 |
| 20 | Holiday Inn Makati | Makati | 150–350 | ₱1,800–2,800 | T1–T3 |
| 21 | I'M Hotel Makati | Makati | 100–250 | ₱1,800–2,800 | T1–T3 |
| 22 | Discovery Suites Ortigas | Ortigas | 100–250 | ₱1,800–2,800 | T1–T3 |
| 23 | Discovery Primea | Makati | 150–350 | ₱2,500–3,800 | T2–T4 |
| 24 | Crowne Plaza Manila Galleria | Ortigas | 200–500 | ₱2,000–3,200 | T1–T3 |
| 25 | Acacia Hotel Manila | Alabang | 150–400 | ₱1,800–2,800 | T1–T3 |
| 26 | Bayleaf Hotel Intramuros | Intramuros | 100–250 | ₱1,800–2,800 | T1–T3 |
| 27 | Joya Lofts and Towers | Rockwell | 80–150 | ₱2,000–3,000 | T2–T3 |
| 28 | The Linden Suites | Ortigas | 100–200 | ₱1,800–2,800 | T1–T3 |
| 29 | Seda Vertis North | QC | 150–300 | ₱1,800–2,800 | T1–T3 |
| 30 | Seda BGC | BGC | 150–300 | ₱1,800–2,800 | T1–T3 |
| 31 | Ascott BGC | BGC | 100–250 | ₱2,000–3,200 | T2–T3 |
| 32 | Belmont Hotel Manila | Pasay | 150–300 | ₱1,800–2,800 | T1–T3 |
| 33 | Wack Wack Resort & Country Club | Mandaluyong | 200–500 | ₱2,200–3,500 | T2–T4 |
| 34 | Manila Polo Club | Makati | 200–500 | ₱2,500–4,000 | T2–T4 |
| 35 | Manila Yacht Club | Manila | 150–300 | ₱2,000–3,000 | T2–T3 |
| 36 | The Manor at Camp John Hay | Baguio | 100–250 | ₱2,000–3,500 | T2–T4 |
| 37 | The Bellevue Hotel Alabang | Alabang | 200–500 | ₱2,000–3,200 | T1–T3 |
| 38 | Crimson Hotel Filinvest City | Alabang | 200–400 | ₱2,200–3,200 | T2–T3 |
| 39 | Vivere Hotel | Alabang | 150–350 | ₱2,000–3,000 | T2–T3 |
| 40 | Eastwood Richmonde Hotel | QC | 150–300 | ₱1,800–2,500 | T1–T3 |
| 41 | F1 Hotel Manila | BGC | 150–300 | ₱2,000–2,800 | T1–T3 |
| 42 | Henann Regency Resort | Boracay | 150–400 | ₱3,000–5,000 | T3–T5 |
| 43 | Crimson Resort Mactan | Cebu | 200–500 | ₱2,800–4,500 | T2–T5 |
| 44 | Shangri-La Mactan Cebu | Cebu | 250–600 | ₱3,500–5,500 | T3–T5 |
| 45 | Plantation Bay Cebu | Cebu | 150–400 | ₱2,500–4,000 | T2–T4 |
| 46 | The Henry Hotel Manila | Pasay | 80–150 | ₱2,200–3,200 | T2–T3 |
| 47 | Crowne Plaza Galleria Cebu | Cebu | 200–500 | ₱2,000–3,200 | T1–T3 |
| 48 | Marco Polo Plaza Cebu | Cebu | 200–500 | ₱2,200–3,500 | T2–T4 |
| 49 | Pico Sands Hotel (Pico de Loro) | Batangas | 100–300 | ₱2,500–4,000 | T2–T4 |
| 50 | Sheraton Manila Bay | Pasay | 200–500 | ₱2,400–3,800 | T2–T4 |

### 11B. Garden Estates · Outdoor Venues

| # | Venue | Area | Capacity | Typical Rent ₱ | Food Arrangement | Tier Span |
|---|---|---|---|---|---|---|
| 1 | Hillcreek Gardens Tagaytay | Tagaytay | 100–220 | ₱150–250K | Preferred · no corkage | T2–T4 |
| 2 | Sonya's Garden | Tagaytay | 80–200 | ₱100–200K | Bundled (own food) | T1–T3 |
| 3 | Antonio's Tagaytay | Tagaytay | 80–180 | ₱150–250K | Bundled (own food) | T2–T4 |
| 4 | Tagaytay Highlands | Tagaytay | 100–400 | ₱180–400K | Members + accredited | T3–T5 |
| 5 | Hacienda Isabella | Tagaytay | 100–300 | ₱150–280K | Preferred + corkage | T2–T4 |
| 6 | Caleruega Church and Reception | Nasugbu | 100–300 | ₱150–300K | Preferred caterers | T2–T4 |
| 7 | Casa Ibarra Tagaytay | Tagaytay | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 8 | Casa Real Tagaytay | Tagaytay | 100–200 | ₱130–230K | Preferred caterers | T2–T3 |
| 9 | Anya Resort Tagaytay | Tagaytay | 100–250 | ₱180–350K | Resort-bundled | T3–T5 |
| 10 | Domicillo Design Hotel Tagaytay | Tagaytay | 80–200 | ₱150–280K | Bundled | T2–T4 |
| 11 | Twin Lakes Hotel Tagaytay | Tagaytay | 150–400 | ₱180–350K | Bundled | T2–T4 |
| 12 | Taal Vista Hotel | Tagaytay | 200–500 | ₱2,200–3,500/pax | Bundled (hotel format) | T2–T4 |
| 13 | One Tagaytay Place | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 14 | Royale Tagaytay Country Club | Tagaytay | 200–500 | ₱180–400K | Members + accredited | T2–T4 |
| 15 | Forest Club Tagaytay | Tagaytay | 100–300 | ₱150–280K | Accredited caterers | T2–T4 |
| 16 | Burol Drive Tagaytay | Tagaytay | 100–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 17 | Lakeshore Antipolo | Antipolo | 100–300 | ₱130–250K | Preferred + corkage | T2–T3 |
| 18 | Pinto Art Museum | Antipolo | 100–250 | ₱150–280K | Preferred caterers | T2–T4 |
| 19 | Forest Grove Antipolo | Antipolo | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 20 | Las Casas Filipinas de Acuzar | Bataan | 100–500 | ₱250–500K | Resort-bundled (heritage) | T3–T5 |
| 21 | Hacienda Sta Elena | Laguna | 150–400 | ₱180–350K | Preferred + corkage | T2–T4 |
| 22 | Punta Fuego | Batangas | 100–300 | ₱200–400K | Members + bundled | T3–T5 |
| 23 | Pico de Loro | Batangas | 100–300 | ₱200–400K | Members + bundled | T3–T5 |
| 24 | Glass Garden Pasig | Pasig | 100–250 | ₱150–280K | Preferred + corkage | T2–T4 |
| 25 | Fernwood Gardens (QC) | QC | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 26 | Verdana Homes Mamplasan | Laguna | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 27 | Mango Farm | Antipolo | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 28 | Casa San Pablo | Laguna | 80–200 | ₱120–220K | Bundled | T2–T3 |
| 29 | Estancia Resort Lipa | Batangas | 150–400 | ₱150–280K | Bundled | T2–T4 |
| 30 | Mountain Lake Resort Caliraya | Laguna | 100–300 | ₱150–280K | Bundled | T2–T3 |
| 31 | Costa Garden (Tagaytay) | Tagaytay | 100–250 | ₱120–220K | Preferred + corkage | T2–T3 |
| 32 | The Gardens at Eden's Best | Tagaytay | 80–200 | ₱120–220K | Preferred caterers | T2–T3 |
| 33 | Casa Marquez (Tagaytay) | Tagaytay | 100–250 | ₱130–250K | Preferred + corkage | T2–T3 |
| 34 | Lake Kanal | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 35 | Thunderbird Resort Rizal | Rizal | 150–400 | ₱180–350K | Bundled | T2–T4 |
| 36 | The Glass Garden BGC | BGC | 80–200 | ₱150–280K | Preferred caterers | T2–T4 |
| 37 | Acuatico Beach Resort | Batangas | 100–300 | ₱180–400K | Bundled (destination) | T3–T5 |
| 38 | Boracay Sands | Boracay | 100–400 | ₱2,500–4,500/pax | Resort-bundled | T2–T5 |
| 39 | Movenpick Mactan | Cebu | 150–400 | ₱2,500–4,000/pax | Resort-bundled | T2–T4 |
| 40 | Bluewater Maribago | Cebu | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 41 | Costa Pacifica Baler | Aurora | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 42 | Astoria Palawan | Palawan | 100–300 | ₱2,500–4,000/pax | Resort-bundled | T2–T4 |
| 43 | El Nido Resorts | Palawan | 80–250 | ₱4,000–8,000/pax | Premium destination | T4–T5 |
| 44 | Two Seasons Coron | Palawan | 100–250 | ₱2,800–4,500/pax | Resort-bundled | T3–T5 |
| 45 | Misibis Bay | Albay | 100–300 | ₱2,500–4,000/pax | Resort-bundled | T3–T5 |
| 46 | Vista Mar Cebu | Cebu | 100–300 | ₱2,200–3,500/pax | Resort-bundled | T2–T4 |
| 47 | Henann Lagoon Boracay | Boracay | 150–400 | ₱2,800–4,500/pax | Resort-bundled | T3–T5 |
| 48 | Antonio's Garden | Tagaytay | 60–150 | ₱120–200K | Bundled | T2–T3 |
| 49 | Casa Maria Tagaytay | Tagaytay | 80–200 | ₱120–220K | Preferred + corkage | T2–T3 |
| 50 | Greenhills Garden Square | San Juan | 100–300 | ₱150–280K | Preferred caterers | T2–T3 |

### 11C. Restaurants (intimate, all-inclusive · 50–150 guests)

| # | Restaurant | Area | Capacity | Typical ₱/pax | Tier Span |
|---|---|---|---|---|---|
| 1 | Casa Marcos Banquet Hall | QC | 50–150 | ₱1,500–2,500 | T1–T2 |
| 2 | Antonio's Restaurant | Tagaytay | 50–120 | ₱2,500–4,000 | T2–T4 |
| 3 | Sonya's Garden Restaurant | Tagaytay | 50–150 | ₱1,500–2,800 | T1–T3 |
| 4 | The Old Manila (Peninsula) | Makati | 50–120 | ₱3,000–4,500 | T3–T4 |
| 5 | Spiral (Sofitel) | Pasay | 80–200 | ₱2,800–4,000 | T2–T4 |
| 6 | Cabalen | Multiple | 80–200 | ₱1,200–2,000 | T1 |
| 7 | Almon Marina | Multiple | 50–150 | ₱1,500–2,500 | T1–T2 |
| 8 | Madison 101 (QC) | QC | 100–250 | ₱1,200–2,000 | T1–T2 |
| 9 | Las Flores | BGC | 50–120 | ₱1,800–2,800 | T1–T3 |
| 10 | Café 1771 (El Pueblo) | Ortigas | 50–120 | ₱1,800–2,800 | T1–T3 |
| 11 | Annabel's | QC | 50–150 | ₱1,200–2,000 | T1–T2 |
| 12 | Mamou (Rockwell) | Makati | 40–80 | ₱2,000–3,200 | T2–T3 |
| 13 | Apartment 1B | Makati | 40–80 | ₱1,800–2,800 | T1–T3 |
| 14 | Wildflour (Forbes) | Makati | 40–80 | ₱2,000–3,200 | T2–T3 |
| 15 | Lucky Chinatown Function Hall | Manila | 100–300 | ₱1,200–2,000 | T1–T2 |
| 16 | Tisa Filipinas | Makati | 50–150 | ₱1,500–2,500 | T1–T2 |
| 17 | Cibo di M | Makati | 50–120 | ₱1,500–2,500 | T1–T2 |
| 18 | Romulo Café | Multiple | 50–120 | ₱1,500–2,500 | T1–T2 |
| 19 | Manam | Multiple | 60–150 | ₱1,200–2,000 | T1 |
| 20 | Sofia's Garden | Tagaytay | 50–120 | ₱1,500–2,500 | T1–T2 |
| 21 | Bag of Beans | Tagaytay | 60–150 | ₱1,200–2,200 | T1–T2 |
| 22 | Marcia Adams | Tagaytay | 50–120 | ₱1,500–2,500 | T1–T2 |
| 23 | Balay Dako | Tagaytay | 100–300 | ₱1,200–2,200 | T1–T2 |
| 24 | Breakfast at Antonio's | Tagaytay | 60–150 | ₱1,500–2,500 | T1–T2 |
| 25 | Verbena (Discovery Country Suites) | Tagaytay | 80–200 | ₱2,000–3,200 | T2–T3 |
| 26 | Café Voi La | Tagaytay | 60–150 | ₱1,500–2,500 | T1–T2 |
| 27 | Nurture Wellness Village | Tagaytay | 60–150 | ₱1,500–2,800 | T1–T2 |
| 28 | Casa Vela | Manila | 50–120 | ₱1,500–2,500 | T1–T2 |
| 29 | Dolce | Multiple | 50–120 | ₱1,500–2,500 | T1–T2 |
| 30 | Café Adriatico (LRI Plaza) | Makati | 60–150 | ₱1,500–2,500 | T1–T2 |

### 11D. Catholic Churches with Wedding Cost Estimates

> **Disclaimer**: Donations vary widely based on parishioner status, day/time slot, choir/musician add-ons, length of ceremony. Verify with each parish directly. The figures below reflect typical reported ranges from common knowledge.

#### Premium Heritage / Iconic Churches (₱40K–150K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 1 | San Agustin Church | Intramuros | ₱60K–150K | UNESCO heritage; iconic colonial-era |
| 2 | Manila Cathedral | Intramuros | ₱40K–100K | Catholic seat of Manila Archdiocese |
| 3 | Santuario de San Antonio | Forbes Park, Makati | ₱40K–100K | Forbes elite parish |
| 4 | Santuario de la Sagrada Familia | Tagaytay | ₱40K–80K | Tagaytay premium |
| 5 | Caleruega Church | Nasugbu | ₱40K–100K | Hilltop, destination |
| 6 | Mary the Queen Parish | Greenhills | ₱30K–80K | Greenhills/San Juan elite |
| 7 | Christ the King Mission Seminary | QC | ₱30K–60K | Modernist architecture |
| 8 | St. James the Great Parish | Ayala Alabang | ₱30K–80K | Alabang elite |
| 9 | St. Andrew the Apostle | Bel-Air, Makati | ₱30K–60K | Bel-Air parish |

#### Major Metro Manila Parishes (₱20K–50K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 10 | Don Bosco Makati | Makati | ₱25K–50K | Salesian-run |
| 11 | Sanctuary of the Holy Face | San Juan | ₱25K–50K | San Juan parish |
| 12 | EDSA Shrine | Mandaluyong | ₱20K–40K | Marian shrine |
| 13 | Immaculate Conception Cathedral | Cubao | ₱20K–40K | Cubao seat |
| 14 | St. Anne Parish | Taguig | ₱15K–35K | Taguig parish |
| 15 | Most Holy Redeemer Parish | Mandaluyong | ₱15K–35K | Mandaluyong |
| 16 | Our Lady of Guadalupe | Makati | ₱15K–30K | Guadalupe |
| 17 | St. John Bosco Parish | Tondo | ₱10K–25K | Tondo |
| 18 | Christ the King Parish | Greenmeadows | ₱20K–40K | Greenmeadows |
| 19 | Our Lady of Lourdes Parish | QC | ₱20K–40K | Retiro |
| 20 | Holy Family Parish | Roxas District, QC | ₱15K–30K | QC parish |

#### Standard Parish Churches (₱5K–25K typical)

| # | Church | Area | Donation Range | Notes |
|---|---|---|---|---|
| 21 | Quiapo Church | Manila | ₱8K–25K | Black Nazarene |
| 22 | Binondo Church | Manila | ₱8K–25K | Chinatown |
| 23 | Santo Niño Parish (multiple) | Multiple | ₱5K–20K | Various locations |
| 24 | San Isidro Labrador | Multiple | ₱5K–20K | Various |
| 25 | St. Anne Parish (Hagonoy) | Bulacan | ₱5K–15K | Provincial |
| 26 | San Pedro Parish (Laguna) | Laguna | ₱5K–15K | Provincial |
| 27 | Most parish churches outside Metro | Provincial | ₱3K–10K | Lower donations |
| 28 | Diocesan shrines (provincial) | Provincial | ₱8K–20K | Standard parish rate |
| 29 | Chapels in subdivisions | Suburban | ₱5K–15K | Smaller weddings |
| 30 | School chapels (alumni-only typically) | Various | ₱10K–30K | Members/alumni |

#### Christian Protestant / Other (₱5K–30K typical)

| # | Church Type | Donation Range | Notes |
|---|---|---|---|
| 31 | Born Again Christian | ₱5K–25K | Varies widely by congregation |
| 32 | Iglesia ni Cristo | ₱5K–20K | Members-only weddings |
| 33 | Methodist | ₱10K–30K | Established congregations |
| 34 | UCCP | ₱5K–20K | Various locations |
| 35 | Episcopal / Anglican | ₱15K–30K | Few PH parishes |
| 36 | Christian Non-denominational | ₱5K–25K | Wide variation |

#### Civil Ceremonies (₱500–₱3K typical)

| # | Venue | Donation/Fee | Notes |
|---|---|---|---|
| 37 | City Hall Marriage Office (Manila/QC/Makati/etc.) | ₱500–1,500 | Civil registrar fees |
| 38 | Judge / Justice of the Peace | ₱2K–5K | Officiant fee + court fees |
| 39 | Mayor's Office (small towns) | ₱500–1,500 | Mayor as officiant in some LGUs |

### 11E. Additional Ceremony Options

- **Beach/destination ceremonies** at Boracay, Palawan, Cebu — bundled with resort venue
- **Private home / family chapel ceremonies** — coordinator-arranged, no parish donation
- **Garden ceremony at reception venue** — 30–60% of garden estates host both ceremony + reception

---

## 12. Open Items for V1.5 Vendor Data Collection

When Din Phase 3 opens vendor onboarding, prioritize collecting:

1. **Venue inclusion manifests** — every package's full list of bundled extras (cake tiers, suites, car hours, flowers scope, AV details)
2. **Recommended caterer pairings** — which caterers each venue prefers; corkage rates for outside
3. **Stylist `absorbs_categories[]`** — what each stylist's full-service tier actually includes
4. **Photographer coverage scope** — pre-nup / wedding / SDE / album declarations per studio
5. **Church wedding donations** — current published rates (most PH parishes don't publish online; this is direct outreach)
6. **Capacity ranges per layout** — venues often quote one max but support multiple layouts at different counts
7. **Pricing per-pax tiers** — Silver/Gold/Platinum or equivalent breakdowns
8. **Tier self-declaration** — vendors declare which per-head tiers (T1–T5) they fit

---

*Last updated: 2026-05-10. Tier model: per-head spend, 5 tiers (Simple / Charming / Grand / Distinguished / Luxurious). Wedding flow: tier-first wizard with stick-or-play budget flexibility. Vendor registration mirrors the plan builder's match criteria. Sub-events linked via parent_event_id; sibling events linked via linked_to_event_id. Post-wedding coordination tasks include marriage cert pickup, honeymoon, registry. This reference is illustrative; verify all venue data and prices through direct vendor contact or post-Setnayan-Din verified listings.*
