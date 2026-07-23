All claims verified. I have what I need to adjudicate. Writing the verdict.

# Papic — Low-Light Capture Council Verdict

**Date:** 2026-07-21 · **Chair:** synthesis of five lenses (web-ceiling · native-delta · rail-segmentation · engineering · red-team), each hostilely cross-examined
**Question:** *"Receptions are DARK. Our web camera is materially worse than the phone's native camera app in low light. What is the best approach — and if we have a native app, does that solve it?"*
**Status:** RECOMMENDATION — 4 owner decisions open (§ 9)

## What this is

An adjudicated council verdict, not a lens report. Five lenses reported independently; each was cross-examined by a hostile reviewer; where a cross-exam correction landed at `certain` or `likely`, **the correction wins and is named in § 10** — never silently absorbed. The red team held the last word on *whether to build this at all*, and its argument binds the sequencing in § 8.

## Evidence discipline

| Tag | Meaning |
|---|---|
| `[VERIFIED-CODE]` | `path:line` on `origin/main`, re-confirmed by the Chair this session |
| `[VERIFIED-SOURCE]` | primary vendor document, fetched this session |
| `[MEASURED]` | read from prod `njrupjnvkjkitfctetvi`, 2026-07-21 |
| `[MODELLED]` | assumption or projection — no measurement behind it |
| `[UNVERIFIED]` | asserted, not confirmed. **Not laundered into fact anywhere below.** |

Every web-platform capability claim in this document is either `[VERIFIED-SOURCE]` with the document quoted, or explicitly `[UNVERIFIED]`. Three lenses stated browser capabilities from memory with specific bug numbers; those provenances are struck in § 10.

---

## § 1 — Executive summary

**Torch — a real flash — is the only lever that adds photons; everything else merely redistributes noise.** It appears to work on modern iOS Safari as well as Android `[VERIFIED-SOURCE, version floor unknown]`, it is one file outside the money code, and it is thematically *correct* for a product sold as a disposable camera — but it obeys inverse-square, so it owns the near field (under ~2 m) and does essentially nothing across a ballroom. **A native app does not solve this**: it cannot grant Apple's Night Mode, the already-committed Capacitor shell is a *remote-URL webview* whose camera is the identical `getUserMedia` path (installing it today improves the photo by **zero pixels** `[VERIFIED-CODE]`), and the rail carrying all the volume can never be native without retracting "no app to install" from ~10 shipped surfaces. **Frame stacking is not the answer and is not "already specced"** — the Themes spec's falling-opacity blend is not an average and performs no registration, so the denoiser is greenfield work that caps at ~1.5–2 stops and delivers almost none of it on the moving faces that are the actual subject. **None of this should be built before one afternoon of measurement**, because prod holds 63 events, **zero** guest captures, **zero** vendor captures, and not one row carrying device or resolution metadata `[MEASURED]` — the low-light defect is currently an owner impression, not an observation. **And the red team's binding point stands:** Papic cannot take money today, so the month belongs to making it sellable, not to chasing stops.

### The sequence

| Tier | What | Cost |
|---|---|---|
| **(i) Ships now, no gate** | Fix the install-banner false claim + rail-gate it · reconcile the stale ~2 MP perf budget | ~half a day, outside capture path |
| **(iii) Measure first** | `/papic/lightcheck` capability probe · two-phone dark-room side-by-side · frame-arrival-rate test | one afternoon, zero product code |
| **(ii) Owner decision** | Month allocation · flash-as-default aesthetic · native scope · Universal-Link risk | § 9 |
| **Conditional build** | Flash, *if* the probe finds torch — shipped ALONE as availability code | ~1 day + device matrix |
| **Deferred, named re-open** | Frame stacking · noise-aware Looks · native capture plugin | — |

---

## § 2 — What web capture can actually reach

### 2.1 We have never reached for the ceiling

This is the finding of the council, and it reframes the owner's question. Papic requests **exactly one constraint family** and nothing else:

```
apps/web/lib/use-papic-camera.ts:200
const HI_RES = { width: { ideal: 2560 }, height: { ideal: 1440 } } as const;
```

`[VERIFIED-CODE]` The only `applyConstraints` call in the entire hook is `applyZoom` at `:71`. A repo-wide grep for `torch` across `apps/web` returns **one** real hit — `lib/higgsfield-prompts.ts:73`, a tiki-torch prompt string (every other match is the substring in "crea**TORCH**apter"). No exposure, no `focusMode`, no `whiteBalance`, no `ImageCapture` anywhere on any Papic path. Capture itself is a bare `ctx.drawImage(video, 0, 0, w, h)` of the **live preview frame** on both surfaces.

**We are not up against a web ceiling. We have never reached for it.** Every named competitor (photoshare.ph, EventPix, Kuha.app) is under the identical constraint, so this headroom is unclaimed by them too.

### 2.2 The stop budget, honestly

| Lever | Gain | Platform | Confidence |
|---|---|---|---|
| **Torch as flash, subject < 2 m** | **~2–3 stops** | iOS + Android | `[VERIFIED-SOURCE]` feature exists; `[MODELLED]` magnitude |
| Torch, subject at ~4 m | fraction of a stop | — | `[MODELLED]` inverse-square on a ~50-lumen source |
| `frameRate` cap 30→15 | 0–1 stop | universal constraint | `[UNVERIFIED]` — raises the exposure *ceiling*; whether AE extends integration rather than raising gain is implementation-defined |
| Aligned frame stacking, static subject | ~1.5 stops (N=8) / ~2.0 (N=16) | universal | `[MODELLED]` — 1/√N |
| Aligned frame stacking, **moving face** | **~0** | — | `[MODELLED]` — see § 5 |
| Noise-aware Looks | perceptual only, **no true stop gain** | universal | `[VERIFIED-CODE]` the amplifiers exist |
| Apple Night Mode | ~3–4 stops | **unavailable to anyone** | § 3 |

