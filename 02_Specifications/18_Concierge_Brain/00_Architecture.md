# 00 — Concierge Brain Architecture (Locked 2026-05-18 · rebranded 2026-06-29)

Technical architecture for the AI-powered evolution of the Setnayan
AI surface (iteration **0016**). Free-tier inference for the
DIY 3-question taste + trial, paid-tier Haiku 4.5 for the
₱499/28-day-cycle Setnayan AI subscription.

## 1. Goal

Evolve the existing Setnayan AI from a static 9-step checklist
into a conversational planner that answers couples' real questions
grounded in a curated Filipino-wedding knowledge base. Free for the
first 3 questions per event; sustained access via the
₱499/28-day-cycle Setnayan AI subscription (active from purchase
until the event date, then auto-ends right after the wedding).

## 2. Non-goals

- Not a generic Western wedding-planning chatbot (that's already
  available everywhere for free). The brain's value is Filipino-context
  fluency that competitors cannot match.
- Not a vendor matching algorithm. That lives in 0006 marketplace +
  the Guided-mode recommender. Setnayan AI can *refer* couples to
  vendor matches but doesn't replace the marketplace.
- Not a payment / cart agent. Setnayan AI can explain SKUs and
  pricing but checkout still happens in 0034.

## 3. End-to-end query flow

```
Couple types a question
         │
         ▼
[1] Free-question quota check (events.concierge_free_questions_used)
         │
         ├── exhausted + DIY → render trial-upsell card, do not call LLM
         │
         ▼
[2] Query embedding (Cloudflare Workers AI · bge-small-en-v1.5)
         │
         ▼
[3] pgvector retrieval — top-8 chunks from concierge_brain_chunks
    WHERE tier_visible_to ⊇ user.concierge_status
    ORDER BY embedding <=> query_embedding
         │
         ▼
[4] Cache check — was this (query_embedding_hash, retrieved_chunk_ids)
    answered in the last 24 hours? If yes → return cached response.
         │
         ▼
[5] Synthesis layer (tier-dependent):
    DIY + Trial: Llama 3.1 8B via Cloudflare Workers AI free tier
    Paid:        Claude Haiku 4.5 via Anthropic workspace (0032)
         │
         ▼
[6] Response post-processing:
    - Extract deep-link CTAs from chunk metadata
    - Sanitize against the "things NOT to say" sections of retrieved chunks
    - Stamp footer: "Sources: {chunk_titles}" (admin-toggleable)
         │
         ▼
[7] Quota increment (DIY only):
    UPDATE events SET concierge_free_questions_used = concierge_free_questions_used + 1
    If now = 3 → next interaction renders the trial-upsell card
         │
         ▼
Response rendered in chat UI
```

## 4. Models — what runs where

| Component | Model | Provider | Cost | Latency |
|---|---|---|---|---|
| Query embedding | `bge-small-en-v1.5` (384-dim) | Cloudflare Workers AI | Free up to 10K neurons/day | ~150 ms |
| Chunk embeddings (one-time + on-edit) | Same as above | Same | Free | ~150 ms/chunk |
| Vector search | pgvector `ivfflat` index | Supabase Postgres | Free | <50 ms for top-8 over ~150 chunks |
| Synthesis — DIY + Trial | `@cf/meta/llama-3.1-8b-instruct-fast` | Cloudflare Workers AI | Free up to 10K neurons/day | ~800–1500 ms |
| Synthesis — Paid | `claude-haiku-4-5` | Anthropic (workspace from 0032) | ~₱0.50/query | ~600–1000 ms |
| Response cache | Supabase Postgres (24h TTL) | — | Free | <20 ms |

**Free-tier sustainability math.** Cloudflare's 10K neurons/day caps
at roughly 1,500 synthesis requests/day at 8B-Llama-fast rates. At a
projected V1 launch traffic of ~100 new couples/day × 3 free questions
= 300 questions/day, that's ~20% of the daily free quota — comfortable
buffer for 5× growth.

**Paid-tier cost ceiling.** Claude Haiku 4.5 at ~₱0.50/query × ~50
questions per couple over the engagement = ~₱25 inference cost
per paid couple. Against ₱499/28-day-cycle recurring revenue across
the engagement, inference stays a low single-digit share of revenue
— negligible.

## 5. Schema additions

