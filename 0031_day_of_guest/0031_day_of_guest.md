# Iteration 0031 — Day-of Guest Experience (Live Mode)

**Iteration number:** 0031
**Topic:** The guest-facing live-event surface that activates automatically on the wedding day. The guest's personal landing page (already established in 0002) gains a time-aware mode router that flips through five lifecycle modes, with **LIVE mode** (T-1hr → T+8hr) being this iteration's primary contribution: a six-card surface that tells the guest what's happening now, where their table is, what the live photo wall looks like, what video-guestbook prompt to answer, where they are on the day's schedule, and what the couple/coordinator just announced.
**Surface:** Public guest URL `setnayan.com/{event-slug}` (same URL across all five lifecycle modes — mode is detected, not routed). Couple-facing companion surface lives inside 0021 Couple Dashboard as a "Live event" tab. Coordinator companion surface inherits via the 0019 thread-join permission model.
**URL pattern:** `setnayan.com/{event-slug}` (guest); `setnayan.com/dashboard/[event-id]/live` (couple/coordinator).
**Builds on:** 0000 (auth + event slug routing), 0002 (personal landing page renderer), 0006 (vendor + schedule data), 0007 (schedule segments), 0008 (seating chart + table assignments + venue floor plan PDF), 0012 (Papic photo stream + tag pipeline), 0019 (coordinator-join permission model + chat infrastructure for broadcasts), 0021 (couple dashboard), 0025 (face data + privacy controls), 0028 (email notification fallback).
**Status:** Drafted 2026-05-12.
**Phase:** V1 launch-blocking. The wedding day is the single most important moment in every Setnayan event lifecycle; if the day-of guest surface doesn't ship, the platform's promise collapses to a planning tool. Every other iteration is upstream support for this moment.

---

## 1. Why this iteration exists

A Filipino wedding day is choreographed across 8–10 hours, three to five venues, and 100–300 guests who are mostly meeting each other for the first time. Every guest carries the same three questions in their head all day:

1. **Where am I supposed to be right now?**
2. **Which table am I assigned to, and how do I get there?**
3. **Did I miss anything?**

Today they answer those by asking the nearest cousin, squinting at a paper program, or DMing the bride at 3 PM during her makeup retouch. The Setnayan landing page (0002) already holds the schedule, the seating chart, the venue map, and (via 0012) the photo stream — but in static "this is your invitation" mode. None of it activates when the guest walks through the door.

**This iteration makes the landing page time-aware.** When the guest opens `setnayan.com/{event-slug}` between T-1hr and T+8hr, the page auto-switches to a six-card LIVE surface that answers all three questions at a glance and surfaces real-time signals (current segment, broadcasts, photos tagged with this guest, video-guestbook prompt) the rest of the platform produces.

**It also makes the page offline-survivable.** PH wedding venues — especially provincial barangay churches, mountainside reception sites, and ferry-accessed island weddings — frequently have weak or no cellular signal. A PWA shell + cached schedule + cached table assignment + cached venue map means the guest's most important questions stay answerable even when LTE drops to one bar.

---

## 2. Auto-activation logic (five lifecycle modes)

> **Cross-reference · unified QR lifecycle (2026-05-22):** The five modes below (`coming_soon` / `pre_event` / `live` / `recap` / `archive`) are this iteration's implementation-level state machine for the day-of guest surface. They are the **same URL** as the 3-state cross-iteration framing locked in [0002 § Unified QR Code Lifecycle Model](../0002_qr_invitation_system/0002_qr_invitation_system.md): State 1 Invitation rolls up `coming_soon` + `pre_event` (0002's Phase 1–3) · State 2 Event proper = `live` (this iteration's primary contribution) · State 3 Editorial rolls up `recap` + `archive` (0002's Phase 4). Mode-selection here is the granular state machine; the 3-state lock is the cross-iteration framing. Guest hydration on `live` mode uses the **same `?invite=[guest_token]` query param** as the Invitation state — magic-link cookie set in State 1 carries into State 2 without re-scanning.

The landing page reads `events.event_date`, `events.timezone`, and `NOW()` on every render and selects one of five modes. Mode selection is cached client-side for 60 seconds and recomputed on every navigation. The couple can manually override via `events.live_mode_override`.