**Realistic web-only end state: ~2–3 stops on a near-field subject, ~1–1.5 stops on the room — and the subject number is almost entirely torch.**

### 2.3 The torch question, settled as far as primary sources allow

I fetched WebKit's own release notes rather than trusting any lens's recollection.

- **Safari 17.5** `[VERIFIED-SOURCE — webkit.org/blog/15383, fetched 2026-07-21]`, WebRTC section: *"Fixed the camera pausing occasionally when torch is enabled."*
- **Safari 18.4** `[VERIFIED-SOURCE — webkit.org/blog/16574]`: fixed `getUserMedia` video-track `getSettings()` returning a stale value for **torch** and **whiteBalanceMode** constraints.

WebKit does not fix bugs in features it has not shipped. **The inference that torch is supported on modern iOS Safari is strongly supported.** Three caveats that must travel with it:

1. Neither note is an affirmative "torch is now supported" statement. They are bug fixes that *presuppose* the feature. **The iOS version floor is `[UNVERIFIED]`** and can only come from a device probe.
2. The 17.5 note names the exact failure mode we would be shipping onto a no-re-shoot path: **the camera pausing when torch is enabled.**
3. `exposureCompensation` / `iso` on Safari remain `[UNVERIFIED]` — no lens confirmed them and I did not. **They must not be used to argue anything.** The red team's proposed "exposure/ISO nudge" is therefore demoted to a probe, not a build item (§ 10.7).

### 2.4 We are actively making dark photos worse

Two self-inflicted losses, both `[VERIFIED-CODE]`:

- **Grain on grain.** `lib/papic-photo-styles.ts` — RETRO adds *"fine monochrome Gaussian grain"*, MONO applies `unsharp(data, w, h, 0.9, 2)` — *"strong micro-contrast for texture"*. Sensor noise **is** grain; micro-contrast is a noise amplifier.
- **The perf budget is stale by ~1.85×.** `papic-photo-styles.ts:32` still asserts *"getUserMedia frames are ~2 MP (≤1920×1080)"* and the Themes spec line 297 budgets *"~40M ops on a 2 MP frame"* — while the hook has requested 1440p (≈3.7 MP) since 2026-07-14. Any N-frame plan costed off those documents understates CPU by ~1.85× **per frame** before multiplying by N.

`papic-adaptive-quality.ts:93` (`tier === 'full' ? 0.9 : 0.72`) is **not** a free win to raise — 0.9 is the default and 0.72 fires only on a degraded link, i.e. exactly where the adaptive system is doing its job at a bad-WiFi venue (§ 10.5).

---

## § 3 — What native adds, and what it does not

### 3.1 The Night Mode question

**Apple's Night Mode and Deep Fusion are not exposed to third-party native iOS apps.** `[UNVERIFIED]` — this is the honest tag. The lens that asserted it cited an Apple Developer Forums thread it could not produce, and no lens confirmed it against a normative Apple document. Apple documents what exists, not what is withheld, so a clean citation may not be obtainable.

**It does not change the answer, and this is the important part.** Even granting Night Mode to native for free, points 3.2–3.4 stand independently. The recommendation does not rest on this claim, and it must not be quoted as settled fact.

### 3.2 Installing the app today improves the photo by zero pixels

`[VERIFIED-CODE]` `apps/mobile/capacitor.config.ts` is a **REMOTE-URL** shell — its own header says the shell *does NOT bundle the app*; `server.url` points at `https://www.setnayan.com`. `@capacitor/camera` is a declared dependency with **zero importers** anywhere in `apps/web`. The camera inside the app is the same `getUserMedia` path, running the same `use-papic-camera.ts`.

So "if we have a native app, does that solve it?" answers in two parts: **today, not by one pixel** — and *tomorrow* only by writing a plugin that does not exist, plus two native camera implementations, plus a frame bridge back into the JS Look engine (or reimplementing the five Looks natively, twice), plus a store binary and review cycle for every change to a capture path, forever.

### 3.3 What native genuinely adds

Real photo-mode exposure, manual ISO/shutter, RAW, fast burst. `[MODELLED]` ~1–2 stops over today's preview-frame path — of which browser-side work already reaches most. **Not** Night Mode.

### 3.4 The scope of the prior rejection — corrected

Two prior documents were cited as having closed this. They do not close it as cleanly as claimed:

- `Native_Capture_Capacitor_Plan_2026-06-28.md`: native camera quality is *"C1 — Optional… Lower priority — the webview path is already shipping."* `[VERIFIED-CODE]`
- `Container_App_Strategy_Council_Verdict_2026-07-13.md` names the true native gaps as **background upload**, the **DSLR Camera Bridge**, and **iOS IAP (3.1.1)** — Papic capture is filed under *"Works today, inside the WebView."* `[VERIFIED-CODE]`
- **But** the same verdict's risk table, line 101: `Med | Guideline 4.2 "just a website" | Native camera + App Links + app-first login; reviewer notes + demo account; PWA fallback`. `[VERIFIED-CODE]`

**Ruling:** native capture was deprioritised as a *quality* investment while being retained as *one of several* App Store review mitigations. The scheduled 4.2 mitigations are the others — line 46 records "Guideline 4.2 app-first entry — all wired", and Phase 5 lists *"reviewer notes + demo account for the 4.2 wrapper risk"*. **The corpus rejection must therefore be scoped "not for image quality"**, or it will contradict the store-submission plan the moment iOS is attempted.

### 3.5 The iOS 30% claim — do not price native at it

`[MODELLED]` and structurally shaky. Papic is bought by the **host** on the web dashboard (`add-ons-catalog.ts`, `addOnHref` routes `papic-guest` to `/dashboard/{eventId}/studio/papic`); guests buy nothing — they scan a QR and shoot. Apple 3.1.1 attaches to a digital purchase made *inside the app*. A capture-only iOS shell containing no purchase surface plausibly carries **zero** commission exposure. The real decision is *"does the iOS shell contain any purchase surface?"* — separable from whether it captures natively, and a counsel question (§ 9).

