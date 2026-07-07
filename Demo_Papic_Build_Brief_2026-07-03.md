# Demo Build Brief — PAPIC (homepage tile 03)

**Trigger:** the owner says **"let's do papic."** Execute this brief end-to-end.
**Goal:** the Papic tile's hero ("Every guest is a photographer.") gains a button — suggested
label: **"Try Papic — you and a friend, right now"** — opening the Papic demo pop-up.

## The demo (owner-locked, DECISION_LOG 2026-07-03)
1. Opening the pop-up MINTS A FRESH SESSION (unique QRs on every open — parallel visitors never
   collide): **two QR codes** ("You" / "Your friend"), each a one-time `/demo/j/[token]` link.
2. Phone scans → **consent screen** (required before any camera) → **registers their face**:
   the SHIPPED CLIENT-SIDE pipeline — face-api.js computes the embedding ON the phone
   (`lib/face-embed*.ts`); only the vector uploads; the server compares vectors with
   `lib/face-match-core.ts` (pure math, no server ML).
3. Phone takes photos — **HARD CAP 3 per session, enforced server-side** (`photo_count` on the
   session row, checked in the upload action).
4. Photos land in the desktop pop-up's **live mirror** (Supabase Realtime) with the friend
   **auto-tagged** via the vector match.
5. **The THEME (photo effect) is set ON THE DESKTOP POP-UP**, session-level (`style` column):
   the SHIPPED registry `PAPIC_STYLES` (`lib/papic-photo-styles.ts`: ORIG · RETRO · MONO · CINE ·
   LOMO). Changing it restyles the mirror instantly; **save-to-phone delivers the photo in the
   style currently set on the pop-up.**
6. Reuse the `/papic/join/[token]` join pattern + the Papic capture/upload plumbing where it fits.

## Privacy (non-negotiable)
Consent before camera · the demo session is an EPHEMERAL scope mirroring the per-event
face-scoping lock · embeddings + photos AUTO-PURGED at session end / the 60-min TTL (lazy expiry,
cron-free) · face data NEVER enters a durable store · R2 objects for demo photos use a
`demo/`-prefixed path so they're distinguishable and cleanable.

## Shared contract (identical in all three demo briefs — read before building)

**THE PATTERN (= the shipped Suri tile):** each demo tile's hero scene (already live) gains ONE
glass button (like Suri's `.hr-ai-cta` in `setnayan-ai-story.tsx` / `home-reskin.css`) that opens
the demo POP-UP in-world (an `OverlayShell` entry in `HomeOverlays.tsx` + a new `OverlayId`).
Never navigate to the old marketing chrome. Repo: `/Users/icecasasola/setnayan-db-push`
(setnayan-platform), homepage files under `apps/web/app/_components/home/`.

**SCAFFOLD-FIRST RULE (prevents three sessions forking three scaffolds):**
`git fetch origin` then check whether the shared demo scaffold exists on origin/main
(`supabase/migrations/*demo_sessions*` + `apps/web/lib/demo-sessions.ts`). Also
`gh pr list --search "demo-sessions scaffold" --state open`.
- Absent + no open PR → YOU build it as its OWN first PR (contract below), merge it, then build
  your demo on top.
- Open PR from another session → wait for its merge; do not fork a second scaffold.
- Present → reuse as-is.

**Scaffold contract:** migration via `pnpm migration:new "demo_sessions_scaffold"` (NEVER a
hand-typed round timestamp — push-blocked):
- `public.demo_sessions` — bigserial PK + `public_id` (house `generate_public_id`), `kind` TEXT
  CHECK IN ('papic','panood','plan3d'), `style` TEXT DEFAULT 'ORIG' (Papic's pop-up-set effect),
  `photo_count` INT NOT NULL DEFAULT 0, `meta` JSONB DEFAULT '{}', `created_at`,
  `expires_at` TIMESTAMPTZ NOT NULL DEFAULT now() + interval '60 minutes'.
- `public.demo_session_tokens` — token TEXT UNIQUE (generate via `extensions.gen_random_bytes`
  — SCHEMA-QUALIFIED, house gotcha), session FK CASCADE, `purpose` TEXT, `max_claims` INT
  DEFAULT 1, `claims` INT DEFAULT 0, `bound_ref` TEXT NULL (3D Plan binds a guest here).
- RLS ENABLED at CREATE TABLE, NO anon policies — all access via server actions with the admin
  client (entitlement never client-trusted).
- `lib/demo-sessions.ts` — `mintDemoSession(kind, slots)` (server-only): LAZY-PURGES expired rows
  first (`DELETE ... WHERE expires_at < now()` — the platform is CRON-FREE, no polling jobs),
  inserts session + tokens, returns join URLs `/demo/j/[token]`.
- `app/demo/j/[token]/page.tsx` — resolves the token server-side (expired → a kind "this demo
  ended" screen), dispatches to the kind's client component.
- Feature flag `platform_settings.homepage_demos_enabled` (tri-state, default NULL=OFF, mirror
  `setnayan_ai_per_user_enabled` + its resolver in `lib/integration-config.ts`). All demo UI
  (hero button included) renders ONLY when the flag is on — inert until the owner flips it.
- QR rendering: grep the repo for the existing QR generator (the Custom-QR-per-guest system
  ships one) and reuse it; do not add a new QR dependency without checking.

**House rules:** worktree off origin/main → PR → `gh pr merge --auto --merge` (standing default) ·
`changelog.d/<branch-slug>.md` fragment per PR (never edit CHANGELOG.md/STATUS.md) · migrations
apply via `supabase db push` (CLI password has been stale → fallback MCP `execute_sql` + insert
the exact-version ledger row, see memory `project_setnayan_migration_application`) · radius lint:
only `var(--m-r-*)` / `var(--hr-r*)` tokens, no px-literal border-radius · CHECK OPEN PRs before
touching `HomeReskin`/`HomeOverlays`/`pillars` (hot files; other sessions edit them — one-line
`OverlayId` additions conflict textually: rebase before push) · copy sells benefits, never names
tech (face-api/WebRTC are internal) · log notable decisions at the bottom of DECISION_LOG.md ·
verify in a local preview before shipping (pnpm install is fast via the store; copy
`apps/web/.env.local` from `/Users/icecasasola/.claude/worktrees/agent-a945a865f4f450034-code/apps/web/.env.local`;
the corpus `.claude/launch.json` pattern from 2026-07-03 shows how to run the worktree's dev
server with `autoPort`).
