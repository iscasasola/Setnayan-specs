# Papic Build Plan — Pricing · Storage · Archive · Face (2026-07-11)

> ## 🚦 BUILD STATUS (updated 2026-07-11, autonomous execution)
> - **WS1a — pricing reprice** → ✅ **SHIPPED + MERGED** (PR #3040): caps ₱5,999/₱11,999 · free 10+3 · Wall ₱2,500 · Bridge ₱500. typecheck + 1388 tests + lint green.
> - **WS1b — ₱9,000 Ltd unlock** → ✅ **SHIPPED + MERGED** (PR #3044): `PAPIC_UNLOCK_LTD` + `ltdFree` bypass, both capture gates, 1392 tests + entitlement-gates guard green. **The pricing model is now complete + LIVE.**
> - **WS5 — face** → 🟢 **photo multi-tag ALREADY LIVE (2026-06-19), not a build** (Phase-0 audit correction: detect-all → per-subject `auto_face` ≤10 + strict opt-in `consent_at`, model hosted, real-face validated). **Clip/video gap BUILT + VERIFIED** → PR #3053, **auto-merge armed**. Browser verification (live in-app browser, 2026-07-11): synthesized a 5.07s multi-colour video → the sampler seeked to 6 interior timestamps reading **5 distinct frames** — the multi-frame decode/seek/sampling mechanism works in a real browser exactly as `pickClipSampleTimes` computed. Per-frame detection reuses the production-proven `embedFaces` (photo path); the only unexercisable bit is detection on a real on-camera face, which WS5 doesn't change (it changes *sampling*, not *detection*). 11 unit tests + typecheck + lint green.
> - **WS4 telemetry foundation** → ✅ **SHIPPED** (PR #3063, auto-merge armed): byte-accounting (`orig/display/thumb_bytes`) + pure `papic-storage-telemetry.ts` (real web-copy ratio over stills, per-event web-copy total, dialable over-ceiling flag). Non-destructive; 8 + 58 tests green. **This is what LOCKS the provisional 8%/40 GB numbers from real data.**
> - **Storage infra finding (2026-07-11):** the spine needs **NO new accounts** — `sharp` (AVIF-capable) + Vercel cron are already wired. So WS2 AVIF re-encode is a small extension of the proven `papic-derivatives.ts` sharp pipeline.
> - **WS2 AVIF re-encode** → 🟢 **buildable next** (safe/non-destructive: adds a smaller copy, drops nothing; involves gallery-reader AVIF-preference changes + a cron).
> - **WS2 3-mo full-res drop** → ✅ **BUILT (PR #3110, ships DRY-RUN / flag-off).** = "auto-compress after 3 months" (owner 2026-07-11): drops OUR R2 full-res photo original past the free window, keeps the AVIF web copy; couple's Drive untouched. Deletes nothing until `PAPIC_FULLRES_DROP_ENABLED=true`; 3 enable-blockers documented (lightbox-serves-web-copy verify · clip Drive-confirmed path · pre-drop email).
> - **WS4 "Drive-only-beyond" governor** → 🚫 **RETIRED 2026-07-11** (owner "we do not host 40gb. we just automatically compress after 3 months"). No 40 GB ceiling, no Drive-only-beyond — compression + the couple's Drive ARE the bound. WS4 byte-telemetry (#3063) + readout (#3104) stay (useful measurement); the governor mechanism is dropped.
> - **WS3 Keep Full-Res archive** → 🔴 still owner-gated (deep-cold provider + billing gateway).
>
> Net: the **complete, verifiable pricing model shipped**; face turned out already-live; the storage/archive workstreams are the real remaining build and are owner-infra-gated. See the consolidated status in the session + DECISION_LOG 2026-07-11.


> **Scope:** everything locked in the 2026-07-10/11 Papic pricing + storage + face session that is **spec-only (uncoded)**. Source of truth for the decisions: `Pricing.md § 2.1` + the 2026-07-10/11 rows in `DECISION_LOG.md`. All code work lands in the **`apps/web` repo** via the normal worktree/PR workflow (NOT corpus edits).
>
> **Legend:** 🧑 = OWNER infra/secret action (I can't do it) · 🛠 = code build (repo PR) · S/M/L = rough size. Numbers marked **PROVISIONAL** are admin-dialable and get locked from telemetry, not hard-coded.

---

## Owner prerequisites (gate the code — do these in parallel)

| # | Action | Gates |
|---|---|---|
| P1 🧑 | **Host `face-api.js` weights on R2** (detector + landmark-68 + recognition) + set `NEXT_PUBLIC_FACE_MODEL_URL` on Vercel + redeploy. | All of WS5 (face) runs only once this is live. Runbook = deliverable D-RUN below. |
| P2 🧑 | **Provision a deep-cold storage tier** (Backblaze B2 / Hetzner / Glacier-class) + S3-compatible keys. | WS3 (paid archive) + WS2 cold-tier. |
| P3 🧑 | **Confirm recurring-billing gateway** (Maya/PayMongo merchant app — already an open owner action from PR #3025). | Keep Full-Res auto-renew (WS3) charges for real; scaffold works without it. |

---

## Phase 0 — audit before building (do first · S)

The 2026-06-29 face plan and the per-camera cap fields are ~weeks old; this repo ships fast. Before WS2–WS5, **verify current `apps/web` state** so we don't rebuild shipped pieces:

- `lib/papic-cameras.ts` — current free-tier allowance constants; current cap-code reads.
- `events` table — do `papic_ltd_cap_php` / `papic_unli_cap_php` exist (per 2026-06-26)? current values?
- `platform_retail_catalog_v2` — `LIVE_WALL`, `CAMERA_BRIDGE`, `PAPIC_UNLOCK`, `HIGH_RES_ARCHIVE` rows + active state.
- `autoTagCapture`, `lib/face-embed.ts`, `lib/guest-live-gallery.ts`, `photo_tags` — how much of §4 face-routing already exists.
- Any existing consent column on guests/enrollments (`face_enrollments`), and the `bakeFaceBlurForCapture` gating.
- Recurring-billing scaffold from PR #3025 — the hook Keep Full-Res plugs into.

**Deliverable:** a short "already-shipped vs to-build" delta that trims the workstreams below.

---

## WS1 — Pricing & caps (catalog + config · low-risk · ship FIRST · S–M)

Independent of everything else; pure catalog/config. Land this first for immediate correctness.

1. 🛠 **Reset capture caps** — `events.papic_unli_cap_php = 1,199,900` (₱11,999) · `papic_ltd_cap_php = 599,900` (₱5,999), replacing flat ₱15,000. Admin-editable. `[S]`
2. 🛠 **`PAPIC_UNLOCK` two-tier bundle** — Unli-based ₱15,000 (1,500,000) · Ltd-based ₱9,000 (900,000) = capture **+ `LIVE_WALL` + `CAMERA_BRIDGE`**. One-click "buy everything on" purchase; framed as convenience bundle (= à-la-carte sum, not a discount). `[M]`
3. 🛠 **Add-on price round-ups** — `LIVE_WALL` 249,900 → **250,000** (₱2,500) · `CAMERA_BRIDGE` 49,900 → **50,000** (₱500). `[S]`
4. 🛠 **Free-tier allowance** — bump `lib/papic-cameras.ts`: first-5-free cameras **5→10 photos, 1→3 clips**. `[S]`
5. 🛠 **Add-ons bill ON TOP of the capture cap** (uncapped) — verify cart/checkout composes capture-cap + add-ons correctly; a maxed Unli day = ₱11,999 capture + add-ons each priced independently. `[S]`

---

## WS2 — Storage lifecycle & longevity (the core infra · L)

Turns "keep forever" from a liability into a bounded, lifetime-durable cost.

6. 🛠 **3-month full-res → web-copy compress job** — at event+90d (or Drive-synced sooner), drop our full-res, keep the ~8% web copy on standard R2 (instant-serve). For **Drive-connected** couples, compress our copy earlier (their originals are safe in Drive). `[M]`
7. 🛠 **Longevity ladder @ ~1yr** — unconditional **AVIF/AV1 re-encode at full web-resolution** (~2× smaller, zero visible loss) + **cold-tier** the web copy to R2 IA / deep-cold, **gated on gallery inactivity** (don't cold-move a still-actively-viewed gallery → per-view retrieval cost). `[M]`
8. 🛠 **Cold-storage tiers wired** — web copies → R2 IA / cold; the paid full-res archive → deep-cold (P2). `[M]` (depends P2)
9. 🛠 **Reserve levers (build stubs, default OFF)** — resolution step-down + thumbnail-grade for >5–15yr monster albums (visible-on-zoom → reserve only). Just scaffold + admin toggle; not on by default. `[S]`

---

## WS3 — Keep Full-Res archive SKU (₱999/yr/50GB · M–L)

Recurring revenue funds recurring storage; the paid full-res path.

10. 🛠 **Revive `HIGH_RES_ARCHIVE`** — annual, per-event, ₱999/50GB block (rounded up), on the recurring-billing scaffold (PR #3025). Auto-renew; lapse → graceful web-copy fallback (never delete). `[M]` (depends P3 for real auto-charge)
11. 🛠 **Web-only sale guard** — this SKU must NEVER be sold in-app (dodges the 30% IAP cut); enforce web-checkout-only. `[S]`
12. 🛠 **Drive-vs-our-storage billing gate** — charge ONLY when full-res is on OUR storage; a Drive-synced couple pays **₱0**. Detect Drive-sync state → suppress the charge / offer as managed alternative. `[M]`
12b. **Up to 2 Google Drives per event** (owner 2026-07-11) — the couple connects a **2nd Drive they own** for overflow when #1 fills. Design: additive `'drive_overflow'` provider value (slot 1 = `'drive'` unchanged, slot 2 = `'drive_overflow'`), so `UNIQUE(event_id, provider)` already permits 2 with **zero blast radius** on existing readers. **Core invariant: the couple's Drive full-res is NEVER compressed/tiered/dropped — only our R2 web copy is.**
    - ✅ **SHIPPED — schema foundation** (PR #3085): migration `20270720727938` widens the `provider` CHECK on `oauth_grants` + `oauth_state` to allow `'drive_overflow'`. Name-agnostic + idempotent; **verified against prod** in a rolled-back tx (preserves the live 4th value `'drive_photo_delivery'` the original migration's set had missed).
    - ✅ **SHIPPED — folder-slot schema** (PR #3097): migration `20270721479486` adds `drive_provider` (default `'drive'`) to `drive_copy_folders` + widens its unique `(event_id, kind)` → `(event_id, kind, drive_provider)`, so Drive #2 gets its own folder namespace. Additive/backward-compat; **verified against live prod** in a rolled-back tx (old constraint `drive_copy_folders_event_id_kind_key` confirmed).
    - 🟡 **REMAINING — the functional overflow** (atomic ~4-file code slice · **held for a 2-real-Drive smoke test** — Drive I/O + quota-full can't run in CI): ② **quota-exceeded fallback** in `runDriveCopyBatch` — a pure `isDriveQuotaExceededError` (Google 403 `storageQuotaExceeded`) + on that error switch `getEventDriveAccessToken(eventId, provider)` + folder-provider to `drive_overflow` for the rest of the batch (parametrize `ensureArtifactFolder`/`ensureFolderRow` by `driveProvider`); ③ **connect-2nd-Drive OAuth flow** — `/api/oauth/drive/start?slot=overflow` → `oauth_state.provider='drive_overflow'`; the shared `/callback` branches on the state provider → upserts the `drive_overflow` grant + bootstraps Drive #2's folders; ④ **UI** — "connect a second Drive **you own**" affordance + both-Drives status. **NOT gated on OAuth verification** — same `drive.file` scope + OAuth client as Drive #1, which is verified working in prod (1 live grant 2026-07-10). Smoke test to un-hold: connect 2 real Google accounts on one event, fill #1 → confirm captures land in #2, nothing lost, #1's full-res untouched. `[M]`
13. 🛠 **Deep-cold write + retrieval-on-request flow** — archive originals to deep-cold (P2); couple "requests" originals → ready in hours. UX for the request/ready notification. `[M]` (depends P2)

---

## WS4 — Anti-abuse / storage governor (M)

Makes NO event a lifetime money-loser under the capped price.

14. 🛠 **50 GB/camera·day fair-use fence** — per-camera·day data counter; throttle + admin-flag a runaway/abuse rig (invisible to real hand-shooters). `[M]`
15. 🛠 **Soft 40 GB/event web-copy ceiling — Drive-only-beyond** — accumulate per-event web-copy GB; past the ceiling, captures still deliver live + full-res still Drive-syncs, but we **stop growing the permanent free web mirror** (nothing deleted). Overage re-purchasable via Keep Full-Res. **40 GB is PROVISIONAL + admin-dialable.** `[M]`
16. 🛠 **300 GB/event admin-review alarm** — flag (not a wall) to admin console. `[S]`
17. 🛠 **Capture-window time-fence + wedding-scoped device-bound token** — verify server rejects capture outside the paid window; one token ≠ many devices/events (abuse/resale guard). `[S]` (may be partly shipped — Phase 0)
18. 🛠 **Content guard** — only in-app captures count (no arbitrary file uploads → no file-host abuse); 5-sec clip cap client-enforced; NSFW on. `[S]` (likely mostly shipped — Phase 0)

---

## WS5 — Face detection: activate + multi-tag + opt-in (M · gated on P1)

Delivers the owner's three asks. **Runs in prod ONLY after P1 (model hosted).**

- D-RUN 🧑📋 **Model-hosting runbook** (my deliverable, not a build): exact weight files, R2 upload script, env-var name+value, redeploy + smoke-test. Lets the owner do P1 in ~10 min.
19. 🛠 **Face-routing auto-tag = MULTI-TAGGING (§4)** — `detectAllFaces` → per-face **1:N match** within the event → write one `photo_tags(source='auto_face', confidence)` per matched subject → auto-deposit into each subject's "photos of you" gallery. Thresholds ≥0.85 auto / 0.65–0.85 suggested / <0.65 untagged. **10-tag/photo cap** (alphabetized truncation + shooter warning). "Mostly the existing `autoTagCapture` once live." `[M]`
20. 🛠 **Clip face-routing** — sample ~1 frame/sec through the same detect→match→route pipeline; clip routes to everyone who appears (light/free-box; blur stays render-class). `[S]`
21. 🛠 **Strict opt-in consent gate (§8) = TAG ONLY THOSE WHO AGREED** — new consent column + affirmative-opt-in gate; the engine attaches an identity **only** to guests who approved biometric tagging; opt-outs are **face-blurred** on public surfaces + **never auto-tagged**. Untagged-still-delivered intact (declining = not labelled/searchable, not excluded). `[M]`
22. 🛠 *(adjacent, optional)* **Walk-up face re-entry (§5)** + **Tier-2 `subject_center`** for auto-reframe — reuse `embedFaces`. Only if in scope; not required for multi-tag + opt-in. `[M]` — **defer unless owner wants it**

---

## Sequencing / dependency graph

```
Phase 0 audit  ──► trims everything below
                     │
WS1 pricing/caps ────┼──► SHIP FIRST (independent, low-risk)
                     │
P2 deep-cold ───► WS2 lifecycle/longevity ───► WS4 governor (40GB ceiling needs the web-copy accounting)
                     │
P2 + P3 ──────► WS3 Keep Full-Res archive
                     │
P1 model host ──► D-RUN runbook ──► WS5 face (multi-tag + opt-in)   [independent track]
```

**Recommended order to ship:** WS1 (now) → WS2 + WS3 (the storage spine, needs P2) → WS4 (governor, needs WS2's web-copy accounting) → WS5 (face, needs P1). WS5 can run fully in parallel since it shares no code with storage.

---

## Telemetry to LOCK the provisional numbers (build into WS2/WS4)

Every council lens flagged that the **8% web-copy ratio · ₱/GB cost · per-photo sizes** are **unmeasured**. Instrument from day one:

- Real per-camera GB (originals + web copy) per Unli event.
- Actual web-copy / original ratio (is it really ~8%? 4K HEIC / near-RAW could double it).
- AVIF/AV1 post-re-encode size + effective ₱/GB on the chosen deep-cold tier.

**Lock the 40 GB/event ceiling + the fair-use fence + the ₱11,999 cap only after the first ~50 real Unli events.** Keep all three admin-dialable. **Drift rule (owner-locked): if usage runs hot, raise the price cap — never shrink the "forever" gallery.**

---

## Definition of done (per workstream)

- **WS1:** live catalog + `events` caps reflect ₱11,999/₱5,999 · unlock ₱15,000/₱9,000 · Wall ₱2,500 · Bridge ₱500 · free 10+3; a maxed Unli day bills capture-capped + add-ons on top.
- **WS2:** an album auto-compresses at 3mo, re-encodes to AVIF + cold-tiers at 1yr; web copy served instant while fresh.
- **WS3:** a non-Drive couple can buy ₱999/50GB (web only), full-res lands in deep-cold, retrievable on request; Drive couples charged ₱0.
- **WS4:** a synthetic 300-cam/max event stops growing our web mirror at the ceiling (Drive-only beyond), nothing deleted; admin alarm fires >300 GB; telemetry logging live.
- **WS5:** after P1, a group photo auto-tags every *consenting* face into their galleries (≤10), opt-outs blurred + untagged, clips routed by frame-sampling.
```
