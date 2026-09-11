---
name: setnayan-encoder-replan-2026-09
description: The E0–E9 desktop encoder plan was audited and replanned to X0 + S0–S13 + W1 on 2026-09-05; Path A lock was priced on wrong relay figures; artifact + audit files locations
metadata: 
  node_type: memory
  type: project
  originSessionId: ca8478b1-15d8-4fb7-b165-d916c0cfa711
  modified: 2026-09-05T03:02:06.463Z
---

On 2026-09-05 the ten-session desktop encoder plan (E0–E9, from `setnayanencoderplan.zip`) was audited against `origin/main @ 118546afe` and replanned. Published page: https://claude.ai/code/artifact/dfa993e3-4229-4b50-a7ec-8c2e3a7eff35

Key facts that survive the session:
- Three sessions had false premises: E2 (guards retired `WatermarkReason`; real overlays are `ResolvedOverlays`/`airOverlays`), E3 (no programme audio exists — needs a mixer), E6 (stream key is deliberately server-rendered into the controller for OBS).
- The Path A (₱0, no media server) lock of 2026-09-03 was made on wrong figures: ₱500–1,000 is a *compositing* relay; a remux relay via `canvas.captureStream → WHIP → MediaMTX → ffmpeg -c:v copy` needs no WebCodecs/Rust/install and costs ~₱15–20/wedding if provisioned hourly. HLS-direct (browser HTTPS PUT to YouTube HLS ingest) is an untested 2-hour CORS spike that could delete native entirely.
- WebCodecs in WKWebView is documented ON; the gate is Safari 26's WebKit → floor macOS 14 + Apple silicon.
- Replan: Path A 33–48 session-days / 6–10 weeks; B-remux 15–24 days. Owner wants a December launch; S0–S10 buildable at ₱0 now.
- Owner questions still open (as of writing): the fork; Windows signing route; OS floor messaging; hiding the browser key reveal on desktop; free-tier branding §4c contradiction; prod values of the two env flags.

- Default tier streams on the couple's OWN channel by hand (paste watch link; key is theirs) — `live-studio-manual-air.ts`. Setnayan pool channels are only the hosted-channel add-on (`LIVE_STUDIO_HOSTED_CHANNEL`, ruling 2026-09-02). YouTube quota/pool ceilings apply only to the add-on tier.

- **Plan of record (2026-09-05, owner asked for the best approach): NATIVE (Path A) re-affirmed** on true figures — own-channel default scales free, no undocumented dependency, app-controlled encoding, laptop keeps the recording. Launch target Mon 2026-12-07; Phase 0 week of 2026-09-07; Windows cert order 2026-10-12; first OBS-free stream milestone W9 (2026-11-06); rehearsal wedding W12. Launch plan page: https://claude.ai/code/artifact/331d962c-15f5-4d12-8f3d-cf7274f1b9bd

- **S6 LANDED 2026-09-05** — PR #5213 (`d29161517`), and the encoder MOVED in PR #5215: it is now its own crate at `src-tauri/crates/encoder` (`setnayan-encoder`), re-exported as `setnayan_desktop_lib::encoder`. So S5's `contract.rs` is at `src-tauri/crates/encoder/src/contract.rs` — **it already exists; S5 mirrors it in TypeScript rather than writing a second one** (the S5/S7 prompts in the repo were updated to say so). The crate has no tauri dependency on purpose: `cargo test -p setnayan-encoder` now runs as a blocking STEP inside `typecheck + lint` (42 tests, 20s on the runner). A `cargo test` JOB would have blocked nothing — only that job is required, and ci.yml's header records nine guards that spent months red-but-harmless. The transport stays swappable (`EncodedChunk::parse` / `::from_json_array`) because S5's envelope is still the open owner decision. `cargo run --example publish_probe -- --url … --key … --seconds 1200` is the tool for the **real 20-minute YouTube publish, still LEFT UNDONE** (needs a live stream key).

- **S7 MERGED 2026-09-06 — PR #5223** (S3 = #5224 merged just before it, no collision), branch `claude/encoder-s7-reconnect-recording`. Reconnect + backup ingest + local `.flv` recording. Three new modules in the encoder crate: `tagger.rs` (`Tagger`/`WireGate`/`Pipeline`), `reconnect.rs` (`supervise`, backoff 1/2/4/5 s capped, backup after 3 primary failures, grace window), `file_sink.rs` (`FlvFileWriter`, 20 GB warn / 2 GB refuse, `~/Movies/Setnayan/<event-id>-<date>.flv`). **The clock and the FLV tagging had to move OUT of `sender.rs`** — `RtmpClock` was a field of `RtmpSender` and a reconnect builds a new one, so timestamps restarted at 0 after four hours; `sender::run` now takes `&mut Pipeline`. Encoder tests 42 → 77.
  🔑 **Defect the tests found, worth remembering as a shape:** the supervisor records while the TCP handshake is in flight, so a first connection routinely consumes the `Config` chunk before a socket exists — arming the header re-send only on RECONNECTS left the FIRST session publishing media with no `avcC`/`asc`, undecodable, with no error anywhere. `supervise` now re-announces on EVERY session. A "first time is the simple case" assumption was exactly wrong.
  Still LEFT UNDONE, same as S6: the real 20-minute YouTube publish (needs a live stream key). Tool is ready — `publish_probe` gained `--realtime`, `--backup-url`, `--record` and runs through `supervise`.
  ⚠ `DEFAULT_GRACE` = 120 s is a GUESS (YouTube says "a minute or two"); **S13 measures it** — do not cite it as measured.

