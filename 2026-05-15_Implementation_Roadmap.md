# Setnayan V1 — Implementation Roadmap

**Generated:** 2026-05-15 · **Updated:** 2026-05-15 (added Decision 7 + 0000 chrome drift)
**Source:** CLAUDE.md decision log (seven 2026-05-15 rows) + App_Build_Status.md gap analysis + Setnayan-App `seo-foundation` worktree survey + owner-confirmed production chrome screenshot (2026-05-15 evening)

## Critical immediate blocker (run before any feature work)

```bash
cd ~/Setnayan/.claude/worktrees/seo-foundation
npx supabase db push --db-url "$SUPABASE_DB_URL"
```

Applies the 6 migrations that landed 2026-05-14 EOD but haven't shipped to production. Without it, half of V1 features that exist in code are broken in prod. Estimated 15 minutes including verification.

## Phase 1 — Quick wins (Week 1)

### Decision 5 — Theme rebrand
**Effort:** S (1–2 days) · **Risk:** Low · **Dependency:** None

- Add CSS variables for burgundy default (rename "Setnayan Default" → "Setnayan Default Color", accent `#7A1F2B`) and Forest & Champagne Gold (`#2D4A3A` primary + `#C9A66B` gold) to `apps/web/app/globals.css`
- Expand `users.theme_preference` ENUM with `forest_champagne` value (idempotent ALTER TYPE)
- Update theme picker UI to show 5 options
- No design dependency · zero data migration · purely additive

### Decision 1 — Self-review hard-gate
**Effort:** M (3–7 days) · **Risk:** Medium · **Dependency:** Phase 1.1 (db push)

- Schema: new tables `user_devices` + `vendor_review_appeals` + column `users.address_normalized` + `vendor_reviews.no_self_review` CHECK + `block_related_account_review()` BEFORE INSERT trigger
- UI: cart self-purchase confirm modal (Pay full price / Comp for myself), disabled review CTA + appeal flow, admin moderation queue at `/admin/reviews`
- Closes the fake-review fraud vector while preserving legitimate dual-role purchases

### Decision 7 — Event lifecycle lock + 0000 chrome drift fix
**Effort:** S–M (1–3 days) · **Risk:** Low · **Dependency:** None (no schema changes)

**Source spec rows:** CLAUDE.md decision log 2026-05-15 "Event lifecycle locked" row § BUILD GAPS · 2026-05-14 "Top-nav redesign locked + token-wallet pill removed from chrome" row · `0000_app_shell_and_navigation/0000_app_shell_and_navigation.md` § event switcher · `0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md` § 9.

**Part A — no-self-delete (do-not-build rule, audit only):**

