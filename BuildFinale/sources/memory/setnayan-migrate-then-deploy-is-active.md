---
name: setnayan-migrate-then-deploy-is-active
description: "setnayan-platform applies migrations BEFORE it puts new code live — the 'Vercel and the migration workflow race' comments in the repo are stale, so a signature-fallback rung is usually unnecessary"
metadata:
  type: project
---

Measured 2026-09-08 (PR #5332, the shutter-minute build). `deploy-prod.yml`'s
gate step — "Gate — is migrate-then-deploy configured?" — printed **✅ Configured**
on that day's `main` runs, and the job's steps ran in this order, all success:
`Apply pending migrations (db push) — BEFORE deploy` → `Trigger Vercel production
deploy (post-migration)`.

So **the deploy window where new code is live against an un-migrated database does
not exist on this pipeline today.** Several in-repo comments still assert that
"Vercel and the migration workflow both fire on a push to main and race" — they
date from before the cutover and are stale, including the one on
`app/api/papic/guest-capture/route.ts`'s signature-fallback ladder.

**Why it matters:** it changes whether a signature-fallback rung is worth adding
when you add an argument to an RPC. It usually is not — and on
`app/papic/actions.ts` a rung actively breaks
`the-meter-is-the-only-door.test.ts` (see [[setnayan-order-mint-and-table-rosters]]).
Check the OTHER half too: if the error path already returns a code that is NOT in
`PAPIC_TERMINAL_ERRORS`, the offline queue keeps the item and a later drain lands
it, so nothing is lost by waiting.

**How to apply:** never assert the race from a code comment. Re-measure with
`gh run list --workflow=deploy-prod.yml --branch main --limit 1` then
`gh run view <id> --log | grep -E "Configured|DORMANT"` — the gate is dormant
unless `VERCEL_DEPLOY_HOOK_URL` plus three Supabase secrets are all set, and it
can be turned off again. Keep a rung only where a fallback prevents a SILENT
DEGRADATION rather than a retryable outage (the guest ladder's 8→7 step is kept
because skipping to the 6-arg shape records every clip as a photo).
