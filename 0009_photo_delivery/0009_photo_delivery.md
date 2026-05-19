# 0009 — Photo Delivery to Couple's Cloud (Google Drive)

**Type:** Implementation work order (Claude Code ticket)
**Surface:** Setnayan Web → Couple Dashboard ("Photo Delivery" panel) + Backend background-job worker · **Bottom-nav tab: Add-ons** · URL: `setnayan.com/dashboard/[event-id]/services/photo-delivery`
**Phase:** Phase 1 (promoted from V1.5+ on 2026-05-18) — depends on Phase 1 (events, photos, R2 storage) and the photo-finalization workflow being in place. Implementation can run in parallel with native-app work.
**Status:** Ready for Claude Code
**V1 promotion 2026-05-18:** Iteration was V1.5+ build-deferred until owner promoted it into V1 scope on 2026-05-18 (see CLAUDE.md decision log). Architecture + SKU locks below stand; engineering capacity planning happens separately. Body references to "V1.5" further down (per-segment folder rename, bulk download zip, PH data residency opt-out) are post-V1 forward-looking ideas and are intentionally preserved.
**Date:** 2026-05-08
**Owner:** Ice (indaleciocasasolaii@gmail.com)
**Builds on:** 0000 (app shell, sign-in, event-scoped URL, Add-ons launcher), 0001 (events), 0002 (review/release model deferred section), spec 10 (photos, R2 retention)

---

## What to build

A couple-facing dashboard panel that **uploads the entire finalized wedding photo + clip archive to a Google Drive folder the couple controls.** The couple connects their Drive via OAuth, reviews/approves photos through the existing 7-day review window, then clicks "Release to Drive" — Setnayan's backend runs a background job that uploads everything in batches with retry/resume, and notifies the couple when complete.

This is the "deliverables-to-the-couple" pipeline. Wedding photographers traditionally hand over a hard drive or shared folder of photos after the event; Setnayan replaces that ceremony with an automated push to the couple's own cloud. Once delivered, the couple owns the archive in their own Drive — Setnayan also keeps an R2 backup for 5 years per spec 10's retention policy, but the couple's primary archive is on their account.

---

## Visual reference (canonical)

`0009_photo_delivery.html` (in this same folder) is the canonical visual reference. The mockup has a 4-state toggle at the canvas level showing the lifecycle of the panel:

- **Connect** — initial state. Couple hasn't linked Drive. Big OAuth CTA + 3-step explainer + permission disclosure.
- **Ready** — Drive connected, photos finalized through review, release button armed. Folder structure preview, summary stats (photo count, clip count, total size, photographer count), delivery timeline, FAQ.
- **Uploading** — release fired, background job in flight. Progress bar, current file indicator, recently-uploaded list, per-segment progress breakdown, retry policy explainer.
- **Complete** — upload done. Success state with Open-in-Drive CTA, total counts, manifest download, re-deliver option. Note explaining Setnayan keeps a 5-year R2 backup independent of Drive.

Open the mockup, click through all 4 states at both desktop and mobile widths. Match the layouts in production.

---

## Stack & conventions

- **Frontend:** Next.js 15 App Router, RSC for state-derived rendering of the panel; Client Components for the live progress polling during uploads.
- **OAuth provider:** Google OAuth 2.0 with PKCE. Scope: `https://www.googleapis.com/auth/drive.file` only. Setnayan can read/write files it creates and never sees the rest of the user's Drive.
- **Backend job runner:** Cloudflare Queues (already in stack per spec 10) for the upload batches. Each batch processes ~50 files. Resumable uploads via Drive's resumable-upload protocol.
- **Storage source:** Photos and clips already live in Cloudflare R2 (per spec 10). The job streams from R2 → Drive without buffering full files locally; uses signed-URL fetches and Drive's resumable upload endpoint.
- **Notifications:** email via Resend (existing stack); in-app via Server-Sent Events on the panel's "Uploading" / "Complete" state cards.
- **Validation:** Zod schemas on every API edge — release request, OAuth callback, status polling.

---

## Routes

```
setnayan.com/dashboard/photo-delivery                 → couple's Photo Delivery panel
GET  /api/oauth/google/start?event_id=...         → kicks off OAuth (returns auth URL with state token)
GET  /api/oauth/google/callback                   → handles OAuth redirect, stores tokens
POST /api/photo-delivery/release                  → triggers the background job
GET  /api/photo-delivery/status                   → polls upload progress (or SSE stream)
POST /api/photo-delivery/disconnect               → revokes Drive token, removes folder reference
POST /api/photo-delivery/redeliver                → enqueues a delta upload (only new/changed files)
```

