---
name: setnayan-s13-rehearsal-blocked
description: S13 end-to-end encoder rehearsal not started 2026-09-06 — needs a device separate from the one running the coding session; owner has 1 phone + 1 iPad + 1 MacBook
metadata: 
  node_type: memory
  type: project
  originSessionId: d27c7218-a672-4853-a1a3-1a53a780eceb
  modified: 2026-09-06T05:56:12.618Z
---

S13 (`build-sessions/encoder/S13.md`, plan-of-record: `build-sessions/encoder/README.md`) is the final "run the day like a couple would" end-to-end rehearsal across the whole S-series encoder build (S3 audio mixer, S6/S7 encoder+reconnect+recording, S8 key panel, overlays, manual-air). It was presented to a Claude Code session on 2026-09-06 and **not run at all** — paused before step 1.

**Why:** the rehearsal requires physically disconnecting the network and closing the lid of the machine being used, plus a real live YouTube stream, two-plus camera devices, and a separate guest device — none of which is compatible with running it FROM a coding session on the owner's only MacBook (that would kill the session itself). Owner's actual hardware: 1 phone, 1 iPad, 1 MacBook (no separate Windows machine, no legacy macOS 13/Intel machine, no third "guest" device). Owner does have a real YouTube channel available to stream to.

Also relevant per [[setnayan-encoder-replan-2026-09]]: the real end-to-end YouTube publish has been left undone three separate times before this (S6, S7, and S7's acceptance pass all substituted a local `ffmpeg` RTMP listener for a real YouTube key) — S13 was meant to finally close that gap and still hasn't.

**Pre-flight check done 2026-09-06 against `origin/main @ c2d009934e`:** S0–S11 and W1 all confirmed merged (verified via PR merges + changelog.d fragments, not just the README's claim). But S13 is not actually ready to run yet:
- **S12 (updater) does not exist** — no branch/PR/code beyond a bare `updater.pubkey` in `tauri.conf.json`; `capabilities/default.json` grants no updater permission. S10's own changelog says "S12 will consume" the manifest it produces. S13 step 9 (update-while-live check) has nothing to test.
- **No successful `build-desktop` run since S10/S11 merged** — the only two recent runs (2026-09-05) failed at notarization (Apple Program License Agreement still unaccepted, X0 item #1 still open as of the S11-merge commit). `/download` has likely never served a signed build from the current pipeline — a blocker for S13's SETUP step.
- Windows cert (X0 #3) still open — expected/fine to rehearse (SmartScreen warning IS the test).
- Prod flag values for `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` / `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` still unrecorded (X0 #4) — if either is off, the controller 404s before step 1 can start.

**How to apply:** when resuming, run S13 from a device that is NOT the one driving the Claude Code session — e.g. drive the rehearsal from an iPad/phone typing status back to a session running on a different machine, or have a human operator execute steps while a session elsewhere records results into `S13-REPORT.md`. Scope will still need to drop: no Windows leg, no macOS-13/Intel expected-fail leg (mark both "NOT RUN — no hardware" per the doc's own PASS/FAIL/PARTIAL format), and the "guest phone" step will need to substitute the iPad or a browser tab since there's no third device. Only one of {own-channel, hosted-channel} can be exercised per run given one Mac.
