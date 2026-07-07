# Papic Walk-up + Face-Identity Plan — 2026-06-29

> **Status: design-complete, build-ready.** Closes the open items from the 2026-06-29 owner design session
> ("just use Papic alone" → free walk-up camera → no-login face identity → re-entry → liveness → save-to-account → 7-day clock).
> Supersedes nothing; extends `0012_papic.md` + `Papic_v2_Pricing_and_Funnel_Strategy_2026-06-26.md`.
> Code lands via worktree+PR (corpus authorization does NOT extend to repo code).

---

## 0. The one-sentence shape

A guest **walks up, scans the event QR, enrolls their face (with consent + liveness), and starts shooting** — no
account, no guest list. **The face is the identity:** it routes photos to the right people's galleries and lets the
guest get back into their camera on any device. Photos + face stay live for **7 days after the event**; within that
window the guest is nudged to **sync to an account (by email) to keep everything forever.**

There is **one face engine** underneath, used two ways: **1-to-many** inside an event (Papic), and — if/when built —
**strict 1-to-1 + liveness** for account login (deferred, see §9).

> **Event-type-agnostic (not wedding-only).** Papic has **zero `event_type` checks** — birthday, debut, christening,
> corporate, travel, reunion, etc. The walk-up face camera is arguably *stronger* for big non-wedding crowds (a 200-pax
> birthday, a company party) than for a wedding. Throughout this doc **"host" = the event organizer** (couple at a
> wedding; celebrant/organizer otherwise) and **"event"** is generic; `member_type='couple'` is only the legacy schema
> role name, not a wedding restriction.

---

## 1. Identity model — face on top of the existing `guest_id` spine

Decision: **do NOT rip out `guest_id`.** Every Papic surface already keys on `guests.guest_id`
(`guest_face_enrollments`, `papic_guest_captures`, `photo_tags`, reels). The walk-up flow keeps that spine and only
changes **how a guest row is born**: instead of a host typing a roster, the roster **self-populates on scan**.

- Scan event QR → **resume-or-create** (see §5), NOT always-create (that is the current re-entry bug).
- New guest → a lightweight `guests` row (no name required; `display_name = 'Guest'` until they offer one), issued the
  existing 60-day signed `setnayan_guest_session` cookie (`apps/web/lib/guest-session.ts`).
- Face enrollment (`guest_face_enrollments`, `source='papic_walkup'`) ties that guest row to a face vector.

This means ~90% of the pipeline (captures, quota, galleries, tagging, reels) works **unchanged** — the new work is
the face engine (§2) and the resume/recovery glue (§5).

---

## 2. The face engine (Phase 1 — gates everything)