---

## § 4 — Rail segmentation, and the consistency objection

**Verdict: reject rail-differentiated image quality.** Three verified facts collapse it.

**One hook, three rails.** `usePapicCamera` has exactly three real consumers `[VERIFIED-CODE]` — `papic-guest-capture.tsx` (guests), `papic/seat/[token]/papic-seat-capture.tsx` (dedicated shooters), `vendor-dashboard/on-the-day/live/[eventId]/papic-capture-controller.tsx` (vendors). *(Two further files reference the module: `thread-call-room.tsx` in a comment only, `camera-controls.tsx` imports a type. Neither consumes the hook.)* **Segmenting quality by rail means forking the shared hook — it is the *expensive* option. One improvement lifts all three.**

**"No app to install" is shipped copy on the dedicated-shooter rail too**, not just the guest rail — `studio/papic/crew/page.tsx:143`, `papic/claim/[token]`, `papic/me/[token]`, `papic/join/[token]:162`, `lib/add-ons-detail.ts:259`, `lib/help.ts:466`, plus `panood/cameras`, `panood/cam/[token]`, `lib/tours.ts:218`. `[VERIFIED-CODE]` Moving dedicated shooters to native retracts a live promise **on the seat-claim screen itself**, at the moment of highest friction.

**The rail proposed for native is the thinnest by design.** `Papic_Pricing_Lock_2026-07-20.md § 2.2`: *"Above two cameras, Papic One wins on price and volume. Merchandise them as 'add a shooter', never as an alternative to the event pass."* `[MEASURED]`

### 4.1 The consistency objection, adjudicated

One lens argued that a quality delta would be fatal because all rails merge into one provenance-less gallery. **The merge is real** — `lib/guest-live-gallery.ts`, `lib/guest-stories.ts`, `lib/kwento-magazine.ts`, `lib/auto-recap.ts`, `lib/alaala-orb.ts` all fan `papic_photos` + `papic_guest_captures` into one ordered feed. **The inference does not follow, and the cross-exam is right (§ 10.4):** the feed is *already* radically heterogeneous, because every rail runs the same hook on whatever handset the person is holding — an iPhone 15 and a ₱4,000 Android already sit adjacent with a gap larger than torch would add. The rails already differ in shipped features (`papic-photo-styles.ts` is imported by the guest and seat surfaces but **not** by the vendor controller — the five Looks do not exist on the vendor rail).

**Narrow the principle to the version that survives:** do not introduce a delta the buyer can attribute to **what they paid**. The device lottery is not attributable to the SKU; a paid quality tier is. Provenance also already exists in data — `photo_tags.source_table` is threaded through to a user-facing `'seat' | 'guest'` value in `papic/me/[token]`. Labelling is a copy change, not a schema change, so unattributability is **not** a valid argument against tiering (§ 10.6).

---

## § 5 — Frame stacking: the design, the alignment problem, the face-embed order

### 5.1 "One mechanism, two products" is the most seductive claim in the brief, and it is ~10% true

The Themes spec § 5 says, verbatim: *"blend 8–12 frames over ~300 ms… this is **canvas compositing with falling opacity** — moving things smear, static things stay sharp."* `[VERIFIED-CODE]`

Two things follow, and the cross-exam is `certain` on both (§ 10.3):

1. **Falling-opacity compositing is a weighted blend dominated by the newest frame — it is not an average, and it yields nowhere near √N noise reduction.**
2. **Alignment is not a blend option.** It is per-frame image registration (feature matching / optical flow) that exists in neither the spec, nor the repo, nor canvas.

**The shared component is the frame pump — capture N video frames into buffers. That is the easy 10%.** The denoiser (registration + per-tile robust averaging, almost certainly WebGL or WASM to run inside ~300 ms on a mid-range Android at 3.7 MP) is **entirely new work**, and it is where the schedule and the risk live. Stacking is not a follow-on to Drag mode; it is a separate project that reuses a buffer.

### 5.2 The alignment problem inverts exactly where it is needed

`[MODELLED]` Over a ~300 ms burst at 2560×1440 (~39 px/deg), handheld drift of ~1 deg/s gives ~12 px of global translation — cheap to absorb with a coarse translate-only search on a downsampled luma pyramid. But a guest dancing at ~0.5 m/s at 3 m subtends ~673 px/m, so **the subject displaces ~100 px across the same burst.** Global alignment locks the tablecloth and ghosts the face. The standard remedy — per-tile robust merge with reject-and-fall-back-to-reference — drops effective N to ~1 *precisely in the moving regions.*

**Stacking cleans the room and leaves the face noisy.** It must never be marketed internally as the low-light fix.

There is a second, harder physical objection: **dark rooms lengthen exposure, so frames arrive sparse and individually smeared.** Align-then-average needs N frames that are each sharp; a dark reception on auto-exposure may yield 2–3 mushy ones. `[MODELLED]` — one lens sourced this to the spec's sparse-frame fallback row, but that row is about *a slow phone* (a CPU condition), not a dark room, so the citation does not carry it (§ 10.8). **This is the single most decisive unknown in the entire question, and it is measurable in one evening** (§ 7).

### 5.3 The face-embed order is not broken by stacking — with one prerequisite

The Themes spec § 5.1 already fixes the order and it is correct:

```
frame 1 (sharp) → embed faces → blend frames 1..N → applyPapicStyle → stamp → encode
```

This satisfies the load-bearing contract in `lib/papic-photo-styles.ts` (*"Draw clean → embed → THEN applyPapicStyle → encode upload"*). **But the two surfaces honour it by different mechanisms**, and this asymmetry is a prerequisite, not a detail `[VERIFIED-CODE]`:

