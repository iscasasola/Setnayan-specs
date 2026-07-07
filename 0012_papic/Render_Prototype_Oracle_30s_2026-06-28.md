# Papic Render Prototype — Oracle Always-Free + 30s cap (2026-06-28)

> **Group B, re-scoped (owner 2026-06-28): "Prototype Group B on Oracle Always Free — ₱0. We will only do 30-second videos."** This supersedes the Hetzner build plan (`Render_Pipeline_Hetzner_Build_Plan_2026-06-28.md`) for the prototype phase. The 30s cap + ₱0 box simplify the architecture sharply.

## What the 30s cap changes

1. **All outputs are ≤30s, 1080×1920 H.264.** Personal Reels (already 1–30s), Stories (30s), and **Auto-Recap dropped from 60–90s → 30s**.
2. **FFmpeg-only — drop Remotion/Chromium for the prototype.** A 30s photo/clip montage (Ken-Burns pan/zoom + crossfades + one music bed) is well within plain FFmpeg `filter_complex`. This avoids dragging headless Chromium onto a free ARM box. ⚠ **Softens the "Remotion + Lottie + LUTs" corpus lock** — flagged for owner awareness. Remotion can layer back in later for richer motion; FFmpeg-first is the right ₱0/ARM prototype call.
3. **The server's only real job is Auto-Recap.** Everything ≤30s is *client-renderable*, and the **Stories client render already ships** (`lib/patiktok-render.ts` + `guest-story-maker`). So **Personal Reels + Stories stay on-device (₱0, no box).** The Oracle box is needed only for **Auto-Recap** — the couple's auto-generated highlight that must run *with no device present*, over the *whole event's* captures. ⚠ Decision for owner: confirm this split (server = Auto-Recap only; client = Reels/Stories), or put Reels server-side too.

## The box — Oracle Always Free A1 (ARM)

- **VM.Standard.A1.Flex**, up to **4 OCPU + 24 GB RAM**, Always Free (₱0 forever). 200 GB block storage + 10 TB/mo egress free. Nearest region for PH: **Singapore**.
- Caveats (see the Oracle discussion in session): A1 capacity is contended ("out of capacity" on create — retry / off-peak / scripted retry); no SLA, reclaim risk (an always-polling worker is not "idle", which lowers it); credit card required at signup but no charge if pinned to Always Free; **arm64** packages.
- Architecture-wise identical to Hetzner — only the box underneath differs. If Auto-Recap ever becomes load-bearing, move the same worker to a paid Hetzner box.

## Still gated on music (unchanged)

Auto-Recap renders need a music bed we're licensed to use server-side (non-owned music server-side = infringement, locked). Either a **small owned seed (Suno)** or a **curated CC0/royalty-free set**. Until then the worker can render **silent** Auto-Recaps for end-to-end testing, then music drops in.

## `render_jobs` contract (prototype)

```
render_jobs(
  job_id        public_id 'R',   -- S89R-...
  event_id      bigint → events,
  kind          text,            -- 'auto_recap'  (reels/stories stay client-side)
  template_id   text,            -- montage template manifest id
  music_track_id text,           -- owned/CC0 catalogue id (null = silent)
  input_spec    jsonb,           -- { slots:[{ r2_ref, type:'photo'|'clip', dur_ms }], target_duration_s<=30 }
  status        text default 'queued',  -- queued|rendering|done|failed
  attempts int default 0, output_r2_ref text, last_error text,
  created_at, started_at, finished_at
)  -- RLS: couple reads own rows (current_event_ids); worker uses service role.
```

Claim RPC `claim_render_job()` (SECURITY DEFINER, `SKIP LOCKED`). The worker builds the FFmpeg command from `input_spec` via a **pure, unit-tested command builder** (`apps/web/lib/render/recap-ffmpeg.ts` — shipped this phase, testable without the box).

## ARM provisioning — `provision-oracle-render.sh` (owner runs once on the A1 box)

```bash
#!/usr/bin/env bash
# Setnayan render worker — Oracle Always-Free A1 (Ubuntu 24.04 ARM/aarch64), run as root.
# NOTE: creating the A1 instance itself often returns "Out of capacity" — retry in the
# OCI console (or a create-retry script) until one lands; this script runs AFTER it exists.
set -euo pipefail

# 1. Deps — FFmpeg-only (NO Chromium; the prototype renders with plain FFmpeg).
apt-get update
apt-get install -y curl ca-certificates gnupg ffmpeg
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -   # nodesource ships arm64
apt-get install -y nodejs
corepack enable
ffmpeg -hide_banner -version | head -1   # sanity: arm64 ffmpeg present

# 2. Service user + dir.
id setnayan &>/dev/null || useradd --system --home /opt/setnayan-render --shell /usr/sbin/nologin setnayan
install -d -o setnayan -g setnayan /opt/setnayan-render

# 3. Drop the worker bundle in /opt/setnayan-render + create .env with:
#    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, R2_* (endpoint/key/secret/bucket),
#    R2_PUBLIC_URL, MUSIC_BUCKET. Then: pnpm install --prod.
echo "Place the render-worker bundle in /opt/setnayan-render and create .env (see plan)."

# 4. systemd poller (NO cron — cron-free lock).
cat >/etc/systemd/system/setnayan-render.service <<'UNIT'
[Unit]
Description=Setnayan render worker (FFmpeg · 30s auto-recap)
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
Nice=5
[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable setnayan-render.service
echo "Provisioned. After bundle + .env: systemctl start setnayan-render && journalctl -u setnayan-render -f"
```

## Sequence

1. **Now (₱0, no box):** ship the pure FFmpeg 30s montage **command builder** + tests (this phase) — the worker's heart, verifiable in isolation.
2. **Owner:** grab an Oracle A1 (retry past "out of capacity"); decide music (owned seed vs CC0); confirm the server=Auto-Recap split + the FFmpeg-vs-Remotion call.
3. **Then:** apply `render_jobs` migration, drop the worker on the box (it shells the command builder), render a **silent** 30s Auto-Recap end-to-end, add music, ship Auto-Recap behind a flag.