OAuth state tokens are signed JWTs containing `event_id`, `couple_user_id`, and a 10-minute expiry, signed with `OAUTH_STATE_SECRET`.

---

## Data model

### Extensions to `events`

```sql
ALTER TABLE events ADD COLUMN photo_delivery_provider TEXT
  CHECK (photo_delivery_provider IN ('google_drive', 'dropbox', 'onedrive', 'icloud') OR photo_delivery_provider IS NULL);
ALTER TABLE events ADD COLUMN photo_delivery_oauth_token_encrypted TEXT;
  -- AES-256-GCM encrypted via env var ENCRYPTION_KEY. Refresh token stored, access token cached.
ALTER TABLE events ADD COLUMN photo_delivery_oauth_expires_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_folder_id TEXT;
  -- Drive folder ID created by Setnayan on first connect.
ALTER TABLE events ADD COLUMN photo_delivery_folder_name TEXT;
  -- Display name like "Setnayan · Maria & Juan Wedding · 2026-10-24"
ALTER TABLE events ADD COLUMN photo_delivery_account_email TEXT;
  -- Stored from OAuth profile claim, displayed in the panel ("m••• @ gmail.com")
ALTER TABLE events ADD COLUMN photo_delivery_status TEXT NOT NULL DEFAULT 'idle'
  CHECK (photo_delivery_status IN ('idle', 'connected', 'releasing', 'uploading', 'paused', 'complete', 'failed'));
ALTER TABLE events ADD COLUMN photo_delivery_progress_pct INT NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN photo_delivery_started_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_completed_at TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN photo_delivery_failed_count INT NOT NULL DEFAULT 0;
ALTER TABLE events ADD COLUMN photos_released_at TIMESTAMPTZ;
  -- Set when couple clicks "Release to Drive". Trigger flag for the upload job.
```

### Extensions to `photos`

```sql
ALTER TABLE photos ADD COLUMN delivered_to_drive_at TIMESTAMPTZ;
ALTER TABLE photos ADD COLUMN drive_file_id TEXT;
  -- File ID returned by Drive after successful upload. Used for redelivery dedup.
ALTER TABLE photos ADD COLUMN delivery_attempts INT NOT NULL DEFAULT 0;
ALTER TABLE photos ADD COLUMN delivery_last_error TEXT;
```

### New table: `photo_delivery_jobs`

```sql
CREATE TABLE photo_delivery_jobs (
  job_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  triggered_by_user_id UUID NOT NULL REFERENCES users(user_id),
  status           TEXT NOT NULL CHECK (status IN ('queued', 'running', 'paused', 'complete', 'failed', 'cancelled')),
  total_files      INT NOT NULL,
  uploaded_files   INT NOT NULL DEFAULT 0,
  failed_files     INT NOT NULL DEFAULT 0,
  total_bytes      BIGINT NOT NULL,
  uploaded_bytes   BIGINT NOT NULL DEFAULT 0,
  current_file     TEXT,
  current_segment  TEXT,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  notification_sent_at TIMESTAMPTZ
);

CREATE INDEX idx_photo_delivery_jobs_event ON photo_delivery_jobs(event_id, started_at DESC);
```

A job row is created on each `POST /api/photo-delivery/release` (or `/redeliver`). The frontend polls or subscribes to this row for status. Re-deliveries skip files where `photos.drive_file_id IS NOT NULL` and `photos.updated_at < photo_delivery_jobs.started_at`.

---

## OAuth flow

### Connect (one-time per event)

1. Couple clicks "Connect Google Drive" on the panel.
2. Frontend calls `GET /api/oauth/google/start?event_id=...`. Backend returns a Google authorization URL with `scope=drive.file`, `access_type=offline`, `prompt=consent`, and a signed `state` token.
3. Browser redirects to Google's auth screen. Couple selects their account, sees the permission disclosure ("Setnayan wants to access files it creates in Drive"), clicks Allow.
4. Google redirects back to `setnayan.com/api/oauth/google/callback?code=...&state=...`.
5. Backend exchanges code for refresh + access token, decrypts state token, fetches the user's email from the `userinfo` endpoint.
6. Backend creates a folder in Drive named `Setnayan · {couple_names} · {wedding_date}` via `POST drives.files`. Stores `folder_id`, `folder_name`, encrypted refresh token, account email on the events row.
7. Backend redirects browser to `/dashboard/photo-delivery` — panel re-renders in **Connected** state.

### Token refresh

Refresh tokens are long-lived (Google standard). Access tokens expire in 1 hour and are auto-refreshed by the backend using the stored refresh token before each batch upload starts.

