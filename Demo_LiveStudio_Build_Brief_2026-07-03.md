# Demo Build Brief — LIVE STUDIO / PANOOD (homepage tile 04)

**Trigger:** the owner says **"let's do live studio."** Execute this brief end-to-end.
**Goal:** the Panood tile's hero ("For everyone who couldn't be there.") gains a button —
suggested label: **"Try the control room — two phones"** — opening the mini control-room pop-up.

## The demo (owner-locked, DECISION_LOG 2026-07-03)
1. Opening the pop-up mints a fresh session + **ONE QR** (unique per open). Both phones scan the
   same QR → each becomes a live camera (`max_claims: 2` on the token; slots 1 + 2 in claim order).
2. Phone page: camera only (getUserMedia) with a **"live camera — nothing recorded"** notice.
   NOTHING is stored — live streams only (the light-privacy design).
3. The desktop pop-up is the **CONTROL ROOM**: the program view (selected camera fullscreen in
   the card), a **simple overlay** on top (a lower-third — monogram + "· LIVE"), and **two camera
   thumbnails as the switcher** — click to CUT between cam 1 / cam 2.
4. **Tech:** WebRTC — phone `getUserMedia` → `RTCPeerConnection` to the desktop viewer; SIGNALING
   over **Supabase Realtime channels** (channel per session token — no new infra); **public STUN
   only, NO TURN in V1** — on connection failure show the graceful fallback: "Video couldn't
   connect on this network — phone and computer on the same Wi-Fi usually does it."
5. **Strategic:** this is the codebase's FIRST real video plumbing — structure the
   signaling/peer code as a reusable lib (`lib/demo-webrtc.ts` or similar) since it's groundwork
   for the real Live Studio media core (memory `project_setnayan_panood_controller_build`).

## Privacy
Nothing recorded, nothing stored — a one-line notice on the phone + pop-up covers it. No consent
flow needed beyond the notice (no face registration, no uploads).

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