- **Guest** `await`s `embedFaces(canvas)` **inside the shutter**, before styling and encode.
- **Seat** encodes a clean q0.9 JPEG, returns, and runs `autoTagFromBlob` afterwards — explicitly documented so *"the shutter never waits on it."*

**So the guest shutter already blocks on face-api.** Adding an N-frame accumulate in front of it stacks two blocking costs on the rail with the most users and the weakest phones. **Prerequisite:** make the guest embed non-blocking (as seat already is) *before* any stacking work, and build the pump in `lib/use-papic-camera.ts` (299 lines) rather than twice in components that are already 1,502 and 1,366 lines and diverging.

---

## § 6 — Engineering cost and the fail-closed sequencing ruling

### 6.1 The brief's premise is wrong: there is not one RPC, there are two gates and four money RPCs

This is the most consequential correction in the council (§ 10.2). The brief and one lens modelled **one** points gate. In fact:

| Rail | Gate | Mechanism |
|---|---|---|
| **Guests** (volume) | `papic_record_guest_capture` | `POST /api/papic/guest-capture` → pre-check `pre.remaining <= 0` → **409 `quota_exhausted`**. Counts **captures** against a server-owned `remaining`. |
| **Dedicated seats** | `papic_reserve_camera_points` → **then** `papic_reserve_event_points` | Two-phase reserve against a per-day tier budget **and** an event-lifetime pool, with compensating unwind via `papic_release_camera_points` / `papic_release_event_points`. Counts **points**. |

`[VERIFIED-CODE]` — `route.ts:175-176, :222`; `actions.ts:365, :398, :427, :438`.

**Consequences the brief did not carry:** "clip 3→7" is a **seat-rail** change with no guest-rail analogue. Raising a clip from 3 to 7 points also burns the **event-lifetime pool** 2.33× faster. And any re-verify must exercise the **unwind path** — a clip that reserves seat points then fails the event pool leaves a compensating release nobody has ever run.

### 6.2 The windowing ruling

**Two windows, not four — and neither is exempt.**

**Window A — MONEY.** The three queued points changes ship **together**, not separately: clip 3→7, the free-tier floor, and Mini/Max per-day→per-event all read the same two objects (`papic_tier_config.points_per_day`, `papic_seat_day_usage` keyed on `usage_date`). Splitting them produces live intermediate states that are internally *wrong* — clip=7 against a per-**day** 20-point free floor means three clips exhaust a camera. These are one change wearing three names. **Fold the guest-rail telemetry DDL + RPC signature bump into this window** (§ 6.3). Re-verify against the migration's own POST-MIGRATION VERIFICATION block **plus** the event-pool unwind.

**Window B — AVAILABILITY.** Any shared-hook change (torch; later, a frame pump). One lens argued this needs no money-path ceremony because the credit gate is server-side. **That is right about the ledger and wrong about the harm** (§ 10.7). The owner's constraint is scoped to *the capture path* — "a bug there stops capture at a live wedding and there is no re-shoot." A `getUserMedia` constraint that throws `OverconstrainedError`, or an `applyConstraints` that kills the track, produces **no stream and no photos at all**. From the couple's side that is indistinguishable from a blown gate, and worse: money is reversible, a wedding is not.

**Split the constraint on the right axis:**

- **Fail-closed MONEY code** (ledger, RPCs) → ships alone, reversible, verified by budget arithmetic.
- **Fail-closed AVAILABILITY code** (`use-papic-camera.ts`, which owns the stream for all three rails) → ships alone, **irreversible**, verified by a real-device matrix and a live-event canary.

The precedent cuts against treating the hook as ordinary code: **HI_RES shipped through this hook and landed the ~2 MP budget mismatch the council itself found.** That is what happens when this path ships as a normal merge.

### 6.3 Instrumenting the volume rail is not a payload edit

`[MEASURED]` Of `{device_model, width_px, height_px, size_bytes, geo_lat}`, **`papic_guest_captures` has none of them** — only `captured_at`. All exist on `papic_photos`. And guest inserts go through the money RPC.

**So:** seat-rail telemetry is genuinely payload-only (~0.5 d). **Guest-rail telemetry requires `ALTER TABLE` plus a `papic_record_guest_capture` signature bump — DDL on the guest gate — and therefore belongs inside Window A.** Without it, the rail that actually shoots receptions still produces zero evidence.

### 6.4 Cost summary

| Item | Cost | Path |
|---|---|---|
| Install-banner fix + perf-budget reconciliation | ~0.5 d | outside capture path |
| `/papic/lightcheck` probe + dark-room shoot | 1 afternoon | throwaway route, no gate, no upload |
| Window A (3 points changes + guest telemetry DDL/RPC) | 1 window + full re-verify | money |
| Torch/flash, if the probe finds it | ~1 d + device matrix + canary | availability |
| Frame stacking, **if ever** | **7–9 engineer-days**, against a 3.7 MP budget, WebGL/WASM likely forced | availability |
| Native capture plugin | **10–16 engineer-days** + store review per ship + a permanent third capture path that must independently honour the points reserve, embed-before-style, the 5 s cap, five Looks, quality tiers and the offline queue | rejected |

---

## § 7 — What to measure before building anything

**Prod, 2026-07-21, re-confirmed by the Chair this session:**

| Metric | Value |
|---|---|
| `events` | **63** |
| `papic_photos` | **13** — of which **8** are seeds (`device_model` = "Sample Device (placeholder)") |
| `papic_photos` real rows with `device_model` | **0** |
| `papic_photos` rows with `width_px` | **8** — *the seeds are the only ones* |
| **`papic_guest_captures`** | **0** |
| `vendor_papic_captures` | **0** |
| `papic_seat_day_usage` | **0** |
| `guest_face_enrollments` | **0** |

