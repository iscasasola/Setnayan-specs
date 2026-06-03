# Storage & Google-Drive Copy Architecture — 2026-06-03

**Status:** decision LOCKED (owner-dictated 2026-06-03) · design draft · zero code yet. This doc is the canonical writeup of the lock; the **Cowork worklist** (§ 7) lists the exact iteration-spec edits the owner must apply via Cowork, and the **build plan** (§ 8) is the engineering pickup for the `setnayan-platform` repo. Until the build plan is greenlit, this is design only — it amends locked R2 / retention decisions, so nothing ships silently.

> **Owner directive (verbatim, 2026-06-03):**
> 1. *"everything happens on R2. Download will give them a copy. High res will be kept for 3 months and compressed after 3 months."*
> 2. *"youtube live separated. google drive handles, copy of the pakanta, monogram, papic, patiktok, pabati, qr codes"*

---

## 1 · The lock in one paragraph

**Cloudflare R2 is the single system of record for every media artifact Setnayan generates.** Capture, render, and generation all happen on R2. **Google Drive is the couple's permanent copy** — not the primary store. Setnayan keeps each artifact **high-res hot on R2 for 3 months**, then **compresses it** to a cold copy (the 5-year retention guarantee holds on the compressed version); the **High Res Archive ₱2,999/yr** SKU opts an event out of compression and keeps Setnayan's high-res copy. The couple gets their copy two ways: a **download-all** (local copy) and an **auto-sync into their own Google Drive**. The Drive sync covers six deliverable artifacts — **Pakanta · Monogram · Papic · Patiktok · Pabati · QR codes**. **Panood is carved out entirely**: live streaming and its archive live on YouTube (the couple's own channel via BYO-YouTube OAuth), never on Drive.

This supersedes the earlier "R2 hot 90 days → IA cold 5 years" line and the Papic "R2 → Drive transfer at T+30d" note.

---

## 2 · System-of-record vs. delivery (the corrected mental model)

```
            ┌──────────────────────── R2 · SYSTEM OF RECORD ────────────────────────┐
 capture /  │  Papic photos+clips · Patiktok MP4 · Pabati 5-sec reels ·             │
 render /   │  Pakanta song · Monogram (SVG + animation) · branded QR codes          │
 generate   │                                                                        │
            │   high-res HOT (3 months)  ──▶  COMPRESSED cold copy (5-yr retention)   │
            │   High Res Archive ₱2,999/yr  ⇒  opt out of compression (keep high-res) │
            └────┬───────────────────────────────────────────────────────────────────┘
                 │
        egress ──┼──▶  ⬇  Download-all            → couple's local copy
                 └──▶  ☁  Google Drive auto-sync   → couple's PERMANENT copy
                          (runs during the high-res window, so the couple keeps
                           the high-res original forever in their own Drive)

   Panood ─────▶  ▶ YouTube live  +  YouTube archive (couple's channel)   ── SEPARATE RAIL
```

**Why this shape.** Setnayan pays for only **3 months of high-res hot storage**; after that it compresses its own copy to shed cost, while the couple's high-res original already lives in *their* Drive. The couple never depends on Setnayan keeping high-res, and Setnayan never depends on the couple keeping their Drive folder — each side holds an independent copy. Drive is the *destination*, never the *engine*: live streaming stays YouTube, render stays FFmpeg, photo tagging / face-detect / gallery stay in the app.

---

## 3 · Retention & cost lifecycle

| Phase | R2 state | Couple's access |
|---|---|---|
| T0 — artifact finalized | High-res, hot | Download-all (high-res) · Drive auto-sync begins |
| T0 → T+3 months | High-res, hot | Full high-res download + Drive copy available |
| T+3 months | **Compressed** cold copy (high-res purged unless archived) | Compressed download from Setnayan; **high-res already in their Drive** |
| High Res Archive ₱2,999/yr active | High-res retained (compression skipped), renewable annually | High-res stays available from Setnayan too |
| Up to 5 years | Compressed copy retained (PH photographer-norm guarantee) | — |

**Locked numbers referenced (do not re-invent):** High Res Archive **₱2,999/yr** · high-res window **3 months** · retention **5 years**. These align with the pax-pricing lock (2026-06-01) and the Time & Money Saved model's "Google Drive photo auto-sync" + "High Res Archive free-baseline" rows.

---

## 4 · The Drive-copy set (six artifacts)

One "Connect your Google Drive" per event creates one event folder; each service writes its finalized deliverable into a subfolder. Scope stays `drive.file` (app touches only files it creates — the Google-review fast-track scope, already in code).

| # | Artifact | Source iteration / surface | What lands in Drive | Subfolder |
|---|---|---|---|---|
| 1 | **Pakanta** (custom AI wedding song) | 0036 (intake worktree unmerged) | Final song file(s) + royalty-free MP3 | `/Pakanta/` |
| 2 | **Monogram** (bespoke / animated) | 0037 + 0004 | SVG + animation export + any custom hero background | `/Monogram/` |
| 3 | **Papic** (photos + 5-sec clips) | 0012 | Finalized, tagged photos + clips | `/Papic/` |
| 4 | **Patiktok** (compilation reel) | 0017 | Rendered 9:16 MP4 (owned-AI-music backup copy) | `/Patiktok/` |
| 5 | **Pabati** (up to 300 × 5-sec videos) | v2.1 catalog #19 (no folder yet) | The collected 5-sec greeting videos | `/Pabati/` |
| 6 | **QR codes** (custom QR per guest) | 0002 / `custom-qr-guest` | Branded per-guest QR images + print-ready pack | `/QR Codes/` |

`/Setnayan · {couple} · {date}/` is the single parent folder (existing `buildPhotoDeliveryFolderName` format).

---

## 5 · Panood carve-out (explicit)

**Panood is NOT in the Drive copy set.** Google Drive cannot ingest or serve a live broadcast. Panood's rails:

- **Live delivery:** YouTube (BYO-YouTube via OAuth — already locked 2026-05-16, `lib/panood-youtube.ts`).
- **Archive:** YouTube auto-archive on the couple's own channel.
- **No Drive wiring.** Retire the 0011 offline-note line that said "recording → R2 archive that 0009 Photo Delivery can push to the couple's Google Drive."

---

## 6 · What this does to iteration 0009 (Photo Delivery)

0009 stops being a standalone "professional photographer's Google Drive folder" feature and **becomes the shared Drive-copy layer** that all six artifacts feed. The existing primitives already do most of the work:

- `apps/web/lib/papic-drive.ts` — OAuth authorization-code flow, `drive.file` scope, folder bootstrap (the primitive).
- `apps/web/lib/photo-delivery-drive.ts` — single-folder create + name builder (piggybacks on the same shared Google OAuth client).
- `oauth_state` table with a `provider` column; `/api/oauth/drive/*` + `/api/oauth/photo-delivery/*` routes; `/api/cron/photo-delivery-tick` async worker.

Generalize these into one `pushToDriveCopy()` module + one "Connect Drive" flow. See § 8.

---

## 7 · Cowork worklist (iteration-spec edits — owner applies via Cowork)

> Per the repo contract, Claude Code does **not** edit locked iteration specs directly. Each row below is an exact edit for a Cowork session. After editing each `.md`, regenerate its `.docx` mirror via pandoc (COWORK.md § "Decision update workflow", step 6).

| File | Change |
|---|---|
| `CLAUDE.md` (corpus root) — Architecture summary › Storage | Replace *"Cloudflare R2 (PH-region buckets) — hot 90 days, IA cold 5 years"* with the 3-month-high-res → compress model + "Google Drive = couple's permanent copy (download + auto-sync)". Add the Drive-copy set (6 artifacts) and the Panood carve-out to the locked-constraints list. |
| `0009_photo_delivery/0009_photo_delivery.md` | Rescope from "Google Drive integration for photo delivery" → **universal Drive-copy layer**: one Connect-Drive per event, one event folder, six artifact subfolders, `drive.file` scope, async copy worker. |
| `0012_paparazzi/0012_papic.md` | Storage section: **R2 = system of record**. Retire "R2 → Drive transfer at T+30d." Add: finalized tagged photos+clips auto-copy to the couple's Drive during the 3-month high-res window. |
| `0011_panood/0011_panood.md` + `0011_panood_offline_note.md` | State Panood is **excluded from the Drive copy layer** (YouTube live + YouTube archive only). Delete the offline-note "recording → R2 archive that 0009 can push to Drive" line. |
| `0017_patiktok/0017_patiktok.md` | Storage/dependency: source of record = R2 (not "Papic (storage)"). Add: rendered compilation MP4 auto-copies to `/Patiktok/` in the couple's Drive. |
| `0036_pakanta/…md` | Add: final song file copies to `/Pakanta/` in the couple's Drive. |
| `0037_bespoke_monogram/…md` + `0004_invitation_widgets/…md` | Add: monogram SVG + animation export copies to `/Monogram/`. |
| `0002_qr_invitation_system/…md` | Add: branded per-guest QR pack copies to `/QR Codes/`. |
| Pabati spec (v2.1 catalog #19 — no folder yet) | When the Pabati iteration is drafted, include `/Pabati/` Drive copy of the 5-sec videos. |
| Pax-pricing docs (`Time_and_Money_Saved_Model_2026-06-01.md`, `Service_Specifications_2026-06-02.md`, pax-pricing memory) | Reconcile the Drive auto-sync + High Res Archive rows to name the 6-artifact copy set and the 3-month → compress rule. |
| `DECISION_LOG.md` | ✅ row appended 2026-06-03 (done this session — see § 9). |

---

## 8 · Engineering build plan (`setnayan-platform`)

**Status (2026-06-03):** ✅ **Phase 1 (keystone) shipped + merged — [PR #825](https://github.com/iscasasola/setnayan-platform/pull/825)** (origin/main `f0c4f07`). `lib/drive-copy.ts` (`pushToDriveCopy`) + `lib/drive-upload.ts` (shared R2→Drive primitives) + migration `20260726000000` (`drive_copy_folders` + `drive_copy_artifacts`); `photo-delivery-release.ts` refactored onto the shared primitives (behavior-identical). All 12 CI gates green (typecheck/lint, production build, e2e, lighthouse). Phase 0 + Phases 2–4 remain. **Owner action:** push migration `20260726000000` (`supabase db push`).

Phased; reuses the existing Drive + cron primitives. No new external dependency beyond the Google verified-app review already pending (#19g) — which, once it clears, unblocks **all six** artifacts at once.

- **Phase 0 — consolidate OAuth to one "Connect Drive" per event.** Today `drive` (Papic) and `photo-delivery` (`provider='drive_photo_delivery'`) are separate OAuth start/callback flows over one shared Google client. Collapse to a single per-event connect (one redirect URI, `provider='drive'`), keep `drive.file` scope, keep the `oauth_state` CSRF + refresh-token storage + `/api/cron/oauth-refresh` pattern. (The Phase 1 layer already reads `provider='drive'`; this PR makes that the single connection.)
- **Phase 1 ✅ shipped ([PR #825](https://github.com/iscasasola/setnayan-platform/pull/825)) — `apps/web/lib/drive-copy.ts`** exposing `pushToDriveCopy({ eventId, artifactType, files[] })`: ensure event folder + per-artifact subfolder exist, upload each file via Drive multipart, record copy status + Drive file id per artifact. Idempotent (skip already-copied). Built on the new `lib/drive-upload.ts` primitives + the `drive_copy_folders` / `drive_copy_artifacts` schema; RLS service-role only; additive (live `photo_delivery_*` untouched).
- **Phase 2 — wire the six feeders.** After each service finalizes its R2 artifact, enqueue a copy job: `papic` (finalized/tagged), `patiktok` (render output), `pabati`, `monogram` (`animated-monogram`), `pakanta` (merge the `pakanta-intake` worktree first), `custom-qr-guest`. Reuse the `photo-delivery-tick` cron shape for async + retry. Backfill from R2 if the couple connects Drive after some artifacts already finalized (copies whatever R2 currently holds — high-res inside the window, compressed after).
- **Phase 3 — R2 retention job.** At T+3 months, transcode/compress high-res → cold copy and purge the high-res original, **unless** the event has an active High Res Archive grant. Keep the compressed copy under the 5-year retention.
- **Phase 4 — quota handling.** On Drive `403 storageQuotaExceeded`, surface "your Drive is full" + offer download-all and High Res Archive (R2 keeps high-res); don't fail the artifact.
- **Not touched:** `lib/panood-youtube.ts` and all Panood routes — Panood stays YouTube-only.

---

## 9 · Open items & risks

- **`drive.file` can't re-attach to a folder the couple deleted** — on next copy, re-create the folder (the scope can't list pre-existing files, which is also why we auto-create rather than letting the couple pick).
- **Pakanta is on an unmerged worktree** (`pakanta-intake`) — it must merge before it can feed the copy layer.
- **Verified-app review (#19g)** is the single owner-side gate; until it clears, Drive OAuth works only for the owner's own Gmail. The `drive.file` scope is the fast-track scope, so review should be clean.
- **Copy timing matters:** sync should run while R2 still holds high-res so the couple keeps high-res in their Drive; late connections after the 3-month compression get the compressed version.

---

## 10 · Decision-log entry

Appended to `DECISION_LOG.md` (2026-06-03): R2 = system of record · Drive = couple's permanent copy of 6 artifacts (Pakanta · Monogram · Papic · Patiktok · Pabati · QR codes) · 3-month high-res → compress · High Res Archive ₱2,999/yr opts out · Panood YouTube-separated. Pointer to this doc.