| Mode | Time window | What the guest sees | Default state |
|---|---|---|---|
| `coming_soon` | T > -7d (more than 7 days out) | Save-the-date video, RSVP CTA, schedule preview, dress code, registry link | RSVP-driven invitation surface (0002 existing) |
| `pre_event` | T-7d to T-1hr | Schedule, venue map, parking, dress code, getting-there tips, last-mile directions | Logistics-focused; "what to bring" checklist if couple opted in |
| **`live`** | **T-1hr to T+8hr** | **Six-card LIVE surface (this iteration's contribution)** | **Real-time mode; photo wall + broadcasts + current segment** |
| `recap` | T+8hr to T+30d | Photo gallery, video reels, video-guestbook playback, thank-you notes from couple | Post-event celebration surface |
| `archive` | T+30d+ | Read-only photo album access (originals follow 30-day post-download compression rule) | Long-tail access to memories |

**Boundary precision:**

- All boundaries computed in the event's timezone (stored on `events.timezone`), not the guest's device timezone. A guest checking the page from Singapore en route to a Tagaytay wedding sees the same mode their cousin already at the venue sees.
- The T-1hr boundary refers to `events.event_date + events.ceremony_start_time` (the ceremony, not the reception). If the wedding has no ceremony (rare — vow renewal, civil-only, etc.), the boundary anchors to the earliest segment in `event_schedule_segments`.
- The T+8hr boundary is the simplest robust default that covers Filipino reception timing patterns. Couples with longer celebrations (debutante-style 12-hour reception, multi-day Bicolano weddings) can extend via the override.
- A 5-minute grace period on either side of the T-1hr and T+8hr boundaries prevents the surface from flickering between modes during the precise transition minute.

**Manual override (couple-controlled, in 0021):**

- `live_mode_override = 'live'` — couple flips to LIVE early (e.g., for a morning-of prep livestream to bridal-party guests)
- `live_mode_override = 'pre_event'` — couple holds the page in pre-event mode past T-1hr (e.g., ceremony delayed by traffic)
- `live_mode_override = 'recap'` — couple flips to recap early (e.g., reception ends at hour 6 of 8)
- `live_mode_override = NULL` — auto-mode (default)

The override is intentionally a single enum field, not per-section flags — keep the contract simple. Couples who want fine-grained control compose multiple events.

---

## 3. LIVE mode surfaces (six cards)

The LIVE page is a single vertical scroll on mobile (thumb-zone primary actions per memory rule) and a two-column grid on tablet+. The six cards render in this order; each is responsible for one of the three guest questions or for connecting the guest to the couple's real-time signals.

### 3.1 "What's happening now" card (top, hero)

Anchored to the top of the scroll. Largest card. Answers question 1 ("where am I supposed to be right now?").

**Content:**
- **Current segment title + time + location.** Pulled from `event_schedule_segments` where `status = 'active'`. Example: *"Ceremony · 4:00 PM · St. Joseph Cathedral, Tagaytay"*.
- **Countdown timer to next segment.** Computed live every second. Reads "*Reception begins in 1h 47m*" or "*Cocktails begin in 12 minutes*" or "*Final toast in 5 minutes*".
- **Optional couple location pin** (opt-in by couple per event in 0021; `events.live_location_shared`). When ON, a discreet map preview shows the couple's last-reported lat/lon (refreshed every 5 min while sharing is active). Used most often when the couple is in transit between venues and guests want to know when to head to the reception. **Default OFF** — privacy-first.
- **Banner state when no segment is active.** Between segments (e.g., reception break), the card surfaces "*Up next: First dance · in 8 minutes*" instead of leaving the guest staring at a blank state.

**Interactions:**
- Tap title → expands an inline detail sheet with the segment's full description, dress code reminder if differing, and a "Get directions" deep link to the venue address (opens Apple/Google Maps native).
- Tap "Up next" → scrolls to card 5 (live schedule).
- Long-press the countdown → reveals "*Couple's local time: 4:13 PM PHT*" for guests joining from abroad.

### 3.2 "Your table" card

Answers question 2 ("which table am I assigned to and how do I get there?").

**Content:**
- **Big table number.** Single number, ~64pt typography. Example: *"Table 7"*.
- **Mini floor-plan thumbnail.** A 320×200 rasterized preview of the published seating chart (from 0008), with the guest's table highlighted in the Setnayan terracotta accent and a small star marking the guest's exact seat. Pre-rendered server-side on publish, cached in the PWA shell.
- **Natural-language directions.** Generated from the seating chart's coordinate system + venue floor plan: *"Enter through the main door, walk straight past the dance floor, your table is on the right side, 3rd row."* The 0008 floor plan already has stage / band / dancefloor / doors as first-class elements — the direction generator walks the shortest visual path from the main entrance to the guest's seat and translates the bends into Filipino-natural directions.
- **Tablemates strip** (optional, opt-in by guest in 0025). Avatars of the other guests at the table — surfaces who the guest is sitting with so they can find their friend before sitting down. Respects per-guest `photo_consent`; guests who opted out show as initials only.

**Interactions:**
- Tap thumbnail → opens the full venue floor-plan PDF (0008's print-pack output) in a native PDF viewer. Cached offline; renders without signal.
- Tap a tablemate avatar → opens that guest's public profile card (name + role + RSVP'd status only — no contact info exposed).
- "Find me on the chart" button → on tablet+, fits the floor plan to the screen and animates a pulse on the guest's seat.

### 3.3 "Live photo wall" card

Surfaces the Papic stream (0012) filtered to photos tagged with this guest.

**Content:**
- **Stream of recently-tagged photos.** Default view = "Photos of me" (where `photo_tags.guest_id = this_guest`). Toggle to "All photos" if the couple opted into making the global stream visible to guests (see `events.live_photo_wall_visibility`).
- **Auto-refresh.** Supabase Realtime channel `event:{event_id}:photos` pushes new photo IDs to the client; client fetches signed URL and prepends to the grid. Fallback: 30-second polling if Realtime drops.
- **Each photo card shows:** photo thumbnail, tagged-at time, source badge (📸 from a paparazzo / 🤳 from another guest's camera / ✨ auto-face match), "Save to my reel" + "Share" + "Hide from my view" actions.

**Interactions:**
- Tap photo → fullscreen lightbox with pinch-to-zoom (mobile) or arrow-key navigation (desktop).
- **"Save to my reel"** → adds the photo to the guest's Personal Reel selection set (consumed by the Personal Reel builder in 0012's recap flow). Cap is 5 guest picks per reel — UI surfaces "*4 of 5 picks used*" once approaching cap.
- **"Hide from my view"** → guest-side soft hide (does NOT affect the couple's gallery; this is per-guest UI state only). Stored in `guest_photo_hides`.
- **"Share"** → opens native share sheet with a watermarked download (geo stripped per the apparatus rule).
- **Long-press photo** → "Report this photo" → routes to couple-side moderation queue in 0021.

### 3.4 "Video guestbook" card

Per the existing decision in CLAUDE.md (2026-05-09 — *"Voice/video guestbook is part of Wedding Challenges, not a standalone iteration"*), this card is the day-of surface for the wedding-challenges guestbook prompt.

**Content:**
- **Rotating prompt.** Pulled from the couple's pre-configured prompts list (defined upstream in the Wedding Challenges iteration when it lands; for 0031 V1 we ship a default prompt set of 8 prompts the couple can edit). Examples:
  - "Share your favorite memory of {couple_first_names}."
  - "Give them your wishes for the next 10 years."
  - "Tell us a secret about the bride."
  - "Tell us a secret about the groom."
  - "What's the most {couple_first_name} thing you've ever seen them do?"
  - "Drop your best dating advice (we'll need it)."
  - "Sing 4 bars of any song."
  - "Wedding-day weather forecast for {wedding_date} a year from now."
- **Record button.** Tap → opens in-app camera with 60-second hard cap timer.
- **Visible counters.** "*X messages sent so far*" — shows the live count of submitted entries across all guests, encourages participation.

**Interactions:**
- Tap **Record** → camera + mic permission prompt → 60-second countdown overlay → tap-to-stop or auto-stop at 60s.
- Tap **Submit** → uploads to `video_guestbook_entries` with `status='pending'`. Couple's gallery in 0021 surfaces the queue for review before public playback.
- Tap **Re-record** before submit → discards the take, no upload.
- **24-hour withdrawal window.** After submit, the guest sees a "*Recorded — you can delete this until {timestamp 24hr out}*" pill. Tap to revoke (sets `user_deleted_at`).
- Tap **Skip for now** → card collapses; reappears on next visit with a new prompt.

**Recording technical notes:**
- iOS: `getUserMedia` with `facingMode='user'`, MediaRecorder API, H.264 1080p portrait, ≤ 60s.
- Android: same WebRTC stack, VP9 fallback if H.264 isn't available.
- Recording stays in IndexedDB until upload completes (background sync handles offline-recorded entries).

### 3.5 "Live schedule" card

Vertical timeline of all event segments for the day. Answers question 3 ("did I miss anything?") and orients the guest to the rest of the program.

**Content:**
- **Vertical list of all segments**, oldest first. Each segment shows: time, title, location, status pill.
- **Status visual encoding:**
  - `completed` segments dimmed to 50% opacity with a check-mark prefix.
  - `active` segment highlighted with the Setnayan terracotta accent and a live "now" badge.
  - `upcoming` segments rendered in normal weight.
  - `cancelled` segments struck-through with a one-line reason if the couple/coordinator provided one.
- **Real-time updates.** As the couple's coordinator marks segments active/complete in 0021 (or 0022 vendor dashboard for the day-of coordinator), the timeline updates live via Realtime channel `event:{event_id}:schedule`.
- **Dress code chips** per segment if specified (e.g., ceremony = formal Filipiniana / reception = cocktail).

**Interactions:**
- Tap any segment → inline detail sheet (description, location with map deep link, dress code, who's invited if the segment is restricted — e.g., principal sponsors photo call).
- Long-press an active segment → "Set a reminder for this segment's end" → schedules a local notification 5 minutes before the projected end time.
- Pull-to-refresh on mobile → forces a re-sync of segment statuses (useful when guest just regained signal).

### 3.6 "Coordinator broadcast" card (conditional)

Only renders when there's an active broadcast within its `expires_at` window. Otherwise the card slot is empty (the layout collapses).

**Content:**
- **Broadcast text.** Plain-text announcement, max 280 characters. Examples:
  - *"The ceremony is starting in 5 minutes — please take your seats."*
  - *"Reception buffet is now open. Sponsors and family head tables first, please."*
  - *"Last call for the bouquet toss in the main hall."*
- **Sender + timestamp.** "*From: Aira & Boy (couple) · 2 minutes ago*" or "*From: Coordinator Marichu · just now*".
- **Audience pill.** Most broadcasts are `audience='all'`; some are scoped (e.g., principal sponsors only). The guest only sees broadcasts targeted to them.

**Interactions:**
- Auto-dismiss when `expires_at` passes (default 2 hours from send).
- Tap **Got it** → guest-side acknowledgment (writes to `broadcast_acknowledgments`); helps the couple/coordinator confirm reach.
- Tap **Mute broadcasts from this couple** → suppresses future broadcasts on this device only (privacy-respecting, doesn't leak the mute back to the couple).

**Broadcast delivery:**
- Composed in 0021 by the couple OR by any user with a `thread_join_authorizations` row on the wedding's coordinator-class threads (per 0019's coordinator-join model — the coordinator surfaces this iteration are inherited, not re-specced).
- Pushed via Supabase Realtime channel `event:{event_id}:broadcasts` to all currently-open guest sessions in <500ms.
- Also delivered via PWA push notification (if guest opted in) and email fallback (per 0028) for guests who haven't opened the page yet.

---

## 4. Offline-first PWA shell

Filipino wedding venues frequently have weak or no cellular signal. The day-of surface must boot, render, and answer the guest's three core questions even when the network is dead.

### 4.1 Service worker caching strategy

**Precached on first visit (static shell):**
- HTML application shell (index document, no event-specific data)
- CSS bundle (theme + layout)
- JS bundle (route handlers + offline-mode fallback components)
- Lucide icon sprite
- Setnayan symbol mark + logo SVGs
- Fonts (Cormorant Garamond subset + Manrope subset)

**Cached on first navigation to a specific event (event-specific shell):**
- The event's published schedule (`event_schedule_segments` snapshot at last sync)
- The guest's table assignment + tablemate roster
- The venue floor-plan PDF (signed-URL fetch on first visit, then cached for 24 hours)
- The dress code copy + getting-there tips
- The couple's last-uploaded save-the-date video (lo-res transcoded version, ~5 MB)
- The latest 20 photos from the live photo wall (only the guest's tagged photos)

**Cache invalidation:**
- Stale-while-revalidate for the schedule + table assignment (serves cached, fetches in background, swaps in if changed).
- Network-first for broadcasts + new photos + segment status changes (the live signals — but with cached fallback if offline).
- 30-day expiration on the venue floor plan; refreshed if seating chart re-publishes (cache key includes `seating_charts.publish_version`).

### 4.2 Offline degradation behavior

| Surface | Online | Offline |
|---|---|---|
| What's happening now | Live segment + countdown | Last-known active segment from cache + "*Last updated {timestamp}*" |
| Your table | Live data | Cached table number + cached floor plan + cached directions |
| Live photo wall | Real-time stream | Cached last 20 photos + "*You're offline — new photos will appear when you reconnect*" banner |
| Video guestbook | Record + submit | Record + queue locally; "*Will submit when you reconnect*" banner |
| Live schedule | Real-time segment statuses | Last-synced segment statuses + "*Schedule may be out of date*" pill |
| Coordinator broadcast | Live | Last-cached broadcast (with timestamp); new broadcasts deliver via push when reconnected |

### 4.3 PWA install affordance

- **Web App Manifest** declared on first visit. Sets `display: standalone`, theme color = Setnayan terracotta (`#C97B4B`), icons (192×192 + 512×512 derived from the Setnayan symbol mark + the couple's monogram if Custom Monogram Pack owned).
- **"Add to Home Screen" prompt** triggered on the second visit (not first — first visit is the RSVP path and we don't want to interrupt). Custom UI prompt that explains "*Save the wedding to your home screen — works even when there's no signal at the venue.*"
- **Installed PWA name** = the couple's display name + "wedding" suffix. Example app icon label on the guest's home screen: *"Aira & Boy"*.

### 4.4 Background sync

- **Queued video-guestbook submissions** upload when connectivity returns. Uses the Background Sync API where supported (Chrome/Android); falls back to "submit on next foreground" for iOS Safari.
- **Queued broadcast acknowledgments** flush on reconnect.
- **Queued "Save to my reel" picks** flush on reconnect; conflict resolution = last-write-wins (extremely unlikely the same guest hits the 5-pick cap from two devices simultaneously).

### 4.5 Failure surfaces (the page must never look broken)

- If the service worker fails to install (Safari quirk, storage quota exceeded), the page degrades to normal-online behavior — no functionality lost, just no offline guarantee. The guest never sees a stack trace or a white screen.
- If the cache is empty on first offline access (the guest opened the URL for the first time at the venue), the page renders a friendly "*We're trying to reach the wedding... move closer to the venue or try the WiFi network 'AiraAndBoy2026'.*" Couples can configure the network hint in 0021.

---

## 5. Privacy and consent

The day-of surface produces guest-attributable data (photos tagged with them, video-guestbook submissions, broadcast-acknowledgment receipts). RA 10173 + the existing Setnayan Privacy & Security Policy bound how each is handled.

### 5.1 Tag-consent handshake

Per the existing 2026-05-09 decision in CLAUDE.md, peer guest-to-guest tagging is QR-scan only, with a tag-once trust handshake. This iteration inherits that contract — no broader tagging affordances are introduced. A guest's appearance on the live photo wall reflects the tag-consent state already established upstream.

### 5.2 Photo wall opt-out

- Per-guest `photo_consent` toggle (existing field on `guests`). When OFF, photos tagged with that guest are NOT shown on their own photo wall card AND not shown on the couple's "Photos of {guest}" view.
- Face-blur on opt-out: when a guest has `photo_consent=false`, photos containing their auto-face-matched face are blurred in those specific regions before serving to other guests' photo walls (the couple's master gallery retains the original).
- "Hide from my view" per-photo action is a softer affordance — hides from the guest's own LIVE wall without affecting any other surface.

### 5.3 Video guestbook consent + withdrawal

- Recording action requires explicit camera + mic permission grant per-session.
- 24-hour withdrawal window: after submit, the guest can delete their own entry within 24 hours by setting `user_deleted_at`. The R2 object is purged within 24 hours of the deletion (compliance with RA 10173 § 16(e) right-to-erasure).
- Couples can also reject entries (`status='rejected'`) — rejected entries are NOT shown in recap mode and the R2 object is purged within 7 days.

### 5.4 Couple live-location sharing

- **Default OFF.** Couple toggles ON in 0021 when they want guests to see their transit (e.g., bridal car en route to reception).
- When ON, the couple's device posts location to `events.couple_live_lat / couple_live_lon / couple_live_updated_at` every 5 minutes (limited cadence — not real-time tracking).
- Auto-OFF at T+8hr or when the couple manually toggles off.
- Location precision rounded to ~50m to avoid revealing exact GPS coordinates.

### 5.5 Broadcast targeting + privacy

- Broadcasts can be scoped (`audience` enum: `all`, `table`, `principal_sponsors`, `entourage`, `custom`). Guests outside the audience never see the broadcast — it never reaches their channel.
- Broadcast acknowledgments are visible to the couple/coordinator (sum: "*120 of 145 acknowledged*") but never as a per-guest breakdown — preserves consent that the guest's attention isn't individually tracked.

### 5.6 RA 10173 surfaces inherited from 0025

- "Delete my face data" → revokes within next 5-min refresh (per existing face-detection decision).
- "Export my event data" → produces a ZIP of all guest-attributable data (RSVP form, photo tags, video-guestbook submissions, broadcast ack history).
- "Delete my account" (soft + hard) per 0025 surfaces the same revocation path.

---

## 6. Schema

```sql
-- Couple-configured / coordinator-pushed broadcasts during the event window.
CREATE TABLE event_broadcasts (
  broadcast_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  sent_by_user_id  UUID NOT NULL REFERENCES users(user_id),
  message_text     TEXT NOT NULL CHECK (char_length(message_text) <= 280),
  scheduled_for    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  audience         TEXT NOT NULL DEFAULT 'all'
                   CHECK (audience IN ('all','table','principal_sponsors','entourage','custom')),
  audience_targets JSONB,  -- when audience != 'all', specific table_ids or guest_ids
  delivered_count  INT NOT NULL DEFAULT 0,
  ack_count        INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX event_broadcasts_event_window_idx
  ON event_broadcasts (event_id, scheduled_for, expires_at);

-- Per-guest receipt that a broadcast was acknowledged. Aggregate only — never displayed per-guest.
CREATE TABLE broadcast_acknowledgments (
  broadcast_id  UUID NOT NULL REFERENCES event_broadcasts(broadcast_id) ON DELETE CASCADE,
  guest_id      UUID REFERENCES guests(guest_id),
  user_id       UUID REFERENCES users(user_id),
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (broadcast_id, COALESCE(guest_id, user_id))
);

-- Video guestbook submissions (the wedding-day guestbook surface).
CREATE TABLE video_guestbook_entries (
  entry_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  guest_id          UUID REFERENCES guests(guest_id),  -- nullable for non-RSVP'd walk-ins
  user_id           UUID REFERENCES users(user_id),
  prompt_text       TEXT,  -- snapshot of the prompt the guest answered
  video_r2_key      TEXT NOT NULL,
  duration_sec      INT NOT NULL CHECK (duration_sec BETWEEN 1 AND 60),
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','user_deleted')),
  submitted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by_couple_at TIMESTAMPTZ,
  reviewed_by_user_id   UUID REFERENCES users(user_id),
  user_deleted_at   TIMESTAMPTZ,  -- 24-hr withdrawal window
  r2_purged_at      TIMESTAMPTZ
);
CREATE INDEX video_guestbook_event_status_idx
  ON video_guestbook_entries (event_id, status, submitted_at DESC);

-- Per-guest "hide from my view" state on the live photo wall.
CREATE TABLE guest_photo_hides (
  guest_id   UUID NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  photo_id   UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
  hidden_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guest_id, photo_id)
);

-- Mode override + couple live-location + photo wall visibility on events.
ALTER TABLE events
  ADD COLUMN live_mode_override TEXT
    CHECK (live_mode_override IN ('coming_soon','pre_event','live','recap','archive')),
  ADD COLUMN live_location_shared     BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN couple_live_lat          NUMERIC(9,6),
  ADD COLUMN couple_live_lon          NUMERIC(9,6),
  ADD COLUMN couple_live_updated_at   TIMESTAMPTZ,
  ADD COLUMN live_photo_wall_visibility TEXT NOT NULL DEFAULT 'tagged_only'
    CHECK (live_photo_wall_visibility IN ('tagged_only','all_with_consent','off')),
  ADD COLUMN venue_wifi_hint          TEXT,        -- shown on offline failure
  ADD COLUMN rehearsal_mode_until     TIMESTAMPTZ; -- non-null = rehearsal banner active

-- Segment lifecycle tracking. Used by both the couple/coordinator (write) and
-- the guest live schedule card (read).
ALTER TABLE event_schedule_segments
  ADD COLUMN status              TEXT NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming','active','completed','cancelled')),
  ADD COLUMN actual_started_at   TIMESTAMPTZ,
  ADD COLUMN actual_ended_at     TIMESTAMPTZ,
  ADD COLUMN cancellation_reason TEXT;

-- Default video-guestbook prompts the couple can edit. Eight V1 defaults.
CREATE TABLE event_guestbook_prompts (
  prompt_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX event_guestbook_prompts_event_order_idx
  ON event_guestbook_prompts (event_id, active, display_order);
```

**RLS policies:**

- `event_broadcasts`: read allowed if requesting user is an `event_members` row on the broadcast's event AND the user's role intersects the broadcast's `audience` set. Write allowed only for `member_type='couple'` OR `member_type='coordinator'` with an active `thread_join_authorizations` row on a coordinator-class thread.
- `video_guestbook_entries`: read allowed for the submitting user (their own entries always) + couple members of the event (queue moderation). Write requires guest authentication or anonymous guest QR session.
- `event_schedule_segments` status writes: couple OR coordinator on the event only.
- `events` live-mode override + live-location columns: couple only.

---

## 7. UI surfaces (guest + couple + coordinator views)

### 7.1 Guest live page

`setnayan.com/{event-slug}` — the same URL used in 0002 invitation rendering, with the mode router deciding which sub-template renders.

**Layout (mobile, primary surface):**
- Single vertical scroll. Six cards in the order specified in section 3.
- Persistent top bar (60pt height): couple name, current mode pill ("LIVE"), connection status dot (green online / amber slow / red offline).
- Persistent bottom action bar (thumb-zone): three primary actions — *Schedule* (scrolls to card 5), *My table* (scrolls to card 2), *Photos* (scrolls to card 3).

**Layout (tablet+ / desktop):**
- Two-column grid. Left column = cards 1, 2, 6 (the orientation cards). Right column = cards 3, 4, 5 (the activity cards).
- Top bar identical to mobile but expanded.

**Hard navigation rules:**
- The page is single-route. No nested routes inside the LIVE surface — cards expand inline, never push a new history entry. Browser back from the LIVE page exits the wedding entirely (back to `setnayan.com` marketing site).
- All inline detail sheets dismiss on outside-tap or swipe-down (mobile).

### 7.2 Couple "Live event" surface (inside 0021)

`setnayan.com/dashboard/[event-id]/live` — a new tab in the couple dashboard, visible only when `events.live_mode_override = 'live'` OR auto-mode resolves to `live` OR within 7 days post-event (so couples can review post-event).

**Panes:**
- **Broadcast composer** — text field (280 char), audience picker, send button. Recently-sent broadcasts list with delivered + ack counts.
- **Segment control** — vertical timeline matching the guest live-schedule card; couple taps a segment to mark `active` / `completed` / `cancelled`. Each action requires a tap-and-hold confirm to prevent fat-finger mistakes during the event.
- **Photo wall monitor** — same stream the guest sees, with moderation actions (hide from public wall, surface to couple's review queue, feature on the venue projector if 0011 Live Stream's projector cast is owned).
- **Guestbook queue** — pending entries with approve/reject actions. Default state on approval = visible in recap mode.
- **Live-location toggle** — single switch with last-update timestamp.
- **Mode override picker** — five radio options (coming_soon, pre_event, live, recap, archive, auto).

### 7.3 Coordinator view

Per the 0019 coordinator-join model: a coordinator who has been granted `thread_join_authorizations` on a "Day-of coordination" thread on this event inherits **read + broadcast** permission on the LIVE surface (but NOT segment-write or mode-override authority — those stay couple-only by default).

**Coordinator-specific affordances:**
- The broadcast composer is identical to the couple's, but every coordinator-sent broadcast is logged with `sent_by_user_id` = the coordinator's user ID for the couple's later audit.
- Couples can optionally grant segment-write authority via a per-coordinator toggle in 0021 ("Let this coordinator mark segments active/complete"). Off by default; turned on for paid day-of coordinators who are actively running the show.

---

## 8. Notifications (push + email)

### 8.1 Push (PWA web push)

- Permission prompt deferred to the second visit, never on first visit (consistent with 0019 + 0028 push patterns).
- Subscribed topics per guest:
  - `event:{event_id}:broadcasts` — every broadcast targeted to this guest
  - `event:{event_id}:segment_milestones` — "Ceremony starting in 30 minutes" + "Reception begins now" + similar pre-configured beats
  - `event:{event_id}:my_photos` — when a new photo is tagged with this guest (rate-limited to 1 notification per 15 minutes; bundles "X new photos of you")
- Per-event opt-out via the settings sheet in the top bar.

### 8.2 Email fallback (per 0028)

When a guest hasn't opened the page in the last 30 minutes during the LIVE window, key milestones fall back to email:

- `pre_event_24h_reminder` — sent at T-24hr ("Your wedding is tomorrow. Here's the link, your table, the dress code, and how to get there.")
- `pre_event_1h_reminder` — sent at T-1hr ("The ceremony starts in 1 hour. Live updates: {link}")
- `post_event_recap_ready` — sent at T+8hr ("The wedding is wrapping up. Your tagged photos are ready: {link}")
- Broadcasts marked `audience='all'` and `priority='urgent'` (a future couple-toggle, default unused in V1) — for "ceremony delayed by 2 hours" class messages.

### 8.3 Schedule-milestone push pre-computation

Schedule-milestone pushes are pre-computed when the couple publishes/updates the schedule:

- For each `event_schedule_segments` row, schedule a push at `start_time - 30 min` and another at `start_time - 5 min`.
- Schema-side: a `scheduled_notifications` table (already present in 0028) holds the queue. When a segment is `cancelled`, scheduled pushes for that segment are revoked.

---

## 9. Wedding-day rehearsal mode

Couples need to test the LIVE surface before the actual day — see exactly what guests will see, verify the schedule layout, send test broadcasts, double-check table assignments are wired correctly.

**Activation:**
- Couple flips `events.rehearsal_mode_until = NOW() + INTERVAL '3 days'` from 0021 ("Run a rehearsal").
- All guest pages render the LIVE surface as if it were the wedding day, regardless of actual `event_date`.

**Differences from real LIVE mode:**
- Persistent banner at the top: *"⚙ Rehearsal mode — this is what guests will see on the wedding day. Test broadcasts, schedule changes, and table layouts."*
- All broadcasts sent during rehearsal mode are flagged `rehearsal=true` and delivered only to the couple's own devices + any explicitly invited test accounts — **never** to real guests.
- Push notifications suppressed for all but the couple's test devices.
- Email fallback suppressed entirely during rehearsal mode.
- Video-guestbook submissions during rehearsal land with `status='rehearsal'` and are purged at the end of the rehearsal window.

**Auto-exit:**
- `rehearsal_mode_until` is a TIMESTAMPTZ that auto-clears when it passes. Couples can manually exit earlier ("End rehearsal").
- The 3-day default prevents a forgotten rehearsal mode from suppressing the real wedding-day broadcasts.

---

## 10. Composition with 0002 / 0008 / 0012 / 0019 / 0021 / 0028

| Upstream | What this iteration consumes |
|---|---|
| **0002 Personal QR Invitation System** | The guest URL `setnayan.com/{event-slug}` and the underlying personal-page renderer. This iteration adds the LIVE mode template; the URL contract is unchanged. |
| **0008 Seating Chart Editor** | The guest's table assignment, the rasterized floor-plan thumbnail (pre-rendered on publish), the venue floor-plan PDF, and the coordinate system used by the direction generator. |
| **0012 Papic** | The photo stream (`photos` + `photo_tags`), Realtime channel `event:{event_id}:photos`, the "Save to my reel" target (Personal Reel selection set), the moderation surface, and the watermark + geo-strip-on-share logic. |
| **0019 Communications** | The coordinator-join permission model (`thread_join_authorizations`). The LIVE surface inherits the coordinator's broadcast permission from a coordinator-class thread on the event. |
| **0021 Couple Dashboard** | The companion "Live event" tab and its broadcast composer, segment control, photo wall monitor, guestbook queue. |
| **0028 Email Notifications** | The fallback channel for milestone emails when the guest hasn't opened the page recently. |
| **0025 Profile Settings** | The face-data-revocation, account-deletion, and marketing-consent surfaces are inherited; this iteration adds no new privacy controls beyond the per-event opt-outs surfaced inline. |

| Downstream (provided) | What this iteration produces |
|---|---|
| **Personal Reel builder (0012 recap path)** | The "Save to my reel" pick set, populated during the LIVE window. |
| **Couple gallery (0021)** | Video-guestbook entries (post-approval). |
| **Coordinator audit log** | Broadcast send records with attribution. |
| **Future Wedding Challenges iteration** | The video-guestbook surface (this iteration is the day-of host; the upstream iteration owns the challenge framework). |

---

## 11. Performance budgets

The LIVE page is loaded under the worst conditions on the platform: a guest at a barangay church with 1-bar LTE, on a mid-tier Android device they bought in 2022, balancing a glass of wine in their other hand. Performance is non-negotiable.

| Metric | Budget | Why |
|---|---|---|
| Time to Interactive (TTI), warm cache, 3G | < 1.0s | Guest opens the link mid-conversation; if it doesn't render in a second they put their phone back in their pocket and miss the broadcast. |
| Time to Interactive (TTI), cold cache, 3G | < 3.0s | First visit at venue. The PWA shell pre-loads at RSVP; first-time-at-venue is rare but covered. |
| Largest Contentful Paint (LCP) | < 1.5s | The hero "What's happening now" card. |
| First Input Delay (FID) | < 100ms | Tapping any card must respond immediately. |
| Cumulative Layout Shift (CLS) | < 0.05 | Photo wall lazy-load must not push the hero card off-screen. |
| Photo wall scroll FPS | ≥ 50fps | Smooth scroll on 60 cached photos. |
| Realtime broadcast delivery (p50) | < 500ms | From "send" tap to all-guests received. |
| Realtime broadcast delivery (p99) | < 2.0s | Tail latency on weak signal. |
| Offline boot from cache | < 1.5s | No network. |
| Service worker install (first visit) | < 5.0s | Acceptable initial cost for the offline guarantee. |
| Memory footprint (mid-tier Android) | < 80 MB | Headroom for the camera (video guestbook). |
| JavaScript bundle (compressed) | < 120 KB | Critical-path JS only; everything else lazy-loaded. |

**CI perf budget enforcement:** Lighthouse CI runs against a throttled 4G profile on every PR touching the LIVE-mode codepath. Budget regressions block merge per the 0019 pattern.

---

## 12. Acceptance tests

1. **Mode auto-switch on T-1hr.** At T-1hr-30s, the page is in `pre_event`; at T-1hr+30s, the page is in `live` — without a manual reload.
2. **Mode auto-switch on T+8hr.** Symmetric: at T+8hr-30s the page is `live`; at T+8hr+30s it is `recap`.
3. **Manual override beats auto-mode.** With `live_mode_override='live'` set, the page renders LIVE at T-2 days regardless of `event_date`.
4. **Schedule segment status update propagates in <2s.** Couple taps "Mark active" on segment 3 in 0021; all open guest pages update card 1 and card 5 within 2 seconds.
5. **Broadcast delivers to all subscribed guests.** Couple sends `audience='all'` broadcast; 100 connected test guests all render the broadcast card within 2 seconds at p99.
6. **Broadcast scoped to audience never reaches outside audience.** `audience='principal_sponsors'` broadcast does NOT appear on guest accounts who aren't in the principal-sponsors role.
7. **Photo wall updates in real time.** A new photo tagged with the test guest appears on their LIVE photo wall card within 30 seconds, without a manual reload.
8. **Photo wall respects opt-out.** Guest with `photo_consent=false` sees no photos on their LIVE wall AND their face is blurred on other guests' walls.
9. **Video-guestbook submission cap.** Recording stops at exactly 60 seconds; submit button disabled past cap.
10. **Video-guestbook 24-hour withdrawal.** Within 24 hours of submit, guest deletes the entry; the R2 object is purged within 24 hours of deletion (queue-driven, not synchronous).
11. **Couple location toggle off → no location shown.** With `live_location_shared=false`, the LIVE hero card never renders the location pin even if the couple's lat/lon fields are populated.
12. **Offline boot from cache.** With network disabled (DevTools offline mode), the page boots in under 1.5s and renders cards 1, 2, 5 from cache with their last-synced data.
13. **Offline video-guestbook submission queues.** Recording made offline writes to IndexedDB; when connectivity returns, the upload completes and the entry appears in the couple's queue.
14. **PWA install prompt appears on second visit.** First visit: no prompt. Second visit (cookie set on first visit): "Add to home screen" prompt renders.
15. **Rehearsal mode banner suppresses real broadcasts.** With `rehearsal_mode_until=NOW()+1d`, a broadcast sent by the couple is flagged `rehearsal=true` and is NOT delivered to real guest accounts.
16. **Coordinator-join inherits broadcast permission.** A coordinator with a `thread_join_authorizations` row on the event's day-of-coordination thread can send a broadcast; one without such a row cannot.
17. **Segment-write authority off by default for coordinators.** Without explicit toggle in 0021, the coordinator cannot mark a segment active/completed.
18. **Mode boundary precision in event timezone.** Page mode for a Tagaytay wedding viewed from a Singapore IP correctly reflects PHT (event timezone), not the viewer's local time.
19. **Network-loss banner appears on Realtime drop.** Killing the Realtime websocket surfaces "*You're offline*" banner within 5 seconds; reconnecting clears it.
20. **Email fallback fires on milestone when page closed.** Guest who hasn't loaded the page in 30 minutes receives the T-1hr email reminder at T-1hr.

---

## 13. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | **Five lifecycle modes, single URL.** The guest landing page detects mode from time, not from a path segment. URLs never change across lifecycle. | One URL for the guest to remember (and to print on the QR-bearing place cards from 0008). Mode changes are invisible — the page just becomes more relevant on the right day. |
| 2026-05-12 | **LIVE window is T-1hr to T+8hr, in event timezone.** The 5-minute grace zones on either boundary prevent flicker. | T-1hr is when guests are arriving / getting seated; T+8hr is a sufficient default for the longest reception patterns in PH practice. Override available for outliers. |
| 2026-05-12 | **Six LIVE cards, fixed order, single-scroll mobile layout.** No tab navigation, no nested routes. | A scroll on the wedding day must be a thumbs-and-eyes-only experience. Tabs add cognitive cost and break the "I just want to see what's next" reflex. |
| 2026-05-12 | **Couple live-location sharing default OFF.** | Privacy-first by default. Couples opt in explicitly when transit visibility matters; otherwise their location stays private. |
| 2026-05-12 | **Coordinator gets broadcast permission for free, segment-write authority by opt-in.** | Broadcasts are recoverable (couple sees the audit log); segment-write changes are higher-stakes (a wrong "completed" mark disorients the whole guest list). Couples grant segment-write only to coordinators they trust to run the show. |
| 2026-05-12 | **Video-guestbook 60-second hard cap, 24-hour withdrawal.** | Cap matches what couples actually consume during the recap reel. Withdrawal window respects guest second-guessing without being indefinite. |
| 2026-05-12 | **PWA install prompt deferred to second visit.** | First visit is the RSVP/save-the-date path; interrupting with an install prompt is hostile. Second visit is "I'm thinking about the wedding again" — the right moment to ask. |
| 2026-05-12 | **Schedule milestone pushes pre-computed at publish, not run-time.** | Run-time computation of "what segments need a 30-min push?" is fragile when network drops; pre-computed entries in `scheduled_notifications` are durable and revocable. |
| 2026-05-12 | **Rehearsal mode auto-clears at 3 days.** | Defensive default. A couple who forgets to exit rehearsal mode does not lose their real wedding-day broadcasts. |
| 2026-05-12 | **All five-mode logic lives in the renderer, not in storage.** Mode is computed from `event_date + timezone + override + NOW()` on each request; no `current_mode` column. | Single source of truth. Migrations don't need to backfill, and the mode is always correct relative to the request's clock. The override is the only stored state. |
| 2026-05-12 | **Live photo wall defaults to "tagged_only," with optional all-with-consent.** | Default keeps each guest's wall focused on photos that include them. Couples can flip to "all_with_consent" for a shared social experience (the global feed becomes visible to every guest, respecting per-photo consent). "Off" is available for the highest-privacy weddings. |
| 2026-05-12 | **Direction generator output is natural-language, not turn-by-turn.** | Filipino reception spaces are too small (and too non-orthogonal) for "turn left at 3.2 meters" to make sense. A single 12-word sentence ("Walk past the dance floor, your table is on the right side") is faster to parse and easier to follow without looking down. |
| 2026-05-12 | **Broadcast acknowledgments are aggregate-only, never per-guest.** | Couples want to know "did the message land?" not "did Cousin Janelle in particular read it?" Aggregate counts answer the practical question without creating a guest-surveillance affordance. |

---

## 14. Companion documents

- **Setnayan Privacy & Security Policy** (`Setnayan_Privacy_and_Security_Policy.md`) — guest data scope, retention, RA 10173 surfaces.
- **0002 QR Invitation System spec** — personal landing page renderer this iteration extends.
- **0008 Seating Chart Editor spec** — table assignments, floor plan rasterization, direction-generator coordinate system.
- **0012 Papic spec** — photo stream + Realtime channel + Personal Reel selection set.
- **0019 Communications spec** — coordinator-join permission model.
- **0021 Couple Dashboard spec** — companion "Live event" tab housed in the couple surface.
- **0025 Profile Settings spec** — face data, account deletion, marketing-consent surfaces.
- **0028 Email Notifications spec** — milestone email fallback templates.
- **CLAUDE.md** — pricing rules, free-use stance on day-of guest features, decisions referenced inline.