> **🔁 AS-BUILT CORRECTION 2026-06-29 (verified vs main — supersedes BOTH the original "ArcFace/Oracle/server-embed"
> design below AND the Vids-AI-audit "ungate face-blur detection" correction). The face engine is ALREADY BUILT and
> DORMANT on ONE owner action — it is not a build at all.** The shipped pipeline is **client-side face-api.js** (dlib
> ResNet, **128-d** descriptors, public-domain weights + MIT code), NOT server ArcFace:
> - **On-device embed** — `lib/face-embed.ts` `embedFaces(canvas)` runs in the capture client (`papic-guest-capture.tsx`);
>   only the 128-d descriptor leaves the phone, never the image.
> - **Matcher** — `lib/face-match.ts` `autoTagCapture` runs on **every** guest capture (`api/papic/guest-capture`),
>   euclidean bands, per-event scoped, consent-gated, writes `auto_face` `photo_tags`.
> - **Enrollment** — `app/papic/face-enroll-actions.ts` writes `guest_face_enrollments.face_vector` (consent-mandatory).
>
> It is dormant for ONE reason, stated twice in the code: *"DORMANT until a model is hosted (`NEXT_PUBLIC_FACE_MODEL_URL`)."*
> **Blocker = OWNER ACTION:** host `face-api.js` + the detector/landmark/recognition weights on R2 and set
> `NEXT_PUBLIC_FACE_MODEL_URL` (OWNER_ACTIONS). That activates embed → enrollment vectors → capture match → auto-tag,
> end to end. **No ArcFace, no Oracle box, no server detection, no migration.** (The Vids AI `face-blur.ts` faceblock pass
> is a SEPARATE, LIVE_WALL-only privacy feature — unrelated to this engine. So "Phase 1a server-detection refactor" was
> the wrong plan and is RETIRED.)
>
> **What's actually left to BUILD (code lane), both small + client-side:**
> 1. **Tier-2 `subject_center`** — `embedFaces` returns only `{descriptor}`; surface the **dominant face box** too
>    (face-api's `detectAllFaces` already computes it — read `.detection.box`). That feeds Tier-2 auto-reframe + the
>    focal-clamp (audit #3). This is the real shared piece with Vids AI — a small CLIENT change, not an ingest migration.
> 2. **Walk-up face re-entry** (§5) — reuse `embedFaces` + a match against the event's walk-up enrollments.

The matcher + storage + bands below are AS-BUILT (kept for reference); the ArcFace/Oracle rows are SUPERSEDED.

| Piece | Decision |
|---|---|
| Detection + embed | **AS-BUILT: on-device `face-api.js` (dlib ResNet, 128-d) — `lib/face-embed.ts`.** No server detection, no new model to source. |
| ~~Model (ArcFace/Oracle)~~ | ~~ArcFace `arcface-r100@1`, server, Oracle box~~ — **SUPERSEDED**; the as-built engine is client-side face-api 128-d. |
| Storage | `guest_face_enrollments.face_vector` (128-d JSONB) — already written by enrollment. Matcher = euclidean bands in `lib/face-match.ts`, per-event. |
| Match scope | **Per-event only.** Never compare across events (locked: a face vector store is never reused across events). |
| Confidence bands | **≥0.85 auto-tag · 0.65–0.85 suggest ("is this you?") · <0.85 leave untagged** (0012 spec). |
| Liveness | A **separate gate before** enroll/recovery — see §3. Liveness ≠ matching; both must pass. |

---

## 3. Liveness (anti-spoof) — tiered to stakes

Threats in scope: **printed photo** and **screen-replay video**. Out of scope on web: real-time deepfake / camera-injection
(documented ceiling — mitigated only by never making face a sole key to anything valuable).

- **Papic guests (low stakes — a spoof only sees candid photos):** **client-side randomized active challenge** via
  MediaPipe FaceLandmarker (e.g. "blink twice / turn right" in a random order). Defeats a static photo and a
  pre-recorded clip. Proportionate; do not over-engineer an event gallery.
- **Account login (high stakes — money/PII):** reuse **Persona** (already wired for vendor ID liveness,
  `apps/web/app/api/webhooks/persona/route.ts`), strict 1-to-1, with password/email always underneath.
- **Accessibility note:** active challenges are hard for the elderly (the exact face-login audience). For that path,
  prefer passive liveness or the email/saved-link fallback. You cannot have "effortless for grandpa" AND aggressive
  liveness in the same gate — pick per surface.

---

## 4. Face-routing during capture (the gap we closed)

In free-seating walk-up, **every guest is both shooter and subject.** A photo guest A takes of B and C must land in
**B's and C's** galleries, not A's. The capture loop:

1. Capture → upload to R2 (existing `papic_guest_captures` path).
2. Engine detects faces in the frame → **1:N match within the event.**
3. For each match ≥0.85 → write `photo_tags (source='auto_face', confidence)` → photo **auto-deposits into that
   subject's personal "photos of you" gallery** (`lib/guest-live-gallery.ts`, already reads `photo_tags`).
4. 0.65–0.85 → surfaced as a **suggested tag** (subject confirms); <0.65 → untagged.
5. Shooter keeps every shot in their **own "shot by me"** view regardless of matches.
6. **Untagged-still-delivered (locked):** every photo also lands in the **host's master gallery** no matter what the
   matcher finds. Never filter the host gallery by tag presence. ("Host" = the event organizer — couple at a wedding,
   celebrant/organizer for a birthday/debut/corporate/etc.; `member_type='couple'` is the legacy schema role name.)
7. **10-tag cap per photo (locked):** alphabetized truncation, warn the shooter.
8. **Opt-outs:** a guest who declined biometric consent is **face-blurred** and never auto-tagged as a subject.

**Clips (5-sec cap):** recognition runs by **sampling a few frames** (≈1/sec) and applying the same detect→match→route
pipeline — the whole clip routes to everyone who appears. This stays **light / free-box** (analyzing a handful of frames
≠ rendering); multiple frames can even improve match confidence over a single photo. **Exception — face-BLUR on a clip
is render-class** (per-frame face tracking + re-encode, the existing `faceblock` bake), so the *opt-out privacy path on
video* leans on the render pipeline, not the light matcher. Find/route = free; blur = paid-compute.

This reuses `photo_tags` + both galleries; the only new write path is `source='auto_face'` from the engine.

---

## 5. Re-entry — resume-or-create (cookie → face → link)

The current bug: scanning the QR again **always creates** a new identity. Fix: every scan is **resume-or-create**, in
this order:

1. **Cookie (free, invisible):** valid 60-day `setnayan_guest_session` for this event → silently resume. Same
   phone/browser = back in their camera, no face needed. Handles the common case.
2. **Face (any device):** no cookie → "Been here already? Look at the camera." → liveness → 1:N match within event →
   resume identity + all photos. The cross-device magic. (Available only while face data is live — §6.)
3. **Saved link (no-biometric fallback):** on first registration, hand the guest **their own camera link/QR**
   ("Save to phone"). Re-opening resumes them with no face. Covers consent-decliners + everyone as belt-and-suspenders.
   Home: the existing **"save to phone" workstream**.
4. Genuinely new → register fresh.

---

## 6. Lifecycle — three clocks + a stricter face clock

| Clock | Setting | Source |
|---|---|---|
| Shoot photos (capture window) | The Papic pass day(s) | purchase |
| Get back in + sync (recovery window) | **7 days** after event | owner 2026-06-29 |
| Photos kept — **not synced** | **Deleted at day 7** | walk-up rule |
| Photos kept — **synced / paid** | **Permanent** (paid gallery still 5 yr) | locked retention |
| **Face data (biometric)** | **Purged at event-end + short grace**; after purge, re-entry = cookie/link only | RA 10173 minimization |

**Nudge cadence (7 days is tight → front-load).** Reuse `scheduleSamplerExpiryWarnings`:
- In-app, after first good shot: "Loving these? Sync to an account to keep them forever."
- Event-end (day 0): "Your photos are ready — sync within 7 days to keep them."
- Day 3: gentle reminder.
- **Day 6 last-chance: "Your photos delete tomorrow — sync now (free)."**

---

## 7. Two doors

| | Door 1 — event re-entry | Door 2 — keep forever |
|---|---|---|
| Key | Face + liveness | **Email (passwordless magic-link)** |
| Password? | No (kills the no-login promise) | Optional, never required |
| Stakes | Low / expires at 7 days | Permanent / valuable |
| Trigger | Re-scan QR | **"Save my camera"** button |

"Save my camera" = the passwordless-email claim: enter email → one-tap link → the anonymous camera's photos **migrate
into a real account** (re-point `guest_id`'s captures/enrollment to the new `users` row). Face stays a convenience;
**email is the durable key and the delivery channel.**

---

## 8. Consent + free allowance

- **Consent UX (RA 10173):** the first walk-up screen is **biometric consent + selfie enroll, and it is SKIPPABLE.**
  Skip → the guest can still shoot (their shots go to the host's master gallery), gets a saved-link camera, but has
  **no face-recovery and is not auto-tagged as a subject.** Record `consent_at`, `consent_source='papic_walkup'`.
- **Free allowance:** walk-up is **free to join + enroll + shoot the first 5 captures per camera** (the per-camera
  "first 5 free" model — `project_setnayan_papic_free_sampler`). Beyond that, the event must own a Papic pass
  (**Ltd ₱30/cam/day · Unli ₱100/cam/day**, 5-camera minimum) for guests to keep shooting. The "number of cameras"
  knob (set at purchase, already independent of roster size) is the host's "number of guests" control.

---

## 9. Account face login — DEFERRED (decision)

The "elderly dad logs into his account on his kid's phone with his face" need does **not** require account face login in
V1. It is solved now by **passwordless email login** (Phase 3) — any device, nothing to remember, **zero biometric
storage**, and it keeps us consistent with the **current privacy policy** (which states we do not collect account-level
face biometrics, `apps/web/app/privacy/page.tsx`).

Account face login is **Phase 4, optional, flagged**: strict **1-to-1** (identify first, face only confirms) + **Persona
liveness**, layered on top of password/email, **never the sole key**, and only after the engine is proven in Papic.
Building it would require a privacy-policy update + RA 10173 consent expansion — out of scope until owner re-greenlights.

---

## 10. Build sequence — reconciled to AS-BUILT code (2026-06-29)

The face engine is **already built** (client-side face-api 128-d) and **dormant on one owner action** (§2 AS-BUILT
correction). The "Phase 1a server-detection refactor" is **RETIRED** — it was the wrong build. Reconciled order:

| Phase | What | State / depends on |
|---|---|---|
| **2 (shipped)** | **Walk-up Papic** — resume-or-create, host QR, saved-link re-entry, `papic_walkup_token`, gate = `eventPapicGuestActive`. | ✅ **PR #2410** |
| **1 — OWNER (no build)** | **Activate the as-built face engine:** host `face-api.js` + detector/landmark/recognition weights on R2, set `NEXT_PUBLIC_FACE_MODEL_URL`. Lights up on-device embed → enrollment vectors → capture match → auto-tag end-to-end. | **OWNER_ACTIONS** — no code, no infra, no migration |
| **1.5 — small client builds** | (a) **Tier-2 `subject_center`** — surface the dominant face box from `embedFaces` (read face-api `.detection.box`), feed the render + focal-clamp (audit #3). The real shared piece w/ Vids AI — CLIENT change, not a migration. (b) **Walk-up face re-entry** (§5) — reuse `embedFaces` + match vs the event's walk-up enrollments. | After Phase 1 (model hosted) |
| **2-rest** | **Walk-up face layer** — face-routing (§4, mostly the existing `autoTagCapture` once live), consent/enroll (§8), first-5-free (pricing — owner). | Phase 1 active |
| **3** | **Passwordless email login** (parallel, independent). | none |
| **4** | **Account face login** (optional, deferred; note `account-face-profile.ts` already scaffolds account seeds, flagged OFF). | engine proven + owner re-greenlight |

**Audit items NOT in this lane** (Vids AI / owner — tracked so they aren't lost): #1 beat-sync inert → populate `beat_grid`
(blocked on Suno `source_url` ingest; tool = `analyze-beat-grids.mjs --emit-migration`, PR #2405); #4 pan-overscan;
#5 downbeat rebasing; #6 MediaRecorder non-determinism; #7 render observability; #8 `prefers-reduced-motion`; #9 canvas
geometry tests; #10 depth Tier 3 (owner infra); #11 `/camera-move-preview` gating. (#3 focal-clamp folds into 1.5a.)

**Audit items NOT in this lane** (Vids AI / owner — tracked so they aren't lost): #1 beat-sync inert → populate `beat_grid`
(blocked on Suno `source_url` ingest; tool = `analyze-beat-grids.mjs --emit-migration`, PR #2405); #4 pan-overscan tuning;
#5 downbeat rebasing; #6 MediaRecorder non-determinism; #8 `prefers-reduced-motion`; #10 depth Tier 3 (owner infra);
#11 `/camera-move-preview` gating.

**Why this order:** prove the matcher in the **low-stakes** place (event photos) before anything bets account
security on it; ship the any-device login immediately via email; treat account face login as an opt-in extra, last.

---

## 11. Separate blocked dependency (not this plan)

Personal **reels / Guest Stories / SDE** need a **video render pipeline (FFmpeg)** that is a distinct, currently-blocked
workstream — see `Render_Prototype_Oracle_30s_2026-06-28.md` (prototype, ₱0) / `Render_Pipeline_Hetzner_Build_Plan_2026-06-28.md`
(paid scale). The face engine can ride the same render box (Oracle Always-Free now, Hetzner at scale), but the
render-dependent Papic outputs are **not** unblocked by this plan.

---

## 12. Open owner sign-offs folded in (owner "fix it", 2026-06-29)

Treated as **granted** by the "fix it" go-ahead, recorded here for traceability:
- Free **walk-up** tier productized — this is the deliberate, scoped form of the previously-parked "All-Guest Unlock"
  (every guest shoots via web). Un-parked **as the walk-up product**, not as an open-ended free-for-all.
- Free/paid boundary set (first-5-free per camera, then pass-gated).
- **No account biometrics introduced** (account face login deferred) → **no contradiction with the current privacy
  policy.** Papic guest biometrics remain consent-disclosed as today; confirm walk-up copy covers the same basis.
