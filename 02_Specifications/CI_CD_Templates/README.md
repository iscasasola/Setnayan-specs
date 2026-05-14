# CI/CD Templates

Drop these into the new monorepo at `.github/workflows/` on first commit.

## Files

- **`build.yml`** — runs on every PR + push to `main`. Jobs:
  - Install (pnpm cache primer)
  - TypeScript (`turbo run typecheck`)
  - Lint (`turbo run lint`)
  - Build (`turbo run build`) — with placeholder env vars for Next.js public bundle
  - Unit tests (`turbo run test`)

- **`schema-check.yml`** — runs only when files under `supabase/migrations/` change. Spins up an ephemeral Postgres 15 service, applies every migration in order, and fails the build if any table is missing Row-Level Security. Enforces the pattern documented in [`RLS_Policy_Pattern.md`](../RLS_Policy_Pattern.md).

## Prerequisites in the monorepo

- `.nvmrc` at the repo root with the Node version (e.g. `20`)
- `pnpm-lock.yaml` committed
- Every `package.json` exposes the scripts: `typecheck`, `lint`, `build`, `test` (turbo passes through to whichever app/package defines them)
- `turbo.json` includes those four tasks with appropriate `dependsOn`

## Vercel deploys (separate from these workflows)

Per `CLAUDE_Code_Build_Prompt.md`, Vercel auto-deploys:
- `main` → production (setnayan.com + admin.setnayan.com)
- every PR → preview URL

Vercel handles its own build, so `build.yml` here only validates that the code compiles in CI — it does not deploy. Avoid running `vercel` CLI from these workflows.

## Secrets to add in GitHub repo settings

`build.yml` uses **placeholder** Supabase values so the public bundle compiles without leaking real keys. Real secrets only need to live in Vercel project settings + `.env.local` (see `../../.env.example` for the full list).

If you later add jobs that hit real services (e.g. E2E tests, deploy-preview comments), add the corresponding secrets to `Settings → Secrets and variables → Actions` and reference them as `${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}` etc.
