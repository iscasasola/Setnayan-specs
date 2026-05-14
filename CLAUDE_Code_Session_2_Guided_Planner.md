# CLAUDE Code — Session 2 Directive · Guided Planner Priority

**Locked:** 2026-05-14
**Owner:** Ice
**Target:** Claude Code session paste-in (first message)

---

## How to use this file

Open Claude Code in your terminal with the working directory pointed at the Setnayan repo (the one with the codebase, not the specs folder). Paste the block below as your first message. Claude Code will read CLAUDE.md + the spec corpus and implement.

---

## Paste this into Claude Code

```
PRIORITY WORK: Implement the Guided Planner SKU per the 2026-05-14 spec lock.

1. Read these files in order (they're the source of truth):
   - CLAUDE.md — find the 2026-05-14 decision log entry titled
     "Guided Planner becomes optional paid SKU with 3-tier flat-price ladder"
   - 0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md § 0 (Access Model)
   - 0000_app_shell_and_navigation/0000_app_shell_and_navigation.md § Step 2.5a + 2.5b
   - 0034_payments_and_cart/0034_payments_and_cart.md § service_catalog
     (3 new SKUs at bottom of INSERT) + § 4.4 (3 new activation hooks at
     bottom of table)
   - 0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md
     § 2.0b (3 surface variants)
   - 0025_profile_settings/0025_profile_settings.md § 3.7 (Tab 7)

2. Implement in this order (each commit standalone + pushed to GitHub):

   COMMIT 1 — Migration
   - New migration file `supabase/migrations/<timestamp>_guided_planner.sql`
   - ALTER TABLE events ADD COLUMNS:
       guided_planner_status TEXT NOT NULL DEFAULT 'diy'
         CHECK (guided_planner_status IN ('diy', 'active', 'expired'))
       guided_planner_tier TEXT
         CHECK (guided_planner_tier IN ('1week', '3month', '12month'))
       guided_planner_expires_at TIMESTAMPTZ
   - INSERT INTO service_catalog the 3 new SKUs
     (guided_planner_1week ₱99, guided_planner_3month ₱999,
     guided_planner_12month ₱1,999) with category 'guided_planner'
   - Index on (guided_planner_status, guided_planner_expires_at) for the
     daily expiry sweep
   - RLS policies — couple can read their own event's guided_planner_*
     columns; admin can read all

   COMMIT 2 — Server actions
   - apps/web/app/dashboard/profile/guided-planner/actions.ts with:
       activateGuidedPlanner({eventId, tier, orderId})
       extendGuidedPlanner({eventId, additionalTier, orderId})
       cancelGuidedPlanner({eventId})
   - Idempotent: re-running activate with same orderId is a no-op
   - Add Postgres function activate_guided_planner(event_id, tier, order_id)
     for the 0034 § 4.4 activation hook trigger

   COMMIT 3 — Event creation flow update (iteration 0000)
   - apps/web/app/dashboard/create-event/page.tsx + actions.ts
   - Remove wedding_date, venue_name, venue_address fields from the form
   - Keep ONLY event_name (default placeholder "{first_name}'s Wedding")
   - After successful event create, route to /dashboard/[eventId]/choose-plan
   - New route /dashboard/[eventId]/choose-plan renders the 4-option choice
     card (DIY / 1-Week / 3-Month / 12-Month)
   - DIY → flip 'diy' status, redirect to /dashboard/[eventId]
   - Any paid tier → create service_order, redirect to /dashboard/[eventId]/orders/[orderId]
     (existing flow), but ALSO set events.guided_planner_status='diy' so
     dashboard renders properly until reconciliation completes

   COMMIT 4 — Dashboard surface variants (iteration 0021)
   - apps/web/app/dashboard/[eventId]/page.tsx
   - Render one of three surface variants based on guided_planner_status:
     A) DIY: 10-tile grid + upgrade banner (savings ladder, dismissible
        with 14-day re-show)
     B) Active: 9-step journey checklist + days-remaining strip
        + extend CTA; renewal nudge banner when < 14 days remaining
     C) Expired: greyed-out 9-step + reactivation banner
   - Pull journey state from event_journey_steps table
     (seeded on event creation, auto-completes on platform actions)

   COMMIT 5 — Settings Tab 7 (iteration 0025)
   - apps/web/app/dashboard/profile/page.tsx — add 7th tab "Guided Planner"
   - Hidden for vendor + admin roles
   - Renders status panel + plan comparison + activate/extend/cancel buttons
   - Event picker at top if user has multiple active events

   COMMIT 6 — Daily expiry cron job
   - apps/web/app/api/cron/guided-planner-expiry/route.ts
     (or Cloudflare Cron Trigger — pick whichever is provisioned first)
   - Runs daily at 00:00 PHT:
       UPDATE events
       SET guided_planner_status = 'expired'
       WHERE guided_planner_status = 'active'
         AND guided_planner_expires_at < NOW();
   - For each row updated, emit in-app notification + email
     (per 0028 templates — add a new template `guided_planner_expired`)
   - Secure with CRON_SECRET env var

   COMMIT 7 — Tests + acceptance
   - Test the choice card renders all 4 options
   - Test DIY → Active transition flips status correctly
   - Test extension stacks duration on top of existing expires_at
   - Test expired sweep flips status + sends notification
   - Test RLS prevents non-couple members from mutating

3. After all 7 commits land + push to GitHub:
   - Update STATUS.md with "Guided Planner SKU shipped 2026-05-14"
   - Update App_Build_Status.md — iteration 0016 status flips to ✅ Shipped,
     iteration 0000 ✅ updated note, iteration 0034 SKU count incremented,
     iteration 0021 surface variants noted, iteration 0025 Tab 7 noted
   - Append COWORK_INBOX.md entry: "[DONE 2026-05-14] Guided Planner
     3-tier SKU + DIY default · 7 commits"

4. Verify:
   - Run pnpm typecheck
   - Run pnpm lint
   - Run pnpm build (must pass with no warnings)
   - Smoke test on Vercel preview: create event, see 4-option card,
     pick DIY, land on dashboard, then activate from Settings → flip to
     Active surface
   - Lighthouse mobile must stay ≥ 90 on the dashboard route

5. If you hit any blocker, do NOT improvise — stop and write the blocker
   to BLOCKERS.md at repo root with file paths, exact errors, and what
   you tried. Then ask the owner before continuing.

Pricing reference (charm-priced per CLAUDE.md 2026-05-12 convention):
- guided_planner_1week:   ₱99 / 7 days
- guided_planner_3month:  ₱999 / 13 weeks (22% savings vs week-by-week)
- guided_planner_12month: ₱1,999 / 52 weeks (61% savings · flagship)

All amounts stored as centavos (×100) in service_catalog.price_php_centavos.
```

---

## Why this directive is sized this way

The 7-commit structure is deliberate:
1. Each commit is independently revertable
2. Each commit is shippable (DB migration first, then code, then UI, then tests)
3. The pricing references are at the bottom so Claude Code can't miss them
4. The acceptance criteria (typecheck, lint, build, Lighthouse) are mandatory before claiming "done"
5. The BLOCKERS.md fallback prevents Claude Code from hallucinating a fix when stuck

## After this work lands

Engineering moves to **Phase 1 of `Install_Sequence_V1.md`** — the foundation phase (DTI registration kicks off in parallel, Resend/Sentry/PostHog/Better Stack signups + wiring, etc.). The Guided Planner SKU is the highest-leverage feature lock before that broader foundation work; everything else compounds on this revenue mechanism existing.

## Cross-references

- **Decision log:** CLAUDE.md row dated 2026-05-14 starting "Guided Planner becomes optional paid SKU"
- **Canonical spec:** `0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md` § 0
- **Install sequence:** `02_Specifications/Install_Sequence_V1.md`
- **API checklist:** `API_Integration_Checklist.md`
- **Pricing convention:** CLAUDE.md decision log 2026-05-12 "Pricing convention — round prices flip to -1"
