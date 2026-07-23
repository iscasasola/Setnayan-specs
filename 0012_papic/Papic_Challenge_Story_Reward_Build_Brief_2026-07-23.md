# Build Brief — Papic Challenge → Free Client-Side Story (completion reward)

**For a fresh Claude Code / build session in the code repo `setnayan-platform`. · Written 2026-07-23 · design owner-decided, NOT built.**

> **Read this first, then confirm everything against fresh `origin/main`.** Paths below are tagged
> `[VERIFIED-LOCAL @ #3149]` (I read the file directly in a local checkout sitting at PR #3149) or
> `[FROM-MEMORY — confirm on main]` (the Papic-Games challenge components are PR #3491+ and are NOT in
> that stale checkout, so their paths come from the project memory and MUST be re-verified live).
> ⚠ **Two checkouts exist** — the canonical working repo is home-rooted at `/Users/icecasasola`
> (git-dir `.git`; worktrees hang off it). `…/Documents/Claude/Projects/setnayan-platform` is a
> SEPARATE STALE checkout — do not build from it.

---

## 0 · TL;DR — the one thing to internalise

**Do not build a reel renderer. One already exists, client-side, download-only, owner-locked
(2026-06-18).** Your job is to (a) let the guest **pick** their media (photos **and** clips, up to
~10), (b) add a **music choice** (catalogue **or** their own upload), and (c) **wire the whole thing
as the reward** on the Papic Challenge completion screen. Nothing renders on the server. Nothing is
stored on our side. Cost to Setnayan = ₱0.

The reuse target:

| Already built | Path | Status |
|---|---|---|
| Client render engine (WebCodecs→mp4, MediaRecorder fallback) | `lib/reel-render.ts` | `[VERIFIED-LOCAL @ #3149]` · owner-locked client-side, ₱0 server compute. **Already supports `clips[]` with `kind:'photo'` and `durationSec` — i.e. it can encode video clips, not just photos.** |
| "Make my Story" guest surface | `app/papic/me/[token]/_components/guest-story-maker.tsx` | `[VERIFIED-LOCAL @ #3149]` · client-side, download + native share, **no server render, no paywall, stores nothing.** |
| Render-plan assembler (presigned URLs + template + music) | `prepareGuestStory(token)` → `buildGuestStoryPlan(event_id, guest_id)` in `app/papic/me/[token]/actions.ts` | `[VERIFIED-LOCAL @ #3149]` · **photos-only today.** |
| Templates / min-count / camera move / save-to-device | `lib/stories-templates.ts` (`STORY_MIN_PHOTOS`), `lib/stories-camera-move.ts`, `lib/save-to-device.ts` (`shareBlobToDevice`) | `[VERIFIED-LOCAL @ #3149]` |
| Papic Challenge machinery (panel, guest RPCs, consent tap) | `app/papic/guest/_components/papic-challenge-panel.tsx`, RPCs `papic_guest_missions` / `papic_complete_mission`, routes `app/api/papic/guest-missions` + `guest-complete-mission` | `[FROM-MEMORY — confirm on main]` · shipped phases 1→5, flag `NEXT_PUBLIC_PAPIC_GAMES_V1` LIVE. |

---

## 1 · Locked design (owner-decided 2026-07-23 — do not re-litigate)

1. **Reward** — completing a Papic Challenge earns the guest a **free Story** (a Personal Reel).
2. **Free** = no charge. The gate is *completing a challenge*, not money. Access-gate is a
   **motivation lever, not a paywall**.
3. **Picks** — the guest **freely picks up to ~10 items, any mix of their own Papic photos + clips.**
   This **relaxes** the old locked "max 5 guest + 5 couple memorable clips" split (see § 5).
4. **Output** — 30s · 9:16 · 1080×1920 · template-driven (no per-render AI).
5. **Music** — the guest's **own upload** (BYO, client-side per `14_Music_Catalogue_Cowork_Playbook.md
   §16.7`) **or** an owned-catalogue template track.
6. **Render + storage** — **entirely in the guest's browser; output downloads to their phone;
   Setnayan stores NOTHING** — no `/reels/render`, no queue, no R2 write, no DB row, no shared feed.
   ("post" in early discussion was loose language — there is no hosted feed.)
7. **Cost/storage to us = ₱0.** Client device renders; R2 free egress pulls the source; the finished
   ~15–25 MB file never lands on us → no storage accumulation. **No cost cap needed** — nothing to
   farm.
8. **Reward count** — recommended default **one Story per completed challenge** (each = a themed recap
   of that moment). Motivation-only; changeable with zero cost consequence.

Canonical record: `DECISION_LOG.md` 2026-07-23 · mechanic write-up:
`0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md §8` · corrected flows:
`02_Specifications/10_Papic_Feature_Specification.md §4.3` + spec-corpus `CLAUDE.md` critical flows.

---

## 2 · The four deltas to build (everything else is reuse)

### Δ1 — Include CLIPS in the render plan (not just photos)
`buildGuestStoryPlan` currently returns tagged **photos** only. Extend it to also gather the guest's
**clips**, and return a unified, ordered media list. The render engine already accepts clips:
`renderReel({ clips: [{ clipId, url, durationSec, kind:'photo'|'clip', cameraMove }] })`.

- For clips, presign the **compressed, geo-stripped `clip_web_r2_key` web-copy** — NOT `r2_object_key`
  (that is the geo-bearing original; geo is stripped on all outbound shares). See § 4 gotcha.
- Set `durationSec` from the clip's stored duration; the template's `beatsPerCut` still governs the cut.
- ⚠ **Dependency:** the corpus notes clips *"don't compress yet."* If `clip_web_r2_key` is null/absent,
  either (a) fall back to photos-only for that guest, or (b) block clip inclusion behind the
  web-copy pipeline landing. **Do not pull full-res originals into the browser** (~15–30 MB each →
  150–300 MB for 10 clips, rough on weak venue signal, and carries geo). Photo-only reels ship today
  with no dependency.

### Δ2 — Add a PICKER (currently it's one-tap-auto-all)
`guest-story-maker.tsx` today auto-builds from **all** tagged photos. Add a selection step:

- Show the guest's tagged photos + clips as a grid; let them select **up to ~10** (enforce the max in
  UI). Keep the existing `STORY_MIN_PHOTOS` floor as the minimum to render.
- Pass the *selected* ids (in pick order) into `renderReel` instead of the whole set.
- Preserve the existing `too_few` state for < min.

### Δ3 — Add MUSIC choice (catalogue pick + BYO upload)
Today `prepareGuestStory` auto-selects one owned track (`plan.music`).

- **Catalogue pick:** surface a small track chooser from the owned catalogue; pass the chosen track's
  presigned URL + `beatGrid` into `renderReel` (already supported as `musicUrl` / `beatGrid`).
- **BYO upload (§16.7):** accept a local audio `File`, hand its **object URL** to `renderReel` as
  `musicUrl`. The uploaded audio **must never touch the server** — client-side only (that is the
  not-distributor posture). ⚠ `lib/reel-render.ts` mixes audio **only on the MediaRecorder path**;
  the WebCodecs path is currently video-only. So when a music track is present the engine already
  *prefers* the MediaRecorder path — verify BYO audio actually muxes; if you need WebCodecs+audio,
  that is the noted follow-up (AudioEncoder + mp4-muxer audio track).

### Δ4 — WIRE IT AS THE REWARD (the actual new product surface)
On the challenge **completion** screen — the existing §4 consent tap inside
`papic-challenge-panel.tsx` `[FROM-MEMORY — confirm on main]` — add the reward CTA **after** the
"Share this photo with <vendor>?" tap:

```
✅ Challenge complete!
   Share this photo with Salt & Lime?   [ Share ]  [ Keep it private ]
🎁 You earned a Story — make yours →
```

- The CTA opens the story maker (inline sheet, or route to the guest's `/papic/me/[token]` story
  surface). Reuse `GuestStoryMaker`; do not fork it.
- **Identity reconciliation (important):** the challenge panel identifies the guest by the
  `setnayan_guest_session` cookie → `guest_id`; the existing `prepareGuestStory(token)` looks the
  guest up by `guests.qr_token`. Wire the reward so the story maker resolves the SAME guest — either
  pass the guest's token through, or add a cookie-session variant of `prepareGuestStory` that resolves
  `guest_id` from the session (mirror the pattern used by `app/api/papic/guest-missions`). Never trust
  a client-supplied id.
- **Gating decision (owner default = reward-gated):** simplest is to show the "Make my Story" CTA only
  on a completion screen. If you'd rather leave the maker always-available on `/papic/me/[token]` and
  just *surface* it as the reward, that is a product call — flag it; the recorded default is that
  completion is the earn moment.

---

## 3 · Data / identity grounding (verify on main)

- **Guests = zero-account.** Identified by `guest_id` via the `setnayan_guest_session` cookie for the
  Papic-Games surfaces; guest writes go through SECURITY DEFINER RPCs granted to `anon`.
  `[FROM-MEMORY]`
- **Capture id:** a capture POST returns `captureId` (= `papic_guest_captures.capture_id`), held as
  `lastCaptureId`; a mission completion attaches that id. `[FROM-MEMORY]`
- **Story identity today:** `prepareGuestStory` resolves via `guests.qr_token` →
  `(guest_id, event_id)` → `buildGuestStoryPlan`. `[VERIFIED-LOCAL @ #3149]`
- **Web-copy columns:** `clip_web_r2_key`, `display_r2_key`, `thumb_r2_key` are the outbound,
  geo-stripped derivatives; `r2_object_key` is the geo-bearing original — **never serve the original
  outbound.** Referenced in `lib/papic-derivatives.ts`, `lib/papic-gallery.ts`. `[VERIFIED-LOCAL]`
- **Flag:** `NEXT_PUBLIC_PAPIC_GAMES_V1` (build-time inlined → a change needs a redeploy; fails safe).
  Currently LIVE in prod. `[FROM-MEMORY]`

---

## 4 · Gotchas (these bite)

1. **R2 CORS is the end-to-end gate.** The browser fetches source photos/clips + music via presigned
   R2 URLs cross-origin with `crossOrigin='anonymous'`. **Without R2 CORS headers the canvas taints
   and `VideoFrame()`/encode throws `SecurityError`.** `reel-render.ts` says plainly: *"R2 CORS is the
   owner action gating this end to end."* Confirm CORS is set for the media bucket before claiming the
   clip path works.
2. **Store nothing.** Do not add an R2 upload or a DB row for the guest's finished Story. The Patiktok/
   couple use of the SAME engine *does* upload to R2 — do not copy that branch into the guest reward
   path. Guest Story = blob → `URL.createObjectURL` → download / native share, then revoke.
3. **Geo.** Clips/photos must be served from the geo-stripped web-copies (`*_web_r2_key` /
   `display_r2_key`), never the original.
4. **WebCodecs vs budget Androids.** Prefer WebCodecs; MediaRecorder is the fallback (and the only
   current audio-mixing path). Ten-clip montages are the heaviest client job — test on a low-end
   Android, not just desktop Chrome.
5. **Migrations auto-apply on merge — but unreliably.** If you add any migration (this feature may not
   need one), verify `supabase-migrations.yml` actually ran; bursty merges can silently skip. Do
   **not** echo `$SUPABASE_DB_URL`.
6. **Changelog contract.** Add a `changelog.d/<branch-slug>.md` fragment per PR with a `SPEC IMPACT:`
   line (here: "None — spec already updated in corpus DECISION_LOG 2026-07-23"). Do NOT edit
   `CHANGELOG.md`/`STATUS.md` directly. Enable auto-merge (`gh pr merge <PR#> --auto --merge`).
7. **Verify before arming auto-merge** — commit locally, self-review/attack the diff, then ship.

---

## 5 · Spec constraint this relaxes (call it out in the PR)

The 2026-05-09 lock said Personal Reels = **"max 5 guest picks + max 5 couple memorable clips."** The
owner's 2026-07-23 decision replaces that with **"free pick, any mix, up to ~10."** This is authorised
(owner made the call) and is logged in `DECISION_LOG.md`. If any code path hard-codes the 5+5 split,
update it and note the supersession.

---

## 6 · Suggested PR breakdown (small, stackable, flag-safe)

1. **PR-1 · Clips in the plan** — extend `buildGuestStoryPlan` to gather clips (web-copy presigned) +
   return a unified media list; render engine already consumes it. Photo-only fallback when no
   web-copy. Unit-test the plan builder.
2. **PR-2 · Picker UI** — selection grid (≤10, mixed) in `guest-story-maker.tsx`; pass selected ids in
   order; keep `too_few`. Pure helper for "can render / count" + tests.
3. **PR-3 · Music choice** — catalogue chooser + BYO client-side upload (object URL → `musicUrl`);
   verify MediaRecorder audio mux; uploaded audio never leaves the device.
4. **PR-4 · Reward wiring** — completion-screen CTA in `papic-challenge-panel.tsx` after the consent
   tap; identity reconciliation (cookie-session variant of the plan resolver); reuse `GuestStoryMaker`.
   Behind `NEXT_PUBLIC_PAPIC_GAMES_V1`.

Each: map → build → adversarially self-verify the diff → PR → auto-merge.

---

## 7 · Definition of done (test checklist)

- [ ] Guest completes a challenge → sees "🎁 You earned a Story — make yours →" after the consent tap.
- [ ] Picker lets them choose a mix of their own photos **and** clips, capped at ~10, floored at
      `STORY_MIN_PHOTOS`.
- [ ] Music: can pick a catalogue track **and** upload their own; uploaded audio never hits the server
      (verify in network tab — no upload request).
- [ ] Renders a 30s 9:16 MP4 **in the browser**; no `/reels/render` / no R2 write / no DB row created
      (verify in network + DB).
- [ ] Output downloads to the phone / native share works.
- [ ] Clip path serves geo-stripped web-copies (no `r2_object_key`); low-end Android tested or the
      clip path is explicitly gated on the web-copy pipeline.
- [ ] Works only with `NEXT_PUBLIC_PAPIC_GAMES_V1` on; fails safe off.
- [ ] `changelog.d/` fragment added; auto-merge enabled.

---

## 8 · Reference files in the spec corpus (read for context)

- `0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md` — the games/missions spec (**§8 = the
  reward**).
- `02_Specifications/10_Papic_Feature_Specification.md` — full Papic spec (**§4.3 render pipeline —
  server path banner-retired**).
- `14_Music_Catalogue_Cowork_Playbook.md §16.7` — BYO-music client-side / not-distributor rule.
- `DECISION_LOG.md` 2026-07-23 — canonical decision row.
- Project memory `project_setnayan_papic_games_build` — the full shipped-phases map + grounding.

---

*Template economics footnote: the ~400 template manifests are generated ONCE via the Cowork playbook
and reused free across every event and guest forever — there is no per-event template creation. Music
is owned outright (no per-render license). Combined with client-side render + download-only, the
marginal cost of a Story is ₱0 and it never accumulates on our storage.*