### Disconnect

`POST /api/photo-delivery/disconnect` revokes the refresh token via Google's revoke endpoint, clears the `oauth_token`, `folder_id`, and `account_email` columns, and sets `photo_delivery_status` to `idle`. The Setnayan folder in the user's Drive is **not** deleted — files stay where they are.

---

## Release pipeline (the upload job)

### Trigger

`POST /api/photo-delivery/release` (couple-authenticated, owner of the event):

1. Validate event is in a releasable state — `now() > event.review_window_ends_at` AND `photo_delivery_status IN ('connected', 'failed')`.
2. Set `photos_released_at = NOW()`, `photo_delivery_status = 'releasing'`.
3. Create a `photo_delivery_jobs` row with `status = 'queued'` and `total_files`, `total_bytes` derived from the event's approved photos and clips.
4. Enqueue a Cloudflare Queue message: `{ job_id, event_id, batch_offset: 0 }`.
5. Return `202 Accepted` with `job_id`. Frontend transitions to **Uploading** state.

### Worker

Each queue message processes one batch (default 50 files, configurable by `PHOTO_DELIVERY_BATCH_SIZE`):

1. Refresh OAuth access token if expired.
2. Ensure segment subfolders exist in Drive (idempotent — get-or-create by name within the event's parent folder).
3. For each photo in the batch:
   a. Stream from R2 via signed URL.
   b. Upload to Drive via resumable-upload endpoint, with the file metadata (`name`, `parents: [segment_folder_id]`, `description: 'Setnayan · taken by {photographer} · tagged: {guest names}'`).
   c. On success: write `photos.drive_file_id`, `photos.delivered_to_drive_at`. Increment `photo_delivery_jobs.uploaded_files`, `uploaded_bytes`. Update `current_file`.
   d. On failure: increment `photos.delivery_attempts`. If attempts < 5, requeue with exponential backoff (5s, 25s, 2m, 10m, 50m). If attempts >= 5, write `photos.delivery_last_error`, increment `photo_delivery_jobs.failed_files`, and continue with the next file.
4. After batch: enqueue next batch with `batch_offset += batch_size`. If no more files remain, write the manifest CSV (see below) to Drive and mark the job complete.
5. Update `events.photo_delivery_progress_pct` after every file (not every batch — couples want responsive progress).

### Manifest CSV

Last file written to the Drive folder. Schema:

```csv
filename,segment,photographer,tagged_guests,timestamp,r2_object_key,drive_file_id,had_video_clip,delivery_status
IMG_0847.jpg,04_Reception,Photographer 3,"Maria;Juan;Marco Reyes",2026-10-24T19:42:18Z,paps/.../IMG_0847.jpg,1abc...xyz,false,delivered
CLIP_0199.mp4,04_Reception,Photographer 2,"Maria;Juan",2026-10-24T19:43:02Z,paps/.../CLIP_0199.mp4,9def...uvw,true,delivered
```

Always written, even when some files failed. Failed rows have `delivery_status = 'failed'` and a non-empty `delivery_last_error` column. Couples can re-deliver and only the failed rows will retry.

### Notification on completion

Email via Resend to the couple's primary email:

> Subject: Your wedding photos are in Drive
>
> 1,247 photos and 312 clips from Maria & Juan's wedding are now in your Setnayan folder.
>
> Open in Drive →
>
> Setnayan will keep a backup copy on our servers for 5 years.

In-app: the panel transitions to **Complete** state automatically via SSE — the couple sees the success card without refreshing.

---

## Page composition (desktop)

Match the mockup's "Web" frame at 1200px. The panel changes layout based on `events.photo_delivery_status`:

### State 1 — Connect (idle)

- **Hero card** — centered Drive logo (80px), heading "Send your finalized photos straight to your Google Drive", paragraph explainer, 3-step flow grid (Connect Drive / Review & approve / Release to Drive), big "Connect Google Drive" CTA button (Drive logo + label), permission disclosure card explaining the `drive.file` scope.

### State 2 — Ready (connected, photos finalized, awaiting release)

- **Connection status card** at top — green-checked, shows folder name, account email (masked: `m••• @ gmail.com`), Drive available space, Disconnect / Change folder buttons.
- **Two-column body**:
  - **Left (60%)**: Summary stats grid (Photos / Clips / Total size / Photographer count), Folder structure preview (collapsible tree of segment folders + manifest.csv + README.txt), big green "Release to Drive →" CTA card with explainer.
  - **Right (40%)**: Delivery timeline (event ended ✓, review complete ✓, Drive connected ✓, release ▸, upload+notify ○), Review status card (1,247 approved · 18 hidden), FAQ list.

### State 3 — Uploading

- **Connection status card** — amber-pulsing, "Uploading to Google Drive · started 11:42 AM", Pause / Cancel buttons.
- **Two-column body**:
  - **Left**: Big upload-progress card with progress bar (color-graded amber/orange), live progress meta (`67% complete · 847/1,247 photos · 200/312 clips · 2.8 GB/4.2 GB`), current-file row with thumbnail + file name + segment + size + spinner, "Recently uploaded" list (last 5 files).
  - **Right**: "While we upload" card explaining server-side execution + email notification, per-segment progress mini-tree with current segment highlighted, retry-policy explainer.

### State 4 — Complete

- **Connection status card** — green-checked, "Delivered · 1,247 photos in your Drive", Open-in-Drive button.
- **Big complete card** — checkmark icon, "All your photos are in Drive", paragraph confirmation, 3-stat grid (Photos / Clips / Total), action buttons (Open in Drive / Download manifest CSV / Re-deliver).
- **Backup retention notice card** below — explains Setnayan keeps R2 backup for 5 years, re-delivery available within that window.

## Page composition (mobile)

Match the mockup's mobile frame. Single-column, thumb-friendly, sticky-bottom CTAs.

### State 1 — Connect

App header → state pill ("Not connected") → centered connect card (Drive logo, heading, OAuth CTA button, permission scope note) → "How it works" timeline card.

### State 2 — Ready

State pill ("Ready to release") → compact connection card (Drive logo, "Drive connected", masked email, green check) → 2-col summary stats grid (Photos / Clips / Total size / ETA) → folder layout card → "Where you are" timeline card → **sticky bottom CTA bar** with "Release to Drive →" green button.

### State 3 — Uploading

State pill ("Uploading") → progress card with bar + ETA + current file → per-segment mini-tree → "You can close this app" reassurance card.

### State 4 — Complete

State pill ("Delivered") → centered complete card with checkmark, heading, 3-stat grid, primary "Open in Drive" CTA + secondary manifest/re-deliver links → backup retention note card.

---

## Functional scope

### Must work end-to-end

- OAuth Drive connect via the panel — full PKCE flow, token storage, folder creation, account-email display.
- Release trigger from the Ready-state CTA — server-side validation, job creation, queue enqueue, status transition.
- Background upload job — batch processing, segment folder creation, resumable uploads, per-file retry with exponential backoff, manifest CSV at the end.
- Live progress polling on the panel — frontend updates progress bar, current-file indicator, per-segment counts every 1-2 seconds during active upload.
- Email + in-app completion notification.
- Re-delivery — delta upload of only new/changed photos (compare `photos.updated_at` against `photo_delivery_jobs.started_at`).
- Disconnect Drive — revokes token, clears references, leaves files in Drive untouched.
- Disconnect-then-reconnect — picks up the existing folder if `folder_id` matches; creates a new folder if not.

### Out of scope (deferred)

- **Other cloud providers** (Dropbox, OneDrive, iCloud Drive) — schema supports them via the `provider` enum, but only Google Drive is implemented in V1.
- **Per-segment folder customization** — couples want to rename "04_Reception" to "Dinner Reception" etc. V1.5.
- **Direct-to-guest sharing** — couples want to share specific Drive subfolders with specific guests. Use Drive's native sharing for now; Setnayan doesn't manage sharing in V1.
- **Photo edits / cover-photo selection** — couples can select a cover photo or apply basic edits before release. V2.
- **Bulk download as zip** without Drive — V1.5 if there's demand from couples who don't have Drive.
- **Vendor delivery to vendor's Drive** — vendors might want their photos delivered to their portfolio. Din concern.

---

## Acceptance criteria

- [ ] Visiting `/dashboard/photo-delivery` for a couple-authenticated user with an event renders the appropriate state (Connect / Ready / Uploading / Complete) based on `events.photo_delivery_status`.
- [ ] OAuth Connect flow completes end-to-end with a real Google account in dev, creates the Setnayan folder in Drive with the correct name, stores the encrypted refresh token, and transitions the panel to **Connected**.
- [ ] Clicking "Release to Drive" enqueues a `photo_delivery_jobs` row, transitions the panel to **Uploading**, and the upload job processes batches without blocking the request.
- [ ] During upload, the progress bar updates within 2 seconds of each file's completion. Per-segment counts update correctly. Current-file indicator shows the actual file being uploaded.
- [ ] On a 1,247-photo + 312-clip test event (4.2 GB), the upload completes within 20 minutes on a clean run. With injected 10% random failures, retry logic recovers all but ~0% of files; failed files appear in the manifest with their error.
- [ ] Manifest CSV is the last file written to Drive, contains a row for every photo (delivered or failed) with the documented columns.
- [ ] On completion, the email is sent within 60 seconds, and the panel transitions to **Complete** via SSE without manual refresh.
- [ ] Re-delivery skips files with `photos.drive_file_id IS NOT NULL`. Adding a new photo to the gallery and re-delivering uploads only that one file.
- [ ] Disconnect revokes the token via Google's revoke endpoint; subsequent attempts to use the cached token return 401 from Google.
- [ ] All OAuth tokens stored at rest are AES-256-GCM encrypted; the encryption key is sourced from `ENCRYPTION_KEY` env var; never logged.
- [ ] Visual parity to `0009_photo_delivery.html` at 1200px desktop and 390px mobile widths in all 4 states.
- [ ] **Mobile is thumb-friendly** per the standing rule: ≥44pt tap targets, sticky-bottom Release CTA on mobile, primary actions in the bottom thumb zone.
- [ ] Lighthouse 90+ on the desktop panel.

---

## Privacy & compliance

- **drive.file scope** is the minimum needed — Setnayan can only access files it creates inside the Setnayan folder. We never see, list, or touch other Drive content.
- **OAuth tokens** are encrypted at rest using AES-256-GCM. Plaintext tokens never appear in logs, databases, or error reports.
- **Account email** is stored masked in the UI display (`m••• @ gmail.com`) but full email is in the database for support purposes; access is restricted to the couple, Setnayan Staff, and the system itself.
- **PH Data Privacy Act (RA 10173)** — guest photos uploaded to the couple's Drive are still subject to the consent rules from spec 10. Photos with `photo_consent = false` are NOT uploaded; they appear in the manifest with `delivery_status = 'consent_blocked'` so the couple knows.
- **Data residency** — Drive uploads cross to Google's data centers (typically US/EU). Couples are informed of this in the connect-flow permission disclosure. PH-sensitive couples can opt out of Drive delivery and use the bulk-download-zip option (V1.5).
- **5-year R2 backup** is independent of Drive — the couple's R2 copy is the disaster-recovery fallback if Drive content is accidentally deleted.

---

## Companion files to read before starting

1. `CLAUDE.md` — project context, locked architecture, decision log.
2. `0009_photo_delivery.html` (this folder) — visual reference, all 4 states.
3. `0009_photo_delivery.docx` (this folder) — narrative summary.
4. `0002_qr_invitation_system/0002_qr_invitation_system.md` — the deferred section that originally specced this iteration; the photos-released-at trigger flag is referenced from there.
5. `10_Papic_Feature_Specification.md` — defines the photos table, R2 storage, retention policy, and review window. This iteration consumes those.
6. `15_Couple_Landing_Page_Feature_Specification.md` — couple dashboard architecture; this panel slots into the existing dashboard nav.

---

## Notes for Claude Code

- **Drive API quotas matter.** Google's per-user-per-day Drive write quota is generous (~750 GB/day) but per-second rate is ~1,000 ops. Stay well under by serializing batches; don't parallel-upload 50 files at once. Sequential within a batch with the resumable upload protocol is fast enough.
- **Use the resumable upload protocol** for files > 5MB. Most photos and all clips will be > 5MB. Resumable uploads survive transient network errors at the file level (resume from last byte rather than restarting).
- **Don't buffer files locally.** Stream R2 → Drive via signed-URL fetch piped to Drive's upload session. Keep memory footprint per worker < 256MB.
- **Setnayan app verification.** Google's OAuth verification process is real — for `drive.file` scope, the verification is lighter than full Drive scopes, but still required before going live. Plan for ~6 weeks for that review with Google. In dev, the OAuth screen will show a warning until verification completes; that's expected.
- **Do NOT use a paste-link folder model.** That was the rejected option B; the locked decision is OAuth. Don't accidentally implement the paste-link version even if it seems simpler — it has security implications (couples sharing folders publicly to make uploads work) that the OAuth flow avoids.
- **Background-job runner choice.** Cloudflare Queues is the locked choice. If the project doesn't have Queues set up yet, build that infrastructure as part of this iteration; subsequent iterations (especially Phase 2 native-app reels render) will reuse it.
- **When you finish, save a result summary at `0009_photo_delivery_result.md`** describing what was built, what was deferred (Dropbox / OneDrive / iCloud), what schema migrations ran, and any gotchas you hit during the Google OAuth verification process.