**No guest has ever taken a Papic photo. No vendor has ever taken a Papic photo. Neither points gate has ever metered anything in production.** Every re-verify in any plan below is a staging exercise with no production regression baseline.

The low-light complaint is therefore a **sample of one** — the owner holding his own phone in a dark room. That is a real signal and worth acting on. It is not a measurement, and it cannot justify a month.

### 7.1 The measurement plan — one afternoon, zero product code

**M1 · Capability probe.** A throwaway `/papic/lightcheck` route — **no points gate, no upload**. Dump `navigator.mediaDevices.getSupportedConstraints()`, `track.getCapabilities()` and `track.getSettings()` from the live Papic stream, plus `typeof window.ImageCapture` **and a real `new ImageCapture(track).takePhoto()` attempt** (`getCapabilities()` does not answer the ImageCapture question — § 10.9). Run on a real iPhone and a real PH-market mid-range Android. **This converts torch, exposure, `frameRate` and ImageCapture from `[UNVERIFIED]` to measured, for free.**

**M2 · The two-phone side-by-side.** Same dim room, Papic vs Camera.app, both phones. **Classify the gap: brightness, grain, or motion blur.** These have different fixes and only one of them is stacking. If brightness dominates, stacking delivers nothing.

**M3 · Frame-arrival rate in the dark.** Log actual delivered FPS off the live track in a genuinely dark room. **This single number decides whether frame stacking is physically possible at all** — if AE drops the stream to 8 fps, a 300 ms window yields 2–3 frames and the whole approach is dead before costing.

**M4 · Real low-light telemetry.** Note that `device_model`/`width_px`/`height_px`/`size_bytes` **cannot measure low light** (§ 10.1) — a noisy underexposed reception frame and a clean daylight frame from the same iPhone produce identical values in all four. There is no luminance, ISO, or exposure column anywhere `[MEASURED]`. The cheap honest fix needs no platform API: **the frame is already on a canvas for the Looks pipeline, so compute mean-luminance and dark-pixel-fraction from the buffer you already have and store two `smallint` columns**, alongside `track.getSettings()` width/height/frameRate.

---

## § 8 — The recommendation, sequenced, with gates

> **The red team held the last word on whether to build at all, and its argument binds:** Papic cannot take money. `add-ons-catalog.ts:620` keeps `papic-guest` deliberately `coming_soon`, blocked on four **non-code** gates — *0b* (owner DB action repricing `PAPIC_GUEST` off the pax curve; the live catalog row still says ₱2,999), *0c* (event-scoped points pool), *0d/0e* (ROPA row + DPO sign-off on RSVP consent text). `[VERIFIED-CODE]` The comment notes the flip is *"a one-word change with no 404."* Meanwhile face-sort has never run for a single human. **Low light is roughly the third-best photo problem and the eighth-best problem overall.**

### Tier (i) — Ships now, no gate

**A1 · Fix the install-banner false claim and rail-gate it.** `app-install-banner.tsx:90` promises *"A faster camera and instant uploads"* — **untrue**, because the shell is a remote-URL webview running the identical path (§ 3.2). Worse, `papic/join/[token]/page.tsx` renders the banner unconditionally for **both** `seat` and `guest` kinds, on the same screen whose body reads *"no app to install"* at `:162`. It is dormant only because the store-URL env vars are unset. **Land this before `NEXT_PUBLIC_IOS_APP_STORE_URL` is ever set**, or the first install cohort gets a false quality promise. Outside the capture path.

**A2 · Reconcile the stale perf budget.** `papic-photo-styles.ts:32` and Themes spec line 297 both budget ~2 MP; the hook requests ~3.7 MP. Correct both. No runtime change; prevents every future N-frame plan from being costed ~1.85× light.

### Tier (iii) — Measure first

**B · Run M1–M3 (§ 7.1).** One afternoon. **This is the gate on everything below.** If M2 shows the dominant defect is brightness rather than grain, stacking is dead and only flash survives. If M3 shows sparse frames in the dark, stacking is dead outright.

### Tier (ii) — Owner decision → § 9

### Conditional build — only if the probe returns torch

**C · Ship the FLASH, not a settings toggle.** A disposable camera is *supposed* to have a flash; this deepens the metaphor rather than straining it, and it is the only lever that adds photons. **Mandatory mitigations, all of them:**

- Behind a **runtime kill-switch**; **default OFF**.
- **Never applied during stream acquisition** — only via `applyConstraints` on an already-live track, with `.catch()` swallowing rejection exactly as `applyZoom` already does at `use-papic-camera.ts:71`.
- **Capability-gated** on `track.getCapabilities().torch`, following the hook's existing and correct "build all, gate by device" rule so no dead button ever appears.
- **Version-gated** so pre-17.5 iOS never receives it — the known WebKit failure mode is *the camera pausing when torch is enabled* (§ 2.3), on a path with no re-shoot.
- Ships **ALONE** in Window B as availability code, with a real-device matrix and a live-event canary.
- **Do not put "flash" in marketing copy as universal.** Expect a materially split experience across one guest list.

**Scope it honestly in every internal document: torch owns the near field (< 2 m) and does essentially nothing at 5 m across a ballroom.** It solves *dark people near you*, not *dark rooms*.

### Deferred, with named re-open conditions

| Deferred | Re-open when |
|---|---|
| **Frame stacking** | M3 shows ≥ 8 sharp frames arrive in 300 ms in a real dark room **and** M2 shows grain (not brightness) dominates **and** the guest-rail embed has been made non-blocking. Then cost it as a **7–9 day greenfield** WebGL/WASM denoiser, not a Drag follow-on. |
| **Noise-aware Looks** (scale RETRO grain / MONO unsharp down as measured frame noise rises) | M2 confirms grain is the defect. Cheapest true perceived-quality win, post-capture only. |
| **Native capture plugin** | Repeat vendor usage exists **and** the rail-2/rail-3 population justifies a second capture path. Never for guests. |
| **`papic-adaptive-quality` 0.72 floor** | Only where measured upload success at the larger size holds. **Not a free win** — it attacks a system whose job is keeping photos flowing at a bad-WiFi venue. |