- No code change required. The rule says: do not surface a "Delete event" / "Archive event" / "Remove event" affordance in any user-facing surface.
- Audit task: grep `apps/web/` for any existing event-delete UI (`deleteEvent`, `archiveEvent`, `removeEvent`, `event-delete`, etc.). If anything surfaces, remove it. Admin console Delete (0023, PR #9) already ships and stays.
- 0025 § "Active event within next 30 days · Contact support to discuss deletion" copy is now the canonical removal prompt — generalize the existing copy to apply regardless of how imminent the event is (drop the 30-day predicate; keep the contact-support escalation).

**Part B — chrome drift (BUILD GAP confirmed in production 2026-05-15 evening):**

Production today ships chrome that violates two locked specs simultaneously:

- **Drift A:** Top-left anchor is the global Setnayan brand logo (`[S] SETNAYAN` wordmark) instead of the per-couple monogram with caret ▾ event-switcher entry point. Result: the `+ Add event` row spec'd in 0000 § event switcher is unreachable.
- **Drift B:** Top-nav rendered as two stacked rows (`[S SETNAYAN] ............... [Sign out]` over `[← Maria & Juan (Demo)] .......... [🔔] [I-avatar]`) instead of the single persistent strip locked on 2026-05-14.

**Fix in `apps/web/`** (start with `SharedSiteHeader` or whatever it landed as per `setnayan-platform` commit `ab66995 feat(0000): shared SiteHeader with context-aware Create account CTA`):

- Replace the top-left brand logo with the per-couple monogram component. Monogram label = couple's initials ligature (e.g., `M&J` for "Maria & Juan") — source from `events.couple_initials` or derive from `events.partner1_first_name` + `events.partner2_first_name`. Fallback to a single-letter monogram if only one partner name exists.
- Wire the monogram as a button with caret ▾ → opens the event switcher dropdown (anchored top-left).
- Event switcher dropdown contents (per 0000 § event switcher):
  1. `+ Add event` row at the top — opens the 6-tile event-type picker (Wedding selectable; baptism/debut/birthday/anniversary/religious_event tiles render with "Coming soon" badges and are unpickable until 0041 ships in V1.5).
  2. List of user's existing events (most-recent first), each with name + date + role badge if the user is dual-role on different events.
- Collapse the two stacked rows into one persistent strip: `[Monogram ▾] ............... [🔔] [Avatar]`. Drop the standalone `← Maria & Juan (Demo)` back-pill — the event name is implicit in the monogram label, and the back-navigation on a single-event user has nowhere meaningful to go.
- Avatar dropdown stays as already speced (Settings · Notifications · Help · Tour replay · Sign out per 0021 § canonical profile-avatar dropdown).

**Verification:**

- Manual: open `www.setnayan.com` after deploy → confirm single-row chrome, monogram top-left, caret-affordance opens switcher, `+ Add event` row is visible, no "Delete event" surface anywhere.
- E2E: extend `apps/web/tests/` (or wherever Playwright lives) with `event-switcher.spec.ts` — visit dashboard, click monogram, assert switcher opens, assert `+ Add event` row visible.

**No schema changes. No migrations. Pure UI/component work.** Reuses existing `events` data already shipped.

## Phase 2 — Marketplace integrity (Week 2, parallel)

### Decision 3 — Public-stats exclusion
**Effort:** M (3–7 days) · **Risk:** Low · **Dependency:** Phase 1.1 (db push)

- Schema: 2 materialized views (`vendor_public_completed_events_stats` filters out team/internal/self-comp; `vendor_full_completed_events_stats` shows everything) + column `vendors.show_team_bookings_in_backend_count` (default FALSE)
- UI: vendor dashboard "Completed events" card with public-vs-private toggle, event-switcher Shop/Admin console rows for multi-role users
- Empty-state monogram split by role (vendor → Shop console, admin → Admin console direct)

### Decision 6 — Vendor visibility + Website editor
**Effort:** M (5–8 days) · **Risk:** Medium · **Dependency:** Phase 1.1 (db push)

- Schema: `vendors.public_visibility ENUM('hidden','coming_soon','verified','archived') DEFAULT 'coming_soon'` + new tables `site_widgets` + `platform_availability`
- UI: DIY-browse "Verified only" toggle (OFF by default → coming-soon vendors visible with badge), admin Website editor at `/admin/website` with on/off toggle + drag-drop reorder per page
- Per-widget config (stats thresholds, store URLs) stays code-locked in V1; admin config-editing deferred to V1.1

## Phase 3 — Design-blocked (Weeks 3–5)

### Decision 4 — Public-website wholesale redesign
**Effort:** L (1–3 weeks) · **Risk:** Medium · **Dependency:** Owner art direction

- BLOCKED on design direction per `App_Build_Status.md` Phase 3 list
- 12 new sections per locked spec (iteration 0015 § Section-by-section spec) — replaces current ~8-section page at `apps/web/app/page.tsx`
- Cross-cutting standards: WCAG 2.2 AA · Core Web Vitals budgets (LCP <2.5s · INP <200ms · CLS <0.1) · Taglish language switcher · sticky mobile thumb-zone CTA
- **Owner-side prerequisite:** provide wireframes / mockups / art direction before engineering starts

## Phase 4 — Post-V1 (deferred)

### Decision 2 — Native apps Windows/macOS/iOS/iPadOS/Android
**Effort:** XL (1+ month) · **Risk:** High · **Dependency:** Apple Developer Program enrollment

- Tauri 2 desktop wrapper exists for macOS + Windows (unsigned) in `src-tauri/`
- iOS + Android targets not configured in `tauri.conf.json`
- Apple Developer Program enrollment ($99/yr) pending per `App_Build_Status.md` Phase 3 blockers
- **Recommendation:** ship V1 launch via web first; native apps in V1.5 once V1 metrics validate the investment

## Parallel agent execution (2026-05-15 evening)

4 engineering agents spawned in parallel by Claude Code orchestrator, each in its own worktree branched off `origin/main`:

| Agent | Decision | Branch | Estimated PR completion |
|-------|----------|--------|-------------------------|
| A | #5 Theme rebrand | `claude/theme-rebrand` | 1–2 hours |
| B | #1 Self-review hard-gate | `claude/self-review-gate` | 4–6 hours |
| C | #3 Public-stats exclusion | `claude/public-stats-exclusion` | 3–5 hours |
| D | #6 Vendor visibility + Website editor | `claude/widget-editor-and-vendor-visibility` | 5–8 hours |
| E | #7 Event lifecycle + 0000 chrome drift fix | `claude/event-lifecycle-and-chrome-fix` (to be spawned) | 2–4 hours |

Agents A–D were spawned earlier 2026-05-15. Agent E covers the seventh decision row (added 2026-05-15 evening after owner confirmed the chrome drift visually). Owner reviews + merges in any order — Agent E has zero overlap with A–D because it only edits the shared `SiteHeader` component and event-switcher dropdown; safe to run in parallel. Decisions 4 and 2 remain pending (art direction / V1.5 sequencing).

## Sequencing notes for the owner

1. **Run `supabase db push` first thing tomorrow morning** — this is the single highest-leverage unblock.
2. **Spawn Agent E (Decision 7 chrome drift) immediately** — highest user-visibility per-day-of-work ratio of any pending item. Without this fix, the seventh decision row is paper-only (users have no path to `+ Add event`). 2–4 hour scoped agent, no schema risk.
3. **Review and merge agents' PRs as they land** — Agents A–E are scoped to not conflict (each in its own feature branch).
4. **Don't start Decision 4 (website redesign) until you have design direction** — engineering would be guessing without it.
5. **Defer Decision 2 (native apps) explicitly** — re-evaluate after V1 launch validates demand.
6. **Schedule a status review session after the 5 PRs land** — confirm V1 launch readiness and decide on Decisions 4 + 2 sequencing.

## Cumulative effort estimate

With 1 engineer reviewing + merging the 5 PRs: **~1 week to V1-launch-ready** (excluding Decision 4 which adds 1–3 weeks once unblocked).
With 2 engineers: **~3–5 days to V1-launch-ready** (excluding Decision 4).
Native apps (Decision 2): deferred to V1.5 (~1 month additional engineering).

## How to use this file

This is the **Track-2 (engineering) handoff** for the seven 2026-05-15 Cowork (Track-1, spec) decisions. The workflow:

1. **Cowork session** locks decisions in `CLAUDE.md` decision log + iteration `.md` files + memory (spec-only, no code).
2. **This roadmap** translates those locked decisions into per-decision engineering briefs with effort estimates, file paths, branch names, and dependencies.
3. **Engineering session** (a fresh Claude Code agent or human engineer) reads ONE decision section from this file, opens the product repo, writes the code, opens a PR on the named branch, merges.

For a new Cowork session: append-only — when a new decision row lands in `CLAUDE.md`, add a matching section here AND a new agent row in the parallel-execution table. Don't rewrite history.

For a new engineering session: read `CLAUDE_Code_Build_Prompt.md` first (V1-level context), then ONE decision section from this file, then the referenced iteration `.md` files. Stay scoped.
