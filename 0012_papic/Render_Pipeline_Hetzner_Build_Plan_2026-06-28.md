# Papic / Setnayan Render Pipeline — Hetzner Build Plan (2026-06-28)

> **⚠ SUPERSEDED for the prototype phase by [`Render_Prototype_Oracle_30s_2026-06-28.md`](Render_Prototype_Oracle_30s_2026-06-28.md)** (owner 2026-06-28: prototype on Oracle Always-Free, ₱0, 30-second videos only → FFmpeg-only, no Remotion/Chromium, server scope = Auto-Recap). Keep this doc as the *paid-scale / Remotion* reference for when Auto-Recap outgrows the free box.

> **Group B of the Papic completion program.** Owner chose **Hetzner VM pool (self-host)** for the FFmpeg/Remotion render workers (2026-06-28). This doc is the activation-ready plan: architecture, the `render_jobs` contract, the owner-action gate, and a one-command provisioning script. Code does NOT ship to prod until the box + a music seed exist (see Gate).

## Why this is gated (read first)

The render pipeline is the keystone for **Personal Reels**, **Auto-Recap (60–90s)**, **Stories** (the free story-maker), and (via the same workers) **XMP/EXIF embedding**. *(SDE was retired 2026-06-28 — PR #2362; no longer a render target.)* It is blocked on two **owner-only** inputs:

1. **The Hetzner box** — a VM the worker runs on. Needs the owner's Hetzner account + payment + an SSH key. I cannot provision it; the script below does it once creds exist.
2. **Owned music + template assets** — server-side rendering with non-owned music makes Setnayan the direct infringer (locked decision, [[project_setnayan_no_video_render_pipeline]]). Renders need (a) the owned AI-generated music catalogue (Suno) and (b) the Remotion/Lottie/LUT template manifests. Until at least a **small owned seed set** exists, reels/recap have nothing to score audio against.

Building the full worker blind (no box, no real asset formats) would be speculative and untestable — so this stages the runnable infra + a firm contract, and stops at the gate rather than shipping a band-aid.

## Architecture (locked direction)

- **Renderer = Remotion + Lottie + LUTs** (corpus lock: "all renders template-driven via Remotion + Lottie + LUTs", no manual editor). Remotion renders a React composition headlessly (Chromium + FFmpeg under the hood) → 1080×1920 H.264 MP4. The Hetzner box runs a small **render-worker** service:
  - polls `render_jobs` (Supabase) for `queued` rows (FIFO, `FOR UPDATE SKIP LOCKED`),
  - pulls source media from R2 (photos, couple clips) + the owned music track + the template manifest,
  - runs `remotion render` for the chosen composition,
  - uploads the MP4 to R2, writes `render_jobs.output_r2_ref` + `status='done'`, notifies (Next `after()` webhook or the guest/couple polls status).
- **No new cron** (corpus lock [[project_setnayan_cron_free]]) — the worker is a long-running systemd service that polls; the web app enqueues via a server action.
- **Cost** stays R2-only at the storage layer; compute is the flat Hetzner box (predictable, matches the OSS/self-host preference).

## `render_jobs` contract (to apply WITH the worker, not before)

```
render_jobs(
  job_id              public_id 'R',          -- S89R-...
  event_id            bigint  → events,
  kind                text,                    -- 'personal_reel' | 'auto_recap' | 'stories' | 'xmp_embed'
  requested_by        bigint  → users (nullable for system),
  guest_id            bigint  → guests (nullable; personal reels),
  template_id         text,                    -- template_library manifest id
  music_track_id      text,                    -- owned catalogue id (null = silent)
  input_spec          jsonb,                   -- { photo_r2_refs[], clip_r2_refs[], target_duration_s, ... }
  status              text default 'queued',   -- queued|rendering|done|failed
  attempts            int default 0,
  output_r2_ref       text,
  last_error          text,
  created_at, started_at, finished_at
)  -- RLS: couple/guest reads own rows (current_event_ids); worker uses service role.
```

Worker claim RPC: `claim_render_job()` (SECURITY DEFINER, `SKIP LOCKED`) → one job, sets `rendering` + `started_at` + `attempts+1`. Idempotent re-runs: a `done` job with an `output_r2_ref` is never re-claimed.

## Web-side plumbing (ships flag-gated when the box is live)

Mirror the existing **offline-daemon flag pattern** (`NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED`): a `RENDER_PIPELINE_ENABLED` flag gates the enqueue UI so reels/recap buttons only appear once the worker is draining. Inert + verifiable (typecheck/build) until flipped. This avoids the "render pending forever" UX a band-aid would create.

- Personal Reels: the existing builder POSTs an enqueue server action → `render_jobs` row (`kind='personal_reel'`) → guest polls `status` → plays `output_r2_ref`.
- Auto-Recap: deterministic selection (timestamp clusters + sharpness/face/exposure heuristic — no AI) builds `input_spec`, enqueues `kind='auto_recap'`.
- Stories: resume the (free story-maker) build onto this contract. *(SDE half retired 2026-06-28.)*

## Owner-action gate (the only things blocking B)

1. Provision the box: run `provision-render-worker.sh` below on a fresh Hetzner CPX31 (Ubuntu 24.04), or create the VM and give me SSH + I run it.
2. Drop secrets into `/opt/setnayan-render/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, R2 creds (`R2_*`), and the music/template R2 bucket.
3. Greenlight the **music seed** (Suno) — even ~10 owned tracks unblock B2/B3; the full ~400 can follow.

Once 1–3 are done: I apply the `render_jobs` migration, ship the worker + flag-gated web plumbing, render a test reel end-to-end, then flip `RENDER_PIPELINE_ENABLED`.

## `provision-render-worker.sh` (owner runs once)

```bash
#!/usr/bin/env bash
# Setnayan render worker — Hetzner provisioning (Ubuntu 24.04, run as root).
set -euo pipefail

# 1. System deps: Node 22, ffmpeg, headless-Chromium deps for Remotion.
apt-get update
apt-get install -y curl ffmpeg ca-certificates gnupg \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
corepack enable

# 2. App dir + service user.
id setnayan &>/dev/null || useradd --system --home /opt/setnayan-render --shell /usr/sbin/nologin setnayan
install -d -o setnayan -g setnayan /opt/setnayan-render

# 3. Drop the worker bundle here (CI publishes services/render-worker/ as a tarball),
#    then `pnpm install --prod` in /opt/setnayan-render. Placeholder until B ships:
echo "Place the render-worker bundle in /opt/setnayan-render and create .env (see plan)."

# 4. systemd service — long-running poller (NO cron, per the cron-free lock).
cat >/etc/systemd/system/setnayan-render.service <<'UNIT'
[Unit]
Description=Setnayan render worker (Remotion + FFmpeg)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=setnayan
WorkingDirectory=/opt/setnayan-render
EnvironmentFile=/opt/setnayan-render/.env
ExecStart=/usr/bin/node /opt/setnayan-render/dist/worker.js
Restart=always
RestartSec=5
# Renders are CPU-heavy; keep the box responsive.
Nice=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable setnayan-render.service
echo "Provisioned. After dropping the bundle + .env: systemctl start setnayan-render && journalctl -u setnayan-render -f"
```

## Sequence once unblocked

B1 worker service (Remotion render of one composition, R2 in/out, `claim_render_job`) → B2 Personal Reels enqueue+poll+play → B3 Auto-Recap selection+enqueue → B4 XMP/EXIF embed job kind (face tags + capture metadata as XMP sidecars) → B5 resume Stories (free story-maker) onto the contract. Each is a verified PR; the worker's ffmpeg/Remotion command builder is unit-tested in isolation.