### The positioning answer

**No lever, web or native, solves room-scale darkness.** Torch fixes the near field; stacking fixes static subjects; Night Mode — which would fix the room — is available to nobody in this market. Every competitor is browser-based and hits the identical wall. **So the winner is not whoever gets the most stops; it is whoever makes 11 p.m. look deliberate.** Flash-lit near field falling off into darkness, grain, date stamp, RETRO/LOMO — that *is* the disposable-camera aesthetic, and we already ship five Looks that lean into it.

One honesty constraint on that position, from the corpus's own words (`Papic_Themes_Spec_2026-07-21.md § 5.2`): *"blurry photos delight occasionally and ruin 3,000."* **Grain is defensible as a per-shot axis and a rationalisation as a floor.** Sensor noise is every shot, so it cannot be the charm. The aesthetic position is only honest if the clean baseline (ORIG) is good enough that grain is a *choice* — which makes lifting the clean floor a **prerequisite** for the position, not an alternative to it.

---

## § 9 — Owner decision queue

| # | Decision | Why it needs you | Recommendation |
|---|---|---|---|
| **1** | **Month allocation: revenue or image quality?** | The red team's binding argument. Papic cannot take money; the guest pass is one word from live behind four non-code gates (0b DB reprice, 0c points pool, 0d/0e ROPA + DPO consent text), and face-sort has never run once. | **Revenue.** Clear the Phase-0 gates and host the face model. Spend one afternoon on measurement, ~0.5 d on Tier (i), and nothing else on light until one paid event produces real frames. |
| **2** | **Is flash default-ON, default-OFF, or auto?** | Aesthetic + support call, not engineering. A phone torch is hard, flat, close-range light — harsh shadows and blown foreheads at 0.5 m, nothing at 5 m. It also draws real battery and heat across a 5-hour reception, and a hot phone throttles the encode. | **Default OFF, user-armed**, with the default revisited only after a real visual pass — exactly as Themes spec § 6 demands for the Looks. |
| **3** | **Scope the native-camera rejection.** | The corpus rejection cannot read "native camera is rejected" flat, or it contradicts the Container verdict's Guideline 4.2 mitigation row (§ 3.4) the moment iOS is attempted. | Write it as **"rejected as an image-quality investment; retained as an optional 4.2 review mitigation"** — with the 30% and gallery-split reasoning recorded so it does not resurface as a free lunch. |
| **4** | **The Universal-Link exposure — highest-severity item in this council, and it is not about light.** | `apps/web/public/.well-known/apple-app-site-association` declares `"paths": ["/dashboard/*", "/papic/*"]` for `com.setnayan.app` `[VERIFIED-CODE]`. Once the iOS app ships and is installed, **every scanned Papic QR routes into the shell's WKWebView before the page loads** — a capture runtime the Container verdict says is *"currently compile-verified only."* `capacitor.config.ts` also sets `limitsNavigationsToAppBoundDomains: false`, so `getUserMedia` inside a remote-URL WKWebView is a materially different code path from Safari. | **Gate store submission on Container-verdict Phase 0**: prove capture / clip / QR / selfie / back-nav on a real iPhone and Android first. Do not let a store binary route live weddings into an untested capture path. |
| **5** *(counsel)* | Does a capture-only iOS shell with **no purchase surface** avoid Apple 3.1.1 entirely? | Determines whether native ever carries a 30% cost at all (§ 3.5). Currently `[MODELLED]` and used to price a decision it may not apply to. | Confirm **before** any native decision, not after. |

---

## § 10 — Cross-examination corrections

Per corpus convention, verification corrections are **named, never silently absorbed.** Each of the following landed at `certain` or `likely` and therefore **wins** over its lens.

**10.1 · `certain` — the proposed telemetry cannot measure low light.** *(vs. red team, sequence step 1)* Wiring `device_model` / `width_px` / `height_px` / `size_bytes` tells you *which phone* and *how big*, not how dark. A noisy underexposed reception frame and a clean daylight frame from the same iPhone produce byte-identical values in all four; there is no luminance, ISO, or exposure column anywhere `[MEASURED]`. The lens deferred the decision pending data, then specified telemetry structurally incapable of producing it — guaranteeing the identical zero-evidence council in three months, which is the outcome its own risk register named. **Correction adopted:** mean-luminance + dark-pixel-fraction computed from the canvas buffer already in hand (§ 7.1 M4).

