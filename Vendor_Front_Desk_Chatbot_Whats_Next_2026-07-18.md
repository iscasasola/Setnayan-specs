# Vendor Auto-Reply Assistant — What's Next / Build Handoff (2026-07-18)

> Resume doc for the vendor AI Auto-Reply Assistant build. Design lives in
> [Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md](Vendor_Front_Desk_Chatbot_Build_Plan_2026-07-18.md).
> This doc captures **exactly** what's shipped, the repo/workflow facts learned
> the hard way, and the precise remaining work so the next session can build
> without re-grounding. Everything is behind `NEXT_PUBLIC_VENDOR_AUTOREPLY_V1`
> (default OFF) — nothing is live.

## 0. Status at a glance

| Phase | What | State |
|---|---|---|
| Design | Full build plan + prototype | ✅ complete |
| **1** | Schema + RLS + flag | ✅ **MERGED** (PR #3397) |
| **2** | Deterministic reply engine (pure) | ✅ **MERGED** (PR #3399, 2026-07-19 — incl. the CI typecheck fix; see correction below) |
| **3a** | DB→snapshot adapter (pure) | ✅ **MERGED** (PR #3399) |
| **3b** | Live inbox hook (service-role write + `after()` trigger + daily cap) | ⛔ NOT built — **NEXT** |
| **4** | My Shop config UI | ⛔ NOT built |
| **5** | Pro layer (voice / precompute / self-serve deep-search / analytics) | ⛔ NOT built |
| **6–7** | Productivity + re-engagement | ⛔ NOT built |
| **§4A** | Compatibility auto-accept (token hold) | ⛔ NOT built (distinct concern) |

**36/36 unit tests green** across the engine + adapter (`node:test`).

> ⚠ **CORRECTION 2026-07-19:** PR #3399 did NOT sail through CI as this doc implied. The required **`typecheck + lint` check FAILED** — TS18048/TS2532 strict-null errors in `adapter.test.ts` + `answer.ts`. The "36/36 tests green" claim was true only under the type-erased `tsx --test` runner, which never type-checks. A fix was pushed 2026-07-19 (parallel task). **Lesson: always run the full `tsc --noEmit` before pushing, not just `tsx --test`** — the test runner erases types and will happily pass code the required CI check rejects.

## 0b. Orchestration metadata (for the multi-stream "What's Next" runner)

> A meta-session compiles all `*_Whats_Next_*.md` docs and runs them in parallel/
> sequence, checking gaps. This block is what the orchestrator schedules on.

```yaml
stream: vendor-auto-reply-assistant
status: in-progress            # Phases 1, 2, 3a MERGED; NEXT = Phase 3b (unblocked)
external-blockers:
  - none — PR #3399 (engine + adapter) MERGED 2026-07-19; Phase 3b is UNBLOCKED and ready to start
internal-sequence:             # MUST run in this order (each = its own PR)
  - 3b   live inbox hook
  - 4    My Shop config UI      # can start once 3b's vendor_bot_config write shape is settled
  - 5    Pro layer
  - 6-7  productivity + re-engagement
  - 4A   compatibility auto-accept   # after 3b; independent of 4/5 (can parallel them)
parallel-safe-with: all unrelated streams (whole stream is flag-gated, default OFF)
conflict-surfaces:             # files/DB OTHER streams likely also touch -> SERIALIZE or rebase
  - supabase/migrations/*      # ANY parallel migration MUST use `pnpm migration:new` (round-prefix hook + collision guard) — THE #1 parallel rule
  - apps/web/lib/chat.ts (ChatMessageRow, fetchMessages) + lib/chat-send.ts (sendChatMessageCore)   # 3b edits these
  - vendor dashboard nav / "My Shop" menu shell   # Phase 4 adds an entry
  - vendor_web_dossiers RLS    # Phase 5 adds vendor-read; the admin deep-search stream owns this table
reuse-read-only:               # consumed, not modified -> low conflict
  - lib/compat-score.ts, lib/event-brief.ts, lib/vendor-services.ts loaders, lead_token_holds RPCs, vendor_market_stats
safety-gates:
  - flag NEXT_PUBLIC_VENDOR_AUTOREPLY_V1 stays OFF until wired + an activation call
  - DPO/counsel review of couple-faith consumption (§7C) — gates ACTIVATION, not the (flag-gated) build
  - per phase: its own PR + auto-merge; re-run the adversarial Workflow gate
gap-checks:                    # verify before/while building
  - (SATISFIED 2026-07-19) #3399 merged — Phase 3b is unblocked
  - before pushing ANY phase: run full `tsc --noEmit` (CI typecheck), not just `tsx --test` (which erases types)
  - the "My Shop" nav route actually exists before Phase 4 wiring
  - no other merged stream renamed/moved chat_messages/chat_threads or the vendor-dashboard shell
  - flag name still NEXT_PUBLIC_VENDOR_AUTOREPLY_V1
```

## 1. Repo & workflow facts (save yourself the re-discovery)

- **Home-rooted repo.** Git root = `/Users/icecasasola` (git-dir `/Users/icecasasola/.git`). `apps/web` is a **subdirectory**; migrations live at **`/Users/icecasasola/supabase/migrations/`** — NOT `apps/web/supabase/` (that holds only 2 stray files). **Always `git -C <dir>` / `pnpm -C <dir>`; NEVER `git add .`** (home has ~GBs of untracked junk).
- **Remote:** `github.com/iscasasola/setnayan-platform`. `gh` is authed.
- **Migration timestamps MUST be allocated:** `pnpm -C /Users/icecasasola/.claude/worktrees/<wt> migration:new "<name>"` (runs `scripts/new-migration.mjs`). A **pre-push githook (`.githooks`) REJECTS round `YYYYMMDD000000` prefixes** (cross-branch collision guard, "bitten 4×"). The allocator fetches origin/main and picks a non-round prefix that sorts after the tip. The tip moves fast (was `20270822205100` at build time).
- **Feature flag:** `lib/*-flag.ts` exporting `xxxEnabled()` reading a `NEXT_PUBLIC_*` env. Ours: `apps/web/lib/vendor-autoreply-flag.ts` → `NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` (default OFF). `vendorAutoReplyEnabled()`.
- **Changelog:** create a NEW `changelog.d/<slug>.md` with `## YYYY-MM-DD · type(scope): summary` + a `SPEC IMPACT:` line. **Never** edit `CHANGELOG.md`/`STATUS.md` in a feature PR.
- **Tests:** `node:test` + `node:assert/strict`, colocated `*.test.ts`. Runner is `tsx --test "lib/**/*.test.ts"` (`test:unit`). `tsx` is at `/Users/icecasasola/node_modules/.bin/tsx` (main checkout — the **worktree has no node_modules**). Run ours:
  `/Users/icecasasola/node_modules/.bin/tsx --test "/Users/icecasasola/.claude/worktrees/vendor-chatbot/apps/web/lib/vendor-autoreply/*.test.ts"`.
  Type-only imports are erased at runtime, so pure modules run without pulling heavy deps.
  **⚠ `tsx --test` does NOT type-check** (types are erased) — it happily passes code the required CI `typecheck + lint` (`tsc --noEmit`) rejects. This exact gap FAILED #3399's CI (TS18048/TS2532 strict-null in tests). **Before pushing, run the full `tsc --noEmit`** (from the main checkout `/Users/icecasasola`, which has node_modules) or expect CI to catch strict-null / unused-symbol errors `tsx` didn't.
- **Worktree:** `/Users/icecasasola/.claude/worktrees/vendor-chatbot`. For a new phase: `git -C /Users/icecasasola fetch origin main && git -C <wt> checkout -b claude/vendor-autoreply-<phase> origin/main`.
- **PR flow:** `gh pr create --repo iscasasola/setnayan-platform --base main --head <branch> …` then **`gh pr merge <#> --auto --merge`** (standing default, never ask). Required CI: `typecheck + lint`, `production build`, `playwright e2e (chromium)`, `migration timestamp guard`, `secret scan`, `lighthouse`, `bundle size`, Vercel, + many `lint:*` scripts. Auto-merge waits for green; `BLOCKED` = checks pending (normal).
- **Adversarial verification gate:** the `Workflow` tool (multi-agent review → adversarial verify) was used on Phase 1 (caught a stale-timestamp bug) and Phase 2 (caught 3 real bugs: fabricated per-hour duration, booking-handoff bypass, service-as-place coverage). **It consumes session tokens; the session limit was hit 2026-07-18 (resets 5am Asia/Manila), disabling it.** Re-run it over 3b when tokens are back.

## 2. What's built (files)

- **Migration** `supabase/migrations/20270822679405_vendor_autoreply_v1_schema.sql` (MERGED): tables `vendor_bot_config` (PK `vendor_profile_id`; `enabled`, `mode`, `daily_reply_cap`, `voice_profile` jsonb, `auto_accept_enabled`, `auto_accept_threshold` default 78, `daily_auto_accept_cap`, `reply_in_couple_language`, `learn_from_past_messages`), `vendor_reply_templates`, `vendor_bot_replies` (`intent`, `confidence` NUMERIC(4,3), `action` reply|clarify|handoff|auto_accept, `was_llm`, `compat_score`); columns `chat_messages.is_bot`, `chat_threads.compat_score_at_inquiry` + `compat_reasons`. RLS: vendor-team via `current_vendor_ids(...)` + `is_admin()`; log/template tables are engine-written via **service_role** (bypasses RLS).
- **`apps/web/lib/vendor-autoreply/`** — `types.ts` (normalized `VendorStoreSnapshot` + `EventBriefLite` + `EngineInput`/`EngineDecision` contract), `intents.ts` (`classifyIntent`), `answer.ts` (`buildAnswer` — templated from store, cannot misquote), `engine.ts` (**`decideReply(input)`** — the entry point), `adapter.ts` (`toStoreSnapshot(sources, now?)`, `toEventBriefLite(brief)`). Each has a `.test.ts`.
- **Flag** `apps/web/lib/vendor-autoreply-flag.ts`.

## 3. Phase 3b — the live inbox hook (NEXT — detailed spec)

**Goal:** after a couple posts a message in a thread whose vendor has the bot enabled, run the engine and either post an AI-labeled bot reply or flag a handoff. **Pre-acceptance front desk only** — no token, no auto-accept (that's §4A). Keep it flag-gated.

### 3b.1 `is_bot` plumbing
- Extend `ChatMessageRow` (`lib/chat.ts`) with `is_bot?: boolean`; add `is_bot` to the `fetchMessages` select list (it currently isn't selected). Render a visible **AI label** on `is_bot` messages in the thread UI (couple + vendor side) per §2B — never disguised as a human vendor. First-message notice copy TBD (§8).

### 3b.2 Bot write path (service-role)
- `sendChatMessageCore` (`lib/chat-send.ts`) derives `sender_role` from the **live user** and cannot set `is_bot` → **not usable by the bot.** Write a new service-role insert (precedent: the service-role client used across `lib/*.ts`, e.g. `lib/pending-inquiries.ts`). Insert a `chat_messages` row: `thread_id`, `event_id`, `vendor_profile_id` (from the thread), `sender_user_id = null`, `sender_role = 'vendor'`, `is_bot = true`, `body = replyText`. Service_role bypasses RLS.

### 3b.3 Orchestrator `runVendorAutoReply({ threadId })` (service-role)
1. `if (!vendorAutoReplyEnabled()) return;`
2. Load thread → `vendor_profile_id`, `event_id`.
3. Load `vendor_bot_config` for the vendor. `if (!config?.enabled) return;`
4. **Daily cap:** count `vendor_bot_replies` for this vendor with `created_at >= start-of-day`. `if (count >= config.daily_reply_cap) return;`
5. Load the couple's **latest** message body (the trigger) = `inquiryText`.
6. **Build store snapshot:** `fetchVendorServices` + `fetchInclusionsByService` + `fetchDiscountsByService` + `fetchAddonsByService` + packages + `fetchVendorCoverages` + reviews preview (`lib/vendor-reviews-preview.ts`) + `vendor_market_stats` avg/count → `toStoreSnapshot(sources)`.
7. **Build event:** load the `events` row → `buildEventBrief(source)` (`lib/event-brief.ts`) → `toEventBriefLite(brief)`.
8. **Availability signal (optional):** compute `dateAvailable` for `event.primaryDate` from calendar/`daily_capacity`. **Must be keyed to `primaryDate`** (adapter contract in `types.ts`). If not computing yet, pass `signals` undefined (engine gives a soft "let me confirm").
9. `const decision = decideReply({ inquiryText, store, event, signals });`
10. **`reply`/`clarify`:** post the bot message (3b.2) → insert `vendor_bot_replies { action, intent, confidence, message_id, was_llm:false }`.
    **`handoff`:** insert `vendor_bot_replies { action:'handoff', intent, confidence, message_id:null }` + optionally raise a "needs you" flag on the thread. Do **not** post a message.

### 3b.4 Trigger + loop-guard
- Fire from the couple-message path: in `sendChatMessageCore` (or `chat-actions.sendChatMessage`) after a successful insert where `senderRole === 'couple'`, schedule `after(() => runVendorAutoReply({ threadId }))` (Next.js `after()`, precedent in `lib/pending-inquiries.ts` / `lib/lead-token-holds.ts`) so it doesn't block the couple's response. Guard with the flag.
- **Loop-guard:** only trigger on `senderRole === 'couple'` — never on the bot's own `sender_role='vendor'`/`is_bot=true` message (no infinite loop).

### 3b.5 Verification
- The pure snapshot build is already tested (adapter). The DB wiring (cap query, orchestrator) can't be fully unit-tested — verify by careful review + `test:db` (`tsx --test "tests/db/*.db.test.ts"`) if a test DB is wired. **Re-run the adversarial Workflow over 3b when the session limit resets.**

## 4. Phase 4 — My Shop config UI
- **Placement (§11A):** vendor dashboard → **My Shop** menu → "Auto-Reply Assistant" page (NOT dashboard/Home). Quick on/off toggle in the Messages header (deep-links to the config).
- Surfaces (mirror the published prototype): enable/disable, daily reply cap, voice profile editor + preview (Pro), compatibility auto-accept threshold + cap (Pro), "Deep Search your business" (₱500), the **Sources & Data** panel (§7B — what powers the AI + RA 10173 data rights), handoff rules, smart triage, analytics.
- Writes `vendor_bot_config` (RLS `current_vendor_ids('admin')`). Confirm the exact My Shop nav route at build.

## 5. Phase 5 — Pro layer
- **Voice profile:** derive once from the vendor's **own outgoing** `chat_messages` (`sender_role='vendor'`) + the deep-search dossier; vendor edits/approves (§2A: never train on couples' text or other vendors'). **Precompute** ~15–20 natural phrasings per `(intent × service/package)` into `vendor_reply_templates`; extend `answer.ts` to pick a precomputed phrasing in the vendor's voice, injecting live numbers → ₱0 runtime, still can't misquote. The precompute (Haiku) is the **only** LLM cost.
- **Self-serve "Deep Search your business" (§7A):** reuse `lib/vendor-deep-search.ts` (currently **admin-only** — add vendor-read RLS to `vendor_web_dossiers` + a vendor-triggered action). **₱500/run; first run FREE with the vendor's first subscription purchase.**
- Language auto-detect; lead analytics from `vendor_bot_replies`; Market Intel / Demand Radar (Pro-and-up, existing).

## 6. Phases 6–7 — productivity + re-engagement (owner-approved 2026-07-18)
Daily overnight briefing · smart inbox triage (reuse `compat-score.ts`) · quote/proposal card (reuse the Proposal Maker + existing `chat_messages` proposal cards) · appointment proposing (reuse Appointments / `thread_calls`) · post-event review request · booking-milestone updates · cold-lead nudge (**accepted-threads only, opt-in, capped, AI-labeled**) · price-position insight. **Not building:** mass broadcast, multichannel/SMS, comment-to-DM.

## 7. Compatibility auto-accept (§4A — ✅ BUILT #3418 flag-dark; ⚠ token-decouple owed)
Vendor sets a **% threshold** (including **accept-all** = threshold 0). Auto-accept **iff** `compat_score ≥ threshold` AND not flagged AND under the daily auto-accept cap → post a voice welcome citing `explainCompatScore()` reasons. Snapshot `compat_score_at_inquiry` + `compat_reasons` on `chat_threads`. Show the vendor the raw **%** + tier bands.

> **🚨 CORRECTION 2026-07-21 — tokens RETIRED, decouple #3418.** The shipped Phase 4A (#3418) was built 2026-07-19 **coupled to the token hold** (`unlock_vendor_event_hold` / `lead_token_holds`, "no tokens → no auto-accept"). **Tokens are now retired** ([[project_setnayan_token_retirement]]), so that gate is moot and vendors can **accept all**. **Follow-up:** strip the token-hold coupling from #3418 — auto-accept must gate purely on **compat threshold (incl. accept-all) + daily auto-accept cap + fake-flag exclusion** (`get_lead_trust_flags` / `detect_inquiry_concentration`), NO token hold. This is a fix on merged code.

## 8. Open sign-offs / gates
- **DPO/counsel:** couple-**faith** consumption in the vendor-AI flow (§7C) — keep flag-gated pending the NPC/DPO review. Faith feeds only via the explicit faith profile → `faithFit`, never inferred.
- **Activation — the exact flip:** set env var **`NEXT_PUBLIC_VENDOR_AUTOREPLY_V1=true`** (the reader `vendorAutoReplyEnabled()` accepts `true` / `1` / `TRUE`; `true` is the repo convention). To disable, remove it or set any other value. ⚠ **Flipping it now does NOTHING visible** — the engine/adapter aren't wired until Phase 3b (inbox hook) + Phase 4 (config UI) ship, and it's still behind the DPO/faith review. Keep OFF until the wiring exists AND an activation call (do not flip during free-during-launch on your own).
- **Cosmetic copy:** exact AI-tag string ("⚡ AI auto-reply · [Business]") + the first-message couple notice.
- **Pricing already locked (build plan §9):** model (B) free-by-capability; voice-match Pro; Deep Search ₱500/run (first free with first sub); vendor sets compat threshold; no-tokens→no-auto-accept.

## 9. How to resume (checklist)
1. #3399 is **MERGED** (2026-07-19) — `main` already has `lib/vendor-autoreply/` (types/intents/answer/engine/adapter) + the schema. Just `git -C /Users/icecasasola fetch origin main` and branch off it (the old `claude/vendor-autoreply-engine` worktree branch is now merged/stale).
2. Fresh branch: `git -C <wt> checkout -b claude/vendor-autoreply-inbox origin/main` (or a new worktree).
3. Build 3b per §3 above. Any migration → `pnpm migration:new`. Tests → `tsx --test`.
4. `changelog.d/` fragment; commit (with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`); `gh pr create` + `gh pr merge --auto --merge`.
5. **Re-run the adversarial Workflow** over 3b once session tokens allow — it is the quality gate that caught real bugs in 1 & 2.