All new tables/columns sit alongside the existing 0016 Setnayan AI
schema. (The `concierge_*` table/column/action names below are the
shipped database identifiers and stay as-is — only the product name
and pricing rebrand.)

```sql
-- Brain chunks (the curated knowledge base)
CREATE TABLE concierge_brain_chunks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_file            TEXT NOT NULL,                  -- e.g. '01_Filipino_Cultural_Reference.md'
  chunk_title           TEXT NOT NULL,
  body                  TEXT NOT NULL,                  -- full markdown chunk body
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  applies_to            TEXT NOT NULL DEFAULT 'all',    -- audience filter
  cross_refs            TEXT[] NOT NULL DEFAULT '{}',
  paid_tier_only        BOOLEAN NOT NULL DEFAULT FALSE,
  tier_visible_to       TEXT[] NOT NULL DEFAULT ARRAY['diy','trial','active'],
  embedding             VECTOR(384),                    -- pgvector
  embedding_generated_at TIMESTAMPTZ,
  source_citation       TEXT,                            -- e.g. 'UCCP marriage handbook 2024'
  last_verified_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_by      UUID REFERENCES users(id),
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX concierge_brain_chunks_embedding_idx
  ON concierge_brain_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

CREATE INDEX concierge_brain_chunks_tier_idx
  ON concierge_brain_chunks USING GIN (tier_visible_to);

-- Conversation history (paid tier only — DIY is stateless)
CREATE TABLE concierge_conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE concierge_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id     UUID NOT NULL REFERENCES concierge_conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant')),
  body                TEXT NOT NULL,
  retrieved_chunk_ids UUID[] NOT NULL DEFAULT '{}',
  synthesis_model     TEXT,                              -- 'llama-3.1-8b' or 'claude-haiku-4-5'
  tokens_in           INT,
  tokens_out          INT,
  cost_centavos       INT NOT NULL DEFAULT 0,            -- per-message cost for billing/cost-watch
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Response cache (24h TTL)
CREATE TABLE concierge_response_cache (
  query_hash           TEXT PRIMARY KEY,                 -- SHA256 of (query_embedding_hash || retrieved_chunk_ids_sorted)
  response_body        TEXT NOT NULL,
  synthesis_model      TEXT NOT NULL,
  hit_count            INT NOT NULL DEFAULT 1,
  first_cached_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at           TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Free-question counter on events
ALTER TABLE events
  ADD COLUMN concierge_free_questions_used INT NOT NULL DEFAULT 0
  CHECK (concierge_free_questions_used >= 0 AND concierge_free_questions_used <= 3);
```

**Why 3 free questions specifically.** Locked in 0016 § 0a; see the
2026-05-18 decision log row for the product rationale.

## 6. Server actions

- `ask_concierge(event_id, user_id, question_text)` — full query
  pipeline above. Returns `{response, sources, remaining_free_questions, upgrade_card_state}`.
- `regenerate_chunk_embedding(chunk_id, admin_user_id)` — admin
  manual trigger when a chunk's body has been edited. Cheap (single
  Cloudflare neuron); idempotent.
- `nightly_brain_embedding_sweep()` — pg_cron candidate or on-access
  sweep per the locked 2026-05-14 cron strategy. Regenerates any
  chunk where `updated_at > embedding_generated_at`.
- `purge_stale_response_cache()` — DELETE FROM `concierge_response_cache`
  WHERE expires_at < NOW(). On-access sweep on every read.

## 7. Free-tier exhaustion flow

```
DIY couple asks Q1 → answer + "2 free questions left" footer chip
DIY couple asks Q2 → answer + "1 free question left" footer chip
DIY couple asks Q3 → answer (most useful answer · references prior 2)
                   + "You've reached your 3 free questions. Setnayan
                      AI can keep helping all the way to your wedding —
                      try 3 days free, no card needed."
                   + [Continue with Setnayan AI ₱499/mo] [Try 3 days free]
DIY couple asks Q4 → renders the upsell card only; no LLM call,
                     no quota charge. CTA leads to /dashboard's existing
                     Setnayan AI trial entry point (already shipped per
                     0016 § 0).
```

This matches the existing 3-day trial pattern. The conversational
brain is the **engine** that makes the trial worth taking — without
it, the trial is just unlocking checklist UI.

## 8. Paid-tier event-data integration

What makes the paid tier qualitatively different (not just unlocked
quota): the synthesis prompt for paid couples includes structured
context from their actual event:

```
You are Setnayan AI for {couple_names}'s wedding on
{wedding_date} in {venue_location}.

Event facts:
- Guest count: {confirmed} confirmed, {pending} pending
- Budget tier: {working_budget_tier}
- Vendors booked: {comma-separated category list with status}
- Outstanding payment milestones in next 30 days: {count and total ₱}
- Current planning journey step: {step_label}

Knowledge base context (top-8 retrieved chunks):
{chunk_bodies}

Couple's question: {question_text}

Answer in 2-4 short paragraphs. Reference their specific event facts
where relevant. If you need information not provided, say "I don't
have that detail yet — do you want me to {deep_link_action}?".
```

DIY tier gets only the chunk bodies, not the event facts. This is the
core moat: free answers are generic-but-Filipino-fluent; paid answers
are specifically about *their* wedding.

## 9. Failure modes + fallbacks

| Failure | Fallback |
|---|---|
| Cloudflare free-tier exhausted (>10K neurons that day) | Return chunk-1 body verbatim with a "more detail when daily quota resets" note. DIY-tier only — paid tier falls through to Haiku. |
| Haiku 4.5 rate-limited or down | Fall back to Llama 3.1 8B free tier (graceful degradation; logged) |
| pgvector query returns 0 chunks above similarity threshold | Return canned "I'm not sure about that yet — let me hand this to the team" message + create a `concierge_unanswered_questions` row for admin review (informs future brain authoring) |
| LLM returns clearly hallucinated content (off-brain claims) | V1: trust the prompt to enforce grounding. V1.5: add a verifier pass that checks claims against retrieved chunks before showing to couple. |

## 10. Admin surfaces (0023)

Three new admin tabs needed under `/admin`:

1. **Brain Editor** — list + edit `concierge_brain_chunks`. Markdown
   editor with live preview, tag autocomplete, cross-ref linker.
   Single-admin authority per the brain governance rule. Re-embed
   button per chunk.
2. **Unanswered Questions** — list of `concierge_unanswered_questions`
   rows. Admin can author a new brain chunk in response, or mark as
   out-of-scope. Drives brain growth from real demand.
3. **Cost Watch** — daily/weekly aggregate of `concierge_messages.cost_centavos`
   broken down by synthesis_model. Feeds into the existing
   `service_catalog_cost_watch` table pattern.

## 11. Acceptance tests (additions to 0016 tests.md)

- `test_diy_quota_enforcement` — couple in DIY can ask 3 questions;
  Q4 returns upsell card with zero LLM cost
- `test_free_tier_synthesis_uses_llama` — DIY + trial responses
  stamped with `synthesis_model = 'llama-3.1-8b'`
- `test_paid_tier_synthesis_uses_haiku` — active concierge responses
  stamped with `synthesis_model = 'claude-haiku-4-5'`
- `test_brain_retrieval_respects_tier_filter` — DIY couple asking a
  question that would retrieve a `paid_tier_only = TRUE` chunk gets
  alternative non-paid chunks instead
- `test_response_cache_hit` — second couple asking semantically
  identical question within 24h gets cached response (no LLM call)
- `test_paid_tier_uses_event_data_context` — Haiku prompt for an
  active concierge couple includes their guest count, venue, etc.;
  DIY prompt for same question excludes those
- `test_chunk_embedding_regenerates_on_edit` — editing a chunk's
  body marks it dirty; nightly sweep regenerates embedding within
  24h
- `test_haiku_fallback_to_llama_on_anthropic_outage` — simulate
  Anthropic 5xx; verify response served from Llama with degradation
  log row

## 12. V1.5+ deferred

- **Streaming responses.** V1 ships request-response; V1.5 adds SSE
  streaming so couples see the answer typing out.
- **Voice input.** Tap-to-talk Tagalog/English microphone input.
- **Verifier pass.** Second LLM call that checks the synthesis output
  against retrieved chunks for unsupported claims.
- **Multi-language synthesis.** V1 answers in English; V1.5 mirrors
  the 0025 EN/TL/CEB locale toggle.
- **Conversational memory beyond paid tier.** DIY answers are stateless
  in V1; V1.5 could add 1-hour ephemeral memory within a single session
  to make the 3 free questions feel more connected.
- **Honeymoon planning depth.** Listed as paid-tier-only in the README;
  full content authoring is a V1.5 project after V1 ships.