- **S3 LANDED 2026-09-05** — PR #5224 (merge `191f3672c`). Programme audio + the master clock:
  `apps/web/lib/encoder/audio-{mixer,clock,packer,tap.worklet}.ts`, and **S1's
  `program-clock.ts` is DELETED** — the canvas worker has no `setInterval`/`rAF`/`setTimeout`
  at all; both timelines descend from one integer (`slot = ⌊frames/1600⌋`,
  `PTS = round(frames × 1e6 / 48000)`). Two brief errors corrected and pinned by assertions:
  the tick is **12.5** quanta not 12.8, and `AudioData.timestamp` deltas **cannot** be
  `=== 1024/48000 s` in integer µs (a per-packet `+= 21333` ends a six-hour wedding 337.5 ms
  behind). ⚠ **The shipped worklet is `apps/web/public/encoder/audio-tap.worklet.js`, not the
  `.ts`** — `addModule()` fetches a URL and evaluates it as a module script, so nothing under
  `lib/` can be in that path; a test loads both and fails on the first differing sample.
  **The brief's "30-minute run in the real app" was NOT done and could not be:
  `createProgramCanvas` still has NO call site anywhere in the app** (S1 left mounting to S5) —
  the 30-min figure in the PR is a deterministic simulation. S5 owns the first browser run.

- **S7 ACCEPTANCE — HALF CLOSED, and the half that is closed was done over a REAL SOCKET.** No live YouTube key was available, so the run went to a local `ffmpeg -listen 1` RTMP ingest that was **killed three times** (`pkill` → real `ECONNRESET`, then real `ECONNREFUSED` for an 8 s outage each). 240 s realtime, backup pointed at a dead port on purpose.
  Result: 4 sessions · 3 reconnects · 12 failed attempts · longest outage 12,047 ms · `used backup ingest true` · `clamped timestamps 0` · `recording fault none` · clean finish. Backoff observed on the wire as **1000/2000/4000/5000 ms**, attempt 4 → backup, attempt 5 → primary, `PUBLISHING resumed=true`.
  🔑 **The recording is CONTINUOUS THROUGH THE OUTAGES: max video gap 0.071 s and max audio gap 0.033 s across 240 s containing three 12-second disconnections.** ffprobe: 240.451 s, 7080 video + 11210 audio packets, and a `-c copy` remux passes with ZERO warnings. Wire got 5960 video tags, file kept 7080 — the ~1120 difference is what `WireGate` withheld plus what the outages ate, exactly as designed.
  ⚠ **A decode-to-null pass (`ffmpeg -i x.flv -f null -`) prints 38 "non monotonically increasing dts to muxer" warnings — THE FILE IS FINE.** `uniq -d` over the video packet DTS returns **zero** duplicates and the copy remux is clean; the warnings are ffmpeg's own transcode framerate handling, not the recording. Do not "fix" the encoder because of them. Verify with the copy remux, never with the null muxer.
  STILL UNDONE: the real **YouTube** run (TLS/rtmps, and YouTube's actual grace window). Needs the owner's live stream key.

- **⚠ S7's BACKUP INGEST HAS NO DATA TO ACT ON IN PROD (found 2026-09-06, NOT fixed).** `Destinations.backup` will be `None` for every event: `panood-youtube.ts` declares `rtmpsBackupIngestionAddress?: string` but `createYoutubeStream` persists only `ingestionAddress`, so `live-studio-encoder-claims.ts` returns `rtmpsBackupUrl: null` — its own docblock calls this "a real, separate gap (worth its own follow-up)". Rust's `ExchangeResponse.rtmps_backup_url` already exists, `#[allow(dead_code)]`. The alternation is proven working; it just never gets a second address. **Also: for the own-channel DEFAULT tier nothing supplies the ingest URL at all** — `stream_key.rs::set_pasted_inner` stores `rtmps_url: String::new()` deliberately, commenting that S5's encoder takes the server URL as a separate argument. The key-paste UI (`app/_components/encoder-key-panel.tsx`, S8/#5210) collects the KEY ONLY — no URL field, no backup field.

**How to apply:** Do not restart from the E0–E9 prompts; use the S-series. The corrected fork table has NOT yet been filed in the corpus `DECISION_LOG.md` beside the 2026-09-03 row — that was offered, not done. Related: [[setnayan-apple-developer-paid]].