**10.2 · `certain` — there are TWO gates, not one; and four money RPCs, not one.** *(vs. engineering lens, findings 2–3; and vs. the brief's own "one RPC" framing)* The lens modelled only the seat rail (`papicCaptureCost` → `papic_reserve_camera_points`). The **volume rail** — guests at receptions, the entire population the question is about — runs a completely separate gate (`papic_record_guest_capture`, 409 `quota_exhausted`), and the seat rail carries a **second** reserve against an event-lifetime pool (`papic_reserve_event_points`) with two compensating unwinds. Building a product-wide windowing conclusion on a gate the volume rail does not use was the load-bearing error of that lens. **Correction adopted in § 6.1–6.3**, including the finding that guest-rail instrumentation requires DDL + an RPC signature bump and must land *inside* the money window.

**10.3 · `certain` — "one mechanism, two products" is ~10% true.** *(vs. native-delta lens, finding 5)* The Themes spec specifies *"canvas compositing with falling opacity"* — a weighted blend dominated by the newest frame, **not an average**, yielding nowhere near √N; and **alignment is not a blend option** but per-frame registration that exists in neither spec, repo, nor canvas. The lens's own risk register conceded "align-then-average needs real alignment," directly contradicting its finding. **Correction adopted:** the shared component is the frame pump; the denoiser is greenfield (§ 5.1).

**10.4 · `certain` — the consistency argument proves too much.** *(vs. rail-segmentation lens, "THE CRUX")* The gallery merge is real, but the premise that the album is currently uniform is false: `HI_RES` is requested with no device tiering, so handset variance already exceeds anything torch would add, and the five Looks already do not exist on the vendor rail. If adjacent-frame inconsistency were disqualifying, the product would already be disqualified. **Correction adopted:** narrowed to "do not introduce a delta attributable to **what the buyer paid**" (§ 4.1). The rejection of rail-segmented quality survives on the two claims that verify cleanly — native buys zero today, and one hook serves three rails.

**10.5 · `certain` — the 0.72 JPEG floor is not a free win.** *(vs. native-delta lens, sequence item 3)* 0.9 is the default; 0.72 fires only on a degraded link, and the seat surface encodes its clean frame at a hardcoded 0.9 regardless of tier. Raising it deliberately attacks the system whose job is keeping photos flowing at a bad-WiFi venue — which the lens flagged in its own risks while still listing it as a sequence item. **Correction adopted:** demoted to conditional, gated on measured upload success (§ 8).

**10.6 · `certain` — provenance is not missing.** *(vs. rail-segmentation lens, risk 4)* `photo_tags.source_table` is already selected, threaded, and mapped to a user-facing `'seat' | 'guest'` value. Support can attribute any photo to its rail today; only the visible label is absent. **Correction adopted:** labelling is a copy change, so unattributability is **not** a valid argument against tiering (§ 4.1).

**10.7 · `certain` — the fail-closed constraint must be split on the right axis, and the "ordinary code" exemption is refused.** *(vs. red team finding 6, and vs. native-delta's parallel exemption)* The ledger half is correct — the credit gate is server-side. But the constraint's stated harm is *"a bug on that path stops capture at a live wedding and there is no re-shoot,"* and a broken `getUserMedia` constraint produces **no stream at all** — indistinguishable from a blown gate, and unlike money, irreversible. Two lenses narrowed "money code" to "code that computes cost" in order to license a lighter process for their own plans while invoking the full constraint to condemn native. **Correction adopted:** money code vs **availability code**, the latter verified by device matrix + canary rather than budget arithmetic (§ 6.2). Relatedly, the red team's proposed "exposure/ISO nudge" is an unsourced platform claim with zero in-repo precedent — **demoted from a build item to a probe** (§ 7.1 M1).

**10.8 · `likely` — the sparse-frame citation does not support the optics claim.** *(vs. red team finding 6)* Themes spec § 5.2's fallback row is about **a slow phone** (a CPU/frame-rate condition) in the context of **Drag**, where smear is the product — not about a dark room. The lens converted a perf fallback for one product into an optics proof against a different one. **The underlying physics point survives and is the strongest argument against stacking here**, re-tagged `[MODELLED]` and re-sourced (§ 5.2), and promoted to the decisive measurement M3.

**10.9 · `certain` — `getCapabilities()` does not answer the ImageCapture question.** *(vs. engineering lens, sequence step 2)* It answers torch and exposure; ImageCapture requires a separate constructor probe and a real `takePhoto()` attempt, and **nothing in any browser probe can answer the Night Mode / Deep Fusion question**, which is not a web-exposed concept. **Correction adopted in § 7.1 M1**, with the explicit note that Night Mode stays `[UNVERIFIED]` and must not be used to justify *or* reject the native plugin.

**10.10 · `certain` — evidence-discipline breach on the single most load-bearing item.** *(vs. web-ceiling lens, finding 1)* The torch/iOS claim was tagged `[VERIFIED-CODE]` — a tag the brief defines as `path:line` on `origin/main`. **There is no code; a repo grep for `torch` returns one tiki-torch prompt string.** The cited provenance (a WebKit bug number, a reporter comment, a landing date) was recalled from memory — exactly the failure mode the brief singled out. **Substance survives and is now better sourced:** I fetched `webkit.org/blog/15383` directly and confirmed *"Fixed the camera pausing occasionally when torch is enabled"*, plus the Safari 18.4 `getSettings()` torch/whiteBalanceMode fix. **Retagged `[VERIFIED-SOURCE]`; the bug-number and reporter provenance are struck.** The version floor remains `[UNVERIFIED]` pending M1, and `exposureCompensation`/`iso` on Safari remain `[UNVERIFIED]` and are used to argue nothing.

**10.11 · `likely` — torch does not "solve dark receptions."** *(vs. web-ceiling lens, headline)* A ~50-lumen continuous source obeys inverse-square: the ~2–3 stop figure holds at 1–2 m and is a fraction of a stop at 4 m. Papic's signature shot is candid across a table or on a dancefloor — largely outside torch range. The lens buried this as an aesthetic note rather than a range limit gating its headline number. **Correction adopted throughout:** torch owns the near field; **room-scale darkness is unsolved by any web or native lever** (§ 2.2, § 8).

**10.12 · `likely` — stacking and torch are complementary by range, not ranked.** *(vs. web-ceiling lens, "distant second")* Once 10.11 lands, stacking is not the distant second for mid- and long-range frames — it is the only remaining lever, and the ghosting objection *weakens* with distance as a face subtends fewer pixels. **Correction adopted:** stacking stays sequenced last (greenfield, on availability code, gated on M3) but is no longer characterised as marginal.

**10.13 · `certain` — native capture was not "already rejected."** *(vs. red team finding 3)* The two "True gaps" quotes are accurate, but the same verdict's risk table names **native camera** as a Guideline 4.2 mitigation. The lens read half the document, and this was the load-bearing citation for its central conclusion. **Correction adopted in § 3.4 and owner decision 3** — the rejection must be scoped "not for image quality." *(Chair's narrowing: the 4.2 mitigations actually scheduled are reviewer notes + demo account + app-first login, the last already wired per line 46 — so the correction is right that the door is not closed, but native camera is one option among several, not a requirement.)*

**10.14 · `likely` — do not price native at 30%.** *(vs. red team finding 4)* Papic is bought by the host on the web dashboard; guests buy nothing. A capture-only iOS shell containing no purchase surface plausibly carries zero 3.1.1 exposure, independent of the physical-service argument. **Correction adopted:** reframed as "does the shell contain a purchase surface?" and routed to counsel (§ 3.5, § 9.5).

**10.15 · `possible`, adopted for precision — "ZERO real captures" is overstated.** *(vs. red team headline)* Five rows did traverse the capture path on 2026-06-26. **Tightened to the version that is exactly true and still devastating:** zero captures by any **guest**, zero by any **vendor**, zero face enrollments, zero rows carrying device or resolution metadata, across 63 events `[MEASURED, Chair-confirmed]`.

**10.16 · `certain`, minor — citation hygiene.** `frameRate` has three hits on `origin/main`, not one, and one of them (`panood/cam/[token]/panood-camera-publish.tsx`) is a **camera capture** surface, establishing in-repo precedent for frameRate tuning on a capture path. `lib/help.ts` is `:466`, not `:486`. The crew-page quote is *"…it from their own phone — no app to install — and every photo they take"*. Four further "no app to install" surfaces were missed, which **strengthens** § 4's retraction-cost argument. The `@capacitor/camera`-is-installed-but-unused inference is a **false signal** — the dependency is scaffolding for the shell's stated intent, not evidence that handoff was evaluated and rejected; the product argument against handoff (it surrenders the live Look viewfinder, gesture shutter, branded chrome, and shutter-time gate control) stands on its own.

---

## § 11 — Dissents, preserved verbatim

Recorded because each may be right, and each names the condition under which the majority verdict should be revisited.

**Dissent 1 — web-ceiling lens, on urgency.** *"Ship the flash, not the app. Torch is the only lever that is large (2-3 stops), available on both platforms right now, cheap (one file), safe (outside the fail-closed points gate, one edit lifts all three rails), and POSITIVE for positioning — a disposable camera is supposed to have a flash, so the fix deepens the metaphor instead of straining it."*

> **Chair:** substantively adopted, but sequenced behind the probe and stripped of the "solves dark receptions" headline (10.11). If the owner rejects decision 1 and elects to spend on quality now, **this is the plan** — a single day, with the § 8-C mitigations, and nothing else.

**Dissent 2 — native-delta lens, on positioning as the real answer.** *"Then stop chasing stops and sell the dark: no competitor can win on low light either, so the winner is the one whose photos look INTENTIONALLY like a flash-lit disposable camera at 11pm."*

> **Chair:** adopted as the positioning answer (§ 8), with the corpus's own honesty constraint attached — the clean baseline must be good enough that grain is a choice.

**Dissent 3 — native-delta lens, on the risk it accepts.** *"'Sell the dark' is a real positioning bet, not a hedge. If buyers judge Papic against their own iPhone side-by-side rather than against a disposable camera, aesthetics will not answer the objection and the demand for native returns — this time with the correct answer that native still cannot deliver Night Mode."*

> **Chair:** preserved unmodified. This is the genuine downside of the recommendation and it has no mitigation other than measurement.

**Dissent 4 — rail-segmentation lens, on the differentiator itself.** *"'No app download' is asserted on 20+ surfaces and measured nowhere; with 63 events and 5 orders we have no behavioural data on any rail. We may be defending a differentiator no PH couple actually prices — over-indexing on it could block a genuinely better vendor product."*

> **Chair:** preserved. Both "no app download is load-bearing" and "guests would never install" are currently **hypotheses, not findings.** The verdict does not trade a stated differentiator against an unmeasured one, but it should not be read as proof the differentiator is real.

**Dissent 5 — red team, on deferral risk.** *"First paid couple hates the reception photos and says so publicly — the real cost of deferring, and asymmetric for a pre-revenue brand. Mitigation: sell the disposable-camera aesthetic honestly in the purchase copy so dark shots read as the product, not a defect."*

> **Chair:** preserved, and the mitigation is adopted into § 8's positioning answer. This is the strongest argument against the majority sequencing.

**Dissent 6 — red team, on institutional gravity.** *"Capacitor is already committed, so a native capture plugin will keep looking cheap ('it is just a plugin') and get re-proposed. Write the rejection into the corpus with the 30 percent and gallery-split reasons so it does not resurface as a free lunch."*

> **Chair:** adopted as owner decision 3 — with the scope correction from 10.13, and **without** the 30% reasoning, which 10.14 showed may not apply. Record the reasons that survive: it buys ~1–2 stops that browser work largely reaches, it cannot buy Night Mode, it costs a permanent third capture path plus store review per ship, and the rail with the volume can never use it.

**Dissent 7 — red team, on telemetry follow-through.** *"Telemetry lands but nobody looks at it, so in three months we hold the same council with the same zero evidence. Assign the read explicitly to the first paid event's post-mortem."*

> **Chair:** adopted verbatim as a standing instruction. **The M1–M4 read is assigned to the first paid event's post-mortem**, and 10.1 is the reason the telemetry spec was rewritten to something that can actually answer the question.

---

### Recovery

Iteration specs at `0012_papic/NNNN_*.md` are archive stubs; recover full bodies with `git show 573a96c:<path>`. Live truth order: live site → `apps/web` @ `origin/main` → prod DB → `AS_BUILT_GROUND_TRUTH_2026-06-07.md` → dated siblings.

**Sources:** [WebKit Features in Safari 17.5](https://webkit.org/blog/15383/) · [WebKit Features in Safari 18.4](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/)